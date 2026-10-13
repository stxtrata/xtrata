var ay = Object.defineProperty;
var cy = (t, e, n) => e in t ? ay(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var js = (t, e, n) => cy(t, typeof e != "symbol" ? e + "" : e, n);
var re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Oh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Po(t) {
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
      typeof re < "u" && re || {}, r = {
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
        ], o = ArrayBuffer.isView || function(m) {
          return m && i.indexOf(Object.prototype.toString.call(m)) > -1;
        };
      function a(m) {
        if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(m) || m === "")
          throw new TypeError('Invalid character in header field name: "' + m + '"');
        return m.toLowerCase();
      }
      function c(m) {
        return typeof m != "string" && (m = String(m)), m;
      }
      function u(m) {
        var L = {
          next: function() {
            var H = m.shift();
            return { done: H === void 0, value: H };
          }
        };
        return r.iterable && (L[Symbol.iterator] = function() {
          return L;
        }), L;
      }
      function h(m) {
        this.map = {}, m instanceof h ? m.forEach(function(L, H) {
          this.append(H, L);
        }, this) : Array.isArray(m) ? m.forEach(function(L) {
          if (L.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + L.length);
          this.append(L[0], L[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(L) {
          this.append(L, m[L]);
        }, this);
      }
      h.prototype.append = function(m, L) {
        m = a(m), L = c(L);
        var H = this.map[m];
        this.map[m] = H ? H + ", " + L : L;
      }, h.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, h.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, h.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, h.prototype.set = function(m, L) {
        this.map[a(m)] = c(L);
      }, h.prototype.forEach = function(m, L) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && m.call(L, this.map[H], H, this);
      }, h.prototype.keys = function() {
        var m = [];
        return this.forEach(function(L, H) {
          m.push(H);
        }), u(m);
      }, h.prototype.values = function() {
        var m = [];
        return this.forEach(function(L) {
          m.push(L);
        }), u(m);
      }, h.prototype.entries = function() {
        var m = [];
        return this.forEach(function(L, H) {
          m.push([H, L]);
        }), u(m);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function l(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function g(m) {
        return new Promise(function(L, H) {
          m.onload = function() {
            L(m.result);
          }, m.onerror = function() {
            H(m.error);
          };
        });
      }
      function f(m) {
        var L = new FileReader(), H = g(L);
        return L.readAsArrayBuffer(m), H;
      }
      function y(m) {
        var L = new FileReader(), H = g(L), q = /charset=([A-Za-z0-9_-]+)/.exec(m.type), Y = q ? q[1] : "utf-8";
        return L.readAsText(m, Y), H;
      }
      function w(m) {
        for (var L = new Uint8Array(m), H = new Array(L.length), q = 0; q < L.length; q++)
          H[q] = String.fromCharCode(L[q]);
        return H.join("");
      }
      function $(m) {
        if (m.slice)
          return m.slice(0);
        var L = new Uint8Array(m.byteLength);
        return L.set(new Uint8Array(m)), L.buffer;
      }
      function T() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = $(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || o(m)) ? this._bodyArrayBuffer = $(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = l(this);
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
            var m = l(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(f);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var m = l(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return y(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(w(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(A);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function x(m) {
        var L = m.toUpperCase();
        return _.indexOf(L) > -1 ? L : m;
      }
      function I(m, L) {
        if (!(this instanceof I))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        L = L || {};
        var H = L.body;
        if (m instanceof I) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, L.headers || (this.headers = new h(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !H && m._bodyInit != null && (H = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = L.credentials || this.credentials || "same-origin", (L.headers || !this.headers) && (this.headers = new h(L.headers)), this.method = x(L.method || this.method || "GET"), this.mode = L.mode || this.mode || null, this.signal = L.signal || this.signal || function() {
          if ("AbortController" in n) {
            var j = new AbortController();
            return j.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && H)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(H), (this.method === "GET" || this.method === "HEAD") && (L.cache === "no-store" || L.cache === "no-cache")) {
          var q = /([?&])_=[^&]*/;
          if (q.test(this.url))
            this.url = this.url.replace(q, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Y = /\?/;
            this.url += (Y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      I.prototype.clone = function() {
        return new I(this, { body: this._bodyInit });
      };
      function A(m) {
        var L = new FormData();
        return m.trim().split("&").forEach(function(H) {
          if (H) {
            var q = H.split("="), Y = q.shift().replace(/\+/g, " "), j = q.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(Y), decodeURIComponent(j));
          }
        }), L;
      }
      function N(m) {
        var L = new h(), H = m.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(q) {
          return q.indexOf(`
`) === 0 ? q.substr(1, q.length) : q;
        }).forEach(function(q) {
          var Y = q.split(":"), j = Y.shift().trim();
          if (j) {
            var Qt = Y.join(":").trim();
            try {
              L.append(j, Qt);
            } catch (Rt) {
              console.warn("Response " + Rt.message);
            }
          }
        }), L;
      }
      T.call(I.prototype);
      function G(m, L) {
        if (!(this instanceof G))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (L || (L = {}), this.type = "default", this.status = L.status === void 0 ? 200 : L.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = L.statusText === void 0 ? "" : "" + L.statusText, this.headers = new h(L.headers), this.url = L.url || "", this._initBody(m);
      }
      T.call(G.prototype), G.prototype.clone = function() {
        return new G(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, G.error = function() {
        var m = new G(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var P = [301, 302, 303, 307, 308];
      G.redirect = function(m, L) {
        if (P.indexOf(L) === -1)
          throw new RangeError("Invalid status code");
        return new G(null, { status: L, headers: { location: m } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(L, H) {
          this.message = L, this.name = H;
          var q = Error(L);
          this.stack = q.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function z(m, L) {
        return new Promise(function(H, q) {
          var Y = new I(m, L);
          if (Y.signal && Y.signal.aborted)
            return q(new e.DOMException("Aborted", "AbortError"));
          var j = new XMLHttpRequest();
          function Qt() {
            j.abort();
          }
          j.onload = function() {
            var S = {
              statusText: j.statusText,
              headers: N(j.getAllResponseHeaders() || "")
            };
            Y.url.indexOf("file://") === 0 && (j.status < 200 || j.status > 599) ? S.status = 200 : S.status = j.status, S.url = "responseURL" in j ? j.responseURL : S.headers.get("X-Request-URL");
            var M = "response" in j ? j.response : j.responseText;
            setTimeout(function() {
              H(new G(M, S));
            }, 0);
          }, j.onerror = function() {
            setTimeout(function() {
              q(new TypeError("Network request failed"));
            }, 0);
          }, j.ontimeout = function() {
            setTimeout(function() {
              q(new TypeError("Network request timed out"));
            }, 0);
          }, j.onabort = function() {
            setTimeout(function() {
              q(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Rt(S) {
            try {
              return S === "" && n.location.href ? n.location.href : S;
            } catch {
              return S;
            }
          }
          if (j.open(Y.method, Rt(Y.url), !0), Y.credentials === "include" ? j.withCredentials = !0 : Y.credentials === "omit" && (j.withCredentials = !1), "responseType" in j && (r.blob ? j.responseType = "blob" : r.arrayBuffer && (j.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof h || n.Headers && L.headers instanceof n.Headers)) {
            var Jt = [];
            Object.getOwnPropertyNames(L.headers).forEach(function(S) {
              Jt.push(a(S)), j.setRequestHeader(S, c(L.headers[S]));
            }), Y.headers.forEach(function(S, M) {
              Jt.indexOf(M) === -1 && j.setRequestHeader(M, S);
            });
          } else
            Y.headers.forEach(function(S, M) {
              j.setRequestHeader(M, S);
            });
          Y.signal && (Y.signal.addEventListener("abort", Qt), j.onreadystatechange = function() {
            j.readyState === 4 && Y.signal.removeEventListener("abort", Qt);
          }), j.send(typeof Y._bodyInit > "u" ? null : Y._bodyInit);
        });
      }
      return z.polyfill = !0, n.fetch || (n.fetch = z, n.Headers = h, n.Request = I, n.Response = G), e.Headers = h, e.Request = I, e.Response = G, e.fetch = z, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : re);
})();
const ly = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function uy(t, e) {
  const n = {};
  return Object.assign(n, ly, e), await fetch(t, n);
}
function fy(t) {
  let e = uy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function hy(...t) {
  const { fetchLib: e, middlewares: n } = fy(t);
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
var gs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(gs || (gs = {}));
var $r;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})($r || ($r = {}));
var gu;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(gu || (gu = {}));
const dy = "https://api.mainnet.hiro.so", py = "https://api.testnet.hiro.so", gy = "http://localhost:3999", yy = ["mainnet", "testnet", "devnet", "mocknet"];
let ys = class {
  constructor(e) {
    this.version = $r.Mainnet, this.chainId = gs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === $r.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? hy();
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
ys.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Dh();
    case "testnet":
      return new wy();
    case "devnet":
      return new by();
    case "mocknet":
      return new Fh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${yy.join(", ")}`);
  }
};
ys.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ys.fromName(t);
let Dh = class extends ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? dy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $r.Mainnet, this.chainId = gs.Mainnet;
  }
}, wy = class extends ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? py,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $r.Testnet, this.chainId = gs.Testnet;
  }
}, Fh = class extends ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $r.Testnet, this.chainId = gs.Testnet;
  }
};
const by = Fh, jh = "xtrata.wallet.bridge.v1", xy = (t) => typeof t == "object" && t !== null && t.protocol === jh, my = (t) => xy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Sy = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class zs extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const yu = 12e4;
class Ey {
  constructor(e) {
    js(this, "pending", /* @__PURE__ */ new Map());
    js(this, "listenTarget");
    js(this, "closed", !1);
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
    js(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !my(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new zs("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new zs("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new zs("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Sy(), i = { protocol: jh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new zs(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? yu}ms.`
          )
        );
      }, this.options.timeoutMs ?? yu);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new zs("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Ay = ["SP", "SM"], $y = ["ST", "SN"], vy = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Ay.includes(n) ? "mainnet" : $y.includes(n) ? "testnet" : null;
}, Iy = () => {
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
}, Ly = () => typeof window > "u" || !window.localStorage ? Iy() : window.localStorage, ya = "xtrata.v15.1.wallet.session", wu = "mainnet", lo = { isConnected: !1 }, Cy = (t) => t.address ? vy(t.address) ?? t.network : t.network, zh = (t) => !t.isConnected || !t.address ? { ...lo } : Cy(t) !== wu ? { ...lo } : {
  isConnected: !0,
  address: t.address,
  network: wu,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, ky = (t) => {
  if (!t)
    return { ...lo };
  try {
    const e = JSON.parse(t);
    return zh(e);
  } catch {
    return { ...lo };
  }
}, By = (t) => {
  const e = zh(t);
  return JSON.stringify(e);
}, My = (t) => {
  const e = Ly();
  return {
    load: () => ky(e.getItem(ya)),
    save: (n) => {
      e.setItem(ya, By(n));
    },
    clear: () => {
      e.removeItem(ya);
    }
  };
}, Ty = "https://browser.blockstack.org/auth", _y = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Rh = ["store_write"], Uy = "blockstack-session", Hy = {
  logLevel: "debug"
}, jr = {
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
Object.freeze(jr);
class _s extends Error {
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
class Ny extends _s {
  constructor(e, n = "") {
    super({ code: jr.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class bu extends _s {
  constructor(e = "") {
    super({ code: jr.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Ii extends _s {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: jr.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class xu extends _s {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: jr.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ja extends _s {
  constructor(e) {
    super({ code: jr.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Gh extends _s {
  constructor(e) {
    super({ code: jr.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const mu = ["debug", "info", "warn", "error", "none"], za = {};
for (let t = 0; t < mu.length; t++) {
  const e = mu[t];
  za[e] = t;
}
class cs {
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
    return za[Hy.logLevel] <= za[e];
  }
}
function Py() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Oy() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function wa(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Dy() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Fy() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function jy(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function qc(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Fy(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    cs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = jy(s, t.toString(), n);
    throw cs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function ir(t, e) {
  return Wc(Zt(t), e);
}
function Zt(t) {
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
  if (fe(t, Uint8Array))
    return BigInt(`0x${Z(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function zy(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Su(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function di(t, e = 8) {
  return (typeof t == "bigint" ? t : Zt(t)).toString(16).padStart(e * 2, "0");
}
function Oo(t) {
  return parseInt(t, 16);
}
function Wc(t, e = 16) {
  const n = di(t, e);
  return pt(n);
}
function Ry(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Gy(t, e) {
  return t & BigInt(1) << e;
}
function Ra(t) {
  return Vy(BigInt(`0x${Z(t)}`), BigInt(t.byteLength * 8));
}
function Vy(t, e) {
  return Gy(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Ky = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Z(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Ky[n];
  return e;
}
function pt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = zy(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function zr(t) {
  return new TextEncoder().encode(t);
}
function pi(t) {
  return new TextDecoder().decode(t);
}
function qy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Wy(t) {
  return String.fromCharCode.apply(null, t);
}
function Xy(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Eu(t) {
  if (t.some(Xy))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function tn(...t) {
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
function Ot(t) {
  return tn(...t.map((e) => typeof e == "number" ? Eu([e]) : e instanceof Array ? Eu(e) : e));
}
function fe(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Vh = "https://api.mainnet.hiro.so", Kh = "https://api.testnet.hiro.so", qh = "http://localhost:3999", Yy = "https://hub.blockstack.org", Zy = 33, ba = 32;
function Qy(t) {
  if (t.length < ba * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ba * 2), r = t.slice(2 + ba * 2);
  return {
    recoveryId: Oo(e),
    r: n,
    s: r
  };
}
function Xc(t) {
  const e = typeof t == "string" ? pt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Jy(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function tw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function ew(t, e) {
  return t[e];
}
function nw(t, e, n = 0) {
  return t[n] = e, t;
}
function rw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function vr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const sw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function iw(t, e) {
  const n = {};
  return Object.assign(n, sw, e), await fetch(t, n);
}
function ow(t) {
  let e = iw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function aw(...t) {
  const { fetchLib: e, middlewares: n } = ow(t);
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
class Wh {
  constructor(e = Rh.slice(), n = ((a) => (a = qc("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Ty) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ga(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function cw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Xh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function lw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ga(t.outputLen), Ga(t.blockLen);
}
function uw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function fw(t, e) {
  Xh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const gr = {
  number: Ga,
  bool: cw,
  bytes: Xh,
  hash: lw,
  exists: uw,
  output: fw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ge = (t, e) => t << 32 - e | t >>> e, hw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!hw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yc(t) {
  if (typeof t == "string" && (t = dw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Yh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Rr(t) {
  const e = (r) => t().update(Yc(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Zh = class extends Yh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, gr.hash(e);
    const r = Yc(n);
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
    return gr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    gr.exists(this), gr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Do = (t, e, n) => new Zh(t, e).update(n).digest();
Do.create = (t, e) => new Zh(t, e);
function pw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Zc = class extends Yh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = xa(this.buffer);
  }
  update(e) {
    gr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Yc(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = xa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    gr.exists(this), gr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    pw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = xa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const gw = (t, e, n) => t & e ^ ~t & n, yw = (t, e, n) => t & e ^ t & n ^ e & n, ww = new Uint32Array([
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
]), Cn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), kn = new Uint32Array(64);
let Qh = class extends Zc {
  constructor() {
    super(64, 32, 8, !1), this.A = Cn[0] | 0, this.B = Cn[1] | 0, this.C = Cn[2] | 0, this.D = Cn[3] | 0, this.E = Cn[4] | 0, this.F = Cn[5] | 0, this.G = Cn[6] | 0, this.H = Cn[7] | 0;
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
      kn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = kn[l - 15], f = kn[l - 2], y = Ge(g, 7) ^ Ge(g, 18) ^ g >>> 3, w = Ge(f, 17) ^ Ge(f, 19) ^ f >>> 10;
      kn[l] = w + kn[l - 7] + y + kn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ge(a, 6) ^ Ge(a, 11) ^ Ge(a, 25), f = h + g + gw(a, c, u) + ww[l] + kn[l] | 0, w = (Ge(r, 2) ^ Ge(r, 13) ^ Ge(r, 22)) + yw(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    kn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, bw = class extends Qh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ws = Rr(() => new Qh());
Rr(() => new bw());
const xw = {}, Jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const dt = BigInt(0), Bt = BigInt(1), er = BigInt(2), qs = BigInt(3), Au = BigInt(8), St = Object.freeze({
  a: dt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Bt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), $u = (t, e) => (t + e / er) / e, Li = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = St, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Bt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = $u(i * t, e), c = $u(-r * t, e);
    let u = O(t - a * n - c * s, e), h = O(-a * r - c * i, e);
    const l = u > o, g = h > o;
    if (l && (u = e - u), g && (h = e - h), u > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: h };
  }
}, Ne = 32, Ir = 32, td = 32, uo = Ne + 1, fo = 2 * Ne + 1;
function vu(t) {
  const { a: e, b: n } = St, r = O(t * t), s = O(r * t);
  return O(s + e * t + n);
}
const Ci = St.a === dt;
class Qc extends Error {
  constructor(e) {
    super(e);
  }
}
function Iu(t) {
  if (!(t instanceof wt))
    throw new TypeError("JacobianPoint expected");
}
class wt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof ot))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(ot.ZERO) ? wt.ZERO : new wt(e.x, e.y, Bt);
  }
  static toAffineBatch(e) {
    const n = $w(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return wt.toAffineBatch(e).map(wt.fromAffine);
  }
  equals(e) {
    Iu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = O(s * s), u = O(a * a), h = O(n * u), l = O(i * c), g = O(O(r * a) * u), f = O(O(o * s) * c);
    return h === l && g === f;
  }
  negate() {
    return new wt(this.x, O(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = O(e * e), i = O(n * n), o = O(i * i), a = e + i, c = O(er * (O(a * a) - s - o)), u = O(qs * s), h = O(u * u), l = O(h - er * c), g = O(u * (c - l) - Au * o), f = O(er * n * r);
    return new wt(l, g, f);
  }
  add(e) {
    Iu(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === dt || o === dt)
      return this;
    if (n === dt || r === dt)
      return e;
    const c = O(s * s), u = O(a * a), h = O(n * u), l = O(i * c), g = O(O(r * a) * u), f = O(O(o * s) * c), y = O(l - h), w = O(f - g);
    if (y === dt)
      return w === dt ? this.double() : wt.ZERO;
    const $ = O(y * y), T = O(y * $), _ = O(h * $), x = O(w * w - T - er * _), I = O(w * (_ - x) - g * T), A = O(s * a * y);
    return new wt(x, I, A);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = wt.ZERO;
    if (typeof e == "bigint" && e === dt)
      return n;
    let r = ku(e);
    if (r === Bt)
      return this;
    if (!Ci) {
      let l = n, g = this;
      for (; r > dt; )
        r & Bt && (l = l.add(g)), g = g.double(), r >>= Bt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Li.splitScalar(r), c = n, u = n, h = this;
    for (; i > dt || a > dt; )
      i & Bt && (c = c.add(h)), a & Bt && (u = u.add(h)), h = h.double(), i >>= Bt, a >>= Bt;
    return s && (c = c.negate()), o && (u = u.negate()), u = new wt(O(u.x * Li.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ci ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(wt.BASE) && (n = ot.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Va.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = wt.normalizeZ(s), Va.set(n, s)));
    let i = wt.ZERO, o = wt.BASE;
    const a = 1 + (Ci ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const f = g * c;
      let y = Number(e & u);
      e >>= l, y > c && (y -= h, e += Bt);
      const w = f, $ = f + Math.abs(y) - 1, T = g % 2 !== 0, _ = y < 0;
      y === 0 ? o = o.add(ki(T, s[w])) : i = i.add(ki(_, s[$]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = ku(e), s, i;
    if (Ci) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Li.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: g, f } = this.wNAF(u, n);
      h = ki(o, h), g = ki(c, g), g = new wt(O(g.x * Li.beta), g.y, g.z), s = h.add(g), i = l.add(f);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return wt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(wt.ZERO);
    e == null && (e = i ? Au : Us(s));
    const o = e, a = O(o * o), c = O(a * o), u = O(n * a), h = O(r * c), l = O(s * o);
    if (i)
      return ot.ZERO;
    if (l !== Bt)
      throw new Error("invZ was invalid");
    return new ot(u, h);
  }
}
wt.BASE = new wt(St.Gx, St.Gy, Bt);
wt.ZERO = new wt(dt, Bt, dt);
function ki(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Va = /* @__PURE__ */ new WeakMap();
class ot {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Va.delete(this);
  }
  hasEvenY() {
    return this.y % er === dt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = xe(n ? e : e.subarray(1));
    if (!eo(r))
      throw new Error("Point is not on curve");
    const s = vu(r);
    let i = Aw(s);
    const o = (i & Bt) === Bt;
    n ? o && (i = O(-i)) : (e[0] & 1) === 1 !== o && (i = O(-i));
    const a = new ot(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = xe(e.subarray(1, Ne + 1)), r = xe(e.subarray(Ne + 1, Ne * 2 + 1)), s = new ot(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = en(e), r = n.length, s = n[0];
    if (r === Ne)
      return this.fromCompressedHex(n);
    if (r === uo && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === fo && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${uo} compressed bytes or ${fo} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return ot.BASE.multiply(Lr(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = rd(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Jc(en(e)), { n: a } = St, c = r === 2 || r === 3 ? s + a : s, u = Us(c, a), h = O(-o * u, a), l = O(i * u, a), g = r & 1 ? "03" : "02", f = ot.fromHex(g + nr(c)), y = ot.BASE.multiplyAndAddUnsafe(f, h, l);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return rr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = nr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${nr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!eo(n) || !eo(r))
      throw new Error(e);
    const s = O(r * r), i = vu(n);
    if (O(s - i) !== dt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new ot(this.x, O(-this.y));
  }
  double() {
    return wt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return wt.fromAffine(this).add(wt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return wt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = wt.fromAffine(this), i = n === dt || n === Bt || this !== ot.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = wt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(wt.ZERO) ? void 0 : a.toAffine();
  }
}
ot.BASE = new ot(St.Gx, St.Gy);
ot.ZERO = new ot(dt, dt);
function Lu(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Cu(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${bs(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: xe(n), left: t.subarray(e + 2) };
}
function mw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${bs(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Cu(t.subarray(2)), { data: r, left: s } = Cu(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${bs(s)}`);
  return { r: e, s: r };
}
class be {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? bs(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new be(ho(s.slice(0, 64)), ho(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = mw(n ? e : rr(e));
    return new be(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ms(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ms(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = St.n >> Bt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new be(this.r, O(-this.s, St.n)) : this;
  }
  toDERRawBytes() {
    return rr(this.toDERHex());
  }
  toDERHex() {
    const e = Lu(Rs(this.s)), n = Lu(Rs(this.r)), r = e.length / 2, s = n.length / 2, i = Rs(r), o = Rs(s);
    return `30${Rs(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return rr(this.toCompactHex());
  }
  toCompactHex() {
    return nr(this.r) + nr(this.s);
  }
}
function Jn(...t) {
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
const Sw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bs(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Sw[t[n]];
  return e;
}
const Ew = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function nr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(dt <= t && t < Ew))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function xs(t) {
  const e = rr(nr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Rs(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ho(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function rr(t) {
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
function xe(t) {
  return ho(bs(t));
}
function en(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : rr(t);
}
function ku(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ms(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function O(t, e = St.P) {
  const n = t % e;
  return n >= dt ? n : e + n;
}
function Ae(t, e) {
  const { P: n } = St;
  let r = t;
  for (; e-- > dt; )
    r *= r, r %= n;
  return r;
}
function Aw(t) {
  const { P: e } = St, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = Ae(u, qs) * u % e, l = Ae(h, qs) * u % e, g = Ae(l, er) * c % e, f = Ae(g, r) * g % e, y = Ae(f, s) * f % e, w = Ae(y, o) * y % e, $ = Ae(w, a) * w % e, T = Ae($, o) * y % e, _ = Ae(T, qs) * u % e, x = Ae(_, i) * f % e, I = Ae(x, n) * c % e, A = Ae(I, er);
  if (A * A % e !== t)
    throw new Error("Cannot find square root");
  return A;
}
function Us(t, e = St.P) {
  if (t === dt || e <= dt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = O(t, e), r = e, s = dt, i = Bt;
  for (; n !== dt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== Bt)
    throw new Error("invert: does not exist");
  return O(s, e);
}
function $w(t, e = St.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === dt ? i : (n[a] = i, O(i * o, e)), Bt), s = Us(r, e);
  return t.reduceRight((i, o, a) => o === dt ? i : (n[a] = O(i * n[a], e), O(i * o, e)), s), n;
}
function vw(t) {
  const e = t.length * 8 - Ir * 8, n = xe(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Jc(t, e = !1) {
  const n = vw(t);
  if (e)
    return n;
  const { n: r } = St;
  return n >= r ? n - r : n;
}
let ds, Ws;
class ed {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Nt.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ws(this.k, ...e);
  }
  checkSync() {
    if (typeof Ws != "function")
      throw new Qc("hmacSha256Sync needs to be set");
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
    return Jn(...n);
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
    return Jn(...n);
  }
}
function ms(t) {
  return dt < t && t < St.n;
}
function eo(t) {
  return dt < t && t < St.P;
}
function nd(t, e, n, r = !0) {
  const { n: s } = St, i = Jc(t, !0);
  if (!ms(i))
    return;
  const o = Us(i, s), a = ot.BASE.multiply(i), c = O(a.x, s);
  if (c === dt)
    return;
  const u = O(o * O(e + n * c, s), s);
  if (u === dt)
    return;
  let h = new be(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & Bt);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function Lr(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ir)
      throw new Error("Expected 32 bytes of private key");
    e = ho(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ir)
      throw new Error("Expected 32 bytes of private key");
    e = xe(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ms(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function tl(t) {
  return t instanceof ot ? (t.assertValidity(), t) : ot.fromHex(t);
}
function rd(t) {
  if (t instanceof be)
    return t.assertValidity(), t;
  try {
    return be.fromDER(t);
  } catch {
    return be.fromCompact(t);
  }
}
function gi(t, e = !1) {
  return ot.fromPrivateKey(t).toRawBytes(e);
}
function Iw(t, e, n, r = !1) {
  return ot.fromSignature(t, e, n).toRawBytes(r);
}
function Bu(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === uo || r === fo : n ? r === uo * 2 || r === fo * 2 : t instanceof ot;
}
function el(t, e, n = !1) {
  if (Bu(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Bu(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = tl(e);
  return r.assertValidity(), r.multiply(Lr(t)).toRawBytes(n);
}
function sd(t) {
  const e = t.length > Ne ? t.slice(0, Ne) : t;
  return xe(e);
}
function Lw(t) {
  const e = sd(t), n = O(e, St.n);
  return id(n < dt ? e : n);
}
function id(t) {
  return xs(t);
}
function od(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = en(t), s = Lr(e), i = [id(s), Lw(r)];
  if (n != null) {
    n === !0 && (n = Nt.randomBytes(Ne));
    const c = en(n);
    if (c.length !== Ne)
      throw new Error(`sign: Expected ${Ne} bytes of extra data`);
    i.push(c);
  }
  const o = Jn(...i), a = sd(r);
  return { seed: o, m: a, d: s };
}
function ad(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Cw(t, e, n = {}) {
  const { seed: r, m: s, d: i } = od(t, e, n.extraEntropy), o = new ed(td, Ir);
  await o.reseed(r);
  let a;
  for (; !(a = nd(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return ad(a, n);
}
function Fo(t, e, n = {}) {
  const { seed: r, m: s, d: i } = od(t, e, n.extraEntropy), o = new ed(td, Ir);
  o.reseedSync(r);
  let a;
  for (; !(a = nd(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return ad(a, n);
}
const kw = { strict: !0 };
function Bw(t, e, n, r = kw) {
  let s;
  try {
    s = rd(t), e = en(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Jc(e);
  let c;
  try {
    c = tl(n);
  } catch {
    return !1;
  }
  const { n: u } = St, h = Us(o, u), l = O(a * h, u), g = O(i * h, u), f = ot.BASE.multiplyAndAddUnsafe(c, l, g);
  return f ? O(f.x, u) === i : !1;
}
function po(t) {
  return O(xe(t), St.n);
}
class Ss {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = en(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = xe(n.subarray(0, 32)), s = xe(n.subarray(32, 64));
    return new Ss(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!eo(e) || !ms(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return nr(this.r) + nr(this.s);
  }
  toRawBytes() {
    return rr(this.toHex());
  }
}
function Mw(t) {
  return ot.fromPrivateKey(t).toRawX();
}
class cd {
  constructor(e, n, r = Nt.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = en(e);
    const { x: s, scalar: i } = this.getScalar(Lr(n));
    if (this.px = s, this.d = i, this.rand = en(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = ot.fromPrivateKey(e), r = n.hasEvenY() ? e : St.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return xs(e ^ xe(n));
  }
  finalizeNonce(e) {
    const n = O(xe(e), St.n);
    if (n === dt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ss(e.x, O(n + r * s, St.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Nt.taggedHash, o = this.initNonce(n, await i(Qn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(Qn.nonce, o, r, e)), h = po(await i(Qn.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await fd(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Nt.taggedHashSync, o = this.initNonce(n, i(Qn.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(Qn.nonce, o, r, e)), h = po(i(Qn.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return hd(l, e, r) || this.error(), l;
  }
}
async function Tw(t, e, n) {
  return new cd(t, e, n).calc();
}
function _w(t, e, n) {
  return new cd(t, e, n).calcSync();
}
function ld(t, e, n) {
  const r = t instanceof Ss, s = r ? t : Ss.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: en(e),
    P: tl(n)
  };
}
function ud(t, e, n, r) {
  const s = ot.BASE.multiplyAndAddUnsafe(e, Lr(n), O(-r, St.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function fd(t, e, n) {
  try {
    const { r, s, m: i, P: o } = ld(t, e, n), a = po(await Nt.taggedHash(Qn.challenge, xs(r), o.toRawX(), i));
    return ud(r, o, s, a);
  } catch {
    return !1;
  }
}
function hd(t, e, n) {
  try {
    const { r, s, m: i, P: o } = ld(t, e, n), a = po(Nt.taggedHashSync(Qn.challenge, xs(r), o.toRawX(), i));
    return ud(r, o, s, a);
  } catch (r) {
    if (r instanceof Qc)
      throw r;
    return !1;
  }
}
const Uw = {
  Signature: Ss,
  getPublicKey: Mw,
  sign: Tw,
  verify: fd,
  signSync: _w,
  verifySync: hd
};
ot.BASE._setWindowSize(8);
const de = {
  node: Jh,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Qn = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Bi = {}, Nt = {
  bytesToHex: bs,
  hexToBytes: rr,
  concatBytes: Jn,
  mod: O,
  invert: Us,
  isValidPrivateKey(t) {
    try {
      return Lr(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: xs,
  _normalizePrivateKey: Lr,
  hashToPrivateKey: (t) => {
    t = en(t);
    const e = Ir + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = O(xe(t), St.n - Bt) + Bt;
    return xs(n);
  },
  randomBytes: (t = 32) => {
    if (de.web)
      return de.web.getRandomValues(new Uint8Array(t));
    if (de.node) {
      const { randomBytes: e } = de.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Nt.hashToPrivateKey(Nt.randomBytes(Ir + 8)),
  precompute(t = 8, e = ot.BASE) {
    const n = e === ot.BASE ? e : new ot(e.x, e.y);
    return n._setWindowSize(t), n.multiply(qs), n;
  },
  sha256: async (...t) => {
    if (de.web) {
      const e = await de.web.subtle.digest("SHA-256", Jn(...t));
      return new Uint8Array(e);
    } else if (de.node) {
      const { createHash: e } = de.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (de.web) {
      const n = await de.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Jn(...e), s = await de.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (de.node) {
      const { createHmac: n } = de.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Bi[t];
    if (n === void 0) {
      const r = await Nt.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Jn(r, r), Bi[t] = n;
    }
    return Nt.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ds != "function")
      throw new Qc("sha256Sync is undefined, you need to set it");
    let n = Bi[t];
    if (n === void 0) {
      const r = ds(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Jn(r, r), Bi[t] = n;
    }
    return ds(n, ...e);
  },
  _JacobianPoint: wt
};
Object.defineProperties(Nt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ds;
    },
    set(t) {
      ds || (ds = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ws;
    },
    set(t) {
      Ws || (Ws = t);
    }
  }
});
const Hw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: St,
  Point: ot,
  Signature: be,
  getPublicKey: gi,
  getSharedSecret: el,
  recoverPublicKey: Iw,
  schnorr: Uw,
  sign: Cw,
  signSync: Fo,
  utils: Nt,
  verify: Bw
}, Symbol.toStringTag, { value: "Module" }));
var yi = {};
yi.byteLength = Fw;
var Nw = yi.toByteArray = zw, Pw = yi.fromByteArray = Vw, Xe = [], ve = [], Ow = typeof Uint8Array < "u" ? Uint8Array : Array, ma = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var rs = 0, Dw = ma.length; rs < Dw; ++rs)
  Xe[rs] = ma[rs], ve[ma.charCodeAt(rs)] = rs;
ve[45] = 62;
ve[95] = 63;
function dd(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Fw(t) {
  var e = dd(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function jw(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function zw(t) {
  var e, n = dd(t), r = n[0], s = n[1], i = new Ow(jw(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ve[t.charCodeAt(c)] << 18 | ve[t.charCodeAt(c + 1)] << 12 | ve[t.charCodeAt(c + 2)] << 6 | ve[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = ve[t.charCodeAt(c)] << 2 | ve[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = ve[t.charCodeAt(c)] << 10 | ve[t.charCodeAt(c + 1)] << 4 | ve[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Rw(t) {
  return Xe[t >> 18 & 63] + Xe[t >> 12 & 63] + Xe[t >> 6 & 63] + Xe[t & 63];
}
function Gw(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Rw(r));
  return s.join("");
}
function Vw(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Gw(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Xe[e >> 2] + Xe[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Xe[e >> 10] + Xe[e >> 4 & 63] + Xe[e << 2 & 63] + "="
  )), s.join("");
}
function Kw() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const qw = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Ww() {
  if (Kw())
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
    throw new Error(qw);
  }
}
class Xw {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(tn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(tn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Yw {
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
async function pd() {
  const t = await Ww();
  return t.name === "subtleCrypto" ? new Yw(t.lib) : new Xw(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Zw(t) {
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
  function h(f) {
    if (f instanceof Uint8Array || (ArrayBuffer.isView(f) ? f = new Uint8Array(f.buffer, f.byteOffset, f.byteLength) : Array.isArray(f) && (f = Uint8Array.from(f))), !(f instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (f.length === 0)
      return "";
    for (var y = 0, w = 0, $ = 0, T = f.length; $ !== T && f[$] === 0; )
      $++, y++;
    for (var _ = (T - $) * u + 1 >>> 0, x = new Uint8Array(_); $ !== T; ) {
      for (var I = f[$], A = 0, N = _ - 1; (I !== 0 || A < w) && N !== -1; N--, A++)
        I += 256 * x[N] >>> 0, x[N] = I % o >>> 0, I = I / o >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      w = A, $++;
    }
    for (var G = _ - w; G !== _ && x[G] === 0; )
      G++;
    for (var P = a.repeat(y); G < _; ++G)
      P += t.charAt(x[G]);
    return P;
  }
  function l(f) {
    if (typeof f != "string")
      throw new TypeError("Expected String");
    if (f.length === 0)
      return new Uint8Array();
    for (var y = 0, w = 0, $ = 0; f[y] === a; )
      w++, y++;
    for (var T = (f.length - y) * c + 1 >>> 0, _ = new Uint8Array(T); f[y]; ) {
      var x = f.charCodeAt(y);
      if (x > 255)
        return;
      var I = e[x];
      if (I === 255)
        return;
      for (var A = 0, N = T - 1; (I !== 0 || A < $) && N !== -1; N--, A++)
        I += o * _[N] >>> 0, _[N] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      $ = A, y++;
    }
    for (var G = T - $; G !== T && _[G] === 0; )
      G++;
    for (var P = new Uint8Array(w + (T - G)), z = w; G !== T; )
      P[z++] = _[G++];
    return P;
  }
  function g(f) {
    var y = l(f);
    if (y)
      return y;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: g
  };
}
var gd = Zw;
const Qw = gd, Jw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var t1 = Qw(Jw);
const e1 = /* @__PURE__ */ Oh(t1), n1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), yd = Uint8Array.from({ length: 16 }, (t, e) => e), r1 = yd.map((t) => (9 * t + 5) % 16);
let nl = [yd], rl = [r1];
for (let t = 0; t < 4; t++)
  for (let e of [nl, rl])
    e.push(e[t].map((n) => n1[n]));
const wd = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), s1 = nl.map((t, e) => t.map((n) => wd[e][n])), i1 = rl.map((t, e) => t.map((n) => wd[e][n])), o1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), a1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mi = (t, e) => t << e | t >>> 32 - e;
function Mu(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ti = new Uint32Array(16);
let c1 = class extends Zc {
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
    for (let f = 0; f < 16; f++, n += 4)
      Ti[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = o1[f], $ = a1[f], T = nl[f], _ = rl[f], x = s1[f], I = i1[f];
      for (let A = 0; A < 16; A++) {
        const N = Mi(r + Mu(f, i, a, u) + Ti[T[A]] + w, x[A]) + l | 0;
        r = l, l = u, u = Mi(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Mi(s + Mu(y, o, c, h) + Ti[_[A]] + $, I[A]) + g | 0;
        s = g, g = h, h = Mi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ti.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const l1 = Rr(() => new c1());
function u1(t) {
  return l1(t);
}
const _i = BigInt(2 ** 32 - 1), Ka = BigInt(32);
function bd(t, e = !1) {
  return e ? { h: Number(t & _i), l: Number(t >> Ka & _i) } : { h: Number(t >> Ka & _i) | 0, l: Number(t & _i) | 0 };
}
function f1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = bd(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const h1 = (t, e) => BigInt(t >>> 0) << Ka | BigInt(e >>> 0), d1 = (t, e, n) => t >>> n, p1 = (t, e, n) => t << 32 - n | e >>> n, g1 = (t, e, n) => t >>> n | e << 32 - n, y1 = (t, e, n) => t << 32 - n | e >>> n, w1 = (t, e, n) => t << 64 - n | e >>> n - 32, b1 = (t, e, n) => t >>> n - 32 | e << 64 - n, x1 = (t, e) => e, m1 = (t, e) => t, S1 = (t, e, n) => t << n | e >>> 32 - n, E1 = (t, e, n) => e << n | t >>> 32 - n, A1 = (t, e, n) => e << n - 32 | t >>> 64 - n, $1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function v1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const I1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), L1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, C1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), k1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, B1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), M1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, tt = {
  fromBig: bd,
  split: f1,
  toBig: h1,
  shrSH: d1,
  shrSL: p1,
  rotrSH: g1,
  rotrSL: y1,
  rotrBH: w1,
  rotrBL: b1,
  rotr32H: x1,
  rotr32L: m1,
  rotlSH: S1,
  rotlSL: E1,
  rotlBH: A1,
  rotlBL: $1,
  add: v1,
  add3L: I1,
  add3H: L1,
  add4L: C1,
  add4H: k1,
  add5H: M1,
  add5L: B1
}, [T1, _1] = tt.split([
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
].map((t) => BigInt(t))), Bn = new Uint32Array(80), Mn = new Uint32Array(80);
let jo = class extends Zc {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Bn[x] = e.getUint32(n), Mn[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Bn[x - 15] | 0, A = Mn[x - 15] | 0, N = tt.rotrSH(I, A, 1) ^ tt.rotrSH(I, A, 8) ^ tt.shrSH(I, A, 7), G = tt.rotrSL(I, A, 1) ^ tt.rotrSL(I, A, 8) ^ tt.shrSL(I, A, 7), P = Bn[x - 2] | 0, z = Mn[x - 2] | 0, m = tt.rotrSH(P, z, 19) ^ tt.rotrBH(P, z, 61) ^ tt.shrSH(P, z, 6), L = tt.rotrSL(P, z, 19) ^ tt.rotrBL(P, z, 61) ^ tt.shrSL(P, z, 6), H = tt.add4L(G, L, Mn[x - 7], Mn[x - 16]), q = tt.add4H(H, N, m, Bn[x - 7], Bn[x - 16]);
      Bn[x] = q | 0, Mn[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const I = tt.rotrSH(l, g, 14) ^ tt.rotrSH(l, g, 18) ^ tt.rotrBH(l, g, 41), A = tt.rotrSL(l, g, 14) ^ tt.rotrSL(l, g, 18) ^ tt.rotrBL(l, g, 41), N = l & f ^ ~l & w, G = g & y ^ ~g & $, P = tt.add5L(_, A, G, _1[x], Mn[x]), z = tt.add5H(P, T, I, N, T1[x], Bn[x]), m = P | 0, L = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), H = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = tt.add(u | 0, h | 0, z | 0, m | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = tt.add3L(m, H, Y);
      r = tt.add3H(j, z, L, q), s = j | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = tt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = tt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = tt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = tt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Bn.fill(0), Mn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, U1 = class extends jo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, H1 = class extends jo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, N1 = class extends jo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const P1 = Rr(() => new jo());
Rr(() => new U1());
Rr(() => new H1());
Rr(() => new N1());
function xd(t) {
  return ws(t);
}
function O1(t) {
  return P1(t);
}
const D1 = 0;
Nt.hmacSha256Sync = (t, ...e) => {
  const n = Do.create(ws, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function F1() {
  return Z(Nt.randomPrivateKey());
}
function j1(t) {
  const e = ws(ws(t));
  return e1.encode(tn(t, e).slice(0, t.length + 4));
}
function z1(t, e) {
  return j1(tn(new Uint8Array([t]), e.slice(0, 20)));
}
function md(t, e = D1) {
  const n = typeof t == "string" ? pt(t) : t, r = u1(xd(n));
  return z1(e, r);
}
function Sd(t) {
  const e = Xc(t);
  return Z(gi(e.slice(0, 32), !0));
}
Nt.hmacSha256Sync = (t, ...e) => {
  const n = Do.create(ws, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var go;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(go || (go = {}));
async function R1(t, e, n) {
  return await (await pd()).encrypt("aes-256-cbc", e, t, n);
}
async function G1(t, e, n) {
  return await (await pd()).decrypt("aes-256-cbc", e, t, n);
}
function Ed(t, e) {
  return Do(ws, t, e);
}
function V1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Ad(t) {
  const e = O1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function K1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function q1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: go.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: go.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !K1(t))
    return e;
  try {
    return ot.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function W1(t, e, n, r) {
  const s = q1(t);
  if (!s.result)
    throw s;
  const i = Nt.randomPrivateKey(), o = gi(i, !0);
  let a = el(i, t, !0);
  a = a.slice(1);
  const c = Ad(a), u = Nt.randomBytes(16), h = await R1(u, c.encryptionKey, e), l = tn(u, o, h), g = Ed(c.hmacKey, l);
  let f;
  if (!r || r === "hex")
    f = Z(h);
  else if (r === "base64")
    f = Pw(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const y = {
    iv: Z(u),
    ephemeralPK: Z(o),
    cipherText: f,
    mac: Z(g),
    wasString: n
  };
  return r && r !== "hex" && (y.cipherTextEncoding = r), y;
}
async function $d(t, e) {
  if (!e.ephemeralPK)
    throw new xu("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = el(t, n, !0);
  r = r.slice(1);
  const s = Ad(r), i = pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Nw(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = tn(i, pt(n), o), c = Ed(s.hmacKey, a), u = pt(e.mac);
  if (!V1(u, c))
    throw new xu("Decryption failed: failure in MAC check");
  const h = await G1(i, s.encryptionKey, o);
  return e.wasString ? pi(h) : h;
}
function X1(t, e) {
  const n = typeof e == "string" ? zr(e) : e, r = Sd(t), s = xd(n), i = Fo(s, t);
  return {
    signature: Z(i),
    publicKey: r
  };
}
async function Y1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Sd(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? zr(t) : t, o = await W1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = X1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Z1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return $d(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var qt = {}, Es = {}, ee = {};
Object.defineProperty(ee, "__esModule", { value: !0 });
ee.decode = ee.encode = ee.unescape = ee.escape = ee.pad = void 0;
const vd = yi;
function sl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ee.pad = sl;
function Id(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ee.escape = Id;
function Ld(t) {
  return sl(t).replace(/-/g, "+").replace(/_/g, "/");
}
ee.unescape = Ld;
function Q1(t) {
  return Id((0, vd.fromByteArray)(new TextEncoder().encode(t)));
}
ee.encode = Q1;
function J1(t) {
  return new TextDecoder().decode((0, vd.toByteArray)(sl(Ld(t))));
}
ee.decode = J1;
var zo = {}, Ro = {}, Cd = {}, kd = {}, Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
Go.crypto = void 0;
Go.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = h, t.createView = l, t.rotr = g, t.rotl = f, t.byteSwap = y, t.byteSwap32 = w, t.bytesToHex = _, t.hexToBytes = A, t.asyncLoop = G, t.utf8ToBytes = P, t.bytesToUtf8 = z, t.toBytes = m, t.kdfInputToBytes = L, t.concatBytes = H, t.checkOpts = q, t.createHasher = j, t.createOptHasher = Qt, t.createXOFer = Rt, t.randomBytes = Jt;
  const e = Go;
  function n(S) {
    return S instanceof Uint8Array || ArrayBuffer.isView(S) && S.constructor.name === "Uint8Array";
  }
  function r(S) {
    if (!Number.isSafeInteger(S) || S < 0)
      throw new Error("positive integer expected, got " + S);
  }
  function s(S, ...M) {
    if (!n(S))
      throw new Error("Uint8Array expected");
    if (M.length > 0 && !M.includes(S.length))
      throw new Error("Uint8Array expected of length " + M + ", got length=" + S.length);
  }
  function i(S) {
    if (typeof S != "function" || typeof S.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(S.outputLen), r(S.blockLen);
  }
  function o(S, M = !0) {
    if (S.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (M && S.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(S, M) {
    s(S);
    const Q = M.outputLen;
    if (S.length < Q)
      throw new Error("digestInto() expects output buffer of length at least " + Q);
  }
  function c(S) {
    return new Uint8Array(S.buffer, S.byteOffset, S.byteLength);
  }
  function u(S) {
    return new Uint32Array(S.buffer, S.byteOffset, Math.floor(S.byteLength / 4));
  }
  function h(...S) {
    for (let M = 0; M < S.length; M++)
      S[M].fill(0);
  }
  function l(S) {
    return new DataView(S.buffer, S.byteOffset, S.byteLength);
  }
  function g(S, M) {
    return S << 32 - M | S >>> M;
  }
  function f(S, M) {
    return S << M | S >>> 32 - M >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function y(S) {
    return S << 24 & 4278190080 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (S) => S : (S) => y(S), t.byteSwapIfBE = t.swap8IfBE;
  function w(S) {
    for (let M = 0; M < S.length; M++)
      S[M] = y(S[M]);
    return S;
  }
  t.swap32IfBE = t.isLE ? (S) => S : w;
  const $ = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", T = /* @__PURE__ */ Array.from({ length: 256 }, (S, M) => M.toString(16).padStart(2, "0"));
  function _(S) {
    if (s(S), $)
      return S.toHex();
    let M = "";
    for (let Q = 0; Q < S.length; Q++)
      M += T[S[Q]];
    return M;
  }
  const x = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function I(S) {
    if (S >= x._0 && S <= x._9)
      return S - x._0;
    if (S >= x.A && S <= x.F)
      return S - (x.A - 10);
    if (S >= x.a && S <= x.f)
      return S - (x.a - 10);
  }
  function A(S) {
    if (typeof S != "string")
      throw new Error("hex string expected, got " + typeof S);
    if ($)
      return Uint8Array.fromHex(S);
    const M = S.length, Q = M / 2;
    if (M % 2)
      throw new Error("hex string expected, got unpadded hex of length " + M);
    const gt = new Uint8Array(Q);
    for (let ut = 0, Et = 0; ut < Q; ut++, Et += 2) {
      const ie = I(S.charCodeAt(Et)), on = I(S.charCodeAt(Et + 1));
      if (ie === void 0 || on === void 0) {
        const En = S[Et] + S[Et + 1];
        throw new Error('hex string expected, got non-hex character "' + En + '" at index ' + Et);
      }
      gt[ut] = ie * 16 + on;
    }
    return gt;
  }
  const N = async () => {
  };
  t.nextTick = N;
  async function G(S, M, Q) {
    let gt = Date.now();
    for (let ut = 0; ut < S; ut++) {
      Q(ut);
      const Et = Date.now() - gt;
      Et >= 0 && Et < M || (await (0, t.nextTick)(), gt += Et);
    }
  }
  function P(S) {
    if (typeof S != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(S));
  }
  function z(S) {
    return new TextDecoder().decode(S);
  }
  function m(S) {
    return typeof S == "string" && (S = P(S)), s(S), S;
  }
  function L(S) {
    return typeof S == "string" && (S = P(S)), s(S), S;
  }
  function H(...S) {
    let M = 0;
    for (let gt = 0; gt < S.length; gt++) {
      const ut = S[gt];
      s(ut), M += ut.length;
    }
    const Q = new Uint8Array(M);
    for (let gt = 0, ut = 0; gt < S.length; gt++) {
      const Et = S[gt];
      Q.set(Et, ut), ut += Et.length;
    }
    return Q;
  }
  function q(S, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(S, M);
  }
  class Y {
  }
  t.Hash = Y;
  function j(S) {
    const M = (gt) => S().update(m(gt)).digest(), Q = S();
    return M.outputLen = Q.outputLen, M.blockLen = Q.blockLen, M.create = () => S(), M;
  }
  function Qt(S) {
    const M = (gt, ut) => S(ut).update(m(gt)).digest(), Q = S({});
    return M.outputLen = Q.outputLen, M.blockLen = Q.blockLen, M.create = (gt) => S(gt), M;
  }
  function Rt(S) {
    const M = (gt, ut) => S(ut).update(m(gt)).digest(), Q = S({});
    return M.outputLen = Q.outputLen, M.blockLen = Q.blockLen, M.create = (gt) => S(gt), M;
  }
  t.wrapConstructor = j, t.wrapConstructorWithOpts = Qt, t.wrapXOFConstructorWithOpts = Rt;
  function Jt(S = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(S));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(S));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(kd);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = kd;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = h, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(Cd);
const ss = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Bd(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function qa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Gr(t, ...e) {
  if (!Bd(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function tb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  qa(t.outputLen), qa(t.blockLen);
}
function Wa(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Md(t, e) {
  Gr(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function eb(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function nb(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function yo(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function no(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Me(t, e) {
  return t << 32 - e | t >>> e;
}
function rb(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const il = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function ol(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Td = il ? (t) => t : (t) => ol(t), sb = Td;
function _d(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = ol(t[e]);
  return t;
}
const ib = il ? (t) => t : _d, Ud = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", ob = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ab(t) {
  if (Gr(t), Ud)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ob[t[n]];
  return e;
}
const hn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Tu(t) {
  if (t >= hn._0 && t <= hn._9)
    return t - hn._0;
  if (t >= hn.A && t <= hn.F)
    return t - (hn.A - 10);
  if (t >= hn.a && t <= hn.f)
    return t - (hn.a - 10);
}
function cb(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Ud)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Tu(t.charCodeAt(i)), a = Tu(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Hd = async () => {
};
async function lb(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Hd(), r += i);
  }
}
function al(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ub(t) {
  return new TextDecoder().decode(t);
}
function wi(t) {
  return typeof t == "string" && (t = al(t)), Gr(t), t;
}
function fb(t) {
  return typeof t == "string" && (t = al(t)), Gr(t), t;
}
function hb(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Gr(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function db(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Nd = class {
};
function Vo(t) {
  const e = (r) => t().update(wi(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Pd(t) {
  const e = (r, s) => t(s).update(wi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Od(t) {
  const e = (r, s) => t(s).update(wi(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const pb = Vo, gb = Pd, yb = Od;
function wb(t = 32) {
  if (ss && typeof ss.getRandomValues == "function")
    return ss.getRandomValues(new Uint8Array(t));
  if (ss && typeof ss.randomBytes == "function")
    return Uint8Array.from(ss.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Nd,
  abytes: Gr,
  aexists: Wa,
  ahash: tb,
  anumber: qa,
  aoutput: Md,
  asyncLoop: lb,
  byteSwap: ol,
  byteSwap32: _d,
  byteSwapIfBE: sb,
  bytesToHex: ab,
  bytesToUtf8: ub,
  checkOpts: db,
  clean: yo,
  concatBytes: hb,
  createHasher: Vo,
  createOptHasher: Pd,
  createView: no,
  createXOFer: Od,
  hexToBytes: cb,
  isBytes: Bd,
  isLE: il,
  kdfInputToBytes: fb,
  nextTick: Hd,
  randomBytes: wb,
  rotl: rb,
  rotr: Me,
  swap32IfBE: ib,
  swap8IfBE: Td,
  toBytes: wi,
  u32: nb,
  u8: eb,
  utf8ToBytes: al,
  wrapConstructor: pb,
  wrapConstructorWithOpts: gb,
  wrapXOFConstructorWithOpts: yb
}, Symbol.toStringTag, { value: "Module" }));
function xb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function mb(t, e, n) {
  return t & e ^ ~t & n;
}
function Sb(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Eb extends Nd {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = no(this.buffer);
  }
  update(e) {
    Wa(this), e = wi(e), Gr(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = no(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Wa(this), Md(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, yo(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    xb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = no(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const Tn = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), _n = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Ab = /* @__PURE__ */ Uint32Array.from([
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
]), Un = /* @__PURE__ */ new Uint32Array(64);
let cl = class extends Eb {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Tn[0] | 0, this.B = Tn[1] | 0, this.C = Tn[2] | 0, this.D = Tn[3] | 0, this.E = Tn[4] | 0, this.F = Tn[5] | 0, this.G = Tn[6] | 0, this.H = Tn[7] | 0;
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
      Un[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Un[l - 15], f = Un[l - 2], y = Me(g, 7) ^ Me(g, 18) ^ g >>> 3, w = Me(f, 17) ^ Me(f, 19) ^ f >>> 10;
      Un[l] = w + Un[l - 7] + y + Un[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Me(a, 6) ^ Me(a, 11) ^ Me(a, 25), f = h + g + mb(a, c, u) + Ab[l] + Un[l] | 0, w = (Me(r, 2) ^ Me(r, 13) ^ Me(r, 22)) + Sb(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    yo(Un);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), yo(this.buffer);
  }
}, Dd = class extends cl {
  constructor() {
    super(28), this.A = _n[0] | 0, this.B = _n[1] | 0, this.C = _n[2] | 0, this.D = _n[3] | 0, this.E = _n[4] | 0, this.F = _n[5] | 0, this.G = _n[6] | 0, this.H = _n[7] | 0;
  }
};
const $b = /* @__PURE__ */ Vo(() => new cl()), vb = /* @__PURE__ */ Vo(() => new Dd()), Ib = cl, Lb = $b, Cb = Dd, kb = vb, Bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: Cb,
  SHA256: Ib,
  sha224: kb,
  sha256: Lb
}, Symbol.toStringTag, { value: "Module" })), Ko = /* @__PURE__ */ Po(Bb), Mb = /* @__PURE__ */ Po(Hw);
var As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
As.joseToDer = As.derToJose = void 0;
const Fd = yi, jd = ee;
function Sa(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Tb = {
  ES256: Sa(256),
  ES384: Sa(384),
  ES512: Sa(521)
};
function zd(t) {
  const e = Tb[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const wo = 128, Rd = 0, _b = 32, Ub = 16, Hb = 2, Gd = Ub | _b | Rd << 6, bo = Hb | Rd << 6;
function Vd(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Fd.toByteArray)((0, jd.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Nb(t, e) {
  const n = Vd(t), r = zd(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Gd)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (wo | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== bo)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== bo)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const l = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, f = r - h, y = new Uint8Array(g + c + f + h);
  for (o = 0; o < g; ++o)
    y[o] = 0;
  y.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const w = o; o < w + f; ++o)
    y[o] = 0;
  return y.set(n.subarray(l + Math.max(-f, 0), l + h), o), (0, jd.escape)((0, Fd.fromByteArray)(y));
}
As.derToJose = Nb;
function _u(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= wo && --r, r;
}
function Pb(t, e) {
  t = Vd(t);
  const n = zd(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = _u(t, 0, n), i = _u(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < wo, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Gd, u ? h[l++] = c : (h[l++] = wo | 1, h[l++] = c & 255), h[l++] = bo, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = bo, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
As.joseToDer = Pb;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.InvalidTokenError = xn.MissingParametersError = void 0;
class Ob extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
xn.MissingParametersError = Ob;
class Db extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
xn.InvalidTokenError = Db;
const bi = /* @__PURE__ */ Po(bb);
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.SECP256K1Client = void 0;
const Fb = Cd, jb = Ko, ro = Mb, Uu = As, Hu = xn, Nu = bi;
ro.utils.hmacSha256Sync = (t, ...e) => {
  const n = Fb.hmac.create(jb.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Kd {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Nu.bytesToHex)(ro.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Hu.MissingParametersError("a signing input hash and private key are all required");
    const s = ro.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Nu.bytesToHex)(s);
    if (r === "jose")
      return (0, Uu.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Uu.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Hu.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ro.verify(n, e, r, { strict: !1 });
  }
}
Ro.SECP256K1Client = Kd;
Kd.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ro;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(zo);
var Cr = {};
const zb = /* @__PURE__ */ Po(Jh);
var Rb = re && re.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function u(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.hashSha256Async = Cr.hashSha256 = void 0;
const Gb = Ko;
function qd(t) {
  return (0, Gb.sha256)(t);
}
Cr.hashSha256 = qd;
function Vb(t) {
  return Rb(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = zb;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(qd(t));
    }
  });
}
Cr.hashSha256Async = Vb;
var Kb = re && re.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function u(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.TokenSigner = Es.createUnsecuredToken = void 0;
const Xa = ee, Pu = zo, qb = xn, Ou = Cr;
function Ya(t, e) {
  const n = [], r = Xa.encode(JSON.stringify(e));
  n.push(r);
  const s = Xa.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Wb(t) {
  return Ya(t, { typ: "JWT", alg: "none" }) + ".";
}
Es.createUnsecuredToken = Wb;
class Xb {
  constructor(e, n) {
    if (!(e && n))
      throw new qb.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Pu.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Pu.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Ya(e, s), o = (0, Ou.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Kb(this, void 0, void 0, function* () {
      const s = this.header(r), i = Ya(e, s), o = yield (0, Ou.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Xa.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Es.TokenSigner = Xb;
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.TokenVerifier = void 0;
const Yb = ee, Du = zo, Zb = xn, Ui = Cr;
class Qb {
  constructor(e, n) {
    if (!(e && n))
      throw new Zb.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Du.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Du.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ui.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ui.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Yb.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ui.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ui.hashSha256)(r);
      return i(o);
    }
  }
}
qo.TokenVerifier = Qb;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
Wo.decodeToken = void 0;
const Hi = ee;
function Jb(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Hi.decode(e[0])), r = JSON.parse(Hi.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Hi.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Hi.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Wo.decodeToken = Jb;
(function(t) {
  var e = re && re.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = re && re.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Es, t), n(qo, t), n(Wo, t), n(xn, t), n(zo, t);
})(qt);
function t2(t) {
  return `did:btc-addr:${t}`;
}
function e2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new bu("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new bu('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Wd(t) {
  if (t)
    return e2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const n2 = "1.4.0";
function r2() {
  return F1();
}
function s2(t, e, n, r = Rh.slice(), s, i = Py().getTime(), o = {}) {
  const a = (f) => {
    const y = qc("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${f}=undefined])`
    });
    return y == null ? void 0 : y.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Dy(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: n2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = qt.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = md(u);
  return c.iss = t2(h), new qt.TokenSigner("ES256k", t).sign(c);
}
async function Fu(t, e) {
  const n = pi(pt(e)), r = JSON.parse(n), s = await $d(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function i2(t) {
  const e = qt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new qt.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function o2(t) {
  const e = qt.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Wd(e.iss);
  if (n.length === 1) {
    if (md(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function a2(t) {
  const e = qt.decodeToken(t).payload;
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
function c2(t) {
  const e = qt.decodeToken(t).payload;
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
function l2(t) {
  const e = [
    c2(t),
    a2(t),
    i2(t),
    o2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const ju = "1.0.0";
class sr {
  constructor(e) {
    this.version = ju, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== ju)
      throw new ja(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new sr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Xd {
  constructor(e) {
    if (e) {
      const n = new sr(e);
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
class zu extends Xd {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new sr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Gh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new sr({})), !0;
  }
}
class Ru extends Xd {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Uy, !localStorage.getItem(this.key)) {
      const r = new sr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Gh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return sr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new sr({})), !0;
  }
}
var ei;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ei || (ei = {}));
var xo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(xo || (xo = {}));
ei.Mainnet;
var wn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(wn || (wn = {}));
var Ze;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ze || (Ze = {}));
wn.Mainnet;
const Yd = {
  chainId: ei.Mainnet,
  transactionVersion: wn.Mainnet,
  peerNetworkId: xo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ze.MainnetSingleSig,
    multiSig: Ze.MainnetMultiSig
  },
  client: { baseUrl: Vh }
}, Za = {
  chainId: ei.Testnet,
  transactionVersion: wn.Testnet,
  peerNetworkId: xo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ze.TestnetSingleSig,
    multiSig: Ze.TestnetMultiSig
  },
  client: { baseUrl: Kh }
}, so = {
  ...Za,
  addressVersion: { ...Za.addressVersion },
  magicBytes: "id",
  client: { baseUrl: qh }
}, u2 = {
  ...so,
  addressVersion: { ...so.addressVersion },
  client: { ...so.client }
};
function f2(t) {
  switch (t) {
    case "mainnet":
      return Yd;
    case "testnet":
      return Za;
    case "devnet":
      return so;
    case "mocknet":
      return u2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Zd(t) {
  return typeof t == "string" ? f2(t) : t;
}
var Gu;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Gu || (Gu = {}));
var Vu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Vu || (Vu = {}));
var Te;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Te || (Te = {}));
const Ea = ["onChainOnly", "offChainOnly", "any"];
Ea[0] + "", Te.OnChainOnly, Ea[1] + "", Te.OffChainOnly, Ea[2] + "", Te.Any, Te.OnChainOnly + "", Te.OnChainOnly, Te.OffChainOnly + "", Te.OffChainOnly, Te.Any + "", Te.Any;
var Ku;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ku || (Ku = {}));
var qu;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(qu || (qu = {}));
var Wu;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Wu || (Wu = {}));
var gn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(gn || (gn = {}));
var Xu;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Xu || (Xu = {}));
var Yu;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Yu || (Yu = {}));
var Zu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Zu || (Zu = {}));
var Qu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Qu || (Qu = {}));
var Ju;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ju || (Ju = {}));
var tf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(tf || (tf = {}));
var ef;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ef || (ef = {}));
var nf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(nf || (nf = {}));
var rf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(rf || (rf = {}));
function Qa(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function h2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Qd(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function d2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Qa(t.outputLen), Qa(t.blockLen);
}
function p2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function g2(t, e) {
  Qd(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const yr = {
  number: Qa,
  bool: h2,
  bytes: Qd,
  hash: d2,
  exists: p2,
  output: g2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Aa = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ve = (t, e) => t << 32 - e | t >>> e, y2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!y2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function w2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ll(t) {
  if (typeof t == "string" && (t = w2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Jd = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Vr(t) {
  const e = (r) => t().update(ll(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let t0 = class extends Jd {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, yr.hash(e);
    const r = ll(n);
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
    return yr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    yr.exists(this), yr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const e0 = (t, e, n) => new t0(t, e).update(n).digest();
e0.create = (t, e) => new t0(t, e);
function b2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ul = class extends Jd {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Aa(this.buffer);
  }
  update(e) {
    yr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ll(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Aa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    yr.exists(this), yr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    b2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Aa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const x2 = (t, e, n) => t & e ^ ~t & n, m2 = (t, e, n) => t & e ^ t & n ^ e & n, S2 = new Uint32Array([
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
]), Hn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Nn = new Uint32Array(64);
let n0 = class extends ul {
  constructor() {
    super(64, 32, 8, !1), this.A = Hn[0] | 0, this.B = Hn[1] | 0, this.C = Hn[2] | 0, this.D = Hn[3] | 0, this.E = Hn[4] | 0, this.F = Hn[5] | 0, this.G = Hn[6] | 0, this.H = Hn[7] | 0;
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
      Nn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Nn[l - 15], f = Nn[l - 2], y = Ve(g, 7) ^ Ve(g, 18) ^ g >>> 3, w = Ve(f, 17) ^ Ve(f, 19) ^ f >>> 10;
      Nn[l] = w + Nn[l - 7] + y + Nn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ve(a, 6) ^ Ve(a, 11) ^ Ve(a, 25), f = h + g + x2(a, c, u) + S2[l] + Nn[l] | 0, w = (Ve(r, 2) ^ Ve(r, 13) ^ Ve(r, 22)) + m2(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Nn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, E2 = class extends n0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const r0 = Vr(() => new n0());
Vr(() => new E2());
var Kr = {}, fl = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = bi;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let f = o.length - 1; f >= 0; f--)
      if (u < 4) {
        const y = n.indexOf(o[f]) >> u;
        let w = 0;
        f !== 0 && (w = n.indexOf(o[f - 1]));
        const $ = 1 + u, T = w % (1 << $) << 5 - $, _ = t.c32[y + T];
        u = $, c.unshift(_);
      } else
        u = 0;
    let h = 0;
    for (let f = 0; f < c.length && c[f] === "0"; f++)
      h++;
    c = c.slice(h);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let f = 0; f < g; f++)
      c.unshift(t.c32[0]);
    if (a) {
      const f = a - c.length;
      for (let y = 0; y < f; y++)
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
    let h = [], l = 0, g = 0;
    for (let w = o.length - 1; w >= 0; w--) {
      g === 4 && (h.unshift(n[l]), g = 0, l = 0);
      const T = (t.c32.indexOf(o[w]) << g) + l, _ = n[T % 16];
      if (g += 1, l = T >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      h.unshift(_);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let f = 0;
    for (let w = 0; w < h.length && h[w] === "0"; w++)
      f++;
    h = h.slice(f - f % 2);
    let y = h.join("");
    for (let w = 0; w < u; w++)
      y = `00${y}`;
    if (a) {
      const w = a * 2 - y.length;
      for (let $ = 0; $ < w; $ += 2)
        y = `00${y}`;
    }
    return y;
  }
  t.c32decode = i;
})(fl);
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.c32checkDecode = kr.c32checkEncode = void 0;
const sf = Ko, of = bi, Xs = fl;
function s0(t) {
  const e = (0, sf.sha256)((0, sf.sha256)((0, of.hexToBytes)(t)));
  return (0, of.bytesToHex)(e.slice(0, 4));
}
function A2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = s0(`${n}${e}`), s = (0, Xs.c32encode)(`${e}${r}`);
  return `${Xs.c32[t]}${s}`;
}
kr.c32checkEncode = A2;
function $2(t) {
  t = (0, Xs.c32normalize)(t);
  const e = (0, Xs.c32decode)(t.slice(1)), n = t[0], r = Xs.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), s0(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
kr.c32checkDecode = $2;
var i0 = {}, $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
$s.decode = $s.encode = void 0;
const mo = Ko, af = bi, o0 = gd, a0 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function v2(t, e = "00") {
  const n = typeof t == "string" ? (0, af.hexToBytes)(t) : t, r = typeof e == "string" ? (0, af.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, mo.sha256)((0, mo.sha256)(new Uint8Array([...r, ...n])));
  return o0(a0).encode([...r, ...n, ...s.slice(0, 4)]);
}
$s.encode = v2;
function I2(t) {
  const e = o0(a0).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, mo.sha256)((0, mo.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
$s.decode = I2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = kr, n = $s, r = bi;
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
  function o(h, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, l)}`;
  }
  t.c32address = o;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(h.slice(1));
  }
  t.c32addressDecode = a;
  function c(h, l = -1) {
    const g = n.decode(h), f = (0, r.bytesToHex)(g.data), y = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let w;
    return l < 0 ? (w = y, s[y] !== void 0 && (w = s[y])) : w = l, o(w, f);
  }
  t.b58ToC32 = c;
  function u(h, l = -1) {
    const g = a(h), f = g[0], y = g[1];
    let w;
    l < 0 ? (w = f, i[f] !== void 0 && (w = i[f])) : w = l;
    let $ = w.toString(16);
    return $.length === 1 && ($ = `0${$}`), n.encode(y, $);
  }
  t.c32ToB58 = u;
})(i0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = fl;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = kr;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = i0;
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
})(Kr);
function L2(t, e) {
  switch (e = Zd(e ?? Yd), t) {
    case gn.P2PKH:
      switch (e.transactionVersion) {
        case wn.Mainnet:
          return Ze.MainnetSingleSig;
        case wn.Testnet:
          return Ze.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case gn.P2SH:
    case gn.P2SHNonSequential:
    case gn.P2WPKH:
    case gn.P2WSH:
    case gn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case wn.Mainnet:
          return Ze.MainnetMultiSig;
        case wn.Testnet:
          return Ze.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const C2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), c0 = Uint8Array.from({ length: 16 }, (t, e) => e), k2 = c0.map((t) => (9 * t + 5) % 16);
let hl = [c0], dl = [k2];
for (let t = 0; t < 4; t++)
  for (let e of [hl, dl])
    e.push(e[t].map((n) => C2[n]));
const l0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), B2 = hl.map((t, e) => t.map((n) => l0[e][n])), M2 = dl.map((t, e) => t.map((n) => l0[e][n])), T2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ni = (t, e) => t << e | t >>> 32 - e;
function cf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Pi = new Uint32Array(16);
let U2 = class extends ul {
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
    for (let f = 0; f < 16; f++, n += 4)
      Pi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T2[f], $ = _2[f], T = hl[f], _ = dl[f], x = B2[f], I = M2[f];
      for (let A = 0; A < 16; A++) {
        const N = Ni(r + cf(f, i, a, u) + Pi[T[A]] + w, x[A]) + l | 0;
        r = l, l = u, u = Ni(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Ni(s + cf(y, o, c, h) + Pi[_[A]] + $, I[A]) + g | 0;
        s = g, g = h, h = Ni(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Pi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const H2 = Vr(() => new U2()), Oi = BigInt(2 ** 32 - 1), Ja = BigInt(32);
function u0(t, e = !1) {
  return e ? { h: Number(t & Oi), l: Number(t >> Ja & Oi) } : { h: Number(t >> Ja & Oi) | 0, l: Number(t & Oi) | 0 };
}
function N2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = u0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const P2 = (t, e) => BigInt(t >>> 0) << Ja | BigInt(e >>> 0), O2 = (t, e, n) => t >>> n, D2 = (t, e, n) => t << 32 - n | e >>> n, F2 = (t, e, n) => t >>> n | e << 32 - n, j2 = (t, e, n) => t << 32 - n | e >>> n, z2 = (t, e, n) => t << 64 - n | e >>> n - 32, R2 = (t, e, n) => t >>> n - 32 | e << 64 - n, G2 = (t, e) => e, V2 = (t, e) => t, K2 = (t, e, n) => t << n | e >>> 32 - n, q2 = (t, e, n) => e << n | t >>> 32 - n, W2 = (t, e, n) => e << n - 32 | t >>> 64 - n, X2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Y2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Z2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Q2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, J2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), tx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, ex = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), nx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, et = {
  fromBig: u0,
  split: N2,
  toBig: P2,
  shrSH: O2,
  shrSL: D2,
  rotrSH: F2,
  rotrSL: j2,
  rotrBH: z2,
  rotrBL: R2,
  rotr32H: G2,
  rotr32L: V2,
  rotlSH: K2,
  rotlSL: q2,
  rotlBH: W2,
  rotlBL: X2,
  add: Y2,
  add3L: Z2,
  add3H: Q2,
  add4L: J2,
  add4H: tx,
  add5H: nx,
  add5L: ex
}, [rx, sx] = et.split([
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
].map((t) => BigInt(t))), Pn = new Uint32Array(80), On = new Uint32Array(80);
let Xo = class extends ul {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Pn[x] = e.getUint32(n), On[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Pn[x - 15] | 0, A = On[x - 15] | 0, N = et.rotrSH(I, A, 1) ^ et.rotrSH(I, A, 8) ^ et.shrSH(I, A, 7), G = et.rotrSL(I, A, 1) ^ et.rotrSL(I, A, 8) ^ et.shrSL(I, A, 7), P = Pn[x - 2] | 0, z = On[x - 2] | 0, m = et.rotrSH(P, z, 19) ^ et.rotrBH(P, z, 61) ^ et.shrSH(P, z, 6), L = et.rotrSL(P, z, 19) ^ et.rotrBL(P, z, 61) ^ et.shrSL(P, z, 6), H = et.add4L(G, L, On[x - 7], On[x - 16]), q = et.add4H(H, N, m, Pn[x - 7], Pn[x - 16]);
      Pn[x] = q | 0, On[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const I = et.rotrSH(l, g, 14) ^ et.rotrSH(l, g, 18) ^ et.rotrBH(l, g, 41), A = et.rotrSL(l, g, 14) ^ et.rotrSL(l, g, 18) ^ et.rotrBL(l, g, 41), N = l & f ^ ~l & w, G = g & y ^ ~g & $, P = et.add5L(_, A, G, sx[x], On[x]), z = et.add5H(P, T, I, N, rx[x], Pn[x]), m = P | 0, L = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), H = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = et.add(u | 0, h | 0, z | 0, m | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = et.add3L(m, H, Y);
      r = et.add3H(j, z, L, q), s = j | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = et.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = et.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = et.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Pn.fill(0), On.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ix = class extends Xo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ox = class extends Xo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ax = class extends Xo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Vr(() => new Xo());
Vr(() => new ix());
Vr(() => new ox());
Vr(() => new ax());
var So = { exports: {} };
So.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", f = "[object Number]", y = "[object Object]", w = "[object Promise]", $ = "[object RegExp]", T = "[object Set]", _ = "[object String]", x = "[object Symbol]", I = "[object WeakMap]", A = "[object ArrayBuffer]", N = "[object DataView]", G = "[object Float32Array]", P = "[object Float64Array]", z = "[object Int8Array]", m = "[object Int16Array]", L = "[object Int32Array]", H = "[object Uint8Array]", q = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", j = "[object Uint32Array]", Qt = /[\\^$.*+?()[\]{}|]/g, Rt = /\w*$/, Jt = /^\[object .+?Constructor\]$/, S = /^(?:0|[1-9]\d*)$/, M = {};
  M[i] = M[o] = M[A] = M[N] = M[a] = M[c] = M[G] = M[P] = M[z] = M[m] = M[L] = M[g] = M[f] = M[y] = M[$] = M[T] = M[_] = M[x] = M[H] = M[q] = M[Y] = M[j] = !0, M[u] = M[h] = M[I] = !1;
  var Q = typeof re == "object" && re && re.Object === Object && re, gt = typeof self == "object" && self && self.Object === Object && self, ut = Q || gt || Function("return this")(), Et = e && !e.nodeType && e, ie = Et && !0 && t && !t.nodeType && t, on = ie && ie.exports === Et;
  function En(p, E) {
    return p.set(E[0], E[1]), p;
  }
  function Zr(p, E) {
    return p.add(E), p;
  }
  function Wt(p, E) {
    for (var k = -1, W = p ? p.length : 0; ++k < W && E(p[k], k, p) !== !1; )
      ;
    return p;
  }
  function ke(p, E) {
    for (var k = -1, W = E.length, Kt = p.length; ++k < W; )
      p[Kt + k] = E[k];
    return p;
  }
  function cr(p, E, k, W) {
    for (var Kt = -1, ae = p ? p.length : 0; ++Kt < ae; )
      k = E(k, p[Kt], Kt, p);
    return k;
  }
  function an(p, E) {
    for (var k = -1, W = Array(p); ++k < p; )
      W[k] = E(k);
    return W;
  }
  function An(p, E) {
    return p == null ? void 0 : p[E];
  }
  function d(p) {
    var E = !1;
    if (p != null && typeof p.toString != "function")
      try {
        E = !!(p + "");
      } catch {
      }
    return E;
  }
  function v(p) {
    var E = -1, k = Array(p.size);
    return p.forEach(function(W, Kt) {
      k[++E] = [Kt, W];
    }), k;
  }
  function C(p, E) {
    return function(k) {
      return p(E(k));
    };
  }
  function R(p) {
    var E = -1, k = Array(p.size);
    return p.forEach(function(W) {
      k[++E] = W;
    }), k;
  }
  var ft = Array.prototype, vt = Function.prototype, Xt = Object.prototype, Gt = ut["__core-js_shared__"], De = function() {
    var p = /[^.]+$/.exec(Gt && Gt.keys && Gt.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), lr = vt.toString, Ft = Xt.hasOwnProperty, Be = Xt.toString, oe = RegExp(
    "^" + lr.call(Ft).replace(Qt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Se = on ? ut.Buffer : void 0, ht = ut.Symbol, mt = ut.Uint8Array, jt = C(Object.getPrototypeOf, Object), It = Object.create, ur = Xt.propertyIsEnumerable, Fs = ft.splice, Fe = Object.getOwnPropertySymbols, $n = Se ? Se.isBuffer : void 0, Qr = C(Object.keys, Object), vn = es(ut, "DataView"), Ee = es(ut, "Map"), In = es(ut, "Promise"), Ln = es(ut, "Set"), je = es(ut, "WeakMap"), D = es(Object, "create"), b = hr(vn), B = hr(Ee), K = hr(In), yt = hr(Ln), V = hr(je), Ct = ht ? ht.prototype : void 0, at = Ct ? Ct.valueOf : void 0;
  function bt(p) {
    var E = -1, k = p ? p.length : 0;
    for (this.clear(); ++E < k; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function cn() {
    this.__data__ = D ? D(null) : {};
  }
  function ze(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function ln(p) {
    var E = this.__data__;
    if (D) {
      var k = E[p];
      return k === r ? void 0 : k;
    }
    return Ft.call(E, p) ? E[p] : void 0;
  }
  function he(p) {
    var E = this.__data__;
    return D ? E[p] !== void 0 : Ft.call(E, p);
  }
  function Re(p, E) {
    var k = this.__data__;
    return k[p] = D && E === void 0 ? r : E, this;
  }
  bt.prototype.clear = cn, bt.prototype.delete = ze, bt.prototype.get = ln, bt.prototype.has = he, bt.prototype.set = Re;
  function un(p) {
    var E = -1, k = p ? p.length : 0;
    for (this.clear(); ++E < k; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function gg() {
    this.__data__ = [];
  }
  function yg(p) {
    var E = this.__data__, k = Ei(E, p);
    if (k < 0)
      return !1;
    var W = E.length - 1;
    return k == W ? E.pop() : Fs.call(E, k, 1), !0;
  }
  function wg(p) {
    var E = this.__data__, k = Ei(E, p);
    return k < 0 ? void 0 : E[k][1];
  }
  function bg(p) {
    return Ei(this.__data__, p) > -1;
  }
  function xg(p, E) {
    var k = this.__data__, W = Ei(k, p);
    return W < 0 ? k.push([p, E]) : k[W][1] = E, this;
  }
  un.prototype.clear = gg, un.prototype.delete = yg, un.prototype.get = wg, un.prototype.has = bg, un.prototype.set = xg;
  function Jr(p) {
    var E = -1, k = p ? p.length : 0;
    for (this.clear(); ++E < k; ) {
      var W = p[E];
      this.set(W[0], W[1]);
    }
  }
  function mg() {
    this.__data__ = {
      hash: new bt(),
      map: new (Ee || un)(),
      string: new bt()
    };
  }
  function Sg(p) {
    return Ai(this, p).delete(p);
  }
  function Eg(p) {
    return Ai(this, p).get(p);
  }
  function Ag(p) {
    return Ai(this, p).has(p);
  }
  function $g(p, E) {
    return Ai(this, p).set(p, E), this;
  }
  Jr.prototype.clear = mg, Jr.prototype.delete = Sg, Jr.prototype.get = Eg, Jr.prototype.has = Ag, Jr.prototype.set = $g;
  function ts(p) {
    this.__data__ = new un(p);
  }
  function vg() {
    this.__data__ = new un();
  }
  function Ig(p) {
    return this.__data__.delete(p);
  }
  function Lg(p) {
    return this.__data__.get(p);
  }
  function Cg(p) {
    return this.__data__.has(p);
  }
  function kg(p, E) {
    var k = this.__data__;
    if (k instanceof un) {
      var W = k.__data__;
      if (!Ee || W.length < n - 1)
        return W.push([p, E]), this;
      k = this.__data__ = new Jr(W);
    }
    return k.set(p, E), this;
  }
  ts.prototype.clear = vg, ts.prototype.delete = Ig, ts.prototype.get = Lg, ts.prototype.has = Cg, ts.prototype.set = kg;
  function Bg(p, E) {
    var k = da(p) || ty(p) ? an(p.length, String) : [], W = k.length, Kt = !!W;
    for (var ae in p)
      Ft.call(p, ae) && !(Kt && (ae == "length" || Yg(ae, W))) && k.push(ae);
    return k;
  }
  function su(p, E, k) {
    var W = p[E];
    (!(Ft.call(p, E) && cu(W, k)) || k === void 0 && !(E in p)) && (p[E] = k);
  }
  function Ei(p, E) {
    for (var k = p.length; k--; )
      if (cu(p[k][0], E))
        return k;
    return -1;
  }
  function Mg(p, E) {
    return p && iu(E, pa(E), p);
  }
  function fa(p, E, k, W, Kt, ae, fn) {
    var ce;
    if (W && (ce = ae ? W(p, Kt, ae, fn) : W(p)), ce !== void 0)
      return ce;
    if (!$i(p))
      return p;
    var fu = da(p);
    if (fu) {
      if (ce = qg(p), !E)
        return Gg(p, ce);
    } else {
      var ns = fr(p), hu = ns == h || ns == l;
      if (ny(p))
        return Pg(p, E);
      if (ns == y || ns == i || hu && !ae) {
        if (d(p))
          return ae ? p : {};
        if (ce = Wg(hu ? {} : p), !E)
          return Vg(p, Mg(ce, p));
      } else {
        if (!M[ns])
          return ae ? p : {};
        ce = Xg(p, ns, fa, E);
      }
    }
    fn || (fn = new ts());
    var du = fn.get(p);
    if (du)
      return du;
    if (fn.set(p, ce), !fu)
      var pu = k ? Kg(p) : pa(p);
    return Wt(pu || p, function(ga, vi) {
      pu && (vi = ga, ga = p[vi]), su(ce, vi, fa(ga, E, k, W, vi, p, fn));
    }), ce;
  }
  function Tg(p) {
    return $i(p) ? It(p) : {};
  }
  function _g(p, E, k) {
    var W = E(p);
    return da(p) ? W : ke(W, k(p));
  }
  function Ug(p) {
    return Be.call(p);
  }
  function Hg(p) {
    if (!$i(p) || Qg(p))
      return !1;
    var E = uu(p) || d(p) ? oe : Jt;
    return E.test(hr(p));
  }
  function Ng(p) {
    if (!au(p))
      return Qr(p);
    var E = [];
    for (var k in Object(p))
      Ft.call(p, k) && k != "constructor" && E.push(k);
    return E;
  }
  function Pg(p, E) {
    if (E)
      return p.slice();
    var k = new p.constructor(p.length);
    return p.copy(k), k;
  }
  function ha(p) {
    var E = new p.constructor(p.byteLength);
    return new mt(E).set(new mt(p)), E;
  }
  function Og(p, E) {
    var k = E ? ha(p.buffer) : p.buffer;
    return new p.constructor(k, p.byteOffset, p.byteLength);
  }
  function Dg(p, E, k) {
    var W = E ? k(v(p), !0) : v(p);
    return cr(W, En, new p.constructor());
  }
  function Fg(p) {
    var E = new p.constructor(p.source, Rt.exec(p));
    return E.lastIndex = p.lastIndex, E;
  }
  function jg(p, E, k) {
    var W = E ? k(R(p), !0) : R(p);
    return cr(W, Zr, new p.constructor());
  }
  function zg(p) {
    return at ? Object(at.call(p)) : {};
  }
  function Rg(p, E) {
    var k = E ? ha(p.buffer) : p.buffer;
    return new p.constructor(k, p.byteOffset, p.length);
  }
  function Gg(p, E) {
    var k = -1, W = p.length;
    for (E || (E = Array(W)); ++k < W; )
      E[k] = p[k];
    return E;
  }
  function iu(p, E, k, W) {
    k || (k = {});
    for (var Kt = -1, ae = E.length; ++Kt < ae; ) {
      var fn = E[Kt], ce = void 0;
      su(k, fn, ce === void 0 ? p[fn] : ce);
    }
    return k;
  }
  function Vg(p, E) {
    return iu(p, ou(p), E);
  }
  function Kg(p) {
    return _g(p, pa, ou);
  }
  function Ai(p, E) {
    var k = p.__data__;
    return Zg(E) ? k[typeof E == "string" ? "string" : "hash"] : k.map;
  }
  function es(p, E) {
    var k = An(p, E);
    return Hg(k) ? k : void 0;
  }
  var ou = Fe ? C(Fe, Object) : iy, fr = Ug;
  (vn && fr(new vn(new ArrayBuffer(1))) != N || Ee && fr(new Ee()) != g || In && fr(In.resolve()) != w || Ln && fr(new Ln()) != T || je && fr(new je()) != I) && (fr = function(p) {
    var E = Be.call(p), k = E == y ? p.constructor : void 0, W = k ? hr(k) : void 0;
    if (W)
      switch (W) {
        case b:
          return N;
        case B:
          return g;
        case K:
          return w;
        case yt:
          return T;
        case V:
          return I;
      }
    return E;
  });
  function qg(p) {
    var E = p.length, k = p.constructor(E);
    return E && typeof p[0] == "string" && Ft.call(p, "index") && (k.index = p.index, k.input = p.input), k;
  }
  function Wg(p) {
    return typeof p.constructor == "function" && !au(p) ? Tg(jt(p)) : {};
  }
  function Xg(p, E, k, W) {
    var Kt = p.constructor;
    switch (E) {
      case A:
        return ha(p);
      case a:
      case c:
        return new Kt(+p);
      case N:
        return Og(p, W);
      case G:
      case P:
      case z:
      case m:
      case L:
      case H:
      case q:
      case Y:
      case j:
        return Rg(p, W);
      case g:
        return Dg(p, W, k);
      case f:
      case _:
        return new Kt(p);
      case $:
        return Fg(p);
      case T:
        return jg(p, W, k);
      case x:
        return zg(p);
    }
  }
  function Yg(p, E) {
    return E = E ?? s, !!E && (typeof p == "number" || S.test(p)) && p > -1 && p % 1 == 0 && p < E;
  }
  function Zg(p) {
    var E = typeof p;
    return E == "string" || E == "number" || E == "symbol" || E == "boolean" ? p !== "__proto__" : p === null;
  }
  function Qg(p) {
    return !!De && De in p;
  }
  function au(p) {
    var E = p && p.constructor, k = typeof E == "function" && E.prototype || Xt;
    return p === k;
  }
  function hr(p) {
    if (p != null) {
      try {
        return lr.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function Jg(p) {
    return fa(p, !0, !0);
  }
  function cu(p, E) {
    return p === E || p !== p && E !== E;
  }
  function ty(p) {
    return ey(p) && Ft.call(p, "callee") && (!ur.call(p, "callee") || Be.call(p) == i);
  }
  var da = Array.isArray;
  function lu(p) {
    return p != null && ry(p.length) && !uu(p);
  }
  function ey(p) {
    return sy(p) && lu(p);
  }
  var ny = $n || oy;
  function uu(p) {
    var E = $i(p) ? Be.call(p) : "";
    return E == h || E == l;
  }
  function ry(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function $i(p) {
    var E = typeof p;
    return !!p && (E == "object" || E == "function");
  }
  function sy(p) {
    return !!p && typeof p == "object";
  }
  function pa(p) {
    return lu(p) ? Bg(p) : Ng(p);
  }
  function iy() {
    return [];
  }
  function oy() {
    return !1;
  }
  t.exports = Jg;
})(So, So.exports);
var cx = So.exports;
const f0 = /* @__PURE__ */ Oh(cx);
var tc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(tc || (tc = {}));
function lx(t, e) {
  return { type: tc.Address, version: t, hash160: e };
}
function ux(t) {
  return Kr.c32address(t.version, t.hash160);
}
const fx = (t) => H2(r0(t)), hx = (t) => Z(fx(t));
Nt.hmacSha256Sync = (t, ...e) => {
  const n = e0.create(r0, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function dx(t, e = "mainnet") {
  e = Zd(e), t = typeof t == "string" ? pt(t) : t;
  const n = L2(gn.P2PKH, e), r = lx(n, hx(t));
  return ux(r);
}
function px(t, e) {
  const n = qt.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = dx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new qt.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function gx(t, e = null) {
  let n;
  e ? n = px(t, e) : n = qt.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const lf = "_blockstackDidCheckEchoReply", yx = "echoReply", wx = "authContinuation";
function bx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function xx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[lf];
  if (typeof e == "boolean")
    return e;
  const n = bx(t.location.search), r = n[yx];
  if (r) {
    t[lf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[wx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class ec {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Wh();
    else
      throw new Ny("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ru(e.sessionOptions) : this.store = new Ru() : e ? this.store = new zu(e.sessionOptions) : this.store = new zu();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Oy().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ja("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, s2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = r2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = qc("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (xx())
        return cs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      cs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = aw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ii("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = qt.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await l2(e))
      throw new Ii("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (wa(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Fu(s, i.private_key);
          } catch {
            if (cs.warn("Failed decryption of appPrivateKey, will try to use as given"), !Nt.isValidPrivateKey(i.private_key))
              throw new Ii("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Fu(s, c);
          } catch {
            cs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ii("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Yy, h;
    wa(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), wa(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Wd(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, g = i.profile_url;
    if (!l.profile && g) {
      const f = await n(g);
      if (!f.ok)
        l.profile = Object.assign({}, _y);
      else {
        const y = await f.text(), w = JSON.parse(y);
        l.profile = gx(w[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ja("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Y1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Z1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
ec.prototype.makeAuthRequest = ec.prototype.makeAuthRequestToken;
const mx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Sx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = mx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Yo(r.id));
  return e.concat(n);
}, Yo = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), h0 = "STX_PROVIDER", Br = () => typeof window > "u" ? null : window.localStorage.getItem(h0), Ex = (t) => {
  typeof window < "u" && window.localStorage.setItem(h0, t);
}, Ax = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function $x(t, e) {
  const n = {};
  return Object.assign(n, Ax, e), await fetch(t, n);
}
function vx(t) {
  let e = $x, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ix(...t) {
  const { fetchLib: e, middlewares: n } = vx(t);
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
var vs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vs || (vs = {}));
var Mr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mr || (Mr = {}));
var uf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(uf || (uf = {}));
const Lx = "https://api.mainnet.hiro.so", Cx = "https://api.testnet.hiro.so", kx = "http://localhost:3999", Bx = ["mainnet", "testnet", "devnet", "mocknet"];
class Tr {
  constructor(e) {
    this.version = Mr.Mainnet, this.chainId = vs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Mr.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ix();
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
Tr.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new nc();
    case "testnet":
      return new rc();
    case "devnet":
      return new Mx();
    case "mocknet":
      return new d0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Bx.join(", ")}`);
  }
};
Tr.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Tr.fromName(t);
class nc extends Tr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Mainnet, this.chainId = vs.Mainnet;
  }
}
class rc extends Tr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Testnet, this.chainId = vs.Testnet;
  }
}
class d0 extends Tr {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Mr.Testnet, this.chainId = vs.Testnet;
  }
}
const Mx = d0;
var _r;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(_r || (_r = {}));
var Eo;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Eo || (Eo = {}));
_r.Mainnet;
var Ur;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ur || (Ur = {}));
var Hr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Hr || (Hr = {}));
Ur.Mainnet;
const Tx = {
  chainId: _r.Mainnet,
  transactionVersion: Ur.Mainnet,
  peerNetworkId: Eo.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Hr.MainnetSingleSig,
    multiSig: Hr.MainnetMultiSig
  },
  client: { baseUrl: Vh }
}, sc = {
  chainId: _r.Testnet,
  transactionVersion: Ur.Testnet,
  peerNetworkId: Eo.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Hr.TestnetSingleSig,
    multiSig: Hr.TestnetMultiSig
  },
  client: { baseUrl: Kh }
}, io = {
  ...sc,
  addressVersion: { ...sc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: qh }
}, _x = {
  ...io,
  addressVersion: { ...io.addressVersion },
  client: { ...io.client }
};
function Ux(t) {
  switch (t) {
    case "mainnet":
      return Tx;
    case "testnet":
      return sc;
    case "devnet":
      return io;
    case "mocknet":
      return _x;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Hx(t) {
  return typeof t == "string" ? Ux(t) : t;
}
function Nx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ff = /* @__PURE__ */ new Map();
function p0(t, e) {
  const n = ff.get(t);
  if (n !== void 0)
    return n(e);
  const r = Nx(t);
  return ff.set(t, r), p0(t, e);
}
let Lt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? pt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return rw(this.readBytes(4), 0);
  }
  readUInt8() {
    return ew(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Jy(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Z(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Z(n);
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
    if (p0(e, r))
      return r;
    throw n(r);
  }
};
const Px = 128, Ox = 128, g0 = 16, Sr = 32, ic = 80, Zo = 65, Dx = 32, Fx = 64, Ao = 34, jx = 1 + 16 * 1024 * 1024, zx = 165, Rx = 16, Gx = 16, Vx = 20, Kx = Gx + 2 + Vx, qx = Kx + 4, Wx = jx + (zx + Rx * qx);
var xt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(xt || (xt = {}));
var oc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(oc || (oc = {}));
var pe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(pe || (pe = {}));
const $a = ["onChainOnly", "offChainOnly", "any"];
$a[0] + "", pe.OnChainOnly, $a[1] + "", pe.OffChainOnly, $a[2] + "", pe.Any, pe.OnChainOnly + "", pe.OnChainOnly, pe.OffChainOnly + "", pe.OffChainOnly, pe.Any + "", pe.Any;
var $o;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})($o || ($o = {}));
var kt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(kt || (kt = {}));
var Ut;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ut || (Ut = {}));
var At;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(At || (At = {}));
var Tt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Tt || (Tt = {}));
var Ys;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ys || (Ys = {}));
var ac;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ac || (ac = {}));
var cc;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(cc || (cc = {}));
var ne;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ne || (ne = {}));
var hf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(hf || (hf = {}));
var lc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(lc || (lc = {}));
var Ue;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ue || (Ue = {}));
var df;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(df || (df = {}));
let Qo = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ls = class extends Qo {
  constructor(e) {
    super(e);
  }
}, te = class extends Qo {
  constructor(e) {
    super(e);
  }
}, vo = class extends Qo {
  constructor(e) {
    super(e);
  }
}, wr = class extends Qo {
  constructor(e) {
    super(e);
  }
};
function uc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function y0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Yx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  uc(t.outputLen), uc(t.blockLen);
}
function Zx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Qx(t, e) {
  y0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const br = {
  number: uc,
  bool: Xx,
  bytes: y0,
  hash: Yx,
  exists: Zx,
  output: Qx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const va = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ke = (t, e) => t << 32 - e | t >>> e, Jx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Jx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function tm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function pl(t) {
  if (typeof t == "string" && (t = tm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let w0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function qr(t) {
  const e = (r) => t().update(pl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let b0 = class extends w0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, br.hash(e);
    const r = pl(n);
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
    return br.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    br.exists(this), br.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const x0 = (t, e, n) => new b0(t, e).update(n).digest();
x0.create = (t, e) => new b0(t, e);
function em(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let gl = class extends w0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = va(this.buffer);
  }
  update(e) {
    br.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = pl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = va(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    br.exists(this), br.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    em(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = va(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const nm = (t, e, n) => t & e ^ ~t & n, rm = (t, e, n) => t & e ^ t & n ^ e & n, sm = new Uint32Array([
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
]), Dn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Fn = new Uint32Array(64);
let m0 = class extends gl {
  constructor() {
    super(64, 32, 8, !1), this.A = Dn[0] | 0, this.B = Dn[1] | 0, this.C = Dn[2] | 0, this.D = Dn[3] | 0, this.E = Dn[4] | 0, this.F = Dn[5] | 0, this.G = Dn[6] | 0, this.H = Dn[7] | 0;
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
      Fn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Fn[l - 15], f = Fn[l - 2], y = Ke(g, 7) ^ Ke(g, 18) ^ g >>> 3, w = Ke(f, 17) ^ Ke(f, 19) ^ f >>> 10;
      Fn[l] = w + Fn[l - 7] + y + Fn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ke(a, 6) ^ Ke(a, 11) ^ Ke(a, 25), f = h + g + nm(a, c, u) + sm[l] + Fn[l] | 0, w = (Ke(r, 2) ^ Ke(r, 13) ^ Ke(r, 22)) + rm(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Fn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, im = class extends m0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const yl = qr(() => new m0());
qr(() => new im());
const om = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), S0 = Uint8Array.from({ length: 16 }, (t, e) => e), am = S0.map((t) => (9 * t + 5) % 16);
let wl = [S0], bl = [am];
for (let t = 0; t < 4; t++)
  for (let e of [wl, bl])
    e.push(e[t].map((n) => om[n]));
const E0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), cm = wl.map((t, e) => t.map((n) => E0[e][n])), lm = bl.map((t, e) => t.map((n) => E0[e][n])), um = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), fm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Di = (t, e) => t << e | t >>> 32 - e;
function pf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Fi = new Uint32Array(16);
let hm = class extends gl {
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
    for (let f = 0; f < 16; f++, n += 4)
      Fi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = um[f], $ = fm[f], T = wl[f], _ = bl[f], x = cm[f], I = lm[f];
      for (let A = 0; A < 16; A++) {
        const N = Di(r + pf(f, i, a, u) + Fi[T[A]] + w, x[A]) + l | 0;
        r = l, l = u, u = Di(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Di(s + pf(y, o, c, h) + Fi[_[A]] + $, I[A]) + g | 0;
        s = g, g = h, h = Di(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Fi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const dm = qr(() => new hm()), ji = BigInt(2 ** 32 - 1), fc = BigInt(32);
function A0(t, e = !1) {
  return e ? { h: Number(t & ji), l: Number(t >> fc & ji) } : { h: Number(t >> fc & ji) | 0, l: Number(t & ji) | 0 };
}
function pm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = A0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const gm = (t, e) => BigInt(t >>> 0) << fc | BigInt(e >>> 0), ym = (t, e, n) => t >>> n, wm = (t, e, n) => t << 32 - n | e >>> n, bm = (t, e, n) => t >>> n | e << 32 - n, xm = (t, e, n) => t << 32 - n | e >>> n, mm = (t, e, n) => t << 64 - n | e >>> n - 32, Sm = (t, e, n) => t >>> n - 32 | e << 64 - n, Em = (t, e) => e, Am = (t, e) => t, $m = (t, e, n) => t << n | e >>> 32 - n, vm = (t, e, n) => e << n | t >>> 32 - n, Im = (t, e, n) => e << n - 32 | t >>> 64 - n, Lm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Cm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const km = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Bm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Mm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Tm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, _m = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Um = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, nt = {
  fromBig: A0,
  split: pm,
  toBig: gm,
  shrSH: ym,
  shrSL: wm,
  rotrSH: bm,
  rotrSL: xm,
  rotrBH: mm,
  rotrBL: Sm,
  rotr32H: Em,
  rotr32L: Am,
  rotlSH: $m,
  rotlSL: vm,
  rotlBH: Im,
  rotlBL: Lm,
  add: Cm,
  add3L: km,
  add3H: Bm,
  add4L: Mm,
  add4H: Tm,
  add5H: Um,
  add5L: _m
}, [Hm, Nm] = nt.split([
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
].map((t) => BigInt(t))), jn = new Uint32Array(80), zn = new Uint32Array(80);
let Jo = class extends gl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      jn[x] = e.getUint32(n), zn[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = jn[x - 15] | 0, A = zn[x - 15] | 0, N = nt.rotrSH(I, A, 1) ^ nt.rotrSH(I, A, 8) ^ nt.shrSH(I, A, 7), G = nt.rotrSL(I, A, 1) ^ nt.rotrSL(I, A, 8) ^ nt.shrSL(I, A, 7), P = jn[x - 2] | 0, z = zn[x - 2] | 0, m = nt.rotrSH(P, z, 19) ^ nt.rotrBH(P, z, 61) ^ nt.shrSH(P, z, 6), L = nt.rotrSL(P, z, 19) ^ nt.rotrBL(P, z, 61) ^ nt.shrSL(P, z, 6), H = nt.add4L(G, L, zn[x - 7], zn[x - 16]), q = nt.add4H(H, N, m, jn[x - 7], jn[x - 16]);
      jn[x] = q | 0, zn[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const I = nt.rotrSH(l, g, 14) ^ nt.rotrSH(l, g, 18) ^ nt.rotrBH(l, g, 41), A = nt.rotrSL(l, g, 14) ^ nt.rotrSL(l, g, 18) ^ nt.rotrBL(l, g, 41), N = l & f ^ ~l & w, G = g & y ^ ~g & $, P = nt.add5L(_, A, G, Nm[x], zn[x]), z = nt.add5H(P, T, I, N, Hm[x], jn[x]), m = P | 0, L = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), H = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = nt.add(u | 0, h | 0, z | 0, m | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = nt.add3L(m, H, Y);
      r = nt.add3H(j, z, L, q), s = j | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = nt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = nt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = nt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = nt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    jn.fill(0), zn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Pm = class extends Jo {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Om = class extends Jo {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Dm = class extends Jo {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
qr(() => new Jo());
qr(() => new Pm());
const Fm = qr(() => new Om());
qr(() => new Dm());
var lt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(lt || (lt = {}));
var zt;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(zt || (zt = {}));
function xl(t) {
  return zt[t];
}
const jm = () => ({ type: lt.BoolTrue }), zm = () => ({ type: lt.BoolFalse }), Rm = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: lt.Buffer, value: Z(t) };
}, gf = BigInt("0xffffffffffffffffffffffffffffffff"), Gm = BigInt(0), yf = BigInt("0x7fffffffffffffffffffffffffffffff"), wf = BigInt("-170141183460469231731687303715884105728"), Vm = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Ra(pt(t))), fe(t, Uint8Array) && (t = Ra(t));
  const e = Zt(t);
  if (e > yf)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${yf}`);
  if (e < wf)
    throw new RangeError(`Cannot construct clarity integer form value less than ${wf}`);
  return { type: lt.Int, value: e };
}, Km = (t) => {
  const e = Zt(t);
  if (e < Gm)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > gf)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${gf}`);
  return { type: lt.UInt, value: e };
};
function qm(t) {
  return { type: lt.List, value: t };
}
function $0() {
  return { type: lt.OptionalNone };
}
function v0(t) {
  return { type: lt.OptionalSome, value: t };
}
var F;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(F || (F = {}));
function Wm() {
  return {
    type: F.Address,
    version: Hr.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function bf(t) {
  if (t && U0(t, Ao))
    throw new Error(`Memo exceeds maximum length of ${Ao} bytes`);
  return { type: F.MemoString, content: t };
}
function ml(t, e) {
  return {
    type: F.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function hc(t) {
  if (pt(t).byteLength != Zo)
    throw Error("Invalid signature");
  return {
    type: F.MessageSignature,
    data: t
  };
}
function Xm(t, e, n) {
  return typeof t == "string" && (t = fS(t)), typeof n == "string" && (n = bf(n)), {
    type: F.Payload,
    payloadType: xt.TokenTransfer,
    recipient: t,
    amount: Zt(e),
    memo: n ?? bf("")
  };
}
function Ym(t, e, n, r) {
  return typeof e == "string" && (e = Pe(e)), typeof n == "string" && (n = Pe(n)), {
    type: F.Payload,
    payloadType: xt.ContractCall,
    contractAddress: typeof t == "string" ? ar(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Zm(t) {
  return Pe(t, 4, 1e5);
}
function xf(t, e, n) {
  return typeof t == "string" && (t = Pe(t)), typeof e == "string" && (e = Zm(e)), typeof n == "number" ? {
    type: F.Payload,
    payloadType: xt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: F.Payload,
    payloadType: xt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Qm() {
  return { type: F.Payload, payloadType: xt.PoisonMicroblock };
}
function mf(t, e) {
  if (t.byteLength != Sr)
    throw Error(`Coinbase buffer size must be ${Sr} bytes`);
  return e != null ? {
    type: F.Payload,
    payloadType: xt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: F.Payload,
    payloadType: xt.Coinbase,
    coinbaseBytes: t
  };
}
function Jm(t, e, n) {
  if (t.byteLength != Sr)
    throw Error(`Coinbase buffer size must be ${Sr} bytes`);
  if (n.byteLength != ic)
    throw Error(`VRF proof buffer size must be ${ic} bytes`);
  return {
    type: F.Payload,
    payloadType: xt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === lt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function tS(t, e, n, r, s, i, o) {
  return {
    type: F.Payload,
    payloadType: xt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Pe(t, e, n) {
  const r = e || 1, s = n || Px;
  if (U0(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: F.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function eS(t, e, n) {
  return {
    type: F.Asset,
    address: ar(t),
    contractName: Pe(e),
    assetName: Pe(n)
  };
}
function ar(t) {
  const e = Kr.c32addressDecode(t);
  return {
    type: F.Address,
    version: e[0],
    hash160: e[1]
  };
}
function nS(t, e) {
  const n = ar(t), r = Pe(e);
  return {
    type: F.Principal,
    prefix: ne.Contract,
    address: n,
    contractName: r
  };
}
function rS(t) {
  const e = ar(t);
  return {
    type: F.Principal,
    prefix: ne.Standard,
    address: e
  };
}
function us(t, e) {
  return {
    pubKeyEncoding: t,
    type: F.TransactionAuthField,
    contents: e
  };
}
function dn(t) {
  switch (t.type) {
    case F.Address:
      return xi(t);
    case F.Principal:
      return I0(t);
    case F.LengthPrefixedString:
      return Ls(t);
    case F.MemoString:
      return iS(t);
    case F.Asset:
      return C0(t);
    case F.PostCondition:
      return B0(t);
    case F.PublicKey:
      return gc(t);
    case F.LengthPrefixedList:
      return Sl(t);
    case F.Payload:
      return M0(t);
    case F.TransactionAuthField:
      return uS(t);
    case F.MessageSignature:
      return El(t);
  }
}
function xi(t) {
  const e = [];
  return e.push(pt(di(t.version, 1))), e.push(pt(t.hash160)), Ot(e);
}
function Is(t) {
  const e = fe(t, Lt) ? t : new Lt(t), n = Oo(Z(e.readBytes(1))), r = Z(e.readBytes(20));
  return { type: F.Address, version: n, hash160: r };
}
function I0(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === ne.Standard || t.prefix === ne.Contract) && e.push(xi(t.address)), t.prefix === ne.Contract && e.push(Ls(t.contractName)), Ot(e);
}
function sS(t) {
  const e = fe(t, Lt) ? t : new Lt(t), n = e.readUInt8Enum(ne, (i) => {
    throw new te(`Unexpected Principal payload type: ${i}`);
  });
  if (n === ne.Origin)
    return { type: F.Principal, prefix: n };
  const r = Is(e);
  if (n === ne.Standard)
    return { type: F.Principal, prefix: n, address: r };
  const s = Ie(e);
  return {
    type: F.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ls(t) {
  const e = [], n = zr(t.content), r = n.byteLength;
  return e.push(pt(di(r, t.lengthPrefixBytes))), e.push(n), Ot(e);
}
function Ie(t, e, n) {
  e = e || 1;
  const r = fe(t, Lt) ? t : new Lt(t), s = Oo(Z(r.readBytes(e))), i = pi(r.readBytes(s));
  return Pe(i, e, n ?? 128);
}
function iS(t) {
  const e = [], n = zr(t.content), r = _S(Z(n), Ao * 2);
  return e.push(pt(r)), Ot(e);
}
function L0(t) {
  const e = fe(t, Lt) ? t : new Lt(t);
  let n = pi(e.readBytes(Ao));
  return n = n.replace(/\u0000*$/, ""), { type: F.MemoString, content: n };
}
function C0(t) {
  const e = [];
  return e.push(xi(t.address)), e.push(Ls(t.contractName)), e.push(Ls(t.assetName)), Ot(e);
}
function dc(t) {
  const e = fe(t, Lt) ? t : new Lt(t);
  return {
    type: F.Asset,
    address: Is(e),
    contractName: Ie(e),
    assetName: Ie(e)
  };
}
function Sl(t) {
  const e = t.values, n = [];
  n.push(pt(di(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(dn(r));
  return Ot(n);
}
function k0(t, e, n) {
  const r = fe(t, Lt) ? t : new Lt(t), s = Oo(Z(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case F.Address:
        i.push(Is(r));
        break;
      case F.LengthPrefixedString:
        i.push(Ie(r));
        break;
      case F.MemoString:
        i.push(L0(r));
        break;
      case F.Asset:
        i.push(dc(r));
        break;
      case F.PostCondition:
        i.push(aS(r));
        break;
      case F.PublicKey:
        i.push(yc(r));
        break;
      case F.TransactionAuthField:
        i.push(lS(r));
        break;
    }
  return ml(i, n);
}
function oS(t) {
  return Z(B0(t));
}
function B0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(I0(t.principal)), (t.conditionType === kt.Fungible || t.conditionType === kt.NonFungible) && e.push(C0(t.asset)), t.conditionType === kt.NonFungible && e.push(Qe(t.assetName)), e.push(t.conditionCode), t.conditionType === kt.STX || t.conditionType === kt.Fungible || t.conditionType === kt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ls("The post-condition amount may not be larger than 8 bytes");
    e.push(ir(t.amount, 8));
  }
  return Ot(e);
}
function aS(t) {
  const e = fe(t, Lt) ? t : new Lt(t), n = e.readUInt8Enum(kt, (a) => {
    throw new te(`Could not read ${a} as PostConditionType`);
  }), r = sS(e);
  let s, i, o;
  switch (n) {
    case kt.STX:
      return s = e.readUInt8Enum(Ys, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: F.PostCondition,
        conditionType: kt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case kt.Fungible:
      return i = dc(e), s = e.readUInt8Enum(Ys, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: F.PostCondition,
        conditionType: kt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case kt.NonFungible:
      i = dc(e);
      const a = Ye(e);
      return s = e.readUInt8Enum(ac, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: F.PostCondition,
        conditionType: kt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case kt.Staking:
      return s = e.readUInt8Enum(Ys, (c) => {
        throw new te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${Z(e.readBytes(8))}`), {
        type: F.PostCondition,
        conditionType: kt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case kt.PoX: {
      const c = e.readUInt8Enum(cc, (u) => {
        throw new te(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: F.PostCondition,
        conditionType: kt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function M0(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case xt.TokenTransfer:
      e.push(Qe(t.recipient)), e.push(ir(t.amount, 8)), e.push(dn(t.memo));
      break;
    case xt.ContractCall:
      e.push(dn(t.contractAddress)), e.push(dn(t.contractName)), e.push(dn(t.functionName));
      const n = new Uint8Array(4);
      vr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Qe(r));
      });
      break;
    case xt.SmartContract:
      e.push(dn(t.contractName)), e.push(dn(t.codeBody));
      break;
    case xt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(dn(t.contractName)), e.push(dn(t.codeBody));
      break;
    case xt.PoisonMicroblock:
      break;
    case xt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case xt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Qe(t.recipient));
      break;
    case xt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Qe(t.recipient ? v0(t.recipient) : $0())), e.push(t.vrfProof);
      break;
    case xt.TenureChange:
      e.push(pt(t.tenureHash)), e.push(pt(t.previousTenureHash)), e.push(pt(t.burnViewHash)), e.push(pt(t.previousTenureEnd)), e.push(vr(new Uint8Array(4), t.previousTenureBlocks)), e.push(nw(new Uint8Array(1), t.cause)), e.push(pt(t.publicKeyHash));
      break;
  }
  return Ot(e);
}
function cS(t) {
  const e = fe(t, Lt) ? t : new Lt(t);
  switch (e.readUInt8Enum(xt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case xt.TokenTransfer:
      const r = Ye(e), s = Zt(e.readBytes(8)), i = L0(e);
      return Xm(r, s, i);
    case xt.ContractCall:
      const o = Is(e), a = Ie(e), c = Ie(e), u = [], h = e.readUInt32BE();
      for (let I = 0; I < h; I++) {
        const A = Ye(e);
        u.push(A);
      }
      return Ym(o, a, c, u);
    case xt.SmartContract:
      const l = Ie(e), g = Ie(e, 4, 1e5);
      return xf(l, g);
    case xt.VersionedSmartContract: {
      const I = e.readUInt8Enum(oc, (G) => {
        throw new Error(`Cannot recognize ClarityVersion: ${G}`);
      }), A = Ie(e), N = Ie(e, 4, Wx);
      return xf(A, N, I);
    }
    case xt.PoisonMicroblock:
      return Qm();
    case xt.Coinbase: {
      const I = e.readBytes(Sr);
      return mf(I);
    }
    case xt.CoinbaseToAltRecipient: {
      const I = e.readBytes(Sr), A = Ye(e);
      return mf(I, A);
    }
    case xt.NakamotoCoinbase: {
      const I = e.readBytes(Sr), A = Ye(e), N = e.readBytes(ic);
      return Jm(I, A, N);
    }
    case xt.TenureChange:
      const f = Z(e.readBytes(20)), y = Z(e.readBytes(20)), w = Z(e.readBytes(20)), $ = Z(e.readBytes(32)), T = e.readUInt32BE(), _ = e.readUInt8Enum(lc, (I) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${I}`);
      }), x = Z(e.readBytes(20));
      return tS(f, y, w, $, T, _, x);
  }
}
function pc(t) {
  const e = fe(t, Lt) ? t : new Lt(t);
  return hc(Z(e.readBytes(Zo)));
}
function lS(t) {
  const e = fe(t, Lt) ? t : new Lt(t), n = e.readUInt8Enum(Ue, (r) => {
    throw new te(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Ue.PublicKeyCompressed:
      return us(Tt.Compressed, yc(e));
    case Ue.PublicKeyUncompressed:
      return us(Tt.Uncompressed, Hs(GS(yc(e).data)));
    case Ue.SignatureCompressed:
      return us(Tt.Compressed, pc(e));
    case Ue.SignatureUncompressed:
      return us(Tt.Uncompressed, pc(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function El(t) {
  return pt(t.data);
}
function uS(t) {
  const e = [];
  switch (t.contents.type) {
    case F.PublicKey:
      e.push(t.pubKeyEncoding === Tt.Compressed ? Ue.PublicKeyCompressed : Ue.PublicKeyUncompressed), e.push(pt(RS(t.contents.data)));
      break;
    case F.MessageSignature:
      e.push(t.pubKeyEncoding === Tt.Compressed ? Ue.SignatureCompressed : Ue.SignatureUncompressed), e.push(El(t.contents));
      break;
  }
  return Ot(e);
}
function gc(t) {
  return t.data.slice();
}
function yc(t) {
  const e = fe(t, Lt) ? t : new Lt(t), n = e.readUInt8(), r = n === 4 ? Fx : Dx;
  return Hs(Ot([n, e.readBytes(r)]));
}
function Al(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === At.P2PKH || e === At.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === At.P2WPKH || e === At.P2WSH || e === At.P2WSHNonSequential) && !r.map((s) => s.data).every(Ns))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case At.P2PKH:
      return zi(t, US(r[0].data));
    case At.P2WPKH:
      return zi(t, HS(r[0].data));
    case At.P2SH:
    case At.P2SHNonSequential:
      return zi(t, NS(n, r.map(gc)));
    case At.P2WSH:
    case At.P2WSHNonSequential:
      return zi(t, PS(n, r.map(gc)));
  }
}
function zi(t, e) {
  return { type: F.Address, version: t, hash160: e };
}
function $l(t) {
  return Kr.c32address(t.version, t.hash160);
}
function Sf(t) {
  const [e, n, r] = t.split(/\.|::/);
  return eS(e, n, r);
}
function Gs(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return nS(e, n);
  } else
    return rS(t);
}
function fS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return pS(e, n);
  } else
    return hS(t);
}
function hS(t) {
  const e = ar(t);
  return { type: lt.PrincipalStandard, value: $l(e) };
}
function dS(t) {
  return { type: lt.PrincipalStandard, value: $l(t) };
}
function pS(t, e) {
  const n = ar(t), r = Pe(e);
  return T0(n, r);
}
function T0(t, e) {
  if (zr(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: lt.PrincipalContract,
    value: `${$l(t)}.${e.content}`
  };
}
function gS(t) {
  return { type: lt.ResponseErr, value: t };
}
function yS(t) {
  return { type: lt.ResponseOk, value: t };
}
const wS = (t) => ({ type: lt.StringASCII, value: t }), bS = (t) => ({ type: lt.StringUTF8, value: t });
function xS(t) {
  for (const e in t)
    if (!OS(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: lt.Tuple, value: t };
}
function Ye(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Lt(pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Lt(t) : e = t;
  switch (e.readUInt8Enum(zt, (r) => {
    throw new te(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case zt.int:
      return Vm(Ra(e.readBytes(16)));
    case zt.uint:
      return Km(e.readBytes(16));
    case zt.buffer:
      const r = e.readUInt32BE();
      return Rm(e.readBytes(r));
    case zt.true:
      return jm();
    case zt.false:
      return zm();
    case zt.address:
      const s = Is(e);
      return dS(s);
    case zt.contract:
      const i = Is(e), o = Ie(e);
      return T0(i, o);
    case zt.ok:
      return yS(Ye(e));
    case zt.err:
      return gS(Ye(e));
    case zt.none:
      return $0();
    case zt.some:
      return v0(Ye(e));
    case zt.list:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Ye(e));
      return qm(c);
    case zt.tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const $ = Ie(e).content;
        if ($ === void 0)
          throw new te('"content" is undefined');
        h[$] = Ye(e);
      }
      return xS(h);
    case zt.ascii:
      const l = e.readUInt32BE(), g = Wy(e.readBytes(l));
      return wS(g);
    case zt.utf8:
      const f = e.readUInt32BE(), y = pi(e.readBytes(f));
      return bS(y);
    default:
      throw new te("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function nn(t, e) {
  return Ot([xl(t), e]);
}
function mS(t) {
  return new Uint8Array([xl(t.type)]);
}
function SS(t) {
  return t.type === lt.OptionalNone ? new Uint8Array([xl(t.type)]) : nn(t.type, Qe(t.value));
}
function ES(t) {
  const e = new Uint8Array(4);
  return vr(e, Math.ceil(t.value.length / 2), 0), nn(t.type, tn(e, pt(t.value)));
}
function AS(t) {
  const e = Wc(Ry(BigInt(t.value), BigInt(Ox)), g0);
  return nn(t.type, e);
}
function $S(t) {
  const e = Wc(BigInt(t.value), g0);
  return nn(t.type, e);
}
function vS(t) {
  return nn(t.type, xi(ar(t.value)));
}
function IS(t) {
  const [e, n] = DS(t.value);
  return nn(t.type, tn(xi(ar(e)), Ls(Pe(n))));
}
function LS(t) {
  return nn(t.type, Qe(t.value));
}
function CS(t) {
  const e = [], n = new Uint8Array(4);
  vr(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Qe(r);
    e.push(s);
  }
  return nn(t.type, Ot(e));
}
function kS(t) {
  const e = [], n = new Uint8Array(4);
  vr(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Pe(s);
    e.push(Ls(i));
    const o = Qe(t.value[s]);
    e.push(o);
  }
  return nn(t.type, Ot(e));
}
function _0(t, e) {
  const n = [], r = e == "ascii" ? qy(t.value) : zr(t.value), s = new Uint8Array(4);
  return vr(s, r.length, 0), n.push(s), n.push(r), nn(t.type, Ot(n));
}
function BS(t) {
  return _0(t, "ascii");
}
function MS(t) {
  return _0(t, "utf8");
}
function Ef(t) {
  return Z(Qe(t));
}
function Qe(t) {
  switch (t.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return mS(t);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return SS(t);
    case lt.Buffer:
      return ES(t);
    case lt.UInt:
      return $S(t);
    case lt.Int:
      return AS(t);
    case lt.PrincipalStandard:
      return vS(t);
    case lt.PrincipalContract:
      return IS(t);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return LS(t);
    case lt.List:
      return CS(t);
    case lt.Tuple:
      return kS(t);
    case lt.StringASCII:
      return BS(t);
    case lt.StringUTF8:
      return MS(t);
    default:
      throw new ls("Unable to serialize. Invalid Clarity Value.");
  }
}
const TS = (t) => t.length % 2 ? `0${t}` : t, _S = (t, e) => t.padEnd(e, "0"), U0 = (t, e) => t ? zr(t).length > e : !1;
function wc(t) {
  return f0(t);
}
const ni = (t) => dm(yl(t)), vl = (t) => Z(Fm(t)), US = (t) => Z(ni(t)), HS = (t) => {
  const e = ni(t), n = tn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ni(n);
  return Z(r);
}, NS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ot(n), s = ni(r);
  return Z(s);
}, PS = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ot(n), s = yl(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ot(i), a = ni(o);
  return Z(a);
};
function OS(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function DS(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Nt.hmacSha256Sync = (t, ...e) => {
  const n = x0.create(yl, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Hs(t) {
  return t = typeof t == "string" ? pt(t) : t, {
    type: F.PublicKey,
    data: t
  };
}
function FS(t, e, n = Tt.Compressed) {
  const r = Qy(e), s = new be(Su(r.r), Su(r.s)), i = ot.fromSignature(t, s, r.recoveryId), o = n === Tt.Compressed;
  return i.toHex(o);
}
function jS(t) {
  return typeof t == "string" ? t : Z(t);
}
const Il = jS;
function H0(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Zy;
}
function Ns(t) {
  return !Il(t).startsWith("04");
}
function zS(t) {
  t = Xc(t);
  const e = H0(t);
  return Z(gi(t.slice(0, 32), e));
}
function RS(t) {
  return ot.fromHex(Il(t)).toHex(!0);
}
function GS(t) {
  return ot.fromHex(Il(t)).toHex(!1);
}
function VS(t, e) {
  t = Xc(t);
  const [n, r] = Fo(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return di(r, 1) + be.fromHex(n).toCompactHex();
}
function Ll() {
  return {
    type: F.MessageSignature,
    data: Z(new Uint8Array(Zo))
  };
}
function N0(t, e, n, r) {
  const s = Al(0, t, 1, [Hs(e)]).hash160, i = Ns(e) ? Tt.Compressed : Tt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Zt(n),
    fee: Zt(r),
    keyEncoding: i,
    signature: Ll()
  };
}
function ri(t) {
  return "signature" in t;
}
function Af(t) {
  return t === At.P2SH || t === At.P2WSH;
}
function KS(t) {
  return t === At.P2SHNonSequential || t === At.P2WSHNonSequential;
}
function $f(t) {
  const e = wc(t);
  return e.nonce = 0, e.fee = 0, ri(e) ? e.signature = Ll() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function qS(t) {
  const e = [
    t.hashMode,
    pt(t.signer),
    ir(t.nonce, 8),
    ir(t.fee, 8),
    t.keyEncoding,
    El(t.signature)
  ];
  return Ot(e);
}
function WS(t) {
  const e = [
    t.hashMode,
    pt(t.signer),
    ir(t.nonce, 8),
    ir(t.fee, 8)
  ], n = ml(t.fields);
  e.push(Sl(n));
  const r = new Uint8Array(2);
  return tw(r, t.signaturesRequired, 0), e.push(r), Ot(e);
}
function XS(t, e) {
  const n = Z(e.readBytes(20)), r = BigInt(`0x${Z(e.readBytes(8))}`), s = BigInt(`0x${Z(e.readBytes(8))}`), i = e.readUInt8Enum(Tt, (a) => {
    throw new te(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === At.P2WPKH && i != Tt.Compressed)
    throw new te("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = pc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function YS(t, e) {
  const n = Z(e.readBytes(20)), r = BigInt("0x" + Z(e.readBytes(8))), s = BigInt("0x" + Z(e.readBytes(8))), i = k0(e, F.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case F.PublicKey:
        Ns(u.contents.data) || (o = !0);
        break;
      case F.MessageSignature:
        if (u.pubKeyEncoding === Tt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new wr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === At.P2WSH || t === At.P2WSHNonSequential))
    throw new wr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ia(t) {
  return ri(t) ? qS(t) : WS(t);
}
function La(t) {
  const e = t.readUInt8Enum(At, (n) => {
    throw new te(`Could not parse ${n} as AddressHashMode`);
  });
  return e === At.P2PKH || e === At.P2WPKH ? XS(e, t) : YS(e, t);
}
function P0(t, e, n, r) {
  const i = t + Z(new Uint8Array([e])) + Z(ir(n, 8)) + Z(ir(r, 8));
  if (pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return vl(pt(i));
}
function O0(t, e, n) {
  const r = 33 + Zo, s = Ns(e.data) ? Tt.Compressed : Tt.Uncompressed, i = t + TS(s.toString(16)) + n, o = pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return vl(o);
}
function ZS(t, e, n, r, s) {
  const i = P0(t, e, n, r), o = VS(s, i), a = Hs(zS(s)), c = O0(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function D0(t, e, n, r, s, i) {
  const o = P0(t, e, n, r), a = Hs(FS(o, i, s)), c = O0(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function QS() {
  const t = N0(At.P2PKH, "", 0, 0);
  return t.signer = Wm().hash160, t.keyEncoding = Tt.Compressed, t.signature = Ll(), t;
}
function vf(t, e, n) {
  return ri(t) ? JS(t, e, n) : t3(t, e, n);
}
function JS(t, e, n) {
  const { pubKey: r, nextSigHash: s } = D0(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Al(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new wr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function t3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case F.PublicKey:
        Ns(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case F.MessageSignature:
        c.pubKeyEncoding === Tt.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = D0(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Af(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new wr("Too many signatures");
        break;
    }
  if (Af(t.hashMode) && o !== t.signaturesRequired || KS(t.hashMode) && o < t.signaturesRequired)
    throw new wr("Incorrect number of signatures");
  if (i && (t.hashMode === At.P2WSH || t.hashMode === At.P2WSHNonSequential))
    throw new wr("Uncompressed keys are not allowed in this hash mode");
  const a = Al(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new wr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function F0(t) {
  return {
    authType: Ut.Standard,
    spendingCondition: t
  };
}
function j0(t, e) {
  return {
    authType: Ut.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || N0(At.P2PKH, "0".repeat(66), 0, 0)
  };
}
function If(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ut.Standard:
        return F0($f(t.spendingCondition));
      case Ut.Sponsored:
        return j0($f(t.spendingCondition), QS());
      default:
        throw new vo("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function e3(t, e) {
  switch (t.authType) {
    case Ut.Standard:
      return vf(t.spendingCondition, e, Ut.Standard);
    case Ut.Sponsored:
      return vf(t.spendingCondition, e, Ut.Standard);
    default:
      throw new vo("Invalid origin auth type");
  }
}
function n3(t, e) {
  switch (t.authType) {
    case Ut.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Zt(e)
      };
      return { ...t, spendingCondition: n };
    case Ut.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Zt(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function r3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Zt(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function s3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Zt(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function i3(t, e) {
  const n = {
    ...e,
    nonce: Zt(e.nonce),
    fee: Zt(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function o3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ut.Standard:
      e.push(Ia(t.spendingCondition));
      break;
    case Ut.Sponsored:
      e.push(Ia(t.spendingCondition)), e.push(Ia(t.sponsorSpendingCondition));
      break;
  }
  return Ot(e);
}
function a3(t) {
  const e = t.readUInt8Enum(Ut, (r) => {
    throw new te(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ut.Standard:
      return n = La(t), F0(n);
    case Ut.Sponsored:
      n = La(t);
      const r = La(t);
      return j0(n, r);
  }
}
class c3 {
  constructor({ auth: e, payload: n, postConditions: r = ml([]), postConditionMode: s = $o.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Hx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Zt(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = pe.Any;
  }
  signBegin() {
    const e = wc(this);
    return e.auth = If(e.auth), e.txid();
  }
  verifyBegin() {
    const e = wc(this);
    return e.auth = If(e.auth), e.txid();
  }
  verifyOrigin() {
    return e3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ut.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ut.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ut.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Hs(e), r = this.auth.spendingCondition;
    if (r && !ri(r)) {
      const s = Ns(n.data);
      r.fields.push(us(s ? Tt.Compressed : Tt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = ZS(n, r, e.fee, e.nonce, s);
    if (ri(e))
      e.signature = hc(i);
    else {
      const a = H0(s);
      e.fields.push(us(a ? Tt.Compressed : Tt.Uncompressed, hc(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return vl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ut.Sponsored)
      throw new vo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = i3(this.auth, e);
  }
  setFee(e) {
    this.auth = n3(this.auth, e);
  }
  setNonce(e) {
    this.auth = r3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ut.Sponsored)
      throw new vo("Cannot sponsor sign a non-sponsored transaction");
    this.auth = s3(this.auth, e);
  }
  serialize() {
    return Z(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new ls('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new ls('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ls('"auth" is undefined');
    if (this.payload === void 0)
      throw new ls('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return vr(n, this.chainId, 0), e.push(n), e.push(o3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Sl(this.postConditions)), e.push(M0(this.payload)), Ot(e);
  }
}
function l3(t) {
  const e = fe(t, Lt) ? t : new Lt(t), n = e.readUInt8Enum(Ur, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = a3(e), i = e.readUInt8Enum(pe, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum($o, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = k0(e, F.PostCondition), c = cS(e), u = new c3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Lf = BigInt("18446744073709551615");
function Ca(t) {
  const e = Zt(t);
  if (e < 0n || e > Lf)
    throw new RangeError(`Post-condition amount must be between 0 and ${Lf} (u64 max), received: ${e}`);
  return e;
}
var bc;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(bc || (bc = {}));
var xc;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(xc || (xc = {}));
function u3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: F.PostCondition,
        conditionType: kt.STX,
        principal: t.address === "origin" ? { type: F.Principal, prefix: ne.Origin } : Gs(t.address),
        conditionCode: Ri(t.condition),
        amount: Ca(t.amount)
      };
    case "ft-postcondition":
      return {
        type: F.PostCondition,
        conditionType: kt.Fungible,
        principal: t.address === "origin" ? { type: F.Principal, prefix: ne.Origin } : Gs(t.address),
        conditionCode: Ri(t.condition),
        amount: Ca(t.amount),
        asset: Sf(t.asset)
      };
    case "nft-postcondition":
      return {
        type: F.PostCondition,
        conditionType: kt.NonFungible,
        principal: t.address === "origin" ? { type: F.Principal, prefix: ne.Origin } : Gs(t.address),
        conditionCode: Ri(t.condition),
        asset: Sf(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: F.PostCondition,
        conditionType: kt.Staking,
        principal: t.address === "origin" ? { type: F.Principal, prefix: ne.Origin } : Gs(t.address),
        conditionCode: Ri(t.condition),
        amount: Ca(t.amount)
      };
    case "pox-postcondition":
      return {
        type: F.PostCondition,
        conditionType: kt.PoX,
        principal: t.address === "origin" ? { type: F.Principal, prefix: ne.Origin } : Gs(t.address),
        conditionCode: f3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ri(t) {
  return bc[t];
}
function f3(t) {
  return xc[t];
}
function z0(t) {
  const e = u3(t);
  return oS(e);
}
function h3(t, e, n) {
  return kl(R0(t), n);
}
function R0(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = si(r);
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
    return BigInt(`0x${g3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Cl(t, e = 8) {
  return (typeof t == "bigint" ? t : R0(t)).toString(16).padStart(e * 2, "0");
}
function kl(t, e = 16) {
  const n = Cl(t, e);
  return si(n);
}
function d3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const p3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function g3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += p3[n];
  return e;
}
function si(t) {
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
function Bl(t) {
  return new TextEncoder().encode(t);
}
function y3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function w3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Cf(t) {
  if (t.some(w3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ml(...t) {
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
function Sn(t) {
  return Ml(...t.map((e) => typeof e == "number" ? Cf([e]) : e instanceof Array ? Cf(e) : e));
}
function ta(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var mc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(mc || (mc = {}));
mc.Mainnet;
const b3 = 128, x3 = 128, G0 = 16;
var Sc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Sc || (Sc = {}));
var kf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(kf || (kf = {}));
var Bf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Bf || (Bf = {}));
var _e;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(_e || (_e = {}));
const ka = ["onChainOnly", "offChainOnly", "any"];
ka[0] + "", _e.OnChainOnly, ka[1] + "", _e.OffChainOnly, ka[2] + "", _e.Any, _e.OnChainOnly + "", _e.OnChainOnly, _e.OffChainOnly + "", _e.OffChainOnly, _e.Any + "", _e.Any;
var Ec;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ec || (Ec = {}));
Ec.Mainnet;
var Mf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Mf || (Mf = {}));
var dr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(dr || (dr = {}));
var Tf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Tf || (Tf = {}));
var _f;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(_f || (_f = {}));
var Uf;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Uf || (Uf = {}));
var Hf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Hf || (Hf = {}));
var Nf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Nf || (Nf = {}));
var Pf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Pf || (Pf = {}));
var Ac;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ac || (Ac = {}));
var Of;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Of || (Of = {}));
var Df;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Df || (Df = {}));
function $c(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function m3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function V0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function S3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $c(t.outputLen), $c(t.blockLen);
}
function E3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function A3(t, e) {
  V0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ba = {
  number: $c,
  bool: m3,
  bytes: V0,
  hash: S3,
  exists: E3,
  output: A3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ma = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qe = (t, e) => t << 32 - e | t >>> e, $3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function v3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function K0(t) {
  if (typeof t == "string" && (t = v3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let I3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Wr(t) {
  const e = (r) => t().update(K0(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function L3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Tl = class extends I3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ma(this.buffer);
  }
  update(e) {
    Ba.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = K0(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ma(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ba.exists(this), Ba.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    L3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ma(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const C3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), q0 = Uint8Array.from({ length: 16 }, (t, e) => e), k3 = q0.map((t) => (9 * t + 5) % 16);
let _l = [q0], Ul = [k3];
for (let t = 0; t < 4; t++)
  for (let e of [_l, Ul])
    e.push(e[t].map((n) => C3[n]));
const W0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), B3 = _l.map((t, e) => t.map((n) => W0[e][n])), M3 = Ul.map((t, e) => t.map((n) => W0[e][n])), T3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Gi = (t, e) => t << e | t >>> 32 - e;
function Ff(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Vi = new Uint32Array(16);
let U3 = class extends Tl {
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
    for (let f = 0; f < 16; f++, n += 4)
      Vi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = T3[f], $ = _3[f], T = _l[f], _ = Ul[f], x = B3[f], I = M3[f];
      for (let A = 0; A < 16; A++) {
        const N = Gi(r + Ff(f, i, a, u) + Vi[T[A]] + w, x[A]) + l | 0;
        r = l, l = u, u = Gi(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Gi(s + Ff(y, o, c, h) + Vi[_[A]] + $, I[A]) + g | 0;
        s = g, g = h, h = Gi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Vi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Wr(() => new U3());
const H3 = (t, e, n) => t & e ^ ~t & n, N3 = (t, e, n) => t & e ^ t & n ^ e & n, P3 = new Uint32Array([
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
]), Rn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Gn = new Uint32Array(64);
let X0 = class extends Tl {
  constructor() {
    super(64, 32, 8, !1), this.A = Rn[0] | 0, this.B = Rn[1] | 0, this.C = Rn[2] | 0, this.D = Rn[3] | 0, this.E = Rn[4] | 0, this.F = Rn[5] | 0, this.G = Rn[6] | 0, this.H = Rn[7] | 0;
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
      Gn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Gn[l - 15], f = Gn[l - 2], y = qe(g, 7) ^ qe(g, 18) ^ g >>> 3, w = qe(f, 17) ^ qe(f, 19) ^ f >>> 10;
      Gn[l] = w + Gn[l - 7] + y + Gn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = qe(a, 6) ^ qe(a, 11) ^ qe(a, 25), f = h + g + H3(a, c, u) + P3[l] + Gn[l] | 0, w = (qe(r, 2) ^ qe(r, 13) ^ qe(r, 22)) + N3(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Gn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O3 = class extends X0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Wr(() => new X0());
Wr(() => new O3());
const Ki = BigInt(2 ** 32 - 1), vc = BigInt(32);
function Y0(t, e = !1) {
  return e ? { h: Number(t & Ki), l: Number(t >> vc & Ki) } : { h: Number(t >> vc & Ki) | 0, l: Number(t & Ki) | 0 };
}
function D3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Y0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const F3 = (t, e) => BigInt(t >>> 0) << vc | BigInt(e >>> 0), j3 = (t, e, n) => t >>> n, z3 = (t, e, n) => t << 32 - n | e >>> n, R3 = (t, e, n) => t >>> n | e << 32 - n, G3 = (t, e, n) => t << 32 - n | e >>> n, V3 = (t, e, n) => t << 64 - n | e >>> n - 32, K3 = (t, e, n) => t >>> n - 32 | e << 64 - n, q3 = (t, e) => e, W3 = (t, e) => t, X3 = (t, e, n) => t << n | e >>> 32 - n, Y3 = (t, e, n) => e << n | t >>> 32 - n, Z3 = (t, e, n) => e << n - 32 | t >>> 64 - n, Q3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function J3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const t4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), e4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, n4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), r4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, s4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), i4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, rt = {
  fromBig: Y0,
  split: D3,
  toBig: F3,
  shrSH: j3,
  shrSL: z3,
  rotrSH: R3,
  rotrSL: G3,
  rotrBH: V3,
  rotrBL: K3,
  rotr32H: q3,
  rotr32L: W3,
  rotlSH: X3,
  rotlSL: Y3,
  rotlBH: Z3,
  rotlBL: Q3,
  add: J3,
  add3L: t4,
  add3H: e4,
  add4L: n4,
  add4H: r4,
  add5H: i4,
  add5L: s4
}, [o4, a4] = rt.split([
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
].map((t) => BigInt(t))), Vn = new Uint32Array(80), Kn = new Uint32Array(80);
let ea = class extends Tl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Vn[x] = e.getUint32(n), Kn[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Vn[x - 15] | 0, A = Kn[x - 15] | 0, N = rt.rotrSH(I, A, 1) ^ rt.rotrSH(I, A, 8) ^ rt.shrSH(I, A, 7), G = rt.rotrSL(I, A, 1) ^ rt.rotrSL(I, A, 8) ^ rt.shrSL(I, A, 7), P = Vn[x - 2] | 0, z = Kn[x - 2] | 0, m = rt.rotrSH(P, z, 19) ^ rt.rotrBH(P, z, 61) ^ rt.shrSH(P, z, 6), L = rt.rotrSL(P, z, 19) ^ rt.rotrBL(P, z, 61) ^ rt.shrSL(P, z, 6), H = rt.add4L(G, L, Kn[x - 7], Kn[x - 16]), q = rt.add4H(H, N, m, Vn[x - 7], Vn[x - 16]);
      Vn[x] = q | 0, Kn[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const I = rt.rotrSH(l, g, 14) ^ rt.rotrSH(l, g, 18) ^ rt.rotrBH(l, g, 41), A = rt.rotrSL(l, g, 14) ^ rt.rotrSL(l, g, 18) ^ rt.rotrBL(l, g, 41), N = l & f ^ ~l & w, G = g & y ^ ~g & $, P = rt.add5L(_, A, G, a4[x], Kn[x]), z = rt.add5H(P, T, I, N, o4[x], Vn[x]), m = P | 0, L = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), H = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = rt.add(u | 0, h | 0, z | 0, m | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = rt.add3L(m, H, Y);
      r = rt.add3H(j, z, L, q), s = j | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = rt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = rt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = rt.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = rt.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = rt.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Vn.fill(0), Kn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, c4 = class extends ea {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, l4 = class extends ea {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, u4 = class extends ea {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Wr(() => new ea());
Wr(() => new c4());
Wr(() => new l4());
Wr(() => new u4());
function f4(t, e, n) {
  const s = b3;
  if (L4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Sc.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Vt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Vt || (Vt = {}));
let h4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Z0 = class extends h4 {
  constructor(e) {
    super(e);
  }
};
function na(t) {
  const e = [];
  return e.push(si(Cl(t.version, 1))), e.push(si(t.hash160)), Sn(e);
}
function d4(t) {
  const e = [];
  return e.push(t.prefix), e.push(na(t.address)), t.prefix === Ac.Contract && e.push(ii(t.contractName)), Sn(e);
}
function ii(t) {
  const e = [], n = Bl(t.content), r = n.byteLength;
  return e.push(si(Cl(r, t.lengthPrefixBytes))), e.push(n), Sn(e);
}
function p4(t) {
  const e = [];
  return e.push(na(t.address)), e.push(ii(t.contractName)), e.push(ii(t.assetName)), Sn(e);
}
function Q0(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(d4(t.principal)), (t.conditionType === dr.Fungible || t.conditionType === dr.NonFungible) && e.push(p4(t.assetInfo)), t.conditionType === dr.NonFungible && e.push(Nr(t.assetName)), e.push(t.conditionCode), t.conditionType === dr.STX || t.conditionType === dr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Z0("The post-condition amount may not be larger than 8 bytes");
    e.push(h3(t.amount, !1, 8));
  }
  return Sn(e);
}
function rn(t, e) {
  return Sn([t, e]);
}
function g4(t) {
  return new Uint8Array([t.type]);
}
function y4(t) {
  return t.type === Vt.OptionalNone ? new Uint8Array([t.type]) : rn(t.type, Nr(t.value));
}
function w4(t) {
  const e = new Uint8Array(4);
  return ta(e, t.buffer.length, 0), rn(t.type, Ml(e, t.buffer));
}
function b4(t) {
  const e = kl(d3(t.value, BigInt(x3)), G0);
  return rn(t.type, e);
}
function x4(t) {
  const e = kl(t.value, G0);
  return rn(t.type, e);
}
function m4(t) {
  return rn(t.type, na(t.address));
}
function S4(t) {
  return rn(t.type, Ml(na(t.address), ii(t.contractName)));
}
function E4(t) {
  return rn(t.type, Nr(t.value));
}
function A4(t) {
  const e = [], n = new Uint8Array(4);
  ta(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Nr(r);
    e.push(s);
  }
  return rn(t.type, Sn(e));
}
function $4(t) {
  const e = [], n = new Uint8Array(4);
  ta(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = f4(s);
    e.push(ii(i));
    const o = Nr(t.data[s]);
    e.push(o);
  }
  return rn(t.type, Sn(e));
}
function J0(t, e) {
  const n = [], r = e == "ascii" ? y3(t.data) : Bl(t.data), s = new Uint8Array(4);
  return ta(s, r.length, 0), n.push(s), n.push(r), rn(t.type, Sn(n));
}
function v4(t) {
  return J0(t, "ascii");
}
function I4(t) {
  return J0(t, "utf8");
}
function Nr(t) {
  switch (t.type) {
    case Vt.BoolTrue:
    case Vt.BoolFalse:
      return g4(t);
    case Vt.OptionalNone:
    case Vt.OptionalSome:
      return y4(t);
    case Vt.Buffer:
      return w4(t);
    case Vt.UInt:
      return x4(t);
    case Vt.Int:
      return b4(t);
    case Vt.PrincipalStandard:
      return m4(t);
    case Vt.PrincipalContract:
      return S4(t);
    case Vt.ResponseOk:
    case Vt.ResponseErr:
      return E4(t);
    case Vt.List:
      return A4(t);
    case Vt.Tuple:
      return $4(t);
    case Vt.StringASCII:
      return v4(t);
    case Vt.StringUTF8:
      return I4(t);
    default:
      throw new Z0("Unable to serialize. Invalid Clarity Value.");
  }
}
const L4 = (t, e) => t ? Bl(t).length > e : !1, C4 = "connect-ui";
let oo, tp, ge = !1, Ic = !1;
const mn = (t, e = "") => () => {
}, k4 = (t, e) => () => {
}, B4 = "{visibility:hidden}.hydrated{visibility:inherit}", jf = {}, M4 = "http://www.w3.org/2000/svg", T4 = "http://www.w3.org/1999/xhtml", _4 = (t) => t != null, Hl = (t) => (t = typeof t, t === "object" || t === "function");
function ep(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const J = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Hl(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Lc(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = Lc(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Lc = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, U4 = {}, H4 = (t) => t && t.$tag$ === U4, N4 = (t, e) => t != null && !Hl(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, P4 = (t) => Ps(t).$hostElement$, O4 = (t, e, n) => {
  const r = Yt.ce(e, n);
  return t.dispatchEvent(r), r;
}, zf = /* @__PURE__ */ new WeakMap(), D4 = (t, e, n) => {
  let r = Io.get(t);
  iE && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Io.set(t, r);
}, F4 = (t, e, n, r) => {
  var s;
  let i = np(e);
  const o = Io.get(i);
  if (t = t.nodeType === 11 ? t : Je, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = zf.get(t), c;
      if (a || zf.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Je.createElement("style"), c.innerHTML = o;
          const u = (s = Yt.$nonce$) !== null && s !== void 0 ? s : ep(Je);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, j4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = mn("attachStyles", e.$tagName$), i = F4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, np = (t, e) => "sc-" + t.$tagName$, Rf = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Vf(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Gf(n), h = Gf(r);
      c.remove(...u.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Vf(ra, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Yt.rel(t, e, n, !1), r && Yt.ael(t, e, r, !1);
    else {
      const c = Hl(r);
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
}, z4 = /\s/, Gf = (t) => t ? t.split(z4) : [], rp = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || jf, o = e.$attrs$ || jf;
  for (r in i)
    r in o || Rf(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Rf(s, r, i[r], o[r], n, e.$flags$);
}, Nl = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Je.createTextNode(s.$text$);
  else {
    if (ge || (ge = s.$tag$ === "svg"), o = s.$elm$ = Je.createElementNS(ge ? M4 : T4, s.$tag$), ge && s.$tag$ === "foreignObject" && (ge = !1), rp(null, s, ge), _4(oo) && o["s-si"] !== oo && o.classList.add(o["s-si"] = oo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Nl(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? ge = !1 : o.tagName === "foreignObject" && (ge = !0);
  }
  return o;
}, sp = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === tp && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Nl(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, ip = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, R4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, h = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--u] : qi(a, h) ? (Vs(a, h), a = e[++s], h = r[++i]) : qi(c, l) ? (Vs(c, l), c = e[--o], l = r[--u]) : qi(a, l) ? (Vs(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : qi(c, h) ? (Vs(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (g = Nl(e && e[i], n, i), h = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? sp(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && ip(e, s, o);
}, qi = (t, e) => t.$tag$ === e.$tag$, Vs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ge = i === "svg" ? !0 : i === "foreignObject" ? !1 : ge, rp(t, e, ge), r !== null && s !== null ? R4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), sp(n, null, e, s, 0, s.length - 1)) : r !== null && ip(r, 0, r.length - 1), ge && i === "svg" && (ge = !1)) : t.$text$ !== o && (n.data = o);
}, G4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Lc(null, null), s = H4(e) ? e : J(null, null, e);
  tp = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, oo = n["s-sc"], Vs(r, s);
}, op = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Pl = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return op(t, t.$ancestorComponent$), aE(() => V4(t, e));
}, V4 = (t, e) => {
  const n = mn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), X4(s, () => K4(t, r, e));
}, K4 = async (t, e, n) => {
  const r = t.$hostElement$, s = mn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && j4(t);
  const o = mn("render", t.$cmpMeta$.$tagName$);
  q4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => W4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, q4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, G4(t, e);
  } catch (r) {
    oi(r, t.$hostElement$);
  }
  return null;
}, W4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = mn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, cp(n), r(), t.$onReadyResolve$(n), s || ap()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Dl(() => Pl(t, !1)), t.$flags$ &= -517;
}, ap = (t) => {
  cp(Je.documentElement), Dl(() => O4(ra, "appload", { detail: { namespace: C4 } }));
}, X4 = (t, e) => t && t.then ? t.then(e) : e(), cp = (t) => t.classList.add("hydrated"), Y4 = (t, e) => Ps(t).$instanceValues$.get(e), Z4 = (t, e, n, r) => {
  const s = Ps(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = N4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Pl(s, !1));
}, lp = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return Y4(this, i);
        },
        set(a) {
          Z4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Yt.jmp(() => {
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
}, Q4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = sE(n), s.then) {
        const c = k4();
        s = await s, c();
      }
      s.isProxied || (lp(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = mn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        oi(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = np(n);
      if (!Io.has(c)) {
        const u = mn("registerStyles", n.$tagName$);
        D4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Pl(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, J4 = (t) => {
  if (!(Yt.$flags$ & 1)) {
    const e = Ps(t), n = e.$cmpMeta$, r = mn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            op(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), Q4(t, e, n);
    }
    r();
  }
}, tE = (t) => {
  Yt.$flags$ & 1 || Ps(t);
}, eE = (t, e = {}) => {
  var n;
  const r = mn(), s = [], i = e.exclude || [], o = ra.customElements, a = Je.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Je.createElement("style"), h = [];
  let l, g = !0;
  Object.assign(Yt, e), Yt.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Je.baseURI).href, t.map((f) => {
    f[1].map((y) => {
      const w = {
        $flags$: y[0],
        $tagName$: y[1],
        $members$: y[2],
        $listeners$: y[3]
      };
      w.$members$ = y[2];
      const $ = w.$tagName$, T = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, rE(_, w), w.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? h.push(this) : Yt.jmp(() => J4(this));
        }
        disconnectedCallback() {
          Yt.jmp(() => tE(this));
        }
        componentOnReady() {
          return Ps(this).$onReadyPromise$;
        }
      };
      w.$lazyBundleId$ = f[0], !i.includes($) && !o.get($) && (s.push($), o.define($, lp(
        T,
        w,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + B4, u.setAttribute("data-styles", "");
    const f = (n = Yt.$nonce$) !== null && n !== void 0 ? n : ep(Je);
    f != null && u.setAttribute("nonce", f), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, h.length ? h.map((f) => f.connectedCallback()) : Yt.jmp(() => l = setTimeout(ap, 30)), r();
}, Ol = /* @__PURE__ */ new WeakMap(), Ps = (t) => Ol.get(t), nE = (t, e) => Ol.set(e.$lazyInstance$ = t, e), rE = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Ol.set(t, n);
}, Vf = (t, e) => e in t, oi = (t, e) => (0, console.error)(t, e), Ta = /* @__PURE__ */ new Map(), sE = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Ta.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Ta.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => Z5).then(o, oi);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Ta.set(s, o), o[r]), oi);
}, Io = /* @__PURE__ */ new Map(), ra = typeof window < "u" ? window : {}, Je = ra.document || { head: {} }, Yt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, up = (t) => Promise.resolve(t), iE = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Kf = [], fp = [], oE = (t, e) => (n) => {
  t.push(n), Ic || (Ic = !0, Yt.$flags$ & 4 ? Dl(Cc) : Yt.raf(Cc));
}, qf = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      oi(n);
    }
  t.length = 0;
}, Cc = () => {
  qf(Kf), qf(fp), (Ic = Kf.length > 0) && Yt.raf(Cc);
}, Dl = (t) => up().then(t), aE = /* @__PURE__ */ oE(fp), cE = () => up(), lE = (t, e) => typeof window > "u" ? Promise.resolve() : cE().then(() => eE([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var uE = Object.defineProperty, fE = Object.defineProperties, hE = Object.getOwnPropertyDescriptors, Lo = Object.getOwnPropertySymbols, hp = Object.prototype.hasOwnProperty, dp = Object.prototype.propertyIsEnumerable, Wf = (t, e, n) => e in t ? uE(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, me = (t, e) => {
  for (var n in e || (e = {})) hp.call(e, n) && Wf(t, n, e[n]);
  if (Lo) for (var n of Lo(e)) dp.call(e, n) && Wf(t, n, e[n]);
  return t;
}, Oe = (t, e) => fE(t, hE(e)), pp = (t, e) => {
  var n = {};
  for (var r in t) hp.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Lo) for (var r of Lo(t)) e.indexOf(r) < 0 && dp.call(t, r) && (n[r] = t[r]);
  return n;
};
function gp() {
  return Yo(Br()) || window.StacksProvider || window.BlockstackProvider;
}
function sa(t) {
  return t ? typeof t == "string" ? Tr.fromName(t) : "version" in t ? t : "url" in t ? new nc({ url: t.url }) : t.transactionVersion === Ur.Mainnet ? new nc({ url: t.client.baseUrl }) : new rc({ url: t.client.baseUrl }) : new rc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var dE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(dE || {}), pE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(pE || {}), Fl = (t) => {
  let e = t;
  if (!e) {
    let n = new Wh(["store_write"], document.location.href);
    e = new ec({ appConfig: n });
  }
  return e;
};
function yp(t) {
  try {
    return Fl(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var wp = (t) => {
  let e = Fl(t).loadUserData().appPrivateKey, n = qt.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function gE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [_r.Mainnet]: "mainnet", [_r.Testnet]: "testnet" }, a = sa(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function yE(t) {
  let e = sa(t.network), n = Fl(t.userSession), r = Oe(me({}, t), { network: e, userSession: n });
  return me({ stxAddress: gE(r) }, r);
}
async function wE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(z0) : n = n.map((r) => Z(Q0(r)))), new qt.TokenSigner("ES256k", e).signAsync(Oe(me({}, t), { postConditions: n }));
}
function bE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(z0) : e = e.map((n) => Z(Q0(n)))), qt.createUnsecuredToken(Oe(me({}, t), { postConditions: e }));
}
var xE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = pt(a.replace(/^0x/, "")), u = l3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Oe(me({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Oe(me({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, mE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = pp(e, ["amount", "appDetails", "userSession"]);
  if (yp(s)) {
    let { privateKey: a, publicKey: c } = wp(s), u = Oe(me({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), wE(u, a);
  }
  let o = Oe(me({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), bE(o);
};
async function SE(t, e, n) {
  let r = await e(Oe(me(me({}, yE(t)), t), { network: sa(t.network) }));
  return xE({ token: r, options: t }, n);
}
function EE(t, e = gp()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return SE(t, mE, e);
}
function bp(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Oe(me({}, t), { message: Ef(e), domain: Ef(n) }) : Oe(me({}, t), { message: Z(Nr(e)), domain: Z(Nr(n)) });
}
async function AE(t, e) {
  return new qt.TokenSigner("ES256k", e).signAsync(bp(t));
}
async function $E(t) {
  let e = t, { userSession: n } = e, r = pp(e, ["userSession"]);
  if (yp(n)) {
    let { privateKey: s, publicKey: i } = wp(n), o = Oe(me({}, r), { publicKey: i });
    return AE(o, s);
  }
  return qt.createUnsecuredToken(bp(t));
}
var vE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(vE || {}), xp = "asigna-stx", Xf = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === xp && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(LE(t, e), "*");
}), IE = { authenticationRequest: async (t) => Xf(t, "authenticationRequest"), transactionRequest: async (t) => Xf(t, "transactionRequest") }, LE = (t, e) => ({ source: xp, [e]: t }), CE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = IE);
};
CE();
var kE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function BE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Br(), o = gp();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    lE();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : kE, c = Sx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (f) => {
      l(), t(n, f);
    }, u.cancelCallback = () => {
      var f;
      l(), (f = n.onCancel) == null || f.call(n);
    }, document.body.appendChild(u);
    let g = (f) => {
      f.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var Wi = BE(EE);
function or(t, e, n) {
  return jl(se(t, e), n);
}
function se(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Mt(r);
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
      const r = _E(BigInt(`0x${ct(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ct(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Yf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function mi(t, e = 8) {
  return (typeof t == "bigint" ? t : se(t, !1)).toString(16).padStart(e * 2, "0");
}
function ia(t) {
  return parseInt(t, 16);
}
function jl(t, e = 16) {
  const n = mi(t, e);
  return Mt(n);
}
function ME(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function TE(t, e) {
  return t & BigInt(1) << e;
}
function _E(t, e) {
  return TE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const UE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ct(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += UE[n];
  return e;
}
function Mt(t) {
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
function Os(t) {
  return new TextEncoder().encode(t);
}
function zl(t) {
  return new TextDecoder().decode(t);
}
function mp(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function HE(t) {
  return String.fromCharCode.apply(null, t);
}
function NE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Zf(t) {
  if (t.some(NE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function oa(...t) {
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
function Dt(t) {
  return oa(...t.map((e) => typeof e == "number" ? Zf([e]) : e instanceof Array ? Zf(e) : e));
}
var Qf;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Qf || (Qf = {}));
var Jf;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Jf || (Jf = {}));
var th;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(th || (th = {}));
const Sp = 33, _a = 32;
function PE(t) {
  if (t.length < _a * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + _a * 2), r = t.slice(2 + _a * 2);
  return {
    recoveryId: ia(e),
    r: n,
    s: r
  };
}
function OE(t) {
  const e = typeof t == "string" ? Mt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function DE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function FE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function jE(t, e) {
  return t[e];
}
function zE(t, e, n = 0) {
  return t[n] = e, t;
}
function RE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Pr(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var kc;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(kc || (kc = {}));
const GE = kc.Mainnet, VE = 128, KE = 128, Ep = 16, Er = 32, Bc = 80, aa = 65, qE = 32, WE = 64, Co = 34;
var X;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(X || (X = {}));
var it;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var Mc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Mc || (Mc = {}));
var le;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(le || (le = {}));
const ao = ["onChainOnly", "offChainOnly", "any"], eh = {
  [ao[0]]: le.OnChainOnly,
  [ao[1]]: le.OffChainOnly,
  [ao[2]]: le.Any,
  [le.OnChainOnly]: le.OnChainOnly,
  [le.OffChainOnly]: le.OffChainOnly,
  [le.Any]: le.Any
};
function XE(t) {
  if (t in eh)
    return eh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ao.join(", ")}`);
}
var ko;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ko || (ko = {}));
ko.Mainnet;
var Cs;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Cs || (Cs = {}));
var ue;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ue || (ue = {}));
var Ht;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ht || (Ht = {}));
var $t;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})($t || ($t = {}));
var Bo;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Bo || (Bo = {}));
var _t;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(_t || (_t = {}));
var ai;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ai || (ai = {}));
var Tc;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Tc || (Tc = {}));
var ci;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ci || (ci = {}));
var nh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(nh || (nh = {}));
var rh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(rh || (rh = {}));
function _c(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function YE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ap(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ZE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _c(t.outputLen), _c(t.blockLen);
}
function QE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function JE(t, e) {
  Ap(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xr = {
  number: _c,
  bool: YE,
  bytes: Ap,
  hash: ZE,
  exists: QE,
  output: JE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ua = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), We = (t, e) => t << 32 - e | t >>> e, tA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!tA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function eA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Rl(t) {
  if (typeof t == "string" && (t = eA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class $p {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Xr(t) {
  const e = (r) => t().update(Rl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function nA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Gl extends $p {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ua(this.buffer);
  }
  update(e) {
    xr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Rl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ua(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    xr.exists(this), xr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    nA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ua(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const rA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), vp = Uint8Array.from({ length: 16 }, (t, e) => e), sA = vp.map((t) => (9 * t + 5) % 16);
let Vl = [vp], Kl = [sA];
for (let t = 0; t < 4; t++)
  for (let e of [Vl, Kl])
    e.push(e[t].map((n) => rA[n]));
const Ip = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), iA = Vl.map((t, e) => t.map((n) => Ip[e][n])), oA = Kl.map((t, e) => t.map((n) => Ip[e][n])), aA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), cA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Xi = (t, e) => t << e | t >>> 32 - e;
function sh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Yi = new Uint32Array(16);
class lA extends Gl {
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
    for (let f = 0; f < 16; f++, n += 4)
      Yi[f] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, g = l;
    for (let f = 0; f < 5; f++) {
      const y = 4 - f, w = aA[f], $ = cA[f], T = Vl[f], _ = Kl[f], x = iA[f], I = oA[f];
      for (let A = 0; A < 16; A++) {
        const N = Xi(r + sh(f, i, a, u) + Yi[T[A]] + w, x[A]) + l | 0;
        r = l, l = u, u = Xi(a, 10) | 0, a = i, i = N;
      }
      for (let A = 0; A < 16; A++) {
        const N = Xi(s + sh(y, o, c, h) + Yi[_[A]] + $, I[A]) + g | 0;
        s = g, g = h, h = Xi(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Yi.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const uA = Xr(() => new lA()), fA = (t, e, n) => t & e ^ ~t & n, hA = (t, e, n) => t & e ^ t & n ^ e & n, dA = new Uint32Array([
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
]), qn = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wn = new Uint32Array(64);
class Lp extends Gl {
  constructor() {
    super(64, 32, 8, !1), this.A = qn[0] | 0, this.B = qn[1] | 0, this.C = qn[2] | 0, this.D = qn[3] | 0, this.E = qn[4] | 0, this.F = qn[5] | 0, this.G = qn[6] | 0, this.H = qn[7] | 0;
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
      Wn[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Wn[l - 15], f = Wn[l - 2], y = We(g, 7) ^ We(g, 18) ^ g >>> 3, w = We(f, 17) ^ We(f, 19) ^ f >>> 10;
      Wn[l] = w + Wn[l - 7] + y + Wn[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const g = We(a, 6) ^ We(a, 11) ^ We(a, 25), f = h + g + fA(a, c, u) + dA[l] + Wn[l] | 0, w = (We(r, 2) ^ We(r, 13) ^ We(r, 22)) + hA(r, s, i) | 0;
      h = u, u = c, c = a, a = o + f | 0, o = i, i = s, s = r, r = f + w | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Wn.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class pA extends Lp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ql = Xr(() => new Lp());
Xr(() => new pA());
const Zi = BigInt(2 ** 32 - 1), Uc = BigInt(32);
function Cp(t, e = !1) {
  return e ? { h: Number(t & Zi), l: Number(t >> Uc & Zi) } : { h: Number(t >> Uc & Zi) | 0, l: Number(t & Zi) | 0 };
}
function gA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Cp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const yA = (t, e) => BigInt(t >>> 0) << Uc | BigInt(e >>> 0), wA = (t, e, n) => t >>> n, bA = (t, e, n) => t << 32 - n | e >>> n, xA = (t, e, n) => t >>> n | e << 32 - n, mA = (t, e, n) => t << 32 - n | e >>> n, SA = (t, e, n) => t << 64 - n | e >>> n - 32, EA = (t, e, n) => t >>> n - 32 | e << 64 - n, AA = (t, e) => e, $A = (t, e) => t, vA = (t, e, n) => t << n | e >>> 32 - n, IA = (t, e, n) => e << n | t >>> 32 - n, LA = (t, e, n) => e << n - 32 | t >>> 64 - n, CA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function kA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const BA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), MA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, TA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _A = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, UA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), HA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, st = {
  fromBig: Cp,
  split: gA,
  toBig: yA,
  shrSH: wA,
  shrSL: bA,
  rotrSH: xA,
  rotrSL: mA,
  rotrBH: SA,
  rotrBL: EA,
  rotr32H: AA,
  rotr32L: $A,
  rotlSH: vA,
  rotlSL: IA,
  rotlBH: LA,
  rotlBL: CA,
  add: kA,
  add3L: BA,
  add3H: MA,
  add4L: TA,
  add4H: _A,
  add5H: HA,
  add5L: UA
}, [NA, PA] = st.split([
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
].map((t) => BigInt(t))), Xn = new Uint32Array(80), Yn = new Uint32Array(80);
class ca extends Gl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: g, Gh: f, Gl: y, Hh: w, Hl: $ } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, g, f, y, w, $) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = f | 0, this.Gl = y | 0, this.Hh = w | 0, this.Hl = $ | 0;
  }
  process(e, n) {
    for (let x = 0; x < 16; x++, n += 4)
      Xn[x] = e.getUint32(n), Yn[x] = e.getUint32(n += 4);
    for (let x = 16; x < 80; x++) {
      const I = Xn[x - 15] | 0, A = Yn[x - 15] | 0, N = st.rotrSH(I, A, 1) ^ st.rotrSH(I, A, 8) ^ st.shrSH(I, A, 7), G = st.rotrSL(I, A, 1) ^ st.rotrSL(I, A, 8) ^ st.shrSL(I, A, 7), P = Xn[x - 2] | 0, z = Yn[x - 2] | 0, m = st.rotrSH(P, z, 19) ^ st.rotrBH(P, z, 61) ^ st.shrSH(P, z, 6), L = st.rotrSL(P, z, 19) ^ st.rotrBL(P, z, 61) ^ st.shrSL(P, z, 6), H = st.add4L(G, L, Yn[x - 7], Yn[x - 16]), q = st.add4H(H, N, m, Xn[x - 7], Xn[x - 16]);
      Xn[x] = q | 0, Yn[x] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: g, Fh: f, Fl: y, Gh: w, Gl: $, Hh: T, Hl: _ } = this;
    for (let x = 0; x < 80; x++) {
      const I = st.rotrSH(l, g, 14) ^ st.rotrSH(l, g, 18) ^ st.rotrBH(l, g, 41), A = st.rotrSL(l, g, 14) ^ st.rotrSL(l, g, 18) ^ st.rotrBL(l, g, 41), N = l & f ^ ~l & w, G = g & y ^ ~g & $, P = st.add5L(_, A, G, PA[x], Yn[x]), z = st.add5H(P, T, I, N, NA[x], Xn[x]), m = P | 0, L = st.rotrSH(r, s, 28) ^ st.rotrBH(r, s, 34) ^ st.rotrBH(r, s, 39), H = st.rotrSL(r, s, 28) ^ st.rotrBL(r, s, 34) ^ st.rotrBL(r, s, 39), q = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      T = w | 0, _ = $ | 0, w = f | 0, $ = y | 0, f = l | 0, y = g | 0, { h: l, l: g } = st.add(u | 0, h | 0, z | 0, m | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const j = st.add3L(m, H, Y);
      r = st.add3H(j, z, L, q), s = j | 0;
    }
    ({ h: r, l: s } = st.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = st.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = st.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = st.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: g } = st.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h: f, l: y } = st.add(this.Fh | 0, this.Fl | 0, f | 0, y | 0), { h: w, l: $ } = st.add(this.Gh | 0, this.Gl | 0, w | 0, $ | 0), { h: T, l: _ } = st.add(this.Hh | 0, this.Hl | 0, T | 0, _ | 0), this.set(r, s, i, o, a, c, u, h, l, g, f, y, w, $, T, _);
  }
  roundClean() {
    Xn.fill(0), Yn.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class OA extends ca {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class DA extends ca {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class FA extends ca {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Xr(() => new ca());
Xr(() => new OA());
const jA = Xr(() => new DA());
Xr(() => new FA());
function kp(t) {
  if (Mt(t).byteLength != aa)
    throw Error("Invalid signature");
  return {
    type: X.MessageSignature,
    data: t
  };
}
function Ks(t, e) {
  return { type: X.Address, version: t, hash160: e };
}
function fs(t) {
  return Kr.c32address(t.version, t.hash160);
}
function Or(t, e, n) {
  const r = e || 1, s = n || VE;
  if (Kp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: X.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Wl(t) {
  const e = Kr.c32addressDecode(t);
  return {
    type: X.Address,
    version: e[0],
    hash160: e[1]
  };
}
var U;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(U || (U = {}));
function zA(t) {
  if (t.type === U.PrincipalStandard)
    return fs(t.address);
  if (t.type === U.PrincipalContract)
    return `${fs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Bp(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return VA(e, n);
  } else
    return RA(t);
}
function RA(t) {
  const e = Wl(t);
  return { type: U.PrincipalStandard, address: e };
}
function GA(t) {
  return { type: U.PrincipalStandard, address: t };
}
function VA(t, e) {
  const n = Wl(t), r = Or(e);
  return Mp(n, r);
}
function Mp(t, e) {
  if (Os(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: U.PrincipalContract, address: t, contractName: e };
}
function Ha(t, e = !1) {
  switch (t.type) {
    case U.BoolTrue:
      return !0;
    case U.BoolFalse:
      return !1;
    case U.Int:
    case U.UInt:
      return e ? t.value.toString() : t.value;
    case U.Buffer:
      return `0x${ct(t.buffer)}`;
    case U.OptionalNone:
      return null;
    case U.OptionalSome:
      return yn(t.value);
    case U.ResponseErr:
      return yn(t.value);
    case U.ResponseOk:
      return yn(t.value);
    case U.PrincipalStandard:
    case U.PrincipalContract:
      return zA(t);
    case U.List:
      return t.list.map((r) => yn(r));
    case U.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = yn(t.data[r]);
      }), n;
    case U.StringASCII:
      return t.data;
    case U.StringUTF8:
      return t.data;
  }
}
function yn(t) {
  switch (t.type) {
    case U.ResponseErr:
      return { type: tr(t), value: Ha(t, !0), success: !1 };
    case U.ResponseOk:
      return { type: tr(t), value: Ha(t, !0), success: !0 };
    default:
      return { type: tr(t), value: Ha(t, !0) };
  }
}
function tr(t) {
  switch (t.type) {
    case U.BoolTrue:
    case U.BoolFalse:
      return "bool";
    case U.Int:
      return "int";
    case U.UInt:
      return "uint";
    case U.Buffer:
      return `(buff ${t.buffer.length})`;
    case U.OptionalNone:
      return "(optional none)";
    case U.OptionalSome:
      return `(optional ${tr(t.value)})`;
    case U.ResponseErr:
      return `(response UnknownType ${tr(t.value)})`;
    case U.ResponseOk:
      return `(response ${tr(t.value)} UnknownType)`;
    case U.PrincipalStandard:
    case U.PrincipalContract:
      return "principal";
    case U.List:
      return `(list ${t.list.length} ${t.list.length ? tr(t.list[0]) : "UnknownType"})`;
    case U.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${tr(t.data[e])})`).join(" ")})`;
    case U.StringASCII:
      return `(string-ascii ${mp(t.data).length})`;
    case U.StringUTF8:
      return `(string-utf8 ${Os(t.data).length})`;
  }
}
const Tp = () => ({ type: U.BoolTrue }), _p = () => ({ type: U.BoolFalse }), KA = (t) => t ? Tp() : _p(), ih = BigInt("0xffffffffffffffffffffffffffffffff"), qA = BigInt(0), oh = BigInt("0x7fffffffffffffffffffffffffffffff"), ah = BigInt("-170141183460469231731687303715884105728"), WA = (t) => {
  const e = se(t, !0);
  if (e > oh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${oh}`);
  if (e < ah)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ah}`);
  return { type: U.Int, value: e };
}, Mo = (t) => {
  const e = se(t, !1);
  if (e < qA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ih)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ih}`);
  return { type: U.UInt, value: e };
}, Up = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: U.Buffer, buffer: t };
};
function Hp() {
  return { type: U.OptionalNone };
}
function Np(t) {
  return { type: U.OptionalSome, value: t };
}
function XA(t) {
  return { type: U.ResponseErr, value: t };
}
function YA(t) {
  return { type: U.ResponseOk, value: t };
}
function ZA(t) {
  return { type: U.List, list: t };
}
function Hc(t) {
  for (const e in t)
    if (!F8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: U.Tuple, data: t };
}
const as = (t) => ({ type: U.StringASCII, data: t }), QA = (t) => ({ type: U.StringUTF8, data: t });
class Pp extends $p {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, xr.hash(e);
    const r = Rl(n);
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
    return xr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    xr.exists(this), xr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Op = (t, e, n) => new Pp(t, e).update(n).digest();
Op.create = (t, e) => new Pp(t, e);
Nt.hmacSha256Sync = (t, ...e) => {
  const n = Op.create(ql, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ks(t) {
  return {
    type: X.PublicKey,
    data: Mt(t)
  };
}
function JA(t, e, n = _t.Compressed) {
  const r = PE(e.data), s = new be(Yf(r.r), Yf(r.s)), i = ot.fromSignature(t, s, r.recoveryId), o = n === _t.Compressed;
  return i.toHex(o);
}
function t8(t) {
  return { type: X.PublicKey, data: t };
}
function Ds(t) {
  return !ct(t.data).startsWith("04");
}
function To(t) {
  return t.data.slice();
}
function e8(t) {
  const e = s8(t), n = gi(e.data.slice(0, 32), e.compressed);
  return ks(ct(n));
}
function n8(t) {
  const e = typeof t == "string" ? t : ct(t), n = ot.fromHex(e).toHex(!0);
  return ks(n);
}
function r8(t) {
  const e = typeof t == "string" ? t : ct(t), n = ot.fromHex(e).toHex(!1);
  return ks(n);
}
function Nc(t) {
  const e = t.readUInt8(), n = e === 4 ? WE : qE;
  return t8(Dt([e, t.readBytes(n)]));
}
function s8(t) {
  const e = OE(t), n = e.length == Sp;
  return { data: e, compressed: n };
}
function i8(t, e) {
  const [n, r] = Fo(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = mi(r, 1) + be.fromHex(n).toCompactHex();
  return kp(i);
}
function o8(t) {
  return e8(t.data);
}
function a8(t, e, n) {
  return typeof t == "string" && (t = Bp(t)), typeof n == "string" && (n = uh(n)), {
    type: X.Payload,
    payloadType: it.TokenTransfer,
    recipient: t,
    amount: se(e, !1),
    memo: n ?? uh("")
  };
}
function c8(t, e, n, r) {
  return typeof t == "string" && (t = Wl(t)), typeof e == "string" && (e = Or(e)), typeof n == "string" && (n = Or(n)), {
    type: X.Payload,
    payloadType: it.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function ch(t, e, n) {
  return typeof t == "string" && (t = Or(t)), typeof e == "string" && (e = w8(e)), typeof n == "number" ? {
    type: X.Payload,
    payloadType: it.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: X.Payload,
    payloadType: it.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function l8() {
  return { type: X.Payload, payloadType: it.PoisonMicroblock };
}
function lh(t, e) {
  if (t.byteLength != Er)
    throw Error(`Coinbase buffer size must be ${Er} bytes`);
  return e != null ? {
    type: X.Payload,
    payloadType: it.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: X.Payload,
    payloadType: it.Coinbase,
    coinbaseBytes: t
  };
}
function u8(t, e, n) {
  if (t.byteLength != Er)
    throw Error(`Coinbase buffer size must be ${Er} bytes`);
  if (n.byteLength != Bc)
    throw Error(`VRF proof buffer size must be ${Bc} bytes`);
  return {
    type: X.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === U.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Pc;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Pc || (Pc = {}));
function f8(t, e, n, r, s, i, o) {
  return {
    type: X.Payload,
    payloadType: it.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Dp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case it.TokenTransfer:
      e.push(Pt(t.recipient)), e.push(or(t.amount, !1, 8)), e.push(pn(t.memo));
      break;
    case it.ContractCall:
      e.push(pn(t.contractAddress)), e.push(pn(t.contractName)), e.push(pn(t.functionName));
      const n = new Uint8Array(4);
      Pr(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Pt(r));
      });
      break;
    case it.SmartContract:
      e.push(pn(t.contractName)), e.push(pn(t.codeBody));
      break;
    case it.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(pn(t.contractName)), e.push(pn(t.codeBody));
      break;
    case it.PoisonMicroblock:
      break;
    case it.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case it.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Pt(t.recipient));
      break;
    case it.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Pt(t.recipient ? Np(t.recipient) : Hp())), e.push(t.vrfProof);
      break;
    case it.TenureChange:
      e.push(Mt(t.tenureHash)), e.push(Mt(t.previousTenureHash)), e.push(Mt(t.burnViewHash)), e.push(Mt(t.previousTenureEnd)), e.push(Pr(new Uint8Array(4), t.previousTenureBlocks)), e.push(zE(new Uint8Array(1), t.cause)), e.push(Mt(t.publicKeyHash));
      break;
  }
  return Dt(e);
}
function h8(t) {
  switch (t.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = Ce(t), r = se(t.readBytes(8), !1), s = jp(t);
      return a8(n, r, s);
    case it.ContractCall:
      const i = Bs(t), o = Le(t), a = Le(t), c = [], u = t.readUInt32BE();
      for (let x = 0; x < u; x++) {
        const I = Ce(t);
        c.push(I);
      }
      return c8(i, o, a, c);
    case it.SmartContract:
      const h = Le(t), l = Le(t, 4, 1e5);
      return ch(h, l);
    case it.VersionedSmartContract: {
      const x = t.readUInt8Enum(Mc, (N) => {
        throw new Error(`Cannot recognize ClarityVersion: ${N}`);
      }), I = Le(t), A = Le(t, 4, 1e5);
      return ch(I, A, x);
    }
    case it.PoisonMicroblock:
      return l8();
    case it.Coinbase: {
      const x = t.readBytes(Er);
      return lh(x);
    }
    case it.CoinbaseToAltRecipient: {
      const x = t.readBytes(Er), I = Ce(t);
      return lh(x, I);
    }
    case it.NakamotoCoinbase: {
      const x = t.readBytes(Er), I = Ce(t), A = t.readBytes(Bc);
      return u8(x, I, A);
    }
    case it.TenureChange:
      const g = ct(t.readBytes(20)), f = ct(t.readBytes(20)), y = ct(t.readBytes(20)), w = ct(t.readBytes(32)), $ = t.readUInt32BE(), T = t.readUInt8Enum(Pc, (x) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${x}`);
      }), _ = ct(t.readBytes(20));
      return f8(g, f, y, w, $, T, _);
  }
}
class la extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class pr extends la {
  constructor(e) {
    super(e);
  }
}
class we extends la {
  constructor(e) {
    super(e);
  }
}
class _o extends la {
  constructor(e) {
    super(e);
  }
}
class mr extends la {
  constructor(e) {
    super(e);
  }
}
var He;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(He || (He = {}));
function Oc(t) {
  return kp(ct(t.readBytes(aa)));
}
function hs(t, e) {
  return {
    pubKeyEncoding: t,
    type: X.TransactionAuthField,
    contents: e
  };
}
function d8(t) {
  const e = t.readUInt8Enum(He, (n) => {
    throw new we(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case He.PublicKeyCompressed:
      return hs(_t.Compressed, Nc(t));
    case He.PublicKeyUncompressed:
      return hs(_t.Uncompressed, r8(Nc(t).data));
    case He.SignatureCompressed:
      return hs(_t.Compressed, Oc(t));
    case He.SignatureUncompressed:
      return hs(_t.Uncompressed, Oc(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Xl(t) {
  return Mt(t.data);
}
function p8(t) {
  const e = [];
  switch (t.contents.type) {
    case X.PublicKey:
      e.push(t.pubKeyEncoding === _t.Compressed ? He.PublicKeyCompressed : He.PublicKeyUncompressed), e.push(To(n8(t.contents.data)));
      break;
    case X.MessageSignature:
      e.push(t.pubKeyEncoding === _t.Compressed ? He.SignatureCompressed : He.SignatureUncompressed), e.push(Xl(t.contents));
      break;
  }
  return Dt(e);
}
function pn(t) {
  switch (t.type) {
    case X.Address:
      return Si(t);
    case X.Principal:
      return Fp(t);
    case X.LengthPrefixedString:
      return Ms(t);
    case X.MemoString:
      return b8(t);
    case X.AssetInfo:
      return zp(t);
    case X.PostCondition:
      return x8(t);
    case X.PublicKey:
      return To(t);
    case X.LengthPrefixedList:
      return Ql(t);
    case X.Payload:
      return Dp(t);
    case X.TransactionAuthField:
      return p8(t);
    case X.MessageSignature:
      return Xl(t);
  }
}
function g8() {
  return {
    type: X.Address,
    version: Bo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Yl(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === $t.SerializeP2PKH || e === $t.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === $t.SerializeP2WPKH || e === $t.SerializeP2WSH || e === $t.SerializeP2WSHNonSequential) && !r.every(Ds))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case $t.SerializeP2PKH:
      return Ks(t, N8(r[0].data));
    case $t.SerializeP2WPKH:
      return Ks(t, P8(r[0].data));
    case $t.SerializeP2SH:
    case $t.SerializeP2SHNonSequential:
      return Ks(t, O8(n, r.map(To)));
    case $t.SerializeP2WSH:
    case $t.SerializeP2WSHNonSequential:
      return Ks(t, D8(n, r.map(To)));
  }
}
function Si(t) {
  const e = [];
  return e.push(Mt(mi(t.version, 1))), e.push(Mt(t.hash160)), Dt(e);
}
function Bs(t) {
  const e = ia(ct(t.readBytes(1))), n = ct(t.readBytes(20));
  return { type: X.Address, version: e, hash160: n };
}
function Fp(t) {
  const e = [];
  return e.push(t.prefix), e.push(Si(t.address)), t.prefix === ci.Contract && e.push(Ms(t.contractName)), Dt(e);
}
function y8(t) {
  const e = t.readUInt8Enum(ci, (s) => {
    throw new we(`Unexpected Principal payload type: ${s}`);
  }), n = Bs(t);
  if (e === ci.Standard)
    return { type: X.Principal, prefix: e, address: n };
  const r = Le(t);
  return {
    type: X.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ms(t) {
  const e = [], n = Os(t.content), r = n.byteLength;
  return e.push(Mt(mi(r, t.lengthPrefixBytes))), e.push(n), Dt(e);
}
function Le(t, e, n) {
  e = e || 1;
  const r = ia(ct(t.readBytes(e))), s = zl(t.readBytes(r));
  return Or(s, e, n ?? 128);
}
function w8(t) {
  return Or(t, 4, 1e5);
}
function uh(t) {
  if (t && Kp(t, Co))
    throw new Error(`Memo exceeds maximum length of ${Co} bytes`);
  return { type: X.MemoString, content: t };
}
function b8(t) {
  const e = [], n = Os(t.content), r = H8(ct(n), Co * 2);
  return e.push(Mt(r)), Dt(e);
}
function jp(t) {
  let e = zl(t.readBytes(Co));
  return e = e.replace(/\u0000*$/, ""), { type: X.MemoString, content: e };
}
function zp(t) {
  const e = [];
  return e.push(Si(t.address)), e.push(Ms(t.contractName)), e.push(Ms(t.assetName)), Dt(e);
}
function Dc(t) {
  return {
    type: X.AssetInfo,
    address: Bs(t),
    contractName: Le(t),
    assetName: Le(t)
  };
}
function Zl(t, e) {
  return {
    type: X.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ql(t) {
  const e = t.values, n = [];
  n.push(Mt(mi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(pn(r));
  return Dt(n);
}
function Rp(t, e, n) {
  const r = ia(ct(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case X.Address:
        s.push(Bs(t));
        break;
      case X.LengthPrefixedString:
        s.push(Le(t));
        break;
      case X.MemoString:
        s.push(jp(t));
        break;
      case X.AssetInfo:
        s.push(Dc(t));
        break;
      case X.PostCondition:
        s.push(m8(t));
        break;
      case X.PublicKey:
        s.push(Nc(t));
        break;
      case X.TransactionAuthField:
        s.push(d8(t));
        break;
    }
  return Zl(s, n);
}
function x8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Fp(t.principal)), (t.conditionType === ue.Fungible || t.conditionType === ue.NonFungible) && e.push(zp(t.assetInfo)), t.conditionType === ue.NonFungible && e.push(Pt(t.assetName)), e.push(t.conditionCode), t.conditionType === ue.STX || t.conditionType === ue.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new pr("The post-condition amount may not be larger than 8 bytes");
    e.push(or(t.amount, !1, 8));
  }
  return Dt(e);
}
function m8(t) {
  const e = t.readUInt8Enum(ue, (o) => {
    throw new we(`Could not read ${o} as PostConditionType`);
  }), n = y8(t);
  let r, s, i;
  switch (e) {
    case ue.STX:
      return r = t.readUInt8Enum(ai, (a) => {
        throw new we(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ct(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: ue.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case ue.Fungible:
      return s = Dc(t), r = t.readUInt8Enum(ai, (a) => {
        throw new we(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${ct(t.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: ue.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case ue.NonFungible:
      s = Dc(t);
      const o = Ce(t);
      return r = t.readUInt8Enum(Tc, (a) => {
        throw new we(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: X.PostCondition,
        conditionType: ue.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function sn(t, e) {
  return Dt([t, e]);
}
function S8(t) {
  return new Uint8Array([t.type]);
}
function E8(t) {
  return t.type === U.OptionalNone ? new Uint8Array([t.type]) : sn(t.type, Pt(t.value));
}
function A8(t) {
  const e = new Uint8Array(4);
  return Pr(e, t.buffer.length, 0), sn(t.type, oa(e, t.buffer));
}
function $8(t) {
  const e = jl(ME(t.value, BigInt(KE)), Ep);
  return sn(t.type, e);
}
function v8(t) {
  const e = jl(t.value, Ep);
  return sn(t.type, e);
}
function I8(t) {
  return sn(t.type, Si(t.address));
}
function L8(t) {
  return sn(t.type, oa(Si(t.address), Ms(t.contractName)));
}
function C8(t) {
  return sn(t.type, Pt(t.value));
}
function k8(t) {
  const e = [], n = new Uint8Array(4);
  Pr(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Pt(r);
    e.push(s);
  }
  return sn(t.type, Dt(e));
}
function B8(t) {
  const e = [], n = new Uint8Array(4);
  Pr(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Or(s);
    e.push(Ms(i));
    const o = Pt(t.data[s]);
    e.push(o);
  }
  return sn(t.type, Dt(e));
}
function Gp(t, e) {
  const n = [], r = e == "ascii" ? mp(t.data) : Os(t.data), s = new Uint8Array(4);
  return Pr(s, r.length, 0), n.push(s), n.push(r), sn(t.type, Dt(n));
}
function M8(t) {
  return Gp(t, "ascii");
}
function T8(t) {
  return Gp(t, "utf8");
}
function Pt(t) {
  switch (t.type) {
    case U.BoolTrue:
    case U.BoolFalse:
      return S8(t);
    case U.OptionalNone:
    case U.OptionalSome:
      return E8(t);
    case U.Buffer:
      return A8(t);
    case U.UInt:
      return v8(t);
    case U.Int:
      return $8(t);
    case U.PrincipalStandard:
      return I8(t);
    case U.PrincipalContract:
      return L8(t);
    case U.ResponseOk:
    case U.ResponseErr:
      return C8(t);
    case U.List:
      return k8(t);
    case U.Tuple:
      return B8(t);
    case U.StringASCII:
      return M8(t);
    case U.StringUTF8:
      return T8(t);
    default:
      throw new pr("Unable to serialize. Invalid Clarity Value.");
  }
}
function _8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const fh = /* @__PURE__ */ new Map();
function Vp(t, e) {
  const n = fh.get(t);
  if (n !== void 0)
    return n(e);
  const r = _8(t);
  return fh.set(t, r), Vp(t, e);
}
class Zs {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return RE(this.readBytes(4), 0);
  }
  readUInt8() {
    return jE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return DE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ct(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ct(n);
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
    if (Vp(e, r))
      return r;
    throw n(r);
  }
}
function Ce(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Zs(Mt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Zs(t) : e = t;
  switch (e.readUInt8Enum(U, (r) => {
    throw new we(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case U.Int:
      return WA(e.readBytes(16));
    case U.UInt:
      return Mo(e.readBytes(16));
    case U.Buffer:
      const r = e.readUInt32BE();
      return Up(e.readBytes(r));
    case U.BoolTrue:
      return Tp();
    case U.BoolFalse:
      return _p();
    case U.PrincipalStandard:
      const s = Bs(e);
      return GA(s);
    case U.PrincipalContract:
      const i = Bs(e), o = Le(e);
      return Mp(i, o);
    case U.ResponseOk:
      return YA(Ce(e));
    case U.ResponseErr:
      return XA(Ce(e));
    case U.OptionalNone:
      return Hp();
    case U.OptionalSome:
      return Np(Ce(e));
    case U.List:
      const a = e.readUInt32BE(), c = [];
      for (let w = 0; w < a; w++)
        c.push(Ce(e));
      return ZA(c);
    case U.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let w = 0; w < u; w++) {
        const $ = Le(e).content;
        if ($ === void 0)
          throw new we('"content" is undefined');
        h[$] = Ce(e);
      }
      return Hc(h);
    case U.StringASCII:
      const l = e.readUInt32BE(), g = HE(e.readBytes(l));
      return as(g);
    case U.StringUTF8:
      const f = e.readUInt32BE(), y = zl(e.readBytes(f));
      return QA(y);
    default:
      throw new we("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const U8 = (t) => t.length % 2 == 0 ? t : `0${t}`, H8 = (t, e) => t.padEnd(e, "0"), Kp = (t, e) => t ? Os(t).length > e : !1;
function Fc(t) {
  return f0(t);
}
const li = (t) => uA(ql(t)), Jl = (t) => ct(jA(t)), N8 = (t) => ct(li(t)), P8 = (t) => {
  const e = li(t), n = oa(new Uint8Array([0]), new Uint8Array([e.length]), e), r = li(n);
  return ct(r);
}, O8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = li(r);
  return ct(s);
}, D8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Dt(n), s = ql(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Dt(i), a = li(o);
  return ct(a);
};
function F8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function qp(t) {
  const e = Pt(t);
  return `0x${ct(e)}`;
}
function j8(t) {
  return Ce(t);
}
const ps = (t) => {
  try {
    return Kr.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function tu() {
  return {
    type: X.MessageSignature,
    data: ct(new Uint8Array(aa))
  };
}
function Wp(t, e, n, r) {
  const s = Yl(0, t, 1, [ks(e)]).hash160, i = Ds(ks(e)) ? _t.Compressed : _t.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: se(n, !1),
    fee: se(r, !1),
    keyEncoding: i,
    signature: tu()
  };
}
function ui(t) {
  return "signature" in t;
}
function hh(t) {
  return t === $t.SerializeP2SH || t === $t.SerializeP2WSH;
}
function z8(t) {
  return t === $t.SerializeP2SHNonSequential || t === $t.SerializeP2WSHNonSequential;
}
function dh(t) {
  const e = Fc(t);
  return e.nonce = 0, e.fee = 0, ui(e) ? e.signature = tu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function R8(t) {
  const e = [
    t.hashMode,
    Mt(t.signer),
    or(t.nonce, !1, 8),
    or(t.fee, !1, 8),
    t.keyEncoding,
    Xl(t.signature)
  ];
  return Dt(e);
}
function G8(t) {
  const e = [
    t.hashMode,
    Mt(t.signer),
    or(t.nonce, !1, 8),
    or(t.fee, !1, 8)
  ], n = Zl(t.fields);
  e.push(Ql(n));
  const r = new Uint8Array(2);
  return FE(r, t.signaturesRequired, 0), e.push(r), Dt(e);
}
function V8(t, e) {
  const n = ct(e.readBytes(20)), r = BigInt(`0x${ct(e.readBytes(8))}`), s = BigInt(`0x${ct(e.readBytes(8))}`), i = e.readUInt8Enum(_t, (a) => {
    throw new we(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === $t.SerializeP2WPKH && i != _t.Compressed)
    throw new we("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Oc(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function K8(t, e) {
  const n = ct(e.readBytes(20)), r = BigInt("0x" + ct(e.readBytes(8))), s = BigInt("0x" + ct(e.readBytes(8))), i = Rp(e, X.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case X.PublicKey:
        Ds(u.contents) || (o = !0);
        break;
      case X.MessageSignature:
        if (u.pubKeyEncoding === _t.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new mr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === $t.SerializeP2WSH || t === $t.SerializeP2WSHNonSequential))
    throw new mr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Na(t) {
  return ui(t) ? R8(t) : G8(t);
}
function Pa(t) {
  const e = t.readUInt8Enum($t, (n) => {
    throw new we(`Could not parse ${n} as AddressHashMode`);
  });
  return e === $t.SerializeP2PKH || e === $t.SerializeP2WPKH ? V8(e, t) : K8(e, t);
}
function Xp(t, e, n, r) {
  const i = t + ct(new Uint8Array([e])) + ct(or(n, !1, 8)) + ct(or(r, !1, 8));
  if (Mt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Jl(Mt(i));
}
function Yp(t, e, n) {
  const r = 33 + aa, s = Ds(e) ? _t.Compressed : _t.Uncompressed, i = t + U8(s.toString(16)) + n.data, o = Mt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Jl(o);
}
function q8(t, e, n, r, s) {
  const i = Xp(t, e, n, r), o = i8(s, i), a = o8(s), c = Yp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Zp(t, e, n, r, s, i) {
  const o = Xp(t, e, n, r), a = ks(JA(o, i, s)), c = Yp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function W8() {
  const t = Wp($t.SerializeP2PKH, "", 0, 0);
  return t.signer = g8().hash160, t.keyEncoding = _t.Compressed, t.signature = tu(), t;
}
function ph(t, e, n) {
  return ui(t) ? X8(t, e, n) : Y8(t, e, n);
}
function X8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Zp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Yl(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new mr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Y8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case X.PublicKey:
        Ds(c.contents) || (i = !0), r.push(c.contents);
        break;
      case X.MessageSignature:
        c.pubKeyEncoding === _t.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Zp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (hh(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new mr("Too many signatures");
        break;
    }
  if (hh(t.hashMode) && o !== t.signaturesRequired || z8(t.hashMode) && o < t.signaturesRequired)
    throw new mr("Incorrect number of signatures");
  if (i && (t.hashMode === $t.SerializeP2WSH || t.hashMode === $t.SerializeP2WSHNonSequential))
    throw new mr("Uncompressed keys are not allowed in this hash mode");
  const a = Yl(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new mr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Qp(t) {
  return {
    authType: Ht.Standard,
    spendingCondition: t
  };
}
function Jp(t, e) {
  return {
    authType: Ht.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Wp($t.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function gh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ht.Standard:
        return Qp(dh(t.spendingCondition));
      case Ht.Sponsored:
        return Jp(dh(t.spendingCondition), W8());
      default:
        throw new _o("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Z8(t, e) {
  switch (t.authType) {
    case Ht.Standard:
      return ph(t.spendingCondition, e, Ht.Standard);
    case Ht.Sponsored:
      return ph(t.spendingCondition, e, Ht.Standard);
    default:
      throw new _o("Invalid origin auth type");
  }
}
function Q8(t, e) {
  switch (t.authType) {
    case Ht.Standard:
      const n = {
        ...t.spendingCondition,
        fee: se(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ht.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: se(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function J8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: se(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function t6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: se(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function e6(t, e) {
  const n = {
    ...e,
    nonce: se(e.nonce, !1),
    fee: se(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function n6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ht.Standard:
      e.push(Na(t.spendingCondition));
      break;
    case Ht.Sponsored:
      e.push(Na(t.spendingCondition)), e.push(Na(t.sponsorSpendingCondition));
      break;
  }
  return Dt(e);
}
function r6(t) {
  const e = t.readUInt8Enum(Ht, (r) => {
    throw new we(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ht.Standard:
      return n = Pa(t), Qp(n);
    case Ht.Sponsored:
      n = Pa(t);
      const r = Pa(t);
      return Jp(n, r);
  }
}
class s6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: se(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? GE, this.postConditionMode = i ?? Cs.Deny, this.postConditions = s ?? Zl([]), o)
      this.anchorMode = XE(o);
    else
      switch (r.payloadType) {
        case it.Coinbase:
        case it.CoinbaseToAltRecipient:
        case it.NakamotoCoinbase:
        case it.PoisonMicroblock:
        case it.TenureChange:
          this.anchorMode = le.OnChainOnly;
          break;
        case it.ContractCall:
        case it.SmartContract:
        case it.VersionedSmartContract:
        case it.TokenTransfer:
          this.anchorMode = le.Any;
          break;
      }
  }
  signBegin() {
    const e = Fc(this);
    return e.auth = gh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Fc(this);
    return e.auth = gh(e.auth), e.txid();
  }
  verifyOrigin() {
    return Z8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ht.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ht.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ht.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !ui(n)) {
      const r = Ds(e);
      n.fields.push(hs(r ? _t.Compressed : _t.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = q8(n, r, e.fee, e.nonce, s);
    return ui(e) ? e.signature = i : e.fields.push(hs(s.data.byteLength === Sp ? _t.Compressed : _t.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Jl(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ht.Sponsored)
      throw new _o("Cannot sponsor sign a non-sponsored transaction");
    this.auth = e6(this.auth, e);
  }
  setFee(e) {
    this.auth = Q8(this.auth, e);
  }
  setNonce(e) {
    this.auth = J8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ht.Sponsored)
      throw new _o("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new pr('"version" is undefined');
    if (this.chainId === void 0)
      throw new pr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new pr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new pr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new pr('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Pr(n, this.chainId, 0), e.push(n), e.push(n6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ql(this.postConditions)), e.push(Dp(this.payload)), Dt(e);
  }
}
function eu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Zs(Mt(t.slice(2))) : e = new Zs(Mt(t)) : t instanceof Uint8Array ? e = new Zs(t) : e = t;
  const n = e.readUInt8Enum(ko, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = r6(e), i = e.readUInt8Enum(le, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Cs, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Rp(e, X.PostCondition), c = h8(e);
  return new s6(n, s, c, a, o, i, r);
}
const i6 = KA, Qs = Mo, o6 = Up;
const a6 = /* @__PURE__ */ new Set([4001, -31001]), c6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], l6 = ["result", "data", "payload", "response", "params"], yh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], ua = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Yr = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, bn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, u6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), tg = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => u6(i, r)) === s
  );
}, eg = (t) => t ? tg(Yr()).some(
  (e) => {
    var n;
    return e.id === t && (ua(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, ng = () => {
  if (typeof window > "u")
    return;
  const t = Yr(), e = tg(t).filter(
    (n) => {
      var r;
      return ua(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = bn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of c6) {
    const r = bn(t, n) ?? (t === window ? void 0 : bn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, f6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Yr(), n = bn(e, t) ?? (e === window ? void 0 : bn(window, t)) ?? Yo(t);
  if (n)
    return n;
  if (ua(t) || eg(t))
    return ng();
}, Qi = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, h6 = ["blockstack-session", "blockstack"], d6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of h6) {
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
d6();
const rg = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, ye = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, p6 = (t) => {
  const e = ye(t);
  if (!e)
    return null;
  const n = rg(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, g6 = (t) => {
  const e = ye(t);
  if (!e)
    return null;
  const n = rg(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, jc = (t, e = "mainnet") => {
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
      return jc(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return jc(r, e);
  }
  return e;
}, Ar = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, fi = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ps(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = fi(s, e + 1);
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
    const i = fi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && ps(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ps(n.testnet) ? n.testnet.trim() : null;
}, wh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, sg = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && a6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Dr = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = ye(n == null ? void 0 : n.message) ?? ye(e.message) ?? ye(e.error) ?? ye(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Ts = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Dr(e);
    if (e.status === "error")
      throw Dr(e.result ?? e);
  }
  return t;
}, bh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Ts(r);
  } catch (r) {
    throw Dr(r);
  }
}, ig = () => ng(), nu = () => {
  if (typeof window > "u")
    return;
  const t = Yr();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = bn(t, e) ?? (t === window ? void 0 : bn(window, e));
    if (n)
      return n;
  }
}, xh = () => {
  if (typeof window > "u")
    return;
  const t = nu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Yr();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = bn(e, n) ?? (e === window ? void 0 : bn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, co = (t) => {
  var r, s;
  const e = Br();
  if (ua(e) || eg(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Yr() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === ig();
}, Oa = (t) => {
  const e = g6(t);
  if (!e)
    return null;
  try {
    const n = eu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Uo = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Oa(t), r = p6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? ye(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Uo(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of yh)
    if (Oa(s[a])) {
      i = ye(s[a]);
      break;
    }
  const o = ye(s.txId) || ye(s.txid) || ye(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? ye(s.txRaw) ?? void 0
    };
  for (const a of yh) {
    const c = Oa(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: ye(s[a]) ?? void 0
      };
  }
  for (const a of l6) {
    const c = s[a], u = Uo(c, e + 1);
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
}, Da = (t) => {
  const e = Uo(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, y6 = (t) => {
  const e = Uo(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, w6 = (t) => ({
  ...t,
  fee: Ar(t.fee),
  nonce: Ar(t.nonce),
  sponsored: t.sponsored === !0
}), mh = (t) => ({
  recipient: t.recipient,
  amount: Ar(t.amount) ?? "0",
  memo: t.memo,
  network: jc(t.network),
  address: t.stxAddress,
  fee: Ar(t.fee),
  nonce: Ar(t.nonce),
  sponsored: t.sponsored ?? !1
}), og = "WALLET_ADDRESS_MISMATCH", b6 = 45e3;
let Js = null;
const zc = (t) => {
  t && (Js = { address: t, at: Date.now() });
}, x6 = () => {
  Js = null;
}, m6 = () => Js && Date.now() - Js.at <= b6 ? Js.address : null, S6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, E6 = async (t) => {
  x6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Ts(await t.request("wallet_connect")), n = fi(e);
  return zc(n), n;
}, A6 = async (t, e, n, r) => {
  try {
    return Ts(await t.request(e, n));
  } catch (s) {
    const i = Dr(s);
    if (!S6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await E6(t);
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
        { code: o ? og : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Ts(await t.request(e, n));
    } catch (a) {
      throw Dr(a);
    }
  }
};
let Sh = 3e4;
const $6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Sh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Sh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, v6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: og }
      );
    return c;
  }, s = m6();
  if (s)
    return Qi(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Qi(n, "account-read");
  try {
    const c = Ts(
      await $6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = fi(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (sg(c))
      throw Dr(c);
    Qi(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return zc(i), r(i, "wallet_getAccount");
  let o;
  Qi(n, "account-reconnect");
  try {
    o = Ts(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Dr(c);
  }
  const a = fi(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return zc(a), r(a, "wallet_connect");
}, I6 = async (t, e) => {
  if (!co(t)) {
    const i = await bh(
      t,
      "stx_transferStx",
      mh(e)
    );
    return Da(i);
  }
  const n = nu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await bh(
      n,
      "stx_transferStx",
      mh(e)
    );
    return Da(i);
  }
  const r = ig();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await v6(r, e.stxAddress);
  const s = await A6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ar(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ar(e.fee) } : {}
    },
    e.stxAddress
  );
  return Da(s);
}, L6 = () => Br(), ag = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Br(), e = t ? f6(t) : void 0;
  if (e)
    return e;
  const n = Yr() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, C6 = (t, e) => {
  const n = ag(), r = w6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, y6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Wi(r, e);
  if (co(n) && !nu()) {
    const s = xh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Br(),
        route: "legacy-transaction-request"
      }), Wi(r, s);
  }
  return void I6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (wh(s) && co(n)) {
      const a = xh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Br(),
          route: "legacy-transaction-request"
        }), Wi(r, a);
        return;
      }
    }
    if (wh(s) && !co(n)) {
      Wi(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), sg(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Eh = (t) => qp(t).replace(/^0x/, ""), Ah = "This wallet cannot sign messages. Try Xverse or Leather.", $h = (t) => typeof (t == null ? void 0 : t.request) == "function", vh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", k6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, B6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function M6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Eh(e.message),
    domain: Eh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function T6(t, e) {
  const n = await $E({
    domain: e.domain,
    message: e.message,
    network: sa(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function _6(t) {
  var s, i;
  const e = L6() || "", n = /xverse/i.test(e);
  let r = ag();
  if (n && !vh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (vh(r))
    try {
      return await T6(r, t);
    } catch (o) {
      if (n || !$h(r) || !B6(o)) throw o;
    }
  if (!n && $h(r))
    try {
      return await M6(r, t);
    } catch (o) {
      throw k6(o) ? new Error(Ah) : o;
    }
  throw new Error(Ah);
}
const Ih = 1000000n, ti = 1000000n, Rc = 50n, Ho = 3000n, ru = 300n, U6 = 3000n, H6 = 50000n, Lh = 200n, hi = (t) => t + Rc;
function Zn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Ih}.${(n % Ih).toString().padStart(6, "0")}`;
}
function N6(t, e = ru) {
  return t <= Ho ? 0 : Number((t - Ho) / hi(e));
}
function Ch(t, e = 0n) {
  const n = ti - t - e;
  return n > 0n ? n : 0n;
}
function P6(t, e = ru) {
  return t > ti ? "over" : t < Ho + hi(e) ? "empty" : t < H6 ? "low" : "ok";
}
const O6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", D6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", F6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function j6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || F6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== O6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const cg = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Fa = 3, z6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Gc, lg] = cg.split("."), $e = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Vc(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function R6(t) {
  return $e(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Fr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function ug(t, e = []) {
  const n = await Fr(`/v2/contracts/call-read/${Gc}/${lg}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Gc, arguments: e.map((r) => "0x" + $e(Pt(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return yn(Ce(n.result));
}
async function G6() {
  const t = await Fr(`/v2/contracts/source/${Gc}/${lg}?proof=0`);
  if (typeof t.source != "string" || await R6(t.source) !== D6) throw Error("Deployed source does not match the tested helper.");
  if (j6(await ug("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function fg(t) {
  return t.startsWith("SP") && ps(t) && !t.includes(".");
}
async function V6(t) {
  var r;
  if (!fg(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Fr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Fr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function K6(t) {
  const e = await Fr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function q6(t, e) {
  var s, i;
  const n = await ug("get-owner", [Qs(t), Qs(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !fg(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function W6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Vc(t), signal: AbortSignal.timeout(15e3) });
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
async function X6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function Y6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = eu(Vc(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || fs(Ks(Bo.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || fs(r.contractAddress) + "." + r.contractName.content !== cg || r.functionName.content !== "play" || r.functionArgs.length !== 3 || $e(Pt(r.functionArgs[0])) !== $e(Pt(Qs(t.core))) || $e(Pt(r.functionArgs[1])) !== $e(Pt(Qs(t.song))) || $e(Pt(r.functionArgs[2])) !== $e(Pt(o6(Vc(t.id)))) || t.amount !== "50" || e.postConditionMode !== Cs.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ai.Equal || i.principal.prefix !== 2 || fs(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || fs(r.contractAddress) + "." + r.contractName.content !== z6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || $e(Pt(r.functionArgs[0])) !== $e(Pt(Qs(t.song))) || typeof t.liked != "boolean" || $e(Pt(r.functionArgs[1])) !== $e(Pt(i6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Cs.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || yn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const Z6 = "xtrata.xyz/radio/listening-wallet", Q6 = "Link a temporary listening wallet for pay-per-play; no spending permission", No = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ps(t), J6 = (t) => ({
  domain: Hc({ name: as(Z6), version: as("1"), "chain-id": Mo(1) }),
  message: Hc({
    purpose: as(Q6),
    main: as(t.main),
    listening: as(t.listening),
    issued: Mo(t.issued)
  })
}), kh = ["prepared", "signed", "unknown", "pending"], t5 = 30 * 6e4, is = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, e5 = 3e3, Bh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function n5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = !1, h = !1, l = !1, g = null, f = !1, y = "", w = "", $, T = null, _, x = [], I, A = -1 / 0;
  const N = /* @__PURE__ */ new Set();
  let G = null, P = !1, z = 0, m = !1, L = !1, H = !1, q = !1, Y = 0, j = null, Qt = Promise.resolve();
  const Rt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ru.toString()), Jt = (b) => !!i && !(i.features ?? []).includes(b), S = (b, B) => `xtrata.ppp.v1.${b}:${B}`, M = (b = i == null ? void 0 : i.address) => {
    if (!b) return [];
    try {
      const B = JSON.parse(t.store.get(S("entries", b)) || "[]");
      return Array.isArray(B) ? B : [];
    } catch {
      return [];
    }
  }, Q = (b) => {
    const B = [b, ...M(b.address).filter((K) => !(K.txid === b.txid && K.kind === b.kind))].slice(0, 200);
    t.store.set(S("entries", b.address), JSON.stringify(B));
  }, gt = (b = i == null ? void 0 : i.address) => !!b && t.store.get(S("on", b)) !== "0", ut = (b) => {
    i != null && i.address && t.store.set(S("on", i.address), b ? "1" : "0");
  }, Et = () => M().filter((b) => kh.includes(b.status)), ie = () => {
    if (!(i != null && i.address)) return null;
    try {
      return JSON.parse(t.store.get(S("deposit", i.address)) || "null");
    } catch {
      return null;
    }
  }, on = (b) => {
    i != null && i.address && t.store.set(S("deposit", i.address), JSON.stringify(b));
  }, En = () => Et().filter((b) => t.now() - b.created > t5 && N.has(b.txid)), Zr = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Wt = () => Zr() && !(i != null && i.linked), ke = (b) => S("return-to", b), cr = (b = i == null ? void 0 : i.address) => {
    if (!b) return;
    const B = t.store.get(ke(b));
    return B && No(B) && B !== b ? B : void 0;
  }, an = (b = i == null ? void 0 : i.address) => G && G.for === b ? G.res : null;
  function An() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const b = cr();
    if (b) return { to: b, kind: "chosen" };
    const B = an();
    if (B != null && B.ok && B.funder) return { to: B.funder, kind: "funder" };
  }
  function d() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const b = t.main();
    if (!Wt()) {
      if (!b) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : i.state === "known" ? "locked" : !Wt() && i.linked !== b ? "link" : o === void 0 ? "loading" : o > ti ? "over" : o < Ho + hi(Rt()) ? "fund" : "ready" : "loading";
  }
  const v = () => {
    var b, B, K, yt;
    return {
      step: d(),
      busy: c,
      message: y,
      error: w,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : P6(o, Rt()),
      playsLeft: o === void 0 ? 0 : N6(o, Rt()),
      allowance: o === void 0 ? ti : Ch(o, BigInt(((b = ie()) == null ? void 0 : b.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: gt(),
      entries: M(),
      depositTxid: ((B = ie()) == null ? void 0 : B.txid) ?? $,
      depositPending: !!ie(),
      walletOutdated: Jt("like"),
      linkedListening: I && I === t.main() ? x.map((V) => V.listening) : [],
      serverLinked: !!T && _ === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: En().length,
      armed: H,
      queued: It.length,
      solo: Wt(),
      returnTo: (K = An()) == null ? void 0 : K.to,
      returnToKind: (yt = An()) == null ? void 0 : yt.kind,
      funderState: (() => {
        const V = an();
        return V ? V.ok ? V.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const V = an();
        return !!V && V.ok && V.distinct > 1;
      })(),
      walletCannotSolo: Wt() && Jt("standalone")
    };
  }, C = (b, B = "") => {
    y = b, w = B, t.changed();
  };
  async function R(b, B) {
    if (!c) {
      c = b, w = "", t.changed();
      try {
        await B();
      } catch (K) {
        const yt = K instanceof Error ? K.message : String(K);
        w = /Cancelled in the listening wallet/.test(yt) ? "" : yt, w || (y = "Not now. Nothing was signed.", q = !0);
      } finally {
        c = null, await Ft(!0);
      }
    }
  }
  const ft = () => !!(e != null && e.enabled) && e.here && (Wt() || !!t.main() && e.allowed);
  async function vt() {
    if (!ft()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  async function Xt(b = !1) {
    i != null && i.address && (!b && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now()));
  }
  async function Gt(b) {
    if ((I !== b || t.now() - A >= 6e4) && (x = await t.links(b), I = b, A = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === b) return;
    const B = `${b}:${i.address}`;
    _ === B && T || (T = x.find((K) => K.listening === i.address) ?? null, _ = B);
  }
  async function De() {
    const b = i == null ? void 0 : i.address;
    if (!Wt() || !b || i != null && i.linked || !t.funder || P || !o || o <= 0n) return;
    const B = an(b);
    if (B != null && B.ok && B.funder) return;
    const K = B != null && B.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, z - 1), 30 * 6e4);
    if (!(G && G.for === b && t.now() - G.at < K)) {
      P = !0;
      try {
        G = { for: b, res: await t.funder(b), at: t.now() };
      } catch {
        G = { for: b, res: { ok: !1 }, at: t.now() };
      } finally {
        P = !1;
      }
      z = G.res.ok ? 0 : z + 1;
    }
  }
  async function lr() {
    var yt;
    const b = i == null ? void 0 : i.address;
    if (!b) return;
    let B;
    for (const V of Et())
      try {
        const Ct = await t.chain.transaction(V.txid);
        if (!Ct) {
          if (N.add(V.txid), t.now() - V.created > 15 * 6e4 && (B ?? (B = await t.chain.confirmedNonce(b))), B !== void 0 && B > BigInt(V.nonce)) {
            Q({ ...V, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((V.status === "unknown" || V.status === "signed") && V.raw)
            try {
              await t.chain.broadcast(V.raw, V.txid), Q({ ...V, status: "pending" });
            } catch (bt) {
              is(bt) && Q({ ...V, status: "failed", note: bt.message, raw: void 0 });
            }
          continue;
        }
        N.delete(V.txid);
        const at = String(Ct.tx_status);
        if (at === "success" && Ct.canonical !== !1 && Ct.is_unanchored === !1) {
          if (Q({ ...V, status: "confirmed", confirmedAt: t.now(), actualFee: String(Ct.fee_rate ?? V.fee), raw: void 0 }), V.kind === "like" && (f = !0, V.status !== "confirmed" && typeof V.liked == "boolean"))
            try {
              (yt = t.likeConfirmed) == null || yt.call(t, V.song, V.liked);
            } catch {
            }
        } else at.startsWith("abort_") || at.startsWith("dropped_") ? Q({ ...V, status: "failed", note: at, raw: void 0 }) : V.status !== "pending" && Q({ ...V, status: "pending" });
      } catch {
      }
    const K = ie();
    if (K)
      try {
        const V = await t.chain.transaction(K.txid), Ct = String((V == null ? void 0 : V.tx_status) ?? "");
        (Ct === "success" && V.is_unanchored === !1 || Ct.startsWith("abort_") || Ct.startsWith("dropped_") || !V && t.now() - K.at > 2 * 36e5) && (on(null), a = -1 / 0);
      } catch {
      }
  }
  async function Ft(b = !1) {
    var B;
    try {
      const K = t.main();
      if ((b || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !Wt() && (!K || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), H && Se(), t.changed();
        return;
      }
      await vt(), i = await s.request("listening.status"), K && e.allowed && await Gt(K), await Xt(b), await De(), await lr();
    } catch (K) {
      w = K instanceof Error ? K.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (d() === "locked" ? oe() : H && Se(), f) {
      f = !1;
      try {
        (B = t.likesChanged) == null || B.call(t);
      } catch {
      }
    }
    t.changed(), It.length && !Fe && Ee();
  }
  async function Be(b, B) {
    const K = !(i != null && i.address) || gt(i.address);
    await b.request("listening.unlock", { mode: "unlock", terms: K ? ht() : void 0, anyPasskey: B }), i = await b.request("listening.status"), K && (gt(i.address) ? await mt() : await b.request("listening.stop")), C(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const yt = g;
    g = null, yt && t.now() - yt.at < 12e4 && setTimeout(() => void Ft(!0).then(() => je(yt)), 0);
  }
  function oe() {
    H || c || q || Y >= 3 || !s || !(i != null && i.address) || (H = !0, Qt = (async () => {
      try {
        await Be(s, !1), Y = 0;
      } catch (b) {
        const B = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(B) ? j || (q = !0, C("Not now. Nothing was signed.")) : /did not answer/.test(B) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Y++, w = B);
      } finally {
        H = !1;
        const b = j;
        j = null, b ? await b() : await Ft(!0);
      }
    })());
  }
  async function Se(b) {
    H && (j = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Qt), b && await b(), t.changed();
  }
  const ht = () => ({
    fee: Rt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ti.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function mt() {
    if (!(i != null && i.address)) return !1;
    if (L || (L = await t.tabLock(i.address)), !L)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  const jt = {
    forceRefresh: () => Ft(!0),
    create: () => R("Waiting for your passkey…", async () => {
      const b = await vt();
      await b.request("listening.unlock", { mode: "create", terms: ht() }), i = await b.request("listening.status"), ut(!0), C(Wt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await mt();
    }),
    unlock: (b = !1) => {
      const B = () => R("Waiting for your passkey…", async () => Be(await vt(), b));
      return H ? b ? Jt("cancel") ? (C("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Se(async () => {
        (d() === "locked" || d() === "intro") && await B();
      }) : Qt : B();
    },
    link: () => R("Sign in your wallet…", async () => {
      const b = t.main();
      if (!b || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const B = (await t.links(b)).find((K) => K.listening === i.address);
      if (B)
        await s.request("listening.link", { main: b, issued: B.issued, mainSignature: B.mainSignature });
      else {
        const K = { main: b, listening: i.address, issued: t.now() }, yt = await t.signWithMain(b, J6(K)), V = await s.request("listening.link", { main: b, issued: K.issued, mainSignature: yt });
        await t.saveLink({ ...K, mainSignature: yt, listeningSignature: V.listeningSignature }), A = -1 / 0;
      }
      C("Linked ✓");
    }),
    deposit: () => R("Approve the deposit in your wallet…", async () => {
      const b = t.main();
      if (!b || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (ie()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Xt(!0);
      const B = Ch(o ?? 0n);
      if (B <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      $ = await t.deposit(b, i.address, B), $ && on({ txid: $, amount: B.toString(), at: t.now() }), C("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    switchOn: () => R("Confirm in the listening wallet…", async () => {
      if (!ft()) throw new Error("Connect your wallet first.");
      await mt(), await s.request("listening.approveSession", ht()), ut(!0), C("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => R("Clearing…", async () => {
      for (const b of En())
        await t.chain.transaction(b.txid) || Q({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      C("Cleared ✓");
    }),
    switchOff: () => R("Switching off…", async () => {
      Qr(), await (s == null ? void 0 : s.request("listening.stop")), ut(!1), C("Paying is off. Music stays free.");
    }),
    lock: () => R("Locking…", async () => {
      Qr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, C("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const B = String(b ?? "").trim();
      if (!(i != null && i.address)) return C("", "Unlock the listening wallet first.");
      if (!No(B)) return C("", "Enter a standard mainnet address (it starts with SP).");
      if (B === i.address) return C("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(ke(i.address), B), C("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(ke(i.address), ""), t.changed();
    },
    returnFunds: (b) => R("Check the return in the listening wallet…", async () => {
      if (!ft()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      const B = An();
      if (!B) throw new Error(Wt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (B.kind !== "linked" && Jt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Et().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      const { balance: K, nonce: yt } = await t.chain.account(i.address);
      o = K;
      const V = await s.request("listening.prepareReturn", {
        mode: b,
        balance: K.toString(),
        nonce: yt.toString(),
        fee: U6.toString(),
        ...B.kind === "linked" ? {} : { destination: B.to }
      });
      if (V.recipient !== B.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
      const Ct = eu(V.raw);
      if (yn(Ct.payload.recipient).value !== B.to || String(Ct.payload.amount) !== V.amount)
        throw new Error("Signed return does not match what you approved. Nothing was sent.");
      const at = {
        id: Bh(),
        address: i.address,
        kind: "withdraw",
        core: 0,
        song: 0,
        recipient: V.recipient,
        amount: V.amount,
        fee: V.fee,
        nonce: yt.toString(),
        created: t.now(),
        status: "signed",
        raw: V.raw,
        txid: V.txid
      };
      t.validate(at), Q(at);
      try {
        await t.chain.broadcast(V.raw, V.txid), Q({ ...at, status: "pending" });
      } catch (bt) {
        throw Q({ ...at, status: "unknown", note: bt.message }), bt;
      }
      b === "all" && ut(!1), C(b === "all" ? B.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, It = [], ur = 10, Fs = 30 * 6e4;
  let Fe = !1;
  const $n = () => u || !!c || h || l, Qr = () => {
    It.length && (It.length = 0, t.changed());
  };
  async function vn(b) {
    if (!It.some((B) => B.id === b.id) && !M().some((B) => B.id === b.id) && (It.push({ ...b, at: t.now() }), It.length > ur && It.shift()), $n() || Et().length) {
      const B = It.length;
      y = `Queued ${B === 1 ? "this song" : B + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ee();
  }
  async function Ee() {
    if (!Fe) {
      Fe = !0;
      try {
        for (; It.length; ) {
          for (; It.length && t.now() - It[0].at > Fs; ) It.shift();
          if (!It.length || $n() || await In(It[0]) === "wait") return;
          It.shift();
        }
      } finally {
        Fe = !1, t.changed();
      }
    }
  }
  async function In(b) {
    u = !0;
    try {
      await Ft();
      const B = d();
      if (B === "loading") return "wait";
      if (B !== "ready" || !gt() || !(i != null && i.session) || i.session.playsLeft < 1 || !L) return "done";
      if (Et().length) return "wait";
      m || (await t.chain.verify(), m = !0);
      const K = i.address, { balance: yt, nonce: V } = await t.chain.account(K);
      o = yt, a = t.now();
      const Ct = await t.chain.owner(Fa, b.song);
      if (Ct === K || Ct === t.main()) return "done";
      const at = await s.request("listening.signPlay", {
        core: Fa,
        song: b.song,
        receipt: b.id,
        fee: Rt().toString(),
        nonce: V.toString(),
        balance: yt.toString()
      }), bt = {
        id: b.id,
        address: K,
        kind: "play",
        core: Fa,
        song: b.song,
        recipient: Ct,
        amount: "50",
        fee: Rt().toString(),
        nonce: V.toString(),
        created: t.now(),
        status: "signed",
        raw: at.raw,
        txid: at.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      t.validate(bt), Q(bt);
      const cn = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await t.chain.broadcast(at.raw, at.txid), Q({ ...bt, status: "pending" }), y = `♪ Paid ${cn}`, w = "";
      } catch (ze) {
        Q({ ...bt, status: is(ze) ? "failed" : "unknown", note: ze.message, ...is(ze) ? { raw: void 0 } : {} }), w = ze.message;
      }
      return i = await s.request("listening.status"), "done";
    } catch (B) {
      return y = "This song played free: " + (B instanceof Error ? B.message : "payment unavailable"), "done";
    } finally {
      u = !1, t.changed();
    }
  }
  function Ln(b) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(d()) || Jt("like") ? !1 : (je(b), !0);
  }
  async function je(b) {
    const B = b.title ? `“${b.title}”` : `song #${b.song}`, K = (he) => {
      var Re;
      w = he, y = "";
      try {
        (Re = t.likeFailed) == null || Re.call(t, b.song);
      } catch {
      }
      t.changed();
    }, yt = d(), V = t.main(), Ct = Wt() ? i == null ? void 0 : i.address : V;
    if (yt === "locked") {
      g = { ...b, at: t.now() }, C(`Unlock to like ${B}. It sends straight after.`);
      return;
    }
    if (yt === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Wt() && Jt("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (yt === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (yt === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (yt !== "ready" || !Ct) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!L) return K("Pay-per-play is running in another tab. Like from that tab.");
    const at = M().find((he) => he.kind === "like" && he.song === b.song);
    if (at && kh.includes(at.status))
      return K(`Your last like for ${B} is still on its way. It can change again once it confirms.`);
    if (h) return K("One like at a time: your last one is still being sent.");
    if ((at == null ? void 0 : at.status) === "confirmed" && t.now() - (at.confirmedAt ?? 0) < e5)
      return K(`Your like for ${B} has only just confirmed. Try again in a moment.`);
    let bt;
    l = !0;
    try {
      bt = t.likeState ? (await t.likeState(Ct, b.song)).by : b.likedBy ?? [];
    } catch {
      bt = b.likedBy;
    } finally {
      l = !1;
    }
    if (!bt) return K(`Could not check ${B} right now. Try the heart again.`);
    const cn = i.address, ln = ((at == null ? void 0 : at.status) === "confirmed" && typeof at.liked == "boolean" && t.now() - (at.confirmedAt ?? at.created) < 5 * 6e4 ? at.liked : void 0) ?? bt.includes(cn);
    if (!ln && bt.some((he) => he !== cn)) return K(Wt() ? `${B} was liked from another wallet of yours. Unlike it there.` : `${B} was liked from your main wallet${bt.includes(V) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await D({ song: b.song, liked: !ln, title: b.title, artist: b.artist });
  }
  async function D(b) {
    var yt, V, Ct;
    if (h) {
      C("Still sending your last like. Try again in a moment.");
      return;
    }
    h = !0;
    const B = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, K = t.wait ?? ((at) => new Promise((bt) => setTimeout(bt, at)));
    try {
      C(`${b.liked ? "Liking" : "Unliking"} ${B}…`);
      const at = t.now() + 12e4;
      for (; u || Et().length; ) {
        if (t.now() > at) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await Ft(!0);
      }
      if (d() !== "ready" || !(i != null && i.session)) throw new Error("Paying stopped before the like was sent.");
      const bt = i.address, { balance: cn, nonce: ze } = await t.chain.account(bt);
      o = cn, a = t.now();
      const ln = await s.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: Lh.toString(),
        nonce: ze.toString(),
        balance: cn.toString()
      }), he = {
        id: Bh(),
        address: bt,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: Lh.toString(),
        nonce: ze.toString(),
        created: t.now(),
        status: "signed",
        raw: ln.raw,
        txid: ln.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      t.validate(he), Q(he);
      try {
        await t.chain.broadcast(ln.raw, ln.txid), Q({ ...he, status: "pending" }), y = `${b.liked ? "♥ Liked" : "Unliked"} ${B}`, w = "";
        try {
          (yt = t.likeSent) == null || yt.call(t, b.song, b.liked);
        } catch {
        }
      } catch (Re) {
        if (Q({ ...he, status: is(Re) ? "failed" : "unknown", note: Re.message, ...is(Re) ? { raw: void 0 } : {} }), w = Re.message, is(Re)) try {
          (V = t.likeFailed) == null || V.call(t, b.song);
        } catch {
        }
      }
      i = await s.request("listening.status");
    } catch (at) {
      w = "Like not sent: " + (at instanceof Error ? at.message : "the listening wallet is unavailable");
      try {
        (Ct = t.likeFailed) == null || Ct.call(t, b.song);
      } catch {
      }
    } finally {
      h = !1, t.changed(), Ee();
    }
  }
  return { snapshot: v, refresh: Ft, onListened: vn, heart: Ln, toggleLike: je, ...jt };
}
const hg = ["Connect", "Passkey", "Link & fund", "Listen"], dg = ["Passkey", "Add 1 STX", "Listen"], Kc = (t) => t ? dg : hg;
function r5(t) {
  if (t.solo) return s5(t);
  const e = hg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function s5(t) {
  const e = dg.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function i5(t, e) {
  return !e || e.at >= Kc(!!t.solo).length || t.entries.some((n) => n.kind === "play") ? !1 : !(t.step === "locked" && t.linked);
}
const o5 = 100000n, a5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function c5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !No(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= o5).sort(a5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Ji = 50;
function Mh(t) {
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
async function l5(t, e, n = 4) {
  if (!No(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Ji}&offset=${o}`, s = Mh(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Ji);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Ji ? s : Mh(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = c5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Ji);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const u5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function f5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !u5(r.id)));
}
const h5 = {}, d5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, p5 = (t) => {
  const e = h5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, g5 = (t) => `/hiro/${t}`, y5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, w5 = (t) => {
  const e = p5(t);
  if (e)
    return [y5(e)];
  const n = d5[t];
  return typeof window < "u" ? [`${window.location.origin}${g5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, b5 = {}, Th = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, x5 = "xtrata.log.enabled", m5 = "xtrata.log.level", S5 = "xtrata.log.tags", E5 = "xtrata.log.dedupe", to = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, A5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, $5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, v5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, I5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, L5 = () => {
  const t = b5 ?? {}, e = to(x5) ?? t.VITE_LOG_ENABLED, n = to(m5) ?? t.VITE_LOG_LEVEL, r = to(S5) ?? t.VITE_LOG_TAGS, s = to(E5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: A5(e),
    level: $5(n) ?? "warn",
    tags: I5(r),
    dedupe: v5(s)
  };
}, C5 = (t, e, n) => !t.enabled || Th[n] < Th[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), k5 = (t, e, n, r) => {
  const s = L5();
  if (!C5(s, e, t) || M5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, B5 = /* @__PURE__ */ new Set();
let _h = null;
const M5 = (t, e, n, r, s) => (_h !== t && (B5.clear(), _h = t), !1), T5 = (t, e, n) => k5("debug", t, e, n), _5 = {}, U5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, H5 = (t) => {
  const e = _5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : U5[t];
}, N5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, P5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return N5.test(n) ? n : null;
}, O5 = (t) => t.replace(/\/+$/, ""), D5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Uh = (t) => {
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
}, os = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, F5 = (t) => {
  var c, u;
  let e;
  try {
    e = yn(j8(t));
  } catch {
    return null;
  }
  const n = os(e);
  if (!n || n.success === !1)
    return null;
  const r = os(n.value), s = os(r == null ? void 0 : r.value), i = os(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Uh((c = os(i.name)) == null ? void 0 : c.value), a = Uh((u = os(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : P5(`${o}.${a}`);
}, j5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${O5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [qp(Bp(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : F5(i.result);
}, z5 = async (t) => {
  const e = t.address.trim();
  if (!ps(e))
    return null;
  const n = H5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of w5(t.network))
    try {
      return await j5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return T5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: D5(r)
  }), null;
}, Hh = Object.freeze({
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
function R5(t, e = "") {
  return Object.hasOwn(Hh, String(t)) ? Hh[String(t)] : e;
}
const Nh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function G5(t, e = "") {
  return Object.hasOwn(Nh, String(t)) ? Nh[String(t)] : e;
}
const Ph = document.getElementById("ppp");
Ph && V5(Ph);
function V5(t) {
  var An;
  const e = My(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let s = null;
  const i = async (d, v) => {
    const C = await fetch(d, { cache: "no-store", ...v, signal: AbortSignal.timeout(15e3) }), R = await C.json().catch(() => ({}));
    if (!C.ok) throw new Error((R == null ? void 0 : R.error) || `Request failed (${C.status}).`);
    return R;
  }, o = n5({
    now: Date.now,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    saveLink: async (d) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), s.referrerPolicy = "no-referrer";
      const v = new Promise((vt, Xt) => {
        s.addEventListener("load", () => vt(), { once: !0 }), setTimeout(() => Xt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = d + "/", r.replaceChildren(s), await v;
      const C = new Ey({ walletOrigin: d, frame: s, timeoutMs: 30 * 6e4 }), R = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ft = (vt, Xt) => R.has(vt) ? C.request(vt, Xt) : Promise.race([
        C.request(vt, Xt),
        new Promise((Gt, De) => setTimeout(() => De(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ft("listening.status"), { request: ft };
    },
    chain: {
      verify: G6,
      balance: K6,
      account: V6,
      owner: q6,
      broadcast: W6,
      transaction: X6,
      confirmedNonce: async (d) => {
        const v = await Fr(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(v == null ? void 0 : v.nonce) || v.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(v.nonce);
      }
    },
    signWithMain: (d, v) => _6({ ...v, network: "mainnet", stxAddress: d }),
    deposit: (d, v, C) => new Promise((R, ft) => C6({
      recipient: v,
      amount: C.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new Dh(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (vt) => R(vt.txId || ""),
      onCancel: () => ft(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ft
    })),
    validate: Y6,
    tabLock: (d) => new Promise((v) => {
      const C = navigator.locks;
      if (!(C != null && C.request)) {
        v(!0);
        return;
      }
      C.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (R) => {
        v(!!R), R && await new Promise(() => {
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
      set: (d, v) => {
        try {
          localStorage.setItem(d, v);
        } catch {
        }
      }
    },
    changed: () => ke(o.snapshot()),
    funder: (d) => l5(d, Fr),
    likesChanged: () => {
      var d, v;
      (v = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || v.call(d);
    },
    likeState: async (d, v) => {
      const C = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(v) })), R = Array.isArray(C == null ? void 0 : C.rows) ? C.rows.find((ft) => (ft == null ? void 0 : ft.id) === v) : null;
      if (!R || typeof R.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: R.liked, by: Array.isArray(R.by) ? R.by.filter((ft) => typeof ft == "string") : R.liked ? [d] : [] };
    },
    likeSent: (d, v) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: v } })),
    likeConfirmed: (d, v) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: v } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  });
  window.XtrataRadioLikeHandler = (d) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    P();
    const v = z(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: v.title || void 0, artist: v.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let a;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const c = (d) => {
    var C, R;
    const v = window.XtrataRadioListeningIdentity();
    v !== a && (a = v, (R = (C = window.XtrataRadio) == null ? void 0 : C.refreshLikes) == null || R.call(C));
  }, u = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", h = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), l = (d) => {
    const v = Math.round((Date.now() - d) / 6e4);
    return v < 1 ? "now" : v < 60 ? `${v}m` : v < 1440 ? `${Math.round(v / 60)}h` : `${Math.round(v / 1440)}d`;
  }, g = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, f = (d, v = "", C = "") => {
    const R = document.createElement(d);
    return v && (R.textContent = v), C && (R.className = C), R;
  }, y = (d, v, C = "") => {
    const R = f("button", d, C);
    return R.type = "button", R.onclick = v, R;
  }, w = (d, v) => {
    const C = f("a", d);
    return C.href = v, C.target = "_blank", C.rel = "noopener", C;
  };
  let $ = null, T = !1;
  const _ = /* @__PURE__ */ new Map(), x = (d) => d ? (_.has(d) || (_.set(d, null), z5({ address: d, network: "mainnet" }).then((v) => {
    v && (_.set(d, v), ke(o.snapshot()));
  }).catch(() => {
  })), _.get(d) ?? null) : null, I = (d) => {
    const v = x(d);
    return v ? `${v} · ${u(d)}` : u(d);
  }, A = /* @__PURE__ */ new Map();
  let N = !1;
  const G = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), P = () => {
    N || (N = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const v of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const C = Number(v == null ? void 0 : v.id);
        Number.isSafeInteger(C) && A.set(C, { title: typeof v.title == "string" ? v.title : void 0, artist: typeof v.artist == "string" ? v.artist : void 0 });
      }
      ke(o.snapshot());
    }).catch(() => {
      N = !1;
    }));
  }, z = (d, v) => {
    const C = A.get(d), R = G5(d, [C == null ? void 0 : C.title, v == null ? void 0 : v.title].find((vt) => !G(vt)) || ""), ft = R5(d, (C == null ? void 0 : C.artist) || (v == null ? void 0 : v.artist) || "");
    return { title: R, artist: ft };
  }, m = (d) => {
    const { title: v, artist: C } = z(d.song, d);
    return v ? `“${v}”${C ? ` — ${C}` : ""}` : `Song #${d.song}${C ? ` — ${C}` : ""}`;
  }, L = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, H = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function q(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "over" ? ["OVER 1 STX", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Y(d, v, C = "", R) {
    const ft = f("dt", d), vt = f("dd", v, C);
    return R && vt.append(" ", R), [ft, vt];
  }
  const j = document.getElementById("ppp-top"), Qt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Rt = () => {
    var v, C;
    const d = o.snapshot();
    if (d.step === "connect") {
      (v = document.getElementById("radio-wallet-connect")) == null || v.click();
      return;
    }
    if (d.step === "elsewhere" && ((C = d.gate) != null && C.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), Qt();
  };
  j && (j.onclick = Rt);
  function Jt(d) {
    if (!j) return;
    const v = (R, ft, vt) => {
      j.hidden = !1, j.className = "ppp-top" + (ft ? " is-" + ft : ""), j.replaceChildren(f("span", "", "dot"), document.createTextNode(R)), j.title = vt;
    }, C = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        j.hidden = !0;
        return;
      case "elsewhere":
        return v("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        j.hidden = !0;
        return;
      case "intro":
        return v("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "locked":
        return v(d.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return v("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return v(d.entries.some((R) => R.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return v("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return v("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return d.payingOn && C > 0 ? v(`On · ${C.toLocaleString()} plays left`, "on", "Paying artists as you listen") : v("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const S = document.getElementById("pppNudge"), M = document.getElementById("onair");
  (An = S == null ? void 0 : S.querySelector("button")) == null || An.addEventListener("click", () => Rt());
  const Q = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    link: "Not paying artists yet",
    fund: "Out of funds · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, gt = {
    elsewhere: "Pay as I listen",
    connect: "Connect",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Top up",
    over: "Fix it",
    ready: "Switch on"
  };
  function ut(d) {
    var vt;
    if (d.step === "loading") return;
    const v = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, C = d.step === "ready" && d.payingOn && v > 0, R = C ? "" : Q[d.step] ?? "", ft = C ? "on" : R ? "off" : "";
    if (ft ? document.documentElement.dataset.ppp = ft : delete document.documentElement.dataset.ppp, M && (M.hidden = !ft, M.querySelector(".onair-sub").textContent = C ? `Paying artists · ${v.toLocaleString()} plays left` : "Not paying"), S && (S.hidden = ft !== "off", ft === "off")) {
      const Xt = Math.floor(Number(1000000n / hi(BigInt(((vt = d.gate) == null ? void 0 : vt.limits.playFee) ?? "300"))));
      S.querySelector(".nudge-t").textContent = "⚠ " + R, S.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${Xt.toLocaleString()} plays, on-chain, straight to the artists.`, S.querySelector("button").textContent = gt[d.step] ?? "Start paying";
    }
  }
  let Et = "";
  function ie(d) {
    const v = f("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && v.append(f("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && v.append(f("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const C = f("input");
    C.type = "text", C.placeholder = "SP… address to send returns to", C.autocomplete = "off", C.spellcheck = !1, C.setAttribute("aria-label", "Address to return funds to"), C.value = Et, C.oninput = () => {
      Et = C.value;
    };
    const R = y(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(C.value), Et = "";
    }, "tiny");
    return v.append(C, " ", R), d.returnToKind === "chosen" && v.append(" ", y("Back to the funder", () => o.clearReturnAddress(), "tiny")), v;
  }
  const on = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function En() {
    const d = f("p", on + " ", "ppp-mute");
    return d.append(w("Xverse", "https://www.xverse.app/download"), " · ", w("Leather", "https://leather.io/install-extension")), d;
  }
  let Zr = "";
  const Wt = (d) => {
    const v = document.documentElement, C = d.solo && !d.main ? d.listening ? u(d.listening) : "new" : "", R = f5() ? "1" : "";
    `${C}|${R}` !== Zr && (Zr = `${C}|${R}`, C ? v.dataset.pppSolo = C : delete v.dataset.pppSolo, R ? v.dataset.pppWalletInstalled = R : delete v.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => ke(o.snapshot()), d);
  function ke(d) {
    var Ee, In, Ln, je;
    if (c(), Wt(d), Jt(d), ut(d), t.hidden = d.step === "off", t.hidden) return;
    const [v, C] = q(d), R = n(".ppp-state");
    R.textContent = v, R.className = "ppp-state" + (C ? " ppp-state--" + C : ""), R.hidden = !v;
    const ft = !!d.busy || d.armed, vt = !["elsewhere", "connect", "not-invited", "unsupported", "off"].includes(d.step) && (ft || !["intro", "loading"].includes(d.step));
    r.hidden = !vt, r.classList.toggle("ppp-frame--rest", !ft && !T);
    const Xt = n(".ppp-frame-label");
    Xt.hidden = !0;
    const Gt = r5(d) ?? $;
    $ = Gt;
    const De = i5(d, Gt);
    n(".ppp-badge").hidden = !De;
    const lr = n(".ppp-steps"), Ft = n(".ppp-stage");
    lr.hidden = Ft.hidden = !De, Gt && De && (lr.replaceChildren(...Kc(d.solo).map((D, b) => {
      const B = f("li", "", b < Gt.at ? "done" : b === Gt.at ? Gt.blocked ? "now blocked" : "now" : "");
      return B.append(f("span", b < Gt.at ? "✓" : String(b + 1), "n"), D), b === Gt.at && B.setAttribute("aria-current", "step"), B;
    })), Ft.textContent = Gt.caption, Ft.className = "ppp-stage " + (Gt.at >= Kc(d.solo).length ? "ppp-ok" : Gt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Be = n(".ppp-facts"), oe = [];
    if (d.main && ((Ee = d.gate) != null && Ee.here) && !d.solo && oe.push(...Y("Your wallet", I(d.main), "ppp-addr-short")), d.listening) {
      const D = y("Copy", () => {
        var b;
        return void ((b = navigator.clipboard) == null ? void 0 : b.writeText(d.listening || ""));
      }, "tiny");
      oe.push(...Y("Listening wallet", u(d.listening), "ppp-addr-short", D));
    }
    if (d.listening && d.step !== "intro")
      if (d.linked) oe.push(...Y("Linked to", `${I(d.linked)} · returns go here`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn"));
      else if (d.solo) {
        const D = d.returnTo ? `${u(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        oe.push(...Y("Returns go to", d.returnTo ? D.replace(u(d.returnTo), d.returnTo) : D, d.returnTo ? "ppp-addr-full" : "ppp-mute"));
      } else oe.push(...Y("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((In = d.gate) != null && In.here)) {
      const D = d.linkedListening.map((b) => u(b) + (b === d.listening ? " (this one)" : "")).join(", ");
      oe.push(...Y(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", D, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const D = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      oe.push(...Y("Balance", `${Zn(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, D));
    }
    const Se = d.entries.find((D) => D.kind === "play");
    Se && P(), Se && oe.push(...Y("Last paid song", `${m(Se)} → ${u(Se.recipient)}`, L[Se.status] || "")), Be.replaceChildren(...oe), Be.hidden = !oe.length;
    const ht = [], mt = [], jt = [], It = [], ur = hi(BigInt(((Ln = d.gate) == null ? void 0 : Ln.limits.playFee) ?? "300")), Fs = `Each song you listen to for 30 seconds sends ${Zn(Rc)} STX to whoever holds it, plus a ${Zn(ur - Rc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Fe = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (ht.push(f("p", "Pay artists as you listen.")), (je = d.gate) != null && je.radioUrl) {
          const D = f("p");
          D.append(w("Open the pay-per-play radio →", d.gate.radioUrl)), ht.push(D);
        }
        mt.push(f("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        d.linked ? (ht.push(f("p", `This device's listening wallet is linked to ${I(d.linked)}. Connect that wallet to keep paying artists.`)), mt.push(f("p", "Your plays, likes and any funds returned stay with that wallet. Listening is always free."))) : (ht.push(f("p", "Connect your wallet to pay artists as you listen.")), mt.push(f("p", "Every payment is recorded on-chain. Listening is always free.")));
        break;
      case "not-invited":
        ht.push(f("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ht.push(f("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ht.push(f("p", `Pay artists ${Zn(ur)} STX a song as you listen.`)), mt.push(f("p", Fs)), mt.push(f("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), mt.push(f("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), d.solo && mt.push(f("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute")), jt.push(y(d.solo ? "Turn on pay-per-play · no wallet needed" : "Turn on pay-per-play", () => void o.create(), "primary")), d.solo && jt.push(y("I have a Stacks wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        })), jt.push(y("I already have a listening wallet", () => void o.unlock(!0)));
        break;
      case "locked":
        d.armed || (ht.push(f("p", "Locked.", "ppp-mute")), jt.push(y(d.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), It.push(y("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ht.push(f("p", `Link to ${I(d.main)} · free`)), mt.push(f("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), mt.push(f("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), jt.push(y(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ht.push(f("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.entries.length ? ht.push(f("p", "Out of funds · top up to keep paying", "ppp-bad")) : ht.push(f("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / ur)).toLocaleString()} songs`)), d.entries.length && mt.push(f("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), d.payingOn && !d.entries.length && mt.push(f("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), d.solo ? (mt.push(f("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), mt.push(f("p", d.listening || "", "ppp-addr-full")), d.listening && jt.push(y("Copy my address", () => {
          var D;
          return void ((D = navigator.clipboard) == null ? void 0 : D.writeText(d.listening || ""));
        }, "primary"))) : mt.push(f("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const D = f("p", "Deposit on its way… ", "ppp-warn");
          D.append(w("View", g(d.depositTxid))), ht.push(D);
        } else d.allowance > 0n && !d.solo && jt.push(y(`Deposit ${Zn(d.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ht.push(f("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (ht.push(f("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ht.push(ie(d))), (!d.solo || d.returnTo) && jt.push(y("Return excess", () => void o.returnFunds("excess"), "primary"), y("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0) {
          const D = Math.min(d.session.playsLeft, d.playsLeft);
          ht.push(f("p", `Paying as you listen · up to ${D.toLocaleString()} plays left`, "ppp-ok")), mt.push(f("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), jt.push(y("Switch off", () => void o.switchOff()));
        } else
          ht.push(f("p", "Paying is off. Music stays free.", "ppp-mute")), jt.push(y("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        d.queued && ht.push(f("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && ht.push(f("p", "Running low · top up", "ppp-warn")), d.depositPending ? ht.push(f("p", "Top-up on its way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && jt.push(y(`Top up ${Zn(d.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (d.solo && d.walletCannotSolo && mt.push(f("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && mt.push(ie(d)), mt.push(En()), d.step === "ready" && d.entries.some((D) => D.kind === "play" && D.status === "confirmed"))) {
      const D = f("p", "New to Stacks? ", "ppp-mute");
      D.append(w("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ht.push(D);
    }
    if (d.walletOutdated && mt.push(f("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (ht.push(f("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), jt.push(y("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(d.step) && d.returnTo && (d.balance ?? 0n) > 0n && It.push(y(d.linked ? "Return all to my wallet" : `Return all to ${u(d.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && It.push(y("Lock", () => void o.lock(), "quiet")), vt && !ft && It.push(y(T ? "Hide listening wallet box" : "Show listening wallet box", () => {
      T = !T, ke(o.snapshot());
    }, "quiet")), [...jt, ...It].forEach((D) => D.disabled = Fe), Fe && (jt.length = 0), d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const D = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", b = ht.at(0);
      d.step === "ready" && b ? b.append(f("span", ` · ${h(d.balance)} STX`, D)) : ht.push(f("p", `Balance ${h(d.balance)} STX`, D));
    }
    n(".ppp-key").replaceChildren(...ht), n(".ppp-body").replaceChildren(...mt), n(".ppp-actions").replaceChildren(...jt), n(".ppp-actions2").replaceChildren(...It);
    const $n = d.busy || d.message || "";
    n(".ppp-msg").textContent = $n && ht.some((D) => (D.textContent ?? "").startsWith($n.replace(/[.✓\s]+$/, ""))) ? "" : $n, n(".ppp-err").textContent = d.error;
    const Qr = d.entries.filter((D) => D.kind === "play");
    n(".ppp-recent").hidden = !d.entries.length, n(".ppp-recent-list").replaceChildren(...Qr.slice(0, 5).map((D) => {
      const b = f("li"), B = D.status === "confirmed" ? "ok" : D.status === "failed" ? "bad" : "warn";
      return b.append(f("span", "", "d " + B), f("span", m(D), "t"), f("span", l(D.created), "ppp-mute")), D.txid && b.append(w("tx", g(D.txid))), b;
    })), n(".ppp-wallets").hidden = !(Be.childElementCount || It.length), n(".ppp-more").hidden = !mt.length;
    const vn = n(".ppp-history");
    vn.hidden = !d.entries.length, d.entries.length && P(), vn.replaceChildren(f("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((D) => {
      const b = f("div", "", "ppp-row"), B = D.kind === "play" ? [f("span", m(D), "ppp-song"), f("span", ` · ${Zn(BigInt(D.amount))} STX to ${u(D.recipient)}`, "ppp-mute")] : D.kind === "like" ? [f("span", `${D.liked ? "♥ Liked" : "Unliked"} ${m(D)}`, "ppp-song"), f("span", ` · for ${d.linked ? I(d.linked) : "this listening wallet"}`, "ppp-mute")] : [f("span", `Returned ${Zn(BigInt(D.amount))} STX`, "ppp-song"), f("span", ` to ${u(D.recipient)}`, "ppp-mute")];
      return b.append(
        f("span", H[D.status] || D.status, "ppp-status " + (L[D.status] || "")),
        ...B,
        f("span", ` · ${new Date(D.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), D.txid && b.append(w("tx ↗", g(D.txid))), b;
    }));
  }
  const cr = /* @__PURE__ */ new Map(), an = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((v) => {
      const C = v == null ? void 0 : v.nowPlaying;
      C && Number.isSafeInteger(Number(C.tokenId)) && cr.set(Number(C.tokenId), { title: C.title || void 0, artist: C.artist || void 0 });
    }), !0) : !1;
  };
  if (!an()) {
    const d = setInterval(() => {
      an() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const v = d.detail;
    if (v && Number.isSafeInteger(v.song) && typeof v.id == "string" && /^[0-9a-f]{32}$/.test(v.id)) {
      P();
      const C = z(v.song, cr.get(v.song));
      o.onListened({ song: v.song, id: v.id, title: C.title || void 0, artist: C.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const K5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", q5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, W5 = () => q5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, X5 = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Y5 = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', pg = class {
  constructor(t) {
    nE(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Ex(t), this.callback(Yo(t));
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
    var r, s, i, o, a, c, u, h, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (h = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = W5(), e = X5(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return J("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, J("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), J("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, J("div", { class: "flex flex-col space-y-[10px]" }, J("div", { class: "flex items-center" }, J("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), J("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, J("span", { class: "sr-only" }, "Close popup"), J("img", { src: K5 }))), r ? J("p", null, "Select the wallet you want to connect to.") : J("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && J("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && J("div", { class: "mt-6" }, J("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), J("ul", { class: "space-y-3" }, this.installedProviders.map((i) => J("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, J("div", { class: "aspect-square basis-9 overflow-hidden" }, J("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), J("div", { class: "flex-1" }, J("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && J("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), J("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && J("div", { class: "mt-6" }, r ? J("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : J("div", { class: "mb-5 flex justify-between" }, J("p", { class: "text-sm font-medium" }, "Recommended wallets"), J("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, J("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, J("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), J("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), J("p", null, "What is a wallet? ", J("span", { class: "align-text-bottom text-[9px]" }, "↗")))), J("ul", { class: "space-y-3" }, n.map((i) => J("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, J("div", { class: "aspect-square basis-9 overflow-hidden" }, J("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), J("div", { class: "flex-1" }, J("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && J("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && J("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return P4(this);
  }
};
pg.style = Y5;
const Z5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: pg
}, Symbol.toStringTag, { value: "Module" }));
