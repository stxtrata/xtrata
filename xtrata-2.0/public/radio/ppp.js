var rw = Object.defineProperty;
var sw = (t, e, n) => e in t ? rw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var no = (t, e, n) => sw(t, typeof e != "symbol" ? e + "" : e, n);
var nn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function d0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function rc(t) {
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
      function s(v) {
        return v && DataView.prototype.isPrototypeOf(v);
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
        ], o = ArrayBuffer.isView || function(v) {
          return v && i.indexOf(Object.prototype.toString.call(v)) > -1;
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
        var P = {
          next: function() {
            var M = v.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function d(v) {
        this.map = {}, v instanceof d ? v.forEach(function(P, M) {
          this.append(M, P);
        }, this) : Array.isArray(v) ? v.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : v && Object.getOwnPropertyNames(v).forEach(function(P) {
          this.append(P, v[P]);
        }, this);
      }
      d.prototype.append = function(v, P) {
        v = a(v), P = c(P);
        var M = this.map[v];
        this.map[v] = M ? M + ", " + P : P;
      }, d.prototype.delete = function(v) {
        delete this.map[a(v)];
      }, d.prototype.get = function(v) {
        return v = a(v), this.has(v) ? this.map[v] : null;
      }, d.prototype.has = function(v) {
        return this.map.hasOwnProperty(a(v));
      }, d.prototype.set = function(v, P) {
        this.map[a(v)] = c(P);
      }, d.prototype.forEach = function(v, P) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && v.call(P, this.map[M], M, this);
      }, d.prototype.keys = function() {
        var v = [];
        return this.forEach(function(P, M) {
          v.push(M);
        }), u(v);
      }, d.prototype.values = function() {
        var v = [];
        return this.forEach(function(P) {
          v.push(P);
        }), u(v);
      }, d.prototype.entries = function() {
        var v = [];
        return this.forEach(function(P, M) {
          v.push([M, P]);
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
        return new Promise(function(P, M) {
          v.onload = function() {
            P(v.result);
          }, v.onerror = function() {
            M(v.error);
          };
        });
      }
      function p(v) {
        var P = new FileReader(), M = y(P);
        return P.readAsArrayBuffer(v), M;
      }
      function A(v) {
        var P = new FileReader(), M = y(P), V = /charset=([A-Za-z0-9_-]+)/.exec(v.type), ct = V ? V[1] : "utf-8";
        return P.readAsText(v, ct), M;
      }
      function m(v) {
        for (var P = new Uint8Array(v), M = new Array(P.length), V = 0; V < P.length; V++)
          M[V] = String.fromCharCode(P[V]);
        return M.join("");
      }
      function T(v) {
        if (v.slice)
          return v.slice(0);
        var P = new Uint8Array(v.byteLength);
        return P.set(new Uint8Array(v)), P.buffer;
      }
      function W() {
        return this.bodyUsed = !1, this._initBody = function(v) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = v, v ? typeof v == "string" ? this._bodyText = v : r.blob && Blob.prototype.isPrototypeOf(v) ? this._bodyBlob = v : r.formData && FormData.prototype.isPrototypeOf(v) ? this._bodyFormData = v : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) ? this._bodyText = v.toString() : r.arrayBuffer && r.blob && s(v) ? (this._bodyArrayBuffer = T(v.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(v) || o(v)) ? this._bodyArrayBuffer = T(v) : this._bodyText = v = Object.prototype.toString.call(v) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof v == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return A(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(m(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var X = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function S(v) {
        var P = v.toUpperCase();
        return X.indexOf(P) > -1 ? P : v;
      }
      function N(v, P) {
        if (!(this instanceof N))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var M = P.body;
        if (v instanceof N) {
          if (v.bodyUsed)
            throw new TypeError("Already read");
          this.url = v.url, this.credentials = v.credentials, P.headers || (this.headers = new d(v.headers)), this.method = v.method, this.mode = v.mode, this.signal = v.signal, !M && v._bodyInit != null && (M = v._bodyInit, v.bodyUsed = !0);
        } else
          this.url = String(v);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new d(P.headers)), this.method = S(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var Y = new AbortController();
            return Y.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var V = /([?&])_=[^&]*/;
          if (V.test(this.url))
            this.url = this.url.replace(V, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var ct = /\?/;
            this.url += (ct.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      N.prototype.clone = function() {
        return new N(this, { body: this._bodyInit });
      };
      function B(v) {
        var P = new FormData();
        return v.trim().split("&").forEach(function(M) {
          if (M) {
            var V = M.split("="), ct = V.shift().replace(/\+/g, " "), Y = V.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(ct), decodeURIComponent(Y));
          }
        }), P;
      }
      function tt(v) {
        var P = new d(), M = v.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(V) {
          return V.indexOf(`
`) === 0 ? V.substr(1, V.length) : V;
        }).forEach(function(V) {
          var ct = V.split(":"), Y = ct.shift().trim();
          if (Y) {
            var L = ct.join(":").trim();
            try {
              P.append(Y, L);
            } catch (rt) {
              console.warn("Response " + rt.message);
            }
          }
        }), P;
      }
      W.call(N.prototype);
      function nt(v, P) {
        if (!(this instanceof nt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new d(P.headers), this.url = P.url || "", this._initBody(v);
      }
      W.call(nt.prototype), nt.prototype.clone = function() {
        return new nt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, nt.error = function() {
        var v = new nt(null, { status: 200, statusText: "" });
        return v.ok = !1, v.status = 0, v.type = "error", v;
      };
      var K = [301, 302, 303, 307, 308];
      nt.redirect = function(v, P) {
        if (K.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new nt(null, { status: P, headers: { location: v } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, M) {
          this.message = P, this.name = M;
          var V = Error(P);
          this.stack = V.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function z(v, P) {
        return new Promise(function(M, V) {
          var ct = new N(v, P);
          if (ct.signal && ct.signal.aborted)
            return V(new e.DOMException("Aborted", "AbortError"));
          var Y = new XMLHttpRequest();
          function L() {
            Y.abort();
          }
          Y.onload = function() {
            var I = {
              statusText: Y.statusText,
              headers: tt(Y.getAllResponseHeaders() || "")
            };
            ct.url.indexOf("file://") === 0 && (Y.status < 200 || Y.status > 599) ? I.status = 200 : I.status = Y.status, I.url = "responseURL" in Y ? Y.responseURL : I.headers.get("X-Request-URL");
            var U = "response" in Y ? Y.response : Y.responseText;
            setTimeout(function() {
              M(new nt(U, I));
            }, 0);
          }, Y.onerror = function() {
            setTimeout(function() {
              V(new TypeError("Network request failed"));
            }, 0);
          }, Y.ontimeout = function() {
            setTimeout(function() {
              V(new TypeError("Network request timed out"));
            }, 0);
          }, Y.onabort = function() {
            setTimeout(function() {
              V(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function rt(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (Y.open(ct.method, rt(ct.url), !0), ct.credentials === "include" ? Y.withCredentials = !0 : ct.credentials === "omit" && (Y.withCredentials = !1), "responseType" in Y && (r.blob ? Y.responseType = "blob" : r.arrayBuffer && (Y.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof d || n.Headers && P.headers instanceof n.Headers)) {
            var re = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(I) {
              re.push(a(I)), Y.setRequestHeader(I, c(P.headers[I]));
            }), ct.headers.forEach(function(I, U) {
              re.indexOf(U) === -1 && Y.setRequestHeader(U, I);
            });
          } else
            ct.headers.forEach(function(I, U) {
              Y.setRequestHeader(U, I);
            });
          ct.signal && (ct.signal.addEventListener("abort", L), Y.onreadystatechange = function() {
            Y.readyState === 4 && ct.signal.removeEventListener("abort", L);
          }), Y.send(typeof ct._bodyInit > "u" ? null : ct._bodyInit);
        });
      }
      return z.polyfill = !0, n.fetch || (n.fetch = z, n.Headers = d, n.Request = N, n.Response = nt), e.Headers = d, e.Request = N, e.Response = nt, e.fetch = z, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : nn);
})();
const iw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ow(t, e) {
  const n = {};
  return Object.assign(n, iw, e), await fetch(t, n);
}
function aw(t) {
  let e = ow, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function cw(...t) {
  const { fetchLib: e, middlewares: n } = aw(t);
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
var Ti;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ti || (Ti = {}));
var Ns;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ns || (Ns = {}));
var Nf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Nf || (Nf = {}));
const lw = "https://api.mainnet.hiro.so", uw = "https://api.testnet.hiro.so", fw = "http://localhost:3999", dw = ["mainnet", "testnet", "devnet", "mocknet"];
let Bi = class {
  constructor(e) {
    this.version = Ns.Mainnet, this.chainId = Ti.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ns.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? cw();
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
Bi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new fl();
    case "testnet":
      return new hw();
    case "devnet":
      return new pw();
    case "mocknet":
      return new h0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${dw.join(", ")}`);
  }
};
Bi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Bi.fromName(t);
let fl = class extends Bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Mainnet, this.chainId = Ti.Mainnet;
  }
}, hw = class extends Bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = Ti.Testnet;
  }
}, h0 = class extends Bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? fw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = Ti.Testnet;
  }
};
const pw = h0, p0 = "xtrata.wallet.bridge.v1", gw = (t) => typeof t == "object" && t !== null && t.protocol === p0, yw = (t) => gw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", ww = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class ro extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Pf = 12e4;
class bw {
  constructor(e) {
    no(this, "pending", /* @__PURE__ */ new Map());
    no(this, "listenTarget");
    no(this, "closed", !1);
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
    no(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !yw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new ro("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new ro("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ro("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = ww(), i = { protocol: p0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ro(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Pf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Pf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new ro("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const mw = ["SP", "SM"], xw = ["ST", "SN"], Sw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return mw.includes(n) ? "mainnet" : xw.includes(n) ? "testnet" : null;
}, Ew = () => {
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
}, Aw = () => typeof window > "u" || !window.localStorage ? Ew() : window.localStorage, _c = "xtrata.v15.1.wallet.session", _f = "mainnet", Ca = { isConnected: !1 }, vw = (t) => t.address ? Sw(t.address) ?? t.network : t.network, g0 = (t) => !t.isConnected || !t.address ? { ...Ca } : vw(t) !== _f ? { ...Ca } : {
  isConnected: !0,
  address: t.address,
  network: _f,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, $w = (t) => {
  if (!t)
    return { ...Ca };
  try {
    const e = JSON.parse(t);
    return g0(e);
  } catch {
    return { ...Ca };
  }
}, kw = (t) => {
  const e = g0(t);
  return JSON.stringify(e);
}, Iw = (t) => {
  const e = Aw();
  return {
    load: () => $w(e.getItem(_c)),
    save: (n) => {
      e.setItem(_c, kw(n));
    },
    clear: () => {
      e.removeItem(_c);
    }
  };
}, Lw = "https://browser.blockstack.org/auth", Cw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, y0 = ["store_write"], Tw = "blockstack-session", Bw = {
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
class Wi extends Error {
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
class Mw extends Wi {
  constructor(e, n = "") {
    super({ code: Zs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Uf extends Wi {
  constructor(e = "") {
    super({ code: Zs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class zo extends Wi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Zs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Hf extends Wi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Zs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class dl extends Wi {
  constructor(e) {
    super({ code: Zs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class w0 extends Wi {
  constructor(e) {
    super({ code: Zs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Of = ["debug", "info", "warn", "error", "none"], hl = {};
for (let t = 0; t < Of.length; t++) {
  const e = Of[t];
  hl[e] = t;
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
    return hl[Bw.logLevel] <= hl[e];
  }
}
function Nw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Pw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Uc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function _w() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Uw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Hw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function yu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Uw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Ai.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Hw(s, t.toString(), n);
    throw Ai.error(i), new Error(i);
  }
  if (r)
    return {};
}
function us(t, e) {
  return wu(Qe(t), e);
}
function Qe(t) {
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
  if (un(t, Uint8Array))
    return BigInt(`0x${xt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Ow(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Df(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Bo(t, e = 8) {
  return (typeof t == "bigint" ? t : Qe(t)).toString(16).padStart(e * 2, "0");
}
function sc(t) {
  return parseInt(t, 16);
}
function wu(t, e = 16) {
  const n = Bo(t, e);
  return te(n);
}
function Dw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Fw(t, e) {
  return t & BigInt(1) << e;
}
function pl(t) {
  return jw(BigInt(`0x${xt(t)}`), BigInt(t.byteLength * 8));
}
function jw(t, e) {
  return Fw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const zw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function xt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += zw[n];
  return e;
}
function te(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Ow(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Qs(t) {
  return new TextEncoder().encode(t);
}
function Mo(t) {
  return new TextDecoder().decode(t);
}
function Rw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Gw(t) {
  return String.fromCharCode.apply(null, t);
}
function Kw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ff(t) {
  if (t.some(Kw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function or(...t) {
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
function _e(t) {
  return or(...t.map((e) => typeof e == "number" ? Ff([e]) : e instanceof Array ? Ff(e) : e));
}
function un(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const b0 = "https://api.mainnet.hiro.so", m0 = "https://api.testnet.hiro.so", x0 = "http://localhost:3999", Vw = "https://hub.blockstack.org", qw = 33, Hc = 32;
function Ww(t) {
  if (t.length < Hc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Hc * 2), r = t.slice(2 + Hc * 2);
  return {
    recoveryId: sc(e),
    r: n,
    s: r
  };
}
function bu(t) {
  const e = typeof t == "string" ? te(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Xw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Yw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Zw(t, e) {
  return t[e];
}
function Qw(t, e, n = 0) {
  return t[n] = e, t;
}
function Jw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ps(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const tb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function eb(t, e) {
  const n = {};
  return Object.assign(n, tb, e), await fetch(t, n);
}
function nb(t) {
  let e = eb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function rb(...t) {
  const { fetchLib: e, middlewares: n } = nb(t);
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
class S0 {
  constructor(e = y0.slice(), n = ((a) => (a = yu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Lw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function gl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function E0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ib(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  gl(t.outputLen), gl(t.blockLen);
}
function ob(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ab(t, e) {
  E0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: gl,
  bool: sb,
  bytes: E0,
  hash: ib,
  exists: ob,
  output: ab
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qn = (t, e) => t << 32 - e | t >>> e, cb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function mu(t) {
  if (typeof t == "string" && (t = lb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let A0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Js(t) {
  const e = (r) => t().update(mu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let v0 = class extends A0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Es.hash(e);
    const r = mu(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const ic = (t, e, n) => new v0(t, e).update(n).digest();
ic.create = (t, e) => new v0(t, e);
function ub(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let xu = class extends A0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oc(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = mu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Oc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Es.exists(this), Es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    ub(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oc(e), c = this.outputLen;
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
const fb = (t, e, n) => t & e ^ ~t & n, db = (t, e, n) => t & e ^ t & n ^ e & n, hb = new Uint32Array([
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
]), Nr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Pr = new Uint32Array(64);
let $0 = class extends xu {
  constructor() {
    super(64, 32, 8, !1), this.A = Nr[0] | 0, this.B = Nr[1] | 0, this.C = Nr[2] | 0, this.D = Nr[3] | 0, this.E = Nr[4] | 0, this.F = Nr[5] | 0, this.G = Nr[6] | 0, this.H = Nr[7] | 0;
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
      Pr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Pr[l - 15], p = Pr[l - 2], A = qn(y, 7) ^ qn(y, 18) ^ y >>> 3, m = qn(p, 17) ^ qn(p, 19) ^ p >>> 10;
      Pr[l] = m + Pr[l - 7] + A + Pr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = qn(a, 6) ^ qn(a, 11) ^ qn(a, 25), p = d + y + fb(a, c, u) + hb[l] + Pr[l] | 0, m = (qn(r, 2) ^ qn(r, 13) ^ qn(r, 22)) + db(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Pr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, pb = class extends $0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mi = Js(() => new $0());
Js(() => new pb());
const gb = {}, k0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Zt = BigInt(0), be = BigInt(1), is = BigInt(2), fo = BigInt(3), jf = BigInt(8), oe = Object.freeze({
  a: Zt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: be,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), zf = (t, e) => (t + e / is) / e, Ro = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = oe, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -be * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = zf(i * t, e), c = zf(-r * t, e);
    let u = it(t - a * n - c * s, e), d = it(-a * r - c * i, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, jn = 32, _s = 32, I0 = 32, Ta = jn + 1, Ba = 2 * jn + 1;
function Rf(t) {
  const { a: e, b: n } = oe, r = it(t * t), s = it(r * t);
  return it(s + e * t + n);
}
const Go = oe.a === Zt;
class Su extends Error {
  constructor(e) {
    super(e);
  }
}
function Gf(t) {
  if (!(t instanceof ne))
    throw new TypeError("JacobianPoint expected");
}
class ne {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof jt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(jt.ZERO) ? ne.ZERO : new ne(e.x, e.y, be);
  }
  static toAffineBatch(e) {
    const n = xb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ne.toAffineBatch(e).map(ne.fromAffine);
  }
  equals(e) {
    Gf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = it(s * s), u = it(a * a), d = it(n * u), l = it(i * c), y = it(it(r * a) * u), p = it(it(o * s) * c);
    return d === l && y === p;
  }
  negate() {
    return new ne(this.x, it(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = it(e * e), i = it(n * n), o = it(i * i), a = e + i, c = it(is * (it(a * a) - s - o)), u = it(fo * s), d = it(u * u), l = it(d - is * c), y = it(u * (c - l) - jf * o), p = it(is * n * r);
    return new ne(l, y, p);
  }
  add(e) {
    Gf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Zt || o === Zt)
      return this;
    if (n === Zt || r === Zt)
      return e;
    const c = it(s * s), u = it(a * a), d = it(n * u), l = it(i * c), y = it(it(r * a) * u), p = it(it(o * s) * c), A = it(l - d), m = it(p - y);
    if (A === Zt)
      return m === Zt ? this.double() : ne.ZERO;
    const T = it(A * A), W = it(A * T), X = it(d * T), S = it(m * m - W - is * X), N = it(m * (X - S) - y * W), B = it(s * a * A);
    return new ne(S, N, B);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ne.ZERO;
    if (typeof e == "bigint" && e === Zt)
      return n;
    let r = qf(e);
    if (r === be)
      return this;
    if (!Go) {
      let l = n, y = this;
      for (; r > Zt; )
        r & be && (l = l.add(y)), y = y.double(), r >>= be;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Ro.splitScalar(r), c = n, u = n, d = this;
    for (; i > Zt || a > Zt; )
      i & be && (c = c.add(d)), a & be && (u = u.add(d)), d = d.double(), i >>= be, a >>= be;
    return s && (c = c.negate()), o && (u = u.negate()), u = new ne(it(u.x * Ro.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Go ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ne.BASE) && (n = jt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && yl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ne.normalizeZ(s), yl.set(n, s)));
    let i = ne.ZERO, o = ne.BASE;
    const a = 1 + (Go ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let A = Number(e & u);
      e >>= l, A > c && (A -= d, e += be);
      const m = p, T = p + Math.abs(A) - 1, W = y % 2 !== 0, X = A < 0;
      A === 0 ? o = o.add(Ko(W, s[m])) : i = i.add(Ko(X, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = qf(e), s, i;
    if (Go) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Ro.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      d = Ko(o, d), y = Ko(c, y), y = new ne(it(y.x * Ro.beta), y.y, y.z), s = d.add(y), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ne.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ne.ZERO);
    e == null && (e = i ? jf : Xi(s));
    const o = e, a = it(o * o), c = it(a * o), u = it(n * a), d = it(r * c), l = it(s * o);
    if (i)
      return jt.ZERO;
    if (l !== be)
      throw new Error("invZ was invalid");
    return new jt(u, d);
  }
}
ne.BASE = new ne(oe.Gx, oe.Gy, be);
ne.ZERO = new ne(Zt, be, Zt);
function Ko(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const yl = /* @__PURE__ */ new WeakMap();
class jt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, yl.delete(this);
  }
  hasEvenY() {
    return this.y % is === Zt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = xn(n ? e : e.subarray(1));
    if (!xa(r))
      throw new Error("Point is not on curve");
    const s = Rf(r);
    let i = mb(s);
    const o = (i & be) === be;
    n ? o && (i = it(-i)) : (e[0] & 1) === 1 !== o && (i = it(-i));
    const a = new jt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = xn(e.subarray(1, jn + 1)), r = xn(e.subarray(jn + 1, jn * 2 + 1)), s = new jt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = ar(e), r = n.length, s = n[0];
    if (r === jn)
      return this.fromCompressedHex(n);
    if (r === Ta && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Ba && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ta} compressed bytes or ${Ba} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return jt.BASE.multiply(Us(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = T0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Eu(ar(e)), { n: a } = oe, c = r === 2 || r === 3 ? s + a : s, u = Xi(c, a), d = it(-o * u, a), l = it(i * u, a), y = r & 1 ? "03" : "02", p = jt.fromHex(y + os(c)), A = jt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!A)
      throw new Error("Cannot recover signature: point at infinify");
    return A.assertValidity(), A;
  }
  toRawBytes(e = !1) {
    return as(this.toHex(e));
  }
  toHex(e = !1) {
    const n = os(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${os(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!xa(n) || !xa(r))
      throw new Error(e);
    const s = it(r * r), i = Rf(n);
    if (it(s - i) !== Zt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new jt(this.x, it(-this.y));
  }
  double() {
    return ne.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ne.fromAffine(this).add(ne.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ne.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ne.fromAffine(this), i = n === Zt || n === be || this !== jt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ne.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ne.ZERO) ? void 0 : a.toAffine();
  }
}
jt.BASE = new jt(oe.Gx, oe.Gy);
jt.ZERO = new jt(Zt, Zt);
function Kf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Vf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ni(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: xn(n), left: t.subarray(e + 2) };
}
function yb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ni(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Vf(t.subarray(2)), { data: r, left: s } = Vf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ni(s)}`);
  return { r: e, s: r };
}
class mn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Ni(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new mn(Ma(s.slice(0, 64)), Ma(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = yb(n ? e : as(e));
    return new mn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!_i(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!_i(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = oe.n >> be;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new mn(this.r, it(-this.s, oe.n)) : this;
  }
  toDERRawBytes() {
    return as(this.toDERHex());
  }
  toDERHex() {
    const e = Kf(so(this.s)), n = Kf(so(this.r)), r = e.length / 2, s = n.length / 2, i = so(r), o = so(s);
    return `30${so(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return as(this.toCompactHex());
  }
  toCompactHex() {
    return os(this.r) + os(this.s);
  }
}
function rs(...t) {
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
const wb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ni(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += wb[t[n]];
  return e;
}
const bb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function os(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Zt <= t && t < bb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Pi(t) {
  const e = as(os(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function so(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ma(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function as(t) {
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
function xn(t) {
  return Ma(Ni(t));
}
function ar(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : as(t);
}
function qf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && _i(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function it(t, e = oe.P) {
  const n = t % e;
  return n >= Zt ? n : e + n;
}
function An(t, e) {
  const { P: n } = oe;
  let r = t;
  for (; e-- > Zt; )
    r *= r, r %= n;
  return r;
}
function mb(t) {
  const { P: e } = oe, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = An(u, fo) * u % e, l = An(d, fo) * u % e, y = An(l, is) * c % e, p = An(y, r) * y % e, A = An(p, s) * p % e, m = An(A, o) * A % e, T = An(m, a) * m % e, W = An(T, o) * A % e, X = An(W, fo) * u % e, S = An(X, i) * p % e, N = An(S, n) * c % e, B = An(N, is);
  if (B * B % e !== t)
    throw new Error("Cannot find square root");
  return B;
}
function Xi(t, e = oe.P) {
  if (t === Zt || e <= Zt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = it(t, e), r = e, s = Zt, i = be;
  for (; n !== Zt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== be)
    throw new Error("invert: does not exist");
  return it(s, e);
}
function xb(t, e = oe.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Zt ? i : (n[a] = i, it(i * o, e)), be), s = Xi(r, e);
  return t.reduceRight((i, o, a) => o === Zt ? i : (n[a] = it(i * n[a], e), it(i * o, e)), s), n;
}
function Sb(t) {
  const e = t.length * 8 - _s * 8, n = xn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Eu(t, e = !1) {
  const n = Sb(t);
  if (e)
    return n;
  const { n: r } = oe;
  return n >= r ? n - r : n;
}
let Li, ho;
class L0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Me.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ho(this.k, ...e);
  }
  checkSync() {
    if (typeof ho != "function")
      throw new Su("hmacSha256Sync needs to be set");
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
    return rs(...n);
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
    return rs(...n);
  }
}
function _i(t) {
  return Zt < t && t < oe.n;
}
function xa(t) {
  return Zt < t && t < oe.P;
}
function C0(t, e, n, r = !0) {
  const { n: s } = oe, i = Eu(t, !0);
  if (!_i(i))
    return;
  const o = Xi(i, s), a = jt.BASE.multiply(i), c = it(a.x, s);
  if (c === Zt)
    return;
  const u = it(o * it(e + n * c, s), s);
  if (u === Zt)
    return;
  let d = new mn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & be);
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
    e = Ma(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== _s)
      throw new Error("Expected 32 bytes of private key");
    e = xn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!_i(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Au(t) {
  return t instanceof jt ? (t.assertValidity(), t) : jt.fromHex(t);
}
function T0(t) {
  if (t instanceof mn)
    return t.assertValidity(), t;
  try {
    return mn.fromDER(t);
  } catch {
    return mn.fromCompact(t);
  }
}
function No(t, e = !1) {
  return jt.fromPrivateKey(t).toRawBytes(e);
}
function Eb(t, e, n, r = !1) {
  return jt.fromSignature(t, e, n).toRawBytes(r);
}
function Wf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ta || r === Ba : n ? r === Ta * 2 || r === Ba * 2 : t instanceof jt;
}
function vu(t, e, n = !1) {
  if (Wf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Wf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Au(e);
  return r.assertValidity(), r.multiply(Us(t)).toRawBytes(n);
}
function B0(t) {
  const e = t.length > jn ? t.slice(0, jn) : t;
  return xn(e);
}
function Ab(t) {
  const e = B0(t), n = it(e, oe.n);
  return M0(n < Zt ? e : n);
}
function M0(t) {
  return Pi(t);
}
function N0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = ar(t), s = Us(e), i = [M0(s), Ab(r)];
  if (n != null) {
    n === !0 && (n = Me.randomBytes(jn));
    const c = ar(n);
    if (c.length !== jn)
      throw new Error(`sign: Expected ${jn} bytes of extra data`);
    i.push(c);
  }
  const o = rs(...i), a = B0(r);
  return { seed: o, m: a, d: s };
}
function P0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function vb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = N0(t, e, n.extraEntropy), o = new L0(I0, _s);
  await o.reseed(r);
  let a;
  for (; !(a = C0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return P0(a, n);
}
function oc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = N0(t, e, n.extraEntropy), o = new L0(I0, _s);
  o.reseedSync(r);
  let a;
  for (; !(a = C0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return P0(a, n);
}
const $b = { strict: !0 };
function kb(t, e, n, r = $b) {
  let s;
  try {
    s = T0(t), e = ar(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Eu(e);
  let c;
  try {
    c = Au(n);
  } catch {
    return !1;
  }
  const { n: u } = oe, d = Xi(o, u), l = it(a * d, u), y = it(i * d, u), p = jt.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? it(p.x, u) === i : !1;
}
function Na(t) {
  return it(xn(t), oe.n);
}
class Ui {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = ar(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = xn(n.subarray(0, 32)), s = xn(n.subarray(32, 64));
    return new Ui(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!xa(e) || !_i(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return os(this.r) + os(this.s);
  }
  toRawBytes() {
    return as(this.toHex());
  }
}
function Ib(t) {
  return jt.fromPrivateKey(t).toRawX();
}
class _0 {
  constructor(e, n, r = Me.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = ar(e);
    const { x: s, scalar: i } = this.getScalar(Us(n));
    if (this.px = s, this.d = i, this.rand = ar(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = jt.fromPrivateKey(e), r = n.hasEvenY() ? e : oe.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Pi(e ^ xn(n));
  }
  finalizeNonce(e) {
    const n = it(xn(e), oe.n);
    if (n === Zt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ui(e.x, it(n + r * s, oe.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Me.taggedHash, o = this.initNonce(n, await i(ns.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(ns.nonce, o, r, e)), d = Na(await i(ns.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await O0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Me.taggedHashSync, o = this.initNonce(n, i(ns.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(ns.nonce, o, r, e)), d = Na(i(ns.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return D0(l, e, r) || this.error(), l;
  }
}
async function Lb(t, e, n) {
  return new _0(t, e, n).calc();
}
function Cb(t, e, n) {
  return new _0(t, e, n).calcSync();
}
function U0(t, e, n) {
  const r = t instanceof Ui, s = r ? t : Ui.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: ar(e),
    P: Au(n)
  };
}
function H0(t, e, n, r) {
  const s = jt.BASE.multiplyAndAddUnsafe(e, Us(n), it(-r, oe.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function O0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = U0(t, e, n), a = Na(await Me.taggedHash(ns.challenge, Pi(r), o.toRawX(), i));
    return H0(r, o, s, a);
  } catch {
    return !1;
  }
}
function D0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = U0(t, e, n), a = Na(Me.taggedHashSync(ns.challenge, Pi(r), o.toRawX(), i));
    return H0(r, o, s, a);
  } catch (r) {
    if (r instanceof Su)
      throw r;
    return !1;
  }
}
const Tb = {
  Signature: Ui,
  getPublicKey: Ib,
  sign: Lb,
  verify: O0,
  signSync: Cb,
  verifySync: D0
};
jt.BASE._setWindowSize(8);
const dn = {
  node: k0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ns = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Vo = {}, Me = {
  bytesToHex: Ni,
  hexToBytes: as,
  concatBytes: rs,
  mod: it,
  invert: Xi,
  isValidPrivateKey(t) {
    try {
      return Us(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Pi,
  _normalizePrivateKey: Us,
  hashToPrivateKey: (t) => {
    t = ar(t);
    const e = _s + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = it(xn(t), oe.n - be) + be;
    return Pi(n);
  },
  randomBytes: (t = 32) => {
    if (dn.web)
      return dn.web.getRandomValues(new Uint8Array(t));
    if (dn.node) {
      const { randomBytes: e } = dn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Me.hashToPrivateKey(Me.randomBytes(_s + 8)),
  precompute(t = 8, e = jt.BASE) {
    const n = e === jt.BASE ? e : new jt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(fo), n;
  },
  sha256: async (...t) => {
    if (dn.web) {
      const e = await dn.web.subtle.digest("SHA-256", rs(...t));
      return new Uint8Array(e);
    } else if (dn.node) {
      const { createHash: e } = dn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (dn.web) {
      const n = await dn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = rs(...e), s = await dn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (dn.node) {
      const { createHmac: n } = dn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Vo[t];
    if (n === void 0) {
      const r = await Me.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = rs(r, r), Vo[t] = n;
    }
    return Me.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Li != "function")
      throw new Su("sha256Sync is undefined, you need to set it");
    let n = Vo[t];
    if (n === void 0) {
      const r = Li(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = rs(r, r), Vo[t] = n;
    }
    return Li(n, ...e);
  },
  _JacobianPoint: ne
};
Object.defineProperties(Me, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Li;
    },
    set(t) {
      Li || (Li = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ho;
    },
    set(t) {
      ho || (ho = t);
    }
  }
});
const Bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: oe,
  Point: jt,
  Signature: mn,
  getPublicKey: No,
  getSharedSecret: vu,
  recoverPublicKey: Eb,
  schnorr: Tb,
  sign: vb,
  signSync: oc,
  utils: Me,
  verify: kb
}, Symbol.toStringTag, { value: "Module" }));
var Po = {};
Po.byteLength = Ub;
var Mb = Po.toByteArray = Ob, Nb = Po.fromByteArray = jb, Jn = [], $n = [], Pb = typeof Uint8Array < "u" ? Uint8Array : Array, Dc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var wi = 0, _b = Dc.length; wi < _b; ++wi)
  Jn[wi] = Dc[wi], $n[Dc.charCodeAt(wi)] = wi;
$n[45] = 62;
$n[95] = 63;
function F0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Ub(t) {
  var e = F0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Hb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ob(t) {
  var e, n = F0(t), r = n[0], s = n[1], i = new Pb(Hb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = $n[t.charCodeAt(c)] << 18 | $n[t.charCodeAt(c + 1)] << 12 | $n[t.charCodeAt(c + 2)] << 6 | $n[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = $n[t.charCodeAt(c)] << 2 | $n[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = $n[t.charCodeAt(c)] << 10 | $n[t.charCodeAt(c + 1)] << 4 | $n[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Db(t) {
  return Jn[t >> 18 & 63] + Jn[t >> 12 & 63] + Jn[t >> 6 & 63] + Jn[t & 63];
}
function Fb(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Db(r));
  return s.join("");
}
function jb(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Fb(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Jn[e >> 2] + Jn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Jn[e >> 10] + Jn[e >> 4 & 63] + Jn[e << 2 & 63] + "="
  )), s.join("");
}
function zb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Rb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Gb() {
  if (zb())
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
    throw new Error(Rb);
  }
}
class Kb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(or(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(or(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Vb {
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
async function j0() {
  const t = await Gb();
  return t.name === "subtleCrypto" ? new Vb(t.lib) : new Kb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function qb(t) {
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
    for (var A = 0, m = 0, T = 0, W = p.length; T !== W && p[T] === 0; )
      T++, A++;
    for (var X = (W - T) * u + 1 >>> 0, S = new Uint8Array(X); T !== W; ) {
      for (var N = p[T], B = 0, tt = X - 1; (N !== 0 || B < m) && tt !== -1; tt--, B++)
        N += 256 * S[tt] >>> 0, S[tt] = N % o >>> 0, N = N / o >>> 0;
      if (N !== 0)
        throw new Error("Non-zero carry");
      m = B, T++;
    }
    for (var nt = X - m; nt !== X && S[nt] === 0; )
      nt++;
    for (var K = a.repeat(A); nt < X; ++nt)
      K += t.charAt(S[nt]);
    return K;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var A = 0, m = 0, T = 0; p[A] === a; )
      m++, A++;
    for (var W = (p.length - A) * c + 1 >>> 0, X = new Uint8Array(W); p[A]; ) {
      var S = p.charCodeAt(A);
      if (S > 255)
        return;
      var N = e[S];
      if (N === 255)
        return;
      for (var B = 0, tt = W - 1; (N !== 0 || B < T) && tt !== -1; tt--, B++)
        N += o * X[tt] >>> 0, X[tt] = N % 256 >>> 0, N = N / 256 >>> 0;
      if (N !== 0)
        throw new Error("Non-zero carry");
      T = B, A++;
    }
    for (var nt = W - T; nt !== W && X[nt] === 0; )
      nt++;
    for (var K = new Uint8Array(m + (W - nt)), z = m; nt !== W; )
      K[z++] = X[nt++];
    return K;
  }
  function y(p) {
    var A = l(p);
    if (A)
      return A;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var z0 = qb;
const Wb = z0, Xb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Yb = Wb(Xb);
const Zb = /* @__PURE__ */ d0(Yb), Qb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), R0 = Uint8Array.from({ length: 16 }, (t, e) => e), Jb = R0.map((t) => (9 * t + 5) % 16);
let $u = [R0], ku = [Jb];
for (let t = 0; t < 4; t++)
  for (let e of [$u, ku])
    e.push(e[t].map((n) => Qb[n]));
const G0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), tm = $u.map((t, e) => t.map((n) => G0[e][n])), em = ku.map((t, e) => t.map((n) => G0[e][n])), nm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), rm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qo = (t, e) => t << e | t >>> 32 - e;
function Xf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Wo = new Uint32Array(16);
let sm = class extends xu {
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
      Wo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, m = nm[p], T = rm[p], W = $u[p], X = ku[p], S = tm[p], N = em[p];
      for (let B = 0; B < 16; B++) {
        const tt = qo(r + Xf(p, i, a, u) + Wo[W[B]] + m, S[B]) + l | 0;
        r = l, l = u, u = qo(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = qo(s + Xf(A, o, c, d) + Wo[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = qo(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Wo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const im = Js(() => new sm());
function om(t) {
  return im(t);
}
const Xo = BigInt(2 ** 32 - 1), wl = BigInt(32);
function K0(t, e = !1) {
  return e ? { h: Number(t & Xo), l: Number(t >> wl & Xo) } : { h: Number(t >> wl & Xo) | 0, l: Number(t & Xo) | 0 };
}
function am(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = K0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const cm = (t, e) => BigInt(t >>> 0) << wl | BigInt(e >>> 0), lm = (t, e, n) => t >>> n, um = (t, e, n) => t << 32 - n | e >>> n, fm = (t, e, n) => t >>> n | e << 32 - n, dm = (t, e, n) => t << 32 - n | e >>> n, hm = (t, e, n) => t << 64 - n | e >>> n - 32, pm = (t, e, n) => t >>> n - 32 | e << 64 - n, gm = (t, e) => e, ym = (t, e) => t, wm = (t, e, n) => t << n | e >>> 32 - n, bm = (t, e, n) => e << n | t >>> 32 - n, mm = (t, e, n) => e << n - 32 | t >>> 64 - n, xm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Sm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Em = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Am = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $m = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, km = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Im = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: K0,
  split: am,
  toBig: cm,
  shrSH: lm,
  shrSL: um,
  rotrSH: fm,
  rotrSL: dm,
  rotrBH: hm,
  rotrBL: pm,
  rotr32H: gm,
  rotr32L: ym,
  rotlSH: wm,
  rotlSL: bm,
  rotlBH: mm,
  rotlBL: xm,
  add: Sm,
  add3L: Em,
  add3H: Am,
  add4L: vm,
  add4H: $m,
  add5H: Im,
  add5L: km
}, [Lm, Cm] = Nt.split([
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
].map((t) => BigInt(t))), _r = new Uint32Array(80), Ur = new Uint32Array(80);
let ac = class extends xu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: A, Hh: m, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = m | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      _r[S] = e.getUint32(n), Ur[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = _r[S - 15] | 0, B = Ur[S - 15] | 0, tt = Nt.rotrSH(N, B, 1) ^ Nt.rotrSH(N, B, 8) ^ Nt.shrSH(N, B, 7), nt = Nt.rotrSL(N, B, 1) ^ Nt.rotrSL(N, B, 8) ^ Nt.shrSL(N, B, 7), K = _r[S - 2] | 0, z = Ur[S - 2] | 0, v = Nt.rotrSH(K, z, 19) ^ Nt.rotrBH(K, z, 61) ^ Nt.shrSH(K, z, 6), P = Nt.rotrSL(K, z, 19) ^ Nt.rotrBL(K, z, 61) ^ Nt.shrSL(K, z, 6), M = Nt.add4L(nt, P, Ur[S - 7], Ur[S - 16]), V = Nt.add4H(M, tt, v, _r[S - 7], _r[S - 16]);
      _r[S] = V | 0, Ur[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: A, Gh: m, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Nt.rotrSH(l, y, 14) ^ Nt.rotrSH(l, y, 18) ^ Nt.rotrBH(l, y, 41), B = Nt.rotrSL(l, y, 14) ^ Nt.rotrSL(l, y, 18) ^ Nt.rotrBL(l, y, 41), tt = l & p ^ ~l & m, nt = y & A ^ ~y & T, K = Nt.add5L(X, B, nt, Cm[S], Ur[S]), z = Nt.add5H(K, W, N, tt, Lm[S], _r[S]), v = K | 0, P = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), M = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      W = m | 0, X = T | 0, m = p | 0, T = A | 0, p = l | 0, A = y | 0, { h: l, l: y } = Nt.add(u | 0, d | 0, z | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Nt.add3L(v, M, ct);
      r = Nt.add3H(Y, z, P, V), s = Y | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Nt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: A } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: m, l: T } = Nt.add(this.Gh | 0, this.Gl | 0, m | 0, T | 0), { h: W, l: X } = Nt.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, A, m, T, W, X);
  }
  roundClean() {
    _r.fill(0), Ur.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Tm = class extends ac {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Bm = class extends ac {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Mm = class extends ac {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Nm = Js(() => new ac());
Js(() => new Tm());
Js(() => new Bm());
Js(() => new Mm());
function V0(t) {
  return Mi(t);
}
function Pm(t) {
  return Nm(t);
}
const _m = 0;
Me.hmacSha256Sync = (t, ...e) => {
  const n = ic.create(Mi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Um() {
  return xt(Me.randomPrivateKey());
}
function Hm(t) {
  const e = Mi(Mi(t));
  return Zb.encode(or(t, e).slice(0, t.length + 4));
}
function Om(t, e) {
  return Hm(or(new Uint8Array([t]), e.slice(0, 20)));
}
function q0(t, e = _m) {
  const n = typeof t == "string" ? te(t) : t, r = om(V0(n));
  return Om(e, r);
}
function W0(t) {
  const e = bu(t);
  return xt(No(e.slice(0, 32), !0));
}
Me.hmacSha256Sync = (t, ...e) => {
  const n = ic.create(Mi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Pa;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Pa || (Pa = {}));
async function Dm(t, e, n) {
  return await (await j0()).encrypt("aes-256-cbc", e, t, n);
}
async function Fm(t, e, n) {
  return await (await j0()).decrypt("aes-256-cbc", e, t, n);
}
function X0(t, e) {
  return ic(Mi, t, e);
}
function jm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Y0(t) {
  const e = Pm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function zm(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Rm(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Pa.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Pa.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !zm(t))
    return e;
  try {
    return jt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Gm(t, e, n, r) {
  const s = Rm(t);
  if (!s.result)
    throw s;
  const i = Me.randomPrivateKey(), o = No(i, !0);
  let a = vu(i, t, !0);
  a = a.slice(1);
  const c = Y0(a), u = Me.randomBytes(16), d = await Dm(u, c.encryptionKey, e), l = or(u, o, d), y = X0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = xt(d);
  else if (r === "base64")
    p = Nb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const A = {
    iv: xt(u),
    ephemeralPK: xt(o),
    cipherText: p,
    mac: xt(y),
    wasString: n
  };
  return r && r !== "hex" && (A.cipherTextEncoding = r), A;
}
async function Z0(t, e) {
  if (!e.ephemeralPK)
    throw new Hf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = vu(t, n, !0);
  r = r.slice(1);
  const s = Y0(r), i = te(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = te(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Mb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = or(i, te(n), o), c = X0(s.hmacKey, a), u = te(e.mac);
  if (!jm(u, c))
    throw new Hf("Decryption failed: failure in MAC check");
  const d = await Fm(i, s.encryptionKey, o);
  return e.wasString ? Mo(d) : d;
}
function Km(t, e) {
  const n = typeof e == "string" ? Qs(e) : e, r = W0(t), s = V0(n), i = oc(s, t);
  return {
    signature: xt(i),
    publicKey: r
  };
}
async function Vm(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = W0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Qs(t) : t, o = await Gm(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Km(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function qm(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Z0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Xe = {}, Hi = {}, tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.decode = tn.encode = tn.unescape = tn.escape = tn.pad = void 0;
const Q0 = Po;
function Iu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
tn.pad = Iu;
function J0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
tn.escape = J0;
function tp(t) {
  return Iu(t).replace(/-/g, "+").replace(/_/g, "/");
}
tn.unescape = tp;
function Wm(t) {
  return J0((0, Q0.fromByteArray)(new TextEncoder().encode(t)));
}
tn.encode = Wm;
function Xm(t) {
  return new TextDecoder().decode((0, Q0.toByteArray)(Iu(tp(t))));
}
tn.decode = Xm;
var cc = {}, lc = {}, ep = {}, np = {}, uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
uc.crypto = void 0;
uc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = A, t.byteSwap32 = m, t.bytesToHex = X, t.hexToBytes = B, t.asyncLoop = nt, t.utf8ToBytes = K, t.bytesToUtf8 = z, t.toBytes = v, t.kdfInputToBytes = P, t.concatBytes = M, t.checkOpts = V, t.createHasher = Y, t.createOptHasher = L, t.createXOFer = rt, t.randomBytes = re;
  const e = uc;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...U) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (U.length > 0 && !U.includes(I.length))
      throw new Error("Uint8Array expected of length " + U + ", got length=" + I.length);
  }
  function i(I) {
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
    s(I);
    const St = U.outputLen;
    if (I.length < St)
      throw new Error("digestInto() expects output buffer of length at least " + St);
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
  function A(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (I) => I : (I) => A(I), t.byteSwapIfBE = t.swap8IfBE;
  function m(I) {
    for (let U = 0; U < I.length; U++)
      I[U] = A(I[U]);
    return I;
  }
  t.swap32IfBE = t.isLE ? (I) => I : m;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", W = /* @__PURE__ */ Array.from({ length: 256 }, (I, U) => U.toString(16).padStart(2, "0"));
  function X(I) {
    if (s(I), T)
      return I.toHex();
    let U = "";
    for (let St = 0; St < I.length; St++)
      U += W[I[St]];
    return U;
  }
  const S = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function N(I) {
    if (I >= S._0 && I <= S._9)
      return I - S._0;
    if (I >= S.A && I <= S.F)
      return I - (S.A - 10);
    if (I >= S.a && I <= S.f)
      return I - (S.a - 10);
  }
  function B(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (T)
      return Uint8Array.fromHex(I);
    const U = I.length, St = U / 2;
    if (U % 2)
      throw new Error("hex string expected, got unpadded hex of length " + U);
    const Ot = new Uint8Array(St);
    for (let Tt = 0, Qt = 0; Tt < St; Tt++, Qt += 2) {
      const ie = N(I.charCodeAt(Qt)), x = N(I.charCodeAt(Qt + 1));
      if (ie === void 0 || x === void 0) {
        const _ = I[Qt] + I[Qt + 1];
        throw new Error('hex string expected, got non-hex character "' + _ + '" at index ' + Qt);
      }
      Ot[Tt] = ie * 16 + x;
    }
    return Ot;
  }
  const tt = async () => {
  };
  t.nextTick = tt;
  async function nt(I, U, St) {
    let Ot = Date.now();
    for (let Tt = 0; Tt < I; Tt++) {
      St(Tt);
      const Qt = Date.now() - Ot;
      Qt >= 0 && Qt < U || (await (0, t.nextTick)(), Ot += Qt);
    }
  }
  function K(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function z(I) {
    return new TextDecoder().decode(I);
  }
  function v(I) {
    return typeof I == "string" && (I = K(I)), s(I), I;
  }
  function P(I) {
    return typeof I == "string" && (I = K(I)), s(I), I;
  }
  function M(...I) {
    let U = 0;
    for (let Ot = 0; Ot < I.length; Ot++) {
      const Tt = I[Ot];
      s(Tt), U += Tt.length;
    }
    const St = new Uint8Array(U);
    for (let Ot = 0, Tt = 0; Ot < I.length; Ot++) {
      const Qt = I[Ot];
      St.set(Qt, Tt), Tt += Qt.length;
    }
    return St;
  }
  function V(I, U) {
    if (U !== void 0 && {}.toString.call(U) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, U);
  }
  class ct {
  }
  t.Hash = ct;
  function Y(I) {
    const U = (Ot) => I().update(v(Ot)).digest(), St = I();
    return U.outputLen = St.outputLen, U.blockLen = St.blockLen, U.create = () => I(), U;
  }
  function L(I) {
    const U = (Ot, Tt) => I(Tt).update(v(Ot)).digest(), St = I({});
    return U.outputLen = St.outputLen, U.blockLen = St.blockLen, U.create = (Ot) => I(Ot), U;
  }
  function rt(I) {
    const U = (Ot, Tt) => I(Tt).update(v(Ot)).digest(), St = I({});
    return U.outputLen = St.outputLen, U.blockLen = St.blockLen, U.create = (Ot) => I(Ot), U;
  }
  t.wrapConstructor = Y, t.wrapConstructorWithOpts = L, t.wrapXOFConstructorWithOpts = rt;
  function re(I = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(I));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(np);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = np;
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
})(ep);
const bi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function rp(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ti(t, ...e) {
  if (!rp(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Ym(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  bl(t.outputLen), bl(t.blockLen);
}
function ml(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sp(t, e) {
  ti(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Zm(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Qm(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function _a(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Sa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Un(t, e) {
  return t << 32 - e | t >>> e;
}
function Jm(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Lu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Cu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const ip = Lu ? (t) => t : (t) => Cu(t), t1 = ip;
function op(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Cu(t[e]);
  return t;
}
const e1 = Lu ? (t) => t : op, ap = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", n1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cp(t) {
  if (ti(t), ap)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += n1[t[n]];
  return e;
}
const br = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Yf(t) {
  if (t >= br._0 && t <= br._9)
    return t - br._0;
  if (t >= br.A && t <= br.F)
    return t - (br.A - 10);
  if (t >= br.a && t <= br.f)
    return t - (br.a - 10);
}
function r1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (ap)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Yf(t.charCodeAt(i)), a = Yf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const lp = async () => {
};
async function s1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await lp(), r += i);
  }
}
function Tu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function i1(t) {
  return new TextDecoder().decode(t);
}
function _o(t) {
  return typeof t == "string" && (t = Tu(t)), ti(t), t;
}
function o1(t) {
  return typeof t == "string" && (t = Tu(t)), ti(t), t;
}
function a1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    ti(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function c1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let up = class {
};
function fc(t) {
  const e = (r) => t().update(_o(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function fp(t) {
  const e = (r, s) => t(s).update(_o(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function dp(t) {
  const e = (r, s) => t(s).update(_o(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const l1 = fc, u1 = fp, f1 = dp;
function d1(t = 32) {
  if (bi && typeof bi.getRandomValues == "function")
    return bi.getRandomValues(new Uint8Array(t));
  if (bi && typeof bi.randomBytes == "function")
    return Uint8Array.from(bi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const h1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: up,
  abytes: ti,
  aexists: ml,
  ahash: Ym,
  anumber: bl,
  aoutput: sp,
  asyncLoop: s1,
  byteSwap: Cu,
  byteSwap32: op,
  byteSwapIfBE: t1,
  bytesToHex: cp,
  bytesToUtf8: i1,
  checkOpts: c1,
  clean: _a,
  concatBytes: a1,
  createHasher: fc,
  createOptHasher: fp,
  createView: Sa,
  createXOFer: dp,
  hexToBytes: r1,
  isBytes: rp,
  isLE: Lu,
  kdfInputToBytes: o1,
  nextTick: lp,
  randomBytes: d1,
  rotl: Jm,
  rotr: Un,
  swap32IfBE: e1,
  swap8IfBE: ip,
  toBytes: _o,
  u32: Qm,
  u8: Zm,
  utf8ToBytes: Tu,
  wrapConstructor: l1,
  wrapConstructorWithOpts: u1,
  wrapXOFConstructorWithOpts: f1
}, Symbol.toStringTag, { value: "Module" }));
function p1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function g1(t, e, n) {
  return t & e ^ ~t & n;
}
function y1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class w1 extends up {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Sa(this.buffer);
  }
  update(e) {
    ml(this), e = _o(e), ti(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Sa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ml(this), sp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, _a(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    p1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Sa(e), c = this.outputLen;
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
const Hr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Or = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), b1 = /* @__PURE__ */ Uint32Array.from([
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
]), Dr = /* @__PURE__ */ new Uint32Array(64);
let Bu = class extends w1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Hr[0] | 0, this.B = Hr[1] | 0, this.C = Hr[2] | 0, this.D = Hr[3] | 0, this.E = Hr[4] | 0, this.F = Hr[5] | 0, this.G = Hr[6] | 0, this.H = Hr[7] | 0;
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
      Dr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Dr[l - 15], p = Dr[l - 2], A = Un(y, 7) ^ Un(y, 18) ^ y >>> 3, m = Un(p, 17) ^ Un(p, 19) ^ p >>> 10;
      Dr[l] = m + Dr[l - 7] + A + Dr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Un(a, 6) ^ Un(a, 11) ^ Un(a, 25), p = d + y + g1(a, c, u) + b1[l] + Dr[l] | 0, m = (Un(r, 2) ^ Un(r, 13) ^ Un(r, 22)) + y1(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    _a(Dr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), _a(this.buffer);
  }
}, hp = class extends Bu {
  constructor() {
    super(28), this.A = Or[0] | 0, this.B = Or[1] | 0, this.C = Or[2] | 0, this.D = Or[3] | 0, this.E = Or[4] | 0, this.F = Or[5] | 0, this.G = Or[6] | 0, this.H = Or[7] | 0;
  }
};
const m1 = /* @__PURE__ */ fc(() => new Bu()), x1 = /* @__PURE__ */ fc(() => new hp()), S1 = Bu, pp = m1, E1 = hp, A1 = x1, v1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: E1,
  SHA256: S1,
  sha224: A1,
  sha256: pp
}, Symbol.toStringTag, { value: "Module" })), dc = /* @__PURE__ */ rc(v1), $1 = /* @__PURE__ */ rc(Bb);
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.joseToDer = Oi.derToJose = void 0;
const gp = Po, yp = tn;
function Fc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const k1 = {
  ES256: Fc(256),
  ES384: Fc(384),
  ES512: Fc(521)
};
function wp(t) {
  const e = k1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ua = 128, bp = 0, I1 = 32, L1 = 16, C1 = 2, mp = L1 | I1 | bp << 6, Ha = C1 | bp << 6;
function xp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, gp.toByteArray)((0, yp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function T1(t, e) {
  const n = xp(t), r = wp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== mp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Ua | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ha)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ha)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, p = r - d, A = new Uint8Array(y + c + p + d);
  for (o = 0; o < y; ++o)
    A[o] = 0;
  A.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const m = o; o < m + p; ++o)
    A[o] = 0;
  return A.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, yp.escape)((0, gp.fromByteArray)(A));
}
Oi.derToJose = T1;
function Zf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ua && --r, r;
}
function B1(t, e) {
  t = xp(t);
  const n = wp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Zf(t, 0, n), i = Zf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Ua, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = mp, u ? d[l++] = c : (d[l++] = Ua | 1, d[l++] = c & 255), d[l++] = Ha, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = Ha, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Oi.joseToDer = B1;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.InvalidTokenError = kr.MissingParametersError = void 0;
class M1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
kr.MissingParametersError = M1;
class N1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
kr.InvalidTokenError = N1;
const Uo = /* @__PURE__ */ rc(h1);
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.SECP256K1Client = void 0;
const P1 = ep, _1 = dc, Ea = $1, Qf = Oi, Jf = kr, td = Uo;
Ea.utils.hmacSha256Sync = (t, ...e) => {
  const n = P1.hmac.create(_1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Sp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, td.bytesToHex)(Ea.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Jf.MissingParametersError("a signing input hash and private key are all required");
    const s = Ea.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, td.bytesToHex)(s);
    if (r === "jose")
      return (0, Qf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Qf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Jf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Ea.verify(n, e, r, { strict: !1 });
  }
}
lc.SECP256K1Client = Sp;
Sp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = lc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(cc);
var Hs = {};
const U1 = /* @__PURE__ */ rc(k0);
var H1 = nn && nn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.hashSha256Async = Hs.hashSha256 = void 0;
const O1 = dc;
function Ep(t) {
  return (0, O1.sha256)(t);
}
Hs.hashSha256 = Ep;
function D1(t) {
  return H1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = U1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Ep(t));
    }
  });
}
Hs.hashSha256Async = D1;
var F1 = nn && nn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.TokenSigner = Hi.createUnsecuredToken = void 0;
const xl = tn, ed = cc, j1 = kr, nd = Hs;
function Sl(t, e) {
  const n = [], r = xl.encode(JSON.stringify(e));
  n.push(r);
  const s = xl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function z1(t) {
  return Sl(t, { typ: "JWT", alg: "none" }) + ".";
}
Hi.createUnsecuredToken = z1;
class R1 {
  constructor(e, n) {
    if (!(e && n))
      throw new j1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !ed.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ed.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Sl(e, s), o = (0, nd.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return F1(this, void 0, void 0, function* () {
      const s = this.header(r), i = Sl(e, s), o = yield (0, nd.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [xl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Hi.TokenSigner = R1;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.TokenVerifier = void 0;
const G1 = tn, rd = cc, K1 = kr, Yo = Hs;
class V1 {
  constructor(e, n) {
    if (!(e && n))
      throw new K1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !rd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = rd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Yo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Yo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), G1.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Yo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Yo.hashSha256)(r);
      return i(o);
    }
  }
}
hc.TokenVerifier = V1;
var pc = {};
Object.defineProperty(pc, "__esModule", { value: !0 });
pc.decodeToken = void 0;
const Zo = tn;
function q1(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Zo.decode(e[0])), r = JSON.parse(Zo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Zo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Zo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
pc.decodeToken = q1;
(function(t) {
  var e = nn && nn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = nn && nn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Hi, t), n(hc, t), n(pc, t), n(kr, t), n(cc, t);
})(Xe);
function W1(t) {
  return `did:btc-addr:${t}`;
}
function X1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Uf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Uf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ap(t) {
  if (t)
    return X1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Y1 = "1.4.0";
function Z1() {
  return Um();
}
function Q1(t, e, n, r = y0.slice(), s, i = Nw().getTime(), o = {}) {
  const a = (p) => {
    const A = yu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return A == null ? void 0 : A.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: _w(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Y1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Xe.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = q0(u);
  return c.iss = W1(d), new Xe.TokenSigner("ES256k", t).sign(c);
}
async function sd(t, e) {
  const n = Mo(te(e)), r = JSON.parse(n), s = await Z0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function J1(t) {
  const e = Xe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Xe.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function t2(t) {
  const e = Xe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ap(e.iss);
  if (n.length === 1) {
    if (q0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function e2(t) {
  const e = Xe.decodeToken(t).payload;
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
function n2(t) {
  const e = Xe.decodeToken(t).payload;
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
function r2(t) {
  const e = [
    n2(t),
    e2(t),
    J1(t),
    t2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const id = "1.0.0";
class cs {
  constructor(e) {
    this.version = id, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== id)
      throw new dl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new cs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class vp {
  constructor(e) {
    if (e) {
      const n = new cs(e);
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
class od extends vp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new cs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new w0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new cs({})), !0;
  }
}
class ad extends vp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Tw, !localStorage.getItem(this.key)) {
      const r = new cs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new w0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return cs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new cs({})), !0;
  }
}
var mo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(mo || (mo = {}));
var Oa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Oa || (Oa = {}));
mo.Mainnet;
var vr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(vr || (vr = {}));
var nr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(nr || (nr = {}));
vr.Mainnet;
const $p = {
  chainId: mo.Mainnet,
  transactionVersion: vr.Mainnet,
  peerNetworkId: Oa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: nr.MainnetSingleSig,
    multiSig: nr.MainnetMultiSig
  },
  client: { baseUrl: b0 }
}, El = {
  chainId: mo.Testnet,
  transactionVersion: vr.Testnet,
  peerNetworkId: Oa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: nr.TestnetSingleSig,
    multiSig: nr.TestnetMultiSig
  },
  client: { baseUrl: m0 }
}, Aa = {
  ...El,
  addressVersion: { ...El.addressVersion },
  magicBytes: "id",
  client: { baseUrl: x0 }
}, s2 = {
  ...Aa,
  addressVersion: { ...Aa.addressVersion },
  client: { ...Aa.client }
};
function i2(t) {
  switch (t) {
    case "mainnet":
      return $p;
    case "testnet":
      return El;
    case "devnet":
      return Aa;
    case "mocknet":
      return s2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function kp(t) {
  return typeof t == "string" ? i2(t) : t;
}
var cd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ld || (ld = {}));
var Hn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Hn || (Hn = {}));
const jc = ["onChainOnly", "offChainOnly", "any"];
jc[0] + "", Hn.OnChainOnly, jc[1] + "", Hn.OffChainOnly, jc[2] + "", Hn.Any, Hn.OnChainOnly + "", Hn.OnChainOnly, Hn.OffChainOnly + "", Hn.OffChainOnly, Hn.Any + "", Hn.Any;
var ud;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(dd || (dd = {}));
var Ar;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ar || (Ar = {}));
var hd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(bd || (bd = {}));
var md;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(md || (md = {}));
var xd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(xd || (xd = {}));
var Sd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Sd || (Sd = {}));
function Al(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function o2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ip(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function a2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Al(t.outputLen), Al(t.blockLen);
}
function c2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function l2(t, e) {
  Ip(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const As = {
  number: Al,
  bool: o2,
  bytes: Ip,
  hash: a2,
  exists: c2,
  output: l2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Wn = (t, e) => t << 32 - e | t >>> e, u2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!u2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function f2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mu(t) {
  if (typeof t == "string" && (t = f2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Lp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ei(t) {
  const e = (r) => t().update(Mu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Cp = class extends Lp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, As.hash(e);
    const r = Mu(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Tp = (t, e, n) => new Cp(t, e).update(n).digest();
Tp.create = (t, e) => new Cp(t, e);
function d2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Nu = class extends Lp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = zc(this.buffer);
  }
  update(e) {
    As.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Mu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = zc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    As.exists(this), As.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    d2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = zc(e), c = this.outputLen;
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
const h2 = (t, e, n) => t & e ^ ~t & n, p2 = (t, e, n) => t & e ^ t & n ^ e & n, g2 = new Uint32Array([
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
]), Fr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), jr = new Uint32Array(64);
let Bp = class extends Nu {
  constructor() {
    super(64, 32, 8, !1), this.A = Fr[0] | 0, this.B = Fr[1] | 0, this.C = Fr[2] | 0, this.D = Fr[3] | 0, this.E = Fr[4] | 0, this.F = Fr[5] | 0, this.G = Fr[6] | 0, this.H = Fr[7] | 0;
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
      jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = jr[l - 15], p = jr[l - 2], A = Wn(y, 7) ^ Wn(y, 18) ^ y >>> 3, m = Wn(p, 17) ^ Wn(p, 19) ^ p >>> 10;
      jr[l] = m + jr[l - 7] + A + jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Wn(a, 6) ^ Wn(a, 11) ^ Wn(a, 25), p = d + y + h2(a, c, u) + g2[l] + jr[l] | 0, m = (Wn(r, 2) ^ Wn(r, 13) ^ Wn(r, 22)) + p2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, y2 = class extends Bp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mp = ei(() => new Bp());
ei(() => new y2());
var ni = {}, Pu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Uo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const A = n.indexOf(o[p]) >> u;
        let m = 0;
        p !== 0 && (m = n.indexOf(o[p - 1]));
        const T = 1 + u, W = m % (1 << T) << 5 - T, X = t.c32[A + W];
        u = T, c.unshift(X);
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
      for (let A = 0; A < p; A++)
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
    let d = [], l = 0, y = 0;
    for (let m = o.length - 1; m >= 0; m--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const W = (t.c32.indexOf(o[m]) << y) + l, X = n[W % 16];
      if (y += 1, l = W >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(X);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let m = 0; m < d.length && d[m] === "0"; m++)
      p++;
    d = d.slice(p - p % 2);
    let A = d.join("");
    for (let m = 0; m < u; m++)
      A = `00${A}`;
    if (a) {
      const m = a * 2 - A.length;
      for (let T = 0; T < m; T += 2)
        A = `00${A}`;
    }
    return A;
  }
  t.c32decode = i;
})(Pu);
var Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.c32checkDecode = Os.c32checkEncode = void 0;
const Ed = dc, Ad = Uo, po = Pu;
function Np(t) {
  const e = (0, Ed.sha256)((0, Ed.sha256)((0, Ad.hexToBytes)(t)));
  return (0, Ad.bytesToHex)(e.slice(0, 4));
}
function w2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Np(`${n}${e}`), s = (0, po.c32encode)(`${e}${r}`);
  return `${po.c32[t]}${s}`;
}
Os.c32checkEncode = w2;
function b2(t) {
  t = (0, po.c32normalize)(t);
  const e = (0, po.c32decode)(t.slice(1)), n = t[0], r = po.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Np(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Os.c32checkDecode = b2;
var Pp = {}, Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.decode = Di.encode = void 0;
const Da = dc, vd = Uo, _p = z0, Up = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function m2(t, e = "00") {
  const n = typeof t == "string" ? (0, vd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, vd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Da.sha256)((0, Da.sha256)(new Uint8Array([...r, ...n])));
  return _p(Up).encode([...r, ...n, ...s.slice(0, 4)]);
}
Di.encode = m2;
function x2(t) {
  const e = _p(Up).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Da.sha256)((0, Da.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Di.decode = x2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Os, n = Di, r = Uo;
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
    const y = n.decode(d), p = (0, r.bytesToHex)(y.data), A = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let m;
    return l < 0 ? (m = A, s[A] !== void 0 && (m = s[A])) : m = l, o(m, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), p = y[0], A = y[1];
    let m;
    l < 0 ? (m = p, i[p] !== void 0 && (m = i[p])) : m = l;
    let T = m.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(A, T);
  }
  t.c32ToB58 = u;
})(Pp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Pu;
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
  const r = Pp;
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
function S2(t, e) {
  switch (e = kp(e ?? $p), t) {
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
const E2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hp = Uint8Array.from({ length: 16 }, (t, e) => e), A2 = Hp.map((t) => (9 * t + 5) % 16);
let _u = [Hp], Uu = [A2];
for (let t = 0; t < 4; t++)
  for (let e of [_u, Uu])
    e.push(e[t].map((n) => E2[n]));
const Op = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), v2 = _u.map((t, e) => t.map((n) => Op[e][n])), $2 = Uu.map((t, e) => t.map((n) => Op[e][n])), k2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), I2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qo = (t, e) => t << e | t >>> 32 - e;
function $d(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Jo = new Uint32Array(16);
let L2 = class extends Nu {
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
      Jo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, m = k2[p], T = I2[p], W = _u[p], X = Uu[p], S = v2[p], N = $2[p];
      for (let B = 0; B < 16; B++) {
        const tt = Qo(r + $d(p, i, a, u) + Jo[W[B]] + m, S[B]) + l | 0;
        r = l, l = u, u = Qo(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = Qo(s + $d(A, o, c, d) + Jo[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = Qo(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Jo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const C2 = ei(() => new L2()), ta = BigInt(2 ** 32 - 1), vl = BigInt(32);
function Dp(t, e = !1) {
  return e ? { h: Number(t & ta), l: Number(t >> vl & ta) } : { h: Number(t >> vl & ta) | 0, l: Number(t & ta) | 0 };
}
function T2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Dp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const B2 = (t, e) => BigInt(t >>> 0) << vl | BigInt(e >>> 0), M2 = (t, e, n) => t >>> n, N2 = (t, e, n) => t << 32 - n | e >>> n, P2 = (t, e, n) => t >>> n | e << 32 - n, _2 = (t, e, n) => t << 32 - n | e >>> n, U2 = (t, e, n) => t << 64 - n | e >>> n - 32, H2 = (t, e, n) => t >>> n - 32 | e << 64 - n, O2 = (t, e) => e, D2 = (t, e) => t, F2 = (t, e, n) => t << n | e >>> 32 - n, j2 = (t, e, n) => e << n | t >>> 32 - n, z2 = (t, e, n) => e << n - 32 | t >>> 64 - n, R2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function G2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const K2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), V2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, q2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), W2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, X2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Y2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Dp,
  split: T2,
  toBig: B2,
  shrSH: M2,
  shrSL: N2,
  rotrSH: P2,
  rotrSL: _2,
  rotrBH: U2,
  rotrBL: H2,
  rotr32H: O2,
  rotr32L: D2,
  rotlSH: F2,
  rotlSL: j2,
  rotlBH: z2,
  rotlBL: R2,
  add: G2,
  add3L: K2,
  add3H: V2,
  add4L: q2,
  add4H: W2,
  add5H: Y2,
  add5L: X2
}, [Z2, Q2] = Pt.split([
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
].map((t) => BigInt(t))), zr = new Uint32Array(80), Rr = new Uint32Array(80);
let gc = class extends Nu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: A, Hh: m, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = m | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      zr[S] = e.getUint32(n), Rr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = zr[S - 15] | 0, B = Rr[S - 15] | 0, tt = Pt.rotrSH(N, B, 1) ^ Pt.rotrSH(N, B, 8) ^ Pt.shrSH(N, B, 7), nt = Pt.rotrSL(N, B, 1) ^ Pt.rotrSL(N, B, 8) ^ Pt.shrSL(N, B, 7), K = zr[S - 2] | 0, z = Rr[S - 2] | 0, v = Pt.rotrSH(K, z, 19) ^ Pt.rotrBH(K, z, 61) ^ Pt.shrSH(K, z, 6), P = Pt.rotrSL(K, z, 19) ^ Pt.rotrBL(K, z, 61) ^ Pt.shrSL(K, z, 6), M = Pt.add4L(nt, P, Rr[S - 7], Rr[S - 16]), V = Pt.add4H(M, tt, v, zr[S - 7], zr[S - 16]);
      zr[S] = V | 0, Rr[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: A, Gh: m, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Pt.rotrSH(l, y, 14) ^ Pt.rotrSH(l, y, 18) ^ Pt.rotrBH(l, y, 41), B = Pt.rotrSL(l, y, 14) ^ Pt.rotrSL(l, y, 18) ^ Pt.rotrBL(l, y, 41), tt = l & p ^ ~l & m, nt = y & A ^ ~y & T, K = Pt.add5L(X, B, nt, Q2[S], Rr[S]), z = Pt.add5H(K, W, N, tt, Z2[S], zr[S]), v = K | 0, P = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), M = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      W = m | 0, X = T | 0, m = p | 0, T = A | 0, p = l | 0, A = y | 0, { h: l, l: y } = Pt.add(u | 0, d | 0, z | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Pt.add3L(v, M, ct);
      r = Pt.add3H(Y, z, P, V), s = Y | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Pt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: A } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: m, l: T } = Pt.add(this.Gh | 0, this.Gl | 0, m | 0, T | 0), { h: W, l: X } = Pt.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, A, m, T, W, X);
  }
  roundClean() {
    zr.fill(0), Rr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, J2 = class extends gc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tx = class extends gc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ex = class extends gc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ei(() => new gc());
ei(() => new J2());
ei(() => new tx());
ei(() => new ex());
var Fa = { exports: {} };
Fa.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", A = "[object Object]", m = "[object Promise]", T = "[object RegExp]", W = "[object Set]", X = "[object String]", S = "[object Symbol]", N = "[object WeakMap]", B = "[object ArrayBuffer]", tt = "[object DataView]", nt = "[object Float32Array]", K = "[object Float64Array]", z = "[object Int8Array]", v = "[object Int16Array]", P = "[object Int32Array]", M = "[object Uint8Array]", V = "[object Uint8ClampedArray]", ct = "[object Uint16Array]", Y = "[object Uint32Array]", L = /[\\^$.*+?()[\]{}|]/g, rt = /\w*$/, re = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, U = {};
  U[i] = U[o] = U[B] = U[tt] = U[a] = U[c] = U[nt] = U[K] = U[z] = U[v] = U[P] = U[y] = U[p] = U[A] = U[T] = U[W] = U[X] = U[S] = U[M] = U[V] = U[ct] = U[Y] = !0, U[u] = U[d] = U[N] = !1;
  var St = typeof nn == "object" && nn && nn.Object === Object && nn, Ot = typeof self == "object" && self && self.Object === Object && self, Tt = St || Ot || Function("return this")(), Qt = e && !e.nodeType && e, ie = Qt && !0 && t && !t.nodeType && t, x = ie && ie.exports === Qt;
  function _(g, C) {
    return g.set(C[0], C[1]), g;
  }
  function J(g, C) {
    return g.add(C), g;
  }
  function O(g, C) {
    for (var F = -1, pt = g ? g.length : 0; ++F < pt && C(g[F], F, g) !== !1; )
      ;
    return g;
  }
  function ot(g, C) {
    for (var F = -1, pt = C.length, Ve = g.length; ++F < pt; )
      g[Ve + F] = C[F];
    return g;
  }
  function st(g, C, F, pt) {
    for (var Ve = -1, sn = g ? g.length : 0; ++Ve < sn; )
      F = C(F, g[Ve], Ve, g);
    return F;
  }
  function kt(g, C) {
    for (var F = -1, pt = Array(g); ++F < g; )
      pt[F] = C(F);
    return pt;
  }
  function At(g, C) {
    return g == null ? void 0 : g[C];
  }
  function Wt(g) {
    var C = !1;
    if (g != null && typeof g.toString != "function")
      try {
        C = !!(g + "");
      } catch {
      }
    return C;
  }
  function Kt(g) {
    var C = -1, F = Array(g.size);
    return g.forEach(function(pt, Ve) {
      F[++C] = [Ve, pt];
    }), F;
  }
  function vt(g, C) {
    return function(F) {
      return g(C(F));
    };
  }
  function bt(g) {
    var C = -1, F = Array(g.size);
    return g.forEach(function(pt) {
      F[++C] = pt;
    }), F;
  }
  var Lt = Array.prototype, pe = Function.prototype, Dt = Object.prototype, le = Tt["__core-js_shared__"], mt = function() {
    var g = /[^.]+$/.exec(le && le.keys && le.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Mt = pe.toString, Ct = Dt.hasOwnProperty, De = Dt.toString, Cn = RegExp(
    "^" + Mt.call(Ct).replace(L, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), fr = x ? Tt.Buffer : void 0, E = Tt.Symbol, j = Tt.Uint8Array, R = vt(Object.getPrototypeOf, Object), G = Object.create, wt = Dt.propertyIsEnumerable, $t = Lt.splice, de = Object.getOwnPropertySymbols, Xt = fr ? fr.isBuffer : void 0, he = vt(Object.keys, Object), xe = q(Tt, "DataView"), ke = q(Tt, "Map"), Jt = q(Tt, "Promise"), Vt = q(Tt, "Set"), zt = q(Tt, "WeakMap"), Se = q(Object, "create"), ue = ye(xe), ge = ye(ke), h = ye(Jt), b = ye(Vt), f = ye(zt), H = E ? E.prototype : void 0, ut = H ? H.valueOf : void 0;
  function ht(g) {
    var C = -1, F = g ? g.length : 0;
    for (this.clear(); ++C < F; ) {
      var pt = g[C];
      this.set(pt[0], pt[1]);
    }
  }
  function dt() {
    this.__data__ = Se ? Se(null) : {};
  }
  function ee(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function He(g) {
    var C = this.__data__;
    if (Se) {
      var F = C[g];
      return F === r ? void 0 : F;
    }
    return Ct.call(C, g) ? C[g] : void 0;
  }
  function Fe(g) {
    var C = this.__data__;
    return Se ? C[g] !== void 0 : Ct.call(C, g);
  }
  function Gn(g, C) {
    var F = this.__data__;
    return F[g] = Se && C === void 0 ? r : C, this;
  }
  ht.prototype.clear = dt, ht.prototype.delete = ee, ht.prototype.get = He, ht.prototype.has = Fe, ht.prototype.set = Gn;
  function Ee(g) {
    var C = -1, F = g ? g.length : 0;
    for (this.clear(); ++C < F; ) {
      var pt = g[C];
      this.set(pt[0], pt[1]);
    }
  }
  function Tn() {
    this.__data__ = [];
  }
  function Ke(g) {
    var C = this.__data__, F = Nn(C, g);
    if (F < 0)
      return !1;
    var pt = C.length - 1;
    return F == pt ? C.pop() : $t.call(C, F, 1), !0;
  }
  function Bn(g) {
    var C = this.__data__, F = Nn(C, g);
    return F < 0 ? void 0 : C[F][1];
  }
  function fn(g) {
    return Nn(this.__data__, g) > -1;
  }
  function hs(g, C) {
    var F = this.__data__, pt = Nn(F, g);
    return pt < 0 ? F.push([g, C]) : F[pt][1] = C, this;
  }
  Ee.prototype.clear = Tn, Ee.prototype.delete = Ke, Ee.prototype.get = Bn, Ee.prototype.has = fn, Ee.prototype.set = hs;
  function Oe(g) {
    var C = -1, F = g ? g.length : 0;
    for (this.clear(); ++C < F; ) {
      var pt = g[C];
      this.set(pt[0], pt[1]);
    }
  }
  function ci() {
    this.__data__ = {
      hash: new ht(),
      map: new (ke || Ee)(),
      string: new ht()
    };
  }
  function dr(g) {
    return $(this, g).delete(g);
  }
  function It(g) {
    return $(this, g).get(g);
  }
  function Gt(g) {
    return $(this, g).has(g);
  }
  function Ie(g, C) {
    return $(this, g).set(g, C), this;
  }
  Oe.prototype.clear = ci, Oe.prototype.delete = dr, Oe.prototype.get = It, Oe.prototype.has = Gt, Oe.prototype.set = Ie;
  function Re(g) {
    this.__data__ = new Ee(g);
  }
  function li() {
    this.__data__ = new Ee();
  }
  function ps(g) {
    return this.__data__.delete(g);
  }
  function Cr(g) {
    return this.__data__.get(g);
  }
  function Mn(g) {
    return this.__data__.has(g);
  }
  function Kn(g, C) {
    var F = this.__data__;
    if (F instanceof Ee) {
      var pt = F.__data__;
      if (!ke || pt.length < n - 1)
        return pt.push([g, C]), this;
      F = this.__data__ = new Oe(pt);
    }
    return F.set(g, C), this;
  }
  Re.prototype.clear = li, Re.prototype.delete = ps, Re.prototype.get = Cr, Re.prototype.has = Mn, Re.prototype.set = Kn;
  function gs(g, C) {
    var F = Mc(g) || gi(g) ? kt(g.length, String) : [], pt = F.length, Ve = !!pt;
    for (var sn in g)
      Ct.call(g, sn) && !(Ve && (sn == "length" || ft(sn, pt))) && F.push(sn);
    return F;
  }
  function hr(g, C, F) {
    var pt = g[C];
    (!(Ct.call(g, C) && bs(pt, F)) || F === void 0 && !(C in g)) && (g[C] = F);
  }
  function Nn(g, C) {
    for (var F = g.length; F--; )
      if (bs(g[F][0], C))
        return F;
    return -1;
  }
  function Vn(g, C) {
    return g && yr(C, Nc(C), g);
  }
  function Pn(g, C, F, pt, Ve, sn, wr) {
    var on;
    if (pt && (on = sn ? pt(g, Ve, sn, wr) : pt(g)), on !== void 0)
      return on;
    if (!Fo(g))
      return g;
    var Cf = Mc(g);
    if (Cf) {
      if (on = k(g), !C)
        return hi(g, on);
    } else {
      var yi = yt(g), Tf = yi == d || yi == l;
      if (Qy(g))
        return eo(g, C);
      if (yi == A || yi == i || Tf && !sn) {
        if (Wt(g))
          return sn ? g : {};
        if (on = D(Tf ? {} : g), !C)
          return pi(g, Vn(on, g));
      } else {
        if (!U[yi])
          return sn ? g : {};
        on = lt(g, yi, Pn, C);
      }
    }
    wr || (wr = new Re());
    var Bf = wr.get(g);
    if (Bf)
      return Bf;
    if (wr.set(g, on), !Cf)
      var Mf = F ? w(g) : Nc(g);
    return O(Mf || g, function(Pc, jo) {
      Mf && (jo = Pc, Pc = g[jo]), hr(on, jo, Pn(Pc, C, F, pt, jo, g, wr));
    }), on;
  }
  function _n(g) {
    return Fo(g) ? G(g) : {};
  }
  function ys(g, C, F) {
    var pt = C(g);
    return Mc(g) ? pt : ot(pt, F(g));
  }
  function ui(g) {
    return De.call(g);
  }
  function ws(g) {
    if (!Fo(g) || Ne(g))
      return !1;
    var C = Lf(g) || Wt(g) ? Cn : re;
    return C.test(ye(g));
  }
  function Le(g) {
    if (!Ae(g))
      return he(g);
    var C = [];
    for (var F in Object(g))
      Ct.call(g, F) && F != "constructor" && C.push(F);
    return C;
  }
  function eo(g, C) {
    if (C)
      return g.slice();
    var F = new g.constructor(g.length);
    return g.copy(F), F;
  }
  function Tr(g) {
    var C = new g.constructor(g.byteLength);
    return new j(C).set(new j(g)), C;
  }
  function pr(g, C) {
    var F = C ? Tr(g.buffer) : g.buffer;
    return new g.constructor(F, g.byteOffset, g.byteLength);
  }
  function Br(g, C, F) {
    var pt = C ? F(Kt(g), !0) : Kt(g);
    return st(pt, _, new g.constructor());
  }
  function gr(g) {
    var C = new g.constructor(g.source, rt.exec(g));
    return C.lastIndex = g.lastIndex, C;
  }
  function fi(g, C, F) {
    var pt = C ? F(bt(g), !0) : bt(g);
    return st(pt, J, new g.constructor());
  }
  function Mr(g) {
    return ut ? Object(ut.call(g)) : {};
  }
  function di(g, C) {
    var F = C ? Tr(g.buffer) : g.buffer;
    return new g.constructor(F, g.byteOffset, g.length);
  }
  function hi(g, C) {
    var F = -1, pt = g.length;
    for (C || (C = Array(pt)); ++F < pt; )
      C[F] = g[F];
    return C;
  }
  function yr(g, C, F, pt) {
    F || (F = {});
    for (var Ve = -1, sn = C.length; ++Ve < sn; ) {
      var wr = C[Ve], on = void 0;
      hr(F, wr, on === void 0 ? g[wr] : on);
    }
    return F;
  }
  function pi(g, C) {
    return yr(g, et(g), C);
  }
  function w(g) {
    return ys(g, Nc, et);
  }
  function $(g, C) {
    var F = g.__data__;
    return Yt(C) ? F[typeof C == "string" ? "string" : "hash"] : F.map;
  }
  function q(g, C) {
    var F = At(g, C);
    return ws(F) ? F : void 0;
  }
  var et = de ? vt(de, Object) : ew, yt = ui;
  (xe && yt(new xe(new ArrayBuffer(1))) != tt || ke && yt(new ke()) != y || Jt && yt(Jt.resolve()) != m || Vt && yt(new Vt()) != W || zt && yt(new zt()) != N) && (yt = function(g) {
    var C = De.call(g), F = C == A ? g.constructor : void 0, pt = F ? ye(F) : void 0;
    if (pt)
      switch (pt) {
        case ue:
          return tt;
        case ge:
          return y;
        case h:
          return m;
        case b:
          return W;
        case f:
          return N;
      }
    return C;
  });
  function k(g) {
    var C = g.length, F = g.constructor(C);
    return C && typeof g[0] == "string" && Ct.call(g, "index") && (F.index = g.index, F.input = g.input), F;
  }
  function D(g) {
    return typeof g.constructor == "function" && !Ae(g) ? _n(R(g)) : {};
  }
  function lt(g, C, F, pt) {
    var Ve = g.constructor;
    switch (C) {
      case B:
        return Tr(g);
      case a:
      case c:
        return new Ve(+g);
      case tt:
        return pr(g, pt);
      case nt:
      case K:
      case z:
      case v:
      case P:
      case M:
      case V:
      case ct:
      case Y:
        return di(g, pt);
      case y:
        return Br(g, pt, F);
      case p:
      case X:
        return new Ve(g);
      case T:
        return gr(g);
      case W:
        return fi(g, pt, F);
      case S:
        return Mr(g);
    }
  }
  function ft(g, C) {
    return C = C ?? s, !!C && (typeof g == "number" || I.test(g)) && g > -1 && g % 1 == 0 && g < C;
  }
  function Yt(g) {
    var C = typeof g;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? g !== "__proto__" : g === null;
  }
  function Ne(g) {
    return !!mt && mt in g;
  }
  function Ae(g) {
    var C = g && g.constructor, F = typeof C == "function" && C.prototype || Dt;
    return g === F;
  }
  function ye(g) {
    if (g != null) {
      try {
        return Mt.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function En(g) {
    return Pn(g, !0, !0);
  }
  function bs(g, C) {
    return g === C || g !== g && C !== C;
  }
  function gi(g) {
    return Zy(g) && Ct.call(g, "callee") && (!wt.call(g, "callee") || De.call(g) == i);
  }
  var Mc = Array.isArray;
  function If(g) {
    return g != null && Jy(g.length) && !Lf(g);
  }
  function Zy(g) {
    return tw(g) && If(g);
  }
  var Qy = Xt || nw;
  function Lf(g) {
    var C = Fo(g) ? De.call(g) : "";
    return C == d || C == l;
  }
  function Jy(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function Fo(g) {
    var C = typeof g;
    return !!g && (C == "object" || C == "function");
  }
  function tw(g) {
    return !!g && typeof g == "object";
  }
  function Nc(g) {
    return If(g) ? gs(g) : Le(g);
  }
  function ew() {
    return [];
  }
  function nw() {
    return !1;
  }
  t.exports = En;
})(Fa, Fa.exports);
var nx = Fa.exports;
const Fp = /* @__PURE__ */ d0(nx);
var $l;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})($l || ($l = {}));
function rx(t, e) {
  return { type: $l.Address, version: t, hash160: e };
}
function sx(t) {
  return ni.c32address(t.version, t.hash160);
}
const ix = (t) => C2(Mp(t)), ox = (t) => xt(ix(t));
Me.hmacSha256Sync = (t, ...e) => {
  const n = Tp.create(Mp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ax(t, e = "mainnet") {
  e = kp(e), t = typeof t == "string" ? te(t) : t;
  const n = S2(Ar.P2PKH, e), r = rx(n, ox(t));
  return sx(r);
}
function cx(t, e) {
  const n = Xe.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = ax(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Xe.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function lx(t, e = null) {
  let n;
  e ? n = cx(t, e) : n = Xe.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const kd = "_blockstackDidCheckEchoReply", ux = "echoReply", fx = "authContinuation";
function dx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function hx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[kd];
  if (typeof e == "boolean")
    return e;
  const n = dx(t.location.search), r = n[ux];
  if (r) {
    t[kd] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[fx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class kl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new S0();
    else
      throw new Mw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ad(e.sessionOptions) : this.store = new ad() : e ? this.store = new od(e.sessionOptions) : this.store = new od();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Pw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new dl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Q1(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Z1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = yu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (hx())
        return Ai.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ai.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = rb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new zo("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Xe.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await r2(e))
      throw new zo("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Uc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await sd(s, i.private_key);
          } catch {
            if (Ai.warn("Failed decryption of appPrivateKey, will try to use as given"), !Me.isValidPrivateKey(i.private_key))
              throw new zo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await sd(s, c);
          } catch {
            Ai.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new zo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Vw, d;
    Uc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Uc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ap(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, y = i.profile_url;
    if (!l.profile && y) {
      const p = await n(y);
      if (!p.ok)
        l.profile = Object.assign({}, Cw);
      else {
        const A = await p.text(), m = JSON.parse(A);
        l.profile = lx(m[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new dl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Vm(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), qm(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
kl.prototype.makeAuthRequest = kl.prototype.makeAuthRequestToken;
const px = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], gx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = px(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!yc(r.id));
  return e.concat(n);
}, yc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), jp = "STX_PROVIDER", Ds = () => typeof window > "u" ? null : window.localStorage.getItem(jp), yx = (t) => {
  typeof window < "u" && window.localStorage.setItem(jp, t);
}, wx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function bx(t, e) {
  const n = {};
  return Object.assign(n, wx, e), await fetch(t, n);
}
function mx(t) {
  let e = bx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function xx(...t) {
  const { fetchLib: e, middlewares: n } = mx(t);
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
var Fi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fi || (Fi = {}));
var Fs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fs || (Fs = {}));
var Id;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Id || (Id = {}));
const Sx = "https://api.mainnet.hiro.so", Ex = "https://api.testnet.hiro.so", Ax = "http://localhost:3999", vx = ["mainnet", "testnet", "devnet", "mocknet"];
class js {
  constructor(e) {
    this.version = Fs.Mainnet, this.chainId = Fi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Fs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? xx();
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
      return new Il();
    case "testnet":
      return new Ll();
    case "devnet":
      return new $x();
    case "mocknet":
      return new zp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${vx.join(", ")}`);
  }
};
js.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : js.fromName(t);
class Il extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Mainnet, this.chainId = Fi.Mainnet;
  }
}
class Ll extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Fi.Testnet;
  }
}
class zp extends js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Fi.Testnet;
  }
}
const $x = zp;
var zs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(zs || (zs = {}));
var ja;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ja || (ja = {}));
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
const kx = {
  chainId: zs.Mainnet,
  transactionVersion: Rs.Mainnet,
  peerNetworkId: ja.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Gs.MainnetSingleSig,
    multiSig: Gs.MainnetMultiSig
  },
  client: { baseUrl: b0 }
}, Cl = {
  chainId: zs.Testnet,
  transactionVersion: Rs.Testnet,
  peerNetworkId: ja.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Gs.TestnetSingleSig,
    multiSig: Gs.TestnetMultiSig
  },
  client: { baseUrl: m0 }
}, va = {
  ...Cl,
  addressVersion: { ...Cl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: x0 }
}, Ix = {
  ...va,
  addressVersion: { ...va.addressVersion },
  client: { ...va.client }
};
function Lx(t) {
  switch (t) {
    case "mainnet":
      return kx;
    case "testnet":
      return Cl;
    case "devnet":
      return va;
    case "mocknet":
      return Ix;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Cx(t) {
  return typeof t == "string" ? Lx(t) : t;
}
function Tx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ld = /* @__PURE__ */ new Map();
function Rp(t, e) {
  const n = Ld.get(t);
  if (n !== void 0)
    return n(e);
  const r = Tx(t);
  return Ld.set(t, r), Rp(t, e);
}
let fe = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? te(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Jw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Zw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Xw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = xt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = xt(n);
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
    if (Rp(e, r))
      return r;
    throw n(r);
  }
};
const Bx = 128, Mx = 128, Gp = 16, Ts = 32, Tl = 80, wc = 65, Nx = 32, Px = 64, za = 34, _x = 1 + 16 * 1024 * 1024, Ux = 165, Hx = 16, Ox = 16, Dx = 20, Fx = Ox + 2 + Dx, jx = Fx + 4, zx = _x + (Ux + Hx * jx);
var se;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(se || (se = {}));
var Bl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Bl || (Bl = {}));
var pn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(pn || (pn = {}));
const Rc = ["onChainOnly", "offChainOnly", "any"];
Rc[0] + "", pn.OnChainOnly, Rc[1] + "", pn.OffChainOnly, Rc[2] + "", pn.Any, pn.OnChainOnly + "", pn.OnChainOnly, pn.OffChainOnly + "", pn.OffChainOnly, pn.Any + "", pn.Any;
var Ra;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ra || (Ra = {}));
var we;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(we || (we = {}));
var Te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Te || (Te = {}));
var ae;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ae || (ae = {}));
var ve;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ve || (ve = {}));
var go;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(go || (go = {}));
var Ml;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ml || (Ml = {}));
var Nl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Nl || (Nl = {}));
var en;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(en || (en = {}));
var Cd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Cd || (Cd = {}));
var Pl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Pl || (Pl = {}));
var Dn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Dn || (Dn = {}));
var Td;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Td || (Td = {}));
let bc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, vi = class extends bc {
  constructor(e) {
    super(e);
  }
}, Je = class extends bc {
  constructor(e) {
    super(e);
  }
}, Ga = class extends bc {
  constructor(e) {
    super(e);
  }
}, vs = class extends bc {
  constructor(e) {
    super(e);
  }
};
function _l(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Rx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Kp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Gx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _l(t.outputLen), _l(t.blockLen);
}
function Kx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vx(t, e) {
  Kp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: _l,
  bool: Rx,
  bytes: Kp,
  hash: Gx,
  exists: Kx,
  output: Vx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Gc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, qx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!qx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Hu(t) {
  if (typeof t == "string" && (t = Wx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Vp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ri(t) {
  const e = (r) => t().update(Hu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let qp = class extends Vp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $s.hash(e);
    const r = Hu(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Wp = (t, e, n) => new qp(t, e).update(n).digest();
Wp.create = (t, e) => new qp(t, e);
function Xx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Ou = class extends Vp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Gc(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Hu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Gc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $s.exists(this), $s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Xx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Gc(e), c = this.outputLen;
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
const Yx = (t, e, n) => t & e ^ ~t & n, Zx = (t, e, n) => t & e ^ t & n ^ e & n, Qx = new Uint32Array([
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
let Xp = class extends Ou {
  constructor() {
    super(64, 32, 8, !1), this.A = Gr[0] | 0, this.B = Gr[1] | 0, this.C = Gr[2] | 0, this.D = Gr[3] | 0, this.E = Gr[4] | 0, this.F = Gr[5] | 0, this.G = Gr[6] | 0, this.H = Gr[7] | 0;
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
      Kr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Kr[l - 15], p = Kr[l - 2], A = Xn(y, 7) ^ Xn(y, 18) ^ y >>> 3, m = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      Kr[l] = m + Kr[l - 7] + A + Kr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = d + y + Yx(a, c, u) + Qx[l] + Kr[l] | 0, m = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + Zx(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Jx = class extends Xp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Du = ri(() => new Xp());
ri(() => new Jx());
const tS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yp = Uint8Array.from({ length: 16 }, (t, e) => e), eS = Yp.map((t) => (9 * t + 5) % 16);
let Fu = [Yp], ju = [eS];
for (let t = 0; t < 4; t++)
  for (let e of [Fu, ju])
    e.push(e[t].map((n) => tS[n]));
const Zp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), nS = Fu.map((t, e) => t.map((n) => Zp[e][n])), rS = ju.map((t, e) => t.map((n) => Zp[e][n])), sS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), iS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ea = (t, e) => t << e | t >>> 32 - e;
function Bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const na = new Uint32Array(16);
let oS = class extends Ou {
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
      na[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, m = sS[p], T = iS[p], W = Fu[p], X = ju[p], S = nS[p], N = rS[p];
      for (let B = 0; B < 16; B++) {
        const tt = ea(r + Bd(p, i, a, u) + na[W[B]] + m, S[B]) + l | 0;
        r = l, l = u, u = ea(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = ea(s + Bd(A, o, c, d) + na[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = ea(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    na.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const aS = ri(() => new oS()), ra = BigInt(2 ** 32 - 1), Ul = BigInt(32);
function Qp(t, e = !1) {
  return e ? { h: Number(t & ra), l: Number(t >> Ul & ra) } : { h: Number(t >> Ul & ra) | 0, l: Number(t & ra) | 0 };
}
function cS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Qp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const lS = (t, e) => BigInt(t >>> 0) << Ul | BigInt(e >>> 0), uS = (t, e, n) => t >>> n, fS = (t, e, n) => t << 32 - n | e >>> n, dS = (t, e, n) => t >>> n | e << 32 - n, hS = (t, e, n) => t << 32 - n | e >>> n, pS = (t, e, n) => t << 64 - n | e >>> n - 32, gS = (t, e, n) => t >>> n - 32 | e << 64 - n, yS = (t, e) => e, wS = (t, e) => t, bS = (t, e, n) => t << n | e >>> 32 - n, mS = (t, e, n) => e << n | t >>> 32 - n, xS = (t, e, n) => e << n - 32 | t >>> 64 - n, SS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ES(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const AS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), vS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $S = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), kS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, IS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), LS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Qp,
  split: cS,
  toBig: lS,
  shrSH: uS,
  shrSL: fS,
  rotrSH: dS,
  rotrSL: hS,
  rotrBH: pS,
  rotrBL: gS,
  rotr32H: yS,
  rotr32L: wS,
  rotlSH: bS,
  rotlSL: mS,
  rotlBH: xS,
  rotlBL: SS,
  add: ES,
  add3L: AS,
  add3H: vS,
  add4L: $S,
  add4H: kS,
  add5H: LS,
  add5L: IS
}, [CS, TS] = _t.split([
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
let mc = class extends Ou {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: A, Hh: m, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = m | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Vr[S] = e.getUint32(n), qr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = Vr[S - 15] | 0, B = qr[S - 15] | 0, tt = _t.rotrSH(N, B, 1) ^ _t.rotrSH(N, B, 8) ^ _t.shrSH(N, B, 7), nt = _t.rotrSL(N, B, 1) ^ _t.rotrSL(N, B, 8) ^ _t.shrSL(N, B, 7), K = Vr[S - 2] | 0, z = qr[S - 2] | 0, v = _t.rotrSH(K, z, 19) ^ _t.rotrBH(K, z, 61) ^ _t.shrSH(K, z, 6), P = _t.rotrSL(K, z, 19) ^ _t.rotrBL(K, z, 61) ^ _t.shrSL(K, z, 6), M = _t.add4L(nt, P, qr[S - 7], qr[S - 16]), V = _t.add4H(M, tt, v, Vr[S - 7], Vr[S - 16]);
      Vr[S] = V | 0, qr[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: A, Gh: m, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = _t.rotrSH(l, y, 14) ^ _t.rotrSH(l, y, 18) ^ _t.rotrBH(l, y, 41), B = _t.rotrSL(l, y, 14) ^ _t.rotrSL(l, y, 18) ^ _t.rotrBL(l, y, 41), tt = l & p ^ ~l & m, nt = y & A ^ ~y & T, K = _t.add5L(X, B, nt, TS[S], qr[S]), z = _t.add5H(K, W, N, tt, CS[S], Vr[S]), v = K | 0, P = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), M = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      W = m | 0, X = T | 0, m = p | 0, T = A | 0, p = l | 0, A = y | 0, { h: l, l: y } = _t.add(u | 0, d | 0, z | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = _t.add3L(v, M, ct);
      r = _t.add3H(Y, z, P, V), s = Y | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = _t.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: A } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: m, l: T } = _t.add(this.Gh | 0, this.Gl | 0, m | 0, T | 0), { h: W, l: X } = _t.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, A, m, T, W, X);
  }
  roundClean() {
    Vr.fill(0), qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, BS = class extends mc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, MS = class extends mc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, NS = class extends mc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ri(() => new mc());
ri(() => new BS());
const PS = ri(() => new MS());
ri(() => new NS());
var qt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(qt || (qt = {}));
var je;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(je || (je = {}));
function zu(t) {
  return je[t];
}
const _S = () => ({ type: qt.BoolTrue }), US = () => ({ type: qt.BoolFalse }), HS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: qt.Buffer, value: xt(t) };
}, Md = BigInt("0xffffffffffffffffffffffffffffffff"), OS = BigInt(0), Nd = BigInt("0x7fffffffffffffffffffffffffffffff"), Pd = BigInt("-170141183460469231731687303715884105728"), DS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = pl(te(t))), un(t, Uint8Array) && (t = pl(t));
  const e = Qe(t);
  if (e > Nd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Nd}`);
  if (e < Pd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Pd}`);
  return { type: qt.Int, value: e };
}, FS = (t) => {
  const e = Qe(t);
  if (e < OS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Md)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Md}`);
  return { type: qt.UInt, value: e };
};
function jS(t) {
  return { type: qt.List, value: t };
}
function Jp() {
  return { type: qt.OptionalNone };
}
function tg(t) {
  return { type: qt.OptionalSome, value: t };
}
var at;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(at || (at = {}));
function zS() {
  return {
    type: at.Address,
    version: Gs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function _d(t) {
  if (t && lg(t, za))
    throw new Error(`Memo exceeds maximum length of ${za} bytes`);
  return { type: at.MemoString, content: t };
}
function Ru(t, e) {
  return {
    type: at.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Hl(t) {
  if (te(t).byteLength != wc)
    throw Error("Invalid signature");
  return {
    type: at.MessageSignature,
    data: t
  };
}
function RS(t, e, n) {
  return typeof t == "string" && (t = i3(t)), typeof n == "string" && (n = _d(n)), {
    type: at.Payload,
    payloadType: se.TokenTransfer,
    recipient: t,
    amount: Qe(e),
    memo: n ?? _d("")
  };
}
function GS(t, e, n, r) {
  return typeof e == "string" && (e = zn(e)), typeof n == "string" && (n = zn(n)), {
    type: at.Payload,
    payloadType: se.ContractCall,
    contractAddress: typeof t == "string" ? ds(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function KS(t) {
  return zn(t, 4, 1e5);
}
function Ud(t, e, n) {
  return typeof t == "string" && (t = zn(t)), typeof e == "string" && (e = KS(e)), typeof n == "number" ? {
    type: at.Payload,
    payloadType: se.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: at.Payload,
    payloadType: se.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function VS() {
  return { type: at.Payload, payloadType: se.PoisonMicroblock };
}
function Hd(t, e) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  return e != null ? {
    type: at.Payload,
    payloadType: se.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: at.Payload,
    payloadType: se.Coinbase,
    coinbaseBytes: t
  };
}
function qS(t, e, n) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  if (n.byteLength != Tl)
    throw Error(`VRF proof buffer size must be ${Tl} bytes`);
  return {
    type: at.Payload,
    payloadType: se.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === qt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function WS(t, e, n, r, s, i, o) {
  return {
    type: at.Payload,
    payloadType: se.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function zn(t, e, n) {
  const r = e || 1, s = n || Bx;
  if (lg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: at.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function XS(t, e, n) {
  return {
    type: at.Asset,
    address: ds(t),
    contractName: zn(e),
    assetName: zn(n)
  };
}
function ds(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: at.Address,
    version: e[0],
    hash160: e[1]
  };
}
function YS(t, e) {
  const n = ds(t), r = zn(e);
  return {
    type: at.Principal,
    prefix: en.Contract,
    address: n,
    contractName: r
  };
}
function ZS(t) {
  const e = ds(t);
  return {
    type: at.Principal,
    prefix: en.Standard,
    address: e
  };
}
function $i(t, e) {
  return {
    pubKeyEncoding: t,
    type: at.TransactionAuthField,
    contents: e
  };
}
function Sr(t) {
  switch (t.type) {
    case at.Address:
      return Ho(t);
    case at.Principal:
      return eg(t);
    case at.LengthPrefixedString:
      return zi(t);
    case at.MemoString:
      return JS(t);
    case at.Asset:
      return rg(t);
    case at.PostCondition:
      return ig(t);
    case at.PublicKey:
      return Fl(t);
    case at.LengthPrefixedList:
      return Gu(t);
    case at.Payload:
      return og(t);
    case at.TransactionAuthField:
      return s3(t);
    case at.MessageSignature:
      return Ku(t);
  }
}
function Ho(t) {
  const e = [];
  return e.push(te(Bo(t.version, 1))), e.push(te(t.hash160)), _e(e);
}
function ji(t) {
  const e = un(t, fe) ? t : new fe(t), n = sc(xt(e.readBytes(1))), r = xt(e.readBytes(20));
  return { type: at.Address, version: n, hash160: r };
}
function eg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === en.Standard || t.prefix === en.Contract) && e.push(Ho(t.address)), t.prefix === en.Contract && e.push(zi(t.contractName)), _e(e);
}
function QS(t) {
  const e = un(t, fe) ? t : new fe(t), n = e.readUInt8Enum(en, (i) => {
    throw new Je(`Unexpected Principal payload type: ${i}`);
  });
  if (n === en.Origin)
    return { type: at.Principal, prefix: n };
  const r = ji(e);
  if (n === en.Standard)
    return { type: at.Principal, prefix: n, address: r };
  const s = kn(e);
  return {
    type: at.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function zi(t) {
  const e = [], n = Qs(t.content), r = n.byteLength;
  return e.push(te(Bo(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function kn(t, e, n) {
  e = e || 1;
  const r = un(t, fe) ? t : new fe(t), s = sc(xt(r.readBytes(e))), i = Mo(r.readBytes(s));
  return zn(i, e, n ?? 128);
}
function JS(t) {
  const e = [], n = Qs(t.content), r = I3(xt(n), za * 2);
  return e.push(te(r)), _e(e);
}
function ng(t) {
  const e = un(t, fe) ? t : new fe(t);
  let n = Mo(e.readBytes(za));
  return n = n.replace(/\u0000*$/, ""), { type: at.MemoString, content: n };
}
function rg(t) {
  const e = [];
  return e.push(Ho(t.address)), e.push(zi(t.contractName)), e.push(zi(t.assetName)), _e(e);
}
function Ol(t) {
  const e = un(t, fe) ? t : new fe(t);
  return {
    type: at.Asset,
    address: ji(e),
    contractName: kn(e),
    assetName: kn(e)
  };
}
function Gu(t) {
  const e = t.values, n = [];
  n.push(te(Bo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Sr(r));
  return _e(n);
}
function sg(t, e, n) {
  const r = un(t, fe) ? t : new fe(t), s = sc(xt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case at.Address:
        i.push(ji(r));
        break;
      case at.LengthPrefixedString:
        i.push(kn(r));
        break;
      case at.MemoString:
        i.push(ng(r));
        break;
      case at.Asset:
        i.push(Ol(r));
        break;
      case at.PostCondition:
        i.push(e3(r));
        break;
      case at.PublicKey:
        i.push(jl(r));
        break;
      case at.TransactionAuthField:
        i.push(r3(r));
        break;
    }
  return Ru(i, n);
}
function t3(t) {
  return xt(ig(t));
}
function ig(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(eg(t.principal)), (t.conditionType === we.Fungible || t.conditionType === we.NonFungible) && e.push(rg(t.asset)), t.conditionType === we.NonFungible && e.push(rr(t.assetName)), e.push(t.conditionCode), t.conditionType === we.STX || t.conditionType === we.Fungible || t.conditionType === we.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new vi("The post-condition amount may not be larger than 8 bytes");
    e.push(us(t.amount, 8));
  }
  return _e(e);
}
function e3(t) {
  const e = un(t, fe) ? t : new fe(t), n = e.readUInt8Enum(we, (a) => {
    throw new Je(`Could not read ${a} as PostConditionType`);
  }), r = QS(e);
  let s, i, o;
  switch (n) {
    case we.STX:
      return s = e.readUInt8Enum(go, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${xt(e.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: we.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case we.Fungible:
      return i = Ol(e), s = e.readUInt8Enum(go, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${xt(e.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: we.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case we.NonFungible:
      i = Ol(e);
      const a = tr(e);
      return s = e.readUInt8Enum(Ml, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: at.PostCondition,
        conditionType: we.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case we.Staking:
      return s = e.readUInt8Enum(go, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${xt(e.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: we.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case we.PoX: {
      const c = e.readUInt8Enum(Nl, (u) => {
        throw new Je(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: at.PostCondition,
        conditionType: we.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function og(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case se.TokenTransfer:
      e.push(rr(t.recipient)), e.push(us(t.amount, 8)), e.push(Sr(t.memo));
      break;
    case se.ContractCall:
      e.push(Sr(t.contractAddress)), e.push(Sr(t.contractName)), e.push(Sr(t.functionName));
      const n = new Uint8Array(4);
      Ps(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(rr(r));
      });
      break;
    case se.SmartContract:
      e.push(Sr(t.contractName)), e.push(Sr(t.codeBody));
      break;
    case se.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Sr(t.contractName)), e.push(Sr(t.codeBody));
      break;
    case se.PoisonMicroblock:
      break;
    case se.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case se.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(rr(t.recipient));
      break;
    case se.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(rr(t.recipient ? tg(t.recipient) : Jp())), e.push(t.vrfProof);
      break;
    case se.TenureChange:
      e.push(te(t.tenureHash)), e.push(te(t.previousTenureHash)), e.push(te(t.burnViewHash)), e.push(te(t.previousTenureEnd)), e.push(Ps(new Uint8Array(4), t.previousTenureBlocks)), e.push(Qw(new Uint8Array(1), t.cause)), e.push(te(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function n3(t) {
  const e = un(t, fe) ? t : new fe(t);
  switch (e.readUInt8Enum(se, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case se.TokenTransfer:
      const r = tr(e), s = Qe(e.readBytes(8)), i = ng(e);
      return RS(r, s, i);
    case se.ContractCall:
      const o = ji(e), a = kn(e), c = kn(e), u = [], d = e.readUInt32BE();
      for (let N = 0; N < d; N++) {
        const B = tr(e);
        u.push(B);
      }
      return GS(o, a, c, u);
    case se.SmartContract:
      const l = kn(e), y = kn(e, 4, 1e5);
      return Ud(l, y);
    case se.VersionedSmartContract: {
      const N = e.readUInt8Enum(Bl, (nt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${nt}`);
      }), B = kn(e), tt = kn(e, 4, zx);
      return Ud(B, tt, N);
    }
    case se.PoisonMicroblock:
      return VS();
    case se.Coinbase: {
      const N = e.readBytes(Ts);
      return Hd(N);
    }
    case se.CoinbaseToAltRecipient: {
      const N = e.readBytes(Ts), B = tr(e);
      return Hd(N, B);
    }
    case se.NakamotoCoinbase: {
      const N = e.readBytes(Ts), B = tr(e), tt = e.readBytes(Tl);
      return qS(N, B, tt);
    }
    case se.TenureChange:
      const p = xt(e.readBytes(20)), A = xt(e.readBytes(20)), m = xt(e.readBytes(20)), T = xt(e.readBytes(32)), W = e.readUInt32BE(), X = e.readUInt8Enum(Pl, (N) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${N}`);
      }), S = xt(e.readBytes(20));
      return WS(p, A, m, T, W, X, S);
  }
}
function Dl(t) {
  const e = un(t, fe) ? t : new fe(t);
  return Hl(xt(e.readBytes(wc)));
}
function r3(t) {
  const e = un(t, fe) ? t : new fe(t), n = e.readUInt8Enum(Dn, (r) => {
    throw new Je(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Dn.PublicKeyCompressed:
      return $i(ve.Compressed, jl(e));
    case Dn.PublicKeyUncompressed:
      return $i(ve.Uncompressed, Yi(O3(jl(e).data)));
    case Dn.SignatureCompressed:
      return $i(ve.Compressed, Dl(e));
    case Dn.SignatureUncompressed:
      return $i(ve.Uncompressed, Dl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ku(t) {
  return te(t.data);
}
function s3(t) {
  const e = [];
  switch (t.contents.type) {
    case at.PublicKey:
      e.push(t.pubKeyEncoding === ve.Compressed ? Dn.PublicKeyCompressed : Dn.PublicKeyUncompressed), e.push(te(H3(t.contents.data)));
      break;
    case at.MessageSignature:
      e.push(t.pubKeyEncoding === ve.Compressed ? Dn.SignatureCompressed : Dn.SignatureUncompressed), e.push(Ku(t.contents));
      break;
  }
  return _e(e);
}
function Fl(t) {
  return t.data.slice();
}
function jl(t) {
  const e = un(t, fe) ? t : new fe(t), n = e.readUInt8(), r = n === 4 ? Px : Nx;
  return Yi(_e([n, e.readBytes(r)]));
}
function Vu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ae.P2PKH || e === ae.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ae.P2WPKH || e === ae.P2WSH || e === ae.P2WSHNonSequential) && !r.map((s) => s.data).every(Zi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ae.P2PKH:
      return sa(t, L3(r[0].data));
    case ae.P2WPKH:
      return sa(t, C3(r[0].data));
    case ae.P2SH:
    case ae.P2SHNonSequential:
      return sa(t, T3(n, r.map(Fl)));
    case ae.P2WSH:
    case ae.P2WSHNonSequential:
      return sa(t, B3(n, r.map(Fl)));
  }
}
function sa(t, e) {
  return { type: at.Address, version: t, hash160: e };
}
function qu(t) {
  return ni.c32address(t.version, t.hash160);
}
function Od(t) {
  const [e, n, r] = t.split(/\.|::/);
  return XS(e, n, r);
}
function io(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return YS(e, n);
  } else
    return ZS(t);
}
function i3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return c3(e, n);
  } else
    return o3(t);
}
function o3(t) {
  const e = ds(t);
  return { type: qt.PrincipalStandard, value: qu(e) };
}
function a3(t) {
  return { type: qt.PrincipalStandard, value: qu(t) };
}
function c3(t, e) {
  const n = ds(t), r = zn(e);
  return ag(n, r);
}
function ag(t, e) {
  if (Qs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: qt.PrincipalContract,
    value: `${qu(t)}.${e.content}`
  };
}
function l3(t) {
  return { type: qt.ResponseErr, value: t };
}
function u3(t) {
  return { type: qt.ResponseOk, value: t };
}
const f3 = (t) => ({ type: qt.StringASCII, value: t }), d3 = (t) => ({ type: qt.StringUTF8, value: t });
function h3(t) {
  for (const e in t)
    if (!M3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: qt.Tuple, value: t };
}
function tr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new fe(te(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new fe(t) : e = t;
  switch (e.readUInt8Enum(je, (r) => {
    throw new Je(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case je.int:
      return DS(pl(e.readBytes(16)));
    case je.uint:
      return FS(e.readBytes(16));
    case je.buffer:
      const r = e.readUInt32BE();
      return HS(e.readBytes(r));
    case je.true:
      return _S();
    case je.false:
      return US();
    case je.address:
      const s = ji(e);
      return a3(s);
    case je.contract:
      const i = ji(e), o = kn(e);
      return ag(i, o);
    case je.ok:
      return u3(tr(e));
    case je.err:
      return l3(tr(e));
    case je.none:
      return Jp();
    case je.some:
      return tg(tr(e));
    case je.list:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(tr(e));
      return jS(c);
    case je.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let m = 0; m < u; m++) {
        const T = kn(e).content;
        if (T === void 0)
          throw new Je('"content" is undefined');
        d[T] = tr(e);
      }
      return h3(d);
    case je.ascii:
      const l = e.readUInt32BE(), y = Gw(e.readBytes(l));
      return f3(y);
    case je.utf8:
      const p = e.readUInt32BE(), A = Mo(e.readBytes(p));
      return d3(A);
    default:
      throw new Je("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function cr(t, e) {
  return _e([zu(t), e]);
}
function p3(t) {
  return new Uint8Array([zu(t.type)]);
}
function g3(t) {
  return t.type === qt.OptionalNone ? new Uint8Array([zu(t.type)]) : cr(t.type, rr(t.value));
}
function y3(t) {
  const e = new Uint8Array(4);
  return Ps(e, Math.ceil(t.value.length / 2), 0), cr(t.type, or(e, te(t.value)));
}
function w3(t) {
  const e = wu(Dw(BigInt(t.value), BigInt(Mx)), Gp);
  return cr(t.type, e);
}
function b3(t) {
  const e = wu(BigInt(t.value), Gp);
  return cr(t.type, e);
}
function m3(t) {
  return cr(t.type, Ho(ds(t.value)));
}
function x3(t) {
  const [e, n] = N3(t.value);
  return cr(t.type, or(Ho(ds(e)), zi(zn(n))));
}
function S3(t) {
  return cr(t.type, rr(t.value));
}
function E3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = rr(r);
    e.push(s);
  }
  return cr(t.type, _e(e));
}
function A3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = zn(s);
    e.push(zi(i));
    const o = rr(t.value[s]);
    e.push(o);
  }
  return cr(t.type, _e(e));
}
function cg(t, e) {
  const n = [], r = e == "ascii" ? Rw(t.value) : Qs(t.value), s = new Uint8Array(4);
  return Ps(s, r.length, 0), n.push(s), n.push(r), cr(t.type, _e(n));
}
function v3(t) {
  return cg(t, "ascii");
}
function $3(t) {
  return cg(t, "utf8");
}
function Dd(t) {
  return xt(rr(t));
}
function rr(t) {
  switch (t.type) {
    case qt.BoolTrue:
    case qt.BoolFalse:
      return p3(t);
    case qt.OptionalNone:
    case qt.OptionalSome:
      return g3(t);
    case qt.Buffer:
      return y3(t);
    case qt.UInt:
      return b3(t);
    case qt.Int:
      return w3(t);
    case qt.PrincipalStandard:
      return m3(t);
    case qt.PrincipalContract:
      return x3(t);
    case qt.ResponseOk:
    case qt.ResponseErr:
      return S3(t);
    case qt.List:
      return E3(t);
    case qt.Tuple:
      return A3(t);
    case qt.StringASCII:
      return v3(t);
    case qt.StringUTF8:
      return $3(t);
    default:
      throw new vi("Unable to serialize. Invalid Clarity Value.");
  }
}
const k3 = (t) => t.length % 2 ? `0${t}` : t, I3 = (t, e) => t.padEnd(e, "0"), lg = (t, e) => t ? Qs(t).length > e : !1;
function zl(t) {
  return Fp(t);
}
const xo = (t) => aS(Du(t)), Wu = (t) => xt(PS(t)), L3 = (t) => xt(xo(t)), C3 = (t) => {
  const e = xo(t), n = or(new Uint8Array([0]), new Uint8Array([e.length]), e), r = xo(n);
  return xt(r);
}, T3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = xo(r);
  return xt(s);
}, B3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = Du(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = xo(o);
  return xt(a);
};
function M3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function N3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Me.hmacSha256Sync = (t, ...e) => {
  const n = Wp.create(Du, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Yi(t) {
  return t = typeof t == "string" ? te(t) : t, {
    type: at.PublicKey,
    data: t
  };
}
function P3(t, e, n = ve.Compressed) {
  const r = Ww(e), s = new mn(Df(r.r), Df(r.s)), i = jt.fromSignature(t, s, r.recoveryId), o = n === ve.Compressed;
  return i.toHex(o);
}
function _3(t) {
  return typeof t == "string" ? t : xt(t);
}
const Xu = _3;
function ug(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === qw;
}
function Zi(t) {
  return !Xu(t).startsWith("04");
}
function U3(t) {
  t = bu(t);
  const e = ug(t);
  return xt(No(t.slice(0, 32), e));
}
function H3(t) {
  return jt.fromHex(Xu(t)).toHex(!0);
}
function O3(t) {
  return jt.fromHex(Xu(t)).toHex(!1);
}
function D3(t, e) {
  t = bu(t);
  const [n, r] = oc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Bo(r, 1) + mn.fromHex(n).toCompactHex();
}
function Yu() {
  return {
    type: at.MessageSignature,
    data: xt(new Uint8Array(wc))
  };
}
function fg(t, e, n, r) {
  const s = Vu(0, t, 1, [Yi(e)]).hash160, i = Zi(e) ? ve.Compressed : ve.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Qe(n),
    fee: Qe(r),
    keyEncoding: i,
    signature: Yu()
  };
}
function So(t) {
  return "signature" in t;
}
function Fd(t) {
  return t === ae.P2SH || t === ae.P2WSH;
}
function F3(t) {
  return t === ae.P2SHNonSequential || t === ae.P2WSHNonSequential;
}
function jd(t) {
  const e = zl(t);
  return e.nonce = 0, e.fee = 0, So(e) ? e.signature = Yu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function j3(t) {
  const e = [
    t.hashMode,
    te(t.signer),
    us(t.nonce, 8),
    us(t.fee, 8),
    t.keyEncoding,
    Ku(t.signature)
  ];
  return _e(e);
}
function z3(t) {
  const e = [
    t.hashMode,
    te(t.signer),
    us(t.nonce, 8),
    us(t.fee, 8)
  ], n = Ru(t.fields);
  e.push(Gu(n));
  const r = new Uint8Array(2);
  return Yw(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function R3(t, e) {
  const n = xt(e.readBytes(20)), r = BigInt(`0x${xt(e.readBytes(8))}`), s = BigInt(`0x${xt(e.readBytes(8))}`), i = e.readUInt8Enum(ve, (a) => {
    throw new Je(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ae.P2WPKH && i != ve.Compressed)
    throw new Je("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Dl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function G3(t, e) {
  const n = xt(e.readBytes(20)), r = BigInt("0x" + xt(e.readBytes(8))), s = BigInt("0x" + xt(e.readBytes(8))), i = sg(e, at.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case at.PublicKey:
        Zi(u.contents.data) || (o = !0);
        break;
      case at.MessageSignature:
        if (u.pubKeyEncoding === ve.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new vs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ae.P2WSH || t === ae.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Kc(t) {
  return So(t) ? j3(t) : z3(t);
}
function Vc(t) {
  const e = t.readUInt8Enum(ae, (n) => {
    throw new Je(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ae.P2PKH || e === ae.P2WPKH ? R3(e, t) : G3(e, t);
}
function dg(t, e, n, r) {
  const i = t + xt(new Uint8Array([e])) + xt(us(n, 8)) + xt(us(r, 8));
  if (te(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Wu(te(i));
}
function hg(t, e, n) {
  const r = 33 + wc, s = Zi(e.data) ? ve.Compressed : ve.Uncompressed, i = t + k3(s.toString(16)) + n, o = te(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Wu(o);
}
function K3(t, e, n, r, s) {
  const i = dg(t, e, n, r), o = D3(s, i), a = Yi(U3(s)), c = hg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function pg(t, e, n, r, s, i) {
  const o = dg(t, e, n, r), a = Yi(P3(o, i, s)), c = hg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function V3() {
  const t = fg(ae.P2PKH, "", 0, 0);
  return t.signer = zS().hash160, t.keyEncoding = ve.Compressed, t.signature = Yu(), t;
}
function zd(t, e, n) {
  return So(t) ? q3(t, e, n) : W3(t, e, n);
}
function q3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = pg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Vu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function W3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case at.PublicKey:
        Zi(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case at.MessageSignature:
        c.pubKeyEncoding === ve.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = pg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Fd(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new vs("Too many signatures");
        break;
    }
  if (Fd(t.hashMode) && o !== t.signaturesRequired || F3(t.hashMode) && o < t.signaturesRequired)
    throw new vs("Incorrect number of signatures");
  if (i && (t.hashMode === ae.P2WSH || t.hashMode === ae.P2WSHNonSequential))
    throw new vs("Uncompressed keys are not allowed in this hash mode");
  const a = Vu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new vs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function gg(t) {
  return {
    authType: Te.Standard,
    spendingCondition: t
  };
}
function yg(t, e) {
  return {
    authType: Te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || fg(ae.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Rd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Te.Standard:
        return gg(jd(t.spendingCondition));
      case Te.Sponsored:
        return yg(jd(t.spendingCondition), V3());
      default:
        throw new Ga("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function X3(t, e) {
  switch (t.authType) {
    case Te.Standard:
      return zd(t.spendingCondition, e, Te.Standard);
    case Te.Sponsored:
      return zd(t.spendingCondition, e, Te.Standard);
    default:
      throw new Ga("Invalid origin auth type");
  }
}
function Y3(t, e) {
  switch (t.authType) {
    case Te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Qe(e)
      };
      return { ...t, spendingCondition: n };
    case Te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Qe(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Z3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Qe(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Q3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Qe(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function J3(t, e) {
  const n = {
    ...e,
    nonce: Qe(e.nonce),
    fee: Qe(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function tE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Te.Standard:
      e.push(Kc(t.spendingCondition));
      break;
    case Te.Sponsored:
      e.push(Kc(t.spendingCondition)), e.push(Kc(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function eE(t) {
  const e = t.readUInt8Enum(Te, (r) => {
    throw new Je(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Te.Standard:
      return n = Vc(t), gg(n);
    case Te.Sponsored:
      n = Vc(t);
      const r = Vc(t);
      return yg(n, r);
  }
}
class nE {
  constructor({ auth: e, payload: n, postConditions: r = Ru([]), postConditionMode: s = Ra.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Cx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Qe(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = pn.Any;
  }
  signBegin() {
    const e = zl(this);
    return e.auth = Rd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = zl(this);
    return e.auth = Rd(e.auth), e.txid();
  }
  verifyOrigin() {
    return X3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Yi(e), r = this.auth.spendingCondition;
    if (r && !So(r)) {
      const s = Zi(n.data);
      r.fields.push($i(s ? ve.Compressed : ve.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = K3(n, r, e.fee, e.nonce, s);
    if (So(e))
      e.signature = Hl(i);
    else {
      const a = ug(s);
      e.fields.push($i(a ? ve.Compressed : ve.Uncompressed, Hl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Wu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = J3(this.auth, e);
  }
  setFee(e) {
    this.auth = Y3(this.auth, e);
  }
  setNonce(e) {
    this.auth = Z3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Q3(this.auth, e);
  }
  serialize() {
    return xt(this.serializeBytes());
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
    return Ps(n, this.chainId, 0), e.push(n), e.push(tE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Gu(this.postConditions)), e.push(og(this.payload)), _e(e);
  }
}
function rE(t) {
  const e = un(t, fe) ? t : new fe(t), n = e.readUInt8Enum(Rs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = eE(e), i = e.readUInt8Enum(pn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Ra, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = sg(e, at.PostCondition), c = n3(e), u = new nE({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Gd = BigInt("18446744073709551615");
function qc(t) {
  const e = Qe(t);
  if (e < 0n || e > Gd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Gd} (u64 max), received: ${e}`);
  return e;
}
var Rl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Rl || (Rl = {}));
var Gl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Gl || (Gl = {}));
function sE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: at.PostCondition,
        conditionType: we.STX,
        principal: t.address === "origin" ? { type: at.Principal, prefix: en.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        amount: qc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: at.PostCondition,
        conditionType: we.Fungible,
        principal: t.address === "origin" ? { type: at.Principal, prefix: en.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        amount: qc(t.amount),
        asset: Od(t.asset)
      };
    case "nft-postcondition":
      return {
        type: at.PostCondition,
        conditionType: we.NonFungible,
        principal: t.address === "origin" ? { type: at.Principal, prefix: en.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        asset: Od(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: at.PostCondition,
        conditionType: we.Staking,
        principal: t.address === "origin" ? { type: at.Principal, prefix: en.Origin } : io(t.address),
        conditionCode: ia(t.condition),
        amount: qc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: at.PostCondition,
        conditionType: we.PoX,
        principal: t.address === "origin" ? { type: at.Principal, prefix: en.Origin } : io(t.address),
        conditionCode: iE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ia(t) {
  return Rl[t];
}
function iE(t) {
  return Gl[t];
}
function wg(t) {
  const e = sE(t);
  return t3(e);
}
function oE(t, e, n) {
  return Qu(bg(t), n);
}
function bg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Eo(r);
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
    return BigInt(`0x${lE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Zu(t, e = 8) {
  return (typeof t == "bigint" ? t : bg(t)).toString(16).padStart(e * 2, "0");
}
function Qu(t, e = 16) {
  const n = Zu(t, e);
  return Eo(n);
}
function aE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const cE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += cE[n];
  return e;
}
function Eo(t) {
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
function Ju(t) {
  return new TextEncoder().encode(t);
}
function uE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function fE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Kd(t) {
  if (t.some(fE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function tf(...t) {
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
function Lr(t) {
  return tf(...t.map((e) => typeof e == "number" ? Kd([e]) : e instanceof Array ? Kd(e) : e));
}
function xc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Kl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Kl || (Kl = {}));
Kl.Mainnet;
const dE = 128, hE = 128, mg = 16;
var Vl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Vl || (Vl = {}));
var Vd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Vd || (Vd = {}));
var qd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(qd || (qd = {}));
var On;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(On || (On = {}));
const Wc = ["onChainOnly", "offChainOnly", "any"];
Wc[0] + "", On.OnChainOnly, Wc[1] + "", On.OffChainOnly, Wc[2] + "", On.Any, On.OnChainOnly + "", On.OnChainOnly, On.OffChainOnly + "", On.OffChainOnly, On.Any + "", On.Any;
var ql;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ql || (ql = {}));
ql.Mainnet;
var Wd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Wd || (Wd = {}));
var xs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(xs || (xs = {}));
var Xd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Jd || (Jd = {}));
var th;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(th || (th = {}));
var Wl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Wl || (Wl = {}));
var eh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(eh || (eh = {}));
var nh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(nh || (nh = {}));
function Xl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function pE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function xg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function gE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Xl(t.outputLen), Xl(t.blockLen);
}
function yE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function wE(t, e) {
  xg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Xc = {
  number: Xl,
  bool: pE,
  bytes: xg,
  hash: gE,
  exists: yE,
  output: wE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Yc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Yn = (t, e) => t << 32 - e | t >>> e, bE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!bE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function mE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Sg(t) {
  if (typeof t == "string" && (t = mE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let xE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function si(t) {
  const e = (r) => t().update(Sg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function SE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ef = class extends xE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Yc(this.buffer);
  }
  update(e) {
    Xc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Sg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Yc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Xc.exists(this), Xc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    SE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Yc(e), c = this.outputLen;
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
const EE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Eg = Uint8Array.from({ length: 16 }, (t, e) => e), AE = Eg.map((t) => (9 * t + 5) % 16);
let nf = [Eg], rf = [AE];
for (let t = 0; t < 4; t++)
  for (let e of [nf, rf])
    e.push(e[t].map((n) => EE[n]));
const Ag = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), vE = nf.map((t, e) => t.map((n) => Ag[e][n])), $E = rf.map((t, e) => t.map((n) => Ag[e][n])), kE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), IE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), oa = (t, e) => t << e | t >>> 32 - e;
function rh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const aa = new Uint32Array(16);
let LE = class extends ef {
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
      aa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, m = kE[p], T = IE[p], W = nf[p], X = rf[p], S = vE[p], N = $E[p];
      for (let B = 0; B < 16; B++) {
        const tt = oa(r + rh(p, i, a, u) + aa[W[B]] + m, S[B]) + l | 0;
        r = l, l = u, u = oa(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = oa(s + rh(A, o, c, d) + aa[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = oa(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    aa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
si(() => new LE());
const CE = (t, e, n) => t & e ^ ~t & n, TE = (t, e, n) => t & e ^ t & n ^ e & n, BE = new Uint32Array([
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
let vg = class extends ef {
  constructor() {
    super(64, 32, 8, !1), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
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
      Xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Xr[l - 15], p = Xr[l - 2], A = Yn(y, 7) ^ Yn(y, 18) ^ y >>> 3, m = Yn(p, 17) ^ Yn(p, 19) ^ p >>> 10;
      Xr[l] = m + Xr[l - 7] + A + Xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Yn(a, 6) ^ Yn(a, 11) ^ Yn(a, 25), p = d + y + CE(a, c, u) + BE[l] + Xr[l] | 0, m = (Yn(r, 2) ^ Yn(r, 13) ^ Yn(r, 22)) + TE(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ME = class extends vg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
si(() => new vg());
si(() => new ME());
const ca = BigInt(2 ** 32 - 1), Yl = BigInt(32);
function $g(t, e = !1) {
  return e ? { h: Number(t & ca), l: Number(t >> Yl & ca) } : { h: Number(t >> Yl & ca) | 0, l: Number(t & ca) | 0 };
}
function NE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = $g(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const PE = (t, e) => BigInt(t >>> 0) << Yl | BigInt(e >>> 0), _E = (t, e, n) => t >>> n, UE = (t, e, n) => t << 32 - n | e >>> n, HE = (t, e, n) => t >>> n | e << 32 - n, OE = (t, e, n) => t << 32 - n | e >>> n, DE = (t, e, n) => t << 64 - n | e >>> n - 32, FE = (t, e, n) => t >>> n - 32 | e << 64 - n, jE = (t, e) => e, zE = (t, e) => t, RE = (t, e, n) => t << n | e >>> 32 - n, GE = (t, e, n) => e << n | t >>> 32 - n, KE = (t, e, n) => e << n - 32 | t >>> 64 - n, VE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function qE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const WE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), XE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, YE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ZE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, QE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), JE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: $g,
  split: NE,
  toBig: PE,
  shrSH: _E,
  shrSL: UE,
  rotrSH: HE,
  rotrSL: OE,
  rotrBH: DE,
  rotrBL: FE,
  rotr32H: jE,
  rotr32L: zE,
  rotlSH: RE,
  rotlSL: GE,
  rotlBH: KE,
  rotlBL: VE,
  add: qE,
  add3L: WE,
  add3H: XE,
  add4L: YE,
  add4H: ZE,
  add5H: JE,
  add5L: QE
}, [tA, eA] = Ut.split([
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
let Sc = class extends ef {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: A, Hh: m, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = m | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      Yr[S] = e.getUint32(n), Zr[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = Yr[S - 15] | 0, B = Zr[S - 15] | 0, tt = Ut.rotrSH(N, B, 1) ^ Ut.rotrSH(N, B, 8) ^ Ut.shrSH(N, B, 7), nt = Ut.rotrSL(N, B, 1) ^ Ut.rotrSL(N, B, 8) ^ Ut.shrSL(N, B, 7), K = Yr[S - 2] | 0, z = Zr[S - 2] | 0, v = Ut.rotrSH(K, z, 19) ^ Ut.rotrBH(K, z, 61) ^ Ut.shrSH(K, z, 6), P = Ut.rotrSL(K, z, 19) ^ Ut.rotrBL(K, z, 61) ^ Ut.shrSL(K, z, 6), M = Ut.add4L(nt, P, Zr[S - 7], Zr[S - 16]), V = Ut.add4H(M, tt, v, Yr[S - 7], Yr[S - 16]);
      Yr[S] = V | 0, Zr[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: A, Gh: m, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Ut.rotrSH(l, y, 14) ^ Ut.rotrSH(l, y, 18) ^ Ut.rotrBH(l, y, 41), B = Ut.rotrSL(l, y, 14) ^ Ut.rotrSL(l, y, 18) ^ Ut.rotrBL(l, y, 41), tt = l & p ^ ~l & m, nt = y & A ^ ~y & T, K = Ut.add5L(X, B, nt, eA[S], Zr[S]), z = Ut.add5H(K, W, N, tt, tA[S], Yr[S]), v = K | 0, P = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), M = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      W = m | 0, X = T | 0, m = p | 0, T = A | 0, p = l | 0, A = y | 0, { h: l, l: y } = Ut.add(u | 0, d | 0, z | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Ut.add3L(v, M, ct);
      r = Ut.add3H(Y, z, P, V), s = Y | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ut.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ut.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: A } = Ut.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: m, l: T } = Ut.add(this.Gh | 0, this.Gl | 0, m | 0, T | 0), { h: W, l: X } = Ut.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, A, m, T, W, X);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, nA = class extends Sc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, rA = class extends Sc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, sA = class extends Sc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
si(() => new Sc());
si(() => new nA());
si(() => new rA());
si(() => new sA());
function iA(t, e, n) {
  const s = dE;
  if (SA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Vl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ge;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ge || (Ge = {}));
let oA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, kg = class extends oA {
  constructor(e) {
    super(e);
  }
};
function Ec(t) {
  const e = [];
  return e.push(Eo(Zu(t.version, 1))), e.push(Eo(t.hash160)), Lr(e);
}
function aA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Ec(t.address)), t.prefix === Wl.Contract && e.push(Ao(t.contractName)), Lr(e);
}
function Ao(t) {
  const e = [], n = Ju(t.content), r = n.byteLength;
  return e.push(Eo(Zu(r, t.lengthPrefixBytes))), e.push(n), Lr(e);
}
function cA(t) {
  const e = [];
  return e.push(Ec(t.address)), e.push(Ao(t.contractName)), e.push(Ao(t.assetName)), Lr(e);
}
function Ig(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(aA(t.principal)), (t.conditionType === xs.Fungible || t.conditionType === xs.NonFungible) && e.push(cA(t.assetInfo)), t.conditionType === xs.NonFungible && e.push(Ks(t.assetName)), e.push(t.conditionCode), t.conditionType === xs.STX || t.conditionType === xs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new kg("The post-condition amount may not be larger than 8 bytes");
    e.push(oE(t.amount, !1, 8));
  }
  return Lr(e);
}
function lr(t, e) {
  return Lr([t, e]);
}
function lA(t) {
  return new Uint8Array([t.type]);
}
function uA(t) {
  return t.type === Ge.OptionalNone ? new Uint8Array([t.type]) : lr(t.type, Ks(t.value));
}
function fA(t) {
  const e = new Uint8Array(4);
  return xc(e, t.buffer.length, 0), lr(t.type, tf(e, t.buffer));
}
function dA(t) {
  const e = Qu(aE(t.value, BigInt(hE)), mg);
  return lr(t.type, e);
}
function hA(t) {
  const e = Qu(t.value, mg);
  return lr(t.type, e);
}
function pA(t) {
  return lr(t.type, Ec(t.address));
}
function gA(t) {
  return lr(t.type, tf(Ec(t.address), Ao(t.contractName)));
}
function yA(t) {
  return lr(t.type, Ks(t.value));
}
function wA(t) {
  const e = [], n = new Uint8Array(4);
  xc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ks(r);
    e.push(s);
  }
  return lr(t.type, Lr(e));
}
function bA(t) {
  const e = [], n = new Uint8Array(4);
  xc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = iA(s);
    e.push(Ao(i));
    const o = Ks(t.data[s]);
    e.push(o);
  }
  return lr(t.type, Lr(e));
}
function Lg(t, e) {
  const n = [], r = e == "ascii" ? uE(t.data) : Ju(t.data), s = new Uint8Array(4);
  return xc(s, r.length, 0), n.push(s), n.push(r), lr(t.type, Lr(n));
}
function mA(t) {
  return Lg(t, "ascii");
}
function xA(t) {
  return Lg(t, "utf8");
}
function Ks(t) {
  switch (t.type) {
    case Ge.BoolTrue:
    case Ge.BoolFalse:
      return lA(t);
    case Ge.OptionalNone:
    case Ge.OptionalSome:
      return uA(t);
    case Ge.Buffer:
      return fA(t);
    case Ge.UInt:
      return hA(t);
    case Ge.Int:
      return dA(t);
    case Ge.PrincipalStandard:
      return pA(t);
    case Ge.PrincipalContract:
      return gA(t);
    case Ge.ResponseOk:
    case Ge.ResponseErr:
      return yA(t);
    case Ge.List:
      return wA(t);
    case Ge.Tuple:
      return bA(t);
    case Ge.StringASCII:
      return mA(t);
    case Ge.StringUTF8:
      return xA(t);
    default:
      throw new kg("Unable to serialize. Invalid Clarity Value.");
  }
}
const SA = (t, e) => t ? Ju(t).length > e : !1, EA = "connect-ui";
let $a, Cg, gn = !1, Zl = !1;
const Ir = (t, e = "") => () => {
}, AA = (t, e) => () => {
}, vA = "{visibility:hidden}.hydrated{visibility:inherit}", sh = {}, $A = "http://www.w3.org/2000/svg", kA = "http://www.w3.org/1999/xhtml", IA = (t) => t != null, sf = (t) => (t = typeof t, t === "object" || t === "function");
function Tg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Bt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !sf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Ql(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Ql(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Ql = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, LA = {}, CA = (t) => t && t.$tag$ === LA, TA = (t, e) => t != null && !sf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, BA = (t) => Qi(t).$hostElement$, MA = (t, e, n) => {
  const r = Ze.ce(e, n);
  return t.dispatchEvent(r), r;
}, ih = /* @__PURE__ */ new WeakMap(), NA = (t, e, n) => {
  let r = Ka.get(t);
  JA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ka.set(t, r);
}, PA = (t, e, n, r) => {
  var s;
  let i = Bg(e);
  const o = Ka.get(i);
  if (t = t.nodeType === 11 ? t : sr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = ih.get(t), c;
      if (a || ih.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = sr.createElement("style"), c.innerHTML = o;
          const u = (s = Ze.$nonce$) !== null && s !== void 0 ? s : Tg(sr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, _A = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ir("attachStyles", e.$tagName$), i = PA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Bg = (t, e) => "sc-" + t.$tagName$, oh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = ch(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = ah(n), d = ah(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ch(Ac, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Ze.rel(t, e, n, !1), r && Ze.ael(t, e, r, !1);
    else {
      const c = sf(r);
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
}, UA = /\s/, ah = (t) => t ? t.split(UA) : [], Mg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || sh, o = e.$attrs$ || sh;
  for (r in i)
    r in o || oh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    oh(s, r, i[r], o[r], n, e.$flags$);
}, of = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = sr.createTextNode(s.$text$);
  else {
    if (gn || (gn = s.$tag$ === "svg"), o = s.$elm$ = sr.createElementNS(gn ? $A : kA, s.$tag$), gn && s.$tag$ === "foreignObject" && (gn = !1), Mg(null, s, gn), IA($a) && o["s-si"] !== $a && o.classList.add(o["s-si"] = $a), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = of(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? gn = !1 : o.tagName === "foreignObject" && (gn = !0);
  }
  return o;
}, Ng = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Cg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = of(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Pg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, HA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : la(a, d) ? (lo(a, d), a = e[++s], d = r[++i]) : la(c, l) ? (lo(c, l), c = e[--o], l = r[--u]) : la(a, l) ? (lo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : la(c, d) ? (lo(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (y = of(e && e[i], n, i), d = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Ng(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Pg(e, s, o);
}, la = (t, e) => t.$tag$ === e.$tag$, lo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (gn = i === "svg" ? !0 : i === "foreignObject" ? !1 : gn, Mg(t, e, gn), r !== null && s !== null ? HA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Ng(n, null, e, s, 0, s.length - 1)) : r !== null && Pg(r, 0, r.length - 1), gn && i === "svg" && (gn = !1)) : t.$text$ !== o && (n.data = o);
}, OA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Ql(null, null), s = CA(e) ? e : Bt(null, null, e);
  Cg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, $a = n["s-sc"], lo(r, s);
}, _g = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, af = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return _g(t, t.$ancestorComponent$), e4(() => DA(t, e));
}, DA = (t, e) => {
  const n = Ir("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), RA(s, () => FA(t, r, e));
}, FA = async (t, e, n) => {
  const r = t.$hostElement$, s = Ir("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && _A(t);
  const o = Ir("render", t.$cmpMeta$.$tagName$);
  jA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => zA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, jA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, OA(t, e);
  } catch (r) {
    vo(r, t.$hostElement$);
  }
  return null;
}, zA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ir("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Hg(n), r(), t.$onReadyResolve$(n), s || Ug()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && lf(() => af(t, !1)), t.$flags$ &= -517;
}, Ug = (t) => {
  Hg(sr.documentElement), lf(() => MA(Ac, "appload", { detail: { namespace: EA } }));
}, RA = (t, e) => t && t.then ? t.then(e) : e(), Hg = (t) => t.classList.add("hydrated"), GA = (t, e) => Qi(t).$instanceValues$.get(e), KA = (t, e, n, r) => {
  const s = Qi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = TA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && af(s, !1));
}, Og = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return GA(this, i);
        },
        set(a) {
          KA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Ze.jmp(() => {
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
}, VA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = QA(n), s.then) {
        const c = AA();
        s = await s, c();
      }
      s.isProxied || (Og(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ir("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        vo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Bg(n);
      if (!Ka.has(c)) {
        const u = Ir("registerStyles", n.$tagName$);
        NA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => af(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, qA = (t) => {
  if (!(Ze.$flags$ & 1)) {
    const e = Qi(t), n = e.$cmpMeta$, r = Ir("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            _g(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), VA(t, e, n);
    }
    r();
  }
}, WA = (t) => {
  Ze.$flags$ & 1 || Qi(t);
}, XA = (t, e = {}) => {
  var n;
  const r = Ir(), s = [], i = e.exclude || [], o = Ac.customElements, a = sr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ sr.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(Ze, e), Ze.$resourcesUrl$ = new URL(e.resourcesUrl || "./", sr.baseURI).href, t.map((p) => {
    p[1].map((A) => {
      const m = {
        $flags$: A[0],
        $tagName$: A[1],
        $members$: A[2],
        $listeners$: A[3]
      };
      m.$members$ = A[2];
      const T = m.$tagName$, W = class extends HTMLElement {
        // StencilLazyHost
        constructor(X) {
          super(X), X = this, ZA(X, m), m.$flags$ & 1 && X.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : Ze.jmp(() => qA(this));
        }
        disconnectedCallback() {
          Ze.jmp(() => WA(this));
        }
        componentOnReady() {
          return Qi(this).$onReadyPromise$;
        }
      };
      m.$lazyBundleId$ = p[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Og(
        W,
        m,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + vA, u.setAttribute("data-styles", "");
    const p = (n = Ze.$nonce$) !== null && n !== void 0 ? n : Tg(sr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((p) => p.connectedCallback()) : Ze.jmp(() => l = setTimeout(Ug, 30)), r();
}, cf = /* @__PURE__ */ new WeakMap(), Qi = (t) => cf.get(t), YA = (t, e) => cf.set(e.$lazyInstance$ = t, e), ZA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], cf.set(t, n);
}, ch = (t, e) => e in t, vo = (t, e) => (0, console.error)(t, e), Zc = /* @__PURE__ */ new Map(), QA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Zc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Zc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => $$).then(o, vo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Zc.set(s, o), o[r]), vo);
}, Ka = /* @__PURE__ */ new Map(), Ac = typeof window < "u" ? window : {}, sr = Ac.document || { head: {} }, Ze = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Dg = (t) => Promise.resolve(t), JA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), lh = [], Fg = [], t4 = (t, e) => (n) => {
  t.push(n), Zl || (Zl = !0, Ze.$flags$ & 4 ? lf(Jl) : Ze.raf(Jl));
}, uh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      vo(n);
    }
  t.length = 0;
}, Jl = () => {
  uh(lh), uh(Fg), (Zl = lh.length > 0) && Ze.raf(Jl);
}, lf = (t) => Dg().then(t), e4 = /* @__PURE__ */ t4(Fg), n4 = () => Dg(), r4 = (t, e) => typeof window > "u" ? Promise.resolve() : n4().then(() => XA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var s4 = Object.defineProperty, i4 = Object.defineProperties, o4 = Object.getOwnPropertyDescriptors, Va = Object.getOwnPropertySymbols, jg = Object.prototype.hasOwnProperty, zg = Object.prototype.propertyIsEnumerable, fh = (t, e, n) => e in t ? s4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Sn = (t, e) => {
  for (var n in e || (e = {})) jg.call(e, n) && fh(t, n, e[n]);
  if (Va) for (var n of Va(e)) zg.call(e, n) && fh(t, n, e[n]);
  return t;
}, Rn = (t, e) => i4(t, o4(e)), Rg = (t, e) => {
  var n = {};
  for (var r in t) jg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Va) for (var r of Va(t)) e.indexOf(r) < 0 && zg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Gg() {
  return yc(Ds()) || window.StacksProvider || window.BlockstackProvider;
}
function vc(t) {
  return t ? typeof t == "string" ? js.fromName(t) : "version" in t ? t : "url" in t ? new Il({ url: t.url }) : t.transactionVersion === Rs.Mainnet ? new Il({ url: t.client.baseUrl }) : new Ll({ url: t.client.baseUrl }) : new Ll();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var a4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(a4 || {}), c4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(c4 || {}), uf = (t) => {
  let e = t;
  if (!e) {
    let n = new S0(["store_write"], document.location.href);
    e = new kl({ appConfig: n });
  }
  return e;
};
function Kg(t) {
  try {
    return uf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Vg = (t) => {
  let e = uf(t).loadUserData().appPrivateKey, n = Xe.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function l4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [zs.Mainnet]: "mainnet", [zs.Testnet]: "testnet" }, a = vc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function u4(t) {
  let e = vc(t.network), n = uf(t.userSession), r = Rn(Sn({}, t), { network: e, userSession: n });
  return Sn({ stxAddress: l4(r) }, r);
}
async function f4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(wg) : n = n.map((r) => xt(Ig(r)))), new Xe.TokenSigner("ES256k", e).signAsync(Rn(Sn({}, t), { postConditions: n }));
}
function d4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(wg) : e = e.map((n) => xt(Ig(n)))), Xe.createUnsecuredToken(Rn(Sn({}, t), { postConditions: e }));
}
var h4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = te(a.replace(/^0x/, "")), u = rE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Rn(Sn({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Rn(Sn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, p4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Rg(e, ["amount", "appDetails", "userSession"]);
  if (Kg(s)) {
    let { privateKey: a, publicKey: c } = Vg(s), u = Rn(Sn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), f4(u, a);
  }
  let o = Rn(Sn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), d4(o);
};
async function g4(t, e, n) {
  let r = await e(Rn(Sn(Sn({}, u4(t)), t), { network: vc(t.network) }));
  return h4({ token: r, options: t }, n);
}
function y4(t, e = Gg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return g4(t, p4, e);
}
function qg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Rn(Sn({}, t), { message: Dd(e), domain: Dd(n) }) : Rn(Sn({}, t), { message: xt(Ks(e)), domain: xt(Ks(n)) });
}
async function w4(t, e) {
  return new Xe.TokenSigner("ES256k", e).signAsync(qg(t));
}
async function b4(t) {
  let e = t, { userSession: n } = e, r = Rg(e, ["userSession"]);
  if (Kg(n)) {
    let { privateKey: s, publicKey: i } = Vg(n), o = Rn(Sn({}, r), { publicKey: i });
    return w4(o, s);
  }
  return Xe.createUnsecuredToken(qg(t));
}
var m4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(m4 || {}), Wg = "asigna-stx", dh = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Wg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(S4(t, e), "*");
}), x4 = { authenticationRequest: async (t) => dh(t, "authenticationRequest"), transactionRequest: async (t) => dh(t, "transactionRequest") }, S4 = (t, e) => ({ source: Wg, [e]: t }), E4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = x4);
};
E4();
var A4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function v4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Ds(), o = Gg();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    r4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : A4, c = gx(a), u = document.createElement("connect-modal");
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
var ua = v4(y4);
function fs(t, e, n) {
  return ff(rn(t, e), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = me(r);
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
      const r = I4(BigInt(`0x${Rt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Rt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function hh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Oo(t, e = 8) {
  return (typeof t == "bigint" ? t : rn(t, !1)).toString(16).padStart(e * 2, "0");
}
function $c(t) {
  return parseInt(t, 16);
}
function ff(t, e = 16) {
  const n = Oo(t, e);
  return me(n);
}
function $4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function k4(t, e) {
  return t & BigInt(1) << e;
}
function I4(t, e) {
  return k4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const L4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += L4[n];
  return e;
}
function me(t) {
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
function Ji(t) {
  return new TextEncoder().encode(t);
}
function df(t) {
  return new TextDecoder().decode(t);
}
function Xg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function C4(t) {
  return String.fromCharCode.apply(null, t);
}
function T4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ph(t) {
  if (t.some(T4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function kc(...t) {
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
function Ue(t) {
  return kc(...t.map((e) => typeof e == "number" ? ph([e]) : e instanceof Array ? ph(e) : e));
}
var gh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(yh || (yh = {}));
var wh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(wh || (wh = {}));
const Yg = 33, Qc = 32;
function B4(t) {
  if (t.length < Qc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Qc * 2), r = t.slice(2 + Qc * 2);
  return {
    recoveryId: $c(e),
    r: n,
    s: r
  };
}
function M4(t) {
  const e = typeof t == "string" ? me(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function N4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function P4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function _4(t, e) {
  return t[e];
}
function U4(t, e, n = 0) {
  return t[n] = e, t;
}
function H4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var tu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(tu || (tu = {}));
const O4 = tu.Mainnet, D4 = 128, F4 = 128, Zg = 16, Bs = 32, eu = 80, Ic = 65, j4 = 32, z4 = 64, qa = 34;
var gt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(gt || (gt = {}));
var Ft;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ft || (Ft = {}));
var nu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(nu || (nu = {}));
var cn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(cn || (cn = {}));
const ka = ["onChainOnly", "offChainOnly", "any"], bh = {
  [ka[0]]: cn.OnChainOnly,
  [ka[1]]: cn.OffChainOnly,
  [ka[2]]: cn.Any,
  [cn.OnChainOnly]: cn.OnChainOnly,
  [cn.OffChainOnly]: cn.OffChainOnly,
  [cn.Any]: cn.Any
};
function R4(t) {
  if (t in bh)
    return bh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ka.join(", ")}`);
}
var Wa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Wa || (Wa = {}));
Wa.Mainnet;
var Ri;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ri || (Ri = {}));
var ln;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ln || (ln = {}));
var Be;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Be || (Be = {}));
var ce;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ce || (ce = {}));
var Xa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Xa || (Xa = {}));
var $e;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})($e || ($e = {}));
var $o;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})($o || ($o = {}));
var ru;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(ru || (ru = {}));
var ko;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ko || (ko = {}));
var mh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mh || (mh = {}));
var xh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(xh || (xh = {}));
function su(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function G4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Qg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function K4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  su(t.outputLen), su(t.blockLen);
}
function V4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function q4(t, e) {
  Qg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ks = {
  number: su,
  bool: G4,
  bytes: Qg,
  hash: K4,
  exists: V4,
  output: q4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Zn = (t, e) => t << 32 - e | t >>> e, W4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!W4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function X4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hf(t) {
  if (typeof t == "string" && (t = X4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Jg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ii(t) {
  const e = (r) => t().update(hf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Y4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class pf extends Jg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Jc(this.buffer);
  }
  update(e) {
    ks.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Jc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ks.exists(this), ks.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Y4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Jc(e), c = this.outputLen;
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
const Z4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ty = Uint8Array.from({ length: 16 }, (t, e) => e), Q4 = ty.map((t) => (9 * t + 5) % 16);
let gf = [ty], yf = [Q4];
for (let t = 0; t < 4; t++)
  for (let e of [gf, yf])
    e.push(e[t].map((n) => Z4[n]));
const ey = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), J4 = gf.map((t, e) => t.map((n) => ey[e][n])), tv = yf.map((t, e) => t.map((n) => ey[e][n])), ev = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), fa = (t, e) => t << e | t >>> 32 - e;
function Sh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const da = new Uint32Array(16);
class rv extends pf {
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
      da[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const A = 4 - p, m = ev[p], T = nv[p], W = gf[p], X = yf[p], S = J4[p], N = tv[p];
      for (let B = 0; B < 16; B++) {
        const tt = fa(r + Sh(p, i, a, u) + da[W[B]] + m, S[B]) + l | 0;
        r = l, l = u, u = fa(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = fa(s + Sh(A, o, c, d) + da[X[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = fa(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    da.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const sv = ii(() => new rv()), iv = (t, e, n) => t & e ^ ~t & n, ov = (t, e, n) => t & e ^ t & n ^ e & n, av = new Uint32Array([
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
class ny extends pf {
  constructor() {
    super(64, 32, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
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
      const y = Jr[l - 15], p = Jr[l - 2], A = Zn(y, 7) ^ Zn(y, 18) ^ y >>> 3, m = Zn(p, 17) ^ Zn(p, 19) ^ p >>> 10;
      Jr[l] = m + Jr[l - 7] + A + Jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), p = d + y + iv(a, c, u) + av[l] + Jr[l] | 0, m = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + ov(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class cv extends ny {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const wf = ii(() => new ny());
ii(() => new cv());
const ha = BigInt(2 ** 32 - 1), iu = BigInt(32);
function ry(t, e = !1) {
  return e ? { h: Number(t & ha), l: Number(t >> iu & ha) } : { h: Number(t >> iu & ha) | 0, l: Number(t & ha) | 0 };
}
function lv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ry(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const uv = (t, e) => BigInt(t >>> 0) << iu | BigInt(e >>> 0), fv = (t, e, n) => t >>> n, dv = (t, e, n) => t << 32 - n | e >>> n, hv = (t, e, n) => t >>> n | e << 32 - n, pv = (t, e, n) => t << 32 - n | e >>> n, gv = (t, e, n) => t << 64 - n | e >>> n - 32, yv = (t, e, n) => t >>> n - 32 | e << 64 - n, wv = (t, e) => e, bv = (t, e) => t, mv = (t, e, n) => t << n | e >>> 32 - n, xv = (t, e, n) => e << n | t >>> 32 - n, Sv = (t, e, n) => e << n - 32 | t >>> 64 - n, Ev = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Av(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const vv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), $v = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, kv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Iv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Lv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Cv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ht = {
  fromBig: ry,
  split: lv,
  toBig: uv,
  shrSH: fv,
  shrSL: dv,
  rotrSH: hv,
  rotrSL: pv,
  rotrBH: gv,
  rotrBL: yv,
  rotr32H: wv,
  rotr32L: bv,
  rotlSH: mv,
  rotlSL: xv,
  rotlBH: Sv,
  rotlBL: Ev,
  add: Av,
  add3L: vv,
  add3H: $v,
  add4L: kv,
  add4H: Iv,
  add5H: Cv,
  add5L: Lv
}, [Tv, Bv] = Ht.split([
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
class Lc extends pf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: A, Hh: m, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, A, m, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = A | 0, this.Hh = m | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let S = 0; S < 16; S++, n += 4)
      ts[S] = e.getUint32(n), es[S] = e.getUint32(n += 4);
    for (let S = 16; S < 80; S++) {
      const N = ts[S - 15] | 0, B = es[S - 15] | 0, tt = Ht.rotrSH(N, B, 1) ^ Ht.rotrSH(N, B, 8) ^ Ht.shrSH(N, B, 7), nt = Ht.rotrSL(N, B, 1) ^ Ht.rotrSL(N, B, 8) ^ Ht.shrSL(N, B, 7), K = ts[S - 2] | 0, z = es[S - 2] | 0, v = Ht.rotrSH(K, z, 19) ^ Ht.rotrBH(K, z, 61) ^ Ht.shrSH(K, z, 6), P = Ht.rotrSL(K, z, 19) ^ Ht.rotrBL(K, z, 61) ^ Ht.shrSL(K, z, 6), M = Ht.add4L(nt, P, es[S - 7], es[S - 16]), V = Ht.add4H(M, tt, v, ts[S - 7], ts[S - 16]);
      ts[S] = V | 0, es[S] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: A, Gh: m, Gl: T, Hh: W, Hl: X } = this;
    for (let S = 0; S < 80; S++) {
      const N = Ht.rotrSH(l, y, 14) ^ Ht.rotrSH(l, y, 18) ^ Ht.rotrBH(l, y, 41), B = Ht.rotrSL(l, y, 14) ^ Ht.rotrSL(l, y, 18) ^ Ht.rotrBL(l, y, 41), tt = l & p ^ ~l & m, nt = y & A ^ ~y & T, K = Ht.add5L(X, B, nt, Bv[S], es[S]), z = Ht.add5H(K, W, N, tt, Tv[S], ts[S]), v = K | 0, P = Ht.rotrSH(r, s, 28) ^ Ht.rotrBH(r, s, 34) ^ Ht.rotrBH(r, s, 39), M = Ht.rotrSL(r, s, 28) ^ Ht.rotrBL(r, s, 34) ^ Ht.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      W = m | 0, X = T | 0, m = p | 0, T = A | 0, p = l | 0, A = y | 0, { h: l, l: y } = Ht.add(u | 0, d | 0, z | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const Y = Ht.add3L(v, M, ct);
      r = Ht.add3H(Y, z, P, V), s = Y | 0;
    }
    ({ h: r, l: s } = Ht.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ht.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ht.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ht.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ht.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: A } = Ht.add(this.Fh | 0, this.Fl | 0, p | 0, A | 0), { h: m, l: T } = Ht.add(this.Gh | 0, this.Gl | 0, m | 0, T | 0), { h: W, l: X } = Ht.add(this.Hh | 0, this.Hl | 0, W | 0, X | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, A, m, T, W, X);
  }
  roundClean() {
    ts.fill(0), es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Mv extends Lc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Nv extends Lc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Pv extends Lc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ii(() => new Lc());
ii(() => new Mv());
const _v = ii(() => new Nv());
ii(() => new Pv());
function sy(t) {
  if (me(t).byteLength != Ic)
    throw Error("Invalid signature");
  return {
    type: gt.MessageSignature,
    data: t
  };
}
function uo(t, e) {
  return { type: gt.Address, version: t, hash160: e };
}
function ki(t) {
  return ni.c32address(t.version, t.hash160);
}
function qs(t, e, n) {
  const r = e || 1, s = n || D4;
  if (Sy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: gt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function bf(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: gt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function Uv(t) {
  if (t.type === Z.PrincipalStandard)
    return ki(t.address);
  if (t.type === Z.PrincipalContract)
    return `${ki(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function iy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Dv(e, n);
  } else
    return Hv(t);
}
function Hv(t) {
  const e = bf(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Ov(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function Dv(t, e) {
  const n = bf(t), r = qs(e);
  return oy(n, r);
}
function oy(t, e) {
  if (Ji(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function tl(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${Rt(t.buffer)}`;
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
      return Uv(t);
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
      return { type: ss(t), value: tl(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: ss(t), value: tl(t, !0), success: !0 };
    default:
      return { type: ss(t), value: tl(t, !0) };
  }
}
function ss(t) {
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
      return `(optional ${ss(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${ss(t.value)})`;
    case Z.ResponseOk:
      return `(response ${ss(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? ss(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ss(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${Xg(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${Ji(t.data).length})`;
  }
}
const ay = () => ({ type: Z.BoolTrue }), cy = () => ({ type: Z.BoolFalse }), Fv = (t) => t ? ay() : cy(), Eh = BigInt("0xffffffffffffffffffffffffffffffff"), jv = BigInt(0), Ah = BigInt("0x7fffffffffffffffffffffffffffffff"), vh = BigInt("-170141183460469231731687303715884105728"), zv = (t) => {
  const e = rn(t, !0);
  if (e > Ah)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ah}`);
  if (e < vh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${vh}`);
  return { type: Z.Int, value: e };
}, ir = (t) => {
  const e = rn(t, !1);
  if (e < jv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Eh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Eh}`);
  return { type: Z.UInt, value: e };
}, ly = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function uy() {
  return { type: Z.OptionalNone };
}
function fy(t) {
  return { type: Z.OptionalSome, value: t };
}
function Rv(t) {
  return { type: Z.ResponseErr, value: t };
}
function Gv(t) {
  return { type: Z.ResponseOk, value: t };
}
function Kv(t) {
  return { type: Z.List, list: t };
}
function Ws(t) {
  for (const e in t)
    if (!P8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const We = (t) => ({ type: Z.StringASCII, data: t }), Vv = (t) => ({ type: Z.StringUTF8, data: t });
class dy extends Jg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ks.hash(e);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const hy = (t, e, n) => new dy(t, e).update(n).digest();
hy.create = (t, e) => new dy(t, e);
Me.hmacSha256Sync = (t, ...e) => {
  const n = hy.create(wf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Gi(t) {
  return {
    type: gt.PublicKey,
    data: me(t)
  };
}
function qv(t, e, n = $e.Compressed) {
  const r = B4(e.data), s = new mn(hh(r.r), hh(r.s)), i = jt.fromSignature(t, s, r.recoveryId), o = n === $e.Compressed;
  return i.toHex(o);
}
function Wv(t) {
  return { type: gt.PublicKey, data: t };
}
function to(t) {
  return !Rt(t.data).startsWith("04");
}
function Ya(t) {
  return t.data.slice();
}
function Xv(t) {
  const e = Qv(t), n = No(e.data.slice(0, 32), e.compressed);
  return Gi(Rt(n));
}
function Yv(t) {
  const e = typeof t == "string" ? t : Rt(t), n = jt.fromHex(e).toHex(!0);
  return Gi(n);
}
function Zv(t) {
  const e = typeof t == "string" ? t : Rt(t), n = jt.fromHex(e).toHex(!1);
  return Gi(n);
}
function ou(t) {
  const e = t.readUInt8(), n = e === 4 ? z4 : j4;
  return Wv(Ue([e, t.readBytes(n)]));
}
function Qv(t) {
  const e = M4(t), n = e.length == Yg;
  return { data: e, compressed: n };
}
function Jv(t, e) {
  const [n, r] = oc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Oo(r, 1) + mn.fromHex(n).toCompactHex();
  return sy(i);
}
function t8(t) {
  return Xv(t.data);
}
function e8(t, e, n) {
  return typeof t == "string" && (t = iy(t)), typeof n == "string" && (n = Ih(n)), {
    type: gt.Payload,
    payloadType: Ft.TokenTransfer,
    recipient: t,
    amount: rn(e, !1),
    memo: n ?? Ih("")
  };
}
function n8(t, e, n, r) {
  return typeof t == "string" && (t = bf(t)), typeof e == "string" && (e = qs(e)), typeof n == "string" && (n = qs(n)), {
    type: gt.Payload,
    payloadType: Ft.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function $h(t, e, n) {
  return typeof t == "string" && (t = qs(t)), typeof e == "string" && (e = f8(e)), typeof n == "number" ? {
    type: gt.Payload,
    payloadType: Ft.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: gt.Payload,
    payloadType: Ft.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function r8() {
  return { type: gt.Payload, payloadType: Ft.PoisonMicroblock };
}
function kh(t, e) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  return e != null ? {
    type: gt.Payload,
    payloadType: Ft.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: gt.Payload,
    payloadType: Ft.Coinbase,
    coinbaseBytes: t
  };
}
function s8(t, e, n) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  if (n.byteLength != eu)
    throw Error(`VRF proof buffer size must be ${eu} bytes`);
  return {
    type: gt.Payload,
    payloadType: Ft.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var au;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(au || (au = {}));
function i8(t, e, n, r, s, i, o) {
  return {
    type: gt.Payload,
    payloadType: Ft.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function py(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ft.TokenTransfer:
      e.push(Pe(t.recipient)), e.push(fs(t.amount, !1, 8)), e.push(Er(t.memo));
      break;
    case Ft.ContractCall:
      e.push(Er(t.contractAddress)), e.push(Er(t.contractName)), e.push(Er(t.functionName));
      const n = new Uint8Array(4);
      Vs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Pe(r));
      });
      break;
    case Ft.SmartContract:
      e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case Ft.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case Ft.PoisonMicroblock:
      break;
    case Ft.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ft.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Pe(t.recipient));
      break;
    case Ft.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Pe(t.recipient ? fy(t.recipient) : uy())), e.push(t.vrfProof);
      break;
    case Ft.TenureChange:
      e.push(me(t.tenureHash)), e.push(me(t.previousTenureHash)), e.push(me(t.burnViewHash)), e.push(me(t.previousTenureEnd)), e.push(Vs(new Uint8Array(4), t.previousTenureBlocks)), e.push(U4(new Uint8Array(1), t.cause)), e.push(me(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function o8(t) {
  switch (t.readUInt8Enum(Ft, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ft.TokenTransfer:
      const n = Ln(t), r = rn(t.readBytes(8), !1), s = yy(t);
      return e8(n, r, s);
    case Ft.ContractCall:
      const i = Ki(t), o = In(t), a = In(t), c = [], u = t.readUInt32BE();
      for (let S = 0; S < u; S++) {
        const N = Ln(t);
        c.push(N);
      }
      return n8(i, o, a, c);
    case Ft.SmartContract:
      const d = In(t), l = In(t, 4, 1e5);
      return $h(d, l);
    case Ft.VersionedSmartContract: {
      const S = t.readUInt8Enum(nu, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), N = In(t), B = In(t, 4, 1e5);
      return $h(N, B, S);
    }
    case Ft.PoisonMicroblock:
      return r8();
    case Ft.Coinbase: {
      const S = t.readBytes(Bs);
      return kh(S);
    }
    case Ft.CoinbaseToAltRecipient: {
      const S = t.readBytes(Bs), N = Ln(t);
      return kh(S, N);
    }
    case Ft.NakamotoCoinbase: {
      const S = t.readBytes(Bs), N = Ln(t), B = t.readBytes(eu);
      return s8(S, N, B);
    }
    case Ft.TenureChange:
      const y = Rt(t.readBytes(20)), p = Rt(t.readBytes(20)), A = Rt(t.readBytes(20)), m = Rt(t.readBytes(32)), T = t.readUInt32BE(), W = t.readUInt8Enum(au, (S) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${S}`);
      }), X = Rt(t.readBytes(20));
      return i8(y, p, A, m, T, W, X);
  }
}
class Cc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ss extends Cc {
  constructor(e) {
    super(e);
  }
}
class bn extends Cc {
  constructor(e) {
    super(e);
  }
}
class Za extends Cc {
  constructor(e) {
    super(e);
  }
}
class Is extends Cc {
  constructor(e) {
    super(e);
  }
}
var Fn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Fn || (Fn = {}));
function cu(t) {
  return sy(Rt(t.readBytes(Ic)));
}
function Ii(t, e) {
  return {
    pubKeyEncoding: t,
    type: gt.TransactionAuthField,
    contents: e
  };
}
function a8(t) {
  const e = t.readUInt8Enum(Fn, (n) => {
    throw new bn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Fn.PublicKeyCompressed:
      return Ii($e.Compressed, ou(t));
    case Fn.PublicKeyUncompressed:
      return Ii($e.Uncompressed, Zv(ou(t).data));
    case Fn.SignatureCompressed:
      return Ii($e.Compressed, cu(t));
    case Fn.SignatureUncompressed:
      return Ii($e.Uncompressed, cu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function mf(t) {
  return me(t.data);
}
function c8(t) {
  const e = [];
  switch (t.contents.type) {
    case gt.PublicKey:
      e.push(t.pubKeyEncoding === $e.Compressed ? Fn.PublicKeyCompressed : Fn.PublicKeyUncompressed), e.push(Ya(Yv(t.contents.data)));
      break;
    case gt.MessageSignature:
      e.push(t.pubKeyEncoding === $e.Compressed ? Fn.SignatureCompressed : Fn.SignatureUncompressed), e.push(mf(t.contents));
      break;
  }
  return Ue(e);
}
function Er(t) {
  switch (t.type) {
    case gt.Address:
      return Do(t);
    case gt.Principal:
      return gy(t);
    case gt.LengthPrefixedString:
      return Vi(t);
    case gt.MemoString:
      return d8(t);
    case gt.AssetInfo:
      return wy(t);
    case gt.PostCondition:
      return h8(t);
    case gt.PublicKey:
      return Ya(t);
    case gt.LengthPrefixedList:
      return Ef(t);
    case gt.Payload:
      return py(t);
    case gt.TransactionAuthField:
      return c8(t);
    case gt.MessageSignature:
      return mf(t);
  }
}
function l8() {
  return {
    type: gt.Address,
    version: Xa.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function xf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ce.SerializeP2PKH || e === ce.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ce.SerializeP2WPKH || e === ce.SerializeP2WSH || e === ce.SerializeP2WSHNonSequential) && !r.every(to))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ce.SerializeP2PKH:
      return uo(t, T8(r[0].data));
    case ce.SerializeP2WPKH:
      return uo(t, B8(r[0].data));
    case ce.SerializeP2SH:
    case ce.SerializeP2SHNonSequential:
      return uo(t, M8(n, r.map(Ya)));
    case ce.SerializeP2WSH:
    case ce.SerializeP2WSHNonSequential:
      return uo(t, N8(n, r.map(Ya)));
  }
}
function Do(t) {
  const e = [];
  return e.push(me(Oo(t.version, 1))), e.push(me(t.hash160)), Ue(e);
}
function Ki(t) {
  const e = $c(Rt(t.readBytes(1))), n = Rt(t.readBytes(20));
  return { type: gt.Address, version: e, hash160: n };
}
function gy(t) {
  const e = [];
  return e.push(t.prefix), e.push(Do(t.address)), t.prefix === ko.Contract && e.push(Vi(t.contractName)), Ue(e);
}
function u8(t) {
  const e = t.readUInt8Enum(ko, (s) => {
    throw new bn(`Unexpected Principal payload type: ${s}`);
  }), n = Ki(t);
  if (e === ko.Standard)
    return { type: gt.Principal, prefix: e, address: n };
  const r = In(t);
  return {
    type: gt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Vi(t) {
  const e = [], n = Ji(t.content), r = n.byteLength;
  return e.push(me(Oo(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function In(t, e, n) {
  e = e || 1;
  const r = $c(Rt(t.readBytes(e))), s = df(t.readBytes(r));
  return qs(s, e, n ?? 128);
}
function f8(t) {
  return qs(t, 4, 1e5);
}
function Ih(t) {
  if (t && Sy(t, qa))
    throw new Error(`Memo exceeds maximum length of ${qa} bytes`);
  return { type: gt.MemoString, content: t };
}
function d8(t) {
  const e = [], n = Ji(t.content), r = C8(Rt(n), qa * 2);
  return e.push(me(r)), Ue(e);
}
function yy(t) {
  let e = df(t.readBytes(qa));
  return e = e.replace(/\u0000*$/, ""), { type: gt.MemoString, content: e };
}
function wy(t) {
  const e = [];
  return e.push(Do(t.address)), e.push(Vi(t.contractName)), e.push(Vi(t.assetName)), Ue(e);
}
function lu(t) {
  return {
    type: gt.AssetInfo,
    address: Ki(t),
    contractName: In(t),
    assetName: In(t)
  };
}
function Sf(t, e) {
  return {
    type: gt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ef(t) {
  const e = t.values, n = [];
  n.push(me(Oo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Er(r));
  return Ue(n);
}
function by(t, e, n) {
  const r = $c(Rt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case gt.Address:
        s.push(Ki(t));
        break;
      case gt.LengthPrefixedString:
        s.push(In(t));
        break;
      case gt.MemoString:
        s.push(yy(t));
        break;
      case gt.AssetInfo:
        s.push(lu(t));
        break;
      case gt.PostCondition:
        s.push(p8(t));
        break;
      case gt.PublicKey:
        s.push(ou(t));
        break;
      case gt.TransactionAuthField:
        s.push(a8(t));
        break;
    }
  return Sf(s, n);
}
function h8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(gy(t.principal)), (t.conditionType === ln.Fungible || t.conditionType === ln.NonFungible) && e.push(wy(t.assetInfo)), t.conditionType === ln.NonFungible && e.push(Pe(t.assetName)), e.push(t.conditionCode), t.conditionType === ln.STX || t.conditionType === ln.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ss("The post-condition amount may not be larger than 8 bytes");
    e.push(fs(t.amount, !1, 8));
  }
  return Ue(e);
}
function p8(t) {
  const e = t.readUInt8Enum(ln, (o) => {
    throw new bn(`Could not read ${o} as PostConditionType`);
  }), n = u8(t);
  let r, s, i;
  switch (e) {
    case ln.STX:
      return r = t.readUInt8Enum($o, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: gt.PostCondition,
        conditionType: ln.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case ln.Fungible:
      return s = lu(t), r = t.readUInt8Enum($o, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: gt.PostCondition,
        conditionType: ln.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case ln.NonFungible:
      s = lu(t);
      const o = Ln(t);
      return r = t.readUInt8Enum(ru, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: gt.PostCondition,
        conditionType: ln.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function ur(t, e) {
  return Ue([t, e]);
}
function g8(t) {
  return new Uint8Array([t.type]);
}
function y8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : ur(t.type, Pe(t.value));
}
function w8(t) {
  const e = new Uint8Array(4);
  return Vs(e, t.buffer.length, 0), ur(t.type, kc(e, t.buffer));
}
function b8(t) {
  const e = ff($4(t.value, BigInt(F4)), Zg);
  return ur(t.type, e);
}
function m8(t) {
  const e = ff(t.value, Zg);
  return ur(t.type, e);
}
function x8(t) {
  return ur(t.type, Do(t.address));
}
function S8(t) {
  return ur(t.type, kc(Do(t.address), Vi(t.contractName)));
}
function E8(t) {
  return ur(t.type, Pe(t.value));
}
function A8(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Pe(r);
    e.push(s);
  }
  return ur(t.type, Ue(e));
}
function v8(t) {
  const e = [], n = new Uint8Array(4);
  Vs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = qs(s);
    e.push(Vi(i));
    const o = Pe(t.data[s]);
    e.push(o);
  }
  return ur(t.type, Ue(e));
}
function my(t, e) {
  const n = [], r = e == "ascii" ? Xg(t.data) : Ji(t.data), s = new Uint8Array(4);
  return Vs(s, r.length, 0), n.push(s), n.push(r), ur(t.type, Ue(n));
}
function $8(t) {
  return my(t, "ascii");
}
function k8(t) {
  return my(t, "utf8");
}
function Pe(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return g8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return y8(t);
    case Z.Buffer:
      return w8(t);
    case Z.UInt:
      return m8(t);
    case Z.Int:
      return b8(t);
    case Z.PrincipalStandard:
      return x8(t);
    case Z.PrincipalContract:
      return S8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return E8(t);
    case Z.List:
      return A8(t);
    case Z.Tuple:
      return v8(t);
    case Z.StringASCII:
      return $8(t);
    case Z.StringUTF8:
      return k8(t);
    default:
      throw new Ss("Unable to serialize. Invalid Clarity Value.");
  }
}
function I8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Lh = /* @__PURE__ */ new Map();
function xy(t, e) {
  const n = Lh.get(t);
  if (n !== void 0)
    return n(e);
  const r = I8(t);
  return Lh.set(t, r), xy(t, e);
}
class yo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return H4(this.readBytes(4), 0);
  }
  readUInt8() {
    return _4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return N4(this.readBytes(2), 0);
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
    if (xy(e, r))
      return r;
    throw n(r);
  }
}
function Ln(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new yo(me(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new yo(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new bn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return zv(e.readBytes(16));
    case Z.UInt:
      return ir(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return ly(e.readBytes(r));
    case Z.BoolTrue:
      return ay();
    case Z.BoolFalse:
      return cy();
    case Z.PrincipalStandard:
      const s = Ki(e);
      return Ov(s);
    case Z.PrincipalContract:
      const i = Ki(e), o = In(e);
      return oy(i, o);
    case Z.ResponseOk:
      return Gv(Ln(e));
    case Z.ResponseErr:
      return Rv(Ln(e));
    case Z.OptionalNone:
      return uy();
    case Z.OptionalSome:
      return fy(Ln(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(Ln(e));
      return Kv(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let m = 0; m < u; m++) {
        const T = In(e).content;
        if (T === void 0)
          throw new bn('"content" is undefined');
        d[T] = Ln(e);
      }
      return Ws(d);
    case Z.StringASCII:
      const l = e.readUInt32BE(), y = C4(e.readBytes(l));
      return We(y);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), A = df(e.readBytes(p));
      return Vv(A);
    default:
      throw new bn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const L8 = (t) => t.length % 2 == 0 ? t : `0${t}`, C8 = (t, e) => t.padEnd(e, "0"), Sy = (t, e) => t ? Ji(t).length > e : !1;
function uu(t) {
  return Fp(t);
}
const Io = (t) => sv(wf(t)), Af = (t) => Rt(_v(t)), T8 = (t) => Rt(Io(t)), B8 = (t) => {
  const e = Io(t), n = kc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Io(n);
  return Rt(r);
}, M8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = Io(r);
  return Rt(s);
}, N8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = wf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ue(i), a = Io(o);
  return Rt(a);
};
function P8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Ey(t) {
  const e = Pe(t);
  return `0x${Rt(e)}`;
}
function _8(t) {
  return Ln(t);
}
const Ci = (t) => {
  try {
    return ni.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function vf() {
  return {
    type: gt.MessageSignature,
    data: Rt(new Uint8Array(Ic))
  };
}
function Ay(t, e, n, r) {
  const s = xf(0, t, 1, [Gi(e)]).hash160, i = to(Gi(e)) ? $e.Compressed : $e.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: rn(n, !1),
    fee: rn(r, !1),
    keyEncoding: i,
    signature: vf()
  };
}
function Lo(t) {
  return "signature" in t;
}
function Ch(t) {
  return t === ce.SerializeP2SH || t === ce.SerializeP2WSH;
}
function U8(t) {
  return t === ce.SerializeP2SHNonSequential || t === ce.SerializeP2WSHNonSequential;
}
function Th(t) {
  const e = uu(t);
  return e.nonce = 0, e.fee = 0, Lo(e) ? e.signature = vf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function H8(t) {
  const e = [
    t.hashMode,
    me(t.signer),
    fs(t.nonce, !1, 8),
    fs(t.fee, !1, 8),
    t.keyEncoding,
    mf(t.signature)
  ];
  return Ue(e);
}
function O8(t) {
  const e = [
    t.hashMode,
    me(t.signer),
    fs(t.nonce, !1, 8),
    fs(t.fee, !1, 8)
  ], n = Sf(t.fields);
  e.push(Ef(n));
  const r = new Uint8Array(2);
  return P4(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function D8(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt(`0x${Rt(e.readBytes(8))}`), s = BigInt(`0x${Rt(e.readBytes(8))}`), i = e.readUInt8Enum($e, (a) => {
    throw new bn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.SerializeP2WPKH && i != $e.Compressed)
    throw new bn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = cu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function F8(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt("0x" + Rt(e.readBytes(8))), s = BigInt("0x" + Rt(e.readBytes(8))), i = by(e, gt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case gt.PublicKey:
        to(u.contents) || (o = !0);
        break;
      case gt.MessageSignature:
        if (u.pubKeyEncoding === $e.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Is("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.SerializeP2WSH || t === ce.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function el(t) {
  return Lo(t) ? H8(t) : O8(t);
}
function nl(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new bn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.SerializeP2PKH || e === ce.SerializeP2WPKH ? D8(e, t) : F8(e, t);
}
function vy(t, e, n, r) {
  const i = t + Rt(new Uint8Array([e])) + Rt(fs(n, !1, 8)) + Rt(fs(r, !1, 8));
  if (me(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Af(me(i));
}
function $y(t, e, n) {
  const r = 33 + Ic, s = to(e) ? $e.Compressed : $e.Uncompressed, i = t + L8(s.toString(16)) + n.data, o = me(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Af(o);
}
function j8(t, e, n, r, s) {
  const i = vy(t, e, n, r), o = Jv(s, i), a = t8(s), c = $y(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ky(t, e, n, r, s, i) {
  const o = vy(t, e, n, r), a = Gi(qv(o, i, s)), c = $y(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function z8() {
  const t = Ay(ce.SerializeP2PKH, "", 0, 0);
  return t.signer = l8().hash160, t.keyEncoding = $e.Compressed, t.signature = vf(), t;
}
function Bh(t, e, n) {
  return Lo(t) ? R8(t, e, n) : G8(t, e, n);
}
function R8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = ky(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = xf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function G8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case gt.PublicKey:
        to(c.contents) || (i = !0), r.push(c.contents);
        break;
      case gt.MessageSignature:
        c.pubKeyEncoding === $e.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = ky(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Ch(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Is("Too many signatures");
        break;
    }
  if (Ch(t.hashMode) && o !== t.signaturesRequired || U8(t.hashMode) && o < t.signaturesRequired)
    throw new Is("Incorrect number of signatures");
  if (i && (t.hashMode === ce.SerializeP2WSH || t.hashMode === ce.SerializeP2WSHNonSequential))
    throw new Is("Uncompressed keys are not allowed in this hash mode");
  const a = xf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Is(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Iy(t) {
  return {
    authType: Be.Standard,
    spendingCondition: t
  };
}
function Ly(t, e) {
  return {
    authType: Be.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ay(ce.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Mh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Be.Standard:
        return Iy(Th(t.spendingCondition));
      case Be.Sponsored:
        return Ly(Th(t.spendingCondition), z8());
      default:
        throw new Za("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function K8(t, e) {
  switch (t.authType) {
    case Be.Standard:
      return Bh(t.spendingCondition, e, Be.Standard);
    case Be.Sponsored:
      return Bh(t.spendingCondition, e, Be.Standard);
    default:
      throw new Za("Invalid origin auth type");
  }
}
function V8(t, e) {
  switch (t.authType) {
    case Be.Standard:
      const n = {
        ...t.spendingCondition,
        fee: rn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Be.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: rn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function q8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: rn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function W8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: rn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function X8(t, e) {
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
function Y8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Be.Standard:
      e.push(el(t.spendingCondition));
      break;
    case Be.Sponsored:
      e.push(el(t.spendingCondition)), e.push(el(t.sponsorSpendingCondition));
      break;
  }
  return Ue(e);
}
function Z8(t) {
  const e = t.readUInt8Enum(Be, (r) => {
    throw new bn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Be.Standard:
      return n = nl(t), Iy(n);
    case Be.Sponsored:
      n = nl(t);
      const r = nl(t);
      return Ly(n, r);
  }
}
class Q8 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: rn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? O4, this.postConditionMode = i ?? Ri.Deny, this.postConditions = s ?? Sf([]), o)
      this.anchorMode = R4(o);
    else
      switch (r.payloadType) {
        case Ft.Coinbase:
        case Ft.CoinbaseToAltRecipient:
        case Ft.NakamotoCoinbase:
        case Ft.PoisonMicroblock:
        case Ft.TenureChange:
          this.anchorMode = cn.OnChainOnly;
          break;
        case Ft.ContractCall:
        case Ft.SmartContract:
        case Ft.VersionedSmartContract:
        case Ft.TokenTransfer:
          this.anchorMode = cn.Any;
          break;
      }
  }
  signBegin() {
    const e = uu(this);
    return e.auth = Mh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = uu(this);
    return e.auth = Mh(e.auth), e.txid();
  }
  verifyOrigin() {
    return K8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Be.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Be.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Be.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Lo(n)) {
      const r = to(e);
      n.fields.push(Ii(r ? $e.Compressed : $e.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = j8(n, r, e.fee, e.nonce, s);
    return Lo(e) ? e.signature = i : e.fields.push(Ii(s.data.byteLength === Yg ? $e.Compressed : $e.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Af(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Be.Sponsored)
      throw new Za("Cannot sponsor sign a non-sponsored transaction");
    this.auth = X8(this.auth, e);
  }
  setFee(e) {
    this.auth = V8(this.auth, e);
  }
  setNonce(e) {
    this.auth = q8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Be.Sponsored)
      throw new Za("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W8(this.auth, e);
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
    return Vs(n, this.chainId, 0), e.push(n), e.push(Y8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ef(this.postConditions)), e.push(py(this.payload)), Ue(e);
  }
}
function Qa(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new yo(me(t.slice(2))) : e = new yo(me(t)) : t instanceof Uint8Array ? e = new yo(t) : e = t;
  const n = e.readUInt8Enum(Wa, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Z8(e), i = e.readUInt8Enum(cn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Ri, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = by(e, gt.PostCondition), c = o8(e);
  return new Q8(n, s, c, a, o, i, r);
}
const J8 = Fv, wo = ir, t5 = ly;
const e5 = /* @__PURE__ */ new Set([4001, -31001]), n5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], r5 = ["result", "data", "payload", "response", "params"], Nh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Tc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), oi = () => {
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
}, s5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Cy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => s5(i, r)) === s
  );
}, Ty = (t) => t ? Cy(oi()).some(
  (e) => {
    var n;
    return e.id === t && (Tc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, By = () => {
  if (typeof window > "u")
    return;
  const t = oi(), e = Cy(t).filter(
    (n) => {
      var r;
      return Tc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = $r(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of n5) {
    const r = $r(t, n) ?? (t === window ? void 0 : $r(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, i5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = oi(), n = $r(e, t) ?? (e === window ? void 0 : $r(window, t)) ?? yc(t);
  if (n)
    return n;
  if (Tc(t) || Ty(t))
    return By();
}, pa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, o5 = ["blockstack-session", "blockstack"], a5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of o5) {
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
a5();
const My = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, yn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, c5 = (t) => {
  const e = yn(t);
  if (!e)
    return null;
  const n = My(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, l5 = (t) => {
  const e = yn(t);
  if (!e)
    return null;
  const n = My(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, fu = (t, e = "mainnet") => {
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
      return fu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return fu(r, e);
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
}, Co = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Ci(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Co(s, e + 1);
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
    const i = Co(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Ci(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ci(n.testnet) ? n.testnet.trim() : null;
}, Ph = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ny = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && e5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Xs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = yn(n == null ? void 0 : n.message) ?? yn(e.message) ?? yn(e.error) ?? yn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, qi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Xs(e);
    if (e.status === "error")
      throw Xs(e.result ?? e);
  }
  return t;
}, _h = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return qi(r);
  } catch (r) {
    throw Xs(r);
  }
}, Py = () => By(), $f = () => {
  if (typeof window > "u")
    return;
  const t = oi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = $r(t, e) ?? (t === window ? void 0 : $r(window, e));
    if (n)
      return n;
  }
}, Uh = () => {
  if (typeof window > "u")
    return;
  const t = $f();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = oi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = $r(e, n) ?? (e === window ? void 0 : $r(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ia = (t) => {
  var r, s;
  const e = Ds();
  if (Tc(e) || Ty(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = oi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Py();
}, rl = (t) => {
  const e = l5(t);
  if (!e)
    return null;
  try {
    const n = Qa(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ja = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = rl(t), r = c5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? yn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ja(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Nh)
    if (rl(s[a])) {
      i = yn(s[a]);
      break;
    }
  const o = yn(s.txId) || yn(s.txid) || yn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? yn(s.txRaw) ?? void 0
    };
  for (const a of Nh) {
    const c = rl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: yn(s[a]) ?? void 0
      };
  }
  for (const a of r5) {
    const c = s[a], u = Ja(c, e + 1);
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
}, sl = (t) => {
  const e = Ja(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, u5 = (t) => {
  const e = Ja(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, f5 = (t) => ({
  ...t,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored === !0
}), Hh = (t) => ({
  recipient: t.recipient,
  amount: Ms(t.amount) ?? "0",
  memo: t.memo,
  network: fu(t.network),
  address: t.stxAddress,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored ?? !1
}), _y = "WALLET_ADDRESS_MISMATCH", d5 = 45e3;
let bo = null;
const du = (t) => {
  t && (bo = { address: t, at: Date.now() });
}, h5 = () => {
  bo = null;
}, p5 = () => bo && Date.now() - bo.at <= d5 ? bo.address : null, g5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, y5 = async (t) => {
  h5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = qi(await t.request("wallet_connect")), n = Co(e);
  return du(n), n;
}, w5 = async (t, e, n, r) => {
  try {
    return qi(await t.request(e, n));
  } catch (s) {
    const i = Xs(s);
    if (!g5(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await y5(t);
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
        { code: o ? _y : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return qi(await t.request(e, n));
    } catch (a) {
      throw Xs(a);
    }
  }
};
let Oh = 3e4;
const b5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Oh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Oh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, m5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: _y }
      );
    return c;
  }, s = p5();
  if (s)
    return pa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  pa(n, "account-read");
  try {
    const c = qi(
      await b5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Co(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Ny(c))
      throw Xs(c);
    pa(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return du(i), r(i, "wallet_getAccount");
  let o;
  pa(n, "account-reconnect");
  try {
    o = qi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Xs(c);
  }
  const a = Co(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return du(a), r(a, "wallet_connect");
}, x5 = async (t, e) => {
  if (!Ia(t)) {
    const i = await _h(
      t,
      "stx_transferStx",
      Hh(e)
    );
    return sl(i);
  }
  const n = $f();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await _h(
      n,
      "stx_transferStx",
      Hh(e)
    );
    return sl(i);
  }
  const r = Py();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await m5(r, e.stxAddress);
  const s = await w5(
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
  return sl(s);
}, S5 = () => Ds(), Uy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Ds(), e = t ? i5(t) : void 0;
  if (e)
    return e;
  const n = oi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Dh = (t, e) => {
  const n = Uy(), r = f5({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, u5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ua(r, e);
  if (Ia(n) && !$f()) {
    const s = Uh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ds(),
        route: "legacy-transaction-request"
      }), ua(r, s);
  }
  return void x5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Ph(s) && Ia(n)) {
      const a = Uh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ds(),
          route: "legacy-transaction-request"
        }), ua(r, a);
        return;
      }
    }
    if (Ph(s) && !Ia(n)) {
      ua(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Ny(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Fh = (t) => Ey(t).replace(/^0x/, ""), jh = "This wallet cannot sign messages. Try Xverse or Leather.", zh = (t) => typeof (t == null ? void 0 : t.request) == "function", Rh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", E5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, A5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function v5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Fh(e.message),
    domain: Fh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function $5(t, e) {
  const n = await b4({
    domain: e.domain,
    message: e.message,
    network: vc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Gh(t) {
  var s, i;
  const e = S5() || "", n = /xverse/i.test(e);
  let r = Uy();
  if (n && !Rh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Rh(r))
    try {
      return await $5(r, t);
    } catch (o) {
      if (n || !zh(r) || !A5(o)) throw o;
    }
  if (!n && zh(r))
    try {
      return await v5(r, t);
    } catch (o) {
      throw E5(o) ? new Error(jh) : o;
    }
  throw new Error(jh);
}
const Kh = 1000000n, Ls = 1000000n, tc = 50n, ze = 3000n, ai = 300n, oo = 3000n, k5 = 50000n, il = 200n, Bc = 15000n, wn = (t) => t + tc;
function Qn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Kh}.${(n % Kh).toString().padStart(6, "0")}`;
}
function Vh(t, e = ai) {
  return t <= ze ? 0 : Number((t - ze) / wn(e));
}
function ol(t, e = 0n) {
  const n = Ls - t - e;
  return n > 0n ? n : 0n;
}
function I5(t, e = ai) {
  return t > Ls ? "over" : t < ze + wn(e) ? "empty" : t < k5 ? "low" : "ok";
}
const L5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", C5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", T5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function B5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || T5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== L5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Hy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", al = 3, M5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [hu, Oy] = Hy.split("."), vn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function pu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function N5(t) {
  return vn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ls(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Dy(t, e = []) {
  const n = await ls(`/v2/contracts/call-read/${hu}/${Oy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: hu, arguments: e.map((r) => "0x" + vn(Pe(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return er(Ln(n.result));
}
async function P5() {
  const t = await ls(`/v2/contracts/source/${hu}/${Oy}?proof=0`);
  if (typeof t.source != "string" || await N5(t.source) !== C5) throw Error("Deployed source does not match the tested helper.");
  if (B5(await Dy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Fy(t) {
  return t.startsWith("SP") && Ci(t) && !t.includes(".");
}
async function _5(t) {
  var r;
  if (!Fy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ls(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ls(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function U5(t) {
  const e = await ls(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function H5(t, e) {
  var s, i;
  const n = await Dy("get-owner", [wo(t), wo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Fy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function O5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: pu(t), signal: AbortSignal.timeout(15e3) });
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
async function D5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function F5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Qa(pu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || ki(uo(Xa.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || ki(r.contractAddress) + "." + r.contractName.content !== Hy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || vn(Pe(r.functionArgs[0])) !== vn(Pe(wo(t.core))) || vn(Pe(r.functionArgs[1])) !== vn(Pe(wo(t.song))) || vn(Pe(r.functionArgs[2])) !== vn(Pe(t5(pu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ri.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== $o.Equal || i.principal.prefix !== 2 || ki(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ki(r.contractAddress) + "." + r.contractName.content !== M5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || vn(Pe(r.functionArgs[0])) !== vn(Pe(wo(t.song))) || typeof t.liked != "boolean" || vn(Pe(r.functionArgs[1])) !== vn(Pe(J8(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ri.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || er(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const j5 = "xtrata.xyz/radio/listening-wallet", z5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Ys = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ci(t), R5 = (t) => ({
  domain: Ws({ name: We(j5), version: We("1"), "chain-id": ir(1) }),
  message: Ws({
    purpose: We(z5),
    main: We(t.main),
    listening: We(t.listening),
    issued: ir(t.issued)
  })
}), jy = 100000n, G5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function K5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Ys(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= jy).sort(G5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const ga = 50;
function ec(t) {
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
async function V5(t, e, n = 4) {
  if (!Ys(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ga}&offset=${o}`, s = ec(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - ga);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= ga ? s : ec(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = K5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - ga);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const mr = 50, q5 = 6, W5 = 20, qh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Wh(t, e) {
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
async function X5(t, e, n) {
  if (!Ys(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = ec(await e(`/extended/v1/address/${t}/stx_inbound?limit=${mr}&offset=0`));
    if (!s || s.total > q5 * mr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = mr; o < s.total; o += mr) {
      const a = ec(await e(`/extended/v1/address/${t}/stx_inbound?limit=${mr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${mr}&offset=${u}`, a = Wh(await e(o(0)), t);
      if (!a || a.total > W5 * mr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = mr; u < a.total; u += mr) {
        const d = Wh(await e(o(u)), t);
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
function Y5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(qh).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : Ys(l.sender) && p >= jy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Ys(l.recipient) && l.amount > 0n).sort(qh), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let p = y;
    for (const A of l) {
      if (p <= 0n) break;
      const m = A.left < p ? A.left : p;
      A.left -= m, p -= m;
    }
    return p;
  };
  for (const l of o) {
    const y = u(s.filter((p) => p.to === l.recipient), l.amount);
    y > 0n && u(s, y);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, p = d.get(y);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function Z5(t, e) {
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
function Xh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const La = [100, 250, 500], Q5 = (t, e) => BigInt(t) * wn(e), ao = ["prepared", "signed", "unknown", "pending"], J5 = 30 * 6e4, Yh = 6e4, mi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, t6 = 3e3, Zh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", cl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function e6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, p = null, A = !1, m = "", T = "", W = 0, X, S = null, N, B = [], tt, nt = -1 / 0;
  const K = /* @__PURE__ */ new Set();
  let z = null, v = !1, P = 0, M = null, V = null, ct = !1, Y = null, L = !1, rt = null, re = !1, I = !1, U = !1, St = !1, Ot = !1, Tt = 0, Qt = null, ie = Promise.resolve();
  const x = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ai.toString()), _ = (w) => !!i && !(i.features ?? []).includes(w), J = (w, $) => `xtrata.ppp.v1.${w}:${$}`, O = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const $ = JSON.parse(t.store.get(J("entries", w)) || "[]");
      return Array.isArray($) ? $ : [];
    } catch {
      return [];
    }
  }, ot = (w) => {
    const $ = [w, ...O(w.address).filter((q) => !(q.txid === w.txid && q.kind === w.kind))].slice(0, 200);
    t.store.set(J("entries", w.address), JSON.stringify($));
  }, st = (w = i == null ? void 0 : i.address) => !!w && t.store.get(J("on", w)) !== "0", kt = (w) => {
    i != null && i.address && t.store.set(J("on", i.address), w ? "1" : "0");
  }, At = () => O().filter((w) => ao.includes(w.status)), Wt = () => Mt() ? [...At(), ...O(mt()).filter((w) => ao.includes(w.status))] : At(), Kt = () => vt(i == null ? void 0 : i.address), vt = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(J("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, bt = (w, $ = i == null ? void 0 : i.address) => {
    $ && t.store.set(J("deposit", $), JSON.stringify(w));
  };
  let Lt = null;
  const pe = (w = Yh) => {
    const $ = t.now();
    Lt = { since: Lt && $ < Lt.until ? Lt.since : $, until: Math.max((Lt == null ? void 0 : Lt.until) ?? 0, $ + w) };
  }, Dt = () => !!Lt && t.now() < Lt.until && (o === void 0 || o < ze + wn(x())), le = () => !!Kt() || Dt(), mt = () => _("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Mt = () => !!(i != null && i.address) && mt() !== i.address, Ct = () => Mt() ? c && c.for === mt() ? c.value : void 0 : o, De = (w) => w !== void 0 && w < ze + il, Cn = () => At().filter((w) => t.now() - w.created > J5 && K.has(w.txid)), fr = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), E = () => fr() && !(i != null && i.linked), j = () => {
    const w = t.main();
    return !E() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, R = (w) => J("return-to", w), G = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const $ = t.store.get(R(w));
    return $ && Ys($) && $ !== w ? $ : void 0;
  }, wt = (w = i == null ? void 0 : i.address) => z && z.for === w ? z.res : null;
  function $t() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = G();
    if (w) return { to: w, kind: "chosen" };
    const $ = wt();
    if ($ != null && $.ok && $.funder) return { to: $.funder, kind: "funder" };
  }
  const de = (w) => J("gift", w);
  function Xt() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((Y == null ? void 0 : Y.for) === w) return Y.info;
    try {
      const $ = JSON.parse(t.store.get(de(w)) || "null");
      return $ && typeof $.returnTo == "string" && typeof $.treasury == "string" ? $ : null;
    } catch {
      return null;
    }
  }
  async function he() {
    var yt;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((yt = e == null ? void 0 : e.gifts) != null && yt.enabled) || L) return;
    const $ = (Y == null ? void 0 : Y.for) === w ? Y : null, q = $ ? $.ok ? $.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if ($ && t.now() - $.at < q) return;
    L = !0;
    const et = Xt();
    try {
      const k = await t.giftInfo(w);
      Y = { for: w, info: k, ok: !0, at: t.now() }, t.store.set(de(w), JSON.stringify(k));
    } catch {
      Y = { for: w, info: et, ok: !1, at: t.now() };
    } finally {
      L = !1;
    }
  }
  const xe = () => O().reduce((w, $) => ao.includes($.status) ? w + BigInt($.amount || "0") + BigInt($.fee || "0") : w, 0n);
  function ke() {
    if (o === void 0) return 0;
    const w = o - xe() - BigInt(Le.length) * wn(x());
    return w > 0n ? Vh(w, x()) : 0;
  }
  const Jt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Vt = "EMPTY — ADD STX TO PLAY";
  function zt() {
    var q;
    const w = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((q = Xt()) != null && q.player) && !w) return null;
    const $ = (et, yt) => ({ reason: et, text: yt });
    switch (H()) {
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
        return le() ? $("arriving", "YOUR PLAYS ARE ARRIVING") : $("out", Mt() ? Jt : Vt);
      case "ready":
        return !st() || !(i != null && i.session) || i.session.playsLeft < 1 ? $("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : U ? ke() < 1 ? $("out", Mt() ? Jt : Vt) : null : $("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Se = () => {
    var w;
    return !!(i != null && i.address) && Mt() && !!((w = Xt()) != null && w.player);
  };
  function ue() {
    return Se() ? { locked: !0, known: !0 } : null;
  }
  const ge = 3 * 6e4, h = () => !!Xt() && !!t.history && !(i != null && i.linked);
  async function b() {
    const w = i.address, $ = Xt(), { balance: q, nonce: et } = await t.chain.account(w), yt = await t.history(w, !0);
    if (!yt.ok) return null;
    const k = Y5({ self: w, balance: q, inbound: yt.inbound, outgoing: yt.outgoing, gift: { sender: $.treasury, payer: $.returnTo } });
    if (!k.ok) return null;
    const D = Z5(k.parts, oo);
    return { balance: q, nonce: et, parts: k.parts, steps: D.steps, tooSmall: D.tooSmall.length };
  }
  const f = () => re ? { state: "unavailable" } : !rt || t.now() - rt.at > ge || o !== void 0 && o !== rt.balance ? { state: "none" } : rt.plan;
  function H() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!E()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : j() ? "wrong-wallet" : i.state === "known" ? "locked" : !E() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > Ls ? "over" : o < ze + wn(x()) ? "fund" : "ready" : "loading";
  }
  const ut = () => {
    var w, $, q, et, yt;
    return {
      step: H(),
      busy: u,
      message: m,
      error: T,
      notice: ht(),
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : I5(o, x()),
      playsLeft: o === void 0 ? 0 : Vh(o, x()),
      allowance: o === void 0 ? Ls : ol(o, BigInt(((w = Kt()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: st(),
      entries: O(),
      depositTxid: (($ = Kt()) == null ? void 0 : $.txid) ?? X,
      depositPending: le(),
      arrival: le() ? { since: ((q = Kt()) == null ? void 0 : q.at) ?? (Lt == null ? void 0 : Lt.since) ?? t.now(), graceMs: Yh } : null,
      walletOutdated: _("like"),
      linkedListening: tt && tt === t.main() ? B.map((k) => k.listening) : [],
      serverLinked: !!S && N === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Cn().length,
      armed: St,
      queued: Le.length,
      solo: E(),
      returnTo: (et = $t()) == null ? void 0 : et.to,
      returnToKind: (yt = $t()) == null ? void 0 : yt.kind,
      funderState: (() => {
        const k = wt();
        return k ? k.ok ? k.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const k = wt();
        return !!k && k.ok && k.distinct > 1;
      })(),
      walletCannotSolo: E() && _("standalone"),
      walletCannotMulti: _("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((k) => k !== t.main() && k !== (i == null ? void 0 : i.linked)),
      creditedTo: E() && (i != null && i.address) && (M == null ? void 0 : M.for) === i.address && M.main ? M.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(J("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (V == null ? void 0 : V.for) === i.address && V.unused,
      gift: (() => {
        const k = Xt();
        return k ? { player: k.player, from: k.from, source: k.source, amount: k.amount } : null;
      })(),
      giftPlays: Xt() ? ke() : 0,
      playCost: wn(x()),
      giftStop: zt(),
      albumLock: ue(),
      returnPlan: f(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: _("slots"),
      likeFunds: (() => {
        var lt;
        const k = mt();
        if (!k || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const D = Ct();
        return { address: k, balance: D, low: De(D), album: Mt(), pending: !!vt(k), txid: (lt = vt(k)) == null ? void 0 : lt.txid, main: t.main() };
      })()
    };
  }, ht = () => W ? W < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", dt = (w, $ = "") => {
    m = w, T = $, t.changed();
  };
  async function ee(w, $) {
    if (!u) {
      u = w, T = "", t.changed();
      try {
        await $();
      } catch (q) {
        const et = q instanceof Error ? q.message : String(q);
        T = /Cancelled in the listening wallet/.test(et) ? "" : et, T || (m = "Not now. Nothing was signed.", Ot = !0);
      } finally {
        u = null, await Gt(!0);
      }
    }
  }
  const He = () => !!(e != null && e.enabled) && e.here && (E() || !!t.main() && e.allowed), Fe = () => He() && !j(), Gn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ee = () => {
    if (j()) throw new Error(Gn());
  };
  async function Tn() {
    if (!He()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Ke = (w) => {
    const $ = t.main();
    return w.request("listening.status", $ ? { main: $ } : void 0);
  };
  async function Bn(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await fn(w)));
  }
  async function fn(w = !1) {
    const $ = mt();
    if (!(!Mt() || !$ || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === $ && t.now() - c.at < 3e4))
      try {
        c = { for: $, value: await t.chain.balance($), at: t.now() };
      } catch {
      }
  }
  async function hs(w) {
    if ((tt !== w || t.now() - nt >= 6e4) && (B = await t.links(w), tt = w, nt = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const $ = `${w}:${i.address}`;
    N === $ && S || (S = B.find((q) => q.listening === i.address) ?? null, N = $);
  }
  async function Oe() {
    const w = i == null ? void 0 : i.address;
    if (!E() || !w || i != null && i.linked || !t.funder || v || !o || o <= 0n) return;
    const $ = wt(w);
    if ($ != null && $.ok && $.funder) return;
    const q = $ != null && $.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(z && z.for === w && t.now() - z.at < q)) {
      v = !0;
      try {
        z = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        z = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        v = !1;
      }
      P = z.res.ok ? 0 : P + 1;
    }
  }
  async function ci() {
    const w = i == null ? void 0 : i.address;
    if (!(!E() || !w || i != null && i.linked || !t.mainOf || ct) && !(M && M.for === w && (M.ok || t.now() - M.at < 6e4))) {
      ct = !0;
      try {
        M = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        M = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        ct = !1;
      }
    }
  }
  async function dr() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (V == null ? void 0 : V.for) === w) && t.store.get(J("created", w)) !== "1")
      try {
        V = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function It() {
    var yt;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let $, q = !1;
    const et = /* @__PURE__ */ new Map();
    for (const k of Wt())
      try {
        const D = await t.chain.transaction(k.txid);
        if (!D) {
          if (K.add(k.txid), t.now() - k.created > 15 * 6e4 && !et.has(k.address) && et.set(k.address, await t.chain.confirmedNonce(k.address)), $ = et.get(k.address), $ !== void 0 && $ > BigInt(k.nonce)) {
            ot({ ...k, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((k.status === "unknown" || k.status === "signed") && k.raw)
            try {
              await t.chain.broadcast(k.raw, k.txid), ot({ ...k, status: "pending" });
            } catch (ft) {
              mi(ft) && ot({ ...k, status: "failed", note: ft.message, raw: void 0 });
            }
          continue;
        }
        K.delete(k.txid);
        const lt = String(D.tx_status);
        if (lt === "success" && D.canonical !== !1 && D.is_unanchored === !1) {
          if (ot({ ...k, status: "confirmed", confirmedAt: t.now(), actualFee: String(D.fee_rate ?? k.fee), raw: void 0 }), q = !0, k.kind === "like" && (A = !0, k.status !== "confirmed" && typeof k.liked == "boolean"))
            try {
              (yt = t.likeConfirmed) == null || yt.call(t, k.song, k.liked);
            } catch {
            }
        } else lt.startsWith("abort_") || lt.startsWith("dropped_") ? ot({ ...k, status: "failed", note: lt, raw: void 0 }) : k.status !== "pending" && ot({ ...k, status: "pending" });
      } catch {
      }
    for (const k of Mt() ? [w, mt()] : [w]) {
      const D = vt(k);
      if (D)
        try {
          const lt = await t.chain.transaction(D.txid), ft = String((lt == null ? void 0 : lt.tx_status) ?? "");
          (ft === "success" && lt.is_unanchored === !1 || ft.startsWith("abort_") || ft.startsWith("dropped_") || !lt && t.now() - D.at > 2 * 36e5) && (bt(null, k), ft === "success" && pe(2e4), a = -1 / 0, c = null, /on its way/i.test(m) && (m = ""));
        } catch {
        }
    }
    return q;
  }
  async function Gt(w = !1) {
    var $;
    try {
      const q = t.main();
      if ((w || !e || r !== q || t.now() - n > 3e5) && (e = await t.config(q), n = t.now(), r = q), !e.enabled || !e.here || !E() && (!q || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), St && ps(), t.changed();
        return;
      }
      await Tn(), i = await Ke(s), j() && i.state === "unlocked" && (gr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Ke(s)), q && e.allowed && await hs(q), await Bn(w), await Oe(), await ci(), await dr(), await he(), await It() && await Bn(!0), await fn(), await ys(), W = 0;
    } catch {
      W++;
    }
    if (H() === "locked" ? li() : St && ps(), A) {
      A = !1;
      try {
        ($ = t.likesChanged) == null || $.call(t);
      } catch {
      }
    }
    t.changed(), Le.length && !pr && Mr();
  }
  async function Ie(w) {
    const $ = i == null ? void 0 : i.root;
    if (!$ || i != null && i.slot || !(i != null && i.address) || _("slots")) return;
    const q = Number(t.store.get(J("slot", $)));
    if (!(!Number.isSafeInteger(q) || q < 1))
      try {
        const { balance: et } = await t.chain.account(i.address);
        if (et >= ze + wn(x())) return;
        await w.request("listening.openSlot", { slot: q }), i = await Ke(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Re(w, $) {
    var k;
    Ee();
    const q = !(i != null && i.address) || st(i.address), et = i != null && i.linked ? (k = t.nameOf) == null ? void 0 : k.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: q ? Cr() : void 0, anyPasskey: $, ...t.main() ? { main: t.main() } : {}, ...et ? { label: et } : {} }), i = await Ke(w), q && (st(i.address) ? await Mn() : await w.request("listening.stop")), await Ie(w), dt(q ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const yt = p;
    p = null, yt && t.now() - yt.at < 12e4 && setTimeout(() => void Gt(!0).then(() => yr(yt)), 0);
  }
  function li() {
    St || u || Ot || Tt >= 3 || !s || !(i != null && i.address) || (St = !0, ie = (async () => {
      try {
        await Re(s, !1), Tt = 0;
      } catch (w) {
        const $ = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test($) ? Qt || (Ot = !0, dt("Not now. Nothing was signed.")) : /did not answer/.test($) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Tt++, T = $);
      } finally {
        St = !1;
        const w = Qt;
        Qt = null, w ? await w() : await Gt(!0);
      }
    })());
  }
  async function ps(w) {
    St && (Qt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ie), w && await w(), t.changed();
  }
  const Cr = () => ({
    fee: x().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ls.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Mn() {
    if (!(i != null && i.address)) return !1;
    if (U || (U = await t.tabLock(i.address)), !U)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Kn(w, $) {
    const q = i.address, { balance: et, nonce: yt } = $ ?? await t.chain.account(q);
    o = et;
    const k = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: et.toString(),
      nonce: yt.toString(),
      fee: oo.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (k.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const D = w.mode === "amount" ? w.amount : w.mode === "all" ? et - oo : et - Ls - oo, lt = Qa(k.raw);
    if (er(lt.payload.recipient).value !== w.to || String(lt.payload.amount) !== k.amount || D !== void 0 && k.amount !== D.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ft = {
      id: cl(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: k.recipient,
      amount: k.amount,
      fee: k.fee,
      nonce: yt.toString(),
      created: t.now(),
      status: "signed",
      raw: k.raw,
      txid: k.txid
    };
    t.validate(ft), ot(ft);
    try {
      await t.chain.broadcast(k.raw, k.txid), ot({ ...ft, status: "pending" });
    } catch (Yt) {
      throw ot({ ...ft, status: "unknown", note: Yt.message }), Yt;
    }
    return k;
  }
  const gs = Bc, hr = oo;
  async function Nn(w, $, q) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (_("slots") || _("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const et = i.slot ?? 0;
    if (w === $ || ![w, $].includes(et) || ![w, $].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const yt = i.root ?? i.address, k = w === 0 ? yt : i.address, D = $ === 0 ? yt : i.address, { balance: lt, nonce: ft } = await t.chain.account(k);
    if (lt < q + hr + ze) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Yt = await s.request("listening.signMove", { from: w, to: $, amount: q.toString(), fee: hr.toString(), nonce: ft.toString(), balance: lt.toString() }), Ne = Qa(Yt.raw);
    if (Yt.from !== k || Yt.to !== D || Yt.amount !== q.toString() || er(Ne.payload.recipient).value !== D || String(Ne.payload.amount) !== q.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Ae = {
      id: cl(),
      address: k,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: D,
      amount: Yt.amount,
      fee: Yt.fee,
      nonce: ft.toString(),
      created: t.now(),
      status: "signed",
      raw: Yt.raw,
      txid: Yt.txid
    };
    t.validate(Ae), ot(Ae);
    try {
      await t.chain.broadcast(Yt.raw, Yt.txid), ot({ ...Ae, status: "pending" });
    } catch (ye) {
      throw ot({ ...Ae, status: "unknown", note: ye.message }), ye;
    }
    return bt({ txid: Yt.txid, amount: Yt.amount, at: t.now() }, D), D === yt && yt !== i.address ? c = null : a = -1 / 0, Yt;
  }
  let Vn = !1;
  const Pn = /* @__PURE__ */ new Map(), _n = (w) => J("float", w);
  async function ys() {
    if (Vn || (i == null ? void 0 : i.state) !== "unlocked" || !Mt() || _("move") || _("rootLike") || !i.address) return;
    const w = i.address;
    if (t.store.get(_n(w)) === "1") return;
    const $ = Xt();
    if (!($ != null && $.player) || $.state !== "arrived") return;
    const q = Ct();
    if (q === void 0 || o === void 0) return;
    if (!De(q)) {
      t.store.set(_n(w), "1");
      return;
    }
    if (vt(mt()) || Br() || Wt().length || o < gs * 4n + ze + hr) return;
    const et = Pn.get(w);
    if (!(et && (et.n >= 3 || t.now() - et.at < 5 * 6e4))) {
      Vn = !0, Pn.set(w, { n: ((et == null ? void 0 : et.n) ?? 0) + 1, at: t.now() });
      try {
        await Nn(i.slot ?? 0, 0, gs), t.store.set(_n(w), "1");
      } catch (yt) {
        console.warn("[radio] likes float not sent yet", yt);
      } finally {
        Vn = !1;
      }
    }
  }
  async function ui(w) {
    if (At().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (_("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const $ = await b().catch(() => null);
    if (!$)
      throw rt = null, re = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    re = !1, o = $.balance;
    const q = { balance: $.balance, nonce: $.nonce };
    if (w === "excess") {
      const lt = Xh($.parts) ?? G();
      if (!lt) throw new Error("Choose where to send the excess first.");
      await Kn({ mode: "excess", to: lt, linked: !1 }, q), rt = null, dt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const et = $.steps;
    if (!et.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!rt && rt.balance === $.balance && t.now() - rt.at <= ge && rt.steps.length === et.length && rt.steps.every((lt, ft) => lt.to === et[ft].to && lt.mode === et[ft].mode && lt.send === et[ft].send))) {
      rt = {
        at: t.now(),
        balance: $.balance,
        steps: et,
        parts: $.parts,
        plan: { state: "ready", steps: et.map((lt) => ({ to: lt.to, kind: lt.kind, send: lt.send.toString() })), kept: $.tooSmall, excess: Xh($.parts) }
      }, dt(et.length > 1 ? `This goes back in ${et.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const k = et[0], D = k.to ?? G();
    if (!D) throw new Error("Choose where to send the rest first.");
    if (k.mode === "amount" && _("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Kn({ mode: k.mode, to: D, linked: !1, ...k.mode === "amount" ? { amount: k.send } : {} }, q), rt = null, et.length === 1 ? (kt(!1), dt("Returned ✓ Paying is off.")) : dt(`Returned ✓ ${et.length - 1} more ${et.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const ws = {
    forceRefresh: () => Gt(!0),
    create: () => ee("Waiting for your passkey…", async () => {
      const w = await Tn();
      await w.request("listening.unlock", { mode: "create", terms: Cr(), ...t.main() ? { main: t.main() } : {} }), i = await Ke(w), i.address && t.store.set(J("created", i.address), "1"), kt(!0), dt(E() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Mn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? pe() : Lt = null, t.changed();
    },
    giftSent: (w, $) => {
      !(i != null && i.address) || Kt() || (bt({ txid: w, amount: $.toString(), at: t.now() }), a = -1 / 0, Y = null, dt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (Ee(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Tn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, $, q, et) => {
      bt({ txid: q, amount: et.toString(), at: t.now() }, $), Y = null, await ws.openAlbum(w), dt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => ee("Opening…", async () => {
      if (Ee(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === w) return;
      gr(), await s.request("listening.openSlot", { slot: w }), i = await Ke(s), o = void 0, a = -1 / 0, rt = null, re = !1;
      const $ = i.root;
      $ && w > 0 && t.store.set(J("slot", $), String(w)), dt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const $ = () => ee("Waiting for your passkey…", async () => Re(await Tn(), w));
      return St ? w ? _("cancel") ? (dt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ps(async () => {
        (H() === "locked" || H() === "intro") && await $();
      }) : ie : $();
    },
    link: () => ee("Sign in your wallet…", async () => {
      Ee();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const $ = (await t.links(w)).find((q) => q.listening === i.address);
      if ($)
        await s.request("listening.link", { main: w, issued: $.issued, mainSignature: $.mainSignature });
      else {
        const q = { main: w, listening: i.address, issued: t.now() }, et = await t.signWithMain(w, R5(q)), yt = await s.request("listening.link", { main: w, issued: q.issued, mainSignature: et });
        await t.saveLink({ ...q, mainSignature: et, listeningSignature: yt.listeningSignature }), nt = -1 / 0;
      }
      dt("Linked ✓");
    }),
    deposit: () => ee("Approve the deposit in your wallet…", async () => {
      Ee();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Kt()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Bn(!0);
      const $ = ol(o ?? 0n);
      if ($ <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      X = await t.deposit(w, i.address, $), X && bt({ txid: X, amount: $.toString(), at: t.now() }), dt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => ee("Approve the top-up in your wallet…", async () => {
      Ee();
      const w = t.main(), $ = mt();
      if (!w || !$) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (vt($)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const q = await t.chain.balance($);
      Mt() ? c = { for: $, value: q, at: t.now() } : (o = q, a = t.now());
      const et = ol(q);
      if (et <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const yt = await t.deposit(w, $, et);
      yt && bt({ txid: yt, amount: et.toString(), at: t.now() }, $), dt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => ee("Adding plays…", async () => {
      if (Ee(), !Mt()) throw new Error("Open the album you want to add plays to first.");
      if (!La.includes(w)) throw new Error("Choose one of the amounts offered.");
      const $ = Q5(w, x());
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (Wt().length || Kt()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Nn(0, i.slot ?? 0, $), dt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => ee("Confirm in the listening wallet…", async () => {
      if (!Fe()) throw new Error("Connect your wallet first.");
      await Mn(), await s.request("listening.approveSession", Cr()), kt(!0), dt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => ee("Clearing…", async () => {
      for (const w of Cn())
        await t.chain.transaction(w.txid) || ot({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      dt("Cleared ✓");
    }),
    switchOff: () => ee("Switching off…", async () => {
      gr(), await (s == null ? void 0 : s.request("listening.stop")), kt(!1), dt("Paying is off. Music stays free.");
    }),
    lock: () => ee("Locking…", async () => {
      gr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, dt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const $ = String(w ?? "").trim();
      if (!(i != null && i.address)) return dt("", "Unlock the listening wallet first.");
      if (!Ys($)) return dt("", "Enter a standard mainnet address (it starts with SP).");
      if ($ === i.address) return dt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(R(i.address), $), dt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(R(i.address), ""), t.changed();
    },
    returnFunds: (w) => ee("Check the return in the listening wallet…", async () => {
      if (!Fe()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (h()) return ui(w);
      const $ = $t();
      if (!$) throw new Error(E() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if ($.kind !== "linked" && _("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (At().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Kn({ mode: w, to: $.to, linked: $.kind === "linked" }), w === "all" && kt(!1), dt(w === "all" ? $.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Le = [], eo = 10, Tr = 30 * 6e4;
  let pr = !1;
  const Br = () => d || !!u || l || y, gr = () => {
    Le.length && (Le.length = 0, t.changed());
  };
  async function fi(w) {
    if (!Le.some(($) => $.id === w.id) && !O().some(($) => $.id === w.id) && (Le.push({ ...w, at: t.now() }), Le.length > eo && Le.shift()), Br() || At().length) {
      const $ = Le.length;
      m = `Queued ${$ === 1 ? "this song" : $ + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Mr();
  }
  async function Mr() {
    if (!pr) {
      pr = !0;
      try {
        for (; Le.length; ) {
          for (; Le.length && t.now() - Le[0].at > Tr; ) Le.shift();
          if (!Le.length || Br() || await di(Le[0]) === "wait") return;
          Le.shift();
        }
      } finally {
        pr = !1, t.changed();
      }
    }
  }
  async function di(w) {
    var $;
    d = !0;
    try {
      await Gt();
      const q = H();
      if (q === "loading") return "wait";
      if (q !== "ready" || !st() || !(i != null && i.session) || i.session.playsLeft < 1 || !U) return "done";
      if (At().length) return "wait";
      I || (await t.chain.verify(), I = !0);
      const et = i.address, { balance: yt, nonce: k } = await t.chain.account(et);
      o = yt, a = t.now();
      const D = await t.chain.owner(al, w.song);
      if (D === et || D === t.main()) return "done";
      const lt = await s.request("listening.signPlay", {
        core: al,
        song: w.song,
        receipt: w.id,
        fee: x().toString(),
        nonce: k.toString(),
        balance: yt.toString()
      }), ft = {
        id: w.id,
        address: et,
        kind: "play",
        core: al,
        song: w.song,
        recipient: D,
        amount: "50",
        fee: x().toString(),
        nonce: k.toString(),
        created: t.now(),
        status: "signed",
        raw: lt.raw,
        txid: lt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(ft), ot(ft);
      const Yt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(lt.raw, lt.txid), ot({ ...ft, status: "pending" }), m = `♪ Paid ${Yt}`, T = "";
      } catch (Ne) {
        ot({ ...ft, status: mi(Ne) ? "failed" : "unknown", note: Ne.message, ...mi(Ne) ? { raw: void 0 } : {} }), T = Ne.message;
      }
      return i = await Ke(s), "done";
    } catch (q) {
      const et = q instanceof Error ? q.message : "payment unavailable";
      return ($ = Xt()) != null && $.player ? (m = "Payment is taking a moment: " + et, "wait") : (m = "This song played free: " + et, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function hi(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(H()) || _("like") ? !1 : (yr(w), !0);
  }
  async function yr(w) {
    const $ = w.title ? `“${w.title}”` : `song #${w.song}`, q = (En) => {
      var bs;
      T = En, m = "";
      try {
        (bs = t.likeFailed) == null || bs.call(t, w.song);
      } catch {
      }
      t.changed();
    }, et = Mt(), yt = H(), k = t.main(), D = et && (yt === "fund" || yt === "over") ? "ready" : yt, lt = E() ? mt() : k;
    if (D === "locked") {
      p = { ...w, at: t.now() }, dt(`Unlock to like ${$}. It sends straight after.`);
      return;
    }
    if (D === "wrong-wallet") return q(Gn());
    if (D === "link") return q("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (E() && _("standalone")) return q("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (D === "fund") return q("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (D === "over") return q("Return the excess first: the listening wallet holds more than 1 STX.");
    if (et) {
      await fn(!0);
      const En = Ct();
      if (De(En))
        return t.changed(), q(Zh);
    }
    if (D !== "ready" || !lt) return q("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return q("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!U) return q("Pay-per-play is running in another tab. Like from that tab.");
    const ft = O(mt()).find((En) => En.kind === "like" && En.song === w.song);
    if (ft && ao.includes(ft.status))
      return q(`Your last like for ${$} is still on its way. It can change again once it confirms.`);
    if (l) return q("One like at a time: your last one is still being sent.");
    if ((ft == null ? void 0 : ft.status) === "confirmed" && t.now() - (ft.confirmedAt ?? 0) < t6)
      return q(`Your like for ${$} has only just confirmed. Try again in a moment.`);
    let Yt;
    y = !0;
    try {
      Yt = t.likeState ? (await t.likeState(lt, w.song)).by : w.likedBy ?? [];
    } catch {
      Yt = w.likedBy;
    } finally {
      y = !1;
    }
    if (!Yt) return q(`Could not check ${$} right now. Try the heart again.`);
    const Ne = mt(), ye = ((ft == null ? void 0 : ft.status) === "confirmed" && typeof ft.liked == "boolean" && t.now() - (ft.confirmedAt ?? ft.created) < 5 * 6e4 ? ft.liked : void 0) ?? Yt.includes(Ne);
    if (!ye && Yt.some((En) => En !== Ne)) return q(E() ? `${$} was liked from another wallet of yours. Unlike it there.` : `${$} was liked from your main wallet${Yt.includes(k) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await pi({ song: w.song, liked: !ye, title: w.title, artist: w.artist });
  }
  async function pi(w) {
    var et, yt, k;
    if (l) {
      dt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const $ = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, q = t.wait ?? ((D) => new Promise((lt) => setTimeout(lt, D)));
    try {
      dt(`${w.liked ? "Liking" : "Unliking"} ${$}…`);
      const D = t.now() + 12e4;
      for (; d || (Mt() ? O(mt()).some((ye) => ao.includes(ye.status)) : At().length); ) {
        if (t.now() > D) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await q(5e3), await Gt(!0);
      }
      if (!Mt() && H() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const lt = mt(), { balance: ft, nonce: Yt } = await t.chain.account(lt);
      if (Mt() ? c = { for: lt, value: ft, at: t.now() } : (o = ft, a = t.now()), De(ft)) throw new Error(Zh);
      const Ne = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: il.toString(),
        nonce: Yt.toString(),
        balance: ft.toString()
      }), Ae = {
        id: cl(),
        address: lt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: il.toString(),
        nonce: Yt.toString(),
        created: t.now(),
        status: "signed",
        raw: Ne.raw,
        txid: Ne.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(Ae), ot(Ae);
      try {
        await t.chain.broadcast(Ne.raw, Ne.txid), ot({ ...Ae, status: "pending" }), m = `${w.liked ? "♥ Liked" : "Unliked"} ${$}`, T = "";
        try {
          (et = t.likeSent) == null || et.call(t, w.song, w.liked);
        } catch {
        }
      } catch (ye) {
        if (ot({ ...Ae, status: mi(ye) ? "failed" : "unknown", note: ye.message, ...mi(ye) ? { raw: void 0 } : {} }), T = ye.message, mi(ye)) try {
          (yt = t.likeFailed) == null || yt.call(t, w.song);
        } catch {
        }
      }
      i = await Ke(s);
    } catch (D) {
      T = "Like not sent: " + (D instanceof Error ? D.message : "the listening wallet is unavailable");
      try {
        (k = t.likeFailed) == null || k.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Mr();
    }
  }
  return { snapshot: ut, refresh: Gt, onListened: fi, heart: hi, toggleLike: yr, ...ws };
}
const zy = ["Connect", "Passkey", "Link & fund", "Listen"], Ry = ["Passkey", "Add 1 STX", "Listen"], gu = (t) => t ? Ry : zy;
function n6(t) {
  if (t.solo) return r6(t);
  const e = zy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function r6(t) {
  const e = Ry.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function s6(t, e) {
  return !e || e.at >= gu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const i6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function o6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !i6(r.id)));
}
const a6 = {}, c6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, l6 = (t) => {
  const e = a6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, u6 = (t) => `/hiro/${t}`, f6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, d6 = (t) => {
  const e = l6(t);
  if (e)
    return [f6(e)];
  const n = c6[t];
  return typeof window < "u" ? [`${window.location.origin}${u6(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, h6 = {}, Qh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, p6 = "xtrata.log.enabled", g6 = "xtrata.log.level", y6 = "xtrata.log.tags", w6 = "xtrata.log.dedupe", ya = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, b6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, m6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, x6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, S6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, E6 = () => {
  const t = h6 ?? {}, e = ya(p6) ?? t.VITE_LOG_ENABLED, n = ya(g6) ?? t.VITE_LOG_LEVEL, r = ya(y6) ?? t.VITE_LOG_TAGS, s = ya(w6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: b6(e),
    level: m6(n) ?? "warn",
    tags: S6(r),
    dedupe: x6(s)
  };
}, A6 = (t, e, n) => !t.enabled || Qh[n] < Qh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), v6 = (t, e, n, r) => {
  const s = E6();
  if (!A6(s, e, t) || k6(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, $6 = /* @__PURE__ */ new Set();
let Jh = null;
const k6 = (t, e, n, r, s) => (Jh !== t && ($6.clear(), Jh = t), !1), I6 = (t, e, n) => v6("debug", t, e, n), L6 = {}, C6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, T6 = (t) => {
  const e = L6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : C6[t];
}, B6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, M6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return B6.test(n) ? n : null;
}, N6 = (t) => t.replace(/\/+$/, ""), P6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), t0 = (t) => {
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
}, xi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, _6 = (t) => {
  var c, u;
  let e;
  try {
    e = er(_8(t));
  } catch {
    return null;
  }
  const n = xi(e);
  if (!n || n.success === !1)
    return null;
  const r = xi(n.value), s = xi(r == null ? void 0 : r.value), i = xi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = t0((c = xi(i.name)) == null ? void 0 : c.value), a = t0((u = xi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : M6(`${o}.${a}`);
}, U6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${N6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Ey(iy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : _6(i.result);
}, H6 = async (t) => {
  const e = t.address.trim();
  if (!Ci(e))
    return null;
  const n = T6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of d6(t.network))
    try {
      return await U6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return I6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: P6(r)
  }), null;
};
function O6(t, e, n = {}) {
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
const e0 = Object.freeze({
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
}), n0 = Object.freeze({ 139: "melophonic" });
function D6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(e0, n) ? e0[n] : Object.hasOwn(n0, n) ? n0[n] : e;
}
const r0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function F6(t, e = "") {
  return Object.hasOwn(r0, String(t)) ? r0[String(t)] : e;
}
const Gy = 100000n, kf = 1000000n, nc = 3000n, j6 = (t, e) => `${t}#gift=${e}`, z6 = 100, wa = (t, e = ai) => t <= ze ? 0 : Number((t - ze) / wn(e)), s0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ky = "xtrata.xyz/radio/gifts", ll = z6, R6 = "Create a prefunded Xtrata radio gift batch", G6 = (t) => ({
  domain: Ws({ name: We(Ky), version: We("1"), "chain-id": ir(1) }),
  message: Ws({
    purpose: We(R6),
    creator: We(t.creator),
    count: ir(t.count),
    amount: ir(BigInt(t.amount)),
    label: We(t.label),
    issued: ir(t.issued),
    ...t.player ? { player: We(t.player) } : {}
  })
}), K6 = (t, e, n = ai) => ze + BigInt(t) * wn(n) + (e ? Bc : 0n), V6 = (t, e = ai) => Number((kf - ze - (t ? Bc : 0n)) / wn(e)), q6 = (t, e) => BigInt(t) * (e + nc);
function W6(t, e, n, r = ai) {
  const s = n ? Bc : 0n, i = e > ze + s ? e - ze - s : 0n, o = Number(i / wn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * tc,
    fees: BigInt(o) * r,
    reserve: ze,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: nc,
    perCopy: e + nc,
    total: q6(t, e)
  };
}
const X6 = (t) => t >= Gy && t <= kf, i0 = 40, Y6 = "Create an Xtrata radio gift player", Z6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function o0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && Z6.test(t) : !n;
}
function Q6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!o0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!o0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > i0) throw new Error(`A player holds 1 to ${i0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const J6 = (t) => cp(pp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), t$ = (t) => ({
  domain: Ws({ name: We(Ky), version: We("1"), "chain-id": ir(1) }),
  message: Ws({
    purpose: We(Y6),
    admin: We(t.admin),
    player: We(t.hash),
    issued: ir(t.issued)
  })
}), To = (t) => t.tracks.filter((e) => !e.hidden), e$ = (t) => t.tracks.find((e) => e.hidden) ?? null, n$ = [300, 500, 1e3], a0 = 1800, ul = /* @__PURE__ */ new Map();
async function Vy(t) {
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
async function r$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Vy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function qy(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = ul.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      ul.set(t, { ...a, until: Date.now() + a0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ul.delete(t), s();
      }, a0 + 50);
    }
  }, i;
}
const Cs = (t, e, n, r, s) => qy(t, e, async () => await Vy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), ms = "xtrata.radio.gift.incoming.v1", c0 = (t) => "xtrata.radio.gift.mine.v1:" + t, l0 = (t) => "xtrata.radio.gift.batches.v1:" + t, Et = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, xr = (t, e, n = "") => {
  const r = Et("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, ba = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, hn = (t) => Qn(t).replace(/\.?0+$/, "");
function s$(t) {
  let e = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), j = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return j !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), s0(j) ? j : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const E = JSON.parse(t.store.get(ms) || "null");
      return s0(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(ms, JSON.stringify({ code: i, at: t.now() }));
    let E = 0;
    const j = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (R) => {
      const G = await R.json().catch(() => ({}));
      if (R.status === 404) {
        t.store.set(ms, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!R.ok) throw new Error("busy");
      const wt = G;
      e = { ...e, view: wt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(wt.status) && t.store.set(ms, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void j(), n(E++)));
    });
    j();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const E = e == null ? void 0 : e.view;
    return !(E != null && E.player) || !o() ? null : { player: E.player, from: u(E), plays: wa(BigInt(E.amount)) };
  }, c = () => {
    e = null, t.store.set(ms, null), t.changed();
  }, u = (E) => E.from ? t.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let d = {};
  const l = (E) => {
    if (d.box) return d.box;
    const j = Et("div", "", "ppp-gift-check");
    d.box = j;
    const R = () => {
      const G = window.turnstile;
      !G || d.rendered || (d.rendered = !0, G.render(j, { sitekey: E, callback: (wt) => {
        d.token = wt, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) R();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = R, document.head.append(G);
    }
    return j;
  }, y = (E) => {
    queueMicrotask(() => void E());
  };
  let p;
  async function A(E) {
    var G, wt, $t, de, Xt, he, xe, ke, Jt;
    if (!e || e.claiming || !E.listening) return;
    const j = !!((G = e.view) != null && G.player);
    if (j && !E.root) return;
    e.claiming = !0, e.error = void 0, (wt = t.claiming) == null || wt.call(t, !0), t.changed();
    const R = async (Vt) => {
      const zt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...Vt })
      });
      return { res: zt, r: await zt.json().catch(() => ({})) };
    };
    try {
      let Vt = 0, zt = E.listening, Se;
      if (j) {
        const h = Number(($t = await t.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : $t.next);
        if (!Number.isSafeInteger(h) || h < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Vt = h;
        for (let b = 0; ; b++) {
          const f = await t.album.bind(Vt);
          if (zt = f.address, Se = await R({ wallet: zt, binding: f }), Se.res.status === 409 && /just taken/.test(((de = Se.r) == null ? void 0 : de.error) || "") && b < 5) {
            Vt += 1;
            continue;
          }
          break;
        }
      } else Se = await R({ wallet: zt });
      const { res: ue, r: ge } = Se;
      if (ue.status === 503 && /sending another gift/.test((ge == null ? void 0 : ge.error) || "")) {
        e.waiting = !0, (Xt = t.claiming) == null || Xt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ue.ok) {
        const h = String((ge == null ? void 0 : ge.error) || "");
        if (ue.status === 404 || ue.status === 410 || ue.status === 409 && /already had a gift|brand-new|already have this album/.test(h))
          throw t.store.set(ms, null), new Error(h || "This gift cannot be opened.");
        if (ue.status === 429 || ue.status === 403 || ue.status === 400 && !/wallet number/i.test(h)) throw new Error(h || `Could not open the gift (${ue.status}).`);
        const f = /topping up/.test(h) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(h) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(h) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(f), { retry: !0, slow: /topping up|not paid for yet/.test(h) });
      }
      e.done = !0, t.store.set(ms, null), j ? await t.album.arrived(Vt, zt, ge.txid, BigInt(ge.amount)) : t.giftSent(ge.txid, BigInt(ge.amount));
    } catch (Vt) {
      const zt = Vt, Se = zt.name === "TypeError" || zt.name === "AbortError" || zt.name === "TimeoutError" || /wallet number/i.test(zt.message);
      if (zt.retry || Se) {
        const ue = e.tries ?? 0;
        e.tries = ue + 1, e.retry = { text: zt.retry ? zt.message : "Still sending your gift… the network is slow, trying again." }, (he = t.claiming) == null || he.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, zt.slow ? 6e4 : n(ue));
      } else
        e.error = zt.message, (xe = t.claiming) == null || xe.call(t, !1);
      d.token = void 0;
      try {
        (Jt = (ke = window.turnstile) == null ? void 0 : ke.reset) == null || Jt.call(ke, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let m = null;
  function T(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return m = null, [];
    if (!m || m.wallet !== E.listening || t.now() - m.at > 3e4) {
      const R = E.listening;
      m = { ...(m == null ? void 0 : m.wallet) === R ? m : {}, wallet: R, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(R)).then((G) => {
        var wt, $t;
        (m == null ? void 0 : m.wallet) === R && (m.state = (wt = G == null ? void 0 : G.gift) == null ? void 0 : wt.state, m.problem = (($t = G == null ? void 0 : G.gift) == null ? void 0 : $t.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(m.state === "sending" && m.problem)) return [];
    const j = Et("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return j.title = `Network reply: ${m.problem}`, [j];
  }
  function W(E, j, R = !1) {
    var he, xe;
    const G = j.player, wt = BigInt(j.amount), $t = R ? [] : [Et("p", `🎁 ${u(j)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${To(G).length} ${To(G).length === 1 ? "song" : "songs"} and ${wa(wt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step)))
      return R || $t.push(Et("p", E.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : E.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), $t;
    if (E.walletCannotAlbums)
      return $t.push(Et("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), $t;
    const Xt = (xe = (he = E.gate) == null ? void 0 : he.gifts) == null ? void 0 : xe.turnstileSiteKey;
    return Xt && !d.token ? $t.push(Et("p", "One quick check and it is yours:", "ppp-mute"), l(Xt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => A(E)), $t.push(...X(E, "Sending your album…")), $t;
  }
  function X(E, j) {
    const R = [];
    return e.claiming || e.waiting ? R.push(Et("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : j, "ppp-cyan")) : e.retry && R.push(Et("p", e.retry.text, "ppp-warn"), xr("Try now", () => {
      clearTimeout(p), e.retry = void 0, A(E);
    }, "quiet")), e.error && R.push(Et("p", e.error, "ppp-bad"), xr("Try again", () => {
      e.error = void 0, A(E);
    })), R;
  }
  const S = (E) => {
    var j;
    return !!e && !e.done && !e.error && o() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((j = e.view) != null && j.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function N(E, j = {}) {
    var Jt, Vt;
    const R = T(E);
    if (!e || ["off", "elsewhere"].includes(E.step)) return R;
    const G = e.view;
    if (e.error && !G) return [Et("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [Et("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return R;
    if (G.status === "claimed" || G.status === "claiming") return [Et("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [Et("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [Et("p", `🎁 ${u(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...W(E, G, !!j.bare), ...R];
    if (!!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0))
      return [Et("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")];
    const $t = BigInt(G.amount), de = wa($t).toLocaleString(), he = [Et(
      "p",
      `🎁 ${u(G)} sent you ${hn($t)} STX of on-chain music: about ${de} paid plays.`,
      "ppp-gift"
    )], xe = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, ke = (Vt = (Jt = E.gate) == null ? void 0 : Jt.gifts) == null ? void 0 : Vt.turnstileSiteKey;
    return xe ? (ke && !d.token ? he.push(Et("p", "One quick check and it is yours:", "ppp-mute"), l(ke)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => A(E)), he.push(...X(E, "Sending your gift…"))) : E.step === "intro" ? he.push(Et("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : E.listening && E.linked ? he.push(Et("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && he.push(Et("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), xr("Forget this gift link here", c, "quiet")), he;
  }
  async function B(E, j, R) {
    var G;
    try {
      const wt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((G = wt == null ? void 0 : wt.gift) != null && G.returnTo) return { ok: !0, funder: wt.gift.returnTo, txId: wt.gift.txid ?? void 0, amount: wt.gift.amount, distinct: 1 };
    } catch {
      if (R) return { ok: !1 };
    }
    return j();
  }
  const tt = Et("div", "", "ppp-gift-fold");
  let nt = 250000n, K = "", z = "";
  const v = (E) => {
    try {
      const j = JSON.parse(t.store.get(c0(E)) || "[]");
      return Array.isArray(j) ? j : [];
    } catch {
      return [];
    }
  }, P = (E, j) => t.store.set(c0(E), JSON.stringify(j.slice(0, 50)));
  let M = 0;
  async function V(E) {
    const j = v(E);
    for (const R of j)
      if (!(R.view && ["claimed", "refunded", "expired"].includes(R.view.status)))
        try {
          R.view = !R.view || R.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: R.id, ...R.txid ? { txid: R.txid } : {} }) }) : await t.json("/radio/gift?id=" + R.id), R.error = void 0;
        } catch (G) {
          R.error = G.message;
        }
    P(E, j), t.changed();
  }
  async function ct(E) {
    if (K) return;
    K = "Starting your gift…", z = "", t.changed();
    let j = null;
    try {
      j = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: nt.toString() }) });
      const R = v(E);
      R.unshift({ id: j.id, code: j.code, amount: nt.toString(), at: t.now() }), P(E, R), K = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay(E, j.depositTo, BigInt(j.deposit), j.memo), wt = v(E), $t = wt.find((de) => de.id === j.id);
      $t && ($t.txid = G, $t.view = { status: "pending-deposit", amount: nt.toString(), source: "friend", from: E, label: "", expires: 0 }), P(E, wt), z = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", V(E);
    } catch (R) {
      z = R.message || "Not sent.";
    } finally {
      K = "", t.changed();
    }
  }
  const Y = (E) => "xtrata.radio.gift.players.v1:" + E, L = (E) => {
    try {
      const j = JSON.parse(t.store.get(Y(E)) || "[]");
      return Array.isArray(j) ? j.filter((R) => R && /^[0-9a-f]{16}$/.test(R.id)) : [];
    } catch {
      return [];
    }
  };
  async function rt(E, j) {
    var R;
    if (!K) {
      K = "Checking the player…", z = "", t.changed();
      try {
        const G = j.tracks.split(/[\s,]+/).filter(Boolean).map((xe) => Number(xe.replace(/^#/, ""))), wt = Q6({ title: j.title.trim(), subtitle: j.subtitle.trim(), tracks: G, cover: (R = j.cover) != null && R.trim() ? Number(j.cover.trim().replace(/^#/, "")) : null });
        K = "Sign in your wallet…", t.changed();
        const $t = { admin: E, hash: J6(wt), issued: t.now() }, de = await t.sign(E, t$($t));
        K = "Making the player…", t.changed();
        const Xt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: wt, request: $t, signature: de }) }), he = L(E).filter((xe) => xe.id !== Xt.id);
        he.unshift({ id: Xt.id, title: Xt.title, tracks: Xt.tracks }), t.store.set(Y(E), JSON.stringify(he.slice(0, 30))), z = `${Xt.existing ? "That player already exists" : "Player made"} ✓ “${Xt.title}” · ${Xt.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        z = G.message || "Not made.";
      } finally {
        K = "", t.changed();
      }
    }
  }
  const re = (E, j) => j6(E || location.origin + "/radio.html", j), I = (E) => r$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: E }), U = (E) => {
    try {
      const j = JSON.parse(t.store.get(l0(E)) || "[]");
      return Array.isArray(j) ? j.filter((R) => R && /^[0-9a-f]{16}$/.test(R.id) && Array.isArray(R.codes)) : [];
    } catch {
      return [];
    }
  }, St = (E, j) => t.store.set(l0(E), JSON.stringify(j.slice(0, 20))), Ot = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Tt = (E, j) => t.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(j) });
  let Qt = 0;
  async function ie(E) {
    const j = U(E);
    for (const R of j)
      if (!Ot(R))
        try {
          R.view = !R.view || R.view.status === "pending-deposit" ? await Tt("/radio/gift/batch/confirm", { id: R.id, ...R.txid ? { txid: R.txid } : {} }) : await t.json("/radio/gift/batch?id=" + R.id), R.error = void 0;
        } catch (G) {
          R.error = G.message;
        }
    try {
      const R = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const G of (R == null ? void 0 : R.batches) ?? []) {
        const wt = j.find(($t) => $t.id === G.id);
        if (wt) {
          wt.error || (wt.view = G);
          continue;
        }
        j.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    St(E, j), t.changed();
  }
  async function x(E, j) {
    const R = U(E).find((G) => G.id === j);
    if (!(!R || !R.depositTo || K)) {
      K = "Approve the payment in your wallet…", z = "", t.changed();
      try {
        const G = await t.pay(E, R.depositTo, BigInt(R.deposit), R.memo), wt = U(E), $t = wt.find((de) => de.id === j);
        $t && ($t.txid = G), St(E, wt), z = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", K = "", ie(E);
      } catch (G) {
        z = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        K = "", t.changed();
      }
    }
  }
  async function _(E, j, R, G) {
    if (K) return;
    if (!j.ok) {
      z = j.reason, t.changed();
      return;
    }
    K = "Sign in your wallet…", z = "", t.changed();
    let wt = null;
    try {
      const $t = { creator: E, count: j.count, amount: j.amount.toString(), label: R, issued: t.now(), ...G ? { player: G } : {} }, de = await t.sign(E, G6($t));
      K = "Making your links…", t.changed(), wt = await Tt("/radio/gift/batch", { request: $t, signature: de });
      const Xt = U(E);
      Xt.unshift({ id: wt.id, codes: wt.codes, count: j.count, amount: wt.amount, label: R, player: G ?? null, depositTo: wt.depositTo, deposit: wt.deposit, memo: wt.memo, at: t.now() }), St(E, Xt);
    } catch ($t) {
      z = $t.message || "Not made.", K = "", t.changed();
      return;
    }
    K = "", t.changed(), await x(E, wt.id);
  }
  function J() {
    const E = !!Dt.value, j = le.value === "max" ? V6(E) : Number(le.value), R = K6(j, E), G = Number(mt.value);
    return !Number.isInteger(G) || G < 1 || G > ll ? { ok: !1, reason: `Make 1 to ${ll} copies at a time.`, album: E, plays: j, amount: R, count: G } : X6(R) ? { ok: !0, reason: "", album: E, plays: j, amount: R, count: G, bill: W6(G, R, E) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: E, plays: j, amount: R, count: G };
  }
  const O = () => {
    const E = J();
    if (!E.ok) return E.reason;
    const j = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${hn(j.holders)} to song holders, ${hn(j.fees)} network fees)${E.album ? `, ${hn(j.float)} for the album’s likes` : ""}, ${hn(j.reserve)} kept so a listener can return what is left, + ${hn(j.sendFee)} to send it = ${hn(j.perCopy)} STX. ${E.count} copies = ${hn(j.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, ot = (E, j) => j.codes.map((R) => re(E, R)), st = Et("input");
  st.type = "range", st.min = String(Gy), st.max = String(kf), st.step = "50000", st.value = String(nt), st.setAttribute("aria-label", "Gift amount");
  const kt = Et("p", "", "ppp-gift-amount"), At = xr("", () => {
    const E = t.main();
    E && ct(E);
  }, "primary"), Wt = () => {
    kt.textContent = Kt(), At.textContent = `Gift ${hn(nt)} STX`;
  };
  st.oninput = () => {
    nt = BigInt(st.value), Wt();
  };
  const Kt = () => `${hn(nt)} STX · about ${wa(nt).toLocaleString()} paid plays · you pay ${hn(nt + nc)} STX with the network fee`;
  Wt();
  const vt = Et("input");
  vt.maxLength = 60, vt.placeholder = "Title, e.g. Proof of Sound", vt.setAttribute("aria-label", "Player title");
  const bt = Et("input");
  bt.maxLength = 80, bt.placeholder = "Artist (optional)", bt.setAttribute("aria-label", "Player subtitle");
  const Lt = Et("textarea");
  Lt.rows = 3, Lt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Lt.setAttribute("aria-label", "Songs");
  const pe = Et("input");
  pe.inputMode = "numeric", pe.placeholder = "Cover inscription number (optional), shown when the album loads", pe.setAttribute("aria-label", "Cover inscription");
  const Dt = Et("select");
  Dt.setAttribute("aria-label", "Batch album");
  const le = Et("select");
  le.setAttribute("aria-label", "Plays per copy");
  for (const E of n$) le.append(ba(`${E.toLocaleString()} plays`, String(E)));
  le.append(ba("Max (1 STX)", "max"));
  const mt = Et("input");
  mt.type = "number", mt.min = "1", mt.max = String(ll), mt.value = "10", mt.setAttribute("aria-label", "Copies");
  const Mt = Et("input");
  Mt.maxLength = 40, Mt.placeholder = "Label, e.g. Opera launch", Mt.setAttribute("aria-label", "Batch label");
  const Ct = Et("p", "", "ppp-mute"), De = () => {
    Ct.textContent = O();
  };
  for (const E of [Dt, le, mt])
    E.oninput = De, E.onchange = De;
  De();
  function Cn(E) {
    var wt, $t, de, Xt, he, xe;
    const j = (wt = E.gate) == null ? void 0 : wt.gifts;
    if (!(j != null && j.enabled) || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const R = t.main(), G = [Et("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!R)
      G.push(Et("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      At.disabled = !!K, G.push(st, kt, At), t.now() - M > 3e4 && (M = t.now(), V(R));
      const ke = v(R);
      if (ke.length) {
        const Jt = Et("ul", "", "ppp-gift-list");
        for (const Vt of ke.slice(0, 10)) {
          const zt = ($t = Vt.view) == null ? void 0 : $t.status, Se = Vt.error ? Vt.error : !zt || zt === "pending-deposit" ? Vt.txid ? "payment confirming…" : "waiting for your payment" : zt === "live" ? "ready to share" : zt === "claiming" || zt === "claimed" ? "claimed ✓" : zt === "refunding" ? "expired · refund on its way" : zt === "refunded" ? "expired · refunded to you" : zt, ue = Et("li");
          if (ue.append(Et("span", `${hn(BigInt(Vt.amount))} STX`, "t"), Et("span", Se, ((de = Vt.view) == null ? void 0 : de.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Xt = Vt.view) == null ? void 0 : Xt.status) === "live") {
            const ge = re(((he = E.gate) == null ? void 0 : he.radioUrl) ?? null, Vt.code);
            ue.append(Cs("gift-copy:" + Vt.id, "Copy link", () => ge, "tiny", t.changed), qy("gift-share:" + Vt.id, "Share", () => I(ge), "tiny", t.changed));
          }
          Jt.append(ue);
        }
        G.push(Jt);
      }
      if (j.admin) {
        const Jt = Et("div", "", "ppp-gift-admin"), Vt = (h, b) => {
          const f = Et("label", h);
          return f.append(b), f;
        }, zt = L(R);
        Jt.append(
          Et("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          vt,
          bt,
          Lt,
          pe,
          xr("Sign and make player", () => void rt(R, { title: vt.value, subtitle: bt.value, tracks: Lt.value, cover: pe.value }))
        );
        const Se = xr("Sign, pay and make links", () => {
          _(R, J(), Mt.value.trim(), Dt.value || void 0);
        });
        Se.disabled = !!K;
        const ue = Dt.value;
        Dt.replaceChildren(ba("No album (starter copies)", ""), ...zt.map((h) => ba(`${h.title} · ${h.tracks} songs`, h.id))), zt.some((h) => h.id === ue) && (Dt.value = ue), De(), Jt.append(
          Et("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          Vt("Album ", Dt),
          Vt("Plays each ", le),
          Vt("Copies ", mt),
          Mt,
          Ct,
          Se
        ), t.now() - Qt > 3e4 && (Qt = t.now(), ie(R));
        const ge = U(R);
        if (ge.length) {
          const h = Et("ul", "", "ppp-gift-list");
          for (const b of ge.slice(0, 10)) {
            const f = b.view, H = f == null ? void 0 : f.copies, ut = b.error ? b.error : !f || f.status === "pending-deposit" ? b.txid ? "payment confirming…" : "waiting for your payment" : `${H.claimed} of ${f.count} claimed${H.refunding + H.refunded ? ` · ${H.refunded} refunded${H.refunding ? `, ${H.refunding} on their way` : ""}` : ""}`, ht = Et("li");
            if (ht.append(Et("span", `${b.label || "Batch"} · ${b.count} × ${hn(BigInt(b.amount))} STX`, "t"), Et("span", ut, "ppp-mute")), !b.txid && b.depositTo && (!f || f.status === "pending-deposit") && ht.append(xr("Pay now", () => void x(R, b.id), "tiny")), b.codes.length && (f == null ? void 0 : f.status) === "live") {
              const dt = ot(((xe = E.gate) == null ? void 0 : xe.radioUrl) ?? null, b);
              ht.append(
                Cs("batch-copy:" + b.id, "Copy all links", () => dt.join(`
`), "tiny", t.changed),
                Cs("batch-csv:" + b.id, "Copy as CSV", () => ["copy,link", ...dt.map((ee, He) => `${He + 1},${ee}`)].join(`
`), "tiny", t.changed)
              );
            } else b.codes.length || ht.append(Et("span", "links were made on another device", "ppp-mute"));
            h.append(ht);
          }
          Jt.append(h);
        }
        G.push(Jt);
      }
    }
    return K && G.push(Et("p", K, "ppp-cyan")), z && G.push(Et("p", z, /✓/.test(z) ? "ppp-ok" : "ppp-warn")), tt.replaceChildren(...G), tt;
  }
  return { banner: N, funder: B, renderFold: Cn, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: S };
}
const i$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function o$(t) {
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
const a$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function c$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = a$(i);
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
function l$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Si = 12, u$ = 5e3, an = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ei = (t, e, n = "") => {
  const r = an("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function f$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = Si;
  const l = an("div", "", "ppp-shelf-box"), y = (M) => "xtrata.radio.shelf.pins.v1:" + M, p = (M) => "xtrata.radio.shelf.recent.v1:" + M, A = (M, V) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? V;
    } catch {
      return V;
    }
  }, m = (M) => new Set(A(y(M), []).filter((V) => Number.isSafeInteger(V))), T = (M) => {
    const V = A(p(M), {}), ct = {};
    for (const [Y, L] of Object.entries(V)) Number.isSafeInteger(Number(Y)) && typeof L == "number" && (ct[Number(Y)] = L);
    return ct;
  };
  async function W(M) {
    if (!s) {
      s = !0, i = !1;
      try {
        const V = [];
        let ct = 0, Y = 0;
        for (let L = 0; L < u$ / 100 + 1; L++) {
          const rt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${ct}&limit=100`);
          if (V.push(...o$(rt == null ? void 0 : rt.shelf)), Y = Number(rt == null ? void 0 : rt.total) || V.length, !(rt != null && rt.next) || !Number.isSafeInteger(rt.next)) break;
          ct = rt.next;
        }
        M === e && (n = V, r = Y, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const X = () => {
    o = -1 / 0;
  }, S = an("input");
  S.type = "search", S.placeholder = "Search title, artist or #", S.setAttribute("aria-label", "Search your albums"), S.oninput = () => {
    a = S.value, d = Si, t.changed();
  };
  const N = an("select");
  N.setAttribute("aria-label", "Sort albums");
  for (const M of i$) {
    const V = document.createElement("option");
    V.value = M.value, V.textContent = M.label, N.append(V);
  }
  N.onchange = () => {
    c = N.value, d = Si, t.changed();
  };
  const B = Ei("", () => {
    u = !u, d = Si, t.changed();
  }, "tiny"), tt = an("div", "", "ppp-shelf-tools");
  tt.append(S, N, B);
  const nt = an("div"), K = an("div");
  function z(M) {
    const V = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (V !== e && (e = V, n = [], r = 0, o = -1 / 0, d = Si), !V || M.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && W(V), !n.length)
      return i ? (K.replaceChildren(an("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ei("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(K), l) : null;
    const ct = m(V), Y = T(V), L = c$(n, { query: a, sort: c, pinnedOnly: u, pins: ct, recents: Y });
    S.value !== a && (S.value = a), N.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const rt = [];
    if (M.slot > 0 && rt.push(Ei("← My player", () => t.open(0), "quiet")), !L.length) rt.push(an("p", "No album matches that.", "ppp-mute"));
    else {
      const re = an("ul", "", "ppp-shelf-list");
      for (const I of L.slice(0, d)) {
        const U = an("li", "", I.slot === M.slot ? "now" : ""), St = ct.has(I.slot), Ot = Ei(St ? "★" : "☆", () => {
          const x = new Set(ct);
          St ? x.delete(I.slot) : x.add(I.slot), t.store.set(y(V), JSON.stringify([...x])), t.changed();
        }, "tiny");
        Ot.setAttribute("aria-label", St ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const Tt = [I.player.subtitle, `${To(I.player).length} ${To(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Qt = I.slot === M.slot, ie = Ei(Qt ? "Playing" : "Play", () => {
          t.store.set(p(V), JSON.stringify(l$({ ...Y, [I.slot]: t.now() }))), t.open(I.slot);
        }, Qt ? "tiny" : "tiny primary");
        ie.disabled = Qt, U.append(Ot, an("span", I.player.title, "t"), an("span", " " + Tt, "ppp-mute"), ie), re.append(U);
      }
      rt.push(re), L.length > d && rt.push(Ei(`Show more (${L.length - d} left)`, () => {
        d += Si, t.changed();
      }, "quiet"));
    }
    return i && rt.push(an("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), nt.replaceChildren(...rt), l.firstChild !== tt && l.replaceChildren(tt, nt), l;
  }
  return { render: z, invalidate: X, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = T(e), V = [...n].filter((ct) => ct.player).sort((ct, Y) => (M[Y.slot] ?? 0) - (M[ct.slot] ?? 0) || Y.slot - ct.slot)[0];
    return V ? { slot: V.slot, title: V.player.title } : null;
  } };
}
const d$ = 20, qe = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ce = {
  grid: qe('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: qe('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: qe('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: qe('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: qe('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: qe('<path d="M6 9l6 6 6-6"/>', 18),
  right: qe('<path d="M9 6l6 6-6 6"/>', 16),
  close: qe('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: qe('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: qe('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: qe('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: qe('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: qe('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Ye = (t, ...e) => Q("button", { type: "button", ...t }, ...e), ma = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, co = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, h$ = { music: "My music", device: "This device", gifts: "Send music to a friend" }, p$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function u0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function d(x) {
    var J, O, ot;
    if (!x || !Number.isSafeInteger(x)) return "";
    const _ = (ot = (O = (J = e.radio()) == null ? void 0 : J.getState) == null ? void 0 : O.call(J)) == null ? void 0 : ot.albumCover;
    return _ != null && _.url && Number(_.tokenId) === x ? _.url : c.has(x) ? c.get(x) : (u.has(x) || (u.add(x), fetch("/inscription/" + x, { signal: AbortSignal.timeout(2e4) }).then(async (st) => {
      var At, Wt, Kt, vt;
      const kt = (st.headers.get("content-type") || "").toLowerCase();
      if (!st.ok)
        throw await ((At = st.body) == null ? void 0 : At.cancel()), new Error("no cover");
      return kt.startsWith("image/") ? (await ((Wt = st.body) == null ? void 0 : Wt.cancel()), "/inscription/" + x) : kt.includes("text/html") ? (((Kt = (await st.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : Kt[1]) ?? "").replace(/&amp;/g, "&") : (await ((vt = st.body) == null ? void 0 : vt.cancel()), "");
    }).then((st) => {
      c.set(x, st), ie();
    }).catch(() => {
      u.delete(x);
    })), "");
  }
  const l = "xtrata:al-thumb:v1:", y = "-", p = 96, A = 24 * 1024 * 1024, m = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Set(), W = [];
  let X = !1, S;
  const N = (x, _) => {
    try {
      if (_ === void 0) return window.localStorage.getItem(l + x);
      window.localStorage.setItem(l + x, _);
    } catch {
    }
    return null;
  };
  function B(x) {
    return new Promise((_) => {
      var J;
      try {
        const O = document.createElement("canvas"), ot = (J = O.getContext) == null ? void 0 : J.call(O, "2d");
        if (!ot) return _(x);
        const st = new Image(), kt = setTimeout(() => _(x), 8e3);
        st.onload = () => {
          clearTimeout(kt);
          try {
            const At = Math.min(st.naturalWidth, st.naturalHeight);
            if (!At) return _(x);
            O.width = O.height = p, ot.fillStyle = "#143a40", ot.fillRect(0, 0, p, p), ot.drawImage(st, (st.naturalWidth - At) / 2, (st.naturalHeight - At) / 2, At, At, 0, 0, p, p), _(O.toDataURL("image/jpeg", 0.82));
          } catch {
            _(x);
          }
        }, st.onerror = () => {
          clearTimeout(kt), _(x);
        }, st.src = x;
      } catch {
        _(x);
      }
    });
  }
  async function tt(x) {
    var Wt, Kt, vt, bt, Lt;
    const _ = await fetch("/inscription/" + x, { signal: AbortSignal.timeout(6e4) }), J = (_.headers.get("content-type") || "").toLowerCase();
    if (!_.ok)
      return await ((Wt = _.body) == null ? void 0 : Wt.cancel()), null;
    if (J.startsWith("image/"))
      return await ((Kt = _.body) == null ? void 0 : Kt.cancel()), "/inscription/" + x;
    if (!J.includes("text/html"))
      return await ((vt = _.body) == null ? void 0 : vt.cancel()), "";
    let O = "", ot = 0;
    const st = (pe) => {
      let Dt = 0;
      for (; ; ) {
        const le = O.slice(Dt).search(/<img\b/i);
        if (le < 0)
          return O = pe ? "" : O.slice(Math.max(0, O.length - 4)), null;
        const mt = Dt + le, Mt = O.indexOf(">", mt);
        if (Mt < 0)
          return O = O.slice(mt), null;
        const Ct = O.slice(mt, Mt + 1), De = Ct.match(/\bsrc="(data:image\/[^"]+)"/i);
        if (De) return De[1].replace(/&amp;/g, "&");
        const Cn = Ct.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
        if (Cn) return "/inscription/" + Cn[1];
        Dt = Mt + 1;
      }
    }, kt = (Lt = (bt = _.body) == null ? void 0 : bt.getReader) == null ? void 0 : Lt.call(bt);
    if (!kt)
      return O = await _.text(), st(!0) ?? "";
    const At = new TextDecoder();
    for (; ; ) {
      const { done: pe, value: Dt } = await kt.read();
      if (pe) break;
      ot += Dt.byteLength, O += At.decode(Dt, { stream: !0 });
      const le = st(!1);
      if (le)
        return await kt.cancel(), le;
      if (ot > A)
        return await kt.cancel(), null;
    }
    return O += At.decode(), st(!0) ?? "";
  }
  async function nt() {
    if (!X) {
      X = !0;
      try {
        for (; W.length; ) {
          const x = W.shift();
          if (!m.has(x))
            try {
              const _ = await tt(x);
              if (_ === null) continue;
              if (!_) {
                m.set(x, ""), N(x, y), ie();
                continue;
              }
              const J = await B(_);
              m.set(x, J), J.startsWith("data:image/jpeg") && N(x, J), ie();
            } catch {
            }
        }
      } finally {
        X = !1;
      }
    }
  }
  function K(x, _) {
    if (_ && !m.get(x) ? (m.set(x, _), B(_).then((O) => {
      O !== _ && (m.set(x, O), O.startsWith("data:image/jpeg") && N(x, O), ie());
    })) : _ === "" && !m.has(x) && m.set(x, ""), m.has(x)) return m.get(x);
    const J = N(x);
    if (J != null) {
      const O = J === y ? "" : J;
      return m.set(x, O), O;
    }
    return T.has(x) || (T.add(x), W.push(x), S || (S = setTimeout(() => {
      S = void 0, nt();
    }, 1200))), "";
  }
  function z(x) {
    var J;
    i = x, x ? a.dataset.sheet = x : delete a.dataset.sheet;
    const _ = document.querySelector(".side");
    if (x && x !== "more") {
      for (const st of p$[x]) {
        const kt = _ == null ? void 0 : _.querySelector(st);
        kt && (kt.open = !0);
      }
      const O = document.getElementById("sheetTitle");
      O && (O.textContent = h$[x]);
      const ot = document.getElementById("sheetExtra");
      ot && ot.replaceChildren(...x === "music" ? [P()] : []), (J = _ == null ? void 0 : _.scrollTo) == null || J.call(_, { top: 0 });
    }
    ie();
  }
  const v = r ? null : document.getElementById("sheetClose");
  v && (v.onclick = () => z("")), r || document.addEventListener("keydown", (x) => {
    x.key === "Escape" && i && a.dataset.view === "album" && z("");
  });
  const P = () => Ye(
    { class: "al-row", onClick: () => {
      z(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: Ce.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: Ce.right })
  );
  let M = null, V = !1;
  const ct = () => {
    var _;
    const x = e.radio();
    V || !(x != null && x.subscribe) || (V = !0, x.subscribe((J) => {
      M = J, (s == null ? void 0 : s.mode) === "open" && ie();
    }), M = ((_ = x.getState) == null ? void 0 : _.call(x)) ?? null);
  };
  r || setInterval(() => {
    var O, ot;
    if ((s == null ? void 0 : s.mode) !== "open" || !(M != null && M.playing)) return;
    const x = (ot = (O = e.radio()) == null ? void 0 : O.getPosition) == null ? void 0 : ot.call(O), _ = t.querySelector(".al-bar > i"), J = t.querySelectorAll(".al-times span");
    !x || !_ || (_.style.width = x.duration ? `${Math.min(100, x.current / x.duration * 100)}%` : "0%", J.length === 2 && (J[0].textContent = ma(x.current || 0), J[1].textContent = x.duration ? ma(x.duration) : "–:––"));
  }, 500);
  let Y = "", L = null;
  function rt(x, _, J = {}) {
    const O = J.song || d(x.cover), st = [O ? Q("img", { src: O, alt: J.song ? "Song artwork" : `${x.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, x.title), x.subtitle ? Q("span", {}, x.subtitle) : null), J.paused ? Q("span", { class: "al-paused" }, Q("i", { html: Ce.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], kt = "al-cover" + (_ ? "" : " al-cover--small") + (J.paused ? " is-paused" : "");
    return J.flip ? (st.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: Ce.flip })), Ye({ class: kt + " is-flippable", "aria-label": J.flipped ? "Show this song’s artwork" : `Show the ${x.title} cover`, onClick: J.flip }, ...st)) : Q("div", { class: kt }, ...st);
  }
  function re(x) {
    return x.plays === null || x.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, x.playsComing ? "Plays on their way…" : "…") : x.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, x.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (x.plays <= d$ ? " al-chip--low" : "") }, `${co(x.plays, "play", "plays")} left`);
  }
  function I(x) {
    const _ = x.player, J = _.tracks.filter((ot) => !ot.hidden), O = [];
    return x.mode === "arrive" && x.from && O.push(Q("p", { class: "al-from" }, Q("span", { html: Ce.gift }), Q("span", {}, Q("b", {}, x.from), " sent you an album"))), O.push(rt(_, !0)), O.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, _.title),
      _.subtitle ? Q("p", { class: "al-artist" }, _.subtitle) : null,
      J.length ? Q("p", { class: "al-songline" }, J.map((ot) => ot.title || `#${ot.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [co(J.length, "song", "songs"), x.offered ? co(x.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), x.status.length && O.push(Q("div", { class: "al-status", role: "status" }, ...x.status)), O.push(Q("div", { class: "al-grow" })), x.asking ? O.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : x.primary && O.push(Ye({ class: "al-primary", onClick: x.primary.run, disabled: x.busy }, Q("span", { html: Ce.playSmall }), x.primary.label)), x.hint && !x.asking && O.push(Q("p", { class: "al-hint" }, x.hint)), x.secondary && !x.asking && O.push(Ye({ class: "al-link", onClick: x.secondary.run, disabled: x.busy }, x.secondary.label)), O;
  }
  function U(x, _) {
    const { songs: J, current: O, started: ot, own: st, out: kt, waiting: At } = _, Wt = x.player, Kt = e.radio(), vt = [];
    vt.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, Wt.title), ` · ${co(J.length, "song", "songs")}`), re(x)));
    const bt = d(Wt.cover), Lt = "album:" + Wt.cover;
    bt && !m.has(Lt) && (m.set(Lt, bt), B(bt).then((Dt) => {
      Dt !== bt && (m.set(Lt, Dt), ie());
    }));
    const pe = bt ? m.get(Lt) || bt : "";
    return vt.push(Q("ol", { class: "al-tracks" }, ...J.map((Dt, le) => {
      const mt = String(Dt.id) === O, Mt = K(String(Dt.id), mt && ot ? st : void 0);
      return Q("li", {}, Ye(
        { class: "al-track" + (mt ? " is-on" : ""), "aria-label": `Play ${Dt.title || "#" + Dt.id}`, "aria-current": mt ? "true" : void 0, disabled: kt || At, onClick: () => {
          var Ct;
          return (Ct = Kt == null ? void 0 : Kt.playToken) == null ? void 0 : Ct.call(Kt, Dt.id);
        } },
        Q(
          "span",
          { class: "al-th" + (Mt ? "" : " is-blank") },
          Mt ? Q("img", { src: Mt, alt: "", decoding: "async" }) : pe ? Q("img", { src: pe, alt: "", decoding: "async" }) : null,
          Mt ? null : Q("span", { class: "al-n" }, String(le + 1)),
          mt ? Q("span", { class: "al-eq", html: Ce.eq }) : null
        ),
        Q("span", { class: "al-tt" }, Dt.title || `#${Dt.id}`)
      ));
    }))), vt;
  }
  function St(x) {
    var Mt;
    const _ = x.player, J = _.tracks.filter((Ct) => !Ct.hidden), O = e.radio(), ot = M == null ? void 0 : M.nowPlaying, st = ot && _.tracks.some((Ct) => String(Ct.id) === String(ot.tokenId)) ? String(ot.tokenId) : null, kt = st ? _.tracks.find((Ct) => String(Ct.id) === st) : null, At = x.plays === 0 && !x.playsComing, Wt = !!x.playsComing && !x.plays, Kt = !!(M != null && M.playing) && !!st, vt = M == null ? void 0 : M.heart, bt = st ? (Mt = O == null ? void 0 : O.getPosition) == null ? void 0 : Mt.call(O) : null;
    st && (Kt || ((bt == null ? void 0 : bt.current) ?? 0) > 0.5) && (Y = _.id);
    const Lt = !!st && Y === _.id;
    L && L !== st && (L = null);
    const pe = Lt ? String((ot == null ? void 0 : ot.cover) || "") : "", Dt = !!pe && L === st, mt = [rt(_, !At, { song: Dt ? "" : pe, paused: Lt && !Kt, flip: pe ? () => {
      L = L === st ? null : st, ie();
    } : void 0, flipped: Dt })];
    if (mt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, kt ? kt.title || (ot == null ? void 0 : ot.title) || `#${kt.id}` : _.title),
        Q("div", { class: "al-artist" }, kt ? kt.artist || (ot == null ? void 0 : ot.artist) || _.subtitle : _.subtitle || "Press play")
      ),
      st ? Ye({ class: "al-icon" + (vt != null && vt.liked ? " is-on" : ""), "aria-label": vt != null && vt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(vt != null && vt.liked)), disabled: !!(vt != null && vt.pending) || !!(vt != null && vt.locked) || Wt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.toggleLike) == null ? void 0 : Ct.call(O);
      }, html: vt != null && vt.liked ? Ce.heartOn : Ce.heart }) : null
    )), At)
      mt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Ot(x, !0)
      ));
    else {
      const Ct = bt != null && bt.duration ? Math.min(100, bt.current / bt.duration * 100) : 0;
      mt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Ct}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, ma((bt == null ? void 0 : bt.current) || 0)), Q("span", {}, bt != null && bt.duration ? ma(bt.duration) : "–:––"))
      ));
    }
    return mt.push(Q(
      "div",
      { class: "al-ctl" + (At || Wt ? " is-off" : "") },
      Ye({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: At || Wt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.prev) == null ? void 0 : Ct.call(O);
      }, html: Ce.prev }),
      Ye({ class: "al-play", "aria-label": Kt ? "Pause" : "Play", disabled: At || Wt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.playPause) == null ? void 0 : Ct.call(O);
      }, html: Kt ? Ce.pause : Ce.play }),
      Ye({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: At || Wt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.next) == null ? void 0 : Ct.call(O);
      }, html: Ce.next })
    )), x.status.length && mt.push(Q("div", { class: "al-status", role: "status" }, ...x.status)), mt.push(...U(x, { songs: J, current: st, started: Lt, own: pe, out: At, waiting: Wt })), mt.push(Q("div", { class: "al-grow" })), mt.push(Ye(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => z(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: Ce.down })
    )), mt;
  }
  function Ot(x, _) {
    const J = Q("div", { class: "al-topups" + (_ ? " al-topups--primary" : "") }), O = _ ? [x.topUps[1] ?? x.topUps[0]] : [...x.topUps];
    for (const ot of O) {
      const st = x.myPlays !== void 0 && x.myPlays >= ot && !x.playsComing && !x.busy;
      J.append(Ye({ class: "al-topup", disabled: !st, onClick: () => e.topUp(ot) }, _ ? `Add ${ot.toLocaleString()} plays` : `+${ot.toLocaleString()}`));
    }
    return _ && J.append(Ye({ class: "al-link", onClick: () => z("more") }, "Other amounts")), J;
  }
  function Tt(x) {
    const _ = x.myPlays !== void 0 && x.myPlays >= (x.topUps[0] ?? 0), J = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${x.player.title}`), Q("span", { class: "al-mono" }, x.plays === null || x.plays === void 0 ? "" : `${x.plays.toLocaleString()} left`)),
      Ot(x, !1),
      Q("p", { class: "al-mute al-small" }, x.playsComing ? "Plays are on their way. Add more once they arrive." : x.myPlays === void 0 ? "Checking My player…" : _ ? `Moved from My player · ${co(x.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !_ && !x.playsComing && x.myPlays !== void 0 ? Ye({ class: "al-link", onClick: () => {
        z(""), e.openPlayer();
      } }, "Open My player") : null
    ), O = (st, kt, At, Wt) => Ye(
      { class: "al-row", onClick: Wt },
      Q("span", { class: "al-row-i", html: st }),
      Q("span", { class: "al-row-t" }, Q("b", {}, kt), Q("small", {}, At)),
      Q("span", { class: "al-row-go", html: Ce.right })
    ), ot = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      O(Ce.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, ie();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), Ye({ class: "al-icon", "aria-label": "Close", onClick: () => z(""), html: Ce.close })),
      x.mode === "open" ? J : null,
      Q(
        "div",
        { class: "al-rows" },
        O(Ce.grid, "My music", "Your albums and the radio", () => z("music")),
        O(Ce.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          z(""), e.openPlayer();
        }),
        O(Ce.gift, "Send music to a friend", "They open it with a link", () => z("gifts")),
        O(Ce.device, "This device", "Backup, history, Stacks wallet, returns", () => z("device")),
        ot
      )
    );
  }
  function Qt(x) {
    var At, Wt;
    const _ = x.player, J = M == null ? void 0 : M.nowPlaying, O = J && _.tracks.some((Kt) => String(Kt.id) === String(J.tokenId)) ? String(J.tokenId) : null, ot = !!(M != null && M.playing) && !!O, st = O ? (Wt = (At = e.radio()) == null ? void 0 : At.getPosition) == null ? void 0 : Wt.call(At) : null;
    O && (ot || ((st == null ? void 0 : st.current) ?? 0) > 0.5) && (Y = _.id);
    const kt = !!O && Y === _.id;
    return U(x, {
      songs: _.tracks.filter((Kt) => !Kt.hidden),
      current: O,
      started: kt,
      own: kt ? String((J == null ? void 0 : J.cover) || "") : "",
      out: x.plays === 0 && !x.playsComing,
      waiting: !!x.playsComing && !x.plays
    });
  }
  function ie() {
    const x = s;
    if (r) {
      if (!x || x.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      ct(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...Qt(x));
      return;
    }
    if (!x) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    ct(), t.hidden = !1;
    const _ = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      x.mode === "open" ? Ye({ class: "al-icon", "aria-label": "My music", onClick: () => z("music"), html: Ce.grid }) : null
    ), J = Q("div", { class: "al-body al-body--" + x.mode }, ...x.mode === "open" ? St(x) : I(x));
    t.replaceChildren(_, J, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => z("") }), Tt(x)] : []);
  }
  return {
    render(x) {
      if (r) {
        s = x, ie();
        return;
      }
      const _ = !!s;
      s = x, !x && (_ || i) && (i = "", delete a.dataset.sheet), x ? a.dataset.view = "album" : delete a.dataset.view, x != null && x.asking ? a.dataset.asking = "1" : delete a.dataset.asking, ie();
    },
    sheet: () => i,
    setSheet: z
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
const Wy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Xy = (t) => /Android/.test(t);
function w$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Wy(e) ? "x-safari-" + n.href : Xy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const b$ = (t) => Wy(t) ? "Safari" : Xy(t) ? "Chrome" : "your browser", f0 = document.getElementById("ppp");
f0 && m$(f0);
function m$(t) {
  var ge;
  const e = Iw(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let s = null;
  const i = async (h, b) => {
    const f = await fetch(h, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), H = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((H == null ? void 0 : H.error) || `Request failed (${f.status}).`);
    return H;
  }, o = e6({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const b = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = b == null ? void 0 : b.find((H) => H.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), s.referrerPolicy = "no-referrer";
      const b = new Promise((ht, dt) => {
        s.addEventListener("load", () => ht(), { once: !0 }), setTimeout(() => dt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = h + "/", r.replaceChildren(s), await b;
      const f = new bw({ walletOrigin: h, frame: s, timeoutMs: 30 * 6e4 }), H = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ut = (ht, dt) => H.has(ht) ? f.request(ht, dt) : Promise.race([
        f.request(ht, dt),
        new Promise((ee, He) => setTimeout(() => He(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ut("listening.status"), { request: ut };
    },
    chain: {
      verify: P5,
      balance: U5,
      account: _5,
      owner: H5,
      broadcast: O5,
      transaction: D5,
      confirmedNonce: async (h) => {
        const b = await ls(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (h, b) => Gh({ ...b, network: "mainnet", stxAddress: h }),
    deposit: (h, b, f) => new Promise((H, ut) => Dh({
      recipient: b,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new fl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ht) => H(ht.txId || ""),
      onCancel: () => ut(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ut
    })),
    validate: F5,
    tabLock: (h) => new Promise((b) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        b(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (H) => {
        b(!!H), H && await new Promise(() => {
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
    changed: () => Jt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var b, f;
      return a.funder(h, () => V5(h, ls), !!((f = (b = o.snapshot().gate) == null ? void 0 : b.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const b = await i("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = b == null ? void 0 : b.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, b) => X5(h, (f) => ls(f), b),
    likesChanged: () => {
      var h, b;
      (b = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || b.call(h);
    },
    likeState: async (h, b) => {
      const f = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(b) })), H = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((ut) => (ut == null ? void 0 : ut.id) === b) : null;
      if (!H || typeof H.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: H.liked, by: Array.isArray(H.by) ? H.by.filter((ut) => typeof ut == "string") : H.liked ? [h] : [] };
    },
    likeSent: (h, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: b } })),
    nameOf: (h) => Tt(h) ?? void 0,
    likeConfirmed: (h, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: b } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = s$({
    json: i,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, b, f, H) => new Promise((ut, ht) => Dh({
      recipient: b,
      amount: f.toString(),
      memo: H,
      stxAddress: h,
      network: new fl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (dt) => ut(dt.txId || ""),
      onCancel: () => ht(new Error("Gift cancelled. Nothing was sent.")),
      onError: ht
    })),
    sign: (h, b) => Gh({ ...b, network: "mainnet", stxAddress: h }),
    giftSent: (h, b) => o.giftSent(h, b),
    claiming: (h) => o.giftClaiming(h),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, b, f, H) => {
      c.invalidate(), await o.albumArriving(h, b, f, H);
    } },
    who: (h) => x(h),
    changed: () => Jt(o.snapshot()),
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
  }), c = f$({
    json: i,
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
    changed: () => Jt(o.snapshot())
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
  }, y = d ? u0(d, l) : null, p = document.getElementById("albumList"), A = p ? u0(p, l, { list: !0 }) : null, m = "xtrata.radio.album.last.v1", T = () => {
    try {
      const h = JSON.parse(localStorage.getItem(m) || "null");
      return h && typeof h.root == "string" && Number.isSafeInteger(h.slot) && h.slot > 0 && h.player && Array.isArray(h.player.tracks) ? h : null;
    } catch {
      return null;
    }
  };
  let W = "";
  const X = (h) => {
    const b = JSON.stringify(h);
    if (b !== W) {
      W = b;
      try {
        localStorage.setItem(m, b);
      } catch {
      }
    }
  };
  let S = null;
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    st();
    const b = kt(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let N;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const B = (h) => {
    var f, H;
    const b = window.XtrataRadioListeningIdentity();
    b !== N && (N = b, (H = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || H.call(f));
  };
  let tt = "", nt = null, K = !1, z = !1;
  const v = (h) => {
    var ee, He, Fe, Gn, Ee, Tn, Ke, Bn;
    const b = window.XtrataRadio;
    if (!(b != null && b.setGiftPlayer) || !(b != null && b.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((ee = h.gift) == null ? void 0 : ee.player) ?? null, H = f ? f.id + ":" + f.cover + ":" + f.tracks.map((fn) => fn.id).join(",") : "";
    H !== tt && (b.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: To(f).map((fn) => fn.id), hidden: ((He = e$(f)) == null ? void 0 : He.id) ?? null, cover: f.cover } : null), tt = H);
    const ut = ((Fe = h.giftStop) == null ? void 0 : Fe.text) ?? null;
    ut !== nt && (b.setGiftStop(ut), nt = ut);
    const ht = ((Gn = h.giftStop) == null ? void 0 : Gn.reason) === "arriving";
    ht !== z && ((Ee = b.setGiftWait) == null || Ee.call(b, ht), z = ht);
    const dt = !!f && !!((Tn = h.albumLock) != null && Tn.locked);
    dt !== K && ((Ke = b.setGiftLock) == null || Ke.call(b, dt), K = dt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((Bn = b.forgetWallets) == null || Bn.call(b));
  }, P = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", M = (h) => {
    const b = o.snapshot().playCost || 350n;
    return h > ze ? Number((h - ze) / b) : 0;
  }, V = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), ct = (h) => {
    const b = Math.round((Date.now() - h) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, Y = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, L = (h, b = "", f = "") => {
    const H = document.createElement(h);
    return b && (H.textContent = b), f && (H.className = f), H;
  }, rt = (h, b, f = "") => {
    const H = L("button", h, f);
    return H.type = "button", H.onclick = b, H;
  }, re = (h, b) => {
    const f = L("a", h);
    return f.href = b, f.target = "_blank", f.rel = "noopener", f;
  };
  let I = null, U = location.hash === "#give";
  U && history.replaceState(null, "", location.pathname + location.search);
  let St = !1;
  const Ot = O6((h) => H6({ address: h, network: "mainnet" }), () => Jt(o.snapshot())), Tt = (h) => Ot.get(h), Qt = y$(navigator.userAgent), ie = (h, b) => {
    const f = navigator.userAgent, H = b$(f), ut = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, ht = [L("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${H} to make your listening wallet${b ? " and claim your gift" : ""}.`, "ppp-warn")], dt = L("div", "", "ppp-open-row"), ee = w$(ut, f);
    if (ee) {
      const He = L("a", `Open in ${H}`, "primary ppp-open-in");
      He.href = ee, He.dataset.homeAction = "radio:open-in-browser", dt.append(He);
    }
    return dt.append(Cs("copy-page-link", "Copy link", () => ut, ee ? "" : "primary", () => Jt(o.snapshot()))), ht.push(dt, L("p", `If that does not open ${H}, use ${h}'s menu (••• or ⋮) and choose "Open in ${H === "your browser" ? "browser" : H}", or paste the copied link there.`, "ppp-mute")), ht;
  }, x = (h) => Tt(h) ?? P(h), _ = (h) => h.slice(0, 2).map(x).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), J = /* @__PURE__ */ new Map();
  let O = !1;
  const ot = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), st = () => {
    O || (O = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const b of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(f) && J.set(f, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      Jt(o.snapshot());
    }).catch(() => {
      O = !1;
    }));
  }, kt = (h, b) => {
    const f = J.get(h), H = F6(h, [f == null ? void 0 : f.title, b == null ? void 0 : b.title].find((ht) => !ot(ht)) || ""), ut = D6(h, (f == null ? void 0 : f.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: H, artist: ut };
  }, At = (h) => {
    const { title: b, artist: f } = kt(h.song, h);
    return b ? `“${b}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, Wt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Kt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function vt(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["TOO MUCH", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function bt(h, b, f = "", H) {
    const ut = L("dt", h), ht = L("dd", b, f);
    return H && ht.append(" ", H), [ut, ht];
  }
  const Lt = document.getElementById("ppp-top"), pe = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Dt = () => {
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
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), pe();
  };
  Lt && (Lt.onclick = Dt);
  function le(h) {
    if (!Lt) return;
    const b = (H, ut, ht) => {
      Lt.hidden = !1, Lt.className = "ppp-top" + (ut ? " is-" + ut : ""), Lt.replaceChildren(L("span", "", "dot"), document.createTextNode(H)), Lt.title = ht;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Lt.hidden = !0;
        return;
      case "elsewhere":
        return b("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Lt.hidden = !0;
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
        return h.depositPending ? b("Plays on their way", "quiet", "Plays start by themselves when they land") : b(h.entries.some((H) => H.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return b("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return b("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return h.payingOn && f > 0 ? b(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : b("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const mt = document.getElementById("pppNudge"), Mt = document.getElementById("onair");
  (ge = mt == null ? void 0 : mt.querySelector("button")) == null || ge.addEventListener("click", () => Dt());
  const Ct = {
    elsewhere: "Plays are not counted here",
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, De = {
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
  function Cn(h) {
    if (h.step === "loading") return;
    const b = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && b > 0, H = h.step === "fund" && h.depositPending, ut = f || H ? "" : Ct[h.step] ?? "", ht = f ? "on" : ut ? "off" : "";
    ht ? document.documentElement.dataset.ppp = ht : delete document.documentElement.dataset.ppp, Mt && (Mt.hidden = !ht, Mt.querySelector(".onair-sub").textContent = f ? `${b.toLocaleString()} plays left` : "Plays off"), mt && (mt.hidden = ht !== "off", ht === "off" && (mt.querySelector(".nudge-t").textContent = ut, mt.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", mt.querySelector("button").textContent = De[h.step] ?? "Start"));
  }
  let fr = "";
  function E(h) {
    const b = L("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && b.append(L("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && b.append(L("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = L("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = fr, f.oninput = () => {
      fr = f.value;
    };
    const H = rt(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), fr = "";
    }, "tiny");
    return b.append(f, " ", H), h.returnToKind === "chosen" && b.append(" ", rt("Back to the funder", () => o.clearReturnAddress(), "tiny")), b;
  }
  const j = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function R() {
    const h = L("p", j + " ", "ppp-mute");
    return h.append(re("Xverse", "https://www.xverse.app/download"), " · ", re("Leather", "https://leather.io/install-extension")), h;
  }
  let G = "";
  const wt = (h) => {
    const b = document.documentElement, f = h.solo && !h.main ? h.listening ? P(h.listening) : "new" : "", H = o6() ? "1" : "";
    `${f}|${H}` !== G && (G = `${f}|${H}`, f ? b.dataset.pppSolo = f : delete b.dataset.pppSolo, H ? b.dataset.pppWalletInstalled = H : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => Jt(o.snapshot()), h);
  function $t(h, b = "") {
    const f = L("div", "", "ppp-topup"), H = de(h);
    f.append(L("span", "Add plays from My player: ", "ppp-mute"));
    for (const ut of La) {
      const ht = rt(`+${ut.toLocaleString()}`, () => void o.topUpAlbum(ut), b);
      ht.disabled = H === void 0 || H < ut || h.depositPending || !!h.busy, f.append(ht);
    }
    return H !== void 0 && H < La[0] && f.append(L("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const de = (h) => {
    var H;
    const b = (H = h.likeFunds) == null ? void 0 : H.balance;
    if (b === void 0 || !h.playCost) return;
    const f = b - ze - 6000n;
    return f > 0n ? Number(f / h.playCost) : 0;
  };
  function Xt(h) {
    const b = h.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    const f = L("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      const ut = L("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return b.txid && ut.append(re("View", Y(b.txid))), f.append(ut), [f];
    }
    f.append(L("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(L("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(L("p", b.address, "ppp-addr-full"));
    const H = L("div", "", "ppp-open-row");
    if (H.append(Cs("copy-likes-address", "Copy address", () => b.address, "primary", () => Jt(o.snapshot()))), b.main && !h.solo) {
      const ut = Ls - (b.balance ?? 0n);
      ut > 0n && H.append(rt(`Pay ${Qn(ut)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(H), f.append(L("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const he = (h) => {
    const b = L("div", "", "ppp-wait");
    b.dataset.since = String(h.since), b.dataset.grace = String(h.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const f = L("p", "", "ppp-wait-t"), H = L("div", "", "ppp-wait-track");
    return H.append(L("div", "", "ppp-wait-fill")), b.append(f, H), xe(b), b;
  };
  function xe(h) {
    const b = Number(h.dataset.since), f = Number(h.dataset.grace) || 6e4, H = Math.max(0, Date.now() - b), ut = h.querySelector(".ppp-wait-fill"), ht = h.querySelector(".ppp-wait-t");
    if (H < f) {
      const dt = Math.ceil((f - H) / 1e3);
      ut.style.width = Math.max(4, Math.min(95, H / f * 100)).toFixed(0) + "%", ht.textContent = `Your plays are arriving… usually about a minute · ${dt}s`, h.classList.remove("is-long"), h.setAttribute("aria-valuenow", String(Math.round(H / f * 100)));
    } else
      ut.style.width = "", ht.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", h.classList.add("is-long"), h.removeAttribute("aria-valuenow");
  }
  let ke = 0;
  setInterval(() => {
    const h = document.querySelectorAll(".ppp-wait");
    if (!h.length) {
      ke = 0;
      return;
    }
    h.forEach(xe), ++ke % 10 === 0 && Jt(o.snapshot());
  }, 1e3);
  function Jt(h) {
    var pr, Br, gr, fi, Mr, di, hi, yr, pi, w, $, q, et, yt;
    if (S && ["ready", "fund", "over"].includes(h.step) && !h.busy) {
      const k = S;
      S = null, h.root === k.root && h.slot !== k.slot && o.openAlbum(k.slot);
    }
    const b = a.inProgress(h), f = b && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (B(), v(h), wt(f), !b && a.inProgress(h) || (le(f), Cn(f), t.hidden = f.step === "off", t.hidden)) return;
    const [H, ut] = vt(f), ht = n(".ppp-state");
    ht.textContent = H, ht.className = "ppp-state" + (ut ? " ppp-state--" + ut : ""), ht.hidden = !H;
    const dt = !!f.busy || f.armed, ee = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (dt || !["intro", "loading"].includes(f.step));
    r.hidden = !ee, r.classList.toggle("ppp-frame--rest", !dt && !St);
    const He = n(".ppp-frame-label");
    He.hidden = !0;
    const Fe = n6(f) ?? I;
    I = Fe;
    const Gn = "xtrata.radio.ppp.heard.v1", Ee = (() => {
      try {
        return localStorage.getItem(Gn) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Ee && f.entries.some((k) => k.kind === "play"))
      try {
        localStorage.setItem(Gn, "1");
      } catch {
      }
    const Tn = Ee || f.slot > 0 && ((((pr = f.likeFunds) == null ? void 0 : pr.balance) ?? 0n) > 0n || c.count() > 1), Ke = s6({ ...f, heard: Tn }, Fe);
    n(".ppp-badge").hidden = !Ke;
    const Bn = n(".ppp-steps"), fn = n(".ppp-stage");
    Bn.hidden = fn.hidden = !Ke, Fe && Ke && (Bn.replaceChildren(...gu(f.solo).map((k, D) => {
      const lt = L("li", "", D < Fe.at ? "done" : D === Fe.at ? Fe.blocked ? "now blocked" : "now" : "");
      return lt.append(L("span", D < Fe.at ? "✓" : String(D + 1), "n"), k), D === Fe.at && lt.setAttribute("aria-current", "step"), lt;
    })), fn.textContent = Fe.caption, fn.className = "ppp-stage " + (Fe.at >= gu(f.solo).length ? "ppp-ok" : Fe.blocked ? "ppp-bad" : "ppp-cyan"));
    const hs = n(".ppp-facts"), Oe = [];
    f.main && ((Br = f.gate) != null && Br.here) && !f.solo && Oe.push(...bt("Your wallet", x(f.main), "ppp-addr-short"));
    const ci = () => {
      if (!f.listening) return;
      const k = Cs("copy-listening", "Copy", () => f.listening || "", "tiny", () => Jt(o.snapshot()));
      Oe.push(...bt(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", P(f.listening), "ppp-addr-short", k));
    };
    if (f.linked || ci(), f.listening && f.step !== "intro")
      if (f.linked)
        Oe.push(...bt("Credited to", `${x(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), ci();
      else if (f.solo) {
        f.creditedTo && Oe.push(...bt("Credited to", `${x(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const k = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${x(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Oe.push(...bt("Returns go to", f.gift ? k : f.returnTo && !Tt(f.returnTo) ? k.replace(P(f.returnTo), f.returnTo) : k, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Oe.push(...bt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((gr = f.gate) != null && gr.here)) {
      const k = f.linkedListening.map((D) => P(D) + (D === f.listening ? " (this one)" : "")).join(", ");
      Oe.push(...bt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", k, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const k = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Oe.push(...bt("Balance", `${Qn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, k));
    }
    const dr = f.entries.find((k) => k.kind === "play");
    dr && st(), dr && Oe.push(...bt("Last paid song", `${At(dr)} → ${x(dr.recipient)}`, Wt[dr.status] || "")), hs.replaceChildren(...Oe), hs.hidden = !Oe.length;
    const It = [], Gt = [], Ie = [], Re = [], li = wn(BigInt(((fi = f.gate) == null ? void 0 : fi.limits.playFee) ?? "300")), ps = `Each song you listen to for 30 seconds sends ${Qn(tc)} STX to whoever holds it, plus a ${Qn(li - tc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Cr = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (It.push(L("p", "Pay artists as you listen.")), (Mr = f.gate) != null && Mr.radioUrl) {
          const D = L("p");
          D.append(re("Open the pay-per-play radio →", f.gate.radioUrl)), It.push(D);
        }
        Gt.push(L("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const D = [f.linked, ...f.others];
          It.push(L("p", D.length > 1 ? `This device has listening wallets for ${_(D)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${x(f.linked)}. Connect that wallet to keep paying artists.`)), Gt.push(L("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          It.push(L("p", "Connect your wallet to pay artists as you listen.")), Gt.push(L("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        It.push(L("p", `This device's listening wallet belongs to ${x(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Gt.push(L("p", `You are connected as ${x(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Gt.push(L("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Ie.push(rt("Switch wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        }, "primary"));
        break;
      case "not-invited":
        It.push(L("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        It.push(L("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        It.push(L("p", "Every play counts for the song’s owner, on-chain.")), Gt.push(L("p", ps)), Gt.push(L("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Gt.push(L("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (It.push(L("p", `This device already has a listening wallet for ${_(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Gt.push(L("p", `Otherwise, set up a new listening wallet for ${x(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Gt.push(L("p", `This is the listening wallet for ${x(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Gt.push(L("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const k = a.liveGift();
        Ie.push(rt(k ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${x(f.main)}` : "Start listening", () => void o.create(), "primary")), !k && !f.solo && f.main && f.others.length && Ie.push(rt("Switch wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        })), !k && f.solo && Ie.push(rt("I have a Stacks wallet", () => {
          var D;
          return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
        })), Ie.push(rt("I already have a listening wallet", () => void o.unlock(!0))), k && Ie.push(rt("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (It.push(L("p", "Locked.", "ppp-mute")), Ie.push(rt("Unlock", () => void o.unlock(), "primary"))), Re.push(rt("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        It.push(L("p", `Link to ${x(f.main)} · free`)), Gt.push(L("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Gt.push(L("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Ie.push(rt(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        It.push(L("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && It.push(he(f.arrival)) : (di = f.gift) != null && di.player ? It.push(L("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? It.push(L("p", "No plays left · add plays to keep counting", "ppp-bad")) : It.push(L("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / li)).toLocaleString()} plays`)), (hi = f.gift) != null && hi.player ? Gt.push(L("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && Gt.push(L("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && Gt.push(L("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b || (f.solo ? (Gt.push(L("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Gt.push(L("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && Ie.push(Cs("copy-address", "Copy my address", () => f.listening || "", "primary", () => Jt(o.snapshot())))) : Gt.push(L("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const D = L("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          D.append(re("View", Y(f.depositTxid))), It.push(D);
        } else f.allowance > 0n && !f.solo && Ie.push(rt(`Deposit ${Qn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        It.push(L("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (It.push(L("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), It.push(E(f))), (!f.solo || f.returnTo) && Ie.push(rt("Return excess", () => void o.returnFunds("excess"), "primary"), rt("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const D = Math.min(f.session.playsLeft, f.playsLeft);
          It.push(L("p", `${D.toLocaleString()} plays left`, "ppp-ok")), Gt.push(L("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Ie.push(rt("Switch off", () => void o.switchOff()));
        } else
          It.push(L("p", "Plays are off. Music stays free.", "ppp-mute")), Ie.push(rt("Switch plays on", () => void o.switchOn(), "primary"));
        f.queued && It.push(L("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && It.push(L("p", "Running low on plays", "ppp-warn")), f.depositPending ? It.push(L("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && Ie.push(rt(`Top up ${Qn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && Gt.push(L("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Gt.push(E(f)), Gt.push(R()), f.slot === 0 && f.step === "ready" && f.entries.some((k) => k.kind === "play" && k.status === "confirmed"))) {
      const k = L("p", "New to Stacks? ", "ppp-mute");
      k.append(re("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), It.push(k);
    }
    if (f.walletOutdated && Gt.push(L("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (It.push(L("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Ie.push(rt("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && Re.push(rt(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${x(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((yr = f.gift) != null && yr.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && Re.push($t(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && Re.push(rt("Lock", () => void o.lock(), "quiet")), ee && !dt && Re.push(rt(St ? "Hide listening wallet box" : "Show listening wallet box", () => {
      St = !St, Jt(o.snapshot());
    }, "quiet")), [...Ie, ...Re].forEach((k) => k.disabled = Cr), Cr && (Ie.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((pi = f.gift) != null && pi.player)) {
      const k = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", D = It.at(0);
      f.step === "ready" && D ? D.append(L("span", ` · ${V(f.balance)} STX`, k)) : It.push(L("p", `Balance ${V(f.balance)} STX`, k));
    }
    if ((w = f.gift) != null && w.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const k = L("p", "", "ppp-gift");
      k.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && k.append(" · ", f.gift.player.subtitle);
      const D = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? L("span", " · plays on their way", "ppp-warn") : L("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      D && k.append(D);
      const lt = ($ = It.at(0)) == null ? void 0 : $.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && lt && /STX/.test(lt.textContent ?? "") && lt.remove(), It.unshift(k), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          It.splice(1, 0, L("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), $t(f, "primary"));
        else {
          const ft = L("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ft.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ft.append(re("Xverse", "https://www.xverse.app/download"), " and ", re("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), It.splice(1, 0, ft);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const k = f.returnPlan, D = L("div", "", "ppp-pick");
      D.append(L("p", k.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const lt = L("ul", "", "ppp-gift-list");
      k.steps.forEach((ft, Yt) => {
        const Ne = ft.kind === "gift" ? "the unused gift" : ft.kind === "deposit" ? "what was added to it" : "the rest", Ae = L("li");
        Ae.append(L("span", `${Yt + 1}. ${Qn(BigInt(ft.send))} STX · ${Ne}`, "t"), L("span", ft.to ? ` → ${x(ft.to)}` : " → choose an address below", ft.to ? "ppp-mute" : "ppp-warn")), lt.append(Ae);
      }), D.append(lt), k.kept && D.append(L("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), k.steps.some((ft) => !ft.to) && D.append(E(f)), D.append(rt(k.steps.length > 1 ? `Confirm part 1 of ${k.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), It.push(D);
    }
    const Mn = Vt(f), Kn = u ? Mn : null, gs = a.banner(h, { bare: !!Kn }), hr = Qt && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? ie(Qt, a.pendingCode()) : [];
    Kn || (It.unshift(...gs), It.unshift(...Xt(f)), It.unshift(...hr)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && It.unshift(L("p", `This is ${x(f.creditedTo)}'s listening wallet. Plays and likes count for ${x(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...It);
    const Nn = document.querySelector(".ppp-switch");
    if (Nn) {
      const k = c.latest(), D = f.slot > 0, lt = ["fund", "ready", "over"].includes(f.step) && (D || !!k);
      if (Nn.hidden = !lt, lt) {
        const ft = (Ae, ye, En, bs) => {
          const gi = rt("", bs, "ppp-tab");
          return gi.setAttribute("aria-pressed", String(En)), gi.append(L("span", Ae, "tt"), L("span", ye === void 0 ? "…" : `${M(ye).toLocaleString()} plays`, "ts")), gi.disabled = !!f.busy, gi;
        }, Yt = D ? ((et = (q = f.gift) == null ? void 0 : q.player) == null ? void 0 : et.title) ?? "Album" : k.title, Ne = rt("View all albums" + (c.count() > 1 ? ` (${c.count()})` : ""), () => {
          const Ae = document.querySelector(".ppp-shelf");
          Ae && (Ae.hidden = !1, Ae.open = !0, requestAnimationFrame(() => Ae.scrollIntoView({ block: "center", behavior: "smooth" })));
        }, "ppp-all-albums");
        Nn.replaceChildren(
          ft("🎧 My player", D ? (yt = f.likeFunds) == null ? void 0 : yt.balance : f.balance, !D, () => {
            D && o.openAlbum(0);
          }),
          ft("💿 " + Yt, D ? f.balance : void 0, D, () => {
            !D && k && o.openAlbum(k.slot);
          }),
          Ne
        );
      }
    }
    const Vn = c.render(f), Pn = document.querySelector(".ppp-shelf");
    if (Pn) {
      Pn.hidden = !Vn;
      const k = Pn.querySelector("summary");
      k && (k.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const D = Pn.querySelector(".ppp-shelf-body");
      Vn && D && !D.contains(Vn) && D.replaceChildren(Vn);
    }
    const _n = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !_n, _n && !n(".ppp-gift-body").contains(_n) && n(".ppp-gift-body").replaceChildren(_n), _n && U) {
      U = !1;
      const k = n(".ppp-gifts");
      k.open = !0, requestAnimationFrame(() => k.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Gt), n(".ppp-actions").replaceChildren(...Ie), n(".ppp-actions2").replaceChildren(...Re);
    const ys = f.busy || f.message || "", ui = n(".ppp-msg"), ws = ys && It.some((k) => (k.textContent ?? "").startsWith(ys.replace(/[.✓\s]+$/, ""))) ? "" : ys, Le = !ws && !f.error ? f.notice : "";
    ui.textContent = ws || Le, ui.classList.toggle("is-warn", !!Le), n(".ppp-err").textContent = f.error;
    const eo = f.entries.filter((k) => k.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...eo.slice(0, 5).map((k) => {
      const D = L("li"), lt = k.status === "confirmed" ? "ok" : k.status === "failed" ? "bad" : "warn";
      return D.append(L("span", "", "d " + lt), L("span", At(k), "t"), L("span", ct(k.created), "ppp-mute")), k.txid && D.append(re("tx", Y(k.txid))), D;
    })), n(".ppp-wallets").hidden = !(hs.childElementCount || Re.length), n(".ppp-more").hidden = !Gt.length;
    const Tr = n(".ppp-history");
    Tr.hidden = !f.entries.length, f.entries.length && st(), Tr.replaceChildren(L("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((k) => {
      const D = L("div", "", "ppp-row"), lt = k.kind === "play" ? [L("span", At(k), "ppp-song"), L("span", ` · ${Qn(BigInt(k.amount))} STX to ${x(k.recipient)}`, "ppp-mute")] : k.kind === "like" ? [L("span", `${k.liked ? "♥ Liked" : "Unliked"} ${At(k)}`, "ppp-song"), L("span", ` · for ${f.linked ? x(f.linked) : "this listening wallet"}`, "ppp-mute")] : [L("span", `Returned ${Qn(BigInt(k.amount))} STX`, "ppp-song"), L("span", ` to ${x(k.recipient)}`, "ppp-mute")];
      return D.append(
        L("span", Kt[k.status] || k.status, "ppp-status " + (Wt[k.status] || "")),
        ...lt,
        L("span", ` · ${new Date(k.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), k.txid && D.append(re("tx ↗", Y(k.txid))), D;
    })), y == null || y.render(Kn ? zt(f, Kn, [...hr, ...gs]) : null), A == null || A.render((Mn == null ? void 0 : Mn.mode) === "open" ? zt(f, Mn, []) : null);
  }
  function Vt(h) {
    var H;
    if (["off", "elsewhere", "not-invited"].includes(h.step)) return null;
    if (h.slot > 0 && ((H = h.gift) != null && H.player) && ["fund", "ready", "over", "link", "loading"].includes(h.step))
      return h.root && X({ root: h.root, slot: h.slot, player: h.gift.player }), { mode: "open", player: h.gift.player };
    const b = a.incomingAlbum();
    if (b) return { mode: "arrive", player: b.player, from: b.from, offered: b.plays };
    const f = T();
    return f && (h.step === "locked" || S && h.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  function zt(h, b, f) {
    var He;
    const H = !!h.busy || h.armed, ut = [...f];
    h.depositPending && h.arrival && ut.push(he(h.arrival)), h.error ? ut.push(L("p", h.error, "ppp-bad")) : h.message && !H ? ut.push(L("p", h.message, "ppp-cyan")) : h.notice && ut.push(L("p", h.notice, "ppp-warn")), b.mode === "open" && ((He = h.likeFunds) != null && He.album) && h.likeFunds.low && !h.likeFunds.pending && ut.push(L("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const ht = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let dt = null, ee = null;
    return b.mode === "locked" ? (dt = { label: "Continue listening", run: () => {
      S = T(), o.unlock();
    } }, ee = { label: "Use a different passkey", run: () => {
      S = null, o.unlock(!0);
    } }) : b.mode === "arrive" && (h.step === "intro" ? (dt = { label: "Open album", run: () => void o.create() }, ee = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : h.step === "locked" ? (dt = { label: "Open album", run: () => void o.unlock() }, ee = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : h.step === "unsupported" ? ut.push(L("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : ut.length || ut.push(L("p", "Opening your album…", "ppp-cyan"))), {
      mode: b.mode,
      player: b.player,
      from: b.from,
      offered: b.offered,
      plays: b.mode === "open" ? h.balance === void 0 ? null : h.giftPlays : void 0,
      playsComing: h.depositPending,
      status: ut,
      primary: dt,
      secondary: ee,
      hint: dt ? ht : void 0,
      asking: H,
      busy: !!h.busy,
      myPlays: de(h),
      topUps: La
    };
  }
  const Se = /* @__PURE__ */ new Map(), ue = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((b) => {
      const f = b == null ? void 0 : b.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && Se.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!ue()) {
    const h = setInterval(() => {
      ue() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const b = h.detail;
    if (b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      st();
      const f = kt(b.song, Se.get(b.song));
      o.onListened({ song: b.song, id: b.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const x$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", S$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, E$ = () => S$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, A$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, v$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Yy = class {
  constructor(t) {
    YA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && yx(t), this.callback(yc(t));
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
    var r, s, i, o, a, c, u, d, l, y;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = E$(), e = A$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Bt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Bt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Bt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Bt("div", { class: "flex flex-col space-y-[10px]" }, Bt("div", { class: "flex items-center" }, Bt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Bt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Bt("span", { class: "sr-only" }, "Close popup"), Bt("img", { src: x$ }))), r ? Bt("p", null, "Select the wallet you want to connect to.") : Bt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Bt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Bt("div", { class: "mt-6" }, Bt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Bt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Bt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Bt("div", { class: "mt-6" }, r ? Bt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Bt("div", { class: "mb-5 flex justify-between" }, Bt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Bt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Bt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Bt("p", null, "What is a wallet? ", Bt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Bt("ul", { class: "space-y-3" }, n.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Bt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return BA(this);
  }
};
Yy.style = v$;
const $$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Yy
}, Symbol.toStringTag, { value: "Module" }));
