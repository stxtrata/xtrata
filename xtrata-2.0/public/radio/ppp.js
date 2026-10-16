var Jy = Object.defineProperty;
var tw = (t, e, n) => e in t ? Jy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var qi = (t, e, n) => tw(t, typeof e != "symbol" ? e + "" : e, n);
var We = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function a0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Ka(t) {
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
      typeof We < "u" && We || {}, r = {
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
        var M = {
          next: function() {
            var N = v.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (M[Symbol.iterator] = function() {
          return M;
        }), M;
      }
      function d(v) {
        this.map = {}, v instanceof d ? v.forEach(function(M, N) {
          this.append(N, M);
        }, this) : Array.isArray(v) ? v.forEach(function(M) {
          if (M.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + M.length);
          this.append(M[0], M[1]);
        }, this) : v && Object.getOwnPropertyNames(v).forEach(function(M) {
          this.append(M, v[M]);
        }, this);
      }
      d.prototype.append = function(v, M) {
        v = a(v), M = c(M);
        var N = this.map[v];
        this.map[v] = N ? N + ", " + M : M;
      }, d.prototype.delete = function(v) {
        delete this.map[a(v)];
      }, d.prototype.get = function(v) {
        return v = a(v), this.has(v) ? this.map[v] : null;
      }, d.prototype.has = function(v) {
        return this.map.hasOwnProperty(a(v));
      }, d.prototype.set = function(v, M) {
        this.map[a(v)] = c(M);
      }, d.prototype.forEach = function(v, M) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && v.call(M, this.map[N], N, this);
      }, d.prototype.keys = function() {
        var v = [];
        return this.forEach(function(M, N) {
          v.push(N);
        }), u(v);
      }, d.prototype.values = function() {
        var v = [];
        return this.forEach(function(M) {
          v.push(M);
        }), u(v);
      }, d.prototype.entries = function() {
        var v = [];
        return this.forEach(function(M, N) {
          v.push([N, M]);
        }), u(v);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(v) {
        if (!v._noBody) {
          if (v.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          v.bodyUsed = !0;
        }
      }
      function g(v) {
        return new Promise(function(M, N) {
          v.onload = function() {
            M(v.result);
          }, v.onerror = function() {
            N(v.error);
          };
        });
      }
      function h(v) {
        var M = new FileReader(), N = g(M);
        return M.readAsArrayBuffer(v), N;
      }
      function x(v) {
        var M = new FileReader(), N = g(M), F = /charset=([A-Za-z0-9_-]+)/.exec(v.type), Y = F ? F[1] : "utf-8";
        return M.readAsText(v, Y), N;
      }
      function A(v) {
        for (var M = new Uint8Array(v), N = new Array(M.length), F = 0; F < M.length; F++)
          N[F] = String.fromCharCode(M[F]);
        return N.join("");
      }
      function T(v) {
        if (v.slice)
          return v.slice(0);
        var M = new Uint8Array(v.byteLength);
        return M.set(new Uint8Array(v)), M.buffer;
      }
      function z() {
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
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var v = l(this);
          if (v)
            return v;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(A(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(k);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var K = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E(v) {
        var M = v.toUpperCase();
        return K.indexOf(M) > -1 ? M : v;
      }
      function b(v, M) {
        if (!(this instanceof b))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        M = M || {};
        var N = M.body;
        if (v instanceof b) {
          if (v.bodyUsed)
            throw new TypeError("Already read");
          this.url = v.url, this.credentials = v.credentials, M.headers || (this.headers = new d(v.headers)), this.method = v.method, this.mode = v.mode, this.signal = v.signal, !N && v._bodyInit != null && (N = v._bodyInit, v.bodyUsed = !0);
        } else
          this.url = String(v);
        if (this.credentials = M.credentials || this.credentials || "same-origin", (M.headers || !this.headers) && (this.headers = new d(M.headers)), this.method = E(M.method || this.method || "GET"), this.mode = M.mode || this.mode || null, this.signal = M.signal || this.signal || function() {
          if ("AbortController" in n) {
            var V = new AbortController();
            return V.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (M.cache === "no-store" || M.cache === "no-cache")) {
          var F = /([?&])_=[^&]*/;
          if (F.test(this.url))
            this.url = this.url.replace(F, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Y = /\?/;
            this.url += (Y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      b.prototype.clone = function() {
        return new b(this, { body: this._bodyInit });
      };
      function k(v) {
        var M = new FormData();
        return v.trim().split("&").forEach(function(N) {
          if (N) {
            var F = N.split("="), Y = F.shift().replace(/\+/g, " "), V = F.join("=").replace(/\+/g, " ");
            M.append(decodeURIComponent(Y), decodeURIComponent(V));
          }
        }), M;
      }
      function O(v) {
        var M = new d(), N = v.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(F) {
          return F.indexOf(`
`) === 0 ? F.substr(1, F.length) : F;
        }).forEach(function(F) {
          var Y = F.split(":"), V = Y.shift().trim();
          if (V) {
            var jt = Y.join(":").trim();
            try {
              M.append(V, jt);
            } catch (dt) {
              console.warn("Response " + dt.message);
            }
          }
        }), M;
      }
      z.call(b.prototype);
      function R(v, M) {
        if (!(this instanceof R))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (M || (M = {}), this.type = "default", this.status = M.status === void 0 ? 200 : M.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = M.statusText === void 0 ? "" : "" + M.statusText, this.headers = new d(M.headers), this.url = M.url || "", this._initBody(v);
      }
      z.call(R.prototype), R.prototype.clone = function() {
        return new R(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, R.error = function() {
        var v = new R(null, { status: 200, statusText: "" });
        return v.ok = !1, v.status = 0, v.type = "error", v;
      };
      var j = [301, 302, 303, 307, 308];
      R.redirect = function(v, M) {
        if (j.indexOf(M) === -1)
          throw new RangeError("Invalid status code");
        return new R(null, { status: M, headers: { location: v } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(M, N) {
          this.message = M, this.name = N;
          var F = Error(M);
          this.stack = F.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function X(v, M) {
        return new Promise(function(N, F) {
          var Y = new b(v, M);
          if (Y.signal && Y.signal.aborted)
            return F(new e.DOMException("Aborted", "AbortError"));
          var V = new XMLHttpRequest();
          function jt() {
            V.abort();
          }
          V.onload = function() {
            var I = {
              statusText: V.statusText,
              headers: O(V.getAllResponseHeaders() || "")
            };
            Y.url.indexOf("file://") === 0 && (V.status < 200 || V.status > 599) ? I.status = 200 : I.status = V.status, I.url = "responseURL" in V ? V.responseURL : I.headers.get("X-Request-URL");
            var P = "response" in V ? V.response : V.responseText;
            setTimeout(function() {
              N(new R(P, I));
            }, 0);
          }, V.onerror = function() {
            setTimeout(function() {
              F(new TypeError("Network request failed"));
            }, 0);
          }, V.ontimeout = function() {
            setTimeout(function() {
              F(new TypeError("Network request timed out"));
            }, 0);
          }, V.onabort = function() {
            setTimeout(function() {
              F(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function dt(I) {
            try {
              return I === "" && n.location.href ? n.location.href : I;
            } catch {
              return I;
            }
          }
          if (V.open(Y.method, dt(Y.url), !0), Y.credentials === "include" ? V.withCredentials = !0 : Y.credentials === "omit" && (V.withCredentials = !1), "responseType" in V && (r.blob ? V.responseType = "blob" : r.arrayBuffer && (V.responseType = "arraybuffer")), M && typeof M.headers == "object" && !(M.headers instanceof d || n.Headers && M.headers instanceof n.Headers)) {
            var Te = [];
            Object.getOwnPropertyNames(M.headers).forEach(function(I) {
              Te.push(a(I)), V.setRequestHeader(I, c(M.headers[I]));
            }), Y.headers.forEach(function(I, P) {
              Te.indexOf(P) === -1 && V.setRequestHeader(P, I);
            });
          } else
            Y.headers.forEach(function(I, P) {
              V.setRequestHeader(P, I);
            });
          Y.signal && (Y.signal.addEventListener("abort", jt), V.onreadystatechange = function() {
            V.readyState === 4 && Y.signal.removeEventListener("abort", jt);
          }), V.send(typeof Y._bodyInit > "u" ? null : Y._bodyInit);
        });
      }
      return X.polyfill = !0, n.fetch || (n.fetch = X, n.Headers = d, n.Request = b, n.Response = R), e.Headers = d, e.Request = b, e.Response = R, e.fetch = X, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : We);
})();
const ew = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function nw(t, e) {
  const n = {};
  return Object.assign(n, ew, e), await fetch(t, n);
}
function rw(t) {
  let e = nw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function sw(...t) {
  const { fetchLib: e, middlewares: n } = rw(t);
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
var mi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(mi || (mi = {}));
var $s;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})($s || ($s = {}));
var Lf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Lf || (Lf = {}));
const iw = "https://api.mainnet.hiro.so", ow = "https://api.testnet.hiro.so", aw = "http://localhost:3999", cw = ["mainnet", "testnet", "devnet", "mocknet"];
let xi = class {
  constructor(e) {
    this.version = $s.Mainnet, this.chainId = mi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === $s.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? sw();
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
xi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new il();
    case "testnet":
      return new lw();
    case "devnet":
      return new uw();
    case "mocknet":
      return new c0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${cw.join(", ")}`);
  }
};
xi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : xi.fromName(t);
let il = class extends xi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? iw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $s.Mainnet, this.chainId = mi.Mainnet;
  }
}, lw = class extends xi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ow,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $s.Testnet, this.chainId = mi.Testnet;
  }
}, c0 = class extends xi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = $s.Testnet, this.chainId = mi.Testnet;
  }
};
const uw = c0, l0 = "xtrata.wallet.bridge.v1", fw = (t) => typeof t == "object" && t !== null && t.protocol === l0, dw = (t) => fw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", hw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Wi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Cf = 12e4;
class pw {
  constructor(e) {
    qi(this, "pending", /* @__PURE__ */ new Map());
    qi(this, "listenTarget");
    qi(this, "closed", !1);
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
    qi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !dw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Wi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Wi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Wi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = hw(), i = { protocol: l0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Wi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Cf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Cf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Wi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const gw = ["SP", "SM"], yw = ["ST", "SN"], ww = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return gw.includes(n) ? "mainnet" : yw.includes(n) ? "testnet" : null;
}, bw = () => {
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
}, mw = () => typeof window > "u" || !window.localStorage ? bw() : window.localStorage, kc = "xtrata.v15.1.wallet.session", Tf = "mainnet", ya = { isConnected: !1 }, xw = (t) => t.address ? ww(t.address) ?? t.network : t.network, u0 = (t) => !t.isConnected || !t.address ? { ...ya } : xw(t) !== Tf ? { ...ya } : {
  isConnected: !0,
  address: t.address,
  network: Tf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Sw = (t) => {
  if (!t)
    return { ...ya };
  try {
    const e = JSON.parse(t);
    return u0(e);
  } catch {
    return { ...ya };
  }
}, Ew = (t) => {
  const e = u0(t);
  return JSON.stringify(e);
}, Aw = (t) => {
  const e = mw();
  return {
    load: () => Sw(e.getItem(kc)),
    save: (n) => {
      e.setItem(kc, Ew(n));
    },
    clear: () => {
      e.removeItem(kc);
    }
  };
}, vw = "https://browser.blockstack.org/auth", $w = {
  "@type": "Person",
  "@context": "http://schema.org"
}, f0 = ["store_write"], Iw = "blockstack-session", kw = {
  logLevel: "debug"
}, zs = {
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
Object.freeze(zs);
class Hi extends Error {
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
class Lw extends Hi {
  constructor(e, n = "") {
    super({ code: zs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Bf extends Hi {
  constructor(e = "") {
    super({ code: zs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class No extends Hi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: zs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Mf extends Hi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: zs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ol extends Hi {
  constructor(e) {
    super({ code: zs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class d0 extends Hi {
  constructor(e) {
    super({ code: zs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Nf = ["debug", "info", "warn", "error", "none"], al = {};
for (let t = 0; t < Nf.length; t++) {
  const e = Nf[t];
  al[e] = t;
}
class di {
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
    return al[kw.logLevel] <= al[e];
  }
}
function Cw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Tw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Lc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Bw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Mw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Nw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function fu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Mw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    di.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Nw(s, t.toString(), n);
    throw di.error(i), new Error(i);
  }
  if (r)
    return {};
}
function is(t, e) {
  return du(ze(t), e);
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
  if (cn(t, Uint8Array))
    return BigInt(`0x${lt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function _w(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function _f(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Eo(t, e = 8) {
  return (typeof t == "bigint" ? t : ze(t)).toString(16).padStart(e * 2, "0");
}
function Va(t) {
  return parseInt(t, 16);
}
function du(t, e = 16) {
  const n = Eo(t, e);
  return Pt(n);
}
function Pw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Uw(t, e) {
  return t & BigInt(1) << e;
}
function cl(t) {
  return Hw(BigInt(`0x${lt(t)}`), BigInt(t.byteLength * 8));
}
function Hw(t, e) {
  return Uw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Ow = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Ow[n];
  return e;
}
function Pt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = _w(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Rs(t) {
  return new TextEncoder().encode(t);
}
function Ao(t) {
  return new TextDecoder().decode(t);
}
function Dw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Fw(t) {
  return String.fromCharCode.apply(null, t);
}
function jw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Pf(t) {
  if (t.some(jw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function nr(...t) {
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
function Ae(t) {
  return nr(...t.map((e) => typeof e == "number" ? Pf([e]) : e instanceof Array ? Pf(e) : e));
}
function cn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const h0 = "https://api.mainnet.hiro.so", p0 = "https://api.testnet.hiro.so", g0 = "http://localhost:3999", zw = "https://hub.blockstack.org", Rw = 33, Cc = 32;
function Gw(t) {
  if (t.length < Cc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Cc * 2), r = t.slice(2 + Cc * 2);
  return {
    recoveryId: Va(e),
    r: n,
    s: r
  };
}
function hu(t) {
  const e = typeof t == "string" ? Pt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Kw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Vw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Xw(t, e) {
  return t[e];
}
function qw(t, e, n = 0) {
  return t[n] = e, t;
}
function Ww(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Is(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Yw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Zw(t, e) {
  const n = {};
  return Object.assign(n, Yw, e), await fetch(t, n);
}
function Qw(t) {
  let e = Zw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Jw(...t) {
  const { fetchLib: e, middlewares: n } = Qw(t);
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
class y0 {
  constructor(e = f0.slice(), n = ((a) => (a = fu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = vw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ll(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function tb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function w0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function eb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ll(t.outputLen), ll(t.blockLen);
}
function nb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function rb(t, e) {
  w0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const gs = {
  number: ll,
  bool: tb,
  bytes: w0,
  hash: eb,
  exists: nb,
  output: rb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Tc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Gn = (t, e) => t << 32 - e | t >>> e, sb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!sb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ib(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function pu(t) {
  if (typeof t == "string" && (t = ib(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let b0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Gs(t) {
  const e = (r) => t().update(pu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let m0 = class extends b0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, gs.hash(e);
    const r = pu(n);
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
    return gs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    gs.exists(this), gs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Xa = (t, e, n) => new m0(t, e).update(n).digest();
Xa.create = (t, e) => new m0(t, e);
function ob(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let gu = class extends b0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Tc(this.buffer);
  }
  update(e) {
    gs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = pu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Tc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    gs.exists(this), gs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    ob(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Tc(e), c = this.outputLen;
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
const ab = (t, e, n) => t & e ^ ~t & n, cb = (t, e, n) => t & e ^ t & n ^ e & n, lb = new Uint32Array([
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
]), kr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Lr = new Uint32Array(64);
let x0 = class extends gu {
  constructor() {
    super(64, 32, 8, !1), this.A = kr[0] | 0, this.B = kr[1] | 0, this.C = kr[2] | 0, this.D = kr[3] | 0, this.E = kr[4] | 0, this.F = kr[5] | 0, this.G = kr[6] | 0, this.H = kr[7] | 0;
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
      Lr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Lr[l - 15], h = Lr[l - 2], x = Gn(g, 7) ^ Gn(g, 18) ^ g >>> 3, A = Gn(h, 17) ^ Gn(h, 19) ^ h >>> 10;
      Lr[l] = A + Lr[l - 7] + x + Lr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Gn(a, 6) ^ Gn(a, 11) ^ Gn(a, 25), h = d + g + ab(a, c, u) + lb[l] + Lr[l] | 0, A = (Gn(r, 2) ^ Gn(r, 13) ^ Gn(r, 22)) + cb(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Lr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ub = class extends x0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Si = Gs(() => new x0());
Gs(() => new ub());
const fb = {}, S0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: fb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Nt = BigInt(0), ae = BigInt(1), Jr = BigInt(2), no = BigInt(3), Uf = BigInt(8), qt = Object.freeze({
  a: Nt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ae,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Hf = (t, e) => (t + e / Jr) / e, _o = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = qt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ae * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Hf(i * t, e), c = Hf(-r * t, e);
    let u = tt(t - a * n - c * s, e), d = tt(-a * r - c * i, e);
    const l = u > o, g = d > o;
    if (l && (u = e - u), g && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: d };
  }
}, Hn = 32, ks = 32, E0 = 32, wa = Hn + 1, ba = 2 * Hn + 1;
function Of(t) {
  const { a: e, b: n } = qt, r = tt(t * t), s = tt(r * t);
  return tt(s + e * t + n);
}
const Po = qt.a === Nt;
class yu extends Error {
  constructor(e) {
    super(e);
  }
}
function Df(t) {
  if (!(t instanceof Ft))
    throw new TypeError("JacobianPoint expected");
}
class Ft {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof It))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(It.ZERO) ? Ft.ZERO : new Ft(e.x, e.y, ae);
  }
  static toAffineBatch(e) {
    const n = yb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Ft.toAffineBatch(e).map(Ft.fromAffine);
  }
  equals(e) {
    Df(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = tt(s * s), u = tt(a * a), d = tt(n * u), l = tt(i * c), g = tt(tt(r * a) * u), h = tt(tt(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new Ft(this.x, tt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = tt(e * e), i = tt(n * n), o = tt(i * i), a = e + i, c = tt(Jr * (tt(a * a) - s - o)), u = tt(no * s), d = tt(u * u), l = tt(d - Jr * c), g = tt(u * (c - l) - Uf * o), h = tt(Jr * n * r);
    return new Ft(l, g, h);
  }
  add(e) {
    Df(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Nt || o === Nt)
      return this;
    if (n === Nt || r === Nt)
      return e;
    const c = tt(s * s), u = tt(a * a), d = tt(n * u), l = tt(i * c), g = tt(tt(r * a) * u), h = tt(tt(o * s) * c), x = tt(l - d), A = tt(h - g);
    if (x === Nt)
      return A === Nt ? this.double() : Ft.ZERO;
    const T = tt(x * x), z = tt(x * T), K = tt(d * T), E = tt(A * A - z - Jr * K), b = tt(A * (K - E) - g * z), k = tt(s * a * x);
    return new Ft(E, b, k);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Ft.ZERO;
    if (typeof e == "bigint" && e === Nt)
      return n;
    let r = zf(e);
    if (r === ae)
      return this;
    if (!Po) {
      let l = n, g = this;
      for (; r > Nt; )
        r & ae && (l = l.add(g)), g = g.double(), r >>= ae;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = _o.splitScalar(r), c = n, u = n, d = this;
    for (; i > Nt || a > Nt; )
      i & ae && (c = c.add(d)), a & ae && (u = u.add(d)), d = d.double(), i >>= ae, a >>= ae;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Ft(tt(u.x * _o.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Po ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Ft.BASE) && (n = It.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && ul.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Ft.normalizeZ(s), ul.set(n, s)));
    let i = Ft.ZERO, o = Ft.BASE;
    const a = 1 + (Po ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= d, e += ae);
      const A = h, T = h + Math.abs(x) - 1, z = g % 2 !== 0, K = x < 0;
      x === 0 ? o = o.add(Uo(z, s[A])) : i = i.add(Uo(K, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = zf(e), s, i;
    if (Po) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = _o.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(u, n);
      d = Uo(o, d), g = Uo(c, g), g = new Ft(tt(g.x * _o.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Ft.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Ft.ZERO);
    e == null && (e = i ? Uf : Oi(s));
    const o = e, a = tt(o * o), c = tt(a * o), u = tt(n * a), d = tt(r * c), l = tt(s * o);
    if (i)
      return It.ZERO;
    if (l !== ae)
      throw new Error("invZ was invalid");
    return new It(u, d);
  }
}
Ft.BASE = new Ft(qt.Gx, qt.Gy, ae);
Ft.ZERO = new Ft(Nt, ae, Nt);
function Uo(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const ul = /* @__PURE__ */ new WeakMap();
class It {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ul.delete(this);
  }
  hasEvenY() {
    return this.y % Jr === Nt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = bn(n ? e : e.subarray(1));
    if (!ca(r))
      throw new Error("Point is not on curve");
    const s = Of(r);
    let i = gb(s);
    const o = (i & ae) === ae;
    n ? o && (i = tt(-i)) : (e[0] & 1) === 1 !== o && (i = tt(-i));
    const a = new It(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = bn(e.subarray(1, Hn + 1)), r = bn(e.subarray(Hn + 1, Hn * 2 + 1)), s = new It(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = rr(e), r = n.length, s = n[0];
    if (r === Hn)
      return this.fromCompressedHex(n);
    if (r === wa && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ba && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${wa} compressed bytes or ${ba} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return It.BASE.multiply(Ls(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = $0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = wu(rr(e)), { n: a } = qt, c = r === 2 || r === 3 ? s + a : s, u = Oi(c, a), d = tt(-o * u, a), l = tt(i * u, a), g = r & 1 ? "03" : "02", h = It.fromHex(g + es(c)), x = It.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return ns(this.toHex(e));
  }
  toHex(e = !1) {
    const n = es(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${es(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ca(n) || !ca(r))
      throw new Error(e);
    const s = tt(r * r), i = Of(n);
    if (tt(s - i) !== Nt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new It(this.x, tt(-this.y));
  }
  double() {
    return Ft.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Ft.fromAffine(this).add(Ft.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Ft.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Ft.fromAffine(this), i = n === Nt || n === ae || this !== It.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Ft.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Ft.ZERO) ? void 0 : a.toAffine();
  }
}
It.BASE = new It(qt.Gx, qt.Gy);
It.ZERO = new It(Nt, Nt);
function Ff(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function jf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ei(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: bn(n), left: t.subarray(e + 2) };
}
function db(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ei(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = jf(t.subarray(2)), { data: r, left: s } = jf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ei(s)}`);
  return { r: e, s: r };
}
class wn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Ei(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new wn(ma(s.slice(0, 64)), ma(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = db(n ? e : ns(e));
    return new wn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!vi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!vi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = qt.n >> ae;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new wn(this.r, tt(-this.s, qt.n)) : this;
  }
  toDERRawBytes() {
    return ns(this.toDERHex());
  }
  toDERHex() {
    const e = Ff(Yi(this.s)), n = Ff(Yi(this.r)), r = e.length / 2, s = n.length / 2, i = Yi(r), o = Yi(s);
    return `30${Yi(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return ns(this.toCompactHex());
  }
  toCompactHex() {
    return es(this.r) + es(this.s);
  }
}
function Zr(...t) {
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
const hb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ei(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += hb[t[n]];
  return e;
}
const pb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function es(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Nt <= t && t < pb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ai(t) {
  const e = ns(es(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Yi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ma(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function ns(t) {
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
function bn(t) {
  return ma(Ei(t));
}
function rr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ns(t);
}
function zf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && vi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function tt(t, e = qt.P) {
  const n = t % e;
  return n >= Nt ? n : e + n;
}
function An(t, e) {
  const { P: n } = qt;
  let r = t;
  for (; e-- > Nt; )
    r *= r, r %= n;
  return r;
}
function gb(t) {
  const { P: e } = qt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = An(u, no) * u % e, l = An(d, no) * u % e, g = An(l, Jr) * c % e, h = An(g, r) * g % e, x = An(h, s) * h % e, A = An(x, o) * x % e, T = An(A, a) * A % e, z = An(T, o) * x % e, K = An(z, no) * u % e, E = An(K, i) * h % e, b = An(E, n) * c % e, k = An(b, Jr);
  if (k * k % e !== t)
    throw new Error("Cannot find square root");
  return k;
}
function Oi(t, e = qt.P) {
  if (t === Nt || e <= Nt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = tt(t, e), r = e, s = Nt, i = ae;
  for (; n !== Nt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== ae)
    throw new Error("invert: does not exist");
  return tt(s, e);
}
function yb(t, e = qt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Nt ? i : (n[a] = i, tt(i * o, e)), ae), s = Oi(r, e);
  return t.reduceRight((i, o, a) => o === Nt ? i : (n[a] = tt(i * n[a], e), tt(i * o, e)), s), n;
}
function wb(t) {
  const e = t.length * 8 - ks * 8, n = bn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function wu(t, e = !1) {
  const n = wb(t);
  if (e)
    return n;
  const { n: r } = qt;
  return n >= r ? n - r : n;
}
let wi, ro;
class A0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return be.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ro(this.k, ...e);
  }
  checkSync() {
    if (typeof ro != "function")
      throw new yu("hmacSha256Sync needs to be set");
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
    return Zr(...n);
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
    return Zr(...n);
  }
}
function vi(t) {
  return Nt < t && t < qt.n;
}
function ca(t) {
  return Nt < t && t < qt.P;
}
function v0(t, e, n, r = !0) {
  const { n: s } = qt, i = wu(t, !0);
  if (!vi(i))
    return;
  const o = Oi(i, s), a = It.BASE.multiply(i), c = tt(a.x, s);
  if (c === Nt)
    return;
  const u = tt(o * tt(e + n * c, s), s);
  if (u === Nt)
    return;
  let d = new wn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & ae);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Ls(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ks)
      throw new Error("Expected 32 bytes of private key");
    e = ma(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ks)
      throw new Error("Expected 32 bytes of private key");
    e = bn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!vi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function bu(t) {
  return t instanceof It ? (t.assertValidity(), t) : It.fromHex(t);
}
function $0(t) {
  if (t instanceof wn)
    return t.assertValidity(), t;
  try {
    return wn.fromDER(t);
  } catch {
    return wn.fromCompact(t);
  }
}
function vo(t, e = !1) {
  return It.fromPrivateKey(t).toRawBytes(e);
}
function bb(t, e, n, r = !1) {
  return It.fromSignature(t, e, n).toRawBytes(r);
}
function Rf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === wa || r === ba : n ? r === wa * 2 || r === ba * 2 : t instanceof It;
}
function mu(t, e, n = !1) {
  if (Rf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Rf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = bu(e);
  return r.assertValidity(), r.multiply(Ls(t)).toRawBytes(n);
}
function I0(t) {
  const e = t.length > Hn ? t.slice(0, Hn) : t;
  return bn(e);
}
function mb(t) {
  const e = I0(t), n = tt(e, qt.n);
  return k0(n < Nt ? e : n);
}
function k0(t) {
  return Ai(t);
}
function L0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = rr(t), s = Ls(e), i = [k0(s), mb(r)];
  if (n != null) {
    n === !0 && (n = be.randomBytes(Hn));
    const c = rr(n);
    if (c.length !== Hn)
      throw new Error(`sign: Expected ${Hn} bytes of extra data`);
    i.push(c);
  }
  const o = Zr(...i), a = I0(r);
  return { seed: o, m: a, d: s };
}
function C0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function xb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = L0(t, e, n.extraEntropy), o = new A0(E0, ks);
  await o.reseed(r);
  let a;
  for (; !(a = v0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return C0(a, n);
}
function qa(t, e, n = {}) {
  const { seed: r, m: s, d: i } = L0(t, e, n.extraEntropy), o = new A0(E0, ks);
  o.reseedSync(r);
  let a;
  for (; !(a = v0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return C0(a, n);
}
const Sb = { strict: !0 };
function Eb(t, e, n, r = Sb) {
  let s;
  try {
    s = $0(t), e = rr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = wu(e);
  let c;
  try {
    c = bu(n);
  } catch {
    return !1;
  }
  const { n: u } = qt, d = Oi(o, u), l = tt(a * d, u), g = tt(i * d, u), h = It.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? tt(h.x, u) === i : !1;
}
function xa(t) {
  return tt(bn(t), qt.n);
}
class $i {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = rr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = bn(n.subarray(0, 32)), s = bn(n.subarray(32, 64));
    return new $i(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ca(e) || !vi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return es(this.r) + es(this.s);
  }
  toRawBytes() {
    return ns(this.toHex());
  }
}
function Ab(t) {
  return It.fromPrivateKey(t).toRawX();
}
class T0 {
  constructor(e, n, r = be.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = rr(e);
    const { x: s, scalar: i } = this.getScalar(Ls(n));
    if (this.px = s, this.d = i, this.rand = rr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = It.fromPrivateKey(e), r = n.hasEvenY() ? e : qt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ai(e ^ bn(n));
  }
  finalizeNonce(e) {
    const n = tt(bn(e), qt.n);
    if (n === Nt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new $i(e.x, tt(n + r * s, qt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = be.taggedHash, o = this.initNonce(n, await i(Yr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(Yr.nonce, o, r, e)), d = xa(await i(Yr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await N0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = be.taggedHashSync, o = this.initNonce(n, i(Yr.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(Yr.nonce, o, r, e)), d = xa(i(Yr.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return _0(l, e, r) || this.error(), l;
  }
}
async function vb(t, e, n) {
  return new T0(t, e, n).calc();
}
function $b(t, e, n) {
  return new T0(t, e, n).calcSync();
}
function B0(t, e, n) {
  const r = t instanceof $i, s = r ? t : $i.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: rr(e),
    P: bu(n)
  };
}
function M0(t, e, n, r) {
  const s = It.BASE.multiplyAndAddUnsafe(e, Ls(n), tt(-r, qt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function N0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = B0(t, e, n), a = xa(await be.taggedHash(Yr.challenge, Ai(r), o.toRawX(), i));
    return M0(r, o, s, a);
  } catch {
    return !1;
  }
}
function _0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = B0(t, e, n), a = xa(be.taggedHashSync(Yr.challenge, Ai(r), o.toRawX(), i));
    return M0(r, o, s, a);
  } catch (r) {
    if (r instanceof yu)
      throw r;
    return !1;
  }
}
const Ib = {
  Signature: $i,
  getPublicKey: Ab,
  sign: vb,
  verify: N0,
  signSync: $b,
  verifySync: _0
};
It.BASE._setWindowSize(8);
const fn = {
  node: S0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Yr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ho = {}, be = {
  bytesToHex: Ei,
  hexToBytes: ns,
  concatBytes: Zr,
  mod: tt,
  invert: Oi,
  isValidPrivateKey(t) {
    try {
      return Ls(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ai,
  _normalizePrivateKey: Ls,
  hashToPrivateKey: (t) => {
    t = rr(t);
    const e = ks + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = tt(bn(t), qt.n - ae) + ae;
    return Ai(n);
  },
  randomBytes: (t = 32) => {
    if (fn.web)
      return fn.web.getRandomValues(new Uint8Array(t));
    if (fn.node) {
      const { randomBytes: e } = fn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => be.hashToPrivateKey(be.randomBytes(ks + 8)),
  precompute(t = 8, e = It.BASE) {
    const n = e === It.BASE ? e : new It(e.x, e.y);
    return n._setWindowSize(t), n.multiply(no), n;
  },
  sha256: async (...t) => {
    if (fn.web) {
      const e = await fn.web.subtle.digest("SHA-256", Zr(...t));
      return new Uint8Array(e);
    } else if (fn.node) {
      const { createHash: e } = fn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (fn.web) {
      const n = await fn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Zr(...e), s = await fn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (fn.node) {
      const { createHmac: n } = fn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ho[t];
    if (n === void 0) {
      const r = await be.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Zr(r, r), Ho[t] = n;
    }
    return be.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof wi != "function")
      throw new yu("sha256Sync is undefined, you need to set it");
    let n = Ho[t];
    if (n === void 0) {
      const r = wi(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Zr(r, r), Ho[t] = n;
    }
    return wi(n, ...e);
  },
  _JacobianPoint: Ft
};
Object.defineProperties(be, {
  sha256Sync: {
    configurable: !1,
    get() {
      return wi;
    },
    set(t) {
      wi || (wi = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ro;
    },
    set(t) {
      ro || (ro = t);
    }
  }
});
const kb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: qt,
  Point: It,
  Signature: wn,
  getPublicKey: vo,
  getSharedSecret: mu,
  recoverPublicKey: bb,
  schnorr: Ib,
  sign: xb,
  signSync: qa,
  utils: be,
  verify: Eb
}, Symbol.toStringTag, { value: "Module" }));
var $o = {};
$o.byteLength = Mb;
var Lb = $o.toByteArray = _b, Cb = $o.fromByteArray = Hb, Yn = [], $n = [], Tb = typeof Uint8Array < "u" ? Uint8Array : Array, Bc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var oi = 0, Bb = Bc.length; oi < Bb; ++oi)
  Yn[oi] = Bc[oi], $n[Bc.charCodeAt(oi)] = oi;
$n[45] = 62;
$n[95] = 63;
function P0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Mb(t) {
  var e = P0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Nb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function _b(t) {
  var e, n = P0(t), r = n[0], s = n[1], i = new Tb(Nb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = $n[t.charCodeAt(c)] << 18 | $n[t.charCodeAt(c + 1)] << 12 | $n[t.charCodeAt(c + 2)] << 6 | $n[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = $n[t.charCodeAt(c)] << 2 | $n[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = $n[t.charCodeAt(c)] << 10 | $n[t.charCodeAt(c + 1)] << 4 | $n[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Pb(t) {
  return Yn[t >> 18 & 63] + Yn[t >> 12 & 63] + Yn[t >> 6 & 63] + Yn[t & 63];
}
function Ub(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Pb(r));
  return s.join("");
}
function Hb(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Ub(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Yn[e >> 2] + Yn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Yn[e >> 10] + Yn[e >> 4 & 63] + Yn[e << 2 & 63] + "="
  )), s.join("");
}
function Ob() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Db = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Fb() {
  if (Ob())
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
    throw new Error(Db);
  }
}
class jb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(nr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(nr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class zb {
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
async function U0() {
  const t = await Fb();
  return t.name === "subtleCrypto" ? new zb(t.lib) : new jb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Rb(t) {
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
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var x = 0, A = 0, T = 0, z = h.length; T !== z && h[T] === 0; )
      T++, x++;
    for (var K = (z - T) * u + 1 >>> 0, E = new Uint8Array(K); T !== z; ) {
      for (var b = h[T], k = 0, O = K - 1; (b !== 0 || k < A) && O !== -1; O--, k++)
        b += 256 * E[O] >>> 0, E[O] = b % o >>> 0, b = b / o >>> 0;
      if (b !== 0)
        throw new Error("Non-zero carry");
      A = k, T++;
    }
    for (var R = K - A; R !== K && E[R] === 0; )
      R++;
    for (var j = a.repeat(x); R < K; ++R)
      j += t.charAt(E[R]);
    return j;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var x = 0, A = 0, T = 0; h[x] === a; )
      A++, x++;
    for (var z = (h.length - x) * c + 1 >>> 0, K = new Uint8Array(z); h[x]; ) {
      var E = h.charCodeAt(x);
      if (E > 255)
        return;
      var b = e[E];
      if (b === 255)
        return;
      for (var k = 0, O = z - 1; (b !== 0 || k < T) && O !== -1; O--, k++)
        b += o * K[O] >>> 0, K[O] = b % 256 >>> 0, b = b / 256 >>> 0;
      if (b !== 0)
        throw new Error("Non-zero carry");
      T = k, x++;
    }
    for (var R = z - T; R !== z && K[R] === 0; )
      R++;
    for (var j = new Uint8Array(A + (z - R)), X = A; R !== z; )
      j[X++] = K[R++];
    return j;
  }
  function g(h) {
    var x = l(h);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var H0 = Rb;
const Gb = H0, Kb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Vb = Gb(Kb);
const Xb = /* @__PURE__ */ a0(Vb), qb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), O0 = Uint8Array.from({ length: 16 }, (t, e) => e), Wb = O0.map((t) => (9 * t + 5) % 16);
let xu = [O0], Su = [Wb];
for (let t = 0; t < 4; t++)
  for (let e of [xu, Su])
    e.push(e[t].map((n) => qb[n]));
const D0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Yb = xu.map((t, e) => t.map((n) => D0[e][n])), Zb = Su.map((t, e) => t.map((n) => D0[e][n])), Qb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Jb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oo = (t, e) => t << e | t >>> 32 - e;
function Gf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Do = new Uint32Array(16);
let tm = class extends gu {
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
      Do[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, A = Qb[h], T = Jb[h], z = xu[h], K = Su[h], E = Yb[h], b = Zb[h];
      for (let k = 0; k < 16; k++) {
        const O = Oo(r + Gf(h, i, a, u) + Do[z[k]] + A, E[k]) + l | 0;
        r = l, l = u, u = Oo(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = Oo(s + Gf(x, o, c, d) + Do[K[k]] + T, b[k]) + g | 0;
        s = g, g = d, d = Oo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Do.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const em = Gs(() => new tm());
function nm(t) {
  return em(t);
}
const Fo = BigInt(2 ** 32 - 1), fl = BigInt(32);
function F0(t, e = !1) {
  return e ? { h: Number(t & Fo), l: Number(t >> fl & Fo) } : { h: Number(t >> fl & Fo) | 0, l: Number(t & Fo) | 0 };
}
function rm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = F0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const sm = (t, e) => BigInt(t >>> 0) << fl | BigInt(e >>> 0), im = (t, e, n) => t >>> n, om = (t, e, n) => t << 32 - n | e >>> n, am = (t, e, n) => t >>> n | e << 32 - n, cm = (t, e, n) => t << 32 - n | e >>> n, lm = (t, e, n) => t << 64 - n | e >>> n - 32, um = (t, e, n) => t >>> n - 32 | e << 64 - n, fm = (t, e) => e, dm = (t, e) => t, hm = (t, e, n) => t << n | e >>> 32 - n, pm = (t, e, n) => e << n | t >>> 32 - n, gm = (t, e, n) => e << n - 32 | t >>> 64 - n, ym = (t, e, n) => t << n - 32 | e >>> 64 - n;
function wm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const bm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), mm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, xm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Sm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Em = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Am = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, mt = {
  fromBig: F0,
  split: rm,
  toBig: sm,
  shrSH: im,
  shrSL: om,
  rotrSH: am,
  rotrSL: cm,
  rotrBH: lm,
  rotrBL: um,
  rotr32H: fm,
  rotr32L: dm,
  rotlSH: hm,
  rotlSL: pm,
  rotlBH: gm,
  rotlBL: ym,
  add: wm,
  add3L: bm,
  add3H: mm,
  add4L: xm,
  add4H: Sm,
  add5H: Am,
  add5L: Em
}, [vm, $m] = mt.split([
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
].map((t) => BigInt(t))), Cr = new Uint32Array(80), Tr = new Uint32Array(80);
let Wa = class extends gu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: A, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = A | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Cr[E] = e.getUint32(n), Tr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const b = Cr[E - 15] | 0, k = Tr[E - 15] | 0, O = mt.rotrSH(b, k, 1) ^ mt.rotrSH(b, k, 8) ^ mt.shrSH(b, k, 7), R = mt.rotrSL(b, k, 1) ^ mt.rotrSL(b, k, 8) ^ mt.shrSL(b, k, 7), j = Cr[E - 2] | 0, X = Tr[E - 2] | 0, v = mt.rotrSH(j, X, 19) ^ mt.rotrBH(j, X, 61) ^ mt.shrSH(j, X, 6), M = mt.rotrSL(j, X, 19) ^ mt.rotrBL(j, X, 61) ^ mt.shrSL(j, X, 6), N = mt.add4L(R, M, Tr[E - 7], Tr[E - 16]), F = mt.add4H(N, O, v, Cr[E - 7], Cr[E - 16]);
      Cr[E] = F | 0, Tr[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: A, Gl: T, Hh: z, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const b = mt.rotrSH(l, g, 14) ^ mt.rotrSH(l, g, 18) ^ mt.rotrBH(l, g, 41), k = mt.rotrSL(l, g, 14) ^ mt.rotrSL(l, g, 18) ^ mt.rotrBL(l, g, 41), O = l & h ^ ~l & A, R = g & x ^ ~g & T, j = mt.add5L(K, k, R, $m[E], Tr[E]), X = mt.add5H(j, z, b, O, vm[E], Cr[E]), v = j | 0, M = mt.rotrSH(r, s, 28) ^ mt.rotrBH(r, s, 34) ^ mt.rotrBH(r, s, 39), N = mt.rotrSL(r, s, 28) ^ mt.rotrBL(r, s, 34) ^ mt.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      z = A | 0, K = T | 0, A = h | 0, T = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = mt.add(u | 0, d | 0, X | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const V = mt.add3L(v, N, Y);
      r = mt.add3H(V, X, M, F), s = V | 0;
    }
    ({ h: r, l: s } = mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = mt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = mt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = mt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: A, l: T } = mt.add(this.Gh | 0, this.Gl | 0, A | 0, T | 0), { h: z, l: K } = mt.add(this.Hh | 0, this.Hl | 0, z | 0, K | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, x, A, T, z, K);
  }
  roundClean() {
    Cr.fill(0), Tr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Im = class extends Wa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, km = class extends Wa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Lm = class extends Wa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Cm = Gs(() => new Wa());
Gs(() => new Im());
Gs(() => new km());
Gs(() => new Lm());
function j0(t) {
  return Si(t);
}
function Tm(t) {
  return Cm(t);
}
const Bm = 0;
be.hmacSha256Sync = (t, ...e) => {
  const n = Xa.create(Si, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Mm() {
  return lt(be.randomPrivateKey());
}
function Nm(t) {
  const e = Si(Si(t));
  return Xb.encode(nr(t, e).slice(0, t.length + 4));
}
function _m(t, e) {
  return Nm(nr(new Uint8Array([t]), e.slice(0, 20)));
}
function z0(t, e = Bm) {
  const n = typeof t == "string" ? Pt(t) : t, r = nm(j0(n));
  return _m(e, r);
}
function R0(t) {
  const e = hu(t);
  return lt(vo(e.slice(0, 32), !0));
}
be.hmacSha256Sync = (t, ...e) => {
  const n = Xa.create(Si, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Sa;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Sa || (Sa = {}));
async function Pm(t, e, n) {
  return await (await U0()).encrypt("aes-256-cbc", e, t, n);
}
async function Um(t, e, n) {
  return await (await U0()).decrypt("aes-256-cbc", e, t, n);
}
function G0(t, e) {
  return Xa(Si, t, e);
}
function Hm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function K0(t) {
  const e = Tm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function Om(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Dm(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Sa.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Sa.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !Om(t))
    return e;
  try {
    return It.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Fm(t, e, n, r) {
  const s = Dm(t);
  if (!s.result)
    throw s;
  const i = be.randomPrivateKey(), o = vo(i, !0);
  let a = mu(i, t, !0);
  a = a.slice(1);
  const c = K0(a), u = be.randomBytes(16), d = await Pm(u, c.encryptionKey, e), l = nr(u, o, d), g = G0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = lt(d);
  else if (r === "base64")
    h = Cb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: lt(u),
    ephemeralPK: lt(o),
    cipherText: h,
    mac: lt(g),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function V0(t, e) {
  if (!e.ephemeralPK)
    throw new Mf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = mu(t, n, !0);
  r = r.slice(1);
  const s = K0(r), i = Pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Lb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = nr(i, Pt(n), o), c = G0(s.hmacKey, a), u = Pt(e.mac);
  if (!Hm(u, c))
    throw new Mf("Decryption failed: failure in MAC check");
  const d = await Um(i, s.encryptionKey, o);
  return e.wasString ? Ao(d) : d;
}
function jm(t, e) {
  const n = typeof e == "string" ? Rs(e) : e, r = R0(t), s = j0(n), i = qa(s, t);
  return {
    signature: lt(i),
    publicKey: r
  };
}
async function zm(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = R0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Rs(t) : t, o = await Fm(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = jm(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Rm(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return V0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var He = {}, Ii = {}, Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.decode = Xe.encode = Xe.unescape = Xe.escape = Xe.pad = void 0;
const X0 = $o;
function Eu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Xe.pad = Eu;
function q0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Xe.escape = q0;
function W0(t) {
  return Eu(t).replace(/-/g, "+").replace(/_/g, "/");
}
Xe.unescape = W0;
function Gm(t) {
  return q0((0, X0.fromByteArray)(new TextEncoder().encode(t)));
}
Xe.encode = Gm;
function Km(t) {
  return new TextDecoder().decode((0, X0.toByteArray)(Eu(W0(t))));
}
Xe.decode = Km;
var Ya = {}, Za = {}, Y0 = {}, Z0 = {}, Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
Qa.crypto = void 0;
Qa.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = x, t.byteSwap32 = A, t.bytesToHex = K, t.hexToBytes = k, t.asyncLoop = R, t.utf8ToBytes = j, t.bytesToUtf8 = X, t.toBytes = v, t.kdfInputToBytes = M, t.concatBytes = N, t.checkOpts = F, t.createHasher = V, t.createOptHasher = jt, t.createXOFer = dt, t.randomBytes = Te;
  const e = Qa;
  function n(I) {
    return I instanceof Uint8Array || ArrayBuffer.isView(I) && I.constructor.name === "Uint8Array";
  }
  function r(I) {
    if (!Number.isSafeInteger(I) || I < 0)
      throw new Error("positive integer expected, got " + I);
  }
  function s(I, ...P) {
    if (!n(I))
      throw new Error("Uint8Array expected");
    if (P.length > 0 && !P.includes(I.length))
      throw new Error("Uint8Array expected of length " + P + ", got length=" + I.length);
  }
  function i(I) {
    if (typeof I != "function" || typeof I.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(I.outputLen), r(I.blockLen);
  }
  function o(I, P = !0) {
    if (I.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (P && I.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(I, P) {
    s(I);
    const ut = P.outputLen;
    if (I.length < ut)
      throw new Error("digestInto() expects output buffer of length at least " + ut);
  }
  function c(I) {
    return new Uint8Array(I.buffer, I.byteOffset, I.byteLength);
  }
  function u(I) {
    return new Uint32Array(I.buffer, I.byteOffset, Math.floor(I.byteLength / 4));
  }
  function d(...I) {
    for (let P = 0; P < I.length; P++)
      I[P].fill(0);
  }
  function l(I) {
    return new DataView(I.buffer, I.byteOffset, I.byteLength);
  }
  function g(I, P) {
    return I << 32 - P | I >>> P;
  }
  function h(I, P) {
    return I << P | I >>> 32 - P >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(I) {
    return I << 24 & 4278190080 | I << 8 & 16711680 | I >>> 8 & 65280 | I >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (I) => I : (I) => x(I), t.byteSwapIfBE = t.swap8IfBE;
  function A(I) {
    for (let P = 0; P < I.length; P++)
      I[P] = x(I[P]);
    return I;
  }
  t.swap32IfBE = t.isLE ? (I) => I : A;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", z = /* @__PURE__ */ Array.from({ length: 256 }, (I, P) => P.toString(16).padStart(2, "0"));
  function K(I) {
    if (s(I), T)
      return I.toHex();
    let P = "";
    for (let ut = 0; ut < I.length; ut++)
      P += z[I[ut]];
    return P;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function b(I) {
    if (I >= E._0 && I <= E._9)
      return I - E._0;
    if (I >= E.A && I <= E.F)
      return I - (E.A - 10);
    if (I >= E.a && I <= E.f)
      return I - (E.a - 10);
  }
  function k(I) {
    if (typeof I != "string")
      throw new Error("hex string expected, got " + typeof I);
    if (T)
      return Uint8Array.fromHex(I);
    const P = I.length, ut = P / 2;
    if (P % 2)
      throw new Error("hex string expected, got unpadded hex of length " + P);
    const vt = new Uint8Array(ut);
    for (let Lt = 0, zt = 0; Lt < ut; Lt++, zt += 2) {
      const re = b(I.charCodeAt(zt)), Ut = b(I.charCodeAt(zt + 1));
      if (re === void 0 || Ut === void 0) {
        const Wt = I[zt] + I[zt + 1];
        throw new Error('hex string expected, got non-hex character "' + Wt + '" at index ' + zt);
      }
      vt[Lt] = re * 16 + Ut;
    }
    return vt;
  }
  const O = async () => {
  };
  t.nextTick = O;
  async function R(I, P, ut) {
    let vt = Date.now();
    for (let Lt = 0; Lt < I; Lt++) {
      ut(Lt);
      const zt = Date.now() - vt;
      zt >= 0 && zt < P || (await (0, t.nextTick)(), vt += zt);
    }
  }
  function j(I) {
    if (typeof I != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(I));
  }
  function X(I) {
    return new TextDecoder().decode(I);
  }
  function v(I) {
    return typeof I == "string" && (I = j(I)), s(I), I;
  }
  function M(I) {
    return typeof I == "string" && (I = j(I)), s(I), I;
  }
  function N(...I) {
    let P = 0;
    for (let vt = 0; vt < I.length; vt++) {
      const Lt = I[vt];
      s(Lt), P += Lt.length;
    }
    const ut = new Uint8Array(P);
    for (let vt = 0, Lt = 0; vt < I.length; vt++) {
      const zt = I[vt];
      ut.set(zt, Lt), Lt += zt.length;
    }
    return ut;
  }
  function F(I, P) {
    if (P !== void 0 && {}.toString.call(P) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(I, P);
  }
  class Y {
  }
  t.Hash = Y;
  function V(I) {
    const P = (vt) => I().update(v(vt)).digest(), ut = I();
    return P.outputLen = ut.outputLen, P.blockLen = ut.blockLen, P.create = () => I(), P;
  }
  function jt(I) {
    const P = (vt, Lt) => I(Lt).update(v(vt)).digest(), ut = I({});
    return P.outputLen = ut.outputLen, P.blockLen = ut.blockLen, P.create = (vt) => I(vt), P;
  }
  function dt(I) {
    const P = (vt, Lt) => I(Lt).update(v(vt)).digest(), ut = I({});
    return P.outputLen = ut.outputLen, P.blockLen = ut.blockLen, P.create = (vt) => I(vt), P;
  }
  t.wrapConstructor = V, t.wrapConstructorWithOpts = jt, t.wrapXOFConstructorWithOpts = dt;
  function Te(I = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(I));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(I));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Z0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Z0;
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
})(Y0);
const ai = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Q0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function dl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ks(t, ...e) {
  if (!Q0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Vm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  dl(t.outputLen), dl(t.blockLen);
}
function hl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function J0(t, e) {
  Ks(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Xm(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function qm(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ea(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function la(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Bn(t, e) {
  return t << 32 - e | t >>> e;
}
function Wm(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Au = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function vu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const tp = Au ? (t) => t : (t) => vu(t), Ym = tp;
function ep(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = vu(t[e]);
  return t;
}
const Zm = Au ? (t) => t : ep, np = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Qm = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function rp(t) {
  if (Ks(t), np)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Qm[t[n]];
  return e;
}
const lr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Kf(t) {
  if (t >= lr._0 && t <= lr._9)
    return t - lr._0;
  if (t >= lr.A && t <= lr.F)
    return t - (lr.A - 10);
  if (t >= lr.a && t <= lr.f)
    return t - (lr.a - 10);
}
function Jm(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (np)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Kf(t.charCodeAt(i)), a = Kf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const sp = async () => {
};
async function t1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await sp(), r += i);
  }
}
function $u(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function e1(t) {
  return new TextDecoder().decode(t);
}
function Io(t) {
  return typeof t == "string" && (t = $u(t)), Ks(t), t;
}
function n1(t) {
  return typeof t == "string" && (t = $u(t)), Ks(t), t;
}
function r1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ks(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function s1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let ip = class {
};
function Ja(t) {
  const e = (r) => t().update(Io(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function op(t) {
  const e = (r, s) => t(s).update(Io(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function ap(t) {
  const e = (r, s) => t(s).update(Io(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const i1 = Ja, o1 = op, a1 = ap;
function c1(t = 32) {
  if (ai && typeof ai.getRandomValues == "function")
    return ai.getRandomValues(new Uint8Array(t));
  if (ai && typeof ai.randomBytes == "function")
    return Uint8Array.from(ai.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const l1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: ip,
  abytes: Ks,
  aexists: hl,
  ahash: Vm,
  anumber: dl,
  aoutput: J0,
  asyncLoop: t1,
  byteSwap: vu,
  byteSwap32: ep,
  byteSwapIfBE: Ym,
  bytesToHex: rp,
  bytesToUtf8: e1,
  checkOpts: s1,
  clean: Ea,
  concatBytes: r1,
  createHasher: Ja,
  createOptHasher: op,
  createView: la,
  createXOFer: ap,
  hexToBytes: Jm,
  isBytes: Q0,
  isLE: Au,
  kdfInputToBytes: n1,
  nextTick: sp,
  randomBytes: c1,
  rotl: Wm,
  rotr: Bn,
  swap32IfBE: Zm,
  swap8IfBE: tp,
  toBytes: Io,
  u32: qm,
  u8: Xm,
  utf8ToBytes: $u,
  wrapConstructor: i1,
  wrapConstructorWithOpts: o1,
  wrapXOFConstructorWithOpts: a1
}, Symbol.toStringTag, { value: "Module" }));
function u1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function f1(t, e, n) {
  return t & e ^ ~t & n;
}
function d1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class h1 extends ip {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = la(this.buffer);
  }
  update(e) {
    hl(this), e = Io(e), Ks(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = la(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    hl(this), J0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Ea(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    u1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = la(e), c = this.outputLen;
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
const Br = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Mr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), p1 = /* @__PURE__ */ Uint32Array.from([
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
]), Nr = /* @__PURE__ */ new Uint32Array(64);
let Iu = class extends h1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Br[0] | 0, this.B = Br[1] | 0, this.C = Br[2] | 0, this.D = Br[3] | 0, this.E = Br[4] | 0, this.F = Br[5] | 0, this.G = Br[6] | 0, this.H = Br[7] | 0;
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
      Nr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Nr[l - 15], h = Nr[l - 2], x = Bn(g, 7) ^ Bn(g, 18) ^ g >>> 3, A = Bn(h, 17) ^ Bn(h, 19) ^ h >>> 10;
      Nr[l] = A + Nr[l - 7] + x + Nr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Bn(a, 6) ^ Bn(a, 11) ^ Bn(a, 25), h = d + g + f1(a, c, u) + p1[l] + Nr[l] | 0, A = (Bn(r, 2) ^ Bn(r, 13) ^ Bn(r, 22)) + d1(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Ea(Nr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ea(this.buffer);
  }
}, cp = class extends Iu {
  constructor() {
    super(28), this.A = Mr[0] | 0, this.B = Mr[1] | 0, this.C = Mr[2] | 0, this.D = Mr[3] | 0, this.E = Mr[4] | 0, this.F = Mr[5] | 0, this.G = Mr[6] | 0, this.H = Mr[7] | 0;
  }
};
const g1 = /* @__PURE__ */ Ja(() => new Iu()), y1 = /* @__PURE__ */ Ja(() => new cp()), w1 = Iu, lp = g1, b1 = cp, m1 = y1, x1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: b1,
  SHA256: w1,
  sha224: m1,
  sha256: lp
}, Symbol.toStringTag, { value: "Module" })), tc = /* @__PURE__ */ Ka(x1), S1 = /* @__PURE__ */ Ka(kb);
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.joseToDer = ki.derToJose = void 0;
const up = $o, fp = Xe;
function Mc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const E1 = {
  ES256: Mc(256),
  ES384: Mc(384),
  ES512: Mc(521)
};
function dp(t) {
  const e = E1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Aa = 128, hp = 0, A1 = 32, v1 = 16, $1 = 2, pp = v1 | A1 | hp << 6, va = $1 | hp << 6;
function gp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, up.toByteArray)((0, fp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function I1(t, e) {
  const n = gp(t), r = dp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== pp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Aa | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== va)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== va)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - d, x = new Uint8Array(g + c + h + d);
  for (o = 0; o < g; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const A = o; o < A + h; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, fp.escape)((0, up.fromByteArray)(x));
}
ki.derToJose = I1;
function Vf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Aa && --r, r;
}
function k1(t, e) {
  t = gp(t);
  const n = dp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Vf(t, 0, n), i = Vf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Aa, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = pp, u ? d[l++] = c : (d[l++] = Aa | 1, d[l++] = c & 255), d[l++] = va, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = va, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
ki.joseToDer = k1;
var wr = {};
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.InvalidTokenError = wr.MissingParametersError = void 0;
class L1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
wr.MissingParametersError = L1;
class C1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
wr.InvalidTokenError = C1;
const ko = /* @__PURE__ */ Ka(l1);
Object.defineProperty(Za, "__esModule", { value: !0 });
Za.SECP256K1Client = void 0;
const T1 = Y0, B1 = tc, ua = S1, Xf = ki, qf = wr, Wf = ko;
ua.utils.hmacSha256Sync = (t, ...e) => {
  const n = T1.hmac.create(B1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class yp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Wf.bytesToHex)(ua.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new qf.MissingParametersError("a signing input hash and private key are all required");
    const s = ua.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Wf.bytesToHex)(s);
    if (r === "jose")
      return (0, Xf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Xf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new qf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ua.verify(n, e, r, { strict: !1 });
  }
}
Za.SECP256K1Client = yp;
yp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Za;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ya);
var Cs = {};
const M1 = /* @__PURE__ */ Ka(S0);
var N1 = We && We.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.hashSha256Async = Cs.hashSha256 = void 0;
const _1 = tc;
function wp(t) {
  return (0, _1.sha256)(t);
}
Cs.hashSha256 = wp;
function P1(t) {
  return N1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = M1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(wp(t));
    }
  });
}
Cs.hashSha256Async = P1;
var U1 = We && We.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.TokenSigner = Ii.createUnsecuredToken = void 0;
const pl = Xe, Yf = Ya, H1 = wr, Zf = Cs;
function gl(t, e) {
  const n = [], r = pl.encode(JSON.stringify(e));
  n.push(r);
  const s = pl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function O1(t) {
  return gl(t, { typ: "JWT", alg: "none" }) + ".";
}
Ii.createUnsecuredToken = O1;
class D1 {
  constructor(e, n) {
    if (!(e && n))
      throw new H1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Yf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Yf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = gl(e, s), o = (0, Zf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return U1(this, void 0, void 0, function* () {
      const s = this.header(r), i = gl(e, s), o = yield (0, Zf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [pl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ii.TokenSigner = D1;
var ec = {};
Object.defineProperty(ec, "__esModule", { value: !0 });
ec.TokenVerifier = void 0;
const F1 = Xe, Qf = Ya, j1 = wr, jo = Cs;
class z1 {
  constructor(e, n) {
    if (!(e && n))
      throw new j1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Qf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Qf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, jo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, jo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), F1.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, jo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, jo.hashSha256)(r);
      return i(o);
    }
  }
}
ec.TokenVerifier = z1;
var nc = {};
Object.defineProperty(nc, "__esModule", { value: !0 });
nc.decodeToken = void 0;
const zo = Xe;
function R1(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(zo.decode(e[0])), r = JSON.parse(zo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = zo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(zo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
nc.decodeToken = R1;
(function(t) {
  var e = We && We.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = We && We.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ii, t), n(ec, t), n(nc, t), n(wr, t), n(Ya, t);
})(He);
function G1(t) {
  return `did:btc-addr:${t}`;
}
function K1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Bf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Bf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function bp(t) {
  if (t)
    return K1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const V1 = "1.4.0";
function X1() {
  return Mm();
}
function q1(t, e, n, r = f0.slice(), s, i = Cw().getTime(), o = {}) {
  const a = (h) => {
    const x = fu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Bw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: V1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = He.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = z0(u);
  return c.iss = G1(d), new He.TokenSigner("ES256k", t).sign(c);
}
async function Jf(t, e) {
  const n = Ao(Pt(e)), r = JSON.parse(n), s = await V0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function W1(t) {
  const e = He.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new He.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Y1(t) {
  const e = He.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = bp(e.iss);
  if (n.length === 1) {
    if (z0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Z1(t) {
  const e = He.decodeToken(t).payload;
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
function Q1(t) {
  const e = He.decodeToken(t).payload;
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
function J1(t) {
  const e = [
    Q1(t),
    Z1(t),
    W1(t),
    Y1(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const td = "1.0.0";
class rs {
  constructor(e) {
    this.version = td, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== td)
      throw new ol(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new rs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class mp {
  constructor(e) {
    if (e) {
      const n = new rs(e);
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
class ed extends mp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new rs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new d0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new rs({})), !0;
  }
}
class nd extends mp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Iw, !localStorage.getItem(this.key)) {
      const r = new rs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new d0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return rs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new rs({})), !0;
  }
}
var lo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(lo || (lo = {}));
var $a;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($a || ($a = {}));
lo.Mainnet;
var gr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gr || (gr = {}));
var Jn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Jn || (Jn = {}));
gr.Mainnet;
const xp = {
  chainId: lo.Mainnet,
  transactionVersion: gr.Mainnet,
  peerNetworkId: $a.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Jn.MainnetSingleSig,
    multiSig: Jn.MainnetMultiSig
  },
  client: { baseUrl: h0 }
}, yl = {
  chainId: lo.Testnet,
  transactionVersion: gr.Testnet,
  peerNetworkId: $a.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Jn.TestnetSingleSig,
    multiSig: Jn.TestnetMultiSig
  },
  client: { baseUrl: p0 }
}, fa = {
  ...yl,
  addressVersion: { ...yl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: g0 }
}, t2 = {
  ...fa,
  addressVersion: { ...fa.addressVersion },
  client: { ...fa.client }
};
function e2(t) {
  switch (t) {
    case "mainnet":
      return xp;
    case "testnet":
      return yl;
    case "devnet":
      return fa;
    case "mocknet":
      return t2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Sp(t) {
  return typeof t == "string" ? e2(t) : t;
}
var rd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(rd || (rd = {}));
var sd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(sd || (sd = {}));
var Nn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Nn || (Nn = {}));
const Nc = ["onChainOnly", "offChainOnly", "any"];
Nc[0] + "", Nn.OnChainOnly, Nc[1] + "", Nn.OffChainOnly, Nc[2] + "", Nn.Any, Nn.OnChainOnly + "", Nn.OnChainOnly, Nn.OffChainOnly + "", Nn.OffChainOnly, Nn.Any + "", Nn.Any;
var id;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(id || (id = {}));
var od;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(od || (od = {}));
var ad;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ad || (ad = {}));
var pr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(pr || (pr = {}));
var cd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(gd || (gd = {}));
var yd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(yd || (yd = {}));
function wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function n2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ep(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function r2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wl(t.outputLen), wl(t.blockLen);
}
function s2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function i2(t, e) {
  Ep(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ys = {
  number: wl,
  bool: n2,
  bytes: Ep,
  hash: r2,
  exists: s2,
  output: i2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _c = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kn = (t, e) => t << 32 - e | t >>> e, o2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!o2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function a2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ku(t) {
  if (typeof t == "string" && (t = a2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ap = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Vs(t) {
  const e = (r) => t().update(ku(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let vp = class extends Ap {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ys.hash(e);
    const r = ku(n);
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
    return ys.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ys.exists(this), ys.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const $p = (t, e, n) => new vp(t, e).update(n).digest();
$p.create = (t, e) => new vp(t, e);
function c2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Lu = class extends Ap {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _c(this.buffer);
  }
  update(e) {
    ys.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ku(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = _c(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ys.exists(this), ys.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    c2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = _c(e), c = this.outputLen;
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
const l2 = (t, e, n) => t & e ^ ~t & n, u2 = (t, e, n) => t & e ^ t & n ^ e & n, f2 = new Uint32Array([
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
]), _r = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Pr = new Uint32Array(64);
let Ip = class extends Lu {
  constructor() {
    super(64, 32, 8, !1), this.A = _r[0] | 0, this.B = _r[1] | 0, this.C = _r[2] | 0, this.D = _r[3] | 0, this.E = _r[4] | 0, this.F = _r[5] | 0, this.G = _r[6] | 0, this.H = _r[7] | 0;
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
      const g = Pr[l - 15], h = Pr[l - 2], x = Kn(g, 7) ^ Kn(g, 18) ^ g >>> 3, A = Kn(h, 17) ^ Kn(h, 19) ^ h >>> 10;
      Pr[l] = A + Pr[l - 7] + x + Pr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Kn(a, 6) ^ Kn(a, 11) ^ Kn(a, 25), h = d + g + l2(a, c, u) + f2[l] + Pr[l] | 0, A = (Kn(r, 2) ^ Kn(r, 13) ^ Kn(r, 22)) + u2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Pr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, d2 = class extends Ip {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const kp = Vs(() => new Ip());
Vs(() => new d2());
var Xs = {}, Cu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ko;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const x = n.indexOf(o[h]) >> u;
        let A = 0;
        h !== 0 && (A = n.indexOf(o[h - 1]));
        const T = 1 + u, z = A % (1 << T) << 5 - T, K = t.c32[x + z];
        u = T, c.unshift(K);
      } else
        u = 0;
    let d = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let h = 0; h < g; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let x = 0; x < h; x++)
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
    let d = [], l = 0, g = 0;
    for (let A = o.length - 1; A >= 0; A--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const z = (t.c32.indexOf(o[A]) << g) + l, K = n[z % 16];
      if (g += 1, l = z >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(K);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let A = 0; A < d.length && d[A] === "0"; A++)
      h++;
    d = d.slice(h - h % 2);
    let x = d.join("");
    for (let A = 0; A < u; A++)
      x = `00${x}`;
    if (a) {
      const A = a * 2 - x.length;
      for (let T = 0; T < A; T += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(Cu);
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.c32checkDecode = Ts.c32checkEncode = void 0;
const wd = tc, bd = ko, so = Cu;
function Lp(t) {
  const e = (0, wd.sha256)((0, wd.sha256)((0, bd.hexToBytes)(t)));
  return (0, bd.bytesToHex)(e.slice(0, 4));
}
function h2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Lp(`${n}${e}`), s = (0, so.c32encode)(`${e}${r}`);
  return `${so.c32[t]}${s}`;
}
Ts.c32checkEncode = h2;
function p2(t) {
  t = (0, so.c32normalize)(t);
  const e = (0, so.c32decode)(t.slice(1)), n = t[0], r = so.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Lp(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ts.c32checkDecode = p2;
var Cp = {}, Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.decode = Li.encode = void 0;
const Ia = tc, md = ko, Tp = H0, Bp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function g2(t, e = "00") {
  const n = typeof t == "string" ? (0, md.hexToBytes)(t) : t, r = typeof e == "string" ? (0, md.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ia.sha256)((0, Ia.sha256)(new Uint8Array([...r, ...n])));
  return Tp(Bp).encode([...r, ...n, ...s.slice(0, 4)]);
}
Li.encode = g2;
function y2(t) {
  const e = Tp(Bp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ia.sha256)((0, Ia.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Li.decode = y2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ts, n = Li, r = ko;
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
    const g = n.decode(d), h = (0, r.bytesToHex)(g.data), x = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let A;
    return l < 0 ? (A = x, s[x] !== void 0 && (A = s[x])) : A = l, o(A, h);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const g = a(d), h = g[0], x = g[1];
    let A;
    l < 0 ? (A = h, i[h] !== void 0 && (A = i[h])) : A = l;
    let T = A.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(x, T);
  }
  t.c32ToB58 = u;
})(Cp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Cu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ts;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Cp;
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
})(Xs);
function w2(t, e) {
  switch (e = Sp(e ?? xp), t) {
    case pr.P2PKH:
      switch (e.transactionVersion) {
        case gr.Mainnet:
          return Jn.MainnetSingleSig;
        case gr.Testnet:
          return Jn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case pr.P2SH:
    case pr.P2SHNonSequential:
    case pr.P2WPKH:
    case pr.P2WSH:
    case pr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case gr.Mainnet:
          return Jn.MainnetMultiSig;
        case gr.Testnet:
          return Jn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const b2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Mp = Uint8Array.from({ length: 16 }, (t, e) => e), m2 = Mp.map((t) => (9 * t + 5) % 16);
let Tu = [Mp], Bu = [m2];
for (let t = 0; t < 4; t++)
  for (let e of [Tu, Bu])
    e.push(e[t].map((n) => b2[n]));
const Np = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), x2 = Tu.map((t, e) => t.map((n) => Np[e][n])), S2 = Bu.map((t, e) => t.map((n) => Np[e][n])), E2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), A2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ro = (t, e) => t << e | t >>> 32 - e;
function xd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Go = new Uint32Array(16);
let v2 = class extends Lu {
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
      Go[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, A = E2[h], T = A2[h], z = Tu[h], K = Bu[h], E = x2[h], b = S2[h];
      for (let k = 0; k < 16; k++) {
        const O = Ro(r + xd(h, i, a, u) + Go[z[k]] + A, E[k]) + l | 0;
        r = l, l = u, u = Ro(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = Ro(s + xd(x, o, c, d) + Go[K[k]] + T, b[k]) + g | 0;
        s = g, g = d, d = Ro(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Go.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const $2 = Vs(() => new v2()), Ko = BigInt(2 ** 32 - 1), bl = BigInt(32);
function _p(t, e = !1) {
  return e ? { h: Number(t & Ko), l: Number(t >> bl & Ko) } : { h: Number(t >> bl & Ko) | 0, l: Number(t & Ko) | 0 };
}
function I2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = _p(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const k2 = (t, e) => BigInt(t >>> 0) << bl | BigInt(e >>> 0), L2 = (t, e, n) => t >>> n, C2 = (t, e, n) => t << 32 - n | e >>> n, T2 = (t, e, n) => t >>> n | e << 32 - n, B2 = (t, e, n) => t << 32 - n | e >>> n, M2 = (t, e, n) => t << 64 - n | e >>> n - 32, N2 = (t, e, n) => t >>> n - 32 | e << 64 - n, _2 = (t, e) => e, P2 = (t, e) => t, U2 = (t, e, n) => t << n | e >>> 32 - n, H2 = (t, e, n) => e << n | t >>> 32 - n, O2 = (t, e, n) => e << n - 32 | t >>> 64 - n, D2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function F2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const j2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), z2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, R2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), G2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, K2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), V2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, xt = {
  fromBig: _p,
  split: I2,
  toBig: k2,
  shrSH: L2,
  shrSL: C2,
  rotrSH: T2,
  rotrSL: B2,
  rotrBH: M2,
  rotrBL: N2,
  rotr32H: _2,
  rotr32L: P2,
  rotlSH: U2,
  rotlSL: H2,
  rotlBH: O2,
  rotlBL: D2,
  add: F2,
  add3L: j2,
  add3H: z2,
  add4L: R2,
  add4H: G2,
  add5H: V2,
  add5L: K2
}, [X2, q2] = xt.split([
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
].map((t) => BigInt(t))), Ur = new Uint32Array(80), Hr = new Uint32Array(80);
let rc = class extends Lu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: A, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = A | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Ur[E] = e.getUint32(n), Hr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const b = Ur[E - 15] | 0, k = Hr[E - 15] | 0, O = xt.rotrSH(b, k, 1) ^ xt.rotrSH(b, k, 8) ^ xt.shrSH(b, k, 7), R = xt.rotrSL(b, k, 1) ^ xt.rotrSL(b, k, 8) ^ xt.shrSL(b, k, 7), j = Ur[E - 2] | 0, X = Hr[E - 2] | 0, v = xt.rotrSH(j, X, 19) ^ xt.rotrBH(j, X, 61) ^ xt.shrSH(j, X, 6), M = xt.rotrSL(j, X, 19) ^ xt.rotrBL(j, X, 61) ^ xt.shrSL(j, X, 6), N = xt.add4L(R, M, Hr[E - 7], Hr[E - 16]), F = xt.add4H(N, O, v, Ur[E - 7], Ur[E - 16]);
      Ur[E] = F | 0, Hr[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: A, Gl: T, Hh: z, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const b = xt.rotrSH(l, g, 14) ^ xt.rotrSH(l, g, 18) ^ xt.rotrBH(l, g, 41), k = xt.rotrSL(l, g, 14) ^ xt.rotrSL(l, g, 18) ^ xt.rotrBL(l, g, 41), O = l & h ^ ~l & A, R = g & x ^ ~g & T, j = xt.add5L(K, k, R, q2[E], Hr[E]), X = xt.add5H(j, z, b, O, X2[E], Ur[E]), v = j | 0, M = xt.rotrSH(r, s, 28) ^ xt.rotrBH(r, s, 34) ^ xt.rotrBH(r, s, 39), N = xt.rotrSL(r, s, 28) ^ xt.rotrBL(r, s, 34) ^ xt.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      z = A | 0, K = T | 0, A = h | 0, T = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = xt.add(u | 0, d | 0, X | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const V = xt.add3L(v, N, Y);
      r = xt.add3H(V, X, M, F), s = V | 0;
    }
    ({ h: r, l: s } = xt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = xt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = xt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = xt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = xt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = xt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: A, l: T } = xt.add(this.Gh | 0, this.Gl | 0, A | 0, T | 0), { h: z, l: K } = xt.add(this.Hh | 0, this.Hl | 0, z | 0, K | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, x, A, T, z, K);
  }
  roundClean() {
    Ur.fill(0), Hr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, W2 = class extends rc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Y2 = class extends rc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Z2 = class extends rc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Vs(() => new rc());
Vs(() => new W2());
Vs(() => new Y2());
Vs(() => new Z2());
var ka = { exports: {} };
ka.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", x = "[object Object]", A = "[object Promise]", T = "[object RegExp]", z = "[object Set]", K = "[object String]", E = "[object Symbol]", b = "[object WeakMap]", k = "[object ArrayBuffer]", O = "[object DataView]", R = "[object Float32Array]", j = "[object Float64Array]", X = "[object Int8Array]", v = "[object Int16Array]", M = "[object Int32Array]", N = "[object Uint8Array]", F = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", V = "[object Uint32Array]", jt = /[\\^$.*+?()[\]{}|]/g, dt = /\w*$/, Te = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, P = {};
  P[i] = P[o] = P[k] = P[O] = P[a] = P[c] = P[R] = P[j] = P[X] = P[v] = P[M] = P[g] = P[h] = P[x] = P[T] = P[z] = P[K] = P[E] = P[N] = P[F] = P[Y] = P[V] = !0, P[u] = P[d] = P[b] = !1;
  var ut = typeof We == "object" && We && We.Object === Object && We, vt = typeof self == "object" && self && self.Object === Object && self, Lt = ut || vt || Function("return this")(), zt = e && !e.nodeType && e, re = zt && !0 && t && !t.nodeType && t, Ut = re && re.exports === zt;
  function Wt(p, C) {
    return p.set(C[0], C[1]), p;
  }
  function me(p, C) {
    return p.add(C), p;
  }
  function Re(p, C) {
    for (var _ = -1, rt = p ? p.length : 0; ++_ < rt && C(p[_], _, p) !== !1; )
      ;
    return p;
  }
  function Ht(p, C) {
    for (var _ = -1, rt = C.length, Pe = p.length; ++_ < rt; )
      p[Pe + _] = C[_];
    return p;
  }
  function Ze(p, C, _, rt) {
    for (var Pe = -1, tn = p ? p.length : 0; ++Pe < tn; )
      _ = C(_, p[Pe], Pe, p);
    return _;
  }
  function Ie(p, C) {
    for (var _ = -1, rt = Array(p); ++_ < p; )
      rt[_] = C(_);
    return rt;
  }
  function Ge(p, C) {
    return p == null ? void 0 : p[C];
  }
  function xn(p) {
    var C = !1;
    if (p != null && typeof p.toString != "function")
      try {
        C = !!(p + "");
      } catch {
      }
    return C;
  }
  function Ne(p) {
    var C = -1, _ = Array(p.size);
    return p.forEach(function(rt, Pe) {
      _[++C] = [Pe, rt];
    }), _;
  }
  function Oe(p, C) {
    return function(_) {
      return p(C(_));
    };
  }
  function ke(p) {
    var C = -1, _ = Array(p.size);
    return p.forEach(function(rt) {
      _[++C] = rt;
    }), _;
  }
  var Yt = Array.prototype, ln = Function.prototype, Qe = Object.prototype, De = Lt["__core-js_shared__"], ie = function() {
    var p = /[^.]+$/.exec(De && De.keys && De.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), Zt = ln.toString, le = Qe.hasOwnProperty, Be = Qe.toString, te = RegExp(
    "^" + Zt.call(le).replace(jt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ke = Ut ? Lt.Buffer : void 0, Rt = Lt.Symbol, Fe = Lt.Uint8Array, y = Oe(Object.getPrototypeOf, Object), S = Object.create, f = Qe.propertyIsEnumerable, G = Yt.splice, m = Object.getOwnPropertySymbols, L = Ke ? Ke.isBuffer : void 0, B = Oe(Object.keys, Object), H = D(Lt, "DataView"), Q = D(Lt, "Map"), ot = D(Lt, "Promise"), _t = D(Lt, "Set"), wt = D(Lt, "WeakMap"), Xt = D(Object, "create"), ue = Se(H), Gt = Se(Q), xe = Se(ot), Ct = Se(_t), Z = Se(wt), at = Rt ? Rt.prototype : void 0, yt = at ? at.valueOf : void 0;
  function Tt(p) {
    var C = -1, _ = p ? p.length : 0;
    for (this.clear(); ++C < _; ) {
      var rt = p[C];
      this.set(rt[0], rt[1]);
    }
  }
  function ft() {
    this.__data__ = Xt ? Xt(null) : {};
  }
  function fe(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function Mt(p) {
    var C = this.__data__;
    if (Xt) {
      var _ = C[p];
      return _ === r ? void 0 : _;
    }
    return le.call(C, p) ? C[p] : void 0;
  }
  function Dt(p) {
    var C = this.__data__;
    return Xt ? C[p] !== void 0 : le.call(C, p);
  }
  function ee(p, C) {
    var _ = this.__data__;
    return _[p] = Xt && C === void 0 ? r : C, this;
  }
  Tt.prototype.clear = ft, Tt.prototype.delete = fe, Tt.prototype.get = Mt, Tt.prototype.has = Dt, Tt.prototype.set = ee;
  function Ot(p) {
    var C = -1, _ = p ? p.length : 0;
    for (this.clear(); ++C < _; ) {
      var rt = p[C];
      this.set(rt[0], rt[1]);
    }
  }
  function Je() {
    this.__data__ = [];
  }
  function $e(p) {
    var C = this.__data__, _ = zn(C, p);
    if (_ < 0)
      return !1;
    var rt = C.length - 1;
    return _ == rt ? C.pop() : G.call(C, _, 1), !0;
  }
  function Cn(p) {
    var C = this.__data__, _ = zn(C, p);
    return _ < 0 ? void 0 : C[_][1];
  }
  function Fn(p) {
    return zn(this.__data__, p) > -1;
  }
  function Sr(p, C) {
    var _ = this.__data__, rt = zn(_, p);
    return rt < 0 ? _.push([p, C]) : _[rt][1] = C, this;
  }
  Ot.prototype.clear = Je, Ot.prototype.delete = $e, Ot.prototype.get = Cn, Ot.prototype.has = Fn, Ot.prototype.set = Sr;
  function jn(p) {
    var C = -1, _ = p ? p.length : 0;
    for (this.clear(); ++C < _; ) {
      var rt = p[C];
      this.set(rt[0], rt[1]);
    }
  }
  function Qs() {
    this.__data__ = {
      hash: new Tt(),
      map: new (Q || Ot)(),
      string: new Tt()
    };
  }
  function Js(p) {
    return $(this, p).delete(p);
  }
  function ti(p) {
    return $(this, p).get(p);
  }
  function Sn(p) {
    return $(this, p).has(p);
  }
  function ei(p, C) {
    return $(this, p).set(p, C), this;
  }
  jn.prototype.clear = Qs, jn.prototype.delete = Js, jn.prototype.get = ti, jn.prototype.has = Sn, jn.prototype.set = ei;
  function En(p) {
    this.__data__ = new Ot(p);
  }
  function ni() {
    this.__data__ = new Ot();
  }
  function Er(p) {
    return this.__data__.delete(p);
  }
  function Ar(p) {
    return this.__data__.get(p);
  }
  function vr(p) {
    return this.__data__.has(p);
  }
  function $r(p, C) {
    var _ = this.__data__;
    if (_ instanceof Ot) {
      var rt = _.__data__;
      if (!Q || rt.length < n - 1)
        return rt.push([p, C]), this;
      _ = this.__data__ = new jn(rt);
    }
    return _.set(p, C), this;
  }
  En.prototype.clear = ni, En.prototype.delete = Er, En.prototype.get = Ar, En.prototype.has = vr, En.prototype.set = $r;
  function ls(p, C) {
    var _ = vc(p) || Vy(p) ? Ie(p.length, String) : [], rt = _.length, Pe = !!rt;
    for (var tn in p)
      le.call(p, tn) && !(Pe && (tn == "length" || gt(tn, rt))) && _.push(tn);
    return _;
  }
  function ar(p, C, _) {
    var rt = p[C];
    (!(le.call(p, C) && Xi(rt, _)) || _ === void 0 && !(C in p)) && (p[C] = _);
  }
  function zn(p, C) {
    for (var _ = p.length; _--; )
      if (Xi(p[_][0], C))
        return _;
    return -1;
  }
  function q(p, C) {
    return p && si(C, $c(C), p);
  }
  function nt(p, C, _, rt, Pe, tn, cr) {
    var en;
    if (rt && (en = tn ? rt(p, Pe, tn, cr) : rt(p)), en !== void 0)
      return en;
    if (!Bo(p))
      return p;
    var vf = vc(p);
    if (vf) {
      if (en = U(p), !C)
        return Ec(p, en);
    } else {
      var ii = ct(p), $f = ii == d || ii == l;
      if (qy(p))
        return Gi(p, C);
      if (ii == x || ii == i || $f && !tn) {
        if (xn(p))
          return tn ? p : {};
        if (en = ht($f ? {} : p), !C)
          return Ac(p, q(en, p));
      } else {
        if (!P[ii])
          return tn ? p : {};
        en = pt(p, ii, nt, C);
      }
    }
    cr || (cr = new En());
    var If = cr.get(p);
    if (If)
      return If;
    if (cr.set(p, en), !vf)
      var kf = _ ? w(p) : $c(p);
    return Re(kf || p, function(Ic, Mo) {
      kf && (Mo = Ic, Ic = p[Mo]), ar(en, Mo, nt(Ic, C, _, rt, Mo, p, cr));
    }), en;
  }
  function de(p) {
    return Bo(p) ? S(p) : {};
  }
  function Le(p, C, _) {
    var rt = C(p);
    return vc(p) ? rt : Ht(rt, _(p));
  }
  function us(p) {
    return Be.call(p);
  }
  function Ir(p) {
    if (!Bo(p) || _e(p))
      return !1;
    var C = Af(p) || xn(p) ? te : Te;
    return C.test(Se(p));
  }
  function se(p) {
    if (!un(p))
      return B(p);
    var C = [];
    for (var _ in Object(p))
      le.call(p, _) && _ != "constructor" && C.push(_);
    return C;
  }
  function Gi(p, C) {
    if (C)
      return p.slice();
    var _ = new p.constructor(p.length);
    return p.copy(_), _;
  }
  function fs(p) {
    var C = new p.constructor(p.byteLength);
    return new Fe(C).set(new Fe(p)), C;
  }
  function Tn(p, C) {
    var _ = C ? fs(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.byteLength);
  }
  function Ki(p, C, _) {
    var rt = C ? _(Ne(p), !0) : Ne(p);
    return Ze(rt, Wt, new p.constructor());
  }
  function ri(p) {
    var C = new p.constructor(p.source, dt.exec(p));
    return C.lastIndex = p.lastIndex, C;
  }
  function xc(p, C, _) {
    var rt = C ? _(ke(p), !0) : ke(p);
    return Ze(rt, me, new p.constructor());
  }
  function Vi(p) {
    return yt ? Object(yt.call(p)) : {};
  }
  function Sc(p, C) {
    var _ = C ? fs(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.length);
  }
  function Ec(p, C) {
    var _ = -1, rt = p.length;
    for (C || (C = Array(rt)); ++_ < rt; )
      C[_] = p[_];
    return C;
  }
  function si(p, C, _, rt) {
    _ || (_ = {});
    for (var Pe = -1, tn = C.length; ++Pe < tn; ) {
      var cr = C[Pe], en = void 0;
      ar(_, cr, en === void 0 ? p[cr] : en);
    }
    return _;
  }
  function Ac(p, C) {
    return si(p, J(p), C);
  }
  function w(p) {
    return Le(p, $c, J);
  }
  function $(p, C) {
    var _ = p.__data__;
    return Kt(C) ? _[typeof C == "string" ? "string" : "hash"] : _.map;
  }
  function D(p, C) {
    var _ = Ge(p, C);
    return Ir(_) ? _ : void 0;
  }
  var J = m ? Oe(m, Object) : Zy, ct = us;
  (H && ct(new H(new ArrayBuffer(1))) != O || Q && ct(new Q()) != g || ot && ct(ot.resolve()) != A || _t && ct(new _t()) != z || wt && ct(new wt()) != b) && (ct = function(p) {
    var C = Be.call(p), _ = C == x ? p.constructor : void 0, rt = _ ? Se(_) : void 0;
    if (rt)
      switch (rt) {
        case ue:
          return O;
        case Gt:
          return g;
        case xe:
          return A;
        case Ct:
          return z;
        case Z:
          return b;
      }
    return C;
  });
  function U(p) {
    var C = p.length, _ = p.constructor(C);
    return C && typeof p[0] == "string" && le.call(p, "index") && (_.index = p.index, _.input = p.input), _;
  }
  function ht(p) {
    return typeof p.constructor == "function" && !un(p) ? de(y(p)) : {};
  }
  function pt(p, C, _, rt) {
    var Pe = p.constructor;
    switch (C) {
      case k:
        return fs(p);
      case a:
      case c:
        return new Pe(+p);
      case O:
        return Tn(p, rt);
      case R:
      case j:
      case X:
      case v:
      case M:
      case N:
      case F:
      case Y:
      case V:
        return Sc(p, rt);
      case g:
        return Ki(p, rt, _);
      case h:
      case K:
        return new Pe(p);
      case T:
        return ri(p);
      case z:
        return xc(p, rt, _);
      case E:
        return Vi(p);
    }
  }
  function gt(p, C) {
    return C = C ?? s, !!C && (typeof p == "number" || I.test(p)) && p > -1 && p % 1 == 0 && p < C;
  }
  function Kt(p) {
    var C = typeof p;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? p !== "__proto__" : p === null;
  }
  function _e(p) {
    return !!ie && ie in p;
  }
  function un(p) {
    var C = p && p.constructor, _ = typeof C == "function" && C.prototype || Qe;
    return p === _;
  }
  function Se(p) {
    if (p != null) {
      try {
        return Zt.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function Rn(p) {
    return nt(p, !0, !0);
  }
  function Xi(p, C) {
    return p === C || p !== p && C !== C;
  }
  function Vy(p) {
    return Xy(p) && le.call(p, "callee") && (!f.call(p, "callee") || Be.call(p) == i);
  }
  var vc = Array.isArray;
  function Ef(p) {
    return p != null && Wy(p.length) && !Af(p);
  }
  function Xy(p) {
    return Yy(p) && Ef(p);
  }
  var qy = L || Qy;
  function Af(p) {
    var C = Bo(p) ? Be.call(p) : "";
    return C == d || C == l;
  }
  function Wy(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function Bo(p) {
    var C = typeof p;
    return !!p && (C == "object" || C == "function");
  }
  function Yy(p) {
    return !!p && typeof p == "object";
  }
  function $c(p) {
    return Ef(p) ? ls(p) : se(p);
  }
  function Zy() {
    return [];
  }
  function Qy() {
    return !1;
  }
  t.exports = Rn;
})(ka, ka.exports);
var Q2 = ka.exports;
const Pp = /* @__PURE__ */ a0(Q2);
var ml;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ml || (ml = {}));
function J2(t, e) {
  return { type: ml.Address, version: t, hash160: e };
}
function tx(t) {
  return Xs.c32address(t.version, t.hash160);
}
const ex = (t) => $2(kp(t)), nx = (t) => lt(ex(t));
be.hmacSha256Sync = (t, ...e) => {
  const n = $p.create(kp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function rx(t, e = "mainnet") {
  e = Sp(e), t = typeof t == "string" ? Pt(t) : t;
  const n = w2(pr.P2PKH, e), r = J2(n, nx(t));
  return tx(r);
}
function sx(t, e) {
  const n = He.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = rx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new He.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function ix(t, e = null) {
  let n;
  e ? n = sx(t, e) : n = He.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Sd = "_blockstackDidCheckEchoReply", ox = "echoReply", ax = "authContinuation";
function cx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function lx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Sd];
  if (typeof e == "boolean")
    return e;
  const n = cx(t.location.search), r = n[ox];
  if (r) {
    t[Sd] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[ax];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class xl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new y0();
    else
      throw new Lw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new nd(e.sessionOptions) : this.store = new nd() : e ? this.store = new ed(e.sessionOptions) : this.store = new ed();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Tw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ol("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, q1(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = X1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = fu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (lx())
        return di.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      di.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Jw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new No("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = He.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await J1(e))
      throw new No("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Lc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Jf(s, i.private_key);
          } catch {
            if (di.warn("Failed decryption of appPrivateKey, will try to use as given"), !be.isValidPrivateKey(i.private_key))
              throw new No("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Jf(s, c);
          } catch {
            di.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new No("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = zw, d;
    Lc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Lc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: bp(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = i.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, $w);
      else {
        const x = await h.text(), A = JSON.parse(x);
        l.profile = ix(A[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ol("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), zm(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Rm(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
xl.prototype.makeAuthRequest = xl.prototype.makeAuthRequestToken;
const ux = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], fx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ux(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!sc(r.id));
  return e.concat(n);
}, sc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Up = "STX_PROVIDER", Bs = () => typeof window > "u" ? null : window.localStorage.getItem(Up), dx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Up, t);
}, hx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function px(t, e) {
  const n = {};
  return Object.assign(n, hx, e), await fetch(t, n);
}
function gx(t) {
  let e = px, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function yx(...t) {
  const { fetchLib: e, middlewares: n } = gx(t);
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
var Ci;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ci || (Ci = {}));
var Ms;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ms || (Ms = {}));
var Ed;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ed || (Ed = {}));
const wx = "https://api.mainnet.hiro.so", bx = "https://api.testnet.hiro.so", mx = "http://localhost:3999", xx = ["mainnet", "testnet", "devnet", "mocknet"];
class Ns {
  constructor(e) {
    this.version = Ms.Mainnet, this.chainId = Ci.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ms.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? yx();
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
Ns.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Sl();
    case "testnet":
      return new El();
    case "devnet":
      return new Sx();
    case "mocknet":
      return new Hp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${xx.join(", ")}`);
  }
};
Ns.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ns.fromName(t);
class Sl extends Ns {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? wx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Mainnet, this.chainId = Ci.Mainnet;
  }
}
class El extends Ns {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? bx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Testnet, this.chainId = Ci.Testnet;
  }
}
class Hp extends Ns {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? mx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Testnet, this.chainId = Ci.Testnet;
  }
}
const Sx = Hp;
var _s;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(_s || (_s = {}));
var La;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(La || (La = {}));
_s.Mainnet;
var Ps;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ps || (Ps = {}));
var Us;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Us || (Us = {}));
Ps.Mainnet;
const Ex = {
  chainId: _s.Mainnet,
  transactionVersion: Ps.Mainnet,
  peerNetworkId: La.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Us.MainnetSingleSig,
    multiSig: Us.MainnetMultiSig
  },
  client: { baseUrl: h0 }
}, Al = {
  chainId: _s.Testnet,
  transactionVersion: Ps.Testnet,
  peerNetworkId: La.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Us.TestnetSingleSig,
    multiSig: Us.TestnetMultiSig
  },
  client: { baseUrl: p0 }
}, da = {
  ...Al,
  addressVersion: { ...Al.addressVersion },
  magicBytes: "id",
  client: { baseUrl: g0 }
}, Ax = {
  ...da,
  addressVersion: { ...da.addressVersion },
  client: { ...da.client }
};
function vx(t) {
  switch (t) {
    case "mainnet":
      return Ex;
    case "testnet":
      return Al;
    case "devnet":
      return da;
    case "mocknet":
      return Ax;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function $x(t) {
  return typeof t == "string" ? vx(t) : t;
}
function Ix(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ad = /* @__PURE__ */ new Map();
function Op(t, e) {
  const n = Ad.get(t);
  if (n !== void 0)
    return n(e);
  const r = Ix(t);
  return Ad.set(t, r), Op(t, e);
}
let ne = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Pt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Ww(this.readBytes(4), 0);
  }
  readUInt8() {
    return Xw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Kw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = lt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = lt(n);
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
    if (Op(e, r))
      return r;
    throw n(r);
  }
};
const kx = 128, Lx = 128, Dp = 16, Es = 32, vl = 80, ic = 65, Cx = 32, Tx = 64, Ca = 34, Bx = 1 + 16 * 1024 * 1024, Mx = 165, Nx = 16, _x = 16, Px = 20, Ux = _x + 2 + Px, Hx = Ux + 4, Ox = Bx + (Mx + Nx * Hx);
var Vt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Vt || (Vt = {}));
var $l;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})($l || ($l = {}));
var dn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(dn || (dn = {}));
const Pc = ["onChainOnly", "offChainOnly", "any"];
Pc[0] + "", dn.OnChainOnly, Pc[1] + "", dn.OffChainOnly, Pc[2] + "", dn.Any, dn.OnChainOnly + "", dn.OnChainOnly, dn.OffChainOnly + "", dn.OffChainOnly, dn.Any + "", dn.Any;
var Ta;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ta || (Ta = {}));
var oe;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(oe || (oe = {}));
var ye;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ye || (ye = {}));
var Qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Qt || (Qt = {}));
var pe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pe || (pe = {}));
var io;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(io || (io = {}));
var Il;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Il || (Il = {}));
var kl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(kl || (kl = {}));
var qe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qe || (qe = {}));
var vd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vd || (vd = {}));
var Ll;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ll || (Ll = {}));
var Pn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Pn || (Pn = {}));
var $d;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})($d || ($d = {}));
let oc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, hi = class extends oc {
  constructor(e) {
    super(e);
  }
}, Ve = class extends oc {
  constructor(e) {
    super(e);
  }
}, Ba = class extends oc {
  constructor(e) {
    super(e);
  }
}, ws = class extends oc {
  constructor(e) {
    super(e);
  }
};
function Cl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Dx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Fp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Fx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Cl(t.outputLen), Cl(t.blockLen);
}
function jx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function zx(t, e) {
  Fp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bs = {
  number: Cl,
  bool: Dx,
  bytes: Fp,
  hash: Fx,
  exists: jx,
  output: zx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Uc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vn = (t, e) => t << 32 - e | t >>> e, Rx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Rx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Gx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mu(t) {
  if (typeof t == "string" && (t = Gx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let jp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function qs(t) {
  const e = (r) => t().update(Mu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let zp = class extends jp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, bs.hash(e);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Rp = (t, e, n) => new zp(t, e).update(n).digest();
Rp.create = (t, e) => new zp(t, e);
function Kx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Nu = class extends jp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Uc(this.buffer);
  }
  update(e) {
    bs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Mu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Uc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bs.exists(this), bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Kx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Uc(e), c = this.outputLen;
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
const Vx = (t, e, n) => t & e ^ ~t & n, Xx = (t, e, n) => t & e ^ t & n ^ e & n, qx = new Uint32Array([
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
]), Or = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Dr = new Uint32Array(64);
let Gp = class extends Nu {
  constructor() {
    super(64, 32, 8, !1), this.A = Or[0] | 0, this.B = Or[1] | 0, this.C = Or[2] | 0, this.D = Or[3] | 0, this.E = Or[4] | 0, this.F = Or[5] | 0, this.G = Or[6] | 0, this.H = Or[7] | 0;
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
      const g = Dr[l - 15], h = Dr[l - 2], x = Vn(g, 7) ^ Vn(g, 18) ^ g >>> 3, A = Vn(h, 17) ^ Vn(h, 19) ^ h >>> 10;
      Dr[l] = A + Dr[l - 7] + x + Dr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Vn(a, 6) ^ Vn(a, 11) ^ Vn(a, 25), h = d + g + Vx(a, c, u) + qx[l] + Dr[l] | 0, A = (Vn(r, 2) ^ Vn(r, 13) ^ Vn(r, 22)) + Xx(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Dr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Wx = class extends Gp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const _u = qs(() => new Gp());
qs(() => new Wx());
const Yx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Kp = Uint8Array.from({ length: 16 }, (t, e) => e), Zx = Kp.map((t) => (9 * t + 5) % 16);
let Pu = [Kp], Uu = [Zx];
for (let t = 0; t < 4; t++)
  for (let e of [Pu, Uu])
    e.push(e[t].map((n) => Yx[n]));
const Vp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Qx = Pu.map((t, e) => t.map((n) => Vp[e][n])), Jx = Uu.map((t, e) => t.map((n) => Vp[e][n])), tS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), eS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vo = (t, e) => t << e | t >>> 32 - e;
function Id(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xo = new Uint32Array(16);
let nS = class extends Nu {
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
      Xo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, A = tS[h], T = eS[h], z = Pu[h], K = Uu[h], E = Qx[h], b = Jx[h];
      for (let k = 0; k < 16; k++) {
        const O = Vo(r + Id(h, i, a, u) + Xo[z[k]] + A, E[k]) + l | 0;
        r = l, l = u, u = Vo(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = Vo(s + Id(x, o, c, d) + Xo[K[k]] + T, b[k]) + g | 0;
        s = g, g = d, d = Vo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Xo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const rS = qs(() => new nS()), qo = BigInt(2 ** 32 - 1), Tl = BigInt(32);
function Xp(t, e = !1) {
  return e ? { h: Number(t & qo), l: Number(t >> Tl & qo) } : { h: Number(t >> Tl & qo) | 0, l: Number(t & qo) | 0 };
}
function sS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Xp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const iS = (t, e) => BigInt(t >>> 0) << Tl | BigInt(e >>> 0), oS = (t, e, n) => t >>> n, aS = (t, e, n) => t << 32 - n | e >>> n, cS = (t, e, n) => t >>> n | e << 32 - n, lS = (t, e, n) => t << 32 - n | e >>> n, uS = (t, e, n) => t << 64 - n | e >>> n - 32, fS = (t, e, n) => t >>> n - 32 | e << 64 - n, dS = (t, e) => e, hS = (t, e) => t, pS = (t, e, n) => t << n | e >>> 32 - n, gS = (t, e, n) => e << n | t >>> 32 - n, yS = (t, e, n) => e << n - 32 | t >>> 64 - n, wS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function bS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const mS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), xS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, SS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ES = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, AS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), vS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, St = {
  fromBig: Xp,
  split: sS,
  toBig: iS,
  shrSH: oS,
  shrSL: aS,
  rotrSH: cS,
  rotrSL: lS,
  rotrBH: uS,
  rotrBL: fS,
  rotr32H: dS,
  rotr32L: hS,
  rotlSH: pS,
  rotlSL: gS,
  rotlBH: yS,
  rotlBL: wS,
  add: bS,
  add3L: mS,
  add3H: xS,
  add4L: SS,
  add4H: ES,
  add5H: vS,
  add5L: AS
}, [$S, IS] = St.split([
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
].map((t) => BigInt(t))), Fr = new Uint32Array(80), jr = new Uint32Array(80);
let ac = class extends Nu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: A, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = A | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Fr[E] = e.getUint32(n), jr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const b = Fr[E - 15] | 0, k = jr[E - 15] | 0, O = St.rotrSH(b, k, 1) ^ St.rotrSH(b, k, 8) ^ St.shrSH(b, k, 7), R = St.rotrSL(b, k, 1) ^ St.rotrSL(b, k, 8) ^ St.shrSL(b, k, 7), j = Fr[E - 2] | 0, X = jr[E - 2] | 0, v = St.rotrSH(j, X, 19) ^ St.rotrBH(j, X, 61) ^ St.shrSH(j, X, 6), M = St.rotrSL(j, X, 19) ^ St.rotrBL(j, X, 61) ^ St.shrSL(j, X, 6), N = St.add4L(R, M, jr[E - 7], jr[E - 16]), F = St.add4H(N, O, v, Fr[E - 7], Fr[E - 16]);
      Fr[E] = F | 0, jr[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: A, Gl: T, Hh: z, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const b = St.rotrSH(l, g, 14) ^ St.rotrSH(l, g, 18) ^ St.rotrBH(l, g, 41), k = St.rotrSL(l, g, 14) ^ St.rotrSL(l, g, 18) ^ St.rotrBL(l, g, 41), O = l & h ^ ~l & A, R = g & x ^ ~g & T, j = St.add5L(K, k, R, IS[E], jr[E]), X = St.add5H(j, z, b, O, $S[E], Fr[E]), v = j | 0, M = St.rotrSH(r, s, 28) ^ St.rotrBH(r, s, 34) ^ St.rotrBH(r, s, 39), N = St.rotrSL(r, s, 28) ^ St.rotrBL(r, s, 34) ^ St.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      z = A | 0, K = T | 0, A = h | 0, T = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = St.add(u | 0, d | 0, X | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const V = St.add3L(v, N, Y);
      r = St.add3H(V, X, M, F), s = V | 0;
    }
    ({ h: r, l: s } = St.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = St.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = St.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = St.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = St.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = St.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: A, l: T } = St.add(this.Gh | 0, this.Gl | 0, A | 0, T | 0), { h: z, l: K } = St.add(this.Hh | 0, this.Hl | 0, z | 0, K | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, x, A, T, z, K);
  }
  roundClean() {
    Fr.fill(0), jr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, kS = class extends ac {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, LS = class extends ac {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, CS = class extends ac {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
qs(() => new ac());
qs(() => new kS());
const TS = qs(() => new LS());
qs(() => new CS());
var Bt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Bt || (Bt = {}));
var Ce;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ce || (Ce = {}));
function Hu(t) {
  return Ce[t];
}
const BS = () => ({ type: Bt.BoolTrue }), MS = () => ({ type: Bt.BoolFalse }), NS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Bt.Buffer, value: lt(t) };
}, kd = BigInt("0xffffffffffffffffffffffffffffffff"), _S = BigInt(0), Ld = BigInt("0x7fffffffffffffffffffffffffffffff"), Cd = BigInt("-170141183460469231731687303715884105728"), PS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = cl(Pt(t))), cn(t, Uint8Array) && (t = cl(t));
  const e = ze(t);
  if (e > Ld)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ld}`);
  if (e < Cd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Cd}`);
  return { type: Bt.Int, value: e };
}, US = (t) => {
  const e = ze(t);
  if (e < _S)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > kd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${kd}`);
  return { type: Bt.UInt, value: e };
};
function HS(t) {
  return { type: Bt.List, value: t };
}
function qp() {
  return { type: Bt.OptionalNone };
}
function Wp(t) {
  return { type: Bt.OptionalSome, value: t };
}
var et;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(et || (et = {}));
function OS() {
  return {
    type: et.Address,
    version: Us.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Td(t) {
  if (t && sg(t, Ca))
    throw new Error(`Memo exceeds maximum length of ${Ca} bytes`);
  return { type: et.MemoString, content: t };
}
function Ou(t, e) {
  return {
    type: et.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Bl(t) {
  if (Pt(t).byteLength != ic)
    throw Error("Invalid signature");
  return {
    type: et.MessageSignature,
    data: t
  };
}
function DS(t, e, n) {
  return typeof t == "string" && (t = e3(t)), typeof n == "string" && (n = Td(n)), {
    type: et.Payload,
    payloadType: Vt.TokenTransfer,
    recipient: t,
    amount: ze(e),
    memo: n ?? Td("")
  };
}
function FS(t, e, n, r) {
  return typeof e == "string" && (e = On(e)), typeof n == "string" && (n = On(n)), {
    type: et.Payload,
    payloadType: Vt.ContractCall,
    contractAddress: typeof t == "string" ? as(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function jS(t) {
  return On(t, 4, 1e5);
}
function Bd(t, e, n) {
  return typeof t == "string" && (t = On(t)), typeof e == "string" && (e = jS(e)), typeof n == "number" ? {
    type: et.Payload,
    payloadType: Vt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: et.Payload,
    payloadType: Vt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function zS() {
  return { type: et.Payload, payloadType: Vt.PoisonMicroblock };
}
function Md(t, e) {
  if (t.byteLength != Es)
    throw Error(`Coinbase buffer size must be ${Es} bytes`);
  return e != null ? {
    type: et.Payload,
    payloadType: Vt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: et.Payload,
    payloadType: Vt.Coinbase,
    coinbaseBytes: t
  };
}
function RS(t, e, n) {
  if (t.byteLength != Es)
    throw Error(`Coinbase buffer size must be ${Es} bytes`);
  if (n.byteLength != vl)
    throw Error(`VRF proof buffer size must be ${vl} bytes`);
  return {
    type: et.Payload,
    payloadType: Vt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Bt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function GS(t, e, n, r, s, i, o) {
  return {
    type: et.Payload,
    payloadType: Vt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function On(t, e, n) {
  const r = e || 1, s = n || kx;
  if (sg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: et.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function KS(t, e, n) {
  return {
    type: et.Asset,
    address: as(t),
    contractName: On(e),
    assetName: On(n)
  };
}
function as(t) {
  const e = Xs.c32addressDecode(t);
  return {
    type: et.Address,
    version: e[0],
    hash160: e[1]
  };
}
function VS(t, e) {
  const n = as(t), r = On(e);
  return {
    type: et.Principal,
    prefix: qe.Contract,
    address: n,
    contractName: r
  };
}
function XS(t) {
  const e = as(t);
  return {
    type: et.Principal,
    prefix: qe.Standard,
    address: e
  };
}
function pi(t, e) {
  return {
    pubKeyEncoding: t,
    type: et.TransactionAuthField,
    contents: e
  };
}
function dr(t) {
  switch (t.type) {
    case et.Address:
      return Lo(t);
    case et.Principal:
      return Yp(t);
    case et.LengthPrefixedString:
      return Bi(t);
    case et.MemoString:
      return WS(t);
    case et.Asset:
      return Qp(t);
    case et.PostCondition:
      return tg(t);
    case et.PublicKey:
      return _l(t);
    case et.LengthPrefixedList:
      return Du(t);
    case et.Payload:
      return eg(t);
    case et.TransactionAuthField:
      return t3(t);
    case et.MessageSignature:
      return Fu(t);
  }
}
function Lo(t) {
  const e = [];
  return e.push(Pt(Eo(t.version, 1))), e.push(Pt(t.hash160)), Ae(e);
}
function Ti(t) {
  const e = cn(t, ne) ? t : new ne(t), n = Va(lt(e.readBytes(1))), r = lt(e.readBytes(20));
  return { type: et.Address, version: n, hash160: r };
}
function Yp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === qe.Standard || t.prefix === qe.Contract) && e.push(Lo(t.address)), t.prefix === qe.Contract && e.push(Bi(t.contractName)), Ae(e);
}
function qS(t) {
  const e = cn(t, ne) ? t : new ne(t), n = e.readUInt8Enum(qe, (i) => {
    throw new Ve(`Unexpected Principal payload type: ${i}`);
  });
  if (n === qe.Origin)
    return { type: et.Principal, prefix: n };
  const r = Ti(e);
  if (n === qe.Standard)
    return { type: et.Principal, prefix: n, address: r };
  const s = In(e);
  return {
    type: et.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Bi(t) {
  const e = [], n = Rs(t.content), r = n.byteLength;
  return e.push(Pt(Eo(r, t.lengthPrefixBytes))), e.push(n), Ae(e);
}
function In(t, e, n) {
  e = e || 1;
  const r = cn(t, ne) ? t : new ne(t), s = Va(lt(r.readBytes(e))), i = Ao(r.readBytes(s));
  return On(i, e, n ?? 128);
}
function WS(t) {
  const e = [], n = Rs(t.content), r = A3(lt(n), Ca * 2);
  return e.push(Pt(r)), Ae(e);
}
function Zp(t) {
  const e = cn(t, ne) ? t : new ne(t);
  let n = Ao(e.readBytes(Ca));
  return n = n.replace(/\u0000*$/, ""), { type: et.MemoString, content: n };
}
function Qp(t) {
  const e = [];
  return e.push(Lo(t.address)), e.push(Bi(t.contractName)), e.push(Bi(t.assetName)), Ae(e);
}
function Ml(t) {
  const e = cn(t, ne) ? t : new ne(t);
  return {
    type: et.Asset,
    address: Ti(e),
    contractName: In(e),
    assetName: In(e)
  };
}
function Du(t) {
  const e = t.values, n = [];
  n.push(Pt(Eo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(dr(r));
  return Ae(n);
}
function Jp(t, e, n) {
  const r = cn(t, ne) ? t : new ne(t), s = Va(lt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case et.Address:
        i.push(Ti(r));
        break;
      case et.LengthPrefixedString:
        i.push(In(r));
        break;
      case et.MemoString:
        i.push(Zp(r));
        break;
      case et.Asset:
        i.push(Ml(r));
        break;
      case et.PostCondition:
        i.push(ZS(r));
        break;
      case et.PublicKey:
        i.push(Pl(r));
        break;
      case et.TransactionAuthField:
        i.push(JS(r));
        break;
    }
  return Ou(i, n);
}
function YS(t) {
  return lt(tg(t));
}
function tg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Yp(t.principal)), (t.conditionType === oe.Fungible || t.conditionType === oe.NonFungible) && e.push(Qp(t.asset)), t.conditionType === oe.NonFungible && e.push(tr(t.assetName)), e.push(t.conditionCode), t.conditionType === oe.STX || t.conditionType === oe.Fungible || t.conditionType === oe.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new hi("The post-condition amount may not be larger than 8 bytes");
    e.push(is(t.amount, 8));
  }
  return Ae(e);
}
function ZS(t) {
  const e = cn(t, ne) ? t : new ne(t), n = e.readUInt8Enum(oe, (a) => {
    throw new Ve(`Could not read ${a} as PostConditionType`);
  }), r = qS(e);
  let s, i, o;
  switch (n) {
    case oe.STX:
      return s = e.readUInt8Enum(io, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: oe.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case oe.Fungible:
      return i = Ml(e), s = e.readUInt8Enum(io, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: oe.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case oe.NonFungible:
      i = Ml(e);
      const a = Zn(e);
      return s = e.readUInt8Enum(Il, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: et.PostCondition,
        conditionType: oe.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case oe.Staking:
      return s = e.readUInt8Enum(io, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: et.PostCondition,
        conditionType: oe.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case oe.PoX: {
      const c = e.readUInt8Enum(kl, (u) => {
        throw new Ve(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: et.PostCondition,
        conditionType: oe.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function eg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Vt.TokenTransfer:
      e.push(tr(t.recipient)), e.push(is(t.amount, 8)), e.push(dr(t.memo));
      break;
    case Vt.ContractCall:
      e.push(dr(t.contractAddress)), e.push(dr(t.contractName)), e.push(dr(t.functionName));
      const n = new Uint8Array(4);
      Is(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(tr(r));
      });
      break;
    case Vt.SmartContract:
      e.push(dr(t.contractName)), e.push(dr(t.codeBody));
      break;
    case Vt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(dr(t.contractName)), e.push(dr(t.codeBody));
      break;
    case Vt.PoisonMicroblock:
      break;
    case Vt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Vt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(tr(t.recipient));
      break;
    case Vt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(tr(t.recipient ? Wp(t.recipient) : qp())), e.push(t.vrfProof);
      break;
    case Vt.TenureChange:
      e.push(Pt(t.tenureHash)), e.push(Pt(t.previousTenureHash)), e.push(Pt(t.burnViewHash)), e.push(Pt(t.previousTenureEnd)), e.push(Is(new Uint8Array(4), t.previousTenureBlocks)), e.push(qw(new Uint8Array(1), t.cause)), e.push(Pt(t.publicKeyHash));
      break;
  }
  return Ae(e);
}
function QS(t) {
  const e = cn(t, ne) ? t : new ne(t);
  switch (e.readUInt8Enum(Vt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Vt.TokenTransfer:
      const r = Zn(e), s = ze(e.readBytes(8)), i = Zp(e);
      return DS(r, s, i);
    case Vt.ContractCall:
      const o = Ti(e), a = In(e), c = In(e), u = [], d = e.readUInt32BE();
      for (let b = 0; b < d; b++) {
        const k = Zn(e);
        u.push(k);
      }
      return FS(o, a, c, u);
    case Vt.SmartContract:
      const l = In(e), g = In(e, 4, 1e5);
      return Bd(l, g);
    case Vt.VersionedSmartContract: {
      const b = e.readUInt8Enum($l, (R) => {
        throw new Error(`Cannot recognize ClarityVersion: ${R}`);
      }), k = In(e), O = In(e, 4, Ox);
      return Bd(k, O, b);
    }
    case Vt.PoisonMicroblock:
      return zS();
    case Vt.Coinbase: {
      const b = e.readBytes(Es);
      return Md(b);
    }
    case Vt.CoinbaseToAltRecipient: {
      const b = e.readBytes(Es), k = Zn(e);
      return Md(b, k);
    }
    case Vt.NakamotoCoinbase: {
      const b = e.readBytes(Es), k = Zn(e), O = e.readBytes(vl);
      return RS(b, k, O);
    }
    case Vt.TenureChange:
      const h = lt(e.readBytes(20)), x = lt(e.readBytes(20)), A = lt(e.readBytes(20)), T = lt(e.readBytes(32)), z = e.readUInt32BE(), K = e.readUInt8Enum(Ll, (b) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${b}`);
      }), E = lt(e.readBytes(20));
      return GS(h, x, A, T, z, K, E);
  }
}
function Nl(t) {
  const e = cn(t, ne) ? t : new ne(t);
  return Bl(lt(e.readBytes(ic)));
}
function JS(t) {
  const e = cn(t, ne) ? t : new ne(t), n = e.readUInt8Enum(Pn, (r) => {
    throw new Ve(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Pn.PublicKeyCompressed:
      return pi(pe.Compressed, Pl(e));
    case Pn.PublicKeyUncompressed:
      return pi(pe.Uncompressed, Di(_3(Pl(e).data)));
    case Pn.SignatureCompressed:
      return pi(pe.Compressed, Nl(e));
    case Pn.SignatureUncompressed:
      return pi(pe.Uncompressed, Nl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Fu(t) {
  return Pt(t.data);
}
function t3(t) {
  const e = [];
  switch (t.contents.type) {
    case et.PublicKey:
      e.push(t.pubKeyEncoding === pe.Compressed ? Pn.PublicKeyCompressed : Pn.PublicKeyUncompressed), e.push(Pt(N3(t.contents.data)));
      break;
    case et.MessageSignature:
      e.push(t.pubKeyEncoding === pe.Compressed ? Pn.SignatureCompressed : Pn.SignatureUncompressed), e.push(Fu(t.contents));
      break;
  }
  return Ae(e);
}
function _l(t) {
  return t.data.slice();
}
function Pl(t) {
  const e = cn(t, ne) ? t : new ne(t), n = e.readUInt8(), r = n === 4 ? Tx : Cx;
  return Di(Ae([n, e.readBytes(r)]));
}
function ju(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Qt.P2PKH || e === Qt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Qt.P2WPKH || e === Qt.P2WSH || e === Qt.P2WSHNonSequential) && !r.map((s) => s.data).every(Fi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Qt.P2PKH:
      return Wo(t, v3(r[0].data));
    case Qt.P2WPKH:
      return Wo(t, $3(r[0].data));
    case Qt.P2SH:
    case Qt.P2SHNonSequential:
      return Wo(t, I3(n, r.map(_l)));
    case Qt.P2WSH:
    case Qt.P2WSHNonSequential:
      return Wo(t, k3(n, r.map(_l)));
  }
}
function Wo(t, e) {
  return { type: et.Address, version: t, hash160: e };
}
function zu(t) {
  return Xs.c32address(t.version, t.hash160);
}
function Nd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return KS(e, n, r);
}
function Zi(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return VS(e, n);
  } else
    return XS(t);
}
function e3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return s3(e, n);
  } else
    return n3(t);
}
function n3(t) {
  const e = as(t);
  return { type: Bt.PrincipalStandard, value: zu(e) };
}
function r3(t) {
  return { type: Bt.PrincipalStandard, value: zu(t) };
}
function s3(t, e) {
  const n = as(t), r = On(e);
  return ng(n, r);
}
function ng(t, e) {
  if (Rs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Bt.PrincipalContract,
    value: `${zu(t)}.${e.content}`
  };
}
function i3(t) {
  return { type: Bt.ResponseErr, value: t };
}
function o3(t) {
  return { type: Bt.ResponseOk, value: t };
}
const a3 = (t) => ({ type: Bt.StringASCII, value: t }), c3 = (t) => ({ type: Bt.StringUTF8, value: t });
function l3(t) {
  for (const e in t)
    if (!L3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Bt.Tuple, value: t };
}
function Zn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ne(Pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ne(t) : e = t;
  switch (e.readUInt8Enum(Ce, (r) => {
    throw new Ve(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ce.int:
      return PS(cl(e.readBytes(16)));
    case Ce.uint:
      return US(e.readBytes(16));
    case Ce.buffer:
      const r = e.readUInt32BE();
      return NS(e.readBytes(r));
    case Ce.true:
      return BS();
    case Ce.false:
      return MS();
    case Ce.address:
      const s = Ti(e);
      return r3(s);
    case Ce.contract:
      const i = Ti(e), o = In(e);
      return ng(i, o);
    case Ce.ok:
      return o3(Zn(e));
    case Ce.err:
      return i3(Zn(e));
    case Ce.none:
      return qp();
    case Ce.some:
      return Wp(Zn(e));
    case Ce.list:
      const a = e.readUInt32BE(), c = [];
      for (let A = 0; A < a; A++)
        c.push(Zn(e));
      return HS(c);
    case Ce.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let A = 0; A < u; A++) {
        const T = In(e).content;
        if (T === void 0)
          throw new Ve('"content" is undefined');
        d[T] = Zn(e);
      }
      return l3(d);
    case Ce.ascii:
      const l = e.readUInt32BE(), g = Fw(e.readBytes(l));
      return a3(g);
    case Ce.utf8:
      const h = e.readUInt32BE(), x = Ao(e.readBytes(h));
      return c3(x);
    default:
      throw new Ve("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function sr(t, e) {
  return Ae([Hu(t), e]);
}
function u3(t) {
  return new Uint8Array([Hu(t.type)]);
}
function f3(t) {
  return t.type === Bt.OptionalNone ? new Uint8Array([Hu(t.type)]) : sr(t.type, tr(t.value));
}
function d3(t) {
  const e = new Uint8Array(4);
  return Is(e, Math.ceil(t.value.length / 2), 0), sr(t.type, nr(e, Pt(t.value)));
}
function h3(t) {
  const e = du(Pw(BigInt(t.value), BigInt(Lx)), Dp);
  return sr(t.type, e);
}
function p3(t) {
  const e = du(BigInt(t.value), Dp);
  return sr(t.type, e);
}
function g3(t) {
  return sr(t.type, Lo(as(t.value)));
}
function y3(t) {
  const [e, n] = C3(t.value);
  return sr(t.type, nr(Lo(as(e)), Bi(On(n))));
}
function w3(t) {
  return sr(t.type, tr(t.value));
}
function b3(t) {
  const e = [], n = new Uint8Array(4);
  Is(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = tr(r);
    e.push(s);
  }
  return sr(t.type, Ae(e));
}
function m3(t) {
  const e = [], n = new Uint8Array(4);
  Is(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = On(s);
    e.push(Bi(i));
    const o = tr(t.value[s]);
    e.push(o);
  }
  return sr(t.type, Ae(e));
}
function rg(t, e) {
  const n = [], r = e == "ascii" ? Dw(t.value) : Rs(t.value), s = new Uint8Array(4);
  return Is(s, r.length, 0), n.push(s), n.push(r), sr(t.type, Ae(n));
}
function x3(t) {
  return rg(t, "ascii");
}
function S3(t) {
  return rg(t, "utf8");
}
function _d(t) {
  return lt(tr(t));
}
function tr(t) {
  switch (t.type) {
    case Bt.BoolTrue:
    case Bt.BoolFalse:
      return u3(t);
    case Bt.OptionalNone:
    case Bt.OptionalSome:
      return f3(t);
    case Bt.Buffer:
      return d3(t);
    case Bt.UInt:
      return p3(t);
    case Bt.Int:
      return h3(t);
    case Bt.PrincipalStandard:
      return g3(t);
    case Bt.PrincipalContract:
      return y3(t);
    case Bt.ResponseOk:
    case Bt.ResponseErr:
      return w3(t);
    case Bt.List:
      return b3(t);
    case Bt.Tuple:
      return m3(t);
    case Bt.StringASCII:
      return x3(t);
    case Bt.StringUTF8:
      return S3(t);
    default:
      throw new hi("Unable to serialize. Invalid Clarity Value.");
  }
}
const E3 = (t) => t.length % 2 ? `0${t}` : t, A3 = (t, e) => t.padEnd(e, "0"), sg = (t, e) => t ? Rs(t).length > e : !1;
function Ul(t) {
  return Pp(t);
}
const uo = (t) => rS(_u(t)), Ru = (t) => lt(TS(t)), v3 = (t) => lt(uo(t)), $3 = (t) => {
  const e = uo(t), n = nr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = uo(n);
  return lt(r);
}, I3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ae(n), s = uo(r);
  return lt(s);
}, k3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ae(n), s = _u(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ae(i), a = uo(o);
  return lt(a);
};
function L3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function C3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
be.hmacSha256Sync = (t, ...e) => {
  const n = Rp.create(_u, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Di(t) {
  return t = typeof t == "string" ? Pt(t) : t, {
    type: et.PublicKey,
    data: t
  };
}
function T3(t, e, n = pe.Compressed) {
  const r = Gw(e), s = new wn(_f(r.r), _f(r.s)), i = It.fromSignature(t, s, r.recoveryId), o = n === pe.Compressed;
  return i.toHex(o);
}
function B3(t) {
  return typeof t == "string" ? t : lt(t);
}
const Gu = B3;
function ig(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Rw;
}
function Fi(t) {
  return !Gu(t).startsWith("04");
}
function M3(t) {
  t = hu(t);
  const e = ig(t);
  return lt(vo(t.slice(0, 32), e));
}
function N3(t) {
  return It.fromHex(Gu(t)).toHex(!0);
}
function _3(t) {
  return It.fromHex(Gu(t)).toHex(!1);
}
function P3(t, e) {
  t = hu(t);
  const [n, r] = qa(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Eo(r, 1) + wn.fromHex(n).toCompactHex();
}
function Ku() {
  return {
    type: et.MessageSignature,
    data: lt(new Uint8Array(ic))
  };
}
function og(t, e, n, r) {
  const s = ju(0, t, 1, [Di(e)]).hash160, i = Fi(e) ? pe.Compressed : pe.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ze(n),
    fee: ze(r),
    keyEncoding: i,
    signature: Ku()
  };
}
function fo(t) {
  return "signature" in t;
}
function Pd(t) {
  return t === Qt.P2SH || t === Qt.P2WSH;
}
function U3(t) {
  return t === Qt.P2SHNonSequential || t === Qt.P2WSHNonSequential;
}
function Ud(t) {
  const e = Ul(t);
  return e.nonce = 0, e.fee = 0, fo(e) ? e.signature = Ku() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function H3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    is(t.nonce, 8),
    is(t.fee, 8),
    t.keyEncoding,
    Fu(t.signature)
  ];
  return Ae(e);
}
function O3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    is(t.nonce, 8),
    is(t.fee, 8)
  ], n = Ou(t.fields);
  e.push(Du(n));
  const r = new Uint8Array(2);
  return Vw(r, t.signaturesRequired, 0), e.push(r), Ae(e);
}
function D3(t, e) {
  const n = lt(e.readBytes(20)), r = BigInt(`0x${lt(e.readBytes(8))}`), s = BigInt(`0x${lt(e.readBytes(8))}`), i = e.readUInt8Enum(pe, (a) => {
    throw new Ve(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Qt.P2WPKH && i != pe.Compressed)
    throw new Ve("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Nl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function F3(t, e) {
  const n = lt(e.readBytes(20)), r = BigInt("0x" + lt(e.readBytes(8))), s = BigInt("0x" + lt(e.readBytes(8))), i = Jp(e, et.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case et.PublicKey:
        Fi(u.contents.data) || (o = !0);
        break;
      case et.MessageSignature:
        if (u.pubKeyEncoding === pe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ws("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Qt.P2WSH || t === Qt.P2WSHNonSequential))
    throw new ws("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Hc(t) {
  return fo(t) ? H3(t) : O3(t);
}
function Oc(t) {
  const e = t.readUInt8Enum(Qt, (n) => {
    throw new Ve(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Qt.P2PKH || e === Qt.P2WPKH ? D3(e, t) : F3(e, t);
}
function ag(t, e, n, r) {
  const i = t + lt(new Uint8Array([e])) + lt(is(n, 8)) + lt(is(r, 8));
  if (Pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ru(Pt(i));
}
function cg(t, e, n) {
  const r = 33 + ic, s = Fi(e.data) ? pe.Compressed : pe.Uncompressed, i = t + E3(s.toString(16)) + n, o = Pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ru(o);
}
function j3(t, e, n, r, s) {
  const i = ag(t, e, n, r), o = P3(s, i), a = Di(M3(s)), c = cg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function lg(t, e, n, r, s, i) {
  const o = ag(t, e, n, r), a = Di(T3(o, i, s)), c = cg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function z3() {
  const t = og(Qt.P2PKH, "", 0, 0);
  return t.signer = OS().hash160, t.keyEncoding = pe.Compressed, t.signature = Ku(), t;
}
function Hd(t, e, n) {
  return fo(t) ? R3(t, e, n) : G3(t, e, n);
}
function R3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = lg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = ju(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ws(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function G3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case et.PublicKey:
        Fi(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case et.MessageSignature:
        c.pubKeyEncoding === pe.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = lg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Pd(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new ws("Too many signatures");
        break;
    }
  if (Pd(t.hashMode) && o !== t.signaturesRequired || U3(t.hashMode) && o < t.signaturesRequired)
    throw new ws("Incorrect number of signatures");
  if (i && (t.hashMode === Qt.P2WSH || t.hashMode === Qt.P2WSHNonSequential))
    throw new ws("Uncompressed keys are not allowed in this hash mode");
  const a = ju(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ws(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ug(t) {
  return {
    authType: ye.Standard,
    spendingCondition: t
  };
}
function fg(t, e) {
  return {
    authType: ye.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || og(Qt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Od(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ye.Standard:
        return ug(Ud(t.spendingCondition));
      case ye.Sponsored:
        return fg(Ud(t.spendingCondition), z3());
      default:
        throw new Ba("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function K3(t, e) {
  switch (t.authType) {
    case ye.Standard:
      return Hd(t.spendingCondition, e, ye.Standard);
    case ye.Sponsored:
      return Hd(t.spendingCondition, e, ye.Standard);
    default:
      throw new Ba("Invalid origin auth type");
  }
}
function V3(t, e) {
  switch (t.authType) {
    case ye.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ze(e)
      };
      return { ...t, spendingCondition: n };
    case ye.Sponsored:
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
function q3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ze(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function W3(t, e) {
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
function Y3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ye.Standard:
      e.push(Hc(t.spendingCondition));
      break;
    case ye.Sponsored:
      e.push(Hc(t.spendingCondition)), e.push(Hc(t.sponsorSpendingCondition));
      break;
  }
  return Ae(e);
}
function Z3(t) {
  const e = t.readUInt8Enum(ye, (r) => {
    throw new Ve(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ye.Standard:
      return n = Oc(t), ug(n);
    case ye.Sponsored:
      n = Oc(t);
      const r = Oc(t);
      return fg(n, r);
  }
}
class Q3 {
  constructor({ auth: e, payload: n, postConditions: r = Ou([]), postConditionMode: s = Ta.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = $x(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: ze(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = dn.Any;
  }
  signBegin() {
    const e = Ul(this);
    return e.auth = Od(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ul(this);
    return e.auth = Od(e.auth), e.txid();
  }
  verifyOrigin() {
    return K3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Di(e), r = this.auth.spendingCondition;
    if (r && !fo(r)) {
      const s = Fi(n.data);
      r.fields.push(pi(s ? pe.Compressed : pe.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = j3(n, r, e.fee, e.nonce, s);
    if (fo(e))
      e.signature = Bl(i);
    else {
      const a = ig(s);
      e.fields.push(pi(a ? pe.Compressed : pe.Uncompressed, Bl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Ru(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ye.Sponsored)
      throw new Ba("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W3(this.auth, e);
  }
  setFee(e) {
    this.auth = V3(this.auth, e);
  }
  setNonce(e) {
    this.auth = X3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ye.Sponsored)
      throw new Ba("Cannot sponsor sign a non-sponsored transaction");
    this.auth = q3(this.auth, e);
  }
  serialize() {
    return lt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new hi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new hi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new hi('"auth" is undefined');
    if (this.payload === void 0)
      throw new hi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Is(n, this.chainId, 0), e.push(n), e.push(Y3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Du(this.postConditions)), e.push(eg(this.payload)), Ae(e);
  }
}
function J3(t) {
  const e = cn(t, ne) ? t : new ne(t), n = e.readUInt8Enum(Ps, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Z3(e), i = e.readUInt8Enum(dn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Ta, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Jp(e, et.PostCondition), c = QS(e), u = new Q3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Dd = BigInt("18446744073709551615");
function Dc(t) {
  const e = ze(t);
  if (e < 0n || e > Dd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Dd} (u64 max), received: ${e}`);
  return e;
}
var Hl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Hl || (Hl = {}));
var Ol;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ol || (Ol = {}));
function tE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: et.PostCondition,
        conditionType: oe.STX,
        principal: t.address === "origin" ? { type: et.Principal, prefix: qe.Origin } : Zi(t.address),
        conditionCode: Yo(t.condition),
        amount: Dc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: et.PostCondition,
        conditionType: oe.Fungible,
        principal: t.address === "origin" ? { type: et.Principal, prefix: qe.Origin } : Zi(t.address),
        conditionCode: Yo(t.condition),
        amount: Dc(t.amount),
        asset: Nd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: et.PostCondition,
        conditionType: oe.NonFungible,
        principal: t.address === "origin" ? { type: et.Principal, prefix: qe.Origin } : Zi(t.address),
        conditionCode: Yo(t.condition),
        asset: Nd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: et.PostCondition,
        conditionType: oe.Staking,
        principal: t.address === "origin" ? { type: et.Principal, prefix: qe.Origin } : Zi(t.address),
        conditionCode: Yo(t.condition),
        amount: Dc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: et.PostCondition,
        conditionType: oe.PoX,
        principal: t.address === "origin" ? { type: et.Principal, prefix: qe.Origin } : Zi(t.address),
        conditionCode: eE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Yo(t) {
  return Hl[t];
}
function eE(t) {
  return Ol[t];
}
function dg(t) {
  const e = tE(t);
  return YS(e);
}
function nE(t, e, n) {
  return Xu(hg(t), n);
}
function hg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ho(r);
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
    return BigInt(`0x${iE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Vu(t, e = 8) {
  return (typeof t == "bigint" ? t : hg(t)).toString(16).padStart(e * 2, "0");
}
function Xu(t, e = 16) {
  const n = Vu(t, e);
  return ho(n);
}
function rE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const sE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function iE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += sE[n];
  return e;
}
function ho(t) {
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
function qu(t) {
  return new TextEncoder().encode(t);
}
function oE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function aE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Fd(t) {
  if (t.some(aE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Wu(...t) {
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
function xr(t) {
  return Wu(...t.map((e) => typeof e == "number" ? Fd([e]) : e instanceof Array ? Fd(e) : e));
}
function cc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Dl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Dl || (Dl = {}));
Dl.Mainnet;
const cE = 128, lE = 128, pg = 16;
var Fl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Fl || (Fl = {}));
var jd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(jd || (jd = {}));
var zd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(zd || (zd = {}));
var _n;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(_n || (_n = {}));
const Fc = ["onChainOnly", "offChainOnly", "any"];
Fc[0] + "", _n.OnChainOnly, Fc[1] + "", _n.OffChainOnly, Fc[2] + "", _n.Any, _n.OnChainOnly + "", _n.OnChainOnly, _n.OffChainOnly + "", _n.OffChainOnly, _n.Any + "", _n.Any;
var jl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jl || (jl = {}));
jl.Mainnet;
var Rd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Rd || (Rd = {}));
var hs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(hs || (hs = {}));
var Gd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Gd || (Gd = {}));
var Kd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Kd || (Kd = {}));
var Vd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Vd || (Vd = {}));
var Xd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Xd || (Xd = {}));
var qd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(qd || (qd = {}));
var Wd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Wd || (Wd = {}));
var zl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(zl || (zl = {}));
var Yd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Zd || (Zd = {}));
function Rl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function uE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function fE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Rl(t.outputLen), Rl(t.blockLen);
}
function dE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function hE(t, e) {
  gg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const jc = {
  number: Rl,
  bool: uE,
  bytes: gg,
  hash: fE,
  exists: dE,
  output: hE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, pE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!pE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function yg(t) {
  if (typeof t == "string" && (t = gE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let yE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ws(t) {
  const e = (r) => t().update(yg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function wE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Yu = class extends yE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = zc(this.buffer);
  }
  update(e) {
    jc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = yg(e);
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
    jc.exists(this), jc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    wE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const bE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), wg = Uint8Array.from({ length: 16 }, (t, e) => e), mE = wg.map((t) => (9 * t + 5) % 16);
let Zu = [wg], Qu = [mE];
for (let t = 0; t < 4; t++)
  for (let e of [Zu, Qu])
    e.push(e[t].map((n) => bE[n]));
const bg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), xE = Zu.map((t, e) => t.map((n) => bg[e][n])), SE = Qu.map((t, e) => t.map((n) => bg[e][n])), EE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), AE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zo = (t, e) => t << e | t >>> 32 - e;
function Qd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qo = new Uint32Array(16);
let vE = class extends Yu {
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
      Qo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, A = EE[h], T = AE[h], z = Zu[h], K = Qu[h], E = xE[h], b = SE[h];
      for (let k = 0; k < 16; k++) {
        const O = Zo(r + Qd(h, i, a, u) + Qo[z[k]] + A, E[k]) + l | 0;
        r = l, l = u, u = Zo(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = Zo(s + Qd(x, o, c, d) + Qo[K[k]] + T, b[k]) + g | 0;
        s = g, g = d, d = Zo(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ws(() => new vE());
const $E = (t, e, n) => t & e ^ ~t & n, IE = (t, e, n) => t & e ^ t & n ^ e & n, kE = new Uint32Array([
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
]), zr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rr = new Uint32Array(64);
let mg = class extends Yu {
  constructor() {
    super(64, 32, 8, !1), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
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
      Rr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Rr[l - 15], h = Rr[l - 2], x = Xn(g, 7) ^ Xn(g, 18) ^ g >>> 3, A = Xn(h, 17) ^ Xn(h, 19) ^ h >>> 10;
      Rr[l] = A + Rr[l - 7] + x + Rr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), h = d + g + $E(a, c, u) + kE[l] + Rr[l] | 0, A = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + IE(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, LE = class extends mg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ws(() => new mg());
Ws(() => new LE());
const Jo = BigInt(2 ** 32 - 1), Gl = BigInt(32);
function xg(t, e = !1) {
  return e ? { h: Number(t & Jo), l: Number(t >> Gl & Jo) } : { h: Number(t >> Gl & Jo) | 0, l: Number(t & Jo) | 0 };
}
function CE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = xg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const TE = (t, e) => BigInt(t >>> 0) << Gl | BigInt(e >>> 0), BE = (t, e, n) => t >>> n, ME = (t, e, n) => t << 32 - n | e >>> n, NE = (t, e, n) => t >>> n | e << 32 - n, _E = (t, e, n) => t << 32 - n | e >>> n, PE = (t, e, n) => t << 64 - n | e >>> n - 32, UE = (t, e, n) => t >>> n - 32 | e << 64 - n, HE = (t, e) => e, OE = (t, e) => t, DE = (t, e, n) => t << n | e >>> 32 - n, FE = (t, e, n) => e << n | t >>> 32 - n, jE = (t, e, n) => e << n - 32 | t >>> 64 - n, zE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function RE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const GE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), KE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, VE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), XE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, qE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), WE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: xg,
  split: CE,
  toBig: TE,
  shrSH: BE,
  shrSL: ME,
  rotrSH: NE,
  rotrSL: _E,
  rotrBH: PE,
  rotrBL: UE,
  rotr32H: HE,
  rotr32L: OE,
  rotlSH: DE,
  rotlSL: FE,
  rotlBH: jE,
  rotlBL: zE,
  add: RE,
  add3L: GE,
  add3H: KE,
  add4L: VE,
  add4H: XE,
  add5H: WE,
  add5L: qE
}, [YE, ZE] = Et.split([
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
].map((t) => BigInt(t))), Gr = new Uint32Array(80), Kr = new Uint32Array(80);
let lc = class extends Yu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: A, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = A | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Gr[E] = e.getUint32(n), Kr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const b = Gr[E - 15] | 0, k = Kr[E - 15] | 0, O = Et.rotrSH(b, k, 1) ^ Et.rotrSH(b, k, 8) ^ Et.shrSH(b, k, 7), R = Et.rotrSL(b, k, 1) ^ Et.rotrSL(b, k, 8) ^ Et.shrSL(b, k, 7), j = Gr[E - 2] | 0, X = Kr[E - 2] | 0, v = Et.rotrSH(j, X, 19) ^ Et.rotrBH(j, X, 61) ^ Et.shrSH(j, X, 6), M = Et.rotrSL(j, X, 19) ^ Et.rotrBL(j, X, 61) ^ Et.shrSL(j, X, 6), N = Et.add4L(R, M, Kr[E - 7], Kr[E - 16]), F = Et.add4H(N, O, v, Gr[E - 7], Gr[E - 16]);
      Gr[E] = F | 0, Kr[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: A, Gl: T, Hh: z, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const b = Et.rotrSH(l, g, 14) ^ Et.rotrSH(l, g, 18) ^ Et.rotrBH(l, g, 41), k = Et.rotrSL(l, g, 14) ^ Et.rotrSL(l, g, 18) ^ Et.rotrBL(l, g, 41), O = l & h ^ ~l & A, R = g & x ^ ~g & T, j = Et.add5L(K, k, R, ZE[E], Kr[E]), X = Et.add5H(j, z, b, O, YE[E], Gr[E]), v = j | 0, M = Et.rotrSH(r, s, 28) ^ Et.rotrBH(r, s, 34) ^ Et.rotrBH(r, s, 39), N = Et.rotrSL(r, s, 28) ^ Et.rotrBL(r, s, 34) ^ Et.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      z = A | 0, K = T | 0, A = h | 0, T = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = Et.add(u | 0, d | 0, X | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const V = Et.add3L(v, N, Y);
      r = Et.add3H(V, X, M, F), s = V | 0;
    }
    ({ h: r, l: s } = Et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Et.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = Et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = Et.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: A, l: T } = Et.add(this.Gh | 0, this.Gl | 0, A | 0, T | 0), { h: z, l: K } = Et.add(this.Hh | 0, this.Hl | 0, z | 0, K | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, x, A, T, z, K);
  }
  roundClean() {
    Gr.fill(0), Kr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, QE = class extends lc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, JE = class extends lc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, tA = class extends lc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ws(() => new lc());
Ws(() => new QE());
Ws(() => new JE());
Ws(() => new tA());
function eA(t, e, n) {
  const s = cE;
  if (wA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Fl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Me;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Me || (Me = {}));
let nA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Sg = class extends nA {
  constructor(e) {
    super(e);
  }
};
function uc(t) {
  const e = [];
  return e.push(ho(Vu(t.version, 1))), e.push(ho(t.hash160)), xr(e);
}
function rA(t) {
  const e = [];
  return e.push(t.prefix), e.push(uc(t.address)), t.prefix === zl.Contract && e.push(po(t.contractName)), xr(e);
}
function po(t) {
  const e = [], n = qu(t.content), r = n.byteLength;
  return e.push(ho(Vu(r, t.lengthPrefixBytes))), e.push(n), xr(e);
}
function sA(t) {
  const e = [];
  return e.push(uc(t.address)), e.push(po(t.contractName)), e.push(po(t.assetName)), xr(e);
}
function Eg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(rA(t.principal)), (t.conditionType === hs.Fungible || t.conditionType === hs.NonFungible) && e.push(sA(t.assetInfo)), t.conditionType === hs.NonFungible && e.push(Hs(t.assetName)), e.push(t.conditionCode), t.conditionType === hs.STX || t.conditionType === hs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Sg("The post-condition amount may not be larger than 8 bytes");
    e.push(nE(t.amount, !1, 8));
  }
  return xr(e);
}
function ir(t, e) {
  return xr([t, e]);
}
function iA(t) {
  return new Uint8Array([t.type]);
}
function oA(t) {
  return t.type === Me.OptionalNone ? new Uint8Array([t.type]) : ir(t.type, Hs(t.value));
}
function aA(t) {
  const e = new Uint8Array(4);
  return cc(e, t.buffer.length, 0), ir(t.type, Wu(e, t.buffer));
}
function cA(t) {
  const e = Xu(rE(t.value, BigInt(lE)), pg);
  return ir(t.type, e);
}
function lA(t) {
  const e = Xu(t.value, pg);
  return ir(t.type, e);
}
function uA(t) {
  return ir(t.type, uc(t.address));
}
function fA(t) {
  return ir(t.type, Wu(uc(t.address), po(t.contractName)));
}
function dA(t) {
  return ir(t.type, Hs(t.value));
}
function hA(t) {
  const e = [], n = new Uint8Array(4);
  cc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Hs(r);
    e.push(s);
  }
  return ir(t.type, xr(e));
}
function pA(t) {
  const e = [], n = new Uint8Array(4);
  cc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = eA(s);
    e.push(po(i));
    const o = Hs(t.data[s]);
    e.push(o);
  }
  return ir(t.type, xr(e));
}
function Ag(t, e) {
  const n = [], r = e == "ascii" ? oE(t.data) : qu(t.data), s = new Uint8Array(4);
  return cc(s, r.length, 0), n.push(s), n.push(r), ir(t.type, xr(n));
}
function gA(t) {
  return Ag(t, "ascii");
}
function yA(t) {
  return Ag(t, "utf8");
}
function Hs(t) {
  switch (t.type) {
    case Me.BoolTrue:
    case Me.BoolFalse:
      return iA(t);
    case Me.OptionalNone:
    case Me.OptionalSome:
      return oA(t);
    case Me.Buffer:
      return aA(t);
    case Me.UInt:
      return lA(t);
    case Me.Int:
      return cA(t);
    case Me.PrincipalStandard:
      return uA(t);
    case Me.PrincipalContract:
      return fA(t);
    case Me.ResponseOk:
    case Me.ResponseErr:
      return dA(t);
    case Me.List:
      return hA(t);
    case Me.Tuple:
      return pA(t);
    case Me.StringASCII:
      return gA(t);
    case Me.StringUTF8:
      return yA(t);
    default:
      throw new Sg("Unable to serialize. Invalid Clarity Value.");
  }
}
const wA = (t, e) => t ? qu(t).length > e : !1, bA = "connect-ui";
let ha, vg, hn = !1, Kl = !1;
const br = (t, e = "") => () => {
}, mA = (t, e) => () => {
}, xA = "{visibility:hidden}.hydrated{visibility:inherit}", Jd = {}, SA = "http://www.w3.org/2000/svg", EA = "http://www.w3.org/1999/xhtml", AA = (t) => t != null, Ju = (t) => (t = typeof t, t === "object" || t === "function");
function $g(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const bt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Ju(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Vl(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Vl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Vl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, vA = {}, $A = (t) => t && t.$tag$ === vA, IA = (t, e) => t != null && !Ju(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, kA = (t) => ji(t).$hostElement$, LA = (t, e, n) => {
  const r = je.ce(e, n);
  return t.dispatchEvent(r), r;
}, th = /* @__PURE__ */ new WeakMap(), CA = (t, e, n) => {
  let r = Ma.get(t);
  WA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ma.set(t, r);
}, TA = (t, e, n, r) => {
  var s;
  let i = Ig(e);
  const o = Ma.get(i);
  if (t = t.nodeType === 11 ? t : er, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = th.get(t), c;
      if (a || th.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = er.createElement("style"), c.innerHTML = o;
          const u = (s = je.$nonce$) !== null && s !== void 0 ? s : $g(er);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, BA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = br("attachStyles", e.$tagName$), i = TA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Ig = (t, e) => "sc-" + t.$tagName$, eh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = rh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = nh(n), d = nh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : rh(fc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && je.rel(t, e, n, !1), r && je.ael(t, e, r, !1);
    else {
      const c = Ju(r);
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
}, MA = /\s/, nh = (t) => t ? t.split(MA) : [], kg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Jd, o = e.$attrs$ || Jd;
  for (r in i)
    r in o || eh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    eh(s, r, i[r], o[r], n, e.$flags$);
}, tf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = er.createTextNode(s.$text$);
  else {
    if (hn || (hn = s.$tag$ === "svg"), o = s.$elm$ = er.createElementNS(hn ? SA : EA, s.$tag$), hn && s.$tag$ === "foreignObject" && (hn = !1), kg(null, s, hn), AA(ha) && o["s-si"] !== ha && o.classList.add(o["s-si"] = ha), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = tf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? hn = !1 : o.tagName === "foreignObject" && (hn = !0);
  }
  return o;
}, Lg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === vg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = tf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Cg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, NA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : ta(a, d) ? (to(a, d), a = e[++s], d = r[++i]) : ta(c, l) ? (to(c, l), c = e[--o], l = r[--u]) : ta(a, l) ? (to(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : ta(c, d) ? (to(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = tf(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Lg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Cg(e, s, o);
}, ta = (t, e) => t.$tag$ === e.$tag$, to = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (hn = i === "svg" ? !0 : i === "foreignObject" ? !1 : hn, kg(t, e, hn), r !== null && s !== null ? NA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Lg(n, null, e, s, 0, s.length - 1)) : r !== null && Cg(r, 0, r.length - 1), hn && i === "svg" && (hn = !1)) : t.$text$ !== o && (n.data = o);
}, _A = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Vl(null, null), s = $A(e) ? e : bt(null, null, e);
  vg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ha = n["s-sc"], to(r, s);
}, Tg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, ef = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Tg(t, t.$ancestorComponent$), ZA(() => PA(t, e));
}, PA = (t, e) => {
  const n = br("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), DA(s, () => UA(t, r, e));
}, UA = async (t, e, n) => {
  const r = t.$hostElement$, s = br("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && BA(t);
  const o = br("render", t.$cmpMeta$.$tagName$);
  HA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => OA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, HA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, _A(t, e);
  } catch (r) {
    go(r, t.$hostElement$);
  }
  return null;
}, OA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = br("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Mg(n), r(), t.$onReadyResolve$(n), s || Bg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && rf(() => ef(t, !1)), t.$flags$ &= -517;
}, Bg = (t) => {
  Mg(er.documentElement), rf(() => LA(fc, "appload", { detail: { namespace: bA } }));
}, DA = (t, e) => t && t.then ? t.then(e) : e(), Mg = (t) => t.classList.add("hydrated"), FA = (t, e) => ji(t).$instanceValues$.get(e), jA = (t, e, n, r) => {
  const s = ji(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = IA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && ef(s, !1));
}, Ng = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return FA(this, i);
        },
        set(a) {
          jA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        je.jmp(() => {
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
}, zA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = qA(n), s.then) {
        const c = mA();
        s = await s, c();
      }
      s.isProxied || (Ng(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = br("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        go(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Ig(n);
      if (!Ma.has(c)) {
        const u = br("registerStyles", n.$tagName$);
        CA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => ef(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, RA = (t) => {
  if (!(je.$flags$ & 1)) {
    const e = ji(t), n = e.$cmpMeta$, r = br("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Tg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), zA(t, e, n);
    }
    r();
  }
}, GA = (t) => {
  je.$flags$ & 1 || ji(t);
}, KA = (t, e = {}) => {
  var n;
  const r = br(), s = [], i = e.exclude || [], o = fc.customElements, a = er.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ er.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(je, e), je.$resourcesUrl$ = new URL(e.resourcesUrl || "./", er.baseURI).href, t.map((h) => {
    h[1].map((x) => {
      const A = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      A.$members$ = x[2];
      const T = A.$tagName$, z = class extends HTMLElement {
        // StencilLazyHost
        constructor(K) {
          super(K), K = this, XA(K, A), A.$flags$ & 1 && K.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : je.jmp(() => RA(this));
        }
        disconnectedCallback() {
          je.jmp(() => GA(this));
        }
        componentOnReady() {
          return ji(this).$onReadyPromise$;
        }
      };
      A.$lazyBundleId$ = h[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Ng(
        z,
        A,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + xA, u.setAttribute("data-styles", "");
    const h = (n = je.$nonce$) !== null && n !== void 0 ? n : $g(er);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : je.jmp(() => l = setTimeout(Bg, 30)), r();
}, nf = /* @__PURE__ */ new WeakMap(), ji = (t) => nf.get(t), VA = (t, e) => nf.set(e.$lazyInstance$ = t, e), XA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], nf.set(t, n);
}, rh = (t, e) => e in t, go = (t, e) => (0, console.error)(t, e), Rc = /* @__PURE__ */ new Map(), qA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Rc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Rc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => w$).then(o, go);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Rc.set(s, o), o[r]), go);
}, Ma = /* @__PURE__ */ new Map(), fc = typeof window < "u" ? window : {}, er = fc.document || { head: {} }, je = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, _g = (t) => Promise.resolve(t), WA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), sh = [], Pg = [], YA = (t, e) => (n) => {
  t.push(n), Kl || (Kl = !0, je.$flags$ & 4 ? rf(Xl) : je.raf(Xl));
}, ih = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      go(n);
    }
  t.length = 0;
}, Xl = () => {
  ih(sh), ih(Pg), (Kl = sh.length > 0) && je.raf(Xl);
}, rf = (t) => _g().then(t), ZA = /* @__PURE__ */ YA(Pg), QA = () => _g(), JA = (t, e) => typeof window > "u" ? Promise.resolve() : QA().then(() => KA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var t4 = Object.defineProperty, e4 = Object.defineProperties, n4 = Object.getOwnPropertyDescriptors, Na = Object.getOwnPropertySymbols, Ug = Object.prototype.hasOwnProperty, Hg = Object.prototype.propertyIsEnumerable, oh = (t, e, n) => e in t ? t4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, mn = (t, e) => {
  for (var n in e || (e = {})) Ug.call(e, n) && oh(t, n, e[n]);
  if (Na) for (var n of Na(e)) Hg.call(e, n) && oh(t, n, e[n]);
  return t;
}, Dn = (t, e) => e4(t, n4(e)), Og = (t, e) => {
  var n = {};
  for (var r in t) Ug.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Na) for (var r of Na(t)) e.indexOf(r) < 0 && Hg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Dg() {
  return sc(Bs()) || window.StacksProvider || window.BlockstackProvider;
}
function dc(t) {
  return t ? typeof t == "string" ? Ns.fromName(t) : "version" in t ? t : "url" in t ? new Sl({ url: t.url }) : t.transactionVersion === Ps.Mainnet ? new Sl({ url: t.client.baseUrl }) : new El({ url: t.client.baseUrl }) : new El();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var r4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(r4 || {}), s4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(s4 || {}), sf = (t) => {
  let e = t;
  if (!e) {
    let n = new y0(["store_write"], document.location.href);
    e = new xl({ appConfig: n });
  }
  return e;
};
function Fg(t) {
  try {
    return sf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var jg = (t) => {
  let e = sf(t).loadUserData().appPrivateKey, n = He.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function i4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [_s.Mainnet]: "mainnet", [_s.Testnet]: "testnet" }, a = dc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function o4(t) {
  let e = dc(t.network), n = sf(t.userSession), r = Dn(mn({}, t), { network: e, userSession: n });
  return mn({ stxAddress: i4(r) }, r);
}
async function a4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(dg) : n = n.map((r) => lt(Eg(r)))), new He.TokenSigner("ES256k", e).signAsync(Dn(mn({}, t), { postConditions: n }));
}
function c4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(dg) : e = e.map((n) => lt(Eg(n)))), He.createUnsecuredToken(Dn(mn({}, t), { postConditions: e }));
}
var l4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Pt(a.replace(/^0x/, "")), u = J3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Dn(mn({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Dn(mn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, u4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Og(e, ["amount", "appDetails", "userSession"]);
  if (Fg(s)) {
    let { privateKey: a, publicKey: c } = jg(s), u = Dn(mn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), a4(u, a);
  }
  let o = Dn(mn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), c4(o);
};
async function f4(t, e, n) {
  let r = await e(Dn(mn(mn({}, o4(t)), t), { network: dc(t.network) }));
  return l4({ token: r, options: t }, n);
}
function d4(t, e = Dg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return f4(t, u4, e);
}
function zg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Dn(mn({}, t), { message: _d(e), domain: _d(n) }) : Dn(mn({}, t), { message: lt(Hs(e)), domain: lt(Hs(n)) });
}
async function h4(t, e) {
  return new He.TokenSigner("ES256k", e).signAsync(zg(t));
}
async function p4(t) {
  let e = t, { userSession: n } = e, r = Og(e, ["userSession"]);
  if (Fg(n)) {
    let { privateKey: s, publicKey: i } = jg(n), o = Dn(mn({}, r), { publicKey: i });
    return h4(o, s);
  }
  return He.createUnsecuredToken(zg(t));
}
var g4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(g4 || {}), Rg = "asigna-stx", ah = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Rg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(w4(t, e), "*");
}), y4 = { authenticationRequest: async (t) => ah(t, "authenticationRequest"), transactionRequest: async (t) => ah(t, "transactionRequest") }, w4 = (t, e) => ({ source: Rg, [e]: t }), b4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = y4);
};
b4();
var m4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function x4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Bs(), o = Dg();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    JA();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : m4, c = fx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = d;
    };
    u.callback = (h) => {
      l(), t(n, h);
    }, u.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(u);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var ea = x4(d4);
function os(t, e, n) {
  return of(Ye(t, e), n);
}
function Ye(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ce(r);
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
      const r = A4(BigInt(`0x${kt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${kt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function ch(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Co(t, e = 8) {
  return (typeof t == "bigint" ? t : Ye(t, !1)).toString(16).padStart(e * 2, "0");
}
function hc(t) {
  return parseInt(t, 16);
}
function of(t, e = 16) {
  const n = Co(t, e);
  return ce(n);
}
function S4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function E4(t, e) {
  return t & BigInt(1) << e;
}
function A4(t, e) {
  return E4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const v4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += v4[n];
  return e;
}
function ce(t) {
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
function zi(t) {
  return new TextEncoder().encode(t);
}
function af(t) {
  return new TextDecoder().decode(t);
}
function Gg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function $4(t) {
  return String.fromCharCode.apply(null, t);
}
function I4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function lh(t) {
  if (t.some(I4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function pc(...t) {
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
function ve(t) {
  return pc(...t.map((e) => typeof e == "number" ? lh([e]) : e instanceof Array ? lh(e) : e));
}
var uh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(uh || (uh = {}));
var fh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fh || (fh = {}));
var dh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(dh || (dh = {}));
const Kg = 33, Gc = 32;
function k4(t) {
  if (t.length < Gc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Gc * 2), r = t.slice(2 + Gc * 2);
  return {
    recoveryId: hc(e),
    r: n,
    s: r
  };
}
function L4(t) {
  const e = typeof t == "string" ? ce(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function C4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function T4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function B4(t, e) {
  return t[e];
}
function M4(t, e, n = 0) {
  return t[n] = e, t;
}
function N4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Os(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ql;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ql || (ql = {}));
const _4 = ql.Mainnet, P4 = 128, U4 = 128, Vg = 16, As = 32, Wl = 80, gc = 65, H4 = 32, O4 = 64, _a = 34;
var it;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(it || (it = {}));
var $t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($t || ($t = {}));
var Yl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Yl || (Yl = {}));
var sn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(sn || (sn = {}));
const pa = ["onChainOnly", "offChainOnly", "any"], hh = {
  [pa[0]]: sn.OnChainOnly,
  [pa[1]]: sn.OffChainOnly,
  [pa[2]]: sn.Any,
  [sn.OnChainOnly]: sn.OnChainOnly,
  [sn.OffChainOnly]: sn.OffChainOnly,
  [sn.Any]: sn.Any
};
function D4(t) {
  if (t in hh)
    return hh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${pa.join(", ")}`);
}
var Pa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pa || (Pa = {}));
Pa.Mainnet;
var Mi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Mi || (Mi = {}));
var on;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(on || (on = {}));
var we;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(we || (we = {}));
var Jt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Jt || (Jt = {}));
var Ua;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ua || (Ua = {}));
var ge;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ge || (ge = {}));
var yo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(yo || (yo = {}));
var Zl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Zl || (Zl = {}));
var wo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(wo || (wo = {}));
var ph;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ph || (ph = {}));
var gh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(gh || (gh = {}));
function Ql(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function F4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Xg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function j4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ql(t.outputLen), Ql(t.blockLen);
}
function z4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function R4(t, e) {
  Xg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ms = {
  number: Ql,
  bool: F4,
  bytes: Xg,
  hash: j4,
  exists: z4,
  output: R4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Kc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qn = (t, e) => t << 32 - e | t >>> e, G4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!G4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function K4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function cf(t) {
  if (typeof t == "string" && (t = K4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class qg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ys(t) {
  const e = (r) => t().update(cf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function V4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class lf extends qg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Kc(this.buffer);
  }
  update(e) {
    ms.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = cf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Kc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ms.exists(this), ms.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    V4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Kc(e), c = this.outputLen;
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
const X4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Wg = Uint8Array.from({ length: 16 }, (t, e) => e), q4 = Wg.map((t) => (9 * t + 5) % 16);
let uf = [Wg], ff = [q4];
for (let t = 0; t < 4; t++)
  for (let e of [uf, ff])
    e.push(e[t].map((n) => X4[n]));
const Yg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), W4 = uf.map((t, e) => t.map((n) => Yg[e][n])), Y4 = ff.map((t, e) => t.map((n) => Yg[e][n])), Z4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Q4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), na = (t, e) => t << e | t >>> 32 - e;
function yh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ra = new Uint32Array(16);
class J4 extends lf {
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
      ra[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, A = Z4[h], T = Q4[h], z = uf[h], K = ff[h], E = W4[h], b = Y4[h];
      for (let k = 0; k < 16; k++) {
        const O = na(r + yh(h, i, a, u) + ra[z[k]] + A, E[k]) + l | 0;
        r = l, l = u, u = na(a, 10) | 0, a = i, i = O;
      }
      for (let k = 0; k < 16; k++) {
        const O = na(s + yh(x, o, c, d) + ra[K[k]] + T, b[k]) + g | 0;
        s = g, g = d, d = na(c, 10) | 0, c = o, o = O;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ra.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const t8 = Ys(() => new J4()), e8 = (t, e, n) => t & e ^ ~t & n, n8 = (t, e, n) => t & e ^ t & n ^ e & n, r8 = new Uint32Array([
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
]), Vr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xr = new Uint32Array(64);
class Zg extends lf {
  constructor() {
    super(64, 32, 8, !1), this.A = Vr[0] | 0, this.B = Vr[1] | 0, this.C = Vr[2] | 0, this.D = Vr[3] | 0, this.E = Vr[4] | 0, this.F = Vr[5] | 0, this.G = Vr[6] | 0, this.H = Vr[7] | 0;
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
      const g = Xr[l - 15], h = Xr[l - 2], x = qn(g, 7) ^ qn(g, 18) ^ g >>> 3, A = qn(h, 17) ^ qn(h, 19) ^ h >>> 10;
      Xr[l] = A + Xr[l - 7] + x + Xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = qn(a, 6) ^ qn(a, 11) ^ qn(a, 25), h = d + g + e8(a, c, u) + r8[l] + Xr[l] | 0, A = (qn(r, 2) ^ qn(r, 13) ^ qn(r, 22)) + n8(r, s, i) | 0;
      d = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + A | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class s8 extends Zg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const df = Ys(() => new Zg());
Ys(() => new s8());
const sa = BigInt(2 ** 32 - 1), Jl = BigInt(32);
function Qg(t, e = !1) {
  return e ? { h: Number(t & sa), l: Number(t >> Jl & sa) } : { h: Number(t >> Jl & sa) | 0, l: Number(t & sa) | 0 };
}
function i8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Qg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const o8 = (t, e) => BigInt(t >>> 0) << Jl | BigInt(e >>> 0), a8 = (t, e, n) => t >>> n, c8 = (t, e, n) => t << 32 - n | e >>> n, l8 = (t, e, n) => t >>> n | e << 32 - n, u8 = (t, e, n) => t << 32 - n | e >>> n, f8 = (t, e, n) => t << 64 - n | e >>> n - 32, d8 = (t, e, n) => t >>> n - 32 | e << 64 - n, h8 = (t, e) => e, p8 = (t, e) => t, g8 = (t, e, n) => t << n | e >>> 32 - n, y8 = (t, e, n) => e << n | t >>> 32 - n, w8 = (t, e, n) => e << n - 32 | t >>> 64 - n, b8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function m8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const x8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), S8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, E8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), A8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, v8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), $8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: Qg,
  split: i8,
  toBig: o8,
  shrSH: a8,
  shrSL: c8,
  rotrSH: l8,
  rotrSL: u8,
  rotrBH: f8,
  rotrBL: d8,
  rotr32H: h8,
  rotr32L: p8,
  rotlSH: g8,
  rotlSL: y8,
  rotlBH: w8,
  rotlBL: b8,
  add: m8,
  add3L: x8,
  add3H: S8,
  add4L: E8,
  add4H: A8,
  add5H: $8,
  add5L: v8
}, [I8, k8] = At.split([
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
].map((t) => BigInt(t))), qr = new Uint32Array(80), Wr = new Uint32Array(80);
class yc extends lf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: A, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, g, h, x, A, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = A | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      qr[E] = e.getUint32(n), Wr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const b = qr[E - 15] | 0, k = Wr[E - 15] | 0, O = At.rotrSH(b, k, 1) ^ At.rotrSH(b, k, 8) ^ At.shrSH(b, k, 7), R = At.rotrSL(b, k, 1) ^ At.rotrSL(b, k, 8) ^ At.shrSL(b, k, 7), j = qr[E - 2] | 0, X = Wr[E - 2] | 0, v = At.rotrSH(j, X, 19) ^ At.rotrBH(j, X, 61) ^ At.shrSH(j, X, 6), M = At.rotrSL(j, X, 19) ^ At.rotrBL(j, X, 61) ^ At.shrSL(j, X, 6), N = At.add4L(R, M, Wr[E - 7], Wr[E - 16]), F = At.add4H(N, O, v, qr[E - 7], qr[E - 16]);
      qr[E] = F | 0, Wr[E] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: A, Gl: T, Hh: z, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const b = At.rotrSH(l, g, 14) ^ At.rotrSH(l, g, 18) ^ At.rotrBH(l, g, 41), k = At.rotrSL(l, g, 14) ^ At.rotrSL(l, g, 18) ^ At.rotrBL(l, g, 41), O = l & h ^ ~l & A, R = g & x ^ ~g & T, j = At.add5L(K, k, R, k8[E], Wr[E]), X = At.add5H(j, z, b, O, I8[E], qr[E]), v = j | 0, M = At.rotrSH(r, s, 28) ^ At.rotrBH(r, s, 34) ^ At.rotrBH(r, s, 39), N = At.rotrSL(r, s, 28) ^ At.rotrBL(r, s, 34) ^ At.rotrBL(r, s, 39), F = r & i ^ r & a ^ i & a, Y = s & o ^ s & c ^ o & c;
      z = A | 0, K = T | 0, A = h | 0, T = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = At.add(u | 0, d | 0, X | 0, v | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const V = At.add3L(v, N, Y);
      r = At.add3H(V, X, M, F), s = V | 0;
    }
    ({ h: r, l: s } = At.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = At.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = At.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: g } = At.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = At.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: A, l: T } = At.add(this.Gh | 0, this.Gl | 0, A | 0, T | 0), { h: z, l: K } = At.add(this.Hh | 0, this.Hl | 0, z | 0, K | 0), this.set(r, s, i, o, a, c, u, d, l, g, h, x, A, T, z, K);
  }
  roundClean() {
    qr.fill(0), Wr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class L8 extends yc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class C8 extends yc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class T8 extends yc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ys(() => new yc());
Ys(() => new L8());
const B8 = Ys(() => new C8());
Ys(() => new T8());
function Jg(t) {
  if (ce(t).byteLength != gc)
    throw Error("Invalid signature");
  return {
    type: it.MessageSignature,
    data: t
  };
}
function eo(t, e) {
  return { type: it.Address, version: t, hash160: e };
}
function gi(t) {
  return Xs.c32address(t.version, t.hash160);
}
function Ds(t, e, n) {
  const r = e || 1, s = n || P4;
  if (yy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: it.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function hf(t) {
  const e = Xs.c32addressDecode(t);
  return {
    type: it.Address,
    version: e[0],
    hash160: e[1]
  };
}
var W;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(W || (W = {}));
function M8(t) {
  if (t.type === W.PrincipalStandard)
    return gi(t.address);
  if (t.type === W.PrincipalContract)
    return `${gi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function ty(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return P8(e, n);
  } else
    return N8(t);
}
function N8(t) {
  const e = hf(t);
  return { type: W.PrincipalStandard, address: e };
}
function _8(t) {
  return { type: W.PrincipalStandard, address: t };
}
function P8(t, e) {
  const n = hf(t), r = Ds(e);
  return ey(n, r);
}
function ey(t, e) {
  if (zi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: W.PrincipalContract, address: t, contractName: e };
}
function Vc(t, e = !1) {
  switch (t.type) {
    case W.BoolTrue:
      return !0;
    case W.BoolFalse:
      return !1;
    case W.Int:
    case W.UInt:
      return e ? t.value.toString() : t.value;
    case W.Buffer:
      return `0x${kt(t.buffer)}`;
    case W.OptionalNone:
      return null;
    case W.OptionalSome:
      return Qn(t.value);
    case W.ResponseErr:
      return Qn(t.value);
    case W.ResponseOk:
      return Qn(t.value);
    case W.PrincipalStandard:
    case W.PrincipalContract:
      return M8(t);
    case W.List:
      return t.list.map((r) => Qn(r));
    case W.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Qn(t.data[r]);
      }), n;
    case W.StringASCII:
      return t.data;
    case W.StringUTF8:
      return t.data;
  }
}
function Qn(t) {
  switch (t.type) {
    case W.ResponseErr:
      return { type: Qr(t), value: Vc(t, !0), success: !1 };
    case W.ResponseOk:
      return { type: Qr(t), value: Vc(t, !0), success: !0 };
    default:
      return { type: Qr(t), value: Vc(t, !0) };
  }
}
function Qr(t) {
  switch (t.type) {
    case W.BoolTrue:
    case W.BoolFalse:
      return "bool";
    case W.Int:
      return "int";
    case W.UInt:
      return "uint";
    case W.Buffer:
      return `(buff ${t.buffer.length})`;
    case W.OptionalNone:
      return "(optional none)";
    case W.OptionalSome:
      return `(optional ${Qr(t.value)})`;
    case W.ResponseErr:
      return `(response UnknownType ${Qr(t.value)})`;
    case W.ResponseOk:
      return `(response ${Qr(t.value)} UnknownType)`;
    case W.PrincipalStandard:
    case W.PrincipalContract:
      return "principal";
    case W.List:
      return `(list ${t.list.length} ${t.list.length ? Qr(t.list[0]) : "UnknownType"})`;
    case W.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Qr(t.data[e])})`).join(" ")})`;
    case W.StringASCII:
      return `(string-ascii ${Gg(t.data).length})`;
    case W.StringUTF8:
      return `(string-utf8 ${zi(t.data).length})`;
  }
}
const ny = () => ({ type: W.BoolTrue }), ry = () => ({ type: W.BoolFalse }), U8 = (t) => t ? ny() : ry(), wh = BigInt("0xffffffffffffffffffffffffffffffff"), H8 = BigInt(0), bh = BigInt("0x7fffffffffffffffffffffffffffffff"), mh = BigInt("-170141183460469231731687303715884105728"), O8 = (t) => {
  const e = Ye(t, !0);
  if (e > bh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${bh}`);
  if (e < mh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${mh}`);
  return { type: W.Int, value: e };
}, an = (t) => {
  const e = Ye(t, !1);
  if (e < H8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > wh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${wh}`);
  return { type: W.UInt, value: e };
}, sy = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: W.Buffer, buffer: t };
};
function iy() {
  return { type: W.OptionalNone };
}
function oy(t) {
  return { type: W.OptionalSome, value: t };
}
function D8(t) {
  return { type: W.ResponseErr, value: t };
}
function F8(t) {
  return { type: W.ResponseOk, value: t };
}
function j8(t) {
  return { type: W.List, list: t };
}
function mr(t) {
  for (const e in t)
    if (!Tv(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: W.Tuple, data: t };
}
const he = (t) => ({ type: W.StringASCII, data: t }), z8 = (t) => ({ type: W.StringUTF8, data: t });
class ay extends qg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ms.hash(e);
    const r = cf(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const cy = (t, e, n) => new ay(t, e).update(n).digest();
cy.create = (t, e) => new ay(t, e);
be.hmacSha256Sync = (t, ...e) => {
  const n = cy.create(df, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ni(t) {
  return {
    type: it.PublicKey,
    data: ce(t)
  };
}
function R8(t, e, n = ge.Compressed) {
  const r = k4(e.data), s = new wn(ch(r.r), ch(r.s)), i = It.fromSignature(t, s, r.recoveryId), o = n === ge.Compressed;
  return i.toHex(o);
}
function G8(t) {
  return { type: it.PublicKey, data: t };
}
function Ri(t) {
  return !kt(t.data).startsWith("04");
}
function Ha(t) {
  return t.data.slice();
}
function K8(t) {
  const e = q8(t), n = vo(e.data.slice(0, 32), e.compressed);
  return Ni(kt(n));
}
function V8(t) {
  const e = typeof t == "string" ? t : kt(t), n = It.fromHex(e).toHex(!0);
  return Ni(n);
}
function X8(t) {
  const e = typeof t == "string" ? t : kt(t), n = It.fromHex(e).toHex(!1);
  return Ni(n);
}
function tu(t) {
  const e = t.readUInt8(), n = e === 4 ? O4 : H4;
  return G8(ve([e, t.readBytes(n)]));
}
function q8(t) {
  const e = L4(t), n = e.length == Kg;
  return { data: e, compressed: n };
}
function W8(t, e) {
  const [n, r] = qa(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Co(r, 1) + wn.fromHex(n).toCompactHex();
  return Jg(i);
}
function Y8(t) {
  return K8(t.data);
}
function Z8(t, e, n) {
  return typeof t == "string" && (t = ty(t)), typeof n == "string" && (n = Eh(n)), {
    type: it.Payload,
    payloadType: $t.TokenTransfer,
    recipient: t,
    amount: Ye(e, !1),
    memo: n ?? Eh("")
  };
}
function Q8(t, e, n, r) {
  return typeof t == "string" && (t = hf(t)), typeof e == "string" && (e = Ds(e)), typeof n == "string" && (n = Ds(n)), {
    type: it.Payload,
    payloadType: $t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function xh(t, e, n) {
  return typeof t == "string" && (t = Ds(t)), typeof e == "string" && (e = av(e)), typeof n == "number" ? {
    type: it.Payload,
    payloadType: $t.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: it.Payload,
    payloadType: $t.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function J8() {
  return { type: it.Payload, payloadType: $t.PoisonMicroblock };
}
function Sh(t, e) {
  if (t.byteLength != As)
    throw Error(`Coinbase buffer size must be ${As} bytes`);
  return e != null ? {
    type: it.Payload,
    payloadType: $t.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: it.Payload,
    payloadType: $t.Coinbase,
    coinbaseBytes: t
  };
}
function tv(t, e, n) {
  if (t.byteLength != As)
    throw Error(`Coinbase buffer size must be ${As} bytes`);
  if (n.byteLength != Wl)
    throw Error(`VRF proof buffer size must be ${Wl} bytes`);
  return {
    type: it.Payload,
    payloadType: $t.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === W.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var eu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(eu || (eu = {}));
function ev(t, e, n, r, s, i, o) {
  return {
    type: it.Payload,
    payloadType: $t.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function ly(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case $t.TokenTransfer:
      e.push(Ee(t.recipient)), e.push(os(t.amount, !1, 8)), e.push(hr(t.memo));
      break;
    case $t.ContractCall:
      e.push(hr(t.contractAddress)), e.push(hr(t.contractName)), e.push(hr(t.functionName));
      const n = new Uint8Array(4);
      Os(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ee(r));
      });
      break;
    case $t.SmartContract:
      e.push(hr(t.contractName)), e.push(hr(t.codeBody));
      break;
    case $t.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(hr(t.contractName)), e.push(hr(t.codeBody));
      break;
    case $t.PoisonMicroblock:
      break;
    case $t.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case $t.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ee(t.recipient));
      break;
    case $t.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ee(t.recipient ? oy(t.recipient) : iy())), e.push(t.vrfProof);
      break;
    case $t.TenureChange:
      e.push(ce(t.tenureHash)), e.push(ce(t.previousTenureHash)), e.push(ce(t.burnViewHash)), e.push(ce(t.previousTenureEnd)), e.push(Os(new Uint8Array(4), t.previousTenureBlocks)), e.push(M4(new Uint8Array(1), t.cause)), e.push(ce(t.publicKeyHash));
      break;
  }
  return ve(e);
}
function nv(t) {
  switch (t.readUInt8Enum($t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case $t.TokenTransfer:
      const n = Ln(t), r = Ye(t.readBytes(8), !1), s = fy(t);
      return Z8(n, r, s);
    case $t.ContractCall:
      const i = _i(t), o = kn(t), a = kn(t), c = [], u = t.readUInt32BE();
      for (let E = 0; E < u; E++) {
        const b = Ln(t);
        c.push(b);
      }
      return Q8(i, o, a, c);
    case $t.SmartContract:
      const d = kn(t), l = kn(t, 4, 1e5);
      return xh(d, l);
    case $t.VersionedSmartContract: {
      const E = t.readUInt8Enum(Yl, (O) => {
        throw new Error(`Cannot recognize ClarityVersion: ${O}`);
      }), b = kn(t), k = kn(t, 4, 1e5);
      return xh(b, k, E);
    }
    case $t.PoisonMicroblock:
      return J8();
    case $t.Coinbase: {
      const E = t.readBytes(As);
      return Sh(E);
    }
    case $t.CoinbaseToAltRecipient: {
      const E = t.readBytes(As), b = Ln(t);
      return Sh(E, b);
    }
    case $t.NakamotoCoinbase: {
      const E = t.readBytes(As), b = Ln(t), k = t.readBytes(Wl);
      return tv(E, b, k);
    }
    case $t.TenureChange:
      const g = kt(t.readBytes(20)), h = kt(t.readBytes(20)), x = kt(t.readBytes(20)), A = kt(t.readBytes(32)), T = t.readUInt32BE(), z = t.readUInt8Enum(eu, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), K = kt(t.readBytes(20));
      return ev(g, h, x, A, T, z, K);
  }
}
class wc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ps extends wc {
  constructor(e) {
    super(e);
  }
}
class gn extends wc {
  constructor(e) {
    super(e);
  }
}
class Oa extends wc {
  constructor(e) {
    super(e);
  }
}
class xs extends wc {
  constructor(e) {
    super(e);
  }
}
var Un;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Un || (Un = {}));
function nu(t) {
  return Jg(kt(t.readBytes(gc)));
}
function yi(t, e) {
  return {
    pubKeyEncoding: t,
    type: it.TransactionAuthField,
    contents: e
  };
}
function rv(t) {
  const e = t.readUInt8Enum(Un, (n) => {
    throw new gn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Un.PublicKeyCompressed:
      return yi(ge.Compressed, tu(t));
    case Un.PublicKeyUncompressed:
      return yi(ge.Uncompressed, X8(tu(t).data));
    case Un.SignatureCompressed:
      return yi(ge.Compressed, nu(t));
    case Un.SignatureUncompressed:
      return yi(ge.Uncompressed, nu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function pf(t) {
  return ce(t.data);
}
function sv(t) {
  const e = [];
  switch (t.contents.type) {
    case it.PublicKey:
      e.push(t.pubKeyEncoding === ge.Compressed ? Un.PublicKeyCompressed : Un.PublicKeyUncompressed), e.push(Ha(V8(t.contents.data)));
      break;
    case it.MessageSignature:
      e.push(t.pubKeyEncoding === ge.Compressed ? Un.SignatureCompressed : Un.SignatureUncompressed), e.push(pf(t.contents));
      break;
  }
  return ve(e);
}
function hr(t) {
  switch (t.type) {
    case it.Address:
      return To(t);
    case it.Principal:
      return uy(t);
    case it.LengthPrefixedString:
      return Pi(t);
    case it.MemoString:
      return cv(t);
    case it.AssetInfo:
      return dy(t);
    case it.PostCondition:
      return lv(t);
    case it.PublicKey:
      return Ha(t);
    case it.LengthPrefixedList:
      return wf(t);
    case it.Payload:
      return ly(t);
    case it.TransactionAuthField:
      return sv(t);
    case it.MessageSignature:
      return pf(t);
  }
}
function iv() {
  return {
    type: it.Address,
    version: Ua.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function gf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Jt.SerializeP2PKH || e === Jt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Jt.SerializeP2WPKH || e === Jt.SerializeP2WSH || e === Jt.SerializeP2WSHNonSequential) && !r.every(Ri))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Jt.SerializeP2PKH:
      return eo(t, Iv(r[0].data));
    case Jt.SerializeP2WPKH:
      return eo(t, kv(r[0].data));
    case Jt.SerializeP2SH:
    case Jt.SerializeP2SHNonSequential:
      return eo(t, Lv(n, r.map(Ha)));
    case Jt.SerializeP2WSH:
    case Jt.SerializeP2WSHNonSequential:
      return eo(t, Cv(n, r.map(Ha)));
  }
}
function To(t) {
  const e = [];
  return e.push(ce(Co(t.version, 1))), e.push(ce(t.hash160)), ve(e);
}
function _i(t) {
  const e = hc(kt(t.readBytes(1))), n = kt(t.readBytes(20));
  return { type: it.Address, version: e, hash160: n };
}
function uy(t) {
  const e = [];
  return e.push(t.prefix), e.push(To(t.address)), t.prefix === wo.Contract && e.push(Pi(t.contractName)), ve(e);
}
function ov(t) {
  const e = t.readUInt8Enum(wo, (s) => {
    throw new gn(`Unexpected Principal payload type: ${s}`);
  }), n = _i(t);
  if (e === wo.Standard)
    return { type: it.Principal, prefix: e, address: n };
  const r = kn(t);
  return {
    type: it.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Pi(t) {
  const e = [], n = zi(t.content), r = n.byteLength;
  return e.push(ce(Co(r, t.lengthPrefixBytes))), e.push(n), ve(e);
}
function kn(t, e, n) {
  e = e || 1;
  const r = hc(kt(t.readBytes(e))), s = af(t.readBytes(r));
  return Ds(s, e, n ?? 128);
}
function av(t) {
  return Ds(t, 4, 1e5);
}
function Eh(t) {
  if (t && yy(t, _a))
    throw new Error(`Memo exceeds maximum length of ${_a} bytes`);
  return { type: it.MemoString, content: t };
}
function cv(t) {
  const e = [], n = zi(t.content), r = $v(kt(n), _a * 2);
  return e.push(ce(r)), ve(e);
}
function fy(t) {
  let e = af(t.readBytes(_a));
  return e = e.replace(/\u0000*$/, ""), { type: it.MemoString, content: e };
}
function dy(t) {
  const e = [];
  return e.push(To(t.address)), e.push(Pi(t.contractName)), e.push(Pi(t.assetName)), ve(e);
}
function ru(t) {
  return {
    type: it.AssetInfo,
    address: _i(t),
    contractName: kn(t),
    assetName: kn(t)
  };
}
function yf(t, e) {
  return {
    type: it.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function wf(t) {
  const e = t.values, n = [];
  n.push(ce(Co(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(hr(r));
  return ve(n);
}
function hy(t, e, n) {
  const r = hc(kt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case it.Address:
        s.push(_i(t));
        break;
      case it.LengthPrefixedString:
        s.push(kn(t));
        break;
      case it.MemoString:
        s.push(fy(t));
        break;
      case it.AssetInfo:
        s.push(ru(t));
        break;
      case it.PostCondition:
        s.push(uv(t));
        break;
      case it.PublicKey:
        s.push(tu(t));
        break;
      case it.TransactionAuthField:
        s.push(rv(t));
        break;
    }
  return yf(s, n);
}
function lv(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(uy(t.principal)), (t.conditionType === on.Fungible || t.conditionType === on.NonFungible) && e.push(dy(t.assetInfo)), t.conditionType === on.NonFungible && e.push(Ee(t.assetName)), e.push(t.conditionCode), t.conditionType === on.STX || t.conditionType === on.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ps("The post-condition amount may not be larger than 8 bytes");
    e.push(os(t.amount, !1, 8));
  }
  return ve(e);
}
function uv(t) {
  const e = t.readUInt8Enum(on, (o) => {
    throw new gn(`Could not read ${o} as PostConditionType`);
  }), n = ov(t);
  let r, s, i;
  switch (e) {
    case on.STX:
      return r = t.readUInt8Enum(yo, (a) => {
        throw new gn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${kt(t.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: on.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case on.Fungible:
      return s = ru(t), r = t.readUInt8Enum(yo, (a) => {
        throw new gn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${kt(t.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: on.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case on.NonFungible:
      s = ru(t);
      const o = Ln(t);
      return r = t.readUInt8Enum(Zl, (a) => {
        throw new gn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: it.PostCondition,
        conditionType: on.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function or(t, e) {
  return ve([t, e]);
}
function fv(t) {
  return new Uint8Array([t.type]);
}
function dv(t) {
  return t.type === W.OptionalNone ? new Uint8Array([t.type]) : or(t.type, Ee(t.value));
}
function hv(t) {
  const e = new Uint8Array(4);
  return Os(e, t.buffer.length, 0), or(t.type, pc(e, t.buffer));
}
function pv(t) {
  const e = of(S4(t.value, BigInt(U4)), Vg);
  return or(t.type, e);
}
function gv(t) {
  const e = of(t.value, Vg);
  return or(t.type, e);
}
function yv(t) {
  return or(t.type, To(t.address));
}
function wv(t) {
  return or(t.type, pc(To(t.address), Pi(t.contractName)));
}
function bv(t) {
  return or(t.type, Ee(t.value));
}
function mv(t) {
  const e = [], n = new Uint8Array(4);
  Os(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ee(r);
    e.push(s);
  }
  return or(t.type, ve(e));
}
function xv(t) {
  const e = [], n = new Uint8Array(4);
  Os(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ds(s);
    e.push(Pi(i));
    const o = Ee(t.data[s]);
    e.push(o);
  }
  return or(t.type, ve(e));
}
function py(t, e) {
  const n = [], r = e == "ascii" ? Gg(t.data) : zi(t.data), s = new Uint8Array(4);
  return Os(s, r.length, 0), n.push(s), n.push(r), or(t.type, ve(n));
}
function Sv(t) {
  return py(t, "ascii");
}
function Ev(t) {
  return py(t, "utf8");
}
function Ee(t) {
  switch (t.type) {
    case W.BoolTrue:
    case W.BoolFalse:
      return fv(t);
    case W.OptionalNone:
    case W.OptionalSome:
      return dv(t);
    case W.Buffer:
      return hv(t);
    case W.UInt:
      return gv(t);
    case W.Int:
      return pv(t);
    case W.PrincipalStandard:
      return yv(t);
    case W.PrincipalContract:
      return wv(t);
    case W.ResponseOk:
    case W.ResponseErr:
      return bv(t);
    case W.List:
      return mv(t);
    case W.Tuple:
      return xv(t);
    case W.StringASCII:
      return Sv(t);
    case W.StringUTF8:
      return Ev(t);
    default:
      throw new ps("Unable to serialize. Invalid Clarity Value.");
  }
}
function Av(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ah = /* @__PURE__ */ new Map();
function gy(t, e) {
  const n = Ah.get(t);
  if (n !== void 0)
    return n(e);
  const r = Av(t);
  return Ah.set(t, r), gy(t, e);
}
class oo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return N4(this.readBytes(4), 0);
  }
  readUInt8() {
    return B4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return C4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = kt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = kt(n);
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
    if (gy(e, r))
      return r;
    throw n(r);
  }
}
function Ln(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new oo(ce(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new oo(t) : e = t;
  switch (e.readUInt8Enum(W, (r) => {
    throw new gn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case W.Int:
      return O8(e.readBytes(16));
    case W.UInt:
      return an(e.readBytes(16));
    case W.Buffer:
      const r = e.readUInt32BE();
      return sy(e.readBytes(r));
    case W.BoolTrue:
      return ny();
    case W.BoolFalse:
      return ry();
    case W.PrincipalStandard:
      const s = _i(e);
      return _8(s);
    case W.PrincipalContract:
      const i = _i(e), o = kn(e);
      return ey(i, o);
    case W.ResponseOk:
      return F8(Ln(e));
    case W.ResponseErr:
      return D8(Ln(e));
    case W.OptionalNone:
      return iy();
    case W.OptionalSome:
      return oy(Ln(e));
    case W.List:
      const a = e.readUInt32BE(), c = [];
      for (let A = 0; A < a; A++)
        c.push(Ln(e));
      return j8(c);
    case W.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let A = 0; A < u; A++) {
        const T = kn(e).content;
        if (T === void 0)
          throw new gn('"content" is undefined');
        d[T] = Ln(e);
      }
      return mr(d);
    case W.StringASCII:
      const l = e.readUInt32BE(), g = $4(e.readBytes(l));
      return he(g);
    case W.StringUTF8:
      const h = e.readUInt32BE(), x = af(e.readBytes(h));
      return z8(x);
    default:
      throw new gn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const vv = (t) => t.length % 2 == 0 ? t : `0${t}`, $v = (t, e) => t.padEnd(e, "0"), yy = (t, e) => t ? zi(t).length > e : !1;
function su(t) {
  return Pp(t);
}
const bo = (t) => t8(df(t)), bf = (t) => kt(B8(t)), Iv = (t) => kt(bo(t)), kv = (t) => {
  const e = bo(t), n = pc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = bo(n);
  return kt(r);
}, Lv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = ve(n), s = bo(r);
  return kt(s);
}, Cv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = ve(n), s = df(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = ve(i), a = bo(o);
  return kt(a);
};
function Tv(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function wy(t) {
  const e = Ee(t);
  return `0x${kt(e)}`;
}
function Bv(t) {
  return Ln(t);
}
const bi = (t) => {
  try {
    return Xs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function mf() {
  return {
    type: it.MessageSignature,
    data: kt(new Uint8Array(gc))
  };
}
function by(t, e, n, r) {
  const s = gf(0, t, 1, [Ni(e)]).hash160, i = Ri(Ni(e)) ? ge.Compressed : ge.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ye(n, !1),
    fee: Ye(r, !1),
    keyEncoding: i,
    signature: mf()
  };
}
function mo(t) {
  return "signature" in t;
}
function vh(t) {
  return t === Jt.SerializeP2SH || t === Jt.SerializeP2WSH;
}
function Mv(t) {
  return t === Jt.SerializeP2SHNonSequential || t === Jt.SerializeP2WSHNonSequential;
}
function $h(t) {
  const e = su(t);
  return e.nonce = 0, e.fee = 0, mo(e) ? e.signature = mf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Nv(t) {
  const e = [
    t.hashMode,
    ce(t.signer),
    os(t.nonce, !1, 8),
    os(t.fee, !1, 8),
    t.keyEncoding,
    pf(t.signature)
  ];
  return ve(e);
}
function _v(t) {
  const e = [
    t.hashMode,
    ce(t.signer),
    os(t.nonce, !1, 8),
    os(t.fee, !1, 8)
  ], n = yf(t.fields);
  e.push(wf(n));
  const r = new Uint8Array(2);
  return T4(r, t.signaturesRequired, 0), e.push(r), ve(e);
}
function Pv(t, e) {
  const n = kt(e.readBytes(20)), r = BigInt(`0x${kt(e.readBytes(8))}`), s = BigInt(`0x${kt(e.readBytes(8))}`), i = e.readUInt8Enum(ge, (a) => {
    throw new gn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Jt.SerializeP2WPKH && i != ge.Compressed)
    throw new gn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = nu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function Uv(t, e) {
  const n = kt(e.readBytes(20)), r = BigInt("0x" + kt(e.readBytes(8))), s = BigInt("0x" + kt(e.readBytes(8))), i = hy(e, it.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case it.PublicKey:
        Ri(u.contents) || (o = !0);
        break;
      case it.MessageSignature:
        if (u.pubKeyEncoding === ge.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new xs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Jt.SerializeP2WSH || t === Jt.SerializeP2WSHNonSequential))
    throw new xs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Xc(t) {
  return mo(t) ? Nv(t) : _v(t);
}
function qc(t) {
  const e = t.readUInt8Enum(Jt, (n) => {
    throw new gn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Jt.SerializeP2PKH || e === Jt.SerializeP2WPKH ? Pv(e, t) : Uv(e, t);
}
function my(t, e, n, r) {
  const i = t + kt(new Uint8Array([e])) + kt(os(n, !1, 8)) + kt(os(r, !1, 8));
  if (ce(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return bf(ce(i));
}
function xy(t, e, n) {
  const r = 33 + gc, s = Ri(e) ? ge.Compressed : ge.Uncompressed, i = t + vv(s.toString(16)) + n.data, o = ce(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return bf(o);
}
function Hv(t, e, n, r, s) {
  const i = my(t, e, n, r), o = W8(s, i), a = Y8(s), c = xy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Sy(t, e, n, r, s, i) {
  const o = my(t, e, n, r), a = Ni(R8(o, i, s)), c = xy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Ov() {
  const t = by(Jt.SerializeP2PKH, "", 0, 0);
  return t.signer = iv().hash160, t.keyEncoding = ge.Compressed, t.signature = mf(), t;
}
function Ih(t, e, n) {
  return mo(t) ? Dv(t, e, n) : Fv(t, e, n);
}
function Dv(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Sy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = gf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new xs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Fv(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case it.PublicKey:
        Ri(c.contents) || (i = !0), r.push(c.contents);
        break;
      case it.MessageSignature:
        c.pubKeyEncoding === ge.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = Sy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (vh(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new xs("Too many signatures");
        break;
    }
  if (vh(t.hashMode) && o !== t.signaturesRequired || Mv(t.hashMode) && o < t.signaturesRequired)
    throw new xs("Incorrect number of signatures");
  if (i && (t.hashMode === Jt.SerializeP2WSH || t.hashMode === Jt.SerializeP2WSHNonSequential))
    throw new xs("Uncompressed keys are not allowed in this hash mode");
  const a = gf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new xs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Ey(t) {
  return {
    authType: we.Standard,
    spendingCondition: t
  };
}
function Ay(t, e) {
  return {
    authType: we.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || by(Jt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function kh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case we.Standard:
        return Ey($h(t.spendingCondition));
      case we.Sponsored:
        return Ay($h(t.spendingCondition), Ov());
      default:
        throw new Oa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function jv(t, e) {
  switch (t.authType) {
    case we.Standard:
      return Ih(t.spendingCondition, e, we.Standard);
    case we.Sponsored:
      return Ih(t.spendingCondition, e, we.Standard);
    default:
      throw new Oa("Invalid origin auth type");
  }
}
function zv(t, e) {
  switch (t.authType) {
    case we.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ye(e, !1)
      };
      return { ...t, spendingCondition: n };
    case we.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ye(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Rv(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ye(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Gv(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ye(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Kv(t, e) {
  const n = {
    ...e,
    nonce: Ye(e.nonce, !1),
    fee: Ye(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Vv(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case we.Standard:
      e.push(Xc(t.spendingCondition));
      break;
    case we.Sponsored:
      e.push(Xc(t.spendingCondition)), e.push(Xc(t.sponsorSpendingCondition));
      break;
  }
  return ve(e);
}
function Xv(t) {
  const e = t.readUInt8Enum(we, (r) => {
    throw new gn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case we.Standard:
      return n = qc(t), Ey(n);
    case we.Sponsored:
      n = qc(t);
      const r = qc(t);
      return Ay(n, r);
  }
}
class qv {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ye(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? _4, this.postConditionMode = i ?? Mi.Deny, this.postConditions = s ?? yf([]), o)
      this.anchorMode = D4(o);
    else
      switch (r.payloadType) {
        case $t.Coinbase:
        case $t.CoinbaseToAltRecipient:
        case $t.NakamotoCoinbase:
        case $t.PoisonMicroblock:
        case $t.TenureChange:
          this.anchorMode = sn.OnChainOnly;
          break;
        case $t.ContractCall:
        case $t.SmartContract:
        case $t.VersionedSmartContract:
        case $t.TokenTransfer:
          this.anchorMode = sn.Any;
          break;
      }
  }
  signBegin() {
    const e = su(this);
    return e.auth = kh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = su(this);
    return e.auth = kh(e.auth), e.txid();
  }
  verifyOrigin() {
    return jv(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, we.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === we.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, we.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !mo(n)) {
      const r = Ri(e);
      n.fields.push(yi(r ? ge.Compressed : ge.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = Hv(n, r, e.fee, e.nonce, s);
    return mo(e) ? e.signature = i : e.fields.push(yi(s.data.byteLength === Kg ? ge.Compressed : ge.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return bf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != we.Sponsored)
      throw new Oa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Kv(this.auth, e);
  }
  setFee(e) {
    this.auth = zv(this.auth, e);
  }
  setNonce(e) {
    this.auth = Rv(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != we.Sponsored)
      throw new Oa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Gv(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ps('"version" is undefined');
    if (this.chainId === void 0)
      throw new ps('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ps('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ps('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ps('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Os(n, this.chainId, 0), e.push(n), e.push(Vv(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(wf(this.postConditions)), e.push(ly(this.payload)), ve(e);
  }
}
function Da(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new oo(ce(t.slice(2))) : e = new oo(ce(t)) : t instanceof Uint8Array ? e = new oo(t) : e = t;
  const n = e.readUInt8Enum(Pa, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Xv(e), i = e.readUInt8Enum(sn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Mi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = hy(e, it.PostCondition), c = nv(e);
  return new qv(n, s, c, a, o, i, r);
}
const Wv = U8, ao = an, Yv = sy;
const Zv = /* @__PURE__ */ new Set([4001, -31001]), Qv = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Jv = ["result", "data", "payload", "response", "params"], Lh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], bc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Zs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, yr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, t6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), vy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => t6(i, r)) === s
  );
}, $y = (t) => t ? vy(Zs()).some(
  (e) => {
    var n;
    return e.id === t && (bc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Iy = () => {
  if (typeof window > "u")
    return;
  const t = Zs(), e = vy(t).filter(
    (n) => {
      var r;
      return bc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = yr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Qv) {
    const r = yr(t, n) ?? (t === window ? void 0 : yr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, e6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Zs(), n = yr(e, t) ?? (e === window ? void 0 : yr(window, t)) ?? sc(t);
  if (n)
    return n;
  if (bc(t) || $y(t))
    return Iy();
}, ia = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, n6 = ["blockstack-session", "blockstack"], r6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of n6) {
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
r6();
const ky = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, pn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, s6 = (t) => {
  const e = pn(t);
  if (!e)
    return null;
  const n = ky(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, i6 = (t) => {
  const e = pn(t);
  if (!e)
    return null;
  const n = ky(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, iu = (t, e = "mainnet") => {
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
      return iu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return iu(r, e);
  }
  return e;
}, vs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, xo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return bi(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = xo(s, e + 1);
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
    const i = xo(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && bi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && bi(n.testnet) ? n.testnet.trim() : null;
}, Ch = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ly = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && Zv.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Fs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = pn(n == null ? void 0 : n.message) ?? pn(e.message) ?? pn(e.error) ?? pn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Ui = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Fs(e);
    if (e.status === "error")
      throw Fs(e.result ?? e);
  }
  return t;
}, Th = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Ui(r);
  } catch (r) {
    throw Fs(r);
  }
}, Cy = () => Iy(), xf = () => {
  if (typeof window > "u")
    return;
  const t = Zs();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = yr(t, e) ?? (t === window ? void 0 : yr(window, e));
    if (n)
      return n;
  }
}, Bh = () => {
  if (typeof window > "u")
    return;
  const t = xf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Zs();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = yr(e, n) ?? (e === window ? void 0 : yr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ga = (t) => {
  var r, s;
  const e = Bs();
  if (bc(e) || $y(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Zs() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Cy();
}, Wc = (t) => {
  const e = i6(t);
  if (!e)
    return null;
  try {
    const n = Da(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Fa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Wc(t), r = s6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? pn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Fa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Lh)
    if (Wc(s[a])) {
      i = pn(s[a]);
      break;
    }
  const o = pn(s.txId) || pn(s.txid) || pn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? pn(s.txRaw) ?? void 0
    };
  for (const a of Lh) {
    const c = Wc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: pn(s[a]) ?? void 0
      };
  }
  for (const a of Jv) {
    const c = s[a], u = Fa(c, e + 1);
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
}, Yc = (t) => {
  const e = Fa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, o6 = (t) => {
  const e = Fa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, a6 = (t) => ({
  ...t,
  fee: vs(t.fee),
  nonce: vs(t.nonce),
  sponsored: t.sponsored === !0
}), Mh = (t) => ({
  recipient: t.recipient,
  amount: vs(t.amount) ?? "0",
  memo: t.memo,
  network: iu(t.network),
  address: t.stxAddress,
  fee: vs(t.fee),
  nonce: vs(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ty = "WALLET_ADDRESS_MISMATCH", c6 = 45e3;
let co = null;
const ou = (t) => {
  t && (co = { address: t, at: Date.now() });
}, l6 = () => {
  co = null;
}, u6 = () => co && Date.now() - co.at <= c6 ? co.address : null, f6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, d6 = async (t) => {
  l6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Ui(await t.request("wallet_connect")), n = xo(e);
  return ou(n), n;
}, h6 = async (t, e, n, r) => {
  try {
    return Ui(await t.request(e, n));
  } catch (s) {
    const i = Fs(s);
    if (!f6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await d6(t);
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
        { code: o ? Ty : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Ui(await t.request(e, n));
    } catch (a) {
      throw Fs(a);
    }
  }
};
let Nh = 3e4;
const p6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Nh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Nh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, g6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ty }
      );
    return c;
  }, s = u6();
  if (s)
    return ia(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  ia(n, "account-read");
  try {
    const c = Ui(
      await p6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = xo(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Ly(c))
      throw Fs(c);
    ia(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return ou(i), r(i, "wallet_getAccount");
  let o;
  ia(n, "account-reconnect");
  try {
    o = Ui(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Fs(c);
  }
  const a = xo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return ou(a), r(a, "wallet_connect");
}, y6 = async (t, e) => {
  if (!ga(t)) {
    const i = await Th(
      t,
      "stx_transferStx",
      Mh(e)
    );
    return Yc(i);
  }
  const n = xf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Th(
      n,
      "stx_transferStx",
      Mh(e)
    );
    return Yc(i);
  }
  const r = Cy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await g6(r, e.stxAddress);
  const s = await h6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: vs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: vs(e.fee) } : {}
    },
    e.stxAddress
  );
  return Yc(s);
}, w6 = () => Bs(), By = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Bs(), e = t ? e6(t) : void 0;
  if (e)
    return e;
  const n = Zs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, _h = (t, e) => {
  const n = By(), r = a6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, o6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ea(r, e);
  if (ga(n) && !xf()) {
    const s = Bh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Bs(),
        route: "legacy-transaction-request"
      }), ea(r, s);
  }
  return void y6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Ch(s) && ga(n)) {
      const a = Bh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Bs(),
          route: "legacy-transaction-request"
        }), ea(r, a);
        return;
      }
    }
    if (Ch(s) && !ga(n)) {
      ea(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Ly(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Ph = (t) => wy(t).replace(/^0x/, ""), Uh = "This wallet cannot sign messages. Try Xverse or Leather.", Hh = (t) => typeof (t == null ? void 0 : t.request) == "function", Oh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", b6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, m6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function x6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Ph(e.message),
    domain: Ph(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function S6(t, e) {
  const n = await p4({
    domain: e.domain,
    message: e.message,
    network: dc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Dh(t) {
  var s, i;
  const e = w6() || "", n = /xverse/i.test(e);
  let r = By();
  if (n && !Oh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Oh(r))
    try {
      return await S6(r, t);
    } catch (o) {
      if (n || !Hh(r) || !m6(o)) throw o;
    }
  if (!n && Hh(r))
    try {
      return await x6(r, t);
    } catch (o) {
      throw b6(o) ? new Error(Uh) : o;
    }
  throw new Error(Uh);
}
const Fh = 1000000n, Ss = 1000000n, ja = 50n, Ue = 3000n, cs = 300n, Qi = 3000n, E6 = 50000n, Zc = 200n, mc = 15000n, yn = (t) => t + ja;
function Mn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Fh}.${(n % Fh).toString().padStart(6, "0")}`;
}
function jh(t, e = cs) {
  return t <= Ue ? 0 : Number((t - Ue) / yn(e));
}
function Qc(t, e = 0n) {
  const n = Ss - t - e;
  return n > 0n ? n : 0n;
}
function A6(t, e = cs) {
  return t > Ss ? "over" : t < Ue + yn(e) ? "empty" : t < E6 ? "low" : "ok";
}
const v6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", $6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", I6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function k6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || I6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== v6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const My = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Jc = 3, L6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [au, Ny] = My.split("."), vn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function cu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function C6(t) {
  return vn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ss(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function _y(t, e = []) {
  const n = await ss(`/v2/contracts/call-read/${au}/${Ny}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: au, arguments: e.map((r) => "0x" + vn(Ee(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Qn(Ln(n.result));
}
async function T6() {
  const t = await ss(`/v2/contracts/source/${au}/${Ny}?proof=0`);
  if (typeof t.source != "string" || await C6(t.source) !== $6) throw Error("Deployed source does not match the tested helper.");
  if (k6(await _y("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Py(t) {
  return t.startsWith("SP") && bi(t) && !t.includes(".");
}
async function B6(t) {
  var r;
  if (!Py(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ss(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ss(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function M6(t) {
  const e = await ss(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function N6(t, e) {
  var s, i;
  const n = await _y("get-owner", [ao(t), ao(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Py(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function _6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: cu(t), signal: AbortSignal.timeout(15e3) });
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
async function P6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function U6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Da(cu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || gi(eo(Ua.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || gi(r.contractAddress) + "." + r.contractName.content !== My || r.functionName.content !== "play" || r.functionArgs.length !== 3 || vn(Ee(r.functionArgs[0])) !== vn(Ee(ao(t.core))) || vn(Ee(r.functionArgs[1])) !== vn(Ee(ao(t.song))) || vn(Ee(r.functionArgs[2])) !== vn(Ee(Yv(cu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Mi.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== yo.Equal || i.principal.prefix !== 2 || gi(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || gi(r.contractAddress) + "." + r.contractName.content !== L6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || vn(Ee(r.functionArgs[0])) !== vn(Ee(ao(t.song))) || typeof t.liked != "boolean" || vn(Ee(r.functionArgs[1])) !== vn(Ee(Wv(t.liked))) || t.amount !== "0" || e.postConditionMode !== Mi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Qn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const H6 = "xtrata.xyz/radio/listening-wallet", O6 = "Link a temporary listening wallet for pay-per-play; no spending permission", js = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && bi(t), D6 = (t) => ({
  domain: mr({ name: he(H6), version: he("1"), "chain-id": an(1) }),
  message: mr({
    purpose: he(O6),
    main: he(t.main),
    listening: he(t.listening),
    issued: an(t.issued)
  })
}), Uy = 100000n, F6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function j6(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !js(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Uy).sort(F6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const oa = 50;
function za(t) {
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
async function z6(t, e, n = 4) {
  if (!js(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${oa}&offset=${o}`, s = za(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - oa);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= oa ? s : za(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = j6(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - oa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const ur = 50, R6 = 6, G6 = 20, zh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Rh(t, e) {
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
async function K6(t, e, n) {
  if (!js(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = za(await e(`/extended/v1/address/${t}/stx_inbound?limit=${ur}&offset=0`));
    if (!s || s.total > R6 * ur) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = ur; o < s.total; o += ur) {
      const a = za(await e(`/extended/v1/address/${t}/stx_inbound?limit=${ur}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${ur}&offset=${u}`, a = Rh(await e(o(0)), t);
      if (!a || a.total > G6 * ur) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = ur; u < a.total; u += ur) {
        const d = Rh(await e(o(u)), t);
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
function V6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(zh).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : js(l.sender) && h >= Uy ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && js(l.recipient) && l.amount > 0n).sort(zh), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, g) => {
    let h = g;
    for (const x of l) {
      if (h <= 0n) break;
      const A = x.left < h ? x.left : h;
      x.left -= A, h -= A;
    }
    return h;
  };
  for (const l of o) {
    const g = u(s.filter((h) => h.to === l.recipient), l.amount);
    g > 0n && u(s, g);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, h = d.get(g);
    h ? (h.amount += l.left, h.newest = Math.max(h.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function X6(t, e) {
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
function Gh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const lu = [50000n, 100000n, 250000n], Ji = ["prepared", "signed", "unknown", "pending"], q6 = 30 * 6e4, Kh = 6e4, ci = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, W6 = 3e3, Vh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", tl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function Y6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, g = !1, h = null, x = !1, A = "", T = "", z = 0, K, E = null, b, k = [], O, R = -1 / 0;
  const j = /* @__PURE__ */ new Set();
  let X = null, v = !1, M = 0, N = null, F = null, Y = !1, V = null, jt = !1, dt = null, Te = !1, I = !1, P = !1, ut = !1, vt = !1, Lt = 0, zt = null, re = Promise.resolve();
  const Ut = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? cs.toString()), Wt = (w) => !!i && !(i.features ?? []).includes(w), me = (w, $) => `xtrata.ppp.v1.${w}:${$}`, Re = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const $ = JSON.parse(t.store.get(me("entries", w)) || "[]");
      return Array.isArray($) ? $ : [];
    } catch {
      return [];
    }
  }, Ht = (w) => {
    const $ = [w, ...Re(w.address).filter((D) => !(D.txid === w.txid && D.kind === w.kind))].slice(0, 200);
    t.store.set(me("entries", w.address), JSON.stringify($));
  }, Ze = (w = i == null ? void 0 : i.address) => !!w && t.store.get(me("on", w)) !== "0", Ie = (w) => {
    i != null && i.address && t.store.set(me("on", i.address), w ? "1" : "0");
  }, Ge = () => Re().filter((w) => Ji.includes(w.status)), xn = () => Zt() ? [...Ge(), ...Re(ie()).filter((w) => Ji.includes(w.status))] : Ge(), Ne = () => Oe(i == null ? void 0 : i.address), Oe = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(me("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, ke = (w, $ = i == null ? void 0 : i.address) => {
    $ && t.store.set(me("deposit", $), JSON.stringify(w));
  };
  let Yt = null;
  const ln = (w = Kh) => {
    const $ = t.now();
    Yt = { since: Yt && $ < Yt.until ? Yt.since : $, until: Math.max((Yt == null ? void 0 : Yt.until) ?? 0, $ + w) };
  }, Qe = () => !!Yt && t.now() < Yt.until && (o === void 0 || o < Ue + yn(Ut())), De = () => !!Ne() || Qe(), ie = () => Wt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Zt = () => !!(i != null && i.address) && ie() !== i.address, le = () => Zt() ? c && c.for === ie() ? c.value : void 0 : o, Be = (w) => w !== void 0 && w < Ue + Zc, te = () => Ge().filter((w) => t.now() - w.created > q6 && j.has(w.txid)), Ke = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Rt = () => Ke() && !(i != null && i.linked), Fe = () => {
    const w = t.main();
    return !Rt() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, y = (w) => me("return-to", w), S = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const $ = t.store.get(y(w));
    return $ && js($) && $ !== w ? $ : void 0;
  }, f = (w = i == null ? void 0 : i.address) => X && X.for === w ? X.res : null;
  function G() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = S();
    if (w) return { to: w, kind: "chosen" };
    const $ = f();
    if ($ != null && $.ok && $.funder) return { to: $.funder, kind: "funder" };
  }
  const m = (w) => me("gift", w);
  function L() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((V == null ? void 0 : V.for) === w) return V.info;
    try {
      const $ = JSON.parse(t.store.get(m(w)) || "null");
      return $ && typeof $.returnTo == "string" && typeof $.treasury == "string" ? $ : null;
    } catch {
      return null;
    }
  }
  async function B() {
    var ct;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((ct = e == null ? void 0 : e.gifts) != null && ct.enabled) || jt) return;
    const $ = (V == null ? void 0 : V.for) === w ? V : null, D = $ ? $.ok ? $.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if ($ && t.now() - $.at < D) return;
    jt = !0;
    const J = L();
    try {
      const U = await t.giftInfo(w);
      V = { for: w, info: U, ok: !0, at: t.now() }, t.store.set(m(w), JSON.stringify(U));
    } catch {
      V = { for: w, info: J, ok: !1, at: t.now() };
    } finally {
      jt = !1;
    }
  }
  const H = () => Re().reduce((w, $) => Ji.includes($.status) ? w + BigInt($.amount || "0") + BigInt($.fee || "0") : w, 0n);
  function Q() {
    if (o === void 0) return 0;
    const w = o - H() - BigInt(se.length) * yn(Ut());
    return w > 0n ? jh(w, Ut()) : 0;
  }
  const ot = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", _t = "EMPTY — ADD STX TO PLAY";
  function wt() {
    var D;
    const w = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((D = L()) != null && D.player) && !w) return null;
    const $ = (J, ct) => ({ reason: J, text: ct });
    switch (at()) {
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
        return De() ? $("arriving", "YOUR PLAYS ARE ARRIVING") : $("out", Zt() ? ot : _t);
      case "ready":
        return !Ze() || !(i != null && i.session) || i.session.playsLeft < 1 ? $("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : P ? Q() < 1 ? $("out", Zt() ? ot : _t) : null : $("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Xt = () => {
    var w;
    return !!(i != null && i.address) && Zt() && !!((w = L()) != null && w.player);
  };
  function ue() {
    return Xt() ? { locked: !0, known: !0 } : null;
  }
  const Gt = 3 * 6e4, xe = () => !!L() && !!t.history && !(i != null && i.linked);
  async function Ct() {
    const w = i.address, $ = L(), { balance: D, nonce: J } = await t.chain.account(w), ct = await t.history(w, !0);
    if (!ct.ok) return null;
    const U = V6({ self: w, balance: D, inbound: ct.inbound, outgoing: ct.outgoing, gift: { sender: $.treasury, payer: $.returnTo } });
    if (!U.ok) return null;
    const ht = X6(U.parts, Qi);
    return { balance: D, nonce: J, parts: U.parts, steps: ht.steps, tooSmall: ht.tooSmall.length };
  }
  const Z = () => Te ? { state: "unavailable" } : !dt || t.now() - dt.at > Gt || o !== void 0 && o !== dt.balance ? { state: "none" } : dt.plan;
  function at() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!Rt()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : Fe() ? "wrong-wallet" : i.state === "known" ? "locked" : !Rt() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > Ss ? "over" : o < Ue + yn(Ut()) ? "fund" : "ready" : "loading";
  }
  const yt = () => {
    var w, $, D, J, ct;
    return {
      step: at(),
      busy: u,
      message: A,
      error: T,
      notice: Tt(),
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : A6(o, Ut()),
      playsLeft: o === void 0 ? 0 : jh(o, Ut()),
      allowance: o === void 0 ? Ss : Qc(o, BigInt(((w = Ne()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Ze(),
      entries: Re(),
      depositTxid: (($ = Ne()) == null ? void 0 : $.txid) ?? K,
      depositPending: De(),
      arrival: De() ? { since: ((D = Ne()) == null ? void 0 : D.at) ?? (Yt == null ? void 0 : Yt.since) ?? t.now(), graceMs: Kh } : null,
      walletOutdated: Wt("like"),
      linkedListening: O && O === t.main() ? k.map((U) => U.listening) : [],
      serverLinked: !!E && b === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: te().length,
      armed: ut,
      queued: se.length,
      solo: Rt(),
      returnTo: (J = G()) == null ? void 0 : J.to,
      returnToKind: (ct = G()) == null ? void 0 : ct.kind,
      funderState: (() => {
        const U = f();
        return U ? U.ok ? U.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const U = f();
        return !!U && U.ok && U.distinct > 1;
      })(),
      walletCannotSolo: Rt() && Wt("standalone"),
      walletCannotMulti: Wt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((U) => U !== t.main() && U !== (i == null ? void 0 : i.linked)),
      creditedTo: Rt() && (i != null && i.address) && (N == null ? void 0 : N.for) === i.address && N.main ? N.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(me("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (F == null ? void 0 : F.for) === i.address && F.unused,
      gift: (() => {
        const U = L();
        return U ? { player: U.player, from: U.from, source: U.source, amount: U.amount } : null;
      })(),
      giftPlays: L() ? Q() : 0,
      giftStop: wt(),
      albumLock: ue(),
      returnPlan: Z(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Wt("slots"),
      likeFunds: (() => {
        var pt;
        const U = ie();
        if (!U || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const ht = le();
        return { address: U, balance: ht, low: Be(ht), album: Zt(), pending: !!Oe(U), txid: (pt = Oe(U)) == null ? void 0 : pt.txid, main: t.main() };
      })()
    };
  }, Tt = () => z ? z < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ft = (w, $ = "") => {
    A = w, T = $, t.changed();
  };
  async function fe(w, $) {
    if (!u) {
      u = w, T = "", t.changed();
      try {
        await $();
      } catch (D) {
        const J = D instanceof Error ? D.message : String(D);
        T = /Cancelled in the listening wallet/.test(J) ? "" : J, T || (A = "Not now. Nothing was signed.", vt = !0);
      } finally {
        u = null, await Sn(!0);
      }
    }
  }
  const Mt = () => !!(e != null && e.enabled) && e.here && (Rt() || !!t.main() && e.allowed), Dt = () => Mt() && !Fe(), ee = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ot = () => {
    if (Fe()) throw new Error(ee());
  };
  async function Je() {
    if (!Mt()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const $e = (w) => {
    const $ = t.main();
    return w.request("listening.status", $ ? { main: $ } : void 0);
  };
  async function Cn(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Fn(w)));
  }
  async function Fn(w = !1) {
    const $ = ie();
    if (!(!Zt() || !$ || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === $ && t.now() - c.at < 3e4))
      try {
        c = { for: $, value: await t.chain.balance($), at: t.now() };
      } catch {
      }
  }
  async function Sr(w) {
    if ((O !== w || t.now() - R >= 6e4) && (k = await t.links(w), O = w, R = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const $ = `${w}:${i.address}`;
    b === $ && E || (E = k.find((D) => D.listening === i.address) ?? null, b = $);
  }
  async function jn() {
    const w = i == null ? void 0 : i.address;
    if (!Rt() || !w || i != null && i.linked || !t.funder || v || !o || o <= 0n) return;
    const $ = f(w);
    if ($ != null && $.ok && $.funder) return;
    const D = $ != null && $.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, M - 1), 30 * 6e4);
    if (!(X && X.for === w && t.now() - X.at < D)) {
      v = !0;
      try {
        X = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        X = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        v = !1;
      }
      M = X.res.ok ? 0 : M + 1;
    }
  }
  async function Qs() {
    const w = i == null ? void 0 : i.address;
    if (!(!Rt() || !w || i != null && i.linked || !t.mainOf || Y) && !(N && N.for === w && (N.ok || t.now() - N.at < 6e4))) {
      Y = !0;
      try {
        N = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        N = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        Y = !1;
      }
    }
  }
  async function Js() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (F == null ? void 0 : F.for) === w) && t.store.get(me("created", w)) !== "1")
      try {
        F = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function ti() {
    var ct;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let $, D = !1;
    const J = /* @__PURE__ */ new Map();
    for (const U of xn())
      try {
        const ht = await t.chain.transaction(U.txid);
        if (!ht) {
          if (j.add(U.txid), t.now() - U.created > 15 * 6e4 && !J.has(U.address) && J.set(U.address, await t.chain.confirmedNonce(U.address)), $ = J.get(U.address), $ !== void 0 && $ > BigInt(U.nonce)) {
            Ht({ ...U, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((U.status === "unknown" || U.status === "signed") && U.raw)
            try {
              await t.chain.broadcast(U.raw, U.txid), Ht({ ...U, status: "pending" });
            } catch (gt) {
              ci(gt) && Ht({ ...U, status: "failed", note: gt.message, raw: void 0 });
            }
          continue;
        }
        j.delete(U.txid);
        const pt = String(ht.tx_status);
        if (pt === "success" && ht.canonical !== !1 && ht.is_unanchored === !1) {
          if (Ht({ ...U, status: "confirmed", confirmedAt: t.now(), actualFee: String(ht.fee_rate ?? U.fee), raw: void 0 }), D = !0, U.kind === "like" && (x = !0, U.status !== "confirmed" && typeof U.liked == "boolean"))
            try {
              (ct = t.likeConfirmed) == null || ct.call(t, U.song, U.liked);
            } catch {
            }
        } else pt.startsWith("abort_") || pt.startsWith("dropped_") ? Ht({ ...U, status: "failed", note: pt, raw: void 0 }) : U.status !== "pending" && Ht({ ...U, status: "pending" });
      } catch {
      }
    for (const U of Zt() ? [w, ie()] : [w]) {
      const ht = Oe(U);
      if (ht)
        try {
          const pt = await t.chain.transaction(ht.txid), gt = String((pt == null ? void 0 : pt.tx_status) ?? "");
          (gt === "success" && pt.is_unanchored === !1 || gt.startsWith("abort_") || gt.startsWith("dropped_") || !pt && t.now() - ht.at > 2 * 36e5) && (ke(null, U), gt === "success" && ln(2e4), a = -1 / 0, c = null, /on its way/i.test(A) && (A = ""));
        } catch {
        }
    }
    return D;
  }
  async function Sn(w = !1) {
    var $;
    try {
      const D = t.main();
      if ((w || !e || r !== D || t.now() - n > 3e5) && (e = await t.config(D), n = t.now(), r = D), !e.enabled || !e.here || !Rt() && (!D || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ut && Er(), t.changed();
        return;
      }
      await Je(), i = await $e(s), Fe() && i.state === "unlocked" && (ri(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await $e(s)), D && e.allowed && await Sr(D), await Cn(w), await jn(), await Qs(), await Js(), await B(), await ti() && await Cn(!0), await Fn(), await Le(), z = 0;
    } catch {
      z++;
    }
    if (at() === "locked" ? ni() : ut && Er(), x) {
      x = !1;
      try {
        ($ = t.likesChanged) == null || $.call(t);
      } catch {
      }
    }
    t.changed(), se.length && !Tn && Vi();
  }
  async function ei(w) {
    const $ = i == null ? void 0 : i.root;
    if (!$ || i != null && i.slot || !(i != null && i.address) || Wt("slots")) return;
    const D = Number(t.store.get(me("slot", $)));
    if (!(!Number.isSafeInteger(D) || D < 1))
      try {
        const { balance: J } = await t.chain.account(i.address);
        if (J >= Ue + yn(Ut())) return;
        await w.request("listening.openSlot", { slot: D }), i = await $e(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function En(w, $) {
    var U;
    Ot();
    const D = !(i != null && i.address) || Ze(i.address), J = i != null && i.linked ? (U = t.nameOf) == null ? void 0 : U.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: D ? Ar() : void 0, anyPasskey: $, ...t.main() ? { main: t.main() } : {}, ...J ? { label: J } : {} }), i = await $e(w), D && (Ze(i.address) ? await vr() : await w.request("listening.stop")), await ei(w), ft(D ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ct = h;
    h = null, ct && t.now() - ct.at < 12e4 && setTimeout(() => void Sn(!0).then(() => si(ct)), 0);
  }
  function ni() {
    ut || u || vt || Lt >= 3 || !s || !(i != null && i.address) || (ut = !0, re = (async () => {
      try {
        await En(s, !1), Lt = 0;
      } catch (w) {
        const $ = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test($) ? zt || (vt = !0, ft("Not now. Nothing was signed.")) : /did not answer/.test($) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Lt++, T = $);
      } finally {
        ut = !1;
        const w = zt;
        zt = null, w ? await w() : await Sn(!0);
      }
    })());
  }
  async function Er(w) {
    ut && (zt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await re), w && await w(), t.changed();
  }
  const Ar = () => ({
    fee: Ut().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ss.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function vr() {
    if (!(i != null && i.address)) return !1;
    if (P || (P = await t.tabLock(i.address)), !P)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function $r(w, $) {
    const D = i.address, { balance: J, nonce: ct } = $ ?? await t.chain.account(D);
    o = J;
    const U = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: J.toString(),
      nonce: ct.toString(),
      fee: Qi.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (U.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ht = w.mode === "amount" ? w.amount : w.mode === "all" ? J - Qi : J - Ss - Qi, pt = Da(U.raw);
    if (Qn(pt.payload.recipient).value !== w.to || String(pt.payload.amount) !== U.amount || ht !== void 0 && U.amount !== ht.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const gt = {
      id: tl(),
      address: D,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: U.recipient,
      amount: U.amount,
      fee: U.fee,
      nonce: ct.toString(),
      created: t.now(),
      status: "signed",
      raw: U.raw,
      txid: U.txid
    };
    t.validate(gt), Ht(gt);
    try {
      await t.chain.broadcast(U.raw, U.txid), Ht({ ...gt, status: "pending" });
    } catch (Kt) {
      throw Ht({ ...gt, status: "unknown", note: Kt.message }), Kt;
    }
    return U;
  }
  const ls = mc, ar = Qi;
  async function zn(w, $, D) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Wt("slots") || Wt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const J = i.slot ?? 0;
    if (w === $ || ![w, $].includes(J) || ![w, $].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const ct = i.root ?? i.address, U = w === 0 ? ct : i.address, ht = $ === 0 ? ct : i.address, { balance: pt, nonce: gt } = await t.chain.account(U);
    if (pt < D + ar + Ue) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Kt = await s.request("listening.signMove", { from: w, to: $, amount: D.toString(), fee: ar.toString(), nonce: gt.toString(), balance: pt.toString() }), _e = Da(Kt.raw);
    if (Kt.from !== U || Kt.to !== ht || Kt.amount !== D.toString() || Qn(_e.payload.recipient).value !== ht || String(_e.payload.amount) !== D.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const un = {
      id: tl(),
      address: U,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ht,
      amount: Kt.amount,
      fee: Kt.fee,
      nonce: gt.toString(),
      created: t.now(),
      status: "signed",
      raw: Kt.raw,
      txid: Kt.txid
    };
    t.validate(un), Ht(un);
    try {
      await t.chain.broadcast(Kt.raw, Kt.txid), Ht({ ...un, status: "pending" });
    } catch (Se) {
      throw Ht({ ...un, status: "unknown", note: Se.message }), Se;
    }
    return ke({ txid: Kt.txid, amount: Kt.amount, at: t.now() }, ht), ht === ct && ct !== i.address ? c = null : a = -1 / 0, Kt;
  }
  let q = !1;
  const nt = /* @__PURE__ */ new Map(), de = (w) => me("float", w);
  async function Le() {
    if (q || (i == null ? void 0 : i.state) !== "unlocked" || !Zt() || Wt("move") || Wt("rootLike") || !i.address) return;
    const w = i.address;
    if (t.store.get(de(w)) === "1") return;
    const $ = L();
    if (!($ != null && $.player) || $.state !== "arrived") return;
    const D = le();
    if (D === void 0 || o === void 0) return;
    if (!Be(D)) {
      t.store.set(de(w), "1");
      return;
    }
    if (Oe(ie()) || Ki() || xn().length || o < ls * 4n + Ue + ar) return;
    const J = nt.get(w);
    if (!(J && (J.n >= 3 || t.now() - J.at < 5 * 6e4))) {
      q = !0, nt.set(w, { n: ((J == null ? void 0 : J.n) ?? 0) + 1, at: t.now() });
      try {
        await zn(i.slot ?? 0, 0, ls), t.store.set(de(w), "1");
      } catch (ct) {
        console.warn("[radio] likes float not sent yet", ct);
      } finally {
        q = !1;
      }
    }
  }
  async function us(w) {
    if (Ge().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Wt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const $ = await Ct().catch(() => null);
    if (!$)
      throw dt = null, Te = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Te = !1, o = $.balance;
    const D = { balance: $.balance, nonce: $.nonce };
    if (w === "excess") {
      const pt = Gh($.parts) ?? S();
      if (!pt) throw new Error("Choose where to send the excess first.");
      await $r({ mode: "excess", to: pt, linked: !1 }, D), dt = null, ft("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const J = $.steps;
    if (!J.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!dt && dt.balance === $.balance && t.now() - dt.at <= Gt && dt.steps.length === J.length && dt.steps.every((pt, gt) => pt.to === J[gt].to && pt.mode === J[gt].mode && pt.send === J[gt].send))) {
      dt = {
        at: t.now(),
        balance: $.balance,
        steps: J,
        parts: $.parts,
        plan: { state: "ready", steps: J.map((pt) => ({ to: pt.to, kind: pt.kind, send: pt.send.toString() })), kept: $.tooSmall, excess: Gh($.parts) }
      }, ft(J.length > 1 ? `This goes back in ${J.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const U = J[0], ht = U.to ?? S();
    if (!ht) throw new Error("Choose where to send the rest first.");
    if (U.mode === "amount" && Wt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await $r({ mode: U.mode, to: ht, linked: !1, ...U.mode === "amount" ? { amount: U.send } : {} }, D), dt = null, J.length === 1 ? (Ie(!1), ft("Returned ✓ Paying is off.")) : ft(`Returned ✓ ${J.length - 1} more ${J.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Ir = {
    forceRefresh: () => Sn(!0),
    create: () => fe("Waiting for your passkey…", async () => {
      const w = await Je();
      await w.request("listening.unlock", { mode: "create", terms: Ar(), ...t.main() ? { main: t.main() } : {} }), i = await $e(w), i.address && t.store.set(me("created", i.address), "1"), Ie(!0), ft(Rt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await vr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? ln() : Yt = null, t.changed();
    },
    giftSent: (w, $) => {
      !(i != null && i.address) || Ne() || (ke({ txid: w, amount: $.toString(), at: t.now() }), a = -1 / 0, V = null, ft("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (Ot(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Wt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Je()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, $, D, J) => {
      ke({ txid: D, amount: J.toString(), at: t.now() }, $), V = null, await Ir.openAlbum(w), ft("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => fe("Opening…", async () => {
      if (Ot(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Wt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === w) return;
      ri(), await s.request("listening.openSlot", { slot: w }), i = await $e(s), o = void 0, a = -1 / 0, dt = null, Te = !1;
      const $ = i.root;
      $ && w > 0 && t.store.set(me("slot", $), String(w)), ft(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const $ = () => fe("Waiting for your passkey…", async () => En(await Je(), w));
      return ut ? w ? Wt("cancel") ? (ft("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Er(async () => {
        (at() === "locked" || at() === "intro") && await $();
      }) : re : $();
    },
    link: () => fe("Sign in your wallet…", async () => {
      Ot();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const $ = (await t.links(w)).find((D) => D.listening === i.address);
      if ($)
        await s.request("listening.link", { main: w, issued: $.issued, mainSignature: $.mainSignature });
      else {
        const D = { main: w, listening: i.address, issued: t.now() }, J = await t.signWithMain(w, D6(D)), ct = await s.request("listening.link", { main: w, issued: D.issued, mainSignature: J });
        await t.saveLink({ ...D, mainSignature: J, listeningSignature: ct.listeningSignature }), R = -1 / 0;
      }
      ft("Linked ✓");
    }),
    deposit: () => fe("Approve the deposit in your wallet…", async () => {
      Ot();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ne()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Cn(!0);
      const $ = Qc(o ?? 0n);
      if ($ <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      K = await t.deposit(w, i.address, $), K && ke({ txid: K, amount: $.toString(), at: t.now() }), ft("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => fe("Approve the top-up in your wallet…", async () => {
      Ot();
      const w = t.main(), $ = ie();
      if (!w || !$) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Oe($)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const D = await t.chain.balance($);
      Zt() ? c = { for: $, value: D, at: t.now() } : (o = D, a = t.now());
      const J = Qc(D);
      if (J <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const ct = await t.deposit(w, $, J);
      ct && ke({ txid: ct, amount: J.toString(), at: t.now() }, $), ft("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (w) => fe("Adding plays…", async () => {
      if (Ot(), !Zt()) throw new Error("Open the album you want to add plays to first.");
      if (!lu.includes(w)) throw new Error("Choose one of the amounts offered.");
      if (d || l || g) throw new Error("Still sending a payment. Try again in a moment.");
      if (xn().length || Ne()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await zn(0, i.slot ?? 0, w), ft("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => fe("Confirm in the listening wallet…", async () => {
      if (!Dt()) throw new Error("Connect your wallet first.");
      await vr(), await s.request("listening.approveSession", Ar()), Ie(!0), ft("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => fe("Clearing…", async () => {
      for (const w of te())
        await t.chain.transaction(w.txid) || Ht({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ft("Cleared ✓");
    }),
    switchOff: () => fe("Switching off…", async () => {
      ri(), await (s == null ? void 0 : s.request("listening.stop")), Ie(!1), ft("Paying is off. Music stays free.");
    }),
    lock: () => fe("Locking…", async () => {
      ri(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, ft("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const $ = String(w ?? "").trim();
      if (!(i != null && i.address)) return ft("", "Unlock the listening wallet first.");
      if (!js($)) return ft("", "Enter a standard mainnet address (it starts with SP).");
      if ($ === i.address) return ft("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(y(i.address), $), ft("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(y(i.address), ""), t.changed();
    },
    returnFunds: (w) => fe("Check the return in the listening wallet…", async () => {
      if (!Dt()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (xe()) return us(w);
      const $ = G();
      if (!$) throw new Error(Rt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if ($.kind !== "linked" && Wt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Ge().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await $r({ mode: w, to: $.to, linked: $.kind === "linked" }), w === "all" && Ie(!1), ft(w === "all" ? $.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, se = [], Gi = 10, fs = 30 * 6e4;
  let Tn = !1;
  const Ki = () => d || !!u || l || g, ri = () => {
    se.length && (se.length = 0, t.changed());
  };
  async function xc(w) {
    if (!se.some(($) => $.id === w.id) && !Re().some(($) => $.id === w.id) && (se.push({ ...w, at: t.now() }), se.length > Gi && se.shift()), Ki() || Ge().length) {
      const $ = se.length;
      A = `Queued ${$ === 1 ? "this song" : $ + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Vi();
  }
  async function Vi() {
    if (!Tn) {
      Tn = !0;
      try {
        for (; se.length; ) {
          for (; se.length && t.now() - se[0].at > fs; ) se.shift();
          if (!se.length || Ki() || await Sc(se[0]) === "wait") return;
          se.shift();
        }
      } finally {
        Tn = !1, t.changed();
      }
    }
  }
  async function Sc(w) {
    var $;
    d = !0;
    try {
      await Sn();
      const D = at();
      if (D === "loading") return "wait";
      if (D !== "ready" || !Ze() || !(i != null && i.session) || i.session.playsLeft < 1 || !P) return "done";
      if (Ge().length) return "wait";
      I || (await t.chain.verify(), I = !0);
      const J = i.address, { balance: ct, nonce: U } = await t.chain.account(J);
      o = ct, a = t.now();
      const ht = await t.chain.owner(Jc, w.song);
      if (ht === J || ht === t.main()) return "done";
      const pt = await s.request("listening.signPlay", {
        core: Jc,
        song: w.song,
        receipt: w.id,
        fee: Ut().toString(),
        nonce: U.toString(),
        balance: ct.toString()
      }), gt = {
        id: w.id,
        address: J,
        kind: "play",
        core: Jc,
        song: w.song,
        recipient: ht,
        amount: "50",
        fee: Ut().toString(),
        nonce: U.toString(),
        created: t.now(),
        status: "signed",
        raw: pt.raw,
        txid: pt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(gt), Ht(gt);
      const Kt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(pt.raw, pt.txid), Ht({ ...gt, status: "pending" }), A = `♪ Paid ${Kt}`, T = "";
      } catch (_e) {
        Ht({ ...gt, status: ci(_e) ? "failed" : "unknown", note: _e.message, ...ci(_e) ? { raw: void 0 } : {} }), T = _e.message;
      }
      return i = await $e(s), "done";
    } catch (D) {
      const J = D instanceof Error ? D.message : "payment unavailable";
      return ($ = L()) != null && $.player ? (A = "Payment is taking a moment: " + J, "wait") : (A = "This song played free: " + J, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function Ec(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(at()) || Wt("like") ? !1 : (si(w), !0);
  }
  async function si(w) {
    const $ = w.title ? `“${w.title}”` : `song #${w.song}`, D = (Rn) => {
      var Xi;
      T = Rn, A = "";
      try {
        (Xi = t.likeFailed) == null || Xi.call(t, w.song);
      } catch {
      }
      t.changed();
    }, J = Zt(), ct = at(), U = t.main(), ht = J && (ct === "fund" || ct === "over") ? "ready" : ct, pt = Rt() ? ie() : U;
    if (ht === "locked") {
      h = { ...w, at: t.now() }, ft(`Unlock to like ${$}. It sends straight after.`);
      return;
    }
    if (ht === "wrong-wallet") return D(ee());
    if (ht === "link") return D("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Rt() && Wt("standalone")) return D("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ht === "fund") return D("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (ht === "over") return D("Return the excess first: the listening wallet holds more than 1 STX.");
    if (J) {
      await Fn(!0);
      const Rn = le();
      if (Be(Rn))
        return t.changed(), D(Vh);
    }
    if (ht !== "ready" || !pt) return D("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return D("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!P) return D("Pay-per-play is running in another tab. Like from that tab.");
    const gt = Re(ie()).find((Rn) => Rn.kind === "like" && Rn.song === w.song);
    if (gt && Ji.includes(gt.status))
      return D(`Your last like for ${$} is still on its way. It can change again once it confirms.`);
    if (l) return D("One like at a time: your last one is still being sent.");
    if ((gt == null ? void 0 : gt.status) === "confirmed" && t.now() - (gt.confirmedAt ?? 0) < W6)
      return D(`Your like for ${$} has only just confirmed. Try again in a moment.`);
    let Kt;
    g = !0;
    try {
      Kt = t.likeState ? (await t.likeState(pt, w.song)).by : w.likedBy ?? [];
    } catch {
      Kt = w.likedBy;
    } finally {
      g = !1;
    }
    if (!Kt) return D(`Could not check ${$} right now. Try the heart again.`);
    const _e = ie(), Se = ((gt == null ? void 0 : gt.status) === "confirmed" && typeof gt.liked == "boolean" && t.now() - (gt.confirmedAt ?? gt.created) < 5 * 6e4 ? gt.liked : void 0) ?? Kt.includes(_e);
    if (!Se && Kt.some((Rn) => Rn !== _e)) return D(Rt() ? `${$} was liked from another wallet of yours. Unlike it there.` : `${$} was liked from your main wallet${Kt.includes(U) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ac({ song: w.song, liked: !Se, title: w.title, artist: w.artist });
  }
  async function Ac(w) {
    var J, ct, U;
    if (l) {
      ft("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const $ = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, D = t.wait ?? ((ht) => new Promise((pt) => setTimeout(pt, ht)));
    try {
      ft(`${w.liked ? "Liking" : "Unliking"} ${$}…`);
      const ht = t.now() + 12e4;
      for (; d || (Zt() ? Re(ie()).some((Se) => Ji.includes(Se.status)) : Ge().length); ) {
        if (t.now() > ht) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await D(5e3), await Sn(!0);
      }
      if (!Zt() && at() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const pt = ie(), { balance: gt, nonce: Kt } = await t.chain.account(pt);
      if (Zt() ? c = { for: pt, value: gt, at: t.now() } : (o = gt, a = t.now()), Be(gt)) throw new Error(Vh);
      const _e = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: Zc.toString(),
        nonce: Kt.toString(),
        balance: gt.toString()
      }), un = {
        id: tl(),
        address: pt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: Zc.toString(),
        nonce: Kt.toString(),
        created: t.now(),
        status: "signed",
        raw: _e.raw,
        txid: _e.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(un), Ht(un);
      try {
        await t.chain.broadcast(_e.raw, _e.txid), Ht({ ...un, status: "pending" }), A = `${w.liked ? "♥ Liked" : "Unliked"} ${$}`, T = "";
        try {
          (J = t.likeSent) == null || J.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Se) {
        if (Ht({ ...un, status: ci(Se) ? "failed" : "unknown", note: Se.message, ...ci(Se) ? { raw: void 0 } : {} }), T = Se.message, ci(Se)) try {
          (ct = t.likeFailed) == null || ct.call(t, w.song);
        } catch {
        }
      }
      i = await $e(s);
    } catch (ht) {
      T = "Like not sent: " + (ht instanceof Error ? ht.message : "the listening wallet is unavailable");
      try {
        (U = t.likeFailed) == null || U.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Vi();
    }
  }
  return { snapshot: yt, refresh: Sn, onListened: xc, heart: Ec, toggleLike: si, ...Ir };
}
const Hy = ["Connect", "Passkey", "Link & fund", "Listen"], Oy = ["Passkey", "Add 1 STX", "Listen"], uu = (t) => t ? Oy : Hy;
function Z6(t) {
  if (t.solo) return Q6(t);
  const e = Hy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function Q6(t) {
  const e = Oy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function J6(t, e) {
  return !e || e.at >= uu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const t5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function e5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !t5(r.id)));
}
const n5 = {}, r5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, s5 = (t) => {
  const e = n5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, i5 = (t) => `/hiro/${t}`, o5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, a5 = (t) => {
  const e = s5(t);
  if (e)
    return [o5(e)];
  const n = r5[t];
  return typeof window < "u" ? [`${window.location.origin}${i5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, c5 = {}, Xh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, l5 = "xtrata.log.enabled", u5 = "xtrata.log.level", f5 = "xtrata.log.tags", d5 = "xtrata.log.dedupe", aa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, h5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, p5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, g5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, y5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, w5 = () => {
  const t = c5 ?? {}, e = aa(l5) ?? t.VITE_LOG_ENABLED, n = aa(u5) ?? t.VITE_LOG_LEVEL, r = aa(f5) ?? t.VITE_LOG_TAGS, s = aa(d5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: h5(e),
    level: p5(n) ?? "warn",
    tags: y5(r),
    dedupe: g5(s)
  };
}, b5 = (t, e, n) => !t.enabled || Xh[n] < Xh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), m5 = (t, e, n, r) => {
  const s = w5();
  if (!b5(s, e, t) || S5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, x5 = /* @__PURE__ */ new Set();
let qh = null;
const S5 = (t, e, n, r, s) => (qh !== t && (x5.clear(), qh = t), !1), E5 = (t, e, n) => m5("debug", t, e, n), A5 = {}, v5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, $5 = (t) => {
  const e = A5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : v5[t];
}, I5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, k5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return I5.test(n) ? n : null;
}, L5 = (t) => t.replace(/\/+$/, ""), C5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Wh = (t) => {
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
}, li = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, T5 = (t) => {
  var c, u;
  let e;
  try {
    e = Qn(Bv(t));
  } catch {
    return null;
  }
  const n = li(e);
  if (!n || n.success === !1)
    return null;
  const r = li(n.value), s = li(r == null ? void 0 : r.value), i = li(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Wh((c = li(i.name)) == null ? void 0 : c.value), a = Wh((u = li(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : k5(`${o}.${a}`);
}, B5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${L5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [wy(ty(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : T5(i.result);
}, M5 = async (t) => {
  const e = t.address.trim();
  if (!bi(e))
    return null;
  const n = $5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of a5(t.network))
    try {
      return await B5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return E5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: C5(r)
  }), null;
};
function N5(t, e, n = {}) {
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
const Yh = Object.freeze({
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
}), Zh = Object.freeze({ 139: "melophonic" });
function _5(t, e = "") {
  const n = String(t);
  return Object.hasOwn(Yh, n) ? Yh[n] : Object.hasOwn(Zh, n) ? Zh[n] : e;
}
const Qh = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function P5(t, e = "") {
  return Object.hasOwn(Qh, String(t)) ? Qh[String(t)] : e;
}
const Dy = 100000n, Ra = 1000000n, Ga = 3000n, U5 = (t, e) => `${t}#gift=${e}`, Fy = 100, el = (t, e = cs) => t <= Ue ? 0 : Number((t - Ue) / yn(e)), Jh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Sf = "xtrata.xyz/radio/gifts", H5 = "Create Xtrata radio gift links paid from the gift treasury", O5 = (t) => ({
  domain: mr({ name: he(Sf), version: he("1"), "chain-id": an(1) }),
  message: mr({
    purpose: he(H5),
    admin: he(t.admin),
    count: an(t.count),
    amount: an(BigInt(t.amount)),
    label: he(t.label),
    issued: an(t.issued),
    ...t.player ? { player: he(t.player) } : {}
  })
}), nl = Fy, D5 = "Create a prefunded Xtrata radio gift batch", F5 = (t) => ({
  domain: mr({ name: he(Sf), version: he("1"), "chain-id": an(1) }),
  message: mr({
    purpose: he(D5),
    creator: he(t.creator),
    count: an(t.count),
    amount: an(BigInt(t.amount)),
    label: he(t.label),
    issued: an(t.issued),
    ...t.player ? { player: he(t.player) } : {}
  })
}), j5 = (t, e, n = cs) => Ue + BigInt(t) * yn(n) + (e ? mc : 0n), z5 = (t, e = cs) => Number((Ra - Ue - (t ? mc : 0n)) / yn(e)), R5 = (t, e) => BigInt(t) * (e + Ga);
function G5(t, e, n, r = cs) {
  const s = n ? mc : 0n, i = e > Ue + s ? e - Ue - s : 0n, o = Number(i / yn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * ja,
    fees: BigInt(o) * r,
    reserve: Ue,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Ga,
    perCopy: e + Ga,
    total: R5(t, e)
  };
}
const K5 = (t) => t >= Dy && t <= Ra, t0 = 40, V5 = "Create an Xtrata radio gift player", X5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function e0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && X5.test(t) : !n;
}
function q5(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!e0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!e0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > t0) throw new Error(`A player holds 1 to ${t0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const W5 = (t) => rp(lp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), Y5 = (t) => ({
  domain: mr({ name: he(Sf), version: he("1"), "chain-id": an(1) }),
  message: mr({
    purpose: he(V5),
    admin: he(t.admin),
    player: he(t.hash),
    issued: an(t.issued)
  })
}), n0 = (t, e = cs) => Ue + BigInt(t) * yn(e), So = (t) => t.tracks.filter((e) => !e.hidden), Z5 = (t) => t.tracks.find((e) => e.hidden) ?? null, rl = [300, 500, 1e3], r0 = 1800, sl = /* @__PURE__ */ new Map();
async function jy(t) {
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
async function Q5(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await jy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function zy(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = sl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      sl.set(t, { ...a, until: Date.now() + r0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        sl.delete(t), s();
      }, r0 + 50);
    }
  }, i;
}
const ts = (t, e, n, r, s) => zy(t, e, async () => await jy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), ds = "xtrata.radio.gift.incoming.v1", s0 = (t) => "xtrata.radio.gift.mine.v1:" + t, i0 = (t) => "xtrata.radio.gift.batches.v1:" + t, st = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Wn = (t, e, n = "") => {
  const r = st("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, fr = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, nn = (t) => Mn(t).replace(/\.?0+$/, "");
function J5(t) {
  let e = null;
  const n = (m) => [5e3, 1e4, 2e4, 3e4][m] ?? 6e4, r = (() => {
    try {
      const m = new URL(location.href), L = new URLSearchParams(m.hash.slice(1)).get("gift") ?? m.searchParams.get("gift");
      return L !== null && (m.searchParams.delete("gift"), history.replaceState(null, "", m.pathname + (m.search || ""))), Jh(L) ? L : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const m = JSON.parse(t.store.get(ds) || "null");
      return Jh(m == null ? void 0 : m.code) ? m.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(ds, JSON.stringify({ code: i, at: t.now() }));
    let m = 0;
    const L = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (B) => {
      const H = await B.json().catch(() => ({}));
      if (B.status === 404) {
        t.store.set(ds, null), e = { ...e, error: (H == null ? void 0 : H.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!B.ok) throw new Error("busy");
      const Q = H;
      e = { ...e, view: Q, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(Q.status) && t.store.set(ds, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void L(), n(m++)));
    });
    L();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    e = null, t.store.set(ds, null), t.changed();
  }, c = (m) => m.from ? t.who(m.from) : m.label ? `Xtrata Radio · ${m.label}` : "Xtrata Radio";
  let u = {};
  const d = (m) => {
    if (u.box) return u.box;
    const L = st("div", "", "ppp-gift-check");
    u.box = L;
    const B = () => {
      const H = window.turnstile;
      !H || u.rendered || (u.rendered = !0, H.render(L, { sitekey: m, callback: (Q) => {
        u.token = Q, t.changed();
      }, "expired-callback": () => {
        u.token = void 0;
      } }));
    };
    if (window.turnstile) B();
    else {
      const H = document.createElement("script");
      H.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", H.async = !0, H.onload = B, document.head.append(H);
    }
    return L;
  }, l = (m) => {
    queueMicrotask(() => void m());
  };
  let g;
  async function h(m) {
    var H, Q, ot, _t, wt, Xt, ue, Gt, xe;
    if (!e || e.claiming || !m.listening) return;
    const L = !!((H = e.view) != null && H.player);
    if (L && !m.root) return;
    e.claiming = !0, e.error = void 0, (Q = t.claiming) == null || Q.call(t, !0), t.changed();
    const B = async (Ct) => {
      const Z = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: u.token, ...Ct })
      });
      return { res: Z, r: await Z.json().catch(() => ({})) };
    };
    try {
      let Ct = 0, Z = m.listening, at;
      if (L) {
        const ft = Number((ot = await t.json("/radio/gift/slots?root=" + encodeURIComponent(m.root))) == null ? void 0 : ot.next);
        if (!Number.isSafeInteger(ft) || ft < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Ct = ft;
        for (let fe = 0; ; fe++) {
          const Mt = await t.album.bind(Ct);
          if (Z = Mt.address, at = await B({ wallet: Z, binding: Mt }), at.res.status === 409 && /just taken/.test(((_t = at.r) == null ? void 0 : _t.error) || "") && fe < 5) {
            Ct += 1;
            continue;
          }
          break;
        }
      } else at = await B({ wallet: Z });
      const { res: yt, r: Tt } = at;
      if (yt.status === 503 && /sending another gift/.test((Tt == null ? void 0 : Tt.error) || "")) {
        e.waiting = !0, (wt = t.claiming) == null || wt.call(t, !0), clearTimeout(g), g = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!yt.ok) {
        const ft = String((Tt == null ? void 0 : Tt.error) || "");
        if (yt.status === 404 || yt.status === 410 || yt.status === 409 && /already had a gift|brand-new/.test(ft))
          throw t.store.set(ds, null), new Error(ft || "This gift cannot be opened.");
        if (yt.status === 429 || yt.status === 403 || yt.status === 400 && !/wallet number/i.test(ft)) throw new Error(ft || `Could not open the gift (${yt.status}).`);
        const Mt = /topping up/.test(ft) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ft) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ft) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Mt), { retry: !0, slow: /topping up|not paid for yet/.test(ft) });
      }
      e.done = !0, t.store.set(ds, null), L ? await t.album.arrived(Ct, Z, Tt.txid, BigInt(Tt.amount)) : t.giftSent(Tt.txid, BigInt(Tt.amount));
    } catch (Ct) {
      const Z = Ct, at = Z.name === "TypeError" || Z.name === "AbortError" || Z.name === "TimeoutError" || /wallet number/i.test(Z.message);
      if (Z.retry || at) {
        const yt = e.tries ?? 0;
        e.tries = yt + 1, e.retry = { text: Z.retry ? Z.message : "Still sending your gift… the network is slow, trying again." }, (Xt = t.claiming) == null || Xt.call(t, !0), clearTimeout(g), g = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, Z.slow ? 6e4 : n(yt));
      } else
        e.error = Z.message, (ue = t.claiming) == null || ue.call(t, !1);
      u.token = void 0;
      try {
        (xe = (Gt = window.turnstile) == null ? void 0 : Gt.reset) == null || xe.call(Gt, u.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let x = null;
  function A(m) {
    if (!m.listening || !m.depositPending || m.step !== "fund")
      return x = null, [];
    if (!x || x.wallet !== m.listening || t.now() - x.at > 3e4) {
      const B = m.listening;
      x = { ...(x == null ? void 0 : x.wallet) === B ? x : {}, wallet: B, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(B)).then((H) => {
        var Q, ot;
        (x == null ? void 0 : x.wallet) === B && (x.state = (Q = H == null ? void 0 : H.gift) == null ? void 0 : Q.state, x.problem = ((ot = H == null ? void 0 : H.gift) == null ? void 0 : ot.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(x.state === "sending" && x.problem)) return [];
    const L = st("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return L.title = `Network reply: ${x.problem}`, [L];
  }
  function T(m, L) {
    var wt, Xt;
    const B = L.player, H = BigInt(L.amount), Q = [st("p", `🎁 ${c(L)} sent you “${B.title}”${B.subtitle ? ` by ${B.subtitle}` : ""}: ${So(B).length} ${So(B).length === 1 ? "song" : "songs"} and ${el(H).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!m.root && ["fund", "ready", "over", "link"].includes(m.step)))
      return Q.push(st("p", m.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : m.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), Q;
    if (m.walletCannotAlbums)
      return Q.push(st("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), Q;
    const _t = (Xt = (wt = m.gate) == null ? void 0 : wt.gifts) == null ? void 0 : Xt.turnstileSiteKey;
    return _t && !u.token ? Q.push(st("p", "One quick check and it is yours:", "ppp-mute"), d(_t)) : !e.claiming && !e.error && !e.waiting && !e.retry && l(() => h(m)), Q.push(...z(m, "Sending your album…")), Q;
  }
  function z(m, L) {
    const B = [];
    return e.claiming || e.waiting ? B.push(st("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : L, "ppp-cyan")) : e.retry && B.push(st("p", e.retry.text, "ppp-warn"), Wn("Try now", () => {
      clearTimeout(g), e.retry = void 0, h(m);
    }, "quiet")), e.error && B.push(st("p", e.error, "ppp-bad"), Wn("Try again", () => {
      e.error = void 0, h(m);
    })), B;
  }
  const K = (m) => {
    var L;
    return !!e && !e.done && !e.error && o() && !!m.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !m.linked && !m.creditedTo && (m.createdHere || m.brandNew || !!((L = e.view) != null && L.player)) && (m.balance ?? 0n) === 0n && !m.entries.length);
  };
  function E(m) {
    var Gt, xe;
    const L = A(m);
    if (!e || ["off", "elsewhere"].includes(m.step)) return L;
    const B = e.view;
    if (e.error && !B) return [st("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!B) return [st("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return L;
    if (B.status === "claimed" || B.status === "claiming") return [st("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(B.status)) return [st("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (B.status === "pending-deposit") return [st("p", `🎁 ${c(B)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (B.player) return [...T(m, B), ...L];
    if (!!m.listening && (!(m.createdHere || m.brandNew) || !!m.linked || !!m.creditedTo || (m.balance ?? 0n) > 0n || m.entries.length > 0))
      return [st("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Wn("Forget this gift link here", a, "quiet")];
    const Q = BigInt(B.amount), ot = el(Q).toLocaleString(), wt = [st(
      "p",
      `🎁 ${c(B)} sent you ${nn(Q)} STX of on-chain music: about ${ot} paid plays.`,
      "ppp-gift"
    )], Xt = !!m.listening && (m.createdHere || m.brandNew) && !m.linked && !m.creditedTo && m.step === "fund" && (m.balance ?? 1n) === 0n && !m.depositPending && !m.entries.length, ue = (xe = (Gt = m.gate) == null ? void 0 : Gt.gifts) == null ? void 0 : xe.turnstileSiteKey;
    return Xt ? (ue && !u.token ? wt.push(st("p", "One quick check and it is yours:", "ppp-mute"), d(ue)) : !e.claiming && !e.error && !e.waiting && !e.retry && l(() => h(m)), wt.push(...z(m, "Sending your gift…"))) : m.step === "intro" ? wt.push(st("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : m.listening && m.linked ? wt.push(st("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Wn("Forget this gift link here", a, "quiet")) : m.listening && (m.balance ?? 0n) > 0n && wt.push(st("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Wn("Forget this gift link here", a, "quiet")), wt;
  }
  async function b(m, L, B) {
    var H;
    try {
      const Q = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(m));
      if ((H = Q == null ? void 0 : Q.gift) != null && H.returnTo) return { ok: !0, funder: Q.gift.returnTo, txId: Q.gift.txid ?? void 0, amount: Q.gift.amount, distinct: 1 };
    } catch {
      if (B) return { ok: !1 };
    }
    return L();
  }
  const k = st("div", "", "ppp-gift-fold");
  let O = 250000n, R = "", j = "", X = null;
  const v = (m) => {
    try {
      const L = JSON.parse(t.store.get(s0(m)) || "[]");
      return Array.isArray(L) ? L : [];
    } catch {
      return [];
    }
  }, M = (m, L) => t.store.set(s0(m), JSON.stringify(L.slice(0, 50)));
  let N = 0;
  async function F(m) {
    const L = v(m);
    for (const B of L)
      if (!(B.view && ["claimed", "refunded", "expired"].includes(B.view.status)))
        try {
          B.view = !B.view || B.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: B.id, ...B.txid ? { txid: B.txid } : {} }) }) : await t.json("/radio/gift?id=" + B.id), B.error = void 0;
        } catch (H) {
          B.error = H.message;
        }
    M(m, L), t.changed();
  }
  async function Y(m) {
    if (R) return;
    R = "Starting your gift…", j = "", t.changed();
    let L = null;
    try {
      L = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: m, amount: O.toString() }) });
      const B = v(m);
      B.unshift({ id: L.id, code: L.code, amount: O.toString(), at: t.now() }), M(m, B), R = "Approve the gift in your wallet…", t.changed();
      const H = await t.pay(m, L.depositTo, BigInt(L.deposit), L.memo), Q = v(m), ot = Q.find((_t) => _t.id === L.id);
      ot && (ot.txid = H, ot.view = { status: "pending-deposit", amount: O.toString(), source: "friend", from: m, label: "", expires: 0 }), M(m, Q), j = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", F(m);
    } catch (B) {
      j = B.message || "Not sent.";
    } finally {
      R = "", t.changed();
    }
  }
  const V = (m) => "xtrata.radio.gift.players.v1:" + m, jt = (m) => {
    try {
      const L = JSON.parse(t.store.get(V(m)) || "[]");
      return Array.isArray(L) ? L.filter((B) => B && /^[0-9a-f]{16}$/.test(B.id)) : [];
    } catch {
      return [];
    }
  };
  async function dt(m, L) {
    var B;
    if (!R) {
      R = "Checking the player…", j = "", t.changed();
      try {
        const H = L.tracks.split(/[\s,]+/).filter(Boolean).map((ue) => Number(ue.replace(/^#/, ""))), Q = q5({ title: L.title.trim(), subtitle: L.subtitle.trim(), tracks: H, cover: (B = L.cover) != null && B.trim() ? Number(L.cover.trim().replace(/^#/, "")) : null });
        R = "Sign in your wallet…", t.changed();
        const ot = { admin: m, hash: W5(Q), issued: t.now() }, _t = await t.sign(m, Y5(ot));
        R = "Making the player…", t.changed();
        const wt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: Q, request: ot, signature: _t }) }), Xt = jt(m).filter((ue) => ue.id !== wt.id);
        Xt.unshift({ id: wt.id, title: wt.title, tracks: wt.tracks }), t.store.set(V(m), JSON.stringify(Xt.slice(0, 30))), j = `${wt.existing ? "That player already exists" : "Player made"} ✓ “${wt.title}” · ${wt.tracks} songs. Pick it below for a campaign.`;
      } catch (H) {
        j = H.message || "Not made.";
      } finally {
        R = "", t.changed();
      }
    }
  }
  async function Te(m, L, B, H, Q) {
    if (!R) {
      R = "Sign in your wallet…", j = "", X = null, t.changed();
      try {
        const ot = { admin: m, count: L, amount: B.toString(), label: H, issued: t.now(), ...Q ? { player: Q } : {} }, _t = await t.sign(m, O5(ot));
        R = "Making links…", t.changed();
        const wt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: ot, signature: _t }) });
        X = { codes: wt.codes, amount: wt.amount };
      } catch (ot) {
        j = ot.message || "Not made.";
      } finally {
        R = "", t.changed();
      }
    }
  }
  const I = (m, L) => U5(m || location.origin + "/radio.html", L), P = (m) => Q5({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: m }), ut = (m) => {
    try {
      const L = JSON.parse(t.store.get(i0(m)) || "[]");
      return Array.isArray(L) ? L.filter((B) => B && /^[0-9a-f]{16}$/.test(B.id) && Array.isArray(B.codes)) : [];
    } catch {
      return [];
    }
  }, vt = (m, L) => t.store.set(i0(m), JSON.stringify(L.slice(0, 20))), Lt = (m) => !!m.view && m.view.status === "live" && m.view.copies.waiting + m.view.copies.claiming + m.view.copies.refunding === 0, zt = (m, L) => t.json(m, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(L) });
  let re = 0;
  async function Ut(m) {
    const L = ut(m);
    for (const B of L)
      if (!Lt(B))
        try {
          B.view = !B.view || B.view.status === "pending-deposit" ? await zt("/radio/gift/batch/confirm", { id: B.id, ...B.txid ? { txid: B.txid } : {} }) : await t.json("/radio/gift/batch?id=" + B.id), B.error = void 0;
        } catch (H) {
          B.error = H.message;
        }
    try {
      const B = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(m));
      for (const H of (B == null ? void 0 : B.batches) ?? []) {
        const Q = L.find((ot) => ot.id === H.id);
        if (Q) {
          Q.error || (Q.view = H);
          continue;
        }
        L.push({ id: H.id, codes: [], count: H.count, amount: H.amount, label: H.label, player: H.player, depositTo: "", deposit: H.deposit, memo: H.memo, at: 0, view: H });
      }
    } catch {
    }
    vt(m, L), t.changed();
  }
  async function Wt(m, L) {
    const B = ut(m).find((H) => H.id === L);
    if (!(!B || !B.depositTo || R)) {
      R = "Approve the payment in your wallet…", j = "", t.changed();
      try {
        const H = await t.pay(m, B.depositTo, BigInt(B.deposit), B.memo), Q = ut(m), ot = Q.find((_t) => _t.id === L);
        ot && (ot.txid = H), vt(m, Q), j = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", R = "", Ut(m);
      } catch (H) {
        j = `${/cancel/i.test(H.message) ? "Payment cancelled." : H.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        R = "", t.changed();
      }
    }
  }
  async function me(m, L, B, H) {
    if (R) return;
    if (!L.ok) {
      j = L.reason, t.changed();
      return;
    }
    R = "Sign in your wallet…", j = "", t.changed();
    let Q = null;
    try {
      const ot = { creator: m, count: L.count, amount: L.amount.toString(), label: B, issued: t.now(), ...H ? { player: H } : {} }, _t = await t.sign(m, F5(ot));
      R = "Making your links…", t.changed(), Q = await zt("/radio/gift/batch", { request: ot, signature: _t });
      const wt = ut(m);
      wt.unshift({ id: Q.id, codes: Q.codes, count: L.count, amount: Q.amount, label: B, player: H ?? null, depositTo: Q.depositTo, deposit: Q.deposit, memo: Q.memo, at: t.now() }), vt(m, wt);
    } catch (ot) {
      j = ot.message || "Not made.", R = "", t.changed();
      return;
    }
    R = "", t.changed(), await Wt(m, Q.id);
  }
  function Re() {
    const m = !!te.value, L = Ke.value === "max" ? z5(m) : Number(Ke.value), B = j5(L, m), H = Number(Rt.value);
    return !Number.isInteger(H) || H < 1 || H > nl ? { ok: !1, reason: `Make 1 to ${nl} copies at a time.`, album: m, plays: L, amount: B, count: H } : K5(B) ? { ok: !0, reason: "", album: m, plays: L, amount: B, count: H, bill: G5(H, B, m) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: m, plays: L, amount: B, count: H };
  }
  const Ht = () => {
    const m = Re();
    if (!m.ok) return m.reason;
    const L = m.bill;
    return `Each copy: ${m.plays.toLocaleString()} paid plays (${nn(L.holders)} to song holders, ${nn(L.fees)} network fees)${m.album ? `, ${nn(L.float)} for the album’s likes` : ""}, ${nn(L.reserve)} kept so a listener can return what is left, + ${nn(L.sendFee)} to send it = ${nn(L.perCopy)} STX. ${m.count} copies = ${nn(L.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ze = (m, L) => L.codes.map((B) => I(m, B)), Ie = st("input");
  Ie.type = "range", Ie.min = String(Dy), Ie.max = String(Ra), Ie.step = "50000", Ie.value = String(O), Ie.setAttribute("aria-label", "Gift amount");
  const Ge = st("p", "", "ppp-gift-amount"), xn = Wn("", () => {
    const m = t.main();
    m && Y(m);
  }, "primary"), Ne = () => {
    Ge.textContent = Oe(), xn.textContent = `Gift ${nn(O)} STX`;
  };
  Ie.oninput = () => {
    O = BigInt(Ie.value), Ne();
  };
  const Oe = () => `${nn(O)} STX · about ${el(O).toLocaleString()} paid plays · you pay ${nn(O + Ga)} STX with the network fee`;
  Ne();
  const ke = st("input");
  ke.type = "number", ke.min = "1", ke.max = String(Fy), ke.value = "10", ke.setAttribute("aria-label", "How many links");
  const Yt = st("input");
  Yt.type = "number", Yt.min = "0.1", Yt.max = "1", Yt.step = "0.05", Yt.value = String(Number(n0(rl[0])) / 1e6), Yt.setAttribute("aria-label", "STX per link");
  const ln = st("input");
  ln.maxLength = 60, ln.placeholder = "Title, e.g. Proof of Sound", ln.setAttribute("aria-label", "Player title");
  const Qe = st("input");
  Qe.maxLength = 80, Qe.placeholder = "Artist (optional)", Qe.setAttribute("aria-label", "Player subtitle");
  const De = st("textarea");
  De.rows = 3, De.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", De.setAttribute("aria-label", "Songs");
  const ie = st("input");
  ie.inputMode = "numeric", ie.placeholder = "Cover inscription number (optional), shown when the album loads", ie.setAttribute("aria-label", "Cover inscription");
  const Zt = st("select");
  Zt.setAttribute("aria-label", "Gift player");
  const le = st("select");
  le.setAttribute("aria-label", "Plays per link");
  for (const m of rl) le.append(fr(`${m.toLocaleString()} plays`, String(n0(m))));
  le.append(fr("Max (1 STX)", String(Ra)), fr("Custom STX", "")), le.onchange = () => {
    le.value && (Yt.value = String(Number(le.value) / 1e6));
  };
  const Be = st("input");
  Be.maxLength = 40, Be.placeholder = "Label, e.g. Launch week", Be.setAttribute("aria-label", "Campaign label");
  const te = st("select");
  te.setAttribute("aria-label", "Batch album");
  const Ke = st("select");
  Ke.setAttribute("aria-label", "Plays per copy");
  for (const m of rl) Ke.append(fr(`${m.toLocaleString()} plays`, String(m)));
  Ke.append(fr("Max (1 STX)", "max"));
  const Rt = st("input");
  Rt.type = "number", Rt.min = "1", Rt.max = String(nl), Rt.value = "10", Rt.setAttribute("aria-label", "Copies");
  const Fe = st("input");
  Fe.maxLength = 40, Fe.placeholder = "Label, e.g. Opera launch", Fe.setAttribute("aria-label", "Batch label");
  const y = st("p", "", "ppp-mute"), S = () => {
    y.textContent = Ht();
  };
  for (const m of [te, Ke, Rt])
    m.oninput = S, m.onchange = S;
  S();
  function f(m) {
    var Q, ot, _t, wt, Xt, ue;
    const L = (Q = m.gate) == null ? void 0 : Q.gifts;
    if (!(L != null && L.enabled) || ["off", "elsewhere", "unsupported"].includes(m.step)) return null;
    const B = t.main(), H = [st("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!B)
      H.push(st("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      xn.disabled = !!R, H.push(Ie, Ge, xn), t.now() - N > 3e4 && (N = t.now(), F(B));
      const Gt = v(B);
      if (Gt.length) {
        const xe = st("ul", "", "ppp-gift-list");
        for (const Ct of Gt.slice(0, 10)) {
          const Z = (ot = Ct.view) == null ? void 0 : ot.status, at = Ct.error ? Ct.error : !Z || Z === "pending-deposit" ? Ct.txid ? "payment confirming…" : "waiting for your payment" : Z === "live" ? "ready to share" : Z === "claiming" || Z === "claimed" ? "claimed ✓" : Z === "refunding" ? "expired · refund on its way" : Z === "refunded" ? "expired · refunded to you" : Z, yt = st("li");
          if (yt.append(st("span", `${nn(BigInt(Ct.amount))} STX`, "t"), st("span", at, ((_t = Ct.view) == null ? void 0 : _t.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((wt = Ct.view) == null ? void 0 : wt.status) === "live") {
            const Tt = I(((Xt = m.gate) == null ? void 0 : Xt.radioUrl) ?? null, Ct.code);
            yt.append(ts("gift-copy:" + Ct.id, "Copy link", () => Tt, "tiny", t.changed), zy("gift-share:" + Ct.id, "Share", () => P(Tt), "tiny", t.changed));
          }
          xe.append(yt);
        }
        H.push(xe);
      }
      if (L.admin) {
        const xe = Wn("Sign and make links", () => {
          const Mt = BigInt(Math.round(Number(Yt.value) * 1e6));
          Te(B, Number(ke.value), Mt, Be.value.trim(), Zt.value || void 0);
        }), Ct = st("div", "", "ppp-gift-admin"), Z = (Mt, Dt) => {
          const ee = st("label", Mt);
          return ee.append(Dt), ee;
        }, at = jt(B), yt = Zt.value;
        if (Zt.replaceChildren(fr("No player (plain gift)", ""), ...at.map((Mt) => fr(`${Mt.title} · ${Mt.tracks} songs`, Mt.id))), at.some((Mt) => Mt.id === yt) && (Zt.value = yt), Ct.append(
          st("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          ln,
          Qe,
          De,
          ie,
          Wn("Sign and make player", () => void dt(B, { title: ln.value, subtitle: Qe.value, tracks: De.value, cover: ie.value })),
          st("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          Z("Player ", Zt),
          Z("Plays each ", le),
          Z("Links ", ke),
          Z("STX each ", Yt),
          Be,
          xe
        ), X) {
          const Mt = X.codes.map((ee) => {
            var Ot;
            return I(((Ot = m.gate) == null ? void 0 : Ot.radioUrl) ?? null, ee);
          }).join(`
`), Dt = st("textarea");
          Dt.readOnly = !0, Dt.value = Mt, Dt.rows = Math.min(8, X.codes.length), Ct.append(st("p", `${X.codes.length} links, ${nn(BigInt(X.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Dt, ts("campaign-copy", "Copy all", () => Mt, "tiny", t.changed));
        }
        const Tt = Wn("Sign, pay and make links", () => {
          me(B, Re(), Fe.value.trim(), te.value || void 0);
        });
        Tt.disabled = !!R;
        const ft = te.value;
        te.replaceChildren(fr("No album (starter copies)", ""), ...at.map((Mt) => fr(`${Mt.title} · ${Mt.tracks} songs`, Mt.id))), at.some((Mt) => Mt.id === ft) && (te.value = ft), S(), Ct.append(
          st("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          Z("Album ", te),
          Z("Plays each ", Ke),
          Z("Copies ", Rt),
          Fe,
          y,
          Tt
        ), t.now() - re > 3e4 && (re = t.now(), Ut(B));
        const fe = ut(B);
        if (fe.length) {
          const Mt = st("ul", "", "ppp-gift-list");
          for (const Dt of fe.slice(0, 10)) {
            const ee = Dt.view, Ot = ee == null ? void 0 : ee.copies, Je = Dt.error ? Dt.error : !ee || ee.status === "pending-deposit" ? Dt.txid ? "payment confirming…" : "waiting for your payment" : `${Ot.claimed} of ${ee.count} claimed${Ot.refunding + Ot.refunded ? ` · ${Ot.refunded} refunded${Ot.refunding ? `, ${Ot.refunding} on their way` : ""}` : ""}`, $e = st("li");
            if ($e.append(st("span", `${Dt.label || "Batch"} · ${Dt.count} × ${nn(BigInt(Dt.amount))} STX`, "t"), st("span", Je, "ppp-mute")), !Dt.txid && Dt.depositTo && (!ee || ee.status === "pending-deposit") && $e.append(Wn("Pay now", () => void Wt(B, Dt.id), "tiny")), Dt.codes.length && (ee == null ? void 0 : ee.status) === "live") {
              const Cn = Ze(((ue = m.gate) == null ? void 0 : ue.radioUrl) ?? null, Dt);
              $e.append(
                ts("batch-copy:" + Dt.id, "Copy all links", () => Cn.join(`
`), "tiny", t.changed),
                ts("batch-csv:" + Dt.id, "Copy as CSV", () => ["copy,link", ...Cn.map((Fn, Sr) => `${Sr + 1},${Fn}`)].join(`
`), "tiny", t.changed)
              );
            } else Dt.codes.length || $e.append(st("span", "links were made on another device", "ppp-mute"));
            Mt.append($e);
          }
          Ct.append(Mt);
        }
        H.push(Ct);
      }
    }
    return R && H.push(st("p", R, "ppp-cyan")), j && H.push(st("p", j, /✓/.test(j) ? "ppp-ok" : "ppp-warn")), k.replaceChildren(...H), k;
  }
  return { banner: E, funder: b, renderFold: f, liveGift: o, setAside: a, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: K };
}
const t$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function e$(t) {
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
const n$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function r$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = n$(i);
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
function s$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const ui = 12, i$ = 5e3, rn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, fi = (t, e, n = "") => {
  const r = rn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function o$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = ui;
  const l = rn("div", "", "ppp-shelf-box"), g = (N) => "xtrata.radio.shelf.pins.v1:" + N, h = (N) => "xtrata.radio.shelf.recent.v1:" + N, x = (N, F) => {
    try {
      return JSON.parse(t.store.get(N) || "null") ?? F;
    } catch {
      return F;
    }
  }, A = (N) => new Set(x(g(N), []).filter((F) => Number.isSafeInteger(F))), T = (N) => {
    const F = x(h(N), {}), Y = {};
    for (const [V, jt] of Object.entries(F)) Number.isSafeInteger(Number(V)) && typeof jt == "number" && (Y[Number(V)] = jt);
    return Y;
  };
  async function z(N) {
    if (!s) {
      s = !0, i = !1;
      try {
        const F = [];
        let Y = 0, V = 0;
        for (let jt = 0; jt < i$ / 100 + 1; jt++) {
          const dt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${Y}&limit=100`);
          if (F.push(...e$(dt == null ? void 0 : dt.shelf)), V = Number(dt == null ? void 0 : dt.total) || F.length, !(dt != null && dt.next) || !Number.isSafeInteger(dt.next)) break;
          Y = dt.next;
        }
        N === e && (n = F, r = V, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const K = () => {
    o = -1 / 0;
  }, E = rn("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, d = ui, t.changed();
  };
  const b = rn("select");
  b.setAttribute("aria-label", "Sort albums");
  for (const N of t$) {
    const F = document.createElement("option");
    F.value = N.value, F.textContent = N.label, b.append(F);
  }
  b.onchange = () => {
    c = b.value, d = ui, t.changed();
  };
  const k = fi("", () => {
    u = !u, d = ui, t.changed();
  }, "tiny"), O = rn("div", "", "ppp-shelf-tools");
  O.append(E, b, k);
  const R = rn("div"), j = rn("div");
  function X(N) {
    const F = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (F !== e && (e = F, n = [], r = 0, o = -1 / 0, d = ui), !F || N.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && z(F), !n.length)
      return i ? (j.replaceChildren(rn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), fi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(j), l) : null;
    const Y = A(F), V = T(F), jt = r$(n, { query: a, sort: c, pinnedOnly: u, pins: Y, recents: V });
    E.value !== a && (E.value = a), b.value = c, k.textContent = u ? "★ Pinned only" : "☆ Pinned only", k.setAttribute("aria-pressed", String(u));
    const dt = [];
    if (N.slot > 0 && dt.push(fi("← My player", () => t.open(0), "quiet")), !jt.length) dt.push(rn("p", "No album matches that.", "ppp-mute"));
    else {
      const Te = rn("ul", "", "ppp-shelf-list");
      for (const I of jt.slice(0, d)) {
        const P = rn("li", "", I.slot === N.slot ? "now" : ""), ut = Y.has(I.slot), vt = fi(ut ? "★" : "☆", () => {
          const Ut = new Set(Y);
          ut ? Ut.delete(I.slot) : Ut.add(I.slot), t.store.set(g(F), JSON.stringify([...Ut])), t.changed();
        }, "tiny");
        vt.setAttribute("aria-label", ut ? `Unpin ${I.player.title}` : `Pin ${I.player.title}`);
        const Lt = [I.player.subtitle, `${So(I.player).length} ${So(I.player).length === 1 ? "song" : "songs"}`, I.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), zt = I.slot === N.slot, re = fi(zt ? "Playing" : "Play", () => {
          t.store.set(h(F), JSON.stringify(s$({ ...V, [I.slot]: t.now() }))), t.open(I.slot);
        }, zt ? "tiny" : "tiny primary");
        re.disabled = zt, P.append(vt, rn("span", I.player.title, "t"), rn("span", " " + Lt, "ppp-mute"), re), Te.append(P);
      }
      dt.push(Te), jt.length > d && dt.push(fi(`Show more (${jt.length - d} left)`, () => {
        d += ui, t.changed();
      }, "quiet"));
    }
    return i && dt.push(rn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), R.replaceChildren(...dt), l.firstChild !== O && l.replaceChildren(O, R), l;
  }
  return { render: X, invalidate: K, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const N = T(e), F = [...n].filter((Y) => Y.player).sort((Y, V) => (N[V.slot] ?? 0) - (N[Y.slot] ?? 0) || V.slot - Y.slot)[0];
    return F ? { slot: F.slot, title: F.player.title } : null;
  } };
}
const a$ = [
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
function c$(t) {
  for (const [e, n] of a$) if (n.test(t)) return e;
  return null;
}
const Ry = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Gy = (t) => /Android/.test(t);
function l$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Ry(e) ? "x-safari-" + n.href : Gy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const u$ = (t) => Ry(t) ? "Safari" : Gy(t) ? "Chrome" : "your browser", o0 = document.getElementById("ppp");
o0 && f$(o0);
function f$(t) {
  var Fe;
  const e = Aw(), n = (y) => t.querySelector(y), r = n(".ppp-frame");
  let s = null;
  const i = async (y, S) => {
    const f = await fetch(y, { cache: "no-store", ...S, signal: AbortSignal.timeout(15e3) }), G = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((G == null ? void 0 : G.error) || `Request failed (${f.status}).`);
    return G;
  }, o = Y6({
    now: Date.now,
    main: () => {
      const y = e.load();
      return y.isConnected && y.network === "mainnet" ? y.address : void 0;
    },
    config: (y) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(y || "")),
    links: async (y) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(y))).links ?? [],
    mainOf: async (y) => {
      var f;
      const S = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(y))).links;
      return ((f = S == null ? void 0 : S.find((G) => G.listening === y)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (y) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(y) });
    },
    bridge: async (y) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${y}; publickey-credentials-create ${y}`), s.referrerPolicy = "no-referrer";
      const S = new Promise((L, B) => {
        s.addEventListener("load", () => L(), { once: !0 }), setTimeout(() => B(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = y + "/", r.replaceChildren(s), await S;
      const f = new pw({ walletOrigin: y, frame: s, timeoutMs: 30 * 6e4 }), G = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), m = (L, B) => G.has(L) ? f.request(L, B) : Promise.race([
        f.request(L, B),
        new Promise((H, Q) => setTimeout(() => Q(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await m("listening.status"), { request: m };
    },
    chain: {
      verify: T6,
      balance: M6,
      account: B6,
      owner: N6,
      broadcast: _6,
      transaction: P6,
      confirmedNonce: async (y) => {
        const S = await ss(`/v2/accounts/${y}?proof=0`);
        if (!Number.isSafeInteger(S == null ? void 0 : S.nonce) || S.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(S.nonce);
      }
    },
    signWithMain: (y, S) => Dh({ ...S, network: "mainnet", stxAddress: y }),
    deposit: (y, S, f) => new Promise((G, m) => _h({
      recipient: S,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: y,
      network: new il(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (L) => G(L.txId || ""),
      onCancel: () => m(new Error("Deposit cancelled. Nothing was sent.")),
      onError: m
    })),
    validate: U6,
    tabLock: (y) => new Promise((S) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        S(!0);
        return;
      }
      f.request("xtrata-ppp:" + y, { ifAvailable: !0 }, async (G) => {
        S(!!G), G && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (y) => {
        try {
          return localStorage.getItem(y);
        } catch {
          return null;
        }
      },
      set: (y, S) => {
        try {
          localStorage.setItem(y, S);
        } catch {
        }
      }
    },
    changed: () => te(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (y) => {
      var S, f;
      return a.funder(y, () => z6(y, ss), !!((f = (S = o.snapshot().gate) == null ? void 0 : S.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (y) => {
      const S = await i("/radio/gift/for?wallet=" + encodeURIComponent(y)), f = S == null ? void 0 : S.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (y, S) => K6(y, (f) => ss(f), S),
    likesChanged: () => {
      var y, S;
      (S = (y = window.XtrataRadio) == null ? void 0 : y.refreshLikes) == null || S.call(y);
    },
    likeState: async (y, S) => {
      const f = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: y, ids: String(S) })), G = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((m) => (m == null ? void 0 : m.id) === S) : null;
      if (!G || typeof G.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: G.liked, by: Array.isArray(G.by) ? G.by.filter((m) => typeof m == "string") : G.liked ? [y] : [] };
    },
    likeSent: (y, S) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: y, liked: S } })),
    nameOf: (y) => M(y) ?? void 0,
    likeConfirmed: (y, S) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: y, liked: S } })),
    likeFailed: (y) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: y } }))
  }), a = J5({
    json: i,
    main: () => {
      const y = e.load();
      return y.isConnected && y.network === "mainnet" ? y.address : void 0;
    },
    pay: (y, S, f, G) => new Promise((m, L) => _h({
      recipient: S,
      amount: f.toString(),
      memo: G,
      stxAddress: y,
      network: new il(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (B) => m(B.txId || ""),
      onCancel: () => L(new Error("Gift cancelled. Nothing was sent.")),
      onError: L
    })),
    sign: (y, S) => Dh({ ...S, network: "mainnet", stxAddress: y }),
    giftSent: (y, S) => o.giftSent(y, S),
    claiming: (y) => o.giftClaiming(y),
    album: { bind: (y) => o.bindAlbum(y), arrived: async (y, S, f, G) => {
      c.invalidate(), await o.albumArriving(y, S, f, G);
    } },
    who: (y) => Y(y),
    changed: () => te(o.snapshot()),
    store: {
      get: (y) => {
        try {
          return localStorage.getItem(y);
        } catch {
          return null;
        }
      },
      set: (y, S) => {
        try {
          S === null ? localStorage.removeItem(y) : localStorage.setItem(y, S);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = o$({
    json: i,
    open: (y) => {
      o.openAlbum(y);
    },
    store: {
      get: (y) => {
        try {
          return localStorage.getItem(y);
        } catch {
          return null;
        }
      },
      set: (y, S) => {
        try {
          S === null ? localStorage.removeItem(y) : localStorage.setItem(y, S);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => te(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (y) => {
    if (!y || !Number.isSafeInteger(y.song) || y.song < 0) return !1;
    I();
    const S = P(y.song, { title: y.title, artist: y.artist });
    return o.heart({ song: y.song, title: S.title || void 0, artist: S.artist || void 0, likedBy: Array.isArray(y.likedBy) ? y.likedBy : void 0 });
  };
  let u;
  window.XtrataRadioListeningIdentity = () => {
    const y = o.snapshot();
    return y.solo && y.step !== "off" && y.step !== "elsewhere" ? y.listening : void 0;
  };
  const d = (y) => {
    var f, G;
    const S = window.XtrataRadioListeningIdentity();
    S !== u && (u = S, (G = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || G.call(f));
  };
  let l = "", g = null, h = !1, x = !1;
  const A = (y) => {
    var H, Q, ot, _t, wt, Xt, ue, Gt;
    const S = window.XtrataRadio;
    if (!(S != null && S.setGiftPlayer) || !(S != null && S.setGiftStop)) return;
    const f = y.step === "off" || y.step === "elsewhere" ? null : ((H = y.gift) == null ? void 0 : H.player) ?? null, G = f ? f.id + ":" + f.cover + ":" + f.tracks.map((xe) => xe.id).join(",") : "";
    G !== l && (S.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: So(f).map((xe) => xe.id), hidden: ((Q = Z5(f)) == null ? void 0 : Q.id) ?? null, cover: f.cover } : null), l = G);
    const m = ((ot = y.giftStop) == null ? void 0 : ot.text) ?? null;
    m !== g && (S.setGiftStop(m), g = m);
    const L = ((_t = y.giftStop) == null ? void 0 : _t.reason) === "arriving";
    L !== x && ((wt = S.setGiftWait) == null || wt.call(S, L), x = L);
    const B = !!f && !!((Xt = y.albumLock) != null && Xt.locked);
    B !== h && ((ue = S.setGiftLock) == null || ue.call(S, B), h = B), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(y.step) && ((Gt = S.forgetWallets) == null || Gt.call(S));
  }, T = (y) => y ? y.slice(0, 6) + "…" + y.slice(-4) : "", z = (y) => (Number(y) / 1e6).toFixed(y < 1000n ? 6 : 4), K = (y) => {
    const S = Math.round((Date.now() - y) / 6e4);
    return S < 1 ? "now" : S < 60 ? `${S}m` : S < 1440 ? `${Math.round(S / 60)}h` : `${Math.round(S / 1440)}d`;
  }, E = (y) => `https://explorer.hiro.so/txid/${y}?chain=mainnet`, b = (y, S = "", f = "") => {
    const G = document.createElement(y);
    return S && (G.textContent = S), f && (G.className = f), G;
  }, k = (y, S, f = "") => {
    const G = b("button", y, f);
    return G.type = "button", G.onclick = S, G;
  }, O = (y, S) => {
    const f = b("a", y);
    return f.href = S, f.target = "_blank", f.rel = "noopener", f;
  };
  let R = null, j = location.hash === "#give";
  j && history.replaceState(null, "", location.pathname + location.search);
  let X = !1;
  const v = N5((y) => M5({ address: y, network: "mainnet" }), () => te(o.snapshot())), M = (y) => v.get(y), N = c$(navigator.userAgent), F = (y, S) => {
    const f = navigator.userAgent, G = u$(f), m = `${location.origin}${location.pathname}${S ? `#gift=${S}` : ""}`, L = [b("p", `You are in ${y}'s built-in browser, where passkeys often do not work. Open this page in ${G} to make your listening wallet${S ? " and claim your gift" : ""}.`, "ppp-warn")], B = b("div", "", "ppp-open-row"), H = l$(m, f);
    if (H) {
      const Q = b("a", `Open in ${G}`, "primary ppp-open-in");
      Q.href = H, Q.dataset.homeAction = "radio:open-in-browser", B.append(Q);
    }
    return B.append(ts("copy-page-link", "Copy link", () => m, H ? "" : "primary", () => te(o.snapshot()))), L.push(B, b("p", `If that does not open ${G}, use ${y}'s menu (••• or ⋮) and choose "Open in ${G === "your browser" ? "browser" : G}", or paste the copied link there.`, "ppp-mute")), L;
  }, Y = (y) => M(y) ?? T(y), V = (y) => y.slice(0, 2).map(Y).join(" and ") + (y.length > 2 ? ` and ${y.length - 2} more` : ""), jt = /* @__PURE__ */ new Map();
  let dt = !1;
  const Te = (y) => !y || /^(?:Inscription )?#\d+$/.test(y.trim()), I = () => {
    dt || (dt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((y) => y.ok ? y.json() : null).then((y) => {
      for (const S of Array.isArray(y == null ? void 0 : y.tracks) ? y.tracks : []) {
        const f = Number(S == null ? void 0 : S.id);
        Number.isSafeInteger(f) && jt.set(f, { title: typeof S.title == "string" ? S.title : void 0, artist: typeof S.artist == "string" ? S.artist : void 0 });
      }
      te(o.snapshot());
    }).catch(() => {
      dt = !1;
    }));
  }, P = (y, S) => {
    const f = jt.get(y), G = P5(y, [f == null ? void 0 : f.title, S == null ? void 0 : S.title].find((L) => !Te(L)) || ""), m = _5(y, (f == null ? void 0 : f.artist) || (S == null ? void 0 : S.artist) || "");
    return { title: G, artist: m };
  }, ut = (y) => {
    const { title: S, artist: f } = P(y.song, y);
    return S ? `“${S}”${f ? ` — ${f}` : ""}` : `Song #${y.song}${f ? ` — ${f}` : ""}`;
  }, vt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Lt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function zt(y) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(y.step) ? ["", ""] : y.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : y.step === "over" ? ["OVER 1 STX", "bad"] : y.step === "locked" ? ["LOCKED", "mute"] : y.step === "intro" || y.step === "link" ? ["", ""] : y.step === "fund" ? y.depositPending ? ["ON ITS WAY", "warn"] : y.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : y.payingOn && y.session && y.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function re(y, S, f = "", G) {
    const m = b("dt", y), L = b("dd", S, f);
    return G && L.append(" ", G), [m, L];
  }
  const Ut = document.getElementById("ppp-top"), Wt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, me = () => {
    var S, f;
    const y = o.snapshot();
    if (y.step === "connect" || y.step === "wrong-wallet") {
      (S = document.getElementById("radio-wallet-connect")) == null || S.click();
      return;
    }
    if (y.step === "elsewhere" && ((f = y.gate) != null && f.radioUrl)) {
      location.href = y.gate.radioUrl;
      return;
    }
    y.step === "locked" && !y.armed && !y.busy && o.unlock(), y.step === "ready" && !y.payingOn && !y.busy && o.switchOn(), Wt();
  };
  Ut && (Ut.onclick = me);
  function Re(y) {
    if (!Ut) return;
    const S = (G, m, L) => {
      Ut.hidden = !1, Ut.className = "ppp-top" + (m ? " is-" + m : ""), Ut.replaceChildren(b("span", "", "dot"), document.createTextNode(G)), Ut.title = L;
    }, f = y.session ? Math.min(y.session.playsLeft, y.playsLeft) : 0;
    switch (y.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Ut.hidden = !0;
        return;
      case "elsewhere":
        return S("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Ut.hidden = !0;
        return;
      case "intro":
        return S("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return S(`Connect ${Y(y.linked)}`, "warn", `This device's listening wallet belongs to ${Y(y.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return S(y.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return S("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return y.depositPending ? S("Funds on their way", "quiet", "Paying starts by itself when they land") : S(y.entries.some((G) => G.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return S("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return S("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return y.payingOn && f > 0 ? S(`On · ${f.toLocaleString()} plays left`, "on", "Paying artists as you listen") : S("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Ht = document.getElementById("pppNudge"), Ze = document.getElementById("onair");
  (Fe = Ht == null ? void 0 : Ht.querySelector("button")) == null || Fe.addEventListener("click", () => me());
  const Ie = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, Ge = {
    elsewhere: "Pay as I listen",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Top up",
    over: "Fix it",
    ready: "Switch on"
  };
  function xn(y) {
    var B;
    if (y.step === "loading") return;
    const S = y.session ? Math.min(y.session.playsLeft, y.playsLeft) : 0, f = y.step === "ready" && y.payingOn && S > 0, G = y.step === "fund" && y.depositPending, m = f || G ? "" : Ie[y.step] ?? "", L = f ? "on" : m ? "off" : "";
    if (L ? document.documentElement.dataset.ppp = L : delete document.documentElement.dataset.ppp, Ze && (Ze.hidden = !L, Ze.querySelector(".onair-sub").textContent = f ? `Paying artists · ${S.toLocaleString()} plays left` : "Not paying"), Ht && (Ht.hidden = L !== "off", L === "off")) {
      const H = Math.floor(Number(1000000n / yn(BigInt(((B = y.gate) == null ? void 0 : B.limits.playFee) ?? "300"))));
      Ht.querySelector(".nudge-t").textContent = "⚠ " + m, Ht.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${H.toLocaleString()} plays, on-chain, straight to the artists.`, Ht.querySelector("button").textContent = Ge[y.step] ?? "Start paying";
    }
  }
  let Ne = "";
  function Oe(y) {
    const S = b("div", "", "ppp-pick");
    y.funderMultiple && y.returnToKind === "funder" && S.append(b("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), y.returnToKind === "funder" && S.append(b("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = b("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = Ne, f.oninput = () => {
      Ne = f.value;
    };
    const G = k(y.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), Ne = "";
    }, "tiny");
    return S.append(f, " ", G), y.returnToKind === "chosen" && S.append(" ", k("Back to the funder", () => o.clearReturnAddress(), "tiny")), S;
  }
  const ke = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Yt() {
    const y = b("p", ke + " ", "ppp-mute");
    return y.append(O("Xverse", "https://www.xverse.app/download"), " · ", O("Leather", "https://leather.io/install-extension")), y;
  }
  let ln = "";
  const Qe = (y) => {
    const S = document.documentElement, f = y.solo && !y.main ? y.listening ? T(y.listening) : "new" : "", G = e5() ? "1" : "";
    `${f}|${G}` !== ln && (ln = `${f}|${G}`, f ? S.dataset.pppSolo = f : delete S.dataset.pppSolo, G ? S.dataset.pppWalletInstalled = G : delete S.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const y of [1500, 4e3, 9e3]) setTimeout(() => te(o.snapshot()), y);
  function De(y, S = "") {
    var m;
    const f = b("div", "", "ppp-topup"), G = (m = y.likeFunds) == null ? void 0 : m.balance;
    f.append(b("span", "Add plays from My player: ", "ppp-mute"));
    for (const L of lu) {
      const B = k(`+${(Number(L) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(L), S);
      B.disabled = G === void 0 || G < L + 6000n || y.depositPending || !!y.busy, f.append(B);
    }
    return G !== void 0 && G < lu[0] + 6000n && f.append(b("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), f;
  }
  function ie(y) {
    const S = y.likeFunds;
    if (!S || !S.album || !S.low && !S.pending) return [];
    const f = b("div", "", "ppp-pick ppp-lowbox");
    if (!S.low) {
      const m = b("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return S.txid && m.append(O("View", E(S.txid))), f.append(m), [f];
    }
    f.append(b("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(b("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(b("p", S.address, "ppp-addr-full"));
    const G = b("div", "", "ppp-open-row");
    if (G.append(ts("copy-likes-address", "Copy address", () => S.address, "primary", () => te(o.snapshot()))), S.main && !y.solo) {
      const m = Ss - (S.balance ?? 0n);
      m > 0n && G.append(k(`Pay ${Mn(m)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(G), f.append(b("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const Zt = (y) => {
    const S = b("div", "", "ppp-wait");
    S.dataset.since = String(y.since), S.dataset.grace = String(y.graceMs), S.setAttribute("role", "progressbar"), S.setAttribute("aria-label", "Your plays are arriving");
    const f = b("p", "", "ppp-wait-t"), G = b("div", "", "ppp-wait-track");
    return G.append(b("div", "", "ppp-wait-fill")), S.append(f, G), le(S), S;
  };
  function le(y) {
    const S = Number(y.dataset.since), f = Number(y.dataset.grace) || 6e4, G = Math.max(0, Date.now() - S), m = y.querySelector(".ppp-wait-fill"), L = y.querySelector(".ppp-wait-t");
    if (G < f) {
      const B = Math.ceil((f - G) / 1e3);
      m.style.width = Math.max(4, Math.min(95, G / f * 100)).toFixed(0) + "%", L.textContent = `Your plays are arriving… usually about a minute · ${B}s`, y.classList.remove("is-long"), y.setAttribute("aria-valuenow", String(Math.round(G / f * 100)));
    } else
      m.style.width = "", L.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", y.classList.add("is-long"), y.removeAttribute("aria-valuenow");
  }
  let Be = 0;
  setInterval(() => {
    const y = document.querySelectorAll(".ppp-wait");
    if (!y.length) {
      Be = 0;
      return;
    }
    y.forEach(le), ++Be % 10 === 0 && te(o.snapshot());
  }, 1e3);
  function te(y) {
    var Js, ti, Sn, ei, En, ni, Er, Ar, vr, $r, ls, ar, zn;
    const S = a.inProgress(y), f = S && y.step === "fund" ? { ...y, depositPending: !0 } : y;
    if (d(), A(y), Qe(f), !S && a.inProgress(y) || (Re(f), xn(f), t.hidden = f.step === "off", t.hidden)) return;
    const [G, m] = zt(f), L = n(".ppp-state");
    L.textContent = G, L.className = "ppp-state" + (m ? " ppp-state--" + m : ""), L.hidden = !G;
    const B = !!f.busy || f.armed, H = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (B || !["intro", "loading"].includes(f.step));
    r.hidden = !H, r.classList.toggle("ppp-frame--rest", !B && !X);
    const Q = n(".ppp-frame-label");
    Q.hidden = !0;
    const ot = Z6(f) ?? R;
    R = ot;
    const _t = J6(f, ot);
    n(".ppp-badge").hidden = !_t;
    const wt = n(".ppp-steps"), Xt = n(".ppp-stage");
    wt.hidden = Xt.hidden = !_t, ot && _t && (wt.replaceChildren(...uu(f.solo).map((q, nt) => {
      const de = b("li", "", nt < ot.at ? "done" : nt === ot.at ? ot.blocked ? "now blocked" : "now" : "");
      return de.append(b("span", nt < ot.at ? "✓" : String(nt + 1), "n"), q), nt === ot.at && de.setAttribute("aria-current", "step"), de;
    })), Xt.textContent = ot.caption, Xt.className = "ppp-stage " + (ot.at >= uu(f.solo).length ? "ppp-ok" : ot.blocked ? "ppp-bad" : "ppp-cyan"));
    const ue = n(".ppp-facts"), Gt = [];
    f.main && ((Js = f.gate) != null && Js.here) && !f.solo && Gt.push(...re("Your wallet", Y(f.main), "ppp-addr-short"));
    const xe = () => {
      if (!f.listening) return;
      const q = ts("copy-listening", "Copy", () => f.listening || "", "tiny", () => te(o.snapshot()));
      Gt.push(...re(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", T(f.listening), "ppp-addr-short", q));
    };
    if (f.linked || xe(), f.listening && f.step !== "intro")
      if (f.linked)
        Gt.push(...re("Credited to", `${Y(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), xe();
      else if (f.solo) {
        f.creditedTo && Gt.push(...re("Credited to", `${Y(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${Y(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Gt.push(...re("Returns go to", f.gift ? q : f.returnTo && !M(f.returnTo) ? q.replace(T(f.returnTo), f.returnTo) : q, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Gt.push(...re("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((ti = f.gate) != null && ti.here)) {
      const q = f.linkedListening.map((nt) => T(nt) + (nt === f.listening ? " (this one)" : "")).join(", ");
      Gt.push(...re(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const q = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Gt.push(...re("Balance", `${Mn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, q));
    }
    const Ct = f.entries.find((q) => q.kind === "play");
    Ct && I(), Ct && Gt.push(...re("Last paid song", `${ut(Ct)} → ${Y(Ct.recipient)}`, vt[Ct.status] || "")), ue.replaceChildren(...Gt), ue.hidden = !Gt.length;
    const Z = [], at = [], yt = [], Tt = [], ft = yn(BigInt(((Sn = f.gate) == null ? void 0 : Sn.limits.playFee) ?? "300")), fe = `Each song you listen to for 30 seconds sends ${Mn(ja)} STX to whoever holds it, plus a ${Mn(ft - ja)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Mt = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Z.push(b("p", "Pay artists as you listen.")), (ei = f.gate) != null && ei.radioUrl) {
          const nt = b("p");
          nt.append(O("Open the pay-per-play radio →", f.gate.radioUrl)), Z.push(nt);
        }
        at.push(b("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const nt = [f.linked, ...f.others];
          Z.push(b("p", nt.length > 1 ? `This device has listening wallets for ${V(nt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${Y(f.linked)}. Connect that wallet to keep paying artists.`)), at.push(b("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          Z.push(b("p", "Connect your wallet to pay artists as you listen.")), at.push(b("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        Z.push(b("p", `This device's listening wallet belongs to ${Y(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), at.push(b("p", `You are connected as ${Y(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), at.push(b("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), yt.push(k("Switch wallet", () => {
          var nt;
          return (nt = document.getElementById("radio-wallet-connect")) == null ? void 0 : nt.click();
        }, "primary"));
        break;
      case "not-invited":
        Z.push(b("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        Z.push(b("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Z.push(b("p", `Pay artists ${Mn(ft)} STX a song as you listen.`)), at.push(b("p", fe)), at.push(b("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), at.push(b("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Z.push(b("p", `This device already has a listening wallet for ${V(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), at.push(b("p", `Otherwise, set up a new listening wallet for ${Y(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && at.push(b("p", `This is the listening wallet for ${Y(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && at.push(b("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = a.liveGift();
        yt.push(k(q ? "Claim my gift · no wallet needed" : f.solo ? "Turn on pay-per-play · no wallet needed" : f.others.length && f.main ? `Set up for ${Y(f.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !q && !f.solo && f.main && f.others.length && yt.push(k("Switch wallet", () => {
          var nt;
          return (nt = document.getElementById("radio-wallet-connect")) == null ? void 0 : nt.click();
        })), !q && f.solo && yt.push(k("I have a Stacks wallet", () => {
          var nt;
          return (nt = document.getElementById("radio-wallet-connect")) == null ? void 0 : nt.click();
        })), yt.push(k("I already have a listening wallet", () => void o.unlock(!0))), q && yt.push(k("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Z.push(b("p", "Locked.", "ppp-mute")), yt.push(k(f.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), Tt.push(k("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        Z.push(b("p", `Link to ${Y(f.main)} · free`)), at.push(b("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), at.push(b("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), yt.push(k(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        Z.push(b("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Z.push(Zt(f.arrival)) : (En = f.gift) != null && En.player ? Z.push(b("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Z.push(b("p", "Out of funds · top up to keep paying", "ppp-bad")) : Z.push(b("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / ft)).toLocaleString()} songs`)), (ni = f.gift) != null && ni.player ? at.push(b("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && at.push(b("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && at.push(b("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), S || (f.solo ? (at.push(b("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), at.push(b("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && yt.push(ts("copy-address", "Copy my address", () => f.listening || "", "primary", () => te(o.snapshot())))) : at.push(b("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const nt = b("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          nt.append(O("View", E(f.depositTxid))), Z.push(nt);
        } else f.allowance > 0n && !f.solo && yt.push(k(`Deposit ${Mn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        Z.push(b("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (Z.push(b("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Z.push(Oe(f))), (!f.solo || f.returnTo) && yt.push(k("Return excess", () => void o.returnFunds("excess"), "primary"), k("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const nt = Math.min(f.session.playsLeft, f.playsLeft);
          Z.push(b("p", `Paying as you listen · up to ${nt.toLocaleString()} plays left`, "ppp-ok")), at.push(b("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), yt.push(k("Switch off", () => void o.switchOff()));
        } else
          Z.push(b("p", "Paying is off. Music stays free.", "ppp-mute")), yt.push(k("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        f.queued && Z.push(b("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Z.push(b("p", "Running low · top up", "ppp-warn")), f.depositPending ? Z.push(b("p", "Top-up on its way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && yt.push(k(`Top up ${Mn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && at.push(b("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && at.push(Oe(f)), at.push(Yt()), f.slot === 0 && f.step === "ready" && f.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = b("p", "New to Stacks? ", "ppp-mute");
      q.append(O("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Z.push(q);
    }
    if (f.walletOutdated && at.push(b("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Z.push(b("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), yt.push(k("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && Tt.push(k(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${Y(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((Er = f.gift) != null && Er.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && Tt.push(De(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && Tt.push(k("Lock", () => void o.lock(), "quiet")), H && !B && Tt.push(k(X ? "Hide listening wallet box" : "Show listening wallet box", () => {
      X = !X, te(o.snapshot());
    }, "quiet")), [...yt, ...Tt].forEach((q) => q.disabled = Mt), Mt && (yt.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Ar = f.gift) != null && Ar.player)) {
      const q = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", nt = Z.at(0);
      f.step === "ready" && nt ? nt.append(b("span", ` · ${z(f.balance)} STX`, q)) : Z.push(b("p", `Balance ${z(f.balance)} STX`, q));
    }
    if ((vr = f.gift) != null && vr.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const q = b("p", "", "ppp-gift");
      q.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && q.append(" · ", f.gift.player.subtitle);
      const nt = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? b("span", " · plays on their way", "ppp-warn") : b("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      nt && q.append(nt);
      const de = ($r = Z.at(0)) == null ? void 0 : $r.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && de && /STX/.test(de.textContent ?? "") && de.remove(), Z.unshift(q), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Z.splice(1, 0, b("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), De(f, "primary"));
        else {
          const Le = b("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          Le.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Le.append(O("Xverse", "https://www.xverse.app/download"), " and ", O("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Z.splice(1, 0, Le);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const q = f.returnPlan, nt = b("div", "", "ppp-pick");
      nt.append(b("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const de = b("ul", "", "ppp-gift-list");
      q.steps.forEach((Le, us) => {
        const Ir = Le.kind === "gift" ? "the unused gift" : Le.kind === "deposit" ? "what was added to it" : "the rest", se = b("li");
        se.append(b("span", `${us + 1}. ${Mn(BigInt(Le.send))} STX · ${Ir}`, "t"), b("span", Le.to ? ` → ${Y(Le.to)}` : " → choose an address below", Le.to ? "ppp-mute" : "ppp-warn")), de.append(se);
      }), nt.append(de), q.kept && nt.append(b("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((Le) => !Le.to) && nt.append(Oe(f)), nt.append(k(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), Z.push(nt);
    }
    Z.unshift(...a.banner(y)), Z.unshift(...ie(f)), N && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) && Z.unshift(...F(N, a.pendingCode())), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Z.unshift(b("p", `This is ${Y(f.creditedTo)}'s listening wallet. Plays and likes count for ${Y(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...Z);
    const Dt = document.querySelector(".ppp-switch");
    if (Dt) {
      const q = c.latest(), nt = f.slot > 0, de = ["fund", "ready", "over"].includes(f.step) && (nt || !!q);
      if (Dt.hidden = !de, de) {
        const Le = (Ir, se, Gi, fs) => {
          const Tn = k("", fs, "ppp-tab");
          return Tn.setAttribute("aria-pressed", String(Gi)), Tn.append(b("span", Ir, "tt"), b("span", se === void 0 ? "…" : `${z(se)} STX`, "ts")), Tn.disabled = !!f.busy, Tn;
        }, us = nt ? ((ar = (ls = f.gift) == null ? void 0 : ls.player) == null ? void 0 : ar.title) ?? "Album" : q.title;
        Dt.replaceChildren(
          Le("🎧 My player", nt ? (zn = f.likeFunds) == null ? void 0 : zn.balance : f.balance, !nt, () => {
            nt && o.openAlbum(0);
          }),
          Le("💿 " + us, nt ? f.balance : void 0, nt, () => {
            !nt && q && o.openAlbum(q.slot);
          })
        );
      }
    }
    const ee = c.render(f), Ot = document.querySelector(".ppp-shelf");
    if (Ot) {
      Ot.hidden = !ee;
      const q = Ot.querySelector("summary");
      q && (q.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const nt = Ot.querySelector(".ppp-shelf-body");
      ee && nt && !nt.contains(ee) && nt.replaceChildren(ee);
    }
    const Je = a.renderFold(y);
    if (n(".ppp-gifts").hidden = !Je, Je && !n(".ppp-gift-body").contains(Je) && n(".ppp-gift-body").replaceChildren(Je), Je && j) {
      j = !1;
      const q = n(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...at), n(".ppp-actions").replaceChildren(...yt), n(".ppp-actions2").replaceChildren(...Tt);
    const $e = f.busy || f.message || "", Cn = n(".ppp-msg"), Fn = $e && Z.some((q) => (q.textContent ?? "").startsWith($e.replace(/[.✓\s]+$/, ""))) ? "" : $e, Sr = !Fn && !f.error ? f.notice : "";
    Cn.textContent = Fn || Sr, Cn.classList.toggle("is-warn", !!Sr), n(".ppp-err").textContent = f.error;
    const jn = f.entries.filter((q) => q.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...jn.slice(0, 5).map((q) => {
      const nt = b("li"), de = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return nt.append(b("span", "", "d " + de), b("span", ut(q), "t"), b("span", K(q.created), "ppp-mute")), q.txid && nt.append(O("tx", E(q.txid))), nt;
    })), n(".ppp-wallets").hidden = !(ue.childElementCount || Tt.length), n(".ppp-more").hidden = !at.length;
    const Qs = n(".ppp-history");
    Qs.hidden = !f.entries.length, f.entries.length && I(), Qs.replaceChildren(b("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((q) => {
      const nt = b("div", "", "ppp-row"), de = q.kind === "play" ? [b("span", ut(q), "ppp-song"), b("span", ` · ${Mn(BigInt(q.amount))} STX to ${Y(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [b("span", `${q.liked ? "♥ Liked" : "Unliked"} ${ut(q)}`, "ppp-song"), b("span", ` · for ${f.linked ? Y(f.linked) : "this listening wallet"}`, "ppp-mute")] : [b("span", `Returned ${Mn(BigInt(q.amount))} STX`, "ppp-song"), b("span", ` to ${Y(q.recipient)}`, "ppp-mute")];
      return nt.append(
        b("span", Lt[q.status] || q.status, "ppp-status " + (vt[q.status] || "")),
        ...de,
        b("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && nt.append(O("tx ↗", E(q.txid))), nt;
    }));
  }
  const Ke = /* @__PURE__ */ new Map(), Rt = () => {
    const y = window.XtrataRadio;
    return y != null && y.subscribe ? (y.subscribe((S) => {
      const f = S == null ? void 0 : S.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && Ke.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!Rt()) {
    const y = setInterval(() => {
      Rt() && clearInterval(y);
    }, 500);
    setTimeout(() => clearInterval(y), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (y) => {
    const S = y.detail;
    if (S && Number.isSafeInteger(S.song) && typeof S.id == "string" && /^[0-9a-f]{32}$/.test(S.id)) {
      I();
      const f = P(S.song, Ke.get(S.song));
      o.onListened({ song: S.song, id: S.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const d$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", h$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, p$ = () => h$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, g$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, y$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ky = class {
  constructor(t) {
    VA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && dx(t), this.callback(sc(t));
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
    var r, s, i, o, a, c, u, d, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = p$(), e = g$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return bt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, bt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), bt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, bt("div", { class: "flex flex-col space-y-[10px]" }, bt("div", { class: "flex items-center" }, bt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), bt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, bt("span", { class: "sr-only" }, "Close popup"), bt("img", { src: d$ }))), r ? bt("p", null, "Select the wallet you want to connect to.") : bt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && bt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && bt("div", { class: "mt-6" }, bt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), bt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, bt("div", { class: "aspect-square basis-9 overflow-hidden" }, bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), bt("div", { class: "flex-1" }, bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), bt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && bt("div", { class: "mt-6" }, r ? bt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : bt("div", { class: "mb-5 flex justify-between" }, bt("p", { class: "text-sm font-medium" }, "Recommended wallets"), bt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, bt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), bt("p", null, "What is a wallet? ", bt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), bt("ul", { class: "space-y-3" }, n.map((i) => bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, bt("div", { class: "aspect-square basis-9 overflow-hidden" }, bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), bt("div", { class: "flex-1" }, bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && bt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return kA(this);
  }
};
Ky.style = y$;
const w$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ky
}, Symbol.toStringTag, { value: "Module" }));
