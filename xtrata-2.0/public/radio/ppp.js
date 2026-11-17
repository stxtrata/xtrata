var s1 = Object.defineProperty;
var i1 = (e, t, n) => t in e ? s1(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ia = (e, t, n) => i1(e, typeof t != "symbol" ? t + "" : t, n);
var qn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function py(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Kl(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, s.get ? s : {
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
      typeof qn < "u" && qn || {}, r = {
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
        ], i = ArrayBuffer.isView || function(m) {
          return m && o.indexOf(Object.prototype.toString.call(m)) > -1;
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
        var C = {
          next: function() {
            var _ = m.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (C[Symbol.iterator] = function() {
          return C;
        }), C;
      }
      function h(m) {
        this.map = {}, m instanceof h ? m.forEach(function(C, _) {
          this.append(_, C);
        }, this) : Array.isArray(m) ? m.forEach(function(C) {
          if (C.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + C.length);
          this.append(C[0], C[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(C) {
          this.append(C, m[C]);
        }, this);
      }
      h.prototype.append = function(m, C) {
        m = a(m), C = c(C);
        var _ = this.map[m];
        this.map[m] = _ ? _ + ", " + C : C;
      }, h.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, h.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, h.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, h.prototype.set = function(m, C) {
        this.map[a(m)] = c(C);
      }, h.prototype.forEach = function(m, C) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && m.call(C, this.map[_], _, this);
      }, h.prototype.keys = function() {
        var m = [];
        return this.forEach(function(C, _) {
          m.push(_);
        }), u(m);
      }, h.prototype.values = function() {
        var m = [];
        return this.forEach(function(C) {
          m.push(C);
        }), u(m);
      }, h.prototype.entries = function() {
        var m = [];
        return this.forEach(function(C, _) {
          m.push([_, C]);
        }), u(m);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function w(m) {
        return new Promise(function(C, _) {
          m.onload = function() {
            C(m.result);
          }, m.onerror = function() {
            _(m.error);
          };
        });
      }
      function y(m) {
        var C = new FileReader(), _ = w(C);
        return C.readAsArrayBuffer(m), _;
      }
      function v(m) {
        var C = new FileReader(), _ = w(C), M = /charset=([A-Za-z0-9_-]+)/.exec(m.type), W = M ? M[1] : "utf-8";
        return C.readAsText(m, W), _;
      }
      function x(m) {
        for (var C = new Uint8Array(m), _ = new Array(C.length), M = 0; M < C.length; M++)
          _[M] = String.fromCharCode(C[M]);
        return _.join("");
      }
      function L(m) {
        if (m.slice)
          return m.slice(0);
        var C = new Uint8Array(m.byteLength);
        return C.set(new Uint8Array(m)), C.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = L(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || i(m)) ? this._bodyArrayBuffer = L(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = d(this);
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
            var m = d(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(y);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var m = d(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return v(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var P = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(m) {
        var C = m.toUpperCase();
        return P.indexOf(C) > -1 ? C : m;
      }
      function T(m, C) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        C = C || {};
        var _ = C.body;
        if (m instanceof T) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, C.headers || (this.headers = new h(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !_ && m._bodyInit != null && (_ = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = C.credentials || this.credentials || "same-origin", (C.headers || !this.headers) && (this.headers = new h(C.headers)), this.method = A(C.method || this.method || "GET"), this.mode = C.mode || this.mode || null, this.signal = C.signal || this.signal || function() {
          if ("AbortController" in n) {
            var F = new AbortController();
            return F.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (C.cache === "no-store" || C.cache === "no-cache")) {
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var W = /\?/;
            this.url += (W.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function B(m) {
        var C = new FormData();
        return m.trim().split("&").forEach(function(_) {
          if (_) {
            var M = _.split("="), W = M.shift().replace(/\+/g, " "), F = M.join("=").replace(/\+/g, " ");
            C.append(decodeURIComponent(W), decodeURIComponent(F));
          }
        }), C;
      }
      function X(m) {
        var C = new h(), _ = m.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var W = M.split(":"), F = W.shift().trim();
          if (F) {
            var we = W.join(":").trim();
            try {
              C.append(F, we);
            } catch (le) {
              console.warn("Response " + le.message);
            }
          }
        }), C;
      }
      U.call(T.prototype);
      function Q(m, C) {
        if (!(this instanceof Q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (C || (C = {}), this.type = "default", this.status = C.status === void 0 ? 200 : C.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = C.statusText === void 0 ? "" : "" + C.statusText, this.headers = new h(C.headers), this.url = C.url || "", this._initBody(m);
      }
      U.call(Q.prototype), Q.prototype.clone = function() {
        return new Q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, Q.error = function() {
        var m = new Q(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var oe = [301, 302, 303, 307, 308];
      Q.redirect = function(m, C) {
        if (oe.indexOf(C) === -1)
          throw new RangeError("Invalid status code");
        return new Q(null, { status: C, headers: { location: m } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(C, _) {
          this.message = C, this.name = _;
          var M = Error(C);
          this.stack = M.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function Y(m, C) {
        return new Promise(function(_, M) {
          var W = new T(m, C);
          if (W.signal && W.signal.aborted)
            return M(new t.DOMException("Aborted", "AbortError"));
          var F = new XMLHttpRequest();
          function we() {
            F.abort();
          }
          F.onload = function() {
            var I = {
              statusText: F.statusText,
              headers: X(F.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (F.status < 200 || F.status > 599) ? I.status = 200 : I.status = F.status, I.url = "responseURL" in F ? F.responseURL : I.headers.get("X-Request-URL");
            var R = "response" in F ? F.response : F.responseText;
            setTimeout(function() {
              _(new Q(R, I));
            }, 0);
          }, F.onerror = function() {
            setTimeout(function() {
              M(new TypeError("Network request failed"));
            }, 0);
          }, F.ontimeout = function() {
            setTimeout(function() {
              M(new TypeError("Network request timed out"));
            }, 0);
          }, F.onabort = function() {
            setTimeout(function() {
              M(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function le(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (F.open(W.method, le(W.url), !0), W.credentials === "include" ? F.withCredentials = !0 : W.credentials === "omit" && (F.withCredentials = !1), "responseType" in F && (r.blob ? F.responseType = "blob" : r.arrayBuffer && (F.responseType = "arraybuffer")), C && typeof C.headers == "object" && !(C.headers instanceof h || n.Headers && C.headers instanceof n.Headers)) {
            var Ke = [];
            Object.getOwnPropertyNames(C.headers).forEach(function(I) {
              Ke.push(a(I)), F.setRequestHeader(I, c(C.headers[I]));
            }), W.headers.forEach(function(I, R) {
              Ke.indexOf(R) === -1 && F.setRequestHeader(R, I);
            });
          } else
            W.headers.forEach(function(I, R) {
              F.setRequestHeader(R, I);
            });
          W.signal && (W.signal.addEventListener("abort", we), F.onreadystatechange = function() {
            F.readyState === 4 && W.signal.removeEventListener("abort", we);
          }), F.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = h, n.Request = T, n.Response = Q), t.Headers = h, t.Request = T, t.Response = Q, t.fetch = Y, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : qn);
})();
const a1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function c1(e, t) {
  const n = {};
  return Object.assign(n, a1, t), await fetch(e, n);
}
function l1(e) {
  let t = c1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function u1(...e) {
  const { fetchLib: t, middlewares: n } = l1(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
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
var Wi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Wi || (Wi = {}));
var Ws;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ws || (Ws = {}));
var wp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(wp || (wp = {}));
const d1 = "https://api.mainnet.hiro.so", f1 = "https://api.testnet.hiro.so", h1 = "http://localhost:3999", p1 = ["mainnet", "testnet", "devnet", "mocknet"];
let Zi = class {
  constructor(t) {
    this.version = Ws.Mainnet, this.chainId = Wi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ws.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? u1();
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
Zi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new pd();
    case "testnet":
      return new g1();
    case "devnet":
      return new y1();
    case "mocknet":
      return new gy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${p1.join(", ")}`);
  }
};
Zi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Zi.fromName(e);
let pd = class extends Zi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? d1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Mainnet, this.chainId = Wi.Mainnet;
  }
}, g1 = class extends Zi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? f1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Wi.Testnet;
  }
}, gy = class extends Zi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? h1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Wi.Testnet;
  }
};
const y1 = gy, yy = "xtrata.wallet.bridge.v1", w1 = (e) => typeof e == "object" && e !== null && e.protocol === yy, m1 = (e) => w1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", b1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class La extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const mp = 12e4;
class x1 {
  constructor(t) {
    Ia(this, "pending", /* @__PURE__ */ new Map());
    Ia(this, "listenTarget");
    Ia(this, "closed", !1);
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
    Ia(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !m1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new La("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new La("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new La("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = b1(), o = { protocol: yy, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new La(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? mp}ms.`
          )
        );
      }, this.options.timeoutMs ?? mp);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new La("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const S1 = ["SP", "SM"], v1 = ["ST", "SN"], A1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return S1.includes(n) ? "mainnet" : v1.includes(n) ? "testnet" : null;
}, E1 = () => {
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
}, k1 = () => typeof window > "u" || !window.localStorage ? E1() : window.localStorage, Cu = "xtrata.v15.1.wallet.session", bp = "mainnet", dl = { isConnected: !1 }, $1 = (e) => e.address ? A1(e.address) ?? e.network : e.network, wy = (e) => !e.isConnected || !e.address ? { ...dl } : $1(e) !== bp ? { ...dl } : {
  isConnected: !0,
  address: e.address,
  network: bp,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, I1 = (e) => {
  if (!e)
    return { ...dl };
  try {
    const t = JSON.parse(e);
    return wy(t);
  } catch {
    return { ...dl };
  }
}, L1 = (e) => {
  const t = wy(e);
  return JSON.stringify(t);
}, C1 = (e) => {
  const t = k1();
  return {
    load: () => I1(t.getItem(Cu)),
    save: (n) => {
      t.setItem(Cu, L1(n));
    },
    clear: () => {
      t.removeItem(Cu);
    }
  };
}, T1 = "https://browser.blockstack.org/auth", B1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, my = ["store_write"], M1 = "blockstack-session", N1 = {
  logLevel: "debug"
}, fi = {
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
Object.freeze(fi);
class pa extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, s = this.stack;
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

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class _1 extends pa {
  constructor(t, n = "") {
    super({ code: fi.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class xp extends pa {
  constructor(t = "") {
    super({ code: fi.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class bc extends pa {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: fi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Sp extends pa {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: fi.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class gd extends pa {
  constructor(t) {
    super({ code: fi.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class by extends pa {
  constructor(t) {
    super({ code: fi.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const vp = ["debug", "info", "warn", "error", "none"], yd = {};
for (let e = 0; e < vp.length; e++) {
  const t = vp[e];
  yd[t] = e;
}
class ji {
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
    return yd[N1.logLevel] <= yd[t];
  }
}
function P1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function U1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Tu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function O1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function H1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function D1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function Ef(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = H1(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    ji.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = D1(s, e.toString(), n);
    throw ji.error(o), new Error(o);
  }
  if (r)
    return {};
}
function $s(e, t) {
  return kf(Dn(e), t);
}
function Dn(e) {
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
  if (tr(e, Uint8Array))
    return BigInt(`0x${Ue(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function F1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Ap(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function ic(e, t = 8) {
  return (typeof e == "bigint" ? e : Dn(e)).toString(16).padStart(t * 2, "0");
}
function Vl(e) {
  return parseInt(e, 16);
}
function kf(e, t = 16) {
  const n = ic(e, t);
  return St(n);
}
function j1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function R1(e, t) {
  return e & BigInt(1) << t;
}
function wd(e) {
  return z1(BigInt(`0x${Ue(e)}`), BigInt(e.byteLength * 8));
}
function z1(e, t) {
  return R1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const G1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ue(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += G1[n];
  return t;
}
function St(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = F1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function hi(e) {
  return new TextEncoder().encode(e);
}
function ac(e) {
  return new TextDecoder().decode(e);
}
function K1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function V1(e) {
  return String.fromCharCode.apply(null, e);
}
function X1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Ep(e) {
  if (e.some(X1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function fo(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function cn(e) {
  return fo(...e.map((t) => typeof t == "number" ? Ep([t]) : t instanceof Array ? Ep(t) : t));
}
function tr(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const xy = "https://api.mainnet.hiro.so", Sy = "https://api.testnet.hiro.so", vy = "http://localhost:3999", q1 = "https://hub.blockstack.org", Y1 = 33, Bu = 32;
function W1(e) {
  if (e.length < Bu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Bu * 2), r = e.slice(2 + Bu * 2);
  return {
    recoveryId: Vl(t),
    r: n,
    s: r
  };
}
function $f(e) {
  const t = typeof e == "string" ? St(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function Z1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function J1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function Q1(e, t) {
  return e[t];
}
function e2(e, t, n = 0) {
  return e[n] = t, e;
}
function t2(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Zs(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const n2 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function r2(e, t) {
  const n = {};
  return Object.assign(n, n2, t), await fetch(e, n);
}
function o2(e) {
  let t = r2, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function s2(...e) {
  const { fetchLib: t, middlewares: n } = o2(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
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
class Ay {
  constructor(t = my.slice(), n = ((a) => (a = Ef("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = T1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function md(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function i2(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Ey(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function a2(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  md(e.outputLen), md(e.blockLen);
}
function c2(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function l2(e, t) {
  Ey(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Fs = {
  number: md,
  bool: i2,
  bytes: Ey,
  hash: a2,
  exists: c2,
  output: l2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Mu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), eo = (e, t) => e << 32 - t | e >>> t, u2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!u2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function d2(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function If(e) {
  if (typeof e == "string" && (e = d2(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let ky = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pi(e) {
  const t = (r) => e().update(If(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let $y = class extends ky {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Fs.hash(t);
    const r = If(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return Fs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Fs.exists(this), Fs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Xl = (e, t, n) => new $y(e, t).update(n).digest();
Xl.create = (e, t) => new $y(e, t);
function f2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Lf = class extends ky {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Mu(this.buffer);
  }
  update(t) {
    Fs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = If(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Mu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Fs.exists(this), Fs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    f2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Mu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const h2 = (e, t, n) => e & t ^ ~e & n, p2 = (e, t, n) => e & t ^ e & n ^ t & n, g2 = new Uint32Array([
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
]), qo = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Yo = new Uint32Array(64);
let Iy = class extends Lf {
  constructor() {
    super(64, 32, 8, !1), this.A = qo[0] | 0, this.B = qo[1] | 0, this.C = qo[2] | 0, this.D = qo[3] | 0, this.E = qo[4] | 0, this.F = qo[5] | 0, this.G = qo[6] | 0, this.H = qo[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Yo[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Yo[d - 15], y = Yo[d - 2], v = eo(w, 7) ^ eo(w, 18) ^ w >>> 3, x = eo(y, 17) ^ eo(y, 19) ^ y >>> 10;
      Yo[d] = x + Yo[d - 7] + v + Yo[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = eo(a, 6) ^ eo(a, 11) ^ eo(a, 25), y = h + w + h2(a, c, u) + g2[d] + Yo[d] | 0, x = (eo(r, 2) ^ eo(r, 13) ^ eo(r, 22)) + p2(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Yo.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, y2 = class extends Iy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ji = pi(() => new Iy());
pi(() => new y2());
const w2 = {}, Ly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: w2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const mt = BigInt(0), Kt = BigInt(1), Ss = BigInt(2), Fa = BigInt(3), kp = BigInt(8), _t = Object.freeze({
  a: mt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Kt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), $p = (e, t) => (e + t / Ss) / t, xc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = _t, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Kt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = $p(o * e, t), c = $p(-r * e, t);
    let u = ge(e - a * n - c * s, t), h = ge(-a * r - c * o, t);
    const d = u > i, w = h > i;
    if (d && (u = t - u), w && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: w, k2: h };
  }
}, Vr = 32, Js = 32, Cy = 32, fl = Vr + 1, hl = 2 * Vr + 1;
function Ip(e) {
  const { a: t, b: n } = _t, r = ge(e * e), s = ge(r * e);
  return ge(s + t * e + n);
}
const Sc = _t.a === mt;
class Cf extends Error {
  constructor(t) {
    super(t);
  }
}
function Lp(e) {
  if (!(e instanceof kt))
    throw new TypeError("JacobianPoint expected");
}
class kt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof at))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(at.ZERO) ? kt.ZERO : new kt(t.x, t.y, Kt);
  }
  static toAffineBatch(t) {
    const n = v2(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return kt.toAffineBatch(t).map(kt.fromAffine);
  }
  equals(t) {
    Lp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = ge(s * s), u = ge(a * a), h = ge(n * u), d = ge(o * c), w = ge(ge(r * a) * u), y = ge(ge(i * s) * c);
    return h === d && w === y;
  }
  negate() {
    return new kt(this.x, ge(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = ge(t * t), o = ge(n * n), i = ge(o * o), a = t + o, c = ge(Ss * (ge(a * a) - s - i)), u = ge(Fa * s), h = ge(u * u), d = ge(h - Ss * c), w = ge(u * (c - d) - kp * i), y = ge(Ss * n * r);
    return new kt(d, w, y);
  }
  add(t) {
    Lp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === mt || i === mt)
      return this;
    if (n === mt || r === mt)
      return t;
    const c = ge(s * s), u = ge(a * a), h = ge(n * u), d = ge(o * c), w = ge(ge(r * a) * u), y = ge(ge(i * s) * c), v = ge(d - h), x = ge(y - w);
    if (v === mt)
      return x === mt ? this.double() : kt.ZERO;
    const L = ge(v * v), U = ge(v * L), P = ge(h * L), A = ge(x * x - U - Ss * P), T = ge(x * (P - A) - w * U), B = ge(s * a * v);
    return new kt(A, T, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = kt.ZERO;
    if (typeof t == "bigint" && t === mt)
      return n;
    let r = Bp(t);
    if (r === Kt)
      return this;
    if (!Sc) {
      let d = n, w = this;
      for (; r > mt; )
        r & Kt && (d = d.add(w)), w = w.double(), r >>= Kt;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = xc.splitScalar(r), c = n, u = n, h = this;
    for (; o > mt || a > mt; )
      o & Kt && (c = c.add(h)), a & Kt && (u = u.add(h)), h = h.double(), o >>= Kt, a >>= Kt;
    return s && (c = c.negate()), i && (u = u.negate()), u = new kt(ge(u.x * xc.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = Sc ? 128 / t + 1 : 256 / t + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let a = 1; a < 2 ** (t - 1); a++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(kt.BASE) && (n = at.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && bd.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = kt.normalizeZ(s), bd.set(n, s)));
    let o = kt.ZERO, i = kt.BASE;
    const a = 1 + (Sc ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Kt);
      const x = y, L = y + Math.abs(v) - 1, U = w % 2 !== 0, P = v < 0;
      v === 0 ? i = i.add(vc(U, s[x])) : o = o.add(vc(P, s[L]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = Bp(t), s, o;
    if (Sc) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = xc.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(u, n);
      h = vc(i, h), w = vc(c, w), w = new kt(ge(w.x * xc.beta), w.y, w.z), s = h.add(w), o = d.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return kt.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(kt.ZERO);
    t == null && (t = o ? kp : ga(s));
    const i = t, a = ge(i * i), c = ge(a * i), u = ge(n * a), h = ge(r * c), d = ge(s * i);
    if (o)
      return at.ZERO;
    if (d !== Kt)
      throw new Error("invZ was invalid");
    return new at(u, h);
  }
}
kt.BASE = new kt(_t.Gx, _t.Gy, Kt);
kt.ZERO = new kt(mt, Kt, mt);
function vc(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const bd = /* @__PURE__ */ new WeakMap();
class at {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, bd.delete(this);
  }
  hasEvenY() {
    return this.y % Ss === mt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = gr(n ? t : t.subarray(1));
    if (!el(r))
      throw new Error("Point is not on curve");
    const s = Ip(r);
    let o = S2(s);
    const i = (o & Kt) === Kt;
    n ? i && (o = ge(-o)) : (t[0] & 1) === 1 !== i && (o = ge(-o));
    const a = new at(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = gr(t.subarray(1, Vr + 1)), r = gr(t.subarray(Vr + 1, Vr * 2 + 1)), s = new at(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = ho(t), r = n.length, s = n[0];
    if (r === Vr)
      return this.fromCompressedHex(n);
    if (r === fl && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === hl && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${fl} compressed bytes or ${hl} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return at.BASE.multiply(Qs(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = My(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Tf(ho(t)), { n: a } = _t, c = r === 2 || r === 3 ? s + a : s, u = ga(c, a), h = ge(-i * u, a), d = ge(o * u, a), w = r & 1 ? "03" : "02", y = at.fromHex(w + vs(c)), v = at.BASE.multiplyAndAddUnsafe(y, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return As(this.toHex(t));
  }
  toHex(t = !1) {
    const n = vs(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${vs(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!el(n) || !el(r))
      throw new Error(t);
    const s = ge(r * r), o = Ip(n);
    if (ge(s - o) !== mt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new at(this.x, ge(-this.y));
  }
  double() {
    return kt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return kt.fromAffine(this).add(kt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return kt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = kt.fromAffine(this), o = n === mt || n === Kt || this !== at.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = kt.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(kt.ZERO) ? void 0 : a.toAffine();
  }
}
at.BASE = new at(_t.Gx, _t.Gy);
at.ZERO = new at(mt, mt);
function Cp(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Tp(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Qi(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gr(n), left: e.subarray(t + 2) };
}
function m2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Qi(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Tp(e.subarray(2)), { data: r, left: s } = Tp(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Qi(s)}`);
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
    const s = n ? Qi(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new pr(pl(s.slice(0, 64)), pl(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = m2(n ? t : As(t));
    return new pr(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!ta(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ta(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = _t.n >> Kt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new pr(this.r, ge(-this.s, _t.n)) : this;
  }
  toDERRawBytes() {
    return As(this.toDERHex());
  }
  toDERHex() {
    const t = Cp(Ca(this.s)), n = Cp(Ca(this.r)), r = t.length / 2, s = n.length / 2, o = Ca(r), i = Ca(s);
    return `30${Ca(s + r + 4)}02${i}${n}02${o}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return As(this.toCompactHex());
  }
  toCompactHex() {
    return vs(this.r) + vs(this.s);
  }
}
function bs(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const b2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Qi(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += b2[e[n]];
  return t;
}
const x2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function vs(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(mt <= e && e < x2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function ea(e) {
  const t = As(vs(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Ca(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function pl(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function As(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function gr(e) {
  return pl(Qi(e));
}
function ho(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : As(e);
}
function Bp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && ta(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ge(e, t = _t.P) {
  const n = e % t;
  return n >= mt ? n : t + n;
}
function Ar(e, t) {
  const { P: n } = _t;
  let r = e;
  for (; t-- > mt; )
    r *= r, r %= n;
  return r;
}
function S2(e) {
  const { P: t } = _t, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = Ar(u, Fa) * u % t, d = Ar(h, Fa) * u % t, w = Ar(d, Ss) * c % t, y = Ar(w, r) * w % t, v = Ar(y, s) * y % t, x = Ar(v, i) * v % t, L = Ar(x, a) * x % t, U = Ar(L, i) * v % t, P = Ar(U, Fa) * u % t, A = Ar(P, o) * y % t, T = Ar(A, n) * c % t, B = Ar(T, Ss);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function ga(e, t = _t.P) {
  if (e === mt || t <= mt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ge(e, t), r = t, s = mt, o = Kt;
  for (; n !== mt; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== Kt)
    throw new Error("invert: does not exist");
  return ge(s, t);
}
function v2(e, t = _t.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === mt ? o : (n[a] = o, ge(o * i, t)), Kt), s = ga(r, t);
  return e.reduceRight((o, i, a) => i === mt ? o : (n[a] = ge(o * n[a], t), ge(o * i, t)), s), n;
}
function A2(e) {
  const t = e.length * 8 - Js * 8, n = gr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function Tf(e, t = !1) {
  const n = A2(e);
  if (t)
    return n;
  const { n: r } = _t;
  return n >= r ? n - r : n;
}
let qi, ja;
class Ty {
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
    return ja(this.k, ...t);
  }
  checkSync() {
    if (typeof ja != "function")
      throw new Cf("hmacSha256Sync needs to be set");
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
    return bs(...n);
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
    return bs(...n);
  }
}
function ta(e) {
  return mt < e && e < _t.n;
}
function el(e) {
  return mt < e && e < _t.P;
}
function By(e, t, n, r = !0) {
  const { n: s } = _t, o = Tf(e, !0);
  if (!ta(o))
    return;
  const i = ga(o, s), a = at.BASE.multiply(o), c = ge(a.x, s);
  if (c === mt)
    return;
  const u = ge(i * ge(t + n * c, s), s);
  if (u === mt)
    return;
  let h = new pr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Kt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function Qs(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Js)
      throw new Error("Expected 32 bytes of private key");
    t = pl(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Js)
      throw new Error("Expected 32 bytes of private key");
    t = gr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!ta(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Bf(e) {
  return e instanceof at ? (e.assertValidity(), e) : at.fromHex(e);
}
function My(e) {
  if (e instanceof pr)
    return e.assertValidity(), e;
  try {
    return pr.fromDER(e);
  } catch {
    return pr.fromCompact(e);
  }
}
function cc(e, t = !1) {
  return at.fromPrivateKey(e).toRawBytes(t);
}
function E2(e, t, n, r = !1) {
  return at.fromSignature(e, t, n).toRawBytes(r);
}
function Mp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === fl || r === hl : n ? r === fl * 2 || r === hl * 2 : e instanceof at;
}
function Mf(e, t, n = !1) {
  if (Mp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Mp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Bf(t);
  return r.assertValidity(), r.multiply(Qs(e)).toRawBytes(n);
}
function Ny(e) {
  const t = e.length > Vr ? e.slice(0, Vr) : e;
  return gr(t);
}
function k2(e) {
  const t = Ny(e), n = ge(t, _t.n);
  return _y(n < mt ? t : n);
}
function _y(e) {
  return ea(e);
}
function Py(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = ho(e), s = Qs(t), o = [_y(s), k2(r)];
  if (n != null) {
    n === !0 && (n = nn.randomBytes(Vr));
    const c = ho(n);
    if (c.length !== Vr)
      throw new Error(`sign: Expected ${Vr} bytes of extra data`);
    o.push(c);
  }
  const i = bs(...o), a = Ny(r);
  return { seed: i, m: a, d: s };
}
function Uy(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function $2(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Py(e, t, n.extraEntropy), i = new Ty(Cy, Js);
  await i.reseed(r);
  let a;
  for (; !(a = By(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Uy(a, n);
}
function ql(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Py(e, t, n.extraEntropy), i = new Ty(Cy, Js);
  i.reseedSync(r);
  let a;
  for (; !(a = By(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Uy(a, n);
}
const I2 = { strict: !0 };
function L2(e, t, n, r = I2) {
  let s;
  try {
    s = My(e), t = ho(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Tf(t);
  let c;
  try {
    c = Bf(n);
  } catch {
    return !1;
  }
  const { n: u } = _t, h = ga(i, u), d = ge(a * h, u), w = ge(o * h, u), y = at.BASE.multiplyAndAddUnsafe(c, d, w);
  return y ? ge(y.x, u) === o : !1;
}
function gl(e) {
  return ge(gr(e), _t.n);
}
class na {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = ho(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gr(n.subarray(0, 32)), s = gr(n.subarray(32, 64));
    return new na(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!el(t) || !ta(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return vs(this.r) + vs(this.s);
  }
  toRawBytes() {
    return As(this.toHex());
  }
}
function C2(e) {
  return at.fromPrivateKey(e).toRawX();
}
class Oy {
  constructor(t, n, r = nn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = ho(t);
    const { x: s, scalar: o } = this.getScalar(Qs(n));
    if (this.px = s, this.d = o, this.rand = ho(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = at.fromPrivateKey(t), r = n.hasEvenY() ? t : _t.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return ea(t ^ gr(n));
  }
  finalizeNonce(t) {
    const n = ge(gr(t), _t.n);
    if (n === mt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new na(t.x, ge(n + r * s, _t.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = nn.taggedHash, i = this.initNonce(n, await o(ms.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(ms.nonce, i, r, t)), h = gl(await o(ms.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await Fy(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = nn.taggedHashSync, i = this.initNonce(n, o(ms.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(ms.nonce, i, r, t)), h = gl(o(ms.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return jy(d, t, r) || this.error(), d;
  }
}
async function T2(e, t, n) {
  return new Oy(e, t, n).calc();
}
function B2(e, t, n) {
  return new Oy(e, t, n).calcSync();
}
function Hy(e, t, n) {
  const r = e instanceof na, s = r ? e : na.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: ho(t),
    P: Bf(n)
  };
}
function Dy(e, t, n, r) {
  const s = at.BASE.multiplyAndAddUnsafe(t, Qs(n), ge(-r, _t.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Fy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Hy(e, t, n), a = gl(await nn.taggedHash(ms.challenge, ea(r), i.toRawX(), o));
    return Dy(r, i, s, a);
  } catch {
    return !1;
  }
}
function jy(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Hy(e, t, n), a = gl(nn.taggedHashSync(ms.challenge, ea(r), i.toRawX(), o));
    return Dy(r, i, s, a);
  } catch (r) {
    if (r instanceof Cf)
      throw r;
    return !1;
  }
}
const M2 = {
  Signature: na,
  getPublicKey: C2,
  sign: T2,
  verify: Fy,
  signSync: B2,
  verifySync: jy
};
at.BASE._setWindowSize(8);
const ir = {
  node: Ly,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ms = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ac = {}, nn = {
  bytesToHex: Qi,
  hexToBytes: As,
  concatBytes: bs,
  mod: ge,
  invert: ga,
  isValidPrivateKey(e) {
    try {
      return Qs(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ea,
  _normalizePrivateKey: Qs,
  hashToPrivateKey: (e) => {
    e = ho(e);
    const t = Js + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ge(gr(e), _t.n - Kt) + Kt;
    return ea(n);
  },
  randomBytes: (e = 32) => {
    if (ir.web)
      return ir.web.getRandomValues(new Uint8Array(e));
    if (ir.node) {
      const { randomBytes: t } = ir.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => nn.hashToPrivateKey(nn.randomBytes(Js + 8)),
  precompute(e = 8, t = at.BASE) {
    const n = t === at.BASE ? t : new at(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Fa), n;
  },
  sha256: async (...e) => {
    if (ir.web) {
      const t = await ir.web.subtle.digest("SHA-256", bs(...e));
      return new Uint8Array(t);
    } else if (ir.node) {
      const { createHash: t } = ir.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (ir.web) {
      const n = await ir.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = bs(...t), s = await ir.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (ir.node) {
      const { createHmac: n } = ir.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Ac[e];
    if (n === void 0) {
      const r = await nn.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = bs(r, r), Ac[e] = n;
    }
    return nn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof qi != "function")
      throw new Cf("sha256Sync is undefined, you need to set it");
    let n = Ac[e];
    if (n === void 0) {
      const r = qi(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = bs(r, r), Ac[e] = n;
    }
    return qi(n, ...t);
  },
  _JacobianPoint: kt
};
Object.defineProperties(nn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return qi;
    },
    set(e) {
      qi || (qi = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ja;
    },
    set(e) {
      ja || (ja = e);
    }
  }
});
const N2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: _t,
  Point: at,
  Signature: pr,
  getPublicKey: cc,
  getSharedSecret: Mf,
  recoverPublicKey: E2,
  schnorr: M2,
  sign: $2,
  signSync: ql,
  utils: nn,
  verify: L2
}, Symbol.toStringTag, { value: "Module" }));
var lc = {};
lc.byteLength = H2;
var _2 = lc.toByteArray = F2, P2 = lc.fromByteArray = z2, so = [], kr = [], U2 = typeof Uint8Array < "u" ? Uint8Array : Array, Nu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ni = 0, O2 = Nu.length; Ni < O2; ++Ni)
  so[Ni] = Nu[Ni], kr[Nu.charCodeAt(Ni)] = Ni;
kr[45] = 62;
kr[95] = 63;
function Ry(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function H2(e) {
  var t = Ry(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function D2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function F2(e) {
  var t, n = Ry(e), r = n[0], s = n[1], o = new U2(D2(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = kr[e.charCodeAt(c)] << 18 | kr[e.charCodeAt(c + 1)] << 12 | kr[e.charCodeAt(c + 2)] << 6 | kr[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = kr[e.charCodeAt(c)] << 2 | kr[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = kr[e.charCodeAt(c)] << 10 | kr[e.charCodeAt(c + 1)] << 4 | kr[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function j2(e) {
  return so[e >> 18 & 63] + so[e >> 12 & 63] + so[e >> 6 & 63] + so[e & 63];
}
function R2(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(j2(r));
  return s.join("");
}
function z2(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(R2(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    so[t >> 2] + so[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    so[t >> 10] + so[t >> 4 & 63] + so[t << 2 & 63] + "="
  )), s.join("");
}
function G2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const K2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function V2() {
  if (G2())
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
    throw new Error(K2);
  }
}
class X2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array(fo(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array(fo(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class q2 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function zy() {
  const e = await V2();
  return e.name === "subtleCrypto" ? new q2(e.lib) : new X2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function Y2(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var s = e.charAt(r), o = s.charCodeAt(0);
    if (t[o] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[o] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var v = 0, x = 0, L = 0, U = y.length; L !== U && y[L] === 0; )
      L++, v++;
    for (var P = (U - L) * u + 1 >>> 0, A = new Uint8Array(P); L !== U; ) {
      for (var T = y[L], B = 0, X = P - 1; (T !== 0 || B < x) && X !== -1; X--, B++)
        T += 256 * A[X] >>> 0, A[X] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      x = B, L++;
    }
    for (var Q = P - x; Q !== P && A[Q] === 0; )
      Q++;
    for (var oe = a.repeat(v); Q < P; ++Q)
      oe += e.charAt(A[Q]);
    return oe;
  }
  function d(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var v = 0, x = 0, L = 0; y[v] === a; )
      x++, v++;
    for (var U = (y.length - v) * c + 1 >>> 0, P = new Uint8Array(U); y[v]; ) {
      var A = y.charCodeAt(v);
      if (A > 255)
        return;
      var T = t[A];
      if (T === 255)
        return;
      for (var B = 0, X = U - 1; (T !== 0 || B < L) && X !== -1; X--, B++)
        T += i * P[X] >>> 0, P[X] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      L = B, v++;
    }
    for (var Q = U - L; Q !== U && P[Q] === 0; )
      Q++;
    for (var oe = new Uint8Array(x + (U - Q)), Y = x; Q !== U; )
      oe[Y++] = P[Q++];
    return oe;
  }
  function w(y) {
    var v = d(y);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: w
  };
}
var Gy = Y2;
const W2 = Gy, Z2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var J2 = W2(Z2);
const Q2 = /* @__PURE__ */ py(J2), ex = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ky = Uint8Array.from({ length: 16 }, (e, t) => t), tx = Ky.map((e) => (9 * e + 5) % 16);
let Nf = [Ky], _f = [tx];
for (let e = 0; e < 4; e++)
  for (let t of [Nf, _f])
    t.push(t[e].map((n) => ex[n]));
const Vy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), nx = Nf.map((e, t) => e.map((n) => Vy[t][n])), rx = _f.map((e, t) => e.map((n) => Vy[t][n])), ox = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), sx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ec = (e, t) => e << t | e >>> 32 - t;
function Np(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const kc = new Uint32Array(16);
let ix = class extends Lf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      kc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = ox[y], L = sx[y], U = Nf[y], P = _f[y], A = nx[y], T = rx[y];
      for (let B = 0; B < 16; B++) {
        const X = Ec(r + Np(y, o, a, u) + kc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Ec(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Ec(s + Np(v, i, c, h) + kc[P[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Ec(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    kc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const ax = pi(() => new ix());
function cx(e) {
  return ax(e);
}
const $c = BigInt(2 ** 32 - 1), xd = BigInt(32);
function Xy(e, t = !1) {
  return t ? { h: Number(e & $c), l: Number(e >> xd & $c) } : { h: Number(e >> xd & $c) | 0, l: Number(e & $c) | 0 };
}
function lx(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Xy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const ux = (e, t) => BigInt(e >>> 0) << xd | BigInt(t >>> 0), dx = (e, t, n) => e >>> n, fx = (e, t, n) => e << 32 - n | t >>> n, hx = (e, t, n) => e >>> n | t << 32 - n, px = (e, t, n) => e << 32 - n | t >>> n, gx = (e, t, n) => e << 64 - n | t >>> n - 32, yx = (e, t, n) => e >>> n - 32 | t << 64 - n, wx = (e, t) => t, mx = (e, t) => e, bx = (e, t, n) => e << n | t >>> 32 - n, xx = (e, t, n) => t << n | e >>> 32 - n, Sx = (e, t, n) => t << n - 32 | e >>> 64 - n, vx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Ax(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ex = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), kx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, $x = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Ix = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Lx = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Cx = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Qe = {
  fromBig: Xy,
  split: lx,
  toBig: ux,
  shrSH: dx,
  shrSL: fx,
  rotrSH: hx,
  rotrSL: px,
  rotrBH: gx,
  rotrBL: yx,
  rotr32H: wx,
  rotr32L: mx,
  rotlSH: bx,
  rotlSL: xx,
  rotlBH: Sx,
  rotlBL: vx,
  add: Ax,
  add3L: Ex,
  add3H: kx,
  add4L: $x,
  add4H: Ix,
  add5H: Cx,
  add5L: Lx
}, [Tx, Bx] = Qe.split([
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
].map((e) => BigInt(e))), Wo = new Uint32Array(80), Zo = new Uint32Array(80);
let Yl = class extends Lf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Wo[A] = t.getUint32(n), Zo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Wo[A - 15] | 0, B = Zo[A - 15] | 0, X = Qe.rotrSH(T, B, 1) ^ Qe.rotrSH(T, B, 8) ^ Qe.shrSH(T, B, 7), Q = Qe.rotrSL(T, B, 1) ^ Qe.rotrSL(T, B, 8) ^ Qe.shrSL(T, B, 7), oe = Wo[A - 2] | 0, Y = Zo[A - 2] | 0, m = Qe.rotrSH(oe, Y, 19) ^ Qe.rotrBH(oe, Y, 61) ^ Qe.shrSH(oe, Y, 6), C = Qe.rotrSL(oe, Y, 19) ^ Qe.rotrBL(oe, Y, 61) ^ Qe.shrSL(oe, Y, 6), _ = Qe.add4L(Q, C, Zo[A - 7], Zo[A - 16]), M = Qe.add4H(_, X, m, Wo[A - 7], Wo[A - 16]);
      Wo[A] = M | 0, Zo[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = Qe.rotrSH(d, w, 14) ^ Qe.rotrSH(d, w, 18) ^ Qe.rotrBH(d, w, 41), B = Qe.rotrSL(d, w, 14) ^ Qe.rotrSL(d, w, 18) ^ Qe.rotrBL(d, w, 41), X = d & y ^ ~d & x, Q = w & v ^ ~w & L, oe = Qe.add5L(P, B, Q, Bx[A], Zo[A]), Y = Qe.add5H(oe, U, T, X, Tx[A], Wo[A]), m = oe | 0, C = Qe.rotrSH(r, s, 28) ^ Qe.rotrBH(r, s, 34) ^ Qe.rotrBH(r, s, 39), _ = Qe.rotrSL(r, s, 28) ^ Qe.rotrBL(r, s, 34) ^ Qe.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = x | 0, P = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = Qe.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = Qe.add3L(m, _, W);
      r = Qe.add3H(F, Y, C, M), s = F | 0;
    }
    ({ h: r, l: s } = Qe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Qe.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Qe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = Qe.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = Qe.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = Qe.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: P } = Qe.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, P);
  }
  roundClean() {
    Wo.fill(0), Zo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Mx = class extends Yl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Nx = class extends Yl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, _x = class extends Yl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Px = pi(() => new Yl());
pi(() => new Mx());
pi(() => new Nx());
pi(() => new _x());
function qy(e) {
  return Ji(e);
}
function Ux(e) {
  return Px(e);
}
const Ox = 0;
nn.hmacSha256Sync = (e, ...t) => {
  const n = Xl.create(Ji, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Hx() {
  return Ue(nn.randomPrivateKey());
}
function Dx(e) {
  const t = Ji(Ji(e));
  return Q2.encode(fo(e, t).slice(0, e.length + 4));
}
function Fx(e, t) {
  return Dx(fo(new Uint8Array([e]), t.slice(0, 20)));
}
function Yy(e, t = Ox) {
  const n = typeof e == "string" ? St(e) : e, r = cx(qy(n));
  return Fx(t, r);
}
function Wy(e) {
  const t = $f(e);
  return Ue(cc(t.slice(0, 32), !0));
}
nn.hmacSha256Sync = (e, ...t) => {
  const n = Xl.create(Ji, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var yl;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(yl || (yl = {}));
async function jx(e, t, n) {
  return await (await zy()).encrypt("aes-256-cbc", t, e, n);
}
async function Rx(e, t, n) {
  return await (await zy()).decrypt("aes-256-cbc", t, e, n);
}
function Zy(e, t) {
  return Xl(Ji, e, t);
}
function zx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function Jy(e) {
  const t = Ux(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Gx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Kx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: yl.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: yl.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Gx(e))
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
async function Vx(e, t, n, r) {
  const s = Kx(e);
  if (!s.result)
    throw s;
  const o = nn.randomPrivateKey(), i = cc(o, !0);
  let a = Mf(o, e, !0);
  a = a.slice(1);
  const c = Jy(a), u = nn.randomBytes(16), h = await jx(u, c.encryptionKey, t), d = fo(u, i, h), w = Zy(c.hmacKey, d);
  let y;
  if (!r || r === "hex")
    y = Ue(h);
  else if (r === "base64")
    y = P2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: Ue(u),
    ephemeralPK: Ue(i),
    cipherText: y,
    mac: Ue(w),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function Qy(e, t) {
  if (!t.ephemeralPK)
    throw new Sp("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Mf(e, n, !0);
  r = r.slice(1);
  const s = Jy(r), o = St(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = St(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = _2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = fo(o, St(n), i), c = Zy(s.hmacKey, a), u = St(t.mac);
  if (!zx(u, c))
    throw new Sp("Decryption failed: failure in MAC check");
  const h = await Rx(o, s.encryptionKey, i);
  return t.wasString ? ac(h) : h;
}
function Xx(e, t) {
  const n = typeof t == "string" ? hi(t) : t, r = Wy(e), s = qy(n), o = ql(s, e);
  return {
    signature: Ue(o),
    publicKey: r
  };
}
async function qx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Wy(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? hi(e) : e, i = await Vx(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Xx(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Yx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Qy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Tn = {}, ra = {}, Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.decode = Vn.encode = Vn.unescape = Vn.escape = Vn.pad = void 0;
const ew = lc;
function Pf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Vn.pad = Pf;
function tw(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Vn.escape = tw;
function nw(e) {
  return Pf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Vn.unescape = nw;
function Wx(e) {
  return tw((0, ew.fromByteArray)(new TextEncoder().encode(e)));
}
Vn.encode = Wx;
function Zx(e) {
  return new TextDecoder().decode((0, ew.toByteArray)(Pf(nw(e))));
}
Vn.decode = Zx;
var Wl = {}, Zl = {}, rw = {}, ow = {}, Jl = {};
Object.defineProperty(Jl, "__esModule", { value: !0 });
Jl.crypto = void 0;
Jl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = w, e.rotl = y, e.byteSwap = v, e.byteSwap32 = x, e.bytesToHex = P, e.hexToBytes = B, e.asyncLoop = Q, e.utf8ToBytes = oe, e.bytesToUtf8 = Y, e.toBytes = m, e.kdfInputToBytes = C, e.concatBytes = _, e.checkOpts = M, e.createHasher = F, e.createOptHasher = we, e.createXOFer = le, e.randomBytes = Ke;
  const t = Jl;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...R) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (R.length > 0 && !R.includes(I.length))
      throw new Error("Uint8Array expected of length " + R + ", got length=" + I.length);
  }
  function o(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function i(I, R = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (R && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, R) {
    s(I);
    const de = R.outputLen;
    if (I.length < de)
      throw new Error("digestInto() expects output buffer of length at least " + de);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function h(...I) {
    for (let R = 0; R < I.length; R++)
      I[R].fill(0);
  }
  function d(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function w(I, R) {
    return I << 32 - R | I >>> R;
  }
  function y(I, R) {
    return I << R | I >>> 32 - R >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (I) => I : (I) => v(I), e.byteSwapIfBE = e.swap8IfBE;
  function x(I) {
    for (let R = 0; R < I.length; R++)
      I[R] = v(I[R]);
    return I;
  }
  e.swap32IfBE = e.isLE ? (I) => I : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (I, R) => R.toString(16).padStart(2, "0"));
  function P(I) {
    if (s(I), L)
      return I.toHex();
    let R = "";
    for (let de = 0; de < I.length; de++)
      R += U[I[de]];
    return R;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T(I) {
    if (I >= A._0 && I <= A._9)
      return I - A._0;
    if (I >= A.A && I <= A.F)
      return I - (A.A - 10);
    if (I >= A.a && I <= A.f)
      return I - (A.a - 10);
  }
  function B(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (L)
      return Uint8Array.fromHex(I);
    const R = I.length, de = R / 2;
    if (R % 2)
      throw new Error("hex string expected, got unpadded hex of length " + R);
    const be = new Uint8Array(de);
    for (let Ne = 0, Ae = 0; Ne < de; Ne++, Ae += 2) {
      const wt = T(I.charCodeAt(Ae)), je = T(I.charCodeAt(Ae + 1));
      if (wt === void 0 || je === void 0) {
        const Be = I[Ae] + I[Ae + 1];
        throw new Error('hex string expected, got non-hex character "' + Be + '" at index ' + Ae);
      }
      be[Ne] = wt * 16 + je;
    }
    return be;
  }
  const X = async () => {
  };
  e.nextTick = X;
  async function Q(I, R, de) {
    let be = Date.now();
    for (let Ne = 0; Ne < I; Ne++) {
      de(Ne);
      const Ae = Date.now() - be;
      Ae >= 0 && Ae < R || (await (0, e.nextTick)(), be += Ae);
    }
  }
  function oe(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function Y(I) {
    return new TextDecoder().decode(I);
  }
  function m(I) {
    return typeof I == "string" && (I = oe(I)), s(I), I;
  }
  function C(I) {
    return typeof I == "string" && (I = oe(I)), s(I), I;
  }
  function _(...I) {
    let R = 0;
    for (let be = 0; be < I.length; be++) {
      const Ne = I[be];
      s(Ne), R += Ne.length;
    }
    const de = new Uint8Array(R);
    for (let be = 0, Ne = 0; be < I.length; be++) {
      const Ae = I[be];
      de.set(Ae, Ne), Ne += Ae.length;
    }
    return de;
  }
  function M(I, R) {
    if (R !== void 0 && {}.toString.call(R) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, R);
  }
  class W {
  }
  e.Hash = W;
  function F(I) {
    const R = (be) => I().update(m(be)).digest(), de = I();
    return R.outputLen = de.outputLen, R.blockLen = de.blockLen, R.create = () => I(), R;
  }
  function we(I) {
    const R = (be, Ne) => I(Ne).update(m(be)).digest(), de = I({});
    return R.outputLen = de.outputLen, R.blockLen = de.blockLen, R.create = (be) => I(be), R;
  }
  function le(I) {
    const R = (be, Ne) => I(Ne).update(m(be)).digest(), de = I({});
    return R.outputLen = de.outputLen, R.blockLen = de.blockLen, R.create = (be) => I(be), R;
  }
  e.wrapConstructor = F, e.wrapConstructorWithOpts = we, e.wrapXOFConstructorWithOpts = le;
  function Ke(I = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(I));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(ow);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = ow;
  class n extends t.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(o);
      const a = (0, t.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? o.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = o.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
      this.oHash.update(u), (0, t.clean)(u);
    }
    update(o) {
      return (0, t.aexists)(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      (0, t.aexists)(this), (0, t.abytes)(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: d } = this;
      return o = o, o.finished = c, o.destroyed = u, o.blockLen = h, o.outputLen = d, o.oHash = i._cloneInto(o.oHash), o.iHash = a._cloneInto(o.iHash), o;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (s, o, i) => new n(s, o).update(i).digest();
  e.hmac = r, e.hmac.create = (s, o) => new n(s, o);
})(rw);
const _i = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function sw(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Sd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function gi(e, ...t) {
  if (!sw(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Jx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Sd(e.outputLen), Sd(e.blockLen);
}
function vd(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function iw(e, t) {
  gi(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Qx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function eS(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function wl(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function tl(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Hr(e, t) {
  return e << 32 - t | e >>> t;
}
function tS(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Uf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Of(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const aw = Uf ? (e) => e : (e) => Of(e), nS = aw;
function cw(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Of(e[t]);
  return e;
}
const rS = Uf ? (e) => e : cw, lw = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", oS = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Hf(e) {
  if (gi(e), lw)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += oS[e[n]];
  return t;
}
const ko = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function _p(e) {
  if (e >= ko._0 && e <= ko._9)
    return e - ko._0;
  if (e >= ko.A && e <= ko.F)
    return e - (ko.A - 10);
  if (e >= ko.a && e <= ko.f)
    return e - (ko.a - 10);
}
function sS(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (lw)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = _p(e.charCodeAt(o)), a = _p(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const uw = async () => {
};
async function iS(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await uw(), r += o);
  }
}
function Df(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function aS(e) {
  return new TextDecoder().decode(e);
}
function uc(e) {
  return typeof e == "string" && (e = Df(e)), gi(e), e;
}
function cS(e) {
  return typeof e == "string" && (e = Df(e)), gi(e), e;
}
function lS(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    gi(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function uS(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let dw = class {
};
function Ql(e) {
  const t = (r) => e().update(uc(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function fw(e) {
  const t = (r, s) => e(s).update(uc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function hw(e) {
  const t = (r, s) => e(s).update(uc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const dS = Ql, fS = fw, hS = hw;
function pS(e = 32) {
  if (_i && typeof _i.getRandomValues == "function")
    return _i.getRandomValues(new Uint8Array(e));
  if (_i && typeof _i.randomBytes == "function")
    return Uint8Array.from(_i.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const gS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: dw,
  abytes: gi,
  aexists: vd,
  ahash: Jx,
  anumber: Sd,
  aoutput: iw,
  asyncLoop: iS,
  byteSwap: Of,
  byteSwap32: cw,
  byteSwapIfBE: nS,
  bytesToHex: Hf,
  bytesToUtf8: aS,
  checkOpts: uS,
  clean: wl,
  concatBytes: lS,
  createHasher: Ql,
  createOptHasher: fw,
  createView: tl,
  createXOFer: hw,
  hexToBytes: sS,
  isBytes: sw,
  isLE: Uf,
  kdfInputToBytes: cS,
  nextTick: uw,
  randomBytes: pS,
  rotl: tS,
  rotr: Hr,
  swap32IfBE: rS,
  swap8IfBE: aw,
  toBytes: uc,
  u32: eS,
  u8: Qx,
  utf8ToBytes: Df,
  wrapConstructor: dS,
  wrapConstructorWithOpts: fS,
  wrapXOFConstructorWithOpts: hS
}, Symbol.toStringTag, { value: "Module" }));
function yS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function wS(e, t, n) {
  return e & t ^ ~e & n;
}
function mS(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class bS extends dw {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = tl(this.buffer);
  }
  update(t) {
    vd(this), t = uc(t), gi(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = tl(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    vd(this), iw(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, wl(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    yS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = tl(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = o, t.length = s, t.pos = a, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Jo = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qo = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), xS = /* @__PURE__ */ Uint32Array.from([
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
]), es = /* @__PURE__ */ new Uint32Array(64);
let Ff = class extends bS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Jo[0] | 0, this.B = Jo[1] | 0, this.C = Jo[2] | 0, this.D = Jo[3] | 0, this.E = Jo[4] | 0, this.F = Jo[5] | 0, this.G = Jo[6] | 0, this.H = Jo[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      es[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = es[d - 15], y = es[d - 2], v = Hr(w, 7) ^ Hr(w, 18) ^ w >>> 3, x = Hr(y, 17) ^ Hr(y, 19) ^ y >>> 10;
      es[d] = x + es[d - 7] + v + es[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Hr(a, 6) ^ Hr(a, 11) ^ Hr(a, 25), y = h + w + wS(a, c, u) + xS[d] + es[d] | 0, x = (Hr(r, 2) ^ Hr(r, 13) ^ Hr(r, 22)) + mS(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    wl(es);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), wl(this.buffer);
  }
}, pw = class extends Ff {
  constructor() {
    super(28), this.A = Qo[0] | 0, this.B = Qo[1] | 0, this.C = Qo[2] | 0, this.D = Qo[3] | 0, this.E = Qo[4] | 0, this.F = Qo[5] | 0, this.G = Qo[6] | 0, this.H = Qo[7] | 0;
  }
};
const SS = /* @__PURE__ */ Ql(() => new Ff()), vS = /* @__PURE__ */ Ql(() => new pw()), AS = Ff, jf = SS, ES = pw, kS = vS, $S = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: ES,
  SHA256: AS,
  sha224: kS,
  sha256: jf
}, Symbol.toStringTag, { value: "Module" })), eu = /* @__PURE__ */ Kl($S), IS = /* @__PURE__ */ Kl(N2);
var oa = {};
Object.defineProperty(oa, "__esModule", { value: !0 });
oa.joseToDer = oa.derToJose = void 0;
const gw = lc, yw = Vn;
function _u(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const LS = {
  ES256: _u(256),
  ES384: _u(384),
  ES512: _u(521)
};
function ww(e) {
  const t = LS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const ml = 128, mw = 0, CS = 32, TS = 16, BS = 2, bw = TS | CS | mw << 6, bl = BS | mw << 6;
function xw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, gw.toByteArray)((0, yw.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function MS(e, t) {
  const n = xw(e), r = ww(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== bw)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (ml | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== bl)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== bl)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const d = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const w = r - c, y = r - h, v = new Uint8Array(w + c + y + h);
  for (i = 0; i < w; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-w, 0), u + c), i), i = r;
  for (const x = i; i < x + y; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-y, 0), d + h), i), (0, yw.escape)((0, gw.fromByteArray)(v));
}
oa.derToJose = MS;
function Pp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= ml && --r, r;
}
function NS(e, t) {
  e = xw(e);
  const n = ww(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Pp(e, 0, n), o = Pp(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < ml, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = bw, u ? h[d++] = c : (h[d++] = ml | 1, h[d++] = c & 255), h[d++] = bl, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(s, n), d), d += n - s), h[d++] = bl, h[d++] = a, o < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + o), d), h;
}
oa.joseToDer = NS;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
No.InvalidTokenError = No.MissingParametersError = void 0;
class _S extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
No.MissingParametersError = _S;
class PS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
No.InvalidTokenError = PS;
const dc = /* @__PURE__ */ Kl(gS);
Object.defineProperty(Zl, "__esModule", { value: !0 });
Zl.SECP256K1Client = void 0;
const US = rw, OS = eu, nl = IS, Up = oa, Op = No, Hp = dc;
nl.utils.hmacSha256Sync = (e, ...t) => {
  const n = US.hmac.create(OS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Sw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Hp.bytesToHex)(nl.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Op.MissingParametersError("a signing input hash and private key are all required");
    const s = nl.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Hp.bytesToHex)(s);
    if (r === "jose")
      return (0, Up.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Up.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Op.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return nl.verify(n, t, r, { strict: !1 });
  }
}
Zl.SECP256K1Client = Sw;
Sw.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Zl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Wl);
var ei = {};
const HS = /* @__PURE__ */ Kl(Ly);
var DS = qn && qn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
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
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(ei, "__esModule", { value: !0 });
ei.hashSha256Async = ei.hashSha256 = void 0;
const FS = eu;
function vw(e) {
  return (0, FS.sha256)(e);
}
ei.hashSha256 = vw;
function jS(e) {
  return DS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = HS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(vw(e));
    }
  });
}
ei.hashSha256Async = jS;
var RS = qn && qn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
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
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(ra, "__esModule", { value: !0 });
ra.TokenSigner = ra.createUnsecuredToken = void 0;
const Ad = Vn, Dp = Wl, zS = No, Fp = ei;
function Ed(e, t) {
  const n = [], r = Ad.encode(JSON.stringify(t));
  n.push(r);
  const s = Ad.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function GS(e) {
  return Ed(e, { typ: "JWT", alg: "none" }) + ".";
}
ra.createUnsecuredToken = GS;
class KS {
  constructor(t, n) {
    if (!(t && n))
      throw new zS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Dp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Dp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = Ed(t, s), i = (0, Fp.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return RS(this, void 0, void 0, function* () {
      const s = this.header(r), o = Ed(t, s), i = yield (0, Fp.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Ad.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
ra.TokenSigner = KS;
var tu = {};
Object.defineProperty(tu, "__esModule", { value: !0 });
tu.TokenVerifier = void 0;
const VS = Vn, jp = Wl, XS = No, Ic = ei;
class qS {
  constructor(t, n) {
    if (!(t && n))
      throw new XS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !jp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = jp.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), s = r[0] + "." + r[1], o = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, Ic.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Ic.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), VS.encode(t.payload)].join(".");
    let s = !0;
    const o = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ic.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Ic.hashSha256)(r);
      return o(i);
    }
  }
}
tu.TokenVerifier = qS;
var nu = {};
Object.defineProperty(nu, "__esModule", { value: !0 });
nu.decodeToken = void 0;
const Lc = Vn;
function YS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(Lc.decode(t[0])), r = JSON.parse(Lc.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = Lc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(Lc.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
nu.decodeToken = YS;
(function(e) {
  var t = qn && qn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = qn && qn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(ra, e), n(tu, e), n(nu, e), n(No, e), n(Wl, e);
})(Tn);
function WS(e) {
  return `did:btc-addr:${e}`;
}
function ZS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new xp("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new xp('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Aw(e) {
  if (e)
    return ZS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const JS = "1.4.0";
function QS() {
  return Hx();
}
function ev(e, t, n, r = my.slice(), s, o = P1().getTime(), i = {}) {
  const a = (y) => {
    const v = Ef("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: O1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: JS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Tn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = Yy(u);
  return c.iss = WS(h), new Tn.TokenSigner("ES256k", e).sign(c);
}
async function Rp(e, t) {
  const n = ac(St(t)), r = JSON.parse(n), s = await Qy(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function tv(e) {
  const t = Tn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Tn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function nv(e) {
  const t = Tn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Aw(t.iss);
  if (n.length === 1) {
    if (Yy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function rv(e) {
  const t = Tn.decodeToken(e).payload;
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
function ov(e) {
  const t = Tn.decodeToken(e).payload;
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
function sv(e) {
  const t = [
    ov(e),
    rv(e),
    tv(e),
    nv(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const zp = "1.0.0";
class Es {
  constructor(t) {
    this.version = zp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== zp)
      throw new gd(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Es(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ew {
  constructor(t) {
    if (t) {
      const n = new Es(t);
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
class Gp extends Ew {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Es({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new by("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Es({})), !0;
  }
}
class Kp extends Ew {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = M1, !localStorage.getItem(this.key)) {
      const r = new Es({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new by("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Es.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Es({})), !0;
  }
}
var qa;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(qa || (qa = {}));
var xl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(xl || (xl = {}));
qa.Mainnet;
var Bo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Bo || (Bo = {}));
var co;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(co || (co = {}));
Bo.Mainnet;
const kw = {
  chainId: qa.Mainnet,
  transactionVersion: Bo.Mainnet,
  peerNetworkId: xl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: co.MainnetSingleSig,
    multiSig: co.MainnetMultiSig
  },
  client: { baseUrl: xy }
}, kd = {
  chainId: qa.Testnet,
  transactionVersion: Bo.Testnet,
  peerNetworkId: xl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: co.TestnetSingleSig,
    multiSig: co.TestnetMultiSig
  },
  client: { baseUrl: Sy }
}, rl = {
  ...kd,
  addressVersion: { ...kd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: vy }
}, iv = {
  ...rl,
  addressVersion: { ...rl.addressVersion },
  client: { ...rl.client }
};
function av(e) {
  switch (e) {
    case "mainnet":
      return kw;
    case "testnet":
      return kd;
    case "devnet":
      return rl;
    case "mocknet":
      return iv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function $w(e) {
  return typeof e == "string" ? av(e) : e;
}
var Vp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Vp || (Vp = {}));
var Xp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Xp || (Xp = {}));
var Dr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Dr || (Dr = {}));
const Pu = ["onChainOnly", "offChainOnly", "any"];
Pu[0] + "", Dr.OnChainOnly, Pu[1] + "", Dr.OffChainOnly, Pu[2] + "", Dr.Any, Dr.OnChainOnly + "", Dr.OnChainOnly, Dr.OffChainOnly + "", Dr.OffChainOnly, Dr.Any + "", Dr.Any;
var qp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(qp || (qp = {}));
var Yp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Yp || (Yp = {}));
var Wp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Wp || (Wp = {}));
var Co;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Co || (Co = {}));
var Zp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Zp || (Zp = {}));
var Jp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Jp || (Jp = {}));
var Qp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Qp || (Qp = {}));
var e0;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(e0 || (e0 = {}));
var t0;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(t0 || (t0 = {}));
var n0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(n0 || (n0 = {}));
var r0;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(r0 || (r0 = {}));
var o0;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(o0 || (o0 = {}));
var s0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(s0 || (s0 = {}));
function $d(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function cv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Iw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function lv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $d(e.outputLen), $d(e.blockLen);
}
function uv(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function dv(e, t) {
  Iw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const js = {
  number: $d,
  bool: cv,
  bytes: Iw,
  hash: lv,
  exists: uv,
  output: dv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), to = (e, t) => e << 32 - t | e >>> t, fv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!fv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function hv(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Rf(e) {
  if (typeof e == "string" && (e = hv(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Lw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function yi(e) {
  const t = (r) => e().update(Rf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Cw = class extends Lw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, js.hash(t);
    const r = Rf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return js.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    js.exists(this), js.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Tw = (e, t, n) => new Cw(e, t).update(n).digest();
Tw.create = (e, t) => new Cw(e, t);
function pv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let zf = class extends Lw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Uu(this.buffer);
  }
  update(t) {
    js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Rf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Uu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    js.exists(this), js.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    pv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Uu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const gv = (e, t, n) => e & t ^ ~e & n, yv = (e, t, n) => e & t ^ e & n ^ t & n, wv = new Uint32Array([
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
]), ns = new Uint32Array(64);
let Bw = class extends zf {
  constructor() {
    super(64, 32, 8, !1), this.A = ts[0] | 0, this.B = ts[1] | 0, this.C = ts[2] | 0, this.D = ts[3] | 0, this.E = ts[4] | 0, this.F = ts[5] | 0, this.G = ts[6] | 0, this.H = ts[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ns[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ns[d - 15], y = ns[d - 2], v = to(w, 7) ^ to(w, 18) ^ w >>> 3, x = to(y, 17) ^ to(y, 19) ^ y >>> 10;
      ns[d] = x + ns[d - 7] + v + ns[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = to(a, 6) ^ to(a, 11) ^ to(a, 25), y = h + w + gv(a, c, u) + wv[d] + ns[d] | 0, x = (to(r, 2) ^ to(r, 13) ^ to(r, 22)) + yv(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, mv = class extends Bw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mw = yi(() => new Bw());
yi(() => new mv());
var wi = {}, Gf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = dc;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let y = i.length - 1; y >= 0; y--)
      if (u < 4) {
        const v = n.indexOf(i[y]) >> u;
        let x = 0;
        y !== 0 && (x = n.indexOf(i[y - 1]));
        const L = 1 + u, U = x % (1 << L) << 5 - L, P = e.c32[v + U];
        u = L, c.unshift(P);
      } else
        u = 0;
    let h = 0;
    for (let y = 0; y < c.length && c[y] === "0"; y++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = d ? d[0].length : 0;
    for (let y = 0; y < w; y++)
      c.unshift(e.c32[0]);
    if (a) {
      const y = a - c.length;
      for (let v = 0; v < y; v++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], d = 0, w = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      w === 4 && (h.unshift(n[d]), w = 0, d = 0);
      const U = (e.c32.indexOf(i[x]) << w) + d, P = n[U % 16];
      if (w += 1, d = U >> 4, d > 1 << w)
        throw new Error("Panic error in decoding.");
      h.unshift(P);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let y = 0;
    for (let x = 0; x < h.length && h[x] === "0"; x++)
      y++;
    h = h.slice(y - y % 2);
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
  e.c32decode = o;
})(Gf);
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.c32checkDecode = ti.c32checkEncode = void 0;
const i0 = eu, a0 = dc, Ra = Gf;
function Nw(e) {
  const t = (0, i0.sha256)((0, i0.sha256)((0, a0.hexToBytes)(e)));
  return (0, a0.bytesToHex)(t.slice(0, 4));
}
function bv(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Nw(`${n}${t}`), s = (0, Ra.c32encode)(`${t}${r}`);
  return `${Ra.c32[e]}${s}`;
}
ti.c32checkEncode = bv;
function xv(e) {
  e = (0, Ra.c32normalize)(e);
  const t = (0, Ra.c32decode)(e.slice(1)), n = e[0], r = Ra.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Nw(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
ti.c32checkDecode = xv;
var _w = {}, sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
sa.decode = sa.encode = void 0;
const Sl = eu, c0 = dc, Pw = Gy, Uw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Sv(e, t = "00") {
  const n = typeof e == "string" ? (0, c0.hexToBytes)(e) : e, r = typeof t == "string" ? (0, c0.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Sl.sha256)((0, Sl.sha256)(new Uint8Array([...r, ...n])));
  return Pw(Uw).encode([...r, ...n, ...s.slice(0, 4)]);
}
sa.encode = Sv;
function vv(e) {
  const t = Pw(Uw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, Sl.sha256)((0, Sl.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
sa.decode = vv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = ti, n = sa, r = dc;
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
  const s = {};
  s[0] = e.versions.mainnet.p2pkh, s[5] = e.versions.mainnet.p2sh, s[111] = e.versions.testnet.p2pkh, s[196] = e.versions.testnet.p2sh;
  const o = {};
  o[e.versions.mainnet.p2pkh] = 0, o[e.versions.mainnet.p2sh] = 5, o[e.versions.testnet.p2pkh] = 111, o[e.versions.testnet.p2sh] = 196;
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
    const w = n.decode(h), y = (0, r.bytesToHex)(w.data), v = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let x;
    return d < 0 ? (x = v, s[v] !== void 0 && (x = s[v])) : x = d, i(x, y);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const w = a(h), y = w[0], v = w[1];
    let x;
    d < 0 ? (x = y, o[y] !== void 0 && (x = o[y])) : x = d;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(_w);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = Gf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = ti;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = _w;
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
})(wi);
function Av(e, t) {
  switch (t = $w(t ?? kw), e) {
    case Co.P2PKH:
      switch (t.transactionVersion) {
        case Bo.Mainnet:
          return co.MainnetSingleSig;
        case Bo.Testnet:
          return co.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Co.P2SH:
    case Co.P2SHNonSequential:
    case Co.P2WPKH:
    case Co.P2WSH:
    case Co.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Bo.Mainnet:
          return co.MainnetMultiSig;
        case Bo.Testnet:
          return co.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const Ev = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ow = Uint8Array.from({ length: 16 }, (e, t) => t), kv = Ow.map((e) => (9 * e + 5) % 16);
let Kf = [Ow], Vf = [kv];
for (let e = 0; e < 4; e++)
  for (let t of [Kf, Vf])
    t.push(t[e].map((n) => Ev[n]));
const Hw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), $v = Kf.map((e, t) => e.map((n) => Hw[t][n])), Iv = Vf.map((e, t) => e.map((n) => Hw[t][n])), Lv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Cv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Cc = (e, t) => e << t | e >>> 32 - t;
function l0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Tc = new Uint32Array(16);
let Tv = class extends zf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Tc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = Lv[y], L = Cv[y], U = Kf[y], P = Vf[y], A = $v[y], T = Iv[y];
      for (let B = 0; B < 16; B++) {
        const X = Cc(r + l0(y, o, a, u) + Tc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Cc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Cc(s + l0(v, i, c, h) + Tc[P[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Cc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Tc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Bv = yi(() => new Tv()), Bc = BigInt(2 ** 32 - 1), Id = BigInt(32);
function Dw(e, t = !1) {
  return t ? { h: Number(e & Bc), l: Number(e >> Id & Bc) } : { h: Number(e >> Id & Bc) | 0, l: Number(e & Bc) | 0 };
}
function Mv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Dw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Nv = (e, t) => BigInt(e >>> 0) << Id | BigInt(t >>> 0), _v = (e, t, n) => e >>> n, Pv = (e, t, n) => e << 32 - n | t >>> n, Uv = (e, t, n) => e >>> n | t << 32 - n, Ov = (e, t, n) => e << 32 - n | t >>> n, Hv = (e, t, n) => e << 64 - n | t >>> n - 32, Dv = (e, t, n) => e >>> n - 32 | t << 64 - n, Fv = (e, t) => t, jv = (e, t) => e, Rv = (e, t, n) => e << n | t >>> 32 - n, zv = (e, t, n) => t << n | e >>> 32 - n, Gv = (e, t, n) => t << n - 32 | e >>> 64 - n, Kv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Vv(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Xv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), qv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Yv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Wv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Zv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Jv = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: Dw,
  split: Mv,
  toBig: Nv,
  shrSH: _v,
  shrSL: Pv,
  rotrSH: Uv,
  rotrSL: Ov,
  rotrBH: Hv,
  rotrBL: Dv,
  rotr32H: Fv,
  rotr32L: jv,
  rotlSH: Rv,
  rotlSL: zv,
  rotlBH: Gv,
  rotlBL: Kv,
  add: Vv,
  add3L: Xv,
  add3H: qv,
  add4L: Yv,
  add4H: Wv,
  add5H: Jv,
  add5L: Zv
}, [Qv, eA] = et.split([
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
].map((e) => BigInt(e))), rs = new Uint32Array(80), os = new Uint32Array(80);
let ru = class extends zf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      rs[A] = t.getUint32(n), os[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = rs[A - 15] | 0, B = os[A - 15] | 0, X = et.rotrSH(T, B, 1) ^ et.rotrSH(T, B, 8) ^ et.shrSH(T, B, 7), Q = et.rotrSL(T, B, 1) ^ et.rotrSL(T, B, 8) ^ et.shrSL(T, B, 7), oe = rs[A - 2] | 0, Y = os[A - 2] | 0, m = et.rotrSH(oe, Y, 19) ^ et.rotrBH(oe, Y, 61) ^ et.shrSH(oe, Y, 6), C = et.rotrSL(oe, Y, 19) ^ et.rotrBL(oe, Y, 61) ^ et.shrSL(oe, Y, 6), _ = et.add4L(Q, C, os[A - 7], os[A - 16]), M = et.add4H(_, X, m, rs[A - 7], rs[A - 16]);
      rs[A] = M | 0, os[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, w, 14) ^ et.rotrSH(d, w, 18) ^ et.rotrBH(d, w, 41), B = et.rotrSL(d, w, 14) ^ et.rotrSL(d, w, 18) ^ et.rotrBL(d, w, 41), X = d & y ^ ~d & x, Q = w & v ^ ~w & L, oe = et.add5L(P, B, Q, eA[A], os[A]), Y = et.add5H(oe, U, T, X, Qv[A], rs[A]), m = oe | 0, C = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), _ = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = x | 0, P = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = et.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = et.add3L(m, _, W);
      r = et.add3H(F, Y, C, M), s = F | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = et.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = et.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = et.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: P } = et.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, P);
  }
  roundClean() {
    rs.fill(0), os.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, tA = class extends ru {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, nA = class extends ru {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, rA = class extends ru {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
yi(() => new ru());
yi(() => new tA());
yi(() => new nA());
yi(() => new rA());
var vl = { exports: {} };
vl.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", v = "[object Object]", x = "[object Promise]", L = "[object RegExp]", U = "[object Set]", P = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", B = "[object ArrayBuffer]", X = "[object DataView]", Q = "[object Float32Array]", oe = "[object Float64Array]", Y = "[object Int8Array]", m = "[object Int16Array]", C = "[object Int32Array]", _ = "[object Uint8Array]", M = "[object Uint8ClampedArray]", W = "[object Uint16Array]", F = "[object Uint32Array]", we = /[\\^$.*+?()[\]{}|]/g, le = /\w*$/, Ke = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, R = {};
  R[o] = R[i] = R[B] = R[X] = R[a] = R[c] = R[Q] = R[oe] = R[Y] = R[m] = R[C] = R[w] = R[y] = R[v] = R[L] = R[U] = R[P] = R[A] = R[_] = R[M] = R[W] = R[F] = !0, R[u] = R[h] = R[T] = !1;
  var de = typeof qn == "object" && qn && qn.Object === Object && qn, be = typeof self == "object" && self && self.Object === Object && self, Ne = de || be || Function("return this")(), Ae = t && !t.nodeType && t, wt = Ae && !0 && e && !e.nodeType && e, je = wt && wt.exports === Ae;
  function Be(S, N) {
    return S.set(N[0], N[1]), S;
  }
  function _e(S, N) {
    return S.add(N), S;
  }
  function Bn(S, N) {
    for (var K = -1, xe = S ? S.length : 0; ++K < xe && N(S[K], K, S) !== !1; )
      ;
    return S;
  }
  function En(S, N) {
    for (var K = -1, xe = N.length, Jt = S.length; ++K < xe; )
      S[Jt + K] = N[K];
    return S;
  }
  function ht(S, N, K, xe) {
    for (var Jt = -1, _n = S ? S.length : 0; ++Jt < _n; )
      K = N(K, S[Jt], Jt, S);
    return K;
  }
  function Bt(S, N) {
    for (var K = -1, xe = Array(S); ++K < S; )
      xe[K] = N(K);
    return xe;
  }
  function Pt(S, N) {
    return S == null ? void 0 : S[N];
  }
  function z(S) {
    var N = !1;
    if (S != null && typeof S.toString != "function")
      try {
        N = !!(S + "");
      } catch {
      }
    return N;
  }
  function O(S) {
    var N = -1, K = Array(S.size);
    return S.forEach(function(xe, Jt) {
      K[++N] = [Jt, xe];
    }), K;
  }
  function te(S, N) {
    return function(K) {
      return S(N(K));
    };
  }
  function re(S) {
    var N = -1, K = Array(S.size);
    return S.forEach(function(xe) {
      K[++N] = xe;
    }), K;
  }
  var ue = Array.prototype, bt = Function.prototype, He = Object.prototype, ze = Ne["__core-js_shared__"], vt = function() {
    var S = /[^.]+$/.exec(ze && ze.keys && ze.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), De = bt.toString, Ie = He.hasOwnProperty, qe = He.toString, Xe = RegExp(
    "^" + De.call(Ie).replace(we, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ye = je ? Ne.Buffer : void 0, Rt = Ne.Symbol, pn = Ne.Uint8Array, dn = te(Object.getPrototypeOf, Object), Wn = Object.create, Ut = He.propertyIsEnumerable, gn = ue.splice, mr = Object.getOwnPropertySymbols, Zr = Ye ? Ye.isBuffer : void 0, Fn = te(Object.keys, Object), br = _r(Ne, "DataView"), yn = _r(Ne, "Map"), Dt = _r(Ne, "Promise"), dt = _r(Ne, "Set"), Ct = _r(Ne, "WeakMap"), un = _r(Object, "create"), Cr = zn(br), wo = zn(yn), E = zn(Dt), H = zn(dt), V = zn(Ct), D = Rt ? Rt.prototype : void 0, J = D ? D.valueOf : void 0;
  function ne(S) {
    var N = -1, K = S ? S.length : 0;
    for (this.clear(); ++N < K; ) {
      var xe = S[N];
      this.set(xe[0], xe[1]);
    }
  }
  function Te() {
    this.__data__ = un ? un(null) : {};
  }
  function $e(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function Pe(S) {
    var N = this.__data__;
    if (un) {
      var K = N[S];
      return K === r ? void 0 : K;
    }
    return Ie.call(N, S) ? N[S] : void 0;
  }
  function $t(S) {
    var N = this.__data__;
    return un ? N[S] !== void 0 : Ie.call(N, S);
  }
  function Ze(S, N) {
    var K = this.__data__;
    return K[S] = un && N === void 0 ? r : N, this;
  }
  ne.prototype.clear = Te, ne.prototype.delete = $e, ne.prototype.get = Pe, ne.prototype.has = $t, ne.prototype.set = Ze;
  function pt(S) {
    var N = -1, K = S ? S.length : 0;
    for (this.clear(); ++N < K; ) {
      var xe = S[N];
      this.set(xe[0], xe[1]);
    }
  }
  function st() {
    this.__data__ = [];
  }
  function $(S) {
    var N = this.__data__, K = Jr(N, S);
    if (K < 0)
      return !1;
    var xe = N.length - 1;
    return K == xe ? N.pop() : gn.call(N, K, 1), !0;
  }
  function Ee(S) {
    var N = this.__data__, K = Jr(N, S);
    return K < 0 ? void 0 : N[K][1];
  }
  function ft(S) {
    return Jr(this.__data__, S) > -1;
  }
  function rn(S, N) {
    var K = this.__data__, xe = Jr(K, S);
    return xe < 0 ? K.push([S, N]) : K[xe][1] = N, this;
  }
  pt.prototype.clear = st, pt.prototype.delete = $, pt.prototype.get = Ee, pt.prototype.has = ft, pt.prototype.set = rn;
  function At(S) {
    var N = -1, K = S ? S.length : 0;
    for (this.clear(); ++N < K; ) {
      var xe = S[N];
      this.set(xe[0], xe[1]);
    }
  }
  function xr() {
    this.__data__ = {
      hash: new ne(),
      map: new (yn || pt)(),
      string: new ne()
    };
  }
  function Tr(S) {
    return Qr(this, S).delete(S);
  }
  function gt(S) {
    return Qr(this, S).get(S);
  }
  function Zt(S) {
    return Qr(this, S).has(S);
  }
  function Uo(S, N) {
    return Qr(this, S).set(S, N), this;
  }
  At.prototype.clear = xr, At.prototype.delete = Tr, At.prototype.get = gt, At.prototype.has = Zt, At.prototype.set = Uo;
  function Zn(S) {
    this.__data__ = new pt(S);
  }
  function vi() {
    this.__data__ = new pt();
  }
  function nr(S) {
    return this.__data__.delete(S);
  }
  function wn(S) {
    return this.__data__.get(S);
  }
  function jn(S) {
    return this.__data__.has(S);
  }
  function ut(S, N) {
    var K = this.__data__;
    if (K instanceof pt) {
      var xe = K.__data__;
      if (!yn || xe.length < n - 1)
        return xe.push([S, N]), this;
      K = this.__data__ = new At(xe);
    }
    return K.set(S, N), this;
  }
  Zn.prototype.clear = vi, Zn.prototype.delete = nr, Zn.prototype.get = wn, Zn.prototype.has = jn, Zn.prototype.set = ut;
  function Oo(S, N) {
    var K = Us(S) || Ro(S) ? Bt(S.length, String) : [], xe = K.length, Jt = !!xe;
    for (var _n in S)
      Ie.call(S, _n) && !(Jt && (_n == "length" || Fo(_n, xe))) && K.push(_n);
    return K;
  }
  function Cs(S, N, K) {
    var xe = S[N];
    (!(Ie.call(S, N) && $i(xe, K)) || K === void 0 && !(N in S)) && (S[N] = K);
  }
  function Jr(S, N) {
    for (var K = S.length; K--; )
      if ($i(S[K][0], N))
        return K;
    return -1;
  }
  function Ai(S, N) {
    return S && Do(N, Se(N), S);
  }
  function Br(S, N, K, xe, Jt, _n, Pr) {
    var mn;
    if (xe && (mn = _n ? xe(S, Jt, _n, Pr) : xe(S)), mn !== void 0)
      return mn;
    if (!q(S))
      return S;
    var Ur = Us(S);
    if (Ur) {
      if (mn = bo(S), !N)
        return Ms(S, mn);
    } else {
      var vo = vr(S), zo = vo == h || vo == d;
      if (G(S))
        return Rn(S, N);
      if (vo == v || vo == o || zo && !_n) {
        if (z(S))
          return _n ? S : {};
        if (mn = xo(zo ? {} : S), !N)
          return Nn(S, Ai(mn, S));
      } else {
        if (!R[vo])
          return _n ? S : {};
        mn = _s(S, vo, Br, N);
      }
    }
    Pr || (Pr = new Zn());
    var Aa = Pr.get(S);
    if (Aa)
      return Aa;
    if (Pr.set(S, mn), !Ur)
      var Ea = K ? Ns(S) : Se(S);
    return Bn(Ea || S, function(Ii, Go) {
      Ea && (Go = Ii, Ii = S[Go]), Cs(mn, Go, Br(Ii, N, K, xe, Go, S, Pr));
    }), mn;
  }
  function Ho(S) {
    return q(S) ? Wn(S) : {};
  }
  function Mn(S, N, K) {
    var xe = N(S);
    return Us(S) ? xe : En(xe, K(S));
  }
  function Ei(S) {
    return qe.call(S);
  }
  function ki(S) {
    if (!q(S) || So(S))
      return !1;
    var N = ee(S) || z(S) ? Xe : Ke;
    return N.test(zn(S));
  }
  function Sa(S) {
    if (!jo(S))
      return Fn(S);
    var N = [];
    for (var K in Object(S))
      Ie.call(S, K) && K != "constructor" && N.push(K);
    return N;
  }
  function Rn(S, N) {
    if (N)
      return S.slice();
    var K = new S.constructor(S.length);
    return S.copy(K), K;
  }
  function kn(S) {
    var N = new S.constructor(S.byteLength);
    return new pn(N).set(new pn(S)), N;
  }
  function Mr(S, N) {
    var K = N ? kn(S.buffer) : S.buffer;
    return new S.constructor(K, S.byteOffset, S.byteLength);
  }
  function Sr(S, N, K) {
    var xe = N ? K(O(S), !0) : O(S);
    return ht(xe, Be, new S.constructor());
  }
  function Ts(S) {
    var N = new S.constructor(S.source, le.exec(S));
    return N.lastIndex = S.lastIndex, N;
  }
  function mo(S, N, K) {
    var xe = N ? K(re(S), !0) : re(S);
    return ht(xe, _e, new S.constructor());
  }
  function Bs(S) {
    return J ? Object(J.call(S)) : {};
  }
  function Nr(S, N) {
    var K = N ? kn(S.buffer) : S.buffer;
    return new S.constructor(K, S.byteOffset, S.length);
  }
  function Ms(S, N) {
    var K = -1, xe = S.length;
    for (N || (N = Array(xe)); ++K < xe; )
      N[K] = S[K];
    return N;
  }
  function Do(S, N, K, xe) {
    K || (K = {});
    for (var Jt = -1, _n = N.length; ++Jt < _n; ) {
      var Pr = N[Jt], mn = void 0;
      Cs(K, Pr, mn === void 0 ? S[Pr] : mn);
    }
    return K;
  }
  function Nn(S, N) {
    return Do(S, zt(S), N);
  }
  function Ns(S) {
    return Mn(S, Se, zt);
  }
  function Qr(S, N) {
    var K = S.__data__;
    return Ps(N) ? K[typeof N == "string" ? "string" : "hash"] : K.map;
  }
  function _r(S, N) {
    var K = Pt(S, N);
    return ki(K) ? K : void 0;
  }
  var zt = mr ? te(mr, Object) : se, vr = Ei;
  (br && vr(new br(new ArrayBuffer(1))) != X || yn && vr(new yn()) != w || Dt && vr(Dt.resolve()) != x || dt && vr(new dt()) != U || Ct && vr(new Ct()) != T) && (vr = function(S) {
    var N = qe.call(S), K = N == v ? S.constructor : void 0, xe = K ? zn(K) : void 0;
    if (xe)
      switch (xe) {
        case Cr:
          return X;
        case wo:
          return w;
        case E:
          return x;
        case H:
          return U;
        case V:
          return T;
      }
    return N;
  });
  function bo(S) {
    var N = S.length, K = S.constructor(N);
    return N && typeof S[0] == "string" && Ie.call(S, "index") && (K.index = S.index, K.input = S.input), K;
  }
  function xo(S) {
    return typeof S.constructor == "function" && !jo(S) ? Ho(dn(S)) : {};
  }
  function _s(S, N, K, xe) {
    var Jt = S.constructor;
    switch (N) {
      case B:
        return kn(S);
      case a:
      case c:
        return new Jt(+S);
      case X:
        return Mr(S, xe);
      case Q:
      case oe:
      case Y:
      case m:
      case C:
      case _:
      case M:
      case W:
      case F:
        return Nr(S, xe);
      case w:
        return Sr(S, xe, K);
      case y:
      case P:
        return new Jt(S);
      case L:
        return Ts(S);
      case U:
        return mo(S, xe, K);
      case A:
        return Bs(S);
    }
  }
  function Fo(S, N) {
    return N = N ?? s, !!N && (typeof S == "number" || I.test(S)) && S > -1 && S % 1 == 0 && S < N;
  }
  function Ps(S) {
    var N = typeof S;
    return N == "string" || N == "number" || N == "symbol" || N == "boolean" ? S !== "__proto__" : S === null;
  }
  function So(S) {
    return !!vt && vt in S;
  }
  function jo(S) {
    var N = S && S.constructor, K = typeof N == "function" && N.prototype || He;
    return S === K;
  }
  function zn(S) {
    if (S != null) {
      try {
        return De.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function va(S) {
    return Br(S, !0, !0);
  }
  function $i(S, N) {
    return S === N || S !== S && N !== N;
  }
  function Ro(S) {
    return k(S) && Ie.call(S, "callee") && (!Ut.call(S, "callee") || qe.call(S) == o);
  }
  var Us = Array.isArray;
  function b(S) {
    return S != null && Ce(S.length) && !ee(S);
  }
  function k(S) {
    return ke(S) && b(S);
  }
  var G = Zr || Je;
  function ee(S) {
    var N = q(S) ? qe.call(S) : "";
    return N == h || N == d;
  }
  function Ce(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= s;
  }
  function q(S) {
    var N = typeof S;
    return !!S && (N == "object" || N == "function");
  }
  function ke(S) {
    return !!S && typeof S == "object";
  }
  function Se(S) {
    return b(S) ? Oo(S) : Sa(S);
  }
  function se() {
    return [];
  }
  function Je() {
    return !1;
  }
  e.exports = va;
})(vl, vl.exports);
var oA = vl.exports;
const Fw = /* @__PURE__ */ py(oA);
var Ld;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ld || (Ld = {}));
function sA(e, t) {
  return { type: Ld.Address, version: e, hash160: t };
}
function iA(e) {
  return wi.c32address(e.version, e.hash160);
}
const aA = (e) => Bv(Mw(e)), cA = (e) => Ue(aA(e));
nn.hmacSha256Sync = (e, ...t) => {
  const n = Tw.create(Mw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function lA(e, t = "mainnet") {
  t = $w(t), e = typeof e == "string" ? St(e) : e;
  const n = Av(Co.P2PKH, t), r = sA(n, cA(e));
  return iA(r);
}
function uA(e, t) {
  const n = Tn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = lA(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Tn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function dA(e, t = null) {
  let n;
  t ? n = uA(e, t) : n = Tn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const u0 = "_blockstackDidCheckEchoReply", fA = "echoReply", hA = "authContinuation";
function pA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function gA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[u0];
  if (typeof t == "boolean")
    return t;
  const n = pA(e.location.search), r = n[fA];
  if (r) {
    e[u0] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[hA];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Cd {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Ay();
    else
      throw new _1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Kp(t.sessionOptions) : this.store = new Kp() : t ? this.store = new Gp(t.sessionOptions) : this.store = new Gp();
  }
  makeAuthRequestToken(t, n, r, s, o, i = U1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new gd("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, ev(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = QS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = Ef("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (gA())
        return ji.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      ji.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = s2()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new bc("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = Tn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await sv(t))
      throw new bc("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (Tu(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Rp(s, o.private_key);
          } catch {
            if (ji.warn("Failed decryption of appPrivateKey, will try to use as given"), !nn.isValidPrivateKey(o.private_key))
              throw new bc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Rp(s, c);
          } catch {
            ji.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new bc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = q1, h;
    Tu(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), Tu(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Aw(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, w = o.profile_url;
    if (!d.profile && w) {
      const y = await n(w);
      if (!y.ok)
        d.profile = Object.assign({}, B1);
      else {
        const v = await y.text(), x = JSON.parse(v);
        d.profile = dA(x[0].token);
      }
    } else
      d.profile = o.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new gd("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), qx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Yx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Cd.prototype.makeAuthRequest = Cd.prototype.makeAuthRequestToken;
const yA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], wA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = yA(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!ou(r.id));
  return t.concat(n);
}, ou = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), jw = "STX_PROVIDER", ni = () => typeof window > "u" ? null : window.localStorage.getItem(jw), mA = (e) => {
  typeof window < "u" && window.localStorage.setItem(jw, e);
}, bA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function xA(e, t) {
  const n = {};
  return Object.assign(n, bA, t), await fetch(e, n);
}
function SA(e) {
  let t = xA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function vA(...e) {
  const { fetchLib: t, middlewares: n } = SA(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
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
var ia;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ia || (ia = {}));
var ri;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ri || (ri = {}));
var d0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(d0 || (d0 = {}));
const AA = "https://api.mainnet.hiro.so", EA = "https://api.testnet.hiro.so", kA = "http://localhost:3999", $A = ["mainnet", "testnet", "devnet", "mocknet"];
class oi {
  constructor(t) {
    this.version = ri.Mainnet, this.chainId = ia.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ri.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? vA();
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
oi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Td();
    case "testnet":
      return new Bd();
    case "devnet":
      return new IA();
    case "mocknet":
      return new Rw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$A.join(", ")}`);
  }
};
oi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : oi.fromName(e);
class Td extends oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? AA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ri.Mainnet, this.chainId = ia.Mainnet;
  }
}
class Bd extends oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? EA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ri.Testnet, this.chainId = ia.Testnet;
  }
}
class Rw extends oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? kA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = ri.Testnet, this.chainId = ia.Testnet;
  }
}
const IA = Rw;
var si;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(si || (si = {}));
var Al;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Al || (Al = {}));
si.Mainnet;
var ii;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ii || (ii = {}));
var ai;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ai || (ai = {}));
ii.Mainnet;
const LA = {
  chainId: si.Mainnet,
  transactionVersion: ii.Mainnet,
  peerNetworkId: Al.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ai.MainnetSingleSig,
    multiSig: ai.MainnetMultiSig
  },
  client: { baseUrl: xy }
}, Md = {
  chainId: si.Testnet,
  transactionVersion: ii.Testnet,
  peerNetworkId: Al.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ai.TestnetSingleSig,
    multiSig: ai.TestnetMultiSig
  },
  client: { baseUrl: Sy }
}, ol = {
  ...Md,
  addressVersion: { ...Md.addressVersion },
  magicBytes: "id",
  client: { baseUrl: vy }
}, CA = {
  ...ol,
  addressVersion: { ...ol.addressVersion },
  client: { ...ol.client }
};
function TA(e) {
  switch (e) {
    case "mainnet":
      return LA;
    case "testnet":
      return Md;
    case "devnet":
      return ol;
    case "mocknet":
      return CA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function BA(e) {
  return typeof e == "string" ? TA(e) : e;
}
function MA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const f0 = /* @__PURE__ */ new Map();
function zw(e, t) {
  const n = f0.get(e);
  if (n !== void 0)
    return n(t);
  const r = MA(e);
  return f0.set(e, r), zw(e, t);
}
let jt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? St(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return t2(this.readBytes(4), 0);
  }
  readUInt8() {
    return Q1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Z1(this.readBytes(2), 0);
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
    if (zw(t, r))
      return r;
    throw n(r);
  }
};
const NA = 128, _A = 128, Gw = 16, Xs = 32, Nd = 80, su = 65, PA = 32, UA = 64, El = 34, OA = 1 + 16 * 1024 * 1024, HA = 165, DA = 16, FA = 16, jA = 20, RA = FA + 2 + jA, zA = RA + 4, GA = OA + (HA + DA * zA);
var Lt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lt || (Lt = {}));
var _d;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(_d || (_d = {}));
var lr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(lr || (lr = {}));
const Ou = ["onChainOnly", "offChainOnly", "any"];
Ou[0] + "", lr.OnChainOnly, Ou[1] + "", lr.OffChainOnly, Ou[2] + "", lr.Any, lr.OnChainOnly + "", lr.OnChainOnly, lr.OffChainOnly + "", lr.OffChainOnly, lr.Any + "", lr.Any;
var kl;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(kl || (kl = {}));
var Gt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Gt || (Gt = {}));
var en;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(en || (en = {}));
var Ot;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ot || (Ot = {}));
var Yt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Yt || (Yt = {}));
var za;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(za || (za = {}));
var Pd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Pd || (Pd = {}));
var Ud;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Ud || (Ud = {}));
var Xn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Xn || (Xn = {}));
var h0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(h0 || (h0 = {}));
var Od;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Od || (Od = {}));
var zr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(zr || (zr = {}));
var p0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(p0 || (p0 = {}));
let iu = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ri = class extends iu {
  constructor(t) {
    super(t);
  }
}, Kn = class extends iu {
  constructor(t) {
    super(t);
  }
}, $l = class extends iu {
  constructor(t) {
    super(t);
  }
}, Rs = class extends iu {
  constructor(t) {
    super(t);
  }
};
function Hd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function KA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Kw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function VA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hd(e.outputLen), Hd(e.blockLen);
}
function XA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function qA(e, t) {
  Kw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: Hd,
  bool: KA,
  bytes: Kw,
  hash: VA,
  exists: XA,
  output: qA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), no = (e, t) => e << 32 - t | e >>> t, YA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!YA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function WA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Xf(e) {
  if (typeof e == "string" && (e = WA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Vw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function mi(e) {
  const t = (r) => e().update(Xf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Xw = class extends Vw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, zs.hash(t);
    const r = Xf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return zs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    zs.exists(this), zs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const qw = (e, t, n) => new Xw(e, t).update(n).digest();
qw.create = (e, t) => new Xw(e, t);
function ZA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let qf = class extends Vw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Hu(this.buffer);
  }
  update(t) {
    zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Xf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Hu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    zs.exists(this), zs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    ZA(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Hu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const JA = (e, t, n) => e & t ^ ~e & n, QA = (e, t, n) => e & t ^ e & n ^ t & n, eE = new Uint32Array([
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
let Yw = class extends qf {
  constructor() {
    super(64, 32, 8, !1), this.A = ss[0] | 0, this.B = ss[1] | 0, this.C = ss[2] | 0, this.D = ss[3] | 0, this.E = ss[4] | 0, this.F = ss[5] | 0, this.G = ss[6] | 0, this.H = ss[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      is[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = is[d - 15], y = is[d - 2], v = no(w, 7) ^ no(w, 18) ^ w >>> 3, x = no(y, 17) ^ no(y, 19) ^ y >>> 10;
      is[d] = x + is[d - 7] + v + is[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = no(a, 6) ^ no(a, 11) ^ no(a, 25), y = h + w + JA(a, c, u) + eE[d] + is[d] | 0, x = (no(r, 2) ^ no(r, 13) ^ no(r, 22)) + QA(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    is.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, tE = class extends Yw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Yf = mi(() => new Yw());
mi(() => new tE());
const nE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ww = Uint8Array.from({ length: 16 }, (e, t) => t), rE = Ww.map((e) => (9 * e + 5) % 16);
let Wf = [Ww], Zf = [rE];
for (let e = 0; e < 4; e++)
  for (let t of [Wf, Zf])
    t.push(t[e].map((n) => nE[n]));
const Zw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), oE = Wf.map((e, t) => e.map((n) => Zw[t][n])), sE = Zf.map((e, t) => e.map((n) => Zw[t][n])), iE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), aE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mc = (e, t) => e << t | e >>> 32 - t;
function g0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Nc = new Uint32Array(16);
let cE = class extends qf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Nc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = iE[y], L = aE[y], U = Wf[y], P = Zf[y], A = oE[y], T = sE[y];
      for (let B = 0; B < 16; B++) {
        const X = Mc(r + g0(y, o, a, u) + Nc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Mc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Mc(s + g0(v, i, c, h) + Nc[P[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Mc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Nc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const lE = mi(() => new cE()), _c = BigInt(2 ** 32 - 1), Dd = BigInt(32);
function Jw(e, t = !1) {
  return t ? { h: Number(e & _c), l: Number(e >> Dd & _c) } : { h: Number(e >> Dd & _c) | 0, l: Number(e & _c) | 0 };
}
function uE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Jw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const dE = (e, t) => BigInt(e >>> 0) << Dd | BigInt(t >>> 0), fE = (e, t, n) => e >>> n, hE = (e, t, n) => e << 32 - n | t >>> n, pE = (e, t, n) => e >>> n | t << 32 - n, gE = (e, t, n) => e << 32 - n | t >>> n, yE = (e, t, n) => e << 64 - n | t >>> n - 32, wE = (e, t, n) => e >>> n - 32 | t << 64 - n, mE = (e, t) => t, bE = (e, t) => e, xE = (e, t, n) => e << n | t >>> 32 - n, SE = (e, t, n) => t << n | e >>> 32 - n, vE = (e, t, n) => t << n - 32 | e >>> 64 - n, AE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function EE(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const kE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), $E = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, IE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), LE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, CE = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), TE = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: Jw,
  split: uE,
  toBig: dE,
  shrSH: fE,
  shrSL: hE,
  rotrSH: pE,
  rotrSL: gE,
  rotrBH: yE,
  rotrBL: wE,
  rotr32H: mE,
  rotr32L: bE,
  rotlSH: xE,
  rotlSL: SE,
  rotlBH: vE,
  rotlBL: AE,
  add: EE,
  add3L: kE,
  add3H: $E,
  add4L: IE,
  add4H: LE,
  add5H: TE,
  add5L: CE
}, [BE, ME] = tt.split([
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
].map((e) => BigInt(e))), as = new Uint32Array(80), cs = new Uint32Array(80);
let au = class extends qf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      as[A] = t.getUint32(n), cs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = as[A - 15] | 0, B = cs[A - 15] | 0, X = tt.rotrSH(T, B, 1) ^ tt.rotrSH(T, B, 8) ^ tt.shrSH(T, B, 7), Q = tt.rotrSL(T, B, 1) ^ tt.rotrSL(T, B, 8) ^ tt.shrSL(T, B, 7), oe = as[A - 2] | 0, Y = cs[A - 2] | 0, m = tt.rotrSH(oe, Y, 19) ^ tt.rotrBH(oe, Y, 61) ^ tt.shrSH(oe, Y, 6), C = tt.rotrSL(oe, Y, 19) ^ tt.rotrBL(oe, Y, 61) ^ tt.shrSL(oe, Y, 6), _ = tt.add4L(Q, C, cs[A - 7], cs[A - 16]), M = tt.add4H(_, X, m, as[A - 7], as[A - 16]);
      as[A] = M | 0, cs[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, w, 14) ^ tt.rotrSH(d, w, 18) ^ tt.rotrBH(d, w, 41), B = tt.rotrSL(d, w, 14) ^ tt.rotrSL(d, w, 18) ^ tt.rotrBL(d, w, 41), X = d & y ^ ~d & x, Q = w & v ^ ~w & L, oe = tt.add5L(P, B, Q, ME[A], cs[A]), Y = tt.add5H(oe, U, T, X, BE[A], as[A]), m = oe | 0, C = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), _ = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = x | 0, P = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = tt.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = tt.add3L(m, _, W);
      r = tt.add3H(F, Y, C, M), s = F | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = tt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = tt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = tt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = tt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: P } = tt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, P);
  }
  roundClean() {
    as.fill(0), cs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, NE = class extends au {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, _E = class extends au {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, PE = class extends au {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
mi(() => new au());
mi(() => new NE());
const UE = mi(() => new _E());
mi(() => new PE());
var yt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(yt || (yt = {}));
var hn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(hn || (hn = {}));
function Jf(e) {
  return hn[e];
}
const OE = () => ({ type: yt.BoolTrue }), HE = () => ({ type: yt.BoolFalse }), DE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: yt.Buffer, value: Ue(e) };
}, y0 = BigInt("0xffffffffffffffffffffffffffffffff"), FE = BigInt(0), w0 = BigInt("0x7fffffffffffffffffffffffffffffff"), m0 = BigInt("-170141183460469231731687303715884105728"), jE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = wd(St(e))), tr(e, Uint8Array) && (e = wd(e));
  const t = Dn(e);
  if (t > w0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${w0}`);
  if (t < m0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${m0}`);
  return { type: yt.Int, value: t };
}, RE = (e) => {
  const t = Dn(e);
  if (t < FE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > y0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${y0}`);
  return { type: yt.UInt, value: t };
};
function zE(e) {
  return { type: yt.List, value: e };
}
function Qw() {
  return { type: yt.OptionalNone };
}
function em(e) {
  return { type: yt.OptionalSome, value: e };
}
var ye;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ye || (ye = {}));
function GE() {
  return {
    type: ye.Address,
    version: ai.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function b0(e) {
  if (e && lm(e, El))
    throw new Error(`Memo exceeds maximum length of ${El} bytes`);
  return { type: ye.MemoString, content: e };
}
function Qf(e, t) {
  return {
    type: ye.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Fd(e) {
  if (St(e).byteLength != su)
    throw Error("Invalid signature");
  return {
    type: ye.MessageSignature,
    data: e
  };
}
function KE(e, t, n) {
  return typeof e == "string" && (e = ak(e)), typeof n == "string" && (n = b0(n)), {
    type: ye.Payload,
    payloadType: Lt.TokenTransfer,
    recipient: e,
    amount: Dn(t),
    memo: n ?? b0("")
  };
}
function VE(e, t, n, r) {
  return typeof t == "string" && (t = qr(t)), typeof n == "string" && (n = qr(n)), {
    type: ye.Payload,
    payloadType: Lt.ContractCall,
    contractAddress: typeof e == "string" ? Ls(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function XE(e) {
  return qr(e, 4, 1e5);
}
function x0(e, t, n) {
  return typeof e == "string" && (e = qr(e)), typeof t == "string" && (t = XE(t)), typeof n == "number" ? {
    type: ye.Payload,
    payloadType: Lt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ye.Payload,
    payloadType: Lt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function qE() {
  return { type: ye.Payload, payloadType: Lt.PoisonMicroblock };
}
function S0(e, t) {
  if (e.byteLength != Xs)
    throw Error(`Coinbase buffer size must be ${Xs} bytes`);
  return t != null ? {
    type: ye.Payload,
    payloadType: Lt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ye.Payload,
    payloadType: Lt.Coinbase,
    coinbaseBytes: e
  };
}
function YE(e, t, n) {
  if (e.byteLength != Xs)
    throw Error(`Coinbase buffer size must be ${Xs} bytes`);
  if (n.byteLength != Nd)
    throw Error(`VRF proof buffer size must be ${Nd} bytes`);
  return {
    type: ye.Payload,
    payloadType: Lt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === yt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function WE(e, t, n, r, s, o, i) {
  return {
    type: ye.Payload,
    payloadType: Lt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function qr(e, t, n) {
  const r = t || 1, s = n || NA;
  if (lm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ye.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function ZE(e, t, n) {
  return {
    type: ye.Asset,
    address: Ls(e),
    contractName: qr(t),
    assetName: qr(n)
  };
}
function Ls(e) {
  const t = wi.c32addressDecode(e);
  return {
    type: ye.Address,
    version: t[0],
    hash160: t[1]
  };
}
function JE(e, t) {
  const n = Ls(e), r = qr(t);
  return {
    type: ye.Principal,
    prefix: Xn.Contract,
    address: n,
    contractName: r
  };
}
function QE(e) {
  const t = Ls(e);
  return {
    type: ye.Principal,
    prefix: Xn.Standard,
    address: t
  };
}
function zi(e, t) {
  return {
    pubKeyEncoding: e,
    type: ye.TransactionAuthField,
    contents: t
  };
}
function Io(e) {
  switch (e.type) {
    case ye.Address:
      return fc(e);
    case ye.Principal:
      return tm(e);
    case ye.LengthPrefixedString:
      return ca(e);
    case ye.MemoString:
      return tk(e);
    case ye.Asset:
      return rm(e);
    case ye.PostCondition:
      return sm(e);
    case ye.PublicKey:
      return zd(e);
    case ye.LengthPrefixedList:
      return eh(e);
    case ye.Payload:
      return im(e);
    case ye.TransactionAuthField:
      return ik(e);
    case ye.MessageSignature:
      return th(e);
  }
}
function fc(e) {
  const t = [];
  return t.push(St(ic(e.version, 1))), t.push(St(e.hash160)), cn(t);
}
function aa(e) {
  const t = tr(e, jt) ? e : new jt(e), n = Vl(Ue(t.readBytes(1))), r = Ue(t.readBytes(20));
  return { type: ye.Address, version: n, hash160: r };
}
function tm(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === Xn.Standard || e.prefix === Xn.Contract) && t.push(fc(e.address)), e.prefix === Xn.Contract && t.push(ca(e.contractName)), cn(t);
}
function ek(e) {
  const t = tr(e, jt) ? e : new jt(e), n = t.readUInt8Enum(Xn, (o) => {
    throw new Kn(`Unexpected Principal payload type: ${o}`);
  });
  if (n === Xn.Origin)
    return { type: ye.Principal, prefix: n };
  const r = aa(t);
  if (n === Xn.Standard)
    return { type: ye.Principal, prefix: n, address: r };
  const s = $r(t);
  return {
    type: ye.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ca(e) {
  const t = [], n = hi(e.content), r = n.byteLength;
  return t.push(St(ic(r, e.lengthPrefixBytes))), t.push(n), cn(t);
}
function $r(e, t, n) {
  t = t || 1;
  const r = tr(e, jt) ? e : new jt(e), s = Vl(Ue(r.readBytes(t))), o = ac(r.readBytes(s));
  return qr(o, t, n ?? 128);
}
function tk(e) {
  const t = [], n = hi(e.content), r = Ck(Ue(n), El * 2);
  return t.push(St(r)), cn(t);
}
function nm(e) {
  const t = tr(e, jt) ? e : new jt(e);
  let n = ac(t.readBytes(El));
  return n = n.replace(/\u0000*$/, ""), { type: ye.MemoString, content: n };
}
function rm(e) {
  const t = [];
  return t.push(fc(e.address)), t.push(ca(e.contractName)), t.push(ca(e.assetName)), cn(t);
}
function jd(e) {
  const t = tr(e, jt) ? e : new jt(e);
  return {
    type: ye.Asset,
    address: aa(t),
    contractName: $r(t),
    assetName: $r(t)
  };
}
function eh(e) {
  const t = e.values, n = [];
  n.push(St(ic(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Io(r));
  return cn(n);
}
function om(e, t, n) {
  const r = tr(e, jt) ? e : new jt(e), s = Vl(Ue(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case ye.Address:
        o.push(aa(r));
        break;
      case ye.LengthPrefixedString:
        o.push($r(r));
        break;
      case ye.MemoString:
        o.push(nm(r));
        break;
      case ye.Asset:
        o.push(jd(r));
        break;
      case ye.PostCondition:
        o.push(rk(r));
        break;
      case ye.PublicKey:
        o.push(Gd(r));
        break;
      case ye.TransactionAuthField:
        o.push(sk(r));
        break;
    }
  return Qf(o, n);
}
function nk(e) {
  return Ue(sm(e));
}
function sm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(tm(e.principal)), (e.conditionType === Gt.Fungible || e.conditionType === Gt.NonFungible) && t.push(rm(e.asset)), e.conditionType === Gt.NonFungible && t.push(lo(e.assetName)), t.push(e.conditionCode), e.conditionType === Gt.STX || e.conditionType === Gt.Fungible || e.conditionType === Gt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ri("The post-condition amount may not be larger than 8 bytes");
    t.push($s(e.amount, 8));
  }
  return cn(t);
}
function rk(e) {
  const t = tr(e, jt) ? e : new jt(e), n = t.readUInt8Enum(Gt, (a) => {
    throw new Kn(`Could not read ${a} as PostConditionType`);
  }), r = ek(t);
  let s, o, i;
  switch (n) {
    case Gt.STX:
      return s = t.readUInt8Enum(za, (c) => {
        throw new Kn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Gt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Gt.Fungible:
      return o = jd(t), s = t.readUInt8Enum(za, (c) => {
        throw new Kn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Gt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case Gt.NonFungible:
      o = jd(t);
      const a = io(t);
      return s = t.readUInt8Enum(Pd, (c) => {
        throw new Kn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ye.PostCondition,
        conditionType: Gt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case Gt.Staking:
      return s = t.readUInt8Enum(za, (c) => {
        throw new Kn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Gt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Gt.PoX: {
      const c = t.readUInt8Enum(Ud, (u) => {
        throw new Kn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ye.PostCondition,
        conditionType: Gt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function im(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case Lt.TokenTransfer:
      t.push(lo(e.recipient)), t.push($s(e.amount, 8)), t.push(Io(e.memo));
      break;
    case Lt.ContractCall:
      t.push(Io(e.contractAddress)), t.push(Io(e.contractName)), t.push(Io(e.functionName));
      const n = new Uint8Array(4);
      Zs(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(lo(r));
      });
      break;
    case Lt.SmartContract:
      t.push(Io(e.contractName)), t.push(Io(e.codeBody));
      break;
    case Lt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Io(e.contractName)), t.push(Io(e.codeBody));
      break;
    case Lt.PoisonMicroblock:
      break;
    case Lt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case Lt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(lo(e.recipient));
      break;
    case Lt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(lo(e.recipient ? em(e.recipient) : Qw())), t.push(e.vrfProof);
      break;
    case Lt.TenureChange:
      t.push(St(e.tenureHash)), t.push(St(e.previousTenureHash)), t.push(St(e.burnViewHash)), t.push(St(e.previousTenureEnd)), t.push(Zs(new Uint8Array(4), e.previousTenureBlocks)), t.push(e2(new Uint8Array(1), e.cause)), t.push(St(e.publicKeyHash));
      break;
  }
  return cn(t);
}
function ok(e) {
  const t = tr(e, jt) ? e : new jt(e);
  switch (t.readUInt8Enum(Lt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Lt.TokenTransfer:
      const r = io(t), s = Dn(t.readBytes(8)), o = nm(t);
      return KE(r, s, o);
    case Lt.ContractCall:
      const i = aa(t), a = $r(t), c = $r(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const B = io(t);
        u.push(B);
      }
      return VE(i, a, c, u);
    case Lt.SmartContract:
      const d = $r(t), w = $r(t, 4, 1e5);
      return x0(d, w);
    case Lt.VersionedSmartContract: {
      const T = t.readUInt8Enum(_d, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), B = $r(t), X = $r(t, 4, GA);
      return x0(B, X, T);
    }
    case Lt.PoisonMicroblock:
      return qE();
    case Lt.Coinbase: {
      const T = t.readBytes(Xs);
      return S0(T);
    }
    case Lt.CoinbaseToAltRecipient: {
      const T = t.readBytes(Xs), B = io(t);
      return S0(T, B);
    }
    case Lt.NakamotoCoinbase: {
      const T = t.readBytes(Xs), B = io(t), X = t.readBytes(Nd);
      return YE(T, B, X);
    }
    case Lt.TenureChange:
      const y = Ue(t.readBytes(20)), v = Ue(t.readBytes(20)), x = Ue(t.readBytes(20)), L = Ue(t.readBytes(32)), U = t.readUInt32BE(), P = t.readUInt8Enum(Od, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = Ue(t.readBytes(20));
      return WE(y, v, x, L, U, P, A);
  }
}
function Rd(e) {
  const t = tr(e, jt) ? e : new jt(e);
  return Fd(Ue(t.readBytes(su)));
}
function sk(e) {
  const t = tr(e, jt) ? e : new jt(e), n = t.readUInt8Enum(zr, (r) => {
    throw new Kn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case zr.PublicKeyCompressed:
      return zi(Yt.Compressed, Gd(t));
    case zr.PublicKeyUncompressed:
      return zi(Yt.Uncompressed, ya(Fk(Gd(t).data)));
    case zr.SignatureCompressed:
      return zi(Yt.Compressed, Rd(t));
    case zr.SignatureUncompressed:
      return zi(Yt.Uncompressed, Rd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function th(e) {
  return St(e.data);
}
function ik(e) {
  const t = [];
  switch (e.contents.type) {
    case ye.PublicKey:
      t.push(e.pubKeyEncoding === Yt.Compressed ? zr.PublicKeyCompressed : zr.PublicKeyUncompressed), t.push(St(Dk(e.contents.data)));
      break;
    case ye.MessageSignature:
      t.push(e.pubKeyEncoding === Yt.Compressed ? zr.SignatureCompressed : zr.SignatureUncompressed), t.push(th(e.contents));
      break;
  }
  return cn(t);
}
function zd(e) {
  return e.data.slice();
}
function Gd(e) {
  const t = tr(e, jt) ? e : new jt(e), n = t.readUInt8(), r = n === 4 ? UA : PA;
  return ya(cn([n, t.readBytes(r)]));
}
function nh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Ot.P2PKH || t === Ot.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Ot.P2WPKH || t === Ot.P2WSH || t === Ot.P2WSHNonSequential) && !r.map((s) => s.data).every(wa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Ot.P2PKH:
      return Pc(e, Tk(r[0].data));
    case Ot.P2WPKH:
      return Pc(e, Bk(r[0].data));
    case Ot.P2SH:
    case Ot.P2SHNonSequential:
      return Pc(e, Mk(n, r.map(zd)));
    case Ot.P2WSH:
    case Ot.P2WSHNonSequential:
      return Pc(e, Nk(n, r.map(zd)));
  }
}
function Pc(e, t) {
  return { type: ye.Address, version: e, hash160: t };
}
function rh(e) {
  return wi.c32address(e.version, e.hash160);
}
function v0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return ZE(t, n, r);
}
function Ta(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return JE(t, n);
  } else
    return QE(e);
}
function ak(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return uk(t, n);
  } else
    return ck(e);
}
function ck(e) {
  const t = Ls(e);
  return { type: yt.PrincipalStandard, value: rh(t) };
}
function lk(e) {
  return { type: yt.PrincipalStandard, value: rh(e) };
}
function uk(e, t) {
  const n = Ls(e), r = qr(t);
  return am(n, r);
}
function am(e, t) {
  if (hi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: yt.PrincipalContract,
    value: `${rh(e)}.${t.content}`
  };
}
function dk(e) {
  return { type: yt.ResponseErr, value: e };
}
function fk(e) {
  return { type: yt.ResponseOk, value: e };
}
const hk = (e) => ({ type: yt.StringASCII, value: e }), pk = (e) => ({ type: yt.StringUTF8, value: e });
function gk(e) {
  for (const t in e)
    if (!_k(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: yt.Tuple, value: e };
}
function io(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new jt(St(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new jt(e) : t = e;
  switch (t.readUInt8Enum(hn, (r) => {
    throw new Kn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case hn.int:
      return jE(wd(t.readBytes(16)));
    case hn.uint:
      return RE(t.readBytes(16));
    case hn.buffer:
      const r = t.readUInt32BE();
      return DE(t.readBytes(r));
    case hn.true:
      return OE();
    case hn.false:
      return HE();
    case hn.address:
      const s = aa(t);
      return lk(s);
    case hn.contract:
      const o = aa(t), i = $r(t);
      return am(o, i);
    case hn.ok:
      return fk(io(t));
    case hn.err:
      return dk(io(t));
    case hn.none:
      return Qw();
    case hn.some:
      return em(io(t));
    case hn.list:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(io(t));
      return zE(c);
    case hn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = $r(t).content;
        if (L === void 0)
          throw new Kn('"content" is undefined');
        h[L] = io(t);
      }
      return gk(h);
    case hn.ascii:
      const d = t.readUInt32BE(), w = V1(t.readBytes(d));
      return hk(w);
    case hn.utf8:
      const y = t.readUInt32BE(), v = ac(t.readBytes(y));
      return pk(v);
    default:
      throw new Kn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function po(e, t) {
  return cn([Jf(e), t]);
}
function yk(e) {
  return new Uint8Array([Jf(e.type)]);
}
function wk(e) {
  return e.type === yt.OptionalNone ? new Uint8Array([Jf(e.type)]) : po(e.type, lo(e.value));
}
function mk(e) {
  const t = new Uint8Array(4);
  return Zs(t, Math.ceil(e.value.length / 2), 0), po(e.type, fo(t, St(e.value)));
}
function bk(e) {
  const t = kf(j1(BigInt(e.value), BigInt(_A)), Gw);
  return po(e.type, t);
}
function xk(e) {
  const t = kf(BigInt(e.value), Gw);
  return po(e.type, t);
}
function Sk(e) {
  return po(e.type, fc(Ls(e.value)));
}
function vk(e) {
  const [t, n] = Pk(e.value);
  return po(e.type, fo(fc(Ls(t)), ca(qr(n))));
}
function Ak(e) {
  return po(e.type, lo(e.value));
}
function Ek(e) {
  const t = [], n = new Uint8Array(4);
  Zs(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = lo(r);
    t.push(s);
  }
  return po(e.type, cn(t));
}
function kk(e) {
  const t = [], n = new Uint8Array(4);
  Zs(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = qr(s);
    t.push(ca(o));
    const i = lo(e.value[s]);
    t.push(i);
  }
  return po(e.type, cn(t));
}
function cm(e, t) {
  const n = [], r = t == "ascii" ? K1(e.value) : hi(e.value), s = new Uint8Array(4);
  return Zs(s, r.length, 0), n.push(s), n.push(r), po(e.type, cn(n));
}
function $k(e) {
  return cm(e, "ascii");
}
function Ik(e) {
  return cm(e, "utf8");
}
function A0(e) {
  return Ue(lo(e));
}
function lo(e) {
  switch (e.type) {
    case yt.BoolTrue:
    case yt.BoolFalse:
      return yk(e);
    case yt.OptionalNone:
    case yt.OptionalSome:
      return wk(e);
    case yt.Buffer:
      return mk(e);
    case yt.UInt:
      return xk(e);
    case yt.Int:
      return bk(e);
    case yt.PrincipalStandard:
      return Sk(e);
    case yt.PrincipalContract:
      return vk(e);
    case yt.ResponseOk:
    case yt.ResponseErr:
      return Ak(e);
    case yt.List:
      return Ek(e);
    case yt.Tuple:
      return kk(e);
    case yt.StringASCII:
      return $k(e);
    case yt.StringUTF8:
      return Ik(e);
    default:
      throw new Ri("Unable to serialize. Invalid Clarity Value.");
  }
}
const Lk = (e) => e.length % 2 ? `0${e}` : e, Ck = (e, t) => e.padEnd(t, "0"), lm = (e, t) => e ? hi(e).length > t : !1;
function Kd(e) {
  return Fw(e);
}
const Ya = (e) => lE(Yf(e)), oh = (e) => Ue(UE(e)), Tk = (e) => Ue(Ya(e)), Bk = (e) => {
  const t = Ya(e), n = fo(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ya(n);
  return Ue(r);
}, Mk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Ya(r);
  return Ue(s);
}, Nk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Yf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = cn(o), a = Ya(i);
  return Ue(a);
};
function _k(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Pk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
nn.hmacSha256Sync = (e, ...t) => {
  const n = qw.create(Yf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ya(e) {
  return e = typeof e == "string" ? St(e) : e, {
    type: ye.PublicKey,
    data: e
  };
}
function Uk(e, t, n = Yt.Compressed) {
  const r = W1(t), s = new pr(Ap(r.r), Ap(r.s)), o = at.fromSignature(e, s, r.recoveryId), i = n === Yt.Compressed;
  return o.toHex(i);
}
function Ok(e) {
  return typeof e == "string" ? e : Ue(e);
}
const sh = Ok;
function um(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === Y1;
}
function wa(e) {
  return !sh(e).startsWith("04");
}
function Hk(e) {
  e = $f(e);
  const t = um(e);
  return Ue(cc(e.slice(0, 32), t));
}
function Dk(e) {
  return at.fromHex(sh(e)).toHex(!0);
}
function Fk(e) {
  return at.fromHex(sh(e)).toHex(!1);
}
function jk(e, t) {
  e = $f(e);
  const [n, r] = ql(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ic(r, 1) + pr.fromHex(n).toCompactHex();
}
function ih() {
  return {
    type: ye.MessageSignature,
    data: Ue(new Uint8Array(su))
  };
}
function dm(e, t, n, r) {
  const s = nh(0, e, 1, [ya(t)]).hash160, o = wa(t) ? Yt.Compressed : Yt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Dn(n),
    fee: Dn(r),
    keyEncoding: o,
    signature: ih()
  };
}
function Wa(e) {
  return "signature" in e;
}
function E0(e) {
  return e === Ot.P2SH || e === Ot.P2WSH;
}
function Rk(e) {
  return e === Ot.P2SHNonSequential || e === Ot.P2WSHNonSequential;
}
function k0(e) {
  const t = Kd(e);
  return t.nonce = 0, t.fee = 0, Wa(t) ? t.signature = ih() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function zk(e) {
  const t = [
    e.hashMode,
    St(e.signer),
    $s(e.nonce, 8),
    $s(e.fee, 8),
    e.keyEncoding,
    th(e.signature)
  ];
  return cn(t);
}
function Gk(e) {
  const t = [
    e.hashMode,
    St(e.signer),
    $s(e.nonce, 8),
    $s(e.fee, 8)
  ], n = Qf(e.fields);
  t.push(eh(n));
  const r = new Uint8Array(2);
  return J1(r, e.signaturesRequired, 0), t.push(r), cn(t);
}
function Kk(e, t) {
  const n = Ue(t.readBytes(20)), r = BigInt(`0x${Ue(t.readBytes(8))}`), s = BigInt(`0x${Ue(t.readBytes(8))}`), o = t.readUInt8Enum(Yt, (a) => {
    throw new Kn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Ot.P2WPKH && o != Yt.Compressed)
    throw new Kn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Rd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function Vk(e, t) {
  const n = Ue(t.readBytes(20)), r = BigInt("0x" + Ue(t.readBytes(8))), s = BigInt("0x" + Ue(t.readBytes(8))), o = om(t, ye.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case ye.PublicKey:
        wa(u.contents.data) || (i = !0);
        break;
      case ye.MessageSignature:
        if (u.pubKeyEncoding === Yt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Rs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Ot.P2WSH || e === Ot.P2WSHNonSequential))
    throw new Rs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Du(e) {
  return Wa(e) ? zk(e) : Gk(e);
}
function Fu(e) {
  const t = e.readUInt8Enum(Ot, (n) => {
    throw new Kn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Ot.P2PKH || t === Ot.P2WPKH ? Kk(t, e) : Vk(t, e);
}
function fm(e, t, n, r) {
  const o = e + Ue(new Uint8Array([t])) + Ue($s(n, 8)) + Ue($s(r, 8));
  if (St(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return oh(St(o));
}
function hm(e, t, n) {
  const r = 33 + su, s = wa(t.data) ? Yt.Compressed : Yt.Uncompressed, o = e + Lk(s.toString(16)) + n, i = St(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return oh(i);
}
function Xk(e, t, n, r, s) {
  const o = fm(e, t, n, r), i = jk(s, o), a = ya(Hk(s)), c = hm(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function pm(e, t, n, r, s, o) {
  const i = fm(e, t, n, r), a = ya(Uk(i, o, s)), c = hm(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function qk() {
  const e = dm(Ot.P2PKH, "", 0, 0);
  return e.signer = GE().hash160, e.keyEncoding = Yt.Compressed, e.signature = ih(), e;
}
function $0(e, t, n) {
  return Wa(e) ? Yk(e, t, n) : Wk(e, t, n);
}
function Yk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = pm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = nh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Rs(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function Wk(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case ye.PublicKey:
        wa(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case ye.MessageSignature:
        c.pubKeyEncoding === Yt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = pm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (E0(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Rs("Too many signatures");
        break;
    }
  if (E0(e.hashMode) && i !== e.signaturesRequired || Rk(e.hashMode) && i < e.signaturesRequired)
    throw new Rs("Incorrect number of signatures");
  if (o && (e.hashMode === Ot.P2WSH || e.hashMode === Ot.P2WSHNonSequential))
    throw new Rs("Uncompressed keys are not allowed in this hash mode");
  const a = nh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Rs(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function gm(e) {
  return {
    authType: en.Standard,
    spendingCondition: e
  };
}
function ym(e, t) {
  return {
    authType: en.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || dm(Ot.P2PKH, "0".repeat(66), 0, 0)
  };
}
function I0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case en.Standard:
        return gm(k0(e.spendingCondition));
      case en.Sponsored:
        return ym(k0(e.spendingCondition), qk());
      default:
        throw new $l("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Zk(e, t) {
  switch (e.authType) {
    case en.Standard:
      return $0(e.spendingCondition, t, en.Standard);
    case en.Sponsored:
      return $0(e.spendingCondition, t, en.Standard);
    default:
      throw new $l("Invalid origin auth type");
  }
}
function Jk(e, t) {
  switch (e.authType) {
    case en.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Dn(t)
      };
      return { ...e, spendingCondition: n };
    case en.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Dn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Qk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Dn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function e3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Dn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function t3(e, t) {
  const n = {
    ...t,
    nonce: Dn(t.nonce),
    fee: Dn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function n3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case en.Standard:
      t.push(Du(e.spendingCondition));
      break;
    case en.Sponsored:
      t.push(Du(e.spendingCondition)), t.push(Du(e.sponsorSpendingCondition));
      break;
  }
  return cn(t);
}
function r3(e) {
  const t = e.readUInt8Enum(en, (r) => {
    throw new Kn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case en.Standard:
      return n = Fu(e), gm(n);
    case en.Sponsored:
      n = Fu(e);
      const r = Fu(e);
      return ym(n, r);
  }
}
class o3 {
  constructor({ auth: t, payload: n, postConditions: r = Qf([]), postConditionMode: s = kl.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = BA(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Dn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = lr.Any;
  }
  signBegin() {
    const t = Kd(this);
    return t.auth = I0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Kd(this);
    return t.auth = I0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Zk(this.auth, this.verifyBegin());
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
    const n = typeof t == "object" && "type" in t ? t : ya(t), r = this.auth.spendingCondition;
    if (r && !Wa(r)) {
      const s = wa(n.data);
      r.fields.push(zi(s ? Yt.Compressed : Yt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = Xk(n, r, t.fee, t.nonce, s);
    if (Wa(t))
      t.signature = Fd(o);
    else {
      const a = um(s);
      t.fields.push(zi(a ? Yt.Compressed : Yt.Uncompressed, Fd(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return oh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != en.Sponsored)
      throw new $l("Cannot sponsor sign a non-sponsored transaction");
    this.auth = t3(this.auth, t);
  }
  setFee(t) {
    this.auth = Jk(this.auth, t);
  }
  setNonce(t) {
    this.auth = Qk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != en.Sponsored)
      throw new $l("Cannot sponsor sign a non-sponsored transaction");
    this.auth = e3(this.auth, t);
  }
  serialize() {
    return Ue(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ri('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ri('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ri('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ri('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Zs(n, this.chainId, 0), t.push(n), t.push(n3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(eh(this.postConditions)), t.push(im(this.payload)), cn(t);
  }
}
function s3(e) {
  const t = tr(e, jt) ? e : new jt(e), n = t.readUInt8Enum(ii, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = r3(t), o = t.readUInt8Enum(lr, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(kl, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = om(t, ye.PostCondition), c = ok(t), u = new o3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = o, u;
}
const L0 = BigInt("18446744073709551615");
function ju(e) {
  const t = Dn(e);
  if (t < 0n || t > L0)
    throw new RangeError(`Post-condition amount must be between 0 and ${L0} (u64 max), received: ${t}`);
  return t;
}
var Vd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Vd || (Vd = {}));
var Xd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(Xd || (Xd = {}));
function i3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Gt.STX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Xn.Origin } : Ta(e.address),
        conditionCode: Uc(e.condition),
        amount: ju(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Gt.Fungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Xn.Origin } : Ta(e.address),
        conditionCode: Uc(e.condition),
        amount: ju(e.amount),
        asset: v0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Gt.NonFungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Xn.Origin } : Ta(e.address),
        conditionCode: Uc(e.condition),
        asset: v0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Gt.Staking,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Xn.Origin } : Ta(e.address),
        conditionCode: Uc(e.condition),
        amount: ju(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Gt.PoX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: Xn.Origin } : Ta(e.address),
        conditionCode: a3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Uc(e) {
  return Vd[e];
}
function a3(e) {
  return Xd[e];
}
function wm(e) {
  const t = i3(e);
  return nk(t);
}
function c3(e, t, n) {
  return ch(mm(e), n);
}
function mm(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Za(r);
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
    return BigInt(`0x${d3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ah(e, t = 8) {
  return (typeof e == "bigint" ? e : mm(e)).toString(16).padStart(t * 2, "0");
}
function ch(e, t = 16) {
  const n = ah(e, t);
  return Za(n);
}
function l3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const u3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function d3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += u3[n];
  return t;
}
function Za(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function lh(e) {
  return new TextEncoder().encode(e);
}
function f3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function h3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function C0(e) {
  if (e.some(h3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function uh(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Po(e) {
  return uh(...e.map((t) => typeof t == "number" ? C0([t]) : t instanceof Array ? C0(t) : t));
}
function cu(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var qd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(qd || (qd = {}));
qd.Mainnet;
const p3 = 128, g3 = 128, bm = 16;
var Yd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Yd || (Yd = {}));
var T0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(T0 || (T0 = {}));
var B0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(B0 || (B0 = {}));
var Fr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Fr || (Fr = {}));
const Ru = ["onChainOnly", "offChainOnly", "any"];
Ru[0] + "", Fr.OnChainOnly, Ru[1] + "", Fr.OffChainOnly, Ru[2] + "", Fr.Any, Fr.OnChainOnly + "", Fr.OnChainOnly, Fr.OffChainOnly + "", Fr.OffChainOnly, Fr.Any + "", Fr.Any;
var Wd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Wd || (Wd = {}));
Wd.Mainnet;
var M0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(M0 || (M0 = {}));
var Hs;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Hs || (Hs = {}));
var N0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(N0 || (N0 = {}));
var _0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(_0 || (_0 = {}));
var P0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(P0 || (P0 = {}));
var U0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(U0 || (U0 = {}));
var O0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(O0 || (O0 = {}));
var H0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(H0 || (H0 = {}));
var Zd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Zd || (Zd = {}));
var D0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(D0 || (D0 = {}));
var F0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(F0 || (F0 = {}));
function Jd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function y3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function xm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function w3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Jd(e.outputLen), Jd(e.blockLen);
}
function m3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function b3(e, t) {
  xm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zu = {
  number: Jd,
  bool: y3,
  bytes: xm,
  hash: w3,
  exists: m3,
  output: b3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Gu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), ro = (e, t) => e << 32 - t | e >>> t, x3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!x3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function S3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Sm(e) {
  if (typeof e == "string" && (e = S3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let v3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function bi(e) {
  const t = (r) => e().update(Sm(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function A3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let dh = class extends v3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Gu(this.buffer);
  }
  update(t) {
    zu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Sm(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Gu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    zu.exists(this), zu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    A3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Gu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const E3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), vm = Uint8Array.from({ length: 16 }, (e, t) => t), k3 = vm.map((e) => (9 * e + 5) % 16);
let fh = [vm], hh = [k3];
for (let e = 0; e < 4; e++)
  for (let t of [fh, hh])
    t.push(t[e].map((n) => E3[n]));
const Am = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), $3 = fh.map((e, t) => e.map((n) => Am[t][n])), I3 = hh.map((e, t) => e.map((n) => Am[t][n])), L3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), C3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oc = (e, t) => e << t | e >>> 32 - t;
function j0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Hc = new Uint32Array(16);
let T3 = class extends dh {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Hc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = L3[y], L = C3[y], U = fh[y], P = hh[y], A = $3[y], T = I3[y];
      for (let B = 0; B < 16; B++) {
        const X = Oc(r + j0(y, o, a, u) + Hc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Oc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Oc(s + j0(v, i, c, h) + Hc[P[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Oc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Hc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
bi(() => new T3());
const B3 = (e, t, n) => e & t ^ ~e & n, M3 = (e, t, n) => e & t ^ e & n ^ t & n, N3 = new Uint32Array([
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
let Em = class extends dh {
  constructor() {
    super(64, 32, 8, !1), this.A = ls[0] | 0, this.B = ls[1] | 0, this.C = ls[2] | 0, this.D = ls[3] | 0, this.E = ls[4] | 0, this.F = ls[5] | 0, this.G = ls[6] | 0, this.H = ls[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      us[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = us[d - 15], y = us[d - 2], v = ro(w, 7) ^ ro(w, 18) ^ w >>> 3, x = ro(y, 17) ^ ro(y, 19) ^ y >>> 10;
      us[d] = x + us[d - 7] + v + us[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = ro(a, 6) ^ ro(a, 11) ^ ro(a, 25), y = h + w + B3(a, c, u) + N3[d] + us[d] | 0, x = (ro(r, 2) ^ ro(r, 13) ^ ro(r, 22)) + M3(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, _3 = class extends Em {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
bi(() => new Em());
bi(() => new _3());
const Dc = BigInt(2 ** 32 - 1), Qd = BigInt(32);
function km(e, t = !1) {
  return t ? { h: Number(e & Dc), l: Number(e >> Qd & Dc) } : { h: Number(e >> Qd & Dc) | 0, l: Number(e & Dc) | 0 };
}
function P3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = km(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const U3 = (e, t) => BigInt(e >>> 0) << Qd | BigInt(t >>> 0), O3 = (e, t, n) => e >>> n, H3 = (e, t, n) => e << 32 - n | t >>> n, D3 = (e, t, n) => e >>> n | t << 32 - n, F3 = (e, t, n) => e << 32 - n | t >>> n, j3 = (e, t, n) => e << 64 - n | t >>> n - 32, R3 = (e, t, n) => e >>> n - 32 | t << 64 - n, z3 = (e, t) => t, G3 = (e, t) => e, K3 = (e, t, n) => e << n | t >>> 32 - n, V3 = (e, t, n) => t << n | e >>> 32 - n, X3 = (e, t, n) => t << n - 32 | e >>> 64 - n, q3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Y3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const W3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Z3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, J3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Q3 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, e4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), t4 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: km,
  split: P3,
  toBig: U3,
  shrSH: O3,
  shrSL: H3,
  rotrSH: D3,
  rotrSL: F3,
  rotrBH: j3,
  rotrBL: R3,
  rotr32H: z3,
  rotr32L: G3,
  rotlSH: K3,
  rotlSL: V3,
  rotlBH: X3,
  rotlBL: q3,
  add: Y3,
  add3L: W3,
  add3H: Z3,
  add4L: J3,
  add4H: Q3,
  add5H: t4,
  add5L: e4
}, [n4, r4] = nt.split([
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
].map((e) => BigInt(e))), ds = new Uint32Array(80), fs = new Uint32Array(80);
let lu = class extends dh {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ds[A] = t.getUint32(n), fs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ds[A - 15] | 0, B = fs[A - 15] | 0, X = nt.rotrSH(T, B, 1) ^ nt.rotrSH(T, B, 8) ^ nt.shrSH(T, B, 7), Q = nt.rotrSL(T, B, 1) ^ nt.rotrSL(T, B, 8) ^ nt.shrSL(T, B, 7), oe = ds[A - 2] | 0, Y = fs[A - 2] | 0, m = nt.rotrSH(oe, Y, 19) ^ nt.rotrBH(oe, Y, 61) ^ nt.shrSH(oe, Y, 6), C = nt.rotrSL(oe, Y, 19) ^ nt.rotrBL(oe, Y, 61) ^ nt.shrSL(oe, Y, 6), _ = nt.add4L(Q, C, fs[A - 7], fs[A - 16]), M = nt.add4H(_, X, m, ds[A - 7], ds[A - 16]);
      ds[A] = M | 0, fs[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, w, 14) ^ nt.rotrSH(d, w, 18) ^ nt.rotrBH(d, w, 41), B = nt.rotrSL(d, w, 14) ^ nt.rotrSL(d, w, 18) ^ nt.rotrBL(d, w, 41), X = d & y ^ ~d & x, Q = w & v ^ ~w & L, oe = nt.add5L(P, B, Q, r4[A], fs[A]), Y = nt.add5H(oe, U, T, X, n4[A], ds[A]), m = oe | 0, C = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), _ = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = x | 0, P = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = nt.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = nt.add3L(m, _, W);
      r = nt.add3H(F, Y, C, M), s = F | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = nt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = nt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = nt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = nt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: P } = nt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, P);
  }
  roundClean() {
    ds.fill(0), fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, o4 = class extends lu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, s4 = class extends lu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, i4 = class extends lu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bi(() => new lu());
bi(() => new o4());
bi(() => new s4());
bi(() => new i4());
function a4(e, t, n) {
  const s = p3;
  if (A4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Yd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Sn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(Sn || (Sn = {}));
let c4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, $m = class extends c4 {
  constructor(t) {
    super(t);
  }
};
function uu(e) {
  const t = [];
  return t.push(Za(ah(e.version, 1))), t.push(Za(e.hash160)), Po(t);
}
function l4(e) {
  const t = [];
  return t.push(e.prefix), t.push(uu(e.address)), e.prefix === Zd.Contract && t.push(Ja(e.contractName)), Po(t);
}
function Ja(e) {
  const t = [], n = lh(e.content), r = n.byteLength;
  return t.push(Za(ah(r, e.lengthPrefixBytes))), t.push(n), Po(t);
}
function u4(e) {
  const t = [];
  return t.push(uu(e.address)), t.push(Ja(e.contractName)), t.push(Ja(e.assetName)), Po(t);
}
function Im(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(l4(e.principal)), (e.conditionType === Hs.Fungible || e.conditionType === Hs.NonFungible) && t.push(u4(e.assetInfo)), e.conditionType === Hs.NonFungible && t.push(ci(e.assetName)), t.push(e.conditionCode), e.conditionType === Hs.STX || e.conditionType === Hs.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new $m("The post-condition amount may not be larger than 8 bytes");
    t.push(c3(e.amount, !1, 8));
  }
  return Po(t);
}
function go(e, t) {
  return Po([e, t]);
}
function d4(e) {
  return new Uint8Array([e.type]);
}
function f4(e) {
  return e.type === Sn.OptionalNone ? new Uint8Array([e.type]) : go(e.type, ci(e.value));
}
function h4(e) {
  const t = new Uint8Array(4);
  return cu(t, e.buffer.length, 0), go(e.type, uh(t, e.buffer));
}
function p4(e) {
  const t = ch(l3(e.value, BigInt(g3)), bm);
  return go(e.type, t);
}
function g4(e) {
  const t = ch(e.value, bm);
  return go(e.type, t);
}
function y4(e) {
  return go(e.type, uu(e.address));
}
function w4(e) {
  return go(e.type, uh(uu(e.address), Ja(e.contractName)));
}
function m4(e) {
  return go(e.type, ci(e.value));
}
function b4(e) {
  const t = [], n = new Uint8Array(4);
  cu(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = ci(r);
    t.push(s);
  }
  return go(e.type, Po(t));
}
function x4(e) {
  const t = [], n = new Uint8Array(4);
  cu(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = a4(s);
    t.push(Ja(o));
    const i = ci(e.data[s]);
    t.push(i);
  }
  return go(e.type, Po(t));
}
function Lm(e, t) {
  const n = [], r = t == "ascii" ? f3(e.data) : lh(e.data), s = new Uint8Array(4);
  return cu(s, r.length, 0), n.push(s), n.push(r), go(e.type, Po(n));
}
function S4(e) {
  return Lm(e, "ascii");
}
function v4(e) {
  return Lm(e, "utf8");
}
function ci(e) {
  switch (e.type) {
    case Sn.BoolTrue:
    case Sn.BoolFalse:
      return d4(e);
    case Sn.OptionalNone:
    case Sn.OptionalSome:
      return f4(e);
    case Sn.Buffer:
      return h4(e);
    case Sn.UInt:
      return g4(e);
    case Sn.Int:
      return p4(e);
    case Sn.PrincipalStandard:
      return y4(e);
    case Sn.PrincipalContract:
      return w4(e);
    case Sn.ResponseOk:
    case Sn.ResponseErr:
      return m4(e);
    case Sn.List:
      return b4(e);
    case Sn.Tuple:
      return x4(e);
    case Sn.StringASCII:
      return S4(e);
    case Sn.StringUTF8:
      return v4(e);
    default:
      throw new $m("Unable to serialize. Invalid Clarity Value.");
  }
}
const A4 = (e, t) => e ? lh(e).length > t : !1, E4 = "connect-ui";
let sl, Cm, ur = !1, ef = !1;
const _o = (e, t = "") => () => {
}, k4 = (e, t) => () => {
}, $4 = "{visibility:hidden}.hydrated{visibility:inherit}", R0 = {}, I4 = "http://www.w3.org/2000/svg", L4 = "http://www.w3.org/1999/xhtml", C4 = (e) => e != null, ph = (e) => (e = typeof e, e === "object" || e === "function");
function Tm(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const We = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !ph(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? tf(null, r) : r), o = s);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = tf(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, tf = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, T4 = {}, B4 = (e) => e && e.$tag$ === T4, M4 = (e, t) => e != null && !ph(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, N4 = (e) => ma(e).$hostElement$, _4 = (e, t, n) => {
  const r = On.ce(t, n);
  return e.dispatchEvent(r), r;
}, z0 = /* @__PURE__ */ new WeakMap(), P4 = (e, t, n) => {
  let r = Il.get(e);
  t$ && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, Il.set(e, r);
}, U4 = (e, t, n, r) => {
  var s;
  let o = Bm(t);
  const i = Il.get(o);
  if (e = e.nodeType === 11 ? e : uo, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = z0.get(e), c;
      if (a || z0.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = uo.createElement("style"), c.innerHTML = i;
          const u = (s = On.$nonce$) !== null && s !== void 0 ? s : Tm(uo);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, O4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = _o("attachStyles", t.$tagName$), o = U4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, Bm = (e, t) => "sc-" + e.$tagName$, G0 = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = V0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = K0(n), h = K0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : V0(du, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && On.rel(e, t, n, !1), r && On.ael(e, t, r, !1);
    else {
      const c = ph(r);
      if ((i || c && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const u = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != u) && (e[t] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || o & 4 || s) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, H4 = /\s/, K0 = (e) => e ? e.split(H4) : [], Mm = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || R0, i = t.$attrs$ || R0;
  for (r in o)
    r in i || G0(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    G0(s, r, o[r], i[r], n, t.$flags$);
}, gh = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = uo.createTextNode(s.$text$);
  else {
    if (ur || (ur = s.$tag$ === "svg"), i = s.$elm$ = uo.createElementNS(ur ? I4 : L4, s.$tag$), ur && s.$tag$ === "foreignObject" && (ur = !1), Mm(null, s, ur), C4(sl) && i["s-si"] !== sl && i.classList.add(i["s-si"] = sl), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = gh(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? ur = !1 : i.tagName === "foreignObject" && (ur = !0);
  }
  return i;
}, Nm = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Cm && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = gh(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, _m = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, D4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], w;
  for (; s <= i && o <= u; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : h == null ? h = r[++o] : d == null ? d = r[--u] : Fc(a, h) ? (Oa(a, h), a = t[++s], h = r[++o]) : Fc(c, d) ? (Oa(c, d), c = t[--i], d = r[--u]) : Fc(a, d) ? (Oa(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], d = r[--u]) : Fc(c, h) ? (Oa(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++o]) : (w = gh(t && t[o], n, o), h = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Nm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, o, u) : o > u && _m(t, s, i);
}, Fc = (e, t) => e.$tag$ === t.$tag$, Oa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (ur = o === "svg" ? !0 : o === "foreignObject" ? !1 : ur, Mm(e, t, ur), r !== null && s !== null ? D4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Nm(n, null, t, s, 0, s.length - 1)) : r !== null && _m(r, 0, r.length - 1), ur && o === "svg" && (ur = !1)) : e.$text$ !== i && (n.data = i);
}, F4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || tf(null, null), s = B4(t) ? t : We(null, null, t);
  Cm = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, sl = n["s-sc"], Oa(r, s);
}, Pm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, yh = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Pm(e, e.$ancestorComponent$), r$(() => j4(e, t));
}, j4 = (e, t) => {
  const n = _o("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), K4(s, () => R4(e, r, t));
}, R4 = async (e, t, n) => {
  const r = e.$hostElement$, s = _o("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && O4(e);
  const i = _o("render", e.$cmpMeta$.$tagName$);
  z4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => G4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, z4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, F4(e, t);
  } catch (r) {
    Qa(r, e.$hostElement$);
  }
  return null;
}, G4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = _o("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Om(n), r(), e.$onReadyResolve$(n), s || Um()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && mh(() => yh(e, !1)), e.$flags$ &= -517;
}, Um = (e) => {
  Om(uo.documentElement), mh(() => _4(du, "appload", { detail: { namespace: E4 } }));
}, K4 = (e, t) => e && e.then ? e.then(t) : t(), Om = (e) => e.classList.add("hydrated"), V4 = (e, t) => ma(e).$instanceValues$.get(t), X4 = (e, t, n, r) => {
  const s = ma(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = M4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), u = n !== o && !c;
  (!(i & 8) || o === void 0) && u && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && yh(s, !1));
}, Hm = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return V4(this, o);
        },
        set(a) {
          X4(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        On.jmp(() => {
          const u = o.get(i);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (s.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return o.set(c, i), c;
      });
    }
  }
  return e;
}, q4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = e$(n), s.then) {
        const c = k4();
        s = await s, c();
      }
      s.isProxied || (Hm(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = _o("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        Qa(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Bm(n);
      if (!Il.has(c)) {
        const u = _o("registerStyles", n.$tagName$);
        P4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => yh(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, Y4 = (e) => {
  if (!(On.$flags$ & 1)) {
    const t = ma(e), n = t.$cmpMeta$, r = _o("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Pm(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), q4(e, t, n);
    }
    r();
  }
}, W4 = (e) => {
  On.$flags$ & 1 || ma(e);
}, Z4 = (e, t = {}) => {
  var n;
  const r = _o(), s = [], o = t.exclude || [], i = du.customElements, a = uo.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ uo.createElement("style"), h = [];
  let d, w = !0;
  Object.assign(On, t), On.$resourcesUrl$ = new URL(t.resourcesUrl || "./", uo.baseURI).href, e.map((y) => {
    y[1].map((v) => {
      const x = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      x.$members$ = v[2];
      const L = x.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(P) {
          super(P), P = this, Q4(P, x), x.$flags$ & 1 && P.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? h.push(this) : On.jmp(() => Y4(this));
        }
        disconnectedCallback() {
          On.jmp(() => W4(this));
        }
        componentOnReady() {
          return ma(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = y[0], !o.includes(L) && !i.get(L) && (s.push(L), i.define(L, Hm(
        U,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + $4, u.setAttribute("data-styles", "");
    const y = (n = On.$nonce$) !== null && n !== void 0 ? n : Tm(uo);
    y != null && u.setAttribute("nonce", y), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((y) => y.connectedCallback()) : On.jmp(() => d = setTimeout(Um, 30)), r();
}, wh = /* @__PURE__ */ new WeakMap(), ma = (e) => wh.get(e), J4 = (e, t) => wh.set(t.$lazyInstance$ = e, t), Q4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], wh.set(e, n);
}, V0 = (e, t) => t in e, Qa = (e, t) => (0, console.error)(e, t), Ku = /* @__PURE__ */ new Map(), e$ = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = Ku.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (Ku.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => YC).then(i, Qa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (Ku.set(s, i), i[r]), Qa);
}, Il = /* @__PURE__ */ new Map(), du = typeof window < "u" ? window : {}, uo = du.document || { head: {} }, On = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Dm = (e) => Promise.resolve(e), t$ = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), X0 = [], Fm = [], n$ = (e, t) => (n) => {
  e.push(n), ef || (ef = !0, On.$flags$ & 4 ? mh(nf) : On.raf(nf));
}, q0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Qa(n);
    }
  e.length = 0;
}, nf = () => {
  q0(X0), q0(Fm), (ef = X0.length > 0) && On.raf(nf);
}, mh = (e) => Dm().then(e), r$ = /* @__PURE__ */ n$(Fm), o$ = () => Dm(), s$ = (e, t) => typeof window > "u" ? Promise.resolve() : o$().then(() => Z4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var i$ = Object.defineProperty, a$ = Object.defineProperties, c$ = Object.getOwnPropertyDescriptors, Ll = Object.getOwnPropertySymbols, jm = Object.prototype.hasOwnProperty, Rm = Object.prototype.propertyIsEnumerable, Y0 = (e, t, n) => t in e ? i$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, yr = (e, t) => {
  for (var n in t || (t = {})) jm.call(t, n) && Y0(e, n, t[n]);
  if (Ll) for (var n of Ll(t)) Rm.call(t, n) && Y0(e, n, t[n]);
  return e;
}, Yr = (e, t) => a$(e, c$(t)), zm = (e, t) => {
  var n = {};
  for (var r in e) jm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Ll) for (var r of Ll(e)) t.indexOf(r) < 0 && Rm.call(e, r) && (n[r] = e[r]);
  return n;
};
function Gm() {
  return ou(ni()) || window.StacksProvider || window.BlockstackProvider;
}
function fu(e) {
  return e ? typeof e == "string" ? oi.fromName(e) : "version" in e ? e : "url" in e ? new Td({ url: e.url }) : e.transactionVersion === ii.Mainnet ? new Td({ url: e.client.baseUrl }) : new Bd({ url: e.client.baseUrl }) : new Bd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var l$ = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(l$ || {}), u$ = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(u$ || {}), bh = (e) => {
  let t = e;
  if (!t) {
    let n = new Ay(["store_write"], document.location.href);
    t = new Cd({ appConfig: n });
  }
  return t;
};
function Km(e) {
  try {
    return bh(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Vm = (e) => {
  let t = bh(e).loadUserData().appPrivateKey, n = Tn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function d$(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [si.Mainnet]: "mainnet", [si.Testnet]: "testnet" }, a = fu(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function f$(e) {
  let t = fu(e.network), n = bh(e.userSession), r = Yr(yr({}, e), { network: t, userSession: n });
  return yr({ stxAddress: d$(r) }, r);
}
async function h$(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(wm) : n = n.map((r) => Ue(Im(r)))), new Tn.TokenSigner("ES256k", t).signAsync(Yr(yr({}, e), { postConditions: n }));
}
function p$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(wm) : t = t.map((n) => Ue(Im(n)))), Tn.createUnsecuredToken(Yr(yr({}, e), { postConditions: t }));
}
var g$ = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = St(a.replace(/^0x/, "")), u = s3(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Yr(yr({}, i), { stacksTransaction: u }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Yr(yr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, y$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = zm(t, ["amount", "appDetails", "userSession"]);
  if (Km(s)) {
    let { privateKey: a, publicKey: c } = Vm(s), u = Yr(yr({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), h$(u, a);
  }
  let i = Yr(yr({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), p$(i);
};
async function w$(e, t, n) {
  let r = await t(Yr(yr(yr({}, f$(e)), e), { network: fu(e.network) }));
  return g$({ token: r, options: e }, n);
}
function m$(e, t = Gm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return w$(e, y$, t);
}
function Xm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Yr(yr({}, e), { message: A0(t), domain: A0(n) }) : Yr(yr({}, e), { message: Ue(ci(t)), domain: Ue(ci(n)) });
}
async function b$(e, t) {
  return new Tn.TokenSigner("ES256k", t).signAsync(Xm(e));
}
async function x$(e) {
  let t = e, { userSession: n } = t, r = zm(t, ["userSession"]);
  if (Km(n)) {
    let { privateKey: s, publicKey: o } = Vm(n), i = Yr(yr({}, r), { publicKey: o });
    return b$(i, s);
  }
  return Tn.createUnsecuredToken(Xm(e));
}
var S$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(S$ || {}), qm = "asigna-stx", W0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === qm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(A$(e, t), "*");
}), v$ = { authenticationRequest: async (e) => W0(e, "authenticationRequest"), transactionRequest: async (e) => W0(e, "transactionRequest") }, A$ = (e, t) => ({ source: qm, [t]: e }), E$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = v$);
};
E$();
var k$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function $$(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = ni(), i = Gm();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    s$();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : k$, c = wA(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (y) => {
      d(), e(n, y);
    }, u.cancelCallback = () => {
      var y;
      d(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(u);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), u.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var jc = $$(m$);
function Is(e, t, n) {
  return xh(Yn(e, t), n);
}
function Yn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Vt(r);
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
      const r = C$(BigInt(`0x${lt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${lt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Z0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function hc(e, t = 8) {
  return (typeof e == "bigint" ? e : Yn(e, !1)).toString(16).padStart(t * 2, "0");
}
function hu(e) {
  return parseInt(e, 16);
}
function xh(e, t = 16) {
  const n = hc(e, t);
  return Vt(n);
}
function I$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function L$(e, t) {
  return e & BigInt(1) << t;
}
function C$(e, t) {
  return L$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const T$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function lt(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += T$[n];
  return t;
}
function Vt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function ba(e) {
  return new TextEncoder().encode(e);
}
function Sh(e) {
  return new TextDecoder().decode(e);
}
function Ym(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function B$(e) {
  return String.fromCharCode.apply(null, e);
}
function M$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function J0(e) {
  if (e.some(M$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function pu(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function ln(e) {
  return pu(...e.map((t) => typeof t == "number" ? J0([t]) : t instanceof Array ? J0(t) : t));
}
var Q0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Q0 || (Q0 = {}));
var eg;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(eg || (eg = {}));
var tg;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(tg || (tg = {}));
const Wm = 33, Vu = 32;
function N$(e) {
  if (e.length < Vu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Vu * 2), r = e.slice(2 + Vu * 2);
  return {
    recoveryId: hu(t),
    r: n,
    s: r
  };
}
function _$(e) {
  const t = typeof e == "string" ? Vt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function P$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function U$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function O$(e, t) {
  return e[t];
}
function H$(e, t, n = 0) {
  return e[n] = t, e;
}
function D$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function li(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var rf;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(rf || (rf = {}));
const F$ = rf.Mainnet, j$ = 128, R$ = 128, Zm = 16, qs = 32, of = 80, gu = 65, z$ = 32, G$ = 64, Cl = 34;
var Le;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Le || (Le = {}));
var it;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var sf;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(sf || (sf = {}));
var Qn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Qn || (Qn = {}));
const il = ["onChainOnly", "offChainOnly", "any"], ng = {
  [il[0]]: Qn.OnChainOnly,
  [il[1]]: Qn.OffChainOnly,
  [il[2]]: Qn.Any,
  [Qn.OnChainOnly]: Qn.OnChainOnly,
  [Qn.OffChainOnly]: Qn.OffChainOnly,
  [Qn.Any]: Qn.Any
};
function K$(e) {
  if (e in ng)
    return ng[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${il.join(", ")}`);
}
var Tl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Tl || (Tl = {}));
Tl.Mainnet;
var la;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(la || (la = {}));
var er;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(er || (er = {}));
var tn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(tn || (tn = {}));
var Ht;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ht || (Ht = {}));
var Bl;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Bl || (Bl = {}));
var Wt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wt || (Wt = {}));
var ec;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ec || (ec = {}));
var af;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(af || (af = {}));
var tc;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(tc || (tc = {}));
var rg;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(rg || (rg = {}));
var og;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(og || (og = {}));
function cf(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function V$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Jm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function X$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  cf(e.outputLen), cf(e.blockLen);
}
function q$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Y$(e, t) {
  Jm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gs = {
  number: cf,
  bool: V$,
  bytes: Jm,
  hash: X$,
  exists: q$,
  output: Y$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), oo = (e, t) => e << 32 - t | e >>> t, W$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!W$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Z$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function vh(e) {
  if (typeof e == "string" && (e = Z$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Qm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function xi(e) {
  const t = (r) => e().update(vh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function J$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class Ah extends Qm {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Xu(this.buffer);
  }
  update(t) {
    Gs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = vh(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Xu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Gs.exists(this), Gs.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    J$(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Xu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
}
const Q$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), eb = Uint8Array.from({ length: 16 }, (e, t) => t), e8 = eb.map((e) => (9 * e + 5) % 16);
let Eh = [eb], kh = [e8];
for (let e = 0; e < 4; e++)
  for (let t of [Eh, kh])
    t.push(t[e].map((n) => Q$[n]));
const tb = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), t8 = Eh.map((e, t) => e.map((n) => tb[t][n])), n8 = kh.map((e, t) => e.map((n) => tb[t][n])), r8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), o8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Rc = (e, t) => e << t | e >>> 32 - t;
function sg(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const zc = new Uint32Array(16);
class s8 extends Ah {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      zc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = r8[y], L = o8[y], U = Eh[y], P = kh[y], A = t8[y], T = n8[y];
      for (let B = 0; B < 16; B++) {
        const X = Rc(r + sg(y, o, a, u) + zc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Rc(a, 10) | 0, a = o, o = X;
      }
      for (let B = 0; B < 16; B++) {
        const X = Rc(s + sg(v, i, c, h) + zc[P[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Rc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    zc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const i8 = xi(() => new s8()), a8 = (e, t, n) => e & t ^ ~e & n, c8 = (e, t, n) => e & t ^ e & n ^ t & n, l8 = new Uint32Array([
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
]), hs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ps = new Uint32Array(64);
class nb extends Ah {
  constructor() {
    super(64, 32, 8, !1), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ps[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ps[d - 15], y = ps[d - 2], v = oo(w, 7) ^ oo(w, 18) ^ w >>> 3, x = oo(y, 17) ^ oo(y, 19) ^ y >>> 10;
      ps[d] = x + ps[d - 7] + v + ps[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = oo(a, 6) ^ oo(a, 11) ^ oo(a, 25), y = h + w + a8(a, c, u) + l8[d] + ps[d] | 0, x = (oo(r, 2) ^ oo(r, 13) ^ oo(r, 22)) + c8(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ps.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class u8 extends nb {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const $h = xi(() => new nb());
xi(() => new u8());
const Gc = BigInt(2 ** 32 - 1), lf = BigInt(32);
function rb(e, t = !1) {
  return t ? { h: Number(e & Gc), l: Number(e >> lf & Gc) } : { h: Number(e >> lf & Gc) | 0, l: Number(e & Gc) | 0 };
}
function d8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = rb(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const f8 = (e, t) => BigInt(e >>> 0) << lf | BigInt(t >>> 0), h8 = (e, t, n) => e >>> n, p8 = (e, t, n) => e << 32 - n | t >>> n, g8 = (e, t, n) => e >>> n | t << 32 - n, y8 = (e, t, n) => e << 32 - n | t >>> n, w8 = (e, t, n) => e << 64 - n | t >>> n - 32, m8 = (e, t, n) => e >>> n - 32 | t << 64 - n, b8 = (e, t) => t, x8 = (e, t) => e, S8 = (e, t, n) => e << n | t >>> 32 - n, v8 = (e, t, n) => t << n | e >>> 32 - n, A8 = (e, t, n) => t << n - 32 | e >>> 64 - n, E8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function k8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), I8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, L8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), C8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, T8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), B8 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, rt = {
  fromBig: rb,
  split: d8,
  toBig: f8,
  shrSH: h8,
  shrSL: p8,
  rotrSH: g8,
  rotrSL: y8,
  rotrBH: w8,
  rotrBL: m8,
  rotr32H: b8,
  rotr32L: x8,
  rotlSH: S8,
  rotlSL: v8,
  rotlBH: A8,
  rotlBL: E8,
  add: k8,
  add3L: $8,
  add3H: I8,
  add4L: L8,
  add4H: C8,
  add5H: B8,
  add5L: T8
}, [M8, N8] = rt.split([
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
].map((e) => BigInt(e))), gs = new Uint32Array(80), ys = new Uint32Array(80);
class yu extends Ah {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      gs[A] = t.getUint32(n), ys[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = gs[A - 15] | 0, B = ys[A - 15] | 0, X = rt.rotrSH(T, B, 1) ^ rt.rotrSH(T, B, 8) ^ rt.shrSH(T, B, 7), Q = rt.rotrSL(T, B, 1) ^ rt.rotrSL(T, B, 8) ^ rt.shrSL(T, B, 7), oe = gs[A - 2] | 0, Y = ys[A - 2] | 0, m = rt.rotrSH(oe, Y, 19) ^ rt.rotrBH(oe, Y, 61) ^ rt.shrSH(oe, Y, 6), C = rt.rotrSL(oe, Y, 19) ^ rt.rotrBL(oe, Y, 61) ^ rt.shrSL(oe, Y, 6), _ = rt.add4L(Q, C, ys[A - 7], ys[A - 16]), M = rt.add4H(_, X, m, gs[A - 7], gs[A - 16]);
      gs[A] = M | 0, ys[A] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: P } = this;
    for (let A = 0; A < 80; A++) {
      const T = rt.rotrSH(d, w, 14) ^ rt.rotrSH(d, w, 18) ^ rt.rotrBH(d, w, 41), B = rt.rotrSL(d, w, 14) ^ rt.rotrSL(d, w, 18) ^ rt.rotrBL(d, w, 41), X = d & y ^ ~d & x, Q = w & v ^ ~w & L, oe = rt.add5L(P, B, Q, N8[A], ys[A]), Y = rt.add5H(oe, U, T, X, M8[A], gs[A]), m = oe | 0, C = rt.rotrSH(r, s, 28) ^ rt.rotrBH(r, s, 34) ^ rt.rotrBH(r, s, 39), _ = rt.rotrSL(r, s, 28) ^ rt.rotrBL(r, s, 34) ^ rt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, W = s & i ^ s & c ^ i & c;
      U = x | 0, P = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = rt.add(u | 0, h | 0, Y | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = rt.add3L(m, _, W);
      r = rt.add3H(F, Y, C, M), s = F | 0;
    }
    ({ h: r, l: s } = rt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = rt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = rt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = rt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = rt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = rt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = rt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: P } = rt.add(this.Hh | 0, this.Hl | 0, U | 0, P | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, P);
  }
  roundClean() {
    gs.fill(0), ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class _8 extends yu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class P8 extends yu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class U8 extends yu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
xi(() => new yu());
xi(() => new _8());
const O8 = xi(() => new P8());
xi(() => new U8());
function ob(e) {
  if (Vt(e).byteLength != gu)
    throw Error("Invalid signature");
  return {
    type: Le.MessageSignature,
    data: e
  };
}
function Ha(e, t) {
  return { type: Le.Address, version: e, hash160: t };
}
function Gi(e) {
  return wi.c32address(e.version, e.hash160);
}
function ui(e, t, n) {
  const r = t || 1, s = n || j$;
  if (Sb(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Le.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Ih(e) {
  const t = wi.c32addressDecode(e);
  return {
    type: Le.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ce;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ce || (ce = {}));
function H8(e) {
  if (e.type === ce.PrincipalStandard)
    return Gi(e.address);
  if (e.type === ce.PrincipalContract)
    return `${Gi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function sb(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return j8(t, n);
  } else
    return D8(e);
}
function D8(e) {
  const t = Ih(e);
  return { type: ce.PrincipalStandard, address: t };
}
function F8(e) {
  return { type: ce.PrincipalStandard, address: e };
}
function j8(e, t) {
  const n = Ih(e), r = ui(t);
  return ib(n, r);
}
function ib(e, t) {
  if (ba(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ce.PrincipalContract, address: e, contractName: t };
}
function qu(e, t = !1) {
  switch (e.type) {
    case ce.BoolTrue:
      return !0;
    case ce.BoolFalse:
      return !1;
    case ce.Int:
    case ce.UInt:
      return t ? e.value.toString() : e.value;
    case ce.Buffer:
      return `0x${lt(e.buffer)}`;
    case ce.OptionalNone:
      return null;
    case ce.OptionalSome:
      return Gr(e.value);
    case ce.ResponseErr:
      return Gr(e.value);
    case ce.ResponseOk:
      return Gr(e.value);
    case ce.PrincipalStandard:
    case ce.PrincipalContract:
      return H8(e);
    case ce.List:
      return e.list.map((r) => Gr(r));
    case ce.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Gr(e.data[r]);
      }), n;
    case ce.StringASCII:
      return e.data;
    case ce.StringUTF8:
      return e.data;
  }
}
function Gr(e) {
  switch (e.type) {
    case ce.ResponseErr:
      return { type: xs(e), value: qu(e, !0), success: !1 };
    case ce.ResponseOk:
      return { type: xs(e), value: qu(e, !0), success: !0 };
    default:
      return { type: xs(e), value: qu(e, !0) };
  }
}
function xs(e) {
  switch (e.type) {
    case ce.BoolTrue:
    case ce.BoolFalse:
      return "bool";
    case ce.Int:
      return "int";
    case ce.UInt:
      return "uint";
    case ce.Buffer:
      return `(buff ${e.buffer.length})`;
    case ce.OptionalNone:
      return "(optional none)";
    case ce.OptionalSome:
      return `(optional ${xs(e.value)})`;
    case ce.ResponseErr:
      return `(response UnknownType ${xs(e.value)})`;
    case ce.ResponseOk:
      return `(response ${xs(e.value)} UnknownType)`;
    case ce.PrincipalStandard:
    case ce.PrincipalContract:
      return "principal";
    case ce.List:
      return `(list ${e.list.length} ${e.list.length ? xs(e.list[0]) : "UnknownType"})`;
    case ce.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${xs(e.data[t])})`).join(" ")})`;
    case ce.StringASCII:
      return `(string-ascii ${Ym(e.data).length})`;
    case ce.StringUTF8:
      return `(string-utf8 ${ba(e.data).length})`;
  }
}
const ab = () => ({ type: ce.BoolTrue }), cb = () => ({ type: ce.BoolFalse }), R8 = (e) => e ? ab() : cb(), ig = BigInt("0xffffffffffffffffffffffffffffffff"), z8 = BigInt(0), ag = BigInt("0x7fffffffffffffffffffffffffffffff"), cg = BigInt("-170141183460469231731687303715884105728"), G8 = (e) => {
  const t = Yn(e, !0);
  if (t > ag)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${ag}`);
  if (t < cg)
    throw new RangeError(`Cannot construct clarity integer form value less than ${cg}`);
  return { type: ce.Int, value: t };
}, An = (e) => {
  const t = Yn(e, !1);
  if (t < z8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > ig)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ig}`);
  return { type: ce.UInt, value: t };
}, lb = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ce.Buffer, buffer: e };
};
function ub() {
  return { type: ce.OptionalNone };
}
function db(e) {
  return { type: ce.OptionalSome, value: e };
}
function K8(e) {
  return { type: ce.ResponseErr, value: e };
}
function V8(e) {
  return { type: ce.ResponseOk, value: e };
}
function X8(e) {
  return { type: ce.List, list: e };
}
function wr(e) {
  for (const t in e)
    if (!U6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ce.Tuple, data: e };
}
const Et = (e) => ({ type: ce.StringASCII, data: e }), q8 = (e) => ({ type: ce.StringUTF8, data: e });
class fb extends Qm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Gs.hash(t);
    const r = vh(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return Gs.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Gs.exists(this), Gs.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const hb = (e, t, n) => new fb(e, t).update(n).digest();
hb.create = (e, t) => new fb(e, t);
nn.hmacSha256Sync = (e, ...t) => {
  const n = hb.create($h, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ua(e) {
  return {
    type: Le.PublicKey,
    data: Vt(e)
  };
}
function Y8(e, t, n = Wt.Compressed) {
  const r = N$(t.data), s = new pr(Z0(r.r), Z0(r.s)), o = at.fromSignature(e, s, r.recoveryId), i = n === Wt.Compressed;
  return o.toHex(i);
}
function W8(e) {
  return { type: Le.PublicKey, data: e };
}
function xa(e) {
  return !lt(e.data).startsWith("04");
}
function Ml(e) {
  return e.data.slice();
}
function Z8(e) {
  const t = e6(e), n = cc(t.data.slice(0, 32), t.compressed);
  return ua(lt(n));
}
function J8(e) {
  const t = typeof e == "string" ? e : lt(e), n = at.fromHex(t).toHex(!0);
  return ua(n);
}
function Q8(e) {
  const t = typeof e == "string" ? e : lt(e), n = at.fromHex(t).toHex(!1);
  return ua(n);
}
function uf(e) {
  const t = e.readUInt8(), n = t === 4 ? G$ : z$;
  return W8(ln([t, e.readBytes(n)]));
}
function e6(e) {
  const t = _$(e), n = t.length == Wm;
  return { data: t, compressed: n };
}
function t6(e, t) {
  const [n, r] = ql(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = hc(r, 1) + pr.fromHex(n).toCompactHex();
  return ob(o);
}
function n6(e) {
  return Z8(e.data);
}
function r6(e, t, n) {
  return typeof e == "string" && (e = sb(e)), typeof n == "string" && (n = dg(n)), {
    type: Le.Payload,
    payloadType: it.TokenTransfer,
    recipient: e,
    amount: Yn(t, !1),
    memo: n ?? dg("")
  };
}
function o6(e, t, n, r) {
  return typeof e == "string" && (e = Ih(e)), typeof t == "string" && (t = ui(t)), typeof n == "string" && (n = ui(n)), {
    type: Le.Payload,
    payloadType: it.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function lg(e, t, n) {
  return typeof e == "string" && (e = ui(e)), typeof t == "string" && (t = h6(t)), typeof n == "number" ? {
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
function s6() {
  return { type: Le.Payload, payloadType: it.PoisonMicroblock };
}
function ug(e, t) {
  if (e.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
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
function i6(e, t, n) {
  if (e.byteLength != qs)
    throw Error(`Coinbase buffer size must be ${qs} bytes`);
  if (n.byteLength != of)
    throw Error(`VRF proof buffer size must be ${of} bytes`);
  return {
    type: Le.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ce.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var df;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(df || (df = {}));
function a6(e, t, n, r, s, o, i) {
  return {
    type: Le.Payload,
    payloadType: it.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function pb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case it.TokenTransfer:
      t.push(sn(e.recipient)), t.push(Is(e.amount, !1, 8)), t.push(Lo(e.memo));
      break;
    case it.ContractCall:
      t.push(Lo(e.contractAddress)), t.push(Lo(e.contractName)), t.push(Lo(e.functionName));
      const n = new Uint8Array(4);
      li(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(sn(r));
      });
      break;
    case it.SmartContract:
      t.push(Lo(e.contractName)), t.push(Lo(e.codeBody));
      break;
    case it.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Lo(e.contractName)), t.push(Lo(e.codeBody));
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
      t.push(e.coinbaseBytes), t.push(sn(e.recipient ? db(e.recipient) : ub())), t.push(e.vrfProof);
      break;
    case it.TenureChange:
      t.push(Vt(e.tenureHash)), t.push(Vt(e.previousTenureHash)), t.push(Vt(e.burnViewHash)), t.push(Vt(e.previousTenureEnd)), t.push(li(new Uint8Array(4), e.previousTenureBlocks)), t.push(H$(new Uint8Array(1), e.cause)), t.push(Vt(e.publicKeyHash));
      break;
  }
  return ln(t);
}
function c6(e) {
  switch (e.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = Lr(e), r = Yn(e.readBytes(8), !1), s = yb(e);
      return r6(n, r, s);
    case it.ContractCall:
      const o = da(e), i = Ir(e), a = Ir(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = Lr(e);
        c.push(T);
      }
      return o6(o, i, a, c);
    case it.SmartContract:
      const h = Ir(e), d = Ir(e, 4, 1e5);
      return lg(h, d);
    case it.VersionedSmartContract: {
      const A = e.readUInt8Enum(sf, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), T = Ir(e), B = Ir(e, 4, 1e5);
      return lg(T, B, A);
    }
    case it.PoisonMicroblock:
      return s6();
    case it.Coinbase: {
      const A = e.readBytes(qs);
      return ug(A);
    }
    case it.CoinbaseToAltRecipient: {
      const A = e.readBytes(qs), T = Lr(e);
      return ug(A, T);
    }
    case it.NakamotoCoinbase: {
      const A = e.readBytes(qs), T = Lr(e), B = e.readBytes(of);
      return i6(A, T, B);
    }
    case it.TenureChange:
      const w = lt(e.readBytes(20)), y = lt(e.readBytes(20)), v = lt(e.readBytes(20)), x = lt(e.readBytes(32)), L = e.readUInt32BE(), U = e.readUInt8Enum(df, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), P = lt(e.readBytes(20));
      return a6(w, y, v, x, L, U, P);
  }
}
class wu extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ds extends wu {
  constructor(t) {
    super(t);
  }
}
class hr extends wu {
  constructor(t) {
    super(t);
  }
}
class Nl extends wu {
  constructor(t) {
    super(t);
  }
}
class Ks extends wu {
  constructor(t) {
    super(t);
  }
}
var Kr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Kr || (Kr = {}));
function ff(e) {
  return ob(lt(e.readBytes(gu)));
}
function Ki(e, t) {
  return {
    pubKeyEncoding: e,
    type: Le.TransactionAuthField,
    contents: t
  };
}
function l6(e) {
  const t = e.readUInt8Enum(Kr, (n) => {
    throw new hr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Kr.PublicKeyCompressed:
      return Ki(Wt.Compressed, uf(e));
    case Kr.PublicKeyUncompressed:
      return Ki(Wt.Uncompressed, Q8(uf(e).data));
    case Kr.SignatureCompressed:
      return Ki(Wt.Compressed, ff(e));
    case Kr.SignatureUncompressed:
      return Ki(Wt.Uncompressed, ff(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Lh(e) {
  return Vt(e.data);
}
function u6(e) {
  const t = [];
  switch (e.contents.type) {
    case Le.PublicKey:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Kr.PublicKeyCompressed : Kr.PublicKeyUncompressed), t.push(Ml(J8(e.contents.data)));
      break;
    case Le.MessageSignature:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Kr.SignatureCompressed : Kr.SignatureUncompressed), t.push(Lh(e.contents));
      break;
  }
  return ln(t);
}
function Lo(e) {
  switch (e.type) {
    case Le.Address:
      return pc(e);
    case Le.Principal:
      return gb(e);
    case Le.LengthPrefixedString:
      return fa(e);
    case Le.MemoString:
      return p6(e);
    case Le.AssetInfo:
      return wb(e);
    case Le.PostCondition:
      return g6(e);
    case Le.PublicKey:
      return Ml(e);
    case Le.LengthPrefixedList:
      return Bh(e);
    case Le.Payload:
      return pb(e);
    case Le.TransactionAuthField:
      return u6(e);
    case Le.MessageSignature:
      return Lh(e);
  }
}
function d6() {
  return {
    type: Le.Address,
    version: Bl.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ch(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Ht.SerializeP2PKH || t === Ht.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Ht.SerializeP2WPKH || t === Ht.SerializeP2WSH || t === Ht.SerializeP2WSHNonSequential) && !r.every(xa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Ht.SerializeP2PKH:
      return Ha(e, M6(r[0].data));
    case Ht.SerializeP2WPKH:
      return Ha(e, N6(r[0].data));
    case Ht.SerializeP2SH:
    case Ht.SerializeP2SHNonSequential:
      return Ha(e, _6(n, r.map(Ml)));
    case Ht.SerializeP2WSH:
    case Ht.SerializeP2WSHNonSequential:
      return Ha(e, P6(n, r.map(Ml)));
  }
}
function pc(e) {
  const t = [];
  return t.push(Vt(hc(e.version, 1))), t.push(Vt(e.hash160)), ln(t);
}
function da(e) {
  const t = hu(lt(e.readBytes(1))), n = lt(e.readBytes(20));
  return { type: Le.Address, version: t, hash160: n };
}
function gb(e) {
  const t = [];
  return t.push(e.prefix), t.push(pc(e.address)), e.prefix === tc.Contract && t.push(fa(e.contractName)), ln(t);
}
function f6(e) {
  const t = e.readUInt8Enum(tc, (s) => {
    throw new hr(`Unexpected Principal payload type: ${s}`);
  }), n = da(e);
  if (t === tc.Standard)
    return { type: Le.Principal, prefix: t, address: n };
  const r = Ir(e);
  return {
    type: Le.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function fa(e) {
  const t = [], n = ba(e.content), r = n.byteLength;
  return t.push(Vt(hc(r, e.lengthPrefixBytes))), t.push(n), ln(t);
}
function Ir(e, t, n) {
  t = t || 1;
  const r = hu(lt(e.readBytes(t))), s = Sh(e.readBytes(r));
  return ui(s, t, n ?? 128);
}
function h6(e) {
  return ui(e, 4, 1e5);
}
function dg(e) {
  if (e && Sb(e, Cl))
    throw new Error(`Memo exceeds maximum length of ${Cl} bytes`);
  return { type: Le.MemoString, content: e };
}
function p6(e) {
  const t = [], n = ba(e.content), r = B6(lt(n), Cl * 2);
  return t.push(Vt(r)), ln(t);
}
function yb(e) {
  let t = Sh(e.readBytes(Cl));
  return t = t.replace(/\u0000*$/, ""), { type: Le.MemoString, content: t };
}
function wb(e) {
  const t = [];
  return t.push(pc(e.address)), t.push(fa(e.contractName)), t.push(fa(e.assetName)), ln(t);
}
function hf(e) {
  return {
    type: Le.AssetInfo,
    address: da(e),
    contractName: Ir(e),
    assetName: Ir(e)
  };
}
function Th(e, t) {
  return {
    type: Le.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Bh(e) {
  const t = e.values, n = [];
  n.push(Vt(hc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Lo(r));
  return ln(n);
}
function mb(e, t, n) {
  const r = hu(lt(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case Le.Address:
        s.push(da(e));
        break;
      case Le.LengthPrefixedString:
        s.push(Ir(e));
        break;
      case Le.MemoString:
        s.push(yb(e));
        break;
      case Le.AssetInfo:
        s.push(hf(e));
        break;
      case Le.PostCondition:
        s.push(y6(e));
        break;
      case Le.PublicKey:
        s.push(uf(e));
        break;
      case Le.TransactionAuthField:
        s.push(l6(e));
        break;
    }
  return Th(s, n);
}
function g6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(gb(e.principal)), (e.conditionType === er.Fungible || e.conditionType === er.NonFungible) && t.push(wb(e.assetInfo)), e.conditionType === er.NonFungible && t.push(sn(e.assetName)), t.push(e.conditionCode), e.conditionType === er.STX || e.conditionType === er.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ds("The post-condition amount may not be larger than 8 bytes");
    t.push(Is(e.amount, !1, 8));
  }
  return ln(t);
}
function y6(e) {
  const t = e.readUInt8Enum(er, (i) => {
    throw new hr(`Could not read ${i} as PostConditionType`);
  }), n = f6(e);
  let r, s, o;
  switch (t) {
    case er.STX:
      return r = e.readUInt8Enum(ec, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: er.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case er.Fungible:
      return s = hf(e), r = e.readUInt8Enum(ec, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: er.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case er.NonFungible:
      s = hf(e);
      const i = Lr(e);
      return r = e.readUInt8Enum(af, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Le.PostCondition,
        conditionType: er.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function yo(e, t) {
  return ln([e, t]);
}
function w6(e) {
  return new Uint8Array([e.type]);
}
function m6(e) {
  return e.type === ce.OptionalNone ? new Uint8Array([e.type]) : yo(e.type, sn(e.value));
}
function b6(e) {
  const t = new Uint8Array(4);
  return li(t, e.buffer.length, 0), yo(e.type, pu(t, e.buffer));
}
function x6(e) {
  const t = xh(I$(e.value, BigInt(R$)), Zm);
  return yo(e.type, t);
}
function S6(e) {
  const t = xh(e.value, Zm);
  return yo(e.type, t);
}
function v6(e) {
  return yo(e.type, pc(e.address));
}
function A6(e) {
  return yo(e.type, pu(pc(e.address), fa(e.contractName)));
}
function E6(e) {
  return yo(e.type, sn(e.value));
}
function k6(e) {
  const t = [], n = new Uint8Array(4);
  li(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = sn(r);
    t.push(s);
  }
  return yo(e.type, ln(t));
}
function $6(e) {
  const t = [], n = new Uint8Array(4);
  li(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ui(s);
    t.push(fa(o));
    const i = sn(e.data[s]);
    t.push(i);
  }
  return yo(e.type, ln(t));
}
function bb(e, t) {
  const n = [], r = t == "ascii" ? Ym(e.data) : ba(e.data), s = new Uint8Array(4);
  return li(s, r.length, 0), n.push(s), n.push(r), yo(e.type, ln(n));
}
function I6(e) {
  return bb(e, "ascii");
}
function L6(e) {
  return bb(e, "utf8");
}
function sn(e) {
  switch (e.type) {
    case ce.BoolTrue:
    case ce.BoolFalse:
      return w6(e);
    case ce.OptionalNone:
    case ce.OptionalSome:
      return m6(e);
    case ce.Buffer:
      return b6(e);
    case ce.UInt:
      return S6(e);
    case ce.Int:
      return x6(e);
    case ce.PrincipalStandard:
      return v6(e);
    case ce.PrincipalContract:
      return A6(e);
    case ce.ResponseOk:
    case ce.ResponseErr:
      return E6(e);
    case ce.List:
      return k6(e);
    case ce.Tuple:
      return $6(e);
    case ce.StringASCII:
      return I6(e);
    case ce.StringUTF8:
      return L6(e);
    default:
      throw new Ds("Unable to serialize. Invalid Clarity Value.");
  }
}
function C6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const fg = /* @__PURE__ */ new Map();
function xb(e, t) {
  const n = fg.get(e);
  if (n !== void 0)
    return n(t);
  const r = C6(e);
  return fg.set(e, r), xb(e, t);
}
class Ga {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return D$(this.readBytes(4), 0);
  }
  readUInt8() {
    return O$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return P$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = lt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = lt(n);
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
    if (xb(t, r))
      return r;
    throw n(r);
  }
}
function Lr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Ga(Vt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Ga(e) : t = e;
  switch (t.readUInt8Enum(ce, (r) => {
    throw new hr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ce.Int:
      return G8(t.readBytes(16));
    case ce.UInt:
      return An(t.readBytes(16));
    case ce.Buffer:
      const r = t.readUInt32BE();
      return lb(t.readBytes(r));
    case ce.BoolTrue:
      return ab();
    case ce.BoolFalse:
      return cb();
    case ce.PrincipalStandard:
      const s = da(t);
      return F8(s);
    case ce.PrincipalContract:
      const o = da(t), i = Ir(t);
      return ib(o, i);
    case ce.ResponseOk:
      return V8(Lr(t));
    case ce.ResponseErr:
      return K8(Lr(t));
    case ce.OptionalNone:
      return ub();
    case ce.OptionalSome:
      return db(Lr(t));
    case ce.List:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Lr(t));
      return X8(c);
    case ce.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = Ir(t).content;
        if (L === void 0)
          throw new hr('"content" is undefined');
        h[L] = Lr(t);
      }
      return wr(h);
    case ce.StringASCII:
      const d = t.readUInt32BE(), w = B$(t.readBytes(d));
      return Et(w);
    case ce.StringUTF8:
      const y = t.readUInt32BE(), v = Sh(t.readBytes(y));
      return q8(v);
    default:
      throw new hr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const T6 = (e) => e.length % 2 == 0 ? e : `0${e}`, B6 = (e, t) => e.padEnd(t, "0"), Sb = (e, t) => e ? ba(e).length > t : !1;
function pf(e) {
  return Fw(e);
}
const nc = (e) => i8($h(e)), Mh = (e) => lt(O8(e)), M6 = (e) => lt(nc(e)), N6 = (e) => {
  const t = nc(e), n = pu(new Uint8Array([0]), new Uint8Array([t.length]), t), r = nc(n);
  return lt(r);
}, _6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = nc(r);
  return lt(s);
}, P6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = ln(n), s = $h(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = ln(o), a = nc(i);
  return lt(a);
};
function U6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function vb(e) {
  const t = sn(e);
  return `0x${lt(t)}`;
}
function O6(e) {
  return Lr(e);
}
const Yi = (e) => {
  try {
    return wi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Nh() {
  return {
    type: Le.MessageSignature,
    data: lt(new Uint8Array(gu))
  };
}
function Ab(e, t, n, r) {
  const s = Ch(0, e, 1, [ua(t)]).hash160, o = xa(ua(t)) ? Wt.Compressed : Wt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Yn(n, !1),
    fee: Yn(r, !1),
    keyEncoding: o,
    signature: Nh()
  };
}
function rc(e) {
  return "signature" in e;
}
function hg(e) {
  return e === Ht.SerializeP2SH || e === Ht.SerializeP2WSH;
}
function H6(e) {
  return e === Ht.SerializeP2SHNonSequential || e === Ht.SerializeP2WSHNonSequential;
}
function pg(e) {
  const t = pf(e);
  return t.nonce = 0, t.fee = 0, rc(t) ? t.signature = Nh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function D6(e) {
  const t = [
    e.hashMode,
    Vt(e.signer),
    Is(e.nonce, !1, 8),
    Is(e.fee, !1, 8),
    e.keyEncoding,
    Lh(e.signature)
  ];
  return ln(t);
}
function F6(e) {
  const t = [
    e.hashMode,
    Vt(e.signer),
    Is(e.nonce, !1, 8),
    Is(e.fee, !1, 8)
  ], n = Th(e.fields);
  t.push(Bh(n));
  const r = new Uint8Array(2);
  return U$(r, e.signaturesRequired, 0), t.push(r), ln(t);
}
function j6(e, t) {
  const n = lt(t.readBytes(20)), r = BigInt(`0x${lt(t.readBytes(8))}`), s = BigInt(`0x${lt(t.readBytes(8))}`), o = t.readUInt8Enum(Wt, (a) => {
    throw new hr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Ht.SerializeP2WPKH && o != Wt.Compressed)
    throw new hr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = ff(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function R6(e, t) {
  const n = lt(t.readBytes(20)), r = BigInt("0x" + lt(t.readBytes(8))), s = BigInt("0x" + lt(t.readBytes(8))), o = mb(t, Le.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case Le.PublicKey:
        xa(u.contents) || (i = !0);
        break;
      case Le.MessageSignature:
        if (u.pubKeyEncoding === Wt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Ks("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Ht.SerializeP2WSH || e === Ht.SerializeP2WSHNonSequential))
    throw new Ks("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Yu(e) {
  return rc(e) ? D6(e) : F6(e);
}
function Wu(e) {
  const t = e.readUInt8Enum(Ht, (n) => {
    throw new hr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Ht.SerializeP2PKH || t === Ht.SerializeP2WPKH ? j6(t, e) : R6(t, e);
}
function Eb(e, t, n, r) {
  const o = e + lt(new Uint8Array([t])) + lt(Is(n, !1, 8)) + lt(Is(r, !1, 8));
  if (Vt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Mh(Vt(o));
}
function kb(e, t, n) {
  const r = 33 + gu, s = xa(t) ? Wt.Compressed : Wt.Uncompressed, o = e + T6(s.toString(16)) + n.data, i = Vt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Mh(i);
}
function z6(e, t, n, r, s) {
  const o = Eb(e, t, n, r), i = t6(s, o), a = n6(s), c = kb(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function $b(e, t, n, r, s, o) {
  const i = Eb(e, t, n, r), a = ua(Y8(i, o, s)), c = kb(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function G6() {
  const e = Ab(Ht.SerializeP2PKH, "", 0, 0);
  return e.signer = d6().hash160, e.keyEncoding = Wt.Compressed, e.signature = Nh(), e;
}
function gg(e, t, n) {
  return rc(e) ? K6(e, t, n) : V6(e, t, n);
}
function K6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = $b(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = Ch(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Ks(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function V6(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Le.PublicKey:
        xa(c.contents) || (o = !0), r.push(c.contents);
        break;
      case Le.MessageSignature:
        c.pubKeyEncoding === Wt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = $b(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (hg(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Ks("Too many signatures");
        break;
    }
  if (hg(e.hashMode) && i !== e.signaturesRequired || H6(e.hashMode) && i < e.signaturesRequired)
    throw new Ks("Incorrect number of signatures");
  if (o && (e.hashMode === Ht.SerializeP2WSH || e.hashMode === Ht.SerializeP2WSHNonSequential))
    throw new Ks("Uncompressed keys are not allowed in this hash mode");
  const a = Ch(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Ks(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Ib(e) {
  return {
    authType: tn.Standard,
    spendingCondition: e
  };
}
function Lb(e, t) {
  return {
    authType: tn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Ab(Ht.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function yg(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case tn.Standard:
        return Ib(pg(e.spendingCondition));
      case tn.Sponsored:
        return Lb(pg(e.spendingCondition), G6());
      default:
        throw new Nl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function X6(e, t) {
  switch (e.authType) {
    case tn.Standard:
      return gg(e.spendingCondition, t, tn.Standard);
    case tn.Sponsored:
      return gg(e.spendingCondition, t, tn.Standard);
    default:
      throw new Nl("Invalid origin auth type");
  }
}
function q6(e, t) {
  switch (e.authType) {
    case tn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Yn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case tn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Yn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Y6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Yn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function W6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Yn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Z6(e, t) {
  const n = {
    ...t,
    nonce: Yn(t.nonce, !1),
    fee: Yn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function J6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case tn.Standard:
      t.push(Yu(e.spendingCondition));
      break;
    case tn.Sponsored:
      t.push(Yu(e.spendingCondition)), t.push(Yu(e.sponsorSpendingCondition));
      break;
  }
  return ln(t);
}
function Q6(e) {
  const t = e.readUInt8Enum(tn, (r) => {
    throw new hr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case tn.Standard:
      return n = Wu(e), Ib(n);
    case tn.Sponsored:
      n = Wu(e);
      const r = Wu(e);
      return Lb(n, r);
  }
}
class e5 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Yn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? F$, this.postConditionMode = o ?? la.Deny, this.postConditions = s ?? Th([]), i)
      this.anchorMode = K$(i);
    else
      switch (r.payloadType) {
        case it.Coinbase:
        case it.CoinbaseToAltRecipient:
        case it.NakamotoCoinbase:
        case it.PoisonMicroblock:
        case it.TenureChange:
          this.anchorMode = Qn.OnChainOnly;
          break;
        case it.ContractCall:
        case it.SmartContract:
        case it.VersionedSmartContract:
        case it.TokenTransfer:
          this.anchorMode = Qn.Any;
          break;
      }
  }
  signBegin() {
    const t = pf(this);
    return t.auth = yg(t.auth), t.txid();
  }
  verifyBegin() {
    const t = pf(this);
    return t.auth = yg(t.auth), t.txid();
  }
  verifyOrigin() {
    return X6(this.auth, this.verifyBegin());
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
    if (n && !rc(n)) {
      const r = xa(t);
      n.fields.push(Ki(r ? Wt.Compressed : Wt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = z6(n, r, t.fee, t.nonce, s);
    return rc(t) ? t.signature = o : t.fields.push(Ki(s.data.byteLength === Wm ? Wt.Compressed : Wt.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return Mh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new Nl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Z6(this.auth, t);
  }
  setFee(t) {
    this.auth = q6(this.auth, t);
  }
  setNonce(t) {
    this.auth = Y6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new Nl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ds('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ds('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ds('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ds('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ds('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return li(n, this.chainId, 0), t.push(n), t.push(J6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Bh(this.postConditions)), t.push(pb(this.payload)), ln(t);
  }
}
function Vi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Ga(Vt(e.slice(2))) : t = new Ga(Vt(e)) : e instanceof Uint8Array ? t = new Ga(e) : t = e;
  const n = t.readUInt8Enum(Tl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = Q6(t), o = t.readUInt8Enum(Qn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(la, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = mb(t, Le.PostCondition), c = c6(t);
  return new e5(n, s, c, a, i, o, r);
}
const t5 = R8, Ka = An, n5 = lb;
const r5 = /* @__PURE__ */ new Set([4001, -31001]), o5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], s5 = ["result", "data", "payload", "response", "params"], wg = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], mu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Si = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, Mo = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, i5 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Cb = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => i5(o, r)) === s
  );
}, Tb = (e) => e ? Cb(Si()).some(
  (t) => {
    var n;
    return t.id === e && (mu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Bb = () => {
  if (typeof window > "u")
    return;
  const e = Si(), t = Cb(e).filter(
    (n) => {
      var r;
      return mu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = Mo(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of o5) {
    const r = Mo(e, n) ?? (e === window ? void 0 : Mo(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, a5 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Si(), n = Mo(t, e) ?? (t === window ? void 0 : Mo(window, e)) ?? ou(e);
  if (n)
    return n;
  if (mu(e) || Tb(e))
    return Bb();
}, Kc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, c5 = ["blockstack-session", "blockstack"], l5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of c5) {
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
l5();
const Mb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, dr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, u5 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = Mb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, d5 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = Mb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, gf = (e, t = "mainnet") => {
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
      return gf(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return gf(r, t);
  }
  return t;
}, Ys = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, oc = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return Yi(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = oc(s, t + 1);
      if (o)
        return o;
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
  for (const s of r) {
    if (!(s in n))
      continue;
    const o = oc(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && Yi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Yi(n.testnet) ? n.testnet.trim() : null;
}, mg = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Nb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && r5.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, di = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = dr(n == null ? void 0 : n.message) ?? dr(t.message) ?? dr(t.error) ?? dr(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, ha = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw di(t);
    if (t.status === "error")
      throw di(t.result ?? t);
  }
  return e;
}, bg = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return ha(r);
  } catch (r) {
    throw di(r);
  }
}, _b = () => Bb(), _h = () => {
  if (typeof window > "u")
    return;
  const e = Si();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Mo(e, t) ?? (e === window ? void 0 : Mo(window, t));
    if (n)
      return n;
  }
}, xg = () => {
  if (typeof window > "u")
    return;
  const e = _h();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Si();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Mo(t, n) ?? (t === window ? void 0 : Mo(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, al = (e) => {
  var r, s;
  const t = ni();
  if (mu(t) || Tb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Si() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === _b();
}, Zu = (e) => {
  const t = d5(e);
  if (!t)
    return null;
  try {
    const n = Vi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, _l = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Zu(e), r = u5(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? dr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = _l(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let o = null;
  for (const a of wg)
    if (Zu(s[a])) {
      o = dr(s[a]);
      break;
    }
  const i = dr(s.txId) || dr(s.txid) || dr(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? dr(s.txRaw) ?? void 0
    };
  for (const a of wg) {
    const c = Zu(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: dr(s[a]) ?? void 0
      };
  }
  for (const a of s5) {
    const c = s[a], u = _l(c, t + 1);
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
}, Ju = (e) => {
  const t = _l(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, f5 = (e) => {
  const t = _l(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, h5 = (e) => ({
  ...e,
  fee: Ys(e.fee),
  nonce: Ys(e.nonce),
  sponsored: e.sponsored === !0
}), Sg = (e) => ({
  recipient: e.recipient,
  amount: Ys(e.amount) ?? "0",
  memo: e.memo,
  network: gf(e.network),
  address: e.stxAddress,
  fee: Ys(e.fee),
  nonce: Ys(e.nonce),
  sponsored: e.sponsored ?? !1
}), Pb = "WALLET_ADDRESS_MISMATCH", p5 = 45e3;
let Va = null;
const yf = (e) => {
  e && (Va = { address: e, at: Date.now() });
}, g5 = () => {
  Va = null;
}, y5 = () => Va && Date.now() - Va.at <= p5 ? Va.address : null, w5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, m5 = async (e) => {
  g5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = ha(await e.request("wallet_connect")), n = oc(t);
  return yf(n), n;
}, b5 = async (e, t, n, r) => {
  try {
    return ha(await e.request(t, n));
  } catch (s) {
    const o = di(s);
    if (!w5(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await m5(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), o;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : o.message
        ),
        { code: i ? Pb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return ha(await e.request(t, n));
    } catch (a) {
      throw di(a);
    }
  }
};
let vg = 3e4;
const x5 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${vg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, vg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, S5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Pb }
      );
    return c;
  }, s = y5();
  if (s)
    return Kc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  Kc(n, "account-read");
  try {
    const c = ha(
      await x5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = oc(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Nb(c))
      throw di(c);
    Kc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return yf(o), r(o, "wallet_getAccount");
  let i;
  Kc(n, "account-reconnect");
  try {
    i = ha(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), di(c);
  }
  const a = oc(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return yf(a), r(a, "wallet_connect");
}, v5 = async (e, t) => {
  if (!al(e)) {
    const o = await bg(
      e,
      "stx_transferStx",
      Sg(t)
    );
    return Ju(o);
  }
  const n = _h();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await bg(
      n,
      "stx_transferStx",
      Sg(t)
    );
    return Ju(o);
  }
  const r = _b();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await S5(r, t.stxAddress);
  const s = await b5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Ys(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Ys(t.fee) } : {}
    },
    t.stxAddress
  );
  return Ju(s);
}, A5 = () => ni(), Ub = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = ni(), t = e ? a5(e) : void 0;
  if (t)
    return t;
  const n = Si() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Ag = (e, t) => {
  const n = Ub(), r = h5({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, f5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return jc(r, t);
  if (al(n) && !_h()) {
    const s = xg();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ni(),
        route: "legacy-transaction-request"
      }), jc(r, s);
  }
  return void v5(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (mg(s) && al(n)) {
      const a = xg();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ni(),
          route: "legacy-transaction-request"
        }), jc(r, a);
        return;
      }
    }
    if (mg(s) && !al(n)) {
      jc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Nb(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, E5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), Eg = (e) => vb(e).replace(/^0x/, ""), kg = "This wallet cannot sign messages. Try Xverse or Leather.", $g = (e) => typeof (e == null ? void 0 : e.request) == "function", Ig = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", k5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, $5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function I5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: Eg(t.message),
    domain: Eg(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function L5(e, t) {
  const n = await x$({
    domain: t.domain,
    message: t.message,
    network: fu(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? E5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Qu(e) {
  var s, o;
  const t = A5() || "", n = /xverse/i.test(t);
  let r = Ub();
  if (n && !Ig(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Ig(r))
    try {
      return await L5(r, e);
    } catch (i) {
      if (n || !$g(r) || !$5(i)) throw i;
    }
  if (!n && $g(r))
    try {
      return await I5(r, e);
    } catch (i) {
      throw k5(i) ? new Error(kg) : i;
    }
  throw new Error(kg);
}
const Lg = 1000000n, To = 1000000n, Pl = 50n, an = 3000n, Wr = 300n, Ba = 3000n, C5 = 50000n, T5 = 300n, B5 = 200n, bu = 15000n, Hn = (e) => e + Pl;
function jr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / Lg}.${(n % Lg).toString().padStart(6, "0")}`;
}
function Cg(e, t = Wr) {
  return e <= an ? 0 : Number((e - an) / Hn(t));
}
function ed(e, t = 0n) {
  const n = To - e - t;
  return n > 0n ? n : 0n;
}
function M5(e, t = Wr) {
  return e > To ? "over" : e < an + Hn(t) ? "empty" : e < C5 ? "low" : "ok";
}
const N5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", _5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", P5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function U5(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || P5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== N5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ob = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", td = 3, O5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", H5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", Tg = 1, [wf, Hb] = Ob.split("."), Er = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function mf(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function D5(e) {
  return Er(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function ks(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Db(e, t = []) {
  const n = await ks(`/v2/contracts/call-read/${wf}/${Hb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: wf, arguments: t.map((r) => "0x" + Er(sn(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Gr(Lr(n.result));
}
async function F5() {
  const e = await ks(`/v2/contracts/source/${wf}/${Hb}?proof=0`);
  if (typeof e.source != "string" || await D5(e.source) !== _5) throw Error("Deployed source does not match the tested helper.");
  if (U5(await Db("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Fb(e) {
  return e.startsWith("SP") && Yi(e) && !e.includes(".");
}
async function j5(e) {
  var r;
  if (!Fb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await ks(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await ks(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function R5(e) {
  const t = await ks(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function z5(e, t) {
  var s, o;
  const n = await Db("get-owner", [Ka(e), Ka(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Fb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function G5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: mf(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const s = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(s, { feeRejected: !0 }), s;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function K5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function V5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Vi(mf(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Gi(Ha(Bl.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || Gi(r.contractAddress) + "." + r.contractName.content !== Ob || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Er(sn(r.functionArgs[0])) !== Er(sn(Ka(e.core))) || Er(sn(r.functionArgs[1])) !== Er(sn(Ka(e.song))) || Er(sn(r.functionArgs[2])) !== Er(sn(n5(mf(e.id)))) || e.amount !== "50" || t.postConditionMode !== la.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== ec.Equal || o.principal.prefix !== 2 || Gi(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Gi(r.contractAddress) + "." + r.contractName.content !== O5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Er(sn(r.functionArgs[0])) !== Er(sn(Ka(e.song))) || typeof e.liked != "boolean" || Er(sn(r.functionArgs[1])) !== Er(sn(t5(e.liked))) || e.amount !== "0" || t.postConditionMode !== la.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Gr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const X5 = "xtrata.xyz/radio/listening-wallet", q5 = "Link a temporary listening wallet for pay-per-play; no spending permission", ao = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Yi(e), Y5 = (e) => ({
  domain: wr({ name: Et(X5), version: Et("1"), "chain-id": An(1) }),
  message: wr({
    purpose: Et(q5),
    main: Et(e.main),
    listening: Et(e.listening),
    issued: An(e.issued)
  })
}), jb = 100000n, W5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Z5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !ao(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= jb).sort(W5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Vc = 50;
function Ul(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), o = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(o)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: o });
  }
  return { total: t.total, transfers: n };
}
async function J5(e, t, n = 4) {
  if (!ao(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Vc}&offset=${i}`, s = Ul(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - Vc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= Vc ? s : Ul(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = Z5(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - Vc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const $o = 50, Q5 = 6, eI = 20, Bg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Mg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const o of n.results) {
    const i = o && typeof o == "object" && o.tx && typeof o.tx == "object" ? o.tx : o;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (s.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), u = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: s };
}
async function tI(e, t, n) {
  if (!ao(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${$o}&offset=0`));
    if (!s || s.total > Q5 * $o) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = $o; i < s.total; i += $o) {
      const a = Ul(await t(`/extended/v1/address/${e}/stx_inbound?limit=${$o}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${$o}&offset=${u}`, a = Mg(await t(i(0)), e);
      if (!a || a.total > eI * $o) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) o.set(u.txId, u);
      for (let u = $o; u < a.total; u += $o) {
        const h = Mg(await t(i(u)), e);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) c.add(d);
        for (const d of h.sent) o.set(d.txId, d);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...o.values()] };
  } catch {
    return { ok: !1 };
  }
}
function nI(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(Bg).map((d, w) => {
    const y = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: y, kind: "gift", to: r.payer, at: w } : ao(d.sender) && y >= jb ? { sender: d.sender, left: y, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: y, kind: "dust", to: null, at: w };
  }), o = s.reduce((d, w) => d + w.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && ao(d.recipient) && d.amount > 0n).sort(Bg), a = i.reduce((d, w) => d + w.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, w) => {
    let y = w;
    for (const v of d) {
      if (y <= 0n) break;
      const x = v.left < y ? v.left : y;
      v.left -= x, y -= x;
    }
    return y;
  };
  for (const d of i) {
    const w = u(s.filter((y) => y.to === d.recipient), d.amount);
    w > 0n && u(s, w);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((d, w) => d + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of s) {
    if (d.left <= 0n) continue;
    const w = `${d.kind}:${d.to ?? ""}`, y = h.get(w);
    y ? (y.amount += d.left, y.newest = Math.max(y.newest, d.at)) : h.set(w, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, w) => d.newest - w.newest),
    hasTopUp: s.some((d) => d.kind === "deposit")
  };
}
function rI(e, t) {
  const n = e.filter((u) => u.kind === "deposit").sort((u, h) => u.newest - h.newest), r = e.find((u) => u.kind === "gift"), s = e.filter((u) => u.kind === "dust"), o = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, h) => u + h.amount, 0n), i = [], a = [], c = o > t;
  return n.forEach((u, h) => {
    if (u.amount <= t) {
      a.push(u);
      return;
    }
    const d = h === n.length - 1 && !c;
    i.push({ to: u.to, kind: "deposit", mode: d ? "all" : "amount", send: u.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: o - t }) : (r && a.push(r), a.push(...s)), { steps: i, tooSmall: a };
}
function Ng(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Xc = 1500n, cl = [100, 250, 500], oI = (e, t) => BigInt(e) * Hn(t), Ma = ["prepared", "signed", "unknown", "pending"], sI = 30 * 6e4, Ol = 6e4, Pi = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, iI = 3e3, Hl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", nd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function aI(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, w = !1, y = null, v = !1, x = "", L = "", U = 0, P, A = null, T, B = [], X, Q = -1 / 0;
  const oe = /* @__PURE__ */ new Set();
  let Y = null, m = !1, C = 0, _ = null, M = null, W = !1, F = null, we = !1, le = null, Ke = !1, I = !1, R = !1, de = !1, be = !1, Ne = 0, Ae = null, wt = Promise.resolve();
  const je = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Wr.toString()), Be = (b) => !!o && !(o.features ?? []).includes(b), _e = (b, k) => `xtrata.ppp.v1.${b}:${k}`, Bn = "xtrata.ppp.v1.as-main", En = () => {
    if (e.main()) return;
    const b = e.store.get(Bn);
    return b && ao(b) ? b : void 0;
  }, ht = () => e.main() ?? En(), Bt = (b = o == null ? void 0 : o.address) => {
    if (!b) return [];
    try {
      const k = JSON.parse(e.store.get(_e("entries", b)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, Pt = (b) => {
    const k = [b, ...Bt(b.address).filter((G) => !(G.txid === b.txid && G.kind === b.kind))].slice(0, 200);
    e.store.set(_e("entries", b.address), JSON.stringify(k));
  }, z = (b = o == null ? void 0 : o.address) => !!b && e.store.get(_e("on", b)) !== "0", O = (b) => {
    o != null && o.address && e.store.set(_e("on", o.address), b ? "1" : "0");
  }, te = () => Bt().filter((b) => Ma.includes(b.status)), re = () => Xe() ? [...te(), ...Bt(qe()).filter((b) => Ma.includes(b.status))] : te(), ue = () => bt(o == null ? void 0 : o.address), bt = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(_e("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, He = (b, k = o == null ? void 0 : o.address) => {
    k && e.store.set(_e("deposit", k), JSON.stringify(b));
  };
  let ze = null;
  const vt = (b = Ol) => {
    const k = e.now();
    ze = { since: ze && k < ze.until ? ze.since : k, until: Math.max((ze == null ? void 0 : ze.until) ?? 0, k + b) };
  }, De = () => !!ze && e.now() < ze.until && (i === void 0 || i < an + Hn(je())), Ie = () => !!ue() || De(), qe = () => Be("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), Xe = () => !!(o != null && o.address) && qe() !== o.address, Ye = () => Xe() ? c && c.for === qe() ? c.value : void 0 : i, Rt = () => Be("likeFee") ? B5 : T5, pn = (b) => b !== void 0 && b < an + Rt(), dn = () => te().filter((b) => e.now() - b.created > sI && oe.has(b.txid)), Wn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!ht() || r === ht() && !t.allowed), Ut = () => Wn() && !(o != null && o.linked), gn = () => {
    const b = ht();
    return !Ut() && !!b && !!(o != null && o.linked) && o.linked !== b;
  }, mr = (b) => _e("return-to", b), Zr = (b = o == null ? void 0 : o.address) => {
    if (!b) return;
    const k = e.store.get(mr(b));
    return k && ao(k) && k !== b ? k : void 0;
  }, Fn = (b = o == null ? void 0 : o.address) => Y && Y.for === b ? Y.res : null;
  function br() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const b = Zr();
    if (b) return { to: b, kind: "chosen" };
    const k = Fn();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const yn = (b) => _e("gift", b);
  function Dt() {
    const b = o == null ? void 0 : o.address;
    if (!b) return null;
    if ((F == null ? void 0 : F.for) === b) return F.info;
    try {
      const k = JSON.parse(e.store.get(yn(b)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const dt = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let Ct = null, un = null, Cr = !1;
  const wo = (b) => _e("award-claim", b), E = (b) => _e("award-send", b), H = (b) => {
    try {
      const k = JSON.parse(e.store.get(E(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, V = (b) => {
    try {
      const k = JSON.parse(e.store.get(wo(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(b = !1) {
    var ke;
    const k = dt();
    if (!k || !e.awardStatus || Cr) return;
    const G = (Ct == null ? void 0 : Ct.for) === k ? Ct : null, ee = G == null ? void 0 : G.view.state, Ce = ee === "not-a-player" && ((ke = Dt()) == null ? void 0 : ke.drop) === "players", q = G ? Ce ? 2e4 : ee === "off" || ee === "not-a-player" ? 30 * 6e4 : V(k) || H(k) ? 2e4 : ee === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(G && !b && e.now() - G.at < q)) {
      Cr = !0;
      try {
        const Se = await e.awardStatus(k);
        if (Ct = { for: k, view: Se, at: e.now() }, Se.state === "claimed" && e.store.set(wo(k), ""), Se.state === "claimed" && Se.holds === !1 && e.store.set(E(k), ""), Se.state === "ready" && e.awardName && (un == null ? void 0 : un.for) !== k)
          try {
            un = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            un = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        Ct = { for: k, view: G && G.view.state !== "off" && G.view.state !== "not-a-player" ? { ...G.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Cr = !1;
      }
    }
  }
  function J() {
    const b = dt();
    if (!b || (Ct == null ? void 0 : Ct.for) !== b) return null;
    const k = Ct.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const G = k.state === "claimed" ? null : V(b), ee = k.state === "claimed" && k.holds !== !1 ? H(b) : null;
    return { ...k, ...(un == null ? void 0 : un.for) === b ? { name: un.name } : {}, ...G ? { claimTx: G.txid } : {}, ...ee ? { sendTx: ee.txid } : {} };
  }
  async function ne() {
    var Ce;
    const b = o == null ? void 0 : o.address;
    if (!b || !e.giftInfo || !((Ce = t == null ? void 0 : t.gifts) != null && Ce.enabled) || we) return;
    const k = (F == null ? void 0 : F.for) === b ? F : null, G = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < G) return;
    we = !0;
    const ee = Dt();
    try {
      const q = await e.giftInfo(b);
      F = { for: b, info: q, ok: !0, at: e.now() }, e.store.set(yn(b), JSON.stringify(q));
    } catch {
      F = { for: b, info: ee, ok: !1, at: e.now() };
    } finally {
      we = !1;
    }
  }
  const Te = () => Bt().reduce((b, k) => Ma.includes(k.status) ? b + BigInt(k.amount || "0") + BigInt(k.fee || "0") : b, 0n);
  function $e() {
    if (i === void 0) return 0;
    const b = i - Te() - BigInt(zt.length) * Hn(je());
    return b > 0n ? Cg(b, je()) : 0;
  }
  const Pe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", $t = "EMPTY — ADD STX TO PLAY";
  function Ze() {
    if (!(t != null && t.here)) return null;
    const b = (k, G) => ({ reason: k, text: G });
    switch (At()) {
      case "connect":
      case "wrong-wallet":
        return b("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return b("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return b("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return b("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return b("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return b("locked", "UNLOCK TO LISTEN");
      case "link":
        return b("link", "FINISH SETUP TO LISTEN");
      case "over":
        return b("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ie() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Xe() ? Pe : $t);
      case "ready":
        return !z() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : R ? $e() < 1 ? b("out", Xe() ? Pe : $t) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const pt = () => {
    var b;
    return !!(o != null && o.address) && Xe() && !!((b = Dt()) != null && b.player);
  };
  function st() {
    return pt() ? { locked: !0, known: !0 } : null;
  }
  const $ = 3 * 6e4, Ee = () => !!Dt() && !!e.history && !(o != null && o.linked);
  async function ft() {
    const b = o.address, k = Dt(), { balance: G, nonce: ee } = await e.chain.account(b), Ce = await e.history(b, !0);
    if (!Ce.ok) return null;
    const q = nI({ self: b, balance: G, inbound: Ce.inbound, outgoing: Ce.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!q.ok) return null;
    const ke = rI(q.parts, Ba);
    return { balance: G, nonce: ee, parts: q.parts, steps: ke.steps, tooSmall: ke.tooSmall.length };
  }
  const rn = () => Ke ? { state: "unavailable" } : !le || e.now() - le.at > $ || i !== void 0 && i !== le.balance ? { state: "none" } : le.plan;
  function At() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = ht();
    if (!Ut()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : gn() ? "wrong-wallet" : o.state === "known" ? "locked" : !Ut() && o.linked !== b ? "link" : i === void 0 ? "loading" : i > To && !o.backedUp ? "over" : i < an + Hn(je()) ? "fund" : "ready" : "loading";
  }
  const xr = () => {
    var b, k, G, ee, Ce;
    return {
      step: At(),
      busy: u,
      message: x,
      error: L,
      notice: Tr(),
      gate: t,
      main: ht(),
      mainConnected: !!e.main(),
      standIn: En(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: J(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.hasBackup),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((q) => q === "over" && (o != null && o.backedUp) ? "ok" : q)(M5(i, je())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > To && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : Cg(i, je()),
      allowance: i === void 0 ? To : ed(i, BigInt(((b = ue()) == null ? void 0 : b.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: z(),
      entries: Bt(),
      depositTxid: ((k = ue()) == null ? void 0 : k.txid) ?? P,
      depositPending: Ie(),
      arrival: Ie() ? { since: ((G = ue()) == null ? void 0 : G.at) ?? (ze == null ? void 0 : ze.since) ?? e.now(), graceMs: Ol } : null,
      walletOutdated: Be("like"),
      canAnother: !!o && !Be("another"),
      canForget: !!o && !Be("forget"),
      passkeyName: o == null ? void 0 : o.passkeyName,
      hadGift: o != null && o.address && (F == null ? void 0 : F.for) === o.address && F.ok ? !!F.info : null,
      linkedListening: X && X === ht() ? B.map((q) => q.listening) : [],
      serverLinked: !!A && T === `${ht()}:${o == null ? void 0 : o.address}`,
      stuck: dn().length,
      armed: de,
      queued: zt.length,
      solo: Ut(),
      returnTo: (ee = br()) == null ? void 0 : ee.to,
      returnToKind: (Ce = br()) == null ? void 0 : Ce.kind,
      funderState: (() => {
        const q = Fn();
        return q ? q.ok ? q.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const q = Fn();
        return !!q && q.ok && q.distinct > 1;
      })(),
      walletCannotSolo: Ut() && Be("standalone"),
      walletCannotMulti: Be("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((q) => q !== ht() && q !== (o == null ? void 0 : o.linked)),
      creditedTo: Ut() && (o != null && o.address) && (_ == null ? void 0 : _.for) === o.address && _.main ? _.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(_e("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (M == null ? void 0 : M.for) === o.address && M.unused,
      gift: (() => {
        const q = Dt();
        return q ? { player: q.player, from: q.from, source: q.source, amount: q.amount, ...q.drop !== void 0 ? { drop: q.drop } : {} } : null;
      })(),
      giftPlays: Dt() ? $e() : 0,
      playCost: Hn(je()),
      giftStop: Ze(),
      albumLock: st(),
      returnPlan: rn(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Be("slots"),
      likeFunds: (() => {
        var Se;
        const q = qe();
        if (!q || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const ke = Ye();
        return { address: q, balance: ke, low: pn(ke), album: Xe(), pending: !!bt(q), txid: (Se = bt(q)) == null ? void 0 : Se.txid, main: ht() };
      })()
    };
  }, Tr = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", gt = (b, k = "") => {
    x = b, L = k, e.changed();
  };
  async function Zt(b, k) {
    if (!u) {
      u = b, L = "", e.changed();
      try {
        await k();
      } catch (G) {
        const ee = G instanceof Error ? G.message : String(G);
        L = /Cancelled in the listening wallet/.test(ee) ? "" : ee, L || (x = "Not now. Nothing was signed.", be = !0);
      } finally {
        u = null, await Mn(!0);
      }
    }
  }
  const Uo = () => !!(t != null && t.enabled) && t.here && (Ut() || !!ht() && t.allowed), Zn = () => Uo() && !gn(), vi = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", nr = () => {
    if (gn()) throw new Error(vi());
  };
  async function wn() {
    if (!Uo()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const jn = (b) => {
    const k = ht();
    return b.request("listening.status", k ? { main: k } : void 0);
  };
  async function ut(b = !1) {
    o != null && o.address && (!b && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await Oo(b)));
  }
  async function Oo(b = !1) {
    const k = qe();
    if (!(!Xe() || !k || (o == null ? void 0 : o.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function Cs(b) {
    if ((X !== b || e.now() - Q >= 6e4) && (B = await e.links(b), X = b, Q = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === b) return;
    const k = `${b}:${o.address}`;
    T === k && A || (A = B.find((G) => G.listening === o.address) ?? null, T = k);
  }
  async function Jr() {
    const b = o == null ? void 0 : o.address;
    if (!Ut() || !b || o != null && o.linked || !e.funder || m || !i || i <= 0n) return;
    const k = Fn(b);
    if (k != null && k.ok && k.funder) return;
    const G = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, C - 1), 30 * 6e4);
    if (!(Y && Y.for === b && e.now() - Y.at < G)) {
      m = !0;
      try {
        Y = { for: b, res: await e.funder(b), at: e.now() };
      } catch {
        Y = { for: b, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      C = Y.res.ok ? 0 : C + 1;
    }
  }
  async function Ai() {
    const b = o == null ? void 0 : o.address;
    if (!(!Ut() || !b || o != null && o.linked || !e.mainOf || W) && !(_ && _.for === b && (_.ok || e.now() - _.at < 6e4))) {
      W = !0;
      try {
        _ = { for: b, main: await e.mainOf(b), ok: !0, at: e.now() };
      } catch {
        _ = { for: b, main: null, ok: !1, at: e.now() };
      } finally {
        W = !1;
      }
    }
  }
  async function Br() {
    const b = o == null ? void 0 : o.address;
    if (!(!b || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (M == null ? void 0 : M.for) === b) && e.store.get(_e("created", b)) !== "1")
      try {
        M = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function Ho() {
    var Ce;
    const b = o == null ? void 0 : o.address;
    if (!b) return !1;
    let k, G = !1;
    const ee = /* @__PURE__ */ new Map();
    for (const q of re())
      try {
        const ke = await e.chain.transaction(q.txid);
        if (!ke) {
          if (oe.add(q.txid), e.now() - q.created > 15 * 6e4 && !ee.has(q.address) && ee.set(q.address, await e.chain.confirmedNonce(q.address)), k = ee.get(q.address), k !== void 0 && k > BigInt(q.nonce)) {
            Pt({ ...q, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((q.status === "unknown" || q.status === "signed") && q.raw)
            try {
              await e.chain.broadcast(q.raw, q.txid), Pt({ ...q, status: "pending" });
            } catch (se) {
              Pi(se) && Pt({ ...q, status: "failed", note: se.message, raw: void 0 });
            }
          continue;
        }
        oe.delete(q.txid);
        const Se = String(ke.tx_status);
        if (Se === "success" && ke.canonical !== !1 && ke.is_unanchored === !1) {
          if (Pt({ ...q, status: "confirmed", confirmedAt: e.now(), actualFee: String(ke.fee_rate ?? q.fee), raw: void 0 }), G = !0, q.kind === "like" && (v = !0, q.status !== "confirmed" && typeof q.liked == "boolean"))
            try {
              (Ce = e.likeConfirmed) == null || Ce.call(e, q.song, q.liked);
            } catch {
            }
        } else Se.startsWith("abort_") || Se.startsWith("dropped_") ? Pt({ ...q, status: "failed", note: Se, raw: void 0 }) : q.status !== "pending" && Pt({ ...q, status: "pending" });
      } catch {
      }
    for (const q of Xe() ? [b, qe()] : [b]) {
      const ke = bt(q);
      if (ke)
        try {
          const Se = await e.chain.transaction(ke.txid), se = String((Se == null ? void 0 : Se.tx_status) ?? "");
          (se === "success" && Se.is_unanchored === !1 || se.startsWith("abort_") || se.startsWith("dropped_") || !Se && e.now() - ke.at > 2 * 36e5) && (He(null, q), se === "success" && vt(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return G;
  }
  async function Mn(b = !1) {
    var k;
    try {
      const G = ht();
      if ((b || !t || r !== G || e.now() - n > 3e5) && (t = await e.config(G), n = e.now(), r = G), !t.enabled || !t.here || !Ut() && (!G || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), de && Rn(), e.changed();
        return;
      }
      await wn(), o = await jn(s), gn() && o.state === "unlocked" && (So(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await jn(s)), G && t.allowed && await Cs(G), await ut(b), await Jr(), await Ai(), await Br(), await ne(), await D(), await Ho() && await ut(!0), await Oo(), await Nn(), U = 0;
    } catch {
      U++;
    }
    if (At() === "locked" ? Sa() : de && Rn(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), zt.length && !xo && zn();
  }
  async function Ei(b) {
    const k = o == null ? void 0 : o.root;
    if (!k || o != null && o.slot || !(o != null && o.address) || Be("slots")) return;
    const G = Number(e.store.get(_e("slot", k)));
    if (!(!Number.isSafeInteger(G) || G < 1))
      try {
        const { balance: ee } = await e.chain.account(o.address);
        if (ee >= an + Hn(je())) return;
        await b.request("listening.openSlot", { slot: G }), o = await jn(b), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function ki(b, k) {
    var q;
    nr();
    const G = !(o != null && o.address) || z(o.address), ee = o != null && o.linked ? (q = e.nameOf) == null ? void 0 : q.call(e, o.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: G ? kn() : void 0, anyPasskey: k, ...ht() ? { main: ht() } : {}, ...ee ? { label: ee } : {} }), o = await jn(b), G && (z(o.address) ? await Mr() : await b.request("listening.stop")), await Ei(b), gt(G ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Ce = y;
    y = null, Ce && e.now() - Ce.at < 12e4 && setTimeout(() => void Mn(!0).then(() => Ro(Ce)), 0);
  }
  function Sa() {
    de || u || be || Ne >= 3 || !s || !(o != null && o.address) || (de = !0, wt = (async () => {
      try {
        await ki(s, !1), Ne = 0;
      } catch (b) {
        const k = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(k) ? Ae || (be = !0, gt("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Ne++, L = k);
      } finally {
        de = !1;
        const b = Ae;
        Ae = null, b ? await b() : await Mn(!0);
      }
    })());
  }
  async function Rn(b) {
    de && (Ae = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await wt), b && await b(), e.changed();
  }
  const kn = () => ({
    fee: je().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: To.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function Mr() {
    if (!(o != null && o.address)) return !1;
    if (R || (R = await e.tabLock(o.address)), !R)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Sr(b, k) {
    const G = o.address, { balance: ee, nonce: Ce } = k ?? await e.chain.account(G);
    i = ee;
    const q = await s.request("listening.prepareReturn", {
      mode: b.mode,
      balance: ee.toString(),
      nonce: Ce.toString(),
      fee: Ba.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (q.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ke = b.mode === "amount" ? b.amount : b.mode === "all" ? ee - Ba : ee - To - Ba, Se = Vi(q.raw);
    if (Gr(Se.payload.recipient).value !== b.to || String(Se.payload.amount) !== q.amount || ke !== void 0 && q.amount !== ke.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const se = {
      id: nd(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: q.recipient,
      amount: q.amount,
      fee: q.fee,
      nonce: Ce.toString(),
      created: e.now(),
      status: "signed",
      raw: q.raw,
      txid: q.txid
    };
    e.validate(se), Pt(se);
    try {
      await e.chain.broadcast(q.raw, q.txid), Pt({ ...se, status: "pending" });
    } catch (Je) {
      throw Pt({ ...se, status: "unknown", note: Je.message }), Je;
    }
    return q;
  }
  const Ts = bu, mo = Ba;
  async function Bs(b, k, G) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Be("slots") || Be("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const ee = o.slot ?? 0;
    if (b === k || ![b, k].includes(ee) || ![b, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Ce = o.root ?? o.address, q = b === 0 ? Ce : o.address, ke = k === 0 ? Ce : o.address, { balance: Se, nonce: se } = await e.chain.account(q);
    if (Se < G + mo + an) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Je = await s.request("listening.signMove", { from: b, to: k, amount: G.toString(), fee: mo.toString(), nonce: se.toString(), balance: Se.toString() }), S = Vi(Je.raw);
    if (Je.from !== q || Je.to !== ke || Je.amount !== G.toString() || Gr(S.payload.recipient).value !== ke || String(S.payload.amount) !== G.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const N = {
      id: nd(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ke,
      amount: Je.amount,
      fee: Je.fee,
      nonce: se.toString(),
      created: e.now(),
      status: "signed",
      raw: Je.raw,
      txid: Je.txid
    };
    e.validate(N), Pt(N);
    try {
      await e.chain.broadcast(Je.raw, Je.txid), Pt({ ...N, status: "pending" });
    } catch (K) {
      throw Pt({ ...N, status: "unknown", note: K.message }), K;
    }
    return He({ txid: Je.txid, amount: Je.amount, at: e.now() }, ke), ke === Ce && Ce !== o.address ? c = null : a = -1 / 0, Je;
  }
  let Nr = !1;
  const Ms = /* @__PURE__ */ new Map(), Do = (b) => _e("float", b);
  async function Nn() {
    if (Nr || (o == null ? void 0 : o.state) !== "unlocked" || !Xe() || Be("move") || Be("rootLike") || !o.address) return;
    const b = o.address;
    if (e.store.get(Do(b)) === "1") return;
    const k = Dt();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const G = Ye();
    if (G === void 0 || i === void 0) return;
    if (!pn(G)) {
      e.store.set(Do(b), "1");
      return;
    }
    if (bt(qe()) || Ps() || re().length || i < Ts * 4n + an + mo) return;
    const ee = Ms.get(b);
    if (!(ee && (ee.n >= 3 || e.now() - ee.at < 5 * 6e4))) {
      Nr = !0, Ms.set(b, { n: ((ee == null ? void 0 : ee.n) ?? 0) + 1, at: e.now() });
      try {
        await Bs(o.slot ?? 0, 0, Ts), e.store.set(Do(b), "1");
      } catch (Ce) {
        console.warn("[radio] likes float not sent yet", Ce);
      } finally {
        Nr = !1;
      }
    }
  }
  async function Ns(b) {
    if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Be("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await ft().catch(() => null);
    if (!k)
      throw le = null, Ke = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ke = !1, i = k.balance;
    const G = { balance: k.balance, nonce: k.nonce };
    if (b === "excess") {
      const Se = Ng(k.parts) ?? Zr();
      if (!Se) throw new Error("Choose where to send the excess first.");
      await Sr({ mode: "excess", to: Se, linked: !1 }, G), le = null, gt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const ee = k.steps;
    if (!ee.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!le && le.balance === k.balance && e.now() - le.at <= $ && le.steps.length === ee.length && le.steps.every((Se, se) => Se.to === ee[se].to && Se.mode === ee[se].mode && Se.send === ee[se].send))) {
      le = {
        at: e.now(),
        balance: k.balance,
        steps: ee,
        parts: k.parts,
        plan: { state: "ready", steps: ee.map((Se) => ({ to: Se.to, kind: Se.kind, send: Se.send.toString() })), kept: k.tooSmall, excess: Ng(k.parts) }
      }, gt(ee.length > 1 ? `This goes back in ${ee.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const q = ee[0], ke = q.to ?? Zr();
    if (!ke) throw new Error("Choose where to send the rest first.");
    if (q.mode === "amount" && Be("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Sr({ mode: q.mode, to: ke, linked: !1, ...q.mode === "amount" ? { amount: q.send } : {} }, G), le = null, ee.length === 1 ? (O(!1), gt("Returned ✓ Paying is off.")) : gt(`Returned ✓ ${ee.length - 1} more ${ee.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Qr() {
    if (!(o != null && o.unproven)) return;
    const b = await wn();
    await b.request("listening.prove"), o = await jn(b);
  }
  const _r = {
    forceRefresh: () => Mn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !ao(b))) {
        if (b === En()) return Mn(!0);
        e.store.set(Bn, b ?? ""), L = "", x = "", i = void 0, a = -1 / 0, c = null, await Mn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Zt("Check the listening wallet…", async () => {
      const b = await wn();
      if (Be("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((o == null ? void 0 : o.state) !== "unlocked" || (o.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (te().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      So(), await b.request("listening.forget"), i = void 0, o = await jn(b), O(!1), gt("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => Zt("Waiting for your passkey…", async () => {
      const k = await wn(), G = !!(b != null && b.another) && !e.main() && !Be("another");
      G && (o == null ? void 0 : o.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: kn(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...G ? { another: !0 } : {} }), o = await jn(k), o.address && e.store.set(_e("created", o.address), "1"), O(!0), gt(Ut() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Mr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      _s = e.now() + bo;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? vt() : ze = null, e.changed();
    },
    giftSent: (b, k) => {
      !(o != null && o.address) || ue() || (He({ txid: b, amount: k.toString(), at: e.now() }), a = -1 / 0, F = null, Ct && (Ct = { ...Ct, at: -1 / 0 }), gt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (nr(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Be("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await wn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, k, G, ee) => {
      He({ txid: G, amount: ee.toString(), at: e.now() }, k), F = null, await _r.openAlbum(b), gt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => Zt("Opening…", async () => {
      if (nr(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Be("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === b) return;
      So(), await s.request("listening.openSlot", { slot: b }), o = await jn(s), i = void 0, a = -1 / 0, le = null, Ke = !1;
      const k = o.root;
      k && b > 0 && e.store.set(_e("slot", k), String(b)), gt(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const k = () => Zt("Waiting for your passkey…", async () => ki(await wn(), b));
      return de ? b ? Be("cancel") ? (gt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Rn(async () => {
        (At() === "locked" || At() === "intro") && await k();
      }) : wt : k();
    },
    link: () => Zt("Sign in your wallet…", async () => {
      nr();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(b)).find((G) => G.listening === o.address);
      if (k)
        await s.request("listening.link", { main: b, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const G = { main: b, listening: o.address, issued: e.now() }, ee = await e.signWithMain(b, Y5(G)), Ce = await s.request("listening.link", { main: b, issued: G.issued, mainSignature: ee });
        await e.saveLink({ ...G, mainSignature: ee, listeningSignature: Ce.listeningSignature }), Q = -1 / 0;
      }
      gt("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Zt("One more passkey check…", Qr), !(o != null && o.unproven)) : !0,
    deposit: () => Zt("Approve the deposit in your wallet…", async () => {
      nr(), await Qr();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (ue()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (De()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await ut(!0);
      const k = ed(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await e.deposit(b, o.address, k), P && He({ txid: P, amount: k.toString(), at: e.now() }), gt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Zt("Approve the top-up in your wallet…", async () => {
      nr(), await Qr();
      const b = e.main(), k = qe();
      if (!b || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (bt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const G = await e.chain.balance(k);
      Xe() ? c = { for: k, value: G, at: e.now() } : (i = G, a = e.now());
      const ee = ed(G);
      if (ee <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Ce = await e.deposit(b, k, ee);
      Ce && He({ txid: Ce, amount: ee.toString(), at: e.now() }, k), gt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => Zt("Adding plays…", async () => {
      if (nr(), !Xe()) throw new Error("Open the album you want to add plays to first.");
      if (!cl.includes(b)) throw new Error("Choose one of the amounts offered.");
      const k = oI(b, je());
      if (h || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (re().length || ue()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Bs(0, o.slot ?? 0, k), gt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Zt("Confirm in the listening wallet…", async () => {
      if (!Zn()) throw new Error("Connect your wallet first.");
      await Mr(), await s.request("listening.approveSession", kn()), O(!0), gt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Zt("Clearing…", async () => {
      for (const b of dn())
        await e.chain.transaction(b.txid) || Pt({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      gt("Cleared ✓");
    }),
    switchOff: () => Zt("Switching off…", async () => {
      So(), await (s == null ? void 0 : s.request("listening.stop")), O(!1), gt("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Zt("Showing your backup words in the box…", async () => {
      if (!(o != null && o.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await wn();
      await b.request("listening.backup"), o = await jn(b), gt("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, k) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Be("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await wn()).request("listening.signShelf", { action: b, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      un = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => Zt("Confirm in the listening wallet…", async () => {
      var se, Je, S, N;
      const k = dt();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Be("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (V(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Mr();
      const G = await e.awardNote(k, b), { balance: ee, nonce: Ce } = await e.chain.account(k);
      if (ee < Xc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ke = await (await wn()).request("listening.signAward", {
        cls: G.cls,
        number: G.number,
        plays: G.plays,
        record: G.record,
        signature: G.signature,
        fee: Xc.toString(),
        nonce: Ce.toString(),
        balance: ee.toString()
      }), Se = Vi(ke.raw);
      if (ke.hero !== k || ke.number !== G.number || ((Je = (se = Se.payload) == null ? void 0 : se.functionName) == null ? void 0 : Je.content) !== "claim" || ((N = (S = Se.payload) == null ? void 0 : S.contractName) == null ? void 0 : N.content) !== H5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ke.raw, ke.txid), e.store.set(wo(k), JSON.stringify({ txid: ke.txid, at: e.now() })), a = -1 / 0, Ct && (Ct = { ...Ct, at: -1 / 0 }), gt("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => Zt("Confirm in the listening wallet…", async () => {
      var Je, S, N;
      const k = dt(), G = J();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((G == null ? void 0 : G.state) !== "claimed" || G.inscription === void 0) throw new Error("There is no record to send yet.");
      if (G.holds === !1) throw new Error("This record has already been sent.");
      if (G.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (H(k)) throw new Error("Your record is already on its way.");
      const ee = b.trim();
      if (!ao(ee)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (ee === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Be("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Mr();
      const { balance: Ce, nonce: q } = await e.chain.account(k);
      if (Ce < Xc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const Se = await (await wn()).request("listening.signSendRecord", { inscription: G.inscription, recipient: ee, fee: Xc.toString(), nonce: q.toString(), balance: Ce.toString() }), se = Vi(Se.raw);
      if (Se.from !== k || Se.recipient !== ee || Se.inscription !== G.inscription || ((S = (Je = se.payload) == null ? void 0 : Je.functionName) == null ? void 0 : S.content) !== "transfer" || Gr((N = se.payload.functionArgs) == null ? void 0 : N[2]).value !== ee)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(Se.raw, Se.txid), e.store.set(E(k), JSON.stringify({ txid: Se.txid, at: e.now() })), a = -1 / 0, Ct && (Ct = { ...Ct, at: -1 / 0 }), gt("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Zt("Locking…", async () => {
      So(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, gt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const k = String(b ?? "").trim();
      if (!(o != null && o.address)) return gt("", "Unlock the listening wallet first.");
      if (!ao(k)) return gt("", "Enter a standard mainnet address (it starts with SP).");
      if (k === o.address) return gt("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(mr(o.address), k), gt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(mr(o.address), ""), e.changed();
    },
    returnFunds: (b) => Zt("Check the return in the listening wallet…", async () => {
      if (!Zn()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (Ee()) return Ns(b);
      const k = br();
      if (!k) throw new Error(Ut() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Be("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Sr({ mode: b, to: k.to, linked: k.kind === "linked" }), b === "all" && O(!1), gt(b === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, zt = [], vr = 10, bo = 30 * 6e4;
  let xo = !1, _s = 0;
  const Fo = (b) => e.now() < _s && (b === "intro" || b === "locked" || b === "link" || b === "fund" && Ie()), Ps = () => h || !!u || d || w, So = () => {
    zt.length && (zt.length = 0, e.changed());
  };
  async function jo(b) {
    if (!zt.some((k) => k.id === b.id) && !Bt().some((k) => k.id === b.id) && (zt.push({ ...b, at: e.now() }), zt.length > vr && zt.shift()), Ps() || te().length) {
      const k = zt.length;
      x = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await zn();
  }
  async function zn() {
    if (!xo) {
      xo = !0;
      try {
        for (; zt.length; ) {
          for (; zt.length && e.now() - zt[0].at > bo; ) zt.shift();
          if (!zt.length || Ps() || await va(zt[0]) === "wait") return;
          zt.shift();
        }
      } finally {
        xo = !1, e.changed();
      }
    }
  }
  async function va(b) {
    var k;
    h = !0;
    try {
      await Mn();
      const G = At();
      if (G === "loading" || Fo(G)) return "wait";
      if (G !== "ready" || !z() || !(o != null && o.session) || o.session.playsLeft < 1 || !R) return "done";
      if (te().length) return "wait";
      I || (await e.chain.verify(), I = !0);
      const ee = o.address, { balance: Ce, nonce: q } = await e.chain.account(ee);
      i = Ce, a = e.now();
      const ke = await e.chain.owner(td, b.song);
      if (ke === ee || ke === ht()) return "done";
      const Se = await s.request("listening.signPlay", {
        core: td,
        song: b.song,
        receipt: b.id,
        fee: je().toString(),
        nonce: q.toString(),
        balance: Ce.toString()
      }), se = {
        id: b.id,
        address: ee,
        kind: "play",
        core: td,
        song: b.song,
        recipient: ke,
        amount: "50",
        fee: je().toString(),
        nonce: q.toString(),
        created: e.now(),
        status: "signed",
        raw: Se.raw,
        txid: Se.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(se), Pt(se);
      const Je = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(Se.raw, Se.txid), Pt({ ...se, status: "pending" }), x = `♪ Paid ${Je}`, L = "";
      } catch (S) {
        Pt({ ...se, status: Pi(S) ? "failed" : "unknown", note: S.message, ...Pi(S) ? { raw: void 0 } : {} }), L = S.message;
      }
      return o = await jn(s), "done";
    } catch (G) {
      const ee = G instanceof Error ? G.message : "payment unavailable";
      return (k = Dt()) != null && k.player ? (x = "Payment is taking a moment: " + ee, "wait") : (x = "This song played free: " + ee, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function $i(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(At()) || Be("like") ? !1 : (Ro(b), !0);
  }
  async function Ro(b) {
    const k = b.title ? `“${b.title}”` : `song #${b.song}`, G = (xe) => {
      var Jt;
      L = xe, x = "";
      try {
        (Jt = e.likeFailed) == null || Jt.call(e, b.song);
      } catch {
      }
      e.changed();
    }, ee = Xe(), Ce = At(), q = ht(), ke = ee && (Ce === "fund" || Ce === "over") ? "ready" : Ce, Se = Ut() ? qe() : q;
    if (ke === "locked") {
      y = { ...b, at: e.now() }, gt(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (ke === "wrong-wallet") return G(vi());
    if (ke === "link") return G("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Ut() && Be("standalone")) return G("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ke === "fund") return G("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ke === "over") return G("Return the excess first: the listening wallet holds more than 1 STX.");
    if (ee) {
      await Oo(!0);
      const xe = Ye();
      if (pn(xe))
        return e.changed(), G(Hl);
    }
    if (ke !== "ready" || !Se) return G("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return G("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!R) return G("Pay-per-play is running in another tab. Like from that tab.");
    const se = Bt(qe()).find((xe) => xe.kind === "like" && xe.song === b.song);
    if (se && Ma.includes(se.status))
      return G(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return G("One like at a time: your last one is still being sent.");
    if ((se == null ? void 0 : se.status) === "confirmed" && e.now() - (se.confirmedAt ?? 0) < iI)
      return G(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let Je;
    w = !0;
    try {
      Je = e.likeState ? (await e.likeState(Se, b.song)).by : b.likedBy ?? [];
    } catch {
      Je = b.likedBy;
    } finally {
      w = !1;
    }
    if (!Je) return G(`Could not check ${k} right now. Try the heart again.`);
    const S = qe(), K = ((se == null ? void 0 : se.status) === "confirmed" && typeof se.liked == "boolean" && e.now() - (se.confirmedAt ?? se.created) < 5 * 6e4 ? se.liked : void 0) ?? Je.includes(S);
    if (!K && Je.some((xe) => xe !== S)) return G(Ut() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${Je.includes(q) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Us({ song: b.song, liked: !K, title: b.title, artist: b.artist });
  }
  async function Us(b) {
    var ee, Ce, q;
    if (d) {
      gt("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, G = e.wait ?? ((ke) => new Promise((Se) => setTimeout(Se, ke)));
    try {
      gt(`${b.liked ? "Liking" : "Unliking"} ${k}…`);
      const ke = e.now() + 12e4;
      for (; h || (Xe() ? Bt(qe()).some((K) => Ma.includes(K.status)) : te().length); ) {
        if (e.now() > ke) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await G(5e3), await Mn(!0);
      }
      if (!Xe() && At() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const Se = qe(), { balance: se, nonce: Je } = await e.chain.account(Se);
      if (Xe() ? c = { for: Se, value: se, at: e.now() } : (i = se, a = e.now()), pn(se)) throw new Error(Hl);
      const S = await s.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: Rt().toString(),
        nonce: Je.toString(),
        balance: se.toString()
      }), N = {
        id: nd(),
        address: Se,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: Rt().toString(),
        nonce: Je.toString(),
        created: e.now(),
        status: "signed",
        raw: S.raw,
        txid: S.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(N), Pt(N);
      try {
        await e.chain.broadcast(S.raw, S.txid), Pt({ ...N, status: "pending" }), x = `${b.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (ee = e.likeSent) == null || ee.call(e, b.song, b.liked);
        } catch {
        }
      } catch (K) {
        if (Pt({ ...N, status: Pi(K) ? "failed" : "unknown", note: K.message, ...Pi(K) ? { raw: void 0 } : {} }), L = K.message, Pi(K)) try {
          (Ce = e.likeFailed) == null || Ce.call(e, b.song);
        } catch {
        }
      }
      o = await jn(s);
    } catch (ke) {
      L = "Like not sent: " + (ke instanceof Error ? ke.message : "the listening wallet is unavailable");
      try {
        (q = e.likeFailed) == null || q.call(e, b.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), zn();
    }
  }
  return { snapshot: xr, refresh: Mn, onListened: jo, heart: $i, toggleLike: Ro, ..._r };
}
const Rb = ["Connect", "Passkey", "Link & fund", "Listen"], zb = ["Passkey", "Add 1 STX", "Listen"], bf = (e) => e ? zb : Rb;
function cI(e) {
  if (e.solo) return lI(e);
  const t = Rb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function lI(e) {
  const t = zb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function uI(e, t) {
  return !t || t.at >= bf(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const dI = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function fI(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !dI(r.id)));
}
const hI = {}, pI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, gI = (e) => {
  const t = hI;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, yI = (e) => `/hiro/${e}`, wI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, mI = (e) => {
  const t = gI(e);
  if (t)
    return [wI(t)];
  const n = pI[e];
  return typeof window < "u" ? [`${window.location.origin}${yI(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, bI = {}, _g = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, xI = "xtrata.log.enabled", SI = "xtrata.log.level", vI = "xtrata.log.tags", AI = "xtrata.log.dedupe", qc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, EI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, kI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, $I = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, II = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, LI = () => {
  const e = bI ?? {}, t = qc(xI) ?? e.VITE_LOG_ENABLED, n = qc(SI) ?? e.VITE_LOG_LEVEL, r = qc(vI) ?? e.VITE_LOG_TAGS, s = qc(AI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: EI(t),
    level: kI(n) ?? "warn",
    tags: II(r),
    dedupe: $I(s)
  };
}, CI = (e, t, n) => !e.enabled || _g[n] < _g[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), TI = (e, t, n, r) => {
  const s = LI();
  if (!CI(s, t, e) || MI(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, BI = /* @__PURE__ */ new Set();
let Pg = null;
const MI = (e, t, n, r, s) => (Pg !== e && (BI.clear(), Pg = e), !1), NI = (e, t, n) => TI("debug", e, t, n), _I = {}, PI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, UI = (e) => {
  const t = _I, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : PI[e];
}, OI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, HI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return OI.test(n) ? n : null;
}, DI = (e) => e.replace(/\/+$/, ""), FI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), Ug = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const s = Number.parseInt(t.slice(r, r + 2), 16);
    if (s < 32 || s > 126)
      return null;
    n += String.fromCharCode(s);
  }
  return n;
}, Ui = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, jI = (e) => {
  var c, u;
  let t;
  try {
    t = Gr(O6(e));
  } catch {
    return null;
  }
  const n = Ui(t);
  if (!n || n.success === !1)
    return null;
  const r = Ui(n.value), s = Ui(r == null ? void 0 : r.value), o = Ui(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Ug((c = Ui(o.name)) == null ? void 0 : c.value), a = Ug((u = Ui(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : HI(`${i}.${a}`);
}, RI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${DI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [vb(sb(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : jI(o.result);
}, zI = async (e) => {
  const t = e.address.trim();
  if (!Yi(t))
    return null;
  const n = UI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of mI(e.network))
    try {
      return await RI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return NI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: FI(r)
  }), null;
};
function GI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((u) => {
      c.pending = !1, u && (c.name = u, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = o.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && s() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, o.set(a, c), i(a, c)), c.name;
    }
  };
}
const Og = Object.freeze({
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
}), Hg = Object.freeze({ 139: "melophonic" });
function Dg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(Og, n) ? Og[n] : Object.hasOwn(Hg, n) ? Hg[n] : t;
}
const Fg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function jg(e, t = "") {
  return Object.hasOwn(Fg, String(e)) ? Fg[String(e)] : t;
}
const Gb = 10000n, Ph = 1000000n, Dl = 3000n, KI = (e, t) => `${e}#gift=${t}`, VI = 100, Na = (e, t = Wr) => e <= an ? 0 : Number((e - an) / Hn(t)), Rg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Uh = "xtrata.xyz/radio/gifts", Da = VI, XI = "Create a prefunded Xtrata radio gift batch", qI = (e) => ({
  domain: wr({ name: Et(Uh), version: Et("1"), "chain-id": An(1) }),
  message: wr({
    purpose: Et(XI),
    creator: Et(e.creator),
    count: An(e.count),
    amount: An(BigInt(e.amount)),
    label: Et(e.label),
    issued: An(e.issued),
    ...e.player ? { player: Et(e.player) } : {}
  })
}), Kb = (e, t, n = Wr) => an + BigInt(e) * Hn(n) + (t ? bu : 0n), YI = (e, t = Wr) => Number((Ph - an - (e ? bu : 0n)) / Hn(t)), Vb = (e, t) => BigInt(e) * (t + Dl);
function WI(e, t, n, r = Wr) {
  const s = n ? bu : 0n, o = t > an + s ? t - an - s : 0n, i = Number(o / Hn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Pl,
    fees: BigInt(i) * r,
    reserve: an,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Dl,
    perCopy: t + Dl,
    total: Vb(e, t)
  };
}
const ZI = (e) => e >= Gb && e <= Ph, JI = 90, zg = [30, 90], QI = "Extend my prefunded Xtrata radio gift batches; no spending permission", eL = (e) => ({
  domain: wr({ name: Et(Uh), version: Et("1"), "chain-id": An(1) }),
  message: wr({ purpose: Et(QI), creator: Et(e.creator), batch: Et(e.batch), days: An(e.days), issued: An(e.issued) })
}), Gg = 40, tL = "Create an Xtrata radio gift player", xf = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), nL = /^[^\u0000-\u001f\u007f<>]+$/u;
function Kg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && nL.test(e) : !n;
}
function Xb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Kg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Kg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Gg) throw new Error(`A player holds 1 to ${Gg} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const s of e.tracks) {
    if (!Number.isSafeInteger(s) || s < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(s)) throw new Error("A song appears twice in the list.");
    t.add(s);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const s of n) if (!t.has(s)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((s, o) => s - o);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const qb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Hf(jf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, rL = (e) => ({
  domain: wr({ name: Et(Uh), version: Et("1"), "chain-id": An(1) }),
  message: wr({
    purpose: Et(tL),
    admin: Et(e.admin),
    player: Et(e.hash),
    issued: An(e.issued)
  })
}), Xr = (e) => e.tracks.filter((t) => !t.hidden), oL = (e) => e.tracks.find((t) => t.hidden) ?? null, rd = [300, 500, 1e3], Xa = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Yc = (e) => typeof e == "string" && Xa.some((t) => t.id === e), Vs = (e) => Xa.find((t) => t.id === e), sL = (e) => Xa.find((t) => e >= t.min) ?? Xa[Xa.length - 1];
function iL(e, t = Wr) {
  return sL(e <= an ? 0 : Number((e - an) / Hn(t)));
}
const Yb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], aL = "1000 Players";
function Oh(e = Da) {
  const t = [];
  for (const n of Yb) {
    const r = Kb(n.plays, !1);
    for (let s = n.count; s > 0; s -= e) {
      const o = Math.min(s, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: o, label: `${aL} ${String(i).padStart(2, "0")}`, amount: r, deposit: Vb(o, r) });
    }
  }
  return t;
}
const Hh = (e = Oh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: Yb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), cL = 23 * 36e5, Vg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function lL(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < cL ? "unpaid" : "todo";
}
function uL(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: lL(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => Vg(u.state) - Vg(c.state) || u.b.at - c.b.at), s = r[0];
  if (!s) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const o = (a = s.b.view) == null ? void 0 : a.copies, i = s.state === "live" ? `live · all ${e.count} waiting to be claimed` : s.state === "touched" ? `live, but only ${(o == null ? void 0 : o.waiting) ?? 0} of ${e.count} still waiting (${(o == null ? void 0 : o.claimed) ?? 0} claimed)` : s.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: s.state, batch: s.b, extras: r.length - 1, detail: s.b.error ? `${i} (${s.b.error})` : i };
}
function Xg(e, t, n = Oh()) {
  var u;
  const r = n.map((h) => uL(h, e, t)), s = [];
  for (const h of r)
    h.extras && s.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && s.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const o = r.every((h) => h.state === "live"), i = o ? r.flatMap((h) => h.batch.codes) : [], a = Hh(n).players;
  o && new Set(i).size !== a && s.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = o && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: s };
}
function dL(e, t = Oh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = Hh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const s = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), o = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((w) => w.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = o.map((u) => `${u.got} ${Vs(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && s === 0 && !!n.tiers && o.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${s ? `, ${s} no longer available` : ""}.` };
}
const qg = 1800, od = /* @__PURE__ */ new Map();
async function fL(e) {
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
function hL(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = od.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      od.set(e, { ...a, until: Date.now() + qg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        od.delete(e), s();
      }, qg + 50);
    }
  }, o;
}
const fr = (e, t, n, r, s) => hL(e, t, async () => await fL(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Os = "xtrata.radio.gift.incoming.v1", Yg = (e) => "xtrata.radio.gift.mine.v1:" + e, Wg = (e) => "xtrata.radio.gift.batches.v1:" + e, pe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, on = (e, t, n = "") => {
  const r = pe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, _a = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Jn = (e) => jr(e).replace(/\.?0+$/, "");
function pL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), H = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return H !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Rg(H) ? H : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const E = JSON.parse(e.store.get(Os) || "null");
      return Rg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(Os, JSON.stringify({ code: o, at: e.now() }));
    let E = 0;
    const H = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (V) => {
      const D = await V.json().catch(() => ({}));
      if (V.status === 404) {
        e.store.set(Os, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!V.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(Os, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void H(), n(E++)));
    });
    H();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: Na(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: Na(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const H = `${location.origin}${location.pathname}#gift=${E}`;
    return [fr("gift-pass-on", "Copy the link to pass on", () => H, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(Os, null), e.changed();
  }, d = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let w = {};
  const y = (E) => {
    if (w.box) return w.box;
    const H = pe("div", "", "ppp-gift-check");
    w.box = H;
    const V = () => {
      const D = window.turnstile;
      !D || w.rendered || (w.rendered = !0, D.render(H, { sitekey: E, callback: (J) => {
        w.token = J, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) V();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = V, document.head.append(D);
    }
    return H;
  }, v = (E) => {
    queueMicrotask(() => void E());
  };
  let x;
  async function L(E) {
    var D, J, ne, Te, $e, Pe, $t, Ze, pt;
    if (!t || t.claiming || !E.listening) return;
    const H = !!((D = t.view) != null && D.player);
    if (H && !E.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const V = async (st) => {
      const $ = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...st })
      });
      return { res: $, r: await $.json().catch(() => ({})) };
    };
    try {
      let st = 0, $ = E.listening, Ee;
      if (H) {
        const At = Number((ne = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : ne.next);
        if (!Number.isSafeInteger(At) || At < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        st = At;
        for (let xr = 0; ; xr++) {
          const Tr = await e.album.bind(st);
          if ($ = Tr.address, Ee = await V({ wallet: $, binding: Tr }), Ee.res.status === 409 && /just taken/.test(((Te = Ee.r) == null ? void 0 : Te.error) || "") && xr < 5) {
            st += 1;
            continue;
          }
          break;
        }
      } else Ee = await V({ wallet: $ });
      const { res: ft, r: rn } = Ee;
      if (ft.status === 503 && /sending another gift/.test((rn == null ? void 0 : rn.error) || "")) {
        t.waiting = !0, ($e = e.claiming) == null || $e.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!ft.ok) {
        const At = String((rn == null ? void 0 : rn.error) || "");
        if (ft.status === 404 || ft.status === 410 || ft.status === 409 && /already had a gift|brand-new|already have this album/.test(At))
          throw e.store.set(Os, null), new Error(At || "This gift cannot be opened.");
        if (ft.status === 429 || ft.status === 403 || ft.status === 400 && !/wallet number/i.test(At)) throw new Error(At || `Could not open the gift (${ft.status}).`);
        const Tr = /topping up/.test(At) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(At) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(At) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Tr), { retry: !0, slow: /topping up|not paid for yet/.test(At) });
      }
      t.done = !0, e.store.set(Os, null), H ? await e.album.arrived(st, $, rn.txid, BigInt(rn.amount)) : e.giftSent(rn.txid, BigInt(rn.amount));
    } catch (st) {
      const $ = st, Ee = $.name === "TypeError" || $.name === "AbortError" || $.name === "TimeoutError" || /wallet number/i.test($.message);
      if ($.retry || Ee) {
        const ft = t.tries ?? 0;
        t.tries = ft + 1, t.retry = { text: $.retry ? $.message : "Still sending your gift… the network is slow, trying again." }, (Pe = e.claiming) == null || Pe.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, $.slow ? 6e4 : n(ft));
      } else
        t.error = $.message, ($t = e.claiming) == null || $t.call(e, !1);
      w.token = void 0;
      try {
        (pt = (Ze = window.turnstile) == null ? void 0 : Ze.reset) == null || pt.call(Ze, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let U = null;
  function P(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== E.listening || e.now() - U.at > 3e4) {
      const V = E.listening;
      U = { ...(U == null ? void 0 : U.wallet) === V ? U : {}, wallet: V, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(V)).then((D) => {
        var J, ne;
        (U == null ? void 0 : U.wallet) === V && (U.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, U.problem = ((ne = D == null ? void 0 : D.gift) == null ? void 0 : ne.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const H = pe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return H.title = `Network reply: ${U.problem}`, [H];
  }
  function A(E, H, V = !1) {
    var Pe, $t;
    const D = H.player, J = BigInt(H.amount), ne = V ? [] : [pe("p", `🎁 ${d(H)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Xr(D).length} ${Xr(D).length === 1 ? "song" : "songs"} and ${Na(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (V) return ne;
      if (ne.push(pe("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const Ze = document.createElement("details");
        Ze.className = "ppp-how";
        const pt = document.createElement("summary");
        pt.textContent = "How does this work?", Ze.append(pt, pe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ne.push(Ze);
      }
      return ne;
    }
    if (E.walletCannotAlbums)
      return ne.push(pe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ne;
    const $e = ($t = (Pe = E.gate) == null ? void 0 : Pe.gifts) == null ? void 0 : $t.turnstileSiteKey;
    return $e && !w.token ? ne.push(pe("p", "One quick check and it is yours:", "ppp-mute"), y($e)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), ne.push(...T(E, "Sending your album…")), ne;
  }
  function T(E, H) {
    const V = [];
    return t.claiming || t.waiting ? V.push(pe("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : H, "ppp-cyan")) : t.retry && V.push(pe("p", t.retry.text, "ppp-warn"), on("Try now", () => {
      clearTimeout(x), t.retry = void 0, L(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? V.push(pe("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), on("Forget this gift link here", h, "quiet")) : t.error && V.push(pe("p", t.error, "ppp-bad"), on("Try again", () => {
      t.error = void 0, L(E);
    })), V;
  }
  const B = (E) => {
    var H;
    return !!t && !t.done && !t.error && i() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((H = t.view) != null && H.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function X(E, H = {}) {
    var $, Ee, ft, rn;
    const V = P(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return V;
    const D = t.view;
    if (t.error && !D) return [pe("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [pe("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return V;
    if (D.status === "claimed" || D.status === "claiming") return [pe("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [pe("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [pe("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(E, D, !!H.bare), ...V];
    const J = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), ne = J ? (($ = e.claimNew) == null ? void 0 : $.call(e, E)) ?? null : null, Te = ne ? ((Ee = e.replaceOld) == null ? void 0 : Ee.call(e, E)) ?? null : null;
    if (ne && Te)
      return [
        pe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        on("Replace my old player", Te, "primary"),
        on("Keep both players", ne, "quiet"),
        on("Not now", h, "quiet")
      ];
    if (ne)
      return [
        pe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        on("Claim it as a new player", ne, "primary"),
        on("Not now", h, "quiet")
      ];
    if (J)
      return [pe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), on("Forget this gift link here", h, "quiet")];
    const $e = BigInt(D.amount), Pe = Na($e).toLocaleString(), $t = pe(
      "p",
      `🎁 ${d(D)} sent you ${Jn($e)} STX of on-chain music: about ${Pe} paid plays.`,
      "ppp-gift"
    ), Ze = H.bare ? [] : [$t], pt = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, st = (rn = (ft = E.gate) == null ? void 0 : ft.gifts) == null ? void 0 : rn.turnstileSiteKey;
    return pt ? (st && !w.token ? Ze.push(pe("p", "One quick check and it is yours:", "ppp-mute"), y(st)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), Ze.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? H.bare || Ze.push(pe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? Ze.push(pe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), on("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && Ze.push(pe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), on("Forget this gift link here", h, "quiet")), Ze;
  }
  async function Q(E, H, V) {
    var D;
    try {
      const J = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((D = J == null ? void 0 : J.gift) != null && D.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (V) return { ok: !1 };
    }
    return H();
  }
  const oe = pe("div", "", "ppp-gift-fold");
  let Y = 250000n, m = "", C = "";
  const _ = (E) => {
    try {
      const H = JSON.parse(e.store.get(Yg(E)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, M = (E, H) => e.store.set(Yg(E), JSON.stringify(H.slice(0, 50)));
  async function W(E) {
    const H = _(E);
    for (const V of H)
      if (!(V.view && ["claimed", "refunded", "expired"].includes(V.view.status)))
        try {
          V.view = !V.view || V.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: V.id, ...V.txid ? { txid: V.txid } : {} }) }) : await e.json("/radio/gift?id=" + V.id), V.error = void 0;
        } catch (D) {
          V.error = D.message;
        }
    M(E, H), e.changed();
  }
  async function F(E) {
    if (m) return;
    m = "Starting your gift…", C = "", e.changed();
    let H = null;
    try {
      H = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: Y.toString() }) });
      const V = _(E);
      V.unshift({ id: H.id, code: H.code, amount: Y.toString(), at: e.now() }), M(E, V), m = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, H.depositTo, BigInt(H.deposit), H.memo), J = _(E), ne = J.find((Te) => Te.id === H.id);
      ne && (ne.txid = D, ne.view = { status: "pending-deposit", amount: Y.toString(), source: "friend", from: E, label: "", expires: 0 }), M(E, J), C = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(E);
    } catch (V) {
      C = V.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const we = (E) => "xtrata.radio.gift.players.v1:" + E, le = (E) => {
    try {
      const H = JSON.parse(e.store.get(we(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id)) : [];
    } catch {
      return [];
    }
  };
  async function Ke(E, H) {
    var V;
    if (!m) {
      m = "Checking the player…", C = "", e.changed();
      try {
        const D = H.tracks.split(/[\s,]+/).filter(Boolean).map((Ze) => Number(Ze.replace(/^#/, ""))), J = (H.explicit ?? "").split(/[\s,]+/).map((Ze) => Ze.replace(/^#/, "")).filter(Boolean).map(Number), ne = Xb({ title: H.title.trim(), subtitle: H.subtitle.trim(), tracks: D, cover: (V = H.cover) != null && V.trim() ? Number(H.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        m = "Sign in your wallet…", e.changed();
        const Te = { admin: E, hash: qb(ne), issued: e.now() }, $e = await e.sign(E, rL(Te));
        m = "Making the player…", e.changed();
        const Pe = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ne, request: Te, signature: $e }) }), $t = le(E).filter((Ze) => Ze.id !== Pe.id);
        $t.unshift({ id: Pe.id, title: Pe.title, tracks: Pe.tracks }), e.store.set(we(E), JSON.stringify($t.slice(0, 30))), C = `${Pe.existing ? "That player already exists" : "Player made"} ✓ “${Pe.title}” · ${Pe.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        C = D.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const I = (E, H) => KI(E || location.origin + "/radio.html", H), R = (E) => {
    try {
      const H = JSON.parse(e.store.get(Wg(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id) && Array.isArray(V.codes)) : [];
    } catch {
      return [];
    }
  }, de = (E, H) => e.store.set(Wg(E), JSON.stringify([...H.filter((V) => V.codes.length), ...H.filter((V) => !V.codes.length)].slice(0, 80))), be = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Ne = (E, H) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(H) });
  let Ae = 0;
  async function wt(E) {
    const H = R(E);
    for (const D of H)
      if (!be(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Ne("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const ne = H.find((Te) => Te.id === J.id);
        if (ne) {
          ne.error || (ne.view = J);
          continue;
        }
        H.push({ id: J.id, codes: [], count: J.count, amount: J.amount, label: J.label, player: J.player, depositTo: "", deposit: J.deposit, memo: J.memo, at: 0, view: J });
      }
    } catch {
    }
    const V = /* @__PURE__ */ new Map();
    for (const D of R(E)) (!V.has(D.id) || D.codes.length > V.get(D.id).codes.length) && V.set(D.id, D);
    for (const D of H) {
      const J = V.get(D.id);
      J ? V.set(D.id, { ...J, view: D.view ?? J.view, error: D.error, txid: J.txid ?? D.txid, codes: J.codes.length >= D.codes.length ? J.codes : D.codes, depositTo: J.depositTo || D.depositTo }) : V.set(D.id, D);
    }
    de(E, [...V.values()]), e.changed();
  }
  async function je(E, H) {
    const V = R(E).find((D) => D.id === H);
    if (!(!V || !V.depositTo || m)) {
      m = "Approve the payment in your wallet…", C = "", e.changed();
      try {
        const D = await e.pay(E, V.depositTo, BigInt(V.deposit), V.memo), J = R(E), ne = J.find((Te) => Te.id === H);
        ne && (ne.txid = D), de(E, J), C = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", wt(E);
      } catch (D) {
        C = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Be(E, H, V, D) {
    if (m) return;
    if (!H.ok) {
      C = H.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", C = "", e.changed();
    let J = null;
    try {
      const ne = { creator: E, count: H.count, amount: H.amount.toString(), label: V, issued: e.now(), ...D ? { player: D } : {} }, Te = await e.sign(E, qI(ne));
      m = "Making your links…", e.changed(), J = await Ne("/radio/gift/batch", { request: ne, signature: Te });
      const $e = R(E);
      $e.unshift({ id: J.id, codes: J.codes, count: H.count, amount: J.amount, label: V, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), de(E, $e);
    } catch (ne) {
      C = ne.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await je(E, J.id);
  }
  async function _e(E, H, V) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", C = "", e.changed();
      try {
        const D = { creator: E, batch: H, days: V, issued: e.now() }, J = await e.sign(E, eL(D));
        m = "Extending…", e.changed();
        const ne = await Ne("/radio/gift/batch/extend", { request: D, signature: J }), Te = R(E);
        for (const $e of (ne == null ? void 0 : ne.batches) ?? []) {
          const Pe = Te.find(($t) => $t.id === $e.id);
          Pe && (Pe.view = $e, Pe.error = void 0);
        }
        de(E, Te), C = ne != null && ne.extended ? `Extended ✓ ${ne.extended === 1 ? "That batch has" : `${ne.extended} batches have`} ${V} more days.` : "There was nothing live to extend.";
      } catch (D) {
        C = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const Bn = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function En(E, H) {
    const V = H.filter((ne) => {
      var Te;
      return ((Te = ne.view) == null ? void 0 : Te.status) === "live" && ne.view.copies.waiting > 0;
    });
    if (!V.length) return null;
    const D = Math.min(...V.map((ne) => ne.view.expires)), J = pe("p", "", "ppp-batch-extend");
    J.append(pe("span", `${V.length} live ${V.length === 1 ? "batch" : "batches"} · the first runs out in ${Bn(D)} days. Extend ${V.length === 1 ? "it" : "them all"}: `));
    for (const ne of zg) {
      const Te = on(`+${ne} days`, () => void _e(E, "all", ne), "tiny");
      Te.disabled = !!m, J.append(Te);
    }
    return J;
  }
  const ht = () => Bt(!!Xe.value, Ye.value, Rt.value);
  function Bt(E, H, V) {
    const D = H === "max" ? YI(E) : Number(H), J = Kb(D, E), ne = Number(V);
    return !Number.isInteger(ne) || ne < 1 || ne > Da ? { ok: !1, reason: `Make 1 to ${Da} copies at a time.`, album: E, plays: D, amount: J, count: ne } : ZI(J) ? { ok: !0, reason: "", album: E, plays: D, amount: J, count: ne, bill: WI(ne, J, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: J, count: ne };
  }
  const Pt = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? JI;
  }, z = (E = ht()) => {
    if (!E.ok) return E.reason;
    const H = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${Jn(H.holders)} to song holders, ${Jn(H.fees)} network fees)${E.album ? `, ${Jn(H.float)} for the album’s likes` : ""}, ${Jn(H.reserve)} kept so a listener can return what is left, + ${Jn(H.sendFee)} to send it = ${Jn(H.perCopy)} STX. ${E.count} copies = ${Jn(H.total)} STX, paid now in one payment. Copies nobody claims within ${Pt()} days come back to you, and you can extend that at any time.`;
  }, O = (E, H) => H.codes.map((V) => I(E, V)), te = pe("input");
  te.type = "range", te.min = String(Gb), te.max = String(Ph), te.step = "10000", te.value = String(Y), te.setAttribute("aria-label", "Gift amount");
  const re = pe("p", "", "ppp-gift-amount"), ue = on("", () => {
    const E = e.main();
    E && F(E);
  }, "primary"), bt = () => {
    re.textContent = He(), ue.textContent = `Gift ${Jn(Y)} STX`;
  };
  te.oninput = () => {
    Y = BigInt(te.value), bt();
  };
  const He = () => `${Jn(Y)} STX · about ${Na(Y).toLocaleString()} paid plays · you pay ${Jn(Y + Dl)} STX with the network fee`;
  bt();
  const ze = pe("input");
  ze.maxLength = 60, ze.placeholder = "Title, e.g. Proof of Sound", ze.setAttribute("aria-label", "Player title");
  const vt = pe("input");
  vt.maxLength = 80, vt.placeholder = "Artist (optional)", vt.setAttribute("aria-label", "Player subtitle");
  const De = pe("textarea");
  De.rows = 3, De.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", De.setAttribute("aria-label", "Songs");
  const Ie = pe("input");
  Ie.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ie.setAttribute("aria-label", "Explicit songs");
  const qe = pe("input");
  qe.inputMode = "numeric", qe.placeholder = "Cover inscription number (optional), shown when the album loads", qe.setAttribute("aria-label", "Cover inscription");
  const Xe = pe("select");
  Xe.setAttribute("aria-label", "Batch album");
  const Ye = pe("select");
  Ye.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...rd])].sort((H, V) => H - V)) Ye.append(_a(`${E.toLocaleString()} plays`, String(E)));
  Ye.append(_a("Max (1 STX)", "max")), Ye.value = String(rd[0]);
  const Rt = pe("input");
  Rt.type = "number", Rt.min = "1", Rt.max = String(Da), Rt.value = "10", Rt.setAttribute("aria-label", "Copies");
  const pn = pe("input");
  pn.maxLength = 40, pn.placeholder = "Label, e.g. Opera launch", pn.setAttribute("aria-label", "Batch label");
  const dn = pe("p", "", "ppp-mute"), Wn = () => {
    dn.textContent = z();
  };
  for (const E of [Xe, Ye, Rt])
    E.oninput = Wn, E.onchange = Wn;
  Wn();
  let Ut = null, gn = 0;
  async function mr() {
    gn = e.now();
    try {
      Ut = dL(await e.json("/radio/giveaway/players"));
    } catch {
      Ut = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const Zr = (E, H) => {
    var D;
    if (((D = Xg(R(E), e.now()).next) == null ? void 0 : D.n) !== H.n) {
      C = "That batch is already made. Check again.", e.changed();
      return;
    }
    Be(E, Bt(!1, String(H.plays), String(H.count)), H.label);
  };
  function Fn(E) {
    var Te;
    const H = Xg(R(E), e.now()), V = Hh(), D = pe("div", "", "ppp-drop");
    D.append(
      pe("p", `The ${V.players.toLocaleString("en-GB")} players (admin) · ${H.done} of ${V.batches} batches live`, "ppp-cyan"),
      pe("p", `${V.tiers.map(($e) => `${$e.count} ${Vs($e.id).name}`).join(", ")}. ${V.batches} batches, ${Jn(V.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = pe("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const $e of H.steps) {
      const Pe = pe("li"), $t = $e.state === "live" ? "✓" : $e.state === "touched" ? "!" : $e.state === "todo" ? "○" : "…";
      if (Pe.append(pe("span", `${$t} ${$e.step.n}. ${Vs($e.step.tier).name} · ${$e.step.count} × ${$e.step.plays.toLocaleString("en-GB")} plays · ${Jn($e.step.deposit)} STX`, "t"), pe("span", $e.detail, $e.state === "live" ? "ppp-ok" : $e.state === "touched" ? "ppp-warn" : "ppp-mute")), $e.state === "todo" && ((Te = H.next) == null ? void 0 : Te.n) === $e.step.n) {
        const Ze = on("Sign and pay", () => Zr(E, $e.step), "tiny");
        Ze.disabled = !!m, Pe.append(Ze);
      }
      if ($e.state === "unpaid" && $e.batch) {
        const Ze = on("Pay now", () => void je(E, $e.batch.id), "tiny");
        Ze.disabled = !!m, Pe.append(Ze);
      }
      J.append(Pe);
    }
    D.append(J);
    for (const $e of H.problems) D.append(pe("p", $e, "ppp-warn"));
    H.ready ? D.append(
      pe("p", `All ${V.batches} batches are live: ${H.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      fr("drop-copy", `Copy the ${H.codes.length.toLocaleString("en-GB")} links`, () => H.codes.join(`
`), "tiny", e.changed)
    ) : D.append(pe("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - gn > 6e4 && mr(), Ut && D.append(pe("p", Ut.text, Ut.ok ? "ppp-ok" : "ppp-mute"));
    const ne = on("Check again", () => {
      Ae = e.now(), wt(E), mr();
    }, "tiny");
    return ne.disabled = !!m, D.append(ne), D;
  }
  function br(E, H, V) {
    const D = H.view, J = D == null ? void 0 : D.copies, ne = H.error ? H.error : !D || D.status === "pending-deposit" ? H.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, Te = pe("li");
    if (Te.append(pe("span", `${H.label || "Batch"} · ${H.count} × ${Jn(BigInt(H.amount))} STX`, "t"), pe("span", ne, "ppp-mute")), !H.txid && H.depositTo && (!D || D.status === "pending-deposit") && Te.append(on("Pay now", () => void je(E, H.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      Te.append(pe("span", `${Bn(D.expires)} days left`, "ppp-mute"));
      for (const $e of zg) {
        const Pe = on(`+${$e}`, () => void _e(E, H.id, $e), "tiny");
        Pe.title = `Extend this batch by ${$e} days (a signature, no payment)`, Pe.setAttribute("aria-label", `Extend ${H.label || "this batch"} by ${$e} days`), Pe.disabled = !!m, Te.append(Pe);
      }
    }
    if (H.codes.length && (D == null ? void 0 : D.status) === "live") {
      const $e = O(V, H);
      Te.append(
        fr("batch-copy:" + H.id, "Copy all links", () => $e.join(`
`), "tiny", e.changed),
        fr("batch-csv:" + H.id, "Copy as CSV", () => ["copy,link", ...$e.map((Pe, $t) => `${$t + 1},${Pe}`)].join(`
`), "tiny", e.changed)
      );
    } else H.codes.length || Te.append(pe("span", "links were made on another device", "ppp-mute"));
    return Te;
  }
  const yn = pe("select");
  yn.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...rd])].sort((H, V) => H - V)) yn.append(_a(`${E.toLocaleString()} plays`, String(E)));
  yn.value = "50";
  const Dt = pe("input");
  Dt.type = "number", Dt.min = "1", Dt.max = String(Da), Dt.value = "10", Dt.setAttribute("aria-label", "How many copies");
  const dt = pe("input");
  dt.maxLength = 40, dt.placeholder = "A note recipients see, e.g. Launch week (optional)", dt.setAttribute("aria-label", "Note for recipients");
  const Ct = pe("p", "", "ppp-mute");
  function un(E, H, V) {
    const D = () => Bt(!0, yn.value, Dt.value), J = () => {
      Ct.textContent = z(D());
    };
    for (const pt of [yn, Dt])
      pt.oninput = J, pt.onchange = J;
    J();
    const ne = () => (dt.value.trim() || H.title).replace(/[^ -~]/g, "").slice(0, 40), Te = on("Sign, pay and make links", () => {
      Be(E, D(), ne(), H.id);
    }, "primary");
    Te.disabled = !!m;
    const $e = (pt, st) => {
      const $ = pe("label", pt);
      return $.append(st), $;
    }, Pe = [
      pe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      $e("Plays in each ", yn),
      $e("Copies ", Dt),
      dt,
      Ct,
      Te
    ];
    e.now() - Ae > 3e4 && (Ae = e.now(), wt(E));
    const $t = R(E).filter((pt) => pt.player === H.id);
    if ($t.length) {
      const pt = pe("ul", "", "ppp-gift-list");
      for (const st of $t.slice(0, 10)) pt.append(br(E, st, V));
      Pe.push(pt);
    }
    const Ze = En(E, R(E));
    return Ze && Pe.push(Ze), m && Pe.push(pe("p", m, "ppp-cyan")), C && Pe.push(pe("p", C, /✓/.test(C) ? "ppp-ok" : "ppp-warn")), Pe;
  }
  function Cr(E) {
    var J, ne;
    const H = (J = E.gate) == null ? void 0 : J.gifts;
    if (!(H != null && H.enabled) || !H.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const V = e.main(), D = [pe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!V)
      D.push(pe("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (H.admin) {
      const Te = pe("div", "", "ppp-gift-admin"), $e = (st, $) => {
        const Ee = pe("label", st);
        return Ee.append($), Ee;
      }, Pe = le(V);
      Te.append(
        pe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        ze,
        vt,
        De,
        qe,
        Ie,
        on("Sign and make player", () => void Ke(V, { title: ze.value, subtitle: vt.value, tracks: De.value, cover: qe.value, explicit: Ie.value }))
      );
      const $t = on("Sign, pay and make links", () => {
        Be(V, ht(), pn.value.trim(), Xe.value || void 0);
      });
      $t.disabled = !!m;
      const Ze = Xe.value;
      Xe.replaceChildren(_a("No album (starter copies)", ""), ...Pe.map((st) => _a(`${st.title} · ${st.tracks} songs`, st.id))), Pe.some((st) => st.id === Ze) && (Xe.value = Ze), Wn(), Te.append(
        pe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${Pt()} days unless you extend`, "ppp-cyan"),
        $e("Album ", Xe),
        $e("Plays each ", Ye),
        $e("Copies ", Rt),
        pn,
        dn,
        $t
      ), e.now() - Ae > 3e4 && (Ae = e.now(), wt(V));
      const pt = R(V);
      if (pt.length) {
        const st = pe("ul", "", "ppp-gift-list");
        for (const Ee of pt.slice(0, 20)) st.append(br(V, Ee, ((ne = E.gate) == null ? void 0 : ne.radioUrl) ?? null));
        Te.append(st);
        const $ = En(V, pt);
        $ && Te.append($);
      }
      Te.append(Fn(V)), D.push(Te);
    }
    return m && D.push(pe("p", m, "ppp-cyan")), C && D.push(pe("p", C, /✓/.test(C) ? "ppp-ok" : "ppp-warn")), oe.replaceChildren(...D), oe;
  }
  return { banner: X, funder: Q, renderFold: Cr, copies: un, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: B };
}
const gL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function yL(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, s = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    s && t.push({
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
  return t;
}
const wL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function mL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = wL(o);
    return n.every((a) => i.includes(a));
  })()), s = {
    recent: (o, i) => (t.recents[i.slot] ?? 0) - (t.recents[o.slot] ?? 0) || i.slot - o.slot,
    newest: (o, i) => i.slot - o.slot,
    oldest: (o, i) => o.slot - i.slot,
    title: (o, i) => {
      var a, c;
      return (((a = o.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || o.slot - i.slot;
    }
  };
  return r.sort((o, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(o.slot)) || s[t.sort](o, i));
}
function bL(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Sf = /* @__PURE__ */ new Set(), Fl = (e) => (Sf.add(e), () => {
  Sf.delete(e);
}), jl = () => {
  for (const e of [...Sf])
    try {
      e();
    } catch {
    }
}, Zg = "xtrata:al-thumb:v1:", Dh = "-", Pa = 96, xL = 24 * 1024 * 1024, vn = /* @__PURE__ */ new Map(), Jg = /* @__PURE__ */ new Set(), vf = [];
let sd = !1, id;
const sc = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Zg + e);
    window.localStorage.setItem(Zg + e, t);
  } catch {
  }
  return null;
};
function Fh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return t(e);
      const o = new Image(), i = setTimeout(() => t(e), 8e3);
      o.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(o.naturalWidth, o.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = Pa, s.fillStyle = "#143a40", s.fillRect(0, 0, Pa, Pa), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, Pa, Pa), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, o.onerror = () => {
        clearTimeout(i), t(e);
      }, o.src = e;
    } catch {
      t(e);
    }
  });
}
async function SL(e) {
  var c, u, h, d, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const o = (y) => {
    let v = 0;
    for (; ; ) {
      const x = r.slice(v).search(/<img\b/i);
      if (x < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + x, U = r.indexOf(">", L);
      if (U < 0)
        return r = r.slice(L), null;
      const P = r.slice(L, U + 1), A = P.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = P.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      v = U + 1;
    }
  }, i = (w = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : w.call(d);
  if (!i)
    return r = await t.text(), o(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: y, value: v } = await i.read();
    if (y) break;
    s += v.byteLength, r += a.decode(v, { stream: !0 });
    const x = o(!1);
    if (x)
      return await i.cancel(), x;
    if (s > xL)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function vL() {
  if (!sd) {
    sd = !0;
    try {
      for (; vf.length; ) {
        const e = vf.shift();
        if (!vn.has(e))
          try {
            const t = await SL(e);
            if (t === null) continue;
            if (!t) {
              vn.set(e, ""), sc(e, Dh), jl();
              continue;
            }
            const n = await Fh(t);
            vn.set(e, n), n.startsWith("data:image/jpeg") && sc(e, n), jl();
          } catch {
          }
      }
    } finally {
      sd = !1;
    }
  }
}
function Rl(e, t) {
  if (t && !vn.get(e) ? (vn.set(e, t), Fh(t).then((r) => {
    r !== t && (vn.set(e, r), r.startsWith("data:image/jpeg") && sc(e, r), jl());
  })) : t === "" && !vn.has(e) && vn.set(e, ""), vn.has(e)) return vn.get(e);
  const n = sc(e);
  if (n != null) {
    const r = n === Dh ? "" : n;
    return vn.set(e, r), r;
  }
  return Jg.has(e) || (Jg.add(e), vf.push(e), id || (id = setTimeout(() => {
    id = void 0, vL();
  }, 1200))), "";
}
function Qg(e) {
  if (vn.has(e)) return vn.get(e);
  const t = sc(e);
  if (t == null) return null;
  const n = t === Dh ? "" : t;
  return vn.set(e, n), n;
}
const ad = /* @__PURE__ */ new Map(), cd = /* @__PURE__ */ new Set();
function ll(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : ad.has(e) ? ad.get(e) : (cd.has(e) || (cd.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    ad.set(e, t), jl();
  }).catch(() => {
    cd.delete(e);
  })), "");
}
const Oi = 12, AL = 5e3, Un = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Hi = (e, t, n = "") => {
  const r = Un("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function EL(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = Oi;
  const d = Un("div", "", "ppp-shelf-box");
  Fl(() => e.changed());
  const w = (_) => "xtrata.radio.shelf.pins.v1:" + _, y = (_) => "xtrata.radio.shelf.recent.v1:" + _, v = (_, M) => {
    try {
      return JSON.parse(e.store.get(_) || "null") ?? M;
    } catch {
      return M;
    }
  }, x = (_) => new Set(v(w(_), []).filter((M) => Number.isSafeInteger(M))), L = (_) => {
    const M = v(y(_), {}), W = {};
    for (const [F, we] of Object.entries(M)) Number.isSafeInteger(Number(F)) && typeof we == "number" && (W[Number(F)] = we);
    return W;
  };
  async function U(_) {
    if (!s) {
      s = !0, o = !1;
      try {
        const M = [];
        let W = 0, F = 0;
        for (let we = 0; we < AL / 100 + 1; we++) {
          const le = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${W}&limit=100`);
          if (M.push(...yL(le == null ? void 0 : le.shelf)), F = Number(le == null ? void 0 : le.total) || M.length, !(le != null && le.next) || !Number.isSafeInteger(le.next)) break;
          W = le.next;
        }
        _ === t && (n = M, r = F, i = e.now());
      } catch {
        o = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const P = () => {
    i = -1 / 0;
  }, A = Un("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = Oi, e.changed();
  };
  const T = Un("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const _ of gL) {
    const M = document.createElement("option");
    M.value = _.value, M.textContent = _.label, T.append(M);
  }
  T.onchange = () => {
    c = T.value, h = Oi, e.changed();
  };
  const B = Hi("", () => {
    u = !u, h = Oi, e.changed();
  }, "tiny"), X = Un("div", "", "ppp-shelf-tools");
  X.append(A, T, B);
  const Q = Un("div"), oe = Un("div");
  function Y(_) {
    const M = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (M !== t && (t = M, n = [], r = 0, i = -1 / 0, h = Oi), !M || _.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && U(M), !n.length)
      return o ? (oe.replaceChildren(Un("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Hi("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(oe), d) : null;
    const W = x(M), F = L(M), we = mL(n, { query: a, sort: c, pinnedOnly: u, pins: W, recents: F });
    A.value !== a && (A.value = a), T.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const le = [];
    if (_.slot > 0 && le.push(Hi("← My player", () => e.open(0), "quiet")), !we.length) le.push(Un("p", "No album matches that.", "ppp-mute"));
    else {
      const Ke = Un("ul", "", "ppp-shelf-list");
      for (const I of we.slice(0, h)) {
        const R = Un("li", "", I.slot === _.slot ? "now" : ""), de = W.has(I.slot), be = Hi(de ? "★" : "☆", () => {
          const ht = new Set(W);
          de ? ht.delete(I.slot) : ht.add(I.slot), e.store.set(w(M), JSON.stringify([...ht])), e.changed();
        }, "tiny");
        be.setAttribute("aria-label", de ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const Ne = [I.player.subtitle, `${Xr(I.player).length} ${Xr(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ae = I.slot === _.slot, wt = Hi(Ae ? "Playing" : "Select", () => {
          e.store.set(y(M), JSON.stringify(bL({ ...F, [I.slot]: e.now() }))), e.open(I.slot);
        }, Ae ? "tiny ppp-pick" : "tiny primary ppp-pick");
        wt.disabled = Ae, wt.setAttribute("aria-label", Ae ? `${I.player.title}, playing now` : `Open ${I.player.title}`);
        const je = Xr(I.player)[0], Be = I.player.cover ?? (je == null ? void 0 : je.id), _e = Be ? Rl(String(Be)) : "", Bn = Un("span", "", "ppp-shelf-art");
        if (_e) {
          const ht = document.createElement("img");
          ht.src = _e, ht.alt = "", ht.decoding = "async", Bn.append(ht);
        } else Bn.textContent = "💿";
        const En = Un("span", "", "ppp-shelf-txt");
        En.append(Un("span", I.player.title, "t"), Un("span", Ne, "ppp-mute")), R.append(be, Bn, En, wt), Ke.append(R);
      }
      le.push(Ke), we.length > h && le.push(Hi(`Show more (${we.length - h} left)`, () => {
        h += Oi, e.changed();
      }, "quiet"));
    }
    return o && le.push(Un("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Q.replaceChildren(...le), d.firstChild !== X && d.replaceChildren(X, Q), d;
  }
  return { render: Y, invalidate: P, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const _ = L(t), M = [...n].filter((W) => W.player).sort((W, F) => (_[F.slot] ?? 0) - (_[W.slot] ?? 0) || F.slot - W.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const ey = "http://www.w3.org/2000/svg", kL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function zl(e = "", t = !1) {
  const n = document.createElementNS(ey, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of kL) {
    const o = document.createElementNS(ey, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const ot = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fn = (e, t, n, r = !1) => {
  const s = ot("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Wb = (e) => e.toLocaleString(), ty = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, $L = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Gl(e, t) {
  const n = ot("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = ot("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(ot("i", "", s < t ? "✓" : String(s + 1)), ot("span", "", r)), n.append(o);
  }), n;
}
function IL() {
  const e = ot("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(ot("span", "tier-disc__mark", "?")), e;
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
}, LL = (e) => e ? `Disc ${e} is yours` : xn.gift.title, CL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Wb(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", TL = (e) => e ? `${Wb(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function ny(e, t = !1) {
  const n = ot("div", "al-now" + (t ? " al-now--big" : "")), r = ot("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const s = ot("div", "al-now__t");
  s.append(ot("b", "", e.title || "Playing now"), ot("span", "", e.artist));
  const o = ot("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return o.setAttribute("aria-hidden", "true"), o.append(ot("s"), ot("s"), ot("s")), n.append(r, s, o), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const BL = (e) => e ? `You got a ${e.name} player` : xn.landed.title;
function ML(e, t = !0) {
  const n = ot("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(ot("span", "tier-disc__mark", e.mark)), n;
}
function NL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, s = !1) {
      var h, d;
      if (!r) {
        n && !s && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const o = ot("header", "al-top"), i = ot("a", "al-brand");
      i.href = "/radio", i.append(zl("al-logo"), ot("span", "", "Xtrata "), ot("b", "", "Music")), o.append(i);
      const a = ot("div", "al-body al-body--welcome"), c = ot("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        c.append(ot("p", "al-welcome-wait", xn.checking));
      else {
        const w = $L(u);
        w >= 0 && c.append(Gl(u === "new" ? ty.fresh : ty.gift, w)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append(ML(r.tier)) : u === "gift" || u === "arriving" ? c.append(IL()) : u === "new" && c.append(zl("al-hero-mark"));
        const y = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(ot("h1", "", u === "landed" ? BL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? LL(r.spot) : v ? xn.installedNew.title : xn[u].title)), y && u === "arriving" ? c.append(ny(y, !0)) : c.append(ot("p", "", u === "gift" ? CL(r.plays, r.from, r.mystery) : u === "landed" ? TL(r.plays) : v ? xn.installedNew.body : xn[u].body)), y && u !== "arriving" && c.append(ny(y)), r.status.length) {
          const x = ot("div", "al-status");
          x.setAttribute("role", "status"), x.append(...r.status), c.append(x);
        }
        if (r.asking) c.append(ot("p", "al-hint al-hint--ask", xn.asking));
        else if (u === "back" && r.claimNew) {
          const x = xn.backClaim;
          c.append(ot("p", "al-hint", x.body)), r.canStart && r.replaceOld ? c.append(fn("al-primary", x.replace, r.replaceOld, r.busy), ot("p", "al-hint", x.replaceHint), fn("al-link", x.both, r.claimNew, r.busy), fn("al-link", x.unlock, r.unlock, r.busy)) : r.canStart && c.append(fn("al-primary", x.primary, r.claimNew, r.busy), ot("p", "al-hint", x.hint), fn("al-link", x.unlock, r.unlock, r.busy)), c.append(fn("al-link", xn.back.full, r.full));
        } else if (u === "gift") {
          const x = xn.gift;
          if (r.canStart) {
            const L = fn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? x.play : x.primary, r.start, r.busy);
            c.append(L, ot("p", "al-hint", x.hint));
          }
          r.canStart ? c.append(fn("al-link", x.returning, r.returning, r.busy)) : c.append(fn("al-link", x.full, r.full));
        } else if (u === "new" && r.installed) {
          const x = xn.installedNew;
          r.canStart && c.append(fn("al-primary", x.primary, r.returning, r.busy), ot("p", "al-hint", x.hint), fn("al-link", x.fresh, r.start, r.busy)), c.append(fn("al-link", xn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const x = xn[u];
          r.canStart && c.append(fn("al-primary", x.primary, u === "back" ? r.unlock : r.start, r.busy), ot("p", "al-hint", x.hint)), r.canStart && c.append(fn("al-link", x.returning, r.returning, r.busy)), c.append(fn("al-link", x.full, r.full));
        } else if (u === "landed") {
          if (c.append(fn("al-primary", (h = r.now) != null && h.playing ? xn.landed.playing : xn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(ot("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const x of r.albums) {
              const L = fn("al-album", "", x.run);
              if (x.cover) {
                const P = ot("img", "al-album__art");
                P.src = x.cover, P.alt = "", L.classList.add("al-album--art"), L.append(P);
              }
              const U = ot("span", "al-album__t");
              U.append(ot("b", "", x.title), ot("span", "", x.by)), L.append(U), c.append(L);
            }
          }
        } else u === "empty" && c.append(fn("al-primary", xn.empty.primary, r.restock), fn("al-link", xn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(o, a);
    }
  };
}
const _L = 20, PL = ["Album", "Passkey", "Listen"], In = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Qt = {
  grid: In('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: In('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: In('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: In('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: In('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: In('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: In('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: In('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: In('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: In('<path d="M6 9l6 6 6-6"/>', 18),
  right: In('<path d="M9 6l6 6-6 6"/>', 16),
  close: In('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: In('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: In('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: In('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: In('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: In('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ae(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Pn = (e, ...t) => ae("button", { type: "button", ...e }, ...t), Wc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, Ua = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, UL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, OL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function ry(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var _, M, W;
    if (!m || !Number.isSafeInteger(m)) return "";
    const C = (W = (M = (_ = t.radio()) == null ? void 0 : _.getState) == null ? void 0 : M.call(_)) == null ? void 0 : W.albumCover;
    return C != null && C.url && Number(C.tokenId) === m ? C.url : ll(m);
  }
  Fl(() => Y());
  function u(m) {
    var _;
    o = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const C = document.querySelector(".side");
    if (m && m !== "more") {
      for (const F of OL[m]) {
        const we = C == null ? void 0 : C.querySelector(F);
        we && (we.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = UL[m]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...m === "music" ? [d()] : []), (_ = C == null ? void 0 : C.scrollTo) == null || _.call(C, { top: 0 });
    }
    Y();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && o && a.dataset.view === "album" && u("");
  });
  const d = () => Pn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    ae("span", { class: "al-row-i", html: Qt.radio }),
    ae("span", { class: "al-row-t" }, ae("b", {}, "Xtrata Radio"), ae("small", {}, "Every song on-chain · FM, liked, all")),
    ae("span", { class: "al-row-go", html: Qt.right })
  );
  let w = null, y = !1;
  const v = () => {
    var C;
    const m = t.radio();
    y || !(m != null && m.subscribe) || (y = !0, m.subscribe((_) => {
      w = _, (s == null ? void 0 : s.mode) === "open" && Y();
    }), w = ((C = m.getState) == null ? void 0 : C.call(m)) ?? null);
  };
  r || setInterval(() => {
    var M, W;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (W = (M = t.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : W.call(M), C = e.querySelector(".al-bar > i"), _ = e.querySelectorAll(".al-times span");
    !m || !C || (C.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", _.length === 2 && (_[0].textContent = Wc(m.current || 0), _[1].textContent = m.duration ? Wc(m.duration) : "–:––"));
  }, 500);
  let x = "", L = null;
  function U(m, C, _ = {}) {
    const M = _.song || c(m.cover), F = [M ? ae("img", { src: M, alt: _.song ? "Song artwork" : `${m.title} cover` }) : ae("div", { class: "al-cover-fallback" }, ae("b", {}, m.title), m.subtitle ? ae("span", {}, m.subtitle) : null), _.paused ? ae("span", { class: "al-paused" }, ae("i", { html: Qt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], we = "al-cover" + (C ? "" : " al-cover--small") + (_.paused ? " is-paused" : "");
    return _.flip ? (F.push(ae("span", { class: "al-flip", "aria-hidden": "true", html: Qt.flip })), Pn({ class: we + " is-flippable", "aria-label": _.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: _.flip }, ...F)) : ae("div", { class: we }, ...F);
  }
  function P(m) {
    return m.plays === null || m.plays === void 0 ? ae("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ae("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ae("span", { class: "al-chip" + (m.plays <= _L ? " al-chip--low" : "") }, `${Ua(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const C = m.player, _ = C.tracks.filter((W) => !W.hidden), M = [];
    return m.step !== void 0 && M.push(Gl(PL, m.step)), m.mode === "arrive" && m.from && M.push(ae("p", { class: "al-from" }, ae("span", { html: Qt.gift }), ae("span", {}, ae("b", {}, m.from), " sent you an album"))), M.push(U(C, !0)), M.push(ae(
      "div",
      { class: "al-intro" },
      ae("h1", {}, C.title),
      C.subtitle ? ae("p", { class: "al-artist" }, C.subtitle) : null,
      _.length ? ae("p", { class: "al-songline" }, _.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      ae("span", { class: "al-chip" }, [Ua(_.length, "song", "songs"), m.offered ? Ua(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && M.push(ae("div", { class: "al-status", role: "status" }, ...m.status)), M.push(ae("div", { class: "al-grow" })), m.asking ? M.push(ae("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && M.push(Pn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ae("span", { html: Qt.playSmall }), m.primary.label)), m.hint && !m.asking && M.push(ae("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && M.push(Pn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), M;
  }
  function T(m, C) {
    const { songs: _, current: M, started: W, own: F, out: we, waiting: le } = C, Ke = m.player, I = t.radio(), R = [];
    R.push(ae("div", { class: "al-listhead" }, ae("span", {}, ae("b", {}, Ke.title), ` · ${Ua(_.length, "song", "songs")}`), P(m)));
    const de = c(Ke.cover), be = "album:" + Ke.cover;
    de && !vn.has(be) && (vn.set(be, de), Fh(de).then((Ae) => {
      Ae !== de && (vn.set(be, Ae), Y());
    }));
    const Ne = de ? vn.get(be) || de : "";
    return R.push(ae("ol", { class: "al-tracks" }, ..._.map((Ae, wt) => {
      const je = String(Ae.id) === M, Be = Rl(String(Ae.id), je && W ? F : void 0);
      return ae("li", {}, Pn(
        { class: "al-track" + (je ? " is-on" : ""), "aria-label": `Play ${Ae.title || "#" + Ae.id}`, "aria-current": je ? "true" : void 0, disabled: we || le, onClick: () => {
          var _e;
          return (_e = I == null ? void 0 : I.playToken) == null ? void 0 : _e.call(I, Ae.id);
        } },
        ae(
          "span",
          { class: "al-th" + (Be ? "" : " is-blank") },
          Be ? ae("img", { src: Be, alt: "", decoding: "async" }) : Ne ? ae("img", { src: Ne, alt: "", decoding: "async" }) : null,
          Be ? null : ae("span", { class: "al-n" }, String(wt + 1)),
          je ? ae("span", { class: "al-eq", html: Qt.eq }) : null
        ),
        ae("span", { class: "al-tt" }, Ae.title || `#${Ae.id}`, Ae.explicit ? ae("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), R;
  }
  function B(m) {
    var Be;
    const C = m.player, _ = C.tracks.filter((_e) => !_e.hidden), M = t.radio(), W = w == null ? void 0 : w.nowPlaying, F = W && C.tracks.some((_e) => String(_e.id) === String(W.tokenId)) ? String(W.tokenId) : null, we = F ? C.tracks.find((_e) => String(_e.id) === F) : null, le = m.plays === 0 && !m.playsComing, Ke = !!m.playsComing && !m.plays, I = !!(w != null && w.playing) && !!F, R = w == null ? void 0 : w.heart, de = F ? (Be = M == null ? void 0 : M.getPosition) == null ? void 0 : Be.call(M) : null;
    F && (I || ((de == null ? void 0 : de.current) ?? 0) > 0.5) && (x = C.id);
    const be = !!F && x === C.id;
    L && L !== F && (L = null);
    const Ne = be ? String((W == null ? void 0 : W.cover) || "") : "", Ae = !!Ne && L === F, je = [U(C, !le, { song: Ae ? "" : Ne, paused: be && !I, flip: Ne ? () => {
      L = L === F ? null : F, Y();
    } : void 0, flipped: Ae })];
    if (je.push(ae(
      "div",
      { class: "al-now" },
      ae(
        "div",
        { class: "al-now-t" },
        ae("div", { class: "al-song" }, we ? we.title || (W == null ? void 0 : W.title) || `#${we.id}` : C.title),
        ae("div", { class: "al-artist" }, we ? we.artist || (W == null ? void 0 : W.artist) || C.subtitle : C.subtitle || "Press play")
      ),
      F ? Pn({ class: "al-icon" + (R != null && R.liked ? " is-on" : ""), "aria-label": R != null && R.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(R != null && R.liked)), disabled: !!(R != null && R.pending) || !!(R != null && R.locked) || Ke, onClick: () => {
        var _e;
        return (_e = M == null ? void 0 : M.toggleLike) == null ? void 0 : _e.call(M);
      }, html: R != null && R.liked ? Qt.heartOn : Qt.heart }) : null
    )), le)
      je.push(ae(
        "div",
        { class: "al-out" },
        ae("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ae("p", { class: "al-out-t" }, "You've played this album out"),
        ae("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(m, !0)
      ));
    else {
      const _e = de != null && de.duration ? Math.min(100, de.current / de.duration * 100) : 0;
      je.push(ae(
        "div",
        { class: "al-prog" },
        ae("div", { class: "al-bar" }, ae("i", { style: `width: ${_e}%` })),
        ae("div", { class: "al-times" }, ae("span", {}, Wc((de == null ? void 0 : de.current) || 0)), ae("span", {}, de != null && de.duration ? Wc(de.duration) : "–:––"))
      ));
    }
    return je.push(ae(
      "div",
      { class: "al-ctl" + (le || Ke ? " is-off" : "") },
      Pn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: le || Ke, onClick: () => {
        var _e;
        return (_e = M == null ? void 0 : M.prev) == null ? void 0 : _e.call(M);
      }, html: Qt.prev }),
      Pn({ class: "al-play", "aria-label": I ? "Pause" : "Play", disabled: le || Ke, onClick: () => {
        var _e;
        return (_e = M == null ? void 0 : M.playPause) == null ? void 0 : _e.call(M);
      }, html: I ? Qt.pause : Qt.play }),
      Pn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: le || Ke, onClick: () => {
        var _e;
        return (_e = M == null ? void 0 : M.next) == null ? void 0 : _e.call(M);
      }, html: Qt.next })
    )), m.status.length && je.push(ae("div", { class: "al-status", role: "status" }, ...m.status)), je.push(...T(m, { songs: _, current: F, started: be, own: Ne, out: le, waiting: Ke })), je.push(ae("div", { class: "al-grow" })), je.push(Pn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => u(o === "more" ? "" : "more") },
      ae("span", {}, "More ", ae("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ae("span", { html: Qt.down })
    )), je;
  }
  function X(m, C) {
    const _ = ae("div", { class: "al-topups" + (C ? " al-topups--primary" : "") }), M = C ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const W of M) {
      const F = m.myPlays !== void 0 && m.myPlays >= W && !m.playsComing && !m.busy;
      _.append(Pn({ class: "al-topup", disabled: !F, onClick: () => t.topUp(W) }, C ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return C && _.append(Pn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), _;
  }
  function Q(m) {
    const C = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), _ = ae(
      "div",
      { class: "al-card" },
      ae("div", { class: "al-card-h" }, ae("b", {}, `Add plays to ${m.player.title}`), ae("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      X(m, !1),
      ae("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : C ? `Moved from My player · ${Ua(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !C && !m.playsComing && m.myPlays !== void 0 ? Pn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), M = (F, we, le, Ke) => Pn(
      { class: "al-row", onClick: Ke },
      ae("span", { class: "al-row-i", html: F }),
      ae("span", { class: "al-row-t" }, ae("b", {}, we), ae("small", {}, le)),
      ae("span", { class: "al-row-go", html: Qt.right })
    ), W = ae(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      M(Qt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, Y();
      }),
      i ? ae("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ae(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ae("div", { class: "al-sheet-h" }, ae("b", {}, "More"), Pn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: Qt.close })),
      m.mode === "open" ? _ : null,
      ae(
        "div",
        { class: "al-rows" },
        M(Qt.grid, "My music", "Your albums and the radio", () => u("music")),
        M(Qt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        m.canMake ? M(Qt.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        M(Qt.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        W
      )
    );
  }
  function oe(m) {
    var le, Ke;
    const C = m.player, _ = w == null ? void 0 : w.nowPlaying, M = _ && C.tracks.some((I) => String(I.id) === String(_.tokenId)) ? String(_.tokenId) : null, W = !!(w != null && w.playing) && !!M, F = M ? (Ke = (le = t.radio()) == null ? void 0 : le.getPosition) == null ? void 0 : Ke.call(le) : null;
    M && (W || ((F == null ? void 0 : F.current) ?? 0) > 0.5) && (x = C.id);
    const we = !!M && x === C.id;
    return T(m, {
      songs: C.tracks.filter((I) => !I.hidden),
      current: M,
      started: we,
      own: we ? String((_ == null ? void 0 : _.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function Y() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...oe(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const C = ae(
      "header",
      { class: "al-top" },
      ae("a", { class: "al-brand", href: "/radio" }, zl("al-logo"), "Xtrata ", ae("b", {}, "Music")),
      m.mode === "open" ? Pn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: Qt.grid }) : null
    ), _ = ae("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? B(m) : A(m));
    e.replaceChildren(C, _, ...o === "more" ? [ae("div", { class: "al-scrim", onClick: () => u("") }), Q(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, Y();
        return;
      }
      const C = !!s;
      s = m, !m && (C || o) && (o = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, Y();
    },
    sheet: () => o,
    setSheet: u
  };
}
const HL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", DL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${HL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, FL = (e) => DL("source|audio", e), jL = 48 * 1024 * 1024;
function RL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function zL(e) {
  const t = e.fetch ?? ((...h) => fetch(...h));
  let n = null, r = null, s = "", o = null;
  const i = (h) => {
    n = h, e.changed();
  }, a = () => {
    var h;
    if (o == null || o.abort(), o = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (h = r.load) == null || h.call(r);
      } catch {
      }
    s.startsWith("blob:") && URL.revokeObjectURL(s), s = "";
  };
  async function c(h, d, w = 0) {
    var A, T, B;
    const y = "/inscription/" + h, v = await t(y, { signal: d }), x = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((T = v.body) == null ? void 0 : T.cancel()), y;
    if (!x.includes("text/html"))
      throw await ((B = v.body) == null ? void 0 : B.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > jL) throw new Error("too large");
    const U = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (U) return RL(U[1].replace(/&amp;/g, "&"));
    const P = w === 0 ? FL(L) : null;
    if (P) return c(Number(P), d, 1);
    throw new Error("no audio");
  }
  async function u(h) {
    var w;
    a();
    const d = o = new AbortController();
    i({ id: h, state: "loading" });
    try {
      const y = await c(h, d.signal);
      if (d.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (s = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          a(), i({ id: v, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), d.signal.aborted) return;
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
const GL = ["Earned", "Claim", "Yours"], KL = ["Connect", "Link", "Name"], Nt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, bn = (e, t, n, r = !1) => {
  const s = Nt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, oy = (e, t, n, r = !1) => {
  const s = bn("al-album", "", n, r), o = Nt("span", "al-album__t");
  return o.append(Nt("b", "", e), Nt("span", "", t)), s.append(o), s;
}, VL = (e) => `No. ${String(e).padStart(4, "0")}`, XL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function qL(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = Nt("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), s.append(a), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = Nt("header", "al-top"), u = Nt("a", "al-brand");
      u.href = "/radio", u.append(zl("al-logo"), Nt("span", "", "Xtrata "), Nt("b", "", "Music")), c.append(u);
      const h = Nt("div", "al-welcome"), d = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? Gl(KL, XL(i)) : Gl(GL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const P = Nt("div", "tier-disc tier-disc--mid");
        P.dataset.tier = i.tier.id, P.append(Nt("span", "tier-disc__mark", i.tier.mark)), h.append(P);
      } else if (d !== "have" && d !== "get") {
        const P = o(i);
        P.classList.toggle("aw-art--small", d === "name"), h.append(P);
      }
      const v = d === "ready" ? `Your ${w} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(Nt("h1", "", v));
      const x = (P, A = "") => h.append(Nt("p", A, P)), L = [];
      if (d === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(bn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), Nt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), bn("al-link", "Later", i.later));
      else if (d === "name")
        y ? (x(`Your record will carry ${y} beside your player’s address.`), L.push(bn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), bn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          oy("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          oy("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          bn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), L.push(bn("al-primary", "Check again", i.refresh, i.busy), bn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(Nt("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), L.push(bn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(bn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (x(`Found it: ${y}. It goes on your plaque beside your player’s address.`), L.push(bn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(bn("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(bn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(bn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(bn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const P = Nt("ol", "aw-steps"), A = Nt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Nt("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const B = Nt("li");
        B.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Nt("span", "ppp-addr-full", i.player), i.copyAddress());
        const X = Nt("li", "", "Check again, and your name shows on the preview before you claim.");
        P.append(A, B, X), h.append(P), L.push(bn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), bn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const P = Nt("p", "al-hint"), A = Nt("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", P.append(A), h.append(P);
        }
      } else if (x(`${w} record ${VL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(bn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const P = Nt("a", "al-link", "Open it full screen ↗");
        P.href = `/i/${i.inscription}`, P.target = "_blank", P.rel = "noopener", L.push(P);
      }
      if (i.status.length) {
        const P = Nt("div", "al-status");
        P.setAttribute("role", "status"), P.append(...i.status), h.append(P);
      }
      i.asking ? h.append(Nt("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const U = Nt("div", "al-body al-body--welcome");
      U.append(h), e.hidden = !1, e.replaceChildren(c, U);
    }
  };
}
const Zb = "xtrata.xyz/music/release", YL = "Release music on Xtrata Music; no spending permission", WL = (e) => ({
  domain: wr({ name: Et(Zb), version: Et("1"), "chain-id": An(1) }),
  message: wr({ purpose: Et(YL), artist: Et(e.artist), release: Et(e.hash), issued: An(e.issued) })
}), ZL = "Set the price of my release on Xtrata Music; no spending permission", JL = 100000n, QL = 1000000000n, eC = (e) => e === 0n || e >= JL && e <= QL, tC = (e) => ({
  domain: wr({ name: Et(Zb), version: Et("1"), "chain-id": An(1) }),
  message: wr({ purpose: Et(ZL), artist: Et(e.artist), release: Et(e.release), price: An(BigInt(e.price)), issued: An(e.issued) })
}), Di = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, nC = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, me = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Ln = (e, t, n = "") => {
  const r = me("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Zc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), sy = (e) => {
  const t = Xr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Jc(e, t, n = "", r = "") {
  const s = me("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(me("span", t)), s;
}
const ld = (e) => !!e && xf(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function rC(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", o = "";
  const i = (() => {
    try {
      const z = new URLSearchParams(location.search).get("release");
      return xf(z) ? z : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (z) => "xtrata.radio.releases.shelf.v1:" + z;
  let u = null, h = !1, d = -1 / 0;
  const w = (z, O, te) => {
    const re = Array.isArray(O) ? O.filter(ld).map((ue) => ({ ...ue, hidden: !!ue.hidden })) : [];
    u = { for: z, albums: re, fresh: te }, te && e.store.set(c(z), JSON.stringify(re));
  }, y = (z) => {
    try {
      w(z, JSON.parse(e.store.get(c(z)) || "[]"), !1);
    } catch {
      w(z, [], !1);
    }
  }, v = () => {
    const z = e.player().address;
    return z && (u == null ? void 0 : u.for) === z ? u.albums : [];
  };
  async function x(z, O = "") {
    const te = e.player();
    if (!te.address || !te.unlocked)
      return o = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, o = "", e.changed();
    try {
      const re = await e.signShelf(z, O), ue = await e.json("/radio/release/shelf", Zc(re));
      return w(te.address, ue == null ? void 0 : ue.albums, !0), U(ue == null ? void 0 : ue.pay) ? A(te.address, ue.pay) : z === "add" && A(te.address, null, O), !0;
    } catch (re) {
      return z !== "list" && (o = re.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (z) => "xtrata.radio.releases.orders.v1:" + z, U = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && xf(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", P = (z) => {
    if (!z) return {};
    try {
      const O = JSON.parse(e.store.get(L(z)) || "{}");
      return O && typeof O == "object" ? Object.fromEntries(Object.entries(O).filter(([, te]) => U(te))) : {};
    } catch {
      return {};
    }
  };
  function A(z, O, te = (O == null ? void 0 : O.release) ?? "") {
    var ue;
    const re = P(z);
    O ? re[O.release] = { ...((ue = re[O.release]) == null ? void 0 : ue.order) === O.order ? re[O.release] : {}, ...O } : delete re[te], e.store.set(L(z), Object.keys(re).length ? JSON.stringify(re) : null);
  }
  const T = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map();
  async function X(z, O, te = !1) {
    var re;
    if (!T.has(O.order)) {
      T.add(O.order), B.set(O.order, e.now()), te && (o = "", e.changed());
      try {
        const ue = await e.json("/radio/release/paid", Zc({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (ue == null ? void 0 : ue.status) === "paid" ? (A(z, null, O.release), ((re = a == null ? void 0 : a.view) == null ? void 0 : re.id) === O.release && (a.view = { ...a.view, added: a.view.added + 1 }), o = "", T.delete(O.order), (u == null ? void 0 : u.for) === z && (u.fresh = !1), e.player().unlocked && await x("list")) : (U(ue) && A(z, { ...O, ...ue }), te && (ue == null ? void 0 : ue.status) === "pending" && (o = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (ue) {
        /did not go through|does not pay this order/.test(ue.message || "") && A(z, { ...O, txid: void 0, status: "pending" }), (te || O.txid) && (o = ue.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(O.order), e.changed();
      }
    }
  }
  async function Q(z, O, te) {
    if (!s) {
      s = "Approve the payment in your wallet…", o = "", e.changed();
      try {
        const re = await e.pay(z, te.to, BigInt(te.amount), te.memo), ue = { ...te, txid: re || void 0, status: "confirming" };
        A(O, ue), s = "", X(O, ue);
      } catch (re) {
        o = /cancel/i.test(re.message || "") ? "Payment cancelled. Nothing was sent." : re.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function oe(z) {
    const O = e.player();
    if (!await x("add", z.id) || !O.address) return;
    const te = P(O.address)[z.id], re = e.main();
    te && re && await Q(re, O.address, te);
  }
  function Y() {
    if (r || (r = !0, e.json("/radio/release/config").then((O) => {
      t = (O == null ? void 0 : O.enabled) === !0, n = { copies: t && (O == null ? void 0 : O.copies) === !0, sales: t && (O == null ? void 0 : O.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const O = a;
      O.error = "", e.json("/radio/release/view?id=" + O.id).then(
        (te) => {
          ld(te) ? (O.view = te, delete O.error) : O.error = "This release could not be read.";
        },
        (te) => {
          O.error = te.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const z = e.player();
    if (z.address) {
      (u == null ? void 0 : u.for) !== z.address && y(z.address), z.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), x("list"));
      for (const O of Object.values(P(z.address)))
        if ((O.txid || O.status === "confirming") && !T.has(O.order) && e.now() - (B.get(O.order) ?? -1 / 0) > 2e4) {
          const te = z.address;
          X(te, O).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? v().filter((z) => !z.hidden) : [];
  function C(z, O) {
    const te = me("ol", "", "ppp-rel-songs");
    return z.forEach((re, ue) => {
      const bt = me("li");
      bt.append(Jc(e.art.song(re.id, !0) || "", String(ue + 1), O), me("span", re.title)), te.append(bt);
    }), te;
  }
  function _() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [me("p", `♫ ${a.error}`, "ppp-warn")] : [me("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, O = me("div", "", "ppp-release-in"), te = me("p", "", "ppp-release-in__h"), re = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    te.append(me("b", z.title), me("span", `${z.subtitle || e.who(z.artist)} · ${sy(z)}${re > 0n ? ` · ${Di(re)} STX` : ""}`));
    const ue = Xr(z), bt = e.art.cover(z.cover) || (z.cover ? "" : ue[0] && e.art.song(ue[0].id, !0) || ""), He = me("div", "", "ppp-rel-top");
    He.append(Jc(bt, "💿", "", "is-cover"), te), O.append(He, C(ue.map((Ie) => ({ id: Ie.id, title: Ie.title || `#${Ie.id}` })), e.art.cover(z.cover))), O.append(me("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const ze = e.player(), vt = v().find((Ie) => Ie.id === z.id), De = me("div", "", "ppp-award__row");
    if (vt)
      O.append(me("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), De.append(Ln("Play it", () => e.open(z), "primary"));
    else if (!ze.address) O.append(me("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!ze.unlocked) O.append(me("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (re > 0n) {
      const Ie = P(ze.address)[z.id], qe = e.main(), Xe = `${Di((Ie == null ? void 0 : Ie.amount) ?? re)} STX`;
      if (Ie != null && Ie.txid || (Ie == null ? void 0 : Ie.status) === "confirming") {
        O.append(me("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Ye = Ln("Check now", () => void X(ze.address, Ie, !0));
        Ye.disabled = T.has(Ie.order), De.append(Ye);
      } else if (O.append(me("p", `This album costs ${Xe}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ie) O.append(me("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ie) {
        if (qe) {
          const dn = Ln(`Pay ${Xe} from my wallet`, () => void Q(qe, ze.address, Ie), "primary");
          dn.disabled = !!s, De.append(dn);
        } else O.append(me("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Ye = me("div", "", "ppp-rel-pay"), Rt = (dn, Wn, Ut) => {
          const gn = me("p");
          return gn.append(me("span", dn), me("code", Wn), fr(`order-${Ut}:${Ie.order}`, "Copy", () => Wn, "tiny", e.changed)), gn;
        };
        Ye.append(Rt("Send", Di(Ie.amount) + " STX", "amount"), Rt("To", Ie.to, "to"), Rt("Memo", Ie.memo, "memo")), O.append(Ye, me("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const pn = Ln("I have paid: check", () => void X(ze.address, Ie, !0));
        pn.disabled = T.has(Ie.order), De.append(pn);
      } else {
        const Ye = Ln(`Buy · ${Xe}`, () => void oe(z), "primary");
        Ye.disabled = h || !!s, De.append(Ye);
      }
    } else {
      O.append(me("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ie = Ln("Add to my player", () => {
        x("add", z.id).then((qe) => {
          qe && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ie.disabled = h, De.append(Ie);
    }
    return De.append(Ln("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(De), s && O.append(me("p", s, "ppp-cyan")), o && O.append(me("p", o, "ppp-warn")), [O];
  }
  let M = !1;
  function W() {
    const z = t ? v() : [];
    if (!z.length) return null;
    const O = me("details", "", "ppp-release-manage");
    O.open = M, O.ontoggle = () => {
      M = O.open;
    };
    const te = z.filter((ue) => ue.hidden).length;
    O.append(me("summary", `Albums I added (${z.length}${te ? `, ${te} hidden` : ""})`));
    const re = e.player().unlocked;
    re || O.append(me("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const ue of z) {
      const bt = me("div", "", "ppp-release-row" + (ue.hidden ? " is-hidden" : "")), He = me("span", "", "ppp-release-row__t");
      He.append(me("b", ue.title), me("span", `${ue.subtitle || e.who(ue.artist)}${ue.hidden ? " · hidden" : ""}`));
      const ze = Ln(ue.hidden ? "Show" : "Hide", () => void x(ue.hidden ? "show" : "hide", ue.id), "tiny"), vt = Ln("Remove", () => void x("remove", ue.id), "tiny");
      ze.disabled = vt.disabled = !re || h, bt.append(He, ze, vt), O.append(bt);
    }
    return O.append(me("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), o && !a && O.append(me("p", o, "ppp-warn")), O;
  }
  let F = null, we = [], le = null;
  const Ke = me("input");
  Ke.maxLength = 60, Ke.placeholder = "Title of the single, EP or album", Ke.setAttribute("aria-label", "Release title");
  const I = me("input");
  I.maxLength = 80, I.placeholder = "Artist name shown under the title", I.setAttribute("aria-label", "Artist name");
  const R = me("input");
  R.inputMode = "numeric", R.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", R.setAttribute("aria-label", "Cover inscription number");
  const de = me("input");
  de.inputMode = "decimal", de.placeholder = "Price in STX, e.g. 2 (0 makes it free)", de.setAttribute("aria-label", "Price in STX");
  let be = null;
  const Ne = (z, O, te = "") => {
    be = (be == null ? void 0 : be.id) === z && be.what === O ? null : { id: z, what: O }, (be == null ? void 0 : be.what) === "price" && (de.value = te), o = "", e.changed();
  };
  async function Ae(z, O) {
    if (s) return;
    const te = nC(de.value);
    if (te === null || !eC(te)) {
      o = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", o = "", e.changed();
    try {
      const re = { artist: z, release: O.id, price: te.toString(), issued: e.now() }, ue = await e.sign(z, tC(re));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", Zc({ request: re, signature: ue })), o = te > 0n ? `Price set ✓ “${O.title}” now costs ${Di(te)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, be = null, Be(z, !0);
    } catch (re) {
      o = re.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const wt = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function je(z) {
    F = { for: z, loading: !0 }, we = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (O) => {
        const te = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((re) => Number.isSafeInteger(re == null ? void 0 : re.id) && typeof re.title == "string") : null;
        F = te ? { for: z, songs: te, more: !!O.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (O) => {
        F = { for: z, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Be(z, O = !1) {
    !O && (le == null ? void 0 : le.for) === z && e.now() - le.at < 6e4 || (le = { for: z, list: (le == null ? void 0 : le.for) === z ? le.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((te) => {
      Array.isArray(te == null ? void 0 : te.releases) && (le = { for: z, list: te.releases.filter(ld), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function _e(z) {
    if (!s) {
      s = "Checking your release…", o = "", e.changed();
      try {
        const O = R.value.trim().replace(/^#/, ""), te = Xb({ title: Ke.value.trim(), subtitle: I.value.trim(), tracks: [...we], cover: O ? Number(O) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const re = { artist: z, hash: qb(te), issued: e.now() }, ue = await e.sign(z, WL(re));
        s = "Releasing…", e.changed();
        const bt = await e.json("/radio/release/create", Zc({ definition: te, request: re, signature: ue }));
        o = `${bt.existing ? "Already released" : "Released"} ✓ “${bt.title}”. Its link is below.`, we = [], Ke.value = "", R.value = "", e.audition.stop(), Be(z, !0);
      } catch (O) {
        o = O.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const Bn = () => {
    queueMicrotask(() => e.audition.stop());
  }, En = /* @__PURE__ */ new Set();
  function ht(z) {
    const O = we.map((Ye) => z.find((Rt) => Rt.id === Ye)).filter((Ye) => !!Ye), te = R.value.trim().replace(/^#/, ""), re = /^\d{1,9}$/.test(te) ? Number(te) : null, ue = e.art.cover(re), bt = O[0] ? e.art.song(O[0].id, !0) : null, He = me("div", "", "ppp-release-preview");
    He.append(me("p", "How it will look", "ppp-featured__h"));
    const ze = me("p", "", "ppp-release-in__h"), vt = me("b", Ke.value.trim() || "Untitled"), De = me("span", `${I.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    ze.append(vt, De);
    const Ie = me("div", "", "ppp-rel-top");
    Ie.append(Jc(re ? ue : bt || "", "💿", "", "is-cover"), ze), He.append(Ie, C(O.map((Ye) => ({ id: Ye.id, title: Ye.title })), ue));
    const qe = O.filter((Ye) => e.art.song(Ye.id, !0) === null).length, Xe = [];
    re && !ue && Xe.push(`Looking for an image in #${re}… If none appears, that inscription is not a picture.`), qe && Xe.push(`Finding artwork for ${qe} ${qe === 1 ? "song" : "songs"}…`), !qe && O.some((Ye) => e.art.song(Ye.id, !1) === "") && Xe.push(`A numbered square is a song with no artwork of its own${ue ? ": it shows the cover, dimmed" : ""}.`);
    for (const Ye of Xe) He.append(me("p", Ye, "ppp-mute"));
    return Ke.oninput = () => {
      vt.textContent = Ke.value.trim() || "Untitled";
    }, I.oninput = () => {
      De.textContent = `${I.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, R.onchange = () => e.changed(), He;
  }
  function Bt() {
    var te;
    const z = e.main();
    if (!t || !z)
      return F && (F = null, we = [], Bn()), null;
    const O = [me("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (F && F.for !== z && (F = null, we = [], En.clear(), Bn()), !F) O.push(Ln("Show the songs in my wallet", () => je(z), "primary"));
    else if (F.loading) O.push(me("p", "Reading your wallet…", "ppp-cyan"));
    else if (F.error) O.push(me("p", F.error, "ppp-warn"), Ln("Try again", () => je(z)));
    else if (!F.songs.length) O.push(me("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(me("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const re = me("div", "", "ppp-release-songs");
      for (const He of F.songs) {
        const ze = we.indexOf(He.id), vt = me("div", "", "ppp-release-song" + (ze >= 0 ? " is-on" : "")), De = e.audition.state(He.id);
        De !== "idle" && En.add(He.id);
        const Ie = Ln(De === "playing" ? "❚❚" : De === "loading" ? "…" : "▶", () => e.audition.toggle(He.id), "ppp-release-hear" + (De === "playing" ? " is-on" : ""));
        Ie.setAttribute("aria-label", De === "playing" ? `Stop ${He.title}` : `Listen to ${He.title}`), Ie.title = De === "error" ? "This song could not be played just now" : De === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const qe = e.art.song(He.id, ze >= 0 || En.has(He.id)), Xe = Ln("", () => {
          we = ze >= 0 ? we.filter((Ye) => Ye !== He.id) : [...we, He.id], e.changed();
        }, "ppp-release-pick");
        Xe.setAttribute("aria-pressed", String(ze >= 0)), Xe.append(me("i", ze >= 0 ? String(ze + 1) : "+"), me("b", He.title), me("span", De === "error" ? "could not play" : `${He.artist ? He.artist + " · " : ""}#${He.id}`, De === "error" ? "ppp-warn" : "")), vt.append(Ie, Jc(qe || "", qe === "" ? "♪" : "", ""), Xe), re.append(vt);
      }
      O.push(re), F.more && O.push(me("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !I.value && we.length && (I.value = ((te = F.songs.find((He) => He.id === we[0])) == null ? void 0 : te.artist) || "");
      const ue = we.length === 0 ? "release" : we.length === 1 ? "single" : we.length <= 6 ? "EP" : "album", bt = Ln(we.length ? `Sign and release this ${ue} · ${we.length} ${we.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void _e(z), "primary");
      bt.disabled = !we.length || !!s, O.push(Ke, I, R), we.length && O.push(ht(F.songs)), O.push(bt);
    }
    if (s && O.push(me("p", s, "ppp-cyan")), o && !a && O.push(me("p", o, /✓/.test(o) ? "ppp-ok" : "ppp-warn")), Be(z), (le == null ? void 0 : le.for) === z && le.list.length) {
      O.push(me("p", "Your releases", "ppp-featured__h"));
      for (const re of le.list) {
        const ue = me("div", "", "ppp-release-row"), bt = me("span", "", "ppp-release-row__t"), He = BigInt(/^\d{1,12}$/.test(re.price ?? "") ? re.price : "0"), ze = He > 0n ? ` · ${Di(He)} STX · ${(re.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (bt.append(me("b", re.title), me("span", `${sy(re)} · added by ${re.added.toLocaleString()} ${re.added === 1 ? "player" : "players"}${ze}`)), ue.append(bt, fr("release-link:" + re.id, "Copy link", () => wt(re.id), "tiny", e.changed)), n.sales) {
          const De = Ln("Price", () => Ne(re.id, "price", He > 0n ? Di(He) : ""), "tiny");
          De.setAttribute("aria-expanded", String((be == null ? void 0 : be.id) === re.id && be.what === "price")), ue.append(De);
        }
        if (n.copies && e.copies) {
          const De = Ln("Send copies", () => Ne(re.id, "copies"), "tiny");
          De.setAttribute("aria-expanded", String((be == null ? void 0 : be.id) === re.id && be.what === "copies")), ue.append(De);
        }
        if (O.push(ue), (be == null ? void 0 : be.id) !== re.id) continue;
        const vt = me("div", "", "ppp-release-way");
        if (be.what === "price" && n.sales) {
          const De = Ln("Sign this price", () => void Ae(z, re), "primary");
          De.disabled = !!s, vt.append(
            me("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            de,
            De
          );
        } else be.what === "copies" && n.copies && e.copies && vt.append(...e.copies(z, { id: re.id, title: re.title }));
        vt.childNodes.length && O.push(vt);
      }
    }
    return O;
  }
  return { sync: Y, albums: m, banner: _, manage: W, fold: Bt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(F != null && F.songs) && !!e.main()), enabled: () => t === !0 };
}
const ud = "xtrata.radio.replace.v1", Cn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ws = (e, t, n = "") => {
  const r = Cn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, iy = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function oC(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(ud) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(ud, v ? JSON.stringify(v) : null), e.changed();
  };
  let s = null, o = !1, i = "", a = !1;
  function c(v) {
    o || (s == null ? void 0 : s.for) === v && (s.n !== null || Date.now() - s.at < 3e4) || (o = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (x) => {
        s = { for: v, n: Number.isSafeInteger(x == null ? void 0 : x.total) ? x.total : null, at: Date.now() };
      },
      () => {
        s = { for: v, n: null, at: Date.now() };
      }
    ).finally(() => {
      o = !1, e.changed();
    }));
  }
  const u = () => !!n, h = () => !!(n != null && n.removed);
  function d(v) {
    v.listening && (i = "", r({ old: v.listening }));
  }
  const w = () => {
    i = "", r(null);
  };
  function y(v) {
    var B;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(ud, JSON.stringify(n)));
    const x = [], L = (X, Q) => x.push(Cn("p", `Replacing your old player · step ${X} of 3 · ${Q}`, "ppp-cyan")), U = () => ws("Stop · keep my old player", w, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      x.push(Cn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? x.push(Cn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), ws("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && x.push(Cn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const X = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return x.push(Cn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${X}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), x.push(ws("Done", w, "quiet")), x;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), x.push(Cn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), x.push(ws("Hide this", w, "quiet")), x) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), x.push(Cn("p", "Unlock your old player so it can be emptied."), ws("Unlock my old player", e.unlock, "primary"), U()), x;
    const P = e.keepBoth(v), A = (X) => (L(1, "empty it"), x.push(Cn("p", X, "ppp-warn")), P && x.push(ws("Keep both players instead", () => {
      w(), P();
    }, "primary")), x.push(U()), x);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return L(1, "empty it"), x.push(Cn("p", "Checking what this player has…", "ppp-mute"), U()), x;
    if (s.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return A(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((B = v.award) == null ? void 0 : B.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((X) => ["prepared", "signed", "unknown", "pending"].includes(String(X.status))))
      return L(1, "empty it"), x.push(Cn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), U()), x;
    if (v.balance === void 0)
      return L(1, "empty it"), x.push(Cn("p", "Checking what it holds…", "ppp-mute"), U()), x;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), x.push(Cn("p", `It holds ${iy(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? x.push(ws("Send everything back", e.returnAll, "primary")) : x.push(Cn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), x.push(U()), x;
    L(2, "remove it from this device"), x.push(Cn("p", v.balance > 0n ? `Empty ✓ (the ${iy(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), x.push(Cn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = ws(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (X) => {
        i = /cancel/i.test((X == null ? void 0 : X.message) || "") ? "" : (X == null ? void 0 : X.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, x.push(T, U()), i && x.push(Cn("p", i, "ppp-warn")), x;
  }
  return { active: u, claiming: h, start: d, stop: w, lines: y };
}
const sC = [
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
function iC(e) {
  for (const [t, n] of sC) if (n.test(e)) return t;
  return null;
}
const Jb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Qb = (e) => /Android/.test(e);
function aC(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : Jb(t) ? "x-safari-" + n.href : Qb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const cC = (e) => Jb(e) ? "Safari" : Qb(e) ? "Chrome" : "your browser", Fi = "Xtrata Music player", lC = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function ay(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: Fi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = e.standIn === c && lC.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Fi} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: Fi, detail: "Make one with Face ID or your fingerprint. Nothing to install." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Fi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Fi, detail: "Face ID or your fingerprint. Nothing to install." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Fi, detail: "Open on this device." });
    }
  return r;
}
const dd = "xtrata.radio.novice", e1 = "xtrata.radio.novice.previewed.v1", cy = 6 * 6e4;
function uC(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(dd, r), n = r;
    else {
      if (r === "0")
        return t.set(dd, null), { on: !1, preview: !1 };
      n = t.get(dd);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const dC = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, ly = (e) => dC.test(e ?? ""), fC = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, hC = {
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
}, pC = (e, t) => hC[e] ?? t;
function gC(e, t) {
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
const yC = "Make your player once, with Face ID or your fingerprint, and the music starts.", wC = "Checking your player…", Af = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function t1(e) {
  try {
    const t = JSON.parse(e.get(e1) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function mC(e, t) {
  const n = t1(e).filter((r) => r !== t);
  n.push(t), e.set(e1, JSON.stringify(n.slice(-50)));
}
function fd(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...Af(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : Af();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > cy ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > cy ? { ...e, phase: "done" } : e;
  }
}
const Qc = (e) => e.phase === "open" || e.phase === "playing";
function bC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const xC = [100, 250, 500, 1e3], SC = (e, t = Wr) => BigInt(e) * Hn(t);
function vC(e, t = Wr, n = 0n) {
  const r = To - e - n;
  return r > 0n ? Number(r / Hn(t)) : 0;
}
function AC(e, t = Wr, n = 0n) {
  const r = e === void 0 ? 0 : vC(e, t, n);
  return xC.map((s) => ({ plays: s, stx: SC(s, t), fits: e !== void 0 && s <= r }));
}
const EC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, kC = (e) => EC[e.unit](e.amount), qt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, ul = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function $C(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${ul(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${ul(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${ul(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function IC(e) {
  let t = null, n = 0, r = "stx";
  const s = (i) => {
    var c;
    if (i.some((u) => u.plays === n && u.fits)) return;
    const a = i.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var h;
      return u.plays === ((h = i[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function o() {
    var y;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = AC(i.balance, i.fee, i.incoming);
    s(a);
    const c = bC(i.switches);
    (y = c.find((v) => v.id === r)) != null && y.on || (r = "stx");
    const u = [], h = qt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(qt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${ul(i.playsLeft, "play", "plays")} left.`));
    const d = $C(i.done);
    if (d && u.push(qt("p", "ppp-restock__done", d)), i.arriving)
      u.push(qt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(qt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(qt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = qt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const P = qt("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        P.type = "button", P.disabled = !U.fits, P.setAttribute("aria-pressed", String(U.plays === n)), P.append(qt("b", "", U.plays.toLocaleString()), qt("span", "", "plays")), P.onclick = () => {
          n = U.plays, o();
        }, v.append(P);
      }
      u.push(v);
      const x = qt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const P = qt("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        P.type = "button", P.disabled = !U.on, P.setAttribute("aria-pressed", String(U.id === r)), P.append(qt("b", "", U.label), qt("span", "", U.on ? U.blurb : "Soon")), P.onclick = () => {
          r = U.id, o();
        }, x.append(P);
      }
      u.push(x);
      const L = a.find((U) => U.plays === n);
      if (L && r === "stx") {
        const U = qt("div", "ppp-restock__pay"), P = kC({ unit: "microSTX", amount: L.stx }), A = qt("p", "ppp-restock__amount");
        A.append("Send ", qt("b", "", P), " to your player:"), U.append(A, qt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = qt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => jr(L.stx), "")), U.append(T), U.append(qt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(U);
      }
    }
    u.push(qt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = qt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), u.push(w), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = qt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), o(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: o,
    close() {
      t == null || t.close();
    }
  };
}
const Rr = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), LC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function CC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: LC(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function TC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Rr(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function BC(e, t, n = "", r = 60) {
  const s = Rr(t).split(/\s+/).filter(Boolean), o = Rr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = Rr(a.artist), u = Rr(a.title), h = String(a.id);
    if (o && c !== o) continue;
    let d = 0, w = !0;
    for (const y of s) {
      const v = y.replace(/^#/, "");
      if (u.includes(y)) d += u.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(v) && h === v) d += 0;
      else if (c.includes(y)) d += 2;
      else if (/^\d+$/.test(v) && h.startsWith(v)) d += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: d });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const ar = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, uy = 12, MC = 14, dy = (e) => [...e.trim()].length <= MC;
function NC(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = ar("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = ar("div", "hint"), u = ar("div", "find-artists" + (t.grid ? " find-artists--grid" : "")), h = ar("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = ar("div", "likesTools");
  d.append(a), e.replaceChildren(d, c, u, h), a.oninput = () => {
    s = a.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((v) => {
      n = v, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const v = t.locked();
    if (a.disabled = v, v) {
      if (c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", t.leaveAlbum) {
        const T = ar("button", "find-back", "Back to My player");
        T.type = "button", T.onclick = () => t.leaveAlbum(), c.append(" ", T);
      }
      u.replaceChildren(), h.replaceChildren();
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
      const T = ar("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const x = TC(n), L = (T, B, X, Q = "", oe = "") => {
      const Y = ar("button", "find-chip" + (oe ? " " + oe : "") + (B ? " is-on" : ""), T);
      return Y.type = "button", Y.setAttribute("aria-pressed", String(B)), Q && (Y.title = Q), Y.onclick = X, Y;
    }, U = (T, B, X = "") => L(B, Rr(T.name) === Rr(o), () => {
      o = Rr(T.name) === Rr(o) ? "" : T.name, y();
    }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`, X);
    if (t.grid) {
      const T = x.filter((Q) => dy(Q.name)), B = x.filter((Q) => !dy(Q.name)), X = i ? B : B.filter((Q) => Rr(Q.name) === Rr(o));
      u.replaceChildren(
        ...T.map((Q) => U(Q, Q.name)),
        ...B.length ? [L(i ? "Fewer artists" : `${B.length} more ${B.length === 1 ? "artist" : "artists"}`, !1, () => {
          i = !i, y();
        }, "", "find-more")] : [],
        ...X.map((Q) => U(Q, `${Q.name} · ${Q.songs}`, "find-chip--long"))
      );
    } else {
      const T = i ? x : x.slice(0, uy);
      u.replaceChildren(
        ...T.map((B) => U(B, `${B.name} · ${B.songs}`)),
        ...x.length > uy ? [L(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
          i = !i, y();
        })] : []
      );
    }
    const P = BC(n, s, o), A = t.current();
    h.replaceChildren(...P.songs.map((T) => {
      var Q, oe;
      const B = ar("li", "lrow" + (T.id === A ? " now" : "")), X = ar("button", "lt", T.title);
      if (X.type = "button", X.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, X.onclick = () => t.play(T.id), (Q = t.explicit) != null && Q.call(t, T.id)) {
        const Y = ar("span", "exp", "E");
        Y.title = "Explicit lyrics: only plays when you choose it", X.append(" ", Y);
      }
      if ((oe = t.liked) != null && oe.call(t, T.id)) {
        const Y = ar("span", "find-liked", "♥");
        Y.title = "You like this song", Y.setAttribute("role", "img"), Y.setAttribute("aria-label", "Liked"), B.append(X, Y);
      } else B.append(X);
      return B.append(ar("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), B;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : P.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : P.total > P.songs.length ? `Showing ${P.songs.length} of ${P.total.toLocaleString()}. Type more to narrow it down.` : `${P.total} ${P.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const fy = (e, t, n) => Hf(jf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), _C = 317, PC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, UC = 15 * 6e4, OC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function hd(e, t) {
  return e.standalone ? null : t ? "prompt" : OC(e) ? "ios" : null;
}
const Xi = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function HC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function DC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const cr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, FC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function jC(e, t, n = "safari") {
  const r = DC(n), s = cr("div", "a2hs-sheet a2hs-sheet--" + r.where);
  s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true"), s.setAttribute("aria-label", Xi.title);
  const o = cr("div", "a2hs-card"), i = cr("div", "a2hs-head"), a = cr("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = cr("div");
  c.append(cr("h2", "", Xi.title), cr("p", "", Xi.body)), i.append(a, c);
  const u = cr("ol", "a2hs-steps");
  r.steps.forEach((w, y) => {
    const v = cr("li");
    v.append(cr("i", "", String(y + 1)), cr("span", "", w)), u.append(v);
  });
  const h = cr("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(FC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = cr("button", "a2hs-close", Xi.close);
  return d.type = "button", d.onclick = t, o.append(i, u, d), s.append(o, h), s.onclick = (w) => {
    w.target === s && t();
  }, s;
}
function RC(e) {
  let t = null, n = null, r = !1;
  const s = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, o = () => {
    const i = r ? null : hd(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", Xi.label), e.button.title = Xi.label, e.button.onclick = () => {
    var a;
    const i = hd(e.env(), !!t);
    if (i === "prompt" && t) {
      const c = t;
      t = null;
      try {
        c.prompt();
      } catch {
      }
      o();
      return;
    }
    i === "ios" && !n && (n = jC(e.icon, s, HC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, o();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, s(), o();
  }), o(), { sync: o, kind: () => r ? null : hd(e.env(), !!t) };
}
const hy = document.getElementById("ppp");
hy && zC(hy);
function zC(e) {
  var zh;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = C1(), s = (l) => e.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = aI({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var g;
      const p = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((g = p == null ? void 0 : p.find((f) => f.listening === l)) == null ? void 0 : g.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const p = new Promise((ie, ve) => {
        i.addEventListener("load", () => ie(), { once: !0 }), setTimeout(() => ve(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await p;
      const g = new x1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), j = (ie, ve) => f.has(ie) ? g.request(ie, ve) : Promise.race([
        g.request(ie, ve),
        new Promise((fe, Me) => setTimeout(() => Me(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await j("listening.status"), { request: j };
    },
    chain: {
      verify: F5,
      balance: R5,
      account: j5,
      owner: z5,
      broadcast: G5,
      transaction: K5,
      confirmedNonce: async (l) => {
        const p = await ks(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => Qu({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, j) => Ag({
      recipient: p,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new pd(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ie) => f(ie.txId || ""),
      onCancel: () => j(new Error("Deposit cancelled. Nothing was sent.")),
      onError: j
    })),
    validate: V5,
    tabLock: (l) => new Promise((p) => {
      const g = navigator.locks;
      if (!(g != null && g.request)) {
        p(!0);
        return;
      }
      g.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
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
    changed: () => se(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, g;
      return v.funder(l, () => J5(l, ks), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), g = p == null ? void 0 : p.gift;
      if (!g) return null;
      if (typeof g.returnTo != "string" || typeof g.treasury != "string") throw new Error("Unreadable gift record.");
      return {
        returnTo: g.returnTo,
        from: typeof g.from == "string" ? g.from : null,
        source: String(g.source ?? ""),
        amount: String(g.amount ?? "0"),
        treasury: g.treasury,
        state: g.state === "sending" ? "sending" : "arrived",
        player: g.player ?? null,
        ...g.drop === "players" || g.drop === null ? { drop: g.drop } : {}
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
      const g = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: p }) });
      if (typeof (g == null ? void 0 : g.record) != "string" || typeof (g == null ? void 0 : g.signature) != "string" || !Number.isSafeInteger(g == null ? void 0 : g.cls) || !Number.isSafeInteger(g == null ? void 0 : g.number) || !Number.isSafeInteger(g == null ? void 0 : g.plays)) throw new Error("Unreadable award note.");
      return { cls: g.cls, number: g.number, plays: g.plays, record: g.record, signature: g.signature, name: typeof g.name == "string" ? g.name : null };
    },
    history: (l, p) => tI(l, (g) => ks(g), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const g = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((j) => (j == null ? void 0 : j.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((j) => typeof j == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => nr(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, g, f, j, ie) => new Promise((ve, fe) => Ag({
    recipient: f,
    amount: j.toString(),
    memo: ie,
    stxAddress: g,
    network: new pd(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Me) => ve(Me.txId || ""),
    onCancel: () => fe(new Error(p)),
    onError: fe
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    w.start(l), se(c.snapshot());
  } : null, w = oC({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => ut(l),
    changed: () => se(c.snapshot()),
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
  }), y = () => ({ quick: !!v.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), v = pL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, g, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, g, f),
    sign: (l, p) => Qu({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, g, f) => {
      P.invalidate(), await c.albumArriving(l, p, g, f);
    } },
    who: (l) => ut(l),
    changed: () => se(c.snapshot()),
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
  }), x = (l) => {
    Promise.resolve(c.openAlbum(l)).then(() => {
      if (!Je()) return;
      const p = c.snapshot();
      window.dispatchEvent(new CustomEvent(p.slot === l && !p.error ? "xtrata:radio-listen" : "xtrata:radio-panel"));
    });
  };
  let L;
  const U = (l) => {
    l !== L && (L = l, window.dispatchEvent(new CustomEvent("xtrata:radio-albums", { detail: { has: l } })));
  }, P = EL({
    json: a,
    open: x,
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
    changed: () => se(c.snapshot())
  }), A = {
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
  }, T = uC(location.search, A);
  T.on && (document.documentElement.dataset.novice = T.preview ? "preview" : "1");
  const B = (l) => T.on && l.solo, X = T.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), Q = X ? document.getElementById("album") : null, oe = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, Y = Q ? ry(Q, oe) : null, m = rC({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => Qu({ ...p, network: "mainnet", stxAddress: l }),
    signShelf: (l, p) => c.signShelf(l, p),
    pay: (l, p, g, f) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, p, g, f),
    copies: (l, p) => {
      var g;
      return v.copies(l, p, ((g = c.snapshot().gate) == null ? void 0 : g.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), p = l.slot === 0 ? l.listening : l.root;
      return { address: p, unlocked: !!p && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => Dt(l, !0),
    who: (l) => ut(l),
    art: { song: (l, p) => p && Rl(String(l)) || Qg(String(l)), cover: (l) => ll(l) },
    audition: zL({
      changed: () => se(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => se(c.snapshot()),
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
  }), C = () => {
    const l = new Set(gn.map((p) => p.id));
    return [...gn, ...m.albums().filter((p) => !l.has(p.id))];
  }, _ = Q ? qL(Q) : null, M = "xtrata.radio.award.later.v1";
  let W = "ready", F = !1, we = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(M) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), le = !1;
  const Ke = "xtrata.radio.tier.v1";
  let I = (() => {
    const l = A.get(Ke);
    return Yc(l) ? Vs(l) : null;
  })();
  const R = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function de(l) {
    var j;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let ie = null;
      try {
        ie = l.gift && !l.gift.player && l.gift.drop === "players" ? iL(BigInt(l.gift.amount)) : null;
      } catch {
        ie = null;
      }
      ((j = l.award) == null ? void 0 : j.state) === "claimed" && l.award.holds === !1 && (ie = null), ((ie == null ? void 0 : ie.id) ?? null) !== ((I == null ? void 0 : I.id) ?? null) && (I = ie, A.set(Ke, ie ? ie.id : null));
    }
    const p = document.documentElement;
    I ? p.dataset.tier = I.id : delete p.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!I) {
      f == null || f.remove();
      return;
    }
    f || (f = $("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = I.id, f.textContent = `${I.mark} ${I.name.toUpperCase()} PLAYER`, f.title = `A ${I.name} player from the Xtrata Music giveaway`;
  }
  const be = (() => {
    var l;
    try {
      return !!((l = window.matchMedia) != null && l.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), Ne = document.getElementById("a2hs");
  Ne && RC({
    button: Ne,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: be })
  });
  let Ae = T.on ? _C : null, wt = !1, je = 0, Be = "";
  T.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : PC(l == null ? void 0 : l.song) ? l.song : Ae;
    p !== Ae && !wt && (Ae = p, se(c.snapshot()));
  }).catch(() => {
  });
  const _e = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const p = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(p) && p >= 1 ? p : null;
    } catch {
      return null;
    }
  })(), Bn = (l) => {
    var f, j, ie;
    if (!wt || Ae === null) return !1;
    if (Date.now() - je > UC || l.step === "ready")
      return l.step !== "ready" && (wt = !1), !1;
    const p = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), g = Number((ie = p == null ? void 0 : p.nowPlaying) == null ? void 0 : ie.tokenId);
    return Date.now() - je < 2e4 && !Number.isSafeInteger(g) ? !0 : g !== Ae ? (wt = !1, !1) : !0;
  };
  function En() {
    const l = window.XtrataRadio;
    if (!(Ae === null || !(l != null && l.playToken))) {
      wt = !0, je = Date.now(), c.holdFirstPlay(), se(c.snapshot());
      try {
        l.playToken(Ae);
      } catch {
        wt = !1;
      }
    }
  }
  const ht = () => {
    var f, j;
    if (!wt || Ae === null) return null;
    const l = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === Ae ? l.nowPlaying : null, g = Go.get(Ae);
    return { title: (p == null ? void 0 : p.title) || (g == null ? void 0 : g.title) || "", artist: (p == null ? void 0 : p.artist) || (g == null ? void 0 : g.artist) || "", art: `/radio/artwork?id=${Ae}`, playing: !!(l != null && l.playing) };
  }, Bt = T.on && Q ? NL(Q) : null, Pt = Date.now();
  let z = !1, O = null, te = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const re = () => {
    te = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    se(c.snapshot());
  }, ue = (l, p) => {
    var ie;
    if (!Bt || p || te) return null;
    if (!l.gate || l.step === "loading" || (z = !0), !z) return Date.now() - Pt < 1e4 ? "checking" : null;
    if (!B(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((ie = l.gift) != null && ie.player), j = f && !l.entries.some((ve) => ve.kind === "play");
    return l.step === "fund" && j ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (O === "landed" || O === "arriving" && (j || wt)) ? "landed" : l.step === "loading" && O !== "checking" ? O : null;
  };
  let bt = !1;
  function He(l, p, g = [], f) {
    if (!Bt) return;
    const j = f !== void 0 ? f : ue(l, p);
    if (O = j, delete document.documentElement.dataset.noviceBoot, !j) {
      Bt.render(null, p);
      return;
    }
    const ie = [...g];
    j === "arriving" && l.arrival && ie.push(ee(l.arrival)), l.step === "unsupported" ? ie.push($("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && ie.push($("p", l.error, "ppp-warn"));
    const ve = j === "gift" ? v.incomingStarter() : null;
    ve && Ae === null && !bt && l.step === "intro" && !l.busy && !l.armed && !l.error && !wn && (bt = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), Bt.render({
      mode: j,
      status: ie,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !wn,
      plays: ve ? ve.plays : j === "landed" ? l.playsLeft : null,
      from: (ve == null ? void 0 : ve.from) ?? null,
      tier: I,
      mystery: R,
      spot: _e,
      installed: be,
      intro: ve && Ae !== null && l.step === "intro" ? { ready: !0 } : null,
      now: ht(),
      albums: j === "landed" ? gn.map((fe) => ({ title: fe.title, by: fe.subtitle, cover: ll(fe.cover), run: () => {
        re(), Dt(fe, !0);
      } })) : [],
      claimNew: j === "back" ? h(l) : null,
      replaceOld: j === "back" ? d(l) : null,
      start: () => {
        ve && Ae !== null && En(), c.create(y());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => De(),
      full: () => {
        var Tt, ct, Ve;
        const fe = window.XtrataRadio, Me = j === "landed" && !((ct = (Tt = fe == null ? void 0 : fe.getState) == null ? void 0 : Tt.call(fe)) != null && ct.playing);
        wt = !1, re(), Me && ((Ve = fe == null ? void 0 : fe.playPause) == null || Ve.call(fe));
      }
    });
  }
  Bt && setTimeout(() => {
    z || se(c.snapshot());
  }, 10100), Fl(() => {
    (Bt != null && Bt.showing() || document.documentElement.dataset.asking || m.wantsArt()) && se(c.snapshot());
  });
  const vt = IC({
    input: () => {
      var j, ie, ve, fe;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (j = l.likeFunds) == null ? void 0 : j.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Me) => Me.kind === "play" && Me.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : $t(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((ie = l.gate) == null ? void 0 : ie.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((ve = l.gate) == null ? void 0 : ve.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Me) => Me.recipient)).size, likes: g.filter((Me) => Me.kind === "like" && Me.status === "confirmed" && Me.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((fe = l.likeFunds) != null && fe.pending)
      };
    },
    copyButton: (l, p, g, f) => fr(l, p, g, f, () => {
      se(c.snapshot());
    })
  }), De = () => {
    if (!c.snapshot().unproven) {
      vt.open();
      return;
    }
    c.prove().then((l) => {
      l && vt.open();
    });
  }, Ie = document.getElementById("albumList"), qe = Ie ? ry(Ie, oe, { list: !0 }) : null, Xe = "xtrata.radio.album.last.v1", Ye = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Xe) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let Rt = "";
  const pn = (l) => {
    const p = JSON.stringify(l);
    if (p !== Rt) {
      Rt = p;
      try {
        localStorage.setItem(Xe, p);
      } catch {
      }
    }
  };
  let dn = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (J = !0), Br();
    const p = Ho(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Wn;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const Ut = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Wn && (Wn = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let gn = [], mr = 0, Zr = !1, Fn = null;
  const br = (l) => {
    var p, g;
    Zr || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - mr < 6e4 || (mr = Date.now(), a("/radio/gift/featured").then((f) => {
      gn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((j) => j && typeof j.id == "string" && typeof j.title == "string" && Array.isArray(j.tracks) && j.tracks.length > 0).slice(0, 6), Zr = !0, gn.length && se(c.snapshot());
    }).catch(() => {
    }));
  }, yn = (l) => {
    var p;
    return Fn && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? Fn : null;
  }, Dt = (l, p = !1) => {
    var f, j;
    Fn = l, se(c.snapshot());
    const g = l && p ? Xr(l)[0] : null;
    g && ((j = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || j.call(f, g.id));
  };
  let dt = Af(), Ct = null;
  const un = (l) => {
    const p = T.preview && !wn && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (dt = fd(dt, { kind: "offer", album: p.player.id, already: t1(A).includes(p.player.id) }), Qc(dt) ? p.player : null) : (dt = fd(dt, { kind: "withdraw" }), null);
  }, Cr = (l) => {
    const p = dt.phase;
    dt = fd(dt, l), dt.phase !== p && (dt.album && (dt.phase === "playing" || dt.phase === "done") && mC(A, dt.album), se(c.snapshot()));
  };
  setInterval(() => {
    dt.phase === "playing" && Cr({ kind: "tick", at: Date.now() });
  }, 5e3);
  let wo = "", E, H = !1, V = !1;
  const D = (l, p) => {
    var Ge, Oe, It, Xt, rr, Ko, Ao, Li;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((Ge = l.giftStop) == null ? void 0 : Ge.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, j = Ct, ie = Bn(l), ve = f ? B(l) ? pC(f.reason, f.text) : f.text : null, fe = j || ie ? null : ve ?? (t && (!((Oe = l.gate) != null && Oe.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    fe && fe !== E && (g.setGiftStop(fe), E = fe);
    const Me = l.step === "off" || l.step === "elsewhere" ? null : ((It = l.gift) == null ? void 0 : It.player) ?? j ?? yn(l) ?? null, Tt = Me ? Me.id + ":" + Me.cover + ":" + Me.tracks.map((Gn) => Gn.id).join(",") : "";
    Tt !== wo && (g.setGiftPlayer(Me ? { id: Me.id, title: Me.title, subtitle: Me.subtitle, tracks: Xr(Me).map((Gn) => Gn.id), hidden: ((Xt = oL(Me)) == null ? void 0 : Xt.id) ?? null, cover: Me.cover } : null), wo = Tt), fe !== E && (g.setGiftStop(fe), E = fe);
    const ct = !ie && (f == null ? void 0 : f.reason) === "arriving";
    ct !== V && ((rr = g.setGiftWait) == null || rr.call(g, ct), V = ct);
    const Ve = !!Me && (!!j || !!((Ko = l.albumLock) != null && Ko.locked));
    Ve !== H && ((Ao = g.setGiftLock) == null || Ao.call(g, Ve), H = Ve), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((Li = g.forgetWallets) == null || Li.call(g));
  };
  let J = !1;
  const ne = /* @__PURE__ */ new Map(), Te = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = ne.get(l.listening);
    return g === void 0 && (g = Date.now(), ne.set(l.listening, g)), Date.now() - g < Ol ? g : null;
  }, $e = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && ne.has(l.listening), Pe = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", $t = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > an ? Number((l - an) / p) : 0;
  }, Ze = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), pt = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, st = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, $ = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, Ee = (l, p, g = "") => {
    const f = $("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, ft = (l, p) => {
    const g = $("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  }, rn = 6, At = 20;
  let xr = !1, Tr = !1;
  const gt = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "just now" : p < 60 ? `${p} min ago` : p < 1440 ? `${Math.round(p / 60)} h ago` : `${Math.round(p / 1440)} ${Math.round(p / 1440) === 1 ? "day" : "days"} ago`;
  };
  Fl(() => {
    Tr && se(c.snapshot());
  });
  let Zt = null, Uo = location.hash === "#give";
  Uo && history.replaceState(null, "", location.pathname + location.search);
  let Zn = !1;
  const vi = GI((l) => zI({ address: l, network: "mainnet" }), () => se(c.snapshot())), nr = (l) => vi.get(l), wn = iC(navigator.userAgent), jn = (l, p) => {
    const g = navigator.userAgent, f = cC(g), j = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, ie = [$("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${T.on ? "player" : "listening wallet"}${p ? T.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], ve = $("div", "", "ppp-open-row"), fe = aC(j, g);
    if (fe) {
      const Me = $("a", `Open in ${f}`, "primary ppp-open-in");
      Me.href = fe, Me.dataset.homeAction = "radio:open-in-browser", ve.append(Me);
    }
    return ve.append(fr("copy-page-link", "Copy link", () => j, fe ? "" : "primary", () => se(c.snapshot()))), ie.push(ve, $("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), ie;
  }, ut = (l) => nr(l) ?? Pe(l), Oo = (l) => l.slice(0, 2).map(ut).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), Cs = /* @__PURE__ */ new Map();
  let Jr = !1;
  const Ai = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Br = () => {
    Jr || (Jr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && Cs.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      se(c.snapshot());
    }).catch(() => {
      Jr = !1;
    }));
  }, Ho = (l, p) => {
    const g = Cs.get(l), f = jg(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((ie) => !Ai(ie)) || ""), j = Dg(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: j };
  }, Mn = (l) => {
    const { title: p, artist: g } = Ho(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, Ei = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ki = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Sa(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Rn(l, p, g = "", f) {
    const j = $("dt", l), ie = $("dd", p, g);
    return f && ie.append(" ", f), [j, ie];
  }
  const kn = document.getElementById("ppp-top"), Mr = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Sr = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, Ts = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      Sr();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((g = l.giftStop) == null ? void 0 : g.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      De();
      return;
    }
    Mr();
  };
  kn && (kn.onclick = Ts);
  const mo = (l, p, g, f = "") => l.standIn && !l.mainConnected ? Ee(`Connect ${ut(l.standIn)} to add STX`, Sr, f) : Ee(p, g, f), Bs = (l) => {
    c.useLinked(l).then(() => Mr());
  };
  let Nr = null;
  const Ms = () => {
    const l = ay(c.snapshot(), ut);
    return l.length ? Nr || (Nr = new Promise((p) => {
      var ct;
      const g = $("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const j = (Ve) => {
        f = Ve, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), Nr = null, p(f);
      }), g.addEventListener("click", (Ve) => {
        Ve.target === g && j(null);
      });
      const ie = (Ve, Ge, Oe, It, Xt = !1) => {
        const rr = $("button", "", "ppp-connect__opt " + Oe);
        return rr.type = "button", rr.disabled = Xt, rr.onclick = It, rr.append($("b", Ve), $("span", Ge)), rr;
      }, ve = $("h2", "Connect to Xtrata Music", "ppp-connect__title");
      ve.id = "ppp-connect-title";
      const fe = l.map((Ve) => ie(Ve.label, Ve.detail, "is-music", () => {
        if (j("music"), Ve.action === "linked" && Ve.main) {
          Bs(Ve.main);
          return;
        }
        const Ge = ay(c.snapshot(), ut).find((Oe) => Oe.action !== "linked");
        (Ge == null ? void 0 : Ge.action) === "create" ? c.create() : (Ge == null ? void 0 : Ge.action) === "unlock" && c.unlock(), Mr();
      }, !!Ve.disabled)), Me = ie("Xverse or Leather", "If you already use one.", "is-stacks", () => j("stacks")), Tt = Ee("Cancel", () => j(null), "quiet ppp-connect__cancel");
      g.append(ve, ...fe, Me, Tt), document.body.appendChild(g), g.showModal(), (ct = fe.find((Ve) => !Ve.disabled)) == null || ct.focus();
    }), Nr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Ms;
  function Do(l) {
    if (!kn) return;
    const p = (f, j, ie) => {
      kn.hidden = !1, kn.className = "ppp-top" + (j ? " is-" + j : ""), kn.replaceChildren($("span", "", "dot"), document.createTextNode(f)), kn.title = ie;
    }, g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        kn.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        kn.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${ut(l.linked)}`, "warn", `This device's listening wallet belongs to ${ut(l.linked)}. Connect that wallet to pay artists or like songs.`);
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
        return l.payingOn && g > 0 && !l.giftStop ? p(`${g.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Nn = document.getElementById("pppNudge"), Ns = document.getElementById("onair");
  (zh = Nn == null ? void 0 : Nn.querySelector("button")) == null || zh.addEventListener("click", () => Ts());
  const Qr = {
    connect: "Connect your player to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, _r = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, zt = document.getElementById("claimCard");
  let vr = !1, bo = 0, xo = 0;
  function _s(l) {
    if (!zt) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !vr && (vr = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (bo = f.free, xo = f.total, _s(c.snapshot()));
    }).catch(() => {
    })), zt.hidden = !(p && bo > 0);
    const g = zt.querySelector(".claim-n");
    g && bo > 0 && (g.textContent = `${bo.toLocaleString()} of ${xo.toLocaleString()} left`);
  }
  const Fo = document.getElementById("youStatus");
  function Ps(l) {
    if (!Fo || l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "intro" || l.step === "connect" || l.step === "elsewhere";
    Fo.dataset.on = g ? "1" : "0";
    const j = Fo.querySelector("b"), ie = Fo.querySelector(".you-status__t > span");
    !j || !ie || (j.textContent = g ? "Connected to Xtrata Music" : f ? "No player connected" : "Your player is not connected", ie.textContent = g ? "Every play goes to the artist, and your likes are saved." : f ? "Connect a player to play songs and pay the artists you listen to." : l.step === "locked" ? "Unlock it below to carry on listening." : "See below for what it needs.");
  }
  function So(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, j = l.step === "elsewhere" && !t, ie = g || f || j ? "" : Qr[l.step] ?? "", ve = g ? "on" : j ? "free" : ie ? "off" : "";
    ve ? document.documentElement.dataset.ppp = ve : delete document.documentElement.dataset.ppp, Ns && (Ns.hidden = !ve || ve === "free", Ns.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), Nn && (Nn.hidden = ve !== "off" && ve !== "free", Nn.classList.toggle("is-free", ve === "free"), ve === "free" ? (Nn.querySelector(".nudge-t").textContent = "You’re on the free player", Nn.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Nn.querySelector("button").textContent = "Get a player") : ve === "off" && (Nn.querySelector(".nudge-t").textContent = ie, Nn.querySelector(".nudge-s").textContent = B(l) ? l.step === "intro" ? yC : "" : "This radio requires a funded listening wallet with music support on.", Nn.querySelector("button").textContent = _r[l.step] ?? "Start"));
  }
  let jo = "";
  function zn(l) {
    const p = $("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append($("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append($("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = $("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = jo, g.oninput = () => {
      jo = g.value;
    };
    const f = Ee(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), jo = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", Ee("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const va = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function $i() {
    const l = $("p", va + " ", "ppp-mute");
    return l.append(ft("Xverse", "https://www.xverse.app/download"), " · ", ft("Leather", "https://leather.io/install-extension")), l;
  }
  let Ro = "";
  const Us = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? Pe(l.listening) : "new" : "", f = fI() ? "1" : "", j = l.standIn && !l.mainConnected ? ut(l.standIn) : "";
    `${g}|${f}|${j}` !== Ro && (Ro = `${g}|${f}|${j}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, j ? p.dataset.pppAs = j : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => se(c.snapshot()), l);
  function b(l, p = "") {
    const g = $("div", "", "ppp-topup"), f = k(l);
    g.append($("span", "Add plays from My player: ", "ppp-mute"));
    for (const j of cl) {
      const ie = Ee(`+${j.toLocaleString()}`, () => void c.topUpAlbum(j), p);
      ie.disabled = f === void 0 || f < j || l.depositPending || !!l.busy, g.append(ie);
    }
    return f !== void 0 && f < cl[0] && g.append($("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const k = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - an - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function G(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (J = !1), p.low && !J) return [];
    const g = $("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const j = $("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && j.append(ft("View", st(p.txid))), g.append(j), [g];
    }
    g.append($("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append($("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append($("p", p.address, "ppp-addr-full"));
    const f = $("div", "", "ppp-open-row");
    if (f.append(fr("copy-likes-address", "Copy address", () => p.address, "primary", () => se(c.snapshot()))), p.main && !l.solo) {
      const j = To - (p.balance ?? 0n);
      j > 0n && f.append(mo(l, `Pay ${jr(j)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append($("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const ee = (l) => {
    const p = $("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = $("p", "", "ppp-wait-t"), f = $("div", "", "ppp-wait-track");
    return f.append($("div", "", "ppp-wait-fill")), p.append(g, f), Ce(p), p;
  };
  function Ce(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), j = l.querySelector(".ppp-wait-fill"), ie = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const ve = Math.ceil((g - f) / 1e3);
      j.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", ie.textContent = `Loading your plays · ${ve}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      j.style.width = "", ie.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let q = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      q = 0;
      return;
    }
    l.forEach(Ce), ++q % 10 === 0 && se(c.snapshot());
  }, 1e3);
  let ke = null;
  function Se(l) {
    if (l.step === "loading" && ke !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== ke && (ke = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function se(l) {
    var Jh, Qh, ep, tp, np, rp, op, sp, ip, ap, cp, lp, up, dp, fp, hp, pp, gp;
    if (m.sync(), dn && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = dn;
      dn = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = v.inProgress(l), g = Te(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: Ol } } : l, j = f.error === Hl;
    if (Ut(), br(l), de(l), Ct = un(l), D(l, f), Se(f), Us(f), !p && v.inProgress(l)) return;
    if (Do(f), So(f), _s(f), Ps(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? T.on ? wC : "Checking your listening wallet…" : T.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      He(f, !1);
      return;
    }
    const [ie, ve] = Sa(f), fe = s(".ppp-state");
    fe.textContent = ie, fe.className = "ppp-state" + (ve ? " ppp-state--" + ve : ""), fe.hidden = !ie;
    const Me = !!f.busy || f.armed, Tt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Me || !["intro", "loading"].includes(f.step));
    o.hidden = !Tt, o.classList.toggle("ppp-frame--rest", !Me && !Zn);
    const ct = s(".ppp-frame-label");
    ct.hidden = !0;
    const Ve = cI(f) ?? Zt;
    Zt = Ve;
    const Ge = "xtrata.radio.ppp.heard.v1", Oe = (() => {
      try {
        return localStorage.getItem(Ge) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Oe && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(Ge, "1");
      } catch {
      }
    const It = Oe || f.slot > 0 && ((((Jh = f.likeFunds) == null ? void 0 : Jh.balance) ?? 0n) > 0n || P.count() > 1), Xt = B(f), rr = !Xt && uI({ ...f, heard: It }, Ve);
    s(".ppp-badge").hidden = !rr;
    const Ko = s(".ppp-steps"), Ao = s(".ppp-stage");
    Ko.hidden = Ao.hidden = !rr, Ve && rr && (Ko.replaceChildren(...bf(f.solo).map((Z, he) => {
      const Re = $("li", "", he < Ve.at ? "done" : he === Ve.at ? Ve.blocked ? "now blocked" : "now" : "");
      return Re.append($("span", he < Ve.at ? "✓" : String(he + 1), "n"), Z), he === Ve.at && Re.setAttribute("aria-current", "step"), Re;
    })), Ao.textContent = Ve.caption, Ao.className = "ppp-stage " + (Ve.at >= bf(f.solo).length ? "ppp-ok" : Ve.blocked ? "ppp-bad" : "ppp-cyan"));
    const Li = s(".ppp-facts"), Gn = [];
    f.main && ((Qh = f.gate) != null && Qh.here) && !f.solo && Gn.push(...Rn("Your wallet", ut(f.main), "ppp-addr-short"));
    const Gh = () => {
      if (!f.listening) return;
      const Z = fr("copy-listening", "Copy", () => f.listening || "", "tiny", () => se(c.snapshot()));
      Gn.push(...Rn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", Pe(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || Gh(), f.listening && f.step !== "intro")
      if (f.linked)
        Gn.push(...Rn("Credited to", `${ut(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Gh();
      else if (f.solo) {
        f.creditedTo && Gn.push(...Rn("Credited to", `${ut(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${ut(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Gn.push(...Rn("Returns go to", f.gift ? Z : f.returnTo && !nr(f.returnTo) ? Z.replace(Pe(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Gn.push(...Rn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((ep = f.gate) != null && ep.here)) {
      const Z = f.linkedListening.map((he) => Pe(he) + (he === f.listening ? " (this one)" : "")).join(", ");
      Gn.push(...Rn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Gn.push(...Rn("Balance", `${jr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const ka = f.entries.find((Z) => Z.kind === "play");
    ka && Br(), ka && Gn.push(...Rn("Last paid song", `${Mn(ka)} → ${ut(ka.recipient)}`, Ei[ka.status] || "")), Li.replaceChildren(...Gn), Li.hidden = !Gn.length;
    const Fe = [], Mt = [], Ft = [], or = [], Kh = Hn(BigInt(((tp = f.gate) == null ? void 0 : tp.limits.playFee) ?? "300")), Vh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${jr(Pl)} STX to the song holder, plus a ${jr(Kh - Pl)} STX network fee.`, Xh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Fe.push($("p", "Pay artists as you listen.")), (np = f.gate) != null && np.radioUrl) {
          const he = $("p");
          he.append(ft("Open the pay-per-play radio →", f.gate.radioUrl)), Fe.push(he);
        }
        Mt.push($("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const he = [f.linked, ...f.others];
          Fe.push($("p", he.length > 1 ? `This device has listening wallets for ${Oo(he)}.` : `This device has a listening wallet for ${ut(f.linked)}.`)), Mt.push($("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), he.slice(0, 3).forEach((Re, xt) => Ft.push(Ee(`Open ${ut(Re)}`, () => Bs(Re), xt === 0 ? "primary" : "")));
        } else
          Fe.push($("p", "Connect your wallet to pay artists as you listen.")), Mt.push($("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Fe.push($("p", `This device's listening wallet belongs to ${ut(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Mt.push($("p", `You are connected as ${ut(f.main)}. Switch to the linked wallet to continue listening.`)), Mt.push($("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Ft.push(Ee("Switch wallet", Sr, "primary"));
        break;
      case "not-invited":
        Fe.push($("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Fe.push($("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Fe.push($("p", "Every play counts for the song’s owner, on-chain.")), Mt.push($("p", Vh)), Mt.push($("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Mt.push($("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Fe.push($("p", `This device already has a listening wallet for ${Oo(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Mt.push($("p", `Otherwise, set up a new listening wallet for ${ut(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Mt.push($("p", `This is the listening wallet for ${ut(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Mt.push($("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = v.liveGift();
        Ft.push(Ee(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${ut(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && Ft.push(Ee("Switch wallet", Sr)), !Z && f.solo && Ft.push(Ee("I have a Stacks wallet", Sr)), Ft.push(Ee("I already have a listening wallet", () => void c.unlock(!0))), Z && Ft.push(Ee("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Fe.push($("p", "Locked.", "ppp-mute")), Ft.push(Ee("Unlock", () => void c.unlock(), "primary"))), f.standIn ? or.push(Ee("Use a different listening wallet", () => void Ms().then((he) => {
          he === "stacks" && Sr();
        }), "quiet")) : or.push(Ee("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        Fe.push($("p", `Link to ${ut(f.main)} · free`)), Mt.push($("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Mt.push($("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Ft.push(Ee(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        Fe.push($("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Fe.push(ee(f.arrival)) : $e(f) ? Fe.push($("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (rp = f.gift) != null && rp.player ? Fe.push($("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Fe.push($("p", "No plays left · add plays to keep counting", "ppp-bad")) : Fe.push($("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Kh)).toLocaleString()} plays`)), f.entries.length && Mt.push($("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && Mt.push($("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? Mt.push($("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? Mt.push($("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (Mt.push($("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Mt.push($("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Ft.push(fr("copy-address", "Copy my address", () => f.listening || "", "primary", () => se(c.snapshot())))) : Mt.push($("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const he = $("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          he.append(ft("View", st(f.depositTxid))), Fe.push(he);
        } else f.allowance > 0n && !f.solo && !f.depositPending && Ft.push(mo(f, `Deposit ${jr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        Fe.push($("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (Fe.push($("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Ft.push(Ee("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (Fe.push($("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Fe.push(zn(f))), (!f.solo || f.returnTo) && Ft.push(Ee("Return excess", () => void c.returnFunds("excess"), "primary"), Ee("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((op = f.giftStop) == null ? void 0 : op.reason) !== "off") {
          const he = Math.min(f.session.playsLeft, f.playsLeft);
          Fe.push($("p", `${he.toLocaleString()} plays left`, "ppp-ok")), Mt.push($("p", Vh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Ft.push(Ee("Switch off", () => void c.switchOff()));
        } else
          Fe.push($("p", "Switch on music support to listen.", "ppp-mute")), Ft.push(Ee("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && Fe.push($("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Fe.push($("p", "Running low on plays", "ppp-warn")), f.aboveTarget && Fe.push($("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? Fe.push($("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Ft.push(mo(f, `Top up ${jr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", he = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? Ft.unshift(Ee("Add plays", () => De(), "primary")) : he ? Ft.push(Ee("Add plays", () => De(), "primary")) : f.step === "ready" && or.push(Ee("Add plays", () => De(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && Mt.push($("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Mt.push(zn(f)), Mt.push($i()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = $("p", "New to Stacks? ", "ppp-mute");
      Z.append(ft("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Fe.push(Z);
    }
    if (f.walletOutdated && Mt.push($("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Fe.push($("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Ft.push(Ee("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && or.push(Ee(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${ut(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((sp = f.gift) != null && sp.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && or.push(b(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && or.push(Ee(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && or.push(Ee("Lock", () => void c.lock(), "quiet")), Tt && !Me && or.push(Ee(Zn ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Zn = !Zn, se(c.snapshot());
    }, "quiet")), [...Ft, ...or].forEach((Z) => Z.disabled = Xh), Xh && (Ft.length = 0), !Xt && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((ip = f.gift) != null && ip.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", he = Fe.at(0);
      f.step === "ready" && he ? he.append($("span", ` · ${Ze(f.balance)} STX`, Z)) : Fe.push($("p", `Balance ${Ze(f.balance)} STX`, Z));
    }
    if (Xt) {
      for (const Re of [...Ft, ...or]) {
        const xt = fC[Re.textContent ?? ""];
        xt && (Re.textContent = xt);
      }
      for (let Re = Fe.length - 1; Re >= 0; Re--) ly(Fe[Re].textContent) && Mt.unshift(...Fe.splice(Re, 1));
      for (let Re = Ft.length - 1; Re >= 0; Re--) ly(Ft[Re].textContent) && or.unshift(...Ft.splice(Re, 1));
      const Z = f.entries.some((Re) => Re.kind === "play"), he = gC(f.step, { played: Z, arriving: f.depositPending });
      he.length && Fe.length && he.shift(), Fe.push(...he.map((Re) => $("p", Re, "ppp-mute")));
    }
    if ((ap = f.gift) != null && ap.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = $("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const he = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? $("span", " · plays on their way", "ppp-warn") : $("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      he && Z.append(he);
      const Re = (cp = Fe.at(0)) == null ? void 0 : cp.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Re && /STX/.test(Re.textContent ?? "") && Re.remove(), Fe.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Fe.splice(1, 0, $("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), b(f, "primary"));
        else {
          const xt = $("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          xt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), xt.append(ft("Xverse", "https://www.xverse.app/download"), " and ", ft("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Fe.splice(1, 0, xt);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, he = $("div", "", "ppp-pick");
      he.append($("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Re = $("ul", "", "ppp-gift-list");
      Z.steps.forEach((xt, Or) => {
        const sr = xt.kind === "gift" ? "the unused gift" : xt.kind === "deposit" ? "what was added to it" : "the rest", $n = $("li");
        $n.append($("span", `${Or + 1}. ${jr(BigInt(xt.send))} STX · ${sr}`, "t"), $("span", xt.to ? ` → ${ut(xt.to)}` : " → choose an address below", xt.to ? "ppp-mute" : "ppp-warn")), Re.append($n);
      }), he.append(Re), Z.kept && he.append($("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((xt) => !xt.to) && he.append(zn(f)), he.append(Ee(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), Fe.push(he);
    }
    const Vo = S(f), Eo = X ? Vo : null, Ci = ue(f, !!Eo), r1 = Ci === "gift" || Ci === "arriving" || Ci === "new", xu = Eo ? null : w.lines(l), Su = xu && !w.claiming() ? xu : [...xu ?? [], ...v.banner(l, { bare: !!Eo || Ci === "gift" || Ci === "arriving" })], gc = wn && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? jn(wn, v.pendingCode()) : [];
    Eo || (Fe.unshift(...Su), Fe.push(...G(f)), Fe.unshift(...gc)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Fe.unshift($("p", `This is ${ut(f.creditedTo)}'s listening wallet. Plays and likes count for ${ut(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...Fe);
    const vu = document.querySelector(".ppp-switch");
    if (vu) {
      const Z = P.latest(), he = f.slot > 0, Re = ["fund", "ready", "over"].includes(f.step) && (he || !!Z);
      if (vu.hidden = !Re, Re) {
        const xt = ($n, wc, mc, Lu) => {
          const Mi = Ee("", Lu, "ppp-tab");
          return Mi.setAttribute("aria-pressed", String(mc)), Mi.append($("span", $n, "tt"), $("span", wc === void 0 ? "…" : `${$t(wc).toLocaleString()} plays`, "ts")), Mi.disabled = !!f.busy, Mi;
        }, Or = he ? ((up = (lp = f.gift) == null ? void 0 : lp.player) == null ? void 0 : up.title) ?? "Album" : Z.title, sr = Ee("View all albums" + (P.count() > 1 ? ` (${P.count()})` : ""), () => {
          if (Je()) {
            window.dispatchEvent(new CustomEvent("xtrata:radio-browse", { detail: { tab: "albums" } }));
            return;
          }
          const $n = document.querySelector(".ppp-shelf");
          $n && ($n.hidden = !1, $n.open = !$n.open, sr.setAttribute("aria-expanded", String($n.open)), $n.open && requestAnimationFrame(() => $n.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        sr.setAttribute("aria-expanded", String(!!((dp = document.querySelector(".ppp-shelf")) != null && dp.open))), vu.replaceChildren(
          xt("🎧 My player", he ? (fp = f.likeFunds) == null ? void 0 : fp.balance : f.balance, !he, () => {
            he && c.openAlbum(0);
          }),
          xt("💿 " + Or, he ? f.balance : void 0, he, () => {
            !he && Z && c.openAlbum(Z.slot);
          }),
          sr
        );
      }
    }
    const Xo = P.render(f), Ti = document.querySelector(".ppp-shelf"), yc = Je() ? document.getElementById("shelfBox") : null;
    if (yc)
      Xo ? yc.firstChild !== Xo && yc.replaceChildren(Xo) : yc.replaceChildren(), Ti && (Ti.hidden = !0), U(!!Xo);
    else if (Ti) {
      Ti.hidden = !Xo;
      const Z = Ti.querySelector("summary");
      Z && (Z.textContent = P.count() > 0 ? `♪ My albums (${P.count()})` : "♪ My albums");
      const he = Ti.querySelector(".ppp-shelf-body");
      Xo && he && !he.contains(Xo) && he.replaceChildren(Xo);
    }
    const $a = v.renderFold(l);
    if (s(".ppp-gifts").hidden = !$a, $a && !s(".ppp-gift-body").contains($a) && s(".ppp-gift-body").replaceChildren($a), $a && Uo) {
      Uo = !1;
      const Z = s(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Au = document.querySelector("#ppp .ppp-featured");
    if (Au) {
      const Z = C(), he = m.manage(), Re = (Z.length > 0 || !!he) && f.slot === 0 && !((hp = f.gift) != null && hp.player) && f.step === "ready";
      Au.hidden = !Re, Re && Au.replaceChildren(...Z.length ? [$("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((xt) => {
        const Or = (Fn == null ? void 0 : Fn.id) === xt.id, sr = Ee("", () => Dt(Or ? null : xt, !Or), "ppp-featured__a" + (Or ? " is-on" : "")), $n = Xr(xt).length;
        return sr.append($("b", xt.title), $("span", Or ? "Playing now · tap to go back to the radio" : `${xt.subtitle ? xt.subtitle + " · " : ""}${$n} ${$n === 1 ? "song" : "songs"}`)), sr.setAttribute("aria-pressed", String(Or)), sr.disabled = !!f.busy, sr;
      }), ...he ? [he] : []);
    }
    const Eu = document.querySelector("#ppp .ppp-release-in-slot");
    if (Eu) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : m.banner();
      Eu.hidden = !Z.length, Eu.replaceChildren(...Z);
    }
    const Bi = document.querySelector("#ppp .ppp-release");
    if (Bi) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : m.fold();
      if (Bi.hidden = !Z, Z) {
        const he = document.activeElement instanceof HTMLElement && Bi.contains(document.activeElement) ? document.activeElement : null, Re = ((pp = Bi.querySelector(".ppp-release-songs")) == null ? void 0 : pp.scrollTop) ?? 0;
        (gp = Bi.querySelector(".ppp-release-body")) == null || gp.replaceChildren(...Z);
        const xt = Bi.querySelector(".ppp-release-songs");
        xt && Re && (xt.scrollTop = Re), he && he.isConnected && document.activeElement !== he && he.focus({ preventScroll: !0 });
      }
    }
    _n(f);
    const ku = document.querySelector("#ppp .ppp-yours");
    if (ku) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      ku.hidden = !Z;
      const he = ku.querySelector(".ppp-yours-body");
      if (Z && he && he.getAttribute("data-for") !== f.listening) {
        he.setAttribute("data-for", f.listening);
        const Re = (Lu, ...Mi) => {
          const yp = $("details", "", "ppp-yours-item");
          return yp.append($("summary", Lu), ...Mi), yp;
        }, xt = $("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        xt.append($("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Or = $("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), sr = $("p");
        sr.append(ft("Find a name at BNS One →", "https://bns.one"));
        const $n = $("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), wc = $("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), mc = $("p");
        mc.append(ft("See the giveaway →", "https://xtrata.xyz/giveaway")), he.replaceChildren(
          Re("Give your player a name", xt, Or, $("p", f.listening, "ppp-addr-full"), fr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => se(c.snapshot())), sr),
          Re("Link it to a wallet you already have", $n),
          Re("Bring a friend in", wc, mc)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Mt), s(".ppp-actions").replaceChildren(...Ft), s(".ppp-actions2").replaceChildren(...or);
    const $u = f.busy || f.message || "", qh = s(".ppp-msg"), Iu = $u && Fe.some((Z) => (Z.textContent ?? "").startsWith($u.replace(/[.✓\s]+$/, ""))) ? "" : $u, Yh = !Iu && !f.error ? f.notice : j && !Iu ? f.error : "";
    qh.textContent = Iu || Yh, qh.classList.toggle("is-warn", !!Yh), s(".ppp-err").textContent = j ? "" : f.error;
    const o1 = f.entries.filter((Z) => Z.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...o1.slice(0, 5).map((Z) => {
      const he = $("li"), Re = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return he.append($("span", "", "d " + Re), $("span", Mn(Z), "t"), $("span", pt(Z.created), "ppp-mute")), Z.txid && he.append(ft("tx", st(Z.txid))), he;
    })), Jt(f), s(".ppp-wallets").hidden = !(Li.childElementCount || or.length), s(".ppp-more").hidden = !Mt.length;
    const Wh = s(".ppp-history");
    Wh.hidden = !f.entries.length, f.entries.length && Br(), Wh.replaceChildren($("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const he = $("div", "", "ppp-row"), Re = Z.kind === "play" ? [$("span", Mn(Z), "ppp-song"), $("span", ` · ${jr(BigInt(Z.amount))} STX to ${ut(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [$("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${Mn(Z)}`, "ppp-song"), $("span", ` · for ${f.linked ? ut(f.linked) : "this listening wallet"}`, "ppp-mute")] : [$("span", `Returned ${jr(BigInt(Z.amount))} STX`, "ppp-song"), $("span", ` to ${ut(Z.recipient)}`, "ppp-mute")];
      return he.append(
        $("span", ki[Z.status] || Z.status, "ppp-status " + (Ei[Z.status] || "")),
        ...Re,
        $("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && he.append(ft("tx ↗", st(Z.txid))), he;
    })), Y == null || Y.render(Eo ? mn(f, Eo, [...gc, ...Su]) : null), He(f, !!Eo, r1 ? [...gc, ...Su] : gc, Ci), xe(f, !!Eo || !!(Bt != null && Bt.showing())), Pr(f, Eo), vt.isOpen() && vt.refresh(), Ii();
    const Zh = (Vo == null ? void 0 : Vo.mode) === "open" ? null : yn(f);
    qe == null || qe.render((Vo == null ? void 0 : Vo.mode) === "open" ? mn(f, Vo, []) : Zh ? { ...mn(f, { mode: "open", player: Zh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function Je() {
    const l = document.documentElement;
    return l.hasAttribute("data-skin") && !l.hasAttribute("data-view") && !!document.getElementById("shelfBox");
  }
  function S(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && pn({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = Ye();
    return g && (l.step === "locked" || dn && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const N = (l, p, g, f, j) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...j ? { b: j } : {}, p: String(f), s: fy(Tg, p, g) })}`;
  function K(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? F ? "making" : null : p.state === "claimed" ? F && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || we || l.step === "link" && W !== "have" ? null : W === "making" || W === "yours" ? "ready" : W;
  }
  function xe(l, p) {
    if (!_) return;
    const g = l.award, f = g != null && g.cls && Yc(g.cls) ? Vs(g.cls) : null, j = l.slot === 0 ? l.listening : l.root, ie = p || !g || !f || !j || g.number === void 0 ? null : K(l);
    if (!ie || !g || !f || !j) {
      _.render(null, p);
      return;
    }
    ie === "have" && l.linked && !le && (le = !0, c.awardRefresh());
    const ve = typeof g.name == "string" && g.name ? g.name : null, fe = [];
    l.error && fe.push($("p", l.error, "ppp-warn"));
    const Me = (Tt) => {
      W = Tt, Tt === "name" && (F = !0), se(c.snapshot());
    };
    _.render({
      screen: ie,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: j,
      name: g.name,
      inscription: g.inscription,
      art: ie === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : N(f, g.number, j, g.need ?? 0, ve),
      claimLink: g.claimTx ? st(g.claimTx) : void 0,
      status: fe,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? ut(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => fr("award-player-address", "Copy my player’s address", () => j, "tiny", () => se(c.snapshot())),
      go: Me,
      claim: (Tt) => {
        F = !0, c.claimAward(Tt);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var Tt;
        return (Tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : Tt.click();
      },
      link: () => void c.link(),
      later: () => {
        we = !0;
        try {
          localStorage.setItem(M, String(Date.now()));
        } catch {
        }
        se(c.snapshot());
      },
      done: () => {
        F = !1, W = "ready", se(c.snapshot());
      }
    }, p);
  }
  function Jt(l) {
    const p = document.querySelector("#ppp .ppp-paid");
    if (!p) return;
    const g = document.documentElement, f = l.entries.filter((fe) => fe.kind === "play" && !["failed", "cancelled"].includes(fe.status)), j = g.hasAttribute("data-skin") && !g.hasAttribute("data-view") && f.length > 0;
    if (Tr = j, p.hidden = !j, !j) {
      p.replaceChildren();
      return;
    }
    Br();
    const ie = $("ol");
    for (const fe of f.slice(0, xr ? At : rn)) {
      const { title: Me, artist: Tt } = Ho(fe.song, fe), ct = Me || `Song #${fe.song}`, Ve = $("li", "", "ppp-paid__row"), Ge = $("span", "", "ppp-paid__art"), Oe = Rl(String(fe.song));
      if (Oe) {
        const Xt = document.createElement("img");
        Xt.src = Oe, Xt.alt = "", Xt.decoding = "async", Ge.append(Xt);
      } else
        Ge.textContent = "♪", Ge.setAttribute("aria-hidden", "true");
      const It = $("span", "", "ppp-paid__t");
      if (It.append($("b", ct), $("span", [Tt, gt(fe.created)].filter(Boolean).join(" · "))), Ve.append(Ge, It), fe.status === "confirmed" && fe.txid) {
        const Xt = ft("Receipt", st(fe.txid));
        Xt.className = "ppp-paid__r", Xt.setAttribute("aria-label", `Receipt for ${ct}`), Ve.append(Xt);
      } else Ve.append($("span", fe.status === "unknown" ? "Checking…" : "Paying…", "ppp-paid__r ppp-mute"));
      ie.append(Ve);
    }
    const ve = [$("h4", "Who you have paid"), ie];
    if (f.length > rn) {
      const fe = Ee(xr ? "Show fewer" : `Show more (${Math.min(f.length, At) - rn})`, () => {
        xr = !xr, se(c.snapshot());
      }, "ppp-paid__more");
      ve.push(fe);
    }
    ve.push($("p", "Every play pays the artist, and anyone can check it.", "ppp-paid__note")), p.replaceChildren(...ve);
  }
  function _n(l) {
    var Ve;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, j = g != null && g.cls && Yc(g.cls) ? Vs(g.cls) : null, ie = !!g && !!j && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !ie, !ie || !g || !j || !f) {
      p.replaceChildren();
      return;
    }
    const ve = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === ve) return;
    p.setAttribute("data-sig", ve);
    const fe = (Ge) => {
      const Oe = $("p", "", "ppp-award__h");
      return Oe.append($("b", `${j.mark} Music Hero award`), $("span", Ge)), Oe;
    }, Me = `No. ${String(g.number ?? 0).padStart(4, "0")}`, Tt = (Ge) => {
      const Oe = $("div", "", "ppp-award__art"), It = document.createElement("iframe");
      return It.src = Ge, It.title = `${j.name} record`, It.setAttribute("sandbox", "allow-scripts"), It.setAttribute("loading", "lazy"), Oe.append(It), Oe;
    }, ct = [];
    if (g.state === "claimed") {
      if (ct.push(fe(`${j.name} record · ${Me}`)), g.inscription !== void 0 && ct.push(Tt(`/i/${g.inscription}`)), ct.push($("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${j.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const Ge = $("p");
        Ge.append(ft("Open it full screen ↗", `/i/${g.inscription}`)), ct.push(Ge);
      }
      if (g.sendTx) {
        const Ge = $("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Ge.append(ft("View", st(g.sendTx))), ct.push(Ge);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const Ge = $("details", "", "ppp-award__send"), Oe = document.createElement("input");
        Oe.type = "text", Oe.placeholder = "SP… address to send it to", Oe.autocomplete = "off", Oe.spellcheck = !1, Oe.setAttribute("aria-label", "Address to send your record to");
        const It = Ee("Send my record…", () => void c.sendAward(Oe.value), "");
        It.disabled = !!l.busy, Ge.append(
          $("summary", "Send this record to someone"),
          $("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          Oe,
          It
        ), ct.push(Ge);
      }
    } else if (g.claimTx) {
      ct.push(fe(`${j.name} record · ${Me}`));
      const Ge = $("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Ge.append(ft("View", st(g.claimTx))), ct.push(Ge);
    } else if (g.state === "ready") {
      ct.push(fe(`${j.name} record · ${Me}`));
      const Ge = typeof g.name == "string" && g.name ? g.name : null, Oe = new URLSearchParams({ n: String(g.number), a: f, ...Ge ? { b: Ge } : {}, p: String(g.need), s: fy(Tg, g.number, f) });
      ct.push(Tt(`/awards/${j.id}#${Oe}`)), ct.push($("p", `Your ${j.name} record is ready. You have paid artists for ${(Ve = g.need) == null ? void 0 : Ve.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const It = $("div", "", "ppp-award__row");
      Ge ? (ct.push($("p", `Its plaque will carry ${Ge} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), It.append(Ee("Claim my record", () => {
        F = !0, c.claimAward("auto");
      }, "primary"), Ee("Use my address only", () => {
        F = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (ct.push($("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), It.append(Ee("Claim my record", () => {
        F = !0, c.claimAward("none");
      }, "primary"), Ee("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (ct.push($("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), It.append(Ee("Check for a name again", () => void c.awardRefresh(), "primary"), Ee("Claim with my address only", () => void c.claimAward("none"), "quiet"))), It.querySelectorAll("button").forEach((Xt) => {
        Xt.disabled = !!l.busy;
      }), ct.push(It, $("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      ct.push(fe(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const Ge = $("div", "", "ppp-award__bar"), Oe = document.createElement("i");
      Oe.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, Ge.append(Oe);
      const It = g.need - g.have;
      ct.push(Ge, $("p", `${It.toLocaleString()} more ${It === 1 ? "play" : "plays"} and your ${j.name} record is yours to claim.`, "ppp-mute"));
    } else
      ct.push(fe(`${j.name} record · ${Me}`)), ct.push($("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...ct);
  }
  function Pr(l, p) {
    var fe;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (_ != null && _.showing()) && ((fe = l.award) != null && fe.cls) && Yc(l.award.cls) && (l.busy || l.armed)) {
      const Me = Vs(l.award.cls), Tt = $("span", "", "ppp-skin__t");
      Tt.append($("b", `${Me.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), $("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren($("span", Me.mark, "ppp-skin__art ppp-skin__art--none"), Tt);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (g.hidden = !f, !f || !p) {
      g.replaceChildren();
      return;
    }
    const j = ll(p.player.cover), ie = j ? $("img", "", "ppp-skin__art") : $("span", "♪", "ppp-skin__art ppp-skin__art--none");
    j && (ie.src = j, ie.alt = "");
    const ve = $("span", "", "ppp-skin__t");
    ve.append($("b", p.player.title), $("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(ie, ve);
  }
  function mn(l, p, g) {
    var Me, Tt, ct, Ve, Ge;
    const f = !!l.busy || l.armed, j = [...g];
    l.depositPending && l.arrival && j.push(ee(l.arrival)), l.error ? j.push($("p", l.error, l.error === Hl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? j.push($("p", l.message, "ppp-cyan")) : l.notice && j.push($("p", l.notice, "ppp-warn")), p.mode === "open" && J && ((Me = l.likeFunds) != null && Me.album) && l.likeFunds.low && !l.likeFunds.pending && j.push($("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ie = "Kept on this device with Face ID or your passkey. No app or account needed.", ve = null, fe = null;
    if (p.mode === "locked")
      ve = { label: "Continue listening", run: () => {
        dn = Ye(), c.unlock();
      } }, fe = { label: "Use a different passkey", run: () => {
        dn = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && Qc(dt) && dt.album === p.player.id) {
        const Oe = window.XtrataRadio, It = Xr(p.player)[0], Xt = dt.phase === "playing";
        ve = { label: Xt && !!((ct = (Tt = Oe == null ? void 0 : Oe.getState) == null ? void 0 : Tt.call(Oe)) != null && ct.playing) ? "Pause" : Xt ? "Carry on" : "Play the first song", run: () => {
          var Ko, Ao;
          Xt ? (Ko = Oe == null ? void 0 : Oe.playPause) == null || Ko.call(Oe) : It && ((Ao = Oe == null ? void 0 : Oe.playToken) == null || Ao.call(Oe, It.id));
        } }, fe = { label: "Make my player and hear it all", run: () => void c.create() }, ie = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const Oe = dt.phase === "done" && dt.album === p.player.id;
        Oe && !j.length && j.push($("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), ve = { label: Oe ? "Keep listening" : "Open album", run: () => void c.create() }, fe = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (ve = { label: "Open album", run: () => void c.unlock() }, fe = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? j.push($("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : j.length || j.push($("p", "Opening your album…", "ppp-cyan"));
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
      primary: ve,
      secondary: fe,
      hint: ve ? ie : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: k(l),
      topUps: cl,
      canMake: !!((Ge = (Ve = l.gate) == null ? void 0 : Ve.gifts) != null && Ge.admin)
    };
  }
  const Ur = document.getElementById("findBox"), vo = document.getElementById("findBody"), zo = Ur && vo ? NC(vo, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => CC(l == null ? void 0 : l.tracks, (p, g) => ({ title: jg(p, Ai(g.title) ? "" : g.title), artist: Dg(p, g.artist || "") }))),
    play: (l) => {
      var p, g;
      (g = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || g.call(p, l);
    },
    current: () => {
      var p, g, f, j;
      const l = Number((j = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : j.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var p, g;
      return !!((g = (p = window.XtrataRadio) == null ? void 0 : p.isExplicit) != null && g.call(p, l));
    },
    liked: (l) => Ea().has(l),
    grid: document.documentElement.hasAttribute("data-skin"),
    // the new look lists artist names three across
    leaveAlbum: () => x(0)
  }) : null;
  Ur == null || Ur.addEventListener("toggle", () => {
    Ur.open && (zo == null || zo.load());
  });
  let Aa = "";
  const Ea = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((j) => Number(j == null ? void 0 : j.tokenId)).filter(Number.isSafeInteger) : []);
  }, Ii = () => {
    var p, g, f, j, ie;
    if (!zo || !(Ur != null && Ur.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((ie = (j = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : j.nowPlaying) == null ? void 0 : ie.tokenId) ?? ""}|${[...Ea()].sort((ve, fe) => ve - fe).join(",")}`;
    l !== Aa && (Aa = l, zo.refresh());
  }, Go = /* @__PURE__ */ new Map();
  let jh = !1;
  const Rh = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && Go.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), Ii(), wt) {
        const f = `${(g == null ? void 0 : g.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Be && (Be = f, se(c.snapshot()));
      }
      if (Qc(dt)) {
        const f = !!(p != null && p.playing);
        Cr({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== jh && (jh = f, se(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Rh()) {
    const l = setInterval(() => {
      Rh() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (Qc(dt) && Cr({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      Br();
      const g = Ho(p.song, Go.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const GC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", KC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, VC = () => KC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, XC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, qC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', n1 = class {
  constructor(e) {
    J4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && mA(e), this.callback(ou(e));
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
    var r, s, o, i, a, c, u, h, d, w;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (i = (o = e.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (w = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = VC(), t = XC(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return We("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, We("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), We("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, We("div", { class: "flex flex-col space-y-[10px]" }, We("div", { class: "flex items-center" }, We("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), We("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, We("span", { class: "sr-only" }, "Close popup"), We("img", { src: GC }))), r ? We("p", null, "Select the wallet you want to connect to.") : We("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && We("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && We("div", { class: "mt-6" }, We("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), We("ul", { class: "space-y-3" }, this.installedProviders.map((o) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && We("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), We("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && We("div", { class: "mt-6" }, r ? We("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : We("div", { class: "mb-5 flex justify-between" }, We("p", { class: "text-sm font-medium" }, "Recommended wallets"), We("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, We("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), We("p", null, "What is a wallet? ", We("span", { class: "align-text-bottom text-[9px]" }, "↗")))), We("ul", { class: "space-y-3" }, n.map((o) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && We("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && We("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return N4(this);
  }
};
n1.style = qC;
const YC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: n1
}, Symbol.toStringTag, { value: "Module" }));
