var Gb = Object.defineProperty;
var Kb = (t, e, n) => e in t ? Gb(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ri = (t, e, n) => Kb(t, typeof e != "symbol" ? e + "" : e, n);
var fn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ng(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function nl(t) {
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
      function a(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function c(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function d(b) {
        var I = {
          next: function() {
            var M = b.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function p(b) {
        this.map = {}, b instanceof p ? b.forEach(function(I, M) {
          this.append(M, I);
        }, this) : Array.isArray(b) ? b.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(I) {
          this.append(I, b[I]);
        }, this);
      }
      p.prototype.append = function(b, I) {
        b = a(b), I = c(I);
        var M = this.map[b];
        this.map[b] = M ? M + ", " + I : I;
      }, p.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, p.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, p.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, p.prototype.set = function(b, I) {
        this.map[a(b)] = c(I);
      }, p.prototype.forEach = function(b, I) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && b.call(I, this.map[M], M, this);
      }, p.prototype.keys = function() {
        var b = [];
        return this.forEach(function(I, M) {
          b.push(M);
        }), d(b);
      }, p.prototype.values = function() {
        var b = [];
        return this.forEach(function(I) {
          b.push(I);
        }), d(b);
      }, p.prototype.entries = function() {
        var b = [];
        return this.forEach(function(I, M) {
          b.push([M, I]);
        }), d(b);
      }, r.iterable && (p.prototype[Symbol.iterator] = p.prototype.entries);
      function u(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function w(b) {
        return new Promise(function(I, M) {
          b.onload = function() {
            I(b.result);
          }, b.onerror = function() {
            M(b.error);
          };
        });
      }
      function g(b) {
        var I = new FileReader(), M = w(I);
        return I.readAsArrayBuffer(b), M;
      }
      function A(b) {
        var I = new FileReader(), M = w(I), N = /charset=([A-Za-z0-9_-]+)/.exec(b.type), V = N ? N[1] : "utf-8";
        return I.readAsText(b, V), M;
      }
      function E(b) {
        for (var I = new Uint8Array(b), M = new Array(I.length), N = 0; N < I.length; N++)
          M[N] = String.fromCharCode(I[N]);
        return M.join("");
      }
      function T(b) {
        if (b.slice)
          return b.slice(0);
        var I = new Uint8Array(b.byteLength);
        return I.set(new Uint8Array(b)), I.buffer;
      }
      function O() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && s(b) ? (this._bodyArrayBuffer = T(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = T(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = u(this);
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
            var b = u(this);
            return b || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(g);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = u(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return A(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(E(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(P);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function v(b) {
        var I = b.toUpperCase();
        return H.indexOf(I) > -1 ? I : b;
      }
      function B(b, I) {
        if (!(this instanceof B))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var M = I.body;
        if (b instanceof B) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, I.headers || (this.headers = new p(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !M && b._bodyInit != null && (M = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new p(I.headers)), this.method = v(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var z = new AbortController();
            return z.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var V = /\?/;
            this.url += (V.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      B.prototype.clone = function() {
        return new B(this, { body: this._bodyInit });
      };
      function P(b) {
        var I = new FormData();
        return b.trim().split("&").forEach(function(M) {
          if (M) {
            var N = M.split("="), V = N.shift().replace(/\+/g, " "), z = N.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(V), decodeURIComponent(z));
          }
        }), I;
      }
      function Z(b) {
        var I = new p(), M = b.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var V = N.split(":"), z = V.shift().trim();
          if (z) {
            var mt = V.join(":").trim();
            try {
              I.append(z, mt);
            } catch (dt) {
              console.warn("Response " + dt.message);
            }
          }
        }), I;
      }
      O.call(B.prototype);
      function it(b, I) {
        if (!(this instanceof it))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new p(I.headers), this.url = I.url || "", this._initBody(b);
      }
      O.call(it.prototype), it.prototype.clone = function() {
        return new it(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new p(this.headers),
          url: this.url
        });
      }, it.error = function() {
        var b = new it(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var tt = [301, 302, 303, 307, 308];
      it.redirect = function(b, I) {
        if (tt.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new it(null, { status: I, headers: { location: b } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(I, M) {
          this.message = I, this.name = M;
          var N = Error(I);
          this.stack = N.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function K(b, I) {
        return new Promise(function(M, N) {
          var V = new B(b, I);
          if (V.signal && V.signal.aborted)
            return N(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function mt() {
            z.abort();
          }
          z.onload = function() {
            var L = {
              statusText: z.statusText,
              headers: Z(z.getAllResponseHeaders() || "")
            };
            V.url.indexOf("file://") === 0 && (z.status < 200 || z.status > 599) ? L.status = 200 : L.status = z.status, L.url = "responseURL" in z ? z.responseURL : L.headers.get("X-Request-URL");
            var F = "response" in z ? z.response : z.responseText;
            setTimeout(function() {
              M(new it(F, L));
            }, 0);
          }, z.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, z.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, z.onabort = function() {
            setTimeout(function() {
              N(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function dt(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (z.open(V.method, dt(V.url), !0), V.credentials === "include" ? z.withCredentials = !0 : V.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof p || n.Headers && I.headers instanceof n.Headers)) {
            var Kt = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(L) {
              Kt.push(a(L)), z.setRequestHeader(L, c(I.headers[L]));
            }), V.headers.forEach(function(L, F) {
              Kt.indexOf(F) === -1 && z.setRequestHeader(F, L);
            });
          } else
            V.headers.forEach(function(L, F) {
              z.setRequestHeader(F, L);
            });
          V.signal && (V.signal.addEventListener("abort", mt), z.onreadystatechange = function() {
            z.readyState === 4 && V.signal.removeEventListener("abort", mt);
          }), z.send(typeof V._bodyInit > "u" ? null : V._bodyInit);
        });
      }
      return K.polyfill = !0, n.fetch || (n.fetch = K, n.Headers = p, n.Request = B, n.Response = it), e.Headers = p, e.Request = B, e.Response = it, e.fetch = K, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : fn);
})();
const Vb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Yb(t, e) {
  const n = {};
  return Object.assign(n, Vb, e), await fetch(t, n);
}
function qb(t) {
  let e = Yb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Xb(...t) {
  const { fetchLib: e, middlewares: n } = qb(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var li;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(li || (li = {}));
var uo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(uo || (uo = {}));
var dh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(dh || (dh = {}));
const Wb = "https://api.mainnet.hiro.so", Zb = "https://api.testnet.hiro.so", Qb = "http://localhost:3999", Jb = ["mainnet", "testnet", "devnet", "mocknet"];
let ui = class {
  constructor(e) {
    this.version = uo.Mainnet, this.chainId = li.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === uo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Xb();
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
ui.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new xu();
    case "testnet":
      return new tm();
    case "devnet":
      return new em();
    case "mocknet":
      return new rg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Jb.join(", ")}`);
  }
};
ui.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ui.fromName(t);
let xu = class extends ui {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Wb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = uo.Mainnet, this.chainId = li.Mainnet;
  }
}, tm = class extends ui {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Zb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = uo.Testnet, this.chainId = li.Testnet;
  }
}, rg = class extends ui {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Qb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = uo.Testnet, this.chainId = li.Testnet;
  }
};
const em = rg, sg = "xtrata.wallet.bridge.v1", nm = (t) => typeof t == "object" && t !== null && t.protocol === sg, rm = (t) => nm(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", sm = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class zi extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const fh = 12e4;
class om {
  constructor(e) {
    Ri(this, "pending", /* @__PURE__ */ new Map());
    Ri(this, "listenTarget");
    Ri(this, "closed", !1);
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
    Ri(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !rm(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new zi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new zi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new zi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = sm(), o = { protocol: sg, kind: "request", id: s, method: e, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new zi(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? fh}ms.`
          )
        );
      }, this.options.timeoutMs ?? fh);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new zi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const im = ["SP", "SM"], am = ["ST", "SN"], cm = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return im.includes(n) ? "mainnet" : am.includes(n) ? "testnet" : null;
}, lm = () => {
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
}, um = () => typeof window > "u" || !window.localStorage ? lm() : window.localStorage, Ol = "xtrata.v15.1.wallet.session", hh = "mainnet", Ac = { isConnected: !1 }, dm = (t) => t.address ? cm(t.address) ?? t.network : t.network, og = (t) => !t.isConnected || !t.address ? { ...Ac } : dm(t) !== hh ? { ...Ac } : {
  isConnected: !0,
  address: t.address,
  network: hh,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, fm = (t) => {
  if (!t)
    return { ...Ac };
  try {
    const e = JSON.parse(t);
    return og(e);
  } catch {
    return { ...Ac };
  }
}, hm = (t) => {
  const e = og(t);
  return JSON.stringify(e);
}, pm = (t) => {
  const e = um();
  return {
    load: () => fm(e.getItem(Ol)),
    save: (n) => {
      e.setItem(Ol, hm(n));
    },
    clear: () => {
      e.removeItem(Ol);
    }
  };
}, gm = "https://browser.blockstack.org/auth", ym = {
  "@type": "Person",
  "@context": "http://schema.org"
}, ig = ["store_write"], wm = "blockstack-session", bm = {
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
class Ii extends Error {
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
class mm extends Ii {
  constructor(e, n = "") {
    super({ code: Lo.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class ph extends Ii {
  constructor(e = "") {
    super({ code: Lo.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Ma extends Ii {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Lo.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class gh extends Ii {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Lo.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Su extends Ii {
  constructor(e) {
    super({ code: Lo.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class ag extends Ii {
  constructor(e) {
    super({ code: Lo.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const yh = ["debug", "info", "warn", "error", "none"], Eu = {};
for (let t = 0; t < yh.length; t++) {
  const e = yh[t];
  Eu[e] = t;
}
class ei {
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
    return Eu[bm.logLevel] <= Eu[e];
  }
}
function xm() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Sm() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Dl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Em() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Am() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function vm(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Cd(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Am(), s) {
      const o = s[t];
      if (o)
        return o;
    }
  } catch (o) {
    ei.error(`Error getting object '${t}' from global scope '${s}': ${o}`);
  }
  if (e) {
    const o = vm(s, t.toString(), n);
    throw ei.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Ds(t, e) {
  return Td(sn(t), e);
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
    return BigInt(`0x${yt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function km(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function wh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ba(t, e = 8) {
  return (typeof t == "bigint" ? t : sn(t)).toString(16).padStart(e * 2, "0");
}
function rl(t) {
  return parseInt(t, 16);
}
function Td(t, e = 16) {
  const n = ba(t, e);
  return Wt(n);
}
function $m(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Im(t, e) {
  return t & BigInt(1) << e;
}
function Au(t) {
  return Lm(BigInt(`0x${yt(t)}`), BigInt(t.byteLength * 8));
}
function Lm(t, e) {
  return Im(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Cm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Cm[n];
  return e;
}
function Wt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = km(t), t = t.length % 2 ? `0${t}` : t;
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
function ma(t) {
  return new TextDecoder().decode(t);
}
function Tm(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Bm(t) {
  return String.fromCharCode.apply(null, t);
}
function Mm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function bh(t) {
  if (t.some(Mm))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $r(...t) {
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
  return $r(...t.map((e) => typeof e == "number" ? bh([e]) : e instanceof Array ? bh(e) : e));
}
function En(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const cg = "https://api.mainnet.hiro.so", lg = "https://api.testnet.hiro.so", ug = "http://localhost:3999", Nm = "https://hub.blockstack.org", _m = 33, Fl = 32;
function Pm(t) {
  if (t.length < Fl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Fl * 2), r = t.slice(2 + Fl * 2);
  return {
    recoveryId: rl(e),
    r: n,
    s: r
  };
}
function Bd(t) {
  const e = typeof t == "string" ? Wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Um(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Hm(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Om(t, e) {
  return t[e];
}
function Dm(t, e, n = 0) {
  return t[n] = e, t;
}
function Fm(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function fo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const jm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Rm(t, e) {
  const n = {};
  return Object.assign(n, jm, e), await fetch(t, n);
}
function zm(t) {
  let e = Rm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Gm(...t) {
  const { fetchLib: e, middlewares: n } = zm(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class dg {
  constructor(e = ig.slice(), n = ((a) => (a = Cd("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = gm) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function vu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Km(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Vm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  vu(t.outputLen), vu(t.blockLen);
}
function Ym(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qm(t, e) {
  fg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const eo = {
  number: vu,
  bool: Km,
  bytes: fg,
  hash: Vm,
  exists: Ym,
  output: qm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, Xm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Xm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Md(t) {
  if (typeof t == "string" && (t = Wm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let hg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function To(t) {
  const e = (r) => t().update(Md(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let pg = class extends hg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, eo.hash(e);
    const r = Md(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const sl = (t, e, n) => new pg(t, e).update(n).digest();
sl.create = (t, e) => new pg(t, e);
function Zm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + d, a, r);
}
let Nd = class extends hg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jl(this.buffer);
  }
  update(e) {
    eo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Md(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = jl(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    eo.exists(this), eo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let u = i; u < s; u++)
      n[u] = 0;
    Zm(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = jl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, p[u], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const Qm = (t, e, n) => t & e ^ ~t & n, Jm = (t, e, n) => t & e ^ t & n ^ e & n, t1 = new Uint32Array([
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
let gg = class extends Nd {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      ls[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = ls[u - 15], g = ls[u - 2], A = fr(w, 7) ^ fr(w, 18) ^ w >>> 3, E = fr(g, 17) ^ fr(g, 19) ^ g >>> 10;
      ls[u] = E + ls[u - 7] + A + ls[u - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), g = p + w + Qm(a, c, d) + t1[u] + ls[u] | 0, E = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + Jm(r, s, o) | 0;
      p = d, d = c, c = a, a = i + g | 0, i = o, o = s, s = r, r = g + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, i, a, c, d, p);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, e1 = class extends gg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const di = To(() => new gg());
To(() => new e1());
const n1 = {}, yg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: n1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Yt = BigInt(0), xe = BigInt(1), _s = BigInt(2), Ji = BigInt(3), mh = BigInt(8), le = Object.freeze({
  a: Yt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: xe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), xh = (t, e) => (t + e / _s) / e, Na = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = le, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -xe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = xh(o * t, e), c = xh(-r * t, e);
    let d = ot(t - a * n - c * s, e), p = ot(-a * r - c * o, e);
    const u = d > i, w = p > i;
    if (u && (d = e - d), w && (p = e - p), d > i || p > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: d, k2neg: w, k2: p };
  }
}, or = 32, ho = 32, wg = 32, vc = or + 1, kc = 2 * or + 1;
function Sh(t) {
  const { a: e, b: n } = le, r = ot(t * t), s = ot(r * t);
  return ot(s + e * t + n);
}
const _a = le.a === Yt;
class _d extends Error {
  constructor(e) {
    super(e);
  }
}
function Eh(t) {
  if (!(t instanceof Jt))
    throw new TypeError("JacobianPoint expected");
}
class Jt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof jt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(jt.ZERO) ? Jt.ZERO : new Jt(e.x, e.y, xe);
  }
  static toAffineBatch(e) {
    const n = a1(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Jt.toAffineBatch(e).map(Jt.fromAffine);
  }
  equals(e) {
    Eh(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e, c = ot(s * s), d = ot(a * a), p = ot(n * d), u = ot(o * c), w = ot(ot(r * a) * d), g = ot(ot(i * s) * c);
    return p === u && w === g;
  }
  negate() {
    return new Jt(this.x, ot(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = ot(e * e), o = ot(n * n), i = ot(o * o), a = e + o, c = ot(_s * (ot(a * a) - s - i)), d = ot(Ji * s), p = ot(d * d), u = ot(p - _s * c), w = ot(d * (c - u) - mh * i), g = ot(_s * n * r);
    return new Jt(u, w, g);
  }
  add(e) {
    Eh(e);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = e;
    if (o === Yt || i === Yt)
      return this;
    if (n === Yt || r === Yt)
      return e;
    const c = ot(s * s), d = ot(a * a), p = ot(n * d), u = ot(o * c), w = ot(ot(r * a) * d), g = ot(ot(i * s) * c), A = ot(u - p), E = ot(g - w);
    if (A === Yt)
      return E === Yt ? this.double() : Jt.ZERO;
    const T = ot(A * A), O = ot(A * T), H = ot(p * T), v = ot(E * E - O - _s * H), B = ot(E * (H - v) - w * O), P = ot(s * a * A);
    return new Jt(v, B, P);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Jt.ZERO;
    if (typeof e == "bigint" && e === Yt)
      return n;
    let r = kh(e);
    if (r === xe)
      return this;
    if (!_a) {
      let u = n, w = this;
      for (; r > Yt; )
        r & xe && (u = u.add(w)), w = w.double(), r >>= xe;
      return u;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Na.splitScalar(r), c = n, d = n, p = this;
    for (; o > Yt || a > Yt; )
      o & xe && (c = c.add(p)), a & xe && (d = d.add(p)), p = p.double(), o >>= xe, a >>= xe;
    return s && (c = c.negate()), i && (d = d.negate()), d = new Jt(ot(d.x * Na.beta), d.y, d.z), c.add(d);
  }
  precomputeWindow(e) {
    const n = _a ? 128 / e + 1 : 256 / e + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let a = 1; a < 2 ** (e - 1); a++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(Jt.BASE) && (n = jt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && ku.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Jt.normalizeZ(s), ku.set(n, s)));
    let o = Jt.ZERO, i = Jt.BASE;
    const a = 1 + (_a ? 128 / r : 256 / r), c = 2 ** (r - 1), d = BigInt(2 ** r - 1), p = 2 ** r, u = BigInt(r);
    for (let w = 0; w < a; w++) {
      const g = w * c;
      let A = Number(e & d);
      e >>= u, A > c && (A -= p, e += xe);
      const E = g, T = g + Math.abs(A) - 1, O = w % 2 !== 0, H = A < 0;
      A === 0 ? i = i.add(Pa(O, s[E])) : o = o.add(Pa(H, s[T]));
    }
    return { p: o, f: i };
  }
  multiply(e, n) {
    let r = kh(e), s, o;
    if (_a) {
      const { k1neg: i, k1: a, k2neg: c, k2: d } = Na.splitScalar(r);
      let { p, f: u } = this.wNAF(a, n), { p: w, f: g } = this.wNAF(d, n);
      p = Pa(i, p), w = Pa(c, w), w = new Jt(ot(w.x * Na.beta), w.y, w.z), s = p.add(w), o = u.add(g);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return Jt.normalizeZ([s, o])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, o = this.equals(Jt.ZERO);
    e == null && (e = o ? mh : Li(s));
    const i = e, a = ot(i * i), c = ot(a * i), d = ot(n * a), p = ot(r * c), u = ot(s * i);
    if (o)
      return jt.ZERO;
    if (u !== xe)
      throw new Error("invZ was invalid");
    return new jt(d, p);
  }
}
Jt.BASE = new Jt(le.Gx, le.Gy, xe);
Jt.ZERO = new Jt(Yt, xe, Yt);
function Pa(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const ku = /* @__PURE__ */ new WeakMap();
class jt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ku.delete(this);
  }
  hasEvenY() {
    return this.y % _s === Yt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Pn(n ? e : e.subarray(1));
    if (!hc(r))
      throw new Error("Point is not on curve");
    const s = Sh(r);
    let o = i1(s);
    const i = (o & xe) === xe;
    n ? i && (o = ot(-o)) : (e[0] & 1) === 1 !== i && (o = ot(-o));
    const a = new jt(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Pn(e.subarray(1, or + 1)), r = Pn(e.subarray(or + 1, or * 2 + 1)), s = new jt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ir(e), r = n.length, s = n[0];
    if (r === or)
      return this.fromCompressedHex(n);
    if (r === vc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === kc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${vc} compressed bytes or ${kc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return jt.BASE.multiply(po(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: o } = xg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Pd(Ir(e)), { n: a } = le, c = r === 2 || r === 3 ? s + a : s, d = Li(c, a), p = ot(-i * d, a), u = ot(o * d, a), w = r & 1 ? "03" : "02", g = jt.fromHex(w + Ps(c)), A = jt.BASE.multiplyAndAddUnsafe(g, p, u);
    if (!A)
      throw new Error("Cannot recover signature: point at infinify");
    return A.assertValidity(), A;
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
    if (!hc(n) || !hc(r))
      throw new Error(e);
    const s = ot(r * r), o = Sh(n);
    if (ot(s - o) !== Yt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new jt(this.x, ot(-this.y));
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
    const s = Jt.fromAffine(this), o = n === Yt || n === xe || this !== jt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = Jt.fromAffine(e).multiplyUnsafe(r), a = o.add(i);
    return a.equals(Jt.ZERO) ? void 0 : a.toAffine();
  }
}
jt.BASE = new jt(le.Gx, le.Gy);
jt.ZERO = new jt(Yt, Yt);
function Ah(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function vh(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${fi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Pn(n), left: t.subarray(e + 2) };
}
function r1(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${fi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = vh(t.subarray(2)), { data: r, left: s } = vh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${fi(s)}`);
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
    const s = n ? fi(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new _n($c(s.slice(0, 64)), $c(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = r1(n ? e : Us(e));
    return new _n(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!pi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!pi(n))
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
    const e = Ah(Gi(this.s)), n = Ah(Gi(this.r)), r = e.length / 2, s = n.length / 2, o = Gi(r), i = Gi(s);
    return `30${Gi(s + r + 4)}02${i}${n}02${o}${e}`;
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
const s1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function fi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += s1[t[n]];
  return e;
}
const o1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ps(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Yt <= t && t < o1))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function hi(t) {
  const e = Us(Ps(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Gi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function $c(t) {
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
  return $c(fi(t));
}
function Ir(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Us(t);
}
function kh(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && pi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ot(t, e = le.P) {
  const n = t % e;
  return n >= Yt ? n : e + n;
}
function Rn(t, e) {
  const { P: n } = le;
  let r = t;
  for (; e-- > Yt; )
    r *= r, r %= n;
  return r;
}
function i1(t) {
  const { P: e } = le, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = t * t * t % e, d = c * c * t % e, p = Rn(d, Ji) * d % e, u = Rn(p, Ji) * d % e, w = Rn(u, _s) * c % e, g = Rn(w, r) * w % e, A = Rn(g, s) * g % e, E = Rn(A, i) * A % e, T = Rn(E, a) * E % e, O = Rn(T, i) * A % e, H = Rn(O, Ji) * d % e, v = Rn(H, o) * g % e, B = Rn(v, n) * c % e, P = Rn(B, _s);
  if (P * P % e !== t)
    throw new Error("Cannot find square root");
  return P;
}
function Li(t, e = le.P) {
  if (t === Yt || e <= Yt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = ot(t, e), r = e, s = Yt, o = xe;
  for (; n !== Yt; ) {
    const a = r / n, c = r % n, d = s - o * a;
    r = n, n = c, s = o, o = d;
  }
  if (r !== xe)
    throw new Error("invert: does not exist");
  return ot(s, e);
}
function a1(t, e = le.P) {
  const n = new Array(t.length), r = t.reduce((o, i, a) => i === Yt ? o : (n[a] = o, ot(o * i, e)), xe), s = Li(r, e);
  return t.reduceRight((o, i, a) => i === Yt ? o : (n[a] = ot(o * n[a], e), ot(o * i, e)), s), n;
}
function c1(t) {
  const e = t.length * 8 - ho * 8, n = Pn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Pd(t, e = !1) {
  const n = c1(t);
  if (e)
    return n;
  const { n: r } = le;
  return n >= r ? n - r : n;
}
let ai, ta;
class bg {
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
    return ta(this.k, ...e);
  }
  checkSync() {
    if (typeof ta != "function")
      throw new _d("hmacSha256Sync needs to be set");
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
function pi(t) {
  return Yt < t && t < le.n;
}
function hc(t) {
  return Yt < t && t < le.P;
}
function mg(t, e, n, r = !0) {
  const { n: s } = le, o = Pd(t, !0);
  if (!pi(o))
    return;
  const i = Li(o, s), a = jt.BASE.multiply(o), c = ot(a.x, s);
  if (c === Yt)
    return;
  const d = ot(i * ot(e + n * c, s), s);
  if (d === Yt)
    return;
  let p = new _n(c, d), u = (a.x === p.r ? 0 : 2) | Number(a.y & xe);
  return r && p.hasHighS() && (p = p.normalizeS(), u ^= 1), { sig: p, recovery: u };
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
    e = $c(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ho)
      throw new Error("Expected 32 bytes of private key");
    e = Pn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!pi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ud(t) {
  return t instanceof jt ? (t.assertValidity(), t) : jt.fromHex(t);
}
function xg(t) {
  if (t instanceof _n)
    return t.assertValidity(), t;
  try {
    return _n.fromDER(t);
  } catch {
    return _n.fromCompact(t);
  }
}
function xa(t, e = !1) {
  return jt.fromPrivateKey(t).toRawBytes(e);
}
function l1(t, e, n, r = !1) {
  return jt.fromSignature(t, e, n).toRawBytes(r);
}
function $h(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === vc || r === kc : n ? r === vc * 2 || r === kc * 2 : t instanceof jt;
}
function Hd(t, e, n = !1) {
  if ($h(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!$h(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ud(e);
  return r.assertValidity(), r.multiply(po(t)).toRawBytes(n);
}
function Sg(t) {
  const e = t.length > or ? t.slice(0, or) : t;
  return Pn(e);
}
function u1(t) {
  const e = Sg(t), n = ot(e, le.n);
  return Eg(n < Yt ? e : n);
}
function Eg(t) {
  return hi(t);
}
function Ag(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ir(t), s = po(e), o = [Eg(s), u1(r)];
  if (n != null) {
    n === !0 && (n = Be.randomBytes(or));
    const c = Ir(n);
    if (c.length !== or)
      throw new Error(`sign: Expected ${or} bytes of extra data`);
    o.push(c);
  }
  const i = Ms(...o), a = Sg(r);
  return { seed: i, m: a, d: s };
}
function vg(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, e), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function d1(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Ag(t, e, n.extraEntropy), i = new bg(wg, ho);
  await i.reseed(r);
  let a;
  for (; !(a = mg(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return vg(a, n);
}
function ol(t, e, n = {}) {
  const { seed: r, m: s, d: o } = Ag(t, e, n.extraEntropy), i = new bg(wg, ho);
  i.reseedSync(r);
  let a;
  for (; !(a = mg(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return vg(a, n);
}
const f1 = { strict: !0 };
function h1(t, e, n, r = f1) {
  let s;
  try {
    s = xg(t), e = Ir(e);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Pd(e);
  let c;
  try {
    c = Ud(n);
  } catch {
    return !1;
  }
  const { n: d } = le, p = Li(i, d), u = ot(a * p, d), w = ot(o * p, d), g = jt.BASE.multiplyAndAddUnsafe(c, u, w);
  return g ? ot(g.x, d) === o : !1;
}
function Ic(t) {
  return ot(Pn(t), le.n);
}
class gi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ir(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Pn(n.subarray(0, 32)), s = Pn(n.subarray(32, 64));
    return new gi(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!hc(e) || !pi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ps(this.r) + Ps(this.s);
  }
  toRawBytes() {
    return Us(this.toHex());
  }
}
function p1(t) {
  return jt.fromPrivateKey(t).toRawX();
}
class kg {
  constructor(e, n, r = Be.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ir(e);
    const { x: s, scalar: o } = this.getScalar(po(n));
    if (this.px = s, this.d = o, this.rand = Ir(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = jt.fromPrivateKey(e), r = n.hasEvenY() ? e : le.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return hi(e ^ Pn(n));
  }
  finalizeNonce(e) {
    const n = ot(Pn(e), le.n);
    if (n === Yt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(e, n, r, s) {
    return new gi(e.x, ot(n + r * s, le.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, o = Be.taggedHash, i = this.initNonce(n, await o(Bs.aux, s)), { R: a, rx: c, k: d } = this.finalizeNonce(await o(Bs.nonce, i, r, e)), p = Ic(await o(Bs.challenge, c, r, e)), u = this.finalizeSig(a, d, p, n);
    return await Lg(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, o = Be.taggedHashSync, i = this.initNonce(n, o(Bs.aux, s)), { R: a, rx: c, k: d } = this.finalizeNonce(o(Bs.nonce, i, r, e)), p = Ic(o(Bs.challenge, c, r, e)), u = this.finalizeSig(a, d, p, n);
    return Cg(u, e, r) || this.error(), u;
  }
}
async function g1(t, e, n) {
  return new kg(t, e, n).calc();
}
function y1(t, e, n) {
  return new kg(t, e, n).calcSync();
}
function $g(t, e, n) {
  const r = t instanceof gi, s = r ? t : gi.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ir(e),
    P: Ud(n)
  };
}
function Ig(t, e, n, r) {
  const s = jt.BASE.multiplyAndAddUnsafe(e, po(n), ot(-r, le.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Lg(t, e, n) {
  try {
    const { r, s, m: o, P: i } = $g(t, e, n), a = Ic(await Be.taggedHash(Bs.challenge, hi(r), i.toRawX(), o));
    return Ig(r, i, s, a);
  } catch {
    return !1;
  }
}
function Cg(t, e, n) {
  try {
    const { r, s, m: o, P: i } = $g(t, e, n), a = Ic(Be.taggedHashSync(Bs.challenge, hi(r), i.toRawX(), o));
    return Ig(r, i, s, a);
  } catch (r) {
    if (r instanceof _d)
      throw r;
    return !1;
  }
}
const w1 = {
  Signature: gi,
  getPublicKey: p1,
  sign: g1,
  verify: Lg,
  signSync: y1,
  verifySync: Cg
};
jt.BASE._setWindowSize(8);
const Cn = {
  node: yg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Bs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ua = {}, Be = {
  bytesToHex: fi,
  hexToBytes: Us,
  concatBytes: Ms,
  mod: ot,
  invert: Li,
  isValidPrivateKey(t) {
    try {
      return po(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: hi,
  _normalizePrivateKey: po,
  hashToPrivateKey: (t) => {
    t = Ir(t);
    const e = ho + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ot(Pn(t), le.n - xe) + xe;
    return hi(n);
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
  precompute(t = 8, e = jt.BASE) {
    const n = e === jt.BASE ? e : new jt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ji), n;
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
    let n = Ua[t];
    if (n === void 0) {
      const r = await Be.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Ua[t] = n;
    }
    return Be.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ai != "function")
      throw new _d("sha256Sync is undefined, you need to set it");
    let n = Ua[t];
    if (n === void 0) {
      const r = ai(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Ua[t] = n;
    }
    return ai(n, ...e);
  },
  _JacobianPoint: Jt
};
Object.defineProperties(Be, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ai;
    },
    set(t) {
      ai || (ai = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ta;
    },
    set(t) {
      ta || (ta = t);
    }
  }
});
const b1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: le,
  Point: jt,
  Signature: _n,
  getPublicKey: xa,
  getSharedSecret: Hd,
  recoverPublicKey: l1,
  schnorr: w1,
  sign: d1,
  signSync: ol,
  utils: Be,
  verify: h1
}, Symbol.toStringTag, { value: "Module" }));
var Sa = {};
Sa.byteLength = A1;
var m1 = Sa.toByteArray = k1, x1 = Sa.fromByteArray = L1, mr = [], Kn = [], S1 = typeof Uint8Array < "u" ? Uint8Array : Array, Rl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var qo = 0, E1 = Rl.length; qo < E1; ++qo)
  mr[qo] = Rl[qo], Kn[Rl.charCodeAt(qo)] = qo;
Kn[45] = 62;
Kn[95] = 63;
function Tg(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function A1(t) {
  var e = Tg(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function v1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function k1(t) {
  var e, n = Tg(t), r = n[0], s = n[1], o = new S1(v1(t, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Kn[t.charCodeAt(c)] << 18 | Kn[t.charCodeAt(c + 1)] << 12 | Kn[t.charCodeAt(c + 2)] << 6 | Kn[t.charCodeAt(c + 3)], o[i++] = e >> 16 & 255, o[i++] = e >> 8 & 255, o[i++] = e & 255;
  return s === 2 && (e = Kn[t.charCodeAt(c)] << 2 | Kn[t.charCodeAt(c + 1)] >> 4, o[i++] = e & 255), s === 1 && (e = Kn[t.charCodeAt(c)] << 10 | Kn[t.charCodeAt(c + 1)] << 4 | Kn[t.charCodeAt(c + 2)] >> 2, o[i++] = e >> 8 & 255, o[i++] = e & 255), o;
}
function $1(t) {
  return mr[t >> 18 & 63] + mr[t >> 12 & 63] + mr[t >> 6 & 63] + mr[t & 63];
}
function I1(t, e, n) {
  for (var r, s = [], o = e; o < n; o += 3)
    r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (t[o + 2] & 255), s.push($1(r));
  return s.join("");
}
function L1(t) {
  for (var e, n = t.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(I1(t, i, i + o > a ? a : i + o));
  return r === 1 ? (e = t[n - 1], s.push(
    mr[e >> 2] + mr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    mr[e >> 10] + mr[e >> 4 & 63] + mr[e << 2 & 63] + "="
  )), s.join("");
}
function C1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const T1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function B1() {
  if (C1())
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
    throw new Error(T1);
  }
}
class M1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createCipher(e, n, r), i = new Uint8Array($r(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const o = this.createDecipher(e, n, r), i = new Uint8Array($r(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class N1 {
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
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, s) {
    let o, i;
    if (e === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (e === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function Bg() {
  const t = await B1();
  return t.name === "subtleCrypto" ? new N1(t.lib) : new M1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function _1(t) {
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
  var i = t.length, a = t.charAt(0), c = Math.log(i) / Math.log(256), d = Math.log(256) / Math.log(i);
  function p(g) {
    if (g instanceof Uint8Array || (ArrayBuffer.isView(g) ? g = new Uint8Array(g.buffer, g.byteOffset, g.byteLength) : Array.isArray(g) && (g = Uint8Array.from(g))), !(g instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (g.length === 0)
      return "";
    for (var A = 0, E = 0, T = 0, O = g.length; T !== O && g[T] === 0; )
      T++, A++;
    for (var H = (O - T) * d + 1 >>> 0, v = new Uint8Array(H); T !== O; ) {
      for (var B = g[T], P = 0, Z = H - 1; (B !== 0 || P < E) && Z !== -1; Z--, P++)
        B += 256 * v[Z] >>> 0, v[Z] = B % i >>> 0, B = B / i >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      E = P, T++;
    }
    for (var it = H - E; it !== H && v[it] === 0; )
      it++;
    for (var tt = a.repeat(A); it < H; ++it)
      tt += t.charAt(v[it]);
    return tt;
  }
  function u(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var A = 0, E = 0, T = 0; g[A] === a; )
      E++, A++;
    for (var O = (g.length - A) * c + 1 >>> 0, H = new Uint8Array(O); g[A]; ) {
      var v = g.charCodeAt(A);
      if (v > 255)
        return;
      var B = e[v];
      if (B === 255)
        return;
      for (var P = 0, Z = O - 1; (B !== 0 || P < T) && Z !== -1; Z--, P++)
        B += i * H[Z] >>> 0, H[Z] = B % 256 >>> 0, B = B / 256 >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      T = P, A++;
    }
    for (var it = O - T; it !== O && H[it] === 0; )
      it++;
    for (var tt = new Uint8Array(E + (O - it)), K = E; it !== O; )
      tt[K++] = H[it++];
    return tt;
  }
  function w(g) {
    var A = u(g);
    if (A)
      return A;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: p,
    decodeUnsafe: u,
    decode: w
  };
}
var Mg = _1;
const P1 = Mg, U1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var H1 = P1(U1);
const O1 = /* @__PURE__ */ ng(H1), D1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ng = Uint8Array.from({ length: 16 }, (t, e) => e), F1 = Ng.map((t) => (9 * t + 5) % 16);
let Od = [Ng], Dd = [F1];
for (let t = 0; t < 4; t++)
  for (let e of [Od, Dd])
    e.push(e[t].map((n) => D1[n]));
const _g = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), j1 = Od.map((t, e) => t.map((n) => _g[e][n])), R1 = Dd.map((t, e) => t.map((n) => _g[e][n])), z1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), G1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ha = (t, e) => t << e | t >>> 32 - e;
function Ih(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Oa = new Uint32Array(16);
let K1 = class extends Nd {
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
    for (let g = 0; g < 16; g++, n += 4)
      Oa[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, E = z1[g], T = G1[g], O = Od[g], H = Dd[g], v = j1[g], B = R1[g];
      for (let P = 0; P < 16; P++) {
        const Z = Ha(r + Ih(g, o, a, d) + Oa[O[P]] + E, v[P]) + u | 0;
        r = u, u = d, d = Ha(a, 10) | 0, a = o, o = Z;
      }
      for (let P = 0; P < 16; P++) {
        const Z = Ha(s + Ih(A, i, c, p) + Oa[H[P]] + T, B[P]) + w | 0;
        s = w, w = p, p = Ha(c, 10) | 0, c = i, i = Z;
      }
    }
    this.set(this.h1 + a + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Oa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const V1 = To(() => new K1());
function Y1(t) {
  return V1(t);
}
const Da = BigInt(2 ** 32 - 1), $u = BigInt(32);
function Pg(t, e = !1) {
  return e ? { h: Number(t & Da), l: Number(t >> $u & Da) } : { h: Number(t >> $u & Da) | 0, l: Number(t & Da) | 0 };
}
function q1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Pg(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const X1 = (t, e) => BigInt(t >>> 0) << $u | BigInt(e >>> 0), W1 = (t, e, n) => t >>> n, Z1 = (t, e, n) => t << 32 - n | e >>> n, Q1 = (t, e, n) => t >>> n | e << 32 - n, J1 = (t, e, n) => t << 32 - n | e >>> n, t2 = (t, e, n) => t << 64 - n | e >>> n - 32, e2 = (t, e, n) => t >>> n - 32 | e << 64 - n, n2 = (t, e) => e, r2 = (t, e) => t, s2 = (t, e, n) => t << n | e >>> 32 - n, o2 = (t, e, n) => e << n | t >>> 32 - n, i2 = (t, e, n) => e << n - 32 | t >>> 64 - n, a2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function c2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const l2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), u2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, d2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), f2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, h2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), p2 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Pg,
  split: q1,
  toBig: X1,
  shrSH: W1,
  shrSL: Z1,
  rotrSH: Q1,
  rotrSL: J1,
  rotrBH: t2,
  rotrBL: e2,
  rotr32H: n2,
  rotr32L: r2,
  rotlSH: s2,
  rotlSL: o2,
  rotlBH: i2,
  rotlBL: a2,
  add: c2,
  add3L: l2,
  add3H: u2,
  add4L: d2,
  add4H: f2,
  add5H: p2,
  add5L: h2
}, [g2, y2] = _t.split([
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
let il = class extends Nd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: d, El: p, Fh: u, Fl: w, Gh: g, Gl: A, Hh: E, Hl: T } = this;
    return [e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = E | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      us[v] = e.getUint32(n), ds[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const B = us[v - 15] | 0, P = ds[v - 15] | 0, Z = _t.rotrSH(B, P, 1) ^ _t.rotrSH(B, P, 8) ^ _t.shrSH(B, P, 7), it = _t.rotrSL(B, P, 1) ^ _t.rotrSL(B, P, 8) ^ _t.shrSL(B, P, 7), tt = us[v - 2] | 0, K = ds[v - 2] | 0, b = _t.rotrSH(tt, K, 19) ^ _t.rotrBH(tt, K, 61) ^ _t.shrSH(tt, K, 6), I = _t.rotrSL(tt, K, 19) ^ _t.rotrBL(tt, K, 61) ^ _t.shrSL(tt, K, 6), M = _t.add4L(it, I, ds[v - 7], ds[v - 16]), N = _t.add4H(M, Z, b, us[v - 7], us[v - 16]);
      us[v] = N | 0, ds[v] = M | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: d, Dl: p, Eh: u, El: w, Fh: g, Fl: A, Gh: E, Gl: T, Hh: O, Hl: H } = this;
    for (let v = 0; v < 80; v++) {
      const B = _t.rotrSH(u, w, 14) ^ _t.rotrSH(u, w, 18) ^ _t.rotrBH(u, w, 41), P = _t.rotrSL(u, w, 14) ^ _t.rotrSL(u, w, 18) ^ _t.rotrBL(u, w, 41), Z = u & g ^ ~u & E, it = w & A ^ ~w & T, tt = _t.add5L(H, P, it, y2[v], ds[v]), K = _t.add5H(tt, O, B, Z, g2[v], us[v]), b = tt | 0, I = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), M = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = E | 0, H = T | 0, E = g | 0, T = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = _t.add(d | 0, p | 0, K | 0, b | 0), d = a | 0, p = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const z = _t.add3L(b, M, V);
      r = _t.add3H(z, K, I, N), s = z | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = _t.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: p } = _t.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = _t.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = _t.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: E, l: T } = _t.add(this.Gh | 0, this.Gl | 0, E | 0, T | 0), { h: O, l: H } = _t.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, a, c, d, p, u, w, g, A, E, T, O, H);
  }
  roundClean() {
    us.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, w2 = class extends il {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, b2 = class extends il {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, m2 = class extends il {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const x2 = To(() => new il());
To(() => new w2());
To(() => new b2());
To(() => new m2());
function Ug(t) {
  return di(t);
}
function S2(t) {
  return x2(t);
}
const E2 = 0;
Be.hmacSha256Sync = (t, ...e) => {
  const n = sl.create(di, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function A2() {
  return yt(Be.randomPrivateKey());
}
function v2(t) {
  const e = di(di(t));
  return O1.encode($r(t, e).slice(0, t.length + 4));
}
function k2(t, e) {
  return v2($r(new Uint8Array([t]), e.slice(0, 20)));
}
function Hg(t, e = E2) {
  const n = typeof t == "string" ? Wt(t) : t, r = Y1(Ug(n));
  return k2(e, r);
}
function Og(t) {
  const e = Bd(t);
  return yt(xa(e.slice(0, 32), !0));
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = sl.create(di, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Lc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Lc || (Lc = {}));
async function $2(t, e, n) {
  return await (await Bg()).encrypt("aes-256-cbc", e, t, n);
}
async function I2(t, e, n) {
  return await (await Bg()).decrypt("aes-256-cbc", e, t, n);
}
function Dg(t, e) {
  return sl(di, t, e);
}
function L2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Fg(t) {
  const e = S2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function C2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function T2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Lc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Lc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !C2(t))
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
async function B2(t, e, n, r) {
  const s = T2(t);
  if (!s.result)
    throw s;
  const o = Be.randomPrivateKey(), i = xa(o, !0);
  let a = Hd(o, t, !0);
  a = a.slice(1);
  const c = Fg(a), d = Be.randomBytes(16), p = await $2(d, c.encryptionKey, e), u = $r(d, i, p), w = Dg(c.hmacKey, u);
  let g;
  if (!r || r === "hex")
    g = yt(p);
  else if (r === "base64")
    g = x1(p);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const A = {
    iv: yt(d),
    ephemeralPK: yt(i),
    cipherText: g,
    mac: yt(w),
    wasString: n
  };
  return r && r !== "hex" && (A.cipherTextEncoding = r), A;
}
async function jg(t, e) {
  if (!e.ephemeralPK)
    throw new gh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Hd(t, n, !0);
  r = r.slice(1);
  const s = Fg(r), o = Wt(e.iv);
  let i;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    i = Wt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    i = m1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = $r(o, Wt(n), i), c = Dg(s.hmacKey, a), d = Wt(e.mac);
  if (!L2(d, c))
    throw new gh("Decryption failed: failure in MAC check");
  const p = await I2(o, s.encryptionKey, i);
  return e.wasString ? ma(p) : p;
}
function M2(t, e) {
  const n = typeof e == "string" ? Co(e) : e, r = Og(t), s = Ug(n), o = ol(s, t);
  return {
    signature: yt(o),
    publicKey: r
  };
}
async function N2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Og(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", o = typeof t == "string" ? Co(t) : t, i = await B2(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = M2(r, a), d = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(d);
  }
  return a;
}
function _2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return jg(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Xe = {}, yi = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
un.decode = un.encode = un.unescape = un.escape = un.pad = void 0;
const Rg = Sa;
function Fd(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
un.pad = Fd;
function zg(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
un.escape = zg;
function Gg(t) {
  return Fd(t).replace(/-/g, "+").replace(/_/g, "/");
}
un.unescape = Gg;
function P2(t) {
  return zg((0, Rg.fromByteArray)(new TextEncoder().encode(t)));
}
un.encode = P2;
function U2(t) {
  return new TextDecoder().decode((0, Rg.toByteArray)(Fd(Gg(t))));
}
un.decode = U2;
var al = {}, cl = {}, Kg = {}, Vg = {}, ll = {};
Object.defineProperty(ll, "__esModule", { value: !0 });
ll.crypto = void 0;
ll.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = o, t.aexists = i, t.aoutput = a, t.u8 = c, t.u32 = d, t.clean = p, t.createView = u, t.rotr = w, t.rotl = g, t.byteSwap = A, t.byteSwap32 = E, t.bytesToHex = H, t.hexToBytes = P, t.asyncLoop = it, t.utf8ToBytes = tt, t.bytesToUtf8 = K, t.toBytes = b, t.kdfInputToBytes = I, t.concatBytes = M, t.checkOpts = N, t.createHasher = z, t.createOptHasher = mt, t.createXOFer = dt, t.randomBytes = Kt;
  const e = ll;
  function n(L) {
    return L instanceof Uint8Array || ArrayBuffer.isView(L) && L.constructor.name === "Uint8Array";
  }
  function r(L) {
    if (!Number.isSafeInteger(L) || L < 0)
      throw new Error("positive integer expected, got " + L);
  }
  function s(L, ...F) {
    if (!n(L))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(L.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + L.length);
  }
  function o(L) {
    if (typeof L != "function" || typeof L.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(L.outputLen), r(L.blockLen);
  }
  function i(L, F = !0) {
    if (L.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && L.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(L, F) {
    s(L);
    const ut = F.outputLen;
    if (L.length < ut)
      throw new Error("digestInto() expects output buffer of length at least " + ut);
  }
  function c(L) {
    return new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
  }
  function d(L) {
    return new Uint32Array(L.buffer, L.byteOffset, Math.floor(L.byteLength / 4));
  }
  function p(...L) {
    for (let F = 0; F < L.length; F++)
      L[F].fill(0);
  }
  function u(L) {
    return new DataView(L.buffer, L.byteOffset, L.byteLength);
  }
  function w(L, F) {
    return L << 32 - F | L >>> F;
  }
  function g(L, F) {
    return L << F | L >>> 32 - F >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function A(L) {
    return L << 24 & 4278190080 | L << 8 & 16711680 | L >>> 8 & 65280 | L >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (L) => L : (L) => A(L), t.byteSwapIfBE = t.swap8IfBE;
  function E(L) {
    for (let F = 0; F < L.length; F++)
      L[F] = A(L[F]);
    return L;
  }
  t.swap32IfBE = t.isLE ? (L) => L : E;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", O = /* @__PURE__ */ Array.from({ length: 256 }, (L, F) => F.toString(16).padStart(2, "0"));
  function H(L) {
    if (s(L), T)
      return L.toHex();
    let F = "";
    for (let ut = 0; ut < L.length; ut++)
      F += O[L[ut]];
    return F;
  }
  const v = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function B(L) {
    if (L >= v._0 && L <= v._9)
      return L - v._0;
    if (L >= v.A && L <= v.F)
      return L - (v.A - 10);
    if (L >= v.a && L <= v.f)
      return L - (v.a - 10);
  }
  function P(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (T)
      return Uint8Array.fromHex(L);
    const F = L.length, ut = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const Et = new Uint8Array(ut);
    for (let wt = 0, $t = 0; wt < ut; wt++, $t += 2) {
      const ke = B(L.charCodeAt($t)), Lt = B(L.charCodeAt($t + 1));
      if (ke === void 0 || Lt === void 0) {
        const Bt = L[$t] + L[$t + 1];
        throw new Error('hex string expected, got non-hex character "' + Bt + '" at index ' + $t);
      }
      Et[wt] = ke * 16 + Lt;
    }
    return Et;
  }
  const Z = async () => {
  };
  t.nextTick = Z;
  async function it(L, F, ut) {
    let Et = Date.now();
    for (let wt = 0; wt < L; wt++) {
      ut(wt);
      const $t = Date.now() - Et;
      $t >= 0 && $t < F || (await (0, t.nextTick)(), Et += $t);
    }
  }
  function tt(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function K(L) {
    return new TextDecoder().decode(L);
  }
  function b(L) {
    return typeof L == "string" && (L = tt(L)), s(L), L;
  }
  function I(L) {
    return typeof L == "string" && (L = tt(L)), s(L), L;
  }
  function M(...L) {
    let F = 0;
    for (let Et = 0; Et < L.length; Et++) {
      const wt = L[Et];
      s(wt), F += wt.length;
    }
    const ut = new Uint8Array(F);
    for (let Et = 0, wt = 0; Et < L.length; Et++) {
      const $t = L[Et];
      ut.set($t, wt), wt += $t.length;
    }
    return ut;
  }
  function N(L, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, F);
  }
  class V {
  }
  t.Hash = V;
  function z(L) {
    const F = (Et) => L().update(b(Et)).digest(), ut = L();
    return F.outputLen = ut.outputLen, F.blockLen = ut.blockLen, F.create = () => L(), F;
  }
  function mt(L) {
    const F = (Et, wt) => L(wt).update(b(Et)).digest(), ut = L({});
    return F.outputLen = ut.outputLen, F.blockLen = ut.blockLen, F.create = (Et) => L(Et), F;
  }
  function dt(L) {
    const F = (Et, wt) => L(wt).update(b(Et)).digest(), ut = L({});
    return F.outputLen = ut.outputLen, F.blockLen = ut.blockLen, F.create = (Et) => L(Et), F;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = mt, t.wrapXOFConstructorWithOpts = dt;
  function Kt(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Vg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Vg;
  class n extends e.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(o);
      const a = (0, e.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, d = new Uint8Array(c);
      d.set(a.length > c ? o.create().update(a).digest() : a);
      for (let p = 0; p < d.length; p++)
        d[p] ^= 54;
      this.iHash.update(d), this.oHash = o.create();
      for (let p = 0; p < d.length; p++)
        d[p] ^= 106;
      this.oHash.update(d), (0, e.clean)(d);
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
      const { oHash: i, iHash: a, finished: c, destroyed: d, blockLen: p, outputLen: u } = this;
      return o = o, o.finished = c, o.destroyed = d, o.blockLen = p, o.outputLen = u, o.oHash = i._cloneInto(o.oHash), o.iHash = a._cloneInto(o.iHash), o;
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
})(Kg);
const Xo = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Yg(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Iu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Bo(t, ...e) {
  if (!Yg(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function H2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Iu(t.outputLen), Iu(t.blockLen);
}
function Lu(t, e = !0) {
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
function O2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function D2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Cc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function pc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Qn(t, e) {
  return t << 32 - e | t >>> e;
}
function F2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const jd = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Rd(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Xg = jd ? (t) => t : (t) => Rd(t), j2 = Xg;
function Wg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Rd(t[e]);
  return t;
}
const R2 = jd ? (t) => t : Wg, Zg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", z2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zd(t) {
  if (Bo(t), Zg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += z2[t[n]];
  return e;
}
const Or = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Lh(t) {
  if (t >= Or._0 && t <= Or._9)
    return t - Or._0;
  if (t >= Or.A && t <= Or.F)
    return t - (Or.A - 10);
  if (t >= Or.a && t <= Or.f)
    return t - (Or.a - 10);
}
function G2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Zg)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Lh(t.charCodeAt(o)), a = Lh(t.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = t[o] + t[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const Qg = async () => {
};
async function K2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < e || (await Qg(), r += o);
  }
}
function Gd(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function V2(t) {
  return new TextDecoder().decode(t);
}
function Ea(t) {
  return typeof t == "string" && (t = Gd(t)), Bo(t), t;
}
function Y2(t) {
  return typeof t == "string" && (t = Gd(t)), Bo(t), t;
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
function X2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Jg = class {
};
function ul(t) {
  const e = (r) => t().update(Ea(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ty(t) {
  const e = (r, s) => t(s).update(Ea(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function ey(t) {
  const e = (r, s) => t(s).update(Ea(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const W2 = ul, Z2 = ty, Q2 = ey;
function J2(t = 32) {
  if (Xo && typeof Xo.getRandomValues == "function")
    return Xo.getRandomValues(new Uint8Array(t));
  if (Xo && typeof Xo.randomBytes == "function")
    return Uint8Array.from(Xo.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const tx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Jg,
  abytes: Bo,
  aexists: Lu,
  ahash: H2,
  anumber: Iu,
  aoutput: qg,
  asyncLoop: K2,
  byteSwap: Rd,
  byteSwap32: Wg,
  byteSwapIfBE: j2,
  bytesToHex: zd,
  bytesToUtf8: V2,
  checkOpts: X2,
  clean: Cc,
  concatBytes: q2,
  createHasher: ul,
  createOptHasher: ty,
  createView: pc,
  createXOFer: ey,
  hexToBytes: G2,
  isBytes: Yg,
  isLE: jd,
  kdfInputToBytes: Y2,
  nextTick: Qg,
  randomBytes: J2,
  rotl: F2,
  rotr: Qn,
  swap32IfBE: R2,
  swap8IfBE: Xg,
  toBytes: Ea,
  u32: D2,
  u8: O2,
  utf8ToBytes: Gd,
  wrapConstructor: W2,
  wrapConstructorWithOpts: Z2,
  wrapXOFConstructorWithOpts: Q2
}, Symbol.toStringTag, { value: "Module" }));
function ex(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + d, a, r);
}
function nx(t, e, n) {
  return t & e ^ ~t & n;
}
function rx(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class sx extends Jg {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = pc(this.buffer);
  }
  update(e) {
    Lu(this), e = Ea(e), Bo(e);
    const { view: n, buffer: r, blockLen: s } = this, o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = pc(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Lu(this), qg(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Cc(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let u = i; u < s; u++)
      n[u] = 0;
    ex(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = pc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, p[u], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.destroyed = i, e.finished = o, e.length = s, e.pos = a, s % n && e.buffer.set(r), e;
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
]), ox = /* @__PURE__ */ Uint32Array.from([
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
let Kd = class extends sx {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = fs[0] | 0, this.B = fs[1] | 0, this.C = fs[2] | 0, this.D = fs[3] | 0, this.E = fs[4] | 0, this.F = fs[5] | 0, this.G = fs[6] | 0, this.H = fs[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      ps[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = ps[u - 15], g = ps[u - 2], A = Qn(w, 7) ^ Qn(w, 18) ^ w >>> 3, E = Qn(g, 17) ^ Qn(g, 19) ^ g >>> 10;
      ps[u] = E + ps[u - 7] + A + ps[u - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = Qn(a, 6) ^ Qn(a, 11) ^ Qn(a, 25), g = p + w + nx(a, c, d) + ox[u] + ps[u] | 0, E = (Qn(r, 2) ^ Qn(r, 13) ^ Qn(r, 22)) + rx(r, s, o) | 0;
      p = d, d = c, c = a, a = i + g | 0, i = o, o = s, s = r, r = g + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, i, a, c, d, p);
  }
  roundClean() {
    Cc(ps);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Cc(this.buffer);
  }
}, ny = class extends Kd {
  constructor() {
    super(28), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
  }
};
const ix = /* @__PURE__ */ ul(() => new Kd()), ax = /* @__PURE__ */ ul(() => new ny()), cx = Kd, Vd = ix, lx = ny, ux = ax, dx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: lx,
  SHA256: cx,
  sha224: ux,
  sha256: Vd
}, Symbol.toStringTag, { value: "Module" })), dl = /* @__PURE__ */ nl(dx), fx = /* @__PURE__ */ nl(b1);
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.joseToDer = wi.derToJose = void 0;
const ry = Sa, sy = un;
function zl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const hx = {
  ES256: zl(256),
  ES384: zl(384),
  ES512: zl(521)
};
function oy(t) {
  const e = hx[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Tc = 128, iy = 0, px = 32, gx = 16, yx = 2, ay = gx | px | iy << 6, Bc = yx | iy << 6;
function cy(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, ry.toByteArray)((0, sy.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function wx(t, e) {
  const n = cy(t), r = oy(e), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== ay)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (Tc | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== Bc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const d = i;
  if (i += c, n[i++] !== Bc)
    throw new Error('Could not find expected "int" for "s"');
  const p = n[i++];
  if (o - i !== p)
    throw new Error(`"s" specified length of "${p}", expected "${o - i}"`);
  if (s < p)
    throw new Error(`"s" specified length of "${p}", max of "${s}" is acceptable`);
  const u = i;
  if (i += p, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const w = r - c, g = r - p, A = new Uint8Array(w + c + g + p);
  for (i = 0; i < w; ++i)
    A[i] = 0;
  A.set(n.subarray(d + Math.max(-w, 0), d + c), i), i = r;
  for (const E = i; i < E + g; ++i)
    A[i] = 0;
  return A.set(n.subarray(u + Math.max(-g, 0), u + p), i), (0, sy.escape)((0, ry.fromByteArray)(A));
}
wi.derToJose = wx;
function Ch(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Tc && --r, r;
}
function bx(t, e) {
  t = cy(t);
  const n = oy(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Ch(t, 0, n), o = Ch(t, n, t.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, d = c < Tc, p = new Uint8Array((d ? 2 : 3) + c);
  let u = 0;
  return p[u++] = ay, d ? p[u++] = c : (p[u++] = Tc | 1, p[u++] = c & 255), p[u++] = Bc, p[u++] = i, s < 0 ? (p[u++] = 0, p.set(t.subarray(0, n), u), u += n) : (p.set(t.subarray(s, n), u), u += n - s), p[u++] = Bc, p[u++] = a, o < 0 ? (p[u++] = 0, p.set(t.subarray(n), u)) : p.set(t.subarray(n + o), u), p;
}
wi.joseToDer = bx;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.InvalidTokenError = Xr.MissingParametersError = void 0;
class mx extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Xr.MissingParametersError = mx;
class xx extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Xr.InvalidTokenError = xx;
const Aa = /* @__PURE__ */ nl(tx);
Object.defineProperty(cl, "__esModule", { value: !0 });
cl.SECP256K1Client = void 0;
const Sx = Kg, Ex = dl, gc = fx, Th = wi, Bh = Xr, Mh = Aa;
gc.utils.hmacSha256Sync = (t, ...e) => {
  const n = Sx.hmac.create(Ex.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class ly {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Mh.bytesToHex)(gc.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Bh.MissingParametersError("a signing input hash and private key are all required");
    const s = gc.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Mh.bytesToHex)(s);
    if (r === "jose")
      return (0, Th.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Th.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Bh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return gc.verify(n, e, r, { strict: !1 });
  }
}
cl.SECP256K1Client = ly;
ly.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = cl;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(al);
var go = {};
const Ax = /* @__PURE__ */ nl(yg);
var vx = fn && fn.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(p) {
      try {
        d(r.next(p));
      } catch (u) {
        i(u);
      }
    }
    function c(p) {
      try {
        d(r.throw(p));
      } catch (u) {
        i(u);
      }
    }
    function d(p) {
      p.done ? o(p.value) : s(p.value).then(a, c);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(go, "__esModule", { value: !0 });
go.hashSha256Async = go.hashSha256 = void 0;
const kx = dl;
function uy(t) {
  return (0, kx.sha256)(t);
}
go.hashSha256 = uy;
function $x(t) {
  return vx(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Ax;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(uy(t));
    }
  });
}
go.hashSha256Async = $x;
var Ix = fn && fn.__awaiter || function(t, e, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(p) {
      try {
        d(r.next(p));
      } catch (u) {
        i(u);
      }
    }
    function c(p) {
      try {
        d(r.throw(p));
      } catch (u) {
        i(u);
      }
    }
    function d(p) {
      p.done ? o(p.value) : s(p.value).then(a, c);
    }
    d((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.TokenSigner = yi.createUnsecuredToken = void 0;
const Cu = un, Nh = al, Lx = Xr, _h = go;
function Tu(t, e) {
  const n = [], r = Cu.encode(JSON.stringify(e));
  n.push(r);
  const s = Cu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Cx(t) {
  return Tu(t, { typ: "JWT", alg: "none" }) + ".";
}
yi.createUnsecuredToken = Cx;
class Tx {
  constructor(e, n) {
    if (!(e && n))
      throw new Lx.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Nh.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Nh.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), o = Tu(e, s), i = (0, _h.hashSha256)(o);
    return this.createWithSignedHash(e, n, s, o, i);
  }
  signAsync(e, n = !1, r = {}) {
    return Ix(this, void 0, void 0, function* () {
      const s = this.header(r), o = Tu(e, s), i = yield (0, _h.hashSha256Async)(o);
      return this.createWithSignedHash(e, n, s, o, i);
    });
  }
  createWithSignedHash(e, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Cu.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [i]
    } : [s, i].join(".");
  }
}
yi.TokenSigner = Tx;
var fl = {};
Object.defineProperty(fl, "__esModule", { value: !0 });
fl.TokenVerifier = void 0;
const Bx = un, Ph = al, Mx = Xr, Fa = go;
class Nx {
  constructor(e, n) {
    if (!(e && n))
      throw new Mx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Ph.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ph.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), s = r[0] + "." + r[1], o = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, Fa.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Fa.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Bx.encode(e.payload)].join(".");
    let s = !0;
    const o = (i) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Fa.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Fa.hashSha256)(r);
      return o(i);
    }
  }
}
fl.TokenVerifier = Nx;
var hl = {};
Object.defineProperty(hl, "__esModule", { value: !0 });
hl.decodeToken = void 0;
const ja = un;
function _x(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ja.decode(e[0])), r = JSON.parse(ja.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ja.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ja.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
hl.decodeToken = _x;
(function(t) {
  var e = fn && fn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = fn && fn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && e(s, r, o);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(yi, t), n(fl, t), n(hl, t), n(Xr, t), n(al, t);
})(Xe);
function Px(t) {
  return `did:btc-addr:${t}`;
}
function Ux(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new ph("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new ph('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function dy(t) {
  if (t)
    return Ux(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Hx = "1.4.0";
function Ox() {
  return A2();
}
function Dx(t, e, n, r = ig.slice(), s, o = xm().getTime(), i = {}) {
  const a = (g) => {
    const A = Cd("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return A == null ? void 0 : A.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: Em(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Hx,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), d = Xe.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [d];
  const p = Hg(d);
  return c.iss = Px(p), new Xe.TokenSigner("ES256k", t).sign(c);
}
async function Uh(t, e) {
  const n = ma(Wt(e)), r = JSON.parse(n), s = await jg(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Fx(t) {
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
function jx(t) {
  const e = Xe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = dy(e.iss);
  if (n.length === 1) {
    if (Hg(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Rx(t) {
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
function zx(t) {
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
function Gx(t) {
  const e = [
    zx(t),
    Rx(t),
    Fx(t),
    jx(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Hh = "1.0.0";
class Hs {
  constructor(e) {
    this.version = Hh, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Hh)
      throw new Su(`JSON data version ${e.version} not supported by SessionData`);
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
class fy {
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
class Oh extends fy {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Hs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new ag("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Hs({})), !0;
  }
}
class Dh extends fy {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = wm, !localStorage.getItem(this.key)) {
      const r = new Hs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new ag("No session data was found in localStorage");
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
var aa;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(aa || (aa = {}));
var Mc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mc || (Mc = {}));
aa.Mainnet;
var Kr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Kr || (Kr = {}));
var Er;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Er || (Er = {}));
Kr.Mainnet;
const hy = {
  chainId: aa.Mainnet,
  transactionVersion: Kr.Mainnet,
  peerNetworkId: Mc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Er.MainnetSingleSig,
    multiSig: Er.MainnetMultiSig
  },
  client: { baseUrl: cg }
}, Bu = {
  chainId: aa.Testnet,
  transactionVersion: Kr.Testnet,
  peerNetworkId: Mc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Er.TestnetSingleSig,
    multiSig: Er.TestnetMultiSig
  },
  client: { baseUrl: lg }
}, yc = {
  ...Bu,
  addressVersion: { ...Bu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ug }
}, Kx = {
  ...yc,
  addressVersion: { ...yc.addressVersion },
  client: { ...yc.client }
};
function Vx(t) {
  switch (t) {
    case "mainnet":
      return hy;
    case "testnet":
      return Bu;
    case "devnet":
      return yc;
    case "mocknet":
      return Kx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function py(t) {
  return typeof t == "string" ? Vx(t) : t;
}
var Fh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Fh || (Fh = {}));
var jh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(jh || (jh = {}));
var Jn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Jn || (Jn = {}));
const Gl = ["onChainOnly", "offChainOnly", "any"];
Gl[0] + "", Jn.OnChainOnly, Gl[1] + "", Jn.OffChainOnly, Gl[2] + "", Jn.Any, Jn.OnChainOnly + "", Jn.OnChainOnly, Jn.OffChainOnly + "", Jn.OffChainOnly, Jn.Any + "", Jn.Any;
var Rh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Rh || (Rh = {}));
var zh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(zh || (zh = {}));
var Gh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Gh || (Gh = {}));
var zr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(zr || (zr = {}));
var Kh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Kh || (Kh = {}));
var Vh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Vh || (Vh = {}));
var Yh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Yh || (Yh = {}));
var qh;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(qh || (qh = {}));
var Xh;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Xh || (Xh = {}));
var Wh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Wh || (Wh = {}));
var Zh;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Zh || (Zh = {}));
var Qh;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Qh || (Qh = {}));
var Jh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Jh || (Jh = {}));
function Mu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Yx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function qx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Mu(t.outputLen), Mu(t.blockLen);
}
function Xx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Wx(t, e) {
  gy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const no = {
  number: Mu,
  bool: Yx,
  bytes: gy,
  hash: qx,
  exists: Xx,
  output: Wx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Kl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, Zx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yd(t) {
  if (typeof t == "string" && (t = Qx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let yy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Mo(t) {
  const e = (r) => t().update(Yd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let wy = class extends yy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, no.hash(e);
    const r = Yd(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const by = (t, e, n) => new wy(t, e).update(n).digest();
by.create = (t, e) => new wy(t, e);
function Jx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + d, a, r);
}
let qd = class extends yy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Kl(this.buffer);
  }
  update(e) {
    no.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Yd(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Kl(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    no.exists(this), no.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let u = i; u < s; u++)
      n[u] = 0;
    Jx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Kl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, p[u], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const tS = (t, e, n) => t & e ^ ~t & n, eS = (t, e, n) => t & e ^ t & n ^ e & n, nS = new Uint32Array([
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
let my = class extends qd {
  constructor() {
    super(64, 32, 8, !1), this.A = gs[0] | 0, this.B = gs[1] | 0, this.C = gs[2] | 0, this.D = gs[3] | 0, this.E = gs[4] | 0, this.F = gs[5] | 0, this.G = gs[6] | 0, this.H = gs[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      ys[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = ys[u - 15], g = ys[u - 2], A = hr(w, 7) ^ hr(w, 18) ^ w >>> 3, E = hr(g, 17) ^ hr(g, 19) ^ g >>> 10;
      ys[u] = E + ys[u - 7] + A + ys[u - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), g = p + w + tS(a, c, d) + nS[u] + ys[u] | 0, E = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + eS(r, s, o) | 0;
      p = d, d = c, c = a, a = i + g | 0, i = o, o = s, s = r, r = g + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, i, a, c, d, p);
  }
  roundClean() {
    ys.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, rS = class extends my {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const xy = Mo(() => new my());
Mo(() => new rS());
var No = {}, Xd = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Aa;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], d = 0;
    for (let g = i.length - 1; g >= 0; g--)
      if (d < 4) {
        const A = n.indexOf(i[g]) >> d;
        let E = 0;
        g !== 0 && (E = n.indexOf(i[g - 1]));
        const T = 1 + d, O = E % (1 << T) << 5 - T, H = t.c32[A + O];
        d = T, c.unshift(H);
      } else
        d = 0;
    let p = 0;
    for (let g = 0; g < c.length && c[g] === "0"; g++)
      p++;
    c = c.slice(p);
    const u = new TextDecoder().decode((0, e.hexToBytes)(i)).match(/^\u0000*/), w = u ? u[0].length : 0;
    for (let g = 0; g < w; g++)
      c.unshift(t.c32[0]);
    if (a) {
      const g = a - c.length;
      for (let A = 0; A < g; A++)
        c.unshift(t.c32[0]);
    }
    return c.join("");
  }
  t.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${t.c32[0]}*`), d = c ? c[0].length : 0;
    let p = [], u = 0, w = 0;
    for (let E = i.length - 1; E >= 0; E--) {
      w === 4 && (p.unshift(n[u]), w = 0, u = 0);
      const O = (t.c32.indexOf(i[E]) << w) + u, H = n[O % 16];
      if (w += 1, u = O >> 4, u > 1 << w)
        throw new Error("Panic error in decoding.");
      p.unshift(H);
    }
    p.unshift(n[u]), p.length % 2 === 1 && p.unshift("0");
    let g = 0;
    for (let E = 0; E < p.length && p[E] === "0"; E++)
      g++;
    p = p.slice(g - g % 2);
    let A = p.join("");
    for (let E = 0; E < d; E++)
      A = `00${A}`;
    if (a) {
      const E = a * 2 - A.length;
      for (let T = 0; T < E; T += 2)
        A = `00${A}`;
    }
    return A;
  }
  t.c32decode = o;
})(Xd);
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
yo.c32checkDecode = yo.c32checkEncode = void 0;
const tp = dl, ep = Aa, ea = Xd;
function Sy(t) {
  const e = (0, tp.sha256)((0, tp.sha256)((0, ep.hexToBytes)(t)));
  return (0, ep.bytesToHex)(e.slice(0, 4));
}
function sS(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Sy(`${n}${e}`), s = (0, ea.c32encode)(`${e}${r}`);
  return `${ea.c32[t]}${s}`;
}
yo.c32checkEncode = sS;
function oS(t) {
  t = (0, ea.c32normalize)(t);
  const e = (0, ea.c32decode)(t.slice(1)), n = t[0], r = ea.c32.indexOf(n), s = e.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Sy(`${o}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
yo.c32checkDecode = oS;
var Ey = {}, bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.decode = bi.encode = void 0;
const Nc = dl, np = Aa, Ay = Mg, vy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function iS(t, e = "00") {
  const n = typeof t == "string" ? (0, np.hexToBytes)(t) : t, r = typeof e == "string" ? (0, np.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Nc.sha256)((0, Nc.sha256)(new Uint8Array([...r, ...n])));
  return Ay(vy).encode([...r, ...n, ...s.slice(0, 4)]);
}
bi.encode = iS;
function aS(t) {
  const e = Ay(vy).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Nc.sha256)((0, Nc.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
bi.decode = aS;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = yo, n = bi, r = Aa;
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
  function i(p, u) {
    if (!u.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(p, u)}`;
  }
  t.c32address = i;
  function a(p) {
    if (p.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (p[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(p.slice(1));
  }
  t.c32addressDecode = a;
  function c(p, u = -1) {
    const w = n.decode(p), g = (0, r.bytesToHex)(w.data), A = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let E;
    return u < 0 ? (E = A, s[A] !== void 0 && (E = s[A])) : E = u, i(E, g);
  }
  t.b58ToC32 = c;
  function d(p, u = -1) {
    const w = a(p), g = w[0], A = w[1];
    let E;
    u < 0 ? (E = g, o[g] !== void 0 && (E = o[g])) : E = u;
    let T = E.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(A, T);
  }
  t.c32ToB58 = d;
})(Ey);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Xd;
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
  const r = Ey;
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
function cS(t, e) {
  switch (e = py(e ?? hy), t) {
    case zr.P2PKH:
      switch (e.transactionVersion) {
        case Kr.Mainnet:
          return Er.MainnetSingleSig;
        case Kr.Testnet:
          return Er.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case zr.P2SH:
    case zr.P2SHNonSequential:
    case zr.P2WPKH:
    case zr.P2WSH:
    case zr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Kr.Mainnet:
          return Er.MainnetMultiSig;
        case Kr.Testnet:
          return Er.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const lS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ky = Uint8Array.from({ length: 16 }, (t, e) => e), uS = ky.map((t) => (9 * t + 5) % 16);
let Wd = [ky], Zd = [uS];
for (let t = 0; t < 4; t++)
  for (let e of [Wd, Zd])
    e.push(e[t].map((n) => lS[n]));
const $y = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), dS = Wd.map((t, e) => t.map((n) => $y[e][n])), fS = Zd.map((t, e) => t.map((n) => $y[e][n])), hS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ra = (t, e) => t << e | t >>> 32 - e;
function rp(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const za = new Uint32Array(16);
let gS = class extends qd {
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
    for (let g = 0; g < 16; g++, n += 4)
      za[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, E = hS[g], T = pS[g], O = Wd[g], H = Zd[g], v = dS[g], B = fS[g];
      for (let P = 0; P < 16; P++) {
        const Z = Ra(r + rp(g, o, a, d) + za[O[P]] + E, v[P]) + u | 0;
        r = u, u = d, d = Ra(a, 10) | 0, a = o, o = Z;
      }
      for (let P = 0; P < 16; P++) {
        const Z = Ra(s + rp(A, i, c, p) + za[H[P]] + T, B[P]) + w | 0;
        s = w, w = p, p = Ra(c, 10) | 0, c = i, i = Z;
      }
    }
    this.set(this.h1 + a + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    za.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const yS = Mo(() => new gS()), Ga = BigInt(2 ** 32 - 1), Nu = BigInt(32);
function Iy(t, e = !1) {
  return e ? { h: Number(t & Ga), l: Number(t >> Nu & Ga) } : { h: Number(t >> Nu & Ga) | 0, l: Number(t & Ga) | 0 };
}
function wS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Iy(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const bS = (t, e) => BigInt(t >>> 0) << Nu | BigInt(e >>> 0), mS = (t, e, n) => t >>> n, xS = (t, e, n) => t << 32 - n | e >>> n, SS = (t, e, n) => t >>> n | e << 32 - n, ES = (t, e, n) => t << 32 - n | e >>> n, AS = (t, e, n) => t << 64 - n | e >>> n - 32, vS = (t, e, n) => t >>> n - 32 | e << 64 - n, kS = (t, e) => e, $S = (t, e) => t, IS = (t, e, n) => t << n | e >>> 32 - n, LS = (t, e, n) => e << n | t >>> 32 - n, CS = (t, e, n) => e << n - 32 | t >>> 64 - n, TS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function BS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const MS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), NS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, _S = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), PS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, US = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), HS = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Iy,
  split: wS,
  toBig: bS,
  shrSH: mS,
  shrSL: xS,
  rotrSH: SS,
  rotrSL: ES,
  rotrBH: AS,
  rotrBL: vS,
  rotr32H: kS,
  rotr32L: $S,
  rotlSH: IS,
  rotlSL: LS,
  rotlBH: CS,
  rotlBL: TS,
  add: BS,
  add3L: MS,
  add3H: NS,
  add4L: _S,
  add4H: PS,
  add5H: HS,
  add5L: US
}, [OS, DS] = Pt.split([
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
let pl = class extends qd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: d, El: p, Fh: u, Fl: w, Gh: g, Gl: A, Hh: E, Hl: T } = this;
    return [e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = E | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ws[v] = e.getUint32(n), bs[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const B = ws[v - 15] | 0, P = bs[v - 15] | 0, Z = Pt.rotrSH(B, P, 1) ^ Pt.rotrSH(B, P, 8) ^ Pt.shrSH(B, P, 7), it = Pt.rotrSL(B, P, 1) ^ Pt.rotrSL(B, P, 8) ^ Pt.shrSL(B, P, 7), tt = ws[v - 2] | 0, K = bs[v - 2] | 0, b = Pt.rotrSH(tt, K, 19) ^ Pt.rotrBH(tt, K, 61) ^ Pt.shrSH(tt, K, 6), I = Pt.rotrSL(tt, K, 19) ^ Pt.rotrBL(tt, K, 61) ^ Pt.shrSL(tt, K, 6), M = Pt.add4L(it, I, bs[v - 7], bs[v - 16]), N = Pt.add4H(M, Z, b, ws[v - 7], ws[v - 16]);
      ws[v] = N | 0, bs[v] = M | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: d, Dl: p, Eh: u, El: w, Fh: g, Fl: A, Gh: E, Gl: T, Hh: O, Hl: H } = this;
    for (let v = 0; v < 80; v++) {
      const B = Pt.rotrSH(u, w, 14) ^ Pt.rotrSH(u, w, 18) ^ Pt.rotrBH(u, w, 41), P = Pt.rotrSL(u, w, 14) ^ Pt.rotrSL(u, w, 18) ^ Pt.rotrBL(u, w, 41), Z = u & g ^ ~u & E, it = w & A ^ ~w & T, tt = Pt.add5L(H, P, it, DS[v], bs[v]), K = Pt.add5H(tt, O, B, Z, OS[v], ws[v]), b = tt | 0, I = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), M = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = E | 0, H = T | 0, E = g | 0, T = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = Pt.add(d | 0, p | 0, K | 0, b | 0), d = a | 0, p = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const z = Pt.add3L(b, M, V);
      r = Pt.add3H(z, K, I, N), s = z | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Pt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: p } = Pt.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = Pt.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = Pt.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: E, l: T } = Pt.add(this.Gh | 0, this.Gl | 0, E | 0, T | 0), { h: O, l: H } = Pt.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, a, c, d, p, u, w, g, A, E, T, O, H);
  }
  roundClean() {
    ws.fill(0), bs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, FS = class extends pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, jS = class extends pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, RS = class extends pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Mo(() => new pl());
Mo(() => new FS());
Mo(() => new jS());
Mo(() => new RS());
var _c = { exports: {} };
_c.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", d = "[object Error]", p = "[object Function]", u = "[object GeneratorFunction]", w = "[object Map]", g = "[object Number]", A = "[object Object]", E = "[object Promise]", T = "[object RegExp]", O = "[object Set]", H = "[object String]", v = "[object Symbol]", B = "[object WeakMap]", P = "[object ArrayBuffer]", Z = "[object DataView]", it = "[object Float32Array]", tt = "[object Float64Array]", K = "[object Int8Array]", b = "[object Int16Array]", I = "[object Int32Array]", M = "[object Uint8Array]", N = "[object Uint8ClampedArray]", V = "[object Uint16Array]", z = "[object Uint32Array]", mt = /[\\^$.*+?()[\]{}|]/g, dt = /\w*$/, Kt = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, F = {};
  F[o] = F[i] = F[P] = F[Z] = F[a] = F[c] = F[it] = F[tt] = F[K] = F[b] = F[I] = F[w] = F[g] = F[A] = F[T] = F[O] = F[H] = F[v] = F[M] = F[N] = F[V] = F[z] = !0, F[d] = F[p] = F[B] = !1;
  var ut = typeof fn == "object" && fn && fn.Object === Object && fn, Et = typeof self == "object" && self && self.Object === Object && self, wt = ut || Et || Function("return this")(), $t = e && !e.nodeType && e, ke = $t && !0 && t && !t.nodeType && t, Lt = ke && ke.exports === $t;
  function Bt(x, _) {
    return x.set(_[0], _[1]), x;
  }
  function bt(x, _) {
    return x.add(_), x;
  }
  function Hn(x, _) {
    for (var R = -1, lt = x ? x.length : 0; ++R < lt && _(x[R], R, x) !== !1; )
      ;
    return x;
  }
  function Ke(x, _) {
    for (var R = -1, lt = _.length, Oe = x.length; ++R < lt; )
      x[Oe + R] = _[R];
    return x;
  }
  function Mt(x, _, R, lt) {
    for (var Oe = -1, De = x ? x.length : 0; ++Oe < De; )
      R = _(R, x[Oe], Oe, x);
    return R;
  }
  function pn(x, _) {
    for (var R = -1, lt = Array(x); ++R < x; )
      lt[R] = _(R);
    return lt;
  }
  function ne(x, _) {
    return x == null ? void 0 : x[_];
  }
  function gn(x) {
    var _ = !1;
    if (x != null && typeof x.toString != "function")
      try {
        _ = !!(x + "");
      } catch {
      }
    return _;
  }
  function An(x) {
    var _ = -1, R = Array(x.size);
    return x.forEach(function(lt, Oe) {
      R[++_] = [Oe, lt];
    }), R;
  }
  function ye(x, _) {
    return function(R) {
      return x(_(R));
    };
  }
  function We(x) {
    var _ = -1, R = Array(x.size);
    return x.forEach(function(lt) {
      R[++_] = lt;
    }), R;
  }
  var Re = Array.prototype, Ze = Function.prototype, Dt = Object.prototype, re = wt["__core-js_shared__"], Qe = function() {
    var x = /[^.]+$/.exec(re && re.keys && re.keys.IE_PROTO || "");
    return x ? "Symbol(src)_1." + x : "";
  }(), ze = Ze.toString, Me = Dt.hasOwnProperty, pe = Dt.toString, we = RegExp(
    "^" + ze.call(Me).replace(mt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Xn = Lt ? wt.Buffer : void 0, lr = wt.Symbol, $ = wt.Uint8Array, G = ye(Object.getPrototypeOf, Object), j = Object.create, Y = Dt.propertyIsEnumerable, ht = Re.splice, At = Object.getOwnPropertySymbols, se = Xn ? Xn.isBuffer : void 0, be = ye(Object.keys, Object), Rt = de(wt, "DataView"), k = de(wt, "Map"), at = de(wt, "Promise"), vt = de(wt, "Set"), Nt = de(wt, "WeakMap"), xt = de(Object, "create"), qt = y(Rt), ue = y(k), $e = y(at), te = y(vt), vn = y(Nt), Ct = lr ? lr.prototype : void 0, Br = Ct ? Ct.valueOf : void 0;
  function On(x) {
    var _ = -1, R = x ? x.length : 0;
    for (this.clear(); ++_ < R; ) {
      var lt = x[_];
      this.set(lt[0], lt[1]);
    }
  }
  function Qr() {
    this.__data__ = xt ? xt(null) : {};
  }
  function Rs(x) {
    return this.has(x) && delete this.__data__[x];
  }
  function Mr(x) {
    var _ = this.__data__;
    if (xt) {
      var R = _[x];
      return R === r ? void 0 : R;
    }
    return Me.call(_, x) ? _[x] : void 0;
  }
  function zs(x) {
    var _ = this.__data__;
    return xt ? _[x] !== void 0 : Me.call(_, x);
  }
  function Jr(x, _) {
    var R = this.__data__;
    return R[x] = xt && _ === void 0 ? r : _, this;
  }
  On.prototype.clear = Qr, On.prototype.delete = Rs, On.prototype.get = Mr, On.prototype.has = zs, On.prototype.set = Jr;
  function yn(x) {
    var _ = -1, R = x ? x.length : 0;
    for (this.clear(); ++_ < R; ) {
      var lt = x[_];
      this.set(lt[0], lt[1]);
    }
  }
  function Oo() {
    this.__data__ = [];
  }
  function _i(x) {
    var _ = this.__data__, R = es(_, x);
    if (R < 0)
      return !1;
    var lt = _.length - 1;
    return R == lt ? _.pop() : ht.call(_, R, 1), !0;
  }
  function kn(x) {
    var _ = this.__data__, R = es(_, x);
    return R < 0 ? void 0 : _[R][1];
  }
  function $n(x) {
    return es(this.__data__, x) > -1;
  }
  function on(x, _) {
    var R = this.__data__, lt = es(R, x);
    return lt < 0 ? R.push([x, _]) : R[lt][1] = _, this;
  }
  yn.prototype.clear = Oo, yn.prototype.delete = _i, yn.prototype.get = kn, yn.prototype.has = $n, yn.prototype.set = on;
  function an(x) {
    var _ = -1, R = x ? x.length : 0;
    for (this.clear(); ++_ < R; ) {
      var lt = x[_];
      this.set(lt[0], lt[1]);
    }
  }
  function Do() {
    this.__data__ = {
      hash: new On(),
      map: new (k || yn)(),
      string: new On()
    };
  }
  function Gt(x) {
    return Je(this, x).delete(x);
  }
  function Ne(x) {
    return Je(this, x).get(x);
  }
  function ur(x) {
    return Je(this, x).has(x);
  }
  function Gs(x, _) {
    return Je(this, x).set(x, _), this;
  }
  an.prototype.clear = Do, an.prototype.delete = Gt, an.prototype.get = Ne, an.prototype.has = ur, an.prototype.set = Gs;
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
  function Vs(x, _) {
    var R = this.__data__;
    if (R instanceof yn) {
      var lt = R.__data__;
      if (!k || lt.length < n - 1)
        return lt.push([x, _]), this;
      R = this.__data__ = new an(lt);
    }
    return R.set(x, _), this;
  }
  Wn.prototype.clear = Ie, Wn.prototype.delete = wn, Wn.prototype.get = bn, Wn.prototype.has = Ks, Wn.prototype.set = Vs;
  function Ys(x, _) {
    var R = C(x) || S(x) ? pn(x.length, String) : [], lt = R.length, Oe = !!lt;
    for (var De in x)
      Me.call(x, De) && !(Oe && (De == "length" || Ko(De, lt))) && R.push(De);
    return R;
  }
  function ts(x, _, R) {
    var lt = x[_];
    (!(Me.call(x, _) && f(lt, R)) || R === void 0 && !(_ in x)) && (x[_] = R);
  }
  function es(x, _) {
    for (var R = x.length; R--; )
      if (f(x[R][0], _))
        return R;
    return -1;
  }
  function Pi(x, _) {
    return x && Go(_, gt(_), x);
  }
  function ns(x, _, R, lt, Oe, De, ft) {
    var It;
    if (lt && (It = De ? lt(x, Oe, De, ft) : lt(x)), It !== void 0)
      return It;
    if (!X(x))
      return x;
    var ie = C(x);
    if (ie) {
      if (It = Ur(x), !_)
        return Ws(x, It);
    } else {
      var Fe = Fn(x), Oi = Fe == p || Fe == u;
      if (D(x))
        return rs(x, _);
      if (Fe == A || Fe == o || Oi && !De) {
        if (gn(x))
          return De ? x : {};
        if (It = ss(Oi ? {} : x), !_)
          return Hi(x, Pi(It, x));
      } else {
        if (!F[Fe])
          return De ? x : {};
        It = Hr(x, Fe, ns, _);
      }
    }
    ft || (ft = new Wn());
    var Di = ft.get(x);
    if (Di)
      return Di;
    if (ft.set(x, It), !ie)
      var Fi = R ? Pr(x) : gt(x);
    return Hn(Fi || x, function(jn, Ln) {
      Fi && (Ln = jn, jn = x[Ln]), ts(It, Ln, ns(jn, _, R, lt, Ln, x, ft));
    }), It;
  }
  function In(x) {
    return X(x) ? j(x) : {};
  }
  function Fo(x, _, R) {
    var lt = _(x);
    return C(x) ? lt : Ke(lt, R(x));
  }
  function qs(x) {
    return pe.call(x);
  }
  function Ui(x) {
    if (!X(x) || l(x))
      return !1;
    var _ = Q(x) || gn(x) ? we : Kt;
    return _.test(y(x));
  }
  function Nr(x) {
    if (!m(x))
      return be(x);
    var _ = [];
    for (var R in Object(x))
      Me.call(x, R) && R != "constructor" && _.push(R);
    return _;
  }
  function rs(x, _) {
    if (_)
      return x.slice();
    var R = new x.constructor(x.length);
    return x.copy(R), R;
  }
  function Dn(x) {
    var _ = new x.constructor(x.byteLength);
    return new $(_).set(new $(x)), _;
  }
  function _r(x, _) {
    var R = _ ? Dn(x.buffer) : x.buffer;
    return new x.constructor(R, x.byteOffset, x.byteLength);
  }
  function jo(x, _, R) {
    var lt = _ ? R(An(x), !0) : An(x);
    return Mt(lt, Bt, new x.constructor());
  }
  function Zt(x) {
    var _ = new x.constructor(x.source, dt.exec(x));
    return _.lastIndex = x.lastIndex, _;
  }
  function Ro(x, _, R) {
    var lt = _ ? R(We(x), !0) : We(x);
    return Mt(lt, bt, new x.constructor());
  }
  function Xs(x) {
    return Br ? Object(Br.call(x)) : {};
  }
  function zo(x, _) {
    var R = _ ? Dn(x.buffer) : x.buffer;
    return new x.constructor(R, x.byteOffset, x.length);
  }
  function Ws(x, _) {
    var R = -1, lt = x.length;
    for (_ || (_ = Array(lt)); ++R < lt; )
      _[R] = x[R];
    return _;
  }
  function Go(x, _, R, lt) {
    R || (R = {});
    for (var Oe = -1, De = _.length; ++Oe < De; ) {
      var ft = _[Oe], It = void 0;
      ts(R, ft, It === void 0 ? x[ft] : It);
    }
    return R;
  }
  function Hi(x, _) {
    return Go(x, dr(x), _);
  }
  function Pr(x) {
    return Fo(x, gt, dr);
  }
  function Je(x, _) {
    var R = x.__data__;
    return os(_) ? R[typeof _ == "string" ? "string" : "hash"] : R.map;
  }
  function de(x, _) {
    var R = ne(x, _);
    return Ui(R) ? R : void 0;
  }
  var dr = At ? ye(At, Object) : Xt, Fn = qs;
  (Rt && Fn(new Rt(new ArrayBuffer(1))) != Z || k && Fn(new k()) != w || at && Fn(at.resolve()) != E || vt && Fn(new vt()) != O || Nt && Fn(new Nt()) != B) && (Fn = function(x) {
    var _ = pe.call(x), R = _ == A ? x.constructor : void 0, lt = R ? y(R) : void 0;
    if (lt)
      switch (lt) {
        case qt:
          return Z;
        case ue:
          return w;
        case $e:
          return E;
        case te:
          return O;
        case vn:
          return B;
      }
    return _;
  });
  function Ur(x) {
    var _ = x.length, R = x.constructor(_);
    return _ && typeof x[0] == "string" && Me.call(x, "index") && (R.index = x.index, R.input = x.input), R;
  }
  function ss(x) {
    return typeof x.constructor == "function" && !m(x) ? In(G(x)) : {};
  }
  function Hr(x, _, R, lt) {
    var Oe = x.constructor;
    switch (_) {
      case P:
        return Dn(x);
      case a:
      case c:
        return new Oe(+x);
      case Z:
        return _r(x, lt);
      case it:
      case tt:
      case K:
      case b:
      case I:
      case M:
      case N:
      case V:
      case z:
        return zo(x, lt);
      case w:
        return jo(x, lt, R);
      case g:
      case H:
        return new Oe(x);
      case T:
        return Zt(x);
      case O:
        return Ro(x, lt, R);
      case v:
        return Xs(x);
    }
  }
  function Ko(x, _) {
    return _ = _ ?? s, !!_ && (typeof x == "number" || L.test(x)) && x > -1 && x % 1 == 0 && x < _;
  }
  function os(x) {
    var _ = typeof x;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? x !== "__proto__" : x === null;
  }
  function l(x) {
    return !!Qe && Qe in x;
  }
  function m(x) {
    var _ = x && x.constructor, R = typeof _ == "function" && _.prototype || Dt;
    return x === R;
  }
  function y(x) {
    if (x != null) {
      try {
        return ze.call(x);
      } catch {
      }
      try {
        return x + "";
      } catch {
      }
    }
    return "";
  }
  function h(x) {
    return ns(x, !0, !0);
  }
  function f(x, _) {
    return x === _ || x !== x && _ !== _;
  }
  function S(x) {
    return J(x) && Me.call(x, "callee") && (!Y.call(x, "callee") || pe.call(x) == o);
  }
  var C = Array.isArray;
  function U(x) {
    return x != null && q(x.length) && !Q(x);
  }
  function J(x) {
    return rt(x) && U(x);
  }
  var D = se || oe;
  function Q(x) {
    var _ = X(x) ? pe.call(x) : "";
    return _ == p || _ == u;
  }
  function q(x) {
    return typeof x == "number" && x > -1 && x % 1 == 0 && x <= s;
  }
  function X(x) {
    var _ = typeof x;
    return !!x && (_ == "object" || _ == "function");
  }
  function rt(x) {
    return !!x && typeof x == "object";
  }
  function gt(x) {
    return U(x) ? Ys(x) : Nr(x);
  }
  function Xt() {
    return [];
  }
  function oe() {
    return !1;
  }
  t.exports = h;
})(_c, _c.exports);
var zS = _c.exports;
const Ly = /* @__PURE__ */ ng(zS);
var _u;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_u || (_u = {}));
function GS(t, e) {
  return { type: _u.Address, version: t, hash160: e };
}
function KS(t) {
  return No.c32address(t.version, t.hash160);
}
const VS = (t) => yS(xy(t)), YS = (t) => yt(VS(t));
Be.hmacSha256Sync = (t, ...e) => {
  const n = by.create(xy, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function qS(t, e = "mainnet") {
  e = py(e), t = typeof t == "string" ? Wt(t) : t;
  const n = cS(zr.P2PKH, e), r = GS(n, YS(t));
  return KS(r);
}
function XS(t, e) {
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
  const s = r.issuer.publicKey, o = qS(s);
  if (e !== s) {
    if (e !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Xe.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function WS(t, e = null) {
  let n;
  e ? n = XS(t, e) : n = Xe.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const sp = "_blockstackDidCheckEchoReply", ZS = "echoReply", QS = "authContinuation";
function JS(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function t3() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[sp];
  if (typeof e == "boolean")
    return e;
  const n = JS(t.location.search), r = n[ZS];
  if (r) {
    t[sp] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const o = n[QS];
      t.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Pu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new dg();
    else
      throw new mm("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Dh(e.sessionOptions) : this.store = new Dh() : e ? this.store = new Oh(e.sessionOptions) : this.store = new Oh();
  }
  makeAuthRequestToken(e, n, r, s, o, i = Sm().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Su("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, Dx(e, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Ox();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Cd("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (t3())
        return ei.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ei.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Gm()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ma("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = Xe.decodeToken(e).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Gx(e))
      throw new Ma("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (Dl(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Uh(s, o.private_key);
          } catch {
            if (ei.warn("Failed decryption of appPrivateKey, will try to use as given"), !Be.isValidPrivateKey(o.private_key))
              throw new Ma("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Uh(s, c);
          } catch {
            ei.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ma("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let d = Nm, p;
    Dl(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (d = o.hubUrl), Dl(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (p = o.associationToken);
    const u = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: dy(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: d,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: p
    }, w = o.profile_url;
    if (!u.profile && w) {
      const g = await n(w);
      if (!g.ok)
        u.profile = Object.assign({}, ym);
      else {
        const A = await g.text(), E = JSON.parse(A);
        u.profile = WS(E[0].token);
      }
    } else
      u.profile = o.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Su("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), N2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), _2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Pu.prototype.makeAuthRequest = Pu.prototype.makeAuthRequestToken;
const e3 = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], n3 = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = e3(), n = t.filter((r) => e.find((o) => o.id === r.id) ? !1 : !!gl(r.id));
  return e.concat(n);
}, gl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Cy = "STX_PROVIDER", wo = () => typeof window > "u" ? null : window.localStorage.getItem(Cy), r3 = (t) => {
  typeof window < "u" && window.localStorage.setItem(Cy, t);
}, s3 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function o3(t, e) {
  const n = {};
  return Object.assign(n, s3, e), await fetch(t, n);
}
function i3(t) {
  let e = o3, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function a3(...t) {
  const { fetchLib: e, middlewares: n } = i3(t);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: e,
        ...i
      })) ?? i);
    let a = await e(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: e,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var mi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(mi || (mi = {}));
var bo;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bo || (bo = {}));
var op;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(op || (op = {}));
const c3 = "https://api.mainnet.hiro.so", l3 = "https://api.testnet.hiro.so", u3 = "http://localhost:3999", d3 = ["mainnet", "testnet", "devnet", "mocknet"];
class mo {
  constructor(e) {
    this.version = bo.Mainnet, this.chainId = mi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === bo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? a3();
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
      return new Uu();
    case "testnet":
      return new Hu();
    case "devnet":
      return new f3();
    case "mocknet":
      return new Ty();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${d3.join(", ")}`);
  }
};
mo.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : mo.fromName(t);
class Uu extends mo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? c3,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bo.Mainnet, this.chainId = mi.Mainnet;
  }
}
class Hu extends mo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? l3,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bo.Testnet, this.chainId = mi.Testnet;
  }
}
class Ty extends mo {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? u3,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bo.Testnet, this.chainId = mi.Testnet;
  }
}
const f3 = Ty;
var xo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(xo || (xo = {}));
var Pc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Pc || (Pc = {}));
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
const h3 = {
  chainId: xo.Mainnet,
  transactionVersion: So.Mainnet,
  peerNetworkId: Pc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Eo.MainnetSingleSig,
    multiSig: Eo.MainnetMultiSig
  },
  client: { baseUrl: cg }
}, Ou = {
  chainId: xo.Testnet,
  transactionVersion: So.Testnet,
  peerNetworkId: Pc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Eo.TestnetSingleSig,
    multiSig: Eo.TestnetMultiSig
  },
  client: { baseUrl: lg }
}, wc = {
  ...Ou,
  addressVersion: { ...Ou.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ug }
}, p3 = {
  ...wc,
  addressVersion: { ...wc.addressVersion },
  client: { ...wc.client }
};
function g3(t) {
  switch (t) {
    case "mainnet":
      return h3;
    case "testnet":
      return Ou;
    case "devnet":
      return wc;
    case "mocknet":
      return p3;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function y3(t) {
  return typeof t == "string" ? g3(t) : t;
}
function w3(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ip = /* @__PURE__ */ new Map();
function By(t, e) {
  const n = ip.get(t);
  if (n !== void 0)
    return n(e);
  const r = w3(t);
  return ip.set(t, r), By(t, e);
}
let ge = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Wt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Fm(this.readBytes(4), 0);
  }
  readUInt8() {
    return Om(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Um(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = yt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = yt(n);
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
    if (By(e, r))
      return r;
    throw n(r);
  }
};
const b3 = 128, m3 = 128, My = 16, ao = 32, Du = 80, yl = 65, x3 = 32, S3 = 64, Uc = 34, E3 = 1 + 16 * 1024 * 1024, A3 = 165, v3 = 16, k3 = 16, $3 = 20, I3 = k3 + 2 + $3, L3 = I3 + 4, C3 = E3 + (A3 + v3 * L3);
var ee;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ee || (ee = {}));
var Fu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Fu || (Fu = {}));
var Tn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tn || (Tn = {}));
const Vl = ["onChainOnly", "offChainOnly", "any"];
Vl[0] + "", Tn.OnChainOnly, Vl[1] + "", Tn.OffChainOnly, Vl[2] + "", Tn.Any, Tn.OnChainOnly + "", Tn.OnChainOnly, Tn.OffChainOnly + "", Tn.OffChainOnly, Tn.Any + "", Tn.Any;
var Hc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Hc || (Hc = {}));
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
var na;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(na || (na = {}));
var ju;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ju || (ju = {}));
var Ru;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ru || (Ru = {}));
var dn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(dn || (dn = {}));
var ap;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ap || (ap = {}));
var zu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(zu || (zu = {}));
var nr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(nr || (nr = {}));
var cp;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(cp || (cp = {}));
let wl = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ni = class extends wl {
  constructor(e) {
    super(e);
  }
}, ln = class extends wl {
  constructor(e) {
    super(e);
  }
}, Oc = class extends wl {
  constructor(e) {
    super(e);
  }
}, ro = class extends wl {
  constructor(e) {
    super(e);
  }
};
function Gu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function T3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ny(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function B3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gu(t.outputLen), Gu(t.blockLen);
}
function M3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function N3(t, e) {
  Ny(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const so = {
  number: Gu,
  bool: T3,
  bytes: Ny,
  hash: B3,
  exists: M3,
  output: N3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Yl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, _3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function P3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Qd(t) {
  if (typeof t == "string" && (t = P3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let _y = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function _o(t) {
  const e = (r) => t().update(Qd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Py = class extends _y {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, so.hash(e);
    const r = Qd(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Uy = (t, e, n) => new Py(t, e).update(n).digest();
Uy.create = (t, e) => new Py(t, e);
function U3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + d, a, r);
}
let Jd = class extends _y {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Yl(this.buffer);
  }
  update(e) {
    so.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Qd(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Yl(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    so.exists(this), so.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let u = i; u < s; u++)
      n[u] = 0;
    U3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Yl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, p[u], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const H3 = (t, e, n) => t & e ^ ~t & n, O3 = (t, e, n) => t & e ^ t & n ^ e & n, D3 = new Uint32Array([
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
let Hy = class extends Jd {
  constructor() {
    super(64, 32, 8, !1), this.A = ms[0] | 0, this.B = ms[1] | 0, this.C = ms[2] | 0, this.D = ms[3] | 0, this.E = ms[4] | 0, this.F = ms[5] | 0, this.G = ms[6] | 0, this.H = ms[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      xs[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = xs[u - 15], g = xs[u - 2], A = pr(w, 7) ^ pr(w, 18) ^ w >>> 3, E = pr(g, 17) ^ pr(g, 19) ^ g >>> 10;
      xs[u] = E + xs[u - 7] + A + xs[u - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), g = p + w + H3(a, c, d) + D3[u] + xs[u] | 0, E = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + O3(r, s, o) | 0;
      p = d, d = c, c = a, a = i + g | 0, i = o, o = s, s = r, r = g + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, i, a, c, d, p);
  }
  roundClean() {
    xs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, F3 = class extends Hy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const tf = _o(() => new Hy());
_o(() => new F3());
const j3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Oy = Uint8Array.from({ length: 16 }, (t, e) => e), R3 = Oy.map((t) => (9 * t + 5) % 16);
let ef = [Oy], nf = [R3];
for (let t = 0; t < 4; t++)
  for (let e of [ef, nf])
    e.push(e[t].map((n) => j3[n]));
const Dy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), z3 = ef.map((t, e) => t.map((n) => Dy[e][n])), G3 = nf.map((t, e) => t.map((n) => Dy[e][n])), K3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), V3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ka = (t, e) => t << e | t >>> 32 - e;
function lp(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Va = new Uint32Array(16);
let Y3 = class extends Jd {
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
    for (let g = 0; g < 16; g++, n += 4)
      Va[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, E = K3[g], T = V3[g], O = ef[g], H = nf[g], v = z3[g], B = G3[g];
      for (let P = 0; P < 16; P++) {
        const Z = Ka(r + lp(g, o, a, d) + Va[O[P]] + E, v[P]) + u | 0;
        r = u, u = d, d = Ka(a, 10) | 0, a = o, o = Z;
      }
      for (let P = 0; P < 16; P++) {
        const Z = Ka(s + lp(A, i, c, p) + Va[H[P]] + T, B[P]) + w | 0;
        s = w, w = p, p = Ka(c, 10) | 0, c = i, i = Z;
      }
    }
    this.set(this.h1 + a + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Va.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const q3 = _o(() => new Y3()), Ya = BigInt(2 ** 32 - 1), Ku = BigInt(32);
function Fy(t, e = !1) {
  return e ? { h: Number(t & Ya), l: Number(t >> Ku & Ya) } : { h: Number(t >> Ku & Ya) | 0, l: Number(t & Ya) | 0 };
}
function X3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Fy(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const W3 = (t, e) => BigInt(t >>> 0) << Ku | BigInt(e >>> 0), Z3 = (t, e, n) => t >>> n, Q3 = (t, e, n) => t << 32 - n | e >>> n, J3 = (t, e, n) => t >>> n | e << 32 - n, tE = (t, e, n) => t << 32 - n | e >>> n, eE = (t, e, n) => t << 64 - n | e >>> n - 32, nE = (t, e, n) => t >>> n - 32 | e << 64 - n, rE = (t, e) => e, sE = (t, e) => t, oE = (t, e, n) => t << n | e >>> 32 - n, iE = (t, e, n) => e << n | t >>> 32 - n, aE = (t, e, n) => e << n - 32 | t >>> 64 - n, cE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function lE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const uE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), dE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), hE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, pE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), gE = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: Fy,
  split: X3,
  toBig: W3,
  shrSH: Z3,
  shrSL: Q3,
  rotrSH: J3,
  rotrSL: tE,
  rotrBH: eE,
  rotrBL: nE,
  rotr32H: rE,
  rotr32L: sE,
  rotlSH: oE,
  rotlSL: iE,
  rotlBH: aE,
  rotlBL: cE,
  add: lE,
  add3L: uE,
  add3H: dE,
  add4L: fE,
  add4H: hE,
  add5H: gE,
  add5L: pE
}, [yE, wE] = Ut.split([
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
let bl = class extends Jd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: d, El: p, Fh: u, Fl: w, Gh: g, Gl: A, Hh: E, Hl: T } = this;
    return [e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = E | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Ss[v] = e.getUint32(n), Es[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const B = Ss[v - 15] | 0, P = Es[v - 15] | 0, Z = Ut.rotrSH(B, P, 1) ^ Ut.rotrSH(B, P, 8) ^ Ut.shrSH(B, P, 7), it = Ut.rotrSL(B, P, 1) ^ Ut.rotrSL(B, P, 8) ^ Ut.shrSL(B, P, 7), tt = Ss[v - 2] | 0, K = Es[v - 2] | 0, b = Ut.rotrSH(tt, K, 19) ^ Ut.rotrBH(tt, K, 61) ^ Ut.shrSH(tt, K, 6), I = Ut.rotrSL(tt, K, 19) ^ Ut.rotrBL(tt, K, 61) ^ Ut.shrSL(tt, K, 6), M = Ut.add4L(it, I, Es[v - 7], Es[v - 16]), N = Ut.add4H(M, Z, b, Ss[v - 7], Ss[v - 16]);
      Ss[v] = N | 0, Es[v] = M | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: d, Dl: p, Eh: u, El: w, Fh: g, Fl: A, Gh: E, Gl: T, Hh: O, Hl: H } = this;
    for (let v = 0; v < 80; v++) {
      const B = Ut.rotrSH(u, w, 14) ^ Ut.rotrSH(u, w, 18) ^ Ut.rotrBH(u, w, 41), P = Ut.rotrSL(u, w, 14) ^ Ut.rotrSL(u, w, 18) ^ Ut.rotrBL(u, w, 41), Z = u & g ^ ~u & E, it = w & A ^ ~w & T, tt = Ut.add5L(H, P, it, wE[v], Es[v]), K = Ut.add5H(tt, O, B, Z, yE[v], Ss[v]), b = tt | 0, I = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), M = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = E | 0, H = T | 0, E = g | 0, T = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = Ut.add(d | 0, p | 0, K | 0, b | 0), d = a | 0, p = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const z = Ut.add3L(b, M, V);
      r = Ut.add3H(z, K, I, N), s = z | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ut.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: p } = Ut.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = Ut.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = Ut.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: E, l: T } = Ut.add(this.Gh | 0, this.Gl | 0, E | 0, T | 0), { h: O, l: H } = Ut.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, a, c, d, p, u, w, g, A, E, T, O, H);
  }
  roundClean() {
    Ss.fill(0), Es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, bE = class extends bl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, mE = class extends bl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, xE = class extends bl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
_o(() => new bl());
_o(() => new bE());
const SE = _o(() => new mE());
_o(() => new xE());
var Vt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Vt || (Vt = {}));
var je;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(je || (je = {}));
function rf(t) {
  return je[t];
}
const EE = () => ({ type: Vt.BoolTrue }), AE = () => ({ type: Vt.BoolFalse }), vE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Vt.Buffer, value: yt(t) };
}, up = BigInt("0xffffffffffffffffffffffffffffffff"), kE = BigInt(0), dp = BigInt("0x7fffffffffffffffffffffffffffffff"), fp = BigInt("-170141183460469231731687303715884105728"), $E = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Au(Wt(t))), En(t, Uint8Array) && (t = Au(t));
  const e = sn(t);
  if (e > dp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${dp}`);
  if (e < fp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${fp}`);
  return { type: Vt.Int, value: e };
}, IE = (t) => {
  const e = sn(t);
  if (e < kE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > up)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${up}`);
  return { type: Vt.UInt, value: e };
};
function LE(t) {
  return { type: Vt.List, value: t };
}
function jy() {
  return { type: Vt.OptionalNone };
}
function Ry(t) {
  return { type: Vt.OptionalSome, value: t };
}
var ct;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ct || (ct = {}));
function CE() {
  return {
    type: ct.Address,
    version: Eo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function hp(t) {
  if (t && Zy(t, Uc))
    throw new Error(`Memo exceeds maximum length of ${Uc} bytes`);
  return { type: ct.MemoString, content: t };
}
function sf(t, e) {
  return {
    type: ct.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Vu(t) {
  if (Wt(t).byteLength != yl)
    throw Error("Invalid signature");
  return {
    type: ct.MessageSignature,
    data: t
  };
}
function TE(t, e, n) {
  return typeof t == "string" && (t = VE(t)), typeof n == "string" && (n = hp(n)), {
    type: ct.Payload,
    payloadType: ee.TokenTransfer,
    recipient: t,
    amount: sn(e),
    memo: n ?? hp("")
  };
}
function BE(t, e, n, r) {
  return typeof e == "string" && (e = ir(e)), typeof n == "string" && (n = ir(n)), {
    type: ct.Payload,
    payloadType: ee.ContractCall,
    contractAddress: typeof t == "string" ? js(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function ME(t) {
  return ir(t, 4, 1e5);
}
function pp(t, e, n) {
  return typeof t == "string" && (t = ir(t)), typeof e == "string" && (e = ME(e)), typeof n == "number" ? {
    type: ct.Payload,
    payloadType: ee.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ct.Payload,
    payloadType: ee.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function NE() {
  return { type: ct.Payload, payloadType: ee.PoisonMicroblock };
}
function gp(t, e) {
  if (t.byteLength != ao)
    throw Error(`Coinbase buffer size must be ${ao} bytes`);
  return e != null ? {
    type: ct.Payload,
    payloadType: ee.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ct.Payload,
    payloadType: ee.Coinbase,
    coinbaseBytes: t
  };
}
function _E(t, e, n) {
  if (t.byteLength != ao)
    throw Error(`Coinbase buffer size must be ${ao} bytes`);
  if (n.byteLength != Du)
    throw Error(`VRF proof buffer size must be ${Du} bytes`);
  return {
    type: ct.Payload,
    payloadType: ee.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Vt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function PE(t, e, n, r, s, o, i) {
  return {
    type: ct.Payload,
    payloadType: ee.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function ir(t, e, n) {
  const r = e || 1, s = n || b3;
  if (Zy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ct.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function UE(t, e, n) {
  return {
    type: ct.Asset,
    address: js(t),
    contractName: ir(e),
    assetName: ir(n)
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
function HE(t, e) {
  const n = js(t), r = ir(e);
  return {
    type: ct.Principal,
    prefix: dn.Contract,
    address: n,
    contractName: r
  };
}
function OE(t) {
  const e = js(t);
  return {
    type: ct.Principal,
    prefix: dn.Standard,
    address: e
  };
}
function ri(t, e) {
  return {
    pubKeyEncoding: t,
    type: ct.TransactionAuthField,
    contents: e
  };
}
function Fr(t) {
  switch (t.type) {
    case ct.Address:
      return va(t);
    case ct.Principal:
      return zy(t);
    case ct.LengthPrefixedString:
      return Si(t);
    case ct.MemoString:
      return FE(t);
    case ct.Asset:
      return Ky(t);
    case ct.PostCondition:
      return Yy(t);
    case ct.PublicKey:
      return Xu(t);
    case ct.LengthPrefixedList:
      return of(t);
    case ct.Payload:
      return qy(t);
    case ct.TransactionAuthField:
      return KE(t);
    case ct.MessageSignature:
      return af(t);
  }
}
function va(t) {
  const e = [];
  return e.push(Wt(ba(t.version, 1))), e.push(Wt(t.hash160)), Ue(e);
}
function xi(t) {
  const e = En(t, ge) ? t : new ge(t), n = rl(yt(e.readBytes(1))), r = yt(e.readBytes(20));
  return { type: ct.Address, version: n, hash160: r };
}
function zy(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === dn.Standard || t.prefix === dn.Contract) && e.push(va(t.address)), t.prefix === dn.Contract && e.push(Si(t.contractName)), Ue(e);
}
function DE(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(dn, (o) => {
    throw new ln(`Unexpected Principal payload type: ${o}`);
  });
  if (n === dn.Origin)
    return { type: ct.Principal, prefix: n };
  const r = xi(e);
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
function Si(t) {
  const e = [], n = Co(t.content), r = n.byteLength;
  return e.push(Wt(ba(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function Vn(t, e, n) {
  e = e || 1;
  const r = En(t, ge) ? t : new ge(t), s = rl(yt(r.readBytes(e))), o = ma(r.readBytes(s));
  return ir(o, e, n ?? 128);
}
function FE(t) {
  const e = [], n = Co(t.content), r = pA(yt(n), Uc * 2);
  return e.push(Wt(r)), Ue(e);
}
function Gy(t) {
  const e = En(t, ge) ? t : new ge(t);
  let n = ma(e.readBytes(Uc));
  return n = n.replace(/\u0000*$/, ""), { type: ct.MemoString, content: n };
}
function Ky(t) {
  const e = [];
  return e.push(va(t.address)), e.push(Si(t.contractName)), e.push(Si(t.assetName)), Ue(e);
}
function Yu(t) {
  const e = En(t, ge) ? t : new ge(t);
  return {
    type: ct.Asset,
    address: xi(e),
    contractName: Vn(e),
    assetName: Vn(e)
  };
}
function of(t) {
  const e = t.values, n = [];
  n.push(Wt(ba(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Fr(r));
  return Ue(n);
}
function Vy(t, e, n) {
  const r = En(t, ge) ? t : new ge(t), s = rl(yt(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (e) {
      case ct.Address:
        o.push(xi(r));
        break;
      case ct.LengthPrefixedString:
        o.push(Vn(r));
        break;
      case ct.MemoString:
        o.push(Gy(r));
        break;
      case ct.Asset:
        o.push(Yu(r));
        break;
      case ct.PostCondition:
        o.push(RE(r));
        break;
      case ct.PublicKey:
        o.push(Wu(r));
        break;
      case ct.TransactionAuthField:
        o.push(GE(r));
        break;
    }
  return sf(o, n);
}
function jE(t) {
  return yt(Yy(t));
}
function Yy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(zy(t.principal)), (t.conditionType === me.Fungible || t.conditionType === me.NonFungible) && e.push(Ky(t.asset)), t.conditionType === me.NonFungible && e.push(Ar(t.assetName)), e.push(t.conditionCode), t.conditionType === me.STX || t.conditionType === me.Fungible || t.conditionType === me.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ni("The post-condition amount may not be larger than 8 bytes");
    e.push(Ds(t.amount, 8));
  }
  return Ue(e);
}
function RE(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(me, (a) => {
    throw new ln(`Could not read ${a} as PostConditionType`);
  }), r = DE(e);
  let s, o, i;
  switch (n) {
    case me.STX:
      return s = e.readUInt8Enum(na, (c) => {
        throw new ln(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: me.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case me.Fungible:
      return o = Yu(e), s = e.readUInt8Enum(na, (c) => {
        throw new ln(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: me.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case me.NonFungible:
      o = Yu(e);
      const a = xr(e);
      return s = e.readUInt8Enum(ju, (c) => {
        throw new ln(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ct.PostCondition,
        conditionType: me.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case me.Staking:
      return s = e.readUInt8Enum(na, (c) => {
        throw new ln(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: me.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case me.PoX: {
      const c = e.readUInt8Enum(Ru, (d) => {
        throw new ln(`Could not read ${d} as PoxConditionCode`);
      });
      return {
        type: ct.PostCondition,
        conditionType: me.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function qy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ee.TokenTransfer:
      e.push(Ar(t.recipient)), e.push(Ds(t.amount, 8)), e.push(Fr(t.memo));
      break;
    case ee.ContractCall:
      e.push(Fr(t.contractAddress)), e.push(Fr(t.contractName)), e.push(Fr(t.functionName));
      const n = new Uint8Array(4);
      fo(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ar(r));
      });
      break;
    case ee.SmartContract:
      e.push(Fr(t.contractName)), e.push(Fr(t.codeBody));
      break;
    case ee.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Fr(t.contractName)), e.push(Fr(t.codeBody));
      break;
    case ee.PoisonMicroblock:
      break;
    case ee.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ee.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient));
      break;
    case ee.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient ? Ry(t.recipient) : jy())), e.push(t.vrfProof);
      break;
    case ee.TenureChange:
      e.push(Wt(t.tenureHash)), e.push(Wt(t.previousTenureHash)), e.push(Wt(t.burnViewHash)), e.push(Wt(t.previousTenureEnd)), e.push(fo(new Uint8Array(4), t.previousTenureBlocks)), e.push(Dm(new Uint8Array(1), t.cause)), e.push(Wt(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function zE(t) {
  const e = En(t, ge) ? t : new ge(t);
  switch (e.readUInt8Enum(ee, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ee.TokenTransfer:
      const r = xr(e), s = sn(e.readBytes(8)), o = Gy(e);
      return TE(r, s, o);
    case ee.ContractCall:
      const i = xi(e), a = Vn(e), c = Vn(e), d = [], p = e.readUInt32BE();
      for (let B = 0; B < p; B++) {
        const P = xr(e);
        d.push(P);
      }
      return BE(i, a, c, d);
    case ee.SmartContract:
      const u = Vn(e), w = Vn(e, 4, 1e5);
      return pp(u, w);
    case ee.VersionedSmartContract: {
      const B = e.readUInt8Enum(Fu, (it) => {
        throw new Error(`Cannot recognize ClarityVersion: ${it}`);
      }), P = Vn(e), Z = Vn(e, 4, C3);
      return pp(P, Z, B);
    }
    case ee.PoisonMicroblock:
      return NE();
    case ee.Coinbase: {
      const B = e.readBytes(ao);
      return gp(B);
    }
    case ee.CoinbaseToAltRecipient: {
      const B = e.readBytes(ao), P = xr(e);
      return gp(B, P);
    }
    case ee.NakamotoCoinbase: {
      const B = e.readBytes(ao), P = xr(e), Z = e.readBytes(Du);
      return _E(B, P, Z);
    }
    case ee.TenureChange:
      const g = yt(e.readBytes(20)), A = yt(e.readBytes(20)), E = yt(e.readBytes(20)), T = yt(e.readBytes(32)), O = e.readUInt32BE(), H = e.readUInt8Enum(zu, (B) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${B}`);
      }), v = yt(e.readBytes(20));
      return PE(g, A, E, T, O, H, v);
  }
}
function qu(t) {
  const e = En(t, ge) ? t : new ge(t);
  return Vu(yt(e.readBytes(yl)));
}
function GE(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(nr, (r) => {
    throw new ln(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case nr.PublicKeyCompressed:
      return ri(Ae.Compressed, Wu(e));
    case nr.PublicKeyUncompressed:
      return ri(Ae.Uncompressed, Ci(kA(Wu(e).data)));
    case nr.SignatureCompressed:
      return ri(Ae.Compressed, qu(e));
    case nr.SignatureUncompressed:
      return ri(Ae.Uncompressed, qu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function af(t) {
  return Wt(t.data);
}
function KE(t) {
  const e = [];
  switch (t.contents.type) {
    case ct.PublicKey:
      e.push(t.pubKeyEncoding === Ae.Compressed ? nr.PublicKeyCompressed : nr.PublicKeyUncompressed), e.push(Wt(vA(t.contents.data)));
      break;
    case ct.MessageSignature:
      e.push(t.pubKeyEncoding === Ae.Compressed ? nr.SignatureCompressed : nr.SignatureUncompressed), e.push(af(t.contents));
      break;
  }
  return Ue(e);
}
function Xu(t) {
  return t.data.slice();
}
function Wu(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8(), r = n === 4 ? S3 : x3;
  return Ci(Ue([n, e.readBytes(r)]));
}
function cf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === fe.P2PKH || e === fe.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === fe.P2WPKH || e === fe.P2WSH || e === fe.P2WSHNonSequential) && !r.map((s) => s.data).every(Ti))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case fe.P2PKH:
      return qa(t, gA(r[0].data));
    case fe.P2WPKH:
      return qa(t, yA(r[0].data));
    case fe.P2SH:
    case fe.P2SHNonSequential:
      return qa(t, wA(n, r.map(Xu)));
    case fe.P2WSH:
    case fe.P2WSHNonSequential:
      return qa(t, bA(n, r.map(Xu)));
  }
}
function qa(t, e) {
  return { type: ct.Address, version: t, hash160: e };
}
function lf(t) {
  return No.c32address(t.version, t.hash160);
}
function yp(t) {
  const [e, n, r] = t.split(/\.|::/);
  return UE(e, n, r);
}
function Ki(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return HE(e, n);
  } else
    return OE(t);
}
function VE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return XE(e, n);
  } else
    return YE(t);
}
function YE(t) {
  const e = js(t);
  return { type: Vt.PrincipalStandard, value: lf(e) };
}
function qE(t) {
  return { type: Vt.PrincipalStandard, value: lf(t) };
}
function XE(t, e) {
  const n = js(t), r = ir(e);
  return Xy(n, r);
}
function Xy(t, e) {
  if (Co(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Vt.PrincipalContract,
    value: `${lf(t)}.${e.content}`
  };
}
function WE(t) {
  return { type: Vt.ResponseErr, value: t };
}
function ZE(t) {
  return { type: Vt.ResponseOk, value: t };
}
const QE = (t) => ({ type: Vt.StringASCII, value: t }), JE = (t) => ({ type: Vt.StringUTF8, value: t });
function tA(t) {
  for (const e in t)
    if (!mA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Vt.Tuple, value: t };
}
function xr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ge(Wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ge(t) : e = t;
  switch (e.readUInt8Enum(je, (r) => {
    throw new ln(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case je.int:
      return $E(Au(e.readBytes(16)));
    case je.uint:
      return IE(e.readBytes(16));
    case je.buffer:
      const r = e.readUInt32BE();
      return vE(e.readBytes(r));
    case je.true:
      return EE();
    case je.false:
      return AE();
    case je.address:
      const s = xi(e);
      return qE(s);
    case je.contract:
      const o = xi(e), i = Vn(e);
      return Xy(o, i);
    case je.ok:
      return ZE(xr(e));
    case je.err:
      return WE(xr(e));
    case je.none:
      return jy();
    case je.some:
      return Ry(xr(e));
    case je.list:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(xr(e));
      return LE(c);
    case je.tuple:
      const d = e.readUInt32BE(), p = {};
      for (let E = 0; E < d; E++) {
        const T = Vn(e).content;
        if (T === void 0)
          throw new ln('"content" is undefined');
        p[T] = xr(e);
      }
      return tA(p);
    case je.ascii:
      const u = e.readUInt32BE(), w = Bm(e.readBytes(u));
      return QE(w);
    case je.utf8:
      const g = e.readUInt32BE(), A = ma(e.readBytes(g));
      return JE(A);
    default:
      throw new ln("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Lr(t, e) {
  return Ue([rf(t), e]);
}
function eA(t) {
  return new Uint8Array([rf(t.type)]);
}
function nA(t) {
  return t.type === Vt.OptionalNone ? new Uint8Array([rf(t.type)]) : Lr(t.type, Ar(t.value));
}
function rA(t) {
  const e = new Uint8Array(4);
  return fo(e, Math.ceil(t.value.length / 2), 0), Lr(t.type, $r(e, Wt(t.value)));
}
function sA(t) {
  const e = Td($m(BigInt(t.value), BigInt(m3)), My);
  return Lr(t.type, e);
}
function oA(t) {
  const e = Td(BigInt(t.value), My);
  return Lr(t.type, e);
}
function iA(t) {
  return Lr(t.type, va(js(t.value)));
}
function aA(t) {
  const [e, n] = xA(t.value);
  return Lr(t.type, $r(va(js(e)), Si(ir(n))));
}
function cA(t) {
  return Lr(t.type, Ar(t.value));
}
function lA(t) {
  const e = [], n = new Uint8Array(4);
  fo(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ar(r);
    e.push(s);
  }
  return Lr(t.type, Ue(e));
}
function uA(t) {
  const e = [], n = new Uint8Array(4);
  fo(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ir(s);
    e.push(Si(o));
    const i = Ar(t.value[s]);
    e.push(i);
  }
  return Lr(t.type, Ue(e));
}
function Wy(t, e) {
  const n = [], r = e == "ascii" ? Tm(t.value) : Co(t.value), s = new Uint8Array(4);
  return fo(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, Ue(n));
}
function dA(t) {
  return Wy(t, "ascii");
}
function fA(t) {
  return Wy(t, "utf8");
}
function wp(t) {
  return yt(Ar(t));
}
function Ar(t) {
  switch (t.type) {
    case Vt.BoolTrue:
    case Vt.BoolFalse:
      return eA(t);
    case Vt.OptionalNone:
    case Vt.OptionalSome:
      return nA(t);
    case Vt.Buffer:
      return rA(t);
    case Vt.UInt:
      return oA(t);
    case Vt.Int:
      return sA(t);
    case Vt.PrincipalStandard:
      return iA(t);
    case Vt.PrincipalContract:
      return aA(t);
    case Vt.ResponseOk:
    case Vt.ResponseErr:
      return cA(t);
    case Vt.List:
      return lA(t);
    case Vt.Tuple:
      return uA(t);
    case Vt.StringASCII:
      return dA(t);
    case Vt.StringUTF8:
      return fA(t);
    default:
      throw new ni("Unable to serialize. Invalid Clarity Value.");
  }
}
const hA = (t) => t.length % 2 ? `0${t}` : t, pA = (t, e) => t.padEnd(e, "0"), Zy = (t, e) => t ? Co(t).length > e : !1;
function Zu(t) {
  return Ly(t);
}
const ca = (t) => q3(tf(t)), uf = (t) => yt(SE(t)), gA = (t) => yt(ca(t)), yA = (t) => {
  const e = ca(t), n = $r(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ca(n);
  return yt(r);
}, wA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = ca(r);
  return yt(s);
}, bA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = tf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Ue(o), a = ca(i);
  return yt(a);
};
function mA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function xA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = Uy.create(tf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ci(t) {
  return t = typeof t == "string" ? Wt(t) : t, {
    type: ct.PublicKey,
    data: t
  };
}
function SA(t, e, n = Ae.Compressed) {
  const r = Pm(e), s = new _n(wh(r.r), wh(r.s)), o = jt.fromSignature(t, s, r.recoveryId), i = n === Ae.Compressed;
  return o.toHex(i);
}
function EA(t) {
  return typeof t == "string" ? t : yt(t);
}
const df = EA;
function Qy(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === _m;
}
function Ti(t) {
  return !df(t).startsWith("04");
}
function AA(t) {
  t = Bd(t);
  const e = Qy(t);
  return yt(xa(t.slice(0, 32), e));
}
function vA(t) {
  return jt.fromHex(df(t)).toHex(!0);
}
function kA(t) {
  return jt.fromHex(df(t)).toHex(!1);
}
function $A(t, e) {
  t = Bd(t);
  const [n, r] = ol(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ba(r, 1) + _n.fromHex(n).toCompactHex();
}
function ff() {
  return {
    type: ct.MessageSignature,
    data: yt(new Uint8Array(yl))
  };
}
function Jy(t, e, n, r) {
  const s = cf(0, t, 1, [Ci(e)]).hash160, o = Ti(e) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: sn(n),
    fee: sn(r),
    keyEncoding: o,
    signature: ff()
  };
}
function la(t) {
  return "signature" in t;
}
function bp(t) {
  return t === fe.P2SH || t === fe.P2WSH;
}
function IA(t) {
  return t === fe.P2SHNonSequential || t === fe.P2WSHNonSequential;
}
function mp(t) {
  const e = Zu(t);
  return e.nonce = 0, e.fee = 0, la(e) ? e.signature = ff() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function LA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    Ds(t.nonce, 8),
    Ds(t.fee, 8),
    t.keyEncoding,
    af(t.signature)
  ];
  return Ue(e);
}
function CA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    Ds(t.nonce, 8),
    Ds(t.fee, 8)
  ], n = sf(t.fields);
  e.push(of(n));
  const r = new Uint8Array(2);
  return Hm(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function TA(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt(`0x${yt(e.readBytes(8))}`), s = BigInt(`0x${yt(e.readBytes(8))}`), o = e.readUInt8Enum(Ae, (a) => {
    throw new ln(`Could not parse ${a} as PubKeyEncoding`);
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
function BA(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt("0x" + yt(e.readBytes(8))), s = BigInt("0x" + yt(e.readBytes(8))), o = Vy(e, ct.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const d of o)
    switch (d.contents.type) {
      case ct.PublicKey:
        Ti(d.contents.data) || (i = !0);
        break;
      case ct.MessageSignature:
        if (d.pubKeyEncoding === Ae.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new ro("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (i && (t === fe.P2WSH || t === fe.P2WSHNonSequential))
    throw new ro("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function ql(t) {
  return la(t) ? LA(t) : CA(t);
}
function Xl(t) {
  const e = t.readUInt8Enum(fe, (n) => {
    throw new ln(`Could not parse ${n} as AddressHashMode`);
  });
  return e === fe.P2PKH || e === fe.P2WPKH ? TA(e, t) : BA(e, t);
}
function tw(t, e, n, r) {
  const o = t + yt(new Uint8Array([e])) + yt(Ds(n, 8)) + yt(Ds(r, 8));
  if (Wt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return uf(Wt(o));
}
function ew(t, e, n) {
  const r = 33 + yl, s = Ti(e.data) ? Ae.Compressed : Ae.Uncompressed, o = t + hA(s.toString(16)) + n, i = Wt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return uf(i);
}
function MA(t, e, n, r, s) {
  const o = tw(t, e, n, r), i = $A(s, o), a = Ci(AA(s)), c = ew(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function nw(t, e, n, r, s, o) {
  const i = tw(t, e, n, r), a = Ci(SA(i, o, s)), c = ew(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function NA() {
  const t = Jy(fe.P2PKH, "", 0, 0);
  return t.signer = CE().hash160, t.keyEncoding = Ae.Compressed, t.signature = ff(), t;
}
function xp(t, e, n) {
  return la(t) ? _A(t, e, n) : PA(t, e, n);
}
function _A(t, e, n) {
  const { pubKey: r, nextSigHash: s } = nw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), o = cf(0, t.hashMode, 1, [r]).hash160;
  if (o !== t.signer)
    throw new ro(`Signer hash does not equal hash of public key(s): ${o} != ${t.signer}`);
  return s;
}
function PA(t, e, n) {
  const r = [];
  let s = e, o = !1, i = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ct.PublicKey:
        Ti(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case ct.MessageSignature:
        c.pubKeyEncoding === Ae.Uncompressed && (o = !0);
        const { pubKey: d, nextSigHash: p } = nw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (bp(t.hashMode) && (s = p), r.push(d), i += 1, i === 65536)
          throw new ro("Too many signatures");
        break;
    }
  if (bp(t.hashMode) && i !== t.signaturesRequired || IA(t.hashMode) && i < t.signaturesRequired)
    throw new ro("Incorrect number of signatures");
  if (o && (t.hashMode === fe.P2WSH || t.hashMode === fe.P2WSHNonSequential))
    throw new ro("Uncompressed keys are not allowed in this hash mode");
  const a = cf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ro(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function rw(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function sw(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Jy(fe.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Sp(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return rw(mp(t.spendingCondition));
      case Ce.Sponsored:
        return sw(mp(t.spendingCondition), NA());
      default:
        throw new Oc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function UA(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return xp(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return xp(t.spendingCondition, e, Ce.Standard);
    default:
      throw new Oc("Invalid origin auth type");
  }
}
function HA(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: sn(e)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: sn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function OA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function DA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function FA(t, e) {
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
function jA(t) {
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
function RA(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new ln(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = Xl(t), rw(n);
    case Ce.Sponsored:
      n = Xl(t);
      const r = Xl(t);
      return sw(n, r);
  }
}
class zA {
  constructor({ auth: e, payload: n, postConditions: r = sf([]), postConditionMode: s = Hc.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = y3(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: sn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Tn.Any;
  }
  signBegin() {
    const e = Zu(this);
    return e.auth = Sp(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Zu(this);
    return e.auth = Sp(e.auth), e.txid();
  }
  verifyOrigin() {
    return UA(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Ci(e), r = this.auth.spendingCondition;
    if (r && !la(r)) {
      const s = Ti(n.data);
      r.fields.push(ri(s ? Ae.Compressed : Ae.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: o, nextSigHash: i } = MA(n, r, e.fee, e.nonce, s);
    if (la(e))
      e.signature = Vu(o);
    else {
      const a = Qy(s);
      e.fields.push(ri(a ? Ae.Compressed : Ae.Uncompressed, Vu(o)));
    }
    return i;
  }
  txid() {
    const e = this.serializeBytes();
    return uf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Oc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = FA(this.auth, e);
  }
  setFee(e) {
    this.auth = HA(this.auth, e);
  }
  setNonce(e) {
    this.auth = OA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Oc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = DA(this.auth, e);
  }
  serialize() {
    return yt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new ni('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new ni('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ni('"auth" is undefined');
    if (this.payload === void 0)
      throw new ni('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return fo(n, this.chainId, 0), e.push(n), e.push(jA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(of(this.postConditions)), e.push(qy(this.payload)), Ue(e);
  }
}
function GA(t) {
  const e = En(t, ge) ? t : new ge(t), n = e.readUInt8Enum(So, (p) => {
    throw new Error(`Could not parse ${p} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = RA(e), o = e.readUInt8Enum(Tn, (p) => {
    throw new Error(`Could not parse ${p} as AnchorMode`);
  }), i = e.readUInt8Enum(Hc, (p) => {
    throw new Error(`Could not parse ${p} as PostConditionMode`);
  }), a = Vy(e, ct.PostCondition), c = zE(e), d = new zA({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return d.anchorMode = o, d;
}
const Ep = BigInt("18446744073709551615");
function Wl(t) {
  const e = sn(t);
  if (e < 0n || e > Ep)
    throw new RangeError(`Post-condition amount must be between 0 and ${Ep} (u64 max), received: ${e}`);
  return e;
}
var Qu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Qu || (Qu = {}));
var Ju;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ju || (Ju = {}));
function KA(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.STX,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Ki(t.address),
        conditionCode: Xa(t.condition),
        amount: Wl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.Fungible,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Ki(t.address),
        conditionCode: Xa(t.condition),
        amount: Wl(t.amount),
        asset: yp(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.NonFungible,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Ki(t.address),
        conditionCode: Xa(t.condition),
        asset: yp(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.Staking,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Ki(t.address),
        conditionCode: Xa(t.condition),
        amount: Wl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: me.PoX,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: dn.Origin } : Ki(t.address),
        conditionCode: VA(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Xa(t) {
  return Qu[t];
}
function VA(t) {
  return Ju[t];
}
function ow(t) {
  const e = KA(t);
  return jE(e);
}
function YA(t, e, n) {
  return pf(iw(t), n);
}
function iw(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ua(r);
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
    return BigInt(`0x${WA(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function hf(t, e = 8) {
  return (typeof t == "bigint" ? t : iw(t)).toString(16).padStart(e * 2, "0");
}
function pf(t, e = 16) {
  const n = hf(t, e);
  return ua(n);
}
function qA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const XA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function WA(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += XA[n];
  return e;
}
function ua(t) {
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
function gf(t) {
  return new TextEncoder().encode(t);
}
function ZA(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function QA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ap(t) {
  if (t.some(QA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function yf(...t) {
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
function Zr(t) {
  return yf(...t.map((e) => typeof e == "number" ? Ap([e]) : e instanceof Array ? Ap(e) : e));
}
function ml(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var td;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(td || (td = {}));
td.Mainnet;
const JA = 128, tv = 128, aw = 16;
var ed;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ed || (ed = {}));
var vp;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(vp || (vp = {}));
var kp;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(kp || (kp = {}));
var tr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(tr || (tr = {}));
const Zl = ["onChainOnly", "offChainOnly", "any"];
Zl[0] + "", tr.OnChainOnly, Zl[1] + "", tr.OffChainOnly, Zl[2] + "", tr.Any, tr.OnChainOnly + "", tr.OnChainOnly, tr.OffChainOnly + "", tr.OffChainOnly, tr.Any + "", tr.Any;
var nd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nd || (nd = {}));
nd.Mainnet;
var $p;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})($p || ($p = {}));
var Js;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Js || (Js = {}));
var Ip;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ip || (Ip = {}));
var Lp;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Lp || (Lp = {}));
var Cp;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Cp || (Cp = {}));
var Tp;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Tp || (Tp = {}));
var Bp;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Bp || (Bp = {}));
var Mp;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Mp || (Mp = {}));
var rd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(rd || (rd = {}));
var Np;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Np || (Np = {}));
var _p;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(_p || (_p = {}));
function sd(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ev(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function cw(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  sd(t.outputLen), sd(t.blockLen);
}
function rv(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sv(t, e) {
  cw(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ql = {
  number: sd,
  bool: ev,
  bytes: cw,
  hash: nv,
  exists: rv,
  output: sv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, ov = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ov)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function iv(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function lw(t) {
  if (typeof t == "string" && (t = iv(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let av = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Po(t) {
  const e = (r) => t().update(lw(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function cv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + d, a, r);
}
let wf = class extends av {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Jl(this.buffer);
  }
  update(e) {
    Ql.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = lw(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Jl(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ql.exists(this), Ql.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let u = i; u < s; u++)
      n[u] = 0;
    cv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Jl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, p[u], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
};
const lv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), uw = Uint8Array.from({ length: 16 }, (t, e) => e), uv = uw.map((t) => (9 * t + 5) % 16);
let bf = [uw], mf = [uv];
for (let t = 0; t < 4; t++)
  for (let e of [bf, mf])
    e.push(e[t].map((n) => lv[n]));
const dw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), dv = bf.map((t, e) => t.map((n) => dw[e][n])), fv = mf.map((t, e) => t.map((n) => dw[e][n])), hv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Wa = (t, e) => t << e | t >>> 32 - e;
function Pp(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Za = new Uint32Array(16);
let gv = class extends wf {
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
    for (let g = 0; g < 16; g++, n += 4)
      Za[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, E = hv[g], T = pv[g], O = bf[g], H = mf[g], v = dv[g], B = fv[g];
      for (let P = 0; P < 16; P++) {
        const Z = Wa(r + Pp(g, o, a, d) + Za[O[P]] + E, v[P]) + u | 0;
        r = u, u = d, d = Wa(a, 10) | 0, a = o, o = Z;
      }
      for (let P = 0; P < 16; P++) {
        const Z = Wa(s + Pp(A, i, c, p) + Za[H[P]] + T, B[P]) + w | 0;
        s = w, w = p, p = Wa(c, 10) | 0, c = i, i = Z;
      }
    }
    this.set(this.h1 + a + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Za.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Po(() => new gv());
const yv = (t, e, n) => t & e ^ ~t & n, wv = (t, e, n) => t & e ^ t & n ^ e & n, bv = new Uint32Array([
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
let fw = class extends wf {
  constructor() {
    super(64, 32, 8, !1), this.A = As[0] | 0, this.B = As[1] | 0, this.C = As[2] | 0, this.D = As[3] | 0, this.E = As[4] | 0, this.F = As[5] | 0, this.G = As[6] | 0, this.H = As[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      vs[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = vs[u - 15], g = vs[u - 2], A = gr(w, 7) ^ gr(w, 18) ^ w >>> 3, E = gr(g, 17) ^ gr(g, 19) ^ g >>> 10;
      vs[u] = E + vs[u - 7] + A + vs[u - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), g = p + w + yv(a, c, d) + bv[u] + vs[u] | 0, E = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + wv(r, s, o) | 0;
      p = d, d = c, c = a, a = i + g | 0, i = o, o = s, s = r, r = g + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, i, a, c, d, p);
  }
  roundClean() {
    vs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, mv = class extends fw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Po(() => new fw());
Po(() => new mv());
const Qa = BigInt(2 ** 32 - 1), od = BigInt(32);
function hw(t, e = !1) {
  return e ? { h: Number(t & Qa), l: Number(t >> od & Qa) } : { h: Number(t >> od & Qa) | 0, l: Number(t & Qa) | 0 };
}
function xv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = hw(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Sv = (t, e) => BigInt(t >>> 0) << od | BigInt(e >>> 0), Ev = (t, e, n) => t >>> n, Av = (t, e, n) => t << 32 - n | e >>> n, vv = (t, e, n) => t >>> n | e << 32 - n, kv = (t, e, n) => t << 32 - n | e >>> n, $v = (t, e, n) => t << 64 - n | e >>> n - 32, Iv = (t, e, n) => t >>> n - 32 | e << 64 - n, Lv = (t, e) => e, Cv = (t, e) => t, Tv = (t, e, n) => t << n | e >>> 32 - n, Bv = (t, e, n) => e << n | t >>> 32 - n, Mv = (t, e, n) => e << n - 32 | t >>> 64 - n, Nv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _v(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Pv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Uv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Hv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Ov = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Dv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Fv = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Ht = {
  fromBig: hw,
  split: xv,
  toBig: Sv,
  shrSH: Ev,
  shrSL: Av,
  rotrSH: vv,
  rotrSL: kv,
  rotrBH: $v,
  rotrBL: Iv,
  rotr32H: Lv,
  rotr32L: Cv,
  rotlSH: Tv,
  rotlSL: Bv,
  rotlBH: Mv,
  rotlBL: Nv,
  add: _v,
  add3L: Pv,
  add3H: Uv,
  add4L: Hv,
  add4H: Ov,
  add5H: Fv,
  add5L: Dv
}, [jv, Rv] = Ht.split([
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
let xl = class extends wf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: d, El: p, Fh: u, Fl: w, Gh: g, Gl: A, Hh: E, Hl: T } = this;
    return [e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = E | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ks[v] = e.getUint32(n), $s[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const B = ks[v - 15] | 0, P = $s[v - 15] | 0, Z = Ht.rotrSH(B, P, 1) ^ Ht.rotrSH(B, P, 8) ^ Ht.shrSH(B, P, 7), it = Ht.rotrSL(B, P, 1) ^ Ht.rotrSL(B, P, 8) ^ Ht.shrSL(B, P, 7), tt = ks[v - 2] | 0, K = $s[v - 2] | 0, b = Ht.rotrSH(tt, K, 19) ^ Ht.rotrBH(tt, K, 61) ^ Ht.shrSH(tt, K, 6), I = Ht.rotrSL(tt, K, 19) ^ Ht.rotrBL(tt, K, 61) ^ Ht.shrSL(tt, K, 6), M = Ht.add4L(it, I, $s[v - 7], $s[v - 16]), N = Ht.add4H(M, Z, b, ks[v - 7], ks[v - 16]);
      ks[v] = N | 0, $s[v] = M | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: d, Dl: p, Eh: u, El: w, Fh: g, Fl: A, Gh: E, Gl: T, Hh: O, Hl: H } = this;
    for (let v = 0; v < 80; v++) {
      const B = Ht.rotrSH(u, w, 14) ^ Ht.rotrSH(u, w, 18) ^ Ht.rotrBH(u, w, 41), P = Ht.rotrSL(u, w, 14) ^ Ht.rotrSL(u, w, 18) ^ Ht.rotrBL(u, w, 41), Z = u & g ^ ~u & E, it = w & A ^ ~w & T, tt = Ht.add5L(H, P, it, Rv[v], $s[v]), K = Ht.add5H(tt, O, B, Z, jv[v], ks[v]), b = tt | 0, I = Ht.rotrSH(r, s, 28) ^ Ht.rotrBH(r, s, 34) ^ Ht.rotrBH(r, s, 39), M = Ht.rotrSL(r, s, 28) ^ Ht.rotrBL(r, s, 34) ^ Ht.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = E | 0, H = T | 0, E = g | 0, T = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = Ht.add(d | 0, p | 0, K | 0, b | 0), d = a | 0, p = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const z = Ht.add3L(b, M, V);
      r = Ht.add3H(z, K, I, N), s = z | 0;
    }
    ({ h: r, l: s } = Ht.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ht.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ht.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: p } = Ht.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = Ht.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = Ht.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: E, l: T } = Ht.add(this.Gh | 0, this.Gl | 0, E | 0, T | 0), { h: O, l: H } = Ht.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, a, c, d, p, u, w, g, A, E, T, O, H);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zv = class extends xl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Gv = class extends xl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Kv = class extends xl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Po(() => new xl());
Po(() => new zv());
Po(() => new Gv());
Po(() => new Kv());
function Vv(t, e, n) {
  const s = JA;
  if (c4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ed.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ge;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ge || (Ge = {}));
let Yv = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, pw = class extends Yv {
  constructor(e) {
    super(e);
  }
};
function Sl(t) {
  const e = [];
  return e.push(ua(hf(t.version, 1))), e.push(ua(t.hash160)), Zr(e);
}
function qv(t) {
  const e = [];
  return e.push(t.prefix), e.push(Sl(t.address)), t.prefix === rd.Contract && e.push(da(t.contractName)), Zr(e);
}
function da(t) {
  const e = [], n = gf(t.content), r = n.byteLength;
  return e.push(ua(hf(r, t.lengthPrefixBytes))), e.push(n), Zr(e);
}
function Xv(t) {
  const e = [];
  return e.push(Sl(t.address)), e.push(da(t.contractName)), e.push(da(t.assetName)), Zr(e);
}
function gw(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(qv(t.principal)), (t.conditionType === Js.Fungible || t.conditionType === Js.NonFungible) && e.push(Xv(t.assetInfo)), t.conditionType === Js.NonFungible && e.push(Ao(t.assetName)), e.push(t.conditionCode), t.conditionType === Js.STX || t.conditionType === Js.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new pw("The post-condition amount may not be larger than 8 bytes");
    e.push(YA(t.amount, !1, 8));
  }
  return Zr(e);
}
function Cr(t, e) {
  return Zr([t, e]);
}
function Wv(t) {
  return new Uint8Array([t.type]);
}
function Zv(t) {
  return t.type === Ge.OptionalNone ? new Uint8Array([t.type]) : Cr(t.type, Ao(t.value));
}
function Qv(t) {
  const e = new Uint8Array(4);
  return ml(e, t.buffer.length, 0), Cr(t.type, yf(e, t.buffer));
}
function Jv(t) {
  const e = pf(qA(t.value, BigInt(tv)), aw);
  return Cr(t.type, e);
}
function t4(t) {
  const e = pf(t.value, aw);
  return Cr(t.type, e);
}
function e4(t) {
  return Cr(t.type, Sl(t.address));
}
function n4(t) {
  return Cr(t.type, yf(Sl(t.address), da(t.contractName)));
}
function r4(t) {
  return Cr(t.type, Ao(t.value));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  ml(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ao(r);
    e.push(s);
  }
  return Cr(t.type, Zr(e));
}
function o4(t) {
  const e = [], n = new Uint8Array(4);
  ml(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Vv(s);
    e.push(da(o));
    const i = Ao(t.data[s]);
    e.push(i);
  }
  return Cr(t.type, Zr(e));
}
function yw(t, e) {
  const n = [], r = e == "ascii" ? ZA(t.data) : gf(t.data), s = new Uint8Array(4);
  return ml(s, r.length, 0), n.push(s), n.push(r), Cr(t.type, Zr(n));
}
function i4(t) {
  return yw(t, "ascii");
}
function a4(t) {
  return yw(t, "utf8");
}
function Ao(t) {
  switch (t.type) {
    case Ge.BoolTrue:
    case Ge.BoolFalse:
      return Wv(t);
    case Ge.OptionalNone:
    case Ge.OptionalSome:
      return Zv(t);
    case Ge.Buffer:
      return Qv(t);
    case Ge.UInt:
      return t4(t);
    case Ge.Int:
      return Jv(t);
    case Ge.PrincipalStandard:
      return e4(t);
    case Ge.PrincipalContract:
      return n4(t);
    case Ge.ResponseOk:
    case Ge.ResponseErr:
      return r4(t);
    case Ge.List:
      return s4(t);
    case Ge.Tuple:
      return o4(t);
    case Ge.StringASCII:
      return i4(t);
    case Ge.StringUTF8:
      return a4(t);
    default:
      throw new pw("Unable to serialize. Invalid Clarity Value.");
  }
}
const c4 = (t, e) => t ? gf(t).length > e : !1, l4 = "connect-ui";
let bc, ww, Bn = !1, id = !1;
const Wr = (t, e = "") => () => {
}, u4 = (t, e) => () => {
}, d4 = "{visibility:hidden}.hydrated{visibility:inherit}", Up = {}, f4 = "http://www.w3.org/2000/svg", h4 = "http://www.w3.org/1999/xhtml", p4 = (t) => t != null, xf = (t) => (t = typeof t, t === "object" || t === "function");
function bw(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Tt = (t, e, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (d) => {
    for (let p = 0; p < d.length; p++)
      r = d[p], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !xf(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? ad(null, r) : r), o = s);
  };
  if (a(n), e) {
    const d = e.className || e.class;
    d && (e.class = typeof d != "object" ? d : Object.keys(d).filter((p) => d[p]).join(" "));
  }
  const c = ad(t, null);
  return c.$attrs$ = e, i.length > 0 && (c.$children$ = i), c;
}, ad = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, g4 = {}, y4 = (t) => t && t.$tag$ === g4, w4 = (t, e) => t != null && !xf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, b4 = (t) => Bi(t).$hostElement$, m4 = (t, e, n) => {
  const r = nn.ce(e, n);
  return t.dispatchEvent(r), r;
}, Hp = /* @__PURE__ */ new WeakMap(), x4 = (t, e, n) => {
  let r = Dc.get(t);
  F4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Dc.set(t, r);
}, S4 = (t, e, n, r) => {
  var s;
  let o = mw(e);
  const i = Dc.get(o);
  if (t = t.nodeType === 11 ? t : vr, i)
    if (typeof i == "string") {
      t = t.head || t;
      let a = Hp.get(t), c;
      if (a || Hp.set(t, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = vr.createElement("style"), c.innerHTML = i;
          const d = (s = nn.$nonce$) !== null && s !== void 0 ? s : bw(vr);
          d != null && c.setAttribute("nonce", d), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(o);
      }
    } else t.adoptedStyleSheets.includes(i) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, i]);
  return o;
}, E4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Wr("attachStyles", e.$tagName$), o = S4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, mw = (t, e) => "sc-" + t.$tagName$, Op = (t, e, n, r, s, o) => {
  if (n !== r) {
    let i = Fp(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, d = Dp(n), p = Dp(r);
      c.remove(...d.filter((u) => u && !p.includes(u))), c.add(...p.filter((u) => u && !d.includes(u)));
    } else if (!i && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Fp(El, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && nn.rel(t, e, n, !1), r && nn.ael(t, e, r, !1);
    else {
      const c = xf(r);
      if ((i || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const d = r ?? "";
            e === "list" ? i = !1 : (n == null || t[e] != d) && (t[e] = d);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!i || o & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, A4 = /\s/, Dp = (t) => t ? t.split(A4) : [], xw = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, o = t && t.$attrs$ || Up, i = e.$attrs$ || Up;
  for (r in o)
    r in i || Op(s, r, o[r], void 0, n, e.$flags$);
  for (r in i)
    Op(s, r, o[r], i[r], n, e.$flags$);
}, Sf = (t, e, n, r) => {
  const s = e.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = vr.createTextNode(s.$text$);
  else {
    if (Bn || (Bn = s.$tag$ === "svg"), i = s.$elm$ = vr.createElementNS(Bn ? f4 : h4, s.$tag$), Bn && s.$tag$ === "foreignObject" && (Bn = !1), xw(null, s, Bn), p4(bc) && i["s-si"] !== bc && i.classList.add(i["s-si"] = bc), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = Sf(t, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? Bn = !1 : i.tagName === "foreignObject" && (Bn = !0);
  }
  return i;
}, Sw = (t, e, n, r, s, o) => {
  let i = t, a;
  for (i.shadowRoot && i.tagName === ww && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = Sf(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, e)));
}, Ew = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, v4 = (t, e, n, r) => {
  let s = 0, o = 0, i = e.length - 1, a = e[0], c = e[i], d = r.length - 1, p = r[0], u = r[d], w;
  for (; s <= i && o <= d; )
    a == null ? a = e[++s] : c == null ? c = e[--i] : p == null ? p = r[++o] : u == null ? u = r[--d] : Ja(a, p) ? (Zi(a, p), a = e[++s], p = r[++o]) : Ja(c, u) ? (Zi(c, u), c = e[--i], u = r[--d]) : Ja(a, u) ? (Zi(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--d]) : Ja(c, p) ? (Zi(c, p), t.insertBefore(c.$elm$, a.$elm$), c = e[--i], p = r[++o]) : (w = Sf(e && e[o], n, o), p = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Sw(t, r[d + 1] == null ? null : r[d + 1].$elm$, n, r, o, d) : o > d && Ew(e, s, i);
}, Ja = (t, e) => t.$tag$ === e.$tag$, Zi = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, o = e.$tag$, i = e.$text$;
  i === null ? (Bn = o === "svg" ? !0 : o === "foreignObject" ? !1 : Bn, xw(t, e, Bn), r !== null && s !== null ? v4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Sw(n, null, e, s, 0, s.length - 1)) : r !== null && Ew(r, 0, r.length - 1), Bn && o === "svg" && (Bn = !1)) : t.$text$ !== i && (n.data = i);
}, k4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ad(null, null), s = y4(e) ? e : Tt(null, null, e);
  ww = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, bc = n["s-sc"], Zi(r, s);
}, Aw = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Ef = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Aw(t, t.$ancestorComponent$), R4(() => $4(t, e));
}, $4 = (t, e) => {
  const n = Wr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), T4(s, () => I4(t, r, e));
}, I4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Wr("update", t.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && E4(t);
  const i = Wr("render", t.$cmpMeta$.$tagName$);
  L4(t, e), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => C4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, L4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, k4(t, e);
  } catch (r) {
    fa(r, t.$hostElement$);
  }
  return null;
}, C4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Wr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, kw(n), r(), t.$onReadyResolve$(n), s || vw()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && vf(() => Ef(t, !1)), t.$flags$ &= -517;
}, vw = (t) => {
  kw(vr.documentElement), vf(() => m4(El, "appload", { detail: { namespace: l4 } }));
}, T4 = (t, e) => t && t.then ? t.then(e) : e(), kw = (t) => t.classList.add("hydrated"), B4 = (t, e) => Bi(t).$instanceValues$.get(e), M4 = (t, e, n, r) => {
  const s = Bi(t), o = s.$instanceValues$.get(e), i = s.$flags$, a = s.$lazyInstance$;
  n = w4(n, r.$members$[e][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), d = n !== o && !c;
  (!(i & 8) || o === void 0) && d && (s.$instanceValues$.set(e, n), a && (i & 18) === 2 && Ef(s, !1));
}, $w = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return B4(this, o);
        },
        set(a) {
          M4(this, o, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        nn.jmp(() => {
          const d = o.get(i);
          if (this.hasOwnProperty(d))
            c = this[d], delete this[d];
          else if (s.hasOwnProperty(d) && typeof this[d] == "number" && this[d] == c)
            return;
          this[d] = c === null && typeof this[d] == "boolean" ? !1 : c;
        });
      }, t.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return o.set(c, i), c;
      });
    }
  }
  return t;
}, N4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = D4(n), s.then) {
        const c = u4();
        s = await s, c();
      }
      s.isProxied || ($w(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Wr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        fa(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = mw(n);
      if (!Dc.has(c)) {
        const d = Wr("registerStyles", n.$tagName$);
        x4(c, a, !!(n.$flags$ & 1)), d();
      }
    }
  }
  const o = e.$ancestorComponent$, i = () => Ef(e, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, _4 = (t) => {
  if (!(nn.$flags$ & 1)) {
    const e = Bi(t), n = e.$cmpMeta$, r = Wr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Aw(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && t.hasOwnProperty(s)) {
          const i = t[s];
          delete t[s], t[s] = i;
        }
      }), N4(t, e, n);
    }
    r();
  }
}, P4 = (t) => {
  nn.$flags$ & 1 || Bi(t);
}, U4 = (t, e = {}) => {
  var n;
  const r = Wr(), s = [], o = e.exclude || [], i = El.customElements, a = vr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), d = /* @__PURE__ */ vr.createElement("style"), p = [];
  let u, w = !0;
  Object.assign(nn, e), nn.$resourcesUrl$ = new URL(e.resourcesUrl || "./", vr.baseURI).href, t.map((g) => {
    g[1].map((A) => {
      const E = {
        $flags$: A[0],
        $tagName$: A[1],
        $members$: A[2],
        $listeners$: A[3]
      };
      E.$members$ = A[2];
      const T = E.$tagName$, O = class extends HTMLElement {
        // StencilLazyHost
        constructor(H) {
          super(H), H = this, O4(H, E), E.$flags$ & 1 && H.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), w ? p.push(this) : nn.jmp(() => _4(this));
        }
        disconnectedCallback() {
          nn.jmp(() => P4(this));
        }
        componentOnReady() {
          return Bi(this).$onReadyPromise$;
        }
      };
      E.$lazyBundleId$ = g[0], !o.includes(T) && !i.get(T) && (s.push(T), i.define(T, $w(
        O,
        E,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    d.innerHTML = s + d4, d.setAttribute("data-styles", "");
    const g = (n = nn.$nonce$) !== null && n !== void 0 ? n : bw(vr);
    g != null && d.setAttribute("nonce", g), a.insertBefore(d, c ? c.nextSibling : a.firstChild);
  }
  w = !1, p.length ? p.map((g) => g.connectedCallback()) : nn.jmp(() => u = setTimeout(vw, 30)), r();
}, Af = /* @__PURE__ */ new WeakMap(), Bi = (t) => Af.get(t), H4 = (t, e) => Af.set(e.$lazyInstance$ = t, e), O4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Af.set(t, n);
}, Fp = (t, e) => e in t, fa = (t, e) => (0, console.error)(t, e), tu = /* @__PURE__ */ new Map(), D4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, o = tu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (tu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => nL).then(i, fa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (tu.set(s, i), i[r]), fa);
}, Dc = /* @__PURE__ */ new Map(), El = typeof window < "u" ? window : {}, vr = El.document || { head: {} }, nn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Iw = (t) => Promise.resolve(t), F4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), jp = [], Lw = [], j4 = (t, e) => (n) => {
  t.push(n), id || (id = !0, nn.$flags$ & 4 ? vf(cd) : nn.raf(cd));
}, Rp = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      fa(n);
    }
  t.length = 0;
}, cd = () => {
  Rp(jp), Rp(Lw), (id = jp.length > 0) && nn.raf(cd);
}, vf = (t) => Iw().then(t), R4 = /* @__PURE__ */ j4(Lw), z4 = () => Iw(), G4 = (t, e) => typeof window > "u" ? Promise.resolve() : z4().then(() => U4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var K4 = Object.defineProperty, V4 = Object.defineProperties, Y4 = Object.getOwnPropertyDescriptors, Fc = Object.getOwnPropertySymbols, Cw = Object.prototype.hasOwnProperty, Tw = Object.prototype.propertyIsEnumerable, zp = (t, e, n) => e in t ? K4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Un = (t, e) => {
  for (var n in e || (e = {})) Cw.call(e, n) && zp(t, n, e[n]);
  if (Fc) for (var n of Fc(e)) Tw.call(e, n) && zp(t, n, e[n]);
  return t;
}, ar = (t, e) => V4(t, Y4(e)), Bw = (t, e) => {
  var n = {};
  for (var r in t) Cw.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Fc) for (var r of Fc(t)) e.indexOf(r) < 0 && Tw.call(t, r) && (n[r] = t[r]);
  return n;
};
function Mw() {
  return gl(wo()) || window.StacksProvider || window.BlockstackProvider;
}
function Al(t) {
  return t ? typeof t == "string" ? mo.fromName(t) : "version" in t ? t : "url" in t ? new Uu({ url: t.url }) : t.transactionVersion === So.Mainnet ? new Uu({ url: t.client.baseUrl }) : new Hu({ url: t.client.baseUrl }) : new Hu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var q4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(q4 || {}), X4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(X4 || {}), kf = (t) => {
  let e = t;
  if (!e) {
    let n = new dg(["store_write"], document.location.href);
    e = new Pu({ appConfig: n });
  }
  return e;
};
function Nw(t) {
  try {
    return kf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var _w = (t) => {
  let e = kf(t).loadUserData().appPrivateKey, n = Xe.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function W4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let o = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, i = { [xo.Mainnet]: "mainnet", [xo.Testnet]: "testnet" }, a = Al(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function Z4(t) {
  let e = Al(t.network), n = kf(t.userSession), r = ar(Un({}, t), { network: e, userSession: n });
  return Un({ stxAddress: W4(r) }, r);
}
async function Q4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(ow) : n = n.map((r) => yt(gw(r)))), new Xe.TokenSigner("ES256k", e).signAsync(ar(Un({}, t), { postConditions: n }));
}
function J4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(ow) : e = e.map((n) => yt(gw(n)))), Xe.createUnsecuredToken(ar(Un({}, t), { postConditions: e }));
}
var tk = async ({ token: t, options: e }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(t), { txRaw: a } = i, c = Wt(a.replace(/^0x/, "")), d = GA(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, ar(Un({}, i), { stacksTransaction: d }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, ar(Un({}, i), { stacksTransaction: d }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = e.onCancel) == null || o.call(e);
  }
}, ek = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, o = Bw(e, ["amount", "appDetails", "userSession"]);
  if (Nw(s)) {
    let { privateKey: a, publicKey: c } = _w(s), d = ar(Un({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (d.appDetails = r), Q4(d, a);
  }
  let i = ar(Un({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), J4(i);
};
async function nk(t, e, n) {
  let r = await e(ar(Un(Un({}, Z4(t)), t), { network: Al(t.network) }));
  return tk({ token: r, options: t }, n);
}
function rk(t, e = Mw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return nk(t, ek, e);
}
function Pw(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ar(Un({}, t), { message: wp(e), domain: wp(n) }) : ar(Un({}, t), { message: yt(Ao(e)), domain: yt(Ao(n)) });
}
async function sk(t, e) {
  return new Xe.TokenSigner("ES256k", e).signAsync(Pw(t));
}
async function ok(t) {
  let e = t, { userSession: n } = e, r = Bw(e, ["userSession"]);
  if (Nw(n)) {
    let { privateKey: s, publicKey: o } = _w(n), i = ar(Un({}, r), { publicKey: o });
    return sk(i, s);
  }
  return Xe.createUnsecuredToken(Pw(t));
}
var ik = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(ik || {}), Uw = "asigna-stx", Gp = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Uw && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(ck(t, e), "*");
}), ak = { authenticationRequest: async (t) => Gp(t, "authenticationRequest"), transactionRequest: async (t) => Gp(t, "transactionRequest") }, ck = (t, e) => ({ source: Uw, [e]: t }), lk = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = ak);
};
lk();
var uk = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function dk(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let o = wo(), i = Mw();
    if (o && i) return t(n, i);
    if (typeof window > "u") return;
    G4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : uk, c = n3(a), d = document.createElement("connect-modal");
    d.defaultProviders = a, d.installedProviders = c, d.persistSelection = e;
    let p = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let u = () => {
      d.remove(), document.body.style.overflow = p;
    };
    d.callback = (g) => {
      u(), t(n, g);
    }, d.cancelCallback = () => {
      var g;
      u(), (g = n.onCancel) == null || g.call(n);
    }, document.body.appendChild(d);
    let w = (g) => {
      g.key === "Escape" && (document.removeEventListener("keydown", w), d.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var tc = dk(rk);
function Fs(t, e, n) {
  return $f(hn(t, e), n);
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
      const r = pk(BigInt(`0x${zt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${zt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Kp(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ka(t, e = 8) {
  return (typeof t == "bigint" ? t : hn(t, !1)).toString(16).padStart(e * 2, "0");
}
function vl(t) {
  return parseInt(t, 16);
}
function $f(t, e = 16) {
  const n = ka(t, e);
  return Se(n);
}
function fk(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function hk(t, e) {
  return t & BigInt(1) << e;
}
function pk(t, e) {
  return hk(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const gk = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function zt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += gk[n];
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
function Mi(t) {
  return new TextEncoder().encode(t);
}
function If(t) {
  return new TextDecoder().decode(t);
}
function Hw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function yk(t) {
  return String.fromCharCode.apply(null, t);
}
function wk(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Vp(t) {
  if (t.some(wk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function kl(...t) {
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
  return kl(...t.map((e) => typeof e == "number" ? Vp([e]) : e instanceof Array ? Vp(e) : e));
}
var Yp;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yp || (Yp = {}));
var qp;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qp || (qp = {}));
var Xp;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Xp || (Xp = {}));
const Ow = 33, eu = 32;
function bk(t) {
  if (t.length < eu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + eu * 2), r = t.slice(2 + eu * 2);
  return {
    recoveryId: vl(e),
    r: n,
    s: r
  };
}
function mk(t) {
  const e = typeof t == "string" ? Se(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function xk(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Sk(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Ek(t, e) {
  return t[e];
}
function Ak(t, e, n = 0) {
  return t[n] = e, t;
}
function vk(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function vo(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var ld;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ld || (ld = {}));
const kk = ld.Mainnet, $k = 128, Ik = 128, Dw = 16, co = 32, ud = 80, $l = 65, Lk = 32, Ck = 64, jc = 34;
var pt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(pt || (pt = {}));
var Ft;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ft || (Ft = {}));
var dd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(dd || (dd = {}));
var xn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xn || (xn = {}));
const mc = ["onChainOnly", "offChainOnly", "any"], Wp = {
  [mc[0]]: xn.OnChainOnly,
  [mc[1]]: xn.OffChainOnly,
  [mc[2]]: xn.Any,
  [xn.OnChainOnly]: xn.OnChainOnly,
  [xn.OffChainOnly]: xn.OffChainOnly,
  [xn.Any]: xn.Any
};
function Tk(t) {
  if (t in Wp)
    return Wp[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${mc.join(", ")}`);
}
var Rc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rc || (Rc = {}));
Rc.Mainnet;
var Ei;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ei || (Ei = {}));
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
var zc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(zc || (zc = {}));
var ve;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ve || (ve = {}));
var ha;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ha || (ha = {}));
var fd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(fd || (fd = {}));
var pa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(pa || (pa = {}));
var Zp;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zp || (Zp = {}));
var Qp;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Qp || (Qp = {}));
function hd(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Bk(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Fw(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Mk(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  hd(t.outputLen), hd(t.blockLen);
}
function Nk(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _k(t, e) {
  Fw(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const oo = {
  number: hd,
  bool: Bk,
  bytes: Fw,
  hash: Mk,
  exists: Nk,
  output: _k
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nu = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), yr = (t, e) => t << 32 - e | t >>> e, Pk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Pk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Uk(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Lf(t) {
  if (typeof t == "string" && (t = Uk(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class jw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Uo(t) {
  const e = (r) => t().update(Lf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Hk(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, d = r ? 0 : 4;
  t.setUint32(e + c, i, r), t.setUint32(e + d, a, r);
}
class Cf extends jw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = nu(this.buffer);
  }
  update(e) {
    oo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Lf(e);
    const o = e.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = nu(e);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(e.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    oo.exists(this), oo.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let u = i; u < s; u++)
      n[u] = 0;
    Hk(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = nu(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const d = c / 4, p = this.get();
    if (d > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < d; u++)
      a.setUint32(4 * u, p[u], o);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return e.length = s, e.pos = a, e.finished = o, e.destroyed = i, s % n && e.buffer.set(r), e;
  }
}
const Ok = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Rw = Uint8Array.from({ length: 16 }, (t, e) => e), Dk = Rw.map((t) => (9 * t + 5) % 16);
let Tf = [Rw], Bf = [Dk];
for (let t = 0; t < 4; t++)
  for (let e of [Tf, Bf])
    e.push(e[t].map((n) => Ok[n]));
const zw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Fk = Tf.map((t, e) => t.map((n) => zw[e][n])), jk = Bf.map((t, e) => t.map((n) => zw[e][n])), Rk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ec = (t, e) => t << e | t >>> 32 - e;
function Jp(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const nc = new Uint32Array(16);
class Gk extends Cf {
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
    for (let g = 0; g < 16; g++, n += 4)
      nc[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, d = this.h3 | 0, p = d, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, E = Rk[g], T = zk[g], O = Tf[g], H = Bf[g], v = Fk[g], B = jk[g];
      for (let P = 0; P < 16; P++) {
        const Z = ec(r + Jp(g, o, a, d) + nc[O[P]] + E, v[P]) + u | 0;
        r = u, u = d, d = ec(a, 10) | 0, a = o, o = Z;
      }
      for (let P = 0; P < 16; P++) {
        const Z = ec(s + Jp(A, i, c, p) + nc[H[P]] + T, B[P]) + w | 0;
        s = w, w = p, p = ec(c, 10) | 0, c = i, i = Z;
      }
    }
    this.set(this.h1 + a + p | 0, this.h2 + d + w | 0, this.h3 + u + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    nc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Kk = Uo(() => new Gk()), Vk = (t, e, n) => t & e ^ ~t & n, Yk = (t, e, n) => t & e ^ t & n ^ e & n, qk = new Uint32Array([
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
class Gw extends Cf {
  constructor() {
    super(64, 32, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [e, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let u = 0; u < 16; u++, n += 4)
      Ls[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ls[u - 15], g = Ls[u - 2], A = yr(w, 7) ^ yr(w, 18) ^ w >>> 3, E = yr(g, 17) ^ yr(g, 19) ^ g >>> 10;
      Ls[u] = E + Ls[u - 7] + A + Ls[u - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: d, H: p } = this;
    for (let u = 0; u < 64; u++) {
      const w = yr(a, 6) ^ yr(a, 11) ^ yr(a, 25), g = p + w + Vk(a, c, d) + qk[u] + Ls[u] | 0, E = (yr(r, 2) ^ yr(r, 13) ^ yr(r, 22)) + Yk(r, s, o) | 0;
      p = d, d = c, c = a, a = i + g | 0, i = o, o = s, s = r, r = g + E | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, s, o, i, a, c, d, p);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Xk extends Gw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Mf = Uo(() => new Gw());
Uo(() => new Xk());
const rc = BigInt(2 ** 32 - 1), pd = BigInt(32);
function Kw(t, e = !1) {
  return e ? { h: Number(t & rc), l: Number(t >> pd & rc) } : { h: Number(t >> pd & rc) | 0, l: Number(t & rc) | 0 };
}
function Wk(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: o, l: i } = Kw(t[s], e);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Zk = (t, e) => BigInt(t >>> 0) << pd | BigInt(e >>> 0), Qk = (t, e, n) => t >>> n, Jk = (t, e, n) => t << 32 - n | e >>> n, t8 = (t, e, n) => t >>> n | e << 32 - n, e8 = (t, e, n) => t << 32 - n | e >>> n, n8 = (t, e, n) => t << 64 - n | e >>> n - 32, r8 = (t, e, n) => t >>> n - 32 | e << 64 - n, s8 = (t, e) => e, o8 = (t, e) => t, i8 = (t, e, n) => t << n | e >>> 32 - n, a8 = (t, e, n) => e << n | t >>> 32 - n, c8 = (t, e, n) => e << n - 32 | t >>> 64 - n, l8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function u8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const d8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), f8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, h8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), p8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, g8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), y8 = (t, e, n, r, s, o) => e + n + r + s + o + (t / 2 ** 32 | 0) | 0, Ot = {
  fromBig: Kw,
  split: Wk,
  toBig: Zk,
  shrSH: Qk,
  shrSL: Jk,
  rotrSH: t8,
  rotrSL: e8,
  rotrBH: n8,
  rotrBL: r8,
  rotr32H: s8,
  rotr32L: o8,
  rotlSH: i8,
  rotlSL: a8,
  rotlBH: c8,
  rotlBL: l8,
  add: u8,
  add3L: d8,
  add3H: f8,
  add4L: h8,
  add4H: p8,
  add5H: y8,
  add5L: g8
}, [w8, b8] = Ot.split([
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
class Il extends Cf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: d, El: p, Fh: u, Fl: w, Gh: g, Gl: A, Hh: E, Hl: T } = this;
    return [e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T];
  }
  // prettier-ignore
  set(e, n, r, s, o, i, a, c, d, p, u, w, g, A, E, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = d | 0, this.El = p | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = E | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Cs[v] = e.getUint32(n), Ts[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const B = Cs[v - 15] | 0, P = Ts[v - 15] | 0, Z = Ot.rotrSH(B, P, 1) ^ Ot.rotrSH(B, P, 8) ^ Ot.shrSH(B, P, 7), it = Ot.rotrSL(B, P, 1) ^ Ot.rotrSL(B, P, 8) ^ Ot.shrSL(B, P, 7), tt = Cs[v - 2] | 0, K = Ts[v - 2] | 0, b = Ot.rotrSH(tt, K, 19) ^ Ot.rotrBH(tt, K, 61) ^ Ot.shrSH(tt, K, 6), I = Ot.rotrSL(tt, K, 19) ^ Ot.rotrBL(tt, K, 61) ^ Ot.shrSL(tt, K, 6), M = Ot.add4L(it, I, Ts[v - 7], Ts[v - 16]), N = Ot.add4H(M, Z, b, Cs[v - 7], Cs[v - 16]);
      Cs[v] = N | 0, Ts[v] = M | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: d, Dl: p, Eh: u, El: w, Fh: g, Fl: A, Gh: E, Gl: T, Hh: O, Hl: H } = this;
    for (let v = 0; v < 80; v++) {
      const B = Ot.rotrSH(u, w, 14) ^ Ot.rotrSH(u, w, 18) ^ Ot.rotrBH(u, w, 41), P = Ot.rotrSL(u, w, 14) ^ Ot.rotrSL(u, w, 18) ^ Ot.rotrBL(u, w, 41), Z = u & g ^ ~u & E, it = w & A ^ ~w & T, tt = Ot.add5L(H, P, it, b8[v], Ts[v]), K = Ot.add5H(tt, O, B, Z, w8[v], Cs[v]), b = tt | 0, I = Ot.rotrSH(r, s, 28) ^ Ot.rotrBH(r, s, 34) ^ Ot.rotrBH(r, s, 39), M = Ot.rotrSL(r, s, 28) ^ Ot.rotrBL(r, s, 34) ^ Ot.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = E | 0, H = T | 0, E = g | 0, T = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = Ot.add(d | 0, p | 0, K | 0, b | 0), d = a | 0, p = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const z = Ot.add3L(b, M, V);
      r = Ot.add3H(z, K, I, N), s = z | 0;
    }
    ({ h: r, l: s } = Ot.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ot.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ot.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: d, l: p } = Ot.add(this.Dh | 0, this.Dl | 0, d | 0, p | 0), { h: u, l: w } = Ot.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = Ot.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: E, l: T } = Ot.add(this.Gh | 0, this.Gl | 0, E | 0, T | 0), { h: O, l: H } = Ot.add(this.Hh | 0, this.Hl | 0, O | 0, H | 0), this.set(r, s, o, i, a, c, d, p, u, w, g, A, E, T, O, H);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class m8 extends Il {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class x8 extends Il {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class S8 extends Il {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Uo(() => new Il());
Uo(() => new m8());
const E8 = Uo(() => new x8());
Uo(() => new S8());
function Vw(t) {
  if (Se(t).byteLength != $l)
    throw Error("Invalid signature");
  return {
    type: pt.MessageSignature,
    data: t
  };
}
function Qi(t, e) {
  return { type: pt.Address, version: t, hash160: e };
}
function si(t) {
  return No.c32address(t.version, t.hash160);
}
function ko(t, e, n) {
  const r = e || 1, s = n || $k;
  if (lb(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Nf(t) {
  const e = No.c32addressDecode(t);
  return {
    type: pt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var nt;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(nt || (nt = {}));
function A8(t) {
  if (t.type === nt.PrincipalStandard)
    return si(t.address);
  if (t.type === nt.PrincipalContract)
    return `${si(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Yw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return $8(e, n);
  } else
    return v8(t);
}
function v8(t) {
  const e = Nf(t);
  return { type: nt.PrincipalStandard, address: e };
}
function k8(t) {
  return { type: nt.PrincipalStandard, address: t };
}
function $8(t, e) {
  const n = Nf(t), r = ko(e);
  return qw(n, r);
}
function qw(t, e) {
  if (Mi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: nt.PrincipalContract, address: t, contractName: e };
}
function ru(t, e = !1) {
  switch (t.type) {
    case nt.BoolTrue:
      return !0;
    case nt.BoolFalse:
      return !1;
    case nt.Int:
    case nt.UInt:
      return e ? t.value.toString() : t.value;
    case nt.Buffer:
      return `0x${zt(t.buffer)}`;
    case nt.OptionalNone:
      return null;
    case nt.OptionalSome:
      return rr(t.value);
    case nt.ResponseErr:
      return rr(t.value);
    case nt.ResponseOk:
      return rr(t.value);
    case nt.PrincipalStandard:
    case nt.PrincipalContract:
      return A8(t);
    case nt.List:
      return t.list.map((r) => rr(r));
    case nt.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = rr(t.data[r]);
      }), n;
    case nt.StringASCII:
      return t.data;
    case nt.StringUTF8:
      return t.data;
  }
}
function rr(t) {
  switch (t.type) {
    case nt.ResponseErr:
      return { type: Ns(t), value: ru(t, !0), success: !1 };
    case nt.ResponseOk:
      return { type: Ns(t), value: ru(t, !0), success: !0 };
    default:
      return { type: Ns(t), value: ru(t, !0) };
  }
}
function Ns(t) {
  switch (t.type) {
    case nt.BoolTrue:
    case nt.BoolFalse:
      return "bool";
    case nt.Int:
      return "int";
    case nt.UInt:
      return "uint";
    case nt.Buffer:
      return `(buff ${t.buffer.length})`;
    case nt.OptionalNone:
      return "(optional none)";
    case nt.OptionalSome:
      return `(optional ${Ns(t.value)})`;
    case nt.ResponseErr:
      return `(response UnknownType ${Ns(t.value)})`;
    case nt.ResponseOk:
      return `(response ${Ns(t.value)} UnknownType)`;
    case nt.PrincipalStandard:
    case nt.PrincipalContract:
      return "principal";
    case nt.List:
      return `(list ${t.list.length} ${t.list.length ? Ns(t.list[0]) : "UnknownType"})`;
    case nt.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Ns(t.data[e])})`).join(" ")})`;
    case nt.StringASCII:
      return `(string-ascii ${Hw(t.data).length})`;
    case nt.StringUTF8:
      return `(string-utf8 ${Mi(t.data).length})`;
  }
}
const Xw = () => ({ type: nt.BoolTrue }), Ww = () => ({ type: nt.BoolFalse }), I8 = (t) => t ? Xw() : Ww(), t0 = BigInt("0xffffffffffffffffffffffffffffffff"), L8 = BigInt(0), e0 = BigInt("0x7fffffffffffffffffffffffffffffff"), n0 = BigInt("-170141183460469231731687303715884105728"), C8 = (t) => {
  const e = hn(t, !0);
  if (e > e0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${e0}`);
  if (e < n0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${n0}`);
  return { type: nt.Int, value: e };
}, kr = (t) => {
  const e = hn(t, !1);
  if (e < L8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > t0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${t0}`);
  return { type: nt.UInt, value: e };
}, Zw = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: nt.Buffer, buffer: t };
};
function Qw() {
  return { type: nt.OptionalNone };
}
function Jw(t) {
  return { type: nt.OptionalSome, value: t };
}
function T8(t) {
  return { type: nt.ResponseErr, value: t };
}
function B8(t) {
  return { type: nt.ResponseOk, value: t };
}
function M8(t) {
  return { type: nt.List, list: t };
}
function $o(t) {
  for (const e in t)
    if (!S6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: nt.Tuple, data: t };
}
const qe = (t) => ({ type: nt.StringASCII, data: t }), N8 = (t) => ({ type: nt.StringUTF8, data: t });
class tb extends jw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, oo.hash(e);
    const r = Lf(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = o, e.blockLen = i, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const eb = (t, e, n) => new tb(t, e).update(n).digest();
eb.create = (t, e) => new tb(t, e);
Be.hmacSha256Sync = (t, ...e) => {
  const n = eb.create(Mf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ai(t) {
  return {
    type: pt.PublicKey,
    data: Se(t)
  };
}
function _8(t, e, n = ve.Compressed) {
  const r = bk(e.data), s = new _n(Kp(r.r), Kp(r.s)), o = jt.fromSignature(t, s, r.recoveryId), i = n === ve.Compressed;
  return o.toHex(i);
}
function P8(t) {
  return { type: pt.PublicKey, data: t };
}
function Ni(t) {
  return !zt(t.data).startsWith("04");
}
function Gc(t) {
  return t.data.slice();
}
function U8(t) {
  const e = D8(t), n = xa(e.data.slice(0, 32), e.compressed);
  return Ai(zt(n));
}
function H8(t) {
  const e = typeof t == "string" ? t : zt(t), n = jt.fromHex(e).toHex(!0);
  return Ai(n);
}
function O8(t) {
  const e = typeof t == "string" ? t : zt(t), n = jt.fromHex(e).toHex(!1);
  return Ai(n);
}
function gd(t) {
  const e = t.readUInt8(), n = e === 4 ? Ck : Lk;
  return P8(He([e, t.readBytes(n)]));
}
function D8(t) {
  const e = mk(t), n = e.length == Ow;
  return { data: e, compressed: n };
}
function F8(t, e) {
  const [n, r] = ol(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = ka(r, 1) + _n.fromHex(n).toCompactHex();
  return Vw(o);
}
function j8(t) {
  return U8(t.data);
}
function R8(t, e, n) {
  return typeof t == "string" && (t = Yw(t)), typeof n == "string" && (n = o0(n)), {
    type: pt.Payload,
    payloadType: Ft.TokenTransfer,
    recipient: t,
    amount: hn(e, !1),
    memo: n ?? o0("")
  };
}
function z8(t, e, n, r) {
  return typeof t == "string" && (t = Nf(t)), typeof e == "string" && (e = ko(e)), typeof n == "string" && (n = ko(n)), {
    type: pt.Payload,
    payloadType: Ft.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function r0(t, e, n) {
  return typeof t == "string" && (t = ko(t)), typeof e == "string" && (e = Q8(e)), typeof n == "number" ? {
    type: pt.Payload,
    payloadType: Ft.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: pt.Payload,
    payloadType: Ft.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function G8() {
  return { type: pt.Payload, payloadType: Ft.PoisonMicroblock };
}
function s0(t, e) {
  if (t.byteLength != co)
    throw Error(`Coinbase buffer size must be ${co} bytes`);
  return e != null ? {
    type: pt.Payload,
    payloadType: Ft.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: pt.Payload,
    payloadType: Ft.Coinbase,
    coinbaseBytes: t
  };
}
function K8(t, e, n) {
  if (t.byteLength != co)
    throw Error(`Coinbase buffer size must be ${co} bytes`);
  if (n.byteLength != ud)
    throw Error(`VRF proof buffer size must be ${ud} bytes`);
  return {
    type: pt.Payload,
    payloadType: Ft.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === nt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var yd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(yd || (yd = {}));
function V8(t, e, n, r, s, o, i) {
  return {
    type: pt.Payload,
    payloadType: Ft.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function nb(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ft.TokenTransfer:
      e.push(_e(t.recipient)), e.push(Fs(t.amount, !1, 8)), e.push(jr(t.memo));
      break;
    case Ft.ContractCall:
      e.push(jr(t.contractAddress)), e.push(jr(t.contractName)), e.push(jr(t.functionName));
      const n = new Uint8Array(4);
      vo(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(_e(r));
      });
      break;
    case Ft.SmartContract:
      e.push(jr(t.contractName)), e.push(jr(t.codeBody));
      break;
    case Ft.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(jr(t.contractName)), e.push(jr(t.codeBody));
      break;
    case Ft.PoisonMicroblock:
      break;
    case Ft.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ft.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient));
      break;
    case Ft.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient ? Jw(t.recipient) : Qw())), e.push(t.vrfProof);
      break;
    case Ft.TenureChange:
      e.push(Se(t.tenureHash)), e.push(Se(t.previousTenureHash)), e.push(Se(t.burnViewHash)), e.push(Se(t.previousTenureEnd)), e.push(vo(new Uint8Array(4), t.previousTenureBlocks)), e.push(Ak(new Uint8Array(1), t.cause)), e.push(Se(t.publicKeyHash));
      break;
  }
  return He(e);
}
function Y8(t) {
  switch (t.readUInt8Enum(Ft, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ft.TokenTransfer:
      const n = qn(t), r = hn(t.readBytes(8), !1), s = sb(t);
      return R8(n, r, s);
    case Ft.ContractCall:
      const o = vi(t), i = Yn(t), a = Yn(t), c = [], d = t.readUInt32BE();
      for (let v = 0; v < d; v++) {
        const B = qn(t);
        c.push(B);
      }
      return z8(o, i, a, c);
    case Ft.SmartContract:
      const p = Yn(t), u = Yn(t, 4, 1e5);
      return r0(p, u);
    case Ft.VersionedSmartContract: {
      const v = t.readUInt8Enum(dd, (Z) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Z}`);
      }), B = Yn(t), P = Yn(t, 4, 1e5);
      return r0(B, P, v);
    }
    case Ft.PoisonMicroblock:
      return G8();
    case Ft.Coinbase: {
      const v = t.readBytes(co);
      return s0(v);
    }
    case Ft.CoinbaseToAltRecipient: {
      const v = t.readBytes(co), B = qn(t);
      return s0(v, B);
    }
    case Ft.NakamotoCoinbase: {
      const v = t.readBytes(co), B = qn(t), P = t.readBytes(ud);
      return K8(v, B, P);
    }
    case Ft.TenureChange:
      const w = zt(t.readBytes(20)), g = zt(t.readBytes(20)), A = zt(t.readBytes(20)), E = zt(t.readBytes(32)), T = t.readUInt32BE(), O = t.readUInt8Enum(yd, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), H = zt(t.readBytes(20));
      return V8(w, g, A, E, T, O, H);
  }
}
class Ll extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class to extends Ll {
  constructor(e) {
    super(e);
  }
}
class Nn extends Ll {
  constructor(e) {
    super(e);
  }
}
class Kc extends Ll {
  constructor(e) {
    super(e);
  }
}
class io extends Ll {
  constructor(e) {
    super(e);
  }
}
var sr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sr || (sr = {}));
function wd(t) {
  return Vw(zt(t.readBytes($l)));
}
function oi(t, e) {
  return {
    pubKeyEncoding: t,
    type: pt.TransactionAuthField,
    contents: e
  };
}
function q8(t) {
  const e = t.readUInt8Enum(sr, (n) => {
    throw new Nn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case sr.PublicKeyCompressed:
      return oi(ve.Compressed, gd(t));
    case sr.PublicKeyUncompressed:
      return oi(ve.Uncompressed, O8(gd(t).data));
    case sr.SignatureCompressed:
      return oi(ve.Compressed, wd(t));
    case sr.SignatureUncompressed:
      return oi(ve.Uncompressed, wd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function _f(t) {
  return Se(t.data);
}
function X8(t) {
  const e = [];
  switch (t.contents.type) {
    case pt.PublicKey:
      e.push(t.pubKeyEncoding === ve.Compressed ? sr.PublicKeyCompressed : sr.PublicKeyUncompressed), e.push(Gc(H8(t.contents.data)));
      break;
    case pt.MessageSignature:
      e.push(t.pubKeyEncoding === ve.Compressed ? sr.SignatureCompressed : sr.SignatureUncompressed), e.push(_f(t.contents));
      break;
  }
  return He(e);
}
function jr(t) {
  switch (t.type) {
    case pt.Address:
      return $a(t);
    case pt.Principal:
      return rb(t);
    case pt.LengthPrefixedString:
      return ki(t);
    case pt.MemoString:
      return J8(t);
    case pt.AssetInfo:
      return ob(t);
    case pt.PostCondition:
      return t6(t);
    case pt.PublicKey:
      return Gc(t);
    case pt.LengthPrefixedList:
      return Hf(t);
    case pt.Payload:
      return nb(t);
    case pt.TransactionAuthField:
      return X8(t);
    case pt.MessageSignature:
      return _f(t);
  }
}
function W8() {
  return {
    type: pt.Address,
    version: zc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Pf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === he.SerializeP2PKH || e === he.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === he.SerializeP2WPKH || e === he.SerializeP2WSH || e === he.SerializeP2WSHNonSequential) && !r.every(Ni))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case he.SerializeP2PKH:
      return Qi(t, w6(r[0].data));
    case he.SerializeP2WPKH:
      return Qi(t, b6(r[0].data));
    case he.SerializeP2SH:
    case he.SerializeP2SHNonSequential:
      return Qi(t, m6(n, r.map(Gc)));
    case he.SerializeP2WSH:
    case he.SerializeP2WSHNonSequential:
      return Qi(t, x6(n, r.map(Gc)));
  }
}
function $a(t) {
  const e = [];
  return e.push(Se(ka(t.version, 1))), e.push(Se(t.hash160)), He(e);
}
function vi(t) {
  const e = vl(zt(t.readBytes(1))), n = zt(t.readBytes(20));
  return { type: pt.Address, version: e, hash160: n };
}
function rb(t) {
  const e = [];
  return e.push(t.prefix), e.push($a(t.address)), t.prefix === pa.Contract && e.push(ki(t.contractName)), He(e);
}
function Z8(t) {
  const e = t.readUInt8Enum(pa, (s) => {
    throw new Nn(`Unexpected Principal payload type: ${s}`);
  }), n = vi(t);
  if (e === pa.Standard)
    return { type: pt.Principal, prefix: e, address: n };
  const r = Yn(t);
  return {
    type: pt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function ki(t) {
  const e = [], n = Mi(t.content), r = n.byteLength;
  return e.push(Se(ka(r, t.lengthPrefixBytes))), e.push(n), He(e);
}
function Yn(t, e, n) {
  e = e || 1;
  const r = vl(zt(t.readBytes(e))), s = If(t.readBytes(r));
  return ko(s, e, n ?? 128);
}
function Q8(t) {
  return ko(t, 4, 1e5);
}
function o0(t) {
  if (t && lb(t, jc))
    throw new Error(`Memo exceeds maximum length of ${jc} bytes`);
  return { type: pt.MemoString, content: t };
}
function J8(t) {
  const e = [], n = Mi(t.content), r = y6(zt(n), jc * 2);
  return e.push(Se(r)), He(e);
}
function sb(t) {
  let e = If(t.readBytes(jc));
  return e = e.replace(/\u0000*$/, ""), { type: pt.MemoString, content: e };
}
function ob(t) {
  const e = [];
  return e.push($a(t.address)), e.push(ki(t.contractName)), e.push(ki(t.assetName)), He(e);
}
function bd(t) {
  return {
    type: pt.AssetInfo,
    address: vi(t),
    contractName: Yn(t),
    assetName: Yn(t)
  };
}
function Uf(t, e) {
  return {
    type: pt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Hf(t) {
  const e = t.values, n = [];
  n.push(Se(ka(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(jr(r));
  return He(n);
}
function ib(t, e, n) {
  const r = vl(zt(t.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (e) {
      case pt.Address:
        s.push(vi(t));
        break;
      case pt.LengthPrefixedString:
        s.push(Yn(t));
        break;
      case pt.MemoString:
        s.push(sb(t));
        break;
      case pt.AssetInfo:
        s.push(bd(t));
        break;
      case pt.PostCondition:
        s.push(e6(t));
        break;
      case pt.PublicKey:
        s.push(gd(t));
        break;
      case pt.TransactionAuthField:
        s.push(q8(t));
        break;
    }
  return Uf(s, n);
}
function t6(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(rb(t.principal)), (t.conditionType === Sn.Fungible || t.conditionType === Sn.NonFungible) && e.push(ob(t.assetInfo)), t.conditionType === Sn.NonFungible && e.push(_e(t.assetName)), e.push(t.conditionCode), t.conditionType === Sn.STX || t.conditionType === Sn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new to("The post-condition amount may not be larger than 8 bytes");
    e.push(Fs(t.amount, !1, 8));
  }
  return He(e);
}
function e6(t) {
  const e = t.readUInt8Enum(Sn, (i) => {
    throw new Nn(`Could not read ${i} as PostConditionType`);
  }), n = Z8(t);
  let r, s, o;
  switch (e) {
    case Sn.STX:
      return r = t.readUInt8Enum(ha, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${zt(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: Sn.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case Sn.Fungible:
      return s = bd(t), r = t.readUInt8Enum(ha, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${zt(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: Sn.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case Sn.NonFungible:
      s = bd(t);
      const i = qn(t);
      return r = t.readUInt8Enum(fd, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
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
function Tr(t, e) {
  return He([t, e]);
}
function n6(t) {
  return new Uint8Array([t.type]);
}
function r6(t) {
  return t.type === nt.OptionalNone ? new Uint8Array([t.type]) : Tr(t.type, _e(t.value));
}
function s6(t) {
  const e = new Uint8Array(4);
  return vo(e, t.buffer.length, 0), Tr(t.type, kl(e, t.buffer));
}
function o6(t) {
  const e = $f(fk(t.value, BigInt(Ik)), Dw);
  return Tr(t.type, e);
}
function i6(t) {
  const e = $f(t.value, Dw);
  return Tr(t.type, e);
}
function a6(t) {
  return Tr(t.type, $a(t.address));
}
function c6(t) {
  return Tr(t.type, kl($a(t.address), ki(t.contractName)));
}
function l6(t) {
  return Tr(t.type, _e(t.value));
}
function u6(t) {
  const e = [], n = new Uint8Array(4);
  vo(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = _e(r);
    e.push(s);
  }
  return Tr(t.type, He(e));
}
function d6(t) {
  const e = [], n = new Uint8Array(4);
  vo(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ko(s);
    e.push(ki(o));
    const i = _e(t.data[s]);
    e.push(i);
  }
  return Tr(t.type, He(e));
}
function ab(t, e) {
  const n = [], r = e == "ascii" ? Hw(t.data) : Mi(t.data), s = new Uint8Array(4);
  return vo(s, r.length, 0), n.push(s), n.push(r), Tr(t.type, He(n));
}
function f6(t) {
  return ab(t, "ascii");
}
function h6(t) {
  return ab(t, "utf8");
}
function _e(t) {
  switch (t.type) {
    case nt.BoolTrue:
    case nt.BoolFalse:
      return n6(t);
    case nt.OptionalNone:
    case nt.OptionalSome:
      return r6(t);
    case nt.Buffer:
      return s6(t);
    case nt.UInt:
      return i6(t);
    case nt.Int:
      return o6(t);
    case nt.PrincipalStandard:
      return a6(t);
    case nt.PrincipalContract:
      return c6(t);
    case nt.ResponseOk:
    case nt.ResponseErr:
      return l6(t);
    case nt.List:
      return u6(t);
    case nt.Tuple:
      return d6(t);
    case nt.StringASCII:
      return f6(t);
    case nt.StringUTF8:
      return h6(t);
    default:
      throw new to("Unable to serialize. Invalid Clarity Value.");
  }
}
function p6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const i0 = /* @__PURE__ */ new Map();
function cb(t, e) {
  const n = i0.get(t);
  if (n !== void 0)
    return n(e);
  const r = p6(t);
  return i0.set(t, r), cb(t, e);
}
class ra {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return vk(this.readBytes(4), 0);
  }
  readUInt8() {
    return Ek(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return xk(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = zt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = zt(n);
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
    if (cb(e, r))
      return r;
    throw n(r);
  }
}
function qn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ra(Se(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ra(t) : e = t;
  switch (e.readUInt8Enum(nt, (r) => {
    throw new Nn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case nt.Int:
      return C8(e.readBytes(16));
    case nt.UInt:
      return kr(e.readBytes(16));
    case nt.Buffer:
      const r = e.readUInt32BE();
      return Zw(e.readBytes(r));
    case nt.BoolTrue:
      return Xw();
    case nt.BoolFalse:
      return Ww();
    case nt.PrincipalStandard:
      const s = vi(e);
      return k8(s);
    case nt.PrincipalContract:
      const o = vi(e), i = Yn(e);
      return qw(o, i);
    case nt.ResponseOk:
      return B8(qn(e));
    case nt.ResponseErr:
      return T8(qn(e));
    case nt.OptionalNone:
      return Qw();
    case nt.OptionalSome:
      return Jw(qn(e));
    case nt.List:
      const a = e.readUInt32BE(), c = [];
      for (let E = 0; E < a; E++)
        c.push(qn(e));
      return M8(c);
    case nt.Tuple:
      const d = e.readUInt32BE(), p = {};
      for (let E = 0; E < d; E++) {
        const T = Yn(e).content;
        if (T === void 0)
          throw new Nn('"content" is undefined');
        p[T] = qn(e);
      }
      return $o(p);
    case nt.StringASCII:
      const u = e.readUInt32BE(), w = yk(e.readBytes(u));
      return qe(w);
    case nt.StringUTF8:
      const g = e.readUInt32BE(), A = If(e.readBytes(g));
      return N8(A);
    default:
      throw new Nn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const g6 = (t) => t.length % 2 == 0 ? t : `0${t}`, y6 = (t, e) => t.padEnd(e, "0"), lb = (t, e) => t ? Mi(t).length > e : !1;
function md(t) {
  return Ly(t);
}
const ga = (t) => Kk(Mf(t)), Of = (t) => zt(E8(t)), w6 = (t) => zt(ga(t)), b6 = (t) => {
  const e = ga(t), n = kl(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ga(n);
  return zt(r);
}, m6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = ga(r);
  return zt(s);
}, x6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = Mf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = He(o), a = ga(i);
  return zt(a);
};
function S6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function ub(t) {
  const e = _e(t);
  return `0x${zt(e)}`;
}
function E6(t) {
  return qn(t);
}
const ci = (t) => {
  try {
    return No.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Df() {
  return {
    type: pt.MessageSignature,
    data: zt(new Uint8Array($l))
  };
}
function db(t, e, n, r) {
  const s = Pf(0, t, 1, [Ai(e)]).hash160, o = Ni(Ai(e)) ? ve.Compressed : ve.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: hn(n, !1),
    fee: hn(r, !1),
    keyEncoding: o,
    signature: Df()
  };
}
function ya(t) {
  return "signature" in t;
}
function a0(t) {
  return t === he.SerializeP2SH || t === he.SerializeP2WSH;
}
function A6(t) {
  return t === he.SerializeP2SHNonSequential || t === he.SerializeP2WSHNonSequential;
}
function c0(t) {
  const e = md(t);
  return e.nonce = 0, e.fee = 0, ya(e) ? e.signature = Df() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function v6(t) {
  const e = [
    t.hashMode,
    Se(t.signer),
    Fs(t.nonce, !1, 8),
    Fs(t.fee, !1, 8),
    t.keyEncoding,
    _f(t.signature)
  ];
  return He(e);
}
function k6(t) {
  const e = [
    t.hashMode,
    Se(t.signer),
    Fs(t.nonce, !1, 8),
    Fs(t.fee, !1, 8)
  ], n = Uf(t.fields);
  e.push(Hf(n));
  const r = new Uint8Array(2);
  return Sk(r, t.signaturesRequired, 0), e.push(r), He(e);
}
function $6(t, e) {
  const n = zt(e.readBytes(20)), r = BigInt(`0x${zt(e.readBytes(8))}`), s = BigInt(`0x${zt(e.readBytes(8))}`), o = e.readUInt8Enum(ve, (a) => {
    throw new Nn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === he.SerializeP2WPKH && o != ve.Compressed)
    throw new Nn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = wd(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function I6(t, e) {
  const n = zt(e.readBytes(20)), r = BigInt("0x" + zt(e.readBytes(8))), s = BigInt("0x" + zt(e.readBytes(8))), o = ib(e, pt.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const d of o)
    switch (d.contents.type) {
      case pt.PublicKey:
        Ni(d.contents) || (i = !0);
        break;
      case pt.MessageSignature:
        if (d.pubKeyEncoding === ve.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new io("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (i && (t === he.SerializeP2WSH || t === he.SerializeP2WSHNonSequential))
    throw new io("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function su(t) {
  return ya(t) ? v6(t) : k6(t);
}
function ou(t) {
  const e = t.readUInt8Enum(he, (n) => {
    throw new Nn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === he.SerializeP2PKH || e === he.SerializeP2WPKH ? $6(e, t) : I6(e, t);
}
function fb(t, e, n, r) {
  const o = t + zt(new Uint8Array([e])) + zt(Fs(n, !1, 8)) + zt(Fs(r, !1, 8));
  if (Se(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Of(Se(o));
}
function hb(t, e, n) {
  const r = 33 + $l, s = Ni(e) ? ve.Compressed : ve.Uncompressed, o = t + g6(s.toString(16)) + n.data, i = Se(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Of(i);
}
function L6(t, e, n, r, s) {
  const o = fb(t, e, n, r), i = F8(s, o), a = j8(s), c = hb(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function pb(t, e, n, r, s, o) {
  const i = fb(t, e, n, r), a = Ai(_8(i, o, s)), c = hb(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function C6() {
  const t = db(he.SerializeP2PKH, "", 0, 0);
  return t.signer = W8().hash160, t.keyEncoding = ve.Compressed, t.signature = Df(), t;
}
function l0(t, e, n) {
  return ya(t) ? T6(t, e, n) : B6(t, e, n);
}
function T6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = pb(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), o = Pf(0, t.hashMode, 1, [r]).hash160;
  if (o !== t.signer)
    throw new io(`Signer hash does not equal hash of public key(s): ${o} != ${t.signer}`);
  return s;
}
function B6(t, e, n) {
  const r = [];
  let s = e, o = !1, i = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case pt.PublicKey:
        Ni(c.contents) || (o = !0), r.push(c.contents);
        break;
      case pt.MessageSignature:
        c.pubKeyEncoding === ve.Uncompressed && (o = !0);
        const { pubKey: d, nextSigHash: p } = pb(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (a0(t.hashMode) && (s = p), r.push(d), i += 1, i === 65536)
          throw new io("Too many signatures");
        break;
    }
  if (a0(t.hashMode) && i !== t.signaturesRequired || A6(t.hashMode) && i < t.signaturesRequired)
    throw new io("Incorrect number of signatures");
  if (o && (t.hashMode === he.SerializeP2WSH || t.hashMode === he.SerializeP2WSHNonSequential))
    throw new io("Uncompressed keys are not allowed in this hash mode");
  const a = Pf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new io(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function gb(t) {
  return {
    authType: Te.Standard,
    spendingCondition: t
  };
}
function yb(t, e) {
  return {
    authType: Te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || db(he.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function u0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Te.Standard:
        return gb(c0(t.spendingCondition));
      case Te.Sponsored:
        return yb(c0(t.spendingCondition), C6());
      default:
        throw new Kc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function M6(t, e) {
  switch (t.authType) {
    case Te.Standard:
      return l0(t.spendingCondition, e, Te.Standard);
    case Te.Sponsored:
      return l0(t.spendingCondition, e, Te.Standard);
    default:
      throw new Kc("Invalid origin auth type");
  }
}
function N6(t, e) {
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
function _6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: hn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function P6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: hn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function U6(t, e) {
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
function H6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Te.Standard:
      e.push(su(t.spendingCondition));
      break;
    case Te.Sponsored:
      e.push(su(t.spendingCondition)), e.push(su(t.sponsorSpendingCondition));
      break;
  }
  return He(e);
}
function O6(t) {
  const e = t.readUInt8Enum(Te, (r) => {
    throw new Nn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Te.Standard:
      return n = ou(t), gb(n);
    case Te.Sponsored:
      n = ou(t);
      const r = ou(t);
      return yb(n, r);
  }
}
class D6 {
  constructor(e, n, r, s, o, i, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: hn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? kk, this.postConditionMode = o ?? Ei.Deny, this.postConditions = s ?? Uf([]), i)
      this.anchorMode = Tk(i);
    else
      switch (r.payloadType) {
        case Ft.Coinbase:
        case Ft.CoinbaseToAltRecipient:
        case Ft.NakamotoCoinbase:
        case Ft.PoisonMicroblock:
        case Ft.TenureChange:
          this.anchorMode = xn.OnChainOnly;
          break;
        case Ft.ContractCall:
        case Ft.SmartContract:
        case Ft.VersionedSmartContract:
        case Ft.TokenTransfer:
          this.anchorMode = xn.Any;
          break;
      }
  }
  signBegin() {
    const e = md(this);
    return e.auth = u0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = md(this);
    return e.auth = u0(e.auth), e.txid();
  }
  verifyOrigin() {
    return M6(this.auth, this.verifyBegin());
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
    if (n && !ya(n)) {
      const r = Ni(e);
      n.fields.push(oi(r ? ve.Compressed : ve.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: o, nextSigHash: i } = L6(n, r, e.fee, e.nonce, s);
    return ya(e) ? e.signature = o : e.fields.push(oi(s.data.byteLength === Ow ? ve.Compressed : ve.Uncompressed, o)), i;
  }
  txid() {
    const e = this.serialize();
    return Of(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Kc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = U6(this.auth, e);
  }
  setFee(e) {
    this.auth = N6(this.auth, e);
  }
  setNonce(e) {
    this.auth = _6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Kc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = P6(this.auth, e);
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
    return vo(n, this.chainId, 0), e.push(n), e.push(H6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Hf(this.postConditions)), e.push(nb(this.payload)), He(e);
  }
}
function ii(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ra(Se(t.slice(2))) : e = new ra(Se(t)) : t instanceof Uint8Array ? e = new ra(t) : e = t;
  const n = e.readUInt8Enum(Rc, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = O6(e), o = e.readUInt8Enum(xn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), i = e.readUInt8Enum(Ei, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = ib(e, pt.PostCondition), c = Y8(e);
  return new D6(n, s, c, a, i, o, r);
}
const F6 = I8, sa = kr, j6 = Zw;
const R6 = /* @__PURE__ */ new Set([4001, -31001]), z6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], G6 = ["result", "data", "payload", "response", "params"], d0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Cl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ho = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, qr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, K6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), wb = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => K6(o, r)) === s
  );
}, bb = (t) => t ? wb(Ho()).some(
  (e) => {
    var n;
    return e.id === t && (Cl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, mb = () => {
  if (typeof window > "u")
    return;
  const t = Ho(), e = wb(t).filter(
    (n) => {
      var r;
      return Cl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = qr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of z6) {
    const r = qr(t, n) ?? (t === window ? void 0 : qr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, V6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ho(), n = qr(e, t) ?? (e === window ? void 0 : qr(window, t)) ?? gl(t);
  if (n)
    return n;
  if (Cl(t) || bb(t))
    return mb();
}, sc = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Y6 = ["blockstack-session", "blockstack"], q6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Y6) {
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
const xb = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Mn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, X6 = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = xb(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, W6 = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = xb(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, xd = (t, e = "mainnet") => {
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
      return xd(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return xd(r, e);
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
}, wa = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ci(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const o = wa(s, e + 1);
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
    const o = wa(n[s], e + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && ci(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ci(n.testnet) ? n.testnet.trim() : null;
}, f0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Sb = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && R6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Io = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Mn(n == null ? void 0 : n.message) ?? Mn(e.message) ?? Mn(e.error) ?? Mn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, $i = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Io(e);
    if (e.status === "error")
      throw Io(e.result ?? e);
  }
  return t;
}, h0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return $i(r);
  } catch (r) {
    throw Io(r);
  }
}, Eb = () => mb(), Ff = () => {
  if (typeof window > "u")
    return;
  const t = Ho();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = qr(t, e) ?? (t === window ? void 0 : qr(window, e));
    if (n)
      return n;
  }
}, p0 = () => {
  if (typeof window > "u")
    return;
  const t = Ff();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ho();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = qr(e, n) ?? (e === window ? void 0 : qr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, xc = (t) => {
  var r, s;
  const e = wo();
  if (Cl(e) || bb(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ho() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Eb();
}, iu = (t) => {
  const e = W6(t);
  if (!e)
    return null;
  try {
    const n = ii(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Vc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = iu(t), r = X6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Mn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Vc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let o = null;
  for (const a of d0)
    if (iu(s[a])) {
      o = Mn(s[a]);
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
  for (const a of d0) {
    const c = iu(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Mn(s[a]) ?? void 0
      };
  }
  for (const a of G6) {
    const c = s[a], d = Vc(c, e + 1);
    if (d)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...d,
        txId: d.txId,
        txid: d.txid ?? d.txId
      };
  }
  return null;
}, au = (t) => {
  const e = Vc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Z6 = (t) => {
  const e = Vc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, Q6 = (t) => ({
  ...t,
  fee: lo(t.fee),
  nonce: lo(t.nonce),
  sponsored: t.sponsored === !0
}), g0 = (t) => ({
  recipient: t.recipient,
  amount: lo(t.amount) ?? "0",
  memo: t.memo,
  network: xd(t.network),
  address: t.stxAddress,
  fee: lo(t.fee),
  nonce: lo(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ab = "WALLET_ADDRESS_MISMATCH", J6 = 45e3;
let oa = null;
const Sd = (t) => {
  t && (oa = { address: t, at: Date.now() });
}, t5 = () => {
  oa = null;
}, e5 = () => oa && Date.now() - oa.at <= J6 ? oa.address : null, n5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, r5 = async (t) => {
  t5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = $i(await t.request("wallet_connect")), n = wa(e);
  return Sd(n), n;
}, s5 = async (t, e, n, r) => {
  try {
    return $i(await t.request(e, n));
  } catch (s) {
    const o = Io(s);
    if (!n5(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: o.message
    });
    let i = null;
    try {
      i = await r5(t);
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
        { code: i ? Ab : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: i });
    try {
      return $i(await t.request(e, n));
    } catch (a) {
      throw Io(a);
    }
  }
};
let y0 = 3e4;
const o5 = (t, e) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${y0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, y0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, i5 = async (t, e, n) => {
  const r = (c, d) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${d}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ab }
      );
    return c;
  }, s = e5();
  if (s)
    return sc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  sc(n, "account-read");
  try {
    const c = $i(
      await o5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = wa(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Sb(c))
      throw Io(c);
    sc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return Sd(o), r(o, "wallet_getAccount");
  let i;
  sc(n, "account-reconnect");
  try {
    i = $i(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Io(c);
  }
  const a = wa(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Sd(a), r(a, "wallet_connect");
}, a5 = async (t, e) => {
  if (!xc(t)) {
    const o = await h0(
      t,
      "stx_transferStx",
      g0(e)
    );
    return au(o);
  }
  const n = Ff();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await h0(
      n,
      "stx_transferStx",
      g0(e)
    );
    return au(o);
  }
  const r = Eb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await i5(r, e.stxAddress);
  const s = await s5(
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
  return au(s);
}, c5 = () => wo(), vb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = wo(), e = t ? V6(t) : void 0;
  if (e)
    return e;
  const n = Ho() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, w0 = (t, e) => {
  const n = vb(), r = Q6({
    ...t,
    onFinish: (s) => {
      var o;
      (o = t.onFinish) == null || o.call(t, Z6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return tc(r, e);
  if (xc(n) && !Ff()) {
    const s = p0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: wo(),
        route: "legacy-transaction-request"
      }), tc(r, s);
  }
  return void a5(n, t).then((s) => {
    var o;
    (o = t.onFinish) == null || o.call(t, s);
  }).catch((s) => {
    var o, i;
    if (f0(s) && xc(n)) {
      const a = p0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: wo(),
          route: "legacy-transaction-request"
        }), tc(r, a);
        return;
      }
    }
    if (f0(s) && !xc(n)) {
      tc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Sb(s)) {
      (o = t.onCancel) == null || o.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (i = t.onCancel) == null || i.call(t);
  });
}, l5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), b0 = (t) => ub(t).replace(/^0x/, ""), m0 = "This wallet cannot sign messages. Try Xverse or Leather.", x0 = (t) => typeof (t == null ? void 0 : t.request) == "function", S0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", u5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, d5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function f5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: b0(e.message),
    domain: b0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function h5(t, e) {
  const n = await ok({
    domain: e.domain,
    message: e.message,
    network: Al(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? l5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function E0(t) {
  var s, o;
  const e = c5() || "", n = /xverse/i.test(e);
  let r = vb();
  if (n && !S0(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (S0(r))
    try {
      return await h5(r, t);
    } catch (i) {
      if (n || !x0(r) || !d5(i)) throw i;
    }
  if (!n && x0(r))
    try {
      return await f5(r, t);
    } catch (i) {
      throw u5(i) ? new Error(m0) : i;
    }
  throw new Error(m0);
}
const A0 = 1000000n, Gr = 1000000n, Yc = 50n, Pe = 3000n, cr = 300n, Vi = 3000n, p5 = 50000n, cu = 200n, Tl = 15000n, rn = (t) => t + Yc;
function er(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / A0}.${(n % A0).toString().padStart(6, "0")}`;
}
function v0(t, e = cr) {
  return t <= Pe ? 0 : Number((t - Pe) / rn(e));
}
function lu(t, e = 0n) {
  const n = Gr - t - e;
  return n > 0n ? n : 0n;
}
function g5(t, e = cr) {
  return t > Gr ? "over" : t < Pe + rn(e) ? "empty" : t < p5 ? "low" : "ok";
}
const y5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", w5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", b5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function m5(t) {
  var n, r, s, o;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = e["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || b5.some((i, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== y5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const kb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", uu = 3, x5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", S5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", k0 = 1, [Ed, $b] = kb.split("."), Gn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Ad(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function E5(t) {
  return Gn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Os(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ib(t, e = []) {
  const n = await Os(`/v2/contracts/call-read/${Ed}/${$b}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Ed, arguments: e.map((r) => "0x" + Gn(_e(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return rr(qn(n.result));
}
async function A5() {
  const t = await Os(`/v2/contracts/source/${Ed}/${$b}?proof=0`);
  if (typeof t.source != "string" || await E5(t.source) !== w5) throw Error("Deployed source does not match the tested helper.");
  if (m5(await Ib("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Lb(t) {
  return t.startsWith("SP") && ci(t) && !t.includes(".");
}
async function v5(t) {
  var r;
  if (!Lb(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Os(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Os(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function k5(t) {
  const e = await Os(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function $5(t, e) {
  var s, o;
  const n = await Ib("get-owner", [sa(t), sa(e)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Lb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function I5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Ad(t), signal: AbortSignal.timeout(15e3) });
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
async function L5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function C5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = ii(Ad(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || si(Qi(zc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const o = e.postConditions.values[0];
    if (r.payloadType !== 2 || si(r.contractAddress) + "." + r.contractName.content !== kb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Gn(_e(r.functionArgs[0])) !== Gn(_e(sa(t.core))) || Gn(_e(r.functionArgs[1])) !== Gn(_e(sa(t.song))) || Gn(_e(r.functionArgs[2])) !== Gn(_e(j6(Ad(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ei.Deny || e.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== ha.Equal || o.principal.prefix !== 2 || si(o.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || si(r.contractAddress) + "." + r.contractName.content !== x5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Gn(_e(r.functionArgs[0])) !== Gn(_e(sa(t.song))) || typeof t.liked != "boolean" || Gn(_e(r.functionArgs[1])) !== Gn(_e(F6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ei.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || rr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const T5 = "xtrata.xyz/radio/listening-wallet", B5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Sr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ci(t), M5 = (t) => ({
  domain: $o({ name: qe(T5), version: qe("1"), "chain-id": kr(1) }),
  message: $o({
    purpose: qe(B5),
    main: qe(t.main),
    listening: qe(t.listening),
    issued: kr(t.issued)
  })
}), Cb = 100000n, N5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function _5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Sr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Cb).sort(N5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const oc = 50;
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
async function P5(t, e, n = 4) {
  if (!Sr(t)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${t}/stx_inbound?limit=${oc}&offset=${i}`, s = qc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - oc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= oc ? s : qc(await e(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = _5(a.transfers, t);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - oc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Dr = 50, U5 = 6, H5 = 20, $0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function I0(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const o of n.results) {
    const i = o && typeof o == "object" && o.tx && typeof o.tx == "object" ? o.tx : o;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (s.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== e || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), d = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(d)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: d });
  }
  return { total: n.total, sent: r, rows: s };
}
async function O5(t, e, n) {
  if (!Sr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = qc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Dr}&offset=0`));
    if (!s || s.total > U5 * Dr) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = Dr; i < s.total; i += Dr) {
      const a = qc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Dr}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (d) => `/extended/v1/address/${t}/transactions?limit=${Dr}&offset=${d}`, a = I0(await e(i(0)), t);
      if (!a || a.total > H5 * Dr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const d of a.sent) o.set(d.txId, d);
      for (let d = Dr; d < a.total; d += Dr) {
        const p = I0(await e(i(d)), t);
        if (!p || !p.rows.length) return { ok: !1 };
        for (const u of p.rows) c.add(u);
        for (const u of p.sent) o.set(u.txId, u);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...o.values()] };
  } catch {
    return { ok: !1 };
  }
}
function D5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((u) => u && typeof u.sender == "string" && u.sender !== e && /^\d+$/.test(u.amount) && BigInt(u.amount) > 0n).sort($0).map((u, w) => {
    const g = BigInt(u.amount);
    return r && u.sender === r.sender ? { sender: u.sender, left: g, kind: "gift", to: r.payer, at: w } : Sr(u.sender) && g >= Cb ? { sender: u.sender, left: g, kind: "deposit", to: u.sender, at: w } : { sender: u.sender, left: g, kind: "dust", to: null, at: w };
  }), o = s.reduce((u, w) => u + w.left, 0n), i = [...t.outgoing].filter((u) => u && u.recipient !== e && Sr(u.recipient) && u.amount > 0n).sort($0), a = i.reduce((u, w) => u + w.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const d = (u, w) => {
    let g = w;
    for (const A of u) {
      if (g <= 0n) break;
      const E = A.left < g ? A.left : g;
      A.left -= E, g -= E;
    }
    return g;
  };
  for (const u of i) {
    const w = d(s.filter((g) => g.to === u.recipient), u.amount);
    w > 0n && d(s, w);
  }
  if (d(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((u, w) => u + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const p = /* @__PURE__ */ new Map();
  for (const u of s) {
    if (u.left <= 0n) continue;
    const w = `${u.kind}:${u.to ?? ""}`, g = p.get(w);
    g ? (g.amount += u.left, g.newest = Math.max(g.newest, u.at)) : p.set(w, { to: u.to, kind: u.kind, amount: u.left, newest: u.at });
  }
  return {
    ok: !0,
    parts: [...p.values()].sort((u, w) => u.newest - w.newest),
    hasTopUp: s.some((u) => u.kind === "deposit")
  };
}
function F5(t, e) {
  const n = t.filter((d) => d.kind === "deposit").sort((d, p) => d.newest - p.newest), r = t.find((d) => d.kind === "gift"), s = t.filter((d) => d.kind === "dust"), o = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((d, p) => d + p.amount, 0n), i = [], a = [], c = o > e;
  return n.forEach((d, p) => {
    if (d.amount <= e) {
      a.push(d);
      return;
    }
    const u = p === n.length - 1 && !c;
    i.push({ to: d.to, kind: "deposit", mode: u ? "all" : "amount", send: d.amount - e });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: o - e }) : (r && a.push(r), a.push(...s)), { steps: i, tooSmall: a };
}
function L0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const ic = 1500n, Sc = [100, 250, 500], j5 = (t, e) => BigInt(t) * rn(e), Yi = ["prepared", "signed", "unknown", "pending"], R5 = 30 * 6e4, Xc = 6e4, Wo = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, z5 = 3e3, Wc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", du = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function G5(t) {
  let e = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, d = null, p = !1, u = !1, w = !1, g = null, A = !1, E = "", T = "", O = 0, H, v = null, B, P = [], Z, it = -1 / 0;
  const tt = /* @__PURE__ */ new Set();
  let K = null, b = !1, I = 0, M = null, N = null, V = !1, z = null, mt = !1, dt = null, Kt = !1, L = !1, F = !1, ut = !1, Et = !1, wt = 0, $t = null, ke = Promise.resolve();
  const Lt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? cr.toString()), Bt = (f) => !!o && !(o.features ?? []).includes(f), bt = (f, S) => `xtrata.ppp.v1.${f}:${S}`, Hn = "xtrata.ppp.v1.as-main", Ke = () => {
    if (t.main()) return;
    const f = t.store.get(Hn);
    return f && Sr(f) ? f : void 0;
  }, Mt = () => t.main() ?? Ke(), pn = (f = o == null ? void 0 : o.address) => {
    if (!f) return [];
    try {
      const S = JSON.parse(t.store.get(bt("entries", f)) || "[]");
      return Array.isArray(S) ? S : [];
    } catch {
      return [];
    }
  }, ne = (f) => {
    const S = [f, ...pn(f.address).filter((C) => !(C.txid === f.txid && C.kind === f.kind))].slice(0, 200);
    t.store.set(bt("entries", f.address), JSON.stringify(S));
  }, gn = (f = o == null ? void 0 : o.address) => !!f && t.store.get(bt("on", f)) !== "0", An = (f) => {
    o != null && o.address && t.store.set(bt("on", o.address), f ? "1" : "0");
  }, ye = () => pn().filter((f) => Yi.includes(f.status)), We = () => we() ? [...ye(), ...pn(pe()).filter((f) => Yi.includes(f.status))] : ye(), Re = () => Ze(o == null ? void 0 : o.address), Ze = (f) => {
    if (!f) return null;
    try {
      return JSON.parse(t.store.get(bt("deposit", f)) || "null");
    } catch {
      return null;
    }
  }, Dt = (f, S = o == null ? void 0 : o.address) => {
    S && t.store.set(bt("deposit", S), JSON.stringify(f));
  };
  let re = null;
  const Qe = (f = Xc) => {
    const S = t.now();
    re = { since: re && S < re.until ? re.since : S, until: Math.max((re == null ? void 0 : re.until) ?? 0, S + f) };
  }, ze = () => !!re && t.now() < re.until && (i === void 0 || i < Pe + rn(Lt())), Me = () => !!Re() || ze(), pe = () => Bt("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), we = () => !!(o != null && o.address) && pe() !== o.address, Xn = () => we() ? c && c.for === pe() ? c.value : void 0 : i, lr = (f) => f !== void 0 && f < Pe + cu, $ = () => ye().filter((f) => t.now() - f.created > R5 && tt.has(f.txid)), G = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Mt() || r === Mt() && !e.allowed), j = () => G() && !(o != null && o.linked), Y = () => {
    const f = Mt();
    return !j() && !!f && !!(o != null && o.linked) && o.linked !== f;
  }, ht = (f) => bt("return-to", f), At = (f = o == null ? void 0 : o.address) => {
    if (!f) return;
    const S = t.store.get(ht(f));
    return S && Sr(S) && S !== f ? S : void 0;
  }, se = (f = o == null ? void 0 : o.address) => K && K.for === f ? K.res : null;
  function be() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const f = At();
    if (f) return { to: f, kind: "chosen" };
    const S = se();
    if (S != null && S.ok && S.funder) return { to: S.funder, kind: "funder" };
  }
  const Rt = (f) => bt("gift", f);
  function k() {
    const f = o == null ? void 0 : o.address;
    if (!f) return null;
    if ((z == null ? void 0 : z.for) === f) return z.info;
    try {
      const S = JSON.parse(t.store.get(Rt(f)) || "null");
      return S && typeof S.returnTo == "string" && typeof S.treasury == "string" ? S : null;
    } catch {
      return null;
    }
  }
  const at = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let vt = null, Nt = null, xt = !1;
  const qt = (f) => bt("award-claim", f), ue = (f) => bt("award-send", f), $e = (f) => {
    try {
      const S = JSON.parse(t.store.get(ue(f)) || "null");
      return S && typeof S.txid == "string" && t.now() - S.at < 2 * 36e5 ? S : null;
    } catch {
      return null;
    }
  }, te = (f) => {
    try {
      const S = JSON.parse(t.store.get(qt(f)) || "null");
      return S && typeof S.txid == "string" && t.now() - S.at < 2 * 36e5 ? S : null;
    } catch {
      return null;
    }
  };
  async function vn(f = !1) {
    const S = at();
    if (!S || !t.awardStatus || xt) return;
    const C = (vt == null ? void 0 : vt.for) === S ? vt : null, U = C == null ? void 0 : C.view.state, J = C ? U === "off" || U === "not-a-player" ? 30 * 6e4 : te(S) || $e(S) ? 2e4 : U === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(C && !f && t.now() - C.at < J)) {
      xt = !0;
      try {
        const D = await t.awardStatus(S);
        if (vt = { for: S, view: D, at: t.now() }, D.state === "claimed" && t.store.set(qt(S), ""), D.state === "claimed" && D.holds === !1 && t.store.set(ue(S), ""), D.state === "ready" && t.awardName && (Nt == null ? void 0 : Nt.for) !== S)
          try {
            Nt = { for: S, name: await t.awardName(S), at: t.now() };
          } catch {
            Nt = { for: S, name: void 0, at: t.now() };
          }
      } catch {
        vt = { for: S, view: C && C.view.state !== "off" && C.view.state !== "not-a-player" ? { ...C.view, state: "unavailable" } : { state: "unavailable" }, at: t.now() };
      } finally {
        xt = !1;
      }
    }
  }
  function Ct() {
    const f = at();
    if (!f || (vt == null ? void 0 : vt.for) !== f) return null;
    const S = vt.view;
    if (S.state === "off" || S.state === "not-a-player") return null;
    const C = S.state === "claimed" ? null : te(f), U = S.state === "claimed" && S.holds !== !1 ? $e(f) : null;
    return { ...S, ...(Nt == null ? void 0 : Nt.for) === f ? { name: Nt.name } : {}, ...C ? { claimTx: C.txid } : {}, ...U ? { sendTx: U.txid } : {} };
  }
  async function Br() {
    var J;
    const f = o == null ? void 0 : o.address;
    if (!f || !t.giftInfo || !((J = e == null ? void 0 : e.gifts) != null && J.enabled) || mt) return;
    const S = (z == null ? void 0 : z.for) === f ? z : null, C = S ? S.ok ? S.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (S && t.now() - S.at < C) return;
    mt = !0;
    const U = k();
    try {
      const D = await t.giftInfo(f);
      z = { for: f, info: D, ok: !0, at: t.now() }, t.store.set(Rt(f), JSON.stringify(D));
    } catch {
      z = { for: f, info: U, ok: !1, at: t.now() };
    } finally {
      mt = !1;
    }
  }
  const On = () => pn().reduce((f, S) => Yi.includes(S.status) ? f + BigInt(S.amount || "0") + BigInt(S.fee || "0") : f, 0n);
  function Qr() {
    if (i === void 0) return 0;
    const f = i - On() - BigInt(de.length) * rn(Lt());
    return f > 0n ? v0(f, Lt()) : 0;
  }
  const Rs = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Mr = "EMPTY — ADD STX TO PLAY";
  function zs() {
    if (!(e != null && e.here)) return null;
    const f = (S, C) => ({ reason: S, text: C });
    switch (on()) {
      case "connect":
      case "wrong-wallet":
        return f("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return f("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return f("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return f("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return f("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return f("locked", "UNLOCK TO LISTEN");
      case "link":
        return f("link", "FINISH SETUP TO LISTEN");
      case "over":
        return f("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Me() ? f("arriving", "YOUR PLAYS ARE ARRIVING") : f("out", we() ? Rs : Mr);
      case "ready":
        return !gn() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= t.now() ? f("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : F ? Qr() < 1 ? f("out", we() ? Rs : Mr) : null : f("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Jr = () => {
    var f;
    return !!(o != null && o.address) && we() && !!((f = k()) != null && f.player);
  };
  function yn() {
    return Jr() ? { locked: !0, known: !0 } : null;
  }
  const Oo = 3 * 6e4, _i = () => !!k() && !!t.history && !(o != null && o.linked);
  async function kn() {
    const f = o.address, S = k(), { balance: C, nonce: U } = await t.chain.account(f), J = await t.history(f, !0);
    if (!J.ok) return null;
    const D = D5({ self: f, balance: C, inbound: J.inbound, outgoing: J.outgoing, gift: { sender: S.treasury, payer: S.returnTo } });
    if (!D.ok) return null;
    const Q = F5(D.parts, Vi);
    return { balance: C, nonce: U, parts: D.parts, steps: Q.steps, tooSmall: Q.tooSmall.length };
  }
  const $n = () => Kt ? { state: "unavailable" } : !dt || t.now() - dt.at > Oo || i !== void 0 && i !== dt.balance ? { state: "none" } : dt.plan;
  function on() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const f = Mt();
    if (!j()) {
      if (!f) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : Y() ? "wrong-wallet" : o.state === "known" ? "locked" : !j() && o.linked !== f ? "link" : i === void 0 ? "loading" : i > Gr && !o.backedUp ? "over" : i < Pe + rn(Lt()) ? "fund" : "ready" : "loading";
  }
  const an = () => {
    var f, S, C, U, J;
    return {
      step: on(),
      busy: d,
      message: E,
      error: T,
      notice: Do(),
      gate: e,
      main: Mt(),
      mainConnected: !!t.main(),
      standIn: Ke(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: Ct(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.phrase),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((D) => D === "over" && (o != null && o.backedUp) ? "ok" : D)(g5(i, Lt())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > Gr && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : v0(i, Lt()),
      allowance: i === void 0 ? Gr : lu(i, BigInt(((f = Re()) == null ? void 0 : f.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: gn(),
      entries: pn(),
      depositTxid: ((S = Re()) == null ? void 0 : S.txid) ?? H,
      depositPending: Me(),
      arrival: Me() ? { since: ((C = Re()) == null ? void 0 : C.at) ?? (re == null ? void 0 : re.since) ?? t.now(), graceMs: Xc } : null,
      walletOutdated: Bt("like"),
      linkedListening: Z && Z === Mt() ? P.map((D) => D.listening) : [],
      serverLinked: !!v && B === `${Mt()}:${o == null ? void 0 : o.address}`,
      stuck: $().length,
      armed: ut,
      queued: de.length,
      solo: j(),
      returnTo: (U = be()) == null ? void 0 : U.to,
      returnToKind: (J = be()) == null ? void 0 : J.kind,
      funderState: (() => {
        const D = se();
        return D ? D.ok ? D.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const D = se();
        return !!D && D.ok && D.distinct > 1;
      })(),
      walletCannotSolo: j() && Bt("standalone"),
      walletCannotMulti: Bt("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((D) => D !== Mt() && D !== (o == null ? void 0 : o.linked)),
      creditedTo: j() && (o != null && o.address) && (M == null ? void 0 : M.for) === o.address && M.main ? M.main : void 0,
      createdHere: !!(o != null && o.address) && t.store.get(bt("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (N == null ? void 0 : N.for) === o.address && N.unused,
      gift: (() => {
        const D = k();
        return D ? { player: D.player, from: D.from, source: D.source, amount: D.amount, ...D.drop !== void 0 ? { drop: D.drop } : {} } : null;
      })(),
      giftPlays: k() ? Qr() : 0,
      playCost: rn(Lt()),
      giftStop: zs(),
      albumLock: yn(),
      returnPlan: $n(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Bt("slots"),
      likeFunds: (() => {
        var q;
        const D = pe();
        if (!D || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const Q = Xn();
        return { address: D, balance: Q, low: lr(Q), album: we(), pending: !!Ze(D), txid: (q = Ze(D)) == null ? void 0 : q.txid, main: Mt() };
      })()
    };
  }, Do = () => O ? O < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Gt = (f, S = "") => {
    E = f, T = S, t.changed();
  };
  async function Ne(f, S) {
    if (!d) {
      d = f, T = "", t.changed();
      try {
        await S();
      } catch (C) {
        const U = C instanceof Error ? C.message : String(C);
        T = /Cancelled in the listening wallet/.test(U) ? "" : U, T || (E = "Not now. Nothing was signed.", Et = !0);
      } finally {
        d = null, await In(!0);
      }
    }
  }
  const ur = () => !!(e != null && e.enabled) && e.here && (j() || !!Mt() && e.allowed), Gs = () => ur() && !Y(), Wn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ie = () => {
    if (Y()) throw new Error(Wn());
  };
  async function wn() {
    if (!ur()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const bn = (f) => {
    const S = Mt();
    return f.request("listening.status", S ? { main: S } : void 0);
  };
  async function Ks(f = !1) {
    o != null && o.address && (!f && t.now() - a < 3e4 || (i = await t.chain.balance(o.address), a = t.now(), await Vs(f)));
  }
  async function Vs(f = !1) {
    const S = pe();
    if (!(!we() || !S || (o == null ? void 0 : o.state) !== "unlocked") && !(!f && (c == null ? void 0 : c.for) === S && t.now() - c.at < 3e4))
      try {
        c = { for: S, value: await t.chain.balance(S), at: t.now() };
      } catch {
      }
  }
  async function Ys(f) {
    if ((Z !== f || t.now() - it >= 6e4) && (P = await t.links(f), Z = f, it = t.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === f) return;
    const S = `${f}:${o.address}`;
    B === S && v || (v = P.find((C) => C.listening === o.address) ?? null, B = S);
  }
  async function ts() {
    const f = o == null ? void 0 : o.address;
    if (!j() || !f || o != null && o.linked || !t.funder || b || !i || i <= 0n) return;
    const S = se(f);
    if (S != null && S.ok && S.funder) return;
    const C = S != null && S.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(K && K.for === f && t.now() - K.at < C)) {
      b = !0;
      try {
        K = { for: f, res: await t.funder(f), at: t.now() };
      } catch {
        K = { for: f, res: { ok: !1 }, at: t.now() };
      } finally {
        b = !1;
      }
      I = K.res.ok ? 0 : I + 1;
    }
  }
  async function es() {
    const f = o == null ? void 0 : o.address;
    if (!(!j() || !f || o != null && o.linked || !t.mainOf || V) && !(M && M.for === f && (M.ok || t.now() - M.at < 6e4))) {
      V = !0;
      try {
        M = { for: f, main: await t.mainOf(f), ok: !0, at: t.now() };
      } catch {
        M = { for: f, main: null, ok: !1, at: t.now() };
      } finally {
        V = !1;
      }
    }
  }
  async function Pi() {
    const f = o == null ? void 0 : o.address;
    if (!(!f || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (N == null ? void 0 : N.for) === f) && t.store.get(bt("created", f)) !== "1")
      try {
        N = { for: f, unused: await t.chain.confirmedNonce(f) === 0n };
      } catch {
      }
  }
  async function ns() {
    var J;
    const f = o == null ? void 0 : o.address;
    if (!f) return !1;
    let S, C = !1;
    const U = /* @__PURE__ */ new Map();
    for (const D of We())
      try {
        const Q = await t.chain.transaction(D.txid);
        if (!Q) {
          if (tt.add(D.txid), t.now() - D.created > 15 * 6e4 && !U.has(D.address) && U.set(D.address, await t.chain.confirmedNonce(D.address)), S = U.get(D.address), S !== void 0 && S > BigInt(D.nonce)) {
            ne({ ...D, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((D.status === "unknown" || D.status === "signed") && D.raw)
            try {
              await t.chain.broadcast(D.raw, D.txid), ne({ ...D, status: "pending" });
            } catch (X) {
              Wo(X) && ne({ ...D, status: "failed", note: X.message, raw: void 0 });
            }
          continue;
        }
        tt.delete(D.txid);
        const q = String(Q.tx_status);
        if (q === "success" && Q.canonical !== !1 && Q.is_unanchored === !1) {
          if (ne({ ...D, status: "confirmed", confirmedAt: t.now(), actualFee: String(Q.fee_rate ?? D.fee), raw: void 0 }), C = !0, D.kind === "like" && (A = !0, D.status !== "confirmed" && typeof D.liked == "boolean"))
            try {
              (J = t.likeConfirmed) == null || J.call(t, D.song, D.liked);
            } catch {
            }
        } else q.startsWith("abort_") || q.startsWith("dropped_") ? ne({ ...D, status: "failed", note: q, raw: void 0 }) : D.status !== "pending" && ne({ ...D, status: "pending" });
      } catch {
      }
    for (const D of we() ? [f, pe()] : [f]) {
      const Q = Ze(D);
      if (Q)
        try {
          const q = await t.chain.transaction(Q.txid), X = String((q == null ? void 0 : q.tx_status) ?? "");
          (X === "success" && q.is_unanchored === !1 || X.startsWith("abort_") || X.startsWith("dropped_") || !q && t.now() - Q.at > 2 * 36e5) && (Dt(null, D), X === "success" && Qe(2e4), a = -1 / 0, c = null, /on its way/i.test(E) && (E = ""));
        } catch {
        }
    }
    return C;
  }
  async function In(f = !1) {
    var S;
    try {
      const C = Mt();
      if ((f || !e || r !== C || t.now() - n > 3e5) && (e = await t.config(C), n = t.now(), r = C), !e.enabled || !e.here || !j() && (!C || !e.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), ut && Nr(), t.changed();
        return;
      }
      await wn(), o = await bn(s), Y() && o.state === "unlocked" && (Hr(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await bn(s)), C && e.allowed && await Ys(C), await Ks(f), await ts(), await es(), await Pi(), await Br(), await vn(), await ns() && await Ks(!0), await Vs(), await Go(), O = 0;
    } catch {
      O++;
    }
    if (on() === "locked" ? Ui() : ut && Nr(), A) {
      A = !1;
      try {
        (S = t.likesChanged) == null || S.call(t);
      } catch {
      }
    }
    t.changed(), de.length && !Ur && os();
  }
  async function Fo(f) {
    const S = o == null ? void 0 : o.root;
    if (!S || o != null && o.slot || !(o != null && o.address) || Bt("slots")) return;
    const C = Number(t.store.get(bt("slot", S)));
    if (!(!Number.isSafeInteger(C) || C < 1))
      try {
        const { balance: U } = await t.chain.account(o.address);
        if (U >= Pe + rn(Lt())) return;
        await f.request("listening.openSlot", { slot: C }), o = await bn(f), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function qs(f, S) {
    var D;
    Ie();
    const C = !(o != null && o.address) || gn(o.address), U = o != null && o.linked ? (D = t.nameOf) == null ? void 0 : D.call(t, o.linked) : void 0;
    await f.request("listening.unlock", { mode: "unlock", terms: C ? rs() : void 0, anyPasskey: S, ...Mt() ? { main: Mt() } : {}, ...U ? { label: U } : {} }), o = await bn(f), C && (gn(o.address) ? await Dn() : await f.request("listening.stop")), await Fo(f), Gt(C ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const J = g;
    g = null, J && t.now() - J.at < 12e4 && setTimeout(() => void In(!0).then(() => y(J)), 0);
  }
  function Ui() {
    ut || d || Et || wt >= 3 || !s || !(o != null && o.address) || (ut = !0, ke = (async () => {
      try {
        await qs(s, !1), wt = 0;
      } catch (f) {
        const S = f instanceof Error ? f.message : String(f);
        /Cancelled in the listening wallet/.test(S) ? $t || (Et = !0, Gt("Not now. Nothing was signed.")) : /did not answer/.test(S) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (wt++, T = S);
      } finally {
        ut = !1;
        const f = $t;
        $t = null, f ? await f() : await In(!0);
      }
    })());
  }
  async function Nr(f) {
    ut && ($t = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ke), f && await f(), t.changed();
  }
  const rs = () => ({
    fee: Lt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Gr.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Dn() {
    if (!(o != null && o.address)) return !1;
    if (F || (F = await t.tabLock(o.address)), !F)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function _r(f, S) {
    const C = o.address, { balance: U, nonce: J } = S ?? await t.chain.account(C);
    i = U;
    const D = await s.request("listening.prepareReturn", {
      mode: f.mode,
      balance: U.toString(),
      nonce: J.toString(),
      fee: Vi.toString(),
      ...f.amount !== void 0 ? { amount: f.amount.toString() } : {},
      ...f.linked ? {} : { destination: f.to }
    });
    if (D.recipient !== f.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const Q = f.mode === "amount" ? f.amount : f.mode === "all" ? U - Vi : U - Gr - Vi, q = ii(D.raw);
    if (rr(q.payload.recipient).value !== f.to || String(q.payload.amount) !== D.amount || Q !== void 0 && D.amount !== Q.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const X = {
      id: du(),
      address: C,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: D.recipient,
      amount: D.amount,
      fee: D.fee,
      nonce: J.toString(),
      created: t.now(),
      status: "signed",
      raw: D.raw,
      txid: D.txid
    };
    t.validate(X), ne(X);
    try {
      await t.chain.broadcast(D.raw, D.txid), ne({ ...X, status: "pending" });
    } catch (rt) {
      throw ne({ ...X, status: "unknown", note: rt.message }), rt;
    }
    return D;
  }
  const jo = Tl, Zt = Vi;
  async function Ro(f, S, C) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Bt("slots") || Bt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const U = o.slot ?? 0;
    if (f === S || ![f, S].includes(U) || ![f, S].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const J = o.root ?? o.address, D = f === 0 ? J : o.address, Q = S === 0 ? J : o.address, { balance: q, nonce: X } = await t.chain.account(D);
    if (q < C + Zt + Pe) throw new Error(f === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const rt = await s.request("listening.signMove", { from: f, to: S, amount: C.toString(), fee: Zt.toString(), nonce: X.toString(), balance: q.toString() }), gt = ii(rt.raw);
    if (rt.from !== D || rt.to !== Q || rt.amount !== C.toString() || rr(gt.payload.recipient).value !== Q || String(gt.payload.amount) !== C.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Xt = {
      id: du(),
      address: D,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: Q,
      amount: rt.amount,
      fee: rt.fee,
      nonce: X.toString(),
      created: t.now(),
      status: "signed",
      raw: rt.raw,
      txid: rt.txid
    };
    t.validate(Xt), ne(Xt);
    try {
      await t.chain.broadcast(rt.raw, rt.txid), ne({ ...Xt, status: "pending" });
    } catch (oe) {
      throw ne({ ...Xt, status: "unknown", note: oe.message }), oe;
    }
    return Dt({ txid: rt.txid, amount: rt.amount, at: t.now() }, Q), Q === J && J !== o.address ? c = null : a = -1 / 0, rt;
  }
  let Xs = !1;
  const zo = /* @__PURE__ */ new Map(), Ws = (f) => bt("float", f);
  async function Go() {
    if (Xs || (o == null ? void 0 : o.state) !== "unlocked" || !we() || Bt("move") || Bt("rootLike") || !o.address) return;
    const f = o.address;
    if (t.store.get(Ws(f)) === "1") return;
    const S = k();
    if (!(S != null && S.player) || S.state !== "arrived") return;
    const C = Xn();
    if (C === void 0 || i === void 0) return;
    if (!lr(C)) {
      t.store.set(Ws(f), "1");
      return;
    }
    if (Ze(pe()) || ss() || We().length || i < jo * 4n + Pe + Zt) return;
    const U = zo.get(f);
    if (!(U && (U.n >= 3 || t.now() - U.at < 5 * 6e4))) {
      Xs = !0, zo.set(f, { n: ((U == null ? void 0 : U.n) ?? 0) + 1, at: t.now() });
      try {
        await Ro(o.slot ?? 0, 0, jo), t.store.set(Ws(f), "1");
      } catch (J) {
        console.warn("[radio] likes float not sent yet", J);
      } finally {
        Xs = !1;
      }
    }
  }
  async function Hi(f) {
    if (ye().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Bt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const S = await kn().catch(() => null);
    if (!S)
      throw dt = null, Kt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Kt = !1, i = S.balance;
    const C = { balance: S.balance, nonce: S.nonce };
    if (f === "excess") {
      const q = L0(S.parts) ?? At();
      if (!q) throw new Error("Choose where to send the excess first.");
      await _r({ mode: "excess", to: q, linked: !1 }, C), dt = null, Gt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const U = S.steps;
    if (!U.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!dt && dt.balance === S.balance && t.now() - dt.at <= Oo && dt.steps.length === U.length && dt.steps.every((q, X) => q.to === U[X].to && q.mode === U[X].mode && q.send === U[X].send))) {
      dt = {
        at: t.now(),
        balance: S.balance,
        steps: U,
        parts: S.parts,
        plan: { state: "ready", steps: U.map((q) => ({ to: q.to, kind: q.kind, send: q.send.toString() })), kept: S.tooSmall, excess: L0(S.parts) }
      }, Gt(U.length > 1 ? `This goes back in ${U.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const D = U[0], Q = D.to ?? At();
    if (!Q) throw new Error("Choose where to send the rest first.");
    if (D.mode === "amount" && Bt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await _r({ mode: D.mode, to: Q, linked: !1, ...D.mode === "amount" ? { amount: D.send } : {} }, C), dt = null, U.length === 1 ? (An(!1), Gt("Returned ✓ Paying is off.")) : Gt(`Returned ✓ ${U.length - 1} more ${U.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Pr() {
    if (!(o != null && o.unproven)) return;
    const f = await wn();
    await f.request("listening.prove"), o = await bn(f);
  }
  const Je = {
    forceRefresh: () => In(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (f) => {
      if (!t.main() && !(f !== null && !Sr(f))) {
        if (f === Ke()) return In(!0);
        t.store.set(Hn, f ?? ""), T = "", E = "", i = void 0, a = -1 / 0, c = null, await In(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (f) => Ne("Waiting for your passkey…", async () => {
      const S = await wn();
      await S.request("listening.unlock", { mode: "create", terms: rs(), ...t.main() ? { main: t.main() } : {}, ...f != null && f.quick && !t.main() ? { quick: !0 } : {} }), o = await bn(S), o.address && t.store.set(bt("created", o.address), "1"), An(!0), Gt(j() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Dn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (f) => {
      f ? Qe() : re = null, t.changed();
    },
    giftSent: (f, S) => {
      !(o != null && o.address) || Re() || (Dt({ txid: f, amount: S.toString(), at: t.now() }), a = -1 / 0, z = null, Gt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (f) => {
      if (Ie(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Bt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await wn()).request("listening.bindSlot", { slot: f, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (f, S, C, U) => {
      Dt({ txid: C, amount: U.toString(), at: t.now() }, S), z = null, await Je.openAlbum(f), Gt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (f) => Ne("Opening…", async () => {
      if (Ie(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Bt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (p || u || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === f) return;
      Hr(), await s.request("listening.openSlot", { slot: f }), o = await bn(s), i = void 0, a = -1 / 0, dt = null, Kt = !1;
      const S = o.root;
      S && f > 0 && t.store.set(bt("slot", S), String(f)), Gt(f === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (f = !1) => {
      const S = () => Ne("Waiting for your passkey…", async () => qs(await wn(), f));
      return ut ? f ? Bt("cancel") ? (Gt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Nr(async () => {
        (on() === "locked" || on() === "intro") && await S();
      }) : ke : S();
    },
    link: () => Ne("Sign in your wallet…", async () => {
      Ie();
      const f = t.main();
      if (!f || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const S = (await t.links(f)).find((C) => C.listening === o.address);
      if (S)
        await s.request("listening.link", { main: f, issued: S.issued, mainSignature: S.mainSignature });
      else {
        const C = { main: f, listening: o.address, issued: t.now() }, U = await t.signWithMain(f, M5(C)), J = await s.request("listening.link", { main: f, issued: C.issued, mainSignature: U });
        await t.saveLink({ ...C, mainSignature: U, listeningSignature: J.listeningSignature }), it = -1 / 0;
      }
      Gt("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Ne("One more passkey check…", Pr), !(o != null && o.unproven)) : !0,
    deposit: () => Ne("Approve the deposit in your wallet…", async () => {
      Ie(), await Pr();
      const f = t.main();
      if (!f || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (Re()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (ze()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Ks(!0);
      const S = lu(i ?? 0n);
      if (S <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await t.deposit(f, o.address, S), H && Dt({ txid: H, amount: S.toString(), at: t.now() }), Gt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ne("Approve the top-up in your wallet…", async () => {
      Ie(), await Pr();
      const f = t.main(), S = pe();
      if (!f || !S) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Ze(S)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const C = await t.chain.balance(S);
      we() ? c = { for: S, value: C, at: t.now() } : (i = C, a = t.now());
      const U = lu(C);
      if (U <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const J = await t.deposit(f, S, U);
      J && Dt({ txid: J, amount: U.toString(), at: t.now() }, S), Gt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (f) => Ne("Adding plays…", async () => {
      if (Ie(), !we()) throw new Error("Open the album you want to add plays to first.");
      if (!Sc.includes(f)) throw new Error("Choose one of the amounts offered.");
      const S = j5(f, Lt());
      if (p || u || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (We().length || Re()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Ro(0, o.slot ?? 0, S), Gt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Ne("Confirm in the listening wallet…", async () => {
      if (!Gs()) throw new Error("Connect your wallet first.");
      await Dn(), await s.request("listening.approveSession", rs()), An(!0), Gt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ne("Clearing…", async () => {
      for (const f of $())
        await t.chain.transaction(f.txid) || ne({ ...f, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Gt("Cleared ✓");
    }),
    switchOff: () => Ne("Switching off…", async () => {
      Hr(), await (s == null ? void 0 : s.request("listening.stop")), An(!1), Gt("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Ne("Showing your backup words in the box…", async () => {
      if (!(o != null && o.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const f = await wn();
      await f.request("listening.backup"), o = await bn(f), Gt("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Nt = null, await vn(!0), t.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (f) => Ne("Confirm in the listening wallet…", async () => {
      var X, rt, gt, Xt;
      const S = at();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !S) throw new Error("Unlock your player first.");
      if (!t.awardNote) throw new Error("Awards are not available here.");
      if (Bt("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (te(S)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (p || u || w || We().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Dn();
      const C = await t.awardNote(S, f), { balance: U, nonce: J } = await t.chain.account(S);
      if (U < ic) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const Q = await (await wn()).request("listening.signAward", {
        cls: C.cls,
        number: C.number,
        plays: C.plays,
        record: C.record,
        signature: C.signature,
        fee: ic.toString(),
        nonce: J.toString(),
        balance: U.toString()
      }), q = ii(Q.raw);
      if (Q.hero !== S || Q.number !== C.number || ((rt = (X = q.payload) == null ? void 0 : X.functionName) == null ? void 0 : rt.content) !== "claim" || ((Xt = (gt = q.payload) == null ? void 0 : gt.contractName) == null ? void 0 : Xt.content) !== S5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await t.chain.broadcast(Q.raw, Q.txid), t.store.set(qt(S), JSON.stringify({ txid: Q.txid, at: t.now() })), a = -1 / 0, vt && (vt = { ...vt, at: -1 / 0 }), Gt("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (f) => Ne("Confirm in the listening wallet…", async () => {
      var rt, gt, Xt;
      const S = at(), C = Ct();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !S) throw new Error("Unlock your player first.");
      if ((C == null ? void 0 : C.state) !== "claimed" || C.inscription === void 0) throw new Error("There is no record to send yet.");
      if (C.holds === !1) throw new Error("This record has already been sent.");
      if (C.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if ($e(S)) throw new Error("Your record is already on its way.");
      const U = f.trim();
      if (!Sr(U)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (U === S) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Bt("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (p || u || w || We().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Dn();
      const { balance: J, nonce: D } = await t.chain.account(S);
      if (J < ic) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const q = await (await wn()).request("listening.signSendRecord", { inscription: C.inscription, recipient: U, fee: ic.toString(), nonce: D.toString(), balance: J.toString() }), X = ii(q.raw);
      if (q.from !== S || q.recipient !== U || q.inscription !== C.inscription || ((gt = (rt = X.payload) == null ? void 0 : rt.functionName) == null ? void 0 : gt.content) !== "transfer" || rr((Xt = X.payload.functionArgs) == null ? void 0 : Xt[2]).value !== U)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await t.chain.broadcast(q.raw, q.txid), t.store.set(ue(S), JSON.stringify({ txid: q.txid, at: t.now() })), a = -1 / 0, vt && (vt = { ...vt, at: -1 / 0 }), Gt("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Ne("Locking…", async () => {
      Hr(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, Gt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (f) => {
      const S = String(f ?? "").trim();
      if (!(o != null && o.address)) return Gt("", "Unlock the listening wallet first.");
      if (!Sr(S)) return Gt("", "Enter a standard mainnet address (it starts with SP).");
      if (S === o.address) return Gt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(ht(o.address), S), Gt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && t.store.set(ht(o.address), ""), t.changed();
    },
    returnFunds: (f) => Ne("Check the return in the listening wallet…", async () => {
      if (!Gs()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (_i()) return Hi(f);
      const S = be();
      if (!S) throw new Error(j() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (S.kind !== "linked" && Bt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ye().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await _r({ mode: f, to: S.to, linked: S.kind === "linked" }), f === "all" && An(!1), Gt(f === "all" ? S.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, de = [], dr = 10, Fn = 30 * 6e4;
  let Ur = !1;
  const ss = () => p || !!d || u || w, Hr = () => {
    de.length && (de.length = 0, t.changed());
  };
  async function Ko(f) {
    if (!de.some((S) => S.id === f.id) && !pn().some((S) => S.id === f.id) && (de.push({ ...f, at: t.now() }), de.length > dr && de.shift()), ss() || ye().length) {
      const S = de.length;
      E = `Queued ${S === 1 ? "this song" : S + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await os();
  }
  async function os() {
    if (!Ur) {
      Ur = !0;
      try {
        for (; de.length; ) {
          for (; de.length && t.now() - de[0].at > Fn; ) de.shift();
          if (!de.length || ss() || await l(de[0]) === "wait") return;
          de.shift();
        }
      } finally {
        Ur = !1, t.changed();
      }
    }
  }
  async function l(f) {
    var S;
    p = !0;
    try {
      await In();
      const C = on();
      if (C === "loading") return "wait";
      if (C !== "ready" || !gn() || !(o != null && o.session) || o.session.playsLeft < 1 || !F) return "done";
      if (ye().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const U = o.address, { balance: J, nonce: D } = await t.chain.account(U);
      i = J, a = t.now();
      const Q = await t.chain.owner(uu, f.song);
      if (Q === U || Q === Mt()) return "done";
      const q = await s.request("listening.signPlay", {
        core: uu,
        song: f.song,
        receipt: f.id,
        fee: Lt().toString(),
        nonce: D.toString(),
        balance: J.toString()
      }), X = {
        id: f.id,
        address: U,
        kind: "play",
        core: uu,
        song: f.song,
        recipient: Q,
        amount: "50",
        fee: Lt().toString(),
        nonce: D.toString(),
        created: t.now(),
        status: "signed",
        raw: q.raw,
        txid: q.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...f.title ? { title: String(f.title).slice(0, 120) } : {},
        ...f.artist ? { artist: String(f.artist).slice(0, 120) } : {}
      };
      t.validate(X), ne(X);
      const rt = f.title ? `“${f.title}”${f.artist ? ` by ${f.artist}` : ""}` : `song #${f.song}`;
      try {
        await t.chain.broadcast(q.raw, q.txid), ne({ ...X, status: "pending" }), E = `♪ Paid ${rt}`, T = "";
      } catch (gt) {
        ne({ ...X, status: Wo(gt) ? "failed" : "unknown", note: gt.message, ...Wo(gt) ? { raw: void 0 } : {} }), T = gt.message;
      }
      return o = await bn(s), "done";
    } catch (C) {
      const U = C instanceof Error ? C.message : "payment unavailable";
      return (S = k()) != null && S.player ? (E = "Payment is taking a moment: " + U, "wait") : (E = "This song played free: " + U, "done");
    } finally {
      p = !1, t.changed();
    }
  }
  function m(f) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(on()) || Bt("like") ? !1 : (y(f), !0);
  }
  async function y(f) {
    const S = f.title ? `“${f.title}”` : `song #${f.song}`, C = (x) => {
      var _;
      T = x, E = "";
      try {
        (_ = t.likeFailed) == null || _.call(t, f.song);
      } catch {
      }
      t.changed();
    }, U = we(), J = on(), D = Mt(), Q = U && (J === "fund" || J === "over") ? "ready" : J, q = j() ? pe() : D;
    if (Q === "locked") {
      g = { ...f, at: t.now() }, Gt(`Unlock to like ${S}. It sends straight after.`);
      return;
    }
    if (Q === "wrong-wallet") return C(Wn());
    if (Q === "link") return C("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (j() && Bt("standalone")) return C("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (Q === "fund") return C("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (Q === "over") return C("Return the excess first: the listening wallet holds more than 1 STX.");
    if (U) {
      await Vs(!0);
      const x = Xn();
      if (lr(x))
        return t.changed(), C(Wc);
    }
    if (Q !== "ready" || !q) return C("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return C("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return C("Pay-per-play is running in another tab. Like from that tab.");
    const X = pn(pe()).find((x) => x.kind === "like" && x.song === f.song);
    if (X && Yi.includes(X.status))
      return C(`Your last like for ${S} is still on its way. It can change again once it confirms.`);
    if (u) return C("One like at a time: your last one is still being sent.");
    if ((X == null ? void 0 : X.status) === "confirmed" && t.now() - (X.confirmedAt ?? 0) < z5)
      return C(`Your like for ${S} has only just confirmed. Try again in a moment.`);
    let rt;
    w = !0;
    try {
      rt = t.likeState ? (await t.likeState(q, f.song)).by : f.likedBy ?? [];
    } catch {
      rt = f.likedBy;
    } finally {
      w = !1;
    }
    if (!rt) return C(`Could not check ${S} right now. Try the heart again.`);
    const gt = pe(), oe = ((X == null ? void 0 : X.status) === "confirmed" && typeof X.liked == "boolean" && t.now() - (X.confirmedAt ?? X.created) < 5 * 6e4 ? X.liked : void 0) ?? rt.includes(gt);
    if (!oe && rt.some((x) => x !== gt)) return C(j() ? `${S} was liked from another wallet of yours. Unlike it there.` : `${S} was liked from your main wallet${rt.includes(D) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await h({ song: f.song, liked: !oe, title: f.title, artist: f.artist });
  }
  async function h(f) {
    var U, J, D;
    if (u) {
      Gt("Still sending your last like. Try again in a moment.");
      return;
    }
    u = !0;
    const S = f.title ? `“${f.title}”${f.artist ? ` by ${f.artist}` : ""}` : `song #${f.song}`, C = t.wait ?? ((Q) => new Promise((q) => setTimeout(q, Q)));
    try {
      Gt(`${f.liked ? "Liking" : "Unliking"} ${S}…`);
      const Q = t.now() + 12e4;
      for (; p || (we() ? pn(pe()).some((oe) => Yi.includes(oe.status)) : ye().length); ) {
        if (t.now() > Q) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await C(5e3), await In(!0);
      }
      if (!we() && on() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const q = pe(), { balance: X, nonce: rt } = await t.chain.account(q);
      if (we() ? c = { for: q, value: X, at: t.now() } : (i = X, a = t.now()), lr(X)) throw new Error(Wc);
      const gt = await s.request("listening.signLike", {
        song: f.song,
        liked: f.liked,
        fee: cu.toString(),
        nonce: rt.toString(),
        balance: X.toString()
      }), Xt = {
        id: du(),
        address: q,
        kind: "like",
        core: 0,
        song: f.song,
        liked: f.liked,
        recipient: "",
        amount: "0",
        fee: cu.toString(),
        nonce: rt.toString(),
        created: t.now(),
        status: "signed",
        raw: gt.raw,
        txid: gt.txid,
        ...f.title ? { title: String(f.title).slice(0, 120) } : {},
        ...f.artist ? { artist: String(f.artist).slice(0, 120) } : {}
      };
      t.validate(Xt), ne(Xt);
      try {
        await t.chain.broadcast(gt.raw, gt.txid), ne({ ...Xt, status: "pending" }), E = `${f.liked ? "♥ Liked" : "Unliked"} ${S}`, T = "";
        try {
          (U = t.likeSent) == null || U.call(t, f.song, f.liked);
        } catch {
        }
      } catch (oe) {
        if (ne({ ...Xt, status: Wo(oe) ? "failed" : "unknown", note: oe.message, ...Wo(oe) ? { raw: void 0 } : {} }), T = oe.message, Wo(oe)) try {
          (J = t.likeFailed) == null || J.call(t, f.song);
        } catch {
        }
      }
      o = await bn(s);
    } catch (Q) {
      T = "Like not sent: " + (Q instanceof Error ? Q.message : "the listening wallet is unavailable");
      try {
        (D = t.likeFailed) == null || D.call(t, f.song);
      } catch {
      }
    } finally {
      u = !1, t.changed(), os();
    }
  }
  return { snapshot: an, refresh: In, onListened: Ko, heart: m, toggleLike: y, ...Je };
}
const Tb = ["Connect", "Passkey", "Link & fund", "Listen"], Bb = ["Passkey", "Add 1 STX", "Listen"], vd = (t) => t ? Bb : Tb;
function K5(t) {
  if (t.solo) return V5(t);
  const e = Tb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function V5(t) {
  const e = Bb.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function Y5(t, e) {
  return !e || e.at >= vd(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const q5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function X5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !q5(r.id)));
}
const W5 = {}, Z5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Q5 = (t) => {
  const e = W5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, J5 = (t) => `/hiro/${t}`, t$ = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, e$ = (t) => {
  const e = Q5(t);
  if (e)
    return [t$(e)];
  const n = Z5[t];
  return typeof window < "u" ? [`${window.location.origin}${J5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, n$ = {}, C0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, r$ = "xtrata.log.enabled", s$ = "xtrata.log.level", o$ = "xtrata.log.tags", i$ = "xtrata.log.dedupe", ac = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, a$ = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, c$ = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, l$ = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, u$ = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, d$ = () => {
  const t = n$ ?? {}, e = ac(r$) ?? t.VITE_LOG_ENABLED, n = ac(s$) ?? t.VITE_LOG_LEVEL, r = ac(o$) ?? t.VITE_LOG_TAGS, s = ac(i$) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: a$(e),
    level: c$(n) ?? "warn",
    tags: u$(r),
    dedupe: l$(s)
  };
}, f$ = (t, e, n) => !t.enabled || C0[n] < C0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), h$ = (t, e, n, r) => {
  const s = d$();
  if (!f$(s, e, t) || g$(s.dedupe))
    return;
  const o = `[xtrata:${e}] ${n}`, i = console[t] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, p$ = /* @__PURE__ */ new Set();
let T0 = null;
const g$ = (t, e, n, r, s) => (T0 !== t && (p$.clear(), T0 = t), !1), y$ = (t, e, n) => h$("debug", t, e, n), w$ = {}, b$ = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, m$ = (t) => {
  const e = w$, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : b$[t];
}, x$ = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, S$ = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return x$.test(n) ? n : null;
}, E$ = (t) => t.replace(/\/+$/, ""), A$ = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), B0 = (t) => {
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
}, Zo = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, v$ = (t) => {
  var c, d;
  let e;
  try {
    e = rr(E6(t));
  } catch {
    return null;
  }
  const n = Zo(e);
  if (!n || n.success === !1)
    return null;
  const r = Zo(n.value), s = Zo(r == null ? void 0 : r.value), o = Zo(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = B0((c = Zo(o.name)) == null ? void 0 : c.value), a = B0((d = Zo(o.namespace)) == null ? void 0 : d.value);
  return !i || !a ? null : S$(`${i}.${a}`);
}, k$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${E$(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [ub(Yw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : v$(o.result);
}, $$ = async (t) => {
  const e = t.address.trim();
  if (!ci(e))
    return null;
  const n = m$(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of e$(t.network))
    try {
      return await k$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (o) {
      r = o;
    }
  return y$("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: A$(r)
  }), null;
};
function I$(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((d) => {
      c.pending = !1, d && (c.name = d, e());
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
const M0 = Object.freeze({
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
}), N0 = Object.freeze({ 139: "melophonic" });
function _0(t, e = "") {
  const n = String(t);
  return Object.hasOwn(M0, n) ? M0[n] : Object.hasOwn(N0, n) ? N0[n] : e;
}
const P0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function U0(t, e = "") {
  return Object.hasOwn(P0, String(t)) ? P0[String(t)] : e;
}
const Mb = 10000n, jf = 1000000n, Zc = 3000n, L$ = (t, e) => `${t}#gift=${e}`, C$ = 100, qi = (t, e = cr) => t <= Pe ? 0 : Number((t - Pe) / rn(e)), H0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Nb = "xtrata.xyz/radio/gifts", fu = C$, T$ = "Create a prefunded Xtrata radio gift batch", B$ = (t) => ({
  domain: $o({ name: qe(Nb), version: qe("1"), "chain-id": kr(1) }),
  message: $o({
    purpose: qe(T$),
    creator: qe(t.creator),
    count: kr(t.count),
    amount: kr(BigInt(t.amount)),
    label: qe(t.label),
    issued: kr(t.issued),
    ...t.player ? { player: qe(t.player) } : {}
  })
}), M$ = (t, e, n = cr) => Pe + BigInt(t) * rn(n) + (e ? Tl : 0n), N$ = (t, e = cr) => Number((jf - Pe - (t ? Tl : 0n)) / rn(e)), _$ = (t, e) => BigInt(t) * (e + Zc);
function P$(t, e, n, r = cr) {
  const s = n ? Tl : 0n, o = e > Pe + s ? e - Pe - s : 0n, i = Number(o / rn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Yc,
    fees: BigInt(i) * r,
    reserve: Pe,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Zc,
    perCopy: e + Zc,
    total: _$(t, e)
  };
}
const U$ = (t) => t >= Mb && t <= jf, O0 = 40, H$ = "Create an Xtrata radio gift player", O$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function D0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && O$.test(t) : !n;
}
function D$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!D0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!D0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > O0) throw new Error(`A player holds 1 to ${O0} songs.`);
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
const F$ = (t) => {
  const e = [...new Set(t.explicit ?? [])].sort((n, r) => n - r);
  return zd(Vd(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null, ...e.length ? { explicit: e } : {} }))));
}, j$ = (t) => ({
  domain: $o({ name: qe(Nb), version: qe("1"), "chain-id": kr(1) }),
  message: $o({
    purpose: qe(H$),
    admin: qe(t.admin),
    player: qe(t.hash),
    issued: kr(t.issued)
  })
}), Vr = (t) => t.tracks.filter((e) => !e.hidden), R$ = (t) => t.tracks.find((e) => e.hidden) ?? null, F0 = [300, 500, 1e3], j0 = 1800, hu = /* @__PURE__ */ new Map();
async function z$(t) {
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
function G$(t, e, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = t, (() => {
    const a = hu.get(t), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : e, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      hu.set(t, { ...a, until: Date.now() + j0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        hu.delete(t), s();
      }, j0 + 50);
    }
  }, o;
}
const br = (t, e, n, r, s) => G$(t, e, async () => await z$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Zs = "xtrata.radio.gift.incoming.v1", R0 = (t) => "xtrata.radio.gift.mine.v1:" + t, z0 = (t) => "xtrata.radio.gift.batches.v1:" + t, St = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, wr = (t, e, n = "") => {
  const r = St("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, cc = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, zn = (t) => er(t).replace(/\.?0+$/, "");
function K$(t) {
  let e = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), G = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return G !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), H0(G) ? G : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const $ = JSON.parse(t.store.get(Zs) || "null");
      return H0($ == null ? void 0 : $.code) ? $.code : null;
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
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const $ = e == null ? void 0 : e.view;
    return !($ != null && $.player) || !i() ? null : { player: $.player, from: u($), plays: qi(BigInt($.amount)) };
  }, c = () => {
    const $ = e == null ? void 0 : e.view;
    return !$ || $.player || !i() ? null : { plays: qi(BigInt($.amount)), from: $.from ? t.who($.from) : null };
  }, d = () => {
    const $ = e == null ? void 0 : e.code;
    if (!$) return [];
    const G = `${location.origin}${location.pathname}#gift=${$}`;
    return [br("gift-pass-on", "Copy the link to pass on", () => G, "primary", t.changed)];
  }, p = () => {
    e = null, t.store.set(Zs, null), t.changed();
  }, u = ($) => $.from ? t.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let w = {};
  const g = ($) => {
    if (w.box) return w.box;
    const G = St("div", "", "ppp-gift-check");
    w.box = G;
    const j = () => {
      const Y = window.turnstile;
      !Y || w.rendered || (w.rendered = !0, Y.render(G, { sitekey: $, callback: (ht) => {
        w.token = ht, t.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const Y = document.createElement("script");
      Y.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", Y.async = !0, Y.onload = j, document.head.append(Y);
    }
    return G;
  }, A = ($) => {
    queueMicrotask(() => void $());
  };
  let E;
  async function T($) {
    var Y, ht, At, se, be, Rt, k, at, vt;
    if (!e || e.claiming || !$.listening) return;
    const G = !!((Y = e.view) != null && Y.player);
    if (G && !$.root) return;
    e.claiming = !0, e.error = void 0, (ht = t.claiming) == null || ht.call(t, !0), t.changed();
    const j = async (Nt) => {
      const xt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: w.token, ...Nt })
      });
      return { res: xt, r: await xt.json().catch(() => ({})) };
    };
    try {
      let Nt = 0, xt = $.listening, qt;
      if (G) {
        const te = Number((At = await t.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : At.next);
        if (!Number.isSafeInteger(te) || te < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Nt = te;
        for (let vn = 0; ; vn++) {
          const Ct = await t.album.bind(Nt);
          if (xt = Ct.address, qt = await j({ wallet: xt, binding: Ct }), qt.res.status === 409 && /just taken/.test(((se = qt.r) == null ? void 0 : se.error) || "") && vn < 5) {
            Nt += 1;
            continue;
          }
          break;
        }
      } else qt = await j({ wallet: xt });
      const { res: ue, r: $e } = qt;
      if (ue.status === 503 && /sending another gift/.test(($e == null ? void 0 : $e.error) || "")) {
        e.waiting = !0, (be = t.claiming) == null || be.call(t, !0), clearTimeout(E), E = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ue.ok) {
        const te = String(($e == null ? void 0 : $e.error) || "");
        if (ue.status === 404 || ue.status === 410 || ue.status === 409 && /already had a gift|brand-new|already have this album/.test(te))
          throw t.store.set(Zs, null), new Error(te || "This gift cannot be opened.");
        if (ue.status === 429 || ue.status === 403 || ue.status === 400 && !/wallet number/i.test(te)) throw new Error(te || `Could not open the gift (${ue.status}).`);
        const Ct = /topping up/.test(te) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(te) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(te) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Ct), { retry: !0, slow: /topping up|not paid for yet/.test(te) });
      }
      e.done = !0, t.store.set(Zs, null), G ? await t.album.arrived(Nt, xt, $e.txid, BigInt($e.amount)) : t.giftSent($e.txid, BigInt($e.amount));
    } catch (Nt) {
      const xt = Nt, qt = xt.name === "TypeError" || xt.name === "AbortError" || xt.name === "TimeoutError" || /wallet number/i.test(xt.message);
      if (xt.retry || qt) {
        const ue = e.tries ?? 0;
        e.tries = ue + 1, e.retry = { text: xt.retry ? xt.message : "Still sending your gift… the network is slow, trying again." }, (Rt = t.claiming) == null || Rt.call(t, !0), clearTimeout(E), E = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, xt.slow ? 6e4 : n(ue));
      } else
        e.error = xt.message, (k = t.claiming) == null || k.call(t, !1);
      w.token = void 0;
      try {
        (vt = (at = window.turnstile) == null ? void 0 : at.reset) == null || vt.call(at, w.box);
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
        var ht, At;
        (O == null ? void 0 : O.wallet) === j && (O.state = (ht = Y == null ? void 0 : Y.gift) == null ? void 0 : ht.state, O.problem = ((At = Y == null ? void 0 : Y.gift) == null ? void 0 : At.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(O.state === "sending" && O.problem)) return [];
    const G = St("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return G.title = `Network reply: ${O.problem}`, [G];
  }
  function v($, G, j = !1) {
    var Rt, k;
    const Y = G.player, ht = BigInt(G.amount), At = j ? [] : [St("p", `🎁 ${u(G)} sent you “${Y.title}”${Y.subtitle ? ` by ${Y.subtitle}` : ""}: ${Vr(Y).length} ${Vr(Y).length === 1 ? "song" : "songs"} and ${qi(ht).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step))) {
      if (j) return At;
      if (At.push(St("p", $.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : $.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), $.step === "intro") {
        const at = document.createElement("details");
        at.className = "ppp-how";
        const vt = document.createElement("summary");
        vt.textContent = "How does this work?", at.append(vt, St("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), At.push(at);
      }
      return At;
    }
    if ($.walletCannotAlbums)
      return At.push(St("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), At;
    const be = (k = (Rt = $.gate) == null ? void 0 : Rt.gifts) == null ? void 0 : k.turnstileSiteKey;
    return be && !w.token ? At.push(St("p", "One quick check and it is yours:", "ppp-mute"), g(be)) : !e.claiming && !e.error && !e.waiting && !e.retry && A(() => T($)), At.push(...B($, "Sending your album…")), At;
  }
  function B($, G) {
    const j = [];
    return e.claiming || e.waiting ? j.push(St("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : G, "ppp-cyan")) : e.retry && j.push(St("p", e.retry.text, "ppp-warn"), wr("Try now", () => {
      clearTimeout(E), e.retry = void 0, T($);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? j.push(St("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...d(), wr("Forget this gift link here", p, "quiet")) : e.error && j.push(St("p", e.error, "ppp-bad"), wr("Try again", () => {
      e.error = void 0, T($);
    })), j;
  }
  const P = ($) => {
    var G;
    return !!e && !e.done && !e.error && i() && !!$.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((G = e.view) != null && G.player)) && ($.balance ?? 0n) === 0n && !$.entries.length);
  };
  function Z($, G = {}) {
    var vt, Nt;
    const j = H($);
    if (!e || ["off", "elsewhere"].includes($.step)) return j;
    const Y = e.view;
    if (e.error && !Y) return [St("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!Y) return [St("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return j;
    if (Y.status === "claimed" || Y.status === "claiming") return [St("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(Y.status)) return [St("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (Y.status === "pending-deposit") return [St("p", `🎁 ${u(Y)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (Y.player) return [...v($, Y, !!G.bare), ...j];
    if (!!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0))
      return [St("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), wr("Forget this gift link here", p, "quiet")];
    const At = BigInt(Y.amount), se = qi(At).toLocaleString(), be = St(
      "p",
      `🎁 ${u(Y)} sent you ${zn(At)} STX of on-chain music: about ${se} paid plays.`,
      "ppp-gift"
    ), Rt = G.bare ? [] : [be], k = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, at = (Nt = (vt = $.gate) == null ? void 0 : vt.gifts) == null ? void 0 : Nt.turnstileSiteKey;
    return k ? (at && !w.token ? Rt.push(St("p", "One quick check and it is yours:", "ppp-mute"), g(at)) : !e.claiming && !e.error && !e.waiting && !e.retry && A(() => T($)), Rt.push(...B($, "Sending your gift…"))) : $.step === "intro" ? G.bare || Rt.push(St("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : $.listening && $.linked ? Rt.push(St("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), wr("Forget this gift link here", p, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && Rt.push(St("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...d(), wr("Forget this gift link here", p, "quiet")), Rt;
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
  const tt = St("div", "", "ppp-gift-fold");
  let K = 250000n, b = "", I = "";
  const M = ($) => {
    try {
      const G = JSON.parse(t.store.get(R0($)) || "[]");
      return Array.isArray(G) ? G : [];
    } catch {
      return [];
    }
  }, N = ($, G) => t.store.set(R0($), JSON.stringify(G.slice(0, 50)));
  async function V($) {
    const G = M($);
    for (const j of G)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await t.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (Y) {
          j.error = Y.message;
        }
    N($, G), t.changed();
  }
  async function z($) {
    if (b) return;
    b = "Starting your gift…", I = "", t.changed();
    let G = null;
    try {
      G = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: K.toString() }) });
      const j = M($);
      j.unshift({ id: G.id, code: G.code, amount: K.toString(), at: t.now() }), N($, j), b = "Approve the gift in your wallet…", t.changed();
      const Y = await t.pay($, G.depositTo, BigInt(G.deposit), G.memo), ht = M($), At = ht.find((se) => se.id === G.id);
      At && (At.txid = Y, At.view = { status: "pending-deposit", amount: K.toString(), source: "friend", from: $, label: "", expires: 0 }), N($, ht), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", V($);
    } catch (j) {
      I = j.message || "Not sent.";
    } finally {
      b = "", t.changed();
    }
  }
  const mt = ($) => "xtrata.radio.gift.players.v1:" + $, dt = ($) => {
    try {
      const G = JSON.parse(t.store.get(mt($)) || "[]");
      return Array.isArray(G) ? G.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function Kt($, G) {
    var j;
    if (!b) {
      b = "Checking the player…", I = "", t.changed();
      try {
        const Y = G.tracks.split(/[\s,]+/).filter(Boolean).map((at) => Number(at.replace(/^#/, ""))), ht = (G.explicit ?? "").split(/[\s,]+/).map((at) => at.replace(/^#/, "")).filter(Boolean).map(Number), At = D$({ title: G.title.trim(), subtitle: G.subtitle.trim(), tracks: Y, cover: (j = G.cover) != null && j.trim() ? Number(G.cover.trim().replace(/^#/, "")) : null, ...ht.length ? { explicit: ht } : {} });
        b = "Sign in your wallet…", t.changed();
        const se = { admin: $, hash: F$(At), issued: t.now() }, be = await t.sign($, j$(se));
        b = "Making the player…", t.changed();
        const Rt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: At, request: se, signature: be }) }), k = dt($).filter((at) => at.id !== Rt.id);
        k.unshift({ id: Rt.id, title: Rt.title, tracks: Rt.tracks }), t.store.set(mt($), JSON.stringify(k.slice(0, 30))), I = `${Rt.existing ? "That player already exists" : "Player made"} ✓ “${Rt.title}” · ${Rt.tracks} songs. Pick it below for a batch.`;
      } catch (Y) {
        I = Y.message || "Not made.";
      } finally {
        b = "", t.changed();
      }
    }
  }
  const L = ($, G) => L$($ || location.origin + "/radio.html", G), F = ($) => {
    try {
      const G = JSON.parse(t.store.get(z0($)) || "[]");
      return Array.isArray(G) ? G.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id) && Array.isArray(j.codes)) : [];
    } catch {
      return [];
    }
  }, ut = ($, G) => t.store.set(z0($), JSON.stringify(G.slice(0, 20))), Et = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, wt = ($, G) => t.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(G) });
  let $t = 0;
  async function ke($) {
    const G = F($);
    for (const j of G)
      if (!Et(j))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await wt("/radio/gift/batch/confirm", { id: j.id, ...j.txid ? { txid: j.txid } : {} }) : await t.json("/radio/gift/batch?id=" + j.id), j.error = void 0;
        } catch (Y) {
          j.error = Y.message;
        }
    try {
      const j = await t.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const Y of (j == null ? void 0 : j.batches) ?? []) {
        const ht = G.find((At) => At.id === Y.id);
        if (ht) {
          ht.error || (ht.view = Y);
          continue;
        }
        G.push({ id: Y.id, codes: [], count: Y.count, amount: Y.amount, label: Y.label, player: Y.player, depositTo: "", deposit: Y.deposit, memo: Y.memo, at: 0, view: Y });
      }
    } catch {
    }
    ut($, G), t.changed();
  }
  async function Lt($, G) {
    const j = F($).find((Y) => Y.id === G);
    if (!(!j || !j.depositTo || b)) {
      b = "Approve the payment in your wallet…", I = "", t.changed();
      try {
        const Y = await t.pay($, j.depositTo, BigInt(j.deposit), j.memo), ht = F($), At = ht.find((se) => se.id === G);
        At && (At.txid = Y), ut($, ht), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", ke($);
      } catch (Y) {
        I = `${/cancel/i.test(Y.message) ? "Payment cancelled." : Y.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", t.changed();
      }
    }
  }
  async function Bt($, G, j, Y) {
    if (b) return;
    if (!G.ok) {
      I = G.reason, t.changed();
      return;
    }
    b = "Sign in your wallet…", I = "", t.changed();
    let ht = null;
    try {
      const At = { creator: $, count: G.count, amount: G.amount.toString(), label: j, issued: t.now(), ...Y ? { player: Y } : {} }, se = await t.sign($, B$(At));
      b = "Making your links…", t.changed(), ht = await wt("/radio/gift/batch", { request: At, signature: se });
      const be = F($);
      be.unshift({ id: ht.id, codes: ht.codes, count: G.count, amount: ht.amount, label: j, player: Y ?? null, depositTo: ht.depositTo, deposit: ht.deposit, memo: ht.memo, at: t.now() }), ut($, be);
    } catch (At) {
      I = At.message || "Not made.", b = "", t.changed();
      return;
    }
    b = "", t.changed(), await Lt($, ht.id);
  }
  function bt() {
    const $ = !!re.value, G = Qe.value === "max" ? N$($) : Number(Qe.value), j = M$(G, $), Y = Number(ze.value);
    return !Number.isInteger(Y) || Y < 1 || Y > fu ? { ok: !1, reason: `Make 1 to ${fu} copies at a time.`, album: $, plays: G, amount: j, count: Y } : U$(j) ? { ok: !0, reason: "", album: $, plays: G, amount: j, count: Y, bill: P$(Y, j, $) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: $, plays: G, amount: j, count: Y };
  }
  const Hn = () => {
    const $ = bt();
    if (!$.ok) return $.reason;
    const G = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${zn(G.holders)} to song holders, ${zn(G.fees)} network fees)${$.album ? `, ${zn(G.float)} for the album’s likes` : ""}, ${zn(G.reserve)} kept so a listener can return what is left, + ${zn(G.sendFee)} to send it = ${zn(G.perCopy)} STX. ${$.count} copies = ${zn(G.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ke = ($, G) => G.codes.map((j) => L($, j)), Mt = St("input");
  Mt.type = "range", Mt.min = String(Mb), Mt.max = String(jf), Mt.step = "10000", Mt.value = String(K), Mt.setAttribute("aria-label", "Gift amount");
  const pn = St("p", "", "ppp-gift-amount"), ne = wr("", () => {
    const $ = t.main();
    $ && z($);
  }, "primary"), gn = () => {
    pn.textContent = An(), ne.textContent = `Gift ${zn(K)} STX`;
  };
  Mt.oninput = () => {
    K = BigInt(Mt.value), gn();
  };
  const An = () => `${zn(K)} STX · about ${qi(K).toLocaleString()} paid plays · you pay ${zn(K + Zc)} STX with the network fee`;
  gn();
  const ye = St("input");
  ye.maxLength = 60, ye.placeholder = "Title, e.g. Proof of Sound", ye.setAttribute("aria-label", "Player title");
  const We = St("input");
  We.maxLength = 80, We.placeholder = "Artist (optional)", We.setAttribute("aria-label", "Player subtitle");
  const Re = St("textarea");
  Re.rows = 3, Re.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Re.setAttribute("aria-label", "Songs");
  const Ze = St("input");
  Ze.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ze.setAttribute("aria-label", "Explicit songs");
  const Dt = St("input");
  Dt.inputMode = "numeric", Dt.placeholder = "Cover inscription number (optional), shown when the album loads", Dt.setAttribute("aria-label", "Cover inscription");
  const re = St("select");
  re.setAttribute("aria-label", "Batch album");
  const Qe = St("select");
  Qe.setAttribute("aria-label", "Plays per copy");
  for (const $ of [.../* @__PURE__ */ new Set([50, 100, 250, ...F0])].sort((G, j) => G - j)) Qe.append(cc(`${$.toLocaleString()} plays`, String($)));
  Qe.append(cc("Max (1 STX)", "max")), Qe.value = String(F0[0]);
  const ze = St("input");
  ze.type = "number", ze.min = "1", ze.max = String(fu), ze.value = "10", ze.setAttribute("aria-label", "Copies");
  const Me = St("input");
  Me.maxLength = 40, Me.placeholder = "Label, e.g. Opera launch", Me.setAttribute("aria-label", "Batch label");
  const pe = St("p", "", "ppp-mute"), we = () => {
    pe.textContent = Hn();
  };
  for (const $ of [re, Qe, ze])
    $.oninput = we, $.onchange = we;
  we();
  function Xn($) {
    var ht, At;
    const G = (ht = $.gate) == null ? void 0 : ht.gifts;
    if (!(G != null && G.enabled) || !G.admin || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const j = t.main(), Y = [St("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!j)
      Y.push(St("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (G.admin) {
      const se = St("div", "", "ppp-gift-admin"), be = (Nt, xt) => {
        const qt = St("label", Nt);
        return qt.append(xt), qt;
      }, Rt = dt(j);
      se.append(
        St("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        ye,
        We,
        Re,
        Dt,
        Ze,
        wr("Sign and make player", () => void Kt(j, { title: ye.value, subtitle: We.value, tracks: Re.value, cover: Dt.value, explicit: Ze.value }))
      );
      const k = wr("Sign, pay and make links", () => {
        Bt(j, bt(), Me.value.trim(), re.value || void 0);
      });
      k.disabled = !!b;
      const at = re.value;
      re.replaceChildren(cc("No album (starter copies)", ""), ...Rt.map((Nt) => cc(`${Nt.title} · ${Nt.tracks} songs`, Nt.id))), Rt.some((Nt) => Nt.id === at) && (re.value = at), we(), se.append(
        St("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        be("Album ", re),
        be("Plays each ", Qe),
        be("Copies ", ze),
        Me,
        pe,
        k
      ), t.now() - $t > 3e4 && ($t = t.now(), ke(j));
      const vt = F(j);
      if (vt.length) {
        const Nt = St("ul", "", "ppp-gift-list");
        for (const xt of vt.slice(0, 10)) {
          const qt = xt.view, ue = qt == null ? void 0 : qt.copies, $e = xt.error ? xt.error : !qt || qt.status === "pending-deposit" ? xt.txid ? "payment confirming…" : "waiting for your payment" : `${ue.claimed} of ${qt.count} claimed${ue.refunding + ue.refunded ? ` · ${ue.refunded} refunded${ue.refunding ? `, ${ue.refunding} on their way` : ""}` : ""}`, te = St("li");
          if (te.append(St("span", `${xt.label || "Batch"} · ${xt.count} × ${zn(BigInt(xt.amount))} STX`, "t"), St("span", $e, "ppp-mute")), !xt.txid && xt.depositTo && (!qt || qt.status === "pending-deposit") && te.append(wr("Pay now", () => void Lt(j, xt.id), "tiny")), xt.codes.length && (qt == null ? void 0 : qt.status) === "live") {
            const vn = Ke(((At = $.gate) == null ? void 0 : At.radioUrl) ?? null, xt);
            te.append(
              br("batch-copy:" + xt.id, "Copy all links", () => vn.join(`
`), "tiny", t.changed),
              br("batch-csv:" + xt.id, "Copy as CSV", () => ["copy,link", ...vn.map((Ct, Br) => `${Br + 1},${Ct}`)].join(`
`), "tiny", t.changed)
            );
          } else xt.codes.length || te.append(St("span", "links were made on another device", "ppp-mute"));
          Nt.append(te);
        }
        se.append(Nt);
      }
      Y.push(se);
    }
    return b && Y.push(St("p", b, "ppp-cyan")), I && Y.push(St("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), tt.replaceChildren(...Y), tt;
  }
  return { banner: Z, funder: it, renderFold: Xn, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: p, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: P };
}
const V$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Y$(t) {
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
function X$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((o) => (!e.pinnedOnly || e.pins.has(o.slot)) && (() => {
    const i = q$(o);
    return n.every((a) => i.includes(a));
  })()), s = {
    recent: (o, i) => (e.recents[i.slot] ?? 0) - (e.recents[o.slot] ?? 0) || i.slot - o.slot,
    newest: (o, i) => i.slot - o.slot,
    oldest: (o, i) => o.slot - i.slot,
    title: (o, i) => {
      var a, c;
      return (((a = o.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || o.slot - i.slot;
    }
  };
  return r.sort((o, i) => Number(e.pins.has(i.slot)) - Number(e.pins.has(o.slot)) || s[e.sort](o, i));
}
function W$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const kd = /* @__PURE__ */ new Set(), Rf = (t) => (kd.add(t), () => {
  kd.delete(t);
}), Qc = () => {
  for (const t of [...kd])
    try {
      t();
    } catch {
    }
}, G0 = "xtrata:al-thumb:v1:", _b = "-", Xi = 96, Z$ = 24 * 1024 * 1024, cn = /* @__PURE__ */ new Map(), K0 = /* @__PURE__ */ new Set(), $d = [];
let pu = !1, gu;
const Jc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(G0 + t);
    window.localStorage.setItem(G0 + t, e);
  } catch {
  }
  return null;
};
function zf(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return e(t);
      const o = new Image(), i = setTimeout(() => e(t), 8e3);
      o.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(o.naturalWidth, o.naturalHeight);
          if (!a) return e(t);
          r.width = r.height = Xi, s.fillStyle = "#143a40", s.fillRect(0, 0, Xi, Xi), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, Xi, Xi), e(r.toDataURL("image/jpeg", 0.82));
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
async function Q$(t) {
  var c, d, p, u, w;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((d = e.body) == null ? void 0 : d.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((p = e.body) == null ? void 0 : p.cancel()), "";
  let r = "", s = 0;
  const o = (g) => {
    let A = 0;
    for (; ; ) {
      const E = r.slice(A).search(/<img\b/i);
      if (E < 0)
        return r = g ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const T = A + E, O = r.indexOf(">", T);
      if (O < 0)
        return r = r.slice(T), null;
      const H = r.slice(T, O + 1), v = H.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (v) return v[1].replace(/&amp;/g, "&");
      const B = H.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (B) return "/inscription/" + B[1];
      A = O + 1;
    }
  }, i = (w = (u = e.body) == null ? void 0 : u.getReader) == null ? void 0 : w.call(u);
  if (!i)
    return r = await e.text(), o(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: g, value: A } = await i.read();
    if (g) break;
    s += A.byteLength, r += a.decode(A, { stream: !0 });
    const E = o(!1);
    if (E)
      return await i.cancel(), E;
    if (s > Z$)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function J$() {
  if (!pu) {
    pu = !0;
    try {
      for (; $d.length; ) {
        const t = $d.shift();
        if (!cn.has(t))
          try {
            const e = await Q$(t);
            if (e === null) continue;
            if (!e) {
              cn.set(t, ""), Jc(t, _b), Qc();
              continue;
            }
            const n = await zf(e);
            cn.set(t, n), n.startsWith("data:image/jpeg") && Jc(t, n), Qc();
          } catch {
          }
      }
    } finally {
      pu = !1;
    }
  }
}
function Pb(t, e) {
  if (e && !cn.get(t) ? (cn.set(t, e), zf(e).then((r) => {
    r !== e && (cn.set(t, r), r.startsWith("data:image/jpeg") && Jc(t, r), Qc());
  })) : e === "" && !cn.has(t) && cn.set(t, ""), cn.has(t)) return cn.get(t);
  const n = Jc(t);
  if (n != null) {
    const r = n === _b ? "" : n;
    return cn.set(t, r), r;
  }
  return K0.has(t) || (K0.add(t), $d.push(t), gu || (gu = setTimeout(() => {
    gu = void 0, J$();
  }, 1200))), "";
}
const yu = /* @__PURE__ */ new Map(), wu = /* @__PURE__ */ new Set();
function Id(t) {
  return !t || !Number.isSafeInteger(t) || t < 0 ? "" : yu.has(t) ? yu.get(t) : (wu.has(t) || (wu.add(t), fetch("/inscription/" + t, { signal: AbortSignal.timeout(2e4) }).then(async (e) => {
    var r, s, o, i;
    const n = (e.headers.get("content-type") || "").toLowerCase();
    if (!e.ok)
      throw await ((r = e.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = e.body) == null ? void 0 : s.cancel()), "/inscription/" + t) : n.includes("text/html") ? (((o = (await e.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = e.body) == null ? void 0 : i.cancel()), "");
  }).then((e) => {
    yu.set(t, e), Qc();
  }).catch(() => {
    wu.delete(t);
  })), "");
}
const Qo = 12, tI = 5e3, en = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Jo = (t, e, n = "") => {
  const r = en("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function eI(t) {
  let e, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", d = !1, p = Qo;
  const u = en("div", "", "ppp-shelf-box");
  Rf(() => t.changed());
  const w = (M) => "xtrata.radio.shelf.pins.v1:" + M, g = (M) => "xtrata.radio.shelf.recent.v1:" + M, A = (M, N) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? N;
    } catch {
      return N;
    }
  }, E = (M) => new Set(A(w(M), []).filter((N) => Number.isSafeInteger(N))), T = (M) => {
    const N = A(g(M), {}), V = {};
    for (const [z, mt] of Object.entries(N)) Number.isSafeInteger(Number(z)) && typeof mt == "number" && (V[Number(z)] = mt);
    return V;
  };
  async function O(M) {
    if (!s) {
      s = !0, o = !1;
      try {
        const N = [];
        let V = 0, z = 0;
        for (let mt = 0; mt < tI / 100 + 1; mt++) {
          const dt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${V}&limit=100`);
          if (N.push(...Y$(dt == null ? void 0 : dt.shelf)), z = Number(dt == null ? void 0 : dt.total) || N.length, !(dt != null && dt.next) || !Number.isSafeInteger(dt.next)) break;
          V = dt.next;
        }
        M === e && (n = N, r = z, i = t.now());
      } catch {
        o = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const H = () => {
    i = -1 / 0;
  }, v = en("input");
  v.type = "search", v.placeholder = "Search title, artist or #", v.setAttribute("aria-label", "Search your albums"), v.oninput = () => {
    a = v.value, p = Qo, t.changed();
  };
  const B = en("select");
  B.setAttribute("aria-label", "Sort albums");
  for (const M of V$) {
    const N = document.createElement("option");
    N.value = M.value, N.textContent = M.label, B.append(N);
  }
  B.onchange = () => {
    c = B.value, p = Qo, t.changed();
  };
  const P = Jo("", () => {
    d = !d, p = Qo, t.changed();
  }, "tiny"), Z = en("div", "", "ppp-shelf-tools");
  Z.append(v, B, P);
  const it = en("div"), tt = en("div");
  function K(M) {
    const N = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (N !== e && (e = N, n = [], r = 0, i = -1 / 0, p = Qo), !N || M.walletCannotAlbums) return null;
    if (!s && t.now() - i > 5 * 6e4 && O(N), !n.length)
      return o ? (tt.replaceChildren(en("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Jo("Try again", () => {
        i = -1 / 0, t.changed();
      }, "quiet")), u.replaceChildren(tt), u) : null;
    const V = E(N), z = T(N), mt = X$(n, { query: a, sort: c, pinnedOnly: d, pins: V, recents: z });
    v.value !== a && (v.value = a), B.value = c, P.textContent = d ? "★ Pinned only" : "☆ Pinned only", P.setAttribute("aria-pressed", String(d));
    const dt = [];
    if (M.slot > 0 && dt.push(Jo("← My player", () => t.open(0), "quiet")), !mt.length) dt.push(en("p", "No album matches that.", "ppp-mute"));
    else {
      const Kt = en("ul", "", "ppp-shelf-list");
      for (const L of mt.slice(0, p)) {
        const F = en("li", "", L.slot === M.slot ? "now" : ""), ut = V.has(L.slot), Et = Jo(ut ? "★" : "☆", () => {
          const Mt = new Set(V);
          ut ? Mt.delete(L.slot) : Mt.add(L.slot), t.store.set(w(N), JSON.stringify([...Mt])), t.changed();
        }, "tiny");
        Et.setAttribute("aria-label", ut ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const wt = [L.player.subtitle, `${Vr(L.player).length} ${Vr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), $t = L.slot === M.slot, ke = Jo($t ? "Playing" : "Select", () => {
          t.store.set(g(N), JSON.stringify(W$({ ...z, [L.slot]: t.now() }))), t.open(L.slot);
        }, $t ? "tiny ppp-pick" : "tiny primary ppp-pick");
        ke.disabled = $t;
        const Lt = Vr(L.player)[0], Bt = L.player.cover ?? (Lt == null ? void 0 : Lt.id), bt = Bt ? Pb(String(Bt)) : "", Hn = en("span", "", "ppp-shelf-art");
        if (bt) {
          const Mt = document.createElement("img");
          Mt.src = bt, Mt.alt = "", Mt.decoding = "async", Hn.append(Mt);
        } else Hn.textContent = "💿";
        const Ke = en("span", "", "ppp-shelf-txt");
        Ke.append(en("span", L.player.title, "t"), en("span", wt, "ppp-mute")), F.append(Et, Hn, Ke, ke), Kt.append(F);
      }
      dt.push(Kt), mt.length > p && dt.push(Jo(`Show more (${mt.length - p} left)`, () => {
        p += Qo, t.changed();
      }, "quiet"));
    }
    return o && dt.push(en("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), it.replaceChildren(...dt), u.firstChild !== Z && u.replaceChildren(Z, it), u;
  }
  return { render: K, invalidate: H, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = T(e), N = [...n].filter((V) => V.player).sort((V, z) => (M[z.slot] ?? 0) - (M[V.slot] ?? 0) || z.slot - V.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const V0 = "http://www.w3.org/2000/svg", nI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function tl(t = "", e = !1) {
  const n = document.createElementNS(V0, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), t && n.setAttribute("class", t);
  for (const [r, s] of nI) {
    const o = document.createElementNS(V0, "path");
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
}, Ub = (t) => t.toLocaleString(), Y0 = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, rI = (t) => t === "gift" || t === "new" ? 1 : t === "arriving" ? 2 : t === "landed" ? 3 : -1;
function el(t, e) {
  const n = Qt("ol", "al-steps");
  return n.setAttribute("aria-label", e >= t.length ? "All steps done" : `Step ${e + 1} of ${t.length}: ${t[e]}`), t.forEach((r, s) => {
    const o = Qt("li", s < e ? "is-done" : s === e ? "is-now" : "");
    o.append(Qt("i", "", s < e ? "✓" : String(s + 1)), Qt("span", "", r)), n.append(o);
  }), n;
}
function sI() {
  const t = Qt("div", "tier-disc tier-disc--mid");
  return t.dataset.tier = "mystery", t.setAttribute("role", "img"), t.setAttribute("aria-label", "A player waiting to be opened"), t.append(Qt("span", "tier-disc__mark", "?")), t;
}
const oI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], Rr = {
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
}, iI = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${Ub(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, aI = (t) => t ? `Your player holds ${Ub(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", cI = (t) => t ? `You got a ${t.name} player` : Rr.landed.title;
function lI(t, e = !0) {
  const n = Qt("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(Qt("span", "tier-disc__mark", t.mark)), n;
}
function uI(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = Qt("ul", "al-welcome-points");
    for (const [o, i, a] of oI) {
      const c = Qt("li");
      c.title = i;
      const d = Qt("em", "", a);
      d.setAttribute("aria-hidden", "true"), c.append(d, Qt("b", "", o), Qt("span", "", i)), s.append(c);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, o = !1) {
      var u;
      if (!s) {
        n && !o && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = s.mode, s.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const i = Qt("header", "al-top"), a = Qt("a", "al-brand");
      a.href = "/radio", a.append(tl("al-logo"), Qt("span", "", "Xtrata "), Qt("b", "", "Music")), i.append(a);
      const c = Qt("div", "al-body al-body--welcome"), d = Qt("div", "al-welcome"), p = s.mode;
      if (p === "checking")
        d.append(Qt("p", "al-welcome-wait", Rr.checking));
      else {
        const w = rI(p);
        if (w >= 0 && d.append(el(p === "new" ? Y0.fresh : Y0.gift, w)), s.tier && (p === "landed" || p === "back" || p === "empty") ? d.append(lI(s.tier)) : p === "gift" || p === "arriving" ? d.append(sI()) : p === "new" && d.append(tl("al-hero-mark")), d.append(Qt("h1", "", p === "landed" ? cI(s.tier) : p === "back" && s.tier ? `Your ${s.tier.name} player` : Rr[p].title)), d.append(Qt("p", "", p === "gift" ? iI(s.plays, s.from, s.mystery) : p === "landed" ? aI(s.plays) : Rr[p].body)), (p === "landed" || p === "gift") && d.append(r()), s.status.length) {
          const g = Qt("div", "al-status");
          g.setAttribute("role", "status"), g.append(...s.status), d.append(g);
        }
        if (s.asking) d.append(Qt("p", "al-hint al-hint--ask", Rr.asking));
        else if (p === "gift" || p === "new" || p === "back") {
          const g = Rr[p];
          s.canStart && d.append(Qs("al-primary", g.primary, p === "back" ? s.unlock : s.start, s.busy), Qt("p", "al-hint", g.hint)), s.canStart && d.append(Qs("al-link", g.returning, s.returning, s.busy)), d.append(Qs("al-link", g.full, s.full));
        } else if (p === "landed") {
          if (d.append(Qs("al-primary", Rr.landed.primary, s.full)), (u = s.albums) != null && u.length) {
            d.append(Qt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const g of s.albums) {
              const A = Qs("al-album", "", g.run);
              if (g.cover) {
                const T = Qt("img", "al-album__art");
                T.src = g.cover, T.alt = "", A.classList.add("al-album--art"), A.append(T);
              }
              const E = Qt("span", "al-album__t");
              E.append(Qt("b", "", g.title), Qt("span", "", g.by)), A.append(E), d.append(A);
            }
          }
        } else p === "empty" && d.append(Qs("al-primary", Rr.empty.primary, s.restock), Qs("al-link", Rr.empty.full, s.full));
      }
      c.append(d), t.hidden = !1, t.replaceChildren(i, c);
    }
  };
}
const dI = 20, fI = ["Album", "Passkey", "Listen"], Ve = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Le = {
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
function et(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, o] of Object.entries(e))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const tn = (t, ...e) => et("button", { type: "button", ...t }, ...e), lc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Wi = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, hI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, pI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function q0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(b) {
    var M, N, V;
    if (!b || !Number.isSafeInteger(b)) return "";
    const I = (V = (N = (M = e.radio()) == null ? void 0 : M.getState) == null ? void 0 : N.call(M)) == null ? void 0 : V.albumCover;
    return I != null && I.url && Number(I.tokenId) === b ? I.url : Id(b);
  }
  Rf(() => K());
  function d(b) {
    var M;
    o = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const I = document.querySelector(".side");
    if (b && b !== "more") {
      for (const z of pI[b]) {
        const mt = I == null ? void 0 : I.querySelector(z);
        mt && (mt.open = !0);
      }
      const N = document.getElementById("sheetTitle");
      N && (N.textContent = hI[b]);
      const V = document.getElementById("sheetExtra");
      V && V.replaceChildren(...b === "music" ? [u()] : []), (M = I == null ? void 0 : I.scrollTo) == null || M.call(I, { top: 0 });
    }
    K();
  }
  const p = r ? null : document.getElementById("sheetClose");
  p && (p.onclick = () => d("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && o && a.dataset.view === "album" && d("");
  });
  const u = () => tn(
    { class: "al-row", onClick: () => {
      d(""), e.openPlayer();
    } },
    et("span", { class: "al-row-i", html: Le.radio }),
    et("span", { class: "al-row-t" }, et("b", {}, "Xtrata Radio"), et("small", {}, "Every song on-chain · FM, liked, all")),
    et("span", { class: "al-row-go", html: Le.right })
  );
  let w = null, g = !1;
  const A = () => {
    var I;
    const b = e.radio();
    g || !(b != null && b.subscribe) || (g = !0, b.subscribe((M) => {
      w = M, (s == null ? void 0 : s.mode) === "open" && K();
    }), w = ((I = b.getState) == null ? void 0 : I.call(b)) ?? null);
  };
  r || setInterval(() => {
    var N, V;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const b = (V = (N = e.radio()) == null ? void 0 : N.getPosition) == null ? void 0 : V.call(N), I = t.querySelector(".al-bar > i"), M = t.querySelectorAll(".al-times span");
    !b || !I || (I.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", M.length === 2 && (M[0].textContent = lc(b.current || 0), M[1].textContent = b.duration ? lc(b.duration) : "–:––"));
  }, 500);
  let E = "", T = null;
  function O(b, I, M = {}) {
    const N = M.song || c(b.cover), z = [N ? et("img", { src: N, alt: M.song ? "Song artwork" : `${b.title} cover` }) : et("div", { class: "al-cover-fallback" }, et("b", {}, b.title), b.subtitle ? et("span", {}, b.subtitle) : null), M.paused ? et("span", { class: "al-paused" }, et("i", { html: Le.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], mt = "al-cover" + (I ? "" : " al-cover--small") + (M.paused ? " is-paused" : "");
    return M.flip ? (z.push(et("span", { class: "al-flip", "aria-hidden": "true", html: Le.flip })), tn({ class: mt + " is-flippable", "aria-label": M.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: M.flip }, ...z)) : et("div", { class: mt }, ...z);
  }
  function H(b) {
    return b.plays === null || b.plays === void 0 ? et("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? et("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : et("span", { class: "al-chip" + (b.plays <= dI ? " al-chip--low" : "") }, `${Wi(b.plays, "play", "plays")} left`);
  }
  function v(b) {
    const I = b.player, M = I.tracks.filter((V) => !V.hidden), N = [];
    return b.step !== void 0 && N.push(el(fI, b.step)), b.mode === "arrive" && b.from && N.push(et("p", { class: "al-from" }, et("span", { html: Le.gift }), et("span", {}, et("b", {}, b.from), " sent you an album"))), N.push(O(I, !0)), N.push(et(
      "div",
      { class: "al-intro" },
      et("h1", {}, I.title),
      I.subtitle ? et("p", { class: "al-artist" }, I.subtitle) : null,
      M.length ? et("p", { class: "al-songline" }, M.map((V) => V.title || `#${V.id}`).join(" · ")) : null,
      et("span", { class: "al-chip" }, [Wi(M.length, "song", "songs"), b.offered ? Wi(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && N.push(et("div", { class: "al-status", role: "status" }, ...b.status)), N.push(et("div", { class: "al-grow" })), b.asking ? N.push(et("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && N.push(tn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, et("span", { html: Le.playSmall }), b.primary.label)), b.hint && !b.asking && N.push(et("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && N.push(tn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), N;
  }
  function B(b, I) {
    const { songs: M, current: N, started: V, own: z, out: mt, waiting: dt } = I, Kt = b.player, L = e.radio(), F = [];
    F.push(et("div", { class: "al-listhead" }, et("span", {}, et("b", {}, Kt.title), ` · ${Wi(M.length, "song", "songs")}`), H(b)));
    const ut = c(Kt.cover), Et = "album:" + Kt.cover;
    ut && !cn.has(Et) && (cn.set(Et, ut), zf(ut).then(($t) => {
      $t !== ut && (cn.set(Et, $t), K());
    }));
    const wt = ut ? cn.get(Et) || ut : "";
    return F.push(et("ol", { class: "al-tracks" }, ...M.map(($t, ke) => {
      const Lt = String($t.id) === N, Bt = Pb(String($t.id), Lt && V ? z : void 0);
      return et("li", {}, tn(
        { class: "al-track" + (Lt ? " is-on" : ""), "aria-label": `Play ${$t.title || "#" + $t.id}`, "aria-current": Lt ? "true" : void 0, disabled: mt || dt, onClick: () => {
          var bt;
          return (bt = L == null ? void 0 : L.playToken) == null ? void 0 : bt.call(L, $t.id);
        } },
        et(
          "span",
          { class: "al-th" + (Bt ? "" : " is-blank") },
          Bt ? et("img", { src: Bt, alt: "", decoding: "async" }) : wt ? et("img", { src: wt, alt: "", decoding: "async" }) : null,
          Bt ? null : et("span", { class: "al-n" }, String(ke + 1)),
          Lt ? et("span", { class: "al-eq", html: Le.eq }) : null
        ),
        et("span", { class: "al-tt" }, $t.title || `#${$t.id}`, $t.explicit ? et("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), F;
  }
  function P(b) {
    var Bt;
    const I = b.player, M = I.tracks.filter((bt) => !bt.hidden), N = e.radio(), V = w == null ? void 0 : w.nowPlaying, z = V && I.tracks.some((bt) => String(bt.id) === String(V.tokenId)) ? String(V.tokenId) : null, mt = z ? I.tracks.find((bt) => String(bt.id) === z) : null, dt = b.plays === 0 && !b.playsComing, Kt = !!b.playsComing && !b.plays, L = !!(w != null && w.playing) && !!z, F = w == null ? void 0 : w.heart, ut = z ? (Bt = N == null ? void 0 : N.getPosition) == null ? void 0 : Bt.call(N) : null;
    z && (L || ((ut == null ? void 0 : ut.current) ?? 0) > 0.5) && (E = I.id);
    const Et = !!z && E === I.id;
    T && T !== z && (T = null);
    const wt = Et ? String((V == null ? void 0 : V.cover) || "") : "", $t = !!wt && T === z, Lt = [O(I, !dt, { song: $t ? "" : wt, paused: Et && !L, flip: wt ? () => {
      T = T === z ? null : z, K();
    } : void 0, flipped: $t })];
    if (Lt.push(et(
      "div",
      { class: "al-now" },
      et(
        "div",
        { class: "al-now-t" },
        et("div", { class: "al-song" }, mt ? mt.title || (V == null ? void 0 : V.title) || `#${mt.id}` : I.title),
        et("div", { class: "al-artist" }, mt ? mt.artist || (V == null ? void 0 : V.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      z ? tn({ class: "al-icon" + (F != null && F.liked ? " is-on" : ""), "aria-label": F != null && F.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(F != null && F.liked)), disabled: !!(F != null && F.pending) || !!(F != null && F.locked) || Kt, onClick: () => {
        var bt;
        return (bt = N == null ? void 0 : N.toggleLike) == null ? void 0 : bt.call(N);
      }, html: F != null && F.liked ? Le.heartOn : Le.heart }) : null
    )), dt)
      Lt.push(et(
        "div",
        { class: "al-out" },
        et("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        et("p", { class: "al-out-t" }, "You've played this album out"),
        et("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Z(b, !0)
      ));
    else {
      const bt = ut != null && ut.duration ? Math.min(100, ut.current / ut.duration * 100) : 0;
      Lt.push(et(
        "div",
        { class: "al-prog" },
        et("div", { class: "al-bar" }, et("i", { style: `width: ${bt}%` })),
        et("div", { class: "al-times" }, et("span", {}, lc((ut == null ? void 0 : ut.current) || 0)), et("span", {}, ut != null && ut.duration ? lc(ut.duration) : "–:––"))
      ));
    }
    return Lt.push(et(
      "div",
      { class: "al-ctl" + (dt || Kt ? " is-off" : "") },
      tn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: dt || Kt, onClick: () => {
        var bt;
        return (bt = N == null ? void 0 : N.prev) == null ? void 0 : bt.call(N);
      }, html: Le.prev }),
      tn({ class: "al-play", "aria-label": L ? "Pause" : "Play", disabled: dt || Kt, onClick: () => {
        var bt;
        return (bt = N == null ? void 0 : N.playPause) == null ? void 0 : bt.call(N);
      }, html: L ? Le.pause : Le.play }),
      tn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: dt || Kt, onClick: () => {
        var bt;
        return (bt = N == null ? void 0 : N.next) == null ? void 0 : bt.call(N);
      }, html: Le.next })
    )), b.status.length && Lt.push(et("div", { class: "al-status", role: "status" }, ...b.status)), Lt.push(...B(b, { songs: M, current: z, started: Et, own: wt, out: dt, waiting: Kt })), Lt.push(et("div", { class: "al-grow" })), Lt.push(tn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => d(o === "more" ? "" : "more") },
      et("span", {}, "More ", et("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      et("span", { html: Le.down })
    )), Lt;
  }
  function Z(b, I) {
    const M = et("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), N = I ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const V of N) {
      const z = b.myPlays !== void 0 && b.myPlays >= V && !b.playsComing && !b.busy;
      M.append(tn({ class: "al-topup", disabled: !z, onClick: () => e.topUp(V) }, I ? `Add ${V.toLocaleString()} plays` : `+${V.toLocaleString()}`));
    }
    return I && M.append(tn({ class: "al-link", onClick: () => d("more") }, "Other amounts")), M;
  }
  function it(b) {
    const I = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), M = et(
      "div",
      { class: "al-card" },
      et("div", { class: "al-card-h" }, et("b", {}, `Add plays to ${b.player.title}`), et("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      Z(b, !1),
      et("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${Wi(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !b.playsComing && b.myPlays !== void 0 ? tn({ class: "al-link", onClick: () => {
        d(""), e.openPlayer();
      } }, "Open My player") : null
    ), N = (z, mt, dt, Kt) => tn(
      { class: "al-row", onClick: Kt },
      et("span", { class: "al-row-i", html: z }),
      et("span", { class: "al-row-t" }, et("b", {}, mt), et("small", {}, dt)),
      et("span", { class: "al-row-go", html: Le.right })
    ), V = et(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      N(Le.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, K();
      }),
      i ? et("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return et(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      et("div", { class: "al-sheet-h" }, et("b", {}, "More"), tn({ class: "al-icon", "aria-label": "Close", onClick: () => d(""), html: Le.close })),
      b.mode === "open" ? M : null,
      et(
        "div",
        { class: "al-rows" },
        N(Le.grid, "My music", "Your albums and the radio", () => d("music")),
        N(Le.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          d(""), e.openPlayer();
        }),
        b.canMake ? N(Le.gift, "Albums (admin)", "Make an album and fund copies", () => d("gifts")) : null,
        N(Le.device, "This device", "Backup, history, Stacks wallet, returns", () => d("device")),
        V
      )
    );
  }
  function tt(b) {
    var dt, Kt;
    const I = b.player, M = w == null ? void 0 : w.nowPlaying, N = M && I.tracks.some((L) => String(L.id) === String(M.tokenId)) ? String(M.tokenId) : null, V = !!(w != null && w.playing) && !!N, z = N ? (Kt = (dt = e.radio()) == null ? void 0 : dt.getPosition) == null ? void 0 : Kt.call(dt) : null;
    N && (V || ((z == null ? void 0 : z.current) ?? 0) > 0.5) && (E = I.id);
    const mt = !!N && E === I.id;
    return B(b, {
      songs: I.tracks.filter((L) => !L.hidden),
      current: N,
      started: mt,
      own: mt ? String((M == null ? void 0 : M.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function K() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      A(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...tt(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    A(), t.hidden = !1;
    const I = et(
      "header",
      { class: "al-top" },
      et("a", { class: "al-brand", href: "/radio" }, tl("al-logo"), "Xtrata ", et("b", {}, "Music")),
      b.mode === "open" ? tn({ class: "al-icon", "aria-label": "My music", onClick: () => d("music"), html: Le.grid }) : null
    ), M = et("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? P(b) : v(b));
    t.replaceChildren(I, M, ...o === "more" ? [et("div", { class: "al-scrim", onClick: () => d("") }), it(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, K();
        return;
      }
      const I = !!s;
      s = b, !b && (I || o) && (o = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, K();
    },
    sheet: () => o,
    setSheet: d
  };
}
const gI = ["Earned", "Claim", "Yours"], yI = ["Connect", "Link", "Name"], ce = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Ye = (t, e, n, r = !1) => {
  const s = ce("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, X0 = (t, e, n, r = !1) => {
  const s = Ye("al-album", "", n, r), o = ce("span", "al-album__t");
  return o.append(ce("b", "", t), ce("span", "", e)), s.append(o), s;
}, wI = (t) => `No. ${String(t).padStart(4, "0")}`, bI = (t) => t.main ? t.linked ? 2 : 1 : 0;
function mI(t) {
  const e = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = ce("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), s.append(a), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n && (delete e.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.award = i.screen, i.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const c = ce("header", "al-top"), d = ce("a", "al-brand");
      d.href = "/radio", d.append(tl("al-logo"), ce("span", "", "Xtrata "), ce("b", "", "Music")), c.append(d);
      const p = ce("div", "al-welcome"), u = i.screen, w = i.tier.name, g = typeof i.name == "string" && i.name ? i.name : null;
      if (p.append(u === "have" ? el(yI, bI(i)) : el(gI, u === "making" ? 2 : u === "yours" ? 3 : 1)), u === "making") {
        const H = ce("div", "tier-disc tier-disc--mid");
        H.dataset.tier = i.tier.id, H.append(ce("span", "tier-disc__mark", i.tier.mark)), p.append(H);
      } else if (u !== "have" && u !== "get") {
        const H = o(i);
        H.classList.toggle("aw-art--small", u === "name"), p.append(H);
      }
      const A = u === "ready" ? `Your ${w} record is ready` : u === "name" ? "Put your name on it?" : u === "have" ? "Use the name in your wallet" : u === "get" ? "Get a .btc name" : u === "making" ? "Making your record" : "It’s yours";
      p.append(ce("h1", "", A));
      const E = (H, v = "") => p.append(ce("p", v, H)), T = [];
      if (u === "ready")
        E(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), T.push(Ye("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), ce("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), Ye("al-link", "Later", i.later));
      else if (u === "name")
        g ? (E(`Your record will carry ${g} beside your player’s address.`), T.push(Ye("al-primary", `Claim with ${g}`, () => i.claim("auto"), i.busy), Ye("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (E("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), T.push(
          X0("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          X0("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          Ye("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (E("Could not check for a .btc name just now.", "ppp-warn"), T.push(Ye("al-primary", "Check again", i.refresh, i.busy), Ye("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), T.push(ce("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (u === "have")
        i.main ? !i.linked && i.canLink ? (E(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), T.push(Ye("al-primary", "Link my player", i.link, i.busy))) : i.linked ? g ? (E(`Found it: ${g}. It goes on your plaque beside your player’s address.`), T.push(Ye("al-primary", `Claim with ${g}`, () => i.claim("auto"), i.busy))) : (E(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), T.push(Ye("al-primary", "Check again", i.refresh, i.busy))) : (E(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), T.push(Ye("al-primary", "Show me how", () => i.go("get"), i.busy))) : (E("Connect the Leather or Xverse wallet that holds your .btc name."), T.push(Ye("al-primary", "Connect my wallet", i.connect, i.busy))), T.push(Ye("al-link", "Back", () => i.go("name")));
      else if (u === "get") {
        const H = ce("ol", "aw-steps"), v = ce("li");
        v.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const B = ce("a", "", "Open BNS One ↗");
        B.href = "https://bns.one", B.target = "_blank", B.rel = "noopener", v.append(B);
        const P = ce("li");
        P.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", ce("span", "ppp-addr-full", i.player), i.copyAddress());
        const Z = ce("li", "", "Check again, and your name shows on the preview before you claim.");
        H.append(v, P, Z), p.append(H), T.push(Ye("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), Ye("al-link", "Back", () => i.go("name")));
      } else if (u === "making") {
        if (E("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const H = ce("p", "al-hint"), v = ce("a", "", "See the claim on-chain ↗");
          v.href = i.claimLink, v.target = "_blank", v.rel = "noopener", H.append(v), p.append(H);
        }
      } else if (E(`${w} record ${wI(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), T.push(Ye("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const H = ce("a", "al-link", "Open it full screen ↗");
        H.href = `/i/${i.inscription}`, H.target = "_blank", H.rel = "noopener", T.push(H);
      }
      if (i.status.length) {
        const H = ce("div", "al-status");
        H.setAttribute("role", "status"), H.append(...i.status), p.append(H);
      }
      i.asking ? p.append(ce("p", "al-hint al-hint--ask", "Continue in the box below.")) : p.append(...T);
      const O = ce("div", "al-body al-body--welcome");
      O.append(p), t.hidden = !1, t.replaceChildren(c, O);
    }
  };
}
const xI = [
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
function SI(t) {
  for (const [e, n] of xI) if (n.test(t)) return e;
  return null;
}
const Hb = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Ob = (t) => /Android/.test(t);
function EI(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Hb(e) ? "x-safari-" + n.href : Ob(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const AI = (t) => Hb(t) ? "Safari" : Ob(t) ? "Chrome" : "your browser", ti = "Xtrata Music Wallet", vI = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function W0(t, e = (n) => n) {
  var o, i, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((o = t.gate) == null ? void 0 : o.passkeyOnly) || t.linked || ((i = t.others) == null ? void 0 : i.length) ? [{ action: null, label: ti, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const d = t.standIn === c && vI.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${ti} · ${e(c)}`,
      detail: d ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: ti, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: ti, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: ti, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: ti, detail: "Open on this device." });
    }
  return r;
}
const bu = "xtrata.radio.novice", Db = "xtrata.radio.novice.previewed.v1", Z0 = 6 * 6e4;
function kI(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(bu, r), n = r;
    else {
      if (r === "0")
        return e.set(bu, null), { on: !1, preview: !1 };
      n = e.get(bu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const $I = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Q0 = (t) => $I.test(t ?? ""), II = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, LI = {
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
}, CI = (t, e) => LI[t] ?? e;
function TI(t, e) {
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
const BI = "Make your player once, with Face ID or your fingerprint, and the music starts.", MI = "Checking your player…", Ld = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Fb(t) {
  try {
    const e = JSON.parse(t.get(Db) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function NI(t, e) {
  const n = Fb(t).filter((r) => r !== e);
  n.push(e), t.set(Db, JSON.stringify(n.slice(-50)));
}
function mu(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...Ld(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : Ld();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > Z0 ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > Z0 ? { ...t, phase: "done" } : t;
  }
}
const uc = (t) => t.phase === "open" || t.phase === "playing";
function _I(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const PI = [100, 250, 500, 1e3], UI = (t, e = cr) => BigInt(t) * rn(e);
function HI(t, e = cr, n = 0n) {
  const r = Gr - t - n;
  return r > 0n ? Number(r / rn(e)) : 0;
}
function OI(t, e = cr, n = 0n) {
  const r = t === void 0 ? 0 : HI(t, e, n);
  return PI.map((s) => ({ plays: s, stx: UI(s, e), fits: t !== void 0 && s <= r }));
}
const DI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, FI = (t) => DI[t.unit](t.amount), Ee = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Ec = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function jI(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${Ec(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${Ec(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${Ec(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function RI(t) {
  let e = null, n = 0, r = "stx";
  const s = (i) => {
    var c;
    if (i.some((d) => d.plays === n && d.fits)) return;
    const a = i.filter((d) => d.fits);
    n = ((c = a.find((d) => {
      var p;
      return d.plays === ((p = i[1]) == null ? void 0 : p.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function o() {
    var g;
    if (!e) return;
    const i = t.input();
    if (!i) {
      e.close();
      return;
    }
    const a = OI(i.balance, i.fee, i.incoming);
    s(a);
    const c = _I(i.switches);
    (g = c.find((A) => A.id === r)) != null && g.on || (r = "stx");
    const d = [], p = Ee("h2", "ppp-connect__title", "Add plays");
    p.id = "ppp-restock-title", d.push(p), d.push(Ee("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Ec(i.playsLeft, "play", "plays")} left.`));
    const u = jI(i.done);
    if (u && d.push(Ee("p", "ppp-restock__done", u)), i.arriving)
      d.push(Ee("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      d.push(Ee("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((A) => A.fits))
      d.push(Ee("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const A = Ee("div", "ppp-restock__packs");
      A.setAttribute("role", "group"), A.setAttribute("aria-label", "How many plays");
      for (const O of a) {
        const H = Ee("button", "ppp-restock__pack" + (O.plays === n ? " is-on" : ""));
        H.type = "button", H.disabled = !O.fits, H.setAttribute("aria-pressed", String(O.plays === n)), H.append(Ee("b", "", O.plays.toLocaleString()), Ee("span", "", "plays")), H.onclick = () => {
          n = O.plays, o();
        }, A.append(H);
      }
      d.push(A);
      const E = Ee("div", "ppp-restock__ways");
      E.setAttribute("role", "group"), E.setAttribute("aria-label", "How to pay");
      for (const O of c) {
        const H = Ee("button", "ppp-restock__way" + (O.id === r ? " is-on" : ""));
        H.type = "button", H.disabled = !O.on, H.setAttribute("aria-pressed", String(O.id === r)), H.append(Ee("b", "", O.label), Ee("span", "", O.on ? O.blurb : "Soon")), H.onclick = () => {
          r = O.id, o();
        }, E.append(H);
      }
      d.push(E);
      const T = a.find((O) => O.plays === n);
      if (T && r === "stx") {
        const O = Ee("div", "ppp-restock__pay"), H = FI({ unit: "microSTX", amount: T.stx }), v = Ee("p", "ppp-restock__amount");
        v.append("Send ", Ee("b", "", H), " to your player:"), O.append(v, Ee("p", "ppp-addr-full ppp-restock__addr", i.address));
        const B = Ee("div", "ppp-restock__row");
        B.append(t.copyButton("restock-address", "Copy address", () => i.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => er(T.stx), "")), O.append(B), O.append(Ee("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), d.push(O);
      }
    }
    d.push(Ee("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Ee("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => e == null ? void 0 : e.close(), d.push(w), e.replaceChildren(...d);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = Ee("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = e;
      i.addEventListener("close", () => {
        i.remove(), e === i && (e = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), o(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: o,
    close() {
      e == null || e.close();
    }
  };
}
const Yr = (t) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), zI = (t) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
function GI(t, e) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(t) ? t : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = e(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: zI(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function KI(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.artist) continue;
    const r = Yr(n.artist), s = e.get(r);
    s ? s.songs++ : e.set(r, { name: n.artist, songs: 1 });
  }
  return [...e.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function VI(t, e, n = "", r = 60) {
  const s = Yr(e).split(/\s+/).filter(Boolean), o = Yr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of t) {
    const c = Yr(a.artist), d = Yr(a.title), p = String(a.id);
    if (o && c !== o) continue;
    let u = 0, w = !0;
    for (const g of s) {
      const A = g.replace(/^#/, "");
      if (d.includes(g)) u += d.startsWith(g) ? 0 : 1;
      else if (/^\d+$/.test(A) && p === A) u += 0;
      else if (c.includes(g)) u += 2;
      else if (/^\d+$/.test(A) && p.startsWith(A)) u += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: u });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const Zn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, J0 = 12;
function YI(t, e) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = Zn("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Zn("div", "hint"), d = Zn("div", "find-artists"), p = Zn("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const u = Zn("div", "likesTools");
  u.append(a), t.replaceChildren(u, c, d, p), a.oninput = () => {
    s = a.value, g();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", g(), e.load().then((A) => {
      n = A, r = "ready", g();
    }, () => {
      r = "failed", g();
    }));
  }
  function g() {
    const A = e.locked();
    if (a.disabled = A, A) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", d.replaceChildren(), p.replaceChildren();
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
      const B = Zn("button", "", "Try again");
      B.type = "button", B.onclick = () => {
        r = "idle", w();
      }, c.append(B), d.replaceChildren(), p.replaceChildren();
      return;
    }
    const E = KI(n), T = i ? E : E.slice(0, J0), O = (B, P, Z, it = "") => {
      const tt = Zn("button", "find-chip" + (P ? " is-on" : ""), B);
      return tt.type = "button", tt.setAttribute("aria-pressed", String(P)), it && (tt.title = it), tt.onclick = Z, tt;
    };
    d.replaceChildren(
      ...T.map((B) => O(`${B.name} · ${B.songs}`, Yr(B.name) === Yr(o), () => {
        o = Yr(B.name) === Yr(o) ? "" : B.name, g();
      }, `Show ${B.name}’s ${B.songs === 1 ? "song" : `${B.songs} songs`}`)),
      ...E.length > J0 ? [O(i ? "Fewer artists" : `All ${E.length} artists`, !1, () => {
        i = !i, g();
      })] : []
    );
    const H = VI(n, s, o), v = e.current();
    p.replaceChildren(...H.songs.map((B) => {
      var it;
      const P = Zn("li", "lrow" + (B.id === v ? " now" : "")), Z = Zn("button", "lt", B.title);
      if (Z.type = "button", Z.title = `Play “${B.title}”${B.artist ? ` by ${B.artist}` : ""}`, Z.onclick = () => e.play(B.id), (it = e.explicit) != null && it.call(e, B.id)) {
        const tt = Zn("span", "exp", "E");
        tt.title = "Explicit lyrics: only plays when you choose it", Z.append(" ", tt);
      }
      return P.append(Z, Zn("span", "find-by", `${B.artist ? B.artist + " · " : ""}#${B.id}`)), P;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${E.length.toLocaleString()} artists. Search, or pick an artist.` : H.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : H.total > H.songs.length ? `Showing ${H.songs.length} of ${H.total.toLocaleString()}. Type more to narrow it down.` : `${H.total} ${H.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: g };
}
const ia = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], dc = (t) => typeof t == "string" && ia.some((e) => e.id === t), fc = (t) => ia.find((e) => e.id === t), qI = (t) => ia.find((e) => t >= e.min) ?? ia[ia.length - 1];
function XI(t, e = cr) {
  return qI(t <= Pe ? 0 : Number((t - Pe) / rn(e)));
}
const tg = (t, e, n) => zd(Vd(new TextEncoder().encode(`xtrata-music-hero:${t}:${e}:${n}`))).slice(0, 8), eg = document.getElementById("ppp");
eg && WI(eg);
function WI(t) {
  var os;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = pm(), s = (l) => t.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, m) => {
    const y = await fetch(l, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), h = await y.json().catch(() => ({}));
    if (!y.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${y.status}).`);
    return h;
  }, c = G5({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var y;
      const m = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((y = m == null ? void 0 : m.find((h) => h.listening === l)) == null ? void 0 : y.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const m = new Promise((S, C) => {
        i.addEventListener("load", () => S(), { once: !0 }), setTimeout(() => C(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await m;
      const y = new om({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), f = (S, C) => h.has(S) ? y.request(S, C) : Promise.race([
        y.request(S, C),
        new Promise((U, J) => setTimeout(() => J(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await f("listening.status"), { request: f };
    },
    chain: {
      verify: A5,
      balance: k5,
      account: v5,
      owner: $5,
      broadcast: I5,
      transaction: L5,
      confirmedNonce: async (l) => {
        const m = await Os(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (l, m) => E0({ ...m, network: "mainnet", stxAddress: l }),
    deposit: (l, m, y) => new Promise((h, f) => w0({
      recipient: m,
      amount: y.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new xu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (S) => h(S.txId || ""),
      onCancel: () => f(new Error("Deposit cancelled. Nothing was sent.")),
      onError: f
    })),
    validate: C5,
    tabLock: (l) => new Promise((m) => {
      const y = navigator.locks;
      if (!(y != null && y.request)) {
        m(!0);
        return;
      }
      y.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (h) => {
        m(!!h), h && await new Promise(() => {
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
      set: (l, m) => {
        try {
          localStorage.setItem(l, m);
        } catch {
        }
      }
    },
    changed: () => Zt(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var m, y;
      return d.funder(l, () => P5(l, Os), !!((y = (m = c.snapshot().gate) == null ? void 0 : m.gifts) != null && y.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const m = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), y = m == null ? void 0 : m.gift;
      if (!y) return null;
      if (typeof y.returnTo != "string" || typeof y.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: y.returnTo, from: typeof y.from == "string" ? y.from : null, source: String(y.source ?? ""), amount: String(y.amount ?? "0"), treasury: y.treasury, state: y.state === "sending" ? "sending" : "arrived", player: y.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (l) => {
      const m = await a("/radio/awards/status?address=" + encodeURIComponent(l));
      if (typeof (m == null ? void 0 : m.state) != "string") throw new Error("Unreadable award status.");
      return m;
    },
    awardName: async (l) => {
      const m = await a("/radio/awards/name?address=" + encodeURIComponent(l));
      if ((m == null ? void 0 : m.name) !== null && typeof (m == null ? void 0 : m.name) != "string") throw new Error("Unreadable name.");
      return m.name;
    },
    awardNote: async (l, m) => {
      const y = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: m }) });
      if (typeof (y == null ? void 0 : y.record) != "string" || typeof (y == null ? void 0 : y.signature) != "string" || !Number.isSafeInteger(y == null ? void 0 : y.cls) || !Number.isSafeInteger(y == null ? void 0 : y.number) || !Number.isSafeInteger(y == null ? void 0 : y.plays)) throw new Error("Unreadable award note.");
      return { cls: y.cls, number: y.number, plays: y.plays, record: y.record, signature: y.signature, name: typeof y.name == "string" ? y.name : null };
    },
    history: (l, m) => O5(l, (y) => Os(y), m),
    likesChanged: () => {
      var l, m;
      (m = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || m.call(l);
    },
    likeState: async (l, m) => {
      const y = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(m) })), h = Array.isArray(y == null ? void 0 : y.rows) ? y.rows.find((f) => (f == null ? void 0 : f.id) === m) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((f) => typeof f == "string") : h.liked ? [l] : [] };
    },
    likeSent: (l, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: m } })),
    nameOf: (l) => $e(l) ?? void 0,
    likeConfirmed: (l, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: m } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), d = K$({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, m, y, h) => new Promise((f, S) => w0({
      recipient: m,
      amount: y.toString(),
      memo: h,
      stxAddress: l,
      network: new xu(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (C) => f(C.txId || ""),
      onCancel: () => S(new Error("Gift cancelled. Nothing was sent.")),
      onError: S
    })),
    sign: (l, m) => E0({ ...m, network: "mainnet", stxAddress: l }),
    giftSent: (l, m) => c.giftSent(l, m),
    claiming: (l) => c.giftClaiming(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, m, y, h) => {
      p.invalidate(), await c.albumArriving(l, m, y, h);
    } },
    who: (l) => Ct(l),
    changed: () => Zt(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, m) => {
        try {
          m === null ? localStorage.removeItem(l) : localStorage.setItem(l, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), p = eI({
    json: a,
    open: (l) => {
      c.openAlbum(l);
    },
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, m) => {
        try {
          m === null ? localStorage.removeItem(l) : localStorage.setItem(l, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Zt(c.snapshot())
  }), u = {
    get: (l) => {
      try {
        return localStorage.getItem(l);
      } catch {
        return null;
      }
    },
    set: (l, m) => {
      try {
        m === null ? localStorage.removeItem(l) : localStorage.setItem(l, m);
      } catch {
      }
    }
  }, w = kI(location.search, u);
  w.on && (document.documentElement.dataset.novice = w.preview ? "preview" : "1");
  const g = (l) => w.on && l.solo, A = w.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), E = A ? document.getElementById("album") : null, T = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, O = E ? q0(E, T) : null, H = E ? mI(E) : null, v = "xtrata.radio.award.later.v1";
  let B = "ready", P = !1, Z = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(v) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), it = !1;
  const tt = "xtrata.radio.tier.v1";
  let K = (() => {
    const l = u.get(tt);
    return dc(l) ? fc(l) : null;
  })();
  const b = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function I(l) {
    var f;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let S = null;
      try {
        S = l.gift && !l.gift.player && l.gift.drop === "players" ? XI(BigInt(l.gift.amount)) : null;
      } catch {
        S = null;
      }
      ((f = l.award) == null ? void 0 : f.state) === "claimed" && l.award.holds === !1 && (S = null), ((S == null ? void 0 : S.id) ?? null) !== ((K == null ? void 0 : K.id) ?? null) && (K = S, u.set(tt, S ? S.id : null));
    }
    const m = document.documentElement;
    K ? m.dataset.tier = K.id : delete m.dataset.tier;
    const y = document.querySelector("#ppp .ppp-head h3");
    if (!y) return;
    let h = y.querySelector(".ppp-tier");
    if (!K) {
      h == null || h.remove();
      return;
    }
    h || (h = k("span", "", "ppp-tier"), y.append(h)), h.dataset.tier = K.id, h.textContent = `${K.mark} ${K.name.toUpperCase()} PLAYER`, h.title = `A ${K.name} player from the Xtrata Music giveaway`;
  }
  const M = w.on && E ? uI(E) : null, N = Date.now();
  let V = !1, z = null, mt = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const dt = () => {
    mt = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    Zt(c.snapshot());
  }, Kt = (l, m) => {
    var f;
    if (!M || m || mt) return null;
    if (!l.gate || l.step === "loading" || (V = !0), !V) return Date.now() - N < 1e4 ? "checking" : null;
    if (!g(l)) return null;
    if (l.step === "intro" || l.step === "unsupported") return d.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const h = l.slot === 0 && !((f = l.gift) != null && f.player) && !l.entries.some((S) => S.kind === "play");
    return l.step === "fund" && h ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && h && (z === "arriving" || z === "landed") ? "landed" : l.step === "loading" && z !== "checking" ? z : null;
  };
  let L = !1;
  function F(l, m, y = [], h) {
    if (!M) return;
    const f = h !== void 0 ? h : Kt(l, m);
    if (z = f, delete document.documentElement.dataset.noviceBoot, !f) {
      M.render(null, m);
      return;
    }
    const S = [...y];
    f === "arriving" && l.arrival && S.push(Nr(l.arrival)), l.step === "unsupported" ? S.push(k("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && S.push(k("p", l.error, "ppp-warn"));
    const C = f === "gift" ? d.incomingStarter() : null;
    C && !L && l.step === "intro" && !l.busy && !l.armed && !l.error && !te && (L = !0, c.create({ quick: !0 })), M.render({
      mode: f,
      status: S,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !te,
      plays: C ? C.plays : f === "landed" ? l.playsLeft : null,
      from: (C == null ? void 0 : C.from) ?? null,
      tier: K,
      mystery: b,
      albums: f === "landed" ? ne.map((U) => ({ title: U.title, by: U.subtitle, cover: Id(U.cover), run: () => {
        dt(), Ze(U, !0);
      } })) : [],
      start: () => void c.create({ quick: !!d.incomingStarter() }),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => wt(),
      full: () => {
        var D, Q, q;
        const U = window.XtrataRadio, J = f === "landed" && !((Q = (D = U == null ? void 0 : U.getState) == null ? void 0 : D.call(U)) != null && Q.playing);
        dt(), J && ((q = U == null ? void 0 : U.playPause) == null || q.call(U));
      }
    });
  }
  M && setTimeout(() => {
    V || Zt(c.snapshot());
  }, 10100), Rf(() => {
    (M != null && M.showing() || document.documentElement.dataset.asking) && Zt(c.snapshot());
  });
  const Et = RI({
    input: () => {
      var f, S, C, U;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const m = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (f = l.likeFunds) == null ? void 0 : f.balance };
      if (!m.address) return null;
      const y = l.slot === 0 ? l.entries : [], h = y.filter((J) => J.kind === "play" && J.status === "confirmed");
      return {
        playsLeft: m.balance === void 0 ? null : At(m.balance),
        balance: m.balance,
        incoming: 0n,
        fee: BigInt(((S = l.gate) == null ? void 0 : S.limits.playFee) ?? "300"),
        address: m.address,
        switches: ((C = l.gate) == null ? void 0 : C.restock) ?? {},
        backedUp: l.backedUp,
        done: h.length ? { plays: h.length, artists: new Set(h.map((J) => J.recipient)).size, likes: y.filter((J) => J.kind === "like" && J.status === "confirmed" && J.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((U = l.likeFunds) != null && U.pending)
      };
    },
    copyButton: (l, m, y, h) => br(l, m, y, h, () => {
      Zt(c.snapshot());
    })
  }), wt = () => {
    if (!c.snapshot().unproven) {
      Et.open();
      return;
    }
    c.prove().then((l) => {
      l && Et.open();
    });
  }, $t = document.getElementById("albumList"), ke = $t ? q0($t, T, { list: !0 }) : null, Lt = "xtrata.radio.album.last.v1", Bt = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Lt) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let bt = "";
  const Hn = (l) => {
    const m = JSON.stringify(l);
    if (m !== bt) {
      bt = m;
      try {
        localStorage.setItem(Lt, m);
      } catch {
      }
    }
  };
  let Ke = null;
  window.XtrataRadioLikeHandler = (l) => {
    var y;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (y = c.snapshot().likeFunds) != null && y.album && ($ = !0), Mr();
    const m = zs(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Mt;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const pn = (l) => {
    var y, h;
    const m = window.XtrataRadioListeningIdentity();
    m !== Mt && (Mt = m, (h = (y = window.XtrataRadio) == null ? void 0 : y.refreshLikes) == null || h.call(y));
  };
  let ne = [], gn = 0, An = !1, ye = null;
  const We = (l) => {
    var m, y;
    An || !((y = (m = l.gate) == null ? void 0 : m.gifts) != null && y.enabled) || Date.now() - gn < 6e4 || (gn = Date.now(), a("/radio/gift/featured").then((h) => {
      ne = (Array.isArray(h == null ? void 0 : h.players) ? h.players : []).filter((f) => f && typeof f.id == "string" && typeof f.title == "string" && Array.isArray(f.tracks) && f.tracks.length > 0).slice(0, 6), An = !0, ne.length && Zt(c.snapshot());
    }).catch(() => {
    }));
  }, Re = (l) => {
    var m;
    return ye && l.slot === 0 && !((m = l.gift) != null && m.player) && ["ready", "fund", "loading"].includes(l.step) ? ye : null;
  }, Ze = (l, m = !1) => {
    var h, f;
    ye = l, Zt(c.snapshot());
    const y = l && m ? Vr(l)[0] : null;
    y && ((f = (h = window.XtrataRadio) == null ? void 0 : h.playToken) == null || f.call(h, y.id));
  };
  let Dt = Ld(), re = null;
  const Qe = (l) => {
    const m = w.preview && !te && l.step === "intro" ? d.incomingAlbum() : null;
    return m ? (Dt = mu(Dt, { kind: "offer", album: m.player.id, already: Fb(u).includes(m.player.id) }), uc(Dt) ? m.player : null) : (Dt = mu(Dt, { kind: "withdraw" }), null);
  }, ze = (l) => {
    const m = Dt.phase;
    Dt = mu(Dt, l), Dt.phase !== m && (Dt.album && (Dt.phase === "playing" || Dt.phase === "done") && NI(u, Dt.album), Zt(c.snapshot()));
  };
  setInterval(() => {
    Dt.phase === "playing" && ze({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Me = "", pe, we = !1, Xn = !1;
  const lr = (l, m) => {
    var q, X, rt, gt, Xt, oe, x, _;
    const y = window.XtrataRadio;
    if (!(y != null && y.setGiftPlayer) || !(y != null && y.setGiftStop)) return;
    const h = m.depositPending && l.step === "fund" && ((q = l.giftStop) == null ? void 0 : q.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, f = re, S = h ? g(l) ? CI(h.reason, h.text) : h.text : null, C = f ? null : S ?? (e && (!((X = l.gate) != null && X.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    C && C !== pe && (y.setGiftStop(C), pe = C);
    const U = l.step === "off" || l.step === "elsewhere" ? null : ((rt = l.gift) == null ? void 0 : rt.player) ?? f ?? Re(l) ?? null, J = U ? U.id + ":" + U.cover + ":" + U.tracks.map((R) => R.id).join(",") : "";
    J !== Me && (y.setGiftPlayer(U ? { id: U.id, title: U.title, subtitle: U.subtitle, tracks: Vr(U).map((R) => R.id), hidden: ((gt = R$(U)) == null ? void 0 : gt.id) ?? null, cover: U.cover } : null), Me = J), C !== pe && (y.setGiftStop(C), pe = C);
    const D = (h == null ? void 0 : h.reason) === "arriving";
    D !== Xn && ((Xt = y.setGiftWait) == null || Xt.call(y, D), Xn = D);
    const Q = !!U && (!!f || !!((oe = l.albumLock) != null && oe.locked));
    Q !== we && ((x = y.setGiftLock) == null || x.call(y, Q), we = Q), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((_ = y.forgetWallets) == null || _.call(y));
  };
  let $ = !1;
  const G = /* @__PURE__ */ new Map(), j = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((h) => h.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let y = G.get(l.listening);
    return y === void 0 && (y = Date.now(), G.set(l.listening, y)), Date.now() - y < Xc ? y : null;
  }, Y = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((m) => m.kind === "play") && !!l.listening && G.has(l.listening), ht = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", At = (l) => {
    const m = c.snapshot().playCost || 350n;
    return l > Pe ? Number((l - Pe) / m) : 0;
  }, se = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), be = (l) => {
    const m = Math.round((Date.now() - l) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, Rt = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, k = (l, m = "", y = "") => {
    const h = document.createElement(l);
    return m && (h.textContent = m), y && (h.className = y), h;
  }, at = (l, m, y = "") => {
    const h = k("button", l, y);
    return h.type = "button", h.onclick = m, h;
  }, vt = (l, m) => {
    const y = k("a", l);
    return y.href = m, y.target = "_blank", y.rel = "noopener", y;
  };
  let Nt = null, xt = location.hash === "#give";
  xt && history.replaceState(null, "", location.pathname + location.search);
  let qt = !1;
  const ue = I$((l) => $$({ address: l, network: "mainnet" }), () => Zt(c.snapshot())), $e = (l) => ue.get(l), te = SI(navigator.userAgent), vn = (l, m) => {
    const y = navigator.userAgent, h = AI(y), f = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, S = [k("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your ${w.on ? "player" : "listening wallet"}${m ? w.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], C = k("div", "", "ppp-open-row"), U = EI(f, y);
    if (U) {
      const J = k("a", `Open in ${h}`, "primary ppp-open-in");
      J.href = U, J.dataset.homeAction = "radio:open-in-browser", C.append(J);
    }
    return C.append(br("copy-page-link", "Copy link", () => f, U ? "" : "primary", () => Zt(c.snapshot()))), S.push(C, k("p", `If that does not open ${h}, use ${l}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), S;
  }, Ct = (l) => $e(l) ?? ht(l), Br = (l) => l.slice(0, 2).map(Ct).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), On = /* @__PURE__ */ new Map();
  let Qr = !1;
  const Rs = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Mr = () => {
    Qr || (Qr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const m of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const y = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(y) && On.set(y, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      Zt(c.snapshot());
    }).catch(() => {
      Qr = !1;
    }));
  }, zs = (l, m) => {
    const y = On.get(l), h = U0(l, [y == null ? void 0 : y.title, m == null ? void 0 : m.title].find((S) => !Rs(S)) || ""), f = _0(l, (y == null ? void 0 : y.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: h, artist: f };
  }, Jr = (l) => {
    const { title: m, artist: y } = zs(l.song, l);
    return m ? `“${m}”${y ? ` — ${y}` : ""}` : `Song #${l.song}${y ? ` — ${y}` : ""}`;
  }, yn = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Oo = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function _i(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function kn(l, m, y = "", h) {
    const f = k("dt", l), S = k("dd", m, y);
    return h && S.append(" ", h), [f, S];
  }
  const $n = document.getElementById("ppp-top"), on = () => {
    (o.hidden || o.classList.contains("ppp-frame--rest") ? t : o).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, an = () => {
    var m;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (m = document.getElementById("radio-wallet-connect")) == null || m.click();
  }, Do = () => {
    var m, y;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      an();
      return;
    }
    if (l.step === "elsewhere" && ((m = l.gate) != null && m.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((y = l.giftStop) == null ? void 0 : y.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      wt();
      return;
    }
    on();
  };
  $n && ($n.onclick = Do);
  const Gt = (l, m, y, h = "") => l.standIn && !l.mainConnected ? at(`Connect ${Ct(l.standIn)} to add STX`, an, h) : at(m, y, h), Ne = (l) => {
    c.useLinked(l).then(() => on());
  };
  let ur = null;
  const Gs = () => {
    const l = W0(c.snapshot(), Ct);
    return l.length ? ur || (ur = new Promise((m) => {
      var Q;
      const y = k("dialog", "", "ppp-connect");
      y.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const f = (q) => {
        h = q, y.close();
      };
      y.addEventListener("close", () => {
        y.remove(), ur = null, m(h);
      }), y.addEventListener("click", (q) => {
        q.target === y && f(null);
      });
      const S = (q, X, rt, gt, Xt = !1) => {
        const oe = k("button", "", "ppp-connect__opt " + rt);
        return oe.type = "button", oe.disabled = Xt, oe.onclick = gt, oe.append(k("b", q), k("span", X)), oe;
      }, C = k("h2", "Connect", "ppp-connect__title");
      C.id = "ppp-connect-title";
      const U = l.map((q) => S(q.label, q.detail, "is-music", () => {
        if (f("music"), q.action === "linked" && q.main) {
          Ne(q.main);
          return;
        }
        const X = W0(c.snapshot(), Ct).find((rt) => rt.action !== "linked");
        (X == null ? void 0 : X.action) === "create" ? c.create() : (X == null ? void 0 : X.action) === "unlock" && c.unlock(), on();
      }, !!q.disabled)), J = S("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => f("stacks")), D = at("Cancel", () => f(null), "quiet ppp-connect__cancel");
      y.append(C, ...U, J, D), document.body.appendChild(y), y.showModal(), (Q = U.find((q) => !q.disabled)) == null || Q.focus();
    }), ur) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Gs;
  function Wn(l) {
    if (!$n) return;
    const m = (h, f, S) => {
      $n.hidden = !1, $n.className = "ppp-top" + (f ? " is-" + f : ""), $n.replaceChildren(k("span", "", "dot"), document.createTextNode(h)), $n.title = S;
    }, y = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
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
        return m(`Connect ${Ct(l.linked)}`, "warn", `This device's listening wallet belongs to ${Ct(l.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return l.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(l.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return l.payingOn && y > 0 && !l.giftStop ? m(`${y.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Ie = document.getElementById("pppNudge"), wn = document.getElementById("onair");
  (os = Ie == null ? void 0 : Ie.querySelector("button")) == null || os.addEventListener("click", () => Do());
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
  function Vs(l) {
    if (l.step === "loading") return;
    const m = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, y = l.step === "ready" && l.payingOn && m > 0 && !l.giftStop, h = l.step === "fund" && l.depositPending, f = l.step === "elsewhere" && !e, S = y || h || f ? "" : bn[l.step] ?? "", C = y ? "on" : f ? "free" : S ? "off" : "";
    C ? document.documentElement.dataset.ppp = C : delete document.documentElement.dataset.ppp, wn && (wn.hidden = !C || C === "free", wn.querySelector(".onair-sub").textContent = y ? `${m.toLocaleString()} plays left` : "Plays off"), Ie && (Ie.hidden = C !== "off" && C !== "free", Ie.classList.toggle("is-free", C === "free"), C === "free" ? (Ie.querySelector(".nudge-t").textContent = "You’re on the free player", Ie.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Ie.querySelector("button").textContent = "Get a player") : C === "off" && (Ie.querySelector(".nudge-t").textContent = S, Ie.querySelector(".nudge-s").textContent = g(l) ? l.step === "intro" ? BI : "" : "This radio requires a funded listening wallet with music support on.", Ie.querySelector("button").textContent = Ks[l.step] ?? "Start"));
  }
  let Ys = "";
  function ts(l) {
    const m = k("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && m.append(k("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && m.append(k("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const y = k("input");
    y.type = "text", y.placeholder = "SP… address to send returns to", y.autocomplete = "off", y.spellcheck = !1, y.setAttribute("aria-label", "Address to return funds to"), y.value = Ys, y.oninput = () => {
      Ys = y.value;
    };
    const h = at(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(y.value), Ys = "";
    }, "tiny");
    return m.append(y, " ", h), l.returnToKind === "chosen" && m.append(" ", at("Back to the funder", () => c.clearReturnAddress(), "tiny")), m;
  }
  const es = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Pi() {
    const l = k("p", es + " ", "ppp-mute");
    return l.append(vt("Xverse", "https://www.xverse.app/download"), " · ", vt("Leather", "https://leather.io/install-extension")), l;
  }
  let ns = "";
  const In = (l) => {
    const m = document.documentElement, y = l.solo && !l.main ? l.listening ? ht(l.listening) : "new" : "", h = X5() ? "1" : "", f = l.standIn && !l.mainConnected ? Ct(l.standIn) : "";
    `${y}|${h}|${f}` !== ns && (ns = `${y}|${h}|${f}`, y ? m.dataset.pppSolo = y : delete m.dataset.pppSolo, f ? m.dataset.pppAs = f : delete m.dataset.pppAs, h ? m.dataset.pppWalletInstalled = h : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => Zt(c.snapshot()), l);
  function Fo(l, m = "") {
    const y = k("div", "", "ppp-topup"), h = qs(l);
    y.append(k("span", "Add plays from My player: ", "ppp-mute"));
    for (const f of Sc) {
      const S = at(`+${f.toLocaleString()}`, () => void c.topUpAlbum(f), m);
      S.disabled = h === void 0 || h < f || l.depositPending || !!l.busy, y.append(S);
    }
    return h !== void 0 && h < Sc[0] && y.append(k("p", "My player needs plays first (switch to My player above).", "ppp-mute")), y;
  }
  const qs = (l) => {
    var h;
    const m = (h = l.likeFunds) == null ? void 0 : h.balance;
    if (m === void 0 || !l.playCost) return;
    const y = m - Pe - 6000n;
    return y > 0n ? Number(y / l.playCost) : 0;
  };
  function Ui(l) {
    const m = l.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    if (m.low || ($ = !1), m.low && !$) return [];
    const y = k("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      if (!m.txid) return [];
      const f = k("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return m.txid && f.append(vt("View", Rt(m.txid))), y.append(f), [y];
    }
    y.append(k("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), y.append(k("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), y.append(k("p", m.address, "ppp-addr-full"));
    const h = k("div", "", "ppp-open-row");
    if (h.append(br("copy-likes-address", "Copy address", () => m.address, "primary", () => Zt(c.snapshot()))), m.main && !l.solo) {
      const f = Gr - (m.balance ?? 0n);
      f > 0n && h.append(Gt(l, `Pay ${er(f)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return y.append(h), y.append(k("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [y];
  }
  const Nr = (l) => {
    const m = k("div", "", "ppp-wait");
    m.dataset.since = String(l.since), m.dataset.grace = String(l.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const y = k("p", "", "ppp-wait-t"), h = k("div", "", "ppp-wait-track");
    return h.append(k("div", "", "ppp-wait-fill")), m.append(y, h), rs(m), m;
  };
  function rs(l) {
    const m = Number(l.dataset.since), y = Number(l.dataset.grace) || 6e4, h = Math.max(0, Date.now() - m), f = l.querySelector(".ppp-wait-fill"), S = l.querySelector(".ppp-wait-t");
    if (h < y) {
      const C = Math.ceil((y - h) / 1e3);
      f.style.width = Math.max(4, Math.min(95, h / y * 100)).toFixed(0) + "%", S.textContent = `Your plays are arriving… usually about a minute · ${C}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(h / y * 100)));
    } else
      f.style.width = "", S.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let Dn = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      Dn = 0;
      return;
    }
    l.forEach(rs), ++Dn % 10 === 0 && Zt(c.snapshot());
  }, 1e3);
  let _r = null;
  function jo(l) {
    if (l.step === "loading" && _r !== null) return;
    const y = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!d.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    y !== _r && (_r = y, y ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function Zt(l) {
    var qf, Xf, Wf, Zf, Qf, Jf, th, eh, nh, rh, sh, oh, ih, ah, ch, lh;
    if (Ke && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const W = Ke;
      Ke = null, l.root === W.root && l.slot !== W.slot && c.openAlbum(W.slot);
    }
    const m = d.inProgress(l), y = j(l), h = m && l.step === "fund" ? { ...l, depositPending: !0 } : y !== null ? { ...l, depositPending: !0, arrival: { since: y, graceMs: Xc } } : l, f = h.error === Wc;
    if (pn(), We(l), I(l), re = Qe(l), lr(l, h), jo(h), In(h), !m && d.inProgress(l)) return;
    if (Wn(h), Vs(h), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(h.step), n.textContent = h.step === "loading" || !h.gate ? w.on ? MI : "Checking your listening wallet…" : w.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = h.step === "off", t.hidden) {
      F(h, !1);
      return;
    }
    const [S, C] = _i(h), U = s(".ppp-state");
    U.textContent = S, U.className = "ppp-state" + (C ? " ppp-state--" + C : ""), U.hidden = !S;
    const J = !!h.busy || h.armed, D = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (J || !["intro", "loading"].includes(h.step));
    o.hidden = !D, o.classList.toggle("ppp-frame--rest", !J && !qt);
    const Q = s(".ppp-frame-label");
    Q.hidden = !0;
    const q = K5(h) ?? Nt;
    Nt = q;
    const X = "xtrata.radio.ppp.heard.v1", rt = (() => {
      try {
        return localStorage.getItem(X) === "1";
      } catch {
        return !1;
      }
    })();
    if (!rt && h.entries.some((W) => W.kind === "play"))
      try {
        localStorage.setItem(X, "1");
      } catch {
      }
    const gt = rt || h.slot > 0 && ((((qf = h.likeFunds) == null ? void 0 : qf.balance) ?? 0n) > 0n || p.count() > 1), Xt = g(h), oe = !Xt && Y5({ ...h, heard: gt }, q);
    s(".ppp-badge").hidden = !oe;
    const x = s(".ppp-steps"), _ = s(".ppp-stage");
    x.hidden = _.hidden = !oe, q && oe && (x.replaceChildren(...vd(h.solo).map((W, st) => {
      const kt = k("li", "", st < q.at ? "done" : st === q.at ? q.blocked ? "now blocked" : "now" : "");
      return kt.append(k("span", st < q.at ? "✓" : String(st + 1), "n"), W), st === q.at && kt.setAttribute("aria-current", "step"), kt;
    })), _.textContent = q.caption, _.className = "ppp-stage " + (q.at >= vd(h.solo).length ? "ppp-ok" : q.blocked ? "ppp-bad" : "ppp-cyan"));
    const R = s(".ppp-facts"), lt = [];
    h.main && ((Xf = h.gate) != null && Xf.here) && !h.solo && lt.push(...kn("Your wallet", Ct(h.main), "ppp-addr-short"));
    const Oe = () => {
      if (!h.listening) return;
      const W = br("copy-listening", "Copy", () => h.listening || "", "tiny", () => Zt(c.snapshot()));
      lt.push(...kn(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", ht(h.listening), "ppp-addr-short", W));
    };
    if (h.linked || Oe(), h.listening && h.step !== "intro")
      if (h.linked)
        lt.push(...kn("Credited to", `${Ct(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), Oe();
      else if (h.solo) {
        h.creditedTo && lt.push(...kn("Credited to", `${Ct(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${Ct(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        lt.push(...kn("Returns go to", h.gift ? W : h.returnTo && !$e(h.returnTo) ? W.replace(ht(h.returnTo), h.returnTo) : W, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else lt.push(...kn("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((Wf = h.gate) != null && Wf.here)) {
      const W = h.linkedListening.map((st) => ht(st) + (st === h.listening ? " (this one)" : "")).join(", ");
      lt.push(...kn(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const W = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      lt.push(...kn("Balance", `${er(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, W));
    }
    const De = h.entries.find((W) => W.kind === "play");
    De && Mr(), De && lt.push(...kn("Last paid song", `${Jr(De)} → ${Ct(De.recipient)}`, yn[De.status] || "")), R.replaceChildren(...lt), R.hidden = !lt.length;
    const ft = [], It = [], ie = [], Fe = [], Oi = rn(BigInt(((Zf = h.gate) == null ? void 0 : Zf.limits.playFee) ?? "300")), Di = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${er(Yc)} STX to the song holder, plus a ${er(Oi - Yc)} STX network fee.`, Fi = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (ft.push(k("p", "Pay artists as you listen.")), (Qf = h.gate) != null && Qf.radioUrl) {
          const st = k("p");
          st.append(vt("Open the pay-per-play radio →", h.gate.radioUrl)), ft.push(st);
        }
        It.push(k("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const st = [h.linked, ...h.others];
          ft.push(k("p", st.length > 1 ? `This device has listening wallets for ${Br(st)}.` : `This device has a listening wallet for ${Ct(h.linked)}.`)), It.push(k("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), st.slice(0, 3).forEach((kt, ae) => ie.push(at(`Open ${Ct(kt)}`, () => Ne(kt), ae === 0 ? "primary" : "")));
        } else
          ft.push(k("p", "Connect your wallet to pay artists as you listen.")), It.push(k("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        ft.push(k("p", `This device's listening wallet belongs to ${Ct(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), It.push(k("p", `You are connected as ${Ct(h.main)}. Switch to the linked wallet to continue listening.`)), It.push(k("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ie.push(at("Switch wallet", an, "primary"));
        break;
      case "not-invited":
        ft.push(k("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        ft.push(k("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ft.push(k("p", "Every play counts for the song’s owner, on-chain.")), It.push(k("p", Di)), It.push(k("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), It.push(k("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (ft.push(k("p", `This device already has a listening wallet for ${Br(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), It.push(k("p", `Otherwise, set up a new listening wallet for ${Ct(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && It.push(k("p", `This is the listening wallet for ${Ct(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && It.push(k("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = d.liveGift();
        ie.push(at(W ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${Ct(h.main)}` : "Start listening", () => void c.create(), "primary")), !W && !h.solo && h.main && h.others.length && ie.push(at("Switch wallet", an)), !W && h.solo && ie.push(at("I have a Stacks wallet", an)), ie.push(at("I already have a listening wallet", () => void c.unlock(!0))), W && ie.push(at("Not now", () => d.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (ft.push(k("p", "Locked.", "ppp-mute")), ie.push(at("Unlock", () => void c.unlock(), "primary"))), h.standIn ? Fe.push(at("Use a different listening wallet", () => void Gs().then((st) => {
          st === "stacks" && an();
        }), "quiet")) : Fe.push(at("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        ft.push(k("p", `Link to ${Ct(h.main)} · free`)), It.push(k("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), It.push(k("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ie.push(at(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        ft.push(k("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && ft.push(Nr(h.arrival)) : Y(h) ? ft.push(k("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Jf = h.gift) != null && Jf.player ? ft.push(k("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? ft.push(k("p", "No plays left · add plays to keep counting", "ppp-bad")) : ft.push(k("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Oi)).toLocaleString()} plays`)), h.entries.length && It.push(k("p", "Playback is paused until your top-up confirms.")), h.payingOn && !h.entries.length && It.push(k("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m ? It.push(k("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? It.push(k("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (It.push(k("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), It.push(k("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && ie.push(br("copy-address", "Copy my address", () => h.listening || "", "primary", () => Zt(c.snapshot())))) : It.push(k("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const st = k("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          st.append(vt("View", Rt(h.depositTxid))), ft.push(st);
        } else h.allowance > 0n && !h.solo && !h.depositPending && ie.push(Gt(h, `Deposit ${er(h.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        ft.push(k("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.phrase && (ft.push(k("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), ie.push(at("Back up my player · 24 words", () => void c.backup(), ""))), h.solo && !h.returnTo && (ft.push(k("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ft.push(ts(h))), (!h.solo || h.returnTo) && ie.push(at("Return excess", () => void c.returnFunds("excess"), "primary"), at("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0 && ((th = h.giftStop) == null ? void 0 : th.reason) !== "off") {
          const st = Math.min(h.session.playsLeft, h.playsLeft);
          ft.push(k("p", `${st.toLocaleString()} plays left`, "ppp-ok")), It.push(k("p", Di + " The heart likes or unlikes from this wallet for 0.0002 STX.")), ie.push(at("Switch off", () => void c.switchOff()));
        } else
          ft.push(k("p", "Switch on music support to listen.", "ppp-mute")), ie.push(at("Switch plays on", () => void c.switchOn(), "primary"));
        h.queued && ft.push(k("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && ft.push(k("p", "Running low on plays", "ppp-warn")), h.aboveTarget && ft.push(k("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), h.depositPending ? ft.push(k("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && ie.push(Gt(h, `Top up ${er(h.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (h.solo && h.listening && !h.depositPending) {
      const W = h.step === "fund", st = h.step === "ready" && (h.balanceState === "low" || !!h.gift && h.giftPlays <= 20);
      W ? ie.unshift(at("Add plays", () => wt(), "primary")) : st ? ie.push(at("Add plays", () => wt(), "primary")) : h.step === "ready" && Fe.push(at("Add plays", () => wt(), "quiet"));
    }
    if (h.solo && h.walletCannotSolo && It.push(k("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && It.push(ts(h)), It.push(Pi()), h.slot === 0 && h.step === "ready" && h.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = k("p", "New to Stacks? ", "ppp-mute");
      W.append(vt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ft.push(W);
    }
    if (h.walletOutdated && It.push(k("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (ft.push(k("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ie.push(at("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && Fe.push(at(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${Ct(h.returnTo)}`, () => void c.returnFunds("all"), "quiet")), h.slot > 0 && ((eh = h.gift) != null && eh.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && Fe.push(Fo(h, "quiet")), h.phrase && ["ready", "fund", "over"].includes(h.step) && Fe.push(at(h.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && Fe.push(at("Lock", () => void c.lock(), "quiet")), D && !J && Fe.push(at(qt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      qt = !qt, Zt(c.snapshot());
    }, "quiet")), [...ie, ...Fe].forEach((W) => W.disabled = Fi), Fi && (ie.length = 0), !Xt && h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((nh = h.gift) != null && nh.player)) {
      const W = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", st = ft.at(0);
      h.step === "ready" && st ? st.append(k("span", ` · ${se(h.balance)} STX`, W)) : ft.push(k("p", `Balance ${se(h.balance)} STX`, W));
    }
    if (Xt) {
      for (const kt of [...ie, ...Fe]) {
        const ae = II[kt.textContent ?? ""];
        ae && (kt.textContent = ae);
      }
      for (let kt = ft.length - 1; kt >= 0; kt--) Q0(ft[kt].textContent) && It.unshift(...ft.splice(kt, 1));
      for (let kt = ie.length - 1; kt >= 0; kt--) Q0(ie[kt].textContent) && Fe.unshift(...ie.splice(kt, 1));
      const W = h.entries.some((kt) => kt.kind === "play"), st = TI(h.step, { played: W, arriving: h.depositPending });
      st.length && ft.length && st.shift(), ft.push(...st.map((kt) => k("p", kt, "ppp-mute")));
    }
    if ((rh = h.gift) != null && rh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const W = k("p", "", "ppp-gift");
      W.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && W.append(" · ", h.gift.player.subtitle);
      const st = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? k("span", " · plays on their way", "ppp-warn") : k("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      st && W.append(st);
      const kt = (sh = ft.at(0)) == null ? void 0 : sh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && kt && /STX/.test(kt.textContent ?? "") && kt.remove(), ft.unshift(W), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          ft.splice(1, 0, k("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Fo(h, "primary"));
        else {
          const ae = k("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ae.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ae.append(vt("Xverse", "https://www.xverse.app/download"), " and ", vt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ft.splice(1, 0, ae);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const W = h.returnPlan, st = k("div", "", "ppp-pick");
      st.append(k("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const kt = k("ul", "", "ppp-gift-list");
      W.steps.forEach((ae, is) => {
        const as = ae.kind === "gift" ? "the unused gift" : ae.kind === "deposit" ? "what was added to it" : "the rest", mn = k("li");
        mn.append(k("span", `${is + 1}. ${er(BigInt(ae.send))} STX · ${as}`, "t"), k("span", ae.to ? ` → ${Ct(ae.to)}` : " → choose an address below", ae.to ? "ppp-mute" : "ppp-warn")), kt.append(mn);
      }), st.append(kt), W.kept && st.append(k("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((ae) => !ae.to) && st.append(ts(h)), st.append(at(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), ft.push(st);
    }
    const jn = Ro(h), Ln = A ? jn : null, Vo = Kt(h, !!Ln), Rb = Vo === "gift" || Vo === "arriving" || Vo === "new", Bl = d.banner(l, { bare: !!Ln || Vo === "gift" || Vo === "arriving" }), Ia = te && (d.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? vn(te, d.pendingCode()) : [];
    Ln || (ft.unshift(...Bl), ft.push(...Ui(h)), ft.unshift(...Ia)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && ft.unshift(k("p", `This is ${Ct(h.creditedTo)}'s listening wallet. Plays and likes count for ${Ct(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...ft);
    const Ml = document.querySelector(".ppp-switch");
    if (Ml) {
      const W = p.latest(), st = h.slot > 0, kt = ["fund", "ready", "over"].includes(h.step) && (st || !!W);
      if (Ml.hidden = !kt, kt) {
        const ae = (mn, Ta, Ba, Hl) => {
          const Yo = at("", Hl, "ppp-tab");
          return Yo.setAttribute("aria-pressed", String(Ba)), Yo.append(k("span", mn, "tt"), k("span", Ta === void 0 ? "…" : `${At(Ta).toLocaleString()} plays`, "ts")), Yo.disabled = !!h.busy, Yo;
        }, is = st ? ((ih = (oh = h.gift) == null ? void 0 : oh.player) == null ? void 0 : ih.title) ?? "Album" : W.title, as = at("View all albums" + (p.count() > 1 ? ` (${p.count()})` : ""), () => {
          const mn = document.querySelector(".ppp-shelf");
          mn && (mn.hidden = !1, mn.open = !mn.open, as.setAttribute("aria-expanded", String(mn.open)), mn.open && requestAnimationFrame(() => mn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        as.setAttribute("aria-expanded", String(!!((ah = document.querySelector(".ppp-shelf")) != null && ah.open))), Ml.replaceChildren(
          ae("🎧 My player", st ? (ch = h.likeFunds) == null ? void 0 : ch.balance : h.balance, !st, () => {
            st && c.openAlbum(0);
          }),
          ae("💿 " + is, st ? h.balance : void 0, st, () => {
            !st && W && c.openAlbum(W.slot);
          }),
          as
        );
      }
    }
    const La = p.render(h), Ca = document.querySelector(".ppp-shelf");
    if (Ca) {
      Ca.hidden = !La;
      const W = Ca.querySelector("summary");
      W && (W.textContent = p.count() > 0 ? `♪ My albums (${p.count()})` : "♪ My albums");
      const st = Ca.querySelector(".ppp-shelf-body");
      La && st && !st.contains(La) && st.replaceChildren(La);
    }
    const ji = d.renderFold(l);
    if (s(".ppp-gifts").hidden = !ji, ji && !s(".ppp-gift-body").contains(ji) && s(".ppp-gift-body").replaceChildren(ji), ji && xt) {
      xt = !1;
      const W = s(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Nl = document.querySelector("#ppp .ppp-featured");
    if (Nl) {
      const W = ne.length > 0 && h.slot === 0 && !((lh = h.gift) != null && lh.player) && h.step === "ready";
      Nl.hidden = !W, W && Nl.replaceChildren(k("p", "Albums in your player", "ppp-featured__h"), ...ne.map((st) => {
        const kt = (ye == null ? void 0 : ye.id) === st.id, ae = at("", () => Ze(kt ? null : st, !kt), "ppp-featured__a" + (kt ? " is-on" : "")), is = Vr(st).length;
        return ae.append(k("b", st.title), k("span", kt ? "Playing now · tap to go back to the radio" : `${st.subtitle ? st.subtitle + " · " : ""}${is} ${is === 1 ? "song" : "songs"}`)), ae.setAttribute("aria-pressed", String(kt)), ae.disabled = !!h.busy, ae;
      }));
    }
    Go(h);
    const _l = document.querySelector("#ppp .ppp-yours");
    if (_l) {
      const W = h.solo && !!h.listening && h.slot === 0 && ["fund", "ready"].includes(h.step);
      _l.hidden = !W;
      const st = _l.querySelector(".ppp-yours-body");
      if (W && st && st.getAttribute("data-for") !== h.listening) {
        st.setAttribute("data-for", h.listening);
        const kt = (Hl, ...Yo) => {
          const uh = k("details", "", "ppp-yours-item");
          return uh.append(k("summary", Hl), ...Yo), uh;
        }, ae = k("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ae.append(k("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const is = k("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), as = k("p");
        as.append(vt("Find a name at BNS One →", "https://bns.one"));
        const mn = k("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ta = k("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Ba = k("p");
        Ba.append(vt("See the giveaway →", "https://xtrata.xyz/giveaway")), st.replaceChildren(
          kt("Give your player a name", ae, is, k("p", h.listening, "ppp-addr-full"), br("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => Zt(c.snapshot())), as),
          kt("Link it to a wallet you already have", mn),
          kt("Bring a friend in", Ta, Ba)
        );
      }
    }
    s(".ppp-body").replaceChildren(...It), s(".ppp-actions").replaceChildren(...ie), s(".ppp-actions2").replaceChildren(...Fe);
    const Pl = h.busy || h.message || "", Gf = s(".ppp-msg"), Ul = Pl && ft.some((W) => (W.textContent ?? "").startsWith(Pl.replace(/[.✓\s]+$/, ""))) ? "" : Pl, Kf = !Ul && !h.error ? h.notice : f && !Ul ? h.error : "";
    Gf.textContent = Ul || Kf, Gf.classList.toggle("is-warn", !!Kf), s(".ppp-err").textContent = f ? "" : h.error;
    const zb = h.entries.filter((W) => W.kind === "play");
    s(".ppp-recent").hidden = !h.entries.length, s(".ppp-recent-list").replaceChildren(...zb.slice(0, 5).map((W) => {
      const st = k("li"), kt = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return st.append(k("span", "", "d " + kt), k("span", Jr(W), "t"), k("span", be(W.created), "ppp-mute")), W.txid && st.append(vt("tx", Rt(W.txid))), st;
    })), s(".ppp-wallets").hidden = !(R.childElementCount || Fe.length), s(".ppp-more").hidden = !It.length;
    const Vf = s(".ppp-history");
    Vf.hidden = !h.entries.length, h.entries.length && Mr(), Vf.replaceChildren(k("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((W) => {
      const st = k("div", "", "ppp-row"), kt = W.kind === "play" ? [k("span", Jr(W), "ppp-song"), k("span", ` · ${er(BigInt(W.amount))} STX to ${Ct(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [k("span", `${W.liked ? "♥ Liked" : "Unliked"} ${Jr(W)}`, "ppp-song"), k("span", ` · for ${h.linked ? Ct(h.linked) : "this listening wallet"}`, "ppp-mute")] : [k("span", `Returned ${er(BigInt(W.amount))} STX`, "ppp-song"), k("span", ` to ${Ct(W.recipient)}`, "ppp-mute")];
      return st.append(
        k("span", Oo[W.status] || W.status, "ppp-status " + (yn[W.status] || "")),
        ...kt,
        k("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && st.append(vt("tx ↗", Rt(W.txid))), st;
    })), O == null || O.render(Ln ? Pr(h, Ln, [...Ia, ...Bl]) : null), F(h, !!Ln, Rb ? [...Ia, ...Bl] : Ia, Vo), Ws(h, !!Ln || !!(M != null && M.showing())), Hi(h, Ln), Et.isOpen() && Et.refresh(), Ur();
    const Yf = (jn == null ? void 0 : jn.mode) === "open" ? null : Re(h);
    ke == null || ke.render((jn == null ? void 0 : jn.mode) === "open" ? Pr(h, jn, []) : Yf ? { ...Pr(h, { mode: "open", player: Yf }, []), plays: h.balance === void 0 ? null : h.playsLeft } : null);
  }
  function Ro(l) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((h = l.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Hn({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const m = d.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const y = Bt();
    return y && (l.step === "locked" || Ke && l.step === "loading") ? { mode: "locked", player: y.player } : null;
  }
  const Xs = (l, m, y, h, f) => `/awards/${l.id}#${new URLSearchParams({ n: String(m), a: y, ...f ? { b: f } : {}, p: String(h), s: tg(k0, m, y) })}`;
  function zo(l) {
    const m = l.award;
    return !m || !["ready", "fund", "over", "link"].includes(l.step) ? null : m.claimTx ? P ? "making" : null : m.state === "claimed" ? P && m.inscription !== void 0 ? "yours" : null : m.state !== "ready" || Z || l.step === "link" && B !== "have" ? null : B === "making" || B === "yours" ? "ready" : B;
  }
  function Ws(l, m) {
    if (!H) return;
    const y = l.award, h = y != null && y.cls && dc(y.cls) ? fc(y.cls) : null, f = l.slot === 0 ? l.listening : l.root, S = m || !y || !h || !f || y.number === void 0 ? null : zo(l);
    if (!S || !y || !h || !f) {
      H.render(null, m);
      return;
    }
    S === "have" && l.linked && !it && (it = !0, c.awardRefresh());
    const C = typeof y.name == "string" && y.name ? y.name : null, U = [];
    l.error && U.push(k("p", l.error, "ppp-warn"));
    const J = (D) => {
      B = D, D === "name" && (P = !0), Zt(c.snapshot());
    };
    H.render({
      screen: S,
      tier: h,
      number: y.number,
      need: y.need ?? 0,
      player: f,
      name: y.name,
      inscription: y.inscription,
      art: S === "yours" && y.inscription !== void 0 ? `/i/${y.inscription}` : Xs(h, y.number, f, y.need ?? 0, C),
      claimLink: y.claimTx ? Rt(y.claimTx) : void 0,
      status: U,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? Ct(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => br("award-player-address", "Copy my player’s address", () => f, "tiny", () => Zt(c.snapshot())),
      go: J,
      claim: (D) => {
        P = !0, c.claimAward(D);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var D;
        return (D = document.getElementById("radio-wallet-connect")) == null ? void 0 : D.click();
      },
      link: () => void c.link(),
      later: () => {
        Z = !0;
        try {
          localStorage.setItem(v, String(Date.now()));
        } catch {
        }
        Zt(c.snapshot());
      },
      done: () => {
        P = !1, B = "ready", Zt(c.snapshot());
      }
    }, m);
  }
  function Go(l) {
    var q;
    const m = document.querySelector("#ppp .ppp-award");
    if (!m) return;
    const y = l.award, h = l.slot === 0 ? l.listening : l.root, f = y != null && y.cls && dc(y.cls) ? fc(y.cls) : null, S = !!y && !!f && !!h && ["ready", "fund", "over"].includes(l.step) && !(y.state === "unavailable" && y.number === void 0);
    if (m.hidden = !S, !S || !y || !f || !h) {
      m.replaceChildren();
      return;
    }
    const C = JSON.stringify([y, h, !!l.busy]);
    if (m.getAttribute("data-sig") === C) return;
    m.setAttribute("data-sig", C);
    const U = (X) => {
      const rt = k("p", "", "ppp-award__h");
      return rt.append(k("b", `${f.mark} Music Hero award`), k("span", X)), rt;
    }, J = `No. ${String(y.number ?? 0).padStart(4, "0")}`, D = (X) => {
      const rt = k("div", "", "ppp-award__art"), gt = document.createElement("iframe");
      return gt.src = X, gt.title = `${f.name} record`, gt.setAttribute("sandbox", "allow-scripts"), gt.setAttribute("loading", "lazy"), rt.append(gt), rt;
    }, Q = [];
    if (y.state === "claimed") {
      if (Q.push(U(`${f.name} record · ${J}`)), y.inscription !== void 0 && Q.push(D(`/i/${y.inscription}`)), Q.push(k("p", y.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : y.holds === null || y.holds === void 0 ? `Yours: Xtrata inscription #${y.inscription}.` : `Yours for good: Xtrata inscription #${y.inscription}. It gives your player its ${f.name} colours.`, y.holds === !1 ? "ppp-mute" : "ppp-ok")), y.inscription !== void 0) {
        const X = k("p");
        X.append(vt("Open it full screen ↗", `/i/${y.inscription}`)), Q.push(X);
      }
      if (y.sendTx) {
        const X = k("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        X.append(vt("View", Rt(y.sendTx))), Q.push(X);
      } else if (y.holds === !0 && y.inscription !== void 0) {
        const X = k("details", "", "ppp-award__send"), rt = document.createElement("input");
        rt.type = "text", rt.placeholder = "SP… address to send it to", rt.autocomplete = "off", rt.spellcheck = !1, rt.setAttribute("aria-label", "Address to send your record to");
        const gt = at("Send my record…", () => void c.sendAward(rt.value), "");
        gt.disabled = !!l.busy, X.append(
          k("summary", "Send this record to someone"),
          k("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          rt,
          gt
        ), Q.push(X);
      }
    } else if (y.claimTx) {
      Q.push(U(`${f.name} record · ${J}`));
      const X = k("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      X.append(vt("View", Rt(y.claimTx))), Q.push(X);
    } else if (y.state === "ready") {
      Q.push(U(`${f.name} record · ${J}`));
      const X = typeof y.name == "string" && y.name ? y.name : null, rt = new URLSearchParams({ n: String(y.number), a: h, ...X ? { b: X } : {}, p: String(y.need), s: tg(k0, y.number, h) });
      Q.push(D(`/awards/${f.id}#${rt}`)), Q.push(k("p", `Your ${f.name} record is ready. You have paid artists for ${(q = y.need) == null ? void 0 : q.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const gt = k("div", "", "ppp-award__row");
      X ? (Q.push(k("p", `Its plaque will carry ${X} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), gt.append(at("Claim my record", () => {
        P = !0, c.claimAward("auto");
      }, "primary"), at("Use my address only", () => {
        P = !0, c.claimAward("none");
      }, "quiet"))) : y.name === null ? (Q.push(k("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), gt.append(at("Claim my record", () => {
        P = !0, c.claimAward("none");
      }, "primary"), at("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (Q.push(k("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), gt.append(at("Check for a name again", () => void c.awardRefresh(), "primary"), at("Claim with my address only", () => void c.claimAward("none"), "quiet"))), gt.querySelectorAll("button").forEach((Xt) => {
        Xt.disabled = !!l.busy;
      }), Q.push(gt, k("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (y.state === "earning" && y.have !== void 0 && y.need) {
      Q.push(U(`${y.have.toLocaleString()} of ${y.need.toLocaleString()} paid plays`));
      const X = k("div", "", "ppp-award__bar"), rt = document.createElement("i");
      rt.style.width = `${Math.min(100, Math.round(y.have / y.need * 100))}%`, X.append(rt);
      const gt = y.need - y.have;
      Q.push(X, k("p", `${gt.toLocaleString()} more ${gt === 1 ? "play" : "plays"} and your ${f.name} record is yours to claim.`, "ppp-mute"));
    } else
      Q.push(U(`${f.name} record · ${J}`)), Q.push(k("p", y.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : y.state === "class-full" || y.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    m.replaceChildren(...Q);
  }
  function Hi(l, m) {
    var U;
    const y = document.querySelector(".ppp-skin");
    if (!y) return;
    if (!m && (H != null && H.showing()) && ((U = l.award) != null && U.cls) && dc(l.award.cls) && (l.busy || l.armed)) {
      const J = fc(l.award.cls), D = k("span", "", "ppp-skin__t");
      D.append(k("b", `${J.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), k("span", "Xtrata Music Hero")), y.hidden = !1, y.replaceChildren(k("span", J.mark, "ppp-skin__art ppp-skin__art--none"), D);
      return;
    }
    const h = !!m && (!!l.busy || l.armed);
    if (y.hidden = !h, !h || !m) {
      y.replaceChildren();
      return;
    }
    const f = Id(m.player.cover), S = f ? k("img", "", "ppp-skin__art") : k("span", "♪", "ppp-skin__art ppp-skin__art--none");
    f && (S.src = f, S.alt = "");
    const C = k("span", "", "ppp-skin__t");
    C.append(k("b", m.player.title), k("span", m.mode === "arrive" && m.from ? `A gift from ${m.from}` : m.player.subtitle || "Your album")), y.replaceChildren(S, C);
  }
  function Pr(l, m, y) {
    var J, D, Q, q, X;
    const h = !!l.busy || l.armed, f = [...y];
    l.depositPending && l.arrival && f.push(Nr(l.arrival)), l.error ? f.push(k("p", l.error, l.error === Wc ? "ppp-warn" : "ppp-bad")) : l.message && !h ? f.push(k("p", l.message, "ppp-cyan")) : l.notice && f.push(k("p", l.notice, "ppp-warn")), m.mode === "open" && $ && ((J = l.likeFunds) != null && J.album) && l.likeFunds.low && !l.likeFunds.pending && f.push(k("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let S = "Kept on this device with Face ID or your passkey. No app or account needed.", C = null, U = null;
    if (m.mode === "locked")
      C = { label: "Continue listening", run: () => {
        Ke = Bt(), c.unlock();
      } }, U = { label: "Use a different passkey", run: () => {
        Ke = null, c.unlock(!0);
      } };
    else if (m.mode === "arrive")
      if (l.step === "intro" && uc(Dt) && Dt.album === m.player.id) {
        const rt = window.XtrataRadio, gt = Vr(m.player)[0], Xt = Dt.phase === "playing";
        C = { label: Xt && !!((Q = (D = rt == null ? void 0 : rt.getState) == null ? void 0 : D.call(rt)) != null && Q.playing) ? "Pause" : Xt ? "Carry on" : "Play the first song", run: () => {
          var x, _;
          Xt ? (x = rt == null ? void 0 : rt.playPause) == null || x.call(rt) : gt && ((_ = rt == null ? void 0 : rt.playToken) == null || _.call(rt, gt.id));
        } }, U = { label: "Make my player and hear it all", run: () => void c.create() }, S = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const rt = Dt.phase === "done" && Dt.album === m.player.id;
        rt && !f.length && f.push(k("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), C = { label: rt ? "Keep listening" : "Open album", run: () => void c.create() }, U = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (C = { label: "Open album", run: () => void c.unlock() }, U = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? f.push(k("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : f.length || f.push(k("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: m.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: m.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: f,
      primary: C,
      secondary: U,
      hint: C ? S : void 0,
      asking: h,
      busy: !!l.busy,
      myPlays: qs(l),
      topUps: Sc,
      canMake: !!((X = (q = l.gate) == null ? void 0 : q.gifts) != null && X.admin)
    };
  }
  const Je = document.getElementById("findBox"), de = document.getElementById("findBody"), dr = Je && de ? YI(de, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => GI(l == null ? void 0 : l.tracks, (m, y) => ({ title: U0(m, Rs(y.title) ? "" : y.title), artist: _0(m, y.artist || "") }))),
    play: (l) => {
      var m, y;
      (y = (m = window.XtrataRadio) == null ? void 0 : m.playToken) == null || y.call(m, l);
    },
    current: () => {
      var m, y, h, f;
      const l = Number((f = (h = (y = (m = window.XtrataRadio) == null ? void 0 : m.getState) == null ? void 0 : y.call(m)) == null ? void 0 : h.nowPlaying) == null ? void 0 : f.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var m, y;
      return !!((y = (m = window.XtrataRadio) == null ? void 0 : m.isExplicit) != null && y.call(m, l));
    }
  }) : null;
  Je == null || Je.addEventListener("toggle", () => {
    Je.open && (dr == null || dr.load());
  });
  let Fn = "";
  const Ur = () => {
    var m, y, h, f, S;
    if (!dr || !(Je != null && Je.open)) return;
    const l = `${!!((m = c.snapshot().albumLock) != null && m.locked)}|${((S = (f = (h = (y = window.XtrataRadio) == null ? void 0 : y.getState) == null ? void 0 : h.call(y)) == null ? void 0 : f.nowPlaying) == null ? void 0 : S.tokenId) ?? ""}`;
    l !== Fn && (Fn = l, dr.refresh());
  }, ss = /* @__PURE__ */ new Map();
  let Hr = !1;
  const Ko = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((m) => {
      const y = m == null ? void 0 : m.nowPlaying;
      if (y && Number.isSafeInteger(Number(y.tokenId)) && ss.set(Number(y.tokenId), { title: y.title || void 0, artist: y.artist || void 0 }), Ur(), uc(Dt)) {
        const h = !!(m != null && m.playing);
        ze({ kind: "now", track: y && y.tokenId != null ? String(y.tokenId) : null, playing: h, at: Date.now() }), h !== Hr && (Hr = h, Zt(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Ko()) {
    const l = setInterval(() => {
      Ko() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const m = l.detail;
    if (uc(Dt) && ze({ kind: "listened", at: Date.now() }), m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      Mr();
      const y = zs(m.song, ss.get(m.song));
      c.onListened({ song: m.song, id: m.id, title: y.title || void 0, artist: y.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const ZI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", QI = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), o = /CriOS/.exec(e.userAgent), i = e.userAgent.includes("Mobile");
  return o ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, JI = () => QI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, tL = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, eL = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', jb = class {
  constructor(t) {
    H4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && r3(t), this.callback(gl(t));
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
    var r, s, o, i, a, c, d, p, u, w;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (i = (o = t.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (p = (d = t.googlePlayStoreUrl) !== null && d !== void 0 ? d : this.getBrowserUrl(t)) !== null && p !== void 0 ? p : t.webUrl : (w = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(t);
  }
  render() {
    const t = JI(), e = tL(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Tt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Tt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Tt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Tt("div", { class: "flex flex-col space-y-[10px]" }, Tt("div", { class: "flex items-center" }, Tt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Tt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Tt("span", { class: "sr-only" }, "Close popup"), Tt("img", { src: ZI }))), r ? Tt("p", null, "Select the wallet you want to connect to.") : Tt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Tt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Tt("div", { class: "mt-6" }, Tt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Tt("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Tt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Tt("div", { class: "aspect-square basis-9 overflow-hidden" }, Tt("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Tt("div", { class: "flex-1" }, Tt("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Tt("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Tt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Tt("div", { class: "mt-6" }, r ? Tt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Tt("div", { class: "mb-5 flex justify-between" }, Tt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Tt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Tt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Tt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Tt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Tt("p", null, "What is a wallet? ", Tt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Tt("ul", { class: "space-y-3" }, n.map((o) => Tt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Tt("div", { class: "aspect-square basis-9 overflow-hidden" }, Tt("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Tt("div", { class: "flex-1" }, Tt("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Tt("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, t, e) && Tt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, t, e), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return b4(this);
  }
};
jb.style = eL;
const nL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: jb
}, Symbol.toStringTag, { value: "Module" }));
