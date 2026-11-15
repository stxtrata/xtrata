var Kb = Object.defineProperty;
var Vb = (t, e, n) => e in t ? Kb(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var zi = (t, e, n) => Vb(t, typeof e != "symbol" ? e + "" : e, n);
var fn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function rg(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function rl(t) {
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
      typeof fn < "u" && fn || {}, r = {
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
      function s(b) {
        return b && DataView.prototype.isPrototypeOf(b);
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
        ], i = ArrayBuffer.isView || function(b) {
          return b && o.indexOf(Object.prototype.toString.call(b)) > -1;
        };
      function c(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function l(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function f(b) {
        var I = {
          next: function() {
            var B = b.shift();
            return { done: B === void 0, value: B };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function h(b) {
        this.map = {}, b instanceof h ? b.forEach(function(I, B) {
          this.append(B, I);
        }, this) : Array.isArray(b) ? b.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(I) {
          this.append(I, b[I]);
        }, this);
      }
      h.prototype.append = function(b, I) {
        b = c(b), I = l(I);
        var B = this.map[b];
        this.map[b] = B ? B + ", " + I : I;
      }, h.prototype.delete = function(b) {
        delete this.map[c(b)];
      }, h.prototype.get = function(b) {
        return b = c(b), this.has(b) ? this.map[b] : null;
      }, h.prototype.has = function(b) {
        return this.map.hasOwnProperty(c(b));
      }, h.prototype.set = function(b, I) {
        this.map[c(b)] = l(I);
      }, h.prototype.forEach = function(b, I) {
        for (var B in this.map)
          this.map.hasOwnProperty(B) && b.call(I, this.map[B], B, this);
      }, h.prototype.keys = function() {
        var b = [];
        return this.forEach(function(I, B) {
          b.push(B);
        }), f(b);
      }, h.prototype.values = function() {
        var b = [];
        return this.forEach(function(I) {
          b.push(I);
        }), f(b);
      }, h.prototype.entries = function() {
        var b = [];
        return this.forEach(function(I, B) {
          b.push([B, I]);
        }), f(b);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function y(b) {
        return new Promise(function(I, B) {
          b.onload = function() {
            I(b.result);
          }, b.onerror = function() {
            B(b.error);
          };
        });
      }
      function p(b) {
        var I = new FileReader(), B = y(I);
        return I.readAsArrayBuffer(b), B;
      }
      function E(b) {
        var I = new FileReader(), B = y(I), M = /charset=([A-Za-z0-9_-]+)/.exec(b.type), V = M ? M[1] : "utf-8";
        return I.readAsText(b, V), B;
      }
      function S(b) {
        for (var I = new Uint8Array(b), B = new Array(I.length), M = 0; M < I.length; M++)
          B[M] = String.fromCharCode(I[M]);
        return B.join("");
      }
      function C(b) {
        if (b.slice)
          return b.slice(0);
        var I = new Uint8Array(b.byteLength);
        return I.set(new Uint8Array(b)), I.buffer;
      }
      function O() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = C(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = C(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
              return this.blob().then(p);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = d(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return E(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(_);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(b) {
        var I = b.toUpperCase();
        return H.indexOf(I) > -1 ? I : b;
      }
      function T(b, I) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var B = I.body;
        if (b instanceof T) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, I.headers || (this.headers = new h(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !B && b._bodyInit != null && (B = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new h(I.headers)), this.method = A(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && B)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(B), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var V = /\?/;
            this.url += (V.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function _(b) {
        var I = new FormData();
        return b.trim().split("&").forEach(function(B) {
          if (B) {
            var M = B.split("="), V = M.shift().replace(/\+/g, " "), R = M.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(V), decodeURIComponent(R));
          }
        }), I;
      }
      function q(b) {
        var I = new h(), B = b.replace(/\r?\n[\t ]+/g, " ");
        return B.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var V = M.split(":"), R = V.shift().trim();
          if (R) {
            var bt = V.join(":").trim();
            try {
              I.append(R, bt);
            } catch (dt) {
              console.warn("Response " + dt.message);
            }
          }
        }), I;
      }
      O.call(T.prototype);
      function it(b, I) {
        if (!(this instanceof it))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new h(I.headers), this.url = I.url || "", this._initBody(b);
      }
      O.call(it.prototype), it.prototype.clone = function() {
        return new it(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, it.error = function() {
        var b = new it(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var Q = [301, 302, 303, 307, 308];
      it.redirect = function(b, I) {
        if (Q.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new it(null, { status: I, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(I, B) {
          this.message = I, this.name = B;
          var M = Error(I);
          this.stack = M.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function K(b, I) {
        return new Promise(function(B, M) {
          var V = new T(b, I);
          if (V.signal && V.signal.aborted)
            return M(new e.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function bt() {
            R.abort();
          }
          R.onload = function() {
            var L = {
              statusText: R.statusText,
              headers: q(R.getAllResponseHeaders() || "")
            };
            V.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? L.status = 200 : L.status = R.status, L.url = "responseURL" in R ? R.responseURL : L.headers.get("X-Request-URL");
            var D = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              B(new it(D, L));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              M(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              M(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              M(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function dt(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (R.open(V.method, dt(V.url), !0), V.credentials === "include" ? R.withCredentials = !0 : V.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof h || n.Headers && I.headers instanceof n.Headers)) {
            var Gt = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(L) {
              Gt.push(c(L)), R.setRequestHeader(L, l(I.headers[L]));
            }), V.headers.forEach(function(L, D) {
              Gt.indexOf(D) === -1 && R.setRequestHeader(D, L);
            });
          } else
            V.headers.forEach(function(L, D) {
              R.setRequestHeader(D, L);
            });
          V.signal && (V.signal.addEventListener("abort", bt), R.onreadystatechange = function() {
            R.readyState === 4 && V.signal.removeEventListener("abort", bt);
          }), R.send(typeof V._bodyInit > "u" ? null : V._bodyInit);
        });
      }
      return K.polyfill = !0, n.fetch || (n.fetch = K, n.Headers = h, n.Request = T, n.Response = it), e.Headers = h, e.Request = T, e.Response = it, e.fetch = K, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : fn);
})();
const Yb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Xb(t, e) {
  const n = {};
  return Object.assign(n, Yb, e), await fetch(t, n);
}
function qb(t) {
  let e = Xb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Wb(...t) {
  const { fetchLib: e, middlewares: n } = qb(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: e,
        ...i
      })) ?? i);
    let c = await e(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var di;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(di || (di = {}));
var uo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(uo || (uo = {}));
var fh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(fh || (fh = {}));
const Zb = "https://api.mainnet.hiro.so", Qb = "https://api.testnet.hiro.so", Jb = "http://localhost:3999", tm = ["mainnet", "testnet", "devnet", "mocknet"];
let fi = class {
  constructor(e) {
    this.version = uo.Mainnet, this.chainId = di.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === uo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Wb();
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
      return new Su();
    case "testnet":
      return new em();
    case "devnet":
      return new nm();
    case "mocknet":
      return new sg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${tm.join(", ")}`);
  }
};
fi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : fi.fromName(t);
let Su = class extends fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Zb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = uo.Mainnet, this.chainId = di.Mainnet;
  }
}, em = class extends fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Qb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = uo.Testnet, this.chainId = di.Testnet;
  }
}, sg = class extends fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Jb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = uo.Testnet, this.chainId = di.Testnet;
  }
};
const nm = sg, og = "xtrata.wallet.bridge.v1", rm = (t) => typeof t == "object" && t !== null && t.protocol === og, sm = (t) => rm(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", om = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Gi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const hh = 12e4;
class im {
  constructor(e) {
    zi(this, "pending", /* @__PURE__ */ new Map());
    zi(this, "listenTarget");
    zi(this, "closed", !1);
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
    zi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !sm(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Gi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Gi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Gi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = om(), o = { protocol: og, kind: "request", id: s, method: e, params: n };
    return new Promise((i, c) => {
      const l = setTimeout(() => {
        this.pending.delete(s), c(
          new Gi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? hh}ms.`
          )
        );
      }, this.options.timeoutMs ?? hh);
      this.pending.set(s, { resolve: i, reject: c, timer: l }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Gi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const am = ["SP", "SM"], cm = ["ST", "SN"], lm = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return am.includes(n) ? "mainnet" : cm.includes(n) ? "testnet" : null;
}, um = () => {
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
}, dm = () => typeof window > "u" || !window.localStorage ? um() : window.localStorage, Dl = "xtrata.v15.1.wallet.session", ph = "mainnet", vc = { isConnected: !1 }, fm = (t) => t.address ? lm(t.address) ?? t.network : t.network, ig = (t) => !t.isConnected || !t.address ? { ...vc } : fm(t) !== ph ? { ...vc } : {
  isConnected: !0,
  address: t.address,
  network: ph,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, hm = (t) => {
  if (!t)
    return { ...vc };
  try {
    const e = JSON.parse(t);
    return ig(e);
  } catch {
    return { ...vc };
  }
}, pm = (t) => {
  const e = ig(t);
  return JSON.stringify(e);
}, gm = (t) => {
  const e = dm();
  return {
    load: () => hm(e.getItem(Dl)),
    save: (n) => {
      e.setItem(Dl, pm(n));
    },
    clear: () => {
      e.removeItem(Dl);
    }
  };
}, ym = "https://browser.blockstack.org/auth", wm = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ag = ["store_write"], bm = "blockstack-session", mm = {
  logLevel: "debug"
}, Lo = {
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
Object.freeze(Lo);
class Ci extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, s = this.stack;
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

${r}`, this.message = n, this.code = e.code, this.parameter = e.parameter ? e.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class xm extends Ci {
  constructor(e, n = "") {
    super({ code: Lo.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class gh extends Ci {
  constructor(e = "") {
    super({ code: Lo.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Na extends Ci {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Lo.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class yh extends Ci {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Lo.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Eu extends Ci {
  constructor(e) {
    super({ code: Lo.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class cg extends Ci {
  constructor(e) {
    super({ code: Lo.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const wh = ["debug", "info", "warn", "error", "none"], Au = {};
for (let t = 0; t < wh.length; t++) {
  const e = wh[t];
  Au[e] = t;
}
class ri {
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
    return Au[mm.logLevel] <= Au[e];
  }
}
function Sm() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Em() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Fl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Am() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function vm() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function km(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Td(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = vm(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    ri.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = km(s, t.toString(), n);
    throw ri.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Ds(t, e) {
  return Bd(rn(t), e);
}
function rn(t) {
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
    return BigInt(`0x${gt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function $m(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function bh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ma(t, e = 8) {
  return (typeof t == "bigint" ? t : rn(t)).toString(16).padStart(e * 2, "0");
}
function sl(t) {
  return parseInt(t, 16);
}
function Bd(t, e = 16) {
  const n = ma(t, e);
  return qt(n);
}
function Im(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Lm(t, e) {
  return t & BigInt(1) << e;
}
function vu(t) {
  return Cm(BigInt(`0x${gt(t)}`), BigInt(t.byteLength * 8));
}
function Cm(t, e) {
  return Lm(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Tm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Tm[n];
  return e;
}
function qt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = $m(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function Co(t) {
  return new TextEncoder().encode(t);
}
function xa(t) {
  return new TextDecoder().decode(t);
}
function Bm(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Mm(t) {
  return String.fromCharCode.apply(null, t);
}
function Nm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function mh(t) {
  if (t.some(Nm))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function kr(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Ue(t) {
  return kr(...t.map((e) => typeof e == "number" ? mh([e]) : e instanceof Array ? mh(e) : e));
}
function En(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const lg = "https://api.mainnet.hiro.so", ug = "https://api.testnet.hiro.so", dg = "http://localhost:3999", _m = "https://hub.blockstack.org", Pm = 33, jl = 32;
function Um(t) {
  if (t.length < jl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + jl * 2), r = t.slice(2 + jl * 2);
  return {
    recoveryId: sl(e),
    r: n,
    s: r
  };
}
function Md(t) {
  const e = typeof t == "string" ? qt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Hm(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Om(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Dm(t, e) {
  return t[e];
}
function Fm(t, e, n = 0) {
  return t[n] = e, t;
}
function jm(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function fo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Rm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function zm(t, e) {
  const n = {};
  return Object.assign(n, Rm, e), await fetch(t, n);
}
function Gm(t) {
  let e = zm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Km(...t) {
  const { fetchLib: e, middlewares: n } = Gm(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: e,
        ...i
      })) ?? i);
    let c = await e(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class fg {
  constructor(e = ag.slice(), n = ((c) => (c = Td("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", s = "/manifest.json", o = void 0, i = ym) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ku(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Vm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ym(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ku(t.outputLen), ku(t.blockLen);
}
function Xm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qm(t, e) {
  hg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const eo = {
  number: ku,
  bool: Vm,
  bytes: hg,
  hash: Ym,
  exists: Xm,
  output: qm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Rl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, Wm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Wm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Zm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nd(t) {
  if (typeof t == "string" && (t = Zm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let pg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function To(t) {
  const e = (r) => t().update(Nd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let gg = class extends pg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, eo.hash(e);
    const r = Nd(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(e) {
    return eo.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    eo.exists(this), eo.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const ol = (t, e, n) => new gg(t, e).update(n).digest();
ol.create = (t, e) => new gg(t, e);
function Qm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), l = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + f, c, r);
}
let _d = class extends pg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Rl(this.buffer);
  }
  update(e) {
    eo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Nd(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const l = Rl(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    eo.exists(this), eo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    Qm(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Rl(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = l / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < f; d++)
      c.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const Jm = (t, e, n) => t & e ^ ~t & n, t1 = (t, e, n) => t & e ^ t & n ^ e & n, e1 = new Uint32Array([
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
let yg = class extends _d {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: l } = this;
    return [e, n, r, s, o, i, c, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ls[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const y = ls[d - 15], p = ls[d - 2], E = dr(y, 7) ^ dr(y, 18) ^ y >>> 3, S = dr(p, 17) ^ dr(p, 19) ^ p >>> 10;
      ls[d] = S + ls[d - 7] + E + ls[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: l, G: f, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const y = dr(c, 6) ^ dr(c, 11) ^ dr(c, 25), p = h + y + Jm(c, l, f) + e1[d] + ls[d] | 0, S = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + t1(r, s, o) | 0;
      h = f, f = l, l = c, c = i + p | 0, i = o, o = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, l, f, h);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, n1 = class extends yg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const hi = To(() => new yg());
To(() => new n1());
const r1 = {}, wg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: r1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Vt = BigInt(0), xe = BigInt(1), _s = BigInt(2), ta = BigInt(3), xh = BigInt(8), le = Object.freeze({
  a: Vt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: xe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Sh = (t, e) => (t + e / _s) / e, _a = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = le, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -xe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), c = Sh(o * t, e), l = Sh(-r * t, e);
    let f = ot(t - c * n - l * s, e), h = ot(-c * r - l * o, e);
    const d = f > i, y = h > i;
    if (d && (f = e - f), y && (h = e - h), f > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: d, k1: f, k2neg: y, k2: h };
  }
}, sr = 32, ho = 32, bg = 32, kc = sr + 1, $c = 2 * sr + 1;
function Eh(t) {
  const { a: e, b: n } = le, r = ot(t * t), s = ot(r * t);
  return ot(s + e * t + n);
}
const Pa = le.a === Vt;
class Pd extends Error {
  constructor(e) {
    super(e);
  }
}
function Ah(t) {
  if (!(t instanceof Jt))
    throw new TypeError("JacobianPoint expected");
}
class Jt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ft))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ft.ZERO) ? Jt.ZERO : new Jt(e.x, e.y, xe);
  }
  static toAffineBatch(e) {
    const n = c1(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Jt.toAffineBatch(e).map(Jt.fromAffine);
  }
  equals(e) {
    Ah(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e, l = ot(s * s), f = ot(c * c), h = ot(n * f), d = ot(o * l), y = ot(ot(r * c) * f), p = ot(ot(i * s) * l);
    return h === d && y === p;
  }
  negate() {
    return new Jt(this.x, ot(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = ot(e * e), o = ot(n * n), i = ot(o * o), c = e + o, l = ot(_s * (ot(c * c) - s - i)), f = ot(ta * s), h = ot(f * f), d = ot(h - _s * l), y = ot(f * (l - d) - xh * i), p = ot(_s * n * r);
    return new Jt(d, y, p);
  }
  add(e) {
    Ah(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: c } = e;
    if (o === Vt || i === Vt)
      return this;
    if (n === Vt || r === Vt)
      return e;
    const l = ot(s * s), f = ot(c * c), h = ot(n * f), d = ot(o * l), y = ot(ot(r * c) * f), p = ot(ot(i * s) * l), E = ot(d - h), S = ot(p - y);
    if (E === Vt)
      return S === Vt ? this.double() : Jt.ZERO;
    const C = ot(E * E), O = ot(E * C), H = ot(h * C), A = ot(S * S - O - _s * H), T = ot(S * (H - A) - y * O), _ = ot(s * c * E);
    return new Jt(A, T, _);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Jt.ZERO;
    if (typeof e == "bigint" && e === Vt)
      return n;
    let r = $h(e);
    if (r === xe)
      return this;
    if (!Pa) {
      let d = n, y = this;
      for (; r > Vt; )
        r & xe && (d = d.add(y)), y = y.double(), r >>= xe;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: c } = _a.splitScalar(r), l = n, f = n, h = this;
    for (; o > Vt || c > Vt; )
      o & xe && (l = l.add(h)), c & xe && (f = f.add(h)), h = h.double(), o >>= xe, c >>= xe;
    return s && (l = l.negate()), i && (f = f.negate()), f = new Jt(ot(f.x * _a.beta), f.y, f.z), l.add(f);
  }
  precomputeWindow(e) {
    const n = Pa ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let c = 1; c < 2 ** (e - 1); c++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(Jt.BASE) && (n = Ft.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && $u.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Jt.normalizeZ(s), $u.set(n, s)));
    let o = Jt.ZERO, i = Jt.BASE;
    const c = 1 + (Pa ? 128 / r : 256 / r), l = 2 ** (r - 1), f = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let y = 0; y < c; y++) {
      const p = y * l;
      let E = Number(e & f);
      e >>= d, E > l && (E -= h, e += xe);
      const S = p, C = p + Math.abs(E) - 1, O = y % 2 !== 0, H = E < 0;
      E === 0 ? i = i.add(Ua(O, s[S])) : o = o.add(Ua(H, s[C]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = $h(e), s, o;
    if (Pa) {
      const { k1neg: i, k1: c, k2neg: l, k2: f } = _a.splitScalar(r);
      let { p: h, f: d } = this.wNAF(c, n), { p: y, f: p } = this.wNAF(f, n);
      h = Ua(i, h), y = Ua(l, y), y = new Jt(ot(y.x * _a.beta), y.y, y.z), s = h.add(y), o = d.add(p);
    } else {
      const { p: i, f: c } = this.wNAF(r, n);
      s = i, o = c;
    }
    return Jt.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(Jt.ZERO);
    e == null && (e = o ? xh : Ti(s));
    const i = e, c = ot(i * i), l = ot(c * i), f = ot(n * c), h = ot(r * l), d = ot(s * i);
    if (o)
      return Ft.ZERO;
    if (d !== xe)
      throw new Error("invZ was invalid");
    return new Ft(f, h);
  }
}
Jt.BASE = new Jt(le.Gx, le.Gy, xe);
Jt.ZERO = new Jt(Vt, xe, Vt);
function Ua(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const $u = /* @__PURE__ */ new WeakMap();
class Ft {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, $u.delete(this);
  }
  hasEvenY() {
    return this.y % _s === Vt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Pn(n ? e : e.subarray(1));
    if (!pc(r))
      throw new Error("Point is not on curve");
    const s = Eh(r);
    let o = a1(s);
    const i = (o & xe) === xe;
    n ? i && (o = ot(-o)) : (e[0] & 1) === 1 !== i && (o = ot(-o));
    const c = new Ft(r, o);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(e) {
    const n = Pn(e.subarray(1, sr + 1)), r = Pn(e.subarray(sr + 1, sr * 2 + 1)), s = new Ft(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = $r(e), r = n.length, s = n[0];
    if (r === sr)
      return this.fromCompressedHex(n);
    if (r === kc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === $c && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${kc} compressed bytes or ${$c} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ft.BASE.multiply(po(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = Sg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Ud($r(e)), { n: c } = le, l = r === 2 || r === 3 ? s + c : s, f = Ti(l, c), h = ot(-i * f, c), d = ot(o * f, c), y = r & 1 ? "03" : "02", p = Ft.fromHex(y + Ps(l)), E = Ft.BASE.multiplyAndAddUnsafe(p, h, d);
    if (!E)
      throw new Error("Cannot recover signature: point at infinify");
    return E.assertValidity(), E;
  }
  toRawBytes(e = !1) {
    return Us(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ps(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ps(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!pc(n) || !pc(r))
      throw new Error(e);
    const s = ot(r * r), o = Eh(n);
    if (ot(s - o) !== Vt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ft(this.x, ot(-this.y));
  }
  double() {
    return Jt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Jt.fromAffine(this).add(Jt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Jt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Jt.fromAffine(this), o = n === Vt || n === xe || this !== Ft.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = Jt.fromAffine(e).multiplyUnsafe(r), c = o.add(i);
    return c.equals(Jt.ZERO) ? void 0 : c.toAffine();
  }
}
Ft.BASE = new Ft(le.Gx, le.Gy);
Ft.ZERO = new Ft(Vt, Vt);
function vh(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function kh(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${pi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Pn(n), left: t.subarray(e + 2) };
}
function s1(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${pi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = kh(t.subarray(2)), { data: r, left: s } = kh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${pi(s)}`);
  return { r: e, s: r };
}
class _n {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? pi(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new _n(Ic(s.slice(0, 64)), Ic(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = s1(n ? e : Us(e));
    return new _n(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!yi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!yi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = le.n >> xe;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new _n(this.r, ot(-this.s, le.n)) : this;
  }
  toDERRawBytes() {
    return Us(this.toDERHex());
  }
  toDERHex() {
    const e = vh(Ki(this.s)), n = vh(Ki(this.r)), r = e.length / 2, s = n.length / 2, o = Ki(r), i = Ki(s);
    return `30${Ki(s + r + 4)}02${i}${n}02${o}${e}`;
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
function Ms(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const o1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function pi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += o1[t[n]];
  return e;
}
const i1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ps(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Vt <= t && t < i1))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function gi(t) {
  const e = Us(Ps(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Ki(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ic(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Us(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    e[n] = o;
  }
  return e;
}
function Pn(t) {
  return Ic(pi(t));
}
function $r(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Us(t);
}
function $h(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && yi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ot(t, e = le.P) {
  const n = t % e;
  return n >= Vt ? n : e + n;
}
function jn(t, e) {
  const { P: n } = le;
  let r = t;
  for (; e-- > Vt; )
    r *= r, r %= n;
  return r;
}
function a1(t) {
  const { P: e } = le, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), c = BigInt(88), l = t * t * t % e, f = l * l * t % e, h = jn(f, ta) * f % e, d = jn(h, ta) * f % e, y = jn(d, _s) * l % e, p = jn(y, r) * y % e, E = jn(p, s) * p % e, S = jn(E, i) * E % e, C = jn(S, c) * S % e, O = jn(C, i) * E % e, H = jn(O, ta) * f % e, A = jn(H, o) * p % e, T = jn(A, n) * l % e, _ = jn(T, _s);
  if (_ * _ % e !== t)
    throw new Error("Cannot find square root");
  return _;
}
function Ti(t, e = le.P) {
  if (t === Vt || e <= Vt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = ot(t, e), r = e, s = Vt, o = xe;
  for (; n !== Vt; ) {
    const c = r / n, l = r % n, f = s - o * c;
    r = n, n = l, s = o, o = f;
  }
  if (r !== xe)
    throw new Error("invert: does not exist");
  return ot(s, e);
}
function c1(t, e = le.P) {
  const n = new Array(t.length), r = t.reduce((o, i, c) => i === Vt ? o : (n[c] = o, ot(o * i, e)), xe), s = Ti(r, e);
  return t.reduceRight((o, i, c) => i === Vt ? o : (n[c] = ot(o * n[c], e), ot(o * i, e)), s), n;
}
function l1(t) {
  const e = t.length * 8 - ho * 8, n = Pn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Ud(t, e = !1) {
  const n = l1(t);
  if (e)
    return n;
  const { n: r } = le;
  return n >= r ? n - r : n;
}
let li, ea;
class mg {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Be.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ea(this.k, ...e);
  }
  checkSync() {
    if (typeof ea != "function")
      throw new Pd("hmacSha256Sync needs to be set");
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
    return Ms(...n);
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
    return Ms(...n);
  }
}
function yi(t) {
  return Vt < t && t < le.n;
}
function pc(t) {
  return Vt < t && t < le.P;
}
function xg(t, e, n, r = !0) {
  const { n: s } = le, o = Ud(t, !0);
  if (!yi(o))
    return;
  const i = Ti(o, s), c = Ft.BASE.multiply(o), l = ot(c.x, s);
  if (l === Vt)
    return;
  const f = ot(i * ot(e + n * l, s), s);
  if (f === Vt)
    return;
  let h = new _n(l, f), d = (c.x === h.r ? 0 : 2) | Number(c.y & xe);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function po(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ho)
      throw new Error("Expected 32 bytes of private key");
    e = Ic(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ho)
      throw new Error("Expected 32 bytes of private key");
    e = Pn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!yi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Hd(t) {
  return t instanceof Ft ? (t.assertValidity(), t) : Ft.fromHex(t);
}
function Sg(t) {
  if (t instanceof _n)
    return t.assertValidity(), t;
  try {
    return _n.fromDER(t);
  } catch {
    return _n.fromCompact(t);
  }
}
function Sa(t, e = !1) {
  return Ft.fromPrivateKey(t).toRawBytes(e);
}
function u1(t, e, n, r = !1) {
  return Ft.fromSignature(t, e, n).toRawBytes(r);
}
function Ih(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === kc || r === $c : n ? r === kc * 2 || r === $c * 2 : t instanceof Ft;
}
function Od(t, e, n = !1) {
  if (Ih(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Ih(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Hd(e);
  return r.assertValidity(), r.multiply(po(t)).toRawBytes(n);
}
function Eg(t) {
  const e = t.length > sr ? t.slice(0, sr) : t;
  return Pn(e);
}
function d1(t) {
  const e = Eg(t), n = ot(e, le.n);
  return Ag(n < Vt ? e : n);
}
function Ag(t) {
  return gi(t);
}
function vg(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = $r(t), s = po(e), o = [Ag(s), d1(r)];
  if (n != null) {
    n === !0 && (n = Be.randomBytes(sr));
    const l = $r(n);
    if (l.length !== sr)
      throw new Error(`sign: Expected ${sr} bytes of extra data`);
    o.push(l);
  }
  const i = Ms(...o), c = Eg(r);
  return { seed: i, m: c, d: s };
}
function kg(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function f1(t, e, n = {}) {
  const { seed: r, m: s, d: o } = vg(t, e, n.extraEntropy), i = new mg(bg, ho);
  await i.reseed(r);
  let c;
  for (; !(c = xg(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return kg(c, n);
}
function il(t, e, n = {}) {
  const { seed: r, m: s, d: o } = vg(t, e, n.extraEntropy), i = new mg(bg, ho);
  i.reseedSync(r);
  let c;
  for (; !(c = xg(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return kg(c, n);
}
const h1 = { strict: !0 };
function p1(t, e, n, r = h1) {
  let s;
  try {
    s = Sg(t), e = $r(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const c = Ud(e);
  let l;
  try {
    l = Hd(n);
  } catch {
    return !1;
  }
  const { n: f } = le, h = Ti(i, f), d = ot(c * h, f), y = ot(o * h, f), p = Ft.BASE.multiplyAndAddUnsafe(l, d, y);
  return p ? ot(p.x, f) === o : !1;
}
function Lc(t) {
  return ot(Pn(t), le.n);
}
class wi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = $r(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Pn(n.subarray(0, 32)), s = Pn(n.subarray(32, 64));
    return new wi(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!pc(e) || !yi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ps(this.r) + Ps(this.s);
  }
  toRawBytes() {
    return Us(this.toHex());
  }
}
function g1(t) {
  return Ft.fromPrivateKey(t).toRawX();
}
class $g {
  constructor(e, n, r = Be.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = $r(e);
    const { x: s, scalar: o } = this.getScalar(po(n));
    if (this.px = s, this.d = o, this.rand = $r(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ft.fromPrivateKey(e), r = n.hasEvenY() ? e : le.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return gi(e ^ Pn(n));
  }
  finalizeNonce(e) {
    const n = ot(Pn(e), le.n);
    if (n === Vt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new wi(e.x, ot(n + r * s, le.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = Be.taggedHash, i = this.initNonce(n, await o(Bs.aux, s)), { R: c, rx: l, k: f } = this.finalizeNonce(await o(Bs.nonce, i, r, e)), h = Lc(await o(Bs.challenge, l, r, e)), d = this.finalizeSig(c, f, h, n);
    return await Cg(d, e, r) || this.error(), d;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = Be.taggedHashSync, i = this.initNonce(n, o(Bs.aux, s)), { R: c, rx: l, k: f } = this.finalizeNonce(o(Bs.nonce, i, r, e)), h = Lc(o(Bs.challenge, l, r, e)), d = this.finalizeSig(c, f, h, n);
    return Tg(d, e, r) || this.error(), d;
  }
}
async function y1(t, e, n) {
  return new $g(t, e, n).calc();
}
function w1(t, e, n) {
  return new $g(t, e, n).calcSync();
}
function Ig(t, e, n) {
  const r = t instanceof wi, s = r ? t : wi.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: $r(e),
    P: Hd(n)
  };
}
function Lg(t, e, n, r) {
  const s = Ft.BASE.multiplyAndAddUnsafe(e, po(n), ot(-r, le.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Cg(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Ig(t, e, n), c = Lc(await Be.taggedHash(Bs.challenge, gi(r), i.toRawX(), o));
    return Lg(r, i, s, c);
  } catch {
    return !1;
  }
}
function Tg(t, e, n) {
  try {
    const { r, s, m: o, P: i } = Ig(t, e, n), c = Lc(Be.taggedHashSync(Bs.challenge, gi(r), i.toRawX(), o));
    return Lg(r, i, s, c);
  } catch (r) {
    if (r instanceof Pd)
      throw r;
    return !1;
  }
}
const b1 = {
  Signature: wi,
  getPublicKey: g1,
  sign: y1,
  verify: Cg,
  signSync: w1,
  verifySync: Tg
};
Ft.BASE._setWindowSize(8);
const Cn = {
  node: wg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Bs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ha = {}, Be = {
  bytesToHex: pi,
  hexToBytes: Us,
  concatBytes: Ms,
  mod: ot,
  invert: Ti,
  isValidPrivateKey(t) {
    try {
      return po(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: gi,
  _normalizePrivateKey: po,
  hashToPrivateKey: (t) => {
    t = $r(t);
    const e = ho + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ot(Pn(t), le.n - xe) + xe;
    return gi(n);
  },
  randomBytes: (t = 32) => {
    if (Cn.web)
      return Cn.web.getRandomValues(new Uint8Array(t));
    if (Cn.node) {
      const { randomBytes: e } = Cn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Be.hashToPrivateKey(Be.randomBytes(ho + 8)),
  precompute(t = 8, e = Ft.BASE) {
    const n = e === Ft.BASE ? e : new Ft(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ta), n;
  },
  sha256: async (...t) => {
    if (Cn.web) {
      const e = await Cn.web.subtle.digest("SHA-256", Ms(...t));
      return new Uint8Array(e);
    } else if (Cn.node) {
      const { createHash: e } = Cn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Cn.web) {
      const n = await Cn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ms(...e), s = await Cn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Cn.node) {
      const { createHmac: n } = Cn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ha[t];
    if (n === void 0) {
      const r = await Be.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Ha[t] = n;
    }
    return Be.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof li != "function")
      throw new Pd("sha256Sync is undefined, you need to set it");
    let n = Ha[t];
    if (n === void 0) {
      const r = li(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Ha[t] = n;
    }
    return li(n, ...e);
  },
  _JacobianPoint: Jt
};
Object.defineProperties(Be, {
  sha256Sync: {
    configurable: !1,
    get() {
      return li;
    },
    set(t) {
      li || (li = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ea;
    },
    set(t) {
      ea || (ea = t);
    }
  }
});
const m1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: le,
  Point: Ft,
  Signature: _n,
  getPublicKey: Sa,
  getSharedSecret: Od,
  recoverPublicKey: u1,
  schnorr: b1,
  sign: f1,
  signSync: il,
  utils: Be,
  verify: p1
}, Symbol.toStringTag, { value: "Module" }));
var Ea = {};
Ea.byteLength = v1;
var x1 = Ea.toByteArray = $1, S1 = Ea.fromByteArray = C1, br = [], Kn = [], E1 = typeof Uint8Array < "u" ? Uint8Array : Array, zl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Wo = 0, A1 = zl.length; Wo < A1; ++Wo)
  br[Wo] = zl[Wo], Kn[zl.charCodeAt(Wo)] = Wo;
Kn[45] = 62;
Kn[95] = 63;
function Bg(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function v1(t) {
  var e = Bg(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function k1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function $1(t) {
  var e, n = Bg(t), r = n[0], s = n[1], o = new E1(k1(t, r, s)), i = 0, c = s > 0 ? r - 4 : r, l;
  for (l = 0; l < c; l += 4)
    e = Kn[t.charCodeAt(l)] << 18 | Kn[t.charCodeAt(l + 1)] << 12 | Kn[t.charCodeAt(l + 2)] << 6 | Kn[t.charCodeAt(l + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = Kn[t.charCodeAt(l)] << 2 | Kn[t.charCodeAt(l + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = Kn[t.charCodeAt(l)] << 10 | Kn[t.charCodeAt(l + 1)] << 4 | Kn[t.charCodeAt(l + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function I1(t) {
  return br[t >> 18 & 63] + br[t >> 12 & 63] + br[t >> 6 & 63] + br[t & 63];
}
function L1(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push(I1(r));
  return s.join("");
}
function C1(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, c = n - r; i < c; i += o)
    s.push(L1(t, i, i + o > c ? c : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    br[e >> 2] + br[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    br[e >> 10] + br[e >> 4 & 63] + br[e << 2 & 63] + "="
  )), s.join("");
}
function T1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const B1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function M1() {
  if (T1())
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
    throw new Error(B1);
  }
}
class N1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array(kr(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array(kr(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class _1 {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), l = await this.subtleCrypto.encrypt({ name: o, iv: r }, c, s);
    return new Uint8Array(l);
  }
  async decrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), l = await this.subtleCrypto.decrypt({ name: o, iv: r }, c, s);
    return new Uint8Array(l);
  }
}
async function Mg() {
  const t = await M1();
  return t.name === "subtleCrypto" ? new _1(t.lib) : new N1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function P1(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var s = t.charAt(r), o = s.charCodeAt(0);
    if (e[o] !== 255)
      throw new TypeError(s + " is ambiguous");
    e[o] = r;
  }
  var i = t.length, c = t.charAt(0), l = Math.log(i) / Math.log(256), f = Math.log(256) / Math.log(i);
  function h(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var E = 0, S = 0, C = 0, O = p.length; C !== O && p[C] === 0; )
      C++, E++;
    for (var H = (O - C) * f + 1 >>> 0, A = new Uint8Array(H); C !== O; ) {
      for (var T = p[C], _ = 0, q = H - 1; (T !== 0 || _ < S) && q !== -1; q--, _++)
        T += 256 * A[q] >>> 0, A[q] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      S = _, C++;
    }
    for (var it = H - S; it !== H && A[it] === 0; )
      it++;
    for (var Q = c.repeat(E); it < H; ++it)
      Q += t.charAt(A[it]);
    return Q;
  }
  function d(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var E = 0, S = 0, C = 0; p[E] === c; )
      S++, E++;
    for (var O = (p.length - E) * l + 1 >>> 0, H = new Uint8Array(O); p[E]; ) {
      var A = p.charCodeAt(E);
      if (A > 255)
        return;
      var T = e[A];
      if (T === 255)
        return;
      for (var _ = 0, q = O - 1; (T !== 0 || _ < C) && q !== -1; q--, _++)
        T += i * H[q] >>> 0, H[q] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      C = _, E++;
    }
    for (var it = O - C; it !== O && H[it] === 0; )
      it++;
    for (var Q = new Uint8Array(S + (O - it)), K = S; it !== O; )
      Q[K++] = H[it++];
    return Q;
  }
  function y(p) {
    var E = d(p);
    if (E)
      return E;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: y
  };
}
var Ng = P1;
const U1 = Ng, H1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var O1 = U1(H1);
const D1 = /* @__PURE__ */ rg(O1), F1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _g = Uint8Array.from({ length: 16 }, (t, e) => e), j1 = _g.map((t) => (9 * t + 5) % 16);
let Dd = [_g], Fd = [j1];
for (let t = 0; t < 4; t++)
  for (let e of [Dd, Fd])
    e.push(e[t].map((n) => F1[n]));
const Pg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), R1 = Dd.map((t, e) => t.map((n) => Pg[e][n])), z1 = Fd.map((t, e) => t.map((n) => Pg[e][n])), G1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), K1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oa = (t, e) => t << e | t >>> 32 - e;
function Lh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Da = new Uint32Array(16);
let V1 = class extends _d {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Da[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, l = c, f = this.h3 | 0, h = f, d = this.h4 | 0, y = d;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, S = G1[p], C = K1[p], O = Dd[p], H = Fd[p], A = R1[p], T = z1[p];
      for (let _ = 0; _ < 16; _++) {
        const q = Oa(r + Lh(p, o, c, f) + Da[O[_]] + S, A[_]) + d | 0;
        r = d, d = f, f = Oa(c, 10) | 0, c = o, o = q;
      }
      for (let _ = 0; _ < 16; _++) {
        const q = Oa(s + Lh(E, i, l, h) + Da[H[_]] + C, T[_]) + y | 0;
        s = y, y = h, h = Oa(l, 10) | 0, l = i, i = q;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + y | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Da.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Y1 = To(() => new V1());
function X1(t) {
  return Y1(t);
}
const Fa = BigInt(2 ** 32 - 1), Iu = BigInt(32);
function Ug(t, e = !1) {
  return e ? { h: Number(t & Fa), l: Number(t >> Iu & Fa) } : { h: Number(t >> Iu & Fa) | 0, l: Number(t & Fa) | 0 };
}
function q1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Ug(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const W1 = (t, e) => BigInt(t >>> 0) << Iu | BigInt(e >>> 0), Z1 = (t, e, n) => t >>> n, Q1 = (t, e, n) => t << 32 - n | e >>> n, J1 = (t, e, n) => t >>> n | e << 32 - n, t2 = (t, e, n) => t << 32 - n | e >>> n, e2 = (t, e, n) => t << 64 - n | e >>> n - 32, n2 = (t, e, n) => t >>> n - 32 | e << 64 - n, r2 = (t, e) => e, s2 = (t, e) => t, o2 = (t, e, n) => t << n | e >>> 32 - n, i2 = (t, e, n) => e << n | t >>> 32 - n, a2 = (t, e, n) => e << n - 32 | t >>> 64 - n, c2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const u2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), d2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, f2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), h2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, p2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), g2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: Ug,
  split: q1,
  toBig: W1,
  shrSH: Z1,
  shrSL: Q1,
  rotrSH: J1,
  rotrSL: t2,
  rotrBH: e2,
  rotrBL: n2,
  rotr32H: r2,
  rotr32L: s2,
  rotlSH: o2,
  rotlSL: i2,
  rotlBH: a2,
  rotlBL: c2,
  add: l2,
  add3L: u2,
  add3H: d2,
  add4L: f2,
  add4H: h2,
  add5H: g2,
  add5L: p2
}, [y2, w2] = Nt.split([
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
].map((t) => BigInt(t))), us = new Uint32Array(80), ds = new Uint32Array(80);
let al = class extends _d {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: l, Eh: f, El: h, Fh: d, Fl: y, Gh: p, Gl: E, Hh: S, Hl: C } = this;
    return [e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      us[A] = e.getUint32(n), ds[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = us[A - 15] | 0, _ = ds[A - 15] | 0, q = Nt.rotrSH(T, _, 1) ^ Nt.rotrSH(T, _, 8) ^ Nt.shrSH(T, _, 7), it = Nt.rotrSL(T, _, 1) ^ Nt.rotrSL(T, _, 8) ^ Nt.shrSL(T, _, 7), Q = us[A - 2] | 0, K = ds[A - 2] | 0, b = Nt.rotrSH(Q, K, 19) ^ Nt.rotrBH(Q, K, 61) ^ Nt.shrSH(Q, K, 6), I = Nt.rotrSL(Q, K, 19) ^ Nt.rotrBL(Q, K, 61) ^ Nt.shrSL(Q, K, 6), B = Nt.add4L(it, I, ds[A - 7], ds[A - 16]), M = Nt.add4H(B, q, b, us[A - 7], us[A - 16]);
      us[A] = M | 0, ds[A] = B | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: l, Dh: f, Dl: h, Eh: d, El: y, Fh: p, Fl: E, Gh: S, Gl: C, Hh: O, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const T = Nt.rotrSH(d, y, 14) ^ Nt.rotrSH(d, y, 18) ^ Nt.rotrBH(d, y, 41), _ = Nt.rotrSL(d, y, 14) ^ Nt.rotrSL(d, y, 18) ^ Nt.rotrBL(d, y, 41), q = d & p ^ ~d & S, it = y & E ^ ~y & C, Q = Nt.add5L(H, _, it, w2[A], ds[A]), K = Nt.add5H(Q, O, T, q, y2[A], us[A]), b = Q | 0, I = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), B = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), M = r & o ^ r & c ^ o & c, V = s & i ^ s & l ^ i & l;
      O = S | 0, H = C | 0, S = p | 0, C = E | 0, p = d | 0, E = y | 0, { h: d, l: y } = Nt.add(f | 0, h | 0, K | 0, b | 0), f = c | 0, h = l | 0, c = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const R = Nt.add3L(b, B, V);
      r = Nt.add3H(R, K, I, M), s = R | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Nt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l } = Nt.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: f, l: h } = Nt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: d, l: y } = Nt.add(this.Eh | 0, this.El | 0, d | 0, y | 0), { h: p, l: E } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: S, l: C } = Nt.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: O, l: H } = Nt.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, c, l, f, h, d, y, p, E, S, C, O, H);
  }
  roundClean() {
    us.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, b2 = class extends al {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, m2 = class extends al {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, x2 = class extends al {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const S2 = To(() => new al());
To(() => new b2());
To(() => new m2());
To(() => new x2());
function Hg(t) {
  return hi(t);
}
function E2(t) {
  return S2(t);
}
const A2 = 0;
Be.hmacSha256Sync = (t, ...e) => {
  const n = ol.create(hi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function v2() {
  return gt(Be.randomPrivateKey());
}
function k2(t) {
  const e = hi(hi(t));
  return D1.encode(kr(t, e).slice(0, t.length + 4));
}
function $2(t, e) {
  return k2(kr(new Uint8Array([t]), e.slice(0, 20)));
}
function Og(t, e = A2) {
  const n = typeof t == "string" ? qt(t) : t, r = X1(Hg(n));
  return $2(e, r);
}
function Dg(t) {
  const e = Md(t);
  return gt(Sa(e.slice(0, 32), !0));
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = ol.create(hi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Cc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Cc || (Cc = {}));
async function I2(t, e, n) {
  return await (await Mg()).encrypt("aes-256-cbc", e, t, n);
}
async function L2(t, e, n) {
  return await (await Mg()).decrypt("aes-256-cbc", e, t, n);
}
function Fg(t, e) {
  return ol(hi, t, e);
}
function C2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function jg(t) {
  const e = E2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function T2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function B2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Cc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Cc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !T2(t))
    return e;
  try {
    return Ft.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function M2(t, e, n, r) {
  const s = B2(t);
  if (!s.result)
    throw s;
  const o = Be.randomPrivateKey(), i = Sa(o, !0);
  let c = Od(o, t, !0);
  c = c.slice(1);
  const l = jg(c), f = Be.randomBytes(16), h = await I2(f, l.encryptionKey, e), d = kr(f, i, h), y = Fg(l.hmacKey, d);
  let p;
  if (!r || r === "hex")
    p = gt(h);
  else if (r === "base64")
    p = S1(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const E = {
    iv: gt(f),
    ephemeralPK: gt(i),
    cipherText: p,
    mac: gt(y),
    wasString: n
  };
  return r && r !== "hex" && (E.cipherTextEncoding = r), E;
}
async function Rg(t, e) {
  if (!e.ephemeralPK)
    throw new yh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Od(t, n, !0);
  r = r.slice(1);
  const s = jg(r), o = qt(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = qt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = x1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const c = kr(o, qt(n), i), l = Fg(s.hmacKey, c), f = qt(e.mac);
  if (!C2(f, l))
    throw new yh("Decryption failed: failure in MAC check");
  const h = await L2(o, s.encryptionKey, i);
  return e.wasString ? xa(h) : h;
}
function N2(t, e) {
  const n = typeof e == "string" ? Co(e) : e, r = Dg(t), s = Hg(n), o = il(s, t);
  return {
    signature: gt(o),
    publicKey: r
  };
}
async function _2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Dg(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? Co(t) : t, i = await M2(n.publicKey, o, s, n.cipherTextEncoding);
  let c = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const l = N2(r, c), f = {
      signature: l.signature,
      publicKey: l.publicKey,
      cipherText: c
    };
    c = JSON.stringify(f);
  }
  return c;
}
function P2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Rg(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ye = {}, bi = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
un.decode = un.encode = un.unescape = un.escape = un.pad = void 0;
const zg = Ea;
function jd(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
un.pad = jd;
function Gg(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
un.escape = Gg;
function Kg(t) {
  return jd(t).replace(/-/g, "+").replace(/_/g, "/");
}
un.unescape = Kg;
function U2(t) {
  return Gg((0, zg.fromByteArray)(new TextEncoder().encode(t)));
}
un.encode = U2;
function H2(t) {
  return new TextDecoder().decode((0, zg.toByteArray)(jd(Kg(t))));
}
un.decode = H2;
var cl = {}, ll = {}, Vg = {}, Yg = {}, ul = {};
Object.defineProperty(ul, "__esModule", { value: !0 });
ul.crypto = void 0;
ul.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = o, t.aexists = i, t.aoutput = c, t.u8 = l, t.u32 = f, t.clean = h, t.createView = d, t.rotr = y, t.rotl = p, t.byteSwap = E, t.byteSwap32 = S, t.bytesToHex = H, t.hexToBytes = _, t.asyncLoop = it, t.utf8ToBytes = Q, t.bytesToUtf8 = K, t.toBytes = b, t.kdfInputToBytes = I, t.concatBytes = B, t.checkOpts = M, t.createHasher = R, t.createOptHasher = bt, t.createXOFer = dt, t.randomBytes = Gt;
  const e = ul;
  function n(L) {
    return L instanceof Uint8Array || ArrayBuffer.isView(L) && L.constructor.name === "Uint8Array";
  }
  function r(L) {
    if (!Number.isSafeInteger(L) || L < 0)
      throw new Error("positive integer expected, got " + L);
  }
  function s(L, ...D) {
    if (!n(L))
      throw new Error("Uint8Array expected");
    if (D.length > 0 && !D.includes(L.length))
      throw new Error("Uint8Array expected of length " + D + ", got length=" + L.length);
  }
  function o(L) {
    if (typeof L != "function" || typeof L.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(L.outputLen), r(L.blockLen);
  }
  function i(L, D = !0) {
    if (L.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (D && L.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(L, D) {
    s(L);
    const lt = D.outputLen;
    if (L.length < lt)
      throw new Error("digestInto() expects output buffer of length at least " + lt);
  }
  function l(L) {
    return new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
  }
  function f(L) {
    return new Uint32Array(L.buffer, L.byteOffset, Math.floor(L.byteLength / 4));
  }
  function h(...L) {
    for (let D = 0; D < L.length; D++)
      L[D].fill(0);
  }
  function d(L) {
    return new DataView(L.buffer, L.byteOffset, L.byteLength);
  }
  function y(L, D) {
    return L << 32 - D | L >>> D;
  }
  function p(L, D) {
    return L << D | L >>> 32 - D >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function E(L) {
    return L << 24 & 4278190080 | L << 8 & 16711680 | L >>> 8 & 65280 | L >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (L) => L : (L) => E(L), t.byteSwapIfBE = t.swap8IfBE;
  function S(L) {
    for (let D = 0; D < L.length; D++)
      L[D] = E(L[D]);
    return L;
  }
  t.swap32IfBE = t.isLE ? (L) => L : S;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", O = /* @__PURE__ */ Array.from({ length: 256 }, (L, D) => D.toString(16).padStart(2, "0"));
  function H(L) {
    if (s(L), C)
      return L.toHex();
    let D = "";
    for (let lt = 0; lt < L.length; lt++)
      D += O[L[lt]];
    return D;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T(L) {
    if (L >= A._0 && L <= A._9)
      return L - A._0;
    if (L >= A.A && L <= A.F)
      return L - (A.A - 10);
    if (L >= A.a && L <= A.f)
      return L - (A.a - 10);
  }
  function _(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (C)
      return Uint8Array.fromHex(L);
    const D = L.length, lt = D / 2;
    if (D % 2)
      throw new Error("hex string expected, got unpadded hex of length " + D);
    const St = new Uint8Array(lt);
    for (let yt = 0, kt = 0; yt < lt; yt++, kt += 2) {
      const ke = T(L.charCodeAt(kt)), It = T(L.charCodeAt(kt + 1));
      if (ke === void 0 || It === void 0) {
        const Tt = L[kt] + L[kt + 1];
        throw new Error('hex string expected, got non-hex character "' + Tt + '" at index ' + kt);
      }
      St[yt] = ke * 16 + It;
    }
    return St;
  }
  const q = async () => {
  };
  t.nextTick = q;
  async function it(L, D, lt) {
    let St = Date.now();
    for (let yt = 0; yt < L; yt++) {
      lt(yt);
      const kt = Date.now() - St;
      kt >= 0 && kt < D || (await (0, t.nextTick)(), St += kt);
    }
  }
  function Q(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function K(L) {
    return new TextDecoder().decode(L);
  }
  function b(L) {
    return typeof L == "string" && (L = Q(L)), s(L), L;
  }
  function I(L) {
    return typeof L == "string" && (L = Q(L)), s(L), L;
  }
  function B(...L) {
    let D = 0;
    for (let St = 0; St < L.length; St++) {
      const yt = L[St];
      s(yt), D += yt.length;
    }
    const lt = new Uint8Array(D);
    for (let St = 0, yt = 0; St < L.length; St++) {
      const kt = L[St];
      lt.set(kt, yt), yt += kt.length;
    }
    return lt;
  }
  function M(L, D) {
    if (D !== void 0 && {}.toString.call(D) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, D);
  }
  class V {
  }
  t.Hash = V;
  function R(L) {
    const D = (St) => L().update(b(St)).digest(), lt = L();
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = () => L(), D;
  }
  function bt(L) {
    const D = (St, yt) => L(yt).update(b(St)).digest(), lt = L({});
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = (St) => L(St), D;
  }
  function dt(L) {
    const D = (St, yt) => L(yt).update(b(St)).digest(), lt = L({});
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = (St) => L(St), D;
  }
  t.wrapConstructor = R, t.wrapConstructorWithOpts = bt, t.wrapXOFConstructorWithOpts = dt;
  function Gt(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Yg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Yg;
  class n extends e.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(o);
      const c = (0, e.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const l = this.blockLen, f = new Uint8Array(l);
      f.set(c.length > l ? o.create().update(c).digest() : c);
      for (let h = 0; h < f.length; h++)
        f[h] ^= 54;
      this.iHash.update(f), this.oHash = o.create();
      for (let h = 0; h < f.length; h++)
        f[h] ^= 106;
      this.oHash.update(f), (0, e.clean)(f);
    }
    update(o) {
      return (0, e.aexists)(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      (0, e.aexists)(this), (0, e.abytes)(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: c, finished: l, destroyed: f, blockLen: h, outputLen: d } = this;
      return o = o, o.finished = l, o.destroyed = f, o.blockLen = h, o.outputLen = d, o.oHash = i._cloneInto(o.oHash), o.iHash = c._cloneInto(o.iHash), o;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (s, o, i) => new n(s, o).update(i).digest();
  t.hmac = r, t.hmac.create = (s, o) => new n(s, o);
})(Vg);
const Zo = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Xg(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Lu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Bo(t, ...e) {
  if (!Xg(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function O2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Lu(t.outputLen), Lu(t.blockLen);
}
function Cu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qg(t, e) {
  Bo(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function D2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function F2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Tc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function gc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Zn(t, e) {
  return t << 32 - e | t >>> e;
}
function j2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Rd = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function zd(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Wg = Rd ? (t) => t : (t) => zd(t), R2 = Wg;
function Zg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = zd(t[e]);
  return t;
}
const z2 = Rd ? (t) => t : Zg, Qg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", G2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Gd(t) {
  if (Bo(t), Qg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += G2[t[n]];
  return e;
}
const Hr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ch(t) {
  if (t >= Hr._0 && t <= Hr._9)
    return t - Hr._0;
  if (t >= Hr.A && t <= Hr.F)
    return t - (Hr.A - 10);
  if (t >= Hr.a && t <= Hr.f)
    return t - (Hr.a - 10);
}
function K2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Qg)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Ch(t.charCodeAt(o)), c = Ch(t.charCodeAt(o + 1));
    if (i === void 0 || c === void 0) {
      const l = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + l + '" at index ' + o);
    }
    r[s] = i * 16 + c;
  }
  return r;
}
const Jg = async () => {
};
async function V2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Jg(), r += o);
  }
}
function Kd(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Y2(t) {
  return new TextDecoder().decode(t);
}
function Aa(t) {
  return typeof t == "string" && (t = Kd(t)), Bo(t), t;
}
function X2(t) {
  return typeof t == "string" && (t = Kd(t)), Bo(t), t;
}
function q2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Bo(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function W2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let ty = class {
};
function dl(t) {
  const e = (r) => t().update(Aa(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ey(t) {
  const e = (r, s) => t(s).update(Aa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function ny(t) {
  const e = (r, s) => t(s).update(Aa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Z2 = dl, Q2 = ey, J2 = ny;
function tx(t = 32) {
  if (Zo && typeof Zo.getRandomValues == "function")
    return Zo.getRandomValues(new Uint8Array(t));
  if (Zo && typeof Zo.randomBytes == "function")
    return Uint8Array.from(Zo.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const ex = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: ty,
  abytes: Bo,
  aexists: Cu,
  ahash: O2,
  anumber: Lu,
  aoutput: qg,
  asyncLoop: V2,
  byteSwap: zd,
  byteSwap32: Zg,
  byteSwapIfBE: R2,
  bytesToHex: Gd,
  bytesToUtf8: Y2,
  checkOpts: W2,
  clean: Tc,
  concatBytes: q2,
  createHasher: dl,
  createOptHasher: ey,
  createView: gc,
  createXOFer: ny,
  hexToBytes: K2,
  isBytes: Xg,
  isLE: Rd,
  kdfInputToBytes: X2,
  nextTick: Jg,
  randomBytes: tx,
  rotl: j2,
  rotr: Zn,
  swap32IfBE: z2,
  swap8IfBE: Wg,
  toBytes: Aa,
  u32: F2,
  u8: D2,
  utf8ToBytes: Kd,
  wrapConstructor: Z2,
  wrapConstructorWithOpts: Q2,
  wrapXOFConstructorWithOpts: J2
}, Symbol.toStringTag, { value: "Module" }));
function nx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), l = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + f, c, r);
}
function rx(t, e, n) {
  return t & e ^ ~t & n;
}
function sx(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class ox extends ty {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = gc(this.buffer);
  }
  update(e) {
    Cu(this), e = Aa(e), Bo(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const l = gc(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Cu(this), qg(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Tc(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    nx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = gc(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = l / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < f; d++)
      c.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.destroyed = i, e.finished = o, e.length = s, e.pos = c, s % n && e.buffer.set(r), e;
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
]), ix = /* @__PURE__ */ Uint32Array.from([
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
let Vd = class extends ox {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = fs[0] | 0, this.B = fs[1] | 0, this.C = fs[2] | 0, this.D = fs[3] | 0, this.E = fs[4] | 0, this.F = fs[5] | 0, this.G = fs[6] | 0, this.H = fs[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: l } = this;
    return [e, n, r, s, o, i, c, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ps[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const y = ps[d - 15], p = ps[d - 2], E = Zn(y, 7) ^ Zn(y, 18) ^ y >>> 3, S = Zn(p, 17) ^ Zn(p, 19) ^ p >>> 10;
      ps[d] = S + ps[d - 7] + E + ps[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: l, G: f, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const y = Zn(c, 6) ^ Zn(c, 11) ^ Zn(c, 25), p = h + y + rx(c, l, f) + ix[d] + ps[d] | 0, S = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + sx(r, s, o) | 0;
      h = f, f = l, l = c, c = i + p | 0, i = o, o = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, l, f, h);
  }
  roundClean() {
    Tc(ps);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Tc(this.buffer);
  }
}, ry = class extends Vd {
  constructor() {
    super(28), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
  }
};
const ax = /* @__PURE__ */ dl(() => new Vd()), cx = /* @__PURE__ */ dl(() => new ry()), lx = Vd, Yd = ax, ux = ry, dx = cx, fx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: ux,
  SHA256: lx,
  sha224: dx,
  sha256: Yd
}, Symbol.toStringTag, { value: "Module" })), fl = /* @__PURE__ */ rl(fx), hx = /* @__PURE__ */ rl(m1);
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.joseToDer = mi.derToJose = void 0;
const sy = Ea, oy = un;
function Gl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const px = {
  ES256: Gl(256),
  ES384: Gl(384),
  ES512: Gl(521)
};
function iy(t) {
  const e = px[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Bc = 128, ay = 0, gx = 32, yx = 16, wx = 2, cy = yx | gx | ay << 6, Mc = wx | ay << 6;
function ly(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, sy.toByteArray)((0, oy.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function bx(t, e) {
  const n = ly(t), r = iy(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== cy)
    throw new Error('Could not find expected "seq"');
  let c = n[i++];
  if (c === (Bc | 1) && (c = n[i++]), o - i < c)
    throw new Error(`"seq" specified length of "${c}", only "${o - i}" remaining`);
  if (n[i++] !== Mc)
    throw new Error('Could not find expected "int" for "r"');
  const l = n[i++];
  if (o - i - 2 < l)
    throw new Error(`"r" specified length of "${l}", only "${o - i - 2}" available`);
  if (s < l)
    throw new Error(`"r" specified length of "${l}", max of "${s}" is acceptable`);
  const f = i;
  if (i += l, n[i++] !== Mc)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const d = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const y = r - l, p = r - h, E = new Uint8Array(y + l + p + h);
  for (i = 0; i < y; ++i)
    E[i] = 0;
  E.set(n.subarray(f + Math.max(-y, 0), f + l), i), i = r;
  for (const S = i; i < S + p; ++i)
    E[i] = 0;
  return E.set(n.subarray(d + Math.max(-p, 0), d + h), i), (0, oy.escape)((0, sy.fromByteArray)(E));
}
mi.derToJose = bx;
function Th(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Bc && --r, r;
}
function mx(t, e) {
  t = ly(t);
  const n = iy(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Th(t, 0, n), o = Th(t, n, t.length), i = n - s, c = n - o, l = 2 + i + 1 + 1 + c, f = l < Bc, h = new Uint8Array((f ? 2 : 3) + l);
  let d = 0;
  return h[d++] = cy, f ? h[d++] = l : (h[d++] = Bc | 1, h[d++] = l & 255), h[d++] = Mc, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(t.subarray(0, n), d), d += n) : (h.set(t.subarray(s, n), d), d += n - s), h[d++] = Mc, h[d++] = c, o < 0 ? (h[d++] = 0, h.set(t.subarray(n), d)) : h.set(t.subarray(n + o), d), h;
}
mi.joseToDer = mx;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.InvalidTokenError = Xr.MissingParametersError = void 0;
class xx extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Xr.MissingParametersError = xx;
class Sx extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Xr.InvalidTokenError = Sx;
const va = /* @__PURE__ */ rl(ex);
Object.defineProperty(ll, "__esModule", { value: !0 });
ll.SECP256K1Client = void 0;
const Ex = Vg, Ax = fl, yc = hx, Bh = mi, Mh = Xr, Nh = va;
yc.utils.hmacSha256Sync = (t, ...e) => {
  const n = Ex.hmac.create(Ax.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class uy {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Nh.bytesToHex)(yc.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Mh.MissingParametersError("a signing input hash and private key are all required");
    const s = yc.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Nh.bytesToHex)(s);
    if (r === "jose")
      return (0, Bh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Bh.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Mh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return yc.verify(n, e, r, { strict: !1 });
  }
}
ll.SECP256K1Client = uy;
uy.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ll;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(cl);
var go = {};
const vx = /* @__PURE__ */ rl(wg);
var kx = fn && fn.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(h) {
      try {
        f(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function l(h) {
      try {
        f(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function f(h) {
      h.done ? o(h.value) : s(h.value).then(c, l);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(go, "__esModule", { value: !0 });
go.hashSha256Async = go.hashSha256 = void 0;
const $x = fl;
function dy(t) {
  return (0, $x.sha256)(t);
}
go.hashSha256 = dy;
function Ix(t) {
  return kx(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = vx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(dy(t));
    }
  });
}
go.hashSha256Async = Ix;
var Lx = fn && fn.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function c(h) {
      try {
        f(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function l(h) {
      try {
        f(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function f(h) {
      h.done ? o(h.value) : s(h.value).then(c, l);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.TokenSigner = bi.createUnsecuredToken = void 0;
const Tu = un, _h = cl, Cx = Xr, Ph = go;
function Bu(t, e) {
  const n = [], r = Tu.encode(JSON.stringify(e));
  n.push(r);
  const s = Tu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Tx(t) {
  return Bu(t, { typ: "JWT", alg: "none" }) + ".";
}
bi.createUnsecuredToken = Tx;
class Bx {
  constructor(e, n) {
    if (!(e && n))
      throw new Cx.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !_h.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = _h.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Bu(e, s), i = (0, Ph.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return Lx(this, void 0, void 0, function* () {
      const s = this.header(r), o = Bu(e, s), i = yield (0, Ph.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Tu.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
bi.TokenSigner = Bx;
var hl = {};
Object.defineProperty(hl, "__esModule", { value: !0 });
hl.TokenVerifier = void 0;
const Mx = un, Uh = cl, Nx = Xr, ja = go;
class _x {
  constructor(e, n) {
    if (!(e && n))
      throw new Nx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Uh.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Uh.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], o = (i) => {
      const c = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, c, this.rawPublicKey);
    };
    if (n)
      return (0, ja.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, ja.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Mx.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((c) => {
      const l = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(i, l, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, ja.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, ja.hashSha256)(r);
      return o(i);
    }
  }
}
hl.TokenVerifier = _x;
var pl = {};
Object.defineProperty(pl, "__esModule", { value: !0 });
pl.decodeToken = void 0;
const Ra = un;
function Px(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Ra.decode(e[0])), r = JSON.parse(Ra.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Ra.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Ra.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
pl.decodeToken = Px;
(function(t) {
  var e = fn && fn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var c = Object.getOwnPropertyDescriptor(s, o);
    (!c || ("get" in c ? !s.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, c);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = fn && fn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(bi, t), n(hl, t), n(pl, t), n(Xr, t), n(cl, t);
})(Ye);
function Ux(t) {
  return `did:btc-addr:${t}`;
}
function Hx(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new gh("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new gh('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function fy(t) {
  if (t)
    return Hx(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Ox = "1.4.0";
function Dx() {
  return v2();
}
function Fx(t, e, n, r = ag.slice(), s, o = Sm().getTime(), i = {}) {
  const c = (p) => {
    const E = Td("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return E == null ? void 0 : E.origin;
  };
  e || (e = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), s || (s = c("appDomain"));
  const l = Object.assign({}, i, {
    jti: Am(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Ox,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = Ye.SECP256K1Client.derivePublicKey(t);
  l.public_keys = [f];
  const h = Og(f);
  return l.iss = Ux(h), new Ye.TokenSigner("ES256k", t).sign(l);
}
async function Hh(t, e) {
  const n = xa(qt(e)), r = JSON.parse(n), s = await Rg(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function jx(t) {
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
function Rx(t) {
  const e = Ye.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = fy(e.iss);
  if (n.length === 1) {
    if (Og(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zx(t) {
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
function Gx(t) {
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
function Kx(t) {
  const e = [
    Gx(t),
    zx(t),
    jx(t),
    Rx(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Oh = "1.0.0";
class Hs {
  constructor(e) {
    this.version = Oh, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Oh)
      throw new Eu(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Hs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class hy {
  constructor(e) {
    if (e) {
      const n = new Hs(e);
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
class Dh extends hy {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Hs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new cg("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Hs({})), !0;
  }
}
class Fh extends hy {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = bm, !localStorage.getItem(this.key)) {
      const r = new Hs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new cg("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Hs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Hs({})), !0;
  }
}
var ca;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ca || (ca = {}));
var Nc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Nc || (Nc = {}));
ca.Mainnet;
var Gr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Gr || (Gr = {}));
var Sr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Sr || (Sr = {}));
Gr.Mainnet;
const py = {
  chainId: ca.Mainnet,
  transactionVersion: Gr.Mainnet,
  peerNetworkId: Nc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Sr.MainnetSingleSig,
    multiSig: Sr.MainnetMultiSig
  },
  client: { baseUrl: lg }
}, Mu = {
  chainId: ca.Testnet,
  transactionVersion: Gr.Testnet,
  peerNetworkId: Nc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Sr.TestnetSingleSig,
    multiSig: Sr.TestnetMultiSig
  },
  client: { baseUrl: ug }
}, wc = {
  ...Mu,
  addressVersion: { ...Mu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: dg }
}, Vx = {
  ...wc,
  addressVersion: { ...wc.addressVersion },
  client: { ...wc.client }
};
function Yx(t) {
  switch (t) {
    case "mainnet":
      return py;
    case "testnet":
      return Mu;
    case "devnet":
      return wc;
    case "mocknet":
      return Vx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function gy(t) {
  return typeof t == "string" ? Yx(t) : t;
}
var jh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(jh || (jh = {}));
var Rh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Rh || (Rh = {}));
var Qn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Qn || (Qn = {}));
const Kl = ["onChainOnly", "offChainOnly", "any"];
Kl[0] + "", Qn.OnChainOnly, Kl[1] + "", Qn.OffChainOnly, Kl[2] + "", Qn.Any, Qn.OnChainOnly + "", Qn.OnChainOnly, Qn.OffChainOnly + "", Qn.OffChainOnly, Qn.Any + "", Qn.Any;
var zh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(zh || (zh = {}));
var Gh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Gh || (Gh = {}));
var Kh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Kh || (Kh = {}));
var Rr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Rr || (Rr = {}));
var Vh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Vh || (Vh = {}));
var Yh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Yh || (Yh = {}));
var Xh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Xh || (Xh = {}));
var qh;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(qh || (qh = {}));
var Wh;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Wh || (Wh = {}));
var Zh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zh || (Zh = {}));
var Qh;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Qh || (Qh = {}));
var Jh;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Jh || (Jh = {}));
var tp;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(tp || (tp = {}));
function Nu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function yy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function qx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nu(t.outputLen), Nu(t.blockLen);
}
function Wx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Zx(t, e) {
  yy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const no = {
  number: Nu,
  bool: Xx,
  bytes: yy,
  hash: qx,
  exists: Wx,
  output: Zx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Vl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, Qx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Qx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Jx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Xd(t) {
  if (typeof t == "string" && (t = Jx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let wy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Mo(t) {
  const e = (r) => t().update(Xd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let by = class extends wy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, no.hash(e);
    const r = Xd(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(e) {
    return no.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    no.exists(this), no.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const my = (t, e, n) => new by(t, e).update(n).digest();
my.create = (t, e) => new by(t, e);
function tS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), l = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + f, c, r);
}
let qd = class extends wy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Vl(this.buffer);
  }
  update(e) {
    no.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Xd(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const l = Vl(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    no.exists(this), no.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    tS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Vl(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = l / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < f; d++)
      c.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const eS = (t, e, n) => t & e ^ ~t & n, nS = (t, e, n) => t & e ^ t & n ^ e & n, rS = new Uint32Array([
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
let xy = class extends qd {
  constructor() {
    super(64, 32, 8, !1), this.A = gs[0] | 0, this.B = gs[1] | 0, this.C = gs[2] | 0, this.D = gs[3] | 0, this.E = gs[4] | 0, this.F = gs[5] | 0, this.G = gs[6] | 0, this.H = gs[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: l } = this;
    return [e, n, r, s, o, i, c, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ys[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const y = ys[d - 15], p = ys[d - 2], E = fr(y, 7) ^ fr(y, 18) ^ y >>> 3, S = fr(p, 17) ^ fr(p, 19) ^ p >>> 10;
      ys[d] = S + ys[d - 7] + E + ys[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: l, G: f, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const y = fr(c, 6) ^ fr(c, 11) ^ fr(c, 25), p = h + y + eS(c, l, f) + rS[d] + ys[d] | 0, S = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + nS(r, s, o) | 0;
      h = f, f = l, l = c, c = i + p | 0, i = o, o = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, l, f, h);
  }
  roundClean() {
    ys.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, sS = class extends xy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Sy = Mo(() => new xy());
Mo(() => new sS());
var No = {}, Wd = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = va;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, c) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let l = [], f = 0;
    for (let p = i.length - 1; p >= 0; p--)
      if (f < 4) {
        const E = n.indexOf(i[p]) >> f;
        let S = 0;
        p !== 0 && (S = n.indexOf(i[p - 1]));
        const C = 1 + f, O = S % (1 << C) << 5 - C, H = t.c32[E + O];
        f = C, l.unshift(H);
      } else
        f = 0;
    let h = 0;
    for (let p = 0; p < l.length && l[p] === "0"; p++)
      h++;
    l = l.slice(h);
    const d = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), y = d ? d[0].length : 0;
    for (let p = 0; p < y; p++)
      l.unshift(t.c32[0]);
    if (c) {
      const p = c - l.length;
      for (let E = 0; E < p; E++)
        l.unshift(t.c32[0]);
    }
    return l.join("");
  }
  t.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(i, c) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const l = i.match(`^${t.c32[0]}*`), f = l ? l[0].length : 0;
    let h = [], d = 0, y = 0;
    for (let S = i.length - 1; S >= 0; S--) {
      y === 4 && (h.unshift(n[d]), y = 0, d = 0);
      const O = (t.c32.indexOf(i[S]) << y) + d, H = n[O % 16];
      if (y += 1, d = O >> 4, d > 1 << y)
        throw new Error("Panic error in decoding.");
      h.unshift(H);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let p = 0;
    for (let S = 0; S < h.length && h[S] === "0"; S++)
      p++;
    h = h.slice(p - p % 2);
    let E = h.join("");
    for (let S = 0; S < f; S++)
      E = `00${E}`;
    if (c) {
      const S = c * 2 - E.length;
      for (let C = 0; C < S; C += 2)
        E = `00${E}`;
    }
    return E;
  }
  t.c32decode = o;
})(Wd);
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
yo.c32checkDecode = yo.c32checkEncode = void 0;
const ep = fl, np = va, na = Wd;
function Ey(t) {
  const e = (0, ep.sha256)((0, ep.sha256)((0, np.hexToBytes)(t)));
  return (0, np.bytesToHex)(e.slice(0, 4));
}
function oS(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Ey(`${n}${e}`), s = (0, na.c32encode)(`${e}${r}`);
  return `${na.c32[t]}${s}`;
}
yo.c32checkEncode = oS;
function iS(t) {
  t = (0, na.c32normalize)(t);
  const e = (0, na.c32decode)(t.slice(1)), n = t[0], r = na.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Ey(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
yo.c32checkDecode = iS;
var Ay = {}, xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.decode = xi.encode = void 0;
const _c = fl, rp = va, vy = Ng, ky = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function aS(t, e = "00") {
  const n = typeof t == "string" ? (0, rp.hexToBytes)(t) : t, r = typeof e == "string" ? (0, rp.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, _c.sha256)((0, _c.sha256)(new Uint8Array([...r, ...n])));
  return vy(ky).encode([...r, ...n, ...s.slice(0, 4)]);
}
xi.encode = aS;
function cS(t) {
  const e = vy(ky).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, _c.sha256)((0, _c.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
xi.decode = cS;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = yo, n = xi, r = va;
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
  const o = {};
  o[t.versions.mainnet.p2pkh] = 0, o[t.versions.mainnet.p2sh] = 5, o[t.versions.testnet.p2pkh] = 111, o[t.versions.testnet.p2sh] = 196;
  function i(h, d) {
    if (!d.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, d)}`;
  }
  t.c32address = i;
  function c(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(h.slice(1));
  }
  t.c32addressDecode = c;
  function l(h, d = -1) {
    const y = n.decode(h), p = (0, r.bytesToHex)(y.data), E = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let S;
    return d < 0 ? (S = E, s[E] !== void 0 && (S = s[E])) : S = d, i(S, p);
  }
  t.b58ToC32 = l;
  function f(h, d = -1) {
    const y = c(h), p = y[0], E = y[1];
    let S;
    d < 0 ? (S = p, o[p] !== void 0 && (S = o[p])) : S = d;
    let C = S.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(E, C);
  }
  t.c32ToB58 = f;
})(Ay);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Wd;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = yo;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ay;
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
})(No);
function lS(t, e) {
  switch (e = gy(e ?? py), t) {
    case Rr.P2PKH:
      switch (e.transactionVersion) {
        case Gr.Mainnet:
          return Sr.MainnetSingleSig;
        case Gr.Testnet:
          return Sr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Rr.P2SH:
    case Rr.P2SHNonSequential:
    case Rr.P2WPKH:
    case Rr.P2WSH:
    case Rr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Gr.Mainnet:
          return Sr.MainnetMultiSig;
        case Gr.Testnet:
          return Sr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const uS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $y = Uint8Array.from({ length: 16 }, (t, e) => e), dS = $y.map((t) => (9 * t + 5) % 16);
let Zd = [$y], Qd = [dS];
for (let t = 0; t < 4; t++)
  for (let e of [Zd, Qd])
    e.push(e[t].map((n) => uS[n]));
const Iy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fS = Zd.map((t, e) => t.map((n) => Iy[e][n])), hS = Qd.map((t, e) => t.map((n) => Iy[e][n])), pS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), za = (t, e) => t << e | t >>> 32 - e;
function sp(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ga = new Uint32Array(16);
let yS = class extends qd {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Ga[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, l = c, f = this.h3 | 0, h = f, d = this.h4 | 0, y = d;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, S = pS[p], C = gS[p], O = Zd[p], H = Qd[p], A = fS[p], T = hS[p];
      for (let _ = 0; _ < 16; _++) {
        const q = za(r + sp(p, o, c, f) + Ga[O[_]] + S, A[_]) + d | 0;
        r = d, d = f, f = za(c, 10) | 0, c = o, o = q;
      }
      for (let _ = 0; _ < 16; _++) {
        const q = za(s + sp(E, i, l, h) + Ga[H[_]] + C, T[_]) + y | 0;
        s = y, y = h, h = za(l, 10) | 0, l = i, i = q;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + y | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Ga.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const wS = Mo(() => new yS()), Ka = BigInt(2 ** 32 - 1), _u = BigInt(32);
function Ly(t, e = !1) {
  return e ? { h: Number(t & Ka), l: Number(t >> _u & Ka) } : { h: Number(t >> _u & Ka) | 0, l: Number(t & Ka) | 0 };
}
function bS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Ly(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const mS = (t, e) => BigInt(t >>> 0) << _u | BigInt(e >>> 0), xS = (t, e, n) => t >>> n, SS = (t, e, n) => t << 32 - n | e >>> n, ES = (t, e, n) => t >>> n | e << 32 - n, AS = (t, e, n) => t << 32 - n | e >>> n, vS = (t, e, n) => t << 64 - n | e >>> n - 32, kS = (t, e, n) => t >>> n - 32 | e << 64 - n, $S = (t, e) => e, IS = (t, e) => t, LS = (t, e, n) => t << n | e >>> 32 - n, CS = (t, e, n) => e << n | t >>> 32 - n, TS = (t, e, n) => e << n - 32 | t >>> 64 - n, BS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function MS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const NS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _S = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, PS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), US = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, HS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), OS = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Ly,
  split: bS,
  toBig: mS,
  shrSH: xS,
  shrSL: SS,
  rotrSH: ES,
  rotrSL: AS,
  rotrBH: vS,
  rotrBL: kS,
  rotr32H: $S,
  rotr32L: IS,
  rotlSH: LS,
  rotlSL: CS,
  rotlBH: TS,
  rotlBL: BS,
  add: MS,
  add3L: NS,
  add3H: _S,
  add4L: PS,
  add4H: US,
  add5H: OS,
  add5L: HS
}, [DS, FS] = _t.split([
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
].map((t) => BigInt(t))), ws = new Uint32Array(80), bs = new Uint32Array(80);
let gl = class extends qd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: l, Eh: f, El: h, Fh: d, Fl: y, Gh: p, Gl: E, Hh: S, Hl: C } = this;
    return [e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ws[A] = e.getUint32(n), bs[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ws[A - 15] | 0, _ = bs[A - 15] | 0, q = _t.rotrSH(T, _, 1) ^ _t.rotrSH(T, _, 8) ^ _t.shrSH(T, _, 7), it = _t.rotrSL(T, _, 1) ^ _t.rotrSL(T, _, 8) ^ _t.shrSL(T, _, 7), Q = ws[A - 2] | 0, K = bs[A - 2] | 0, b = _t.rotrSH(Q, K, 19) ^ _t.rotrBH(Q, K, 61) ^ _t.shrSH(Q, K, 6), I = _t.rotrSL(Q, K, 19) ^ _t.rotrBL(Q, K, 61) ^ _t.shrSL(Q, K, 6), B = _t.add4L(it, I, bs[A - 7], bs[A - 16]), M = _t.add4H(B, q, b, ws[A - 7], ws[A - 16]);
      ws[A] = M | 0, bs[A] = B | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: l, Dh: f, Dl: h, Eh: d, El: y, Fh: p, Fl: E, Gh: S, Gl: C, Hh: O, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const T = _t.rotrSH(d, y, 14) ^ _t.rotrSH(d, y, 18) ^ _t.rotrBH(d, y, 41), _ = _t.rotrSL(d, y, 14) ^ _t.rotrSL(d, y, 18) ^ _t.rotrBL(d, y, 41), q = d & p ^ ~d & S, it = y & E ^ ~y & C, Q = _t.add5L(H, _, it, FS[A], bs[A]), K = _t.add5H(Q, O, T, q, DS[A], ws[A]), b = Q | 0, I = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), B = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), M = r & o ^ r & c ^ o & c, V = s & i ^ s & l ^ i & l;
      O = S | 0, H = C | 0, S = p | 0, C = E | 0, p = d | 0, E = y | 0, { h: d, l: y } = _t.add(f | 0, h | 0, K | 0, b | 0), f = c | 0, h = l | 0, c = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const R = _t.add3L(b, B, V);
      r = _t.add3H(R, K, I, M), s = R | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = _t.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l } = _t.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: f, l: h } = _t.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: d, l: y } = _t.add(this.Eh | 0, this.El | 0, d | 0, y | 0), { h: p, l: E } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: S, l: C } = _t.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: O, l: H } = _t.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, c, l, f, h, d, y, p, E, S, C, O, H);
  }
  roundClean() {
    ws.fill(0), bs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, jS = class extends gl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, RS = class extends gl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, zS = class extends gl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Mo(() => new gl());
Mo(() => new jS());
Mo(() => new RS());
Mo(() => new zS());
var Pc = { exports: {} };
Pc.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", c = "[object Boolean]", l = "[object Date]", f = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", E = "[object Object]", S = "[object Promise]", C = "[object RegExp]", O = "[object Set]", H = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", _ = "[object ArrayBuffer]", q = "[object DataView]", it = "[object Float32Array]", Q = "[object Float64Array]", K = "[object Int8Array]", b = "[object Int16Array]", I = "[object Int32Array]", B = "[object Uint8Array]", M = "[object Uint8ClampedArray]", V = "[object Uint16Array]", R = "[object Uint32Array]", bt = /[\\^$.*+?()[\]{}|]/g, dt = /\w*$/, Gt = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, D = {};
  D[o] = D[i] = D[_] = D[q] = D[c] = D[l] = D[it] = D[Q] = D[K] = D[b] = D[I] = D[y] = D[p] = D[E] = D[C] = D[O] = D[H] = D[A] = D[B] = D[M] = D[V] = D[R] = !0, D[f] = D[h] = D[T] = !1;
  var lt = typeof fn == "object" && fn && fn.Object === Object && fn, St = typeof self == "object" && self && self.Object === Object && self, yt = lt || St || Function("return this")(), kt = e && !e.nodeType && e, ke = kt && !0 && t && !t.nodeType && t, It = ke && ke.exports === kt;
  function Tt(x, N) {
    return x.set(N[0], N[1]), x;
  }
  function wt(x, N) {
    return x.add(N), x;
  }
  function Hn(x, N) {
    for (var F = -1, ut = x ? x.length : 0; ++F < ut && N(x[F], F, x) !== !1; )
      ;
    return x;
  }
  function Re(x, N) {
    for (var F = -1, ut = N.length, ie = x.length; ++F < ut; )
      x[ie + F] = N[F];
    return x;
  }
  function Bt(x, N, F, ut) {
    for (var ie = -1, ze = x ? x.length : 0; ++ie < ze; )
      F = N(F, x[ie], ie, x);
    return F;
  }
  function pn(x, N) {
    for (var F = -1, ut = Array(x); ++F < x; )
      ut[F] = N(F);
    return ut;
  }
  function re(x, N) {
    return x == null ? void 0 : x[N];
  }
  function gn(x) {
    var N = !1;
    if (x != null && typeof x.toString != "function")
      try {
        N = !!(x + "");
      } catch {
      }
    return N;
  }
  function An(x) {
    var N = -1, F = Array(x.size);
    return x.forEach(function(ut, ie) {
      F[++N] = [ie, ut];
    }), F;
  }
  function ye(x, N) {
    return function(F) {
      return x(N(F));
    };
  }
  function Xe(x) {
    var N = -1, F = Array(x.size);
    return x.forEach(function(ut) {
      F[++N] = ut;
    }), F;
  }
  var De = Array.prototype, qe = Function.prototype, Ot = Object.prototype, se = yt["__core-js_shared__"], We = function() {
    var x = /[^.]+$/.exec(se && se.keys && se.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), Fe = qe.toString, Me = Ot.hasOwnProperty, pe = Ot.toString, we = RegExp(
    "^" + Fe.call(Me).replace(bt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), qn = It ? yt.Buffer : void 0, cr = yt.Symbol, $ = yt.Uint8Array, G = ye(Object.getPrototypeOf, Object), j = Object.create, Y = Ot.propertyIsEnumerable, ht = De.splice, Et = Object.getOwnPropertySymbols, oe = qn ? qn.isBuffer : void 0, be = ye(Object.keys, Object), jt = de(yt, "DataView"), v = de(yt, "Map"), at = de(yt, "Promise"), At = de(yt, "Set"), Mt = de(yt, "WeakMap"), mt = de(Object, "create"), Yt = m(jt), ue = m(v), $e = m(at), te = m(At), vn = m(Mt), Lt = cr ? cr.prototype : void 0, Tr = Lt ? Lt.valueOf : void 0;
  function On(x) {
    var N = -1, F = x ? x.length : 0;
    for (this.clear(); ++N < F; ) {
      var ut = x[N];
      this.set(ut[0], ut[1]);
    }
  }
  function Zr() {
    this.__data__ = mt ? mt(null) : {};
  }
  function Rs(x) {
    return this.has(x) && delete this.__data__[x];
  }
  function Br(x) {
    var N = this.__data__;
    if (mt) {
      var F = N[x];
      return F === r ? void 0 : F;
    }
    return Me.call(N, x) ? N[x] : void 0;
  }
  function zs(x) {
    var N = this.__data__;
    return mt ? N[x] !== void 0 : Me.call(N, x);
  }
  function Qr(x, N) {
    var F = this.__data__;
    return F[x] = mt && N === void 0 ? r : N, this;
  }
  On.prototype.clear = Zr, On.prototype.delete = Rs, On.prototype.get = Br, On.prototype.has = zs, On.prototype.set = Qr;
  function yn(x) {
    var N = -1, F = x ? x.length : 0;
    for (this.clear(); ++N < F; ) {
      var ut = x[N];
      this.set(ut[0], ut[1]);
    }
  }
  function Oo() {
    this.__data__ = [];
  }
  function Ui(x) {
    var N = this.__data__, F = ts(N, x);
    if (F < 0)
      return !1;
    var ut = N.length - 1;
    return F == ut ? N.pop() : ht.call(N, F, 1), !0;
  }
  function kn(x) {
    var N = this.__data__, F = ts(N, x);
    return F < 0 ? void 0 : N[F][1];
  }
  function $n(x) {
    return ts(this.__data__, x) > -1;
  }
  function sn(x, N) {
    var F = this.__data__, ut = ts(F, x);
    return ut < 0 ? F.push([x, N]) : F[ut][1] = N, this;
  }
  yn.prototype.clear = Oo, yn.prototype.delete = Ui, yn.prototype.get = kn, yn.prototype.has = $n, yn.prototype.set = sn;
  function on(x) {
    var N = -1, F = x ? x.length : 0;
    for (this.clear(); ++N < F; ) {
      var ut = x[N];
      this.set(ut[0], ut[1]);
    }
  }
  function Do() {
    this.__data__ = {
      hash: new On(),
      map: new (v || yn)(),
      string: new On()
    };
  }
  function zt(x) {
    return Ze(this, x).delete(x);
  }
  function Ne(x) {
    return Ze(this, x).get(x);
  }
  function lr(x) {
    return Ze(this, x).has(x);
  }
  function Gs(x, N) {
    return Ze(this, x).set(x, N), this;
  }
  on.prototype.clear = Do, on.prototype.delete = zt, on.prototype.get = Ne, on.prototype.has = lr, on.prototype.set = Gs;
  function Wn(x) {
    this.__data__ = new yn(x);
  }
  function Ie() {
    this.__data__ = new yn();
  }
  function wn(x) {
    return this.__data__.delete(x);
  }
  function bn(x) {
    return this.__data__.get(x);
  }
  function Ks(x) {
    return this.__data__.has(x);
  }
  function Vs(x, N) {
    var F = this.__data__;
    if (F instanceof yn) {
      var ut = F.__data__;
      if (!v || ut.length < n - 1)
        return ut.push([x, N]), this;
      F = this.__data__ = new on(ut);
    }
    return F.set(x, N), this;
  }
  Wn.prototype.clear = Ie, Wn.prototype.delete = wn, Wn.prototype.get = bn, Wn.prototype.has = Ks, Wn.prototype.set = Vs;
  function Ys(x, N) {
    var F = k(x) || g(x) ? pn(x.length, String) : [], ut = F.length, ie = !!ut;
    for (var ze in x)
      Me.call(x, ze) && !(ie && (ze == "length" || Ko(ze, ut))) && F.push(ze);
    return F;
  }
  function Jr(x, N, F) {
    var ut = x[N];
    (!(Me.call(x, N) && a(ut, F)) || F === void 0 && !(N in x)) && (x[N] = F);
  }
  function ts(x, N) {
    for (var F = x.length; F--; )
      if (a(x[F][0], N))
        return F;
    return -1;
  }
  function Hi(x, N) {
    return x && Go(N, st(N), x);
  }
  function es(x, N, F, ut, ie, ze, an) {
    var ft;
    if (ut && (ft = ze ? ut(x, ie, ze, an) : ut(x)), ft !== void 0)
      return ft;
    if (!Z(x))
      return x;
    var Zt = k(x);
    if (Zt) {
      if (ft = Pr(x), !N)
        return Ws(x, ft);
    } else {
      var Xt = Fn(x), Qe = Xt == h || Xt == d;
      if (U(x))
        return ns(x, N);
      if (Xt == E || Xt == o || Qe && !ze) {
        if (gn(x))
          return ze ? x : {};
        if (ft = rs(Qe ? {} : x), !N)
          return Di(x, Hi(ft, x));
      } else {
        if (!D[Xt])
          return ze ? x : {};
        ft = Ur(x, Xt, es, N);
      }
    }
    an || (an = new Wn());
    var Fi = an.get(x);
    if (Fi)
      return Fi;
    if (an.set(x, ft), !Zt)
      var ji = F ? _r(x) : st(x);
    return Hn(ji || x, function(Yo, Ln) {
      ji && (Ln = Yo, Yo = x[Ln]), Jr(ft, Ln, es(Yo, N, F, ut, Ln, x, an));
    }), ft;
  }
  function In(x) {
    return Z(x) ? j(x) : {};
  }
  function Fo(x, N, F) {
    var ut = N(x);
    return k(x) ? ut : Re(ut, F(x));
  }
  function Xs(x) {
    return pe.call(x);
  }
  function Oi(x) {
    if (!Z(x) || Vo(x))
      return !1;
    var N = J(x) || gn(x) ? we : Gt;
    return N.test(m(x));
  }
  function Mr(x) {
    if (!u(x))
      return be(x);
    var N = [];
    for (var F in Object(x))
      Me.call(x, F) && F != "constructor" && N.push(F);
    return N;
  }
  function ns(x, N) {
    if (N)
      return x.slice();
    var F = new x.constructor(x.length);
    return x.copy(F), F;
  }
  function Dn(x) {
    var N = new x.constructor(x.byteLength);
    return new $(N).set(new $(x)), N;
  }
  function Nr(x, N) {
    var F = N ? Dn(x.buffer) : x.buffer;
    return new x.constructor(F, x.byteOffset, x.byteLength);
  }
  function jo(x, N, F) {
    var ut = N ? F(An(x), !0) : An(x);
    return Bt(ut, Tt, new x.constructor());
  }
  function Wt(x) {
    var N = new x.constructor(x.source, dt.exec(x));
    return N.lastIndex = x.lastIndex, N;
  }
  function Ro(x, N, F) {
    var ut = N ? F(Xe(x), !0) : Xe(x);
    return Bt(ut, wt, new x.constructor());
  }
  function qs(x) {
    return Tr ? Object(Tr.call(x)) : {};
  }
  function zo(x, N) {
    var F = N ? Dn(x.buffer) : x.buffer;
    return new x.constructor(F, x.byteOffset, x.length);
  }
  function Ws(x, N) {
    var F = -1, ut = x.length;
    for (N || (N = Array(ut)); ++F < ut; )
      N[F] = x[F];
    return N;
  }
  function Go(x, N, F, ut) {
    F || (F = {});
    for (var ie = -1, ze = N.length; ++ie < ze; ) {
      var an = N[ie], ft = void 0;
      Jr(F, an, ft === void 0 ? x[an] : ft);
    }
    return F;
  }
  function Di(x, N) {
    return Go(x, ur(x), N);
  }
  function _r(x) {
    return Fo(x, st, ur);
  }
  function Ze(x, N) {
    var F = x.__data__;
    return ss(N) ? F[typeof N == "string" ? "string" : "hash"] : F.map;
  }
  function de(x, N) {
    var F = re(x, N);
    return Oi(F) ? F : void 0;
  }
  var ur = Et ? ye(Et, Object) : $t, Fn = Xs;
  (jt && Fn(new jt(new ArrayBuffer(1))) != q || v && Fn(new v()) != y || at && Fn(at.resolve()) != S || At && Fn(new At()) != O || Mt && Fn(new Mt()) != T) && (Fn = function(x) {
    var N = pe.call(x), F = N == E ? x.constructor : void 0, ut = F ? m(F) : void 0;
    if (ut)
      switch (ut) {
        case Yt:
          return q;
        case ue:
          return y;
        case $e:
          return S;
        case te:
          return O;
        case vn:
          return T;
      }
    return N;
  });
  function Pr(x) {
    var N = x.length, F = x.constructor(N);
    return N && typeof x[0] == "string" && Me.call(x, "index") && (F.index = x.index, F.input = x.input), F;
  }
  function rs(x) {
    return typeof x.constructor == "function" && !u(x) ? In(G(x)) : {};
  }
  function Ur(x, N, F, ut) {
    var ie = x.constructor;
    switch (N) {
      case _:
        return Dn(x);
      case c:
      case l:
        return new ie(+x);
      case q:
        return Nr(x, ut);
      case it:
      case Q:
      case K:
      case b:
      case I:
      case B:
      case M:
      case V:
      case R:
        return zo(x, ut);
      case y:
        return jo(x, ut, F);
      case p:
      case H:
        return new ie(x);
      case C:
        return Wt(x);
      case O:
        return Ro(x, ut, F);
      case A:
        return qs(x);
    }
  }
  function Ko(x, N) {
    return N = N ?? s, !!N && (typeof x == "number" || L.test(x)) && x > -1 && x % 1 == 0 && x < N;
  }
  function ss(x) {
    var N = typeof x;
    return N == "string" || N == "number" || N == "symbol" || N == "boolean" ? x !== "__proto__" : x === null;
  }
  function Vo(x) {
    return !!We && We in x;
  }
  function u(x) {
    var N = x && x.constructor, F = typeof N == "function" && N.prototype || Ot;
    return x === F;
  }
  function m(x) {
    if (x != null) {
      try {
        return Fe.call(x);
      } catch {
      }
      try {
        return x + "";
      } catch {
      }
    }
    return "";
  }
  function w(x) {
    return es(x, !0, !0);
  }
  function a(x, N) {
    return x === N || x !== x && N !== N;
  }
  function g(x) {
    return z(x) && Me.call(x, "callee") && (!Y.call(x, "callee") || pe.call(x) == o);
  }
  var k = Array.isArray;
  function P(x) {
    return x != null && W(x.length) && !J(x);
  }
  function z(x) {
    return nt(x) && P(x);
  }
  var U = oe || ee;
  function J(x) {
    var N = Z(x) ? pe.call(x) : "";
    return N == h || N == d;
  }
  function W(x) {
    return typeof x == "number" && x > -1 && x % 1 == 0 && x <= s;
  }
  function Z(x) {
    var N = typeof x;
    return !!x && (N == "object" || N == "function");
  }
  function nt(x) {
    return !!x && typeof x == "object";
  }
  function st(x) {
    return P(x) ? Ys(x) : Mr(x);
  }
  function $t() {
    return [];
  }
  function ee() {
    return !1;
  }
  t.exports = w;
})(Pc, Pc.exports);
var GS = Pc.exports;
const Cy = /* @__PURE__ */ rg(GS);
var Pu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Pu || (Pu = {}));
function KS(t, e) {
  return { type: Pu.Address, version: t, hash160: e };
}
function VS(t) {
  return No.c32address(t.version, t.hash160);
}
const YS = (t) => wS(Sy(t)), XS = (t) => gt(YS(t));
Be.hmacSha256Sync = (t, ...e) => {
  const n = my.create(Sy, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function qS(t, e = "mainnet") {
  e = gy(e), t = typeof t == "string" ? qt(t) : t;
  const n = lS(Rr.P2PKH, e), r = KS(n, XS(t));
  return VS(r);
}
function WS(t, e) {
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
  const s = r.issuer.publicKey, o = qS(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Ye.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function ZS(t, e = null) {
  let n;
  e ? n = WS(t, e) : n = Ye.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const op = "_blockstackDidCheckEchoReply", QS = "echoReply", JS = "authContinuation";
function t3(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function e3() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[op];
  if (typeof e == "boolean")
    return e;
  const n = t3(t.location.search), r = n[QS];
  if (r) {
    t[op] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[JS];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Uu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new fg();
    else
      throw new xm("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Fh(e.sessionOptions) : this.store = new Fh() : e ? this.store = new Dh(e.sessionOptions) : this.store = new Dh();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Em().getTime(), c = {}) {
    const l = this.appConfig;
    if (!l)
      throw new Eu("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || l.redirectURI(), r = r || l.manifestURI(), s = s || l.scopes, o = o || l.appDomain, Fx(e, n, r, s, o, i, c);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Dx();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Td("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (e3())
        return ri.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ri.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Km()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Na("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = Ye.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Kx(e))
      throw new Na("Invalid authentication response.");
    let c = o.private_key, l = o.core_token;
    if (Fl(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            c = await Hh(s, o.private_key);
          } catch {
            if (ri.warn("Failed decryption of appPrivateKey, will try to use as given"), !Be.isValidPrivateKey(o.private_key))
              throw new Na("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (l != null)
          try {
            l = await Hh(s, l);
          } catch {
            ri.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Na("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = _m, h;
    Fl(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (f = o.hubUrl), Fl(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: fy(o.iss),
      appPrivateKey: c,
      coreSessionToken: l,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, y = o.profile_url;
    if (!d.profile && y) {
      const p = await n(y);
      if (!p.ok)
        d.profile = Object.assign({}, wm);
      else {
        const E = await p.text(), S = JSON.parse(E);
        d.profile = ZS(S[0].token);
      }
    } else
      d.profile = o.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Eu("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), _2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), P2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Uu.prototype.makeAuthRequest = Uu.prototype.makeAuthRequestToken;
const n3 = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], r3 = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = n3(), n = t.filter((r) => e.find((o) => o.id === r.id) ? !1 : !!yl(r.id));
  return e.concat(n);
}, yl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Ty = "STX_PROVIDER", wo = () => typeof window > "u" ? null : window.localStorage.getItem(Ty), s3 = (t) => {
  typeof window < "u" && window.localStorage.setItem(Ty, t);
}, o3 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function i3(t, e) {
  const n = {};
  return Object.assign(n, o3, e), await fetch(t, n);
}
function a3(t) {
  let e = i3, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function c3(...t) {
  const { fetchLib: e, middlewares: n } = a3(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: e,
        ...i
      })) ?? i);
    let c = await e(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var Si;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Si || (Si = {}));
var bo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bo || (bo = {}));
var ip;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ip || (ip = {}));
const l3 = "https://api.mainnet.hiro.so", u3 = "https://api.testnet.hiro.so", d3 = "http://localhost:3999", f3 = ["mainnet", "testnet", "devnet", "mocknet"];
class mo {
  constructor(e) {
    this.version = bo.Mainnet, this.chainId = Si.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === bo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? c3();
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
mo.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Hu();
    case "testnet":
      return new Ou();
    case "devnet":
      return new h3();
    case "mocknet":
      return new By();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${f3.join(", ")}`);
  }
};
mo.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : mo.fromName(t);
class Hu extends mo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? l3,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bo.Mainnet, this.chainId = Si.Mainnet;
  }
}
class Ou extends mo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? u3,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bo.Testnet, this.chainId = Si.Testnet;
  }
}
class By extends mo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? d3,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bo.Testnet, this.chainId = Si.Testnet;
  }
}
const h3 = By;
var xo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(xo || (xo = {}));
var Uc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Uc || (Uc = {}));
xo.Mainnet;
var So;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(So || (So = {}));
var Eo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Eo || (Eo = {}));
So.Mainnet;
const p3 = {
  chainId: xo.Mainnet,
  transactionVersion: So.Mainnet,
  peerNetworkId: Uc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Eo.MainnetSingleSig,
    multiSig: Eo.MainnetMultiSig
  },
  client: { baseUrl: lg }
}, Du = {
  chainId: xo.Testnet,
  transactionVersion: So.Testnet,
  peerNetworkId: Uc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Eo.TestnetSingleSig,
    multiSig: Eo.TestnetMultiSig
  },
  client: { baseUrl: ug }
}, bc = {
  ...Du,
  addressVersion: { ...Du.addressVersion },
  magicBytes: "id",
  client: { baseUrl: dg }
}, g3 = {
  ...bc,
  addressVersion: { ...bc.addressVersion },
  client: { ...bc.client }
};
function y3(t) {
  switch (t) {
    case "mainnet":
      return p3;
    case "testnet":
      return Du;
    case "devnet":
      return bc;
    case "mocknet":
      return g3;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function w3(t) {
  return typeof t == "string" ? y3(t) : t;
}
function b3(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ap = /* @__PURE__ */ new Map();
function My(t, e) {
  const n = ap.get(t);
  if (n !== void 0)
    return n(e);
  const r = b3(t);
  return ap.set(t, r), My(t, e);
}
let ge = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? qt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return jm(this.readBytes(4), 0);
  }
  readUInt8() {
    return Dm(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Hm(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = gt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = gt(n);
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
    if (My(e, r))
      return r;
    throw n(r);
  }
};
const m3 = 128, x3 = 128, Ny = 16, ao = 32, Fu = 80, wl = 65, S3 = 32, E3 = 64, Hc = 34, A3 = 1 + 16 * 1024 * 1024, v3 = 165, k3 = 16, $3 = 16, I3 = 20, L3 = $3 + 2 + I3, C3 = L3 + 4, T3 = A3 + (v3 + k3 * C3);
var ne;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ne || (ne = {}));
var ju;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ju || (ju = {}));
var Tn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tn || (Tn = {}));
const Yl = ["onChainOnly", "offChainOnly", "any"];
Yl[0] + "", Tn.OnChainOnly, Yl[1] + "", Tn.OffChainOnly, Yl[2] + "", Tn.Any, Tn.OnChainOnly + "", Tn.OnChainOnly, Tn.OffChainOnly + "", Tn.OffChainOnly, Tn.Any + "", Tn.Any;
var Oc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Oc || (Oc = {}));
var me;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(me || (me = {}));
var Ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ce || (Ce = {}));
var fe;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(fe || (fe = {}));
var Ae;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ae || (Ae = {}));
var ra;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ra || (ra = {}));
var Ru;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ru || (Ru = {}));
var zu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(zu || (zu = {}));
var dn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(dn || (dn = {}));
var cp;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(cp || (cp = {}));
var Gu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Gu || (Gu = {}));
var er;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(er || (er = {}));
var lp;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(lp || (lp = {}));
let bl = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, si = class extends bl {
  constructor(e) {
    super(e);
  }
}, ln = class extends bl {
  constructor(e) {
    super(e);
  }
}, Dc = class extends bl {
  constructor(e) {
    super(e);
  }
}, ro = class extends bl {
  constructor(e) {
    super(e);
  }
};
function Ku(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function B3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _y(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function M3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ku(t.outputLen), Ku(t.blockLen);
}
function N3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _3(t, e) {
  _y(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const so = {
  number: Ku,
  bool: B3,
  bytes: _y,
  hash: M3,
  exists: N3,
  output: _3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, P3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!P3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function U3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Jd(t) {
  if (typeof t == "string" && (t = U3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Py = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function _o(t) {
  const e = (r) => t().update(Jd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Uy = class extends Py {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, so.hash(e);
    const r = Jd(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(e) {
    return so.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    so.exists(this), so.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Hy = (t, e, n) => new Uy(t, e).update(n).digest();
Hy.create = (t, e) => new Uy(t, e);
function H3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), l = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + f, c, r);
}
let tf = class extends Py {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xl(this.buffer);
  }
  update(e) {
    so.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Jd(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const l = Xl(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    so.exists(this), so.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    H3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = Xl(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = l / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < f; d++)
      c.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const O3 = (t, e, n) => t & e ^ ~t & n, D3 = (t, e, n) => t & e ^ t & n ^ e & n, F3 = new Uint32Array([
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
]), ms = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xs = new Uint32Array(64);
let Oy = class extends tf {
  constructor() {
    super(64, 32, 8, !1), this.A = ms[0] | 0, this.B = ms[1] | 0, this.C = ms[2] | 0, this.D = ms[3] | 0, this.E = ms[4] | 0, this.F = ms[5] | 0, this.G = ms[6] | 0, this.H = ms[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: l } = this;
    return [e, n, r, s, o, i, c, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      xs[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const y = xs[d - 15], p = xs[d - 2], E = hr(y, 7) ^ hr(y, 18) ^ y >>> 3, S = hr(p, 17) ^ hr(p, 19) ^ p >>> 10;
      xs[d] = S + xs[d - 7] + E + xs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: l, G: f, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const y = hr(c, 6) ^ hr(c, 11) ^ hr(c, 25), p = h + y + O3(c, l, f) + F3[d] + xs[d] | 0, S = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + D3(r, s, o) | 0;
      h = f, f = l, l = c, c = i + p | 0, i = o, o = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, l, f, h);
  }
  roundClean() {
    xs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, j3 = class extends Oy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ef = _o(() => new Oy());
_o(() => new j3());
const R3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dy = Uint8Array.from({ length: 16 }, (t, e) => e), z3 = Dy.map((t) => (9 * t + 5) % 16);
let nf = [Dy], rf = [z3];
for (let t = 0; t < 4; t++)
  for (let e of [nf, rf])
    e.push(e[t].map((n) => R3[n]));
const Fy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), G3 = nf.map((t, e) => t.map((n) => Fy[e][n])), K3 = rf.map((t, e) => t.map((n) => Fy[e][n])), V3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Y3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Va = (t, e) => t << e | t >>> 32 - e;
function up(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ya = new Uint32Array(16);
let X3 = class extends tf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Ya[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, l = c, f = this.h3 | 0, h = f, d = this.h4 | 0, y = d;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, S = V3[p], C = Y3[p], O = nf[p], H = rf[p], A = G3[p], T = K3[p];
      for (let _ = 0; _ < 16; _++) {
        const q = Va(r + up(p, o, c, f) + Ya[O[_]] + S, A[_]) + d | 0;
        r = d, d = f, f = Va(c, 10) | 0, c = o, o = q;
      }
      for (let _ = 0; _ < 16; _++) {
        const q = Va(s + up(E, i, l, h) + Ya[H[_]] + C, T[_]) + y | 0;
        s = y, y = h, h = Va(l, 10) | 0, l = i, i = q;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + y | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Ya.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const q3 = _o(() => new X3()), Xa = BigInt(2 ** 32 - 1), Vu = BigInt(32);
function jy(t, e = !1) {
  return e ? { h: Number(t & Xa), l: Number(t >> Vu & Xa) } : { h: Number(t >> Vu & Xa) | 0, l: Number(t & Xa) | 0 };
}
function W3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = jy(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Z3 = (t, e) => BigInt(t >>> 0) << Vu | BigInt(e >>> 0), Q3 = (t, e, n) => t >>> n, J3 = (t, e, n) => t << 32 - n | e >>> n, tE = (t, e, n) => t >>> n | e << 32 - n, eE = (t, e, n) => t << 32 - n | e >>> n, nE = (t, e, n) => t << 64 - n | e >>> n - 32, rE = (t, e, n) => t >>> n - 32 | e << 64 - n, sE = (t, e) => e, oE = (t, e) => t, iE = (t, e, n) => t << n | e >>> 32 - n, aE = (t, e, n) => e << n | t >>> 32 - n, cE = (t, e, n) => e << n - 32 | t >>> 64 - n, lE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function uE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const dE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, hE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), pE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, gE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), yE = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: jy,
  split: W3,
  toBig: Z3,
  shrSH: Q3,
  shrSL: J3,
  rotrSH: tE,
  rotrSL: eE,
  rotrBH: nE,
  rotrBL: rE,
  rotr32H: sE,
  rotr32L: oE,
  rotlSH: iE,
  rotlSL: aE,
  rotlBH: cE,
  rotlBL: lE,
  add: uE,
  add3L: dE,
  add3H: fE,
  add4L: hE,
  add4H: pE,
  add5H: yE,
  add5L: gE
}, [wE, bE] = Pt.split([
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
].map((t) => BigInt(t))), Ss = new Uint32Array(80), Es = new Uint32Array(80);
let ml = class extends tf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: l, Eh: f, El: h, Fh: d, Fl: y, Gh: p, Gl: E, Hh: S, Hl: C } = this;
    return [e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ss[A] = e.getUint32(n), Es[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Ss[A - 15] | 0, _ = Es[A - 15] | 0, q = Pt.rotrSH(T, _, 1) ^ Pt.rotrSH(T, _, 8) ^ Pt.shrSH(T, _, 7), it = Pt.rotrSL(T, _, 1) ^ Pt.rotrSL(T, _, 8) ^ Pt.shrSL(T, _, 7), Q = Ss[A - 2] | 0, K = Es[A - 2] | 0, b = Pt.rotrSH(Q, K, 19) ^ Pt.rotrBH(Q, K, 61) ^ Pt.shrSH(Q, K, 6), I = Pt.rotrSL(Q, K, 19) ^ Pt.rotrBL(Q, K, 61) ^ Pt.shrSL(Q, K, 6), B = Pt.add4L(it, I, Es[A - 7], Es[A - 16]), M = Pt.add4H(B, q, b, Ss[A - 7], Ss[A - 16]);
      Ss[A] = M | 0, Es[A] = B | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: l, Dh: f, Dl: h, Eh: d, El: y, Fh: p, Fl: E, Gh: S, Gl: C, Hh: O, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const T = Pt.rotrSH(d, y, 14) ^ Pt.rotrSH(d, y, 18) ^ Pt.rotrBH(d, y, 41), _ = Pt.rotrSL(d, y, 14) ^ Pt.rotrSL(d, y, 18) ^ Pt.rotrBL(d, y, 41), q = d & p ^ ~d & S, it = y & E ^ ~y & C, Q = Pt.add5L(H, _, it, bE[A], Es[A]), K = Pt.add5H(Q, O, T, q, wE[A], Ss[A]), b = Q | 0, I = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), B = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), M = r & o ^ r & c ^ o & c, V = s & i ^ s & l ^ i & l;
      O = S | 0, H = C | 0, S = p | 0, C = E | 0, p = d | 0, E = y | 0, { h: d, l: y } = Pt.add(f | 0, h | 0, K | 0, b | 0), f = c | 0, h = l | 0, c = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const R = Pt.add3L(b, B, V);
      r = Pt.add3H(R, K, I, M), s = R | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Pt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l } = Pt.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: f, l: h } = Pt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: d, l: y } = Pt.add(this.Eh | 0, this.El | 0, d | 0, y | 0), { h: p, l: E } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: S, l: C } = Pt.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: O, l: H } = Pt.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, c, l, f, h, d, y, p, E, S, C, O, H);
  }
  roundClean() {
    Ss.fill(0), Es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, mE = class extends ml {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, xE = class extends ml {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, SE = class extends ml {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
_o(() => new ml());
_o(() => new mE());
const EE = _o(() => new xE());
_o(() => new SE());
var Kt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Kt || (Kt = {}));
var Oe;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Oe || (Oe = {}));
function sf(t) {
  return Oe[t];
}
const AE = () => ({ type: Kt.BoolTrue }), vE = () => ({ type: Kt.BoolFalse }), kE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Kt.Buffer, value: gt(t) };
}, dp = BigInt("0xffffffffffffffffffffffffffffffff"), $E = BigInt(0), fp = BigInt("0x7fffffffffffffffffffffffffffffff"), hp = BigInt("-170141183460469231731687303715884105728"), IE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = vu(qt(t))), En(t, Uint8Array) && (t = vu(t));
  const e = rn(t);
  if (e > fp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${fp}`);
  if (e < hp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${hp}`);
  return { type: Kt.Int, value: e };
}, LE = (t) => {
  const e = rn(t);
  if (e < $E)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > dp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${dp}`);
  return { type: Kt.UInt, value: e };
};
function CE(t) {
  return { type: Kt.List, value: t };
}
function Ry() {
  return { type: Kt.OptionalNone };
}
function zy(t) {
  return { type: Kt.OptionalSome, value: t };
}
var ct;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ct || (ct = {}));
function TE() {
  return {
    type: ct.Address,
    version: Eo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function pp(t) {
  if (t && Qy(t, Hc))
    throw new Error(`Memo exceeds maximum length of ${Hc} bytes`);
  return { type: ct.MemoString, content: t };
}
function of(t, e) {
  return {
    type: ct.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Yu(t) {
  if (qt(t).byteLength != wl)
    throw Error("Invalid signature");
  return {
    type: ct.MessageSignature,
    data: t
  };
}
function BE(t, e, n) {
  return typeof t == "string" && (t = YE(t)), typeof n == "string" && (n = pp(n)), {
    type: ct.Payload,
    payloadType: ne.TokenTransfer,
    recipient: t,
    amount: rn(e),
    memo: n ?? pp("")
  };
}
function ME(t, e, n, r) {
  return typeof e == "string" && (e = or(e)), typeof n == "string" && (n = or(n)), {
    type: ct.Payload,
    payloadType: ne.ContractCall,
    contractAddress: typeof t == "string" ? js(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function NE(t) {
  return or(t, 4, 1e5);
}
function gp(t, e, n) {
  return typeof t == "string" && (t = or(t)), typeof e == "string" && (e = NE(e)), typeof n == "number" ? {
    type: ct.Payload,
    payloadType: ne.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ct.Payload,
    payloadType: ne.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function _E() {
  return { type: ct.Payload, payloadType: ne.PoisonMicroblock };
}
function yp(t, e) {
  if (t.byteLength != ao)
    throw Error(`Coinbase buffer size must be ${ao} bytes`);
  return e != null ? {
    type: ct.Payload,
    payloadType: ne.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ct.Payload,
    payloadType: ne.Coinbase,
    coinbaseBytes: t
  };
}
function PE(t, e, n) {
  if (t.byteLength != ao)
    throw Error(`Coinbase buffer size must be ${ao} bytes`);
  if (n.byteLength != Fu)
    throw Error(`VRF proof buffer size must be ${Fu} bytes`);
  return {
    type: ct.Payload,
    payloadType: ne.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Kt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function UE(t, e, n, r, s, o, i) {
  return {
    type: ct.Payload,
    payloadType: ne.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function or(t, e, n) {
  const r = e || 1, s = n || m3;
  if (Qy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ct.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function HE(t, e, n) {
  return {
    type: ct.Asset,
    address: js(t),
    contractName: or(e),
    assetName: or(n)
  };
}
function js(t) {
  const e = No.c32addressDecode(t);
  return {
    type: ct.Address,
    version: e[0],
    hash160: e[1]
  };
}
function OE(t, e) {
  const n = js(t), r = or(e);
  return {
    type: ct.Principal,
    prefix: dn.Contract,
    address: n,
    contractName: r
  };
}
function DE(t) {
  const e = js(t);
  return {
    type: ct.Principal,
    prefix: dn.Standard,
    address: e
  };
}
function oi(t, e) {
  return {
    pubKeyEncoding: t,
    type: ct.TransactionAuthField,
    contents: e
  };
}
function Dr(t) {
  switch (t.type) {
    case ct.Address:
      return ka(t);
    case ct.Principal:
      return Gy(t);
    case ct.LengthPrefixedString:
      return Ai(t);
    case ct.MemoString:
      return jE(t);
    case ct.Asset:
      return Vy(t);
    case ct.PostCondition:
      return Xy(t);
    case ct.PublicKey:
      return Wu(t);
    case ct.LengthPrefixedList:
      return af(t);
    case ct.Payload:
      return qy(t);
    case ct.TransactionAuthField:
      return VE(t);
    case ct.MessageSignature:
      return cf(t);
  }
}
function ka(t) {
  const e = [];
  return e.push(qt(ma(t.version, 1))), e.push(qt(t.hash160)), Ue(e);
}
function Ei(t) {
  const e = En(t, ge) ? t : new ge(t), n = sl(gt(e.readBytes(1))), r = gt(e.readBytes(20));
  return { type: ct.Address, version: n, hash160: r };
}
function Gy(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === dn.Standard || t.prefix === dn.Contract) && e.push(ka(t.address)), t.prefix === dn.Contract && e.push(Ai(t.contractName)), Ue(e);
}
function FE(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(dn, (o) => {
    throw new ln(`Unexpected Principal payload type: ${o}`);
  });
  if (n === dn.Origin)
    return { type: ct.Principal, prefix: n };
  const r = Ei(e);
  if (n === dn.Standard)
    return { type: ct.Principal, prefix: n, address: r };
  const s = Vn(e);
  return {
    type: ct.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ai(t) {
  const e = [], n = Co(t.content), r = n.byteLength;
  return e.push(qt(ma(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function Vn(t, e, n) {
  e = e || 1;
  const r = En(t, ge) ? t : new ge(t), s = sl(gt(r.readBytes(e))), o = xa(r.readBytes(s));
  return or(o, e, n ?? 128);
}
function jE(t) {
  const e = [], n = Co(t.content), r = gA(gt(n), Hc * 2);
  return e.push(qt(r)), Ue(e);
}
function Ky(t) {
  const e = En(t, ge) ? t : new ge(t);
  let n = xa(e.readBytes(Hc));
  return n = n.replace(/\u0000*$/, ""), { type: ct.MemoString, content: n };
}
function Vy(t) {
  const e = [];
  return e.push(ka(t.address)), e.push(Ai(t.contractName)), e.push(Ai(t.assetName)), Ue(e);
}
function Xu(t) {
  const e = En(t, ge) ? t : new ge(t);
  return {
    type: ct.Asset,
    address: Ei(e),
    contractName: Vn(e),
    assetName: Vn(e)
  };
}
function af(t) {
  const e = t.values, n = [];
  n.push(qt(ma(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Dr(r));
  return Ue(n);
}
function Yy(t, e, n) {
  const r = En(t, ge) ? t : new ge(t), s = sl(gt(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (e) {
      case ct.Address:
        o.push(Ei(r));
        break;
      case ct.LengthPrefixedString:
        o.push(Vn(r));
        break;
      case ct.MemoString:
        o.push(Ky(r));
        break;
      case ct.Asset:
        o.push(Xu(r));
        break;
      case ct.PostCondition:
        o.push(zE(r));
        break;
      case ct.PublicKey:
        o.push(Zu(r));
        break;
      case ct.TransactionAuthField:
        o.push(KE(r));
        break;
    }
  return of(o, n);
}
function RE(t) {
  return gt(Xy(t));
}
function Xy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Gy(t.principal)), (t.conditionType === me.Fungible || t.conditionType === me.NonFungible) && e.push(Vy(t.asset)), t.conditionType === me.NonFungible && e.push(Er(t.assetName)), e.push(t.conditionCode), t.conditionType === me.STX || t.conditionType === me.Fungible || t.conditionType === me.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new si("The post-condition amount may not be larger than 8 bytes");
    e.push(Ds(t.amount, 8));
  }
  return Ue(e);
}
function zE(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(me, (c) => {
    throw new ln(`Could not read ${c} as PostConditionType`);
  }), r = FE(e);
  let s, o, i;
  switch (n) {
    case me.STX:
      return s = e.readUInt8Enum(ra, (l) => {
        throw new ln(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${gt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: me.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case me.Fungible:
      return o = Xu(e), s = e.readUInt8Enum(ra, (l) => {
        throw new ln(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${gt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: me.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case me.NonFungible:
      o = Xu(e);
      const c = mr(e);
      return s = e.readUInt8Enum(Ru, (l) => {
        throw new ln(`Could not read ${l} as FungibleConditionCode`);
      }), {
        type: ct.PostCondition,
        conditionType: me.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: c
      };
    case me.Staking:
      return s = e.readUInt8Enum(ra, (l) => {
        throw new ln(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${gt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: me.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case me.PoX: {
      const l = e.readUInt8Enum(zu, (f) => {
        throw new ln(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: ct.PostCondition,
        conditionType: me.PoX,
        principal: r,
        conditionCode: l
      };
    }
  }
}
function qy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ne.TokenTransfer:
      e.push(Er(t.recipient)), e.push(Ds(t.amount, 8)), e.push(Dr(t.memo));
      break;
    case ne.ContractCall:
      e.push(Dr(t.contractAddress)), e.push(Dr(t.contractName)), e.push(Dr(t.functionName));
      const n = new Uint8Array(4);
      fo(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Er(r));
      });
      break;
    case ne.SmartContract:
      e.push(Dr(t.contractName)), e.push(Dr(t.codeBody));
      break;
    case ne.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Dr(t.contractName)), e.push(Dr(t.codeBody));
      break;
    case ne.PoisonMicroblock:
      break;
    case ne.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ne.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Er(t.recipient));
      break;
    case ne.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Er(t.recipient ? zy(t.recipient) : Ry())), e.push(t.vrfProof);
      break;
    case ne.TenureChange:
      e.push(qt(t.tenureHash)), e.push(qt(t.previousTenureHash)), e.push(qt(t.burnViewHash)), e.push(qt(t.previousTenureEnd)), e.push(fo(new Uint8Array(4), t.previousTenureBlocks)), e.push(Fm(new Uint8Array(1), t.cause)), e.push(qt(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function GE(t) {
  const e = En(t, ge) ? t : new ge(t);
  switch (e.readUInt8Enum(ne, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ne.TokenTransfer:
      const r = mr(e), s = rn(e.readBytes(8)), o = Ky(e);
      return BE(r, s, o);
    case ne.ContractCall:
      const i = Ei(e), c = Vn(e), l = Vn(e), f = [], h = e.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const _ = mr(e);
        f.push(_);
      }
      return ME(i, c, l, f);
    case ne.SmartContract:
      const d = Vn(e), y = Vn(e, 4, 1e5);
      return gp(d, y);
    case ne.VersionedSmartContract: {
      const T = e.readUInt8Enum(ju, (it) => {
        throw new Error(`Cannot recognize ClarityVersion: ${it}`);
      }), _ = Vn(e), q = Vn(e, 4, T3);
      return gp(_, q, T);
    }
    case ne.PoisonMicroblock:
      return _E();
    case ne.Coinbase: {
      const T = e.readBytes(ao);
      return yp(T);
    }
    case ne.CoinbaseToAltRecipient: {
      const T = e.readBytes(ao), _ = mr(e);
      return yp(T, _);
    }
    case ne.NakamotoCoinbase: {
      const T = e.readBytes(ao), _ = mr(e), q = e.readBytes(Fu);
      return PE(T, _, q);
    }
    case ne.TenureChange:
      const p = gt(e.readBytes(20)), E = gt(e.readBytes(20)), S = gt(e.readBytes(20)), C = gt(e.readBytes(32)), O = e.readUInt32BE(), H = e.readUInt8Enum(Gu, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = gt(e.readBytes(20));
      return UE(p, E, S, C, O, H, A);
  }
}
function qu(t) {
  const e = En(t, ge) ? t : new ge(t);
  return Yu(gt(e.readBytes(wl)));
}
function KE(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(er, (r) => {
    throw new ln(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case er.PublicKeyCompressed:
      return oi(Ae.Compressed, Zu(e));
    case er.PublicKeyUncompressed:
      return oi(Ae.Uncompressed, Bi($A(Zu(e).data)));
    case er.SignatureCompressed:
      return oi(Ae.Compressed, qu(e));
    case er.SignatureUncompressed:
      return oi(Ae.Uncompressed, qu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function cf(t) {
  return qt(t.data);
}
function VE(t) {
  const e = [];
  switch (t.contents.type) {
    case ct.PublicKey:
      e.push(t.pubKeyEncoding === Ae.Compressed ? er.PublicKeyCompressed : er.PublicKeyUncompressed), e.push(qt(kA(t.contents.data)));
      break;
    case ct.MessageSignature:
      e.push(t.pubKeyEncoding === Ae.Compressed ? er.SignatureCompressed : er.SignatureUncompressed), e.push(cf(t.contents));
      break;
  }
  return Ue(e);
}
function Wu(t) {
  return t.data.slice();
}
function Zu(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8(), r = n === 4 ? E3 : S3;
  return Bi(Ue([n, e.readBytes(r)]));
}
function lf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === fe.P2PKH || e === fe.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === fe.P2WPKH || e === fe.P2WSH || e === fe.P2WSHNonSequential) && !r.map((s) => s.data).every(Mi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case fe.P2PKH:
      return qa(t, yA(r[0].data));
    case fe.P2WPKH:
      return qa(t, wA(r[0].data));
    case fe.P2SH:
    case fe.P2SHNonSequential:
      return qa(t, bA(n, r.map(Wu)));
    case fe.P2WSH:
    case fe.P2WSHNonSequential:
      return qa(t, mA(n, r.map(Wu)));
  }
}
function qa(t, e) {
  return { type: ct.Address, version: t, hash160: e };
}
function uf(t) {
  return No.c32address(t.version, t.hash160);
}
function wp(t) {
  const [e, n, r] = t.split(/\.|::/);
  return HE(e, n, r);
}
function Vi(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return OE(e, n);
  } else
    return DE(t);
}
function YE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return WE(e, n);
  } else
    return XE(t);
}
function XE(t) {
  const e = js(t);
  return { type: Kt.PrincipalStandard, value: uf(e) };
}
function qE(t) {
  return { type: Kt.PrincipalStandard, value: uf(t) };
}
function WE(t, e) {
  const n = js(t), r = or(e);
  return Wy(n, r);
}
function Wy(t, e) {
  if (Co(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Kt.PrincipalContract,
    value: `${uf(t)}.${e.content}`
  };
}
function ZE(t) {
  return { type: Kt.ResponseErr, value: t };
}
function QE(t) {
  return { type: Kt.ResponseOk, value: t };
}
const JE = (t) => ({ type: Kt.StringASCII, value: t }), tA = (t) => ({ type: Kt.StringUTF8, value: t });
function eA(t) {
  for (const e in t)
    if (!xA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Kt.Tuple, value: t };
}
function mr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ge(qt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ge(t) : e = t;
  switch (e.readUInt8Enum(Oe, (r) => {
    throw new ln(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Oe.int:
      return IE(vu(e.readBytes(16)));
    case Oe.uint:
      return LE(e.readBytes(16));
    case Oe.buffer:
      const r = e.readUInt32BE();
      return kE(e.readBytes(r));
    case Oe.true:
      return AE();
    case Oe.false:
      return vE();
    case Oe.address:
      const s = Ei(e);
      return qE(s);
    case Oe.contract:
      const o = Ei(e), i = Vn(e);
      return Wy(o, i);
    case Oe.ok:
      return QE(mr(e));
    case Oe.err:
      return ZE(mr(e));
    case Oe.none:
      return Ry();
    case Oe.some:
      return zy(mr(e));
    case Oe.list:
      const c = e.readUInt32BE(), l = [];
      for (let S = 0; S < c; S++)
        l.push(mr(e));
      return CE(l);
    case Oe.tuple:
      const f = e.readUInt32BE(), h = {};
      for (let S = 0; S < f; S++) {
        const C = Vn(e).content;
        if (C === void 0)
          throw new ln('"content" is undefined');
        h[C] = mr(e);
      }
      return eA(h);
    case Oe.ascii:
      const d = e.readUInt32BE(), y = Mm(e.readBytes(d));
      return JE(y);
    case Oe.utf8:
      const p = e.readUInt32BE(), E = xa(e.readBytes(p));
      return tA(E);
    default:
      throw new ln("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ir(t, e) {
  return Ue([sf(t), e]);
}
function nA(t) {
  return new Uint8Array([sf(t.type)]);
}
function rA(t) {
  return t.type === Kt.OptionalNone ? new Uint8Array([sf(t.type)]) : Ir(t.type, Er(t.value));
}
function sA(t) {
  const e = new Uint8Array(4);
  return fo(e, Math.ceil(t.value.length / 2), 0), Ir(t.type, kr(e, qt(t.value)));
}
function oA(t) {
  const e = Bd(Im(BigInt(t.value), BigInt(x3)), Ny);
  return Ir(t.type, e);
}
function iA(t) {
  const e = Bd(BigInt(t.value), Ny);
  return Ir(t.type, e);
}
function aA(t) {
  return Ir(t.type, ka(js(t.value)));
}
function cA(t) {
  const [e, n] = SA(t.value);
  return Ir(t.type, kr(ka(js(e)), Ai(or(n))));
}
function lA(t) {
  return Ir(t.type, Er(t.value));
}
function uA(t) {
  const e = [], n = new Uint8Array(4);
  fo(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Er(r);
    e.push(s);
  }
  return Ir(t.type, Ue(e));
}
function dA(t) {
  const e = [], n = new Uint8Array(4);
  fo(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = or(s);
    e.push(Ai(o));
    const i = Er(t.value[s]);
    e.push(i);
  }
  return Ir(t.type, Ue(e));
}
function Zy(t, e) {
  const n = [], r = e == "ascii" ? Bm(t.value) : Co(t.value), s = new Uint8Array(4);
  return fo(s, r.length, 0), n.push(s), n.push(r), Ir(t.type, Ue(n));
}
function fA(t) {
  return Zy(t, "ascii");
}
function hA(t) {
  return Zy(t, "utf8");
}
function bp(t) {
  return gt(Er(t));
}
function Er(t) {
  switch (t.type) {
    case Kt.BoolTrue:
    case Kt.BoolFalse:
      return nA(t);
    case Kt.OptionalNone:
    case Kt.OptionalSome:
      return rA(t);
    case Kt.Buffer:
      return sA(t);
    case Kt.UInt:
      return iA(t);
    case Kt.Int:
      return oA(t);
    case Kt.PrincipalStandard:
      return aA(t);
    case Kt.PrincipalContract:
      return cA(t);
    case Kt.ResponseOk:
    case Kt.ResponseErr:
      return lA(t);
    case Kt.List:
      return uA(t);
    case Kt.Tuple:
      return dA(t);
    case Kt.StringASCII:
      return fA(t);
    case Kt.StringUTF8:
      return hA(t);
    default:
      throw new si("Unable to serialize. Invalid Clarity Value.");
  }
}
const pA = (t) => t.length % 2 ? `0${t}` : t, gA = (t, e) => t.padEnd(e, "0"), Qy = (t, e) => t ? Co(t).length > e : !1;
function Qu(t) {
  return Cy(t);
}
const la = (t) => q3(ef(t)), df = (t) => gt(EE(t)), yA = (t) => gt(la(t)), wA = (t) => {
  const e = la(t), n = kr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = la(n);
  return gt(r);
}, bA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = la(r);
  return gt(s);
}, mA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = ef(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Ue(o), c = la(i);
  return gt(c);
};
function xA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function SA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = Hy.create(ef, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Bi(t) {
  return t = typeof t == "string" ? qt(t) : t, {
    type: ct.PublicKey,
    data: t
  };
}
function EA(t, e, n = Ae.Compressed) {
  const r = Um(e), s = new _n(bh(r.r), bh(r.s)), o = Ft.fromSignature(t, s, r.recoveryId), i = n === Ae.Compressed;
  return o.toHex(i);
}
function AA(t) {
  return typeof t == "string" ? t : gt(t);
}
const ff = AA;
function Jy(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Pm;
}
function Mi(t) {
  return !ff(t).startsWith("04");
}
function vA(t) {
  t = Md(t);
  const e = Jy(t);
  return gt(Sa(t.slice(0, 32), e));
}
function kA(t) {
  return Ft.fromHex(ff(t)).toHex(!0);
}
function $A(t) {
  return Ft.fromHex(ff(t)).toHex(!1);
}
function IA(t, e) {
  t = Md(t);
  const [n, r] = il(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ma(r, 1) + _n.fromHex(n).toCompactHex();
}
function hf() {
  return {
    type: ct.MessageSignature,
    data: gt(new Uint8Array(wl))
  };
}
function tw(t, e, n, r) {
  const s = lf(0, t, 1, [Bi(e)]).hash160, o = Mi(e) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: rn(n),
    fee: rn(r),
    keyEncoding: o,
    signature: hf()
  };
}
function ua(t) {
  return "signature" in t;
}
function mp(t) {
  return t === fe.P2SH || t === fe.P2WSH;
}
function LA(t) {
  return t === fe.P2SHNonSequential || t === fe.P2WSHNonSequential;
}
function xp(t) {
  const e = Qu(t);
  return e.nonce = 0, e.fee = 0, ua(e) ? e.signature = hf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function CA(t) {
  const e = [
    t.hashMode,
    qt(t.signer),
    Ds(t.nonce, 8),
    Ds(t.fee, 8),
    t.keyEncoding,
    cf(t.signature)
  ];
  return Ue(e);
}
function TA(t) {
  const e = [
    t.hashMode,
    qt(t.signer),
    Ds(t.nonce, 8),
    Ds(t.fee, 8)
  ], n = of(t.fields);
  e.push(af(n));
  const r = new Uint8Array(2);
  return Om(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function BA(t, e) {
  const n = gt(e.readBytes(20)), r = BigInt(`0x${gt(e.readBytes(8))}`), s = BigInt(`0x${gt(e.readBytes(8))}`), o = e.readUInt8Enum(Ae, (c) => {
    throw new ln(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (t === fe.P2WPKH && o != Ae.Compressed)
    throw new ln("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = qu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function MA(t, e) {
  const n = gt(e.readBytes(20)), r = BigInt("0x" + gt(e.readBytes(8))), s = BigInt("0x" + gt(e.readBytes(8))), o = Yy(e, ct.TransactionAuthField).values;
  let i = !1, c = 0;
  for (const f of o)
    switch (f.contents.type) {
      case ct.PublicKey:
        Mi(f.contents.data) || (i = !0);
        break;
      case ct.MessageSignature:
        if (f.pubKeyEncoding === Ae.Uncompressed && (i = !0), c += 1, c === 65536)
          throw new ro("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = e.readUInt16BE();
  if (i && (t === fe.P2WSH || t === fe.P2WSHNonSequential))
    throw new ro("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: l
  };
}
function ql(t) {
  return ua(t) ? CA(t) : TA(t);
}
function Wl(t) {
  const e = t.readUInt8Enum(fe, (n) => {
    throw new ln(`Could not parse ${n} as AddressHashMode`);
  });
  return e === fe.P2PKH || e === fe.P2WPKH ? BA(e, t) : MA(e, t);
}
function ew(t, e, n, r) {
  const o = t + gt(new Uint8Array([e])) + gt(Ds(n, 8)) + gt(Ds(r, 8));
  if (qt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return df(qt(o));
}
function nw(t, e, n) {
  const r = 33 + wl, s = Mi(e.data) ? Ae.Compressed : Ae.Uncompressed, o = t + pA(s.toString(16)) + n, i = qt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return df(i);
}
function NA(t, e, n, r, s) {
  const o = ew(t, e, n, r), i = IA(s, o), c = Bi(vA(s)), l = nw(o, c, i);
  return {
    nextSig: i,
    nextSigHash: l
  };
}
function rw(t, e, n, r, s, o) {
  const i = ew(t, e, n, r), c = Bi(EA(i, o, s)), l = nw(i, c, o);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function _A() {
  const t = tw(fe.P2PKH, "", 0, 0);
  return t.signer = TE().hash160, t.keyEncoding = Ae.Compressed, t.signature = hf(), t;
}
function Sp(t, e, n) {
  return ua(t) ? PA(t, e, n) : UA(t, e, n);
}
function PA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = rw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), o = lf(0, t.hashMode, 1, [r]).hash160;
  if (o !== t.signer)
    throw new ro(`Signer hash does not equal hash of public key(s): ${o} != ${t.signer}`);
  return s;
}
function UA(t, e, n) {
  const r = [];
  let s = e, o = !1, i = 0;
  for (const l of t.fields)
    switch (l.contents.type) {
      case ct.PublicKey:
        Mi(l.contents.data) || (o = !0), r.push(l.contents);
        break;
      case ct.MessageSignature:
        l.pubKeyEncoding === Ae.Uncompressed && (o = !0);
        const { pubKey: f, nextSigHash: h } = rw(s, n, t.fee, t.nonce, l.pubKeyEncoding, l.contents.data);
        if (mp(t.hashMode) && (s = h), r.push(f), i += 1, i === 65536)
          throw new ro("Too many signatures");
        break;
    }
  if (mp(t.hashMode) && i !== t.signaturesRequired || LA(t.hashMode) && i < t.signaturesRequired)
    throw new ro("Incorrect number of signatures");
  if (o && (t.hashMode === fe.P2WSH || t.hashMode === fe.P2WSHNonSequential))
    throw new ro("Uncompressed keys are not allowed in this hash mode");
  const c = lf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (c !== t.signer)
    throw new ro(`Signer hash does not equal hash of public key(s): ${c} != ${t.signer}`);
  return s;
}
function sw(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function ow(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || tw(fe.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Ep(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return sw(xp(t.spendingCondition));
      case Ce.Sponsored:
        return ow(xp(t.spendingCondition), _A());
      default:
        throw new Dc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function HA(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return Sp(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return Sp(t.spendingCondition, e, Ce.Standard);
    default:
      throw new Dc("Invalid origin auth type");
  }
}
function OA(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: rn(e)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: rn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function DA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: rn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function FA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: rn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function jA(t, e) {
  const n = {
    ...e,
    nonce: rn(e.nonce),
    fee: rn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function RA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ce.Standard:
      e.push(ql(t.spendingCondition));
      break;
    case Ce.Sponsored:
      e.push(ql(t.spendingCondition)), e.push(ql(t.sponsorSpendingCondition));
      break;
  }
  return Ue(e);
}
function zA(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new ln(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = Wl(t), sw(n);
    case Ce.Sponsored:
      n = Wl(t);
      const r = Wl(t);
      return ow(n, r);
  }
}
class GA {
  constructor({ auth: e, payload: n, postConditions: r = of([]), postConditionMode: s = Oc.Deny, transactionVersion: o, chainId: i, network: c = "mainnet" }) {
    c = w3(c), this.transactionVersion = o ?? c.transactionVersion, this.chainId = i ?? c.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: rn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Tn.Any;
  }
  signBegin() {
    const e = Qu(this);
    return e.auth = Ep(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Qu(this);
    return e.auth = Ep(e.auth), e.txid();
  }
  verifyOrigin() {
    return HA(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Bi(e), r = this.auth.spendingCondition;
    if (r && !ua(r)) {
      const s = Mi(n.data);
      r.fields.push(oi(s ? Ae.Compressed : Ae.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: o, nextSigHash: i } = NA(n, r, e.fee, e.nonce, s);
    if (ua(e))
      e.signature = Yu(o);
    else {
      const c = Jy(s);
      e.fields.push(oi(c ? Ae.Compressed : Ae.Uncompressed, Yu(o)));
    }
    return i;
  }
  txid() {
    const e = this.serializeBytes();
    return df(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Dc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = jA(this.auth, e);
  }
  setFee(e) {
    this.auth = OA(this.auth, e);
  }
  setNonce(e) {
    this.auth = DA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Dc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = FA(this.auth, e);
  }
  serialize() {
    return gt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new si('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new si('"chainId" is undefined');
    if (this.auth === void 0)
      throw new si('"auth" is undefined');
    if (this.payload === void 0)
      throw new si('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return fo(n, this.chainId, 0), e.push(n), e.push(RA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(af(this.postConditions)), e.push(qy(this.payload)), Ue(e);
  }
}
function KA(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(So, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = zA(e), o = e.readUInt8Enum(Tn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = e.readUInt8Enum(Oc, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), c = Yy(e, ct.PostCondition), l = GE(e), f = new GA({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: l,
    postConditions: c,
    postConditionMode: i
  });
  return f.anchorMode = o, f;
}
const Ap = BigInt("18446744073709551615");
function Zl(t) {
  const e = rn(t);
  if (e < 0n || e > Ap)
    throw new RangeError(`Post-condition amount must be between 0 and ${Ap} (u64 max), received: ${e}`);
  return e;
}
var Ju;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Ju || (Ju = {}));
var td;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(td || (td = {}));
function VA(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.STX,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Vi(t.address),
        conditionCode: Wa(t.condition),
        amount: Zl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.Fungible,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Vi(t.address),
        conditionCode: Wa(t.condition),
        amount: Zl(t.amount),
        asset: wp(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.NonFungible,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Vi(t.address),
        conditionCode: Wa(t.condition),
        asset: wp(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.Staking,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Vi(t.address),
        conditionCode: Wa(t.condition),
        amount: Zl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.PoX,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Vi(t.address),
        conditionCode: YA(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Wa(t) {
  return Ju[t];
}
function YA(t) {
  return td[t];
}
function iw(t) {
  const e = VA(t);
  return RE(e);
}
function XA(t, e, n) {
  return gf(aw(t), n);
}
function aw(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = da(r);
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
    return BigInt(`0x${ZA(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function pf(t, e = 8) {
  return (typeof t == "bigint" ? t : aw(t)).toString(16).padStart(e * 2, "0");
}
function gf(t, e = 16) {
  const n = pf(t, e);
  return da(n);
}
function qA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const WA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ZA(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += WA[n];
  return e;
}
function da(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = e.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function yf(t) {
  return new TextEncoder().encode(t);
}
function QA(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function JA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function vp(t) {
  if (t.some(JA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function wf(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Wr(t) {
  return wf(...t.map((e) => typeof e == "number" ? vp([e]) : e instanceof Array ? vp(e) : e));
}
function xl(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ed;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ed || (ed = {}));
ed.Mainnet;
const tv = 128, ev = 128, cw = 16;
var nd;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(nd || (nd = {}));
var kp;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(kp || (kp = {}));
var $p;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})($p || ($p = {}));
var Jn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Jn || (Jn = {}));
const Ql = ["onChainOnly", "offChainOnly", "any"];
Ql[0] + "", Jn.OnChainOnly, Ql[1] + "", Jn.OffChainOnly, Ql[2] + "", Jn.Any, Jn.OnChainOnly + "", Jn.OnChainOnly, Jn.OffChainOnly + "", Jn.OffChainOnly, Jn.Any + "", Jn.Any;
var rd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(rd || (rd = {}));
rd.Mainnet;
var Ip;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ip || (Ip = {}));
var Js;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Js || (Js = {}));
var Lp;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Lp || (Lp = {}));
var Cp;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Cp || (Cp = {}));
var Tp;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Tp || (Tp = {}));
var Bp;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bp || (Bp = {}));
var Mp;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Mp || (Mp = {}));
var Np;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Np || (Np = {}));
var sd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(sd || (sd = {}));
var _p;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_p || (_p = {}));
var Pp;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Pp || (Pp = {}));
function od(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nv(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function lw(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  od(t.outputLen), od(t.blockLen);
}
function sv(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ov(t, e) {
  lw(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Jl = {
  number: od,
  bool: nv,
  bytes: lw,
  hash: rv,
  exists: sv,
  output: ov
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const tu = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, iv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!iv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function av(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function uw(t) {
  if (typeof t == "string" && (t = av(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let cv = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Po(t) {
  const e = (r) => t().update(uw(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function lv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), l = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + f, c, r);
}
let bf = class extends cv {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = tu(this.buffer);
  }
  update(e) {
    Jl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = uw(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const l = tu(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Jl.exists(this), Jl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    lv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = tu(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = l / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < f; d++)
      c.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const uv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), dw = Uint8Array.from({ length: 16 }, (t, e) => e), dv = dw.map((t) => (9 * t + 5) % 16);
let mf = [dw], xf = [dv];
for (let t = 0; t < 4; t++)
  for (let e of [mf, xf])
    e.push(e[t].map((n) => uv[n]));
const fw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fv = mf.map((t, e) => t.map((n) => fw[e][n])), hv = xf.map((t, e) => t.map((n) => fw[e][n])), pv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Za = (t, e) => t << e | t >>> 32 - e;
function Up(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qa = new Uint32Array(16);
let yv = class extends bf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Qa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, l = c, f = this.h3 | 0, h = f, d = this.h4 | 0, y = d;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, S = pv[p], C = gv[p], O = mf[p], H = xf[p], A = fv[p], T = hv[p];
      for (let _ = 0; _ < 16; _++) {
        const q = Za(r + Up(p, o, c, f) + Qa[O[_]] + S, A[_]) + d | 0;
        r = d, d = f, f = Za(c, 10) | 0, c = o, o = q;
      }
      for (let _ = 0; _ < 16; _++) {
        const q = Za(s + Up(E, i, l, h) + Qa[H[_]] + C, T[_]) + y | 0;
        s = y, y = h, h = Za(l, 10) | 0, l = i, i = q;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + y | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    Qa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Po(() => new yv());
const wv = (t, e, n) => t & e ^ ~t & n, bv = (t, e, n) => t & e ^ t & n ^ e & n, mv = new Uint32Array([
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
]), vs = new Uint32Array(64);
let hw = class extends bf {
  constructor() {
    super(64, 32, 8, !1), this.A = As[0] | 0, this.B = As[1] | 0, this.C = As[2] | 0, this.D = As[3] | 0, this.E = As[4] | 0, this.F = As[5] | 0, this.G = As[6] | 0, this.H = As[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: l } = this;
    return [e, n, r, s, o, i, c, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      vs[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const y = vs[d - 15], p = vs[d - 2], E = pr(y, 7) ^ pr(y, 18) ^ y >>> 3, S = pr(p, 17) ^ pr(p, 19) ^ p >>> 10;
      vs[d] = S + vs[d - 7] + E + vs[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: l, G: f, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const y = pr(c, 6) ^ pr(c, 11) ^ pr(c, 25), p = h + y + wv(c, l, f) + mv[d] + vs[d] | 0, S = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + bv(r, s, o) | 0;
      h = f, f = l, l = c, c = i + p | 0, i = o, o = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, l, f, h);
  }
  roundClean() {
    vs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, xv = class extends hw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Po(() => new hw());
Po(() => new xv());
const Ja = BigInt(2 ** 32 - 1), id = BigInt(32);
function pw(t, e = !1) {
  return e ? { h: Number(t & Ja), l: Number(t >> id & Ja) } : { h: Number(t >> id & Ja) | 0, l: Number(t & Ja) | 0 };
}
function Sv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = pw(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Ev = (t, e) => BigInt(t >>> 0) << id | BigInt(e >>> 0), Av = (t, e, n) => t >>> n, vv = (t, e, n) => t << 32 - n | e >>> n, kv = (t, e, n) => t >>> n | e << 32 - n, $v = (t, e, n) => t << 32 - n | e >>> n, Iv = (t, e, n) => t << 64 - n | e >>> n - 32, Lv = (t, e, n) => t >>> n - 32 | e << 64 - n, Cv = (t, e) => e, Tv = (t, e) => t, Bv = (t, e, n) => t << n | e >>> 32 - n, Mv = (t, e, n) => e << n | t >>> 32 - n, Nv = (t, e, n) => e << n - 32 | t >>> 64 - n, _v = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Pv(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Uv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ov = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Fv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), jv = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: pw,
  split: Sv,
  toBig: Ev,
  shrSH: Av,
  shrSL: vv,
  rotrSH: kv,
  rotrSL: $v,
  rotrBH: Iv,
  rotrBL: Lv,
  rotr32H: Cv,
  rotr32L: Tv,
  rotlSH: Bv,
  rotlSL: Mv,
  rotlBH: Nv,
  rotlBL: _v,
  add: Pv,
  add3L: Uv,
  add3H: Hv,
  add4L: Ov,
  add4H: Dv,
  add5H: jv,
  add5L: Fv
}, [Rv, zv] = Ut.split([
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
].map((t) => BigInt(t))), ks = new Uint32Array(80), $s = new Uint32Array(80);
let Sl = class extends bf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: l, Eh: f, El: h, Fh: d, Fl: y, Gh: p, Gl: E, Hh: S, Hl: C } = this;
    return [e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ks[A] = e.getUint32(n), $s[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ks[A - 15] | 0, _ = $s[A - 15] | 0, q = Ut.rotrSH(T, _, 1) ^ Ut.rotrSH(T, _, 8) ^ Ut.shrSH(T, _, 7), it = Ut.rotrSL(T, _, 1) ^ Ut.rotrSL(T, _, 8) ^ Ut.shrSL(T, _, 7), Q = ks[A - 2] | 0, K = $s[A - 2] | 0, b = Ut.rotrSH(Q, K, 19) ^ Ut.rotrBH(Q, K, 61) ^ Ut.shrSH(Q, K, 6), I = Ut.rotrSL(Q, K, 19) ^ Ut.rotrBL(Q, K, 61) ^ Ut.shrSL(Q, K, 6), B = Ut.add4L(it, I, $s[A - 7], $s[A - 16]), M = Ut.add4H(B, q, b, ks[A - 7], ks[A - 16]);
      ks[A] = M | 0, $s[A] = B | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: l, Dh: f, Dl: h, Eh: d, El: y, Fh: p, Fl: E, Gh: S, Gl: C, Hh: O, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const T = Ut.rotrSH(d, y, 14) ^ Ut.rotrSH(d, y, 18) ^ Ut.rotrBH(d, y, 41), _ = Ut.rotrSL(d, y, 14) ^ Ut.rotrSL(d, y, 18) ^ Ut.rotrBL(d, y, 41), q = d & p ^ ~d & S, it = y & E ^ ~y & C, Q = Ut.add5L(H, _, it, zv[A], $s[A]), K = Ut.add5H(Q, O, T, q, Rv[A], ks[A]), b = Q | 0, I = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), B = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), M = r & o ^ r & c ^ o & c, V = s & i ^ s & l ^ i & l;
      O = S | 0, H = C | 0, S = p | 0, C = E | 0, p = d | 0, E = y | 0, { h: d, l: y } = Ut.add(f | 0, h | 0, K | 0, b | 0), f = c | 0, h = l | 0, c = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const R = Ut.add3L(b, B, V);
      r = Ut.add3H(R, K, I, M), s = R | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ut.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l } = Ut.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: f, l: h } = Ut.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: d, l: y } = Ut.add(this.Eh | 0, this.El | 0, d | 0, y | 0), { h: p, l: E } = Ut.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: S, l: C } = Ut.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: O, l: H } = Ut.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, c, l, f, h, d, y, p, E, S, C, O, H);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Gv = class extends Sl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Kv = class extends Sl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Vv = class extends Sl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Po(() => new Sl());
Po(() => new Gv());
Po(() => new Kv());
Po(() => new Vv());
function Yv(t, e, n) {
  const s = tv;
  if (l4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: nd.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var je;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(je || (je = {}));
let Xv = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, gw = class extends Xv {
  constructor(e) {
    super(e);
  }
};
function El(t) {
  const e = [];
  return e.push(da(pf(t.version, 1))), e.push(da(t.hash160)), Wr(e);
}
function qv(t) {
  const e = [];
  return e.push(t.prefix), e.push(El(t.address)), t.prefix === sd.Contract && e.push(fa(t.contractName)), Wr(e);
}
function fa(t) {
  const e = [], n = yf(t.content), r = n.byteLength;
  return e.push(da(pf(r, t.lengthPrefixBytes))), e.push(n), Wr(e);
}
function Wv(t) {
  const e = [];
  return e.push(El(t.address)), e.push(fa(t.contractName)), e.push(fa(t.assetName)), Wr(e);
}
function yw(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(qv(t.principal)), (t.conditionType === Js.Fungible || t.conditionType === Js.NonFungible) && e.push(Wv(t.assetInfo)), t.conditionType === Js.NonFungible && e.push(Ao(t.assetName)), e.push(t.conditionCode), t.conditionType === Js.STX || t.conditionType === Js.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new gw("The post-condition amount may not be larger than 8 bytes");
    e.push(XA(t.amount, !1, 8));
  }
  return Wr(e);
}
function Lr(t, e) {
  return Wr([t, e]);
}
function Zv(t) {
  return new Uint8Array([t.type]);
}
function Qv(t) {
  return t.type === je.OptionalNone ? new Uint8Array([t.type]) : Lr(t.type, Ao(t.value));
}
function Jv(t) {
  const e = new Uint8Array(4);
  return xl(e, t.buffer.length, 0), Lr(t.type, wf(e, t.buffer));
}
function t4(t) {
  const e = gf(qA(t.value, BigInt(ev)), cw);
  return Lr(t.type, e);
}
function e4(t) {
  const e = gf(t.value, cw);
  return Lr(t.type, e);
}
function n4(t) {
  return Lr(t.type, El(t.address));
}
function r4(t) {
  return Lr(t.type, wf(El(t.address), fa(t.contractName)));
}
function s4(t) {
  return Lr(t.type, Ao(t.value));
}
function o4(t) {
  const e = [], n = new Uint8Array(4);
  xl(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ao(r);
    e.push(s);
  }
  return Lr(t.type, Wr(e));
}
function i4(t) {
  const e = [], n = new Uint8Array(4);
  xl(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Yv(s);
    e.push(fa(o));
    const i = Ao(t.data[s]);
    e.push(i);
  }
  return Lr(t.type, Wr(e));
}
function ww(t, e) {
  const n = [], r = e == "ascii" ? QA(t.data) : yf(t.data), s = new Uint8Array(4);
  return xl(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, Wr(n));
}
function a4(t) {
  return ww(t, "ascii");
}
function c4(t) {
  return ww(t, "utf8");
}
function Ao(t) {
  switch (t.type) {
    case je.BoolTrue:
    case je.BoolFalse:
      return Zv(t);
    case je.OptionalNone:
    case je.OptionalSome:
      return Qv(t);
    case je.Buffer:
      return Jv(t);
    case je.UInt:
      return e4(t);
    case je.Int:
      return t4(t);
    case je.PrincipalStandard:
      return n4(t);
    case je.PrincipalContract:
      return r4(t);
    case je.ResponseOk:
    case je.ResponseErr:
      return s4(t);
    case je.List:
      return o4(t);
    case je.Tuple:
      return i4(t);
    case je.StringASCII:
      return a4(t);
    case je.StringUTF8:
      return c4(t);
    default:
      throw new gw("Unable to serialize. Invalid Clarity Value.");
  }
}
const l4 = (t, e) => t ? yf(t).length > e : !1, u4 = "connect-ui";
let mc, bw, Bn = !1, ad = !1;
const qr = (t, e = "") => () => {
}, d4 = (t, e) => () => {
}, f4 = "{visibility:hidden}.hydrated{visibility:inherit}", Hp = {}, h4 = "http://www.w3.org/2000/svg", p4 = "http://www.w3.org/1999/xhtml", g4 = (t) => t != null, Sf = (t) => (t = typeof t, t === "object" || t === "function");
function mw(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Ct = (t, e, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], c = (f) => {
    for (let h = 0; h < f.length; h++)
      r = f[h], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Sf(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? cd(null, r) : r), o = s);
  };
  if (c(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((h) => f[h]).join(" "));
  }
  const l = cd(t, null);
  return l.$attrs$ = e, i.length > 0 && (l.$children$ = i), l;
}, cd = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, y4 = {}, w4 = (t) => t && t.$tag$ === y4, b4 = (t, e) => t != null && !Sf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, m4 = (t) => Ni(t).$hostElement$, x4 = (t, e, n) => {
  const r = en.ce(e, n);
  return t.dispatchEvent(r), r;
}, Op = /* @__PURE__ */ new WeakMap(), S4 = (t, e, n) => {
  let r = Fc.get(t);
  j4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Fc.set(t, r);
}, E4 = (t, e, n, r) => {
  var s;
  let o = xw(e);
  const i = Fc.get(o);
  if (t = t.nodeType === 11 ? t : Ar, i)
    if (typeof i == "string") {
      t = t.head || t;
      let c = Op.get(t), l;
      if (c || Op.set(t, c = /* @__PURE__ */ new Set()), !c.has(o)) {
        {
          l = Ar.createElement("style"), l.innerHTML = i;
          const f = (s = en.$nonce$) !== null && s !== void 0 ? s : mw(Ar);
          f != null && l.setAttribute("nonce", f), t.insertBefore(l, t.querySelector("link"));
        }
        c && c.add(o);
      }
    } else t.adoptedStyleSheets.includes(i) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, i]);
  return o;
}, A4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = qr("attachStyles", e.$tagName$), o = E4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, xw = (t, e) => "sc-" + t.$tagName$, Dp = (t, e, n, r, s, o) => {
  if (n !== r) {
    let i = jp(t, e), c = e.toLowerCase();
    if (e === "class") {
      const l = t.classList, f = Fp(n), h = Fp(r);
      l.remove(...f.filter((d) => d && !h.includes(d))), l.add(...h.filter((d) => d && !f.includes(d)));
    } else if (!i && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : jp(Al, c) ? e = c.slice(2) : e = c[2] + e.slice(3), n && en.rel(t, e, n, !1), r && en.ael(t, e, r, !1);
    else {
      const l = Sf(r);
      if ((i || l && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const f = r ?? "";
            e === "list" ? i = !1 : (n == null || t[e] != f) && (t[e] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!i || o & 4 || s) && !l && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, v4 = /\s/, Fp = (t) => t ? t.split(v4) : [], Sw = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, o = t && t.$attrs$ || Hp, i = e.$attrs$ || Hp;
  for (r in o)
    r in i || Dp(s, r, o[r], void 0, n, e.$flags$);
  for (r in i)
    Dp(s, r, o[r], i[r], n, e.$flags$);
}, Ef = (t, e, n, r) => {
  const s = e.$children$[n];
  let o = 0, i, c;
  if (s.$text$ !== null)
    i = s.$elm$ = Ar.createTextNode(s.$text$);
  else {
    if (Bn || (Bn = s.$tag$ === "svg"), i = s.$elm$ = Ar.createElementNS(Bn ? h4 : p4, s.$tag$), Bn && s.$tag$ === "foreignObject" && (Bn = !1), Sw(null, s, Bn), g4(mc) && i["s-si"] !== mc && i.classList.add(i["s-si"] = mc), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        c = Ef(t, s, o), c && i.appendChild(c);
    s.$tag$ === "svg" ? Bn = !1 : i.tagName === "foreignObject" && (Bn = !0);
  }
  return i;
}, Ew = (t, e, n, r, s, o) => {
  let i = t, c;
  for (i.shadowRoot && i.tagName === bw && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (c = Ef(null, n, s), c && (r[s].$elm$ = c, i.insertBefore(c, e)));
}, Aw = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, k4 = (t, e, n, r) => {
  let s = 0, o = 0, i = e.length - 1, c = e[0], l = e[i], f = r.length - 1, h = r[0], d = r[f], y;
  for (; s <= i && o <= f; )
    c == null ? c = e[++s] : l == null ? l = e[--i] : h == null ? h = r[++o] : d == null ? d = r[--f] : tc(c, h) ? (Qi(c, h), c = e[++s], h = r[++o]) : tc(l, d) ? (Qi(l, d), l = e[--i], d = r[--f]) : tc(c, d) ? (Qi(c, d), t.insertBefore(c.$elm$, l.$elm$.nextSibling), c = e[++s], d = r[--f]) : tc(l, h) ? (Qi(l, h), t.insertBefore(l.$elm$, c.$elm$), l = e[--i], h = r[++o]) : (y = Ef(e && e[o], n, o), h = r[++o], y && c.$elm$.parentNode.insertBefore(y, c.$elm$));
  s > i ? Ew(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, o, f) : o > f && Aw(e, s, i);
}, tc = (t, e) => t.$tag$ === e.$tag$, Qi = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, o = e.$tag$, i = e.$text$;
  i === null ? (Bn = o === "svg" ? !0 : o === "foreignObject" ? !1 : Bn, Sw(t, e, Bn), r !== null && s !== null ? k4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Ew(n, null, e, s, 0, s.length - 1)) : r !== null && Aw(r, 0, r.length - 1), Bn && o === "svg" && (Bn = !1)) : t.$text$ !== i && (n.data = i);
}, $4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || cd(null, null), s = w4(e) ? e : Ct(null, null, e);
  bw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, mc = n["s-sc"], Qi(r, s);
}, vw = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Af = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return vw(t, t.$ancestorComponent$), z4(() => I4(t, e));
}, I4 = (t, e) => {
  const n = qr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), B4(s, () => L4(t, r, e));
}, L4 = async (t, e, n) => {
  const r = t.$hostElement$, s = qr("update", t.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && A4(t);
  const i = qr("render", t.$cmpMeta$.$tagName$);
  C4(t, e), o && (o.map((c) => c()), r["s-rc"] = void 0), i(), s();
  {
    const c = r["s-p"], l = () => T4(t);
    c.length === 0 ? l() : (Promise.all(c).then(l), t.$flags$ |= 4, c.length = 0);
  }
}, C4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, $4(t, e);
  } catch (r) {
    ha(r, t.$hostElement$);
  }
  return null;
}, T4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = qr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, $w(n), r(), t.$onReadyResolve$(n), s || kw()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && kf(() => Af(t, !1)), t.$flags$ &= -517;
}, kw = (t) => {
  $w(Ar.documentElement), kf(() => x4(Al, "appload", { detail: { namespace: u4 } }));
}, B4 = (t, e) => t && t.then ? t.then(e) : e(), $w = (t) => t.classList.add("hydrated"), M4 = (t, e) => Ni(t).$instanceValues$.get(e), N4 = (t, e, n, r) => {
  const s = Ni(t), o = s.$instanceValues$.get(e), i = s.$flags$, c = s.$lazyInstance$;
  n = b4(n, r.$members$[e][0]);
  const l = Number.isNaN(o) && Number.isNaN(n), f = n !== o && !l;
  (!(i & 8) || o === void 0) && f && (s.$instanceValues$.set(e, n), c && (i & 18) === 2 && Af(s, !1));
}, Iw = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return M4(this, o);
        },
        set(c) {
          N4(this, o, c, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, c, l) {
        en.jmp(() => {
          const f = o.get(i);
          if (this.hasOwnProperty(f))
            l = this[f], delete this[f];
          else if (s.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == l)
            return;
          this[f] = l === null && typeof this[f] == "boolean" ? !1 : l;
        });
      }, t.observedAttributes = r.filter(
        ([i, c]) => c[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, c]) => {
        const l = c[1] || i;
        return o.set(l, i), l;
      });
    }
  }
  return t;
}, _4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = F4(n), s.then) {
        const l = d4();
        s = await s, l();
      }
      s.isProxied || (Iw(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const c = qr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (l) {
        ha(l);
      }
      e.$flags$ &= -9, c();
    }
    if (s.style) {
      let c = s.style;
      const l = xw(n);
      if (!Fc.has(l)) {
        const f = qr("registerStyles", n.$tagName$);
        S4(l, c, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const o = e.$ancestorComponent$, i = () => Af(e, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, P4 = (t) => {
  if (!(en.$flags$ & 1)) {
    const e = Ni(t), n = e.$cmpMeta$, r = qr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            vw(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && t.hasOwnProperty(s)) {
          const i = t[s];
          delete t[s], t[s] = i;
        }
      }), _4(t, e, n);
    }
    r();
  }
}, U4 = (t) => {
  en.$flags$ & 1 || Ni(t);
}, H4 = (t, e = {}) => {
  var n;
  const r = qr(), s = [], o = e.exclude || [], i = Al.customElements, c = Ar.head, l = /* @__PURE__ */ c.querySelector("meta[charset]"), f = /* @__PURE__ */ Ar.createElement("style"), h = [];
  let d, y = !0;
  Object.assign(en, e), en.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Ar.baseURI).href, t.map((p) => {
    p[1].map((E) => {
      const S = {
        $flags$: E[0],
        $tagName$: E[1],
        $members$: E[2],
        $listeners$: E[3]
      };
      S.$members$ = E[2];
      const C = S.$tagName$, O = class extends HTMLElement {
        // StencilLazyHost
        constructor(H) {
          super(H), H = this, D4(H, S), S.$flags$ & 1 && H.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), y ? h.push(this) : en.jmp(() => P4(this));
        }
        disconnectedCallback() {
          en.jmp(() => U4(this));
        }
        componentOnReady() {
          return Ni(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !o.includes(C) && !i.get(C) && (s.push(C), i.define(C, Iw(
        O,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + f4, f.setAttribute("data-styles", "");
    const p = (n = en.$nonce$) !== null && n !== void 0 ? n : mw(Ar);
    p != null && f.setAttribute("nonce", p), c.insertBefore(f, l ? l.nextSibling : c.firstChild);
  }
  y = !1, h.length ? h.map((p) => p.connectedCallback()) : en.jmp(() => d = setTimeout(kw, 30)), r();
}, vf = /* @__PURE__ */ new WeakMap(), Ni = (t) => vf.get(t), O4 = (t, e) => vf.set(e.$lazyInstance$ = t, e), D4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], vf.set(t, n);
}, jp = (t, e) => e in t, ha = (t, e) => (0, console.error)(t, e), eu = /* @__PURE__ */ new Map(), F4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, o = eu.get(s);
  if (o)
    return o[r];
  {
    const i = (c) => (eu.set(s, c), c[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => rL).then(i, ha);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (eu.set(s, i), i[r]), ha);
}, Fc = /* @__PURE__ */ new Map(), Al = typeof window < "u" ? window : {}, Ar = Al.document || { head: {} }, en = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Lw = (t) => Promise.resolve(t), j4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Rp = [], Cw = [], R4 = (t, e) => (n) => {
  t.push(n), ad || (ad = !0, en.$flags$ & 4 ? kf(ld) : en.raf(ld));
}, zp = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      ha(n);
    }
  t.length = 0;
}, ld = () => {
  zp(Rp), zp(Cw), (ad = Rp.length > 0) && en.raf(ld);
}, kf = (t) => Lw().then(t), z4 = /* @__PURE__ */ R4(Cw), G4 = () => Lw(), K4 = (t, e) => typeof window > "u" ? Promise.resolve() : G4().then(() => H4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var V4 = Object.defineProperty, Y4 = Object.defineProperties, X4 = Object.getOwnPropertyDescriptors, jc = Object.getOwnPropertySymbols, Tw = Object.prototype.hasOwnProperty, Bw = Object.prototype.propertyIsEnumerable, Gp = (t, e, n) => e in t ? V4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Un = (t, e) => {
  for (var n in e || (e = {})) Tw.call(e, n) && Gp(t, n, e[n]);
  if (jc) for (var n of jc(e)) Bw.call(e, n) && Gp(t, n, e[n]);
  return t;
}, ir = (t, e) => Y4(t, X4(e)), Mw = (t, e) => {
  var n = {};
  for (var r in t) Tw.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && jc) for (var r of jc(t)) e.indexOf(r) < 0 && Bw.call(t, r) && (n[r] = t[r]);
  return n;
};
function Nw() {
  return yl(wo()) || window.StacksProvider || window.BlockstackProvider;
}
function vl(t) {
  return t ? typeof t == "string" ? mo.fromName(t) : "version" in t ? t : "url" in t ? new Hu({ url: t.url }) : t.transactionVersion === So.Mainnet ? new Hu({ url: t.client.baseUrl }) : new Ou({ url: t.client.baseUrl }) : new Ou();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var q4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(q4 || {}), W4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(W4 || {}), $f = (t) => {
  let e = t;
  if (!e) {
    let n = new fg(["store_write"], document.location.href);
    e = new Uu({ appConfig: n });
  }
  return e;
};
function _w(t) {
  try {
    return $f(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Pw = (t) => {
  let e = $f(t).loadUserData().appPrivateKey, n = Ye.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Z4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let o = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, i = { [xo.Mainnet]: "mainnet", [xo.Testnet]: "testnet" }, c = vl(s);
  return o == null ? void 0 : o[i[c.chainId]];
}
function Q4(t) {
  let e = vl(t.network), n = $f(t.userSession), r = ir(Un({}, t), { network: e, userSession: n });
  return Un({ stxAddress: Z4(r) }, r);
}
async function J4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(iw) : n = n.map((r) => gt(yw(r)))), new Ye.TokenSigner("ES256k", e).signAsync(ir(Un({}, t), { postConditions: n }));
}
function tk(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(iw) : e = e.map((n) => gt(yw(n)))), Ye.createUnsecuredToken(ir(Un({}, t), { postConditions: e }));
}
var ek = async ({ token: t, options: e }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(t), { txRaw: c } = i, l = qt(c.replace(/^0x/, "")), f = KA(l);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, ir(Un({}, i), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, ir(Un({}, i), { stacksTransaction: f }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = e.onCancel) == null || o.call(e);
  }
}, nk = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, o = Mw(e, ["amount", "appDetails", "userSession"]);
  if (_w(s)) {
    let { privateKey: c, publicKey: l } = Pw(s), f = ir(Un({}, o), { amount: n.toString(10), publicKey: l, txType: "token_transfer" });
    return r && (f.appDetails = r), J4(f, c);
  }
  let i = ir(Un({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), tk(i);
};
async function rk(t, e, n) {
  let r = await e(ir(Un(Un({}, Q4(t)), t), { network: vl(t.network) }));
  return ek({ token: r, options: t }, n);
}
function sk(t, e = Nw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return rk(t, nk, e);
}
function Uw(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ir(Un({}, t), { message: bp(e), domain: bp(n) }) : ir(Un({}, t), { message: gt(Ao(e)), domain: gt(Ao(n)) });
}
async function ok(t, e) {
  return new Ye.TokenSigner("ES256k", e).signAsync(Uw(t));
}
async function ik(t) {
  let e = t, { userSession: n } = e, r = Mw(e, ["userSession"]);
  if (_w(n)) {
    let { privateKey: s, publicKey: o } = Pw(n), i = ir(Un({}, r), { publicKey: o });
    return ok(i, s);
  }
  return Ye.createUnsecuredToken(Uw(t));
}
var ak = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(ak || {}), Hw = "asigna-stx", Kp = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Hw && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(lk(t, e), "*");
}), ck = { authenticationRequest: async (t) => Kp(t, "authenticationRequest"), transactionRequest: async (t) => Kp(t, "transactionRequest") }, lk = (t, e) => ({ source: Hw, [e]: t }), uk = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = ck);
};
uk();
var dk = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function fk(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let o = wo(), i = Nw();
    if (o && i) return t(n, i);
    if (typeof window > "u") return;
    K4();
    let c = (s = n == null ? void 0 : n.defaultProviders) != null ? s : dk, l = r3(c), f = document.createElement("connect-modal");
    f.defaultProviders = c, f.installedProviders = l, f.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      f.remove(), document.body.style.overflow = h;
    };
    f.callback = (p) => {
      d(), t(n, p);
    }, f.cancelCallback = () => {
      var p;
      d(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(f);
    let y = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", y), f.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var ec = fk(sk);
function Fs(t, e, n) {
  return If(hn(t, e), n);
}
function hn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Se(r);
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
      const r = gk(BigInt(`0x${Rt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Rt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Vp(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function $a(t, e = 8) {
  return (typeof t == "bigint" ? t : hn(t, !1)).toString(16).padStart(e * 2, "0");
}
function kl(t) {
  return parseInt(t, 16);
}
function If(t, e = 16) {
  const n = $a(t, e);
  return Se(n);
}
function hk(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function pk(t, e) {
  return t & BigInt(1) << e;
}
function gk(t, e) {
  return pk(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const yk = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += yk[n];
  return e;
}
function Se(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = e.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function _i(t) {
  return new TextEncoder().encode(t);
}
function Lf(t) {
  return new TextDecoder().decode(t);
}
function Ow(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function wk(t) {
  return String.fromCharCode.apply(null, t);
}
function bk(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Yp(t) {
  if (t.some(bk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $l(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, s) => r + s.length, 0), n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const o = t[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function He(t) {
  return $l(...t.map((e) => typeof e == "number" ? Yp([e]) : e instanceof Array ? Yp(e) : e));
}
var Xp;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xp || (Xp = {}));
var qp;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qp || (qp = {}));
var Wp;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Wp || (Wp = {}));
const Dw = 33, nu = 32;
function mk(t) {
  if (t.length < nu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + nu * 2), r = t.slice(2 + nu * 2);
  return {
    recoveryId: kl(e),
    r: n,
    s: r
  };
}
function xk(t) {
  const e = typeof t == "string" ? Se(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Sk(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Ek(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Ak(t, e) {
  return t[e];
}
function vk(t, e, n = 0) {
  return t[n] = e, t;
}
function kk(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function vo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ud;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ud || (ud = {}));
const $k = ud.Mainnet, Ik = 128, Lk = 128, Fw = 16, co = 32, dd = 80, Il = 65, Ck = 32, Tk = 64, Rc = 34;
var pt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(pt || (pt = {}));
var Dt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Dt || (Dt = {}));
var fd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(fd || (fd = {}));
var xn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xn || (xn = {}));
const xc = ["onChainOnly", "offChainOnly", "any"], Zp = {
  [xc[0]]: xn.OnChainOnly,
  [xc[1]]: xn.OffChainOnly,
  [xc[2]]: xn.Any,
  [xn.OnChainOnly]: xn.OnChainOnly,
  [xn.OffChainOnly]: xn.OffChainOnly,
  [xn.Any]: xn.Any
};
function Bk(t) {
  if (t in Zp)
    return Zp[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${xc.join(", ")}`);
}
var zc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zc || (zc = {}));
zc.Mainnet;
var vi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(vi || (vi = {}));
var Sn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Sn || (Sn = {}));
var Te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Te || (Te = {}));
var he;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(he || (he = {}));
var Gc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Gc || (Gc = {}));
var ve;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ve || (ve = {}));
var pa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(pa || (pa = {}));
var hd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(hd || (hd = {}));
var ga;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ga || (ga = {}));
var Qp;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qp || (Qp = {}));
var Jp;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Jp || (Jp = {}));
function pd(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Mk(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jw(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Nk(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pd(t.outputLen), pd(t.blockLen);
}
function _k(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Pk(t, e) {
  jw(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const oo = {
  number: pd,
  bool: Mk,
  bytes: jw,
  hash: Nk,
  exists: _k,
  output: Pk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ru = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, Uk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Uk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Hk(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Cf(t) {
  if (typeof t == "string" && (t = Hk(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Rw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Uo(t) {
  const e = (r) => t().update(Cf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ok(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), c = Number(n & o), l = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + l, i, r), t.setUint32(e + f, c, r);
}
class Tf extends Rw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ru(this.buffer);
  }
  update(e) {
    oo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Cf(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(s - this.pos, o - i);
      if (c === s) {
        const l = ru(e);
        for (; s <= o - i; i += s)
          this.process(l, i);
        continue;
      }
      r.set(e.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    oo.exists(this), oo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    Ok(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const c = ru(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = l / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < f; d++)
      c.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: c } = this;
    return e.length = s, e.pos = c, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
}
const Dk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), zw = Uint8Array.from({ length: 16 }, (t, e) => e), Fk = zw.map((t) => (9 * t + 5) % 16);
let Bf = [zw], Mf = [Fk];
for (let t = 0; t < 4; t++)
  for (let e of [Bf, Mf])
    e.push(e[t].map((n) => Dk[n]));
const Gw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jk = Bf.map((t, e) => t.map((n) => Gw[e][n])), Rk = Mf.map((t, e) => t.map((n) => Gw[e][n])), zk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Gk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), nc = (t, e) => t << e | t >>> 32 - e;
function t0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const rc = new Uint32Array(16);
class Kk extends Tf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: s, h4: o } = this;
    return [e, n, r, s, o];
  }
  set(e, n, r, s, o) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      rc[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, c = this.h2 | 0, l = c, f = this.h3 | 0, h = f, d = this.h4 | 0, y = d;
    for (let p = 0; p < 5; p++) {
      const E = 4 - p, S = zk[p], C = Gk[p], O = Bf[p], H = Mf[p], A = jk[p], T = Rk[p];
      for (let _ = 0; _ < 16; _++) {
        const q = nc(r + t0(p, o, c, f) + rc[O[_]] + S, A[_]) + d | 0;
        r = d, d = f, f = nc(c, 10) | 0, c = o, o = q;
      }
      for (let _ = 0; _ < 16; _++) {
        const q = nc(s + t0(E, i, l, h) + rc[H[_]] + C, T[_]) + y | 0;
        s = y, y = h, h = nc(l, 10) | 0, l = i, i = q;
      }
    }
    this.set(this.h1 + c + h | 0, this.h2 + f + y | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + l | 0);
  }
  roundClean() {
    rc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Vk = Uo(() => new Kk()), Yk = (t, e, n) => t & e ^ ~t & n, Xk = (t, e, n) => t & e ^ t & n ^ e & n, qk = new Uint32Array([
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
class Kw extends Tf {
  constructor() {
    super(64, 32, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: c, H: l } = this;
    return [e, n, r, s, o, i, c, l];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(e, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Ls[d] = e.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const y = Ls[d - 15], p = Ls[d - 2], E = gr(y, 7) ^ gr(y, 18) ^ y >>> 3, S = gr(p, 17) ^ gr(p, 19) ^ p >>> 10;
      Ls[d] = S + Ls[d - 7] + E + Ls[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: c, F: l, G: f, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const y = gr(c, 6) ^ gr(c, 11) ^ gr(c, 25), p = h + y + Yk(c, l, f) + qk[d] + Ls[d] | 0, S = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + Xk(r, s, o) | 0;
      h = f, f = l, l = c, c = i + p | 0, i = o, o = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, c, l, f, h);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Wk extends Kw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Nf = Uo(() => new Kw());
Uo(() => new Wk());
const sc = BigInt(2 ** 32 - 1), gd = BigInt(32);
function Vw(t, e = !1) {
  return e ? { h: Number(t & sc), l: Number(t >> gd & sc) } : { h: Number(t >> gd & sc) | 0, l: Number(t & sc) | 0 };
}
function Zk(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Vw(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Qk = (t, e) => BigInt(t >>> 0) << gd | BigInt(e >>> 0), Jk = (t, e, n) => t >>> n, t8 = (t, e, n) => t << 32 - n | e >>> n, e8 = (t, e, n) => t >>> n | e << 32 - n, n8 = (t, e, n) => t << 32 - n | e >>> n, r8 = (t, e, n) => t << 64 - n | e >>> n - 32, s8 = (t, e, n) => t >>> n - 32 | e << 64 - n, o8 = (t, e) => e, i8 = (t, e) => t, a8 = (t, e, n) => t << n | e >>> 32 - n, c8 = (t, e, n) => e << n | t >>> 32 - n, l8 = (t, e, n) => e << n - 32 | t >>> 64 - n, u8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function d8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const f8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), h8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, p8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), g8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, y8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), w8 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Ht = {
  fromBig: Vw,
  split: Zk,
  toBig: Qk,
  shrSH: Jk,
  shrSL: t8,
  rotrSH: e8,
  rotrSL: n8,
  rotrBH: r8,
  rotrBL: s8,
  rotr32H: o8,
  rotr32L: i8,
  rotlSH: a8,
  rotlSL: c8,
  rotlBH: l8,
  rotlBL: u8,
  add: d8,
  add3L: f8,
  add3H: h8,
  add4L: p8,
  add4H: g8,
  add5H: w8,
  add5L: y8
}, [b8, m8] = Ht.split([
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
].map((t) => BigInt(t))), Cs = new Uint32Array(80), Ts = new Uint32Array(80);
class Ll extends Tf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: c, Dl: l, Eh: f, El: h, Fh: d, Fl: y, Gh: p, Gl: E, Hh: S, Hl: C } = this;
    return [e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, c, l, f, h, d, y, p, E, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = E | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Cs[A] = e.getUint32(n), Ts[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Cs[A - 15] | 0, _ = Ts[A - 15] | 0, q = Ht.rotrSH(T, _, 1) ^ Ht.rotrSH(T, _, 8) ^ Ht.shrSH(T, _, 7), it = Ht.rotrSL(T, _, 1) ^ Ht.rotrSL(T, _, 8) ^ Ht.shrSL(T, _, 7), Q = Cs[A - 2] | 0, K = Ts[A - 2] | 0, b = Ht.rotrSH(Q, K, 19) ^ Ht.rotrBH(Q, K, 61) ^ Ht.shrSH(Q, K, 6), I = Ht.rotrSL(Q, K, 19) ^ Ht.rotrBL(Q, K, 61) ^ Ht.shrSL(Q, K, 6), B = Ht.add4L(it, I, Ts[A - 7], Ts[A - 16]), M = Ht.add4H(B, q, b, Cs[A - 7], Cs[A - 16]);
      Cs[A] = M | 0, Ts[A] = B | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: c, Cl: l, Dh: f, Dl: h, Eh: d, El: y, Fh: p, Fl: E, Gh: S, Gl: C, Hh: O, Hl: H } = this;
    for (let A = 0; A < 80; A++) {
      const T = Ht.rotrSH(d, y, 14) ^ Ht.rotrSH(d, y, 18) ^ Ht.rotrBH(d, y, 41), _ = Ht.rotrSL(d, y, 14) ^ Ht.rotrSL(d, y, 18) ^ Ht.rotrBL(d, y, 41), q = d & p ^ ~d & S, it = y & E ^ ~y & C, Q = Ht.add5L(H, _, it, m8[A], Ts[A]), K = Ht.add5H(Q, O, T, q, b8[A], Cs[A]), b = Q | 0, I = Ht.rotrSH(r, s, 28) ^ Ht.rotrBH(r, s, 34) ^ Ht.rotrBH(r, s, 39), B = Ht.rotrSL(r, s, 28) ^ Ht.rotrBL(r, s, 34) ^ Ht.rotrBL(r, s, 39), M = r & o ^ r & c ^ o & c, V = s & i ^ s & l ^ i & l;
      O = S | 0, H = C | 0, S = p | 0, C = E | 0, p = d | 0, E = y | 0, { h: d, l: y } = Ht.add(f | 0, h | 0, K | 0, b | 0), f = c | 0, h = l | 0, c = o | 0, l = i | 0, o = r | 0, i = s | 0;
      const R = Ht.add3L(b, B, V);
      r = Ht.add3H(R, K, I, M), s = R | 0;
    }
    ({ h: r, l: s } = Ht.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ht.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: c, l } = Ht.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: f, l: h } = Ht.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: d, l: y } = Ht.add(this.Eh | 0, this.El | 0, d | 0, y | 0), { h: p, l: E } = Ht.add(this.Fh | 0, this.Fl | 0, p | 0, E | 0), { h: S, l: C } = Ht.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: O, l: H } = Ht.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, c, l, f, h, d, y, p, E, S, C, O, H);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class x8 extends Ll {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class S8 extends Ll {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class E8 extends Ll {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Uo(() => new Ll());
Uo(() => new x8());
const A8 = Uo(() => new S8());
Uo(() => new E8());
function Yw(t) {
  if (Se(t).byteLength != Il)
    throw Error("Invalid signature");
  return {
    type: pt.MessageSignature,
    data: t
  };
}
function Ji(t, e) {
  return { type: pt.Address, version: t, hash160: e };
}
function ii(t) {
  return No.c32address(t.version, t.hash160);
}
function ko(t, e, n) {
  const r = e || 1, s = n || Ik;
  if (ub(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function _f(t) {
  const e = No.c32addressDecode(t);
  return {
    type: pt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var et;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(et || (et = {}));
function v8(t) {
  if (t.type === et.PrincipalStandard)
    return ii(t.address);
  if (t.type === et.PrincipalContract)
    return `${ii(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Xw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return I8(e, n);
  } else
    return k8(t);
}
function k8(t) {
  const e = _f(t);
  return { type: et.PrincipalStandard, address: e };
}
function $8(t) {
  return { type: et.PrincipalStandard, address: t };
}
function I8(t, e) {
  const n = _f(t), r = ko(e);
  return qw(n, r);
}
function qw(t, e) {
  if (_i(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: et.PrincipalContract, address: t, contractName: e };
}
function su(t, e = !1) {
  switch (t.type) {
    case et.BoolTrue:
      return !0;
    case et.BoolFalse:
      return !1;
    case et.Int:
    case et.UInt:
      return e ? t.value.toString() : t.value;
    case et.Buffer:
      return `0x${Rt(t.buffer)}`;
    case et.OptionalNone:
      return null;
    case et.OptionalSome:
      return nr(t.value);
    case et.ResponseErr:
      return nr(t.value);
    case et.ResponseOk:
      return nr(t.value);
    case et.PrincipalStandard:
    case et.PrincipalContract:
      return v8(t);
    case et.List:
      return t.list.map((r) => nr(r));
    case et.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = nr(t.data[r]);
      }), n;
    case et.StringASCII:
      return t.data;
    case et.StringUTF8:
      return t.data;
  }
}
function nr(t) {
  switch (t.type) {
    case et.ResponseErr:
      return { type: Ns(t), value: su(t, !0), success: !1 };
    case et.ResponseOk:
      return { type: Ns(t), value: su(t, !0), success: !0 };
    default:
      return { type: Ns(t), value: su(t, !0) };
  }
}
function Ns(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return "bool";
    case et.Int:
      return "int";
    case et.UInt:
      return "uint";
    case et.Buffer:
      return `(buff ${t.buffer.length})`;
    case et.OptionalNone:
      return "(optional none)";
    case et.OptionalSome:
      return `(optional ${Ns(t.value)})`;
    case et.ResponseErr:
      return `(response UnknownType ${Ns(t.value)})`;
    case et.ResponseOk:
      return `(response ${Ns(t.value)} UnknownType)`;
    case et.PrincipalStandard:
    case et.PrincipalContract:
      return "principal";
    case et.List:
      return `(list ${t.list.length} ${t.list.length ? Ns(t.list[0]) : "UnknownType"})`;
    case et.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Ns(t.data[e])})`).join(" ")})`;
    case et.StringASCII:
      return `(string-ascii ${Ow(t.data).length})`;
    case et.StringUTF8:
      return `(string-utf8 ${_i(t.data).length})`;
  }
}
const Ww = () => ({ type: et.BoolTrue }), Zw = () => ({ type: et.BoolFalse }), L8 = (t) => t ? Ww() : Zw(), e0 = BigInt("0xffffffffffffffffffffffffffffffff"), C8 = BigInt(0), n0 = BigInt("0x7fffffffffffffffffffffffffffffff"), r0 = BigInt("-170141183460469231731687303715884105728"), T8 = (t) => {
  const e = hn(t, !0);
  if (e > n0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${n0}`);
  if (e < r0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${r0}`);
  return { type: et.Int, value: e };
}, vr = (t) => {
  const e = hn(t, !1);
  if (e < C8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > e0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${e0}`);
  return { type: et.UInt, value: e };
}, Qw = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: et.Buffer, buffer: t };
};
function Jw() {
  return { type: et.OptionalNone };
}
function tb(t) {
  return { type: et.OptionalSome, value: t };
}
function B8(t) {
  return { type: et.ResponseErr, value: t };
}
function M8(t) {
  return { type: et.ResponseOk, value: t };
}
function N8(t) {
  return { type: et.List, list: t };
}
function $o(t) {
  for (const e in t)
    if (!E6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: et.Tuple, data: t };
}
const Ve = (t) => ({ type: et.StringASCII, data: t }), _8 = (t) => ({ type: et.StringUTF8, data: t });
class eb extends Rw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, oo.hash(e);
    const r = Cf(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? e.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = e.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(e) {
    return oo.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    oo.exists(this), oo.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: c } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const nb = (t, e, n) => new eb(t, e).update(n).digest();
nb.create = (t, e) => new eb(t, e);
Be.hmacSha256Sync = (t, ...e) => {
  const n = nb.create(Nf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ki(t) {
  return {
    type: pt.PublicKey,
    data: Se(t)
  };
}
function P8(t, e, n = ve.Compressed) {
  const r = mk(e.data), s = new _n(Vp(r.r), Vp(r.s)), o = Ft.fromSignature(t, s, r.recoveryId), i = n === ve.Compressed;
  return o.toHex(i);
}
function U8(t) {
  return { type: pt.PublicKey, data: t };
}
function Pi(t) {
  return !Rt(t.data).startsWith("04");
}
function Kc(t) {
  return t.data.slice();
}
function H8(t) {
  const e = F8(t), n = Sa(e.data.slice(0, 32), e.compressed);
  return ki(Rt(n));
}
function O8(t) {
  const e = typeof t == "string" ? t : Rt(t), n = Ft.fromHex(e).toHex(!0);
  return ki(n);
}
function D8(t) {
  const e = typeof t == "string" ? t : Rt(t), n = Ft.fromHex(e).toHex(!1);
  return ki(n);
}
function yd(t) {
  const e = t.readUInt8(), n = e === 4 ? Tk : Ck;
  return U8(He([e, t.readBytes(n)]));
}
function F8(t) {
  const e = xk(t), n = e.length == Dw;
  return { data: e, compressed: n };
}
function j8(t, e) {
  const [n, r] = il(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = $a(r, 1) + _n.fromHex(n).toCompactHex();
  return Yw(o);
}
function R8(t) {
  return H8(t.data);
}
function z8(t, e, n) {
  return typeof t == "string" && (t = Xw(t)), typeof n == "string" && (n = i0(n)), {
    type: pt.Payload,
    payloadType: Dt.TokenTransfer,
    recipient: t,
    amount: hn(e, !1),
    memo: n ?? i0("")
  };
}
function G8(t, e, n, r) {
  return typeof t == "string" && (t = _f(t)), typeof e == "string" && (e = ko(e)), typeof n == "string" && (n = ko(n)), {
    type: pt.Payload,
    payloadType: Dt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function s0(t, e, n) {
  return typeof t == "string" && (t = ko(t)), typeof e == "string" && (e = J8(e)), typeof n == "number" ? {
    type: pt.Payload,
    payloadType: Dt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: pt.Payload,
    payloadType: Dt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function K8() {
  return { type: pt.Payload, payloadType: Dt.PoisonMicroblock };
}
function o0(t, e) {
  if (t.byteLength != co)
    throw Error(`Coinbase buffer size must be ${co} bytes`);
  return e != null ? {
    type: pt.Payload,
    payloadType: Dt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: pt.Payload,
    payloadType: Dt.Coinbase,
    coinbaseBytes: t
  };
}
function V8(t, e, n) {
  if (t.byteLength != co)
    throw Error(`Coinbase buffer size must be ${co} bytes`);
  if (n.byteLength != dd)
    throw Error(`VRF proof buffer size must be ${dd} bytes`);
  return {
    type: pt.Payload,
    payloadType: Dt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === et.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var wd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(wd || (wd = {}));
function Y8(t, e, n, r, s, o, i) {
  return {
    type: pt.Payload,
    payloadType: Dt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function rb(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Dt.TokenTransfer:
      e.push(_e(t.recipient)), e.push(Fs(t.amount, !1, 8)), e.push(Fr(t.memo));
      break;
    case Dt.ContractCall:
      e.push(Fr(t.contractAddress)), e.push(Fr(t.contractName)), e.push(Fr(t.functionName));
      const n = new Uint8Array(4);
      vo(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(_e(r));
      });
      break;
    case Dt.SmartContract:
      e.push(Fr(t.contractName)), e.push(Fr(t.codeBody));
      break;
    case Dt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Fr(t.contractName)), e.push(Fr(t.codeBody));
      break;
    case Dt.PoisonMicroblock:
      break;
    case Dt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Dt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient));
      break;
    case Dt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient ? tb(t.recipient) : Jw())), e.push(t.vrfProof);
      break;
    case Dt.TenureChange:
      e.push(Se(t.tenureHash)), e.push(Se(t.previousTenureHash)), e.push(Se(t.burnViewHash)), e.push(Se(t.previousTenureEnd)), e.push(vo(new Uint8Array(4), t.previousTenureBlocks)), e.push(vk(new Uint8Array(1), t.cause)), e.push(Se(t.publicKeyHash));
      break;
  }
  return He(e);
}
function X8(t) {
  switch (t.readUInt8Enum(Dt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Dt.TokenTransfer:
      const n = Xn(t), r = hn(t.readBytes(8), !1), s = ob(t);
      return z8(n, r, s);
    case Dt.ContractCall:
      const o = $i(t), i = Yn(t), c = Yn(t), l = [], f = t.readUInt32BE();
      for (let A = 0; A < f; A++) {
        const T = Xn(t);
        l.push(T);
      }
      return G8(o, i, c, l);
    case Dt.SmartContract:
      const h = Yn(t), d = Yn(t, 4, 1e5);
      return s0(h, d);
    case Dt.VersionedSmartContract: {
      const A = t.readUInt8Enum(fd, (q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${q}`);
      }), T = Yn(t), _ = Yn(t, 4, 1e5);
      return s0(T, _, A);
    }
    case Dt.PoisonMicroblock:
      return K8();
    case Dt.Coinbase: {
      const A = t.readBytes(co);
      return o0(A);
    }
    case Dt.CoinbaseToAltRecipient: {
      const A = t.readBytes(co), T = Xn(t);
      return o0(A, T);
    }
    case Dt.NakamotoCoinbase: {
      const A = t.readBytes(co), T = Xn(t), _ = t.readBytes(dd);
      return V8(A, T, _);
    }
    case Dt.TenureChange:
      const y = Rt(t.readBytes(20)), p = Rt(t.readBytes(20)), E = Rt(t.readBytes(20)), S = Rt(t.readBytes(32)), C = t.readUInt32BE(), O = t.readUInt8Enum(wd, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), H = Rt(t.readBytes(20));
      return Y8(y, p, E, S, C, O, H);
  }
}
class Cl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class to extends Cl {
  constructor(e) {
    super(e);
  }
}
class Nn extends Cl {
  constructor(e) {
    super(e);
  }
}
class Vc extends Cl {
  constructor(e) {
    super(e);
  }
}
class io extends Cl {
  constructor(e) {
    super(e);
  }
}
var rr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(rr || (rr = {}));
function bd(t) {
  return Yw(Rt(t.readBytes(Il)));
}
function ai(t, e) {
  return {
    pubKeyEncoding: t,
    type: pt.TransactionAuthField,
    contents: e
  };
}
function q8(t) {
  const e = t.readUInt8Enum(rr, (n) => {
    throw new Nn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case rr.PublicKeyCompressed:
      return ai(ve.Compressed, yd(t));
    case rr.PublicKeyUncompressed:
      return ai(ve.Uncompressed, D8(yd(t).data));
    case rr.SignatureCompressed:
      return ai(ve.Compressed, bd(t));
    case rr.SignatureUncompressed:
      return ai(ve.Uncompressed, bd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Pf(t) {
  return Se(t.data);
}
function W8(t) {
  const e = [];
  switch (t.contents.type) {
    case pt.PublicKey:
      e.push(t.pubKeyEncoding === ve.Compressed ? rr.PublicKeyCompressed : rr.PublicKeyUncompressed), e.push(Kc(O8(t.contents.data)));
      break;
    case pt.MessageSignature:
      e.push(t.pubKeyEncoding === ve.Compressed ? rr.SignatureCompressed : rr.SignatureUncompressed), e.push(Pf(t.contents));
      break;
  }
  return He(e);
}
function Fr(t) {
  switch (t.type) {
    case pt.Address:
      return Ia(t);
    case pt.Principal:
      return sb(t);
    case pt.LengthPrefixedString:
      return Ii(t);
    case pt.MemoString:
      return t6(t);
    case pt.AssetInfo:
      return ib(t);
    case pt.PostCondition:
      return e6(t);
    case pt.PublicKey:
      return Kc(t);
    case pt.LengthPrefixedList:
      return Of(t);
    case pt.Payload:
      return rb(t);
    case pt.TransactionAuthField:
      return W8(t);
    case pt.MessageSignature:
      return Pf(t);
  }
}
function Z8() {
  return {
    type: pt.Address,
    version: Gc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Uf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === he.SerializeP2PKH || e === he.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === he.SerializeP2WPKH || e === he.SerializeP2WSH || e === he.SerializeP2WSHNonSequential) && !r.every(Pi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case he.SerializeP2PKH:
      return Ji(t, b6(r[0].data));
    case he.SerializeP2WPKH:
      return Ji(t, m6(r[0].data));
    case he.SerializeP2SH:
    case he.SerializeP2SHNonSequential:
      return Ji(t, x6(n, r.map(Kc)));
    case he.SerializeP2WSH:
    case he.SerializeP2WSHNonSequential:
      return Ji(t, S6(n, r.map(Kc)));
  }
}
function Ia(t) {
  const e = [];
  return e.push(Se($a(t.version, 1))), e.push(Se(t.hash160)), He(e);
}
function $i(t) {
  const e = kl(Rt(t.readBytes(1))), n = Rt(t.readBytes(20));
  return { type: pt.Address, version: e, hash160: n };
}
function sb(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ia(t.address)), t.prefix === ga.Contract && e.push(Ii(t.contractName)), He(e);
}
function Q8(t) {
  const e = t.readUInt8Enum(ga, (s) => {
    throw new Nn(`Unexpected Principal payload type: ${s}`);
  }), n = $i(t);
  if (e === ga.Standard)
    return { type: pt.Principal, prefix: e, address: n };
  const r = Yn(t);
  return {
    type: pt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ii(t) {
  const e = [], n = _i(t.content), r = n.byteLength;
  return e.push(Se($a(r, t.lengthPrefixBytes))), e.push(n), He(e);
}
function Yn(t, e, n) {
  e = e || 1;
  const r = kl(Rt(t.readBytes(e))), s = Lf(t.readBytes(r));
  return ko(s, e, n ?? 128);
}
function J8(t) {
  return ko(t, 4, 1e5);
}
function i0(t) {
  if (t && ub(t, Rc))
    throw new Error(`Memo exceeds maximum length of ${Rc} bytes`);
  return { type: pt.MemoString, content: t };
}
function t6(t) {
  const e = [], n = _i(t.content), r = w6(Rt(n), Rc * 2);
  return e.push(Se(r)), He(e);
}
function ob(t) {
  let e = Lf(t.readBytes(Rc));
  return e = e.replace(/\u0000*$/, ""), { type: pt.MemoString, content: e };
}
function ib(t) {
  const e = [];
  return e.push(Ia(t.address)), e.push(Ii(t.contractName)), e.push(Ii(t.assetName)), He(e);
}
function md(t) {
  return {
    type: pt.AssetInfo,
    address: $i(t),
    contractName: Yn(t),
    assetName: Yn(t)
  };
}
function Hf(t, e) {
  return {
    type: pt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Of(t) {
  const e = t.values, n = [];
  n.push(Se($a(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Fr(r));
  return He(n);
}
function ab(t, e, n) {
  const r = kl(Rt(t.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (e) {
      case pt.Address:
        s.push($i(t));
        break;
      case pt.LengthPrefixedString:
        s.push(Yn(t));
        break;
      case pt.MemoString:
        s.push(ob(t));
        break;
      case pt.AssetInfo:
        s.push(md(t));
        break;
      case pt.PostCondition:
        s.push(n6(t));
        break;
      case pt.PublicKey:
        s.push(yd(t));
        break;
      case pt.TransactionAuthField:
        s.push(q8(t));
        break;
    }
  return Hf(s, n);
}
function e6(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(sb(t.principal)), (t.conditionType === Sn.Fungible || t.conditionType === Sn.NonFungible) && e.push(ib(t.assetInfo)), t.conditionType === Sn.NonFungible && e.push(_e(t.assetName)), e.push(t.conditionCode), t.conditionType === Sn.STX || t.conditionType === Sn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new to("The post-condition amount may not be larger than 8 bytes");
    e.push(Fs(t.amount, !1, 8));
  }
  return He(e);
}
function n6(t) {
  const e = t.readUInt8Enum(Sn, (i) => {
    throw new Nn(`Could not read ${i} as PostConditionType`);
  }), n = Q8(t);
  let r, s, o;
  switch (e) {
    case Sn.STX:
      return r = t.readUInt8Enum(pa, (c) => {
        throw new Nn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: Sn.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case Sn.Fungible:
      return s = md(t), r = t.readUInt8Enum(pa, (c) => {
        throw new Nn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: Sn.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case Sn.NonFungible:
      s = md(t);
      const i = Xn(t);
      return r = t.readUInt8Enum(hd, (c) => {
        throw new Nn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: pt.PostCondition,
        conditionType: Sn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function Cr(t, e) {
  return He([t, e]);
}
function r6(t) {
  return new Uint8Array([t.type]);
}
function s6(t) {
  return t.type === et.OptionalNone ? new Uint8Array([t.type]) : Cr(t.type, _e(t.value));
}
function o6(t) {
  const e = new Uint8Array(4);
  return vo(e, t.buffer.length, 0), Cr(t.type, $l(e, t.buffer));
}
function i6(t) {
  const e = If(hk(t.value, BigInt(Lk)), Fw);
  return Cr(t.type, e);
}
function a6(t) {
  const e = If(t.value, Fw);
  return Cr(t.type, e);
}
function c6(t) {
  return Cr(t.type, Ia(t.address));
}
function l6(t) {
  return Cr(t.type, $l(Ia(t.address), Ii(t.contractName)));
}
function u6(t) {
  return Cr(t.type, _e(t.value));
}
function d6(t) {
  const e = [], n = new Uint8Array(4);
  vo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = _e(r);
    e.push(s);
  }
  return Cr(t.type, He(e));
}
function f6(t) {
  const e = [], n = new Uint8Array(4);
  vo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ko(s);
    e.push(Ii(o));
    const i = _e(t.data[s]);
    e.push(i);
  }
  return Cr(t.type, He(e));
}
function cb(t, e) {
  const n = [], r = e == "ascii" ? Ow(t.data) : _i(t.data), s = new Uint8Array(4);
  return vo(s, r.length, 0), n.push(s), n.push(r), Cr(t.type, He(n));
}
function h6(t) {
  return cb(t, "ascii");
}
function p6(t) {
  return cb(t, "utf8");
}
function _e(t) {
  switch (t.type) {
    case et.BoolTrue:
    case et.BoolFalse:
      return r6(t);
    case et.OptionalNone:
    case et.OptionalSome:
      return s6(t);
    case et.Buffer:
      return o6(t);
    case et.UInt:
      return a6(t);
    case et.Int:
      return i6(t);
    case et.PrincipalStandard:
      return c6(t);
    case et.PrincipalContract:
      return l6(t);
    case et.ResponseOk:
    case et.ResponseErr:
      return u6(t);
    case et.List:
      return d6(t);
    case et.Tuple:
      return f6(t);
    case et.StringASCII:
      return h6(t);
    case et.StringUTF8:
      return p6(t);
    default:
      throw new to("Unable to serialize. Invalid Clarity Value.");
  }
}
function g6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const a0 = /* @__PURE__ */ new Map();
function lb(t, e) {
  const n = a0.get(t);
  if (n !== void 0)
    return n(e);
  const r = g6(t);
  return a0.set(t, r), lb(t, e);
}
class sa {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return kk(this.readBytes(4), 0);
  }
  readUInt8() {
    return Ak(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Sk(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Rt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Rt(n);
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
    if (lb(e, r))
      return r;
    throw n(r);
  }
}
function Xn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new sa(Se(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new sa(t) : e = t;
  switch (e.readUInt8Enum(et, (r) => {
    throw new Nn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case et.Int:
      return T8(e.readBytes(16));
    case et.UInt:
      return vr(e.readBytes(16));
    case et.Buffer:
      const r = e.readUInt32BE();
      return Qw(e.readBytes(r));
    case et.BoolTrue:
      return Ww();
    case et.BoolFalse:
      return Zw();
    case et.PrincipalStandard:
      const s = $i(e);
      return $8(s);
    case et.PrincipalContract:
      const o = $i(e), i = Yn(e);
      return qw(o, i);
    case et.ResponseOk:
      return M8(Xn(e));
    case et.ResponseErr:
      return B8(Xn(e));
    case et.OptionalNone:
      return Jw();
    case et.OptionalSome:
      return tb(Xn(e));
    case et.List:
      const c = e.readUInt32BE(), l = [];
      for (let S = 0; S < c; S++)
        l.push(Xn(e));
      return N8(l);
    case et.Tuple:
      const f = e.readUInt32BE(), h = {};
      for (let S = 0; S < f; S++) {
        const C = Yn(e).content;
        if (C === void 0)
          throw new Nn('"content" is undefined');
        h[C] = Xn(e);
      }
      return $o(h);
    case et.StringASCII:
      const d = e.readUInt32BE(), y = wk(e.readBytes(d));
      return Ve(y);
    case et.StringUTF8:
      const p = e.readUInt32BE(), E = Lf(e.readBytes(p));
      return _8(E);
    default:
      throw new Nn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const y6 = (t) => t.length % 2 == 0 ? t : `0${t}`, w6 = (t, e) => t.padEnd(e, "0"), ub = (t, e) => t ? _i(t).length > e : !1;
function xd(t) {
  return Cy(t);
}
const ya = (t) => Vk(Nf(t)), Df = (t) => Rt(A8(t)), b6 = (t) => Rt(ya(t)), m6 = (t) => {
  const e = ya(t), n = $l(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ya(n);
  return Rt(r);
}, x6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = ya(r);
  return Rt(s);
}, S6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = Nf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = He(o), c = ya(i);
  return Rt(c);
};
function E6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function db(t) {
  const e = _e(t);
  return `0x${Rt(e)}`;
}
function A6(t) {
  return Xn(t);
}
const ui = (t) => {
  try {
    return No.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Ff() {
  return {
    type: pt.MessageSignature,
    data: Rt(new Uint8Array(Il))
  };
}
function fb(t, e, n, r) {
  const s = Uf(0, t, 1, [ki(e)]).hash160, o = Pi(ki(e)) ? ve.Compressed : ve.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: hn(n, !1),
    fee: hn(r, !1),
    keyEncoding: o,
    signature: Ff()
  };
}
function wa(t) {
  return "signature" in t;
}
function c0(t) {
  return t === he.SerializeP2SH || t === he.SerializeP2WSH;
}
function v6(t) {
  return t === he.SerializeP2SHNonSequential || t === he.SerializeP2WSHNonSequential;
}
function l0(t) {
  const e = xd(t);
  return e.nonce = 0, e.fee = 0, wa(e) ? e.signature = Ff() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function k6(t) {
  const e = [
    t.hashMode,
    Se(t.signer),
    Fs(t.nonce, !1, 8),
    Fs(t.fee, !1, 8),
    t.keyEncoding,
    Pf(t.signature)
  ];
  return He(e);
}
function $6(t) {
  const e = [
    t.hashMode,
    Se(t.signer),
    Fs(t.nonce, !1, 8),
    Fs(t.fee, !1, 8)
  ], n = Hf(t.fields);
  e.push(Of(n));
  const r = new Uint8Array(2);
  return Ek(r, t.signaturesRequired, 0), e.push(r), He(e);
}
function I6(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt(`0x${Rt(e.readBytes(8))}`), s = BigInt(`0x${Rt(e.readBytes(8))}`), o = e.readUInt8Enum(ve, (c) => {
    throw new Nn(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (t === he.SerializeP2WPKH && o != ve.Compressed)
    throw new Nn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = bd(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function L6(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt("0x" + Rt(e.readBytes(8))), s = BigInt("0x" + Rt(e.readBytes(8))), o = ab(e, pt.TransactionAuthField).values;
  let i = !1, c = 0;
  for (const f of o)
    switch (f.contents.type) {
      case pt.PublicKey:
        Pi(f.contents) || (i = !0);
        break;
      case pt.MessageSignature:
        if (f.pubKeyEncoding === ve.Uncompressed && (i = !0), c += 1, c === 65536)
          throw new io("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = e.readUInt16BE();
  if (i && (t === he.SerializeP2WSH || t === he.SerializeP2WSHNonSequential))
    throw new io("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: l
  };
}
function ou(t) {
  return wa(t) ? k6(t) : $6(t);
}
function iu(t) {
  const e = t.readUInt8Enum(he, (n) => {
    throw new Nn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === he.SerializeP2PKH || e === he.SerializeP2WPKH ? I6(e, t) : L6(e, t);
}
function hb(t, e, n, r) {
  const o = t + Rt(new Uint8Array([e])) + Rt(Fs(n, !1, 8)) + Rt(Fs(r, !1, 8));
  if (Se(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Df(Se(o));
}
function pb(t, e, n) {
  const r = 33 + Il, s = Pi(e) ? ve.Compressed : ve.Uncompressed, o = t + y6(s.toString(16)) + n.data, i = Se(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Df(i);
}
function C6(t, e, n, r, s) {
  const o = hb(t, e, n, r), i = j8(s, o), c = R8(s), l = pb(o, c, i);
  return {
    nextSig: i,
    nextSigHash: l
  };
}
function gb(t, e, n, r, s, o) {
  const i = hb(t, e, n, r), c = ki(P8(i, o, s)), l = pb(i, c, o);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function T6() {
  const t = fb(he.SerializeP2PKH, "", 0, 0);
  return t.signer = Z8().hash160, t.keyEncoding = ve.Compressed, t.signature = Ff(), t;
}
function u0(t, e, n) {
  return wa(t) ? B6(t, e, n) : M6(t, e, n);
}
function B6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = gb(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), o = Uf(0, t.hashMode, 1, [r]).hash160;
  if (o !== t.signer)
    throw new io(`Signer hash does not equal hash of public key(s): ${o} != ${t.signer}`);
  return s;
}
function M6(t, e, n) {
  const r = [];
  let s = e, o = !1, i = 0;
  for (const l of t.fields)
    switch (l.contents.type) {
      case pt.PublicKey:
        Pi(l.contents) || (o = !0), r.push(l.contents);
        break;
      case pt.MessageSignature:
        l.pubKeyEncoding === ve.Uncompressed && (o = !0);
        const { pubKey: f, nextSigHash: h } = gb(s, n, t.fee, t.nonce, l.pubKeyEncoding, l.contents);
        if (c0(t.hashMode) && (s = h), r.push(f), i += 1, i === 65536)
          throw new io("Too many signatures");
        break;
    }
  if (c0(t.hashMode) && i !== t.signaturesRequired || v6(t.hashMode) && i < t.signaturesRequired)
    throw new io("Incorrect number of signatures");
  if (o && (t.hashMode === he.SerializeP2WSH || t.hashMode === he.SerializeP2WSHNonSequential))
    throw new io("Uncompressed keys are not allowed in this hash mode");
  const c = Uf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (c !== t.signer)
    throw new io(`Signer hash does not equal hash of public key(s): ${c} != ${t.signer}`);
  return s;
}
function yb(t) {
  return {
    authType: Te.Standard,
    spendingCondition: t
  };
}
function wb(t, e) {
  return {
    authType: Te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || fb(he.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function d0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Te.Standard:
        return yb(l0(t.spendingCondition));
      case Te.Sponsored:
        return wb(l0(t.spendingCondition), T6());
      default:
        throw new Vc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function N6(t, e) {
  switch (t.authType) {
    case Te.Standard:
      return u0(t.spendingCondition, e, Te.Standard);
    case Te.Sponsored:
      return u0(t.spendingCondition, e, Te.Standard);
    default:
      throw new Vc("Invalid origin auth type");
  }
}
function _6(t, e) {
  switch (t.authType) {
    case Te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: hn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: hn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function P6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: hn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function U6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: hn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function H6(t, e) {
  const n = {
    ...e,
    nonce: hn(e.nonce, !1),
    fee: hn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function O6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Te.Standard:
      e.push(ou(t.spendingCondition));
      break;
    case Te.Sponsored:
      e.push(ou(t.spendingCondition)), e.push(ou(t.sponsorSpendingCondition));
      break;
  }
  return He(e);
}
function D6(t) {
  const e = t.readUInt8Enum(Te, (r) => {
    throw new Nn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Te.Standard:
      return n = iu(t), yb(n);
    case Te.Sponsored:
      n = iu(t);
      const r = iu(t);
      return wb(n, r);
  }
}
class F6 {
  constructor(e, n, r, s, o, i, c) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: hn(r.amount, !1)
    } : this.payload = r, this.chainId = c ?? $k, this.postConditionMode = o ?? vi.Deny, this.postConditions = s ?? Hf([]), i)
      this.anchorMode = Bk(i);
    else
      switch (r.payloadType) {
        case Dt.Coinbase:
        case Dt.CoinbaseToAltRecipient:
        case Dt.NakamotoCoinbase:
        case Dt.PoisonMicroblock:
        case Dt.TenureChange:
          this.anchorMode = xn.OnChainOnly;
          break;
        case Dt.ContractCall:
        case Dt.SmartContract:
        case Dt.VersionedSmartContract:
        case Dt.TokenTransfer:
          this.anchorMode = xn.Any;
          break;
      }
  }
  signBegin() {
    const e = xd(this);
    return e.auth = d0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = xd(this);
    return e.auth = d0(e.auth), e.txid();
  }
  verifyOrigin() {
    return N6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Te.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Te.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Te.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !wa(n)) {
      const r = Pi(e);
      n.fields.push(ai(r ? ve.Compressed : ve.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: o, nextSigHash: i } = C6(n, r, e.fee, e.nonce, s);
    return wa(e) ? e.signature = o : e.fields.push(ai(s.data.byteLength === Dw ? ve.Compressed : ve.Uncompressed, o)), i;
  }
  txid() {
    const e = this.serialize();
    return Df(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Vc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = H6(this.auth, e);
  }
  setFee(e) {
    this.auth = _6(this.auth, e);
  }
  setNonce(e) {
    this.auth = P6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Vc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = U6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new to('"version" is undefined');
    if (this.chainId === void 0)
      throw new to('"chainId" is undefined');
    if (this.auth === void 0)
      throw new to('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new to('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new to('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return vo(n, this.chainId, 0), e.push(n), e.push(O6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Of(this.postConditions)), e.push(rb(this.payload)), He(e);
  }
}
function ci(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new sa(Se(t.slice(2))) : e = new sa(Se(t)) : t instanceof Uint8Array ? e = new sa(t) : e = t;
  const n = e.readUInt8Enum(zc, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = D6(e), o = e.readUInt8Enum(xn, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), i = e.readUInt8Enum(vi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), c = ab(e, pt.PostCondition), l = X8(e);
  return new F6(n, s, l, c, i, o, r);
}
const j6 = L8, oa = vr, R6 = Qw;
const z6 = /* @__PURE__ */ new Set([4001, -31001]), G6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], K6 = ["result", "data", "payload", "response", "params"], f0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Tl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ho = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Yr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, V6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), bb = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => V6(o, r)) === s
  );
}, mb = (t) => t ? bb(Ho()).some(
  (e) => {
    var n;
    return e.id === t && (Tl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, xb = () => {
  if (typeof window > "u")
    return;
  const t = Ho(), e = bb(t).filter(
    (n) => {
      var r;
      return Tl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Yr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of G6) {
    const r = Yr(t, n) ?? (t === window ? void 0 : Yr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Y6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ho(), n = Yr(e, t) ?? (e === window ? void 0 : Yr(window, t)) ?? yl(t);
  if (n)
    return n;
  if (Tl(t) || mb(t))
    return xb();
}, oc = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, X6 = ["blockstack-session", "blockstack"], q6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of X6) {
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
const Sb = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Mn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, W6 = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Sb(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, Z6 = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Sb(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Sd = (t, e = "mainnet") => {
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
      return Sd(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Sd(r, e);
  }
  return e;
}, lo = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, ba = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ui(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const o = ba(s, e + 1);
      if (o)
        return o;
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
    const o = ba(n[s], e + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && ui(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ui(n.testnet) ? n.testnet.trim() : null;
}, h0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Eb = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && z6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Io = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Mn(n == null ? void 0 : n.message) ?? Mn(e.message) ?? Mn(e.error) ?? Mn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Li = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Io(e);
    if (e.status === "error")
      throw Io(e.result ?? e);
  }
  return t;
}, p0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Li(r);
  } catch (r) {
    throw Io(r);
  }
}, Ab = () => xb(), jf = () => {
  if (typeof window > "u")
    return;
  const t = Ho();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Yr(t, e) ?? (t === window ? void 0 : Yr(window, e));
    if (n)
      return n;
  }
}, g0 = () => {
  if (typeof window > "u")
    return;
  const t = jf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ho();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Yr(e, n) ?? (e === window ? void 0 : Yr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Sc = (t) => {
  var r, s;
  const e = wo();
  if (Tl(e) || mb(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ho() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Ab();
}, au = (t) => {
  const e = Z6(t);
  if (!e)
    return null;
  try {
    const n = ci(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Yc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = au(t), r = W6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Mn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const c of t) {
      const l = Yc(c, e + 1);
      if (l)
        return l;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let o = null;
  for (const c of f0)
    if (au(s[c])) {
      o = Mn(s[c]);
      break;
    }
  const i = Mn(s.txId) || Mn(s.txid) || Mn(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? Mn(s.txRaw) ?? void 0
    };
  for (const c of f0) {
    const l = au(s[c]);
    if (l)
      return {
        ...s,
        txId: l,
        txid: l,
        txRaw: Mn(s[c]) ?? void 0
      };
  }
  for (const c of K6) {
    const l = s[c], f = Yc(l, e + 1);
    if (f)
      return {
        ...s,
        ...l && typeof l == "object" ? l : {},
        ...f,
        txId: f.txId,
        txid: f.txid ?? f.txId
      };
  }
  return null;
}, cu = (t) => {
  const e = Yc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Q6 = (t) => {
  const e = Yc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, J6 = (t) => ({
  ...t,
  fee: lo(t.fee),
  nonce: lo(t.nonce),
  sponsored: t.sponsored === !0
}), y0 = (t) => ({
  recipient: t.recipient,
  amount: lo(t.amount) ?? "0",
  memo: t.memo,
  network: Sd(t.network),
  address: t.stxAddress,
  fee: lo(t.fee),
  nonce: lo(t.nonce),
  sponsored: t.sponsored ?? !1
}), vb = "WALLET_ADDRESS_MISMATCH", t5 = 45e3;
let ia = null;
const Ed = (t) => {
  t && (ia = { address: t, at: Date.now() });
}, e5 = () => {
  ia = null;
}, n5 = () => ia && Date.now() - ia.at <= t5 ? ia.address : null, r5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, s5 = async (t) => {
  e5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Li(await t.request("wallet_connect")), n = ba(e);
  return Ed(n), n;
}, o5 = async (t, e, n, r) => {
  try {
    return Li(await t.request(e, n));
  } catch (s) {
    const o = Io(s);
    if (!r5(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: o.message
    });
    let i = null;
    try {
      i = await s5(t);
    } catch (c) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: c instanceof Error ? c.message : String(c)
      }), o;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : o.message
        ),
        { code: i ? vb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: i });
    try {
      return Li(await t.request(e, n));
    } catch (c) {
      throw Io(c);
    }
  }
};
let w0 = 3e4;
const i5 = (t, e) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${w0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, w0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, a5 = async (t, e, n) => {
  const r = (l, f) => {
    if (e && l !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${l} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: vb }
      );
    return l;
  }, s = n5();
  if (s)
    return oc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  oc(n, "account-read");
  try {
    const l = Li(
      await i5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = ba(l), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (l) {
    if (Eb(l))
      throw Io(l);
    oc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: l instanceof Error ? l.message : String(l)
    });
  }
  if (o)
    return Ed(o), r(o, "wallet_getAccount");
  let i;
  oc(n, "account-reconnect");
  try {
    i = Li(await t.request("wallet_connect"));
  } catch (l) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: l instanceof Error ? l.message : String(l)
    }), Io(l);
  }
  const c = ba(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: c }), !c)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Ed(c), r(c, "wallet_connect");
}, c5 = async (t, e) => {
  if (!Sc(t)) {
    const o = await p0(
      t,
      "stx_transferStx",
      y0(e)
    );
    return cu(o);
  }
  const n = jf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await p0(
      n,
      "stx_transferStx",
      y0(e)
    );
    return cu(o);
  }
  const r = Ab();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await a5(r, e.stxAddress);
  const s = await o5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: lo(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: lo(e.fee) } : {}
    },
    e.stxAddress
  );
  return cu(s);
}, l5 = () => wo(), kb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = wo(), e = t ? Y6(t) : void 0;
  if (e)
    return e;
  const n = Ho() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, b0 = (t, e) => {
  const n = kb(), r = J6({
    ...t,
    onFinish: (s) => {
      var o;
      (o = t.onFinish) == null || o.call(t, Q6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ec(r, e);
  if (Sc(n) && !jf()) {
    const s = g0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: wo(),
        route: "legacy-transaction-request"
      }), ec(r, s);
  }
  return void c5(n, t).then((s) => {
    var o;
    (o = t.onFinish) == null || o.call(t, s);
  }).catch((s) => {
    var o, i;
    if (h0(s) && Sc(n)) {
      const c = g0();
      if (c) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: wo(),
          route: "legacy-transaction-request"
        }), ec(r, c);
        return;
      }
    }
    if (h0(s) && !Sc(n)) {
      ec(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Eb(s)) {
      (o = t.onCancel) == null || o.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (i = t.onCancel) == null || i.call(t);
  });
}, u5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), m0 = (t) => db(t).replace(/^0x/, ""), x0 = "This wallet cannot sign messages. Try Xverse or Leather.", S0 = (t) => typeof (t == null ? void 0 : t.request) == "function", E0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", d5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, f5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function h5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: m0(e.message),
    domain: m0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function p5(t, e) {
  const n = await ik({
    domain: e.domain,
    message: e.message,
    network: vl(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? u5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function A0(t) {
  var s, o;
  const e = l5() || "", n = /xverse/i.test(e);
  let r = kb();
  if (n && !E0(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (E0(r))
    try {
      return await p5(r, t);
    } catch (i) {
      if (n || !S0(r) || !f5(i)) throw i;
    }
  if (!n && S0(r))
    try {
      return await h5(r, t);
    } catch (i) {
      throw d5(i) ? new Error(x0) : i;
    }
  throw new Error(x0);
}
const v0 = 1000000n, zr = 1000000n, Xc = 50n, Pe = 3000n, ar = 300n, Yi = 3000n, g5 = 50000n, lu = 200n, Bl = 15000n, nn = (t) => t + Xc;
function tr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / v0}.${(n % v0).toString().padStart(6, "0")}`;
}
function k0(t, e = ar) {
  return t <= Pe ? 0 : Number((t - Pe) / nn(e));
}
function uu(t, e = 0n) {
  const n = zr - t - e;
  return n > 0n ? n : 0n;
}
function y5(t, e = ar) {
  return t > zr ? "over" : t < Pe + nn(e) ? "empty" : t < g5 ? "low" : "ok";
}
const w5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", b5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", m5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function x5(t) {
  var n, r, s, o;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = e["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || m5.some((i, c) => {
    var l;
    return ((l = e["core-" + (c + 1)]) == null ? void 0 : l.value) !== w5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const $b = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", du = 3, S5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", E5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", $0 = 1, [Ad, Ib] = $b.split("."), Gn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function vd(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function A5(t) {
  return Gn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Os(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Lb(t, e = []) {
  const n = await Os(`/v2/contracts/call-read/${Ad}/${Ib}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Ad, arguments: e.map((r) => "0x" + Gn(_e(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return nr(Xn(n.result));
}
async function v5() {
  const t = await Os(`/v2/contracts/source/${Ad}/${Ib}?proof=0`);
  if (typeof t.source != "string" || await A5(t.source) !== b5) throw Error("Deployed source does not match the tested helper.");
  if (x5(await Lb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Cb(t) {
  return t.startsWith("SP") && ui(t) && !t.includes(".");
}
async function k5(t) {
  var r;
  if (!Cb(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Os(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Os(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function $5(t) {
  const e = await Os(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function I5(t, e) {
  var s, o;
  const n = await Lb("get-owner", [oa(t), oa(e)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Cb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function L5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: vd(t), signal: AbortSignal.timeout(15e3) });
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
async function C5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function T5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = ci(vd(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || ii(Ji(Gc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const o = e.postConditions.values[0];
    if (r.payloadType !== 2 || ii(r.contractAddress) + "." + r.contractName.content !== $b || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Gn(_e(r.functionArgs[0])) !== Gn(_e(oa(t.core))) || Gn(_e(r.functionArgs[1])) !== Gn(_e(oa(t.song))) || Gn(_e(r.functionArgs[2])) !== Gn(_e(R6(vd(t.id)))) || t.amount !== "50" || e.postConditionMode !== vi.Deny || e.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== pa.Equal || o.principal.prefix !== 2 || ii(o.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ii(r.contractAddress) + "." + r.contractName.content !== S5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Gn(_e(r.functionArgs[0])) !== Gn(_e(oa(t.song))) || typeof t.liked != "boolean" || Gn(_e(r.functionArgs[1])) !== Gn(_e(j6(t.liked))) || t.amount !== "0" || e.postConditionMode !== vi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || nr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const B5 = "xtrata.xyz/radio/listening-wallet", M5 = "Link a temporary listening wallet for pay-per-play; no spending permission", xr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ui(t), N5 = (t) => ({
  domain: $o({ name: Ve(B5), version: Ve("1"), "chain-id": vr(1) }),
  message: $o({
    purpose: Ve(M5),
    main: Ve(t.main),
    listening: Ve(t.listening),
    issued: vr(t.issued)
  })
}), Tb = 100000n, _5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function P5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !xr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Tb).sort(_5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const ic = 50;
function qc(t) {
  const e = t;
  if (!e || typeof e.total != "number" || !Number.isSafeInteger(e.total) || e.total < 0 || !Array.isArray(e.results)) return null;
  const n = [];
  for (const r of e.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), o = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(o)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: o });
  }
  return { total: e.total, transfers: n };
}
async function U5(t, e, n = 4) {
  if (!xr(t)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${t}/stx_inbound?limit=${ic}&offset=${i}`, s = qc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - ic);
    for (let i = 0; i < n; i++) {
      const c = o === 0 && s.total <= ic ? s : qc(await e(r(o)));
      if (!c || !c.transfers.length) return { ok: !1 };
      const l = P5(c.transfers, t);
      if (l.ok && l.funder) return o > 0 ? { ...l, distinct: Math.max(l.distinct, 2) } : l;
      if (o === 0) return l;
      o = Math.max(0, o - ic);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Or = 50, H5 = 6, O5 = 20, I0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function L0(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const o of n.results) {
    const i = o && typeof o == "object" && o.tx && typeof o.tx == "object" ? o.tx : o;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (s.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== e || i.tx_status !== "success") continue;
    const c = i.token_transfer;
    if (!c || typeof c.recipient_address != "string" || typeof c.amount != "string" || !/^\d+$/.test(c.amount)) return null;
    const l = Number(i.block_height), f = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(l) || !Number.isSafeInteger(f)) return null;
    r.push({ recipient: c.recipient_address, amount: BigInt(c.amount), txId: i.tx_id, blockHeight: l, txIndex: f });
  }
  return { total: n.total, sent: r, rows: s };
}
async function D5(t, e, n) {
  if (!xr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = qc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Or}&offset=0`));
    if (!s || s.total > H5 * Or) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = Or; i < s.total; i += Or) {
      const c = qc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Or}&offset=${i}`));
      if (!c || !c.transfers.length) return { ok: !1 };
      for (const l of c.transfers) r.set(l.txId + ":" + l.txIndex, l);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (f) => `/extended/v1/address/${t}/transactions?limit=${Or}&offset=${f}`, c = L0(await e(i(0)), t);
      if (!c || c.total > O5 * Or) return { ok: !1 };
      const l = new Set(c.rows);
      for (const f of c.sent) o.set(f.txId, f);
      for (let f = Or; f < c.total; f += Or) {
        const h = L0(await e(i(f)), t);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) l.add(d);
        for (const d of h.sent) o.set(d.txId, d);
      }
      if (l.size !== c.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...o.values()] };
  } catch {
    return { ok: !1 };
  }
}
function F5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== e && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(I0).map((d, y) => {
    const p = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: p, kind: "gift", to: r.payer, at: y } : xr(d.sender) && p >= Tb ? { sender: d.sender, left: p, kind: "deposit", to: d.sender, at: y } : { sender: d.sender, left: p, kind: "dust", to: null, at: y };
  }), o = s.reduce((d, y) => d + y.left, 0n), i = [...t.outgoing].filter((d) => d && d.recipient !== e && xr(d.recipient) && d.amount > 0n).sort(I0), c = i.reduce((d, y) => d + y.amount, 0n), l = o - n - c;
  if (l < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (d, y) => {
    let p = y;
    for (const E of d) {
      if (p <= 0n) break;
      const S = E.left < p ? E.left : p;
      E.left -= S, p -= S;
    }
    return p;
  };
  for (const d of i) {
    const y = f(s.filter((p) => p.to === d.recipient), d.amount);
    y > 0n && f(s, y);
  }
  if (f(s, l) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((d, y) => d + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of s) {
    if (d.left <= 0n) continue;
    const y = `${d.kind}:${d.to ?? ""}`, p = h.get(y);
    p ? (p.amount += d.left, p.newest = Math.max(p.newest, d.at)) : h.set(y, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, y) => d.newest - y.newest),
    hasTopUp: s.some((d) => d.kind === "deposit")
  };
}
function j5(t, e) {
  const n = t.filter((f) => f.kind === "deposit").sort((f, h) => f.newest - h.newest), r = t.find((f) => f.kind === "gift"), s = t.filter((f) => f.kind === "dust"), o = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((f, h) => f + h.amount, 0n), i = [], c = [], l = o > e;
  return n.forEach((f, h) => {
    if (f.amount <= e) {
      c.push(f);
      return;
    }
    const d = h === n.length - 1 && !l;
    i.push({ to: f.to, kind: "deposit", mode: d ? "all" : "amount", send: f.amount - e });
  }), l ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: o - e }) : (r && c.push(r), c.push(...s)), { steps: i, tooSmall: c };
}
function C0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const ac = 1500n, Ec = [100, 250, 500], R5 = (t, e) => BigInt(t) * nn(e), Xi = ["prepared", "signed", "unknown", "pending"], z5 = 30 * 6e4, Wc = 6e4, Qo = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, G5 = 3e3, Zc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", fu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function K5(t) {
  let e = null, n = -1 / 0, r, s = null, o = null, i, c = -1 / 0, l = null, f = null, h = !1, d = !1, y = !1, p = null, E = !1, S = "", C = "", O = 0, H, A = null, T, _ = [], q, it = -1 / 0;
  const Q = /* @__PURE__ */ new Set();
  let K = null, b = !1, I = 0, B = null, M = null, V = !1, R = null, bt = !1, dt = null, Gt = !1, L = !1, D = !1, lt = !1, St = !1, yt = 0, kt = null, ke = Promise.resolve();
  const It = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ar.toString()), Tt = (a) => !!o && !(o.features ?? []).includes(a), wt = (a, g) => `xtrata.ppp.v1.${a}:${g}`, Hn = "xtrata.ppp.v1.as-main", Re = () => {
    if (t.main()) return;
    const a = t.store.get(Hn);
    return a && xr(a) ? a : void 0;
  }, Bt = () => t.main() ?? Re(), pn = (a = o == null ? void 0 : o.address) => {
    if (!a) return [];
    try {
      const g = JSON.parse(t.store.get(wt("entries", a)) || "[]");
      return Array.isArray(g) ? g : [];
    } catch {
      return [];
    }
  }, re = (a) => {
    const g = [a, ...pn(a.address).filter((k) => !(k.txid === a.txid && k.kind === a.kind))].slice(0, 200);
    t.store.set(wt("entries", a.address), JSON.stringify(g));
  }, gn = (a = o == null ? void 0 : o.address) => !!a && t.store.get(wt("on", a)) !== "0", An = (a) => {
    o != null && o.address && t.store.set(wt("on", o.address), a ? "1" : "0");
  }, ye = () => pn().filter((a) => Xi.includes(a.status)), Xe = () => we() ? [...ye(), ...pn(pe()).filter((a) => Xi.includes(a.status))] : ye(), De = () => qe(o == null ? void 0 : o.address), qe = (a) => {
    if (!a) return null;
    try {
      return JSON.parse(t.store.get(wt("deposit", a)) || "null");
    } catch {
      return null;
    }
  }, Ot = (a, g = o == null ? void 0 : o.address) => {
    g && t.store.set(wt("deposit", g), JSON.stringify(a));
  };
  let se = null;
  const We = (a = Wc) => {
    const g = t.now();
    se = { since: se && g < se.until ? se.since : g, until: Math.max((se == null ? void 0 : se.until) ?? 0, g + a) };
  }, Fe = () => !!se && t.now() < se.until && (i === void 0 || i < Pe + nn(It())), Me = () => !!De() || Fe(), pe = () => Tt("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), we = () => !!(o != null && o.address) && pe() !== o.address, qn = () => we() ? l && l.for === pe() ? l.value : void 0 : i, cr = (a) => a !== void 0 && a < Pe + lu, $ = () => ye().filter((a) => t.now() - a.created > z5 && Q.has(a.txid)), G = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Bt() || r === Bt() && !e.allowed), j = () => G() && !(o != null && o.linked), Y = () => {
    const a = Bt();
    return !j() && !!a && !!(o != null && o.linked) && o.linked !== a;
  }, ht = (a) => wt("return-to", a), Et = (a = o == null ? void 0 : o.address) => {
    if (!a) return;
    const g = t.store.get(ht(a));
    return g && xr(g) && g !== a ? g : void 0;
  }, oe = (a = o == null ? void 0 : o.address) => K && K.for === a ? K.res : null;
  function be() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const a = Et();
    if (a) return { to: a, kind: "chosen" };
    const g = oe();
    if (g != null && g.ok && g.funder) return { to: g.funder, kind: "funder" };
  }
  const jt = (a) => wt("gift", a);
  function v() {
    const a = o == null ? void 0 : o.address;
    if (!a) return null;
    if ((R == null ? void 0 : R.for) === a) return R.info;
    try {
      const g = JSON.parse(t.store.get(jt(a)) || "null");
      return g && typeof g.returnTo == "string" && typeof g.treasury == "string" ? g : null;
    } catch {
      return null;
    }
  }
  const at = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let At = null, Mt = null, mt = !1;
  const Yt = (a) => wt("award-claim", a), ue = (a) => wt("award-send", a), $e = (a) => {
    try {
      const g = JSON.parse(t.store.get(ue(a)) || "null");
      return g && typeof g.txid == "string" && t.now() - g.at < 2 * 36e5 ? g : null;
    } catch {
      return null;
    }
  }, te = (a) => {
    try {
      const g = JSON.parse(t.store.get(Yt(a)) || "null");
      return g && typeof g.txid == "string" && t.now() - g.at < 2 * 36e5 ? g : null;
    } catch {
      return null;
    }
  };
  async function vn(a = !1) {
    const g = at();
    if (!g || !t.awardStatus || mt) return;
    const k = (At == null ? void 0 : At.for) === g ? At : null, P = k == null ? void 0 : k.view.state, z = k ? P === "off" || P === "not-a-player" ? 30 * 6e4 : te(g) || $e(g) ? 2e4 : P === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(k && !a && t.now() - k.at < z)) {
      mt = !0;
      try {
        const U = await t.awardStatus(g);
        if (At = { for: g, view: U, at: t.now() }, U.state === "claimed" && t.store.set(Yt(g), ""), U.state === "claimed" && U.holds === !1 && t.store.set(ue(g), ""), U.state === "ready" && t.awardName && (Mt == null ? void 0 : Mt.for) !== g)
          try {
            Mt = { for: g, name: await t.awardName(g), at: t.now() };
          } catch {
            Mt = { for: g, name: void 0, at: t.now() };
          }
      } catch {
        At = { for: g, view: k && k.view.state !== "off" && k.view.state !== "not-a-player" ? { ...k.view, state: "unavailable" } : { state: "unavailable" }, at: t.now() };
      } finally {
        mt = !1;
      }
    }
  }
  function Lt() {
    const a = at();
    if (!a || (At == null ? void 0 : At.for) !== a) return null;
    const g = At.view;
    if (g.state === "off" || g.state === "not-a-player") return null;
    const k = g.state === "claimed" ? null : te(a), P = g.state === "claimed" && g.holds !== !1 ? $e(a) : null;
    return { ...g, ...(Mt == null ? void 0 : Mt.for) === a ? { name: Mt.name } : {}, ...k ? { claimTx: k.txid } : {}, ...P ? { sendTx: P.txid } : {} };
  }
  async function Tr() {
    var z;
    const a = o == null ? void 0 : o.address;
    if (!a || !t.giftInfo || !((z = e == null ? void 0 : e.gifts) != null && z.enabled) || bt) return;
    const g = (R == null ? void 0 : R.for) === a ? R : null, k = g ? g.ok ? g.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (g && t.now() - g.at < k) return;
    bt = !0;
    const P = v();
    try {
      const U = await t.giftInfo(a);
      R = { for: a, info: U, ok: !0, at: t.now() }, t.store.set(jt(a), JSON.stringify(U));
    } catch {
      R = { for: a, info: P, ok: !1, at: t.now() };
    } finally {
      bt = !1;
    }
  }
  const On = () => pn().reduce((a, g) => Xi.includes(g.status) ? a + BigInt(g.amount || "0") + BigInt(g.fee || "0") : a, 0n);
  function Zr() {
    if (i === void 0) return 0;
    const a = i - On() - BigInt(de.length) * nn(It());
    return a > 0n ? k0(a, It()) : 0;
  }
  const Rs = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Br = "EMPTY — ADD STX TO PLAY";
  function zs() {
    if (!(e != null && e.here)) return null;
    const a = (g, k) => ({ reason: g, text: k });
    switch (sn()) {
      case "connect":
      case "wrong-wallet":
        return a("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return a("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return a("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return a("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return a("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return a("locked", "UNLOCK TO LISTEN");
      case "link":
        return a("link", "FINISH SETUP TO LISTEN");
      case "over":
        return a("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Me() ? a("arriving", "YOUR PLAYS ARE ARRIVING") : a("out", we() ? Rs : Br);
      case "ready":
        return !gn() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= t.now() ? a("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : D ? Zr() < 1 ? a("out", we() ? Rs : Br) : null : a("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Qr = () => {
    var a;
    return !!(o != null && o.address) && we() && !!((a = v()) != null && a.player);
  };
  function yn() {
    return Qr() ? { locked: !0, known: !0 } : null;
  }
  const Oo = 3 * 6e4, Ui = () => !!v() && !!t.history && !(o != null && o.linked);
  async function kn() {
    const a = o.address, g = v(), { balance: k, nonce: P } = await t.chain.account(a), z = await t.history(a, !0);
    if (!z.ok) return null;
    const U = F5({ self: a, balance: k, inbound: z.inbound, outgoing: z.outgoing, gift: { sender: g.treasury, payer: g.returnTo } });
    if (!U.ok) return null;
    const J = j5(U.parts, Yi);
    return { balance: k, nonce: P, parts: U.parts, steps: J.steps, tooSmall: J.tooSmall.length };
  }
  const $n = () => Gt ? { state: "unavailable" } : !dt || t.now() - dt.at > Oo || i !== void 0 && i !== dt.balance ? { state: "none" } : dt.plan;
  function sn() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const a = Bt();
    if (!j()) {
      if (!a) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : Y() ? "wrong-wallet" : o.state === "known" ? "locked" : !j() && o.linked !== a ? "link" : i === void 0 ? "loading" : i > zr && !o.backedUp ? "over" : i < Pe + nn(It()) ? "fund" : "ready" : "loading";
  }
  const on = () => {
    var a, g, k, P, z;
    return {
      step: sn(),
      busy: f,
      message: S,
      error: C,
      notice: Do(),
      gate: e,
      main: Bt(),
      mainConnected: !!t.main(),
      standIn: Re(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: Lt(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.phrase),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((U) => U === "over" && (o != null && o.backedUp) ? "ok" : U)(y5(i, It())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > zr && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : k0(i, It()),
      allowance: i === void 0 ? zr : uu(i, BigInt(((a = De()) == null ? void 0 : a.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: gn(),
      entries: pn(),
      depositTxid: ((g = De()) == null ? void 0 : g.txid) ?? H,
      depositPending: Me(),
      arrival: Me() ? { since: ((k = De()) == null ? void 0 : k.at) ?? (se == null ? void 0 : se.since) ?? t.now(), graceMs: Wc } : null,
      walletOutdated: Tt("like"),
      linkedListening: q && q === Bt() ? _.map((U) => U.listening) : [],
      serverLinked: !!A && T === `${Bt()}:${o == null ? void 0 : o.address}`,
      stuck: $().length,
      armed: lt,
      queued: de.length,
      solo: j(),
      returnTo: (P = be()) == null ? void 0 : P.to,
      returnToKind: (z = be()) == null ? void 0 : z.kind,
      funderState: (() => {
        const U = oe();
        return U ? U.ok ? U.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const U = oe();
        return !!U && U.ok && U.distinct > 1;
      })(),
      walletCannotSolo: j() && Tt("standalone"),
      walletCannotMulti: Tt("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((U) => U !== Bt() && U !== (o == null ? void 0 : o.linked)),
      creditedTo: j() && (o != null && o.address) && (B == null ? void 0 : B.for) === o.address && B.main ? B.main : void 0,
      createdHere: !!(o != null && o.address) && t.store.get(wt("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (M == null ? void 0 : M.for) === o.address && M.unused,
      gift: (() => {
        const U = v();
        return U ? { player: U.player, from: U.from, source: U.source, amount: U.amount, ...U.drop !== void 0 ? { drop: U.drop } : {} } : null;
      })(),
      giftPlays: v() ? Zr() : 0,
      playCost: nn(It()),
      giftStop: zs(),
      albumLock: yn(),
      returnPlan: $n(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Tt("slots"),
      likeFunds: (() => {
        var W;
        const U = pe();
        if (!U || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const J = qn();
        return { address: U, balance: J, low: cr(J), album: we(), pending: !!qe(U), txid: (W = qe(U)) == null ? void 0 : W.txid, main: Bt() };
      })()
    };
  }, Do = () => O ? O < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", zt = (a, g = "") => {
    S = a, C = g, t.changed();
  };
  async function Ne(a, g) {
    if (!f) {
      f = a, C = "", t.changed();
      try {
        await g();
      } catch (k) {
        const P = k instanceof Error ? k.message : String(k);
        C = /Cancelled in the listening wallet/.test(P) ? "" : P, C || (S = "Not now. Nothing was signed.", St = !0);
      } finally {
        f = null, await In(!0);
      }
    }
  }
  const lr = () => !!(e != null && e.enabled) && e.here && (j() || !!Bt() && e.allowed), Gs = () => lr() && !Y(), Wn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ie = () => {
    if (Y()) throw new Error(Wn());
  };
  async function wn() {
    if (!lr()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const bn = (a) => {
    const g = Bt();
    return a.request("listening.status", g ? { main: g } : void 0);
  };
  async function Ks(a = !1) {
    o != null && o.address && (!a && t.now() - c < 3e4 || (i = await t.chain.balance(o.address), c = t.now(), await Vs(a)));
  }
  async function Vs(a = !1) {
    const g = pe();
    if (!(!we() || !g || (o == null ? void 0 : o.state) !== "unlocked") && !(!a && (l == null ? void 0 : l.for) === g && t.now() - l.at < 3e4))
      try {
        l = { for: g, value: await t.chain.balance(g), at: t.now() };
      } catch {
      }
  }
  async function Ys(a) {
    if ((q !== a || t.now() - it >= 6e4) && (_ = await t.links(a), q = a, it = t.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === a) return;
    const g = `${a}:${o.address}`;
    T === g && A || (A = _.find((k) => k.listening === o.address) ?? null, T = g);
  }
  async function Jr() {
    const a = o == null ? void 0 : o.address;
    if (!j() || !a || o != null && o.linked || !t.funder || b || !i || i <= 0n) return;
    const g = oe(a);
    if (g != null && g.ok && g.funder) return;
    const k = g != null && g.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(K && K.for === a && t.now() - K.at < k)) {
      b = !0;
      try {
        K = { for: a, res: await t.funder(a), at: t.now() };
      } catch {
        K = { for: a, res: { ok: !1 }, at: t.now() };
      } finally {
        b = !1;
      }
      I = K.res.ok ? 0 : I + 1;
    }
  }
  async function ts() {
    const a = o == null ? void 0 : o.address;
    if (!(!j() || !a || o != null && o.linked || !t.mainOf || V) && !(B && B.for === a && (B.ok || t.now() - B.at < 6e4))) {
      V = !0;
      try {
        B = { for: a, main: await t.mainOf(a), ok: !0, at: t.now() };
      } catch {
        B = { for: a, main: null, ok: !1, at: t.now() };
      } finally {
        V = !1;
      }
    }
  }
  async function Hi() {
    const a = o == null ? void 0 : o.address;
    if (!(!a || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (M == null ? void 0 : M.for) === a) && t.store.get(wt("created", a)) !== "1")
      try {
        M = { for: a, unused: await t.chain.confirmedNonce(a) === 0n };
      } catch {
      }
  }
  async function es() {
    var z;
    const a = o == null ? void 0 : o.address;
    if (!a) return !1;
    let g, k = !1;
    const P = /* @__PURE__ */ new Map();
    for (const U of Xe())
      try {
        const J = await t.chain.transaction(U.txid);
        if (!J) {
          if (Q.add(U.txid), t.now() - U.created > 15 * 6e4 && !P.has(U.address) && P.set(U.address, await t.chain.confirmedNonce(U.address)), g = P.get(U.address), g !== void 0 && g > BigInt(U.nonce)) {
            re({ ...U, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((U.status === "unknown" || U.status === "signed") && U.raw)
            try {
              await t.chain.broadcast(U.raw, U.txid), re({ ...U, status: "pending" });
            } catch (Z) {
              Qo(Z) && re({ ...U, status: "failed", note: Z.message, raw: void 0 });
            }
          continue;
        }
        Q.delete(U.txid);
        const W = String(J.tx_status);
        if (W === "success" && J.canonical !== !1 && J.is_unanchored === !1) {
          if (re({ ...U, status: "confirmed", confirmedAt: t.now(), actualFee: String(J.fee_rate ?? U.fee), raw: void 0 }), k = !0, U.kind === "like" && (E = !0, U.status !== "confirmed" && typeof U.liked == "boolean"))
            try {
              (z = t.likeConfirmed) == null || z.call(t, U.song, U.liked);
            } catch {
            }
        } else W.startsWith("abort_") || W.startsWith("dropped_") ? re({ ...U, status: "failed", note: W, raw: void 0 }) : U.status !== "pending" && re({ ...U, status: "pending" });
      } catch {
      }
    for (const U of we() ? [a, pe()] : [a]) {
      const J = qe(U);
      if (J)
        try {
          const W = await t.chain.transaction(J.txid), Z = String((W == null ? void 0 : W.tx_status) ?? "");
          (Z === "success" && W.is_unanchored === !1 || Z.startsWith("abort_") || Z.startsWith("dropped_") || !W && t.now() - J.at > 2 * 36e5) && (Ot(null, U), Z === "success" && We(2e4), c = -1 / 0, l = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return k;
  }
  async function In(a = !1) {
    var g;
    try {
      const k = Bt();
      if ((a || !e || r !== k || t.now() - n > 3e5) && (e = await t.config(k), n = t.now(), r = k), !e.enabled || !e.here || !j() && (!k || !e.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), lt && Mr(), t.changed();
        return;
      }
      await wn(), o = await bn(s), Y() && o.state === "unlocked" && (Ur(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await bn(s)), k && e.allowed && await Ys(k), await Ks(a), await Jr(), await ts(), await Hi(), await Tr(), await vn(), await es() && await Ks(!0), await Vs(), await Go(), O = 0;
    } catch {
      O++;
    }
    if (sn() === "locked" ? Oi() : lt && Mr(), E) {
      E = !1;
      try {
        (g = t.likesChanged) == null || g.call(t);
      } catch {
      }
    }
    t.changed(), de.length && !Pr && ss();
  }
  async function Fo(a) {
    const g = o == null ? void 0 : o.root;
    if (!g || o != null && o.slot || !(o != null && o.address) || Tt("slots")) return;
    const k = Number(t.store.get(wt("slot", g)));
    if (!(!Number.isSafeInteger(k) || k < 1))
      try {
        const { balance: P } = await t.chain.account(o.address);
        if (P >= Pe + nn(It())) return;
        await a.request("listening.openSlot", { slot: k }), o = await bn(a), i = void 0, c = -1 / 0;
      } catch {
      }
  }
  async function Xs(a, g) {
    var U;
    Ie();
    const k = !(o != null && o.address) || gn(o.address), P = o != null && o.linked ? (U = t.nameOf) == null ? void 0 : U.call(t, o.linked) : void 0;
    await a.request("listening.unlock", { mode: "unlock", terms: k ? ns() : void 0, anyPasskey: g, ...Bt() ? { main: Bt() } : {}, ...P ? { label: P } : {} }), o = await bn(a), k && (gn(o.address) ? await Dn() : await a.request("listening.stop")), await Fo(a), zt(k ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const z = p;
    p = null, z && t.now() - z.at < 12e4 && setTimeout(() => void In(!0).then(() => m(z)), 0);
  }
  function Oi() {
    lt || f || St || yt >= 3 || !s || !(o != null && o.address) || (lt = !0, ke = (async () => {
      try {
        await Xs(s, !1), yt = 0;
      } catch (a) {
        const g = a instanceof Error ? a.message : String(a);
        /Cancelled in the listening wallet/.test(g) ? kt || (St = !0, zt("Not now. Nothing was signed.")) : /did not answer/.test(g) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (yt++, C = g);
      } finally {
        lt = !1;
        const a = kt;
        kt = null, a ? await a() : await In(!0);
      }
    })());
  }
  async function Mr(a) {
    lt && (kt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ke), a && await a(), t.changed();
  }
  const ns = () => ({
    fee: It().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: zr.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Dn() {
    if (!(o != null && o.address)) return !1;
    if (D || (D = await t.tabLock(o.address)), !D)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Nr(a, g) {
    const k = o.address, { balance: P, nonce: z } = g ?? await t.chain.account(k);
    i = P;
    const U = await s.request("listening.prepareReturn", {
      mode: a.mode,
      balance: P.toString(),
      nonce: z.toString(),
      fee: Yi.toString(),
      ...a.amount !== void 0 ? { amount: a.amount.toString() } : {},
      ...a.linked ? {} : { destination: a.to }
    });
    if (U.recipient !== a.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const J = a.mode === "amount" ? a.amount : a.mode === "all" ? P - Yi : P - zr - Yi, W = ci(U.raw);
    if (nr(W.payload.recipient).value !== a.to || String(W.payload.amount) !== U.amount || J !== void 0 && U.amount !== J.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Z = {
      id: fu(),
      address: k,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: U.recipient,
      amount: U.amount,
      fee: U.fee,
      nonce: z.toString(),
      created: t.now(),
      status: "signed",
      raw: U.raw,
      txid: U.txid
    };
    t.validate(Z), re(Z);
    try {
      await t.chain.broadcast(U.raw, U.txid), re({ ...Z, status: "pending" });
    } catch (nt) {
      throw re({ ...Z, status: "unknown", note: nt.message }), nt;
    }
    return U;
  }
  const jo = Bl, Wt = Yi;
  async function Ro(a, g, k) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Tt("slots") || Tt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const P = o.slot ?? 0;
    if (a === g || ![a, g].includes(P) || ![a, g].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const z = o.root ?? o.address, U = a === 0 ? z : o.address, J = g === 0 ? z : o.address, { balance: W, nonce: Z } = await t.chain.account(U);
    if (W < k + Wt + Pe) throw new Error(a === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const nt = await s.request("listening.signMove", { from: a, to: g, amount: k.toString(), fee: Wt.toString(), nonce: Z.toString(), balance: W.toString() }), st = ci(nt.raw);
    if (nt.from !== U || nt.to !== J || nt.amount !== k.toString() || nr(st.payload.recipient).value !== J || String(st.payload.amount) !== k.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const $t = {
      id: fu(),
      address: U,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: J,
      amount: nt.amount,
      fee: nt.fee,
      nonce: Z.toString(),
      created: t.now(),
      status: "signed",
      raw: nt.raw,
      txid: nt.txid
    };
    t.validate($t), re($t);
    try {
      await t.chain.broadcast(nt.raw, nt.txid), re({ ...$t, status: "pending" });
    } catch (ee) {
      throw re({ ...$t, status: "unknown", note: ee.message }), ee;
    }
    return Ot({ txid: nt.txid, amount: nt.amount, at: t.now() }, J), J === z && z !== o.address ? l = null : c = -1 / 0, nt;
  }
  let qs = !1;
  const zo = /* @__PURE__ */ new Map(), Ws = (a) => wt("float", a);
  async function Go() {
    if (qs || (o == null ? void 0 : o.state) !== "unlocked" || !we() || Tt("move") || Tt("rootLike") || !o.address) return;
    const a = o.address;
    if (t.store.get(Ws(a)) === "1") return;
    const g = v();
    if (!(g != null && g.player) || g.state !== "arrived") return;
    const k = qn();
    if (k === void 0 || i === void 0) return;
    if (!cr(k)) {
      t.store.set(Ws(a), "1");
      return;
    }
    if (qe(pe()) || rs() || Xe().length || i < jo * 4n + Pe + Wt) return;
    const P = zo.get(a);
    if (!(P && (P.n >= 3 || t.now() - P.at < 5 * 6e4))) {
      qs = !0, zo.set(a, { n: ((P == null ? void 0 : P.n) ?? 0) + 1, at: t.now() });
      try {
        await Ro(o.slot ?? 0, 0, jo), t.store.set(Ws(a), "1");
      } catch (z) {
        console.warn("[radio] likes float not sent yet", z);
      } finally {
        qs = !1;
      }
    }
  }
  async function Di(a) {
    if (ye().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Tt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const g = await kn().catch(() => null);
    if (!g)
      throw dt = null, Gt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Gt = !1, i = g.balance;
    const k = { balance: g.balance, nonce: g.nonce };
    if (a === "excess") {
      const W = C0(g.parts) ?? Et();
      if (!W) throw new Error("Choose where to send the excess first.");
      await Nr({ mode: "excess", to: W, linked: !1 }, k), dt = null, zt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const P = g.steps;
    if (!P.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!dt && dt.balance === g.balance && t.now() - dt.at <= Oo && dt.steps.length === P.length && dt.steps.every((W, Z) => W.to === P[Z].to && W.mode === P[Z].mode && W.send === P[Z].send))) {
      dt = {
        at: t.now(),
        balance: g.balance,
        steps: P,
        parts: g.parts,
        plan: { state: "ready", steps: P.map((W) => ({ to: W.to, kind: W.kind, send: W.send.toString() })), kept: g.tooSmall, excess: C0(g.parts) }
      }, zt(P.length > 1 ? `This goes back in ${P.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const U = P[0], J = U.to ?? Et();
    if (!J) throw new Error("Choose where to send the rest first.");
    if (U.mode === "amount" && Tt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Nr({ mode: U.mode, to: J, linked: !1, ...U.mode === "amount" ? { amount: U.send } : {} }, k), dt = null, P.length === 1 ? (An(!1), zt("Returned ✓ Paying is off.")) : zt(`Returned ✓ ${P.length - 1} more ${P.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function _r() {
    if (!(o != null && o.unproven)) return;
    const a = await wn();
    await a.request("listening.prove"), o = await bn(a);
  }
  const Ze = {
    forceRefresh: () => In(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (a) => {
      if (!t.main() && !(a !== null && !xr(a))) {
        if (a === Re()) return In(!0);
        t.store.set(Hn, a ?? ""), C = "", S = "", i = void 0, c = -1 / 0, l = null, await In(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (a) => Ne("Waiting for your passkey…", async () => {
      const g = await wn();
      await g.request("listening.unlock", { mode: "create", terms: ns(), ...t.main() ? { main: t.main() } : {}, ...a != null && a.quick && !t.main() ? { quick: !0 } : {} }), o = await bn(g), o.address && t.store.set(wt("created", o.address), "1"), An(!0), zt(j() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Dn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (a) => {
      a ? We() : se = null, t.changed();
    },
    giftSent: (a, g) => {
      !(o != null && o.address) || De() || (Ot({ txid: a, amount: g.toString(), at: t.now() }), c = -1 / 0, R = null, zt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (a) => {
      if (Ie(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Tt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await wn()).request("listening.bindSlot", { slot: a, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (a, g, k, P) => {
      Ot({ txid: k, amount: P.toString(), at: t.now() }, g), R = null, await Ze.openAlbum(a), zt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (a) => Ne("Opening…", async () => {
      if (Ie(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Tt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === a) return;
      Ur(), await s.request("listening.openSlot", { slot: a }), o = await bn(s), i = void 0, c = -1 / 0, dt = null, Gt = !1;
      const g = o.root;
      g && a > 0 && t.store.set(wt("slot", g), String(a)), zt(a === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (a = !1) => {
      const g = () => Ne("Waiting for your passkey…", async () => Xs(await wn(), a));
      return lt ? a ? Tt("cancel") ? (zt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Mr(async () => {
        (sn() === "locked" || sn() === "intro") && await g();
      }) : ke : g();
    },
    link: () => Ne("Sign in your wallet…", async () => {
      Ie();
      const a = t.main();
      if (!a || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const g = (await t.links(a)).find((k) => k.listening === o.address);
      if (g)
        await s.request("listening.link", { main: a, issued: g.issued, mainSignature: g.mainSignature });
      else {
        const k = { main: a, listening: o.address, issued: t.now() }, P = await t.signWithMain(a, N5(k)), z = await s.request("listening.link", { main: a, issued: k.issued, mainSignature: P });
        await t.saveLink({ ...k, mainSignature: P, listeningSignature: z.listeningSignature }), it = -1 / 0;
      }
      zt("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Ne("One more passkey check…", _r), !(o != null && o.unproven)) : !0,
    deposit: () => Ne("Approve the deposit in your wallet…", async () => {
      Ie(), await _r();
      const a = t.main();
      if (!a || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (De()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Fe()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Ks(!0);
      const g = uu(i ?? 0n);
      if (g <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await t.deposit(a, o.address, g), H && Ot({ txid: H, amount: g.toString(), at: t.now() }), zt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ne("Approve the top-up in your wallet…", async () => {
      Ie(), await _r();
      const a = t.main(), g = pe();
      if (!a || !g) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (qe(g)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const k = await t.chain.balance(g);
      we() ? l = { for: g, value: k, at: t.now() } : (i = k, c = t.now());
      const P = uu(k);
      if (P <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const z = await t.deposit(a, g, P);
      z && Ot({ txid: z, amount: P.toString(), at: t.now() }, g), zt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (a) => Ne("Adding plays…", async () => {
      if (Ie(), !we()) throw new Error("Open the album you want to add plays to first.");
      if (!Ec.includes(a)) throw new Error("Choose one of the amounts offered.");
      const g = R5(a, It());
      if (h || d || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (Xe().length || De()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Ro(0, o.slot ?? 0, g), zt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Ne("Confirm in the listening wallet…", async () => {
      if (!Gs()) throw new Error("Connect your wallet first.");
      await Dn(), await s.request("listening.approveSession", ns()), An(!0), zt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ne("Clearing…", async () => {
      for (const a of $())
        await t.chain.transaction(a.txid) || re({ ...a, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      zt("Cleared ✓");
    }),
    switchOff: () => Ne("Switching off…", async () => {
      Ur(), await (s == null ? void 0 : s.request("listening.stop")), An(!1), zt("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Ne("Showing your backup words in the box…", async () => {
      if (!(o != null && o.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const a = await wn();
      await a.request("listening.backup"), o = await bn(a), zt("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Mt = null, await vn(!0), t.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (a) => Ne("Confirm in the listening wallet…", async () => {
      var Z, nt, st, $t;
      const g = at();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !g) throw new Error("Unlock your player first.");
      if (!t.awardNote) throw new Error("Awards are not available here.");
      if (Tt("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (te(g)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || y || Xe().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Dn();
      const k = await t.awardNote(g, a), { balance: P, nonce: z } = await t.chain.account(g);
      if (P < ac) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const J = await (await wn()).request("listening.signAward", {
        cls: k.cls,
        number: k.number,
        plays: k.plays,
        record: k.record,
        signature: k.signature,
        fee: ac.toString(),
        nonce: z.toString(),
        balance: P.toString()
      }), W = ci(J.raw);
      if (J.hero !== g || J.number !== k.number || ((nt = (Z = W.payload) == null ? void 0 : Z.functionName) == null ? void 0 : nt.content) !== "claim" || (($t = (st = W.payload) == null ? void 0 : st.contractName) == null ? void 0 : $t.content) !== E5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await t.chain.broadcast(J.raw, J.txid), t.store.set(Yt(g), JSON.stringify({ txid: J.txid, at: t.now() })), c = -1 / 0, At && (At = { ...At, at: -1 / 0 }), zt("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (a) => Ne("Confirm in the listening wallet…", async () => {
      var nt, st, $t;
      const g = at(), k = Lt();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !g) throw new Error("Unlock your player first.");
      if ((k == null ? void 0 : k.state) !== "claimed" || k.inscription === void 0) throw new Error("There is no record to send yet.");
      if (k.holds === !1) throw new Error("This record has already been sent.");
      if (k.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if ($e(g)) throw new Error("Your record is already on its way.");
      const P = a.trim();
      if (!xr(P)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (P === g) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Tt("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || y || Xe().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Dn();
      const { balance: z, nonce: U } = await t.chain.account(g);
      if (z < ac) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const W = await (await wn()).request("listening.signSendRecord", { inscription: k.inscription, recipient: P, fee: ac.toString(), nonce: U.toString(), balance: z.toString() }), Z = ci(W.raw);
      if (W.from !== g || W.recipient !== P || W.inscription !== k.inscription || ((st = (nt = Z.payload) == null ? void 0 : nt.functionName) == null ? void 0 : st.content) !== "transfer" || nr(($t = Z.payload.functionArgs) == null ? void 0 : $t[2]).value !== P)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await t.chain.broadcast(W.raw, W.txid), t.store.set(ue(g), JSON.stringify({ txid: W.txid, at: t.now() })), c = -1 / 0, At && (At = { ...At, at: -1 / 0 }), zt("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Ne("Locking…", async () => {
      Ur(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, zt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (a) => {
      const g = String(a ?? "").trim();
      if (!(o != null && o.address)) return zt("", "Unlock the listening wallet first.");
      if (!xr(g)) return zt("", "Enter a standard mainnet address (it starts with SP).");
      if (g === o.address) return zt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(ht(o.address), g), zt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && t.store.set(ht(o.address), ""), t.changed();
    },
    returnFunds: (a) => Ne("Check the return in the listening wallet…", async () => {
      if (!Gs()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (Ui()) return Di(a);
      const g = be();
      if (!g) throw new Error(j() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (g.kind !== "linked" && Tt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ye().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Nr({ mode: a, to: g.to, linked: g.kind === "linked" }), a === "all" && An(!1), zt(a === "all" ? g.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, de = [], ur = 10, Fn = 30 * 6e4;
  let Pr = !1;
  const rs = () => h || !!f || d || y, Ur = () => {
    de.length && (de.length = 0, t.changed());
  };
  async function Ko(a) {
    if (!de.some((g) => g.id === a.id) && !pn().some((g) => g.id === a.id) && (de.push({ ...a, at: t.now() }), de.length > ur && de.shift()), rs() || ye().length) {
      const g = de.length;
      S = `Queued ${g === 1 ? "this song" : g + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await ss();
  }
  async function ss() {
    if (!Pr) {
      Pr = !0;
      try {
        for (; de.length; ) {
          for (; de.length && t.now() - de[0].at > Fn; ) de.shift();
          if (!de.length || rs() || await Vo(de[0]) === "wait") return;
          de.shift();
        }
      } finally {
        Pr = !1, t.changed();
      }
    }
  }
  async function Vo(a) {
    var g;
    h = !0;
    try {
      await In();
      const k = sn();
      if (k === "loading") return "wait";
      if (k !== "ready" || !gn() || !(o != null && o.session) || o.session.playsLeft < 1 || !D) return "done";
      if (ye().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const P = o.address, { balance: z, nonce: U } = await t.chain.account(P);
      i = z, c = t.now();
      const J = await t.chain.owner(du, a.song);
      if (J === P || J === Bt()) return "done";
      const W = await s.request("listening.signPlay", {
        core: du,
        song: a.song,
        receipt: a.id,
        fee: It().toString(),
        nonce: U.toString(),
        balance: z.toString()
      }), Z = {
        id: a.id,
        address: P,
        kind: "play",
        core: du,
        song: a.song,
        recipient: J,
        amount: "50",
        fee: It().toString(),
        nonce: U.toString(),
        created: t.now(),
        status: "signed",
        raw: W.raw,
        txid: W.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...a.title ? { title: String(a.title).slice(0, 120) } : {},
        ...a.artist ? { artist: String(a.artist).slice(0, 120) } : {}
      };
      t.validate(Z), re(Z);
      const nt = a.title ? `“${a.title}”${a.artist ? ` by ${a.artist}` : ""}` : `song #${a.song}`;
      try {
        await t.chain.broadcast(W.raw, W.txid), re({ ...Z, status: "pending" }), S = `♪ Paid ${nt}`, C = "";
      } catch (st) {
        re({ ...Z, status: Qo(st) ? "failed" : "unknown", note: st.message, ...Qo(st) ? { raw: void 0 } : {} }), C = st.message;
      }
      return o = await bn(s), "done";
    } catch (k) {
      const P = k instanceof Error ? k.message : "payment unavailable";
      return (g = v()) != null && g.player ? (S = "Payment is taking a moment: " + P, "wait") : (S = "This song played free: " + P, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function u(a) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(sn()) || Tt("like") ? !1 : (m(a), !0);
  }
  async function m(a) {
    const g = a.title ? `“${a.title}”` : `song #${a.song}`, k = (x) => {
      var N;
      C = x, S = "";
      try {
        (N = t.likeFailed) == null || N.call(t, a.song);
      } catch {
      }
      t.changed();
    }, P = we(), z = sn(), U = Bt(), J = P && (z === "fund" || z === "over") ? "ready" : z, W = j() ? pe() : U;
    if (J === "locked") {
      p = { ...a, at: t.now() }, zt(`Unlock to like ${g}. It sends straight after.`);
      return;
    }
    if (J === "wrong-wallet") return k(Wn());
    if (J === "link") return k("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (j() && Tt("standalone")) return k("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (J === "fund") return k("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (J === "over") return k("Return the excess first: the listening wallet holds more than 1 STX.");
    if (P) {
      await Vs(!0);
      const x = qn();
      if (cr(x))
        return t.changed(), k(Zc);
    }
    if (J !== "ready" || !W) return k("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return k("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!D) return k("Pay-per-play is running in another tab. Like from that tab.");
    const Z = pn(pe()).find((x) => x.kind === "like" && x.song === a.song);
    if (Z && Xi.includes(Z.status))
      return k(`Your last like for ${g} is still on its way. It can change again once it confirms.`);
    if (d) return k("One like at a time: your last one is still being sent.");
    if ((Z == null ? void 0 : Z.status) === "confirmed" && t.now() - (Z.confirmedAt ?? 0) < G5)
      return k(`Your like for ${g} has only just confirmed. Try again in a moment.`);
    let nt;
    y = !0;
    try {
      nt = t.likeState ? (await t.likeState(W, a.song)).by : a.likedBy ?? [];
    } catch {
      nt = a.likedBy;
    } finally {
      y = !1;
    }
    if (!nt) return k(`Could not check ${g} right now. Try the heart again.`);
    const st = pe(), ee = ((Z == null ? void 0 : Z.status) === "confirmed" && typeof Z.liked == "boolean" && t.now() - (Z.confirmedAt ?? Z.created) < 5 * 6e4 ? Z.liked : void 0) ?? nt.includes(st);
    if (!ee && nt.some((x) => x !== st)) return k(j() ? `${g} was liked from another wallet of yours. Unlike it there.` : `${g} was liked from your main wallet${nt.includes(U) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await w({ song: a.song, liked: !ee, title: a.title, artist: a.artist });
  }
  async function w(a) {
    var P, z, U;
    if (d) {
      zt("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const g = a.title ? `“${a.title}”${a.artist ? ` by ${a.artist}` : ""}` : `song #${a.song}`, k = t.wait ?? ((J) => new Promise((W) => setTimeout(W, J)));
    try {
      zt(`${a.liked ? "Liking" : "Unliking"} ${g}…`);
      const J = t.now() + 12e4;
      for (; h || (we() ? pn(pe()).some((ee) => Xi.includes(ee.status)) : ye().length); ) {
        if (t.now() > J) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await k(5e3), await In(!0);
      }
      if (!we() && sn() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const W = pe(), { balance: Z, nonce: nt } = await t.chain.account(W);
      if (we() ? l = { for: W, value: Z, at: t.now() } : (i = Z, c = t.now()), cr(Z)) throw new Error(Zc);
      const st = await s.request("listening.signLike", {
        song: a.song,
        liked: a.liked,
        fee: lu.toString(),
        nonce: nt.toString(),
        balance: Z.toString()
      }), $t = {
        id: fu(),
        address: W,
        kind: "like",
        core: 0,
        song: a.song,
        liked: a.liked,
        recipient: "",
        amount: "0",
        fee: lu.toString(),
        nonce: nt.toString(),
        created: t.now(),
        status: "signed",
        raw: st.raw,
        txid: st.txid,
        ...a.title ? { title: String(a.title).slice(0, 120) } : {},
        ...a.artist ? { artist: String(a.artist).slice(0, 120) } : {}
      };
      t.validate($t), re($t);
      try {
        await t.chain.broadcast(st.raw, st.txid), re({ ...$t, status: "pending" }), S = `${a.liked ? "♥ Liked" : "Unliked"} ${g}`, C = "";
        try {
          (P = t.likeSent) == null || P.call(t, a.song, a.liked);
        } catch {
        }
      } catch (ee) {
        if (re({ ...$t, status: Qo(ee) ? "failed" : "unknown", note: ee.message, ...Qo(ee) ? { raw: void 0 } : {} }), C = ee.message, Qo(ee)) try {
          (z = t.likeFailed) == null || z.call(t, a.song);
        } catch {
        }
      }
      o = await bn(s);
    } catch (J) {
      C = "Like not sent: " + (J instanceof Error ? J.message : "the listening wallet is unavailable");
      try {
        (U = t.likeFailed) == null || U.call(t, a.song);
      } catch {
      }
    } finally {
      d = !1, t.changed(), ss();
    }
  }
  return { snapshot: on, refresh: In, onListened: Ko, heart: u, toggleLike: m, ...Ze };
}
const Bb = ["Connect", "Passkey", "Link & fund", "Listen"], Mb = ["Passkey", "Add 1 STX", "Listen"], kd = (t) => t ? Mb : Bb;
function V5(t) {
  if (t.solo) return Y5(t);
  const e = Bb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function Y5(t) {
  const e = Mb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function X5(t, e) {
  return !e || e.at >= kd(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const q5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function W5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !q5(r.id)));
}
const Z5 = {}, Q5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, J5 = (t) => {
  const e = Z5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, t$ = (t) => `/hiro/${t}`, e$ = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, n$ = (t) => {
  const e = J5(t);
  if (e)
    return [e$(e)];
  const n = Q5[t];
  return typeof window < "u" ? [`${window.location.origin}${t$(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, r$ = {}, T0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, s$ = "xtrata.log.enabled", o$ = "xtrata.log.level", i$ = "xtrata.log.tags", a$ = "xtrata.log.dedupe", cc = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, c$ = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, l$ = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, u$ = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, d$ = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, f$ = () => {
  const t = r$ ?? {}, e = cc(s$) ?? t.VITE_LOG_ENABLED, n = cc(o$) ?? t.VITE_LOG_LEVEL, r = cc(i$) ?? t.VITE_LOG_TAGS, s = cc(a$) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: c$(e),
    level: l$(n) ?? "warn",
    tags: d$(r),
    dedupe: u$(s)
  };
}, h$ = (t, e, n) => !t.enabled || T0[n] < T0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), p$ = (t, e, n, r) => {
  const s = f$();
  if (!h$(s, e, t) || y$(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, g$ = /* @__PURE__ */ new Set();
let B0 = null;
const y$ = (t, e, n, r, s) => (B0 !== t && (g$.clear(), B0 = t), !1), w$ = (t, e, n) => p$("debug", t, e, n), b$ = {}, m$ = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, x$ = (t) => {
  const e = b$, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : m$[t];
}, S$ = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, E$ = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return S$.test(n) ? n : null;
}, A$ = (t) => t.replace(/\/+$/, ""), v$ = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), M0 = (t) => {
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
}, Jo = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, k$ = (t) => {
  var l, f;
  let e;
  try {
    e = nr(A6(t));
  } catch {
    return null;
  }
  const n = Jo(e);
  if (!n || n.success === !1)
    return null;
  const r = Jo(n.value), s = Jo(r == null ? void 0 : r.value), o = Jo(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = M0((l = Jo(o.name)) == null ? void 0 : l.value), c = M0((f = Jo(o.namespace)) == null ? void 0 : f.value);
  return !i || !c ? null : E$(`${i}.${c}`);
}, $$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${A$(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [db(Xw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : k$(o.result);
}, I$ = async (t) => {
  const e = t.address.trim();
  if (!ui(e))
    return null;
  const n = x$(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of n$(t.network))
    try {
      return await $$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return w$("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: v$(r)
  }), null;
};
function L$(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (c, l) => {
    l.pending = !0, l.failedAt = void 0, Promise.resolve().then(() => t(c)).then((f) => {
      l.pending = !1, f && (l.name = f, e());
    }).catch(() => {
      l.pending = !1, l.failedAt = s();
    });
  };
  return {
    get(c) {
      if (!c) return null;
      let l = o.get(c);
      return l ? !l.pending && l.name === null && l.failedAt !== void 0 && s() - l.failedAt >= r && i(c, l) : (l = { name: null, pending: !1 }, o.set(c, l), i(c, l)), l.name;
    }
  };
}
const N0 = Object.freeze({
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
}), _0 = Object.freeze({ 139: "melophonic" });
function P0(t, e = "") {
  const n = String(t);
  return Object.hasOwn(N0, n) ? N0[n] : Object.hasOwn(_0, n) ? _0[n] : e;
}
const U0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function H0(t, e = "") {
  return Object.hasOwn(U0, String(t)) ? U0[String(t)] : e;
}
const Nb = 10000n, Rf = 1000000n, Qc = 3000n, C$ = (t, e) => `${t}#gift=${e}`, T$ = 100, qi = (t, e = ar) => t <= Pe ? 0 : Number((t - Pe) / nn(e)), O0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), _b = "xtrata.xyz/radio/gifts", hu = T$, B$ = "Create a prefunded Xtrata radio gift batch", M$ = (t) => ({
  domain: $o({ name: Ve(_b), version: Ve("1"), "chain-id": vr(1) }),
  message: $o({
    purpose: Ve(B$),
    creator: Ve(t.creator),
    count: vr(t.count),
    amount: vr(BigInt(t.amount)),
    label: Ve(t.label),
    issued: vr(t.issued),
    ...t.player ? { player: Ve(t.player) } : {}
  })
}), N$ = (t, e, n = ar) => Pe + BigInt(t) * nn(n) + (e ? Bl : 0n), _$ = (t, e = ar) => Number((Rf - Pe - (t ? Bl : 0n)) / nn(e)), P$ = (t, e) => BigInt(t) * (e + Qc);
function U$(t, e, n, r = ar) {
  const s = n ? Bl : 0n, o = e > Pe + s ? e - Pe - s : 0n, i = Number(o / nn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Xc,
    fees: BigInt(i) * r,
    reserve: Pe,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Qc,
    perCopy: e + Qc,
    total: P$(t, e)
  };
}
const H$ = (t) => t >= Nb && t <= Rf, D0 = 40, O$ = "Create an Xtrata radio gift player", D$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function F0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && D$.test(t) : !n;
}
function F$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!F0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!F0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > D0) throw new Error(`A player holds 1 to ${D0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const s of t.tracks) {
    if (!Number.isSafeInteger(s) || s < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(s)) throw new Error("A song appears twice in the list.");
    e.add(s);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = t.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const s of n) if (!e.has(s)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((s, o) => s - o);
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const j$ = (t) => {
  const e = [...new Set(t.explicit ?? [])].sort((n, r) => n - r);
  return Gd(Yd(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null, ...e.length ? { explicit: e } : {} }))));
}, R$ = (t) => ({
  domain: $o({ name: Ve(_b), version: Ve("1"), "chain-id": vr(1) }),
  message: $o({
    purpose: Ve(O$),
    admin: Ve(t.admin),
    player: Ve(t.hash),
    issued: vr(t.issued)
  })
}), Kr = (t) => t.tracks.filter((e) => !e.hidden), z$ = (t) => t.tracks.find((e) => e.hidden) ?? null, j0 = [300, 500, 1e3], R0 = 1800, pu = /* @__PURE__ */ new Map();
async function G$(t) {
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
function K$(t, e, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = t, (() => {
    const c = pu.get(t), l = !!c && c.until > Date.now();
    o.textContent = l ? c.label : e, o.classList.toggle("is-done", l && c.ok), o.classList.toggle("is-failed", l && !c.ok);
  })(), o.onclick = async () => {
    const c = await n();
    if (c) {
      pu.set(t, { ...c, until: Date.now() + R0 });
      for (const l of document.querySelectorAll("button[data-feedback]"))
        l.dataset.feedback === t && (l.textContent = c.label, l.classList.remove("is-done", "is-failed", "is-pop"), l.offsetWidth, l.classList.add(c.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        pu.delete(t), s();
      }, R0 + 50);
    }
  }, o;
}
const wr = (t, e, n, r, s) => K$(t, e, async () => await G$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Zs = "xtrata.radio.gift.incoming.v1", z0 = (t) => "xtrata.radio.gift.mine.v1:" + t, G0 = (t) => "xtrata.radio.gift.batches.v1:" + t, xt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, yr = (t, e, n = "") => {
  const r = xt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, lc = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Rn = (t) => tr(t).replace(/\.?0+$/, "");
function V$(t) {
  let e = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), G = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return G !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), O0(G) ? G : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const $ = JSON.parse(t.store.get(Zs) || "null");
      return O0($ == null ? void 0 : $.code) ? $.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    e = { code: o }, t.store.set(Zs, JSON.stringify({ code: o, at: t.now() }));
    let $ = 0;
    const G = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (j) => {
      const Y = await j.json().catch(() => ({}));
      if (j.status === 404) {
        t.store.set(Zs, null), e = { ...e, error: (Y == null ? void 0 : Y.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!j.ok) throw new Error("busy");
      const ht = Y;
      e = { ...e, view: ht, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ht.status) && t.store.set(Zs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void G(), n($++)));
    });
    G();
  }
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, c = () => {
    const $ = e == null ? void 0 : e.view;
    return !($ != null && $.player) || !i() ? null : { player: $.player, from: d($), plays: qi(BigInt($.amount)) };
  }, l = () => {
    const $ = e == null ? void 0 : e.view;
    return !$ || $.player || !i() ? null : { plays: qi(BigInt($.amount)), from: $.from ? t.who($.from) : null };
  }, f = () => {
    const $ = e == null ? void 0 : e.code;
    if (!$) return [];
    const G = `${location.origin}${location.pathname}#gift=${$}`;
    return [wr("gift-pass-on", "Copy the link to pass on", () => G, "primary", t.changed)];
  }, h = () => {
    e = null, t.store.set(Zs, null), t.changed();
  }, d = ($) => $.from ? t.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let y = {};
  const p = ($) => {
    if (y.box) return y.box;
    const G = xt("div", "", "ppp-gift-check");
    y.box = G;
    const j = () => {
      const Y = window.turnstile;
      !Y || y.rendered || (y.rendered = !0, Y.render(G, { sitekey: $, callback: (ht) => {
        y.token = ht, t.changed();
      }, "expired-callback": () => {
        y.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const Y = document.createElement("script");
      Y.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", Y.async = !0, Y.onload = j, document.head.append(Y);
    }
    return G;
  }, E = ($) => {
    queueMicrotask(() => void $());
  };
  let S;
  async function C($) {
    var Y, ht, Et, oe, be, jt, v, at, At;
    if (!e || e.claiming || !$.listening) return;
    const G = !!((Y = e.view) != null && Y.player);
    if (G && !$.root) return;
    e.claiming = !0, e.error = void 0, (ht = t.claiming) == null || ht.call(t, !0), t.changed();
    const j = async (Mt) => {
      const mt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: y.token, ...Mt })
      });
      return { res: mt, r: await mt.json().catch(() => ({})) };
    };
    try {
      let Mt = 0, mt = $.listening, Yt;
      if (G) {
        const te = Number((Et = await t.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : Et.next);
        if (!Number.isSafeInteger(te) || te < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Mt = te;
        for (let vn = 0; ; vn++) {
          const Lt = await t.album.bind(Mt);
          if (mt = Lt.address, Yt = await j({ wallet: mt, binding: Lt }), Yt.res.status === 409 && /just taken/.test(((oe = Yt.r) == null ? void 0 : oe.error) || "") && vn < 5) {
            Mt += 1;
            continue;
          }
          break;
        }
      } else Yt = await j({ wallet: mt });
      const { res: ue, r: $e } = Yt;
      if (ue.status === 503 && /sending another gift/.test(($e == null ? void 0 : $e.error) || "")) {
        e.waiting = !0, (be = t.claiming) == null || be.call(t, !0), clearTimeout(S), S = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ue.ok) {
        const te = String(($e == null ? void 0 : $e.error) || "");
        if (ue.status === 404 || ue.status === 410 || ue.status === 409 && /already had a gift|brand-new|already have this album/.test(te))
          throw t.store.set(Zs, null), new Error(te || "This gift cannot be opened.");
        if (ue.status === 429 || ue.status === 403 || ue.status === 400 && !/wallet number/i.test(te)) throw new Error(te || `Could not open the gift (${ue.status}).`);
        const Lt = /topping up/.test(te) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(te) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(te) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Lt), { retry: !0, slow: /topping up|not paid for yet/.test(te) });
      }
      e.done = !0, t.store.set(Zs, null), G ? await t.album.arrived(Mt, mt, $e.txid, BigInt($e.amount)) : t.giftSent($e.txid, BigInt($e.amount));
    } catch (Mt) {
      const mt = Mt, Yt = mt.name === "TypeError" || mt.name === "AbortError" || mt.name === "TimeoutError" || /wallet number/i.test(mt.message);
      if (mt.retry || Yt) {
        const ue = e.tries ?? 0;
        e.tries = ue + 1, e.retry = { text: mt.retry ? mt.message : "Still sending your gift… the network is slow, trying again." }, (jt = t.claiming) == null || jt.call(t, !0), clearTimeout(S), S = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, mt.slow ? 6e4 : n(ue));
      } else
        e.error = mt.message, (v = t.claiming) == null || v.call(t, !1);
      y.token = void 0;
      try {
        (At = (at = window.turnstile) == null ? void 0 : at.reset) == null || At.call(at, y.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let O = null;
  function H($) {
    if (!$.listening || !$.depositPending || $.step !== "fund")
      return O = null, [];
    if (!O || O.wallet !== $.listening || t.now() - O.at > 3e4) {
      const j = $.listening;
      O = { ...(O == null ? void 0 : O.wallet) === j ? O : {}, wallet: j, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(j)).then((Y) => {
        var ht, Et;
        (O == null ? void 0 : O.wallet) === j && (O.state = (ht = Y == null ? void 0 : Y.gift) == null ? void 0 : ht.state, O.problem = ((Et = Y == null ? void 0 : Y.gift) == null ? void 0 : Et.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(O.state === "sending" && O.problem)) return [];
    const G = xt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return G.title = `Network reply: ${O.problem}`, [G];
  }
  function A($, G, j = !1) {
    var jt, v;
    const Y = G.player, ht = BigInt(G.amount), Et = j ? [] : [xt("p", `🎁 ${d(G)} sent you “${Y.title}”${Y.subtitle ? ` by ${Y.subtitle}` : ""}: ${Kr(Y).length} ${Kr(Y).length === 1 ? "song" : "songs"} and ${qi(ht).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step))) {
      if (j) return Et;
      if (Et.push(xt("p", $.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : $.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), $.step === "intro") {
        const at = document.createElement("details");
        at.className = "ppp-how";
        const At = document.createElement("summary");
        At.textContent = "How does this work?", at.append(At, xt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), Et.push(at);
      }
      return Et;
    }
    if ($.walletCannotAlbums)
      return Et.push(xt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), Et;
    const be = (v = (jt = $.gate) == null ? void 0 : jt.gifts) == null ? void 0 : v.turnstileSiteKey;
    return be && !y.token ? Et.push(xt("p", "One quick check and it is yours:", "ppp-mute"), p(be)) : !e.claiming && !e.error && !e.waiting && !e.retry && E(() => C($)), Et.push(...T($, "Sending your album…")), Et;
  }
  function T($, G) {
    const j = [];
    return e.claiming || e.waiting ? j.push(xt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : G, "ppp-cyan")) : e.retry && j.push(xt("p", e.retry.text, "ppp-warn"), yr("Try now", () => {
      clearTimeout(S), e.retry = void 0, C($);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? j.push(xt("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...f(), yr("Forget this gift link here", h, "quiet")) : e.error && j.push(xt("p", e.error, "ppp-bad"), yr("Try again", () => {
      e.error = void 0, C($);
    })), j;
  }
  const _ = ($) => {
    var G;
    return !!e && !e.done && !e.error && i() && !!$.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((G = e.view) != null && G.player)) && ($.balance ?? 0n) === 0n && !$.entries.length);
  };
  function q($, G = {}) {
    var At, Mt;
    const j = H($);
    if (!e || ["off", "elsewhere"].includes($.step)) return j;
    const Y = e.view;
    if (e.error && !Y) return [xt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!Y) return [xt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return j;
    if (Y.status === "claimed" || Y.status === "claiming") return [xt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(Y.status)) return [xt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (Y.status === "pending-deposit") return [xt("p", `🎁 ${d(Y)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (Y.player) return [...A($, Y, !!G.bare), ...j];
    if (!!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0))
      return [xt("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...f(), yr("Forget this gift link here", h, "quiet")];
    const Et = BigInt(Y.amount), oe = qi(Et).toLocaleString(), be = xt(
      "p",
      `🎁 ${d(Y)} sent you ${Rn(Et)} STX of on-chain music: about ${oe} paid plays.`,
      "ppp-gift"
    ), jt = G.bare ? [] : [be], v = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, at = (Mt = (At = $.gate) == null ? void 0 : At.gifts) == null ? void 0 : Mt.turnstileSiteKey;
    return v ? (at && !y.token ? jt.push(xt("p", "One quick check and it is yours:", "ppp-mute"), p(at)) : !e.claiming && !e.error && !e.waiting && !e.retry && E(() => C($)), jt.push(...T($, "Sending your gift…"))) : $.step === "intro" ? G.bare || jt.push(xt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : $.listening && $.linked ? jt.push(xt("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...f(), yr("Forget this gift link here", h, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && jt.push(xt("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...f(), yr("Forget this gift link here", h, "quiet")), jt;
  }
  async function it($, G, j) {
    var Y;
    try {
      const ht = await t.json("/radio/gift/for?wallet=" + encodeURIComponent($));
      if ((Y = ht == null ? void 0 : ht.gift) != null && Y.returnTo) return { ok: !0, funder: ht.gift.returnTo, txId: ht.gift.txid ?? void 0, amount: ht.gift.amount, distinct: 1 };
    } catch {
      if (j) return { ok: !1 };
    }
    return G();
  }
  const Q = xt("div", "", "ppp-gift-fold");
  let K = 250000n, b = "", I = "";
  const B = ($) => {
    try {
      const G = JSON.parse(t.store.get(z0($)) || "[]");
      return Array.isArray(G) ? G : [];
    } catch {
      return [];
    }
  }, M = ($, G) => t.store.set(z0($), JSON.stringify(G.slice(0, 50)));
  async function V($) {
    const G = B($);
    for (const j of G)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await t.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (Y) {
          j.error = Y.message;
        }
    M($, G), t.changed();
  }
  async function R($) {
    if (b) return;
    b = "Starting your gift…", I = "", t.changed();
    let G = null;
    try {
      G = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: K.toString() }) });
      const j = B($);
      j.unshift({ id: G.id, code: G.code, amount: K.toString(), at: t.now() }), M($, j), b = "Approve the gift in your wallet…", t.changed();
      const Y = await t.pay($, G.depositTo, BigInt(G.deposit), G.memo), ht = B($), Et = ht.find((oe) => oe.id === G.id);
      Et && (Et.txid = Y, Et.view = { status: "pending-deposit", amount: K.toString(), source: "friend", from: $, label: "", expires: 0 }), M($, ht), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", V($);
    } catch (j) {
      I = j.message || "Not sent.";
    } finally {
      b = "", t.changed();
    }
  }
  const bt = ($) => "xtrata.radio.gift.players.v1:" + $, dt = ($) => {
    try {
      const G = JSON.parse(t.store.get(bt($)) || "[]");
      return Array.isArray(G) ? G.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function Gt($, G) {
    var j;
    if (!b) {
      b = "Checking the player…", I = "", t.changed();
      try {
        const Y = G.tracks.split(/[\s,]+/).filter(Boolean).map((at) => Number(at.replace(/^#/, ""))), ht = (G.explicit ?? "").split(/[\s,]+/).map((at) => at.replace(/^#/, "")).filter(Boolean).map(Number), Et = F$({ title: G.title.trim(), subtitle: G.subtitle.trim(), tracks: Y, cover: (j = G.cover) != null && j.trim() ? Number(G.cover.trim().replace(/^#/, "")) : null, ...ht.length ? { explicit: ht } : {} });
        b = "Sign in your wallet…", t.changed();
        const oe = { admin: $, hash: j$(Et), issued: t.now() }, be = await t.sign($, R$(oe));
        b = "Making the player…", t.changed();
        const jt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: Et, request: oe, signature: be }) }), v = dt($).filter((at) => at.id !== jt.id);
        v.unshift({ id: jt.id, title: jt.title, tracks: jt.tracks }), t.store.set(bt($), JSON.stringify(v.slice(0, 30))), I = `${jt.existing ? "That player already exists" : "Player made"} ✓ “${jt.title}” · ${jt.tracks} songs. Pick it below for a batch.`;
      } catch (Y) {
        I = Y.message || "Not made.";
      } finally {
        b = "", t.changed();
      }
    }
  }
  const L = ($, G) => C$($ || location.origin + "/radio.html", G), D = ($) => {
    try {
      const G = JSON.parse(t.store.get(G0($)) || "[]");
      return Array.isArray(G) ? G.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id) && Array.isArray(j.codes)) : [];
    } catch {
      return [];
    }
  }, lt = ($, G) => t.store.set(G0($), JSON.stringify(G.slice(0, 20))), St = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, yt = ($, G) => t.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(G) });
  let kt = 0;
  async function ke($) {
    const G = D($);
    for (const j of G)
      if (!St(j))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await yt("/radio/gift/batch/confirm", { id: j.id, ...j.txid ? { txid: j.txid } : {} }) : await t.json("/radio/gift/batch?id=" + j.id), j.error = void 0;
        } catch (Y) {
          j.error = Y.message;
        }
    try {
      const j = await t.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const Y of (j == null ? void 0 : j.batches) ?? []) {
        const ht = G.find((Et) => Et.id === Y.id);
        if (ht) {
          ht.error || (ht.view = Y);
          continue;
        }
        G.push({ id: Y.id, codes: [], count: Y.count, amount: Y.amount, label: Y.label, player: Y.player, depositTo: "", deposit: Y.deposit, memo: Y.memo, at: 0, view: Y });
      }
    } catch {
    }
    lt($, G), t.changed();
  }
  async function It($, G) {
    const j = D($).find((Y) => Y.id === G);
    if (!(!j || !j.depositTo || b)) {
      b = "Approve the payment in your wallet…", I = "", t.changed();
      try {
        const Y = await t.pay($, j.depositTo, BigInt(j.deposit), j.memo), ht = D($), Et = ht.find((oe) => oe.id === G);
        Et && (Et.txid = Y), lt($, ht), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", ke($);
      } catch (Y) {
        I = `${/cancel/i.test(Y.message) ? "Payment cancelled." : Y.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", t.changed();
      }
    }
  }
  async function Tt($, G, j, Y) {
    if (b) return;
    if (!G.ok) {
      I = G.reason, t.changed();
      return;
    }
    b = "Sign in your wallet…", I = "", t.changed();
    let ht = null;
    try {
      const Et = { creator: $, count: G.count, amount: G.amount.toString(), label: j, issued: t.now(), ...Y ? { player: Y } : {} }, oe = await t.sign($, M$(Et));
      b = "Making your links…", t.changed(), ht = await yt("/radio/gift/batch", { request: Et, signature: oe });
      const be = D($);
      be.unshift({ id: ht.id, codes: ht.codes, count: G.count, amount: ht.amount, label: j, player: Y ?? null, depositTo: ht.depositTo, deposit: ht.deposit, memo: ht.memo, at: t.now() }), lt($, be);
    } catch (Et) {
      I = Et.message || "Not made.", b = "", t.changed();
      return;
    }
    b = "", t.changed(), await It($, ht.id);
  }
  function wt() {
    const $ = !!se.value, G = We.value === "max" ? _$($) : Number(We.value), j = N$(G, $), Y = Number(Fe.value);
    return !Number.isInteger(Y) || Y < 1 || Y > hu ? { ok: !1, reason: `Make 1 to ${hu} copies at a time.`, album: $, plays: G, amount: j, count: Y } : H$(j) ? { ok: !0, reason: "", album: $, plays: G, amount: j, count: Y, bill: U$(Y, j, $) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: $, plays: G, amount: j, count: Y };
  }
  const Hn = () => {
    const $ = wt();
    if (!$.ok) return $.reason;
    const G = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${Rn(G.holders)} to song holders, ${Rn(G.fees)} network fees)${$.album ? `, ${Rn(G.float)} for the album’s likes` : ""}, ${Rn(G.reserve)} kept so a listener can return what is left, + ${Rn(G.sendFee)} to send it = ${Rn(G.perCopy)} STX. ${$.count} copies = ${Rn(G.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Re = ($, G) => G.codes.map((j) => L($, j)), Bt = xt("input");
  Bt.type = "range", Bt.min = String(Nb), Bt.max = String(Rf), Bt.step = "10000", Bt.value = String(K), Bt.setAttribute("aria-label", "Gift amount");
  const pn = xt("p", "", "ppp-gift-amount"), re = yr("", () => {
    const $ = t.main();
    $ && R($);
  }, "primary"), gn = () => {
    pn.textContent = An(), re.textContent = `Gift ${Rn(K)} STX`;
  };
  Bt.oninput = () => {
    K = BigInt(Bt.value), gn();
  };
  const An = () => `${Rn(K)} STX · about ${qi(K).toLocaleString()} paid plays · you pay ${Rn(K + Qc)} STX with the network fee`;
  gn();
  const ye = xt("input");
  ye.maxLength = 60, ye.placeholder = "Title, e.g. Proof of Sound", ye.setAttribute("aria-label", "Player title");
  const Xe = xt("input");
  Xe.maxLength = 80, Xe.placeholder = "Artist (optional)", Xe.setAttribute("aria-label", "Player subtitle");
  const De = xt("textarea");
  De.rows = 3, De.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", De.setAttribute("aria-label", "Songs");
  const qe = xt("input");
  qe.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", qe.setAttribute("aria-label", "Explicit songs");
  const Ot = xt("input");
  Ot.inputMode = "numeric", Ot.placeholder = "Cover inscription number (optional), shown when the album loads", Ot.setAttribute("aria-label", "Cover inscription");
  const se = xt("select");
  se.setAttribute("aria-label", "Batch album");
  const We = xt("select");
  We.setAttribute("aria-label", "Plays per copy");
  for (const $ of [.../* @__PURE__ */ new Set([50, 100, 250, ...j0])].sort((G, j) => G - j)) We.append(lc(`${$.toLocaleString()} plays`, String($)));
  We.append(lc("Max (1 STX)", "max")), We.value = String(j0[0]);
  const Fe = xt("input");
  Fe.type = "number", Fe.min = "1", Fe.max = String(hu), Fe.value = "10", Fe.setAttribute("aria-label", "Copies");
  const Me = xt("input");
  Me.maxLength = 40, Me.placeholder = "Label, e.g. Opera launch", Me.setAttribute("aria-label", "Batch label");
  const pe = xt("p", "", "ppp-mute"), we = () => {
    pe.textContent = Hn();
  };
  for (const $ of [se, We, Fe])
    $.oninput = we, $.onchange = we;
  we();
  function qn($) {
    var ht, Et;
    const G = (ht = $.gate) == null ? void 0 : ht.gifts;
    if (!(G != null && G.enabled) || !G.admin || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const j = t.main(), Y = [xt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!j)
      Y.push(xt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (G.admin) {
      const oe = xt("div", "", "ppp-gift-admin"), be = (Mt, mt) => {
        const Yt = xt("label", Mt);
        return Yt.append(mt), Yt;
      }, jt = dt(j);
      oe.append(
        xt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        ye,
        Xe,
        De,
        Ot,
        qe,
        yr("Sign and make player", () => void Gt(j, { title: ye.value, subtitle: Xe.value, tracks: De.value, cover: Ot.value, explicit: qe.value }))
      );
      const v = yr("Sign, pay and make links", () => {
        Tt(j, wt(), Me.value.trim(), se.value || void 0);
      });
      v.disabled = !!b;
      const at = se.value;
      se.replaceChildren(lc("No album (starter copies)", ""), ...jt.map((Mt) => lc(`${Mt.title} · ${Mt.tracks} songs`, Mt.id))), jt.some((Mt) => Mt.id === at) && (se.value = at), we(), oe.append(
        xt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        be("Album ", se),
        be("Plays each ", We),
        be("Copies ", Fe),
        Me,
        pe,
        v
      ), t.now() - kt > 3e4 && (kt = t.now(), ke(j));
      const At = D(j);
      if (At.length) {
        const Mt = xt("ul", "", "ppp-gift-list");
        for (const mt of At.slice(0, 10)) {
          const Yt = mt.view, ue = Yt == null ? void 0 : Yt.copies, $e = mt.error ? mt.error : !Yt || Yt.status === "pending-deposit" ? mt.txid ? "payment confirming…" : "waiting for your payment" : `${ue.claimed} of ${Yt.count} claimed${ue.refunding + ue.refunded ? ` · ${ue.refunded} refunded${ue.refunding ? `, ${ue.refunding} on their way` : ""}` : ""}`, te = xt("li");
          if (te.append(xt("span", `${mt.label || "Batch"} · ${mt.count} × ${Rn(BigInt(mt.amount))} STX`, "t"), xt("span", $e, "ppp-mute")), !mt.txid && mt.depositTo && (!Yt || Yt.status === "pending-deposit") && te.append(yr("Pay now", () => void It(j, mt.id), "tiny")), mt.codes.length && (Yt == null ? void 0 : Yt.status) === "live") {
            const vn = Re(((Et = $.gate) == null ? void 0 : Et.radioUrl) ?? null, mt);
            te.append(
              wr("batch-copy:" + mt.id, "Copy all links", () => vn.join(`
`), "tiny", t.changed),
              wr("batch-csv:" + mt.id, "Copy as CSV", () => ["copy,link", ...vn.map((Lt, Tr) => `${Tr + 1},${Lt}`)].join(`
`), "tiny", t.changed)
            );
          } else mt.codes.length || te.append(xt("span", "links were made on another device", "ppp-mute"));
          Mt.append(te);
        }
        oe.append(Mt);
      }
      Y.push(oe);
    }
    return b && Y.push(xt("p", b, "ppp-cyan")), I && Y.push(xt("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...Y), Q;
  }
  return { banner: q, funder: it, renderFold: qn, liveGift: i, incomingAlbum: c, incomingStarter: l, setAside: h, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: _ };
}
const Y$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function X$(t) {
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
const q$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function W$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((o) => (!e.pinnedOnly || e.pins.has(o.slot)) && (() => {
    const i = q$(o);
    return n.every((c) => i.includes(c));
  })()), s = {
    recent: (o, i) => (e.recents[i.slot] ?? 0) - (e.recents[o.slot] ?? 0) || i.slot - o.slot,
    newest: (o, i) => i.slot - o.slot,
    oldest: (o, i) => o.slot - i.slot,
    title: (o, i) => {
      var c, l;
      return (((c = o.player) == null ? void 0 : c.title) ?? "").localeCompare(((l = i.player) == null ? void 0 : l.title) ?? "") || o.slot - i.slot;
    }
  };
  return r.sort((o, i) => Number(e.pins.has(i.slot)) - Number(e.pins.has(o.slot)) || s[e.sort](o, i));
}
function Z$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const $d = /* @__PURE__ */ new Set(), zf = (t) => ($d.add(t), () => {
  $d.delete(t);
}), Jc = () => {
  for (const t of [...$d])
    try {
      t();
    } catch {
    }
}, K0 = "xtrata:al-thumb:v1:", Pb = "-", Wi = 96, Q$ = 24 * 1024 * 1024, cn = /* @__PURE__ */ new Map(), V0 = /* @__PURE__ */ new Set(), Id = [];
let gu = !1, yu;
const tl = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(K0 + t);
    window.localStorage.setItem(K0 + t, e);
  } catch {
  }
  return null;
};
function Gf(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return e(t);
      const o = new Image(), i = setTimeout(() => e(t), 8e3);
      o.onload = () => {
        clearTimeout(i);
        try {
          const c = Math.min(o.naturalWidth, o.naturalHeight);
          if (!c) return e(t);
          r.width = r.height = Wi, s.fillStyle = "#143a40", s.fillRect(0, 0, Wi, Wi), s.drawImage(o, (o.naturalWidth - c) / 2, (o.naturalHeight - c) / 2, c, c, 0, 0, Wi, Wi), e(r.toDataURL("image/jpeg", 0.82));
        } catch {
          e(t);
        }
      }, o.onerror = () => {
        clearTimeout(i), e(t);
      }, o.src = t;
    } catch {
      e(t);
    }
  });
}
async function J$(t) {
  var l, f, h, d, y;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((l = e.body) == null ? void 0 : l.cancel()), null;
  if (n.startsWith("image/"))
    return await ((f = e.body) == null ? void 0 : f.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((h = e.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const o = (p) => {
    let E = 0;
    for (; ; ) {
      const S = r.slice(E).search(/<img\b/i);
      if (S < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const C = E + S, O = r.indexOf(">", C);
      if (O < 0)
        return r = r.slice(C), null;
      const H = r.slice(C, O + 1), A = H.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = H.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      E = O + 1;
    }
  }, i = (y = (d = e.body) == null ? void 0 : d.getReader) == null ? void 0 : y.call(d);
  if (!i)
    return r = await e.text(), o(!0) ?? "";
  const c = new TextDecoder();
  for (; ; ) {
    const { done: p, value: E } = await i.read();
    if (p) break;
    s += E.byteLength, r += c.decode(E, { stream: !0 });
    const S = o(!1);
    if (S)
      return await i.cancel(), S;
    if (s > Q$)
      return await i.cancel(), null;
  }
  return r += c.decode(), o(!0) ?? "";
}
async function tI() {
  if (!gu) {
    gu = !0;
    try {
      for (; Id.length; ) {
        const t = Id.shift();
        if (!cn.has(t))
          try {
            const e = await J$(t);
            if (e === null) continue;
            if (!e) {
              cn.set(t, ""), tl(t, Pb), Jc();
              continue;
            }
            const n = await Gf(e);
            cn.set(t, n), n.startsWith("data:image/jpeg") && tl(t, n), Jc();
          } catch {
          }
      }
    } finally {
      gu = !1;
    }
  }
}
function Ub(t, e) {
  if (e && !cn.get(t) ? (cn.set(t, e), Gf(e).then((r) => {
    r !== e && (cn.set(t, r), r.startsWith("data:image/jpeg") && tl(t, r), Jc());
  })) : e === "" && !cn.has(t) && cn.set(t, ""), cn.has(t)) return cn.get(t);
  const n = tl(t);
  if (n != null) {
    const r = n === Pb ? "" : n;
    return cn.set(t, r), r;
  }
  return V0.has(t) || (V0.add(t), Id.push(t), yu || (yu = setTimeout(() => {
    yu = void 0, tI();
  }, 1200))), "";
}
const wu = /* @__PURE__ */ new Map(), bu = /* @__PURE__ */ new Set();
function Ld(t) {
  return !t || !Number.isSafeInteger(t) || t < 0 ? "" : wu.has(t) ? wu.get(t) : (bu.has(t) || (bu.add(t), fetch("/inscription/" + t, { signal: AbortSignal.timeout(2e4) }).then(async (e) => {
    var r, s, o, i;
    const n = (e.headers.get("content-type") || "").toLowerCase();
    if (!e.ok)
      throw await ((r = e.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = e.body) == null ? void 0 : s.cancel()), "/inscription/" + t) : n.includes("text/html") ? (((o = (await e.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = e.body) == null ? void 0 : i.cancel()), "");
  }).then((e) => {
    wu.set(t, e), Jc();
  }).catch(() => {
    bu.delete(t);
  })), "");
}
const ti = 12, eI = 5e3, tn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, ei = (t, e, n = "") => {
  const r = tn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function nI(t) {
  let e, n = [], r = 0, s = !1, o = !1, i = -1 / 0, c = "", l = "recent", f = !1, h = ti;
  const d = tn("div", "", "ppp-shelf-box");
  zf(() => t.changed());
  const y = (B) => "xtrata.radio.shelf.pins.v1:" + B, p = (B) => "xtrata.radio.shelf.recent.v1:" + B, E = (B, M) => {
    try {
      return JSON.parse(t.store.get(B) || "null") ?? M;
    } catch {
      return M;
    }
  }, S = (B) => new Set(E(y(B), []).filter((M) => Number.isSafeInteger(M))), C = (B) => {
    const M = E(p(B), {}), V = {};
    for (const [R, bt] of Object.entries(M)) Number.isSafeInteger(Number(R)) && typeof bt == "number" && (V[Number(R)] = bt);
    return V;
  };
  async function O(B) {
    if (!s) {
      s = !0, o = !1;
      try {
        const M = [];
        let V = 0, R = 0;
        for (let bt = 0; bt < eI / 100 + 1; bt++) {
          const dt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(B)}&after=${V}&limit=100`);
          if (M.push(...X$(dt == null ? void 0 : dt.shelf)), R = Number(dt == null ? void 0 : dt.total) || M.length, !(dt != null && dt.next) || !Number.isSafeInteger(dt.next)) break;
          V = dt.next;
        }
        B === e && (n = M, r = R, i = t.now());
      } catch {
        o = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const H = () => {
    i = -1 / 0;
  }, A = tn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    c = A.value, h = ti, t.changed();
  };
  const T = tn("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const B of Y$) {
    const M = document.createElement("option");
    M.value = B.value, M.textContent = B.label, T.append(M);
  }
  T.onchange = () => {
    l = T.value, h = ti, t.changed();
  };
  const _ = ei("", () => {
    f = !f, h = ti, t.changed();
  }, "tiny"), q = tn("div", "", "ppp-shelf-tools");
  q.append(A, T, _);
  const it = tn("div"), Q = tn("div");
  function K(B) {
    const M = B.step === "off" || B.step === "elsewhere" ? void 0 : B.root;
    if (M !== e && (e = M, n = [], r = 0, i = -1 / 0, h = ti), !M || B.walletCannotAlbums) return null;
    if (!s && t.now() - i > 5 * 6e4 && O(M), !n.length)
      return o ? (Q.replaceChildren(tn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ei("Try again", () => {
        i = -1 / 0, t.changed();
      }, "quiet")), d.replaceChildren(Q), d) : null;
    const V = S(M), R = C(M), bt = W$(n, { query: c, sort: l, pinnedOnly: f, pins: V, recents: R });
    A.value !== c && (A.value = c), T.value = l, _.textContent = f ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(f));
    const dt = [];
    if (B.slot > 0 && dt.push(ei("← My player", () => t.open(0), "quiet")), !bt.length) dt.push(tn("p", "No album matches that.", "ppp-mute"));
    else {
      const Gt = tn("ul", "", "ppp-shelf-list");
      for (const L of bt.slice(0, h)) {
        const D = tn("li", "", L.slot === B.slot ? "now" : ""), lt = V.has(L.slot), St = ei(lt ? "★" : "☆", () => {
          const Bt = new Set(V);
          lt ? Bt.delete(L.slot) : Bt.add(L.slot), t.store.set(y(M), JSON.stringify([...Bt])), t.changed();
        }, "tiny");
        St.setAttribute("aria-label", lt ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const yt = [L.player.subtitle, `${Kr(L.player).length} ${Kr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), kt = L.slot === B.slot, ke = ei(kt ? "Playing" : "Select", () => {
          t.store.set(p(M), JSON.stringify(Z$({ ...R, [L.slot]: t.now() }))), t.open(L.slot);
        }, kt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        ke.disabled = kt;
        const It = Kr(L.player)[0], Tt = L.player.cover ?? (It == null ? void 0 : It.id), wt = Tt ? Ub(String(Tt)) : "", Hn = tn("span", "", "ppp-shelf-art");
        if (wt) {
          const Bt = document.createElement("img");
          Bt.src = wt, Bt.alt = "", Bt.decoding = "async", Hn.append(Bt);
        } else Hn.textContent = "💿";
        const Re = tn("span", "", "ppp-shelf-txt");
        Re.append(tn("span", L.player.title, "t"), tn("span", yt, "ppp-mute")), D.append(St, Hn, Re, ke), Gt.append(D);
      }
      dt.push(Gt), bt.length > h && dt.push(ei(`Show more (${bt.length - h} left)`, () => {
        h += ti, t.changed();
      }, "quiet"));
    }
    return o && dt.push(tn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), it.replaceChildren(...dt), d.firstChild !== q && d.replaceChildren(q, it), d;
  }
  return { render: K, invalidate: H, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const B = C(e), M = [...n].filter((V) => V.player).sort((V, R) => (B[R.slot] ?? 0) - (B[V.slot] ?? 0) || R.slot - V.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const Y0 = "http://www.w3.org/2000/svg", rI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function el(t = "", e = !1) {
  const n = document.createElementNS(Y0, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), t && n.setAttribute("class", t);
  for (const [r, s] of rI) {
    const o = document.createElementNS(Y0, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", e ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const Qt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Qs = (t, e, n, r = !1) => {
  const s = Qt("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Hb = (t) => t.toLocaleString(), X0 = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, sI = (t) => t === "gift" || t === "new" ? 1 : t === "arriving" ? 2 : t === "landed" ? 3 : -1;
function nl(t, e) {
  const n = Qt("ol", "al-steps");
  return n.setAttribute("aria-label", e >= t.length ? "All steps done" : `Step ${e + 1} of ${t.length}: ${t[e]}`), t.forEach((r, s) => {
    const o = Qt("li", s < e ? "is-done" : s === e ? "is-now" : "");
    o.append(Qt("i", "", s < e ? "✓" : String(s + 1)), Qt("span", "", r)), n.append(o);
  }), n;
}
function oI() {
  const t = Qt("div", "tier-disc tier-disc--mid");
  return t.dataset.tier = "mystery", t.setAttribute("role", "img"), t.setAttribute("aria-label", "A player waiting to be opened"), t.append(Qt("span", "tier-disc__mark", "?")), t;
}
const iI = [
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
}, aI = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${Hb(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, cI = (t) => t ? `Your player holds ${Hb(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", lI = (t) => t ? `You got a ${t.name} player` : jr.landed.title;
function uI(t, e = !0) {
  const n = Qt("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(Qt("span", "tier-disc__mark", t.mark)), n;
}
function dI(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = Qt("ul", "al-welcome-points");
    for (const [o, i, c] of iI) {
      const l = Qt("li");
      l.title = i;
      const f = Qt("em", "", c);
      f.setAttribute("aria-hidden", "true"), l.append(f, Qt("b", "", o), Qt("span", "", i)), s.append(l);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, o = !1) {
      var d;
      if (!s) {
        n && !o && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = s.mode, s.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const i = Qt("header", "al-top"), c = Qt("a", "al-brand");
      c.href = "/radio", c.append(el("al-logo"), Qt("span", "", "Xtrata "), Qt("b", "", "Music")), i.append(c);
      const l = Qt("div", "al-body al-body--welcome"), f = Qt("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        f.append(Qt("p", "al-welcome-wait", jr.checking));
      else {
        const y = sI(h);
        if (y >= 0 && f.append(nl(h === "new" ? X0.fresh : X0.gift, y)), s.tier && (h === "landed" || h === "back" || h === "empty") ? f.append(uI(s.tier)) : h === "gift" || h === "arriving" ? f.append(oI()) : h === "new" && f.append(el("al-hero-mark")), f.append(Qt("h1", "", h === "landed" ? lI(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : jr[h].title)), f.append(Qt("p", "", h === "gift" ? aI(s.plays, s.from, s.mystery) : h === "landed" ? cI(s.plays) : jr[h].body)), (h === "landed" || h === "gift") && f.append(r()), s.status.length) {
          const p = Qt("div", "al-status");
          p.setAttribute("role", "status"), p.append(...s.status), f.append(p);
        }
        if (s.asking) f.append(Qt("p", "al-hint al-hint--ask", jr.asking));
        else if (h === "gift" || h === "new" || h === "back") {
          const p = jr[h];
          s.canStart && f.append(Qs("al-primary", p.primary, h === "back" ? s.unlock : s.start, s.busy), Qt("p", "al-hint", p.hint)), s.canStart && f.append(Qs("al-link", p.returning, s.returning, s.busy)), f.append(Qs("al-link", p.full, s.full));
        } else if (h === "landed") {
          if (f.append(Qs("al-primary", jr.landed.primary, s.full)), (d = s.albums) != null && d.length) {
            f.append(Qt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const p of s.albums) {
              const E = Qs("al-album", "", p.run);
              if (p.cover) {
                const C = Qt("img", "al-album__art");
                C.src = p.cover, C.alt = "", E.classList.add("al-album--art"), E.append(C);
              }
              const S = Qt("span", "al-album__t");
              S.append(Qt("b", "", p.title), Qt("span", "", p.by)), E.append(S), f.append(E);
            }
          }
        } else h === "empty" && f.append(Qs("al-primary", jr.empty.primary, s.restock), Qs("al-link", jr.empty.full, s.full));
      }
      l.append(f), t.hidden = !1, t.replaceChildren(i, l);
    }
  };
}
const fI = 20, hI = ["Album", "Passkey", "Listen"], Ge = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Le = {
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
function tt(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, o] of Object.entries(e))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Je = (t, ...e) => tt("button", { type: "button", ...t }, ...e), uc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Zi = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, pI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, gI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function q0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const c = document.documentElement;
  function l(b) {
    var B, M, V;
    if (!b || !Number.isSafeInteger(b)) return "";
    const I = (V = (M = (B = e.radio()) == null ? void 0 : B.getState) == null ? void 0 : M.call(B)) == null ? void 0 : V.albumCover;
    return I != null && I.url && Number(I.tokenId) === b ? I.url : Ld(b);
  }
  zf(() => K());
  function f(b) {
    var B;
    o = b, b ? c.dataset.sheet = b : delete c.dataset.sheet;
    const I = document.querySelector(".side");
    if (b && b !== "more") {
      for (const R of gI[b]) {
        const bt = I == null ? void 0 : I.querySelector(R);
        bt && (bt.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = pI[b]);
      const V = document.getElementById("sheetExtra");
      V && V.replaceChildren(...b === "music" ? [d()] : []), (B = I == null ? void 0 : I.scrollTo) == null || B.call(I, { top: 0 });
    }
    K();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => f("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && o && c.dataset.view === "album" && f("");
  });
  const d = () => Je(
    { class: "al-row", onClick: () => {
      f(""), e.openPlayer();
    } },
    tt("span", { class: "al-row-i", html: Le.radio }),
    tt("span", { class: "al-row-t" }, tt("b", {}, "Xtrata Radio"), tt("small", {}, "Every song on-chain · FM, liked, all")),
    tt("span", { class: "al-row-go", html: Le.right })
  );
  let y = null, p = !1;
  const E = () => {
    var I;
    const b = e.radio();
    p || !(b != null && b.subscribe) || (p = !0, b.subscribe((B) => {
      y = B, (s == null ? void 0 : s.mode) === "open" && K();
    }), y = ((I = b.getState) == null ? void 0 : I.call(b)) ?? null);
  };
  r || setInterval(() => {
    var M, V;
    if ((s == null ? void 0 : s.mode) !== "open" || !(y != null && y.playing)) return;
    const b = (V = (M = e.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : V.call(M), I = t.querySelector(".al-bar > i"), B = t.querySelectorAll(".al-times span");
    !b || !I || (I.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", B.length === 2 && (B[0].textContent = uc(b.current || 0), B[1].textContent = b.duration ? uc(b.duration) : "–:––"));
  }, 500);
  let S = "", C = null;
  function O(b, I, B = {}) {
    const M = B.song || l(b.cover), R = [M ? tt("img", { src: M, alt: B.song ? "Song artwork" : `${b.title} cover` }) : tt("div", { class: "al-cover-fallback" }, tt("b", {}, b.title), b.subtitle ? tt("span", {}, b.subtitle) : null), B.paused ? tt("span", { class: "al-paused" }, tt("i", { html: Le.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], bt = "al-cover" + (I ? "" : " al-cover--small") + (B.paused ? " is-paused" : "");
    return B.flip ? (R.push(tt("span", { class: "al-flip", "aria-hidden": "true", html: Le.flip })), Je({ class: bt + " is-flippable", "aria-label": B.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: B.flip }, ...R)) : tt("div", { class: bt }, ...R);
  }
  function H(b) {
    return b.plays === null || b.plays === void 0 ? tt("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? tt("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : tt("span", { class: "al-chip" + (b.plays <= fI ? " al-chip--low" : "") }, `${Zi(b.plays, "play", "plays")} left`);
  }
  function A(b) {
    const I = b.player, B = I.tracks.filter((V) => !V.hidden), M = [];
    return b.step !== void 0 && M.push(nl(hI, b.step)), b.mode === "arrive" && b.from && M.push(tt("p", { class: "al-from" }, tt("span", { html: Le.gift }), tt("span", {}, tt("b", {}, b.from), " sent you an album"))), M.push(O(I, !0)), M.push(tt(
      "div",
      { class: "al-intro" },
      tt("h1", {}, I.title),
      I.subtitle ? tt("p", { class: "al-artist" }, I.subtitle) : null,
      B.length ? tt("p", { class: "al-songline" }, B.map((V) => V.title || `#${V.id}`).join(" · ")) : null,
      tt("span", { class: "al-chip" }, [Zi(B.length, "song", "songs"), b.offered ? Zi(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && M.push(tt("div", { class: "al-status", role: "status" }, ...b.status)), M.push(tt("div", { class: "al-grow" })), b.asking ? M.push(tt("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && M.push(Je({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, tt("span", { html: Le.playSmall }), b.primary.label)), b.hint && !b.asking && M.push(tt("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && M.push(Je({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), M;
  }
  function T(b, I) {
    const { songs: B, current: M, started: V, own: R, out: bt, waiting: dt } = I, Gt = b.player, L = e.radio(), D = [];
    D.push(tt("div", { class: "al-listhead" }, tt("span", {}, tt("b", {}, Gt.title), ` · ${Zi(B.length, "song", "songs")}`), H(b)));
    const lt = l(Gt.cover), St = "album:" + Gt.cover;
    lt && !cn.has(St) && (cn.set(St, lt), Gf(lt).then((kt) => {
      kt !== lt && (cn.set(St, kt), K());
    }));
    const yt = lt ? cn.get(St) || lt : "";
    return D.push(tt("ol", { class: "al-tracks" }, ...B.map((kt, ke) => {
      const It = String(kt.id) === M, Tt = Ub(String(kt.id), It && V ? R : void 0);
      return tt("li", {}, Je(
        { class: "al-track" + (It ? " is-on" : ""), "aria-label": `Play ${kt.title || "#" + kt.id}`, "aria-current": It ? "true" : void 0, disabled: bt || dt, onClick: () => {
          var wt;
          return (wt = L == null ? void 0 : L.playToken) == null ? void 0 : wt.call(L, kt.id);
        } },
        tt(
          "span",
          { class: "al-th" + (Tt ? "" : " is-blank") },
          Tt ? tt("img", { src: Tt, alt: "", decoding: "async" }) : yt ? tt("img", { src: yt, alt: "", decoding: "async" }) : null,
          Tt ? null : tt("span", { class: "al-n" }, String(ke + 1)),
          It ? tt("span", { class: "al-eq", html: Le.eq }) : null
        ),
        tt("span", { class: "al-tt" }, kt.title || `#${kt.id}`, kt.explicit ? tt("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), D;
  }
  function _(b) {
    var Tt;
    const I = b.player, B = I.tracks.filter((wt) => !wt.hidden), M = e.radio(), V = y == null ? void 0 : y.nowPlaying, R = V && I.tracks.some((wt) => String(wt.id) === String(V.tokenId)) ? String(V.tokenId) : null, bt = R ? I.tracks.find((wt) => String(wt.id) === R) : null, dt = b.plays === 0 && !b.playsComing, Gt = !!b.playsComing && !b.plays, L = !!(y != null && y.playing) && !!R, D = y == null ? void 0 : y.heart, lt = R ? (Tt = M == null ? void 0 : M.getPosition) == null ? void 0 : Tt.call(M) : null;
    R && (L || ((lt == null ? void 0 : lt.current) ?? 0) > 0.5) && (S = I.id);
    const St = !!R && S === I.id;
    C && C !== R && (C = null);
    const yt = St ? String((V == null ? void 0 : V.cover) || "") : "", kt = !!yt && C === R, It = [O(I, !dt, { song: kt ? "" : yt, paused: St && !L, flip: yt ? () => {
      C = C === R ? null : R, K();
    } : void 0, flipped: kt })];
    if (It.push(tt(
      "div",
      { class: "al-now" },
      tt(
        "div",
        { class: "al-now-t" },
        tt("div", { class: "al-song" }, bt ? bt.title || (V == null ? void 0 : V.title) || `#${bt.id}` : I.title),
        tt("div", { class: "al-artist" }, bt ? bt.artist || (V == null ? void 0 : V.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      R ? Je({ class: "al-icon" + (D != null && D.liked ? " is-on" : ""), "aria-label": D != null && D.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(D != null && D.liked)), disabled: !!(D != null && D.pending) || !!(D != null && D.locked) || Gt, onClick: () => {
        var wt;
        return (wt = M == null ? void 0 : M.toggleLike) == null ? void 0 : wt.call(M);
      }, html: D != null && D.liked ? Le.heartOn : Le.heart }) : null
    )), dt)
      It.push(tt(
        "div",
        { class: "al-out" },
        tt("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        tt("p", { class: "al-out-t" }, "You've played this album out"),
        tt("p", { class: "al-out-s" }, "Add plays to keep listening."),
        q(b, !0)
      ));
    else {
      const wt = lt != null && lt.duration ? Math.min(100, lt.current / lt.duration * 100) : 0;
      It.push(tt(
        "div",
        { class: "al-prog" },
        tt("div", { class: "al-bar" }, tt("i", { style: `width: ${wt}%` })),
        tt("div", { class: "al-times" }, tt("span", {}, uc((lt == null ? void 0 : lt.current) || 0)), tt("span", {}, lt != null && lt.duration ? uc(lt.duration) : "–:––"))
      ));
    }
    return It.push(tt(
      "div",
      { class: "al-ctl" + (dt || Gt ? " is-off" : "") },
      Je({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: dt || Gt, onClick: () => {
        var wt;
        return (wt = M == null ? void 0 : M.prev) == null ? void 0 : wt.call(M);
      }, html: Le.prev }),
      Je({ class: "al-play", "aria-label": L ? "Pause" : "Play", disabled: dt || Gt, onClick: () => {
        var wt;
        return (wt = M == null ? void 0 : M.playPause) == null ? void 0 : wt.call(M);
      }, html: L ? Le.pause : Le.play }),
      Je({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: dt || Gt, onClick: () => {
        var wt;
        return (wt = M == null ? void 0 : M.next) == null ? void 0 : wt.call(M);
      }, html: Le.next })
    )), b.status.length && It.push(tt("div", { class: "al-status", role: "status" }, ...b.status)), It.push(...T(b, { songs: B, current: R, started: St, own: yt, out: dt, waiting: Gt })), It.push(tt("div", { class: "al-grow" })), It.push(Je(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => f(o === "more" ? "" : "more") },
      tt("span", {}, "More ", tt("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      tt("span", { html: Le.down })
    )), It;
  }
  function q(b, I) {
    const B = tt("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), M = I ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const V of M) {
      const R = b.myPlays !== void 0 && b.myPlays >= V && !b.playsComing && !b.busy;
      B.append(Je({ class: "al-topup", disabled: !R, onClick: () => e.topUp(V) }, I ? `Add ${V.toLocaleString()} plays` : `+${V.toLocaleString()}`));
    }
    return I && B.append(Je({ class: "al-link", onClick: () => f("more") }, "Other amounts")), B;
  }
  function it(b) {
    const I = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), B = tt(
      "div",
      { class: "al-card" },
      tt("div", { class: "al-card-h" }, tt("b", {}, `Add plays to ${b.player.title}`), tt("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      q(b, !1),
      tt("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${Zi(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !b.playsComing && b.myPlays !== void 0 ? Je({ class: "al-link", onClick: () => {
        f(""), e.openPlayer();
      } }, "Open My player") : null
    ), M = (R, bt, dt, Gt) => Je(
      { class: "al-row", onClick: Gt },
      tt("span", { class: "al-row-i", html: R }),
      tt("span", { class: "al-row-t" }, tt("b", {}, bt), tt("small", {}, dt)),
      tt("span", { class: "al-row-go", html: Le.right })
    ), V = tt(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      M(Le.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, K();
      }),
      i ? tt("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return tt(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      tt("div", { class: "al-sheet-h" }, tt("b", {}, "More"), Je({ class: "al-icon", "aria-label": "Close", onClick: () => f(""), html: Le.close })),
      b.mode === "open" ? B : null,
      tt(
        "div",
        { class: "al-rows" },
        M(Le.grid, "My music", "Your albums and the radio", () => f("music")),
        M(Le.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          f(""), e.openPlayer();
        }),
        b.canMake ? M(Le.gift, "Albums (admin)", "Make an album and fund copies", () => f("gifts")) : null,
        M(Le.device, "This device", "Backup, history, Stacks wallet, returns", () => f("device")),
        V
      )
    );
  }
  function Q(b) {
    var dt, Gt;
    const I = b.player, B = y == null ? void 0 : y.nowPlaying, M = B && I.tracks.some((L) => String(L.id) === String(B.tokenId)) ? String(B.tokenId) : null, V = !!(y != null && y.playing) && !!M, R = M ? (Gt = (dt = e.radio()) == null ? void 0 : dt.getPosition) == null ? void 0 : Gt.call(dt) : null;
    M && (V || ((R == null ? void 0 : R.current) ?? 0) > 0.5) && (S = I.id);
    const bt = !!M && S === I.id;
    return T(b, {
      songs: I.tracks.filter((L) => !L.hidden),
      current: M,
      started: bt,
      own: bt ? String((B == null ? void 0 : B.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function K() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete c.dataset.albumlist;
        return;
      }
      E(), t.hidden = !1, c.dataset.albumlist = "1", t.replaceChildren(...Q(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    E(), t.hidden = !1;
    const I = tt(
      "header",
      { class: "al-top" },
      tt("a", { class: "al-brand", href: "/radio" }, el("al-logo"), "Xtrata ", tt("b", {}, "Music")),
      b.mode === "open" ? Je({ class: "al-icon", "aria-label": "My music", onClick: () => f("music"), html: Le.grid }) : null
    ), B = tt("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? _(b) : A(b));
    t.replaceChildren(I, B, ...o === "more" ? [tt("div", { class: "al-scrim", onClick: () => f("") }), it(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, K();
        return;
      }
      const I = !!s;
      s = b, !b && (I || o) && (o = "", delete c.dataset.sheet), b ? c.dataset.view = "album" : delete c.dataset.view, b != null && b.asking ? c.dataset.asking = "1" : delete c.dataset.asking, K();
    },
    sheet: () => o,
    setSheet: f
  };
}
const yI = ["Earned", "Claim", "Yours"], wI = ["Connect", "Link", "Name"], ce = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Ke = (t, e, n, r = !1) => {
  const s = ce("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, W0 = (t, e, n, r = !1) => {
  const s = Ke("al-album", "", n, r), o = ce("span", "al-album__t");
  return o.append(ce("b", "", t), ce("span", "", e)), s.append(o), s;
}, bI = (t) => `No. ${String(t).padStart(4, "0")}`, mI = (t) => t.main ? t.linked ? 2 : 1 : 0;
function xI(t) {
  const e = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = ce("div", "aw-art");
    const c = document.createElement("iframe");
    return c.src = i.art, c.title = `${i.tier.name} record. Drag to turn it.`, c.setAttribute("sandbox", "allow-scripts"), s.append(c), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, c = !1) {
      if (!i) {
        n && !c && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n && (delete e.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.award = i.screen, i.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const l = ce("header", "al-top"), f = ce("a", "al-brand");
      f.href = "/radio", f.append(el("al-logo"), ce("span", "", "Xtrata "), ce("b", "", "Music")), l.append(f);
      const h = ce("div", "al-welcome"), d = i.screen, y = i.tier.name, p = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? nl(wI, mI(i)) : nl(yI, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const H = ce("div", "tier-disc tier-disc--mid");
        H.dataset.tier = i.tier.id, H.append(ce("span", "tier-disc__mark", i.tier.mark)), h.append(H);
      } else if (d !== "have" && d !== "get") {
        const H = o(i);
        H.classList.toggle("aw-art--small", d === "name"), h.append(H);
      }
      const E = d === "ready" ? `Your ${y} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(ce("h1", "", E));
      const S = (H, A = "") => h.append(ce("p", A, H)), C = [];
      if (d === "ready")
        S(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), C.push(Ke("al-primary", `Claim my ${y} record`, () => i.go("name"), i.busy), ce("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), Ke("al-link", "Later", i.later));
      else if (d === "name")
        p ? (S(`Your record will carry ${p} beside your player’s address.`), C.push(Ke("al-primary", `Claim with ${p}`, () => i.claim("auto"), i.busy), Ke("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (S("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), C.push(
          W0("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          W0("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          Ke("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (S("Could not check for a .btc name just now.", "ppp-warn"), C.push(Ke("al-primary", "Check again", i.refresh, i.busy), Ke("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), C.push(ce("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (S(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), C.push(Ke("al-primary", "Link my player", i.link, i.busy))) : i.linked ? p ? (S(`Found it: ${p}. It goes on your plaque beside your player’s address.`), C.push(Ke("al-primary", `Claim with ${p}`, () => i.claim("auto"), i.busy))) : (S(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), C.push(Ke("al-primary", "Check again", i.refresh, i.busy))) : (S(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), C.push(Ke("al-primary", "Show me how", () => i.go("get"), i.busy))) : (S("Connect the Leather or Xverse wallet that holds your .btc name."), C.push(Ke("al-primary", "Connect my wallet", i.connect, i.busy))), C.push(Ke("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const H = ce("ol", "aw-steps"), A = ce("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = ce("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const _ = ce("li");
        _.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", ce("span", "ppp-addr-full", i.player), i.copyAddress());
        const q = ce("li", "", "Check again, and your name shows on the preview before you claim.");
        H.append(A, _, q), h.append(H), C.push(Ke("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), Ke("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (S("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const H = ce("p", "al-hint"), A = ce("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", H.append(A), h.append(H);
        }
      } else if (S(`${y} record ${bI(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), C.push(Ke("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const H = ce("a", "al-link", "Open it full screen ↗");
        H.href = `/i/${i.inscription}`, H.target = "_blank", H.rel = "noopener", C.push(H);
      }
      if (i.status.length) {
        const H = ce("div", "al-status");
        H.setAttribute("role", "status"), H.append(...i.status), h.append(H);
      }
      i.asking ? h.append(ce("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...C);
      const O = ce("div", "al-body al-body--welcome");
      O.append(h), t.hidden = !1, t.replaceChildren(l, O);
    }
  };
}
const SI = [
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
function EI(t) {
  for (const [e, n] of SI) if (n.test(t)) return e;
  return null;
}
const Ob = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Db = (t) => /Android/.test(t);
function AI(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Ob(e) ? "x-safari-" + n.href : Db(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const vI = (t) => Ob(t) ? "Safari" : Db(t) ? "Chrome" : "your browser", ni = "Xtrata Music Wallet", kI = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Z0(t, e = (n) => n) {
  var o, i, c;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((o = t.gate) == null ? void 0 : o.passkeyOnly) || t.linked || ((i = t.others) == null ? void 0 : i.length) ? [{ action: null, label: ni, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((l) => !!l))];
  for (const l of s) {
    const f = t.standIn === l && kI.has(t.step);
    r.push({
      action: "linked",
      main: l,
      label: `${ni} · ${e(l)}`,
      detail: f ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(l)}.`
    });
  }
  if ((c = t.gate) != null && c.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: ni, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: ni, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: ni, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: ni, detail: "Open on this device." });
    }
  return r;
}
const mu = "xtrata.radio.novice", Fb = "xtrata.radio.novice.previewed.v1", Q0 = 6 * 6e4;
function $I(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(mu, r), n = r;
    else {
      if (r === "0")
        return e.set(mu, null), { on: !1, preview: !1 };
      n = e.get(mu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const II = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, J0 = (t) => II.test(t ?? ""), LI = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, CI = {
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
}, TI = (t, e) => CI[t] ?? e;
function BI(t, e) {
  switch (t) {
    case "fund":
      return e.arriving ? [] : [
        e.played ? "Out of plays." : "No plays yet.",
        "Tap “Add plays” to top up, or open an album someone shares with you."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const MI = "Make your player once, with Face ID or your fingerprint, and the music starts.", NI = "Checking your player…", Cd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function jb(t) {
  try {
    const e = JSON.parse(t.get(Fb) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function _I(t, e) {
  const n = jb(t).filter((r) => r !== e);
  n.push(e), t.set(Fb, JSON.stringify(n.slice(-50)));
}
function xu(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...Cd(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : Cd();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > Q0 ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > Q0 ? { ...t, phase: "done" } : t;
  }
}
const dc = (t) => t.phase === "open" || t.phase === "playing";
function PI(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const UI = [100, 250, 500, 1e3], HI = (t, e = ar) => BigInt(t) * nn(e);
function OI(t, e = ar, n = 0n) {
  const r = zr - t - n;
  return r > 0n ? Number(r / nn(e)) : 0;
}
function DI(t, e = ar, n = 0n) {
  const r = t === void 0 ? 0 : OI(t, e, n);
  return UI.map((s) => ({ plays: s, stx: HI(s, e), fits: t !== void 0 && s <= r }));
}
const FI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, jI = (t) => FI[t.unit](t.amount), Ee = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Ac = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function RI(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${Ac(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${Ac(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${Ac(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function zI(t) {
  let e = null, n = 0, r = "stx";
  const s = (i) => {
    var l;
    if (i.some((f) => f.plays === n && f.fits)) return;
    const c = i.filter((f) => f.fits);
    n = ((l = c.find((f) => {
      var h;
      return f.plays === ((h = i[1]) == null ? void 0 : h.plays);
    }) ?? c.at(-1)) == null ? void 0 : l.plays) ?? 0;
  };
  function o() {
    var p;
    if (!e) return;
    const i = t.input();
    if (!i) {
      e.close();
      return;
    }
    const c = DI(i.balance, i.fee, i.incoming);
    s(c);
    const l = PI(i.switches);
    (p = l.find((E) => E.id === r)) != null && p.on || (r = "stx");
    const f = [], h = Ee("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", f.push(h), f.push(Ee("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Ac(i.playsLeft, "play", "plays")} left.`));
    const d = RI(i.done);
    if (d && f.push(Ee("p", "ppp-restock__done", d)), i.arriving)
      f.push(Ee("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      f.push(Ee("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!c.some((E) => E.fits))
      f.push(Ee("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const E = Ee("div", "ppp-restock__packs");
      E.setAttribute("role", "group"), E.setAttribute("aria-label", "How many plays");
      for (const O of c) {
        const H = Ee("button", "ppp-restock__pack" + (O.plays === n ? " is-on" : ""));
        H.type = "button", H.disabled = !O.fits, H.setAttribute("aria-pressed", String(O.plays === n)), H.append(Ee("b", "", O.plays.toLocaleString()), Ee("span", "", "plays")), H.onclick = () => {
          n = O.plays, o();
        }, E.append(H);
      }
      f.push(E);
      const S = Ee("div", "ppp-restock__ways");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How to pay");
      for (const O of l) {
        const H = Ee("button", "ppp-restock__way" + (O.id === r ? " is-on" : ""));
        H.type = "button", H.disabled = !O.on, H.setAttribute("aria-pressed", String(O.id === r)), H.append(Ee("b", "", O.label), Ee("span", "", O.on ? O.blurb : "Soon")), H.onclick = () => {
          r = O.id, o();
        }, S.append(H);
      }
      f.push(S);
      const C = c.find((O) => O.plays === n);
      if (C && r === "stx") {
        const O = Ee("div", "ppp-restock__pay"), H = jI({ unit: "microSTX", amount: C.stx }), A = Ee("p", "ppp-restock__amount");
        A.append("Send ", Ee("b", "", H), " to your player:"), O.append(A, Ee("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Ee("div", "ppp-restock__row");
        T.append(t.copyButton("restock-address", "Copy address", () => i.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => tr(C.stx), "")), O.append(T), O.append(Ee("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), f.push(O);
      }
    }
    f.push(Ee("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const y = Ee("button", "quiet ppp-connect__cancel", "Close");
    y.type = "button", y.onclick = () => e == null ? void 0 : e.close(), f.push(y), e.replaceChildren(...f);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = Ee("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = e;
      i.addEventListener("close", () => {
        i.remove(), e === i && (e = null);
      }), i.addEventListener("click", (c) => {
        c.target === i && i.close();
      }), document.body.appendChild(i), o(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: o,
    close() {
      e == null || e.close();
    }
  };
}
const Vr = (t) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), GI = (t) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
function KI(t, e) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(t) ? t : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = e(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: GI(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function VI(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.artist) continue;
    const r = Vr(n.artist), s = e.get(r);
    s ? s.songs++ : e.set(r, { name: n.artist, songs: 1 });
  }
  return [...e.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function YI(t, e, n = "", r = 60) {
  const s = Vr(e).split(/\s+/).filter(Boolean), o = Vr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const c of t) {
    const l = Vr(c.artist), f = Vr(c.title), h = String(c.id);
    if (o && l !== o) continue;
    let d = 0, y = !0;
    for (const p of s) {
      const E = p.replace(/^#/, "");
      if (f.includes(p)) d += f.startsWith(p) ? 0 : 1;
      else if (/^\d+$/.test(E) && h === E) d += 0;
      else if (l.includes(p)) d += 2;
      else if (/^\d+$/.test(E) && h.startsWith(E)) d += 3;
      else {
        y = !1;
        break;
      }
    }
    y && i.push({ s: c, rank: d });
  }
  return i.sort((c, l) => c.rank - l.rank || c.s.id - l.s.id), { songs: i.slice(0, r).map((c) => c.s), total: i.length };
}
const zn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, tg = 12;
function XI(t, e) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const c = zn("input", "find-q");
  c.type = "search", c.placeholder = "Search songs, artists or #", c.setAttribute("aria-label", "Search all music"), c.autocomplete = "off";
  const l = zn("div", "hint"), f = zn("div", "find-artists"), h = zn("ol", "likesList find-list");
  l.setAttribute("role", "status");
  const d = zn("div", "likesTools");
  d.append(c), t.replaceChildren(d, l, f, h), c.oninput = () => {
    s = c.value, p();
  };
  function y() {
    r === "loading" || r === "ready" || (r = "loading", p(), e.load().then((E) => {
      n = E, r = "ready", p();
    }, () => {
      r = "failed", p();
    }));
  }
  function p() {
    const E = e.locked();
    if (c.disabled = E, E) {
      l.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", f.replaceChildren(), h.replaceChildren();
      return;
    }
    if (r === "idle") {
      l.textContent = "";
      return;
    }
    if (r === "loading") {
      l.textContent = "Loading the catalogue…";
      return;
    }
    if (r === "failed" || !n) {
      l.textContent = "The catalogue is unavailable right now. ";
      const T = zn("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", y();
      }, l.append(T), f.replaceChildren(), h.replaceChildren();
      return;
    }
    const S = VI(n), C = i ? S : S.slice(0, tg), O = (T, _, q, it = "") => {
      const Q = zn("button", "find-chip" + (_ ? " is-on" : ""), T);
      return Q.type = "button", Q.setAttribute("aria-pressed", String(_)), it && (Q.title = it), Q.onclick = q, Q;
    };
    f.replaceChildren(
      ...C.map((T) => O(`${T.name} · ${T.songs}`, Vr(T.name) === Vr(o), () => {
        o = Vr(T.name) === Vr(o) ? "" : T.name, p();
      }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`)),
      ...S.length > tg ? [O(i ? "Fewer artists" : `All ${S.length} artists`, !1, () => {
        i = !i, p();
      })] : []
    );
    const H = YI(n, s, o), A = e.current();
    h.replaceChildren(...H.songs.map((T) => {
      var it, Q;
      const _ = zn("li", "lrow" + (T.id === A ? " now" : "")), q = zn("button", "lt", T.title);
      if (q.type = "button", q.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, q.onclick = () => e.play(T.id), (it = e.explicit) != null && it.call(e, T.id)) {
        const K = zn("span", "exp", "E");
        K.title = "Explicit lyrics: only plays when you choose it", q.append(" ", K);
      }
      if ((Q = e.liked) != null && Q.call(e, T.id)) {
        const K = zn("span", "find-liked", "♥");
        K.title = "You like this song", K.setAttribute("role", "img"), K.setAttribute("aria-label", "Liked"), _.append(q, K);
      } else _.append(q);
      return _.append(zn("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), _;
    })), l.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${S.length.toLocaleString()} artists. Search, or pick an artist.` : H.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : H.total > H.songs.length ? `Showing ${H.songs.length} of ${H.total.toLocaleString()}. Type more to narrow it down.` : `${H.total} ${H.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: y, refresh: p };
}
const aa = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], fc = (t) => typeof t == "string" && aa.some((e) => e.id === t), hc = (t) => aa.find((e) => e.id === t), qI = (t) => aa.find((e) => t >= e.min) ?? aa[aa.length - 1];
function WI(t, e = ar) {
  return qI(t <= Pe ? 0 : Number((t - Pe) / nn(e)));
}
const eg = (t, e, n) => Gd(Yd(new TextEncoder().encode(`xtrata-music-hero:${t}:${e}:${n}`))).slice(0, 8), ng = document.getElementById("ppp");
ng && ZI(ng);
function ZI(t) {
  var Vo;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = gm(), s = (u) => t.querySelector(u), o = s(".ppp-frame");
  let i = null;
  const c = async (u, m) => {
    const w = await fetch(u, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), a = await w.json().catch(() => ({}));
    if (!w.ok) throw new Error((a == null ? void 0 : a.error) || `Request failed (${w.status}).`);
    return a;
  }, l = K5({
    now: Date.now,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => c("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await c("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var w;
      const m = (await c("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((w = m == null ? void 0 : m.find((a) => a.listening === u)) == null ? void 0 : w.main) ?? null;
    },
    saveLink: async (u) => {
      await c("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), i.referrerPolicy = "no-referrer";
      const m = new Promise((k, P) => {
        i.addEventListener("load", () => k(), { once: !0 }), setTimeout(() => P(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = u + "/", o.replaceChildren(i), await m;
      const w = new im({ walletOrigin: u, frame: i, timeoutMs: 30 * 6e4 }), a = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), g = (k, P) => a.has(k) ? w.request(k, P) : Promise.race([
        w.request(k, P),
        new Promise((z, U) => setTimeout(() => U(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await g("listening.status"), { request: g };
    },
    chain: {
      verify: v5,
      balance: $5,
      account: k5,
      owner: I5,
      broadcast: L5,
      transaction: C5,
      confirmedNonce: async (u) => {
        const m = await Os(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (u, m) => A0({ ...m, network: "mainnet", stxAddress: u }),
    deposit: (u, m, w) => new Promise((a, g) => b0({
      recipient: m,
      amount: w.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new Su(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (k) => a(k.txId || ""),
      onCancel: () => g(new Error("Deposit cancelled. Nothing was sent.")),
      onError: g
    })),
    validate: T5,
    tabLock: (u) => new Promise((m) => {
      const w = navigator.locks;
      if (!(w != null && w.request)) {
        m(!0);
        return;
      }
      w.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (a) => {
        m(!!a), a && await new Promise(() => {
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
      set: (u, m) => {
        try {
          localStorage.setItem(u, m);
        } catch {
        }
      }
    },
    changed: () => Wt(l.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var m, w;
      return f.funder(u, () => U5(u, Os), !!((w = (m = l.snapshot().gate) == null ? void 0 : m.gifts) != null && w.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const m = await c("/radio/gift/for?wallet=" + encodeURIComponent(u)), w = m == null ? void 0 : m.gift;
      if (!w) return null;
      if (typeof w.returnTo != "string" || typeof w.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: w.returnTo, from: typeof w.from == "string" ? w.from : null, source: String(w.source ?? ""), amount: String(w.amount ?? "0"), treasury: w.treasury, state: w.state === "sending" ? "sending" : "arrived", player: w.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (u) => {
      const m = await c("/radio/awards/status?address=" + encodeURIComponent(u));
      if (typeof (m == null ? void 0 : m.state) != "string") throw new Error("Unreadable award status.");
      return m;
    },
    awardName: async (u) => {
      const m = await c("/radio/awards/name?address=" + encodeURIComponent(u));
      if ((m == null ? void 0 : m.name) !== null && typeof (m == null ? void 0 : m.name) != "string") throw new Error("Unreadable name.");
      return m.name;
    },
    awardNote: async (u, m) => {
      const w = await c("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: u, name: m }) });
      if (typeof (w == null ? void 0 : w.record) != "string" || typeof (w == null ? void 0 : w.signature) != "string" || !Number.isSafeInteger(w == null ? void 0 : w.cls) || !Number.isSafeInteger(w == null ? void 0 : w.number) || !Number.isSafeInteger(w == null ? void 0 : w.plays)) throw new Error("Unreadable award note.");
      return { cls: w.cls, number: w.number, plays: w.plays, record: w.record, signature: w.signature, name: typeof w.name == "string" ? w.name : null };
    },
    history: (u, m) => D5(u, (w) => Os(w), m),
    likesChanged: () => {
      var u, m;
      (m = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || m.call(u);
    },
    likeState: async (u, m) => {
      const w = await c("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(m) })), a = Array.isArray(w == null ? void 0 : w.rows) ? w.rows.find((g) => (g == null ? void 0 : g.id) === m) : null;
      if (!a || typeof a.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: a.liked, by: Array.isArray(a.by) ? a.by.filter((g) => typeof g == "string") : a.liked ? [u] : [] };
    },
    likeSent: (u, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: m } })),
    nameOf: (u) => $e(u) ?? void 0,
    likeConfirmed: (u, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: m } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), f = V$({
    json: c,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, m, w, a) => new Promise((g, k) => b0({
      recipient: m,
      amount: w.toString(),
      memo: a,
      stxAddress: u,
      network: new Su(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (P) => g(P.txId || ""),
      onCancel: () => k(new Error("Gift cancelled. Nothing was sent.")),
      onError: k
    })),
    sign: (u, m) => A0({ ...m, network: "mainnet", stxAddress: u }),
    giftSent: (u, m) => l.giftSent(u, m),
    claiming: (u) => l.giftClaiming(u),
    album: { bind: (u) => l.bindAlbum(u), arrived: async (u, m, w, a) => {
      h.invalidate(), await l.albumArriving(u, m, w, a);
    } },
    who: (u) => Lt(u),
    changed: () => Wt(l.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, m) => {
        try {
          m === null ? localStorage.removeItem(u) : localStorage.setItem(u, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), h = nI({
    json: c,
    open: (u) => {
      l.openAlbum(u);
    },
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, m) => {
        try {
          m === null ? localStorage.removeItem(u) : localStorage.setItem(u, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Wt(l.snapshot())
  }), d = {
    get: (u) => {
      try {
        return localStorage.getItem(u);
      } catch {
        return null;
      }
    },
    set: (u, m) => {
      try {
        m === null ? localStorage.removeItem(u) : localStorage.setItem(u, m);
      } catch {
      }
    }
  }, y = $I(location.search, d);
  y.on && (document.documentElement.dataset.novice = y.preview ? "preview" : "1");
  const p = (u) => y.on && u.solo, E = y.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), S = E ? document.getElementById("album") : null, C = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (u) => void l.topUpAlbum(u),
    openPlayer: () => void l.openAlbum(0)
  }, O = S ? q0(S, C) : null, H = S ? xI(S) : null, A = "xtrata.radio.award.later.v1";
  let T = "ready", _ = !1, q = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(A) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), it = !1;
  const Q = "xtrata.radio.tier.v1";
  let K = (() => {
    const u = d.get(Q);
    return fc(u) ? hc(u) : null;
  })();
  const b = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function I(u) {
    var g;
    if (u.listening && u.slot === 0 && ["fund", "ready", "over"].includes(u.step) && !(u.gift && u.gift.drop === void 0)) {
      let k = null;
      try {
        k = u.gift && !u.gift.player && u.gift.drop === "players" ? WI(BigInt(u.gift.amount)) : null;
      } catch {
        k = null;
      }
      ((g = u.award) == null ? void 0 : g.state) === "claimed" && u.award.holds === !1 && (k = null), ((k == null ? void 0 : k.id) ?? null) !== ((K == null ? void 0 : K.id) ?? null) && (K = k, d.set(Q, k ? k.id : null));
    }
    const m = document.documentElement;
    K ? m.dataset.tier = K.id : delete m.dataset.tier;
    const w = document.querySelector("#ppp .ppp-head h3");
    if (!w) return;
    let a = w.querySelector(".ppp-tier");
    if (!K) {
      a == null || a.remove();
      return;
    }
    a || (a = v("span", "", "ppp-tier"), w.append(a)), a.dataset.tier = K.id, a.textContent = `${K.mark} ${K.name.toUpperCase()} PLAYER`, a.title = `A ${K.name} player from the Xtrata Music giveaway`;
  }
  const B = y.on && S ? dI(S) : null, M = Date.now();
  let V = !1, R = null, bt = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const dt = () => {
    bt = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    Wt(l.snapshot());
  }, Gt = (u, m) => {
    var g;
    if (!B || m || bt) return null;
    if (!u.gate || u.step === "loading" || (V = !0), !V) return Date.now() - M < 1e4 ? "checking" : null;
    if (!p(u)) return null;
    if (u.step === "intro" || u.step === "unsupported") return f.incomingStarter() ? "gift" : "new";
    if (u.step === "locked") return "back";
    const a = u.slot === 0 && !((g = u.gift) != null && g.player) && !u.entries.some((k) => k.kind === "play");
    return u.step === "fund" && a ? u.depositPending ? "arriving" : "empty" : u.step === "ready" && a && (R === "arriving" || R === "landed") ? "landed" : u.step === "loading" && R !== "checking" ? R : null;
  };
  let L = !1;
  function D(u, m, w = [], a) {
    if (!B) return;
    const g = a !== void 0 ? a : Gt(u, m);
    if (R = g, delete document.documentElement.dataset.noviceBoot, !g) {
      B.render(null, m);
      return;
    }
    const k = [...w];
    g === "arriving" && u.arrival && k.push(Mr(u.arrival)), u.step === "unsupported" ? k.push(v("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : u.error && k.push(v("p", u.error, "ppp-warn"));
    const P = g === "gift" ? f.incomingStarter() : null;
    P && !L && u.step === "intro" && !u.busy && !u.armed && !u.error && !te && (L = !0, l.create({ quick: !0 })), B.render({
      mode: g,
      status: k,
      asking: !!u.busy || u.armed,
      busy: !!u.busy,
      canStart: (u.step === "intro" || u.step === "locked") && !te,
      plays: P ? P.plays : g === "landed" ? u.playsLeft : null,
      from: (P == null ? void 0 : P.from) ?? null,
      tier: K,
      mystery: b,
      albums: g === "landed" ? re.map((z) => ({ title: z.title, by: z.subtitle, cover: Ld(z.cover), run: () => {
        dt(), qe(z, !0);
      } })) : [],
      start: () => void l.create({ quick: !!f.incomingStarter() }),
      unlock: () => void l.unlock(),
      returning: () => void l.unlock(!0),
      restock: () => yt(),
      full: () => {
        var J, W, Z;
        const z = window.XtrataRadio, U = g === "landed" && !((W = (J = z == null ? void 0 : z.getState) == null ? void 0 : J.call(z)) != null && W.playing);
        dt(), U && ((Z = z == null ? void 0 : z.playPause) == null || Z.call(z));
      }
    });
  }
  B && setTimeout(() => {
    V || Wt(l.snapshot());
  }, 10100), zf(() => {
    (B != null && B.showing() || document.documentElement.dataset.asking) && Wt(l.snapshot());
  });
  const St = zI({
    input: () => {
      var g, k, P, z;
      const u = l.snapshot();
      if (!["fund", "ready", "over"].includes(u.step)) return null;
      const m = u.slot === 0 ? { address: u.listening, balance: u.balance } : { address: u.root, balance: (g = u.likeFunds) == null ? void 0 : g.balance };
      if (!m.address) return null;
      const w = u.slot === 0 ? u.entries : [], a = w.filter((U) => U.kind === "play" && U.status === "confirmed");
      return {
        playsLeft: m.balance === void 0 ? null : Et(m.balance),
        balance: m.balance,
        incoming: 0n,
        fee: BigInt(((k = u.gate) == null ? void 0 : k.limits.playFee) ?? "300"),
        address: m.address,
        switches: ((P = u.gate) == null ? void 0 : P.restock) ?? {},
        backedUp: u.backedUp,
        done: a.length ? { plays: a.length, artists: new Set(a.map((U) => U.recipient)).size, likes: w.filter((U) => U.kind === "like" && U.status === "confirmed" && U.liked).length } : null,
        arriving: u.slot === 0 ? u.depositPending : !!((z = u.likeFunds) != null && z.pending)
      };
    },
    copyButton: (u, m, w, a) => wr(u, m, w, a, () => {
      Wt(l.snapshot());
    })
  }), yt = () => {
    if (!l.snapshot().unproven) {
      St.open();
      return;
    }
    l.prove().then((u) => {
      u && St.open();
    });
  }, kt = document.getElementById("albumList"), ke = kt ? q0(kt, C, { list: !0 }) : null, It = "xtrata.radio.album.last.v1", Tt = () => {
    try {
      const u = JSON.parse(localStorage.getItem(It) || "null");
      return u && typeof u.root == "string" && Number.isSafeInteger(u.slot) && u.slot > 0 && u.player && Array.isArray(u.player.tracks) ? u : null;
    } catch {
      return null;
    }
  };
  let wt = "";
  const Hn = (u) => {
    const m = JSON.stringify(u);
    if (m !== wt) {
      wt = m;
      try {
        localStorage.setItem(It, m);
      } catch {
      }
    }
  };
  let Re = null;
  window.XtrataRadioLikeHandler = (u) => {
    var w;
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    (w = l.snapshot().likeFunds) != null && w.album && ($ = !0), Br();
    const m = zs(u.song, { title: u.title, artist: u.artist });
    return l.heart({ song: u.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let Bt;
  window.XtrataRadioListeningIdentity = () => {
    const u = l.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const pn = (u) => {
    var w, a;
    const m = window.XtrataRadioListeningIdentity();
    m !== Bt && (Bt = m, (a = (w = window.XtrataRadio) == null ? void 0 : w.refreshLikes) == null || a.call(w));
  };
  let re = [], gn = 0, An = !1, ye = null;
  const Xe = (u) => {
    var m, w;
    An || !((w = (m = u.gate) == null ? void 0 : m.gifts) != null && w.enabled) || Date.now() - gn < 6e4 || (gn = Date.now(), c("/radio/gift/featured").then((a) => {
      re = (Array.isArray(a == null ? void 0 : a.players) ? a.players : []).filter((g) => g && typeof g.id == "string" && typeof g.title == "string" && Array.isArray(g.tracks) && g.tracks.length > 0).slice(0, 6), An = !0, re.length && Wt(l.snapshot());
    }).catch(() => {
    }));
  }, De = (u) => {
    var m;
    return ye && u.slot === 0 && !((m = u.gift) != null && m.player) && ["ready", "fund", "loading"].includes(u.step) ? ye : null;
  }, qe = (u, m = !1) => {
    var a, g;
    ye = u, Wt(l.snapshot());
    const w = u && m ? Kr(u)[0] : null;
    w && ((g = (a = window.XtrataRadio) == null ? void 0 : a.playToken) == null || g.call(a, w.id));
  };
  let Ot = Cd(), se = null;
  const We = (u) => {
    const m = y.preview && !te && u.step === "intro" ? f.incomingAlbum() : null;
    return m ? (Ot = xu(Ot, { kind: "offer", album: m.player.id, already: jb(d).includes(m.player.id) }), dc(Ot) ? m.player : null) : (Ot = xu(Ot, { kind: "withdraw" }), null);
  }, Fe = (u) => {
    const m = Ot.phase;
    Ot = xu(Ot, u), Ot.phase !== m && (Ot.album && (Ot.phase === "playing" || Ot.phase === "done") && _I(d, Ot.album), Wt(l.snapshot()));
  };
  setInterval(() => {
    Ot.phase === "playing" && Fe({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Me = "", pe, we = !1, qn = !1;
  const cr = (u, m) => {
    var Z, nt, st, $t, ee, x, N, F;
    const w = window.XtrataRadio;
    if (!(w != null && w.setGiftPlayer) || !(w != null && w.setGiftStop)) return;
    const a = m.depositPending && u.step === "fund" && ((Z = u.giftStop) == null ? void 0 : Z.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : u.giftStop, g = se, k = a ? p(u) ? TI(a.reason, a.text) : a.text : null, P = g ? null : k ?? (e && (!((nt = u.gate) != null && nt.here) || u.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    P && P !== pe && (w.setGiftStop(P), pe = P);
    const z = u.step === "off" || u.step === "elsewhere" ? null : ((st = u.gift) == null ? void 0 : st.player) ?? g ?? De(u) ?? null, U = z ? z.id + ":" + z.cover + ":" + z.tracks.map((ut) => ut.id).join(",") : "";
    U !== Me && (w.setGiftPlayer(z ? { id: z.id, title: z.title, subtitle: z.subtitle, tracks: Kr(z).map((ut) => ut.id), hidden: (($t = z$(z)) == null ? void 0 : $t.id) ?? null, cover: z.cover } : null), Me = U), P !== pe && (w.setGiftStop(P), pe = P);
    const J = (a == null ? void 0 : a.reason) === "arriving";
    J !== qn && ((ee = w.setGiftWait) == null || ee.call(w, J), qn = J);
    const W = !!z && (!!g || !!((x = u.albumLock) != null && x.locked));
    W !== we && ((N = w.setGiftLock) == null || N.call(w, W), we = W), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(u.step) && ((F = w.forgetWallets) == null || F.call(w));
  };
  let $ = !1;
  const G = /* @__PURE__ */ new Map(), j = (u) => {
    if (!(u.step === "fund" && !u.depositPending && !!u.gift && !!u.listening && u.balance === 0n && !u.entries.some((a) => a.kind === "play") && (u.brandNew || u.createdHere))) return null;
    let w = G.get(u.listening);
    return w === void 0 && (w = Date.now(), G.set(u.listening, w)), Date.now() - w < Wc ? w : null;
  }, Y = (u) => u.step === "fund" && !u.depositPending && !!u.gift && u.balance === 0n && !u.entries.some((m) => m.kind === "play") && !!u.listening && G.has(u.listening), ht = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", Et = (u) => {
    const m = l.snapshot().playCost || 350n;
    return u > Pe ? Number((u - Pe) / m) : 0;
  }, oe = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), be = (u) => {
    const m = Math.round((Date.now() - u) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, jt = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, v = (u, m = "", w = "") => {
    const a = document.createElement(u);
    return m && (a.textContent = m), w && (a.className = w), a;
  }, at = (u, m, w = "") => {
    const a = v("button", u, w);
    return a.type = "button", a.onclick = m, a;
  }, At = (u, m) => {
    const w = v("a", u);
    return w.href = m, w.target = "_blank", w.rel = "noopener", w;
  };
  let Mt = null, mt = location.hash === "#give";
  mt && history.replaceState(null, "", location.pathname + location.search);
  let Yt = !1;
  const ue = L$((u) => I$({ address: u, network: "mainnet" }), () => Wt(l.snapshot())), $e = (u) => ue.get(u), te = EI(navigator.userAgent), vn = (u, m) => {
    const w = navigator.userAgent, a = vI(w), g = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, k = [v("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${a} to make your ${y.on ? "player" : "listening wallet"}${m ? y.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], P = v("div", "", "ppp-open-row"), z = AI(g, w);
    if (z) {
      const U = v("a", `Open in ${a}`, "primary ppp-open-in");
      U.href = z, U.dataset.homeAction = "radio:open-in-browser", P.append(U);
    }
    return P.append(wr("copy-page-link", "Copy link", () => g, z ? "" : "primary", () => Wt(l.snapshot()))), k.push(P, v("p", `If that does not open ${a}, use ${u}'s menu (••• or ⋮) and choose "Open in ${a === "your browser" ? "browser" : a}", or paste the copied link there.`, "ppp-mute")), k;
  }, Lt = (u) => $e(u) ?? ht(u), Tr = (u) => u.slice(0, 2).map(Lt).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), On = /* @__PURE__ */ new Map();
  let Zr = !1;
  const Rs = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), Br = () => {
    Zr || (Zr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const m of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const w = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(w) && On.set(w, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      Wt(l.snapshot());
    }).catch(() => {
      Zr = !1;
    }));
  }, zs = (u, m) => {
    const w = On.get(u), a = H0(u, [w == null ? void 0 : w.title, m == null ? void 0 : m.title].find((k) => !Rs(k)) || ""), g = P0(u, (w == null ? void 0 : w.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: a, artist: g };
  }, Qr = (u) => {
    const { title: m, artist: w } = zs(u.song, u);
    return m ? `“${m}”${w ? ` — ${w}` : ""}` : `Song #${u.song}${w ? ` — ${w}` : ""}`;
  }, yn = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Oo = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Ui(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["TOO MUCH", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function kn(u, m, w = "", a) {
    const g = v("dt", u), k = v("dd", m, w);
    return a && k.append(" ", a), [g, k];
  }
  const $n = document.getElementById("ppp-top"), sn = () => {
    (o.hidden || o.classList.contains("ppp-frame--rest") ? t : o).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, on = () => {
    var m;
    const u = window.XtrataRadioConnectStacks;
    u ? u() : (m = document.getElementById("radio-wallet-connect")) == null || m.click();
  }, Do = () => {
    var m, w;
    const u = l.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      on();
      return;
    }
    if (u.step === "elsewhere" && ((m = u.gate) != null && m.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    if (u.step === "locked" && !u.armed && !u.busy && l.unlock(), u.step === "ready" && ((w = u.giftStop) == null ? void 0 : w.reason) === "off" && !u.busy && l.switchOn(), u.step === "fund" && u.solo && !u.depositPending && !u.busy) {
      yt();
      return;
    }
    sn();
  };
  $n && ($n.onclick = Do);
  const zt = (u, m, w, a = "") => u.standIn && !u.mainConnected ? at(`Connect ${Lt(u.standIn)} to add STX`, on, a) : at(m, w, a), Ne = (u) => {
    l.useLinked(u).then(() => sn());
  };
  let lr = null;
  const Gs = () => {
    const u = Z0(l.snapshot(), Lt);
    return u.length ? lr || (lr = new Promise((m) => {
      var W;
      const w = v("dialog", "", "ppp-connect");
      w.setAttribute("aria-labelledby", "ppp-connect-title");
      let a = null;
      const g = (Z) => {
        a = Z, w.close();
      };
      w.addEventListener("close", () => {
        w.remove(), lr = null, m(a);
      }), w.addEventListener("click", (Z) => {
        Z.target === w && g(null);
      });
      const k = (Z, nt, st, $t, ee = !1) => {
        const x = v("button", "", "ppp-connect__opt " + st);
        return x.type = "button", x.disabled = ee, x.onclick = $t, x.append(v("b", Z), v("span", nt)), x;
      }, P = v("h2", "Connect", "ppp-connect__title");
      P.id = "ppp-connect-title";
      const z = u.map((Z) => k(Z.label, Z.detail, "is-music", () => {
        if (g("music"), Z.action === "linked" && Z.main) {
          Ne(Z.main);
          return;
        }
        const nt = Z0(l.snapshot(), Lt).find((st) => st.action !== "linked");
        (nt == null ? void 0 : nt.action) === "create" ? l.create() : (nt == null ? void 0 : nt.action) === "unlock" && l.unlock(), sn();
      }, !!Z.disabled)), U = k("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => g("stacks")), J = at("Cancel", () => g(null), "quiet ppp-connect__cancel");
      w.append(P, ...z, U, J), document.body.appendChild(w), w.showModal(), (W = z.find((Z) => !Z.disabled)) == null || W.focus();
    }), lr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Gs;
  function Wn(u) {
    if (!$n) return;
    const m = (a, g, k) => {
      $n.hidden = !1, $n.className = "ppp-top" + (g ? " is-" + g : ""), $n.replaceChildren(v("span", "", "dot"), document.createTextNode(a)), $n.title = k;
    }, w = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        $n.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        $n.hidden = !0;
        return;
      case "intro":
        return m("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${Lt(u.linked)}`, "warn", `This device's listening wallet belongs to ${Lt(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(u.entries.some((a) => a.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return u.payingOn && w > 0 && !u.giftStop ? m(`${w.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Ie = document.getElementById("pppNudge"), wn = document.getElementById("onair");
  (Vo = Ie == null ? void 0 : Ie.querySelector("button")) == null || Vo.addEventListener("click", () => Do());
  const bn = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Ks = {
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
  function Vs(u) {
    if (u.step === "loading") return;
    const m = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, w = u.step === "ready" && u.payingOn && m > 0 && !u.giftStop, a = u.step === "fund" && u.depositPending, g = u.step === "elsewhere" && !e, k = w || a || g ? "" : bn[u.step] ?? "", P = w ? "on" : g ? "free" : k ? "off" : "";
    P ? document.documentElement.dataset.ppp = P : delete document.documentElement.dataset.ppp, wn && (wn.hidden = !P || P === "free", wn.querySelector(".onair-sub").textContent = w ? `${m.toLocaleString()} plays left` : "Plays off"), Ie && (Ie.hidden = P !== "off" && P !== "free", Ie.classList.toggle("is-free", P === "free"), P === "free" ? (Ie.querySelector(".nudge-t").textContent = "You’re on the free player", Ie.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Ie.querySelector("button").textContent = "Get a player") : P === "off" && (Ie.querySelector(".nudge-t").textContent = k, Ie.querySelector(".nudge-s").textContent = p(u) ? u.step === "intro" ? MI : "" : "This radio requires a funded listening wallet with music support on.", Ie.querySelector("button").textContent = Ks[u.step] ?? "Start"));
  }
  let Ys = "";
  function Jr(u) {
    const m = v("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && m.append(v("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && m.append(v("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const w = v("input");
    w.type = "text", w.placeholder = "SP… address to send returns to", w.autocomplete = "off", w.spellcheck = !1, w.setAttribute("aria-label", "Address to return funds to"), w.value = Ys, w.oninput = () => {
      Ys = w.value;
    };
    const a = at(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      l.setReturnAddress(w.value), Ys = "";
    }, "tiny");
    return m.append(w, " ", a), u.returnToKind === "chosen" && m.append(" ", at("Back to the funder", () => l.clearReturnAddress(), "tiny")), m;
  }
  const ts = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Hi() {
    const u = v("p", ts + " ", "ppp-mute");
    return u.append(At("Xverse", "https://www.xverse.app/download"), " · ", At("Leather", "https://leather.io/install-extension")), u;
  }
  let es = "";
  const In = (u) => {
    const m = document.documentElement, w = u.solo && !u.main ? u.listening ? ht(u.listening) : "new" : "", a = W5() ? "1" : "", g = u.standIn && !u.mainConnected ? Lt(u.standIn) : "";
    `${w}|${a}|${g}` !== es && (es = `${w}|${a}|${g}`, w ? m.dataset.pppSolo = w : delete m.dataset.pppSolo, g ? m.dataset.pppAs = g : delete m.dataset.pppAs, a ? m.dataset.pppWalletInstalled = a : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Wt(l.snapshot()), u);
  function Fo(u, m = "") {
    const w = v("div", "", "ppp-topup"), a = Xs(u);
    w.append(v("span", "Add plays from My player: ", "ppp-mute"));
    for (const g of Ec) {
      const k = at(`+${g.toLocaleString()}`, () => void l.topUpAlbum(g), m);
      k.disabled = a === void 0 || a < g || u.depositPending || !!u.busy, w.append(k);
    }
    return a !== void 0 && a < Ec[0] && w.append(v("p", "My player needs plays first (switch to My player above).", "ppp-mute")), w;
  }
  const Xs = (u) => {
    var a;
    const m = (a = u.likeFunds) == null ? void 0 : a.balance;
    if (m === void 0 || !u.playCost) return;
    const w = m - Pe - 6000n;
    return w > 0n ? Number(w / u.playCost) : 0;
  };
  function Oi(u) {
    const m = u.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    if (m.low || ($ = !1), m.low && !$) return [];
    const w = v("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      if (!m.txid) return [];
      const g = v("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return m.txid && g.append(At("View", jt(m.txid))), w.append(g), [w];
    }
    w.append(v("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), w.append(v("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), w.append(v("p", m.address, "ppp-addr-full"));
    const a = v("div", "", "ppp-open-row");
    if (a.append(wr("copy-likes-address", "Copy address", () => m.address, "primary", () => Wt(l.snapshot()))), m.main && !u.solo) {
      const g = zr - (m.balance ?? 0n);
      g > 0n && a.append(zt(u, `Pay ${tr(g)} STX from my wallet`, () => void l.topUpLikes(), "primary"));
    }
    return w.append(a), w.append(v("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [w];
  }
  const Mr = (u) => {
    const m = v("div", "", "ppp-wait");
    m.dataset.since = String(u.since), m.dataset.grace = String(u.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const w = v("p", "", "ppp-wait-t"), a = v("div", "", "ppp-wait-track");
    return a.append(v("div", "", "ppp-wait-fill")), m.append(w, a), ns(m), m;
  };
  function ns(u) {
    const m = Number(u.dataset.since), w = Number(u.dataset.grace) || 6e4, a = Math.max(0, Date.now() - m), g = u.querySelector(".ppp-wait-fill"), k = u.querySelector(".ppp-wait-t");
    if (a < w) {
      const P = Math.ceil((w - a) / 1e3);
      g.style.width = Math.max(4, Math.min(95, a / w * 100)).toFixed(0) + "%", k.textContent = `Your plays are arriving… usually about a minute · ${P}s`, u.classList.remove("is-long"), u.setAttribute("aria-valuenow", String(Math.round(a / w * 100)));
    } else
      g.style.width = "", k.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", u.classList.add("is-long"), u.removeAttribute("aria-valuenow");
  }
  let Dn = 0;
  setInterval(() => {
    const u = document.querySelectorAll(".ppp-wait");
    if (!u.length) {
      Dn = 0;
      return;
    }
    u.forEach(ns), ++Dn % 10 === 0 && Wt(l.snapshot());
  }, 1e3);
  let Nr = null;
  function jo(u) {
    if (u.step === "loading" && Nr !== null) return;
    const w = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(u.step) || !!u.busy || u.armed || !!f.pendingCode() && !["ready", "fund", "over"].includes(u.step);
    w !== Nr && (Nr = w, w ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function Wt(u) {
    var qf, Wf, Zf, Qf, Jf, th, eh, nh, rh, sh, oh, ih, ah, ch, lh, uh;
    if (Re && ["ready", "fund", "over"].includes(u.step) && !u.busy) {
      const X = Re;
      Re = null, u.root === X.root && u.slot !== X.slot && l.openAlbum(X.slot);
    }
    const m = f.inProgress(u), w = j(u), a = m && u.step === "fund" ? { ...u, depositPending: !0 } : w !== null ? { ...u, depositPending: !0, arrival: { since: w, graceMs: Wc } } : u, g = a.error === Zc;
    if (pn(), Xe(u), I(u), se = We(u), cr(u, a), jo(a), In(a), !m && f.inProgress(u)) return;
    if (Wn(a), Vs(a), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(a.step), n.textContent = a.step === "loading" || !a.gate ? y.on ? NI : "Checking your listening wallet…" : y.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = a.step === "off", t.hidden) {
      D(a, !1);
      return;
    }
    const [k, P] = Ui(a), z = s(".ppp-state");
    z.textContent = k, z.className = "ppp-state" + (P ? " ppp-state--" + P : ""), z.hidden = !k;
    const U = !!a.busy || a.armed, J = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(a.step) && (U || !["intro", "loading"].includes(a.step));
    o.hidden = !J, o.classList.toggle("ppp-frame--rest", !U && !Yt);
    const W = s(".ppp-frame-label");
    W.hidden = !0;
    const Z = V5(a) ?? Mt;
    Mt = Z;
    const nt = "xtrata.radio.ppp.heard.v1", st = (() => {
      try {
        return localStorage.getItem(nt) === "1";
      } catch {
        return !1;
      }
    })();
    if (!st && a.entries.some((X) => X.kind === "play"))
      try {
        localStorage.setItem(nt, "1");
      } catch {
      }
    const $t = st || a.slot > 0 && ((((qf = a.likeFunds) == null ? void 0 : qf.balance) ?? 0n) > 0n || h.count() > 1), ee = p(a), x = !ee && X5({ ...a, heard: $t }, Z);
    s(".ppp-badge").hidden = !x;
    const N = s(".ppp-steps"), F = s(".ppp-stage");
    N.hidden = F.hidden = !x, Z && x && (N.replaceChildren(...kd(a.solo).map((X, rt) => {
      const vt = v("li", "", rt < Z.at ? "done" : rt === Z.at ? Z.blocked ? "now blocked" : "now" : "");
      return vt.append(v("span", rt < Z.at ? "✓" : String(rt + 1), "n"), X), rt === Z.at && vt.setAttribute("aria-current", "step"), vt;
    })), F.textContent = Z.caption, F.className = "ppp-stage " + (Z.at >= kd(a.solo).length ? "ppp-ok" : Z.blocked ? "ppp-bad" : "ppp-cyan"));
    const ut = s(".ppp-facts"), ie = [];
    a.main && ((Wf = a.gate) != null && Wf.here) && !a.solo && ie.push(...kn("Your wallet", Lt(a.main), "ppp-addr-short"));
    const ze = () => {
      if (!a.listening) return;
      const X = wr("copy-listening", "Copy", () => a.listening || "", "tiny", () => Wt(l.snapshot()));
      ie.push(...kn(a.slot > 0 ? "Album wallet" : a.linked ? "My player (technical)" : "My player wallet", ht(a.listening), "ppp-addr-short", X));
    };
    if (a.linked || ze(), a.listening && a.step !== "intro")
      if (a.linked)
        ie.push(...kn("Credited to", `${Lt(a.linked)} · plays, likes and returns`, a.linked === a.main || a.solo ? "ppp-ok" : "ppp-warn")), ze();
      else if (a.solo) {
        a.creditedTo && ie.push(...kn("Credited to", `${Lt(a.creditedTo)} · plays and likes`, "ppp-ok"));
        const X = a.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : a.returnTo ? `${Lt(a.returnTo)} · ${a.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : a.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        ie.push(...kn("Returns go to", a.gift ? X : a.returnTo && !$e(a.returnTo) ? X.replace(ht(a.returnTo), a.returnTo) : X, a.returnTo && !a.gift ? "ppp-addr-full" : "ppp-mute"));
      } else ie.push(...kn("Linked to", "not linked yet", "ppp-warn"));
    if (a.linkedListening.length && ((Zf = a.gate) != null && Zf.here)) {
      const X = a.linkedListening.map((rt) => ht(rt) + (rt === a.listening ? " (this one)" : "")).join(", ");
      ie.push(...kn(a.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", X, "ppp-addr-short"));
    }
    if (a.balance !== void 0 && ["fund", "ready", "over"].includes(a.step)) {
      const X = a.step === "fund" && a.depositPending ? "ppp-mute" : a.balanceState === "ok" ? "ppp-ok" : a.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      ie.push(...kn("Balance", `${tr(a.balance)} STX · about ${a.playsLeft.toLocaleString()} plays`, X));
    }
    const an = a.entries.find((X) => X.kind === "play");
    an && Br(), an && ie.push(...kn("Last paid song", `${Qr(an)} → ${Lt(an.recipient)}`, yn[an.status] || "")), ut.replaceChildren(...ie), ut.hidden = !ie.length;
    const ft = [], Zt = [], Xt = [], Qe = [], Fi = nn(BigInt(((Qf = a.gate) == null ? void 0 : Qf.limits.playFee) ?? "300")), ji = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${tr(Xc)} STX to the song holder, plus a ${tr(Fi - Xc)} STX network fee.`, Yo = !!a.busy;
    switch (a.step) {
      case "elsewhere": {
        if (ft.push(v("p", "Pay artists as you listen.")), (Jf = a.gate) != null && Jf.radioUrl) {
          const rt = v("p");
          rt.append(At("Open the pay-per-play radio →", a.gate.radioUrl)), ft.push(rt);
        }
        Zt.push(v("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (a.linked) {
          const rt = [a.linked, ...a.others];
          ft.push(v("p", rt.length > 1 ? `This device has listening wallets for ${Tr(rt)}.` : `This device has a listening wallet for ${Lt(a.linked)}.`)), Zt.push(v("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), rt.slice(0, 3).forEach((vt, ae) => Xt.push(at(`Open ${Lt(vt)}`, () => Ne(vt), ae === 0 ? "primary" : "")));
        } else
          ft.push(v("p", "Connect your wallet to pay artists as you listen.")), Zt.push(v("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        ft.push(v("p", `This device's listening wallet belongs to ${Lt(a.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Zt.push(v("p", `You are connected as ${Lt(a.main)}. Switch to the linked wallet to continue listening.`)), Zt.push(v("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Xt.push(at("Switch wallet", on, "primary"));
        break;
      case "not-invited":
        ft.push(v("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        ft.push(v("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ft.push(v("p", "Every play counts for the song’s owner, on-chain.")), Zt.push(v("p", ji)), Zt.push(v("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Zt.push(v("p", a.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !a.solo && a.main && a.others.length ? (ft.push(v("p", `This device already has a listening wallet for ${Tr(a.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Zt.push(v("p", `Otherwise, set up a new listening wallet for ${Lt(a.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !a.solo && a.main && Zt.push(v("p", `This is the listening wallet for ${Lt(a.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), a.solo && Zt.push(v("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const X = f.liveGift();
        Xt.push(at(X ? "Claim my gift · no wallet needed" : a.solo ? "Start listening · no wallet needed" : a.others.length && a.main ? `Set up for ${Lt(a.main)}` : "Start listening", () => void l.create(), "primary")), !X && !a.solo && a.main && a.others.length && Xt.push(at("Switch wallet", on)), !X && a.solo && Xt.push(at("I have a Stacks wallet", on)), Xt.push(at("I already have a listening wallet", () => void l.unlock(!0))), X && Xt.push(at("Not now", () => f.setAside(), "quiet"));
        break;
      case "locked":
        a.armed || (ft.push(v("p", "Locked.", "ppp-mute")), Xt.push(at("Unlock", () => void l.unlock(), "primary"))), a.standIn ? Qe.push(at("Use a different listening wallet", () => void Gs().then((rt) => {
          rt === "stacks" && on();
        }), "quiet")) : Qe.push(at("Use a different listening wallet", () => void l.unlock(!0), "quiet"));
        break;
      case "link":
        ft.push(v("p", `Link to ${Lt(a.main)} · free`)), Zt.push(v("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Zt.push(v("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Xt.push(at(a.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void l.link(), "primary"));
        break;
      case "loading":
        ft.push(v("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (a.depositPending ? a.arrival && ft.push(Mr(a.arrival)) : Y(a) ? ft.push(v("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (th = a.gift) != null && th.player ? ft.push(v("p", "Out of plays · add more to keep listening", "ppp-bad")) : a.entries.length ? ft.push(v("p", "No plays left · add plays to keep counting", "ppp-bad")) : ft.push(v("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Fi)).toLocaleString()} plays`)), a.entries.length && Zt.push(v("p", "Playback is paused until your top-up confirms.")), a.payingOn && !a.entries.length && Zt.push(v("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m ? Zt.push(v("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : a.depositPending ? Zt.push(v("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : a.solo ? (Zt.push(v("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Zt.push(v("p", a.listening || "", "ppp-addr-full")), a.listening && !a.depositPending && Xt.push(wr("copy-address", "Copy my address", () => a.listening || "", "primary", () => Wt(l.snapshot())))) : Zt.push(v("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), a.depositPending && a.depositTxid) {
          const rt = v("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          rt.append(At("View", jt(a.depositTxid))), ft.push(rt);
        } else a.allowance > 0n && !a.solo && !a.depositPending && Xt.push(zt(a, `Deposit ${tr(a.allowance)} STX from my wallet`, () => void l.deposit(), "primary"));
        break;
      }
      case "over":
        ft.push(v("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), a.phrase && (ft.push(v("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Xt.push(at("Back up my player · 24 words", () => void l.backup(), ""))), a.solo && !a.returnTo && (ft.push(v("p", a.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ft.push(Jr(a))), (!a.solo || a.returnTo) && Xt.push(at("Return excess", () => void l.returnFunds("excess"), "primary"), at("Return all", () => void l.returnFunds("all")));
        break;
      case "ready":
        if (a.payingOn && a.session && a.session.playsLeft > 0 && ((eh = a.giftStop) == null ? void 0 : eh.reason) !== "off") {
          const rt = Math.min(a.session.playsLeft, a.playsLeft);
          ft.push(v("p", `${rt.toLocaleString()} plays left`, "ppp-ok")), Zt.push(v("p", ji + " The heart likes or unlikes from this wallet for 0.0002 STX.")), Xt.push(at("Switch off", () => void l.switchOff()));
        } else
          ft.push(v("p", "Switch on music support to listen.", "ppp-mute")), Xt.push(at("Switch plays on", () => void l.switchOn(), "primary"));
        a.queued && ft.push(v("p", a.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${a.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), a.balanceState === "low" && ft.push(v("p", "Running low on plays", "ppp-warn")), a.aboveTarget && ft.push(v("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), a.depositPending ? ft.push(v("p", "Plays on their way…", "ppp-warn")) : a.allowance > 0n && a.balanceState !== "ok" && !a.solo && Xt.push(zt(a, `Top up ${tr(a.allowance)} STX`, () => void l.deposit()));
        break;
    }
    if (a.solo && a.listening && !a.depositPending) {
      const X = a.step === "fund", rt = a.step === "ready" && (a.balanceState === "low" || !!a.gift && a.giftPlays <= 20);
      X ? Xt.unshift(at("Add plays", () => yt(), "primary")) : rt ? Xt.push(at("Add plays", () => yt(), "primary")) : a.step === "ready" && Qe.push(at("Add plays", () => yt(), "quiet"));
    }
    if (a.solo && a.walletCannotSolo && Zt.push(v("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), a.solo && ["fund", "ready"].includes(a.step) && ((a.balance ?? 0n) > 0n && a.slot === 0 && Zt.push(Jr(a)), Zt.push(Hi()), a.slot === 0 && a.step === "ready" && a.entries.some((X) => X.kind === "play" && X.status === "confirmed"))) {
      const X = v("p", "New to Stacks? ", "ppp-mute");
      X.append(At("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ft.push(X);
    }
    if (a.walletOutdated && Zt.push(v("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), a.stuck && (ft.push(v("p", a.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${a.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Xt.push(at("Clear stuck payments", () => void l.clearStuck()))), ["ready", "fund"].includes(a.step) && (a.returnTo || a.gift) && (a.balance ?? 0n) > 0n && Qe.push(at(a.linked ? "Return all to my wallet" : a.gift ? "Return what is left…" : `Return all to ${Lt(a.returnTo)}`, () => void l.returnFunds("all"), "quiet")), a.slot > 0 && ((nh = a.gift) != null && nh.player) && ["ready", "fund"].includes(a.step) && a.giftPlays > 20 && Qe.push(Fo(a, "quiet")), a.phrase && ["ready", "fund", "over"].includes(a.step) && Qe.push(at(a.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void l.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(a.step) && Qe.push(at("Lock", () => void l.lock(), "quiet")), J && !U && Qe.push(at(Yt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Yt = !Yt, Wt(l.snapshot());
    }, "quiet")), [...Xt, ...Qe].forEach((X) => X.disabled = Yo), Yo && (Xt.length = 0), !ee && a.balance !== void 0 && ["fund", "ready", "over"].includes(a.step) && !(a.step === "fund" && a.depositPending && a.balance === 0n) && !((rh = a.gift) != null && rh.player)) {
      const X = a.balanceState === "ok" ? "ppp-ok" : a.balanceState === "low" ? "ppp-warn" : "ppp-bad", rt = ft.at(0);
      a.step === "ready" && rt ? rt.append(v("span", ` · ${oe(a.balance)} STX`, X)) : ft.push(v("p", `Balance ${oe(a.balance)} STX`, X));
    }
    if (ee) {
      for (const vt of [...Xt, ...Qe]) {
        const ae = LI[vt.textContent ?? ""];
        ae && (vt.textContent = ae);
      }
      for (let vt = ft.length - 1; vt >= 0; vt--) J0(ft[vt].textContent) && Zt.unshift(...ft.splice(vt, 1));
      for (let vt = Xt.length - 1; vt >= 0; vt--) J0(Xt[vt].textContent) && Qe.unshift(...Xt.splice(vt, 1));
      const X = a.entries.some((vt) => vt.kind === "play"), rt = BI(a.step, { played: X, arriving: a.depositPending });
      rt.length && ft.length && rt.shift(), ft.push(...rt.map((vt) => v("p", vt, "ppp-mute")));
    }
    if ((sh = a.gift) != null && sh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(a.step)) {
      const X = v("p", "", "ppp-gift");
      X.append(`💿 Album · ${a.gift.player.title}`), a.gift.player.subtitle && X.append(" · ", a.gift.player.subtitle);
      const rt = ["ready", "fund", "over"].includes(a.step) && a.balance !== void 0 ? a.giftPlays === 0 && a.depositPending ? v("span", " · plays on their way", "ppp-warn") : v("span", a.giftPlays === 0 ? " · no plays left" : ` · ${a.giftPlays.toLocaleString()} ${a.giftPlays === 1 ? "play" : "plays"} left`, a.giftPlays === 0 ? "ppp-bad" : a.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      rt && X.append(rt);
      const vt = (oh = ft.at(0)) == null ? void 0 : oh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (a.step === "ready" && vt && /STX/.test(vt.textContent ?? "") && vt.remove(), ft.unshift(X), a.giftPlays <= 20 && ["ready", "fund"].includes(a.step) && !a.depositPending)
        if (a.slot > 0)
          ft.splice(1, 0, v("p", a.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Fo(a, "primary"));
        else {
          const ae = v("p", a.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ae.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ae.append(At("Xverse", "https://www.xverse.app/download"), " and ", At("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ft.splice(1, 0, ae);
        }
    }
    if (a.gift && !a.linked && ["fund", "ready", "over"].includes(a.step) && a.returnPlan.state === "ready") {
      const X = a.returnPlan, rt = v("div", "", "ppp-pick");
      rt.append(v("p", X.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const vt = v("ul", "", "ppp-gift-list");
      X.steps.forEach((ae, is) => {
        const as = ae.kind === "gift" ? "the unused gift" : ae.kind === "deposit" ? "what was added to it" : "the rest", mn = v("li");
        mn.append(v("span", `${is + 1}. ${tr(BigInt(ae.send))} STX · ${as}`, "t"), v("span", ae.to ? ` → ${Lt(ae.to)}` : " → choose an address below", ae.to ? "ppp-mute" : "ppp-warn")), vt.append(mn);
      }), rt.append(vt), X.kept && rt.append(v("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), X.steps.some((ae) => !ae.to) && rt.append(Jr(a)), rt.append(at(X.steps.length > 1 ? `Confirm part 1 of ${X.steps.length}` : "Confirm and return", () => void l.returnFunds("all"), "primary")), ft.push(rt);
    }
    const Ln = Ro(a), os = E ? Ln : null, Xo = Gt(a, !!os), zb = Xo === "gift" || Xo === "arriving" || Xo === "new", Ml = f.banner(u, { bare: !!os || Xo === "gift" || Xo === "arriving" }), La = te && (f.pendingCode() || ["intro", "locked", "unsupported"].includes(a.step)) ? vn(te, f.pendingCode()) : [];
    os || (ft.unshift(...Ml), ft.push(...Oi(a)), ft.unshift(...La)), a.solo && a.creditedTo && a.listening && !["intro", "off", "elsewhere", "loading"].includes(a.step) && ft.unshift(v("p", `This is ${Lt(a.creditedTo)}'s listening wallet. Plays and likes count for ${Lt(a.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...ft);
    const Nl = document.querySelector(".ppp-switch");
    if (Nl) {
      const X = h.latest(), rt = a.slot > 0, vt = ["fund", "ready", "over"].includes(a.step) && (rt || !!X);
      if (Nl.hidden = !vt, vt) {
        const ae = (mn, Ba, Ma, Ol) => {
          const qo = at("", Ol, "ppp-tab");
          return qo.setAttribute("aria-pressed", String(Ma)), qo.append(v("span", mn, "tt"), v("span", Ba === void 0 ? "…" : `${Et(Ba).toLocaleString()} plays`, "ts")), qo.disabled = !!a.busy, qo;
        }, is = rt ? ((ah = (ih = a.gift) == null ? void 0 : ih.player) == null ? void 0 : ah.title) ?? "Album" : X.title, as = at("View all albums" + (h.count() > 1 ? ` (${h.count()})` : ""), () => {
          const mn = document.querySelector(".ppp-shelf");
          mn && (mn.hidden = !1, mn.open = !mn.open, as.setAttribute("aria-expanded", String(mn.open)), mn.open && requestAnimationFrame(() => mn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        as.setAttribute("aria-expanded", String(!!((ch = document.querySelector(".ppp-shelf")) != null && ch.open))), Nl.replaceChildren(
          ae("🎧 My player", rt ? (lh = a.likeFunds) == null ? void 0 : lh.balance : a.balance, !rt, () => {
            rt && l.openAlbum(0);
          }),
          ae("💿 " + is, rt ? a.balance : void 0, rt, () => {
            !rt && X && l.openAlbum(X.slot);
          }),
          as
        );
      }
    }
    const Ca = h.render(a), Ta = document.querySelector(".ppp-shelf");
    if (Ta) {
      Ta.hidden = !Ca;
      const X = Ta.querySelector("summary");
      X && (X.textContent = h.count() > 0 ? `♪ My albums (${h.count()})` : "♪ My albums");
      const rt = Ta.querySelector(".ppp-shelf-body");
      Ca && rt && !rt.contains(Ca) && rt.replaceChildren(Ca);
    }
    const Ri = f.renderFold(u);
    if (s(".ppp-gifts").hidden = !Ri, Ri && !s(".ppp-gift-body").contains(Ri) && s(".ppp-gift-body").replaceChildren(Ri), Ri && mt) {
      mt = !1;
      const X = s(".ppp-gifts");
      X.open = !0, requestAnimationFrame(() => X.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const _l = document.querySelector("#ppp .ppp-featured");
    if (_l) {
      const X = re.length > 0 && a.slot === 0 && !((uh = a.gift) != null && uh.player) && a.step === "ready";
      _l.hidden = !X, X && _l.replaceChildren(v("p", "Albums in your player", "ppp-featured__h"), ...re.map((rt) => {
        const vt = (ye == null ? void 0 : ye.id) === rt.id, ae = at("", () => qe(vt ? null : rt, !vt), "ppp-featured__a" + (vt ? " is-on" : "")), is = Kr(rt).length;
        return ae.append(v("b", rt.title), v("span", vt ? "Playing now · tap to go back to the radio" : `${rt.subtitle ? rt.subtitle + " · " : ""}${is} ${is === 1 ? "song" : "songs"}`)), ae.setAttribute("aria-pressed", String(vt)), ae.disabled = !!a.busy, ae;
      }));
    }
    Go(a);
    const Pl = document.querySelector("#ppp .ppp-yours");
    if (Pl) {
      const X = a.solo && !!a.listening && a.slot === 0 && ["fund", "ready"].includes(a.step);
      Pl.hidden = !X;
      const rt = Pl.querySelector(".ppp-yours-body");
      if (X && rt && rt.getAttribute("data-for") !== a.listening) {
        rt.setAttribute("data-for", a.listening);
        const vt = (Ol, ...qo) => {
          const dh = v("details", "", "ppp-yours-item");
          return dh.append(v("summary", Ol), ...qo), dh;
        }, ae = v("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ae.append(v("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const is = v("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), as = v("p");
        as.append(At("Find a name at BNS One →", "https://bns.one"));
        const mn = v("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ba = v("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Ma = v("p");
        Ma.append(At("See the giveaway →", "https://xtrata.xyz/giveaway")), rt.replaceChildren(
          vt("Give your player a name", ae, is, v("p", a.listening, "ppp-addr-full"), wr("copy-yours-address", "Copy my player’s code", () => l.snapshot().listening || "", "tiny", () => Wt(l.snapshot())), as),
          vt("Link it to a wallet you already have", mn),
          vt("Bring a friend in", Ba, Ma)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Zt), s(".ppp-actions").replaceChildren(...Xt), s(".ppp-actions2").replaceChildren(...Qe);
    const Ul = a.busy || a.message || "", Kf = s(".ppp-msg"), Hl = Ul && ft.some((X) => (X.textContent ?? "").startsWith(Ul.replace(/[.✓\s]+$/, ""))) ? "" : Ul, Vf = !Hl && !a.error ? a.notice : g && !Hl ? a.error : "";
    Kf.textContent = Hl || Vf, Kf.classList.toggle("is-warn", !!Vf), s(".ppp-err").textContent = g ? "" : a.error;
    const Gb = a.entries.filter((X) => X.kind === "play");
    s(".ppp-recent").hidden = !a.entries.length, s(".ppp-recent-list").replaceChildren(...Gb.slice(0, 5).map((X) => {
      const rt = v("li"), vt = X.status === "confirmed" ? "ok" : X.status === "failed" ? "bad" : "warn";
      return rt.append(v("span", "", "d " + vt), v("span", Qr(X), "t"), v("span", be(X.created), "ppp-mute")), X.txid && rt.append(At("tx", jt(X.txid))), rt;
    })), s(".ppp-wallets").hidden = !(ut.childElementCount || Qe.length), s(".ppp-more").hidden = !Zt.length;
    const Yf = s(".ppp-history");
    Yf.hidden = !a.entries.length, a.entries.length && Br(), Yf.replaceChildren(v("summary", `All activity (${a.entries.length})`), ...a.entries.slice(0, 20).map((X) => {
      const rt = v("div", "", "ppp-row"), vt = X.kind === "play" ? [v("span", Qr(X), "ppp-song"), v("span", ` · ${tr(BigInt(X.amount))} STX to ${Lt(X.recipient)}`, "ppp-mute")] : X.kind === "like" ? [v("span", `${X.liked ? "♥ Liked" : "Unliked"} ${Qr(X)}`, "ppp-song"), v("span", ` · for ${a.linked ? Lt(a.linked) : "this listening wallet"}`, "ppp-mute")] : [v("span", `Returned ${tr(BigInt(X.amount))} STX`, "ppp-song"), v("span", ` to ${Lt(X.recipient)}`, "ppp-mute")];
      return rt.append(
        v("span", Oo[X.status] || X.status, "ppp-status " + (yn[X.status] || "")),
        ...vt,
        v("span", ` · ${new Date(X.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), X.txid && rt.append(At("tx ↗", jt(X.txid))), rt;
    })), O == null || O.render(os ? _r(a, os, [...La, ...Ml]) : null), D(a, !!os, zb ? [...La, ...Ml] : La, Xo), Ws(a, !!os || !!(B != null && B.showing())), Di(a, os), St.isOpen() && St.refresh(), rs();
    const Xf = (Ln == null ? void 0 : Ln.mode) === "open" ? null : De(a);
    ke == null || ke.render((Ln == null ? void 0 : Ln.mode) === "open" ? _r(a, Ln, []) : Xf ? { ..._r(a, { mode: "open", player: Xf }, []), plays: a.balance === void 0 ? null : a.playsLeft } : null);
  }
  function Ro(u) {
    var a;
    if (["off", "elsewhere", "not-invited"].includes(u.step)) return null;
    if (u.slot > 0 && ((a = u.gift) != null && a.player) && ["fund", "ready", "over", "link", "loading"].includes(u.step))
      return u.root && Hn({ root: u.root, slot: u.slot, player: u.gift.player }), { mode: "open", player: u.gift.player };
    const m = f.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const w = Tt();
    return w && (u.step === "locked" || Re && u.step === "loading") ? { mode: "locked", player: w.player } : null;
  }
  const qs = (u, m, w, a, g) => `/awards/${u.id}#${new URLSearchParams({ n: String(m), a: w, ...g ? { b: g } : {}, p: String(a), s: eg($0, m, w) })}`;
  function zo(u) {
    const m = u.award;
    return !m || !["ready", "fund", "over", "link"].includes(u.step) ? null : m.claimTx ? _ ? "making" : null : m.state === "claimed" ? _ && m.inscription !== void 0 ? "yours" : null : m.state !== "ready" || q || u.step === "link" && T !== "have" ? null : T === "making" || T === "yours" ? "ready" : T;
  }
  function Ws(u, m) {
    if (!H) return;
    const w = u.award, a = w != null && w.cls && fc(w.cls) ? hc(w.cls) : null, g = u.slot === 0 ? u.listening : u.root, k = m || !w || !a || !g || w.number === void 0 ? null : zo(u);
    if (!k || !w || !a || !g) {
      H.render(null, m);
      return;
    }
    k === "have" && u.linked && !it && (it = !0, l.awardRefresh());
    const P = typeof w.name == "string" && w.name ? w.name : null, z = [];
    u.error && z.push(v("p", u.error, "ppp-warn"));
    const U = (J) => {
      T = J, J === "name" && (_ = !0), Wt(l.snapshot());
    };
    H.render({
      screen: k,
      tier: a,
      number: w.number,
      need: w.need ?? 0,
      player: g,
      name: w.name,
      inscription: w.inscription,
      art: k === "yours" && w.inscription !== void 0 ? `/i/${w.inscription}` : qs(a, w.number, g, w.need ?? 0, P),
      claimLink: w.claimTx ? jt(w.claimTx) : void 0,
      status: z,
      asking: !!u.busy || u.armed,
      busy: !!u.busy,
      main: u.main ? Lt(u.main) : null,
      canLink: u.step === "link",
      linked: !!u.linked,
      copyAddress: () => wr("award-player-address", "Copy my player’s address", () => g, "tiny", () => Wt(l.snapshot())),
      go: U,
      claim: (J) => {
        _ = !0, l.claimAward(J);
      },
      refresh: () => void l.awardRefresh(),
      connect: () => {
        var J;
        return (J = document.getElementById("radio-wallet-connect")) == null ? void 0 : J.click();
      },
      link: () => void l.link(),
      later: () => {
        q = !0;
        try {
          localStorage.setItem(A, String(Date.now()));
        } catch {
        }
        Wt(l.snapshot());
      },
      done: () => {
        _ = !1, T = "ready", Wt(l.snapshot());
      }
    }, m);
  }
  function Go(u) {
    var Z;
    const m = document.querySelector("#ppp .ppp-award");
    if (!m) return;
    const w = u.award, a = u.slot === 0 ? u.listening : u.root, g = w != null && w.cls && fc(w.cls) ? hc(w.cls) : null, k = !!w && !!g && !!a && ["ready", "fund", "over"].includes(u.step) && !(w.state === "unavailable" && w.number === void 0);
    if (m.hidden = !k, !k || !w || !g || !a) {
      m.replaceChildren();
      return;
    }
    const P = JSON.stringify([w, a, !!u.busy]);
    if (m.getAttribute("data-sig") === P) return;
    m.setAttribute("data-sig", P);
    const z = (nt) => {
      const st = v("p", "", "ppp-award__h");
      return st.append(v("b", `${g.mark} Music Hero award`), v("span", nt)), st;
    }, U = `No. ${String(w.number ?? 0).padStart(4, "0")}`, J = (nt) => {
      const st = v("div", "", "ppp-award__art"), $t = document.createElement("iframe");
      return $t.src = nt, $t.title = `${g.name} record`, $t.setAttribute("sandbox", "allow-scripts"), $t.setAttribute("loading", "lazy"), st.append($t), st;
    }, W = [];
    if (w.state === "claimed") {
      if (W.push(z(`${g.name} record · ${U}`)), w.inscription !== void 0 && W.push(J(`/i/${w.inscription}`)), W.push(v("p", w.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : w.holds === null || w.holds === void 0 ? `Yours: Xtrata inscription #${w.inscription}.` : `Yours for good: Xtrata inscription #${w.inscription}. It gives your player its ${g.name} colours.`, w.holds === !1 ? "ppp-mute" : "ppp-ok")), w.inscription !== void 0) {
        const nt = v("p");
        nt.append(At("Open it full screen ↗", `/i/${w.inscription}`)), W.push(nt);
      }
      if (w.sendTx) {
        const nt = v("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        nt.append(At("View", jt(w.sendTx))), W.push(nt);
      } else if (w.holds === !0 && w.inscription !== void 0) {
        const nt = v("details", "", "ppp-award__send"), st = document.createElement("input");
        st.type = "text", st.placeholder = "SP… address to send it to", st.autocomplete = "off", st.spellcheck = !1, st.setAttribute("aria-label", "Address to send your record to");
        const $t = at("Send my record…", () => void l.sendAward(st.value), "");
        $t.disabled = !!u.busy, nt.append(
          v("summary", "Send this record to someone"),
          v("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          st,
          $t
        ), W.push(nt);
      }
    } else if (w.claimTx) {
      W.push(z(`${g.name} record · ${U}`));
      const nt = v("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      nt.append(At("View", jt(w.claimTx))), W.push(nt);
    } else if (w.state === "ready") {
      W.push(z(`${g.name} record · ${U}`));
      const nt = typeof w.name == "string" && w.name ? w.name : null, st = new URLSearchParams({ n: String(w.number), a, ...nt ? { b: nt } : {}, p: String(w.need), s: eg($0, w.number, a) });
      W.push(J(`/awards/${g.id}#${st}`)), W.push(v("p", `Your ${g.name} record is ready. You have paid artists for ${(Z = w.need) == null ? void 0 : Z.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const $t = v("div", "", "ppp-award__row");
      nt ? (W.push(v("p", `Its plaque will carry ${nt} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), $t.append(at("Claim my record", () => {
        _ = !0, l.claimAward("auto");
      }, "primary"), at("Use my address only", () => {
        _ = !0, l.claimAward("none");
      }, "quiet"))) : w.name === null ? (W.push(v("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), $t.append(at("Claim my record", () => {
        _ = !0, l.claimAward("none");
      }, "primary"), at("Check for a name again", () => void l.awardRefresh(), "quiet"))) : (W.push(v("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), $t.append(at("Check for a name again", () => void l.awardRefresh(), "primary"), at("Claim with my address only", () => void l.claimAward("none"), "quiet"))), $t.querySelectorAll("button").forEach((ee) => {
        ee.disabled = !!u.busy;
      }), W.push($t, v("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (w.state === "earning" && w.have !== void 0 && w.need) {
      W.push(z(`${w.have.toLocaleString()} of ${w.need.toLocaleString()} paid plays`));
      const nt = v("div", "", "ppp-award__bar"), st = document.createElement("i");
      st.style.width = `${Math.min(100, Math.round(w.have / w.need * 100))}%`, nt.append(st);
      const $t = w.need - w.have;
      W.push(nt, v("p", `${$t.toLocaleString()} more ${$t === 1 ? "play" : "plays"} and your ${g.name} record is yours to claim.`, "ppp-mute"));
    } else
      W.push(z(`${g.name} record · ${U}`)), W.push(v("p", w.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : w.state === "class-full" || w.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    m.replaceChildren(...W);
  }
  function Di(u, m) {
    var z;
    const w = document.querySelector(".ppp-skin");
    if (!w) return;
    if (!m && (H != null && H.showing()) && ((z = u.award) != null && z.cls) && fc(u.award.cls) && (u.busy || u.armed)) {
      const U = hc(u.award.cls), J = v("span", "", "ppp-skin__t");
      J.append(v("b", `${U.name} record · No. ${String(u.award.number ?? 0).padStart(4, "0")}`), v("span", "Xtrata Music Hero")), w.hidden = !1, w.replaceChildren(v("span", U.mark, "ppp-skin__art ppp-skin__art--none"), J);
      return;
    }
    const a = !!m && (!!u.busy || u.armed);
    if (w.hidden = !a, !a || !m) {
      w.replaceChildren();
      return;
    }
    const g = Ld(m.player.cover), k = g ? v("img", "", "ppp-skin__art") : v("span", "♪", "ppp-skin__art ppp-skin__art--none");
    g && (k.src = g, k.alt = "");
    const P = v("span", "", "ppp-skin__t");
    P.append(v("b", m.player.title), v("span", m.mode === "arrive" && m.from ? `A gift from ${m.from}` : m.player.subtitle || "Your album")), w.replaceChildren(k, P);
  }
  function _r(u, m, w) {
    var U, J, W, Z, nt;
    const a = !!u.busy || u.armed, g = [...w];
    u.depositPending && u.arrival && g.push(Mr(u.arrival)), u.error ? g.push(v("p", u.error, u.error === Zc ? "ppp-warn" : "ppp-bad")) : u.message && !a ? g.push(v("p", u.message, "ppp-cyan")) : u.notice && g.push(v("p", u.notice, "ppp-warn")), m.mode === "open" && $ && ((U = u.likeFunds) != null && U.album) && u.likeFunds.low && !u.likeFunds.pending && g.push(v("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let k = "Kept on this device with Face ID or your passkey. No app or account needed.", P = null, z = null;
    if (m.mode === "locked")
      P = { label: "Continue listening", run: () => {
        Re = Tt(), l.unlock();
      } }, z = { label: "Use a different passkey", run: () => {
        Re = null, l.unlock(!0);
      } };
    else if (m.mode === "arrive")
      if (u.step === "intro" && dc(Ot) && Ot.album === m.player.id) {
        const st = window.XtrataRadio, $t = Kr(m.player)[0], ee = Ot.phase === "playing";
        P = { label: ee && !!((W = (J = st == null ? void 0 : st.getState) == null ? void 0 : J.call(st)) != null && W.playing) ? "Pause" : ee ? "Carry on" : "Play the first song", run: () => {
          var N, F;
          ee ? (N = st == null ? void 0 : st.playPause) == null || N.call(st) : $t && ((F = st == null ? void 0 : st.playToken) == null || F.call(st, $t.id));
        } }, z = { label: "Make my player and hear it all", run: () => void l.create() }, k = "The first song is free. Nothing to set up yet.";
      } else if (u.step === "intro") {
        const st = Ot.phase === "done" && Ot.album === m.player.id;
        st && !g.length && g.push(v("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), P = { label: st ? "Keep listening" : "Open album", run: () => void l.create() }, z = { label: "I've used Xtrata Music here before", run: () => void l.unlock(!0) };
      } else u.step === "locked" ? (P = { label: "Open album", run: () => void l.unlock() }, z = { label: "Use a different passkey", run: () => void l.unlock(!0) }) : u.step === "unsupported" ? g.push(v("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : g.length || g.push(v("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: m.mode === "arrive" && u.step === "intro" ? 1 : void 0,
      plays: m.mode === "open" ? u.balance === void 0 ? null : u.giftPlays : void 0,
      playsComing: u.depositPending,
      status: g,
      primary: P,
      secondary: z,
      hint: P ? k : void 0,
      asking: a,
      busy: !!u.busy,
      myPlays: Xs(u),
      topUps: Ec,
      canMake: !!((nt = (Z = u.gate) == null ? void 0 : Z.gifts) != null && nt.admin)
    };
  }
  const Ze = document.getElementById("findBox"), de = document.getElementById("findBody"), ur = Ze && de ? XI(de, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : Promise.reject(new Error("catalogue unavailable"))).then((u) => KI(u == null ? void 0 : u.tracks, (m, w) => ({ title: H0(m, Rs(w.title) ? "" : w.title), artist: P0(m, w.artist || "") }))),
    play: (u) => {
      var m, w;
      (w = (m = window.XtrataRadio) == null ? void 0 : m.playToken) == null || w.call(m, u);
    },
    current: () => {
      var m, w, a, g;
      const u = Number((g = (a = (w = (m = window.XtrataRadio) == null ? void 0 : m.getState) == null ? void 0 : w.call(m)) == null ? void 0 : a.nowPlaying) == null ? void 0 : g.tokenId);
      return Number.isSafeInteger(u) ? u : null;
    },
    locked: () => {
      var u;
      return !!((u = l.snapshot().albumLock) != null && u.locked);
    },
    explicit: (u) => {
      var m, w;
      return !!((w = (m = window.XtrataRadio) == null ? void 0 : m.isExplicit) != null && w.call(m, u));
    },
    liked: (u) => Pr().has(u)
  }) : null;
  Ze == null || Ze.addEventListener("toggle", () => {
    Ze.open && (ur == null || ur.load());
  });
  let Fn = "";
  const Pr = () => {
    var m, w, a;
    const u = (a = (w = (m = window.XtrataRadio) == null ? void 0 : m.getState) == null ? void 0 : w.call(m)) == null ? void 0 : a.likes;
    return new Set(Array.isArray(u) ? u.map((g) => Number(g == null ? void 0 : g.tokenId)).filter(Number.isSafeInteger) : []);
  }, rs = () => {
    var m, w, a, g, k;
    if (!ur || !(Ze != null && Ze.open)) return;
    const u = `${!!((m = l.snapshot().albumLock) != null && m.locked)}|${((k = (g = (a = (w = window.XtrataRadio) == null ? void 0 : w.getState) == null ? void 0 : a.call(w)) == null ? void 0 : g.nowPlaying) == null ? void 0 : k.tokenId) ?? ""}|${[...Pr()].sort((P, z) => P - z).join(",")}`;
    u !== Fn && (Fn = u, ur.refresh());
  }, Ur = /* @__PURE__ */ new Map();
  let Ko = !1;
  const ss = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((m) => {
      const w = m == null ? void 0 : m.nowPlaying;
      if (w && Number.isSafeInteger(Number(w.tokenId)) && Ur.set(Number(w.tokenId), { title: w.title || void 0, artist: w.artist || void 0 }), rs(), dc(Ot)) {
        const a = !!(m != null && m.playing);
        Fe({ kind: "now", track: w && w.tokenId != null ? String(w.tokenId) : null, playing: a, at: Date.now() }), a !== Ko && (Ko = a, Wt(l.snapshot()));
      }
    }), !0) : !1;
  };
  if (!ss()) {
    const u = setInterval(() => {
      ss() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const m = u.detail;
    if (dc(Ot) && Fe({ kind: "listened", at: Date.now() }), m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      Br();
      const w = zs(m.song, Ur.get(m.song));
      l.onListened({ song: m.song, id: m.id, title: w.title || void 0, artist: w.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void l.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || l.refresh();
  }), setInterval(() => {
    !document.hidden && (e || l.snapshot().step !== "off") && l.refresh();
  }, 15e3), l.refresh();
}
const QI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", JI = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), o = /CriOS/.exec(e.userAgent), i = e.userAgent.includes("Mobile");
  return o ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, tL = () => JI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, eL = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, nL = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Rb = class {
  constructor(t) {
    O4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && s3(t), this.callback(yl(t));
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
    var r, s, o, i, c, l, f, h, d, y;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (i = (o = t.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Firefox" ? (l = (c = t.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(t)) !== null && l !== void 0 ? l : t.webUrl : n === "Android" ? (h = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (y = (d = this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = tL(), e = eL(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Ct("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Ct("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Ct("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Ct("div", { class: "flex flex-col space-y-[10px]" }, Ct("div", { class: "flex items-center" }, Ct("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Ct("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Ct("span", { class: "sr-only" }, "Close popup"), Ct("img", { src: QI }))), r ? Ct("p", null, "Select the wallet you want to connect to.") : Ct("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Ct("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Ct("div", { class: "mt-6" }, Ct("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Ct("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Ct("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ct("div", { class: "aspect-square basis-9 overflow-hidden" }, Ct("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ct("div", { class: "flex-1" }, Ct("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Ct("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Ct("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Ct("div", { class: "mt-6" }, r ? Ct("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Ct("div", { class: "mb-5 flex justify-between" }, Ct("p", { class: "text-sm font-medium" }, "Recommended wallets"), Ct("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Ct("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Ct("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Ct("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Ct("p", null, "What is a wallet? ", Ct("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Ct("ul", { class: "space-y-3" }, n.map((o) => Ct("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ct("div", { class: "aspect-square basis-9 overflow-hidden" }, Ct("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ct("div", { class: "flex-1" }, Ct("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Ct("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, t, e) && Ct("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, t, e), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return m4(this);
  }
};
Rb.style = nL;
const rL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Rb
}, Symbol.toStringTag, { value: "Module" }));
