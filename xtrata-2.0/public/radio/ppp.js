var gw = Object.defineProperty;
var yw = (t, e, n) => e in t ? gw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var fo = (t, e, n) => yw(t, typeof e != "symbol" ? e + "" : e, n);
var cn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function I0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function gc(t) {
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
      typeof cn < "u" && cn || {}, r = {
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
      function i(k) {
        return k && DataView.prototype.isPrototypeOf(k);
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
        ], o = ArrayBuffer.isView || function(k) {
          return k && s.indexOf(Object.prototype.toString.call(k)) > -1;
        };
      function a(k) {
        if (typeof k != "string" && (k = String(k)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(k) || k === "")
          throw new TypeError('Invalid character in header field name: "' + k + '"');
        return k.toLowerCase();
      }
      function c(k) {
        return typeof k != "string" && (k = String(k)), k;
      }
      function u(k) {
        var P = {
          next: function() {
            var b = k.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function f(k) {
        this.map = {}, k instanceof f ? k.forEach(function(P, b) {
          this.append(b, P);
        }, this) : Array.isArray(k) ? k.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : k && Object.getOwnPropertyNames(k).forEach(function(P) {
          this.append(P, k[P]);
        }, this);
      }
      f.prototype.append = function(k, P) {
        k = a(k), P = c(P);
        var b = this.map[k];
        this.map[k] = b ? b + ", " + P : P;
      }, f.prototype.delete = function(k) {
        delete this.map[a(k)];
      }, f.prototype.get = function(k) {
        return k = a(k), this.has(k) ? this.map[k] : null;
      }, f.prototype.has = function(k) {
        return this.map.hasOwnProperty(a(k));
      }, f.prototype.set = function(k, P) {
        this.map[a(k)] = c(P);
      }, f.prototype.forEach = function(k, P) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && k.call(P, this.map[b], b, this);
      }, f.prototype.keys = function() {
        var k = [];
        return this.forEach(function(P, b) {
          k.push(b);
        }), u(k);
      }, f.prototype.values = function() {
        var k = [];
        return this.forEach(function(P) {
          k.push(P);
        }), u(k);
      }, f.prototype.entries = function() {
        var k = [];
        return this.forEach(function(P, b) {
          k.push([b, P]);
        }), u(k);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(k) {
        if (!k._noBody) {
          if (k.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          k.bodyUsed = !0;
        }
      }
      function y(k) {
        return new Promise(function(P, b) {
          k.onload = function() {
            P(k.result);
          }, k.onerror = function() {
            b(k.error);
          };
        });
      }
      function p(k) {
        var P = new FileReader(), b = y(P);
        return P.readAsArrayBuffer(k), b;
      }
      function x(k) {
        var P = new FileReader(), b = y(P), T = /charset=([A-Za-z0-9_-]+)/.exec(k.type), O = T ? T[1] : "utf-8";
        return P.readAsText(k, O), b;
      }
      function S(k) {
        for (var P = new Uint8Array(k), b = new Array(P.length), T = 0; T < P.length; T++)
          b[T] = String.fromCharCode(P[T]);
        return b.join("");
      }
      function B(k) {
        if (k.slice)
          return k.slice(0);
        var P = new Uint8Array(k.byteLength);
        return P.set(new Uint8Array(k)), P.buffer;
      }
      function j() {
        return this.bodyUsed = !1, this._initBody = function(k) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = k, k ? typeof k == "string" ? this._bodyText = k : r.blob && Blob.prototype.isPrototypeOf(k) ? this._bodyBlob = k : r.formData && FormData.prototype.isPrototypeOf(k) ? this._bodyFormData = k : r.searchParams && URLSearchParams.prototype.isPrototypeOf(k) ? this._bodyText = k.toString() : r.arrayBuffer && r.blob && i(k) ? (this._bodyArrayBuffer = B(k.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(k) || o(k)) ? this._bodyArrayBuffer = B(k) : this._bodyText = k = Object.prototype.toString.call(k) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof k == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(k) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var k = l(this);
          if (k)
            return k;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var k = l(this);
            return k || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var k = l(this);
          if (k)
            return k;
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
      var z = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(k) {
        var P = k.toUpperCase();
        return z.indexOf(P) > -1 ? P : k;
      }
      function _(k, P) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var b = P.body;
        if (k instanceof _) {
          if (k.bodyUsed)
            throw new TypeError("Already read");
          this.url = k.url, this.credentials = k.credentials, P.headers || (this.headers = new f(k.headers)), this.method = k.method, this.mode = k.mode, this.signal = k.signal, !b && k._bodyInit != null && (b = k._bodyInit, k.bodyUsed = !0);
        } else
          this.url = String(k);
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
            var O = /\?/;
            this.url += (O.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function N(k) {
        var P = new FormData();
        return k.trim().split("&").forEach(function(b) {
          if (b) {
            var T = b.split("="), O = T.shift().replace(/\+/g, " "), C = T.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(O), decodeURIComponent(C));
          }
        }), P;
      }
      function Q(k) {
        var P = new f(), b = k.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var O = T.split(":"), C = O.shift().trim();
          if (C) {
            var it = O.join(":").trim();
            try {
              P.append(C, it);
            } catch (X) {
              console.warn("Response " + X.message);
            }
          }
        }), P;
      }
      j.call(_.prototype);
      function tt(k, P) {
        if (!(this instanceof tt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new f(P.headers), this.url = P.url || "", this._initBody(k);
      }
      j.call(tt.prototype), tt.prototype.clone = function() {
        return new tt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, tt.error = function() {
        var k = new tt(null, { status: 200, statusText: "" });
        return k.ok = !1, k.status = 0, k.type = "error", k;
      };
      var R = [301, 302, 303, 307, 308];
      tt.redirect = function(k, P) {
        if (R.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new tt(null, { status: P, headers: { location: k } });
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
      function V(k, P) {
        return new Promise(function(b, T) {
          var O = new _(k, P);
          if (O.signal && O.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function it() {
            C.abort();
          }
          C.onload = function() {
            var v = {
              statusText: C.statusText,
              headers: Q(C.getAllResponseHeaders() || "")
            };
            O.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? v.status = 200 : v.status = C.status, v.url = "responseURL" in C ? C.responseURL : v.headers.get("X-Request-URL");
            var m = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              b(new tt(m, v));
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
          function X(v) {
            try {
              return v === "" && n.location.href ? n.location.href : v;
            } catch {
              return v;
            }
          }
          if (C.open(O.method, X(O.url), !0), O.credentials === "include" ? C.withCredentials = !0 : O.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof f || n.Headers && P.headers instanceof n.Headers)) {
            var St = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(v) {
              St.push(a(v)), C.setRequestHeader(v, c(P.headers[v]));
            }), O.headers.forEach(function(v, m) {
              St.indexOf(m) === -1 && C.setRequestHeader(m, v);
            });
          } else
            O.headers.forEach(function(v, m) {
              C.setRequestHeader(m, v);
            });
          O.signal && (O.signal.addEventListener("abort", it), C.onreadystatechange = function() {
            C.readyState === 4 && O.signal.removeEventListener("abort", it);
          }), C.send(typeof O._bodyInit > "u" ? null : O._bodyInit);
        });
      }
      return V.polyfill = !0, n.fetch || (n.fetch = V, n.Headers = f, n.Request = _, n.Response = tt), e.Headers = f, e.Request = _, e.Response = tt, e.fetch = V, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : cn);
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
var Oi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Oi || (Oi = {}));
var zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zs || (zs = {}));
var Wf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Wf || (Wf = {}));
const Sw = "https://api.mainnet.hiro.so", Ew = "https://api.testnet.hiro.so", Aw = "http://localhost:3999", vw = ["mainnet", "testnet", "devnet", "mocknet"];
let Di = class {
  constructor(e) {
    this.version = zs.Mainnet, this.chainId = Oi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === zs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
Di.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new vl();
    case "testnet":
      return new $w();
    case "devnet":
      return new kw();
    case "mocknet":
      return new L0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${vw.join(", ")}`);
  }
};
Di.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Di.fromName(t);
let vl = class extends Di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = zs.Mainnet, this.chainId = Oi.Mainnet;
  }
}, $w = class extends Di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ew,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = zs.Testnet, this.chainId = Oi.Testnet;
  }
}, L0 = class extends Di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = zs.Testnet, this.chainId = Oi.Testnet;
  }
};
const kw = L0, C0 = "xtrata.wallet.bridge.v1", Iw = (t) => typeof t == "object" && t !== null && t.protocol === C0, Lw = (t) => Iw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Cw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class ho extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Xf = 12e4;
class Tw {
  constructor(e) {
    fo(this, "pending", /* @__PURE__ */ new Map());
    fo(this, "listenTarget");
    fo(this, "closed", !1);
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
    fo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Lw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new ho("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new ho("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ho("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = Cw(), s = { protocol: C0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new ho(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Xf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Xf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new ho("CLOSED", "Bridge client closed before the reply arrived."));
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
}, _w = () => typeof window > "u" || !window.localStorage ? Pw() : window.localStorage, Vc = "xtrata.v15.1.wallet.session", Yf = "mainnet", Oa = { isConnected: !1 }, Uw = (t) => t.address ? Nw(t.address) ?? t.network : t.network, T0 = (t) => !t.isConnected || !t.address ? { ...Oa } : Uw(t) !== Yf ? { ...Oa } : {
  isConnected: !0,
  address: t.address,
  network: Yf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Hw = (t) => {
  if (!t)
    return { ...Oa };
  try {
    const e = JSON.parse(t);
    return T0(e);
  } catch {
    return { ...Oa };
  }
}, Ow = (t) => {
  const e = T0(t);
  return JSON.stringify(e);
}, Dw = (t) => {
  const e = _w();
  return {
    load: () => Hw(e.getItem(Vc)),
    save: (n) => {
      e.setItem(Vc, Ow(n));
    },
    clear: () => {
      e.removeItem(Vc);
    }
  };
}, Fw = "https://browser.blockstack.org/auth", jw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, B0 = ["store_write"], zw = "blockstack-session", Rw = {
  logLevel: "debug"
}, oi = {
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
Object.freeze(oi);
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
class Gw extends no {
  constructor(e, n = "") {
    super({ code: oi.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Zf extends no {
  constructor(e = "") {
    super({ code: oi.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Zo extends no {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: oi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Qf extends no {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: oi.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class $l extends no {
  constructor(e) {
    super({ code: oi.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class M0 extends no {
  constructor(e) {
    super({ code: oi.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Jf = ["debug", "info", "warn", "error", "none"], kl = {};
for (let t = 0; t < Jf.length; t++) {
  const e = Jf[t];
  kl[e] = t;
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
    return kl[Rw.logLevel] <= kl[e];
  }
}
function Kw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Vw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function qc(t, e) {
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
function Mu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Ww(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    Ci.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Xw(i, t.toString(), n);
    throw Ci.error(s), new Error(s);
  }
  if (r)
    return {};
}
function xs(t, e) {
  return Nu(tn(t), e);
}
function tn(t) {
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
  if (wn(t, Uint8Array))
    return BigInt(`0x${pt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Yw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function td(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Fo(t, e = 8) {
  return (typeof t == "bigint" ? t : tn(t)).toString(16).padStart(e * 2, "0");
}
function yc(t) {
  return parseInt(t, 16);
}
function Nu(t, e = 16) {
  const n = Fo(t, e);
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
function Il(t) {
  return Jw(BigInt(`0x${pt(t)}`), BigInt(t.byteLength * 8));
}
function Jw(t, e) {
  return Qw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const tb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pt(t) {
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
function ai(t) {
  return new TextEncoder().encode(t);
}
function jo(t) {
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
function ed(t) {
  if (t.some(rb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function pr(...t) {
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
  return pr(...t.map((e) => typeof e == "number" ? ed([e]) : e instanceof Array ? ed(e) : e));
}
function wn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const N0 = "https://api.mainnet.hiro.so", P0 = "https://api.testnet.hiro.so", _0 = "http://localhost:3999", sb = "https://hub.blockstack.org", ib = 33, Wc = 32;
function ob(t) {
  if (t.length < Wc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Wc * 2), r = t.slice(2 + Wc * 2);
  return {
    recoveryId: yc(e),
    r: n,
    s: r
  };
}
function Pu(t) {
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
function Rs(t, e, n = 0) {
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
class U0 {
  constructor(e = B0.slice(), n = ((a) => (a = Mu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = Fw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ll(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function yb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function H0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function wb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ll(t.outputLen), Ll(t.blockLen);
}
function bb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function mb(t, e) {
  H0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ms = {
  number: Ll,
  bool: yb,
  bytes: H0,
  hash: wb,
  exists: bb,
  output: mb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), er = (t, e) => t << 32 - e | t >>> e, xb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!xb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Sb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function _u(t) {
  if (typeof t == "string" && (t = Sb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let O0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ci(t) {
  const e = (r) => t().update(_u(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let D0 = class extends O0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ms.hash(e);
    const r = _u(n);
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
const wc = (t, e, n) => new D0(t, e).update(n).digest();
wc.create = (t, e) => new D0(t, e);
function Eb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Uu = class extends O0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xc(this.buffer);
  }
  update(e) {
    Ms.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = _u(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Xc(e);
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
    Eb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Xc(e), c = this.outputLen;
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
]), Rr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Gr = new Uint32Array(64);
let F0 = class extends Uu {
  constructor() {
    super(64, 32, 8, !1), this.A = Rr[0] | 0, this.B = Rr[1] | 0, this.C = Rr[2] | 0, this.D = Rr[3] | 0, this.E = Rr[4] | 0, this.F = Rr[5] | 0, this.G = Rr[6] | 0, this.H = Rr[7] | 0;
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
      Gr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Gr[l - 15], p = Gr[l - 2], x = er(y, 7) ^ er(y, 18) ^ y >>> 3, S = er(p, 17) ^ er(p, 19) ^ p >>> 10;
      Gr[l] = S + Gr[l - 7] + x + Gr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = er(a, 6) ^ er(a, 11) ^ er(a, 25), p = f + y + Ab(a, c, u) + $b[l] + Gr[l] | 0, S = (er(r, 2) ^ er(r, 13) ^ er(r, 22)) + vb(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Gr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, kb = class extends F0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Fi = ci(() => new F0());
ci(() => new kb());
const Ib = {}, j0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ib
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Dt = BigInt(0), fe = BigInt(1), gs = BigInt(2), Eo = BigInt(3), nd = BigInt(8), Jt = Object.freeze({
  a: Dt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: fe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), rd = (t, e) => (t + e / gs) / e, Qo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Jt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -fe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = rd(s * t, e), c = rd(-r * t, e);
    let u = nt(t - a * n - c * i, e), f = nt(-a * r - c * s, e);
    const l = u > o, y = f > o;
    if (l && (u = e - u), y && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: f };
  }
}, Xn = 32, Gs = 32, z0 = 32, Da = Xn + 1, Fa = 2 * Xn + 1;
function sd(t) {
  const { a: e, b: n } = Jt, r = nt(t * t), i = nt(r * t);
  return nt(i + e * t + n);
}
const Jo = Jt.a === Dt;
class Hu extends Error {
  constructor(e) {
    super(e);
  }
}
function id(t) {
  if (!(t instanceof Kt))
    throw new TypeError("JacobianPoint expected");
}
class Kt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Pt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Pt.ZERO) ? Kt.ZERO : new Kt(e.x, e.y, fe);
  }
  static toAffineBatch(e) {
    const n = Mb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Kt.toAffineBatch(e).map(Kt.fromAffine);
  }
  equals(e) {
    id(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = nt(i * i), u = nt(a * a), f = nt(n * u), l = nt(s * c), y = nt(nt(r * a) * u), p = nt(nt(o * i) * c);
    return f === l && y === p;
  }
  negate() {
    return new Kt(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = nt(e * e), s = nt(n * n), o = nt(s * s), a = e + s, c = nt(gs * (nt(a * a) - i - o)), u = nt(Eo * i), f = nt(u * u), l = nt(f - gs * c), y = nt(u * (c - l) - nd * o), p = nt(gs * n * r);
    return new Kt(l, y, p);
  }
  add(e) {
    id(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Dt || o === Dt)
      return this;
    if (n === Dt || r === Dt)
      return e;
    const c = nt(i * i), u = nt(a * a), f = nt(n * u), l = nt(s * c), y = nt(nt(r * a) * u), p = nt(nt(o * i) * c), x = nt(l - f), S = nt(p - y);
    if (x === Dt)
      return S === Dt ? this.double() : Kt.ZERO;
    const B = nt(x * x), j = nt(x * B), z = nt(f * B), A = nt(S * S - j - gs * z), _ = nt(S * (z - A) - y * j), N = nt(i * a * x);
    return new Kt(A, _, N);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Kt.ZERO;
    if (typeof e == "bigint" && e === Dt)
      return n;
    let r = cd(e);
    if (r === fe)
      return this;
    if (!Jo) {
      let l = n, y = this;
      for (; r > Dt; )
        r & fe && (l = l.add(y)), y = y.double(), r >>= fe;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = Qo.splitScalar(r), c = n, u = n, f = this;
    for (; s > Dt || a > Dt; )
      s & fe && (c = c.add(f)), a & fe && (u = u.add(f)), f = f.double(), s >>= fe, a >>= fe;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Kt(nt(u.x * Qo.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Jo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Kt.BASE) && (n = Pt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && Cl.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Kt.normalizeZ(i), Cl.set(n, i)));
    let s = Kt.ZERO, o = Kt.BASE;
    const a = 1 + (Jo ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= f, e += fe);
      const S = p, B = p + Math.abs(x) - 1, j = y % 2 !== 0, z = x < 0;
      x === 0 ? o = o.add(ta(j, i[S])) : s = s.add(ta(z, i[B]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = cd(e), i, s;
    if (Jo) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Qo.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      f = ta(o, f), y = ta(c, y), y = new Kt(nt(y.x * Qo.beta), y.y, y.z), i = f.add(y), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Kt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Kt.ZERO);
    e == null && (e = s ? nd : ro(i));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), f = nt(r * c), l = nt(i * o);
    if (s)
      return Pt.ZERO;
    if (l !== fe)
      throw new Error("invZ was invalid");
    return new Pt(u, f);
  }
}
Kt.BASE = new Kt(Jt.Gx, Jt.Gy, fe);
Kt.ZERO = new Kt(Dt, fe, Dt);
function ta(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Cl = /* @__PURE__ */ new WeakMap();
class Pt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Cl.delete(this);
  }
  hasEvenY() {
    return this.y % gs === Dt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Cn(n ? e : e.subarray(1));
    if (!Ca(r))
      throw new Error("Point is not on curve");
    const i = sd(r);
    let s = Bb(i);
    const o = (s & fe) === fe;
    n ? o && (s = nt(-s)) : (e[0] & 1) === 1 !== o && (s = nt(-s));
    const a = new Pt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Cn(e.subarray(1, Xn + 1)), r = Cn(e.subarray(Xn + 1, Xn * 2 + 1)), i = new Pt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = gr(e), r = n.length, i = n[0];
    if (r === Xn)
      return this.fromCompressedHex(n);
    if (r === Da && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === Fa && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Da} compressed bytes or ${Fa} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Pt.BASE.multiply(Ks(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = K0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Ou(gr(e)), { n: a } = Jt, c = r === 2 || r === 3 ? i + a : i, u = ro(c, a), f = nt(-o * u, a), l = nt(s * u, a), y = r & 1 ? "03" : "02", p = Pt.fromHex(y + ys(c)), x = Pt.BASE.multiplyAndAddUnsafe(p, f, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return ws(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ys(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ys(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ca(n) || !Ca(r))
      throw new Error(e);
    const i = nt(r * r), s = sd(n);
    if (nt(i - s) !== Dt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Pt(this.x, nt(-this.y));
  }
  double() {
    return Kt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Kt.fromAffine(this).add(Kt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Kt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const i = Kt.fromAffine(this), s = n === Dt || n === fe || this !== Pt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Kt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Kt.ZERO) ? void 0 : a.toAffine();
  }
}
Pt.BASE = new Pt(Jt.Gx, Jt.Gy);
Pt.ZERO = new Pt(Dt, Dt);
function od(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ad(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ji(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Cn(n), left: t.subarray(e + 2) };
}
function Lb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${ji(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ad(t.subarray(2)), { data: r, left: i } = ad(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ji(i)}`);
  return { r: e, s: r };
}
class Ln {
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
    return new Ln(ja(i.slice(0, 64)), ja(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = Lb(n ? e : ws(e));
    return new Ln(r, i);
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
    const e = Jt.n >> fe;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ln(this.r, nt(-this.s, Jt.n)) : this;
  }
  toDERRawBytes() {
    return ws(this.toDERHex());
  }
  toDERHex() {
    const e = od(po(this.s)), n = od(po(this.r)), r = e.length / 2, i = n.length / 2, s = po(r), o = po(i);
    return `30${po(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return ws(this.toCompactHex());
  }
  toCompactHex() {
    return ys(this.r) + ys(this.s);
  }
}
function hs(...t) {
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
function ji(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Cb[t[n]];
  return e;
}
const Tb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ys(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Dt <= t && t < Tb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function zi(t) {
  const e = ws(ys(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function po(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ja(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function ws(t) {
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
function Cn(t) {
  return ja(ji(t));
}
function gr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ws(t);
}
function cd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ri(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function nt(t, e = Jt.P) {
  const n = t % e;
  return n >= Dt ? n : e + n;
}
function Nn(t, e) {
  const { P: n } = Jt;
  let r = t;
  for (; e-- > Dt; )
    r *= r, r %= n;
  return r;
}
function Bb(t) {
  const { P: e } = Jt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = Nn(u, Eo) * u % e, l = Nn(f, Eo) * u % e, y = Nn(l, gs) * c % e, p = Nn(y, r) * y % e, x = Nn(p, i) * p % e, S = Nn(x, o) * x % e, B = Nn(S, a) * S % e, j = Nn(B, o) * x % e, z = Nn(j, Eo) * u % e, A = Nn(z, s) * p % e, _ = Nn(A, n) * c % e, N = Nn(_, gs);
  if (N * N % e !== t)
    throw new Error("Cannot find square root");
  return N;
}
function ro(t, e = Jt.P) {
  if (t === Dt || e <= Dt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, i = Dt, s = fe;
  for (; n !== Dt; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== fe)
    throw new Error("invert: does not exist");
  return nt(i, e);
}
function Mb(t, e = Jt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Dt ? s : (n[a] = s, nt(s * o, e)), fe), i = ro(r, e);
  return t.reduceRight((s, o, a) => o === Dt ? s : (n[a] = nt(s * n[a], e), nt(s * o, e)), i), n;
}
function Nb(t) {
  const e = t.length * 8 - Gs * 8, n = Cn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Ou(t, e = !1) {
  const n = Nb(t);
  if (e)
    return n;
  const { n: r } = Jt;
  return n >= r ? n - r : n;
}
let _i, Ao;
class R0 {
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
    return Ao(this.k, ...e);
  }
  checkSync() {
    if (typeof Ao != "function")
      throw new Hu("hmacSha256Sync needs to be set");
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
    return hs(...n);
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
    return hs(...n);
  }
}
function Ri(t) {
  return Dt < t && t < Jt.n;
}
function Ca(t) {
  return Dt < t && t < Jt.P;
}
function G0(t, e, n, r = !0) {
  const { n: i } = Jt, s = Ou(t, !0);
  if (!Ri(s))
    return;
  const o = ro(s, i), a = Pt.BASE.multiply(s), c = nt(a.x, i);
  if (c === Dt)
    return;
  const u = nt(o * nt(e + n * c, i), i);
  if (u === Dt)
    return;
  let f = new Ln(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & fe);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Ks(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Gs)
      throw new Error("Expected 32 bytes of private key");
    e = ja(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Gs)
      throw new Error("Expected 32 bytes of private key");
    e = Cn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ri(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Du(t) {
  return t instanceof Pt ? (t.assertValidity(), t) : Pt.fromHex(t);
}
function K0(t) {
  if (t instanceof Ln)
    return t.assertValidity(), t;
  try {
    return Ln.fromDER(t);
  } catch {
    return Ln.fromCompact(t);
  }
}
function zo(t, e = !1) {
  return Pt.fromPrivateKey(t).toRawBytes(e);
}
function Pb(t, e, n, r = !1) {
  return Pt.fromSignature(t, e, n).toRawBytes(r);
}
function ld(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Da || r === Fa : n ? r === Da * 2 || r === Fa * 2 : t instanceof Pt;
}
function Fu(t, e, n = !1) {
  if (ld(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!ld(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Du(e);
  return r.assertValidity(), r.multiply(Ks(t)).toRawBytes(n);
}
function V0(t) {
  const e = t.length > Xn ? t.slice(0, Xn) : t;
  return Cn(e);
}
function _b(t) {
  const e = V0(t), n = nt(e, Jt.n);
  return q0(n < Dt ? e : n);
}
function q0(t) {
  return zi(t);
}
function W0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = gr(t), i = Ks(e), s = [q0(i), _b(r)];
  if (n != null) {
    n === !0 && (n = $e.randomBytes(Xn));
    const c = gr(n);
    if (c.length !== Xn)
      throw new Error(`sign: Expected ${Xn} bytes of extra data`);
    s.push(c);
  }
  const o = hs(...s), a = V0(r);
  return { seed: o, m: a, d: i };
}
function X0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function Ub(t, e, n = {}) {
  const { seed: r, m: i, d: s } = W0(t, e, n.extraEntropy), o = new R0(z0, Gs);
  await o.reseed(r);
  let a;
  for (; !(a = G0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return X0(a, n);
}
function bc(t, e, n = {}) {
  const { seed: r, m: i, d: s } = W0(t, e, n.extraEntropy), o = new R0(z0, Gs);
  o.reseedSync(r);
  let a;
  for (; !(a = G0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return X0(a, n);
}
const Hb = { strict: !0 };
function Ob(t, e, n, r = Hb) {
  let i;
  try {
    i = K0(t), e = gr(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = Ou(e);
  let c;
  try {
    c = Du(n);
  } catch {
    return !1;
  }
  const { n: u } = Jt, f = ro(o, u), l = nt(a * f, u), y = nt(s * f, u), p = Pt.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? nt(p.x, u) === s : !1;
}
function za(t) {
  return nt(Cn(t), Jt.n);
}
class Gi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = gr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Cn(n.subarray(0, 32)), i = Cn(n.subarray(32, 64));
    return new Gi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ca(e) || !Ri(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ys(this.r) + ys(this.s);
  }
  toRawBytes() {
    return ws(this.toHex());
  }
}
function Db(t) {
  return Pt.fromPrivateKey(t).toRawX();
}
class Y0 {
  constructor(e, n, r = $e.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = gr(e);
    const { x: i, scalar: s } = this.getScalar(Ks(n));
    if (this.px = i, this.d = s, this.rand = gr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Pt.fromPrivateKey(e), r = n.hasEvenY() ? e : Jt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return zi(e ^ Cn(n));
  }
  finalizeNonce(e) {
    const n = nt(Cn(e), Jt.n);
    if (n === Dt)
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
    const { m: e, d: n, px: r, rand: i } = this, s = $e.taggedHash, o = this.initNonce(n, await s(ds.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(ds.nonce, o, r, e)), f = za(await s(ds.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await J0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = $e.taggedHashSync, o = this.initNonce(n, s(ds.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(ds.nonce, o, r, e)), f = za(s(ds.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return tp(l, e, r) || this.error(), l;
  }
}
async function Fb(t, e, n) {
  return new Y0(t, e, n).calc();
}
function jb(t, e, n) {
  return new Y0(t, e, n).calcSync();
}
function Z0(t, e, n) {
  const r = t instanceof Gi, i = r ? t : Gi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: gr(e),
    P: Du(n)
  };
}
function Q0(t, e, n, r) {
  const i = Pt.BASE.multiplyAndAddUnsafe(e, Ks(n), nt(-r, Jt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function J0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = Z0(t, e, n), a = za(await $e.taggedHash(ds.challenge, zi(r), o.toRawX(), s));
    return Q0(r, o, i, a);
  } catch {
    return !1;
  }
}
function tp(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = Z0(t, e, n), a = za($e.taggedHashSync(ds.challenge, zi(r), o.toRawX(), s));
    return Q0(r, o, i, a);
  } catch (r) {
    if (r instanceof Hu)
      throw r;
    return !1;
  }
}
const zb = {
  Signature: Gi,
  getPublicKey: Db,
  sign: Fb,
  verify: J0,
  signSync: jb,
  verifySync: tp
};
Pt.BASE._setWindowSize(8);
const En = {
  node: j0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ds = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ea = {}, $e = {
  bytesToHex: ji,
  hexToBytes: ws,
  concatBytes: hs,
  mod: nt,
  invert: ro,
  isValidPrivateKey(t) {
    try {
      return Ks(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: zi,
  _normalizePrivateKey: Ks,
  hashToPrivateKey: (t) => {
    t = gr(t);
    const e = Gs + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(Cn(t), Jt.n - fe) + fe;
    return zi(n);
  },
  randomBytes: (t = 32) => {
    if (En.web)
      return En.web.getRandomValues(new Uint8Array(t));
    if (En.node) {
      const { randomBytes: e } = En.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => $e.hashToPrivateKey($e.randomBytes(Gs + 8)),
  precompute(t = 8, e = Pt.BASE) {
    const n = e === Pt.BASE ? e : new Pt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Eo), n;
  },
  sha256: async (...t) => {
    if (En.web) {
      const e = await En.web.subtle.digest("SHA-256", hs(...t));
      return new Uint8Array(e);
    } else if (En.node) {
      const { createHash: e } = En.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (En.web) {
      const n = await En.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = hs(...e), i = await En.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (En.node) {
      const { createHmac: n } = En.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ea[t];
    if (n === void 0) {
      const r = await $e.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = hs(r, r), ea[t] = n;
    }
    return $e.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof _i != "function")
      throw new Hu("sha256Sync is undefined, you need to set it");
    let n = ea[t];
    if (n === void 0) {
      const r = _i(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = hs(r, r), ea[t] = n;
    }
    return _i(n, ...e);
  },
  _JacobianPoint: Kt
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
      return Ao;
    },
    set(t) {
      Ao || (Ao = t);
    }
  }
});
const Rb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Jt,
  Point: Pt,
  Signature: Ln,
  getPublicKey: zo,
  getSharedSecret: Fu,
  recoverPublicKey: Pb,
  schnorr: zb,
  sign: Ub,
  signSync: bc,
  utils: $e,
  verify: Ob
}, Symbol.toStringTag, { value: "Module" }));
var Ro = {};
Ro.byteLength = Wb;
var Gb = Ro.toByteArray = Yb, Kb = Ro.fromByteArray = Jb, ar = [], Un = [], Vb = typeof Uint8Array < "u" ? Uint8Array : Array, Yc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ai = 0, qb = Yc.length; Ai < qb; ++Ai)
  ar[Ai] = Yc[Ai], Un[Yc.charCodeAt(Ai)] = Ai;
Un[45] = 62;
Un[95] = 63;
function ep(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Wb(t) {
  var e = ep(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Xb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Yb(t) {
  var e, n = ep(t), r = n[0], i = n[1], s = new Vb(Xb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Un[t.charCodeAt(c)] << 18 | Un[t.charCodeAt(c + 1)] << 12 | Un[t.charCodeAt(c + 2)] << 6 | Un[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = Un[t.charCodeAt(c)] << 2 | Un[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = Un[t.charCodeAt(c)] << 10 | Un[t.charCodeAt(c + 1)] << 4 | Un[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Zb(t) {
  return ar[t >> 18 & 63] + ar[t >> 12 & 63] + ar[t >> 6 & 63] + ar[t & 63];
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
    ar[e >> 2] + ar[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    ar[e >> 10] + ar[e >> 4 & 63] + ar[e << 2 & 63] + "="
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
    const s = this.createCipher(e, n, r), o = new Uint8Array(pr(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(pr(s.update(i), s.final()));
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
async function np() {
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
  function f(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var x = 0, S = 0, B = 0, j = p.length; B !== j && p[B] === 0; )
      B++, x++;
    for (var z = (j - B) * u + 1 >>> 0, A = new Uint8Array(z); B !== j; ) {
      for (var _ = p[B], N = 0, Q = z - 1; (_ !== 0 || N < S) && Q !== -1; Q--, N++)
        _ += 256 * A[Q] >>> 0, A[Q] = _ % o >>> 0, _ = _ / o >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      S = N, B++;
    }
    for (var tt = z - S; tt !== z && A[tt] === 0; )
      tt++;
    for (var R = a.repeat(x); tt < z; ++tt)
      R += t.charAt(A[tt]);
    return R;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, S = 0, B = 0; p[x] === a; )
      S++, x++;
    for (var j = (p.length - x) * c + 1 >>> 0, z = new Uint8Array(j); p[x]; ) {
      var A = p.charCodeAt(x);
      if (A > 255)
        return;
      var _ = e[A];
      if (_ === 255)
        return;
      for (var N = 0, Q = j - 1; (_ !== 0 || N < B) && Q !== -1; Q--, N++)
        _ += o * z[Q] >>> 0, z[Q] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      B = N, x++;
    }
    for (var tt = j - B; tt !== j && z[tt] === 0; )
      tt++;
    for (var R = new Uint8Array(S + (j - tt)), V = S; tt !== j; )
      R[V++] = z[tt++];
    return R;
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
var rp = im;
const om = rp, am = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var cm = om(am);
const lm = /* @__PURE__ */ I0(cm), um = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), sp = Uint8Array.from({ length: 16 }, (t, e) => e), fm = sp.map((t) => (9 * t + 5) % 16);
let ju = [sp], zu = [fm];
for (let t = 0; t < 4; t++)
  for (let e of [ju, zu])
    e.push(e[t].map((n) => um[n]));
const ip = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), dm = ju.map((t, e) => t.map((n) => ip[e][n])), hm = zu.map((t, e) => t.map((n) => ip[e][n])), pm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), na = (t, e) => t << e | t >>> 32 - e;
function ud(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ra = new Uint32Array(16);
let ym = class extends Uu {
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
      ra[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = pm[p], B = gm[p], j = ju[p], z = zu[p], A = dm[p], _ = hm[p];
      for (let N = 0; N < 16; N++) {
        const Q = na(r + ud(p, s, a, u) + ra[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = na(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = na(i + ud(x, o, c, f) + ra[z[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = na(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ra.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const wm = ci(() => new ym());
function bm(t) {
  return wm(t);
}
const sa = BigInt(2 ** 32 - 1), Tl = BigInt(32);
function op(t, e = !1) {
  return e ? { h: Number(t & sa), l: Number(t >> Tl & sa) } : { h: Number(t >> Tl & sa) | 0, l: Number(t & sa) | 0 };
}
function mm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = op(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const xm = (t, e) => BigInt(t >>> 0) << Tl | BigInt(e >>> 0), Sm = (t, e, n) => t >>> n, Em = (t, e, n) => t << 32 - n | e >>> n, Am = (t, e, n) => t >>> n | e << 32 - n, vm = (t, e, n) => t << 32 - n | e >>> n, $m = (t, e, n) => t << 64 - n | e >>> n - 32, km = (t, e, n) => t >>> n - 32 | e << 64 - n, Im = (t, e) => e, Lm = (t, e) => t, Cm = (t, e, n) => t << n | e >>> 32 - n, Tm = (t, e, n) => e << n | t >>> 32 - n, Bm = (t, e, n) => e << n - 32 | t >>> 64 - n, Mm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Nm(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Pm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _m = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Um = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Hm = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Om = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Dm = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, It = {
  fromBig: op,
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
}, [Fm, jm] = It.split([
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
].map((t) => BigInt(t))), Kr = new Uint32Array(80), Vr = new Uint32Array(80);
let mc = class extends Uu {
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
      Kr[A] = e.getUint32(n), Vr[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = Kr[A - 15] | 0, N = Vr[A - 15] | 0, Q = It.rotrSH(_, N, 1) ^ It.rotrSH(_, N, 8) ^ It.shrSH(_, N, 7), tt = It.rotrSL(_, N, 1) ^ It.rotrSL(_, N, 8) ^ It.shrSL(_, N, 7), R = Kr[A - 2] | 0, V = Vr[A - 2] | 0, k = It.rotrSH(R, V, 19) ^ It.rotrBH(R, V, 61) ^ It.shrSH(R, V, 6), P = It.rotrSL(R, V, 19) ^ It.rotrBL(R, V, 61) ^ It.shrSL(R, V, 6), b = It.add4L(tt, P, Vr[A - 7], Vr[A - 16]), T = It.add4H(b, Q, k, Kr[A - 7], Kr[A - 16]);
      Kr[A] = T | 0, Vr[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = It.rotrSH(l, y, 14) ^ It.rotrSH(l, y, 18) ^ It.rotrBH(l, y, 41), N = It.rotrSL(l, y, 14) ^ It.rotrSL(l, y, 18) ^ It.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, R = It.add5L(z, N, tt, jm[A], Vr[A]), V = It.add5H(R, j, _, Q, Fm[A], Kr[A]), k = R | 0, P = It.rotrSH(r, i, 28) ^ It.rotrBH(r, i, 34) ^ It.rotrBH(r, i, 39), b = It.rotrSL(r, i, 28) ^ It.rotrBL(r, i, 34) ^ It.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, O = i & o ^ i & c ^ o & c;
      j = S | 0, z = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = It.add(u | 0, f | 0, V | 0, k | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = It.add3L(k, b, O);
      r = It.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = It.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = It.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = It.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = It.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = It.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = It.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: j, l: z } = It.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, j, z);
  }
  roundClean() {
    Kr.fill(0), Vr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zm = class extends mc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Rm = class extends mc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Gm = class extends mc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Km = ci(() => new mc());
ci(() => new zm());
ci(() => new Rm());
ci(() => new Gm());
function ap(t) {
  return Fi(t);
}
function Vm(t) {
  return Km(t);
}
const qm = 0;
$e.hmacSha256Sync = (t, ...e) => {
  const n = wc.create(Fi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Wm() {
  return pt($e.randomPrivateKey());
}
function Xm(t) {
  const e = Fi(Fi(t));
  return lm.encode(pr(t, e).slice(0, t.length + 4));
}
function Ym(t, e) {
  return Xm(pr(new Uint8Array([t]), e.slice(0, 20)));
}
function cp(t, e = qm) {
  const n = typeof t == "string" ? Rt(t) : t, r = bm(ap(n));
  return Ym(e, r);
}
function lp(t) {
  const e = Pu(t);
  return pt(zo(e.slice(0, 32), !0));
}
$e.hmacSha256Sync = (t, ...e) => {
  const n = wc.create(Fi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ra;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ra || (Ra = {}));
async function Zm(t, e, n) {
  return await (await np()).encrypt("aes-256-cbc", e, t, n);
}
async function Qm(t, e, n) {
  return await (await np()).decrypt("aes-256-cbc", e, t, n);
}
function up(t, e) {
  return wc(Fi, t, e);
}
function Jm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function fp(t) {
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
    reason: Ra.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ra.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !t1(t))
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
async function n1(t, e, n, r) {
  const i = e1(t);
  if (!i.result)
    throw i;
  const s = $e.randomPrivateKey(), o = zo(s, !0);
  let a = Fu(s, t, !0);
  a = a.slice(1);
  const c = fp(a), u = $e.randomBytes(16), f = await Zm(u, c.encryptionKey, e), l = pr(u, o, f), y = up(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = pt(f);
  else if (r === "base64")
    p = Kb(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: pt(u),
    ephemeralPK: pt(o),
    cipherText: p,
    mac: pt(y),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function dp(t, e) {
  if (!e.ephemeralPK)
    throw new Qf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Fu(t, n, !0);
  r = r.slice(1);
  const i = fp(r), s = Rt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Rt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Gb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = pr(s, Rt(n), o), c = up(i.hmacKey, a), u = Rt(e.mac);
  if (!Jm(u, c))
    throw new Qf("Decryption failed: failure in MAC check");
  const f = await Qm(s, i.encryptionKey, o);
  return e.wasString ? jo(f) : f;
}
function r1(t, e) {
  const n = typeof e == "string" ? ai(e) : e, r = lp(t), i = ap(n), s = bc(i, t);
  return {
    signature: pt(s),
    publicKey: r
  };
}
async function s1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = lp(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? ai(t) : t, o = await n1(n.publicKey, s, i, n.cipherTextEncoding);
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
    return dp(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ve = {}, Ki = {}, on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.decode = on.encode = on.unescape = on.escape = on.pad = void 0;
const hp = Ro;
function Ru(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
on.pad = Ru;
function pp(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
on.escape = pp;
function gp(t) {
  return Ru(t).replace(/-/g, "+").replace(/_/g, "/");
}
on.unescape = gp;
function o1(t) {
  return pp((0, hp.fromByteArray)(new TextEncoder().encode(t)));
}
on.encode = o1;
function a1(t) {
  return new TextDecoder().decode((0, hp.toByteArray)(Ru(gp(t))));
}
on.decode = a1;
var xc = {}, Sc = {}, yp = {}, wp = {}, Ec = {};
Object.defineProperty(Ec, "__esModule", { value: !0 });
Ec.crypto = void 0;
Ec.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = x, t.byteSwap32 = S, t.bytesToHex = z, t.hexToBytes = N, t.asyncLoop = tt, t.utf8ToBytes = R, t.bytesToUtf8 = V, t.toBytes = k, t.kdfInputToBytes = P, t.concatBytes = b, t.checkOpts = T, t.createHasher = C, t.createOptHasher = it, t.createXOFer = X, t.randomBytes = St;
  const e = Ec;
  function n(v) {
    return v instanceof Uint8Array || ArrayBuffer.isView(v) && v.constructor.name === "Uint8Array";
  }
  function r(v) {
    if (!Number.isSafeInteger(v) || v < 0)
      throw new Error("positive integer expected, got " + v);
  }
  function i(v, ...m) {
    if (!n(v))
      throw new Error("Uint8Array expected");
    if (m.length > 0 && !m.includes(v.length))
      throw new Error("Uint8Array expected of length " + m + ", got length=" + v.length);
  }
  function s(v) {
    if (typeof v != "function" || typeof v.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(v.outputLen), r(v.blockLen);
  }
  function o(v, m = !0) {
    if (v.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (m && v.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(v, m) {
    i(v);
    const W = m.outputLen;
    if (v.length < W)
      throw new Error("digestInto() expects output buffer of length at least " + W);
  }
  function c(v) {
    return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
  }
  function u(v) {
    return new Uint32Array(v.buffer, v.byteOffset, Math.floor(v.byteLength / 4));
  }
  function f(...v) {
    for (let m = 0; m < v.length; m++)
      v[m].fill(0);
  }
  function l(v) {
    return new DataView(v.buffer, v.byteOffset, v.byteLength);
  }
  function y(v, m) {
    return v << 32 - m | v >>> m;
  }
  function p(v, m) {
    return v << m | v >>> 32 - m >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(v) {
    return v << 24 & 4278190080 | v << 8 & 16711680 | v >>> 8 & 65280 | v >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (v) => v : (v) => x(v), t.byteSwapIfBE = t.swap8IfBE;
  function S(v) {
    for (let m = 0; m < v.length; m++)
      v[m] = x(v[m]);
    return v;
  }
  t.swap32IfBE = t.isLE ? (v) => v : S;
  const B = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", j = /* @__PURE__ */ Array.from({ length: 256 }, (v, m) => m.toString(16).padStart(2, "0"));
  function z(v) {
    if (i(v), B)
      return v.toHex();
    let m = "";
    for (let W = 0; W < v.length; W++)
      m += j[v[W]];
    return m;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function _(v) {
    if (v >= A._0 && v <= A._9)
      return v - A._0;
    if (v >= A.A && v <= A.F)
      return v - (A.A - 10);
    if (v >= A.a && v <= A.f)
      return v - (A.a - 10);
  }
  function N(v) {
    if (typeof v != "string")
      throw new Error("hex string expected, got " + typeof v);
    if (B)
      return Uint8Array.fromHex(v);
    const m = v.length, W = m / 2;
    if (m % 2)
      throw new Error("hex string expected, got unpadded hex of length " + m);
    const rt = new Uint8Array(W);
    for (let at = 0, vt = 0; at < W; at++, vt += 2) {
      const te = _(v.charCodeAt(vt)), kt = _(v.charCodeAt(vt + 1));
      if (te === void 0 || kt === void 0) {
        const Ht = v[vt] + v[vt + 1];
        throw new Error('hex string expected, got non-hex character "' + Ht + '" at index ' + vt);
      }
      rt[at] = te * 16 + kt;
    }
    return rt;
  }
  const Q = async () => {
  };
  t.nextTick = Q;
  async function tt(v, m, W) {
    let rt = Date.now();
    for (let at = 0; at < v; at++) {
      W(at);
      const vt = Date.now() - rt;
      vt >= 0 && vt < m || (await (0, t.nextTick)(), rt += vt);
    }
  }
  function R(v) {
    if (typeof v != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(v));
  }
  function V(v) {
    return new TextDecoder().decode(v);
  }
  function k(v) {
    return typeof v == "string" && (v = R(v)), i(v), v;
  }
  function P(v) {
    return typeof v == "string" && (v = R(v)), i(v), v;
  }
  function b(...v) {
    let m = 0;
    for (let rt = 0; rt < v.length; rt++) {
      const at = v[rt];
      i(at), m += at.length;
    }
    const W = new Uint8Array(m);
    for (let rt = 0, at = 0; rt < v.length; rt++) {
      const vt = v[rt];
      W.set(vt, at), at += vt.length;
    }
    return W;
  }
  function T(v, m) {
    if (m !== void 0 && {}.toString.call(m) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(v, m);
  }
  class O {
  }
  t.Hash = O;
  function C(v) {
    const m = (rt) => v().update(k(rt)).digest(), W = v();
    return m.outputLen = W.outputLen, m.blockLen = W.blockLen, m.create = () => v(), m;
  }
  function it(v) {
    const m = (rt, at) => v(at).update(k(rt)).digest(), W = v({});
    return m.outputLen = W.outputLen, m.blockLen = W.blockLen, m.create = (rt) => v(rt), m;
  }
  function X(v) {
    const m = (rt, at) => v(at).update(k(rt)).digest(), W = v({});
    return m.outputLen = W.outputLen, m.blockLen = W.blockLen, m.create = (rt) => v(rt), m;
  }
  t.wrapConstructor = C, t.wrapConstructorWithOpts = it, t.wrapXOFConstructorWithOpts = X;
  function St(v = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(v));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(v));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(wp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = wp;
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
})(yp);
const vi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function bp(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function li(t, ...e) {
  if (!bp(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function c1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Bl(t.outputLen), Bl(t.blockLen);
}
function Ml(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function mp(t, e) {
  li(t);
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
function Ga(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Ta(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Gn(t, e) {
  return t << 32 - e | t >>> e;
}
function f1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Gu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ku(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const xp = Gu ? (t) => t : (t) => Ku(t), d1 = xp;
function Sp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ku(t[e]);
  return t;
}
const h1 = Gu ? (t) => t : Sp, Ep = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", p1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ap(t) {
  if (li(t), Ep)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += p1[t[n]];
  return e;
}
const $r = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function fd(t) {
  if (t >= $r._0 && t <= $r._9)
    return t - $r._0;
  if (t >= $r.A && t <= $r.F)
    return t - ($r.A - 10);
  if (t >= $r.a && t <= $r.f)
    return t - ($r.a - 10);
}
function g1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Ep)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = fd(t.charCodeAt(s)), a = fd(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const vp = async () => {
};
async function y1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await vp(), r += s);
  }
}
function Vu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function w1(t) {
  return new TextDecoder().decode(t);
}
function Go(t) {
  return typeof t == "string" && (t = Vu(t)), li(t), t;
}
function b1(t) {
  return typeof t == "string" && (t = Vu(t)), li(t), t;
}
function m1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    li(i), e += i.length;
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
let $p = class {
};
function Ac(t) {
  const e = (r) => t().update(Go(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function kp(t) {
  const e = (r, i) => t(i).update(Go(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Ip(t) {
  const e = (r, i) => t(i).update(Go(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const S1 = Ac, E1 = kp, A1 = Ip;
function v1(t = 32) {
  if (vi && typeof vi.getRandomValues == "function")
    return vi.getRandomValues(new Uint8Array(t));
  if (vi && typeof vi.randomBytes == "function")
    return Uint8Array.from(vi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const $1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: $p,
  abytes: li,
  aexists: Ml,
  ahash: c1,
  anumber: Bl,
  aoutput: mp,
  asyncLoop: y1,
  byteSwap: Ku,
  byteSwap32: Sp,
  byteSwapIfBE: d1,
  bytesToHex: Ap,
  bytesToUtf8: w1,
  checkOpts: x1,
  clean: Ga,
  concatBytes: m1,
  createHasher: Ac,
  createOptHasher: kp,
  createView: Ta,
  createXOFer: Ip,
  hexToBytes: g1,
  isBytes: bp,
  isLE: Gu,
  kdfInputToBytes: b1,
  nextTick: vp,
  randomBytes: v1,
  rotl: f1,
  rotr: Gn,
  swap32IfBE: h1,
  swap8IfBE: xp,
  toBytes: Go,
  u32: u1,
  u8: l1,
  utf8ToBytes: Vu,
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
class C1 extends $p {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = Ta(this.buffer);
  }
  update(e) {
    Ml(this), e = Go(e), li(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Ta(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ml(this), mp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, Ga(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    k1(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ta(e), c = this.outputLen;
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
const qr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wr = /* @__PURE__ */ Uint32Array.from([
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
]), Xr = /* @__PURE__ */ new Uint32Array(64);
let qu = class extends C1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = qr[0] | 0, this.B = qr[1] | 0, this.C = qr[2] | 0, this.D = qr[3] | 0, this.E = qr[4] | 0, this.F = qr[5] | 0, this.G = qr[6] | 0, this.H = qr[7] | 0;
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
      Xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Xr[l - 15], p = Xr[l - 2], x = Gn(y, 7) ^ Gn(y, 18) ^ y >>> 3, S = Gn(p, 17) ^ Gn(p, 19) ^ p >>> 10;
      Xr[l] = S + Xr[l - 7] + x + Xr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = Gn(a, 6) ^ Gn(a, 11) ^ Gn(a, 25), p = f + y + I1(a, c, u) + T1[l] + Xr[l] | 0, S = (Gn(r, 2) ^ Gn(r, 13) ^ Gn(r, 22)) + L1(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Ga(Xr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ga(this.buffer);
  }
}, Lp = class extends qu {
  constructor() {
    super(28), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
  }
};
const B1 = /* @__PURE__ */ Ac(() => new qu()), M1 = /* @__PURE__ */ Ac(() => new Lp()), N1 = qu, Cp = B1, P1 = Lp, _1 = M1, U1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: P1,
  SHA256: N1,
  sha224: _1,
  sha256: Cp
}, Symbol.toStringTag, { value: "Module" })), vc = /* @__PURE__ */ gc(U1), H1 = /* @__PURE__ */ gc(Rb);
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.joseToDer = Vi.derToJose = void 0;
const Tp = Ro, Bp = on;
function Zc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const O1 = {
  ES256: Zc(256),
  ES384: Zc(384),
  ES512: Zc(521)
};
function Mp(t) {
  const e = O1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ka = 128, Np = 0, D1 = 32, F1 = 16, j1 = 2, Pp = F1 | D1 | Np << 6, Va = j1 | Np << 6;
function _p(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Tp.toByteArray)((0, Bp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function z1(t, e) {
  const n = _p(t), r = Mp(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== Pp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Ka | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Va)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Va)
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
  return x.set(n.subarray(l + Math.max(-p, 0), l + f), o), (0, Bp.escape)((0, Tp.fromByteArray)(x));
}
Vi.derToJose = z1;
function dd(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ka && --r, r;
}
function R1(t, e) {
  t = _p(t);
  const n = Mp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = dd(t, 0, n), s = dd(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < Ka, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Pp, u ? f[l++] = c : (f[l++] = Ka | 1, f[l++] = c & 255), f[l++] = Va, f[l++] = o, i < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(i, n), l), l += n - i), f[l++] = Va, f[l++] = a, s < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + s), l), f;
}
Vi.joseToDer = R1;
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.InvalidTokenError = Nr.MissingParametersError = void 0;
class G1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Nr.MissingParametersError = G1;
class K1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Nr.InvalidTokenError = K1;
const Ko = /* @__PURE__ */ gc($1);
Object.defineProperty(Sc, "__esModule", { value: !0 });
Sc.SECP256K1Client = void 0;
const V1 = yp, q1 = vc, Ba = H1, hd = Vi, pd = Nr, gd = Ko;
Ba.utils.hmacSha256Sync = (t, ...e) => {
  const n = V1.hmac.create(q1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Up {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, gd.bytesToHex)(Ba.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new pd.MissingParametersError("a signing input hash and private key are all required");
    const i = Ba.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, gd.bytesToHex)(i);
    if (r === "jose")
      return (0, hd.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, hd.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new pd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Ba.verify(n, e, r, { strict: !1 });
  }
}
Sc.SECP256K1Client = Up;
Up.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Sc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(xc);
var Vs = {};
const W1 = /* @__PURE__ */ gc(j0);
var X1 = cn && cn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Vs, "__esModule", { value: !0 });
Vs.hashSha256Async = Vs.hashSha256 = void 0;
const Y1 = vc;
function Hp(t) {
  return (0, Y1.sha256)(t);
}
Vs.hashSha256 = Hp;
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
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Hp(t));
    }
  });
}
Vs.hashSha256Async = Z1;
var Q1 = cn && cn.__awaiter || function(t, e, n, r) {
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
const Nl = on, yd = xc, J1 = Nr, wd = Vs;
function Pl(t, e) {
  const n = [], r = Nl.encode(JSON.stringify(e));
  n.push(r);
  const i = Nl.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function t2(t) {
  return Pl(t, { typ: "JWT", alg: "none" }) + ".";
}
Ki.createUnsecuredToken = t2;
class e2 {
  constructor(e, n) {
    if (!(e && n))
      throw new J1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !yd.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = yd.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = Pl(e, i), o = (0, wd.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Q1(this, void 0, void 0, function* () {
      const i = this.header(r), s = Pl(e, i), o = yield (0, wd.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [Nl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
Ki.TokenSigner = e2;
var $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
$c.TokenVerifier = void 0;
const n2 = on, bd = xc, r2 = Nr, ia = Vs;
class s2 {
  constructor(e, n) {
    if (!(e && n))
      throw new r2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !bd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = bd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, ia.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, ia.hashSha256)(i);
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
      return (0, ia.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, ia.hashSha256)(r);
      return s(o);
    }
  }
}
$c.TokenVerifier = s2;
var kc = {};
Object.defineProperty(kc, "__esModule", { value: !0 });
kc.decodeToken = void 0;
const oa = on;
function i2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(oa.decode(e[0])), r = JSON.parse(oa.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = oa.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(oa.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
kc.decodeToken = i2;
(function(t) {
  var e = cn && cn.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = cn && cn.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ki, t), n($c, t), n(kc, t), n(Nr, t), n(xc, t);
})(Ve);
function o2(t) {
  return `did:btc-addr:${t}`;
}
function a2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Zf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Zf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Op(t) {
  if (t)
    return a2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const c2 = "1.4.0";
function l2() {
  return Wm();
}
function u2(t, e, n, r = B0.slice(), i, s = Kw().getTime(), o = {}) {
  const a = (p) => {
    const x = Mu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
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
  }), u = Ve.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = cp(u);
  return c.iss = o2(f), new Ve.TokenSigner("ES256k", t).sign(c);
}
async function md(t, e) {
  const n = jo(Rt(e)), r = JSON.parse(n), i = await dp(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function f2(t) {
  const e = Ve.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ve.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function d2(t) {
  const e = Ve.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Op(e.iss);
  if (n.length === 1) {
    if (cp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function h2(t) {
  const e = Ve.decodeToken(t).payload;
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
  const e = Ve.decodeToken(t).payload;
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
const xd = "1.0.0";
class bs {
  constructor(e) {
    this.version = xd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== xd)
      throw new $l(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new bs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Dp {
  constructor(e) {
    if (e) {
      const n = new bs(e);
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
class Sd extends Dp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new bs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new M0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new bs({})), !0;
  }
}
class Ed extends Dp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = zw, !localStorage.getItem(this.key)) {
      const r = new bs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new M0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return bs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new bs({})), !0;
  }
}
var Co;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Co || (Co = {}));
var qa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(qa || (qa = {}));
Co.Mainnet;
var Br;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Br || (Br = {}));
var ur;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ur || (ur = {}));
Br.Mainnet;
const Fp = {
  chainId: Co.Mainnet,
  transactionVersion: Br.Mainnet,
  peerNetworkId: qa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ur.MainnetSingleSig,
    multiSig: ur.MainnetMultiSig
  },
  client: { baseUrl: N0 }
}, _l = {
  chainId: Co.Testnet,
  transactionVersion: Br.Testnet,
  peerNetworkId: qa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ur.TestnetSingleSig,
    multiSig: ur.TestnetMultiSig
  },
  client: { baseUrl: P0 }
}, Ma = {
  ..._l,
  addressVersion: { ..._l.addressVersion },
  magicBytes: "id",
  client: { baseUrl: _0 }
}, y2 = {
  ...Ma,
  addressVersion: { ...Ma.addressVersion },
  client: { ...Ma.client }
};
function w2(t) {
  switch (t) {
    case "mainnet":
      return Fp;
    case "testnet":
      return _l;
    case "devnet":
      return Ma;
    case "mocknet":
      return y2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function jp(t) {
  return typeof t == "string" ? w2(t) : t;
}
var Ad;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ad || (Ad = {}));
var vd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(vd || (vd = {}));
var Kn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Kn || (Kn = {}));
const Qc = ["onChainOnly", "offChainOnly", "any"];
Qc[0] + "", Kn.OnChainOnly, Qc[1] + "", Kn.OffChainOnly, Qc[2] + "", Kn.Any, Kn.OnChainOnly + "", Kn.OnChainOnly, Kn.OffChainOnly + "", Kn.OffChainOnly, Kn.Any + "", Kn.Any;
var $d;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})($d || ($d = {}));
var kd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(kd || (kd = {}));
var Id;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Id || (Id = {}));
var Tr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Tr || (Tr = {}));
var Ld;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Cd || (Cd = {}));
var Td;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Td || (Td = {}));
var Bd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Bd || (Bd = {}));
var Md;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Md || (Md = {}));
var Nd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Nd || (Nd = {}));
var Pd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Pd || (Pd = {}));
var _d;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_d || (_d = {}));
var Ud;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ud || (Ud = {}));
function Ul(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function b2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function zp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function m2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ul(t.outputLen), Ul(t.blockLen);
}
function x2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function S2(t, e) {
  zp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ns = {
  number: Ul,
  bool: b2,
  bytes: zp,
  hash: m2,
  exists: x2,
  output: S2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), nr = (t, e) => t << 32 - e | t >>> e, E2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!E2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function A2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Wu(t) {
  if (typeof t == "string" && (t = A2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Rp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ui(t) {
  const e = (r) => t().update(Wu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Gp = class extends Rp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ns.hash(e);
    const r = Wu(n);
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
    return Ns.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ns.exists(this), Ns.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Kp = (t, e, n) => new Gp(t, e).update(n).digest();
Kp.create = (t, e) => new Gp(t, e);
function v2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Xu = class extends Rp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Jc(this.buffer);
  }
  update(e) {
    Ns.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Wu(e);
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
    Ns.exists(this), Ns.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    v2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Jc(e), c = this.outputLen;
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
let Vp = class extends Xu {
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
      const y = Zr[l - 15], p = Zr[l - 2], x = nr(y, 7) ^ nr(y, 18) ^ y >>> 3, S = nr(p, 17) ^ nr(p, 19) ^ p >>> 10;
      Zr[l] = S + Zr[l - 7] + x + Zr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = nr(a, 6) ^ nr(a, 11) ^ nr(a, 25), p = f + y + $2(a, c, u) + I2[l] + Zr[l] | 0, S = (nr(r, 2) ^ nr(r, 13) ^ nr(r, 22)) + k2(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Zr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, L2 = class extends Vp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const qp = ui(() => new Vp());
ui(() => new L2());
var fi = {}, Yu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Ko;
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
        const B = 1 + u, j = S % (1 << B) << 5 - B, z = t.c32[x + j];
        u = B, c.unshift(z);
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
      const j = (t.c32.indexOf(o[S]) << y) + l, z = n[j % 16];
      if (y += 1, l = j >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      f.unshift(z);
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
})(Yu);
var qs = {};
Object.defineProperty(qs, "__esModule", { value: !0 });
qs.c32checkDecode = qs.c32checkEncode = void 0;
const Hd = vc, Od = Ko, vo = Yu;
function Wp(t) {
  const e = (0, Hd.sha256)((0, Hd.sha256)((0, Od.hexToBytes)(t)));
  return (0, Od.bytesToHex)(e.slice(0, 4));
}
function C2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Wp(`${n}${e}`), i = (0, vo.c32encode)(`${e}${r}`);
  return `${vo.c32[t]}${i}`;
}
qs.c32checkEncode = C2;
function T2(t) {
  t = (0, vo.c32normalize)(t);
  const e = (0, vo.c32decode)(t.slice(1)), n = t[0], r = vo.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Wp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
qs.c32checkDecode = T2;
var Xp = {}, qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.decode = qi.encode = void 0;
const Wa = vc, Dd = Ko, Yp = rp, Zp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function B2(t, e = "00") {
  const n = typeof t == "string" ? (0, Dd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Dd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Wa.sha256)((0, Wa.sha256)(new Uint8Array([...r, ...n])));
  return Yp(Zp).encode([...r, ...n, ...i.slice(0, 4)]);
}
qi.encode = B2;
function M2(t) {
  const e = Yp(Zp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Wa.sha256)((0, Wa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
qi.decode = M2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = qs, n = qi, r = Ko;
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
})(Xp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Yu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = qs;
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
})(fi);
function N2(t, e) {
  switch (e = jp(e ?? Fp), t) {
    case Tr.P2PKH:
      switch (e.transactionVersion) {
        case Br.Mainnet:
          return ur.MainnetSingleSig;
        case Br.Testnet:
          return ur.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Tr.P2SH:
    case Tr.P2SHNonSequential:
    case Tr.P2WPKH:
    case Tr.P2WSH:
    case Tr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Br.Mainnet:
          return ur.MainnetMultiSig;
        case Br.Testnet:
          return ur.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const P2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Qp = Uint8Array.from({ length: 16 }, (t, e) => e), _2 = Qp.map((t) => (9 * t + 5) % 16);
let Zu = [Qp], Qu = [_2];
for (let t = 0; t < 4; t++)
  for (let e of [Zu, Qu])
    e.push(e[t].map((n) => P2[n]));
const Jp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), U2 = Zu.map((t, e) => t.map((n) => Jp[e][n])), H2 = Qu.map((t, e) => t.map((n) => Jp[e][n])), O2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), D2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), aa = (t, e) => t << e | t >>> 32 - e;
function Fd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ca = new Uint32Array(16);
let F2 = class extends Xu {
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
      ca[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = O2[p], B = D2[p], j = Zu[p], z = Qu[p], A = U2[p], _ = H2[p];
      for (let N = 0; N < 16; N++) {
        const Q = aa(r + Fd(p, s, a, u) + ca[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = aa(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = aa(i + Fd(x, o, c, f) + ca[z[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = aa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ca.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const j2 = ui(() => new F2()), la = BigInt(2 ** 32 - 1), Hl = BigInt(32);
function tg(t, e = !1) {
  return e ? { h: Number(t & la), l: Number(t >> Hl & la) } : { h: Number(t >> Hl & la) | 0, l: Number(t & la) | 0 };
}
function z2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = tg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const R2 = (t, e) => BigInt(t >>> 0) << Hl | BigInt(e >>> 0), G2 = (t, e, n) => t >>> n, K2 = (t, e, n) => t << 32 - n | e >>> n, V2 = (t, e, n) => t >>> n | e << 32 - n, q2 = (t, e, n) => t << 32 - n | e >>> n, W2 = (t, e, n) => t << 64 - n | e >>> n - 32, X2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Y2 = (t, e) => e, Z2 = (t, e) => t, Q2 = (t, e, n) => t << n | e >>> 32 - n, J2 = (t, e, n) => e << n | t >>> 32 - n, tx = (t, e, n) => e << n - 32 | t >>> 64 - n, ex = (t, e, n) => t << n - 32 | e >>> 64 - n;
function nx(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const rx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), sx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ix = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ox = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, ax = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), cx = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Lt = {
  fromBig: tg,
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
}, [lx, ux] = Lt.split([
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
let Ic = class extends Xu {
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
      Qr[A] = e.getUint32(n), Jr[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = Qr[A - 15] | 0, N = Jr[A - 15] | 0, Q = Lt.rotrSH(_, N, 1) ^ Lt.rotrSH(_, N, 8) ^ Lt.shrSH(_, N, 7), tt = Lt.rotrSL(_, N, 1) ^ Lt.rotrSL(_, N, 8) ^ Lt.shrSL(_, N, 7), R = Qr[A - 2] | 0, V = Jr[A - 2] | 0, k = Lt.rotrSH(R, V, 19) ^ Lt.rotrBH(R, V, 61) ^ Lt.shrSH(R, V, 6), P = Lt.rotrSL(R, V, 19) ^ Lt.rotrBL(R, V, 61) ^ Lt.shrSL(R, V, 6), b = Lt.add4L(tt, P, Jr[A - 7], Jr[A - 16]), T = Lt.add4H(b, Q, k, Qr[A - 7], Qr[A - 16]);
      Qr[A] = T | 0, Jr[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Lt.rotrSH(l, y, 14) ^ Lt.rotrSH(l, y, 18) ^ Lt.rotrBH(l, y, 41), N = Lt.rotrSL(l, y, 14) ^ Lt.rotrSL(l, y, 18) ^ Lt.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, R = Lt.add5L(z, N, tt, ux[A], Jr[A]), V = Lt.add5H(R, j, _, Q, lx[A], Qr[A]), k = R | 0, P = Lt.rotrSH(r, i, 28) ^ Lt.rotrBH(r, i, 34) ^ Lt.rotrBH(r, i, 39), b = Lt.rotrSL(r, i, 28) ^ Lt.rotrBL(r, i, 34) ^ Lt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, O = i & o ^ i & c ^ o & c;
      j = S | 0, z = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Lt.add(u | 0, f | 0, V | 0, k | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Lt.add3L(k, b, O);
      r = Lt.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Lt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Lt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Lt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Lt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Lt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Lt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: j, l: z } = Lt.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, j, z);
  }
  roundClean() {
    Qr.fill(0), Jr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, fx = class extends Ic {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, dx = class extends Ic {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, hx = class extends Ic {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ui(() => new Ic());
ui(() => new fx());
ui(() => new dx());
ui(() => new hx());
var Xa = { exports: {} };
Xa.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", x = "[object Object]", S = "[object Promise]", B = "[object RegExp]", j = "[object Set]", z = "[object String]", A = "[object Symbol]", _ = "[object WeakMap]", N = "[object ArrayBuffer]", Q = "[object DataView]", tt = "[object Float32Array]", R = "[object Float64Array]", V = "[object Int8Array]", k = "[object Int16Array]", P = "[object Int32Array]", b = "[object Uint8Array]", T = "[object Uint8ClampedArray]", O = "[object Uint16Array]", C = "[object Uint32Array]", it = /[\\^$.*+?()[\]{}|]/g, X = /\w*$/, St = /^\[object .+?Constructor\]$/, v = /^(?:0|[1-9]\d*)$/, m = {};
  m[s] = m[o] = m[N] = m[Q] = m[a] = m[c] = m[tt] = m[R] = m[V] = m[k] = m[P] = m[y] = m[p] = m[x] = m[B] = m[j] = m[z] = m[A] = m[b] = m[T] = m[O] = m[C] = !0, m[u] = m[f] = m[_] = !1;
  var W = typeof cn == "object" && cn && cn.Object === Object && cn, rt = typeof self == "object" && self && self.Object === Object && self, at = W || rt || Function("return this")(), vt = e && !e.nodeType && e, te = vt && !0 && t && !t.nodeType && t, kt = te && te.exports === vt;
  function Ht(g, M) {
    return g.set(M[0], M[1]), g;
  }
  function Mt(g, M) {
    return g.add(M), g;
  }
  function Ft(g, M) {
    for (var H = -1, ut = g ? g.length : 0; ++H < ut && M(g[H], H, g) !== !1; )
      ;
    return g;
  }
  function et(g, M) {
    for (var H = -1, ut = M.length, Re = g.length; ++H < ut; )
      g[Re + H] = M[H];
    return g;
  }
  function me(g, M, H, ut) {
    for (var Re = -1, hn = g ? g.length : 0; ++Re < hn; )
      H = M(H, g[Re], Re, g);
    return H;
  }
  function bn(g, M) {
    for (var H = -1, ut = Array(g); ++H < g; )
      ut[H] = M(H);
    return ut;
  }
  function qe(g, M) {
    return g == null ? void 0 : g[M];
  }
  function un(g) {
    var M = !1;
    if (g != null && typeof g.toString != "function")
      try {
        M = !!(g + "");
      } catch {
      }
    return M;
  }
  function ke(g) {
    var M = -1, H = Array(g.size);
    return g.forEach(function(ut, Re) {
      H[++M] = [Re, ut];
    }), H;
  }
  function Be(g, M) {
    return function(H) {
      return g(M(H));
    };
  }
  function Me(g) {
    var M = -1, H = Array(g.size);
    return g.forEach(function(ut) {
      H[++M] = ut;
    }), H;
  }
  var ee = Array.prototype, fn = Function.prototype, Oe = Object.prototype, he = at["__core-js_shared__"], qt = function() {
    var g = /[^.]+$/.exec(he && he.keys && he.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), ae = fn.toString, je = Oe.hasOwnProperty, Bn = Oe.toString, $ = RegExp(
    "^" + ae.call(je).replace(it, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), D = kt ? at.Buffer : void 0, U = at.Symbol, G = at.Uint8Array, ht = Be(Object.getPrototypeOf, Object), wt = Object.create, Wt = Oe.propertyIsEnumerable, Xt = ee.splice, se = Object.getOwnPropertySymbols, Yt = D ? D.isBuffer : void 0, Ne = Be(Object.keys, Object), Pe = K(at, "DataView"), Ot = K(at, "Map"), Et = K(at, "Promise"), Gt = K(at, "Set"), Zt = K(at, "WeakMap"), pe = K(Object, "create"), ie = le(Pe), mn = le(Ot), ge = le(Et), As = le(Gt), wi = le(Zt), en = U ? U.prototype : void 0, vs = en ? en.valueOf : void 0;
  function Mn(g) {
    var M = -1, H = g ? g.length : 0;
    for (this.clear(); ++M < H; ) {
      var ut = g[M];
      this.set(ut[0], ut[1]);
    }
  }
  function d() {
    this.__data__ = pe ? pe(null) : {};
  }
  function E(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function L(g) {
    var M = this.__data__;
    if (pe) {
      var H = M[g];
      return H === r ? void 0 : H;
    }
    return je.call(M, g) ? M[g] : void 0;
  }
  function h(g) {
    var M = this.__data__;
    return pe ? M[g] !== void 0 : je.call(M, g);
  }
  function ct(g, M) {
    var H = this.__data__;
    return H[g] = pe && M === void 0 ? r : M, this;
  }
  Mn.prototype.clear = d, Mn.prototype.delete = E, Mn.prototype.get = L, Mn.prototype.has = h, Mn.prototype.set = ct;
  function lt(g) {
    var M = -1, H = g ? g.length : 0;
    for (this.clear(); ++M < H; ) {
      var ut = g[M];
      this.set(ut[0], ut[1]);
    }
  }
  function At() {
    this.__data__ = [];
  }
  function Qt(g) {
    var M = this.__data__, H = Xe(M, g);
    if (H < 0)
      return !1;
    var ut = M.length - 1;
    return H == ut ? M.pop() : Xt.call(M, H, 1), !0;
  }
  function xe(g) {
    var M = this.__data__, H = Xe(M, g);
    return H < 0 ? void 0 : M[H][1];
  }
  function dn(g) {
    return Xe(this.__data__, g) > -1;
  }
  function Fn(g, M) {
    var H = this.__data__, ut = Xe(H, g);
    return ut < 0 ? H.push([g, M]) : H[ut][1] = M, this;
  }
  lt.prototype.clear = At, lt.prototype.delete = Qt, lt.prototype.get = xe, lt.prototype.has = dn, lt.prototype.set = Fn;
  function ye(g) {
    var M = -1, H = g ? g.length : 0;
    for (this.clear(); ++M < H; ) {
      var ut = g[M];
      this.set(ut[0], ut[1]);
    }
  }
  function mr() {
    this.__data__ = {
      hash: new Mn(),
      map: new (Ot || lt)(),
      string: new Mn()
    };
  }
  function xr(g) {
    return I(this, g).delete(g);
  }
  function Ur(g) {
    return I(this, g).get(g);
  }
  function We(g) {
    return I(this, g).has(g);
  }
  function Qn(g, M) {
    return I(this, g).set(g, M), this;
  }
  ye.prototype.clear = mr, ye.prototype.delete = xr, ye.prototype.get = Ur, ye.prototype.has = We, ye.prototype.set = Qn;
  function xn(g) {
    this.__data__ = new lt(g);
  }
  function $s() {
    this.__data__ = new lt();
  }
  function ze(g) {
    return this.__data__.delete(g);
  }
  function Hr(g) {
    return this.__data__.get(g);
  }
  function jn(g) {
    return this.__data__.has(g);
  }
  function mt(g, M) {
    var H = this.__data__;
    if (H instanceof lt) {
      var ut = H.__data__;
      if (!Ot || ut.length < n - 1)
        return ut.push([g, M]), this;
      H = this.__data__ = new ye(ut);
    }
    return H.set(g, M), this;
  }
  xn.prototype.clear = $s, xn.prototype.delete = ze, xn.prototype.get = Hr, xn.prototype.has = jn, xn.prototype.set = mt;
  function jt(g, M) {
    var H = Ie(g) || ot(g) ? bn(g.length, String) : [], ut = H.length, Re = !!ut;
    for (var hn in g)
      je.call(g, hn) && !(Re && (hn == "length" || bt(hn, ut))) && H.push(hn);
    return H;
  }
  function ce(g, M, H) {
    var ut = g[M];
    (!(je.call(g, M) && q(ut, H)) || H === void 0 && !(M in g)) && (g[M] = H);
  }
  function Xe(g, M) {
    for (var H = g.length; H--; )
      if (q(g[H][0], M))
        return H;
    return -1;
  }
  function Or(g, M) {
    return g && Ar(M, zr(M), g);
  }
  function Dr(g, M, H, ut, Re, hn, vr) {
    var pn;
    if (ut && (pn = hn ? ut(g, Re, hn, vr) : ut(g)), pn !== void 0)
      return pn;
    if (!Si(g))
      return g;
    var Gf = Ie(g);
    if (Gf) {
      if (pn = F(g), !M)
        return lo(g, pn);
    } else {
      var Ei = dt(g), Kf = Ei == f || Ei == l;
      if (Ls(g))
        return Is(g, M);
      if (Ei == x || Ei == s || Kf && !hn) {
        if (un(g))
          return hn ? g : {};
        if (pn = gt(Kf ? {} : g), !M)
          return xi(g, Or(pn, g));
      } else {
        if (!m[Ei])
          return hn ? g : {};
        pn = yt(g, Ei, Dr, M);
      }
    }
    vr || (vr = new xn());
    var Vf = vr.get(g);
    if (Vf)
      return Vf;
    if (vr.set(g, pn), !Gf)
      var qf = H ? w(g) : zr(g);
    return Ft(qf || g, function(Kc, Yo) {
      qf && (Yo = Kc, Kc = g[Yo]), ce(pn, Yo, Dr(Kc, M, H, ut, Yo, g, vr));
    }), pn;
  }
  function Fr(g) {
    return Si(g) ? wt(g) : {};
  }
  function Sr(g, M, H) {
    var ut = M(g);
    return Ie(g) ? ut : et(ut, H(g));
  }
  function jr(g) {
    return Bn.call(g);
  }
  function ks(g) {
    if (!Si(g) || _e(g))
      return !1;
    var M = nn(g) || un(g) ? $ : St;
    return M.test(le(g));
  }
  function Se(g) {
    if (!Ye(g))
      return Ne(g);
    var M = [];
    for (var H in Object(g))
      je.call(g, H) && H != "constructor" && M.push(H);
    return M;
  }
  function Is(g, M) {
    if (M)
      return g.slice();
    var H = new g.constructor(g.length);
    return g.copy(H), H;
  }
  function Jn(g) {
    var M = new g.constructor(g.byteLength);
    return new G(M).set(new G(g)), M;
  }
  function zn(g, M) {
    var H = M ? Jn(g.buffer) : g.buffer;
    return new g.constructor(H, g.byteOffset, g.byteLength);
  }
  function Rn(g, M, H) {
    var ut = M ? H(ke(g), !0) : ke(g);
    return me(ut, Ht, new g.constructor());
  }
  function tr(g) {
    var M = new g.constructor(g.source, X.exec(g));
    return M.lastIndex = g.lastIndex, M;
  }
  function bi(g, M, H) {
    var ut = M ? H(Me(g), !0) : Me(g);
    return me(ut, Mt, new g.constructor());
  }
  function Er(g) {
    return vs ? Object(vs.call(g)) : {};
  }
  function mi(g, M) {
    var H = M ? Jn(g.buffer) : g.buffer;
    return new g.constructor(H, g.byteOffset, g.length);
  }
  function lo(g, M) {
    var H = -1, ut = g.length;
    for (M || (M = Array(ut)); ++H < ut; )
      M[H] = g[H];
    return M;
  }
  function Ar(g, M, H, ut) {
    H || (H = {});
    for (var Re = -1, hn = M.length; ++Re < hn; ) {
      var vr = M[Re], pn = void 0;
      ce(H, vr, pn === void 0 ? g[vr] : pn);
    }
    return H;
  }
  function xi(g, M) {
    return Ar(g, J(g), M);
  }
  function w(g) {
    return Sr(g, zr, J);
  }
  function I(g, M) {
    var H = g.__data__;
    return zt(M) ? H[typeof M == "string" ? "string" : "hash"] : H.map;
  }
  function K(g, M) {
    var H = qe(g, M);
    return ks(H) ? H : void 0;
  }
  var J = se ? Be(se, Object) : hw, dt = jr;
  (Pe && dt(new Pe(new ArrayBuffer(1))) != Q || Ot && dt(new Ot()) != y || Et && dt(Et.resolve()) != S || Gt && dt(new Gt()) != j || Zt && dt(new Zt()) != _) && (dt = function(g) {
    var M = Bn.call(g), H = M == x ? g.constructor : void 0, ut = H ? le(H) : void 0;
    if (ut)
      switch (ut) {
        case ie:
          return Q;
        case mn:
          return y;
        case ge:
          return S;
        case As:
          return j;
        case wi:
          return _;
      }
    return M;
  });
  function F(g) {
    var M = g.length, H = g.constructor(M);
    return M && typeof g[0] == "string" && je.call(g, "index") && (H.index = g.index, H.input = g.input), H;
  }
  function gt(g) {
    return typeof g.constructor == "function" && !Ye(g) ? Fr(ht(g)) : {};
  }
  function yt(g, M, H, ut) {
    var Re = g.constructor;
    switch (M) {
      case N:
        return Jn(g);
      case a:
      case c:
        return new Re(+g);
      case Q:
        return zn(g, ut);
      case tt:
      case R:
      case V:
      case k:
      case P:
      case b:
      case T:
      case O:
      case C:
        return mi(g, ut);
      case y:
        return Rn(g, ut, H);
      case p:
      case z:
        return new Re(g);
      case B:
        return tr(g);
      case j:
        return bi(g, ut, H);
      case A:
        return Er(g);
    }
  }
  function bt(g, M) {
    return M = M ?? i, !!M && (typeof g == "number" || v.test(g)) && g > -1 && g % 1 == 0 && g < M;
  }
  function zt(g) {
    var M = typeof g;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? g !== "__proto__" : g === null;
  }
  function _e(g) {
    return !!qt && qt in g;
  }
  function Ye(g) {
    var M = g && g.constructor, H = typeof M == "function" && M.prototype || Oe;
    return g === H;
  }
  function le(g) {
    if (g != null) {
      try {
        return ae.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Sn(g) {
    return Dr(g, !0, !0);
  }
  function q(g, M) {
    return g === M || g !== g && M !== M;
  }
  function ot(g) {
    return uo(g) && je.call(g, "callee") && (!Wt.call(g, "callee") || Bn.call(g) == s);
  }
  var Ie = Array.isArray;
  function De(g) {
    return g != null && Xo(g.length) && !nn(g);
  }
  function uo(g) {
    return Gc(g) && De(g);
  }
  var Ls = Yt || pw;
  function nn(g) {
    var M = Si(g) ? Bn.call(g) : "";
    return M == f || M == l;
  }
  function Xo(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= i;
  }
  function Si(g) {
    var M = typeof g;
    return !!g && (M == "object" || M == "function");
  }
  function Gc(g) {
    return !!g && typeof g == "object";
  }
  function zr(g) {
    return De(g) ? jt(g) : Se(g);
  }
  function hw() {
    return [];
  }
  function pw() {
    return !1;
  }
  t.exports = Sn;
})(Xa, Xa.exports);
var px = Xa.exports;
const eg = /* @__PURE__ */ I0(px);
var Ol;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ol || (Ol = {}));
function gx(t, e) {
  return { type: Ol.Address, version: t, hash160: e };
}
function yx(t) {
  return fi.c32address(t.version, t.hash160);
}
const wx = (t) => j2(qp(t)), bx = (t) => pt(wx(t));
$e.hmacSha256Sync = (t, ...e) => {
  const n = Kp.create(qp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function mx(t, e = "mainnet") {
  e = jp(e), t = typeof t == "string" ? Rt(t) : t;
  const n = N2(Tr.P2PKH, e), r = gx(n, bx(t));
  return yx(r);
}
function xx(t, e) {
  const n = Ve.decodeToken(t), r = n.payload;
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
  const o = new Ve.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Sx(t, e = null) {
  let n;
  e ? n = xx(t, e) : n = Ve.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const jd = "_blockstackDidCheckEchoReply", Ex = "echoReply", Ax = "authContinuation";
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
  const e = t[jd];
  if (typeof e == "boolean")
    return e;
  const n = vx(t.location.search), r = n[Ex];
  if (r) {
    t[jd] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[Ax];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class Dl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new U0();
    else
      throw new Gw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ed(e.sessionOptions) : this.store = new Ed() : e ? this.store = new Sd(e.sessionOptions) : this.store = new Sd();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Vw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new $l("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, u2(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = l2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Mu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if ($x())
        return Ci.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ci.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = gb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Zo("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Ve.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await g2(e))
      throw new Zo("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (qc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await md(i, s.private_key);
          } catch {
            if (Ci.warn("Failed decryption of appPrivateKey, will try to use as given"), !$e.isValidPrivateKey(s.private_key))
              throw new Zo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await md(i, c);
          } catch {
            Ci.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Zo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = sb, f;
    qc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), qc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (f = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: Op(s.iss),
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
        l.profile = Object.assign({}, jw);
      else {
        const x = await p.text(), S = JSON.parse(x);
        l.profile = Sx(S[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new $l("No user data found. Did the user sign in?");
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
Dl.prototype.makeAuthRequest = Dl.prototype.makeAuthRequestToken;
const kx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Ix = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = kx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!Lc(r.id));
  return e.concat(n);
}, Lc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), ng = "STX_PROVIDER", Ws = () => typeof window > "u" ? null : window.localStorage.getItem(ng), Lx = (t) => {
  typeof window < "u" && window.localStorage.setItem(ng, t);
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
var Wi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Wi || (Wi = {}));
var Xs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Xs || (Xs = {}));
var zd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(zd || (zd = {}));
const Nx = "https://api.mainnet.hiro.so", Px = "https://api.testnet.hiro.so", _x = "http://localhost:3999", Ux = ["mainnet", "testnet", "devnet", "mocknet"];
class Ys {
  constructor(e) {
    this.version = Xs.Mainnet, this.chainId = Wi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Xs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
Ys.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Fl();
    case "testnet":
      return new jl();
    case "devnet":
      return new Hx();
    case "mocknet":
      return new rg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ux.join(", ")}`);
  }
};
Ys.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ys.fromName(t);
class Fl extends Ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Nx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Xs.Mainnet, this.chainId = Wi.Mainnet;
  }
}
class jl extends Ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Px,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Xs.Testnet, this.chainId = Wi.Testnet;
  }
}
class rg extends Ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Xs.Testnet, this.chainId = Wi.Testnet;
  }
}
const Hx = rg;
var Zs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Zs || (Zs = {}));
var Ya;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ya || (Ya = {}));
Zs.Mainnet;
var Qs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Qs || (Qs = {}));
var Js;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Js || (Js = {}));
Qs.Mainnet;
const Ox = {
  chainId: Zs.Mainnet,
  transactionVersion: Qs.Mainnet,
  peerNetworkId: Ya.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Js.MainnetSingleSig,
    multiSig: Js.MainnetMultiSig
  },
  client: { baseUrl: N0 }
}, zl = {
  chainId: Zs.Testnet,
  transactionVersion: Qs.Testnet,
  peerNetworkId: Ya.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Js.TestnetSingleSig,
    multiSig: Js.TestnetMultiSig
  },
  client: { baseUrl: P0 }
}, Na = {
  ...zl,
  addressVersion: { ...zl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: _0 }
}, Dx = {
  ...Na,
  addressVersion: { ...Na.addressVersion },
  client: { ...Na.client }
};
function Fx(t) {
  switch (t) {
    case "mainnet":
      return Ox;
    case "testnet":
      return zl;
    case "devnet":
      return Na;
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
const Rd = /* @__PURE__ */ new Map();
function sg(t, e) {
  const n = Rd.get(t);
  if (n !== void 0)
    return n(e);
  const r = zx(t);
  return Rd.set(t, r), sg(t, e);
}
let oe = class {
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
    const n = this.readBytes(e).slice().reverse(), r = pt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = pt(n);
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
    if (sg(e, r))
      return r;
    throw n(r);
  }
};
const Rx = 128, Gx = 128, ig = 16, Ds = 32, Rl = 80, Cc = 65, Kx = 32, Vx = 64, Za = 34, qx = 1 + 16 * 1024 * 1024, Wx = 165, Xx = 16, Yx = 16, Zx = 20, Qx = Yx + 2 + Zx, Jx = Qx + 4, tS = qx + (Wx + Xx * Jx);
var Vt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Vt || (Vt = {}));
var Gl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Gl || (Gl = {}));
var An;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(An || (An = {}));
const tl = ["onChainOnly", "offChainOnly", "any"];
tl[0] + "", An.OnChainOnly, tl[1] + "", An.OffChainOnly, tl[2] + "", An.Any, An.OnChainOnly + "", An.OnChainOnly, An.OffChainOnly + "", An.OffChainOnly, An.Any + "", An.Any;
var Qa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Qa || (Qa = {}));
var ue;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ue || (ue = {}));
var Ae;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ae || (Ae = {}));
var ne;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ne || (ne = {}));
var we;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(we || (we = {}));
var $o;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})($o || ($o = {}));
var Kl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Kl || (Kl = {}));
var Vl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Vl || (Vl = {}));
var an;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(an || (an = {}));
var Gd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gd || (Gd = {}));
var ql;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ql || (ql = {}));
var qn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(qn || (qn = {}));
var Kd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Kd || (Kd = {}));
let Tc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ti = class extends Tc {
  constructor(e) {
    super(e);
  }
}, sn = class extends Tc {
  constructor(e) {
    super(e);
  }
}, Ja = class extends Tc {
  constructor(e) {
    super(e);
  }
}, Ps = class extends Tc {
  constructor(e) {
    super(e);
  }
};
function Wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function eS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function og(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nS(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wl(t.outputLen), Wl(t.blockLen);
}
function rS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sS(t, e) {
  og(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _s = {
  number: Wl,
  bool: eS,
  bytes: og,
  hash: nS,
  exists: rS,
  output: sS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const el = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), rr = (t, e) => t << 32 - e | t >>> e, iS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!iS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ju(t) {
  if (typeof t == "string" && (t = oS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ag = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function di(t) {
  const e = (r) => t().update(Ju(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let cg = class extends ag {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _s.hash(e);
    const r = Ju(n);
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
};
const lg = (t, e, n) => new cg(t, e).update(n).digest();
lg.create = (t, e) => new cg(t, e);
function aS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let tf = class extends ag {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = el(this.buffer);
  }
  update(e) {
    _s.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Ju(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = el(e);
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
    aS(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = el(e), c = this.outputLen;
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
let ug = class extends tf {
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
      const y = es[l - 15], p = es[l - 2], x = rr(y, 7) ^ rr(y, 18) ^ y >>> 3, S = rr(p, 17) ^ rr(p, 19) ^ p >>> 10;
      es[l] = S + es[l - 7] + x + es[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = rr(a, 6) ^ rr(a, 11) ^ rr(a, 25), p = f + y + cS(a, c, u) + uS[l] + es[l] | 0, S = (rr(r, 2) ^ rr(r, 13) ^ rr(r, 22)) + lS(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, fS = class extends ug {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ef = di(() => new ug());
di(() => new fS());
const dS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fg = Uint8Array.from({ length: 16 }, (t, e) => e), hS = fg.map((t) => (9 * t + 5) % 16);
let nf = [fg], rf = [hS];
for (let t = 0; t < 4; t++)
  for (let e of [nf, rf])
    e.push(e[t].map((n) => dS[n]));
const dg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pS = nf.map((t, e) => t.map((n) => dg[e][n])), gS = rf.map((t, e) => t.map((n) => dg[e][n])), yS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ua = (t, e) => t << e | t >>> 32 - e;
function Vd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fa = new Uint32Array(16);
let bS = class extends tf {
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
      fa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = yS[p], B = wS[p], j = nf[p], z = rf[p], A = pS[p], _ = gS[p];
      for (let N = 0; N < 16; N++) {
        const Q = ua(r + Vd(p, s, a, u) + fa[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = ua(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = ua(i + Vd(x, o, c, f) + fa[z[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = ua(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    fa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const mS = di(() => new bS()), da = BigInt(2 ** 32 - 1), Xl = BigInt(32);
function hg(t, e = !1) {
  return e ? { h: Number(t & da), l: Number(t >> Xl & da) } : { h: Number(t >> Xl & da) | 0, l: Number(t & da) | 0 };
}
function xS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = hg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const SS = (t, e) => BigInt(t >>> 0) << Xl | BigInt(e >>> 0), ES = (t, e, n) => t >>> n, AS = (t, e, n) => t << 32 - n | e >>> n, vS = (t, e, n) => t >>> n | e << 32 - n, $S = (t, e, n) => t << 32 - n | e >>> n, kS = (t, e, n) => t << 64 - n | e >>> n - 32, IS = (t, e, n) => t >>> n - 32 | e << 64 - n, LS = (t, e) => e, CS = (t, e) => t, TS = (t, e, n) => t << n | e >>> 32 - n, BS = (t, e, n) => e << n | t >>> 32 - n, MS = (t, e, n) => e << n - 32 | t >>> 64 - n, NS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function PS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const _S = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), US = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, HS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), OS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, DS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), FS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: hg,
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
}, [jS, zS] = Ct.split([
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
let Bc = class extends tf {
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
      ns[A] = e.getUint32(n), rs[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = ns[A - 15] | 0, N = rs[A - 15] | 0, Q = Ct.rotrSH(_, N, 1) ^ Ct.rotrSH(_, N, 8) ^ Ct.shrSH(_, N, 7), tt = Ct.rotrSL(_, N, 1) ^ Ct.rotrSL(_, N, 8) ^ Ct.shrSL(_, N, 7), R = ns[A - 2] | 0, V = rs[A - 2] | 0, k = Ct.rotrSH(R, V, 19) ^ Ct.rotrBH(R, V, 61) ^ Ct.shrSH(R, V, 6), P = Ct.rotrSL(R, V, 19) ^ Ct.rotrBL(R, V, 61) ^ Ct.shrSL(R, V, 6), b = Ct.add4L(tt, P, rs[A - 7], rs[A - 16]), T = Ct.add4H(b, Q, k, ns[A - 7], ns[A - 16]);
      ns[A] = T | 0, rs[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Ct.rotrSH(l, y, 14) ^ Ct.rotrSH(l, y, 18) ^ Ct.rotrBH(l, y, 41), N = Ct.rotrSL(l, y, 14) ^ Ct.rotrSL(l, y, 18) ^ Ct.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, R = Ct.add5L(z, N, tt, zS[A], rs[A]), V = Ct.add5H(R, j, _, Q, jS[A], ns[A]), k = R | 0, P = Ct.rotrSH(r, i, 28) ^ Ct.rotrBH(r, i, 34) ^ Ct.rotrBH(r, i, 39), b = Ct.rotrSL(r, i, 28) ^ Ct.rotrBL(r, i, 34) ^ Ct.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, O = i & o ^ i & c ^ o & c;
      j = S | 0, z = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Ct.add(u | 0, f | 0, V | 0, k | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Ct.add3L(k, b, O);
      r = Ct.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Ct.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Ct.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: j, l: z } = Ct.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, j, z);
  }
  roundClean() {
    ns.fill(0), rs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, RS = class extends Bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, GS = class extends Bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, KS = class extends Bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
di(() => new Bc());
di(() => new RS());
const VS = di(() => new GS());
di(() => new KS());
var Ut;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ut || (Ut = {}));
var Ue;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ue || (Ue = {}));
function sf(t) {
  return Ue[t];
}
const qS = () => ({ type: Ut.BoolTrue }), WS = () => ({ type: Ut.BoolFalse }), XS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ut.Buffer, value: pt(t) };
}, qd = BigInt("0xffffffffffffffffffffffffffffffff"), YS = BigInt(0), Wd = BigInt("0x7fffffffffffffffffffffffffffffff"), Xd = BigInt("-170141183460469231731687303715884105728"), ZS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Il(Rt(t))), wn(t, Uint8Array) && (t = Il(t));
  const e = tn(t);
  if (e > Wd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Wd}`);
  if (e < Xd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Xd}`);
  return { type: Ut.Int, value: e };
}, QS = (t) => {
  const e = tn(t);
  if (e < YS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qd}`);
  return { type: Ut.UInt, value: e };
};
function JS(t) {
  return { type: Ut.List, value: t };
}
function pg() {
  return { type: Ut.OptionalNone };
}
function gg(t) {
  return { type: Ut.OptionalSome, value: t };
}
var st;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(st || (st = {}));
function t3() {
  return {
    type: st.Address,
    version: Js.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Yd(t) {
  if (t && vg(t, Za))
    throw new Error(`Memo exceeds maximum length of ${Za} bytes`);
  return { type: st.MemoString, content: t };
}
function of(t, e) {
  return {
    type: st.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Yl(t) {
  if (Rt(t).byteLength != Cc)
    throw Error("Invalid signature");
  return {
    type: st.MessageSignature,
    data: t
  };
}
function e3(t, e, n) {
  return typeof t == "string" && (t = w3(t)), typeof n == "string" && (n = Yd(n)), {
    type: st.Payload,
    payloadType: Vt.TokenTransfer,
    recipient: t,
    amount: tn(e),
    memo: n ?? Yd("")
  };
}
function n3(t, e, n, r) {
  return typeof e == "string" && (e = Yn(e)), typeof n == "string" && (n = Yn(n)), {
    type: st.Payload,
    payloadType: Vt.ContractCall,
    contractAddress: typeof t == "string" ? Es(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function r3(t) {
  return Yn(t, 4, 1e5);
}
function Zd(t, e, n) {
  return typeof t == "string" && (t = Yn(t)), typeof e == "string" && (e = r3(e)), typeof n == "number" ? {
    type: st.Payload,
    payloadType: Vt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: st.Payload,
    payloadType: Vt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function s3() {
  return { type: st.Payload, payloadType: Vt.PoisonMicroblock };
}
function Qd(t, e) {
  if (t.byteLength != Ds)
    throw Error(`Coinbase buffer size must be ${Ds} bytes`);
  return e != null ? {
    type: st.Payload,
    payloadType: Vt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: st.Payload,
    payloadType: Vt.Coinbase,
    coinbaseBytes: t
  };
}
function i3(t, e, n) {
  if (t.byteLength != Ds)
    throw Error(`Coinbase buffer size must be ${Ds} bytes`);
  if (n.byteLength != Rl)
    throw Error(`VRF proof buffer size must be ${Rl} bytes`);
  return {
    type: st.Payload,
    payloadType: Vt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ut.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function o3(t, e, n, r, i, s, o) {
  return {
    type: st.Payload,
    payloadType: Vt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Yn(t, e, n) {
  const r = e || 1, i = n || Rx;
  if (vg(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: st.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function a3(t, e, n) {
  return {
    type: st.Asset,
    address: Es(t),
    contractName: Yn(e),
    assetName: Yn(n)
  };
}
function Es(t) {
  const e = fi.c32addressDecode(t);
  return {
    type: st.Address,
    version: e[0],
    hash160: e[1]
  };
}
function c3(t, e) {
  const n = Es(t), r = Yn(e);
  return {
    type: st.Principal,
    prefix: an.Contract,
    address: n,
    contractName: r
  };
}
function l3(t) {
  const e = Es(t);
  return {
    type: st.Principal,
    prefix: an.Standard,
    address: e
  };
}
function Bi(t, e) {
  return {
    pubKeyEncoding: t,
    type: st.TransactionAuthField,
    contents: e
  };
}
function Lr(t) {
  switch (t.type) {
    case st.Address:
      return Vo(t);
    case st.Principal:
      return yg(t);
    case st.LengthPrefixedString:
      return Yi(t);
    case st.MemoString:
      return f3(t);
    case st.Asset:
      return bg(t);
    case st.PostCondition:
      return xg(t);
    case st.PublicKey:
      return Jl(t);
    case st.LengthPrefixedList:
      return af(t);
    case st.Payload:
      return Sg(t);
    case st.TransactionAuthField:
      return y3(t);
    case st.MessageSignature:
      return cf(t);
  }
}
function Vo(t) {
  const e = [];
  return e.push(Rt(Fo(t.version, 1))), e.push(Rt(t.hash160)), Ce(e);
}
function Xi(t) {
  const e = wn(t, oe) ? t : new oe(t), n = yc(pt(e.readBytes(1))), r = pt(e.readBytes(20));
  return { type: st.Address, version: n, hash160: r };
}
function yg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === an.Standard || t.prefix === an.Contract) && e.push(Vo(t.address)), t.prefix === an.Contract && e.push(Yi(t.contractName)), Ce(e);
}
function u3(t) {
  const e = wn(t, oe) ? t : new oe(t), n = e.readUInt8Enum(an, (s) => {
    throw new sn(`Unexpected Principal payload type: ${s}`);
  });
  if (n === an.Origin)
    return { type: st.Principal, prefix: n };
  const r = Xi(e);
  if (n === an.Standard)
    return { type: st.Principal, prefix: n, address: r };
  const i = Hn(e);
  return {
    type: st.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Yi(t) {
  const e = [], n = ai(t.content), r = n.byteLength;
  return e.push(Rt(Fo(r, t.lengthPrefixBytes))), e.push(n), Ce(e);
}
function Hn(t, e, n) {
  e = e || 1;
  const r = wn(t, oe) ? t : new oe(t), i = yc(pt(r.readBytes(e))), s = jo(r.readBytes(i));
  return Yn(s, e, n ?? 128);
}
function f3(t) {
  const e = [], n = ai(t.content), r = D3(pt(n), Za * 2);
  return e.push(Rt(r)), Ce(e);
}
function wg(t) {
  const e = wn(t, oe) ? t : new oe(t);
  let n = jo(e.readBytes(Za));
  return n = n.replace(/\u0000*$/, ""), { type: st.MemoString, content: n };
}
function bg(t) {
  const e = [];
  return e.push(Vo(t.address)), e.push(Yi(t.contractName)), e.push(Yi(t.assetName)), Ce(e);
}
function Zl(t) {
  const e = wn(t, oe) ? t : new oe(t);
  return {
    type: st.Asset,
    address: Xi(e),
    contractName: Hn(e),
    assetName: Hn(e)
  };
}
function af(t) {
  const e = t.values, n = [];
  n.push(Rt(Fo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Lr(r));
  return Ce(n);
}
function mg(t, e, n) {
  const r = wn(t, oe) ? t : new oe(t), i = yc(pt(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case st.Address:
        s.push(Xi(r));
        break;
      case st.LengthPrefixedString:
        s.push(Hn(r));
        break;
      case st.MemoString:
        s.push(wg(r));
        break;
      case st.Asset:
        s.push(Zl(r));
        break;
      case st.PostCondition:
        s.push(h3(r));
        break;
      case st.PublicKey:
        s.push(tu(r));
        break;
      case st.TransactionAuthField:
        s.push(g3(r));
        break;
    }
  return of(s, n);
}
function d3(t) {
  return pt(xg(t));
}
function xg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(yg(t.principal)), (t.conditionType === ue.Fungible || t.conditionType === ue.NonFungible) && e.push(bg(t.asset)), t.conditionType === ue.NonFungible && e.push(fr(t.assetName)), e.push(t.conditionCode), t.conditionType === ue.STX || t.conditionType === ue.Fungible || t.conditionType === ue.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ti("The post-condition amount may not be larger than 8 bytes");
    e.push(xs(t.amount, 8));
  }
  return Ce(e);
}
function h3(t) {
  const e = wn(t, oe) ? t : new oe(t), n = e.readUInt8Enum(ue, (a) => {
    throw new sn(`Could not read ${a} as PostConditionType`);
  }), r = u3(e);
  let i, s, o;
  switch (n) {
    case ue.STX:
      return i = e.readUInt8Enum($o, (c) => {
        throw new sn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${pt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: ue.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ue.Fungible:
      return s = Zl(e), i = e.readUInt8Enum($o, (c) => {
        throw new sn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${pt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: ue.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ue.NonFungible:
      s = Zl(e);
      const a = cr(e);
      return i = e.readUInt8Enum(Kl, (c) => {
        throw new sn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: st.PostCondition,
        conditionType: ue.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ue.Staking:
      return i = e.readUInt8Enum($o, (c) => {
        throw new sn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${pt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: ue.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ue.PoX: {
      const c = e.readUInt8Enum(Vl, (u) => {
        throw new sn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: st.PostCondition,
        conditionType: ue.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Sg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Vt.TokenTransfer:
      e.push(fr(t.recipient)), e.push(xs(t.amount, 8)), e.push(Lr(t.memo));
      break;
    case Vt.ContractCall:
      e.push(Lr(t.contractAddress)), e.push(Lr(t.contractName)), e.push(Lr(t.functionName));
      const n = new Uint8Array(4);
      Rs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(fr(r));
      });
      break;
    case Vt.SmartContract:
      e.push(Lr(t.contractName)), e.push(Lr(t.codeBody));
      break;
    case Vt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Lr(t.contractName)), e.push(Lr(t.codeBody));
      break;
    case Vt.PoisonMicroblock:
      break;
    case Vt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Vt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(fr(t.recipient));
      break;
    case Vt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(fr(t.recipient ? gg(t.recipient) : pg())), e.push(t.vrfProof);
      break;
    case Vt.TenureChange:
      e.push(Rt(t.tenureHash)), e.push(Rt(t.previousTenureHash)), e.push(Rt(t.burnViewHash)), e.push(Rt(t.previousTenureEnd)), e.push(Rs(new Uint8Array(4), t.previousTenureBlocks)), e.push(ub(new Uint8Array(1), t.cause)), e.push(Rt(t.publicKeyHash));
      break;
  }
  return Ce(e);
}
function p3(t) {
  const e = wn(t, oe) ? t : new oe(t);
  switch (e.readUInt8Enum(Vt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Vt.TokenTransfer:
      const r = cr(e), i = tn(e.readBytes(8)), s = wg(e);
      return e3(r, i, s);
    case Vt.ContractCall:
      const o = Xi(e), a = Hn(e), c = Hn(e), u = [], f = e.readUInt32BE();
      for (let _ = 0; _ < f; _++) {
        const N = cr(e);
        u.push(N);
      }
      return n3(o, a, c, u);
    case Vt.SmartContract:
      const l = Hn(e), y = Hn(e, 4, 1e5);
      return Zd(l, y);
    case Vt.VersionedSmartContract: {
      const _ = e.readUInt8Enum(Gl, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), N = Hn(e), Q = Hn(e, 4, tS);
      return Zd(N, Q, _);
    }
    case Vt.PoisonMicroblock:
      return s3();
    case Vt.Coinbase: {
      const _ = e.readBytes(Ds);
      return Qd(_);
    }
    case Vt.CoinbaseToAltRecipient: {
      const _ = e.readBytes(Ds), N = cr(e);
      return Qd(_, N);
    }
    case Vt.NakamotoCoinbase: {
      const _ = e.readBytes(Ds), N = cr(e), Q = e.readBytes(Rl);
      return i3(_, N, Q);
    }
    case Vt.TenureChange:
      const p = pt(e.readBytes(20)), x = pt(e.readBytes(20)), S = pt(e.readBytes(20)), B = pt(e.readBytes(32)), j = e.readUInt32BE(), z = e.readUInt8Enum(ql, (_) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${_}`);
      }), A = pt(e.readBytes(20));
      return o3(p, x, S, B, j, z, A);
  }
}
function Ql(t) {
  const e = wn(t, oe) ? t : new oe(t);
  return Yl(pt(e.readBytes(Cc)));
}
function g3(t) {
  const e = wn(t, oe) ? t : new oe(t), n = e.readUInt8Enum(qn, (r) => {
    throw new sn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case qn.PublicKeyCompressed:
      return Bi(we.Compressed, tu(e));
    case qn.PublicKeyUncompressed:
      return Bi(we.Uncompressed, so(Y3(tu(e).data)));
    case qn.SignatureCompressed:
      return Bi(we.Compressed, Ql(e));
    case qn.SignatureUncompressed:
      return Bi(we.Uncompressed, Ql(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function cf(t) {
  return Rt(t.data);
}
function y3(t) {
  const e = [];
  switch (t.contents.type) {
    case st.PublicKey:
      e.push(t.pubKeyEncoding === we.Compressed ? qn.PublicKeyCompressed : qn.PublicKeyUncompressed), e.push(Rt(X3(t.contents.data)));
      break;
    case st.MessageSignature:
      e.push(t.pubKeyEncoding === we.Compressed ? qn.SignatureCompressed : qn.SignatureUncompressed), e.push(cf(t.contents));
      break;
  }
  return Ce(e);
}
function Jl(t) {
  return t.data.slice();
}
function tu(t) {
  const e = wn(t, oe) ? t : new oe(t), n = e.readUInt8(), r = n === 4 ? Vx : Kx;
  return so(Ce([n, e.readBytes(r)]));
}
function lf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ne.P2PKH || e === ne.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ne.P2WPKH || e === ne.P2WSH || e === ne.P2WSHNonSequential) && !r.map((i) => i.data).every(io))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ne.P2PKH:
      return ha(t, F3(r[0].data));
    case ne.P2WPKH:
      return ha(t, j3(r[0].data));
    case ne.P2SH:
    case ne.P2SHNonSequential:
      return ha(t, z3(n, r.map(Jl)));
    case ne.P2WSH:
    case ne.P2WSHNonSequential:
      return ha(t, R3(n, r.map(Jl)));
  }
}
function ha(t, e) {
  return { type: st.Address, version: t, hash160: e };
}
function uf(t) {
  return fi.c32address(t.version, t.hash160);
}
function Jd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return a3(e, n, r);
}
function go(t) {
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
  const e = Es(t);
  return { type: Ut.PrincipalStandard, value: uf(e) };
}
function m3(t) {
  return { type: Ut.PrincipalStandard, value: uf(t) };
}
function x3(t, e) {
  const n = Es(t), r = Yn(e);
  return Eg(n, r);
}
function Eg(t, e) {
  if (ai(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ut.PrincipalContract,
    value: `${uf(t)}.${e.content}`
  };
}
function S3(t) {
  return { type: Ut.ResponseErr, value: t };
}
function E3(t) {
  return { type: Ut.ResponseOk, value: t };
}
const A3 = (t) => ({ type: Ut.StringASCII, value: t }), v3 = (t) => ({ type: Ut.StringUTF8, value: t });
function $3(t) {
  for (const e in t)
    if (!G3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ut.Tuple, value: t };
}
function cr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new oe(Rt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new oe(t) : e = t;
  switch (e.readUInt8Enum(Ue, (r) => {
    throw new sn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ue.int:
      return ZS(Il(e.readBytes(16)));
    case Ue.uint:
      return QS(e.readBytes(16));
    case Ue.buffer:
      const r = e.readUInt32BE();
      return XS(e.readBytes(r));
    case Ue.true:
      return qS();
    case Ue.false:
      return WS();
    case Ue.address:
      const i = Xi(e);
      return m3(i);
    case Ue.contract:
      const s = Xi(e), o = Hn(e);
      return Eg(s, o);
    case Ue.ok:
      return E3(cr(e));
    case Ue.err:
      return S3(cr(e));
    case Ue.none:
      return pg();
    case Ue.some:
      return gg(cr(e));
    case Ue.list:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(cr(e));
      return JS(c);
    case Ue.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const B = Hn(e).content;
        if (B === void 0)
          throw new sn('"content" is undefined');
        f[B] = cr(e);
      }
      return $3(f);
    case Ue.ascii:
      const l = e.readUInt32BE(), y = nb(e.readBytes(l));
      return A3(y);
    case Ue.utf8:
      const p = e.readUInt32BE(), x = jo(e.readBytes(p));
      return v3(x);
    default:
      throw new sn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function yr(t, e) {
  return Ce([sf(t), e]);
}
function k3(t) {
  return new Uint8Array([sf(t.type)]);
}
function I3(t) {
  return t.type === Ut.OptionalNone ? new Uint8Array([sf(t.type)]) : yr(t.type, fr(t.value));
}
function L3(t) {
  const e = new Uint8Array(4);
  return Rs(e, Math.ceil(t.value.length / 2), 0), yr(t.type, pr(e, Rt(t.value)));
}
function C3(t) {
  const e = Nu(Zw(BigInt(t.value), BigInt(Gx)), ig);
  return yr(t.type, e);
}
function T3(t) {
  const e = Nu(BigInt(t.value), ig);
  return yr(t.type, e);
}
function B3(t) {
  return yr(t.type, Vo(Es(t.value)));
}
function M3(t) {
  const [e, n] = K3(t.value);
  return yr(t.type, pr(Vo(Es(e)), Yi(Yn(n))));
}
function N3(t) {
  return yr(t.type, fr(t.value));
}
function P3(t) {
  const e = [], n = new Uint8Array(4);
  Rs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = fr(r);
    e.push(i);
  }
  return yr(t.type, Ce(e));
}
function _3(t) {
  const e = [], n = new Uint8Array(4);
  Rs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Yn(i);
    e.push(Yi(s));
    const o = fr(t.value[i]);
    e.push(o);
  }
  return yr(t.type, Ce(e));
}
function Ag(t, e) {
  const n = [], r = e == "ascii" ? eb(t.value) : ai(t.value), i = new Uint8Array(4);
  return Rs(i, r.length, 0), n.push(i), n.push(r), yr(t.type, Ce(n));
}
function U3(t) {
  return Ag(t, "ascii");
}
function H3(t) {
  return Ag(t, "utf8");
}
function th(t) {
  return pt(fr(t));
}
function fr(t) {
  switch (t.type) {
    case Ut.BoolTrue:
    case Ut.BoolFalse:
      return k3(t);
    case Ut.OptionalNone:
    case Ut.OptionalSome:
      return I3(t);
    case Ut.Buffer:
      return L3(t);
    case Ut.UInt:
      return T3(t);
    case Ut.Int:
      return C3(t);
    case Ut.PrincipalStandard:
      return B3(t);
    case Ut.PrincipalContract:
      return M3(t);
    case Ut.ResponseOk:
    case Ut.ResponseErr:
      return N3(t);
    case Ut.List:
      return P3(t);
    case Ut.Tuple:
      return _3(t);
    case Ut.StringASCII:
      return U3(t);
    case Ut.StringUTF8:
      return H3(t);
    default:
      throw new Ti("Unable to serialize. Invalid Clarity Value.");
  }
}
const O3 = (t) => t.length % 2 ? `0${t}` : t, D3 = (t, e) => t.padEnd(e, "0"), vg = (t, e) => t ? ai(t).length > e : !1;
function eu(t) {
  return eg(t);
}
const To = (t) => mS(ef(t)), ff = (t) => pt(VS(t)), F3 = (t) => pt(To(t)), j3 = (t) => {
  const e = To(t), n = pr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = To(n);
  return pt(r);
}, z3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Ce(n), i = To(r);
  return pt(i);
}, R3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ce(n), i = ef(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Ce(s), a = To(o);
  return pt(a);
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
$e.hmacSha256Sync = (t, ...e) => {
  const n = lg.create(ef, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function so(t) {
  return t = typeof t == "string" ? Rt(t) : t, {
    type: st.PublicKey,
    data: t
  };
}
function V3(t, e, n = we.Compressed) {
  const r = ob(e), i = new Ln(td(r.r), td(r.s)), s = Pt.fromSignature(t, i, r.recoveryId), o = n === we.Compressed;
  return s.toHex(o);
}
function q3(t) {
  return typeof t == "string" ? t : pt(t);
}
const df = q3;
function $g(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ib;
}
function io(t) {
  return !df(t).startsWith("04");
}
function W3(t) {
  t = Pu(t);
  const e = $g(t);
  return pt(zo(t.slice(0, 32), e));
}
function X3(t) {
  return Pt.fromHex(df(t)).toHex(!0);
}
function Y3(t) {
  return Pt.fromHex(df(t)).toHex(!1);
}
function Z3(t, e) {
  t = Pu(t);
  const [n, r] = bc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Fo(r, 1) + Ln.fromHex(n).toCompactHex();
}
function hf() {
  return {
    type: st.MessageSignature,
    data: pt(new Uint8Array(Cc))
  };
}
function kg(t, e, n, r) {
  const i = lf(0, t, 1, [so(e)]).hash160, s = io(e) ? we.Compressed : we.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: tn(n),
    fee: tn(r),
    keyEncoding: s,
    signature: hf()
  };
}
function Bo(t) {
  return "signature" in t;
}
function eh(t) {
  return t === ne.P2SH || t === ne.P2WSH;
}
function Q3(t) {
  return t === ne.P2SHNonSequential || t === ne.P2WSHNonSequential;
}
function nh(t) {
  const e = eu(t);
  return e.nonce = 0, e.fee = 0, Bo(e) ? e.signature = hf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function J3(t) {
  const e = [
    t.hashMode,
    Rt(t.signer),
    xs(t.nonce, 8),
    xs(t.fee, 8),
    t.keyEncoding,
    cf(t.signature)
  ];
  return Ce(e);
}
function tE(t) {
  const e = [
    t.hashMode,
    Rt(t.signer),
    xs(t.nonce, 8),
    xs(t.fee, 8)
  ], n = of(t.fields);
  e.push(af(n));
  const r = new Uint8Array(2);
  return cb(r, t.signaturesRequired, 0), e.push(r), Ce(e);
}
function eE(t, e) {
  const n = pt(e.readBytes(20)), r = BigInt(`0x${pt(e.readBytes(8))}`), i = BigInt(`0x${pt(e.readBytes(8))}`), s = e.readUInt8Enum(we, (a) => {
    throw new sn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ne.P2WPKH && s != we.Compressed)
    throw new sn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ql(e);
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
  const n = pt(e.readBytes(20)), r = BigInt("0x" + pt(e.readBytes(8))), i = BigInt("0x" + pt(e.readBytes(8))), s = mg(e, st.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case st.PublicKey:
        io(u.contents.data) || (o = !0);
        break;
      case st.MessageSignature:
        if (u.pubKeyEncoding === we.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Ps("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ne.P2WSH || t === ne.P2WSHNonSequential))
    throw new Ps("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function nl(t) {
  return Bo(t) ? J3(t) : tE(t);
}
function rl(t) {
  const e = t.readUInt8Enum(ne, (n) => {
    throw new sn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ne.P2PKH || e === ne.P2WPKH ? eE(e, t) : nE(e, t);
}
function Ig(t, e, n, r) {
  const s = t + pt(new Uint8Array([e])) + pt(xs(n, 8)) + pt(xs(r, 8));
  if (Rt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return ff(Rt(s));
}
function Lg(t, e, n) {
  const r = 33 + Cc, i = io(e.data) ? we.Compressed : we.Uncompressed, s = t + O3(i.toString(16)) + n, o = Rt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return ff(o);
}
function rE(t, e, n, r, i) {
  const s = Ig(t, e, n, r), o = Z3(i, s), a = so(W3(i)), c = Lg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Cg(t, e, n, r, i, s) {
  const o = Ig(t, e, n, r), a = so(V3(o, s, i)), c = Lg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function sE() {
  const t = kg(ne.P2PKH, "", 0, 0);
  return t.signer = t3().hash160, t.keyEncoding = we.Compressed, t.signature = hf(), t;
}
function rh(t, e, n) {
  return Bo(t) ? iE(t, e, n) : oE(t, e, n);
}
function iE(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Cg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = lf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Ps(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function oE(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case st.PublicKey:
        io(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case st.MessageSignature:
        c.pubKeyEncoding === we.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: f } = Cg(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (eh(t.hashMode) && (i = f), r.push(u), o += 1, o === 65536)
          throw new Ps("Too many signatures");
        break;
    }
  if (eh(t.hashMode) && o !== t.signaturesRequired || Q3(t.hashMode) && o < t.signaturesRequired)
    throw new Ps("Incorrect number of signatures");
  if (s && (t.hashMode === ne.P2WSH || t.hashMode === ne.P2WSHNonSequential))
    throw new Ps("Uncompressed keys are not allowed in this hash mode");
  const a = lf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ps(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Tg(t) {
  return {
    authType: Ae.Standard,
    spendingCondition: t
  };
}
function Bg(t, e) {
  return {
    authType: Ae.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || kg(ne.P2PKH, "0".repeat(66), 0, 0)
  };
}
function sh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ae.Standard:
        return Tg(nh(t.spendingCondition));
      case Ae.Sponsored:
        return Bg(nh(t.spendingCondition), sE());
      default:
        throw new Ja("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function aE(t, e) {
  switch (t.authType) {
    case Ae.Standard:
      return rh(t.spendingCondition, e, Ae.Standard);
    case Ae.Sponsored:
      return rh(t.spendingCondition, e, Ae.Standard);
    default:
      throw new Ja("Invalid origin auth type");
  }
}
function cE(t, e) {
  switch (t.authType) {
    case Ae.Standard:
      const n = {
        ...t.spendingCondition,
        fee: tn(e)
      };
      return { ...t, spendingCondition: n };
    case Ae.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: tn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function lE(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: tn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function uE(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: tn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function fE(t, e) {
  const n = {
    ...e,
    nonce: tn(e.nonce),
    fee: tn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function dE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ae.Standard:
      e.push(nl(t.spendingCondition));
      break;
    case Ae.Sponsored:
      e.push(nl(t.spendingCondition)), e.push(nl(t.sponsorSpendingCondition));
      break;
  }
  return Ce(e);
}
function hE(t) {
  const e = t.readUInt8Enum(Ae, (r) => {
    throw new sn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ae.Standard:
      return n = rl(t), Tg(n);
    case Ae.Sponsored:
      n = rl(t);
      const r = rl(t);
      return Bg(n, r);
  }
}
class pE {
  constructor({ auth: e, payload: n, postConditions: r = of([]), postConditionMode: i = Qa.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = jx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: tn(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = An.Any;
  }
  signBegin() {
    const e = eu(this);
    return e.auth = sh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = eu(this);
    return e.auth = sh(e.auth), e.txid();
  }
  verifyOrigin() {
    return aE(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ae.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ae.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ae.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : so(e), r = this.auth.spendingCondition;
    if (r && !Bo(r)) {
      const i = io(n.data);
      r.fields.push(Bi(i ? we.Compressed : we.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = rE(n, r, e.fee, e.nonce, i);
    if (Bo(e))
      e.signature = Yl(s);
    else {
      const a = $g(i);
      e.fields.push(Bi(a ? we.Compressed : we.Uncompressed, Yl(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return ff(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ae.Sponsored)
      throw new Ja("Cannot sponsor sign a non-sponsored transaction");
    this.auth = fE(this.auth, e);
  }
  setFee(e) {
    this.auth = cE(this.auth, e);
  }
  setNonce(e) {
    this.auth = lE(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ae.Sponsored)
      throw new Ja("Cannot sponsor sign a non-sponsored transaction");
    this.auth = uE(this.auth, e);
  }
  serialize() {
    return pt(this.serializeBytes());
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
    return Rs(n, this.chainId, 0), e.push(n), e.push(dE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(af(this.postConditions)), e.push(Sg(this.payload)), Ce(e);
  }
}
function gE(t) {
  const e = wn(t, oe) ? t : new oe(t), n = e.readUInt8Enum(Qs, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = hE(e), s = e.readUInt8Enum(An, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Qa, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = mg(e, st.PostCondition), c = p3(e), u = new pE({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const ih = BigInt("18446744073709551615");
function sl(t) {
  const e = tn(t);
  if (e < 0n || e > ih)
    throw new RangeError(`Post-condition amount must be between 0 and ${ih} (u64 max), received: ${e}`);
  return e;
}
var nu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(nu || (nu = {}));
var ru;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ru || (ru = {}));
function yE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: st.PostCondition,
        conditionType: ue.STX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: an.Origin } : go(t.address),
        conditionCode: pa(t.condition),
        amount: sl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: ue.Fungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: an.Origin } : go(t.address),
        conditionCode: pa(t.condition),
        amount: sl(t.amount),
        asset: Jd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: ue.NonFungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: an.Origin } : go(t.address),
        conditionCode: pa(t.condition),
        asset: Jd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: st.PostCondition,
        conditionType: ue.Staking,
        principal: t.address === "origin" ? { type: st.Principal, prefix: an.Origin } : go(t.address),
        conditionCode: pa(t.condition),
        amount: sl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: st.PostCondition,
        conditionType: ue.PoX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: an.Origin } : go(t.address),
        conditionCode: wE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function pa(t) {
  return nu[t];
}
function wE(t) {
  return ru[t];
}
function Mg(t) {
  const e = yE(t);
  return d3(e);
}
function bE(t, e, n) {
  return gf(Ng(t), n);
}
function Ng(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Mo(r);
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
function pf(t, e = 8) {
  return (typeof t == "bigint" ? t : Ng(t)).toString(16).padStart(e * 2, "0");
}
function gf(t, e = 16) {
  const n = pf(t, e);
  return Mo(n);
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
function Mo(t) {
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
function yf(t) {
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
function oh(t) {
  if (t.some(AE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function wf(...t) {
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
function _r(t) {
  return wf(...t.map((e) => typeof e == "number" ? oh([e]) : e instanceof Array ? oh(e) : e));
}
function Mc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var su;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(su || (su = {}));
su.Mainnet;
const vE = 128, $E = 128, Pg = 16;
var iu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(iu || (iu = {}));
var ah;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ah || (ah = {}));
var ch;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ch || (ch = {}));
var Vn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Vn || (Vn = {}));
const il = ["onChainOnly", "offChainOnly", "any"];
il[0] + "", Vn.OnChainOnly, il[1] + "", Vn.OffChainOnly, il[2] + "", Vn.Any, Vn.OnChainOnly + "", Vn.OnChainOnly, Vn.OffChainOnly + "", Vn.OffChainOnly, Vn.Any + "", Vn.Any;
var ou;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ou || (ou = {}));
ou.Mainnet;
var lh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(lh || (lh = {}));
var Ts;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ts || (Ts = {}));
var uh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(uh || (uh = {}));
var fh;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(fh || (fh = {}));
var dh;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(dh || (dh = {}));
var hh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(hh || (hh = {}));
var ph;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(gh || (gh = {}));
var au;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(au || (au = {}));
var yh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yh || (yh = {}));
var wh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(wh || (wh = {}));
function cu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function kE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _g(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function IE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  cu(t.outputLen), cu(t.blockLen);
}
function LE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function CE(t, e) {
  _g(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ol = {
  number: cu,
  bool: kE,
  bytes: _g,
  hash: IE,
  exists: LE,
  output: CE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const al = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), sr = (t, e) => t << 32 - e | t >>> e, TE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!TE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function BE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ug(t) {
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
function hi(t) {
  const e = (r) => t().update(Ug(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function NE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let bf = class extends ME {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = al(this.buffer);
  }
  update(e) {
    ol.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Ug(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = al(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ol.exists(this), ol.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    NE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = al(e), c = this.outputLen;
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
const PE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hg = Uint8Array.from({ length: 16 }, (t, e) => e), _E = Hg.map((t) => (9 * t + 5) % 16);
let mf = [Hg], xf = [_E];
for (let t = 0; t < 4; t++)
  for (let e of [mf, xf])
    e.push(e[t].map((n) => PE[n]));
const Og = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), UE = mf.map((t, e) => t.map((n) => Og[e][n])), HE = xf.map((t, e) => t.map((n) => Og[e][n])), OE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), DE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ga = (t, e) => t << e | t >>> 32 - e;
function bh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ya = new Uint32Array(16);
let FE = class extends bf {
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
      ya[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = OE[p], B = DE[p], j = mf[p], z = xf[p], A = UE[p], _ = HE[p];
      for (let N = 0; N < 16; N++) {
        const Q = ga(r + bh(p, s, a, u) + ya[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = ga(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = ga(i + bh(x, o, c, f) + ya[z[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = ga(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ya.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
hi(() => new FE());
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
let Dg = class extends bf {
  constructor() {
    super(64, 32, 8, !1), this.A = ss[0] | 0, this.B = ss[1] | 0, this.C = ss[2] | 0, this.D = ss[3] | 0, this.E = ss[4] | 0, this.F = ss[5] | 0, this.G = ss[6] | 0, this.H = ss[7] | 0;
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
      is[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = is[l - 15], p = is[l - 2], x = sr(y, 7) ^ sr(y, 18) ^ y >>> 3, S = sr(p, 17) ^ sr(p, 19) ^ p >>> 10;
      is[l] = S + is[l - 7] + x + is[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = sr(a, 6) ^ sr(a, 11) ^ sr(a, 25), p = f + y + jE(a, c, u) + RE[l] + is[l] | 0, S = (sr(r, 2) ^ sr(r, 13) ^ sr(r, 22)) + zE(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    is.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, GE = class extends Dg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
hi(() => new Dg());
hi(() => new GE());
const wa = BigInt(2 ** 32 - 1), lu = BigInt(32);
function Fg(t, e = !1) {
  return e ? { h: Number(t & wa), l: Number(t >> lu & wa) } : { h: Number(t >> lu & wa) | 0, l: Number(t & wa) | 0 };
}
function KE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Fg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const VE = (t, e) => BigInt(t >>> 0) << lu | BigInt(e >>> 0), qE = (t, e, n) => t >>> n, WE = (t, e, n) => t << 32 - n | e >>> n, XE = (t, e, n) => t >>> n | e << 32 - n, YE = (t, e, n) => t << 32 - n | e >>> n, ZE = (t, e, n) => t << 64 - n | e >>> n - 32, QE = (t, e, n) => t >>> n - 32 | e << 64 - n, JE = (t, e) => e, tA = (t, e) => t, eA = (t, e, n) => t << n | e >>> 32 - n, nA = (t, e, n) => e << n | t >>> 32 - n, rA = (t, e, n) => e << n - 32 | t >>> 64 - n, sA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function iA(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const oA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), aA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, cA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lA = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, uA = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), fA = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: Fg,
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
}, [dA, hA] = Tt.split([
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
let Nc = class extends bf {
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
      os[A] = e.getUint32(n), as[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = os[A - 15] | 0, N = as[A - 15] | 0, Q = Tt.rotrSH(_, N, 1) ^ Tt.rotrSH(_, N, 8) ^ Tt.shrSH(_, N, 7), tt = Tt.rotrSL(_, N, 1) ^ Tt.rotrSL(_, N, 8) ^ Tt.shrSL(_, N, 7), R = os[A - 2] | 0, V = as[A - 2] | 0, k = Tt.rotrSH(R, V, 19) ^ Tt.rotrBH(R, V, 61) ^ Tt.shrSH(R, V, 6), P = Tt.rotrSL(R, V, 19) ^ Tt.rotrBL(R, V, 61) ^ Tt.shrSL(R, V, 6), b = Tt.add4L(tt, P, as[A - 7], as[A - 16]), T = Tt.add4H(b, Q, k, os[A - 7], os[A - 16]);
      os[A] = T | 0, as[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Tt.rotrSH(l, y, 14) ^ Tt.rotrSH(l, y, 18) ^ Tt.rotrBH(l, y, 41), N = Tt.rotrSL(l, y, 14) ^ Tt.rotrSL(l, y, 18) ^ Tt.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, R = Tt.add5L(z, N, tt, hA[A], as[A]), V = Tt.add5H(R, j, _, Q, dA[A], os[A]), k = R | 0, P = Tt.rotrSH(r, i, 28) ^ Tt.rotrBH(r, i, 34) ^ Tt.rotrBH(r, i, 39), b = Tt.rotrSL(r, i, 28) ^ Tt.rotrBL(r, i, 34) ^ Tt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, O = i & o ^ i & c ^ o & c;
      j = S | 0, z = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Tt.add(u | 0, f | 0, V | 0, k | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Tt.add3L(k, b, O);
      r = Tt.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Tt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Tt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Tt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: j, l: z } = Tt.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, j, z);
  }
  roundClean() {
    os.fill(0), as.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, pA = class extends Nc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gA = class extends Nc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, yA = class extends Nc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hi(() => new Nc());
hi(() => new pA());
hi(() => new gA());
hi(() => new yA());
function wA(t, e, n) {
  const i = vE;
  if (NA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: iu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Fe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Fe || (Fe = {}));
let bA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, jg = class extends bA {
  constructor(e) {
    super(e);
  }
};
function Pc(t) {
  const e = [];
  return e.push(Mo(pf(t.version, 1))), e.push(Mo(t.hash160)), _r(e);
}
function mA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Pc(t.address)), t.prefix === au.Contract && e.push(No(t.contractName)), _r(e);
}
function No(t) {
  const e = [], n = yf(t.content), r = n.byteLength;
  return e.push(Mo(pf(r, t.lengthPrefixBytes))), e.push(n), _r(e);
}
function xA(t) {
  const e = [];
  return e.push(Pc(t.address)), e.push(No(t.contractName)), e.push(No(t.assetName)), _r(e);
}
function zg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(mA(t.principal)), (t.conditionType === Ts.Fungible || t.conditionType === Ts.NonFungible) && e.push(xA(t.assetInfo)), t.conditionType === Ts.NonFungible && e.push(ti(t.assetName)), e.push(t.conditionCode), t.conditionType === Ts.STX || t.conditionType === Ts.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new jg("The post-condition amount may not be larger than 8 bytes");
    e.push(bE(t.amount, !1, 8));
  }
  return _r(e);
}
function wr(t, e) {
  return _r([t, e]);
}
function SA(t) {
  return new Uint8Array([t.type]);
}
function EA(t) {
  return t.type === Fe.OptionalNone ? new Uint8Array([t.type]) : wr(t.type, ti(t.value));
}
function AA(t) {
  const e = new Uint8Array(4);
  return Mc(e, t.buffer.length, 0), wr(t.type, wf(e, t.buffer));
}
function vA(t) {
  const e = gf(mE(t.value, BigInt($E)), Pg);
  return wr(t.type, e);
}
function $A(t) {
  const e = gf(t.value, Pg);
  return wr(t.type, e);
}
function kA(t) {
  return wr(t.type, Pc(t.address));
}
function IA(t) {
  return wr(t.type, wf(Pc(t.address), No(t.contractName)));
}
function LA(t) {
  return wr(t.type, ti(t.value));
}
function CA(t) {
  const e = [], n = new Uint8Array(4);
  Mc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = ti(r);
    e.push(i);
  }
  return wr(t.type, _r(e));
}
function TA(t) {
  const e = [], n = new Uint8Array(4);
  Mc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = wA(i);
    e.push(No(s));
    const o = ti(t.data[i]);
    e.push(o);
  }
  return wr(t.type, _r(e));
}
function Rg(t, e) {
  const n = [], r = e == "ascii" ? EE(t.data) : yf(t.data), i = new Uint8Array(4);
  return Mc(i, r.length, 0), n.push(i), n.push(r), wr(t.type, _r(n));
}
function BA(t) {
  return Rg(t, "ascii");
}
function MA(t) {
  return Rg(t, "utf8");
}
function ti(t) {
  switch (t.type) {
    case Fe.BoolTrue:
    case Fe.BoolFalse:
      return SA(t);
    case Fe.OptionalNone:
    case Fe.OptionalSome:
      return EA(t);
    case Fe.Buffer:
      return AA(t);
    case Fe.UInt:
      return $A(t);
    case Fe.Int:
      return vA(t);
    case Fe.PrincipalStandard:
      return kA(t);
    case Fe.PrincipalContract:
      return IA(t);
    case Fe.ResponseOk:
    case Fe.ResponseErr:
      return LA(t);
    case Fe.List:
      return CA(t);
    case Fe.Tuple:
      return TA(t);
    case Fe.StringASCII:
      return BA(t);
    case Fe.StringUTF8:
      return MA(t);
    default:
      throw new jg("Unable to serialize. Invalid Clarity Value.");
  }
}
const NA = (t, e) => t ? yf(t).length > e : !1, PA = "connect-ui";
let Pa, Gg, vn = !1, uu = !1;
const Pr = (t, e = "") => () => {
}, _A = (t, e) => () => {
}, UA = "{visibility:hidden}.hydrated{visibility:inherit}", mh = {}, HA = "http://www.w3.org/2000/svg", OA = "http://www.w3.org/1999/xhtml", DA = (t) => t != null, Sf = (t) => (t = typeof t, t === "object" || t === "function");
function Kg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const $t = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !Sf(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? fu(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = fu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, fu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, FA = {}, jA = (t) => t && t.$tag$ === FA, zA = (t, e) => t != null && !Sf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, RA = (t) => oo(t).$hostElement$, GA = (t, e, n) => {
  const r = Je.ce(e, n);
  return t.dispatchEvent(r), r;
}, xh = /* @__PURE__ */ new WeakMap(), KA = (t, e, n) => {
  let r = tc.get(t);
  f4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, tc.set(t, r);
}, VA = (t, e, n, r) => {
  var i;
  let s = Vg(e);
  const o = tc.get(s);
  if (t = t.nodeType === 11 ? t : dr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = xh.get(t), c;
      if (a || xh.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = dr.createElement("style"), c.innerHTML = o;
          const u = (i = Je.$nonce$) !== null && i !== void 0 ? i : Kg(dr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, qA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = Pr("attachStyles", e.$tagName$), s = VA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, Vg = (t, e) => "sc-" + t.$tagName$, Sh = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = Ah(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Eh(n), f = Eh(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Ah(_c, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Je.rel(t, e, n, !1), r && Je.ael(t, e, r, !1);
    else {
      const c = Sf(r);
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
}, WA = /\s/, Eh = (t) => t ? t.split(WA) : [], qg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || mh, o = e.$attrs$ || mh;
  for (r in s)
    r in o || Sh(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    Sh(i, r, s[r], o[r], n, e.$flags$);
}, Ef = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = dr.createTextNode(i.$text$);
  else {
    if (vn || (vn = i.$tag$ === "svg"), o = i.$elm$ = dr.createElementNS(vn ? HA : OA, i.$tag$), vn && i.$tag$ === "foreignObject" && (vn = !1), qg(null, i, vn), DA(Pa) && o["s-si"] !== Pa && o.classList.add(o["s-si"] = Pa), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = Ef(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? vn = !1 : o.tagName === "foreignObject" && (vn = !0);
  }
  return o;
}, Wg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Gg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = Ef(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Xg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, XA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], y;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : f == null ? f = r[++s] : l == null ? l = r[--u] : ba(a, f) ? (xo(a, f), a = e[++i], f = r[++s]) : ba(c, l) ? (xo(c, l), c = e[--o], l = r[--u]) : ba(a, l) ? (xo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : ba(c, f) ? (xo(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++s]) : (y = Ef(e && e[s], n, s), f = r[++s], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  i > o ? Wg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Xg(e, i, o);
}, ba = (t, e) => t.$tag$ === e.$tag$, xo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (vn = s === "svg" ? !0 : s === "foreignObject" ? !1 : vn, qg(t, e, vn), r !== null && i !== null ? XA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Wg(n, null, e, i, 0, i.length - 1)) : r !== null && Xg(r, 0, r.length - 1), vn && s === "svg" && (vn = !1)) : t.$text$ !== o && (n.data = o);
}, YA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || fu(null, null), i = jA(e) ? e : $t(null, null, e);
  Gg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, Pa = n["s-sc"], xo(r, i);
}, Yg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Af = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Yg(t, t.$ancestorComponent$), h4(() => ZA(t, e));
}, ZA = (t, e) => {
  const n = Pr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), e4(i, () => QA(t, r, e));
}, QA = async (t, e, n) => {
  const r = t.$hostElement$, i = Pr("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && qA(t);
  const o = Pr("render", t.$cmpMeta$.$tagName$);
  JA(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => t4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, JA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, YA(t, e);
  } catch (r) {
    Po(r, t.$hostElement$);
  }
  return null;
}, t4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Pr("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Qg(n), r(), t.$onReadyResolve$(n), i || Zg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && $f(() => Af(t, !1)), t.$flags$ &= -517;
}, Zg = (t) => {
  Qg(dr.documentElement), $f(() => GA(_c, "appload", { detail: { namespace: PA } }));
}, e4 = (t, e) => t && t.then ? t.then(e) : e(), Qg = (t) => t.classList.add("hydrated"), n4 = (t, e) => oo(t).$instanceValues$.get(e), r4 = (t, e, n, r) => {
  const i = oo(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = zA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && Af(i, !1));
}, Jg = (t, e, n) => {
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
        Je.jmp(() => {
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
      i.isProxied || (Jg(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = Pr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        Po(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = Vg(n);
      if (!tc.has(c)) {
        const u = Pr("registerStyles", n.$tagName$);
        KA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => Af(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, i4 = (t) => {
  if (!(Je.$flags$ & 1)) {
    const e = oo(t), n = e.$cmpMeta$, r = Pr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Yg(e, e.$ancestorComponent$ = i);
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
  Je.$flags$ & 1 || oo(t);
}, a4 = (t, e = {}) => {
  var n;
  const r = Pr(), i = [], s = e.exclude || [], o = _c.customElements, a = dr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ dr.createElement("style"), f = [];
  let l, y = !0;
  Object.assign(Je, e), Je.$resourcesUrl$ = new URL(e.resourcesUrl || "./", dr.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const S = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      S.$members$ = x[2];
      const B = S.$tagName$, j = class extends HTMLElement {
        // StencilLazyHost
        constructor(z) {
          super(z), z = this, l4(z, S), S.$flags$ & 1 && z.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? f.push(this) : Je.jmp(() => i4(this));
        }
        disconnectedCallback() {
          Je.jmp(() => o4(this));
        }
        componentOnReady() {
          return oo(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !s.includes(B) && !o.get(B) && (i.push(B), o.define(B, Jg(
        j,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + UA, u.setAttribute("data-styles", "");
    const p = (n = Je.$nonce$) !== null && n !== void 0 ? n : Kg(dr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, f.length ? f.map((p) => p.connectedCallback()) : Je.jmp(() => l = setTimeout(Zg, 30)), r();
}, vf = /* @__PURE__ */ new WeakMap(), oo = (t) => vf.get(t), c4 = (t, e) => vf.set(e.$lazyInstance$ = t, e), l4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], vf.set(t, n);
}, Ah = (t, e) => e in t, Po = (t, e) => (0, console.error)(t, e), cl = /* @__PURE__ */ new Map(), u4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = cl.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (cl.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => z$).then(o, Po);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (cl.set(i, o), o[r]), Po);
}, tc = /* @__PURE__ */ new Map(), _c = typeof window < "u" ? window : {}, dr = _c.document || { head: {} }, Je = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, ty = (t) => Promise.resolve(t), f4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), vh = [], ey = [], d4 = (t, e) => (n) => {
  t.push(n), uu || (uu = !0, Je.$flags$ & 4 ? $f(du) : Je.raf(du));
}, $h = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Po(n);
    }
  t.length = 0;
}, du = () => {
  $h(vh), $h(ey), (uu = vh.length > 0) && Je.raf(du);
}, $f = (t) => ty().then(t), h4 = /* @__PURE__ */ d4(ey), p4 = () => ty(), g4 = (t, e) => typeof window > "u" ? Promise.resolve() : p4().then(() => a4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var y4 = Object.defineProperty, w4 = Object.defineProperties, b4 = Object.getOwnPropertyDescriptors, ec = Object.getOwnPropertySymbols, ny = Object.prototype.hasOwnProperty, ry = Object.prototype.propertyIsEnumerable, kh = (t, e, n) => e in t ? y4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Tn = (t, e) => {
  for (var n in e || (e = {})) ny.call(e, n) && kh(t, n, e[n]);
  if (ec) for (var n of ec(e)) ry.call(e, n) && kh(t, n, e[n]);
  return t;
}, Zn = (t, e) => w4(t, b4(e)), sy = (t, e) => {
  var n = {};
  for (var r in t) ny.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ec) for (var r of ec(t)) e.indexOf(r) < 0 && ry.call(t, r) && (n[r] = t[r]);
  return n;
};
function iy() {
  return Lc(Ws()) || window.StacksProvider || window.BlockstackProvider;
}
function Uc(t) {
  return t ? typeof t == "string" ? Ys.fromName(t) : "version" in t ? t : "url" in t ? new Fl({ url: t.url }) : t.transactionVersion === Qs.Mainnet ? new Fl({ url: t.client.baseUrl }) : new jl({ url: t.client.baseUrl }) : new jl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var m4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(m4 || {}), x4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(x4 || {}), kf = (t) => {
  let e = t;
  if (!e) {
    let n = new U0(["store_write"], document.location.href);
    e = new Dl({ appConfig: n });
  }
  return e;
};
function oy(t) {
  try {
    return kf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ay = (t) => {
  let e = kf(t).loadUserData().appPrivateKey, n = Ve.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function S4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Zs.Mainnet]: "mainnet", [Zs.Testnet]: "testnet" }, a = Uc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function E4(t) {
  let e = Uc(t.network), n = kf(t.userSession), r = Zn(Tn({}, t), { network: e, userSession: n });
  return Tn({ stxAddress: S4(r) }, r);
}
async function A4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Mg) : n = n.map((r) => pt(zg(r)))), new Ve.TokenSigner("ES256k", e).signAsync(Zn(Tn({}, t), { postConditions: n }));
}
function v4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Mg) : e = e.map((n) => pt(zg(n)))), Ve.createUnsecuredToken(Zn(Tn({}, t), { postConditions: e }));
}
var $4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Rt(a.replace(/^0x/, "")), u = gE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Zn(Tn({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, Zn(Tn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, k4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = sy(e, ["amount", "appDetails", "userSession"]);
  if (oy(i)) {
    let { privateKey: a, publicKey: c } = ay(i), u = Zn(Tn({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), A4(u, a);
  }
  let o = Zn(Tn({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), v4(o);
};
async function I4(t, e, n) {
  let r = await e(Zn(Tn(Tn({}, E4(t)), t), { network: Uc(t.network) }));
  return $4({ token: r, options: t }, n);
}
function L4(t, e = iy()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return I4(t, k4, e);
}
function cy(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Zn(Tn({}, t), { message: th(e), domain: th(n) }) : Zn(Tn({}, t), { message: pt(ti(e)), domain: pt(ti(n)) });
}
async function C4(t, e) {
  return new Ve.TokenSigner("ES256k", e).signAsync(cy(t));
}
async function T4(t) {
  let e = t, { userSession: n } = e, r = sy(e, ["userSession"]);
  if (oy(n)) {
    let { privateKey: i, publicKey: s } = ay(n), o = Zn(Tn({}, r), { publicKey: s });
    return C4(o, i);
  }
  return Ve.createUnsecuredToken(cy(t));
}
var B4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(B4 || {}), ly = "asigna-stx", Ih = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === ly && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(N4(t, e), "*");
}), M4 = { authenticationRequest: async (t) => Ih(t, "authenticationRequest"), transactionRequest: async (t) => Ih(t, "transactionRequest") }, N4 = (t, e) => ({ source: ly, [e]: t }), P4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = M4);
};
P4();
var _4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function U4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Ws(), o = iy();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    g4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : _4, c = Ix(a), u = document.createElement("connect-modal");
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
var ma = U4(L4);
function Ss(t, e, n) {
  return If(ln(t, e), n);
}
function ln(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = de(r);
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
function Lh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function qo(t, e = 8) {
  return (typeof t == "bigint" ? t : ln(t, !1)).toString(16).padStart(e * 2, "0");
}
function Hc(t) {
  return parseInt(t, 16);
}
function If(t, e = 16) {
  const n = qo(t, e);
  return de(n);
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
function de(t) {
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
function Lf(t) {
  return new TextDecoder().decode(t);
}
function uy(t) {
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
function Ch(t) {
  if (t.some(z4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Oc(...t) {
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
  return Oc(...t.map((e) => typeof e == "number" ? Ch([e]) : e instanceof Array ? Ch(e) : e));
}
var Th;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Th || (Th = {}));
var Bh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Bh || (Bh = {}));
var Mh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mh || (Mh = {}));
const fy = 33, ll = 32;
function R4(t) {
  if (t.length < ll * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ll * 2), r = t.slice(2 + ll * 2);
  return {
    recoveryId: Hc(e),
    r: n,
    s: r
  };
}
function G4(t) {
  const e = typeof t == "string" ? de(t) : t;
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
function ei(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var hu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hu || (hu = {}));
const Y4 = hu.Mainnet, Z4 = 128, Q4 = 128, dy = 16, Fs = 32, pu = 80, Dc = 65, J4 = 32, tv = 64, nc = 34;
var ft;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ft || (ft = {}));
var Nt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Nt || (Nt = {}));
var gu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(gu || (gu = {}));
var gn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(gn || (gn = {}));
const _a = ["onChainOnly", "offChainOnly", "any"], Nh = {
  [_a[0]]: gn.OnChainOnly,
  [_a[1]]: gn.OffChainOnly,
  [_a[2]]: gn.Any,
  [gn.OnChainOnly]: gn.OnChainOnly,
  [gn.OffChainOnly]: gn.OffChainOnly,
  [gn.Any]: gn.Any
};
function ev(t) {
  if (t in Nh)
    return Nh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${_a.join(", ")}`);
}
var rc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(rc || (rc = {}));
rc.Mainnet;
var Zi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Zi || (Zi = {}));
var yn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yn || (yn = {}));
var ve;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ve || (ve = {}));
var re;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(re || (re = {}));
var sc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(sc || (sc = {}));
var be;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(be || (be = {}));
var _o;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(_o || (_o = {}));
var yu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(yu || (yu = {}));
var Uo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Uo || (Uo = {}));
var Ph;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ph || (Ph = {}));
var _h;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(_h || (_h = {}));
function wu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nv(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wu(t.outputLen), wu(t.blockLen);
}
function sv(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function iv(t, e) {
  hy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Us = {
  number: wu,
  bool: nv,
  bytes: hy,
  hash: rv,
  exists: sv,
  output: iv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ul = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ir = (t, e) => t << 32 - e | t >>> e, ov = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ov)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function av(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Cf(t) {
  if (typeof t == "string" && (t = av(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class py {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function pi(t) {
  const e = (r) => t().update(Cf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function cv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Tf extends py {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ul(this.buffer);
  }
  update(e) {
    Us.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Cf(e);
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
    Us.exists(this), Us.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    cv(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
}
const lv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gy = Uint8Array.from({ length: 16 }, (t, e) => e), uv = gy.map((t) => (9 * t + 5) % 16);
let Bf = [gy], Mf = [uv];
for (let t = 0; t < 4; t++)
  for (let e of [Bf, Mf])
    e.push(e[t].map((n) => lv[n]));
const yy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fv = Bf.map((t, e) => t.map((n) => yy[e][n])), dv = Mf.map((t, e) => t.map((n) => yy[e][n])), hv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), xa = (t, e) => t << e | t >>> 32 - e;
function Uh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Sa = new Uint32Array(16);
class gv extends Tf {
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
      Sa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = hv[p], B = pv[p], j = Bf[p], z = Mf[p], A = fv[p], _ = dv[p];
      for (let N = 0; N < 16; N++) {
        const Q = xa(r + Uh(p, s, a, u) + Sa[j[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = xa(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = xa(i + Uh(x, o, c, f) + Sa[z[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = xa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Sa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const yv = pi(() => new gv()), wv = (t, e, n) => t & e ^ ~t & n, bv = (t, e, n) => t & e ^ t & n ^ e & n, mv = new Uint32Array([
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
class wy extends Tf {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
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
      ls[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ls[l - 15], p = ls[l - 2], x = ir(y, 7) ^ ir(y, 18) ^ y >>> 3, S = ir(p, 17) ^ ir(p, 19) ^ p >>> 10;
      ls[l] = S + ls[l - 7] + x + ls[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = ir(a, 6) ^ ir(a, 11) ^ ir(a, 25), p = f + y + wv(a, c, u) + mv[l] + ls[l] | 0, S = (ir(r, 2) ^ ir(r, 13) ^ ir(r, 22)) + bv(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class xv extends wy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Nf = pi(() => new wy());
pi(() => new xv());
const Ea = BigInt(2 ** 32 - 1), bu = BigInt(32);
function by(t, e = !1) {
  return e ? { h: Number(t & Ea), l: Number(t >> bu & Ea) } : { h: Number(t >> bu & Ea) | 0, l: Number(t & Ea) | 0 };
}
function Sv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = by(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Ev = (t, e) => BigInt(t >>> 0) << bu | BigInt(e >>> 0), Av = (t, e, n) => t >>> n, vv = (t, e, n) => t << 32 - n | e >>> n, $v = (t, e, n) => t >>> n | e << 32 - n, kv = (t, e, n) => t << 32 - n | e >>> n, Iv = (t, e, n) => t << 64 - n | e >>> n - 32, Lv = (t, e, n) => t >>> n - 32 | e << 64 - n, Cv = (t, e) => e, Tv = (t, e) => t, Bv = (t, e, n) => t << n | e >>> 32 - n, Mv = (t, e, n) => e << n | t >>> 32 - n, Nv = (t, e, n) => e << n - 32 | t >>> 64 - n, Pv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _v(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Uv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ov = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dv = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Fv = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), jv = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: by,
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
}, [zv, Rv] = Bt.split([
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
class Fc extends Tf {
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
      us[A] = e.getUint32(n), fs[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = us[A - 15] | 0, N = fs[A - 15] | 0, Q = Bt.rotrSH(_, N, 1) ^ Bt.rotrSH(_, N, 8) ^ Bt.shrSH(_, N, 7), tt = Bt.rotrSL(_, N, 1) ^ Bt.rotrSL(_, N, 8) ^ Bt.shrSL(_, N, 7), R = us[A - 2] | 0, V = fs[A - 2] | 0, k = Bt.rotrSH(R, V, 19) ^ Bt.rotrBH(R, V, 61) ^ Bt.shrSH(R, V, 6), P = Bt.rotrSL(R, V, 19) ^ Bt.rotrBL(R, V, 61) ^ Bt.shrSL(R, V, 6), b = Bt.add4L(tt, P, fs[A - 7], fs[A - 16]), T = Bt.add4H(b, Q, k, us[A - 7], us[A - 16]);
      us[A] = T | 0, fs[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: j, Hl: z } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Bt.rotrSH(l, y, 14) ^ Bt.rotrSH(l, y, 18) ^ Bt.rotrBH(l, y, 41), N = Bt.rotrSL(l, y, 14) ^ Bt.rotrSL(l, y, 18) ^ Bt.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, R = Bt.add5L(z, N, tt, Rv[A], fs[A]), V = Bt.add5H(R, j, _, Q, zv[A], us[A]), k = R | 0, P = Bt.rotrSH(r, i, 28) ^ Bt.rotrBH(r, i, 34) ^ Bt.rotrBH(r, i, 39), b = Bt.rotrSL(r, i, 28) ^ Bt.rotrBL(r, i, 34) ^ Bt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, O = i & o ^ i & c ^ o & c;
      j = S | 0, z = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Bt.add(u | 0, f | 0, V | 0, k | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Bt.add3L(k, b, O);
      r = Bt.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Bt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Bt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: j, l: z } = Bt.add(this.Hh | 0, this.Hl | 0, j | 0, z | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, j, z);
  }
  roundClean() {
    us.fill(0), fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Gv extends Fc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Kv extends Fc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Vv extends Fc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
pi(() => new Fc());
pi(() => new Gv());
const qv = pi(() => new Kv());
pi(() => new Vv());
function my(t) {
  if (de(t).byteLength != Dc)
    throw Error("Invalid signature");
  return {
    type: ft.MessageSignature,
    data: t
  };
}
function So(t, e) {
  return { type: ft.Address, version: t, hash160: e };
}
function Mi(t) {
  return fi.c32address(t.version, t.hash160);
}
function ni(t, e, n) {
  const r = e || 1, i = n || Z4;
  if (Uy(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: ft.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function Pf(t) {
  const e = fi.c32addressDecode(t);
  return {
    type: ft.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Y;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Y || (Y = {}));
function Wv(t) {
  if (t.type === Y.PrincipalStandard)
    return Mi(t.address);
  if (t.type === Y.PrincipalContract)
    return `${Mi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function xy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Zv(e, n);
  } else
    return Xv(t);
}
function Xv(t) {
  const e = Pf(t);
  return { type: Y.PrincipalStandard, address: e };
}
function Yv(t) {
  return { type: Y.PrincipalStandard, address: t };
}
function Zv(t, e) {
  const n = Pf(t), r = ni(e);
  return Sy(n, r);
}
function Sy(t, e) {
  if (ao(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Y.PrincipalContract, address: t, contractName: e };
}
function fl(t, e = !1) {
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
      return lr(t.value);
    case Y.ResponseErr:
      return lr(t.value);
    case Y.ResponseOk:
      return lr(t.value);
    case Y.PrincipalStandard:
    case Y.PrincipalContract:
      return Wv(t);
    case Y.List:
      return t.list.map((r) => lr(r));
    case Y.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = lr(t.data[r]);
      }), n;
    case Y.StringASCII:
      return t.data;
    case Y.StringUTF8:
      return t.data;
  }
}
function lr(t) {
  switch (t.type) {
    case Y.ResponseErr:
      return { type: ps(t), value: fl(t, !0), success: !1 };
    case Y.ResponseOk:
      return { type: ps(t), value: fl(t, !0), success: !0 };
    default:
      return { type: ps(t), value: fl(t, !0) };
  }
}
function ps(t) {
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
      return `(optional ${ps(t.value)})`;
    case Y.ResponseErr:
      return `(response UnknownType ${ps(t.value)})`;
    case Y.ResponseOk:
      return `(response ${ps(t.value)} UnknownType)`;
    case Y.PrincipalStandard:
    case Y.PrincipalContract:
      return "principal";
    case Y.List:
      return `(list ${t.list.length} ${t.list.length ? ps(t.list[0]) : "UnknownType"})`;
    case Y.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ps(t.data[e])})`).join(" ")})`;
    case Y.StringASCII:
      return `(string-ascii ${uy(t.data).length})`;
    case Y.StringUTF8:
      return `(string-utf8 ${ao(t.data).length})`;
  }
}
const Ey = () => ({ type: Y.BoolTrue }), Ay = () => ({ type: Y.BoolFalse }), Qv = (t) => t ? Ey() : Ay(), Hh = BigInt("0xffffffffffffffffffffffffffffffff"), Jv = BigInt(0), Oh = BigInt("0x7fffffffffffffffffffffffffffffff"), Dh = BigInt("-170141183460469231731687303715884105728"), t8 = (t) => {
  const e = ln(t, !0);
  if (e > Oh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Oh}`);
  if (e < Dh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Dh}`);
  return { type: Y.Int, value: e };
}, hr = (t) => {
  const e = ln(t, !1);
  if (e < Jv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Hh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Hh}`);
  return { type: Y.UInt, value: e };
}, vy = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Y.Buffer, buffer: t };
};
function $y() {
  return { type: Y.OptionalNone };
}
function ky(t) {
  return { type: Y.OptionalSome, value: t };
}
function e8(t) {
  return { type: Y.ResponseErr, value: t };
}
function n8(t) {
  return { type: Y.ResponseOk, value: t };
}
function r8(t) {
  return { type: Y.List, list: t };
}
function ri(t) {
  for (const e in t)
    if (!V8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Y.Tuple, data: t };
}
const Ke = (t) => ({ type: Y.StringASCII, data: t }), s8 = (t) => ({ type: Y.StringUTF8, data: t });
class Iy extends py {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Us.hash(e);
    const r = Cf(n);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Ly = (t, e, n) => new Iy(t, e).update(n).digest();
Ly.create = (t, e) => new Iy(t, e);
$e.hmacSha256Sync = (t, ...e) => {
  const n = Ly.create(Nf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Qi(t) {
  return {
    type: ft.PublicKey,
    data: de(t)
  };
}
function i8(t, e, n = be.Compressed) {
  const r = R4(e.data), i = new Ln(Lh(r.r), Lh(r.s)), s = Pt.fromSignature(t, i, r.recoveryId), o = n === be.Compressed;
  return s.toHex(o);
}
function o8(t) {
  return { type: ft.PublicKey, data: t };
}
function co(t) {
  return !_t(t.data).startsWith("04");
}
function ic(t) {
  return t.data.slice();
}
function a8(t) {
  const e = u8(t), n = zo(e.data.slice(0, 32), e.compressed);
  return Qi(_t(n));
}
function c8(t) {
  const e = typeof t == "string" ? t : _t(t), n = Pt.fromHex(e).toHex(!0);
  return Qi(n);
}
function l8(t) {
  const e = typeof t == "string" ? t : _t(t), n = Pt.fromHex(e).toHex(!1);
  return Qi(n);
}
function mu(t) {
  const e = t.readUInt8(), n = e === 4 ? tv : J4;
  return o8(Te([e, t.readBytes(n)]));
}
function u8(t) {
  const e = G4(t), n = e.length == fy;
  return { data: e, compressed: n };
}
function f8(t, e) {
  const [n, r] = bc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = qo(r, 1) + Ln.fromHex(n).toCompactHex();
  return my(s);
}
function d8(t) {
  return a8(t.data);
}
function h8(t, e, n) {
  return typeof t == "string" && (t = xy(t)), typeof n == "string" && (n = zh(n)), {
    type: ft.Payload,
    payloadType: Nt.TokenTransfer,
    recipient: t,
    amount: ln(e, !1),
    memo: n ?? zh("")
  };
}
function p8(t, e, n, r) {
  return typeof t == "string" && (t = Pf(t)), typeof e == "string" && (e = ni(e)), typeof n == "string" && (n = ni(n)), {
    type: ft.Payload,
    payloadType: Nt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Fh(t, e, n) {
  return typeof t == "string" && (t = ni(t)), typeof e == "string" && (e = A8(e)), typeof n == "number" ? {
    type: ft.Payload,
    payloadType: Nt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ft.Payload,
    payloadType: Nt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function g8() {
  return { type: ft.Payload, payloadType: Nt.PoisonMicroblock };
}
function jh(t, e) {
  if (t.byteLength != Fs)
    throw Error(`Coinbase buffer size must be ${Fs} bytes`);
  return e != null ? {
    type: ft.Payload,
    payloadType: Nt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ft.Payload,
    payloadType: Nt.Coinbase,
    coinbaseBytes: t
  };
}
function y8(t, e, n) {
  if (t.byteLength != Fs)
    throw Error(`Coinbase buffer size must be ${Fs} bytes`);
  if (n.byteLength != pu)
    throw Error(`VRF proof buffer size must be ${pu} bytes`);
  return {
    type: ft.Payload,
    payloadType: Nt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Y.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var xu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(xu || (xu = {}));
function w8(t, e, n, r, i, s, o) {
  return {
    type: ft.Payload,
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
function Cy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Nt.TokenTransfer:
      e.push(Le(t.recipient)), e.push(Ss(t.amount, !1, 8)), e.push(Cr(t.memo));
      break;
    case Nt.ContractCall:
      e.push(Cr(t.contractAddress)), e.push(Cr(t.contractName)), e.push(Cr(t.functionName));
      const n = new Uint8Array(4);
      ei(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Le(r));
      });
      break;
    case Nt.SmartContract:
      e.push(Cr(t.contractName)), e.push(Cr(t.codeBody));
      break;
    case Nt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Cr(t.contractName)), e.push(Cr(t.codeBody));
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
      e.push(t.coinbaseBytes), e.push(Le(t.recipient ? ky(t.recipient) : $y())), e.push(t.vrfProof);
      break;
    case Nt.TenureChange:
      e.push(de(t.tenureHash)), e.push(de(t.previousTenureHash)), e.push(de(t.burnViewHash)), e.push(de(t.previousTenureEnd)), e.push(ei(new Uint8Array(4), t.previousTenureBlocks)), e.push(W4(new Uint8Array(1), t.cause)), e.push(de(t.publicKeyHash));
      break;
  }
  return Te(e);
}
function b8(t) {
  switch (t.readUInt8Enum(Nt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Nt.TokenTransfer:
      const n = Dn(t), r = ln(t.readBytes(8), !1), i = By(t);
      return h8(n, r, i);
    case Nt.ContractCall:
      const s = Ji(t), o = On(t), a = On(t), c = [], u = t.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const _ = Dn(t);
        c.push(_);
      }
      return p8(s, o, a, c);
    case Nt.SmartContract:
      const f = On(t), l = On(t, 4, 1e5);
      return Fh(f, l);
    case Nt.VersionedSmartContract: {
      const A = t.readUInt8Enum(gu, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), _ = On(t), N = On(t, 4, 1e5);
      return Fh(_, N, A);
    }
    case Nt.PoisonMicroblock:
      return g8();
    case Nt.Coinbase: {
      const A = t.readBytes(Fs);
      return jh(A);
    }
    case Nt.CoinbaseToAltRecipient: {
      const A = t.readBytes(Fs), _ = Dn(t);
      return jh(A, _);
    }
    case Nt.NakamotoCoinbase: {
      const A = t.readBytes(Fs), _ = Dn(t), N = t.readBytes(pu);
      return y8(A, _, N);
    }
    case Nt.TenureChange:
      const y = _t(t.readBytes(20)), p = _t(t.readBytes(20)), x = _t(t.readBytes(20)), S = _t(t.readBytes(32)), B = t.readUInt32BE(), j = t.readUInt8Enum(xu, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), z = _t(t.readBytes(20));
      return w8(y, p, x, S, B, j, z);
  }
}
class jc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Bs extends jc {
  constructor(e) {
    super(e);
  }
}
class In extends jc {
  constructor(e) {
    super(e);
  }
}
class oc extends jc {
  constructor(e) {
    super(e);
  }
}
class Hs extends jc {
  constructor(e) {
    super(e);
  }
}
var Wn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Wn || (Wn = {}));
function Su(t) {
  return my(_t(t.readBytes(Dc)));
}
function Ni(t, e) {
  return {
    pubKeyEncoding: t,
    type: ft.TransactionAuthField,
    contents: e
  };
}
function m8(t) {
  const e = t.readUInt8Enum(Wn, (n) => {
    throw new In(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Wn.PublicKeyCompressed:
      return Ni(be.Compressed, mu(t));
    case Wn.PublicKeyUncompressed:
      return Ni(be.Uncompressed, l8(mu(t).data));
    case Wn.SignatureCompressed:
      return Ni(be.Compressed, Su(t));
    case Wn.SignatureUncompressed:
      return Ni(be.Uncompressed, Su(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function _f(t) {
  return de(t.data);
}
function x8(t) {
  const e = [];
  switch (t.contents.type) {
    case ft.PublicKey:
      e.push(t.pubKeyEncoding === be.Compressed ? Wn.PublicKeyCompressed : Wn.PublicKeyUncompressed), e.push(ic(c8(t.contents.data)));
      break;
    case ft.MessageSignature:
      e.push(t.pubKeyEncoding === be.Compressed ? Wn.SignatureCompressed : Wn.SignatureUncompressed), e.push(_f(t.contents));
      break;
  }
  return Te(e);
}
function Cr(t) {
  switch (t.type) {
    case ft.Address:
      return Wo(t);
    case ft.Principal:
      return Ty(t);
    case ft.LengthPrefixedString:
      return to(t);
    case ft.MemoString:
      return v8(t);
    case ft.AssetInfo:
      return My(t);
    case ft.PostCondition:
      return $8(t);
    case ft.PublicKey:
      return ic(t);
    case ft.LengthPrefixedList:
      return Of(t);
    case ft.Payload:
      return Cy(t);
    case ft.TransactionAuthField:
      return x8(t);
    case ft.MessageSignature:
      return _f(t);
  }
}
function S8() {
  return {
    type: ft.Address,
    version: sc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Uf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === re.SerializeP2PKH || e === re.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === re.SerializeP2WPKH || e === re.SerializeP2WSH || e === re.SerializeP2WSHNonSequential) && !r.every(co))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case re.SerializeP2PKH:
      return So(t, z8(r[0].data));
    case re.SerializeP2WPKH:
      return So(t, R8(r[0].data));
    case re.SerializeP2SH:
    case re.SerializeP2SHNonSequential:
      return So(t, G8(n, r.map(ic)));
    case re.SerializeP2WSH:
    case re.SerializeP2WSHNonSequential:
      return So(t, K8(n, r.map(ic)));
  }
}
function Wo(t) {
  const e = [];
  return e.push(de(qo(t.version, 1))), e.push(de(t.hash160)), Te(e);
}
function Ji(t) {
  const e = Hc(_t(t.readBytes(1))), n = _t(t.readBytes(20));
  return { type: ft.Address, version: e, hash160: n };
}
function Ty(t) {
  const e = [];
  return e.push(t.prefix), e.push(Wo(t.address)), t.prefix === Uo.Contract && e.push(to(t.contractName)), Te(e);
}
function E8(t) {
  const e = t.readUInt8Enum(Uo, (i) => {
    throw new In(`Unexpected Principal payload type: ${i}`);
  }), n = Ji(t);
  if (e === Uo.Standard)
    return { type: ft.Principal, prefix: e, address: n };
  const r = On(t);
  return {
    type: ft.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function to(t) {
  const e = [], n = ao(t.content), r = n.byteLength;
  return e.push(de(qo(r, t.lengthPrefixBytes))), e.push(n), Te(e);
}
function On(t, e, n) {
  e = e || 1;
  const r = Hc(_t(t.readBytes(e))), i = Lf(t.readBytes(r));
  return ni(i, e, n ?? 128);
}
function A8(t) {
  return ni(t, 4, 1e5);
}
function zh(t) {
  if (t && Uy(t, nc))
    throw new Error(`Memo exceeds maximum length of ${nc} bytes`);
  return { type: ft.MemoString, content: t };
}
function v8(t) {
  const e = [], n = ao(t.content), r = j8(_t(n), nc * 2);
  return e.push(de(r)), Te(e);
}
function By(t) {
  let e = Lf(t.readBytes(nc));
  return e = e.replace(/\u0000*$/, ""), { type: ft.MemoString, content: e };
}
function My(t) {
  const e = [];
  return e.push(Wo(t.address)), e.push(to(t.contractName)), e.push(to(t.assetName)), Te(e);
}
function Eu(t) {
  return {
    type: ft.AssetInfo,
    address: Ji(t),
    contractName: On(t),
    assetName: On(t)
  };
}
function Hf(t, e) {
  return {
    type: ft.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Of(t) {
  const e = t.values, n = [];
  n.push(de(qo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Cr(r));
  return Te(n);
}
function Ny(t, e, n) {
  const r = Hc(_t(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case ft.Address:
        i.push(Ji(t));
        break;
      case ft.LengthPrefixedString:
        i.push(On(t));
        break;
      case ft.MemoString:
        i.push(By(t));
        break;
      case ft.AssetInfo:
        i.push(Eu(t));
        break;
      case ft.PostCondition:
        i.push(k8(t));
        break;
      case ft.PublicKey:
        i.push(mu(t));
        break;
      case ft.TransactionAuthField:
        i.push(m8(t));
        break;
    }
  return Hf(i, n);
}
function $8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Ty(t.principal)), (t.conditionType === yn.Fungible || t.conditionType === yn.NonFungible) && e.push(My(t.assetInfo)), t.conditionType === yn.NonFungible && e.push(Le(t.assetName)), e.push(t.conditionCode), t.conditionType === yn.STX || t.conditionType === yn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Bs("The post-condition amount may not be larger than 8 bytes");
    e.push(Ss(t.amount, !1, 8));
  }
  return Te(e);
}
function k8(t) {
  const e = t.readUInt8Enum(yn, (o) => {
    throw new In(`Could not read ${o} as PostConditionType`);
  }), n = E8(t);
  let r, i, s;
  switch (e) {
    case yn.STX:
      return r = t.readUInt8Enum(_o, (a) => {
        throw new In(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${_t(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: yn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case yn.Fungible:
      return i = Eu(t), r = t.readUInt8Enum(_o, (a) => {
        throw new In(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${_t(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: yn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case yn.NonFungible:
      i = Eu(t);
      const o = Dn(t);
      return r = t.readUInt8Enum(yu, (a) => {
        throw new In(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ft.PostCondition,
        conditionType: yn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function br(t, e) {
  return Te([t, e]);
}
function I8(t) {
  return new Uint8Array([t.type]);
}
function L8(t) {
  return t.type === Y.OptionalNone ? new Uint8Array([t.type]) : br(t.type, Le(t.value));
}
function C8(t) {
  const e = new Uint8Array(4);
  return ei(e, t.buffer.length, 0), br(t.type, Oc(e, t.buffer));
}
function T8(t) {
  const e = If(H4(t.value, BigInt(Q4)), dy);
  return br(t.type, e);
}
function B8(t) {
  const e = If(t.value, dy);
  return br(t.type, e);
}
function M8(t) {
  return br(t.type, Wo(t.address));
}
function N8(t) {
  return br(t.type, Oc(Wo(t.address), to(t.contractName)));
}
function P8(t) {
  return br(t.type, Le(t.value));
}
function _8(t) {
  const e = [], n = new Uint8Array(4);
  ei(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Le(r);
    e.push(i);
  }
  return br(t.type, Te(e));
}
function U8(t) {
  const e = [], n = new Uint8Array(4);
  ei(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = ni(i);
    e.push(to(s));
    const o = Le(t.data[i]);
    e.push(o);
  }
  return br(t.type, Te(e));
}
function Py(t, e) {
  const n = [], r = e == "ascii" ? uy(t.data) : ao(t.data), i = new Uint8Array(4);
  return ei(i, r.length, 0), n.push(i), n.push(r), br(t.type, Te(n));
}
function H8(t) {
  return Py(t, "ascii");
}
function O8(t) {
  return Py(t, "utf8");
}
function Le(t) {
  switch (t.type) {
    case Y.BoolTrue:
    case Y.BoolFalse:
      return I8(t);
    case Y.OptionalNone:
    case Y.OptionalSome:
      return L8(t);
    case Y.Buffer:
      return C8(t);
    case Y.UInt:
      return B8(t);
    case Y.Int:
      return T8(t);
    case Y.PrincipalStandard:
      return M8(t);
    case Y.PrincipalContract:
      return N8(t);
    case Y.ResponseOk:
    case Y.ResponseErr:
      return P8(t);
    case Y.List:
      return _8(t);
    case Y.Tuple:
      return U8(t);
    case Y.StringASCII:
      return H8(t);
    case Y.StringUTF8:
      return O8(t);
    default:
      throw new Bs("Unable to serialize. Invalid Clarity Value.");
  }
}
function D8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Rh = /* @__PURE__ */ new Map();
function _y(t, e) {
  const n = Rh.get(t);
  if (n !== void 0)
    return n(e);
  const r = D8(t);
  return Rh.set(t, r), _y(t, e);
}
class ko {
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
    if (_y(e, r))
      return r;
    throw n(r);
  }
}
function Dn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ko(de(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ko(t) : e = t;
  switch (e.readUInt8Enum(Y, (r) => {
    throw new In(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Y.Int:
      return t8(e.readBytes(16));
    case Y.UInt:
      return hr(e.readBytes(16));
    case Y.Buffer:
      const r = e.readUInt32BE();
      return vy(e.readBytes(r));
    case Y.BoolTrue:
      return Ey();
    case Y.BoolFalse:
      return Ay();
    case Y.PrincipalStandard:
      const i = Ji(e);
      return Yv(i);
    case Y.PrincipalContract:
      const s = Ji(e), o = On(e);
      return Sy(s, o);
    case Y.ResponseOk:
      return n8(Dn(e));
    case Y.ResponseErr:
      return e8(Dn(e));
    case Y.OptionalNone:
      return $y();
    case Y.OptionalSome:
      return ky(Dn(e));
    case Y.List:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Dn(e));
      return r8(c);
    case Y.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const B = On(e).content;
        if (B === void 0)
          throw new In('"content" is undefined');
        f[B] = Dn(e);
      }
      return ri(f);
    case Y.StringASCII:
      const l = e.readUInt32BE(), y = j4(e.readBytes(l));
      return Ke(y);
    case Y.StringUTF8:
      const p = e.readUInt32BE(), x = Lf(e.readBytes(p));
      return s8(x);
    default:
      throw new In("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const F8 = (t) => t.length % 2 == 0 ? t : `0${t}`, j8 = (t, e) => t.padEnd(e, "0"), Uy = (t, e) => t ? ao(t).length > e : !1;
function Au(t) {
  return eg(t);
}
const Ho = (t) => yv(Nf(t)), Df = (t) => _t(qv(t)), z8 = (t) => _t(Ho(t)), R8 = (t) => {
  const e = Ho(t), n = Oc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ho(n);
  return _t(r);
}, G8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Te(n), i = Ho(r);
  return _t(i);
}, K8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Te(n), i = Nf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Te(s), a = Ho(o);
  return _t(a);
};
function V8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Hy(t) {
  const e = Le(t);
  return `0x${_t(e)}`;
}
function q8(t) {
  return Dn(t);
}
const Ui = (t) => {
  try {
    return fi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Ff() {
  return {
    type: ft.MessageSignature,
    data: _t(new Uint8Array(Dc))
  };
}
function Oy(t, e, n, r) {
  const i = Uf(0, t, 1, [Qi(e)]).hash160, s = co(Qi(e)) ? be.Compressed : be.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: ln(n, !1),
    fee: ln(r, !1),
    keyEncoding: s,
    signature: Ff()
  };
}
function Oo(t) {
  return "signature" in t;
}
function Gh(t) {
  return t === re.SerializeP2SH || t === re.SerializeP2WSH;
}
function W8(t) {
  return t === re.SerializeP2SHNonSequential || t === re.SerializeP2WSHNonSequential;
}
function Kh(t) {
  const e = Au(t);
  return e.nonce = 0, e.fee = 0, Oo(e) ? e.signature = Ff() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function X8(t) {
  const e = [
    t.hashMode,
    de(t.signer),
    Ss(t.nonce, !1, 8),
    Ss(t.fee, !1, 8),
    t.keyEncoding,
    _f(t.signature)
  ];
  return Te(e);
}
function Y8(t) {
  const e = [
    t.hashMode,
    de(t.signer),
    Ss(t.nonce, !1, 8),
    Ss(t.fee, !1, 8)
  ], n = Hf(t.fields);
  e.push(Of(n));
  const r = new Uint8Array(2);
  return V4(r, t.signaturesRequired, 0), e.push(r), Te(e);
}
function Z8(t, e) {
  const n = _t(e.readBytes(20)), r = BigInt(`0x${_t(e.readBytes(8))}`), i = BigInt(`0x${_t(e.readBytes(8))}`), s = e.readUInt8Enum(be, (a) => {
    throw new In(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === re.SerializeP2WPKH && s != be.Compressed)
    throw new In("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Su(e);
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
  const n = _t(e.readBytes(20)), r = BigInt("0x" + _t(e.readBytes(8))), i = BigInt("0x" + _t(e.readBytes(8))), s = Ny(e, ft.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case ft.PublicKey:
        co(u.contents) || (o = !0);
        break;
      case ft.MessageSignature:
        if (u.pubKeyEncoding === be.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Hs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === re.SerializeP2WSH || t === re.SerializeP2WSHNonSequential))
    throw new Hs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function dl(t) {
  return Oo(t) ? X8(t) : Y8(t);
}
function hl(t) {
  const e = t.readUInt8Enum(re, (n) => {
    throw new In(`Could not parse ${n} as AddressHashMode`);
  });
  return e === re.SerializeP2PKH || e === re.SerializeP2WPKH ? Z8(e, t) : Q8(e, t);
}
function Dy(t, e, n, r) {
  const s = t + _t(new Uint8Array([e])) + _t(Ss(n, !1, 8)) + _t(Ss(r, !1, 8));
  if (de(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Df(de(s));
}
function Fy(t, e, n) {
  const r = 33 + Dc, i = co(e) ? be.Compressed : be.Uncompressed, s = t + F8(i.toString(16)) + n.data, o = de(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Df(o);
}
function J8(t, e, n, r, i) {
  const s = Dy(t, e, n, r), o = f8(i, s), a = d8(i), c = Fy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function jy(t, e, n, r, i, s) {
  const o = Dy(t, e, n, r), a = Qi(i8(o, s, i)), c = Fy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function t5() {
  const t = Oy(re.SerializeP2PKH, "", 0, 0);
  return t.signer = S8().hash160, t.keyEncoding = be.Compressed, t.signature = Ff(), t;
}
function Vh(t, e, n) {
  return Oo(t) ? e5(t, e, n) : n5(t, e, n);
}
function e5(t, e, n) {
  const { pubKey: r, nextSigHash: i } = jy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = Uf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Hs(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function n5(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ft.PublicKey:
        co(c.contents) || (s = !0), r.push(c.contents);
        break;
      case ft.MessageSignature:
        c.pubKeyEncoding === be.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: f } = jy(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Gh(t.hashMode) && (i = f), r.push(u), o += 1, o === 65536)
          throw new Hs("Too many signatures");
        break;
    }
  if (Gh(t.hashMode) && o !== t.signaturesRequired || W8(t.hashMode) && o < t.signaturesRequired)
    throw new Hs("Incorrect number of signatures");
  if (s && (t.hashMode === re.SerializeP2WSH || t.hashMode === re.SerializeP2WSHNonSequential))
    throw new Hs("Uncompressed keys are not allowed in this hash mode");
  const a = Uf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Hs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function zy(t) {
  return {
    authType: ve.Standard,
    spendingCondition: t
  };
}
function Ry(t, e) {
  return {
    authType: ve.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Oy(re.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function qh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ve.Standard:
        return zy(Kh(t.spendingCondition));
      case ve.Sponsored:
        return Ry(Kh(t.spendingCondition), t5());
      default:
        throw new oc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function r5(t, e) {
  switch (t.authType) {
    case ve.Standard:
      return Vh(t.spendingCondition, e, ve.Standard);
    case ve.Sponsored:
      return Vh(t.spendingCondition, e, ve.Standard);
    default:
      throw new oc("Invalid origin auth type");
  }
}
function s5(t, e) {
  switch (t.authType) {
    case ve.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ln(e, !1)
      };
      return { ...t, spendingCondition: n };
    case ve.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ln(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function i5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ln(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function o5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ln(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function a5(t, e) {
  const n = {
    ...e,
    nonce: ln(e.nonce, !1),
    fee: ln(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function c5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ve.Standard:
      e.push(dl(t.spendingCondition));
      break;
    case ve.Sponsored:
      e.push(dl(t.spendingCondition)), e.push(dl(t.sponsorSpendingCondition));
      break;
  }
  return Te(e);
}
function l5(t) {
  const e = t.readUInt8Enum(ve, (r) => {
    throw new In(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ve.Standard:
      return n = hl(t), zy(n);
    case ve.Sponsored:
      n = hl(t);
      const r = hl(t);
      return Ry(n, r);
  }
}
class u5 {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: ln(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Y4, this.postConditionMode = s ?? Zi.Deny, this.postConditions = i ?? Hf([]), o)
      this.anchorMode = ev(o);
    else
      switch (r.payloadType) {
        case Nt.Coinbase:
        case Nt.CoinbaseToAltRecipient:
        case Nt.NakamotoCoinbase:
        case Nt.PoisonMicroblock:
        case Nt.TenureChange:
          this.anchorMode = gn.OnChainOnly;
          break;
        case Nt.ContractCall:
        case Nt.SmartContract:
        case Nt.VersionedSmartContract:
        case Nt.TokenTransfer:
          this.anchorMode = gn.Any;
          break;
      }
  }
  signBegin() {
    const e = Au(this);
    return e.auth = qh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Au(this);
    return e.auth = qh(e.auth), e.txid();
  }
  verifyOrigin() {
    return r5(this.auth, this.verifyBegin());
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
    const n = this.auth.spendingCondition;
    if (n && !Oo(n)) {
      const r = co(e);
      n.fields.push(Ni(r ? be.Compressed : be.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = J8(n, r, e.fee, e.nonce, i);
    return Oo(e) ? e.signature = s : e.fields.push(Ni(i.data.byteLength === fy ? be.Compressed : be.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return Df(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ve.Sponsored)
      throw new oc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = a5(this.auth, e);
  }
  setFee(e) {
    this.auth = s5(this.auth, e);
  }
  setNonce(e) {
    this.auth = i5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ve.Sponsored)
      throw new oc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = o5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Bs('"version" is undefined');
    if (this.chainId === void 0)
      throw new Bs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Bs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Bs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Bs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ei(n, this.chainId, 0), e.push(n), e.push(c5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Of(this.postConditions)), e.push(Cy(this.payload)), Te(e);
  }
}
function ac(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ko(de(t.slice(2))) : e = new ko(de(t)) : t instanceof Uint8Array ? e = new ko(t) : e = t;
  const n = e.readUInt8Enum(rc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = l5(e), s = e.readUInt8Enum(gn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Zi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Ny(e, ft.PostCondition), c = b8(e);
  return new u5(n, i, c, a, o, s, r);
}
const f5 = Qv, Io = hr, d5 = vy;
const h5 = /* @__PURE__ */ new Set([4001, -31001]), p5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], g5 = ["result", "data", "payload", "response", "params"], Wh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], zc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), gi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Mr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, y5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Gy = (t) => {
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
}, Ky = (t) => t ? Gy(gi()).some(
  (e) => {
    var n;
    return e.id === t && (zc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Vy = () => {
  if (typeof window > "u")
    return;
  const t = gi(), e = Gy(t).filter(
    (n) => {
      var r;
      return zc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Mr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of p5) {
    const r = Mr(t, n) ?? (t === window ? void 0 : Mr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, w5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = gi(), n = Mr(e, t) ?? (e === window ? void 0 : Mr(window, t)) ?? Lc(t);
  if (n)
    return n;
  if (zc(t) || Ky(t))
    return Vy();
}, Aa = (t, e) => {
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
const qy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, $n = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, x5 = (t) => {
  const e = $n(t);
  if (!e)
    return null;
  const n = qy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, S5 = (t) => {
  const e = $n(t);
  if (!e)
    return null;
  const n = qy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, vu = (t, e = "mainnet") => {
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
      return vu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return vu(r, e);
  }
  return e;
}, js = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Do = (t, e = 0) => {
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
      const s = Do(i, e + 1);
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
    const s = Do(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && Ui(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ui(n.testnet) ? n.testnet.trim() : null;
}, Xh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Wy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && h5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, si = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = $n(n == null ? void 0 : n.message) ?? $n(e.message) ?? $n(e.error) ?? $n(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, eo = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw si(e);
    if (e.status === "error")
      throw si(e.result ?? e);
  }
  return t;
}, Yh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return eo(r);
  } catch (r) {
    throw si(r);
  }
}, Xy = () => Vy(), jf = () => {
  if (typeof window > "u")
    return;
  const t = gi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Mr(t, e) ?? (t === window ? void 0 : Mr(window, e));
    if (n)
      return n;
  }
}, Zh = () => {
  if (typeof window > "u")
    return;
  const t = jf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = gi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Mr(e, n) ?? (e === window ? void 0 : Mr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ua = (t) => {
  var r, i;
  const e = Ws();
  if (zc(e) || Ky(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = gi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === Xy();
}, pl = (t) => {
  const e = S5(t);
  if (!e)
    return null;
  try {
    const n = ac(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, cc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = pl(t), r = x5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? $n(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = cc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of Wh)
    if (pl(i[a])) {
      s = $n(i[a]);
      break;
    }
  const o = $n(i.txId) || $n(i.txid) || $n(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? $n(i.txRaw) ?? void 0
    };
  for (const a of Wh) {
    const c = pl(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: $n(i[a]) ?? void 0
      };
  }
  for (const a of g5) {
    const c = i[a], u = cc(c, e + 1);
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
}, gl = (t) => {
  const e = cc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, E5 = (t) => {
  const e = cc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, A5 = (t) => ({
  ...t,
  fee: js(t.fee),
  nonce: js(t.nonce),
  sponsored: t.sponsored === !0
}), Qh = (t) => ({
  recipient: t.recipient,
  amount: js(t.amount) ?? "0",
  memo: t.memo,
  network: vu(t.network),
  address: t.stxAddress,
  fee: js(t.fee),
  nonce: js(t.nonce),
  sponsored: t.sponsored ?? !1
}), Yy = "WALLET_ADDRESS_MISMATCH", v5 = 45e3;
let Lo = null;
const $u = (t) => {
  t && (Lo = { address: t, at: Date.now() });
}, $5 = () => {
  Lo = null;
}, k5 = () => Lo && Date.now() - Lo.at <= v5 ? Lo.address : null, I5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, L5 = async (t) => {
  $5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = eo(await t.request("wallet_connect")), n = Do(e);
  return $u(n), n;
}, C5 = async (t, e, n, r) => {
  try {
    return eo(await t.request(e, n));
  } catch (i) {
    const s = si(i);
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
        { code: o ? Yy : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return eo(await t.request(e, n));
    } catch (a) {
      throw si(a);
    }
  }
};
let Jh = 3e4;
const T5 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Jh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Jh);
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
        { code: Yy }
      );
    return c;
  }, i = k5();
  if (i)
    return Aa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  Aa(n, "account-read");
  try {
    const c = eo(
      await T5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Do(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (Wy(c))
      throw si(c);
    Aa(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return $u(s), r(s, "wallet_getAccount");
  let o;
  Aa(n, "account-reconnect");
  try {
    o = eo(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), si(c);
  }
  const a = Do(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return $u(a), r(a, "wallet_connect");
}, M5 = async (t, e) => {
  if (!Ua(t)) {
    const s = await Yh(
      t,
      "stx_transferStx",
      Qh(e)
    );
    return gl(s);
  }
  const n = jf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Yh(
      n,
      "stx_transferStx",
      Qh(e)
    );
    return gl(s);
  }
  const r = Xy();
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
      amount: js(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: js(e.fee) } : {}
    },
    e.stxAddress
  );
  return gl(i);
}, N5 = () => Ws(), Zy = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Ws(), e = t ? w5(t) : void 0;
  if (e)
    return e;
  const n = gi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, t0 = (t, e) => {
  const n = Zy(), r = A5({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, E5(i));
    }
  });
  if (!n || typeof n.request != "function")
    return ma(r, e);
  if (Ua(n) && !jf()) {
    const i = Zh();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ws(),
        route: "legacy-transaction-request"
      }), ma(r, i);
  }
  return void M5(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Xh(i) && Ua(n)) {
      const a = Zh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ws(),
          route: "legacy-transaction-request"
        }), ma(r, a);
        return;
      }
    }
    if (Xh(i) && !Ua(n)) {
      ma(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), Wy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, P5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), e0 = (t) => Hy(t).replace(/^0x/, ""), n0 = "This wallet cannot sign messages. Try Xverse or Leather.", r0 = (t) => typeof (t == null ? void 0 : t.request) == "function", s0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", _5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, U5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function H5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: e0(e.message),
    domain: e0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function O5(t, e) {
  const n = await T4({
    domain: e.domain,
    message: e.message,
    network: Uc(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? P5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function i0(t) {
  var i, s;
  const e = N5() || "", n = /xverse/i.test(e);
  let r = Zy();
  if (n && !s0(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (s0(r))
    try {
      return await O5(r, t);
    } catch (o) {
      if (n || !r0(r) || !U5(o)) throw o;
    }
  if (!n && r0(r))
    try {
      return await H5(r, t);
    } catch (o) {
      throw _5(o) ? new Error(n0) : o;
    }
  throw new Error(n0);
}
const o0 = 1000000n, Os = 1000000n, lc = 50n, He = 3000n, yi = 300n, yo = 3000n, D5 = 50000n, yl = 200n, Rc = 15000n, kn = (t) => t + lc;
function or(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / o0}.${(n % o0).toString().padStart(6, "0")}`;
}
function a0(t, e = yi) {
  return t <= He ? 0 : Number((t - He) / kn(e));
}
function wl(t, e = 0n) {
  const n = Os - t - e;
  return n > 0n ? n : 0n;
}
function F5(t, e = yi) {
  return t > Os ? "over" : t < He + kn(e) ? "empty" : t < D5 ? "low" : "ok";
}
const j5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", z5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", R5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function G5(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || R5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== j5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Qy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", bl = 3, K5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [ku, Jy] = Qy.split("."), _n = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Iu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function V5(t) {
  return _n(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ms(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function tw(t, e = []) {
  const n = await ms(`/v2/contracts/call-read/${ku}/${Jy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: ku, arguments: e.map((r) => "0x" + _n(Le(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return lr(Dn(n.result));
}
async function q5() {
  const t = await ms(`/v2/contracts/source/${ku}/${Jy}?proof=0`);
  if (typeof t.source != "string" || await V5(t.source) !== z5) throw Error("Deployed source does not match the tested helper.");
  if (G5(await tw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function ew(t) {
  return t.startsWith("SP") && Ui(t) && !t.includes(".");
}
async function W5(t) {
  var r;
  if (!ew(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ms(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ms(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function X5(t) {
  const e = await ms(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function Y5(t, e) {
  var i, s;
  const n = await tw("get-owner", [Io(t), Io(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !ew(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function Z5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Iu(t), signal: AbortSignal.timeout(15e3) });
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
async function Q5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function J5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = ac(Iu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || Mi(So(sc.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || Mi(r.contractAddress) + "." + r.contractName.content !== Qy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || _n(Le(r.functionArgs[0])) !== _n(Le(Io(t.core))) || _n(Le(r.functionArgs[1])) !== _n(Le(Io(t.song))) || _n(Le(r.functionArgs[2])) !== _n(Le(d5(Iu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Zi.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== _o.Equal || s.principal.prefix !== 2 || Mi(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Mi(r.contractAddress) + "." + r.contractName.content !== K5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || _n(Le(r.functionArgs[0])) !== _n(Le(Io(t.song))) || typeof t.liked != "boolean" || _n(Le(r.functionArgs[1])) !== _n(Le(f5(t.liked))) || t.amount !== "0" || e.postConditionMode !== Zi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || lr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const t6 = "xtrata.xyz/radio/listening-wallet", e6 = "Link a temporary listening wallet for pay-per-play; no spending permission", ii = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ui(t), n6 = (t) => ({
  domain: ri({ name: Ke(t6), version: Ke("1"), "chain-id": hr(1) }),
  message: ri({
    purpose: Ke(e6),
    main: Ke(t.main),
    listening: Ke(t.listening),
    issued: hr(t.issued)
  })
}), nw = 100000n, r6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function s6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !ii(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= nw).sort(r6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const va = 50;
function uc(t) {
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
async function i6(t, e, n = 4) {
  if (!ii(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${va}&offset=${o}`, i = uc(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - va);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= va ? i : uc(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = s6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - va);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const kr = 50, o6 = 6, a6 = 20, c0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function l0(t, e) {
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
async function c6(t, e, n) {
  if (!ii(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = uc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${kr}&offset=0`));
    if (!i || i.total > o6 * kr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = kr; o < i.total; o += kr) {
      const a = uc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${kr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${kr}&offset=${u}`, a = l0(await e(o(0)), t);
      if (!a || a.total > a6 * kr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = kr; u < a.total; u += kr) {
        const f = l0(await e(o(u)), t);
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
function l6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(c0).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : ii(l.sender) && p >= nw ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), s = i.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && ii(l.recipient) && l.amount > 0n).sort(c0), a = o.reduce((l, y) => l + y.amount, 0n), c = s - n - a;
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
function u6(t, e) {
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
function u0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Ha = [100, 250, 500], f6 = (t, e) => BigInt(t) * kn(e), wo = ["prepared", "signed", "unknown", "pending"], d6 = 30 * 6e4, fc = 6e4, $i = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, h6 = 3e3, dc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", ml = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function p6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, f = !1, l = !1, y = !1, p = null, x = !1, S = "", B = "", j = 0, z, A = null, _, N = [], Q, tt = -1 / 0;
  const R = /* @__PURE__ */ new Set();
  let V = null, k = !1, P = 0, b = null, T = null, O = !1, C = null, it = !1, X = null, St = !1, v = !1, m = !1, W = !1, rt = !1, at = 0, vt = null, te = Promise.resolve();
  const kt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? yi.toString()), Ht = (w) => !!s && !(s.features ?? []).includes(w), Mt = (w, I) => `xtrata.ppp.v1.${w}:${I}`, Ft = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const I = JSON.parse(t.store.get(Mt("entries", w)) || "[]");
      return Array.isArray(I) ? I : [];
    } catch {
      return [];
    }
  }, et = (w) => {
    const I = [w, ...Ft(w.address).filter((K) => !(K.txid === w.txid && K.kind === w.kind))].slice(0, 200);
    t.store.set(Mt("entries", w.address), JSON.stringify(I));
  }, me = (w = s == null ? void 0 : s.address) => !!w && t.store.get(Mt("on", w)) !== "0", bn = (w) => {
    s != null && s.address && t.store.set(Mt("on", s.address), w ? "1" : "0");
  }, qe = () => Ft().filter((w) => wo.includes(w.status)), un = () => ae() ? [...qe(), ...Ft(qt()).filter((w) => wo.includes(w.status))] : qe(), ke = () => Be(s == null ? void 0 : s.address), Be = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(Mt("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, Me = (w, I = s == null ? void 0 : s.address) => {
    I && t.store.set(Mt("deposit", I), JSON.stringify(w));
  };
  let ee = null;
  const fn = (w = fc) => {
    const I = t.now();
    ee = { since: ee && I < ee.until ? ee.since : I, until: Math.max((ee == null ? void 0 : ee.until) ?? 0, I + w) };
  }, Oe = () => !!ee && t.now() < ee.until && (o === void 0 || o < He + kn(kt())), he = () => !!ke() || Oe(), qt = () => Ht("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), ae = () => !!(s != null && s.address) && qt() !== s.address, je = () => ae() ? c && c.for === qt() ? c.value : void 0 : o, Bn = (w) => w !== void 0 && w < He + yl, $ = () => qe().filter((w) => t.now() - w.created > d6 && R.has(w.txid)), D = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), U = () => D() && !(s != null && s.linked), G = () => {
    const w = t.main();
    return !U() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, ht = (w) => Mt("return-to", w), wt = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const I = t.store.get(ht(w));
    return I && ii(I) && I !== w ? I : void 0;
  }, Wt = (w = s == null ? void 0 : s.address) => V && V.for === w ? V.res : null;
  function Xt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = wt();
    if (w) return { to: w, kind: "chosen" };
    const I = Wt();
    if (I != null && I.ok && I.funder) return { to: I.funder, kind: "funder" };
  }
  const se = (w) => Mt("gift", w);
  function Yt() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((C == null ? void 0 : C.for) === w) return C.info;
    try {
      const I = JSON.parse(t.store.get(se(w)) || "null");
      return I && typeof I.returnTo == "string" && typeof I.treasury == "string" ? I : null;
    } catch {
      return null;
    }
  }
  async function Ne() {
    var dt;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((dt = e == null ? void 0 : e.gifts) != null && dt.enabled) || it) return;
    const I = (C == null ? void 0 : C.for) === w ? C : null, K = I ? I.ok ? I.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (I && t.now() - I.at < K) return;
    it = !0;
    const J = Yt();
    try {
      const F = await t.giftInfo(w);
      C = { for: w, info: F, ok: !0, at: t.now() }, t.store.set(se(w), JSON.stringify(F));
    } catch {
      C = { for: w, info: J, ok: !1, at: t.now() };
    } finally {
      it = !1;
    }
  }
  const Pe = () => Ft().reduce((w, I) => wo.includes(I.status) ? w + BigInt(I.amount || "0") + BigInt(I.fee || "0") : w, 0n);
  function Ot() {
    if (o === void 0) return 0;
    const w = o - Pe() - BigInt(Se.length) * kn(kt());
    return w > 0n ? a0(w, kt()) : 0;
  }
  const Et = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Gt = "EMPTY — ADD STX TO PLAY";
  function Zt() {
    var K;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((K = Yt()) != null && K.player) && !w) return null;
    const I = (J, dt) => ({ reason: J, text: dt });
    switch (en()) {
      case "connect":
      case "wrong-wallet":
        return I("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return I("locked", "UNLOCK TO LISTEN");
      case "link":
        return I("link", "FINISH SETUP TO LISTEN");
      case "over":
        return I("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return he() ? I("arriving", "YOUR PLAYS ARE ARRIVING") : I("out", ae() ? Et : Gt);
      case "ready":
        return !me() || !(s != null && s.session) || s.session.playsLeft < 1 ? I("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : m ? Ot() < 1 ? I("out", ae() ? Et : Gt) : null : I("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const pe = () => {
    var w;
    return !!(s != null && s.address) && ae() && !!((w = Yt()) != null && w.player);
  };
  function ie() {
    return pe() ? { locked: !0, known: !0 } : null;
  }
  const mn = 3 * 6e4, ge = () => !!Yt() && !!t.history && !(s != null && s.linked);
  async function As() {
    const w = s.address, I = Yt(), { balance: K, nonce: J } = await t.chain.account(w), dt = await t.history(w, !0);
    if (!dt.ok) return null;
    const F = l6({ self: w, balance: K, inbound: dt.inbound, outgoing: dt.outgoing, gift: { sender: I.treasury, payer: I.returnTo } });
    if (!F.ok) return null;
    const gt = u6(F.parts, yo);
    return { balance: K, nonce: J, parts: F.parts, steps: gt.steps, tooSmall: gt.tooSmall.length };
  }
  const wi = () => St ? { state: "unavailable" } : !X || t.now() - X.at > mn || o !== void 0 && o !== X.balance ? { state: "none" } : X.plan;
  function en() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!U()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : G() ? "wrong-wallet" : s.state === "known" ? "locked" : !U() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > Os ? "over" : o < He + kn(kt()) ? "fund" : "ready" : "loading";
  }
  const vs = () => {
    var w, I, K, J, dt;
    return {
      step: en(),
      busy: u,
      message: S,
      error: B,
      notice: Mn(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : F5(o, kt()),
      playsLeft: o === void 0 ? 0 : a0(o, kt()),
      allowance: o === void 0 ? Os : wl(o, BigInt(((w = ke()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: me(),
      entries: Ft(),
      depositTxid: ((I = ke()) == null ? void 0 : I.txid) ?? z,
      depositPending: he(),
      arrival: he() ? { since: ((K = ke()) == null ? void 0 : K.at) ?? (ee == null ? void 0 : ee.since) ?? t.now(), graceMs: fc } : null,
      walletOutdated: Ht("like"),
      linkedListening: Q && Q === t.main() ? N.map((F) => F.listening) : [],
      serverLinked: !!A && _ === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: $().length,
      armed: W,
      queued: Se.length,
      solo: U(),
      returnTo: (J = Xt()) == null ? void 0 : J.to,
      returnToKind: (dt = Xt()) == null ? void 0 : dt.kind,
      funderState: (() => {
        const F = Wt();
        return F ? F.ok ? F.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const F = Wt();
        return !!F && F.ok && F.distinct > 1;
      })(),
      walletCannotSolo: U() && Ht("standalone"),
      walletCannotMulti: Ht("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((F) => F !== t.main() && F !== (s == null ? void 0 : s.linked)),
      creditedTo: U() && (s != null && s.address) && (b == null ? void 0 : b.for) === s.address && b.main ? b.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(Mt("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (T == null ? void 0 : T.for) === s.address && T.unused,
      gift: (() => {
        const F = Yt();
        return F ? { player: F.player, from: F.from, source: F.source, amount: F.amount } : null;
      })(),
      giftPlays: Yt() ? Ot() : 0,
      playCost: kn(kt()),
      giftStop: Zt(),
      albumLock: ie(),
      returnPlan: wi(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Ht("slots"),
      likeFunds: (() => {
        var yt;
        const F = qt();
        if (!F || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const gt = je();
        return { address: F, balance: gt, low: Bn(gt), album: ae(), pending: !!Be(F), txid: (yt = Be(F)) == null ? void 0 : yt.txid, main: t.main() };
      })()
    };
  }, Mn = () => j ? j < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", d = (w, I = "") => {
    S = w, B = I, t.changed();
  };
  async function E(w, I) {
    if (!u) {
      u = w, B = "", t.changed();
      try {
        await I();
      } catch (K) {
        const J = K instanceof Error ? K.message : String(K);
        B = /Cancelled in the listening wallet/.test(J) ? "" : J, B || (S = "Not now. Nothing was signed.", rt = !0);
      } finally {
        u = null, await We(!0);
      }
    }
  }
  const L = () => !!(e != null && e.enabled) && e.here && (U() || !!t.main() && e.allowed), h = () => L() && !G(), ct = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", lt = () => {
    if (G()) throw new Error(ct());
  };
  async function At() {
    if (!L()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const Qt = (w) => {
    const I = t.main();
    return w.request("listening.status", I ? { main: I } : void 0);
  };
  async function xe(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await dn(w)));
  }
  async function dn(w = !1) {
    const I = qt();
    if (!(!ae() || !I || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === I && t.now() - c.at < 3e4))
      try {
        c = { for: I, value: await t.chain.balance(I), at: t.now() };
      } catch {
      }
  }
  async function Fn(w) {
    if ((Q !== w || t.now() - tt >= 6e4) && (N = await t.links(w), Q = w, tt = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const I = `${w}:${s.address}`;
    _ === I && A || (A = N.find((K) => K.listening === s.address) ?? null, _ = I);
  }
  async function ye() {
    const w = s == null ? void 0 : s.address;
    if (!U() || !w || s != null && s.linked || !t.funder || k || !o || o <= 0n) return;
    const I = Wt(w);
    if (I != null && I.ok && I.funder) return;
    const K = I != null && I.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(V && V.for === w && t.now() - V.at < K)) {
      k = !0;
      try {
        V = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        V = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        k = !1;
      }
      P = V.res.ok ? 0 : P + 1;
    }
  }
  async function mr() {
    const w = s == null ? void 0 : s.address;
    if (!(!U() || !w || s != null && s.linked || !t.mainOf || O) && !(b && b.for === w && (b.ok || t.now() - b.at < 6e4))) {
      O = !0;
      try {
        b = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        b = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        O = !1;
      }
    }
  }
  async function xr() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === w) && t.store.get(Mt("created", w)) !== "1")
      try {
        T = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Ur() {
    var dt;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let I, K = !1;
    const J = /* @__PURE__ */ new Map();
    for (const F of un())
      try {
        const gt = await t.chain.transaction(F.txid);
        if (!gt) {
          if (R.add(F.txid), t.now() - F.created > 15 * 6e4 && !J.has(F.address) && J.set(F.address, await t.chain.confirmedNonce(F.address)), I = J.get(F.address), I !== void 0 && I > BigInt(F.nonce)) {
            et({ ...F, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((F.status === "unknown" || F.status === "signed") && F.raw)
            try {
              await t.chain.broadcast(F.raw, F.txid), et({ ...F, status: "pending" });
            } catch (bt) {
              $i(bt) && et({ ...F, status: "failed", note: bt.message, raw: void 0 });
            }
          continue;
        }
        R.delete(F.txid);
        const yt = String(gt.tx_status);
        if (yt === "success" && gt.canonical !== !1 && gt.is_unanchored === !1) {
          if (et({ ...F, status: "confirmed", confirmedAt: t.now(), actualFee: String(gt.fee_rate ?? F.fee), raw: void 0 }), K = !0, F.kind === "like" && (x = !0, F.status !== "confirmed" && typeof F.liked == "boolean"))
            try {
              (dt = t.likeConfirmed) == null || dt.call(t, F.song, F.liked);
            } catch {
            }
        } else yt.startsWith("abort_") || yt.startsWith("dropped_") ? et({ ...F, status: "failed", note: yt, raw: void 0 }) : F.status !== "pending" && et({ ...F, status: "pending" });
      } catch {
      }
    for (const F of ae() ? [w, qt()] : [w]) {
      const gt = Be(F);
      if (gt)
        try {
          const yt = await t.chain.transaction(gt.txid), bt = String((yt == null ? void 0 : yt.tx_status) ?? "");
          (bt === "success" && yt.is_unanchored === !1 || bt.startsWith("abort_") || bt.startsWith("dropped_") || !yt && t.now() - gt.at > 2 * 36e5) && (Me(null, F), bt === "success" && fn(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return K;
  }
  async function We(w = !1) {
    var I;
    try {
      const K = t.main();
      if ((w || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !U() && (!K || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), W && ze(), t.changed();
        return;
      }
      await At(), s = await Qt(i), G() && s.state === "unlocked" && (tr(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await Qt(i)), K && e.allowed && await Fn(K), await xe(w), await ye(), await mr(), await xr(), await Ne(), await Ur() && await xe(!0), await dn(), await Sr(), j = 0;
    } catch {
      j++;
    }
    if (en() === "locked" ? $s() : W && ze(), x) {
      x = !1;
      try {
        (I = t.likesChanged) == null || I.call(t);
      } catch {
      }
    }
    t.changed(), Se.length && !zn && Er();
  }
  async function Qn(w) {
    const I = s == null ? void 0 : s.root;
    if (!I || s != null && s.slot || !(s != null && s.address) || Ht("slots")) return;
    const K = Number(t.store.get(Mt("slot", I)));
    if (!(!Number.isSafeInteger(K) || K < 1))
      try {
        const { balance: J } = await t.chain.account(s.address);
        if (J >= He + kn(kt())) return;
        await w.request("listening.openSlot", { slot: K }), s = await Qt(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function xn(w, I) {
    var F;
    lt();
    const K = !(s != null && s.address) || me(s.address), J = s != null && s.linked ? (F = t.nameOf) == null ? void 0 : F.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: K ? Hr() : void 0, anyPasskey: I, ...t.main() ? { main: t.main() } : {}, ...J ? { label: J } : {} }), s = await Qt(w), K && (me(s.address) ? await jn() : await w.request("listening.stop")), await Qn(w), d(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const dt = p;
    p = null, dt && t.now() - dt.at < 12e4 && setTimeout(() => void We(!0).then(() => Ar(dt)), 0);
  }
  function $s() {
    W || u || rt || at >= 3 || !i || !(s != null && s.address) || (W = !0, te = (async () => {
      try {
        await xn(i, !1), at = 0;
      } catch (w) {
        const I = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(I) ? vt || (rt = !0, d("Not now. Nothing was signed.")) : /did not answer/.test(I) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (at++, B = I);
      } finally {
        W = !1;
        const w = vt;
        vt = null, w ? await w() : await We(!0);
      }
    })());
  }
  async function ze(w) {
    W && (vt = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await te), w && await w(), t.changed();
  }
  const Hr = () => ({
    fee: kt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Os.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function jn() {
    if (!(s != null && s.address)) return !1;
    if (m || (m = await t.tabLock(s.address)), !m)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function mt(w, I) {
    const K = s.address, { balance: J, nonce: dt } = I ?? await t.chain.account(K);
    o = J;
    const F = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: J.toString(),
      nonce: dt.toString(),
      fee: yo.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (F.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const gt = w.mode === "amount" ? w.amount : w.mode === "all" ? J - yo : J - Os - yo, yt = ac(F.raw);
    if (lr(yt.payload.recipient).value !== w.to || String(yt.payload.amount) !== F.amount || gt !== void 0 && F.amount !== gt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const bt = {
      id: ml(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: F.recipient,
      amount: F.amount,
      fee: F.fee,
      nonce: dt.toString(),
      created: t.now(),
      status: "signed",
      raw: F.raw,
      txid: F.txid
    };
    t.validate(bt), et(bt);
    try {
      await t.chain.broadcast(F.raw, F.txid), et({ ...bt, status: "pending" });
    } catch (zt) {
      throw et({ ...bt, status: "unknown", note: zt.message }), zt;
    }
    return F;
  }
  const jt = Rc, ce = yo;
  async function Xe(w, I, K) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Ht("slots") || Ht("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const J = s.slot ?? 0;
    if (w === I || ![w, I].includes(J) || ![w, I].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const dt = s.root ?? s.address, F = w === 0 ? dt : s.address, gt = I === 0 ? dt : s.address, { balance: yt, nonce: bt } = await t.chain.account(F);
    if (yt < K + ce + He) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const zt = await i.request("listening.signMove", { from: w, to: I, amount: K.toString(), fee: ce.toString(), nonce: bt.toString(), balance: yt.toString() }), _e = ac(zt.raw);
    if (zt.from !== F || zt.to !== gt || zt.amount !== K.toString() || lr(_e.payload.recipient).value !== gt || String(_e.payload.amount) !== K.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Ye = {
      id: ml(),
      address: F,
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
    t.validate(Ye), et(Ye);
    try {
      await t.chain.broadcast(zt.raw, zt.txid), et({ ...Ye, status: "pending" });
    } catch (le) {
      throw et({ ...Ye, status: "unknown", note: le.message }), le;
    }
    return Me({ txid: zt.txid, amount: zt.amount, at: t.now() }, gt), gt === dt && dt !== s.address ? c = null : a = -1 / 0, zt;
  }
  let Or = !1;
  const Dr = /* @__PURE__ */ new Map(), Fr = (w) => Mt("float", w);
  async function Sr() {
    if (Or || (s == null ? void 0 : s.state) !== "unlocked" || !ae() || Ht("move") || Ht("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(Fr(w)) === "1") return;
    const I = Yt();
    if (!(I != null && I.player) || I.state !== "arrived") return;
    const K = je();
    if (K === void 0 || o === void 0) return;
    if (!Bn(K)) {
      t.store.set(Fr(w), "1");
      return;
    }
    if (Be(qt()) || Rn() || un().length || o < jt * 4n + He + ce) return;
    const J = Dr.get(w);
    if (!(J && (J.n >= 3 || t.now() - J.at < 5 * 6e4))) {
      Or = !0, Dr.set(w, { n: ((J == null ? void 0 : J.n) ?? 0) + 1, at: t.now() });
      try {
        await Xe(s.slot ?? 0, 0, jt), t.store.set(Fr(w), "1");
      } catch (dt) {
        console.warn("[radio] likes float not sent yet", dt);
      } finally {
        Or = !1;
      }
    }
  }
  async function jr(w) {
    if (qe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Ht("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const I = await As().catch(() => null);
    if (!I)
      throw X = null, St = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    St = !1, o = I.balance;
    const K = { balance: I.balance, nonce: I.nonce };
    if (w === "excess") {
      const yt = u0(I.parts) ?? wt();
      if (!yt) throw new Error("Choose where to send the excess first.");
      await mt({ mode: "excess", to: yt, linked: !1 }, K), X = null, d("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const J = I.steps;
    if (!J.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!X && X.balance === I.balance && t.now() - X.at <= mn && X.steps.length === J.length && X.steps.every((yt, bt) => yt.to === J[bt].to && yt.mode === J[bt].mode && yt.send === J[bt].send))) {
      X = {
        at: t.now(),
        balance: I.balance,
        steps: J,
        parts: I.parts,
        plan: { state: "ready", steps: J.map((yt) => ({ to: yt.to, kind: yt.kind, send: yt.send.toString() })), kept: I.tooSmall, excess: u0(I.parts) }
      }, d(J.length > 1 ? `This goes back in ${J.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const F = J[0], gt = F.to ?? wt();
    if (!gt) throw new Error("Choose where to send the rest first.");
    if (F.mode === "amount" && Ht("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await mt({ mode: F.mode, to: gt, linked: !1, ...F.mode === "amount" ? { amount: F.send } : {} }, K), X = null, J.length === 1 ? (bn(!1), d("Returned ✓ Paying is off.")) : d(`Returned ✓ ${J.length - 1} more ${J.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const ks = {
    forceRefresh: () => We(!0),
    create: () => E("Waiting for your passkey…", async () => {
      const w = await At();
      await w.request("listening.unlock", { mode: "create", terms: Hr(), ...t.main() ? { main: t.main() } : {} }), s = await Qt(w), s.address && t.store.set(Mt("created", s.address), "1"), bn(!0), d(U() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await jn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? fn() : ee = null, t.changed();
    },
    giftSent: (w, I) => {
      !(s != null && s.address) || ke() || (Me({ txid: w, amount: I.toString(), at: t.now() }), a = -1 / 0, C = null, d("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (lt(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ht("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await At()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, I, K, J) => {
      Me({ txid: K, amount: J.toString(), at: t.now() }, I), C = null, await ks.openAlbum(w), d("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => E("Opening…", async () => {
      if (lt(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ht("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (f || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      tr(), await i.request("listening.openSlot", { slot: w }), s = await Qt(i), o = void 0, a = -1 / 0, X = null, St = !1;
      const I = s.root;
      I && w > 0 && t.store.set(Mt("slot", I), String(w)), d(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const I = () => E("Waiting for your passkey…", async () => xn(await At(), w));
      return W ? w ? Ht("cancel") ? (d("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ze(async () => {
        (en() === "locked" || en() === "intro") && await I();
      }) : te : I();
    },
    link: () => E("Sign in your wallet…", async () => {
      lt();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const I = (await t.links(w)).find((K) => K.listening === s.address);
      if (I)
        await i.request("listening.link", { main: w, issued: I.issued, mainSignature: I.mainSignature });
      else {
        const K = { main: w, listening: s.address, issued: t.now() }, J = await t.signWithMain(w, n6(K)), dt = await i.request("listening.link", { main: w, issued: K.issued, mainSignature: J });
        await t.saveLink({ ...K, mainSignature: J, listeningSignature: dt.listeningSignature }), tt = -1 / 0;
      }
      d("Linked ✓");
    }),
    deposit: () => E("Approve the deposit in your wallet…", async () => {
      lt();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (ke()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Oe()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await xe(!0);
      const I = wl(o ?? 0n);
      if (I <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      z = await t.deposit(w, s.address, I), z && Me({ txid: z, amount: I.toString(), at: t.now() }), d("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => E("Approve the top-up in your wallet…", async () => {
      lt();
      const w = t.main(), I = qt();
      if (!w || !I) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Be(I)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const K = await t.chain.balance(I);
      ae() ? c = { for: I, value: K, at: t.now() } : (o = K, a = t.now());
      const J = wl(K);
      if (J <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const dt = await t.deposit(w, I, J);
      dt && Me({ txid: dt, amount: J.toString(), at: t.now() }, I), d("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => E("Adding plays…", async () => {
      if (lt(), !ae()) throw new Error("Open the album you want to add plays to first.");
      if (!Ha.includes(w)) throw new Error("Choose one of the amounts offered.");
      const I = f6(w, kt());
      if (f || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (un().length || ke()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Xe(0, s.slot ?? 0, I), d("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => E("Confirm in the listening wallet…", async () => {
      if (!h()) throw new Error("Connect your wallet first.");
      await jn(), await i.request("listening.approveSession", Hr()), bn(!0), d("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => E("Clearing…", async () => {
      for (const w of $())
        await t.chain.transaction(w.txid) || et({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      d("Cleared ✓");
    }),
    switchOff: () => E("Switching off…", async () => {
      tr(), await (i == null ? void 0 : i.request("listening.stop")), bn(!1), d("Paying is off. Music stays free.");
    }),
    lock: () => E("Locking…", async () => {
      tr(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, d("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const I = String(w ?? "").trim();
      if (!(s != null && s.address)) return d("", "Unlock the listening wallet first.");
      if (!ii(I)) return d("", "Enter a standard mainnet address (it starts with SP).");
      if (I === s.address) return d("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(ht(s.address), I), d("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(ht(s.address), ""), t.changed();
    },
    returnFunds: (w) => E("Check the return in the listening wallet…", async () => {
      if (!h()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (ge()) return jr(w);
      const I = Xt();
      if (!I) throw new Error(U() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (I.kind !== "linked" && Ht("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (qe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await mt({ mode: w, to: I.to, linked: I.kind === "linked" }), w === "all" && bn(!1), d(w === "all" ? I.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Se = [], Is = 10, Jn = 30 * 6e4;
  let zn = !1;
  const Rn = () => f || !!u || l || y, tr = () => {
    Se.length && (Se.length = 0, t.changed());
  };
  async function bi(w) {
    if (!Se.some((I) => I.id === w.id) && !Ft().some((I) => I.id === w.id) && (Se.push({ ...w, at: t.now() }), Se.length > Is && Se.shift()), Rn() || qe().length) {
      const I = Se.length;
      S = `Queued ${I === 1 ? "this song" : I + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Er();
  }
  async function Er() {
    if (!zn) {
      zn = !0;
      try {
        for (; Se.length; ) {
          for (; Se.length && t.now() - Se[0].at > Jn; ) Se.shift();
          if (!Se.length || Rn() || await mi(Se[0]) === "wait") return;
          Se.shift();
        }
      } finally {
        zn = !1, t.changed();
      }
    }
  }
  async function mi(w) {
    var I;
    f = !0;
    try {
      await We();
      const K = en();
      if (K === "loading") return "wait";
      if (K !== "ready" || !me() || !(s != null && s.session) || s.session.playsLeft < 1 || !m) return "done";
      if (qe().length) return "wait";
      v || (await t.chain.verify(), v = !0);
      const J = s.address, { balance: dt, nonce: F } = await t.chain.account(J);
      o = dt, a = t.now();
      const gt = await t.chain.owner(bl, w.song);
      if (gt === J || gt === t.main()) return "done";
      const yt = await i.request("listening.signPlay", {
        core: bl,
        song: w.song,
        receipt: w.id,
        fee: kt().toString(),
        nonce: F.toString(),
        balance: dt.toString()
      }), bt = {
        id: w.id,
        address: J,
        kind: "play",
        core: bl,
        song: w.song,
        recipient: gt,
        amount: "50",
        fee: kt().toString(),
        nonce: F.toString(),
        created: t.now(),
        status: "signed",
        raw: yt.raw,
        txid: yt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(bt), et(bt);
      const zt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(yt.raw, yt.txid), et({ ...bt, status: "pending" }), S = `♪ Paid ${zt}`, B = "";
      } catch (_e) {
        et({ ...bt, status: $i(_e) ? "failed" : "unknown", note: _e.message, ...$i(_e) ? { raw: void 0 } : {} }), B = _e.message;
      }
      return s = await Qt(i), "done";
    } catch (K) {
      const J = K instanceof Error ? K.message : "payment unavailable";
      return (I = Yt()) != null && I.player ? (S = "Payment is taking a moment: " + J, "wait") : (S = "This song played free: " + J, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function lo(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(en()) || Ht("like") ? !1 : (Ar(w), !0);
  }
  async function Ar(w) {
    const I = w.title ? `“${w.title}”` : `song #${w.song}`, K = (Sn) => {
      var q;
      B = Sn, S = "";
      try {
        (q = t.likeFailed) == null || q.call(t, w.song);
      } catch {
      }
      t.changed();
    }, J = ae(), dt = en(), F = t.main(), gt = J && (dt === "fund" || dt === "over") ? "ready" : dt, yt = U() ? qt() : F;
    if (gt === "locked") {
      p = { ...w, at: t.now() }, d(`Unlock to like ${I}. It sends straight after.`);
      return;
    }
    if (gt === "wrong-wallet") return K(ct());
    if (gt === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (U() && Ht("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (gt === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (gt === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (J) {
      await dn(!0);
      const Sn = je();
      if (Bn(Sn))
        return t.changed(), K(dc);
    }
    if (gt !== "ready" || !yt) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!m) return K("Pay-per-play is running in another tab. Like from that tab.");
    const bt = Ft(qt()).find((Sn) => Sn.kind === "like" && Sn.song === w.song);
    if (bt && wo.includes(bt.status))
      return K(`Your last like for ${I} is still on its way. It can change again once it confirms.`);
    if (l) return K("One like at a time: your last one is still being sent.");
    if ((bt == null ? void 0 : bt.status) === "confirmed" && t.now() - (bt.confirmedAt ?? 0) < h6)
      return K(`Your like for ${I} has only just confirmed. Try again in a moment.`);
    let zt;
    y = !0;
    try {
      zt = t.likeState ? (await t.likeState(yt, w.song)).by : w.likedBy ?? [];
    } catch {
      zt = w.likedBy;
    } finally {
      y = !1;
    }
    if (!zt) return K(`Could not check ${I} right now. Try the heart again.`);
    const _e = qt(), le = ((bt == null ? void 0 : bt.status) === "confirmed" && typeof bt.liked == "boolean" && t.now() - (bt.confirmedAt ?? bt.created) < 5 * 6e4 ? bt.liked : void 0) ?? zt.includes(_e);
    if (!le && zt.some((Sn) => Sn !== _e)) return K(U() ? `${I} was liked from another wallet of yours. Unlike it there.` : `${I} was liked from your main wallet${zt.includes(F) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await xi({ song: w.song, liked: !le, title: w.title, artist: w.artist });
  }
  async function xi(w) {
    var J, dt, F;
    if (l) {
      d("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const I = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, K = t.wait ?? ((gt) => new Promise((yt) => setTimeout(yt, gt)));
    try {
      d(`${w.liked ? "Liking" : "Unliking"} ${I}…`);
      const gt = t.now() + 12e4;
      for (; f || (ae() ? Ft(qt()).some((le) => wo.includes(le.status)) : qe().length); ) {
        if (t.now() > gt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await We(!0);
      }
      if (!ae() && en() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const yt = qt(), { balance: bt, nonce: zt } = await t.chain.account(yt);
      if (ae() ? c = { for: yt, value: bt, at: t.now() } : (o = bt, a = t.now()), Bn(bt)) throw new Error(dc);
      const _e = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: yl.toString(),
        nonce: zt.toString(),
        balance: bt.toString()
      }), Ye = {
        id: ml(),
        address: yt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: yl.toString(),
        nonce: zt.toString(),
        created: t.now(),
        status: "signed",
        raw: _e.raw,
        txid: _e.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(Ye), et(Ye);
      try {
        await t.chain.broadcast(_e.raw, _e.txid), et({ ...Ye, status: "pending" }), S = `${w.liked ? "♥ Liked" : "Unliked"} ${I}`, B = "";
        try {
          (J = t.likeSent) == null || J.call(t, w.song, w.liked);
        } catch {
        }
      } catch (le) {
        if (et({ ...Ye, status: $i(le) ? "failed" : "unknown", note: le.message, ...$i(le) ? { raw: void 0 } : {} }), B = le.message, $i(le)) try {
          (dt = t.likeFailed) == null || dt.call(t, w.song);
        } catch {
        }
      }
      s = await Qt(i);
    } catch (gt) {
      B = "Like not sent: " + (gt instanceof Error ? gt.message : "the listening wallet is unavailable");
      try {
        (F = t.likeFailed) == null || F.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Er();
    }
  }
  return { snapshot: vs, refresh: We, onListened: bi, heart: lo, toggleLike: Ar, ...ks };
}
const rw = ["Connect", "Passkey", "Link & fund", "Listen"], sw = ["Passkey", "Add 1 STX", "Listen"], Lu = (t) => t ? sw : rw;
function g6(t) {
  if (t.solo) return y6(t);
  const e = rw.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function y6(t) {
  const e = sw.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function w6(t, e) {
  return !e || e.at >= Lu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const b6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function m6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !b6(r.id)));
}
const x6 = {}, S6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, E6 = (t) => {
  const e = x6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, A6 = (t) => `/hiro/${t}`, v6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, $6 = (t) => {
  const e = E6(t);
  if (e)
    return [v6(e)];
  const n = S6[t];
  return typeof window < "u" ? [`${window.location.origin}${A6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, k6 = {}, f0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, I6 = "xtrata.log.enabled", L6 = "xtrata.log.level", C6 = "xtrata.log.tags", T6 = "xtrata.log.dedupe", $a = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, B6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, M6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, N6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, P6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, _6 = () => {
  const t = k6 ?? {}, e = $a(I6) ?? t.VITE_LOG_ENABLED, n = $a(L6) ?? t.VITE_LOG_LEVEL, r = $a(C6) ?? t.VITE_LOG_TAGS, i = $a(T6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: B6(e),
    level: M6(n) ?? "warn",
    tags: P6(r),
    dedupe: N6(i)
  };
}, U6 = (t, e, n) => !t.enabled || f0[n] < f0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), H6 = (t, e, n, r) => {
  const i = _6();
  if (!U6(i, e, t) || D6(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, O6 = /* @__PURE__ */ new Set();
let d0 = null;
const D6 = (t, e, n, r, i) => (d0 !== t && (O6.clear(), d0 = t), !1), F6 = (t, e, n) => H6("debug", t, e, n), j6 = {}, z6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, R6 = (t) => {
  const e = j6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : z6[t];
}, G6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, K6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return G6.test(n) ? n : null;
}, V6 = (t) => t.replace(/\/+$/, ""), q6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), h0 = (t) => {
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
}, ki = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, W6 = (t) => {
  var c, u;
  let e;
  try {
    e = lr(q8(t));
  } catch {
    return null;
  }
  const n = ki(e);
  if (!n || n.success === !1)
    return null;
  const r = ki(n.value), i = ki(r == null ? void 0 : r.value), s = ki(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = h0((c = ki(s.name)) == null ? void 0 : c.value), a = h0((u = ki(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : K6(`${o}.${a}`);
}, X6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${V6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Hy(xy(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : W6(s.result);
}, Y6 = async (t) => {
  const e = t.address.trim();
  if (!Ui(e))
    return null;
  const n = R6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of $6(t.network))
    try {
      return await X6({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return F6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: q6(r)
  }), null;
};
function Z6(t, e, n = {}) {
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
const p0 = Object.freeze({
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
}), g0 = Object.freeze({ 139: "melophonic" });
function Q6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(p0, n) ? p0[n] : Object.hasOwn(g0, n) ? g0[n] : e;
}
const y0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function J6(t, e = "") {
  return Object.hasOwn(y0, String(t)) ? y0[String(t)] : e;
}
const iw = 10000n, zf = 1000000n, hc = 3000n, t$ = (t, e) => `${t}#gift=${e}`, e$ = 100, ka = (t, e = yi) => t <= He ? 0 : Number((t - He) / kn(e)), w0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), ow = "xtrata.xyz/radio/gifts", xl = e$, n$ = "Create a prefunded Xtrata radio gift batch", r$ = (t) => ({
  domain: ri({ name: Ke(ow), version: Ke("1"), "chain-id": hr(1) }),
  message: ri({
    purpose: Ke(n$),
    creator: Ke(t.creator),
    count: hr(t.count),
    amount: hr(BigInt(t.amount)),
    label: Ke(t.label),
    issued: hr(t.issued),
    ...t.player ? { player: Ke(t.player) } : {}
  })
}), s$ = (t, e, n = yi) => He + BigInt(t) * kn(n) + (e ? Rc : 0n), i$ = (t, e = yi) => Number((zf - He - (t ? Rc : 0n)) / kn(e)), o$ = (t, e) => BigInt(t) * (e + hc);
function a$(t, e, n, r = yi) {
  const i = n ? Rc : 0n, s = e > He + i ? e - He - i : 0n, o = Number(s / kn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * lc,
    fees: BigInt(o) * r,
    reserve: He,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: hc,
    perCopy: e + hc,
    total: o$(t, e)
  };
}
const c$ = (t) => t >= iw && t <= zf, b0 = 40, l$ = "Create an Xtrata radio gift player", u$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function m0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && u$.test(t) : !n;
}
function f$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!m0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!m0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > b0) throw new Error(`A player holds 1 to ${b0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const d$ = (t) => Ap(Cp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), h$ = (t) => ({
  domain: ri({ name: Ke(ow), version: Ke("1"), "chain-id": hr(1) }),
  message: ri({
    purpose: Ke(l$),
    admin: Ke(t.admin),
    player: Ke(t.hash),
    issued: hr(t.issued)
  })
}), Hi = (t) => t.tracks.filter((e) => !e.hidden), p$ = (t) => t.tracks.find((e) => e.hidden) ?? null, g$ = [300, 500, 1e3], x0 = 1800, Sl = /* @__PURE__ */ new Map();
async function y$(t) {
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
function w$(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = Sl.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Sl.set(t, { ...a, until: Date.now() + x0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Sl.delete(t), i();
      }, x0 + 50);
    }
  }, s;
}
const Pi = (t, e, n, r, i) => w$(t, e, async () => await y$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), Cs = "xtrata.radio.gift.incoming.v1", S0 = (t) => "xtrata.radio.gift.mine.v1:" + t, E0 = (t) => "xtrata.radio.gift.batches.v1:" + t, xt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ir = (t, e, n = "") => {
  const r = xt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ia = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Pn = (t) => or(t).replace(/\.?0+$/, "");
function b$(t) {
  let e = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), D = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return D !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), w0(D) ? D : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const $ = JSON.parse(t.store.get(Cs) || "null");
      return w0($ == null ? void 0 : $.code) ? $.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(Cs, JSON.stringify({ code: s, at: t.now() }));
    let $ = 0;
    const D = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (U) => {
      const G = await U.json().catch(() => ({}));
      if (U.status === 404) {
        t.store.set(Cs, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!U.ok) throw new Error("busy");
      const ht = G;
      e = { ...e, view: ht, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ht.status) && t.store.set(Cs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void D(), n($++)));
    });
    D();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const $ = e == null ? void 0 : e.view;
    return !($ != null && $.player) || !o() ? null : { player: $.player, from: u($), plays: ka(BigInt($.amount)) };
  }, c = () => {
    e = null, t.store.set(Cs, null), t.changed();
  }, u = ($) => $.from ? t.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let f = {};
  const l = ($) => {
    if (f.box) return f.box;
    const D = xt("div", "", "ppp-gift-check");
    f.box = D;
    const U = () => {
      const G = window.turnstile;
      !G || f.rendered || (f.rendered = !0, G.render(D, { sitekey: $, callback: (ht) => {
        f.token = ht, t.changed();
      }, "expired-callback": () => {
        f.token = void 0;
      } }));
    };
    if (window.turnstile) U();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = U, document.head.append(G);
    }
    return D;
  }, y = ($) => {
    queueMicrotask(() => void $());
  };
  let p;
  async function x($) {
    var G, ht, wt, Wt, Xt, se, Yt, Ne, Pe;
    if (!e || e.claiming || !$.listening) return;
    const D = !!((G = e.view) != null && G.player);
    if (D && !$.root) return;
    e.claiming = !0, e.error = void 0, (ht = t.claiming) == null || ht.call(t, !0), t.changed();
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
      if (D) {
        const ie = Number((wt = await t.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : wt.next);
        if (!Number.isSafeInteger(ie) || ie < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Ot = ie;
        for (let mn = 0; ; mn++) {
          const ge = await t.album.bind(Ot);
          if (Et = ge.address, Gt = await U({ wallet: Et, binding: ge }), Gt.res.status === 409 && /just taken/.test(((Wt = Gt.r) == null ? void 0 : Wt.error) || "") && mn < 5) {
            Ot += 1;
            continue;
          }
          break;
        }
      } else Gt = await U({ wallet: Et });
      const { res: Zt, r: pe } = Gt;
      if (Zt.status === 503 && /sending another gift/.test((pe == null ? void 0 : pe.error) || "")) {
        e.waiting = !0, (Xt = t.claiming) == null || Xt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Zt.ok) {
        const ie = String((pe == null ? void 0 : pe.error) || "");
        if (Zt.status === 404 || Zt.status === 410 || Zt.status === 409 && /already had a gift|brand-new|already have this album/.test(ie))
          throw t.store.set(Cs, null), new Error(ie || "This gift cannot be opened.");
        if (Zt.status === 429 || Zt.status === 403 || Zt.status === 400 && !/wallet number/i.test(ie)) throw new Error(ie || `Could not open the gift (${Zt.status}).`);
        const ge = /topping up/.test(ie) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ie) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ie) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(ge), { retry: !0, slow: /topping up|not paid for yet/.test(ie) });
      }
      e.done = !0, t.store.set(Cs, null), D ? await t.album.arrived(Ot, Et, pe.txid, BigInt(pe.amount)) : t.giftSent(pe.txid, BigInt(pe.amount));
    } catch (Ot) {
      const Et = Ot, Gt = Et.name === "TypeError" || Et.name === "AbortError" || Et.name === "TimeoutError" || /wallet number/i.test(Et.message);
      if (Et.retry || Gt) {
        const Zt = e.tries ?? 0;
        e.tries = Zt + 1, e.retry = { text: Et.retry ? Et.message : "Still sending your gift… the network is slow, trying again." }, (se = t.claiming) == null || se.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, Et.slow ? 6e4 : n(Zt));
      } else
        e.error = Et.message, (Yt = t.claiming) == null || Yt.call(t, !1);
      f.token = void 0;
      try {
        (Pe = (Ne = window.turnstile) == null ? void 0 : Ne.reset) == null || Pe.call(Ne, f.box);
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
      S = { ...(S == null ? void 0 : S.wallet) === U ? S : {}, wallet: U, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(U)).then((G) => {
        var ht, wt;
        (S == null ? void 0 : S.wallet) === U && (S.state = (ht = G == null ? void 0 : G.gift) == null ? void 0 : ht.state, S.problem = ((wt = G == null ? void 0 : G.gift) == null ? void 0 : wt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(S.state === "sending" && S.problem)) return [];
    const D = xt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return D.title = `Network reply: ${S.problem}`, [D];
  }
  function j($, D, U = !1) {
    var se, Yt;
    const G = D.player, ht = BigInt(D.amount), wt = U ? [] : [xt("p", `🎁 ${u(D)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${Hi(G).length} ${Hi(G).length === 1 ? "song" : "songs"} and ${ka(ht).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step))) {
      if (U) return wt;
      if (wt.push(xt("p", $.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : $.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), $.step === "intro") {
        const Ne = document.createElement("details");
        Ne.className = "ppp-how";
        const Pe = document.createElement("summary");
        Pe.textContent = "How does this work?", Ne.append(Pe, xt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), wt.push(Ne);
      }
      return wt;
    }
    if ($.walletCannotAlbums)
      return wt.push(xt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), wt;
    const Xt = (Yt = (se = $.gate) == null ? void 0 : se.gifts) == null ? void 0 : Yt.turnstileSiteKey;
    return Xt && !f.token ? wt.push(xt("p", "One quick check and it is yours:", "ppp-mute"), l(Xt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => x($)), wt.push(...z($, "Sending your album…")), wt;
  }
  function z($, D) {
    const U = [];
    return e.claiming || e.waiting ? U.push(xt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : D, "ppp-cyan")) : e.retry && U.push(xt("p", e.retry.text, "ppp-warn"), Ir("Try now", () => {
      clearTimeout(p), e.retry = void 0, x($);
    }, "quiet")), e.error && U.push(xt("p", e.error, "ppp-bad"), Ir("Try again", () => {
      e.error = void 0, x($);
    })), U;
  }
  const A = ($) => {
    var D;
    return !!e && !e.done && !e.error && o() && !!$.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((D = e.view) != null && D.player)) && ($.balance ?? 0n) === 0n && !$.entries.length);
  };
  function _($, D = {}) {
    var Pe, Ot;
    const U = B($);
    if (!e || ["off", "elsewhere"].includes($.step)) return U;
    const G = e.view;
    if (e.error && !G) return [xt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [xt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return U;
    if (G.status === "claimed" || G.status === "claiming") return [xt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [xt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [xt("p", `🎁 ${u(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...j($, G, !!D.bare), ...U];
    if (!!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0))
      return [xt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Ir("Forget this gift link here", c, "quiet")];
    const wt = BigInt(G.amount), Wt = ka(wt).toLocaleString(), se = [xt(
      "p",
      `🎁 ${u(G)} sent you ${Pn(wt)} STX of on-chain music: about ${Wt} paid plays.`,
      "ppp-gift"
    )], Yt = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, Ne = (Ot = (Pe = $.gate) == null ? void 0 : Pe.gifts) == null ? void 0 : Ot.turnstileSiteKey;
    return Yt ? (Ne && !f.token ? se.push(xt("p", "One quick check and it is yours:", "ppp-mute"), l(Ne)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => x($)), se.push(...z($, "Sending your gift…"))) : $.step === "intro" ? se.push(xt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : $.listening && $.linked ? se.push(xt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Ir("Forget this gift link here", c, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && se.push(xt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Ir("Forget this gift link here", c, "quiet")), se;
  }
  async function N($, D, U) {
    var G;
    try {
      const ht = await t.json("/radio/gift/for?wallet=" + encodeURIComponent($));
      if ((G = ht == null ? void 0 : ht.gift) != null && G.returnTo) return { ok: !0, funder: ht.gift.returnTo, txId: ht.gift.txid ?? void 0, amount: ht.gift.amount, distinct: 1 };
    } catch {
      if (U) return { ok: !1 };
    }
    return D();
  }
  const Q = xt("div", "", "ppp-gift-fold");
  let tt = 250000n, R = "", V = "";
  const k = ($) => {
    try {
      const D = JSON.parse(t.store.get(S0($)) || "[]");
      return Array.isArray(D) ? D : [];
    } catch {
      return [];
    }
  }, P = ($, D) => t.store.set(S0($), JSON.stringify(D.slice(0, 50)));
  async function b($) {
    const D = k($);
    for (const U of D)
      if (!(U.view && ["claimed", "refunded", "expired"].includes(U.view.status)))
        try {
          U.view = !U.view || U.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: U.id, ...U.txid ? { txid: U.txid } : {} }) }) : await t.json("/radio/gift?id=" + U.id), U.error = void 0;
        } catch (G) {
          U.error = G.message;
        }
    P($, D), t.changed();
  }
  async function T($) {
    if (R) return;
    R = "Starting your gift…", V = "", t.changed();
    let D = null;
    try {
      D = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: tt.toString() }) });
      const U = k($);
      U.unshift({ id: D.id, code: D.code, amount: tt.toString(), at: t.now() }), P($, U), R = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay($, D.depositTo, BigInt(D.deposit), D.memo), ht = k($), wt = ht.find((Wt) => Wt.id === D.id);
      wt && (wt.txid = G, wt.view = { status: "pending-deposit", amount: tt.toString(), source: "friend", from: $, label: "", expires: 0 }), P($, ht), V = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", b($);
    } catch (U) {
      V = U.message || "Not sent.";
    } finally {
      R = "", t.changed();
    }
  }
  const O = ($) => "xtrata.radio.gift.players.v1:" + $, C = ($) => {
    try {
      const D = JSON.parse(t.store.get(O($)) || "[]");
      return Array.isArray(D) ? D.filter((U) => U && /^[0-9a-f]{16}$/.test(U.id)) : [];
    } catch {
      return [];
    }
  };
  async function it($, D) {
    var U;
    if (!R) {
      R = "Checking the player…", V = "", t.changed();
      try {
        const G = D.tracks.split(/[\s,]+/).filter(Boolean).map((Yt) => Number(Yt.replace(/^#/, ""))), ht = f$({ title: D.title.trim(), subtitle: D.subtitle.trim(), tracks: G, cover: (U = D.cover) != null && U.trim() ? Number(D.cover.trim().replace(/^#/, "")) : null });
        R = "Sign in your wallet…", t.changed();
        const wt = { admin: $, hash: d$(ht), issued: t.now() }, Wt = await t.sign($, h$(wt));
        R = "Making the player…", t.changed();
        const Xt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ht, request: wt, signature: Wt }) }), se = C($).filter((Yt) => Yt.id !== Xt.id);
        se.unshift({ id: Xt.id, title: Xt.title, tracks: Xt.tracks }), t.store.set(O($), JSON.stringify(se.slice(0, 30))), V = `${Xt.existing ? "That player already exists" : "Player made"} ✓ “${Xt.title}” · ${Xt.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        V = G.message || "Not made.";
      } finally {
        R = "", t.changed();
      }
    }
  }
  const X = ($, D) => t$($ || location.origin + "/radio.html", D), St = ($) => {
    try {
      const D = JSON.parse(t.store.get(E0($)) || "[]");
      return Array.isArray(D) ? D.filter((U) => U && /^[0-9a-f]{16}$/.test(U.id) && Array.isArray(U.codes)) : [];
    } catch {
      return [];
    }
  }, v = ($, D) => t.store.set(E0($), JSON.stringify(D.slice(0, 20))), m = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, W = ($, D) => t.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(D) });
  let rt = 0;
  async function at($) {
    const D = St($);
    for (const U of D)
      if (!m(U))
        try {
          U.view = !U.view || U.view.status === "pending-deposit" ? await W("/radio/gift/batch/confirm", { id: U.id, ...U.txid ? { txid: U.txid } : {} }) : await t.json("/radio/gift/batch?id=" + U.id), U.error = void 0;
        } catch (G) {
          U.error = G.message;
        }
    try {
      const U = await t.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const G of (U == null ? void 0 : U.batches) ?? []) {
        const ht = D.find((wt) => wt.id === G.id);
        if (ht) {
          ht.error || (ht.view = G);
          continue;
        }
        D.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    v($, D), t.changed();
  }
  async function vt($, D) {
    const U = St($).find((G) => G.id === D);
    if (!(!U || !U.depositTo || R)) {
      R = "Approve the payment in your wallet…", V = "", t.changed();
      try {
        const G = await t.pay($, U.depositTo, BigInt(U.deposit), U.memo), ht = St($), wt = ht.find((Wt) => Wt.id === D);
        wt && (wt.txid = G), v($, ht), V = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", R = "", at($);
      } catch (G) {
        V = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        R = "", t.changed();
      }
    }
  }
  async function te($, D, U, G) {
    if (R) return;
    if (!D.ok) {
      V = D.reason, t.changed();
      return;
    }
    R = "Sign in your wallet…", V = "", t.changed();
    let ht = null;
    try {
      const wt = { creator: $, count: D.count, amount: D.amount.toString(), label: U, issued: t.now(), ...G ? { player: G } : {} }, Wt = await t.sign($, r$(wt));
      R = "Making your links…", t.changed(), ht = await W("/radio/gift/batch", { request: wt, signature: Wt });
      const Xt = St($);
      Xt.unshift({ id: ht.id, codes: ht.codes, count: D.count, amount: ht.amount, label: U, player: G ?? null, depositTo: ht.depositTo, deposit: ht.deposit, memo: ht.memo, at: t.now() }), v($, Xt);
    } catch (wt) {
      V = wt.message || "Not made.", R = "", t.changed();
      return;
    }
    R = "", t.changed(), await vt($, ht.id);
  }
  function kt() {
    const $ = !!ee.value, D = fn.value === "max" ? i$($) : Number(fn.value), U = s$(D, $), G = Number(Oe.value);
    return !Number.isInteger(G) || G < 1 || G > xl ? { ok: !1, reason: `Make 1 to ${xl} copies at a time.`, album: $, plays: D, amount: U, count: G } : c$(U) ? { ok: !0, reason: "", album: $, plays: D, amount: U, count: G, bill: a$(G, U, $) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: $, plays: D, amount: U, count: G };
  }
  const Ht = () => {
    const $ = kt();
    if (!$.ok) return $.reason;
    const D = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${Pn(D.holders)} to song holders, ${Pn(D.fees)} network fees)${$.album ? `, ${Pn(D.float)} for the album’s likes` : ""}, ${Pn(D.reserve)} kept so a listener can return what is left, + ${Pn(D.sendFee)} to send it = ${Pn(D.perCopy)} STX. ${$.count} copies = ${Pn(D.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Mt = ($, D) => D.codes.map((U) => X($, U)), Ft = xt("input");
  Ft.type = "range", Ft.min = String(iw), Ft.max = String(zf), Ft.step = "10000", Ft.value = String(tt), Ft.setAttribute("aria-label", "Gift amount");
  const et = xt("p", "", "ppp-gift-amount"), me = Ir("", () => {
    const $ = t.main();
    $ && T($);
  }, "primary"), bn = () => {
    et.textContent = qe(), me.textContent = `Gift ${Pn(tt)} STX`;
  };
  Ft.oninput = () => {
    tt = BigInt(Ft.value), bn();
  };
  const qe = () => `${Pn(tt)} STX · about ${ka(tt).toLocaleString()} paid plays · you pay ${Pn(tt + hc)} STX with the network fee`;
  bn();
  const un = xt("input");
  un.maxLength = 60, un.placeholder = "Title, e.g. Proof of Sound", un.setAttribute("aria-label", "Player title");
  const ke = xt("input");
  ke.maxLength = 80, ke.placeholder = "Artist (optional)", ke.setAttribute("aria-label", "Player subtitle");
  const Be = xt("textarea");
  Be.rows = 3, Be.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Be.setAttribute("aria-label", "Songs");
  const Me = xt("input");
  Me.inputMode = "numeric", Me.placeholder = "Cover inscription number (optional), shown when the album loads", Me.setAttribute("aria-label", "Cover inscription");
  const ee = xt("select");
  ee.setAttribute("aria-label", "Batch album");
  const fn = xt("select");
  fn.setAttribute("aria-label", "Plays per copy");
  for (const $ of g$) fn.append(Ia(`${$.toLocaleString()} plays`, String($)));
  fn.append(Ia("Max (1 STX)", "max"));
  const Oe = xt("input");
  Oe.type = "number", Oe.min = "1", Oe.max = String(xl), Oe.value = "10", Oe.setAttribute("aria-label", "Copies");
  const he = xt("input");
  he.maxLength = 40, he.placeholder = "Label, e.g. Opera launch", he.setAttribute("aria-label", "Batch label");
  const qt = xt("p", "", "ppp-mute"), ae = () => {
    qt.textContent = Ht();
  };
  for (const $ of [ee, fn, Oe])
    $.oninput = ae, $.onchange = ae;
  ae();
  function je($) {
    var ht, wt;
    const D = (ht = $.gate) == null ? void 0 : ht.gifts;
    if (!(D != null && D.enabled) || !D.admin || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const U = t.main(), G = [xt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!U)
      G.push(xt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (D.admin) {
      const Wt = xt("div", "", "ppp-gift-admin"), Xt = (Ot, Et) => {
        const Gt = xt("label", Ot);
        return Gt.append(Et), Gt;
      }, se = C(U);
      Wt.append(
        xt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        un,
        ke,
        Be,
        Me,
        Ir("Sign and make player", () => void it(U, { title: un.value, subtitle: ke.value, tracks: Be.value, cover: Me.value }))
      );
      const Yt = Ir("Sign, pay and make links", () => {
        te(U, kt(), he.value.trim(), ee.value || void 0);
      });
      Yt.disabled = !!R;
      const Ne = ee.value;
      ee.replaceChildren(Ia("No album (starter copies)", ""), ...se.map((Ot) => Ia(`${Ot.title} · ${Ot.tracks} songs`, Ot.id))), se.some((Ot) => Ot.id === Ne) && (ee.value = Ne), ae(), Wt.append(
        xt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Xt("Album ", ee),
        Xt("Plays each ", fn),
        Xt("Copies ", Oe),
        he,
        qt,
        Yt
      ), t.now() - rt > 3e4 && (rt = t.now(), at(U));
      const Pe = St(U);
      if (Pe.length) {
        const Ot = xt("ul", "", "ppp-gift-list");
        for (const Et of Pe.slice(0, 10)) {
          const Gt = Et.view, Zt = Gt == null ? void 0 : Gt.copies, pe = Et.error ? Et.error : !Gt || Gt.status === "pending-deposit" ? Et.txid ? "payment confirming…" : "waiting for your payment" : `${Zt.claimed} of ${Gt.count} claimed${Zt.refunding + Zt.refunded ? ` · ${Zt.refunded} refunded${Zt.refunding ? `, ${Zt.refunding} on their way` : ""}` : ""}`, ie = xt("li");
          if (ie.append(xt("span", `${Et.label || "Batch"} · ${Et.count} × ${Pn(BigInt(Et.amount))} STX`, "t"), xt("span", pe, "ppp-mute")), !Et.txid && Et.depositTo && (!Gt || Gt.status === "pending-deposit") && ie.append(Ir("Pay now", () => void vt(U, Et.id), "tiny")), Et.codes.length && (Gt == null ? void 0 : Gt.status) === "live") {
            const mn = Mt(((wt = $.gate) == null ? void 0 : wt.radioUrl) ?? null, Et);
            ie.append(
              Pi("batch-copy:" + Et.id, "Copy all links", () => mn.join(`
`), "tiny", t.changed),
              Pi("batch-csv:" + Et.id, "Copy as CSV", () => ["copy,link", ...mn.map((ge, As) => `${As + 1},${ge}`)].join(`
`), "tiny", t.changed)
            );
          } else Et.codes.length || ie.append(xt("span", "links were made on another device", "ppp-mute"));
          Ot.append(ie);
        }
        Wt.append(Ot);
      }
      G.push(Wt);
    }
    return R && G.push(xt("p", R, "ppp-cyan")), V && G.push(xt("p", V, /✓/.test(V) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...G), Q;
  }
  return { banner: _, funder: N, renderFold: je, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: A };
}
const m$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function x$(t) {
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
const S$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((i) => !i.hidden).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function E$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = S$(s);
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
function A$(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const Cu = /* @__PURE__ */ new Set(), aw = (t) => (Cu.add(t), () => {
  Cu.delete(t);
}), Tu = () => {
  for (const t of [...Cu])
    try {
      t();
    } catch {
    }
}, A0 = "xtrata:al-thumb:v1:", cw = "-", bo = 96, v$ = 24 * 1024 * 1024, rn = /* @__PURE__ */ new Map(), v0 = /* @__PURE__ */ new Set(), Bu = [];
let El = !1, Al;
const pc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(A0 + t);
    window.localStorage.setItem(A0 + t, e);
  } catch {
  }
  return null;
};
function Rf(t) {
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
          r.width = r.height = bo, i.fillStyle = "#143a40", i.fillRect(0, 0, bo, bo), i.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, bo, bo), e(r.toDataURL("image/jpeg", 0.82));
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
async function $$(t) {
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
      const B = x + S, j = r.indexOf(">", B);
      if (j < 0)
        return r = r.slice(B), null;
      const z = r.slice(B, j + 1), A = z.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const _ = z.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (_) return "/inscription/" + _[1];
      x = j + 1;
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
    if (i > v$)
      return await o.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function k$() {
  if (!El) {
    El = !0;
    try {
      for (; Bu.length; ) {
        const t = Bu.shift();
        if (!rn.has(t))
          try {
            const e = await $$(t);
            if (e === null) continue;
            if (!e) {
              rn.set(t, ""), pc(t, cw), Tu();
              continue;
            }
            const n = await Rf(e);
            rn.set(t, n), n.startsWith("data:image/jpeg") && pc(t, n), Tu();
          } catch {
          }
      }
    } finally {
      El = !1;
    }
  }
}
function lw(t, e) {
  if (e && !rn.get(t) ? (rn.set(t, e), Rf(e).then((r) => {
    r !== e && (rn.set(t, r), r.startsWith("data:image/jpeg") && pc(t, r), Tu());
  })) : e === "" && !rn.has(t) && rn.set(t, ""), rn.has(t)) return rn.get(t);
  const n = pc(t);
  if (n != null) {
    const r = n === cw ? "" : n;
    return rn.set(t, r), r;
  }
  return v0.has(t) || (v0.add(t), Bu.push(t), Al || (Al = setTimeout(() => {
    Al = void 0, k$();
  }, 1200))), "";
}
const Ii = 12, I$ = 5e3, Qe = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Li = (t, e, n = "") => {
  const r = Qe("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function L$(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, f = Ii;
  const l = Qe("div", "", "ppp-shelf-box");
  aw(() => t.changed());
  const y = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, x = (b, T) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? T;
    } catch {
      return T;
    }
  }, S = (b) => new Set(x(y(b), []).filter((T) => Number.isSafeInteger(T))), B = (b) => {
    const T = x(p(b), {}), O = {};
    for (const [C, it] of Object.entries(T)) Number.isSafeInteger(Number(C)) && typeof it == "number" && (O[Number(C)] = it);
    return O;
  };
  async function j(b) {
    if (!i) {
      i = !0, s = !1;
      try {
        const T = [];
        let O = 0, C = 0;
        for (let it = 0; it < I$ / 100 + 1; it++) {
          const X = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${O}&limit=100`);
          if (T.push(...x$(X == null ? void 0 : X.shelf)), C = Number(X == null ? void 0 : X.total) || T.length, !(X != null && X.next) || !Number.isSafeInteger(X.next)) break;
          O = X.next;
        }
        b === e && (n = T, r = C, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const z = () => {
    o = -1 / 0;
  }, A = Qe("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, f = Ii, t.changed();
  };
  const _ = Qe("select");
  _.setAttribute("aria-label", "Sort albums");
  for (const b of m$) {
    const T = document.createElement("option");
    T.value = b.value, T.textContent = b.label, _.append(T);
  }
  _.onchange = () => {
    c = _.value, f = Ii, t.changed();
  };
  const N = Li("", () => {
    u = !u, f = Ii, t.changed();
  }, "tiny"), Q = Qe("div", "", "ppp-shelf-tools");
  Q.append(A, _, N);
  const tt = Qe("div"), R = Qe("div");
  function V(b) {
    const T = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, f = Ii), !T || b.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && j(T), !n.length)
      return s ? (R.replaceChildren(Qe("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Li("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(R), l) : null;
    const O = S(T), C = B(T), it = E$(n, { query: a, sort: c, pinnedOnly: u, pins: O, recents: C });
    A.value !== a && (A.value = a), _.value = c, N.textContent = u ? "★ Pinned only" : "☆ Pinned only", N.setAttribute("aria-pressed", String(u));
    const X = [];
    if (b.slot > 0 && X.push(Li("← My player", () => t.open(0), "quiet")), !it.length) X.push(Qe("p", "No album matches that.", "ppp-mute"));
    else {
      const St = Qe("ul", "", "ppp-shelf-list");
      for (const v of it.slice(0, f)) {
        const m = Qe("li", "", v.slot === b.slot ? "now" : ""), W = O.has(v.slot), rt = Li(W ? "★" : "☆", () => {
          const me = new Set(O);
          W ? me.delete(v.slot) : me.add(v.slot), t.store.set(y(T), JSON.stringify([...me])), t.changed();
        }, "tiny");
        rt.setAttribute("aria-label", W ? `Unpin ${v.player.title}` : `Pin ${v.player.title}`);
        const at = [v.player.subtitle, `${Hi(v.player).length} ${Hi(v.player).length === 1 ? "song" : "songs"}`, v.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), vt = v.slot === b.slot, te = Li(vt ? "Playing" : "Select", () => {
          t.store.set(p(T), JSON.stringify(A$({ ...C, [v.slot]: t.now() }))), t.open(v.slot);
        }, vt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        te.disabled = vt;
        const kt = Hi(v.player)[0], Ht = v.player.cover ?? (kt == null ? void 0 : kt.id), Mt = Ht ? lw(String(Ht)) : "", Ft = Qe("span", "", "ppp-shelf-art");
        if (Mt) {
          const me = document.createElement("img");
          me.src = Mt, me.alt = "", me.decoding = "async", Ft.append(me);
        } else Ft.textContent = "💿";
        const et = Qe("span", "", "ppp-shelf-txt");
        et.append(Qe("span", v.player.title, "t"), Qe("span", at, "ppp-mute")), m.append(rt, Ft, et, te), St.append(m);
      }
      X.push(St), it.length > f && X.push(Li(`Show more (${it.length - f} left)`, () => {
        f += Ii, t.changed();
      }, "quiet"));
    }
    return s && X.push(Qe("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), tt.replaceChildren(...X), l.firstChild !== Q && l.replaceChildren(Q, tt), l;
  }
  return { render: V, invalidate: z, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = B(e), T = [...n].filter((O) => O.player).sort((O, C) => (b[C.slot] ?? 0) - (b[O.slot] ?? 0) || C.slot - O.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const C$ = 20, Ge = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ee = {
  grid: Ge('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ge('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ge('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ge('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ge('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ge('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ge('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ge('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ge('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ge('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ge('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ge('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ge('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ge('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ge('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ge('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ge('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Z(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [i, s] of Object.entries(e))
    s == null || s === !1 || (i === "class" ? r.className = String(s) : i === "html" ? r.innerHTML = String(s) : i.startsWith("on") && typeof s == "function" ? r[i.toLowerCase()] = s : i === "disabled" ? r.disabled = !!s : r.setAttribute(i, s === !0 ? "" : String(s)));
  for (const i of n) i != null && i !== !1 && r.append(i);
  return r;
}
const Ze = (t, ...e) => Z("button", { type: "button", ...t }, ...e), La = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, mo = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, T$ = { music: "My music", device: "This device", gifts: "Albums (admin)" }, B$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function $0(t, e, n = {}) {
  const r = !!n.list;
  let i = null, s = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function f(b) {
    var O, C, it;
    if (!b || !Number.isSafeInteger(b)) return "";
    const T = (it = (C = (O = e.radio()) == null ? void 0 : O.getState) == null ? void 0 : C.call(O)) == null ? void 0 : it.albumCover;
    return T != null && T.url && Number(T.tokenId) === b ? T.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (X) => {
      var v, m, W, rt;
      const St = (X.headers.get("content-type") || "").toLowerCase();
      if (!X.ok)
        throw await ((v = X.body) == null ? void 0 : v.cancel()), new Error("no cover");
      return St.startsWith("image/") ? (await ((m = X.body) == null ? void 0 : m.cancel()), "/inscription/" + b) : St.includes("text/html") ? (((W = (await X.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : W[1]) ?? "").replace(/&amp;/g, "&") : (await ((rt = X.body) == null ? void 0 : rt.cancel()), "");
    }).then((X) => {
      c.set(b, X), P();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  aw(() => P());
  function l(b) {
    var O;
    s = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const T = document.querySelector(".side");
    if (b && b !== "more") {
      for (const X of B$[b]) {
        const St = T == null ? void 0 : T.querySelector(X);
        St && (St.open = !0);
      }
      const C = document.getElementById("sheetTitle");
      C && (C.textContent = T$[b]);
      const it = document.getElementById("sheetExtra");
      it && it.replaceChildren(...b === "music" ? [p()] : []), (O = T == null ? void 0 : T.scrollTo) == null || O.call(T, { top: 0 });
    }
    P();
  }
  const y = r ? null : document.getElementById("sheetClose");
  y && (y.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && s && a.dataset.view === "album" && l("");
  });
  const p = () => Ze(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Z("span", { class: "al-row-i", html: Ee.radio }),
    Z("span", { class: "al-row-t" }, Z("b", {}, "Xtrata Radio"), Z("small", {}, "Every song on-chain · FM, liked, all")),
    Z("span", { class: "al-row-go", html: Ee.right })
  );
  let x = null, S = !1;
  const B = () => {
    var T;
    const b = e.radio();
    S || !(b != null && b.subscribe) || (S = !0, b.subscribe((O) => {
      x = O, (i == null ? void 0 : i.mode) === "open" && P();
    }), x = ((T = b.getState) == null ? void 0 : T.call(b)) ?? null);
  };
  r || setInterval(() => {
    var C, it;
    if ((i == null ? void 0 : i.mode) !== "open" || !(x != null && x.playing)) return;
    const b = (it = (C = e.radio()) == null ? void 0 : C.getPosition) == null ? void 0 : it.call(C), T = t.querySelector(".al-bar > i"), O = t.querySelectorAll(".al-times span");
    !b || !T || (T.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", O.length === 2 && (O[0].textContent = La(b.current || 0), O[1].textContent = b.duration ? La(b.duration) : "–:––"));
  }, 500);
  let j = "", z = null;
  function A(b, T, O = {}) {
    const C = O.song || f(b.cover), X = [C ? Z("img", { src: C, alt: O.song ? "Song artwork" : `${b.title} cover` }) : Z("div", { class: "al-cover-fallback" }, Z("b", {}, b.title), b.subtitle ? Z("span", {}, b.subtitle) : null), O.paused ? Z("span", { class: "al-paused" }, Z("i", { html: Ee.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], St = "al-cover" + (T ? "" : " al-cover--small") + (O.paused ? " is-paused" : "");
    return O.flip ? (X.push(Z("span", { class: "al-flip", "aria-hidden": "true", html: Ee.flip })), Ze({ class: St + " is-flippable", "aria-label": O.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: O.flip }, ...X)) : Z("div", { class: St }, ...X);
  }
  function _(b) {
    return b.plays === null || b.plays === void 0 ? Z("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Z("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Z("span", { class: "al-chip" + (b.plays <= C$ ? " al-chip--low" : "") }, `${mo(b.plays, "play", "plays")} left`);
  }
  function N(b) {
    const T = b.player, O = T.tracks.filter((it) => !it.hidden), C = [];
    return b.mode === "arrive" && b.from && C.push(Z("p", { class: "al-from" }, Z("span", { html: Ee.gift }), Z("span", {}, Z("b", {}, b.from), " sent you an album"))), C.push(A(T, !0)), C.push(Z(
      "div",
      { class: "al-intro" },
      Z("h1", {}, T.title),
      T.subtitle ? Z("p", { class: "al-artist" }, T.subtitle) : null,
      O.length ? Z("p", { class: "al-songline" }, O.map((it) => it.title || `#${it.id}`).join(" · ")) : null,
      Z("span", { class: "al-chip" }, [mo(O.length, "song", "songs"), b.offered ? mo(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && C.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), C.push(Z("div", { class: "al-grow" })), b.asking ? C.push(Z("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && C.push(Ze({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Z("span", { html: Ee.playSmall }), b.primary.label)), b.hint && !b.asking && C.push(Z("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && C.push(Ze({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), C;
  }
  function Q(b, T) {
    const { songs: O, current: C, started: it, own: X, out: St, waiting: v } = T, m = b.player, W = e.radio(), rt = [];
    rt.push(Z("div", { class: "al-listhead" }, Z("span", {}, Z("b", {}, m.title), ` · ${mo(O.length, "song", "songs")}`), _(b)));
    const at = f(m.cover), vt = "album:" + m.cover;
    at && !rn.has(vt) && (rn.set(vt, at), Rf(at).then((kt) => {
      kt !== at && (rn.set(vt, kt), P());
    }));
    const te = at ? rn.get(vt) || at : "";
    return rt.push(Z("ol", { class: "al-tracks" }, ...O.map((kt, Ht) => {
      const Mt = String(kt.id) === C, Ft = lw(String(kt.id), Mt && it ? X : void 0);
      return Z("li", {}, Ze(
        { class: "al-track" + (Mt ? " is-on" : ""), "aria-label": `Play ${kt.title || "#" + kt.id}`, "aria-current": Mt ? "true" : void 0, disabled: St || v, onClick: () => {
          var et;
          return (et = W == null ? void 0 : W.playToken) == null ? void 0 : et.call(W, kt.id);
        } },
        Z(
          "span",
          { class: "al-th" + (Ft ? "" : " is-blank") },
          Ft ? Z("img", { src: Ft, alt: "", decoding: "async" }) : te ? Z("img", { src: te, alt: "", decoding: "async" }) : null,
          Ft ? null : Z("span", { class: "al-n" }, String(Ht + 1)),
          Mt ? Z("span", { class: "al-eq", html: Ee.eq }) : null
        ),
        Z("span", { class: "al-tt" }, kt.title || `#${kt.id}`)
      ));
    }))), rt;
  }
  function tt(b) {
    var Ft;
    const T = b.player, O = T.tracks.filter((et) => !et.hidden), C = e.radio(), it = x == null ? void 0 : x.nowPlaying, X = it && T.tracks.some((et) => String(et.id) === String(it.tokenId)) ? String(it.tokenId) : null, St = X ? T.tracks.find((et) => String(et.id) === X) : null, v = b.plays === 0 && !b.playsComing, m = !!b.playsComing && !b.plays, W = !!(x != null && x.playing) && !!X, rt = x == null ? void 0 : x.heart, at = X ? (Ft = C == null ? void 0 : C.getPosition) == null ? void 0 : Ft.call(C) : null;
    X && (W || ((at == null ? void 0 : at.current) ?? 0) > 0.5) && (j = T.id);
    const vt = !!X && j === T.id;
    z && z !== X && (z = null);
    const te = vt ? String((it == null ? void 0 : it.cover) || "") : "", kt = !!te && z === X, Mt = [A(T, !v, { song: kt ? "" : te, paused: vt && !W, flip: te ? () => {
      z = z === X ? null : X, P();
    } : void 0, flipped: kt })];
    if (Mt.push(Z(
      "div",
      { class: "al-now" },
      Z(
        "div",
        { class: "al-now-t" },
        Z("div", { class: "al-song" }, St ? St.title || (it == null ? void 0 : it.title) || `#${St.id}` : T.title),
        Z("div", { class: "al-artist" }, St ? St.artist || (it == null ? void 0 : it.artist) || T.subtitle : T.subtitle || "Press play")
      ),
      X ? Ze({ class: "al-icon" + (rt != null && rt.liked ? " is-on" : ""), "aria-label": rt != null && rt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(rt != null && rt.liked)), disabled: !!(rt != null && rt.pending) || !!(rt != null && rt.locked) || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.toggleLike) == null ? void 0 : et.call(C);
      }, html: rt != null && rt.liked ? Ee.heartOn : Ee.heart }) : null
    )), v)
      Mt.push(Z(
        "div",
        { class: "al-out" },
        Z("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Z("p", { class: "al-out-t" }, "You've played this album out"),
        Z("p", { class: "al-out-s" }, "Add plays to keep listening."),
        R(b, !0)
      ));
    else {
      const et = at != null && at.duration ? Math.min(100, at.current / at.duration * 100) : 0;
      Mt.push(Z(
        "div",
        { class: "al-prog" },
        Z("div", { class: "al-bar" }, Z("i", { style: `width: ${et}%` })),
        Z("div", { class: "al-times" }, Z("span", {}, La((at == null ? void 0 : at.current) || 0)), Z("span", {}, at != null && at.duration ? La(at.duration) : "–:––"))
      ));
    }
    return Mt.push(Z(
      "div",
      { class: "al-ctl" + (v || m ? " is-off" : "") },
      Ze({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: v || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.prev) == null ? void 0 : et.call(C);
      }, html: Ee.prev }),
      Ze({ class: "al-play", "aria-label": W ? "Pause" : "Play", disabled: v || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.playPause) == null ? void 0 : et.call(C);
      }, html: W ? Ee.pause : Ee.play }),
      Ze({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: v || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.next) == null ? void 0 : et.call(C);
      }, html: Ee.next })
    )), b.status.length && Mt.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), Mt.push(...Q(b, { songs: O, current: X, started: vt, own: te, out: v, waiting: m })), Mt.push(Z("div", { class: "al-grow" })), Mt.push(Ze(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => l(s === "more" ? "" : "more") },
      Z("span", {}, "More ", Z("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Z("span", { html: Ee.down })
    )), Mt;
  }
  function R(b, T) {
    const O = Z("div", { class: "al-topups" + (T ? " al-topups--primary" : "") }), C = T ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const it of C) {
      const X = b.myPlays !== void 0 && b.myPlays >= it && !b.playsComing && !b.busy;
      O.append(Ze({ class: "al-topup", disabled: !X, onClick: () => e.topUp(it) }, T ? `Add ${it.toLocaleString()} plays` : `+${it.toLocaleString()}`));
    }
    return T && O.append(Ze({ class: "al-link", onClick: () => l("more") }, "Other amounts")), O;
  }
  function V(b) {
    const T = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), O = Z(
      "div",
      { class: "al-card" },
      Z("div", { class: "al-card-h" }, Z("b", {}, `Add plays to ${b.player.title}`), Z("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      R(b, !1),
      Z("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : T ? `Moved from My player · ${mo(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !T && !b.playsComing && b.myPlays !== void 0 ? Ze({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), C = (X, St, v, m) => Ze(
      { class: "al-row", onClick: m },
      Z("span", { class: "al-row-i", html: X }),
      Z("span", { class: "al-row-t" }, Z("b", {}, St), Z("small", {}, v)),
      Z("span", { class: "al-row-go", html: Ee.right })
    ), it = Z(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      C(Ee.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, P();
      }),
      o ? Z("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Z(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Z("div", { class: "al-sheet-h" }, Z("b", {}, "More"), Ze({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Ee.close })),
      b.mode === "open" ? O : null,
      Z(
        "div",
        { class: "al-rows" },
        C(Ee.grid, "My music", "Your albums and the radio", () => l("music")),
        C(Ee.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? C(Ee.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        C(Ee.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        it
      )
    );
  }
  function k(b) {
    var v, m;
    const T = b.player, O = x == null ? void 0 : x.nowPlaying, C = O && T.tracks.some((W) => String(W.id) === String(O.tokenId)) ? String(O.tokenId) : null, it = !!(x != null && x.playing) && !!C, X = C ? (m = (v = e.radio()) == null ? void 0 : v.getPosition) == null ? void 0 : m.call(v) : null;
    C && (it || ((X == null ? void 0 : X.current) ?? 0) > 0.5) && (j = T.id);
    const St = !!C && j === T.id;
    return Q(b, {
      songs: T.tracks.filter((W) => !W.hidden),
      current: C,
      started: St,
      own: St ? String((O == null ? void 0 : O.cover) || "") : "",
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
      B(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...k(b));
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
      b.mode === "open" ? Ze({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Ee.grid }) : null
    ), O = Z("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? tt(b) : N(b));
    t.replaceChildren(T, O, ...s === "more" ? [Z("div", { class: "al-scrim", onClick: () => l("") }), V(b)] : []);
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
const M$ = [
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
function N$(t) {
  for (const [e, n] of M$) if (n.test(t)) return e;
  return null;
}
const uw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), fw = (t) => /Android/.test(t);
function P$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : uw(e) ? "x-safari-" + n.href : fw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const _$ = (t) => uw(t) ? "Safari" : fw(t) ? "Chrome" : "your browser", k0 = document.getElementById("ppp");
k0 && U$(k0);
function U$(t) {
  var Mn;
  const e = Dw(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let i = null;
  const s = async (d, E) => {
    const L = await fetch(d, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), h = await L.json().catch(() => ({}));
    if (!L.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${L.status}).`);
    return h;
  }, o = p6({
    now: Date.now,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    mainOf: async (d) => {
      var L;
      const E = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(d))).links;
      return ((L = E == null ? void 0 : E.find((h) => h.listening === d)) == null ? void 0 : L.main) ?? null;
    },
    saveLink: async (d) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), i.referrerPolicy = "no-referrer";
      const E = new Promise((lt, At) => {
        i.addEventListener("load", () => lt(), { once: !0 }), setTimeout(() => At(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = d + "/", r.replaceChildren(i), await E;
      const L = new Tw({ walletOrigin: d, frame: i, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ct = (lt, At) => h.has(lt) ? L.request(lt, At) : Promise.race([
        L.request(lt, At),
        new Promise((Qt, xe) => setTimeout(() => xe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ct("listening.status"), { request: ct };
    },
    chain: {
      verify: q5,
      balance: X5,
      account: W5,
      owner: Y5,
      broadcast: Z5,
      transaction: Q5,
      confirmedNonce: async (d) => {
        const E = await ms(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (d, E) => i0({ ...E, network: "mainnet", stxAddress: d }),
    deposit: (d, E, L) => new Promise((h, ct) => t0({
      recipient: E,
      amount: L.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new vl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (lt) => h(lt.txId || ""),
      onCancel: () => ct(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ct
    })),
    validate: J5,
    tabLock: (d) => new Promise((E) => {
      const L = navigator.locks;
      if (!(L != null && L.request)) {
        E(!0);
        return;
      }
      L.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (h) => {
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
    changed: () => ge(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var E, L;
      return a.funder(d, () => i6(d, ms), !!((L = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && L.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (d) => {
      const E = await s("/radio/gift/for?wallet=" + encodeURIComponent(d)), L = E == null ? void 0 : E.gift;
      if (!L) return null;
      if (typeof L.returnTo != "string" || typeof L.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: L.returnTo, from: typeof L.from == "string" ? L.from : null, source: String(L.source ?? ""), amount: String(L.amount ?? "0"), treasury: L.treasury, state: L.state === "sending" ? "sending" : "arrived", player: L.player ?? null };
    },
    history: (d, E) => c6(d, (L) => ms(L), E),
    likesChanged: () => {
      var d, E;
      (E = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || E.call(d);
    },
    likeState: async (d, E) => {
      const L = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(E) })), h = Array.isArray(L == null ? void 0 : L.rows) ? L.rows.find((ct) => (ct == null ? void 0 : ct.id) === E) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((ct) => typeof ct == "string") : h.liked ? [d] : [] };
    },
    likeSent: (d, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: E } })),
    nameOf: (d) => Ht(d) ?? void 0,
    likeConfirmed: (d, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: E } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), a = b$({
    json: s,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, E, L, h) => new Promise((ct, lt) => t0({
      recipient: E,
      amount: L.toString(),
      memo: h,
      stxAddress: d,
      network: new vl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (At) => ct(At.txId || ""),
      onCancel: () => lt(new Error("Gift cancelled. Nothing was sent.")),
      onError: lt
    })),
    sign: (d, E) => i0({ ...E, network: "mainnet", stxAddress: d }),
    giftSent: (d, E) => o.giftSent(d, E),
    claiming: (d) => o.giftClaiming(d),
    album: { bind: (d) => o.bindAlbum(d), arrived: async (d, E, L, h) => {
      c.invalidate(), await o.albumArriving(d, E, L, h);
    } },
    who: (d) => et(d),
    changed: () => ge(o.snapshot()),
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
  }), c = L$({
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
    changed: () => ge(o.snapshot())
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
  }, y = f ? $0(f, l) : null, p = document.getElementById("albumList"), x = p ? $0(p, l, { list: !0 }) : null, S = "xtrata.radio.album.last.v1", B = () => {
    try {
      const d = JSON.parse(localStorage.getItem(S) || "null");
      return d && typeof d.root == "string" && Number.isSafeInteger(d.slot) && d.slot > 0 && d.player && Array.isArray(d.player.tracks) ? d : null;
    } catch {
      return null;
    }
  };
  let j = "";
  const z = (d) => {
    const E = JSON.stringify(d);
    if (E !== j) {
      j = E;
      try {
        localStorage.setItem(S, E);
      } catch {
      }
    }
  };
  let A = null;
  window.XtrataRadioLikeHandler = (d) => {
    var L;
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    (L = o.snapshot().likeFunds) != null && L.album && (P = !0), ke();
    const E = Be(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let _;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const N = (d) => {
    var L, h;
    const E = window.XtrataRadioListeningIdentity();
    E !== _ && (_ = E, (h = (L = window.XtrataRadio) == null ? void 0 : L.refreshLikes) == null || h.call(L));
  };
  let Q = "", tt = null, R = !1, V = !1;
  const k = (d, E) => {
    var dn, Fn, ye, mr, xr, Ur, We;
    const L = window.XtrataRadio;
    if (!(L != null && L.setGiftPlayer) || !(L != null && L.setGiftStop)) return;
    const h = d.step === "off" || d.step === "elsewhere" ? null : ((dn = d.gift) == null ? void 0 : dn.player) ?? null, ct = h ? h.id + ":" + h.cover + ":" + h.tracks.map((Qn) => Qn.id).join(",") : "";
    ct !== Q && (L.setGiftPlayer(h ? { id: h.id, title: h.title, subtitle: h.subtitle, tracks: Hi(h).map((Qn) => Qn.id), hidden: ((Fn = p$(h)) == null ? void 0 : Fn.id) ?? null, cover: h.cover } : null), Q = ct);
    const lt = E.depositPending && d.step === "fund" && ((ye = d.giftStop) == null ? void 0 : ye.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : d.giftStop, At = (lt == null ? void 0 : lt.text) ?? null;
    At !== tt && (L.setGiftStop(At), tt = At);
    const Qt = (lt == null ? void 0 : lt.reason) === "arriving";
    Qt !== V && ((mr = L.setGiftWait) == null || mr.call(L, Qt), V = Qt);
    const xe = !!h && !!((xr = d.albumLock) != null && xr.locked);
    xe !== R && ((Ur = L.setGiftLock) == null || Ur.call(L, xe), R = xe), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(d.step) && ((We = L.forgetWallets) == null || We.call(L));
  };
  let P = !1;
  const b = /* @__PURE__ */ new Map(), T = (d) => {
    if (!(d.step === "fund" && !d.depositPending && !!d.gift && !!d.listening && d.balance === 0n && !d.entries.some((h) => h.kind === "play") && (d.brandNew || d.createdHere))) return null;
    let L = b.get(d.listening);
    return L === void 0 && (L = Date.now(), b.set(d.listening, L)), Date.now() - L < fc ? L : null;
  }, O = (d) => d.step === "fund" && !d.depositPending && !!d.gift && d.balance === 0n && !d.entries.some((E) => E.kind === "play") && !!d.listening && b.has(d.listening), C = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", it = (d) => {
    const E = o.snapshot().playCost || 350n;
    return d > He ? Number((d - He) / E) : 0;
  }, X = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), St = (d) => {
    const E = Math.round((Date.now() - d) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, v = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, m = (d, E = "", L = "") => {
    const h = document.createElement(d);
    return E && (h.textContent = E), L && (h.className = L), h;
  }, W = (d, E, L = "") => {
    const h = m("button", d, L);
    return h.type = "button", h.onclick = E, h;
  }, rt = (d, E) => {
    const L = m("a", d);
    return L.href = E, L.target = "_blank", L.rel = "noopener", L;
  };
  let at = null, vt = location.hash === "#give";
  vt && history.replaceState(null, "", location.pathname + location.search);
  let te = !1;
  const kt = Z6((d) => Y6({ address: d, network: "mainnet" }), () => ge(o.snapshot())), Ht = (d) => kt.get(d), Mt = N$(navigator.userAgent), Ft = (d, E) => {
    const L = navigator.userAgent, h = _$(L), ct = `${location.origin}${location.pathname}${E ? `#gift=${E}` : ""}`, lt = [m("p", `You are in ${d}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your listening wallet${E ? " and claim your gift" : ""}.`, "ppp-warn")], At = m("div", "", "ppp-open-row"), Qt = P$(ct, L);
    if (Qt) {
      const xe = m("a", `Open in ${h}`, "primary ppp-open-in");
      xe.href = Qt, xe.dataset.homeAction = "radio:open-in-browser", At.append(xe);
    }
    return At.append(Pi("copy-page-link", "Copy link", () => ct, Qt ? "" : "primary", () => ge(o.snapshot()))), lt.push(At, m("p", `If that does not open ${h}, use ${d}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), lt;
  }, et = (d) => Ht(d) ?? C(d), me = (d) => d.slice(0, 2).map(et).join(" and ") + (d.length > 2 ? ` and ${d.length - 2} more` : ""), bn = /* @__PURE__ */ new Map();
  let qe = !1;
  const un = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), ke = () => {
    qe || (qe = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const E of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const L = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(L) && bn.set(L, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      ge(o.snapshot());
    }).catch(() => {
      qe = !1;
    }));
  }, Be = (d, E) => {
    const L = bn.get(d), h = J6(d, [L == null ? void 0 : L.title, E == null ? void 0 : E.title].find((lt) => !un(lt)) || ""), ct = Q6(d, (L == null ? void 0 : L.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: h, artist: ct };
  }, Me = (d) => {
    const { title: E, artist: L } = Be(d.song, d);
    return E ? `“${E}”${L ? ` — ${L}` : ""}` : `Song #${d.song}${L ? ` — ${L}` : ""}`;
  }, ee = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, fn = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Oe(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["TOO MUCH", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function he(d, E, L = "", h) {
    const ct = m("dt", d), lt = m("dd", E, L);
    return h && lt.append(" ", h), [ct, lt];
  }
  const qt = document.getElementById("ppp-top"), ae = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, je = () => {
    var E, L;
    const d = o.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      (E = document.getElementById("radio-wallet-connect")) == null || E.click();
      return;
    }
    if (d.step === "elsewhere" && ((L = d.gate) != null && L.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), ae();
  };
  qt && (qt.onclick = je);
  function Bn(d) {
    if (!qt) return;
    const E = (h, ct, lt) => {
      qt.hidden = !1, qt.className = "ppp-top" + (ct ? " is-" + ct : ""), qt.replaceChildren(m("span", "", "dot"), document.createTextNode(h)), qt.title = lt;
    }, L = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        qt.hidden = !0;
        return;
      case "elsewhere":
        return E("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        qt.hidden = !0;
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
        return d.payingOn && L > 0 ? E(`${L.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : E("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const $ = document.getElementById("pppNudge"), D = document.getElementById("onair");
  (Mn = $ == null ? void 0 : $.querySelector("button")) == null || Mn.addEventListener("click", () => je());
  const U = {
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, G = {
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
  function ht(d) {
    if (d.step === "loading") return;
    const E = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, L = d.step === "ready" && d.payingOn && E > 0, h = d.step === "fund" && d.depositPending, ct = d.step === "elsewhere", lt = L || h || ct ? "" : U[d.step] ?? "", At = L ? "on" : ct ? "free" : lt ? "off" : "";
    At ? document.documentElement.dataset.ppp = At : delete document.documentElement.dataset.ppp, D && (D.hidden = !At || At === "free", D.querySelector(".onair-sub").textContent = L ? `${E.toLocaleString()} plays left` : "Plays off"), $ && ($.hidden = At !== "off" && At !== "free", $.classList.toggle("is-free", At === "free"), At === "free" ? ($.querySelector(".nudge-t").textContent = "You’re on the free player", $.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", $.querySelector("button").textContent = "Get a player") : At === "off" && ($.querySelector(".nudge-t").textContent = lt, $.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", $.querySelector("button").textContent = G[d.step] ?? "Start"));
  }
  let wt = "";
  function Wt(d) {
    const E = m("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && E.append(m("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && E.append(m("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const L = m("input");
    L.type = "text", L.placeholder = "SP… address to send returns to", L.autocomplete = "off", L.spellcheck = !1, L.setAttribute("aria-label", "Address to return funds to"), L.value = wt, L.oninput = () => {
      wt = L.value;
    };
    const h = W(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(L.value), wt = "";
    }, "tiny");
    return E.append(L, " ", h), d.returnToKind === "chosen" && E.append(" ", W("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const Xt = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function se() {
    const d = m("p", Xt + " ", "ppp-mute");
    return d.append(rt("Xverse", "https://www.xverse.app/download"), " · ", rt("Leather", "https://leather.io/install-extension")), d;
  }
  let Yt = "";
  const Ne = (d) => {
    const E = document.documentElement, L = d.solo && !d.main ? d.listening ? C(d.listening) : "new" : "", h = m6() ? "1" : "";
    `${L}|${h}` !== Yt && (Yt = `${L}|${h}`, L ? E.dataset.pppSolo = L : delete E.dataset.pppSolo, h ? E.dataset.pppWalletInstalled = h : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => ge(o.snapshot()), d);
  function Pe(d, E = "") {
    const L = m("div", "", "ppp-topup"), h = Ot(d);
    L.append(m("span", "Add plays from My player: ", "ppp-mute"));
    for (const ct of Ha) {
      const lt = W(`+${ct.toLocaleString()}`, () => void o.topUpAlbum(ct), E);
      lt.disabled = h === void 0 || h < ct || d.depositPending || !!d.busy, L.append(lt);
    }
    return h !== void 0 && h < Ha[0] && L.append(m("p", "My player needs plays first (switch to My player above).", "ppp-mute")), L;
  }
  const Ot = (d) => {
    var h;
    const E = (h = d.likeFunds) == null ? void 0 : h.balance;
    if (E === void 0 || !d.playCost) return;
    const L = E - He - 6000n;
    return L > 0n ? Number(L / d.playCost) : 0;
  };
  function Et(d) {
    const E = d.likeFunds;
    if (!E || !E.album || !E.low && !E.pending) return [];
    if (E.low || (P = !1), E.low && !P) return [];
    const L = m("div", "", "ppp-pick ppp-lowbox");
    if (!E.low) {
      if (!E.txid) return [];
      const ct = m("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return E.txid && ct.append(rt("View", v(E.txid))), L.append(ct), [L];
    }
    L.append(m("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), L.append(m("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), L.append(m("p", E.address, "ppp-addr-full"));
    const h = m("div", "", "ppp-open-row");
    if (h.append(Pi("copy-likes-address", "Copy address", () => E.address, "primary", () => ge(o.snapshot()))), E.main && !d.solo) {
      const ct = Os - (E.balance ?? 0n);
      ct > 0n && h.append(W(`Pay ${or(ct)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return L.append(h), L.append(m("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [L];
  }
  const Gt = (d) => {
    const E = m("div", "", "ppp-wait");
    E.dataset.since = String(d.since), E.dataset.grace = String(d.graceMs), E.setAttribute("role", "progressbar"), E.setAttribute("aria-label", "Your plays are arriving");
    const L = m("p", "", "ppp-wait-t"), h = m("div", "", "ppp-wait-track");
    return h.append(m("div", "", "ppp-wait-fill")), E.append(L, h), Zt(E), E;
  };
  function Zt(d) {
    const E = Number(d.dataset.since), L = Number(d.dataset.grace) || 6e4, h = Math.max(0, Date.now() - E), ct = d.querySelector(".ppp-wait-fill"), lt = d.querySelector(".ppp-wait-t");
    if (h < L) {
      const At = Math.ceil((L - h) / 1e3);
      ct.style.width = Math.max(4, Math.min(95, h / L * 100)).toFixed(0) + "%", lt.textContent = `Your plays are arriving… usually about a minute · ${At}s`, d.classList.remove("is-long"), d.setAttribute("aria-valuenow", String(Math.round(h / L * 100)));
    } else
      ct.style.width = "", lt.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", d.classList.add("is-long"), d.removeAttribute("aria-valuenow");
  }
  let pe = 0;
  setInterval(() => {
    const d = document.querySelectorAll(".ppp-wait");
    if (!d.length) {
      pe = 0;
      return;
    }
    d.forEach(Zt), ++pe % 10 === 0 && ge(o.snapshot());
  }, 1e3);
  let ie = null;
  function mn(d) {
    if (d.step === "loading" && ie !== null) return;
    const L = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(d.step) || !!d.busy || d.armed || !!a.pendingCode() && !["ready", "fund", "over"].includes(d.step);
    L !== ie && (ie = L, L ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function ge(d) {
    var xi, w, I, K, J, dt, F, gt, yt, bt, zt, _e, Ye, le, Sn;
    if (A && ["ready", "fund", "over"].includes(d.step) && !d.busy) {
      const q = A;
      A = null, d.root === q.root && d.slot !== q.slot && o.openAlbum(q.slot);
    }
    const E = a.inProgress(d), L = T(d), h = E && d.step === "fund" ? { ...d, depositPending: !0 } : L !== null ? { ...d, depositPending: !0, arrival: { since: L, graceMs: fc } } : d, ct = h.error === dc;
    if (N(), k(d, h), mn(h), Ne(h), !E && a.inProgress(d) || (Bn(h), ht(h), t.hidden = h.step === "off", t.hidden)) return;
    const [lt, At] = Oe(h), Qt = n(".ppp-state");
    Qt.textContent = lt, Qt.className = "ppp-state" + (At ? " ppp-state--" + At : ""), Qt.hidden = !lt;
    const xe = !!h.busy || h.armed, dn = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (xe || !["intro", "loading"].includes(h.step));
    r.hidden = !dn, r.classList.toggle("ppp-frame--rest", !xe && !te);
    const Fn = n(".ppp-frame-label");
    Fn.hidden = !0;
    const ye = g6(h) ?? at;
    at = ye;
    const mr = "xtrata.radio.ppp.heard.v1", xr = (() => {
      try {
        return localStorage.getItem(mr) === "1";
      } catch {
        return !1;
      }
    })();
    if (!xr && h.entries.some((q) => q.kind === "play"))
      try {
        localStorage.setItem(mr, "1");
      } catch {
      }
    const Ur = xr || h.slot > 0 && ((((xi = h.likeFunds) == null ? void 0 : xi.balance) ?? 0n) > 0n || c.count() > 1), We = w6({ ...h, heard: Ur }, ye);
    n(".ppp-badge").hidden = !We;
    const Qn = n(".ppp-steps"), xn = n(".ppp-stage");
    Qn.hidden = xn.hidden = !We, ye && We && (Qn.replaceChildren(...Lu(h.solo).map((q, ot) => {
      const Ie = m("li", "", ot < ye.at ? "done" : ot === ye.at ? ye.blocked ? "now blocked" : "now" : "");
      return Ie.append(m("span", ot < ye.at ? "✓" : String(ot + 1), "n"), q), ot === ye.at && Ie.setAttribute("aria-current", "step"), Ie;
    })), xn.textContent = ye.caption, xn.className = "ppp-stage " + (ye.at >= Lu(h.solo).length ? "ppp-ok" : ye.blocked ? "ppp-bad" : "ppp-cyan"));
    const $s = n(".ppp-facts"), ze = [];
    h.main && ((w = h.gate) != null && w.here) && !h.solo && ze.push(...he("Your wallet", et(h.main), "ppp-addr-short"));
    const Hr = () => {
      if (!h.listening) return;
      const q = Pi("copy-listening", "Copy", () => h.listening || "", "tiny", () => ge(o.snapshot()));
      ze.push(...he(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", C(h.listening), "ppp-addr-short", q));
    };
    if (h.linked || Hr(), h.listening && h.step !== "intro")
      if (h.linked)
        ze.push(...he("Credited to", `${et(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), Hr();
      else if (h.solo) {
        h.creditedTo && ze.push(...he("Credited to", `${et(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${et(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        ze.push(...he("Returns go to", h.gift ? q : h.returnTo && !Ht(h.returnTo) ? q.replace(C(h.returnTo), h.returnTo) : q, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else ze.push(...he("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((I = h.gate) != null && I.here)) {
      const q = h.linkedListening.map((ot) => C(ot) + (ot === h.listening ? " (this one)" : "")).join(", ");
      ze.push(...he(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const q = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      ze.push(...he("Balance", `${or(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, q));
    }
    const jn = h.entries.find((q) => q.kind === "play");
    jn && ke(), jn && ze.push(...he("Last paid song", `${Me(jn)} → ${et(jn.recipient)}`, ee[jn.status] || "")), $s.replaceChildren(...ze), $s.hidden = !ze.length;
    const mt = [], jt = [], ce = [], Xe = [], Or = kn(BigInt(((K = h.gate) == null ? void 0 : K.limits.playFee) ?? "300")), Dr = `Each song you listen to for 30 seconds sends ${or(lc)} STX to whoever holds it, plus a ${or(Or - lc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Fr = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (mt.push(m("p", "Pay artists as you listen.")), (J = h.gate) != null && J.radioUrl) {
          const ot = m("p");
          ot.append(rt("Open the pay-per-play radio →", h.gate.radioUrl)), mt.push(ot);
        }
        jt.push(m("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const ot = [h.linked, ...h.others];
          mt.push(m("p", ot.length > 1 ? `This device has listening wallets for ${me(ot)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${et(h.linked)}. Connect that wallet to keep paying artists.`)), jt.push(m("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          mt.push(m("p", "Connect your wallet to pay artists as you listen.")), jt.push(m("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        mt.push(m("p", `This device's listening wallet belongs to ${et(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), jt.push(m("p", `You are connected as ${et(h.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), jt.push(m("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ce.push(W("Switch wallet", () => {
          var ot;
          return (ot = document.getElementById("radio-wallet-connect")) == null ? void 0 : ot.click();
        }, "primary"));
        break;
      case "not-invited":
        mt.push(m("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        mt.push(m("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        mt.push(m("p", "Every play counts for the song’s owner, on-chain.")), jt.push(m("p", Dr)), jt.push(m("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), jt.push(m("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (mt.push(m("p", `This device already has a listening wallet for ${me(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), jt.push(m("p", `Otherwise, set up a new listening wallet for ${et(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && jt.push(m("p", `This is the listening wallet for ${et(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && jt.push(m("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = a.liveGift();
        ce.push(W(q ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${et(h.main)}` : "Start listening", () => void o.create(), "primary")), !q && !h.solo && h.main && h.others.length && ce.push(W("Switch wallet", () => {
          var ot;
          return (ot = document.getElementById("radio-wallet-connect")) == null ? void 0 : ot.click();
        })), !q && h.solo && ce.push(W("I have a Stacks wallet", () => {
          var ot;
          return (ot = document.getElementById("radio-wallet-connect")) == null ? void 0 : ot.click();
        })), ce.push(W("I already have a listening wallet", () => void o.unlock(!0))), q && ce.push(W("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (mt.push(m("p", "Locked.", "ppp-mute")), ce.push(W("Unlock", () => void o.unlock(), "primary"))), Xe.push(W("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        mt.push(m("p", `Link to ${et(h.main)} · free`)), jt.push(m("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), jt.push(m("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ce.push(W(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        mt.push(m("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && mt.push(Gt(h.arrival)) : O(h) ? mt.push(m("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (dt = h.gift) != null && dt.player ? mt.push(m("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? mt.push(m("p", "No plays left · add plays to keep counting", "ppp-bad")) : mt.push(m("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Or)).toLocaleString()} plays`)), (F = h.gift) != null && F.player ? jt.push(m("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : h.entries.length && jt.push(m("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), h.payingOn && !h.entries.length && jt.push(m("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), E ? jt.push(m("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? jt.push(m("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (jt.push(m("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), jt.push(m("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && ce.push(Pi("copy-address", "Copy my address", () => h.listening || "", "primary", () => ge(o.snapshot())))) : jt.push(m("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const ot = m("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          ot.append(rt("View", v(h.depositTxid))), mt.push(ot);
        } else h.allowance > 0n && !h.solo && !h.depositPending && ce.push(W(`Deposit ${or(h.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        mt.push(m("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (mt.push(m("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), mt.push(Wt(h))), (!h.solo || h.returnTo) && ce.push(W("Return excess", () => void o.returnFunds("excess"), "primary"), W("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0) {
          const ot = Math.min(h.session.playsLeft, h.playsLeft);
          mt.push(m("p", `${ot.toLocaleString()} plays left`, "ppp-ok")), jt.push(m("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), ce.push(W("Switch off", () => void o.switchOff()));
        } else
          mt.push(m("p", "Plays are off. Music stays free.", "ppp-mute")), ce.push(W("Switch plays on", () => void o.switchOn(), "primary"));
        h.queued && mt.push(m("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && mt.push(m("p", "Running low on plays", "ppp-warn")), h.depositPending ? mt.push(m("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && ce.push(W(`Top up ${or(h.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (h.solo && h.walletCannotSolo && jt.push(m("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && jt.push(Wt(h)), jt.push(se()), h.slot === 0 && h.step === "ready" && h.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = m("p", "New to Stacks? ", "ppp-mute");
      q.append(rt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), mt.push(q);
    }
    if (h.walletOutdated && jt.push(m("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (mt.push(m("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ce.push(W("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && Xe.push(W(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${et(h.returnTo)}`, () => void o.returnFunds("all"), "quiet")), h.slot > 0 && ((gt = h.gift) != null && gt.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && Xe.push(Pe(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && Xe.push(W("Lock", () => void o.lock(), "quiet")), dn && !xe && Xe.push(W(te ? "Hide listening wallet box" : "Show listening wallet box", () => {
      te = !te, ge(o.snapshot());
    }, "quiet")), [...ce, ...Xe].forEach((q) => q.disabled = Fr), Fr && (ce.length = 0), h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((yt = h.gift) != null && yt.player)) {
      const q = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", ot = mt.at(0);
      h.step === "ready" && ot ? ot.append(m("span", ` · ${X(h.balance)} STX`, q)) : mt.push(m("p", `Balance ${X(h.balance)} STX`, q));
    }
    if ((bt = h.gift) != null && bt.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const q = m("p", "", "ppp-gift");
      q.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && q.append(" · ", h.gift.player.subtitle);
      const ot = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? m("span", " · plays on their way", "ppp-warn") : m("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      ot && q.append(ot);
      const Ie = (zt = mt.at(0)) == null ? void 0 : zt.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && Ie && /STX/.test(Ie.textContent ?? "") && Ie.remove(), mt.unshift(q), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          mt.splice(1, 0, m("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Pe(h, "primary"));
        else {
          const De = m("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          De.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), De.append(rt("Xverse", "https://www.xverse.app/download"), " and ", rt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), mt.splice(1, 0, De);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const q = h.returnPlan, ot = m("div", "", "ppp-pick");
      ot.append(m("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Ie = m("ul", "", "ppp-gift-list");
      q.steps.forEach((De, uo) => {
        const Ls = De.kind === "gift" ? "the unused gift" : De.kind === "deposit" ? "what was added to it" : "the rest", nn = m("li");
        nn.append(m("span", `${uo + 1}. ${or(BigInt(De.send))} STX · ${Ls}`, "t"), m("span", De.to ? ` → ${et(De.to)}` : " → choose an address below", De.to ? "ppp-mute" : "ppp-warn")), Ie.append(nn);
      }), ot.append(Ie), q.kept && ot.append(m("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((De) => !De.to) && ot.append(Wt(h)), ot.append(W(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), mt.push(ot);
    }
    const Sr = As(h), jr = u ? Sr : null, ks = a.banner(d, { bare: !!jr }), Se = Mt && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? Ft(Mt, a.pendingCode()) : [];
    jr || (mt.unshift(...ks), mt.push(...Et(h)), mt.unshift(...Se)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && mt.unshift(m("p", `This is ${et(h.creditedTo)}'s listening wallet. Plays and likes count for ${et(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...mt);
    const Is = document.querySelector(".ppp-switch");
    if (Is) {
      const q = c.latest(), ot = h.slot > 0, Ie = ["fund", "ready", "over"].includes(h.step) && (ot || !!q);
      if (Is.hidden = !Ie, Ie) {
        const De = (nn, Xo, Si, Gc) => {
          const zr = W("", Gc, "ppp-tab");
          return zr.setAttribute("aria-pressed", String(Si)), zr.append(m("span", nn, "tt"), m("span", Xo === void 0 ? "…" : `${it(Xo).toLocaleString()} plays`, "ts")), zr.disabled = !!h.busy, zr;
        }, uo = ot ? ((Ye = (_e = h.gift) == null ? void 0 : _e.player) == null ? void 0 : Ye.title) ?? "Album" : q.title, Ls = W("View all albums" + (c.count() > 1 ? ` (${c.count()})` : ""), () => {
          const nn = document.querySelector(".ppp-shelf");
          nn && (nn.hidden = !1, nn.open = !nn.open, Ls.setAttribute("aria-expanded", String(nn.open)), nn.open && requestAnimationFrame(() => nn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Ls.setAttribute("aria-expanded", String(!!((le = document.querySelector(".ppp-shelf")) != null && le.open))), Is.replaceChildren(
          De("🎧 My player", ot ? (Sn = h.likeFunds) == null ? void 0 : Sn.balance : h.balance, !ot, () => {
            ot && o.openAlbum(0);
          }),
          De("💿 " + uo, ot ? h.balance : void 0, ot, () => {
            !ot && q && o.openAlbum(q.slot);
          }),
          Ls
        );
      }
    }
    const Jn = c.render(h), zn = document.querySelector(".ppp-shelf");
    if (zn) {
      zn.hidden = !Jn;
      const q = zn.querySelector("summary");
      q && (q.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const ot = zn.querySelector(".ppp-shelf-body");
      Jn && ot && !ot.contains(Jn) && ot.replaceChildren(Jn);
    }
    const Rn = a.renderFold(d);
    if (n(".ppp-gifts").hidden = !Rn, Rn && !n(".ppp-gift-body").contains(Rn) && n(".ppp-gift-body").replaceChildren(Rn), Rn && vt) {
      vt = !1;
      const q = n(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...jt), n(".ppp-actions").replaceChildren(...ce), n(".ppp-actions2").replaceChildren(...Xe);
    const tr = h.busy || h.message || "", bi = n(".ppp-msg"), Er = tr && mt.some((q) => (q.textContent ?? "").startsWith(tr.replace(/[.✓\s]+$/, ""))) ? "" : tr, mi = !Er && !h.error ? h.notice : ct && !Er ? h.error : "";
    bi.textContent = Er || mi, bi.classList.toggle("is-warn", !!mi), n(".ppp-err").textContent = ct ? "" : h.error;
    const lo = h.entries.filter((q) => q.kind === "play");
    n(".ppp-recent").hidden = !h.entries.length, n(".ppp-recent-list").replaceChildren(...lo.slice(0, 5).map((q) => {
      const ot = m("li"), Ie = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return ot.append(m("span", "", "d " + Ie), m("span", Me(q), "t"), m("span", St(q.created), "ppp-mute")), q.txid && ot.append(rt("tx", v(q.txid))), ot;
    })), n(".ppp-wallets").hidden = !($s.childElementCount || Xe.length), n(".ppp-more").hidden = !jt.length;
    const Ar = n(".ppp-history");
    Ar.hidden = !h.entries.length, h.entries.length && ke(), Ar.replaceChildren(m("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((q) => {
      const ot = m("div", "", "ppp-row"), Ie = q.kind === "play" ? [m("span", Me(q), "ppp-song"), m("span", ` · ${or(BigInt(q.amount))} STX to ${et(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [m("span", `${q.liked ? "♥ Liked" : "Unliked"} ${Me(q)}`, "ppp-song"), m("span", ` · for ${h.linked ? et(h.linked) : "this listening wallet"}`, "ppp-mute")] : [m("span", `Returned ${or(BigInt(q.amount))} STX`, "ppp-song"), m("span", ` to ${et(q.recipient)}`, "ppp-mute")];
      return ot.append(
        m("span", fn[q.status] || q.status, "ppp-status " + (ee[q.status] || "")),
        ...Ie,
        m("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && ot.append(rt("tx ↗", v(q.txid))), ot;
    })), y == null || y.render(jr ? wi(h, jr, [...Se, ...ks]) : null), x == null || x.render((Sr == null ? void 0 : Sr.mode) === "open" ? wi(h, Sr, []) : null);
  }
  function As(d) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(d.step)) return null;
    if (d.slot > 0 && ((h = d.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(d.step))
      return d.root && z({ root: d.root, slot: d.slot, player: d.gift.player }), { mode: "open", player: d.gift.player };
    const E = a.incomingAlbum();
    if (E) return { mode: "arrive", player: E.player, from: E.from, offered: E.plays };
    const L = B();
    return L && (d.step === "locked" || A && d.step === "loading") ? { mode: "locked", player: L.player } : null;
  }
  function wi(d, E, L) {
    var xe, dn, Fn;
    const h = !!d.busy || d.armed, ct = [...L];
    d.depositPending && d.arrival && ct.push(Gt(d.arrival)), d.error ? ct.push(m("p", d.error, d.error === dc ? "ppp-warn" : "ppp-bad")) : d.message && !h ? ct.push(m("p", d.message, "ppp-cyan")) : d.notice && ct.push(m("p", d.notice, "ppp-warn")), E.mode === "open" && P && ((xe = d.likeFunds) != null && xe.album) && d.likeFunds.low && !d.likeFunds.pending && ct.push(m("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const lt = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let At = null, Qt = null;
    return E.mode === "locked" ? (At = { label: "Continue listening", run: () => {
      A = B(), o.unlock();
    } }, Qt = { label: "Use a different passkey", run: () => {
      A = null, o.unlock(!0);
    } }) : E.mode === "arrive" && (d.step === "intro" ? (At = { label: "Open album", run: () => void o.create() }, Qt = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : d.step === "locked" ? (At = { label: "Open album", run: () => void o.unlock() }, Qt = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : d.step === "unsupported" ? ct.push(m("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : ct.length || ct.push(m("p", "Opening your album…", "ppp-cyan"))), {
      mode: E.mode,
      player: E.player,
      from: E.from,
      offered: E.offered,
      plays: E.mode === "open" ? d.balance === void 0 ? null : d.giftPlays : void 0,
      playsComing: d.depositPending,
      status: ct,
      primary: At,
      secondary: Qt,
      hint: At ? lt : void 0,
      asking: h,
      busy: !!d.busy,
      myPlays: Ot(d),
      topUps: Ha,
      canMake: !!((Fn = (dn = d.gate) == null ? void 0 : dn.gifts) != null && Fn.admin)
    };
  }
  const en = /* @__PURE__ */ new Map(), vs = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((E) => {
      const L = E == null ? void 0 : E.nowPlaying;
      L && Number.isSafeInteger(Number(L.tokenId)) && en.set(Number(L.tokenId), { title: L.title || void 0, artist: L.artist || void 0 });
    }), !0) : !1;
  };
  if (!vs()) {
    const d = setInterval(() => {
      vs() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const E = d.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      ke();
      const L = Be(E.song, en.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: L.title || void 0, artist: L.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const H$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", O$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, D$ = () => O$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, F$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, j$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', dw = class {
  constructor(t) {
    c4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Lx(t), this.callback(Lc(t));
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
    const t = D$(), e = F$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return $t("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, $t("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), $t("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, $t("div", { class: "flex flex-col space-y-[10px]" }, $t("div", { class: "flex items-center" }, $t("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), $t("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, $t("span", { class: "sr-only" }, "Close popup"), $t("img", { src: H$ }))), r ? $t("p", null, "Select the wallet you want to connect to.") : $t("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && $t("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && $t("div", { class: "mt-6" }, $t("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), $t("ul", { class: "space-y-3" }, this.installedProviders.map((s) => $t("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, $t("div", { class: "aspect-square basis-9 overflow-hidden" }, $t("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), $t("div", { class: "flex-1" }, $t("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && $t("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), $t("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && $t("div", { class: "mt-6" }, r ? $t("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : $t("div", { class: "mb-5 flex justify-between" }, $t("p", { class: "text-sm font-medium" }, "Recommended wallets"), $t("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, $t("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, $t("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), $t("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), $t("p", null, "What is a wallet? ", $t("span", { class: "align-text-bottom text-[9px]" }, "↗")))), $t("ul", { class: "space-y-3" }, n.map((s) => $t("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, $t("div", { class: "aspect-square basis-9 overflow-hidden" }, $t("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), $t("div", { class: "flex-1" }, $t("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && $t("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && $t("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return RA(this);
  }
};
dw.style = j$;
const z$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: dw
}, Symbol.toStringTag, { value: "Module" }));
