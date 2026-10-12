var zg = Object.defineProperty;
var Rg = (t, e, n) => e in t ? zg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var is = (t, e, n) => Rg(t, typeof e != "symbol" ? e + "" : e, n);
var zt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ch(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function eo(t) {
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
      typeof zt < "u" && zt || {}, r = {
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
      function s(y) {
        return y && DataView.prototype.isPrototypeOf(y);
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
        ], o = ArrayBuffer.isView || function(y) {
          return y && i.indexOf(Object.prototype.toString.call(y)) > -1;
        };
      function a(y) {
        if (typeof y != "string" && (y = String(y)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(y) || y === "")
          throw new TypeError('Invalid character in header field name: "' + y + '"');
        return y.toLowerCase();
      }
      function c(y) {
        return typeof y != "string" && (y = String(y)), y;
      }
      function l(y) {
        var E = {
          next: function() {
            var T = y.shift();
            return { done: T === void 0, value: T };
          }
        };
        return r.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function f(y) {
        this.map = {}, y instanceof f ? y.forEach(function(E, T) {
          this.append(T, E);
        }, this) : Array.isArray(y) ? y.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : y && Object.getOwnPropertyNames(y).forEach(function(E) {
          this.append(E, y[E]);
        }, this);
      }
      f.prototype.append = function(y, E) {
        y = a(y), E = c(E);
        var T = this.map[y];
        this.map[y] = T ? T + ", " + E : E;
      }, f.prototype.delete = function(y) {
        delete this.map[a(y)];
      }, f.prototype.get = function(y) {
        return y = a(y), this.has(y) ? this.map[y] : null;
      }, f.prototype.has = function(y) {
        return this.map.hasOwnProperty(a(y));
      }, f.prototype.set = function(y, E) {
        this.map[a(y)] = c(E);
      }, f.prototype.forEach = function(y, E) {
        for (var T in this.map)
          this.map.hasOwnProperty(T) && y.call(E, this.map[T], T, this);
      }, f.prototype.keys = function() {
        var y = [];
        return this.forEach(function(E, T) {
          y.push(T);
        }), l(y);
      }, f.prototype.values = function() {
        var y = [];
        return this.forEach(function(E) {
          y.push(E);
        }), l(y);
      }, f.prototype.entries = function() {
        var y = [];
        return this.forEach(function(E, T) {
          y.push([T, E]);
        }), l(y);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function u(y) {
        if (!y._noBody) {
          if (y.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          y.bodyUsed = !0;
        }
      }
      function g(y) {
        return new Promise(function(E, T) {
          y.onload = function() {
            E(y.result);
          }, y.onerror = function() {
            T(y.error);
          };
        });
      }
      function h(y) {
        var E = new FileReader(), T = g(E);
        return E.readAsArrayBuffer(y), T;
      }
      function b(y) {
        var E = new FileReader(), T = g(E), O = /charset=([A-Za-z0-9_-]+)/.exec(y.type), R = O ? O[1] : "utf-8";
        return E.readAsText(y, R), T;
      }
      function x(y) {
        for (var E = new Uint8Array(y), T = new Array(E.length), O = 0; O < E.length; O++)
          T[O] = String.fromCharCode(E[O]);
        return T.join("");
      }
      function A(y) {
        if (y.slice)
          return y.slice(0);
        var E = new Uint8Array(y.byteLength);
        return E.set(new Uint8Array(y)), E.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(y) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = y, y ? typeof y == "string" ? this._bodyText = y : r.blob && Blob.prototype.isPrototypeOf(y) ? this._bodyBlob = y : r.formData && FormData.prototype.isPrototypeOf(y) ? this._bodyFormData = y : r.searchParams && URLSearchParams.prototype.isPrototypeOf(y) ? this._bodyText = y.toString() : r.arrayBuffer && r.blob && s(y) ? (this._bodyArrayBuffer = A(y.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(y) || o(y)) ? this._bodyArrayBuffer = A(y) : this._bodyText = y = Object.prototype.toString.call(y) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof y == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(y) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var y = u(this);
          if (y)
            return y;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var y = u(this);
            return y || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var y = u(this);
          if (y)
            return y;
          if (this._bodyBlob)
            return b(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(p);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function w(y) {
        var E = y.toUpperCase();
        return _.indexOf(E) > -1 ? E : y;
      }
      function $(y, E) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var T = E.body;
        if (y instanceof $) {
          if (y.bodyUsed)
            throw new TypeError("Already read");
          this.url = y.url, this.credentials = y.credentials, E.headers || (this.headers = new f(y.headers)), this.method = y.method, this.mode = y.mode, this.signal = y.signal, !T && y._bodyInit != null && (T = y._bodyInit, y.bodyUsed = !0);
        } else
          this.url = String(y);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new f(E.headers)), this.method = w(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
          if ("AbortController" in n) {
            var D = new AbortController();
            return D.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && T)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(T), (this.method === "GET" || this.method === "HEAD") && (E.cache === "no-store" || E.cache === "no-cache")) {
          var O = /([?&])_=[^&]*/;
          if (O.test(this.url))
            this.url = this.url.replace(O, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var R = /\?/;
            this.url += (R.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      $.prototype.clone = function() {
        return new $(this, { body: this._bodyInit });
      };
      function p(y) {
        var E = new FormData();
        return y.trim().split("&").forEach(function(T) {
          if (T) {
            var O = T.split("="), R = O.shift().replace(/\+/g, " "), D = O.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(R), decodeURIComponent(D));
          }
        }), E;
      }
      function I(y) {
        var E = new f(), T = y.replace(/\r?\n[\t ]+/g, " ");
        return T.split("\r").map(function(O) {
          return O.indexOf(`
`) === 0 ? O.substr(1, O.length) : O;
        }).forEach(function(O) {
          var R = O.split(":"), D = R.shift().trim();
          if (D) {
            var Gt = R.join(":").trim();
            try {
              E.append(D, Gt);
            } catch (tt) {
              console.warn("Response " + tt.message);
            }
          }
        }), E;
      }
      U.call($.prototype);
      function M(y, E) {
        if (!(this instanceof M))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new f(E.headers), this.url = E.url || "", this._initBody(y);
      }
      U.call(M.prototype), M.prototype.clone = function() {
        return new M(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, M.error = function() {
        var y = new M(null, { status: 200, statusText: "" });
        return y.ok = !1, y.status = 0, y.type = "error", y;
      };
      var B = [301, 302, 303, 307, 308];
      M.redirect = function(y, E) {
        if (B.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new M(null, { status: E, headers: { location: y } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(E, T) {
          this.message = E, this.name = T;
          var O = Error(E);
          this.stack = O.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function N(y, E) {
        return new Promise(function(T, O) {
          var R = new $(y, E);
          if (R.signal && R.signal.aborted)
            return O(new e.DOMException("Aborted", "AbortError"));
          var D = new XMLHttpRequest();
          function Gt() {
            D.abort();
          }
          D.onload = function() {
            var m = {
              statusText: D.statusText,
              headers: I(D.getAllResponseHeaders() || "")
            };
            R.url.indexOf("file://") === 0 && (D.status < 200 || D.status > 599) ? m.status = 200 : m.status = D.status, m.url = "responseURL" in D ? D.responseURL : m.headers.get("X-Request-URL");
            var L = "response" in D ? D.response : D.responseText;
            setTimeout(function() {
              T(new M(L, m));
            }, 0);
          }, D.onerror = function() {
            setTimeout(function() {
              O(new TypeError("Network request failed"));
            }, 0);
          }, D.ontimeout = function() {
            setTimeout(function() {
              O(new TypeError("Network request timed out"));
            }, 0);
          }, D.onabort = function() {
            setTimeout(function() {
              O(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function tt(m) {
            try {
              return m === "" && n.location.href ? n.location.href : m;
            } catch {
              return m;
            }
          }
          if (D.open(R.method, tt(R.url), !0), R.credentials === "include" ? D.withCredentials = !0 : R.credentials === "omit" && (D.withCredentials = !1), "responseType" in D && (r.blob ? D.responseType = "blob" : r.arrayBuffer && (D.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof f || n.Headers && E.headers instanceof n.Headers)) {
            var ht = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(m) {
              ht.push(a(m)), D.setRequestHeader(m, c(E.headers[m]));
            }), R.headers.forEach(function(m, L) {
              ht.indexOf(L) === -1 && D.setRequestHeader(L, m);
            });
          } else
            R.headers.forEach(function(m, L) {
              D.setRequestHeader(L, m);
            });
          R.signal && (R.signal.addEventListener("abort", Gt), D.onreadystatechange = function() {
            D.readyState === 4 && R.signal.removeEventListener("abort", Gt);
          }), D.send(typeof R._bodyInit > "u" ? null : R._bodyInit);
        });
      }
      return N.polyfill = !0, n.fetch || (n.fetch = N, n.Headers = f, n.Request = $, n.Response = M), e.Headers = f, e.Request = $, e.Response = M, e.fetch = N, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : zt);
})();
const Gg = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Kg(t, e) {
  const n = {};
  return Object.assign(n, Gg, e), await fetch(t, n);
}
function Vg(t) {
  let e = Kg, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function qg(...t) {
  const { fetchLib: e, middlewares: n } = Vg(t);
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
var Ur;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ur || (Ur = {}));
var Vn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vn || (Vn = {}));
var Wu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Wu || (Wu = {}));
const Wg = "https://api.mainnet.hiro.so", Yg = "https://api.testnet.hiro.so", Xg = "http://localhost:3999", Zg = ["mainnet", "testnet", "devnet", "mocknet"];
let Hr = class {
  constructor(e) {
    this.version = Vn.Mainnet, this.chainId = Ur.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Vn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? qg();
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
Hr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new uh();
    case "testnet":
      return new Qg();
    case "devnet":
      return new Jg();
    case "mocknet":
      return new lh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Zg.join(", ")}`);
  }
};
Hr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Hr.fromName(t);
let uh = class extends Hr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Wg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vn.Mainnet, this.chainId = Ur.Mainnet;
  }
}, Qg = class extends Hr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Yg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vn.Testnet, this.chainId = Ur.Testnet;
  }
}, lh = class extends Hr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Xg,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vn.Testnet, this.chainId = Ur.Testnet;
  }
};
const Jg = lh, fh = "xtrata.wallet.bridge.v1", t1 = (t) => typeof t == "object" && t !== null && t.protocol === fh, e1 = (t) => t1(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", n1 = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class os extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Yu = 12e4;
class r1 {
  constructor(e) {
    is(this, "pending", /* @__PURE__ */ new Map());
    is(this, "listenTarget");
    is(this, "closed", !1);
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
    is(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !e1(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new os("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new os("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new os("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = n1(), i = { protocol: fh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new os(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Yu}ms.`
          )
        );
      }, this.options.timeoutMs ?? Yu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new os("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const s1 = ["SP", "SM"], i1 = ["ST", "SN"], o1 = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return s1.includes(n) ? "mainnet" : i1.includes(n) ? "testnet" : null;
}, a1 = () => {
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
}, c1 = () => typeof window > "u" || !window.localStorage ? a1() : window.localStorage, zo = "xtrata.v15.1.wallet.session", Xu = "mainnet", Ci = { isConnected: !1 }, u1 = (t) => t.address ? o1(t.address) ?? t.network : t.network, hh = (t) => !t.isConnected || !t.address ? { ...Ci } : u1(t) !== Xu ? { ...Ci } : {
  isConnected: !0,
  address: t.address,
  network: Xu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, l1 = (t) => {
  if (!t)
    return { ...Ci };
  try {
    const e = JSON.parse(t);
    return hh(e);
  } catch {
    return { ...Ci };
  }
}, f1 = (t) => {
  const e = hh(t);
  return JSON.stringify(e);
}, h1 = (t) => {
  const e = c1();
  return {
    load: () => l1(e.getItem(zo)),
    save: (n) => {
      e.setItem(zo, f1(n));
    },
    clear: () => {
      e.removeItem(zo);
    }
  };
}, d1 = "https://browser.blockstack.org/auth", p1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, dh = ["store_write"], g1 = "blockstack-session", y1 = {
  logLevel: "debug"
}, cr = {
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
Object.freeze(cr);
class Yr extends Error {
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
class w1 extends Yr {
  constructor(e, n = "") {
    super({ code: cr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Zu extends Yr {
  constructor(e = "") {
    super({ code: cr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Vs extends Yr {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: cr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Qu extends Yr {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: cr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class pa extends Yr {
  constructor(e) {
    super({ code: cr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class ph extends Yr {
  constructor(e) {
    super({ code: cr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Ju = ["debug", "info", "warn", "error", "none"], ga = {};
for (let t = 0; t < Ju.length; t++) {
  const e = Ju[t];
  ga[e] = t;
}
class vr {
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
    return ga[y1.logLevel] <= ga[e];
  }
}
function b1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function x1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ro(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function m1() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function S1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function E1(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function mc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = S1(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    vr.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = E1(s, t.toString(), n);
    throw vr.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Cn(t, e) {
  return Sc(kt(t), e);
}
function kt(t) {
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
  if (Yt(t, Uint8Array))
    return BigInt(`0x${G(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function A1(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function tl(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Us(t, e = 8) {
  return (typeof t == "bigint" ? t : kt(t)).toString(16).padStart(e * 2, "0");
}
function no(t) {
  return parseInt(t, 16);
}
function Sc(t, e = 16) {
  const n = Us(t, e);
  return ct(n);
}
function $1(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function I1(t, e) {
  return t & BigInt(1) << e;
}
function ya(t) {
  return v1(BigInt(`0x${G(t)}`), BigInt(t.byteLength * 8));
}
function v1(t, e) {
  return I1(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const L1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function G(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += L1[n];
  return e;
}
function ct(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = A1(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function ur(t) {
  return new TextEncoder().encode(t);
}
function Hs(t) {
  return new TextDecoder().decode(t);
}
function C1(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function B1(t) {
  return String.fromCharCode.apply(null, t);
}
function M1(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function el(t) {
  if (t.some(M1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Me(...t) {
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
function vt(t) {
  return Me(...t.map((e) => typeof e == "number" ? el([e]) : e instanceof Array ? el(e) : e));
}
function Yt(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const gh = "https://api.mainnet.hiro.so", yh = "https://api.testnet.hiro.so", wh = "http://localhost:3999", U1 = "https://hub.blockstack.org", H1 = 33, Go = 32;
function _1(t) {
  if (t.length < Go * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Go * 2), r = t.slice(2 + Go * 2);
  return {
    recoveryId: no(e),
    r: n,
    s: r
  };
}
function Ec(t) {
  const e = typeof t == "string" ? ct(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function T1(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function N1(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function k1(t, e) {
  return t[e];
}
function P1(t, e, n = 0) {
  return t[n] = e, t;
}
function D1(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function qn(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const O1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function j1(t, e) {
  const n = {};
  return Object.assign(n, O1, e), await fetch(t, n);
}
function F1(t) {
  let e = j1, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function z1(...t) {
  const { fetchLib: e, middlewares: n } = F1(t);
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
class bh {
  constructor(e = dh.slice(), n = ((a) => (a = mc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = d1) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function wa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function R1(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function xh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function G1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wa(t.outputLen), wa(t.blockLen);
}
function K1(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function V1(t, e) {
  xh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Pn = {
  number: wa,
  bool: R1,
  bytes: xh,
  hash: G1,
  exists: K1,
  output: V1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ko = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), me = (t, e) => t << 32 - e | t >>> e, q1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!q1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W1(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ac(t) {
  if (typeof t == "string" && (t = W1(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let mh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function lr(t) {
  const e = (r) => t().update(Ac(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Sh = class extends mh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Pn.hash(e);
    const r = Ac(n);
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
    return Pn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Pn.exists(this), Pn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ro = (t, e, n) => new Sh(t, e).update(n).digest();
ro.create = (t, e) => new Sh(t, e);
function Y1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let $c = class extends mh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ko(this.buffer);
  }
  update(e) {
    Pn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ac(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ko(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Pn.exists(this), Pn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Y1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ko(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const X1 = (t, e, n) => t & e ^ ~t & n, Z1 = (t, e, n) => t & e ^ t & n ^ e & n, Q1 = new Uint32Array([
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
]), We = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ye = new Uint32Array(64);
let Eh = class extends $c {
  constructor() {
    super(64, 32, 8, !1), this.A = We[0] | 0, this.B = We[1] | 0, this.C = We[2] | 0, this.D = We[3] | 0, this.E = We[4] | 0, this.F = We[5] | 0, this.G = We[6] | 0, this.H = We[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      Ye[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = Ye[u - 15], h = Ye[u - 2], b = me(g, 7) ^ me(g, 18) ^ g >>> 3, x = me(h, 17) ^ me(h, 19) ^ h >>> 10;
      Ye[u] = x + Ye[u - 7] + b + Ye[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = me(a, 6) ^ me(a, 11) ^ me(a, 25), h = f + g + X1(a, c, l) + Q1[u] + Ye[u] | 0, x = (me(r, 2) ^ me(r, 13) ^ me(r, 22)) + Z1(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ye.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, J1 = class extends Eh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const _r = lr(() => new Eh());
lr(() => new J1());
const ty = {}, Ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ty
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const it = BigInt(0), bt = BigInt(1), $n = BigInt(2), fs = BigInt(3), nl = BigInt(8), dt = Object.freeze({
  a: it,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: bt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), rl = (t, e) => (t + e / $n) / e, qs = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = dt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -bt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = rl(i * t, e), c = rl(-r * t, e);
    let l = k(t - a * n - c * s, e), f = k(-a * r - c * i, e);
    const u = l > o, g = f > o;
    if (u && (l = e - l), g && (f = e - f), l > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: g, k2: f };
  }
}, ye = 32, Wn = 32, $h = 32, Bi = ye + 1, Mi = 2 * ye + 1;
function sl(t) {
  const { a: e, b: n } = dt, r = k(t * t), s = k(r * t);
  return k(s + e * t + n);
}
const Ws = dt.a === it;
class Ic extends Error {
  constructor(e) {
    super(e);
  }
}
function il(t) {
  if (!(t instanceof lt))
    throw new TypeError("JacobianPoint expected");
}
class lt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof J))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(J.ZERO) ? lt.ZERO : new lt(e.x, e.y, bt);
  }
  static toAffineBatch(e) {
    const n = iy(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return lt.toAffineBatch(e).map(lt.fromAffine);
  }
  equals(e) {
    il(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = k(s * s), l = k(a * a), f = k(n * l), u = k(i * c), g = k(k(r * a) * l), h = k(k(o * s) * c);
    return f === u && g === h;
  }
  negate() {
    return new lt(this.x, k(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = k(e * e), i = k(n * n), o = k(i * i), a = e + i, c = k($n * (k(a * a) - s - o)), l = k(fs * s), f = k(l * l), u = k(f - $n * c), g = k(l * (c - u) - nl * o), h = k($n * n * r);
    return new lt(u, g, h);
  }
  add(e) {
    il(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === it || o === it)
      return this;
    if (n === it || r === it)
      return e;
    const c = k(s * s), l = k(a * a), f = k(n * l), u = k(i * c), g = k(k(r * a) * l), h = k(k(o * s) * c), b = k(u - f), x = k(h - g);
    if (b === it)
      return x === it ? this.double() : lt.ZERO;
    const A = k(b * b), U = k(b * A), _ = k(f * A), w = k(x * x - U - $n * _), $ = k(x * (_ - w) - g * U), p = k(s * a * b);
    return new lt(w, $, p);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = lt.ZERO;
    if (typeof e == "bigint" && e === it)
      return n;
    let r = cl(e);
    if (r === bt)
      return this;
    if (!Ws) {
      let u = n, g = this;
      for (; r > it; )
        r & bt && (u = u.add(g)), g = g.double(), r >>= bt;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = qs.splitScalar(r), c = n, l = n, f = this;
    for (; i > it || a > it; )
      i & bt && (c = c.add(f)), a & bt && (l = l.add(f)), f = f.double(), i >>= bt, a >>= bt;
    return s && (c = c.negate()), o && (l = l.negate()), l = new lt(k(l.x * qs.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = Ws ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(lt.BASE) && (n = J.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && ba.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = lt.normalizeZ(s), ba.set(n, s)));
    let i = lt.ZERO, o = lt.BASE;
    const a = 1 + (Ws ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), f = 2 ** r, u = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let b = Number(e & l);
      e >>= u, b > c && (b -= f, e += bt);
      const x = h, A = h + Math.abs(b) - 1, U = g % 2 !== 0, _ = b < 0;
      b === 0 ? o = o.add(Ys(U, s[x])) : i = i.add(Ys(_, s[A]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = cl(e), s, i;
    if (Ws) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = qs.splitScalar(r);
      let { p: f, f: u } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(l, n);
      f = Ys(o, f), g = Ys(c, g), g = new lt(k(g.x * qs.beta), g.y, g.z), s = f.add(g), i = u.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return lt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(lt.ZERO);
    e == null && (e = i ? nl : Xr(s));
    const o = e, a = k(o * o), c = k(a * o), l = k(n * a), f = k(r * c), u = k(s * o);
    if (i)
      return J.ZERO;
    if (u !== bt)
      throw new Error("invZ was invalid");
    return new J(l, f);
  }
}
lt.BASE = new lt(dt.Gx, dt.Gy, bt);
lt.ZERO = new lt(it, bt, it);
function Ys(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const ba = /* @__PURE__ */ new WeakMap();
class J {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ba.delete(this);
  }
  hasEvenY() {
    return this.y % $n === it;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = re(n ? e : e.subarray(1));
    if (!xi(r))
      throw new Error("Point is not on curve");
    const s = sl(r);
    let i = sy(s);
    const o = (i & bt) === bt;
    n ? o && (i = k(-i)) : (e[0] & 1) === 1 !== o && (i = k(-i));
    const a = new J(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = re(e.subarray(1, ye + 1)), r = re(e.subarray(ye + 1, ye * 2 + 1)), s = new J(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ue(e), r = n.length, s = n[0];
    if (r === ye)
      return this.fromCompressedHex(n);
    if (r === Bi && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Mi && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Bi} compressed bytes or ${Mi} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return J.BASE.multiply(Yn(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Lh(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = vc(Ue(e)), { n: a } = dt, c = r === 2 || r === 3 ? s + a : s, l = Xr(c, a), f = k(-o * l, a), u = k(i * l, a), g = r & 1 ? "03" : "02", h = J.fromHex(g + In(c)), b = J.BASE.multiplyAndAddUnsafe(h, f, u);
    if (!b)
      throw new Error("Cannot recover signature: point at infinify");
    return b.assertValidity(), b;
  }
  toRawBytes(e = !1) {
    return vn(this.toHex(e));
  }
  toHex(e = !1) {
    const n = In(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${In(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!xi(n) || !xi(r))
      throw new Error(e);
    const s = k(r * r), i = sl(n);
    if (k(s - i) !== it)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new J(this.x, k(-this.y));
  }
  double() {
    return lt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return lt.fromAffine(this).add(lt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return lt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = lt.fromAffine(this), i = n === it || n === bt || this !== J.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = lt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(lt.ZERO) ? void 0 : a.toAffine();
  }
}
J.BASE = new J(dt.Gx, dt.Gy);
J.ZERO = new J(it, it);
function ol(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function al(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Tr(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: re(n), left: t.subarray(e + 2) };
}
function ey(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Tr(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = al(t.subarray(2)), { data: r, left: s } = al(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Tr(s)}`);
  return { r: e, s: r };
}
class ne {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Tr(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ne(Ui(s.slice(0, 64)), Ui(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = ey(n ? e : vn(e));
    return new ne(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!kr(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!kr(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = dt.n >> bt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ne(this.r, k(-this.s, dt.n)) : this;
  }
  toDERRawBytes() {
    return vn(this.toDERHex());
  }
  toDERHex() {
    const e = ol(as(this.s)), n = ol(as(this.r)), r = e.length / 2, s = n.length / 2, i = as(r), o = as(s);
    return `30${as(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return vn(this.toCompactHex());
  }
  toCompactHex() {
    return In(this.r) + In(this.s);
  }
}
function Sn(...t) {
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
const ny = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Tr(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ny[t[n]];
  return e;
}
const ry = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function In(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(it <= t && t < ry))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Nr(t) {
  const e = vn(In(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function as(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ui(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function vn(t) {
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
function re(t) {
  return Ui(Tr(t));
}
function Ue(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : vn(t);
}
function cl(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && kr(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function k(t, e = dt.P) {
  const n = t % e;
  return n >= it ? n : e + n;
}
function ie(t, e) {
  const { P: n } = dt;
  let r = t;
  for (; e-- > it; )
    r *= r, r %= n;
  return r;
}
function sy(t) {
  const { P: e } = dt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, f = ie(l, fs) * l % e, u = ie(f, fs) * l % e, g = ie(u, $n) * c % e, h = ie(g, r) * g % e, b = ie(h, s) * h % e, x = ie(b, o) * b % e, A = ie(x, a) * x % e, U = ie(A, o) * b % e, _ = ie(U, fs) * l % e, w = ie(_, i) * h % e, $ = ie(w, n) * c % e, p = ie($, $n);
  if (p * p % e !== t)
    throw new Error("Cannot find square root");
  return p;
}
function Xr(t, e = dt.P) {
  if (t === it || e <= it)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = k(t, e), r = e, s = it, i = bt;
  for (; n !== it; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== bt)
    throw new Error("invert: does not exist");
  return k(s, e);
}
function iy(t, e = dt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === it ? i : (n[a] = i, k(i * o, e)), bt), s = Xr(r, e);
  return t.reduceRight((i, o, a) => o === it ? i : (n[a] = k(i * n[a], e), k(i * o, e)), s), n;
}
function oy(t) {
  const e = t.length * 8 - Wn * 8, n = re(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function vc(t, e = !1) {
  const n = oy(t);
  if (e)
    return n;
  const { n: r } = dt;
  return n >= r ? n - r : n;
}
let Mr, hs;
class Ih {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return $t.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return hs(this.k, ...e);
  }
  checkSync() {
    if (typeof hs != "function")
      throw new Ic("hmacSha256Sync needs to be set");
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
    return Sn(...n);
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
    return Sn(...n);
  }
}
function kr(t) {
  return it < t && t < dt.n;
}
function xi(t) {
  return it < t && t < dt.P;
}
function vh(t, e, n, r = !0) {
  const { n: s } = dt, i = vc(t, !0);
  if (!kr(i))
    return;
  const o = Xr(i, s), a = J.BASE.multiply(i), c = k(a.x, s);
  if (c === it)
    return;
  const l = k(o * k(e + n * c, s), s);
  if (l === it)
    return;
  let f = new ne(c, l), u = (a.x === f.r ? 0 : 2) | Number(a.y & bt);
  return r && f.hasHighS() && (f = f.normalizeS(), u ^= 1), { sig: f, recovery: u };
}
function Yn(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Wn)
      throw new Error("Expected 32 bytes of private key");
    e = Ui(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Wn)
      throw new Error("Expected 32 bytes of private key");
    e = re(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!kr(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Lc(t) {
  return t instanceof J ? (t.assertValidity(), t) : J.fromHex(t);
}
function Lh(t) {
  if (t instanceof ne)
    return t.assertValidity(), t;
  try {
    return ne.fromDER(t);
  } catch {
    return ne.fromCompact(t);
  }
}
function _s(t, e = !1) {
  return J.fromPrivateKey(t).toRawBytes(e);
}
function ay(t, e, n, r = !1) {
  return J.fromSignature(t, e, n).toRawBytes(r);
}
function ul(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Bi || r === Mi : n ? r === Bi * 2 || r === Mi * 2 : t instanceof J;
}
function Cc(t, e, n = !1) {
  if (ul(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!ul(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Lc(e);
  return r.assertValidity(), r.multiply(Yn(t)).toRawBytes(n);
}
function Ch(t) {
  const e = t.length > ye ? t.slice(0, ye) : t;
  return re(e);
}
function cy(t) {
  const e = Ch(t), n = k(e, dt.n);
  return Bh(n < it ? e : n);
}
function Bh(t) {
  return Nr(t);
}
function Mh(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ue(t), s = Yn(e), i = [Bh(s), cy(r)];
  if (n != null) {
    n === !0 && (n = $t.randomBytes(ye));
    const c = Ue(n);
    if (c.length !== ye)
      throw new Error(`sign: Expected ${ye} bytes of extra data`);
    i.push(c);
  }
  const o = Sn(...i), a = Ch(r);
  return { seed: o, m: a, d: s };
}
function Uh(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function uy(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Mh(t, e, n.extraEntropy), o = new Ih($h, Wn);
  await o.reseed(r);
  let a;
  for (; !(a = vh(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Uh(a, n);
}
function so(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Mh(t, e, n.extraEntropy), o = new Ih($h, Wn);
  o.reseedSync(r);
  let a;
  for (; !(a = vh(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Uh(a, n);
}
const ly = { strict: !0 };
function fy(t, e, n, r = ly) {
  let s;
  try {
    s = Lh(t), e = Ue(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = vc(e);
  let c;
  try {
    c = Lc(n);
  } catch {
    return !1;
  }
  const { n: l } = dt, f = Xr(o, l), u = k(a * f, l), g = k(i * f, l), h = J.BASE.multiplyAndAddUnsafe(c, u, g);
  return h ? k(h.x, l) === i : !1;
}
function Hi(t) {
  return k(re(t), dt.n);
}
class Pr {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ue(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = re(n.subarray(0, 32)), s = re(n.subarray(32, 64));
    return new Pr(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!xi(e) || !kr(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return In(this.r) + In(this.s);
  }
  toRawBytes() {
    return vn(this.toHex());
  }
}
function hy(t) {
  return J.fromPrivateKey(t).toRawX();
}
class Hh {
  constructor(e, n, r = $t.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ue(e);
    const { x: s, scalar: i } = this.getScalar(Yn(n));
    if (this.px = s, this.d = i, this.rand = Ue(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = J.fromPrivateKey(e), r = n.hasEvenY() ? e : dt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Nr(e ^ re(n));
  }
  finalizeNonce(e) {
    const n = k(re(e), dt.n);
    if (n === it)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Pr(e.x, k(n + r * s, dt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = $t.taggedHash, o = this.initNonce(n, await i(xn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(xn.nonce, o, r, e)), f = Hi(await i(xn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return await Nh(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = $t.taggedHashSync, o = this.initNonce(n, i(xn.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(xn.nonce, o, r, e)), f = Hi(i(xn.challenge, c, r, e)), u = this.finalizeSig(a, l, f, n);
    return kh(u, e, r) || this.error(), u;
  }
}
async function dy(t, e, n) {
  return new Hh(t, e, n).calc();
}
function py(t, e, n) {
  return new Hh(t, e, n).calcSync();
}
function _h(t, e, n) {
  const r = t instanceof Pr, s = r ? t : Pr.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ue(e),
    P: Lc(n)
  };
}
function Th(t, e, n, r) {
  const s = J.BASE.multiplyAndAddUnsafe(e, Yn(n), k(-r, dt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Nh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _h(t, e, n), a = Hi(await $t.taggedHash(xn.challenge, Nr(r), o.toRawX(), i));
    return Th(r, o, s, a);
  } catch {
    return !1;
  }
}
function kh(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _h(t, e, n), a = Hi($t.taggedHashSync(xn.challenge, Nr(r), o.toRawX(), i));
    return Th(r, o, s, a);
  } catch (r) {
    if (r instanceof Ic)
      throw r;
    return !1;
  }
}
const gy = {
  Signature: Pr,
  getPublicKey: hy,
  sign: dy,
  verify: Nh,
  signSync: py,
  verifySync: kh
};
J.BASE._setWindowSize(8);
const Zt = {
  node: Ah,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, xn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Xs = {}, $t = {
  bytesToHex: Tr,
  hexToBytes: vn,
  concatBytes: Sn,
  mod: k,
  invert: Xr,
  isValidPrivateKey(t) {
    try {
      return Yn(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Nr,
  _normalizePrivateKey: Yn,
  hashToPrivateKey: (t) => {
    t = Ue(t);
    const e = Wn + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = k(re(t), dt.n - bt) + bt;
    return Nr(n);
  },
  randomBytes: (t = 32) => {
    if (Zt.web)
      return Zt.web.getRandomValues(new Uint8Array(t));
    if (Zt.node) {
      const { randomBytes: e } = Zt.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => $t.hashToPrivateKey($t.randomBytes(Wn + 8)),
  precompute(t = 8, e = J.BASE) {
    const n = e === J.BASE ? e : new J(e.x, e.y);
    return n._setWindowSize(t), n.multiply(fs), n;
  },
  sha256: async (...t) => {
    if (Zt.web) {
      const e = await Zt.web.subtle.digest("SHA-256", Sn(...t));
      return new Uint8Array(e);
    } else if (Zt.node) {
      const { createHash: e } = Zt.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Zt.web) {
      const n = await Zt.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Sn(...e), s = await Zt.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Zt.node) {
      const { createHmac: n } = Zt.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Xs[t];
    if (n === void 0) {
      const r = await $t.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Sn(r, r), Xs[t] = n;
    }
    return $t.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Mr != "function")
      throw new Ic("sha256Sync is undefined, you need to set it");
    let n = Xs[t];
    if (n === void 0) {
      const r = Mr(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Sn(r, r), Xs[t] = n;
    }
    return Mr(n, ...e);
  },
  _JacobianPoint: lt
};
Object.defineProperties($t, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Mr;
    },
    set(t) {
      Mr || (Mr = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return hs;
    },
    set(t) {
      hs || (hs = t);
    }
  }
});
const yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: dt,
  Point: J,
  Signature: ne,
  getPublicKey: _s,
  getSharedSecret: Cc,
  recoverPublicKey: ay,
  schnorr: gy,
  sign: uy,
  signSync: so,
  utils: $t,
  verify: fy
}, Symbol.toStringTag, { value: "Module" }));
var Ts = {};
Ts.byteLength = Sy;
var wy = Ts.toByteArray = Ay, by = Ts.fromByteArray = vy, Ie = [], oe = [], xy = typeof Uint8Array < "u" ? Uint8Array : Array, Vo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ar = 0, my = Vo.length; Ar < my; ++Ar)
  Ie[Ar] = Vo[Ar], oe[Vo.charCodeAt(Ar)] = Ar;
oe[45] = 62;
oe[95] = 63;
function Ph(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Sy(t) {
  var e = Ph(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ey(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ay(t) {
  var e, n = Ph(t), r = n[0], s = n[1], i = new xy(Ey(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = oe[t.charCodeAt(c)] << 18 | oe[t.charCodeAt(c + 1)] << 12 | oe[t.charCodeAt(c + 2)] << 6 | oe[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = oe[t.charCodeAt(c)] << 2 | oe[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = oe[t.charCodeAt(c)] << 10 | oe[t.charCodeAt(c + 1)] << 4 | oe[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function $y(t) {
  return Ie[t >> 18 & 63] + Ie[t >> 12 & 63] + Ie[t >> 6 & 63] + Ie[t & 63];
}
function Iy(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push($y(r));
  return s.join("");
}
function vy(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Iy(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Ie[e >> 2] + Ie[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Ie[e >> 10] + Ie[e >> 4 & 63] + Ie[e << 2 & 63] + "="
  )), s.join("");
}
function Ly() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Cy = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function By() {
  if (Ly())
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
    throw new Error(Cy);
  }
}
class My {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Me(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Me(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Uy {
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
async function Dh() {
  const t = await By();
  return t.name === "subtleCrypto" ? new Uy(t.lib) : new My(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Hy(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), l = Math.log(256) / Math.log(o);
  function f(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var b = 0, x = 0, A = 0, U = h.length; A !== U && h[A] === 0; )
      A++, b++;
    for (var _ = (U - A) * l + 1 >>> 0, w = new Uint8Array(_); A !== U; ) {
      for (var $ = h[A], p = 0, I = _ - 1; ($ !== 0 || p < x) && I !== -1; I--, p++)
        $ += 256 * w[I] >>> 0, w[I] = $ % o >>> 0, $ = $ / o >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      x = p, A++;
    }
    for (var M = _ - x; M !== _ && w[M] === 0; )
      M++;
    for (var B = a.repeat(b); M < _; ++M)
      B += t.charAt(w[M]);
    return B;
  }
  function u(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var b = 0, x = 0, A = 0; h[b] === a; )
      x++, b++;
    for (var U = (h.length - b) * c + 1 >>> 0, _ = new Uint8Array(U); h[b]; ) {
      var w = h.charCodeAt(b);
      if (w > 255)
        return;
      var $ = e[w];
      if ($ === 255)
        return;
      for (var p = 0, I = U - 1; ($ !== 0 || p < A) && I !== -1; I--, p++)
        $ += o * _[I] >>> 0, _[I] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      A = p, b++;
    }
    for (var M = U - A; M !== U && _[M] === 0; )
      M++;
    for (var B = new Uint8Array(x + (U - M)), N = x; M !== U; )
      B[N++] = _[M++];
    return B;
  }
  function g(h) {
    var b = u(h);
    if (b)
      return b;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: u,
    decode: g
  };
}
var Oh = Hy;
const _y = Oh, Ty = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Ny = _y(Ty);
const ky = /* @__PURE__ */ ch(Ny), Py = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jh = Uint8Array.from({ length: 16 }, (t, e) => e), Dy = jh.map((t) => (9 * t + 5) % 16);
let Bc = [jh], Mc = [Dy];
for (let t = 0; t < 4; t++)
  for (let e of [Bc, Mc])
    e.push(e[t].map((n) => Py[n]));
const Fh = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Oy = Bc.map((t, e) => t.map((n) => Fh[e][n])), jy = Mc.map((t, e) => t.map((n) => Fh[e][n])), Fy = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zy = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zs = (t, e) => t << e | t >>> 32 - e;
function ll(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qs = new Uint32Array(16);
let Ry = class extends $c {
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
      Qs[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = Fy[h], A = zy[h], U = Bc[h], _ = Mc[h], w = Oy[h], $ = jy[h];
      for (let p = 0; p < 16; p++) {
        const I = Zs(r + ll(h, i, a, l) + Qs[U[p]] + x, w[p]) + u | 0;
        r = u, u = l, l = Zs(a, 10) | 0, a = i, i = I;
      }
      for (let p = 0; p < 16; p++) {
        const I = Zs(s + ll(b, o, c, f) + Qs[_[p]] + A, $[p]) + g | 0;
        s = g, g = f, f = Zs(c, 10) | 0, c = o, o = I;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qs.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Gy = lr(() => new Ry());
function Ky(t) {
  return Gy(t);
}
const Js = BigInt(2 ** 32 - 1), xa = BigInt(32);
function zh(t, e = !1) {
  return e ? { h: Number(t & Js), l: Number(t >> xa & Js) } : { h: Number(t >> xa & Js) | 0, l: Number(t & Js) | 0 };
}
function Vy(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = zh(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const qy = (t, e) => BigInt(t >>> 0) << xa | BigInt(e >>> 0), Wy = (t, e, n) => t >>> n, Yy = (t, e, n) => t << 32 - n | e >>> n, Xy = (t, e, n) => t >>> n | e << 32 - n, Zy = (t, e, n) => t << 32 - n | e >>> n, Qy = (t, e, n) => t << 64 - n | e >>> n - 32, Jy = (t, e, n) => t >>> n - 32 | e << 64 - n, tw = (t, e) => e, ew = (t, e) => t, nw = (t, e, n) => t << n | e >>> 32 - n, rw = (t, e, n) => e << n | t >>> 32 - n, sw = (t, e, n) => e << n - 32 | t >>> 64 - n, iw = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ow(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const aw = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), cw = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uw = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lw = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, fw = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), hw = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, q = {
  fromBig: zh,
  split: Vy,
  toBig: qy,
  shrSH: Wy,
  shrSL: Yy,
  rotrSH: Xy,
  rotrSL: Zy,
  rotrBH: Qy,
  rotrBL: Jy,
  rotr32H: tw,
  rotr32L: ew,
  rotlSH: nw,
  rotlSL: rw,
  rotlBH: sw,
  rotlBL: iw,
  add: ow,
  add3L: aw,
  add3H: cw,
  add4L: uw,
  add4H: lw,
  add5H: hw,
  add5L: fw
}, [dw, pw] = q.split([
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
].map((t) => BigInt(t))), Xe = new Uint32Array(80), Ze = new Uint32Array(80);
let io = class extends $c {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: b, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Xe[w] = e.getUint32(n), Ze[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const $ = Xe[w - 15] | 0, p = Ze[w - 15] | 0, I = q.rotrSH($, p, 1) ^ q.rotrSH($, p, 8) ^ q.shrSH($, p, 7), M = q.rotrSL($, p, 1) ^ q.rotrSL($, p, 8) ^ q.shrSL($, p, 7), B = Xe[w - 2] | 0, N = Ze[w - 2] | 0, y = q.rotrSH(B, N, 19) ^ q.rotrBH(B, N, 61) ^ q.shrSH(B, N, 6), E = q.rotrSL(B, N, 19) ^ q.rotrBL(B, N, 61) ^ q.shrSL(B, N, 6), T = q.add4L(M, E, Ze[w - 7], Ze[w - 16]), O = q.add4H(T, I, y, Xe[w - 7], Xe[w - 16]);
      Xe[w] = O | 0, Ze[w] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: b, Gh: x, Gl: A, Hh: U, Hl: _ } = this;
    for (let w = 0; w < 80; w++) {
      const $ = q.rotrSH(u, g, 14) ^ q.rotrSH(u, g, 18) ^ q.rotrBH(u, g, 41), p = q.rotrSL(u, g, 14) ^ q.rotrSL(u, g, 18) ^ q.rotrBL(u, g, 41), I = u & h ^ ~u & x, M = g & b ^ ~g & A, B = q.add5L(_, p, M, pw[w], Ze[w]), N = q.add5H(B, U, $, I, dw[w], Xe[w]), y = B | 0, E = q.rotrSH(r, s, 28) ^ q.rotrBH(r, s, 34) ^ q.rotrBH(r, s, 39), T = q.rotrSL(r, s, 28) ^ q.rotrBL(r, s, 34) ^ q.rotrBL(r, s, 39), O = r & i ^ r & a ^ i & a, R = s & o ^ s & c ^ o & c;
      U = x | 0, _ = A | 0, x = h | 0, A = b | 0, h = u | 0, b = g | 0, { h: u, l: g } = q.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const D = q.add3L(y, T, R);
      r = q.add3H(D, N, E, O), s = D | 0;
    }
    ({ h: r, l: s } = q.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = q.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = q.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = q.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = q.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: b } = q.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: A } = q.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: U, l: _ } = q.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, b, x, A, U, _);
  }
  roundClean() {
    Xe.fill(0), Ze.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, gw = class extends io {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yw = class extends io {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ww = class extends io {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const bw = lr(() => new io());
lr(() => new gw());
lr(() => new yw());
lr(() => new ww());
function Rh(t) {
  return _r(t);
}
function xw(t) {
  return bw(t);
}
const mw = 0;
$t.hmacSha256Sync = (t, ...e) => {
  const n = ro.create(_r, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Sw() {
  return G($t.randomPrivateKey());
}
function Ew(t) {
  const e = _r(_r(t));
  return ky.encode(Me(t, e).slice(0, t.length + 4));
}
function Aw(t, e) {
  return Ew(Me(new Uint8Array([t]), e.slice(0, 20)));
}
function Gh(t, e = mw) {
  const n = typeof t == "string" ? ct(t) : t, r = Ky(Rh(n));
  return Aw(e, r);
}
function Kh(t) {
  const e = Ec(t);
  return G(_s(e.slice(0, 32), !0));
}
$t.hmacSha256Sync = (t, ...e) => {
  const n = ro.create(_r, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var _i;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(_i || (_i = {}));
async function $w(t, e, n) {
  return await (await Dh()).encrypt("aes-256-cbc", e, t, n);
}
async function Iw(t, e, n) {
  return await (await Dh()).decrypt("aes-256-cbc", e, t, n);
}
function Vh(t, e) {
  return ro(_r, t, e);
}
function vw(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function qh(t) {
  const e = xw(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Lw(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Cw(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: _i.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: _i.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Lw(t))
    return e;
  try {
    return J.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Bw(t, e, n, r) {
  const s = Cw(t);
  if (!s.result)
    throw s;
  const i = $t.randomPrivateKey(), o = _s(i, !0);
  let a = Cc(i, t, !0);
  a = a.slice(1);
  const c = qh(a), l = $t.randomBytes(16), f = await $w(l, c.encryptionKey, e), u = Me(l, o, f), g = Vh(c.hmacKey, u);
  let h;
  if (!r || r === "hex")
    h = G(f);
  else if (r === "base64")
    h = by(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const b = {
    iv: G(l),
    ephemeralPK: G(o),
    cipherText: h,
    mac: G(g),
    wasString: n
  };
  return r && r !== "hex" && (b.cipherTextEncoding = r), b;
}
async function Wh(t, e) {
  if (!e.ephemeralPK)
    throw new Qu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Cc(t, n, !0);
  r = r.slice(1);
  const s = qh(r), i = ct(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = ct(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = wy(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Me(i, ct(n), o), c = Vh(s.hmacKey, a), l = ct(e.mac);
  if (!vw(l, c))
    throw new Qu("Decryption failed: failure in MAC check");
  const f = await Iw(i, s.encryptionKey, o);
  return e.wasString ? Hs(f) : f;
}
function Mw(t, e) {
  const n = typeof e == "string" ? ur(e) : e, r = Kh(t), s = Rh(n), i = so(s, t);
  return {
    signature: G(i),
    publicKey: r
  };
}
async function Uw(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Kh(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? ur(t) : t, o = await Bw(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Mw(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function Hw(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Wh(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var _t = {}, Dr = {}, jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.decode = jt.encode = jt.unescape = jt.escape = jt.pad = void 0;
const Yh = Ts;
function Uc(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
jt.pad = Uc;
function Xh(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
jt.escape = Xh;
function Zh(t) {
  return Uc(t).replace(/-/g, "+").replace(/_/g, "/");
}
jt.unescape = Zh;
function _w(t) {
  return Xh((0, Yh.fromByteArray)(new TextEncoder().encode(t)));
}
jt.encode = _w;
function Tw(t) {
  return new TextDecoder().decode((0, Yh.toByteArray)(Uc(Zh(t))));
}
jt.decode = Tw;
var oo = {}, ao = {}, Qh = {}, Jh = {}, co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
co.crypto = void 0;
co.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = f, t.createView = u, t.rotr = g, t.rotl = h, t.byteSwap = b, t.byteSwap32 = x, t.bytesToHex = _, t.hexToBytes = p, t.asyncLoop = M, t.utf8ToBytes = B, t.bytesToUtf8 = N, t.toBytes = y, t.kdfInputToBytes = E, t.concatBytes = T, t.checkOpts = O, t.createHasher = D, t.createOptHasher = Gt, t.createXOFer = tt, t.randomBytes = ht;
  const e = co;
  function n(m) {
    return m instanceof Uint8Array || ArrayBuffer.isView(m) && m.constructor.name === "Uint8Array";
  }
  function r(m) {
    if (!Number.isSafeInteger(m) || m < 0)
      throw new Error("positive integer expected, got " + m);
  }
  function s(m, ...L) {
    if (!n(m))
      throw new Error("Uint8Array expected");
    if (L.length > 0 && !L.includes(m.length))
      throw new Error("Uint8Array expected of length " + L + ", got length=" + m.length);
  }
  function i(m) {
    if (typeof m != "function" || typeof m.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(m.outputLen), r(m.blockLen);
  }
  function o(m, L = !0) {
    if (m.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (L && m.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(m, L) {
    s(m);
    const et = L.outputLen;
    if (m.length < et)
      throw new Error("digestInto() expects output buffer of length at least " + et);
  }
  function c(m) {
    return new Uint8Array(m.buffer, m.byteOffset, m.byteLength);
  }
  function l(m) {
    return new Uint32Array(m.buffer, m.byteOffset, Math.floor(m.byteLength / 4));
  }
  function f(...m) {
    for (let L = 0; L < m.length; L++)
      m[L].fill(0);
  }
  function u(m) {
    return new DataView(m.buffer, m.byteOffset, m.byteLength);
  }
  function g(m, L) {
    return m << 32 - L | m >>> L;
  }
  function h(m, L) {
    return m << L | m >>> 32 - L >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function b(m) {
    return m << 24 & 4278190080 | m << 8 & 16711680 | m >>> 8 & 65280 | m >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (m) => m : (m) => b(m), t.byteSwapIfBE = t.swap8IfBE;
  function x(m) {
    for (let L = 0; L < m.length; L++)
      m[L] = b(m[L]);
    return m;
  }
  t.swap32IfBE = t.isLE ? (m) => m : x;
  const A = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (m, L) => L.toString(16).padStart(2, "0"));
  function _(m) {
    if (s(m), A)
      return m.toHex();
    let L = "";
    for (let et = 0; et < m.length; et++)
      L += U[m[et]];
    return L;
  }
  const w = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function $(m) {
    if (m >= w._0 && m <= w._9)
      return m - w._0;
    if (m >= w.A && m <= w.F)
      return m - (w.A - 10);
    if (m >= w.a && m <= w.f)
      return m - (w.a - 10);
  }
  function p(m) {
    if (typeof m != "string")
      throw new Error("hex string expected, got " + typeof m);
    if (A)
      return Uint8Array.fromHex(m);
    const L = m.length, et = L / 2;
    if (L % 2)
      throw new Error("hex string expected, got unpadded hex of length " + L);
    const ut = new Uint8Array(et);
    for (let ot = 0, It = 0; ot < et; ot++, It += 2) {
      const xe = $(m.charCodeAt(It)), Xt = $(m.charCodeAt(It + 1));
      if (xe === void 0 || Xt === void 0) {
        const rt = m[It] + m[It + 1];
        throw new Error('hex string expected, got non-hex character "' + rt + '" at index ' + It);
      }
      ut[ot] = xe * 16 + Xt;
    }
    return ut;
  }
  const I = async () => {
  };
  t.nextTick = I;
  async function M(m, L, et) {
    let ut = Date.now();
    for (let ot = 0; ot < m; ot++) {
      et(ot);
      const It = Date.now() - ut;
      It >= 0 && It < L || (await (0, t.nextTick)(), ut += It);
    }
  }
  function B(m) {
    if (typeof m != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(m));
  }
  function N(m) {
    return new TextDecoder().decode(m);
  }
  function y(m) {
    return typeof m == "string" && (m = B(m)), s(m), m;
  }
  function E(m) {
    return typeof m == "string" && (m = B(m)), s(m), m;
  }
  function T(...m) {
    let L = 0;
    for (let ut = 0; ut < m.length; ut++) {
      const ot = m[ut];
      s(ot), L += ot.length;
    }
    const et = new Uint8Array(L);
    for (let ut = 0, ot = 0; ut < m.length; ut++) {
      const It = m[ut];
      et.set(It, ot), ot += It.length;
    }
    return et;
  }
  function O(m, L) {
    if (L !== void 0 && {}.toString.call(L) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(m, L);
  }
  class R {
  }
  t.Hash = R;
  function D(m) {
    const L = (ut) => m().update(y(ut)).digest(), et = m();
    return L.outputLen = et.outputLen, L.blockLen = et.blockLen, L.create = () => m(), L;
  }
  function Gt(m) {
    const L = (ut, ot) => m(ot).update(y(ut)).digest(), et = m({});
    return L.outputLen = et.outputLen, L.blockLen = et.blockLen, L.create = (ut) => m(ut), L;
  }
  function tt(m) {
    const L = (ut, ot) => m(ot).update(y(ut)).digest(), et = m({});
    return L.outputLen = et.outputLen, L.blockLen = et.blockLen, L.create = (ut) => m(ut), L;
  }
  t.wrapConstructor = D, t.wrapConstructorWithOpts = Gt, t.wrapXOFConstructorWithOpts = tt;
  function ht(m = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(m));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(m));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Jh);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Jh;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, l = new Uint8Array(c);
      l.set(a.length > c ? i.create().update(a).digest() : a);
      for (let f = 0; f < l.length; f++)
        l[f] ^= 54;
      this.iHash.update(l), this.oHash = i.create();
      for (let f = 0; f < l.length; f++)
        l[f] ^= 106;
      this.oHash.update(l), (0, e.clean)(l);
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
      const { oHash: o, iHash: a, finished: c, destroyed: l, blockLen: f, outputLen: u } = this;
      return i = i, i.finished = c, i.destroyed = l, i.blockLen = f, i.outputLen = u, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(Qh);
const $r = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function td(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function ma(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function fr(t, ...e) {
  if (!td(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Nw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  ma(t.outputLen), ma(t.blockLen);
}
function Sa(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ed(t, e) {
  fr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function kw(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Pw(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ti(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function mi(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function le(t, e) {
  return t << 32 - e | t >>> e;
}
function Dw(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Hc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function _c(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const nd = Hc ? (t) => t : (t) => _c(t), Ow = nd;
function rd(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = _c(t[e]);
  return t;
}
const jw = Hc ? (t) => t : rd, sd = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Fw = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zw(t) {
  if (fr(t), sd)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Fw[t[n]];
  return e;
}
const Pe = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function fl(t) {
  if (t >= Pe._0 && t <= Pe._9)
    return t - Pe._0;
  if (t >= Pe.A && t <= Pe.F)
    return t - (Pe.A - 10);
  if (t >= Pe.a && t <= Pe.f)
    return t - (Pe.a - 10);
}
function Rw(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (sd)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = fl(t.charCodeAt(i)), a = fl(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const id = async () => {
};
async function Gw(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await id(), r += i);
  }
}
function Tc(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Kw(t) {
  return new TextDecoder().decode(t);
}
function Ns(t) {
  return typeof t == "string" && (t = Tc(t)), fr(t), t;
}
function Vw(t) {
  return typeof t == "string" && (t = Tc(t)), fr(t), t;
}
function qw(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    fr(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function Ww(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let od = class {
};
function uo(t) {
  const e = (r) => t().update(Ns(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ad(t) {
  const e = (r, s) => t(s).update(Ns(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function cd(t) {
  const e = (r, s) => t(s).update(Ns(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Yw = uo, Xw = ad, Zw = cd;
function Qw(t = 32) {
  if ($r && typeof $r.getRandomValues == "function")
    return $r.getRandomValues(new Uint8Array(t));
  if ($r && typeof $r.randomBytes == "function")
    return Uint8Array.from($r.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Jw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: od,
  abytes: fr,
  aexists: Sa,
  ahash: Nw,
  anumber: ma,
  aoutput: ed,
  asyncLoop: Gw,
  byteSwap: _c,
  byteSwap32: rd,
  byteSwapIfBE: Ow,
  bytesToHex: zw,
  bytesToUtf8: Kw,
  checkOpts: Ww,
  clean: Ti,
  concatBytes: qw,
  createHasher: uo,
  createOptHasher: ad,
  createView: mi,
  createXOFer: cd,
  hexToBytes: Rw,
  isBytes: td,
  isLE: Hc,
  kdfInputToBytes: Vw,
  nextTick: id,
  randomBytes: Qw,
  rotl: Dw,
  rotr: le,
  swap32IfBE: jw,
  swap8IfBE: nd,
  toBytes: Ns,
  u32: Pw,
  u8: kw,
  utf8ToBytes: Tc,
  wrapConstructor: Yw,
  wrapConstructorWithOpts: Xw,
  wrapXOFConstructorWithOpts: Zw
}, Symbol.toStringTag, { value: "Module" }));
function tb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function eb(t, e, n) {
  return t & e ^ ~t & n;
}
function nb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class rb extends od {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = mi(this.buffer);
  }
  update(e) {
    Sa(this), e = Ns(e), fr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = mi(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Sa(this), ed(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ti(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    tb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = mi(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const Qe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Je = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), sb = /* @__PURE__ */ Uint32Array.from([
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
]), tn = /* @__PURE__ */ new Uint32Array(64);
let Nc = class extends rb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Qe[0] | 0, this.B = Qe[1] | 0, this.C = Qe[2] | 0, this.D = Qe[3] | 0, this.E = Qe[4] | 0, this.F = Qe[5] | 0, this.G = Qe[6] | 0, this.H = Qe[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      tn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = tn[u - 15], h = tn[u - 2], b = le(g, 7) ^ le(g, 18) ^ g >>> 3, x = le(h, 17) ^ le(h, 19) ^ h >>> 10;
      tn[u] = x + tn[u - 7] + b + tn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = le(a, 6) ^ le(a, 11) ^ le(a, 25), h = f + g + eb(a, c, l) + sb[u] + tn[u] | 0, x = (le(r, 2) ^ le(r, 13) ^ le(r, 22)) + nb(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    Ti(tn);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ti(this.buffer);
  }
}, ud = class extends Nc {
  constructor() {
    super(28), this.A = Je[0] | 0, this.B = Je[1] | 0, this.C = Je[2] | 0, this.D = Je[3] | 0, this.E = Je[4] | 0, this.F = Je[5] | 0, this.G = Je[6] | 0, this.H = Je[7] | 0;
  }
};
const ib = /* @__PURE__ */ uo(() => new Nc()), ob = /* @__PURE__ */ uo(() => new ud()), ab = Nc, cb = ib, ub = ud, lb = ob, fb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: ub,
  SHA256: ab,
  sha224: lb,
  sha256: cb
}, Symbol.toStringTag, { value: "Module" })), lo = /* @__PURE__ */ eo(fb), hb = /* @__PURE__ */ eo(yy);
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.joseToDer = Or.derToJose = void 0;
const ld = Ts, fd = jt;
function qo(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const db = {
  ES256: qo(256),
  ES384: qo(384),
  ES512: qo(521)
};
function hd(t) {
  const e = db[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ni = 128, dd = 0, pb = 32, gb = 16, yb = 2, pd = gb | pb | dd << 6, ki = yb | dd << 6;
function gd(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, ld.toByteArray)((0, fd.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function wb(t, e) {
  const n = gd(t), r = hd(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== pd)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Ni | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== ki)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const l = o;
  if (o += c, n[o++] !== ki)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const u = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - f, b = new Uint8Array(g + c + h + f);
  for (o = 0; o < g; ++o)
    b[o] = 0;
  b.set(n.subarray(l + Math.max(-g, 0), l + c), o), o = r;
  for (const x = o; o < x + h; ++o)
    b[o] = 0;
  return b.set(n.subarray(u + Math.max(-h, 0), u + f), o), (0, fd.escape)((0, ld.fromByteArray)(b));
}
Or.derToJose = wb;
function hl(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ni && --r, r;
}
function bb(t, e) {
  t = gd(t);
  const n = hd(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = hl(t, 0, n), i = hl(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < Ni, f = new Uint8Array((l ? 2 : 3) + c);
  let u = 0;
  return f[u++] = pd, l ? f[u++] = c : (f[u++] = Ni | 1, f[u++] = c & 255), f[u++] = ki, f[u++] = o, s < 0 ? (f[u++] = 0, f.set(t.subarray(0, n), u), u += n) : (f.set(t.subarray(s, n), u), u += n - s), f[u++] = ki, f[u++] = a, i < 0 ? (f[u++] = 0, f.set(t.subarray(n), u)) : f.set(t.subarray(n + i), u), f;
}
Or.joseToDer = bb;
var Re = {};
Object.defineProperty(Re, "__esModule", { value: !0 });
Re.InvalidTokenError = Re.MissingParametersError = void 0;
class xb extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Re.MissingParametersError = xb;
class mb extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Re.InvalidTokenError = mb;
const ks = /* @__PURE__ */ eo(Jw);
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.SECP256K1Client = void 0;
const Sb = Qh, Eb = lo, Si = hb, dl = Or, pl = Re, gl = ks;
Si.utils.hmacSha256Sync = (t, ...e) => {
  const n = Sb.hmac.create(Eb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class yd {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, gl.bytesToHex)(Si.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new pl.MissingParametersError("a signing input hash and private key are all required");
    const s = Si.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, gl.bytesToHex)(s);
    if (r === "jose")
      return (0, dl.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, dl.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new pl.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Si.verify(n, e, r, { strict: !1 });
  }
}
ao.SECP256K1Client = yd;
yd.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ao;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(oo);
var Xn = {};
const Ab = /* @__PURE__ */ eo(Ah);
var $b = zt && zt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        l(r.next(f));
      } catch (u) {
        o(u);
      }
    }
    function c(f) {
      try {
        l(r.throw(f));
      } catch (u) {
        o(u);
      }
    }
    function l(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.hashSha256Async = Xn.hashSha256 = void 0;
const Ib = lo;
function wd(t) {
  return (0, Ib.sha256)(t);
}
Xn.hashSha256 = wd;
function vb(t) {
  return $b(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Ab;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(wd(t));
    }
  });
}
Xn.hashSha256Async = vb;
var Lb = zt && zt.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        l(r.next(f));
      } catch (u) {
        o(u);
      }
    }
    function c(f) {
      try {
        l(r.throw(f));
      } catch (u) {
        o(u);
      }
    }
    function l(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.TokenSigner = Dr.createUnsecuredToken = void 0;
const Ea = jt, yl = oo, Cb = Re, wl = Xn;
function Aa(t, e) {
  const n = [], r = Ea.encode(JSON.stringify(e));
  n.push(r);
  const s = Ea.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Bb(t) {
  return Aa(t, { typ: "JWT", alg: "none" }) + ".";
}
Dr.createUnsecuredToken = Bb;
class Mb {
  constructor(e, n) {
    if (!(e && n))
      throw new Cb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !yl.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = yl.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Aa(e, s), o = (0, wl.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Lb(this, void 0, void 0, function* () {
      const s = this.header(r), i = Aa(e, s), o = yield (0, wl.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ea.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Dr.TokenSigner = Mb;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
fo.TokenVerifier = void 0;
const Ub = jt, bl = oo, Hb = Re, ti = Xn;
class _b {
  constructor(e, n) {
    if (!(e && n))
      throw new Hb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !bl.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = bl.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, ti.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, ti.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Ub.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, ti.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, ti.hashSha256)(r);
      return i(o);
    }
  }
}
fo.TokenVerifier = _b;
var ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
ho.decodeToken = void 0;
const ei = jt;
function Tb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ei.decode(e[0])), r = JSON.parse(ei.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ei.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ei.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ho.decodeToken = Tb;
(function(t) {
  var e = zt && zt.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = zt && zt.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Dr, t), n(fo, t), n(ho, t), n(Re, t), n(oo, t);
})(_t);
function Nb(t) {
  return `did:btc-addr:${t}`;
}
function kb(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Zu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Zu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function bd(t) {
  if (t)
    return kb(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Pb = "1.4.0";
function Db() {
  return Sw();
}
function Ob(t, e, n, r = dh.slice(), s, i = b1().getTime(), o = {}) {
  const a = (h) => {
    const b = mc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return b == null ? void 0 : b.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: m1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Pb,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = _t.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const f = Gh(l);
  return c.iss = Nb(f), new _t.TokenSigner("ES256k", t).sign(c);
}
async function xl(t, e) {
  const n = Hs(ct(e)), r = JSON.parse(n), s = await Wh(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function jb(t) {
  const e = _t.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new _t.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Fb(t) {
  const e = _t.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = bd(e.iss);
  if (n.length === 1) {
    if (Gh(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zb(t) {
  const e = _t.decodeToken(t).payload;
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
function Rb(t) {
  const e = _t.decodeToken(t).payload;
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
function Gb(t) {
  const e = [
    Rb(t),
    zb(t),
    jb(t),
    Fb(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const ml = "1.0.0";
class Ln {
  constructor(e) {
    this.version = ml, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== ml)
      throw new pa(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ln(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class xd {
  constructor(e) {
    if (e) {
      const n = new Ln(e);
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
class Sl extends xd {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ln({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new ph("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ln({})), !0;
  }
}
class El extends xd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = g1, !localStorage.getItem(this.key)) {
      const r = new Ln({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new ph("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ln.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ln({})), !0;
  }
}
var xs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(xs || (xs = {}));
var Pi;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pi || (Pi = {}));
xs.Mainnet;
var Fe;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fe || (Fe = {}));
var Le;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Le || (Le = {}));
Fe.Mainnet;
const md = {
  chainId: xs.Mainnet,
  transactionVersion: Fe.Mainnet,
  peerNetworkId: Pi.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Le.MainnetSingleSig,
    multiSig: Le.MainnetMultiSig
  },
  client: { baseUrl: gh }
}, $a = {
  chainId: xs.Testnet,
  transactionVersion: Fe.Testnet,
  peerNetworkId: Pi.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Le.TestnetSingleSig,
    multiSig: Le.TestnetMultiSig
  },
  client: { baseUrl: yh }
}, Ei = {
  ...$a,
  addressVersion: { ...$a.addressVersion },
  magicBytes: "id",
  client: { baseUrl: wh }
}, Kb = {
  ...Ei,
  addressVersion: { ...Ei.addressVersion },
  client: { ...Ei.client }
};
function Vb(t) {
  switch (t) {
    case "mainnet":
      return md;
    case "testnet":
      return $a;
    case "devnet":
      return Ei;
    case "mocknet":
      return Kb;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Sd(t) {
  return typeof t == "string" ? Vb(t) : t;
}
var Al;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Al || (Al = {}));
var $l;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})($l || ($l = {}));
var fe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(fe || (fe = {}));
const Wo = ["onChainOnly", "offChainOnly", "any"];
Wo[0] + "", fe.OnChainOnly, Wo[1] + "", fe.OffChainOnly, Wo[2] + "", fe.Any, fe.OnChainOnly + "", fe.OnChainOnly, fe.OffChainOnly + "", fe.OffChainOnly, fe.Any + "", fe.Any;
var Il;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Il || (Il = {}));
var vl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(vl || (vl = {}));
var Ll;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ll || (Ll = {}));
var je;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(je || (je = {}));
var Cl;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Cl || (Cl = {}));
var Bl;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Bl || (Bl = {}));
var Ml;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ml || (Ml = {}));
var Ul;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ul || (Ul = {}));
var Hl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Hl || (Hl = {}));
var _l;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_l || (_l = {}));
var Tl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Tl || (Tl = {}));
var Nl;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Nl || (Nl = {}));
var kl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(kl || (kl = {}));
function Ia(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function qb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ed(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Wb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ia(t.outputLen), Ia(t.blockLen);
}
function Yb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xb(t, e) {
  Ed(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Dn = {
  number: Ia,
  bool: qb,
  bytes: Ed,
  hash: Wb,
  exists: Yb,
  output: Xb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Yo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Se = (t, e) => t << 32 - e | t >>> e, Zb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function kc(t) {
  if (typeof t == "string" && (t = Qb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ad = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hr(t) {
  const e = (r) => t().update(kc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let $d = class extends Ad {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Dn.hash(e);
    const r = kc(n);
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
    return Dn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Dn.exists(this), Dn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Id = (t, e, n) => new $d(t, e).update(n).digest();
Id.create = (t, e) => new $d(t, e);
function Jb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Pc = class extends Ad {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Yo(this.buffer);
  }
  update(e) {
    Dn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = kc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Yo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Dn.exists(this), Dn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Jb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Yo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const t2 = (t, e, n) => t & e ^ ~t & n, e2 = (t, e, n) => t & e ^ t & n ^ e & n, n2 = new Uint32Array([
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
]), en = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), nn = new Uint32Array(64);
let vd = class extends Pc {
  constructor() {
    super(64, 32, 8, !1), this.A = en[0] | 0, this.B = en[1] | 0, this.C = en[2] | 0, this.D = en[3] | 0, this.E = en[4] | 0, this.F = en[5] | 0, this.G = en[6] | 0, this.H = en[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      nn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = nn[u - 15], h = nn[u - 2], b = Se(g, 7) ^ Se(g, 18) ^ g >>> 3, x = Se(h, 17) ^ Se(h, 19) ^ h >>> 10;
      nn[u] = x + nn[u - 7] + b + nn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = Se(a, 6) ^ Se(a, 11) ^ Se(a, 25), h = f + g + t2(a, c, l) + n2[u] + nn[u] | 0, x = (Se(r, 2) ^ Se(r, 13) ^ Se(r, 22)) + e2(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    nn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, r2 = class extends vd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ld = hr(() => new vd());
hr(() => new r2());
var dr = {}, Dc = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ks;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], l = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (l < 4) {
        const b = n.indexOf(o[h]) >> l;
        let x = 0;
        h !== 0 && (x = n.indexOf(o[h - 1]));
        const A = 1 + l, U = x % (1 << A) << 5 - A, _ = t.c32[b + U];
        l = A, c.unshift(_);
      } else
        l = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
    const u = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = u ? u[0].length : 0;
    for (let h = 0; h < g; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let b = 0; b < h; b++)
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
    const c = o.match(`^${t.c32[0]}*`), l = c ? c[0].length : 0;
    let f = [], u = 0, g = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      g === 4 && (f.unshift(n[u]), g = 0, u = 0);
      const U = (t.c32.indexOf(o[x]) << g) + u, _ = n[U % 16];
      if (g += 1, u = U >> 4, u > 1 << g)
        throw new Error("Panic error in decoding.");
      f.unshift(_);
    }
    f.unshift(n[u]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let x = 0; x < f.length && f[x] === "0"; x++)
      h++;
    f = f.slice(h - h % 2);
    let b = f.join("");
    for (let x = 0; x < l; x++)
      b = `00${b}`;
    if (a) {
      const x = a * 2 - b.length;
      for (let A = 0; A < x; A += 2)
        b = `00${b}`;
    }
    return b;
  }
  t.c32decode = i;
})(Dc);
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.c32checkDecode = Zn.c32checkEncode = void 0;
const Pl = lo, Dl = ks, ds = Dc;
function Cd(t) {
  const e = (0, Pl.sha256)((0, Pl.sha256)((0, Dl.hexToBytes)(t)));
  return (0, Dl.bytesToHex)(e.slice(0, 4));
}
function s2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Cd(`${n}${e}`), s = (0, ds.c32encode)(`${e}${r}`);
  return `${ds.c32[t]}${s}`;
}
Zn.c32checkEncode = s2;
function i2(t) {
  t = (0, ds.c32normalize)(t);
  const e = (0, ds.c32decode)(t.slice(1)), n = t[0], r = ds.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Cd(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Zn.c32checkDecode = i2;
var Bd = {}, jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.decode = jr.encode = void 0;
const Di = lo, Ol = ks, Md = Oh, Ud = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function o2(t, e = "00") {
  const n = typeof t == "string" ? (0, Ol.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ol.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Di.sha256)((0, Di.sha256)(new Uint8Array([...r, ...n])));
  return Md(Ud).encode([...r, ...n, ...s.slice(0, 4)]);
}
jr.encode = o2;
function a2(t) {
  const e = Md(Ud).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Di.sha256)((0, Di.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
jr.decode = a2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Zn, n = jr, r = ks;
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
  function o(f, u) {
    if (!u.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(f, u)}`;
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
  function c(f, u = -1) {
    const g = n.decode(f), h = (0, r.bytesToHex)(g.data), b = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let x;
    return u < 0 ? (x = b, s[b] !== void 0 && (x = s[b])) : x = u, o(x, h);
  }
  t.b58ToC32 = c;
  function l(f, u = -1) {
    const g = a(f), h = g[0], b = g[1];
    let x;
    u < 0 ? (x = h, i[h] !== void 0 && (x = i[h])) : x = u;
    let A = x.toString(16);
    return A.length === 1 && (A = `0${A}`), n.encode(b, A);
  }
  t.c32ToB58 = l;
})(Bd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Dc;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Zn;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Bd;
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
})(dr);
function c2(t, e) {
  switch (e = Sd(e ?? md), t) {
    case je.P2PKH:
      switch (e.transactionVersion) {
        case Fe.Mainnet:
          return Le.MainnetSingleSig;
        case Fe.Testnet:
          return Le.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case je.P2SH:
    case je.P2SHNonSequential:
    case je.P2WPKH:
    case je.P2WSH:
    case je.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Fe.Mainnet:
          return Le.MainnetMultiSig;
        case Fe.Testnet:
          return Le.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const u2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hd = Uint8Array.from({ length: 16 }, (t, e) => e), l2 = Hd.map((t) => (9 * t + 5) % 16);
let Oc = [Hd], jc = [l2];
for (let t = 0; t < 4; t++)
  for (let e of [Oc, jc])
    e.push(e[t].map((n) => u2[n]));
const _d = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f2 = Oc.map((t, e) => t.map((n) => _d[e][n])), h2 = jc.map((t, e) => t.map((n) => _d[e][n])), d2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ni = (t, e) => t << e | t >>> 32 - e;
function jl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ri = new Uint32Array(16);
let g2 = class extends Pc {
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
      ri[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = d2[h], A = p2[h], U = Oc[h], _ = jc[h], w = f2[h], $ = h2[h];
      for (let p = 0; p < 16; p++) {
        const I = ni(r + jl(h, i, a, l) + ri[U[p]] + x, w[p]) + u | 0;
        r = u, u = l, l = ni(a, 10) | 0, a = i, i = I;
      }
      for (let p = 0; p < 16; p++) {
        const I = ni(s + jl(b, o, c, f) + ri[_[p]] + A, $[p]) + g | 0;
        s = g, g = f, f = ni(c, 10) | 0, c = o, o = I;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ri.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const y2 = hr(() => new g2()), si = BigInt(2 ** 32 - 1), va = BigInt(32);
function Td(t, e = !1) {
  return e ? { h: Number(t & si), l: Number(t >> va & si) } : { h: Number(t >> va & si) | 0, l: Number(t & si) | 0 };
}
function w2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Td(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const b2 = (t, e) => BigInt(t >>> 0) << va | BigInt(e >>> 0), x2 = (t, e, n) => t >>> n, m2 = (t, e, n) => t << 32 - n | e >>> n, S2 = (t, e, n) => t >>> n | e << 32 - n, E2 = (t, e, n) => t << 32 - n | e >>> n, A2 = (t, e, n) => t << 64 - n | e >>> n - 32, $2 = (t, e, n) => t >>> n - 32 | e << 64 - n, I2 = (t, e) => e, v2 = (t, e) => t, L2 = (t, e, n) => t << n | e >>> 32 - n, C2 = (t, e, n) => e << n | t >>> 32 - n, B2 = (t, e, n) => e << n - 32 | t >>> 64 - n, M2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function U2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const H2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, T2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), N2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, k2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), P2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, W = {
  fromBig: Td,
  split: w2,
  toBig: b2,
  shrSH: x2,
  shrSL: m2,
  rotrSH: S2,
  rotrSL: E2,
  rotrBH: A2,
  rotrBL: $2,
  rotr32H: I2,
  rotr32L: v2,
  rotlSH: L2,
  rotlSL: C2,
  rotlBH: B2,
  rotlBL: M2,
  add: U2,
  add3L: H2,
  add3H: _2,
  add4L: T2,
  add4H: N2,
  add5H: P2,
  add5L: k2
}, [D2, O2] = W.split([
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
].map((t) => BigInt(t))), rn = new Uint32Array(80), sn = new Uint32Array(80);
let po = class extends Pc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: b, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      rn[w] = e.getUint32(n), sn[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const $ = rn[w - 15] | 0, p = sn[w - 15] | 0, I = W.rotrSH($, p, 1) ^ W.rotrSH($, p, 8) ^ W.shrSH($, p, 7), M = W.rotrSL($, p, 1) ^ W.rotrSL($, p, 8) ^ W.shrSL($, p, 7), B = rn[w - 2] | 0, N = sn[w - 2] | 0, y = W.rotrSH(B, N, 19) ^ W.rotrBH(B, N, 61) ^ W.shrSH(B, N, 6), E = W.rotrSL(B, N, 19) ^ W.rotrBL(B, N, 61) ^ W.shrSL(B, N, 6), T = W.add4L(M, E, sn[w - 7], sn[w - 16]), O = W.add4H(T, I, y, rn[w - 7], rn[w - 16]);
      rn[w] = O | 0, sn[w] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: b, Gh: x, Gl: A, Hh: U, Hl: _ } = this;
    for (let w = 0; w < 80; w++) {
      const $ = W.rotrSH(u, g, 14) ^ W.rotrSH(u, g, 18) ^ W.rotrBH(u, g, 41), p = W.rotrSL(u, g, 14) ^ W.rotrSL(u, g, 18) ^ W.rotrBL(u, g, 41), I = u & h ^ ~u & x, M = g & b ^ ~g & A, B = W.add5L(_, p, M, O2[w], sn[w]), N = W.add5H(B, U, $, I, D2[w], rn[w]), y = B | 0, E = W.rotrSH(r, s, 28) ^ W.rotrBH(r, s, 34) ^ W.rotrBH(r, s, 39), T = W.rotrSL(r, s, 28) ^ W.rotrBL(r, s, 34) ^ W.rotrBL(r, s, 39), O = r & i ^ r & a ^ i & a, R = s & o ^ s & c ^ o & c;
      U = x | 0, _ = A | 0, x = h | 0, A = b | 0, h = u | 0, b = g | 0, { h: u, l: g } = W.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const D = W.add3L(y, T, R);
      r = W.add3H(D, N, E, O), s = D | 0;
    }
    ({ h: r, l: s } = W.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = W.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = W.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = W.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = W.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: b } = W.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: A } = W.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: U, l: _ } = W.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, b, x, A, U, _);
  }
  roundClean() {
    rn.fill(0), sn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, j2 = class extends po {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, F2 = class extends po {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, z2 = class extends po {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hr(() => new po());
hr(() => new j2());
hr(() => new F2());
hr(() => new z2());
var Oi = { exports: {} };
Oi.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", f = "[object Function]", u = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", b = "[object Object]", x = "[object Promise]", A = "[object RegExp]", U = "[object Set]", _ = "[object String]", w = "[object Symbol]", $ = "[object WeakMap]", p = "[object ArrayBuffer]", I = "[object DataView]", M = "[object Float32Array]", B = "[object Float64Array]", N = "[object Int8Array]", y = "[object Int16Array]", E = "[object Int32Array]", T = "[object Uint8Array]", O = "[object Uint8ClampedArray]", R = "[object Uint16Array]", D = "[object Uint32Array]", Gt = /[\\^$.*+?()[\]{}|]/g, tt = /\w*$/, ht = /^\[object .+?Constructor\]$/, m = /^(?:0|[1-9]\d*)$/, L = {};
  L[i] = L[o] = L[p] = L[I] = L[a] = L[c] = L[M] = L[B] = L[N] = L[y] = L[E] = L[g] = L[h] = L[b] = L[A] = L[U] = L[_] = L[w] = L[T] = L[O] = L[R] = L[D] = !0, L[l] = L[f] = L[$] = !1;
  var et = typeof zt == "object" && zt && zt.Object === Object && zt, ut = typeof self == "object" && self && self.Object === Object && self, ot = et || ut || Function("return this")(), It = e && !e.nodeType && e, xe = It && !0 && t && !t.nodeType && t, Xt = xe && xe.exports === It;
  function rt(d, S) {
    return d.set(S[0], S[1]), d;
  }
  function Tt(d, S) {
    return d.add(S), d;
  }
  function ue(d, S) {
    for (var v = -1, j = d ? d.length : 0; ++v < j && S(d[v], v, d) !== !1; )
      ;
    return d;
  }
  function ns(d, S) {
    for (var v = -1, j = S.length, Ut = d.length; ++v < j; )
      d[Ut + v] = S[v];
    return d;
  }
  function br(d, S, v, j) {
    for (var Ut = -1, Kt = d ? d.length : 0; ++Ut < Kt; )
      v = S(v, d[Ut], Ut, d);
    return v;
  }
  function Uo(d, S) {
    for (var v = -1, j = Array(d); ++v < d; )
      j[v] = S(v);
    return j;
  }
  function Ho(d, S) {
    return d == null ? void 0 : d[S];
  }
  function C(d) {
    var S = !1;
    if (d != null && typeof d.toString != "function")
      try {
        S = !!(d + "");
      } catch {
      }
    return S;
  }
  function F(d) {
    var S = -1, v = Array(d.size);
    return d.forEach(function(j, Ut) {
      v[++S] = [Ut, j];
    }), v;
  }
  function at(d, S) {
    return function(v) {
      return d(S(v));
    };
  }
  function K(d) {
    var S = -1, v = Array(d.size);
    return d.forEach(function(j) {
      v[++S] = j;
    }), v;
  }
  var Ct = Array.prototype, Pt = Function.prototype, Dt = Object.prototype, Ve = ot["__core-js_shared__"], js = function() {
    var d = /[^.]+$/.exec(Ve && Ve.keys && Ve.keys.IE_PROTO || "");
    return d ? "Symbol(src)_1." + d : "";
  }(), Un = Pt.toString, qe = Dt.hasOwnProperty, Fs = Dt.toString, _p = RegExp(
    "^" + Un.call(qe).replace(Gt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Uu = Xt ? ot.Buffer : void 0, Hu = ot.Symbol, _u = ot.Uint8Array, Tp = at(Object.getPrototypeOf, Object), Np = Object.create, kp = Dt.propertyIsEnumerable, Pp = Ct.splice, Tu = Object.getOwnPropertySymbols, Dp = Uu ? Uu.isBuffer : void 0, Op = at(Object.keys, Object), _o = Sr(ot, "DataView"), rs = Sr(ot, "Map"), To = Sr(ot, "Promise"), No = Sr(ot, "Set"), ko = Sr(ot, "WeakMap"), ss = Sr(Object, "create"), jp = Tn(_o), Fp = Tn(rs), zp = Tn(To), Rp = Tn(No), Gp = Tn(ko), Nu = Hu ? Hu.prototype : void 0, ku = Nu ? Nu.valueOf : void 0;
  function Hn(d) {
    var S = -1, v = d ? d.length : 0;
    for (this.clear(); ++S < v; ) {
      var j = d[S];
      this.set(j[0], j[1]);
    }
  }
  function Kp() {
    this.__data__ = ss ? ss(null) : {};
  }
  function Vp(d) {
    return this.has(d) && delete this.__data__[d];
  }
  function qp(d) {
    var S = this.__data__;
    if (ss) {
      var v = S[d];
      return v === r ? void 0 : v;
    }
    return qe.call(S, d) ? S[d] : void 0;
  }
  function Wp(d) {
    var S = this.__data__;
    return ss ? S[d] !== void 0 : qe.call(S, d);
  }
  function Yp(d, S) {
    var v = this.__data__;
    return v[d] = ss && S === void 0 ? r : S, this;
  }
  Hn.prototype.clear = Kp, Hn.prototype.delete = Vp, Hn.prototype.get = qp, Hn.prototype.has = Wp, Hn.prototype.set = Yp;
  function Ne(d) {
    var S = -1, v = d ? d.length : 0;
    for (this.clear(); ++S < v; ) {
      var j = d[S];
      this.set(j[0], j[1]);
    }
  }
  function Xp() {
    this.__data__ = [];
  }
  function Zp(d) {
    var S = this.__data__, v = zs(S, d);
    if (v < 0)
      return !1;
    var j = S.length - 1;
    return v == j ? S.pop() : Pp.call(S, v, 1), !0;
  }
  function Qp(d) {
    var S = this.__data__, v = zs(S, d);
    return v < 0 ? void 0 : S[v][1];
  }
  function Jp(d) {
    return zs(this.__data__, d) > -1;
  }
  function tg(d, S) {
    var v = this.__data__, j = zs(v, d);
    return j < 0 ? v.push([d, S]) : v[j][1] = S, this;
  }
  Ne.prototype.clear = Xp, Ne.prototype.delete = Zp, Ne.prototype.get = Qp, Ne.prototype.has = Jp, Ne.prototype.set = tg;
  function xr(d) {
    var S = -1, v = d ? d.length : 0;
    for (this.clear(); ++S < v; ) {
      var j = d[S];
      this.set(j[0], j[1]);
    }
  }
  function eg() {
    this.__data__ = {
      hash: new Hn(),
      map: new (rs || Ne)(),
      string: new Hn()
    };
  }
  function ng(d) {
    return Rs(this, d).delete(d);
  }
  function rg(d) {
    return Rs(this, d).get(d);
  }
  function sg(d) {
    return Rs(this, d).has(d);
  }
  function ig(d, S) {
    return Rs(this, d).set(d, S), this;
  }
  xr.prototype.clear = eg, xr.prototype.delete = ng, xr.prototype.get = rg, xr.prototype.has = sg, xr.prototype.set = ig;
  function mr(d) {
    this.__data__ = new Ne(d);
  }
  function og() {
    this.__data__ = new Ne();
  }
  function ag(d) {
    return this.__data__.delete(d);
  }
  function cg(d) {
    return this.__data__.get(d);
  }
  function ug(d) {
    return this.__data__.has(d);
  }
  function lg(d, S) {
    var v = this.__data__;
    if (v instanceof Ne) {
      var j = v.__data__;
      if (!rs || j.length < n - 1)
        return j.push([d, S]), this;
      v = this.__data__ = new xr(j);
    }
    return v.set(d, S), this;
  }
  mr.prototype.clear = og, mr.prototype.delete = ag, mr.prototype.get = cg, mr.prototype.has = ug, mr.prototype.set = lg;
  function fg(d, S) {
    var v = Oo(d) || Ng(d) ? Uo(d.length, String) : [], j = v.length, Ut = !!j;
    for (var Kt in d)
      qe.call(d, Kt) && !(Ut && (Kt == "length" || Ug(Kt, j))) && v.push(Kt);
    return v;
  }
  function Pu(d, S, v) {
    var j = d[S];
    (!(qe.call(d, S) && Fu(j, v)) || v === void 0 && !(S in d)) && (d[S] = v);
  }
  function zs(d, S) {
    for (var v = d.length; v--; )
      if (Fu(d[v][0], S))
        return v;
    return -1;
  }
  function hg(d, S) {
    return d && Du(S, jo(S), d);
  }
  function Po(d, S, v, j, Ut, Kt, ke) {
    var Vt;
    if (j && (Vt = Kt ? j(d, Ut, Kt, ke) : j(d)), Vt !== void 0)
      return Vt;
    if (!Gs(d))
      return d;
    var Gu = Oo(d);
    if (Gu) {
      if (Vt = Cg(d), !S)
        return Ig(d, Vt);
    } else {
      var Er = _n(d), Ku = Er == f || Er == u;
      if (Pg(d))
        return bg(d, S);
      if (Er == b || Er == i || Ku && !Kt) {
        if (C(d))
          return Kt ? d : {};
        if (Vt = Bg(Ku ? {} : d), !S)
          return vg(d, hg(Vt, d));
      } else {
        if (!L[Er])
          return Kt ? d : {};
        Vt = Mg(d, Er, Po, S);
      }
    }
    ke || (ke = new mr());
    var Vu = ke.get(d);
    if (Vu)
      return Vu;
    if (ke.set(d, Vt), !Gu)
      var qu = v ? Lg(d) : jo(d);
    return ue(qu || d, function(Fo, Ks) {
      qu && (Ks = Fo, Fo = d[Ks]), Pu(Vt, Ks, Po(Fo, S, v, j, Ks, d, ke));
    }), Vt;
  }
  function dg(d) {
    return Gs(d) ? Np(d) : {};
  }
  function pg(d, S, v) {
    var j = S(d);
    return Oo(d) ? j : ns(j, v(d));
  }
  function gg(d) {
    return Fs.call(d);
  }
  function yg(d) {
    if (!Gs(d) || _g(d))
      return !1;
    var S = Ru(d) || C(d) ? _p : ht;
    return S.test(Tn(d));
  }
  function wg(d) {
    if (!ju(d))
      return Op(d);
    var S = [];
    for (var v in Object(d))
      qe.call(d, v) && v != "constructor" && S.push(v);
    return S;
  }
  function bg(d, S) {
    if (S)
      return d.slice();
    var v = new d.constructor(d.length);
    return d.copy(v), v;
  }
  function Do(d) {
    var S = new d.constructor(d.byteLength);
    return new _u(S).set(new _u(d)), S;
  }
  function xg(d, S) {
    var v = S ? Do(d.buffer) : d.buffer;
    return new d.constructor(v, d.byteOffset, d.byteLength);
  }
  function mg(d, S, v) {
    var j = S ? v(F(d), !0) : F(d);
    return br(j, rt, new d.constructor());
  }
  function Sg(d) {
    var S = new d.constructor(d.source, tt.exec(d));
    return S.lastIndex = d.lastIndex, S;
  }
  function Eg(d, S, v) {
    var j = S ? v(K(d), !0) : K(d);
    return br(j, Tt, new d.constructor());
  }
  function Ag(d) {
    return ku ? Object(ku.call(d)) : {};
  }
  function $g(d, S) {
    var v = S ? Do(d.buffer) : d.buffer;
    return new d.constructor(v, d.byteOffset, d.length);
  }
  function Ig(d, S) {
    var v = -1, j = d.length;
    for (S || (S = Array(j)); ++v < j; )
      S[v] = d[v];
    return S;
  }
  function Du(d, S, v, j) {
    v || (v = {});
    for (var Ut = -1, Kt = S.length; ++Ut < Kt; ) {
      var ke = S[Ut], Vt = void 0;
      Pu(v, ke, Vt === void 0 ? d[ke] : Vt);
    }
    return v;
  }
  function vg(d, S) {
    return Du(d, Ou(d), S);
  }
  function Lg(d) {
    return pg(d, jo, Ou);
  }
  function Rs(d, S) {
    var v = d.__data__;
    return Hg(S) ? v[typeof S == "string" ? "string" : "hash"] : v.map;
  }
  function Sr(d, S) {
    var v = Ho(d, S);
    return yg(v) ? v : void 0;
  }
  var Ou = Tu ? at(Tu, Object) : jg, _n = gg;
  (_o && _n(new _o(new ArrayBuffer(1))) != I || rs && _n(new rs()) != g || To && _n(To.resolve()) != x || No && _n(new No()) != U || ko && _n(new ko()) != $) && (_n = function(d) {
    var S = Fs.call(d), v = S == b ? d.constructor : void 0, j = v ? Tn(v) : void 0;
    if (j)
      switch (j) {
        case jp:
          return I;
        case Fp:
          return g;
        case zp:
          return x;
        case Rp:
          return U;
        case Gp:
          return $;
      }
    return S;
  });
  function Cg(d) {
    var S = d.length, v = d.constructor(S);
    return S && typeof d[0] == "string" && qe.call(d, "index") && (v.index = d.index, v.input = d.input), v;
  }
  function Bg(d) {
    return typeof d.constructor == "function" && !ju(d) ? dg(Tp(d)) : {};
  }
  function Mg(d, S, v, j) {
    var Ut = d.constructor;
    switch (S) {
      case p:
        return Do(d);
      case a:
      case c:
        return new Ut(+d);
      case I:
        return xg(d, j);
      case M:
      case B:
      case N:
      case y:
      case E:
      case T:
      case O:
      case R:
      case D:
        return $g(d, j);
      case g:
        return mg(d, j, v);
      case h:
      case _:
        return new Ut(d);
      case A:
        return Sg(d);
      case U:
        return Eg(d, j, v);
      case w:
        return Ag(d);
    }
  }
  function Ug(d, S) {
    return S = S ?? s, !!S && (typeof d == "number" || m.test(d)) && d > -1 && d % 1 == 0 && d < S;
  }
  function Hg(d) {
    var S = typeof d;
    return S == "string" || S == "number" || S == "symbol" || S == "boolean" ? d !== "__proto__" : d === null;
  }
  function _g(d) {
    return !!js && js in d;
  }
  function ju(d) {
    var S = d && d.constructor, v = typeof S == "function" && S.prototype || Dt;
    return d === v;
  }
  function Tn(d) {
    if (d != null) {
      try {
        return Un.call(d);
      } catch {
      }
      try {
        return d + "";
      } catch {
      }
    }
    return "";
  }
  function Tg(d) {
    return Po(d, !0, !0);
  }
  function Fu(d, S) {
    return d === S || d !== d && S !== S;
  }
  function Ng(d) {
    return kg(d) && qe.call(d, "callee") && (!kp.call(d, "callee") || Fs.call(d) == i);
  }
  var Oo = Array.isArray;
  function zu(d) {
    return d != null && Dg(d.length) && !Ru(d);
  }
  function kg(d) {
    return Og(d) && zu(d);
  }
  var Pg = Dp || Fg;
  function Ru(d) {
    var S = Gs(d) ? Fs.call(d) : "";
    return S == f || S == u;
  }
  function Dg(d) {
    return typeof d == "number" && d > -1 && d % 1 == 0 && d <= s;
  }
  function Gs(d) {
    var S = typeof d;
    return !!d && (S == "object" || S == "function");
  }
  function Og(d) {
    return !!d && typeof d == "object";
  }
  function jo(d) {
    return zu(d) ? fg(d) : wg(d);
  }
  function jg() {
    return [];
  }
  function Fg() {
    return !1;
  }
  t.exports = Tg;
})(Oi, Oi.exports);
var R2 = Oi.exports;
const Nd = /* @__PURE__ */ ch(R2);
var La;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(La || (La = {}));
function G2(t, e) {
  return { type: La.Address, version: t, hash160: e };
}
function K2(t) {
  return dr.c32address(t.version, t.hash160);
}
const V2 = (t) => y2(Ld(t)), q2 = (t) => G(V2(t));
$t.hmacSha256Sync = (t, ...e) => {
  const n = Id.create(Ld, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function W2(t, e = "mainnet") {
  e = Sd(e), t = typeof t == "string" ? ct(t) : t;
  const n = c2(je.P2PKH, e), r = G2(n, q2(t));
  return K2(r);
}
function Y2(t, e) {
  const n = _t.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = W2(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new _t.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function X2(t, e = null) {
  let n;
  e ? n = Y2(t, e) : n = _t.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Fl = "_blockstackDidCheckEchoReply", Z2 = "echoReply", Q2 = "authContinuation";
function J2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function tx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Fl];
  if (typeof e == "boolean")
    return e;
  const n = J2(t.location.search), r = n[Z2];
  if (r) {
    t[Fl] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Q2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Ca {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new bh();
    else
      throw new w1("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new El(e.sessionOptions) : this.store = new El() : e ? this.store = new Sl(e.sessionOptions) : this.store = new Sl();
  }
  makeAuthRequestToken(e, n, r, s, i, o = x1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new pa("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Ob(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Db();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = mc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (tx())
        return vr.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      vr.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = z1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Vs("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = _t.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Gb(e))
      throw new Vs("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Ro(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await xl(s, i.private_key);
          } catch {
            if (vr.warn("Failed decryption of appPrivateKey, will try to use as given"), !$t.isValidPrivateKey(i.private_key))
              throw new Vs("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await xl(s, c);
          } catch {
            vr.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Vs("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = U1, f;
    Ro(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), Ro(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: bd(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: l,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, g = i.profile_url;
    if (!u.profile && g) {
      const h = await n(g);
      if (!h.ok)
        u.profile = Object.assign({}, p1);
      else {
        const b = await h.text(), x = JSON.parse(b);
        u.profile = X2(x[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new pa("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Uw(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Hw(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Ca.prototype.makeAuthRequest = Ca.prototype.makeAuthRequestToken;
const ex = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], nx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ex(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!go(r.id));
  return e.concat(n);
}, go = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), kd = "STX_PROVIDER", Qn = () => typeof window > "u" ? null : window.localStorage.getItem(kd), rx = (t) => {
  typeof window < "u" && window.localStorage.setItem(kd, t);
}, sx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ix(t, e) {
  const n = {};
  return Object.assign(n, sx, e), await fetch(t, n);
}
function ox(t) {
  let e = ix, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ax(...t) {
  const { fetchLib: e, middlewares: n } = ox(t);
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
var Fr;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fr || (Fr = {}));
var Jn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Jn || (Jn = {}));
var zl;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(zl || (zl = {}));
const cx = "https://api.mainnet.hiro.so", ux = "https://api.testnet.hiro.so", lx = "http://localhost:3999", fx = ["mainnet", "testnet", "devnet", "mocknet"];
class tr {
  constructor(e) {
    this.version = Jn.Mainnet, this.chainId = Fr.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Jn.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ax();
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
tr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ba();
    case "testnet":
      return new Ma();
    case "devnet":
      return new hx();
    case "mocknet":
      return new Pd();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fx.join(", ")}`);
  }
};
tr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : tr.fromName(t);
class Ba extends tr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Jn.Mainnet, this.chainId = Fr.Mainnet;
  }
}
class Ma extends tr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Jn.Testnet, this.chainId = Fr.Testnet;
  }
}
class Pd extends tr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Jn.Testnet, this.chainId = Fr.Testnet;
  }
}
const hx = Pd;
var er;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(er || (er = {}));
var ji;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ji || (ji = {}));
er.Mainnet;
var nr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nr || (nr = {}));
var rr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(rr || (rr = {}));
nr.Mainnet;
const dx = {
  chainId: er.Mainnet,
  transactionVersion: nr.Mainnet,
  peerNetworkId: ji.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: rr.MainnetSingleSig,
    multiSig: rr.MainnetMultiSig
  },
  client: { baseUrl: gh }
}, Ua = {
  chainId: er.Testnet,
  transactionVersion: nr.Testnet,
  peerNetworkId: ji.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: rr.TestnetSingleSig,
    multiSig: rr.TestnetMultiSig
  },
  client: { baseUrl: yh }
}, Ai = {
  ...Ua,
  addressVersion: { ...Ua.addressVersion },
  magicBytes: "id",
  client: { baseUrl: wh }
}, px = {
  ...Ai,
  addressVersion: { ...Ai.addressVersion },
  client: { ...Ai.client }
};
function gx(t) {
  switch (t) {
    case "mainnet":
      return dx;
    case "testnet":
      return Ua;
    case "devnet":
      return Ai;
    case "mocknet":
      return px;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function yx(t) {
  return typeof t == "string" ? gx(t) : t;
}
function wx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Rl = /* @__PURE__ */ new Map();
function Dd(t, e) {
  const n = Rl.get(t);
  if (n !== void 0)
    return n(e);
  const r = wx(t);
  return Rl.set(t, r), Dd(t, e);
}
let yt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? ct(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return D1(this.readBytes(4), 0);
  }
  readUInt8() {
    return k1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return T1(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = G(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = G(n);
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
    if (Dd(e, r))
      return r;
    throw n(r);
  }
};
const bx = 128, xx = 128, Od = 16, Rn = 32, Ha = 80, yo = 65, mx = 32, Sx = 64, Fi = 34, Ex = 1 + 16 * 1024 * 1024, Ax = 165, $x = 16, Ix = 16, vx = 20, Lx = Ix + 2 + vx, Cx = Lx + 4, Bx = Ex + (Ax + $x * Cx);
var ft;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ft || (ft = {}));
var _a;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(_a || (_a = {}));
var Qt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Qt || (Qt = {}));
const Xo = ["onChainOnly", "offChainOnly", "any"];
Xo[0] + "", Qt.OnChainOnly, Xo[1] + "", Qt.OffChainOnly, Xo[2] + "", Qt.Any, Qt.OnChainOnly + "", Qt.OnChainOnly, Qt.OffChainOnly + "", Qt.OffChainOnly, Qt.Any + "", Qt.Any;
var zi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(zi || (zi = {}));
var wt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(wt || (wt = {}));
var Et;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Et || (Et = {}));
var pt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(pt || (pt = {}));
var mt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(mt || (mt = {}));
var ps;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ps || (ps = {}));
var Ta;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ta || (Ta = {}));
var Na;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Na || (Na = {}));
var Ft;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ft || (Ft = {}));
var Gl;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gl || (Gl = {}));
var ka;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ka || (ka = {}));
var de;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(de || (de = {}));
var Kl;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Kl || (Kl = {}));
let wo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Lr = class extends wo {
  constructor(e) {
    super(e);
  }
}, Ot = class extends wo {
  constructor(e) {
    super(e);
  }
}, Ri = class extends wo {
  constructor(e) {
    super(e);
  }
}, On = class extends wo {
  constructor(e) {
    super(e);
  }
};
function Pa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Mx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ux(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Pa(t.outputLen), Pa(t.blockLen);
}
function Hx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _x(t, e) {
  jd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const jn = {
  number: Pa,
  bool: Mx,
  bytes: jd,
  hash: Ux,
  exists: Hx,
  output: _x
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Zo = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ee = (t, e) => t << 32 - e | t >>> e, Tx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Tx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fc(t) {
  if (typeof t == "string" && (t = Nx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Fd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pr(t) {
  const e = (r) => t().update(Fc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let zd = class extends Fd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, jn.hash(e);
    const r = Fc(n);
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
    return jn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    jn.exists(this), jn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Rd = (t, e, n) => new zd(t, e).update(n).digest();
Rd.create = (t, e) => new zd(t, e);
function kx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let zc = class extends Fd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Zo(this.buffer);
  }
  update(e) {
    jn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Fc(e);
    const i = e.length;
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
    jn.exists(this), jn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    kx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Zo(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const Px = (t, e, n) => t & e ^ ~t & n, Dx = (t, e, n) => t & e ^ t & n ^ e & n, Ox = new Uint32Array([
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
]), on = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), an = new Uint32Array(64);
let Gd = class extends zc {
  constructor() {
    super(64, 32, 8, !1), this.A = on[0] | 0, this.B = on[1] | 0, this.C = on[2] | 0, this.D = on[3] | 0, this.E = on[4] | 0, this.F = on[5] | 0, this.G = on[6] | 0, this.H = on[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      an[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = an[u - 15], h = an[u - 2], b = Ee(g, 7) ^ Ee(g, 18) ^ g >>> 3, x = Ee(h, 17) ^ Ee(h, 19) ^ h >>> 10;
      an[u] = x + an[u - 7] + b + an[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = Ee(a, 6) ^ Ee(a, 11) ^ Ee(a, 25), h = f + g + Px(a, c, l) + Ox[u] + an[u] | 0, x = (Ee(r, 2) ^ Ee(r, 13) ^ Ee(r, 22)) + Dx(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    an.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, jx = class extends Gd {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Rc = pr(() => new Gd());
pr(() => new jx());
const Fx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Kd = Uint8Array.from({ length: 16 }, (t, e) => e), zx = Kd.map((t) => (9 * t + 5) % 16);
let Gc = [Kd], Kc = [zx];
for (let t = 0; t < 4; t++)
  for (let e of [Gc, Kc])
    e.push(e[t].map((n) => Fx[n]));
const Vd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Rx = Gc.map((t, e) => t.map((n) => Vd[e][n])), Gx = Kc.map((t, e) => t.map((n) => Vd[e][n])), Kx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ii = (t, e) => t << e | t >>> 32 - e;
function Vl(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oi = new Uint32Array(16);
let qx = class extends zc {
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
      oi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = Kx[h], A = Vx[h], U = Gc[h], _ = Kc[h], w = Rx[h], $ = Gx[h];
      for (let p = 0; p < 16; p++) {
        const I = ii(r + Vl(h, i, a, l) + oi[U[p]] + x, w[p]) + u | 0;
        r = u, u = l, l = ii(a, 10) | 0, a = i, i = I;
      }
      for (let p = 0; p < 16; p++) {
        const I = ii(s + Vl(b, o, c, f) + oi[_[p]] + A, $[p]) + g | 0;
        s = g, g = f, f = ii(c, 10) | 0, c = o, o = I;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Wx = pr(() => new qx()), ai = BigInt(2 ** 32 - 1), Da = BigInt(32);
function qd(t, e = !1) {
  return e ? { h: Number(t & ai), l: Number(t >> Da & ai) } : { h: Number(t >> Da & ai) | 0, l: Number(t & ai) | 0 };
}
function Yx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = qd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Xx = (t, e) => BigInt(t >>> 0) << Da | BigInt(e >>> 0), Zx = (t, e, n) => t >>> n, Qx = (t, e, n) => t << 32 - n | e >>> n, Jx = (t, e, n) => t >>> n | e << 32 - n, tm = (t, e, n) => t << 32 - n | e >>> n, em = (t, e, n) => t << 64 - n | e >>> n - 32, nm = (t, e, n) => t >>> n - 32 | e << 64 - n, rm = (t, e) => e, sm = (t, e) => t, im = (t, e, n) => t << n | e >>> 32 - n, om = (t, e, n) => e << n | t >>> 32 - n, am = (t, e, n) => e << n - 32 | t >>> 64 - n, cm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function um(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), dm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, pm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), gm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Y = {
  fromBig: qd,
  split: Yx,
  toBig: Xx,
  shrSH: Zx,
  shrSL: Qx,
  rotrSH: Jx,
  rotrSL: tm,
  rotrBH: em,
  rotrBL: nm,
  rotr32H: rm,
  rotr32L: sm,
  rotlSH: im,
  rotlSL: om,
  rotlBH: am,
  rotlBL: cm,
  add: um,
  add3L: lm,
  add3H: fm,
  add4L: hm,
  add4H: dm,
  add5H: gm,
  add5L: pm
}, [ym, wm] = Y.split([
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
].map((t) => BigInt(t))), cn = new Uint32Array(80), un = new Uint32Array(80);
let bo = class extends zc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: b, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      cn[w] = e.getUint32(n), un[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const $ = cn[w - 15] | 0, p = un[w - 15] | 0, I = Y.rotrSH($, p, 1) ^ Y.rotrSH($, p, 8) ^ Y.shrSH($, p, 7), M = Y.rotrSL($, p, 1) ^ Y.rotrSL($, p, 8) ^ Y.shrSL($, p, 7), B = cn[w - 2] | 0, N = un[w - 2] | 0, y = Y.rotrSH(B, N, 19) ^ Y.rotrBH(B, N, 61) ^ Y.shrSH(B, N, 6), E = Y.rotrSL(B, N, 19) ^ Y.rotrBL(B, N, 61) ^ Y.shrSL(B, N, 6), T = Y.add4L(M, E, un[w - 7], un[w - 16]), O = Y.add4H(T, I, y, cn[w - 7], cn[w - 16]);
      cn[w] = O | 0, un[w] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: b, Gh: x, Gl: A, Hh: U, Hl: _ } = this;
    for (let w = 0; w < 80; w++) {
      const $ = Y.rotrSH(u, g, 14) ^ Y.rotrSH(u, g, 18) ^ Y.rotrBH(u, g, 41), p = Y.rotrSL(u, g, 14) ^ Y.rotrSL(u, g, 18) ^ Y.rotrBL(u, g, 41), I = u & h ^ ~u & x, M = g & b ^ ~g & A, B = Y.add5L(_, p, M, wm[w], un[w]), N = Y.add5H(B, U, $, I, ym[w], cn[w]), y = B | 0, E = Y.rotrSH(r, s, 28) ^ Y.rotrBH(r, s, 34) ^ Y.rotrBH(r, s, 39), T = Y.rotrSL(r, s, 28) ^ Y.rotrBL(r, s, 34) ^ Y.rotrBL(r, s, 39), O = r & i ^ r & a ^ i & a, R = s & o ^ s & c ^ o & c;
      U = x | 0, _ = A | 0, x = h | 0, A = b | 0, h = u | 0, b = g | 0, { h: u, l: g } = Y.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const D = Y.add3L(y, T, R);
      r = Y.add3H(D, N, E, O), s = D | 0;
    }
    ({ h: r, l: s } = Y.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Y.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Y.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Y.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = Y.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: b } = Y.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: A } = Y.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: U, l: _ } = Y.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, b, x, A, U, _);
  }
  roundClean() {
    cn.fill(0), un.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, bm = class extends bo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xm = class extends bo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mm = class extends bo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
pr(() => new bo());
pr(() => new bm());
const Sm = pr(() => new xm());
pr(() => new mm());
var st;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(st || (st = {}));
var Bt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Bt || (Bt = {}));
function Vc(t) {
  return Bt[t];
}
const Em = () => ({ type: st.BoolTrue }), Am = () => ({ type: st.BoolFalse }), $m = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: st.Buffer, value: G(t) };
}, ql = BigInt("0xffffffffffffffffffffffffffffffff"), Im = BigInt(0), Wl = BigInt("0x7fffffffffffffffffffffffffffffff"), Yl = BigInt("-170141183460469231731687303715884105728"), vm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ya(ct(t))), Yt(t, Uint8Array) && (t = ya(t));
  const e = kt(t);
  if (e > Wl)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Wl}`);
  if (e < Yl)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Yl}`);
  return { type: st.Int, value: e };
}, Lm = (t) => {
  const e = kt(t);
  if (e < Im)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ql)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ql}`);
  return { type: st.UInt, value: e };
};
function Cm(t) {
  return { type: st.List, value: t };
}
function Wd() {
  return { type: st.OptionalNone };
}
function Yd(t) {
  return { type: st.OptionalSome, value: t };
}
var P;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(P || (P = {}));
function Bm() {
  return {
    type: P.Address,
    version: rr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Xl(t) {
  if (t && s0(t, Fi))
    throw new Error(`Memo exceeds maximum length of ${Fi} bytes`);
  return { type: P.MemoString, content: t };
}
function qc(t, e) {
  return {
    type: P.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Oa(t) {
  if (ct(t).byteLength != yo)
    throw Error("Invalid signature");
  return {
    type: P.MessageSignature,
    data: t
  };
}
function Mm(t, e, n) {
  return typeof t == "string" && (t = Vm(t)), typeof n == "string" && (n = Xl(n)), {
    type: P.Payload,
    payloadType: ft.TokenTransfer,
    recipient: t,
    amount: kt(e),
    memo: n ?? Xl("")
  };
}
function Um(t, e, n, r) {
  return typeof e == "string" && (e = we(e)), typeof n == "string" && (n = we(n)), {
    type: P.Payload,
    payloadType: ft.ContractCall,
    contractAddress: typeof t == "string" ? Mn(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Hm(t) {
  return we(t, 4, 1e5);
}
function Zl(t, e, n) {
  return typeof t == "string" && (t = we(t)), typeof e == "string" && (e = Hm(e)), typeof n == "number" ? {
    type: P.Payload,
    payloadType: ft.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: P.Payload,
    payloadType: ft.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function _m() {
  return { type: P.Payload, payloadType: ft.PoisonMicroblock };
}
function Ql(t, e) {
  if (t.byteLength != Rn)
    throw Error(`Coinbase buffer size must be ${Rn} bytes`);
  return e != null ? {
    type: P.Payload,
    payloadType: ft.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: P.Payload,
    payloadType: ft.Coinbase,
    coinbaseBytes: t
  };
}
function Tm(t, e, n) {
  if (t.byteLength != Rn)
    throw Error(`Coinbase buffer size must be ${Rn} bytes`);
  if (n.byteLength != Ha)
    throw Error(`VRF proof buffer size must be ${Ha} bytes`);
  return {
    type: P.Payload,
    payloadType: ft.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === st.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function Nm(t, e, n, r, s, i, o) {
  return {
    type: P.Payload,
    payloadType: ft.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function we(t, e, n) {
  const r = e || 1, s = n || bx;
  if (s0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: P.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function km(t, e, n) {
  return {
    type: P.Asset,
    address: Mn(t),
    contractName: we(e),
    assetName: we(n)
  };
}
function Mn(t) {
  const e = dr.c32addressDecode(t);
  return {
    type: P.Address,
    version: e[0],
    hash160: e[1]
  };
}
function Pm(t, e) {
  const n = Mn(t), r = we(e);
  return {
    type: P.Principal,
    prefix: Ft.Contract,
    address: n,
    contractName: r
  };
}
function Dm(t) {
  const e = Mn(t);
  return {
    type: P.Principal,
    prefix: Ft.Standard,
    address: e
  };
}
function Cr(t, e) {
  return {
    pubKeyEncoding: t,
    type: P.TransactionAuthField,
    contents: e
  };
}
function De(t) {
  switch (t.type) {
    case P.Address:
      return Ps(t);
    case P.Principal:
      return Xd(t);
    case P.LengthPrefixedString:
      return Rr(t);
    case P.MemoString:
      return jm(t);
    case P.Asset:
      return Qd(t);
    case P.PostCondition:
      return t0(t);
    case P.PublicKey:
      return za(t);
    case P.LengthPrefixedList:
      return Wc(t);
    case P.Payload:
      return e0(t);
    case P.TransactionAuthField:
      return Km(t);
    case P.MessageSignature:
      return Yc(t);
  }
}
function Ps(t) {
  const e = [];
  return e.push(ct(Us(t.version, 1))), e.push(ct(t.hash160)), vt(e);
}
function zr(t) {
  const e = Yt(t, yt) ? t : new yt(t), n = no(G(e.readBytes(1))), r = G(e.readBytes(20));
  return { type: P.Address, version: n, hash160: r };
}
function Xd(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ft.Standard || t.prefix === Ft.Contract) && e.push(Ps(t.address)), t.prefix === Ft.Contract && e.push(Rr(t.contractName)), vt(e);
}
function Om(t) {
  const e = Yt(t, yt) ? t : new yt(t), n = e.readUInt8Enum(Ft, (i) => {
    throw new Ot(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ft.Origin)
    return { type: P.Principal, prefix: n };
  const r = zr(e);
  if (n === Ft.Standard)
    return { type: P.Principal, prefix: n, address: r };
  const s = ae(e);
  return {
    type: P.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Rr(t) {
  const e = [], n = ur(t.content), r = n.byteLength;
  return e.push(ct(Us(r, t.lengthPrefixBytes))), e.push(n), vt(e);
}
function ae(t, e, n) {
  e = e || 1;
  const r = Yt(t, yt) ? t : new yt(t), s = no(G(r.readBytes(e))), i = Hs(r.readBytes(s));
  return we(i, e, n ?? 128);
}
function jm(t) {
  const e = [], n = ur(t.content), r = pS(G(n), Fi * 2);
  return e.push(ct(r)), vt(e);
}
function Zd(t) {
  const e = Yt(t, yt) ? t : new yt(t);
  let n = Hs(e.readBytes(Fi));
  return n = n.replace(/\u0000*$/, ""), { type: P.MemoString, content: n };
}
function Qd(t) {
  const e = [];
  return e.push(Ps(t.address)), e.push(Rr(t.contractName)), e.push(Rr(t.assetName)), vt(e);
}
function ja(t) {
  const e = Yt(t, yt) ? t : new yt(t);
  return {
    type: P.Asset,
    address: zr(e),
    contractName: ae(e),
    assetName: ae(e)
  };
}
function Wc(t) {
  const e = t.values, n = [];
  n.push(ct(Us(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(De(r));
  return vt(n);
}
function Jd(t, e, n) {
  const r = Yt(t, yt) ? t : new yt(t), s = no(G(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case P.Address:
        i.push(zr(r));
        break;
      case P.LengthPrefixedString:
        i.push(ae(r));
        break;
      case P.MemoString:
        i.push(Zd(r));
        break;
      case P.Asset:
        i.push(ja(r));
        break;
      case P.PostCondition:
        i.push(zm(r));
        break;
      case P.PublicKey:
        i.push(Ra(r));
        break;
      case P.TransactionAuthField:
        i.push(Gm(r));
        break;
    }
  return qc(i, n);
}
function Fm(t) {
  return G(t0(t));
}
function t0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Xd(t.principal)), (t.conditionType === wt.Fungible || t.conditionType === wt.NonFungible) && e.push(Qd(t.asset)), t.conditionType === wt.NonFungible && e.push(Ce(t.assetName)), e.push(t.conditionCode), t.conditionType === wt.STX || t.conditionType === wt.Fungible || t.conditionType === wt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Lr("The post-condition amount may not be larger than 8 bytes");
    e.push(Cn(t.amount, 8));
  }
  return vt(e);
}
function zm(t) {
  const e = Yt(t, yt) ? t : new yt(t), n = e.readUInt8Enum(wt, (a) => {
    throw new Ot(`Could not read ${a} as PostConditionType`);
  }), r = Om(e);
  let s, i, o;
  switch (n) {
    case wt.STX:
      return s = e.readUInt8Enum(ps, (c) => {
        throw new Ot(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${G(e.readBytes(8))}`), {
        type: P.PostCondition,
        conditionType: wt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case wt.Fungible:
      return i = ja(e), s = e.readUInt8Enum(ps, (c) => {
        throw new Ot(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${G(e.readBytes(8))}`), {
        type: P.PostCondition,
        conditionType: wt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case wt.NonFungible:
      i = ja(e);
      const a = ve(e);
      return s = e.readUInt8Enum(Ta, (c) => {
        throw new Ot(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: P.PostCondition,
        conditionType: wt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case wt.Staking:
      return s = e.readUInt8Enum(ps, (c) => {
        throw new Ot(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${G(e.readBytes(8))}`), {
        type: P.PostCondition,
        conditionType: wt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case wt.PoX: {
      const c = e.readUInt8Enum(Na, (l) => {
        throw new Ot(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: P.PostCondition,
        conditionType: wt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function e0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ft.TokenTransfer:
      e.push(Ce(t.recipient)), e.push(Cn(t.amount, 8)), e.push(De(t.memo));
      break;
    case ft.ContractCall:
      e.push(De(t.contractAddress)), e.push(De(t.contractName)), e.push(De(t.functionName));
      const n = new Uint8Array(4);
      qn(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ce(r));
      });
      break;
    case ft.SmartContract:
      e.push(De(t.contractName)), e.push(De(t.codeBody));
      break;
    case ft.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(De(t.contractName)), e.push(De(t.codeBody));
      break;
    case ft.PoisonMicroblock:
      break;
    case ft.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ft.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ce(t.recipient));
      break;
    case ft.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ce(t.recipient ? Yd(t.recipient) : Wd())), e.push(t.vrfProof);
      break;
    case ft.TenureChange:
      e.push(ct(t.tenureHash)), e.push(ct(t.previousTenureHash)), e.push(ct(t.burnViewHash)), e.push(ct(t.previousTenureEnd)), e.push(qn(new Uint8Array(4), t.previousTenureBlocks)), e.push(P1(new Uint8Array(1), t.cause)), e.push(ct(t.publicKeyHash));
      break;
  }
  return vt(e);
}
function Rm(t) {
  const e = Yt(t, yt) ? t : new yt(t);
  switch (e.readUInt8Enum(ft, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ft.TokenTransfer:
      const r = ve(e), s = kt(e.readBytes(8)), i = Zd(e);
      return Mm(r, s, i);
    case ft.ContractCall:
      const o = zr(e), a = ae(e), c = ae(e), l = [], f = e.readUInt32BE();
      for (let $ = 0; $ < f; $++) {
        const p = ve(e);
        l.push(p);
      }
      return Um(o, a, c, l);
    case ft.SmartContract:
      const u = ae(e), g = ae(e, 4, 1e5);
      return Zl(u, g);
    case ft.VersionedSmartContract: {
      const $ = e.readUInt8Enum(_a, (M) => {
        throw new Error(`Cannot recognize ClarityVersion: ${M}`);
      }), p = ae(e), I = ae(e, 4, Bx);
      return Zl(p, I, $);
    }
    case ft.PoisonMicroblock:
      return _m();
    case ft.Coinbase: {
      const $ = e.readBytes(Rn);
      return Ql($);
    }
    case ft.CoinbaseToAltRecipient: {
      const $ = e.readBytes(Rn), p = ve(e);
      return Ql($, p);
    }
    case ft.NakamotoCoinbase: {
      const $ = e.readBytes(Rn), p = ve(e), I = e.readBytes(Ha);
      return Tm($, p, I);
    }
    case ft.TenureChange:
      const h = G(e.readBytes(20)), b = G(e.readBytes(20)), x = G(e.readBytes(20)), A = G(e.readBytes(32)), U = e.readUInt32BE(), _ = e.readUInt8Enum(ka, ($) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${$}`);
      }), w = G(e.readBytes(20));
      return Nm(h, b, x, A, U, _, w);
  }
}
function Fa(t) {
  const e = Yt(t, yt) ? t : new yt(t);
  return Oa(G(e.readBytes(yo)));
}
function Gm(t) {
  const e = Yt(t, yt) ? t : new yt(t), n = e.readUInt8Enum(de, (r) => {
    throw new Ot(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case de.PublicKeyCompressed:
      return Cr(mt.Compressed, Ra(e));
    case de.PublicKeyUncompressed:
      return Cr(mt.Uncompressed, Zr(IS(Ra(e).data)));
    case de.SignatureCompressed:
      return Cr(mt.Compressed, Fa(e));
    case de.SignatureUncompressed:
      return Cr(mt.Uncompressed, Fa(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Yc(t) {
  return ct(t.data);
}
function Km(t) {
  const e = [];
  switch (t.contents.type) {
    case P.PublicKey:
      e.push(t.pubKeyEncoding === mt.Compressed ? de.PublicKeyCompressed : de.PublicKeyUncompressed), e.push(ct($S(t.contents.data)));
      break;
    case P.MessageSignature:
      e.push(t.pubKeyEncoding === mt.Compressed ? de.SignatureCompressed : de.SignatureUncompressed), e.push(Yc(t.contents));
      break;
  }
  return vt(e);
}
function za(t) {
  return t.data.slice();
}
function Ra(t) {
  const e = Yt(t, yt) ? t : new yt(t), n = e.readUInt8(), r = n === 4 ? Sx : mx;
  return Zr(vt([n, e.readBytes(r)]));
}
function Xc(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === pt.P2PKH || e === pt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === pt.P2WPKH || e === pt.P2WSH || e === pt.P2WSHNonSequential) && !r.map((s) => s.data).every(Qr))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case pt.P2PKH:
      return ci(t, gS(r[0].data));
    case pt.P2WPKH:
      return ci(t, yS(r[0].data));
    case pt.P2SH:
    case pt.P2SHNonSequential:
      return ci(t, wS(n, r.map(za)));
    case pt.P2WSH:
    case pt.P2WSHNonSequential:
      return ci(t, bS(n, r.map(za)));
  }
}
function ci(t, e) {
  return { type: P.Address, version: t, hash160: e };
}
function Zc(t) {
  return dr.c32address(t.version, t.hash160);
}
function Jl(t) {
  const [e, n, r] = t.split(/\.|::/);
  return km(e, n, r);
}
function cs(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Pm(e, n);
  } else
    return Dm(t);
}
function Vm(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Ym(e, n);
  } else
    return qm(t);
}
function qm(t) {
  const e = Mn(t);
  return { type: st.PrincipalStandard, value: Zc(e) };
}
function Wm(t) {
  return { type: st.PrincipalStandard, value: Zc(t) };
}
function Ym(t, e) {
  const n = Mn(t), r = we(e);
  return n0(n, r);
}
function n0(t, e) {
  if (ur(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: st.PrincipalContract,
    value: `${Zc(t)}.${e.content}`
  };
}
function Xm(t) {
  return { type: st.ResponseErr, value: t };
}
function Zm(t) {
  return { type: st.ResponseOk, value: t };
}
const Qm = (t) => ({ type: st.StringASCII, value: t }), Jm = (t) => ({ type: st.StringUTF8, value: t });
function tS(t) {
  for (const e in t)
    if (!xS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: st.Tuple, value: t };
}
function ve(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new yt(ct(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new yt(t) : e = t;
  switch (e.readUInt8Enum(Bt, (r) => {
    throw new Ot(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Bt.int:
      return vm(ya(e.readBytes(16)));
    case Bt.uint:
      return Lm(e.readBytes(16));
    case Bt.buffer:
      const r = e.readUInt32BE();
      return $m(e.readBytes(r));
    case Bt.true:
      return Em();
    case Bt.false:
      return Am();
    case Bt.address:
      const s = zr(e);
      return Wm(s);
    case Bt.contract:
      const i = zr(e), o = ae(e);
      return n0(i, o);
    case Bt.ok:
      return Zm(ve(e));
    case Bt.err:
      return Xm(ve(e));
    case Bt.none:
      return Wd();
    case Bt.some:
      return Yd(ve(e));
    case Bt.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(ve(e));
      return Cm(c);
    case Bt.tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const A = ae(e).content;
        if (A === void 0)
          throw new Ot('"content" is undefined');
        f[A] = ve(e);
      }
      return tS(f);
    case Bt.ascii:
      const u = e.readUInt32BE(), g = B1(e.readBytes(u));
      return Qm(g);
    case Bt.utf8:
      const h = e.readUInt32BE(), b = Hs(e.readBytes(h));
      return Jm(b);
    default:
      throw new Ot("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function He(t, e) {
  return vt([Vc(t), e]);
}
function eS(t) {
  return new Uint8Array([Vc(t.type)]);
}
function nS(t) {
  return t.type === st.OptionalNone ? new Uint8Array([Vc(t.type)]) : He(t.type, Ce(t.value));
}
function rS(t) {
  const e = new Uint8Array(4);
  return qn(e, Math.ceil(t.value.length / 2), 0), He(t.type, Me(e, ct(t.value)));
}
function sS(t) {
  const e = Sc($1(BigInt(t.value), BigInt(xx)), Od);
  return He(t.type, e);
}
function iS(t) {
  const e = Sc(BigInt(t.value), Od);
  return He(t.type, e);
}
function oS(t) {
  return He(t.type, Ps(Mn(t.value)));
}
function aS(t) {
  const [e, n] = mS(t.value);
  return He(t.type, Me(Ps(Mn(e)), Rr(we(n))));
}
function cS(t) {
  return He(t.type, Ce(t.value));
}
function uS(t) {
  const e = [], n = new Uint8Array(4);
  qn(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ce(r);
    e.push(s);
  }
  return He(t.type, vt(e));
}
function lS(t) {
  const e = [], n = new Uint8Array(4);
  qn(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = we(s);
    e.push(Rr(i));
    const o = Ce(t.value[s]);
    e.push(o);
  }
  return He(t.type, vt(e));
}
function r0(t, e) {
  const n = [], r = e == "ascii" ? C1(t.value) : ur(t.value), s = new Uint8Array(4);
  return qn(s, r.length, 0), n.push(s), n.push(r), He(t.type, vt(n));
}
function fS(t) {
  return r0(t, "ascii");
}
function hS(t) {
  return r0(t, "utf8");
}
function tf(t) {
  return G(Ce(t));
}
function Ce(t) {
  switch (t.type) {
    case st.BoolTrue:
    case st.BoolFalse:
      return eS(t);
    case st.OptionalNone:
    case st.OptionalSome:
      return nS(t);
    case st.Buffer:
      return rS(t);
    case st.UInt:
      return iS(t);
    case st.Int:
      return sS(t);
    case st.PrincipalStandard:
      return oS(t);
    case st.PrincipalContract:
      return aS(t);
    case st.ResponseOk:
    case st.ResponseErr:
      return cS(t);
    case st.List:
      return uS(t);
    case st.Tuple:
      return lS(t);
    case st.StringASCII:
      return fS(t);
    case st.StringUTF8:
      return hS(t);
    default:
      throw new Lr("Unable to serialize. Invalid Clarity Value.");
  }
}
const dS = (t) => t.length % 2 ? `0${t}` : t, pS = (t, e) => t.padEnd(e, "0"), s0 = (t, e) => t ? ur(t).length > e : !1;
function Ga(t) {
  return Nd(t);
}
const ms = (t) => Wx(Rc(t)), Qc = (t) => G(Sm(t)), gS = (t) => G(ms(t)), yS = (t) => {
  const e = ms(t), n = Me(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ms(n);
  return G(r);
}, wS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = vt(n), s = ms(r);
  return G(s);
}, bS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = vt(n), s = Rc(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = vt(i), a = ms(o);
  return G(a);
};
function xS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function mS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
$t.hmacSha256Sync = (t, ...e) => {
  const n = Rd.create(Rc, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Zr(t) {
  return t = typeof t == "string" ? ct(t) : t, {
    type: P.PublicKey,
    data: t
  };
}
function SS(t, e, n = mt.Compressed) {
  const r = _1(e), s = new ne(tl(r.r), tl(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === mt.Compressed;
  return i.toHex(o);
}
function ES(t) {
  return typeof t == "string" ? t : G(t);
}
const Jc = ES;
function i0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === H1;
}
function Qr(t) {
  return !Jc(t).startsWith("04");
}
function AS(t) {
  t = Ec(t);
  const e = i0(t);
  return G(_s(t.slice(0, 32), e));
}
function $S(t) {
  return J.fromHex(Jc(t)).toHex(!0);
}
function IS(t) {
  return J.fromHex(Jc(t)).toHex(!1);
}
function vS(t, e) {
  t = Ec(t);
  const [n, r] = so(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Us(r, 1) + ne.fromHex(n).toCompactHex();
}
function tu() {
  return {
    type: P.MessageSignature,
    data: G(new Uint8Array(yo))
  };
}
function o0(t, e, n, r) {
  const s = Xc(0, t, 1, [Zr(e)]).hash160, i = Qr(e) ? mt.Compressed : mt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: kt(n),
    fee: kt(r),
    keyEncoding: i,
    signature: tu()
  };
}
function Ss(t) {
  return "signature" in t;
}
function ef(t) {
  return t === pt.P2SH || t === pt.P2WSH;
}
function LS(t) {
  return t === pt.P2SHNonSequential || t === pt.P2WSHNonSequential;
}
function nf(t) {
  const e = Ga(t);
  return e.nonce = 0, e.fee = 0, Ss(e) ? e.signature = tu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function CS(t) {
  const e = [
    t.hashMode,
    ct(t.signer),
    Cn(t.nonce, 8),
    Cn(t.fee, 8),
    t.keyEncoding,
    Yc(t.signature)
  ];
  return vt(e);
}
function BS(t) {
  const e = [
    t.hashMode,
    ct(t.signer),
    Cn(t.nonce, 8),
    Cn(t.fee, 8)
  ], n = qc(t.fields);
  e.push(Wc(n));
  const r = new Uint8Array(2);
  return N1(r, t.signaturesRequired, 0), e.push(r), vt(e);
}
function MS(t, e) {
  const n = G(e.readBytes(20)), r = BigInt(`0x${G(e.readBytes(8))}`), s = BigInt(`0x${G(e.readBytes(8))}`), i = e.readUInt8Enum(mt, (a) => {
    throw new Ot(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === pt.P2WPKH && i != mt.Compressed)
    throw new Ot("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Fa(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function US(t, e) {
  const n = G(e.readBytes(20)), r = BigInt("0x" + G(e.readBytes(8))), s = BigInt("0x" + G(e.readBytes(8))), i = Jd(e, P.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case P.PublicKey:
        Qr(l.contents.data) || (o = !0);
        break;
      case P.MessageSignature:
        if (l.pubKeyEncoding === mt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new On("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === pt.P2WSH || t === pt.P2WSHNonSequential))
    throw new On("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Qo(t) {
  return Ss(t) ? CS(t) : BS(t);
}
function Jo(t) {
  const e = t.readUInt8Enum(pt, (n) => {
    throw new Ot(`Could not parse ${n} as AddressHashMode`);
  });
  return e === pt.P2PKH || e === pt.P2WPKH ? MS(e, t) : US(e, t);
}
function a0(t, e, n, r) {
  const i = t + G(new Uint8Array([e])) + G(Cn(n, 8)) + G(Cn(r, 8));
  if (ct(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Qc(ct(i));
}
function c0(t, e, n) {
  const r = 33 + yo, s = Qr(e.data) ? mt.Compressed : mt.Uncompressed, i = t + dS(s.toString(16)) + n, o = ct(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Qc(o);
}
function HS(t, e, n, r, s) {
  const i = a0(t, e, n, r), o = vS(s, i), a = Zr(AS(s)), c = c0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function u0(t, e, n, r, s, i) {
  const o = a0(t, e, n, r), a = Zr(SS(o, i, s)), c = c0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function _S() {
  const t = o0(pt.P2PKH, "", 0, 0);
  return t.signer = Bm().hash160, t.keyEncoding = mt.Compressed, t.signature = tu(), t;
}
function rf(t, e, n) {
  return Ss(t) ? TS(t, e, n) : NS(t, e, n);
}
function TS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = u0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Xc(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new On(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function NS(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case P.PublicKey:
        Qr(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case P.MessageSignature:
        c.pubKeyEncoding === mt.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = u0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (ef(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new On("Too many signatures");
        break;
    }
  if (ef(t.hashMode) && o !== t.signaturesRequired || LS(t.hashMode) && o < t.signaturesRequired)
    throw new On("Incorrect number of signatures");
  if (i && (t.hashMode === pt.P2WSH || t.hashMode === pt.P2WSHNonSequential))
    throw new On("Uncompressed keys are not allowed in this hash mode");
  const a = Xc(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new On(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function l0(t) {
  return {
    authType: Et.Standard,
    spendingCondition: t
  };
}
function f0(t, e) {
  return {
    authType: Et.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || o0(pt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function sf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Et.Standard:
        return l0(nf(t.spendingCondition));
      case Et.Sponsored:
        return f0(nf(t.spendingCondition), _S());
      default:
        throw new Ri("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function kS(t, e) {
  switch (t.authType) {
    case Et.Standard:
      return rf(t.spendingCondition, e, Et.Standard);
    case Et.Sponsored:
      return rf(t.spendingCondition, e, Et.Standard);
    default:
      throw new Ri("Invalid origin auth type");
  }
}
function PS(t, e) {
  switch (t.authType) {
    case Et.Standard:
      const n = {
        ...t.spendingCondition,
        fee: kt(e)
      };
      return { ...t, spendingCondition: n };
    case Et.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: kt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function DS(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: kt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function OS(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: kt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function jS(t, e) {
  const n = {
    ...e,
    nonce: kt(e.nonce),
    fee: kt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function FS(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Et.Standard:
      e.push(Qo(t.spendingCondition));
      break;
    case Et.Sponsored:
      e.push(Qo(t.spendingCondition)), e.push(Qo(t.sponsorSpendingCondition));
      break;
  }
  return vt(e);
}
function zS(t) {
  const e = t.readUInt8Enum(Et, (r) => {
    throw new Ot(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Et.Standard:
      return n = Jo(t), l0(n);
    case Et.Sponsored:
      n = Jo(t);
      const r = Jo(t);
      return f0(n, r);
  }
}
class RS {
  constructor({ auth: e, payload: n, postConditions: r = qc([]), postConditionMode: s = zi.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = yx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: kt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Qt.Any;
  }
  signBegin() {
    const e = Ga(this);
    return e.auth = sf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ga(this);
    return e.auth = sf(e.auth), e.txid();
  }
  verifyOrigin() {
    return kS(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Et.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Et.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Et.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Zr(e), r = this.auth.spendingCondition;
    if (r && !Ss(r)) {
      const s = Qr(n.data);
      r.fields.push(Cr(s ? mt.Compressed : mt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = HS(n, r, e.fee, e.nonce, s);
    if (Ss(e))
      e.signature = Oa(i);
    else {
      const a = i0(s);
      e.fields.push(Cr(a ? mt.Compressed : mt.Uncompressed, Oa(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Qc(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new Ri("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jS(this.auth, e);
  }
  setFee(e) {
    this.auth = PS(this.auth, e);
  }
  setNonce(e) {
    this.auth = DS(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Et.Sponsored)
      throw new Ri("Cannot sponsor sign a non-sponsored transaction");
    this.auth = OS(this.auth, e);
  }
  serialize() {
    return G(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Lr('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Lr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Lr('"auth" is undefined');
    if (this.payload === void 0)
      throw new Lr('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return qn(n, this.chainId, 0), e.push(n), e.push(FS(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Wc(this.postConditions)), e.push(e0(this.payload)), vt(e);
  }
}
function GS(t) {
  const e = Yt(t, yt) ? t : new yt(t), n = e.readUInt8Enum(nr, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = zS(e), i = e.readUInt8Enum(Qt, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(zi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Jd(e, P.PostCondition), c = Rm(e), l = new RS({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const of = BigInt("18446744073709551615");
function ta(t) {
  const e = kt(t);
  if (e < 0n || e > of)
    throw new RangeError(`Post-condition amount must be between 0 and ${of} (u64 max), received: ${e}`);
  return e;
}
var Ka;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Ka || (Ka = {}));
var Va;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Va || (Va = {}));
function KS(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: P.PostCondition,
        conditionType: wt.STX,
        principal: t.address === "origin" ? { type: P.Principal, prefix: Ft.Origin } : cs(t.address),
        conditionCode: ui(t.condition),
        amount: ta(t.amount)
      };
    case "ft-postcondition":
      return {
        type: P.PostCondition,
        conditionType: wt.Fungible,
        principal: t.address === "origin" ? { type: P.Principal, prefix: Ft.Origin } : cs(t.address),
        conditionCode: ui(t.condition),
        amount: ta(t.amount),
        asset: Jl(t.asset)
      };
    case "nft-postcondition":
      return {
        type: P.PostCondition,
        conditionType: wt.NonFungible,
        principal: t.address === "origin" ? { type: P.Principal, prefix: Ft.Origin } : cs(t.address),
        conditionCode: ui(t.condition),
        asset: Jl(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: P.PostCondition,
        conditionType: wt.Staking,
        principal: t.address === "origin" ? { type: P.Principal, prefix: Ft.Origin } : cs(t.address),
        conditionCode: ui(t.condition),
        amount: ta(t.amount)
      };
    case "pox-postcondition":
      return {
        type: P.PostCondition,
        conditionType: wt.PoX,
        principal: t.address === "origin" ? { type: P.Principal, prefix: Ft.Origin } : cs(t.address),
        conditionCode: VS(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ui(t) {
  return Ka[t];
}
function VS(t) {
  return Va[t];
}
function h0(t) {
  const e = KS(t);
  return Fm(e);
}
function qS(t, e, n) {
  return nu(d0(t), n);
}
function d0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Es(r);
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
    return BigInt(`0x${XS(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function eu(t, e = 8) {
  return (typeof t == "bigint" ? t : d0(t)).toString(16).padStart(e * 2, "0");
}
function nu(t, e = 16) {
  const n = eu(t, e);
  return Es(n);
}
function WS(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const YS = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function XS(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += YS[n];
  return e;
}
function Es(t) {
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
function ru(t) {
  return new TextEncoder().encode(t);
}
function ZS(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function QS(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function af(t) {
  if (t.some(QS))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function su(...t) {
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
function Ke(t) {
  return su(...t.map((e) => typeof e == "number" ? af([e]) : e instanceof Array ? af(e) : e));
}
function xo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var qa;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(qa || (qa = {}));
qa.Mainnet;
const JS = 128, t3 = 128, p0 = 16;
var Wa;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Wa || (Wa = {}));
var cf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(cf || (cf = {}));
var uf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(uf || (uf = {}));
var he;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(he || (he = {}));
const ea = ["onChainOnly", "offChainOnly", "any"];
ea[0] + "", he.OnChainOnly, ea[1] + "", he.OffChainOnly, ea[2] + "", he.Any, he.OnChainOnly + "", he.OnChainOnly, he.OffChainOnly + "", he.OffChainOnly, he.Any + "", he.Any;
var Ya;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ya || (Ya = {}));
Ya.Mainnet;
var lf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(lf || (lf = {}));
var Nn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Nn || (Nn = {}));
var ff;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ff || (ff = {}));
var hf;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(hf || (hf = {}));
var df;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(df || (df = {}));
var pf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pf || (pf = {}));
var gf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(gf || (gf = {}));
var yf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(yf || (yf = {}));
var Xa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Xa || (Xa = {}));
var wf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wf || (wf = {}));
var bf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(bf || (bf = {}));
function Za(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function e3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function g0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function n3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Za(t.outputLen), Za(t.blockLen);
}
function r3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function s3(t, e) {
  g0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const na = {
  number: Za,
  bool: e3,
  bytes: g0,
  hash: n3,
  exists: r3,
  output: s3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ra = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ae = (t, e) => t << 32 - e | t >>> e, i3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!i3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function o3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function y0(t) {
  if (typeof t == "string" && (t = o3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let a3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function gr(t) {
  const e = (r) => t().update(y0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function c3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let iu = class extends a3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ra(this.buffer);
  }
  update(e) {
    na.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = y0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ra(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    na.exists(this), na.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    c3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ra(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const u3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), w0 = Uint8Array.from({ length: 16 }, (t, e) => e), l3 = w0.map((t) => (9 * t + 5) % 16);
let ou = [w0], au = [l3];
for (let t = 0; t < 4; t++)
  for (let e of [ou, au])
    e.push(e[t].map((n) => u3[n]));
const b0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f3 = ou.map((t, e) => t.map((n) => b0[e][n])), h3 = au.map((t, e) => t.map((n) => b0[e][n])), d3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), li = (t, e) => t << e | t >>> 32 - e;
function xf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fi = new Uint32Array(16);
let g3 = class extends iu {
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
      fi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = d3[h], A = p3[h], U = ou[h], _ = au[h], w = f3[h], $ = h3[h];
      for (let p = 0; p < 16; p++) {
        const I = li(r + xf(h, i, a, l) + fi[U[p]] + x, w[p]) + u | 0;
        r = u, u = l, l = li(a, 10) | 0, a = i, i = I;
      }
      for (let p = 0; p < 16; p++) {
        const I = li(s + xf(b, o, c, f) + fi[_[p]] + A, $[p]) + g | 0;
        s = g, g = f, f = li(c, 10) | 0, c = o, o = I;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    fi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
gr(() => new g3());
const y3 = (t, e, n) => t & e ^ ~t & n, w3 = (t, e, n) => t & e ^ t & n ^ e & n, b3 = new Uint32Array([
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
]), ln = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fn = new Uint32Array(64);
let x0 = class extends iu {
  constructor() {
    super(64, 32, 8, !1), this.A = ln[0] | 0, this.B = ln[1] | 0, this.C = ln[2] | 0, this.D = ln[3] | 0, this.E = ln[4] | 0, this.F = ln[5] | 0, this.G = ln[6] | 0, this.H = ln[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      fn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = fn[u - 15], h = fn[u - 2], b = Ae(g, 7) ^ Ae(g, 18) ^ g >>> 3, x = Ae(h, 17) ^ Ae(h, 19) ^ h >>> 10;
      fn[u] = x + fn[u - 7] + b + fn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = Ae(a, 6) ^ Ae(a, 11) ^ Ae(a, 25), h = f + g + y3(a, c, l) + b3[u] + fn[u] | 0, x = (Ae(r, 2) ^ Ae(r, 13) ^ Ae(r, 22)) + w3(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    fn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, x3 = class extends x0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
gr(() => new x0());
gr(() => new x3());
const hi = BigInt(2 ** 32 - 1), Qa = BigInt(32);
function m0(t, e = !1) {
  return e ? { h: Number(t & hi), l: Number(t >> Qa & hi) } : { h: Number(t >> Qa & hi) | 0, l: Number(t & hi) | 0 };
}
function m3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = m0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const S3 = (t, e) => BigInt(t >>> 0) << Qa | BigInt(e >>> 0), E3 = (t, e, n) => t >>> n, A3 = (t, e, n) => t << 32 - n | e >>> n, $3 = (t, e, n) => t >>> n | e << 32 - n, I3 = (t, e, n) => t << 32 - n | e >>> n, v3 = (t, e, n) => t << 64 - n | e >>> n - 32, L3 = (t, e, n) => t >>> n - 32 | e << 64 - n, C3 = (t, e) => e, B3 = (t, e) => t, M3 = (t, e, n) => t << n | e >>> 32 - n, U3 = (t, e, n) => e << n | t >>> 32 - n, H3 = (t, e, n) => e << n - 32 | t >>> 64 - n, _3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function T3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const N3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), k3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, P3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), D3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, O3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), j3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, X = {
  fromBig: m0,
  split: m3,
  toBig: S3,
  shrSH: E3,
  shrSL: A3,
  rotrSH: $3,
  rotrSL: I3,
  rotrBH: v3,
  rotrBL: L3,
  rotr32H: C3,
  rotr32L: B3,
  rotlSH: M3,
  rotlSL: U3,
  rotlBH: H3,
  rotlBL: _3,
  add: T3,
  add3L: N3,
  add3H: k3,
  add4L: P3,
  add4H: D3,
  add5H: j3,
  add5L: O3
}, [F3, z3] = X.split([
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
].map((t) => BigInt(t))), hn = new Uint32Array(80), dn = new Uint32Array(80);
let mo = class extends iu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: b, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      hn[w] = e.getUint32(n), dn[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const $ = hn[w - 15] | 0, p = dn[w - 15] | 0, I = X.rotrSH($, p, 1) ^ X.rotrSH($, p, 8) ^ X.shrSH($, p, 7), M = X.rotrSL($, p, 1) ^ X.rotrSL($, p, 8) ^ X.shrSL($, p, 7), B = hn[w - 2] | 0, N = dn[w - 2] | 0, y = X.rotrSH(B, N, 19) ^ X.rotrBH(B, N, 61) ^ X.shrSH(B, N, 6), E = X.rotrSL(B, N, 19) ^ X.rotrBL(B, N, 61) ^ X.shrSL(B, N, 6), T = X.add4L(M, E, dn[w - 7], dn[w - 16]), O = X.add4H(T, I, y, hn[w - 7], hn[w - 16]);
      hn[w] = O | 0, dn[w] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: b, Gh: x, Gl: A, Hh: U, Hl: _ } = this;
    for (let w = 0; w < 80; w++) {
      const $ = X.rotrSH(u, g, 14) ^ X.rotrSH(u, g, 18) ^ X.rotrBH(u, g, 41), p = X.rotrSL(u, g, 14) ^ X.rotrSL(u, g, 18) ^ X.rotrBL(u, g, 41), I = u & h ^ ~u & x, M = g & b ^ ~g & A, B = X.add5L(_, p, M, z3[w], dn[w]), N = X.add5H(B, U, $, I, F3[w], hn[w]), y = B | 0, E = X.rotrSH(r, s, 28) ^ X.rotrBH(r, s, 34) ^ X.rotrBH(r, s, 39), T = X.rotrSL(r, s, 28) ^ X.rotrBL(r, s, 34) ^ X.rotrBL(r, s, 39), O = r & i ^ r & a ^ i & a, R = s & o ^ s & c ^ o & c;
      U = x | 0, _ = A | 0, x = h | 0, A = b | 0, h = u | 0, b = g | 0, { h: u, l: g } = X.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const D = X.add3L(y, T, R);
      r = X.add3H(D, N, E, O), s = D | 0;
    }
    ({ h: r, l: s } = X.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = X.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = X.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = X.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = X.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: b } = X.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: A } = X.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: U, l: _ } = X.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, b, x, A, U, _);
  }
  roundClean() {
    hn.fill(0), dn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, R3 = class extends mo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, G3 = class extends mo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K3 = class extends mo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
gr(() => new mo());
gr(() => new R3());
gr(() => new G3());
gr(() => new K3());
function V3(t, e, n) {
  const s = JS;
  if (c4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Wa.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Mt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Mt || (Mt = {}));
let q3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, S0 = class extends q3 {
  constructor(e) {
    super(e);
  }
};
function So(t) {
  const e = [];
  return e.push(Es(eu(t.version, 1))), e.push(Es(t.hash160)), Ke(e);
}
function W3(t) {
  const e = [];
  return e.push(t.prefix), e.push(So(t.address)), t.prefix === Xa.Contract && e.push(As(t.contractName)), Ke(e);
}
function As(t) {
  const e = [], n = ru(t.content), r = n.byteLength;
  return e.push(Es(eu(r, t.lengthPrefixBytes))), e.push(n), Ke(e);
}
function Y3(t) {
  const e = [];
  return e.push(So(t.address)), e.push(As(t.contractName)), e.push(As(t.assetName)), Ke(e);
}
function E0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(W3(t.principal)), (t.conditionType === Nn.Fungible || t.conditionType === Nn.NonFungible) && e.push(Y3(t.assetInfo)), t.conditionType === Nn.NonFungible && e.push(sr(t.assetName)), e.push(t.conditionCode), t.conditionType === Nn.STX || t.conditionType === Nn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new S0("The post-condition amount may not be larger than 8 bytes");
    e.push(qS(t.amount, !1, 8));
  }
  return Ke(e);
}
function _e(t, e) {
  return Ke([t, e]);
}
function X3(t) {
  return new Uint8Array([t.type]);
}
function Z3(t) {
  return t.type === Mt.OptionalNone ? new Uint8Array([t.type]) : _e(t.type, sr(t.value));
}
function Q3(t) {
  const e = new Uint8Array(4);
  return xo(e, t.buffer.length, 0), _e(t.type, su(e, t.buffer));
}
function J3(t) {
  const e = nu(WS(t.value, BigInt(t3)), p0);
  return _e(t.type, e);
}
function t4(t) {
  const e = nu(t.value, p0);
  return _e(t.type, e);
}
function e4(t) {
  return _e(t.type, So(t.address));
}
function n4(t) {
  return _e(t.type, su(So(t.address), As(t.contractName)));
}
function r4(t) {
  return _e(t.type, sr(t.value));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  xo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = sr(r);
    e.push(s);
  }
  return _e(t.type, Ke(e));
}
function i4(t) {
  const e = [], n = new Uint8Array(4);
  xo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = V3(s);
    e.push(As(i));
    const o = sr(t.data[s]);
    e.push(o);
  }
  return _e(t.type, Ke(e));
}
function A0(t, e) {
  const n = [], r = e == "ascii" ? ZS(t.data) : ru(t.data), s = new Uint8Array(4);
  return xo(s, r.length, 0), n.push(s), n.push(r), _e(t.type, Ke(n));
}
function o4(t) {
  return A0(t, "ascii");
}
function a4(t) {
  return A0(t, "utf8");
}
function sr(t) {
  switch (t.type) {
    case Mt.BoolTrue:
    case Mt.BoolFalse:
      return X3(t);
    case Mt.OptionalNone:
    case Mt.OptionalSome:
      return Z3(t);
    case Mt.Buffer:
      return Q3(t);
    case Mt.UInt:
      return t4(t);
    case Mt.Int:
      return J3(t);
    case Mt.PrincipalStandard:
      return e4(t);
    case Mt.PrincipalContract:
      return n4(t);
    case Mt.ResponseOk:
    case Mt.ResponseErr:
      return r4(t);
    case Mt.List:
      return s4(t);
    case Mt.Tuple:
      return i4(t);
    case Mt.StringASCII:
      return o4(t);
    case Mt.StringUTF8:
      return a4(t);
    default:
      throw new S0("Unable to serialize. Invalid Clarity Value.");
  }
}
const c4 = (t, e) => t ? ru(t).length > e : !1, u4 = "connect-ui";
let $i, $0, Jt = !1, Ja = !1;
const Ge = (t, e = "") => () => {
}, l4 = (t, e) => () => {
}, f4 = "{visibility:hidden}.hydrated{visibility:inherit}", mf = {}, h4 = "http://www.w3.org/2000/svg", d4 = "http://www.w3.org/1999/xhtml", p4 = (t) => t != null, cu = (t) => (t = typeof t, t === "object" || t === "function");
function I0(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const V = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let f = 0; f < l.length; f++)
      r = l[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !cu(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? tc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((f) => l[f]).join(" "));
  }
  const c = tc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, tc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, g4 = {}, y4 = (t) => t && t.$tag$ === g4, w4 = (t, e) => t != null && !cu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, b4 = (t) => Jr(t).$hostElement$, x4 = (t, e, n) => {
  const r = Nt.ce(e, n);
  return t.dispatchEvent(r), r;
}, Sf = /* @__PURE__ */ new WeakMap(), m4 = (t, e, n) => {
  let r = Gi.get(t);
  j4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Gi.set(t, r);
}, S4 = (t, e, n, r) => {
  var s;
  let i = v0(e);
  const o = Gi.get(i);
  if (t = t.nodeType === 11 ? t : Be, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Sf.get(t), c;
      if (a || Sf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Be.createElement("style"), c.innerHTML = o;
          const l = (s = Nt.$nonce$) !== null && s !== void 0 ? s : I0(Be);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, E4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ge("attachStyles", e.$tagName$), i = S4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, v0 = (t, e) => "sc-" + t.$tagName$, Ef = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = $f(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = Af(n), f = Af(r);
      c.remove(...l.filter((u) => u && !f.includes(u))), c.add(...f.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $f(Eo, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Nt.rel(t, e, n, !1), r && Nt.ael(t, e, r, !1);
    else {
      const c = cu(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const l = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != l) && (t[e] = l);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, A4 = /\s/, Af = (t) => t ? t.split(A4) : [], L0 = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || mf, o = e.$attrs$ || mf;
  for (r in i)
    r in o || Ef(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Ef(s, r, i[r], o[r], n, e.$flags$);
}, uu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Be.createTextNode(s.$text$);
  else {
    if (Jt || (Jt = s.$tag$ === "svg"), o = s.$elm$ = Be.createElementNS(Jt ? h4 : d4, s.$tag$), Jt && s.$tag$ === "foreignObject" && (Jt = !1), L0(null, s, Jt), p4($i) && o["s-si"] !== $i && o.classList.add(o["s-si"] = $i), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = uu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Jt = !1 : o.tagName === "foreignObject" && (Jt = !0);
  }
  return o;
}, C0 = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === $0 && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = uu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, B0 = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, $4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, f = r[0], u = r[l], g;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : u == null ? u = r[--l] : di(a, f) ? (us(a, f), a = e[++s], f = r[++i]) : di(c, u) ? (us(c, u), c = e[--o], u = r[--l]) : di(a, u) ? (us(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : di(c, f) ? (us(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = uu(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? C0(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && B0(e, s, o);
}, di = (t, e) => t.$tag$ === e.$tag$, us = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Jt = i === "svg" ? !0 : i === "foreignObject" ? !1 : Jt, L0(t, e, Jt), r !== null && s !== null ? $4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), C0(n, null, e, s, 0, s.length - 1)) : r !== null && B0(r, 0, r.length - 1), Jt && i === "svg" && (Jt = !1)) : t.$text$ !== o && (n.data = o);
}, I4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || tc(null, null), s = y4(e) ? e : V(null, null, e);
  $0 = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, $i = n["s-sc"], us(r, s);
}, M0 = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, lu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return M0(t, t.$ancestorComponent$), z4(() => v4(t, e));
}, v4 = (t, e) => {
  const n = Ge("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), M4(s, () => L4(t, r, e));
}, L4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Ge("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && E4(t);
  const o = Ge("render", t.$cmpMeta$.$tagName$);
  C4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => B4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, C4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, I4(t, e);
  } catch (r) {
    $s(r, t.$hostElement$);
  }
  return null;
}, B4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ge("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, H0(n), r(), t.$onReadyResolve$(n), s || U0()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && hu(() => lu(t, !1)), t.$flags$ &= -517;
}, U0 = (t) => {
  H0(Be.documentElement), hu(() => x4(Eo, "appload", { detail: { namespace: u4 } }));
}, M4 = (t, e) => t && t.then ? t.then(e) : e(), H0 = (t) => t.classList.add("hydrated"), U4 = (t, e) => Jr(t).$instanceValues$.get(e), H4 = (t, e, n, r) => {
  const s = Jr(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = w4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && lu(s, !1));
}, _0 = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return U4(this, i);
        },
        set(a) {
          H4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Nt.jmp(() => {
          const l = i.get(o);
          if (this.hasOwnProperty(l))
            c = this[l], delete this[l];
          else if (s.hasOwnProperty(l) && typeof this[l] == "number" && this[l] == c)
            return;
          this[l] = c === null && typeof this[l] == "boolean" ? !1 : c;
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
}, _4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = O4(n), s.then) {
        const c = l4();
        s = await s, c();
      }
      s.isProxied || (_0(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ge("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        $s(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = v0(n);
      if (!Gi.has(c)) {
        const l = Ge("registerStyles", n.$tagName$);
        m4(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => lu(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, T4 = (t) => {
  if (!(Nt.$flags$ & 1)) {
    const e = Jr(t), n = e.$cmpMeta$, r = Ge("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            M0(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), _4(t, e, n);
    }
    r();
  }
}, N4 = (t) => {
  Nt.$flags$ & 1 || Jr(t);
}, k4 = (t, e = {}) => {
  var n;
  const r = Ge(), s = [], i = e.exclude || [], o = Eo.customElements, a = Be.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ Be.createElement("style"), f = [];
  let u, g = !0;
  Object.assign(Nt, e), Nt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Be.baseURI).href, t.map((h) => {
    h[1].map((b) => {
      const x = {
        $flags$: b[0],
        $tagName$: b[1],
        $members$: b[2],
        $listeners$: b[3]
      };
      x.$members$ = b[2];
      const A = x.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, D4(_, x), x.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), g ? f.push(this) : Nt.jmp(() => T4(this));
        }
        disconnectedCallback() {
          Nt.jmp(() => N4(this));
        }
        componentOnReady() {
          return Jr(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = h[0], !i.includes(A) && !o.get(A) && (s.push(A), o.define(A, _0(
        U,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + f4, l.setAttribute("data-styles", "");
    const h = (n = Nt.$nonce$) !== null && n !== void 0 ? n : I0(Be);
    h != null && l.setAttribute("nonce", h), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Nt.jmp(() => u = setTimeout(U0, 30)), r();
}, fu = /* @__PURE__ */ new WeakMap(), Jr = (t) => fu.get(t), P4 = (t, e) => fu.set(e.$lazyInstance$ = t, e), D4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], fu.set(t, n);
}, $f = (t, e) => e in t, $s = (t, e) => (0, console.error)(t, e), sa = /* @__PURE__ */ new Map(), O4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = sa.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (sa.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => V6).then(o, $s);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (sa.set(s, o), o[r]), $s);
}, Gi = /* @__PURE__ */ new Map(), Eo = typeof window < "u" ? window : {}, Be = Eo.document || { head: {} }, Nt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, T0 = (t) => Promise.resolve(t), j4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), If = [], N0 = [], F4 = (t, e) => (n) => {
  t.push(n), Ja || (Ja = !0, Nt.$flags$ & 4 ? hu(ec) : Nt.raf(ec));
}, vf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      $s(n);
    }
  t.length = 0;
}, ec = () => {
  vf(If), vf(N0), (Ja = If.length > 0) && Nt.raf(ec);
}, hu = (t) => T0().then(t), z4 = /* @__PURE__ */ F4(N0), R4 = () => T0(), G4 = (t, e) => typeof window > "u" ? Promise.resolve() : R4().then(() => k4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var K4 = Object.defineProperty, V4 = Object.defineProperties, q4 = Object.getOwnPropertyDescriptors, Ki = Object.getOwnPropertySymbols, k0 = Object.prototype.hasOwnProperty, P0 = Object.prototype.propertyIsEnumerable, Lf = (t, e, n) => e in t ? K4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, se = (t, e) => {
  for (var n in e || (e = {})) k0.call(e, n) && Lf(t, n, e[n]);
  if (Ki) for (var n of Ki(e)) P0.call(e, n) && Lf(t, n, e[n]);
  return t;
}, be = (t, e) => V4(t, q4(e)), D0 = (t, e) => {
  var n = {};
  for (var r in t) k0.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ki) for (var r of Ki(t)) e.indexOf(r) < 0 && P0.call(t, r) && (n[r] = t[r]);
  return n;
};
function O0() {
  return go(Qn()) || window.StacksProvider || window.BlockstackProvider;
}
function Ao(t) {
  return t ? typeof t == "string" ? tr.fromName(t) : "version" in t ? t : "url" in t ? new Ba({ url: t.url }) : t.transactionVersion === nr.Mainnet ? new Ba({ url: t.client.baseUrl }) : new Ma({ url: t.client.baseUrl }) : new Ma();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var W4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(W4 || {}), Y4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Y4 || {}), du = (t) => {
  let e = t;
  if (!e) {
    let n = new bh(["store_write"], document.location.href);
    e = new Ca({ appConfig: n });
  }
  return e;
};
function j0(t) {
  try {
    return du(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var F0 = (t) => {
  let e = du(t).loadUserData().appPrivateKey, n = _t.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function X4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [er.Mainnet]: "mainnet", [er.Testnet]: "testnet" }, a = Ao(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Z4(t) {
  let e = Ao(t.network), n = du(t.userSession), r = be(se({}, t), { network: e, userSession: n });
  return se({ stxAddress: X4(r) }, r);
}
async function Q4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(h0) : n = n.map((r) => G(E0(r)))), new _t.TokenSigner("ES256k", e).signAsync(be(se({}, t), { postConditions: n }));
}
function J4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(h0) : e = e.map((n) => G(E0(n)))), _t.createUnsecuredToken(be(se({}, t), { postConditions: e }));
}
var tE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = ct(a.replace(/^0x/, "")), l = GS(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, be(se({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, be(se({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, eE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = D0(e, ["amount", "appDetails", "userSession"]);
  if (j0(s)) {
    let { privateKey: a, publicKey: c } = F0(s), l = be(se({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), Q4(l, a);
  }
  let o = be(se({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), J4(o);
};
async function nE(t, e, n) {
  let r = await e(be(se(se({}, Z4(t)), t), { network: Ao(t.network) }));
  return tE({ token: r, options: t }, n);
}
function rE(t, e = O0()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return nE(t, eE, e);
}
function z0(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? be(se({}, t), { message: tf(e), domain: tf(n) }) : be(se({}, t), { message: G(sr(e)), domain: G(sr(n)) });
}
async function sE(t, e) {
  return new _t.TokenSigner("ES256k", e).signAsync(z0(t));
}
async function iE(t) {
  let e = t, { userSession: n } = e, r = D0(e, ["userSession"]);
  if (j0(n)) {
    let { privateKey: s, publicKey: i } = F0(n), o = be(se({}, r), { publicKey: i });
    return sE(o, s);
  }
  return _t.createUnsecuredToken(z0(t));
}
var oE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(oE || {}), R0 = "asigna-stx", Cf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === R0 && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(cE(t, e), "*");
}), aE = { authenticationRequest: async (t) => Cf(t, "authenticationRequest"), transactionRequest: async (t) => Cf(t, "transactionRequest") }, cE = (t, e) => ({ source: R0, [e]: t }), uE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = aE);
};
uE();
var lE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function fE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Qn(), o = O0();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    G4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : lE, c = nx(a), l = document.createElement("connect-modal");
    l.defaultProviders = a, l.installedProviders = c, l.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let u = () => {
      l.remove(), document.body.style.overflow = f;
    };
    l.callback = (h) => {
      u(), t(n, h);
    }, l.cancelCallback = () => {
      var h;
      u(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(l);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), l.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var pi = fE(rE);
function Bn(t, e, n) {
  return pu(Rt(t, e), n);
}
function Rt(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = xt(r);
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
      const r = pE(BigInt(`0x${nt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${nt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Bf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ds(t, e = 8) {
  return (typeof t == "bigint" ? t : Rt(t, !1)).toString(16).padStart(e * 2, "0");
}
function $o(t) {
  return parseInt(t, 16);
}
function pu(t, e = 16) {
  const n = Ds(t, e);
  return xt(n);
}
function hE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function dE(t, e) {
  return t & BigInt(1) << e;
}
function pE(t, e) {
  return dE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const gE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += gE[n];
  return e;
}
function xt(t) {
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
function ts(t) {
  return new TextEncoder().encode(t);
}
function gu(t) {
  return new TextDecoder().decode(t);
}
function G0(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function yE(t) {
  return String.fromCharCode.apply(null, t);
}
function wE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Mf(t) {
  if (t.some(wE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Io(...t) {
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
function Lt(t) {
  return Io(...t.map((e) => typeof e == "number" ? Mf([e]) : e instanceof Array ? Mf(e) : e));
}
var Uf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Uf || (Uf = {}));
var Hf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Hf || (Hf = {}));
var _f;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_f || (_f = {}));
const K0 = 33, ia = 32;
function bE(t) {
  if (t.length < ia * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ia * 2), r = t.slice(2 + ia * 2);
  return {
    recoveryId: $o(e),
    r: n,
    s: r
  };
}
function xE(t) {
  const e = typeof t == "string" ? xt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function mE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function SE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function EE(t, e) {
  return t[e];
}
function AE(t, e, n = 0) {
  return t[n] = e, t;
}
function $E(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ir(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var nc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(nc || (nc = {}));
const IE = nc.Mainnet, vE = 128, LE = 128, V0 = 16, Gn = 32, rc = 80, vo = 65, CE = 32, BE = 64, Vi = 34;
var z;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(z || (z = {}));
var Q;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Q || (Q = {}));
var sc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(sc || (sc = {}));
var qt;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(qt || (qt = {}));
const Ii = ["onChainOnly", "offChainOnly", "any"], Tf = {
  [Ii[0]]: qt.OnChainOnly,
  [Ii[1]]: qt.OffChainOnly,
  [Ii[2]]: qt.Any,
  [qt.OnChainOnly]: qt.OnChainOnly,
  [qt.OffChainOnly]: qt.OffChainOnly,
  [qt.Any]: qt.Any
};
function ME(t) {
  if (t in Tf)
    return Tf[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ii.join(", ")}`);
}
var qi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qi || (qi = {}));
qi.Mainnet;
var Is;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Is || (Is = {}));
var Wt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Wt || (Wt = {}));
var At;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(At || (At = {}));
var gt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(gt || (gt = {}));
var Wi;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Wi || (Wi = {}));
var St;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(St || (St = {}));
var vs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(vs || (vs = {}));
var ic;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ic || (ic = {}));
var Ls;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ls || (Ls = {}));
var Nf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Nf || (Nf = {}));
var kf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(kf || (kf = {}));
function oc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function UE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function q0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function HE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  oc(t.outputLen), oc(t.blockLen);
}
function _E(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function TE(t, e) {
  q0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Fn = {
  number: oc,
  bool: UE,
  bytes: q0,
  hash: HE,
  exists: _E,
  output: TE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const oa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $e = (t, e) => t << 32 - e | t >>> e, NE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!NE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function yu(t) {
  if (typeof t == "string" && (t = kE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class W0 {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function yr(t) {
  const e = (r) => t().update(yu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function PE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class wu extends W0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    Fn.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = yu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = oa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Fn.exists(this), Fn.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    PE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = oa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, f = this.get();
    if (l > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, f[u], i);
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
const DE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Y0 = Uint8Array.from({ length: 16 }, (t, e) => e), OE = Y0.map((t) => (9 * t + 5) % 16);
let bu = [Y0], xu = [OE];
for (let t = 0; t < 4; t++)
  for (let e of [bu, xu])
    e.push(e[t].map((n) => DE[n]));
const X0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jE = bu.map((t, e) => t.map((n) => X0[e][n])), FE = xu.map((t, e) => t.map((n) => X0[e][n])), zE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), RE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), gi = (t, e) => t << e | t >>> 32 - e;
function Pf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const yi = new Uint32Array(16);
class GE extends wu {
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
      yi[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, f = l, u = this.h4 | 0, g = u;
    for (let h = 0; h < 5; h++) {
      const b = 4 - h, x = zE[h], A = RE[h], U = bu[h], _ = xu[h], w = jE[h], $ = FE[h];
      for (let p = 0; p < 16; p++) {
        const I = gi(r + Pf(h, i, a, l) + yi[U[p]] + x, w[p]) + u | 0;
        r = u, u = l, l = gi(a, 10) | 0, a = i, i = I;
      }
      for (let p = 0; p < 16; p++) {
        const I = gi(s + Pf(b, o, c, f) + yi[_[p]] + A, $[p]) + g | 0;
        s = g, g = f, f = gi(c, 10) | 0, c = o, o = I;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + l + g | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    yi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const KE = yr(() => new GE()), VE = (t, e, n) => t & e ^ ~t & n, qE = (t, e, n) => t & e ^ t & n ^ e & n, WE = new Uint32Array([
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
]), pn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gn = new Uint32Array(64);
class Z0 extends wu {
  constructor() {
    super(64, 32, 8, !1), this.A = pn[0] | 0, this.B = pn[1] | 0, this.C = pn[2] | 0, this.D = pn[3] | 0, this.E = pn[4] | 0, this.F = pn[5] | 0, this.G = pn[6] | 0, this.H = pn[7] | 0;
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
    for (let u = 0; u < 16; u++, n += 4)
      gn[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const g = gn[u - 15], h = gn[u - 2], b = $e(g, 7) ^ $e(g, 18) ^ g >>> 3, x = $e(h, 17) ^ $e(h, 19) ^ h >>> 10;
      gn[u] = x + gn[u - 7] + b + gn[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: f } = this;
    for (let u = 0; u < 64; u++) {
      const g = $e(a, 6) ^ $e(a, 11) ^ $e(a, 25), h = f + g + VE(a, c, l) + WE[u] + gn[u] | 0, x = ($e(r, 2) ^ $e(r, 13) ^ $e(r, 22)) + qE(r, s, i) | 0;
      f = l, l = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, l, f);
  }
  roundClean() {
    gn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class YE extends Z0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const mu = yr(() => new Z0());
yr(() => new YE());
const wi = BigInt(2 ** 32 - 1), ac = BigInt(32);
function Q0(t, e = !1) {
  return e ? { h: Number(t & wi), l: Number(t >> ac & wi) } : { h: Number(t >> ac & wi) | 0, l: Number(t & wi) | 0 };
}
function XE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Q0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const ZE = (t, e) => BigInt(t >>> 0) << ac | BigInt(e >>> 0), QE = (t, e, n) => t >>> n, JE = (t, e, n) => t << 32 - n | e >>> n, t8 = (t, e, n) => t >>> n | e << 32 - n, e8 = (t, e, n) => t << 32 - n | e >>> n, n8 = (t, e, n) => t << 64 - n | e >>> n - 32, r8 = (t, e, n) => t >>> n - 32 | e << 64 - n, s8 = (t, e) => e, i8 = (t, e) => t, o8 = (t, e, n) => t << n | e >>> 32 - n, a8 = (t, e, n) => e << n | t >>> 32 - n, c8 = (t, e, n) => e << n - 32 | t >>> 64 - n, u8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const f8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), h8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, d8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), p8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, g8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), y8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Z = {
  fromBig: Q0,
  split: XE,
  toBig: ZE,
  shrSH: QE,
  shrSL: JE,
  rotrSH: t8,
  rotrSL: e8,
  rotrBH: n8,
  rotrBL: r8,
  rotr32H: s8,
  rotr32L: i8,
  rotlSH: o8,
  rotlSL: a8,
  rotlBH: c8,
  rotlBL: u8,
  add: l8,
  add3L: f8,
  add3H: h8,
  add4L: d8,
  add4H: p8,
  add5H: y8,
  add5L: g8
}, [w8, b8] = Z.split([
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
].map((t) => BigInt(t))), yn = new Uint32Array(80), wn = new Uint32Array(80);
class Lo extends wu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: f, Fh: u, Fl: g, Gh: h, Gl: b, Hh: x, Hl: A } = this;
    return [e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, f, u, g, h, b, x, A) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = f | 0, this.Fh = u | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = b | 0, this.Hh = x | 0, this.Hl = A | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      yn[w] = e.getUint32(n), wn[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const $ = yn[w - 15] | 0, p = wn[w - 15] | 0, I = Z.rotrSH($, p, 1) ^ Z.rotrSH($, p, 8) ^ Z.shrSH($, p, 7), M = Z.rotrSL($, p, 1) ^ Z.rotrSL($, p, 8) ^ Z.shrSL($, p, 7), B = yn[w - 2] | 0, N = wn[w - 2] | 0, y = Z.rotrSH(B, N, 19) ^ Z.rotrBH(B, N, 61) ^ Z.shrSH(B, N, 6), E = Z.rotrSL(B, N, 19) ^ Z.rotrBL(B, N, 61) ^ Z.shrSL(B, N, 6), T = Z.add4L(M, E, wn[w - 7], wn[w - 16]), O = Z.add4H(T, I, y, yn[w - 7], yn[w - 16]);
      yn[w] = O | 0, wn[w] = T | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: f, Eh: u, El: g, Fh: h, Fl: b, Gh: x, Gl: A, Hh: U, Hl: _ } = this;
    for (let w = 0; w < 80; w++) {
      const $ = Z.rotrSH(u, g, 14) ^ Z.rotrSH(u, g, 18) ^ Z.rotrBH(u, g, 41), p = Z.rotrSL(u, g, 14) ^ Z.rotrSL(u, g, 18) ^ Z.rotrBL(u, g, 41), I = u & h ^ ~u & x, M = g & b ^ ~g & A, B = Z.add5L(_, p, M, b8[w], wn[w]), N = Z.add5H(B, U, $, I, w8[w], yn[w]), y = B | 0, E = Z.rotrSH(r, s, 28) ^ Z.rotrBH(r, s, 34) ^ Z.rotrBH(r, s, 39), T = Z.rotrSL(r, s, 28) ^ Z.rotrBL(r, s, 34) ^ Z.rotrBL(r, s, 39), O = r & i ^ r & a ^ i & a, R = s & o ^ s & c ^ o & c;
      U = x | 0, _ = A | 0, x = h | 0, A = b | 0, h = u | 0, b = g | 0, { h: u, l: g } = Z.add(l | 0, f | 0, N | 0, y | 0), l = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const D = Z.add3L(y, T, R);
      r = Z.add3H(D, N, E, O), s = D | 0;
    }
    ({ h: r, l: s } = Z.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Z.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Z.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: f } = Z.add(this.Dh | 0, this.Dl | 0, l | 0, f | 0), { h: u, l: g } = Z.add(this.Eh | 0, this.El | 0, u | 0, g | 0), { h, l: b } = Z.add(this.Fh | 0, this.Fl | 0, h | 0, b | 0), { h: x, l: A } = Z.add(this.Gh | 0, this.Gl | 0, x | 0, A | 0), { h: U, l: _ } = Z.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, i, o, a, c, l, f, u, g, h, b, x, A, U, _);
  }
  roundClean() {
    yn.fill(0), wn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class x8 extends Lo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class m8 extends Lo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class S8 extends Lo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
yr(() => new Lo());
yr(() => new x8());
const E8 = yr(() => new m8());
yr(() => new S8());
function J0(t) {
  if (xt(t).byteLength != vo)
    throw Error("Invalid signature");
  return {
    type: z.MessageSignature,
    data: t
  };
}
function ls(t, e) {
  return { type: z.Address, version: t, hash160: e };
}
function gs(t) {
  return dr.c32address(t.version, t.hash160);
}
function or(t, e, n) {
  const r = e || 1, s = n || vE;
  if (dp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: z.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Su(t) {
  const e = dr.c32addressDecode(t);
  return {
    type: z.Address,
    version: e[0],
    hash160: e[1]
  };
}
var H;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(H || (H = {}));
function A8(t) {
  if (t.type === H.PrincipalStandard)
    return gs(t.address);
  if (t.type === H.PrincipalContract)
    return `${gs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function $8(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return L8(e, n);
  } else
    return I8(t);
}
function I8(t) {
  const e = Su(t);
  return { type: H.PrincipalStandard, address: e };
}
function v8(t) {
  return { type: H.PrincipalStandard, address: t };
}
function L8(t, e) {
  const n = Su(t), r = or(e);
  return tp(n, r);
}
function tp(t, e) {
  if (ts(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: H.PrincipalContract, address: t, contractName: e };
}
function aa(t, e = !1) {
  switch (t.type) {
    case H.BoolTrue:
      return !0;
    case H.BoolFalse:
      return !1;
    case H.Int:
    case H.UInt:
      return e ? t.value.toString() : t.value;
    case H.Buffer:
      return `0x${nt(t.buffer)}`;
    case H.OptionalNone:
      return null;
    case H.OptionalSome:
      return En(t.value);
    case H.ResponseErr:
      return En(t.value);
    case H.ResponseOk:
      return En(t.value);
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return A8(t);
    case H.List:
      return t.list.map((r) => En(r));
    case H.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = En(t.data[r]);
      }), n;
    case H.StringASCII:
      return t.data;
    case H.StringUTF8:
      return t.data;
  }
}
function En(t) {
  switch (t.type) {
    case H.ResponseErr:
      return { type: An(t), value: aa(t, !0), success: !1 };
    case H.ResponseOk:
      return { type: An(t), value: aa(t, !0), success: !0 };
    default:
      return { type: An(t), value: aa(t, !0) };
  }
}
function An(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return "bool";
    case H.Int:
      return "int";
    case H.UInt:
      return "uint";
    case H.Buffer:
      return `(buff ${t.buffer.length})`;
    case H.OptionalNone:
      return "(optional none)";
    case H.OptionalSome:
      return `(optional ${An(t.value)})`;
    case H.ResponseErr:
      return `(response UnknownType ${An(t.value)})`;
    case H.ResponseOk:
      return `(response ${An(t.value)} UnknownType)`;
    case H.PrincipalStandard:
    case H.PrincipalContract:
      return "principal";
    case H.List:
      return `(list ${t.list.length} ${t.list.length ? An(t.list[0]) : "UnknownType"})`;
    case H.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${An(t.data[e])})`).join(" ")})`;
    case H.StringASCII:
      return `(string-ascii ${G0(t.data).length})`;
    case H.StringUTF8:
      return `(string-utf8 ${ts(t.data).length})`;
  }
}
const C8 = () => ({ type: H.BoolTrue }), B8 = () => ({ type: H.BoolFalse }), Df = BigInt("0xffffffffffffffffffffffffffffffff"), M8 = BigInt(0), Of = BigInt("0x7fffffffffffffffffffffffffffffff"), jf = BigInt("-170141183460469231731687303715884105728"), U8 = (t) => {
  const e = Rt(t, !0);
  if (e > Of)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Of}`);
  if (e < jf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${jf}`);
  return { type: H.Int, value: e };
}, Yi = (t) => {
  const e = Rt(t, !1);
  if (e < M8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Df)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Df}`);
  return { type: H.UInt, value: e };
}, ep = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: H.Buffer, buffer: t };
};
function np() {
  return { type: H.OptionalNone };
}
function rp(t) {
  return { type: H.OptionalSome, value: t };
}
function H8(t) {
  return { type: H.ResponseErr, value: t };
}
function _8(t) {
  return { type: H.ResponseOk, value: t };
}
function T8(t) {
  return { type: H.List, list: t };
}
function cc(t) {
  for (const e in t)
    if (!AA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: H.Tuple, data: t };
}
const Ir = (t) => ({ type: H.StringASCII, data: t }), N8 = (t) => ({ type: H.StringUTF8, data: t });
class sp extends W0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Fn.hash(e);
    const r = yu(n);
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
    return Fn.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Fn.exists(this), Fn.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ip = (t, e, n) => new sp(t, e).update(n).digest();
ip.create = (t, e) => new sp(t, e);
$t.hmacSha256Sync = (t, ...e) => {
  const n = ip.create(mu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Gr(t) {
  return {
    type: z.PublicKey,
    data: xt(t)
  };
}
function k8(t, e, n = St.Compressed) {
  const r = bE(e.data), s = new ne(Bf(r.r), Bf(r.s)), i = J.fromSignature(t, s, r.recoveryId), o = n === St.Compressed;
  return i.toHex(o);
}
function P8(t) {
  return { type: z.PublicKey, data: t };
}
function es(t) {
  return !nt(t.data).startsWith("04");
}
function Xi(t) {
  return t.data.slice();
}
function D8(t) {
  const e = F8(t), n = _s(e.data.slice(0, 32), e.compressed);
  return Gr(nt(n));
}
function O8(t) {
  const e = typeof t == "string" ? t : nt(t), n = J.fromHex(e).toHex(!0);
  return Gr(n);
}
function j8(t) {
  const e = typeof t == "string" ? t : nt(t), n = J.fromHex(e).toHex(!1);
  return Gr(n);
}
function uc(t) {
  const e = t.readUInt8(), n = e === 4 ? BE : CE;
  return P8(Lt([e, t.readBytes(n)]));
}
function F8(t) {
  const e = xE(t), n = e.length == K0;
  return { data: e, compressed: n };
}
function z8(t, e) {
  const [n, r] = so(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ds(r, 1) + ne.fromHex(n).toCompactHex();
  return J0(i);
}
function R8(t) {
  return D8(t.data);
}
function G8(t, e, n) {
  return typeof t == "string" && (t = $8(t)), typeof n == "string" && (n = Rf(n)), {
    type: z.Payload,
    payloadType: Q.TokenTransfer,
    recipient: t,
    amount: Rt(e, !1),
    memo: n ?? Rf("")
  };
}
function K8(t, e, n, r) {
  return typeof t == "string" && (t = Su(t)), typeof e == "string" && (e = or(e)), typeof n == "string" && (n = or(n)), {
    type: z.Payload,
    payloadType: Q.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Ff(t, e, n) {
  return typeof t == "string" && (t = or(t)), typeof e == "string" && (e = tA(e)), typeof n == "number" ? {
    type: z.Payload,
    payloadType: Q.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: z.Payload,
    payloadType: Q.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function V8() {
  return { type: z.Payload, payloadType: Q.PoisonMicroblock };
}
function zf(t, e) {
  if (t.byteLength != Gn)
    throw Error(`Coinbase buffer size must be ${Gn} bytes`);
  return e != null ? {
    type: z.Payload,
    payloadType: Q.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: z.Payload,
    payloadType: Q.Coinbase,
    coinbaseBytes: t
  };
}
function q8(t, e, n) {
  if (t.byteLength != Gn)
    throw Error(`Coinbase buffer size must be ${Gn} bytes`);
  if (n.byteLength != rc)
    throw Error(`VRF proof buffer size must be ${rc} bytes`);
  return {
    type: z.Payload,
    payloadType: Q.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === H.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var lc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(lc || (lc = {}));
function W8(t, e, n, r, s, i, o) {
  return {
    type: z.Payload,
    payloadType: Q.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function op(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Q.TokenTransfer:
      e.push(Ht(t.recipient)), e.push(Bn(t.amount, !1, 8)), e.push(Oe(t.memo));
      break;
    case Q.ContractCall:
      e.push(Oe(t.contractAddress)), e.push(Oe(t.contractName)), e.push(Oe(t.functionName));
      const n = new Uint8Array(4);
      ir(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ht(r));
      });
      break;
    case Q.SmartContract:
      e.push(Oe(t.contractName)), e.push(Oe(t.codeBody));
      break;
    case Q.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Oe(t.contractName)), e.push(Oe(t.codeBody));
      break;
    case Q.PoisonMicroblock:
      break;
    case Q.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Q.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ht(t.recipient));
      break;
    case Q.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ht(t.recipient ? rp(t.recipient) : np())), e.push(t.vrfProof);
      break;
    case Q.TenureChange:
      e.push(xt(t.tenureHash)), e.push(xt(t.previousTenureHash)), e.push(xt(t.burnViewHash)), e.push(xt(t.previousTenureEnd)), e.push(ir(new Uint8Array(4), t.previousTenureBlocks)), e.push(AE(new Uint8Array(1), t.cause)), e.push(xt(t.publicKeyHash));
      break;
  }
  return Lt(e);
}
function Y8(t) {
  switch (t.readUInt8Enum(Q, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Q.TokenTransfer:
      const n = ge(t), r = Rt(t.readBytes(8), !1), s = cp(t);
      return G8(n, r, s);
    case Q.ContractCall:
      const i = Kr(t), o = ce(t), a = ce(t), c = [], l = t.readUInt32BE();
      for (let w = 0; w < l; w++) {
        const $ = ge(t);
        c.push($);
      }
      return K8(i, o, a, c);
    case Q.SmartContract:
      const f = ce(t), u = ce(t, 4, 1e5);
      return Ff(f, u);
    case Q.VersionedSmartContract: {
      const w = t.readUInt8Enum(sc, (I) => {
        throw new Error(`Cannot recognize ClarityVersion: ${I}`);
      }), $ = ce(t), p = ce(t, 4, 1e5);
      return Ff($, p, w);
    }
    case Q.PoisonMicroblock:
      return V8();
    case Q.Coinbase: {
      const w = t.readBytes(Gn);
      return zf(w);
    }
    case Q.CoinbaseToAltRecipient: {
      const w = t.readBytes(Gn), $ = ge(t);
      return zf(w, $);
    }
    case Q.NakamotoCoinbase: {
      const w = t.readBytes(Gn), $ = ge(t), p = t.readBytes(rc);
      return q8(w, $, p);
    }
    case Q.TenureChange:
      const g = nt(t.readBytes(20)), h = nt(t.readBytes(20)), b = nt(t.readBytes(20)), x = nt(t.readBytes(32)), A = t.readUInt32BE(), U = t.readUInt8Enum(lc, (w) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${w}`);
      }), _ = nt(t.readBytes(20));
      return W8(g, h, b, x, A, U, _);
  }
}
class Co extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class kn extends Co {
  constructor(e) {
    super(e);
  }
}
class ee extends Co {
  constructor(e) {
    super(e);
  }
}
class Zi extends Co {
  constructor(e) {
    super(e);
  }
}
class zn extends Co {
  constructor(e) {
    super(e);
  }
}
var pe;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(pe || (pe = {}));
function fc(t) {
  return J0(nt(t.readBytes(vo)));
}
function Br(t, e) {
  return {
    pubKeyEncoding: t,
    type: z.TransactionAuthField,
    contents: e
  };
}
function X8(t) {
  const e = t.readUInt8Enum(pe, (n) => {
    throw new ee(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case pe.PublicKeyCompressed:
      return Br(St.Compressed, uc(t));
    case pe.PublicKeyUncompressed:
      return Br(St.Uncompressed, j8(uc(t).data));
    case pe.SignatureCompressed:
      return Br(St.Compressed, fc(t));
    case pe.SignatureUncompressed:
      return Br(St.Uncompressed, fc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Eu(t) {
  return xt(t.data);
}
function Z8(t) {
  const e = [];
  switch (t.contents.type) {
    case z.PublicKey:
      e.push(t.pubKeyEncoding === St.Compressed ? pe.PublicKeyCompressed : pe.PublicKeyUncompressed), e.push(Xi(O8(t.contents.data)));
      break;
    case z.MessageSignature:
      e.push(t.pubKeyEncoding === St.Compressed ? pe.SignatureCompressed : pe.SignatureUncompressed), e.push(Eu(t.contents));
      break;
  }
  return Lt(e);
}
function Oe(t) {
  switch (t.type) {
    case z.Address:
      return Os(t);
    case z.Principal:
      return ap(t);
    case z.LengthPrefixedString:
      return Vr(t);
    case z.MemoString:
      return eA(t);
    case z.AssetInfo:
      return up(t);
    case z.PostCondition:
      return nA(t);
    case z.PublicKey:
      return Xi(t);
    case z.LengthPrefixedList:
      return Iu(t);
    case z.Payload:
      return op(t);
    case z.TransactionAuthField:
      return Z8(t);
    case z.MessageSignature:
      return Eu(t);
  }
}
function Q8() {
  return {
    type: z.Address,
    version: Wi.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Au(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === gt.SerializeP2PKH || e === gt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === gt.SerializeP2WPKH || e === gt.SerializeP2WSH || e === gt.SerializeP2WSHNonSequential) && !r.every(es))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case gt.SerializeP2PKH:
      return ls(t, xA(r[0].data));
    case gt.SerializeP2WPKH:
      return ls(t, mA(r[0].data));
    case gt.SerializeP2SH:
    case gt.SerializeP2SHNonSequential:
      return ls(t, SA(n, r.map(Xi)));
    case gt.SerializeP2WSH:
    case gt.SerializeP2WSHNonSequential:
      return ls(t, EA(n, r.map(Xi)));
  }
}
function Os(t) {
  const e = [];
  return e.push(xt(Ds(t.version, 1))), e.push(xt(t.hash160)), Lt(e);
}
function Kr(t) {
  const e = $o(nt(t.readBytes(1))), n = nt(t.readBytes(20));
  return { type: z.Address, version: e, hash160: n };
}
function ap(t) {
  const e = [];
  return e.push(t.prefix), e.push(Os(t.address)), t.prefix === Ls.Contract && e.push(Vr(t.contractName)), Lt(e);
}
function J8(t) {
  const e = t.readUInt8Enum(Ls, (s) => {
    throw new ee(`Unexpected Principal payload type: ${s}`);
  }), n = Kr(t);
  if (e === Ls.Standard)
    return { type: z.Principal, prefix: e, address: n };
  const r = ce(t);
  return {
    type: z.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Vr(t) {
  const e = [], n = ts(t.content), r = n.byteLength;
  return e.push(xt(Ds(r, t.lengthPrefixBytes))), e.push(n), Lt(e);
}
function ce(t, e, n) {
  e = e || 1;
  const r = $o(nt(t.readBytes(e))), s = gu(t.readBytes(r));
  return or(s, e, n ?? 128);
}
function tA(t) {
  return or(t, 4, 1e5);
}
function Rf(t) {
  if (t && dp(t, Vi))
    throw new Error(`Memo exceeds maximum length of ${Vi} bytes`);
  return { type: z.MemoString, content: t };
}
function eA(t) {
  const e = [], n = ts(t.content), r = bA(nt(n), Vi * 2);
  return e.push(xt(r)), Lt(e);
}
function cp(t) {
  let e = gu(t.readBytes(Vi));
  return e = e.replace(/\u0000*$/, ""), { type: z.MemoString, content: e };
}
function up(t) {
  const e = [];
  return e.push(Os(t.address)), e.push(Vr(t.contractName)), e.push(Vr(t.assetName)), Lt(e);
}
function hc(t) {
  return {
    type: z.AssetInfo,
    address: Kr(t),
    contractName: ce(t),
    assetName: ce(t)
  };
}
function $u(t, e) {
  return {
    type: z.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Iu(t) {
  const e = t.values, n = [];
  n.push(xt(Ds(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Oe(r));
  return Lt(n);
}
function lp(t, e, n) {
  const r = $o(nt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case z.Address:
        s.push(Kr(t));
        break;
      case z.LengthPrefixedString:
        s.push(ce(t));
        break;
      case z.MemoString:
        s.push(cp(t));
        break;
      case z.AssetInfo:
        s.push(hc(t));
        break;
      case z.PostCondition:
        s.push(rA(t));
        break;
      case z.PublicKey:
        s.push(uc(t));
        break;
      case z.TransactionAuthField:
        s.push(X8(t));
        break;
    }
  return $u(s, n);
}
function nA(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ap(t.principal)), (t.conditionType === Wt.Fungible || t.conditionType === Wt.NonFungible) && e.push(up(t.assetInfo)), t.conditionType === Wt.NonFungible && e.push(Ht(t.assetName)), e.push(t.conditionCode), t.conditionType === Wt.STX || t.conditionType === Wt.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new kn("The post-condition amount may not be larger than 8 bytes");
    e.push(Bn(t.amount, !1, 8));
  }
  return Lt(e);
}
function rA(t) {
  const e = t.readUInt8Enum(Wt, (o) => {
    throw new ee(`Could not read ${o} as PostConditionType`);
  }), n = J8(t);
  let r, s, i;
  switch (e) {
    case Wt.STX:
      return r = t.readUInt8Enum(vs, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${nt(t.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Wt.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Wt.Fungible:
      return s = hc(t), r = t.readUInt8Enum(vs, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${nt(t.readBytes(8))}`), {
        type: z.PostCondition,
        conditionType: Wt.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Wt.NonFungible:
      s = hc(t);
      const o = ge(t);
      return r = t.readUInt8Enum(ic, (a) => {
        throw new ee(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: z.PostCondition,
        conditionType: Wt.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Te(t, e) {
  return Lt([t, e]);
}
function sA(t) {
  return new Uint8Array([t.type]);
}
function iA(t) {
  return t.type === H.OptionalNone ? new Uint8Array([t.type]) : Te(t.type, Ht(t.value));
}
function oA(t) {
  const e = new Uint8Array(4);
  return ir(e, t.buffer.length, 0), Te(t.type, Io(e, t.buffer));
}
function aA(t) {
  const e = pu(hE(t.value, BigInt(LE)), V0);
  return Te(t.type, e);
}
function cA(t) {
  const e = pu(t.value, V0);
  return Te(t.type, e);
}
function uA(t) {
  return Te(t.type, Os(t.address));
}
function lA(t) {
  return Te(t.type, Io(Os(t.address), Vr(t.contractName)));
}
function fA(t) {
  return Te(t.type, Ht(t.value));
}
function hA(t) {
  const e = [], n = new Uint8Array(4);
  ir(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ht(r);
    e.push(s);
  }
  return Te(t.type, Lt(e));
}
function dA(t) {
  const e = [], n = new Uint8Array(4);
  ir(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = or(s);
    e.push(Vr(i));
    const o = Ht(t.data[s]);
    e.push(o);
  }
  return Te(t.type, Lt(e));
}
function fp(t, e) {
  const n = [], r = e == "ascii" ? G0(t.data) : ts(t.data), s = new Uint8Array(4);
  return ir(s, r.length, 0), n.push(s), n.push(r), Te(t.type, Lt(n));
}
function pA(t) {
  return fp(t, "ascii");
}
function gA(t) {
  return fp(t, "utf8");
}
function Ht(t) {
  switch (t.type) {
    case H.BoolTrue:
    case H.BoolFalse:
      return sA(t);
    case H.OptionalNone:
    case H.OptionalSome:
      return iA(t);
    case H.Buffer:
      return oA(t);
    case H.UInt:
      return cA(t);
    case H.Int:
      return aA(t);
    case H.PrincipalStandard:
      return uA(t);
    case H.PrincipalContract:
      return lA(t);
    case H.ResponseOk:
    case H.ResponseErr:
      return fA(t);
    case H.List:
      return hA(t);
    case H.Tuple:
      return dA(t);
    case H.StringASCII:
      return pA(t);
    case H.StringUTF8:
      return gA(t);
    default:
      throw new kn("Unable to serialize. Invalid Clarity Value.");
  }
}
function yA(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Gf = /* @__PURE__ */ new Map();
function hp(t, e) {
  const n = Gf.get(t);
  if (n !== void 0)
    return n(e);
  const r = yA(t);
  return Gf.set(t, r), hp(t, e);
}
class ys {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return $E(this.readBytes(4), 0);
  }
  readUInt8() {
    return EE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return mE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = nt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = nt(n);
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
    if (hp(e, r))
      return r;
    throw n(r);
  }
}
function ge(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ys(xt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ys(t) : e = t;
  switch (e.readUInt8Enum(H, (r) => {
    throw new ee(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case H.Int:
      return U8(e.readBytes(16));
    case H.UInt:
      return Yi(e.readBytes(16));
    case H.Buffer:
      const r = e.readUInt32BE();
      return ep(e.readBytes(r));
    case H.BoolTrue:
      return C8();
    case H.BoolFalse:
      return B8();
    case H.PrincipalStandard:
      const s = Kr(e);
      return v8(s);
    case H.PrincipalContract:
      const i = Kr(e), o = ce(e);
      return tp(i, o);
    case H.ResponseOk:
      return _8(ge(e));
    case H.ResponseErr:
      return H8(ge(e));
    case H.OptionalNone:
      return np();
    case H.OptionalSome:
      return rp(ge(e));
    case H.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(ge(e));
      return T8(c);
    case H.Tuple:
      const l = e.readUInt32BE(), f = {};
      for (let x = 0; x < l; x++) {
        const A = ce(e).content;
        if (A === void 0)
          throw new ee('"content" is undefined');
        f[A] = ge(e);
      }
      return cc(f);
    case H.StringASCII:
      const u = e.readUInt32BE(), g = yE(e.readBytes(u));
      return Ir(g);
    case H.StringUTF8:
      const h = e.readUInt32BE(), b = gu(e.readBytes(h));
      return N8(b);
    default:
      throw new ee("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const wA = (t) => t.length % 2 == 0 ? t : `0${t}`, bA = (t, e) => t.padEnd(e, "0"), dp = (t, e) => t ? ts(t).length > e : !1;
function dc(t) {
  return Nd(t);
}
const Cs = (t) => KE(mu(t)), vu = (t) => nt(E8(t)), xA = (t) => nt(Cs(t)), mA = (t) => {
  const e = Cs(t), n = Io(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Cs(n);
  return nt(r);
}, SA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Lt(n), s = Cs(r);
  return nt(s);
}, EA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Lt(n), s = mu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Lt(i), a = Cs(o);
  return nt(a);
};
function AA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function $A(t) {
  const e = Ht(t);
  return `0x${nt(e)}`;
}
const vi = (t) => {
  try {
    return dr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Lu() {
  return {
    type: z.MessageSignature,
    data: nt(new Uint8Array(vo))
  };
}
function pp(t, e, n, r) {
  const s = Au(0, t, 1, [Gr(e)]).hash160, i = es(Gr(e)) ? St.Compressed : St.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Rt(n, !1),
    fee: Rt(r, !1),
    keyEncoding: i,
    signature: Lu()
  };
}
function Bs(t) {
  return "signature" in t;
}
function Kf(t) {
  return t === gt.SerializeP2SH || t === gt.SerializeP2WSH;
}
function IA(t) {
  return t === gt.SerializeP2SHNonSequential || t === gt.SerializeP2WSHNonSequential;
}
function Vf(t) {
  const e = dc(t);
  return e.nonce = 0, e.fee = 0, Bs(e) ? e.signature = Lu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function vA(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    Bn(t.nonce, !1, 8),
    Bn(t.fee, !1, 8),
    t.keyEncoding,
    Eu(t.signature)
  ];
  return Lt(e);
}
function LA(t) {
  const e = [
    t.hashMode,
    xt(t.signer),
    Bn(t.nonce, !1, 8),
    Bn(t.fee, !1, 8)
  ], n = $u(t.fields);
  e.push(Iu(n));
  const r = new Uint8Array(2);
  return SE(r, t.signaturesRequired, 0), e.push(r), Lt(e);
}
function CA(t, e) {
  const n = nt(e.readBytes(20)), r = BigInt(`0x${nt(e.readBytes(8))}`), s = BigInt(`0x${nt(e.readBytes(8))}`), i = e.readUInt8Enum(St, (a) => {
    throw new ee(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === gt.SerializeP2WPKH && i != St.Compressed)
    throw new ee("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = fc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function BA(t, e) {
  const n = nt(e.readBytes(20)), r = BigInt("0x" + nt(e.readBytes(8))), s = BigInt("0x" + nt(e.readBytes(8))), i = lp(e, z.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case z.PublicKey:
        es(l.contents) || (o = !0);
        break;
      case z.MessageSignature:
        if (l.pubKeyEncoding === St.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new zn("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === gt.SerializeP2WSH || t === gt.SerializeP2WSHNonSequential))
    throw new zn("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ca(t) {
  return Bs(t) ? vA(t) : LA(t);
}
function ua(t) {
  const e = t.readUInt8Enum(gt, (n) => {
    throw new ee(`Could not parse ${n} as AddressHashMode`);
  });
  return e === gt.SerializeP2PKH || e === gt.SerializeP2WPKH ? CA(e, t) : BA(e, t);
}
function gp(t, e, n, r) {
  const i = t + nt(new Uint8Array([e])) + nt(Bn(n, !1, 8)) + nt(Bn(r, !1, 8));
  if (xt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return vu(xt(i));
}
function yp(t, e, n) {
  const r = 33 + vo, s = es(e) ? St.Compressed : St.Uncompressed, i = t + wA(s.toString(16)) + n.data, o = xt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return vu(o);
}
function MA(t, e, n, r, s) {
  const i = gp(t, e, n, r), o = z8(s, i), a = R8(s), c = yp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function wp(t, e, n, r, s, i) {
  const o = gp(t, e, n, r), a = Gr(k8(o, i, s)), c = yp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function UA() {
  const t = pp(gt.SerializeP2PKH, "", 0, 0);
  return t.signer = Q8().hash160, t.keyEncoding = St.Compressed, t.signature = Lu(), t;
}
function qf(t, e, n) {
  return Bs(t) ? HA(t, e, n) : _A(t, e, n);
}
function HA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = wp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Au(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new zn(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function _A(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case z.PublicKey:
        es(c.contents) || (i = !0), r.push(c.contents);
        break;
      case z.MessageSignature:
        c.pubKeyEncoding === St.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: f } = wp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Kf(t.hashMode) && (s = f), r.push(l), o += 1, o === 65536)
          throw new zn("Too many signatures");
        break;
    }
  if (Kf(t.hashMode) && o !== t.signaturesRequired || IA(t.hashMode) && o < t.signaturesRequired)
    throw new zn("Incorrect number of signatures");
  if (i && (t.hashMode === gt.SerializeP2WSH || t.hashMode === gt.SerializeP2WSHNonSequential))
    throw new zn("Uncompressed keys are not allowed in this hash mode");
  const a = Au(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new zn(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function bp(t) {
  return {
    authType: At.Standard,
    spendingCondition: t
  };
}
function xp(t, e) {
  return {
    authType: At.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || pp(gt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Wf(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case At.Standard:
        return bp(Vf(t.spendingCondition));
      case At.Sponsored:
        return xp(Vf(t.spendingCondition), UA());
      default:
        throw new Zi("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function TA(t, e) {
  switch (t.authType) {
    case At.Standard:
      return qf(t.spendingCondition, e, At.Standard);
    case At.Sponsored:
      return qf(t.spendingCondition, e, At.Standard);
    default:
      throw new Zi("Invalid origin auth type");
  }
}
function NA(t, e) {
  switch (t.authType) {
    case At.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Rt(e, !1)
      };
      return { ...t, spendingCondition: n };
    case At.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Rt(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function kA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Rt(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function PA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Rt(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function DA(t, e) {
  const n = {
    ...e,
    nonce: Rt(e.nonce, !1),
    fee: Rt(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function OA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case At.Standard:
      e.push(ca(t.spendingCondition));
      break;
    case At.Sponsored:
      e.push(ca(t.spendingCondition)), e.push(ca(t.sponsorSpendingCondition));
      break;
  }
  return Lt(e);
}
function jA(t) {
  const e = t.readUInt8Enum(At, (r) => {
    throw new ee(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case At.Standard:
      return n = ua(t), bp(n);
    case At.Sponsored:
      n = ua(t);
      const r = ua(t);
      return xp(n, r);
  }
}
class FA {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Rt(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? IE, this.postConditionMode = i ?? Is.Deny, this.postConditions = s ?? $u([]), o)
      this.anchorMode = ME(o);
    else
      switch (r.payloadType) {
        case Q.Coinbase:
        case Q.CoinbaseToAltRecipient:
        case Q.NakamotoCoinbase:
        case Q.PoisonMicroblock:
        case Q.TenureChange:
          this.anchorMode = qt.OnChainOnly;
          break;
        case Q.ContractCall:
        case Q.SmartContract:
        case Q.VersionedSmartContract:
        case Q.TokenTransfer:
          this.anchorMode = qt.Any;
          break;
      }
  }
  signBegin() {
    const e = dc(this);
    return e.auth = Wf(e.auth), e.txid();
  }
  verifyBegin() {
    const e = dc(this);
    return e.auth = Wf(e.auth), e.txid();
  }
  verifyOrigin() {
    return TA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, At.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === At.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, At.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Bs(n)) {
      const r = es(e);
      n.fields.push(Br(r ? St.Compressed : St.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = MA(n, r, e.fee, e.nonce, s);
    return Bs(e) ? e.signature = i : e.fields.push(Br(s.data.byteLength === K0 ? St.Compressed : St.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return vu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != At.Sponsored)
      throw new Zi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = DA(this.auth, e);
  }
  setFee(e) {
    this.auth = NA(this.auth, e);
  }
  setNonce(e) {
    this.auth = kA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != At.Sponsored)
      throw new Zi("Cannot sponsor sign a non-sponsored transaction");
    this.auth = PA(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new kn('"version" is undefined');
    if (this.chainId === void 0)
      throw new kn('"chainId" is undefined');
    if (this.auth === void 0)
      throw new kn('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new kn('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new kn('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ir(n, this.chainId, 0), e.push(n), e.push(OA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Iu(this.postConditions)), e.push(op(this.payload)), Lt(e);
  }
}
function Cu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ys(xt(t.slice(2))) : e = new ys(xt(t)) : t instanceof Uint8Array ? e = new ys(t) : e = t;
  const n = e.readUInt8Enum(qi, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = jA(e), i = e.readUInt8Enum(qt, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(Is, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = lp(e, z.PostCondition), c = Y8(e);
  return new FA(n, s, c, a, o, i, r);
}
const Qi = Yi, zA = ep;
const RA = /* @__PURE__ */ new Set([4001, -31001]), GA = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], KA = ["result", "data", "payload", "response", "params"], Yf = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Bo = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), wr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, ze = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, VA = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), mp = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => VA(i, r)) === s
  );
}, Sp = (t) => t ? mp(wr()).some(
  (e) => {
    var n;
    return e.id === t && (Bo(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ep = () => {
  if (typeof window > "u")
    return;
  const t = wr(), e = mp(t).filter(
    (n) => {
      var r;
      return Bo(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = ze(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of GA) {
    const r = ze(t, n) ?? (t === window ? void 0 : ze(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, qA = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = wr(), n = ze(e, t) ?? (e === window ? void 0 : ze(window, t)) ?? go(t);
  if (n)
    return n;
  if (Bo(t) || Sp(t))
    return Ep();
}, bi = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, WA = ["blockstack-session", "blockstack"], YA = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of WA) {
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
YA();
const Ap = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, te = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, XA = (t) => {
  const e = te(t);
  if (!e)
    return null;
  const n = Ap(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, ZA = (t) => {
  const e = te(t);
  if (!e)
    return null;
  const n = Ap(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, pc = (t, e = "mainnet") => {
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
      return pc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return pc(r, e);
  }
  return e;
}, Kn = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Ms = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return vi(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Ms(s, e + 1);
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
    const i = Ms(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && vi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && vi(n.testnet) ? n.testnet.trim() : null;
}, Xf = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, $p = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && RA.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ar = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = te(n == null ? void 0 : n.message) ?? te(e.message) ?? te(e.error) ?? te(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, qr = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ar(e);
    if (e.status === "error")
      throw ar(e.result ?? e);
  }
  return t;
}, Zf = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return qr(r);
  } catch (r) {
    throw ar(r);
  }
}, Ip = () => Ep(), Bu = () => {
  if (typeof window > "u")
    return;
  const t = wr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = ze(t, e) ?? (t === window ? void 0 : ze(window, e));
    if (n)
      return n;
  }
}, Qf = () => {
  if (typeof window > "u")
    return;
  const t = Bu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = wr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = ze(e, n) ?? (e === window ? void 0 : ze(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Li = (t) => {
  var r, s;
  const e = Qn();
  if (Bo(e) || Sp(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = wr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Ip();
}, la = (t) => {
  const e = ZA(t);
  if (!e)
    return null;
  try {
    const n = Cu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ji = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = la(t), r = XA(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? te(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ji(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Yf)
    if (la(s[a])) {
      i = te(s[a]);
      break;
    }
  const o = te(s.txId) || te(s.txid) || te(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? te(s.txRaw) ?? void 0
    };
  for (const a of Yf) {
    const c = la(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: te(s[a]) ?? void 0
      };
  }
  for (const a of KA) {
    const c = s[a], l = Ji(c, e + 1);
    if (l)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...l,
        txId: l.txId,
        txid: l.txid ?? l.txId
      };
  }
  return null;
}, fa = (t) => {
  const e = Ji(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, QA = (t) => {
  const e = Ji(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, JA = (t) => ({
  ...t,
  fee: Kn(t.fee),
  nonce: Kn(t.nonce),
  sponsored: t.sponsored === !0
}), Jf = (t) => ({
  recipient: t.recipient,
  amount: Kn(t.amount) ?? "0",
  memo: t.memo,
  network: pc(t.network),
  address: t.stxAddress,
  fee: Kn(t.fee),
  nonce: Kn(t.nonce),
  sponsored: t.sponsored ?? !1
}), vp = "WALLET_ADDRESS_MISMATCH", t6 = 45e3;
let ws = null;
const gc = (t) => {
  t && (ws = { address: t, at: Date.now() });
}, e6 = () => {
  ws = null;
}, n6 = () => ws && Date.now() - ws.at <= t6 ? ws.address : null, r6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, s6 = async (t) => {
  e6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = qr(await t.request("wallet_connect")), n = Ms(e);
  return gc(n), n;
}, i6 = async (t, e, n, r) => {
  try {
    return qr(await t.request(e, n));
  } catch (s) {
    const i = ar(s);
    if (!r6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await s6(t);
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
        { code: o ? vp : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return qr(await t.request(e, n));
    } catch (a) {
      throw ar(a);
    }
  }
};
let th = 3e4;
const o6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${th / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, th);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, a6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: vp }
      );
    return c;
  }, s = n6();
  if (s)
    return bi(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  bi(n, "account-read");
  try {
    const c = qr(
      await o6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Ms(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if ($p(c))
      throw ar(c);
    bi(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return gc(i), r(i, "wallet_getAccount");
  let o;
  bi(n, "account-reconnect");
  try {
    o = qr(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ar(c);
  }
  const a = Ms(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return gc(a), r(a, "wallet_connect");
}, c6 = async (t, e) => {
  if (!Li(t)) {
    const i = await Zf(
      t,
      "stx_transferStx",
      Jf(e)
    );
    return fa(i);
  }
  const n = Bu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Zf(
      n,
      "stx_transferStx",
      Jf(e)
    );
    return fa(i);
  }
  const r = Ip();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await a6(r, e.stxAddress);
  const s = await i6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Kn(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Kn(e.fee) } : {}
    },
    e.stxAddress
  );
  return fa(s);
}, u6 = () => Qn(), Lp = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Qn(), e = t ? qA(t) : void 0;
  if (e)
    return e;
  const n = wr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, l6 = (t, e) => {
  const n = Lp(), r = JA({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, QA(s));
    }
  });
  if (!n || typeof n.request != "function")
    return pi(r, e);
  if (Li(n) && !Bu()) {
    const s = Qf();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Qn(),
        route: "legacy-transaction-request"
      }), pi(r, s);
  }
  return void c6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Xf(s) && Li(n)) {
      const a = Qf();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Qn(),
          route: "legacy-transaction-request"
        }), pi(r, a);
        return;
      }
    }
    if (Xf(s) && !Li(n)) {
      pi(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), $p(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, eh = (t) => $A(t).replace(/^0x/, ""), nh = "This wallet cannot sign messages. Try Xverse or Leather.", rh = (t) => typeof (t == null ? void 0 : t.request) == "function", sh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", f6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, h6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function d6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: eh(e.message),
    domain: eh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function p6(t, e) {
  const n = await iE({
    domain: e.domain,
    message: e.message,
    network: Ao(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function g6(t) {
  var s, i;
  const e = u6() || "", n = /xverse/i.test(e);
  let r = Lp();
  if (n && !sh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (sh(r))
    try {
      return await p6(r, t);
    } catch (o) {
      if (n || !rh(r) || !h6(o)) throw o;
    }
  if (!n && rh(r))
    try {
      return await d6(r, t);
    } catch (o) {
      throw f6(o) ? new Error(nh) : o;
    }
  throw new Error(nh);
}
const ih = 1000000n, bs = 1000000n, yc = 50n, to = 3000n, Mu = 300n, y6 = 3000n, w6 = 50000n, Mo = (t) => t + yc;
function bn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / ih}.${(n % ih).toString().padStart(6, "0")}`;
}
function b6(t, e = Mu) {
  return t <= to ? 0 : Number((t - to) / Mo(e));
}
function oh(t, e = 0n) {
  const n = bs - t - e;
  return n > 0n ? n : 0n;
}
function x6(t, e = Mu) {
  return t > bs ? "over" : t < to + Mo(e) ? "empty" : t < w6 ? "low" : "ok";
}
const m6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", S6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", E6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function A6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || E6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== m6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Cp = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", [wc, Bp] = Cp.split("."), mn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function bc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function $6(t) {
  return mn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Wr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Mp(t, e = []) {
  const n = await Wr(`/v2/contracts/call-read/${wc}/${Bp}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: wc, arguments: e.map((r) => "0x" + mn(Ht(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return En(ge(n.result));
}
async function I6() {
  const t = await Wr(`/v2/contracts/source/${wc}/${Bp}?proof=0`);
  if (typeof t.source != "string" || await $6(t.source) !== S6) throw Error("Deployed source does not match the tested helper.");
  if (A6(await Mp("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Up(t) {
  return t.startsWith("SP") && vi(t) && !t.includes(".");
}
async function v6(t) {
  var r;
  if (!Up(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Wr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Wr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function L6(t) {
  const e = await Wr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function C6(t, e) {
  var s, i;
  const n = await Mp("get-owner", [Qi(t), Qi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Up(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function B6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: bc(t), signal: AbortSignal.timeout(15e3) });
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
function U6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Cu(bc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || gs(ls(Wi.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || gs(r.contractAddress) + "." + r.contractName.content !== Cp || r.functionName.content !== "play" || r.functionArgs.length !== 3 || mn(Ht(r.functionArgs[0])) !== mn(Ht(Qi(t.core))) || mn(Ht(r.functionArgs[1])) !== mn(Ht(Qi(t.song))) || mn(Ht(r.functionArgs[2])) !== mn(Ht(zA(bc(t.id)))) || t.amount !== "50" || e.postConditionMode !== Is.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== vs.Equal || i.principal.prefix !== 2 || gs(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (r.payloadType !== 0 || En(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const H6 = "xtrata.xyz/radio/listening-wallet", _6 = "Link a temporary listening wallet for pay-per-play; no spending permission", T6 = (t) => ({
  domain: cc({ name: Ir(H6), version: Ir("1"), "chain-id": Yi(1) }),
  message: cc({
    purpose: Ir(_6),
    main: Ir(t.main),
    listening: Ir(t.listening),
    issued: Yi(t.issued)
  })
}), ha = 3, N6 = ["prepared", "signed", "unknown", "pending"], k6 = 30 * 6e4, da = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, P6 = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function D6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = !1, f = "", u = "", g, h = null, b, x = -1 / 0;
  const A = /* @__PURE__ */ new Set();
  let U = !1, _ = !1, w = !1, $ = !1, p = 0, I = null, M = Promise.resolve();
  const B = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Mu.toString()), N = (C, F) => `xtrata.ppp.v1.${C}:${F}`, y = (C = i == null ? void 0 : i.address) => {
    if (!C) return [];
    try {
      const F = JSON.parse(t.store.get(N("entries", C)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, E = (C) => {
    const F = [C, ...y(C.address).filter((at) => !(at.txid === C.txid && at.kind === C.kind))].slice(0, 200);
    t.store.set(N("entries", C.address), JSON.stringify(F));
  }, T = (C = i == null ? void 0 : i.address) => !!C && t.store.get(N("on", C)) !== "0", O = (C) => {
    i != null && i.address && t.store.set(N("on", i.address), C ? "1" : "0");
  }, R = () => y().filter((C) => N6.includes(C.status)), D = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(N("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, Gt = (C) => {
    i != null && i.address && t.store.set(N("deposit", i.address), JSON.stringify(C));
  }, tt = () => R().filter((C) => t.now() - C.created > k6 && A.has(C.txid));
  function ht() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const C = t.main();
    return C ? e.allowed ? i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : i.linked !== C ? "link" : o === void 0 ? "loading" : o > bs ? "over" : o < to + Mo(B()) ? "fund" : "ready" : "loading" : "not-invited" : "connect";
  }
  const m = () => {
    var C, F;
    return {
      step: ht(),
      busy: c,
      message: f,
      error: u,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : x6(o, B()),
      playsLeft: o === void 0 ? 0 : b6(o, B()),
      allowance: o === void 0 ? bs : oh(o, BigInt(((C = D()) == null ? void 0 : C.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: T(),
      entries: y(),
      depositTxid: ((F = D()) == null ? void 0 : F.txid) ?? g,
      depositPending: !!D(),
      serverLinked: !!h && b === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: tt().length,
      armed: w
    };
  }, L = (C, F = "") => {
    f = C, u = F, t.changed();
  };
  async function et(C, F) {
    if (!c) {
      c = C, u = "", t.changed();
      try {
        await F();
      } catch (at) {
        const K = at instanceof Error ? at.message : String(at);
        u = /Cancelled in the listening wallet/.test(K) ? "" : K, u || (f = "Cancelled. Nothing was signed.", $ = !0);
      } finally {
        c = null, await Xt(!0);
      }
    }
  }
  async function ut() {
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function ot(C = !1) {
    i != null && i.address && (!C && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function It(C) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || i.linked === C) return;
    const F = `${C}:${i.address}`;
    b === F && (h || t.now() - x < 6e4) || (h = (await t.links(C)).find((at) => at.listening === i.address) ?? null, b = F, x = t.now());
  }
  async function xe() {
    const C = i == null ? void 0 : i.address;
    if (!C) return;
    let F;
    for (const K of R())
      try {
        const Ct = await t.chain.transaction(K.txid);
        if (!Ct) {
          if (A.add(K.txid), t.now() - K.created > 15 * 6e4 && (F ?? (F = await t.chain.confirmedNonce(C))), F !== void 0 && F > BigInt(K.nonce)) {
            E({ ...K, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((K.status === "unknown" || K.status === "signed") && K.raw)
            try {
              await t.chain.broadcast(K.raw, K.txid), E({ ...K, status: "pending" });
            } catch (Dt) {
              da(Dt) && E({ ...K, status: "failed", note: Dt.message, raw: void 0 });
            }
          continue;
        }
        A.delete(K.txid);
        const Pt = String(Ct.tx_status);
        Pt === "success" && Ct.canonical !== !1 && Ct.is_unanchored === !1 ? E({ ...K, status: "confirmed", confirmedAt: t.now(), actualFee: String(Ct.fee_rate ?? K.fee), raw: void 0 }) : Pt.startsWith("abort_") || Pt.startsWith("dropped_") ? E({ ...K, status: "failed", note: Pt, raw: void 0 }) : K.status !== "pending" && E({ ...K, status: "pending" });
      } catch {
      }
    const at = D();
    if (at)
      try {
        const K = await t.chain.transaction(at.txid), Ct = String((K == null ? void 0 : K.tx_status) ?? "");
        (Ct === "success" && K.is_unanchored === !1 || Ct.startsWith("abort_") || Ct.startsWith("dropped_") || !K && t.now() - at.at > 2 * 36e5) && (Gt(null), a = -1 / 0);
      } catch {
      }
  }
  async function Xt(C = !1) {
    try {
      const F = t.main();
      if ((C || !e || r !== F || t.now() - n > 3e5) && (e = await t.config(F), n = t.now(), r = F), !e.enabled || !e.here || !F || !e.allowed) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), w && ue(), t.changed();
        return;
      }
      await ut(), i = await s.request("listening.status"), await It(F), await ot(C), await xe();
    } catch (F) {
      u = F instanceof Error ? F.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    ht() === "locked" ? Tt() : w && ue(), t.changed();
  }
  async function rt(C, F) {
    const at = !(i != null && i.address) || T(i.address);
    await C.request("listening.unlock", { mode: "unlock", terms: at ? ns() : void 0, anyPasskey: F }), i = await C.request("listening.status"), at && (T(i.address) ? await br() : await C.request("listening.stop")), L(at ? "Unlocked. Each song you listen to for 30 seconds pays its holder." : "Unlocked. Paying is switched off.");
  }
  function Tt() {
    w || c || $ || p >= 3 || !s || !(i != null && i.address) || !T(i.address) || (w = !0, M = (async () => {
      try {
        await rt(s, !1), p = 0;
      } catch (C) {
        const F = C instanceof Error ? C.message : String(C);
        /Cancelled in the listening wallet/.test(F) ? I || ($ = !0, L("Cancelled. Nothing was signed.")) : /did not answer/.test(F) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (p++, u = F);
      } finally {
        w = !1;
        const C = I;
        I = null, C ? await C() : await Xt(!0);
      }
    })());
  }
  async function ue(C) {
    w && (I = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await M), C && await C(), t.changed();
  }
  const ns = () => ({
    fee: B().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: bs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function br() {
    if (!(i != null && i.address)) return !1;
    if (_ || (_ = await t.tabLock(i.address)), !_)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const Uo = {
    forceRefresh: () => Xt(!0),
    create: () => et("Waiting for your passkey in the listening wallet…", async () => {
      const C = await ut();
      await C.request("listening.unlock", { mode: "create", terms: ns() }), i = await C.request("listening.status"), O(!0), L("Listening wallet created and paying is switched on. Next, link it to your main wallet."), await br();
    }),
    unlock: (C = !1) => {
      const F = () => et("Waiting for your passkey in the listening wallet…", async () => rt(await ut(), C));
      return w ? C ? ue(async () => {
        (ht() === "locked" || ht() === "intro") && await F();
      }) : M : F();
    },
    link: () => et("Waiting for your main wallet to sign…", async () => {
      const C = t.main();
      if (!C || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const F = (await t.links(C)).find((at) => at.listening === i.address);
      if (F)
        await s.request("listening.link", { main: C, issued: F.issued, mainSignature: F.mainSignature });
      else {
        const at = { main: C, listening: i.address, issued: t.now() }, K = await t.signWithMain(C, T6(at)), Ct = await s.request("listening.link", { main: C, issued: at.issued, mainSignature: K });
        await t.saveLink({ ...at, mainSignature: K, listeningSignature: Ct.listeningSignature });
      }
      x = -1 / 0, L("Linked. Returns from the listening wallet can only go to your main wallet.");
    }),
    deposit: () => et("Waiting for your main wallet to approve the deposit…", async () => {
      const C = t.main();
      if (!C || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (D()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await ot(!0);
      const F = oh(o ?? 0n);
      if (F <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      g = await t.deposit(C, i.address, F), g && Gt({ txid: g, amount: F.toString(), at: t.now() }), L("Deposit sent. It usually confirms within a few minutes; this page checks automatically.");
    }),
    switchOn: () => et("Confirm in the listening wallet…", async () => {
      await br(), await s.request("listening.approveSession", ns()), O(!0), L("Switched on. Each song you listen to for 30 seconds pays its holder until you switch it off or the wallet runs out.");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => et("Clearing…", async () => {
      for (const C of tt())
        await t.chain.transaction(C.txid) || E({ ...C, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      L("Cleared. If one of those still confirms later, it will simply show in your wallet history on the explorer.");
    }),
    switchOff: () => et("Switching off…", async () => {
      await (s == null ? void 0 : s.request("listening.stop")), O(!1), L("Switched off. Music plays free until you switch it back on.");
    }),
    lock: () => et("Locking…", async () => {
      await (s == null ? void 0 : s.request("listening.lock")), o = void 0, L("Locked. The listening key has been forgotten.");
    }),
    returnFunds: (C) => et("Review the return in the listening wallet…", async () => {
      if (!(i != null && i.address) || !i.linked) throw new Error("Link your main wallet first.");
      if (R().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: F, nonce: at } = await t.chain.account(i.address);
      o = F;
      const K = await s.request("listening.prepareReturn", { mode: C, balance: F.toString(), nonce: at.toString(), fee: y6.toString() });
      if (K.recipient !== i.linked) throw new Error("Return destination does not match your linked main wallet. Nothing was sent.");
      const Ct = Cu(K.raw);
      if (En(Ct.payload.recipient).value !== i.linked || String(Ct.payload.amount) !== K.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const Pt = {
        id: P6(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: K.recipient,
        amount: K.amount,
        fee: K.fee,
        nonce: at.toString(),
        created: t.now(),
        status: "signed",
        raw: K.raw,
        txid: K.txid
      };
      t.validate(Pt), E(Pt);
      try {
        await t.chain.broadcast(K.raw, K.txid), E({ ...Pt, status: "pending" });
      } catch (Dt) {
        throw E({ ...Pt, status: "unknown", note: Dt.message }), Dt;
      }
      C === "all" && O(!1), L(C === "all" ? "Return sent to your main wallet. Paying is switched off; switch it back on after adding funds." : "Excess sent to your main wallet. Switch paying back on to continue.");
    })
  };
  async function Ho(C) {
    if (!(l || c)) {
      l = !0;
      try {
        if (await Xt(), ht() !== "ready" || !T() || !(i != null && i.session) || i.session.playsLeft < 1 || !_ || R().length) return;
        U || (await t.chain.verify(), U = !0);
        const at = i.address, { balance: K, nonce: Ct } = await t.chain.account(at);
        o = K, a = t.now();
        const Pt = await t.chain.owner(ha, C.song);
        if (Pt === at || Pt === t.main()) return;
        const Dt = await s.request("listening.signPlay", {
          core: ha,
          song: C.song,
          receipt: C.id,
          fee: B().toString(),
          nonce: Ct.toString(),
          balance: K.toString()
        }), Ve = {
          id: C.id,
          address: at,
          kind: "play",
          core: ha,
          song: C.song,
          recipient: Pt,
          amount: "50",
          fee: B().toString(),
          nonce: Ct.toString(),
          created: t.now(),
          status: "signed",
          raw: Dt.raw,
          txid: Dt.txid,
          // Display only: the radio's title and artist for this song, kept with the public history.
          ...C.title ? { title: String(C.title).slice(0, 120) } : {},
          ...C.artist ? { artist: String(C.artist).slice(0, 120) } : {}
        };
        t.validate(Ve), E(Ve);
        const js = C.title ? `“${C.title}”${C.artist ? ` by ${C.artist}` : ""}` : `song #${C.song}`;
        try {
          await t.chain.broadcast(Dt.raw, Dt.txid), E({ ...Ve, status: "pending" }), f = `Paid play sent for ${js}.`, u = "";
        } catch (Un) {
          E({ ...Ve, status: da(Un) ? "failed" : "unknown", note: Un.message, ...da(Un) ? { raw: void 0 } : {} }), u = Un.message;
        }
        i = await s.request("listening.status");
      } catch (F) {
        f = "This song played free: " + (F instanceof Error ? F.message : "payment unavailable");
      } finally {
        l = !1, t.changed();
      }
    }
  }
  return { snapshot: m, refresh: Xt, onListened: Ho, ...Uo };
}
const xc = ["Radio address", "Connect wallet", "Access", "Passkey wallet", "Link", "Add funds", "Switch on", "First paid play"];
function O6(t) {
  const e = xc.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Stage ${r + 1} of ${e} · ${s}` });
  switch (t.step) {
    case "off":
    case "loading":
      return null;
    case "elsewhere":
      return n(0, "open the pay-per-play radio address");
    case "connect":
      return n(1, "connect your main Stacks wallet above");
    case "not-invited":
      return n(2, "this wallet is not in the canary yet", !0);
    case "unsupported":
      return n(3, "this browser cannot make a passkey wallet", !0);
    case "intro":
      return n(3, "create your passkey listening wallet");
    case "locked":
      return n(3, "unlock your passkey listening wallet");
    case "link":
      return n(4, "link the listening wallet to your main wallet");
    case "fund":
      return n(5, "add up to 1 STX to the listening wallet");
    case "over":
      return n(5, "over 1 STX: return the excess to keep paying", !0);
    case "ready": {
      if (!t.payingOn || !t.session || t.session.playsLeft < 1) return n(6, "switch paying on");
      const r = t.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(e, "All stages done · paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(7, "first paid play sent, confirming on-chain") : n(7, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
const ah = document.getElementById("ppp");
ah && j6(ah);
function j6(t) {
  const e = h1(), n = (p) => t.querySelector(p), r = n(".ppp-frame");
  let s = null;
  const i = async (p, I) => {
    const M = await fetch(p, { cache: "no-store", ...I, signal: AbortSignal.timeout(15e3) }), B = await M.json().catch(() => ({}));
    if (!M.ok) throw new Error((B == null ? void 0 : B.error) || `Request failed (${M.status}).`);
    return B;
  }, o = D6({
    now: Date.now,
    main: () => {
      const p = e.load();
      return p.isConnected && p.network === "mainnet" ? p.address : void 0;
    },
    config: (p) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(p || "")),
    links: async (p) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(p))).links ?? [],
    saveLink: async (p) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(p) });
    },
    bridge: async (p) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${p}; publickey-credentials-create ${p}`), s.referrerPolicy = "no-referrer";
      const I = new Promise((y, E) => {
        s.addEventListener("load", () => y(), { once: !0 }), setTimeout(() => E(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = p + "/", r.replaceChildren(s), await I;
      const M = new r1({ walletOrigin: p, frame: s, timeoutMs: 30 * 6e4 }), B = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), N = (y, E) => B.has(y) ? M.request(y, E) : Promise.race([
        M.request(y, E),
        new Promise((T, O) => setTimeout(() => O(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await N("listening.status"), { request: N };
    },
    chain: {
      verify: I6,
      balance: L6,
      account: v6,
      owner: C6,
      broadcast: B6,
      transaction: M6,
      confirmedNonce: async (p) => {
        const I = await Wr(`/v2/accounts/${p}?proof=0`);
        if (!Number.isSafeInteger(I == null ? void 0 : I.nonce) || I.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(I.nonce);
      }
    },
    signWithMain: (p, I) => g6({ ...I, network: "mainnet", stxAddress: p }),
    deposit: (p, I, M) => new Promise((B, N) => l6({
      recipient: I,
      amount: M.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: p,
      network: new uh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (y) => B(y.txId || ""),
      onCancel: () => N(new Error("Deposit cancelled. Nothing was sent.")),
      onError: N
    })),
    validate: U6,
    tabLock: (p) => new Promise((I) => {
      const M = navigator.locks;
      if (!(M != null && M.request)) {
        I(!0);
        return;
      }
      M.request("xtrata-ppp:" + p, { ifAvailable: !0 }, async (B) => {
        I(!!B), B && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (p) => {
        try {
          return localStorage.getItem(p);
        } catch {
          return null;
        }
      },
      set: (p, I) => {
        try {
          localStorage.setItem(p, I);
        } catch {
        }
      }
    },
    changed: () => _(o.snapshot())
  }), a = (p) => p ? p.slice(0, 6) + "…" + p.slice(-4) : "", c = (p) => `https://explorer.hiro.so/txid/${p}?chain=mainnet`, l = (p, I = "", M = "") => {
    const B = document.createElement(p);
    return I && (B.textContent = I), M && (B.className = M), B;
  }, f = (p, I, M = "") => {
    const B = l("button", p, M);
    return B.type = "button", B.onclick = I, B;
  }, u = (p, I) => {
    const M = l("a", p);
    return M.href = I, M.target = "_blank", M.rel = "noopener", M;
  };
  let g = null;
  const h = (p) => p.title ? `“${p.title}”${p.artist ? ` — ${p.artist}` : ""}` : `Song #${p.song}`, b = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, x = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function A(p) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(p.step) ? ["", ""] : p.step === "over" ? ["OVER 1 STX", "bad"] : p.step === "locked" ? ["LOCKED", "mute"] : p.step === "intro" || p.step === "link" ? ["SETUP", "warn"] : p.step === "fund" ? p.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : p.payingOn && p.session && p.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function U(p, I, M = "", B) {
    const N = l("dt", p), y = l("dd", I, M);
    return B && y.append(" ", B), [N, y];
  }
  function _(p) {
    var ot, It, xe, Xt;
    if (t.hidden = p.step === "off", t.hidden) return;
    n(".ppp-badge").hidden = !((ot = p.gate) != null && ot.canary);
    const [I, M] = A(p), B = n(".ppp-state");
    B.textContent = I, B.className = "ppp-state" + (M ? " ppp-state--" + M : ""), B.hidden = !I;
    const N = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(p.step);
    r.hidden = !N, n(".ppp-frame-label").hidden = !N, r.classList.toggle("ppp-frame--active", !!p.busy), t.classList.toggle("ppp--armed", p.armed);
    const y = O6(p) ?? g;
    g = y;
    const E = n(".ppp-steps"), T = n(".ppp-stage");
    E.hidden = T.hidden = !y, y && (E.replaceChildren(...xc.map((rt, Tt) => {
      const ue = l("li", "", Tt < y.at ? "done" : Tt === y.at ? y.blocked ? "now blocked" : "now" : "");
      return ue.append(l("span", Tt < y.at ? "✓" : String(Tt + 1), "n"), rt), Tt === y.at && ue.setAttribute("aria-current", "step"), ue;
    })), T.textContent = y.caption, T.className = "ppp-stage " + (y.at >= xc.length ? "ppp-ok" : y.blocked ? "ppp-bad" : "ppp-cyan"));
    const O = n(".ppp-facts"), R = [];
    if (p.main && ((It = p.gate) != null && It.here) && R.push(...U("Your wallet", a(p.main), "ppp-addr-short")), p.listening) {
      const rt = f("Copy", () => {
        var Tt;
        return void ((Tt = navigator.clipboard) == null ? void 0 : Tt.writeText(p.listening || ""));
      }, "tiny");
      R.push(...U("Listening wallet", a(p.listening), "ppp-addr-short", rt));
    }
    if (p.listening && p.step !== "intro" && p.step !== "locked" && R.push(...p.linked ? U("Returns go to", a(p.linked), "ppp-addr-short") : U("Returns go to", "not linked yet", "ppp-warn")), p.balance !== void 0 && ["fund", "ready", "over"].includes(p.step)) {
      const rt = p.balanceState === "ok" ? "ppp-ok" : p.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      R.push(...U("Balance", `${bn(p.balance)} STX · about ${p.playsLeft.toLocaleString()} plays`, rt));
    }
    const D = p.entries.find((rt) => rt.kind === "play");
    D && R.push(...U("Last paid song", `${h(D)} → ${a(D.recipient)}`, b[D.status] || "")), O.replaceChildren(...R), O.hidden = !R.length;
    const Gt = n(".ppp-body"), tt = [], ht = [], m = Mo(BigInt(((xe = p.gate) == null ? void 0 : xe.limits.playFee) ?? "300")), L = `Each song you listen to for 30 seconds sends ${bn(yc)} STX to whoever holds it, plus a ${bn(m - yc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, et = !!p.busy;
    switch (p.step) {
      case "elsewhere": {
        if (tt.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain. Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet.")), (Xt = p.gate) != null && Xt.radioUrl) {
          const rt = l("p");
          rt.append(u("Open the pay-per-play radio →", p.gate.radioUrl)), tt.push(rt);
        }
        break;
      }
      case "connect":
        tt.push(l("p", "Pay artists a tiny amount for each song you listen to for 30 seconds, recorded on-chain. Connect your wallet above to turn it on. Listening is always free."));
        break;
      case "not-invited":
        tt.push(l("p", "Pay-per-play is in a small test right now. Listening is free for everyone, and it will open up soon.", "ppp-mute"));
        break;
      case "unsupported":
        tt.push(l("p", "This browser cannot create the passkey pay-per-play needs. Listening is free. Try Chrome or Safari on a current phone or computer.", "ppp-warn"));
        break;
      case "intro":
        tt.push(l("p", L)), tt.push(l("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), tt.push(l("p", "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), ht.push(f("Turn on pay-per-play", () => void o.create(), "primary")), ht.push(f("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        p.armed ? tt.push(l("p", "Tap “Unlock and keep paying” in the listening wallet box. It goes straight to your passkey.", "ppp-cyan")) : (tt.push(l("p", p.payingOn ? "Unlock it with your passkey to keep paying as you listen." : "Paying is switched off. Unlock to manage your wallet.", p.payingOn ? "" : "ppp-mute")), ht.push(f(p.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), ht.push(f("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        tt.push(l("p", p.serverLinked ? `This listening wallet was linked to ${a(p.main)} on another device. Confirm it in the listening wallet below.` : `Link the listening wallet to your main wallet ${a(p.main)}. This is one signature, not a transaction: no fee, no spending permission. Afterwards, returns can only go back to this main wallet.`)), tt.push(l("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ht.push(f(p.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        tt.push(l("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (p.entries.length ? tt.push(l("p", "Out of funds: songs play free until you top up. Paying carries on automatically once the top-up confirms.", "ppp-bad")) : p.payingOn && tt.push(l("p", "Paying is switched on. Add funds and it starts with the next song you listen to for 30 seconds.", "ppp-ok")), tt.push(l("p", `Add up to ${bn(p.allowance)} STX. 1 STX covers about ${Math.floor(Number(1000000n / m)).toLocaleString()} paid plays.`)), tt.push(l("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), p.depositPending && p.depositTxid) {
          const rt = l("p", "Deposit sent, waiting for it to confirm. This page checks automatically. ", "ppp-warn");
          rt.append(u("View", c(p.depositTxid))), tt.push(rt);
        } else p.allowance > 0n && ht.push(f(`Deposit ${bn(p.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        tt.push(l("p", `This wallet holds more than the recommended 1 STX, so paid plays are paused. Return the excess or everything to your main wallet ${a(p.linked)}.`, "ppp-bad")), ht.push(f("Return excess", () => void o.returnFunds("excess"), "primary"), f("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (p.payingOn && p.session && p.session.playsLeft > 0) {
          const rt = Math.min(p.session.playsLeft, p.playsLeft);
          tt.push(l("p", `Paying as you listen · up to ${rt.toLocaleString()} more plays remaining`, "ppp-ok")), tt.push(l("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free.", "ppp-mute")), ht.push(f("Switch off", () => void o.switchOff()));
        } else
          tt.push(l("p", "Paying is switched off. Music plays free.", "ppp-mute")), ht.push(f("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        p.balanceState === "low" && tt.push(l("p", "Running low. Top up to keep paying artists.", "ppp-warn")), p.depositPending ? tt.push(l("p", "Top-up sent, waiting for it to confirm.", "ppp-warn")) : p.allowance > 0n && p.balanceState !== "ok" && ht.push(f(`Top up ${bn(p.allowance)} STX`, () => void o.deposit()));
        break;
    }
    p.stuck && (tt.push(l("p", p.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${p.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ht.push(f("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(p.step) && p.linked && (p.balance ?? 0n) > 0n && ht.push(f("Return all to my wallet", () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(p.step) && ht.push(f("Lock", () => void o.lock(), "quiet")), ht.forEach((rt) => rt.disabled = et), Gt.replaceChildren(...tt), n(".ppp-actions").replaceChildren(...ht), n(".ppp-msg").textContent = p.busy || p.message, n(".ppp-err").textContent = p.error;
    const ut = n(".ppp-history");
    ut.hidden = !p.entries.length, ut.replaceChildren(l("summary", `Payments and returns (${p.entries.length})`), ...p.entries.slice(0, 20).map((rt) => {
      const Tt = l("div", "", "ppp-row"), ue = rt.kind === "play" ? [l("span", h(rt), "ppp-song"), l("span", ` · ${bn(BigInt(rt.amount))} STX to ${a(rt.recipient)}`, "ppp-mute")] : [l("span", `Returned ${bn(BigInt(rt.amount))} STX`, "ppp-song"), l("span", ` to ${a(rt.recipient)}`, "ppp-mute")];
      return Tt.append(
        l("span", x[rt.status] || rt.status, "ppp-status " + (b[rt.status] || "")),
        ...ue,
        l("span", ` · ${new Date(rt.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), rt.txid && Tt.append(u("tx ↗", c(rt.txid))), Tt;
    }));
  }
  const w = /* @__PURE__ */ new Map(), $ = () => {
    const p = window.XtrataRadio;
    return p != null && p.subscribe ? (p.subscribe((I) => {
      const M = I == null ? void 0 : I.nowPlaying;
      M && Number.isSafeInteger(Number(M.tokenId)) && w.set(Number(M.tokenId), { title: M.title || void 0, artist: M.artist || void 0 });
    }), !0) : !1;
  };
  if (!$()) {
    const p = setInterval(() => {
      $() && clearInterval(p);
    }, 500);
    setTimeout(() => clearInterval(p), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (p) => {
    const I = p.detail;
    I && Number.isSafeInteger(I.song) && typeof I.id == "string" && /^[0-9a-f]{32}$/.test(I.id) && o.onListened({ song: I.song, id: I.id, ...w.get(I.song) });
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const F6 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", z6 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, R6 = () => z6() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, G6 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, K6 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Hp = class {
  constructor(t) {
    P4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && rx(t), this.callback(go(t));
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
    var r, s, i, o, a, c, l, f, u, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (g = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = R6(), e = G6(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return V("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, V("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), V("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, V("div", { class: "flex flex-col space-y-[10px]" }, V("div", { class: "flex items-center" }, V("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), V("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, V("span", { class: "sr-only" }, "Close popup"), V("img", { src: F6 }))), r ? V("p", null, "Select the wallet you want to connect to.") : V("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && V("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && V("div", { class: "mt-6" }, V("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), V("ul", { class: "space-y-3" }, this.installedProviders.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), V("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && V("div", { class: "mt-6" }, r ? V("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : V("div", { class: "mb-5 flex justify-between" }, V("p", { class: "text-sm font-medium" }, "Recommended wallets"), V("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, V("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), V("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), V("p", null, "What is a wallet? ", V("span", { class: "align-text-bottom text-[9px]" }, "↗")))), V("ul", { class: "space-y-3" }, n.map((i) => V("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, V("div", { class: "aspect-square basis-9 overflow-hidden" }, V("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), V("div", { class: "flex-1" }, V("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && V("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && V("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return b4(this);
  }
};
Hp.style = K6;
const V6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Hp
}, Symbol.toStringTag, { value: "Module" }));
