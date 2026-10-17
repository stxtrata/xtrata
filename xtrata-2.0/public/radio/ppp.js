var nw = Object.defineProperty;
var rw = (t, e, n) => e in t ? nw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var eo = (t, e, n) => rw(t, typeof e != "symbol" ? e + "" : e, n);
var en = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function u0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function nc(t) {
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
      typeof en < "u" && en || {}, r = {
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
        var B = {
          next: function() {
            var m = v.shift();
            return { done: m === void 0, value: m };
          }
        };
        return r.iterable && (B[Symbol.iterator] = function() {
          return B;
        }), B;
      }
      function d(v) {
        this.map = {}, v instanceof d ? v.forEach(function(B, m) {
          this.append(m, B);
        }, this) : Array.isArray(v) ? v.forEach(function(B) {
          if (B.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + B.length);
          this.append(B[0], B[1]);
        }, this) : v && Object.getOwnPropertyNames(v).forEach(function(B) {
          this.append(B, v[B]);
        }, this);
      }
      d.prototype.append = function(v, B) {
        v = a(v), B = c(B);
        var m = this.map[v];
        this.map[v] = m ? m + ", " + B : B;
      }, d.prototype.delete = function(v) {
        delete this.map[a(v)];
      }, d.prototype.get = function(v) {
        return v = a(v), this.has(v) ? this.map[v] : null;
      }, d.prototype.has = function(v) {
        return this.map.hasOwnProperty(a(v));
      }, d.prototype.set = function(v, B) {
        this.map[a(v)] = c(B);
      }, d.prototype.forEach = function(v, B) {
        for (var m in this.map)
          this.map.hasOwnProperty(m) && v.call(B, this.map[m], m, this);
      }, d.prototype.keys = function() {
        var v = [];
        return this.forEach(function(B, m) {
          v.push(m);
        }), u(v);
      }, d.prototype.values = function() {
        var v = [];
        return this.forEach(function(B) {
          v.push(B);
        }), u(v);
      }, d.prototype.entries = function() {
        var v = [];
        return this.forEach(function(B, m) {
          v.push([m, B]);
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
        return new Promise(function(B, m) {
          v.onload = function() {
            B(v.result);
          }, v.onerror = function() {
            m(v.error);
          };
        });
      }
      function p(v) {
        var B = new FileReader(), m = y(B);
        return B.readAsArrayBuffer(v), m;
      }
      function $(v) {
        var B = new FileReader(), m = y(B), P = /charset=([A-Za-z0-9_-]+)/.exec(v.type), nt = P ? P[1] : "utf-8";
        return B.readAsText(v, nt), m;
      }
      function S(v) {
        for (var B = new Uint8Array(v), m = new Array(B.length), P = 0; P < B.length; P++)
          m[P] = String.fromCharCode(B[P]);
        return m.join("");
      }
      function C(v) {
        if (v.slice)
          return v.slice(0);
        var B = new Uint8Array(v.byteLength);
        return B.set(new Uint8Array(v)), B.buffer;
      }
      function V() {
        return this.bodyUsed = !1, this._initBody = function(v) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = v, v ? typeof v == "string" ? this._bodyText = v : r.blob && Blob.prototype.isPrototypeOf(v) ? this._bodyBlob = v : r.formData && FormData.prototype.isPrototypeOf(v) ? this._bodyFormData = v : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) ? this._bodyText = v.toString() : r.arrayBuffer && r.blob && i(v) ? (this._bodyArrayBuffer = C(v.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(v) || o(v)) ? this._bodyArrayBuffer = C(v) : this._bodyText = v = Object.prototype.toString.call(v) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof v == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return $(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(T);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var K = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E(v) {
        var B = v.toUpperCase();
        return K.indexOf(B) > -1 ? B : v;
      }
      function M(v, B) {
        if (!(this instanceof M))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        B = B || {};
        var m = B.body;
        if (v instanceof M) {
          if (v.bodyUsed)
            throw new TypeError("Already read");
          this.url = v.url, this.credentials = v.credentials, B.headers || (this.headers = new d(v.headers)), this.method = v.method, this.mode = v.mode, this.signal = v.signal, !m && v._bodyInit != null && (m = v._bodyInit, v.bodyUsed = !0);
        } else
          this.url = String(v);
        if (this.credentials = B.credentials || this.credentials || "same-origin", (B.headers || !this.headers) && (this.headers = new d(B.headers)), this.method = E(B.method || this.method || "GET"), this.mode = B.mode || this.mode || null, this.signal = B.signal || this.signal || function() {
          if ("AbortController" in n) {
            var X = new AbortController();
            return X.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && m)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(m), (this.method === "GET" || this.method === "HEAD") && (B.cache === "no-store" || B.cache === "no-cache")) {
          var P = /([?&])_=[^&]*/;
          if (P.test(this.url))
            this.url = this.url.replace(P, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var nt = /\?/;
            this.url += (nt.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      M.prototype.clone = function() {
        return new M(this, { body: this._bodyInit });
      };
      function T(v) {
        var B = new FormData();
        return v.trim().split("&").forEach(function(m) {
          if (m) {
            var P = m.split("="), nt = P.shift().replace(/\+/g, " "), X = P.join("=").replace(/\+/g, " ");
            B.append(decodeURIComponent(nt), decodeURIComponent(X));
          }
        }), B;
      }
      function et(v) {
        var B = new d(), m = v.replace(/\r?\n[\t ]+/g, " ");
        return m.split("\r").map(function(P) {
          return P.indexOf(`
`) === 0 ? P.substr(1, P.length) : P;
        }).forEach(function(P) {
          var nt = P.split(":"), X = nt.shift().trim();
          if (X) {
            var Vt = nt.join(":").trim();
            try {
              B.append(X, Vt);
            } catch (yt) {
              console.warn("Response " + yt.message);
            }
          }
        }), B;
      }
      V.call(M.prototype);
      function W(v, B) {
        if (!(this instanceof W))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (B || (B = {}), this.type = "default", this.status = B.status === void 0 ? 200 : B.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = B.statusText === void 0 ? "" : "" + B.statusText, this.headers = new d(B.headers), this.url = B.url || "", this._initBody(v);
      }
      V.call(W.prototype), W.prototype.clone = function() {
        return new W(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, W.error = function() {
        var v = new W(null, { status: 200, statusText: "" });
        return v.ok = !1, v.status = 0, v.type = "error", v;
      };
      var R = [301, 302, 303, 307, 308];
      W.redirect = function(v, B) {
        if (R.indexOf(B) === -1)
          throw new RangeError("Invalid status code");
        return new W(null, { status: B, headers: { location: v } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(B, m) {
          this.message = B, this.name = m;
          var P = Error(B);
          this.stack = P.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q(v, B) {
        return new Promise(function(m, P) {
          var nt = new M(v, B);
          if (nt.signal && nt.signal.aborted)
            return P(new e.DOMException("Aborted", "AbortError"));
          var X = new XMLHttpRequest();
          function Vt() {
            X.abort();
          }
          X.onload = function() {
            var I = {
              statusText: X.statusText,
              headers: et(X.getAllResponseHeaders() || "")
            };
            nt.url.indexOf("file://") === 0 && (X.status < 200 || X.status > 599) ? I.status = 200 : I.status = X.status, I.url = "responseURL" in X ? X.responseURL : I.headers.get("X-Request-URL");
            var U = "response" in X ? X.response : X.responseText;
            setTimeout(function() {
              m(new W(U, I));
            }, 0);
          }, X.onerror = function() {
            setTimeout(function() {
              P(new TypeError("Network request failed"));
            }, 0);
          }, X.ontimeout = function() {
            setTimeout(function() {
              P(new TypeError("Network request timed out"));
            }, 0);
          }, X.onabort = function() {
            setTimeout(function() {
              P(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function yt(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (X.open(nt.method, yt(nt.url), !0), nt.credentials === "include" ? X.withCredentials = !0 : nt.credentials === "omit" && (X.withCredentials = !1), "responseType" in X && (r.blob ? X.responseType = "blob" : r.arrayBuffer && (X.responseType = "arraybuffer")), B && typeof B.headers == "object" && !(B.headers instanceof d || n.Headers && B.headers instanceof n.Headers)) {
            var Be = [];
            Object.getOwnPropertyNames(B.headers).forEach(function(I) {
              Be.push(a(I)), X.setRequestHeader(I, c(B.headers[I]));
            }), nt.headers.forEach(function(I, U) {
              Be.indexOf(U) === -1 && X.setRequestHeader(U, I);
            });
          } else
            nt.headers.forEach(function(I, U) {
              X.setRequestHeader(U, I);
            });
          nt.signal && (nt.signal.addEventListener("abort", Vt), X.onreadystatechange = function() {
            X.readyState === 4 && nt.signal.removeEventListener("abort", Vt);
          }), X.send(typeof nt._bodyInit > "u" ? null : nt._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = d, n.Request = M, n.Response = W), e.Headers = d, e.Request = M, e.Response = W, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : en);
})();
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
var Li;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Li || (Li = {}));
var Ns;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ns || (Ns = {}));
var Mf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mf || (Mf = {}));
const cw = "https://api.mainnet.hiro.so", lw = "https://api.testnet.hiro.so", uw = "http://localhost:3999", fw = ["mainnet", "testnet", "devnet", "mocknet"];
let Ci = class {
  constructor(e) {
    this.version = Ns.Mainnet, this.chainId = Li.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ns.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? aw();
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
Ci.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ul();
    case "testnet":
      return new dw();
    case "devnet":
      return new hw();
    case "mocknet":
      return new f0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fw.join(", ")}`);
  }
};
Ci.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ci.fromName(t);
let ul = class extends Ci {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Mainnet, this.chainId = Li.Mainnet;
  }
}, dw = class extends Ci {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = Li.Testnet;
  }
}, f0 = class extends Ci {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = Li.Testnet;
  }
};
const hw = f0, d0 = "xtrata.wallet.bridge.v1", pw = (t) => typeof t == "object" && t !== null && t.protocol === d0, gw = (t) => pw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", yw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class no extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Nf = 12e4;
class ww {
  constructor(e) {
    eo(this, "pending", /* @__PURE__ */ new Map());
    eo(this, "listenTarget");
    eo(this, "closed", !1);
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
    eo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !gw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new no("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new no("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new no("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = yw(), s = { protocol: d0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new no(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Nf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Nf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new no("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const bw = ["SP", "SM"], mw = ["ST", "SN"], xw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return bw.includes(n) ? "mainnet" : mw.includes(n) ? "testnet" : null;
}, Sw = () => {
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
}, Ew = () => typeof window > "u" || !window.localStorage ? Sw() : window.localStorage, Pc = "xtrata.v15.1.wallet.session", Pf = "mainnet", La = { isConnected: !1 }, Aw = (t) => t.address ? xw(t.address) ?? t.network : t.network, h0 = (t) => !t.isConnected || !t.address ? { ...La } : Aw(t) !== Pf ? { ...La } : {
  isConnected: !0,
  address: t.address,
  network: Pf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, vw = (t) => {
  if (!t)
    return { ...La };
  try {
    const e = JSON.parse(t);
    return h0(e);
  } catch {
    return { ...La };
  }
}, $w = (t) => {
  const e = h0(t);
  return JSON.stringify(e);
}, kw = (t) => {
  const e = Ew();
  return {
    load: () => vw(e.getItem(Pc)),
    save: (n) => {
      e.setItem(Pc, $w(n));
    },
    clear: () => {
      e.removeItem(Pc);
    }
  };
}, Iw = "https://browser.blockstack.org/auth", Lw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, p0 = ["store_write"], Cw = "blockstack-session", Tw = {
  logLevel: "debug"
}, Zs = {
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
Object.freeze(Zs);
class Vi extends Error {
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
class Bw extends Vi {
  constructor(e, n = "") {
    super({ code: Zs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class _f extends Vi {
  constructor(e = "") {
    super({ code: Zs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class jo extends Vi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Zs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Uf extends Vi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Zs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class fl extends Vi {
  constructor(e) {
    super({ code: Zs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class g0 extends Vi {
  constructor(e) {
    super({ code: Zs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Hf = ["debug", "info", "warn", "error", "none"], dl = {};
for (let t = 0; t < Hf.length; t++) {
  const e = Hf[t];
  dl[e] = t;
}
class Si {
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
    return dl[Tw.logLevel] <= dl[e];
  }
}
function Mw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Nw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function _c(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function Pw() {
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
function Uw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = _w(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    Si.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Uw(i, t.toString(), n);
    throw Si.error(s), new Error(s);
  }
  if (r)
    return {};
}
function ps(t, e) {
  return yu(Ze(t), e);
}
function Ze(t) {
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
  if (ln(t, Uint8Array))
    return BigInt(`0x${bt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Hw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Of(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function To(t, e = 8) {
  return (typeof t == "bigint" ? t : Ze(t)).toString(16).padStart(e * 2, "0");
}
function rc(t) {
  return parseInt(t, 16);
}
function yu(t, e = 16) {
  const n = To(t, e);
  return Wt(n);
}
function Ow(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Dw(t, e) {
  return t & BigInt(1) << e;
}
function hl(t) {
  return Fw(BigInt(`0x${bt(t)}`), BigInt(t.byteLength * 8));
}
function Fw(t, e) {
  return Dw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const jw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += jw[n];
  return e;
}
function Wt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Hw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Qs(t) {
  return new TextEncoder().encode(t);
}
function Bo(t) {
  return new TextDecoder().decode(t);
}
function zw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Rw(t) {
  return String.fromCharCode.apply(null, t);
}
function Gw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Df(t) {
  if (t.some(Gw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function or(...t) {
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
function Ue(t) {
  return or(...t.map((e) => typeof e == "number" ? Df([e]) : e instanceof Array ? Df(e) : e));
}
function ln(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const y0 = "https://api.mainnet.hiro.so", w0 = "https://api.testnet.hiro.so", b0 = "http://localhost:3999", Kw = "https://hub.blockstack.org", Vw = 33, Uc = 32;
function qw(t) {
  if (t.length < Uc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Uc * 2), r = t.slice(2 + Uc * 2);
  return {
    recoveryId: rc(e),
    r: n,
    s: r
  };
}
function wu(t) {
  const e = typeof t == "string" ? Wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Ww(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Xw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Yw(t, e) {
  return t[e];
}
function Zw(t, e, n = 0) {
  return t[n] = e, t;
}
function Qw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ps(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Jw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function tb(t, e) {
  const n = {};
  return Object.assign(n, Jw, e), await fetch(t, n);
}
function eb(t) {
  let e = tb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function nb(...t) {
  const { fetchLib: e, middlewares: n } = eb(t);
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
class m0 {
  constructor(e = p0.slice(), n = ((a) => (a = gu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = Iw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function x0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pl(t.outputLen), pl(t.blockLen);
}
function ib(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ob(t, e) {
  x0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: pl,
  bool: rb,
  bytes: x0,
  hash: sb,
  exists: ib,
  output: ob
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qn = (t, e) => t << 32 - e | t >>> e, ab = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ab)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bu(t) {
  if (typeof t == "string" && (t = cb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let S0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Js(t) {
  const e = (r) => t().update(bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let E0 = class extends S0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Es.hash(e);
    const r = bu(n);
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
};
const sc = (t, e, n) => new E0(t, e).update(n).digest();
sc.create = (t, e) => new E0(t, e);
function lb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let mu = class extends S0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hc(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = bu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Hc(e);
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
    lb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Hc(e), c = this.outputLen;
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
const ub = (t, e, n) => t & e ^ ~t & n, fb = (t, e, n) => t & e ^ t & n ^ e & n, db = new Uint32Array([
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
]), Hr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Or = new Uint32Array(64);
let A0 = class extends mu {
  constructor() {
    super(64, 32, 8, !1), this.A = Hr[0] | 0, this.B = Hr[1] | 0, this.C = Hr[2] | 0, this.D = Hr[3] | 0, this.E = Hr[4] | 0, this.F = Hr[5] | 0, this.G = Hr[6] | 0, this.H = Hr[7] | 0;
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
      const y = Or[l - 15], p = Or[l - 2], $ = qn(y, 7) ^ qn(y, 18) ^ y >>> 3, S = qn(p, 17) ^ qn(p, 19) ^ p >>> 10;
      Or[l] = S + Or[l - 7] + $ + Or[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = qn(a, 6) ^ qn(a, 11) ^ qn(a, 25), p = d + y + ub(a, c, u) + db[l] + Or[l] | 0, S = (qn(r, 2) ^ qn(r, 13) ^ qn(r, 22)) + fb(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Or.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hb = class extends A0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ti = Js(() => new A0());
Js(() => new hb());
const pb = {}, v0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Kt = BigInt(0), ye = BigInt(1), ls = BigInt(2), uo = BigInt(3), Ff = BigInt(8), ne = Object.freeze({
  a: Kt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ye,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), jf = (t, e) => (t + e / ls) / e, zo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ne, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ye * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = jf(s * t, e), c = jf(-r * t, e);
    let u = it(t - a * n - c * i, e), d = it(-a * r - c * s, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, zn = 32, _s = 32, $0 = 32, Ca = zn + 1, Ta = 2 * zn + 1;
function zf(t) {
  const { a: e, b: n } = ne, r = it(t * t), i = it(r * t);
  return it(i + e * t + n);
}
const Ro = ne.a === Kt;
class xu extends Error {
  constructor(e) {
    super(e);
  }
}
function Rf(t) {
  if (!(t instanceof Zt))
    throw new TypeError("JacobianPoint expected");
}
class Zt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Dt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Dt.ZERO) ? Zt.ZERO : new Zt(e.x, e.y, ye);
  }
  static toAffineBatch(e) {
    const n = mb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Zt.toAffineBatch(e).map(Zt.fromAffine);
  }
  equals(e) {
    Rf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = it(i * i), u = it(a * a), d = it(n * u), l = it(s * c), y = it(it(r * a) * u), p = it(it(o * i) * c);
    return d === l && y === p;
  }
  negate() {
    return new Zt(this.x, it(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = it(e * e), s = it(n * n), o = it(s * s), a = e + s, c = it(ls * (it(a * a) - i - o)), u = it(uo * i), d = it(u * u), l = it(d - ls * c), y = it(u * (c - l) - Ff * o), p = it(ls * n * r);
    return new Zt(l, y, p);
  }
  add(e) {
    Rf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Kt || o === Kt)
      return this;
    if (n === Kt || r === Kt)
      return e;
    const c = it(i * i), u = it(a * a), d = it(n * u), l = it(s * c), y = it(it(r * a) * u), p = it(it(o * i) * c), $ = it(l - d), S = it(p - y);
    if ($ === Kt)
      return S === Kt ? this.double() : Zt.ZERO;
    const C = it($ * $), V = it($ * C), K = it(d * C), E = it(S * S - V - ls * K), M = it(S * (K - E) - y * V), T = it(i * a * $);
    return new Zt(E, M, T);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Zt.ZERO;
    if (typeof e == "bigint" && e === Kt)
      return n;
    let r = Vf(e);
    if (r === ye)
      return this;
    if (!Ro) {
      let l = n, y = this;
      for (; r > Kt; )
        r & ye && (l = l.add(y)), y = y.double(), r >>= ye;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = zo.splitScalar(r), c = n, u = n, d = this;
    for (; s > Kt || a > Kt; )
      s & ye && (c = c.add(d)), a & ye && (u = u.add(d)), d = d.double(), s >>= ye, a >>= ye;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Zt(it(u.x * zo.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ro ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Zt.BASE) && (n = Dt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && gl.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Zt.normalizeZ(i), gl.set(n, i)));
    let s = Zt.ZERO, o = Zt.BASE;
    const a = 1 + (Ro ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let $ = Number(e & u);
      e >>= l, $ > c && ($ -= d, e += ye);
      const S = p, C = p + Math.abs($) - 1, V = y % 2 !== 0, K = $ < 0;
      $ === 0 ? o = o.add(Go(V, i[S])) : s = s.add(Go(K, i[C]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = Vf(e), i, s;
    if (Ro) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = zo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      d = Go(o, d), y = Go(c, y), y = new Zt(it(y.x * zo.beta), y.y, y.z), i = d.add(y), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Zt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Zt.ZERO);
    e == null && (e = s ? Ff : qi(i));
    const o = e, a = it(o * o), c = it(a * o), u = it(n * a), d = it(r * c), l = it(i * o);
    if (s)
      return Dt.ZERO;
    if (l !== ye)
      throw new Error("invZ was invalid");
    return new Dt(u, d);
  }
}
Zt.BASE = new Zt(ne.Gx, ne.Gy, ye);
Zt.ZERO = new Zt(Kt, ye, Kt);
function Go(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const gl = /* @__PURE__ */ new WeakMap();
class Dt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, gl.delete(this);
  }
  hasEvenY() {
    return this.y % ls === Kt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = En(n ? e : e.subarray(1));
    if (!ma(r))
      throw new Error("Point is not on curve");
    const i = zf(r);
    let s = bb(i);
    const o = (s & ye) === ye;
    n ? o && (s = it(-s)) : (e[0] & 1) === 1 !== o && (s = it(-s));
    const a = new Dt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = En(e.subarray(1, zn + 1)), r = En(e.subarray(zn + 1, zn * 2 + 1)), i = new Dt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = ar(e), r = n.length, i = n[0];
    if (r === zn)
      return this.fromCompressedHex(n);
    if (r === Ca && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === Ta && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ca} compressed bytes or ${Ta} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Dt.BASE.multiply(Us(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = L0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Su(ar(e)), { n: a } = ne, c = r === 2 || r === 3 ? i + a : i, u = qi(c, a), d = it(-o * u, a), l = it(s * u, a), y = r & 1 ? "03" : "02", p = Dt.fromHex(y + us(c)), $ = Dt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!$)
      throw new Error("Cannot recover signature: point at infinify");
    return $.assertValidity(), $;
  }
  toRawBytes(e = !1) {
    return fs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = us(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${us(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ma(n) || !ma(r))
      throw new Error(e);
    const i = it(r * r), s = zf(n);
    if (it(i - s) !== Kt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Dt(this.x, it(-this.y));
  }
  double() {
    return Zt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Zt.fromAffine(this).add(Zt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Zt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const i = Zt.fromAffine(this), s = n === Kt || n === ye || this !== Dt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Zt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Zt.ZERO) ? void 0 : a.toAffine();
  }
}
Dt.BASE = new Dt(ne.Gx, ne.Gy);
Dt.ZERO = new Dt(Kt, Kt);
function Gf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Kf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Bi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: En(n), left: t.subarray(e + 2) };
}
function gb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Bi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Kf(t.subarray(2)), { data: r, left: i } = Kf(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Bi(i)}`);
  return { r: e, s: r };
}
class Sn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? Bi(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Sn(Ba(i.slice(0, 64)), Ba(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = gb(n ? e : fs(e));
    return new Sn(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ni(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ni(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ne.n >> ye;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Sn(this.r, it(-this.s, ne.n)) : this;
  }
  toDERRawBytes() {
    return fs(this.toDERHex());
  }
  toDERHex() {
    const e = Gf(ro(this.s)), n = Gf(ro(this.r)), r = e.length / 2, i = n.length / 2, s = ro(r), o = ro(i);
    return `30${ro(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return fs(this.toCompactHex());
  }
  toCompactHex() {
    return us(this.r) + us(this.s);
  }
}
function as(...t) {
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
const yb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += yb[t[n]];
  return e;
}
const wb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function us(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Kt <= t && t < wb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Mi(t) {
  const e = fs(us(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ro(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ba(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function fs(t) {
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
function En(t) {
  return Ba(Bi(t));
}
function ar(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : fs(t);
}
function Vf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ni(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function it(t, e = ne.P) {
  const n = t % e;
  return n >= Kt ? n : e + n;
}
function In(t, e) {
  const { P: n } = ne;
  let r = t;
  for (; e-- > Kt; )
    r *= r, r %= n;
  return r;
}
function bb(t) {
  const { P: e } = ne, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = In(u, uo) * u % e, l = In(d, uo) * u % e, y = In(l, ls) * c % e, p = In(y, r) * y % e, $ = In(p, i) * p % e, S = In($, o) * $ % e, C = In(S, a) * S % e, V = In(C, o) * $ % e, K = In(V, uo) * u % e, E = In(K, s) * p % e, M = In(E, n) * c % e, T = In(M, ls);
  if (T * T % e !== t)
    throw new Error("Cannot find square root");
  return T;
}
function qi(t, e = ne.P) {
  if (t === Kt || e <= Kt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = it(t, e), r = e, i = Kt, s = ye;
  for (; n !== Kt; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== ye)
    throw new Error("invert: does not exist");
  return it(i, e);
}
function mb(t, e = ne.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Kt ? s : (n[a] = s, it(s * o, e)), ye), i = qi(r, e);
  return t.reduceRight((s, o, a) => o === Kt ? s : (n[a] = it(s * n[a], e), it(s * o, e)), i), n;
}
function xb(t) {
  const e = t.length * 8 - _s * 8, n = En(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Su(t, e = !1) {
  const n = xb(t);
  if (e)
    return n;
  const { n: r } = ne;
  return n >= r ? n - r : n;
}
let ki, fo;
class k0 {
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
    return fo(this.k, ...e);
  }
  checkSync() {
    if (typeof fo != "function")
      throw new xu("hmacSha256Sync needs to be set");
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
    return as(...n);
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
    return as(...n);
  }
}
function Ni(t) {
  return Kt < t && t < ne.n;
}
function ma(t) {
  return Kt < t && t < ne.P;
}
function I0(t, e, n, r = !0) {
  const { n: i } = ne, s = Su(t, !0);
  if (!Ni(s))
    return;
  const o = qi(s, i), a = Dt.BASE.multiply(s), c = it(a.x, i);
  if (c === Kt)
    return;
  const u = it(o * it(e + n * c, i), i);
  if (u === Kt)
    return;
  let d = new Sn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & ye);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Us(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * _s)
      throw new Error("Expected 32 bytes of private key");
    e = Ba(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== _s)
      throw new Error("Expected 32 bytes of private key");
    e = En(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ni(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Eu(t) {
  return t instanceof Dt ? (t.assertValidity(), t) : Dt.fromHex(t);
}
function L0(t) {
  if (t instanceof Sn)
    return t.assertValidity(), t;
  try {
    return Sn.fromDER(t);
  } catch {
    return Sn.fromCompact(t);
  }
}
function Mo(t, e = !1) {
  return Dt.fromPrivateKey(t).toRawBytes(e);
}
function Sb(t, e, n, r = !1) {
  return Dt.fromSignature(t, e, n).toRawBytes(r);
}
function qf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ca || r === Ta : n ? r === Ca * 2 || r === Ta * 2 : t instanceof Dt;
}
function Au(t, e, n = !1) {
  if (qf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!qf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Eu(e);
  return r.assertValidity(), r.multiply(Us(t)).toRawBytes(n);
}
function C0(t) {
  const e = t.length > zn ? t.slice(0, zn) : t;
  return En(e);
}
function Eb(t) {
  const e = C0(t), n = it(e, ne.n);
  return T0(n < Kt ? e : n);
}
function T0(t) {
  return Mi(t);
}
function B0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = ar(t), i = Us(e), s = [T0(i), Eb(r)];
  if (n != null) {
    n === !0 && (n = Te.randomBytes(zn));
    const c = ar(n);
    if (c.length !== zn)
      throw new Error(`sign: Expected ${zn} bytes of extra data`);
    s.push(c);
  }
  const o = as(...s), a = C0(r);
  return { seed: o, m: a, d: i };
}
function M0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function Ab(t, e, n = {}) {
  const { seed: r, m: i, d: s } = B0(t, e, n.extraEntropy), o = new k0($0, _s);
  await o.reseed(r);
  let a;
  for (; !(a = I0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return M0(a, n);
}
function ic(t, e, n = {}) {
  const { seed: r, m: i, d: s } = B0(t, e, n.extraEntropy), o = new k0($0, _s);
  o.reseedSync(r);
  let a;
  for (; !(a = I0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return M0(a, n);
}
const vb = { strict: !0 };
function $b(t, e, n, r = vb) {
  let i;
  try {
    i = L0(t), e = ar(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = Su(e);
  let c;
  try {
    c = Eu(n);
  } catch {
    return !1;
  }
  const { n: u } = ne, d = qi(o, u), l = it(a * d, u), y = it(s * d, u), p = Dt.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? it(p.x, u) === s : !1;
}
function Ma(t) {
  return it(En(t), ne.n);
}
class Pi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = ar(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = En(n.subarray(0, 32)), i = En(n.subarray(32, 64));
    return new Pi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ma(e) || !Ni(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return us(this.r) + us(this.s);
  }
  toRawBytes() {
    return fs(this.toHex());
  }
}
function kb(t) {
  return Dt.fromPrivateKey(t).toRawX();
}
class N0 {
  constructor(e, n, r = Te.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = ar(e);
    const { x: i, scalar: s } = this.getScalar(Us(n));
    if (this.px = i, this.d = s, this.rand = ar(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Dt.fromPrivateKey(e), r = n.hasEvenY() ? e : ne.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Mi(e ^ En(n));
  }
  finalizeNonce(e) {
    const n = it(En(e), ne.n);
    if (n === Kt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new Pi(e.x, it(n + r * i, ne.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = Te.taggedHash, o = this.initNonce(n, await s(os.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(os.nonce, o, r, e)), d = Ma(await s(os.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await U0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = Te.taggedHashSync, o = this.initNonce(n, s(os.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(os.nonce, o, r, e)), d = Ma(s(os.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return H0(l, e, r) || this.error(), l;
  }
}
async function Ib(t, e, n) {
  return new N0(t, e, n).calc();
}
function Lb(t, e, n) {
  return new N0(t, e, n).calcSync();
}
function P0(t, e, n) {
  const r = t instanceof Pi, i = r ? t : Pi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: ar(e),
    P: Eu(n)
  };
}
function _0(t, e, n, r) {
  const i = Dt.BASE.multiplyAndAddUnsafe(e, Us(n), it(-r, ne.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function U0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = P0(t, e, n), a = Ma(await Te.taggedHash(os.challenge, Mi(r), o.toRawX(), s));
    return _0(r, o, i, a);
  } catch {
    return !1;
  }
}
function H0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = P0(t, e, n), a = Ma(Te.taggedHashSync(os.challenge, Mi(r), o.toRawX(), s));
    return _0(r, o, i, a);
  } catch (r) {
    if (r instanceof xu)
      throw r;
    return !1;
  }
}
const Cb = {
  Signature: Pi,
  getPublicKey: kb,
  sign: Ib,
  verify: U0,
  signSync: Lb,
  verifySync: H0
};
Dt.BASE._setWindowSize(8);
const pn = {
  node: v0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, os = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ko = {}, Te = {
  bytesToHex: Bi,
  hexToBytes: fs,
  concatBytes: as,
  mod: it,
  invert: qi,
  isValidPrivateKey(t) {
    try {
      return Us(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Mi,
  _normalizePrivateKey: Us,
  hashToPrivateKey: (t) => {
    t = ar(t);
    const e = _s + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = it(En(t), ne.n - ye) + ye;
    return Mi(n);
  },
  randomBytes: (t = 32) => {
    if (pn.web)
      return pn.web.getRandomValues(new Uint8Array(t));
    if (pn.node) {
      const { randomBytes: e } = pn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Te.hashToPrivateKey(Te.randomBytes(_s + 8)),
  precompute(t = 8, e = Dt.BASE) {
    const n = e === Dt.BASE ? e : new Dt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(uo), n;
  },
  sha256: async (...t) => {
    if (pn.web) {
      const e = await pn.web.subtle.digest("SHA-256", as(...t));
      return new Uint8Array(e);
    } else if (pn.node) {
      const { createHash: e } = pn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (pn.web) {
      const n = await pn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = as(...e), i = await pn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (pn.node) {
      const { createHmac: n } = pn.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ko[t];
    if (n === void 0) {
      const r = await Te.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = as(r, r), Ko[t] = n;
    }
    return Te.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ki != "function")
      throw new xu("sha256Sync is undefined, you need to set it");
    let n = Ko[t];
    if (n === void 0) {
      const r = ki(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = as(r, r), Ko[t] = n;
    }
    return ki(n, ...e);
  },
  _JacobianPoint: Zt
};
Object.defineProperties(Te, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ki;
    },
    set(t) {
      ki || (ki = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return fo;
    },
    set(t) {
      fo || (fo = t);
    }
  }
});
const Tb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ne,
  Point: Dt,
  Signature: Sn,
  getPublicKey: Mo,
  getSharedSecret: Au,
  recoverPublicKey: Sb,
  schnorr: Cb,
  sign: Ab,
  signSync: ic,
  utils: Te,
  verify: $b
}, Symbol.toStringTag, { value: "Module" }));
var No = {};
No.byteLength = _b;
var Bb = No.toByteArray = Hb, Mb = No.fromByteArray = Fb, Jn = [], Cn = [], Nb = typeof Uint8Array < "u" ? Uint8Array : Array, Oc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var gi = 0, Pb = Oc.length; gi < Pb; ++gi)
  Jn[gi] = Oc[gi], Cn[Oc.charCodeAt(gi)] = gi;
Cn[45] = 62;
Cn[95] = 63;
function O0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function _b(t) {
  var e = O0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ub(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Hb(t) {
  var e, n = O0(t), r = n[0], i = n[1], s = new Nb(Ub(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Cn[t.charCodeAt(c)] << 18 | Cn[t.charCodeAt(c + 1)] << 12 | Cn[t.charCodeAt(c + 2)] << 6 | Cn[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = Cn[t.charCodeAt(c)] << 2 | Cn[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = Cn[t.charCodeAt(c)] << 10 | Cn[t.charCodeAt(c + 1)] << 4 | Cn[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Ob(t) {
  return Jn[t >> 18 & 63] + Jn[t >> 12 & 63] + Jn[t >> 6 & 63] + Jn[t & 63];
}
function Db(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Ob(r));
  return i.join("");
}
function Fb(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(Db(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    Jn[e >> 2] + Jn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    Jn[e >> 10] + Jn[e >> 4 & 63] + Jn[e << 2 & 63] + "="
  )), i.join("");
}
function jb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const zb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Rb() {
  if (jb())
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
    throw new Error(zb);
  }
}
class Gb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(or(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(or(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class Kb {
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
async function D0() {
  const t = await Rb();
  return t.name === "subtleCrypto" ? new Kb(t.lib) : new Gb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Vb(t) {
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
    for (var $ = 0, S = 0, C = 0, V = p.length; C !== V && p[C] === 0; )
      C++, $++;
    for (var K = (V - C) * u + 1 >>> 0, E = new Uint8Array(K); C !== V; ) {
      for (var M = p[C], T = 0, et = K - 1; (M !== 0 || T < S) && et !== -1; et--, T++)
        M += 256 * E[et] >>> 0, E[et] = M % o >>> 0, M = M / o >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      S = T, C++;
    }
    for (var W = K - S; W !== K && E[W] === 0; )
      W++;
    for (var R = a.repeat($); W < K; ++W)
      R += t.charAt(E[W]);
    return R;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var $ = 0, S = 0, C = 0; p[$] === a; )
      S++, $++;
    for (var V = (p.length - $) * c + 1 >>> 0, K = new Uint8Array(V); p[$]; ) {
      var E = p.charCodeAt($);
      if (E > 255)
        return;
      var M = e[E];
      if (M === 255)
        return;
      for (var T = 0, et = V - 1; (M !== 0 || T < C) && et !== -1; et--, T++)
        M += o * K[et] >>> 0, K[et] = M % 256 >>> 0, M = M / 256 >>> 0;
      if (M !== 0)
        throw new Error("Non-zero carry");
      C = T, $++;
    }
    for (var W = V - C; W !== V && K[W] === 0; )
      W++;
    for (var R = new Uint8Array(S + (V - W)), q = S; W !== V; )
      R[q++] = K[W++];
    return R;
  }
  function y(p) {
    var $ = l(p);
    if ($)
      return $;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var F0 = Vb;
const qb = F0, Wb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Xb = qb(Wb);
const Yb = /* @__PURE__ */ u0(Xb), Zb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), j0 = Uint8Array.from({ length: 16 }, (t, e) => e), Qb = j0.map((t) => (9 * t + 5) % 16);
let vu = [j0], $u = [Qb];
for (let t = 0; t < 4; t++)
  for (let e of [vu, $u])
    e.push(e[t].map((n) => Zb[n]));
const z0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Jb = vu.map((t, e) => t.map((n) => z0[e][n])), tm = $u.map((t, e) => t.map((n) => z0[e][n])), em = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vo = (t, e) => t << e | t >>> 32 - e;
function Wf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qo = new Uint32Array(16);
let rm = class extends mu {
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
      qo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const $ = 4 - p, S = em[p], C = nm[p], V = vu[p], K = $u[p], E = Jb[p], M = tm[p];
      for (let T = 0; T < 16; T++) {
        const et = Vo(r + Wf(p, s, a, u) + qo[V[T]] + S, E[T]) + l | 0;
        r = l, l = u, u = Vo(a, 10) | 0, a = s, s = et;
      }
      for (let T = 0; T < 16; T++) {
        const et = Vo(i + Wf($, o, c, d) + qo[K[T]] + C, M[T]) + y | 0;
        i = y, y = d, d = Vo(c, 10) | 0, c = o, o = et;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const sm = Js(() => new rm());
function im(t) {
  return sm(t);
}
const Wo = BigInt(2 ** 32 - 1), yl = BigInt(32);
function R0(t, e = !1) {
  return e ? { h: Number(t & Wo), l: Number(t >> yl & Wo) } : { h: Number(t >> yl & Wo) | 0, l: Number(t & Wo) | 0 };
}
function om(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = R0(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const am = (t, e) => BigInt(t >>> 0) << yl | BigInt(e >>> 0), cm = (t, e, n) => t >>> n, lm = (t, e, n) => t << 32 - n | e >>> n, um = (t, e, n) => t >>> n | e << 32 - n, fm = (t, e, n) => t << 32 - n | e >>> n, dm = (t, e, n) => t << 64 - n | e >>> n - 32, hm = (t, e, n) => t >>> n - 32 | e << 64 - n, pm = (t, e) => e, gm = (t, e) => t, ym = (t, e, n) => t << n | e >>> 32 - n, wm = (t, e, n) => e << n | t >>> 32 - n, bm = (t, e, n) => e << n - 32 | t >>> 64 - n, mm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function xm(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Sm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Em = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Am = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), vm = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, $m = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), km = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: R0,
  split: om,
  toBig: am,
  shrSH: cm,
  shrSL: lm,
  rotrSH: um,
  rotrSL: fm,
  rotrBH: dm,
  rotrBL: hm,
  rotr32H: pm,
  rotr32L: gm,
  rotlSH: ym,
  rotlSL: wm,
  rotlBH: bm,
  rotlBL: mm,
  add: xm,
  add3L: Sm,
  add3H: Em,
  add4L: Am,
  add4H: vm,
  add5H: km,
  add5L: $m
}, [Im, Lm] = Bt.split([
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
].map((t) => BigInt(t))), Dr = new Uint32Array(80), Fr = new Uint32Array(80);
let oc = class extends mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: $, Hh: S, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = $ | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Dr[E] = e.getUint32(n), Fr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = Dr[E - 15] | 0, T = Fr[E - 15] | 0, et = Bt.rotrSH(M, T, 1) ^ Bt.rotrSH(M, T, 8) ^ Bt.shrSH(M, T, 7), W = Bt.rotrSL(M, T, 1) ^ Bt.rotrSL(M, T, 8) ^ Bt.shrSL(M, T, 7), R = Dr[E - 2] | 0, q = Fr[E - 2] | 0, v = Bt.rotrSH(R, q, 19) ^ Bt.rotrBH(R, q, 61) ^ Bt.shrSH(R, q, 6), B = Bt.rotrSL(R, q, 19) ^ Bt.rotrBL(R, q, 61) ^ Bt.shrSL(R, q, 6), m = Bt.add4L(W, B, Fr[E - 7], Fr[E - 16]), P = Bt.add4H(m, et, v, Dr[E - 7], Dr[E - 16]);
      Dr[E] = P | 0, Fr[E] = m | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: $, Gh: S, Gl: C, Hh: V, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const M = Bt.rotrSH(l, y, 14) ^ Bt.rotrSH(l, y, 18) ^ Bt.rotrBH(l, y, 41), T = Bt.rotrSL(l, y, 14) ^ Bt.rotrSL(l, y, 18) ^ Bt.rotrBL(l, y, 41), et = l & p ^ ~l & S, W = y & $ ^ ~y & C, R = Bt.add5L(K, T, W, Lm[E], Fr[E]), q = Bt.add5H(R, V, M, et, Im[E], Dr[E]), v = R | 0, B = Bt.rotrSH(r, i, 28) ^ Bt.rotrBH(r, i, 34) ^ Bt.rotrBH(r, i, 39), m = Bt.rotrSL(r, i, 28) ^ Bt.rotrBL(r, i, 34) ^ Bt.rotrBL(r, i, 39), P = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      V = S | 0, K = C | 0, S = p | 0, C = $ | 0, p = l | 0, $ = y | 0, { h: l, l: y } = Bt.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const X = Bt.add3L(v, m, nt);
      r = Bt.add3H(X, q, B, P), i = X | 0;
    }
    ({ h: r, l: i } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: $ } = Bt.add(this.Fh | 0, this.Fl | 0, p | 0, $ | 0), { h: S, l: C } = Bt.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: V, l: K } = Bt.add(this.Hh | 0, this.Hl | 0, V | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, $, S, C, V, K);
  }
  roundClean() {
    Dr.fill(0), Fr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Cm = class extends oc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Tm = class extends oc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Bm = class extends oc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Mm = Js(() => new oc());
Js(() => new Cm());
Js(() => new Tm());
Js(() => new Bm());
function G0(t) {
  return Ti(t);
}
function Nm(t) {
  return Mm(t);
}
const Pm = 0;
Te.hmacSha256Sync = (t, ...e) => {
  const n = sc.create(Ti, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function _m() {
  return bt(Te.randomPrivateKey());
}
function Um(t) {
  const e = Ti(Ti(t));
  return Yb.encode(or(t, e).slice(0, t.length + 4));
}
function Hm(t, e) {
  return Um(or(new Uint8Array([t]), e.slice(0, 20)));
}
function K0(t, e = Pm) {
  const n = typeof t == "string" ? Wt(t) : t, r = im(G0(n));
  return Hm(e, r);
}
function V0(t) {
  const e = wu(t);
  return bt(Mo(e.slice(0, 32), !0));
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = sc.create(Ti, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Na;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Na || (Na = {}));
async function Om(t, e, n) {
  return await (await D0()).encrypt("aes-256-cbc", e, t, n);
}
async function Dm(t, e, n) {
  return await (await D0()).decrypt("aes-256-cbc", e, t, n);
}
function q0(t, e) {
  return sc(Ti, t, e);
}
function Fm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function W0(t) {
  const e = Nm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function jm(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function zm(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Na.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Na.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !jm(t))
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
async function Rm(t, e, n, r) {
  const i = zm(t);
  if (!i.result)
    throw i;
  const s = Te.randomPrivateKey(), o = Mo(s, !0);
  let a = Au(s, t, !0);
  a = a.slice(1);
  const c = W0(a), u = Te.randomBytes(16), d = await Om(u, c.encryptionKey, e), l = or(u, o, d), y = q0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = bt(d);
  else if (r === "base64")
    p = Mb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const $ = {
    iv: bt(u),
    ephemeralPK: bt(o),
    cipherText: p,
    mac: bt(y),
    wasString: n
  };
  return r && r !== "hex" && ($.cipherTextEncoding = r), $;
}
async function X0(t, e) {
  if (!e.ephemeralPK)
    throw new Uf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Au(t, n, !0);
  r = r.slice(1);
  const i = W0(r), s = Wt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Wt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Bb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = or(s, Wt(n), o), c = q0(i.hmacKey, a), u = Wt(e.mac);
  if (!Fm(u, c))
    throw new Uf("Decryption failed: failure in MAC check");
  const d = await Dm(s, i.encryptionKey, o);
  return e.wasString ? Bo(d) : d;
}
function Gm(t, e) {
  const n = typeof e == "string" ? Qs(e) : e, r = V0(t), i = G0(n), s = ic(i, t);
  return {
    signature: bt(s),
    publicKey: r
  };
}
async function Km(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = V0(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? Qs(t) : t, o = await Rm(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Gm(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Vm(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return X0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var We = {}, _i = {}, Je = {};
Object.defineProperty(Je, "__esModule", { value: !0 });
Je.decode = Je.encode = Je.unescape = Je.escape = Je.pad = void 0;
const Y0 = No;
function ku(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Je.pad = ku;
function Z0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Je.escape = Z0;
function Q0(t) {
  return ku(t).replace(/-/g, "+").replace(/_/g, "/");
}
Je.unescape = Q0;
function qm(t) {
  return Z0((0, Y0.fromByteArray)(new TextEncoder().encode(t)));
}
Je.encode = qm;
function Wm(t) {
  return new TextDecoder().decode((0, Y0.toByteArray)(ku(Q0(t))));
}
Je.decode = Wm;
var ac = {}, cc = {}, J0 = {}, tp = {}, lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.crypto = void 0;
lc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = $, t.byteSwap32 = S, t.bytesToHex = K, t.hexToBytes = T, t.asyncLoop = W, t.utf8ToBytes = R, t.bytesToUtf8 = q, t.toBytes = v, t.kdfInputToBytes = B, t.concatBytes = m, t.checkOpts = P, t.createHasher = X, t.createOptHasher = Vt, t.createXOFer = yt, t.randomBytes = Be;
  const e = lc;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function i(I, ...U) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (U.length > 0 && !U.includes(I.length))
      throw new Error("Uint8Array expected of length " + U + ", got length=" + I.length);
  }
  function s(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function o(I, U = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (U && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, U) {
    i(I);
    const dt = U.outputLen;
    if (I.length < dt)
      throw new Error("digestInto() expects output buffer of length at least " + dt);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function d(...I) {
    for (let U = 0; U < I.length; U++)
      I[U].fill(0);
  }
  function l(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function y(I, U) {
    return I << 32 - U | I >>> U;
  }
  function p(I, U) {
    return I << U | I >>> 32 - U >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function $(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (I) => I : (I) => $(I), t.byteSwapIfBE = t.swap8IfBE;
  function S(I) {
    for (let U = 0; U < I.length; U++)
      I[U] = $(I[U]);
    return I;
  }
  t.swap32IfBE = t.isLE ? (I) => I : S;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", V = /* @__PURE__ */ Array.from({ length: 256 }, (I, U) => U.toString(16).padStart(2, "0"));
  function K(I) {
    if (i(I), C)
      return I.toHex();
    let U = "";
    for (let dt = 0; dt < I.length; dt++)
      U += V[I[dt]];
    return U;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function M(I) {
    if (I >= E._0 && I <= E._9)
      return I - E._0;
    if (I >= E.A && I <= E.F)
      return I - (E.A - 10);
    if (I >= E.a && I <= E.f)
      return I - (E.a - 10);
  }
  function T(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (C)
      return Uint8Array.fromHex(I);
    const U = I.length, dt = U / 2;
    if (U % 2)
      throw new Error("hex string expected, got unpadded hex of length " + U);
    const x = new Uint8Array(dt);
    for (let N = 0, tt = 0; N < dt; N++, tt += 2) {
      const H = M(I.charCodeAt(tt)), at = M(I.charCodeAt(tt + 1));
      if (H === void 0 || at === void 0) {
        const st = I[tt] + I[tt + 1];
        throw new Error('hex string expected, got non-hex character "' + st + '" at index ' + tt);
      }
      x[N] = H * 16 + at;
    }
    return x;
  }
  const et = async () => {
  };
  t.nextTick = et;
  async function W(I, U, dt) {
    let x = Date.now();
    for (let N = 0; N < I; N++) {
      dt(N);
      const tt = Date.now() - x;
      tt >= 0 && tt < U || (await (0, t.nextTick)(), x += tt);
    }
  }
  function R(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function q(I) {
    return new TextDecoder().decode(I);
  }
  function v(I) {
    return typeof I == "string" && (I = R(I)), i(I), I;
  }
  function B(I) {
    return typeof I == "string" && (I = R(I)), i(I), I;
  }
  function m(...I) {
    let U = 0;
    for (let x = 0; x < I.length; x++) {
      const N = I[x];
      i(N), U += N.length;
    }
    const dt = new Uint8Array(U);
    for (let x = 0, N = 0; x < I.length; x++) {
      const tt = I[x];
      dt.set(tt, N), N += tt.length;
    }
    return dt;
  }
  function P(I, U) {
    if (U !== void 0 && {}.toString.call(U) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, U);
  }
  class nt {
  }
  t.Hash = nt;
  function X(I) {
    const U = (x) => I().update(v(x)).digest(), dt = I();
    return U.outputLen = dt.outputLen, U.blockLen = dt.blockLen, U.create = () => I(), U;
  }
  function Vt(I) {
    const U = (x, N) => I(N).update(v(x)).digest(), dt = I({});
    return U.outputLen = dt.outputLen, U.blockLen = dt.blockLen, U.create = (x) => I(x), U;
  }
  function yt(I) {
    const U = (x, N) => I(N).update(v(x)).digest(), dt = I({});
    return U.outputLen = dt.outputLen, U.blockLen = dt.blockLen, U.create = (x) => I(x), U;
  }
  t.wrapConstructor = X, t.wrapConstructorWithOpts = Vt, t.wrapXOFConstructorWithOpts = yt;
  function Be(I = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(I));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(tp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = tp;
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
})(J0);
const yi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ep(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ti(t, ...e) {
  if (!ep(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Xm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  wl(t.outputLen), wl(t.blockLen);
}
function bl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function np(t, e) {
  ti(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Ym(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Zm(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Pa(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function xa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Hn(t, e) {
  return t << 32 - e | t >>> e;
}
function Qm(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Iu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Lu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const rp = Iu ? (t) => t : (t) => Lu(t), Jm = rp;
function sp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Lu(t[e]);
  return t;
}
const t1 = Iu ? (t) => t : sp, ip = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", e1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function op(t) {
  if (ti(t), ip)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += e1[t[n]];
  return e;
}
const br = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Xf(t) {
  if (t >= br._0 && t <= br._9)
    return t - br._0;
  if (t >= br.A && t <= br.F)
    return t - (br.A - 10);
  if (t >= br.a && t <= br.f)
    return t - (br.a - 10);
}
function n1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (ip)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = Xf(t.charCodeAt(s)), a = Xf(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const ap = async () => {
};
async function r1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await ap(), r += s);
  }
}
function Cu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function s1(t) {
  return new TextDecoder().decode(t);
}
function Po(t) {
  return typeof t == "string" && (t = Cu(t)), ti(t), t;
}
function i1(t) {
  return typeof t == "string" && (t = Cu(t)), ti(t), t;
}
function o1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    ti(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function a1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let cp = class {
};
function uc(t) {
  const e = (r) => t().update(Po(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function lp(t) {
  const e = (r, i) => t(i).update(Po(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function up(t) {
  const e = (r, i) => t(i).update(Po(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const c1 = uc, l1 = lp, u1 = up;
function f1(t = 32) {
  if (yi && typeof yi.getRandomValues == "function")
    return yi.getRandomValues(new Uint8Array(t));
  if (yi && typeof yi.randomBytes == "function")
    return Uint8Array.from(yi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const d1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: cp,
  abytes: ti,
  aexists: bl,
  ahash: Xm,
  anumber: wl,
  aoutput: np,
  asyncLoop: r1,
  byteSwap: Lu,
  byteSwap32: sp,
  byteSwapIfBE: Jm,
  bytesToHex: op,
  bytesToUtf8: s1,
  checkOpts: a1,
  clean: Pa,
  concatBytes: o1,
  createHasher: uc,
  createOptHasher: lp,
  createView: xa,
  createXOFer: up,
  hexToBytes: n1,
  isBytes: ep,
  isLE: Iu,
  kdfInputToBytes: i1,
  nextTick: ap,
  randomBytes: f1,
  rotl: Qm,
  rotr: Hn,
  swap32IfBE: t1,
  swap8IfBE: rp,
  toBytes: Po,
  u32: Zm,
  u8: Ym,
  utf8ToBytes: Cu,
  wrapConstructor: c1,
  wrapConstructorWithOpts: l1,
  wrapXOFConstructorWithOpts: u1
}, Symbol.toStringTag, { value: "Module" }));
function h1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function p1(t, e, n) {
  return t & e ^ ~t & n;
}
function g1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class y1 extends cp {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = xa(this.buffer);
  }
  update(e) {
    bl(this), e = Po(e), ti(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = xa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bl(this), np(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, Pa(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    h1(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = xa(e), c = this.outputLen;
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
const jr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), w1 = /* @__PURE__ */ Uint32Array.from([
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
]), Rr = /* @__PURE__ */ new Uint32Array(64);
let Tu = class extends y1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = jr[0] | 0, this.B = jr[1] | 0, this.C = jr[2] | 0, this.D = jr[3] | 0, this.E = jr[4] | 0, this.F = jr[5] | 0, this.G = jr[6] | 0, this.H = jr[7] | 0;
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
      const y = Rr[l - 15], p = Rr[l - 2], $ = Hn(y, 7) ^ Hn(y, 18) ^ y >>> 3, S = Hn(p, 17) ^ Hn(p, 19) ^ p >>> 10;
      Rr[l] = S + Rr[l - 7] + $ + Rr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Hn(a, 6) ^ Hn(a, 11) ^ Hn(a, 25), p = d + y + p1(a, c, u) + w1[l] + Rr[l] | 0, S = (Hn(r, 2) ^ Hn(r, 13) ^ Hn(r, 22)) + g1(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Pa(Rr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Pa(this.buffer);
  }
}, fp = class extends Tu {
  constructor() {
    super(28), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
  }
};
const b1 = /* @__PURE__ */ uc(() => new Tu()), m1 = /* @__PURE__ */ uc(() => new fp()), x1 = Tu, dp = b1, S1 = fp, E1 = m1, A1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: S1,
  SHA256: x1,
  sha224: E1,
  sha256: dp
}, Symbol.toStringTag, { value: "Module" })), fc = /* @__PURE__ */ nc(A1), v1 = /* @__PURE__ */ nc(Tb);
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.joseToDer = Ui.derToJose = void 0;
const hp = No, pp = Je;
function Dc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const $1 = {
  ES256: Dc(256),
  ES384: Dc(384),
  ES512: Dc(521)
};
function gp(t) {
  const e = $1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const _a = 128, yp = 0, k1 = 32, I1 = 16, L1 = 2, wp = I1 | k1 | yp << 6, Ua = L1 | yp << 6;
function bp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, hp.toByteArray)((0, pp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function C1(t, e) {
  const n = bp(t), r = gp(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== wp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (_a | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Ua)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ua)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (s - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${s - o}"`);
  if (i < d)
    throw new Error(`"s" specified length of "${d}", max of "${i}" is acceptable`);
  const l = o;
  if (o += d, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const y = r - c, p = r - d, $ = new Uint8Array(y + c + p + d);
  for (o = 0; o < y; ++o)
    $[o] = 0;
  $.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const S = o; o < S + p; ++o)
    $[o] = 0;
  return $.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, pp.escape)((0, hp.fromByteArray)($));
}
Ui.derToJose = C1;
function Yf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= _a && --r, r;
}
function T1(t, e) {
  t = bp(t);
  const n = gp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = Yf(t, 0, n), s = Yf(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < _a, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = wp, u ? d[l++] = c : (d[l++] = _a | 1, d[l++] = c & 255), d[l++] = Ua, d[l++] = o, i < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(i, n), l), l += n - i), d[l++] = Ua, d[l++] = a, s < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + s), l), d;
}
Ui.joseToDer = T1;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.InvalidTokenError = kr.MissingParametersError = void 0;
class B1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
kr.MissingParametersError = B1;
class M1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
kr.InvalidTokenError = M1;
const _o = /* @__PURE__ */ nc(d1);
Object.defineProperty(cc, "__esModule", { value: !0 });
cc.SECP256K1Client = void 0;
const N1 = J0, P1 = fc, Sa = v1, Zf = Ui, Qf = kr, Jf = _o;
Sa.utils.hmacSha256Sync = (t, ...e) => {
  const n = N1.hmac.create(P1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class mp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Jf.bytesToHex)(Sa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Qf.MissingParametersError("a signing input hash and private key are all required");
    const i = Sa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Jf.bytesToHex)(i);
    if (r === "jose")
      return (0, Zf.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Zf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Qf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Sa.verify(n, e, r, { strict: !1 });
  }
}
cc.SECP256K1Client = mp;
mp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = cc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ac);
var Hs = {};
const _1 = /* @__PURE__ */ nc(v0);
var U1 = en && en.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.hashSha256Async = Hs.hashSha256 = void 0;
const H1 = fc;
function xp(t) {
  return (0, H1.sha256)(t);
}
Hs.hashSha256 = xp;
function O1(t) {
  return U1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = _1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(xp(t));
    }
  });
}
Hs.hashSha256Async = O1;
var D1 = en && en.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.TokenSigner = _i.createUnsecuredToken = void 0;
const ml = Je, td = ac, F1 = kr, ed = Hs;
function xl(t, e) {
  const n = [], r = ml.encode(JSON.stringify(e));
  n.push(r);
  const i = ml.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function j1(t) {
  return xl(t, { typ: "JWT", alg: "none" }) + ".";
}
_i.createUnsecuredToken = j1;
class z1 {
  constructor(e, n) {
    if (!(e && n))
      throw new F1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !td.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = td.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = xl(e, i), o = (0, ed.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return D1(this, void 0, void 0, function* () {
      const i = this.header(r), s = xl(e, i), o = yield (0, ed.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [ml.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
_i.TokenSigner = z1;
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
dc.TokenVerifier = void 0;
const R1 = Je, nd = ac, G1 = kr, Xo = Hs;
class K1 {
  constructor(e, n) {
    if (!(e && n))
      throw new G1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !nd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = nd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Xo.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Xo.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), R1.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Xo.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Xo.hashSha256)(r);
      return s(o);
    }
  }
}
dc.TokenVerifier = K1;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.decodeToken = void 0;
const Yo = Je;
function V1(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Yo.decode(e[0])), r = JSON.parse(Yo.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Yo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(Yo.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
hc.decodeToken = V1;
(function(t) {
  var e = en && en.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = en && en.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(_i, t), n(dc, t), n(hc, t), n(kr, t), n(ac, t);
})(We);
function q1(t) {
  return `did:btc-addr:${t}`;
}
function W1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new _f("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new _f('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Sp(t) {
  if (t)
    return W1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const X1 = "1.4.0";
function Y1() {
  return _m();
}
function Z1(t, e, n, r = p0.slice(), i, s = Mw().getTime(), o = {}) {
  const a = (p) => {
    const $ = gu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return $ == null ? void 0 : $.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Pw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: X1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = We.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = K0(u);
  return c.iss = q1(d), new We.TokenSigner("ES256k", t).sign(c);
}
async function rd(t, e) {
  const n = Bo(Wt(e)), r = JSON.parse(n), i = await X0(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function Q1(t) {
  const e = We.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new We.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function J1(t) {
  const e = We.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Sp(e.iss);
  if (n.length === 1) {
    if (K0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function t2(t) {
  const e = We.decodeToken(t).payload;
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
function e2(t) {
  const e = We.decodeToken(t).payload;
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
function n2(t) {
  const e = [
    e2(t),
    t2(t),
    Q1(t),
    J1(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const sd = "1.0.0";
class ds {
  constructor(e) {
    this.version = sd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== sd)
      throw new fl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ds(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ep {
  constructor(e) {
    if (e) {
      const n = new ds(e);
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
class id extends Ep {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ds({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new g0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ds({})), !0;
  }
}
class od extends Ep {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Cw, !localStorage.getItem(this.key)) {
      const r = new ds({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new g0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ds.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ds({})), !0;
  }
}
var bo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(bo || (bo = {}));
var Ha;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ha || (Ha = {}));
bo.Mainnet;
var vr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(vr || (vr = {}));
var nr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(nr || (nr = {}));
vr.Mainnet;
const Ap = {
  chainId: bo.Mainnet,
  transactionVersion: vr.Mainnet,
  peerNetworkId: Ha.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: nr.MainnetSingleSig,
    multiSig: nr.MainnetMultiSig
  },
  client: { baseUrl: y0 }
}, Sl = {
  chainId: bo.Testnet,
  transactionVersion: vr.Testnet,
  peerNetworkId: Ha.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: nr.TestnetSingleSig,
    multiSig: nr.TestnetMultiSig
  },
  client: { baseUrl: w0 }
}, Ea = {
  ...Sl,
  addressVersion: { ...Sl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: b0 }
}, r2 = {
  ...Ea,
  addressVersion: { ...Ea.addressVersion },
  client: { ...Ea.client }
};
function s2(t) {
  switch (t) {
    case "mainnet":
      return Ap;
    case "testnet":
      return Sl;
    case "devnet":
      return Ea;
    case "mocknet":
      return r2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function vp(t) {
  return typeof t == "string" ? s2(t) : t;
}
var ad;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(cd || (cd = {}));
var On;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(On || (On = {}));
const Fc = ["onChainOnly", "offChainOnly", "any"];
Fc[0] + "", On.OnChainOnly, Fc[1] + "", On.OffChainOnly, Fc[2] + "", On.Any, On.OnChainOnly + "", On.OnChainOnly, On.OffChainOnly + "", On.OffChainOnly, On.Any + "", On.Any;
var ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(fd || (fd = {}));
var Ar;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ar || (Ar = {}));
var dd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(bd || (bd = {}));
var md;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(md || (md = {}));
var xd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(xd || (xd = {}));
function El(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function i2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $p(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function o2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  El(t.outputLen), El(t.blockLen);
}
function a2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function c2(t, e) {
  $p(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const As = {
  number: El,
  bool: i2,
  bytes: $p,
  hash: o2,
  exists: a2,
  output: c2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Wn = (t, e) => t << 32 - e | t >>> e, l2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!l2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function u2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bu(t) {
  if (typeof t == "string" && (t = u2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let kp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ei(t) {
  const e = (r) => t().update(Bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ip = class extends kp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, As.hash(e);
    const r = Bu(n);
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
    return As.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    As.exists(this), As.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Lp = (t, e, n) => new Ip(t, e).update(n).digest();
Lp.create = (t, e) => new Ip(t, e);
function f2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Mu = class extends kp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jc(this.buffer);
  }
  update(e) {
    As.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Bu(e);
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
    As.exists(this), As.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    f2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
const d2 = (t, e, n) => t & e ^ ~t & n, h2 = (t, e, n) => t & e ^ t & n ^ e & n, p2 = new Uint32Array([
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
let Cp = class extends Mu {
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
      const y = Kr[l - 15], p = Kr[l - 2], $ = Wn(y, 7) ^ Wn(y, 18) ^ y >>> 3, S = Wn(p, 17) ^ Wn(p, 19) ^ p >>> 10;
      Kr[l] = S + Kr[l - 7] + $ + Kr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Wn(a, 6) ^ Wn(a, 11) ^ Wn(a, 25), p = d + y + d2(a, c, u) + p2[l] + Kr[l] | 0, S = (Wn(r, 2) ^ Wn(r, 13) ^ Wn(r, 22)) + h2(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, g2 = class extends Cp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Tp = ei(() => new Cp());
ei(() => new g2());
var ni = {}, Nu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = _o;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const $ = n.indexOf(o[p]) >> u;
        let S = 0;
        p !== 0 && (S = n.indexOf(o[p - 1]));
        const C = 1 + u, V = S % (1 << C) << 5 - C, K = t.c32[$ + V];
        u = C, c.unshift(K);
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
      for (let $ = 0; $ < p; $++)
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
    for (let S = o.length - 1; S >= 0; S--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const V = (t.c32.indexOf(o[S]) << y) + l, K = n[V % 16];
      if (y += 1, l = V >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(K);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let S = 0; S < d.length && d[S] === "0"; S++)
      p++;
    d = d.slice(p - p % 2);
    let $ = d.join("");
    for (let S = 0; S < u; S++)
      $ = `00${$}`;
    if (a) {
      const S = a * 2 - $.length;
      for (let C = 0; C < S; C += 2)
        $ = `00${$}`;
    }
    return $;
  }
  t.c32decode = s;
})(Nu);
var Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.c32checkDecode = Os.c32checkEncode = void 0;
const Sd = fc, Ed = _o, ho = Nu;
function Bp(t) {
  const e = (0, Sd.sha256)((0, Sd.sha256)((0, Ed.hexToBytes)(t)));
  return (0, Ed.bytesToHex)(e.slice(0, 4));
}
function y2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Bp(`${n}${e}`), i = (0, ho.c32encode)(`${e}${r}`);
  return `${ho.c32[t]}${i}`;
}
Os.c32checkEncode = y2;
function w2(t) {
  t = (0, ho.c32normalize)(t);
  const e = (0, ho.c32decode)(t.slice(1)), n = t[0], r = ho.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Bp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Os.c32checkDecode = w2;
var Mp = {}, Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.decode = Hi.encode = void 0;
const Oa = fc, Ad = _o, Np = F0, Pp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b2(t, e = "00") {
  const n = typeof t == "string" ? (0, Ad.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ad.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Oa.sha256)((0, Oa.sha256)(new Uint8Array([...r, ...n])));
  return Np(Pp).encode([...r, ...n, ...i.slice(0, 4)]);
}
Hi.encode = b2;
function m2(t) {
  const e = Np(Pp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Oa.sha256)((0, Oa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Hi.decode = m2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Os, n = Hi, r = _o;
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
    const y = n.decode(d), p = (0, r.bytesToHex)(y.data), $ = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let S;
    return l < 0 ? (S = $, i[$] !== void 0 && (S = i[$])) : S = l, o(S, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), p = y[0], $ = y[1];
    let S;
    l < 0 ? (S = p, s[p] !== void 0 && (S = s[p])) : S = l;
    let C = S.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode($, C);
  }
  t.c32ToB58 = u;
})(Mp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Nu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Os;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Mp;
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
})(ni);
function x2(t, e) {
  switch (e = vp(e ?? Ap), t) {
    case Ar.P2PKH:
      switch (e.transactionVersion) {
        case vr.Mainnet:
          return nr.MainnetSingleSig;
        case vr.Testnet:
          return nr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ar.P2SH:
    case Ar.P2SHNonSequential:
    case Ar.P2WPKH:
    case Ar.P2WSH:
    case Ar.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case vr.Mainnet:
          return nr.MainnetMultiSig;
        case vr.Testnet:
          return nr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const S2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _p = Uint8Array.from({ length: 16 }, (t, e) => e), E2 = _p.map((t) => (9 * t + 5) % 16);
let Pu = [_p], _u = [E2];
for (let t = 0; t < 4; t++)
  for (let e of [Pu, _u])
    e.push(e[t].map((n) => S2[n]));
const Up = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), A2 = Pu.map((t, e) => t.map((n) => Up[e][n])), v2 = _u.map((t, e) => t.map((n) => Up[e][n])), $2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), k2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zo = (t, e) => t << e | t >>> 32 - e;
function vd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qo = new Uint32Array(16);
let I2 = class extends Mu {
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
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const $ = 4 - p, S = $2[p], C = k2[p], V = Pu[p], K = _u[p], E = A2[p], M = v2[p];
      for (let T = 0; T < 16; T++) {
        const et = Zo(r + vd(p, s, a, u) + Qo[V[T]] + S, E[T]) + l | 0;
        r = l, l = u, u = Zo(a, 10) | 0, a = s, s = et;
      }
      for (let T = 0; T < 16; T++) {
        const et = Zo(i + vd($, o, c, d) + Qo[K[T]] + C, M[T]) + y | 0;
        i = y, y = d, d = Zo(c, 10) | 0, c = o, o = et;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const L2 = ei(() => new I2()), Jo = BigInt(2 ** 32 - 1), Al = BigInt(32);
function Hp(t, e = !1) {
  return e ? { h: Number(t & Jo), l: Number(t >> Al & Jo) } : { h: Number(t >> Al & Jo) | 0, l: Number(t & Jo) | 0 };
}
function C2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Hp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const T2 = (t, e) => BigInt(t >>> 0) << Al | BigInt(e >>> 0), B2 = (t, e, n) => t >>> n, M2 = (t, e, n) => t << 32 - n | e >>> n, N2 = (t, e, n) => t >>> n | e << 32 - n, P2 = (t, e, n) => t << 32 - n | e >>> n, _2 = (t, e, n) => t << 64 - n | e >>> n - 32, U2 = (t, e, n) => t >>> n - 32 | e << 64 - n, H2 = (t, e) => e, O2 = (t, e) => t, D2 = (t, e, n) => t << n | e >>> 32 - n, F2 = (t, e, n) => e << n | t >>> 32 - n, j2 = (t, e, n) => e << n - 32 | t >>> 64 - n, z2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function R2(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const G2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), K2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, V2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), q2 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, W2 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), X2 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: Hp,
  split: C2,
  toBig: T2,
  shrSH: B2,
  shrSL: M2,
  rotrSH: N2,
  rotrSL: P2,
  rotrBH: _2,
  rotrBL: U2,
  rotr32H: H2,
  rotr32L: O2,
  rotlSH: D2,
  rotlSL: F2,
  rotlBH: j2,
  rotlBL: z2,
  add: R2,
  add3L: G2,
  add3H: K2,
  add4L: V2,
  add4H: q2,
  add5H: X2,
  add5L: W2
}, [Y2, Z2] = Mt.split([
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
let pc = class extends Mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: $, Hh: S, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = $ | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Vr[E] = e.getUint32(n), qr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = Vr[E - 15] | 0, T = qr[E - 15] | 0, et = Mt.rotrSH(M, T, 1) ^ Mt.rotrSH(M, T, 8) ^ Mt.shrSH(M, T, 7), W = Mt.rotrSL(M, T, 1) ^ Mt.rotrSL(M, T, 8) ^ Mt.shrSL(M, T, 7), R = Vr[E - 2] | 0, q = qr[E - 2] | 0, v = Mt.rotrSH(R, q, 19) ^ Mt.rotrBH(R, q, 61) ^ Mt.shrSH(R, q, 6), B = Mt.rotrSL(R, q, 19) ^ Mt.rotrBL(R, q, 61) ^ Mt.shrSL(R, q, 6), m = Mt.add4L(W, B, qr[E - 7], qr[E - 16]), P = Mt.add4H(m, et, v, Vr[E - 7], Vr[E - 16]);
      Vr[E] = P | 0, qr[E] = m | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: $, Gh: S, Gl: C, Hh: V, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const M = Mt.rotrSH(l, y, 14) ^ Mt.rotrSH(l, y, 18) ^ Mt.rotrBH(l, y, 41), T = Mt.rotrSL(l, y, 14) ^ Mt.rotrSL(l, y, 18) ^ Mt.rotrBL(l, y, 41), et = l & p ^ ~l & S, W = y & $ ^ ~y & C, R = Mt.add5L(K, T, W, Z2[E], qr[E]), q = Mt.add5H(R, V, M, et, Y2[E], Vr[E]), v = R | 0, B = Mt.rotrSH(r, i, 28) ^ Mt.rotrBH(r, i, 34) ^ Mt.rotrBH(r, i, 39), m = Mt.rotrSL(r, i, 28) ^ Mt.rotrBL(r, i, 34) ^ Mt.rotrBL(r, i, 39), P = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      V = S | 0, K = C | 0, S = p | 0, C = $ | 0, p = l | 0, $ = y | 0, { h: l, l: y } = Mt.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const X = Mt.add3L(v, m, nt);
      r = Mt.add3H(X, q, B, P), i = X | 0;
    }
    ({ h: r, l: i } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Mt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: $ } = Mt.add(this.Fh | 0, this.Fl | 0, p | 0, $ | 0), { h: S, l: C } = Mt.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: V, l: K } = Mt.add(this.Hh | 0, this.Hl | 0, V | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, $, S, C, V, K);
  }
  roundClean() {
    Vr.fill(0), qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Q2 = class extends pc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, J2 = class extends pc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, tx = class extends pc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ei(() => new pc());
ei(() => new Q2());
ei(() => new J2());
ei(() => new tx());
var Da = { exports: {} };
Da.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", $ = "[object Object]", S = "[object Promise]", C = "[object RegExp]", V = "[object Set]", K = "[object String]", E = "[object Symbol]", M = "[object WeakMap]", T = "[object ArrayBuffer]", et = "[object DataView]", W = "[object Float32Array]", R = "[object Float64Array]", q = "[object Int8Array]", v = "[object Int16Array]", B = "[object Int32Array]", m = "[object Uint8Array]", P = "[object Uint8ClampedArray]", nt = "[object Uint16Array]", X = "[object Uint32Array]", Vt = /[\\^$.*+?()[\]{}|]/g, yt = /\w*$/, Be = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, U = {};
  U[s] = U[o] = U[T] = U[et] = U[a] = U[c] = U[W] = U[R] = U[q] = U[v] = U[B] = U[y] = U[p] = U[$] = U[C] = U[V] = U[K] = U[E] = U[m] = U[P] = U[nt] = U[X] = !0, U[u] = U[d] = U[M] = !1;
  var dt = typeof en == "object" && en && en.Object === Object && en, x = typeof self == "object" && self && self.Object === Object && self, N = dt || x || Function("return this")(), tt = e && !e.nodeType && e, H = tt && !0 && t && !t.nodeType && t, at = H && H.exports === tt;
  function st(g, L) {
    return g.set(L[0], L[1]), g;
  }
  function St(g, L) {
    return g.add(L), g;
  }
  function Ut(g, L) {
    for (var O = -1, ft = g ? g.length : 0; ++O < ft && L(g[O], O, g) !== !1; )
      ;
    return g;
  }
  function Ct(g, L) {
    for (var O = -1, ft = L.length, Ke = g.length; ++O < ft; )
      g[Ke + O] = L[O];
    return g;
  }
  function Yt(g, L, O, ft) {
    for (var Ke = -1, rn = g ? g.length : 0; ++Ke < rn; )
      O = L(O, g[Ke], Ke, g);
    return O;
  }
  function jt(g, L) {
    for (var O = -1, ft = Array(g); ++O < g; )
      ft[O] = L(O);
    return ft;
  }
  function $t(g, L) {
    return g == null ? void 0 : g[L];
  }
  function ie(g) {
    var L = !1;
    if (g != null && typeof g.toString != "function")
      try {
        L = !!(g + "");
      } catch {
      }
    return L;
  }
  function be(g) {
    var L = -1, O = Array(g.size);
    return g.forEach(function(ft, Ke) {
      O[++L] = [Ke, ft];
    }), O;
  }
  function ee(g, L) {
    return function(O) {
      return g(L(O));
    };
  }
  function ue(g) {
    var L = -1, O = Array(g.size);
    return g.forEach(function(ft) {
      O[++L] = ft;
    }), O;
  }
  var kt = Array.prototype, ae = Function.prototype, ce = Object.prototype, me = N["__core-js_shared__"], qt = function() {
    var g = /[^.]+$/.exec(me && me.keys && me.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), ut = ae.toString, Me = ce.hasOwnProperty, Ne = ce.toString, un = RegExp(
    "^" + ut.call(Me).replace(Vt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Nn = at ? N.Buffer : void 0, A = N.Symbol, D = N.Uint8Array, F = ee(Object.getPrototypeOf, Object), G = Object.create, pt = ce.propertyIsEnumerable, At = kt.splice, le = Object.getOwnPropertySymbols, It = Nn ? Nn.isBuffer : void 0, fe = ee(Object.keys, Object), Ae = z(N, "DataView"), ve = z(N, "Map"), xe = z(N, "Promise"), zt = z(N, "Set"), h = z(N, "WeakMap"), b = z(Object, "create"), f = Pe(Ae), _ = Pe(ve), Q = Pe(xe), ct = Pe(zt), mt = Pe(h), Rt = A ? A.prototype : void 0, Oe = Rt ? Rt.valueOf : void 0;
  function Qt(g) {
    var L = -1, O = g ? g.length : 0;
    for (this.clear(); ++L < O; ) {
      var ft = g[L];
      this.set(ft[0], ft[1]);
    }
  }
  function Ht() {
    this.__data__ = b ? b(null) : {};
  }
  function $e(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function fn(g) {
    var L = this.__data__;
    if (b) {
      var O = L[g];
      return O === r ? void 0 : O;
    }
    return Me.call(L, g) ? L[g] : void 0;
  }
  function Pn(g) {
    var L = this.__data__;
    return b ? L[g] !== void 0 : Me.call(L, g);
  }
  function De(g, L) {
    var O = this.__data__;
    return O[g] = b && L === void 0 ? r : L, this;
  }
  Qt.prototype.clear = Ht, Qt.prototype.delete = $e, Qt.prototype.get = fn, Qt.prototype.has = Pn, Qt.prototype.set = De;
  function de(g) {
    var L = -1, O = g ? g.length : 0;
    for (this.clear(); ++L < O; ) {
      var ft = g[L];
      this.set(ft[0], ft[1]);
    }
  }
  function vn() {
    this.__data__ = [];
  }
  function wt(g) {
    var L = this.__data__, O = hr(L, g);
    if (O < 0)
      return !1;
    var ft = L.length - 1;
    return O == ft ? L.pop() : At.call(L, O, 1), !0;
  }
  function Xt(g) {
    var L = this.__data__, O = hr(L, g);
    return O < 0 ? void 0 : L[O][1];
  }
  function he(g) {
    return hr(this.__data__, g) > -1;
  }
  function $n(g, L) {
    var O = this.__data__, ft = hr(O, g);
    return ft < 0 ? O.push([g, L]) : O[ft][1] = L, this;
  }
  de.prototype.clear = vn, de.prototype.delete = wt, de.prototype.get = Xt, de.prototype.has = he, de.prototype.set = $n;
  function _n(g) {
    var L = -1, O = g ? g.length : 0;
    for (this.clear(); ++L < O; ) {
      var ft = g[L];
      this.set(ft[0], ft[1]);
    }
  }
  function Ji() {
    this.__data__ = {
      hash: new Qt(),
      map: new (ve || de)(),
      string: new Qt()
    };
  }
  function ci(g) {
    return k(this, g).delete(g);
  }
  function Cr(g) {
    return k(this, g).get(g);
  }
  function kn(g) {
    return k(this, g).has(g);
  }
  function li(g, L) {
    return k(this, g).set(g, L), this;
  }
  _n.prototype.clear = Ji, _n.prototype.delete = ci, _n.prototype.get = Cr, _n.prototype.has = kn, _n.prototype.set = li;
  function dn(g) {
    this.__data__ = new de(g);
  }
  function Tr() {
    this.__data__ = new de();
  }
  function Kn(g) {
    return this.__data__.delete(g);
  }
  function Un(g) {
    return this.__data__.get(g);
  }
  function fr(g) {
    return this.__data__.has(g);
  }
  function Br(g, L) {
    var O = this.__data__;
    if (O instanceof de) {
      var ft = O.__data__;
      if (!ve || ft.length < n - 1)
        return ft.push([g, L]), this;
      O = this.__data__ = new _n(ft);
    }
    return O.set(g, L), this;
  }
  dn.prototype.clear = Tr, dn.prototype.delete = Kn, dn.prototype.get = Un, dn.prototype.has = fr, dn.prototype.set = Br;
  function ws(g, L) {
    var O = Bc(g) || Xy(g) ? jt(g.length, String) : [], ft = O.length, Ke = !!ft;
    for (var rn in g)
      Me.call(g, rn) && !(Ke && (rn == "length" || Lt(rn, ft))) && O.push(rn);
    return O;
  }
  function dr(g, L, O) {
    var ft = g[L];
    (!(Me.call(g, L) && to(ft, O)) || O === void 0 && !(L in g)) && (g[L] = O);
  }
  function hr(g, L) {
    for (var O = g.length; O--; )
      if (to(g[O][0], L))
        return O;
    return -1;
  }
  function Mr(g, L) {
    return g && pe(L, Mc(L), g);
  }
  function pr(g, L, O, ft, Ke, rn, wr) {
    var sn;
    if (ft && (sn = rn ? ft(g, Ke, rn, wr) : ft(g)), sn !== void 0)
      return sn;
    if (!Do(g))
      return g;
    var Lf = Bc(g);
    if (Lf) {
      if (sn = j(g), !L)
        return lt(g, sn);
    } else {
      var pi = gt(g), Cf = pi == d || pi == l;
      if (Zy(g))
        return di(g, L);
      if (pi == $ || pi == s || Cf && !rn) {
        if (ie(g))
          return rn ? g : {};
        if (sn = Et(Cf ? {} : g), !L)
          return Fe(g, Mr(sn, g));
      } else {
        if (!U[pi])
          return rn ? g : {};
        sn = vt(g, pi, pr, L);
      }
    }
    wr || (wr = new dn());
    var Tf = wr.get(g);
    if (Tf)
      return Tf;
    if (wr.set(g, sn), !Lf)
      var Bf = O ? w(g) : Mc(g);
    return Ut(Bf || g, function(Nc, Fo) {
      Bf && (Fo = Nc, Nc = g[Fo]), dr(sn, Fo, pr(Nc, L, O, ft, Fo, g, wr));
    }), sn;
  }
  function Nr(g) {
    return Do(g) ? G(g) : {};
  }
  function ui(g, L, O) {
    var ft = L(g);
    return Bc(g) ? ft : Ct(ft, O(g));
  }
  function fi(g) {
    return Ne.call(g);
  }
  function bs(g) {
    if (!Do(g) || Ge(g))
      return !1;
    var L = If(g) || ie(g) ? un : Be;
    return L.test(Pe(g));
  }
  function ke(g) {
    if (!hn(g))
      return fe(g);
    var L = [];
    for (var O in Object(g))
      Me.call(g, O) && O != "constructor" && L.push(O);
    return L;
  }
  function di(g, L) {
    if (L)
      return g.slice();
    var O = new g.constructor(g.length);
    return g.copy(O), O;
  }
  function Pr(g) {
    var L = new g.constructor(g.byteLength);
    return new D(L).set(new D(g)), L;
  }
  function gr(g, L) {
    var O = L ? Pr(g.buffer) : g.buffer;
    return new g.constructor(O, g.byteOffset, g.byteLength);
  }
  function _r(g, L, O) {
    var ft = L ? O(be(g), !0) : be(g);
    return Yt(ft, st, new g.constructor());
  }
  function yr(g) {
    var L = new g.constructor(g.source, yt.exec(g));
    return L.lastIndex = g.lastIndex, L;
  }
  function hi(g, L, O) {
    var ft = L ? O(ue(g), !0) : ue(g);
    return Yt(ft, St, new g.constructor());
  }
  function Ur(g) {
    return Oe ? Object(Oe.call(g)) : {};
  }
  function Y(g, L) {
    var O = L ? Pr(g.buffer) : g.buffer;
    return new g.constructor(O, g.byteOffset, g.length);
  }
  function lt(g, L) {
    var O = -1, ft = g.length;
    for (L || (L = Array(ft)); ++O < ft; )
      L[O] = g[O];
    return L;
  }
  function pe(g, L, O, ft) {
    O || (O = {});
    for (var Ke = -1, rn = L.length; ++Ke < rn; ) {
      var wr = L[Ke], sn = void 0;
      dr(O, wr, sn === void 0 ? g[wr] : sn);
    }
    return O;
  }
  function Fe(g, L) {
    return pe(g, rt(g), L);
  }
  function w(g) {
    return ui(g, Mc, rt);
  }
  function k(g, L) {
    var O = g.__data__;
    return Jt(L) ? O[typeof L == "string" ? "string" : "hash"] : O.map;
  }
  function z(g, L) {
    var O = $t(g, L);
    return bs(O) ? O : void 0;
  }
  var rt = le ? ee(le, Object) : tw, gt = fi;
  (Ae && gt(new Ae(new ArrayBuffer(1))) != et || ve && gt(new ve()) != y || xe && gt(xe.resolve()) != S || zt && gt(new zt()) != V || h && gt(new h()) != M) && (gt = function(g) {
    var L = Ne.call(g), O = L == $ ? g.constructor : void 0, ft = O ? Pe(O) : void 0;
    if (ft)
      switch (ft) {
        case f:
          return et;
        case _:
          return y;
        case Q:
          return S;
        case ct:
          return V;
        case mt:
          return M;
      }
    return L;
  });
  function j(g) {
    var L = g.length, O = g.constructor(L);
    return L && typeof g[0] == "string" && Me.call(g, "index") && (O.index = g.index, O.input = g.input), O;
  }
  function Et(g) {
    return typeof g.constructor == "function" && !hn(g) ? Nr(F(g)) : {};
  }
  function vt(g, L, O, ft) {
    var Ke = g.constructor;
    switch (L) {
      case T:
        return Pr(g);
      case a:
      case c:
        return new Ke(+g);
      case et:
        return gr(g, ft);
      case W:
      case R:
      case q:
      case v:
      case B:
      case m:
      case P:
      case nt:
      case X:
        return Y(g, ft);
      case y:
        return _r(g, ft, O);
      case p:
      case K:
        return new Ke(g);
      case C:
        return yr(g);
      case V:
        return hi(g, ft, O);
      case E:
        return Ur(g);
    }
  }
  function Lt(g, L) {
    return L = L ?? i, !!L && (typeof g == "number" || I.test(g)) && g > -1 && g % 1 == 0 && g < L;
  }
  function Jt(g) {
    var L = typeof g;
    return L == "string" || L == "number" || L == "symbol" || L == "boolean" ? g !== "__proto__" : g === null;
  }
  function Ge(g) {
    return !!qt && qt in g;
  }
  function hn(g) {
    var L = g && g.constructor, O = typeof L == "function" && L.prototype || ce;
    return g === O;
  }
  function Pe(g) {
    if (g != null) {
      try {
        return ut.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Vn(g) {
    return pr(g, !0, !0);
  }
  function to(g, L) {
    return g === L || g !== g && L !== L;
  }
  function Xy(g) {
    return Yy(g) && Me.call(g, "callee") && (!pt.call(g, "callee") || Ne.call(g) == s);
  }
  var Bc = Array.isArray;
  function kf(g) {
    return g != null && Qy(g.length) && !If(g);
  }
  function Yy(g) {
    return Jy(g) && kf(g);
  }
  var Zy = It || ew;
  function If(g) {
    var L = Do(g) ? Ne.call(g) : "";
    return L == d || L == l;
  }
  function Qy(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= i;
  }
  function Do(g) {
    var L = typeof g;
    return !!g && (L == "object" || L == "function");
  }
  function Jy(g) {
    return !!g && typeof g == "object";
  }
  function Mc(g) {
    return kf(g) ? ws(g) : ke(g);
  }
  function tw() {
    return [];
  }
  function ew() {
    return !1;
  }
  t.exports = Vn;
})(Da, Da.exports);
var ex = Da.exports;
const Op = /* @__PURE__ */ u0(ex);
var vl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(vl || (vl = {}));
function nx(t, e) {
  return { type: vl.Address, version: t, hash160: e };
}
function rx(t) {
  return ni.c32address(t.version, t.hash160);
}
const sx = (t) => L2(Tp(t)), ix = (t) => bt(sx(t));
Te.hmacSha256Sync = (t, ...e) => {
  const n = Lp.create(Tp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ox(t, e = "mainnet") {
  e = vp(e), t = typeof t == "string" ? Wt(t) : t;
  const n = x2(Ar.P2PKH, e), r = nx(n, ix(t));
  return rx(r);
}
function ax(t, e) {
  const n = We.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = ox(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new We.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function cx(t, e = null) {
  let n;
  e ? n = ax(t, e) : n = We.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const $d = "_blockstackDidCheckEchoReply", lx = "echoReply", ux = "authContinuation";
function fx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function dx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[$d];
  if (typeof e == "boolean")
    return e;
  const n = fx(t.location.search), r = n[lx];
  if (r) {
    t[$d] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[ux];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class $l {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new m0();
    else
      throw new Bw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new od(e.sessionOptions) : this.store = new od() : e ? this.store = new id(e.sessionOptions) : this.store = new id();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Nw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new fl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, Z1(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Y1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (dx())
        return Si.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Si.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = nb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new jo("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = We.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await n2(e))
      throw new jo("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (_c(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await rd(i, s.private_key);
          } catch {
            if (Si.warn("Failed decryption of appPrivateKey, will try to use as given"), !Te.isValidPrivateKey(s.private_key))
              throw new jo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await rd(i, c);
          } catch {
            Si.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new jo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Kw, d;
    _c(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), _c(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (d = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: Sp(s.iss),
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
        l.profile = Object.assign({}, Lw);
      else {
        const $ = await p.text(), S = JSON.parse($);
        l.profile = cx(S[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new fl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Km(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Vm(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
$l.prototype.makeAuthRequest = $l.prototype.makeAuthRequestToken;
const hx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], px = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = hx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!gc(r.id));
  return e.concat(n);
}, gc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Dp = "STX_PROVIDER", Ds = () => typeof window > "u" ? null : window.localStorage.getItem(Dp), gx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Dp, t);
}, yx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function wx(t, e) {
  const n = {};
  return Object.assign(n, yx, e), await fetch(t, n);
}
function bx(t) {
  let e = wx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function mx(...t) {
  const { fetchLib: e, middlewares: n } = bx(t);
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
var Fs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fs || (Fs = {}));
var kd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(kd || (kd = {}));
const xx = "https://api.mainnet.hiro.so", Sx = "https://api.testnet.hiro.so", Ex = "http://localhost:3999", Ax = ["mainnet", "testnet", "devnet", "mocknet"];
class js {
  constructor(e) {
    this.version = Fs.Mainnet, this.chainId = Oi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Fs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? mx();
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
js.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new kl();
    case "testnet":
      return new Il();
    case "devnet":
      return new vx();
    case "mocknet":
      return new Fp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ax.join(", ")}`);
  }
};
js.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : js.fromName(t);
class kl extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? xx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Mainnet, this.chainId = Oi.Mainnet;
  }
}
class Il extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Oi.Testnet;
  }
}
class Fp extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Oi.Testnet;
  }
}
const vx = Fp;
var zs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(zs || (zs = {}));
var Fa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Fa || (Fa = {}));
zs.Mainnet;
var Rs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rs || (Rs = {}));
var Gs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Gs || (Gs = {}));
Rs.Mainnet;
const $x = {
  chainId: zs.Mainnet,
  transactionVersion: Rs.Mainnet,
  peerNetworkId: Fa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Gs.MainnetSingleSig,
    multiSig: Gs.MainnetMultiSig
  },
  client: { baseUrl: y0 }
}, Ll = {
  chainId: zs.Testnet,
  transactionVersion: Rs.Testnet,
  peerNetworkId: Fa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Gs.TestnetSingleSig,
    multiSig: Gs.TestnetMultiSig
  },
  client: { baseUrl: w0 }
}, Aa = {
  ...Ll,
  addressVersion: { ...Ll.addressVersion },
  magicBytes: "id",
  client: { baseUrl: b0 }
}, kx = {
  ...Aa,
  addressVersion: { ...Aa.addressVersion },
  client: { ...Aa.client }
};
function Ix(t) {
  switch (t) {
    case "mainnet":
      return $x;
    case "testnet":
      return Ll;
    case "devnet":
      return Aa;
    case "mocknet":
      return kx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Lx(t) {
  return typeof t == "string" ? Ix(t) : t;
}
function Cx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Id = /* @__PURE__ */ new Map();
function jp(t, e) {
  const n = Id.get(t);
  if (n !== void 0)
    return n(e);
  const r = Cx(t);
  return Id.set(t, r), jp(t, e);
}
let oe = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Wt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Qw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Yw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Ww(this.readBytes(2), 0);
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
    if (jp(e, r))
      return r;
    throw n(r);
  }
};
const Tx = 128, Bx = 128, zp = 16, Ts = 32, Cl = 80, yc = 65, Mx = 32, Nx = 64, ja = 34, Px = 1 + 16 * 1024 * 1024, _x = 165, Ux = 16, Hx = 16, Ox = 20, Dx = Hx + 2 + Ox, Fx = Dx + 4, jx = Px + (_x + Ux * Fx);
var te;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(te || (te = {}));
var Tl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Tl || (Tl = {}));
var yn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yn || (yn = {}));
const zc = ["onChainOnly", "offChainOnly", "any"];
zc[0] + "", yn.OnChainOnly, zc[1] + "", yn.OffChainOnly, zc[2] + "", yn.Any, yn.OnChainOnly + "", yn.OnChainOnly, yn.OffChainOnly + "", yn.OffChainOnly, yn.Any + "", yn.Any;
var za;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(za || (za = {}));
var ge;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ge || (ge = {}));
var Le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Le || (Le = {}));
var re;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(re || (re = {}));
var Se;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Se || (Se = {}));
var po;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(po || (po = {}));
var Bl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Bl || (Bl = {}));
var Ml;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ml || (Ml = {}));
var tn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(tn || (tn = {}));
var Ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ld || (Ld = {}));
var Nl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Nl || (Nl = {}));
var Fn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Fn || (Fn = {}));
var Cd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Cd || (Cd = {}));
let wc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ei = class extends wc {
  constructor(e) {
    super(e);
  }
}, Qe = class extends wc {
  constructor(e) {
    super(e);
  }
}, Ra = class extends wc {
  constructor(e) {
    super(e);
  }
}, vs = class extends wc {
  constructor(e) {
    super(e);
  }
};
function Pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function zx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Rx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Pl(t.outputLen), Pl(t.blockLen);
}
function Gx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Kx(t, e) {
  Rp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: Pl,
  bool: zx,
  bytes: Rp,
  hash: Rx,
  exists: Gx,
  output: Kx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Rc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, Vx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Vx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function qx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Uu(t) {
  if (typeof t == "string" && (t = qx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Gp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ri(t) {
  const e = (r) => t().update(Uu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Kp = class extends Gp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $s.hash(e);
    const r = Uu(n);
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
const Vp = (t, e, n) => new Kp(t, e).update(n).digest();
Vp.create = (t, e) => new Kp(t, e);
function Wx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Hu = class extends Gp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Rc(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Uu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Rc(e);
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
    Wx(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Rc(e), c = this.outputLen;
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
const Xx = (t, e, n) => t & e ^ ~t & n, Yx = (t, e, n) => t & e ^ t & n ^ e & n, Zx = new Uint32Array([
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
]), Wr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xr = new Uint32Array(64);
let qp = class extends Hu {
  constructor() {
    super(64, 32, 8, !1), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
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
      const y = Xr[l - 15], p = Xr[l - 2], $ = Xn(y, 7) ^ Xn(y, 18) ^ y >>> 3, S = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      Xr[l] = S + Xr[l - 7] + $ + Xr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = d + y + Xx(a, c, u) + Zx[l] + Xr[l] | 0, S = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + Yx(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Qx = class extends qp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ou = ri(() => new qp());
ri(() => new Qx());
const Jx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Wp = Uint8Array.from({ length: 16 }, (t, e) => e), tS = Wp.map((t) => (9 * t + 5) % 16);
let Du = [Wp], Fu = [tS];
for (let t = 0; t < 4; t++)
  for (let e of [Du, Fu])
    e.push(e[t].map((n) => Jx[n]));
const Xp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), eS = Du.map((t, e) => t.map((n) => Xp[e][n])), nS = Fu.map((t, e) => t.map((n) => Xp[e][n])), rS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), sS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ta = (t, e) => t << e | t >>> 32 - e;
function Td(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ea = new Uint32Array(16);
let iS = class extends Hu {
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
      const $ = 4 - p, S = rS[p], C = sS[p], V = Du[p], K = Fu[p], E = eS[p], M = nS[p];
      for (let T = 0; T < 16; T++) {
        const et = ta(r + Td(p, s, a, u) + ea[V[T]] + S, E[T]) + l | 0;
        r = l, l = u, u = ta(a, 10) | 0, a = s, s = et;
      }
      for (let T = 0; T < 16; T++) {
        const et = ta(i + Td($, o, c, d) + ea[K[T]] + C, M[T]) + y | 0;
        i = y, y = d, d = ta(c, 10) | 0, c = o, o = et;
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
const oS = ri(() => new iS()), na = BigInt(2 ** 32 - 1), _l = BigInt(32);
function Yp(t, e = !1) {
  return e ? { h: Number(t & na), l: Number(t >> _l & na) } : { h: Number(t >> _l & na) | 0, l: Number(t & na) | 0 };
}
function aS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Yp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const cS = (t, e) => BigInt(t >>> 0) << _l | BigInt(e >>> 0), lS = (t, e, n) => t >>> n, uS = (t, e, n) => t << 32 - n | e >>> n, fS = (t, e, n) => t >>> n | e << 32 - n, dS = (t, e, n) => t << 32 - n | e >>> n, hS = (t, e, n) => t << 64 - n | e >>> n - 32, pS = (t, e, n) => t >>> n - 32 | e << 64 - n, gS = (t, e) => e, yS = (t, e) => t, wS = (t, e, n) => t << n | e >>> 32 - n, bS = (t, e, n) => e << n | t >>> 32 - n, mS = (t, e, n) => e << n - 32 | t >>> 64 - n, xS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function SS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const ES = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), AS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $S = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, kS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), IS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: Yp,
  split: aS,
  toBig: cS,
  shrSH: lS,
  shrSL: uS,
  rotrSH: fS,
  rotrSL: dS,
  rotrBH: hS,
  rotrBL: pS,
  rotr32H: gS,
  rotr32L: yS,
  rotlSH: wS,
  rotlSL: bS,
  rotlBH: mS,
  rotlBL: xS,
  add: SS,
  add3L: ES,
  add3H: AS,
  add4L: vS,
  add4H: $S,
  add5H: IS,
  add5L: kS
}, [LS, CS] = Nt.split([
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
].map((t) => BigInt(t))), Yr = new Uint32Array(80), Zr = new Uint32Array(80);
let bc = class extends Hu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: $, Hh: S, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = $ | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Yr[E] = e.getUint32(n), Zr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = Yr[E - 15] | 0, T = Zr[E - 15] | 0, et = Nt.rotrSH(M, T, 1) ^ Nt.rotrSH(M, T, 8) ^ Nt.shrSH(M, T, 7), W = Nt.rotrSL(M, T, 1) ^ Nt.rotrSL(M, T, 8) ^ Nt.shrSL(M, T, 7), R = Yr[E - 2] | 0, q = Zr[E - 2] | 0, v = Nt.rotrSH(R, q, 19) ^ Nt.rotrBH(R, q, 61) ^ Nt.shrSH(R, q, 6), B = Nt.rotrSL(R, q, 19) ^ Nt.rotrBL(R, q, 61) ^ Nt.shrSL(R, q, 6), m = Nt.add4L(W, B, Zr[E - 7], Zr[E - 16]), P = Nt.add4H(m, et, v, Yr[E - 7], Yr[E - 16]);
      Yr[E] = P | 0, Zr[E] = m | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: $, Gh: S, Gl: C, Hh: V, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const M = Nt.rotrSH(l, y, 14) ^ Nt.rotrSH(l, y, 18) ^ Nt.rotrBH(l, y, 41), T = Nt.rotrSL(l, y, 14) ^ Nt.rotrSL(l, y, 18) ^ Nt.rotrBL(l, y, 41), et = l & p ^ ~l & S, W = y & $ ^ ~y & C, R = Nt.add5L(K, T, W, CS[E], Zr[E]), q = Nt.add5H(R, V, M, et, LS[E], Yr[E]), v = R | 0, B = Nt.rotrSH(r, i, 28) ^ Nt.rotrBH(r, i, 34) ^ Nt.rotrBH(r, i, 39), m = Nt.rotrSL(r, i, 28) ^ Nt.rotrBL(r, i, 34) ^ Nt.rotrBL(r, i, 39), P = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      V = S | 0, K = C | 0, S = p | 0, C = $ | 0, p = l | 0, $ = y | 0, { h: l, l: y } = Nt.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const X = Nt.add3L(v, m, nt);
      r = Nt.add3H(X, q, B, P), i = X | 0;
    }
    ({ h: r, l: i } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Nt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: $ } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, $ | 0), { h: S, l: C } = Nt.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: V, l: K } = Nt.add(this.Hh | 0, this.Hl | 0, V | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, $, S, C, V, K);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, TS = class extends bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, BS = class extends bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, MS = class extends bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ri(() => new bc());
ri(() => new TS());
const NS = ri(() => new BS());
ri(() => new MS());
var Gt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Gt || (Gt = {}));
var je;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(je || (je = {}));
function ju(t) {
  return je[t];
}
const PS = () => ({ type: Gt.BoolTrue }), _S = () => ({ type: Gt.BoolFalse }), US = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Gt.Buffer, value: bt(t) };
}, Bd = BigInt("0xffffffffffffffffffffffffffffffff"), HS = BigInt(0), Md = BigInt("0x7fffffffffffffffffffffffffffffff"), Nd = BigInt("-170141183460469231731687303715884105728"), OS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = hl(Wt(t))), ln(t, Uint8Array) && (t = hl(t));
  const e = Ze(t);
  if (e > Md)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Md}`);
  if (e < Nd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Nd}`);
  return { type: Gt.Int, value: e };
}, DS = (t) => {
  const e = Ze(t);
  if (e < HS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Bd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Bd}`);
  return { type: Gt.UInt, value: e };
};
function FS(t) {
  return { type: Gt.List, value: t };
}
function Zp() {
  return { type: Gt.OptionalNone };
}
function Qp(t) {
  return { type: Gt.OptionalSome, value: t };
}
var ot;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ot || (ot = {}));
function jS() {
  return {
    type: ot.Address,
    version: Gs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Pd(t) {
  if (t && ag(t, ja))
    throw new Error(`Memo exceeds maximum length of ${ja} bytes`);
  return { type: ot.MemoString, content: t };
}
function zu(t, e) {
  return {
    type: ot.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ul(t) {
  if (Wt(t).byteLength != yc)
    throw Error("Invalid signature");
  return {
    type: ot.MessageSignature,
    data: t
  };
}
function zS(t, e, n) {
  return typeof t == "string" && (t = s3(t)), typeof n == "string" && (n = Pd(n)), {
    type: ot.Payload,
    payloadType: te.TokenTransfer,
    recipient: t,
    amount: Ze(e),
    memo: n ?? Pd("")
  };
}
function RS(t, e, n, r) {
  return typeof e == "string" && (e = Rn(e)), typeof n == "string" && (n = Rn(n)), {
    type: ot.Payload,
    payloadType: te.ContractCall,
    contractAddress: typeof t == "string" ? ys(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function GS(t) {
  return Rn(t, 4, 1e5);
}
function _d(t, e, n) {
  return typeof t == "string" && (t = Rn(t)), typeof e == "string" && (e = GS(e)), typeof n == "number" ? {
    type: ot.Payload,
    payloadType: te.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ot.Payload,
    payloadType: te.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function KS() {
  return { type: ot.Payload, payloadType: te.PoisonMicroblock };
}
function Ud(t, e) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  return e != null ? {
    type: ot.Payload,
    payloadType: te.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ot.Payload,
    payloadType: te.Coinbase,
    coinbaseBytes: t
  };
}
function VS(t, e, n) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  if (n.byteLength != Cl)
    throw Error(`VRF proof buffer size must be ${Cl} bytes`);
  return {
    type: ot.Payload,
    payloadType: te.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Gt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function qS(t, e, n, r, i, s, o) {
  return {
    type: ot.Payload,
    payloadType: te.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Rn(t, e, n) {
  const r = e || 1, i = n || Tx;
  if (ag(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: ot.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function WS(t, e, n) {
  return {
    type: ot.Asset,
    address: ys(t),
    contractName: Rn(e),
    assetName: Rn(n)
  };
}
function ys(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: ot.Address,
    version: e[0],
    hash160: e[1]
  };
}
function XS(t, e) {
  const n = ys(t), r = Rn(e);
  return {
    type: ot.Principal,
    prefix: tn.Contract,
    address: n,
    contractName: r
  };
}
function YS(t) {
  const e = ys(t);
  return {
    type: ot.Principal,
    prefix: tn.Standard,
    address: e
  };
}
function Ai(t, e) {
  return {
    pubKeyEncoding: t,
    type: ot.TransactionAuthField,
    contents: e
  };
}
function Sr(t) {
  switch (t.type) {
    case ot.Address:
      return Uo(t);
    case ot.Principal:
      return Jp(t);
    case ot.LengthPrefixedString:
      return Fi(t);
    case ot.MemoString:
      return QS(t);
    case ot.Asset:
      return eg(t);
    case ot.PostCondition:
      return rg(t);
    case ot.PublicKey:
      return Dl(t);
    case ot.LengthPrefixedList:
      return Ru(t);
    case ot.Payload:
      return sg(t);
    case ot.TransactionAuthField:
      return r3(t);
    case ot.MessageSignature:
      return Gu(t);
  }
}
function Uo(t) {
  const e = [];
  return e.push(Wt(To(t.version, 1))), e.push(Wt(t.hash160)), Ue(e);
}
function Di(t) {
  const e = ln(t, oe) ? t : new oe(t), n = rc(bt(e.readBytes(1))), r = bt(e.readBytes(20));
  return { type: ot.Address, version: n, hash160: r };
}
function Jp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === tn.Standard || t.prefix === tn.Contract) && e.push(Uo(t.address)), t.prefix === tn.Contract && e.push(Fi(t.contractName)), Ue(e);
}
function ZS(t) {
  const e = ln(t, oe) ? t : new oe(t), n = e.readUInt8Enum(tn, (s) => {
    throw new Qe(`Unexpected Principal payload type: ${s}`);
  });
  if (n === tn.Origin)
    return { type: ot.Principal, prefix: n };
  const r = Di(e);
  if (n === tn.Standard)
    return { type: ot.Principal, prefix: n, address: r };
  const i = Tn(e);
  return {
    type: ot.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Fi(t) {
  const e = [], n = Qs(t.content), r = n.byteLength;
  return e.push(Wt(To(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function Tn(t, e, n) {
  e = e || 1;
  const r = ln(t, oe) ? t : new oe(t), i = rc(bt(r.readBytes(e))), s = Bo(r.readBytes(i));
  return Rn(s, e, n ?? 128);
}
function QS(t) {
  const e = [], n = Qs(t.content), r = k3(bt(n), ja * 2);
  return e.push(Wt(r)), Ue(e);
}
function tg(t) {
  const e = ln(t, oe) ? t : new oe(t);
  let n = Bo(e.readBytes(ja));
  return n = n.replace(/\u0000*$/, ""), { type: ot.MemoString, content: n };
}
function eg(t) {
  const e = [];
  return e.push(Uo(t.address)), e.push(Fi(t.contractName)), e.push(Fi(t.assetName)), Ue(e);
}
function Hl(t) {
  const e = ln(t, oe) ? t : new oe(t);
  return {
    type: ot.Asset,
    address: Di(e),
    contractName: Tn(e),
    assetName: Tn(e)
  };
}
function Ru(t) {
  const e = t.values, n = [];
  n.push(Wt(To(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Sr(r));
  return Ue(n);
}
function ng(t, e, n) {
  const r = ln(t, oe) ? t : new oe(t), i = rc(bt(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case ot.Address:
        s.push(Di(r));
        break;
      case ot.LengthPrefixedString:
        s.push(Tn(r));
        break;
      case ot.MemoString:
        s.push(tg(r));
        break;
      case ot.Asset:
        s.push(Hl(r));
        break;
      case ot.PostCondition:
        s.push(t3(r));
        break;
      case ot.PublicKey:
        s.push(Fl(r));
        break;
      case ot.TransactionAuthField:
        s.push(n3(r));
        break;
    }
  return zu(s, n);
}
function JS(t) {
  return bt(rg(t));
}
function rg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Jp(t.principal)), (t.conditionType === ge.Fungible || t.conditionType === ge.NonFungible) && e.push(eg(t.asset)), t.conditionType === ge.NonFungible && e.push(rr(t.assetName)), e.push(t.conditionCode), t.conditionType === ge.STX || t.conditionType === ge.Fungible || t.conditionType === ge.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ei("The post-condition amount may not be larger than 8 bytes");
    e.push(ps(t.amount, 8));
  }
  return Ue(e);
}
function t3(t) {
  const e = ln(t, oe) ? t : new oe(t), n = e.readUInt8Enum(ge, (a) => {
    throw new Qe(`Could not read ${a} as PostConditionType`);
  }), r = ZS(e);
  let i, s, o;
  switch (n) {
    case ge.STX:
      return i = e.readUInt8Enum(po, (c) => {
        throw new Qe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ge.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ge.Fungible:
      return s = Hl(e), i = e.readUInt8Enum(po, (c) => {
        throw new Qe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ge.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ge.NonFungible:
      s = Hl(e);
      const a = tr(e);
      return i = e.readUInt8Enum(Bl, (c) => {
        throw new Qe(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ot.PostCondition,
        conditionType: ge.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ge.Staking:
      return i = e.readUInt8Enum(po, (c) => {
        throw new Qe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ge.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ge.PoX: {
      const c = e.readUInt8Enum(Ml, (u) => {
        throw new Qe(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ot.PostCondition,
        conditionType: ge.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function sg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case te.TokenTransfer:
      e.push(rr(t.recipient)), e.push(ps(t.amount, 8)), e.push(Sr(t.memo));
      break;
    case te.ContractCall:
      e.push(Sr(t.contractAddress)), e.push(Sr(t.contractName)), e.push(Sr(t.functionName));
      const n = new Uint8Array(4);
      Ps(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(rr(r));
      });
      break;
    case te.SmartContract:
      e.push(Sr(t.contractName)), e.push(Sr(t.codeBody));
      break;
    case te.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Sr(t.contractName)), e.push(Sr(t.codeBody));
      break;
    case te.PoisonMicroblock:
      break;
    case te.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case te.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(rr(t.recipient));
      break;
    case te.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(rr(t.recipient ? Qp(t.recipient) : Zp())), e.push(t.vrfProof);
      break;
    case te.TenureChange:
      e.push(Wt(t.tenureHash)), e.push(Wt(t.previousTenureHash)), e.push(Wt(t.burnViewHash)), e.push(Wt(t.previousTenureEnd)), e.push(Ps(new Uint8Array(4), t.previousTenureBlocks)), e.push(Zw(new Uint8Array(1), t.cause)), e.push(Wt(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function e3(t) {
  const e = ln(t, oe) ? t : new oe(t);
  switch (e.readUInt8Enum(te, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case te.TokenTransfer:
      const r = tr(e), i = Ze(e.readBytes(8)), s = tg(e);
      return zS(r, i, s);
    case te.ContractCall:
      const o = Di(e), a = Tn(e), c = Tn(e), u = [], d = e.readUInt32BE();
      for (let M = 0; M < d; M++) {
        const T = tr(e);
        u.push(T);
      }
      return RS(o, a, c, u);
    case te.SmartContract:
      const l = Tn(e), y = Tn(e, 4, 1e5);
      return _d(l, y);
    case te.VersionedSmartContract: {
      const M = e.readUInt8Enum(Tl, (W) => {
        throw new Error(`Cannot recognize ClarityVersion: ${W}`);
      }), T = Tn(e), et = Tn(e, 4, jx);
      return _d(T, et, M);
    }
    case te.PoisonMicroblock:
      return KS();
    case te.Coinbase: {
      const M = e.readBytes(Ts);
      return Ud(M);
    }
    case te.CoinbaseToAltRecipient: {
      const M = e.readBytes(Ts), T = tr(e);
      return Ud(M, T);
    }
    case te.NakamotoCoinbase: {
      const M = e.readBytes(Ts), T = tr(e), et = e.readBytes(Cl);
      return VS(M, T, et);
    }
    case te.TenureChange:
      const p = bt(e.readBytes(20)), $ = bt(e.readBytes(20)), S = bt(e.readBytes(20)), C = bt(e.readBytes(32)), V = e.readUInt32BE(), K = e.readUInt8Enum(Nl, (M) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${M}`);
      }), E = bt(e.readBytes(20));
      return qS(p, $, S, C, V, K, E);
  }
}
function Ol(t) {
  const e = ln(t, oe) ? t : new oe(t);
  return Ul(bt(e.readBytes(yc)));
}
function n3(t) {
  const e = ln(t, oe) ? t : new oe(t), n = e.readUInt8Enum(Fn, (r) => {
    throw new Qe(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Fn.PublicKeyCompressed:
      return Ai(Se.Compressed, Fl(e));
    case Fn.PublicKeyUncompressed:
      return Ai(Se.Uncompressed, Wi(H3(Fl(e).data)));
    case Fn.SignatureCompressed:
      return Ai(Se.Compressed, Ol(e));
    case Fn.SignatureUncompressed:
      return Ai(Se.Uncompressed, Ol(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Gu(t) {
  return Wt(t.data);
}
function r3(t) {
  const e = [];
  switch (t.contents.type) {
    case ot.PublicKey:
      e.push(t.pubKeyEncoding === Se.Compressed ? Fn.PublicKeyCompressed : Fn.PublicKeyUncompressed), e.push(Wt(U3(t.contents.data)));
      break;
    case ot.MessageSignature:
      e.push(t.pubKeyEncoding === Se.Compressed ? Fn.SignatureCompressed : Fn.SignatureUncompressed), e.push(Gu(t.contents));
      break;
  }
  return Ue(e);
}
function Dl(t) {
  return t.data.slice();
}
function Fl(t) {
  const e = ln(t, oe) ? t : new oe(t), n = e.readUInt8(), r = n === 4 ? Nx : Mx;
  return Wi(Ue([n, e.readBytes(r)]));
}
function Ku(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === re.P2PKH || e === re.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === re.P2WPKH || e === re.P2WSH || e === re.P2WSHNonSequential) && !r.map((i) => i.data).every(Xi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case re.P2PKH:
      return ra(t, I3(r[0].data));
    case re.P2WPKH:
      return ra(t, L3(r[0].data));
    case re.P2SH:
    case re.P2SHNonSequential:
      return ra(t, C3(n, r.map(Dl)));
    case re.P2WSH:
    case re.P2WSHNonSequential:
      return ra(t, T3(n, r.map(Dl)));
  }
}
function ra(t, e) {
  return { type: ot.Address, version: t, hash160: e };
}
function Vu(t) {
  return ni.c32address(t.version, t.hash160);
}
function Hd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return WS(e, n, r);
}
function so(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return XS(e, n);
  } else
    return YS(t);
}
function s3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return a3(e, n);
  } else
    return i3(t);
}
function i3(t) {
  const e = ys(t);
  return { type: Gt.PrincipalStandard, value: Vu(e) };
}
function o3(t) {
  return { type: Gt.PrincipalStandard, value: Vu(t) };
}
function a3(t, e) {
  const n = ys(t), r = Rn(e);
  return ig(n, r);
}
function ig(t, e) {
  if (Qs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Gt.PrincipalContract,
    value: `${Vu(t)}.${e.content}`
  };
}
function c3(t) {
  return { type: Gt.ResponseErr, value: t };
}
function l3(t) {
  return { type: Gt.ResponseOk, value: t };
}
const u3 = (t) => ({ type: Gt.StringASCII, value: t }), f3 = (t) => ({ type: Gt.StringUTF8, value: t });
function d3(t) {
  for (const e in t)
    if (!B3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Gt.Tuple, value: t };
}
function tr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new oe(Wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new oe(t) : e = t;
  switch (e.readUInt8Enum(je, (r) => {
    throw new Qe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case je.int:
      return OS(hl(e.readBytes(16)));
    case je.uint:
      return DS(e.readBytes(16));
    case je.buffer:
      const r = e.readUInt32BE();
      return US(e.readBytes(r));
    case je.true:
      return PS();
    case je.false:
      return _S();
    case je.address:
      const i = Di(e);
      return o3(i);
    case je.contract:
      const s = Di(e), o = Tn(e);
      return ig(s, o);
    case je.ok:
      return l3(tr(e));
    case je.err:
      return c3(tr(e));
    case je.none:
      return Zp();
    case je.some:
      return Qp(tr(e));
    case je.list:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(tr(e));
      return FS(c);
    case je.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let S = 0; S < u; S++) {
        const C = Tn(e).content;
        if (C === void 0)
          throw new Qe('"content" is undefined');
        d[C] = tr(e);
      }
      return d3(d);
    case je.ascii:
      const l = e.readUInt32BE(), y = Rw(e.readBytes(l));
      return u3(y);
    case je.utf8:
      const p = e.readUInt32BE(), $ = Bo(e.readBytes(p));
      return f3($);
    default:
      throw new Qe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function cr(t, e) {
  return Ue([ju(t), e]);
}
function h3(t) {
  return new Uint8Array([ju(t.type)]);
}
function p3(t) {
  return t.type === Gt.OptionalNone ? new Uint8Array([ju(t.type)]) : cr(t.type, rr(t.value));
}
function g3(t) {
  const e = new Uint8Array(4);
  return Ps(e, Math.ceil(t.value.length / 2), 0), cr(t.type, or(e, Wt(t.value)));
}
function y3(t) {
  const e = yu(Ow(BigInt(t.value), BigInt(Bx)), zp);
  return cr(t.type, e);
}
function w3(t) {
  const e = yu(BigInt(t.value), zp);
  return cr(t.type, e);
}
function b3(t) {
  return cr(t.type, Uo(ys(t.value)));
}
function m3(t) {
  const [e, n] = M3(t.value);
  return cr(t.type, or(Uo(ys(e)), Fi(Rn(n))));
}
function x3(t) {
  return cr(t.type, rr(t.value));
}
function S3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = rr(r);
    e.push(i);
  }
  return cr(t.type, Ue(e));
}
function E3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Rn(i);
    e.push(Fi(s));
    const o = rr(t.value[i]);
    e.push(o);
  }
  return cr(t.type, Ue(e));
}
function og(t, e) {
  const n = [], r = e == "ascii" ? zw(t.value) : Qs(t.value), i = new Uint8Array(4);
  return Ps(i, r.length, 0), n.push(i), n.push(r), cr(t.type, Ue(n));
}
function A3(t) {
  return og(t, "ascii");
}
function v3(t) {
  return og(t, "utf8");
}
function Od(t) {
  return bt(rr(t));
}
function rr(t) {
  switch (t.type) {
    case Gt.BoolTrue:
    case Gt.BoolFalse:
      return h3(t);
    case Gt.OptionalNone:
    case Gt.OptionalSome:
      return p3(t);
    case Gt.Buffer:
      return g3(t);
    case Gt.UInt:
      return w3(t);
    case Gt.Int:
      return y3(t);
    case Gt.PrincipalStandard:
      return b3(t);
    case Gt.PrincipalContract:
      return m3(t);
    case Gt.ResponseOk:
    case Gt.ResponseErr:
      return x3(t);
    case Gt.List:
      return S3(t);
    case Gt.Tuple:
      return E3(t);
    case Gt.StringASCII:
      return A3(t);
    case Gt.StringUTF8:
      return v3(t);
    default:
      throw new Ei("Unable to serialize. Invalid Clarity Value.");
  }
}
const $3 = (t) => t.length % 2 ? `0${t}` : t, k3 = (t, e) => t.padEnd(e, "0"), ag = (t, e) => t ? Qs(t).length > e : !1;
function jl(t) {
  return Op(t);
}
const mo = (t) => oS(Ou(t)), qu = (t) => bt(NS(t)), I3 = (t) => bt(mo(t)), L3 = (t) => {
  const e = mo(t), n = or(new Uint8Array([0]), new Uint8Array([e.length]), e), r = mo(n);
  return bt(r);
}, C3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), i = mo(r);
  return bt(i);
}, T3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), i = Ou(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Ue(s), a = mo(o);
  return bt(a);
};
function B3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function M3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = Vp.create(Ou, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Wi(t) {
  return t = typeof t == "string" ? Wt(t) : t, {
    type: ot.PublicKey,
    data: t
  };
}
function N3(t, e, n = Se.Compressed) {
  const r = qw(e), i = new Sn(Of(r.r), Of(r.s)), s = Dt.fromSignature(t, i, r.recoveryId), o = n === Se.Compressed;
  return s.toHex(o);
}
function P3(t) {
  return typeof t == "string" ? t : bt(t);
}
const Wu = P3;
function cg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Vw;
}
function Xi(t) {
  return !Wu(t).startsWith("04");
}
function _3(t) {
  t = wu(t);
  const e = cg(t);
  return bt(Mo(t.slice(0, 32), e));
}
function U3(t) {
  return Dt.fromHex(Wu(t)).toHex(!0);
}
function H3(t) {
  return Dt.fromHex(Wu(t)).toHex(!1);
}
function O3(t, e) {
  t = wu(t);
  const [n, r] = ic(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return To(r, 1) + Sn.fromHex(n).toCompactHex();
}
function Xu() {
  return {
    type: ot.MessageSignature,
    data: bt(new Uint8Array(yc))
  };
}
function lg(t, e, n, r) {
  const i = Ku(0, t, 1, [Wi(e)]).hash160, s = Xi(e) ? Se.Compressed : Se.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Ze(n),
    fee: Ze(r),
    keyEncoding: s,
    signature: Xu()
  };
}
function xo(t) {
  return "signature" in t;
}
function Dd(t) {
  return t === re.P2SH || t === re.P2WSH;
}
function D3(t) {
  return t === re.P2SHNonSequential || t === re.P2WSHNonSequential;
}
function Fd(t) {
  const e = jl(t);
  return e.nonce = 0, e.fee = 0, xo(e) ? e.signature = Xu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function F3(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    ps(t.nonce, 8),
    ps(t.fee, 8),
    t.keyEncoding,
    Gu(t.signature)
  ];
  return Ue(e);
}
function j3(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    ps(t.nonce, 8),
    ps(t.fee, 8)
  ], n = zu(t.fields);
  e.push(Ru(n));
  const r = new Uint8Array(2);
  return Xw(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function z3(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt(`0x${bt(e.readBytes(8))}`), i = BigInt(`0x${bt(e.readBytes(8))}`), s = e.readUInt8Enum(Se, (a) => {
    throw new Qe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === re.P2WPKH && s != Se.Compressed)
    throw new Qe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ol(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function R3(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt("0x" + bt(e.readBytes(8))), i = BigInt("0x" + bt(e.readBytes(8))), s = ng(e, ot.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case ot.PublicKey:
        Xi(u.contents.data) || (o = !0);
        break;
      case ot.MessageSignature:
        if (u.pubKeyEncoding === Se.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new vs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === re.P2WSH || t === re.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Gc(t) {
  return xo(t) ? F3(t) : j3(t);
}
function Kc(t) {
  const e = t.readUInt8Enum(re, (n) => {
    throw new Qe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === re.P2PKH || e === re.P2WPKH ? z3(e, t) : R3(e, t);
}
function ug(t, e, n, r) {
  const s = t + bt(new Uint8Array([e])) + bt(ps(n, 8)) + bt(ps(r, 8));
  if (Wt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return qu(Wt(s));
}
function fg(t, e, n) {
  const r = 33 + yc, i = Xi(e.data) ? Se.Compressed : Se.Uncompressed, s = t + $3(i.toString(16)) + n, o = Wt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return qu(o);
}
function G3(t, e, n, r, i) {
  const s = ug(t, e, n, r), o = O3(i, s), a = Wi(_3(i)), c = fg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function dg(t, e, n, r, i, s) {
  const o = ug(t, e, n, r), a = Wi(N3(o, s, i)), c = fg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function K3() {
  const t = lg(re.P2PKH, "", 0, 0);
  return t.signer = jS().hash160, t.keyEncoding = Se.Compressed, t.signature = Xu(), t;
}
function jd(t, e, n) {
  return xo(t) ? V3(t, e, n) : q3(t, e, n);
}
function V3(t, e, n) {
  const { pubKey: r, nextSigHash: i } = dg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = Ku(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function q3(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ot.PublicKey:
        Xi(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case ot.MessageSignature:
        c.pubKeyEncoding === Se.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = dg(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Dd(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new vs("Too many signatures");
        break;
    }
  if (Dd(t.hashMode) && o !== t.signaturesRequired || D3(t.hashMode) && o < t.signaturesRequired)
    throw new vs("Incorrect number of signatures");
  if (s && (t.hashMode === re.P2WSH || t.hashMode === re.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  const a = Ku(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function hg(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function pg(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || lg(re.P2PKH, "0".repeat(66), 0, 0)
  };
}
function zd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return hg(Fd(t.spendingCondition));
      case Le.Sponsored:
        return pg(Fd(t.spendingCondition), K3());
      default:
        throw new Ra("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function W3(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return jd(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return jd(t.spendingCondition, e, Le.Standard);
    default:
      throw new Ra("Invalid origin auth type");
  }
}
function X3(t, e) {
  switch (t.authType) {
    case Le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ze(e)
      };
      return { ...t, spendingCondition: n };
    case Le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ze(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Y3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ze(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Z3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ze(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Q3(t, e) {
  const n = {
    ...e,
    nonce: Ze(e.nonce),
    fee: Ze(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function J3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(Gc(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(Gc(t.spendingCondition)), e.push(Gc(t.sponsorSpendingCondition));
      break;
  }
  return Ue(e);
}
function tE(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new Qe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = Kc(t), hg(n);
    case Le.Sponsored:
      n = Kc(t);
      const r = Kc(t);
      return pg(n, r);
  }
}
class eE {
  constructor({ auth: e, payload: n, postConditions: r = zu([]), postConditionMode: i = za.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = Lx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Ze(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = yn.Any;
  }
  signBegin() {
    const e = jl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = jl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyOrigin() {
    return W3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Wi(e), r = this.auth.spendingCondition;
    if (r && !xo(r)) {
      const i = Xi(n.data);
      r.fields.push(Ai(i ? Se.Compressed : Se.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = G3(n, r, e.fee, e.nonce, i);
    if (xo(e))
      e.signature = Ul(s);
    else {
      const a = cg(i);
      e.fields.push(Ai(a ? Se.Compressed : Se.Uncompressed, Ul(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return qu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Q3(this.auth, e);
  }
  setFee(e) {
    this.auth = X3(this.auth, e);
  }
  setNonce(e) {
    this.auth = Y3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Z3(this.auth, e);
  }
  serialize() {
    return bt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ei('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ei('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ei('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ei('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ps(n, this.chainId, 0), e.push(n), e.push(J3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ru(this.postConditions)), e.push(sg(this.payload)), Ue(e);
  }
}
function nE(t) {
  const e = ln(t, oe) ? t : new oe(t), n = e.readUInt8Enum(Rs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = tE(e), s = e.readUInt8Enum(yn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(za, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = ng(e, ot.PostCondition), c = e3(e), u = new eE({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const Rd = BigInt("18446744073709551615");
function Vc(t) {
  const e = Ze(t);
  if (e < 0n || e > Rd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Rd} (u64 max), received: ${e}`);
  return e;
}
var zl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(zl || (zl = {}));
var Rl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Rl || (Rl = {}));
function rE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.STX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: tn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.Fungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: tn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount),
        asset: Hd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.NonFungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: tn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        asset: Hd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.Staking,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: tn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ge.PoX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: tn.Origin } : so(t.address),
        conditionCode: sE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function sa(t) {
  return zl[t];
}
function sE(t) {
  return Rl[t];
}
function gg(t) {
  const e = rE(t);
  return JS(e);
}
function iE(t, e, n) {
  return Zu(yg(t), n);
}
function yg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = So(r);
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
    return BigInt(`0x${cE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Yu(t, e = 8) {
  return (typeof t == "bigint" ? t : yg(t)).toString(16).padStart(e * 2, "0");
}
function Zu(t, e = 16) {
  const n = Yu(t, e);
  return So(n);
}
function oE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const aE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += aE[n];
  return e;
}
function So(t) {
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
function Qu(t) {
  return new TextEncoder().encode(t);
}
function lE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function uE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Gd(t) {
  if (t.some(uE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ju(...t) {
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
function Lr(t) {
  return Ju(...t.map((e) => typeof e == "number" ? Gd([e]) : e instanceof Array ? Gd(e) : e));
}
function mc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Gl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Gl || (Gl = {}));
Gl.Mainnet;
const fE = 128, dE = 128, wg = 16;
var Kl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Kl || (Kl = {}));
var Kd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Kd || (Kd = {}));
var Vd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Vd || (Vd = {}));
var Dn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dn || (Dn = {}));
const qc = ["onChainOnly", "offChainOnly", "any"];
qc[0] + "", Dn.OnChainOnly, qc[1] + "", Dn.OffChainOnly, qc[2] + "", Dn.Any, Dn.OnChainOnly + "", Dn.OnChainOnly, Dn.OffChainOnly + "", Dn.OffChainOnly, Dn.Any + "", Dn.Any;
var Vl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vl || (Vl = {}));
Vl.Mainnet;
var qd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(qd || (qd = {}));
var xs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(xs || (xs = {}));
var Wd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Wd || (Wd = {}));
var Xd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Jd || (Jd = {}));
var ql;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ql || (ql = {}));
var th;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(th || (th = {}));
var eh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(eh || (eh = {}));
function Wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function hE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function bg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function pE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wl(t.outputLen), Wl(t.blockLen);
}
function gE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function yE(t, e) {
  bg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Wc = {
  number: Wl,
  bool: hE,
  bytes: bg,
  hash: pE,
  exists: gE,
  output: yE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Yn = (t, e) => t << 32 - e | t >>> e, wE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!wE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function mg(t) {
  if (typeof t == "string" && (t = bE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let mE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function si(t) {
  const e = (r) => t().update(mg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function xE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let tf = class extends mE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xc(this.buffer);
  }
  update(e) {
    Wc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = mg(e);
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
    Wc.exists(this), Wc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    xE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
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
};
const SE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), xg = Uint8Array.from({ length: 16 }, (t, e) => e), EE = xg.map((t) => (9 * t + 5) % 16);
let ef = [xg], nf = [EE];
for (let t = 0; t < 4; t++)
  for (let e of [ef, nf])
    e.push(e[t].map((n) => SE[n]));
const Sg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), AE = ef.map((t, e) => t.map((n) => Sg[e][n])), vE = nf.map((t, e) => t.map((n) => Sg[e][n])), $E = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), kE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ia = (t, e) => t << e | t >>> 32 - e;
function nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oa = new Uint32Array(16);
let IE = class extends tf {
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
      oa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const $ = 4 - p, S = $E[p], C = kE[p], V = ef[p], K = nf[p], E = AE[p], M = vE[p];
      for (let T = 0; T < 16; T++) {
        const et = ia(r + nh(p, s, a, u) + oa[V[T]] + S, E[T]) + l | 0;
        r = l, l = u, u = ia(a, 10) | 0, a = s, s = et;
      }
      for (let T = 0; T < 16; T++) {
        const et = ia(i + nh($, o, c, d) + oa[K[T]] + C, M[T]) + y | 0;
        i = y, y = d, d = ia(c, 10) | 0, c = o, o = et;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    oa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
si(() => new IE());
const LE = (t, e, n) => t & e ^ ~t & n, CE = (t, e, n) => t & e ^ t & n ^ e & n, TE = new Uint32Array([
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
]), Qr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jr = new Uint32Array(64);
let Eg = class extends tf {
  constructor() {
    super(64, 32, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
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
      Jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Jr[l - 15], p = Jr[l - 2], $ = Yn(y, 7) ^ Yn(y, 18) ^ y >>> 3, S = Yn(p, 17) ^ Yn(p, 19) ^ p >>> 10;
      Jr[l] = S + Jr[l - 7] + $ + Jr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Yn(a, 6) ^ Yn(a, 11) ^ Yn(a, 25), p = d + y + LE(a, c, u) + TE[l] + Jr[l] | 0, S = (Yn(r, 2) ^ Yn(r, 13) ^ Yn(r, 22)) + CE(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, BE = class extends Eg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
si(() => new Eg());
si(() => new BE());
const aa = BigInt(2 ** 32 - 1), Xl = BigInt(32);
function Ag(t, e = !1) {
  return e ? { h: Number(t & aa), l: Number(t >> Xl & aa) } : { h: Number(t >> Xl & aa) | 0, l: Number(t & aa) | 0 };
}
function ME(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Ag(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const NE = (t, e) => BigInt(t >>> 0) << Xl | BigInt(e >>> 0), PE = (t, e, n) => t >>> n, _E = (t, e, n) => t << 32 - n | e >>> n, UE = (t, e, n) => t >>> n | e << 32 - n, HE = (t, e, n) => t << 32 - n | e >>> n, OE = (t, e, n) => t << 64 - n | e >>> n - 32, DE = (t, e, n) => t >>> n - 32 | e << 64 - n, FE = (t, e) => e, jE = (t, e) => t, zE = (t, e, n) => t << n | e >>> 32 - n, RE = (t, e, n) => e << n | t >>> 32 - n, GE = (t, e, n) => e << n - 32 | t >>> 64 - n, KE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function VE(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const qE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), WE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, XE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), YE = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, ZE = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), QE = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Ag,
  split: ME,
  toBig: NE,
  shrSH: PE,
  shrSL: _E,
  rotrSH: UE,
  rotrSL: HE,
  rotrBH: OE,
  rotrBL: DE,
  rotr32H: FE,
  rotr32L: jE,
  rotlSH: zE,
  rotlSL: RE,
  rotlBH: GE,
  rotlBL: KE,
  add: VE,
  add3L: qE,
  add3H: WE,
  add4L: XE,
  add4H: YE,
  add5H: QE,
  add5L: ZE
}, [JE, tA] = Pt.split([
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
].map((t) => BigInt(t))), ts = new Uint32Array(80), es = new Uint32Array(80);
let xc = class extends tf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: $, Hh: S, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = $ | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ts[E] = e.getUint32(n), es[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = ts[E - 15] | 0, T = es[E - 15] | 0, et = Pt.rotrSH(M, T, 1) ^ Pt.rotrSH(M, T, 8) ^ Pt.shrSH(M, T, 7), W = Pt.rotrSL(M, T, 1) ^ Pt.rotrSL(M, T, 8) ^ Pt.shrSL(M, T, 7), R = ts[E - 2] | 0, q = es[E - 2] | 0, v = Pt.rotrSH(R, q, 19) ^ Pt.rotrBH(R, q, 61) ^ Pt.shrSH(R, q, 6), B = Pt.rotrSL(R, q, 19) ^ Pt.rotrBL(R, q, 61) ^ Pt.shrSL(R, q, 6), m = Pt.add4L(W, B, es[E - 7], es[E - 16]), P = Pt.add4H(m, et, v, ts[E - 7], ts[E - 16]);
      ts[E] = P | 0, es[E] = m | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: $, Gh: S, Gl: C, Hh: V, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const M = Pt.rotrSH(l, y, 14) ^ Pt.rotrSH(l, y, 18) ^ Pt.rotrBH(l, y, 41), T = Pt.rotrSL(l, y, 14) ^ Pt.rotrSL(l, y, 18) ^ Pt.rotrBL(l, y, 41), et = l & p ^ ~l & S, W = y & $ ^ ~y & C, R = Pt.add5L(K, T, W, tA[E], es[E]), q = Pt.add5H(R, V, M, et, JE[E], ts[E]), v = R | 0, B = Pt.rotrSH(r, i, 28) ^ Pt.rotrBH(r, i, 34) ^ Pt.rotrBH(r, i, 39), m = Pt.rotrSL(r, i, 28) ^ Pt.rotrBL(r, i, 34) ^ Pt.rotrBL(r, i, 39), P = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      V = S | 0, K = C | 0, S = p | 0, C = $ | 0, p = l | 0, $ = y | 0, { h: l, l: y } = Pt.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const X = Pt.add3L(v, m, nt);
      r = Pt.add3H(X, q, B, P), i = X | 0;
    }
    ({ h: r, l: i } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Pt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: $ } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, $ | 0), { h: S, l: C } = Pt.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: V, l: K } = Pt.add(this.Hh | 0, this.Hl | 0, V | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, $, S, C, V, K);
  }
  roundClean() {
    ts.fill(0), es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, eA = class extends xc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, nA = class extends xc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, rA = class extends xc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
si(() => new xc());
si(() => new eA());
si(() => new nA());
si(() => new rA());
function sA(t, e, n) {
  const i = fE;
  if (xA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Kl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Re;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Re || (Re = {}));
let iA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, vg = class extends iA {
  constructor(e) {
    super(e);
  }
};
function Sc(t) {
  const e = [];
  return e.push(So(Yu(t.version, 1))), e.push(So(t.hash160)), Lr(e);
}
function oA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Sc(t.address)), t.prefix === ql.Contract && e.push(Eo(t.contractName)), Lr(e);
}
function Eo(t) {
  const e = [], n = Qu(t.content), r = n.byteLength;
  return e.push(So(Yu(r, t.lengthPrefixBytes))), e.push(n), Lr(e);
}
function aA(t) {
  const e = [];
  return e.push(Sc(t.address)), e.push(Eo(t.contractName)), e.push(Eo(t.assetName)), Lr(e);
}
function $g(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(oA(t.principal)), (t.conditionType === xs.Fungible || t.conditionType === xs.NonFungible) && e.push(aA(t.assetInfo)), t.conditionType === xs.NonFungible && e.push(Ks(t.assetName)), e.push(t.conditionCode), t.conditionType === xs.STX || t.conditionType === xs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new vg("The post-condition amount may not be larger than 8 bytes");
    e.push(iE(t.amount, !1, 8));
  }
  return Lr(e);
}
function lr(t, e) {
  return Lr([t, e]);
}
function cA(t) {
  return new Uint8Array([t.type]);
}
function lA(t) {
  return t.type === Re.OptionalNone ? new Uint8Array([t.type]) : lr(t.type, Ks(t.value));
}
function uA(t) {
  const e = new Uint8Array(4);
  return mc(e, t.buffer.length, 0), lr(t.type, Ju(e, t.buffer));
}
function fA(t) {
  const e = Zu(oE(t.value, BigInt(dE)), wg);
  return lr(t.type, e);
}
function dA(t) {
  const e = Zu(t.value, wg);
  return lr(t.type, e);
}
function hA(t) {
  return lr(t.type, Sc(t.address));
}
function pA(t) {
  return lr(t.type, Ju(Sc(t.address), Eo(t.contractName)));
}
function gA(t) {
  return lr(t.type, Ks(t.value));
}
function yA(t) {
  const e = [], n = new Uint8Array(4);
  mc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Ks(r);
    e.push(i);
  }
  return lr(t.type, Lr(e));
}
function wA(t) {
  const e = [], n = new Uint8Array(4);
  mc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = sA(i);
    e.push(Eo(s));
    const o = Ks(t.data[i]);
    e.push(o);
  }
  return lr(t.type, Lr(e));
}
function kg(t, e) {
  const n = [], r = e == "ascii" ? lE(t.data) : Qu(t.data), i = new Uint8Array(4);
  return mc(i, r.length, 0), n.push(i), n.push(r), lr(t.type, Lr(n));
}
function bA(t) {
  return kg(t, "ascii");
}
function mA(t) {
  return kg(t, "utf8");
}
function Ks(t) {
  switch (t.type) {
    case Re.BoolTrue:
    case Re.BoolFalse:
      return cA(t);
    case Re.OptionalNone:
    case Re.OptionalSome:
      return lA(t);
    case Re.Buffer:
      return uA(t);
    case Re.UInt:
      return dA(t);
    case Re.Int:
      return fA(t);
    case Re.PrincipalStandard:
      return hA(t);
    case Re.PrincipalContract:
      return pA(t);
    case Re.ResponseOk:
    case Re.ResponseErr:
      return gA(t);
    case Re.List:
      return yA(t);
    case Re.Tuple:
      return wA(t);
    case Re.StringASCII:
      return bA(t);
    case Re.StringUTF8:
      return mA(t);
    default:
      throw new vg("Unable to serialize. Invalid Clarity Value.");
  }
}
const xA = (t, e) => t ? Qu(t).length > e : !1, SA = "connect-ui";
let va, Ig, wn = !1, Yl = !1;
const Ir = (t, e = "") => () => {
}, EA = (t, e) => () => {
}, AA = "{visibility:hidden}.hydrated{visibility:inherit}", rh = {}, vA = "http://www.w3.org/2000/svg", $A = "http://www.w3.org/1999/xhtml", kA = (t) => t != null, rf = (t) => (t = typeof t, t === "object" || t === "function");
function Lg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Tt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !rf(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? Zl(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Zl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Zl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, IA = {}, LA = (t) => t && t.$tag$ === IA, CA = (t, e) => t != null && !rf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, TA = (t) => Yi(t).$hostElement$, BA = (t, e, n) => {
  const r = Ye.ce(e, n);
  return t.dispatchEvent(r), r;
}, sh = /* @__PURE__ */ new WeakMap(), MA = (t, e, n) => {
  let r = Ga.get(t);
  QA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ga.set(t, r);
}, NA = (t, e, n, r) => {
  var i;
  let s = Cg(e);
  const o = Ga.get(s);
  if (t = t.nodeType === 11 ? t : sr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = sh.get(t), c;
      if (a || sh.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = sr.createElement("style"), c.innerHTML = o;
          const u = (i = Ye.$nonce$) !== null && i !== void 0 ? i : Lg(sr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, PA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = Ir("attachStyles", e.$tagName$), s = NA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, Cg = (t, e) => "sc-" + t.$tagName$, ih = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = ah(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = oh(n), d = oh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ah(Ec, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Ye.rel(t, e, n, !1), r && Ye.ael(t, e, r, !1);
    else {
      const c = rf(r);
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
}, _A = /\s/, oh = (t) => t ? t.split(_A) : [], Tg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || rh, o = e.$attrs$ || rh;
  for (r in s)
    r in o || ih(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    ih(i, r, s[r], o[r], n, e.$flags$);
}, sf = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = sr.createTextNode(i.$text$);
  else {
    if (wn || (wn = i.$tag$ === "svg"), o = i.$elm$ = sr.createElementNS(wn ? vA : $A, i.$tag$), wn && i.$tag$ === "foreignObject" && (wn = !1), Tg(null, i, wn), kA(va) && o["s-si"] !== va && o.classList.add(o["s-si"] = va), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = sf(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? wn = !1 : o.tagName === "foreignObject" && (wn = !0);
  }
  return o;
}, Bg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Ig && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = sf(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Mg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, UA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : d == null ? d = r[++s] : l == null ? l = r[--u] : ca(a, d) ? (co(a, d), a = e[++i], d = r[++s]) : ca(c, l) ? (co(c, l), c = e[--o], l = r[--u]) : ca(a, l) ? (co(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : ca(c, d) ? (co(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++s]) : (y = sf(e && e[s], n, s), d = r[++s], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  i > o ? Bg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Mg(e, i, o);
}, ca = (t, e) => t.$tag$ === e.$tag$, co = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (wn = s === "svg" ? !0 : s === "foreignObject" ? !1 : wn, Tg(t, e, wn), r !== null && i !== null ? UA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Bg(n, null, e, i, 0, i.length - 1)) : r !== null && Mg(r, 0, r.length - 1), wn && s === "svg" && (wn = !1)) : t.$text$ !== o && (n.data = o);
}, HA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Zl(null, null), i = LA(e) ? e : Tt(null, null, e);
  Ig = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, va = n["s-sc"], co(r, i);
}, Ng = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, of = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Ng(t, t.$ancestorComponent$), t4(() => OA(t, e));
}, OA = (t, e) => {
  const n = Ir("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), zA(i, () => DA(t, r, e));
}, DA = async (t, e, n) => {
  const r = t.$hostElement$, i = Ir("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && PA(t);
  const o = Ir("render", t.$cmpMeta$.$tagName$);
  FA(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => jA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, FA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, HA(t, e);
  } catch (r) {
    Ao(r, t.$hostElement$);
  }
  return null;
}, jA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ir("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, _g(n), r(), t.$onReadyResolve$(n), i || Pg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && cf(() => of(t, !1)), t.$flags$ &= -517;
}, Pg = (t) => {
  _g(sr.documentElement), cf(() => BA(Ec, "appload", { detail: { namespace: SA } }));
}, zA = (t, e) => t && t.then ? t.then(e) : e(), _g = (t) => t.classList.add("hydrated"), RA = (t, e) => Yi(t).$instanceValues$.get(e), GA = (t, e, n, r) => {
  const i = Yi(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = CA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && of(i, !1));
}, Ug = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return RA(this, s);
        },
        set(a) {
          GA(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        Ye.jmp(() => {
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
}, KA = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = ZA(n), i.then) {
        const c = EA();
        i = await i, c();
      }
      i.isProxied || (Ug(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = Ir("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        Ao(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = Cg(n);
      if (!Ga.has(c)) {
        const u = Ir("registerStyles", n.$tagName$);
        MA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => of(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, VA = (t) => {
  if (!(Ye.$flags$ & 1)) {
    const e = Yi(t), n = e.$cmpMeta$, r = Ir("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Ng(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), KA(t, e, n);
    }
    r();
  }
}, qA = (t) => {
  Ye.$flags$ & 1 || Yi(t);
}, WA = (t, e = {}) => {
  var n;
  const r = Ir(), i = [], s = e.exclude || [], o = Ec.customElements, a = sr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ sr.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(Ye, e), Ye.$resourcesUrl$ = new URL(e.resourcesUrl || "./", sr.baseURI).href, t.map((p) => {
    p[1].map(($) => {
      const S = {
        $flags$: $[0],
        $tagName$: $[1],
        $members$: $[2],
        $listeners$: $[3]
      };
      S.$members$ = $[2];
      const C = S.$tagName$, V = class extends HTMLElement {
        // StencilLazyHost
        constructor(K) {
          super(K), K = this, YA(K, S), S.$flags$ & 1 && K.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : Ye.jmp(() => VA(this));
        }
        disconnectedCallback() {
          Ye.jmp(() => qA(this));
        }
        componentOnReady() {
          return Yi(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !s.includes(C) && !o.get(C) && (i.push(C), o.define(C, Ug(
        V,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + AA, u.setAttribute("data-styles", "");
    const p = (n = Ye.$nonce$) !== null && n !== void 0 ? n : Lg(sr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((p) => p.connectedCallback()) : Ye.jmp(() => l = setTimeout(Pg, 30)), r();
}, af = /* @__PURE__ */ new WeakMap(), Yi = (t) => af.get(t), XA = (t, e) => af.set(e.$lazyInstance$ = t, e), YA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], af.set(t, n);
}, ah = (t, e) => e in t, Ao = (t, e) => (0, console.error)(t, e), Yc = /* @__PURE__ */ new Map(), ZA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = Yc.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (Yc.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => $$).then(o, Ao);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (Yc.set(i, o), o[r]), Ao);
}, Ga = /* @__PURE__ */ new Map(), Ec = typeof window < "u" ? window : {}, sr = Ec.document || { head: {} }, Ye = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Hg = (t) => Promise.resolve(t), QA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ch = [], Og = [], JA = (t, e) => (n) => {
  t.push(n), Yl || (Yl = !0, Ye.$flags$ & 4 ? cf(Ql) : Ye.raf(Ql));
}, lh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ao(n);
    }
  t.length = 0;
}, Ql = () => {
  lh(ch), lh(Og), (Yl = ch.length > 0) && Ye.raf(Ql);
}, cf = (t) => Hg().then(t), t4 = /* @__PURE__ */ JA(Og), e4 = () => Hg(), n4 = (t, e) => typeof window > "u" ? Promise.resolve() : e4().then(() => WA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var r4 = Object.defineProperty, s4 = Object.defineProperties, i4 = Object.getOwnPropertyDescriptors, Ka = Object.getOwnPropertySymbols, Dg = Object.prototype.hasOwnProperty, Fg = Object.prototype.propertyIsEnumerable, uh = (t, e, n) => e in t ? r4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, An = (t, e) => {
  for (var n in e || (e = {})) Dg.call(e, n) && uh(t, n, e[n]);
  if (Ka) for (var n of Ka(e)) Fg.call(e, n) && uh(t, n, e[n]);
  return t;
}, Gn = (t, e) => s4(t, i4(e)), jg = (t, e) => {
  var n = {};
  for (var r in t) Dg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ka) for (var r of Ka(t)) e.indexOf(r) < 0 && Fg.call(t, r) && (n[r] = t[r]);
  return n;
};
function zg() {
  return gc(Ds()) || window.StacksProvider || window.BlockstackProvider;
}
function Ac(t) {
  return t ? typeof t == "string" ? js.fromName(t) : "version" in t ? t : "url" in t ? new kl({ url: t.url }) : t.transactionVersion === Rs.Mainnet ? new kl({ url: t.client.baseUrl }) : new Il({ url: t.client.baseUrl }) : new Il();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var o4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(o4 || {}), a4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(a4 || {}), lf = (t) => {
  let e = t;
  if (!e) {
    let n = new m0(["store_write"], document.location.href);
    e = new $l({ appConfig: n });
  }
  return e;
};
function Rg(t) {
  try {
    return lf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Gg = (t) => {
  let e = lf(t).loadUserData().appPrivateKey, n = We.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function c4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [zs.Mainnet]: "mainnet", [zs.Testnet]: "testnet" }, a = Ac(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function l4(t) {
  let e = Ac(t.network), n = lf(t.userSession), r = Gn(An({}, t), { network: e, userSession: n });
  return An({ stxAddress: c4(r) }, r);
}
async function u4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(gg) : n = n.map((r) => bt($g(r)))), new We.TokenSigner("ES256k", e).signAsync(Gn(An({}, t), { postConditions: n }));
}
function f4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(gg) : e = e.map((n) => bt($g(n)))), We.createUnsecuredToken(Gn(An({}, t), { postConditions: e }));
}
var d4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Wt(a.replace(/^0x/, "")), u = nE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Gn(An({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, Gn(An({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, h4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = jg(e, ["amount", "appDetails", "userSession"]);
  if (Rg(i)) {
    let { privateKey: a, publicKey: c } = Gg(i), u = Gn(An({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), u4(u, a);
  }
  let o = Gn(An({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), f4(o);
};
async function p4(t, e, n) {
  let r = await e(Gn(An(An({}, l4(t)), t), { network: Ac(t.network) }));
  return d4({ token: r, options: t }, n);
}
function g4(t, e = zg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return p4(t, h4, e);
}
function Kg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Gn(An({}, t), { message: Od(e), domain: Od(n) }) : Gn(An({}, t), { message: bt(Ks(e)), domain: bt(Ks(n)) });
}
async function y4(t, e) {
  return new We.TokenSigner("ES256k", e).signAsync(Kg(t));
}
async function w4(t) {
  let e = t, { userSession: n } = e, r = jg(e, ["userSession"]);
  if (Rg(n)) {
    let { privateKey: i, publicKey: s } = Gg(n), o = Gn(An({}, r), { publicKey: s });
    return y4(o, i);
  }
  return We.createUnsecuredToken(Kg(t));
}
var b4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(b4 || {}), Vg = "asigna-stx", fh = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === Vg && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(x4(t, e), "*");
}), m4 = { authenticationRequest: async (t) => fh(t, "authenticationRequest"), transactionRequest: async (t) => fh(t, "transactionRequest") }, x4 = (t, e) => ({ source: Vg, [e]: t }), S4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = m4);
};
S4();
var E4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function A4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Ds(), o = zg();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    n4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : E4, c = px(a), u = document.createElement("connect-modal");
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
var la = A4(g4);
function gs(t, e, n) {
  return uf(nn(t, e), n);
}
function nn(t, e) {
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
      const r = k4(BigInt(`0x${Ft(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ft(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function dh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ho(t, e = 8) {
  return (typeof t == "bigint" ? t : nn(t, !1)).toString(16).padStart(e * 2, "0");
}
function vc(t) {
  return parseInt(t, 16);
}
function uf(t, e = 16) {
  const n = Ho(t, e);
  return we(n);
}
function v4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function $4(t, e) {
  return t & BigInt(1) << e;
}
function k4(t, e) {
  return $4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const I4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ft(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += I4[n];
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
function Zi(t) {
  return new TextEncoder().encode(t);
}
function ff(t) {
  return new TextDecoder().decode(t);
}
function qg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function L4(t) {
  return String.fromCharCode.apply(null, t);
}
function C4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function hh(t) {
  if (t.some(C4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $c(...t) {
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
function He(t) {
  return $c(...t.map((e) => typeof e == "number" ? hh([e]) : e instanceof Array ? hh(e) : e));
}
var ph;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(yh || (yh = {}));
const Wg = 33, Zc = 32;
function T4(t) {
  if (t.length < Zc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Zc * 2), r = t.slice(2 + Zc * 2);
  return {
    recoveryId: vc(e),
    r: n,
    s: r
  };
}
function B4(t) {
  const e = typeof t == "string" ? we(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function M4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function N4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function P4(t, e) {
  return t[e];
}
function _4(t, e, n = 0) {
  return t[n] = e, t;
}
function U4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Jl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Jl || (Jl = {}));
const H4 = Jl.Mainnet, O4 = 128, D4 = 128, Xg = 16, Bs = 32, tu = 80, kc = 65, F4 = 32, j4 = 64, Va = 34;
var ht;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ht || (ht = {}));
var Ot;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ot || (Ot = {}));
var eu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(eu || (eu = {}));
var an;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(an || (an = {}));
const $a = ["onChainOnly", "offChainOnly", "any"], wh = {
  [$a[0]]: an.OnChainOnly,
  [$a[1]]: an.OffChainOnly,
  [$a[2]]: an.Any,
  [an.OnChainOnly]: an.OnChainOnly,
  [an.OffChainOnly]: an.OffChainOnly,
  [an.Any]: an.Any
};
function z4(t) {
  if (t in wh)
    return wh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${$a.join(", ")}`);
}
var qa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qa || (qa = {}));
qa.Mainnet;
var ji;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(ji || (ji = {}));
var cn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(cn || (cn = {}));
var Ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ce || (Ce = {}));
var se;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(se || (se = {}));
var Wa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Wa || (Wa = {}));
var Ee;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ee || (Ee = {}));
var vo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(vo || (vo = {}));
var nu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(nu || (nu = {}));
var $o;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($o || ($o = {}));
var bh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(bh || (bh = {}));
var mh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(mh || (mh = {}));
function ru(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function R4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Yg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function G4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ru(t.outputLen), ru(t.blockLen);
}
function K4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function V4(t, e) {
  Yg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ks = {
  number: ru,
  bool: R4,
  bytes: Yg,
  hash: G4,
  exists: K4,
  output: V4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Zn = (t, e) => t << 32 - e | t >>> e, q4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!q4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function W4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function df(t) {
  if (typeof t == "string" && (t = W4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Zg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ii(t) {
  const e = (r) => t().update(df(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function X4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class hf extends Zg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qc(this.buffer);
  }
  update(e) {
    ks.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = df(e);
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
    ks.exists(this), ks.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    X4(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Qc(e), c = this.outputLen;
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
const Y4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Qg = Uint8Array.from({ length: 16 }, (t, e) => e), Z4 = Qg.map((t) => (9 * t + 5) % 16);
let pf = [Qg], gf = [Z4];
for (let t = 0; t < 4; t++)
  for (let e of [pf, gf])
    e.push(e[t].map((n) => Y4[n]));
const Jg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Q4 = pf.map((t, e) => t.map((n) => Jg[e][n])), J4 = gf.map((t, e) => t.map((n) => Jg[e][n])), tv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ev = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ua = (t, e) => t << e | t >>> 32 - e;
function xh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fa = new Uint32Array(16);
class nv extends hf {
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
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const $ = 4 - p, S = tv[p], C = ev[p], V = pf[p], K = gf[p], E = Q4[p], M = J4[p];
      for (let T = 0; T < 16; T++) {
        const et = ua(r + xh(p, s, a, u) + fa[V[T]] + S, E[T]) + l | 0;
        r = l, l = u, u = ua(a, 10) | 0, a = s, s = et;
      }
      for (let T = 0; T < 16; T++) {
        const et = ua(i + xh($, o, c, d) + fa[K[T]] + C, M[T]) + y | 0;
        i = y, y = d, d = ua(c, 10) | 0, c = o, o = et;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    fa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const rv = ii(() => new nv()), sv = (t, e, n) => t & e ^ ~t & n, iv = (t, e, n) => t & e ^ t & n ^ e & n, ov = new Uint32Array([
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
]), ns = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), rs = new Uint32Array(64);
class ty extends hf {
  constructor() {
    super(64, 32, 8, !1), this.A = ns[0] | 0, this.B = ns[1] | 0, this.C = ns[2] | 0, this.D = ns[3] | 0, this.E = ns[4] | 0, this.F = ns[5] | 0, this.G = ns[6] | 0, this.H = ns[7] | 0;
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
      rs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = rs[l - 15], p = rs[l - 2], $ = Zn(y, 7) ^ Zn(y, 18) ^ y >>> 3, S = Zn(p, 17) ^ Zn(p, 19) ^ p >>> 10;
      rs[l] = S + rs[l - 7] + $ + rs[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), p = d + y + sv(a, c, u) + ov[l] + rs[l] | 0, S = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + iv(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class av extends ty {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const yf = ii(() => new ty());
ii(() => new av());
const da = BigInt(2 ** 32 - 1), su = BigInt(32);
function ey(t, e = !1) {
  return e ? { h: Number(t & da), l: Number(t >> su & da) } : { h: Number(t >> su & da) | 0, l: Number(t & da) | 0 };
}
function cv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = ey(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const lv = (t, e) => BigInt(t >>> 0) << su | BigInt(e >>> 0), uv = (t, e, n) => t >>> n, fv = (t, e, n) => t << 32 - n | e >>> n, dv = (t, e, n) => t >>> n | e << 32 - n, hv = (t, e, n) => t << 32 - n | e >>> n, pv = (t, e, n) => t << 64 - n | e >>> n - 32, gv = (t, e, n) => t >>> n - 32 | e << 64 - n, yv = (t, e) => e, wv = (t, e) => t, bv = (t, e, n) => t << n | e >>> 32 - n, mv = (t, e, n) => e << n | t >>> 32 - n, xv = (t, e, n) => e << n - 32 | t >>> 64 - n, Sv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ev(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Av = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), vv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $v = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), kv = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Iv = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Lv = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: ey,
  split: cv,
  toBig: lv,
  shrSH: uv,
  shrSL: fv,
  rotrSH: dv,
  rotrSL: hv,
  rotrBH: pv,
  rotrBL: gv,
  rotr32H: yv,
  rotr32L: wv,
  rotlSH: bv,
  rotlSL: mv,
  rotlBH: xv,
  rotlBL: Sv,
  add: Ev,
  add3L: Av,
  add3H: vv,
  add4L: $v,
  add4H: kv,
  add5H: Lv,
  add5L: Iv
}, [Cv, Tv] = _t.split([
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
].map((t) => BigInt(t))), ss = new Uint32Array(80), is = new Uint32Array(80);
class Ic extends hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: $, Hh: S, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, $, S, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = $ | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ss[E] = e.getUint32(n), is[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const M = ss[E - 15] | 0, T = is[E - 15] | 0, et = _t.rotrSH(M, T, 1) ^ _t.rotrSH(M, T, 8) ^ _t.shrSH(M, T, 7), W = _t.rotrSL(M, T, 1) ^ _t.rotrSL(M, T, 8) ^ _t.shrSL(M, T, 7), R = ss[E - 2] | 0, q = is[E - 2] | 0, v = _t.rotrSH(R, q, 19) ^ _t.rotrBH(R, q, 61) ^ _t.shrSH(R, q, 6), B = _t.rotrSL(R, q, 19) ^ _t.rotrBL(R, q, 61) ^ _t.shrSL(R, q, 6), m = _t.add4L(W, B, is[E - 7], is[E - 16]), P = _t.add4H(m, et, v, ss[E - 7], ss[E - 16]);
      ss[E] = P | 0, is[E] = m | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: $, Gh: S, Gl: C, Hh: V, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const M = _t.rotrSH(l, y, 14) ^ _t.rotrSH(l, y, 18) ^ _t.rotrBH(l, y, 41), T = _t.rotrSL(l, y, 14) ^ _t.rotrSL(l, y, 18) ^ _t.rotrBL(l, y, 41), et = l & p ^ ~l & S, W = y & $ ^ ~y & C, R = _t.add5L(K, T, W, Tv[E], is[E]), q = _t.add5H(R, V, M, et, Cv[E], ss[E]), v = R | 0, B = _t.rotrSH(r, i, 28) ^ _t.rotrBH(r, i, 34) ^ _t.rotrBH(r, i, 39), m = _t.rotrSL(r, i, 28) ^ _t.rotrBL(r, i, 34) ^ _t.rotrBL(r, i, 39), P = r & s ^ r & a ^ s & a, nt = i & o ^ i & c ^ o & c;
      V = S | 0, K = C | 0, S = p | 0, C = $ | 0, p = l | 0, $ = y | 0, { h: l, l: y } = _t.add(u | 0, d | 0, q | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const X = _t.add3L(v, m, nt);
      r = _t.add3H(X, q, B, P), i = X | 0;
    }
    ({ h: r, l: i } = _t.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = _t.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = _t.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: $ } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, $ | 0), { h: S, l: C } = _t.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: V, l: K } = _t.add(this.Hh | 0, this.Hl | 0, V | 0, K | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, $, S, C, V, K);
  }
  roundClean() {
    ss.fill(0), is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Bv extends Ic {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Mv extends Ic {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Nv extends Ic {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ii(() => new Ic());
ii(() => new Bv());
const Pv = ii(() => new Mv());
ii(() => new Nv());
function ny(t) {
  if (we(t).byteLength != kc)
    throw Error("Invalid signature");
  return {
    type: ht.MessageSignature,
    data: t
  };
}
function lo(t, e) {
  return { type: ht.Address, version: t, hash160: e };
}
function vi(t) {
  return ni.c32address(t.version, t.hash160);
}
function qs(t, e, n) {
  const r = e || 1, i = n || O4;
  if (my(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: ht.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function wf(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: ht.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function _v(t) {
  if (t.type === Z.PrincipalStandard)
    return vi(t.address);
  if (t.type === Z.PrincipalContract)
    return `${vi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function ry(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Ov(e, n);
  } else
    return Uv(t);
}
function Uv(t) {
  const e = wf(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Hv(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function Ov(t, e) {
  const n = wf(t), r = qs(e);
  return sy(n, r);
}
function sy(t, e) {
  if (Zi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function Jc(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${Ft(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return er(t.value);
    case Z.ResponseErr:
      return er(t.value);
    case Z.ResponseOk:
      return er(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return _v(t);
    case Z.List:
      return t.list.map((r) => er(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = er(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function er(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: cs(t), value: Jc(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: cs(t), value: Jc(t, !0), success: !0 };
    default:
      return { type: cs(t), value: Jc(t, !0) };
  }
}
function cs(t) {
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
      return `(optional ${cs(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${cs(t.value)})`;
    case Z.ResponseOk:
      return `(response ${cs(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? cs(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${cs(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${qg(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${Zi(t.data).length})`;
  }
}
const iy = () => ({ type: Z.BoolTrue }), oy = () => ({ type: Z.BoolFalse }), Dv = (t) => t ? iy() : oy(), Sh = BigInt("0xffffffffffffffffffffffffffffffff"), Fv = BigInt(0), Eh = BigInt("0x7fffffffffffffffffffffffffffffff"), Ah = BigInt("-170141183460469231731687303715884105728"), jv = (t) => {
  const e = nn(t, !0);
  if (e > Eh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Eh}`);
  if (e < Ah)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ah}`);
  return { type: Z.Int, value: e };
}, ir = (t) => {
  const e = nn(t, !1);
  if (e < Fv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Sh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Sh}`);
  return { type: Z.UInt, value: e };
}, ay = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function cy() {
  return { type: Z.OptionalNone };
}
function ly(t) {
  return { type: Z.OptionalSome, value: t };
}
function zv(t) {
  return { type: Z.ResponseErr, value: t };
}
function Rv(t) {
  return { type: Z.ResponseOk, value: t };
}
function Gv(t) {
  return { type: Z.List, list: t };
}
function Ws(t) {
  for (const e in t)
    if (!N8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const qe = (t) => ({ type: Z.StringASCII, data: t }), Kv = (t) => ({ type: Z.StringUTF8, data: t });
class uy extends Zg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ks.hash(e);
    const r = df(n);
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
    return ks.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ks.exists(this), ks.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const fy = (t, e, n) => new uy(t, e).update(n).digest();
fy.create = (t, e) => new uy(t, e);
Te.hmacSha256Sync = (t, ...e) => {
  const n = fy.create(yf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function zi(t) {
  return {
    type: ht.PublicKey,
    data: we(t)
  };
}
function Vv(t, e, n = Ee.Compressed) {
  const r = T4(e.data), i = new Sn(dh(r.r), dh(r.s)), s = Dt.fromSignature(t, i, r.recoveryId), o = n === Ee.Compressed;
  return s.toHex(o);
}
function qv(t) {
  return { type: ht.PublicKey, data: t };
}
function Qi(t) {
  return !Ft(t.data).startsWith("04");
}
function Xa(t) {
  return t.data.slice();
}
function Wv(t) {
  const e = Zv(t), n = Mo(e.data.slice(0, 32), e.compressed);
  return zi(Ft(n));
}
function Xv(t) {
  const e = typeof t == "string" ? t : Ft(t), n = Dt.fromHex(e).toHex(!0);
  return zi(n);
}
function Yv(t) {
  const e = typeof t == "string" ? t : Ft(t), n = Dt.fromHex(e).toHex(!1);
  return zi(n);
}
function iu(t) {
  const e = t.readUInt8(), n = e === 4 ? j4 : F4;
  return qv(He([e, t.readBytes(n)]));
}
function Zv(t) {
  const e = B4(t), n = e.length == Wg;
  return { data: e, compressed: n };
}
function Qv(t, e) {
  const [n, r] = ic(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Ho(r, 1) + Sn.fromHex(n).toCompactHex();
  return ny(s);
}
function Jv(t) {
  return Wv(t.data);
}
function t8(t, e, n) {
  return typeof t == "string" && (t = ry(t)), typeof n == "string" && (n = kh(n)), {
    type: ht.Payload,
    payloadType: Ot.TokenTransfer,
    recipient: t,
    amount: nn(e, !1),
    memo: n ?? kh("")
  };
}
function e8(t, e, n, r) {
  return typeof t == "string" && (t = wf(t)), typeof e == "string" && (e = qs(e)), typeof n == "string" && (n = qs(n)), {
    type: ht.Payload,
    payloadType: Ot.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function vh(t, e, n) {
  return typeof t == "string" && (t = qs(t)), typeof e == "string" && (e = u8(e)), typeof n == "number" ? {
    type: ht.Payload,
    payloadType: Ot.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ht.Payload,
    payloadType: Ot.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function n8() {
  return { type: ht.Payload, payloadType: Ot.PoisonMicroblock };
}
function $h(t, e) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  return e != null ? {
    type: ht.Payload,
    payloadType: Ot.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ht.Payload,
    payloadType: Ot.Coinbase,
    coinbaseBytes: t
  };
}
function r8(t, e, n) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  if (n.byteLength != tu)
    throw Error(`VRF proof buffer size must be ${tu} bytes`);
  return {
    type: ht.Payload,
    payloadType: Ot.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ou;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ou || (ou = {}));
function s8(t, e, n, r, i, s, o) {
  return {
    type: ht.Payload,
    payloadType: Ot.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function dy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ot.TokenTransfer:
      e.push(_e(t.recipient)), e.push(gs(t.amount, !1, 8)), e.push(Er(t.memo));
      break;
    case Ot.ContractCall:
      e.push(Er(t.contractAddress)), e.push(Er(t.contractName)), e.push(Er(t.functionName));
      const n = new Uint8Array(4);
      Vs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(_e(r));
      });
      break;
    case Ot.SmartContract:
      e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case Ot.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case Ot.PoisonMicroblock:
      break;
    case Ot.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ot.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient));
      break;
    case Ot.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient ? ly(t.recipient) : cy())), e.push(t.vrfProof);
      break;
    case Ot.TenureChange:
      e.push(we(t.tenureHash)), e.push(we(t.previousTenureHash)), e.push(we(t.burnViewHash)), e.push(we(t.previousTenureEnd)), e.push(Vs(new Uint8Array(4), t.previousTenureBlocks)), e.push(_4(new Uint8Array(1), t.cause)), e.push(we(t.publicKeyHash));
      break;
  }
  return He(e);
}
function i8(t) {
  switch (t.readUInt8Enum(Ot, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ot.TokenTransfer:
      const n = Mn(t), r = nn(t.readBytes(8), !1), i = py(t);
      return t8(n, r, i);
    case Ot.ContractCall:
      const s = Ri(t), o = Bn(t), a = Bn(t), c = [], u = t.readUInt32BE();
      for (let E = 0; E < u; E++) {
        const M = Mn(t);
        c.push(M);
      }
      return e8(s, o, a, c);
    case Ot.SmartContract:
      const d = Bn(t), l = Bn(t, 4, 1e5);
      return vh(d, l);
    case Ot.VersionedSmartContract: {
      const E = t.readUInt8Enum(eu, (et) => {
        throw new Error(`Cannot recognize ClarityVersion: ${et}`);
      }), M = Bn(t), T = Bn(t, 4, 1e5);
      return vh(M, T, E);
    }
    case Ot.PoisonMicroblock:
      return n8();
    case Ot.Coinbase: {
      const E = t.readBytes(Bs);
      return $h(E);
    }
    case Ot.CoinbaseToAltRecipient: {
      const E = t.readBytes(Bs), M = Mn(t);
      return $h(E, M);
    }
    case Ot.NakamotoCoinbase: {
      const E = t.readBytes(Bs), M = Mn(t), T = t.readBytes(tu);
      return r8(E, M, T);
    }
    case Ot.TenureChange:
      const y = Ft(t.readBytes(20)), p = Ft(t.readBytes(20)), $ = Ft(t.readBytes(20)), S = Ft(t.readBytes(32)), C = t.readUInt32BE(), V = t.readUInt8Enum(ou, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), K = Ft(t.readBytes(20));
      return s8(y, p, $, S, C, V, K);
  }
}
class Lc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ss extends Lc {
  constructor(e) {
    super(e);
  }
}
class xn extends Lc {
  constructor(e) {
    super(e);
  }
}
class Ya extends Lc {
  constructor(e) {
    super(e);
  }
}
class Is extends Lc {
  constructor(e) {
    super(e);
  }
}
var jn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(jn || (jn = {}));
function au(t) {
  return ny(Ft(t.readBytes(kc)));
}
function $i(t, e) {
  return {
    pubKeyEncoding: t,
    type: ht.TransactionAuthField,
    contents: e
  };
}
function o8(t) {
  const e = t.readUInt8Enum(jn, (n) => {
    throw new xn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case jn.PublicKeyCompressed:
      return $i(Ee.Compressed, iu(t));
    case jn.PublicKeyUncompressed:
      return $i(Ee.Uncompressed, Yv(iu(t).data));
    case jn.SignatureCompressed:
      return $i(Ee.Compressed, au(t));
    case jn.SignatureUncompressed:
      return $i(Ee.Uncompressed, au(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function bf(t) {
  return we(t.data);
}
function a8(t) {
  const e = [];
  switch (t.contents.type) {
    case ht.PublicKey:
      e.push(t.pubKeyEncoding === Ee.Compressed ? jn.PublicKeyCompressed : jn.PublicKeyUncompressed), e.push(Xa(Xv(t.contents.data)));
      break;
    case ht.MessageSignature:
      e.push(t.pubKeyEncoding === Ee.Compressed ? jn.SignatureCompressed : jn.SignatureUncompressed), e.push(bf(t.contents));
      break;
  }
  return He(e);
}
function Er(t) {
  switch (t.type) {
    case ht.Address:
      return Oo(t);
    case ht.Principal:
      return hy(t);
    case ht.LengthPrefixedString:
      return Gi(t);
    case ht.MemoString:
      return f8(t);
    case ht.AssetInfo:
      return gy(t);
    case ht.PostCondition:
      return d8(t);
    case ht.PublicKey:
      return Xa(t);
    case ht.LengthPrefixedList:
      return Sf(t);
    case ht.Payload:
      return dy(t);
    case ht.TransactionAuthField:
      return a8(t);
    case ht.MessageSignature:
      return bf(t);
  }
}
function c8() {
  return {
    type: ht.Address,
    version: Wa.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function mf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === se.SerializeP2PKH || e === se.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === se.SerializeP2WPKH || e === se.SerializeP2WSH || e === se.SerializeP2WSHNonSequential) && !r.every(Qi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case se.SerializeP2PKH:
      return lo(t, C8(r[0].data));
    case se.SerializeP2WPKH:
      return lo(t, T8(r[0].data));
    case se.SerializeP2SH:
    case se.SerializeP2SHNonSequential:
      return lo(t, B8(n, r.map(Xa)));
    case se.SerializeP2WSH:
    case se.SerializeP2WSHNonSequential:
      return lo(t, M8(n, r.map(Xa)));
  }
}
function Oo(t) {
  const e = [];
  return e.push(we(Ho(t.version, 1))), e.push(we(t.hash160)), He(e);
}
function Ri(t) {
  const e = vc(Ft(t.readBytes(1))), n = Ft(t.readBytes(20));
  return { type: ht.Address, version: e, hash160: n };
}
function hy(t) {
  const e = [];
  return e.push(t.prefix), e.push(Oo(t.address)), t.prefix === $o.Contract && e.push(Gi(t.contractName)), He(e);
}
function l8(t) {
  const e = t.readUInt8Enum($o, (i) => {
    throw new xn(`Unexpected Principal payload type: ${i}`);
  }), n = Ri(t);
  if (e === $o.Standard)
    return { type: ht.Principal, prefix: e, address: n };
  const r = Bn(t);
  return {
    type: ht.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Gi(t) {
  const e = [], n = Zi(t.content), r = n.byteLength;
  return e.push(we(Ho(r, t.lengthPrefixBytes))), e.push(n), He(e);
}
function Bn(t, e, n) {
  e = e || 1;
  const r = vc(Ft(t.readBytes(e))), i = ff(t.readBytes(r));
  return qs(i, e, n ?? 128);
}
function u8(t) {
  return qs(t, 4, 1e5);
}
function kh(t) {
  if (t && my(t, Va))
    throw new Error(`Memo exceeds maximum length of ${Va} bytes`);
  return { type: ht.MemoString, content: t };
}
function f8(t) {
  const e = [], n = Zi(t.content), r = L8(Ft(n), Va * 2);
  return e.push(we(r)), He(e);
}
function py(t) {
  let e = ff(t.readBytes(Va));
  return e = e.replace(/\u0000*$/, ""), { type: ht.MemoString, content: e };
}
function gy(t) {
  const e = [];
  return e.push(Oo(t.address)), e.push(Gi(t.contractName)), e.push(Gi(t.assetName)), He(e);
}
function cu(t) {
  return {
    type: ht.AssetInfo,
    address: Ri(t),
    contractName: Bn(t),
    assetName: Bn(t)
  };
}
function xf(t, e) {
  return {
    type: ht.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Sf(t) {
  const e = t.values, n = [];
  n.push(we(Ho(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Er(r));
  return He(n);
}
function yy(t, e, n) {
  const r = vc(Ft(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case ht.Address:
        i.push(Ri(t));
        break;
      case ht.LengthPrefixedString:
        i.push(Bn(t));
        break;
      case ht.MemoString:
        i.push(py(t));
        break;
      case ht.AssetInfo:
        i.push(cu(t));
        break;
      case ht.PostCondition:
        i.push(h8(t));
        break;
      case ht.PublicKey:
        i.push(iu(t));
        break;
      case ht.TransactionAuthField:
        i.push(o8(t));
        break;
    }
  return xf(i, n);
}
function d8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(hy(t.principal)), (t.conditionType === cn.Fungible || t.conditionType === cn.NonFungible) && e.push(gy(t.assetInfo)), t.conditionType === cn.NonFungible && e.push(_e(t.assetName)), e.push(t.conditionCode), t.conditionType === cn.STX || t.conditionType === cn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ss("The post-condition amount may not be larger than 8 bytes");
    e.push(gs(t.amount, !1, 8));
  }
  return He(e);
}
function h8(t) {
  const e = t.readUInt8Enum(cn, (o) => {
    throw new xn(`Could not read ${o} as PostConditionType`);
  }), n = l8(t);
  let r, i, s;
  switch (e) {
    case cn.STX:
      return r = t.readUInt8Enum(vo, (a) => {
        throw new xn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Ft(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: cn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case cn.Fungible:
      return i = cu(t), r = t.readUInt8Enum(vo, (a) => {
        throw new xn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Ft(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: cn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case cn.NonFungible:
      i = cu(t);
      const o = Mn(t);
      return r = t.readUInt8Enum(nu, (a) => {
        throw new xn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ht.PostCondition,
        conditionType: cn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function ur(t, e) {
  return He([t, e]);
}
function p8(t) {
  return new Uint8Array([t.type]);
}
function g8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : ur(t.type, _e(t.value));
}
function y8(t) {
  const e = new Uint8Array(4);
  return Vs(e, t.buffer.length, 0), ur(t.type, $c(e, t.buffer));
}
function w8(t) {
  const e = uf(v4(t.value, BigInt(D4)), Xg);
  return ur(t.type, e);
}
function b8(t) {
  const e = uf(t.value, Xg);
  return ur(t.type, e);
}
function m8(t) {
  return ur(t.type, Oo(t.address));
}
function x8(t) {
  return ur(t.type, $c(Oo(t.address), Gi(t.contractName)));
}
function S8(t) {
  return ur(t.type, _e(t.value));
}
function E8(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = _e(r);
    e.push(i);
  }
  return ur(t.type, He(e));
}
function A8(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = qs(i);
    e.push(Gi(s));
    const o = _e(t.data[i]);
    e.push(o);
  }
  return ur(t.type, He(e));
}
function wy(t, e) {
  const n = [], r = e == "ascii" ? qg(t.data) : Zi(t.data), i = new Uint8Array(4);
  return Vs(i, r.length, 0), n.push(i), n.push(r), ur(t.type, He(n));
}
function v8(t) {
  return wy(t, "ascii");
}
function $8(t) {
  return wy(t, "utf8");
}
function _e(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return p8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return g8(t);
    case Z.Buffer:
      return y8(t);
    case Z.UInt:
      return b8(t);
    case Z.Int:
      return w8(t);
    case Z.PrincipalStandard:
      return m8(t);
    case Z.PrincipalContract:
      return x8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return S8(t);
    case Z.List:
      return E8(t);
    case Z.Tuple:
      return A8(t);
    case Z.StringASCII:
      return v8(t);
    case Z.StringUTF8:
      return $8(t);
    default:
      throw new Ss("Unable to serialize. Invalid Clarity Value.");
  }
}
function k8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ih = /* @__PURE__ */ new Map();
function by(t, e) {
  const n = Ih.get(t);
  if (n !== void 0)
    return n(e);
  const r = k8(t);
  return Ih.set(t, r), by(t, e);
}
class go {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return U4(this.readBytes(4), 0);
  }
  readUInt8() {
    return P4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return M4(this.readBytes(2), 0);
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
    if (by(e, r))
      return r;
    throw n(r);
  }
}
function Mn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new go(we(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new go(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new xn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return jv(e.readBytes(16));
    case Z.UInt:
      return ir(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return ay(e.readBytes(r));
    case Z.BoolTrue:
      return iy();
    case Z.BoolFalse:
      return oy();
    case Z.PrincipalStandard:
      const i = Ri(e);
      return Hv(i);
    case Z.PrincipalContract:
      const s = Ri(e), o = Bn(e);
      return sy(s, o);
    case Z.ResponseOk:
      return Rv(Mn(e));
    case Z.ResponseErr:
      return zv(Mn(e));
    case Z.OptionalNone:
      return cy();
    case Z.OptionalSome:
      return ly(Mn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Mn(e));
      return Gv(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let S = 0; S < u; S++) {
        const C = Bn(e).content;
        if (C === void 0)
          throw new xn('"content" is undefined');
        d[C] = Mn(e);
      }
      return Ws(d);
    case Z.StringASCII:
      const l = e.readUInt32BE(), y = L4(e.readBytes(l));
      return qe(y);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), $ = ff(e.readBytes(p));
      return Kv($);
    default:
      throw new xn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const I8 = (t) => t.length % 2 == 0 ? t : `0${t}`, L8 = (t, e) => t.padEnd(e, "0"), my = (t, e) => t ? Zi(t).length > e : !1;
function lu(t) {
  return Op(t);
}
const ko = (t) => rv(yf(t)), Ef = (t) => Ft(Pv(t)), C8 = (t) => Ft(ko(t)), T8 = (t) => {
  const e = ko(t), n = $c(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ko(n);
  return Ft(r);
}, B8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), i = ko(r);
  return Ft(i);
}, M8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), i = yf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = He(s), a = ko(o);
  return Ft(a);
};
function N8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function xy(t) {
  const e = _e(t);
  return `0x${Ft(e)}`;
}
function P8(t) {
  return Mn(t);
}
const Ii = (t) => {
  try {
    return ni.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Af() {
  return {
    type: ht.MessageSignature,
    data: Ft(new Uint8Array(kc))
  };
}
function Sy(t, e, n, r) {
  const i = mf(0, t, 1, [zi(e)]).hash160, s = Qi(zi(e)) ? Ee.Compressed : Ee.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: nn(n, !1),
    fee: nn(r, !1),
    keyEncoding: s,
    signature: Af()
  };
}
function Io(t) {
  return "signature" in t;
}
function Lh(t) {
  return t === se.SerializeP2SH || t === se.SerializeP2WSH;
}
function _8(t) {
  return t === se.SerializeP2SHNonSequential || t === se.SerializeP2WSHNonSequential;
}
function Ch(t) {
  const e = lu(t);
  return e.nonce = 0, e.fee = 0, Io(e) ? e.signature = Af() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function U8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    gs(t.nonce, !1, 8),
    gs(t.fee, !1, 8),
    t.keyEncoding,
    bf(t.signature)
  ];
  return He(e);
}
function H8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    gs(t.nonce, !1, 8),
    gs(t.fee, !1, 8)
  ], n = xf(t.fields);
  e.push(Sf(n));
  const r = new Uint8Array(2);
  return N4(r, t.signaturesRequired, 0), e.push(r), He(e);
}
function O8(t, e) {
  const n = Ft(e.readBytes(20)), r = BigInt(`0x${Ft(e.readBytes(8))}`), i = BigInt(`0x${Ft(e.readBytes(8))}`), s = e.readUInt8Enum(Ee, (a) => {
    throw new xn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === se.SerializeP2WPKH && s != Ee.Compressed)
    throw new xn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = au(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function D8(t, e) {
  const n = Ft(e.readBytes(20)), r = BigInt("0x" + Ft(e.readBytes(8))), i = BigInt("0x" + Ft(e.readBytes(8))), s = yy(e, ht.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case ht.PublicKey:
        Qi(u.contents) || (o = !0);
        break;
      case ht.MessageSignature:
        if (u.pubKeyEncoding === Ee.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Is("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === se.SerializeP2WSH || t === se.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function tl(t) {
  return Io(t) ? U8(t) : H8(t);
}
function el(t) {
  const e = t.readUInt8Enum(se, (n) => {
    throw new xn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === se.SerializeP2PKH || e === se.SerializeP2WPKH ? O8(e, t) : D8(e, t);
}
function Ey(t, e, n, r) {
  const s = t + Ft(new Uint8Array([e])) + Ft(gs(n, !1, 8)) + Ft(gs(r, !1, 8));
  if (we(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ef(we(s));
}
function Ay(t, e, n) {
  const r = 33 + kc, i = Qi(e) ? Ee.Compressed : Ee.Uncompressed, s = t + I8(i.toString(16)) + n.data, o = we(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ef(o);
}
function F8(t, e, n, r, i) {
  const s = Ey(t, e, n, r), o = Qv(i, s), a = Jv(i), c = Ay(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function vy(t, e, n, r, i, s) {
  const o = Ey(t, e, n, r), a = zi(Vv(o, s, i)), c = Ay(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function j8() {
  const t = Sy(se.SerializeP2PKH, "", 0, 0);
  return t.signer = c8().hash160, t.keyEncoding = Ee.Compressed, t.signature = Af(), t;
}
function Th(t, e, n) {
  return Io(t) ? z8(t, e, n) : R8(t, e, n);
}
function z8(t, e, n) {
  const { pubKey: r, nextSigHash: i } = vy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = mf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function R8(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ht.PublicKey:
        Qi(c.contents) || (s = !0), r.push(c.contents);
        break;
      case ht.MessageSignature:
        c.pubKeyEncoding === Ee.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = vy(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Lh(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new Is("Too many signatures");
        break;
    }
  if (Lh(t.hashMode) && o !== t.signaturesRequired || _8(t.hashMode) && o < t.signaturesRequired)
    throw new Is("Incorrect number of signatures");
  if (s && (t.hashMode === se.SerializeP2WSH || t.hashMode === se.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  const a = mf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function $y(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function ky(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Sy(se.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Bh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return $y(Ch(t.spendingCondition));
      case Ce.Sponsored:
        return ky(Ch(t.spendingCondition), j8());
      default:
        throw new Ya("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function G8(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return Th(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return Th(t.spendingCondition, e, Ce.Standard);
    default:
      throw new Ya("Invalid origin auth type");
  }
}
function K8(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: nn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: nn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function V8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: nn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function q8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: nn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function W8(t, e) {
  const n = {
    ...e,
    nonce: nn(e.nonce, !1),
    fee: nn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function X8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ce.Standard:
      e.push(tl(t.spendingCondition));
      break;
    case Ce.Sponsored:
      e.push(tl(t.spendingCondition)), e.push(tl(t.sponsorSpendingCondition));
      break;
  }
  return He(e);
}
function Y8(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new xn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = el(t), $y(n);
    case Ce.Sponsored:
      n = el(t);
      const r = el(t);
      return ky(n, r);
  }
}
class Z8 {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: nn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? H4, this.postConditionMode = s ?? ji.Deny, this.postConditions = i ?? xf([]), o)
      this.anchorMode = z4(o);
    else
      switch (r.payloadType) {
        case Ot.Coinbase:
        case Ot.CoinbaseToAltRecipient:
        case Ot.NakamotoCoinbase:
        case Ot.PoisonMicroblock:
        case Ot.TenureChange:
          this.anchorMode = an.OnChainOnly;
          break;
        case Ot.ContractCall:
        case Ot.SmartContract:
        case Ot.VersionedSmartContract:
        case Ot.TokenTransfer:
          this.anchorMode = an.Any;
          break;
      }
  }
  signBegin() {
    const e = lu(this);
    return e.auth = Bh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = lu(this);
    return e.auth = Bh(e.auth), e.txid();
  }
  verifyOrigin() {
    return G8(this.auth, this.verifyBegin());
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
    if (n && !Io(n)) {
      const r = Qi(e);
      n.fields.push($i(r ? Ee.Compressed : Ee.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = F8(n, r, e.fee, e.nonce, i);
    return Io(e) ? e.signature = s : e.fields.push($i(i.data.byteLength === Wg ? Ee.Compressed : Ee.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return Ef(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Ya("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W8(this.auth, e);
  }
  setFee(e) {
    this.auth = K8(this.auth, e);
  }
  setNonce(e) {
    this.auth = V8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Ya("Cannot sponsor sign a non-sponsored transaction");
    this.auth = q8(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ss('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ss('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ss('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ss('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ss('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Vs(n, this.chainId, 0), e.push(n), e.push(X8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Sf(this.postConditions)), e.push(dy(this.payload)), He(e);
  }
}
function Za(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new go(we(t.slice(2))) : e = new go(we(t)) : t instanceof Uint8Array ? e = new go(t) : e = t;
  const n = e.readUInt8Enum(qa, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = Y8(e), s = e.readUInt8Enum(an, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(ji, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = yy(e, ht.PostCondition), c = i8(e);
  return new Z8(n, i, c, a, o, s, r);
}
const Q8 = Dv, yo = ir, J8 = ay;
const t5 = /* @__PURE__ */ new Set([4001, -31001]), e5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], n5 = ["result", "data", "payload", "response", "params"], Mh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Cc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), oi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, $r = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, r5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Iy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => r5(s, r)) === i
  );
}, Ly = (t) => t ? Iy(oi()).some(
  (e) => {
    var n;
    return e.id === t && (Cc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Cy = () => {
  if (typeof window > "u")
    return;
  const t = oi(), e = Iy(t).filter(
    (n) => {
      var r;
      return Cc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = $r(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of e5) {
    const r = $r(t, n) ?? (t === window ? void 0 : $r(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, s5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = oi(), n = $r(e, t) ?? (e === window ? void 0 : $r(window, t)) ?? gc(t);
  if (n)
    return n;
  if (Cc(t) || Ly(t))
    return Cy();
}, ha = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, i5 = ["blockstack-session", "blockstack"], o5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of i5) {
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
o5();
const Ty = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, bn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, a5 = (t) => {
  const e = bn(t);
  if (!e)
    return null;
  const n = Ty(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, c5 = (t) => {
  const e = bn(t);
  if (!e)
    return null;
  const n = Ty(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, uu = (t, e = "mainnet") => {
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
      return uu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return uu(r, e);
  }
  return e;
}, Ms = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Lo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return Ii(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = Lo(i, e + 1);
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
    const s = Lo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && Ii(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ii(n.testnet) ? n.testnet.trim() : null;
}, Nh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, By = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && t5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Xs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = bn(n == null ? void 0 : n.message) ?? bn(e.message) ?? bn(e.error) ?? bn(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, Ki = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Xs(e);
    if (e.status === "error")
      throw Xs(e.result ?? e);
  }
  return t;
}, Ph = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Ki(r);
  } catch (r) {
    throw Xs(r);
  }
}, My = () => Cy(), vf = () => {
  if (typeof window > "u")
    return;
  const t = oi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = $r(t, e) ?? (t === window ? void 0 : $r(window, e));
    if (n)
      return n;
  }
}, _h = () => {
  if (typeof window > "u")
    return;
  const t = vf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = oi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = $r(e, n) ?? (e === window ? void 0 : $r(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ka = (t) => {
  var r, i;
  const e = Ds();
  if (Cc(e) || Ly(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = oi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === My();
}, nl = (t) => {
  const e = c5(t);
  if (!e)
    return null;
  try {
    const n = Za(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Qa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = nl(t), r = a5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? bn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Qa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of Mh)
    if (nl(i[a])) {
      s = bn(i[a]);
      break;
    }
  const o = bn(i.txId) || bn(i.txid) || bn(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? bn(i.txRaw) ?? void 0
    };
  for (const a of Mh) {
    const c = nl(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: bn(i[a]) ?? void 0
      };
  }
  for (const a of n5) {
    const c = i[a], u = Qa(c, e + 1);
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
}, rl = (t) => {
  const e = Qa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, l5 = (t) => {
  const e = Qa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, u5 = (t) => ({
  ...t,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored === !0
}), Uh = (t) => ({
  recipient: t.recipient,
  amount: Ms(t.amount) ?? "0",
  memo: t.memo,
  network: uu(t.network),
  address: t.stxAddress,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ny = "WALLET_ADDRESS_MISMATCH", f5 = 45e3;
let wo = null;
const fu = (t) => {
  t && (wo = { address: t, at: Date.now() });
}, d5 = () => {
  wo = null;
}, h5 = () => wo && Date.now() - wo.at <= f5 ? wo.address : null, p5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, g5 = async (t) => {
  d5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Ki(await t.request("wallet_connect")), n = Lo(e);
  return fu(n), n;
}, y5 = async (t, e, n, r) => {
  try {
    return Ki(await t.request(e, n));
  } catch (i) {
    const s = Xs(i);
    if (!p5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await g5(t);
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
        { code: o ? Ny : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Ki(await t.request(e, n));
    } catch (a) {
      throw Xs(a);
    }
  }
};
let Hh = 3e4;
const w5 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Hh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Hh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, b5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ny }
      );
    return c;
  }, i = h5();
  if (i)
    return ha(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  ha(n, "account-read");
  try {
    const c = Ki(
      await w5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Lo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (By(c))
      throw Xs(c);
    ha(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return fu(s), r(s, "wallet_getAccount");
  let o;
  ha(n, "account-reconnect");
  try {
    o = Ki(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Xs(c);
  }
  const a = Lo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return fu(a), r(a, "wallet_connect");
}, m5 = async (t, e) => {
  if (!ka(t)) {
    const s = await Ph(
      t,
      "stx_transferStx",
      Uh(e)
    );
    return rl(s);
  }
  const n = vf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Ph(
      n,
      "stx_transferStx",
      Uh(e)
    );
    return rl(s);
  }
  const r = My();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await b5(r, e.stxAddress);
  const i = await y5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ms(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ms(e.fee) } : {}
    },
    e.stxAddress
  );
  return rl(i);
}, x5 = () => Ds(), Py = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Ds(), e = t ? s5(t) : void 0;
  if (e)
    return e;
  const n = oi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Oh = (t, e) => {
  const n = Py(), r = u5({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, l5(i));
    }
  });
  if (!n || typeof n.request != "function")
    return la(r, e);
  if (ka(n) && !vf()) {
    const i = _h();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ds(),
        route: "legacy-transaction-request"
      }), la(r, i);
  }
  return void m5(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Nh(i) && ka(n)) {
      const a = _h();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ds(),
          route: "legacy-transaction-request"
        }), la(r, a);
        return;
      }
    }
    if (Nh(i) && !ka(n)) {
      la(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), By(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Dh = (t) => xy(t).replace(/^0x/, ""), Fh = "This wallet cannot sign messages. Try Xverse or Leather.", jh = (t) => typeof (t == null ? void 0 : t.request) == "function", zh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", S5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, E5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function A5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Dh(e.message),
    domain: Dh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function v5(t, e) {
  const n = await w4({
    domain: e.domain,
    message: e.message,
    network: Ac(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Rh(t) {
  var i, s;
  const e = x5() || "", n = /xverse/i.test(e);
  let r = Py();
  if (n && !zh(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (zh(r))
    try {
      return await v5(r, t);
    } catch (o) {
      if (n || !jh(r) || !E5(o)) throw o;
    }
  if (!n && jh(r))
    try {
      return await A5(r, t);
    } catch (o) {
      throw S5(o) ? new Error(Fh) : o;
    }
  throw new Error(Fh);
}
const Gh = 1000000n, Ls = 1000000n, Ja = 50n, ze = 3000n, ai = 300n, io = 3000n, $5 = 50000n, sl = 200n, Tc = 15000n, mn = (t) => t + Ja;
function Qn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Gh}.${(n % Gh).toString().padStart(6, "0")}`;
}
function Kh(t, e = ai) {
  return t <= ze ? 0 : Number((t - ze) / mn(e));
}
function il(t, e = 0n) {
  const n = Ls - t - e;
  return n > 0n ? n : 0n;
}
function k5(t, e = ai) {
  return t > Ls ? "over" : t < ze + mn(e) ? "empty" : t < $5 ? "low" : "ok";
}
const I5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", L5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", C5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function T5(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || C5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== I5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const _y = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", ol = 3, B5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [du, Uy] = _y.split("."), Ln = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function hu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function M5(t) {
  return Ln(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function hs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Hy(t, e = []) {
  const n = await hs(`/v2/contracts/call-read/${du}/${Uy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: du, arguments: e.map((r) => "0x" + Ln(_e(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return er(Mn(n.result));
}
async function N5() {
  const t = await hs(`/v2/contracts/source/${du}/${Uy}?proof=0`);
  if (typeof t.source != "string" || await M5(t.source) !== L5) throw Error("Deployed source does not match the tested helper.");
  if (T5(await Hy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Oy(t) {
  return t.startsWith("SP") && Ii(t) && !t.includes(".");
}
async function P5(t) {
  var r;
  if (!Oy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await hs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function _5(t) {
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function U5(t, e) {
  var i, s;
  const n = await Hy("get-owner", [yo(t), yo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Oy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function H5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: hu(t), signal: AbortSignal.timeout(15e3) });
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
async function O5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function D5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Za(hu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || vi(lo(Wa.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || vi(r.contractAddress) + "." + r.contractName.content !== _y || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Ln(_e(r.functionArgs[0])) !== Ln(_e(yo(t.core))) || Ln(_e(r.functionArgs[1])) !== Ln(_e(yo(t.song))) || Ln(_e(r.functionArgs[2])) !== Ln(_e(J8(hu(t.id)))) || t.amount !== "50" || e.postConditionMode !== ji.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== vo.Equal || s.principal.prefix !== 2 || vi(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || vi(r.contractAddress) + "." + r.contractName.content !== B5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Ln(_e(r.functionArgs[0])) !== Ln(_e(yo(t.song))) || typeof t.liked != "boolean" || Ln(_e(r.functionArgs[1])) !== Ln(_e(Q8(t.liked))) || t.amount !== "0" || e.postConditionMode !== ji.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || er(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const F5 = "xtrata.xyz/radio/listening-wallet", j5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Ys = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ii(t), z5 = (t) => ({
  domain: Ws({ name: qe(F5), version: qe("1"), "chain-id": ir(1) }),
  message: Ws({
    purpose: qe(j5),
    main: qe(t.main),
    listening: qe(t.listening),
    issued: ir(t.issued)
  })
}), Dy = 100000n, R5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function G5(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Ys(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= Dy).sort(R5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const pa = 50;
function tc(t) {
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
async function K5(t, e, n = 4) {
  if (!Ys(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${pa}&offset=${o}`, i = tc(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - pa);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= pa ? i : tc(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = G5(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - pa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const mr = 50, V5 = 6, q5 = 20, Vh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function qh(t, e) {
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
async function W5(t, e, n) {
  if (!Ys(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = tc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${mr}&offset=0`));
    if (!i || i.total > V5 * mr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = mr; o < i.total; o += mr) {
      const a = tc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${mr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${mr}&offset=${u}`, a = qh(await e(o(0)), t);
      if (!a || a.total > q5 * mr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = mr; u < a.total; u += mr) {
        const d = qh(await e(o(u)), t);
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
function X5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Vh).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : Ys(l.sender) && p >= Dy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), s = i.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Ys(l.recipient) && l.amount > 0n).sort(Vh), a = o.reduce((l, y) => l + y.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let p = y;
    for (const $ of l) {
      if (p <= 0n) break;
      const S = $.left < p ? $.left : p;
      $.left -= S, p -= S;
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
function Y5(t, e) {
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
function Wh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Ia = [100, 250, 500], Z5 = (t, e) => BigInt(t) * mn(e), oo = ["prepared", "signed", "unknown", "pending"], Q5 = 30 * 6e4, Xh = 6e4, wi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, J5 = 3e3, Yh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", al = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function t6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, p = null, $ = !1, S = "", C = "", V = 0, K, E = null, M, T = [], et, W = -1 / 0;
  const R = /* @__PURE__ */ new Set();
  let q = null, v = !1, B = 0, m = null, P = null, nt = !1, X = null, Vt = !1, yt = null, Be = !1, I = !1, U = !1, dt = !1, x = !1, N = 0, tt = null, H = Promise.resolve();
  const at = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ai.toString()), st = (w) => !!s && !(s.features ?? []).includes(w), St = (w, k) => `xtrata.ppp.v1.${w}:${k}`, Ut = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const k = JSON.parse(t.store.get(St("entries", w)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, Ct = (w) => {
    const k = [w, ...Ut(w.address).filter((z) => !(z.txid === w.txid && z.kind === w.kind))].slice(0, 200);
    t.store.set(St("entries", w.address), JSON.stringify(k));
  }, Yt = (w = s == null ? void 0 : s.address) => !!w && t.store.get(St("on", w)) !== "0", jt = (w) => {
    s != null && s.address && t.store.set(St("on", s.address), w ? "1" : "0");
  }, $t = () => Ut().filter((w) => oo.includes(w.status)), ie = () => ut() ? [...$t(), ...Ut(qt()).filter((w) => oo.includes(w.status))] : $t(), be = () => ee(s == null ? void 0 : s.address), ee = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(St("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, ue = (w, k = s == null ? void 0 : s.address) => {
    k && t.store.set(St("deposit", k), JSON.stringify(w));
  };
  let kt = null;
  const ae = (w = Xh) => {
    const k = t.now();
    kt = { since: kt && k < kt.until ? kt.since : k, until: Math.max((kt == null ? void 0 : kt.until) ?? 0, k + w) };
  }, ce = () => !!kt && t.now() < kt.until && (o === void 0 || o < ze + mn(at())), me = () => !!be() || ce(), qt = () => st("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), ut = () => !!(s != null && s.address) && qt() !== s.address, Me = () => ut() ? c && c.for === qt() ? c.value : void 0 : o, Ne = (w) => w !== void 0 && w < ze + sl, un = () => $t().filter((w) => t.now() - w.created > Q5 && R.has(w.txid)), Nn = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), A = () => Nn() && !(s != null && s.linked), D = () => {
    const w = t.main();
    return !A() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, F = (w) => St("return-to", w), G = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const k = t.store.get(F(w));
    return k && Ys(k) && k !== w ? k : void 0;
  }, pt = (w = s == null ? void 0 : s.address) => q && q.for === w ? q.res : null;
  function At() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = G();
    if (w) return { to: w, kind: "chosen" };
    const k = pt();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const le = (w) => St("gift", w);
  function It() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((X == null ? void 0 : X.for) === w) return X.info;
    try {
      const k = JSON.parse(t.store.get(le(w)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  async function fe() {
    var gt;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((gt = e == null ? void 0 : e.gifts) != null && gt.enabled) || Vt) return;
    const k = (X == null ? void 0 : X.for) === w ? X : null, z = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && t.now() - k.at < z) return;
    Vt = !0;
    const rt = It();
    try {
      const j = await t.giftInfo(w);
      X = { for: w, info: j, ok: !0, at: t.now() }, t.store.set(le(w), JSON.stringify(j));
    } catch {
      X = { for: w, info: rt, ok: !1, at: t.now() };
    } finally {
      Vt = !1;
    }
  }
  const Ae = () => Ut().reduce((w, k) => oo.includes(k.status) ? w + BigInt(k.amount || "0") + BigInt(k.fee || "0") : w, 0n);
  function ve() {
    if (o === void 0) return 0;
    const w = o - Ae() - BigInt(ke.length) * mn(at());
    return w > 0n ? Kh(w, at()) : 0;
  }
  const xe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", zt = "EMPTY — ADD STX TO PLAY";
  function h() {
    var z;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((z = It()) != null && z.player) && !w) return null;
    const k = (rt, gt) => ({ reason: rt, text: gt });
    switch (Rt()) {
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
        return me() ? k("arriving", "YOUR PLAYS ARE ARRIVING") : k("out", ut() ? xe : zt);
      case "ready":
        return !Yt() || !(s != null && s.session) || s.session.playsLeft < 1 ? k("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : U ? ve() < 1 ? k("out", ut() ? xe : zt) : null : k("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const b = () => {
    var w;
    return !!(s != null && s.address) && ut() && !!((w = It()) != null && w.player);
  };
  function f() {
    return b() ? { locked: !0, known: !0 } : null;
  }
  const _ = 3 * 6e4, Q = () => !!It() && !!t.history && !(s != null && s.linked);
  async function ct() {
    const w = s.address, k = It(), { balance: z, nonce: rt } = await t.chain.account(w), gt = await t.history(w, !0);
    if (!gt.ok) return null;
    const j = X5({ self: w, balance: z, inbound: gt.inbound, outgoing: gt.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!j.ok) return null;
    const Et = Y5(j.parts, io);
    return { balance: z, nonce: rt, parts: j.parts, steps: Et.steps, tooSmall: Et.tooSmall.length };
  }
  const mt = () => Be ? { state: "unavailable" } : !yt || t.now() - yt.at > _ || o !== void 0 && o !== yt.balance ? { state: "none" } : yt.plan;
  function Rt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!A()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : D() ? "wrong-wallet" : s.state === "known" ? "locked" : !A() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > Ls ? "over" : o < ze + mn(at()) ? "fund" : "ready" : "loading";
  }
  const Oe = () => {
    var w, k, z, rt, gt;
    return {
      step: Rt(),
      busy: u,
      message: S,
      error: C,
      notice: Qt(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : k5(o, at()),
      playsLeft: o === void 0 ? 0 : Kh(o, at()),
      allowance: o === void 0 ? Ls : il(o, BigInt(((w = be()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: Yt(),
      entries: Ut(),
      depositTxid: ((k = be()) == null ? void 0 : k.txid) ?? K,
      depositPending: me(),
      arrival: me() ? { since: ((z = be()) == null ? void 0 : z.at) ?? (kt == null ? void 0 : kt.since) ?? t.now(), graceMs: Xh } : null,
      walletOutdated: st("like"),
      linkedListening: et && et === t.main() ? T.map((j) => j.listening) : [],
      serverLinked: !!E && M === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: un().length,
      armed: dt,
      queued: ke.length,
      solo: A(),
      returnTo: (rt = At()) == null ? void 0 : rt.to,
      returnToKind: (gt = At()) == null ? void 0 : gt.kind,
      funderState: (() => {
        const j = pt();
        return j ? j.ok ? j.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const j = pt();
        return !!j && j.ok && j.distinct > 1;
      })(),
      walletCannotSolo: A() && st("standalone"),
      walletCannotMulti: st("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((j) => j !== t.main() && j !== (s == null ? void 0 : s.linked)),
      creditedTo: A() && (s != null && s.address) && (m == null ? void 0 : m.for) === s.address && m.main ? m.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(St("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (P == null ? void 0 : P.for) === s.address && P.unused,
      gift: (() => {
        const j = It();
        return j ? { player: j.player, from: j.from, source: j.source, amount: j.amount } : null;
      })(),
      giftPlays: It() ? ve() : 0,
      playCost: mn(at()),
      giftStop: h(),
      albumLock: f(),
      returnPlan: mt(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: st("slots"),
      likeFunds: (() => {
        var vt;
        const j = qt();
        if (!j || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const Et = Me();
        return { address: j, balance: Et, low: Ne(Et), album: ut(), pending: !!ee(j), txid: (vt = ee(j)) == null ? void 0 : vt.txid, main: t.main() };
      })()
    };
  }, Qt = () => V ? V < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Ht = (w, k = "") => {
    S = w, C = k, t.changed();
  };
  async function $e(w, k) {
    if (!u) {
      u = w, C = "", t.changed();
      try {
        await k();
      } catch (z) {
        const rt = z instanceof Error ? z.message : String(z);
        C = /Cancelled in the listening wallet/.test(rt) ? "" : rt, C || (S = "Not now. Nothing was signed.", x = !0);
      } finally {
        u = null, await kn(!0);
      }
    }
  }
  const fn = () => !!(e != null && e.enabled) && e.here && (A() || !!t.main() && e.allowed), Pn = () => fn() && !D(), De = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", de = () => {
    if (D()) throw new Error(De());
  };
  async function vn() {
    if (!fn()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const wt = (w) => {
    const k = t.main();
    return w.request("listening.status", k ? { main: k } : void 0);
  };
  async function Xt(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await he(w)));
  }
  async function he(w = !1) {
    const k = qt();
    if (!(!ut() || !k || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === k && t.now() - c.at < 3e4))
      try {
        c = { for: k, value: await t.chain.balance(k), at: t.now() };
      } catch {
      }
  }
  async function $n(w) {
    if ((et !== w || t.now() - W >= 6e4) && (T = await t.links(w), et = w, W = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const k = `${w}:${s.address}`;
    M === k && E || (E = T.find((z) => z.listening === s.address) ?? null, M = k);
  }
  async function _n() {
    const w = s == null ? void 0 : s.address;
    if (!A() || !w || s != null && s.linked || !t.funder || v || !o || o <= 0n) return;
    const k = pt(w);
    if (k != null && k.ok && k.funder) return;
    const z = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, B - 1), 30 * 6e4);
    if (!(q && q.for === w && t.now() - q.at < z)) {
      v = !0;
      try {
        q = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        q = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        v = !1;
      }
      B = q.res.ok ? 0 : B + 1;
    }
  }
  async function Ji() {
    const w = s == null ? void 0 : s.address;
    if (!(!A() || !w || s != null && s.linked || !t.mainOf || nt) && !(m && m.for === w && (m.ok || t.now() - m.at < 6e4))) {
      nt = !0;
      try {
        m = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        m = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        nt = !1;
      }
    }
  }
  async function ci() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (P == null ? void 0 : P.for) === w) && t.store.get(St("created", w)) !== "1")
      try {
        P = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Cr() {
    var gt;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let k, z = !1;
    const rt = /* @__PURE__ */ new Map();
    for (const j of ie())
      try {
        const Et = await t.chain.transaction(j.txid);
        if (!Et) {
          if (R.add(j.txid), t.now() - j.created > 15 * 6e4 && !rt.has(j.address) && rt.set(j.address, await t.chain.confirmedNonce(j.address)), k = rt.get(j.address), k !== void 0 && k > BigInt(j.nonce)) {
            Ct({ ...j, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((j.status === "unknown" || j.status === "signed") && j.raw)
            try {
              await t.chain.broadcast(j.raw, j.txid), Ct({ ...j, status: "pending" });
            } catch (Lt) {
              wi(Lt) && Ct({ ...j, status: "failed", note: Lt.message, raw: void 0 });
            }
          continue;
        }
        R.delete(j.txid);
        const vt = String(Et.tx_status);
        if (vt === "success" && Et.canonical !== !1 && Et.is_unanchored === !1) {
          if (Ct({ ...j, status: "confirmed", confirmedAt: t.now(), actualFee: String(Et.fee_rate ?? j.fee), raw: void 0 }), z = !0, j.kind === "like" && ($ = !0, j.status !== "confirmed" && typeof j.liked == "boolean"))
            try {
              (gt = t.likeConfirmed) == null || gt.call(t, j.song, j.liked);
            } catch {
            }
        } else vt.startsWith("abort_") || vt.startsWith("dropped_") ? Ct({ ...j, status: "failed", note: vt, raw: void 0 }) : j.status !== "pending" && Ct({ ...j, status: "pending" });
      } catch {
      }
    for (const j of ut() ? [w, qt()] : [w]) {
      const Et = ee(j);
      if (Et)
        try {
          const vt = await t.chain.transaction(Et.txid), Lt = String((vt == null ? void 0 : vt.tx_status) ?? "");
          (Lt === "success" && vt.is_unanchored === !1 || Lt.startsWith("abort_") || Lt.startsWith("dropped_") || !vt && t.now() - Et.at > 2 * 36e5) && (ue(null, j), Lt === "success" && ae(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return z;
  }
  async function kn(w = !1) {
    var k;
    try {
      const z = t.main();
      if ((w || !e || r !== z || t.now() - n > 3e5) && (e = await t.config(z), n = t.now(), r = z), !e.enabled || !e.here || !A() && (!z || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), dt && Kn(), t.changed();
        return;
      }
      await vn(), s = await wt(i), D() && s.state === "unlocked" && (yr(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await wt(i)), z && e.allowed && await $n(z), await Xt(w), await _n(), await Ji(), await ci(), await fe(), await Cr() && await Xt(!0), await he(), await ui(), V = 0;
    } catch {
      V++;
    }
    if (Rt() === "locked" ? Tr() : dt && Kn(), $) {
      $ = !1;
      try {
        (k = t.likesChanged) == null || k.call(t);
      } catch {
      }
    }
    t.changed(), ke.length && !gr && Ur();
  }
  async function li(w) {
    const k = s == null ? void 0 : s.root;
    if (!k || s != null && s.slot || !(s != null && s.address) || st("slots")) return;
    const z = Number(t.store.get(St("slot", k)));
    if (!(!Number.isSafeInteger(z) || z < 1))
      try {
        const { balance: rt } = await t.chain.account(s.address);
        if (rt >= ze + mn(at())) return;
        await w.request("listening.openSlot", { slot: z }), s = await wt(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function dn(w, k) {
    var j;
    de();
    const z = !(s != null && s.address) || Yt(s.address), rt = s != null && s.linked ? (j = t.nameOf) == null ? void 0 : j.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: z ? Un() : void 0, anyPasskey: k, ...t.main() ? { main: t.main() } : {}, ...rt ? { label: rt } : {} }), s = await wt(w), z && (Yt(s.address) ? await fr() : await w.request("listening.stop")), await li(w), Ht(z ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const gt = p;
    p = null, gt && t.now() - gt.at < 12e4 && setTimeout(() => void kn(!0).then(() => pe(gt)), 0);
  }
  function Tr() {
    dt || u || x || N >= 3 || !i || !(s != null && s.address) || (dt = !0, H = (async () => {
      try {
        await dn(i, !1), N = 0;
      } catch (w) {
        const k = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(k) ? tt || (x = !0, Ht("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (N++, C = k);
      } finally {
        dt = !1;
        const w = tt;
        tt = null, w ? await w() : await kn(!0);
      }
    })());
  }
  async function Kn(w) {
    dt && (tt = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await H), w && await w(), t.changed();
  }
  const Un = () => ({
    fee: at().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ls.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function fr() {
    if (!(s != null && s.address)) return !1;
    if (U || (U = await t.tabLock(s.address)), !U)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Br(w, k) {
    const z = s.address, { balance: rt, nonce: gt } = k ?? await t.chain.account(z);
    o = rt;
    const j = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: rt.toString(),
      nonce: gt.toString(),
      fee: io.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (j.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const Et = w.mode === "amount" ? w.amount : w.mode === "all" ? rt - io : rt - Ls - io, vt = Za(j.raw);
    if (er(vt.payload.recipient).value !== w.to || String(vt.payload.amount) !== j.amount || Et !== void 0 && j.amount !== Et.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Lt = {
      id: al(),
      address: z,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: j.recipient,
      amount: j.amount,
      fee: j.fee,
      nonce: gt.toString(),
      created: t.now(),
      status: "signed",
      raw: j.raw,
      txid: j.txid
    };
    t.validate(Lt), Ct(Lt);
    try {
      await t.chain.broadcast(j.raw, j.txid), Ct({ ...Lt, status: "pending" });
    } catch (Jt) {
      throw Ct({ ...Lt, status: "unknown", note: Jt.message }), Jt;
    }
    return j;
  }
  const ws = Tc, dr = io;
  async function hr(w, k, z) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (st("slots") || st("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const rt = s.slot ?? 0;
    if (w === k || ![w, k].includes(rt) || ![w, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const gt = s.root ?? s.address, j = w === 0 ? gt : s.address, Et = k === 0 ? gt : s.address, { balance: vt, nonce: Lt } = await t.chain.account(j);
    if (vt < z + dr + ze) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Jt = await i.request("listening.signMove", { from: w, to: k, amount: z.toString(), fee: dr.toString(), nonce: Lt.toString(), balance: vt.toString() }), Ge = Za(Jt.raw);
    if (Jt.from !== j || Jt.to !== Et || Jt.amount !== z.toString() || er(Ge.payload.recipient).value !== Et || String(Ge.payload.amount) !== z.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const hn = {
      id: al(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: Et,
      amount: Jt.amount,
      fee: Jt.fee,
      nonce: Lt.toString(),
      created: t.now(),
      status: "signed",
      raw: Jt.raw,
      txid: Jt.txid
    };
    t.validate(hn), Ct(hn);
    try {
      await t.chain.broadcast(Jt.raw, Jt.txid), Ct({ ...hn, status: "pending" });
    } catch (Pe) {
      throw Ct({ ...hn, status: "unknown", note: Pe.message }), Pe;
    }
    return ue({ txid: Jt.txid, amount: Jt.amount, at: t.now() }, Et), Et === gt && gt !== s.address ? c = null : a = -1 / 0, Jt;
  }
  let Mr = !1;
  const pr = /* @__PURE__ */ new Map(), Nr = (w) => St("float", w);
  async function ui() {
    if (Mr || (s == null ? void 0 : s.state) !== "unlocked" || !ut() || st("move") || st("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(Nr(w)) === "1") return;
    const k = It();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const z = Me();
    if (z === void 0 || o === void 0) return;
    if (!Ne(z)) {
      t.store.set(Nr(w), "1");
      return;
    }
    if (ee(qt()) || _r() || ie().length || o < ws * 4n + ze + dr) return;
    const rt = pr.get(w);
    if (!(rt && (rt.n >= 3 || t.now() - rt.at < 5 * 6e4))) {
      Mr = !0, pr.set(w, { n: ((rt == null ? void 0 : rt.n) ?? 0) + 1, at: t.now() });
      try {
        await hr(s.slot ?? 0, 0, ws), t.store.set(Nr(w), "1");
      } catch (gt) {
        console.warn("[radio] likes float not sent yet", gt);
      } finally {
        Mr = !1;
      }
    }
  }
  async function fi(w) {
    if ($t().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (st("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await ct().catch(() => null);
    if (!k)
      throw yt = null, Be = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Be = !1, o = k.balance;
    const z = { balance: k.balance, nonce: k.nonce };
    if (w === "excess") {
      const vt = Wh(k.parts) ?? G();
      if (!vt) throw new Error("Choose where to send the excess first.");
      await Br({ mode: "excess", to: vt, linked: !1 }, z), yt = null, Ht("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const rt = k.steps;
    if (!rt.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!yt && yt.balance === k.balance && t.now() - yt.at <= _ && yt.steps.length === rt.length && yt.steps.every((vt, Lt) => vt.to === rt[Lt].to && vt.mode === rt[Lt].mode && vt.send === rt[Lt].send))) {
      yt = {
        at: t.now(),
        balance: k.balance,
        steps: rt,
        parts: k.parts,
        plan: { state: "ready", steps: rt.map((vt) => ({ to: vt.to, kind: vt.kind, send: vt.send.toString() })), kept: k.tooSmall, excess: Wh(k.parts) }
      }, Ht(rt.length > 1 ? `This goes back in ${rt.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const j = rt[0], Et = j.to ?? G();
    if (!Et) throw new Error("Choose where to send the rest first.");
    if (j.mode === "amount" && st("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Br({ mode: j.mode, to: Et, linked: !1, ...j.mode === "amount" ? { amount: j.send } : {} }, z), yt = null, rt.length === 1 ? (jt(!1), Ht("Returned ✓ Paying is off.")) : Ht(`Returned ✓ ${rt.length - 1} more ${rt.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const bs = {
    forceRefresh: () => kn(!0),
    create: () => $e("Waiting for your passkey…", async () => {
      const w = await vn();
      await w.request("listening.unlock", { mode: "create", terms: Un(), ...t.main() ? { main: t.main() } : {} }), s = await wt(w), s.address && t.store.set(St("created", s.address), "1"), jt(!0), Ht(A() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await fr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? ae() : kt = null, t.changed();
    },
    giftSent: (w, k) => {
      !(s != null && s.address) || be() || (ue({ txid: w, amount: k.toString(), at: t.now() }), a = -1 / 0, X = null, Ht("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (de(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (st("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await vn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, k, z, rt) => {
      ue({ txid: z, amount: rt.toString(), at: t.now() }, k), X = null, await bs.openAlbum(w), Ht("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => $e("Opening…", async () => {
      if (de(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (st("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      yr(), await i.request("listening.openSlot", { slot: w }), s = await wt(i), o = void 0, a = -1 / 0, yt = null, Be = !1;
      const k = s.root;
      k && w > 0 && t.store.set(St("slot", k), String(w)), Ht(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const k = () => $e("Waiting for your passkey…", async () => dn(await vn(), w));
      return dt ? w ? st("cancel") ? (Ht("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Kn(async () => {
        (Rt() === "locked" || Rt() === "intro") && await k();
      }) : H : k();
    },
    link: () => $e("Sign in your wallet…", async () => {
      de();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const k = (await t.links(w)).find((z) => z.listening === s.address);
      if (k)
        await i.request("listening.link", { main: w, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const z = { main: w, listening: s.address, issued: t.now() }, rt = await t.signWithMain(w, z5(z)), gt = await i.request("listening.link", { main: w, issued: z.issued, mainSignature: rt });
        await t.saveLink({ ...z, mainSignature: rt, listeningSignature: gt.listeningSignature }), W = -1 / 0;
      }
      Ht("Linked ✓");
    }),
    deposit: () => $e("Approve the deposit in your wallet…", async () => {
      de();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (be()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Xt(!0);
      const k = il(o ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      K = await t.deposit(w, s.address, k), K && ue({ txid: K, amount: k.toString(), at: t.now() }), Ht("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => $e("Approve the top-up in your wallet…", async () => {
      de();
      const w = t.main(), k = qt();
      if (!w || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ee(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const z = await t.chain.balance(k);
      ut() ? c = { for: k, value: z, at: t.now() } : (o = z, a = t.now());
      const rt = il(z);
      if (rt <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const gt = await t.deposit(w, k, rt);
      gt && ue({ txid: gt, amount: rt.toString(), at: t.now() }, k), Ht("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => $e("Adding plays…", async () => {
      if (de(), !ut()) throw new Error("Open the album you want to add plays to first.");
      if (!Ia.includes(w)) throw new Error("Choose one of the amounts offered.");
      const k = Z5(w, at());
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (ie().length || be()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await hr(0, s.slot ?? 0, k), Ht("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => $e("Confirm in the listening wallet…", async () => {
      if (!Pn()) throw new Error("Connect your wallet first.");
      await fr(), await i.request("listening.approveSession", Un()), jt(!0), Ht("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => $e("Clearing…", async () => {
      for (const w of un())
        await t.chain.transaction(w.txid) || Ct({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Ht("Cleared ✓");
    }),
    switchOff: () => $e("Switching off…", async () => {
      yr(), await (i == null ? void 0 : i.request("listening.stop")), jt(!1), Ht("Paying is off. Music stays free.");
    }),
    lock: () => $e("Locking…", async () => {
      yr(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, Ht("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const k = String(w ?? "").trim();
      if (!(s != null && s.address)) return Ht("", "Unlock the listening wallet first.");
      if (!Ys(k)) return Ht("", "Enter a standard mainnet address (it starts with SP).");
      if (k === s.address) return Ht("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(F(s.address), k), Ht("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(F(s.address), ""), t.changed();
    },
    returnFunds: (w) => $e("Check the return in the listening wallet…", async () => {
      if (!Pn()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (Q()) return fi(w);
      const k = At();
      if (!k) throw new Error(A() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && st("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if ($t().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Br({ mode: w, to: k.to, linked: k.kind === "linked" }), w === "all" && jt(!1), Ht(w === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ke = [], di = 10, Pr = 30 * 6e4;
  let gr = !1;
  const _r = () => d || !!u || l || y, yr = () => {
    ke.length && (ke.length = 0, t.changed());
  };
  async function hi(w) {
    if (!ke.some((k) => k.id === w.id) && !Ut().some((k) => k.id === w.id) && (ke.push({ ...w, at: t.now() }), ke.length > di && ke.shift()), _r() || $t().length) {
      const k = ke.length;
      S = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ur();
  }
  async function Ur() {
    if (!gr) {
      gr = !0;
      try {
        for (; ke.length; ) {
          for (; ke.length && t.now() - ke[0].at > Pr; ) ke.shift();
          if (!ke.length || _r() || await Y(ke[0]) === "wait") return;
          ke.shift();
        }
      } finally {
        gr = !1, t.changed();
      }
    }
  }
  async function Y(w) {
    var k;
    d = !0;
    try {
      await kn();
      const z = Rt();
      if (z === "loading") return "wait";
      if (z !== "ready" || !Yt() || !(s != null && s.session) || s.session.playsLeft < 1 || !U) return "done";
      if ($t().length) return "wait";
      I || (await t.chain.verify(), I = !0);
      const rt = s.address, { balance: gt, nonce: j } = await t.chain.account(rt);
      o = gt, a = t.now();
      const Et = await t.chain.owner(ol, w.song);
      if (Et === rt || Et === t.main()) return "done";
      const vt = await i.request("listening.signPlay", {
        core: ol,
        song: w.song,
        receipt: w.id,
        fee: at().toString(),
        nonce: j.toString(),
        balance: gt.toString()
      }), Lt = {
        id: w.id,
        address: rt,
        kind: "play",
        core: ol,
        song: w.song,
        recipient: Et,
        amount: "50",
        fee: at().toString(),
        nonce: j.toString(),
        created: t.now(),
        status: "signed",
        raw: vt.raw,
        txid: vt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(Lt), Ct(Lt);
      const Jt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(vt.raw, vt.txid), Ct({ ...Lt, status: "pending" }), S = `♪ Paid ${Jt}`, C = "";
      } catch (Ge) {
        Ct({ ...Lt, status: wi(Ge) ? "failed" : "unknown", note: Ge.message, ...wi(Ge) ? { raw: void 0 } : {} }), C = Ge.message;
      }
      return s = await wt(i), "done";
    } catch (z) {
      const rt = z instanceof Error ? z.message : "payment unavailable";
      return (k = It()) != null && k.player ? (S = "Payment is taking a moment: " + rt, "wait") : (S = "This song played free: " + rt, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function lt(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Rt()) || st("like") ? !1 : (pe(w), !0);
  }
  async function pe(w) {
    const k = w.title ? `“${w.title}”` : `song #${w.song}`, z = (Vn) => {
      var to;
      C = Vn, S = "";
      try {
        (to = t.likeFailed) == null || to.call(t, w.song);
      } catch {
      }
      t.changed();
    }, rt = ut(), gt = Rt(), j = t.main(), Et = rt && (gt === "fund" || gt === "over") ? "ready" : gt, vt = A() ? qt() : j;
    if (Et === "locked") {
      p = { ...w, at: t.now() }, Ht(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (Et === "wrong-wallet") return z(De());
    if (Et === "link") return z("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (A() && st("standalone")) return z("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (Et === "fund") return z("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (Et === "over") return z("Return the excess first: the listening wallet holds more than 1 STX.");
    if (rt) {
      await he(!0);
      const Vn = Me();
      if (Ne(Vn))
        return t.changed(), z(Yh);
    }
    if (Et !== "ready" || !vt) return z("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return z("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!U) return z("Pay-per-play is running in another tab. Like from that tab.");
    const Lt = Ut(qt()).find((Vn) => Vn.kind === "like" && Vn.song === w.song);
    if (Lt && oo.includes(Lt.status))
      return z(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (l) return z("One like at a time: your last one is still being sent.");
    if ((Lt == null ? void 0 : Lt.status) === "confirmed" && t.now() - (Lt.confirmedAt ?? 0) < J5)
      return z(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let Jt;
    y = !0;
    try {
      Jt = t.likeState ? (await t.likeState(vt, w.song)).by : w.likedBy ?? [];
    } catch {
      Jt = w.likedBy;
    } finally {
      y = !1;
    }
    if (!Jt) return z(`Could not check ${k} right now. Try the heart again.`);
    const Ge = qt(), Pe = ((Lt == null ? void 0 : Lt.status) === "confirmed" && typeof Lt.liked == "boolean" && t.now() - (Lt.confirmedAt ?? Lt.created) < 5 * 6e4 ? Lt.liked : void 0) ?? Jt.includes(Ge);
    if (!Pe && Jt.some((Vn) => Vn !== Ge)) return z(A() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${Jt.includes(j) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Fe({ song: w.song, liked: !Pe, title: w.title, artist: w.artist });
  }
  async function Fe(w) {
    var rt, gt, j;
    if (l) {
      Ht("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const k = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, z = t.wait ?? ((Et) => new Promise((vt) => setTimeout(vt, Et)));
    try {
      Ht(`${w.liked ? "Liking" : "Unliking"} ${k}…`);
      const Et = t.now() + 12e4;
      for (; d || (ut() ? Ut(qt()).some((Pe) => oo.includes(Pe.status)) : $t().length); ) {
        if (t.now() > Et) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await z(5e3), await kn(!0);
      }
      if (!ut() && Rt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const vt = qt(), { balance: Lt, nonce: Jt } = await t.chain.account(vt);
      if (ut() ? c = { for: vt, value: Lt, at: t.now() } : (o = Lt, a = t.now()), Ne(Lt)) throw new Error(Yh);
      const Ge = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: sl.toString(),
        nonce: Jt.toString(),
        balance: Lt.toString()
      }), hn = {
        id: al(),
        address: vt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: sl.toString(),
        nonce: Jt.toString(),
        created: t.now(),
        status: "signed",
        raw: Ge.raw,
        txid: Ge.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(hn), Ct(hn);
      try {
        await t.chain.broadcast(Ge.raw, Ge.txid), Ct({ ...hn, status: "pending" }), S = `${w.liked ? "♥ Liked" : "Unliked"} ${k}`, C = "";
        try {
          (rt = t.likeSent) == null || rt.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Pe) {
        if (Ct({ ...hn, status: wi(Pe) ? "failed" : "unknown", note: Pe.message, ...wi(Pe) ? { raw: void 0 } : {} }), C = Pe.message, wi(Pe)) try {
          (gt = t.likeFailed) == null || gt.call(t, w.song);
        } catch {
        }
      }
      s = await wt(i);
    } catch (Et) {
      C = "Like not sent: " + (Et instanceof Error ? Et.message : "the listening wallet is unavailable");
      try {
        (j = t.likeFailed) == null || j.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ur();
    }
  }
  return { snapshot: Oe, refresh: kn, onListened: hi, heart: lt, toggleLike: pe, ...bs };
}
const Fy = ["Connect", "Passkey", "Link & fund", "Listen"], jy = ["Passkey", "Add 1 STX", "Listen"], pu = (t) => t ? jy : Fy;
function e6(t) {
  if (t.solo) return n6(t);
  const e = Fy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function n6(t) {
  const e = jy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function r6(t, e) {
  return !e || e.at >= pu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const s6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function i6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !s6(r.id)));
}
const o6 = {}, a6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, c6 = (t) => {
  const e = o6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, l6 = (t) => `/hiro/${t}`, u6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, f6 = (t) => {
  const e = c6(t);
  if (e)
    return [u6(e)];
  const n = a6[t];
  return typeof window < "u" ? [`${window.location.origin}${l6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, d6 = {}, Zh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, h6 = "xtrata.log.enabled", p6 = "xtrata.log.level", g6 = "xtrata.log.tags", y6 = "xtrata.log.dedupe", ga = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, w6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, b6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, m6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, x6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, S6 = () => {
  const t = d6 ?? {}, e = ga(h6) ?? t.VITE_LOG_ENABLED, n = ga(p6) ?? t.VITE_LOG_LEVEL, r = ga(g6) ?? t.VITE_LOG_TAGS, i = ga(y6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: w6(e),
    level: b6(n) ?? "warn",
    tags: x6(r),
    dedupe: m6(i)
  };
}, E6 = (t, e, n) => !t.enabled || Zh[n] < Zh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), A6 = (t, e, n, r) => {
  const i = S6();
  if (!E6(i, e, t) || $6(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, v6 = /* @__PURE__ */ new Set();
let Qh = null;
const $6 = (t, e, n, r, i) => (Qh !== t && (v6.clear(), Qh = t), !1), k6 = (t, e, n) => A6("debug", t, e, n), I6 = {}, L6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, C6 = (t) => {
  const e = I6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : L6[t];
}, T6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, B6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return T6.test(n) ? n : null;
}, M6 = (t) => t.replace(/\/+$/, ""), N6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Jh = (t) => {
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
}, bi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, P6 = (t) => {
  var c, u;
  let e;
  try {
    e = er(P8(t));
  } catch {
    return null;
  }
  const n = bi(e);
  if (!n || n.success === !1)
    return null;
  const r = bi(n.value), i = bi(r == null ? void 0 : r.value), s = bi(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = Jh((c = bi(s.name)) == null ? void 0 : c.value), a = Jh((u = bi(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : B6(`${o}.${a}`);
}, _6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${M6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [xy(ry(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : P6(s.result);
}, U6 = async (t) => {
  const e = t.address.trim();
  if (!Ii(e))
    return null;
  const n = C6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of f6(t.network))
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
  return k6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: N6(r)
  }), null;
};
function H6(t, e, n = {}) {
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
const t0 = Object.freeze({
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
}), e0 = Object.freeze({ 139: "melophonic" });
function O6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(t0, n) ? t0[n] : Object.hasOwn(e0, n) ? e0[n] : e;
}
const n0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function D6(t, e = "") {
  return Object.hasOwn(n0, String(t)) ? n0[String(t)] : e;
}
const zy = 100000n, $f = 1000000n, ec = 3000n, F6 = (t, e) => `${t}#gift=${e}`, j6 = 100, ya = (t, e = ai) => t <= ze ? 0 : Number((t - ze) / mn(e)), r0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ry = "xtrata.xyz/radio/gifts", cl = j6, z6 = "Create a prefunded Xtrata radio gift batch", R6 = (t) => ({
  domain: Ws({ name: qe(Ry), version: qe("1"), "chain-id": ir(1) }),
  message: Ws({
    purpose: qe(z6),
    creator: qe(t.creator),
    count: ir(t.count),
    amount: ir(BigInt(t.amount)),
    label: qe(t.label),
    issued: ir(t.issued),
    ...t.player ? { player: qe(t.player) } : {}
  })
}), G6 = (t, e, n = ai) => ze + BigInt(t) * mn(n) + (e ? Tc : 0n), K6 = (t, e = ai) => Number(($f - ze - (t ? Tc : 0n)) / mn(e)), V6 = (t, e) => BigInt(t) * (e + ec);
function q6(t, e, n, r = ai) {
  const i = n ? Tc : 0n, s = e > ze + i ? e - ze - i : 0n, o = Number(s / mn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Ja,
    fees: BigInt(o) * r,
    reserve: ze,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: ec,
    perCopy: e + ec,
    total: V6(t, e)
  };
}
const W6 = (t) => t >= zy && t <= $f, s0 = 40, X6 = "Create an Xtrata radio gift player", Y6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function i0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && Y6.test(t) : !n;
}
function Z6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!i0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!i0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > s0) throw new Error(`A player holds 1 to ${s0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const Q6 = (t) => op(dp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), J6 = (t) => ({
  domain: Ws({ name: qe(Ry), version: qe("1"), "chain-id": ir(1) }),
  message: Ws({
    purpose: qe(X6),
    admin: qe(t.admin),
    player: qe(t.hash),
    issued: ir(t.issued)
  })
}), Co = (t) => t.tracks.filter((e) => !e.hidden), t$ = (t) => t.tracks.find((e) => e.hidden) ?? null, e$ = [300, 500, 1e3], o0 = 1800, ll = /* @__PURE__ */ new Map();
async function Gy(t) {
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
async function n$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Gy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Ky(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = ll.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      ll.set(t, { ...a, until: Date.now() + o0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ll.delete(t), i();
      }, o0 + 50);
    }
  }, s;
}
const Cs = (t, e, n, r, i) => Ky(t, e, async () => await Gy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), ms = "xtrata.radio.gift.incoming.v1", a0 = (t) => "xtrata.radio.gift.mine.v1:" + t, c0 = (t) => "xtrata.radio.gift.batches.v1:" + t, xt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, xr = (t, e, n = "") => {
  const r = xt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, wa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, gn = (t) => Qn(t).replace(/\.?0+$/, "");
function r$(t) {
  let e = null;
  const n = (A) => [5e3, 1e4, 2e4, 3e4][A] ?? 6e4, r = (() => {
    try {
      const A = new URL(location.href), D = new URLSearchParams(A.hash.slice(1)).get("gift") ?? A.searchParams.get("gift");
      return D !== null && (A.searchParams.delete("gift"), history.replaceState(null, "", A.pathname + (A.search || ""))), r0(D) ? D : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const A = JSON.parse(t.store.get(ms) || "null");
      return r0(A == null ? void 0 : A.code) ? A.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(ms, JSON.stringify({ code: s, at: t.now() }));
    let A = 0;
    const D = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (F) => {
      const G = await F.json().catch(() => ({}));
      if (F.status === 404) {
        t.store.set(ms, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!F.ok) throw new Error("busy");
      const pt = G;
      e = { ...e, view: pt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(pt.status) && t.store.set(ms, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void D(), n(A++)));
    });
    D();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const A = e == null ? void 0 : e.view;
    return !(A != null && A.player) || !o() ? null : { player: A.player, from: u(A), plays: ya(BigInt(A.amount)) };
  }, c = () => {
    e = null, t.store.set(ms, null), t.changed();
  }, u = (A) => A.from ? t.who(A.from) : A.label ? `Xtrata Radio · ${A.label}` : "Xtrata Radio";
  let d = {};
  const l = (A) => {
    if (d.box) return d.box;
    const D = xt("div", "", "ppp-gift-check");
    d.box = D;
    const F = () => {
      const G = window.turnstile;
      !G || d.rendered || (d.rendered = !0, G.render(D, { sitekey: A, callback: (pt) => {
        d.token = pt, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) F();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = F, document.head.append(G);
    }
    return D;
  }, y = (A) => {
    queueMicrotask(() => void A());
  };
  let p;
  async function $(A) {
    var G, pt, At, le, It, fe, Ae, ve, xe;
    if (!e || e.claiming || !A.listening) return;
    const D = !!((G = e.view) != null && G.player);
    if (D && !A.root) return;
    e.claiming = !0, e.error = void 0, (pt = t.claiming) == null || pt.call(t, !0), t.changed();
    const F = async (zt) => {
      const h = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...zt })
      });
      return { res: h, r: await h.json().catch(() => ({})) };
    };
    try {
      let zt = 0, h = A.listening, b;
      if (D) {
        const Q = Number((At = await t.json("/radio/gift/slots?root=" + encodeURIComponent(A.root))) == null ? void 0 : At.next);
        if (!Number.isSafeInteger(Q) || Q < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        zt = Q;
        for (let ct = 0; ; ct++) {
          const mt = await t.album.bind(zt);
          if (h = mt.address, b = await F({ wallet: h, binding: mt }), b.res.status === 409 && /just taken/.test(((le = b.r) == null ? void 0 : le.error) || "") && ct < 5) {
            zt += 1;
            continue;
          }
          break;
        }
      } else b = await F({ wallet: h });
      const { res: f, r: _ } = b;
      if (f.status === 503 && /sending another gift/.test((_ == null ? void 0 : _.error) || "")) {
        e.waiting = !0, (It = t.claiming) == null || It.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!f.ok) {
        const Q = String((_ == null ? void 0 : _.error) || "");
        if (f.status === 404 || f.status === 410 || f.status === 409 && /already had a gift|brand-new/.test(Q))
          throw t.store.set(ms, null), new Error(Q || "This gift cannot be opened.");
        if (f.status === 429 || f.status === 403 || f.status === 400 && !/wallet number/i.test(Q)) throw new Error(Q || `Could not open the gift (${f.status}).`);
        const mt = /topping up/.test(Q) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Q) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Q) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(mt), { retry: !0, slow: /topping up|not paid for yet/.test(Q) });
      }
      e.done = !0, t.store.set(ms, null), D ? await t.album.arrived(zt, h, _.txid, BigInt(_.amount)) : t.giftSent(_.txid, BigInt(_.amount));
    } catch (zt) {
      const h = zt, b = h.name === "TypeError" || h.name === "AbortError" || h.name === "TimeoutError" || /wallet number/i.test(h.message);
      if (h.retry || b) {
        const f = e.tries ?? 0;
        e.tries = f + 1, e.retry = { text: h.retry ? h.message : "Still sending your gift… the network is slow, trying again." }, (fe = t.claiming) == null || fe.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, h.slow ? 6e4 : n(f));
      } else
        e.error = h.message, (Ae = t.claiming) == null || Ae.call(t, !1);
      d.token = void 0;
      try {
        (xe = (ve = window.turnstile) == null ? void 0 : ve.reset) == null || xe.call(ve, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let S = null;
  function C(A) {
    if (!A.listening || !A.depositPending || A.step !== "fund")
      return S = null, [];
    if (!S || S.wallet !== A.listening || t.now() - S.at > 3e4) {
      const F = A.listening;
      S = { ...(S == null ? void 0 : S.wallet) === F ? S : {}, wallet: F, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(F)).then((G) => {
        var pt, At;
        (S == null ? void 0 : S.wallet) === F && (S.state = (pt = G == null ? void 0 : G.gift) == null ? void 0 : pt.state, S.problem = ((At = G == null ? void 0 : G.gift) == null ? void 0 : At.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(S.state === "sending" && S.problem)) return [];
    const D = xt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return D.title = `Network reply: ${S.problem}`, [D];
  }
  function V(A, D, F = !1) {
    var fe, Ae;
    const G = D.player, pt = BigInt(D.amount), At = F ? [] : [xt("p", `🎁 ${u(D)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${Co(G).length} ${Co(G).length === 1 ? "song" : "songs"} and ${ya(pt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!A.root && ["fund", "ready", "over", "link"].includes(A.step)))
      return F || At.push(xt("p", A.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : A.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), At;
    if (A.walletCannotAlbums)
      return At.push(xt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), At;
    const It = (Ae = (fe = A.gate) == null ? void 0 : fe.gifts) == null ? void 0 : Ae.turnstileSiteKey;
    return It && !d.token ? At.push(xt("p", "One quick check and it is yours:", "ppp-mute"), l(It)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => $(A)), At.push(...K(A, "Sending your album…")), At;
  }
  function K(A, D) {
    const F = [];
    return e.claiming || e.waiting ? F.push(xt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : D, "ppp-cyan")) : e.retry && F.push(xt("p", e.retry.text, "ppp-warn"), xr("Try now", () => {
      clearTimeout(p), e.retry = void 0, $(A);
    }, "quiet")), e.error && F.push(xt("p", e.error, "ppp-bad"), xr("Try again", () => {
      e.error = void 0, $(A);
    })), F;
  }
  const E = (A) => {
    var D;
    return !!e && !e.done && !e.error && o() && !!A.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !A.linked && !A.creditedTo && (A.createdHere || A.brandNew || !!((D = e.view) != null && D.player)) && (A.balance ?? 0n) === 0n && !A.entries.length);
  };
  function M(A, D = {}) {
    var xe, zt;
    const F = C(A);
    if (!e || ["off", "elsewhere"].includes(A.step)) return F;
    const G = e.view;
    if (e.error && !G) return [xt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [xt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return F;
    if (G.status === "claimed" || G.status === "claiming") return [xt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [xt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [xt("p", `🎁 ${u(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...V(A, G, !!D.bare), ...F];
    if (!!A.listening && (!(A.createdHere || A.brandNew) || !!A.linked || !!A.creditedTo || (A.balance ?? 0n) > 0n || A.entries.length > 0))
      return [xt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")];
    const At = BigInt(G.amount), le = ya(At).toLocaleString(), fe = [xt(
      "p",
      `🎁 ${u(G)} sent you ${gn(At)} STX of on-chain music: about ${le} paid plays.`,
      "ppp-gift"
    )], Ae = !!A.listening && (A.createdHere || A.brandNew) && !A.linked && !A.creditedTo && A.step === "fund" && (A.balance ?? 1n) === 0n && !A.depositPending && !A.entries.length, ve = (zt = (xe = A.gate) == null ? void 0 : xe.gifts) == null ? void 0 : zt.turnstileSiteKey;
    return Ae ? (ve && !d.token ? fe.push(xt("p", "One quick check and it is yours:", "ppp-mute"), l(ve)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => $(A)), fe.push(...K(A, "Sending your gift…"))) : A.step === "intro" ? fe.push(xt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : A.listening && A.linked ? fe.push(xt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")) : A.listening && (A.balance ?? 0n) > 0n && fe.push(xt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")), fe;
  }
  async function T(A, D, F) {
    var G;
    try {
      const pt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(A));
      if ((G = pt == null ? void 0 : pt.gift) != null && G.returnTo) return { ok: !0, funder: pt.gift.returnTo, txId: pt.gift.txid ?? void 0, amount: pt.gift.amount, distinct: 1 };
    } catch {
      if (F) return { ok: !1 };
    }
    return D();
  }
  const et = xt("div", "", "ppp-gift-fold");
  let W = 250000n, R = "", q = "";
  const v = (A) => {
    try {
      const D = JSON.parse(t.store.get(a0(A)) || "[]");
      return Array.isArray(D) ? D : [];
    } catch {
      return [];
    }
  }, B = (A, D) => t.store.set(a0(A), JSON.stringify(D.slice(0, 50)));
  let m = 0;
  async function P(A) {
    const D = v(A);
    for (const F of D)
      if (!(F.view && ["claimed", "refunded", "expired"].includes(F.view.status)))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: F.id, ...F.txid ? { txid: F.txid } : {} }) }) : await t.json("/radio/gift?id=" + F.id), F.error = void 0;
        } catch (G) {
          F.error = G.message;
        }
    B(A, D), t.changed();
  }
  async function nt(A) {
    if (R) return;
    R = "Starting your gift…", q = "", t.changed();
    let D = null;
    try {
      D = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: A, amount: W.toString() }) });
      const F = v(A);
      F.unshift({ id: D.id, code: D.code, amount: W.toString(), at: t.now() }), B(A, F), R = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay(A, D.depositTo, BigInt(D.deposit), D.memo), pt = v(A), At = pt.find((le) => le.id === D.id);
      At && (At.txid = G, At.view = { status: "pending-deposit", amount: W.toString(), source: "friend", from: A, label: "", expires: 0 }), B(A, pt), q = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", P(A);
    } catch (F) {
      q = F.message || "Not sent.";
    } finally {
      R = "", t.changed();
    }
  }
  const X = (A) => "xtrata.radio.gift.players.v1:" + A, Vt = (A) => {
    try {
      const D = JSON.parse(t.store.get(X(A)) || "[]");
      return Array.isArray(D) ? D.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id)) : [];
    } catch {
      return [];
    }
  };
  async function yt(A, D) {
    var F;
    if (!R) {
      R = "Checking the player…", q = "", t.changed();
      try {
        const G = D.tracks.split(/[\s,]+/).filter(Boolean).map((Ae) => Number(Ae.replace(/^#/, ""))), pt = Z6({ title: D.title.trim(), subtitle: D.subtitle.trim(), tracks: G, cover: (F = D.cover) != null && F.trim() ? Number(D.cover.trim().replace(/^#/, "")) : null });
        R = "Sign in your wallet…", t.changed();
        const At = { admin: A, hash: Q6(pt), issued: t.now() }, le = await t.sign(A, J6(At));
        R = "Making the player…", t.changed();
        const It = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: pt, request: At, signature: le }) }), fe = Vt(A).filter((Ae) => Ae.id !== It.id);
        fe.unshift({ id: It.id, title: It.title, tracks: It.tracks }), t.store.set(X(A), JSON.stringify(fe.slice(0, 30))), q = `${It.existing ? "That player already exists" : "Player made"} ✓ “${It.title}” · ${It.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        q = G.message || "Not made.";
      } finally {
        R = "", t.changed();
      }
    }
  }
  const Be = (A, D) => F6(A || location.origin + "/radio.html", D), I = (A) => n$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: A }), U = (A) => {
    try {
      const D = JSON.parse(t.store.get(c0(A)) || "[]");
      return Array.isArray(D) ? D.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id) && Array.isArray(F.codes)) : [];
    } catch {
      return [];
    }
  }, dt = (A, D) => t.store.set(c0(A), JSON.stringify(D.slice(0, 20))), x = (A) => !!A.view && A.view.status === "live" && A.view.copies.waiting + A.view.copies.claiming + A.view.copies.refunding === 0, N = (A, D) => t.json(A, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(D) });
  let tt = 0;
  async function H(A) {
    const D = U(A);
    for (const F of D)
      if (!x(F))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await N("/radio/gift/batch/confirm", { id: F.id, ...F.txid ? { txid: F.txid } : {} }) : await t.json("/radio/gift/batch?id=" + F.id), F.error = void 0;
        } catch (G) {
          F.error = G.message;
        }
    try {
      const F = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(A));
      for (const G of (F == null ? void 0 : F.batches) ?? []) {
        const pt = D.find((At) => At.id === G.id);
        if (pt) {
          pt.error || (pt.view = G);
          continue;
        }
        D.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    dt(A, D), t.changed();
  }
  async function at(A, D) {
    const F = U(A).find((G) => G.id === D);
    if (!(!F || !F.depositTo || R)) {
      R = "Approve the payment in your wallet…", q = "", t.changed();
      try {
        const G = await t.pay(A, F.depositTo, BigInt(F.deposit), F.memo), pt = U(A), At = pt.find((le) => le.id === D);
        At && (At.txid = G), dt(A, pt), q = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", R = "", H(A);
      } catch (G) {
        q = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        R = "", t.changed();
      }
    }
  }
  async function st(A, D, F, G) {
    if (R) return;
    if (!D.ok) {
      q = D.reason, t.changed();
      return;
    }
    R = "Sign in your wallet…", q = "", t.changed();
    let pt = null;
    try {
      const At = { creator: A, count: D.count, amount: D.amount.toString(), label: F, issued: t.now(), ...G ? { player: G } : {} }, le = await t.sign(A, R6(At));
      R = "Making your links…", t.changed(), pt = await N("/radio/gift/batch", { request: At, signature: le });
      const It = U(A);
      It.unshift({ id: pt.id, codes: pt.codes, count: D.count, amount: pt.amount, label: F, player: G ?? null, depositTo: pt.depositTo, deposit: pt.deposit, memo: pt.memo, at: t.now() }), dt(A, It);
    } catch (At) {
      q = At.message || "Not made.", R = "", t.changed();
      return;
    }
    R = "", t.changed(), await at(A, pt.id);
  }
  function St() {
    const A = !!ce.value, D = me.value === "max" ? K6(A) : Number(me.value), F = G6(D, A), G = Number(qt.value);
    return !Number.isInteger(G) || G < 1 || G > cl ? { ok: !1, reason: `Make 1 to ${cl} copies at a time.`, album: A, plays: D, amount: F, count: G } : W6(F) ? { ok: !0, reason: "", album: A, plays: D, amount: F, count: G, bill: q6(G, F, A) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: A, plays: D, amount: F, count: G };
  }
  const Ut = () => {
    const A = St();
    if (!A.ok) return A.reason;
    const D = A.bill;
    return `Each copy: ${A.plays.toLocaleString()} paid plays (${gn(D.holders)} to song holders, ${gn(D.fees)} network fees)${A.album ? `, ${gn(D.float)} for the album’s likes` : ""}, ${gn(D.reserve)} kept so a listener can return what is left, + ${gn(D.sendFee)} to send it = ${gn(D.perCopy)} STX. ${A.count} copies = ${gn(D.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ct = (A, D) => D.codes.map((F) => Be(A, F)), Yt = xt("input");
  Yt.type = "range", Yt.min = String(zy), Yt.max = String($f), Yt.step = "50000", Yt.value = String(W), Yt.setAttribute("aria-label", "Gift amount");
  const jt = xt("p", "", "ppp-gift-amount"), $t = xr("", () => {
    const A = t.main();
    A && nt(A);
  }, "primary"), ie = () => {
    jt.textContent = be(), $t.textContent = `Gift ${gn(W)} STX`;
  };
  Yt.oninput = () => {
    W = BigInt(Yt.value), ie();
  };
  const be = () => `${gn(W)} STX · about ${ya(W).toLocaleString()} paid plays · you pay ${gn(W + ec)} STX with the network fee`;
  ie();
  const ee = xt("input");
  ee.maxLength = 60, ee.placeholder = "Title, e.g. Proof of Sound", ee.setAttribute("aria-label", "Player title");
  const ue = xt("input");
  ue.maxLength = 80, ue.placeholder = "Artist (optional)", ue.setAttribute("aria-label", "Player subtitle");
  const kt = xt("textarea");
  kt.rows = 3, kt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", kt.setAttribute("aria-label", "Songs");
  const ae = xt("input");
  ae.inputMode = "numeric", ae.placeholder = "Cover inscription number (optional), shown when the album loads", ae.setAttribute("aria-label", "Cover inscription");
  const ce = xt("select");
  ce.setAttribute("aria-label", "Batch album");
  const me = xt("select");
  me.setAttribute("aria-label", "Plays per copy");
  for (const A of e$) me.append(wa(`${A.toLocaleString()} plays`, String(A)));
  me.append(wa("Max (1 STX)", "max"));
  const qt = xt("input");
  qt.type = "number", qt.min = "1", qt.max = String(cl), qt.value = "10", qt.setAttribute("aria-label", "Copies");
  const ut = xt("input");
  ut.maxLength = 40, ut.placeholder = "Label, e.g. Opera launch", ut.setAttribute("aria-label", "Batch label");
  const Me = xt("p", "", "ppp-mute"), Ne = () => {
    Me.textContent = Ut();
  };
  for (const A of [ce, me, qt])
    A.oninput = Ne, A.onchange = Ne;
  Ne();
  function un(A) {
    var pt, At, le, It, fe, Ae;
    const D = (pt = A.gate) == null ? void 0 : pt.gifts;
    if (!(D != null && D.enabled) || ["off", "elsewhere", "unsupported"].includes(A.step)) return null;
    const F = t.main(), G = [xt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!F)
      G.push(xt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      $t.disabled = !!R, G.push(Yt, jt, $t), t.now() - m > 3e4 && (m = t.now(), P(F));
      const ve = v(F);
      if (ve.length) {
        const xe = xt("ul", "", "ppp-gift-list");
        for (const zt of ve.slice(0, 10)) {
          const h = (At = zt.view) == null ? void 0 : At.status, b = zt.error ? zt.error : !h || h === "pending-deposit" ? zt.txid ? "payment confirming…" : "waiting for your payment" : h === "live" ? "ready to share" : h === "claiming" || h === "claimed" ? "claimed ✓" : h === "refunding" ? "expired · refund on its way" : h === "refunded" ? "expired · refunded to you" : h, f = xt("li");
          if (f.append(xt("span", `${gn(BigInt(zt.amount))} STX`, "t"), xt("span", b, ((le = zt.view) == null ? void 0 : le.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((It = zt.view) == null ? void 0 : It.status) === "live") {
            const _ = Be(((fe = A.gate) == null ? void 0 : fe.radioUrl) ?? null, zt.code);
            f.append(Cs("gift-copy:" + zt.id, "Copy link", () => _, "tiny", t.changed), Ky("gift-share:" + zt.id, "Share", () => I(_), "tiny", t.changed));
          }
          xe.append(f);
        }
        G.push(xe);
      }
      if (D.admin) {
        const xe = xt("div", "", "ppp-gift-admin"), zt = (Q, ct) => {
          const mt = xt("label", Q);
          return mt.append(ct), mt;
        }, h = Vt(F);
        xe.append(
          xt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          ee,
          ue,
          kt,
          ae,
          xr("Sign and make player", () => void yt(F, { title: ee.value, subtitle: ue.value, tracks: kt.value, cover: ae.value }))
        );
        const b = xr("Sign, pay and make links", () => {
          st(F, St(), ut.value.trim(), ce.value || void 0);
        });
        b.disabled = !!R;
        const f = ce.value;
        ce.replaceChildren(wa("No album (starter copies)", ""), ...h.map((Q) => wa(`${Q.title} · ${Q.tracks} songs`, Q.id))), h.some((Q) => Q.id === f) && (ce.value = f), Ne(), xe.append(
          xt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          zt("Album ", ce),
          zt("Plays each ", me),
          zt("Copies ", qt),
          ut,
          Me,
          b
        ), t.now() - tt > 3e4 && (tt = t.now(), H(F));
        const _ = U(F);
        if (_.length) {
          const Q = xt("ul", "", "ppp-gift-list");
          for (const ct of _.slice(0, 10)) {
            const mt = ct.view, Rt = mt == null ? void 0 : mt.copies, Oe = ct.error ? ct.error : !mt || mt.status === "pending-deposit" ? ct.txid ? "payment confirming…" : "waiting for your payment" : `${Rt.claimed} of ${mt.count} claimed${Rt.refunding + Rt.refunded ? ` · ${Rt.refunded} refunded${Rt.refunding ? `, ${Rt.refunding} on their way` : ""}` : ""}`, Qt = xt("li");
            if (Qt.append(xt("span", `${ct.label || "Batch"} · ${ct.count} × ${gn(BigInt(ct.amount))} STX`, "t"), xt("span", Oe, "ppp-mute")), !ct.txid && ct.depositTo && (!mt || mt.status === "pending-deposit") && Qt.append(xr("Pay now", () => void at(F, ct.id), "tiny")), ct.codes.length && (mt == null ? void 0 : mt.status) === "live") {
              const Ht = Ct(((Ae = A.gate) == null ? void 0 : Ae.radioUrl) ?? null, ct);
              Qt.append(
                Cs("batch-copy:" + ct.id, "Copy all links", () => Ht.join(`
`), "tiny", t.changed),
                Cs("batch-csv:" + ct.id, "Copy as CSV", () => ["copy,link", ...Ht.map(($e, fn) => `${fn + 1},${$e}`)].join(`
`), "tiny", t.changed)
              );
            } else ct.codes.length || Qt.append(xt("span", "links were made on another device", "ppp-mute"));
            Q.append(Qt);
          }
          xe.append(Q);
        }
        G.push(xe);
      }
    }
    return R && G.push(xt("p", R, "ppp-cyan")), q && G.push(xt("p", q, /✓/.test(q) ? "ppp-ok" : "ppp-warn")), et.replaceChildren(...G), et;
  }
  return { banner: M, funder: T, renderFold: un, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: E };
}
const s$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function i$(t) {
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
const o$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((i) => !i.hidden).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function a$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = o$(s);
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
function c$(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const mi = 12, l$ = 5e3, on = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, xi = (t, e, n = "") => {
  const r = on("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function u$(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = mi;
  const l = on("div", "", "ppp-shelf-box"), y = (m) => "xtrata.radio.shelf.pins.v1:" + m, p = (m) => "xtrata.radio.shelf.recent.v1:" + m, $ = (m, P) => {
    try {
      return JSON.parse(t.store.get(m) || "null") ?? P;
    } catch {
      return P;
    }
  }, S = (m) => new Set($(y(m), []).filter((P) => Number.isSafeInteger(P))), C = (m) => {
    const P = $(p(m), {}), nt = {};
    for (const [X, Vt] of Object.entries(P)) Number.isSafeInteger(Number(X)) && typeof Vt == "number" && (nt[Number(X)] = Vt);
    return nt;
  };
  async function V(m) {
    if (!i) {
      i = !0, s = !1;
      try {
        const P = [];
        let nt = 0, X = 0;
        for (let Vt = 0; Vt < l$ / 100 + 1; Vt++) {
          const yt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(m)}&after=${nt}&limit=100`);
          if (P.push(...i$(yt == null ? void 0 : yt.shelf)), X = Number(yt == null ? void 0 : yt.total) || P.length, !(yt != null && yt.next) || !Number.isSafeInteger(yt.next)) break;
          nt = yt.next;
        }
        m === e && (n = P, r = X, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const K = () => {
    o = -1 / 0;
  }, E = on("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, d = mi, t.changed();
  };
  const M = on("select");
  M.setAttribute("aria-label", "Sort albums");
  for (const m of s$) {
    const P = document.createElement("option");
    P.value = m.value, P.textContent = m.label, M.append(P);
  }
  M.onchange = () => {
    c = M.value, d = mi, t.changed();
  };
  const T = xi("", () => {
    u = !u, d = mi, t.changed();
  }, "tiny"), et = on("div", "", "ppp-shelf-tools");
  et.append(E, M, T);
  const W = on("div"), R = on("div");
  function q(m) {
    const P = m.step === "off" || m.step === "elsewhere" ? void 0 : m.root;
    if (P !== e && (e = P, n = [], r = 0, o = -1 / 0, d = mi), !P || m.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && V(P), !n.length)
      return s ? (R.replaceChildren(on("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), xi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(R), l) : null;
    const nt = S(P), X = C(P), Vt = a$(n, { query: a, sort: c, pinnedOnly: u, pins: nt, recents: X });
    E.value !== a && (E.value = a), M.value = c, T.textContent = u ? "★ Pinned only" : "☆ Pinned only", T.setAttribute("aria-pressed", String(u));
    const yt = [];
    if (m.slot > 0 && yt.push(xi("← My player", () => t.open(0), "quiet")), !Vt.length) yt.push(on("p", "No album matches that.", "ppp-mute"));
    else {
      const Be = on("ul", "", "ppp-shelf-list");
      for (const I of Vt.slice(0, d)) {
        const U = on("li", "", I.slot === m.slot ? "now" : ""), dt = nt.has(I.slot), x = xi(dt ? "★" : "☆", () => {
          const at = new Set(nt);
          dt ? at.delete(I.slot) : at.add(I.slot), t.store.set(y(P), JSON.stringify([...at])), t.changed();
        }, "tiny");
        x.setAttribute("aria-label", dt ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const N = [I.player.subtitle, `${Co(I.player).length} ${Co(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), tt = I.slot === m.slot, H = xi(tt ? "Playing" : "Play", () => {
          t.store.set(p(P), JSON.stringify(c$({ ...X, [I.slot]: t.now() }))), t.open(I.slot);
        }, tt ? "tiny" : "tiny primary");
        H.disabled = tt, U.append(x, on("span", I.player.title, "t"), on("span", " " + N, "ppp-mute"), H), Be.append(U);
      }
      yt.push(Be), Vt.length > d && yt.push(xi(`Show more (${Vt.length - d} left)`, () => {
        d += mi, t.changed();
      }, "quiet"));
    }
    return s && yt.push(on("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), W.replaceChildren(...yt), l.firstChild !== et && l.replaceChildren(et, W), l;
  }
  return { render: q, invalidate: K, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const m = C(e), P = [...n].filter((nt) => nt.player).sort((nt, X) => (m[X.slot] ?? 0) - (m[nt.slot] ?? 0) || X.slot - nt.slot)[0];
    return P ? { slot: P.slot, title: P.player.title } : null;
  } };
}
const f$ = 20, Ve = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ie = {
  grid: Ve('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ve('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ve('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ve('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ve('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ve('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ve('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ve('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ve('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ve('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ve('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ve('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ve('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ve('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ve('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ve('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ve('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function J(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [i, s] of Object.entries(e))
    s == null || s === !1 || (i === "class" ? r.className = String(s) : i === "html" ? r.innerHTML = String(s) : i.startsWith("on") && typeof s == "function" ? r[i.toLowerCase()] = s : i === "disabled" ? r.disabled = !!s : r.setAttribute(i, s === !0 ? "" : String(s)));
  for (const i of n) i != null && i !== !1 && r.append(i);
  return r;
}
const Xe = (t, ...e) => J("button", { type: "button", ...t }, ...e), ba = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, ao = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, d$ = { music: "My music", device: "This device", gifts: "Send music to a friend" }, h$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function p$(t, e) {
  let n = null, r = "", i = !1;
  const s = document.documentElement, o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
  function c(x) {
    var tt, H, at;
    if (!x || !Number.isSafeInteger(x)) return "";
    const N = (at = (H = (tt = e.radio()) == null ? void 0 : tt.getState) == null ? void 0 : H.call(tt)) == null ? void 0 : at.albumCover;
    return N != null && N.url && Number(N.tokenId) === x ? N.url : o.has(x) ? o.get(x) : (a.has(x) || (a.add(x), fetch("/inscription/" + x, { signal: AbortSignal.timeout(2e4) }).then(async (st) => {
      var Ut, Ct, Yt, jt;
      const St = (st.headers.get("content-type") || "").toLowerCase();
      if (!st.ok)
        throw await ((Ut = st.body) == null ? void 0 : Ut.cancel()), new Error("no cover");
      return St.startsWith("image/") ? (await ((Ct = st.body) == null ? void 0 : Ct.cancel()), "/inscription/" + x) : St.includes("text/html") ? (((Yt = (await st.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : Yt[1]) ?? "").replace(/&amp;/g, "&") : (await ((jt = st.body) == null ? void 0 : jt.cancel()), "");
    }).then((st) => {
      o.set(x, st), dt();
    }).catch(() => {
      a.delete(x);
    })), "");
  }
  const u = "xtrata:al-thumb:v1:", d = "-", l = 96, y = 24 * 1024 * 1024, p = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Set(), S = [];
  let C = !1, V;
  const K = (x, N) => {
    try {
      if (N === void 0) return window.localStorage.getItem(u + x);
      window.localStorage.setItem(u + x, N);
    } catch {
    }
    return null;
  };
  function E(x) {
    return new Promise((N) => {
      var tt;
      try {
        const H = document.createElement("canvas"), at = (tt = H.getContext) == null ? void 0 : tt.call(H, "2d");
        if (!at) return N(x);
        const st = new Image(), St = setTimeout(() => N(x), 8e3);
        st.onload = () => {
          clearTimeout(St);
          try {
            const Ut = Math.min(st.naturalWidth, st.naturalHeight);
            if (!Ut) return N(x);
            H.width = H.height = l, at.fillStyle = "#143a40", at.fillRect(0, 0, l, l), at.drawImage(st, (st.naturalWidth - Ut) / 2, (st.naturalHeight - Ut) / 2, Ut, Ut, 0, 0, l, l), N(H.toDataURL("image/jpeg", 0.82));
          } catch {
            N(x);
          }
        }, st.onerror = () => {
          clearTimeout(St), N(x);
        }, st.src = x;
      } catch {
        N(x);
      }
    });
  }
  async function M(x) {
    var Ct, Yt, jt, $t, ie;
    const N = await fetch("/inscription/" + x, { signal: AbortSignal.timeout(6e4) }), tt = (N.headers.get("content-type") || "").toLowerCase();
    if (!N.ok)
      return await ((Ct = N.body) == null ? void 0 : Ct.cancel()), null;
    if (tt.startsWith("image/"))
      return await ((Yt = N.body) == null ? void 0 : Yt.cancel()), "/inscription/" + x;
    if (!tt.includes("text/html"))
      return await ((jt = N.body) == null ? void 0 : jt.cancel()), "";
    let H = "", at = 0;
    const st = (be) => {
      let ee = 0;
      for (; ; ) {
        const ue = H.slice(ee).search(/<img\b/i);
        if (ue < 0)
          return H = be ? "" : H.slice(Math.max(0, H.length - 4)), null;
        const kt = ee + ue, ae = H.indexOf(">", kt);
        if (ae < 0)
          return H = H.slice(kt), null;
        const ce = H.slice(kt, ae + 1), me = ce.match(/\bsrc="(data:image\/[^"]+)"/i);
        if (me) return me[1].replace(/&amp;/g, "&");
        const qt = ce.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
        if (qt) return "/inscription/" + qt[1];
        ee = ae + 1;
      }
    }, St = (ie = ($t = N.body) == null ? void 0 : $t.getReader) == null ? void 0 : ie.call($t);
    if (!St)
      return H = await N.text(), st(!0) ?? "";
    const Ut = new TextDecoder();
    for (; ; ) {
      const { done: be, value: ee } = await St.read();
      if (be) break;
      at += ee.byteLength, H += Ut.decode(ee, { stream: !0 });
      const ue = st(!1);
      if (ue)
        return await St.cancel(), ue;
      if (at > y)
        return await St.cancel(), null;
    }
    return H += Ut.decode(), st(!0) ?? "";
  }
  async function T() {
    if (!C) {
      C = !0;
      try {
        for (; S.length; ) {
          const x = S.shift();
          if (!p.has(x))
            try {
              const N = await M(x);
              if (N === null) continue;
              if (!N) {
                p.set(x, ""), K(x, d), dt();
                continue;
              }
              const tt = await E(N);
              p.set(x, tt), tt.startsWith("data:image/jpeg") && K(x, tt), dt();
            } catch {
            }
        }
      } finally {
        C = !1;
      }
    }
  }
  function et(x, N) {
    if (N && !p.get(x) ? (p.set(x, N), E(N).then((H) => {
      H !== N && (p.set(x, H), H.startsWith("data:image/jpeg") && K(x, H), dt());
    })) : N === "" && !p.has(x) && p.set(x, ""), p.has(x)) return p.get(x);
    const tt = K(x);
    if (tt != null) {
      const H = tt === d ? "" : tt;
      return p.set(x, H), H;
    }
    return $.has(x) || ($.add(x), S.push(x), V || (V = setTimeout(() => {
      V = void 0, T();
    }, 1200))), "";
  }
  function W(x) {
    var tt;
    r = x, x ? s.dataset.sheet = x : delete s.dataset.sheet;
    const N = document.querySelector(".side");
    if (x && x !== "more") {
      for (const st of h$[x]) {
        const St = N == null ? void 0 : N.querySelector(st);
        St && (St.open = !0);
      }
      const H = document.getElementById("sheetTitle");
      H && (H.textContent = d$[x]);
      const at = document.getElementById("sheetExtra");
      at && at.replaceChildren(...x === "music" ? [q()] : []), (tt = N == null ? void 0 : N.scrollTo) == null || tt.call(N, { top: 0 });
    }
    dt();
  }
  const R = document.getElementById("sheetClose");
  R && (R.onclick = () => W("")), document.addEventListener("keydown", (x) => {
    x.key === "Escape" && r && s.dataset.view === "album" && W("");
  });
  const q = () => Xe(
    { class: "al-row", onClick: () => {
      W(""), e.openPlayer();
    } },
    J("span", { class: "al-row-i", html: Ie.radio }),
    J("span", { class: "al-row-t" }, J("b", {}, "Xtrata Radio"), J("small", {}, "Every song on-chain · FM, liked, all")),
    J("span", { class: "al-row-go", html: Ie.right })
  );
  let v = null, B = !1;
  const m = () => {
    var N;
    const x = e.radio();
    B || !(x != null && x.subscribe) || (B = !0, x.subscribe((tt) => {
      v = tt, (n == null ? void 0 : n.mode) === "open" && dt();
    }), v = ((N = x.getState) == null ? void 0 : N.call(x)) ?? null);
  };
  setInterval(() => {
    var H, at;
    if ((n == null ? void 0 : n.mode) !== "open" || !(v != null && v.playing)) return;
    const x = (at = (H = e.radio()) == null ? void 0 : H.getPosition) == null ? void 0 : at.call(H), N = t.querySelector(".al-bar > i"), tt = t.querySelectorAll(".al-times span");
    !x || !N || (N.style.width = x.duration ? `${Math.min(100, x.current / x.duration * 100)}%` : "0%", tt.length === 2 && (tt[0].textContent = ba(x.current || 0), tt[1].textContent = x.duration ? ba(x.duration) : "–:––"));
  }, 500);
  let P = "", nt = null;
  function X(x, N, tt = {}) {
    const H = tt.song || c(x.cover), st = [H ? J("img", { src: H, alt: tt.song ? "Song artwork" : `${x.title} cover` }) : J("div", { class: "al-cover-fallback" }, J("b", {}, x.title), x.subtitle ? J("span", {}, x.subtitle) : null), tt.paused ? J("span", { class: "al-paused" }, J("i", { html: Ie.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], St = "al-cover" + (N ? "" : " al-cover--small") + (tt.paused ? " is-paused" : "");
    return tt.flip ? (st.push(J("span", { class: "al-flip", "aria-hidden": "true", html: Ie.flip })), Xe({ class: St + " is-flippable", "aria-label": tt.flipped ? "Show this song’s artwork" : `Show the ${x.title} cover`, onClick: tt.flip }, ...st)) : J("div", { class: St }, ...st);
  }
  function Vt(x) {
    return x.plays === null || x.plays === void 0 ? J("span", { class: "al-chip al-chip--quiet" }, x.playsComing ? "Plays on their way…" : "…") : x.plays === 0 ? J("span", { class: "al-chip al-chip--out" }, x.playsComing ? "Plays on their way…" : "No plays left") : J("span", { class: "al-chip" + (x.plays <= f$ ? " al-chip--low" : "") }, `${ao(x.plays, "play", "plays")} left`);
  }
  function yt(x) {
    const N = x.player, tt = N.tracks.filter((at) => !at.hidden), H = [];
    return x.mode === "arrive" && x.from && H.push(J("p", { class: "al-from" }, J("span", { html: Ie.gift }), J("span", {}, J("b", {}, x.from), " sent you an album"))), H.push(X(N, !0)), H.push(J(
      "div",
      { class: "al-intro" },
      J("h1", {}, N.title),
      N.subtitle ? J("p", { class: "al-artist" }, N.subtitle) : null,
      tt.length ? J("p", { class: "al-songline" }, tt.map((at) => at.title || `#${at.id}`).join(" · ")) : null,
      J("span", { class: "al-chip" }, [ao(tt.length, "song", "songs"), x.offered ? ao(x.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), x.status.length && H.push(J("div", { class: "al-status", role: "status" }, ...x.status)), H.push(J("div", { class: "al-grow" })), x.asking ? H.push(J("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : x.primary && H.push(Xe({ class: "al-primary", onClick: x.primary.run, disabled: x.busy }, J("span", { html: Ie.playSmall }), x.primary.label)), x.hint && !x.asking && H.push(J("p", { class: "al-hint" }, x.hint)), x.secondary && !x.asking && H.push(Xe({ class: "al-link", onClick: x.secondary.run, disabled: x.busy }, x.secondary.label)), H;
  }
  function Be(x) {
    var qt;
    const N = x.player, tt = N.tracks.filter((ut) => !ut.hidden), H = e.radio(), at = v == null ? void 0 : v.nowPlaying, st = at && N.tracks.some((ut) => String(ut.id) === String(at.tokenId)) ? String(at.tokenId) : null, St = st ? N.tracks.find((ut) => String(ut.id) === st) : null, Ut = x.plays === 0 && !x.playsComing, Ct = !!x.playsComing && !x.plays, Yt = !!(v != null && v.playing) && !!st, jt = v == null ? void 0 : v.heart, $t = st ? (qt = H == null ? void 0 : H.getPosition) == null ? void 0 : qt.call(H) : null;
    st && (Yt || (($t == null ? void 0 : $t.current) ?? 0) > 0.5) && (P = N.id);
    const ie = !!st && P === N.id;
    nt && nt !== st && (nt = null);
    const be = ie ? String((at == null ? void 0 : at.cover) || "") : "", ee = !!be && nt === st, kt = [X(N, !Ut, { song: ee ? "" : be, paused: ie && !Yt, flip: be ? () => {
      nt = nt === st ? null : st, dt();
    } : void 0, flipped: ee })];
    if (kt.push(J(
      "div",
      { class: "al-now" },
      J(
        "div",
        { class: "al-now-t" },
        J("div", { class: "al-song" }, St ? St.title || (at == null ? void 0 : at.title) || `#${St.id}` : N.title),
        J("div", { class: "al-artist" }, St ? St.artist || (at == null ? void 0 : at.artist) || N.subtitle : N.subtitle || "Press play")
      ),
      st ? Xe({ class: "al-icon" + (jt != null && jt.liked ? " is-on" : ""), "aria-label": jt != null && jt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(jt != null && jt.liked)), disabled: !!(jt != null && jt.pending) || !!(jt != null && jt.locked) || Ct, onClick: () => {
        var ut;
        return (ut = H == null ? void 0 : H.toggleLike) == null ? void 0 : ut.call(H);
      }, html: jt != null && jt.liked ? Ie.heartOn : Ie.heart }) : null
    )), Ut)
      kt.push(J(
        "div",
        { class: "al-out" },
        J("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        J("p", { class: "al-out-t" }, "You've played this album out"),
        J("p", { class: "al-out-s" }, "Add plays to keep listening."),
        I(x, !0)
      ));
    else {
      const ut = $t != null && $t.duration ? Math.min(100, $t.current / $t.duration * 100) : 0;
      kt.push(J(
        "div",
        { class: "al-prog" },
        J("div", { class: "al-bar" }, J("i", { style: `width: ${ut}%` })),
        J("div", { class: "al-times" }, J("span", {}, ba(($t == null ? void 0 : $t.current) || 0)), J("span", {}, $t != null && $t.duration ? ba($t.duration) : "–:––"))
      ));
    }
    kt.push(J(
      "div",
      { class: "al-ctl" + (Ut || Ct ? " is-off" : "") },
      Xe({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: Ut || Ct, onClick: () => {
        var ut;
        return (ut = H == null ? void 0 : H.prev) == null ? void 0 : ut.call(H);
      }, html: Ie.prev }),
      Xe({ class: "al-play", "aria-label": Yt ? "Pause" : "Play", disabled: Ut || Ct, onClick: () => {
        var ut;
        return (ut = H == null ? void 0 : H.playPause) == null ? void 0 : ut.call(H);
      }, html: Yt ? Ie.pause : Ie.play }),
      Xe({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: Ut || Ct, onClick: () => {
        var ut;
        return (ut = H == null ? void 0 : H.next) == null ? void 0 : ut.call(H);
      }, html: Ie.next })
    )), x.status.length && kt.push(J("div", { class: "al-status", role: "status" }, ...x.status)), kt.push(J("div", { class: "al-listhead" }, J("span", {}, J("b", {}, N.title), ` · ${ao(tt.length, "song", "songs")}`), Vt(x)));
    const ae = c(N.cover), ce = "album:" + N.cover;
    ae && !p.has(ce) && (p.set(ce, ae), E(ae).then((ut) => {
      ut !== ae && (p.set(ce, ut), dt());
    }));
    const me = ae ? p.get(ce) || ae : "";
    return kt.push(J("ol", { class: "al-tracks" }, ...tt.map((ut, Me) => {
      const Ne = String(ut.id) === st, un = et(String(ut.id), Ne && ie ? be : void 0);
      return J("li", {}, Xe(
        { class: "al-track" + (Ne ? " is-on" : ""), "aria-label": `Play ${ut.title || "#" + ut.id}`, "aria-current": Ne ? "true" : void 0, disabled: Ut || Ct, onClick: () => {
          var Nn;
          return (Nn = H == null ? void 0 : H.playToken) == null ? void 0 : Nn.call(H, ut.id);
        } },
        J(
          "span",
          { class: "al-th" + (un ? "" : " is-blank") },
          un ? J("img", { src: un, alt: "", decoding: "async" }) : me ? J("img", { src: me, alt: "", decoding: "async" }) : null,
          un ? null : J("span", { class: "al-n" }, String(Me + 1)),
          Ne ? J("span", { class: "al-eq", html: Ie.eq }) : null
        ),
        J("span", { class: "al-tt" }, ut.title || `#${ut.id}`)
      ));
    }))), kt.push(J("div", { class: "al-grow" })), kt.push(Xe(
      { class: "al-more", "aria-expanded": String(r === "more"), onClick: () => W(r === "more" ? "" : "more") },
      J("span", {}, "More ", J("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      J("span", { html: Ie.down })
    )), kt;
  }
  function I(x, N) {
    const tt = J("div", { class: "al-topups" + (N ? " al-topups--primary" : "") }), H = N ? [x.topUps[1] ?? x.topUps[0]] : [...x.topUps];
    for (const at of H) {
      const st = x.myPlays !== void 0 && x.myPlays >= at && !x.playsComing && !x.busy;
      tt.append(Xe({ class: "al-topup", disabled: !st, onClick: () => e.topUp(at) }, N ? `Add ${at.toLocaleString()} plays` : `+${at.toLocaleString()}`));
    }
    return N && tt.append(Xe({ class: "al-link", onClick: () => W("more") }, "Other amounts")), tt;
  }
  function U(x) {
    const N = x.myPlays !== void 0 && x.myPlays >= (x.topUps[0] ?? 0), tt = J(
      "div",
      { class: "al-card" },
      J("div", { class: "al-card-h" }, J("b", {}, `Add plays to ${x.player.title}`), J("span", { class: "al-mono" }, x.plays === null || x.plays === void 0 ? "" : `${x.plays.toLocaleString()} left`)),
      I(x, !1),
      J("p", { class: "al-mute al-small" }, x.playsComing ? "Plays are on their way. Add more once they arrive." : x.myPlays === void 0 ? "Checking My player…" : N ? `Moved from My player · ${ao(x.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !N && !x.playsComing && x.myPlays !== void 0 ? Xe({ class: "al-link", onClick: () => {
        W(""), e.openPlayer();
      } }, "Open My player") : null
    ), H = (st, St, Ut, Ct) => Xe(
      { class: "al-row", onClick: Ct },
      J("span", { class: "al-row-i", html: st }),
      J("span", { class: "al-row-t" }, J("b", {}, St), J("small", {}, Ut)),
      J("span", { class: "al-row-go", html: Ie.right })
    ), at = J(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      H(Ie.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, dt();
      }),
      i ? J("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return J(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      J("div", { class: "al-sheet-h" }, J("b", {}, "More"), Xe({ class: "al-icon", "aria-label": "Close", onClick: () => W(""), html: Ie.close })),
      x.mode === "open" ? tt : null,
      J(
        "div",
        { class: "al-rows" },
        H(Ie.grid, "My music", "Your albums and the radio", () => W("music")),
        H(Ie.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          W(""), e.openPlayer();
        }),
        H(Ie.gift, "Send music to a friend", "They open it with a link", () => W("gifts")),
        H(Ie.device, "This device", "Backup, history, Stacks wallet, returns", () => W("device")),
        at
      )
    );
  }
  function dt() {
    const x = n;
    if (!x) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    m(), t.hidden = !1;
    const N = J(
      "header",
      { class: "al-top" },
      J("a", { class: "al-brand", href: "/radio" }, "Xtrata ", J("b", {}, "Music")),
      x.mode === "open" ? Xe({ class: "al-icon", "aria-label": "My music", onClick: () => W("music"), html: Ie.grid }) : null
    ), tt = J("div", { class: "al-body al-body--" + x.mode }, ...x.mode === "open" ? Be(x) : yt(x));
    t.replaceChildren(N, tt, ...r === "more" ? [J("div", { class: "al-scrim", onClick: () => W("") }), U(x)] : []);
  }
  return {
    render(x) {
      const N = !!n;
      n = x, !x && (N || r) && (r = "", delete s.dataset.sheet), x ? s.dataset.view = "album" : delete s.dataset.view, x != null && x.asking ? s.dataset.asking = "1" : delete s.dataset.asking, dt();
    },
    sheet: () => r,
    setSheet: W
  };
}
const g$ = [
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
function y$(t) {
  for (const [e, n] of g$) if (n.test(t)) return e;
  return null;
}
const Vy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), qy = (t) => /Android/.test(t);
function w$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Vy(e) ? "x-safari-" + n.href : qy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const b$ = (t) => Vy(t) ? "Safari" : qy(t) ? "Chrome" : "your browser", l0 = document.getElementById("ppp");
l0 && m$(l0);
function m$(t) {
  var zt;
  const e = kw(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let i = null;
  const s = async (h, b) => {
    const f = await fetch(h, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), _ = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((_ == null ? void 0 : _.error) || `Request failed (${f.status}).`);
    return _;
  }, o = t6({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const b = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = b == null ? void 0 : b.find((_) => _.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), i.referrerPolicy = "no-referrer";
      const b = new Promise((ct, mt) => {
        i.addEventListener("load", () => ct(), { once: !0 }), setTimeout(() => mt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = h + "/", r.replaceChildren(i), await b;
      const f = new ww({ walletOrigin: h, frame: i, timeoutMs: 30 * 6e4 }), _ = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), Q = (ct, mt) => _.has(ct) ? f.request(ct, mt) : Promise.race([
        f.request(ct, mt),
        new Promise((Rt, Oe) => setTimeout(() => Oe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await Q("listening.status"), { request: Q };
    },
    chain: {
      verify: N5,
      balance: _5,
      account: P5,
      owner: U5,
      broadcast: H5,
      transaction: O5,
      confirmedNonce: async (h) => {
        const b = await hs(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (h, b) => Rh({ ...b, network: "mainnet", stxAddress: h }),
    deposit: (h, b, f) => new Promise((_, Q) => Oh({
      recipient: b,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ct) => _(ct.txId || ""),
      onCancel: () => Q(new Error("Deposit cancelled. Nothing was sent.")),
      onError: Q
    })),
    validate: D5,
    tabLock: (h) => new Promise((b) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        b(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (_) => {
        b(!!_), _ && await new Promise(() => {
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
      set: (h, b) => {
        try {
          localStorage.setItem(h, b);
        } catch {
        }
      }
    },
    changed: () => It(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var b, f;
      return a.funder(h, () => K5(h, hs), !!((f = (b = o.snapshot().gate) == null ? void 0 : b.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const b = await s("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = b == null ? void 0 : b.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, b) => W5(h, (f) => hs(f), b),
    likesChanged: () => {
      var h, b;
      (b = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || b.call(h);
    },
    likeState: async (h, b) => {
      const f = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(b) })), _ = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((Q) => (Q == null ? void 0 : Q.id) === b) : null;
      if (!_ || typeof _.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: _.liked, by: Array.isArray(_.by) ? _.by.filter((Q) => typeof Q == "string") : _.liked ? [h] : [] };
    },
    likeSent: (h, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: b } })),
    nameOf: (h) => I(h) ?? void 0,
    likeConfirmed: (h, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: b } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = r$({
    json: s,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, b, f, _) => new Promise((Q, ct) => Oh({
      recipient: b,
      amount: f.toString(),
      memo: _,
      stxAddress: h,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (mt) => Q(mt.txId || ""),
      onCancel: () => ct(new Error("Gift cancelled. Nothing was sent.")),
      onError: ct
    })),
    sign: (h, b) => Rh({ ...b, network: "mainnet", stxAddress: h }),
    giftSent: (h, b) => o.giftSent(h, b),
    claiming: (h) => o.giftClaiming(h),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, b, f, _) => {
      c.invalidate(), await o.albumArriving(h, b, f, _);
    } },
    who: (h) => x(h),
    changed: () => It(o.snapshot()),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, b) => {
        try {
          b === null ? localStorage.removeItem(h) : localStorage.setItem(h, b);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = u$({
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
      set: (h, b) => {
        try {
          b === null ? localStorage.removeItem(h) : localStorage.setItem(h, b);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => It(o.snapshot())
  }), u = document.getElementById("album"), d = u ? p$(u, {
    radio: () => window.XtrataRadio ?? null,
    topUp: (h) => void o.topUpAlbum(h),
    openPlayer: () => void o.openAlbum(0)
  }) : null, l = "xtrata.radio.album.last.v1", y = () => {
    try {
      const h = JSON.parse(localStorage.getItem(l) || "null");
      return h && typeof h.root == "string" && Number.isSafeInteger(h.slot) && h.slot > 0 && h.player && Array.isArray(h.player.tracks) ? h : null;
    } catch {
      return null;
    }
  };
  let p = "";
  const $ = (h) => {
    const b = JSON.stringify(h);
    if (b !== p) {
      p = b;
      try {
        localStorage.setItem(l, b);
      } catch {
      }
    }
  };
  let S = null;
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    st();
    const b = St(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let C;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const V = (h) => {
    var f, _;
    const b = window.XtrataRadioListeningIdentity();
    b !== C && (C = b, (_ = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || _.call(f));
  };
  let K = "", E = null, M = !1, T = !1;
  const et = (h) => {
    var Rt, Oe, Qt, Ht, $e, fn, Pn, De;
    const b = window.XtrataRadio;
    if (!(b != null && b.setGiftPlayer) || !(b != null && b.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((Rt = h.gift) == null ? void 0 : Rt.player) ?? null, _ = f ? f.id + ":" + f.cover + ":" + f.tracks.map((de) => de.id).join(",") : "";
    _ !== K && (b.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: Co(f).map((de) => de.id), hidden: ((Oe = t$(f)) == null ? void 0 : Oe.id) ?? null, cover: f.cover } : null), K = _);
    const Q = ((Qt = h.giftStop) == null ? void 0 : Qt.text) ?? null;
    Q !== E && (b.setGiftStop(Q), E = Q);
    const ct = ((Ht = h.giftStop) == null ? void 0 : Ht.reason) === "arriving";
    ct !== T && (($e = b.setGiftWait) == null || $e.call(b, ct), T = ct);
    const mt = !!f && !!((fn = h.albumLock) != null && fn.locked);
    mt !== M && ((Pn = b.setGiftLock) == null || Pn.call(b, mt), M = mt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((De = b.forgetWallets) == null || De.call(b));
  }, W = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", R = (h) => {
    const b = o.snapshot().playCost || 350n;
    return h > ze ? Number((h - ze) / b) : 0;
  }, q = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), v = (h) => {
    const b = Math.round((Date.now() - h) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, B = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, m = (h, b = "", f = "") => {
    const _ = document.createElement(h);
    return b && (_.textContent = b), f && (_.className = f), _;
  }, P = (h, b, f = "") => {
    const _ = m("button", h, f);
    return _.type = "button", _.onclick = b, _;
  }, nt = (h, b) => {
    const f = m("a", h);
    return f.href = b, f.target = "_blank", f.rel = "noopener", f;
  };
  let X = null, Vt = location.hash === "#give";
  Vt && history.replaceState(null, "", location.pathname + location.search);
  let yt = !1;
  const Be = H6((h) => U6({ address: h, network: "mainnet" }), () => It(o.snapshot())), I = (h) => Be.get(h), U = y$(navigator.userAgent), dt = (h, b) => {
    const f = navigator.userAgent, _ = b$(f), Q = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, ct = [m("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${_} to make your listening wallet${b ? " and claim your gift" : ""}.`, "ppp-warn")], mt = m("div", "", "ppp-open-row"), Rt = w$(Q, f);
    if (Rt) {
      const Oe = m("a", `Open in ${_}`, "primary ppp-open-in");
      Oe.href = Rt, Oe.dataset.homeAction = "radio:open-in-browser", mt.append(Oe);
    }
    return mt.append(Cs("copy-page-link", "Copy link", () => Q, Rt ? "" : "primary", () => It(o.snapshot()))), ct.push(mt, m("p", `If that does not open ${_}, use ${h}'s menu (••• or ⋮) and choose "Open in ${_ === "your browser" ? "browser" : _}", or paste the copied link there.`, "ppp-mute")), ct;
  }, x = (h) => I(h) ?? W(h), N = (h) => h.slice(0, 2).map(x).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), tt = /* @__PURE__ */ new Map();
  let H = !1;
  const at = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), st = () => {
    H || (H = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const b of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(f) && tt.set(f, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      It(o.snapshot());
    }).catch(() => {
      H = !1;
    }));
  }, St = (h, b) => {
    const f = tt.get(h), _ = D6(h, [f == null ? void 0 : f.title, b == null ? void 0 : b.title].find((ct) => !at(ct)) || ""), Q = O6(h, (f == null ? void 0 : f.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: _, artist: Q };
  }, Ut = (h) => {
    const { title: b, artist: f } = St(h.song, h);
    return b ? `“${b}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, Ct = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Yt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function jt(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["TOO MUCH", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function $t(h, b, f = "", _) {
    const Q = m("dt", h), ct = m("dd", b, f);
    return _ && ct.append(" ", _), [Q, ct];
  }
  const ie = document.getElementById("ppp-top"), be = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, ee = () => {
    var b, f;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (b = document.getElementById("radio-wallet-connect")) == null || b.click();
      return;
    }
    if (h.step === "elsewhere" && ((f = h.gate) != null && f.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), be();
  };
  ie && (ie.onclick = ee);
  function ue(h) {
    if (!ie) return;
    const b = (_, Q, ct) => {
      ie.hidden = !1, ie.className = "ppp-top" + (Q ? " is-" + Q : ""), ie.replaceChildren(m("span", "", "dot"), document.createTextNode(_)), ie.title = ct;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        ie.hidden = !0;
        return;
      case "elsewhere":
        return b("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        ie.hidden = !0;
        return;
      case "intro":
        return b("Start listening", "", "Make your player with a passkey: no app or account needed");
      case "wrong-wallet":
        return b(`Connect ${x(h.linked)}`, "warn", `This device's listening wallet belongs to ${x(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return b("Unlock", "", "One tap with your passkey");
      case "link":
        return b("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return h.depositPending ? b("Plays on their way", "quiet", "Plays start by themselves when they land") : b(h.entries.some((_) => _.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return b("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return b("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return h.payingOn && f > 0 ? b(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : b("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const kt = document.getElementById("pppNudge"), ae = document.getElementById("onair");
  (zt = kt == null ? void 0 : kt.querySelector("button")) == null || zt.addEventListener("click", () => ee());
  const ce = {
    elsewhere: "Plays are not counted here",
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, me = {
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
  function qt(h) {
    if (h.step === "loading") return;
    const b = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && b > 0, _ = h.step === "fund" && h.depositPending, Q = f || _ ? "" : ce[h.step] ?? "", ct = f ? "on" : Q ? "off" : "";
    ct ? document.documentElement.dataset.ppp = ct : delete document.documentElement.dataset.ppp, ae && (ae.hidden = !ct, ae.querySelector(".onair-sub").textContent = f ? `${b.toLocaleString()} plays left` : "Plays off"), kt && (kt.hidden = ct !== "off", ct === "off" && (kt.querySelector(".nudge-t").textContent = Q, kt.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", kt.querySelector("button").textContent = me[h.step] ?? "Start"));
  }
  let ut = "";
  function Me(h) {
    const b = m("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && b.append(m("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && b.append(m("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = m("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = ut, f.oninput = () => {
      ut = f.value;
    };
    const _ = P(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), ut = "";
    }, "tiny");
    return b.append(f, " ", _), h.returnToKind === "chosen" && b.append(" ", P("Back to the funder", () => o.clearReturnAddress(), "tiny")), b;
  }
  const Ne = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function un() {
    const h = m("p", Ne + " ", "ppp-mute");
    return h.append(nt("Xverse", "https://www.xverse.app/download"), " · ", nt("Leather", "https://leather.io/install-extension")), h;
  }
  let Nn = "";
  const A = (h) => {
    const b = document.documentElement, f = h.solo && !h.main ? h.listening ? W(h.listening) : "new" : "", _ = i6() ? "1" : "";
    `${f}|${_}` !== Nn && (Nn = `${f}|${_}`, f ? b.dataset.pppSolo = f : delete b.dataset.pppSolo, _ ? b.dataset.pppWalletInstalled = _ : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => It(o.snapshot()), h);
  function D(h, b = "") {
    const f = m("div", "", "ppp-topup"), _ = F(h);
    f.append(m("span", "Add plays from My player: ", "ppp-mute"));
    for (const Q of Ia) {
      const ct = P(`+${Q.toLocaleString()}`, () => void o.topUpAlbum(Q), b);
      ct.disabled = _ === void 0 || _ < Q || h.depositPending || !!h.busy, f.append(ct);
    }
    return _ !== void 0 && _ < Ia[0] && f.append(m("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const F = (h) => {
    var _;
    const b = (_ = h.likeFunds) == null ? void 0 : _.balance;
    if (b === void 0 || !h.playCost) return;
    const f = b - ze - 6000n;
    return f > 0n ? Number(f / h.playCost) : 0;
  };
  function G(h) {
    const b = h.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    const f = m("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      const Q = m("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return b.txid && Q.append(nt("View", B(b.txid))), f.append(Q), [f];
    }
    f.append(m("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(m("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(m("p", b.address, "ppp-addr-full"));
    const _ = m("div", "", "ppp-open-row");
    if (_.append(Cs("copy-likes-address", "Copy address", () => b.address, "primary", () => It(o.snapshot()))), b.main && !h.solo) {
      const Q = Ls - (b.balance ?? 0n);
      Q > 0n && _.append(P(`Pay ${Qn(Q)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(_), f.append(m("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const pt = (h) => {
    const b = m("div", "", "ppp-wait");
    b.dataset.since = String(h.since), b.dataset.grace = String(h.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const f = m("p", "", "ppp-wait-t"), _ = m("div", "", "ppp-wait-track");
    return _.append(m("div", "", "ppp-wait-fill")), b.append(f, _), At(b), b;
  };
  function At(h) {
    const b = Number(h.dataset.since), f = Number(h.dataset.grace) || 6e4, _ = Math.max(0, Date.now() - b), Q = h.querySelector(".ppp-wait-fill"), ct = h.querySelector(".ppp-wait-t");
    if (_ < f) {
      const mt = Math.ceil((f - _) / 1e3);
      Q.style.width = Math.max(4, Math.min(95, _ / f * 100)).toFixed(0) + "%", ct.textContent = `Your plays are arriving… usually about a minute · ${mt}s`, h.classList.remove("is-long"), h.setAttribute("aria-valuenow", String(Math.round(_ / f * 100)));
    } else
      Q.style.width = "", ct.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", h.classList.add("is-long"), h.removeAttribute("aria-valuenow");
  }
  let le = 0;
  setInterval(() => {
    const h = document.querySelectorAll(".ppp-wait");
    if (!h.length) {
      le = 0;
      return;
    }
    h.forEach(At), ++le % 10 === 0 && It(o.snapshot());
  }, 1e3);
  function It(h) {
    var pr, Nr, ui, fi, bs, ke, di, Pr, gr, _r, yr, hi, Ur;
    if (S && ["ready", "fund", "over"].includes(h.step) && !h.busy) {
      const Y = S;
      S = null, h.root === Y.root && h.slot !== Y.slot && o.openAlbum(Y.slot);
    }
    const b = a.inProgress(h), f = b && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (V(), et(h), A(f), !b && a.inProgress(h) || (ue(f), qt(f), t.hidden = f.step === "off", t.hidden)) return;
    const [_, Q] = jt(f), ct = n(".ppp-state");
    ct.textContent = _, ct.className = "ppp-state" + (Q ? " ppp-state--" + Q : ""), ct.hidden = !_;
    const mt = !!f.busy || f.armed, Rt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (mt || !["intro", "loading"].includes(f.step));
    r.hidden = !Rt, r.classList.toggle("ppp-frame--rest", !mt && !yt);
    const Oe = n(".ppp-frame-label");
    Oe.hidden = !0;
    const Qt = e6(f) ?? X;
    X = Qt;
    const Ht = r6(f, Qt);
    n(".ppp-badge").hidden = !Ht;
    const $e = n(".ppp-steps"), fn = n(".ppp-stage");
    $e.hidden = fn.hidden = !Ht, Qt && Ht && ($e.replaceChildren(...pu(f.solo).map((Y, lt) => {
      const pe = m("li", "", lt < Qt.at ? "done" : lt === Qt.at ? Qt.blocked ? "now blocked" : "now" : "");
      return pe.append(m("span", lt < Qt.at ? "✓" : String(lt + 1), "n"), Y), lt === Qt.at && pe.setAttribute("aria-current", "step"), pe;
    })), fn.textContent = Qt.caption, fn.className = "ppp-stage " + (Qt.at >= pu(f.solo).length ? "ppp-ok" : Qt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Pn = n(".ppp-facts"), De = [];
    f.main && ((pr = f.gate) != null && pr.here) && !f.solo && De.push(...$t("Your wallet", x(f.main), "ppp-addr-short"));
    const de = () => {
      if (!f.listening) return;
      const Y = Cs("copy-listening", "Copy", () => f.listening || "", "tiny", () => It(o.snapshot()));
      De.push(...$t(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", W(f.listening), "ppp-addr-short", Y));
    };
    if (f.linked || de(), f.listening && f.step !== "intro")
      if (f.linked)
        De.push(...$t("Credited to", `${x(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), de();
      else if (f.solo) {
        f.creditedTo && De.push(...$t("Credited to", `${x(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${x(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        De.push(...$t("Returns go to", f.gift ? Y : f.returnTo && !I(f.returnTo) ? Y.replace(W(f.returnTo), f.returnTo) : Y, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else De.push(...$t("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Nr = f.gate) != null && Nr.here)) {
      const Y = f.linkedListening.map((lt) => W(lt) + (lt === f.listening ? " (this one)" : "")).join(", ");
      De.push(...$t(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Y = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      De.push(...$t("Balance", `${Qn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Y));
    }
    const vn = f.entries.find((Y) => Y.kind === "play");
    vn && st(), vn && De.push(...$t("Last paid song", `${Ut(vn)} → ${x(vn.recipient)}`, Ct[vn.status] || "")), Pn.replaceChildren(...De), Pn.hidden = !De.length;
    const wt = [], Xt = [], he = [], $n = [], _n = mn(BigInt(((ui = f.gate) == null ? void 0 : ui.limits.playFee) ?? "300")), Ji = `Each song you listen to for 30 seconds sends ${Qn(Ja)} STX to whoever holds it, plus a ${Qn(_n - Ja)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, ci = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (wt.push(m("p", "Pay artists as you listen.")), (fi = f.gate) != null && fi.radioUrl) {
          const lt = m("p");
          lt.append(nt("Open the pay-per-play radio →", f.gate.radioUrl)), wt.push(lt);
        }
        Xt.push(m("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const lt = [f.linked, ...f.others];
          wt.push(m("p", lt.length > 1 ? `This device has listening wallets for ${N(lt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${x(f.linked)}. Connect that wallet to keep paying artists.`)), Xt.push(m("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          wt.push(m("p", "Connect your wallet to pay artists as you listen.")), Xt.push(m("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        wt.push(m("p", `This device's listening wallet belongs to ${x(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Xt.push(m("p", `You are connected as ${x(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Xt.push(m("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), he.push(P("Switch wallet", () => {
          var lt;
          return (lt = document.getElementById("radio-wallet-connect")) == null ? void 0 : lt.click();
        }, "primary"));
        break;
      case "not-invited":
        wt.push(m("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        wt.push(m("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        wt.push(m("p", "Every play counts for the song’s owner, on-chain.")), Xt.push(m("p", Ji)), Xt.push(m("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Xt.push(m("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (wt.push(m("p", `This device already has a listening wallet for ${N(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Xt.push(m("p", `Otherwise, set up a new listening wallet for ${x(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Xt.push(m("p", `This is the listening wallet for ${x(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Xt.push(m("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = a.liveGift();
        he.push(P(Y ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${x(f.main)}` : "Start listening", () => void o.create(), "primary")), !Y && !f.solo && f.main && f.others.length && he.push(P("Switch wallet", () => {
          var lt;
          return (lt = document.getElementById("radio-wallet-connect")) == null ? void 0 : lt.click();
        })), !Y && f.solo && he.push(P("I have a Stacks wallet", () => {
          var lt;
          return (lt = document.getElementById("radio-wallet-connect")) == null ? void 0 : lt.click();
        })), he.push(P("I already have a listening wallet", () => void o.unlock(!0))), Y && he.push(P("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (wt.push(m("p", "Locked.", "ppp-mute")), he.push(P("Unlock", () => void o.unlock(), "primary"))), $n.push(P("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        wt.push(m("p", `Link to ${x(f.main)} · free`)), Xt.push(m("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Xt.push(m("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), he.push(P(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        wt.push(m("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && wt.push(pt(f.arrival)) : (bs = f.gift) != null && bs.player ? wt.push(m("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? wt.push(m("p", "No plays left · add plays to keep counting", "ppp-bad")) : wt.push(m("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / _n)).toLocaleString()} plays`)), (ke = f.gift) != null && ke.player ? Xt.push(m("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && Xt.push(m("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && Xt.push(m("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b || (f.solo ? (Xt.push(m("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Xt.push(m("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && he.push(Cs("copy-address", "Copy my address", () => f.listening || "", "primary", () => It(o.snapshot())))) : Xt.push(m("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const lt = m("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          lt.append(nt("View", B(f.depositTxid))), wt.push(lt);
        } else f.allowance > 0n && !f.solo && he.push(P(`Deposit ${Qn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        wt.push(m("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (wt.push(m("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), wt.push(Me(f))), (!f.solo || f.returnTo) && he.push(P("Return excess", () => void o.returnFunds("excess"), "primary"), P("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const lt = Math.min(f.session.playsLeft, f.playsLeft);
          wt.push(m("p", `${lt.toLocaleString()} plays left`, "ppp-ok")), Xt.push(m("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), he.push(P("Switch off", () => void o.switchOff()));
        } else
          wt.push(m("p", "Plays are off. Music stays free.", "ppp-mute")), he.push(P("Switch plays on", () => void o.switchOn(), "primary"));
        f.queued && wt.push(m("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && wt.push(m("p", "Running low on plays", "ppp-warn")), f.depositPending ? wt.push(m("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && he.push(P(`Top up ${Qn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && Xt.push(m("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Xt.push(Me(f)), Xt.push(un()), f.slot === 0 && f.step === "ready" && f.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = m("p", "New to Stacks? ", "ppp-mute");
      Y.append(nt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), wt.push(Y);
    }
    if (f.walletOutdated && Xt.push(m("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (wt.push(m("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), he.push(P("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && $n.push(P(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${x(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((di = f.gift) != null && di.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && $n.push(D(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && $n.push(P("Lock", () => void o.lock(), "quiet")), Rt && !mt && $n.push(P(yt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      yt = !yt, It(o.snapshot());
    }, "quiet")), [...he, ...$n].forEach((Y) => Y.disabled = ci), ci && (he.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Pr = f.gift) != null && Pr.player)) {
      const Y = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", lt = wt.at(0);
      f.step === "ready" && lt ? lt.append(m("span", ` · ${q(f.balance)} STX`, Y)) : wt.push(m("p", `Balance ${q(f.balance)} STX`, Y));
    }
    if ((gr = f.gift) != null && gr.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Y = m("p", "", "ppp-gift");
      Y.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Y.append(" · ", f.gift.player.subtitle);
      const lt = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? m("span", " · plays on their way", "ppp-warn") : m("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      lt && Y.append(lt);
      const pe = (_r = wt.at(0)) == null ? void 0 : _r.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && pe && /STX/.test(pe.textContent ?? "") && pe.remove(), wt.unshift(Y), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          wt.splice(1, 0, m("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), D(f, "primary"));
        else {
          const Fe = m("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          Fe.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Fe.append(nt("Xverse", "https://www.xverse.app/download"), " and ", nt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), wt.splice(1, 0, Fe);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Y = f.returnPlan, lt = m("div", "", "ppp-pick");
      lt.append(m("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const pe = m("ul", "", "ppp-gift-list");
      Y.steps.forEach((Fe, w) => {
        const k = Fe.kind === "gift" ? "the unused gift" : Fe.kind === "deposit" ? "what was added to it" : "the rest", z = m("li");
        z.append(m("span", `${w + 1}. ${Qn(BigInt(Fe.send))} STX · ${k}`, "t"), m("span", Fe.to ? ` → ${x(Fe.to)}` : " → choose an address below", Fe.to ? "ppp-mute" : "ppp-warn")), pe.append(z);
      }), lt.append(pe), Y.kept && lt.append(m("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((Fe) => !Fe.to) && lt.append(Me(f)), lt.append(P(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), wt.push(lt);
    }
    const Cr = fe(f), kn = a.banner(h, { bare: !!Cr }), li = U && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? dt(U, a.pendingCode()) : [];
    Cr || (wt.unshift(...kn), wt.unshift(...G(f)), wt.unshift(...li)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && wt.unshift(m("p", `This is ${x(f.creditedTo)}'s listening wallet. Plays and likes count for ${x(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...wt);
    const dn = document.querySelector(".ppp-switch");
    if (dn) {
      const Y = c.latest(), lt = f.slot > 0, pe = ["fund", "ready", "over"].includes(f.step) && (lt || !!Y);
      if (dn.hidden = !pe, pe) {
        const Fe = (k, z, rt, gt) => {
          const j = P("", gt, "ppp-tab");
          return j.setAttribute("aria-pressed", String(rt)), j.append(m("span", k, "tt"), m("span", z === void 0 ? "…" : `${R(z).toLocaleString()} plays`, "ts")), j.disabled = !!f.busy, j;
        }, w = lt ? ((hi = (yr = f.gift) == null ? void 0 : yr.player) == null ? void 0 : hi.title) ?? "Album" : Y.title;
        dn.replaceChildren(
          Fe("🎧 My player", lt ? (Ur = f.likeFunds) == null ? void 0 : Ur.balance : f.balance, !lt, () => {
            lt && o.openAlbum(0);
          }),
          Fe("💿 " + w, lt ? f.balance : void 0, lt, () => {
            !lt && Y && o.openAlbum(Y.slot);
          })
        );
      }
    }
    const Tr = c.render(f), Kn = document.querySelector(".ppp-shelf");
    if (Kn) {
      Kn.hidden = !Tr;
      const Y = Kn.querySelector("summary");
      Y && (Y.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const lt = Kn.querySelector(".ppp-shelf-body");
      Tr && lt && !lt.contains(Tr) && lt.replaceChildren(Tr);
    }
    const Un = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !Un, Un && !n(".ppp-gift-body").contains(Un) && n(".ppp-gift-body").replaceChildren(Un), Un && Vt) {
      Vt = !1;
      const Y = n(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Xt), n(".ppp-actions").replaceChildren(...he), n(".ppp-actions2").replaceChildren(...$n);
    const fr = f.busy || f.message || "", Br = n(".ppp-msg"), ws = fr && wt.some((Y) => (Y.textContent ?? "").startsWith(fr.replace(/[.✓\s]+$/, ""))) ? "" : fr, dr = !ws && !f.error ? f.notice : "";
    Br.textContent = ws || dr, Br.classList.toggle("is-warn", !!dr), n(".ppp-err").textContent = f.error;
    const hr = f.entries.filter((Y) => Y.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...hr.slice(0, 5).map((Y) => {
      const lt = m("li"), pe = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return lt.append(m("span", "", "d " + pe), m("span", Ut(Y), "t"), m("span", v(Y.created), "ppp-mute")), Y.txid && lt.append(nt("tx", B(Y.txid))), lt;
    })), n(".ppp-wallets").hidden = !(Pn.childElementCount || $n.length), n(".ppp-more").hidden = !Xt.length;
    const Mr = n(".ppp-history");
    Mr.hidden = !f.entries.length, f.entries.length && st(), Mr.replaceChildren(m("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Y) => {
      const lt = m("div", "", "ppp-row"), pe = Y.kind === "play" ? [m("span", Ut(Y), "ppp-song"), m("span", ` · ${Qn(BigInt(Y.amount))} STX to ${x(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [m("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${Ut(Y)}`, "ppp-song"), m("span", ` · for ${f.linked ? x(f.linked) : "this listening wallet"}`, "ppp-mute")] : [m("span", `Returned ${Qn(BigInt(Y.amount))} STX`, "ppp-song"), m("span", ` to ${x(Y.recipient)}`, "ppp-mute")];
      return lt.append(
        m("span", Yt[Y.status] || Y.status, "ppp-status " + (Ct[Y.status] || "")),
        ...pe,
        m("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && lt.append(nt("tx ↗", B(Y.txid))), lt;
    })), d == null || d.render(Cr ? Ae(f, Cr, [...li, ...kn]) : null);
  }
  function fe(h) {
    var _;
    if (["off", "elsewhere", "not-invited"].includes(h.step)) return null;
    if (h.slot > 0 && ((_ = h.gift) != null && _.player) && ["fund", "ready", "over", "link", "loading"].includes(h.step))
      return h.root && $({ root: h.root, slot: h.slot, player: h.gift.player }), { mode: "open", player: h.gift.player };
    const b = a.incomingAlbum();
    if (b) return { mode: "arrive", player: b.player, from: b.from, offered: b.plays };
    const f = y();
    return f && (h.step === "locked" || S && h.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  function Ae(h, b, f) {
    var Oe;
    const _ = !!h.busy || h.armed, Q = [...f];
    h.depositPending && h.arrival && Q.push(pt(h.arrival)), h.error ? Q.push(m("p", h.error, "ppp-bad")) : h.message && !_ ? Q.push(m("p", h.message, "ppp-cyan")) : h.notice && Q.push(m("p", h.notice, "ppp-warn")), b.mode === "open" && ((Oe = h.likeFunds) != null && Oe.album) && h.likeFunds.low && !h.likeFunds.pending && Q.push(m("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const ct = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let mt = null, Rt = null;
    return b.mode === "locked" ? (mt = { label: "Continue listening", run: () => {
      S = y(), o.unlock();
    } }, Rt = { label: "Use a different passkey", run: () => {
      S = null, o.unlock(!0);
    } }) : b.mode === "arrive" && (h.step === "intro" ? (mt = { label: "Open album", run: () => void o.create() }, Rt = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : h.step === "locked" ? (mt = { label: "Open album", run: () => void o.unlock() }, Rt = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : h.step === "unsupported" ? Q.push(m("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : Q.length || Q.push(m("p", "Opening your album…", "ppp-cyan"))), {
      mode: b.mode,
      player: b.player,
      from: b.from,
      offered: b.offered,
      plays: b.mode === "open" ? h.balance === void 0 ? null : h.giftPlays : void 0,
      playsComing: h.depositPending,
      status: Q,
      primary: mt,
      secondary: Rt,
      hint: mt ? ct : void 0,
      asking: _,
      busy: !!h.busy,
      myPlays: F(h),
      topUps: Ia
    };
  }
  const ve = /* @__PURE__ */ new Map(), xe = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((b) => {
      const f = b == null ? void 0 : b.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && ve.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!xe()) {
    const h = setInterval(() => {
      xe() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const b = h.detail;
    if (b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      st();
      const f = St(b.song, ve.get(b.song));
      o.onListened({ song: b.song, id: b.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const x$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", S$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, E$ = () => S$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, A$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, v$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Wy = class {
  constructor(t) {
    XA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && gx(t), this.callback(gc(t));
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
    const t = E$(), e = A$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return Tt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Tt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Tt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Tt("div", { class: "flex flex-col space-y-[10px]" }, Tt("div", { class: "flex items-center" }, Tt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Tt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Tt("span", { class: "sr-only" }, "Close popup"), Tt("img", { src: x$ }))), r ? Tt("p", null, "Select the wallet you want to connect to.") : Tt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Tt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Tt("div", { class: "mt-6" }, Tt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Tt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => Tt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Tt("div", { class: "aspect-square basis-9 overflow-hidden" }, Tt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Tt("div", { class: "flex-1" }, Tt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Tt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), Tt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && Tt("div", { class: "mt-6" }, r ? Tt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Tt("div", { class: "mb-5 flex justify-between" }, Tt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Tt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Tt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Tt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Tt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Tt("p", null, "What is a wallet? ", Tt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Tt("ul", { class: "space-y-3" }, n.map((s) => Tt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Tt("div", { class: "aspect-square basis-9 overflow-hidden" }, Tt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Tt("div", { class: "flex-1" }, Tt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Tt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && Tt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return TA(this);
  }
};
Wy.style = v$;
const $$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Wy
}, Symbol.toStringTag, { value: "Module" }));
