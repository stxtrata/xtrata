var ew = Object.defineProperty;
var nw = (t, e, n) => e in t ? ew(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Zi = (t, e, n) => nw(t, typeof e != "symbol" ? e + "" : e, n);
var Ye = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function c0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Ja(t) {
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
      typeof Ye < "u" && Ye || {}, r = {
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
      function i(x) {
        return x && DataView.prototype.isPrototypeOf(x);
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
        ], o = ArrayBuffer.isView || function(x) {
          return x && s.indexOf(Object.prototype.toString.call(x)) > -1;
        };
      function a(x) {
        if (typeof x != "string" && (x = String(x)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(x) || x === "")
          throw new TypeError('Invalid character in header field name: "' + x + '"');
        return x.toLowerCase();
      }
      function c(x) {
        return typeof x != "string" && (x = String(x)), x;
      }
      function u(x) {
        var b = {
          next: function() {
            var L = x.shift();
            return { done: L === void 0, value: L };
          }
        };
        return r.iterable && (b[Symbol.iterator] = function() {
          return b;
        }), b;
      }
      function d(x) {
        this.map = {}, x instanceof d ? x.forEach(function(b, L) {
          this.append(L, b);
        }, this) : Array.isArray(x) ? x.forEach(function(b) {
          if (b.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + b.length);
          this.append(b[0], b[1]);
        }, this) : x && Object.getOwnPropertyNames(x).forEach(function(b) {
          this.append(b, x[b]);
        }, this);
      }
      d.prototype.append = function(x, b) {
        x = a(x), b = c(b);
        var L = this.map[x];
        this.map[x] = L ? L + ", " + b : b;
      }, d.prototype.delete = function(x) {
        delete this.map[a(x)];
      }, d.prototype.get = function(x) {
        return x = a(x), this.has(x) ? this.map[x] : null;
      }, d.prototype.has = function(x) {
        return this.map.hasOwnProperty(a(x));
      }, d.prototype.set = function(x, b) {
        this.map[a(x)] = c(b);
      }, d.prototype.forEach = function(x, b) {
        for (var L in this.map)
          this.map.hasOwnProperty(L) && x.call(b, this.map[L], L, this);
      }, d.prototype.keys = function() {
        var x = [];
        return this.forEach(function(b, L) {
          x.push(L);
        }), u(x);
      }, d.prototype.values = function() {
        var x = [];
        return this.forEach(function(b) {
          x.push(b);
        }), u(x);
      }, d.prototype.entries = function() {
        var x = [];
        return this.forEach(function(b, L) {
          x.push([L, b]);
        }), u(x);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(x) {
        if (!x._noBody) {
          if (x.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          x.bodyUsed = !0;
        }
      }
      function g(x) {
        return new Promise(function(b, L) {
          x.onload = function() {
            b(x.result);
          }, x.onerror = function() {
            L(x.error);
          };
        });
      }
      function p(x) {
        var b = new FileReader(), L = g(b);
        return b.readAsArrayBuffer(x), L;
      }
      function E(x) {
        var b = new FileReader(), L = g(b), U = /charset=([A-Za-z0-9_-]+)/.exec(x.type), J = U ? U[1] : "utf-8";
        return b.readAsText(x, J), L;
      }
      function A(x) {
        for (var b = new Uint8Array(x), L = new Array(b.length), U = 0; U < b.length; U++)
          L[U] = String.fromCharCode(b[U]);
        return L.join("");
      }
      function B(x) {
        if (x.slice)
          return x.slice(0);
        var b = new Uint8Array(x.byteLength);
        return b.set(new Uint8Array(x)), b.buffer;
      }
      function K() {
        return this.bodyUsed = !1, this._initBody = function(x) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = x, x ? typeof x == "string" ? this._bodyText = x : r.blob && Blob.prototype.isPrototypeOf(x) ? this._bodyBlob = x : r.formData && FormData.prototype.isPrototypeOf(x) ? this._bodyFormData = x : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) ? this._bodyText = x.toString() : r.arrayBuffer && r.blob && i(x) ? (this._bodyArrayBuffer = B(x.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(x) || o(x)) ? this._bodyArrayBuffer = B(x) : this._bodyText = x = Object.prototype.toString.call(x) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof x == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(x) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var x = l(this);
            return x || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var x = l(this);
          if (x)
            return x;
          if (this._bodyBlob)
            return E(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(A(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(T);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var V = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function v(x) {
        var b = x.toUpperCase();
        return V.indexOf(b) > -1 ? b : x;
      }
      function _(x, b) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        b = b || {};
        var L = b.body;
        if (x instanceof _) {
          if (x.bodyUsed)
            throw new TypeError("Already read");
          this.url = x.url, this.credentials = x.credentials, b.headers || (this.headers = new d(x.headers)), this.method = x.method, this.mode = x.mode, this.signal = x.signal, !L && x._bodyInit != null && (L = x._bodyInit, x.bodyUsed = !0);
        } else
          this.url = String(x);
        if (this.credentials = b.credentials || this.credentials || "same-origin", (b.headers || !this.headers) && (this.headers = new d(b.headers)), this.method = v(b.method || this.method || "GET"), this.mode = b.mode || this.mode || null, this.signal = b.signal || this.signal || function() {
          if ("AbortController" in n) {
            var D = new AbortController();
            return D.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && L)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(L), (this.method === "GET" || this.method === "HEAD") && (b.cache === "no-store" || b.cache === "no-cache")) {
          var U = /([?&])_=[^&]*/;
          if (U.test(this.url))
            this.url = this.url.replace(U, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var J = /\?/;
            this.url += (J.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function T(x) {
        var b = new FormData();
        return x.trim().split("&").forEach(function(L) {
          if (L) {
            var U = L.split("="), J = U.shift().replace(/\+/g, " "), D = U.join("=").replace(/\+/g, " ");
            b.append(decodeURIComponent(J), decodeURIComponent(D));
          }
        }), b;
      }
      function S(x) {
        var b = new d(), L = x.replace(/\r?\n[\t ]+/g, " ");
        return L.split("\r").map(function(U) {
          return U.indexOf(`
`) === 0 ? U.substr(1, U.length) : U;
        }).forEach(function(U) {
          var J = U.split(":"), D = J.shift().trim();
          if (D) {
            var yt = J.join(":").trim();
            try {
              b.append(D, yt);
            } catch (dt) {
              console.warn("Response " + dt.message);
            }
          }
        }), b;
      }
      K.call(_.prototype);
      function N(x, b) {
        if (!(this instanceof N))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (b || (b = {}), this.type = "default", this.status = b.status === void 0 ? 200 : b.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = b.statusText === void 0 ? "" : "" + b.statusText, this.headers = new d(b.headers), this.url = b.url || "", this._initBody(x);
      }
      K.call(N.prototype), N.prototype.clone = function() {
        return new N(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, N.error = function() {
        var x = new N(null, { status: 200, statusText: "" });
        return x.ok = !1, x.status = 0, x.type = "error", x;
      };
      var P = [301, 302, 303, 307, 308];
      N.redirect = function(x, b) {
        if (P.indexOf(b) === -1)
          throw new RangeError("Invalid status code");
        return new N(null, { status: b, headers: { location: x } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(b, L) {
          this.message = b, this.name = L;
          var U = Error(b);
          this.stack = U.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function M(x, b) {
        return new Promise(function(L, U) {
          var J = new _(x, b);
          if (J.signal && J.signal.aborted)
            return U(new e.DOMException("Aborted", "AbortError"));
          var D = new XMLHttpRequest();
          function yt() {
            D.abort();
          }
          D.onload = function() {
            var I = {
              statusText: D.statusText,
              headers: S(D.getAllResponseHeaders() || "")
            };
            J.url.indexOf("file://") === 0 && (D.status < 200 || D.status > 599) ? I.status = 200 : I.status = D.status, I.url = "responseURL" in D ? D.responseURL : I.headers.get("X-Request-URL");
            var F = "response" in D ? D.response : D.responseText;
            setTimeout(function() {
              L(new N(F, I));
            }, 0);
          }, D.onerror = function() {
            setTimeout(function() {
              U(new TypeError("Network request failed"));
            }, 0);
          }, D.ontimeout = function() {
            setTimeout(function() {
              U(new TypeError("Network request timed out"));
            }, 0);
          }, D.onabort = function() {
            setTimeout(function() {
              U(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function dt(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (D.open(J.method, dt(J.url), !0), J.credentials === "include" ? D.withCredentials = !0 : J.credentials === "omit" && (D.withCredentials = !1), "responseType" in D && (r.blob ? D.responseType = "blob" : r.arrayBuffer && (D.responseType = "arraybuffer")), b && typeof b.headers == "object" && !(b.headers instanceof d || n.Headers && b.headers instanceof n.Headers)) {
            var at = [];
            Object.getOwnPropertyNames(b.headers).forEach(function(I) {
              at.push(a(I)), D.setRequestHeader(I, c(b.headers[I]));
            }), J.headers.forEach(function(I, F) {
              at.indexOf(F) === -1 && D.setRequestHeader(F, I);
            });
          } else
            J.headers.forEach(function(I, F) {
              D.setRequestHeader(F, I);
            });
          J.signal && (J.signal.addEventListener("abort", yt), D.onreadystatechange = function() {
            D.readyState === 4 && J.signal.removeEventListener("abort", yt);
          }), D.send(typeof J._bodyInit > "u" ? null : J._bodyInit);
        });
      }
      return M.polyfill = !0, n.fetch || (n.fetch = M, n.Headers = d, n.Request = _, n.Response = N), e.Headers = d, e.Request = _, e.Response = N, e.fetch = M, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Ye);
})();
const rw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function sw(t, e) {
  const n = {};
  return Object.assign(n, rw, e), await fetch(t, n);
}
function iw(t) {
  let e = sw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ow(...t) {
  const { fetchLib: e, middlewares: n } = iw(t);
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
var $i;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})($i || ($i = {}));
var Cs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Cs || (Cs = {}));
var Bf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Bf || (Bf = {}));
const aw = "https://api.mainnet.hiro.so", cw = "https://api.testnet.hiro.so", lw = "http://localhost:3999", uw = ["mainnet", "testnet", "devnet", "mocknet"];
let ki = class {
  constructor(e) {
    this.version = Cs.Mainnet, this.chainId = $i.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Cs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ow();
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
ki.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new al();
    case "testnet":
      return new fw();
    case "devnet":
      return new dw();
    case "mocknet":
      return new l0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${uw.join(", ")}`);
  }
};
ki.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ki.fromName(t);
let al = class extends ki {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Cs.Mainnet, this.chainId = $i.Mainnet;
  }
}, fw = class extends ki {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Cs.Testnet, this.chainId = $i.Testnet;
  }
}, l0 = class extends ki {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Cs.Testnet, this.chainId = $i.Testnet;
  }
};
const dw = l0, u0 = "xtrata.wallet.bridge.v1", hw = (t) => typeof t == "object" && t !== null && t.protocol === u0, pw = (t) => hw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", gw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Qi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Mf = 12e4;
class yw {
  constructor(e) {
    Zi(this, "pending", /* @__PURE__ */ new Map());
    Zi(this, "listenTarget");
    Zi(this, "closed", !1);
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
    Zi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !pw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Qi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Qi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Qi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = gw(), s = { protocol: u0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new Qi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Mf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Mf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Qi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const ww = ["SP", "SM"], bw = ["ST", "SN"], mw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return ww.includes(n) ? "mainnet" : bw.includes(n) ? "testnet" : null;
}, xw = () => {
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
}, Sw = () => typeof window > "u" || !window.localStorage ? xw() : window.localStorage, Bc = "xtrata.v15.1.wallet.session", Nf = "mainnet", $a = { isConnected: !1 }, Ew = (t) => t.address ? mw(t.address) ?? t.network : t.network, f0 = (t) => !t.isConnected || !t.address ? { ...$a } : Ew(t) !== Nf ? { ...$a } : {
  isConnected: !0,
  address: t.address,
  network: Nf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Aw = (t) => {
  if (!t)
    return { ...$a };
  try {
    const e = JSON.parse(t);
    return f0(e);
  } catch {
    return { ...$a };
  }
}, vw = (t) => {
  const e = f0(t);
  return JSON.stringify(e);
}, $w = (t) => {
  const e = Sw();
  return {
    load: () => Aw(e.getItem(Bc)),
    save: (n) => {
      e.setItem(Bc, vw(n));
    },
    clear: () => {
      e.removeItem(Bc);
    }
  };
}, kw = "https://browser.blockstack.org/auth", Iw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, d0 = ["store_write"], Lw = "blockstack-session", Cw = {
  logLevel: "debug"
}, qs = {
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
Object.freeze(qs);
class Ri extends Error {
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
class Tw extends Ri {
  constructor(e, n = "") {
    super({ code: qs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class _f extends Ri {
  constructor(e = "") {
    super({ code: qs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Oo extends Ri {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: qs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Pf extends Ri {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: qs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class cl extends Ri {
  constructor(e) {
    super({ code: qs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class h0 extends Ri {
  constructor(e) {
    super({ code: qs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Uf = ["debug", "info", "warn", "error", "none"], ll = {};
for (let t = 0; t < Uf.length; t++) {
  const e = Uf[t];
  ll[e] = t;
}
class bi {
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
    return ll[Cw.logLevel] <= ll[e];
  }
}
function Bw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Mw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Mc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function Nw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function _w() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Pw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function du(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = _w(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    bi.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Pw(i, t.toString(), n);
    throw bi.error(s), new Error(s);
  }
  if (r)
    return {};
}
function ls(t, e) {
  return hu(ze(t), e);
}
function ze(t) {
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
  if (on(t, Uint8Array))
    return BigInt(`0x${ft(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Uw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Hf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ko(t, e = 8) {
  return (typeof t == "bigint" ? t : ze(t)).toString(16).padStart(e * 2, "0");
}
function tc(t) {
  return parseInt(t, 16);
}
function hu(t, e = 16) {
  const n = ko(t, e);
  return Dt(n);
}
function Hw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Ow(t, e) {
  return t & BigInt(1) << e;
}
function ul(t) {
  return Dw(BigInt(`0x${ft(t)}`), BigInt(t.byteLength * 8));
}
function Dw(t, e) {
  return Ow(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Fw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ft(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Fw[n];
  return e;
}
function Dt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Uw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Ws(t) {
  return new TextEncoder().encode(t);
}
function Io(t) {
  return new TextDecoder().decode(t);
}
function jw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function zw(t) {
  return String.fromCharCode.apply(null, t);
}
function Rw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Of(t) {
  if (t.some(Rw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function tr(...t) {
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
function xe(t) {
  return tr(...t.map((e) => typeof e == "number" ? Of([e]) : e instanceof Array ? Of(e) : e));
}
function on(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const p0 = "https://api.mainnet.hiro.so", g0 = "https://api.testnet.hiro.so", y0 = "http://localhost:3999", Gw = "https://hub.blockstack.org", Kw = 33, Nc = 32;
function Vw(t) {
  if (t.length < Nc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Nc * 2), r = t.slice(2 + Nc * 2);
  return {
    recoveryId: tc(e),
    r: n,
    s: r
  };
}
function pu(t) {
  const e = typeof t == "string" ? Dt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function qw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Ww(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Xw(t, e) {
  return t[e];
}
function Yw(t, e, n = 0) {
  return t[n] = e, t;
}
function Zw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ts(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Qw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Jw(t, e) {
  const n = {};
  return Object.assign(n, Qw, e), await fetch(t, n);
}
function tb(t) {
  let e = Jw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function eb(...t) {
  const { fetchLib: e, middlewares: n } = tb(t);
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
class w0 {
  constructor(e = d0.slice(), n = ((a) => (a = du("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = kw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function fl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function b0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fl(t.outputLen), fl(t.blockLen);
}
function sb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ib(t, e) {
  b0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bs = {
  number: fl,
  bool: nb,
  bytes: b0,
  hash: rb,
  exists: sb,
  output: ib
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _c = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), jn = (t, e) => t << 32 - e | t >>> e, ob = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ob)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ab(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function gu(t) {
  if (typeof t == "string" && (t = ab(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let m0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Xs(t) {
  const e = (r) => t().update(gu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let x0 = class extends m0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, bs.hash(e);
    const r = gu(n);
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
    return bs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    bs.exists(this), bs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ec = (t, e, n) => new x0(t, e).update(n).digest();
ec.create = (t, e) => new x0(t, e);
function cb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let yu = class extends m0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _c(this.buffer);
  }
  update(e) {
    bs.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = gu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = _c(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bs.exists(this), bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    cb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = _c(e), c = this.outputLen;
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
const lb = (t, e, n) => t & e ^ ~t & n, ub = (t, e, n) => t & e ^ t & n ^ e & n, fb = new Uint32Array([
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
let S0 = class extends yu {
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
      const g = Nr[l - 15], p = Nr[l - 2], E = jn(g, 7) ^ jn(g, 18) ^ g >>> 3, A = jn(p, 17) ^ jn(p, 19) ^ p >>> 10;
      Nr[l] = A + Nr[l - 7] + E + Nr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = jn(a, 6) ^ jn(a, 11) ^ jn(a, 25), p = d + g + lb(a, c, u) + fb[l] + Nr[l] | 0, A = (jn(r, 2) ^ jn(r, 13) ^ jn(r, 22)) + ub(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Nr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, db = class extends S0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ii = Xs(() => new S0());
Xs(() => new db());
const hb = {}, E0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Pt = BigInt(0), oe = BigInt(1), ss = BigInt(2), oo = BigInt(3), Df = BigInt(8), Zt = Object.freeze({
  a: Pt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: oe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Ff = (t, e) => (t + e / ss) / e, Do = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Zt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -oe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = Ff(s * t, e), c = Ff(-r * t, e);
    let u = Q(t - a * n - c * i, e), d = Q(-a * r - c * s, e);
    const l = u > o, g = d > o;
    if (l && (u = e - u), g && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: d };
  }
}, Pn = 32, Bs = 32, A0 = 32, ka = Pn + 1, Ia = 2 * Pn + 1;
function jf(t) {
  const { a: e, b: n } = Zt, r = Q(t * t), i = Q(r * t);
  return Q(i + e * t + n);
}
const Fo = Zt.a === Pt;
class wu extends Error {
  constructor(e) {
    super(e);
  }
}
function zf(t) {
  if (!(t instanceof Kt))
    throw new TypeError("JacobianPoint expected");
}
class Kt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Lt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Lt.ZERO) ? Kt.ZERO : new Kt(e.x, e.y, oe);
  }
  static toAffineBatch(e) {
    const n = bb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Kt.toAffineBatch(e).map(Kt.fromAffine);
  }
  equals(e) {
    zf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = Q(i * i), u = Q(a * a), d = Q(n * u), l = Q(s * c), g = Q(Q(r * a) * u), p = Q(Q(o * i) * c);
    return d === l && g === p;
  }
  negate() {
    return new Kt(this.x, Q(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = Q(e * e), s = Q(n * n), o = Q(s * s), a = e + s, c = Q(ss * (Q(a * a) - i - o)), u = Q(oo * i), d = Q(u * u), l = Q(d - ss * c), g = Q(u * (c - l) - Df * o), p = Q(ss * n * r);
    return new Kt(l, g, p);
  }
  add(e) {
    zf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Pt || o === Pt)
      return this;
    if (n === Pt || r === Pt)
      return e;
    const c = Q(i * i), u = Q(a * a), d = Q(n * u), l = Q(s * c), g = Q(Q(r * a) * u), p = Q(Q(o * i) * c), E = Q(l - d), A = Q(p - g);
    if (E === Pt)
      return A === Pt ? this.double() : Kt.ZERO;
    const B = Q(E * E), K = Q(E * B), V = Q(d * B), v = Q(A * A - K - ss * V), _ = Q(A * (V - v) - g * K), T = Q(i * a * E);
    return new Kt(v, _, T);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Kt.ZERO;
    if (typeof e == "bigint" && e === Pt)
      return n;
    let r = Kf(e);
    if (r === oe)
      return this;
    if (!Fo) {
      let l = n, g = this;
      for (; r > Pt; )
        r & oe && (l = l.add(g)), g = g.double(), r >>= oe;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = Do.splitScalar(r), c = n, u = n, d = this;
    for (; s > Pt || a > Pt; )
      s & oe && (c = c.add(d)), a & oe && (u = u.add(d)), d = d.double(), s >>= oe, a >>= oe;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Kt(Q(u.x * Do.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Fo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Kt.BASE) && (n = Lt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && dl.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Kt.normalizeZ(i), dl.set(n, i)));
    let s = Kt.ZERO, o = Kt.BASE;
    const a = 1 + (Fo ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const p = g * c;
      let E = Number(e & u);
      e >>= l, E > c && (E -= d, e += oe);
      const A = p, B = p + Math.abs(E) - 1, K = g % 2 !== 0, V = E < 0;
      E === 0 ? o = o.add(jo(K, i[A])) : s = s.add(jo(V, i[B]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = Kf(e), i, s;
    if (Fo) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Do.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: p } = this.wNAF(u, n);
      d = jo(o, d), g = jo(c, g), g = new Kt(Q(g.x * Do.beta), g.y, g.z), i = d.add(g), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Kt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Kt.ZERO);
    e == null && (e = s ? Df : Gi(i));
    const o = e, a = Q(o * o), c = Q(a * o), u = Q(n * a), d = Q(r * c), l = Q(i * o);
    if (s)
      return Lt.ZERO;
    if (l !== oe)
      throw new Error("invZ was invalid");
    return new Lt(u, d);
  }
}
Kt.BASE = new Kt(Zt.Gx, Zt.Gy, oe);
Kt.ZERO = new Kt(Pt, oe, Pt);
function jo(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const dl = /* @__PURE__ */ new WeakMap();
class Lt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, dl.delete(this);
  }
  hasEvenY() {
    return this.y % ss === Pt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = yn(n ? e : e.subarray(1));
    if (!ya(r))
      throw new Error("Point is not on curve");
    const i = jf(r);
    let s = wb(i);
    const o = (s & oe) === oe;
    n ? o && (s = Q(-s)) : (e[0] & 1) === 1 !== o && (s = Q(-s));
    const a = new Lt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = yn(e.subarray(1, Pn + 1)), r = yn(e.subarray(Pn + 1, Pn * 2 + 1)), i = new Lt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = er(e), r = n.length, i = n[0];
    if (r === Pn)
      return this.fromCompressedHex(n);
    if (r === ka && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === Ia && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ka} compressed bytes or ${Ia} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Lt.BASE.multiply(Ms(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = k0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = bu(er(e)), { n: a } = Zt, c = r === 2 || r === 3 ? i + a : i, u = Gi(c, a), d = Q(-o * u, a), l = Q(s * u, a), g = r & 1 ? "03" : "02", p = Lt.fromHex(g + is(c)), E = Lt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!E)
      throw new Error("Cannot recover signature: point at infinify");
    return E.assertValidity(), E;
  }
  toRawBytes(e = !1) {
    return os(this.toHex(e));
  }
  toHex(e = !1) {
    const n = is(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${is(this.y)}`;
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
    const i = Q(r * r), s = jf(n);
    if (Q(i - s) !== Pt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Lt(this.x, Q(-this.y));
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
    const i = Kt.fromAffine(this), s = n === Pt || n === oe || this !== Lt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Kt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Kt.ZERO) ? void 0 : a.toAffine();
  }
}
Lt.BASE = new Lt(Zt.Gx, Zt.Gy);
Lt.ZERO = new Lt(Pt, Pt);
function Rf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Gf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Li(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: yn(n), left: t.subarray(e + 2) };
}
function pb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Li(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Gf(t.subarray(2)), { data: r, left: i } = Gf(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Li(i)}`);
  return { r: e, s: r };
}
class gn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? Li(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new gn(La(i.slice(0, 64)), La(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = pb(n ? e : os(e));
    return new gn(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ti(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ti(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Zt.n >> oe;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new gn(this.r, Q(-this.s, Zt.n)) : this;
  }
  toDERRawBytes() {
    return os(this.toDERHex());
  }
  toDERHex() {
    const e = Rf(Ji(this.s)), n = Rf(Ji(this.r)), r = e.length / 2, i = n.length / 2, s = Ji(r), o = Ji(i);
    return `30${Ji(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return os(this.toCompactHex());
  }
  toCompactHex() {
    return is(this.r) + is(this.s);
  }
}
function ns(...t) {
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
const gb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Li(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += gb[t[n]];
  return e;
}
const yb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function is(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Pt <= t && t < yb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ci(t) {
  const e = os(is(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ji(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function La(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function os(t) {
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
function yn(t) {
  return La(Li(t));
}
function er(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : os(t);
}
function Kf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ti(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function Q(t, e = Zt.P) {
  const n = t % e;
  return n >= Pt ? n : e + n;
}
function Sn(t, e) {
  const { P: n } = Zt;
  let r = t;
  for (; e-- > Pt; )
    r *= r, r %= n;
  return r;
}
function wb(t) {
  const { P: e } = Zt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = Sn(u, oo) * u % e, l = Sn(d, oo) * u % e, g = Sn(l, ss) * c % e, p = Sn(g, r) * g % e, E = Sn(p, i) * p % e, A = Sn(E, o) * E % e, B = Sn(A, a) * A % e, K = Sn(B, o) * E % e, V = Sn(K, oo) * u % e, v = Sn(V, s) * p % e, _ = Sn(v, n) * c % e, T = Sn(_, ss);
  if (T * T % e !== t)
    throw new Error("Cannot find square root");
  return T;
}
function Gi(t, e = Zt.P) {
  if (t === Pt || e <= Pt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = Q(t, e), r = e, i = Pt, s = oe;
  for (; n !== Pt; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== oe)
    throw new Error("invert: does not exist");
  return Q(i, e);
}
function bb(t, e = Zt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Pt ? s : (n[a] = s, Q(s * o, e)), oe), i = Gi(r, e);
  return t.reduceRight((s, o, a) => o === Pt ? s : (n[a] = Q(s * n[a], e), Q(s * o, e)), i), n;
}
function mb(t) {
  const e = t.length * 8 - Bs * 8, n = yn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function bu(t, e = !1) {
  const n = mb(t);
  if (e)
    return n;
  const { n: r } = Zt;
  return n >= r ? n - r : n;
}
let Ai, ao;
class v0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return we.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ao(this.k, ...e);
  }
  checkSync() {
    if (typeof ao != "function")
      throw new wu("hmacSha256Sync needs to be set");
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
    return ns(...n);
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
    return ns(...n);
  }
}
function Ti(t) {
  return Pt < t && t < Zt.n;
}
function ya(t) {
  return Pt < t && t < Zt.P;
}
function $0(t, e, n, r = !0) {
  const { n: i } = Zt, s = bu(t, !0);
  if (!Ti(s))
    return;
  const o = Gi(s, i), a = Lt.BASE.multiply(s), c = Q(a.x, i);
  if (c === Pt)
    return;
  const u = Q(o * Q(e + n * c, i), i);
  if (u === Pt)
    return;
  let d = new gn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & oe);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Ms(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Bs)
      throw new Error("Expected 32 bytes of private key");
    e = La(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Bs)
      throw new Error("Expected 32 bytes of private key");
    e = yn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ti(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function mu(t) {
  return t instanceof Lt ? (t.assertValidity(), t) : Lt.fromHex(t);
}
function k0(t) {
  if (t instanceof gn)
    return t.assertValidity(), t;
  try {
    return gn.fromDER(t);
  } catch {
    return gn.fromCompact(t);
  }
}
function Lo(t, e = !1) {
  return Lt.fromPrivateKey(t).toRawBytes(e);
}
function xb(t, e, n, r = !1) {
  return Lt.fromSignature(t, e, n).toRawBytes(r);
}
function Vf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === ka || r === Ia : n ? r === ka * 2 || r === Ia * 2 : t instanceof Lt;
}
function xu(t, e, n = !1) {
  if (Vf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Vf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = mu(e);
  return r.assertValidity(), r.multiply(Ms(t)).toRawBytes(n);
}
function I0(t) {
  const e = t.length > Pn ? t.slice(0, Pn) : t;
  return yn(e);
}
function Sb(t) {
  const e = I0(t), n = Q(e, Zt.n);
  return L0(n < Pt ? e : n);
}
function L0(t) {
  return Ci(t);
}
function C0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = er(t), i = Ms(e), s = [L0(i), Sb(r)];
  if (n != null) {
    n === !0 && (n = we.randomBytes(Pn));
    const c = er(n);
    if (c.length !== Pn)
      throw new Error(`sign: Expected ${Pn} bytes of extra data`);
    s.push(c);
  }
  const o = ns(...s), a = I0(r);
  return { seed: o, m: a, d: i };
}
function T0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function Eb(t, e, n = {}) {
  const { seed: r, m: i, d: s } = C0(t, e, n.extraEntropy), o = new v0(A0, Bs);
  await o.reseed(r);
  let a;
  for (; !(a = $0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return T0(a, n);
}
function nc(t, e, n = {}) {
  const { seed: r, m: i, d: s } = C0(t, e, n.extraEntropy), o = new v0(A0, Bs);
  o.reseedSync(r);
  let a;
  for (; !(a = $0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return T0(a, n);
}
const Ab = { strict: !0 };
function vb(t, e, n, r = Ab) {
  let i;
  try {
    i = k0(t), e = er(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = bu(e);
  let c;
  try {
    c = mu(n);
  } catch {
    return !1;
  }
  const { n: u } = Zt, d = Gi(o, u), l = Q(a * d, u), g = Q(s * d, u), p = Lt.BASE.multiplyAndAddUnsafe(c, l, g);
  return p ? Q(p.x, u) === s : !1;
}
function Ca(t) {
  return Q(yn(t), Zt.n);
}
class Bi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = er(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = yn(n.subarray(0, 32)), i = yn(n.subarray(32, 64));
    return new Bi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ya(e) || !Ti(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return is(this.r) + is(this.s);
  }
  toRawBytes() {
    return os(this.toHex());
  }
}
function $b(t) {
  return Lt.fromPrivateKey(t).toRawX();
}
class B0 {
  constructor(e, n, r = we.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = er(e);
    const { x: i, scalar: s } = this.getScalar(Ms(n));
    if (this.px = i, this.d = s, this.rand = er(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Lt.fromPrivateKey(e), r = n.hasEvenY() ? e : Zt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ci(e ^ yn(n));
  }
  finalizeNonce(e) {
    const n = Q(yn(e), Zt.n);
    if (n === Pt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new Bi(e.x, Q(n + r * i, Zt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = we.taggedHash, o = this.initNonce(n, await s(es.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(es.nonce, o, r, e)), d = Ca(await s(es.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await _0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = we.taggedHashSync, o = this.initNonce(n, s(es.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(es.nonce, o, r, e)), d = Ca(s(es.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return P0(l, e, r) || this.error(), l;
  }
}
async function kb(t, e, n) {
  return new B0(t, e, n).calc();
}
function Ib(t, e, n) {
  return new B0(t, e, n).calcSync();
}
function M0(t, e, n) {
  const r = t instanceof Bi, i = r ? t : Bi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: er(e),
    P: mu(n)
  };
}
function N0(t, e, n, r) {
  const i = Lt.BASE.multiplyAndAddUnsafe(e, Ms(n), Q(-r, Zt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function _0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = M0(t, e, n), a = Ca(await we.taggedHash(es.challenge, Ci(r), o.toRawX(), s));
    return N0(r, o, i, a);
  } catch {
    return !1;
  }
}
function P0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = M0(t, e, n), a = Ca(we.taggedHashSync(es.challenge, Ci(r), o.toRawX(), s));
    return N0(r, o, i, a);
  } catch (r) {
    if (r instanceof wu)
      throw r;
    return !1;
  }
}
const Lb = {
  Signature: Bi,
  getPublicKey: $b,
  sign: kb,
  verify: _0,
  signSync: Ib,
  verifySync: P0
};
Lt.BASE._setWindowSize(8);
const ln = {
  node: E0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, es = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, zo = {}, we = {
  bytesToHex: Li,
  hexToBytes: os,
  concatBytes: ns,
  mod: Q,
  invert: Gi,
  isValidPrivateKey(t) {
    try {
      return Ms(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ci,
  _normalizePrivateKey: Ms,
  hashToPrivateKey: (t) => {
    t = er(t);
    const e = Bs + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = Q(yn(t), Zt.n - oe) + oe;
    return Ci(n);
  },
  randomBytes: (t = 32) => {
    if (ln.web)
      return ln.web.getRandomValues(new Uint8Array(t));
    if (ln.node) {
      const { randomBytes: e } = ln.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => we.hashToPrivateKey(we.randomBytes(Bs + 8)),
  precompute(t = 8, e = Lt.BASE) {
    const n = e === Lt.BASE ? e : new Lt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(oo), n;
  },
  sha256: async (...t) => {
    if (ln.web) {
      const e = await ln.web.subtle.digest("SHA-256", ns(...t));
      return new Uint8Array(e);
    } else if (ln.node) {
      const { createHash: e } = ln.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (ln.web) {
      const n = await ln.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ns(...e), i = await ln.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (ln.node) {
      const { createHmac: n } = ln.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = zo[t];
    if (n === void 0) {
      const r = await we.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = ns(r, r), zo[t] = n;
    }
    return we.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ai != "function")
      throw new wu("sha256Sync is undefined, you need to set it");
    let n = zo[t];
    if (n === void 0) {
      const r = Ai(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = ns(r, r), zo[t] = n;
    }
    return Ai(n, ...e);
  },
  _JacobianPoint: Kt
};
Object.defineProperties(we, {
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
      return ao;
    },
    set(t) {
      ao || (ao = t);
    }
  }
});
const Cb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Zt,
  Point: Lt,
  Signature: gn,
  getPublicKey: Lo,
  getSharedSecret: xu,
  recoverPublicKey: xb,
  schnorr: Lb,
  sign: Eb,
  signSync: nc,
  utils: we,
  verify: vb
}, Symbol.toStringTag, { value: "Module" }));
var Co = {};
Co.byteLength = _b;
var Tb = Co.toByteArray = Ub, Bb = Co.fromByteArray = Db, qn = [], An = [], Mb = typeof Uint8Array < "u" ? Uint8Array : Array, Pc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var di = 0, Nb = Pc.length; di < Nb; ++di)
  qn[di] = Pc[di], An[Pc.charCodeAt(di)] = di;
An[45] = 62;
An[95] = 63;
function U0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function _b(t) {
  var e = U0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Pb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ub(t) {
  var e, n = U0(t), r = n[0], i = n[1], s = new Mb(Pb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = An[t.charCodeAt(c)] << 18 | An[t.charCodeAt(c + 1)] << 12 | An[t.charCodeAt(c + 2)] << 6 | An[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = An[t.charCodeAt(c)] << 2 | An[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = An[t.charCodeAt(c)] << 10 | An[t.charCodeAt(c + 1)] << 4 | An[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Hb(t) {
  return qn[t >> 18 & 63] + qn[t >> 12 & 63] + qn[t >> 6 & 63] + qn[t & 63];
}
function Ob(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Hb(r));
  return i.join("");
}
function Db(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(Ob(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    qn[e >> 2] + qn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    qn[e >> 10] + qn[e >> 4 & 63] + qn[e << 2 & 63] + "="
  )), i.join("");
}
function Fb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const jb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function zb() {
  if (Fb())
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
    throw new Error(jb);
  }
}
class Rb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(tr(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(tr(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class Gb {
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
async function H0() {
  const t = await zb();
  return t.name === "subtleCrypto" ? new Gb(t.lib) : new Rb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Kb(t) {
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
    for (var E = 0, A = 0, B = 0, K = p.length; B !== K && p[B] === 0; )
      B++, E++;
    for (var V = (K - B) * u + 1 >>> 0, v = new Uint8Array(V); B !== K; ) {
      for (var _ = p[B], T = 0, S = V - 1; (_ !== 0 || T < A) && S !== -1; S--, T++)
        _ += 256 * v[S] >>> 0, v[S] = _ % o >>> 0, _ = _ / o >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      A = T, B++;
    }
    for (var N = V - A; N !== V && v[N] === 0; )
      N++;
    for (var P = a.repeat(E); N < V; ++N)
      P += t.charAt(v[N]);
    return P;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var E = 0, A = 0, B = 0; p[E] === a; )
      A++, E++;
    for (var K = (p.length - E) * c + 1 >>> 0, V = new Uint8Array(K); p[E]; ) {
      var v = p.charCodeAt(E);
      if (v > 255)
        return;
      var _ = e[v];
      if (_ === 255)
        return;
      for (var T = 0, S = K - 1; (_ !== 0 || T < B) && S !== -1; S--, T++)
        _ += o * V[S] >>> 0, V[S] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      B = T, E++;
    }
    for (var N = K - B; N !== K && V[N] === 0; )
      N++;
    for (var P = new Uint8Array(A + (K - N)), M = A; N !== K; )
      P[M++] = V[N++];
    return P;
  }
  function g(p) {
    var E = l(p);
    if (E)
      return E;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var O0 = Kb;
const Vb = O0, qb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Wb = Vb(qb);
const Xb = /* @__PURE__ */ c0(Wb), Yb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), D0 = Uint8Array.from({ length: 16 }, (t, e) => e), Zb = D0.map((t) => (9 * t + 5) % 16);
let Su = [D0], Eu = [Zb];
for (let t = 0; t < 4; t++)
  for (let e of [Su, Eu])
    e.push(e[t].map((n) => Yb[n]));
const F0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Qb = Su.map((t, e) => t.map((n) => F0[e][n])), Jb = Eu.map((t, e) => t.map((n) => F0[e][n])), t1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), e1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ro = (t, e) => t << e | t >>> 32 - e;
function qf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Go = new Uint32Array(16);
let n1 = class extends yu {
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
      Go[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, A = t1[p], B = e1[p], K = Su[p], V = Eu[p], v = Qb[p], _ = Jb[p];
      for (let T = 0; T < 16; T++) {
        const S = Ro(r + qf(p, s, a, u) + Go[K[T]] + A, v[T]) + l | 0;
        r = l, l = u, u = Ro(a, 10) | 0, a = s, s = S;
      }
      for (let T = 0; T < 16; T++) {
        const S = Ro(i + qf(E, o, c, d) + Go[V[T]] + B, _[T]) + g | 0;
        i = g, g = d, d = Ro(c, 10) | 0, c = o, o = S;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Go.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const r1 = Xs(() => new n1());
function s1(t) {
  return r1(t);
}
const Ko = BigInt(2 ** 32 - 1), hl = BigInt(32);
function j0(t, e = !1) {
  return e ? { h: Number(t & Ko), l: Number(t >> hl & Ko) } : { h: Number(t >> hl & Ko) | 0, l: Number(t & Ko) | 0 };
}
function i1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = j0(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const o1 = (t, e) => BigInt(t >>> 0) << hl | BigInt(e >>> 0), a1 = (t, e, n) => t >>> n, c1 = (t, e, n) => t << 32 - n | e >>> n, l1 = (t, e, n) => t >>> n | e << 32 - n, u1 = (t, e, n) => t << 32 - n | e >>> n, f1 = (t, e, n) => t << 64 - n | e >>> n - 32, d1 = (t, e, n) => t >>> n - 32 | e << 64 - n, h1 = (t, e) => e, p1 = (t, e) => t, g1 = (t, e, n) => t << n | e >>> 32 - n, y1 = (t, e, n) => e << n | t >>> 32 - n, w1 = (t, e, n) => e << n - 32 | t >>> 64 - n, b1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function m1(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const x1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), S1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, E1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), A1 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, v1 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), $1 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, St = {
  fromBig: j0,
  split: i1,
  toBig: o1,
  shrSH: a1,
  shrSL: c1,
  rotrSH: l1,
  rotrSL: u1,
  rotrBH: f1,
  rotrBL: d1,
  rotr32H: h1,
  rotr32L: p1,
  rotlSH: g1,
  rotlSL: y1,
  rotlBH: w1,
  rotlBL: b1,
  add: m1,
  add3L: x1,
  add3H: S1,
  add4L: E1,
  add4H: A1,
  add5H: $1,
  add5L: v1
}, [k1, I1] = St.split([
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
let rc = class extends yu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: E, Hh: A, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = A | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      _r[v] = e.getUint32(n), Pr[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const _ = _r[v - 15] | 0, T = Pr[v - 15] | 0, S = St.rotrSH(_, T, 1) ^ St.rotrSH(_, T, 8) ^ St.shrSH(_, T, 7), N = St.rotrSL(_, T, 1) ^ St.rotrSL(_, T, 8) ^ St.shrSL(_, T, 7), P = _r[v - 2] | 0, M = Pr[v - 2] | 0, x = St.rotrSH(P, M, 19) ^ St.rotrBH(P, M, 61) ^ St.shrSH(P, M, 6), b = St.rotrSL(P, M, 19) ^ St.rotrBL(P, M, 61) ^ St.shrSL(P, M, 6), L = St.add4L(N, b, Pr[v - 7], Pr[v - 16]), U = St.add4H(L, S, x, _r[v - 7], _r[v - 16]);
      _r[v] = U | 0, Pr[v] = L | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: E, Gh: A, Gl: B, Hh: K, Hl: V } = this;
    for (let v = 0; v < 80; v++) {
      const _ = St.rotrSH(l, g, 14) ^ St.rotrSH(l, g, 18) ^ St.rotrBH(l, g, 41), T = St.rotrSL(l, g, 14) ^ St.rotrSL(l, g, 18) ^ St.rotrBL(l, g, 41), S = l & p ^ ~l & A, N = g & E ^ ~g & B, P = St.add5L(V, T, N, I1[v], Pr[v]), M = St.add5H(P, K, _, S, k1[v], _r[v]), x = P | 0, b = St.rotrSH(r, i, 28) ^ St.rotrBH(r, i, 34) ^ St.rotrBH(r, i, 39), L = St.rotrSL(r, i, 28) ^ St.rotrBL(r, i, 34) ^ St.rotrBL(r, i, 39), U = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      K = A | 0, V = B | 0, A = p | 0, B = E | 0, p = l | 0, E = g | 0, { h: l, l: g } = St.add(u | 0, d | 0, M | 0, x | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const D = St.add3L(x, L, J);
      r = St.add3H(D, M, b, U), i = D | 0;
    }
    ({ h: r, l: i } = St.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = St.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = St.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = St.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = St.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: E } = St.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: A, l: B } = St.add(this.Gh | 0, this.Gl | 0, A | 0, B | 0), { h: K, l: V } = St.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, E, A, B, K, V);
  }
  roundClean() {
    _r.fill(0), Pr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, L1 = class extends rc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, C1 = class extends rc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, T1 = class extends rc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const B1 = Xs(() => new rc());
Xs(() => new L1());
Xs(() => new C1());
Xs(() => new T1());
function z0(t) {
  return Ii(t);
}
function M1(t) {
  return B1(t);
}
const N1 = 0;
we.hmacSha256Sync = (t, ...e) => {
  const n = ec.create(Ii, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function _1() {
  return ft(we.randomPrivateKey());
}
function P1(t) {
  const e = Ii(Ii(t));
  return Xb.encode(tr(t, e).slice(0, t.length + 4));
}
function U1(t, e) {
  return P1(tr(new Uint8Array([t]), e.slice(0, 20)));
}
function R0(t, e = N1) {
  const n = typeof t == "string" ? Dt(t) : t, r = s1(z0(n));
  return U1(e, r);
}
function G0(t) {
  const e = pu(t);
  return ft(Lo(e.slice(0, 32), !0));
}
we.hmacSha256Sync = (t, ...e) => {
  const n = ec.create(Ii, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ta;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ta || (Ta = {}));
async function H1(t, e, n) {
  return await (await H0()).encrypt("aes-256-cbc", e, t, n);
}
async function O1(t, e, n) {
  return await (await H0()).decrypt("aes-256-cbc", e, t, n);
}
function K0(t, e) {
  return ec(Ii, t, e);
}
function D1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function V0(t) {
  const e = M1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function F1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function j1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ta.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ta.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !F1(t))
    return e;
  try {
    return Lt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function z1(t, e, n, r) {
  const i = j1(t);
  if (!i.result)
    throw i;
  const s = we.randomPrivateKey(), o = Lo(s, !0);
  let a = xu(s, t, !0);
  a = a.slice(1);
  const c = V0(a), u = we.randomBytes(16), d = await H1(u, c.encryptionKey, e), l = tr(u, o, d), g = K0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = ft(d);
  else if (r === "base64")
    p = Bb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const E = {
    iv: ft(u),
    ephemeralPK: ft(o),
    cipherText: p,
    mac: ft(g),
    wasString: n
  };
  return r && r !== "hex" && (E.cipherTextEncoding = r), E;
}
async function q0(t, e) {
  if (!e.ephemeralPK)
    throw new Pf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = xu(t, n, !0);
  r = r.slice(1);
  const i = V0(r), s = Dt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Dt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Tb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = tr(s, Dt(n), o), c = K0(i.hmacKey, a), u = Dt(e.mac);
  if (!D1(u, c))
    throw new Pf("Decryption failed: failure in MAC check");
  const d = await O1(s, i.encryptionKey, o);
  return e.wasString ? Io(d) : d;
}
function R1(t, e) {
  const n = typeof e == "string" ? Ws(e) : e, r = G0(t), i = z0(n), s = nc(i, t);
  return {
    signature: ft(s),
    publicKey: r
  };
}
async function G1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = G0(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? Ws(t) : t, o = await z1(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = R1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function K1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return q0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var De = {}, Mi = {}, We = {};
Object.defineProperty(We, "__esModule", { value: !0 });
We.decode = We.encode = We.unescape = We.escape = We.pad = void 0;
const W0 = Co;
function Au(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
We.pad = Au;
function X0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
We.escape = X0;
function Y0(t) {
  return Au(t).replace(/-/g, "+").replace(/_/g, "/");
}
We.unescape = Y0;
function V1(t) {
  return X0((0, W0.fromByteArray)(new TextEncoder().encode(t)));
}
We.encode = V1;
function q1(t) {
  return new TextDecoder().decode((0, W0.toByteArray)(Au(Y0(t))));
}
We.decode = q1;
var sc = {}, ic = {}, Z0 = {}, Q0 = {}, oc = {};
Object.defineProperty(oc, "__esModule", { value: !0 });
oc.crypto = void 0;
oc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = g, t.rotl = p, t.byteSwap = E, t.byteSwap32 = A, t.bytesToHex = V, t.hexToBytes = T, t.asyncLoop = N, t.utf8ToBytes = P, t.bytesToUtf8 = M, t.toBytes = x, t.kdfInputToBytes = b, t.concatBytes = L, t.checkOpts = U, t.createHasher = D, t.createOptHasher = yt, t.createXOFer = dt, t.randomBytes = at;
  const e = oc;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function i(I, ...F) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(I.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + I.length);
  }
  function s(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function o(I, F = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, F) {
    i(I);
    const rt = F.outputLen;
    if (I.length < rt)
      throw new Error("digestInto() expects output buffer of length at least " + rt);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function d(...I) {
    for (let F = 0; F < I.length; F++)
      I[F].fill(0);
  }
  function l(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function g(I, F) {
    return I << 32 - F | I >>> F;
  }
  function p(I, F) {
    return I << F | I >>> 32 - F >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function E(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (I) => I : (I) => E(I), t.byteSwapIfBE = t.swap8IfBE;
  function A(I) {
    for (let F = 0; F < I.length; F++)
      I[F] = E(I[F]);
    return I;
  }
  t.swap32IfBE = t.isLE ? (I) => I : A;
  const B = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", K = /* @__PURE__ */ Array.from({ length: 256 }, (I, F) => F.toString(16).padStart(2, "0"));
  function V(I) {
    if (i(I), B)
      return I.toHex();
    let F = "";
    for (let rt = 0; rt < I.length; rt++)
      F += K[I[rt]];
    return F;
  }
  const v = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function _(I) {
    if (I >= v._0 && I <= v._9)
      return I - v._0;
    if (I >= v.A && I <= v.F)
      return I - (v.A - 10);
    if (I >= v.a && I <= v.f)
      return I - (v.a - 10);
  }
  function T(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (B)
      return Uint8Array.fromHex(I);
    const F = I.length, rt = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const Ct = new Uint8Array(rt);
    for (let kt = 0, Ft = 0; kt < rt; kt++, Ft += 2) {
      const Ne = _(I.charCodeAt(Ft)), Qt = _(I.charCodeAt(Ft + 1));
      if (Ne === void 0 || Qt === void 0) {
        const Wt = I[Ft] + I[Ft + 1];
        throw new Error('hex string expected, got non-hex character "' + Wt + '" at index ' + Ft);
      }
      Ct[kt] = Ne * 16 + Qt;
    }
    return Ct;
  }
  const S = async () => {
  };
  t.nextTick = S;
  async function N(I, F, rt) {
    let Ct = Date.now();
    for (let kt = 0; kt < I; kt++) {
      rt(kt);
      const Ft = Date.now() - Ct;
      Ft >= 0 && Ft < F || (await (0, t.nextTick)(), Ct += Ft);
    }
  }
  function P(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function M(I) {
    return new TextDecoder().decode(I);
  }
  function x(I) {
    return typeof I == "string" && (I = P(I)), i(I), I;
  }
  function b(I) {
    return typeof I == "string" && (I = P(I)), i(I), I;
  }
  function L(...I) {
    let F = 0;
    for (let Ct = 0; Ct < I.length; Ct++) {
      const kt = I[Ct];
      i(kt), F += kt.length;
    }
    const rt = new Uint8Array(F);
    for (let Ct = 0, kt = 0; Ct < I.length; Ct++) {
      const Ft = I[Ct];
      rt.set(Ft, kt), kt += Ft.length;
    }
    return rt;
  }
  function U(I, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, F);
  }
  class J {
  }
  t.Hash = J;
  function D(I) {
    const F = (Ct) => I().update(x(Ct)).digest(), rt = I();
    return F.outputLen = rt.outputLen, F.blockLen = rt.blockLen, F.create = () => I(), F;
  }
  function yt(I) {
    const F = (Ct, kt) => I(kt).update(x(Ct)).digest(), rt = I({});
    return F.outputLen = rt.outputLen, F.blockLen = rt.blockLen, F.create = (Ct) => I(Ct), F;
  }
  function dt(I) {
    const F = (Ct, kt) => I(kt).update(x(Ct)).digest(), rt = I({});
    return F.outputLen = rt.outputLen, F.blockLen = rt.blockLen, F.create = (Ct) => I(Ct), F;
  }
  t.wrapConstructor = D, t.wrapConstructorWithOpts = yt, t.wrapXOFConstructorWithOpts = dt;
  function at(I = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(I));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Q0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Q0;
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
})(Z0);
const hi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function J0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ys(t, ...e) {
  if (!J0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function W1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  pl(t.outputLen), pl(t.blockLen);
}
function gl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function tp(t, e) {
  Ys(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function X1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Y1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ba(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function wa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Tn(t, e) {
  return t << 32 - e | t >>> e;
}
function Z1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const vu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function $u(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const ep = vu ? (t) => t : (t) => $u(t), Q1 = ep;
function np(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = $u(t[e]);
  return t;
}
const J1 = vu ? (t) => t : np, rp = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", tm = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function sp(t) {
  if (Ys(t), rp)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += tm[t[n]];
  return e;
}
const dr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Wf(t) {
  if (t >= dr._0 && t <= dr._9)
    return t - dr._0;
  if (t >= dr.A && t <= dr.F)
    return t - (dr.A - 10);
  if (t >= dr.a && t <= dr.f)
    return t - (dr.a - 10);
}
function em(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (rp)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = Wf(t.charCodeAt(s)), a = Wf(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const ip = async () => {
};
async function nm(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await ip(), r += s);
  }
}
function ku(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function rm(t) {
  return new TextDecoder().decode(t);
}
function To(t) {
  return typeof t == "string" && (t = ku(t)), Ys(t), t;
}
function sm(t) {
  return typeof t == "string" && (t = ku(t)), Ys(t), t;
}
function im(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    Ys(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function om(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let op = class {
};
function ac(t) {
  const e = (r) => t().update(To(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ap(t) {
  const e = (r, i) => t(i).update(To(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function cp(t) {
  const e = (r, i) => t(i).update(To(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const am = ac, cm = ap, lm = cp;
function um(t = 32) {
  if (hi && typeof hi.getRandomValues == "function")
    return hi.getRandomValues(new Uint8Array(t));
  if (hi && typeof hi.randomBytes == "function")
    return Uint8Array.from(hi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: op,
  abytes: Ys,
  aexists: gl,
  ahash: W1,
  anumber: pl,
  aoutput: tp,
  asyncLoop: nm,
  byteSwap: $u,
  byteSwap32: np,
  byteSwapIfBE: Q1,
  bytesToHex: sp,
  bytesToUtf8: rm,
  checkOpts: om,
  clean: Ba,
  concatBytes: im,
  createHasher: ac,
  createOptHasher: ap,
  createView: wa,
  createXOFer: cp,
  hexToBytes: em,
  isBytes: J0,
  isLE: vu,
  kdfInputToBytes: sm,
  nextTick: ip,
  randomBytes: um,
  rotl: Z1,
  rotr: Tn,
  swap32IfBE: J1,
  swap8IfBE: ep,
  toBytes: To,
  u32: Y1,
  u8: X1,
  utf8ToBytes: ku,
  wrapConstructor: am,
  wrapConstructorWithOpts: cm,
  wrapXOFConstructorWithOpts: lm
}, Symbol.toStringTag, { value: "Module" }));
function dm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function hm(t, e, n) {
  return t & e ^ ~t & n;
}
function pm(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class gm extends op {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = wa(this.buffer);
  }
  update(e) {
    gl(this), e = To(e), Ys(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = wa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    gl(this), tp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, Ba(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    dm(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = wa(e), c = this.outputLen;
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
const Ur = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Hr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), ym = /* @__PURE__ */ Uint32Array.from([
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
]), Or = /* @__PURE__ */ new Uint32Array(64);
let Iu = class extends gm {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Ur[0] | 0, this.B = Ur[1] | 0, this.C = Ur[2] | 0, this.D = Ur[3] | 0, this.E = Ur[4] | 0, this.F = Ur[5] | 0, this.G = Ur[6] | 0, this.H = Ur[7] | 0;
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
      Or[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Or[l - 15], p = Or[l - 2], E = Tn(g, 7) ^ Tn(g, 18) ^ g >>> 3, A = Tn(p, 17) ^ Tn(p, 19) ^ p >>> 10;
      Or[l] = A + Or[l - 7] + E + Or[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Tn(a, 6) ^ Tn(a, 11) ^ Tn(a, 25), p = d + g + hm(a, c, u) + ym[l] + Or[l] | 0, A = (Tn(r, 2) ^ Tn(r, 13) ^ Tn(r, 22)) + pm(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Ba(Or);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ba(this.buffer);
  }
}, lp = class extends Iu {
  constructor() {
    super(28), this.A = Hr[0] | 0, this.B = Hr[1] | 0, this.C = Hr[2] | 0, this.D = Hr[3] | 0, this.E = Hr[4] | 0, this.F = Hr[5] | 0, this.G = Hr[6] | 0, this.H = Hr[7] | 0;
  }
};
const wm = /* @__PURE__ */ ac(() => new Iu()), bm = /* @__PURE__ */ ac(() => new lp()), mm = Iu, up = wm, xm = lp, Sm = bm, Em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: xm,
  SHA256: mm,
  sha224: Sm,
  sha256: up
}, Symbol.toStringTag, { value: "Module" })), cc = /* @__PURE__ */ Ja(Em), Am = /* @__PURE__ */ Ja(Cb);
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.joseToDer = Ni.derToJose = void 0;
const fp = Co, dp = We;
function Uc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const vm = {
  ES256: Uc(256),
  ES384: Uc(384),
  ES512: Uc(521)
};
function hp(t) {
  const e = vm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ma = 128, pp = 0, $m = 32, km = 16, Im = 2, gp = km | $m | pp << 6, Na = Im | pp << 6;
function yp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, fp.toByteArray)((0, dp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Lm(t, e) {
  const n = yp(t), r = hp(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== gp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Ma | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Na)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Na)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (s - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${s - o}"`);
  if (i < d)
    throw new Error(`"s" specified length of "${d}", max of "${i}" is acceptable`);
  const l = o;
  if (o += d, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const g = r - c, p = r - d, E = new Uint8Array(g + c + p + d);
  for (o = 0; o < g; ++o)
    E[o] = 0;
  E.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const A = o; o < A + p; ++o)
    E[o] = 0;
  return E.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, dp.escape)((0, fp.fromByteArray)(E));
}
Ni.derToJose = Lm;
function Xf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ma && --r, r;
}
function Cm(t, e) {
  t = yp(t);
  const n = hp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = Xf(t, 0, n), s = Xf(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < Ma, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = gp, u ? d[l++] = c : (d[l++] = Ma | 1, d[l++] = c & 255), d[l++] = Na, d[l++] = o, i < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(i, n), l), l += n - i), d[l++] = Na, d[l++] = a, s < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + s), l), d;
}
Ni.joseToDer = Cm;
var xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.InvalidTokenError = xr.MissingParametersError = void 0;
class Tm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
xr.MissingParametersError = Tm;
class Bm extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
xr.InvalidTokenError = Bm;
const Bo = /* @__PURE__ */ Ja(fm);
Object.defineProperty(ic, "__esModule", { value: !0 });
ic.SECP256K1Client = void 0;
const Mm = Z0, Nm = cc, ba = Am, Yf = Ni, Zf = xr, Qf = Bo;
ba.utils.hmacSha256Sync = (t, ...e) => {
  const n = Mm.hmac.create(Nm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class wp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Qf.bytesToHex)(ba.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Zf.MissingParametersError("a signing input hash and private key are all required");
    const i = ba.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Qf.bytesToHex)(i);
    if (r === "jose")
      return (0, Yf.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Yf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Zf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ba.verify(n, e, r, { strict: !1 });
  }
}
ic.SECP256K1Client = wp;
wp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ic;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(sc);
var Ns = {};
const _m = /* @__PURE__ */ Ja(E0);
var Pm = Ye && Ye.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Ns, "__esModule", { value: !0 });
Ns.hashSha256Async = Ns.hashSha256 = void 0;
const Um = cc;
function bp(t) {
  return (0, Um.sha256)(t);
}
Ns.hashSha256 = bp;
function Hm(t) {
  return Pm(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = _m;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(bp(t));
    }
  });
}
Ns.hashSha256Async = Hm;
var Om = Ye && Ye.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.TokenSigner = Mi.createUnsecuredToken = void 0;
const yl = We, Jf = sc, Dm = xr, td = Ns;
function wl(t, e) {
  const n = [], r = yl.encode(JSON.stringify(e));
  n.push(r);
  const i = yl.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function Fm(t) {
  return wl(t, { typ: "JWT", alg: "none" }) + ".";
}
Mi.createUnsecuredToken = Fm;
class jm {
  constructor(e, n) {
    if (!(e && n))
      throw new Dm.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Jf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Jf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = wl(e, i), o = (0, td.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Om(this, void 0, void 0, function* () {
      const i = this.header(r), s = wl(e, i), o = yield (0, td.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [yl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
Mi.TokenSigner = jm;
var lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.TokenVerifier = void 0;
const zm = We, ed = sc, Rm = xr, Vo = Ns;
class Gm {
  constructor(e, n) {
    if (!(e && n))
      throw new Rm.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !ed.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = ed.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Vo.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Vo.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), zm.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Vo.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Vo.hashSha256)(r);
      return s(o);
    }
  }
}
lc.TokenVerifier = Gm;
var uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
uc.decodeToken = void 0;
const qo = We;
function Km(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(qo.decode(e[0])), r = JSON.parse(qo.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = qo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(qo.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
uc.decodeToken = Km;
(function(t) {
  var e = Ye && Ye.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = Ye && Ye.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Mi, t), n(lc, t), n(uc, t), n(xr, t), n(sc, t);
})(De);
function Vm(t) {
  return `did:btc-addr:${t}`;
}
function qm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new _f("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new _f('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function mp(t) {
  if (t)
    return qm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Wm = "1.4.0";
function Xm() {
  return _1();
}
function Ym(t, e, n, r = d0.slice(), i, s = Bw().getTime(), o = {}) {
  const a = (p) => {
    const E = du("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return E == null ? void 0 : E.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Nw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: Wm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = De.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = R0(u);
  return c.iss = Vm(d), new De.TokenSigner("ES256k", t).sign(c);
}
async function nd(t, e) {
  const n = Io(Dt(e)), r = JSON.parse(n), i = await q0(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function Zm(t) {
  const e = De.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new De.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Qm(t) {
  const e = De.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = mp(e.iss);
  if (n.length === 1) {
    if (R0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Jm(t) {
  const e = De.decodeToken(t).payload;
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
function t2(t) {
  const e = De.decodeToken(t).payload;
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
function e2(t) {
  const e = [
    t2(t),
    Jm(t),
    Zm(t),
    Qm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const rd = "1.0.0";
class as {
  constructor(e) {
    this.version = rd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== rd)
      throw new cl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new as(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class xp {
  constructor(e) {
    if (e) {
      const n = new as(e);
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
class sd extends xp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new as({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new h0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new as({})), !0;
  }
}
class id extends xp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Lw, !localStorage.getItem(this.key)) {
      const r = new as({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new h0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return as.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new as({})), !0;
  }
}
var po;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(po || (po = {}));
var _a;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_a || (_a = {}));
po.Mainnet;
var br;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(br || (br = {}));
var Yn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yn || (Yn = {}));
br.Mainnet;
const Sp = {
  chainId: po.Mainnet,
  transactionVersion: br.Mainnet,
  peerNetworkId: _a.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Yn.MainnetSingleSig,
    multiSig: Yn.MainnetMultiSig
  },
  client: { baseUrl: p0 }
}, bl = {
  chainId: po.Testnet,
  transactionVersion: br.Testnet,
  peerNetworkId: _a.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Yn.TestnetSingleSig,
    multiSig: Yn.TestnetMultiSig
  },
  client: { baseUrl: g0 }
}, ma = {
  ...bl,
  addressVersion: { ...bl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: y0 }
}, n2 = {
  ...ma,
  addressVersion: { ...ma.addressVersion },
  client: { ...ma.client }
};
function r2(t) {
  switch (t) {
    case "mainnet":
      return Sp;
    case "testnet":
      return bl;
    case "devnet":
      return ma;
    case "mocknet":
      return n2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Ep(t) {
  return typeof t == "string" ? r2(t) : t;
}
var od;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(od || (od = {}));
var ad;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ad || (ad = {}));
var Bn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Bn || (Bn = {}));
const Hc = ["onChainOnly", "offChainOnly", "any"];
Hc[0] + "", Bn.OnChainOnly, Hc[1] + "", Bn.OffChainOnly, Hc[2] + "", Bn.Any, Bn.OnChainOnly + "", Bn.OnChainOnly, Bn.OffChainOnly + "", Bn.OffChainOnly, Bn.Any + "", Bn.Any;
var cd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ud || (ud = {}));
var wr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(wr || (wr = {}));
var fd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(bd || (bd = {}));
var md;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(md || (md = {}));
function ml(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function s2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ap(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function i2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ml(t.outputLen), ml(t.blockLen);
}
function o2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function a2(t, e) {
  Ap(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ms = {
  number: ml,
  bool: s2,
  bytes: Ap,
  hash: i2,
  exists: o2,
  output: a2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), zn = (t, e) => t << 32 - e | t >>> e, c2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!c2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function l2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Lu(t) {
  if (typeof t == "string" && (t = l2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let vp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Zs(t) {
  const e = (r) => t().update(Lu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let $p = class extends vp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ms.hash(e);
    const r = Lu(n);
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
    return ms.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ms.exists(this), ms.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const kp = (t, e, n) => new $p(t, e).update(n).digest();
kp.create = (t, e) => new $p(t, e);
function u2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Cu = class extends vp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oc(this.buffer);
  }
  update(e) {
    ms.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Lu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Oc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ms.exists(this), ms.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    u2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Oc(e), c = this.outputLen;
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
const f2 = (t, e, n) => t & e ^ ~t & n, d2 = (t, e, n) => t & e ^ t & n ^ e & n, h2 = new Uint32Array([
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
]), Dr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Fr = new Uint32Array(64);
let Ip = class extends Cu {
  constructor() {
    super(64, 32, 8, !1), this.A = Dr[0] | 0, this.B = Dr[1] | 0, this.C = Dr[2] | 0, this.D = Dr[3] | 0, this.E = Dr[4] | 0, this.F = Dr[5] | 0, this.G = Dr[6] | 0, this.H = Dr[7] | 0;
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
      Fr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Fr[l - 15], p = Fr[l - 2], E = zn(g, 7) ^ zn(g, 18) ^ g >>> 3, A = zn(p, 17) ^ zn(p, 19) ^ p >>> 10;
      Fr[l] = A + Fr[l - 7] + E + Fr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = zn(a, 6) ^ zn(a, 11) ^ zn(a, 25), p = d + g + f2(a, c, u) + h2[l] + Fr[l] | 0, A = (zn(r, 2) ^ zn(r, 13) ^ zn(r, 22)) + d2(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Fr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, p2 = class extends Ip {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Lp = Zs(() => new Ip());
Zs(() => new p2());
var Qs = {}, Tu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Bo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const E = n.indexOf(o[p]) >> u;
        let A = 0;
        p !== 0 && (A = n.indexOf(o[p - 1]));
        const B = 1 + u, K = A % (1 << B) << 5 - B, V = t.c32[E + K];
        u = B, c.unshift(V);
      } else
        u = 0;
    let d = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let p = 0; p < g; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let E = 0; E < p; E++)
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
    let d = [], l = 0, g = 0;
    for (let A = o.length - 1; A >= 0; A--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const K = (t.c32.indexOf(o[A]) << g) + l, V = n[K % 16];
      if (g += 1, l = K >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(V);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let A = 0; A < d.length && d[A] === "0"; A++)
      p++;
    d = d.slice(p - p % 2);
    let E = d.join("");
    for (let A = 0; A < u; A++)
      E = `00${E}`;
    if (a) {
      const A = a * 2 - E.length;
      for (let B = 0; B < A; B += 2)
        E = `00${E}`;
    }
    return E;
  }
  t.c32decode = s;
})(Tu);
var _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.c32checkDecode = _s.c32checkEncode = void 0;
const xd = cc, Sd = Bo, co = Tu;
function Cp(t) {
  const e = (0, xd.sha256)((0, xd.sha256)((0, Sd.hexToBytes)(t)));
  return (0, Sd.bytesToHex)(e.slice(0, 4));
}
function g2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Cp(`${n}${e}`), i = (0, co.c32encode)(`${e}${r}`);
  return `${co.c32[t]}${i}`;
}
_s.c32checkEncode = g2;
function y2(t) {
  t = (0, co.c32normalize)(t);
  const e = (0, co.c32decode)(t.slice(1)), n = t[0], r = co.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Cp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
_s.c32checkDecode = y2;
var Tp = {}, _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.decode = _i.encode = void 0;
const Pa = cc, Ed = Bo, Bp = O0, Mp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function w2(t, e = "00") {
  const n = typeof t == "string" ? (0, Ed.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ed.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Pa.sha256)((0, Pa.sha256)(new Uint8Array([...r, ...n])));
  return Bp(Mp).encode([...r, ...n, ...i.slice(0, 4)]);
}
_i.encode = w2;
function b2(t) {
  const e = Bp(Mp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Pa.sha256)((0, Pa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
_i.decode = b2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = _s, n = _i, r = Bo;
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
    const g = n.decode(d), p = (0, r.bytesToHex)(g.data), E = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let A;
    return l < 0 ? (A = E, i[E] !== void 0 && (A = i[E])) : A = l, o(A, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const g = a(d), p = g[0], E = g[1];
    let A;
    l < 0 ? (A = p, s[p] !== void 0 && (A = s[p])) : A = l;
    let B = A.toString(16);
    return B.length === 1 && (B = `0${B}`), n.encode(E, B);
  }
  t.c32ToB58 = u;
})(Tp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Tu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = _s;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Tp;
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
})(Qs);
function m2(t, e) {
  switch (e = Ep(e ?? Sp), t) {
    case wr.P2PKH:
      switch (e.transactionVersion) {
        case br.Mainnet:
          return Yn.MainnetSingleSig;
        case br.Testnet:
          return Yn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case wr.P2SH:
    case wr.P2SHNonSequential:
    case wr.P2WPKH:
    case wr.P2WSH:
    case wr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case br.Mainnet:
          return Yn.MainnetMultiSig;
        case br.Testnet:
          return Yn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const x2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Np = Uint8Array.from({ length: 16 }, (t, e) => e), S2 = Np.map((t) => (9 * t + 5) % 16);
let Bu = [Np], Mu = [S2];
for (let t = 0; t < 4; t++)
  for (let e of [Bu, Mu])
    e.push(e[t].map((n) => x2[n]));
const _p = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), E2 = Bu.map((t, e) => t.map((n) => _p[e][n])), A2 = Mu.map((t, e) => t.map((n) => _p[e][n])), v2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wo = (t, e) => t << e | t >>> 32 - e;
function Ad(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xo = new Uint32Array(16);
let k2 = class extends Cu {
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
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, A = v2[p], B = $2[p], K = Bu[p], V = Mu[p], v = E2[p], _ = A2[p];
      for (let T = 0; T < 16; T++) {
        const S = Wo(r + Ad(p, s, a, u) + Xo[K[T]] + A, v[T]) + l | 0;
        r = l, l = u, u = Wo(a, 10) | 0, a = s, s = S;
      }
      for (let T = 0; T < 16; T++) {
        const S = Wo(i + Ad(E, o, c, d) + Xo[V[T]] + B, _[T]) + g | 0;
        i = g, g = d, d = Wo(c, 10) | 0, c = o, o = S;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Xo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const I2 = Zs(() => new k2()), Yo = BigInt(2 ** 32 - 1), xl = BigInt(32);
function Pp(t, e = !1) {
  return e ? { h: Number(t & Yo), l: Number(t >> xl & Yo) } : { h: Number(t >> xl & Yo) | 0, l: Number(t & Yo) | 0 };
}
function L2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Pp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const C2 = (t, e) => BigInt(t >>> 0) << xl | BigInt(e >>> 0), T2 = (t, e, n) => t >>> n, B2 = (t, e, n) => t << 32 - n | e >>> n, M2 = (t, e, n) => t >>> n | e << 32 - n, N2 = (t, e, n) => t << 32 - n | e >>> n, _2 = (t, e, n) => t << 64 - n | e >>> n - 32, P2 = (t, e, n) => t >>> n - 32 | e << 64 - n, U2 = (t, e) => e, H2 = (t, e) => t, O2 = (t, e, n) => t << n | e >>> 32 - n, D2 = (t, e, n) => e << n | t >>> 32 - n, F2 = (t, e, n) => e << n - 32 | t >>> 64 - n, j2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function z2(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const R2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), G2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, K2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), V2 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, q2 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), W2 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: Pp,
  split: L2,
  toBig: C2,
  shrSH: T2,
  shrSL: B2,
  rotrSH: M2,
  rotrSL: N2,
  rotrBH: _2,
  rotrBL: P2,
  rotr32H: U2,
  rotr32L: H2,
  rotlSH: O2,
  rotlSL: D2,
  rotlBH: F2,
  rotlBL: j2,
  add: z2,
  add3L: R2,
  add3H: G2,
  add4L: K2,
  add4H: V2,
  add5H: W2,
  add5L: q2
}, [X2, Y2] = Et.split([
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
].map((t) => BigInt(t))), jr = new Uint32Array(80), zr = new Uint32Array(80);
let fc = class extends Cu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: E, Hh: A, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = A | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      jr[v] = e.getUint32(n), zr[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const _ = jr[v - 15] | 0, T = zr[v - 15] | 0, S = Et.rotrSH(_, T, 1) ^ Et.rotrSH(_, T, 8) ^ Et.shrSH(_, T, 7), N = Et.rotrSL(_, T, 1) ^ Et.rotrSL(_, T, 8) ^ Et.shrSL(_, T, 7), P = jr[v - 2] | 0, M = zr[v - 2] | 0, x = Et.rotrSH(P, M, 19) ^ Et.rotrBH(P, M, 61) ^ Et.shrSH(P, M, 6), b = Et.rotrSL(P, M, 19) ^ Et.rotrBL(P, M, 61) ^ Et.shrSL(P, M, 6), L = Et.add4L(N, b, zr[v - 7], zr[v - 16]), U = Et.add4H(L, S, x, jr[v - 7], jr[v - 16]);
      jr[v] = U | 0, zr[v] = L | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: E, Gh: A, Gl: B, Hh: K, Hl: V } = this;
    for (let v = 0; v < 80; v++) {
      const _ = Et.rotrSH(l, g, 14) ^ Et.rotrSH(l, g, 18) ^ Et.rotrBH(l, g, 41), T = Et.rotrSL(l, g, 14) ^ Et.rotrSL(l, g, 18) ^ Et.rotrBL(l, g, 41), S = l & p ^ ~l & A, N = g & E ^ ~g & B, P = Et.add5L(V, T, N, Y2[v], zr[v]), M = Et.add5H(P, K, _, S, X2[v], jr[v]), x = P | 0, b = Et.rotrSH(r, i, 28) ^ Et.rotrBH(r, i, 34) ^ Et.rotrBH(r, i, 39), L = Et.rotrSL(r, i, 28) ^ Et.rotrBL(r, i, 34) ^ Et.rotrBL(r, i, 39), U = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      K = A | 0, V = B | 0, A = p | 0, B = E | 0, p = l | 0, E = g | 0, { h: l, l: g } = Et.add(u | 0, d | 0, M | 0, x | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const D = Et.add3L(x, L, J);
      r = Et.add3H(D, M, b, U), i = D | 0;
    }
    ({ h: r, l: i } = Et.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Et.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Et.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: E } = Et.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: A, l: B } = Et.add(this.Gh | 0, this.Gl | 0, A | 0, B | 0), { h: K, l: V } = Et.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, E, A, B, K, V);
  }
  roundClean() {
    jr.fill(0), zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Z2 = class extends fc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Q2 = class extends fc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, J2 = class extends fc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Zs(() => new fc());
Zs(() => new Z2());
Zs(() => new Q2());
Zs(() => new J2());
var Ua = { exports: {} };
Ua.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", p = "[object Number]", E = "[object Object]", A = "[object Promise]", B = "[object RegExp]", K = "[object Set]", V = "[object String]", v = "[object Symbol]", _ = "[object WeakMap]", T = "[object ArrayBuffer]", S = "[object DataView]", N = "[object Float32Array]", P = "[object Float64Array]", M = "[object Int8Array]", x = "[object Int16Array]", b = "[object Int32Array]", L = "[object Uint8Array]", U = "[object Uint8ClampedArray]", J = "[object Uint16Array]", D = "[object Uint32Array]", yt = /[\\^$.*+?()[\]{}|]/g, dt = /\w*$/, at = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, F = {};
  F[s] = F[o] = F[T] = F[S] = F[a] = F[c] = F[N] = F[P] = F[M] = F[x] = F[b] = F[g] = F[p] = F[E] = F[B] = F[K] = F[V] = F[v] = F[L] = F[U] = F[J] = F[D] = !0, F[u] = F[d] = F[_] = !1;
  var rt = typeof Ye == "object" && Ye && Ye.Object === Object && Ye, Ct = typeof self == "object" && self && self.Object === Object && self, kt = rt || Ct || Function("return this")(), Ft = e && !e.nodeType && e, Ne = Ft && !0 && t && !t.nodeType && t, Qt = Ne && Ne.exports === Ft;
  function Wt(y, C) {
    return y.set(C[0], C[1]), y;
  }
  function ce(y, C) {
    return y.add(C), y;
  }
  function Re(y, C) {
    for (var O = -1, ct = y ? y.length : 0; ++O < ct && C(y[O], O, y) !== !1; )
      ;
    return y;
  }
  function Ut(y, C) {
    for (var O = -1, ct = C.length, He = y.length; ++O < ct; )
      y[He + O] = C[O];
    return y;
  }
  function an(y, C, O, ct) {
    for (var He = -1, tn = y ? y.length : 0; ++He < tn; )
      O = C(O, y[He], He, y);
    return O;
  }
  function be(y, C) {
    for (var O = -1, ct = Array(y); ++O < y; )
      ct[O] = C(O);
    return ct;
  }
  function le(y, C) {
    return y == null ? void 0 : y[C];
  }
  function On(y) {
    var C = !1;
    if (y != null && typeof y.toString != "function")
      try {
        C = !!(y + "");
      } catch {
      }
    return C;
  }
  function Ae(y) {
    var C = -1, O = Array(y.size);
    return y.forEach(function(ct, He) {
      O[++C] = [He, ct];
    }), O;
  }
  function Le(y, C) {
    return function(O) {
      return y(C(O));
    };
  }
  function re(y) {
    var C = -1, O = Array(y.size);
    return y.forEach(function(ct) {
      O[++C] = ct;
    }), O;
  }
  var ne = Array.prototype, Yt = Function.prototype, Ce = Object.prototype, ve = kt["__core-js_shared__"], Ge = function() {
    var y = /[^.]+$/.exec(ve && ve.keys && ve.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), Ln = Yt.toString, Gt = Ce.hasOwnProperty, cn = Ce.toString, ir = RegExp(
    "^" + Ln.call(Gt).replace(yt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), $ = Qt ? kt.Buffer : void 0, j = kt.Symbol, z = kt.Uint8Array, R = Le(Object.getPrototypeOf, Object), et = Object.create, bt = Ce.propertyIsEnumerable, se = ne.splice, Xt = Object.getOwnPropertySymbols, jt = $ ? $.isBuffer : void 0, Mt = Le(Object.keys, Object), h = ut(kt, "DataView"), m = ut(kt, "Map"), f = ut(kt, "Promise"), H = ut(kt, "Set"), st = ut(kt, "WeakMap"), ot = ut(Object, "create"), Ht = ps(h), Tt = ps(m), Nt = ps(f), Ot = ps(H), mt = ps(st), ue = j ? j.prototype : void 0, $e = ue ? ue.valueOf : void 0;
  function _e(y) {
    var C = -1, O = y ? y.length : 0;
    for (this.clear(); ++C < O; ) {
      var ct = y[C];
      this.set(ct[0], ct[1]);
    }
  }
  function Te() {
    this.__data__ = ot ? ot(null) : {};
  }
  function Qe(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function bn(y) {
    var C = this.__data__;
    if (ot) {
      var O = C[y];
      return O === r ? void 0 : O;
    }
    return Gt.call(C, y) ? C[y] : void 0;
  }
  function ht(y) {
    var C = this.__data__;
    return ot ? C[y] !== void 0 : Gt.call(C, y);
  }
  function zt(y, C) {
    var O = this.__data__;
    return O[y] = ot && C === void 0 ? r : C, this;
  }
  _e.prototype.clear = Te, _e.prototype.delete = Qe, _e.prototype.get = bn, _e.prototype.has = ht, _e.prototype.set = zt;
  function Rt(y) {
    var C = -1, O = y ? y.length : 0;
    for (this.clear(); ++C < O; ) {
      var ct = y[C];
      this.set(ct[0], ct[1]);
    }
  }
  function mn() {
    this.__data__ = [];
  }
  function si(y) {
    var C = this.__data__, O = ar(C, y);
    if (O < 0)
      return !1;
    var ct = C.length - 1;
    return O == ct ? C.pop() : se.call(C, O, 1), !0;
  }
  function Yi(y) {
    var C = this.__data__, O = ar(C, y);
    return O < 0 ? void 0 : C[O][1];
  }
  function ii(y) {
    return ar(this.__data__, y) > -1;
  }
  function Ar(y, C) {
    var O = this.__data__, ct = ar(O, y);
    return ct < 0 ? O.push([y, C]) : O[ct][1] = C, this;
  }
  Rt.prototype.clear = mn, Rt.prototype.delete = si, Rt.prototype.get = Yi, Rt.prototype.has = ii, Rt.prototype.set = Ar;
  function Pe(y) {
    var C = -1, O = y ? y.length : 0;
    for (this.clear(); ++C < O; ) {
      var ct = y[C];
      this.set(ct[0], ct[1]);
    }
  }
  function oi() {
    this.__data__ = {
      hash: new _e(),
      map: new (m || Rt)(),
      string: new _e()
    };
  }
  function vr(y) {
    return W(this, y).delete(y);
  }
  function $r(y) {
    return W(this, y).get(y);
  }
  function Dn(y) {
    return W(this, y).has(y);
  }
  function Cn(y, C) {
    return W(this, y).set(y, C), this;
  }
  Pe.prototype.clear = oi, Pe.prototype.delete = vr, Pe.prototype.get = $r, Pe.prototype.has = Dn, Pe.prototype.set = Cn;
  function Je(y) {
    this.__data__ = new Rt(y);
  }
  function kr() {
    this.__data__ = new Rt();
  }
  function ds(y) {
    return this.__data__.delete(y);
  }
  function Ir(y) {
    return this.__data__.get(y);
  }
  function ai(y) {
    return this.__data__.has(y);
  }
  function Lr(y, C) {
    var O = this.__data__;
    if (O instanceof Rt) {
      var ct = O.__data__;
      if (!m || ct.length < n - 1)
        return ct.push([y, C]), this;
      O = this.__data__ = new Pe(ct);
    }
    return O.set(y, C), this;
  }
  Je.prototype.clear = kr, Je.prototype.delete = ds, Je.prototype.get = Ir, Je.prototype.has = ai, Je.prototype.set = Lr;
  function hs(y, C) {
    var O = Lc(y) || Wy(y) ? be(y.length, String) : [], ct = O.length, He = !!ct;
    for (var tn in y)
      Gt.call(y, tn) && !(He && (tn == "length" || Ke(tn, ct))) && O.push(tn);
    return O;
  }
  function or(y, C, O) {
    var ct = y[C];
    (!(Gt.call(y, C) && vf(ct, O)) || O === void 0 && !(C in y)) && (y[C] = O);
  }
  function ar(y, C) {
    for (var O = y.length; O--; )
      if (vf(y[O][0], C))
        return O;
    return -1;
  }
  function ci(y, C) {
    return y && G(C, Cc(C), y);
  }
  function cr(y, C, O, ct, He, tn, fr) {
    var en;
    if (ct && (en = tn ? ct(y, He, tn, fr) : ct(y)), en !== void 0)
      return en;
    if (!Uo(y))
      return y;
    var If = Lc(y);
    if (If) {
      if (en = Vt(y), !C)
        return k(y, en);
    } else {
      var fi = pt(y), Lf = fi == d || fi == l;
      if (Yy(y))
        return ur(y, C);
      if (fi == E || fi == s || Lf && !tn) {
        if (On(y))
          return tn ? y : {};
        if (en = Ue(Lf ? {} : y), !C)
          return Z(y, ci(en, y));
      } else {
        if (!F[fi])
          return tn ? y : {};
        en = xn(y, fi, cr, C);
      }
    }
    fr || (fr = new Je());
    var Cf = fr.get(y);
    if (Cf)
      return Cf;
    if (fr.set(y, en), !If)
      var Tf = O ? nt(y) : Cc(y);
    return Re(Tf || y, function(Tc, Ho) {
      Tf && (Ho = Tc, Tc = y[Ho]), or(en, Ho, cr(Tc, C, O, ct, Ho, y, fr));
    }), en;
  }
  function pe(y) {
    return Uo(y) ? et(y) : {};
  }
  function li(y, C, O) {
    var ct = C(y);
    return Lc(y) ? ct : Ut(ct, O(y));
  }
  function ui(y) {
    return cn.call(y);
  }
  function lr(y) {
    if (!Uo(y) || Po(y))
      return !1;
    var C = kf(y) || On(y) ? ir : at;
    return C.test(ps(y));
  }
  function Cr(y) {
    if (!Af(y))
      return Mt(y);
    var C = [];
    for (var O in Object(y))
      Gt.call(y, O) && O != "constructor" && C.push(O);
    return C;
  }
  function ur(y, C) {
    if (C)
      return y.slice();
    var O = new y.constructor(y.length);
    return y.copy(O), O;
  }
  function Tr(y) {
    var C = new y.constructor(y.byteLength);
    return new z(C).set(new z(y)), C;
  }
  function Br(y, C) {
    var O = C ? Tr(y.buffer) : y.buffer;
    return new y.constructor(O, y.byteOffset, y.byteLength);
  }
  function q(y, C, O) {
    var ct = C ? O(Ae(y), !0) : Ae(y);
    return an(ct, Wt, new y.constructor());
  }
  function it(y) {
    var C = new y.constructor(y.source, dt.exec(y));
    return C.lastIndex = y.lastIndex, C;
  }
  function fe(y, C, O) {
    var ct = C ? O(re(y), !0) : re(y);
    return an(ct, ce, new y.constructor());
  }
  function ke(y) {
    return $e ? Object($e.call(y)) : {};
  }
  function w(y, C) {
    var O = C ? Tr(y.buffer) : y.buffer;
    return new y.constructor(O, y.byteOffset, y.length);
  }
  function k(y, C) {
    var O = -1, ct = y.length;
    for (C || (C = Array(ct)); ++O < ct; )
      C[O] = y[O];
    return C;
  }
  function G(y, C, O, ct) {
    O || (O = {});
    for (var He = -1, tn = C.length; ++He < tn; ) {
      var fr = C[He], en = void 0;
      or(O, fr, en === void 0 ? y[fr] : en);
    }
    return O;
  }
  function Z(y, C) {
    return G(y, wt(y), C);
  }
  function nt(y) {
    return li(y, Cc, wt);
  }
  function W(y, C) {
    var O = y.__data__;
    return Fn(C) ? O[typeof C == "string" ? "string" : "hash"] : O.map;
  }
  function ut(y, C) {
    var O = le(y, C);
    return lr(O) ? O : void 0;
  }
  var wt = Xt ? Le(Xt, Object) : Jy, pt = ui;
  (h && pt(new h(new ArrayBuffer(1))) != S || m && pt(new m()) != g || f && pt(f.resolve()) != A || H && pt(new H()) != K || st && pt(new st()) != _) && (pt = function(y) {
    var C = cn.call(y), O = C == E ? y.constructor : void 0, ct = O ? ps(O) : void 0;
    if (ct)
      switch (ct) {
        case Ht:
          return S;
        case Tt:
          return g;
        case Nt:
          return A;
        case Ot:
          return K;
        case mt:
          return _;
      }
    return C;
  });
  function Vt(y) {
    var C = y.length, O = y.constructor(C);
    return C && typeof y[0] == "string" && Gt.call(y, "index") && (O.index = y.index, O.input = y.input), O;
  }
  function Ue(y) {
    return typeof y.constructor == "function" && !Af(y) ? pe(R(y)) : {};
  }
  function xn(y, C, O, ct) {
    var He = y.constructor;
    switch (C) {
      case T:
        return Tr(y);
      case a:
      case c:
        return new He(+y);
      case S:
        return Br(y, ct);
      case N:
      case P:
      case M:
      case x:
      case b:
      case L:
      case U:
      case J:
      case D:
        return w(y, ct);
      case g:
        return q(y, ct, O);
      case p:
      case V:
        return new He(y);
      case B:
        return it(y);
      case K:
        return fe(y, ct, O);
      case v:
        return ke(y);
    }
  }
  function Ke(y, C) {
    return C = C ?? i, !!C && (typeof y == "number" || I.test(y)) && y > -1 && y % 1 == 0 && y < C;
  }
  function Fn(y) {
    var C = typeof y;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? y !== "__proto__" : y === null;
  }
  function Po(y) {
    return !!Ge && Ge in y;
  }
  function Af(y) {
    var C = y && y.constructor, O = typeof C == "function" && C.prototype || Ce;
    return y === O;
  }
  function ps(y) {
    if (y != null) {
      try {
        return Ln.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function qy(y) {
    return cr(y, !0, !0);
  }
  function vf(y, C) {
    return y === C || y !== y && C !== C;
  }
  function Wy(y) {
    return Xy(y) && Gt.call(y, "callee") && (!bt.call(y, "callee") || cn.call(y) == s);
  }
  var Lc = Array.isArray;
  function $f(y) {
    return y != null && Zy(y.length) && !kf(y);
  }
  function Xy(y) {
    return Qy(y) && $f(y);
  }
  var Yy = jt || tw;
  function kf(y) {
    var C = Uo(y) ? cn.call(y) : "";
    return C == d || C == l;
  }
  function Zy(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= i;
  }
  function Uo(y) {
    var C = typeof y;
    return !!y && (C == "object" || C == "function");
  }
  function Qy(y) {
    return !!y && typeof y == "object";
  }
  function Cc(y) {
    return $f(y) ? hs(y) : Cr(y);
  }
  function Jy() {
    return [];
  }
  function tw() {
    return !1;
  }
  t.exports = qy;
})(Ua, Ua.exports);
var tx = Ua.exports;
const Up = /* @__PURE__ */ c0(tx);
var Sl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Sl || (Sl = {}));
function ex(t, e) {
  return { type: Sl.Address, version: t, hash160: e };
}
function nx(t) {
  return Qs.c32address(t.version, t.hash160);
}
const rx = (t) => I2(Lp(t)), sx = (t) => ft(rx(t));
we.hmacSha256Sync = (t, ...e) => {
  const n = kp.create(Lp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ix(t, e = "mainnet") {
  e = Ep(e), t = typeof t == "string" ? Dt(t) : t;
  const n = m2(wr.P2PKH, e), r = ex(n, sx(t));
  return nx(r);
}
function ox(t, e) {
  const n = De.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = ix(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new De.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function ax(t, e = null) {
  let n;
  e ? n = ox(t, e) : n = De.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const vd = "_blockstackDidCheckEchoReply", cx = "echoReply", lx = "authContinuation";
function ux(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function fx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[vd];
  if (typeof e == "boolean")
    return e;
  const n = ux(t.location.search), r = n[cx];
  if (r) {
    t[vd] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[lx];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class El {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new w0();
    else
      throw new Tw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new id(e.sessionOptions) : this.store = new id() : e ? this.store = new sd(e.sessionOptions) : this.store = new sd();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Mw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new cl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, Ym(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Xm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = du("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (fx())
        return bi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      bi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = eb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Oo("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = De.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await e2(e))
      throw new Oo("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (Mc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await nd(i, s.private_key);
          } catch {
            if (bi.warn("Failed decryption of appPrivateKey, will try to use as given"), !we.isValidPrivateKey(s.private_key))
              throw new Oo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await nd(i, c);
          } catch {
            bi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Oo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Gw, d;
    Mc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), Mc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (d = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: mp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = s.profile_url;
    if (!l.profile && g) {
      const p = await n(g);
      if (!p.ok)
        l.profile = Object.assign({}, Iw);
      else {
        const E = await p.text(), A = JSON.parse(E);
        l.profile = ax(A[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new cl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), G1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), K1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
El.prototype.makeAuthRequest = El.prototype.makeAuthRequestToken;
const dx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], hx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = dx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!dc(r.id));
  return e.concat(n);
}, dc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Hp = "STX_PROVIDER", Ps = () => typeof window > "u" ? null : window.localStorage.getItem(Hp), px = (t) => {
  typeof window < "u" && window.localStorage.setItem(Hp, t);
}, gx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function yx(t, e) {
  const n = {};
  return Object.assign(n, gx, e), await fetch(t, n);
}
function wx(t) {
  let e = yx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function bx(...t) {
  const { fetchLib: e, middlewares: n } = wx(t);
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
var Pi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pi || (Pi = {}));
var Us;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Us || (Us = {}));
var $d;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($d || ($d = {}));
const mx = "https://api.mainnet.hiro.so", xx = "https://api.testnet.hiro.so", Sx = "http://localhost:3999", Ex = ["mainnet", "testnet", "devnet", "mocknet"];
class Hs {
  constructor(e) {
    this.version = Us.Mainnet, this.chainId = Pi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Us.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? bx();
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
Hs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Al();
    case "testnet":
      return new vl();
    case "devnet":
      return new Ax();
    case "mocknet":
      return new Op();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ex.join(", ")}`);
  }
};
Hs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Hs.fromName(t);
class Al extends Hs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? mx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Us.Mainnet, this.chainId = Pi.Mainnet;
  }
}
class vl extends Hs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? xx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Us.Testnet, this.chainId = Pi.Testnet;
  }
}
class Op extends Hs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Us.Testnet, this.chainId = Pi.Testnet;
  }
}
const Ax = Op;
var Os;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Os || (Os = {}));
var Ha;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ha || (Ha = {}));
Os.Mainnet;
var Ds;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ds || (Ds = {}));
var Fs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Fs || (Fs = {}));
Ds.Mainnet;
const vx = {
  chainId: Os.Mainnet,
  transactionVersion: Ds.Mainnet,
  peerNetworkId: Ha.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Fs.MainnetSingleSig,
    multiSig: Fs.MainnetMultiSig
  },
  client: { baseUrl: p0 }
}, $l = {
  chainId: Os.Testnet,
  transactionVersion: Ds.Testnet,
  peerNetworkId: Ha.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Fs.TestnetSingleSig,
    multiSig: Fs.TestnetMultiSig
  },
  client: { baseUrl: g0 }
}, xa = {
  ...$l,
  addressVersion: { ...$l.addressVersion },
  magicBytes: "id",
  client: { baseUrl: y0 }
}, $x = {
  ...xa,
  addressVersion: { ...xa.addressVersion },
  client: { ...xa.client }
};
function kx(t) {
  switch (t) {
    case "mainnet":
      return vx;
    case "testnet":
      return $l;
    case "devnet":
      return xa;
    case "mocknet":
      return $x;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Ix(t) {
  return typeof t == "string" ? kx(t) : t;
}
function Lx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const kd = /* @__PURE__ */ new Map();
function Dp(t, e) {
  const n = kd.get(t);
  if (n !== void 0)
    return n(e);
  const r = Lx(t);
  return kd.set(t, r), Dp(t, e);
}
let ee = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Dt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Zw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Xw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return qw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ft(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ft(n);
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
    if (Dp(e, r))
      return r;
    throw n(r);
  }
};
const Cx = 128, Tx = 128, Fp = 16, ks = 32, kl = 80, hc = 65, Bx = 32, Mx = 64, Oa = 34, Nx = 1 + 16 * 1024 * 1024, _x = 165, Px = 16, Ux = 16, Hx = 20, Ox = Ux + 2 + Hx, Dx = Ox + 4, Fx = Nx + (_x + Px * Dx);
var qt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(qt || (qt = {}));
var Il;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Il || (Il = {}));
var fn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(fn || (fn = {}));
const Dc = ["onChainOnly", "offChainOnly", "any"];
Dc[0] + "", fn.OnChainOnly, Dc[1] + "", fn.OffChainOnly, Dc[2] + "", fn.Any, fn.OnChainOnly + "", fn.OnChainOnly, fn.OffChainOnly + "", fn.OffChainOnly, fn.Any + "", fn.Any;
var Da;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Da || (Da = {}));
var ie;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ie || (ie = {}));
var ge;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ge || (ge = {}));
var Jt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Jt || (Jt = {}));
var de;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(de || (de = {}));
var lo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(lo || (lo = {}));
var Ll;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ll || (Ll = {}));
var Cl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Cl || (Cl = {}));
var Xe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Xe || (Xe = {}));
var Id;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Id || (Id = {}));
var Tl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Tl || (Tl = {}));
var Nn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Nn || (Nn = {}));
var Ld;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ld || (Ld = {}));
let pc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, mi = class extends pc {
  constructor(e) {
    super(e);
  }
}, qe = class extends pc {
  constructor(e) {
    super(e);
  }
}, Fa = class extends pc {
  constructor(e) {
    super(e);
  }
}, xs = class extends pc {
  constructor(e) {
    super(e);
  }
};
function Bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function jx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function zx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bl(t.outputLen), Bl(t.blockLen);
}
function Rx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Gx(t, e) {
  jp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ss = {
  number: Bl,
  bool: jx,
  bytes: jp,
  hash: zx,
  exists: Rx,
  output: Gx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Rn = (t, e) => t << 32 - e | t >>> e, Kx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Kx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Vx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nu(t) {
  if (typeof t == "string" && (t = Vx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let zp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Js(t) {
  const e = (r) => t().update(Nu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Rp = class extends zp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ss.hash(e);
    const r = Nu(n);
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
    return Ss.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ss.exists(this), Ss.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Gp = (t, e, n) => new Rp(t, e).update(n).digest();
Gp.create = (t, e) => new Rp(t, e);
function qx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let _u = class extends zp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Fc(this.buffer);
  }
  update(e) {
    Ss.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Nu(e);
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
    Ss.exists(this), Ss.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    qx(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Fc(e), c = this.outputLen;
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
const Wx = (t, e, n) => t & e ^ ~t & n, Xx = (t, e, n) => t & e ^ t & n ^ e & n, Yx = new Uint32Array([
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
let Kp = class extends _u {
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
      const g = Gr[l - 15], p = Gr[l - 2], E = Rn(g, 7) ^ Rn(g, 18) ^ g >>> 3, A = Rn(p, 17) ^ Rn(p, 19) ^ p >>> 10;
      Gr[l] = A + Gr[l - 7] + E + Gr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Rn(a, 6) ^ Rn(a, 11) ^ Rn(a, 25), p = d + g + Wx(a, c, u) + Yx[l] + Gr[l] | 0, A = (Rn(r, 2) ^ Rn(r, 13) ^ Rn(r, 22)) + Xx(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Gr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Zx = class extends Kp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Pu = Js(() => new Kp());
Js(() => new Zx());
const Qx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Vp = Uint8Array.from({ length: 16 }, (t, e) => e), Jx = Vp.map((t) => (9 * t + 5) % 16);
let Uu = [Vp], Hu = [Jx];
for (let t = 0; t < 4; t++)
  for (let e of [Uu, Hu])
    e.push(e[t].map((n) => Qx[n]));
const qp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), tS = Uu.map((t, e) => t.map((n) => qp[e][n])), eS = Hu.map((t, e) => t.map((n) => qp[e][n])), nS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), rS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zo = (t, e) => t << e | t >>> 32 - e;
function Cd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qo = new Uint32Array(16);
let sS = class extends _u {
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
      Qo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, A = nS[p], B = rS[p], K = Uu[p], V = Hu[p], v = tS[p], _ = eS[p];
      for (let T = 0; T < 16; T++) {
        const S = Zo(r + Cd(p, s, a, u) + Qo[K[T]] + A, v[T]) + l | 0;
        r = l, l = u, u = Zo(a, 10) | 0, a = s, s = S;
      }
      for (let T = 0; T < 16; T++) {
        const S = Zo(i + Cd(E, o, c, d) + Qo[V[T]] + B, _[T]) + g | 0;
        i = g, g = d, d = Zo(c, 10) | 0, c = o, o = S;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const iS = Js(() => new sS()), Jo = BigInt(2 ** 32 - 1), Ml = BigInt(32);
function Wp(t, e = !1) {
  return e ? { h: Number(t & Jo), l: Number(t >> Ml & Jo) } : { h: Number(t >> Ml & Jo) | 0, l: Number(t & Jo) | 0 };
}
function oS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Wp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const aS = (t, e) => BigInt(t >>> 0) << Ml | BigInt(e >>> 0), cS = (t, e, n) => t >>> n, lS = (t, e, n) => t << 32 - n | e >>> n, uS = (t, e, n) => t >>> n | e << 32 - n, fS = (t, e, n) => t << 32 - n | e >>> n, dS = (t, e, n) => t << 64 - n | e >>> n - 32, hS = (t, e, n) => t >>> n - 32 | e << 64 - n, pS = (t, e) => e, gS = (t, e) => t, yS = (t, e, n) => t << n | e >>> 32 - n, wS = (t, e, n) => e << n | t >>> 32 - n, bS = (t, e, n) => e << n - 32 | t >>> 64 - n, mS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function xS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const SS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ES = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, AS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), vS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, $S = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), kS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: Wp,
  split: oS,
  toBig: aS,
  shrSH: cS,
  shrSL: lS,
  rotrSH: uS,
  rotrSL: fS,
  rotrBH: dS,
  rotrBL: hS,
  rotr32H: pS,
  rotr32L: gS,
  rotlSH: yS,
  rotlSL: wS,
  rotlBH: bS,
  rotlBL: mS,
  add: xS,
  add3L: SS,
  add3H: ES,
  add4L: AS,
  add4H: vS,
  add5H: kS,
  add5L: $S
}, [IS, LS] = At.split([
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
let gc = class extends _u {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: E, Hh: A, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = A | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Kr[v] = e.getUint32(n), Vr[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const _ = Kr[v - 15] | 0, T = Vr[v - 15] | 0, S = At.rotrSH(_, T, 1) ^ At.rotrSH(_, T, 8) ^ At.shrSH(_, T, 7), N = At.rotrSL(_, T, 1) ^ At.rotrSL(_, T, 8) ^ At.shrSL(_, T, 7), P = Kr[v - 2] | 0, M = Vr[v - 2] | 0, x = At.rotrSH(P, M, 19) ^ At.rotrBH(P, M, 61) ^ At.shrSH(P, M, 6), b = At.rotrSL(P, M, 19) ^ At.rotrBL(P, M, 61) ^ At.shrSL(P, M, 6), L = At.add4L(N, b, Vr[v - 7], Vr[v - 16]), U = At.add4H(L, S, x, Kr[v - 7], Kr[v - 16]);
      Kr[v] = U | 0, Vr[v] = L | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: E, Gh: A, Gl: B, Hh: K, Hl: V } = this;
    for (let v = 0; v < 80; v++) {
      const _ = At.rotrSH(l, g, 14) ^ At.rotrSH(l, g, 18) ^ At.rotrBH(l, g, 41), T = At.rotrSL(l, g, 14) ^ At.rotrSL(l, g, 18) ^ At.rotrBL(l, g, 41), S = l & p ^ ~l & A, N = g & E ^ ~g & B, P = At.add5L(V, T, N, LS[v], Vr[v]), M = At.add5H(P, K, _, S, IS[v], Kr[v]), x = P | 0, b = At.rotrSH(r, i, 28) ^ At.rotrBH(r, i, 34) ^ At.rotrBH(r, i, 39), L = At.rotrSL(r, i, 28) ^ At.rotrBL(r, i, 34) ^ At.rotrBL(r, i, 39), U = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      K = A | 0, V = B | 0, A = p | 0, B = E | 0, p = l | 0, E = g | 0, { h: l, l: g } = At.add(u | 0, d | 0, M | 0, x | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const D = At.add3L(x, L, J);
      r = At.add3H(D, M, b, U), i = D | 0;
    }
    ({ h: r, l: i } = At.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = At.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = At.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = At.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: E } = At.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: A, l: B } = At.add(this.Gh | 0, this.Gl | 0, A | 0, B | 0), { h: K, l: V } = At.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, E, A, B, K, V);
  }
  roundClean() {
    Kr.fill(0), Vr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, CS = class extends gc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, TS = class extends gc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, BS = class extends gc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Js(() => new gc());
Js(() => new CS());
const MS = Js(() => new TS());
Js(() => new BS());
var _t;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(_t || (_t = {}));
var Ie;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ie || (Ie = {}));
function Ou(t) {
  return Ie[t];
}
const NS = () => ({ type: _t.BoolTrue }), _S = () => ({ type: _t.BoolFalse }), PS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: _t.Buffer, value: ft(t) };
}, Td = BigInt("0xffffffffffffffffffffffffffffffff"), US = BigInt(0), Bd = BigInt("0x7fffffffffffffffffffffffffffffff"), Md = BigInt("-170141183460469231731687303715884105728"), HS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ul(Dt(t))), on(t, Uint8Array) && (t = ul(t));
  const e = ze(t);
  if (e > Bd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Bd}`);
  if (e < Md)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Md}`);
  return { type: _t.Int, value: e };
}, OS = (t) => {
  const e = ze(t);
  if (e < US)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Td)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Td}`);
  return { type: _t.UInt, value: e };
};
function DS(t) {
  return { type: _t.List, value: t };
}
function Xp() {
  return { type: _t.OptionalNone };
}
function Yp(t) {
  return { type: _t.OptionalSome, value: t };
}
var tt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(tt || (tt = {}));
function FS() {
  return {
    type: tt.Address,
    version: Fs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Nd(t) {
  if (t && ig(t, Oa))
    throw new Error(`Memo exceeds maximum length of ${Oa} bytes`);
  return { type: tt.MemoString, content: t };
}
function Du(t, e) {
  return {
    type: tt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Nl(t) {
  if (Dt(t).byteLength != hc)
    throw Error("Invalid signature");
  return {
    type: tt.MessageSignature,
    data: t
  };
}
function jS(t, e, n) {
  return typeof t == "string" && (t = r3(t)), typeof n == "string" && (n = Nd(n)), {
    type: tt.Payload,
    payloadType: qt.TokenTransfer,
    recipient: t,
    amount: ze(e),
    memo: n ?? Nd("")
  };
}
function zS(t, e, n, r) {
  return typeof e == "string" && (e = Un(e)), typeof n == "string" && (n = Un(n)), {
    type: tt.Payload,
    payloadType: qt.ContractCall,
    contractAddress: typeof t == "string" ? fs(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function RS(t) {
  return Un(t, 4, 1e5);
}
function _d(t, e, n) {
  return typeof t == "string" && (t = Un(t)), typeof e == "string" && (e = RS(e)), typeof n == "number" ? {
    type: tt.Payload,
    payloadType: qt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: tt.Payload,
    payloadType: qt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function GS() {
  return { type: tt.Payload, payloadType: qt.PoisonMicroblock };
}
function Pd(t, e) {
  if (t.byteLength != ks)
    throw Error(`Coinbase buffer size must be ${ks} bytes`);
  return e != null ? {
    type: tt.Payload,
    payloadType: qt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: tt.Payload,
    payloadType: qt.Coinbase,
    coinbaseBytes: t
  };
}
function KS(t, e, n) {
  if (t.byteLength != ks)
    throw Error(`Coinbase buffer size must be ${ks} bytes`);
  if (n.byteLength != kl)
    throw Error(`VRF proof buffer size must be ${kl} bytes`);
  return {
    type: tt.Payload,
    payloadType: qt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === _t.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function VS(t, e, n, r, i, s, o) {
  return {
    type: tt.Payload,
    payloadType: qt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Un(t, e, n) {
  const r = e || 1, i = n || Cx;
  if (ig(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: tt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function qS(t, e, n) {
  return {
    type: tt.Asset,
    address: fs(t),
    contractName: Un(e),
    assetName: Un(n)
  };
}
function fs(t) {
  const e = Qs.c32addressDecode(t);
  return {
    type: tt.Address,
    version: e[0],
    hash160: e[1]
  };
}
function WS(t, e) {
  const n = fs(t), r = Un(e);
  return {
    type: tt.Principal,
    prefix: Xe.Contract,
    address: n,
    contractName: r
  };
}
function XS(t) {
  const e = fs(t);
  return {
    type: tt.Principal,
    prefix: Xe.Standard,
    address: e
  };
}
function xi(t, e) {
  return {
    pubKeyEncoding: t,
    type: tt.TransactionAuthField,
    contents: e
  };
}
function gr(t) {
  switch (t.type) {
    case tt.Address:
      return Mo(t);
    case tt.Principal:
      return Zp(t);
    case tt.LengthPrefixedString:
      return Hi(t);
    case tt.MemoString:
      return ZS(t);
    case tt.Asset:
      return Jp(t);
    case tt.PostCondition:
      return eg(t);
    case tt.PublicKey:
      return Ul(t);
    case tt.LengthPrefixedList:
      return Fu(t);
    case tt.Payload:
      return ng(t);
    case tt.TransactionAuthField:
      return n3(t);
    case tt.MessageSignature:
      return ju(t);
  }
}
function Mo(t) {
  const e = [];
  return e.push(Dt(ko(t.version, 1))), e.push(Dt(t.hash160)), xe(e);
}
function Ui(t) {
  const e = on(t, ee) ? t : new ee(t), n = tc(ft(e.readBytes(1))), r = ft(e.readBytes(20));
  return { type: tt.Address, version: n, hash160: r };
}
function Zp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Xe.Standard || t.prefix === Xe.Contract) && e.push(Mo(t.address)), t.prefix === Xe.Contract && e.push(Hi(t.contractName)), xe(e);
}
function YS(t) {
  const e = on(t, ee) ? t : new ee(t), n = e.readUInt8Enum(Xe, (s) => {
    throw new qe(`Unexpected Principal payload type: ${s}`);
  });
  if (n === Xe.Origin)
    return { type: tt.Principal, prefix: n };
  const r = Ui(e);
  if (n === Xe.Standard)
    return { type: tt.Principal, prefix: n, address: r };
  const i = vn(e);
  return {
    type: tt.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Hi(t) {
  const e = [], n = Ws(t.content), r = n.byteLength;
  return e.push(Dt(ko(r, t.lengthPrefixBytes))), e.push(n), xe(e);
}
function vn(t, e, n) {
  e = e || 1;
  const r = on(t, ee) ? t : new ee(t), i = tc(ft(r.readBytes(e))), s = Io(r.readBytes(i));
  return Un(s, e, n ?? 128);
}
function ZS(t) {
  const e = [], n = Ws(t.content), r = $3(ft(n), Oa * 2);
  return e.push(Dt(r)), xe(e);
}
function Qp(t) {
  const e = on(t, ee) ? t : new ee(t);
  let n = Io(e.readBytes(Oa));
  return n = n.replace(/\u0000*$/, ""), { type: tt.MemoString, content: n };
}
function Jp(t) {
  const e = [];
  return e.push(Mo(t.address)), e.push(Hi(t.contractName)), e.push(Hi(t.assetName)), xe(e);
}
function _l(t) {
  const e = on(t, ee) ? t : new ee(t);
  return {
    type: tt.Asset,
    address: Ui(e),
    contractName: vn(e),
    assetName: vn(e)
  };
}
function Fu(t) {
  const e = t.values, n = [];
  n.push(Dt(ko(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(gr(r));
  return xe(n);
}
function tg(t, e, n) {
  const r = on(t, ee) ? t : new ee(t), i = tc(ft(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case tt.Address:
        s.push(Ui(r));
        break;
      case tt.LengthPrefixedString:
        s.push(vn(r));
        break;
      case tt.MemoString:
        s.push(Qp(r));
        break;
      case tt.Asset:
        s.push(_l(r));
        break;
      case tt.PostCondition:
        s.push(JS(r));
        break;
      case tt.PublicKey:
        s.push(Hl(r));
        break;
      case tt.TransactionAuthField:
        s.push(e3(r));
        break;
    }
  return Du(s, n);
}
function QS(t) {
  return ft(eg(t));
}
function eg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Zp(t.principal)), (t.conditionType === ie.Fungible || t.conditionType === ie.NonFungible) && e.push(Jp(t.asset)), t.conditionType === ie.NonFungible && e.push(Zn(t.assetName)), e.push(t.conditionCode), t.conditionType === ie.STX || t.conditionType === ie.Fungible || t.conditionType === ie.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new mi("The post-condition amount may not be larger than 8 bytes");
    e.push(ls(t.amount, 8));
  }
  return xe(e);
}
function JS(t) {
  const e = on(t, ee) ? t : new ee(t), n = e.readUInt8Enum(ie, (a) => {
    throw new qe(`Could not read ${a} as PostConditionType`);
  }), r = YS(e);
  let i, s, o;
  switch (n) {
    case ie.STX:
      return i = e.readUInt8Enum(lo, (c) => {
        throw new qe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ft(e.readBytes(8))}`), {
        type: tt.PostCondition,
        conditionType: ie.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ie.Fungible:
      return s = _l(e), i = e.readUInt8Enum(lo, (c) => {
        throw new qe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ft(e.readBytes(8))}`), {
        type: tt.PostCondition,
        conditionType: ie.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ie.NonFungible:
      s = _l(e);
      const a = Wn(e);
      return i = e.readUInt8Enum(Ll, (c) => {
        throw new qe(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: tt.PostCondition,
        conditionType: ie.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ie.Staking:
      return i = e.readUInt8Enum(lo, (c) => {
        throw new qe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ft(e.readBytes(8))}`), {
        type: tt.PostCondition,
        conditionType: ie.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ie.PoX: {
      const c = e.readUInt8Enum(Cl, (u) => {
        throw new qe(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: tt.PostCondition,
        conditionType: ie.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function ng(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case qt.TokenTransfer:
      e.push(Zn(t.recipient)), e.push(ls(t.amount, 8)), e.push(gr(t.memo));
      break;
    case qt.ContractCall:
      e.push(gr(t.contractAddress)), e.push(gr(t.contractName)), e.push(gr(t.functionName));
      const n = new Uint8Array(4);
      Ts(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Zn(r));
      });
      break;
    case qt.SmartContract:
      e.push(gr(t.contractName)), e.push(gr(t.codeBody));
      break;
    case qt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(gr(t.contractName)), e.push(gr(t.codeBody));
      break;
    case qt.PoisonMicroblock:
      break;
    case qt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case qt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Zn(t.recipient));
      break;
    case qt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Zn(t.recipient ? Yp(t.recipient) : Xp())), e.push(t.vrfProof);
      break;
    case qt.TenureChange:
      e.push(Dt(t.tenureHash)), e.push(Dt(t.previousTenureHash)), e.push(Dt(t.burnViewHash)), e.push(Dt(t.previousTenureEnd)), e.push(Ts(new Uint8Array(4), t.previousTenureBlocks)), e.push(Yw(new Uint8Array(1), t.cause)), e.push(Dt(t.publicKeyHash));
      break;
  }
  return xe(e);
}
function t3(t) {
  const e = on(t, ee) ? t : new ee(t);
  switch (e.readUInt8Enum(qt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case qt.TokenTransfer:
      const r = Wn(e), i = ze(e.readBytes(8)), s = Qp(e);
      return jS(r, i, s);
    case qt.ContractCall:
      const o = Ui(e), a = vn(e), c = vn(e), u = [], d = e.readUInt32BE();
      for (let _ = 0; _ < d; _++) {
        const T = Wn(e);
        u.push(T);
      }
      return zS(o, a, c, u);
    case qt.SmartContract:
      const l = vn(e), g = vn(e, 4, 1e5);
      return _d(l, g);
    case qt.VersionedSmartContract: {
      const _ = e.readUInt8Enum(Il, (N) => {
        throw new Error(`Cannot recognize ClarityVersion: ${N}`);
      }), T = vn(e), S = vn(e, 4, Fx);
      return _d(T, S, _);
    }
    case qt.PoisonMicroblock:
      return GS();
    case qt.Coinbase: {
      const _ = e.readBytes(ks);
      return Pd(_);
    }
    case qt.CoinbaseToAltRecipient: {
      const _ = e.readBytes(ks), T = Wn(e);
      return Pd(_, T);
    }
    case qt.NakamotoCoinbase: {
      const _ = e.readBytes(ks), T = Wn(e), S = e.readBytes(kl);
      return KS(_, T, S);
    }
    case qt.TenureChange:
      const p = ft(e.readBytes(20)), E = ft(e.readBytes(20)), A = ft(e.readBytes(20)), B = ft(e.readBytes(32)), K = e.readUInt32BE(), V = e.readUInt8Enum(Tl, (_) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${_}`);
      }), v = ft(e.readBytes(20));
      return VS(p, E, A, B, K, V, v);
  }
}
function Pl(t) {
  const e = on(t, ee) ? t : new ee(t);
  return Nl(ft(e.readBytes(hc)));
}
function e3(t) {
  const e = on(t, ee) ? t : new ee(t), n = e.readUInt8Enum(Nn, (r) => {
    throw new qe(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Nn.PublicKeyCompressed:
      return xi(de.Compressed, Hl(e));
    case Nn.PublicKeyUncompressed:
      return xi(de.Uncompressed, Ki(U3(Hl(e).data)));
    case Nn.SignatureCompressed:
      return xi(de.Compressed, Pl(e));
    case Nn.SignatureUncompressed:
      return xi(de.Uncompressed, Pl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function ju(t) {
  return Dt(t.data);
}
function n3(t) {
  const e = [];
  switch (t.contents.type) {
    case tt.PublicKey:
      e.push(t.pubKeyEncoding === de.Compressed ? Nn.PublicKeyCompressed : Nn.PublicKeyUncompressed), e.push(Dt(P3(t.contents.data)));
      break;
    case tt.MessageSignature:
      e.push(t.pubKeyEncoding === de.Compressed ? Nn.SignatureCompressed : Nn.SignatureUncompressed), e.push(ju(t.contents));
      break;
  }
  return xe(e);
}
function Ul(t) {
  return t.data.slice();
}
function Hl(t) {
  const e = on(t, ee) ? t : new ee(t), n = e.readUInt8(), r = n === 4 ? Mx : Bx;
  return Ki(xe([n, e.readBytes(r)]));
}
function zu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Jt.P2PKH || e === Jt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Jt.P2WPKH || e === Jt.P2WSH || e === Jt.P2WSHNonSequential) && !r.map((i) => i.data).every(Vi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Jt.P2PKH:
      return ta(t, k3(r[0].data));
    case Jt.P2WPKH:
      return ta(t, I3(r[0].data));
    case Jt.P2SH:
    case Jt.P2SHNonSequential:
      return ta(t, L3(n, r.map(Ul)));
    case Jt.P2WSH:
    case Jt.P2WSHNonSequential:
      return ta(t, C3(n, r.map(Ul)));
  }
}
function ta(t, e) {
  return { type: tt.Address, version: t, hash160: e };
}
function Ru(t) {
  return Qs.c32address(t.version, t.hash160);
}
function Ud(t) {
  const [e, n, r] = t.split(/\.|::/);
  return qS(e, n, r);
}
function to(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return WS(e, n);
  } else
    return XS(t);
}
function r3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return o3(e, n);
  } else
    return s3(t);
}
function s3(t) {
  const e = fs(t);
  return { type: _t.PrincipalStandard, value: Ru(e) };
}
function i3(t) {
  return { type: _t.PrincipalStandard, value: Ru(t) };
}
function o3(t, e) {
  const n = fs(t), r = Un(e);
  return rg(n, r);
}
function rg(t, e) {
  if (Ws(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: _t.PrincipalContract,
    value: `${Ru(t)}.${e.content}`
  };
}
function a3(t) {
  return { type: _t.ResponseErr, value: t };
}
function c3(t) {
  return { type: _t.ResponseOk, value: t };
}
const l3 = (t) => ({ type: _t.StringASCII, value: t }), u3 = (t) => ({ type: _t.StringUTF8, value: t });
function f3(t) {
  for (const e in t)
    if (!T3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: _t.Tuple, value: t };
}
function Wn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ee(Dt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ee(t) : e = t;
  switch (e.readUInt8Enum(Ie, (r) => {
    throw new qe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ie.int:
      return HS(ul(e.readBytes(16)));
    case Ie.uint:
      return OS(e.readBytes(16));
    case Ie.buffer:
      const r = e.readUInt32BE();
      return PS(e.readBytes(r));
    case Ie.true:
      return NS();
    case Ie.false:
      return _S();
    case Ie.address:
      const i = Ui(e);
      return i3(i);
    case Ie.contract:
      const s = Ui(e), o = vn(e);
      return rg(s, o);
    case Ie.ok:
      return c3(Wn(e));
    case Ie.err:
      return a3(Wn(e));
    case Ie.none:
      return Xp();
    case Ie.some:
      return Yp(Wn(e));
    case Ie.list:
      const a = e.readUInt32BE(), c = [];
      for (let A = 0; A < a; A++)
        c.push(Wn(e));
      return DS(c);
    case Ie.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let A = 0; A < u; A++) {
        const B = vn(e).content;
        if (B === void 0)
          throw new qe('"content" is undefined');
        d[B] = Wn(e);
      }
      return f3(d);
    case Ie.ascii:
      const l = e.readUInt32BE(), g = zw(e.readBytes(l));
      return l3(g);
    case Ie.utf8:
      const p = e.readUInt32BE(), E = Io(e.readBytes(p));
      return u3(E);
    default:
      throw new qe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function nr(t, e) {
  return xe([Ou(t), e]);
}
function d3(t) {
  return new Uint8Array([Ou(t.type)]);
}
function h3(t) {
  return t.type === _t.OptionalNone ? new Uint8Array([Ou(t.type)]) : nr(t.type, Zn(t.value));
}
function p3(t) {
  const e = new Uint8Array(4);
  return Ts(e, Math.ceil(t.value.length / 2), 0), nr(t.type, tr(e, Dt(t.value)));
}
function g3(t) {
  const e = hu(Hw(BigInt(t.value), BigInt(Tx)), Fp);
  return nr(t.type, e);
}
function y3(t) {
  const e = hu(BigInt(t.value), Fp);
  return nr(t.type, e);
}
function w3(t) {
  return nr(t.type, Mo(fs(t.value)));
}
function b3(t) {
  const [e, n] = B3(t.value);
  return nr(t.type, tr(Mo(fs(e)), Hi(Un(n))));
}
function m3(t) {
  return nr(t.type, Zn(t.value));
}
function x3(t) {
  const e = [], n = new Uint8Array(4);
  Ts(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = Zn(r);
    e.push(i);
  }
  return nr(t.type, xe(e));
}
function S3(t) {
  const e = [], n = new Uint8Array(4);
  Ts(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Un(i);
    e.push(Hi(s));
    const o = Zn(t.value[i]);
    e.push(o);
  }
  return nr(t.type, xe(e));
}
function sg(t, e) {
  const n = [], r = e == "ascii" ? jw(t.value) : Ws(t.value), i = new Uint8Array(4);
  return Ts(i, r.length, 0), n.push(i), n.push(r), nr(t.type, xe(n));
}
function E3(t) {
  return sg(t, "ascii");
}
function A3(t) {
  return sg(t, "utf8");
}
function Hd(t) {
  return ft(Zn(t));
}
function Zn(t) {
  switch (t.type) {
    case _t.BoolTrue:
    case _t.BoolFalse:
      return d3(t);
    case _t.OptionalNone:
    case _t.OptionalSome:
      return h3(t);
    case _t.Buffer:
      return p3(t);
    case _t.UInt:
      return y3(t);
    case _t.Int:
      return g3(t);
    case _t.PrincipalStandard:
      return w3(t);
    case _t.PrincipalContract:
      return b3(t);
    case _t.ResponseOk:
    case _t.ResponseErr:
      return m3(t);
    case _t.List:
      return x3(t);
    case _t.Tuple:
      return S3(t);
    case _t.StringASCII:
      return E3(t);
    case _t.StringUTF8:
      return A3(t);
    default:
      throw new mi("Unable to serialize. Invalid Clarity Value.");
  }
}
const v3 = (t) => t.length % 2 ? `0${t}` : t, $3 = (t, e) => t.padEnd(e, "0"), ig = (t, e) => t ? Ws(t).length > e : !1;
function Ol(t) {
  return Up(t);
}
const go = (t) => iS(Pu(t)), Gu = (t) => ft(MS(t)), k3 = (t) => ft(go(t)), I3 = (t) => {
  const e = go(t), n = tr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = go(n);
  return ft(r);
}, L3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = xe(n), i = go(r);
  return ft(i);
}, C3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = xe(n), i = Pu(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = xe(s), a = go(o);
  return ft(a);
};
function T3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function B3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
we.hmacSha256Sync = (t, ...e) => {
  const n = Gp.create(Pu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ki(t) {
  return t = typeof t == "string" ? Dt(t) : t, {
    type: tt.PublicKey,
    data: t
  };
}
function M3(t, e, n = de.Compressed) {
  const r = Vw(e), i = new gn(Hf(r.r), Hf(r.s)), s = Lt.fromSignature(t, i, r.recoveryId), o = n === de.Compressed;
  return s.toHex(o);
}
function N3(t) {
  return typeof t == "string" ? t : ft(t);
}
const Ku = N3;
function og(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Kw;
}
function Vi(t) {
  return !Ku(t).startsWith("04");
}
function _3(t) {
  t = pu(t);
  const e = og(t);
  return ft(Lo(t.slice(0, 32), e));
}
function P3(t) {
  return Lt.fromHex(Ku(t)).toHex(!0);
}
function U3(t) {
  return Lt.fromHex(Ku(t)).toHex(!1);
}
function H3(t, e) {
  t = pu(t);
  const [n, r] = nc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ko(r, 1) + gn.fromHex(n).toCompactHex();
}
function Vu() {
  return {
    type: tt.MessageSignature,
    data: ft(new Uint8Array(hc))
  };
}
function ag(t, e, n, r) {
  const i = zu(0, t, 1, [Ki(e)]).hash160, s = Vi(e) ? de.Compressed : de.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: ze(n),
    fee: ze(r),
    keyEncoding: s,
    signature: Vu()
  };
}
function yo(t) {
  return "signature" in t;
}
function Od(t) {
  return t === Jt.P2SH || t === Jt.P2WSH;
}
function O3(t) {
  return t === Jt.P2SHNonSequential || t === Jt.P2WSHNonSequential;
}
function Dd(t) {
  const e = Ol(t);
  return e.nonce = 0, e.fee = 0, yo(e) ? e.signature = Vu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function D3(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    ls(t.nonce, 8),
    ls(t.fee, 8),
    t.keyEncoding,
    ju(t.signature)
  ];
  return xe(e);
}
function F3(t) {
  const e = [
    t.hashMode,
    Dt(t.signer),
    ls(t.nonce, 8),
    ls(t.fee, 8)
  ], n = Du(t.fields);
  e.push(Fu(n));
  const r = new Uint8Array(2);
  return Ww(r, t.signaturesRequired, 0), e.push(r), xe(e);
}
function j3(t, e) {
  const n = ft(e.readBytes(20)), r = BigInt(`0x${ft(e.readBytes(8))}`), i = BigInt(`0x${ft(e.readBytes(8))}`), s = e.readUInt8Enum(de, (a) => {
    throw new qe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Jt.P2WPKH && s != de.Compressed)
    throw new qe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Pl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function z3(t, e) {
  const n = ft(e.readBytes(20)), r = BigInt("0x" + ft(e.readBytes(8))), i = BigInt("0x" + ft(e.readBytes(8))), s = tg(e, tt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case tt.PublicKey:
        Vi(u.contents.data) || (o = !0);
        break;
      case tt.MessageSignature:
        if (u.pubKeyEncoding === de.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new xs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Jt.P2WSH || t === Jt.P2WSHNonSequential))
    throw new xs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function jc(t) {
  return yo(t) ? D3(t) : F3(t);
}
function zc(t) {
  const e = t.readUInt8Enum(Jt, (n) => {
    throw new qe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Jt.P2PKH || e === Jt.P2WPKH ? j3(e, t) : z3(e, t);
}
function cg(t, e, n, r) {
  const s = t + ft(new Uint8Array([e])) + ft(ls(n, 8)) + ft(ls(r, 8));
  if (Dt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Gu(Dt(s));
}
function lg(t, e, n) {
  const r = 33 + hc, i = Vi(e.data) ? de.Compressed : de.Uncompressed, s = t + v3(i.toString(16)) + n, o = Dt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Gu(o);
}
function R3(t, e, n, r, i) {
  const s = cg(t, e, n, r), o = H3(i, s), a = Ki(_3(i)), c = lg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ug(t, e, n, r, i, s) {
  const o = cg(t, e, n, r), a = Ki(M3(o, s, i)), c = lg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function G3() {
  const t = ag(Jt.P2PKH, "", 0, 0);
  return t.signer = FS().hash160, t.keyEncoding = de.Compressed, t.signature = Vu(), t;
}
function Fd(t, e, n) {
  return yo(t) ? K3(t, e, n) : V3(t, e, n);
}
function K3(t, e, n) {
  const { pubKey: r, nextSigHash: i } = ug(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = zu(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new xs(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function V3(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case tt.PublicKey:
        Vi(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case tt.MessageSignature:
        c.pubKeyEncoding === de.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = ug(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Od(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new xs("Too many signatures");
        break;
    }
  if (Od(t.hashMode) && o !== t.signaturesRequired || O3(t.hashMode) && o < t.signaturesRequired)
    throw new xs("Incorrect number of signatures");
  if (s && (t.hashMode === Jt.P2WSH || t.hashMode === Jt.P2WSHNonSequential))
    throw new xs("Uncompressed keys are not allowed in this hash mode");
  const a = zu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new xs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function fg(t) {
  return {
    authType: ge.Standard,
    spendingCondition: t
  };
}
function dg(t, e) {
  return {
    authType: ge.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ag(Jt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function jd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ge.Standard:
        return fg(Dd(t.spendingCondition));
      case ge.Sponsored:
        return dg(Dd(t.spendingCondition), G3());
      default:
        throw new Fa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function q3(t, e) {
  switch (t.authType) {
    case ge.Standard:
      return Fd(t.spendingCondition, e, ge.Standard);
    case ge.Sponsored:
      return Fd(t.spendingCondition, e, ge.Standard);
    default:
      throw new Fa("Invalid origin auth type");
  }
}
function W3(t, e) {
  switch (t.authType) {
    case ge.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ze(e)
      };
      return { ...t, spendingCondition: n };
    case ge.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ze(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function X3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ze(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Y3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ze(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Z3(t, e) {
  const n = {
    ...e,
    nonce: ze(e.nonce),
    fee: ze(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Q3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ge.Standard:
      e.push(jc(t.spendingCondition));
      break;
    case ge.Sponsored:
      e.push(jc(t.spendingCondition)), e.push(jc(t.sponsorSpendingCondition));
      break;
  }
  return xe(e);
}
function J3(t) {
  const e = t.readUInt8Enum(ge, (r) => {
    throw new qe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ge.Standard:
      return n = zc(t), fg(n);
    case ge.Sponsored:
      n = zc(t);
      const r = zc(t);
      return dg(n, r);
  }
}
class tE {
  constructor({ auth: e, payload: n, postConditions: r = Du([]), postConditionMode: i = Da.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = Ix(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: ze(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = fn.Any;
  }
  signBegin() {
    const e = Ol(this);
    return e.auth = jd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ol(this);
    return e.auth = jd(e.auth), e.txid();
  }
  verifyOrigin() {
    return q3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ge.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ge.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ge.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Ki(e), r = this.auth.spendingCondition;
    if (r && !yo(r)) {
      const i = Vi(n.data);
      r.fields.push(xi(i ? de.Compressed : de.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = R3(n, r, e.fee, e.nonce, i);
    if (yo(e))
      e.signature = Nl(s);
    else {
      const a = og(i);
      e.fields.push(xi(a ? de.Compressed : de.Uncompressed, Nl(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Gu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ge.Sponsored)
      throw new Fa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Z3(this.auth, e);
  }
  setFee(e) {
    this.auth = W3(this.auth, e);
  }
  setNonce(e) {
    this.auth = X3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ge.Sponsored)
      throw new Fa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Y3(this.auth, e);
  }
  serialize() {
    return ft(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new mi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new mi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new mi('"auth" is undefined');
    if (this.payload === void 0)
      throw new mi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ts(n, this.chainId, 0), e.push(n), e.push(Q3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Fu(this.postConditions)), e.push(ng(this.payload)), xe(e);
  }
}
function eE(t) {
  const e = on(t, ee) ? t : new ee(t), n = e.readUInt8Enum(Ds, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = J3(e), s = e.readUInt8Enum(fn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Da, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = tg(e, tt.PostCondition), c = t3(e), u = new tE({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const zd = BigInt("18446744073709551615");
function Rc(t) {
  const e = ze(t);
  if (e < 0n || e > zd)
    throw new RangeError(`Post-condition amount must be between 0 and ${zd} (u64 max), received: ${e}`);
  return e;
}
var Dl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Dl || (Dl = {}));
var Fl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Fl || (Fl = {}));
function nE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: tt.PostCondition,
        conditionType: ie.STX,
        principal: t.address === "origin" ? { type: tt.Principal, prefix: Xe.Origin } : to(t.address),
        conditionCode: ea(t.condition),
        amount: Rc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: tt.PostCondition,
        conditionType: ie.Fungible,
        principal: t.address === "origin" ? { type: tt.Principal, prefix: Xe.Origin } : to(t.address),
        conditionCode: ea(t.condition),
        amount: Rc(t.amount),
        asset: Ud(t.asset)
      };
    case "nft-postcondition":
      return {
        type: tt.PostCondition,
        conditionType: ie.NonFungible,
        principal: t.address === "origin" ? { type: tt.Principal, prefix: Xe.Origin } : to(t.address),
        conditionCode: ea(t.condition),
        asset: Ud(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: tt.PostCondition,
        conditionType: ie.Staking,
        principal: t.address === "origin" ? { type: tt.Principal, prefix: Xe.Origin } : to(t.address),
        conditionCode: ea(t.condition),
        amount: Rc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: tt.PostCondition,
        conditionType: ie.PoX,
        principal: t.address === "origin" ? { type: tt.Principal, prefix: Xe.Origin } : to(t.address),
        conditionCode: rE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ea(t) {
  return Dl[t];
}
function rE(t) {
  return Fl[t];
}
function hg(t) {
  const e = nE(t);
  return QS(e);
}
function sE(t, e, n) {
  return Wu(pg(t), n);
}
function pg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = wo(r);
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
    return BigInt(`0x${aE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function qu(t, e = 8) {
  return (typeof t == "bigint" ? t : pg(t)).toString(16).padStart(e * 2, "0");
}
function Wu(t, e = 16) {
  const n = qu(t, e);
  return wo(n);
}
function iE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const oE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function aE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += oE[n];
  return e;
}
function wo(t) {
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
function Xu(t) {
  return new TextEncoder().encode(t);
}
function cE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function lE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Rd(t) {
  if (t.some(lE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Yu(...t) {
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
function Er(t) {
  return Yu(...t.map((e) => typeof e == "number" ? Rd([e]) : e instanceof Array ? Rd(e) : e));
}
function yc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var jl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(jl || (jl = {}));
jl.Mainnet;
const uE = 128, fE = 128, gg = 16;
var zl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(zl || (zl = {}));
var Gd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Gd || (Gd = {}));
var Kd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Kd || (Kd = {}));
var Mn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Mn || (Mn = {}));
const Gc = ["onChainOnly", "offChainOnly", "any"];
Gc[0] + "", Mn.OnChainOnly, Gc[1] + "", Mn.OffChainOnly, Gc[2] + "", Mn.Any, Mn.OnChainOnly + "", Mn.OnChainOnly, Mn.OffChainOnly + "", Mn.OffChainOnly, Mn.Any + "", Mn.Any;
var Rl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rl || (Rl = {}));
Rl.Mainnet;
var Vd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Vd || (Vd = {}));
var ys;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ys || (ys = {}));
var qd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(qd || (qd = {}));
var Wd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Wd || (Wd = {}));
var Xd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Qd || (Qd = {}));
var Gl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Gl || (Gl = {}));
var Jd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jd || (Jd = {}));
var th;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(th || (th = {}));
function Kl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function dE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function yg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function hE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Kl(t.outputLen), Kl(t.blockLen);
}
function pE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gE(t, e) {
  yg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Kc = {
  number: Kl,
  bool: dE,
  bytes: yg,
  hash: hE,
  exists: pE,
  output: gE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Vc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gn = (t, e) => t << 32 - e | t >>> e, yE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function wg(t) {
  if (typeof t == "string" && (t = wE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let bE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ti(t) {
  const e = (r) => t().update(wg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function mE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Zu = class extends bE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Vc(this.buffer);
  }
  update(e) {
    Kc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = wg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Vc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Kc.exists(this), Kc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    mE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Vc(e), c = this.outputLen;
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
const xE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), bg = Uint8Array.from({ length: 16 }, (t, e) => e), SE = bg.map((t) => (9 * t + 5) % 16);
let Qu = [bg], Ju = [SE];
for (let t = 0; t < 4; t++)
  for (let e of [Qu, Ju])
    e.push(e[t].map((n) => xE[n]));
const mg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), EE = Qu.map((t, e) => t.map((n) => mg[e][n])), AE = Ju.map((t, e) => t.map((n) => mg[e][n])), vE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $E = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), na = (t, e) => t << e | t >>> 32 - e;
function eh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ra = new Uint32Array(16);
let kE = class extends Zu {
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
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, A = vE[p], B = $E[p], K = Qu[p], V = Ju[p], v = EE[p], _ = AE[p];
      for (let T = 0; T < 16; T++) {
        const S = na(r + eh(p, s, a, u) + ra[K[T]] + A, v[T]) + l | 0;
        r = l, l = u, u = na(a, 10) | 0, a = s, s = S;
      }
      for (let T = 0; T < 16; T++) {
        const S = na(i + eh(E, o, c, d) + ra[V[T]] + B, _[T]) + g | 0;
        i = g, g = d, d = na(c, 10) | 0, c = o, o = S;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ra.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ti(() => new kE());
const IE = (t, e, n) => t & e ^ ~t & n, LE = (t, e, n) => t & e ^ t & n ^ e & n, CE = new Uint32Array([
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
let xg = class extends Zu {
  constructor() {
    super(64, 32, 8, !1), this.A = qr[0] | 0, this.B = qr[1] | 0, this.C = qr[2] | 0, this.D = qr[3] | 0, this.E = qr[4] | 0, this.F = qr[5] | 0, this.G = qr[6] | 0, this.H = qr[7] | 0;
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
      Wr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Wr[l - 15], p = Wr[l - 2], E = Gn(g, 7) ^ Gn(g, 18) ^ g >>> 3, A = Gn(p, 17) ^ Gn(p, 19) ^ p >>> 10;
      Wr[l] = A + Wr[l - 7] + E + Wr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Gn(a, 6) ^ Gn(a, 11) ^ Gn(a, 25), p = d + g + IE(a, c, u) + CE[l] + Wr[l] | 0, A = (Gn(r, 2) ^ Gn(r, 13) ^ Gn(r, 22)) + LE(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Wr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, TE = class extends xg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ti(() => new xg());
ti(() => new TE());
const sa = BigInt(2 ** 32 - 1), Vl = BigInt(32);
function Sg(t, e = !1) {
  return e ? { h: Number(t & sa), l: Number(t >> Vl & sa) } : { h: Number(t >> Vl & sa) | 0, l: Number(t & sa) | 0 };
}
function BE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Sg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const ME = (t, e) => BigInt(t >>> 0) << Vl | BigInt(e >>> 0), NE = (t, e, n) => t >>> n, _E = (t, e, n) => t << 32 - n | e >>> n, PE = (t, e, n) => t >>> n | e << 32 - n, UE = (t, e, n) => t << 32 - n | e >>> n, HE = (t, e, n) => t << 64 - n | e >>> n - 32, OE = (t, e, n) => t >>> n - 32 | e << 64 - n, DE = (t, e) => e, FE = (t, e) => t, jE = (t, e, n) => t << n | e >>> 32 - n, zE = (t, e, n) => e << n | t >>> 32 - n, RE = (t, e, n) => e << n - 32 | t >>> 64 - n, GE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function KE(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const VE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), qE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, WE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), XE = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, YE = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), ZE = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, vt = {
  fromBig: Sg,
  split: BE,
  toBig: ME,
  shrSH: NE,
  shrSL: _E,
  rotrSH: PE,
  rotrSL: UE,
  rotrBH: HE,
  rotrBL: OE,
  rotr32H: DE,
  rotr32L: FE,
  rotlSH: jE,
  rotlSL: zE,
  rotlBH: RE,
  rotlBL: GE,
  add: KE,
  add3L: VE,
  add3H: qE,
  add4L: WE,
  add4H: XE,
  add5H: ZE,
  add5L: YE
}, [QE, JE] = vt.split([
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
].map((t) => BigInt(t))), Xr = new Uint32Array(80), Yr = new Uint32Array(80);
let wc = class extends Zu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: E, Hh: A, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = A | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Xr[v] = e.getUint32(n), Yr[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const _ = Xr[v - 15] | 0, T = Yr[v - 15] | 0, S = vt.rotrSH(_, T, 1) ^ vt.rotrSH(_, T, 8) ^ vt.shrSH(_, T, 7), N = vt.rotrSL(_, T, 1) ^ vt.rotrSL(_, T, 8) ^ vt.shrSL(_, T, 7), P = Xr[v - 2] | 0, M = Yr[v - 2] | 0, x = vt.rotrSH(P, M, 19) ^ vt.rotrBH(P, M, 61) ^ vt.shrSH(P, M, 6), b = vt.rotrSL(P, M, 19) ^ vt.rotrBL(P, M, 61) ^ vt.shrSL(P, M, 6), L = vt.add4L(N, b, Yr[v - 7], Yr[v - 16]), U = vt.add4H(L, S, x, Xr[v - 7], Xr[v - 16]);
      Xr[v] = U | 0, Yr[v] = L | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: E, Gh: A, Gl: B, Hh: K, Hl: V } = this;
    for (let v = 0; v < 80; v++) {
      const _ = vt.rotrSH(l, g, 14) ^ vt.rotrSH(l, g, 18) ^ vt.rotrBH(l, g, 41), T = vt.rotrSL(l, g, 14) ^ vt.rotrSL(l, g, 18) ^ vt.rotrBL(l, g, 41), S = l & p ^ ~l & A, N = g & E ^ ~g & B, P = vt.add5L(V, T, N, JE[v], Yr[v]), M = vt.add5H(P, K, _, S, QE[v], Xr[v]), x = P | 0, b = vt.rotrSH(r, i, 28) ^ vt.rotrBH(r, i, 34) ^ vt.rotrBH(r, i, 39), L = vt.rotrSL(r, i, 28) ^ vt.rotrBL(r, i, 34) ^ vt.rotrBL(r, i, 39), U = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      K = A | 0, V = B | 0, A = p | 0, B = E | 0, p = l | 0, E = g | 0, { h: l, l: g } = vt.add(u | 0, d | 0, M | 0, x | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const D = vt.add3L(x, L, J);
      r = vt.add3H(D, M, b, U), i = D | 0;
    }
    ({ h: r, l: i } = vt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = vt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = vt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = vt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = vt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: E } = vt.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: A, l: B } = vt.add(this.Gh | 0, this.Gl | 0, A | 0, B | 0), { h: K, l: V } = vt.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, E, A, B, K, V);
  }
  roundClean() {
    Xr.fill(0), Yr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, tA = class extends wc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, eA = class extends wc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nA = class extends wc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ti(() => new wc());
ti(() => new tA());
ti(() => new eA());
ti(() => new nA());
function rA(t, e, n) {
  const i = uE;
  if (mA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: zl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Be;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Be || (Be = {}));
let sA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Eg = class extends sA {
  constructor(e) {
    super(e);
  }
};
function bc(t) {
  const e = [];
  return e.push(wo(qu(t.version, 1))), e.push(wo(t.hash160)), Er(e);
}
function iA(t) {
  const e = [];
  return e.push(t.prefix), e.push(bc(t.address)), t.prefix === Gl.Contract && e.push(bo(t.contractName)), Er(e);
}
function bo(t) {
  const e = [], n = Xu(t.content), r = n.byteLength;
  return e.push(wo(qu(r, t.lengthPrefixBytes))), e.push(n), Er(e);
}
function oA(t) {
  const e = [];
  return e.push(bc(t.address)), e.push(bo(t.contractName)), e.push(bo(t.assetName)), Er(e);
}
function Ag(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(iA(t.principal)), (t.conditionType === ys.Fungible || t.conditionType === ys.NonFungible) && e.push(oA(t.assetInfo)), t.conditionType === ys.NonFungible && e.push(js(t.assetName)), e.push(t.conditionCode), t.conditionType === ys.STX || t.conditionType === ys.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Eg("The post-condition amount may not be larger than 8 bytes");
    e.push(sE(t.amount, !1, 8));
  }
  return Er(e);
}
function rr(t, e) {
  return Er([t, e]);
}
function aA(t) {
  return new Uint8Array([t.type]);
}
function cA(t) {
  return t.type === Be.OptionalNone ? new Uint8Array([t.type]) : rr(t.type, js(t.value));
}
function lA(t) {
  const e = new Uint8Array(4);
  return yc(e, t.buffer.length, 0), rr(t.type, Yu(e, t.buffer));
}
function uA(t) {
  const e = Wu(iE(t.value, BigInt(fE)), gg);
  return rr(t.type, e);
}
function fA(t) {
  const e = Wu(t.value, gg);
  return rr(t.type, e);
}
function dA(t) {
  return rr(t.type, bc(t.address));
}
function hA(t) {
  return rr(t.type, Yu(bc(t.address), bo(t.contractName)));
}
function pA(t) {
  return rr(t.type, js(t.value));
}
function gA(t) {
  const e = [], n = new Uint8Array(4);
  yc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = js(r);
    e.push(i);
  }
  return rr(t.type, Er(e));
}
function yA(t) {
  const e = [], n = new Uint8Array(4);
  yc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = rA(i);
    e.push(bo(s));
    const o = js(t.data[i]);
    e.push(o);
  }
  return rr(t.type, Er(e));
}
function vg(t, e) {
  const n = [], r = e == "ascii" ? cE(t.data) : Xu(t.data), i = new Uint8Array(4);
  return yc(i, r.length, 0), n.push(i), n.push(r), rr(t.type, Er(n));
}
function wA(t) {
  return vg(t, "ascii");
}
function bA(t) {
  return vg(t, "utf8");
}
function js(t) {
  switch (t.type) {
    case Be.BoolTrue:
    case Be.BoolFalse:
      return aA(t);
    case Be.OptionalNone:
    case Be.OptionalSome:
      return cA(t);
    case Be.Buffer:
      return lA(t);
    case Be.UInt:
      return fA(t);
    case Be.Int:
      return uA(t);
    case Be.PrincipalStandard:
      return dA(t);
    case Be.PrincipalContract:
      return hA(t);
    case Be.ResponseOk:
    case Be.ResponseErr:
      return pA(t);
    case Be.List:
      return gA(t);
    case Be.Tuple:
      return yA(t);
    case Be.StringASCII:
      return wA(t);
    case Be.StringUTF8:
      return bA(t);
    default:
      throw new Eg("Unable to serialize. Invalid Clarity Value.");
  }
}
const mA = (t, e) => t ? Xu(t).length > e : !1, xA = "connect-ui";
let Sa, $g, dn = !1, ql = !1;
const Sr = (t, e = "") => () => {
}, SA = (t, e) => () => {
}, EA = "{visibility:hidden}.hydrated{visibility:inherit}", nh = {}, AA = "http://www.w3.org/2000/svg", vA = "http://www.w3.org/1999/xhtml", $A = (t) => t != null, tf = (t) => (t = typeof t, t === "object" || t === "function");
function kg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const xt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !tf(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? Wl(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Wl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Wl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, kA = {}, IA = (t) => t && t.$tag$ === kA, LA = (t, e) => t != null && !tf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, CA = (t) => qi(t).$hostElement$, TA = (t, e, n) => {
  const r = je.ce(e, n);
  return t.dispatchEvent(r), r;
}, rh = /* @__PURE__ */ new WeakMap(), BA = (t, e, n) => {
  let r = ja.get(t);
  ZA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, ja.set(t, r);
}, MA = (t, e, n, r) => {
  var i;
  let s = Ig(e);
  const o = ja.get(s);
  if (t = t.nodeType === 11 ? t : Qn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = rh.get(t), c;
      if (a || rh.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = Qn.createElement("style"), c.innerHTML = o;
          const u = (i = je.$nonce$) !== null && i !== void 0 ? i : kg(Qn);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, NA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = Sr("attachStyles", e.$tagName$), s = MA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, Ig = (t, e) => "sc-" + t.$tagName$, sh = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = oh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = ih(n), d = ih(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : oh(mc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && je.rel(t, e, n, !1), r && je.ael(t, e, r, !1);
    else {
      const c = tf(r);
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
}, _A = /\s/, ih = (t) => t ? t.split(_A) : [], Lg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || nh, o = e.$attrs$ || nh;
  for (r in s)
    r in o || sh(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    sh(i, r, s[r], o[r], n, e.$flags$);
}, ef = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = Qn.createTextNode(i.$text$);
  else {
    if (dn || (dn = i.$tag$ === "svg"), o = i.$elm$ = Qn.createElementNS(dn ? AA : vA, i.$tag$), dn && i.$tag$ === "foreignObject" && (dn = !1), Lg(null, i, dn), $A(Sa) && o["s-si"] !== Sa && o.classList.add(o["s-si"] = Sa), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = ef(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? dn = !1 : o.tagName === "foreignObject" && (dn = !0);
  }
  return o;
}, Cg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === $g && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = ef(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Tg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, PA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], g;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : d == null ? d = r[++s] : l == null ? l = r[--u] : ia(a, d) ? (so(a, d), a = e[++i], d = r[++s]) : ia(c, l) ? (so(c, l), c = e[--o], l = r[--u]) : ia(a, l) ? (so(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : ia(c, d) ? (so(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++s]) : (g = ef(e && e[s], n, s), d = r[++s], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  i > o ? Cg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Tg(e, i, o);
}, ia = (t, e) => t.$tag$ === e.$tag$, so = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (dn = s === "svg" ? !0 : s === "foreignObject" ? !1 : dn, Lg(t, e, dn), r !== null && i !== null ? PA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Cg(n, null, e, i, 0, i.length - 1)) : r !== null && Tg(r, 0, r.length - 1), dn && s === "svg" && (dn = !1)) : t.$text$ !== o && (n.data = o);
}, UA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Wl(null, null), i = IA(e) ? e : xt(null, null, e);
  $g = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, Sa = n["s-sc"], so(r, i);
}, Bg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, nf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Bg(t, t.$ancestorComponent$), JA(() => HA(t, e));
}, HA = (t, e) => {
  const n = Sr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), jA(i, () => OA(t, r, e));
}, OA = async (t, e, n) => {
  const r = t.$hostElement$, i = Sr("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && NA(t);
  const o = Sr("render", t.$cmpMeta$.$tagName$);
  DA(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => FA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, DA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, UA(t, e);
  } catch (r) {
    mo(r, t.$hostElement$);
  }
  return null;
}, FA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Sr("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Ng(n), r(), t.$onReadyResolve$(n), i || Mg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && sf(() => nf(t, !1)), t.$flags$ &= -517;
}, Mg = (t) => {
  Ng(Qn.documentElement), sf(() => TA(mc, "appload", { detail: { namespace: xA } }));
}, jA = (t, e) => t && t.then ? t.then(e) : e(), Ng = (t) => t.classList.add("hydrated"), zA = (t, e) => qi(t).$instanceValues$.get(e), RA = (t, e, n, r) => {
  const i = qi(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = LA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && nf(i, !1));
}, _g = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return zA(this, s);
        },
        set(a) {
          RA(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        je.jmp(() => {
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
}, GA = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = YA(n), i.then) {
        const c = SA();
        i = await i, c();
      }
      i.isProxied || (_g(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = Sr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        mo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = Ig(n);
      if (!ja.has(c)) {
        const u = Sr("registerStyles", n.$tagName$);
        BA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => nf(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, KA = (t) => {
  if (!(je.$flags$ & 1)) {
    const e = qi(t), n = e.$cmpMeta$, r = Sr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Bg(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), GA(t, e, n);
    }
    r();
  }
}, VA = (t) => {
  je.$flags$ & 1 || qi(t);
}, qA = (t, e = {}) => {
  var n;
  const r = Sr(), i = [], s = e.exclude || [], o = mc.customElements, a = Qn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Qn.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(je, e), je.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Qn.baseURI).href, t.map((p) => {
    p[1].map((E) => {
      const A = {
        $flags$: E[0],
        $tagName$: E[1],
        $members$: E[2],
        $listeners$: E[3]
      };
      A.$members$ = E[2];
      const B = A.$tagName$, K = class extends HTMLElement {
        // StencilLazyHost
        constructor(V) {
          super(V), V = this, XA(V, A), A.$flags$ & 1 && V.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : je.jmp(() => KA(this));
        }
        disconnectedCallback() {
          je.jmp(() => VA(this));
        }
        componentOnReady() {
          return qi(this).$onReadyPromise$;
        }
      };
      A.$lazyBundleId$ = p[0], !s.includes(B) && !o.get(B) && (i.push(B), o.define(B, _g(
        K,
        A,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + EA, u.setAttribute("data-styles", "");
    const p = (n = je.$nonce$) !== null && n !== void 0 ? n : kg(Qn);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((p) => p.connectedCallback()) : je.jmp(() => l = setTimeout(Mg, 30)), r();
}, rf = /* @__PURE__ */ new WeakMap(), qi = (t) => rf.get(t), WA = (t, e) => rf.set(e.$lazyInstance$ = t, e), XA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], rf.set(t, n);
}, oh = (t, e) => e in t, mo = (t, e) => (0, console.error)(t, e), qc = /* @__PURE__ */ new Map(), YA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = qc.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (qc.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => v$).then(o, mo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (qc.set(i, o), o[r]), mo);
}, ja = /* @__PURE__ */ new Map(), mc = typeof window < "u" ? window : {}, Qn = mc.document || { head: {} }, je = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Pg = (t) => Promise.resolve(t), ZA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ah = [], Ug = [], QA = (t, e) => (n) => {
  t.push(n), ql || (ql = !0, je.$flags$ & 4 ? sf(Xl) : je.raf(Xl));
}, ch = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      mo(n);
    }
  t.length = 0;
}, Xl = () => {
  ch(ah), ch(Ug), (ql = ah.length > 0) && je.raf(Xl);
}, sf = (t) => Pg().then(t), JA = /* @__PURE__ */ QA(Ug), t4 = () => Pg(), e4 = (t, e) => typeof window > "u" ? Promise.resolve() : t4().then(() => qA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var n4 = Object.defineProperty, r4 = Object.defineProperties, s4 = Object.getOwnPropertyDescriptors, za = Object.getOwnPropertySymbols, Hg = Object.prototype.hasOwnProperty, Og = Object.prototype.propertyIsEnumerable, lh = (t, e, n) => e in t ? n4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, wn = (t, e) => {
  for (var n in e || (e = {})) Hg.call(e, n) && lh(t, n, e[n]);
  if (za) for (var n of za(e)) Og.call(e, n) && lh(t, n, e[n]);
  return t;
}, Hn = (t, e) => r4(t, s4(e)), Dg = (t, e) => {
  var n = {};
  for (var r in t) Hg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && za) for (var r of za(t)) e.indexOf(r) < 0 && Og.call(t, r) && (n[r] = t[r]);
  return n;
};
function Fg() {
  return dc(Ps()) || window.StacksProvider || window.BlockstackProvider;
}
function xc(t) {
  return t ? typeof t == "string" ? Hs.fromName(t) : "version" in t ? t : "url" in t ? new Al({ url: t.url }) : t.transactionVersion === Ds.Mainnet ? new Al({ url: t.client.baseUrl }) : new vl({ url: t.client.baseUrl }) : new vl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var i4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(i4 || {}), o4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(o4 || {}), of = (t) => {
  let e = t;
  if (!e) {
    let n = new w0(["store_write"], document.location.href);
    e = new El({ appConfig: n });
  }
  return e;
};
function jg(t) {
  try {
    return of(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var zg = (t) => {
  let e = of(t).loadUserData().appPrivateKey, n = De.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function a4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Os.Mainnet]: "mainnet", [Os.Testnet]: "testnet" }, a = xc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function c4(t) {
  let e = xc(t.network), n = of(t.userSession), r = Hn(wn({}, t), { network: e, userSession: n });
  return wn({ stxAddress: a4(r) }, r);
}
async function l4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(hg) : n = n.map((r) => ft(Ag(r)))), new De.TokenSigner("ES256k", e).signAsync(Hn(wn({}, t), { postConditions: n }));
}
function u4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(hg) : e = e.map((n) => ft(Ag(n)))), De.createUnsecuredToken(Hn(wn({}, t), { postConditions: e }));
}
var f4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Dt(a.replace(/^0x/, "")), u = eE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Hn(wn({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, Hn(wn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, d4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = Dg(e, ["amount", "appDetails", "userSession"]);
  if (jg(i)) {
    let { privateKey: a, publicKey: c } = zg(i), u = Hn(wn({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), l4(u, a);
  }
  let o = Hn(wn({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), u4(o);
};
async function h4(t, e, n) {
  let r = await e(Hn(wn(wn({}, c4(t)), t), { network: xc(t.network) }));
  return f4({ token: r, options: t }, n);
}
function p4(t, e = Fg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return h4(t, d4, e);
}
function Rg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Hn(wn({}, t), { message: Hd(e), domain: Hd(n) }) : Hn(wn({}, t), { message: ft(js(e)), domain: ft(js(n)) });
}
async function g4(t, e) {
  return new De.TokenSigner("ES256k", e).signAsync(Rg(t));
}
async function y4(t) {
  let e = t, { userSession: n } = e, r = Dg(e, ["userSession"]);
  if (jg(n)) {
    let { privateKey: i, publicKey: s } = zg(n), o = Hn(wn({}, r), { publicKey: s });
    return g4(o, i);
  }
  return De.createUnsecuredToken(Rg(t));
}
var w4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(w4 || {}), Gg = "asigna-stx", uh = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === Gg && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(m4(t, e), "*");
}), b4 = { authenticationRequest: async (t) => uh(t, "authenticationRequest"), transactionRequest: async (t) => uh(t, "transactionRequest") }, m4 = (t, e) => ({ source: Gg, [e]: t }), x4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = b4);
};
x4();
var S4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function E4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Ps(), o = Fg();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    e4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : S4, c = hx(a), u = document.createElement("connect-modal");
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
    let g = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var oa = E4(p4);
function us(t, e, n) {
  return af(Ze(t, e), n);
}
function Ze(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ae(r);
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
      const r = $4(BigInt(`0x${Bt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Bt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function fh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function No(t, e = 8) {
  return (typeof t == "bigint" ? t : Ze(t, !1)).toString(16).padStart(e * 2, "0");
}
function Sc(t) {
  return parseInt(t, 16);
}
function af(t, e = 16) {
  const n = No(t, e);
  return ae(n);
}
function A4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function v4(t, e) {
  return t & BigInt(1) << e;
}
function $4(t, e) {
  return v4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const k4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += k4[n];
  return e;
}
function ae(t) {
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
function Wi(t) {
  return new TextEncoder().encode(t);
}
function cf(t) {
  return new TextDecoder().decode(t);
}
function Kg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function I4(t) {
  return String.fromCharCode.apply(null, t);
}
function L4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function dh(t) {
  if (t.some(L4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ec(...t) {
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
function Se(t) {
  return Ec(...t.map((e) => typeof e == "number" ? dh([e]) : e instanceof Array ? dh(e) : e));
}
var hh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hh || (hh = {}));
var ph;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(gh || (gh = {}));
const Vg = 33, Wc = 32;
function C4(t) {
  if (t.length < Wc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Wc * 2), r = t.slice(2 + Wc * 2);
  return {
    recoveryId: Sc(e),
    r: n,
    s: r
  };
}
function T4(t) {
  const e = typeof t == "string" ? ae(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function B4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function M4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function N4(t, e) {
  return t[e];
}
function _4(t, e, n = 0) {
  return t[n] = e, t;
}
function P4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function zs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Yl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yl || (Yl = {}));
const U4 = Yl.Mainnet, H4 = 128, O4 = 128, qg = 16, Is = 32, Zl = 80, Ac = 65, D4 = 32, F4 = 64, Ra = 34;
var lt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(lt || (lt = {}));
var It;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(It || (It = {}));
var Ql;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ql || (Ql = {}));
var rn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(rn || (rn = {}));
const Ea = ["onChainOnly", "offChainOnly", "any"], yh = {
  [Ea[0]]: rn.OnChainOnly,
  [Ea[1]]: rn.OffChainOnly,
  [Ea[2]]: rn.Any,
  [rn.OnChainOnly]: rn.OnChainOnly,
  [rn.OffChainOnly]: rn.OffChainOnly,
  [rn.Any]: rn.Any
};
function j4(t) {
  if (t in yh)
    return yh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ea.join(", ")}`);
}
var Ga;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ga || (Ga = {}));
Ga.Mainnet;
var Oi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Oi || (Oi = {}));
var sn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(sn || (sn = {}));
var ye;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ye || (ye = {}));
var te;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(te || (te = {}));
var Ka;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ka || (Ka = {}));
var he;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(he || (he = {}));
var xo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(xo || (xo = {}));
var Jl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Jl || (Jl = {}));
var So;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(So || (So = {}));
var wh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wh || (wh = {}));
var bh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(bh || (bh = {}));
function tu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function z4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Wg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function R4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  tu(t.outputLen), tu(t.blockLen);
}
function G4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function K4(t, e) {
  Wg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: tu,
  bool: z4,
  bytes: Wg,
  hash: R4,
  exists: G4,
  output: K4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kn = (t, e) => t << 32 - e | t >>> e, V4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!V4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function q4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function lf(t) {
  if (typeof t == "string" && (t = q4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Xg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ei(t) {
  const e = (r) => t().update(lf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function W4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class uf extends Xg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xc(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = lf(e);
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
    Es.exists(this), Es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    W4(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Xc(e), c = this.outputLen;
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
const X4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yg = Uint8Array.from({ length: 16 }, (t, e) => e), Y4 = Yg.map((t) => (9 * t + 5) % 16);
let ff = [Yg], df = [Y4];
for (let t = 0; t < 4; t++)
  for (let e of [ff, df])
    e.push(e[t].map((n) => X4[n]));
const Zg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Z4 = ff.map((t, e) => t.map((n) => Zg[e][n])), Q4 = df.map((t, e) => t.map((n) => Zg[e][n])), J4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), aa = (t, e) => t << e | t >>> 32 - e;
function mh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ca = new Uint32Array(16);
class ev extends uf {
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
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, A = J4[p], B = tv[p], K = ff[p], V = df[p], v = Z4[p], _ = Q4[p];
      for (let T = 0; T < 16; T++) {
        const S = aa(r + mh(p, s, a, u) + ca[K[T]] + A, v[T]) + l | 0;
        r = l, l = u, u = aa(a, 10) | 0, a = s, s = S;
      }
      for (let T = 0; T < 16; T++) {
        const S = aa(i + mh(E, o, c, d) + ca[V[T]] + B, _[T]) + g | 0;
        i = g, g = d, d = aa(c, 10) | 0, c = o, o = S;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ca.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const nv = ei(() => new ev()), rv = (t, e, n) => t & e ^ ~t & n, sv = (t, e, n) => t & e ^ t & n ^ e & n, iv = new Uint32Array([
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
class Qg extends uf {
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
      const g = Qr[l - 15], p = Qr[l - 2], E = Kn(g, 7) ^ Kn(g, 18) ^ g >>> 3, A = Kn(p, 17) ^ Kn(p, 19) ^ p >>> 10;
      Qr[l] = A + Qr[l - 7] + E + Qr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Kn(a, 6) ^ Kn(a, 11) ^ Kn(a, 25), p = d + g + rv(a, c, u) + iv[l] + Qr[l] | 0, A = (Kn(r, 2) ^ Kn(r, 13) ^ Kn(r, 22)) + sv(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + A | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Qr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class ov extends Qg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const hf = ei(() => new Qg());
ei(() => new ov());
const la = BigInt(2 ** 32 - 1), eu = BigInt(32);
function Jg(t, e = !1) {
  return e ? { h: Number(t & la), l: Number(t >> eu & la) } : { h: Number(t >> eu & la) | 0, l: Number(t & la) | 0 };
}
function av(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Jg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const cv = (t, e) => BigInt(t >>> 0) << eu | BigInt(e >>> 0), lv = (t, e, n) => t >>> n, uv = (t, e, n) => t << 32 - n | e >>> n, fv = (t, e, n) => t >>> n | e << 32 - n, dv = (t, e, n) => t << 32 - n | e >>> n, hv = (t, e, n) => t << 64 - n | e >>> n - 32, pv = (t, e, n) => t >>> n - 32 | e << 64 - n, gv = (t, e) => e, yv = (t, e) => t, wv = (t, e, n) => t << n | e >>> 32 - n, bv = (t, e, n) => e << n | t >>> 32 - n, mv = (t, e, n) => e << n - 32 | t >>> 64 - n, xv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Sv(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Ev = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Av = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $v = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, kv = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Iv = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, $t = {
  fromBig: Jg,
  split: av,
  toBig: cv,
  shrSH: lv,
  shrSL: uv,
  rotrSH: fv,
  rotrSL: dv,
  rotrBH: hv,
  rotrBL: pv,
  rotr32H: gv,
  rotr32L: yv,
  rotlSH: wv,
  rotlSL: bv,
  rotlBH: mv,
  rotlBL: xv,
  add: Sv,
  add3L: Ev,
  add3H: Av,
  add4L: vv,
  add4H: $v,
  add5H: Iv,
  add5L: kv
}, [Lv, Cv] = $t.split([
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
class vc extends uf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: p, Gl: E, Hh: A, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, g, p, E, A, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = A | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Jr[v] = e.getUint32(n), ts[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const _ = Jr[v - 15] | 0, T = ts[v - 15] | 0, S = $t.rotrSH(_, T, 1) ^ $t.rotrSH(_, T, 8) ^ $t.shrSH(_, T, 7), N = $t.rotrSL(_, T, 1) ^ $t.rotrSL(_, T, 8) ^ $t.shrSL(_, T, 7), P = Jr[v - 2] | 0, M = ts[v - 2] | 0, x = $t.rotrSH(P, M, 19) ^ $t.rotrBH(P, M, 61) ^ $t.shrSH(P, M, 6), b = $t.rotrSL(P, M, 19) ^ $t.rotrBL(P, M, 61) ^ $t.shrSL(P, M, 6), L = $t.add4L(N, b, ts[v - 7], ts[v - 16]), U = $t.add4H(L, S, x, Jr[v - 7], Jr[v - 16]);
      Jr[v] = U | 0, ts[v] = L | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: p, Fl: E, Gh: A, Gl: B, Hh: K, Hl: V } = this;
    for (let v = 0; v < 80; v++) {
      const _ = $t.rotrSH(l, g, 14) ^ $t.rotrSH(l, g, 18) ^ $t.rotrBH(l, g, 41), T = $t.rotrSL(l, g, 14) ^ $t.rotrSL(l, g, 18) ^ $t.rotrBL(l, g, 41), S = l & p ^ ~l & A, N = g & E ^ ~g & B, P = $t.add5L(V, T, N, Cv[v], ts[v]), M = $t.add5H(P, K, _, S, Lv[v], Jr[v]), x = P | 0, b = $t.rotrSH(r, i, 28) ^ $t.rotrBH(r, i, 34) ^ $t.rotrBH(r, i, 39), L = $t.rotrSL(r, i, 28) ^ $t.rotrBL(r, i, 34) ^ $t.rotrBL(r, i, 39), U = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      K = A | 0, V = B | 0, A = p | 0, B = E | 0, p = l | 0, E = g | 0, { h: l, l: g } = $t.add(u | 0, d | 0, M | 0, x | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const D = $t.add3L(x, L, J);
      r = $t.add3H(D, M, b, U), i = D | 0;
    }
    ({ h: r, l: i } = $t.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = $t.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = $t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = $t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = $t.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: p, l: E } = $t.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: A, l: B } = $t.add(this.Gh | 0, this.Gl | 0, A | 0, B | 0), { h: K, l: V } = $t.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, g, p, E, A, B, K, V);
  }
  roundClean() {
    Jr.fill(0), ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Tv extends vc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Bv extends vc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Mv extends vc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ei(() => new vc());
ei(() => new Tv());
const Nv = ei(() => new Bv());
ei(() => new Mv());
function ty(t) {
  if (ae(t).byteLength != Ac)
    throw Error("Invalid signature");
  return {
    type: lt.MessageSignature,
    data: t
  };
}
function io(t, e) {
  return { type: lt.Address, version: t, hash160: e };
}
function Si(t) {
  return Qs.c32address(t.version, t.hash160);
}
function Rs(t, e, n) {
  const r = e || 1, i = n || H4;
  if (wy(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: lt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function pf(t) {
  const e = Qs.c32addressDecode(t);
  return {
    type: lt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var X;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(X || (X = {}));
function _v(t) {
  if (t.type === X.PrincipalStandard)
    return Si(t.address);
  if (t.type === X.PrincipalContract)
    return `${Si(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function ey(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Hv(e, n);
  } else
    return Pv(t);
}
function Pv(t) {
  const e = pf(t);
  return { type: X.PrincipalStandard, address: e };
}
function Uv(t) {
  return { type: X.PrincipalStandard, address: t };
}
function Hv(t, e) {
  const n = pf(t), r = Rs(e);
  return ny(n, r);
}
function ny(t, e) {
  if (Wi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: X.PrincipalContract, address: t, contractName: e };
}
function Yc(t, e = !1) {
  switch (t.type) {
    case X.BoolTrue:
      return !0;
    case X.BoolFalse:
      return !1;
    case X.Int:
    case X.UInt:
      return e ? t.value.toString() : t.value;
    case X.Buffer:
      return `0x${Bt(t.buffer)}`;
    case X.OptionalNone:
      return null;
    case X.OptionalSome:
      return Xn(t.value);
    case X.ResponseErr:
      return Xn(t.value);
    case X.ResponseOk:
      return Xn(t.value);
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return _v(t);
    case X.List:
      return t.list.map((r) => Xn(r));
    case X.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Xn(t.data[r]);
      }), n;
    case X.StringASCII:
      return t.data;
    case X.StringUTF8:
      return t.data;
  }
}
function Xn(t) {
  switch (t.type) {
    case X.ResponseErr:
      return { type: rs(t), value: Yc(t, !0), success: !1 };
    case X.ResponseOk:
      return { type: rs(t), value: Yc(t, !0), success: !0 };
    default:
      return { type: rs(t), value: Yc(t, !0) };
  }
}
function rs(t) {
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
      return `(optional ${rs(t.value)})`;
    case X.ResponseErr:
      return `(response UnknownType ${rs(t.value)})`;
    case X.ResponseOk:
      return `(response ${rs(t.value)} UnknownType)`;
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return "principal";
    case X.List:
      return `(list ${t.list.length} ${t.list.length ? rs(t.list[0]) : "UnknownType"})`;
    case X.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${rs(t.data[e])})`).join(" ")})`;
    case X.StringASCII:
      return `(string-ascii ${Kg(t.data).length})`;
    case X.StringUTF8:
      return `(string-utf8 ${Wi(t.data).length})`;
  }
}
const ry = () => ({ type: X.BoolTrue }), sy = () => ({ type: X.BoolFalse }), Ov = (t) => t ? ry() : sy(), xh = BigInt("0xffffffffffffffffffffffffffffffff"), Dv = BigInt(0), Sh = BigInt("0x7fffffffffffffffffffffffffffffff"), Eh = BigInt("-170141183460469231731687303715884105728"), Fv = (t) => {
  const e = Ze(t, !0);
  if (e > Sh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Sh}`);
  if (e < Eh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Eh}`);
  return { type: X.Int, value: e };
}, Jn = (t) => {
  const e = Ze(t, !1);
  if (e < Dv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > xh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${xh}`);
  return { type: X.UInt, value: e };
}, iy = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: X.Buffer, buffer: t };
};
function oy() {
  return { type: X.OptionalNone };
}
function ay(t) {
  return { type: X.OptionalSome, value: t };
}
function jv(t) {
  return { type: X.ResponseErr, value: t };
}
function zv(t) {
  return { type: X.ResponseOk, value: t };
}
function Rv(t) {
  return { type: X.List, list: t };
}
function Gs(t) {
  for (const e in t)
    if (!M8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: X.Tuple, data: t };
}
const Oe = (t) => ({ type: X.StringASCII, data: t }), Gv = (t) => ({ type: X.StringUTF8, data: t });
class cy extends Xg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Es.hash(e);
    const r = lf(n);
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
    return Es.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Es.exists(this), Es.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ly = (t, e, n) => new cy(t, e).update(n).digest();
ly.create = (t, e) => new cy(t, e);
we.hmacSha256Sync = (t, ...e) => {
  const n = ly.create(hf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Di(t) {
  return {
    type: lt.PublicKey,
    data: ae(t)
  };
}
function Kv(t, e, n = he.Compressed) {
  const r = C4(e.data), i = new gn(fh(r.r), fh(r.s)), s = Lt.fromSignature(t, i, r.recoveryId), o = n === he.Compressed;
  return s.toHex(o);
}
function Vv(t) {
  return { type: lt.PublicKey, data: t };
}
function Xi(t) {
  return !Bt(t.data).startsWith("04");
}
function Va(t) {
  return t.data.slice();
}
function qv(t) {
  const e = Yv(t), n = Lo(e.data.slice(0, 32), e.compressed);
  return Di(Bt(n));
}
function Wv(t) {
  const e = typeof t == "string" ? t : Bt(t), n = Lt.fromHex(e).toHex(!0);
  return Di(n);
}
function Xv(t) {
  const e = typeof t == "string" ? t : Bt(t), n = Lt.fromHex(e).toHex(!1);
  return Di(n);
}
function nu(t) {
  const e = t.readUInt8(), n = e === 4 ? F4 : D4;
  return Vv(Se([e, t.readBytes(n)]));
}
function Yv(t) {
  const e = T4(t), n = e.length == Vg;
  return { data: e, compressed: n };
}
function Zv(t, e) {
  const [n, r] = nc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = No(r, 1) + gn.fromHex(n).toCompactHex();
  return ty(s);
}
function Qv(t) {
  return qv(t.data);
}
function Jv(t, e, n) {
  return typeof t == "string" && (t = ey(t)), typeof n == "string" && (n = $h(n)), {
    type: lt.Payload,
    payloadType: It.TokenTransfer,
    recipient: t,
    amount: Ze(e, !1),
    memo: n ?? $h("")
  };
}
function t8(t, e, n, r) {
  return typeof t == "string" && (t = pf(t)), typeof e == "string" && (e = Rs(e)), typeof n == "string" && (n = Rs(n)), {
    type: lt.Payload,
    payloadType: It.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Ah(t, e, n) {
  return typeof t == "string" && (t = Rs(t)), typeof e == "string" && (e = l8(e)), typeof n == "number" ? {
    type: lt.Payload,
    payloadType: It.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: lt.Payload,
    payloadType: It.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function e8() {
  return { type: lt.Payload, payloadType: It.PoisonMicroblock };
}
function vh(t, e) {
  if (t.byteLength != Is)
    throw Error(`Coinbase buffer size must be ${Is} bytes`);
  return e != null ? {
    type: lt.Payload,
    payloadType: It.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: lt.Payload,
    payloadType: It.Coinbase,
    coinbaseBytes: t
  };
}
function n8(t, e, n) {
  if (t.byteLength != Is)
    throw Error(`Coinbase buffer size must be ${Is} bytes`);
  if (n.byteLength != Zl)
    throw Error(`VRF proof buffer size must be ${Zl} bytes`);
  return {
    type: lt.Payload,
    payloadType: It.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === X.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ru;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ru || (ru = {}));
function r8(t, e, n, r, i, s, o) {
  return {
    type: lt.Payload,
    payloadType: It.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function uy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case It.TokenTransfer:
      e.push(me(t.recipient)), e.push(us(t.amount, !1, 8)), e.push(yr(t.memo));
      break;
    case It.ContractCall:
      e.push(yr(t.contractAddress)), e.push(yr(t.contractName)), e.push(yr(t.functionName));
      const n = new Uint8Array(4);
      zs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(me(r));
      });
      break;
    case It.SmartContract:
      e.push(yr(t.contractName)), e.push(yr(t.codeBody));
      break;
    case It.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(yr(t.contractName)), e.push(yr(t.codeBody));
      break;
    case It.PoisonMicroblock:
      break;
    case It.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case It.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(me(t.recipient));
      break;
    case It.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(me(t.recipient ? ay(t.recipient) : oy())), e.push(t.vrfProof);
      break;
    case It.TenureChange:
      e.push(ae(t.tenureHash)), e.push(ae(t.previousTenureHash)), e.push(ae(t.burnViewHash)), e.push(ae(t.previousTenureEnd)), e.push(zs(new Uint8Array(4), t.previousTenureBlocks)), e.push(_4(new Uint8Array(1), t.cause)), e.push(ae(t.publicKeyHash));
      break;
  }
  return Se(e);
}
function s8(t) {
  switch (t.readUInt8Enum(It, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case It.TokenTransfer:
      const n = kn(t), r = Ze(t.readBytes(8), !1), i = dy(t);
      return Jv(n, r, i);
    case It.ContractCall:
      const s = Fi(t), o = $n(t), a = $n(t), c = [], u = t.readUInt32BE();
      for (let v = 0; v < u; v++) {
        const _ = kn(t);
        c.push(_);
      }
      return t8(s, o, a, c);
    case It.SmartContract:
      const d = $n(t), l = $n(t, 4, 1e5);
      return Ah(d, l);
    case It.VersionedSmartContract: {
      const v = t.readUInt8Enum(Ql, (S) => {
        throw new Error(`Cannot recognize ClarityVersion: ${S}`);
      }), _ = $n(t), T = $n(t, 4, 1e5);
      return Ah(_, T, v);
    }
    case It.PoisonMicroblock:
      return e8();
    case It.Coinbase: {
      const v = t.readBytes(Is);
      return vh(v);
    }
    case It.CoinbaseToAltRecipient: {
      const v = t.readBytes(Is), _ = kn(t);
      return vh(v, _);
    }
    case It.NakamotoCoinbase: {
      const v = t.readBytes(Is), _ = kn(t), T = t.readBytes(Zl);
      return n8(v, _, T);
    }
    case It.TenureChange:
      const g = Bt(t.readBytes(20)), p = Bt(t.readBytes(20)), E = Bt(t.readBytes(20)), A = Bt(t.readBytes(32)), B = t.readUInt32BE(), K = t.readUInt8Enum(ru, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), V = Bt(t.readBytes(20));
      return r8(g, p, E, A, B, K, V);
  }
}
class $c extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ws extends $c {
  constructor(e) {
    super(e);
  }
}
class pn extends $c {
  constructor(e) {
    super(e);
  }
}
class qa extends $c {
  constructor(e) {
    super(e);
  }
}
class As extends $c {
  constructor(e) {
    super(e);
  }
}
var _n;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(_n || (_n = {}));
function su(t) {
  return ty(Bt(t.readBytes(Ac)));
}
function Ei(t, e) {
  return {
    pubKeyEncoding: t,
    type: lt.TransactionAuthField,
    contents: e
  };
}
function i8(t) {
  const e = t.readUInt8Enum(_n, (n) => {
    throw new pn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case _n.PublicKeyCompressed:
      return Ei(he.Compressed, nu(t));
    case _n.PublicKeyUncompressed:
      return Ei(he.Uncompressed, Xv(nu(t).data));
    case _n.SignatureCompressed:
      return Ei(he.Compressed, su(t));
    case _n.SignatureUncompressed:
      return Ei(he.Uncompressed, su(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function gf(t) {
  return ae(t.data);
}
function o8(t) {
  const e = [];
  switch (t.contents.type) {
    case lt.PublicKey:
      e.push(t.pubKeyEncoding === he.Compressed ? _n.PublicKeyCompressed : _n.PublicKeyUncompressed), e.push(Va(Wv(t.contents.data)));
      break;
    case lt.MessageSignature:
      e.push(t.pubKeyEncoding === he.Compressed ? _n.SignatureCompressed : _n.SignatureUncompressed), e.push(gf(t.contents));
      break;
  }
  return Se(e);
}
function yr(t) {
  switch (t.type) {
    case lt.Address:
      return _o(t);
    case lt.Principal:
      return fy(t);
    case lt.LengthPrefixedString:
      return ji(t);
    case lt.MemoString:
      return u8(t);
    case lt.AssetInfo:
      return hy(t);
    case lt.PostCondition:
      return f8(t);
    case lt.PublicKey:
      return Va(t);
    case lt.LengthPrefixedList:
      return bf(t);
    case lt.Payload:
      return uy(t);
    case lt.TransactionAuthField:
      return o8(t);
    case lt.MessageSignature:
      return gf(t);
  }
}
function a8() {
  return {
    type: lt.Address,
    version: Ka.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function yf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === te.SerializeP2PKH || e === te.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === te.SerializeP2WPKH || e === te.SerializeP2WSH || e === te.SerializeP2WSHNonSequential) && !r.every(Xi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case te.SerializeP2PKH:
      return io(t, L8(r[0].data));
    case te.SerializeP2WPKH:
      return io(t, C8(r[0].data));
    case te.SerializeP2SH:
    case te.SerializeP2SHNonSequential:
      return io(t, T8(n, r.map(Va)));
    case te.SerializeP2WSH:
    case te.SerializeP2WSHNonSequential:
      return io(t, B8(n, r.map(Va)));
  }
}
function _o(t) {
  const e = [];
  return e.push(ae(No(t.version, 1))), e.push(ae(t.hash160)), Se(e);
}
function Fi(t) {
  const e = Sc(Bt(t.readBytes(1))), n = Bt(t.readBytes(20));
  return { type: lt.Address, version: e, hash160: n };
}
function fy(t) {
  const e = [];
  return e.push(t.prefix), e.push(_o(t.address)), t.prefix === So.Contract && e.push(ji(t.contractName)), Se(e);
}
function c8(t) {
  const e = t.readUInt8Enum(So, (i) => {
    throw new pn(`Unexpected Principal payload type: ${i}`);
  }), n = Fi(t);
  if (e === So.Standard)
    return { type: lt.Principal, prefix: e, address: n };
  const r = $n(t);
  return {
    type: lt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function ji(t) {
  const e = [], n = Wi(t.content), r = n.byteLength;
  return e.push(ae(No(r, t.lengthPrefixBytes))), e.push(n), Se(e);
}
function $n(t, e, n) {
  e = e || 1;
  const r = Sc(Bt(t.readBytes(e))), i = cf(t.readBytes(r));
  return Rs(i, e, n ?? 128);
}
function l8(t) {
  return Rs(t, 4, 1e5);
}
function $h(t) {
  if (t && wy(t, Ra))
    throw new Error(`Memo exceeds maximum length of ${Ra} bytes`);
  return { type: lt.MemoString, content: t };
}
function u8(t) {
  const e = [], n = Wi(t.content), r = I8(Bt(n), Ra * 2);
  return e.push(ae(r)), Se(e);
}
function dy(t) {
  let e = cf(t.readBytes(Ra));
  return e = e.replace(/\u0000*$/, ""), { type: lt.MemoString, content: e };
}
function hy(t) {
  const e = [];
  return e.push(_o(t.address)), e.push(ji(t.contractName)), e.push(ji(t.assetName)), Se(e);
}
function iu(t) {
  return {
    type: lt.AssetInfo,
    address: Fi(t),
    contractName: $n(t),
    assetName: $n(t)
  };
}
function wf(t, e) {
  return {
    type: lt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function bf(t) {
  const e = t.values, n = [];
  n.push(ae(No(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(yr(r));
  return Se(n);
}
function py(t, e, n) {
  const r = Sc(Bt(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case lt.Address:
        i.push(Fi(t));
        break;
      case lt.LengthPrefixedString:
        i.push($n(t));
        break;
      case lt.MemoString:
        i.push(dy(t));
        break;
      case lt.AssetInfo:
        i.push(iu(t));
        break;
      case lt.PostCondition:
        i.push(d8(t));
        break;
      case lt.PublicKey:
        i.push(nu(t));
        break;
      case lt.TransactionAuthField:
        i.push(i8(t));
        break;
    }
  return wf(i, n);
}
function f8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(fy(t.principal)), (t.conditionType === sn.Fungible || t.conditionType === sn.NonFungible) && e.push(hy(t.assetInfo)), t.conditionType === sn.NonFungible && e.push(me(t.assetName)), e.push(t.conditionCode), t.conditionType === sn.STX || t.conditionType === sn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ws("The post-condition amount may not be larger than 8 bytes");
    e.push(us(t.amount, !1, 8));
  }
  return Se(e);
}
function d8(t) {
  const e = t.readUInt8Enum(sn, (o) => {
    throw new pn(`Could not read ${o} as PostConditionType`);
  }), n = c8(t);
  let r, i, s;
  switch (e) {
    case sn.STX:
      return r = t.readUInt8Enum(xo, (a) => {
        throw new pn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Bt(t.readBytes(8))}`), {
        type: lt.PostCondition,
        conditionType: sn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case sn.Fungible:
      return i = iu(t), r = t.readUInt8Enum(xo, (a) => {
        throw new pn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Bt(t.readBytes(8))}`), {
        type: lt.PostCondition,
        conditionType: sn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case sn.NonFungible:
      i = iu(t);
      const o = kn(t);
      return r = t.readUInt8Enum(Jl, (a) => {
        throw new pn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: lt.PostCondition,
        conditionType: sn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function sr(t, e) {
  return Se([t, e]);
}
function h8(t) {
  return new Uint8Array([t.type]);
}
function p8(t) {
  return t.type === X.OptionalNone ? new Uint8Array([t.type]) : sr(t.type, me(t.value));
}
function g8(t) {
  const e = new Uint8Array(4);
  return zs(e, t.buffer.length, 0), sr(t.type, Ec(e, t.buffer));
}
function y8(t) {
  const e = af(A4(t.value, BigInt(O4)), qg);
  return sr(t.type, e);
}
function w8(t) {
  const e = af(t.value, qg);
  return sr(t.type, e);
}
function b8(t) {
  return sr(t.type, _o(t.address));
}
function m8(t) {
  return sr(t.type, Ec(_o(t.address), ji(t.contractName)));
}
function x8(t) {
  return sr(t.type, me(t.value));
}
function S8(t) {
  const e = [], n = new Uint8Array(4);
  zs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = me(r);
    e.push(i);
  }
  return sr(t.type, Se(e));
}
function E8(t) {
  const e = [], n = new Uint8Array(4);
  zs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Rs(i);
    e.push(ji(s));
    const o = me(t.data[i]);
    e.push(o);
  }
  return sr(t.type, Se(e));
}
function gy(t, e) {
  const n = [], r = e == "ascii" ? Kg(t.data) : Wi(t.data), i = new Uint8Array(4);
  return zs(i, r.length, 0), n.push(i), n.push(r), sr(t.type, Se(n));
}
function A8(t) {
  return gy(t, "ascii");
}
function v8(t) {
  return gy(t, "utf8");
}
function me(t) {
  switch (t.type) {
    case X.BoolTrue:
    case X.BoolFalse:
      return h8(t);
    case X.OptionalNone:
    case X.OptionalSome:
      return p8(t);
    case X.Buffer:
      return g8(t);
    case X.UInt:
      return w8(t);
    case X.Int:
      return y8(t);
    case X.PrincipalStandard:
      return b8(t);
    case X.PrincipalContract:
      return m8(t);
    case X.ResponseOk:
    case X.ResponseErr:
      return x8(t);
    case X.List:
      return S8(t);
    case X.Tuple:
      return E8(t);
    case X.StringASCII:
      return A8(t);
    case X.StringUTF8:
      return v8(t);
    default:
      throw new ws("Unable to serialize. Invalid Clarity Value.");
  }
}
function $8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const kh = /* @__PURE__ */ new Map();
function yy(t, e) {
  const n = kh.get(t);
  if (n !== void 0)
    return n(e);
  const r = $8(t);
  return kh.set(t, r), yy(t, e);
}
class uo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return P4(this.readBytes(4), 0);
  }
  readUInt8() {
    return N4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return B4(this.readBytes(2), 0);
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
    if (yy(e, r))
      return r;
    throw n(r);
  }
}
function kn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new uo(ae(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new uo(t) : e = t;
  switch (e.readUInt8Enum(X, (r) => {
    throw new pn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case X.Int:
      return Fv(e.readBytes(16));
    case X.UInt:
      return Jn(e.readBytes(16));
    case X.Buffer:
      const r = e.readUInt32BE();
      return iy(e.readBytes(r));
    case X.BoolTrue:
      return ry();
    case X.BoolFalse:
      return sy();
    case X.PrincipalStandard:
      const i = Fi(e);
      return Uv(i);
    case X.PrincipalContract:
      const s = Fi(e), o = $n(e);
      return ny(s, o);
    case X.ResponseOk:
      return zv(kn(e));
    case X.ResponseErr:
      return jv(kn(e));
    case X.OptionalNone:
      return oy();
    case X.OptionalSome:
      return ay(kn(e));
    case X.List:
      const a = e.readUInt32BE(), c = [];
      for (let A = 0; A < a; A++)
        c.push(kn(e));
      return Rv(c);
    case X.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let A = 0; A < u; A++) {
        const B = $n(e).content;
        if (B === void 0)
          throw new pn('"content" is undefined');
        d[B] = kn(e);
      }
      return Gs(d);
    case X.StringASCII:
      const l = e.readUInt32BE(), g = I4(e.readBytes(l));
      return Oe(g);
    case X.StringUTF8:
      const p = e.readUInt32BE(), E = cf(e.readBytes(p));
      return Gv(E);
    default:
      throw new pn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const k8 = (t) => t.length % 2 == 0 ? t : `0${t}`, I8 = (t, e) => t.padEnd(e, "0"), wy = (t, e) => t ? Wi(t).length > e : !1;
function ou(t) {
  return Up(t);
}
const Eo = (t) => nv(hf(t)), mf = (t) => Bt(Nv(t)), L8 = (t) => Bt(Eo(t)), C8 = (t) => {
  const e = Eo(t), n = Ec(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Eo(n);
  return Bt(r);
}, T8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Se(n), i = Eo(r);
  return Bt(i);
}, B8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Se(n), i = hf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Se(s), a = Eo(o);
  return Bt(a);
};
function M8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function by(t) {
  const e = me(t);
  return `0x${Bt(e)}`;
}
function N8(t) {
  return kn(t);
}
const vi = (t) => {
  try {
    return Qs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function xf() {
  return {
    type: lt.MessageSignature,
    data: Bt(new Uint8Array(Ac))
  };
}
function my(t, e, n, r) {
  const i = yf(0, t, 1, [Di(e)]).hash160, s = Xi(Di(e)) ? he.Compressed : he.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Ze(n, !1),
    fee: Ze(r, !1),
    keyEncoding: s,
    signature: xf()
  };
}
function Ao(t) {
  return "signature" in t;
}
function Ih(t) {
  return t === te.SerializeP2SH || t === te.SerializeP2WSH;
}
function _8(t) {
  return t === te.SerializeP2SHNonSequential || t === te.SerializeP2WSHNonSequential;
}
function Lh(t) {
  const e = ou(t);
  return e.nonce = 0, e.fee = 0, Ao(e) ? e.signature = xf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function P8(t) {
  const e = [
    t.hashMode,
    ae(t.signer),
    us(t.nonce, !1, 8),
    us(t.fee, !1, 8),
    t.keyEncoding,
    gf(t.signature)
  ];
  return Se(e);
}
function U8(t) {
  const e = [
    t.hashMode,
    ae(t.signer),
    us(t.nonce, !1, 8),
    us(t.fee, !1, 8)
  ], n = wf(t.fields);
  e.push(bf(n));
  const r = new Uint8Array(2);
  return M4(r, t.signaturesRequired, 0), e.push(r), Se(e);
}
function H8(t, e) {
  const n = Bt(e.readBytes(20)), r = BigInt(`0x${Bt(e.readBytes(8))}`), i = BigInt(`0x${Bt(e.readBytes(8))}`), s = e.readUInt8Enum(he, (a) => {
    throw new pn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === te.SerializeP2WPKH && s != he.Compressed)
    throw new pn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = su(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function O8(t, e) {
  const n = Bt(e.readBytes(20)), r = BigInt("0x" + Bt(e.readBytes(8))), i = BigInt("0x" + Bt(e.readBytes(8))), s = py(e, lt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case lt.PublicKey:
        Xi(u.contents) || (o = !0);
        break;
      case lt.MessageSignature:
        if (u.pubKeyEncoding === he.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new As("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === te.SerializeP2WSH || t === te.SerializeP2WSHNonSequential))
    throw new As("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Zc(t) {
  return Ao(t) ? P8(t) : U8(t);
}
function Qc(t) {
  const e = t.readUInt8Enum(te, (n) => {
    throw new pn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === te.SerializeP2PKH || e === te.SerializeP2WPKH ? H8(e, t) : O8(e, t);
}
function xy(t, e, n, r) {
  const s = t + Bt(new Uint8Array([e])) + Bt(us(n, !1, 8)) + Bt(us(r, !1, 8));
  if (ae(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return mf(ae(s));
}
function Sy(t, e, n) {
  const r = 33 + Ac, i = Xi(e) ? he.Compressed : he.Uncompressed, s = t + k8(i.toString(16)) + n.data, o = ae(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return mf(o);
}
function D8(t, e, n, r, i) {
  const s = xy(t, e, n, r), o = Zv(i, s), a = Qv(i), c = Sy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ey(t, e, n, r, i, s) {
  const o = xy(t, e, n, r), a = Di(Kv(o, s, i)), c = Sy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function F8() {
  const t = my(te.SerializeP2PKH, "", 0, 0);
  return t.signer = a8().hash160, t.keyEncoding = he.Compressed, t.signature = xf(), t;
}
function Ch(t, e, n) {
  return Ao(t) ? j8(t, e, n) : z8(t, e, n);
}
function j8(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Ey(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = yf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new As(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function z8(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case lt.PublicKey:
        Xi(c.contents) || (s = !0), r.push(c.contents);
        break;
      case lt.MessageSignature:
        c.pubKeyEncoding === he.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = Ey(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Ih(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new As("Too many signatures");
        break;
    }
  if (Ih(t.hashMode) && o !== t.signaturesRequired || _8(t.hashMode) && o < t.signaturesRequired)
    throw new As("Incorrect number of signatures");
  if (s && (t.hashMode === te.SerializeP2WSH || t.hashMode === te.SerializeP2WSHNonSequential))
    throw new As("Uncompressed keys are not allowed in this hash mode");
  const a = yf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new As(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Ay(t) {
  return {
    authType: ye.Standard,
    spendingCondition: t
  };
}
function vy(t, e) {
  return {
    authType: ye.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || my(te.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Th(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ye.Standard:
        return Ay(Lh(t.spendingCondition));
      case ye.Sponsored:
        return vy(Lh(t.spendingCondition), F8());
      default:
        throw new qa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function R8(t, e) {
  switch (t.authType) {
    case ye.Standard:
      return Ch(t.spendingCondition, e, ye.Standard);
    case ye.Sponsored:
      return Ch(t.spendingCondition, e, ye.Standard);
    default:
      throw new qa("Invalid origin auth type");
  }
}
function G8(t, e) {
  switch (t.authType) {
    case ye.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ze(e, !1)
      };
      return { ...t, spendingCondition: n };
    case ye.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ze(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function K8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ze(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function V8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ze(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function q8(t, e) {
  const n = {
    ...e,
    nonce: Ze(e.nonce, !1),
    fee: Ze(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function W8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ye.Standard:
      e.push(Zc(t.spendingCondition));
      break;
    case ye.Sponsored:
      e.push(Zc(t.spendingCondition)), e.push(Zc(t.sponsorSpendingCondition));
      break;
  }
  return Se(e);
}
function X8(t) {
  const e = t.readUInt8Enum(ye, (r) => {
    throw new pn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ye.Standard:
      return n = Qc(t), Ay(n);
    case ye.Sponsored:
      n = Qc(t);
      const r = Qc(t);
      return vy(n, r);
  }
}
class Y8 {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ze(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? U4, this.postConditionMode = s ?? Oi.Deny, this.postConditions = i ?? wf([]), o)
      this.anchorMode = j4(o);
    else
      switch (r.payloadType) {
        case It.Coinbase:
        case It.CoinbaseToAltRecipient:
        case It.NakamotoCoinbase:
        case It.PoisonMicroblock:
        case It.TenureChange:
          this.anchorMode = rn.OnChainOnly;
          break;
        case It.ContractCall:
        case It.SmartContract:
        case It.VersionedSmartContract:
        case It.TokenTransfer:
          this.anchorMode = rn.Any;
          break;
      }
  }
  signBegin() {
    const e = ou(this);
    return e.auth = Th(e.auth), e.txid();
  }
  verifyBegin() {
    const e = ou(this);
    return e.auth = Th(e.auth), e.txid();
  }
  verifyOrigin() {
    return R8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ye.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ye.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ye.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Ao(n)) {
      const r = Xi(e);
      n.fields.push(Ei(r ? he.Compressed : he.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = D8(n, r, e.fee, e.nonce, i);
    return Ao(e) ? e.signature = s : e.fields.push(Ei(i.data.byteLength === Vg ? he.Compressed : he.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return mf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ye.Sponsored)
      throw new qa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = q8(this.auth, e);
  }
  setFee(e) {
    this.auth = G8(this.auth, e);
  }
  setNonce(e) {
    this.auth = K8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ye.Sponsored)
      throw new qa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = V8(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ws('"version" is undefined');
    if (this.chainId === void 0)
      throw new ws('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ws('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ws('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ws('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return zs(n, this.chainId, 0), e.push(n), e.push(W8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(bf(this.postConditions)), e.push(uy(this.payload)), Se(e);
  }
}
function Wa(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new uo(ae(t.slice(2))) : e = new uo(ae(t)) : t instanceof Uint8Array ? e = new uo(t) : e = t;
  const n = e.readUInt8Enum(Ga, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = X8(e), s = e.readUInt8Enum(rn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Oi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = py(e, lt.PostCondition), c = s8(e);
  return new Y8(n, i, c, a, o, s, r);
}
const Z8 = Ov, fo = Jn, Q8 = iy;
const J8 = /* @__PURE__ */ new Set([4001, -31001]), t5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], e5 = ["result", "data", "payload", "response", "params"], Bh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], kc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ni = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, mr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, n5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), $y = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => n5(s, r)) === i
  );
}, ky = (t) => t ? $y(ni()).some(
  (e) => {
    var n;
    return e.id === t && (kc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Iy = () => {
  if (typeof window > "u")
    return;
  const t = ni(), e = $y(t).filter(
    (n) => {
      var r;
      return kc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = mr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of t5) {
    const r = mr(t, n) ?? (t === window ? void 0 : mr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, r5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ni(), n = mr(e, t) ?? (e === window ? void 0 : mr(window, t)) ?? dc(t);
  if (n)
    return n;
  if (kc(t) || ky(t))
    return Iy();
}, ua = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, s5 = ["blockstack-session", "blockstack"], i5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of s5) {
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
i5();
const Ly = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, hn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, o5 = (t) => {
  const e = hn(t);
  if (!e)
    return null;
  const n = Ly(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, a5 = (t) => {
  const e = hn(t);
  if (!e)
    return null;
  const n = Ly(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, au = (t, e = "mainnet") => {
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
      return au(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return au(r, e);
  }
  return e;
}, Ls = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, vo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return vi(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = vo(i, e + 1);
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
    const s = vo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && vi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && vi(n.testnet) ? n.testnet.trim() : null;
}, Mh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Cy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && J8.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ks = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = hn(n == null ? void 0 : n.message) ?? hn(e.message) ?? hn(e.error) ?? hn(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, zi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ks(e);
    if (e.status === "error")
      throw Ks(e.result ?? e);
  }
  return t;
}, Nh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return zi(r);
  } catch (r) {
    throw Ks(r);
  }
}, Ty = () => Iy(), Sf = () => {
  if (typeof window > "u")
    return;
  const t = ni();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = mr(t, e) ?? (t === window ? void 0 : mr(window, e));
    if (n)
      return n;
  }
}, _h = () => {
  if (typeof window > "u")
    return;
  const t = Sf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ni();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = mr(e, n) ?? (e === window ? void 0 : mr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Aa = (t) => {
  var r, i;
  const e = Ps();
  if (kc(e) || ky(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ni() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === Ty();
}, Jc = (t) => {
  const e = a5(t);
  if (!e)
    return null;
  try {
    const n = Wa(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Xa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Jc(t), r = o5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? hn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Xa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of Bh)
    if (Jc(i[a])) {
      s = hn(i[a]);
      break;
    }
  const o = hn(i.txId) || hn(i.txid) || hn(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? hn(i.txRaw) ?? void 0
    };
  for (const a of Bh) {
    const c = Jc(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: hn(i[a]) ?? void 0
      };
  }
  for (const a of e5) {
    const c = i[a], u = Xa(c, e + 1);
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
}, tl = (t) => {
  const e = Xa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, c5 = (t) => {
  const e = Xa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, l5 = (t) => ({
  ...t,
  fee: Ls(t.fee),
  nonce: Ls(t.nonce),
  sponsored: t.sponsored === !0
}), Ph = (t) => ({
  recipient: t.recipient,
  amount: Ls(t.amount) ?? "0",
  memo: t.memo,
  network: au(t.network),
  address: t.stxAddress,
  fee: Ls(t.fee),
  nonce: Ls(t.nonce),
  sponsored: t.sponsored ?? !1
}), By = "WALLET_ADDRESS_MISMATCH", u5 = 45e3;
let ho = null;
const cu = (t) => {
  t && (ho = { address: t, at: Date.now() });
}, f5 = () => {
  ho = null;
}, d5 = () => ho && Date.now() - ho.at <= u5 ? ho.address : null, h5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, p5 = async (t) => {
  f5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = zi(await t.request("wallet_connect")), n = vo(e);
  return cu(n), n;
}, g5 = async (t, e, n, r) => {
  try {
    return zi(await t.request(e, n));
  } catch (i) {
    const s = Ks(i);
    if (!h5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await p5(t);
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
        { code: o ? By : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return zi(await t.request(e, n));
    } catch (a) {
      throw Ks(a);
    }
  }
};
let Uh = 3e4;
const y5 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
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
}, w5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: By }
      );
    return c;
  }, i = d5();
  if (i)
    return ua(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  ua(n, "account-read");
  try {
    const c = zi(
      await y5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = vo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (Cy(c))
      throw Ks(c);
    ua(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return cu(s), r(s, "wallet_getAccount");
  let o;
  ua(n, "account-reconnect");
  try {
    o = zi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ks(c);
  }
  const a = vo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return cu(a), r(a, "wallet_connect");
}, b5 = async (t, e) => {
  if (!Aa(t)) {
    const s = await Nh(
      t,
      "stx_transferStx",
      Ph(e)
    );
    return tl(s);
  }
  const n = Sf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Nh(
      n,
      "stx_transferStx",
      Ph(e)
    );
    return tl(s);
  }
  const r = Ty();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await w5(r, e.stxAddress);
  const i = await g5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ls(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ls(e.fee) } : {}
    },
    e.stxAddress
  );
  return tl(i);
}, m5 = () => Ps(), My = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Ps(), e = t ? r5(t) : void 0;
  if (e)
    return e;
  const n = ni() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Hh = (t, e) => {
  const n = My(), r = l5({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, c5(i));
    }
  });
  if (!n || typeof n.request != "function")
    return oa(r, e);
  if (Aa(n) && !Sf()) {
    const i = _h();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ps(),
        route: "legacy-transaction-request"
      }), oa(r, i);
  }
  return void b5(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Mh(i) && Aa(n)) {
      const a = _h();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ps(),
          route: "legacy-transaction-request"
        }), oa(r, a);
        return;
      }
    }
    if (Mh(i) && !Aa(n)) {
      oa(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), Cy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Oh = (t) => by(t).replace(/^0x/, ""), Dh = "This wallet cannot sign messages. Try Xverse or Leather.", Fh = (t) => typeof (t == null ? void 0 : t.request) == "function", jh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", x5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, S5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function E5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Oh(e.message),
    domain: Oh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function A5(t, e) {
  const n = await y4({
    domain: e.domain,
    message: e.message,
    network: xc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function zh(t) {
  var i, s;
  const e = m5() || "", n = /xverse/i.test(e);
  let r = My();
  if (n && !jh(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (jh(r))
    try {
      return await A5(r, t);
    } catch (o) {
      if (n || !Fh(r) || !S5(o)) throw o;
    }
  if (!n && Fh(r))
    try {
      return await E5(r, t);
    } catch (o) {
      throw x5(o) ? new Error(Dh) : o;
    }
  throw new Error(Dh);
}
const Rh = 1000000n, vs = 1000000n, Ya = 50n, Me = 3000n, ri = 300n, eo = 3000n, v5 = 50000n, el = 200n, Ic = 15000n, In = (t) => t + Ya;
function Vn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Rh}.${(n % Rh).toString().padStart(6, "0")}`;
}
function Gh(t, e = ri) {
  return t <= Me ? 0 : Number((t - Me) / In(e));
}
function nl(t, e = 0n) {
  const n = vs - t - e;
  return n > 0n ? n : 0n;
}
function $5(t, e = ri) {
  return t > vs ? "over" : t < Me + In(e) ? "empty" : t < v5 ? "low" : "ok";
}
const k5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", I5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", L5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function C5(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || L5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== k5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ny = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", rl = 3, T5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [lu, _y] = Ny.split("."), En = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function uu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function B5(t) {
  return En(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function cs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Py(t, e = []) {
  const n = await cs(`/v2/contracts/call-read/${lu}/${_y}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: lu, arguments: e.map((r) => "0x" + En(me(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Xn(kn(n.result));
}
async function M5() {
  const t = await cs(`/v2/contracts/source/${lu}/${_y}?proof=0`);
  if (typeof t.source != "string" || await B5(t.source) !== I5) throw Error("Deployed source does not match the tested helper.");
  if (C5(await Py("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Uy(t) {
  return t.startsWith("SP") && vi(t) && !t.includes(".");
}
async function N5(t) {
  var r;
  if (!Uy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await cs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await cs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function _5(t) {
  const e = await cs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function P5(t, e) {
  var i, s;
  const n = await Py("get-owner", [fo(t), fo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Uy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function U5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: uu(t), signal: AbortSignal.timeout(15e3) });
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
async function H5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function O5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Wa(uu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || Si(io(Ka.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || Si(r.contractAddress) + "." + r.contractName.content !== Ny || r.functionName.content !== "play" || r.functionArgs.length !== 3 || En(me(r.functionArgs[0])) !== En(me(fo(t.core))) || En(me(r.functionArgs[1])) !== En(me(fo(t.song))) || En(me(r.functionArgs[2])) !== En(me(Q8(uu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Oi.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== xo.Equal || s.principal.prefix !== 2 || Si(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Si(r.contractAddress) + "." + r.contractName.content !== T5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || En(me(r.functionArgs[0])) !== En(me(fo(t.song))) || typeof t.liked != "boolean" || En(me(r.functionArgs[1])) !== En(me(Z8(t.liked))) || t.amount !== "0" || e.postConditionMode !== Oi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Xn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const D5 = "xtrata.xyz/radio/listening-wallet", F5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Vs = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && vi(t), j5 = (t) => ({
  domain: Gs({ name: Oe(D5), version: Oe("1"), "chain-id": Jn(1) }),
  message: Gs({
    purpose: Oe(F5),
    main: Oe(t.main),
    listening: Oe(t.listening),
    issued: Jn(t.issued)
  })
}), Hy = 100000n, z5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function R5(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Vs(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= Hy).sort(z5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const fa = 50;
function Za(t) {
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
async function G5(t, e, n = 4) {
  if (!Vs(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${fa}&offset=${o}`, i = Za(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - fa);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= fa ? i : Za(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = R5(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - fa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const hr = 50, K5 = 6, V5 = 20, Kh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Vh(t, e) {
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
async function q5(t, e, n) {
  if (!Vs(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = Za(await e(`/extended/v1/address/${t}/stx_inbound?limit=${hr}&offset=0`));
    if (!i || i.total > K5 * hr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = hr; o < i.total; o += hr) {
      const a = Za(await e(`/extended/v1/address/${t}/stx_inbound?limit=${hr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${hr}&offset=${u}`, a = Vh(await e(o(0)), t);
      if (!a || a.total > V5 * hr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = hr; u < a.total; u += hr) {
        const d = Vh(await e(o(u)), t);
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
function W5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Kh).map((l, g) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: g } : Vs(l.sender) && p >= Hy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: p, kind: "dust", to: null, at: g };
  }), s = i.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Vs(l.recipient) && l.amount > 0n).sort(Kh), a = o.reduce((l, g) => l + g.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, g) => {
    let p = g;
    for (const E of l) {
      if (p <= 0n) break;
      const A = E.left < p ? E.left : p;
      E.left -= A, p -= A;
    }
    return p;
  };
  for (const l of o) {
    const g = u(i.filter((p) => p.to === l.recipient), l.amount);
    g > 0n && u(i, g);
  }
  if (u(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, p = d.get(g);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function X5(t, e) {
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
function qh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const va = [100, 250, 500], Y5 = (t, e) => BigInt(t) * In(e), no = ["prepared", "signed", "unknown", "pending"], Z5 = 30 * 6e4, pi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, Q5 = 3e3, Wh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", sl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function J5(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, g = !1, p = null, E = !1, A = "", B = "", K = 0, V, v = null, _, T = [], S, N = -1 / 0;
  const P = /* @__PURE__ */ new Set();
  let M = null, x = !1, b = 0, L = null, U = null, J = !1, D = null, yt = !1, dt = null, at = !1, I = !1, F = !1, rt = !1, Ct = !1, kt = 0, Ft = null, Ne = Promise.resolve();
  const Qt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ri.toString()), Wt = (w) => !!s && !(s.features ?? []).includes(w), ce = (w, k) => `xtrata.ppp.v1.${w}:${k}`, Re = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const k = JSON.parse(t.store.get(ce("entries", w)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, Ut = (w) => {
    const k = [w, ...Re(w.address).filter((G) => !(G.txid === w.txid && G.kind === w.kind))].slice(0, 200);
    t.store.set(ce("entries", w.address), JSON.stringify(k));
  }, an = (w = s == null ? void 0 : s.address) => !!w && t.store.get(ce("on", w)) !== "0", be = (w) => {
    s != null && s.address && t.store.set(ce("on", s.address), w ? "1" : "0");
  }, le = () => Re().filter((w) => no.includes(w.status)), On = () => Yt() ? [...le(), ...Re(ne()).filter((w) => no.includes(w.status))] : le(), Ae = () => Le(s == null ? void 0 : s.address), Le = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(ce("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, re = (w, k = s == null ? void 0 : s.address) => {
    k && t.store.set(ce("deposit", k), JSON.stringify(w));
  }, ne = () => Wt("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Yt = () => !!(s != null && s.address) && ne() !== s.address, Ce = () => Yt() ? c && c.for === ne() ? c.value : void 0 : o, ve = (w) => w !== void 0 && w < Me + el, Ge = () => le().filter((w) => t.now() - w.created > Z5 && P.has(w.txid)), Ln = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Gt = () => Ln() && !(s != null && s.linked), cn = () => {
    const w = t.main();
    return !Gt() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, ir = (w) => ce("return-to", w), $ = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const k = t.store.get(ir(w));
    return k && Vs(k) && k !== w ? k : void 0;
  }, j = (w = s == null ? void 0 : s.address) => M && M.for === w ? M.res : null;
  function z() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = $();
    if (w) return { to: w, kind: "chosen" };
    const k = j();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const R = (w) => ce("gift", w);
  function et() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((D == null ? void 0 : D.for) === w) return D.info;
    try {
      const k = JSON.parse(t.store.get(R(w)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  async function bt() {
    var nt;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((nt = e == null ? void 0 : e.gifts) != null && nt.enabled) || yt) return;
    const k = (D == null ? void 0 : D.for) === w ? D : null, G = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && t.now() - k.at < G) return;
    yt = !0;
    const Z = et();
    try {
      const W = await t.giftInfo(w);
      D = { for: w, info: W, ok: !0, at: t.now() }, t.store.set(R(w), JSON.stringify(W));
    } catch {
      D = { for: w, info: Z, ok: !1, at: t.now() };
    } finally {
      yt = !1;
    }
  }
  const se = () => Re().reduce((w, k) => no.includes(k.status) ? w + BigInt(k.amount || "0") + BigInt(k.fee || "0") : w, 0n);
  function Xt() {
    if (o === void 0) return 0;
    const w = o - se() - BigInt(pe.length) * In(Qt());
    return w > 0n ? Gh(w, Qt()) : 0;
  }
  const jt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Mt = "EMPTY — ADD STX TO PLAY";
  function h() {
    var G;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((G = et()) != null && G.player) && !w) return null;
    const k = (Z, nt) => ({ reason: Z, text: nt });
    switch (Tt()) {
      case "connect":
      case "wrong-wallet":
        return k("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return k("locked", "UNLOCK TO LISTEN");
      case "link":
        return k("link", "FINISH SETUP TO LISTEN");
      case "over":
        return k("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ae() ? k("arriving", "YOUR PLAYS ARE ARRIVING") : k("out", Yt() ? jt : Mt);
      case "ready":
        return !an() || !(s != null && s.session) || s.session.playsLeft < 1 ? k("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : F ? Xt() < 1 ? k("out", Yt() ? jt : Mt) : null : k("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const m = () => {
    var w;
    return !!(s != null && s.address) && Yt() && !!((w = et()) != null && w.player);
  };
  function f() {
    return m() ? { locked: !0, known: !0 } : null;
  }
  const H = 3 * 6e4, st = () => !!et() && !!t.history && !(s != null && s.linked);
  async function ot() {
    const w = s.address, k = et(), { balance: G, nonce: Z } = await t.chain.account(w), nt = await t.history(w, !0);
    if (!nt.ok) return null;
    const W = W5({ self: w, balance: G, inbound: nt.inbound, outgoing: nt.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!W.ok) return null;
    const ut = X5(W.parts, eo);
    return { balance: G, nonce: Z, parts: W.parts, steps: ut.steps, tooSmall: ut.tooSmall.length };
  }
  const Ht = () => at ? { state: "unavailable" } : !dt || t.now() - dt.at > H || o !== void 0 && o !== dt.balance ? { state: "none" } : dt.plan;
  function Tt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!Gt()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : cn() ? "wrong-wallet" : s.state === "known" ? "locked" : !Gt() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > vs ? "over" : o < Me + In(Qt()) ? "fund" : "ready" : "loading";
  }
  const Nt = () => {
    var w, k, G, Z;
    return {
      step: Tt(),
      busy: u,
      message: A,
      error: B,
      notice: Ot(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : $5(o, Qt()),
      playsLeft: o === void 0 ? 0 : Gh(o, Qt()),
      allowance: o === void 0 ? vs : nl(o, BigInt(((w = Ae()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: an(),
      entries: Re(),
      depositTxid: ((k = Ae()) == null ? void 0 : k.txid) ?? V,
      depositPending: !!Ae(),
      walletOutdated: Wt("like"),
      linkedListening: S && S === t.main() ? T.map((nt) => nt.listening) : [],
      serverLinked: !!v && _ === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: Ge().length,
      armed: rt,
      queued: pe.length,
      solo: Gt(),
      returnTo: (G = z()) == null ? void 0 : G.to,
      returnToKind: (Z = z()) == null ? void 0 : Z.kind,
      funderState: (() => {
        const nt = j();
        return nt ? nt.ok ? nt.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const nt = j();
        return !!nt && nt.ok && nt.distinct > 1;
      })(),
      walletCannotSolo: Gt() && Wt("standalone"),
      walletCannotMulti: Wt("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((nt) => nt !== t.main() && nt !== (s == null ? void 0 : s.linked)),
      creditedTo: Gt() && (s != null && s.address) && (L == null ? void 0 : L.for) === s.address && L.main ? L.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(ce("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (U == null ? void 0 : U.for) === s.address && U.unused,
      gift: (() => {
        const nt = et();
        return nt ? { player: nt.player, from: nt.from, source: nt.source, amount: nt.amount } : null;
      })(),
      giftPlays: et() ? Xt() : 0,
      playCost: In(Qt()),
      giftStop: h(),
      albumLock: f(),
      returnPlan: Ht(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Wt("slots"),
      likeFunds: (() => {
        var ut;
        const nt = ne();
        if (!nt || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const W = Ce();
        return { address: nt, balance: W, low: ve(W), album: Yt(), pending: !!Le(nt), txid: (ut = Le(nt)) == null ? void 0 : ut.txid, main: t.main() };
      })()
    };
  }, Ot = () => K ? K < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", mt = (w, k = "") => {
    A = w, B = k, t.changed();
  };
  async function ue(w, k) {
    if (!u) {
      u = w, B = "", t.changed();
      try {
        await k();
      } catch (G) {
        const Z = G instanceof Error ? G.message : String(G);
        B = /Cancelled in the listening wallet/.test(Z) ? "" : Z, B || (A = "Not now. Nothing was signed.", Ct = !0);
      } finally {
        u = null, await Pe(!0);
      }
    }
  }
  const $e = () => !!(e != null && e.enabled) && e.here && (Gt() || !!t.main() && e.allowed), _e = () => $e() && !cn(), Te = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Qe = () => {
    if (cn()) throw new Error(Te());
  };
  async function bn() {
    if (!$e()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const ht = (w) => {
    const k = t.main();
    return w.request("listening.status", k ? { main: k } : void 0);
  };
  async function zt(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await Rt(w)));
  }
  async function Rt(w = !1) {
    const k = ne();
    if (!(!Yt() || !k || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === k && t.now() - c.at < 3e4))
      try {
        c = { for: k, value: await t.chain.balance(k), at: t.now() };
      } catch {
      }
  }
  async function mn(w) {
    if ((S !== w || t.now() - N >= 6e4) && (T = await t.links(w), S = w, N = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const k = `${w}:${s.address}`;
    _ === k && v || (v = T.find((G) => G.listening === s.address) ?? null, _ = k);
  }
  async function si() {
    const w = s == null ? void 0 : s.address;
    if (!Gt() || !w || s != null && s.linked || !t.funder || x || !o || o <= 0n) return;
    const k = j(w);
    if (k != null && k.ok && k.funder) return;
    const G = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, b - 1), 30 * 6e4);
    if (!(M && M.for === w && t.now() - M.at < G)) {
      x = !0;
      try {
        M = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        M = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        x = !1;
      }
      b = M.res.ok ? 0 : b + 1;
    }
  }
  async function Yi() {
    const w = s == null ? void 0 : s.address;
    if (!(!Gt() || !w || s != null && s.linked || !t.mainOf || J) && !(L && L.for === w && (L.ok || t.now() - L.at < 6e4))) {
      J = !0;
      try {
        L = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        L = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        J = !1;
      }
    }
  }
  async function ii() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (U == null ? void 0 : U.for) === w) && t.store.get(ce("created", w)) !== "1")
      try {
        U = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Ar() {
    var nt;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let k, G = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const W of On())
      try {
        const ut = await t.chain.transaction(W.txid);
        if (!ut) {
          if (P.add(W.txid), t.now() - W.created > 15 * 6e4 && !Z.has(W.address) && Z.set(W.address, await t.chain.confirmedNonce(W.address)), k = Z.get(W.address), k !== void 0 && k > BigInt(W.nonce)) {
            Ut({ ...W, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((W.status === "unknown" || W.status === "signed") && W.raw)
            try {
              await t.chain.broadcast(W.raw, W.txid), Ut({ ...W, status: "pending" });
            } catch (pt) {
              pi(pt) && Ut({ ...W, status: "failed", note: pt.message, raw: void 0 });
            }
          continue;
        }
        P.delete(W.txid);
        const wt = String(ut.tx_status);
        if (wt === "success" && ut.canonical !== !1 && ut.is_unanchored === !1) {
          if (Ut({ ...W, status: "confirmed", confirmedAt: t.now(), actualFee: String(ut.fee_rate ?? W.fee), raw: void 0 }), G = !0, W.kind === "like" && (E = !0, W.status !== "confirmed" && typeof W.liked == "boolean"))
            try {
              (nt = t.likeConfirmed) == null || nt.call(t, W.song, W.liked);
            } catch {
            }
        } else wt.startsWith("abort_") || wt.startsWith("dropped_") ? Ut({ ...W, status: "failed", note: wt, raw: void 0 }) : W.status !== "pending" && Ut({ ...W, status: "pending" });
      } catch {
      }
    for (const W of Yt() ? [w, ne()] : [w]) {
      const ut = Le(W);
      if (ut)
        try {
          const wt = await t.chain.transaction(ut.txid), pt = String((wt == null ? void 0 : wt.tx_status) ?? "");
          (pt === "success" && wt.is_unanchored === !1 || pt.startsWith("abort_") || pt.startsWith("dropped_") || !wt && t.now() - ut.at > 2 * 36e5) && (re(null, W), a = -1 / 0, c = null, /on its way/i.test(A) && (A = ""));
        } catch {
        }
    }
    return G;
  }
  async function Pe(w = !1) {
    var k;
    try {
      const G = t.main();
      if ((w || !e || r !== G || t.now() - n > 3e5) && (e = await t.config(G), n = t.now(), r = G), !e.enabled || !e.here || !Gt() && (!G || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), rt && Dn(), t.changed();
        return;
      }
      await bn(), s = await ht(i), cn() && s.state === "unlocked" && (ur(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await ht(i)), G && e.allowed && await mn(G), await zt(w), await si(), await Yi(), await ii(), await bt(), await Ar() && await zt(!0), await Rt(), await ar(), K = 0;
    } catch {
      K++;
    }
    if (Tt() === "locked" ? $r() : rt && Dn(), E) {
      E = !1;
      try {
        (k = t.likesChanged) == null || k.call(t);
      } catch {
      }
    }
    t.changed(), pe.length && !lr && Br();
  }
  async function oi(w) {
    const k = s == null ? void 0 : s.root;
    if (!k || s != null && s.slot || !(s != null && s.address) || Wt("slots")) return;
    const G = Number(t.store.get(ce("slot", k)));
    if (!(!Number.isSafeInteger(G) || G < 1))
      try {
        const { balance: Z } = await t.chain.account(s.address);
        if (Z >= Me + In(Qt())) return;
        await w.request("listening.openSlot", { slot: G }), s = await ht(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function vr(w, k) {
    var W;
    Qe();
    const G = !(s != null && s.address) || an(s.address), Z = s != null && s.linked ? (W = t.nameOf) == null ? void 0 : W.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: G ? Cn() : void 0, anyPasskey: k, ...t.main() ? { main: t.main() } : {}, ...Z ? { label: Z } : {} }), s = await ht(w), G && (an(s.address) ? await Je() : await w.request("listening.stop")), await oi(w), mt(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const nt = p;
    p = null, nt && t.now() - nt.at < 12e4 && setTimeout(() => void Pe(!0).then(() => fe(nt)), 0);
  }
  function $r() {
    rt || u || Ct || kt >= 3 || !i || !(s != null && s.address) || (rt = !0, Ne = (async () => {
      try {
        await vr(i, !1), kt = 0;
      } catch (w) {
        const k = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(k) ? Ft || (Ct = !0, mt("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (kt++, B = k);
      } finally {
        rt = !1;
        const w = Ft;
        Ft = null, w ? await w() : await Pe(!0);
      }
    })());
  }
  async function Dn(w) {
    rt && (Ft = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await Ne), w && await w(), t.changed();
  }
  const Cn = () => ({
    fee: Qt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: vs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Je() {
    if (!(s != null && s.address)) return !1;
    if (F || (F = await t.tabLock(s.address)), !F)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function kr(w, k) {
    const G = s.address, { balance: Z, nonce: nt } = k ?? await t.chain.account(G);
    o = Z;
    const W = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: Z.toString(),
      nonce: nt.toString(),
      fee: eo.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (W.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ut = w.mode === "amount" ? w.amount : w.mode === "all" ? Z - eo : Z - vs - eo, wt = Wa(W.raw);
    if (Xn(wt.payload.recipient).value !== w.to || String(wt.payload.amount) !== W.amount || ut !== void 0 && W.amount !== ut.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const pt = {
      id: sl(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: W.recipient,
      amount: W.amount,
      fee: W.fee,
      nonce: nt.toString(),
      created: t.now(),
      status: "signed",
      raw: W.raw,
      txid: W.txid
    };
    t.validate(pt), Ut(pt);
    try {
      await t.chain.broadcast(W.raw, W.txid), Ut({ ...pt, status: "pending" });
    } catch (Vt) {
      throw Ut({ ...pt, status: "unknown", note: Vt.message }), Vt;
    }
    return W;
  }
  const ds = Ic, Ir = eo;
  async function ai(w, k, G) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Wt("slots") || Wt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = s.slot ?? 0;
    if (w === k || ![w, k].includes(Z) || ![w, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const nt = s.root ?? s.address, W = w === 0 ? nt : s.address, ut = k === 0 ? nt : s.address, { balance: wt, nonce: pt } = await t.chain.account(W);
    if (wt < G + Ir + Me) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Vt = await i.request("listening.signMove", { from: w, to: k, amount: G.toString(), fee: Ir.toString(), nonce: pt.toString(), balance: wt.toString() }), Ue = Wa(Vt.raw);
    if (Vt.from !== W || Vt.to !== ut || Vt.amount !== G.toString() || Xn(Ue.payload.recipient).value !== ut || String(Ue.payload.amount) !== G.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const xn = {
      id: sl(),
      address: W,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ut,
      amount: Vt.amount,
      fee: Vt.fee,
      nonce: pt.toString(),
      created: t.now(),
      status: "signed",
      raw: Vt.raw,
      txid: Vt.txid
    };
    t.validate(xn), Ut(xn);
    try {
      await t.chain.broadcast(Vt.raw, Vt.txid), Ut({ ...xn, status: "pending" });
    } catch (Ke) {
      throw Ut({ ...xn, status: "unknown", note: Ke.message }), Ke;
    }
    return re({ txid: Vt.txid, amount: Vt.amount, at: t.now() }, ut), ut === nt && nt !== s.address ? c = null : a = -1 / 0, Vt;
  }
  let Lr = !1;
  const hs = /* @__PURE__ */ new Map(), or = (w) => ce("float", w);
  async function ar() {
    if (Lr || (s == null ? void 0 : s.state) !== "unlocked" || !Yt() || Wt("move") || Wt("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(or(w)) === "1") return;
    const k = et();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const G = Ce();
    if (G === void 0 || o === void 0) return;
    if (!ve(G)) {
      t.store.set(or(w), "1");
      return;
    }
    if (Le(ne()) || Cr() || On().length || o < ds * 4n + Me + Ir) return;
    const Z = hs.get(w);
    if (!(Z && (Z.n >= 3 || t.now() - Z.at < 5 * 6e4))) {
      Lr = !0, hs.set(w, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: t.now() });
      try {
        await ai(s.slot ?? 0, 0, ds), t.store.set(or(w), "1");
      } catch (nt) {
        console.warn("[radio] likes float not sent yet", nt);
      } finally {
        Lr = !1;
      }
    }
  }
  async function ci(w) {
    if (le().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Wt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await ot().catch(() => null);
    if (!k)
      throw dt = null, at = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    at = !1, o = k.balance;
    const G = { balance: k.balance, nonce: k.nonce };
    if (w === "excess") {
      const wt = qh(k.parts) ?? $();
      if (!wt) throw new Error("Choose where to send the excess first.");
      await kr({ mode: "excess", to: wt, linked: !1 }, G), dt = null, mt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = k.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!dt && dt.balance === k.balance && t.now() - dt.at <= H && dt.steps.length === Z.length && dt.steps.every((wt, pt) => wt.to === Z[pt].to && wt.mode === Z[pt].mode && wt.send === Z[pt].send))) {
      dt = {
        at: t.now(),
        balance: k.balance,
        steps: Z,
        parts: k.parts,
        plan: { state: "ready", steps: Z.map((wt) => ({ to: wt.to, kind: wt.kind, send: wt.send.toString() })), kept: k.tooSmall, excess: qh(k.parts) }
      }, mt(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const W = Z[0], ut = W.to ?? $();
    if (!ut) throw new Error("Choose where to send the rest first.");
    if (W.mode === "amount" && Wt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await kr({ mode: W.mode, to: ut, linked: !1, ...W.mode === "amount" ? { amount: W.send } : {} }, G), dt = null, Z.length === 1 ? (be(!1), mt("Returned ✓ Paying is off.")) : mt(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const cr = {
    forceRefresh: () => Pe(!0),
    create: () => ue("Waiting for your passkey…", async () => {
      const w = await bn();
      await w.request("listening.unlock", { mode: "create", terms: Cn(), ...t.main() ? { main: t.main() } : {} }), s = await ht(w), s.address && t.store.set(ce("created", s.address), "1"), be(!0), mt(Gt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Je();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (w, k) => {
      !(s != null && s.address) || Ae() || (re({ txid: w, amount: k.toString(), at: t.now() }), a = -1 / 0, D = null, mt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (Qe(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Wt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await bn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, k, G, Z) => {
      re({ txid: G, amount: Z.toString(), at: t.now() }, k), D = null, await cr.openAlbum(w), mt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => ue("Opening…", async () => {
      if (Qe(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Wt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      ur(), await i.request("listening.openSlot", { slot: w }), s = await ht(i), o = void 0, a = -1 / 0, dt = null, at = !1;
      const k = s.root;
      k && w > 0 && t.store.set(ce("slot", k), String(w)), mt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const k = () => ue("Waiting for your passkey…", async () => vr(await bn(), w));
      return rt ? w ? Wt("cancel") ? (mt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Dn(async () => {
        (Tt() === "locked" || Tt() === "intro") && await k();
      }) : Ne : k();
    },
    link: () => ue("Sign in your wallet…", async () => {
      Qe();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const k = (await t.links(w)).find((G) => G.listening === s.address);
      if (k)
        await i.request("listening.link", { main: w, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const G = { main: w, listening: s.address, issued: t.now() }, Z = await t.signWithMain(w, j5(G)), nt = await i.request("listening.link", { main: w, issued: G.issued, mainSignature: Z });
        await t.saveLink({ ...G, mainSignature: Z, listeningSignature: nt.listeningSignature }), N = -1 / 0;
      }
      mt("Linked ✓");
    }),
    deposit: () => ue("Approve the deposit in your wallet…", async () => {
      Qe();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (Ae()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await zt(!0);
      const k = nl(o ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      V = await t.deposit(w, s.address, k), V && re({ txid: V, amount: k.toString(), at: t.now() }), mt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => ue("Approve the top-up in your wallet…", async () => {
      Qe();
      const w = t.main(), k = ne();
      if (!w || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Le(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const G = await t.chain.balance(k);
      Yt() ? c = { for: k, value: G, at: t.now() } : (o = G, a = t.now());
      const Z = nl(G);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const nt = await t.deposit(w, k, Z);
      nt && re({ txid: nt, amount: Z.toString(), at: t.now() }, k), mt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => ue("Adding plays…", async () => {
      if (Qe(), !Yt()) throw new Error("Open the album you want to add plays to first.");
      if (!va.includes(w)) throw new Error("Choose one of the amounts offered.");
      const k = Y5(w, Qt());
      if (d || l || g) throw new Error("Still sending a payment. Try again in a moment.");
      if (On().length || Ae()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ai(0, s.slot ?? 0, k), mt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => ue("Confirm in the listening wallet…", async () => {
      if (!_e()) throw new Error("Connect your wallet first.");
      await Je(), await i.request("listening.approveSession", Cn()), be(!0), mt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => ue("Clearing…", async () => {
      for (const w of Ge())
        await t.chain.transaction(w.txid) || Ut({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      mt("Cleared ✓");
    }),
    switchOff: () => ue("Switching off…", async () => {
      ur(), await (i == null ? void 0 : i.request("listening.stop")), be(!1), mt("Paying is off. Music stays free.");
    }),
    lock: () => ue("Locking…", async () => {
      ur(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, mt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const k = String(w ?? "").trim();
      if (!(s != null && s.address)) return mt("", "Unlock the listening wallet first.");
      if (!Vs(k)) return mt("", "Enter a standard mainnet address (it starts with SP).");
      if (k === s.address) return mt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(ir(s.address), k), mt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(ir(s.address), ""), t.changed();
    },
    returnFunds: (w) => ue("Check the return in the listening wallet…", async () => {
      if (!_e()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (st()) return ci(w);
      const k = z();
      if (!k) throw new Error(Gt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Wt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (le().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await kr({ mode: w, to: k.to, linked: k.kind === "linked" }), w === "all" && be(!1), mt(w === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, pe = [], li = 10, ui = 30 * 6e4;
  let lr = !1;
  const Cr = () => d || !!u || l || g, ur = () => {
    pe.length && (pe.length = 0, t.changed());
  };
  async function Tr(w) {
    if (!pe.some((k) => k.id === w.id) && !Re().some((k) => k.id === w.id) && (pe.push({ ...w, at: t.now() }), pe.length > li && pe.shift()), Cr() || le().length) {
      const k = pe.length;
      A = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Br();
  }
  async function Br() {
    if (!lr) {
      lr = !0;
      try {
        for (; pe.length; ) {
          for (; pe.length && t.now() - pe[0].at > ui; ) pe.shift();
          if (!pe.length || Cr() || await q(pe[0]) === "wait") return;
          pe.shift();
        }
      } finally {
        lr = !1, t.changed();
      }
    }
  }
  async function q(w) {
    var k;
    d = !0;
    try {
      await Pe();
      const G = Tt();
      if (G === "loading") return "wait";
      if (G !== "ready" || !an() || !(s != null && s.session) || s.session.playsLeft < 1 || !F) return "done";
      if (le().length) return "wait";
      I || (await t.chain.verify(), I = !0);
      const Z = s.address, { balance: nt, nonce: W } = await t.chain.account(Z);
      o = nt, a = t.now();
      const ut = await t.chain.owner(rl, w.song);
      if (ut === Z || ut === t.main()) return "done";
      const wt = await i.request("listening.signPlay", {
        core: rl,
        song: w.song,
        receipt: w.id,
        fee: Qt().toString(),
        nonce: W.toString(),
        balance: nt.toString()
      }), pt = {
        id: w.id,
        address: Z,
        kind: "play",
        core: rl,
        song: w.song,
        recipient: ut,
        amount: "50",
        fee: Qt().toString(),
        nonce: W.toString(),
        created: t.now(),
        status: "signed",
        raw: wt.raw,
        txid: wt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(pt), Ut(pt);
      const Vt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(wt.raw, wt.txid), Ut({ ...pt, status: "pending" }), A = `♪ Paid ${Vt}`, B = "";
      } catch (Ue) {
        Ut({ ...pt, status: pi(Ue) ? "failed" : "unknown", note: Ue.message, ...pi(Ue) ? { raw: void 0 } : {} }), B = Ue.message;
      }
      return s = await ht(i), "done";
    } catch (G) {
      const Z = G instanceof Error ? G.message : "payment unavailable";
      return (k = et()) != null && k.player ? (A = "Payment is taking a moment: " + Z, "wait") : (A = "This song played free: " + Z, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function it(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Tt()) || Wt("like") ? !1 : (fe(w), !0);
  }
  async function fe(w) {
    const k = w.title ? `“${w.title}”` : `song #${w.song}`, G = (Fn) => {
      var Po;
      B = Fn, A = "";
      try {
        (Po = t.likeFailed) == null || Po.call(t, w.song);
      } catch {
      }
      t.changed();
    }, Z = Yt(), nt = Tt(), W = t.main(), ut = Z && (nt === "fund" || nt === "over") ? "ready" : nt, wt = Gt() ? ne() : W;
    if (ut === "locked") {
      p = { ...w, at: t.now() }, mt(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (ut === "wrong-wallet") return G(Te());
    if (ut === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Gt() && Wt("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ut === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (ut === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await Rt(!0);
      const Fn = Ce();
      if (ve(Fn))
        return t.changed(), G(Wh);
    }
    if (ut !== "ready" || !wt) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return G("Pay-per-play is running in another tab. Like from that tab.");
    const pt = Re(ne()).find((Fn) => Fn.kind === "like" && Fn.song === w.song);
    if (pt && no.includes(pt.status))
      return G(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (l) return G("One like at a time: your last one is still being sent.");
    if ((pt == null ? void 0 : pt.status) === "confirmed" && t.now() - (pt.confirmedAt ?? 0) < Q5)
      return G(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let Vt;
    g = !0;
    try {
      Vt = t.likeState ? (await t.likeState(wt, w.song)).by : w.likedBy ?? [];
    } catch {
      Vt = w.likedBy;
    } finally {
      g = !1;
    }
    if (!Vt) return G(`Could not check ${k} right now. Try the heart again.`);
    const Ue = ne(), Ke = ((pt == null ? void 0 : pt.status) === "confirmed" && typeof pt.liked == "boolean" && t.now() - (pt.confirmedAt ?? pt.created) < 5 * 6e4 ? pt.liked : void 0) ?? Vt.includes(Ue);
    if (!Ke && Vt.some((Fn) => Fn !== Ue)) return G(Gt() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${Vt.includes(W) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ke({ song: w.song, liked: !Ke, title: w.title, artist: w.artist });
  }
  async function ke(w) {
    var Z, nt, W;
    if (l) {
      mt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const k = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, G = t.wait ?? ((ut) => new Promise((wt) => setTimeout(wt, ut)));
    try {
      mt(`${w.liked ? "Liking" : "Unliking"} ${k}…`);
      const ut = t.now() + 12e4;
      for (; d || (Yt() ? Re(ne()).some((Ke) => no.includes(Ke.status)) : le().length); ) {
        if (t.now() > ut) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await Pe(!0);
      }
      if (!Yt() && Tt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const wt = ne(), { balance: pt, nonce: Vt } = await t.chain.account(wt);
      if (Yt() ? c = { for: wt, value: pt, at: t.now() } : (o = pt, a = t.now()), ve(pt)) throw new Error(Wh);
      const Ue = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: el.toString(),
        nonce: Vt.toString(),
        balance: pt.toString()
      }), xn = {
        id: sl(),
        address: wt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: el.toString(),
        nonce: Vt.toString(),
        created: t.now(),
        status: "signed",
        raw: Ue.raw,
        txid: Ue.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(xn), Ut(xn);
      try {
        await t.chain.broadcast(Ue.raw, Ue.txid), Ut({ ...xn, status: "pending" }), A = `${w.liked ? "♥ Liked" : "Unliked"} ${k}`, B = "";
        try {
          (Z = t.likeSent) == null || Z.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Ke) {
        if (Ut({ ...xn, status: pi(Ke) ? "failed" : "unknown", note: Ke.message, ...pi(Ke) ? { raw: void 0 } : {} }), B = Ke.message, pi(Ke)) try {
          (nt = t.likeFailed) == null || nt.call(t, w.song);
        } catch {
        }
      }
      s = await ht(i);
    } catch (ut) {
      B = "Like not sent: " + (ut instanceof Error ? ut.message : "the listening wallet is unavailable");
      try {
        (W = t.likeFailed) == null || W.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Br();
    }
  }
  return { snapshot: Nt, refresh: Pe, onListened: Tr, heart: it, toggleLike: fe, ...cr };
}
const Oy = ["Connect", "Passkey", "Link & fund", "Listen"], Dy = ["Passkey", "Add 1 STX", "Listen"], fu = (t) => t ? Dy : Oy;
function t6(t) {
  if (t.solo) return e6(t);
  const e = Oy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function e6(t) {
  const e = Dy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function n6(t, e) {
  return !e || e.at >= fu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const r6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function s6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !r6(r.id)));
}
const i6 = {}, o6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, a6 = (t) => {
  const e = i6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, c6 = (t) => `/hiro/${t}`, l6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, u6 = (t) => {
  const e = a6(t);
  if (e)
    return [l6(e)];
  const n = o6[t];
  return typeof window < "u" ? [`${window.location.origin}${c6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, f6 = {}, Xh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, d6 = "xtrata.log.enabled", h6 = "xtrata.log.level", p6 = "xtrata.log.tags", g6 = "xtrata.log.dedupe", da = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, y6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, w6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, b6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, m6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, x6 = () => {
  const t = f6 ?? {}, e = da(d6) ?? t.VITE_LOG_ENABLED, n = da(h6) ?? t.VITE_LOG_LEVEL, r = da(p6) ?? t.VITE_LOG_TAGS, i = da(g6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: y6(e),
    level: w6(n) ?? "warn",
    tags: m6(r),
    dedupe: b6(i)
  };
}, S6 = (t, e, n) => !t.enabled || Xh[n] < Xh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), E6 = (t, e, n, r) => {
  const i = x6();
  if (!S6(i, e, t) || v6(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, A6 = /* @__PURE__ */ new Set();
let Yh = null;
const v6 = (t, e, n, r, i) => (Yh !== t && (A6.clear(), Yh = t), !1), $6 = (t, e, n) => E6("debug", t, e, n), k6 = {}, I6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, L6 = (t) => {
  const e = k6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : I6[t];
}, C6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, T6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return C6.test(n) ? n : null;
}, B6 = (t) => t.replace(/\/+$/, ""), M6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Zh = (t) => {
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
}, gi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, N6 = (t) => {
  var c, u;
  let e;
  try {
    e = Xn(N8(t));
  } catch {
    return null;
  }
  const n = gi(e);
  if (!n || n.success === !1)
    return null;
  const r = gi(n.value), i = gi(r == null ? void 0 : r.value), s = gi(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = Zh((c = gi(s.name)) == null ? void 0 : c.value), a = Zh((u = gi(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : T6(`${o}.${a}`);
}, _6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${B6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [by(ey(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : N6(s.result);
}, P6 = async (t) => {
  const e = t.address.trim();
  if (!vi(e))
    return null;
  const n = L6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of u6(t.network))
    try {
      return await _6({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return $6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: M6(r)
  }), null;
};
function U6(t, e, n = {}) {
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
const Qh = Object.freeze({
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
}), Jh = Object.freeze({ 139: "melophonic" });
function H6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(Qh, n) ? Qh[n] : Object.hasOwn(Jh, n) ? Jh[n] : e;
}
const t0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function O6(t, e = "") {
  return Object.hasOwn(t0, String(t)) ? t0[String(t)] : e;
}
const Fy = 100000n, Ef = 1000000n, Qa = 3000n, D6 = (t, e) => `${t}#gift=${e}`, F6 = 100, ha = (t, e = ri) => t <= Me ? 0 : Number((t - Me) / In(e)), e0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), jy = "xtrata.xyz/radio/gifts", il = F6, j6 = "Create a prefunded Xtrata radio gift batch", z6 = (t) => ({
  domain: Gs({ name: Oe(jy), version: Oe("1"), "chain-id": Jn(1) }),
  message: Gs({
    purpose: Oe(j6),
    creator: Oe(t.creator),
    count: Jn(t.count),
    amount: Jn(BigInt(t.amount)),
    label: Oe(t.label),
    issued: Jn(t.issued),
    ...t.player ? { player: Oe(t.player) } : {}
  })
}), R6 = (t, e, n = ri) => Me + BigInt(t) * In(n) + (e ? Ic : 0n), G6 = (t, e = ri) => Number((Ef - Me - (t ? Ic : 0n)) / In(e)), K6 = (t, e) => BigInt(t) * (e + Qa);
function V6(t, e, n, r = ri) {
  const i = n ? Ic : 0n, s = e > Me + i ? e - Me - i : 0n, o = Number(s / In(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Ya,
    fees: BigInt(o) * r,
    reserve: Me,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Qa,
    perCopy: e + Qa,
    total: K6(t, e)
  };
}
const q6 = (t) => t >= Fy && t <= Ef, n0 = 40, W6 = "Create an Xtrata radio gift player", X6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function r0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && X6.test(t) : !n;
}
function Y6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!r0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!r0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > n0) throw new Error(`A player holds 1 to ${n0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const Z6 = (t) => sp(up(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), Q6 = (t) => ({
  domain: Gs({ name: Oe(jy), version: Oe("1"), "chain-id": Jn(1) }),
  message: Gs({
    purpose: Oe(W6),
    admin: Oe(t.admin),
    player: Oe(t.hash),
    issued: Jn(t.issued)
  })
}), $o = (t) => t.tracks.filter((e) => !e.hidden), J6 = (t) => t.tracks.find((e) => e.hidden) ?? null, t$ = [300, 500, 1e3], s0 = 1800, ol = /* @__PURE__ */ new Map();
async function zy(t) {
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
async function e$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await zy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Ry(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = ol.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      ol.set(t, { ...a, until: Date.now() + s0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ol.delete(t), i();
      }, s0 + 50);
    }
  }, s;
}
const $s = (t, e, n, r, i) => Ry(t, e, async () => await zy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), gs = "xtrata.radio.gift.incoming.v1", i0 = (t) => "xtrata.radio.gift.mine.v1:" + t, o0 = (t) => "xtrata.radio.gift.batches.v1:" + t, gt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, pr = (t, e, n = "") => {
  const r = gt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, pa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, un = (t) => Vn(t).replace(/\.?0+$/, "");
function n$(t) {
  let e = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), j = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return j !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), e0(j) ? j : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const $ = JSON.parse(t.store.get(gs) || "null");
      return e0($ == null ? void 0 : $.code) ? $.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(gs, JSON.stringify({ code: s, at: t.now() }));
    let $ = 0;
    const j = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (z) => {
      const R = await z.json().catch(() => ({}));
      if (z.status === 404) {
        t.store.set(gs, null), e = { ...e, error: (R == null ? void 0 : R.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!z.ok) throw new Error("busy");
      const et = R;
      e = { ...e, view: et, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(et.status) && t.store.set(gs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void j(), n($++)));
    });
    j();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const $ = e == null ? void 0 : e.view;
    return !($ != null && $.player) || !o() ? null : { player: $.player, from: u($), plays: ha(BigInt($.amount)) };
  }, c = () => {
    e = null, t.store.set(gs, null), t.changed();
  }, u = ($) => $.from ? t.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let d = {};
  const l = ($) => {
    if (d.box) return d.box;
    const j = gt("div", "", "ppp-gift-check");
    d.box = j;
    const z = () => {
      const R = window.turnstile;
      !R || d.rendered || (d.rendered = !0, R.render(j, { sitekey: $, callback: (et) => {
        d.token = et, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) z();
    else {
      const R = document.createElement("script");
      R.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", R.async = !0, R.onload = z, document.head.append(R);
    }
    return j;
  };
  let g;
  async function p($) {
    var R, et, bt, se, Xt;
    if (!e || e.claiming || !$.listening) return;
    const j = !!((R = e.view) != null && R.player);
    if (j && !$.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const z = async (jt) => {
      const Mt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...jt })
      });
      return { res: Mt, r: await Mt.json().catch(() => ({})) };
    };
    try {
      let jt = 0, Mt = $.listening, h;
      if (j) {
        const H = Number((et = await t.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : et.next);
        if (!Number.isSafeInteger(H) || H < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        jt = H;
        for (let st = 0; ; st++) {
          const ot = await t.album.bind(jt);
          if (Mt = ot.address, h = await z({ wallet: Mt, binding: ot }), h.res.status === 409 && /just taken/.test(((bt = h.r) == null ? void 0 : bt.error) || "") && st < 5) {
            jt += 1;
            continue;
          }
          break;
        }
      } else h = await z({ wallet: Mt });
      const { res: m, r: f } = h;
      if (m.status === 503 && /sending another gift/.test((f == null ? void 0 : f.error) || "")) {
        e.waiting = !0, clearTimeout(g), g = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!m.ok) {
        const H = String((f == null ? void 0 : f.error) || "");
        if (m.status === 404 || m.status === 410 || m.status === 409 && /already had a gift|brand-new/.test(H))
          throw t.store.set(gs, null), new Error(H || "This gift cannot be opened.");
        if (m.status === 429 || m.status === 403 || m.status === 400 && !/wallet number/i.test(H)) throw new Error(H || `Could not open the gift (${m.status}).`);
        const ot = /topping up/.test(H) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(H) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(H) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(ot), { retry: !0, slow: /topping up|not paid for yet/.test(H) });
      }
      e.done = !0, t.store.set(gs, null), j ? await t.album.arrived(jt, Mt, f.txid, BigInt(f.amount)) : t.giftSent(f.txid, BigInt(f.amount));
    } catch (jt) {
      const Mt = jt, h = Mt.name === "TypeError" || Mt.name === "AbortError" || Mt.name === "TimeoutError" || /wallet number/i.test(Mt.message);
      if (Mt.retry || h) {
        const m = e.tries ?? 0;
        e.tries = m + 1, e.retry = { text: Mt.retry ? Mt.message : "Still sending your gift… the network is slow, trying again." }, clearTimeout(g), g = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, Mt.slow ? 6e4 : n(m));
      } else e.error = Mt.message;
      d.token = void 0;
      try {
        (Xt = (se = window.turnstile) == null ? void 0 : se.reset) == null || Xt.call(se, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let E = null;
  function A($) {
    if (!$.listening || !$.depositPending || $.step !== "fund")
      return E = null, [];
    if (!E || E.wallet !== $.listening || t.now() - E.at > 3e4) {
      const z = $.listening;
      E = { ...(E == null ? void 0 : E.wallet) === z ? E : {}, wallet: z, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(z)).then((R) => {
        var et, bt;
        (E == null ? void 0 : E.wallet) === z && (E.state = (et = R == null ? void 0 : R.gift) == null ? void 0 : et.state, E.problem = ((bt = R == null ? void 0 : R.gift) == null ? void 0 : bt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(E.state === "sending" && E.problem)) return [];
    const j = gt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return j.title = `Network reply: ${E.problem}`, [j];
  }
  function B($, j, z = !1) {
    var jt, Mt;
    const R = j.player, et = BigInt(j.amount), bt = z ? [] : [gt("p", `🎁 ${u(j)} sent you “${R.title}”${R.subtitle ? ` by ${R.subtitle}` : ""}: ${$o(R).length} ${$o(R).length === 1 ? "song" : "songs"} and ${ha(et).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step)))
      return z || bt.push(gt("p", $.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : $.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), bt;
    if ($.walletCannotAlbums)
      return bt.push(gt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), bt;
    const Xt = (Mt = (jt = $.gate) == null ? void 0 : jt.gifts) == null ? void 0 : Mt.turnstileSiteKey;
    return Xt && !d.token ? bt.push(gt("p", "One quick check and it is yours:", "ppp-mute"), l(Xt)) : !e.claiming && !e.error && !e.waiting && !e.retry && p($), bt.push(...K($, "Sending your album…")), bt;
  }
  function K($, j) {
    const z = [];
    return e.claiming || e.waiting ? z.push(gt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : j, "ppp-cyan")) : e.retry && z.push(gt("p", e.retry.text, "ppp-warn"), pr("Try now", () => {
      clearTimeout(g), e.retry = void 0, p($);
    }, "quiet")), e.error && z.push(gt("p", e.error, "ppp-bad"), pr("Try again", () => {
      e.error = void 0, p($);
    })), z;
  }
  const V = ($) => {
    var j;
    return !!e && !e.done && !e.error && o() && !!$.listening && !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((j = e.view) != null && j.player)) && ($.balance ?? 0n) === 0n && !$.entries.length;
  };
  function v($, j = {}) {
    var m, f;
    const z = A($);
    if (!e || ["off", "elsewhere"].includes($.step)) return z;
    const R = e.view;
    if (e.error && !R) return [gt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!R) return [gt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return z;
    if (R.status === "claimed" || R.status === "claiming") return [gt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(R.status)) return [gt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (R.status === "pending-deposit") return [gt("p", `🎁 ${u(R)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (R.player) return [...B($, R, !!j.bare), ...z];
    if (!!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0))
      return [gt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), pr("Forget this gift link here", c, "quiet")];
    const bt = BigInt(R.amount), se = ha(bt).toLocaleString(), jt = [gt(
      "p",
      `🎁 ${u(R)} sent you ${un(bt)} STX of on-chain music: about ${se} paid plays.`,
      "ppp-gift"
    )], Mt = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, h = (f = (m = $.gate) == null ? void 0 : m.gifts) == null ? void 0 : f.turnstileSiteKey;
    return Mt ? (h && !d.token ? jt.push(gt("p", "One quick check and it is yours:", "ppp-mute"), l(h)) : !e.claiming && !e.error && !e.waiting && !e.retry && p($), jt.push(...K($, "Sending your gift…"))) : $.step === "intro" ? jt.push(gt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : $.listening && $.linked ? jt.push(gt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), pr("Forget this gift link here", c, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && jt.push(gt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), pr("Forget this gift link here", c, "quiet")), jt;
  }
  async function _($, j, z) {
    var R;
    try {
      const et = await t.json("/radio/gift/for?wallet=" + encodeURIComponent($));
      if ((R = et == null ? void 0 : et.gift) != null && R.returnTo) return { ok: !0, funder: et.gift.returnTo, txId: et.gift.txid ?? void 0, amount: et.gift.amount, distinct: 1 };
    } catch {
      if (z) return { ok: !1 };
    }
    return j();
  }
  const T = gt("div", "", "ppp-gift-fold");
  let S = 250000n, N = "", P = "";
  const M = ($) => {
    try {
      const j = JSON.parse(t.store.get(i0($)) || "[]");
      return Array.isArray(j) ? j : [];
    } catch {
      return [];
    }
  }, x = ($, j) => t.store.set(i0($), JSON.stringify(j.slice(0, 50)));
  let b = 0;
  async function L($) {
    const j = M($);
    for (const z of j)
      if (!(z.view && ["claimed", "refunded", "expired"].includes(z.view.status)))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: z.id, ...z.txid ? { txid: z.txid } : {} }) }) : await t.json("/radio/gift?id=" + z.id), z.error = void 0;
        } catch (R) {
          z.error = R.message;
        }
    x($, j), t.changed();
  }
  async function U($) {
    if (N) return;
    N = "Starting your gift…", P = "", t.changed();
    let j = null;
    try {
      j = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: S.toString() }) });
      const z = M($);
      z.unshift({ id: j.id, code: j.code, amount: S.toString(), at: t.now() }), x($, z), N = "Approve the gift in your wallet…", t.changed();
      const R = await t.pay($, j.depositTo, BigInt(j.deposit), j.memo), et = M($), bt = et.find((se) => se.id === j.id);
      bt && (bt.txid = R, bt.view = { status: "pending-deposit", amount: S.toString(), source: "friend", from: $, label: "", expires: 0 }), x($, et), P = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", L($);
    } catch (z) {
      P = z.message || "Not sent.";
    } finally {
      N = "", t.changed();
    }
  }
  const J = ($) => "xtrata.radio.gift.players.v1:" + $, D = ($) => {
    try {
      const j = JSON.parse(t.store.get(J($)) || "[]");
      return Array.isArray(j) ? j.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id)) : [];
    } catch {
      return [];
    }
  };
  async function yt($, j) {
    var z;
    if (!N) {
      N = "Checking the player…", P = "", t.changed();
      try {
        const R = j.tracks.split(/[\s,]+/).filter(Boolean).map((Mt) => Number(Mt.replace(/^#/, ""))), et = Y6({ title: j.title.trim(), subtitle: j.subtitle.trim(), tracks: R, cover: (z = j.cover) != null && z.trim() ? Number(j.cover.trim().replace(/^#/, "")) : null });
        N = "Sign in your wallet…", t.changed();
        const bt = { admin: $, hash: Z6(et), issued: t.now() }, se = await t.sign($, Q6(bt));
        N = "Making the player…", t.changed();
        const Xt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: et, request: bt, signature: se }) }), jt = D($).filter((Mt) => Mt.id !== Xt.id);
        jt.unshift({ id: Xt.id, title: Xt.title, tracks: Xt.tracks }), t.store.set(J($), JSON.stringify(jt.slice(0, 30))), P = `${Xt.existing ? "That player already exists" : "Player made"} ✓ “${Xt.title}” · ${Xt.tracks} songs. Pick it below for a batch.`;
      } catch (R) {
        P = R.message || "Not made.";
      } finally {
        N = "", t.changed();
      }
    }
  }
  const dt = ($, j) => D6($ || location.origin + "/radio.html", j), at = ($) => e$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: $ }), I = ($) => {
    try {
      const j = JSON.parse(t.store.get(o0($)) || "[]");
      return Array.isArray(j) ? j.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id) && Array.isArray(z.codes)) : [];
    } catch {
      return [];
    }
  }, F = ($, j) => t.store.set(o0($), JSON.stringify(j.slice(0, 20))), rt = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, Ct = ($, j) => t.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(j) });
  let kt = 0;
  async function Ft($) {
    const j = I($);
    for (const z of j)
      if (!rt(z))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await Ct("/radio/gift/batch/confirm", { id: z.id, ...z.txid ? { txid: z.txid } : {} }) : await t.json("/radio/gift/batch?id=" + z.id), z.error = void 0;
        } catch (R) {
          z.error = R.message;
        }
    try {
      const z = await t.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const R of (z == null ? void 0 : z.batches) ?? []) {
        const et = j.find((bt) => bt.id === R.id);
        if (et) {
          et.error || (et.view = R);
          continue;
        }
        j.push({ id: R.id, codes: [], count: R.count, amount: R.amount, label: R.label, player: R.player, depositTo: "", deposit: R.deposit, memo: R.memo, at: 0, view: R });
      }
    } catch {
    }
    F($, j), t.changed();
  }
  async function Ne($, j) {
    const z = I($).find((R) => R.id === j);
    if (!(!z || !z.depositTo || N)) {
      N = "Approve the payment in your wallet…", P = "", t.changed();
      try {
        const R = await t.pay($, z.depositTo, BigInt(z.deposit), z.memo), et = I($), bt = et.find((se) => se.id === j);
        bt && (bt.txid = R), F($, et), P = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", N = "", Ft($);
      } catch (R) {
        P = `${/cancel/i.test(R.message) ? "Payment cancelled." : R.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        N = "", t.changed();
      }
    }
  }
  async function Qt($, j, z, R) {
    if (N) return;
    if (!j.ok) {
      P = j.reason, t.changed();
      return;
    }
    N = "Sign in your wallet…", P = "", t.changed();
    let et = null;
    try {
      const bt = { creator: $, count: j.count, amount: j.amount.toString(), label: z, issued: t.now(), ...R ? { player: R } : {} }, se = await t.sign($, z6(bt));
      N = "Making your links…", t.changed(), et = await Ct("/radio/gift/batch", { request: bt, signature: se });
      const Xt = I($);
      Xt.unshift({ id: et.id, codes: et.codes, count: j.count, amount: et.amount, label: z, player: R ?? null, depositTo: et.depositTo, deposit: et.deposit, memo: et.memo, at: t.now() }), F($, Xt);
    } catch (bt) {
      P = bt.message || "Not made.", N = "", t.changed();
      return;
    }
    N = "", t.changed(), await Ne($, et.id);
  }
  function Wt() {
    const $ = !!Yt.value, j = Ce.value === "max" ? G6($) : Number(Ce.value), z = R6(j, $), R = Number(ve.value);
    return !Number.isInteger(R) || R < 1 || R > il ? { ok: !1, reason: `Make 1 to ${il} copies at a time.`, album: $, plays: j, amount: z, count: R } : q6(z) ? { ok: !0, reason: "", album: $, plays: j, amount: z, count: R, bill: V6(R, z, $) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: $, plays: j, amount: z, count: R };
  }
  const ce = () => {
    const $ = Wt();
    if (!$.ok) return $.reason;
    const j = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${un(j.holders)} to song holders, ${un(j.fees)} network fees)${$.album ? `, ${un(j.float)} for the album’s likes` : ""}, ${un(j.reserve)} kept so a listener can return what is left, + ${un(j.sendFee)} to send it = ${un(j.perCopy)} STX. ${$.count} copies = ${un(j.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Re = ($, j) => j.codes.map((z) => dt($, z)), Ut = gt("input");
  Ut.type = "range", Ut.min = String(Fy), Ut.max = String(Ef), Ut.step = "50000", Ut.value = String(S), Ut.setAttribute("aria-label", "Gift amount");
  const an = gt("p", "", "ppp-gift-amount"), be = pr("", () => {
    const $ = t.main();
    $ && U($);
  }, "primary"), le = () => {
    an.textContent = On(), be.textContent = `Gift ${un(S)} STX`;
  };
  Ut.oninput = () => {
    S = BigInt(Ut.value), le();
  };
  const On = () => `${un(S)} STX · about ${ha(S).toLocaleString()} paid plays · you pay ${un(S + Qa)} STX with the network fee`;
  le();
  const Ae = gt("input");
  Ae.maxLength = 60, Ae.placeholder = "Title, e.g. Proof of Sound", Ae.setAttribute("aria-label", "Player title");
  const Le = gt("input");
  Le.maxLength = 80, Le.placeholder = "Artist (optional)", Le.setAttribute("aria-label", "Player subtitle");
  const re = gt("textarea");
  re.rows = 3, re.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", re.setAttribute("aria-label", "Songs");
  const ne = gt("input");
  ne.inputMode = "numeric", ne.placeholder = "Cover inscription number (optional), shown when the album loads", ne.setAttribute("aria-label", "Cover inscription");
  const Yt = gt("select");
  Yt.setAttribute("aria-label", "Batch album");
  const Ce = gt("select");
  Ce.setAttribute("aria-label", "Plays per copy");
  for (const $ of t$) Ce.append(pa(`${$.toLocaleString()} plays`, String($)));
  Ce.append(pa("Max (1 STX)", "max"));
  const ve = gt("input");
  ve.type = "number", ve.min = "1", ve.max = String(il), ve.value = "10", ve.setAttribute("aria-label", "Copies");
  const Ge = gt("input");
  Ge.maxLength = 40, Ge.placeholder = "Label, e.g. Opera launch", Ge.setAttribute("aria-label", "Batch label");
  const Ln = gt("p", "", "ppp-mute"), Gt = () => {
    Ln.textContent = ce();
  };
  for (const $ of [Yt, Ce, ve])
    $.oninput = Gt, $.onchange = Gt;
  Gt();
  function cn($) {
    var et, bt, se, Xt, jt, Mt;
    const j = (et = $.gate) == null ? void 0 : et.gifts;
    if (!(j != null && j.enabled) || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const z = t.main(), R = [gt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!z)
      R.push(gt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      be.disabled = !!N, R.push(Ut, an, be), t.now() - b > 3e4 && (b = t.now(), L(z));
      const h = M(z);
      if (h.length) {
        const m = gt("ul", "", "ppp-gift-list");
        for (const f of h.slice(0, 10)) {
          const H = (bt = f.view) == null ? void 0 : bt.status, st = f.error ? f.error : !H || H === "pending-deposit" ? f.txid ? "payment confirming…" : "waiting for your payment" : H === "live" ? "ready to share" : H === "claiming" || H === "claimed" ? "claimed ✓" : H === "refunding" ? "expired · refund on its way" : H === "refunded" ? "expired · refunded to you" : H, ot = gt("li");
          if (ot.append(gt("span", `${un(BigInt(f.amount))} STX`, "t"), gt("span", st, ((se = f.view) == null ? void 0 : se.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Xt = f.view) == null ? void 0 : Xt.status) === "live") {
            const Ht = dt(((jt = $.gate) == null ? void 0 : jt.radioUrl) ?? null, f.code);
            ot.append($s("gift-copy:" + f.id, "Copy link", () => Ht, "tiny", t.changed), Ry("gift-share:" + f.id, "Share", () => at(Ht), "tiny", t.changed));
          }
          m.append(ot);
        }
        R.push(m);
      }
      if (j.admin) {
        const m = gt("div", "", "ppp-gift-admin"), f = (Tt, Nt) => {
          const Ot = gt("label", Tt);
          return Ot.append(Nt), Ot;
        }, H = D(z);
        m.append(
          gt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          Ae,
          Le,
          re,
          ne,
          pr("Sign and make player", () => void yt(z, { title: Ae.value, subtitle: Le.value, tracks: re.value, cover: ne.value }))
        );
        const st = pr("Sign, pay and make links", () => {
          Qt(z, Wt(), Ge.value.trim(), Yt.value || void 0);
        });
        st.disabled = !!N;
        const ot = Yt.value;
        Yt.replaceChildren(pa("No album (starter copies)", ""), ...H.map((Tt) => pa(`${Tt.title} · ${Tt.tracks} songs`, Tt.id))), H.some((Tt) => Tt.id === ot) && (Yt.value = ot), Gt(), m.append(
          gt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          f("Album ", Yt),
          f("Plays each ", Ce),
          f("Copies ", ve),
          Ge,
          Ln,
          st
        ), t.now() - kt > 3e4 && (kt = t.now(), Ft(z));
        const Ht = I(z);
        if (Ht.length) {
          const Tt = gt("ul", "", "ppp-gift-list");
          for (const Nt of Ht.slice(0, 10)) {
            const Ot = Nt.view, mt = Ot == null ? void 0 : Ot.copies, ue = Nt.error ? Nt.error : !Ot || Ot.status === "pending-deposit" ? Nt.txid ? "payment confirming…" : "waiting for your payment" : `${mt.claimed} of ${Ot.count} claimed${mt.refunding + mt.refunded ? ` · ${mt.refunded} refunded${mt.refunding ? `, ${mt.refunding} on their way` : ""}` : ""}`, $e = gt("li");
            if ($e.append(gt("span", `${Nt.label || "Batch"} · ${Nt.count} × ${un(BigInt(Nt.amount))} STX`, "t"), gt("span", ue, "ppp-mute")), !Nt.txid && Nt.depositTo && (!Ot || Ot.status === "pending-deposit") && $e.append(pr("Pay now", () => void Ne(z, Nt.id), "tiny")), Nt.codes.length && (Ot == null ? void 0 : Ot.status) === "live") {
              const _e = Re(((Mt = $.gate) == null ? void 0 : Mt.radioUrl) ?? null, Nt);
              $e.append(
                $s("batch-copy:" + Nt.id, "Copy all links", () => _e.join(`
`), "tiny", t.changed),
                $s("batch-csv:" + Nt.id, "Copy as CSV", () => ["copy,link", ..._e.map((Te, Qe) => `${Qe + 1},${Te}`)].join(`
`), "tiny", t.changed)
              );
            } else Nt.codes.length || $e.append(gt("span", "links were made on another device", "ppp-mute"));
            Tt.append($e);
          }
          m.append(Tt);
        }
        R.push(m);
      }
    }
    return N && R.push(gt("p", N, "ppp-cyan")), P && R.push(gt("p", P, /✓/.test(P) ? "ppp-ok" : "ppp-warn")), T.replaceChildren(...R), T;
  }
  return { banner: v, funder: _, renderFold: cn, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: V };
}
const r$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function s$(t) {
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
const i$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((i) => !i.hidden).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function o$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = i$(s);
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
function a$(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const yi = 12, c$ = 5e3, nn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, wi = (t, e, n = "") => {
  const r = nn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function l$(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = yi;
  const l = nn("div", "", "ppp-shelf-box"), g = (L) => "xtrata.radio.shelf.pins.v1:" + L, p = (L) => "xtrata.radio.shelf.recent.v1:" + L, E = (L, U) => {
    try {
      return JSON.parse(t.store.get(L) || "null") ?? U;
    } catch {
      return U;
    }
  }, A = (L) => new Set(E(g(L), []).filter((U) => Number.isSafeInteger(U))), B = (L) => {
    const U = E(p(L), {}), J = {};
    for (const [D, yt] of Object.entries(U)) Number.isSafeInteger(Number(D)) && typeof yt == "number" && (J[Number(D)] = yt);
    return J;
  };
  async function K(L) {
    if (!i) {
      i = !0, s = !1;
      try {
        const U = [];
        let J = 0, D = 0;
        for (let yt = 0; yt < c$ / 100 + 1; yt++) {
          const dt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(L)}&after=${J}&limit=100`);
          if (U.push(...s$(dt == null ? void 0 : dt.shelf)), D = Number(dt == null ? void 0 : dt.total) || U.length, !(dt != null && dt.next) || !Number.isSafeInteger(dt.next)) break;
          J = dt.next;
        }
        L === e && (n = U, r = D, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const V = () => {
    o = -1 / 0;
  }, v = nn("input");
  v.type = "search", v.placeholder = "Search title, artist or #", v.setAttribute("aria-label", "Search your albums"), v.oninput = () => {
    a = v.value, d = yi, t.changed();
  };
  const _ = nn("select");
  _.setAttribute("aria-label", "Sort albums");
  for (const L of r$) {
    const U = document.createElement("option");
    U.value = L.value, U.textContent = L.label, _.append(U);
  }
  _.onchange = () => {
    c = _.value, d = yi, t.changed();
  };
  const T = wi("", () => {
    u = !u, d = yi, t.changed();
  }, "tiny"), S = nn("div", "", "ppp-shelf-tools");
  S.append(v, _, T);
  const N = nn("div"), P = nn("div");
  function M(L) {
    const U = L.step === "off" || L.step === "elsewhere" ? void 0 : L.root;
    if (U !== e && (e = U, n = [], r = 0, o = -1 / 0, d = yi), !U || L.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && K(U), !n.length)
      return s ? (P.replaceChildren(nn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), wi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(P), l) : null;
    const J = A(U), D = B(U), yt = o$(n, { query: a, sort: c, pinnedOnly: u, pins: J, recents: D });
    v.value !== a && (v.value = a), _.value = c, T.textContent = u ? "★ Pinned only" : "☆ Pinned only", T.setAttribute("aria-pressed", String(u));
    const dt = [];
    if (L.slot > 0 && dt.push(wi("← My player", () => t.open(0), "quiet")), !yt.length) dt.push(nn("p", "No album matches that.", "ppp-mute"));
    else {
      const at = nn("ul", "", "ppp-shelf-list");
      for (const I of yt.slice(0, d)) {
        const F = nn("li", "", I.slot === L.slot ? "now" : ""), rt = J.has(I.slot), Ct = wi(rt ? "★" : "☆", () => {
          const Qt = new Set(J);
          rt ? Qt.delete(I.slot) : Qt.add(I.slot), t.store.set(g(U), JSON.stringify([...Qt])), t.changed();
        }, "tiny");
        Ct.setAttribute("aria-label", rt ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const kt = [I.player.subtitle, `${$o(I.player).length} ${$o(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ft = I.slot === L.slot, Ne = wi(Ft ? "Playing" : "Play", () => {
          t.store.set(p(U), JSON.stringify(a$({ ...D, [I.slot]: t.now() }))), t.open(I.slot);
        }, Ft ? "tiny" : "tiny primary");
        Ne.disabled = Ft, F.append(Ct, nn("span", I.player.title, "t"), nn("span", " " + kt, "ppp-mute"), Ne), at.append(F);
      }
      dt.push(at), yt.length > d && dt.push(wi(`Show more (${yt.length - d} left)`, () => {
        d += yi, t.changed();
      }, "quiet"));
    }
    return s && dt.push(nn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), N.replaceChildren(...dt), l.firstChild !== S && l.replaceChildren(S, N), l;
  }
  return { render: M, invalidate: V, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const L = B(e), U = [...n].filter((J) => J.player).sort((J, D) => (L[D.slot] ?? 0) - (L[J.slot] ?? 0) || D.slot - J.slot)[0];
    return U ? { slot: U.slot, title: U.player.title } : null;
  } };
}
const u$ = 20, Fe = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ee = {
  grid: Fe('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Fe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Fe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Fe('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Fe('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Fe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Fe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Fe('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Fe('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Fe('<path d="M6 9l6 6 6-6"/>', 18),
  right: Fe('<path d="M9 6l6 6-6 6"/>', 16),
  close: Fe('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Fe('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Fe('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Fe('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  info: Fe('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Y(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [i, s] of Object.entries(e))
    s == null || s === !1 || (i === "class" ? r.className = String(s) : i === "html" ? r.innerHTML = String(s) : i.startsWith("on") && typeof s == "function" ? r[i.toLowerCase()] = s : i === "disabled" ? r.disabled = !!s : r.setAttribute(i, s === !0 ? "" : String(s)));
  for (const i of n) i != null && i !== !1 && r.append(i);
  return r;
}
const Ve = (t, ...e) => Y("button", { type: "button", ...t }, ...e), ga = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, ro = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, f$ = { music: "My music", device: "This device", gifts: "Send music to a friend" }, d$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function h$(t, e) {
  let n = null, r = "", i = !1;
  const s = document.documentElement, o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  function c(S) {
    var P, M, x;
    if (!S || !Number.isSafeInteger(S)) return "";
    const N = (x = (M = (P = e.radio()) == null ? void 0 : P.getState) == null ? void 0 : M.call(P)) == null ? void 0 : x.albumCover;
    return N != null && N.url && Number(N.tokenId) === S ? N.url : o.has(S) ? o.get(S) : (a.has(S) || (a.add(S), fetch("/inscription/" + S, { signal: AbortSignal.timeout(2e4) }).then(async (b) => {
      var U, J, D, yt;
      const L = (b.headers.get("content-type") || "").toLowerCase();
      if (!b.ok)
        throw await ((U = b.body) == null ? void 0 : U.cancel()), new Error("no cover");
      return L.startsWith("image/") ? (await ((J = b.body) == null ? void 0 : J.cancel()), "/inscription/" + S) : L.includes("text/html") ? (((D = (await b.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : D[1]) ?? "").replace(/&amp;/g, "&") : (await ((yt = b.body) == null ? void 0 : yt.cancel()), "");
    }).then((b) => {
      o.set(S, b), T();
    }).catch(() => {
      a.delete(S);
    })), "");
  }
  function u(S) {
    var P;
    r = S, S ? s.dataset.sheet = S : delete s.dataset.sheet;
    const N = document.querySelector(".side");
    if (S && S !== "more") {
      for (const b of d$[S]) {
        const L = N == null ? void 0 : N.querySelector(b);
        L && (L.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = f$[S]);
      const x = document.getElementById("sheetExtra");
      x && x.replaceChildren(...S === "music" ? [l()] : []), (P = N == null ? void 0 : N.scrollTo) == null || P.call(N, { top: 0 });
    }
    T();
  }
  const d = document.getElementById("sheetClose");
  d && (d.onclick = () => u("")), document.addEventListener("keydown", (S) => {
    S.key === "Escape" && r && s.dataset.view === "album" && u("");
  });
  const l = () => Ve(
    { class: "al-row", onClick: () => {
      u(""), e.openPlayer();
    } },
    Y("span", { class: "al-row-i", html: Ee.radio }),
    Y("span", { class: "al-row-t" }, Y("b", {}, "Xtrata Radio"), Y("small", {}, "Every song on-chain · FM, liked, all")),
    Y("span", { class: "al-row-go", html: Ee.right })
  );
  let g = null, p = !1;
  const E = () => {
    var N;
    const S = e.radio();
    p || !(S != null && S.subscribe) || (p = !0, S.subscribe((P) => {
      g = P, (n == null ? void 0 : n.mode) === "open" && T();
    }), g = ((N = S.getState) == null ? void 0 : N.call(S)) ?? null);
  };
  setInterval(() => {
    var M, x;
    if ((n == null ? void 0 : n.mode) !== "open" || !(g != null && g.playing)) return;
    const S = (x = (M = e.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : x.call(M), N = t.querySelector(".al-bar > i"), P = t.querySelectorAll(".al-times span");
    !S || !N || (N.style.width = S.duration ? `${Math.min(100, S.current / S.duration * 100)}%` : "0%", P.length === 2 && (P[0].textContent = ga(S.current || 0), P[1].textContent = S.duration ? ga(S.duration) : "–:––"));
  }, 500);
  function A(S, N) {
    const P = c(S.cover);
    return Y(
      "div",
      { class: "al-cover" + (N ? "" : " al-cover--small") },
      P ? Y("img", { src: P, alt: `${S.title} cover` }) : Y("div", { class: "al-cover-fallback" }, Y("b", {}, S.title), S.subtitle ? Y("span", {}, S.subtitle) : null)
    );
  }
  function B(S) {
    return S.plays === null || S.plays === void 0 ? Y("span", { class: "al-chip al-chip--quiet" }, S.playsComing ? "Plays on their way…" : "…") : S.plays === 0 ? Y("span", { class: "al-chip al-chip--out" }, S.playsComing ? "Plays on their way…" : "No plays left") : Y("span", { class: "al-chip" + (S.plays <= u$ ? " al-chip--low" : "") }, `${ro(S.plays, "play", "plays")} left`);
  }
  function K(S) {
    const N = S.player, P = N.tracks.filter((x) => !x.hidden), M = [];
    return S.mode === "arrive" && S.from && M.push(Y("p", { class: "al-from" }, Y("span", { html: Ee.gift }), Y("span", {}, Y("b", {}, S.from), " sent you an album"))), M.push(A(N, !0)), M.push(Y(
      "div",
      { class: "al-intro" },
      Y("h1", {}, N.title),
      N.subtitle ? Y("p", { class: "al-artist" }, N.subtitle) : null,
      P.length ? Y("p", { class: "al-songline" }, P.map((x) => x.title || `#${x.id}`).join(" · ")) : null,
      Y("span", { class: "al-chip" }, [ro(P.length, "song", "songs"), S.offered ? ro(S.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), S.status.length && M.push(Y("div", { class: "al-status", role: "status" }, ...S.status)), M.push(Y("div", { class: "al-grow" })), S.asking ? M.push(Y("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : S.primary && M.push(Ve({ class: "al-primary", onClick: S.primary.run, disabled: S.busy }, Y("span", { html: Ee.playSmall }), S.primary.label)), S.hint && !S.asking && M.push(Y("p", { class: "al-hint" }, S.hint)), S.secondary && !S.asking && M.push(Ve({ class: "al-link", onClick: S.secondary.run, disabled: S.busy }, S.secondary.label)), M;
  }
  function V(S) {
    var dt;
    const N = S.player, P = N.tracks.filter((at) => !at.hidden), M = e.radio(), x = g == null ? void 0 : g.nowPlaying, b = x && N.tracks.some((at) => String(at.id) === String(x.tokenId)) ? String(x.tokenId) : null, L = b ? N.tracks.find((at) => String(at.id) === b) : null, U = S.plays === 0 && !S.playsComing, J = !!(g != null && g.playing) && !!b, D = g == null ? void 0 : g.heart, yt = [A(N, !U)];
    if (yt.push(Y(
      "div",
      { class: "al-now" },
      Y(
        "div",
        { class: "al-now-t" },
        Y("div", { class: "al-song" }, L ? L.title || (x == null ? void 0 : x.title) || `#${L.id}` : N.title),
        Y("div", { class: "al-artist" }, L ? L.artist || (x == null ? void 0 : x.artist) || N.subtitle : N.subtitle || "Press play")
      ),
      b ? Ve({ class: "al-icon" + (D != null && D.liked ? " is-on" : ""), "aria-label": D != null && D.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(D != null && D.liked)), disabled: !!(D != null && D.pending) || !!(D != null && D.locked), onClick: () => {
        var at;
        return (at = M == null ? void 0 : M.toggleLike) == null ? void 0 : at.call(M);
      }, html: D != null && D.liked ? Ee.heartOn : Ee.heart }) : null
    )), U)
      yt.push(Y(
        "div",
        { class: "al-out" },
        Y("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Y("p", { class: "al-out-t" }, "You've played this album out"),
        Y("p", { class: "al-out-s" }, "Add plays to keep listening."),
        v(S, !0)
      ));
    else {
      const at = b ? (dt = M == null ? void 0 : M.getPosition) == null ? void 0 : dt.call(M) : null, I = at != null && at.duration ? Math.min(100, at.current / at.duration * 100) : 0;
      yt.push(Y(
        "div",
        { class: "al-prog" },
        Y("div", { class: "al-bar" }, Y("i", { style: `width: ${I}%` })),
        Y("div", { class: "al-times" }, Y("span", {}, ga((at == null ? void 0 : at.current) || 0)), Y("span", {}, at != null && at.duration ? ga(at.duration) : "–:––"))
      ));
    }
    return yt.push(Y(
      "div",
      { class: "al-ctl" + (U ? " is-off" : "") },
      Ve({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: U, onClick: () => {
        var at;
        return (at = M == null ? void 0 : M.prev) == null ? void 0 : at.call(M);
      }, html: Ee.prev }),
      Ve({ class: "al-play", "aria-label": J ? "Pause" : "Play", disabled: U, onClick: () => {
        var at;
        return (at = M == null ? void 0 : M.playPause) == null ? void 0 : at.call(M);
      }, html: J ? Ee.pause : Ee.play }),
      Ve({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: U, onClick: () => {
        var at;
        return (at = M == null ? void 0 : M.next) == null ? void 0 : at.call(M);
      }, html: Ee.next })
    )), S.status.length && yt.push(Y("div", { class: "al-status", role: "status" }, ...S.status)), yt.push(Y("div", { class: "al-listhead" }, Y("span", {}, Y("b", {}, N.title), ` · ${ro(P.length, "song", "songs")}`), B(S))), yt.push(Y("ol", { class: "al-tracks" }, ...P.map((at, I) => {
      const F = String(at.id) === b;
      return Y("li", {}, Ve(
        { class: "al-track" + (F ? " is-on" : ""), "aria-label": `Play ${at.title || "#" + at.id}`, "aria-current": F ? "true" : void 0, disabled: U, onClick: () => {
          var rt;
          return (rt = M == null ? void 0 : M.playToken) == null ? void 0 : rt.call(M, at.id);
        } },
        Y("span", { class: "al-n" }, String(I + 1)),
        Y("span", { class: "al-tt" }, at.title || `#${at.id}`),
        F ? Y("span", { class: "al-eq", html: Ee.eq }) : null
      ));
    }))), yt.push(Y("div", { class: "al-grow" })), yt.push(Ve(
      { class: "al-more", "aria-expanded": String(r === "more"), onClick: () => u(r === "more" ? "" : "more") },
      Y("span", {}, "More ", Y("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Y("span", { html: Ee.down })
    )), yt;
  }
  function v(S, N) {
    const P = Y("div", { class: "al-topups" + (N ? " al-topups--primary" : "") }), M = N ? [S.topUps[1] ?? S.topUps[0]] : [...S.topUps];
    for (const x of M) {
      const b = S.myPlays !== void 0 && S.myPlays >= x && !S.playsComing && !S.busy;
      P.append(Ve({ class: "al-topup", disabled: !b, onClick: () => e.topUp(x) }, N ? `Add ${x.toLocaleString()} plays` : `+${x.toLocaleString()}`));
    }
    return N && P.append(Ve({ class: "al-link", onClick: () => u("more") }, "Other amounts")), P;
  }
  function _(S) {
    const N = S.myPlays !== void 0 && S.myPlays >= (S.topUps[0] ?? 0), P = Y(
      "div",
      { class: "al-card" },
      Y("div", { class: "al-card-h" }, Y("b", {}, `Add plays to ${S.player.title}`), Y("span", { class: "al-mono" }, S.plays === null || S.plays === void 0 ? "" : `${S.plays.toLocaleString()} left`)),
      v(S, !1),
      Y("p", { class: "al-mute al-small" }, S.playsComing ? "Plays are on their way. Add more once they arrive." : S.myPlays === void 0 ? "Checking My player…" : N ? `Moved from My player · ${ro(S.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !N && !S.playsComing && S.myPlays !== void 0 ? Ve({ class: "al-link", onClick: () => {
        u(""), e.openPlayer();
      } }, "Open My player") : null
    ), M = (b, L, U, J) => Ve(
      { class: "al-row", onClick: J },
      Y("span", { class: "al-row-i", html: b }),
      Y("span", { class: "al-row-t" }, Y("b", {}, L), Y("small", {}, U)),
      Y("span", { class: "al-row-go", html: Ee.right })
    ), x = Y(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      M(Ee.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, T();
      }),
      i ? Y("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Y(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Y("div", { class: "al-sheet-h" }, Y("b", {}, "More"), Ve({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: Ee.close })),
      S.mode === "open" ? P : null,
      Y(
        "div",
        { class: "al-rows" },
        M(Ee.grid, "My music", "Your albums and the radio", () => u("music")),
        M(Ee.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), e.openPlayer();
        }),
        M(Ee.gift, "Send music to a friend", "They open it with a link", () => u("gifts")),
        M(Ee.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        x
      )
    );
  }
  function T() {
    const S = n;
    if (!S) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    E(), t.hidden = !1;
    const N = Y(
      "header",
      { class: "al-top" },
      Y("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Y("b", {}, "Music")),
      S.mode === "open" ? Ve({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: Ee.grid }) : null
    ), P = Y("div", { class: "al-body al-body--" + S.mode }, ...S.mode === "open" ? V(S) : K(S));
    t.replaceChildren(N, P, ...r === "more" ? [Y("div", { class: "al-scrim", onClick: () => u("") }), _(S)] : []);
  }
  return {
    render(S) {
      const N = !!n;
      n = S, !S && (N || r) && (r = "", delete s.dataset.sheet), S ? s.dataset.view = "album" : delete s.dataset.view, S != null && S.asking ? s.dataset.asking = "1" : delete s.dataset.asking, T();
    },
    sheet: () => r,
    setSheet: u
  };
}
const p$ = [
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
function g$(t) {
  for (const [e, n] of p$) if (n.test(t)) return e;
  return null;
}
const Gy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Ky = (t) => /Android/.test(t);
function y$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Gy(e) ? "x-safari-" + n.href : Ky(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const w$ = (t) => Gy(t) ? "Safari" : Ky(t) ? "Chrome" : "your browser", a0 = document.getElementById("ppp");
a0 && b$(a0);
function b$(t) {
  var Mt;
  const e = $w(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let i = null;
  const s = async (h, m) => {
    const f = await fetch(h, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), H = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((H == null ? void 0 : H.error) || `Request failed (${f.status}).`);
    return H;
  }, o = J5({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const m = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = m == null ? void 0 : m.find((H) => H.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), i.referrerPolicy = "no-referrer";
      const m = new Promise((ot, Ht) => {
        i.addEventListener("load", () => ot(), { once: !0 }), setTimeout(() => Ht(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = h + "/", r.replaceChildren(i), await m;
      const f = new yw({ walletOrigin: h, frame: i, timeoutMs: 30 * 6e4 }), H = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), st = (ot, Ht) => H.has(ot) ? f.request(ot, Ht) : Promise.race([
        f.request(ot, Ht),
        new Promise((Tt, Nt) => setTimeout(() => Nt(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await st("listening.status"), { request: st };
    },
    chain: {
      verify: M5,
      balance: _5,
      account: N5,
      owner: P5,
      broadcast: U5,
      transaction: H5,
      confirmedNonce: async (h) => {
        const m = await cs(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (h, m) => zh({ ...m, network: "mainnet", stxAddress: h }),
    deposit: (h, m, f) => new Promise((H, st) => Hh({
      recipient: m,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new al(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ot) => H(ot.txId || ""),
      onCancel: () => st(new Error("Deposit cancelled. Nothing was sent.")),
      onError: st
    })),
    validate: O5,
    tabLock: (h) => new Promise((m) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        m(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (H) => {
        m(!!H), H && await new Promise(() => {
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
      set: (h, m) => {
        try {
          localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    changed: () => et(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var m, f;
      return a.funder(h, () => G5(h, cs), !!((f = (m = o.snapshot().gate) == null ? void 0 : m.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const m = await s("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = m == null ? void 0 : m.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, m) => q5(h, (f) => cs(f), m),
    likesChanged: () => {
      var h, m;
      (m = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || m.call(h);
    },
    likeState: async (h, m) => {
      const f = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(m) })), H = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((st) => (st == null ? void 0 : st.id) === m) : null;
      if (!H || typeof H.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: H.liked, by: Array.isArray(H.by) ? H.by.filter((st) => typeof st == "string") : H.liked ? [h] : [] };
    },
    likeSent: (h, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: m } })),
    nameOf: (h) => at(h) ?? void 0,
    likeConfirmed: (h, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: m } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = n$({
    json: s,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, m, f, H) => new Promise((st, ot) => Hh({
      recipient: m,
      amount: f.toString(),
      memo: H,
      stxAddress: h,
      network: new al(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (Ht) => st(Ht.txId || ""),
      onCancel: () => ot(new Error("Gift cancelled. Nothing was sent.")),
      onError: ot
    })),
    sign: (h, m) => zh({ ...m, network: "mainnet", stxAddress: h }),
    giftSent: (h, m) => o.giftSent(h, m),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, m, f, H) => {
      c.invalidate(), await o.albumArriving(h, m, f, H);
    } },
    who: (h) => rt(h),
    changed: () => et(o.snapshot()),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, m) => {
        try {
          m === null ? localStorage.removeItem(h) : localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = l$({
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
      set: (h, m) => {
        try {
          m === null ? localStorage.removeItem(h) : localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => et(o.snapshot())
  }), u = document.getElementById("album"), d = u ? h$(u, {
    radio: () => window.XtrataRadio ?? null,
    topUp: (h) => void o.topUpAlbum(h),
    openPlayer: () => void o.openAlbum(0)
  }) : null, l = "xtrata.radio.album.last.v1", g = () => {
    try {
      const h = JSON.parse(localStorage.getItem(l) || "null");
      return h && typeof h.root == "string" && Number.isSafeInteger(h.slot) && h.slot > 0 && h.player && Array.isArray(h.player.tracks) ? h : null;
    } catch {
      return null;
    }
  };
  let p = "";
  const E = (h) => {
    const m = JSON.stringify(h);
    if (m !== p) {
      p = m;
      try {
        localStorage.setItem(l, m);
      } catch {
      }
    }
  };
  let A = null;
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    Qt();
    const m = Wt(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let B;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const K = (h) => {
    var f, H;
    const m = window.XtrataRadioListeningIdentity();
    m !== B && (B = m, (H = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || H.call(f));
  };
  let V = "", v = null, _ = !1;
  const T = (h) => {
    var Ht, Tt, Nt, Ot, mt, ue;
    const m = window.XtrataRadio;
    if (!(m != null && m.setGiftPlayer) || !(m != null && m.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((Ht = h.gift) == null ? void 0 : Ht.player) ?? null, H = f ? f.id + ":" + f.cover + ":" + f.tracks.map(($e) => $e.id).join(",") : "";
    H !== V && (m.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: $o(f).map(($e) => $e.id), hidden: ((Tt = J6(f)) == null ? void 0 : Tt.id) ?? null, cover: f.cover } : null), V = H);
    const st = ((Nt = h.giftStop) == null ? void 0 : Nt.text) ?? null;
    st !== v && (m.setGiftStop(st), v = st);
    const ot = !!f && !!((Ot = h.albumLock) != null && Ot.locked);
    ot !== _ && ((mt = m.setGiftLock) == null || mt.call(m, ot), _ = ot), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((ue = m.forgetWallets) == null || ue.call(m));
  }, S = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", N = (h) => {
    const m = o.snapshot().playCost || 350n;
    return h > Me ? Number((h - Me) / m) : 0;
  }, P = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), M = (h) => {
    const m = Math.round((Date.now() - h) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, x = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, b = (h, m = "", f = "") => {
    const H = document.createElement(h);
    return m && (H.textContent = m), f && (H.className = f), H;
  }, L = (h, m, f = "") => {
    const H = b("button", h, f);
    return H.type = "button", H.onclick = m, H;
  }, U = (h, m) => {
    const f = b("a", h);
    return f.href = m, f.target = "_blank", f.rel = "noopener", f;
  };
  let J = null, D = location.hash === "#give";
  D && history.replaceState(null, "", location.pathname + location.search);
  let yt = !1;
  const dt = U6((h) => P6({ address: h, network: "mainnet" }), () => et(o.snapshot())), at = (h) => dt.get(h), I = g$(navigator.userAgent), F = (h, m) => {
    const f = navigator.userAgent, H = w$(f), st = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, ot = [b("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${H} to make your listening wallet${m ? " and claim your gift" : ""}.`, "ppp-warn")], Ht = b("div", "", "ppp-open-row"), Tt = y$(st, f);
    if (Tt) {
      const Nt = b("a", `Open in ${H}`, "primary ppp-open-in");
      Nt.href = Tt, Nt.dataset.homeAction = "radio:open-in-browser", Ht.append(Nt);
    }
    return Ht.append($s("copy-page-link", "Copy link", () => st, Tt ? "" : "primary", () => et(o.snapshot()))), ot.push(Ht, b("p", `If that does not open ${H}, use ${h}'s menu (••• or ⋮) and choose "Open in ${H === "your browser" ? "browser" : H}", or paste the copied link there.`, "ppp-mute")), ot;
  }, rt = (h) => at(h) ?? S(h), Ct = (h) => h.slice(0, 2).map(rt).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), kt = /* @__PURE__ */ new Map();
  let Ft = !1;
  const Ne = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), Qt = () => {
    Ft || (Ft = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const m of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(f) && kt.set(f, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      et(o.snapshot());
    }).catch(() => {
      Ft = !1;
    }));
  }, Wt = (h, m) => {
    const f = kt.get(h), H = O6(h, [f == null ? void 0 : f.title, m == null ? void 0 : m.title].find((ot) => !Ne(ot)) || ""), st = H6(h, (f == null ? void 0 : f.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: H, artist: st };
  }, ce = (h) => {
    const { title: m, artist: f } = Wt(h.song, h);
    return m ? `“${m}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, Re = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Ut = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function an(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["TOO MUCH", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function be(h, m, f = "", H) {
    const st = b("dt", h), ot = b("dd", m, f);
    return H && ot.append(" ", H), [st, ot];
  }
  const le = document.getElementById("ppp-top"), On = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ae = () => {
    var m, f;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (m = document.getElementById("radio-wallet-connect")) == null || m.click();
      return;
    }
    if (h.step === "elsewhere" && ((f = h.gate) != null && f.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), On();
  };
  le && (le.onclick = Ae);
  function Le(h) {
    if (!le) return;
    const m = (H, st, ot) => {
      le.hidden = !1, le.className = "ppp-top" + (st ? " is-" + st : ""), le.replaceChildren(b("span", "", "dot"), document.createTextNode(H)), le.title = ot;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        le.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        le.hidden = !0;
        return;
      case "intro":
        return m("Start listening", "", "Make your player with a passkey: no app or account needed");
      case "wrong-wallet":
        return m(`Connect ${rt(h.linked)}`, "warn", `This device's listening wallet belongs to ${rt(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your passkey");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return h.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(h.entries.some((H) => H.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return h.payingOn && f > 0 ? m(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const re = document.getElementById("pppNudge"), ne = document.getElementById("onair");
  (Mt = re == null ? void 0 : re.querySelector("button")) == null || Mt.addEventListener("click", () => Ae());
  const Yt = {
    elsewhere: "Plays are not counted here",
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, Ce = {
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
  function ve(h) {
    if (h.step === "loading") return;
    const m = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && m > 0, H = h.step === "fund" && h.depositPending, st = f || H ? "" : Yt[h.step] ?? "", ot = f ? "on" : st ? "off" : "";
    ot ? document.documentElement.dataset.ppp = ot : delete document.documentElement.dataset.ppp, ne && (ne.hidden = !ot, ne.querySelector(".onair-sub").textContent = f ? `${m.toLocaleString()} plays left` : "Plays off"), re && (re.hidden = ot !== "off", ot === "off" && (re.querySelector(".nudge-t").textContent = st, re.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", re.querySelector("button").textContent = Ce[h.step] ?? "Start"));
  }
  let Ge = "";
  function Ln(h) {
    const m = b("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && m.append(b("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && m.append(b("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = b("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = Ge, f.oninput = () => {
      Ge = f.value;
    };
    const H = L(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), Ge = "";
    }, "tiny");
    return m.append(f, " ", H), h.returnToKind === "chosen" && m.append(" ", L("Back to the funder", () => o.clearReturnAddress(), "tiny")), m;
  }
  const Gt = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function cn() {
    const h = b("p", Gt + " ", "ppp-mute");
    return h.append(U("Xverse", "https://www.xverse.app/download"), " · ", U("Leather", "https://leather.io/install-extension")), h;
  }
  let ir = "";
  const $ = (h) => {
    const m = document.documentElement, f = h.solo && !h.main ? h.listening ? S(h.listening) : "new" : "", H = s6() ? "1" : "";
    `${f}|${H}` !== ir && (ir = `${f}|${H}`, f ? m.dataset.pppSolo = f : delete m.dataset.pppSolo, H ? m.dataset.pppWalletInstalled = H : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => et(o.snapshot()), h);
  function j(h, m = "") {
    const f = b("div", "", "ppp-topup"), H = z(h);
    f.append(b("span", "Add plays from My player: ", "ppp-mute"));
    for (const st of va) {
      const ot = L(`+${st.toLocaleString()}`, () => void o.topUpAlbum(st), m);
      ot.disabled = H === void 0 || H < st || h.depositPending || !!h.busy, f.append(ot);
    }
    return H !== void 0 && H < va[0] && f.append(b("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const z = (h) => {
    var H;
    const m = (H = h.likeFunds) == null ? void 0 : H.balance;
    if (m === void 0 || !h.playCost) return;
    const f = m - Me - 6000n;
    return f > 0n ? Number(f / h.playCost) : 0;
  };
  function R(h) {
    const m = h.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    const f = b("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      const st = b("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return m.txid && st.append(U("View", x(m.txid))), f.append(st), [f];
    }
    f.append(b("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(b("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(b("p", m.address, "ppp-addr-full"));
    const H = b("div", "", "ppp-open-row");
    if (H.append($s("copy-likes-address", "Copy address", () => m.address, "primary", () => et(o.snapshot()))), m.main && !h.solo) {
      const st = vs - (m.balance ?? 0n);
      st > 0n && H.append(L(`Pay ${Vn(st)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(H), f.append(b("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  function et(h) {
    var hs, or, ar, ci, cr, pe, li, ui, lr, Cr, ur, Tr, Br;
    if (A && ["ready", "fund", "over"].includes(h.step) && !h.busy) {
      const q = A;
      A = null, h.root === q.root && h.slot !== q.slot && o.openAlbum(q.slot);
    }
    const m = a.inProgress(h), f = m && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (K(), T(h), $(f), Le(f), ve(f), t.hidden = f.step === "off", t.hidden) return;
    const [H, st] = an(f), ot = n(".ppp-state");
    ot.textContent = H, ot.className = "ppp-state" + (st ? " ppp-state--" + st : ""), ot.hidden = !H;
    const Ht = !!f.busy || f.armed, Tt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ht || !["intro", "loading"].includes(f.step));
    r.hidden = !Tt, r.classList.toggle("ppp-frame--rest", !Ht && !yt);
    const Nt = n(".ppp-frame-label");
    Nt.hidden = !0;
    const Ot = t6(f) ?? J;
    J = Ot;
    const mt = n6(f, Ot);
    n(".ppp-badge").hidden = !mt;
    const ue = n(".ppp-steps"), $e = n(".ppp-stage");
    ue.hidden = $e.hidden = !mt, Ot && mt && (ue.replaceChildren(...fu(f.solo).map((q, it) => {
      const fe = b("li", "", it < Ot.at ? "done" : it === Ot.at ? Ot.blocked ? "now blocked" : "now" : "");
      return fe.append(b("span", it < Ot.at ? "✓" : String(it + 1), "n"), q), it === Ot.at && fe.setAttribute("aria-current", "step"), fe;
    })), $e.textContent = Ot.caption, $e.className = "ppp-stage " + (Ot.at >= fu(f.solo).length ? "ppp-ok" : Ot.blocked ? "ppp-bad" : "ppp-cyan"));
    const _e = n(".ppp-facts"), Te = [];
    f.main && ((hs = f.gate) != null && hs.here) && !f.solo && Te.push(...be("Your wallet", rt(f.main), "ppp-addr-short"));
    const Qe = () => {
      if (!f.listening) return;
      const q = $s("copy-listening", "Copy", () => f.listening || "", "tiny", () => et(o.snapshot()));
      Te.push(...be(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", S(f.listening), "ppp-addr-short", q));
    };
    if (f.linked || Qe(), f.listening && f.step !== "intro")
      if (f.linked)
        Te.push(...be("Credited to", `${rt(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Qe();
      else if (f.solo) {
        f.creditedTo && Te.push(...be("Credited to", `${rt(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${rt(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Te.push(...be("Returns go to", f.gift ? q : f.returnTo && !at(f.returnTo) ? q.replace(S(f.returnTo), f.returnTo) : q, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Te.push(...be("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((or = f.gate) != null && or.here)) {
      const q = f.linkedListening.map((it) => S(it) + (it === f.listening ? " (this one)" : "")).join(", ");
      Te.push(...be(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const q = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Te.push(...be("Balance", `${Vn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, q));
    }
    const bn = f.entries.find((q) => q.kind === "play");
    bn && Qt(), bn && Te.push(...be("Last paid song", `${ce(bn)} → ${rt(bn.recipient)}`, Re[bn.status] || "")), _e.replaceChildren(...Te), _e.hidden = !Te.length;
    const ht = [], zt = [], Rt = [], mn = [], si = In(BigInt(((ar = f.gate) == null ? void 0 : ar.limits.playFee) ?? "300")), Yi = `Each song you listen to for 30 seconds sends ${Vn(Ya)} STX to whoever holds it, plus a ${Vn(si - Ya)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, ii = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (ht.push(b("p", "Pay artists as you listen.")), (ci = f.gate) != null && ci.radioUrl) {
          const it = b("p");
          it.append(U("Open the pay-per-play radio →", f.gate.radioUrl)), ht.push(it);
        }
        zt.push(b("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const it = [f.linked, ...f.others];
          ht.push(b("p", it.length > 1 ? `This device has listening wallets for ${Ct(it)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${rt(f.linked)}. Connect that wallet to keep paying artists.`)), zt.push(b("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ht.push(b("p", "Connect your wallet to pay artists as you listen.")), zt.push(b("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ht.push(b("p", `This device's listening wallet belongs to ${rt(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), zt.push(b("p", `You are connected as ${rt(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), zt.push(b("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Rt.push(L("Switch wallet", () => {
          var it;
          return (it = document.getElementById("radio-wallet-connect")) == null ? void 0 : it.click();
        }, "primary"));
        break;
      case "not-invited":
        ht.push(b("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ht.push(b("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ht.push(b("p", "Every play counts for the song’s owner, on-chain.")), zt.push(b("p", Yi)), zt.push(b("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), zt.push(b("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (ht.push(b("p", `This device already has a listening wallet for ${Ct(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), zt.push(b("p", `Otherwise, set up a new listening wallet for ${rt(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && zt.push(b("p", `This is the listening wallet for ${rt(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && zt.push(b("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = a.liveGift();
        Rt.push(L(q ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${rt(f.main)}` : "Start listening", () => void o.create(), "primary")), !q && !f.solo && f.main && f.others.length && Rt.push(L("Switch wallet", () => {
          var it;
          return (it = document.getElementById("radio-wallet-connect")) == null ? void 0 : it.click();
        })), !q && f.solo && Rt.push(L("I have a Stacks wallet", () => {
          var it;
          return (it = document.getElementById("radio-wallet-connect")) == null ? void 0 : it.click();
        })), Rt.push(L("I already have a listening wallet", () => void o.unlock(!0))), q && Rt.push(L("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (ht.push(b("p", "Locked.", "ppp-mute")), Rt.push(L("Unlock", () => void o.unlock(), "primary"))), mn.push(L("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ht.push(b("p", `Link to ${rt(f.main)} · free`)), zt.push(b("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), zt.push(b("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Rt.push(L(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ht.push(b("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending || ((cr = f.gift) != null && cr.player ? ht.push(b("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? ht.push(b("p", "No plays left · add plays to keep counting", "ppp-bad")) : ht.push(b("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / si)).toLocaleString()} plays`))), (pe = f.gift) != null && pe.player ? zt.push(b("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && zt.push(b("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && zt.push(b("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m || (f.solo ? (zt.push(b("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), zt.push(b("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Rt.push($s("copy-address", "Copy my address", () => f.listening || "", "primary", () => et(o.snapshot())))) : zt.push(b("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const it = b("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          it.append(U("View", x(f.depositTxid))), ht.push(it);
        } else f.allowance > 0n && !f.solo && Rt.push(L(`Deposit ${Vn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ht.push(b("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (ht.push(b("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ht.push(Ln(f))), (!f.solo || f.returnTo) && Rt.push(L("Return excess", () => void o.returnFunds("excess"), "primary"), L("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const it = Math.min(f.session.playsLeft, f.playsLeft);
          ht.push(b("p", `${it.toLocaleString()} plays left`, "ppp-ok")), zt.push(b("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Rt.push(L("Switch off", () => void o.switchOff()));
        } else
          ht.push(b("p", "Plays are off. Music stays free.", "ppp-mute")), Rt.push(L("Switch plays on", () => void o.switchOn(), "primary"));
        f.queued && ht.push(b("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && ht.push(b("p", "Running low on plays", "ppp-warn")), f.depositPending ? ht.push(b("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Rt.push(L(`Top up ${Vn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && zt.push(b("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && zt.push(Ln(f)), zt.push(cn()), f.slot === 0 && f.step === "ready" && f.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = b("p", "New to Stacks? ", "ppp-mute");
      q.append(U("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ht.push(q);
    }
    if (f.walletOutdated && zt.push(b("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (ht.push(b("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Rt.push(L("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && mn.push(L(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${rt(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((li = f.gift) != null && li.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && mn.push(j(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && mn.push(L("Lock", () => void o.lock(), "quiet")), Tt && !Ht && mn.push(L(yt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      yt = !yt, et(o.snapshot());
    }, "quiet")), [...Rt, ...mn].forEach((q) => q.disabled = ii), ii && (Rt.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((ui = f.gift) != null && ui.player)) {
      const q = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", it = ht.at(0);
      f.step === "ready" && it ? it.append(b("span", ` · ${P(f.balance)} STX`, q)) : ht.push(b("p", `Balance ${P(f.balance)} STX`, q));
    }
    if ((lr = f.gift) != null && lr.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const q = b("p", "", "ppp-gift");
      q.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && q.append(" · ", f.gift.player.subtitle);
      const it = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? b("span", " · plays on their way", "ppp-warn") : b("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      it && q.append(it);
      const fe = (Cr = ht.at(0)) == null ? void 0 : Cr.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && fe && /STX/.test(fe.textContent ?? "") && fe.remove(), ht.unshift(q), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          ht.splice(1, 0, b("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), j(f, "primary"));
        else {
          const ke = b("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ke.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ke.append(U("Xverse", "https://www.xverse.app/download"), " and ", U("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ht.splice(1, 0, ke);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const q = f.returnPlan, it = b("div", "", "ppp-pick");
      it.append(b("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const fe = b("ul", "", "ppp-gift-list");
      q.steps.forEach((ke, w) => {
        const k = ke.kind === "gift" ? "the unused gift" : ke.kind === "deposit" ? "what was added to it" : "the rest", G = b("li");
        G.append(b("span", `${w + 1}. ${Vn(BigInt(ke.send))} STX · ${k}`, "t"), b("span", ke.to ? ` → ${rt(ke.to)}` : " → choose an address below", ke.to ? "ppp-mute" : "ppp-warn")), fe.append(G);
      }), it.append(fe), q.kept && it.append(b("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((ke) => !ke.to) && it.append(Ln(f)), it.append(L(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ht.push(it);
    }
    const Ar = bt(f), Pe = a.banner(h, { bare: !!Ar }), oi = I && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? F(I, a.pendingCode()) : [];
    Ar || (ht.unshift(...Pe), ht.unshift(...R(f)), ht.unshift(...oi)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && ht.unshift(b("p", `This is ${rt(f.creditedTo)}'s listening wallet. Plays and likes count for ${rt(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ht);
    const vr = document.querySelector(".ppp-switch");
    if (vr) {
      const q = c.latest(), it = f.slot > 0, fe = ["fund", "ready", "over"].includes(f.step) && (it || !!q);
      if (vr.hidden = !fe, fe) {
        const ke = (k, G, Z, nt) => {
          const W = L("", nt, "ppp-tab");
          return W.setAttribute("aria-pressed", String(Z)), W.append(b("span", k, "tt"), b("span", G === void 0 ? "…" : `${N(G).toLocaleString()} plays`, "ts")), W.disabled = !!f.busy, W;
        }, w = it ? ((Tr = (ur = f.gift) == null ? void 0 : ur.player) == null ? void 0 : Tr.title) ?? "Album" : q.title;
        vr.replaceChildren(
          ke("🎧 My player", it ? (Br = f.likeFunds) == null ? void 0 : Br.balance : f.balance, !it, () => {
            it && o.openAlbum(0);
          }),
          ke("💿 " + w, it ? f.balance : void 0, it, () => {
            !it && q && o.openAlbum(q.slot);
          })
        );
      }
    }
    const $r = c.render(f), Dn = document.querySelector(".ppp-shelf");
    if (Dn) {
      Dn.hidden = !$r;
      const q = Dn.querySelector("summary");
      q && (q.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const it = Dn.querySelector(".ppp-shelf-body");
      $r && it && !it.contains($r) && it.replaceChildren($r);
    }
    const Cn = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !Cn, Cn && !n(".ppp-gift-body").contains(Cn) && n(".ppp-gift-body").replaceChildren(Cn), Cn && D) {
      D = !1;
      const q = n(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...zt), n(".ppp-actions").replaceChildren(...Rt), n(".ppp-actions2").replaceChildren(...mn);
    const Je = f.busy || f.message || "", kr = n(".ppp-msg"), ds = Je && ht.some((q) => (q.textContent ?? "").startsWith(Je.replace(/[.✓\s]+$/, ""))) ? "" : Je, Ir = !ds && !f.error ? f.notice : "";
    kr.textContent = ds || Ir, kr.classList.toggle("is-warn", !!Ir), n(".ppp-err").textContent = f.error;
    const ai = f.entries.filter((q) => q.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...ai.slice(0, 5).map((q) => {
      const it = b("li"), fe = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return it.append(b("span", "", "d " + fe), b("span", ce(q), "t"), b("span", M(q.created), "ppp-mute")), q.txid && it.append(U("tx", x(q.txid))), it;
    })), n(".ppp-wallets").hidden = !(_e.childElementCount || mn.length), n(".ppp-more").hidden = !zt.length;
    const Lr = n(".ppp-history");
    Lr.hidden = !f.entries.length, f.entries.length && Qt(), Lr.replaceChildren(b("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((q) => {
      const it = b("div", "", "ppp-row"), fe = q.kind === "play" ? [b("span", ce(q), "ppp-song"), b("span", ` · ${Vn(BigInt(q.amount))} STX to ${rt(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [b("span", `${q.liked ? "♥ Liked" : "Unliked"} ${ce(q)}`, "ppp-song"), b("span", ` · for ${f.linked ? rt(f.linked) : "this listening wallet"}`, "ppp-mute")] : [b("span", `Returned ${Vn(BigInt(q.amount))} STX`, "ppp-song"), b("span", ` to ${rt(q.recipient)}`, "ppp-mute")];
      return it.append(
        b("span", Ut[q.status] || q.status, "ppp-status " + (Re[q.status] || "")),
        ...fe,
        b("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && it.append(U("tx ↗", x(q.txid))), it;
    })), d == null || d.render(Ar ? se(f, Ar, [...oi, ...Pe]) : null);
  }
  function bt(h) {
    var H;
    if (["off", "elsewhere", "not-invited"].includes(h.step)) return null;
    if (h.slot > 0 && ((H = h.gift) != null && H.player) && ["fund", "ready", "over", "link", "loading"].includes(h.step))
      return h.root && E({ root: h.root, slot: h.slot, player: h.gift.player }), { mode: "open", player: h.gift.player };
    const m = a.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const f = g();
    return f && (h.step === "locked" || A && h.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  function se(h, m, f) {
    var Nt;
    const H = !!h.busy || h.armed, st = [...f];
    h.error ? st.push(b("p", h.error, "ppp-bad")) : h.message && !H ? st.push(b("p", h.message, "ppp-cyan")) : h.notice && st.push(b("p", h.notice, "ppp-warn")), m.mode === "open" && ((Nt = h.likeFunds) != null && Nt.album) && h.likeFunds.low && !h.likeFunds.pending && st.push(b("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const ot = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let Ht = null, Tt = null;
    return m.mode === "locked" ? (Ht = { label: "Continue listening", run: () => {
      A = g(), o.unlock();
    } }, Tt = { label: "Use a different passkey", run: () => {
      A = null, o.unlock(!0);
    } }) : m.mode === "arrive" && (h.step === "intro" ? (Ht = { label: "Open album", run: () => void o.create() }, Tt = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : h.step === "locked" ? (Ht = { label: "Open album", run: () => void o.unlock() }, Tt = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : h.step === "unsupported" ? st.push(b("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : st.length || st.push(b("p", "Opening your album…", "ppp-cyan"))), {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      plays: m.mode === "open" ? h.balance === void 0 ? null : h.giftPlays : void 0,
      playsComing: h.depositPending,
      status: st,
      primary: Ht,
      secondary: Tt,
      hint: Ht ? ot : void 0,
      asking: H,
      busy: !!h.busy,
      myPlays: z(h),
      topUps: va
    };
  }
  const Xt = /* @__PURE__ */ new Map(), jt = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((m) => {
      const f = m == null ? void 0 : m.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && Xt.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!jt()) {
    const h = setInterval(() => {
      jt() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const m = h.detail;
    if (m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      Qt();
      const f = Wt(m.song, Xt.get(m.song));
      o.onListened({ song: m.song, id: m.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const m$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", x$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, S$ = () => x$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, E$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, A$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Vy = class {
  constructor(t) {
    WA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && px(t), this.callback(dc(t));
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
    var r, i, s, o, a, c, u, d, l, g;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = S$(), e = E$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return xt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, xt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), xt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, xt("div", { class: "flex flex-col space-y-[10px]" }, xt("div", { class: "flex items-center" }, xt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), xt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, xt("span", { class: "sr-only" }, "Close popup"), xt("img", { src: m$ }))), r ? xt("p", null, "Select the wallet you want to connect to.") : xt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && xt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && xt("div", { class: "mt-6" }, xt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), xt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => xt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, xt("div", { class: "aspect-square basis-9 overflow-hidden" }, xt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), xt("div", { class: "flex-1" }, xt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && xt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), xt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && xt("div", { class: "mt-6" }, r ? xt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : xt("div", { class: "mb-5 flex justify-between" }, xt("p", { class: "text-sm font-medium" }, "Recommended wallets"), xt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, xt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, xt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), xt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), xt("p", null, "What is a wallet? ", xt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), xt("ul", { class: "space-y-3" }, n.map((s) => xt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, xt("div", { class: "aspect-square basis-9 overflow-hidden" }, xt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), xt("div", { class: "flex-1" }, xt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && xt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && xt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return CA(this);
  }
};
Vy.style = A$;
const v$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Vy
}, Symbol.toStringTag, { value: "Module" }));
