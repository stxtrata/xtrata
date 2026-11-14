var $b = Object.defineProperty;
var Ib = (t, e, n) => e in t ? $b(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Uo = (t, e, n) => Ib(t, typeof e != "symbol" ? e + "" : e, n);
var hn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Up(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Gc(t) {
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
      typeof hn < "u" && hn || {}, r = {
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
        var $ = {
          next: function() {
            var M = y.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && ($[Symbol.iterator] = function() {
          return $;
        }), $;
      }
      function h(y) {
        this.map = {}, y instanceof h ? y.forEach(function($, M) {
          this.append(M, $);
        }, this) : Array.isArray(y) ? y.forEach(function($) {
          if ($.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + $.length);
          this.append($[0], $[1]);
        }, this) : y && Object.getOwnPropertyNames(y).forEach(function($) {
          this.append($, y[$]);
        }, this);
      }
      h.prototype.append = function(y, $) {
        y = a(y), $ = c($);
        var M = this.map[y];
        this.map[y] = M ? M + ", " + $ : $;
      }, h.prototype.delete = function(y) {
        delete this.map[a(y)];
      }, h.prototype.get = function(y) {
        return y = a(y), this.has(y) ? this.map[y] : null;
      }, h.prototype.has = function(y) {
        return this.map.hasOwnProperty(a(y));
      }, h.prototype.set = function(y, $) {
        this.map[a(y)] = c($);
      }, h.prototype.forEach = function(y, $) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && y.call($, this.map[M], M, this);
      }, h.prototype.keys = function() {
        var y = [];
        return this.forEach(function($, M) {
          y.push(M);
        }), l(y);
      }, h.prototype.values = function() {
        var y = [];
        return this.forEach(function($) {
          y.push($);
        }), l(y);
      }, h.prototype.entries = function() {
        var y = [];
        return this.forEach(function($, M) {
          y.push([M, $]);
        }), l(y);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function u(y) {
        if (!y._noBody) {
          if (y.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          y.bodyUsed = !0;
        }
      }
      function w(y) {
        return new Promise(function($, M) {
          y.onload = function() {
            $(y.result);
          }, y.onerror = function() {
            M(y.error);
          };
        });
      }
      function g(y) {
        var $ = new FileReader(), M = w($);
        return $.readAsArrayBuffer(y), M;
      }
      function A(y) {
        var $ = new FileReader(), M = w($), T = /charset=([A-Za-z0-9_-]+)/.exec(y.type), K = T ? T[1] : "utf-8";
        return $.readAsText(y, K), M;
      }
      function v(y) {
        for (var $ = new Uint8Array(y), M = new Array($.length), T = 0; T < $.length; T++)
          M[T] = String.fromCharCode($[T]);
        return M.join("");
      }
      function C(y) {
        if (y.slice)
          return y.slice(0);
        var $ = new Uint8Array(y.byteLength);
        return $.set(new Uint8Array(y)), $.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(y) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = y, y ? typeof y == "string" ? this._bodyText = y : r.blob && Blob.prototype.isPrototypeOf(y) ? this._bodyBlob = y : r.formData && FormData.prototype.isPrototypeOf(y) ? this._bodyFormData = y : r.searchParams && URLSearchParams.prototype.isPrototypeOf(y) ? this._bodyText = y.toString() : r.arrayBuffer && r.blob && s(y) ? (this._bodyArrayBuffer = C(y.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(y) || o(y)) ? this._bodyArrayBuffer = C(y) : this._bodyText = y = Object.prototype.toString.call(y) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof y == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(y) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
              return this.blob().then(g);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var y = u(this);
          if (y)
            return y;
          if (this._bodyBlob)
            return A(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(v(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(P);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var F = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function k(y) {
        var $ = y.toUpperCase();
        return F.indexOf($) > -1 ? $ : y;
      }
      function B(y, $) {
        if (!(this instanceof B))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        $ = $ || {};
        var M = $.body;
        if (y instanceof B) {
          if (y.bodyUsed)
            throw new TypeError("Already read");
          this.url = y.url, this.credentials = y.credentials, $.headers || (this.headers = new h(y.headers)), this.method = y.method, this.mode = y.mode, this.signal = y.signal, !M && y._bodyInit != null && (M = y._bodyInit, y.bodyUsed = !0);
        } else
          this.url = String(y);
        if (this.credentials = $.credentials || this.credentials || "same-origin", ($.headers || !this.headers) && (this.headers = new h($.headers)), this.method = k($.method || this.method || "GET"), this.mode = $.mode || this.mode || null, this.signal = $.signal || this.signal || function() {
          if ("AbortController" in n) {
            var z = new AbortController();
            return z.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && ($.cache === "no-store" || $.cache === "no-cache")) {
          var T = /([?&])_=[^&]*/;
          if (T.test(this.url))
            this.url = this.url.replace(T, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var K = /\?/;
            this.url += (K.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      B.prototype.clone = function() {
        return new B(this, { body: this._bodyInit });
      };
      function P(y) {
        var $ = new FormData();
        return y.trim().split("&").forEach(function(M) {
          if (M) {
            var T = M.split("="), K = T.shift().replace(/\+/g, " "), z = T.join("=").replace(/\+/g, " ");
            $.append(decodeURIComponent(K), decodeURIComponent(z));
          }
        }), $;
      }
      function q(y) {
        var $ = new h(), M = y.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var K = T.split(":"), z = K.shift().trim();
          if (z) {
            var pt = K.join(":").trim();
            try {
              $.append(z, pt);
            } catch (ct) {
              console.warn("Response " + ct.message);
            }
          }
        }), $;
      }
      U.call(B.prototype);
      function st(y, $) {
        if (!(this instanceof st))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if ($ || ($ = {}), this.type = "default", this.status = $.status === void 0 ? 200 : $.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = $.statusText === void 0 ? "" : "" + $.statusText, this.headers = new h($.headers), this.url = $.url || "", this._initBody(y);
      }
      U.call(st.prototype), st.prototype.clone = function() {
        return new st(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, st.error = function() {
        var y = new st(null, { status: 200, statusText: "" });
        return y.ok = !1, y.status = 0, y.type = "error", y;
      };
      var X = [301, 302, 303, 307, 308];
      st.redirect = function(y, $) {
        if (X.indexOf($) === -1)
          throw new RangeError("Invalid status code");
        return new st(null, { status: $, headers: { location: y } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function($, M) {
          this.message = $, this.name = M;
          var T = Error($);
          this.stack = T.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function V(y, $) {
        return new Promise(function(M, T) {
          var K = new B(y, $);
          if (K.signal && K.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function pt() {
            z.abort();
          }
          z.onload = function() {
            var L = {
              statusText: z.statusText,
              headers: q(z.getAllResponseHeaders() || "")
            };
            K.url.indexOf("file://") === 0 && (z.status < 200 || z.status > 599) ? L.status = 200 : L.status = z.status, L.url = "responseURL" in z ? z.responseURL : L.headers.get("X-Request-URL");
            var H = "response" in z ? z.response : z.responseText;
            setTimeout(function() {
              M(new st(H, L));
            }, 0);
          }, z.onerror = function() {
            setTimeout(function() {
              T(new TypeError("Network request failed"));
            }, 0);
          }, z.ontimeout = function() {
            setTimeout(function() {
              T(new TypeError("Network request timed out"));
            }, 0);
          }, z.onabort = function() {
            setTimeout(function() {
              T(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ct(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (z.open(K.method, ct(K.url), !0), K.credentials === "include" ? z.withCredentials = !0 : K.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), $ && typeof $.headers == "object" && !($.headers instanceof h || n.Headers && $.headers instanceof n.Headers)) {
            var Ut = [];
            Object.getOwnPropertyNames($.headers).forEach(function(L) {
              Ut.push(a(L)), z.setRequestHeader(L, c($.headers[L]));
            }), K.headers.forEach(function(L, H) {
              Ut.indexOf(H) === -1 && z.setRequestHeader(H, L);
            });
          } else
            K.headers.forEach(function(L, H) {
              z.setRequestHeader(H, L);
            });
          K.signal && (K.signal.addEventListener("abort", pt), z.onreadystatechange = function() {
            z.readyState === 4 && K.signal.removeEventListener("abort", pt);
          }), z.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return V.polyfill = !0, n.fetch || (n.fetch = V, n.Headers = h, n.Request = B, n.Response = st), e.Headers = h, e.Request = B, e.Response = st, e.fetch = V, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : hn);
})();
const Lb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Cb(t, e) {
  const n = {};
  return Object.assign(n, Lb, e), await fetch(t, n);
}
function Tb(t) {
  let e = Cb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Bb(...t) {
  const { fetchLib: e, middlewares: n } = Tb(t);
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
var ro;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ro || (ro = {}));
var fi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fi || (fi = {}));
var Yd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Yd || (Yd = {}));
const Mb = "https://api.mainnet.hiro.so", _b = "https://api.testnet.hiro.so", Pb = "http://localhost:3999", Nb = ["mainnet", "testnet", "devnet", "mocknet"];
let so = class {
  constructor(e) {
    this.version = fi.Mainnet, this.chainId = ro.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === fi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Bb();
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
so.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new su();
    case "testnet":
      return new Ub();
    case "devnet":
      return new Hb();
    case "mocknet":
      return new Hp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Nb.join(", ")}`);
  }
};
so.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : so.fromName(t);
let su = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Mb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Mainnet, this.chainId = ro.Mainnet;
  }
}, Ub = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _b,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Testnet, this.chainId = ro.Testnet;
  }
}, Hp = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Pb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Testnet, this.chainId = ro.Testnet;
  }
};
const Hb = Hp, Op = "xtrata.wallet.bridge.v1", Ob = (t) => typeof t == "object" && t !== null && t.protocol === Op, Db = (t) => Ob(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Fb = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Ho extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Xd = 12e4;
class jb {
  constructor(e) {
    Uo(this, "pending", /* @__PURE__ */ new Map());
    Uo(this, "listenTarget");
    Uo(this, "closed", !1);
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
    Uo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Db(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Ho("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Ho("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ho("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Fb(), i = { protocol: Op, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Ho(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Xd}ms.`
          )
        );
      }, this.options.timeoutMs ?? Xd);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Ho("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Rb = ["SP", "SM"], zb = ["ST", "SN"], Gb = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Rb.includes(n) ? "mainnet" : zb.includes(n) ? "testnet" : null;
}, Kb = () => {
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
}, Vb = () => typeof window > "u" || !window.localStorage ? Kb() : window.localStorage, El = "xtrata.v15.1.wallet.session", Wd = "mainnet", dc = { isConnected: !1 }, qb = (t) => t.address ? Gb(t.address) ?? t.network : t.network, Dp = (t) => !t.isConnected || !t.address ? { ...dc } : qb(t) !== Wd ? { ...dc } : {
  isConnected: !0,
  address: t.address,
  network: Wd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Yb = (t) => {
  if (!t)
    return { ...dc };
  try {
    const e = JSON.parse(t);
    return Dp(e);
  } catch {
    return { ...dc };
  }
}, Xb = (t) => {
  const e = Dp(t);
  return JSON.stringify(e);
}, Wb = (t) => {
  const e = Vb();
  return {
    load: () => Yb(e.getItem(El)),
    save: (n) => {
      e.setItem(El, Xb(n));
    },
    clear: () => {
      e.removeItem(El);
    }
  };
}, Zb = "https://browser.blockstack.org/auth", Qb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Fp = ["store_write"], Jb = "blockstack-session", tm = {
  logLevel: "debug"
}, Li = {
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
Object.freeze(Li);
class Eo extends Error {
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
class em extends Eo {
  constructor(e, n = "") {
    super({ code: Li.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Zd extends Eo {
  constructor(e = "") {
    super({ code: Li.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class va extends Eo {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Li.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Qd extends Eo {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Li.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class iu extends Eo {
  constructor(e) {
    super({ code: Li.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class jp extends Eo {
  constructor(e) {
    super({ code: Li.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Jd = ["debug", "info", "warn", "error", "none"], ou = {};
for (let t = 0; t < Jd.length; t++) {
  const e = Jd[t];
  ou[e] = t;
}
class Wi {
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
    return ou[tm.logLevel] <= ou[e];
  }
}
function nm() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function rm() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Al(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function sm() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function im() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function om(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gf(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = im(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Wi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = om(s, t.toString(), n);
    throw Wi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Fs(t, e) {
  return yf(sn(t), e);
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
  if (An(t, Uint8Array))
    return BigInt(`0x${gt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function am(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function th(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function da(t, e = 8) {
  return (typeof t == "bigint" ? t : sn(t)).toString(16).padStart(e * 2, "0");
}
function Kc(t) {
  return parseInt(t, 16);
}
function yf(t, e = 16) {
  const n = da(t, e);
  return jt(n);
}
function cm(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function lm(t, e) {
  return t & BigInt(1) << e;
}
function au(t) {
  return um(BigInt(`0x${gt(t)}`), BigInt(t.byteLength * 8));
}
function um(t, e) {
  return lm(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const fm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += fm[n];
  return e;
}
function jt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = am(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Ci(t) {
  return new TextEncoder().encode(t);
}
function ha(t) {
  return new TextDecoder().decode(t);
}
function dm(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function hm(t) {
  return String.fromCharCode.apply(null, t);
}
function pm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function eh(t) {
  if (t.some(pm))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ir(...t) {
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
function Me(t) {
  return Ir(...t.map((e) => typeof e == "number" ? eh([e]) : e instanceof Array ? eh(e) : e));
}
function An(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Rp = "https://api.mainnet.hiro.so", zp = "https://api.testnet.hiro.so", Gp = "http://localhost:3999", gm = "https://hub.blockstack.org", ym = 33, vl = 32;
function wm(t) {
  if (t.length < vl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + vl * 2), r = t.slice(2 + vl * 2);
  return {
    recoveryId: Kc(e),
    r: n,
    s: r
  };
}
function wf(t) {
  const e = typeof t == "string" ? jt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function bm(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function mm(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function xm(t, e) {
  return t[e];
}
function Sm(t, e, n = 0) {
  return t[n] = e, t;
}
function Em(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function di(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Am = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function vm(t, e) {
  const n = {};
  return Object.assign(n, Am, e), await fetch(t, n);
}
function km(t) {
  let e = vm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function $m(...t) {
  const { fetchLib: e, middlewares: n } = km(t);
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
class Kp {
  constructor(e = Fp.slice(), n = ((a) => (a = gf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Zb) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function cu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Im(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Vp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Lm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  cu(t.outputLen), cu(t.blockLen);
}
function Cm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Tm(t, e) {
  Vp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ni = {
  number: cu,
  bool: Im,
  bytes: Vp,
  hash: Lm,
  exists: Cm,
  output: Tm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const kl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, Bm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Bm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Mm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bf(t) {
  if (typeof t == "string" && (t = Mm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let qp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ti(t) {
  const e = (r) => t().update(bf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Yp = class extends qp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ni.hash(e);
    const r = bf(n);
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
    return ni.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ni.exists(this), ni.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Vc = (t, e, n) => new Yp(t, e).update(n).digest();
Vc.create = (t, e) => new Yp(t, e);
function _m(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let mf = class extends qp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = kl(this.buffer);
  }
  update(e) {
    ni.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = bf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = kl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ni.exists(this), ni.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    _m(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = kl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, h[u], i);
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
const Pm = (t, e, n) => t & e ^ ~t & n, Nm = (t, e, n) => t & e ^ t & n ^ e & n, Um = new Uint32Array([
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
let Xp = class extends mf {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
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
      ls[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = ls[u - 15], g = ls[u - 2], A = pr(w, 7) ^ pr(w, 18) ^ w >>> 3, v = pr(g, 17) ^ pr(g, 19) ^ g >>> 10;
      ls[u] = v + ls[u - 7] + A + ls[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), g = h + w + Pm(a, c, l) + Um[u] + ls[u] | 0, v = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + Nm(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Hm = class extends Xp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const io = Ti(() => new Xp());
Ti(() => new Hm());
const Om = {}, Wp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Om
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Dt = BigInt(0), ge = BigInt(1), Ps = BigInt(2), qo = BigInt(3), nh = BigInt(8), ee = Object.freeze({
  a: Dt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ge,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), rh = (t, e) => (t + e / Ps) / e, ka = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ee, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ge * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = rh(i * t, e), c = rh(-r * t, e);
    let l = rt(t - a * n - c * s, e), h = rt(-a * r - c * i, e);
    const u = l > o, w = h > o;
    if (u && (l = e - l), w && (h = e - h), l > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: u, k1: l, k2neg: w, k2: h };
  }
}, or = 32, hi = 32, Zp = 32, hc = or + 1, pc = 2 * or + 1;
function sh(t) {
  const { a: e, b: n } = ee, r = rt(t * t), s = rt(r * t);
  return rt(s + e * t + n);
}
const $a = ee.a === Dt;
class xf extends Error {
  constructor(e) {
    super(e);
  }
}
function ih(t) {
  if (!(t instanceof Vt))
    throw new TypeError("JacobianPoint expected");
}
class Vt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Pt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Pt.ZERO) ? Vt.ZERO : new Vt(e.x, e.y, ge);
  }
  static toAffineBatch(e) {
    const n = zm(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Vt.toAffineBatch(e).map(Vt.fromAffine);
  }
  equals(e) {
    ih(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = rt(s * s), l = rt(a * a), h = rt(n * l), u = rt(i * c), w = rt(rt(r * a) * l), g = rt(rt(o * s) * c);
    return h === u && w === g;
  }
  negate() {
    return new Vt(this.x, rt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = rt(e * e), i = rt(n * n), o = rt(i * i), a = e + i, c = rt(Ps * (rt(a * a) - s - o)), l = rt(qo * s), h = rt(l * l), u = rt(h - Ps * c), w = rt(l * (c - u) - nh * o), g = rt(Ps * n * r);
    return new Vt(u, w, g);
  }
  add(e) {
    ih(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Dt || o === Dt)
      return this;
    if (n === Dt || r === Dt)
      return e;
    const c = rt(s * s), l = rt(a * a), h = rt(n * l), u = rt(i * c), w = rt(rt(r * a) * l), g = rt(rt(o * s) * c), A = rt(u - h), v = rt(g - w);
    if (A === Dt)
      return v === Dt ? this.double() : Vt.ZERO;
    const C = rt(A * A), U = rt(A * C), F = rt(h * C), k = rt(v * v - U - Ps * F), B = rt(v * (F - k) - w * U), P = rt(s * a * A);
    return new Vt(k, B, P);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Vt.ZERO;
    if (typeof e == "bigint" && e === Dt)
      return n;
    let r = ch(e);
    if (r === ge)
      return this;
    if (!$a) {
      let u = n, w = this;
      for (; r > Dt; )
        r & ge && (u = u.add(w)), w = w.double(), r >>= ge;
      return u;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ka.splitScalar(r), c = n, l = n, h = this;
    for (; i > Dt || a > Dt; )
      i & ge && (c = c.add(h)), a & ge && (l = l.add(h)), h = h.double(), i >>= ge, a >>= ge;
    return s && (c = c.negate()), o && (l = l.negate()), l = new Vt(rt(l.x * ka.beta), l.y, l.z), c.add(l);
  }
  precomputeWindow(e) {
    const n = $a ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Vt.BASE) && (n = Pt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && lu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Vt.normalizeZ(s), lu.set(n, s)));
    let i = Vt.ZERO, o = Vt.BASE;
    const a = 1 + ($a ? 128 / r : 256 / r), c = 2 ** (r - 1), l = BigInt(2 ** r - 1), h = 2 ** r, u = BigInt(r);
    for (let w = 0; w < a; w++) {
      const g = w * c;
      let A = Number(e & l);
      e >>= u, A > c && (A -= h, e += ge);
      const v = g, C = g + Math.abs(A) - 1, U = w % 2 !== 0, F = A < 0;
      A === 0 ? o = o.add(Ia(U, s[v])) : i = i.add(Ia(F, s[C]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = ch(e), s, i;
    if ($a) {
      const { k1neg: o, k1: a, k2neg: c, k2: l } = ka.splitScalar(r);
      let { p: h, f: u } = this.wNAF(a, n), { p: w, f: g } = this.wNAF(l, n);
      h = Ia(o, h), w = Ia(c, w), w = new Vt(rt(w.x * ka.beta), w.y, w.z), s = h.add(w), i = u.add(g);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Vt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Vt.ZERO);
    e == null && (e = i ? nh : Ao(s));
    const o = e, a = rt(o * o), c = rt(a * o), l = rt(n * a), h = rt(r * c), u = rt(s * o);
    if (i)
      return Pt.ZERO;
    if (u !== ge)
      throw new Error("invZ was invalid");
    return new Pt(l, h);
  }
}
Vt.BASE = new Vt(ee.Gx, ee.Gy, ge);
Vt.ZERO = new Vt(Dt, ge, Dt);
function Ia(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const lu = /* @__PURE__ */ new WeakMap();
class Pt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, lu.delete(this);
  }
  hasEvenY() {
    return this.y % Ps === Dt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Un(n ? e : e.subarray(1));
    if (!nc(r))
      throw new Error("Point is not on curve");
    const s = sh(r);
    let i = Rm(s);
    const o = (i & ge) === ge;
    n ? o && (i = rt(-i)) : (e[0] & 1) === 1 !== o && (i = rt(-i));
    const a = new Pt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Un(e.subarray(1, or + 1)), r = Un(e.subarray(or + 1, or * 2 + 1)), s = new Pt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Lr(e), r = n.length, s = n[0];
    if (r === or)
      return this.fromCompressedHex(n);
    if (r === hc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === pc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${hc} compressed bytes or ${pc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Pt.BASE.multiply(pi(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = tg(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Sf(Lr(e)), { n: a } = ee, c = r === 2 || r === 3 ? s + a : s, l = Ao(c, a), h = rt(-o * l, a), u = rt(i * l, a), w = r & 1 ? "03" : "02", g = Pt.fromHex(w + Us(c)), A = Pt.BASE.multiplyAndAddUnsafe(g, h, u);
    if (!A)
      throw new Error("Cannot recover signature: point at infinify");
    return A.assertValidity(), A;
  }
  toRawBytes(e = !1) {
    return Hs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Us(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Us(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!nc(n) || !nc(r))
      throw new Error(e);
    const s = rt(r * r), i = sh(n);
    if (rt(s - i) !== Dt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Pt(this.x, rt(-this.y));
  }
  double() {
    return Vt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Vt.fromAffine(this).add(Vt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Vt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Vt.fromAffine(this), i = n === Dt || n === ge || this !== Pt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Vt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Vt.ZERO) ? void 0 : a.toAffine();
  }
}
Pt.BASE = new Pt(ee.Gx, ee.Gy);
Pt.ZERO = new Pt(Dt, Dt);
function oh(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ah(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${oo(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Un(n), left: t.subarray(e + 2) };
}
function Dm(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${oo(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ah(t.subarray(2)), { data: r, left: s } = ah(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${oo(s)}`);
  return { r: e, s: r };
}
class Nn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? oo(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Nn(gc(s.slice(0, 64)), gc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Dm(n ? e : Hs(e));
    return new Nn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!co(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!co(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ee.n >> ge;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Nn(this.r, rt(-this.s, ee.n)) : this;
  }
  toDERRawBytes() {
    return Hs(this.toDERHex());
  }
  toDERHex() {
    const e = oh(Oo(this.s)), n = oh(Oo(this.r)), r = e.length / 2, s = n.length / 2, i = Oo(r), o = Oo(s);
    return `30${Oo(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Hs(this.toCompactHex());
  }
  toCompactHex() {
    return Us(this.r) + Us(this.s);
  }
}
function Ms(...t) {
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
const Fm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oo(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Fm[t[n]];
  return e;
}
const jm = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Us(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Dt <= t && t < jm))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ao(t) {
  const e = Hs(Us(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Oo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function gc(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Hs(t) {
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
function Un(t) {
  return gc(oo(t));
}
function Lr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Hs(t);
}
function ch(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && co(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function rt(t, e = ee.P) {
  const n = t % e;
  return n >= Dt ? n : e + n;
}
function Rn(t, e) {
  const { P: n } = ee;
  let r = t;
  for (; e-- > Dt; )
    r *= r, r %= n;
  return r;
}
function Rm(t) {
  const { P: e } = ee, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, l = c * c * t % e, h = Rn(l, qo) * l % e, u = Rn(h, qo) * l % e, w = Rn(u, Ps) * c % e, g = Rn(w, r) * w % e, A = Rn(g, s) * g % e, v = Rn(A, o) * A % e, C = Rn(v, a) * v % e, U = Rn(C, o) * A % e, F = Rn(U, qo) * l % e, k = Rn(F, i) * g % e, B = Rn(k, n) * c % e, P = Rn(B, Ps);
  if (P * P % e !== t)
    throw new Error("Cannot find square root");
  return P;
}
function Ao(t, e = ee.P) {
  if (t === Dt || e <= Dt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = rt(t, e), r = e, s = Dt, i = ge;
  for (; n !== Dt; ) {
    const a = r / n, c = r % n, l = s - i * a;
    r = n, n = c, s = i, i = l;
  }
  if (r !== ge)
    throw new Error("invert: does not exist");
  return rt(s, e);
}
function zm(t, e = ee.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Dt ? i : (n[a] = i, rt(i * o, e)), ge), s = Ao(r, e);
  return t.reduceRight((i, o, a) => o === Dt ? i : (n[a] = rt(i * n[a], e), rt(i * o, e)), s), n;
}
function Gm(t) {
  const e = t.length * 8 - hi * 8, n = Un(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Sf(t, e = !1) {
  const n = Gm(t);
  if (e)
    return n;
  const { n: r } = ee;
  return n >= r ? n - r : n;
}
let eo, Yo;
class Qp {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Ie.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Yo(this.k, ...e);
  }
  checkSync() {
    if (typeof Yo != "function")
      throw new xf("hmacSha256Sync needs to be set");
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
function co(t) {
  return Dt < t && t < ee.n;
}
function nc(t) {
  return Dt < t && t < ee.P;
}
function Jp(t, e, n, r = !0) {
  const { n: s } = ee, i = Sf(t, !0);
  if (!co(i))
    return;
  const o = Ao(i, s), a = Pt.BASE.multiply(i), c = rt(a.x, s);
  if (c === Dt)
    return;
  const l = rt(o * rt(e + n * c, s), s);
  if (l === Dt)
    return;
  let h = new Nn(c, l), u = (a.x === h.r ? 0 : 2) | Number(a.y & ge);
  return r && h.hasHighS() && (h = h.normalizeS(), u ^= 1), { sig: h, recovery: u };
}
function pi(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * hi)
      throw new Error("Expected 32 bytes of private key");
    e = gc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== hi)
      throw new Error("Expected 32 bytes of private key");
    e = Un(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!co(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Ef(t) {
  return t instanceof Pt ? (t.assertValidity(), t) : Pt.fromHex(t);
}
function tg(t) {
  if (t instanceof Nn)
    return t.assertValidity(), t;
  try {
    return Nn.fromDER(t);
  } catch {
    return Nn.fromCompact(t);
  }
}
function pa(t, e = !1) {
  return Pt.fromPrivateKey(t).toRawBytes(e);
}
function Km(t, e, n, r = !1) {
  return Pt.fromSignature(t, e, n).toRawBytes(r);
}
function lh(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === hc || r === pc : n ? r === hc * 2 || r === pc * 2 : t instanceof Pt;
}
function Af(t, e, n = !1) {
  if (lh(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!lh(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Ef(e);
  return r.assertValidity(), r.multiply(pi(t)).toRawBytes(n);
}
function eg(t) {
  const e = t.length > or ? t.slice(0, or) : t;
  return Un(e);
}
function Vm(t) {
  const e = eg(t), n = rt(e, ee.n);
  return ng(n < Dt ? e : n);
}
function ng(t) {
  return ao(t);
}
function rg(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Lr(t), s = pi(e), i = [ng(s), Vm(r)];
  if (n != null) {
    n === !0 && (n = Ie.randomBytes(or));
    const c = Lr(n);
    if (c.length !== or)
      throw new Error(`sign: Expected ${or} bytes of extra data`);
    i.push(c);
  }
  const o = Ms(...i), a = eg(r);
  return { seed: o, m: a, d: s };
}
function sg(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function qm(t, e, n = {}) {
  const { seed: r, m: s, d: i } = rg(t, e, n.extraEntropy), o = new Qp(Zp, hi);
  await o.reseed(r);
  let a;
  for (; !(a = Jp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return sg(a, n);
}
function qc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = rg(t, e, n.extraEntropy), o = new Qp(Zp, hi);
  o.reseedSync(r);
  let a;
  for (; !(a = Jp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return sg(a, n);
}
const Ym = { strict: !0 };
function Xm(t, e, n, r = Ym) {
  let s;
  try {
    s = tg(t), e = Lr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Sf(e);
  let c;
  try {
    c = Ef(n);
  } catch {
    return !1;
  }
  const { n: l } = ee, h = Ao(o, l), u = rt(a * h, l), w = rt(i * h, l), g = Pt.BASE.multiplyAndAddUnsafe(c, u, w);
  return g ? rt(g.x, l) === i : !1;
}
function yc(t) {
  return rt(Un(t), ee.n);
}
class lo {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Lr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Un(n.subarray(0, 32)), s = Un(n.subarray(32, 64));
    return new lo(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!nc(e) || !co(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Us(this.r) + Us(this.s);
  }
  toRawBytes() {
    return Hs(this.toHex());
  }
}
function Wm(t) {
  return Pt.fromPrivateKey(t).toRawX();
}
class ig {
  constructor(e, n, r = Ie.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Lr(e);
    const { x: s, scalar: i } = this.getScalar(pi(n));
    if (this.px = s, this.d = i, this.rand = Lr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Pt.fromPrivateKey(e), r = n.hasEvenY() ? e : ee.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ao(e ^ Un(n));
  }
  finalizeNonce(e) {
    const n = rt(Un(e), ee.n);
    if (n === Dt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new lo(e.x, rt(n + r * s, ee.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ie.taggedHash, o = this.initNonce(n, await i(Bs.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(await i(Bs.nonce, o, r, e)), h = yc(await i(Bs.challenge, c, r, e)), u = this.finalizeSig(a, l, h, n);
    return await cg(u, e, r) || this.error(), u;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ie.taggedHashSync, o = this.initNonce(n, i(Bs.aux, s)), { R: a, rx: c, k: l } = this.finalizeNonce(i(Bs.nonce, o, r, e)), h = yc(i(Bs.challenge, c, r, e)), u = this.finalizeSig(a, l, h, n);
    return lg(u, e, r) || this.error(), u;
  }
}
async function Zm(t, e, n) {
  return new ig(t, e, n).calc();
}
function Qm(t, e, n) {
  return new ig(t, e, n).calcSync();
}
function og(t, e, n) {
  const r = t instanceof lo, s = r ? t : lo.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Lr(e),
    P: Ef(n)
  };
}
function ag(t, e, n, r) {
  const s = Pt.BASE.multiplyAndAddUnsafe(e, pi(n), rt(-r, ee.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function cg(t, e, n) {
  try {
    const { r, s, m: i, P: o } = og(t, e, n), a = yc(await Ie.taggedHash(Bs.challenge, ao(r), o.toRawX(), i));
    return ag(r, o, s, a);
  } catch {
    return !1;
  }
}
function lg(t, e, n) {
  try {
    const { r, s, m: i, P: o } = og(t, e, n), a = yc(Ie.taggedHashSync(Bs.challenge, ao(r), o.toRawX(), i));
    return ag(r, o, s, a);
  } catch (r) {
    if (r instanceof xf)
      throw r;
    return !1;
  }
}
const Jm = {
  Signature: lo,
  getPublicKey: Wm,
  sign: Zm,
  verify: cg,
  signSync: Qm,
  verifySync: lg
};
Pt.BASE._setWindowSize(8);
const Tn = {
  node: Wp,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Bs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, La = {}, Ie = {
  bytesToHex: oo,
  hexToBytes: Hs,
  concatBytes: Ms,
  mod: rt,
  invert: Ao,
  isValidPrivateKey(t) {
    try {
      return pi(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ao,
  _normalizePrivateKey: pi,
  hashToPrivateKey: (t) => {
    t = Lr(t);
    const e = hi + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = rt(Un(t), ee.n - ge) + ge;
    return ao(n);
  },
  randomBytes: (t = 32) => {
    if (Tn.web)
      return Tn.web.getRandomValues(new Uint8Array(t));
    if (Tn.node) {
      const { randomBytes: e } = Tn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ie.hashToPrivateKey(Ie.randomBytes(hi + 8)),
  precompute(t = 8, e = Pt.BASE) {
    const n = e === Pt.BASE ? e : new Pt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(qo), n;
  },
  sha256: async (...t) => {
    if (Tn.web) {
      const e = await Tn.web.subtle.digest("SHA-256", Ms(...t));
      return new Uint8Array(e);
    } else if (Tn.node) {
      const { createHash: e } = Tn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Tn.web) {
      const n = await Tn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ms(...e), s = await Tn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Tn.node) {
      const { createHmac: n } = Tn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = La[t];
    if (n === void 0) {
      const r = await Ie.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ms(r, r), La[t] = n;
    }
    return Ie.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof eo != "function")
      throw new xf("sha256Sync is undefined, you need to set it");
    let n = La[t];
    if (n === void 0) {
      const r = eo(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ms(r, r), La[t] = n;
    }
    return eo(n, ...e);
  },
  _JacobianPoint: Vt
};
Object.defineProperties(Ie, {
  sha256Sync: {
    configurable: !1,
    get() {
      return eo;
    },
    set(t) {
      eo || (eo = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Yo;
    },
    set(t) {
      Yo || (Yo = t);
    }
  }
});
const t1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ee,
  Point: Pt,
  Signature: Nn,
  getPublicKey: pa,
  getSharedSecret: Af,
  recoverPublicKey: Km,
  schnorr: Jm,
  sign: qm,
  signSync: qc,
  utils: Ie,
  verify: Xm
}, Symbol.toStringTag, { value: "Module" }));
var ga = {};
ga.byteLength = i1;
var e1 = ga.toByteArray = a1, n1 = ga.fromByteArray = u1, xr = [], Kn = [], r1 = typeof Uint8Array < "u" ? Uint8Array : Array, $l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var zi = 0, s1 = $l.length; zi < s1; ++zi)
  xr[zi] = $l[zi], Kn[$l.charCodeAt(zi)] = zi;
Kn[45] = 62;
Kn[95] = 63;
function ug(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function i1(t) {
  var e = ug(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function o1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function a1(t) {
  var e, n = ug(t), r = n[0], s = n[1], i = new r1(o1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Kn[t.charCodeAt(c)] << 18 | Kn[t.charCodeAt(c + 1)] << 12 | Kn[t.charCodeAt(c + 2)] << 6 | Kn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Kn[t.charCodeAt(c)] << 2 | Kn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Kn[t.charCodeAt(c)] << 10 | Kn[t.charCodeAt(c + 1)] << 4 | Kn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function c1(t) {
  return xr[t >> 18 & 63] + xr[t >> 12 & 63] + xr[t >> 6 & 63] + xr[t & 63];
}
function l1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(c1(r));
  return s.join("");
}
function u1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(l1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    xr[e >> 2] + xr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    xr[e >> 10] + xr[e >> 4 & 63] + xr[e << 2 & 63] + "="
  )), s.join("");
}
function f1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const d1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function h1() {
  if (f1())
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
    throw new Error(d1);
  }
}
class p1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Ir(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Ir(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class g1 {
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
async function fg() {
  const t = await h1();
  return t.name === "subtleCrypto" ? new g1(t.lib) : new p1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function y1(t) {
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
  function h(g) {
    if (g instanceof Uint8Array || (ArrayBuffer.isView(g) ? g = new Uint8Array(g.buffer, g.byteOffset, g.byteLength) : Array.isArray(g) && (g = Uint8Array.from(g))), !(g instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (g.length === 0)
      return "";
    for (var A = 0, v = 0, C = 0, U = g.length; C !== U && g[C] === 0; )
      C++, A++;
    for (var F = (U - C) * l + 1 >>> 0, k = new Uint8Array(F); C !== U; ) {
      for (var B = g[C], P = 0, q = F - 1; (B !== 0 || P < v) && q !== -1; q--, P++)
        B += 256 * k[q] >>> 0, k[q] = B % o >>> 0, B = B / o >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      v = P, C++;
    }
    for (var st = F - v; st !== F && k[st] === 0; )
      st++;
    for (var X = a.repeat(A); st < F; ++st)
      X += t.charAt(k[st]);
    return X;
  }
  function u(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var A = 0, v = 0, C = 0; g[A] === a; )
      v++, A++;
    for (var U = (g.length - A) * c + 1 >>> 0, F = new Uint8Array(U); g[A]; ) {
      var k = g.charCodeAt(A);
      if (k > 255)
        return;
      var B = e[k];
      if (B === 255)
        return;
      for (var P = 0, q = U - 1; (B !== 0 || P < C) && q !== -1; q--, P++)
        B += o * F[q] >>> 0, F[q] = B % 256 >>> 0, B = B / 256 >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      C = P, A++;
    }
    for (var st = U - C; st !== U && F[st] === 0; )
      st++;
    for (var X = new Uint8Array(v + (U - st)), V = v; st !== U; )
      X[V++] = F[st++];
    return X;
  }
  function w(g) {
    var A = u(g);
    if (A)
      return A;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: u,
    decode: w
  };
}
var dg = y1;
const w1 = dg, b1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var m1 = w1(b1);
const x1 = /* @__PURE__ */ Up(m1), S1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), hg = Uint8Array.from({ length: 16 }, (t, e) => e), E1 = hg.map((t) => (9 * t + 5) % 16);
let vf = [hg], kf = [E1];
for (let t = 0; t < 4; t++)
  for (let e of [vf, kf])
    e.push(e[t].map((n) => S1[n]));
const pg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), A1 = vf.map((t, e) => t.map((n) => pg[e][n])), v1 = kf.map((t, e) => t.map((n) => pg[e][n])), k1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), $1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ca = (t, e) => t << e | t >>> 32 - e;
function uh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ta = new Uint32Array(16);
let I1 = class extends mf {
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
    for (let g = 0; g < 16; g++, n += 4)
      Ta[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = k1[g], C = $1[g], U = vf[g], F = kf[g], k = A1[g], B = v1[g];
      for (let P = 0; P < 16; P++) {
        const q = Ca(r + uh(g, i, a, l) + Ta[U[P]] + v, k[P]) + u | 0;
        r = u, u = l, l = Ca(a, 10) | 0, a = i, i = q;
      }
      for (let P = 0; P < 16; P++) {
        const q = Ca(s + uh(A, o, c, h) + Ta[F[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Ca(c, 10) | 0, c = o, o = q;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ta.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const L1 = Ti(() => new I1());
function C1(t) {
  return L1(t);
}
const Ba = BigInt(2 ** 32 - 1), uu = BigInt(32);
function gg(t, e = !1) {
  return e ? { h: Number(t & Ba), l: Number(t >> uu & Ba) } : { h: Number(t >> uu & Ba) | 0, l: Number(t & Ba) | 0 };
}
function T1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = gg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const B1 = (t, e) => BigInt(t >>> 0) << uu | BigInt(e >>> 0), M1 = (t, e, n) => t >>> n, _1 = (t, e, n) => t << 32 - n | e >>> n, P1 = (t, e, n) => t >>> n | e << 32 - n, N1 = (t, e, n) => t << 32 - n | e >>> n, U1 = (t, e, n) => t << 64 - n | e >>> n - 32, H1 = (t, e, n) => t >>> n - 32 | e << 64 - n, O1 = (t, e) => e, D1 = (t, e) => t, F1 = (t, e, n) => t << n | e >>> 32 - n, j1 = (t, e, n) => e << n | t >>> 32 - n, R1 = (t, e, n) => e << n - 32 | t >>> 64 - n, z1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function G1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const K1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), V1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, q1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Y1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, X1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), W1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, $t = {
  fromBig: gg,
  split: T1,
  toBig: B1,
  shrSH: M1,
  shrSL: _1,
  rotrSH: P1,
  rotrSL: N1,
  rotrBH: U1,
  rotrBL: H1,
  rotr32H: O1,
  rotr32L: D1,
  rotlSH: F1,
  rotlSL: j1,
  rotlBH: R1,
  rotlBL: z1,
  add: G1,
  add3L: K1,
  add3H: V1,
  add4L: q1,
  add4H: Y1,
  add5H: W1,
  add5L: X1
}, [Z1, Q1] = $t.split([
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
let Yc = class extends mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: u, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      us[k] = e.getUint32(n), fs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = us[k - 15] | 0, P = fs[k - 15] | 0, q = $t.rotrSH(B, P, 1) ^ $t.rotrSH(B, P, 8) ^ $t.shrSH(B, P, 7), st = $t.rotrSL(B, P, 1) ^ $t.rotrSL(B, P, 8) ^ $t.shrSL(B, P, 7), X = us[k - 2] | 0, V = fs[k - 2] | 0, y = $t.rotrSH(X, V, 19) ^ $t.rotrBH(X, V, 61) ^ $t.shrSH(X, V, 6), $ = $t.rotrSL(X, V, 19) ^ $t.rotrBL(X, V, 61) ^ $t.shrSL(X, V, 6), M = $t.add4L(st, $, fs[k - 7], fs[k - 16]), T = $t.add4H(M, q, y, us[k - 7], us[k - 16]);
      us[k] = T | 0, fs[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: u, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const B = $t.rotrSH(u, w, 14) ^ $t.rotrSH(u, w, 18) ^ $t.rotrBH(u, w, 41), P = $t.rotrSL(u, w, 14) ^ $t.rotrSL(u, w, 18) ^ $t.rotrBL(u, w, 41), q = u & g ^ ~u & v, st = w & A ^ ~w & C, X = $t.add5L(F, P, st, Q1[k], fs[k]), V = $t.add5H(X, U, B, q, Z1[k], us[k]), y = X | 0, $ = $t.rotrSH(r, s, 28) ^ $t.rotrBH(r, s, 34) ^ $t.rotrBH(r, s, 39), M = $t.rotrSL(r, s, 28) ^ $t.rotrBL(r, s, 34) ^ $t.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = C | 0, v = g | 0, C = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = $t.add(l | 0, h | 0, V | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = $t.add3L(y, M, K);
      r = $t.add3H(z, V, $, T), s = z | 0;
    }
    ({ h: r, l: s } = $t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = $t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = $t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = $t.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: u, l: w } = $t.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = $t.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = $t.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: F } = $t.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, l, h, u, w, g, A, v, C, U, F);
  }
  roundClean() {
    us.fill(0), fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, J1 = class extends Yc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, t2 = class extends Yc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, e2 = class extends Yc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const n2 = Ti(() => new Yc());
Ti(() => new J1());
Ti(() => new t2());
Ti(() => new e2());
function yg(t) {
  return io(t);
}
function r2(t) {
  return n2(t);
}
const s2 = 0;
Ie.hmacSha256Sync = (t, ...e) => {
  const n = Vc.create(io, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function i2() {
  return gt(Ie.randomPrivateKey());
}
function o2(t) {
  const e = io(io(t));
  return x1.encode(Ir(t, e).slice(0, t.length + 4));
}
function a2(t, e) {
  return o2(Ir(new Uint8Array([t]), e.slice(0, 20)));
}
function wg(t, e = s2) {
  const n = typeof t == "string" ? jt(t) : t, r = C1(yg(n));
  return a2(e, r);
}
function bg(t) {
  const e = wf(t);
  return gt(pa(e.slice(0, 32), !0));
}
Ie.hmacSha256Sync = (t, ...e) => {
  const n = Vc.create(io, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var wc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(wc || (wc = {}));
async function c2(t, e, n) {
  return await (await fg()).encrypt("aes-256-cbc", e, t, n);
}
async function l2(t, e, n) {
  return await (await fg()).decrypt("aes-256-cbc", e, t, n);
}
function mg(t, e) {
  return Vc(io, t, e);
}
function u2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function xg(t) {
  const e = r2(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function f2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function d2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: wc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: wc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !f2(t))
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
async function h2(t, e, n, r) {
  const s = d2(t);
  if (!s.result)
    throw s;
  const i = Ie.randomPrivateKey(), o = pa(i, !0);
  let a = Af(i, t, !0);
  a = a.slice(1);
  const c = xg(a), l = Ie.randomBytes(16), h = await c2(l, c.encryptionKey, e), u = Ir(l, o, h), w = mg(c.hmacKey, u);
  let g;
  if (!r || r === "hex")
    g = gt(h);
  else if (r === "base64")
    g = n1(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const A = {
    iv: gt(l),
    ephemeralPK: gt(o),
    cipherText: g,
    mac: gt(w),
    wasString: n
  };
  return r && r !== "hex" && (A.cipherTextEncoding = r), A;
}
async function Sg(t, e) {
  if (!e.ephemeralPK)
    throw new Qd("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Af(t, n, !0);
  r = r.slice(1);
  const s = xg(r), i = jt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = jt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = e1(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Ir(i, jt(n), o), c = mg(s.hmacKey, a), l = jt(e.mac);
  if (!u2(l, c))
    throw new Qd("Decryption failed: failure in MAC check");
  const h = await l2(i, s.encryptionKey, o);
  return e.wasString ? ha(h) : h;
}
function p2(t, e) {
  const n = typeof e == "string" ? Ci(e) : e, r = bg(t), s = yg(n), i = qc(s, t);
  return {
    signature: gt(i),
    publicKey: r
  };
}
async function g2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = bg(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Ci(t) : t, o = await h2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = p2(r, a), l = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(l);
  }
  return a;
}
function y2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Sg(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var We = {}, uo = {}, fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.decode = fn.encode = fn.unescape = fn.escape = fn.pad = void 0;
const Eg = ga;
function $f(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
fn.pad = $f;
function Ag(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
fn.escape = Ag;
function vg(t) {
  return $f(t).replace(/-/g, "+").replace(/_/g, "/");
}
fn.unescape = vg;
function w2(t) {
  return Ag((0, Eg.fromByteArray)(new TextEncoder().encode(t)));
}
fn.encode = w2;
function b2(t) {
  return new TextDecoder().decode((0, Eg.toByteArray)($f(vg(t))));
}
fn.decode = b2;
var Xc = {}, Wc = {}, kg = {}, $g = {}, Zc = {};
Object.defineProperty(Zc, "__esModule", { value: !0 });
Zc.crypto = void 0;
Zc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = l, t.clean = h, t.createView = u, t.rotr = w, t.rotl = g, t.byteSwap = A, t.byteSwap32 = v, t.bytesToHex = F, t.hexToBytes = P, t.asyncLoop = st, t.utf8ToBytes = X, t.bytesToUtf8 = V, t.toBytes = y, t.kdfInputToBytes = $, t.concatBytes = M, t.checkOpts = T, t.createHasher = z, t.createOptHasher = pt, t.createXOFer = ct, t.randomBytes = Ut;
  const e = Zc;
  function n(L) {
    return L instanceof Uint8Array || ArrayBuffer.isView(L) && L.constructor.name === "Uint8Array";
  }
  function r(L) {
    if (!Number.isSafeInteger(L) || L < 0)
      throw new Error("positive integer expected, got " + L);
  }
  function s(L, ...H) {
    if (!n(L))
      throw new Error("Uint8Array expected");
    if (H.length > 0 && !H.includes(L.length))
      throw new Error("Uint8Array expected of length " + H + ", got length=" + L.length);
  }
  function i(L) {
    if (typeof L != "function" || typeof L.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(L.outputLen), r(L.blockLen);
  }
  function o(L, H = !0) {
    if (L.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (H && L.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(L, H) {
    s(L);
    const ot = H.outputLen;
    if (L.length < ot)
      throw new Error("digestInto() expects output buffer of length at least " + ot);
  }
  function c(L) {
    return new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
  }
  function l(L) {
    return new Uint32Array(L.buffer, L.byteOffset, Math.floor(L.byteLength / 4));
  }
  function h(...L) {
    for (let H = 0; H < L.length; H++)
      L[H].fill(0);
  }
  function u(L) {
    return new DataView(L.buffer, L.byteOffset, L.byteLength);
  }
  function w(L, H) {
    return L << 32 - H | L >>> H;
  }
  function g(L, H) {
    return L << H | L >>> 32 - H >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function A(L) {
    return L << 24 & 4278190080 | L << 8 & 16711680 | L >>> 8 & 65280 | L >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (L) => L : (L) => A(L), t.byteSwapIfBE = t.swap8IfBE;
  function v(L) {
    for (let H = 0; H < L.length; H++)
      L[H] = A(L[H]);
    return L;
  }
  t.swap32IfBE = t.isLE ? (L) => L : v;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (L, H) => H.toString(16).padStart(2, "0"));
  function F(L) {
    if (s(L), C)
      return L.toHex();
    let H = "";
    for (let ot = 0; ot < L.length; ot++)
      H += U[L[ot]];
    return H;
  }
  const k = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function B(L) {
    if (L >= k._0 && L <= k._9)
      return L - k._0;
    if (L >= k.A && L <= k.F)
      return L - (k.A - 10);
    if (L >= k.a && L <= k.f)
      return L - (k.a - 10);
  }
  function P(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (C)
      return Uint8Array.fromHex(L);
    const H = L.length, ot = H / 2;
    if (H % 2)
      throw new Error("hex string expected, got unpadded hex of length " + H);
    const St = new Uint8Array(ot);
    for (let Et = 0, yt = 0; Et < ot; Et++, yt += 2) {
      const Le = B(L.charCodeAt(yt)), At = B(L.charCodeAt(yt + 1));
      if (Le === void 0 || At === void 0) {
        const vt = L[yt] + L[yt + 1];
        throw new Error('hex string expected, got non-hex character "' + vt + '" at index ' + yt);
      }
      St[Et] = Le * 16 + At;
    }
    return St;
  }
  const q = async () => {
  };
  t.nextTick = q;
  async function st(L, H, ot) {
    let St = Date.now();
    for (let Et = 0; Et < L; Et++) {
      ot(Et);
      const yt = Date.now() - St;
      yt >= 0 && yt < H || (await (0, t.nextTick)(), St += yt);
    }
  }
  function X(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function V(L) {
    return new TextDecoder().decode(L);
  }
  function y(L) {
    return typeof L == "string" && (L = X(L)), s(L), L;
  }
  function $(L) {
    return typeof L == "string" && (L = X(L)), s(L), L;
  }
  function M(...L) {
    let H = 0;
    for (let St = 0; St < L.length; St++) {
      const Et = L[St];
      s(Et), H += Et.length;
    }
    const ot = new Uint8Array(H);
    for (let St = 0, Et = 0; St < L.length; St++) {
      const yt = L[St];
      ot.set(yt, Et), Et += yt.length;
    }
    return ot;
  }
  function T(L, H) {
    if (H !== void 0 && {}.toString.call(H) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, H);
  }
  class K {
  }
  t.Hash = K;
  function z(L) {
    const H = (St) => L().update(y(St)).digest(), ot = L();
    return H.outputLen = ot.outputLen, H.blockLen = ot.blockLen, H.create = () => L(), H;
  }
  function pt(L) {
    const H = (St, Et) => L(Et).update(y(St)).digest(), ot = L({});
    return H.outputLen = ot.outputLen, H.blockLen = ot.blockLen, H.create = (St) => L(St), H;
  }
  function ct(L) {
    const H = (St, Et) => L(Et).update(y(St)).digest(), ot = L({});
    return H.outputLen = ot.outputLen, H.blockLen = ot.blockLen, H.create = (St) => L(St), H;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = pt, t.wrapXOFConstructorWithOpts = ct;
  function Ut(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})($g);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = $g;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, l = new Uint8Array(c);
      l.set(a.length > c ? i.create().update(a).digest() : a);
      for (let h = 0; h < l.length; h++)
        l[h] ^= 54;
      this.iHash.update(l), this.oHash = i.create();
      for (let h = 0; h < l.length; h++)
        l[h] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: l, blockLen: h, outputLen: u } = this;
      return i = i, i.finished = c, i.destroyed = l, i.blockLen = h, i.outputLen = u, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(kg);
const Gi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ig(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Bi(t, ...e) {
  if (!Ig(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function m2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  fu(t.outputLen), fu(t.blockLen);
}
function du(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Lg(t, e) {
  Bi(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function x2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function S2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function bc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function rc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function tr(t, e) {
  return t << 32 - e | t >>> e;
}
function E2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const If = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Lf(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Cg = If ? (t) => t : (t) => Lf(t), A2 = Cg;
function Tg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Lf(t[e]);
  return t;
}
const v2 = If ? (t) => t : Tg, Bg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", k2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Mg(t) {
  if (Bi(t), Bg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += k2[t[n]];
  return e;
}
const Or = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function fh(t) {
  if (t >= Or._0 && t <= Or._9)
    return t - Or._0;
  if (t >= Or.A && t <= Or.F)
    return t - (Or.A - 10);
  if (t >= Or.a && t <= Or.f)
    return t - (Or.a - 10);
}
function $2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Bg)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = fh(t.charCodeAt(i)), a = fh(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const _g = async () => {
};
async function I2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await _g(), r += i);
  }
}
function Cf(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function L2(t) {
  return new TextDecoder().decode(t);
}
function ya(t) {
  return typeof t == "string" && (t = Cf(t)), Bi(t), t;
}
function C2(t) {
  return typeof t == "string" && (t = Cf(t)), Bi(t), t;
}
function T2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Bi(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function B2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Pg = class {
};
function Qc(t) {
  const e = (r) => t().update(ya(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ng(t) {
  const e = (r, s) => t(s).update(ya(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Ug(t) {
  const e = (r, s) => t(s).update(ya(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const M2 = Qc, _2 = Ng, P2 = Ug;
function N2(t = 32) {
  if (Gi && typeof Gi.getRandomValues == "function")
    return Gi.getRandomValues(new Uint8Array(t));
  if (Gi && typeof Gi.randomBytes == "function")
    return Uint8Array.from(Gi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const U2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Pg,
  abytes: Bi,
  aexists: du,
  ahash: m2,
  anumber: fu,
  aoutput: Lg,
  asyncLoop: I2,
  byteSwap: Lf,
  byteSwap32: Tg,
  byteSwapIfBE: A2,
  bytesToHex: Mg,
  bytesToUtf8: L2,
  checkOpts: B2,
  clean: bc,
  concatBytes: T2,
  createHasher: Qc,
  createOptHasher: Ng,
  createView: rc,
  createXOFer: Ug,
  hexToBytes: $2,
  isBytes: Ig,
  isLE: If,
  kdfInputToBytes: C2,
  nextTick: _g,
  randomBytes: N2,
  rotl: E2,
  rotr: tr,
  swap32IfBE: v2,
  swap8IfBE: Cg,
  toBytes: ya,
  u32: S2,
  u8: x2,
  utf8ToBytes: Cf,
  wrapConstructor: M2,
  wrapConstructorWithOpts: _2,
  wrapXOFConstructorWithOpts: P2
}, Symbol.toStringTag, { value: "Module" }));
function H2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
function O2(t, e, n) {
  return t & e ^ ~t & n;
}
function D2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class F2 extends Pg {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = rc(this.buffer);
  }
  update(e) {
    du(this), e = ya(e), Bi(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = rc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    du(this), Lg(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, bc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    H2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = rc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, h[u], i);
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
const ds = /* @__PURE__ */ Uint32Array.from([
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
]), j2 = /* @__PURE__ */ Uint32Array.from([
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
let Tf = class extends F2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = ds[0] | 0, this.B = ds[1] | 0, this.C = ds[2] | 0, this.D = ds[3] | 0, this.E = ds[4] | 0, this.F = ds[5] | 0, this.G = ds[6] | 0, this.H = ds[7] | 0;
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
      ps[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = ps[u - 15], g = ps[u - 2], A = tr(w, 7) ^ tr(w, 18) ^ w >>> 3, v = tr(g, 17) ^ tr(g, 19) ^ g >>> 10;
      ps[u] = v + ps[u - 7] + A + ps[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = tr(a, 6) ^ tr(a, 11) ^ tr(a, 25), g = h + w + O2(a, c, l) + j2[u] + ps[u] | 0, v = (tr(r, 2) ^ tr(r, 13) ^ tr(r, 22)) + D2(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    bc(ps);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bc(this.buffer);
  }
}, Hg = class extends Tf {
  constructor() {
    super(28), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
  }
};
const R2 = /* @__PURE__ */ Qc(() => new Tf()), z2 = /* @__PURE__ */ Qc(() => new Hg()), G2 = Tf, Og = R2, K2 = Hg, V2 = z2, q2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: K2,
  SHA256: G2,
  sha224: V2,
  sha256: Og
}, Symbol.toStringTag, { value: "Module" })), Jc = /* @__PURE__ */ Gc(q2), Y2 = /* @__PURE__ */ Gc(t1);
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
fo.joseToDer = fo.derToJose = void 0;
const Dg = ga, Fg = fn;
function Il(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const X2 = {
  ES256: Il(256),
  ES384: Il(384),
  ES512: Il(521)
};
function jg(t) {
  const e = X2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const mc = 128, Rg = 0, W2 = 32, Z2 = 16, Q2 = 2, zg = Z2 | W2 | Rg << 6, xc = Q2 | Rg << 6;
function Gg(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Dg.toByteArray)((0, Fg.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function J2(t, e) {
  const n = Gg(t), r = jg(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== zg)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (mc | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== xc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const l = o;
  if (o += c, n[o++] !== xc)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const u = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const w = r - c, g = r - h, A = new Uint8Array(w + c + g + h);
  for (o = 0; o < w; ++o)
    A[o] = 0;
  A.set(n.subarray(l + Math.max(-w, 0), l + c), o), o = r;
  for (const v = o; o < v + g; ++o)
    A[o] = 0;
  return A.set(n.subarray(u + Math.max(-g, 0), u + h), o), (0, Fg.escape)((0, Dg.fromByteArray)(A));
}
fo.derToJose = J2;
function dh(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= mc && --r, r;
}
function tx(t, e) {
  t = Gg(t);
  const n = jg(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = dh(t, 0, n), i = dh(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, l = c < mc, h = new Uint8Array((l ? 2 : 3) + c);
  let u = 0;
  return h[u++] = zg, l ? h[u++] = c : (h[u++] = mc | 1, h[u++] = c & 255), h[u++] = xc, h[u++] = o, s < 0 ? (h[u++] = 0, h.set(t.subarray(0, n), u), u += n) : (h.set(t.subarray(s, n), u), u += n - s), h[u++] = xc, h[u++] = a, i < 0 ? (h[u++] = 0, h.set(t.subarray(n), u)) : h.set(t.subarray(n + i), u), h;
}
fo.joseToDer = tx;
var Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.InvalidTokenError = Wr.MissingParametersError = void 0;
class ex extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Wr.MissingParametersError = ex;
class nx extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Wr.InvalidTokenError = nx;
const wa = /* @__PURE__ */ Gc(U2);
Object.defineProperty(Wc, "__esModule", { value: !0 });
Wc.SECP256K1Client = void 0;
const rx = kg, sx = Jc, sc = Y2, hh = fo, ph = Wr, gh = wa;
sc.utils.hmacSha256Sync = (t, ...e) => {
  const n = rx.hmac.create(sx.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Kg {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, gh.bytesToHex)(sc.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ph.MissingParametersError("a signing input hash and private key are all required");
    const s = sc.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, gh.bytesToHex)(s);
    if (r === "jose")
      return (0, hh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, hh.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ph.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return sc.verify(n, e, r, { strict: !1 });
  }
}
Wc.SECP256K1Client = Kg;
Kg.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Wc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Xc);
var gi = {};
const ix = /* @__PURE__ */ Gc(Wp);
var ox = hn && hn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        l(r.next(h));
      } catch (u) {
        o(u);
      }
    }
    function c(h) {
      try {
        l(r.throw(h));
      } catch (u) {
        o(u);
      }
    }
    function l(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.hashSha256Async = gi.hashSha256 = void 0;
const ax = Jc;
function Vg(t) {
  return (0, ax.sha256)(t);
}
gi.hashSha256 = Vg;
function cx(t) {
  return ox(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = ix;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Vg(t));
    }
  });
}
gi.hashSha256Async = cx;
var lx = hn && hn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        l(r.next(h));
      } catch (u) {
        o(u);
      }
    }
    function c(h) {
      try {
        l(r.throw(h));
      } catch (u) {
        o(u);
      }
    }
    function l(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.TokenSigner = uo.createUnsecuredToken = void 0;
const hu = fn, yh = Xc, ux = Wr, wh = gi;
function pu(t, e) {
  const n = [], r = hu.encode(JSON.stringify(e));
  n.push(r);
  const s = hu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function fx(t) {
  return pu(t, { typ: "JWT", alg: "none" }) + ".";
}
uo.createUnsecuredToken = fx;
class dx {
  constructor(e, n) {
    if (!(e && n))
      throw new ux.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !yh.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = yh.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = pu(e, s), o = (0, wh.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return lx(this, void 0, void 0, function* () {
      const s = this.header(r), i = pu(e, s), o = yield (0, wh.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [hu.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
uo.TokenSigner = dx;
var tl = {};
Object.defineProperty(tl, "__esModule", { value: !0 });
tl.TokenVerifier = void 0;
const hx = fn, bh = Xc, px = Wr, Ma = gi;
class gx {
  constructor(e, n) {
    if (!(e && n))
      throw new px.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !bh.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = bh.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ma.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ma.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), hx.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ma.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ma.hashSha256)(r);
      return i(o);
    }
  }
}
tl.TokenVerifier = gx;
var el = {};
Object.defineProperty(el, "__esModule", { value: !0 });
el.decodeToken = void 0;
const _a = fn;
function yx(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(_a.decode(e[0])), r = JSON.parse(_a.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = _a.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(_a.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
el.decodeToken = yx;
(function(t) {
  var e = hn && hn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = hn && hn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(uo, t), n(tl, t), n(el, t), n(Wr, t), n(Xc, t);
})(We);
function wx(t) {
  return `did:btc-addr:${t}`;
}
function bx(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Zd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Zd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function qg(t) {
  if (t)
    return bx(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const mx = "1.4.0";
function xx() {
  return i2();
}
function Sx(t, e, n, r = Fp.slice(), s, i = nm().getTime(), o = {}) {
  const a = (g) => {
    const A = gf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return A == null ? void 0 : A.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: sm(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: mx,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), l = We.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [l];
  const h = wg(l);
  return c.iss = wx(h), new We.TokenSigner("ES256k", t).sign(c);
}
async function mh(t, e) {
  const n = ha(jt(e)), r = JSON.parse(n), s = await Sg(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Ex(t) {
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
function Ax(t) {
  const e = We.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = qg(e.iss);
  if (n.length === 1) {
    if (wg(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function vx(t) {
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
function kx(t) {
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
function $x(t) {
  const e = [
    kx(t),
    vx(t),
    Ex(t),
    Ax(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const xh = "1.0.0";
class Os {
  constructor(e) {
    this.version = xh, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== xh)
      throw new iu(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Os(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Yg {
  constructor(e) {
    if (e) {
      const n = new Os(e);
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
class Sh extends Yg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Os({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new jp("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Os({})), !0;
  }
}
class Eh extends Yg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Jb, !localStorage.getItem(this.key)) {
      const r = new Os({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new jp("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Os.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Os({})), !0;
  }
}
var ea;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ea || (ea = {}));
var Sc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Sc || (Sc = {}));
ea.Mainnet;
var Kr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Kr || (Kr = {}));
var Ar;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ar || (Ar = {}));
Kr.Mainnet;
const Xg = {
  chainId: ea.Mainnet,
  transactionVersion: Kr.Mainnet,
  peerNetworkId: Sc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ar.MainnetSingleSig,
    multiSig: Ar.MainnetMultiSig
  },
  client: { baseUrl: Rp }
}, gu = {
  chainId: ea.Testnet,
  transactionVersion: Kr.Testnet,
  peerNetworkId: Sc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ar.TestnetSingleSig,
    multiSig: Ar.TestnetMultiSig
  },
  client: { baseUrl: zp }
}, ic = {
  ...gu,
  addressVersion: { ...gu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Gp }
}, Ix = {
  ...ic,
  addressVersion: { ...ic.addressVersion },
  client: { ...ic.client }
};
function Lx(t) {
  switch (t) {
    case "mainnet":
      return Xg;
    case "testnet":
      return gu;
    case "devnet":
      return ic;
    case "mocknet":
      return Ix;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Wg(t) {
  return typeof t == "string" ? Lx(t) : t;
}
var Ah;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ah || (Ah = {}));
var vh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(vh || (vh = {}));
var er;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(er || (er = {}));
const Ll = ["onChainOnly", "offChainOnly", "any"];
Ll[0] + "", er.OnChainOnly, Ll[1] + "", er.OffChainOnly, Ll[2] + "", er.Any, er.OnChainOnly + "", er.OnChainOnly, er.OffChainOnly + "", er.OffChainOnly, er.Any + "", er.Any;
var kh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(kh || (kh = {}));
var $h;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})($h || ($h = {}));
var Ih;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ih || (Ih = {}));
var zr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(zr || (zr = {}));
var Lh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Lh || (Lh = {}));
var Ch;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ch || (Ch = {}));
var Th;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Th || (Th = {}));
var Bh;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Bh || (Bh = {}));
var Mh;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Mh || (Mh = {}));
var _h;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_h || (_h = {}));
var Ph;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ph || (Ph = {}));
var Nh;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Nh || (Nh = {}));
var Uh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Uh || (Uh = {}));
function yu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Cx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Zg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Tx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  yu(t.outputLen), yu(t.blockLen);
}
function Bx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Mx(t, e) {
  Zg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ri = {
  number: yu,
  bool: Cx,
  bytes: Zg,
  hash: Tx,
  exists: Bx,
  output: Mx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, _x = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_x)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Px(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bf(t) {
  if (typeof t == "string" && (t = Px(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Qg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Mi(t) {
  const e = (r) => t().update(Bf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Jg = class extends Qg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ri.hash(e);
    const r = Bf(n);
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
    return ri.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ri.exists(this), ri.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ty = (t, e, n) => new Jg(t, e).update(n).digest();
ty.create = (t, e) => new Jg(t, e);
function Nx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Mf = class extends Qg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cl(this.buffer);
  }
  update(e) {
    ri.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Cl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ri.exists(this), ri.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    Nx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Cl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, h[u], i);
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
const Ux = (t, e, n) => t & e ^ ~t & n, Hx = (t, e, n) => t & e ^ t & n ^ e & n, Ox = new Uint32Array([
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
let ey = class extends Mf {
  constructor() {
    super(64, 32, 8, !1), this.A = gs[0] | 0, this.B = gs[1] | 0, this.C = gs[2] | 0, this.D = gs[3] | 0, this.E = gs[4] | 0, this.F = gs[5] | 0, this.G = gs[6] | 0, this.H = gs[7] | 0;
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
      ys[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = ys[u - 15], g = ys[u - 2], A = gr(w, 7) ^ gr(w, 18) ^ w >>> 3, v = gr(g, 17) ^ gr(g, 19) ^ g >>> 10;
      ys[u] = v + ys[u - 7] + A + ys[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), g = h + w + Ux(a, c, l) + Ox[u] + ys[u] | 0, v = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + Hx(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    ys.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Dx = class extends ey {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ny = Mi(() => new ey());
Mi(() => new Dx());
var _i = {}, _f = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = wa;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], l = 0;
    for (let g = o.length - 1; g >= 0; g--)
      if (l < 4) {
        const A = n.indexOf(o[g]) >> l;
        let v = 0;
        g !== 0 && (v = n.indexOf(o[g - 1]));
        const C = 1 + l, U = v % (1 << C) << 5 - C, F = t.c32[A + U];
        l = C, c.unshift(F);
      } else
        l = 0;
    let h = 0;
    for (let g = 0; g < c.length && c[g] === "0"; g++)
      h++;
    c = c.slice(h);
    const u = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), w = u ? u[0].length : 0;
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
  function s(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = s;
  function i(o, a) {
    if (o = s(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${t.c32[0]}*`), l = c ? c[0].length : 0;
    let h = [], u = 0, w = 0;
    for (let v = o.length - 1; v >= 0; v--) {
      w === 4 && (h.unshift(n[u]), w = 0, u = 0);
      const U = (t.c32.indexOf(o[v]) << w) + u, F = n[U % 16];
      if (w += 1, u = U >> 4, u > 1 << w)
        throw new Error("Panic error in decoding.");
      h.unshift(F);
    }
    h.unshift(n[u]), h.length % 2 === 1 && h.unshift("0");
    let g = 0;
    for (let v = 0; v < h.length && h[v] === "0"; v++)
      g++;
    h = h.slice(g - g % 2);
    let A = h.join("");
    for (let v = 0; v < l; v++)
      A = `00${A}`;
    if (a) {
      const v = a * 2 - A.length;
      for (let C = 0; C < v; C += 2)
        A = `00${A}`;
    }
    return A;
  }
  t.c32decode = i;
})(_f);
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.c32checkDecode = yi.c32checkEncode = void 0;
const Hh = Jc, Oh = wa, Xo = _f;
function ry(t) {
  const e = (0, Hh.sha256)((0, Hh.sha256)((0, Oh.hexToBytes)(t)));
  return (0, Oh.bytesToHex)(e.slice(0, 4));
}
function Fx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ry(`${n}${e}`), s = (0, Xo.c32encode)(`${e}${r}`);
  return `${Xo.c32[t]}${s}`;
}
yi.c32checkEncode = Fx;
function jx(t) {
  t = (0, Xo.c32normalize)(t);
  const e = (0, Xo.c32decode)(t.slice(1)), n = t[0], r = Xo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), ry(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
yi.c32checkDecode = jx;
var sy = {}, ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
ho.decode = ho.encode = void 0;
const Ec = Jc, Dh = wa, iy = dg, oy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Rx(t, e = "00") {
  const n = typeof t == "string" ? (0, Dh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Dh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...r, ...n])));
  return iy(oy).encode([...r, ...n, ...s.slice(0, 4)]);
}
ho.encode = Rx;
function zx(t) {
  const e = iy(oy).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ho.decode = zx;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = yi, n = ho, r = wa;
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
  function o(h, u) {
    if (!u.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, u)}`;
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
  function c(h, u = -1) {
    const w = n.decode(h), g = (0, r.bytesToHex)(w.data), A = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let v;
    return u < 0 ? (v = A, s[A] !== void 0 && (v = s[A])) : v = u, o(v, g);
  }
  t.b58ToC32 = c;
  function l(h, u = -1) {
    const w = a(h), g = w[0], A = w[1];
    let v;
    u < 0 ? (v = g, i[g] !== void 0 && (v = i[g])) : v = u;
    let C = v.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(A, C);
  }
  t.c32ToB58 = l;
})(sy);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = _f;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = yi;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = sy;
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
})(_i);
function Gx(t, e) {
  switch (e = Wg(e ?? Xg), t) {
    case zr.P2PKH:
      switch (e.transactionVersion) {
        case Kr.Mainnet:
          return Ar.MainnetSingleSig;
        case Kr.Testnet:
          return Ar.TestnetSingleSig;
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
          return Ar.MainnetMultiSig;
        case Kr.Testnet:
          return Ar.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Kx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ay = Uint8Array.from({ length: 16 }, (t, e) => e), Vx = ay.map((t) => (9 * t + 5) % 16);
let Pf = [ay], Nf = [Vx];
for (let t = 0; t < 4; t++)
  for (let e of [Pf, Nf])
    e.push(e[t].map((n) => Kx[n]));
const cy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), qx = Pf.map((t, e) => t.map((n) => cy[e][n])), Yx = Nf.map((t, e) => t.map((n) => cy[e][n])), Xx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Wx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pa = (t, e) => t << e | t >>> 32 - e;
function Fh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Na = new Uint32Array(16);
let Zx = class extends Mf {
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
    for (let g = 0; g < 16; g++, n += 4)
      Na[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = Xx[g], C = Wx[g], U = Pf[g], F = Nf[g], k = qx[g], B = Yx[g];
      for (let P = 0; P < 16; P++) {
        const q = Pa(r + Fh(g, i, a, l) + Na[U[P]] + v, k[P]) + u | 0;
        r = u, u = l, l = Pa(a, 10) | 0, a = i, i = q;
      }
      for (let P = 0; P < 16; P++) {
        const q = Pa(s + Fh(A, o, c, h) + Na[F[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Pa(c, 10) | 0, c = o, o = q;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Na.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Qx = Mi(() => new Zx()), Ua = BigInt(2 ** 32 - 1), wu = BigInt(32);
function ly(t, e = !1) {
  return e ? { h: Number(t & Ua), l: Number(t >> wu & Ua) } : { h: Number(t >> wu & Ua) | 0, l: Number(t & Ua) | 0 };
}
function Jx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ly(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const tS = (t, e) => BigInt(t >>> 0) << wu | BigInt(e >>> 0), eS = (t, e, n) => t >>> n, nS = (t, e, n) => t << 32 - n | e >>> n, rS = (t, e, n) => t >>> n | e << 32 - n, sS = (t, e, n) => t << 32 - n | e >>> n, iS = (t, e, n) => t << 64 - n | e >>> n - 32, oS = (t, e, n) => t >>> n - 32 | e << 64 - n, aS = (t, e) => e, cS = (t, e) => t, lS = (t, e, n) => t << n | e >>> 32 - n, uS = (t, e, n) => e << n | t >>> 32 - n, fS = (t, e, n) => e << n - 32 | t >>> 64 - n, dS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function hS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const pS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), gS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, yS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), wS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, bS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), mS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, It = {
  fromBig: ly,
  split: Jx,
  toBig: tS,
  shrSH: eS,
  shrSL: nS,
  rotrSH: rS,
  rotrSL: sS,
  rotrBH: iS,
  rotrBL: oS,
  rotr32H: aS,
  rotr32L: cS,
  rotlSH: lS,
  rotlSL: uS,
  rotlBH: fS,
  rotlBL: dS,
  add: hS,
  add3L: pS,
  add3H: gS,
  add4L: yS,
  add4H: wS,
  add5H: mS,
  add5L: bS
}, [xS, SS] = It.split([
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
let nl = class extends Mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: u, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ws[k] = e.getUint32(n), bs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = ws[k - 15] | 0, P = bs[k - 15] | 0, q = It.rotrSH(B, P, 1) ^ It.rotrSH(B, P, 8) ^ It.shrSH(B, P, 7), st = It.rotrSL(B, P, 1) ^ It.rotrSL(B, P, 8) ^ It.shrSL(B, P, 7), X = ws[k - 2] | 0, V = bs[k - 2] | 0, y = It.rotrSH(X, V, 19) ^ It.rotrBH(X, V, 61) ^ It.shrSH(X, V, 6), $ = It.rotrSL(X, V, 19) ^ It.rotrBL(X, V, 61) ^ It.shrSL(X, V, 6), M = It.add4L(st, $, bs[k - 7], bs[k - 16]), T = It.add4H(M, q, y, ws[k - 7], ws[k - 16]);
      ws[k] = T | 0, bs[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: u, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const B = It.rotrSH(u, w, 14) ^ It.rotrSH(u, w, 18) ^ It.rotrBH(u, w, 41), P = It.rotrSL(u, w, 14) ^ It.rotrSL(u, w, 18) ^ It.rotrBL(u, w, 41), q = u & g ^ ~u & v, st = w & A ^ ~w & C, X = It.add5L(F, P, st, SS[k], bs[k]), V = It.add5H(X, U, B, q, xS[k], ws[k]), y = X | 0, $ = It.rotrSH(r, s, 28) ^ It.rotrBH(r, s, 34) ^ It.rotrBH(r, s, 39), M = It.rotrSL(r, s, 28) ^ It.rotrBL(r, s, 34) ^ It.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = C | 0, v = g | 0, C = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = It.add(l | 0, h | 0, V | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = It.add3L(y, M, K);
      r = It.add3H(z, V, $, T), s = z | 0;
    }
    ({ h: r, l: s } = It.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = It.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = It.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: u, l: w } = It.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = It.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = It.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: F } = It.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, l, h, u, w, g, A, v, C, U, F);
  }
  roundClean() {
    ws.fill(0), bs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ES = class extends nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, AS = class extends nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, vS = class extends nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Mi(() => new nl());
Mi(() => new ES());
Mi(() => new AS());
Mi(() => new vS());
var Ac = { exports: {} };
Ac.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", l = "[object Error]", h = "[object Function]", u = "[object GeneratorFunction]", w = "[object Map]", g = "[object Number]", A = "[object Object]", v = "[object Promise]", C = "[object RegExp]", U = "[object Set]", F = "[object String]", k = "[object Symbol]", B = "[object WeakMap]", P = "[object ArrayBuffer]", q = "[object DataView]", st = "[object Float32Array]", X = "[object Float64Array]", V = "[object Int8Array]", y = "[object Int16Array]", $ = "[object Int32Array]", M = "[object Uint8Array]", T = "[object Uint8ClampedArray]", K = "[object Uint16Array]", z = "[object Uint32Array]", pt = /[\\^$.*+?()[\]{}|]/g, ct = /\w*$/, Ut = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, H = {};
  H[i] = H[o] = H[P] = H[q] = H[a] = H[c] = H[st] = H[X] = H[V] = H[y] = H[$] = H[w] = H[g] = H[A] = H[C] = H[U] = H[F] = H[k] = H[M] = H[T] = H[K] = H[z] = !0, H[l] = H[h] = H[B] = !1;
  var ot = typeof hn == "object" && hn && hn.Object === Object && hn, St = typeof self == "object" && self && self.Object === Object && self, Et = ot || St || Function("return this")(), yt = e && !e.nodeType && e, Le = yt && !0 && t && !t.nodeType && t, At = Le && Le.exports === yt;
  function vt(b, _) {
    return b.set(_[0], _[1]), b;
  }
  function bt(b, _) {
    return b.add(_), b;
  }
  function vn(b, _) {
    for (var R = -1, lt = b ? b.length : 0; ++R < lt && _(b[R], R, b) !== !1; )
      ;
    return b;
  }
  function qe(b, _) {
    for (var R = -1, lt = _.length, de = b.length; ++R < lt; )
      b[de + R] = _[R];
    return b;
  }
  function Bt(b, _, R, lt) {
    for (var de = -1, Ce = b ? b.length : 0; ++de < Ce; )
      R = _(R, b[de], de, b);
    return R;
  }
  function on(b, _) {
    for (var R = -1, lt = Array(b); ++R < b; )
      lt[R] = _(R);
    return lt;
  }
  function oe(b, _) {
    return b == null ? void 0 : b[_];
  }
  function Ft(b) {
    var _ = !1;
    if (b != null && typeof b.toString != "function")
      try {
        _ = !!(b + "");
      } catch {
      }
    return _;
  }
  function kn(b) {
    var _ = -1, R = Array(b.size);
    return b.forEach(function(lt, de) {
      R[++_] = [de, lt];
    }), R;
  }
  function Pe(b, _) {
    return function(R) {
      return b(_(R));
    };
  }
  function Ze(b) {
    var _ = -1, R = Array(b.size);
    return b.forEach(function(lt) {
      R[++_] = lt;
    }), R;
  }
  var Re = Array.prototype, ze = Function.prototype, Ne = Object.prototype, Zt = Et["__core-js_shared__"], Qe = function() {
    var b = /[^.]+$/.exec(Zt && Zt.keys && Zt.keys.IE_PROTO || "");
    return b ? "Symbol(src)_1." + b : "";
  }(), Oe = ze.toString, Ee = Ne.hasOwnProperty, we = Ne.toString, he = RegExp(
    "^" + Oe.call(Ee).replace(pt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), gn = At ? Et.Buffer : void 0, Xn = Et.Symbol, I = Et.Uint8Array, G = Pe(Object.getPrototypeOf, Object), O = Object.create, S = Ne.propertyIsEnumerable, Q = Re.splice, dt = Object.getOwnPropertySymbols, Qt = gn ? gn.isBuffer : void 0, ae = Pe(Object.keys, Object), Ht = x(Et, "DataView"), qt = x(Et, "Map"), Yt = x(Et, "Promise"), be = x(Et, "Set"), zt = x(Et, "WeakMap"), et = x(Object, "create"), Xt = at(Ht), ce = at(qt), Ue = at(Yt), ue = at(be), Je = at(zt), an = Xn ? Xn.prototype : void 0, Wn = an ? an.valueOf : void 0;
  function On(b) {
    var _ = -1, R = b ? b.length : 0;
    for (this.clear(); ++_ < R; ) {
      var lt = b[_];
      this.set(lt[0], lt[1]);
    }
  }
  function $n() {
    this.__data__ = et ? et(null) : {};
  }
  function Co(b) {
    return this.has(b) && delete this.__data__[b];
  }
  function In(b) {
    var _ = this.__data__;
    if (et) {
      var R = _[b];
      return R === r ? void 0 : R;
    }
    return Ee.call(_, b) ? _[b] : void 0;
  }
  function Mt(b) {
    var _ = this.__data__;
    return et ? _[b] !== void 0 : Ee.call(_, b);
  }
  function De(b, _) {
    var R = this.__data__;
    return R[b] = et && _ === void 0 ? r : _, this;
  }
  On.prototype.clear = $n, On.prototype.delete = Co, On.prototype.get = In, On.prototype.has = Mt, On.prototype.set = De;
  function Fe(b) {
    var _ = -1, R = b ? b.length : 0;
    for (this.clear(); ++_ < R; ) {
      var lt = b[_];
      this.set(lt[0], lt[1]);
    }
  }
  function zs() {
    this.__data__ = [];
  }
  function Jr(b) {
    var _ = this.__data__, R = ur(_, b);
    if (R < 0)
      return !1;
    var lt = _.length - 1;
    return R == lt ? _.pop() : Q.call(_, R, 1), !0;
  }
  function Dn(b) {
    var _ = this.__data__, R = ur(_, b);
    return R < 0 ? void 0 : _[R][1];
  }
  function Ln(b) {
    return ur(this.__data__, b) > -1;
  }
  function yn(b, _) {
    var R = this.__data__, lt = ur(R, b);
    return lt < 0 ? R.push([b, _]) : R[lt][1] = _, this;
  }
  Fe.prototype.clear = zs, Fe.prototype.delete = Jr, Fe.prototype.get = Dn, Fe.prototype.has = Ln, Fe.prototype.set = yn;
  function Fn(b) {
    var _ = -1, R = b ? b.length : 0;
    for (this.clear(); ++_ < R; ) {
      var lt = b[_];
      this.set(lt[0], lt[1]);
    }
  }
  function Ge() {
    this.__data__ = {
      hash: new On(),
      map: new (qt || Fe)(),
      string: new On()
    };
  }
  function Gs(b) {
    return m(this, b).delete(b);
  }
  function To(b) {
    return m(this, b).get(b);
  }
  function Bo(b) {
    return m(this, b).has(b);
  }
  function Mo(b, _) {
    return m(this, b).set(b, _), this;
  }
  Fn.prototype.clear = Ge, Fn.prototype.delete = Gs, Fn.prototype.get = To, Fn.prototype.has = Bo, Fn.prototype.set = Mo;
  function jn(b) {
    this.__data__ = new Fe(b);
  }
  function cn() {
    this.__data__ = new Fe();
  }
  function _o(b) {
    return this.__data__.delete(b);
  }
  function Oi(b) {
    return this.__data__.get(b);
  }
  function Di(b) {
    return this.__data__.has(b);
  }
  function Ks(b, _) {
    var R = this.__data__;
    if (R instanceof Fe) {
      var lt = R.__data__;
      if (!qt || lt.length < n - 1)
        return lt.push([b, _]), this;
      R = this.__data__ = new Fn(lt);
    }
    return R.set(b, _), this;
  }
  jn.prototype.clear = cn, jn.prototype.delete = _o, jn.prototype.get = Oi, jn.prototype.has = Di, jn.prototype.set = Ks;
  function ts(b, _) {
    var R = Gt(b) || fe(b) ? on(b.length, String) : [], lt = R.length, de = !!lt;
    for (var Ce in b)
      Ee.call(b, Ce) && !(de && (Ce == "length" || nt(Ce, lt))) && R.push(Ce);
    return R;
  }
  function Mr(b, _, R) {
    var lt = b[_];
    (!(Ee.call(b, _) && Jt(lt, R)) || R === void 0 && !(_ in b)) && (b[_] = R);
  }
  function ur(b, _) {
    for (var R = b.length; R--; )
      if (Jt(b[R][0], _))
        return R;
    return -1;
  }
  function es(b, _) {
    return b && qs(_, Rt(_), b);
  }
  function fr(b, _, R, lt, de, Ce, Qn) {
    var Ke;
    if (lt && (Ke = Ce ? lt(b, de, Ce, Qn) : lt(b)), Ke !== void 0)
      return Ke;
    if (!dr(b))
      return b;
    var Ys = Gt(b);
    if (Ys) {
      if (Ke = E(b), !_)
        return Ur(b, Ke);
    } else {
      var hr = p(b), Xs = hr == h || hr == u;
      if (Hr(b))
        return No(b, _);
      if (hr == A || hr == i || Xs && !Ce) {
        if (Ft(b))
          return Ce ? b : {};
        if (Ke = N(Xs ? {} : b), !_)
          return rs(b, es(Ke, b));
      } else {
        if (!H[hr])
          return Ce ? b : {};
        Ke = D(b, hr, fr, _);
      }
    }
    Qn || (Qn = new jn());
    var Ws = Qn.get(b);
    if (Ws)
      return Ws;
    if (Qn.set(b, Ke), !Ys)
      var ss = R ? f(b) : Rt(b);
    return vn(ss || b, function(Zs, is) {
      ss && (is = Zs, Zs = b[is]), Mr(Ke, is, fr(Zs, _, R, lt, is, b, Qn));
    }), Ke;
  }
  function Vs(b) {
    return dr(b) ? O(b) : {};
  }
  function _r(b, _, R) {
    var lt = _(b);
    return Gt(b) ? lt : qe(lt, R(b));
  }
  function Fi(b) {
    return we.call(b);
  }
  function ne(b) {
    if (!dr(b) || ut(b))
      return !1;
    var _ = bn(b) || Ft(b) ? he : Ut;
    return _.test(at(b));
  }
  function Po(b) {
    if (!J(b))
      return ae(b);
    var _ = [];
    for (var R in Object(b))
      Ee.call(b, R) && R != "constructor" && _.push(R);
    return _;
  }
  function No(b, _) {
    if (_)
      return b.slice();
    var R = new b.constructor(b.length);
    return b.copy(R), R;
  }
  function Zn(b) {
    var _ = new b.constructor(b.byteLength);
    return new I(_).set(new I(b)), _;
  }
  function Cn(b, _) {
    var R = _ ? Zn(b.buffer) : b.buffer;
    return new b.constructor(R, b.byteOffset, b.byteLength);
  }
  function Ae(b, _, R) {
    var lt = _ ? R(kn(b), !0) : kn(b);
    return Bt(lt, vt, new b.constructor());
  }
  function Pr(b) {
    var _ = new b.constructor(b.source, ct.exec(b));
    return _.lastIndex = b.lastIndex, _;
  }
  function ji(b, _, R) {
    var lt = _ ? R(Ze(b), !0) : Ze(b);
    return Bt(lt, bt, new b.constructor());
  }
  function Nr(b) {
    return Wn ? Object(Wn.call(b)) : {};
  }
  function ns(b, _) {
    var R = _ ? Zn(b.buffer) : b.buffer;
    return new b.constructor(R, b.byteOffset, b.length);
  }
  function Ur(b, _) {
    var R = -1, lt = b.length;
    for (_ || (_ = Array(lt)); ++R < lt; )
      _[R] = b[R];
    return _;
  }
  function qs(b, _, R, lt) {
    R || (R = {});
    for (var de = -1, Ce = _.length; ++de < Ce; ) {
      var Qn = _[de], Ke = void 0;
      Mr(R, Qn, Ke === void 0 ? b[Qn] : Ke);
    }
    return R;
  }
  function rs(b, _) {
    return qs(b, d(b), _);
  }
  function f(b) {
    return _r(b, Rt, d);
  }
  function m(b, _) {
    var R = b.__data__;
    return j(_) ? R[typeof _ == "string" ? "string" : "hash"] : R.map;
  }
  function x(b, _) {
    var R = oe(b, _);
    return ne(R) ? R : void 0;
  }
  var d = dt ? Pe(dt, Object) : re, p = Fi;
  (Ht && p(new Ht(new ArrayBuffer(1))) != q || qt && p(new qt()) != w || Yt && p(Yt.resolve()) != v || be && p(new be()) != U || zt && p(new zt()) != B) && (p = function(b) {
    var _ = we.call(b), R = _ == A ? b.constructor : void 0, lt = R ? at(R) : void 0;
    if (lt)
      switch (lt) {
        case Xt:
          return q;
        case ce:
          return w;
        case Ue:
          return v;
        case ue:
          return U;
        case Je:
          return B;
      }
    return _;
  });
  function E(b) {
    var _ = b.length, R = b.constructor(_);
    return _ && typeof b[0] == "string" && Ee.call(b, "index") && (R.index = b.index, R.input = b.input), R;
  }
  function N(b) {
    return typeof b.constructor == "function" && !J(b) ? Vs(G(b)) : {};
  }
  function D(b, _, R, lt) {
    var de = b.constructor;
    switch (_) {
      case P:
        return Zn(b);
      case a:
      case c:
        return new de(+b);
      case q:
        return Cn(b, lt);
      case st:
      case X:
      case V:
      case y:
      case $:
      case M:
      case T:
      case K:
      case z:
        return ns(b, lt);
      case w:
        return Ae(b, lt, R);
      case g:
      case F:
        return new de(b);
      case C:
        return Pr(b);
      case U:
        return ji(b, lt, R);
      case k:
        return Nr(b);
    }
  }
  function nt(b, _) {
    return _ = _ ?? s, !!_ && (typeof b == "number" || L.test(b)) && b > -1 && b % 1 == 0 && b < _;
  }
  function j(b) {
    var _ = typeof b;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? b !== "__proto__" : b === null;
  }
  function ut(b) {
    return !!Qe && Qe in b;
  }
  function J(b) {
    var _ = b && b.constructor, R = typeof _ == "function" && _.prototype || Ne;
    return b === R;
  }
  function at(b) {
    if (b != null) {
      try {
        return Oe.call(b);
      } catch {
      }
      try {
        return b + "";
      } catch {
      }
    }
    return "";
  }
  function ft(b) {
    return fr(b, !0, !0);
  }
  function Jt(b, _) {
    return b === _ || b !== b && _ !== _;
  }
  function fe(b) {
    return wn(b) && Ee.call(b, "callee") && (!S.call(b, "callee") || we.call(b) == i);
  }
  var Gt = Array.isArray;
  function He(b) {
    return b != null && Sa(b.length) && !bn(b);
  }
  function wn(b) {
    return mt(b) && He(b);
  }
  var Hr = Qt || mn;
  function bn(b) {
    var _ = dr(b) ? we.call(b) : "";
    return _ == h || _ == u;
  }
  function Sa(b) {
    return typeof b == "number" && b > -1 && b % 1 == 0 && b <= s;
  }
  function dr(b) {
    var _ = typeof b;
    return !!b && (_ == "object" || _ == "function");
  }
  function mt(b) {
    return !!b && typeof b == "object";
  }
  function Rt(b) {
    return He(b) ? ts(b) : Po(b);
  }
  function re() {
    return [];
  }
  function mn() {
    return !1;
  }
  t.exports = ft;
})(Ac, Ac.exports);
var kS = Ac.exports;
const uy = /* @__PURE__ */ Up(kS);
var bu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(bu || (bu = {}));
function $S(t, e) {
  return { type: bu.Address, version: t, hash160: e };
}
function IS(t) {
  return _i.c32address(t.version, t.hash160);
}
const LS = (t) => Qx(ny(t)), CS = (t) => gt(LS(t));
Ie.hmacSha256Sync = (t, ...e) => {
  const n = ty.create(ny, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function TS(t, e = "mainnet") {
  e = Wg(e), t = typeof t == "string" ? jt(t) : t;
  const n = Gx(zr.P2PKH, e), r = $S(n, CS(t));
  return IS(r);
}
function BS(t, e) {
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
  const s = r.issuer.publicKey, i = TS(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new We.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function MS(t, e = null) {
  let n;
  e ? n = BS(t, e) : n = We.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const jh = "_blockstackDidCheckEchoReply", _S = "echoReply", PS = "authContinuation";
function NS(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function US() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[jh];
  if (typeof e == "boolean")
    return e;
  const n = NS(t.location.search), r = n[_S];
  if (r) {
    t[jh] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[PS];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class mu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Kp();
    else
      throw new em("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Eh(e.sessionOptions) : this.store = new Eh() : e ? this.store = new Sh(e.sessionOptions) : this.store = new Sh();
  }
  makeAuthRequestToken(e, n, r, s, i, o = rm().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new iu("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Sx(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = xx();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (US())
        return Wi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Wi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = $m()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new va("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = We.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await $x(e))
      throw new va("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Al(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await mh(s, i.private_key);
          } catch {
            if (Wi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ie.isValidPrivateKey(i.private_key))
              throw new va("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await mh(s, c);
          } catch {
            Wi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new va("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let l = gm, h;
    Al(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (l = i.hubUrl), Al(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const u = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: qg(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: l,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, w = i.profile_url;
    if (!u.profile && w) {
      const g = await n(w);
      if (!g.ok)
        u.profile = Object.assign({}, Qb);
      else {
        const A = await g.text(), v = JSON.parse(A);
        u.profile = MS(v[0].token);
      }
    } else
      u.profile = i.profile;
    return r.userData = u, this.store.setSessionData(r), u;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new iu("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), g2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), y2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
mu.prototype.makeAuthRequest = mu.prototype.makeAuthRequestToken;
const HS = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], OS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = HS(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!rl(r.id));
  return e.concat(n);
}, rl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), fy = "STX_PROVIDER", wi = () => typeof window > "u" ? null : window.localStorage.getItem(fy), DS = (t) => {
  typeof window < "u" && window.localStorage.setItem(fy, t);
}, FS = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function jS(t, e) {
  const n = {};
  return Object.assign(n, FS, e), await fetch(t, n);
}
function RS(t) {
  let e = jS, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function zS(...t) {
  const { fetchLib: e, middlewares: n } = RS(t);
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
var po;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(po || (po = {}));
var bi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bi || (bi = {}));
var Rh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Rh || (Rh = {}));
const GS = "https://api.mainnet.hiro.so", KS = "https://api.testnet.hiro.so", VS = "http://localhost:3999", qS = ["mainnet", "testnet", "devnet", "mocknet"];
class mi {
  constructor(e) {
    this.version = bi.Mainnet, this.chainId = po.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === bi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? zS();
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
mi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new xu();
    case "testnet":
      return new Su();
    case "devnet":
      return new YS();
    case "mocknet":
      return new dy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${qS.join(", ")}`);
  }
};
mi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : mi.fromName(t);
class xu extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? GS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bi.Mainnet, this.chainId = po.Mainnet;
  }
}
class Su extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? KS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bi.Testnet, this.chainId = po.Testnet;
  }
}
class dy extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? VS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bi.Testnet, this.chainId = po.Testnet;
  }
}
const YS = dy;
var xi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(xi || (xi = {}));
var vc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vc || (vc = {}));
xi.Mainnet;
var Si;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Si || (Si = {}));
var Ei;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ei || (Ei = {}));
Si.Mainnet;
const XS = {
  chainId: xi.Mainnet,
  transactionVersion: Si.Mainnet,
  peerNetworkId: vc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ei.MainnetSingleSig,
    multiSig: Ei.MainnetMultiSig
  },
  client: { baseUrl: Rp }
}, Eu = {
  chainId: xi.Testnet,
  transactionVersion: Si.Testnet,
  peerNetworkId: vc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ei.TestnetSingleSig,
    multiSig: Ei.TestnetMultiSig
  },
  client: { baseUrl: zp }
}, oc = {
  ...Eu,
  addressVersion: { ...Eu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Gp }
}, WS = {
  ...oc,
  addressVersion: { ...oc.addressVersion },
  client: { ...oc.client }
};
function ZS(t) {
  switch (t) {
    case "mainnet":
      return XS;
    case "testnet":
      return Eu;
    case "devnet":
      return oc;
    case "mocknet":
      return WS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function QS(t) {
  return typeof t == "string" ? ZS(t) : t;
}
function JS(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const zh = /* @__PURE__ */ new Map();
function hy(t, e) {
  const n = zh.get(t);
  if (n !== void 0)
    return n(e);
  const r = JS(t);
  return zh.set(t, r), hy(t, e);
}
let le = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? jt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Em(this.readBytes(4), 0);
  }
  readUInt8() {
    return xm(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return bm(this.readBytes(2), 0);
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
    if (hy(e, r))
      return r;
    throw n(r);
  }
};
const t3 = 128, e3 = 128, py = 16, ci = 32, Au = 80, sl = 65, n3 = 32, r3 = 64, kc = 34, s3 = 1 + 16 * 1024 * 1024, i3 = 165, o3 = 16, a3 = 16, c3 = 20, l3 = a3 + 2 + c3, u3 = l3 + 4, f3 = s3 + (i3 + o3 * u3);
var Wt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Wt || (Wt = {}));
var vu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(vu || (vu = {}));
var Bn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Bn || (Bn = {}));
const Tl = ["onChainOnly", "offChainOnly", "any"];
Tl[0] + "", Bn.OnChainOnly, Tl[1] + "", Bn.OffChainOnly, Tl[2] + "", Bn.Any, Bn.OnChainOnly + "", Bn.OnChainOnly, Bn.OffChainOnly + "", Bn.OffChainOnly, Bn.Any + "", Bn.Any;
var $c;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})($c || ($c = {}));
var pe;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(pe || (pe = {}));
var ke;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ke || (ke = {}));
var se;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(se || (se = {}));
var xe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xe || (xe = {}));
var Wo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Wo || (Wo = {}));
var ku;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(ku || (ku = {}));
var $u;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})($u || ($u = {}));
var dn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(dn || (dn = {}));
var Gh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gh || (Gh = {}));
var Iu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Iu || (Iu = {}));
var sr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sr || (sr = {}));
var Kh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Kh || (Kh = {}));
let il = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Zi = class extends il {
  constructor(e) {
    super(e);
  }
}, un = class extends il {
  constructor(e) {
    super(e);
  }
}, Ic = class extends il {
  constructor(e) {
    super(e);
  }
}, si = class extends il {
  constructor(e) {
    super(e);
  }
};
function Lu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function d3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function h3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Lu(t.outputLen), Lu(t.blockLen);
}
function p3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function g3(t, e) {
  gy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ii = {
  number: Lu,
  bool: d3,
  bytes: gy,
  hash: h3,
  exists: p3,
  output: g3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Bl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), yr = (t, e) => t << 32 - e | t >>> e, y3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!y3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function w3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Uf(t) {
  if (typeof t == "string" && (t = w3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let yy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Pi(t) {
  const e = (r) => t().update(Uf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let wy = class extends yy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ii.hash(e);
    const r = Uf(n);
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
    return ii.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ii.exists(this), ii.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const by = (t, e, n) => new wy(t, e).update(n).digest();
by.create = (t, e) => new wy(t, e);
function b3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let Hf = class extends yy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Bl(this.buffer);
  }
  update(e) {
    ii.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Uf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Bl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ii.exists(this), ii.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    b3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Bl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, h[u], i);
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
const m3 = (t, e, n) => t & e ^ ~t & n, x3 = (t, e, n) => t & e ^ t & n ^ e & n, S3 = new Uint32Array([
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
let my = class extends Hf {
  constructor() {
    super(64, 32, 8, !1), this.A = ms[0] | 0, this.B = ms[1] | 0, this.C = ms[2] | 0, this.D = ms[3] | 0, this.E = ms[4] | 0, this.F = ms[5] | 0, this.G = ms[6] | 0, this.H = ms[7] | 0;
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
      xs[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = xs[u - 15], g = xs[u - 2], A = yr(w, 7) ^ yr(w, 18) ^ w >>> 3, v = yr(g, 17) ^ yr(g, 19) ^ g >>> 10;
      xs[u] = v + xs[u - 7] + A + xs[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = yr(a, 6) ^ yr(a, 11) ^ yr(a, 25), g = h + w + m3(a, c, l) + S3[u] + xs[u] | 0, v = (yr(r, 2) ^ yr(r, 13) ^ yr(r, 22)) + x3(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    xs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, E3 = class extends my {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Of = Pi(() => new my());
Pi(() => new E3());
const A3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), xy = Uint8Array.from({ length: 16 }, (t, e) => e), v3 = xy.map((t) => (9 * t + 5) % 16);
let Df = [xy], Ff = [v3];
for (let t = 0; t < 4; t++)
  for (let e of [Df, Ff])
    e.push(e[t].map((n) => A3[n]));
const Sy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), k3 = Df.map((t, e) => t.map((n) => Sy[e][n])), $3 = Ff.map((t, e) => t.map((n) => Sy[e][n])), I3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), L3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ha = (t, e) => t << e | t >>> 32 - e;
function Vh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Oa = new Uint32Array(16);
let C3 = class extends Hf {
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
    for (let g = 0; g < 16; g++, n += 4)
      Oa[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = I3[g], C = L3[g], U = Df[g], F = Ff[g], k = k3[g], B = $3[g];
      for (let P = 0; P < 16; P++) {
        const q = Ha(r + Vh(g, i, a, l) + Oa[U[P]] + v, k[P]) + u | 0;
        r = u, u = l, l = Ha(a, 10) | 0, a = i, i = q;
      }
      for (let P = 0; P < 16; P++) {
        const q = Ha(s + Vh(A, o, c, h) + Oa[F[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Ha(c, 10) | 0, c = o, o = q;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Oa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const T3 = Pi(() => new C3()), Da = BigInt(2 ** 32 - 1), Cu = BigInt(32);
function Ey(t, e = !1) {
  return e ? { h: Number(t & Da), l: Number(t >> Cu & Da) } : { h: Number(t >> Cu & Da) | 0, l: Number(t & Da) | 0 };
}
function B3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ey(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const M3 = (t, e) => BigInt(t >>> 0) << Cu | BigInt(e >>> 0), _3 = (t, e, n) => t >>> n, P3 = (t, e, n) => t << 32 - n | e >>> n, N3 = (t, e, n) => t >>> n | e << 32 - n, U3 = (t, e, n) => t << 32 - n | e >>> n, H3 = (t, e, n) => t << 64 - n | e >>> n - 32, O3 = (t, e, n) => t >>> n - 32 | e << 64 - n, D3 = (t, e) => e, F3 = (t, e) => t, j3 = (t, e, n) => t << n | e >>> 32 - n, R3 = (t, e, n) => e << n | t >>> 32 - n, z3 = (t, e, n) => e << n - 32 | t >>> 64 - n, G3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function K3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const V3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), q3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Y3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), X3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, W3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Z3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Lt = {
  fromBig: Ey,
  split: B3,
  toBig: M3,
  shrSH: _3,
  shrSL: P3,
  rotrSH: N3,
  rotrSL: U3,
  rotrBH: H3,
  rotrBL: O3,
  rotr32H: D3,
  rotr32L: F3,
  rotlSH: j3,
  rotlSL: R3,
  rotlBH: z3,
  rotlBL: G3,
  add: K3,
  add3L: V3,
  add3H: q3,
  add4L: Y3,
  add4H: X3,
  add5H: Z3,
  add5L: W3
}, [Q3, J3] = Lt.split([
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
let ol = class extends Hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: u, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Ss[k] = e.getUint32(n), Es[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = Ss[k - 15] | 0, P = Es[k - 15] | 0, q = Lt.rotrSH(B, P, 1) ^ Lt.rotrSH(B, P, 8) ^ Lt.shrSH(B, P, 7), st = Lt.rotrSL(B, P, 1) ^ Lt.rotrSL(B, P, 8) ^ Lt.shrSL(B, P, 7), X = Ss[k - 2] | 0, V = Es[k - 2] | 0, y = Lt.rotrSH(X, V, 19) ^ Lt.rotrBH(X, V, 61) ^ Lt.shrSH(X, V, 6), $ = Lt.rotrSL(X, V, 19) ^ Lt.rotrBL(X, V, 61) ^ Lt.shrSL(X, V, 6), M = Lt.add4L(st, $, Es[k - 7], Es[k - 16]), T = Lt.add4H(M, q, y, Ss[k - 7], Ss[k - 16]);
      Ss[k] = T | 0, Es[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: u, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const B = Lt.rotrSH(u, w, 14) ^ Lt.rotrSH(u, w, 18) ^ Lt.rotrBH(u, w, 41), P = Lt.rotrSL(u, w, 14) ^ Lt.rotrSL(u, w, 18) ^ Lt.rotrBL(u, w, 41), q = u & g ^ ~u & v, st = w & A ^ ~w & C, X = Lt.add5L(F, P, st, J3[k], Es[k]), V = Lt.add5H(X, U, B, q, Q3[k], Ss[k]), y = X | 0, $ = Lt.rotrSH(r, s, 28) ^ Lt.rotrBH(r, s, 34) ^ Lt.rotrBH(r, s, 39), M = Lt.rotrSL(r, s, 28) ^ Lt.rotrBL(r, s, 34) ^ Lt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = C | 0, v = g | 0, C = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = Lt.add(l | 0, h | 0, V | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Lt.add3L(y, M, K);
      r = Lt.add3H(z, V, $, T), s = z | 0;
    }
    ({ h: r, l: s } = Lt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Lt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = Lt.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: u, l: w } = Lt.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = Lt.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = Lt.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: F } = Lt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, l, h, u, w, g, A, v, C, U, F);
  }
  roundClean() {
    Ss.fill(0), Es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, tE = class extends ol {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, eE = class extends ol {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, nE = class extends ol {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Pi(() => new ol());
Pi(() => new tE());
const rE = Pi(() => new eE());
Pi(() => new nE());
var Ot;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ot || (Ot = {}));
var je;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(je || (je = {}));
function jf(t) {
  return je[t];
}
const sE = () => ({ type: Ot.BoolTrue }), iE = () => ({ type: Ot.BoolFalse }), oE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ot.Buffer, value: gt(t) };
}, qh = BigInt("0xffffffffffffffffffffffffffffffff"), aE = BigInt(0), Yh = BigInt("0x7fffffffffffffffffffffffffffffff"), Xh = BigInt("-170141183460469231731687303715884105728"), cE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = au(jt(t))), An(t, Uint8Array) && (t = au(t));
  const e = sn(t);
  if (e > Yh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Yh}`);
  if (e < Xh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Xh}`);
  return { type: Ot.Int, value: e };
}, lE = (t) => {
  const e = sn(t);
  if (e < aE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qh}`);
  return { type: Ot.UInt, value: e };
};
function uE(t) {
  return { type: Ot.List, value: t };
}
function Ay() {
  return { type: Ot.OptionalNone };
}
function vy(t) {
  return { type: Ot.OptionalSome, value: t };
}
var it;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(it || (it = {}));
function fE() {
  return {
    type: it.Address,
    version: Ei.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Wh(t) {
  if (t && _y(t, kc))
    throw new Error(`Memo exceeds maximum length of ${kc} bytes`);
  return { type: it.MemoString, content: t };
}
function Rf(t, e) {
  return {
    type: it.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Tu(t) {
  if (jt(t).byteLength != sl)
    throw Error("Invalid signature");
  return {
    type: it.MessageSignature,
    data: t
  };
}
function dE(t, e, n) {
  return typeof t == "string" && (t = LE(t)), typeof n == "string" && (n = Wh(n)), {
    type: it.Payload,
    payloadType: Wt.TokenTransfer,
    recipient: t,
    amount: sn(e),
    memo: n ?? Wh("")
  };
}
function hE(t, e, n, r) {
  return typeof e == "string" && (e = ar(e)), typeof n == "string" && (n = ar(n)), {
    type: it.Payload,
    payloadType: Wt.ContractCall,
    contractAddress: typeof t == "string" ? Rs(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function pE(t) {
  return ar(t, 4, 1e5);
}
function Zh(t, e, n) {
  return typeof t == "string" && (t = ar(t)), typeof e == "string" && (e = pE(e)), typeof n == "number" ? {
    type: it.Payload,
    payloadType: Wt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: it.Payload,
    payloadType: Wt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function gE() {
  return { type: it.Payload, payloadType: Wt.PoisonMicroblock };
}
function Qh(t, e) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  return e != null ? {
    type: it.Payload,
    payloadType: Wt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: it.Payload,
    payloadType: Wt.Coinbase,
    coinbaseBytes: t
  };
}
function yE(t, e, n) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  if (n.byteLength != Au)
    throw Error(`VRF proof buffer size must be ${Au} bytes`);
  return {
    type: it.Payload,
    payloadType: Wt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ot.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function wE(t, e, n, r, s, i, o) {
  return {
    type: it.Payload,
    payloadType: Wt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function ar(t, e, n) {
  const r = e || 1, s = n || t3;
  if (_y(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: it.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function bE(t, e, n) {
  return {
    type: it.Asset,
    address: Rs(t),
    contractName: ar(e),
    assetName: ar(n)
  };
}
function Rs(t) {
  const e = _i.c32addressDecode(t);
  return {
    type: it.Address,
    version: e[0],
    hash160: e[1]
  };
}
function mE(t, e) {
  const n = Rs(t), r = ar(e);
  return {
    type: it.Principal,
    prefix: dn.Contract,
    address: n,
    contractName: r
  };
}
function xE(t) {
  const e = Rs(t);
  return {
    type: it.Principal,
    prefix: dn.Standard,
    address: e
  };
}
function Qi(t, e) {
  return {
    pubKeyEncoding: t,
    type: it.TransactionAuthField,
    contents: e
  };
}
function Fr(t) {
  switch (t.type) {
    case it.Address:
      return ba(t);
    case it.Principal:
      return ky(t);
    case it.LengthPrefixedString:
      return yo(t);
    case it.MemoString:
      return EE(t);
    case it.Asset:
      return Iy(t);
    case it.PostCondition:
      return Cy(t);
    case it.PublicKey:
      return _u(t);
    case it.LengthPrefixedList:
      return zf(t);
    case it.Payload:
      return Ty(t);
    case it.TransactionAuthField:
      return IE(t);
    case it.MessageSignature:
      return Gf(t);
  }
}
function ba(t) {
  const e = [];
  return e.push(jt(da(t.version, 1))), e.push(jt(t.hash160)), Me(e);
}
function go(t) {
  const e = An(t, le) ? t : new le(t), n = Kc(gt(e.readBytes(1))), r = gt(e.readBytes(20));
  return { type: it.Address, version: n, hash160: r };
}
function ky(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === dn.Standard || t.prefix === dn.Contract) && e.push(ba(t.address)), t.prefix === dn.Contract && e.push(yo(t.contractName)), Me(e);
}
function SE(t) {
  const e = An(t, le) ? t : new le(t), n = e.readUInt8Enum(dn, (i) => {
    throw new un(`Unexpected Principal payload type: ${i}`);
  });
  if (n === dn.Origin)
    return { type: it.Principal, prefix: n };
  const r = go(e);
  if (n === dn.Standard)
    return { type: it.Principal, prefix: n, address: r };
  const s = Vn(e);
  return {
    type: it.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function yo(t) {
  const e = [], n = Ci(t.content), r = n.byteLength;
  return e.push(jt(da(r, t.lengthPrefixBytes))), e.push(n), Me(e);
}
function Vn(t, e, n) {
  e = e || 1;
  const r = An(t, le) ? t : new le(t), s = Kc(gt(r.readBytes(e))), i = ha(r.readBytes(s));
  return ar(i, e, n ?? 128);
}
function EE(t) {
  const e = [], n = Ci(t.content), r = WE(gt(n), kc * 2);
  return e.push(jt(r)), Me(e);
}
function $y(t) {
  const e = An(t, le) ? t : new le(t);
  let n = ha(e.readBytes(kc));
  return n = n.replace(/\u0000*$/, ""), { type: it.MemoString, content: n };
}
function Iy(t) {
  const e = [];
  return e.push(ba(t.address)), e.push(yo(t.contractName)), e.push(yo(t.assetName)), Me(e);
}
function Bu(t) {
  const e = An(t, le) ? t : new le(t);
  return {
    type: it.Asset,
    address: go(e),
    contractName: Vn(e),
    assetName: Vn(e)
  };
}
function zf(t) {
  const e = t.values, n = [];
  n.push(jt(da(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Fr(r));
  return Me(n);
}
function Ly(t, e, n) {
  const r = An(t, le) ? t : new le(t), s = Kc(gt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case it.Address:
        i.push(go(r));
        break;
      case it.LengthPrefixedString:
        i.push(Vn(r));
        break;
      case it.MemoString:
        i.push($y(r));
        break;
      case it.Asset:
        i.push(Bu(r));
        break;
      case it.PostCondition:
        i.push(vE(r));
        break;
      case it.PublicKey:
        i.push(Pu(r));
        break;
      case it.TransactionAuthField:
        i.push($E(r));
        break;
    }
  return Rf(i, n);
}
function AE(t) {
  return gt(Cy(t));
}
function Cy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ky(t.principal)), (t.conditionType === pe.Fungible || t.conditionType === pe.NonFungible) && e.push(Iy(t.asset)), t.conditionType === pe.NonFungible && e.push(vr(t.assetName)), e.push(t.conditionCode), t.conditionType === pe.STX || t.conditionType === pe.Fungible || t.conditionType === pe.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Zi("The post-condition amount may not be larger than 8 bytes");
    e.push(Fs(t.amount, 8));
  }
  return Me(e);
}
function vE(t) {
  const e = An(t, le) ? t : new le(t), n = e.readUInt8Enum(pe, (a) => {
    throw new un(`Could not read ${a} as PostConditionType`);
  }), r = SE(e);
  let s, i, o;
  switch (n) {
    case pe.STX:
      return s = e.readUInt8Enum(Wo, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${gt(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: pe.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case pe.Fungible:
      return i = Bu(e), s = e.readUInt8Enum(Wo, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${gt(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: pe.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case pe.NonFungible:
      i = Bu(e);
      const a = Sr(e);
      return s = e.readUInt8Enum(ku, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: it.PostCondition,
        conditionType: pe.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case pe.Staking:
      return s = e.readUInt8Enum(Wo, (c) => {
        throw new un(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${gt(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: pe.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case pe.PoX: {
      const c = e.readUInt8Enum($u, (l) => {
        throw new un(`Could not read ${l} as PoxConditionCode`);
      });
      return {
        type: it.PostCondition,
        conditionType: pe.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Ty(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Wt.TokenTransfer:
      e.push(vr(t.recipient)), e.push(Fs(t.amount, 8)), e.push(Fr(t.memo));
      break;
    case Wt.ContractCall:
      e.push(Fr(t.contractAddress)), e.push(Fr(t.contractName)), e.push(Fr(t.functionName));
      const n = new Uint8Array(4);
      di(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(vr(r));
      });
      break;
    case Wt.SmartContract:
      e.push(Fr(t.contractName)), e.push(Fr(t.codeBody));
      break;
    case Wt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Fr(t.contractName)), e.push(Fr(t.codeBody));
      break;
    case Wt.PoisonMicroblock:
      break;
    case Wt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Wt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(vr(t.recipient));
      break;
    case Wt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(vr(t.recipient ? vy(t.recipient) : Ay())), e.push(t.vrfProof);
      break;
    case Wt.TenureChange:
      e.push(jt(t.tenureHash)), e.push(jt(t.previousTenureHash)), e.push(jt(t.burnViewHash)), e.push(jt(t.previousTenureEnd)), e.push(di(new Uint8Array(4), t.previousTenureBlocks)), e.push(Sm(new Uint8Array(1), t.cause)), e.push(jt(t.publicKeyHash));
      break;
  }
  return Me(e);
}
function kE(t) {
  const e = An(t, le) ? t : new le(t);
  switch (e.readUInt8Enum(Wt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Wt.TokenTransfer:
      const r = Sr(e), s = sn(e.readBytes(8)), i = $y(e);
      return dE(r, s, i);
    case Wt.ContractCall:
      const o = go(e), a = Vn(e), c = Vn(e), l = [], h = e.readUInt32BE();
      for (let B = 0; B < h; B++) {
        const P = Sr(e);
        l.push(P);
      }
      return hE(o, a, c, l);
    case Wt.SmartContract:
      const u = Vn(e), w = Vn(e, 4, 1e5);
      return Zh(u, w);
    case Wt.VersionedSmartContract: {
      const B = e.readUInt8Enum(vu, (st) => {
        throw new Error(`Cannot recognize ClarityVersion: ${st}`);
      }), P = Vn(e), q = Vn(e, 4, f3);
      return Zh(P, q, B);
    }
    case Wt.PoisonMicroblock:
      return gE();
    case Wt.Coinbase: {
      const B = e.readBytes(ci);
      return Qh(B);
    }
    case Wt.CoinbaseToAltRecipient: {
      const B = e.readBytes(ci), P = Sr(e);
      return Qh(B, P);
    }
    case Wt.NakamotoCoinbase: {
      const B = e.readBytes(ci), P = Sr(e), q = e.readBytes(Au);
      return yE(B, P, q);
    }
    case Wt.TenureChange:
      const g = gt(e.readBytes(20)), A = gt(e.readBytes(20)), v = gt(e.readBytes(20)), C = gt(e.readBytes(32)), U = e.readUInt32BE(), F = e.readUInt8Enum(Iu, (B) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${B}`);
      }), k = gt(e.readBytes(20));
      return wE(g, A, v, C, U, F, k);
  }
}
function Mu(t) {
  const e = An(t, le) ? t : new le(t);
  return Tu(gt(e.readBytes(sl)));
}
function $E(t) {
  const e = An(t, le) ? t : new le(t), n = e.readUInt8Enum(sr, (r) => {
    throw new un(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case sr.PublicKeyCompressed:
      return Qi(xe.Compressed, Pu(e));
    case sr.PublicKeyUncompressed:
      return Qi(xe.Uncompressed, vo(a4(Pu(e).data)));
    case sr.SignatureCompressed:
      return Qi(xe.Compressed, Mu(e));
    case sr.SignatureUncompressed:
      return Qi(xe.Uncompressed, Mu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Gf(t) {
  return jt(t.data);
}
function IE(t) {
  const e = [];
  switch (t.contents.type) {
    case it.PublicKey:
      e.push(t.pubKeyEncoding === xe.Compressed ? sr.PublicKeyCompressed : sr.PublicKeyUncompressed), e.push(jt(o4(t.contents.data)));
      break;
    case it.MessageSignature:
      e.push(t.pubKeyEncoding === xe.Compressed ? sr.SignatureCompressed : sr.SignatureUncompressed), e.push(Gf(t.contents));
      break;
  }
  return Me(e);
}
function _u(t) {
  return t.data.slice();
}
function Pu(t) {
  const e = An(t, le) ? t : new le(t), n = e.readUInt8(), r = n === 4 ? r3 : n3;
  return vo(Me([n, e.readBytes(r)]));
}
function Kf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === se.P2PKH || e === se.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === se.P2WPKH || e === se.P2WSH || e === se.P2WSHNonSequential) && !r.map((s) => s.data).every(ko))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case se.P2PKH:
      return Fa(t, ZE(r[0].data));
    case se.P2WPKH:
      return Fa(t, QE(r[0].data));
    case se.P2SH:
    case se.P2SHNonSequential:
      return Fa(t, JE(n, r.map(_u)));
    case se.P2WSH:
    case se.P2WSHNonSequential:
      return Fa(t, t4(n, r.map(_u)));
  }
}
function Fa(t, e) {
  return { type: it.Address, version: t, hash160: e };
}
function Vf(t) {
  return _i.c32address(t.version, t.hash160);
}
function Jh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return bE(e, n, r);
}
function Do(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return mE(e, n);
  } else
    return xE(t);
}
function LE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return BE(e, n);
  } else
    return CE(t);
}
function CE(t) {
  const e = Rs(t);
  return { type: Ot.PrincipalStandard, value: Vf(e) };
}
function TE(t) {
  return { type: Ot.PrincipalStandard, value: Vf(t) };
}
function BE(t, e) {
  const n = Rs(t), r = ar(e);
  return By(n, r);
}
function By(t, e) {
  if (Ci(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ot.PrincipalContract,
    value: `${Vf(t)}.${e.content}`
  };
}
function ME(t) {
  return { type: Ot.ResponseErr, value: t };
}
function _E(t) {
  return { type: Ot.ResponseOk, value: t };
}
const PE = (t) => ({ type: Ot.StringASCII, value: t }), NE = (t) => ({ type: Ot.StringUTF8, value: t });
function UE(t) {
  for (const e in t)
    if (!e4(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ot.Tuple, value: t };
}
function Sr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new le(jt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new le(t) : e = t;
  switch (e.readUInt8Enum(je, (r) => {
    throw new un(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case je.int:
      return cE(au(e.readBytes(16)));
    case je.uint:
      return lE(e.readBytes(16));
    case je.buffer:
      const r = e.readUInt32BE();
      return oE(e.readBytes(r));
    case je.true:
      return sE();
    case je.false:
      return iE();
    case je.address:
      const s = go(e);
      return TE(s);
    case je.contract:
      const i = go(e), o = Vn(e);
      return By(i, o);
    case je.ok:
      return _E(Sr(e));
    case je.err:
      return ME(Sr(e));
    case je.none:
      return Ay();
    case je.some:
      return vy(Sr(e));
    case je.list:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Sr(e));
      return uE(c);
    case je.tuple:
      const l = e.readUInt32BE(), h = {};
      for (let v = 0; v < l; v++) {
        const C = Vn(e).content;
        if (C === void 0)
          throw new un('"content" is undefined');
        h[C] = Sr(e);
      }
      return UE(h);
    case je.ascii:
      const u = e.readUInt32BE(), w = hm(e.readBytes(u));
      return PE(w);
    case je.utf8:
      const g = e.readUInt32BE(), A = ha(e.readBytes(g));
      return NE(A);
    default:
      throw new un("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Cr(t, e) {
  return Me([jf(t), e]);
}
function HE(t) {
  return new Uint8Array([jf(t.type)]);
}
function OE(t) {
  return t.type === Ot.OptionalNone ? new Uint8Array([jf(t.type)]) : Cr(t.type, vr(t.value));
}
function DE(t) {
  const e = new Uint8Array(4);
  return di(e, Math.ceil(t.value.length / 2), 0), Cr(t.type, Ir(e, jt(t.value)));
}
function FE(t) {
  const e = yf(cm(BigInt(t.value), BigInt(e3)), py);
  return Cr(t.type, e);
}
function jE(t) {
  const e = yf(BigInt(t.value), py);
  return Cr(t.type, e);
}
function RE(t) {
  return Cr(t.type, ba(Rs(t.value)));
}
function zE(t) {
  const [e, n] = n4(t.value);
  return Cr(t.type, Ir(ba(Rs(e)), yo(ar(n))));
}
function GE(t) {
  return Cr(t.type, vr(t.value));
}
function KE(t) {
  const e = [], n = new Uint8Array(4);
  di(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = vr(r);
    e.push(s);
  }
  return Cr(t.type, Me(e));
}
function VE(t) {
  const e = [], n = new Uint8Array(4);
  di(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ar(s);
    e.push(yo(i));
    const o = vr(t.value[s]);
    e.push(o);
  }
  return Cr(t.type, Me(e));
}
function My(t, e) {
  const n = [], r = e == "ascii" ? dm(t.value) : Ci(t.value), s = new Uint8Array(4);
  return di(s, r.length, 0), n.push(s), n.push(r), Cr(t.type, Me(n));
}
function qE(t) {
  return My(t, "ascii");
}
function YE(t) {
  return My(t, "utf8");
}
function t0(t) {
  return gt(vr(t));
}
function vr(t) {
  switch (t.type) {
    case Ot.BoolTrue:
    case Ot.BoolFalse:
      return HE(t);
    case Ot.OptionalNone:
    case Ot.OptionalSome:
      return OE(t);
    case Ot.Buffer:
      return DE(t);
    case Ot.UInt:
      return jE(t);
    case Ot.Int:
      return FE(t);
    case Ot.PrincipalStandard:
      return RE(t);
    case Ot.PrincipalContract:
      return zE(t);
    case Ot.ResponseOk:
    case Ot.ResponseErr:
      return GE(t);
    case Ot.List:
      return KE(t);
    case Ot.Tuple:
      return VE(t);
    case Ot.StringASCII:
      return qE(t);
    case Ot.StringUTF8:
      return YE(t);
    default:
      throw new Zi("Unable to serialize. Invalid Clarity Value.");
  }
}
const XE = (t) => t.length % 2 ? `0${t}` : t, WE = (t, e) => t.padEnd(e, "0"), _y = (t, e) => t ? Ci(t).length > e : !1;
function Nu(t) {
  return uy(t);
}
const na = (t) => T3(Of(t)), qf = (t) => gt(rE(t)), ZE = (t) => gt(na(t)), QE = (t) => {
  const e = na(t), n = Ir(new Uint8Array([0]), new Uint8Array([e.length]), e), r = na(n);
  return gt(r);
}, JE = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Me(n), s = na(r);
  return gt(s);
}, t4 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Me(n), s = Of(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Me(i), a = na(o);
  return gt(a);
};
function e4(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function n4(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Ie.hmacSha256Sync = (t, ...e) => {
  const n = by.create(Of, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function vo(t) {
  return t = typeof t == "string" ? jt(t) : t, {
    type: it.PublicKey,
    data: t
  };
}
function r4(t, e, n = xe.Compressed) {
  const r = wm(e), s = new Nn(th(r.r), th(r.s)), i = Pt.fromSignature(t, s, r.recoveryId), o = n === xe.Compressed;
  return i.toHex(o);
}
function s4(t) {
  return typeof t == "string" ? t : gt(t);
}
const Yf = s4;
function Py(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ym;
}
function ko(t) {
  return !Yf(t).startsWith("04");
}
function i4(t) {
  t = wf(t);
  const e = Py(t);
  return gt(pa(t.slice(0, 32), e));
}
function o4(t) {
  return Pt.fromHex(Yf(t)).toHex(!0);
}
function a4(t) {
  return Pt.fromHex(Yf(t)).toHex(!1);
}
function c4(t, e) {
  t = wf(t);
  const [n, r] = qc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return da(r, 1) + Nn.fromHex(n).toCompactHex();
}
function Xf() {
  return {
    type: it.MessageSignature,
    data: gt(new Uint8Array(sl))
  };
}
function Ny(t, e, n, r) {
  const s = Kf(0, t, 1, [vo(e)]).hash160, i = ko(e) ? xe.Compressed : xe.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: sn(n),
    fee: sn(r),
    keyEncoding: i,
    signature: Xf()
  };
}
function ra(t) {
  return "signature" in t;
}
function e0(t) {
  return t === se.P2SH || t === se.P2WSH;
}
function l4(t) {
  return t === se.P2SHNonSequential || t === se.P2WSHNonSequential;
}
function n0(t) {
  const e = Nu(t);
  return e.nonce = 0, e.fee = 0, ra(e) ? e.signature = Xf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function u4(t) {
  const e = [
    t.hashMode,
    jt(t.signer),
    Fs(t.nonce, 8),
    Fs(t.fee, 8),
    t.keyEncoding,
    Gf(t.signature)
  ];
  return Me(e);
}
function f4(t) {
  const e = [
    t.hashMode,
    jt(t.signer),
    Fs(t.nonce, 8),
    Fs(t.fee, 8)
  ], n = Rf(t.fields);
  e.push(zf(n));
  const r = new Uint8Array(2);
  return mm(r, t.signaturesRequired, 0), e.push(r), Me(e);
}
function d4(t, e) {
  const n = gt(e.readBytes(20)), r = BigInt(`0x${gt(e.readBytes(8))}`), s = BigInt(`0x${gt(e.readBytes(8))}`), i = e.readUInt8Enum(xe, (a) => {
    throw new un(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === se.P2WPKH && i != xe.Compressed)
    throw new un("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Mu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function h4(t, e) {
  const n = gt(e.readBytes(20)), r = BigInt("0x" + gt(e.readBytes(8))), s = BigInt("0x" + gt(e.readBytes(8))), i = Ly(e, it.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case it.PublicKey:
        ko(l.contents.data) || (o = !0);
        break;
      case it.MessageSignature:
        if (l.pubKeyEncoding === xe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new si("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === se.P2WSH || t === se.P2WSHNonSequential))
    throw new si("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ml(t) {
  return ra(t) ? u4(t) : f4(t);
}
function _l(t) {
  const e = t.readUInt8Enum(se, (n) => {
    throw new un(`Could not parse ${n} as AddressHashMode`);
  });
  return e === se.P2PKH || e === se.P2WPKH ? d4(e, t) : h4(e, t);
}
function Uy(t, e, n, r) {
  const i = t + gt(new Uint8Array([e])) + gt(Fs(n, 8)) + gt(Fs(r, 8));
  if (jt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return qf(jt(i));
}
function Hy(t, e, n) {
  const r = 33 + sl, s = ko(e.data) ? xe.Compressed : xe.Uncompressed, i = t + XE(s.toString(16)) + n, o = jt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return qf(o);
}
function p4(t, e, n, r, s) {
  const i = Uy(t, e, n, r), o = c4(s, i), a = vo(i4(s)), c = Hy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Oy(t, e, n, r, s, i) {
  const o = Uy(t, e, n, r), a = vo(r4(o, i, s)), c = Hy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function g4() {
  const t = Ny(se.P2PKH, "", 0, 0);
  return t.signer = fE().hash160, t.keyEncoding = xe.Compressed, t.signature = Xf(), t;
}
function r0(t, e, n) {
  return ra(t) ? y4(t, e, n) : w4(t, e, n);
}
function y4(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Oy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Kf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new si(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function w4(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case it.PublicKey:
        ko(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case it.MessageSignature:
        c.pubKeyEncoding === xe.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: h } = Oy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (e0(t.hashMode) && (s = h), r.push(l), o += 1, o === 65536)
          throw new si("Too many signatures");
        break;
    }
  if (e0(t.hashMode) && o !== t.signaturesRequired || l4(t.hashMode) && o < t.signaturesRequired)
    throw new si("Incorrect number of signatures");
  if (i && (t.hashMode === se.P2WSH || t.hashMode === se.P2WSHNonSequential))
    throw new si("Uncompressed keys are not allowed in this hash mode");
  const a = Kf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new si(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Dy(t) {
  return {
    authType: ke.Standard,
    spendingCondition: t
  };
}
function Fy(t, e) {
  return {
    authType: ke.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ny(se.P2PKH, "0".repeat(66), 0, 0)
  };
}
function s0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ke.Standard:
        return Dy(n0(t.spendingCondition));
      case ke.Sponsored:
        return Fy(n0(t.spendingCondition), g4());
      default:
        throw new Ic("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function b4(t, e) {
  switch (t.authType) {
    case ke.Standard:
      return r0(t.spendingCondition, e, ke.Standard);
    case ke.Sponsored:
      return r0(t.spendingCondition, e, ke.Standard);
    default:
      throw new Ic("Invalid origin auth type");
  }
}
function m4(t, e) {
  switch (t.authType) {
    case ke.Standard:
      const n = {
        ...t.spendingCondition,
        fee: sn(e)
      };
      return { ...t, spendingCondition: n };
    case ke.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: sn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function x4(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function S4(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function E4(t, e) {
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
function A4(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ke.Standard:
      e.push(Ml(t.spendingCondition));
      break;
    case ke.Sponsored:
      e.push(Ml(t.spendingCondition)), e.push(Ml(t.sponsorSpendingCondition));
      break;
  }
  return Me(e);
}
function v4(t) {
  const e = t.readUInt8Enum(ke, (r) => {
    throw new un(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ke.Standard:
      return n = _l(t), Dy(n);
    case ke.Sponsored:
      n = _l(t);
      const r = _l(t);
      return Fy(n, r);
  }
}
class k4 {
  constructor({ auth: e, payload: n, postConditions: r = Rf([]), postConditionMode: s = $c.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = QS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: sn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Bn.Any;
  }
  signBegin() {
    const e = Nu(this);
    return e.auth = s0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Nu(this);
    return e.auth = s0(e.auth), e.txid();
  }
  verifyOrigin() {
    return b4(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ke.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ke.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ke.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : vo(e), r = this.auth.spendingCondition;
    if (r && !ra(r)) {
      const s = ko(n.data);
      r.fields.push(Qi(s ? xe.Compressed : xe.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = p4(n, r, e.fee, e.nonce, s);
    if (ra(e))
      e.signature = Tu(i);
    else {
      const a = Py(s);
      e.fields.push(Qi(a ? xe.Compressed : xe.Uncompressed, Tu(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return qf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ke.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = E4(this.auth, e);
  }
  setFee(e) {
    this.auth = m4(this.auth, e);
  }
  setNonce(e) {
    this.auth = x4(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ke.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = S4(this.auth, e);
  }
  serialize() {
    return gt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Zi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Zi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Zi('"auth" is undefined');
    if (this.payload === void 0)
      throw new Zi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return di(n, this.chainId, 0), e.push(n), e.push(A4(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(zf(this.postConditions)), e.push(Ty(this.payload)), Me(e);
  }
}
function $4(t) {
  const e = An(t, le) ? t : new le(t), n = e.readUInt8Enum(Si, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = v4(e), i = e.readUInt8Enum(Bn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum($c, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = Ly(e, it.PostCondition), c = kE(e), l = new k4({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return l.anchorMode = i, l;
}
const i0 = BigInt("18446744073709551615");
function Pl(t) {
  const e = sn(t);
  if (e < 0n || e > i0)
    throw new RangeError(`Post-condition amount must be between 0 and ${i0} (u64 max), received: ${e}`);
  return e;
}
var Uu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Uu || (Uu = {}));
var Hu;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Hu || (Hu = {}));
function I4(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: it.PostCondition,
        conditionType: pe.STX,
        principal: t.address === "origin" ? { type: it.Principal, prefix: dn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        amount: Pl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: it.PostCondition,
        conditionType: pe.Fungible,
        principal: t.address === "origin" ? { type: it.Principal, prefix: dn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        amount: Pl(t.amount),
        asset: Jh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: it.PostCondition,
        conditionType: pe.NonFungible,
        principal: t.address === "origin" ? { type: it.Principal, prefix: dn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        asset: Jh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: it.PostCondition,
        conditionType: pe.Staking,
        principal: t.address === "origin" ? { type: it.Principal, prefix: dn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        amount: Pl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: it.PostCondition,
        conditionType: pe.PoX,
        principal: t.address === "origin" ? { type: it.Principal, prefix: dn.Origin } : Do(t.address),
        conditionCode: L4(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ja(t) {
  return Uu[t];
}
function L4(t) {
  return Hu[t];
}
function jy(t) {
  const e = I4(t);
  return AE(e);
}
function C4(t, e, n) {
  return Zf(Ry(t), n);
}
function Ry(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = sa(r);
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
    return BigInt(`0x${M4(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Wf(t, e = 8) {
  return (typeof t == "bigint" ? t : Ry(t)).toString(16).padStart(e * 2, "0");
}
function Zf(t, e = 16) {
  const n = Wf(t, e);
  return sa(n);
}
function T4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const B4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function M4(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += B4[n];
  return e;
}
function sa(t) {
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
function Qf(t) {
  return new TextEncoder().encode(t);
}
function _4(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function P4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function o0(t) {
  if (t.some(P4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Jf(...t) {
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
function Qr(t) {
  return Jf(...t.map((e) => typeof e == "number" ? o0([e]) : e instanceof Array ? o0(e) : e));
}
function al(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ou;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ou || (Ou = {}));
Ou.Mainnet;
const N4 = 128, U4 = 128, zy = 16;
var Du;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Du || (Du = {}));
var a0;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(a0 || (a0 = {}));
var c0;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(c0 || (c0 = {}));
var nr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nr || (nr = {}));
const Nl = ["onChainOnly", "offChainOnly", "any"];
Nl[0] + "", nr.OnChainOnly, Nl[1] + "", nr.OffChainOnly, Nl[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var Fu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fu || (Fu = {}));
Fu.Mainnet;
var l0;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(l0 || (l0 = {}));
var ti;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ti || (ti = {}));
var u0;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(u0 || (u0 = {}));
var f0;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(f0 || (f0 = {}));
var d0;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(d0 || (d0 = {}));
var h0;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(h0 || (h0 = {}));
var p0;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(p0 || (p0 = {}));
var g0;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(g0 || (g0 = {}));
var ju;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ju || (ju = {}));
var y0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(y0 || (y0 = {}));
var w0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(w0 || (w0 = {}));
function Ru(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function H4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Gy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function O4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ru(t.outputLen), Ru(t.blockLen);
}
function D4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function F4(t, e) {
  Gy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ul = {
  number: Ru,
  bool: H4,
  bytes: Gy,
  hash: O4,
  exists: D4,
  output: F4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), wr = (t, e) => t << 32 - e | t >>> e, j4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!j4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function R4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ky(t) {
  if (typeof t == "string" && (t = R4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let z4 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ni(t) {
  const e = (r) => t().update(Ky(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function G4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
let td = class extends z4 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hl(this.buffer);
  }
  update(e) {
    Ul.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ky(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Hl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ul.exists(this), Ul.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    G4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Hl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, h[u], i);
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
const K4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Vy = Uint8Array.from({ length: 16 }, (t, e) => e), V4 = Vy.map((t) => (9 * t + 5) % 16);
let ed = [Vy], nd = [V4];
for (let t = 0; t < 4; t++)
  for (let e of [ed, nd])
    e.push(e[t].map((n) => K4[n]));
const qy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), q4 = ed.map((t, e) => t.map((n) => qy[e][n])), Y4 = nd.map((t, e) => t.map((n) => qy[e][n])), X4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), W4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ra = (t, e) => t << e | t >>> 32 - e;
function b0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const za = new Uint32Array(16);
let Z4 = class extends td {
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
    for (let g = 0; g < 16; g++, n += 4)
      za[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = X4[g], C = W4[g], U = ed[g], F = nd[g], k = q4[g], B = Y4[g];
      for (let P = 0; P < 16; P++) {
        const q = Ra(r + b0(g, i, a, l) + za[U[P]] + v, k[P]) + u | 0;
        r = u, u = l, l = Ra(a, 10) | 0, a = i, i = q;
      }
      for (let P = 0; P < 16; P++) {
        const q = Ra(s + b0(A, o, c, h) + za[F[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = Ra(c, 10) | 0, c = o, o = q;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    za.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ni(() => new Z4());
const Q4 = (t, e, n) => t & e ^ ~t & n, J4 = (t, e, n) => t & e ^ t & n ^ e & n, tA = new Uint32Array([
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
let Yy = class extends td {
  constructor() {
    super(64, 32, 8, !1), this.A = As[0] | 0, this.B = As[1] | 0, this.C = As[2] | 0, this.D = As[3] | 0, this.E = As[4] | 0, this.F = As[5] | 0, this.G = As[6] | 0, this.H = As[7] | 0;
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
      vs[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = vs[u - 15], g = vs[u - 2], A = wr(w, 7) ^ wr(w, 18) ^ w >>> 3, v = wr(g, 17) ^ wr(g, 19) ^ g >>> 10;
      vs[u] = v + vs[u - 7] + A + vs[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = wr(a, 6) ^ wr(a, 11) ^ wr(a, 25), g = h + w + Q4(a, c, l) + tA[u] + vs[u] | 0, v = (wr(r, 2) ^ wr(r, 13) ^ wr(r, 22)) + J4(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    vs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, eA = class extends Yy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ni(() => new Yy());
Ni(() => new eA());
const Ga = BigInt(2 ** 32 - 1), zu = BigInt(32);
function Xy(t, e = !1) {
  return e ? { h: Number(t & Ga), l: Number(t >> zu & Ga) } : { h: Number(t >> zu & Ga) | 0, l: Number(t & Ga) | 0 };
}
function nA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Xy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const rA = (t, e) => BigInt(t >>> 0) << zu | BigInt(e >>> 0), sA = (t, e, n) => t >>> n, iA = (t, e, n) => t << 32 - n | e >>> n, oA = (t, e, n) => t >>> n | e << 32 - n, aA = (t, e, n) => t << 32 - n | e >>> n, cA = (t, e, n) => t << 64 - n | e >>> n - 32, lA = (t, e, n) => t >>> n - 32 | e << 64 - n, uA = (t, e) => e, fA = (t, e) => t, dA = (t, e, n) => t << n | e >>> 32 - n, hA = (t, e, n) => e << n | t >>> 32 - n, pA = (t, e, n) => e << n - 32 | t >>> 64 - n, gA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function yA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const wA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), bA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, mA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), xA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, SA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), EA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: Xy,
  split: nA,
  toBig: rA,
  shrSH: sA,
  shrSL: iA,
  rotrSH: oA,
  rotrSL: aA,
  rotrBH: cA,
  rotrBL: lA,
  rotr32H: uA,
  rotr32L: fA,
  rotlSH: dA,
  rotlSL: hA,
  rotlBH: pA,
  rotlBL: gA,
  add: yA,
  add3L: wA,
  add3H: bA,
  add4L: mA,
  add4H: xA,
  add5H: EA,
  add5L: SA
}, [AA, vA] = Ct.split([
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
let cl = class extends td {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: u, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ks[k] = e.getUint32(n), $s[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = ks[k - 15] | 0, P = $s[k - 15] | 0, q = Ct.rotrSH(B, P, 1) ^ Ct.rotrSH(B, P, 8) ^ Ct.shrSH(B, P, 7), st = Ct.rotrSL(B, P, 1) ^ Ct.rotrSL(B, P, 8) ^ Ct.shrSL(B, P, 7), X = ks[k - 2] | 0, V = $s[k - 2] | 0, y = Ct.rotrSH(X, V, 19) ^ Ct.rotrBH(X, V, 61) ^ Ct.shrSH(X, V, 6), $ = Ct.rotrSL(X, V, 19) ^ Ct.rotrBL(X, V, 61) ^ Ct.shrSL(X, V, 6), M = Ct.add4L(st, $, $s[k - 7], $s[k - 16]), T = Ct.add4H(M, q, y, ks[k - 7], ks[k - 16]);
      ks[k] = T | 0, $s[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: u, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const B = Ct.rotrSH(u, w, 14) ^ Ct.rotrSH(u, w, 18) ^ Ct.rotrBH(u, w, 41), P = Ct.rotrSL(u, w, 14) ^ Ct.rotrSL(u, w, 18) ^ Ct.rotrBL(u, w, 41), q = u & g ^ ~u & v, st = w & A ^ ~w & C, X = Ct.add5L(F, P, st, vA[k], $s[k]), V = Ct.add5H(X, U, B, q, AA[k], ks[k]), y = X | 0, $ = Ct.rotrSH(r, s, 28) ^ Ct.rotrBH(r, s, 34) ^ Ct.rotrBH(r, s, 39), M = Ct.rotrSL(r, s, 28) ^ Ct.rotrBL(r, s, 34) ^ Ct.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = C | 0, v = g | 0, C = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = Ct.add(l | 0, h | 0, V | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Ct.add3L(y, M, K);
      r = Ct.add3H(z, V, $, T), s = z | 0;
    }
    ({ h: r, l: s } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = Ct.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: u, l: w } = Ct.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = Ct.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = Ct.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: F } = Ct.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, l, h, u, w, g, A, v, C, U, F);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, kA = class extends cl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, $A = class extends cl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, IA = class extends cl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ni(() => new cl());
Ni(() => new kA());
Ni(() => new $A());
Ni(() => new IA());
function LA(t, e, n) {
  const s = N4;
  if (GA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Du.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ve;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ve || (Ve = {}));
let CA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Wy = class extends CA {
  constructor(e) {
    super(e);
  }
};
function ll(t) {
  const e = [];
  return e.push(sa(Wf(t.version, 1))), e.push(sa(t.hash160)), Qr(e);
}
function TA(t) {
  const e = [];
  return e.push(t.prefix), e.push(ll(t.address)), t.prefix === ju.Contract && e.push(ia(t.contractName)), Qr(e);
}
function ia(t) {
  const e = [], n = Qf(t.content), r = n.byteLength;
  return e.push(sa(Wf(r, t.lengthPrefixBytes))), e.push(n), Qr(e);
}
function BA(t) {
  const e = [];
  return e.push(ll(t.address)), e.push(ia(t.contractName)), e.push(ia(t.assetName)), Qr(e);
}
function Zy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(TA(t.principal)), (t.conditionType === ti.Fungible || t.conditionType === ti.NonFungible) && e.push(BA(t.assetInfo)), t.conditionType === ti.NonFungible && e.push(Ai(t.assetName)), e.push(t.conditionCode), t.conditionType === ti.STX || t.conditionType === ti.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Wy("The post-condition amount may not be larger than 8 bytes");
    e.push(C4(t.amount, !1, 8));
  }
  return Qr(e);
}
function Tr(t, e) {
  return Qr([t, e]);
}
function MA(t) {
  return new Uint8Array([t.type]);
}
function _A(t) {
  return t.type === Ve.OptionalNone ? new Uint8Array([t.type]) : Tr(t.type, Ai(t.value));
}
function PA(t) {
  const e = new Uint8Array(4);
  return al(e, t.buffer.length, 0), Tr(t.type, Jf(e, t.buffer));
}
function NA(t) {
  const e = Zf(T4(t.value, BigInt(U4)), zy);
  return Tr(t.type, e);
}
function UA(t) {
  const e = Zf(t.value, zy);
  return Tr(t.type, e);
}
function HA(t) {
  return Tr(t.type, ll(t.address));
}
function OA(t) {
  return Tr(t.type, Jf(ll(t.address), ia(t.contractName)));
}
function DA(t) {
  return Tr(t.type, Ai(t.value));
}
function FA(t) {
  const e = [], n = new Uint8Array(4);
  al(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ai(r);
    e.push(s);
  }
  return Tr(t.type, Qr(e));
}
function jA(t) {
  const e = [], n = new Uint8Array(4);
  al(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = LA(s);
    e.push(ia(i));
    const o = Ai(t.data[s]);
    e.push(o);
  }
  return Tr(t.type, Qr(e));
}
function Qy(t, e) {
  const n = [], r = e == "ascii" ? _4(t.data) : Qf(t.data), s = new Uint8Array(4);
  return al(s, r.length, 0), n.push(s), n.push(r), Tr(t.type, Qr(n));
}
function RA(t) {
  return Qy(t, "ascii");
}
function zA(t) {
  return Qy(t, "utf8");
}
function Ai(t) {
  switch (t.type) {
    case Ve.BoolTrue:
    case Ve.BoolFalse:
      return MA(t);
    case Ve.OptionalNone:
    case Ve.OptionalSome:
      return _A(t);
    case Ve.Buffer:
      return PA(t);
    case Ve.UInt:
      return UA(t);
    case Ve.Int:
      return NA(t);
    case Ve.PrincipalStandard:
      return HA(t);
    case Ve.PrincipalContract:
      return OA(t);
    case Ve.ResponseOk:
    case Ve.ResponseErr:
      return DA(t);
    case Ve.List:
      return FA(t);
    case Ve.Tuple:
      return jA(t);
    case Ve.StringASCII:
      return RA(t);
    case Ve.StringUTF8:
      return zA(t);
    default:
      throw new Wy("Unable to serialize. Invalid Clarity Value.");
  }
}
const GA = (t, e) => t ? Qf(t).length > e : !1, KA = "connect-ui";
let ac, Jy, Mn = !1, Gu = !1;
const Zr = (t, e = "") => () => {
}, VA = (t, e) => () => {
}, qA = "{visibility:hidden}.hydrated{visibility:inherit}", m0 = {}, YA = "http://www.w3.org/2000/svg", XA = "http://www.w3.org/1999/xhtml", WA = (t) => t != null, rd = (t) => (t = typeof t, t === "object" || t === "function");
function tw(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const kt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (l) => {
    for (let h = 0; h < l.length; h++)
      r = l[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !rd(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Ku(null, r) : r), i = s);
  };
  if (a(n), e) {
    const l = e.className || e.class;
    l && (e.class = typeof l != "object" ? l : Object.keys(l).filter((h) => l[h]).join(" "));
  }
  const c = Ku(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Ku = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, ZA = {}, QA = (t) => t && t.$tag$ === ZA, JA = (t, e) => t != null && !rd(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, tv = (t) => $o(t).$hostElement$, ev = (t, e, n) => {
  const r = nn.ce(e, n);
  return t.dispatchEvent(r), r;
}, x0 = /* @__PURE__ */ new WeakMap(), nv = (t, e, n) => {
  let r = Lc.get(t);
  Ev && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Lc.set(t, r);
}, rv = (t, e, n, r) => {
  var s;
  let i = ew(e);
  const o = Lc.get(i);
  if (t = t.nodeType === 11 ? t : kr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = x0.get(t), c;
      if (a || x0.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = kr.createElement("style"), c.innerHTML = o;
          const l = (s = nn.$nonce$) !== null && s !== void 0 ? s : tw(kr);
          l != null && c.setAttribute("nonce", l), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, sv = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Zr("attachStyles", e.$tagName$), i = rv(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, ew = (t, e) => "sc-" + t.$tagName$, S0 = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = A0(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, l = E0(n), h = E0(r);
      c.remove(...l.filter((u) => u && !h.includes(u))), c.add(...h.filter((u) => u && !l.includes(u)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : A0(ul, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && nn.rel(t, e, n, !1), r && nn.ael(t, e, r, !1);
    else {
      const c = rd(r);
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
}, iv = /\s/, E0 = (t) => t ? t.split(iv) : [], nw = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || m0, o = e.$attrs$ || m0;
  for (r in i)
    r in o || S0(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    S0(s, r, i[r], o[r], n, e.$flags$);
}, sd = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = kr.createTextNode(s.$text$);
  else {
    if (Mn || (Mn = s.$tag$ === "svg"), o = s.$elm$ = kr.createElementNS(Mn ? YA : XA, s.$tag$), Mn && s.$tag$ === "foreignObject" && (Mn = !1), nw(null, s, Mn), WA(ac) && o["s-si"] !== ac && o.classList.add(o["s-si"] = ac), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = sd(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Mn = !1 : o.tagName === "foreignObject" && (Mn = !0);
  }
  return o;
}, rw = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Jy && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = sd(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, sw = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, ov = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], l = r.length - 1, h = r[0], u = r[l], w;
  for (; s <= o && i <= l; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : u == null ? u = r[--l] : Ka(a, h) ? (Ko(a, h), a = e[++s], h = r[++i]) : Ka(c, u) ? (Ko(c, u), c = e[--o], u = r[--l]) : Ka(a, u) ? (Ko(a, u), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], u = r[--l]) : Ka(c, h) ? (Ko(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (w = sd(e && e[i], n, i), h = r[++i], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > o ? rw(t, r[l + 1] == null ? null : r[l + 1].$elm$, n, r, i, l) : i > l && sw(e, s, o);
}, Ka = (t, e) => t.$tag$ === e.$tag$, Ko = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Mn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Mn, nw(t, e, Mn), r !== null && s !== null ? ov(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), rw(n, null, e, s, 0, s.length - 1)) : r !== null && sw(r, 0, r.length - 1), Mn && i === "svg" && (Mn = !1)) : t.$text$ !== o && (n.data = o);
}, av = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Ku(null, null), s = QA(e) ? e : kt(null, null, e);
  Jy = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ac = n["s-sc"], Ko(r, s);
}, iw = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, id = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return iw(t, t.$ancestorComponent$), vv(() => cv(t, e));
}, cv = (t, e) => {
  const n = Zr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), dv(s, () => lv(t, r, e));
}, lv = async (t, e, n) => {
  const r = t.$hostElement$, s = Zr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && sv(t);
  const o = Zr("render", t.$cmpMeta$.$tagName$);
  uv(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => fv(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, uv = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, av(t, e);
  } catch (r) {
    oa(r, t.$hostElement$);
  }
  return null;
}, fv = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Zr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, aw(n), r(), t.$onReadyResolve$(n), s || ow()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && ad(() => id(t, !1)), t.$flags$ &= -517;
}, ow = (t) => {
  aw(kr.documentElement), ad(() => ev(ul, "appload", { detail: { namespace: KA } }));
}, dv = (t, e) => t && t.then ? t.then(e) : e(), aw = (t) => t.classList.add("hydrated"), hv = (t, e) => $o(t).$instanceValues$.get(e), pv = (t, e, n, r) => {
  const s = $o(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = JA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), l = n !== i && !c;
  (!(o & 8) || i === void 0) && l && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && id(s, !1));
}, cw = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return hv(this, i);
        },
        set(a) {
          pv(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        nn.jmp(() => {
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
}, gv = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = Sv(n), s.then) {
        const c = VA();
        s = await s, c();
      }
      s.isProxied || (cw(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Zr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        oa(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = ew(n);
      if (!Lc.has(c)) {
        const l = Zr("registerStyles", n.$tagName$);
        nv(c, a, !!(n.$flags$ & 1)), l();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => id(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, yv = (t) => {
  if (!(nn.$flags$ & 1)) {
    const e = $o(t), n = e.$cmpMeta$, r = Zr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            iw(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), gv(t, e, n);
    }
    r();
  }
}, wv = (t) => {
  nn.$flags$ & 1 || $o(t);
}, bv = (t, e = {}) => {
  var n;
  const r = Zr(), s = [], i = e.exclude || [], o = ul.customElements, a = kr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), l = /* @__PURE__ */ kr.createElement("style"), h = [];
  let u, w = !0;
  Object.assign(nn, e), nn.$resourcesUrl$ = new URL(e.resourcesUrl || "./", kr.baseURI).href, t.map((g) => {
    g[1].map((A) => {
      const v = {
        $flags$: A[0],
        $tagName$: A[1],
        $members$: A[2],
        $listeners$: A[3]
      };
      v.$members$ = A[2];
      const C = v.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(F) {
          super(F), F = this, xv(F, v), v.$flags$ & 1 && F.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), w ? h.push(this) : nn.jmp(() => yv(this));
        }
        disconnectedCallback() {
          nn.jmp(() => wv(this));
        }
        componentOnReady() {
          return $o(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = g[0], !i.includes(C) && !o.get(C) && (s.push(C), o.define(C, cw(
        U,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    l.innerHTML = s + qA, l.setAttribute("data-styles", "");
    const g = (n = nn.$nonce$) !== null && n !== void 0 ? n : tw(kr);
    g != null && l.setAttribute("nonce", g), a.insertBefore(l, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((g) => g.connectedCallback()) : nn.jmp(() => u = setTimeout(ow, 30)), r();
}, od = /* @__PURE__ */ new WeakMap(), $o = (t) => od.get(t), mv = (t, e) => od.set(e.$lazyInstance$ = t, e), xv = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], od.set(t, n);
}, A0 = (t, e) => e in t, oa = (t, e) => (0, console.error)(t, e), Ol = /* @__PURE__ */ new Map(), Sv = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Ol.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Ol.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => PI).then(o, oa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Ol.set(s, o), o[r]), oa);
}, Lc = /* @__PURE__ */ new Map(), ul = typeof window < "u" ? window : {}, kr = ul.document || { head: {} }, nn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, lw = (t) => Promise.resolve(t), Ev = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), v0 = [], uw = [], Av = (t, e) => (n) => {
  t.push(n), Gu || (Gu = !0, nn.$flags$ & 4 ? ad(Vu) : nn.raf(Vu));
}, k0 = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      oa(n);
    }
  t.length = 0;
}, Vu = () => {
  k0(v0), k0(uw), (Gu = v0.length > 0) && nn.raf(Vu);
}, ad = (t) => lw().then(t), vv = /* @__PURE__ */ Av(uw), kv = () => lw(), $v = (t, e) => typeof window > "u" ? Promise.resolve() : kv().then(() => bv([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Iv = Object.defineProperty, Lv = Object.defineProperties, Cv = Object.getOwnPropertyDescriptors, Cc = Object.getOwnPropertySymbols, fw = Object.prototype.hasOwnProperty, dw = Object.prototype.propertyIsEnumerable, $0 = (t, e, n) => e in t ? Iv(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Hn = (t, e) => {
  for (var n in e || (e = {})) fw.call(e, n) && $0(t, n, e[n]);
  if (Cc) for (var n of Cc(e)) dw.call(e, n) && $0(t, n, e[n]);
  return t;
}, cr = (t, e) => Lv(t, Cv(e)), hw = (t, e) => {
  var n = {};
  for (var r in t) fw.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Cc) for (var r of Cc(t)) e.indexOf(r) < 0 && dw.call(t, r) && (n[r] = t[r]);
  return n;
};
function pw() {
  return rl(wi()) || window.StacksProvider || window.BlockstackProvider;
}
function fl(t) {
  return t ? typeof t == "string" ? mi.fromName(t) : "version" in t ? t : "url" in t ? new xu({ url: t.url }) : t.transactionVersion === Si.Mainnet ? new xu({ url: t.client.baseUrl }) : new Su({ url: t.client.baseUrl }) : new Su();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Tv = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(Tv || {}), Bv = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(Bv || {}), cd = (t) => {
  let e = t;
  if (!e) {
    let n = new Kp(["store_write"], document.location.href);
    e = new mu({ appConfig: n });
  }
  return e;
};
function gw(t) {
  try {
    return cd(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var yw = (t) => {
  let e = cd(t).loadUserData().appPrivateKey, n = We.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Mv(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [xi.Mainnet]: "mainnet", [xi.Testnet]: "testnet" }, a = fl(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function _v(t) {
  let e = fl(t.network), n = cd(t.userSession), r = cr(Hn({}, t), { network: e, userSession: n });
  return Hn({ stxAddress: Mv(r) }, r);
}
async function Pv(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(jy) : n = n.map((r) => gt(Zy(r)))), new We.TokenSigner("ES256k", e).signAsync(cr(Hn({}, t), { postConditions: n }));
}
function Nv(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(jy) : e = e.map((n) => gt(Zy(n)))), We.createUnsecuredToken(cr(Hn({}, t), { postConditions: e }));
}
var Uv = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = jt(a.replace(/^0x/, "")), l = $4(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, cr(Hn({}, o), { stacksTransaction: l }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, cr(Hn({}, o), { stacksTransaction: l }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, Hv = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = hw(e, ["amount", "appDetails", "userSession"]);
  if (gw(s)) {
    let { privateKey: a, publicKey: c } = yw(s), l = cr(Hn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (l.appDetails = r), Pv(l, a);
  }
  let o = cr(Hn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), Nv(o);
};
async function Ov(t, e, n) {
  let r = await e(cr(Hn(Hn({}, _v(t)), t), { network: fl(t.network) }));
  return Uv({ token: r, options: t }, n);
}
function Dv(t, e = pw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return Ov(t, Hv, e);
}
function ww(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? cr(Hn({}, t), { message: t0(e), domain: t0(n) }) : cr(Hn({}, t), { message: gt(Ai(e)), domain: gt(Ai(n)) });
}
async function Fv(t, e) {
  return new We.TokenSigner("ES256k", e).signAsync(ww(t));
}
async function jv(t) {
  let e = t, { userSession: n } = e, r = hw(e, ["userSession"]);
  if (gw(n)) {
    let { privateKey: s, publicKey: i } = yw(n), o = cr(Hn({}, r), { publicKey: i });
    return Fv(o, s);
  }
  return We.createUnsecuredToken(ww(t));
}
var Rv = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Rv || {}), bw = "asigna-stx", I0 = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === bw && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Gv(t, e), "*");
}), zv = { authenticationRequest: async (t) => I0(t, "authenticationRequest"), transactionRequest: async (t) => I0(t, "transactionRequest") }, Gv = (t, e) => ({ source: bw, [e]: t }), Kv = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = zv);
};
Kv();
var Vv = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function qv(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = wi(), o = pw();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    $v();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Vv, c = OS(a), l = document.createElement("connect-modal");
    l.defaultProviders = a, l.installedProviders = c, l.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let u = () => {
      l.remove(), document.body.style.overflow = h;
    };
    l.callback = (g) => {
      u(), t(n, g);
    }, l.cancelCallback = () => {
      var g;
      u(), (g = n.onCancel) == null || g.call(n);
    }, document.body.appendChild(l);
    let w = (g) => {
      g.key === "Escape" && (document.removeEventListener("keydown", w), l.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var Va = qv(Dv);
function js(t, e, n) {
  return ld(pn(t, e), n);
}
function pn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ye(r);
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
      const r = Wv(BigInt(`0x${Nt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Nt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function L0(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ma(t, e = 8) {
  return (typeof t == "bigint" ? t : pn(t, !1)).toString(16).padStart(e * 2, "0");
}
function dl(t) {
  return parseInt(t, 16);
}
function ld(t, e = 16) {
  const n = ma(t, e);
  return ye(n);
}
function Yv(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Xv(t, e) {
  return t & BigInt(1) << e;
}
function Wv(t, e) {
  return Xv(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Zv = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Zv[n];
  return e;
}
function ye(t) {
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
function Io(t) {
  return new TextEncoder().encode(t);
}
function ud(t) {
  return new TextDecoder().decode(t);
}
function mw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Qv(t) {
  return String.fromCharCode.apply(null, t);
}
function Jv(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function C0(t) {
  if (t.some(Jv))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function hl(...t) {
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
  return hl(...t.map((e) => typeof e == "number" ? C0([e]) : e instanceof Array ? C0(e) : e));
}
var T0;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(T0 || (T0 = {}));
var B0;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(B0 || (B0 = {}));
var M0;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(M0 || (M0 = {}));
const xw = 33, Dl = 32;
function t8(t) {
  if (t.length < Dl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Dl * 2), r = t.slice(2 + Dl * 2);
  return {
    recoveryId: dl(e),
    r: n,
    s: r
  };
}
function e8(t) {
  const e = typeof t == "string" ? ye(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function n8(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function r8(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function s8(t, e) {
  return t[e];
}
function i8(t, e, n = 0) {
  return t[n] = e, t;
}
function o8(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function vi(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var qu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(qu || (qu = {}));
const a8 = qu.Mainnet, c8 = 128, l8 = 128, Sw = 16, li = 32, Yu = 80, pl = 65, u8 = 32, f8 = 64, Tc = 34;
var ht;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ht || (ht = {}));
var _t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_t || (_t = {}));
var Xu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Xu || (Xu = {}));
var Sn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Sn || (Sn = {}));
const cc = ["onChainOnly", "offChainOnly", "any"], _0 = {
  [cc[0]]: Sn.OnChainOnly,
  [cc[1]]: Sn.OffChainOnly,
  [cc[2]]: Sn.Any,
  [Sn.OnChainOnly]: Sn.OnChainOnly,
  [Sn.OffChainOnly]: Sn.OffChainOnly,
  [Sn.Any]: Sn.Any
};
function d8(t) {
  if (t in _0)
    return _0[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${cc.join(", ")}`);
}
var Bc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Bc || (Bc = {}));
Bc.Mainnet;
var wo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(wo || (wo = {}));
var En;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(En || (En = {}));
var $e;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})($e || ($e = {}));
var ie;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ie || (ie = {}));
var Mc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Mc || (Mc = {}));
var Se;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Se || (Se = {}));
var aa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(aa || (aa = {}));
var Wu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Wu || (Wu = {}));
var ca;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ca || (ca = {}));
var P0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(P0 || (P0 = {}));
var N0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(N0 || (N0 = {}));
function Zu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function h8(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ew(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function p8(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zu(t.outputLen), Zu(t.blockLen);
}
function g8(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function y8(t, e) {
  Ew(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const oi = {
  number: Zu,
  bool: h8,
  bytes: Ew,
  hash: p8,
  exists: g8,
  output: y8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), br = (t, e) => t << 32 - e | t >>> e, w8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!w8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function b8(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function fd(t) {
  if (typeof t == "string" && (t = b8(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Aw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ui(t) {
  const e = (r) => t().update(fd(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function m8(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, l = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + l, a, r);
}
class dd extends Aw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Fl(this.buffer);
  }
  update(e) {
    oi.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = fd(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Fl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    oi.exists(this), oi.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let u = o; u < s; u++)
      n[u] = 0;
    m8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Fl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const l = c / 4, h = this.get();
    if (l > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, h[u], i);
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
const x8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), vw = Uint8Array.from({ length: 16 }, (t, e) => e), S8 = vw.map((t) => (9 * t + 5) % 16);
let hd = [vw], pd = [S8];
for (let t = 0; t < 4; t++)
  for (let e of [hd, pd])
    e.push(e[t].map((n) => x8[n]));
const kw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), E8 = hd.map((t, e) => t.map((n) => kw[e][n])), A8 = pd.map((t, e) => t.map((n) => kw[e][n])), v8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), k8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qa = (t, e) => t << e | t >>> 32 - e;
function U0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ya = new Uint32Array(16);
class $8 extends dd {
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
    for (let g = 0; g < 16; g++, n += 4)
      Ya[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, l = this.h3 | 0, h = l, u = this.h4 | 0, w = u;
    for (let g = 0; g < 5; g++) {
      const A = 4 - g, v = v8[g], C = k8[g], U = hd[g], F = pd[g], k = E8[g], B = A8[g];
      for (let P = 0; P < 16; P++) {
        const q = qa(r + U0(g, i, a, l) + Ya[U[P]] + v, k[P]) + u | 0;
        r = u, u = l, l = qa(a, 10) | 0, a = i, i = q;
      }
      for (let P = 0; P < 16; P++) {
        const q = qa(s + U0(A, o, c, h) + Ya[F[P]] + C, B[P]) + w | 0;
        s = w, w = h, h = qa(c, 10) | 0, c = o, o = q;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + l + w | 0, this.h3 + u + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ya.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const I8 = Ui(() => new $8()), L8 = (t, e, n) => t & e ^ ~t & n, C8 = (t, e, n) => t & e ^ t & n ^ e & n, T8 = new Uint32Array([
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
class $w extends dd {
  constructor() {
    super(64, 32, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
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
      Ls[u] = e.getUint32(n, !1);
    for (let u = 16; u < 64; u++) {
      const w = Ls[u - 15], g = Ls[u - 2], A = br(w, 7) ^ br(w, 18) ^ w >>> 3, v = br(g, 17) ^ br(g, 19) ^ g >>> 10;
      Ls[u] = v + Ls[u - 7] + A + Ls[u - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: l, H: h } = this;
    for (let u = 0; u < 64; u++) {
      const w = br(a, 6) ^ br(a, 11) ^ br(a, 25), g = h + w + L8(a, c, l) + T8[u] + Ls[u] | 0, v = (br(r, 2) ^ br(r, 13) ^ br(r, 22)) + C8(r, s, i) | 0;
      h = l, l = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, l, h);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class B8 extends $w {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const gd = Ui(() => new $w());
Ui(() => new B8());
const Xa = BigInt(2 ** 32 - 1), Qu = BigInt(32);
function Iw(t, e = !1) {
  return e ? { h: Number(t & Xa), l: Number(t >> Qu & Xa) } : { h: Number(t >> Qu & Xa) | 0, l: Number(t & Xa) | 0 };
}
function M8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Iw(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const _8 = (t, e) => BigInt(t >>> 0) << Qu | BigInt(e >>> 0), P8 = (t, e, n) => t >>> n, N8 = (t, e, n) => t << 32 - n | e >>> n, U8 = (t, e, n) => t >>> n | e << 32 - n, H8 = (t, e, n) => t << 32 - n | e >>> n, O8 = (t, e, n) => t << 64 - n | e >>> n - 32, D8 = (t, e, n) => t >>> n - 32 | e << 64 - n, F8 = (t, e) => e, j8 = (t, e) => t, R8 = (t, e, n) => t << n | e >>> 32 - n, z8 = (t, e, n) => e << n | t >>> 32 - n, G8 = (t, e, n) => e << n - 32 | t >>> 64 - n, K8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function V8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const q8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Y8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, X8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), W8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Z8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Q8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: Iw,
  split: M8,
  toBig: _8,
  shrSH: P8,
  shrSL: N8,
  rotrSH: U8,
  rotrSL: H8,
  rotrBH: O8,
  rotrBL: D8,
  rotr32H: F8,
  rotr32L: j8,
  rotlSH: R8,
  rotlSL: z8,
  rotlBH: G8,
  rotlBL: K8,
  add: V8,
  add3L: q8,
  add3H: Y8,
  add4L: X8,
  add4H: W8,
  add5H: Q8,
  add5L: Z8
}, [J8, tk] = Tt.split([
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
class gl extends dd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: h, Fh: u, Fl: w, Gh: g, Gl: A, Hh: v, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, l, h, u, w, g, A, v, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = h | 0, this.Fh = u | 0, this.Fl = w | 0, this.Gh = g | 0, this.Gl = A | 0, this.Hh = v | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Cs[k] = e.getUint32(n), Ts[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const B = Cs[k - 15] | 0, P = Ts[k - 15] | 0, q = Tt.rotrSH(B, P, 1) ^ Tt.rotrSH(B, P, 8) ^ Tt.shrSH(B, P, 7), st = Tt.rotrSL(B, P, 1) ^ Tt.rotrSL(B, P, 8) ^ Tt.shrSL(B, P, 7), X = Cs[k - 2] | 0, V = Ts[k - 2] | 0, y = Tt.rotrSH(X, V, 19) ^ Tt.rotrBH(X, V, 61) ^ Tt.shrSH(X, V, 6), $ = Tt.rotrSL(X, V, 19) ^ Tt.rotrBL(X, V, 61) ^ Tt.shrSL(X, V, 6), M = Tt.add4L(st, $, Ts[k - 7], Ts[k - 16]), T = Tt.add4H(M, q, y, Cs[k - 7], Cs[k - 16]);
      Cs[k] = T | 0, Ts[k] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: h, Eh: u, El: w, Fh: g, Fl: A, Gh: v, Gl: C, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const B = Tt.rotrSH(u, w, 14) ^ Tt.rotrSH(u, w, 18) ^ Tt.rotrBH(u, w, 41), P = Tt.rotrSL(u, w, 14) ^ Tt.rotrSL(u, w, 18) ^ Tt.rotrBL(u, w, 41), q = u & g ^ ~u & v, st = w & A ^ ~w & C, X = Tt.add5L(F, P, st, tk[k], Ts[k]), V = Tt.add5H(X, U, B, q, J8[k], Cs[k]), y = X | 0, $ = Tt.rotrSH(r, s, 28) ^ Tt.rotrBH(r, s, 34) ^ Tt.rotrBH(r, s, 39), M = Tt.rotrSL(r, s, 28) ^ Tt.rotrBL(r, s, 34) ^ Tt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = C | 0, v = g | 0, C = A | 0, g = u | 0, A = w | 0, { h: u, l: w } = Tt.add(l | 0, h | 0, V | 0, y | 0), l = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Tt.add3L(y, M, K);
      r = Tt.add3H(z, V, $, T), s = z | 0;
    }
    ({ h: r, l: s } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: h } = Tt.add(this.Dh | 0, this.Dl | 0, l | 0, h | 0), { h: u, l: w } = Tt.add(this.Eh | 0, this.El | 0, u | 0, w | 0), { h: g, l: A } = Tt.add(this.Fh | 0, this.Fl | 0, g | 0, A | 0), { h: v, l: C } = Tt.add(this.Gh | 0, this.Gl | 0, v | 0, C | 0), { h: U, l: F } = Tt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, l, h, u, w, g, A, v, C, U, F);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class ek extends gl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class nk extends gl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class rk extends gl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ui(() => new gl());
Ui(() => new ek());
const sk = Ui(() => new nk());
Ui(() => new rk());
function Lw(t) {
  if (ye(t).byteLength != pl)
    throw Error("Invalid signature");
  return {
    type: ht.MessageSignature,
    data: t
  };
}
function Vo(t, e) {
  return { type: ht.Address, version: t, hash160: e };
}
function Ji(t) {
  return _i.c32address(t.version, t.hash160);
}
function ki(t, e, n) {
  const r = e || 1, s = n || c8;
  if (Kw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ht.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function yd(t) {
  const e = _i.c32addressDecode(t);
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
function ik(t) {
  if (t.type === Z.PrincipalStandard)
    return Ji(t.address);
  if (t.type === Z.PrincipalContract)
    return `${Ji(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Cw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return ck(e, n);
  } else
    return ok(t);
}
function ok(t) {
  const e = yd(t);
  return { type: Z.PrincipalStandard, address: e };
}
function ak(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function ck(t, e) {
  const n = yd(t), r = ki(e);
  return Tw(n, r);
}
function Tw(t, e) {
  if (Io(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function jl(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${Nt(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return Er(t.value);
    case Z.ResponseErr:
      return Er(t.value);
    case Z.ResponseOk:
      return Er(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return ik(t);
    case Z.List:
      return t.list.map((r) => Er(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Er(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function Er(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: _s(t), value: jl(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: _s(t), value: jl(t, !0), success: !0 };
    default:
      return { type: _s(t), value: jl(t, !0) };
  }
}
function _s(t) {
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
      return `(optional ${_s(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${_s(t.value)})`;
    case Z.ResponseOk:
      return `(response ${_s(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? _s(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${_s(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${mw(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${Io(t.data).length})`;
  }
}
const Bw = () => ({ type: Z.BoolTrue }), Mw = () => ({ type: Z.BoolFalse }), lk = (t) => t ? Bw() : Mw(), H0 = BigInt("0xffffffffffffffffffffffffffffffff"), uk = BigInt(0), O0 = BigInt("0x7fffffffffffffffffffffffffffffff"), D0 = BigInt("-170141183460469231731687303715884105728"), fk = (t) => {
  const e = pn(t, !0);
  if (e > O0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${O0}`);
  if (e < D0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${D0}`);
  return { type: Z.Int, value: e };
}, $r = (t) => {
  const e = pn(t, !1);
  if (e < uk)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > H0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${H0}`);
  return { type: Z.UInt, value: e };
}, _w = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function Pw() {
  return { type: Z.OptionalNone };
}
function Nw(t) {
  return { type: Z.OptionalSome, value: t };
}
function dk(t) {
  return { type: Z.ResponseErr, value: t };
}
function hk(t) {
  return { type: Z.ResponseOk, value: t };
}
function pk(t) {
  return { type: Z.List, list: t };
}
function $i(t) {
  for (const e in t)
    if (!r6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const Xe = (t) => ({ type: Z.StringASCII, data: t }), gk = (t) => ({ type: Z.StringUTF8, data: t });
class Uw extends Aw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, oi.hash(e);
    const r = fd(n);
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
    return oi.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    oi.exists(this), oi.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Hw = (t, e, n) => new Uw(t, e).update(n).digest();
Hw.create = (t, e) => new Uw(t, e);
Ie.hmacSha256Sync = (t, ...e) => {
  const n = Hw.create(gd, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function bo(t) {
  return {
    type: ht.PublicKey,
    data: ye(t)
  };
}
function yk(t, e, n = Se.Compressed) {
  const r = t8(e.data), s = new Nn(L0(r.r), L0(r.s)), i = Pt.fromSignature(t, s, r.recoveryId), o = n === Se.Compressed;
  return i.toHex(o);
}
function wk(t) {
  return { type: ht.PublicKey, data: t };
}
function Lo(t) {
  return !Nt(t.data).startsWith("04");
}
function _c(t) {
  return t.data.slice();
}
function bk(t) {
  const e = Sk(t), n = pa(e.data.slice(0, 32), e.compressed);
  return bo(Nt(n));
}
function mk(t) {
  const e = typeof t == "string" ? t : Nt(t), n = Pt.fromHex(e).toHex(!0);
  return bo(n);
}
function xk(t) {
  const e = typeof t == "string" ? t : Nt(t), n = Pt.fromHex(e).toHex(!1);
  return bo(n);
}
function Ju(t) {
  const e = t.readUInt8(), n = e === 4 ? f8 : u8;
  return wk(_e([e, t.readBytes(n)]));
}
function Sk(t) {
  const e = e8(t), n = e.length == xw;
  return { data: e, compressed: n };
}
function Ek(t, e) {
  const [n, r] = qc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = ma(r, 1) + Nn.fromHex(n).toCompactHex();
  return Lw(i);
}
function Ak(t) {
  return bk(t.data);
}
function vk(t, e, n) {
  return typeof t == "string" && (t = Cw(t)), typeof n == "string" && (n = R0(n)), {
    type: ht.Payload,
    payloadType: _t.TokenTransfer,
    recipient: t,
    amount: pn(e, !1),
    memo: n ?? R0("")
  };
}
function kk(t, e, n, r) {
  return typeof t == "string" && (t = yd(t)), typeof e == "string" && (e = ki(e)), typeof n == "string" && (n = ki(n)), {
    type: ht.Payload,
    payloadType: _t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function F0(t, e, n) {
  return typeof t == "string" && (t = ki(t)), typeof e == "string" && (e = Pk(e)), typeof n == "number" ? {
    type: ht.Payload,
    payloadType: _t.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ht.Payload,
    payloadType: _t.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function $k() {
  return { type: ht.Payload, payloadType: _t.PoisonMicroblock };
}
function j0(t, e) {
  if (t.byteLength != li)
    throw Error(`Coinbase buffer size must be ${li} bytes`);
  return e != null ? {
    type: ht.Payload,
    payloadType: _t.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ht.Payload,
    payloadType: _t.Coinbase,
    coinbaseBytes: t
  };
}
function Ik(t, e, n) {
  if (t.byteLength != li)
    throw Error(`Coinbase buffer size must be ${li} bytes`);
  if (n.byteLength != Yu)
    throw Error(`VRF proof buffer size must be ${Yu} bytes`);
  return {
    type: ht.Payload,
    payloadType: _t.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var tf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(tf || (tf = {}));
function Lk(t, e, n, r, s, i, o) {
  return {
    type: ht.Payload,
    payloadType: _t.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Ow(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case _t.TokenTransfer:
      e.push(Te(t.recipient)), e.push(js(t.amount, !1, 8)), e.push(jr(t.memo));
      break;
    case _t.ContractCall:
      e.push(jr(t.contractAddress)), e.push(jr(t.contractName)), e.push(jr(t.functionName));
      const n = new Uint8Array(4);
      vi(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Te(r));
      });
      break;
    case _t.SmartContract:
      e.push(jr(t.contractName)), e.push(jr(t.codeBody));
      break;
    case _t.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(jr(t.contractName)), e.push(jr(t.codeBody));
      break;
    case _t.PoisonMicroblock:
      break;
    case _t.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case _t.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Te(t.recipient));
      break;
    case _t.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Te(t.recipient ? Nw(t.recipient) : Pw())), e.push(t.vrfProof);
      break;
    case _t.TenureChange:
      e.push(ye(t.tenureHash)), e.push(ye(t.previousTenureHash)), e.push(ye(t.burnViewHash)), e.push(ye(t.previousTenureEnd)), e.push(vi(new Uint8Array(4), t.previousTenureBlocks)), e.push(i8(new Uint8Array(1), t.cause)), e.push(ye(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function Ck(t) {
  switch (t.readUInt8Enum(_t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case _t.TokenTransfer:
      const n = Yn(t), r = pn(t.readBytes(8), !1), s = Fw(t);
      return vk(n, r, s);
    case _t.ContractCall:
      const i = mo(t), o = qn(t), a = qn(t), c = [], l = t.readUInt32BE();
      for (let k = 0; k < l; k++) {
        const B = Yn(t);
        c.push(B);
      }
      return kk(i, o, a, c);
    case _t.SmartContract:
      const h = qn(t), u = qn(t, 4, 1e5);
      return F0(h, u);
    case _t.VersionedSmartContract: {
      const k = t.readUInt8Enum(Xu, (q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${q}`);
      }), B = qn(t), P = qn(t, 4, 1e5);
      return F0(B, P, k);
    }
    case _t.PoisonMicroblock:
      return $k();
    case _t.Coinbase: {
      const k = t.readBytes(li);
      return j0(k);
    }
    case _t.CoinbaseToAltRecipient: {
      const k = t.readBytes(li), B = Yn(t);
      return j0(k, B);
    }
    case _t.NakamotoCoinbase: {
      const k = t.readBytes(li), B = Yn(t), P = t.readBytes(Yu);
      return Ik(k, B, P);
    }
    case _t.TenureChange:
      const w = Nt(t.readBytes(20)), g = Nt(t.readBytes(20)), A = Nt(t.readBytes(20)), v = Nt(t.readBytes(32)), C = t.readUInt32BE(), U = t.readUInt8Enum(tf, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), F = Nt(t.readBytes(20));
      return Lk(w, g, A, v, C, U, F);
  }
}
class yl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ei extends yl {
  constructor(e) {
    super(e);
  }
}
class Pn extends yl {
  constructor(e) {
    super(e);
  }
}
class Pc extends yl {
  constructor(e) {
    super(e);
  }
}
class ai extends yl {
  constructor(e) {
    super(e);
  }
}
var ir;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ir || (ir = {}));
function ef(t) {
  return Lw(Nt(t.readBytes(pl)));
}
function to(t, e) {
  return {
    pubKeyEncoding: t,
    type: ht.TransactionAuthField,
    contents: e
  };
}
function Tk(t) {
  const e = t.readUInt8Enum(ir, (n) => {
    throw new Pn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ir.PublicKeyCompressed:
      return to(Se.Compressed, Ju(t));
    case ir.PublicKeyUncompressed:
      return to(Se.Uncompressed, xk(Ju(t).data));
    case ir.SignatureCompressed:
      return to(Se.Compressed, ef(t));
    case ir.SignatureUncompressed:
      return to(Se.Uncompressed, ef(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function wd(t) {
  return ye(t.data);
}
function Bk(t) {
  const e = [];
  switch (t.contents.type) {
    case ht.PublicKey:
      e.push(t.pubKeyEncoding === Se.Compressed ? ir.PublicKeyCompressed : ir.PublicKeyUncompressed), e.push(_c(mk(t.contents.data)));
      break;
    case ht.MessageSignature:
      e.push(t.pubKeyEncoding === Se.Compressed ? ir.SignatureCompressed : ir.SignatureUncompressed), e.push(wd(t.contents));
      break;
  }
  return _e(e);
}
function jr(t) {
  switch (t.type) {
    case ht.Address:
      return xa(t);
    case ht.Principal:
      return Dw(t);
    case ht.LengthPrefixedString:
      return xo(t);
    case ht.MemoString:
      return Nk(t);
    case ht.AssetInfo:
      return jw(t);
    case ht.PostCondition:
      return Uk(t);
    case ht.PublicKey:
      return _c(t);
    case ht.LengthPrefixedList:
      return xd(t);
    case ht.Payload:
      return Ow(t);
    case ht.TransactionAuthField:
      return Bk(t);
    case ht.MessageSignature:
      return wd(t);
  }
}
function Mk() {
  return {
    type: ht.Address,
    version: Mc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function bd(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ie.SerializeP2WPKH || e === ie.SerializeP2WSH || e === ie.SerializeP2WSHNonSequential) && !r.every(Lo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ie.SerializeP2PKH:
      return Vo(t, Jk(r[0].data));
    case ie.SerializeP2WPKH:
      return Vo(t, t6(r[0].data));
    case ie.SerializeP2SH:
    case ie.SerializeP2SHNonSequential:
      return Vo(t, e6(n, r.map(_c)));
    case ie.SerializeP2WSH:
    case ie.SerializeP2WSHNonSequential:
      return Vo(t, n6(n, r.map(_c)));
  }
}
function xa(t) {
  const e = [];
  return e.push(ye(ma(t.version, 1))), e.push(ye(t.hash160)), _e(e);
}
function mo(t) {
  const e = dl(Nt(t.readBytes(1))), n = Nt(t.readBytes(20));
  return { type: ht.Address, version: e, hash160: n };
}
function Dw(t) {
  const e = [];
  return e.push(t.prefix), e.push(xa(t.address)), t.prefix === ca.Contract && e.push(xo(t.contractName)), _e(e);
}
function _k(t) {
  const e = t.readUInt8Enum(ca, (s) => {
    throw new Pn(`Unexpected Principal payload type: ${s}`);
  }), n = mo(t);
  if (e === ca.Standard)
    return { type: ht.Principal, prefix: e, address: n };
  const r = qn(t);
  return {
    type: ht.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function xo(t) {
  const e = [], n = Io(t.content), r = n.byteLength;
  return e.push(ye(ma(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function qn(t, e, n) {
  e = e || 1;
  const r = dl(Nt(t.readBytes(e))), s = ud(t.readBytes(r));
  return ki(s, e, n ?? 128);
}
function Pk(t) {
  return ki(t, 4, 1e5);
}
function R0(t) {
  if (t && Kw(t, Tc))
    throw new Error(`Memo exceeds maximum length of ${Tc} bytes`);
  return { type: ht.MemoString, content: t };
}
function Nk(t) {
  const e = [], n = Io(t.content), r = Qk(Nt(n), Tc * 2);
  return e.push(ye(r)), _e(e);
}
function Fw(t) {
  let e = ud(t.readBytes(Tc));
  return e = e.replace(/\u0000*$/, ""), { type: ht.MemoString, content: e };
}
function jw(t) {
  const e = [];
  return e.push(xa(t.address)), e.push(xo(t.contractName)), e.push(xo(t.assetName)), _e(e);
}
function nf(t) {
  return {
    type: ht.AssetInfo,
    address: mo(t),
    contractName: qn(t),
    assetName: qn(t)
  };
}
function md(t, e) {
  return {
    type: ht.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function xd(t) {
  const e = t.values, n = [];
  n.push(ye(ma(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(jr(r));
  return _e(n);
}
function Rw(t, e, n) {
  const r = dl(Nt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case ht.Address:
        s.push(mo(t));
        break;
      case ht.LengthPrefixedString:
        s.push(qn(t));
        break;
      case ht.MemoString:
        s.push(Fw(t));
        break;
      case ht.AssetInfo:
        s.push(nf(t));
        break;
      case ht.PostCondition:
        s.push(Hk(t));
        break;
      case ht.PublicKey:
        s.push(Ju(t));
        break;
      case ht.TransactionAuthField:
        s.push(Tk(t));
        break;
    }
  return md(s, n);
}
function Uk(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Dw(t.principal)), (t.conditionType === En.Fungible || t.conditionType === En.NonFungible) && e.push(jw(t.assetInfo)), t.conditionType === En.NonFungible && e.push(Te(t.assetName)), e.push(t.conditionCode), t.conditionType === En.STX || t.conditionType === En.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ei("The post-condition amount may not be larger than 8 bytes");
    e.push(js(t.amount, !1, 8));
  }
  return _e(e);
}
function Hk(t) {
  const e = t.readUInt8Enum(En, (o) => {
    throw new Pn(`Could not read ${o} as PostConditionType`);
  }), n = _k(t);
  let r, s, i;
  switch (e) {
    case En.STX:
      return r = t.readUInt8Enum(aa, (a) => {
        throw new Pn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Nt(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: En.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case En.Fungible:
      return s = nf(t), r = t.readUInt8Enum(aa, (a) => {
        throw new Pn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Nt(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: En.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case En.NonFungible:
      s = nf(t);
      const o = Yn(t);
      return r = t.readUInt8Enum(Wu, (a) => {
        throw new Pn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ht.PostCondition,
        conditionType: En.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Br(t, e) {
  return _e([t, e]);
}
function Ok(t) {
  return new Uint8Array([t.type]);
}
function Dk(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : Br(t.type, Te(t.value));
}
function Fk(t) {
  const e = new Uint8Array(4);
  return vi(e, t.buffer.length, 0), Br(t.type, hl(e, t.buffer));
}
function jk(t) {
  const e = ld(Yv(t.value, BigInt(l8)), Sw);
  return Br(t.type, e);
}
function Rk(t) {
  const e = ld(t.value, Sw);
  return Br(t.type, e);
}
function zk(t) {
  return Br(t.type, xa(t.address));
}
function Gk(t) {
  return Br(t.type, hl(xa(t.address), xo(t.contractName)));
}
function Kk(t) {
  return Br(t.type, Te(t.value));
}
function Vk(t) {
  const e = [], n = new Uint8Array(4);
  vi(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Te(r);
    e.push(s);
  }
  return Br(t.type, _e(e));
}
function qk(t) {
  const e = [], n = new Uint8Array(4);
  vi(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ki(s);
    e.push(xo(i));
    const o = Te(t.data[s]);
    e.push(o);
  }
  return Br(t.type, _e(e));
}
function zw(t, e) {
  const n = [], r = e == "ascii" ? mw(t.data) : Io(t.data), s = new Uint8Array(4);
  return vi(s, r.length, 0), n.push(s), n.push(r), Br(t.type, _e(n));
}
function Yk(t) {
  return zw(t, "ascii");
}
function Xk(t) {
  return zw(t, "utf8");
}
function Te(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return Ok(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return Dk(t);
    case Z.Buffer:
      return Fk(t);
    case Z.UInt:
      return Rk(t);
    case Z.Int:
      return jk(t);
    case Z.PrincipalStandard:
      return zk(t);
    case Z.PrincipalContract:
      return Gk(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return Kk(t);
    case Z.List:
      return Vk(t);
    case Z.Tuple:
      return qk(t);
    case Z.StringASCII:
      return Yk(t);
    case Z.StringUTF8:
      return Xk(t);
    default:
      throw new ei("Unable to serialize. Invalid Clarity Value.");
  }
}
function Wk(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const z0 = /* @__PURE__ */ new Map();
function Gw(t, e) {
  const n = z0.get(t);
  if (n !== void 0)
    return n(e);
  const r = Wk(t);
  return z0.set(t, r), Gw(t, e);
}
class Zo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return o8(this.readBytes(4), 0);
  }
  readUInt8() {
    return s8(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return n8(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Nt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Nt(n);
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
    if (Gw(e, r))
      return r;
    throw n(r);
  }
}
function Yn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Zo(ye(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Zo(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new Pn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return fk(e.readBytes(16));
    case Z.UInt:
      return $r(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return _w(e.readBytes(r));
    case Z.BoolTrue:
      return Bw();
    case Z.BoolFalse:
      return Mw();
    case Z.PrincipalStandard:
      const s = mo(e);
      return ak(s);
    case Z.PrincipalContract:
      const i = mo(e), o = qn(e);
      return Tw(i, o);
    case Z.ResponseOk:
      return hk(Yn(e));
    case Z.ResponseErr:
      return dk(Yn(e));
    case Z.OptionalNone:
      return Pw();
    case Z.OptionalSome:
      return Nw(Yn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Yn(e));
      return pk(c);
    case Z.Tuple:
      const l = e.readUInt32BE(), h = {};
      for (let v = 0; v < l; v++) {
        const C = qn(e).content;
        if (C === void 0)
          throw new Pn('"content" is undefined');
        h[C] = Yn(e);
      }
      return $i(h);
    case Z.StringASCII:
      const u = e.readUInt32BE(), w = Qv(e.readBytes(u));
      return Xe(w);
    case Z.StringUTF8:
      const g = e.readUInt32BE(), A = ud(e.readBytes(g));
      return gk(A);
    default:
      throw new Pn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Zk = (t) => t.length % 2 == 0 ? t : `0${t}`, Qk = (t, e) => t.padEnd(e, "0"), Kw = (t, e) => t ? Io(t).length > e : !1;
function rf(t) {
  return uy(t);
}
const la = (t) => I8(gd(t)), Sd = (t) => Nt(sk(t)), Jk = (t) => Nt(la(t)), t6 = (t) => {
  const e = la(t), n = hl(new Uint8Array([0]), new Uint8Array([e.length]), e), r = la(n);
  return Nt(r);
}, e6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = la(r);
  return Nt(s);
}, n6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = gd(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = la(o);
  return Nt(a);
};
function r6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Vw(t) {
  const e = Te(t);
  return `0x${Nt(e)}`;
}
function s6(t) {
  return Yn(t);
}
const no = (t) => {
  try {
    return _i.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Ed() {
  return {
    type: ht.MessageSignature,
    data: Nt(new Uint8Array(pl))
  };
}
function qw(t, e, n, r) {
  const s = bd(0, t, 1, [bo(e)]).hash160, i = Lo(bo(e)) ? Se.Compressed : Se.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: pn(n, !1),
    fee: pn(r, !1),
    keyEncoding: i,
    signature: Ed()
  };
}
function ua(t) {
  return "signature" in t;
}
function G0(t) {
  return t === ie.SerializeP2SH || t === ie.SerializeP2WSH;
}
function i6(t) {
  return t === ie.SerializeP2SHNonSequential || t === ie.SerializeP2WSHNonSequential;
}
function K0(t) {
  const e = rf(t);
  return e.nonce = 0, e.fee = 0, ua(e) ? e.signature = Ed() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function o6(t) {
  const e = [
    t.hashMode,
    ye(t.signer),
    js(t.nonce, !1, 8),
    js(t.fee, !1, 8),
    t.keyEncoding,
    wd(t.signature)
  ];
  return _e(e);
}
function a6(t) {
  const e = [
    t.hashMode,
    ye(t.signer),
    js(t.nonce, !1, 8),
    js(t.fee, !1, 8)
  ], n = md(t.fields);
  e.push(xd(n));
  const r = new Uint8Array(2);
  return r8(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function c6(t, e) {
  const n = Nt(e.readBytes(20)), r = BigInt(`0x${Nt(e.readBytes(8))}`), s = BigInt(`0x${Nt(e.readBytes(8))}`), i = e.readUInt8Enum(Se, (a) => {
    throw new Pn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ie.SerializeP2WPKH && i != Se.Compressed)
    throw new Pn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ef(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function l6(t, e) {
  const n = Nt(e.readBytes(20)), r = BigInt("0x" + Nt(e.readBytes(8))), s = BigInt("0x" + Nt(e.readBytes(8))), i = Rw(e, ht.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const l of i)
    switch (l.contents.type) {
      case ht.PublicKey:
        Lo(l.contents) || (o = !0);
        break;
      case ht.MessageSignature:
        if (l.pubKeyEncoding === Se.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ai("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ie.SerializeP2WSH || t === ie.SerializeP2WSHNonSequential))
    throw new ai("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Rl(t) {
  return ua(t) ? o6(t) : a6(t);
}
function zl(t) {
  const e = t.readUInt8Enum(ie, (n) => {
    throw new Pn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH ? c6(e, t) : l6(e, t);
}
function Yw(t, e, n, r) {
  const i = t + Nt(new Uint8Array([e])) + Nt(js(n, !1, 8)) + Nt(js(r, !1, 8));
  if (ye(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Sd(ye(i));
}
function Xw(t, e, n) {
  const r = 33 + pl, s = Lo(e) ? Se.Compressed : Se.Uncompressed, i = t + Zk(s.toString(16)) + n.data, o = ye(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Sd(o);
}
function u6(t, e, n, r, s) {
  const i = Yw(t, e, n, r), o = Ek(s, i), a = Ak(s), c = Xw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ww(t, e, n, r, s, i) {
  const o = Yw(t, e, n, r), a = bo(yk(o, i, s)), c = Xw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function f6() {
  const t = qw(ie.SerializeP2PKH, "", 0, 0);
  return t.signer = Mk().hash160, t.keyEncoding = Se.Compressed, t.signature = Ed(), t;
}
function V0(t, e, n) {
  return ua(t) ? d6(t, e, n) : h6(t, e, n);
}
function d6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Ww(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = bd(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ai(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function h6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ht.PublicKey:
        Lo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case ht.MessageSignature:
        c.pubKeyEncoding === Se.Uncompressed && (i = !0);
        const { pubKey: l, nextSigHash: h } = Ww(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (G0(t.hashMode) && (s = h), r.push(l), o += 1, o === 65536)
          throw new ai("Too many signatures");
        break;
    }
  if (G0(t.hashMode) && o !== t.signaturesRequired || i6(t.hashMode) && o < t.signaturesRequired)
    throw new ai("Incorrect number of signatures");
  if (i && (t.hashMode === ie.SerializeP2WSH || t.hashMode === ie.SerializeP2WSHNonSequential))
    throw new ai("Uncompressed keys are not allowed in this hash mode");
  const a = bd(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ai(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Zw(t) {
  return {
    authType: $e.Standard,
    spendingCondition: t
  };
}
function Qw(t, e) {
  return {
    authType: $e.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || qw(ie.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function q0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case $e.Standard:
        return Zw(K0(t.spendingCondition));
      case $e.Sponsored:
        return Qw(K0(t.spendingCondition), f6());
      default:
        throw new Pc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function p6(t, e) {
  switch (t.authType) {
    case $e.Standard:
      return V0(t.spendingCondition, e, $e.Standard);
    case $e.Sponsored:
      return V0(t.spendingCondition, e, $e.Standard);
    default:
      throw new Pc("Invalid origin auth type");
  }
}
function g6(t, e) {
  switch (t.authType) {
    case $e.Standard:
      const n = {
        ...t.spendingCondition,
        fee: pn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case $e.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: pn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function y6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: pn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function w6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: pn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function b6(t, e) {
  const n = {
    ...e,
    nonce: pn(e.nonce, !1),
    fee: pn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function m6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case $e.Standard:
      e.push(Rl(t.spendingCondition));
      break;
    case $e.Sponsored:
      e.push(Rl(t.spendingCondition)), e.push(Rl(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function x6(t) {
  const e = t.readUInt8Enum($e, (r) => {
    throw new Pn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case $e.Standard:
      return n = zl(t), Zw(n);
    case $e.Sponsored:
      n = zl(t);
      const r = zl(t);
      return Qw(n, r);
  }
}
class S6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: pn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? a8, this.postConditionMode = i ?? wo.Deny, this.postConditions = s ?? md([]), o)
      this.anchorMode = d8(o);
    else
      switch (r.payloadType) {
        case _t.Coinbase:
        case _t.CoinbaseToAltRecipient:
        case _t.NakamotoCoinbase:
        case _t.PoisonMicroblock:
        case _t.TenureChange:
          this.anchorMode = Sn.OnChainOnly;
          break;
        case _t.ContractCall:
        case _t.SmartContract:
        case _t.VersionedSmartContract:
        case _t.TokenTransfer:
          this.anchorMode = Sn.Any;
          break;
      }
  }
  signBegin() {
    const e = rf(this);
    return e.auth = q0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = rf(this);
    return e.auth = q0(e.auth), e.txid();
  }
  verifyOrigin() {
    return p6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, $e.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === $e.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, $e.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !ua(n)) {
      const r = Lo(e);
      n.fields.push(to(r ? Se.Compressed : Se.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = u6(n, r, e.fee, e.nonce, s);
    return ua(e) ? e.signature = i : e.fields.push(to(s.data.byteLength === xw ? Se.Compressed : Se.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Sd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != $e.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = b6(this.auth, e);
  }
  setFee(e) {
    this.auth = g6(this.auth, e);
  }
  setNonce(e) {
    this.auth = y6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != $e.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = w6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ei('"version" is undefined');
    if (this.chainId === void 0)
      throw new ei('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ei('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ei('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ei('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return vi(n, this.chainId, 0), e.push(n), e.push(m6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(xd(this.postConditions)), e.push(Ow(this.payload)), _e(e);
  }
}
function Nc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Zo(ye(t.slice(2))) : e = new Zo(ye(t)) : t instanceof Uint8Array ? e = new Zo(t) : e = t;
  const n = e.readUInt8Enum(Bc, (l) => {
    throw new Error(`Could not parse ${l} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = x6(e), i = e.readUInt8Enum(Sn, (l) => {
    throw new Error(`Could not parse ${l} as AnchorMode`);
  }), o = e.readUInt8Enum(wo, (l) => {
    throw new Error(`Could not parse ${l} as PostConditionMode`);
  }), a = Rw(e, ht.PostCondition), c = Ck(e);
  return new S6(n, s, c, a, o, i, r);
}
const E6 = lk, Qo = $r, A6 = _w;
const v6 = /* @__PURE__ */ new Set([4001, -31001]), k6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], $6 = ["result", "data", "payload", "response", "params"], Y0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], wl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Hi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Xr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, I6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Jw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => I6(i, r)) === s
  );
}, tb = (t) => t ? Jw(Hi()).some(
  (e) => {
    var n;
    return e.id === t && (wl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, eb = () => {
  if (typeof window > "u")
    return;
  const t = Hi(), e = Jw(t).filter(
    (n) => {
      var r;
      return wl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Xr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of k6) {
    const r = Xr(t, n) ?? (t === window ? void 0 : Xr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, L6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Hi(), n = Xr(e, t) ?? (e === window ? void 0 : Xr(window, t)) ?? rl(t);
  if (n)
    return n;
  if (wl(t) || tb(t))
    return eb();
}, Wa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, C6 = ["blockstack-session", "blockstack"], T6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of C6) {
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
T6();
const nb = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, _n = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, B6 = (t) => {
  const e = _n(t);
  if (!e)
    return null;
  const n = nb(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, M6 = (t) => {
  const e = _n(t);
  if (!e)
    return null;
  const n = nb(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, sf = (t, e = "mainnet") => {
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
      return sf(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return sf(r, e);
  }
  return e;
}, ui = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, fa = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return no(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = fa(s, e + 1);
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
    const i = fa(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && no(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && no(n.testnet) ? n.testnet.trim() : null;
}, X0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, rb = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && v6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ii = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = _n(n == null ? void 0 : n.message) ?? _n(e.message) ?? _n(e.error) ?? _n(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, So = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ii(e);
    if (e.status === "error")
      throw Ii(e.result ?? e);
  }
  return t;
}, W0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return So(r);
  } catch (r) {
    throw Ii(r);
  }
}, sb = () => eb(), Ad = () => {
  if (typeof window > "u")
    return;
  const t = Hi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Xr(t, e) ?? (t === window ? void 0 : Xr(window, e));
    if (n)
      return n;
  }
}, Z0 = () => {
  if (typeof window > "u")
    return;
  const t = Ad();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Hi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Xr(e, n) ?? (e === window ? void 0 : Xr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, lc = (t) => {
  var r, s;
  const e = wi();
  if (wl(e) || tb(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Hi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === sb();
}, Gl = (t) => {
  const e = M6(t);
  if (!e)
    return null;
  try {
    const n = Nc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Uc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Gl(t), r = B6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? _n(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Uc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Y0)
    if (Gl(s[a])) {
      i = _n(s[a]);
      break;
    }
  const o = _n(s.txId) || _n(s.txid) || _n(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? _n(s.txRaw) ?? void 0
    };
  for (const a of Y0) {
    const c = Gl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: _n(s[a]) ?? void 0
      };
  }
  for (const a of $6) {
    const c = s[a], l = Uc(c, e + 1);
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
}, Kl = (t) => {
  const e = Uc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, _6 = (t) => {
  const e = Uc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, P6 = (t) => ({
  ...t,
  fee: ui(t.fee),
  nonce: ui(t.nonce),
  sponsored: t.sponsored === !0
}), Q0 = (t) => ({
  recipient: t.recipient,
  amount: ui(t.amount) ?? "0",
  memo: t.memo,
  network: sf(t.network),
  address: t.stxAddress,
  fee: ui(t.fee),
  nonce: ui(t.nonce),
  sponsored: t.sponsored ?? !1
}), ib = "WALLET_ADDRESS_MISMATCH", N6 = 45e3;
let Jo = null;
const of = (t) => {
  t && (Jo = { address: t, at: Date.now() });
}, U6 = () => {
  Jo = null;
}, H6 = () => Jo && Date.now() - Jo.at <= N6 ? Jo.address : null, O6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, D6 = async (t) => {
  U6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = So(await t.request("wallet_connect")), n = fa(e);
  return of(n), n;
}, F6 = async (t, e, n, r) => {
  try {
    return So(await t.request(e, n));
  } catch (s) {
    const i = Ii(s);
    if (!O6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await D6(t);
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
        { code: o ? ib : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return So(await t.request(e, n));
    } catch (a) {
      throw Ii(a);
    }
  }
};
let J0 = 3e4;
const j6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${J0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, J0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, R6 = async (t, e, n) => {
  const r = (c, l) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${l}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: ib }
      );
    return c;
  }, s = H6();
  if (s)
    return Wa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Wa(n, "account-read");
  try {
    const c = So(
      await j6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = fa(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (rb(c))
      throw Ii(c);
    Wa(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return of(i), r(i, "wallet_getAccount");
  let o;
  Wa(n, "account-reconnect");
  try {
    o = So(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ii(c);
  }
  const a = fa(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return of(a), r(a, "wallet_connect");
}, z6 = async (t, e) => {
  if (!lc(t)) {
    const i = await W0(
      t,
      "stx_transferStx",
      Q0(e)
    );
    return Kl(i);
  }
  const n = Ad();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await W0(
      n,
      "stx_transferStx",
      Q0(e)
    );
    return Kl(i);
  }
  const r = sb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await R6(r, e.stxAddress);
  const s = await F6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: ui(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: ui(e.fee) } : {}
    },
    e.stxAddress
  );
  return Kl(s);
}, G6 = () => wi(), ob = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = wi(), e = t ? L6(t) : void 0;
  if (e)
    return e;
  const n = Hi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, tp = (t, e) => {
  const n = ob(), r = P6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, _6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Va(r, e);
  if (lc(n) && !Ad()) {
    const s = Z0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: wi(),
        route: "legacy-transaction-request"
      }), Va(r, s);
  }
  return void z6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (X0(s) && lc(n)) {
      const a = Z0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: wi(),
          route: "legacy-transaction-request"
        }), Va(r, a);
        return;
      }
    }
    if (X0(s) && !lc(n)) {
      Va(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), rb(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, K6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), ep = (t) => Vw(t).replace(/^0x/, ""), np = "This wallet cannot sign messages. Try Xverse or Leather.", rp = (t) => typeof (t == null ? void 0 : t.request) == "function", sp = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", V6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, q6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function Y6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: ep(e.message),
    domain: ep(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function X6(t, e) {
  const n = await jv({
    domain: e.domain,
    message: e.message,
    network: fl(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? K6()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function ip(t) {
  var s, i;
  const e = G6() || "", n = /xverse/i.test(e);
  let r = ob();
  if (n && !sp(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (sp(r))
    try {
      return await X6(r, t);
    } catch (o) {
      if (n || !rp(r) || !q6(o)) throw o;
    }
  if (!n && rp(r))
    try {
      return await Y6(r, t);
    } catch (o) {
      throw V6(o) ? new Error(np) : o;
    }
  throw new Error(np);
}
const op = 1000000n, Ns = 1000000n, Hc = 50n, Be = 3000n, lr = 300n, Fo = 3000n, W6 = 50000n, Vl = 200n, bl = 15000n, rn = (t) => t + Hc;
function rr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / op}.${(n % op).toString().padStart(6, "0")}`;
}
function ap(t, e = lr) {
  return t <= Be ? 0 : Number((t - Be) / rn(e));
}
function ql(t, e = 0n) {
  const n = Ns - t - e;
  return n > 0n ? n : 0n;
}
function Z6(t, e = lr) {
  return t > Ns ? "over" : t < Be + rn(e) ? "empty" : t < W6 ? "low" : "ok";
}
const Q6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", J6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", t5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function e5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || t5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== Q6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const ab = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Yl = 3, n5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [af, cb] = ab.split("."), Gn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function cf(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function r5(t) {
  return Gn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Ds(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function lb(t, e = []) {
  const n = await Ds(`/v2/contracts/call-read/${af}/${cb}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: af, arguments: e.map((r) => "0x" + Gn(Te(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Er(Yn(n.result));
}
async function s5() {
  const t = await Ds(`/v2/contracts/source/${af}/${cb}?proof=0`);
  if (typeof t.source != "string" || await r5(t.source) !== J6) throw Error("Deployed source does not match the tested helper.");
  if (e5(await lb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function ub(t) {
  return t.startsWith("SP") && no(t) && !t.includes(".");
}
async function i5(t) {
  var r;
  if (!ub(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Ds(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Ds(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function o5(t) {
  const e = await Ds(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function a5(t, e) {
  var s, i;
  const n = await lb("get-owner", [Qo(t), Qo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !ub(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function c5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: cf(t), signal: AbortSignal.timeout(15e3) });
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
async function l5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function u5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Nc(cf(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ji(Vo(Mc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ji(r.contractAddress) + "." + r.contractName.content !== ab || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Gn(Te(r.functionArgs[0])) !== Gn(Te(Qo(t.core))) || Gn(Te(r.functionArgs[1])) !== Gn(Te(Qo(t.song))) || Gn(Te(r.functionArgs[2])) !== Gn(Te(A6(cf(t.id)))) || t.amount !== "50" || e.postConditionMode !== wo.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== aa.Equal || i.principal.prefix !== 2 || Ji(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ji(r.contractAddress) + "." + r.contractName.content !== n5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Gn(Te(r.functionArgs[0])) !== Gn(Te(Qo(t.song))) || typeof t.liked != "boolean" || Gn(Te(r.functionArgs[1])) !== Gn(Te(E6(t.liked))) || t.amount !== "0" || e.postConditionMode !== wo.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Er(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const f5 = "xtrata.xyz/radio/listening-wallet", d5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Vr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && no(t), h5 = (t) => ({
  domain: $i({ name: Xe(f5), version: Xe("1"), "chain-id": $r(1) }),
  message: $i({
    purpose: Xe(d5),
    main: Xe(t.main),
    listening: Xe(t.listening),
    issued: $r(t.issued)
  })
}), fb = 100000n, p5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function g5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Vr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= fb).sort(p5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Za = 50;
function Oc(t) {
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
async function y5(t, e, n = 4) {
  if (!Vr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Za}&offset=${o}`, s = Oc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Za);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Za ? s : Oc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = g5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Za);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Dr = 50, w5 = 6, b5 = 20, cp = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function lp(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), l = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(l)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: l });
  }
  return { total: n.total, sent: r, rows: s };
}
async function m5(t, e, n) {
  if (!Vr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Oc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Dr}&offset=0`));
    if (!s || s.total > w5 * Dr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Dr; o < s.total; o += Dr) {
      const a = Oc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Dr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (l) => `/extended/v1/address/${t}/transactions?limit=${Dr}&offset=${l}`, a = lp(await e(o(0)), t);
      if (!a || a.total > b5 * Dr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const l of a.sent) i.set(l.txId, l);
      for (let l = Dr; l < a.total; l += Dr) {
        const h = lp(await e(o(l)), t);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const u of h.rows) c.add(u);
        for (const u of h.sent) i.set(u.txId, u);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function x5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((u) => u && typeof u.sender == "string" && u.sender !== e && /^\d+$/.test(u.amount) && BigInt(u.amount) > 0n).sort(cp).map((u, w) => {
    const g = BigInt(u.amount);
    return r && u.sender === r.sender ? { sender: u.sender, left: g, kind: "gift", to: r.payer, at: w } : Vr(u.sender) && g >= fb ? { sender: u.sender, left: g, kind: "deposit", to: u.sender, at: w } : { sender: u.sender, left: g, kind: "dust", to: null, at: w };
  }), i = s.reduce((u, w) => u + w.left, 0n), o = [...t.outgoing].filter((u) => u && u.recipient !== e && Vr(u.recipient) && u.amount > 0n).sort(cp), a = o.reduce((u, w) => u + w.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const l = (u, w) => {
    let g = w;
    for (const A of u) {
      if (g <= 0n) break;
      const v = A.left < g ? A.left : g;
      A.left -= v, g -= v;
    }
    return g;
  };
  for (const u of o) {
    const w = l(s.filter((g) => g.to === u.recipient), u.amount);
    w > 0n && l(s, w);
  }
  if (l(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((u, w) => u + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const u of s) {
    if (u.left <= 0n) continue;
    const w = `${u.kind}:${u.to ?? ""}`, g = h.get(w);
    g ? (g.amount += u.left, g.newest = Math.max(g.newest, u.at)) : h.set(w, { to: u.to, kind: u.kind, amount: u.left, newest: u.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((u, w) => u.newest - w.newest),
    hasTopUp: s.some((u) => u.kind === "deposit")
  };
}
function S5(t, e) {
  const n = t.filter((l) => l.kind === "deposit").sort((l, h) => l.newest - h.newest), r = t.find((l) => l.kind === "gift"), s = t.filter((l) => l.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((l, h) => l + h.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((l, h) => {
    if (l.amount <= e) {
      a.push(l);
      return;
    }
    const u = h === n.length - 1 && !c;
    o.push({ to: l.to, kind: "deposit", mode: u ? "all" : "amount", send: l.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function up(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const uc = [100, 250, 500], E5 = (t, e) => BigInt(t) * rn(e), jo = ["prepared", "signed", "unknown", "pending"], A5 = 30 * 6e4, Dc = 6e4, Ki = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, v5 = 3e3, Fc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Xl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function k5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, l = null, h = !1, u = !1, w = !1, g = null, A = !1, v = "", C = "", U = 0, F, k = null, B, P = [], q, st = -1 / 0;
  const X = /* @__PURE__ */ new Set();
  let V = null, y = !1, $ = 0, M = null, T = null, K = !1, z = null, pt = !1, ct = null, Ut = !1, L = !1, H = !1, ot = !1, St = !1, Et = 0, yt = null, Le = Promise.resolve();
  const At = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? lr.toString()), vt = (p) => !!i && !(i.features ?? []).includes(p), bt = (p, E) => `xtrata.ppp.v1.${p}:${E}`, vn = "xtrata.ppp.v1.as-main", qe = () => {
    if (t.main()) return;
    const p = t.store.get(vn);
    return p && Vr(p) ? p : void 0;
  }, Bt = () => t.main() ?? qe(), on = (p = i == null ? void 0 : i.address) => {
    if (!p) return [];
    try {
      const E = JSON.parse(t.store.get(bt("entries", p)) || "[]");
      return Array.isArray(E) ? E : [];
    } catch {
      return [];
    }
  }, oe = (p) => {
    const E = [p, ...on(p.address).filter((N) => !(N.txid === p.txid && N.kind === p.kind))].slice(0, 200);
    t.store.set(bt("entries", p.address), JSON.stringify(E));
  }, Ft = (p = i == null ? void 0 : i.address) => !!p && t.store.get(bt("on", p)) !== "0", kn = (p) => {
    i != null && i.address && t.store.set(bt("on", i.address), p ? "1" : "0");
  }, Pe = () => on().filter((p) => jo.includes(p.status)), Ze = () => he() ? [...Pe(), ...on(we()).filter((p) => jo.includes(p.status))] : Pe(), Re = () => ze(i == null ? void 0 : i.address), ze = (p) => {
    if (!p) return null;
    try {
      return JSON.parse(t.store.get(bt("deposit", p)) || "null");
    } catch {
      return null;
    }
  }, Ne = (p, E = i == null ? void 0 : i.address) => {
    E && t.store.set(bt("deposit", E), JSON.stringify(p));
  };
  let Zt = null;
  const Qe = (p = Dc) => {
    const E = t.now();
    Zt = { since: Zt && E < Zt.until ? Zt.since : E, until: Math.max((Zt == null ? void 0 : Zt.until) ?? 0, E + p) };
  }, Oe = () => !!Zt && t.now() < Zt.until && (o === void 0 || o < Be + rn(At())), Ee = () => !!Re() || Oe(), we = () => vt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), he = () => !!(i != null && i.address) && we() !== i.address, gn = () => he() ? c && c.for === we() ? c.value : void 0 : o, Xn = (p) => p !== void 0 && p < Be + Vl, I = () => Pe().filter((p) => t.now() - p.created > A5 && X.has(p.txid)), G = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Bt() || r === Bt() && !e.allowed), O = () => G() && !(i != null && i.linked), S = () => {
    const p = Bt();
    return !O() && !!p && !!(i != null && i.linked) && i.linked !== p;
  }, Q = (p) => bt("return-to", p), dt = (p = i == null ? void 0 : i.address) => {
    if (!p) return;
    const E = t.store.get(Q(p));
    return E && Vr(E) && E !== p ? E : void 0;
  }, Qt = (p = i == null ? void 0 : i.address) => V && V.for === p ? V.res : null;
  function ae() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const p = dt();
    if (p) return { to: p, kind: "chosen" };
    const E = Qt();
    if (E != null && E.ok && E.funder) return { to: E.funder, kind: "funder" };
  }
  const Ht = (p) => bt("gift", p);
  function qt() {
    const p = i == null ? void 0 : i.address;
    if (!p) return null;
    if ((z == null ? void 0 : z.for) === p) return z.info;
    try {
      const E = JSON.parse(t.store.get(Ht(p)) || "null");
      return E && typeof E.returnTo == "string" && typeof E.treasury == "string" ? E : null;
    } catch {
      return null;
    }
  }
  async function Yt() {
    var nt;
    const p = i == null ? void 0 : i.address;
    if (!p || !t.giftInfo || !((nt = e == null ? void 0 : e.gifts) != null && nt.enabled) || pt) return;
    const E = (z == null ? void 0 : z.for) === p ? z : null, N = E ? E.ok ? E.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (E && t.now() - E.at < N) return;
    pt = !0;
    const D = qt();
    try {
      const j = await t.giftInfo(p);
      z = { for: p, info: j, ok: !0, at: t.now() }, t.store.set(Ht(p), JSON.stringify(j));
    } catch {
      z = { for: p, info: D, ok: !1, at: t.now() };
    } finally {
      pt = !1;
    }
  }
  const be = () => on().reduce((p, E) => jo.includes(E.status) ? p + BigInt(E.amount || "0") + BigInt(E.fee || "0") : p, 0n);
  function zt() {
    if (o === void 0) return 0;
    const p = o - be() - BigInt(Ae.length) * rn(At());
    return p > 0n ? ap(p, At()) : 0;
  }
  const et = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Xt = "EMPTY — ADD STX TO PLAY";
  function ce() {
    if (!(e != null && e.here)) return null;
    const p = (E, N) => ({ reason: E, text: N });
    switch ($n()) {
      case "connect":
      case "wrong-wallet":
        return p("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return p("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return p("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return p("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return p("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return p("locked", "UNLOCK TO LISTEN");
      case "link":
        return p("link", "FINISH SETUP TO LISTEN");
      case "over":
        return p("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ee() ? p("arriving", "YOUR PLAYS ARE ARRIVING") : p("out", he() ? et : Xt);
      case "ready":
        return !Ft() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? p("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : H ? zt() < 1 ? p("out", he() ? et : Xt) : null : p("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Ue = () => {
    var p;
    return !!(i != null && i.address) && he() && !!((p = qt()) != null && p.player);
  };
  function ue() {
    return Ue() ? { locked: !0, known: !0 } : null;
  }
  const Je = 3 * 6e4, an = () => !!qt() && !!t.history && !(i != null && i.linked);
  async function Wn() {
    const p = i.address, E = qt(), { balance: N, nonce: D } = await t.chain.account(p), nt = await t.history(p, !0);
    if (!nt.ok) return null;
    const j = x5({ self: p, balance: N, inbound: nt.inbound, outgoing: nt.outgoing, gift: { sender: E.treasury, payer: E.returnTo } });
    if (!j.ok) return null;
    const ut = S5(j.parts, Fo);
    return { balance: N, nonce: D, parts: j.parts, steps: ut.steps, tooSmall: ut.tooSmall.length };
  }
  const On = () => Ut ? { state: "unavailable" } : !ct || t.now() - ct.at > Je || o !== void 0 && o !== ct.balance ? { state: "none" } : ct.plan;
  function $n() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const p = Bt();
    if (!O()) {
      if (!p) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : S() ? "wrong-wallet" : i.state === "known" ? "locked" : !O() && i.linked !== p ? "link" : o === void 0 ? "loading" : o > Ns ? "over" : o < Be + rn(At()) ? "fund" : "ready" : "loading";
  }
  const Co = () => {
    var p, E, N, D, nt;
    return {
      step: $n(),
      busy: l,
      message: v,
      error: C,
      notice: In(),
      gate: e,
      main: Bt(),
      mainConnected: !!t.main(),
      standIn: qe(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      unproven: !!(i != null && i.unproven),
      balance: o,
      balanceState: o === void 0 ? void 0 : Z6(o, At()),
      playsLeft: o === void 0 ? 0 : ap(o, At()),
      allowance: o === void 0 ? Ns : ql(o, BigInt(((p = Re()) == null ? void 0 : p.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Ft(),
      entries: on(),
      depositTxid: ((E = Re()) == null ? void 0 : E.txid) ?? F,
      depositPending: Ee(),
      arrival: Ee() ? { since: ((N = Re()) == null ? void 0 : N.at) ?? (Zt == null ? void 0 : Zt.since) ?? t.now(), graceMs: Dc } : null,
      walletOutdated: vt("like"),
      linkedListening: q && q === Bt() ? P.map((j) => j.listening) : [],
      serverLinked: !!k && B === `${Bt()}:${i == null ? void 0 : i.address}`,
      stuck: I().length,
      armed: ot,
      queued: Ae.length,
      solo: O(),
      returnTo: (D = ae()) == null ? void 0 : D.to,
      returnToKind: (nt = ae()) == null ? void 0 : nt.kind,
      funderState: (() => {
        const j = Qt();
        return j ? j.ok ? j.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const j = Qt();
        return !!j && j.ok && j.distinct > 1;
      })(),
      walletCannotSolo: O() && vt("standalone"),
      walletCannotMulti: vt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((j) => j !== Bt() && j !== (i == null ? void 0 : i.linked)),
      creditedTo: O() && (i != null && i.address) && (M == null ? void 0 : M.for) === i.address && M.main ? M.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(bt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (T == null ? void 0 : T.for) === i.address && T.unused,
      gift: (() => {
        const j = qt();
        return j ? { player: j.player, from: j.from, source: j.source, amount: j.amount } : null;
      })(),
      giftPlays: qt() ? zt() : 0,
      playCost: rn(At()),
      giftStop: ce(),
      albumLock: ue(),
      returnPlan: On(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: vt("slots"),
      likeFunds: (() => {
        var J;
        const j = we();
        if (!j || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const ut = gn();
        return { address: j, balance: ut, low: Xn(ut), album: he(), pending: !!ze(j), txid: (J = ze(j)) == null ? void 0 : J.txid, main: Bt() };
      })()
    };
  }, In = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Mt = (p, E = "") => {
    v = p, C = E, t.changed();
  };
  async function De(p, E) {
    if (!l) {
      l = p, C = "", t.changed();
      try {
        await E();
      } catch (N) {
        const D = N instanceof Error ? N.message : String(N);
        C = /Cancelled in the listening wallet/.test(D) ? "" : D, C || (v = "Not now. Nothing was signed.", St = !0);
      } finally {
        l = null, await cn(!0);
      }
    }
  }
  const Fe = () => !!(e != null && e.enabled) && e.here && (O() || !!Bt() && e.allowed), zs = () => Fe() && !S(), Jr = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Dn = () => {
    if (S()) throw new Error(Jr());
  };
  async function Ln() {
    if (!Fe()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const yn = (p) => {
    const E = Bt();
    return p.request("listening.status", E ? { main: E } : void 0);
  };
  async function Fn(p = !1) {
    i != null && i.address && (!p && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Ge(p)));
  }
  async function Ge(p = !1) {
    const E = we();
    if (!(!he() || !E || (i == null ? void 0 : i.state) !== "unlocked") && !(!p && (c == null ? void 0 : c.for) === E && t.now() - c.at < 3e4))
      try {
        c = { for: E, value: await t.chain.balance(E), at: t.now() };
      } catch {
      }
  }
  async function Gs(p) {
    if ((q !== p || t.now() - st >= 6e4) && (P = await t.links(p), q = p, st = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === p) return;
    const E = `${p}:${i.address}`;
    B === E && k || (k = P.find((N) => N.listening === i.address) ?? null, B = E);
  }
  async function To() {
    const p = i == null ? void 0 : i.address;
    if (!O() || !p || i != null && i.linked || !t.funder || y || !o || o <= 0n) return;
    const E = Qt(p);
    if (E != null && E.ok && E.funder) return;
    const N = E != null && E.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, $ - 1), 30 * 6e4);
    if (!(V && V.for === p && t.now() - V.at < N)) {
      y = !0;
      try {
        V = { for: p, res: await t.funder(p), at: t.now() };
      } catch {
        V = { for: p, res: { ok: !1 }, at: t.now() };
      } finally {
        y = !1;
      }
      $ = V.res.ok ? 0 : $ + 1;
    }
  }
  async function Bo() {
    const p = i == null ? void 0 : i.address;
    if (!(!O() || !p || i != null && i.linked || !t.mainOf || K) && !(M && M.for === p && (M.ok || t.now() - M.at < 6e4))) {
      K = !0;
      try {
        M = { for: p, main: await t.mainOf(p), ok: !0, at: t.now() };
      } catch {
        M = { for: p, main: null, ok: !1, at: t.now() };
      } finally {
        K = !1;
      }
    }
  }
  async function Mo() {
    const p = i == null ? void 0 : i.address;
    if (!(!p || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === p) && t.store.get(bt("created", p)) !== "1")
      try {
        T = { for: p, unused: await t.chain.confirmedNonce(p) === 0n };
      } catch {
      }
  }
  async function jn() {
    var nt;
    const p = i == null ? void 0 : i.address;
    if (!p) return !1;
    let E, N = !1;
    const D = /* @__PURE__ */ new Map();
    for (const j of Ze())
      try {
        const ut = await t.chain.transaction(j.txid);
        if (!ut) {
          if (X.add(j.txid), t.now() - j.created > 15 * 6e4 && !D.has(j.address) && D.set(j.address, await t.chain.confirmedNonce(j.address)), E = D.get(j.address), E !== void 0 && E > BigInt(j.nonce)) {
            oe({ ...j, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((j.status === "unknown" || j.status === "signed") && j.raw)
            try {
              await t.chain.broadcast(j.raw, j.txid), oe({ ...j, status: "pending" });
            } catch (at) {
              Ki(at) && oe({ ...j, status: "failed", note: at.message, raw: void 0 });
            }
          continue;
        }
        X.delete(j.txid);
        const J = String(ut.tx_status);
        if (J === "success" && ut.canonical !== !1 && ut.is_unanchored === !1) {
          if (oe({ ...j, status: "confirmed", confirmedAt: t.now(), actualFee: String(ut.fee_rate ?? j.fee), raw: void 0 }), N = !0, j.kind === "like" && (A = !0, j.status !== "confirmed" && typeof j.liked == "boolean"))
            try {
              (nt = t.likeConfirmed) == null || nt.call(t, j.song, j.liked);
            } catch {
            }
        } else J.startsWith("abort_") || J.startsWith("dropped_") ? oe({ ...j, status: "failed", note: J, raw: void 0 }) : j.status !== "pending" && oe({ ...j, status: "pending" });
      } catch {
      }
    for (const j of he() ? [p, we()] : [p]) {
      const ut = ze(j);
      if (ut)
        try {
          const J = await t.chain.transaction(ut.txid), at = String((J == null ? void 0 : J.tx_status) ?? "");
          (at === "success" && J.is_unanchored === !1 || at.startsWith("abort_") || at.startsWith("dropped_") || !J && t.now() - ut.at > 2 * 36e5) && (Ne(null, j), at === "success" && Qe(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return N;
  }
  async function cn(p = !1) {
    var E;
    try {
      const N = Bt();
      if ((p || !e || r !== N || t.now() - n > 3e5) && (e = await t.config(N), n = t.now(), r = N), !e.enabled || !e.here || !O() && (!N || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ot && Ks(), t.changed();
        return;
      }
      await Ln(), i = await yn(s), S() && i.state === "unlocked" && (Ur(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await yn(s)), N && e.allowed && await Gs(N), await Fn(p), await To(), await Bo(), await Mo(), await Yt(), await jn() && await Fn(!0), await Ge(), await Po(), U = 0;
    } catch {
      U++;
    }
    if ($n() === "locked" ? Di() : ot && Ks(), A) {
      A = !1;
      try {
        (E = t.likesChanged) == null || E.call(t);
      } catch {
      }
    }
    t.changed(), Ae.length && !Nr && rs();
  }
  async function _o(p) {
    const E = i == null ? void 0 : i.root;
    if (!E || i != null && i.slot || !(i != null && i.address) || vt("slots")) return;
    const N = Number(t.store.get(bt("slot", E)));
    if (!(!Number.isSafeInteger(N) || N < 1))
      try {
        const { balance: D } = await t.chain.account(i.address);
        if (D >= Be + rn(At())) return;
        await p.request("listening.openSlot", { slot: N }), i = await yn(p), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Oi(p, E) {
    var j;
    Dn();
    const N = !(i != null && i.address) || Ft(i.address), D = i != null && i.linked ? (j = t.nameOf) == null ? void 0 : j.call(t, i.linked) : void 0;
    await p.request("listening.unlock", { mode: "unlock", terms: N ? ts() : void 0, anyPasskey: E, ...Bt() ? { main: Bt() } : {}, ...D ? { label: D } : {} }), i = await yn(p), N && (Ft(i.address) ? await Mr() : await p.request("listening.stop")), await _o(p), Mt(N ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const nt = g;
    g = null, nt && t.now() - nt.at < 12e4 && setTimeout(() => void cn(!0).then(() => x(nt)), 0);
  }
  function Di() {
    ot || l || St || Et >= 3 || !s || !(i != null && i.address) || (ot = !0, Le = (async () => {
      try {
        await Oi(s, !1), Et = 0;
      } catch (p) {
        const E = p instanceof Error ? p.message : String(p);
        /Cancelled in the listening wallet/.test(E) ? yt || (St = !0, Mt("Not now. Nothing was signed.")) : /did not answer/.test(E) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Et++, C = E);
      } finally {
        ot = !1;
        const p = yt;
        yt = null, p ? await p() : await cn(!0);
      }
    })());
  }
  async function Ks(p) {
    ot && (yt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Le), p && await p(), t.changed();
  }
  const ts = () => ({
    fee: At().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ns.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Mr() {
    if (!(i != null && i.address)) return !1;
    if (H || (H = await t.tabLock(i.address)), !H)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function ur(p, E) {
    const N = i.address, { balance: D, nonce: nt } = E ?? await t.chain.account(N);
    o = D;
    const j = await s.request("listening.prepareReturn", {
      mode: p.mode,
      balance: D.toString(),
      nonce: nt.toString(),
      fee: Fo.toString(),
      ...p.amount !== void 0 ? { amount: p.amount.toString() } : {},
      ...p.linked ? {} : { destination: p.to }
    });
    if (j.recipient !== p.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ut = p.mode === "amount" ? p.amount : p.mode === "all" ? D - Fo : D - Ns - Fo, J = Nc(j.raw);
    if (Er(J.payload.recipient).value !== p.to || String(J.payload.amount) !== j.amount || ut !== void 0 && j.amount !== ut.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const at = {
      id: Xl(),
      address: N,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: j.recipient,
      amount: j.amount,
      fee: j.fee,
      nonce: nt.toString(),
      created: t.now(),
      status: "signed",
      raw: j.raw,
      txid: j.txid
    };
    t.validate(at), oe(at);
    try {
      await t.chain.broadcast(j.raw, j.txid), oe({ ...at, status: "pending" });
    } catch (ft) {
      throw oe({ ...at, status: "unknown", note: ft.message }), ft;
    }
    return j;
  }
  const es = bl, fr = Fo;
  async function Vs(p, E, N) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (vt("slots") || vt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const D = i.slot ?? 0;
    if (p === E || ![p, E].includes(D) || ![p, E].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const nt = i.root ?? i.address, j = p === 0 ? nt : i.address, ut = E === 0 ? nt : i.address, { balance: J, nonce: at } = await t.chain.account(j);
    if (J < N + fr + Be) throw new Error(p === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const ft = await s.request("listening.signMove", { from: p, to: E, amount: N.toString(), fee: fr.toString(), nonce: at.toString(), balance: J.toString() }), Jt = Nc(ft.raw);
    if (ft.from !== j || ft.to !== ut || ft.amount !== N.toString() || Er(Jt.payload.recipient).value !== ut || String(Jt.payload.amount) !== N.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const fe = {
      id: Xl(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ut,
      amount: ft.amount,
      fee: ft.fee,
      nonce: at.toString(),
      created: t.now(),
      status: "signed",
      raw: ft.raw,
      txid: ft.txid
    };
    t.validate(fe), oe(fe);
    try {
      await t.chain.broadcast(ft.raw, ft.txid), oe({ ...fe, status: "pending" });
    } catch (Gt) {
      throw oe({ ...fe, status: "unknown", note: Gt.message }), Gt;
    }
    return Ne({ txid: ft.txid, amount: ft.amount, at: t.now() }, ut), ut === nt && nt !== i.address ? c = null : a = -1 / 0, ft;
  }
  let _r = !1;
  const Fi = /* @__PURE__ */ new Map(), ne = (p) => bt("float", p);
  async function Po() {
    if (_r || (i == null ? void 0 : i.state) !== "unlocked" || !he() || vt("move") || vt("rootLike") || !i.address) return;
    const p = i.address;
    if (t.store.get(ne(p)) === "1") return;
    const E = qt();
    if (!(E != null && E.player) || E.state !== "arrived") return;
    const N = gn();
    if (N === void 0 || o === void 0) return;
    if (!Xn(N)) {
      t.store.set(ne(p), "1");
      return;
    }
    if (ze(we()) || ns() || Ze().length || o < es * 4n + Be + fr) return;
    const D = Fi.get(p);
    if (!(D && (D.n >= 3 || t.now() - D.at < 5 * 6e4))) {
      _r = !0, Fi.set(p, { n: ((D == null ? void 0 : D.n) ?? 0) + 1, at: t.now() });
      try {
        await Vs(i.slot ?? 0, 0, es), t.store.set(ne(p), "1");
      } catch (nt) {
        console.warn("[radio] likes float not sent yet", nt);
      } finally {
        _r = !1;
      }
    }
  }
  async function No(p) {
    if (Pe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (vt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const E = await Wn().catch(() => null);
    if (!E)
      throw ct = null, Ut = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ut = !1, o = E.balance;
    const N = { balance: E.balance, nonce: E.nonce };
    if (p === "excess") {
      const J = up(E.parts) ?? dt();
      if (!J) throw new Error("Choose where to send the excess first.");
      await ur({ mode: "excess", to: J, linked: !1 }, N), ct = null, Mt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const D = E.steps;
    if (!D.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ct && ct.balance === E.balance && t.now() - ct.at <= Je && ct.steps.length === D.length && ct.steps.every((J, at) => J.to === D[at].to && J.mode === D[at].mode && J.send === D[at].send))) {
      ct = {
        at: t.now(),
        balance: E.balance,
        steps: D,
        parts: E.parts,
        plan: { state: "ready", steps: D.map((J) => ({ to: J.to, kind: J.kind, send: J.send.toString() })), kept: E.tooSmall, excess: up(E.parts) }
      }, Mt(D.length > 1 ? `This goes back in ${D.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const j = D[0], ut = j.to ?? dt();
    if (!ut) throw new Error("Choose where to send the rest first.");
    if (j.mode === "amount" && vt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await ur({ mode: j.mode, to: ut, linked: !1, ...j.mode === "amount" ? { amount: j.send } : {} }, N), ct = null, D.length === 1 ? (kn(!1), Mt("Returned ✓ Paying is off.")) : Mt(`Returned ✓ ${D.length - 1} more ${D.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Zn() {
    if (!(i != null && i.unproven)) return;
    const p = await Ln();
    await p.request("listening.prove"), i = await yn(p);
  }
  const Cn = {
    forceRefresh: () => cn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (p) => {
      if (!t.main() && !(p !== null && !Vr(p))) {
        if (p === qe()) return cn(!0);
        t.store.set(vn, p ?? ""), C = "", v = "", o = void 0, a = -1 / 0, c = null, await cn(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (p) => De("Waiting for your passkey…", async () => {
      const E = await Ln();
      await E.request("listening.unlock", { mode: "create", terms: ts(), ...t.main() ? { main: t.main() } : {}, ...p != null && p.quick && !t.main() ? { quick: !0 } : {} }), i = await yn(E), i.address && t.store.set(bt("created", i.address), "1"), kn(!0), Mt(O() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Mr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (p) => {
      p ? Qe() : Zt = null, t.changed();
    },
    giftSent: (p, E) => {
      !(i != null && i.address) || Re() || (Ne({ txid: p, amount: E.toString(), at: t.now() }), a = -1 / 0, z = null, Mt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (p) => {
      if (Dn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (vt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Ln()).request("listening.bindSlot", { slot: p, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (p, E, N, D) => {
      Ne({ txid: N, amount: D.toString(), at: t.now() }, E), z = null, await Cn.openAlbum(p), Mt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (p) => De("Opening…", async () => {
      if (Dn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (vt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || u || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === p) return;
      Ur(), await s.request("listening.openSlot", { slot: p }), i = await yn(s), o = void 0, a = -1 / 0, ct = null, Ut = !1;
      const E = i.root;
      E && p > 0 && t.store.set(bt("slot", E), String(p)), Mt(p === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (p = !1) => {
      const E = () => De("Waiting for your passkey…", async () => Oi(await Ln(), p));
      return ot ? p ? vt("cancel") ? (Mt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Ks(async () => {
        ($n() === "locked" || $n() === "intro") && await E();
      }) : Le : E();
    },
    link: () => De("Sign in your wallet…", async () => {
      Dn();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const E = (await t.links(p)).find((N) => N.listening === i.address);
      if (E)
        await s.request("listening.link", { main: p, issued: E.issued, mainSignature: E.mainSignature });
      else {
        const N = { main: p, listening: i.address, issued: t.now() }, D = await t.signWithMain(p, h5(N)), nt = await s.request("listening.link", { main: p, issued: N.issued, mainSignature: D });
        await t.saveLink({ ...N, mainSignature: D, listeningSignature: nt.listeningSignature }), st = -1 / 0;
      }
      Mt("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => i != null && i.unproven ? (await De("One more passkey check…", Zn), !(i != null && i.unproven)) : !0,
    deposit: () => De("Approve the deposit in your wallet…", async () => {
      Dn(), await Zn();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Re()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Oe()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Fn(!0);
      const E = ql(o ?? 0n);
      if (E <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      F = await t.deposit(p, i.address, E), F && Ne({ txid: F, amount: E.toString(), at: t.now() }), Mt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => De("Approve the top-up in your wallet…", async () => {
      Dn(), await Zn();
      const p = t.main(), E = we();
      if (!p || !E) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ze(E)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const N = await t.chain.balance(E);
      he() ? c = { for: E, value: N, at: t.now() } : (o = N, a = t.now());
      const D = ql(N);
      if (D <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const nt = await t.deposit(p, E, D);
      nt && Ne({ txid: nt, amount: D.toString(), at: t.now() }, E), Mt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (p) => De("Adding plays…", async () => {
      if (Dn(), !he()) throw new Error("Open the album you want to add plays to first.");
      if (!uc.includes(p)) throw new Error("Choose one of the amounts offered.");
      const E = E5(p, At());
      if (h || u || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (Ze().length || Re()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Vs(0, i.slot ?? 0, E), Mt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => De("Confirm in the listening wallet…", async () => {
      if (!zs()) throw new Error("Connect your wallet first.");
      await Mr(), await s.request("listening.approveSession", ts()), kn(!0), Mt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => De("Clearing…", async () => {
      for (const p of I())
        await t.chain.transaction(p.txid) || oe({ ...p, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Mt("Cleared ✓");
    }),
    switchOff: () => De("Switching off…", async () => {
      Ur(), await (s == null ? void 0 : s.request("listening.stop")), kn(!1), Mt("Music support is off. Playback is paused.");
    }),
    lock: () => De("Locking…", async () => {
      Ur(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Mt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (p) => {
      const E = String(p ?? "").trim();
      if (!(i != null && i.address)) return Mt("", "Unlock the listening wallet first.");
      if (!Vr(E)) return Mt("", "Enter a standard mainnet address (it starts with SP).");
      if (E === i.address) return Mt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Q(i.address), E), Mt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Q(i.address), ""), t.changed();
    },
    returnFunds: (p) => De("Check the return in the listening wallet…", async () => {
      if (!zs()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (an()) return No(p);
      const E = ae();
      if (!E) throw new Error(O() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (E.kind !== "linked" && vt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Pe().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await ur({ mode: p, to: E.to, linked: E.kind === "linked" }), p === "all" && kn(!1), Mt(p === "all" ? E.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Ae = [], Pr = 10, ji = 30 * 6e4;
  let Nr = !1;
  const ns = () => h || !!l || u || w, Ur = () => {
    Ae.length && (Ae.length = 0, t.changed());
  };
  async function qs(p) {
    if (!Ae.some((E) => E.id === p.id) && !on().some((E) => E.id === p.id) && (Ae.push({ ...p, at: t.now() }), Ae.length > Pr && Ae.shift()), ns() || Pe().length) {
      const E = Ae.length;
      v = `Queued ${E === 1 ? "this song" : E + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await rs();
  }
  async function rs() {
    if (!Nr) {
      Nr = !0;
      try {
        for (; Ae.length; ) {
          for (; Ae.length && t.now() - Ae[0].at > ji; ) Ae.shift();
          if (!Ae.length || ns() || await f(Ae[0]) === "wait") return;
          Ae.shift();
        }
      } finally {
        Nr = !1, t.changed();
      }
    }
  }
  async function f(p) {
    var E;
    h = !0;
    try {
      await cn();
      const N = $n();
      if (N === "loading") return "wait";
      if (N !== "ready" || !Ft() || !(i != null && i.session) || i.session.playsLeft < 1 || !H) return "done";
      if (Pe().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const D = i.address, { balance: nt, nonce: j } = await t.chain.account(D);
      o = nt, a = t.now();
      const ut = await t.chain.owner(Yl, p.song);
      if (ut === D || ut === Bt()) return "done";
      const J = await s.request("listening.signPlay", {
        core: Yl,
        song: p.song,
        receipt: p.id,
        fee: At().toString(),
        nonce: j.toString(),
        balance: nt.toString()
      }), at = {
        id: p.id,
        address: D,
        kind: "play",
        core: Yl,
        song: p.song,
        recipient: ut,
        amount: "50",
        fee: At().toString(),
        nonce: j.toString(),
        created: t.now(),
        status: "signed",
        raw: J.raw,
        txid: J.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(at), oe(at);
      const ft = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`;
      try {
        await t.chain.broadcast(J.raw, J.txid), oe({ ...at, status: "pending" }), v = `♪ Paid ${ft}`, C = "";
      } catch (Jt) {
        oe({ ...at, status: Ki(Jt) ? "failed" : "unknown", note: Jt.message, ...Ki(Jt) ? { raw: void 0 } : {} }), C = Jt.message;
      }
      return i = await yn(s), "done";
    } catch (N) {
      const D = N instanceof Error ? N.message : "payment unavailable";
      return (E = qt()) != null && E.player ? (v = "Payment is taking a moment: " + D, "wait") : (v = "This song played free: " + D, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function m(p) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes($n()) || vt("like") ? !1 : (x(p), !0);
  }
  async function x(p) {
    const E = p.title ? `“${p.title}”` : `song #${p.song}`, N = (He) => {
      var wn;
      C = He, v = "";
      try {
        (wn = t.likeFailed) == null || wn.call(t, p.song);
      } catch {
      }
      t.changed();
    }, D = he(), nt = $n(), j = Bt(), ut = D && (nt === "fund" || nt === "over") ? "ready" : nt, J = O() ? we() : j;
    if (ut === "locked") {
      g = { ...p, at: t.now() }, Mt(`Unlock to like ${E}. It sends straight after.`);
      return;
    }
    if (ut === "wrong-wallet") return N(Jr());
    if (ut === "link") return N("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (O() && vt("standalone")) return N("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ut === "fund") return N("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (ut === "over") return N("Return the excess first: the listening wallet holds more than 1 STX.");
    if (D) {
      await Ge(!0);
      const He = gn();
      if (Xn(He))
        return t.changed(), N(Fc);
    }
    if (ut !== "ready" || !J) return N("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return N("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!H) return N("Pay-per-play is running in another tab. Like from that tab.");
    const at = on(we()).find((He) => He.kind === "like" && He.song === p.song);
    if (at && jo.includes(at.status))
      return N(`Your last like for ${E} is still on its way. It can change again once it confirms.`);
    if (u) return N("One like at a time: your last one is still being sent.");
    if ((at == null ? void 0 : at.status) === "confirmed" && t.now() - (at.confirmedAt ?? 0) < v5)
      return N(`Your like for ${E} has only just confirmed. Try again in a moment.`);
    let ft;
    w = !0;
    try {
      ft = t.likeState ? (await t.likeState(J, p.song)).by : p.likedBy ?? [];
    } catch {
      ft = p.likedBy;
    } finally {
      w = !1;
    }
    if (!ft) return N(`Could not check ${E} right now. Try the heart again.`);
    const Jt = we(), Gt = ((at == null ? void 0 : at.status) === "confirmed" && typeof at.liked == "boolean" && t.now() - (at.confirmedAt ?? at.created) < 5 * 6e4 ? at.liked : void 0) ?? ft.includes(Jt);
    if (!Gt && ft.some((He) => He !== Jt)) return N(O() ? `${E} was liked from another wallet of yours. Unlike it there.` : `${E} was liked from your main wallet${ft.includes(j) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await d({ song: p.song, liked: !Gt, title: p.title, artist: p.artist });
  }
  async function d(p) {
    var D, nt, j;
    if (u) {
      Mt("Still sending your last like. Try again in a moment.");
      return;
    }
    u = !0;
    const E = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`, N = t.wait ?? ((ut) => new Promise((J) => setTimeout(J, ut)));
    try {
      Mt(`${p.liked ? "Liking" : "Unliking"} ${E}…`);
      const ut = t.now() + 12e4;
      for (; h || (he() ? on(we()).some((Gt) => jo.includes(Gt.status)) : Pe().length); ) {
        if (t.now() > ut) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await N(5e3), await cn(!0);
      }
      if (!he() && $n() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const J = we(), { balance: at, nonce: ft } = await t.chain.account(J);
      if (he() ? c = { for: J, value: at, at: t.now() } : (o = at, a = t.now()), Xn(at)) throw new Error(Fc);
      const Jt = await s.request("listening.signLike", {
        song: p.song,
        liked: p.liked,
        fee: Vl.toString(),
        nonce: ft.toString(),
        balance: at.toString()
      }), fe = {
        id: Xl(),
        address: J,
        kind: "like",
        core: 0,
        song: p.song,
        liked: p.liked,
        recipient: "",
        amount: "0",
        fee: Vl.toString(),
        nonce: ft.toString(),
        created: t.now(),
        status: "signed",
        raw: Jt.raw,
        txid: Jt.txid,
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(fe), oe(fe);
      try {
        await t.chain.broadcast(Jt.raw, Jt.txid), oe({ ...fe, status: "pending" }), v = `${p.liked ? "♥ Liked" : "Unliked"} ${E}`, C = "";
        try {
          (D = t.likeSent) == null || D.call(t, p.song, p.liked);
        } catch {
        }
      } catch (Gt) {
        if (oe({ ...fe, status: Ki(Gt) ? "failed" : "unknown", note: Gt.message, ...Ki(Gt) ? { raw: void 0 } : {} }), C = Gt.message, Ki(Gt)) try {
          (nt = t.likeFailed) == null || nt.call(t, p.song);
        } catch {
        }
      }
      i = await yn(s);
    } catch (ut) {
      C = "Like not sent: " + (ut instanceof Error ? ut.message : "the listening wallet is unavailable");
      try {
        (j = t.likeFailed) == null || j.call(t, p.song);
      } catch {
      }
    } finally {
      u = !1, t.changed(), rs();
    }
  }
  return { snapshot: Co, refresh: cn, onListened: qs, heart: m, toggleLike: x, ...Cn };
}
const db = ["Connect", "Passkey", "Link & fund", "Listen"], hb = ["Passkey", "Add 1 STX", "Listen"], lf = (t) => t ? hb : db;
function $5(t) {
  if (t.solo) return I5(t);
  const e = db.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function I5(t) {
  const e = hb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function L5(t, e) {
  return !e || e.at >= lf(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const C5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function T5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !C5(r.id)));
}
const B5 = {}, M5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, _5 = (t) => {
  const e = B5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, P5 = (t) => `/hiro/${t}`, N5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, U5 = (t) => {
  const e = _5(t);
  if (e)
    return [N5(e)];
  const n = M5[t];
  return typeof window < "u" ? [`${window.location.origin}${P5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, H5 = {}, fp = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, O5 = "xtrata.log.enabled", D5 = "xtrata.log.level", F5 = "xtrata.log.tags", j5 = "xtrata.log.dedupe", Qa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, R5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, z5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, G5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, K5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, V5 = () => {
  const t = H5 ?? {}, e = Qa(O5) ?? t.VITE_LOG_ENABLED, n = Qa(D5) ?? t.VITE_LOG_LEVEL, r = Qa(F5) ?? t.VITE_LOG_TAGS, s = Qa(j5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: R5(e),
    level: z5(n) ?? "warn",
    tags: K5(r),
    dedupe: G5(s)
  };
}, q5 = (t, e, n) => !t.enabled || fp[n] < fp[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Y5 = (t, e, n, r) => {
  const s = V5();
  if (!q5(s, e, t) || W5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, X5 = /* @__PURE__ */ new Set();
let dp = null;
const W5 = (t, e, n, r, s) => (dp !== t && (X5.clear(), dp = t), !1), Z5 = (t, e, n) => Y5("debug", t, e, n), Q5 = {}, J5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, t$ = (t) => {
  const e = Q5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : J5[t];
}, e$ = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, n$ = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return e$.test(n) ? n : null;
}, r$ = (t) => t.replace(/\/+$/, ""), s$ = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), hp = (t) => {
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
}, Vi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, i$ = (t) => {
  var c, l;
  let e;
  try {
    e = Er(s6(t));
  } catch {
    return null;
  }
  const n = Vi(e);
  if (!n || n.success === !1)
    return null;
  const r = Vi(n.value), s = Vi(r == null ? void 0 : r.value), i = Vi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = hp((c = Vi(i.name)) == null ? void 0 : c.value), a = hp((l = Vi(i.namespace)) == null ? void 0 : l.value);
  return !o || !a ? null : n$(`${o}.${a}`);
}, o$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${r$(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Vw(Cw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : i$(i.result);
}, a$ = async (t) => {
  const e = t.address.trim();
  if (!no(e))
    return null;
  const n = t$(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of U5(t.network))
    try {
      return await o$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return Z5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: s$(r)
  }), null;
};
function c$(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((l) => {
      c.pending = !1, l && (c.name = l, e());
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
const pp = Object.freeze({
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
}), gp = Object.freeze({ 139: "melophonic" });
function yp(t, e = "") {
  const n = String(t);
  return Object.hasOwn(pp, n) ? pp[n] : Object.hasOwn(gp, n) ? gp[n] : e;
}
const wp = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function bp(t, e = "") {
  return Object.hasOwn(wp, String(t)) ? wp[String(t)] : e;
}
const pb = 10000n, vd = 1000000n, jc = 3000n, l$ = (t, e) => `${t}#gift=${e}`, u$ = 100, Ro = (t, e = lr) => t <= Be ? 0 : Number((t - Be) / rn(e)), mp = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), gb = "xtrata.xyz/radio/gifts", Wl = u$, f$ = "Create a prefunded Xtrata radio gift batch", d$ = (t) => ({
  domain: $i({ name: Xe(gb), version: Xe("1"), "chain-id": $r(1) }),
  message: $i({
    purpose: Xe(f$),
    creator: Xe(t.creator),
    count: $r(t.count),
    amount: $r(BigInt(t.amount)),
    label: Xe(t.label),
    issued: $r(t.issued),
    ...t.player ? { player: Xe(t.player) } : {}
  })
}), h$ = (t, e, n = lr) => Be + BigInt(t) * rn(n) + (e ? bl : 0n), p$ = (t, e = lr) => Number((vd - Be - (t ? bl : 0n)) / rn(e)), g$ = (t, e) => BigInt(t) * (e + jc);
function y$(t, e, n, r = lr) {
  const s = n ? bl : 0n, i = e > Be + s ? e - Be - s : 0n, o = Number(i / rn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Hc,
    fees: BigInt(o) * r,
    reserve: Be,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jc,
    perCopy: e + jc,
    total: g$(t, e)
  };
}
const w$ = (t) => t >= pb && t <= vd, xp = 40, b$ = "Create an Xtrata radio gift player", m$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function Sp(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && m$.test(t) : !n;
}
function x$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Sp(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Sp(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > xp) throw new Error(`A player holds 1 to ${xp} songs.`);
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
  const r = [...new Set(n)].sort((s, i) => s - i);
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const S$ = (t) => {
  const e = [...new Set(t.explicit ?? [])].sort((n, r) => n - r);
  return Mg(Og(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null, ...e.length ? { explicit: e } : {} }))));
}, E$ = (t) => ({
  domain: $i({ name: Xe(gb), version: Xe("1"), "chain-id": $r(1) }),
  message: $i({
    purpose: Xe(b$),
    admin: Xe(t.admin),
    player: Xe(t.hash),
    issued: $r(t.issued)
  })
}), qr = (t) => t.tracks.filter((e) => !e.hidden), A$ = (t) => t.tracks.find((e) => e.hidden) ?? null, Ep = [300, 500, 1e3], Ap = 1800, Zl = /* @__PURE__ */ new Map();
async function v$(t) {
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
function k$(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Zl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Zl.set(t, { ...a, until: Date.now() + Ap });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Zl.delete(t), s();
      }, Ap + 50);
    }
  }, i;
}
const Gr = (t, e, n, r, s) => k$(t, e, async () => await v$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Qs = "xtrata.radio.gift.incoming.v1", vp = (t) => "xtrata.radio.gift.mine.v1:" + t, kp = (t) => "xtrata.radio.gift.batches.v1:" + t, wt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, mr = (t, e, n = "") => {
  const r = wt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ja = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, zn = (t) => rr(t).replace(/\.?0+$/, "");
function $$(t) {
  let e = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), G = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return G !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), mp(G) ? G : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(t.store.get(Qs) || "null");
      return mp(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Qs, JSON.stringify({ code: i, at: t.now() }));
    let I = 0;
    const G = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (O) => {
      const S = await O.json().catch(() => ({}));
      if (O.status === 404) {
        t.store.set(Qs, null), e = { ...e, error: (S == null ? void 0 : S.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!O.ok) throw new Error("busy");
      const Q = S;
      e = { ...e, view: Q, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(Q.status) && t.store.set(Qs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void G(), n(I++)));
    });
    G();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const I = e == null ? void 0 : e.view;
    return !(I != null && I.player) || !o() ? null : { player: I.player, from: u(I), plays: Ro(BigInt(I.amount)) };
  }, c = () => {
    const I = e == null ? void 0 : e.view;
    return !I || I.player || !o() ? null : { plays: Ro(BigInt(I.amount)), from: I.from ? t.who(I.from) : null };
  }, l = () => {
    const I = e == null ? void 0 : e.code;
    if (!I) return [];
    const G = `${location.origin}${location.pathname}#gift=${I}`;
    return [Gr("gift-pass-on", "Copy the link to pass on", () => G, "primary", t.changed)];
  }, h = () => {
    e = null, t.store.set(Qs, null), t.changed();
  }, u = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let w = {};
  const g = (I) => {
    if (w.box) return w.box;
    const G = wt("div", "", "ppp-gift-check");
    w.box = G;
    const O = () => {
      const S = window.turnstile;
      !S || w.rendered || (w.rendered = !0, S.render(G, { sitekey: I, callback: (Q) => {
        w.token = Q, t.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) O();
    else {
      const S = document.createElement("script");
      S.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", S.async = !0, S.onload = O, document.head.append(S);
    }
    return G;
  }, A = (I) => {
    queueMicrotask(() => void I());
  };
  let v;
  async function C(I) {
    var S, Q, dt, Qt, ae, Ht, qt, Yt, be;
    if (!e || e.claiming || !I.listening) return;
    const G = !!((S = e.view) != null && S.player);
    if (G && !I.root) return;
    e.claiming = !0, e.error = void 0, (Q = t.claiming) == null || Q.call(t, !0), t.changed();
    const O = async (zt) => {
      const et = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: w.token, ...zt })
      });
      return { res: et, r: await et.json().catch(() => ({})) };
    };
    try {
      let zt = 0, et = I.listening, Xt;
      if (G) {
        const ue = Number((dt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : dt.next);
        if (!Number.isSafeInteger(ue) || ue < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        zt = ue;
        for (let Je = 0; ; Je++) {
          const an = await t.album.bind(zt);
          if (et = an.address, Xt = await O({ wallet: et, binding: an }), Xt.res.status === 409 && /just taken/.test(((Qt = Xt.r) == null ? void 0 : Qt.error) || "") && Je < 5) {
            zt += 1;
            continue;
          }
          break;
        }
      } else Xt = await O({ wallet: et });
      const { res: ce, r: Ue } = Xt;
      if (ce.status === 503 && /sending another gift/.test((Ue == null ? void 0 : Ue.error) || "")) {
        e.waiting = !0, (ae = t.claiming) == null || ae.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ce.ok) {
        const ue = String((Ue == null ? void 0 : Ue.error) || "");
        if (ce.status === 404 || ce.status === 410 || ce.status === 409 && /already had a gift|brand-new|already have this album/.test(ue))
          throw t.store.set(Qs, null), new Error(ue || "This gift cannot be opened.");
        if (ce.status === 429 || ce.status === 403 || ce.status === 400 && !/wallet number/i.test(ue)) throw new Error(ue || `Could not open the gift (${ce.status}).`);
        const an = /topping up/.test(ue) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ue) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ue) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(an), { retry: !0, slow: /topping up|not paid for yet/.test(ue) });
      }
      e.done = !0, t.store.set(Qs, null), G ? await t.album.arrived(zt, et, Ue.txid, BigInt(Ue.amount)) : t.giftSent(Ue.txid, BigInt(Ue.amount));
    } catch (zt) {
      const et = zt, Xt = et.name === "TypeError" || et.name === "AbortError" || et.name === "TimeoutError" || /wallet number/i.test(et.message);
      if (et.retry || Xt) {
        const ce = e.tries ?? 0;
        e.tries = ce + 1, e.retry = { text: et.retry ? et.message : "Still sending your gift… the network is slow, trying again." }, (Ht = t.claiming) == null || Ht.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, et.slow ? 6e4 : n(ce));
      } else
        e.error = et.message, (qt = t.claiming) == null || qt.call(t, !1);
      w.token = void 0;
      try {
        (be = (Yt = window.turnstile) == null ? void 0 : Yt.reset) == null || be.call(Yt, w.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let U = null;
  function F(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== I.listening || t.now() - U.at > 3e4) {
      const O = I.listening;
      U = { ...(U == null ? void 0 : U.wallet) === O ? U : {}, wallet: O, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(O)).then((S) => {
        var Q, dt;
        (U == null ? void 0 : U.wallet) === O && (U.state = (Q = S == null ? void 0 : S.gift) == null ? void 0 : Q.state, U.problem = ((dt = S == null ? void 0 : S.gift) == null ? void 0 : dt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const G = wt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return G.title = `Network reply: ${U.problem}`, [G];
  }
  function k(I, G, O = !1) {
    var Ht, qt;
    const S = G.player, Q = BigInt(G.amount), dt = O ? [] : [wt("p", `🎁 ${u(G)} sent you “${S.title}”${S.subtitle ? ` by ${S.subtitle}` : ""}: ${qr(S).length} ${qr(S).length === 1 ? "song" : "songs"} and ${Ro(Q).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (O) return dt;
      if (dt.push(wt("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const Yt = document.createElement("details");
        Yt.className = "ppp-how";
        const be = document.createElement("summary");
        be.textContent = "How does this work?", Yt.append(be, wt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), dt.push(Yt);
      }
      return dt;
    }
    if (I.walletCannotAlbums)
      return dt.push(wt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), dt;
    const ae = (qt = (Ht = I.gate) == null ? void 0 : Ht.gifts) == null ? void 0 : qt.turnstileSiteKey;
    return ae && !w.token ? dt.push(wt("p", "One quick check and it is yours:", "ppp-mute"), g(ae)) : !e.claiming && !e.error && !e.waiting && !e.retry && A(() => C(I)), dt.push(...B(I, "Sending your album…")), dt;
  }
  function B(I, G) {
    const O = [];
    return e.claiming || e.waiting ? O.push(wt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : G, "ppp-cyan")) : e.retry && O.push(wt("p", e.retry.text, "ppp-warn"), mr("Try now", () => {
      clearTimeout(v), e.retry = void 0, C(I);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? O.push(wt("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...l(), mr("Forget this gift link here", h, "quiet")) : e.error && O.push(wt("p", e.error, "ppp-bad"), mr("Try again", () => {
      e.error = void 0, C(I);
    })), O;
  }
  const P = (I) => {
    var G;
    return !!e && !e.done && !e.error && o() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((G = e.view) != null && G.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function q(I, G = {}) {
    var be, zt;
    const O = F(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return O;
    const S = e.view;
    if (e.error && !S) return [wt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!S) return [wt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return O;
    if (S.status === "claimed" || S.status === "claiming") return [wt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(S.status)) return [wt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (S.status === "pending-deposit") return [wt("p", `🎁 ${u(S)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (S.player) return [...k(I, S, !!G.bare), ...O];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [wt("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...l(), mr("Forget this gift link here", h, "quiet")];
    const dt = BigInt(S.amount), Qt = Ro(dt).toLocaleString(), ae = wt(
      "p",
      `🎁 ${u(S)} sent you ${zn(dt)} STX of on-chain music: about ${Qt} paid plays.`,
      "ppp-gift"
    ), Ht = G.bare ? [] : [ae], qt = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, Yt = (zt = (be = I.gate) == null ? void 0 : be.gifts) == null ? void 0 : zt.turnstileSiteKey;
    return qt ? (Yt && !w.token ? Ht.push(wt("p", "One quick check and it is yours:", "ppp-mute"), g(Yt)) : !e.claiming && !e.error && !e.waiting && !e.retry && A(() => C(I)), Ht.push(...B(I, "Sending your gift…"))) : I.step === "intro" ? G.bare || Ht.push(wt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? Ht.push(wt("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...l(), mr("Forget this gift link here", h, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Ht.push(wt("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...l(), mr("Forget this gift link here", h, "quiet")), Ht;
  }
  async function st(I, G, O) {
    var S;
    try {
      const Q = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((S = Q == null ? void 0 : Q.gift) != null && S.returnTo) return { ok: !0, funder: Q.gift.returnTo, txId: Q.gift.txid ?? void 0, amount: Q.gift.amount, distinct: 1 };
    } catch {
      if (O) return { ok: !1 };
    }
    return G();
  }
  const X = wt("div", "", "ppp-gift-fold");
  let V = 250000n, y = "", $ = "";
  const M = (I) => {
    try {
      const G = JSON.parse(t.store.get(vp(I)) || "[]");
      return Array.isArray(G) ? G : [];
    } catch {
      return [];
    }
  }, T = (I, G) => t.store.set(vp(I), JSON.stringify(G.slice(0, 50)));
  async function K(I) {
    const G = M(I);
    for (const O of G)
      if (!(O.view && ["claimed", "refunded", "expired"].includes(O.view.status)))
        try {
          O.view = !O.view || O.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: O.id, ...O.txid ? { txid: O.txid } : {} }) }) : await t.json("/radio/gift?id=" + O.id), O.error = void 0;
        } catch (S) {
          O.error = S.message;
        }
    T(I, G), t.changed();
  }
  async function z(I) {
    if (y) return;
    y = "Starting your gift…", $ = "", t.changed();
    let G = null;
    try {
      G = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: V.toString() }) });
      const O = M(I);
      O.unshift({ id: G.id, code: G.code, amount: V.toString(), at: t.now() }), T(I, O), y = "Approve the gift in your wallet…", t.changed();
      const S = await t.pay(I, G.depositTo, BigInt(G.deposit), G.memo), Q = M(I), dt = Q.find((Qt) => Qt.id === G.id);
      dt && (dt.txid = S, dt.view = { status: "pending-deposit", amount: V.toString(), source: "friend", from: I, label: "", expires: 0 }), T(I, Q), $ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(I);
    } catch (O) {
      $ = O.message || "Not sent.";
    } finally {
      y = "", t.changed();
    }
  }
  const pt = (I) => "xtrata.radio.gift.players.v1:" + I, ct = (I) => {
    try {
      const G = JSON.parse(t.store.get(pt(I)) || "[]");
      return Array.isArray(G) ? G.filter((O) => O && /^[0-9a-f]{16}$/.test(O.id)) : [];
    } catch {
      return [];
    }
  };
  async function Ut(I, G) {
    var O;
    if (!y) {
      y = "Checking the player…", $ = "", t.changed();
      try {
        const S = G.tracks.split(/[\s,]+/).filter(Boolean).map((Yt) => Number(Yt.replace(/^#/, ""))), Q = (G.explicit ?? "").split(/[\s,]+/).map((Yt) => Yt.replace(/^#/, "")).filter(Boolean).map(Number), dt = x$({ title: G.title.trim(), subtitle: G.subtitle.trim(), tracks: S, cover: (O = G.cover) != null && O.trim() ? Number(G.cover.trim().replace(/^#/, "")) : null, ...Q.length ? { explicit: Q } : {} });
        y = "Sign in your wallet…", t.changed();
        const Qt = { admin: I, hash: S$(dt), issued: t.now() }, ae = await t.sign(I, E$(Qt));
        y = "Making the player…", t.changed();
        const Ht = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: dt, request: Qt, signature: ae }) }), qt = ct(I).filter((Yt) => Yt.id !== Ht.id);
        qt.unshift({ id: Ht.id, title: Ht.title, tracks: Ht.tracks }), t.store.set(pt(I), JSON.stringify(qt.slice(0, 30))), $ = `${Ht.existing ? "That player already exists" : "Player made"} ✓ “${Ht.title}” · ${Ht.tracks} songs. Pick it below for a batch.`;
      } catch (S) {
        $ = S.message || "Not made.";
      } finally {
        y = "", t.changed();
      }
    }
  }
  const L = (I, G) => l$(I || location.origin + "/radio.html", G), H = (I) => {
    try {
      const G = JSON.parse(t.store.get(kp(I)) || "[]");
      return Array.isArray(G) ? G.filter((O) => O && /^[0-9a-f]{16}$/.test(O.id) && Array.isArray(O.codes)) : [];
    } catch {
      return [];
    }
  }, ot = (I, G) => t.store.set(kp(I), JSON.stringify(G.slice(0, 20))), St = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, Et = (I, G) => t.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(G) });
  let yt = 0;
  async function Le(I) {
    const G = H(I);
    for (const O of G)
      if (!St(O))
        try {
          O.view = !O.view || O.view.status === "pending-deposit" ? await Et("/radio/gift/batch/confirm", { id: O.id, ...O.txid ? { txid: O.txid } : {} }) : await t.json("/radio/gift/batch?id=" + O.id), O.error = void 0;
        } catch (S) {
          O.error = S.message;
        }
    try {
      const O = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const S of (O == null ? void 0 : O.batches) ?? []) {
        const Q = G.find((dt) => dt.id === S.id);
        if (Q) {
          Q.error || (Q.view = S);
          continue;
        }
        G.push({ id: S.id, codes: [], count: S.count, amount: S.amount, label: S.label, player: S.player, depositTo: "", deposit: S.deposit, memo: S.memo, at: 0, view: S });
      }
    } catch {
    }
    ot(I, G), t.changed();
  }
  async function At(I, G) {
    const O = H(I).find((S) => S.id === G);
    if (!(!O || !O.depositTo || y)) {
      y = "Approve the payment in your wallet…", $ = "", t.changed();
      try {
        const S = await t.pay(I, O.depositTo, BigInt(O.deposit), O.memo), Q = H(I), dt = Q.find((Qt) => Qt.id === G);
        dt && (dt.txid = S), ot(I, Q), $ = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", y = "", Le(I);
      } catch (S) {
        $ = `${/cancel/i.test(S.message) ? "Payment cancelled." : S.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        y = "", t.changed();
      }
    }
  }
  async function vt(I, G, O, S) {
    if (y) return;
    if (!G.ok) {
      $ = G.reason, t.changed();
      return;
    }
    y = "Sign in your wallet…", $ = "", t.changed();
    let Q = null;
    try {
      const dt = { creator: I, count: G.count, amount: G.amount.toString(), label: O, issued: t.now(), ...S ? { player: S } : {} }, Qt = await t.sign(I, d$(dt));
      y = "Making your links…", t.changed(), Q = await Et("/radio/gift/batch", { request: dt, signature: Qt });
      const ae = H(I);
      ae.unshift({ id: Q.id, codes: Q.codes, count: G.count, amount: Q.amount, label: O, player: S ?? null, depositTo: Q.depositTo, deposit: Q.deposit, memo: Q.memo, at: t.now() }), ot(I, ae);
    } catch (dt) {
      $ = dt.message || "Not made.", y = "", t.changed();
      return;
    }
    y = "", t.changed(), await At(I, Q.id);
  }
  function bt() {
    const I = !!Zt.value, G = Qe.value === "max" ? p$(I) : Number(Qe.value), O = h$(G, I), S = Number(Oe.value);
    return !Number.isInteger(S) || S < 1 || S > Wl ? { ok: !1, reason: `Make 1 to ${Wl} copies at a time.`, album: I, plays: G, amount: O, count: S } : w$(O) ? { ok: !0, reason: "", album: I, plays: G, amount: O, count: S, bill: y$(S, O, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: G, amount: O, count: S };
  }
  const vn = () => {
    const I = bt();
    if (!I.ok) return I.reason;
    const G = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${zn(G.holders)} to song holders, ${zn(G.fees)} network fees)${I.album ? `, ${zn(G.float)} for the album’s likes` : ""}, ${zn(G.reserve)} kept so a listener can return what is left, + ${zn(G.sendFee)} to send it = ${zn(G.perCopy)} STX. ${I.count} copies = ${zn(G.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, qe = (I, G) => G.codes.map((O) => L(I, O)), Bt = wt("input");
  Bt.type = "range", Bt.min = String(pb), Bt.max = String(vd), Bt.step = "10000", Bt.value = String(V), Bt.setAttribute("aria-label", "Gift amount");
  const on = wt("p", "", "ppp-gift-amount"), oe = mr("", () => {
    const I = t.main();
    I && z(I);
  }, "primary"), Ft = () => {
    on.textContent = kn(), oe.textContent = `Gift ${zn(V)} STX`;
  };
  Bt.oninput = () => {
    V = BigInt(Bt.value), Ft();
  };
  const kn = () => `${zn(V)} STX · about ${Ro(V).toLocaleString()} paid plays · you pay ${zn(V + jc)} STX with the network fee`;
  Ft();
  const Pe = wt("input");
  Pe.maxLength = 60, Pe.placeholder = "Title, e.g. Proof of Sound", Pe.setAttribute("aria-label", "Player title");
  const Ze = wt("input");
  Ze.maxLength = 80, Ze.placeholder = "Artist (optional)", Ze.setAttribute("aria-label", "Player subtitle");
  const Re = wt("textarea");
  Re.rows = 3, Re.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Re.setAttribute("aria-label", "Songs");
  const ze = wt("input");
  ze.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", ze.setAttribute("aria-label", "Explicit songs");
  const Ne = wt("input");
  Ne.inputMode = "numeric", Ne.placeholder = "Cover inscription number (optional), shown when the album loads", Ne.setAttribute("aria-label", "Cover inscription");
  const Zt = wt("select");
  Zt.setAttribute("aria-label", "Batch album");
  const Qe = wt("select");
  Qe.setAttribute("aria-label", "Plays per copy");
  for (const I of [.../* @__PURE__ */ new Set([50, 100, 250, ...Ep])].sort((G, O) => G - O)) Qe.append(Ja(`${I.toLocaleString()} plays`, String(I)));
  Qe.append(Ja("Max (1 STX)", "max")), Qe.value = String(Ep[0]);
  const Oe = wt("input");
  Oe.type = "number", Oe.min = "1", Oe.max = String(Wl), Oe.value = "10", Oe.setAttribute("aria-label", "Copies");
  const Ee = wt("input");
  Ee.maxLength = 40, Ee.placeholder = "Label, e.g. Opera launch", Ee.setAttribute("aria-label", "Batch label");
  const we = wt("p", "", "ppp-mute"), he = () => {
    we.textContent = vn();
  };
  for (const I of [Zt, Qe, Oe])
    I.oninput = he, I.onchange = he;
  he();
  function gn(I) {
    var Q, dt;
    const G = (Q = I.gate) == null ? void 0 : Q.gifts;
    if (!(G != null && G.enabled) || !G.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const O = t.main(), S = [wt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!O)
      S.push(wt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (G.admin) {
      const Qt = wt("div", "", "ppp-gift-admin"), ae = (zt, et) => {
        const Xt = wt("label", zt);
        return Xt.append(et), Xt;
      }, Ht = ct(O);
      Qt.append(
        wt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Pe,
        Ze,
        Re,
        Ne,
        ze,
        mr("Sign and make player", () => void Ut(O, { title: Pe.value, subtitle: Ze.value, tracks: Re.value, cover: Ne.value, explicit: ze.value }))
      );
      const qt = mr("Sign, pay and make links", () => {
        vt(O, bt(), Ee.value.trim(), Zt.value || void 0);
      });
      qt.disabled = !!y;
      const Yt = Zt.value;
      Zt.replaceChildren(Ja("No album (starter copies)", ""), ...Ht.map((zt) => Ja(`${zt.title} · ${zt.tracks} songs`, zt.id))), Ht.some((zt) => zt.id === Yt) && (Zt.value = Yt), he(), Qt.append(
        wt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        ae("Album ", Zt),
        ae("Plays each ", Qe),
        ae("Copies ", Oe),
        Ee,
        we,
        qt
      ), t.now() - yt > 3e4 && (yt = t.now(), Le(O));
      const be = H(O);
      if (be.length) {
        const zt = wt("ul", "", "ppp-gift-list");
        for (const et of be.slice(0, 10)) {
          const Xt = et.view, ce = Xt == null ? void 0 : Xt.copies, Ue = et.error ? et.error : !Xt || Xt.status === "pending-deposit" ? et.txid ? "payment confirming…" : "waiting for your payment" : `${ce.claimed} of ${Xt.count} claimed${ce.refunding + ce.refunded ? ` · ${ce.refunded} refunded${ce.refunding ? `, ${ce.refunding} on their way` : ""}` : ""}`, ue = wt("li");
          if (ue.append(wt("span", `${et.label || "Batch"} · ${et.count} × ${zn(BigInt(et.amount))} STX`, "t"), wt("span", Ue, "ppp-mute")), !et.txid && et.depositTo && (!Xt || Xt.status === "pending-deposit") && ue.append(mr("Pay now", () => void At(O, et.id), "tiny")), et.codes.length && (Xt == null ? void 0 : Xt.status) === "live") {
            const Je = qe(((dt = I.gate) == null ? void 0 : dt.radioUrl) ?? null, et);
            ue.append(
              Gr("batch-copy:" + et.id, "Copy all links", () => Je.join(`
`), "tiny", t.changed),
              Gr("batch-csv:" + et.id, "Copy as CSV", () => ["copy,link", ...Je.map((an, Wn) => `${Wn + 1},${an}`)].join(`
`), "tiny", t.changed)
            );
          } else et.codes.length || ue.append(wt("span", "links were made on another device", "ppp-mute"));
          zt.append(ue);
        }
        Qt.append(zt);
      }
      S.push(Qt);
    }
    return y && S.push(wt("p", y, "ppp-cyan")), $ && S.push(wt("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), X.replaceChildren(...S), X;
  }
  return { banner: q, funder: st, renderFold: gn, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: P };
}
const I$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function L$(t) {
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
const C$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function T$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = C$(i);
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
function B$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const uf = /* @__PURE__ */ new Set(), kd = (t) => (uf.add(t), () => {
  uf.delete(t);
}), Rc = () => {
  for (const t of [...uf])
    try {
      t();
    } catch {
    }
}, $p = "xtrata:al-thumb:v1:", yb = "-", zo = 96, M$ = 24 * 1024 * 1024, ln = /* @__PURE__ */ new Map(), Ip = /* @__PURE__ */ new Set(), ff = [];
let Ql = !1, Jl;
const zc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem($p + t);
    window.localStorage.setItem($p + t, e);
  } catch {
  }
  return null;
};
function $d(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return e(t);
      const i = new Image(), o = setTimeout(() => e(t), 8e3);
      i.onload = () => {
        clearTimeout(o);
        try {
          const a = Math.min(i.naturalWidth, i.naturalHeight);
          if (!a) return e(t);
          r.width = r.height = zo, s.fillStyle = "#143a40", s.fillRect(0, 0, zo, zo), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, zo, zo), e(r.toDataURL("image/jpeg", 0.82));
        } catch {
          e(t);
        }
      }, i.onerror = () => {
        clearTimeout(o), e(t);
      }, i.src = t;
    } catch {
      e(t);
    }
  });
}
async function _$(t) {
  var c, l, h, u, w;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((l = e.body) == null ? void 0 : l.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((h = e.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const i = (g) => {
    let A = 0;
    for (; ; ) {
      const v = r.slice(A).search(/<img\b/i);
      if (v < 0)
        return r = g ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const C = A + v, U = r.indexOf(">", C);
      if (U < 0)
        return r = r.slice(C), null;
      const F = r.slice(C, U + 1), k = F.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (k) return k[1].replace(/&amp;/g, "&");
      const B = F.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (B) return "/inscription/" + B[1];
      A = U + 1;
    }
  }, o = (w = (u = e.body) == null ? void 0 : u.getReader) == null ? void 0 : w.call(u);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: g, value: A } = await o.read();
    if (g) break;
    s += A.byteLength, r += a.decode(A, { stream: !0 });
    const v = i(!1);
    if (v)
      return await o.cancel(), v;
    if (s > M$)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function P$() {
  if (!Ql) {
    Ql = !0;
    try {
      for (; ff.length; ) {
        const t = ff.shift();
        if (!ln.has(t))
          try {
            const e = await _$(t);
            if (e === null) continue;
            if (!e) {
              ln.set(t, ""), zc(t, yb), Rc();
              continue;
            }
            const n = await $d(e);
            ln.set(t, n), n.startsWith("data:image/jpeg") && zc(t, n), Rc();
          } catch {
          }
      }
    } finally {
      Ql = !1;
    }
  }
}
function wb(t, e) {
  if (e && !ln.get(t) ? (ln.set(t, e), $d(e).then((r) => {
    r !== e && (ln.set(t, r), r.startsWith("data:image/jpeg") && zc(t, r), Rc());
  })) : e === "" && !ln.has(t) && ln.set(t, ""), ln.has(t)) return ln.get(t);
  const n = zc(t);
  if (n != null) {
    const r = n === yb ? "" : n;
    return ln.set(t, r), r;
  }
  return Ip.has(t) || (Ip.add(t), ff.push(t), Jl || (Jl = setTimeout(() => {
    Jl = void 0, P$();
  }, 1200))), "";
}
const tu = /* @__PURE__ */ new Map(), eu = /* @__PURE__ */ new Set();
function df(t) {
  return !t || !Number.isSafeInteger(t) || t < 0 ? "" : tu.has(t) ? tu.get(t) : (eu.has(t) || (eu.add(t), fetch("/inscription/" + t, { signal: AbortSignal.timeout(2e4) }).then(async (e) => {
    var r, s, i, o;
    const n = (e.headers.get("content-type") || "").toLowerCase();
    if (!e.ok)
      throw await ((r = e.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = e.body) == null ? void 0 : s.cancel()), "/inscription/" + t) : n.includes("text/html") ? (((i = (await e.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : i[1]) ?? "").replace(/&amp;/g, "&") : (await ((o = e.body) == null ? void 0 : o.cancel()), "");
  }).then((e) => {
    tu.set(t, e), Rc();
  }).catch(() => {
    eu.delete(t);
  })), "");
}
const qi = 12, N$ = 5e3, en = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Yi = (t, e, n = "") => {
  const r = en("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function U$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", l = !1, h = qi;
  const u = en("div", "", "ppp-shelf-box");
  kd(() => t.changed());
  const w = (M) => "xtrata.radio.shelf.pins.v1:" + M, g = (M) => "xtrata.radio.shelf.recent.v1:" + M, A = (M, T) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? T;
    } catch {
      return T;
    }
  }, v = (M) => new Set(A(w(M), []).filter((T) => Number.isSafeInteger(T))), C = (M) => {
    const T = A(g(M), {}), K = {};
    for (const [z, pt] of Object.entries(T)) Number.isSafeInteger(Number(z)) && typeof pt == "number" && (K[Number(z)] = pt);
    return K;
  };
  async function U(M) {
    if (!s) {
      s = !0, i = !1;
      try {
        const T = [];
        let K = 0, z = 0;
        for (let pt = 0; pt < N$ / 100 + 1; pt++) {
          const ct = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${K}&limit=100`);
          if (T.push(...L$(ct == null ? void 0 : ct.shelf)), z = Number(ct == null ? void 0 : ct.total) || T.length, !(ct != null && ct.next) || !Number.isSafeInteger(ct.next)) break;
          K = ct.next;
        }
        M === e && (n = T, r = z, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const F = () => {
    o = -1 / 0;
  }, k = en("input");
  k.type = "search", k.placeholder = "Search title, artist or #", k.setAttribute("aria-label", "Search your albums"), k.oninput = () => {
    a = k.value, h = qi, t.changed();
  };
  const B = en("select");
  B.setAttribute("aria-label", "Sort albums");
  for (const M of I$) {
    const T = document.createElement("option");
    T.value = M.value, T.textContent = M.label, B.append(T);
  }
  B.onchange = () => {
    c = B.value, h = qi, t.changed();
  };
  const P = Yi("", () => {
    l = !l, h = qi, t.changed();
  }, "tiny"), q = en("div", "", "ppp-shelf-tools");
  q.append(k, B, P);
  const st = en("div"), X = en("div");
  function V(M) {
    const T = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, h = qi), !T || M.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && U(T), !n.length)
      return i ? (X.replaceChildren(en("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Yi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), u.replaceChildren(X), u) : null;
    const K = v(T), z = C(T), pt = T$(n, { query: a, sort: c, pinnedOnly: l, pins: K, recents: z });
    k.value !== a && (k.value = a), B.value = c, P.textContent = l ? "★ Pinned only" : "☆ Pinned only", P.setAttribute("aria-pressed", String(l));
    const ct = [];
    if (M.slot > 0 && ct.push(Yi("← My player", () => t.open(0), "quiet")), !pt.length) ct.push(en("p", "No album matches that.", "ppp-mute"));
    else {
      const Ut = en("ul", "", "ppp-shelf-list");
      for (const L of pt.slice(0, h)) {
        const H = en("li", "", L.slot === M.slot ? "now" : ""), ot = K.has(L.slot), St = Yi(ot ? "★" : "☆", () => {
          const Bt = new Set(K);
          ot ? Bt.delete(L.slot) : Bt.add(L.slot), t.store.set(w(T), JSON.stringify([...Bt])), t.changed();
        }, "tiny");
        St.setAttribute("aria-label", ot ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const Et = [L.player.subtitle, `${qr(L.player).length} ${qr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), yt = L.slot === M.slot, Le = Yi(yt ? "Playing" : "Select", () => {
          t.store.set(g(T), JSON.stringify(B$({ ...z, [L.slot]: t.now() }))), t.open(L.slot);
        }, yt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Le.disabled = yt;
        const At = qr(L.player)[0], vt = L.player.cover ?? (At == null ? void 0 : At.id), bt = vt ? wb(String(vt)) : "", vn = en("span", "", "ppp-shelf-art");
        if (bt) {
          const Bt = document.createElement("img");
          Bt.src = bt, Bt.alt = "", Bt.decoding = "async", vn.append(Bt);
        } else vn.textContent = "💿";
        const qe = en("span", "", "ppp-shelf-txt");
        qe.append(en("span", L.player.title, "t"), en("span", Et, "ppp-mute")), H.append(St, vn, qe, Le), Ut.append(H);
      }
      ct.push(Ut), pt.length > h && ct.push(Yi(`Show more (${pt.length - h} left)`, () => {
        h += qi, t.changed();
      }, "quiet"));
    }
    return i && ct.push(en("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), st.replaceChildren(...ct), u.firstChild !== q && u.replaceChildren(q, st), u;
  }
  return { render: V, invalidate: F, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = C(e), T = [...n].filter((K) => K.player).sort((K, z) => (M[z.slot] ?? 0) - (M[K.slot] ?? 0) || z.slot - K.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const Lp = "http://www.w3.org/2000/svg", H$ = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function hf(t = "", e = !1) {
  const n = document.createElementNS(Lp, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), t && n.setAttribute("class", t);
  for (const [r, s] of H$) {
    const i = document.createElementNS(Lp, "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("fill", e ? "currentColor" : r), i.setAttribute("d", s), n.append(i);
  }
  return n;
}
const Kt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Js = (t, e, n, r = !1) => {
  const s = Kt("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, bb = (t) => t.toLocaleString(), Cp = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, O$ = (t) => t === "gift" || t === "new" ? 1 : t === "arriving" ? 2 : t === "landed" ? 3 : -1;
function mb(t, e) {
  const n = Kt("ol", "al-steps");
  return n.setAttribute("aria-label", e >= t.length ? "All steps done" : `Step ${e + 1} of ${t.length}: ${t[e]}`), t.forEach((r, s) => {
    const i = Kt("li", s < e ? "is-done" : s === e ? "is-now" : "");
    i.append(Kt("i", "", s < e ? "✓" : String(s + 1)), Kt("span", "", r)), n.append(i);
  }), n;
}
function D$() {
  const t = Kt("div", "tier-disc tier-disc--mid");
  return t.dataset.tier = "mystery", t.setAttribute("role", "img"), t.setAttribute("aria-label", "A player waiting to be opened"), t.append(Kt("span", "tier-disc__mark", "?")), t;
}
const F$ = [
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
}, j$ = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${bb(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, R$ = (t) => t ? `Your player holds ${bb(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", z$ = (t) => t ? `You got a ${t.name} player` : Rr.landed.title;
function G$(t, e = !0) {
  const n = Kt("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(Kt("span", "tier-disc__mark", t.mark)), n;
}
function K$(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = Kt("ul", "al-welcome-points");
    for (const [i, o, a] of F$) {
      const c = Kt("li");
      c.title = o;
      const l = Kt("em", "", a);
      l.setAttribute("aria-hidden", "true"), c.append(l, Kt("b", "", i), Kt("span", "", o)), s.append(c);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      var u;
      if (!s) {
        n && !i && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = s.mode, s.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const o = Kt("header", "al-top"), a = Kt("a", "al-brand");
      a.href = "/radio", a.append(hf("al-logo"), Kt("span", "", "Xtrata "), Kt("b", "", "Music")), o.append(a);
      const c = Kt("div", "al-body al-body--welcome"), l = Kt("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        l.append(Kt("p", "al-welcome-wait", Rr.checking));
      else {
        const w = O$(h);
        if (w >= 0 && l.append(mb(h === "new" ? Cp.fresh : Cp.gift, w)), s.tier && (h === "landed" || h === "back" || h === "empty") ? l.append(G$(s.tier)) : h === "gift" || h === "arriving" ? l.append(D$()) : h === "new" && l.append(hf("al-hero-mark")), l.append(Kt("h1", "", h === "landed" ? z$(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : Rr[h].title)), l.append(Kt("p", "", h === "gift" ? j$(s.plays, s.from, s.mystery) : h === "landed" ? R$(s.plays) : Rr[h].body)), (h === "landed" || h === "gift") && l.append(r()), s.status.length) {
          const g = Kt("div", "al-status");
          g.setAttribute("role", "status"), g.append(...s.status), l.append(g);
        }
        if (s.asking) l.append(Kt("p", "al-hint al-hint--ask", Rr.asking));
        else if (h === "gift" || h === "new" || h === "back") {
          const g = Rr[h];
          s.canStart && l.append(Js("al-primary", g.primary, h === "back" ? s.unlock : s.start, s.busy), Kt("p", "al-hint", g.hint)), s.canStart && l.append(Js("al-link", g.returning, s.returning, s.busy)), l.append(Js("al-link", g.full, s.full));
        } else if (h === "landed") {
          if (l.append(Js("al-primary", Rr.landed.primary, s.full)), (u = s.albums) != null && u.length) {
            l.append(Kt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const g of s.albums) {
              const A = Js("al-album", "", g.run);
              if (g.cover) {
                const C = Kt("img", "al-album__art");
                C.src = g.cover, C.alt = "", A.classList.add("al-album--art"), A.append(C);
              }
              const v = Kt("span", "al-album__t");
              v.append(Kt("b", "", g.title), Kt("span", "", g.by)), A.append(v), l.append(A);
            }
          }
        } else h === "empty" && l.append(Js("al-primary", Rr.empty.primary, s.restock), Js("al-link", Rr.empty.full, s.full));
      }
      c.append(l), t.hidden = !1, t.replaceChildren(o, c);
    }
  };
}
const V$ = 20, q$ = ["Album", "Passkey", "Listen"], Ye = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, ve = {
  grid: Ye('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ye('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ye('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ye('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ye('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ye('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ye('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ye('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ye('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ye('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ye('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ye('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ye('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ye('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ye('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ye('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ye('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function W(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const tn = (t, ...e) => W("button", { type: "button", ...t }, ...e), tc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Go = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, Y$ = { music: "My music", device: "This device", gifts: "Albums (admin)" }, X$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Tp(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement;
  function c(y) {
    var M, T, K;
    if (!y || !Number.isSafeInteger(y)) return "";
    const $ = (K = (T = (M = e.radio()) == null ? void 0 : M.getState) == null ? void 0 : T.call(M)) == null ? void 0 : K.albumCover;
    return $ != null && $.url && Number($.tokenId) === y ? $.url : df(y);
  }
  kd(() => V());
  function l(y) {
    var M;
    i = y, y ? a.dataset.sheet = y : delete a.dataset.sheet;
    const $ = document.querySelector(".side");
    if (y && y !== "more") {
      for (const z of X$[y]) {
        const pt = $ == null ? void 0 : $.querySelector(z);
        pt && (pt.open = !0);
      }
      const T = document.getElementById("sheetTitle");
      T && (T.textContent = Y$[y]);
      const K = document.getElementById("sheetExtra");
      K && K.replaceChildren(...y === "music" ? [u()] : []), (M = $ == null ? void 0 : $.scrollTo) == null || M.call($, { top: 0 });
    }
    V();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => l("")), r || document.addEventListener("keydown", (y) => {
    y.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const u = () => tn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    W("span", { class: "al-row-i", html: ve.radio }),
    W("span", { class: "al-row-t" }, W("b", {}, "Xtrata Radio"), W("small", {}, "Every song on-chain · FM, liked, all")),
    W("span", { class: "al-row-go", html: ve.right })
  );
  let w = null, g = !1;
  const A = () => {
    var $;
    const y = e.radio();
    g || !(y != null && y.subscribe) || (g = !0, y.subscribe((M) => {
      w = M, (s == null ? void 0 : s.mode) === "open" && V();
    }), w = (($ = y.getState) == null ? void 0 : $.call(y)) ?? null);
  };
  r || setInterval(() => {
    var T, K;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const y = (K = (T = e.radio()) == null ? void 0 : T.getPosition) == null ? void 0 : K.call(T), $ = t.querySelector(".al-bar > i"), M = t.querySelectorAll(".al-times span");
    !y || !$ || ($.style.width = y.duration ? `${Math.min(100, y.current / y.duration * 100)}%` : "0%", M.length === 2 && (M[0].textContent = tc(y.current || 0), M[1].textContent = y.duration ? tc(y.duration) : "–:––"));
  }, 500);
  let v = "", C = null;
  function U(y, $, M = {}) {
    const T = M.song || c(y.cover), z = [T ? W("img", { src: T, alt: M.song ? "Song artwork" : `${y.title} cover` }) : W("div", { class: "al-cover-fallback" }, W("b", {}, y.title), y.subtitle ? W("span", {}, y.subtitle) : null), M.paused ? W("span", { class: "al-paused" }, W("i", { html: ve.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], pt = "al-cover" + ($ ? "" : " al-cover--small") + (M.paused ? " is-paused" : "");
    return M.flip ? (z.push(W("span", { class: "al-flip", "aria-hidden": "true", html: ve.flip })), tn({ class: pt + " is-flippable", "aria-label": M.flipped ? "Show this song’s artwork" : `Show the ${y.title} cover`, onClick: M.flip }, ...z)) : W("div", { class: pt }, ...z);
  }
  function F(y) {
    return y.plays === null || y.plays === void 0 ? W("span", { class: "al-chip al-chip--quiet" }, y.playsComing ? "Plays on their way…" : "…") : y.plays === 0 ? W("span", { class: "al-chip al-chip--out" }, y.playsComing ? "Plays on their way…" : "No plays left") : W("span", { class: "al-chip" + (y.plays <= V$ ? " al-chip--low" : "") }, `${Go(y.plays, "play", "plays")} left`);
  }
  function k(y) {
    const $ = y.player, M = $.tracks.filter((K) => !K.hidden), T = [];
    return y.step !== void 0 && T.push(mb(q$, y.step)), y.mode === "arrive" && y.from && T.push(W("p", { class: "al-from" }, W("span", { html: ve.gift }), W("span", {}, W("b", {}, y.from), " sent you an album"))), T.push(U($, !0)), T.push(W(
      "div",
      { class: "al-intro" },
      W("h1", {}, $.title),
      $.subtitle ? W("p", { class: "al-artist" }, $.subtitle) : null,
      M.length ? W("p", { class: "al-songline" }, M.map((K) => K.title || `#${K.id}`).join(" · ")) : null,
      W("span", { class: "al-chip" }, [Go(M.length, "song", "songs"), y.offered ? Go(y.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), y.status.length && T.push(W("div", { class: "al-status", role: "status" }, ...y.status)), T.push(W("div", { class: "al-grow" })), y.asking ? T.push(W("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : y.primary && T.push(tn({ class: "al-primary", onClick: y.primary.run, disabled: y.busy }, W("span", { html: ve.playSmall }), y.primary.label)), y.hint && !y.asking && T.push(W("p", { class: "al-hint" }, y.hint)), y.secondary && !y.asking && T.push(tn({ class: "al-link", onClick: y.secondary.run, disabled: y.busy }, y.secondary.label)), T;
  }
  function B(y, $) {
    const { songs: M, current: T, started: K, own: z, out: pt, waiting: ct } = $, Ut = y.player, L = e.radio(), H = [];
    H.push(W("div", { class: "al-listhead" }, W("span", {}, W("b", {}, Ut.title), ` · ${Go(M.length, "song", "songs")}`), F(y)));
    const ot = c(Ut.cover), St = "album:" + Ut.cover;
    ot && !ln.has(St) && (ln.set(St, ot), $d(ot).then((yt) => {
      yt !== ot && (ln.set(St, yt), V());
    }));
    const Et = ot ? ln.get(St) || ot : "";
    return H.push(W("ol", { class: "al-tracks" }, ...M.map((yt, Le) => {
      const At = String(yt.id) === T, vt = wb(String(yt.id), At && K ? z : void 0);
      return W("li", {}, tn(
        { class: "al-track" + (At ? " is-on" : ""), "aria-label": `Play ${yt.title || "#" + yt.id}`, "aria-current": At ? "true" : void 0, disabled: pt || ct, onClick: () => {
          var bt;
          return (bt = L == null ? void 0 : L.playToken) == null ? void 0 : bt.call(L, yt.id);
        } },
        W(
          "span",
          { class: "al-th" + (vt ? "" : " is-blank") },
          vt ? W("img", { src: vt, alt: "", decoding: "async" }) : Et ? W("img", { src: Et, alt: "", decoding: "async" }) : null,
          vt ? null : W("span", { class: "al-n" }, String(Le + 1)),
          At ? W("span", { class: "al-eq", html: ve.eq }) : null
        ),
        W("span", { class: "al-tt" }, yt.title || `#${yt.id}`, yt.explicit ? W("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), H;
  }
  function P(y) {
    var vt;
    const $ = y.player, M = $.tracks.filter((bt) => !bt.hidden), T = e.radio(), K = w == null ? void 0 : w.nowPlaying, z = K && $.tracks.some((bt) => String(bt.id) === String(K.tokenId)) ? String(K.tokenId) : null, pt = z ? $.tracks.find((bt) => String(bt.id) === z) : null, ct = y.plays === 0 && !y.playsComing, Ut = !!y.playsComing && !y.plays, L = !!(w != null && w.playing) && !!z, H = w == null ? void 0 : w.heart, ot = z ? (vt = T == null ? void 0 : T.getPosition) == null ? void 0 : vt.call(T) : null;
    z && (L || ((ot == null ? void 0 : ot.current) ?? 0) > 0.5) && (v = $.id);
    const St = !!z && v === $.id;
    C && C !== z && (C = null);
    const Et = St ? String((K == null ? void 0 : K.cover) || "") : "", yt = !!Et && C === z, At = [U($, !ct, { song: yt ? "" : Et, paused: St && !L, flip: Et ? () => {
      C = C === z ? null : z, V();
    } : void 0, flipped: yt })];
    if (At.push(W(
      "div",
      { class: "al-now" },
      W(
        "div",
        { class: "al-now-t" },
        W("div", { class: "al-song" }, pt ? pt.title || (K == null ? void 0 : K.title) || `#${pt.id}` : $.title),
        W("div", { class: "al-artist" }, pt ? pt.artist || (K == null ? void 0 : K.artist) || $.subtitle : $.subtitle || "Press play")
      ),
      z ? tn({ class: "al-icon" + (H != null && H.liked ? " is-on" : ""), "aria-label": H != null && H.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(H != null && H.liked)), disabled: !!(H != null && H.pending) || !!(H != null && H.locked) || Ut, onClick: () => {
        var bt;
        return (bt = T == null ? void 0 : T.toggleLike) == null ? void 0 : bt.call(T);
      }, html: H != null && H.liked ? ve.heartOn : ve.heart }) : null
    )), ct)
      At.push(W(
        "div",
        { class: "al-out" },
        W("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        W("p", { class: "al-out-t" }, "You've played this album out"),
        W("p", { class: "al-out-s" }, "Add plays to keep listening."),
        q(y, !0)
      ));
    else {
      const bt = ot != null && ot.duration ? Math.min(100, ot.current / ot.duration * 100) : 0;
      At.push(W(
        "div",
        { class: "al-prog" },
        W("div", { class: "al-bar" }, W("i", { style: `width: ${bt}%` })),
        W("div", { class: "al-times" }, W("span", {}, tc((ot == null ? void 0 : ot.current) || 0)), W("span", {}, ot != null && ot.duration ? tc(ot.duration) : "–:––"))
      ));
    }
    return At.push(W(
      "div",
      { class: "al-ctl" + (ct || Ut ? " is-off" : "") },
      tn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ct || Ut, onClick: () => {
        var bt;
        return (bt = T == null ? void 0 : T.prev) == null ? void 0 : bt.call(T);
      }, html: ve.prev }),
      tn({ class: "al-play", "aria-label": L ? "Pause" : "Play", disabled: ct || Ut, onClick: () => {
        var bt;
        return (bt = T == null ? void 0 : T.playPause) == null ? void 0 : bt.call(T);
      }, html: L ? ve.pause : ve.play }),
      tn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ct || Ut, onClick: () => {
        var bt;
        return (bt = T == null ? void 0 : T.next) == null ? void 0 : bt.call(T);
      }, html: ve.next })
    )), y.status.length && At.push(W("div", { class: "al-status", role: "status" }, ...y.status)), At.push(...B(y, { songs: M, current: z, started: St, own: Et, out: ct, waiting: Ut })), At.push(W("div", { class: "al-grow" })), At.push(tn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      W("span", {}, "More ", W("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      W("span", { html: ve.down })
    )), At;
  }
  function q(y, $) {
    const M = W("div", { class: "al-topups" + ($ ? " al-topups--primary" : "") }), T = $ ? [y.topUps[1] ?? y.topUps[0]] : [...y.topUps];
    for (const K of T) {
      const z = y.myPlays !== void 0 && y.myPlays >= K && !y.playsComing && !y.busy;
      M.append(tn({ class: "al-topup", disabled: !z, onClick: () => e.topUp(K) }, $ ? `Add ${K.toLocaleString()} plays` : `+${K.toLocaleString()}`));
    }
    return $ && M.append(tn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), M;
  }
  function st(y) {
    const $ = y.myPlays !== void 0 && y.myPlays >= (y.topUps[0] ?? 0), M = W(
      "div",
      { class: "al-card" },
      W("div", { class: "al-card-h" }, W("b", {}, `Add plays to ${y.player.title}`), W("span", { class: "al-mono" }, y.plays === null || y.plays === void 0 ? "" : `${y.plays.toLocaleString()} left`)),
      q(y, !1),
      W("p", { class: "al-mute al-small" }, y.playsComing ? "Plays are on their way. Add more once they arrive." : y.myPlays === void 0 ? "Checking My player…" : $ ? `Moved from My player · ${Go(y.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !$ && !y.playsComing && y.myPlays !== void 0 ? tn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), T = (z, pt, ct, Ut) => tn(
      { class: "al-row", onClick: Ut },
      W("span", { class: "al-row-i", html: z }),
      W("span", { class: "al-row-t" }, W("b", {}, pt), W("small", {}, ct)),
      W("span", { class: "al-row-go", html: ve.right })
    ), K = W(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      T(ve.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, V();
      }),
      o ? W("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return W(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      W("div", { class: "al-sheet-h" }, W("b", {}, "More"), tn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: ve.close })),
      y.mode === "open" ? M : null,
      W(
        "div",
        { class: "al-rows" },
        T(ve.grid, "My music", "Your albums and the radio", () => l("music")),
        T(ve.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        y.canMake ? T(ve.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        T(ve.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        K
      )
    );
  }
  function X(y) {
    var ct, Ut;
    const $ = y.player, M = w == null ? void 0 : w.nowPlaying, T = M && $.tracks.some((L) => String(L.id) === String(M.tokenId)) ? String(M.tokenId) : null, K = !!(w != null && w.playing) && !!T, z = T ? (Ut = (ct = e.radio()) == null ? void 0 : ct.getPosition) == null ? void 0 : Ut.call(ct) : null;
    T && (K || ((z == null ? void 0 : z.current) ?? 0) > 0.5) && (v = $.id);
    const pt = !!T && v === $.id;
    return B(y, {
      songs: $.tracks.filter((L) => !L.hidden),
      current: T,
      started: pt,
      own: pt ? String((M == null ? void 0 : M.cover) || "") : "",
      out: y.plays === 0 && !y.playsComing,
      waiting: !!y.playsComing && !y.plays
    });
  }
  function V() {
    const y = s;
    if (r) {
      if (!y || y.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      A(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...X(y));
      return;
    }
    if (!y) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    A(), t.hidden = !1;
    const $ = W(
      "header",
      { class: "al-top" },
      W("a", { class: "al-brand", href: "/radio" }, hf("al-logo"), "Xtrata ", W("b", {}, "Music")),
      y.mode === "open" ? tn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: ve.grid }) : null
    ), M = W("div", { class: "al-body al-body--" + y.mode }, ...y.mode === "open" ? P(y) : k(y));
    t.replaceChildren($, M, ...i === "more" ? [W("div", { class: "al-scrim", onClick: () => l("") }), st(y)] : []);
  }
  return {
    render(y) {
      if (r) {
        s = y, V();
        return;
      }
      const $ = !!s;
      s = y, !y && ($ || i) && (i = "", delete a.dataset.sheet), y ? a.dataset.view = "album" : delete a.dataset.view, y != null && y.asking ? a.dataset.asking = "1" : delete a.dataset.asking, V();
    },
    sheet: () => i,
    setSheet: l
  };
}
const W$ = [
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
function Z$(t) {
  for (const [e, n] of W$) if (n.test(t)) return e;
  return null;
}
const xb = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Sb = (t) => /Android/.test(t);
function Q$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : xb(e) ? "x-safari-" + n.href : Sb(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const J$ = (t) => xb(t) ? "Safari" : Sb(t) ? "Chrome" : "your browser", Xi = "Xtrata Music Wallet", tI = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Bp(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Xi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const l = t.standIn === c && tI.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Xi} · ${e(c)}`,
      detail: l ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Xi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Xi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Xi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Xi, detail: "Open on this device." });
    }
  return r;
}
const nu = "xtrata.radio.novice", Eb = "xtrata.radio.novice.previewed.v1", Mp = 6 * 6e4;
function eI(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(nu, r), n = r;
    else {
      if (r === "0")
        return e.set(nu, null), { on: !1, preview: !1 };
      n = e.get(nu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const nI = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, _p = (t) => nI.test(t ?? ""), rI = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, sI = {
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
}, iI = (t, e) => sI[t] ?? e;
function oI(t, e) {
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
const aI = "Make your player once, with Face ID or your fingerprint, and the music starts.", cI = "Checking your player…", pf = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Ab(t) {
  try {
    const e = JSON.parse(t.get(Eb) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function lI(t, e) {
  const n = Ab(t).filter((r) => r !== e);
  n.push(e), t.set(Eb, JSON.stringify(n.slice(-50)));
}
function ru(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...pf(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : pf();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > Mp ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > Mp ? { ...t, phase: "done" } : t;
  }
}
const ec = (t) => t.phase === "open" || t.phase === "playing";
function uI(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const fI = [100, 250, 500, 1e3], dI = (t, e = lr) => BigInt(t) * rn(e);
function hI(t, e = lr, n = 0n) {
  const r = Ns - t - n;
  return r > 0n ? Number(r / rn(e)) : 0;
}
function pI(t, e = lr, n = 0n) {
  const r = t === void 0 ? 0 : hI(t, e, n);
  return fI.map((s) => ({ plays: s, stx: dI(s, e), fits: t !== void 0 && s <= r }));
}
const gI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, yI = (t) => gI[t.unit](t.amount), me = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, fc = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function wI(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${fc(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${fc(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${fc(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function bI(t) {
  let e = null, n = 0, r = "stx";
  const s = (o) => {
    var c;
    if (o.some((l) => l.plays === n && l.fits)) return;
    const a = o.filter((l) => l.fits);
    n = ((c = a.find((l) => {
      var h;
      return l.plays === ((h = o[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function i() {
    var g;
    if (!e) return;
    const o = t.input();
    if (!o) {
      e.close();
      return;
    }
    const a = pI(o.balance, o.fee, o.incoming);
    s(a);
    const c = uI(o.switches);
    (g = c.find((A) => A.id === r)) != null && g.on || (r = "stx");
    const l = [], h = me("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", l.push(h), l.push(me("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fc(o.playsLeft, "play", "plays")} left.`));
    const u = wI(o.done);
    if (u && l.push(me("p", "ppp-restock__done", u)), o.arriving)
      l.push(me("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      l.push(me("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((A) => A.fits))
      l.push(me("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const A = me("div", "ppp-restock__packs");
      A.setAttribute("role", "group"), A.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const F = me("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        F.type = "button", F.disabled = !U.fits, F.setAttribute("aria-pressed", String(U.plays === n)), F.append(me("b", "", U.plays.toLocaleString()), me("span", "", "plays")), F.onclick = () => {
          n = U.plays, i();
        }, A.append(F);
      }
      l.push(A);
      const v = me("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const F = me("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        F.type = "button", F.disabled = !U.on, F.setAttribute("aria-pressed", String(U.id === r)), F.append(me("b", "", U.label), me("span", "", U.on ? U.blurb : "Soon")), F.onclick = () => {
          r = U.id, i();
        }, v.append(F);
      }
      l.push(v);
      const C = a.find((U) => U.plays === n);
      if (C && r === "stx") {
        const U = me("div", "ppp-restock__pay"), F = yI({ unit: "microSTX", amount: C.stx }), k = me("p", "ppp-restock__amount");
        k.append("Send ", me("b", "", F), " to your player:"), U.append(k, me("p", "ppp-addr-full ppp-restock__addr", o.address));
        const B = me("div", "ppp-restock__row");
        B.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => rr(C.stx), "")), U.append(B), U.append(me("p", "ppp-restock__note", "From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.")), l.push(U);
      }
    }
    l.push(me("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = me("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => e == null ? void 0 : e.close(), l.push(w), e.replaceChildren(...l);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = me("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
      const o = e;
      o.addEventListener("close", () => {
        o.remove(), e === o && (e = null);
      }), o.addEventListener("click", (a) => {
        a.target === o && o.close();
      }), document.body.appendChild(o), i(), typeof o.showModal == "function" ? o.showModal() : o.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: i,
    close() {
      e == null || e.close();
    }
  };
}
const Yr = (t) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), mI = (t) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
function xI(t, e) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(t) ? t : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = e(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: mI(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function SI(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.artist) continue;
    const r = Yr(n.artist), s = e.get(r);
    s ? s.songs++ : e.set(r, { name: n.artist, songs: 1 });
  }
  return [...e.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function EI(t, e, n = "", r = 60) {
  const s = Yr(e).split(/\s+/).filter(Boolean), i = Yr(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const a of t) {
    const c = Yr(a.artist), l = Yr(a.title), h = String(a.id);
    if (i && c !== i) continue;
    let u = 0, w = !0;
    for (const g of s) {
      const A = g.replace(/^#/, "");
      if (l.includes(g)) u += l.startsWith(g) ? 0 : 1;
      else if (/^\d+$/.test(A) && h === A) u += 0;
      else if (c.includes(g)) u += 2;
      else if (/^\d+$/.test(A) && h.startsWith(A)) u += 3;
      else {
        w = !1;
        break;
      }
    }
    w && o.push({ s: a, rank: u });
  }
  return o.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: o.slice(0, r).map((a) => a.s), total: o.length };
}
const Jn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Pp = 12;
function AI(t, e) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = Jn("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Jn("div", "hint"), l = Jn("div", "find-artists"), h = Jn("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const u = Jn("div", "likesTools");
  u.append(a), t.replaceChildren(u, c, l, h), a.oninput = () => {
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
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", l.replaceChildren(), h.replaceChildren();
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
      const B = Jn("button", "", "Try again");
      B.type = "button", B.onclick = () => {
        r = "idle", w();
      }, c.append(B), l.replaceChildren(), h.replaceChildren();
      return;
    }
    const v = SI(n), C = o ? v : v.slice(0, Pp), U = (B, P, q, st = "") => {
      const X = Jn("button", "find-chip" + (P ? " is-on" : ""), B);
      return X.type = "button", X.setAttribute("aria-pressed", String(P)), st && (X.title = st), X.onclick = q, X;
    };
    l.replaceChildren(
      ...C.map((B) => U(`${B.name} · ${B.songs}`, Yr(B.name) === Yr(i), () => {
        i = Yr(B.name) === Yr(i) ? "" : B.name, g();
      }, `Show ${B.name}’s ${B.songs === 1 ? "song" : `${B.songs} songs`}`)),
      ...v.length > Pp ? [U(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, g();
      })] : []
    );
    const F = EI(n, s, i), k = e.current();
    h.replaceChildren(...F.songs.map((B) => {
      var st;
      const P = Jn("li", "lrow" + (B.id === k ? " now" : "")), q = Jn("button", "lt", B.title);
      if (q.type = "button", q.title = `Play “${B.title}”${B.artist ? ` by ${B.artist}` : ""}`, q.onclick = () => e.play(B.id), (st = e.explicit) != null && st.call(e, B.id)) {
        const X = Jn("span", "exp", "E");
        X.title = "Explicit lyrics: only plays when you choose it", q.append(" ", X);
      }
      return P.append(q, Jn("span", "find-by", `${B.artist ? B.artist + " · " : ""}#${B.id}`)), P;
    })), c.textContent = !s.trim() && !i ? `${n.length.toLocaleString()} songs by ${v.length.toLocaleString()} artists. Search, or pick an artist.` : F.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : F.total > F.songs.length ? `Showing ${F.songs.length} of ${F.total.toLocaleString()}. Type more to narrow it down.` : `${F.total} ${F.total === 1 ? "song" : "songs"}${i ? ` by ${i}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: g };
}
const ta = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], vI = (t) => typeof t == "string" && ta.some((e) => e.id === t), kI = (t) => ta.find((e) => e.id === t), $I = (t) => ta.find((e) => t >= e.min) ?? ta[ta.length - 1];
function II(t, e = lr) {
  return $I(t <= Be ? 0 : Number((t - Be) / rn(e)));
}
const Np = document.getElementById("ppp");
Np && LI(Np);
function LI(t) {
  var rs;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Wb(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, m) => {
    const x = await fetch(f, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), d = await x.json().catch(() => ({}));
    if (!x.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${x.status}).`);
    return d;
  }, c = k5({
    now: Date.now,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    config: (f) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(f || "")),
    links: async (f) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(f))).links ?? [],
    mainOf: async (f) => {
      var x;
      const m = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(f))).links;
      return ((x = m == null ? void 0 : m.find((d) => d.listening === f)) == null ? void 0 : x.main) ?? null;
    },
    saveLink: async (f) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    },
    bridge: async (f) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${f}; publickey-credentials-create ${f}`), o.referrerPolicy = "no-referrer";
      const m = new Promise((E, N) => {
        o.addEventListener("load", () => E(), { once: !0 }), setTimeout(() => N(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = f + "/", i.replaceChildren(o), await m;
      const x = new jb({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.approveSession", "listening.prepareReturn"]), p = (E, N) => d.has(E) ? x.request(E, N) : Promise.race([
        x.request(E, N),
        new Promise((D, nt) => setTimeout(() => nt(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await p("listening.status"), { request: p };
    },
    chain: {
      verify: s5,
      balance: o5,
      account: i5,
      owner: a5,
      broadcast: c5,
      transaction: l5,
      confirmedNonce: async (f) => {
        const m = await Ds(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (f, m) => ip({ ...m, network: "mainnet", stxAddress: f }),
    deposit: (f, m, x) => new Promise((d, p) => tp({
      recipient: m,
      amount: x.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new su(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (E) => d(E.txId || ""),
      onCancel: () => p(new Error("Deposit cancelled. Nothing was sent.")),
      onError: p
    })),
    validate: u5,
    tabLock: (f) => new Promise((m) => {
      const x = navigator.locks;
      if (!(x != null && x.request)) {
        m(!0);
        return;
      }
      x.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (d) => {
        m(!!d), d && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    changed: () => ne(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var m, x;
      return l.funder(f, () => y5(f, Ds), !!((x = (m = c.snapshot().gate) == null ? void 0 : m.gifts) != null && x.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const m = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), x = m == null ? void 0 : m.gift;
      if (!x) return null;
      if (typeof x.returnTo != "string" || typeof x.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: x.returnTo, from: typeof x.from == "string" ? x.from : null, source: String(x.source ?? ""), amount: String(x.amount ?? "0"), treasury: x.treasury, state: x.state === "sending" ? "sending" : "arrived", player: x.player ?? null };
    },
    history: (f, m) => m5(f, (x) => Ds(x), m),
    likesChanged: () => {
      var f, m;
      (m = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || m.call(f);
    },
    likeState: async (f, m) => {
      const x = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(m) })), d = Array.isArray(x == null ? void 0 : x.rows) ? x.rows.find((p) => (p == null ? void 0 : p.id) === m) : null;
      if (!d || typeof d.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: d.liked, by: Array.isArray(d.by) ? d.by.filter((p) => typeof p == "string") : d.liked ? [f] : [] };
    },
    likeSent: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: m } })),
    nameOf: (f) => Yt(f) ?? void 0,
    likeConfirmed: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: m } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), l = $$({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, m, x, d) => new Promise((p, E) => tp({
      recipient: m,
      amount: x.toString(),
      memo: d,
      stxAddress: f,
      network: new su(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (N) => p(N.txId || ""),
      onCancel: () => E(new Error("Gift cancelled. Nothing was sent.")),
      onError: E
    })),
    sign: (f, m) => ip({ ...m, network: "mainnet", stxAddress: f }),
    giftSent: (f, m) => c.giftSent(f, m),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, m, x, d) => {
      h.invalidate(), await c.albumArriving(f, m, x, d);
    } },
    who: (f) => et(f),
    changed: () => ne(c.snapshot()),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), h = U$({
    json: a,
    open: (f) => {
      c.openAlbum(f);
    },
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => ne(c.snapshot())
  }), u = {
    get: (f) => {
      try {
        return localStorage.getItem(f);
      } catch {
        return null;
      }
    },
    set: (f, m) => {
      try {
        m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
      } catch {
      }
    }
  }, w = eI(location.search, u);
  w.on && (document.documentElement.dataset.novice = w.preview ? "preview" : "1");
  const g = (f) => w.on && f.solo, A = w.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), v = A ? document.getElementById("album") : null, C = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (f) => void c.topUpAlbum(f),
    openPlayer: () => void c.openAlbum(0)
  }, U = v ? Tp(v, C) : null, F = "xtrata.radio.tier.v1";
  let k = (() => {
    const f = u.get(F);
    return vI(f) ? kI(f) : null;
  })();
  const B = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function P(f) {
    if (f.listening && f.slot === 0 && ["fund", "ready", "over"].includes(f.step)) {
      let p = null;
      try {
        p = f.gift && !f.gift.player ? II(BigInt(f.gift.amount)) : null;
      } catch {
        p = null;
      }
      ((p == null ? void 0 : p.id) ?? null) !== ((k == null ? void 0 : k.id) ?? null) && (k = p, u.set(F, p ? p.id : null));
    }
    const m = document.documentElement;
    k ? m.dataset.tier = k.id : delete m.dataset.tier;
    const x = document.querySelector("#ppp .ppp-head h3");
    if (!x) return;
    let d = x.querySelector(".ppp-tier");
    if (!k) {
      d == null || d.remove();
      return;
    }
    d || (d = S("span", "", "ppp-tier"), x.append(d)), d.dataset.tier = k.id, d.textContent = `${k.mark} ${k.name.toUpperCase()} PLAYER`, d.title = `A ${k.name} player from the Xtrata Music giveaway`;
  }
  const q = w.on && v ? K$(v) : null, st = Date.now();
  let X = !1, V = null, y = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const $ = () => {
    y = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    ne(c.snapshot());
  }, M = (f, m) => {
    var p;
    if (!q || m || y) return null;
    if (!f.gate || f.step === "loading" || (X = !0), !X) return Date.now() - st < 1e4 ? "checking" : null;
    if (!g(f)) return null;
    if (f.step === "intro" || f.step === "unsupported") return l.incomingStarter() ? "gift" : "new";
    if (f.step === "locked") return "back";
    const d = f.slot === 0 && !((p = f.gift) != null && p.player) && !f.entries.some((E) => E.kind === "play");
    return f.step === "fund" && d ? f.depositPending ? "arriving" : "empty" : f.step === "ready" && d && (V === "arriving" || V === "landed") ? "landed" : f.step === "loading" && V !== "checking" ? V : null;
  };
  let T = !1;
  function K(f, m, x = [], d) {
    if (!q) return;
    const p = d !== void 0 ? d : M(f, m);
    if (V = p, delete document.documentElement.dataset.noviceBoot, !p) {
      q.render(null, m);
      return;
    }
    const E = [...x];
    p === "arriving" && f.arrival && E.push(es(f.arrival)), f.step === "unsupported" ? E.push(S("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && E.push(S("p", f.error, "ppp-warn"));
    const N = p === "gift" ? l.incomingStarter() : null;
    N && !T && f.step === "intro" && !f.busy && !f.armed && !f.error && !be && (T = !0, c.create({ quick: !0 })), q.render({
      mode: p,
      status: E,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !be,
      plays: N ? N.plays : p === "landed" ? f.playsLeft : null,
      from: (N == null ? void 0 : N.from) ?? null,
      tier: k,
      mystery: B,
      albums: p === "landed" ? vt.map((D) => ({ title: D.title, by: D.subtitle, cover: df(D.cover), run: () => {
        $(), oe(D, !0);
      } })) : [],
      start: () => void c.create({ quick: !!l.incomingStarter() }),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => ct(),
      full: () => {
        var j, ut, J;
        const D = window.XtrataRadio, nt = p === "landed" && !((ut = (j = D == null ? void 0 : D.getState) == null ? void 0 : j.call(D)) != null && ut.playing);
        $(), nt && ((J = D == null ? void 0 : D.playPause) == null || J.call(D));
      }
    });
  }
  q && setTimeout(() => {
    X || ne(c.snapshot());
  }, 10100), kd(() => {
    (q != null && q.showing() || document.documentElement.dataset.asking) && ne(c.snapshot());
  });
  const pt = bI({
    input: () => {
      var p, E, N, D;
      const f = c.snapshot();
      if (!["fund", "ready", "over"].includes(f.step)) return null;
      const m = f.slot === 0 ? { address: f.listening, balance: f.balance } : { address: f.root, balance: (p = f.likeFunds) == null ? void 0 : p.balance };
      if (!m.address) return null;
      const x = f.slot === 0 ? f.entries : [], d = x.filter((nt) => nt.kind === "play" && nt.status === "confirmed");
      return {
        playsLeft: m.balance === void 0 ? null : Xn(m.balance),
        balance: m.balance,
        incoming: 0n,
        fee: BigInt(((E = f.gate) == null ? void 0 : E.limits.playFee) ?? "300"),
        address: m.address,
        switches: ((N = f.gate) == null ? void 0 : N.restock) ?? {},
        done: d.length ? { plays: d.length, artists: new Set(d.map((nt) => nt.recipient)).size, likes: x.filter((nt) => nt.kind === "like" && nt.status === "confirmed" && nt.liked).length } : null,
        arriving: f.slot === 0 ? f.depositPending : !!((D = f.likeFunds) != null && D.pending)
      };
    },
    copyButton: (f, m, x, d) => Gr(f, m, x, d, () => {
      ne(c.snapshot());
    })
  }), ct = () => {
    if (!c.snapshot().unproven) {
      pt.open();
      return;
    }
    c.prove().then((f) => {
      f && pt.open();
    });
  }, Ut = document.getElementById("albumList"), L = Ut ? Tp(Ut, C, { list: !0 }) : null, H = "xtrata.radio.album.last.v1", ot = () => {
    try {
      const f = JSON.parse(localStorage.getItem(H) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let St = "";
  const Et = (f) => {
    const m = JSON.stringify(f);
    if (m !== St) {
      St = m;
      try {
        localStorage.setItem(H, m);
      } catch {
      }
    }
  };
  let yt = null;
  window.XtrataRadioLikeHandler = (f) => {
    var x;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (x = c.snapshot().likeFunds) != null && x.album && (Oe = !0), Je();
    const m = an(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let Le;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const At = (f) => {
    var x, d;
    const m = window.XtrataRadioListeningIdentity();
    m !== Le && (Le = m, (d = (x = window.XtrataRadio) == null ? void 0 : x.refreshLikes) == null || d.call(x));
  };
  let vt = [], bt = 0, vn = !1, qe = null;
  const Bt = (f) => {
    var m, x;
    vn || !((x = (m = f.gate) == null ? void 0 : m.gifts) != null && x.enabled) || Date.now() - bt < 6e4 || (bt = Date.now(), a("/radio/gift/featured").then((d) => {
      vt = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((p) => p && typeof p.id == "string" && typeof p.title == "string" && Array.isArray(p.tracks) && p.tracks.length > 0).slice(0, 6), vn = !0, vt.length && ne(c.snapshot());
    }).catch(() => {
    }));
  }, on = (f) => {
    var m;
    return qe && f.slot === 0 && !((m = f.gift) != null && m.player) && ["ready", "fund", "loading"].includes(f.step) ? qe : null;
  }, oe = (f, m = !1) => {
    var d, p;
    qe = f, ne(c.snapshot());
    const x = f && m ? qr(f)[0] : null;
    x && ((p = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || p.call(d, x.id));
  };
  let Ft = pf(), kn = null;
  const Pe = (f) => {
    const m = w.preview && !be && f.step === "intro" ? l.incomingAlbum() : null;
    return m ? (Ft = ru(Ft, { kind: "offer", album: m.player.id, already: Ab(u).includes(m.player.id) }), ec(Ft) ? m.player : null) : (Ft = ru(Ft, { kind: "withdraw" }), null);
  }, Ze = (f) => {
    const m = Ft.phase;
    Ft = ru(Ft, f), Ft.phase !== m && (Ft.album && (Ft.phase === "playing" || Ft.phase === "done") && lI(u, Ft.album), ne(c.snapshot()));
  };
  setInterval(() => {
    Ft.phase === "playing" && Ze({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Re = "", ze, Ne = !1, Zt = !1;
  const Qe = (f, m) => {
    var J, at, ft, Jt, fe, Gt, He, wn;
    const x = window.XtrataRadio;
    if (!(x != null && x.setGiftPlayer) || !(x != null && x.setGiftStop)) return;
    const d = m.depositPending && f.step === "fund" && ((J = f.giftStop) == null ? void 0 : J.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, p = kn, E = d ? g(f) ? iI(d.reason, d.text) : d.text : null, N = p ? null : E ?? (e && (!((at = f.gate) != null && at.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    N && N !== ze && (x.setGiftStop(N), ze = N);
    const D = f.step === "off" || f.step === "elsewhere" ? null : ((ft = f.gift) == null ? void 0 : ft.player) ?? p ?? on(f) ?? null, nt = D ? D.id + ":" + D.cover + ":" + D.tracks.map((Hr) => Hr.id).join(",") : "";
    nt !== Re && (x.setGiftPlayer(D ? { id: D.id, title: D.title, subtitle: D.subtitle, tracks: qr(D).map((Hr) => Hr.id), hidden: ((Jt = A$(D)) == null ? void 0 : Jt.id) ?? null, cover: D.cover } : null), Re = nt), N !== ze && (x.setGiftStop(N), ze = N);
    const j = (d == null ? void 0 : d.reason) === "arriving";
    j !== Zt && ((fe = x.setGiftWait) == null || fe.call(x, j), Zt = j);
    const ut = !!D && (!!p || !!((Gt = f.albumLock) != null && Gt.locked));
    ut !== Ne && ((He = x.setGiftLock) == null || He.call(x, ut), Ne = ut), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((wn = x.forgetWallets) == null || wn.call(x));
  };
  let Oe = !1;
  const Ee = /* @__PURE__ */ new Map(), we = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((d) => d.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let x = Ee.get(f.listening);
    return x === void 0 && (x = Date.now(), Ee.set(f.listening, x)), Date.now() - x < Dc ? x : null;
  }, he = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((m) => m.kind === "play") && !!f.listening && Ee.has(f.listening), gn = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", Xn = (f) => {
    const m = c.snapshot().playCost || 350n;
    return f > Be ? Number((f - Be) / m) : 0;
  }, I = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), G = (f) => {
    const m = Math.round((Date.now() - f) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, O = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, S = (f, m = "", x = "") => {
    const d = document.createElement(f);
    return m && (d.textContent = m), x && (d.className = x), d;
  }, Q = (f, m, x = "") => {
    const d = S("button", f, x);
    return d.type = "button", d.onclick = m, d;
  }, dt = (f, m) => {
    const x = S("a", f);
    return x.href = m, x.target = "_blank", x.rel = "noopener", x;
  };
  let Qt = null, ae = location.hash === "#give";
  ae && history.replaceState(null, "", location.pathname + location.search);
  let Ht = !1;
  const qt = c$((f) => a$({ address: f, network: "mainnet" }), () => ne(c.snapshot())), Yt = (f) => qt.get(f), be = Z$(navigator.userAgent), zt = (f, m) => {
    const x = navigator.userAgent, d = J$(x), p = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, E = [S("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${w.on ? "player" : "listening wallet"}${m ? w.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], N = S("div", "", "ppp-open-row"), D = Q$(p, x);
    if (D) {
      const nt = S("a", `Open in ${d}`, "primary ppp-open-in");
      nt.href = D, nt.dataset.homeAction = "radio:open-in-browser", N.append(nt);
    }
    return N.append(Gr("copy-page-link", "Copy link", () => p, D ? "" : "primary", () => ne(c.snapshot()))), E.push(N, S("p", `If that does not open ${d}, use ${f}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), E;
  }, et = (f) => Yt(f) ?? gn(f), Xt = (f) => f.slice(0, 2).map(et).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), ce = /* @__PURE__ */ new Map();
  let Ue = !1;
  const ue = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), Je = () => {
    Ue || (Ue = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const m of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const x = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(x) && ce.set(x, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      ne(c.snapshot());
    }).catch(() => {
      Ue = !1;
    }));
  }, an = (f, m) => {
    const x = ce.get(f), d = bp(f, [x == null ? void 0 : x.title, m == null ? void 0 : m.title].find((E) => !ue(E)) || ""), p = yp(f, (x == null ? void 0 : x.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: d, artist: p };
  }, Wn = (f) => {
    const { title: m, artist: x } = an(f.song, f);
    return m ? `“${m}”${x ? ` — ${x}` : ""}` : `Song #${f.song}${x ? ` — ${x}` : ""}`;
  }, On = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, $n = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Co(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function In(f, m, x = "", d) {
    const p = S("dt", f), E = S("dd", m, x);
    return d && E.append(" ", d), [p, E];
  }
  const Mt = document.getElementById("ppp-top"), De = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Fe = () => {
    var m;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (m = document.getElementById("radio-wallet-connect")) == null || m.click();
  }, zs = () => {
    var m, x;
    const f = c.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      Fe();
      return;
    }
    if (f.step === "elsewhere" && ((m = f.gate) != null && m.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    if (f.step === "locked" && !f.armed && !f.busy && c.unlock(), f.step === "ready" && ((x = f.giftStop) == null ? void 0 : x.reason) === "off" && !f.busy && c.switchOn(), f.step === "fund" && f.solo && !f.depositPending && !f.busy) {
      ct();
      return;
    }
    De();
  };
  Mt && (Mt.onclick = zs);
  const Jr = (f, m, x, d = "") => f.standIn && !f.mainConnected ? Q(`Connect ${et(f.standIn)} to add STX`, Fe, d) : Q(m, x, d), Dn = (f) => {
    c.useLinked(f).then(() => De());
  };
  let Ln = null;
  const yn = () => {
    const f = Bp(c.snapshot(), et);
    return f.length ? Ln || (Ln = new Promise((m) => {
      var ut;
      const x = S("dialog", "", "ppp-connect");
      x.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const p = (J) => {
        d = J, x.close();
      };
      x.addEventListener("close", () => {
        x.remove(), Ln = null, m(d);
      }), x.addEventListener("click", (J) => {
        J.target === x && p(null);
      });
      const E = (J, at, ft, Jt, fe = !1) => {
        const Gt = S("button", "", "ppp-connect__opt " + ft);
        return Gt.type = "button", Gt.disabled = fe, Gt.onclick = Jt, Gt.append(S("b", J), S("span", at)), Gt;
      }, N = S("h2", "Connect", "ppp-connect__title");
      N.id = "ppp-connect-title";
      const D = f.map((J) => E(J.label, J.detail, "is-music", () => {
        if (p("music"), J.action === "linked" && J.main) {
          Dn(J.main);
          return;
        }
        const at = Bp(c.snapshot(), et).find((ft) => ft.action !== "linked");
        (at == null ? void 0 : at.action) === "create" ? c.create() : (at == null ? void 0 : at.action) === "unlock" && c.unlock(), De();
      }, !!J.disabled)), nt = E("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => p("stacks")), j = Q("Cancel", () => p(null), "quiet ppp-connect__cancel");
      x.append(N, ...D, nt, j), document.body.appendChild(x), x.showModal(), (ut = D.find((J) => !J.disabled)) == null || ut.focus();
    }), Ln) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = yn;
  function Fn(f) {
    if (!Mt) return;
    const m = (d, p, E) => {
      Mt.hidden = !1, Mt.className = "ppp-top" + (p ? " is-" + p : ""), Mt.replaceChildren(S("span", "", "dot"), document.createTextNode(d)), Mt.title = E;
    }, x = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Mt.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Mt.hidden = !0;
        return;
      case "intro":
        return m("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${et(f.linked)}`, "warn", `This device's listening wallet belongs to ${et(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(f.entries.some((d) => d.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return f.payingOn && x > 0 && !f.giftStop ? m(`${x.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Ge = document.getElementById("pppNudge"), Gs = document.getElementById("onair");
  (rs = Ge == null ? void 0 : Ge.querySelector("button")) == null || rs.addEventListener("click", () => zs());
  const To = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Bo = {
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
  function Mo(f) {
    if (f.step === "loading") return;
    const m = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, x = f.step === "ready" && f.payingOn && m > 0 && !f.giftStop, d = f.step === "fund" && f.depositPending, p = f.step === "elsewhere" && !e, E = x || d || p ? "" : To[f.step] ?? "", N = x ? "on" : p ? "free" : E ? "off" : "";
    N ? document.documentElement.dataset.ppp = N : delete document.documentElement.dataset.ppp, Gs && (Gs.hidden = !N || N === "free", Gs.querySelector(".onair-sub").textContent = x ? `${m.toLocaleString()} plays left` : "Plays off"), Ge && (Ge.hidden = N !== "off" && N !== "free", Ge.classList.toggle("is-free", N === "free"), N === "free" ? (Ge.querySelector(".nudge-t").textContent = "You’re on the free player", Ge.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Ge.querySelector("button").textContent = "Get a player") : N === "off" && (Ge.querySelector(".nudge-t").textContent = E, Ge.querySelector(".nudge-s").textContent = g(f) ? f.step === "intro" ? aI : "" : "This radio requires a funded listening wallet with music support on.", Ge.querySelector("button").textContent = Bo[f.step] ?? "Start"));
  }
  let jn = "";
  function cn(f) {
    const m = S("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && m.append(S("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && m.append(S("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const x = S("input");
    x.type = "text", x.placeholder = "SP… address to send returns to", x.autocomplete = "off", x.spellcheck = !1, x.setAttribute("aria-label", "Address to return funds to"), x.value = jn, x.oninput = () => {
      jn = x.value;
    };
    const d = Q(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(x.value), jn = "";
    }, "tiny");
    return m.append(x, " ", d), f.returnToKind === "chosen" && m.append(" ", Q("Back to the funder", () => c.clearReturnAddress(), "tiny")), m;
  }
  const _o = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Oi() {
    const f = S("p", _o + " ", "ppp-mute");
    return f.append(dt("Xverse", "https://www.xverse.app/download"), " · ", dt("Leather", "https://leather.io/install-extension")), f;
  }
  let Di = "";
  const Ks = (f) => {
    const m = document.documentElement, x = f.solo && !f.main ? f.listening ? gn(f.listening) : "new" : "", d = T5() ? "1" : "", p = f.standIn && !f.mainConnected ? et(f.standIn) : "";
    `${x}|${d}|${p}` !== Di && (Di = `${x}|${d}|${p}`, x ? m.dataset.pppSolo = x : delete m.dataset.pppSolo, p ? m.dataset.pppAs = p : delete m.dataset.pppAs, d ? m.dataset.pppWalletInstalled = d : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => ne(c.snapshot()), f);
  function ts(f, m = "") {
    const x = S("div", "", "ppp-topup"), d = Mr(f);
    x.append(S("span", "Add plays from My player: ", "ppp-mute"));
    for (const p of uc) {
      const E = Q(`+${p.toLocaleString()}`, () => void c.topUpAlbum(p), m);
      E.disabled = d === void 0 || d < p || f.depositPending || !!f.busy, x.append(E);
    }
    return d !== void 0 && d < uc[0] && x.append(S("p", "My player needs plays first (switch to My player above).", "ppp-mute")), x;
  }
  const Mr = (f) => {
    var d;
    const m = (d = f.likeFunds) == null ? void 0 : d.balance;
    if (m === void 0 || !f.playCost) return;
    const x = m - Be - 6000n;
    return x > 0n ? Number(x / f.playCost) : 0;
  };
  function ur(f) {
    const m = f.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    if (m.low || (Oe = !1), m.low && !Oe) return [];
    const x = S("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      if (!m.txid) return [];
      const p = S("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return m.txid && p.append(dt("View", O(m.txid))), x.append(p), [x];
    }
    x.append(S("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), x.append(S("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), x.append(S("p", m.address, "ppp-addr-full"));
    const d = S("div", "", "ppp-open-row");
    if (d.append(Gr("copy-likes-address", "Copy address", () => m.address, "primary", () => ne(c.snapshot()))), m.main && !f.solo) {
      const p = Ns - (m.balance ?? 0n);
      p > 0n && d.append(Jr(f, `Pay ${rr(p)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return x.append(d), x.append(S("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [x];
  }
  const es = (f) => {
    const m = S("div", "", "ppp-wait");
    m.dataset.since = String(f.since), m.dataset.grace = String(f.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const x = S("p", "", "ppp-wait-t"), d = S("div", "", "ppp-wait-track");
    return d.append(S("div", "", "ppp-wait-fill")), m.append(x, d), fr(m), m;
  };
  function fr(f) {
    const m = Number(f.dataset.since), x = Number(f.dataset.grace) || 6e4, d = Math.max(0, Date.now() - m), p = f.querySelector(".ppp-wait-fill"), E = f.querySelector(".ppp-wait-t");
    if (d < x) {
      const N = Math.ceil((x - d) / 1e3);
      p.style.width = Math.max(4, Math.min(95, d / x * 100)).toFixed(0) + "%", E.textContent = `Your plays are arriving… usually about a minute · ${N}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(d / x * 100)));
    } else
      p.style.width = "", E.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let Vs = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      Vs = 0;
      return;
    }
    f.forEach(fr), ++Vs % 10 === 0 && ne(c.snapshot());
  }, 1e3);
  let _r = null;
  function Fi(f) {
    if (f.step === "loading" && _r !== null) return;
    const x = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!l.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    x !== _r && (_r = x, x ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function ne(f) {
    var Bd, Md, _d, Pd, Nd, Ud, Hd, Od, Dd, Fd, jd, Rd, zd, Gd, Kd, Vd;
    if (yt && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const Y = yt;
      yt = null, f.root === Y.root && f.slot !== Y.slot && c.openAlbum(Y.slot);
    }
    const m = l.inProgress(f), x = we(f), d = m && f.step === "fund" ? { ...f, depositPending: !0 } : x !== null ? { ...f, depositPending: !0, arrival: { since: x, graceMs: Dc } } : f, p = d.error === Fc;
    if (At(), Bt(f), P(f), kn = Pe(f), Qe(f, d), Fi(d), Ks(d), !m && l.inProgress(f)) return;
    if (Fn(d), Mo(d), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? w.on ? cI : "Checking your listening wallet…" : w.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = d.step === "off", t.hidden) {
      K(d, !1);
      return;
    }
    const [E, N] = Co(d), D = s(".ppp-state");
    D.textContent = E, D.className = "ppp-state" + (N ? " ppp-state--" + N : ""), D.hidden = !E;
    const nt = !!d.busy || d.armed, j = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (nt || !["intro", "loading"].includes(d.step));
    i.hidden = !j, i.classList.toggle("ppp-frame--rest", !nt && !Ht);
    const ut = s(".ppp-frame-label");
    ut.hidden = !0;
    const J = $5(d) ?? Qt;
    Qt = J;
    const at = "xtrata.radio.ppp.heard.v1", ft = (() => {
      try {
        return localStorage.getItem(at) === "1";
      } catch {
        return !1;
      }
    })();
    if (!ft && d.entries.some((Y) => Y.kind === "play"))
      try {
        localStorage.setItem(at, "1");
      } catch {
      }
    const Jt = ft || d.slot > 0 && ((((Bd = d.likeFunds) == null ? void 0 : Bd.balance) ?? 0n) > 0n || h.count() > 1), fe = g(d), Gt = !fe && L5({ ...d, heard: Jt }, J);
    s(".ppp-badge").hidden = !Gt;
    const He = s(".ppp-steps"), wn = s(".ppp-stage");
    He.hidden = wn.hidden = !Gt, J && Gt && (He.replaceChildren(...lf(d.solo).map((Y, tt) => {
      const xt = S("li", "", tt < J.at ? "done" : tt === J.at ? J.blocked ? "now blocked" : "now" : "");
      return xt.append(S("span", tt < J.at ? "✓" : String(tt + 1), "n"), Y), tt === J.at && xt.setAttribute("aria-current", "step"), xt;
    })), wn.textContent = J.caption, wn.className = "ppp-stage " + (J.at >= lf(d.solo).length ? "ppp-ok" : J.blocked ? "ppp-bad" : "ppp-cyan"));
    const Hr = s(".ppp-facts"), bn = [];
    d.main && ((Md = d.gate) != null && Md.here) && !d.solo && bn.push(...In("Your wallet", et(d.main), "ppp-addr-short"));
    const Sa = () => {
      if (!d.listening) return;
      const Y = Gr("copy-listening", "Copy", () => d.listening || "", "tiny", () => ne(c.snapshot()));
      bn.push(...In(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", gn(d.listening), "ppp-addr-short", Y));
    };
    if (d.linked || Sa(), d.listening && d.step !== "intro")
      if (d.linked)
        bn.push(...In("Credited to", `${et(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), Sa();
      else if (d.solo) {
        d.creditedTo && bn.push(...In("Credited to", `${et(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${et(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        bn.push(...In("Returns go to", d.gift ? Y : d.returnTo && !Yt(d.returnTo) ? Y.replace(gn(d.returnTo), d.returnTo) : Y, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else bn.push(...In("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((_d = d.gate) != null && _d.here)) {
      const Y = d.linkedListening.map((tt) => gn(tt) + (tt === d.listening ? " (this one)" : "")).join(", ");
      bn.push(...In(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const Y = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      bn.push(...In("Balance", `${rr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, Y));
    }
    const dr = d.entries.find((Y) => Y.kind === "play");
    dr && Je(), dr && bn.push(...In("Last paid song", `${Wn(dr)} → ${et(dr.recipient)}`, On[dr.status] || "")), Hr.replaceChildren(...bn), Hr.hidden = !bn.length;
    const mt = [], Rt = [], re = [], mn = [], b = rn(BigInt(((Pd = d.gate) == null ? void 0 : Pd.limits.playFee) ?? "300")), _ = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${rr(Hc)} STX to the song holder, plus a ${rr(b - Hc)} STX network fee.`, R = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (mt.push(S("p", "Pay artists as you listen.")), (Nd = d.gate) != null && Nd.radioUrl) {
          const tt = S("p");
          tt.append(dt("Open the pay-per-play radio →", d.gate.radioUrl)), mt.push(tt);
        }
        Rt.push(S("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const tt = [d.linked, ...d.others];
          mt.push(S("p", tt.length > 1 ? `This device has listening wallets for ${Xt(tt)}.` : `This device has a listening wallet for ${et(d.linked)}.`)), Rt.push(S("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), tt.slice(0, 3).forEach((xt, te) => re.push(Q(`Open ${et(xt)}`, () => Dn(xt), te === 0 ? "primary" : "")));
        } else
          mt.push(S("p", "Connect your wallet to pay artists as you listen.")), Rt.push(S("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        mt.push(S("p", `This device's listening wallet belongs to ${et(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Rt.push(S("p", `You are connected as ${et(d.main)}. Switch to the linked wallet to continue listening.`)), Rt.push(S("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), re.push(Q("Switch wallet", Fe, "primary"));
        break;
      case "not-invited":
        mt.push(S("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        mt.push(S("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        mt.push(S("p", "Every play counts for the song’s owner, on-chain.")), Rt.push(S("p", _)), Rt.push(S("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Rt.push(S("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (mt.push(S("p", `This device already has a listening wallet for ${Xt(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Rt.push(S("p", `Otherwise, set up a new listening wallet for ${et(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && Rt.push(S("p", `This is the listening wallet for ${et(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && Rt.push(S("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = l.liveGift();
        re.push(Q(Y ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${et(d.main)}` : "Start listening", () => void c.create(), "primary")), !Y && !d.solo && d.main && d.others.length && re.push(Q("Switch wallet", Fe)), !Y && d.solo && re.push(Q("I have a Stacks wallet", Fe)), re.push(Q("I already have a listening wallet", () => void c.unlock(!0))), Y && re.push(Q("Not now", () => l.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (mt.push(S("p", "Locked.", "ppp-mute")), re.push(Q("Unlock", () => void c.unlock(), "primary"))), d.standIn ? mn.push(Q("Use a different listening wallet", () => void yn().then((tt) => {
          tt === "stacks" && Fe();
        }), "quiet")) : mn.push(Q("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        mt.push(S("p", `Link to ${et(d.main)} · free`)), Rt.push(S("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Rt.push(S("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), re.push(Q(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        mt.push(S("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && mt.push(es(d.arrival)) : he(d) ? mt.push(S("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Ud = d.gift) != null && Ud.player ? mt.push(S("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? mt.push(S("p", "No plays left · add plays to keep counting", "ppp-bad")) : mt.push(S("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / b)).toLocaleString()} plays`)), d.entries.length && Rt.push(S("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && Rt.push(S("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m ? Rt.push(S("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? Rt.push(S("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (Rt.push(S("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Rt.push(S("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && re.push(Gr("copy-address", "Copy my address", () => d.listening || "", "primary", () => ne(c.snapshot())))) : Rt.push(S("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const tt = S("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          tt.append(dt("View", O(d.depositTxid))), mt.push(tt);
        } else d.allowance > 0n && !d.solo && !d.depositPending && re.push(Jr(d, `Deposit ${rr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        mt.push(S("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (mt.push(S("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), mt.push(cn(d))), (!d.solo || d.returnTo) && re.push(Q("Return excess", () => void c.returnFunds("excess"), "primary"), Q("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((Hd = d.giftStop) == null ? void 0 : Hd.reason) !== "off") {
          const tt = Math.min(d.session.playsLeft, d.playsLeft);
          mt.push(S("p", `${tt.toLocaleString()} plays left`, "ppp-ok")), Rt.push(S("p", _ + " The heart likes or unlikes from this wallet for 0.0002 STX.")), re.push(Q("Switch off", () => void c.switchOff()));
        } else
          mt.push(S("p", "Switch on music support to listen.", "ppp-mute")), re.push(Q("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && mt.push(S("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && mt.push(S("p", "Running low on plays", "ppp-warn")), d.depositPending ? mt.push(S("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && re.push(Jr(d, `Top up ${rr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const Y = d.step === "fund", tt = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      Y ? re.unshift(Q("Add plays", () => ct(), "primary")) : tt ? re.push(Q("Add plays", () => ct(), "primary")) : d.step === "ready" && mn.push(Q("Add plays", () => ct(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && Rt.push(S("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && Rt.push(cn(d)), Rt.push(Oi()), d.slot === 0 && d.step === "ready" && d.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = S("p", "New to Stacks? ", "ppp-mute");
      Y.append(dt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), mt.push(Y);
    }
    if (d.walletOutdated && Rt.push(S("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (mt.push(S("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), re.push(Q("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && mn.push(Q(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${et(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((Od = d.gift) != null && Od.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && mn.push(ts(d, "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && mn.push(Q("Lock", () => void c.lock(), "quiet")), j && !nt && mn.push(Q(Ht ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Ht = !Ht, ne(c.snapshot());
    }, "quiet")), [...re, ...mn].forEach((Y) => Y.disabled = R), R && (re.length = 0), !fe && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((Dd = d.gift) != null && Dd.player)) {
      const Y = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", tt = mt.at(0);
      d.step === "ready" && tt ? tt.append(S("span", ` · ${I(d.balance)} STX`, Y)) : mt.push(S("p", `Balance ${I(d.balance)} STX`, Y));
    }
    if (fe) {
      for (const xt of [...re, ...mn]) {
        const te = rI[xt.textContent ?? ""];
        te && (xt.textContent = te);
      }
      for (let xt = mt.length - 1; xt >= 0; xt--) _p(mt[xt].textContent) && Rt.unshift(...mt.splice(xt, 1));
      for (let xt = re.length - 1; xt >= 0; xt--) _p(re[xt].textContent) && mn.unshift(...re.splice(xt, 1));
      const Y = d.entries.some((xt) => xt.kind === "play"), tt = oI(d.step, { played: Y, arriving: d.depositPending });
      tt.length && mt.length && tt.shift(), mt.push(...tt.map((xt) => S("p", xt, "ppp-mute")));
    }
    if ((Fd = d.gift) != null && Fd.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const Y = S("p", "", "ppp-gift");
      Y.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && Y.append(" · ", d.gift.player.subtitle);
      const tt = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? S("span", " · plays on their way", "ppp-warn") : S("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      tt && Y.append(tt);
      const xt = (jd = mt.at(0)) == null ? void 0 : jd.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && xt && /STX/.test(xt.textContent ?? "") && xt.remove(), mt.unshift(Y), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          mt.splice(1, 0, S("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), ts(d, "primary"));
        else {
          const te = S("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          te.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), te.append(dt("Xverse", "https://www.xverse.app/download"), " and ", dt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), mt.splice(1, 0, te);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const Y = d.returnPlan, tt = S("div", "", "ppp-pick");
      tt.append(S("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const xt = S("ul", "", "ppp-gift-list");
      Y.steps.forEach((te, os) => {
        const as = te.kind === "gift" ? "the unused gift" : te.kind === "deposit" ? "what was added to it" : "the rest", xn = S("li");
        xn.append(S("span", `${os + 1}. ${rr(BigInt(te.send))} STX · ${as}`, "t"), S("span", te.to ? ` → ${et(te.to)}` : " → choose an address below", te.to ? "ppp-mute" : "ppp-warn")), xt.append(xn);
      }), tt.append(xt), Y.kept && tt.append(S("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((te) => !te.to) && tt.append(cn(d)), tt.append(Q(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), mt.push(tt);
    }
    const lt = Po(d), de = A ? lt : null, Ce = M(d, !!de), Qn = Ce === "gift" || Ce === "arriving" || Ce === "new", Ke = l.banner(f, { bare: !!de || Ce === "gift" || Ce === "arriving" }), Ys = be && (l.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? zt(be, l.pendingCode()) : [];
    de || (mt.unshift(...Ke), mt.push(...ur(d)), mt.unshift(...Ys)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && mt.unshift(S("p", `This is ${et(d.creditedTo)}'s listening wallet. Plays and likes count for ${et(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...mt);
    const hr = document.querySelector(".ppp-switch");
    if (hr) {
      const Y = h.latest(), tt = d.slot > 0, xt = ["fund", "ready", "over"].includes(d.step) && (tt || !!Y);
      if (hr.hidden = !xt, xt) {
        const te = (xn, Ea, Aa, Sl) => {
          const Ri = Q("", Sl, "ppp-tab");
          return Ri.setAttribute("aria-pressed", String(Aa)), Ri.append(S("span", xn, "tt"), S("span", Ea === void 0 ? "…" : `${Xn(Ea).toLocaleString()} plays`, "ts")), Ri.disabled = !!d.busy, Ri;
        }, os = tt ? ((zd = (Rd = d.gift) == null ? void 0 : Rd.player) == null ? void 0 : zd.title) ?? "Album" : Y.title, as = Q("View all albums" + (h.count() > 1 ? ` (${h.count()})` : ""), () => {
          const xn = document.querySelector(".ppp-shelf");
          xn && (xn.hidden = !1, xn.open = !xn.open, as.setAttribute("aria-expanded", String(xn.open)), xn.open && requestAnimationFrame(() => xn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        as.setAttribute("aria-expanded", String(!!((Gd = document.querySelector(".ppp-shelf")) != null && Gd.open))), hr.replaceChildren(
          te("🎧 My player", tt ? (Kd = d.likeFunds) == null ? void 0 : Kd.balance : d.balance, !tt, () => {
            tt && c.openAlbum(0);
          }),
          te("💿 " + os, tt ? d.balance : void 0, tt, () => {
            !tt && Y && c.openAlbum(Y.slot);
          }),
          as
        );
      }
    }
    const Xs = h.render(d), Ws = document.querySelector(".ppp-shelf");
    if (Ws) {
      Ws.hidden = !Xs;
      const Y = Ws.querySelector("summary");
      Y && (Y.textContent = h.count() > 0 ? `♪ My albums (${h.count()})` : "♪ My albums");
      const tt = Ws.querySelector(".ppp-shelf-body");
      Xs && tt && !tt.contains(Xs) && tt.replaceChildren(Xs);
    }
    const ss = l.renderFold(f);
    if (s(".ppp-gifts").hidden = !ss, ss && !s(".ppp-gift-body").contains(ss) && s(".ppp-gift-body").replaceChildren(ss), ss && ae) {
      ae = !1;
      const Y = s(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Zs = document.querySelector("#ppp .ppp-featured");
    if (Zs) {
      const Y = vt.length > 0 && d.slot === 0 && !((Vd = d.gift) != null && Vd.player) && d.step === "ready";
      Zs.hidden = !Y, Y && Zs.replaceChildren(S("p", "Albums in your player", "ppp-featured__h"), ...vt.map((tt) => {
        const xt = (qe == null ? void 0 : qe.id) === tt.id, te = Q("", () => oe(xt ? null : tt, !xt), "ppp-featured__a" + (xt ? " is-on" : "")), os = qr(tt).length;
        return te.append(S("b", tt.title), S("span", xt ? "Playing now · tap to go back to the radio" : `${tt.subtitle ? tt.subtitle + " · " : ""}${os} ${os === 1 ? "song" : "songs"}`)), te.setAttribute("aria-pressed", String(xt)), te.disabled = !!d.busy, te;
      }));
    }
    const is = document.querySelector("#ppp .ppp-yours");
    if (is) {
      const Y = d.solo && !!d.listening && d.slot === 0 && ["fund", "ready"].includes(d.step);
      is.hidden = !Y;
      const tt = is.querySelector(".ppp-yours-body");
      if (Y && tt && tt.getAttribute("data-for") !== d.listening) {
        tt.setAttribute("data-for", d.listening);
        const xt = (Sl, ...Ri) => {
          const qd = S("details", "", "ppp-yours-item");
          return qd.append(S("summary", Sl), ...Ri), qd;
        }, te = S("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        te.append(S("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const os = S("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), as = S("p");
        as.append(dt("Find a name at BNS One →", "https://bns.one"));
        const xn = S("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ea = S("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Aa = S("p");
        Aa.append(dt("See the giveaway →", "https://xtrata.xyz/giveaway")), tt.replaceChildren(
          xt("Give your player a name", te, os, S("p", d.listening, "ppp-addr-full"), Gr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => ne(c.snapshot())), as),
          xt("Link it to a wallet you already have", xn),
          xt("Bring a friend in", Ea, Aa)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Rt), s(".ppp-actions").replaceChildren(...re), s(".ppp-actions2").replaceChildren(...mn);
    const ml = d.busy || d.message || "", Id = s(".ppp-msg"), xl = ml && mt.some((Y) => (Y.textContent ?? "").startsWith(ml.replace(/[.✓\s]+$/, ""))) ? "" : ml, Ld = !xl && !d.error ? d.notice : p && !xl ? d.error : "";
    Id.textContent = xl || Ld, Id.classList.toggle("is-warn", !!Ld), s(".ppp-err").textContent = p ? "" : d.error;
    const kb = d.entries.filter((Y) => Y.kind === "play");
    s(".ppp-recent").hidden = !d.entries.length, s(".ppp-recent-list").replaceChildren(...kb.slice(0, 5).map((Y) => {
      const tt = S("li"), xt = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return tt.append(S("span", "", "d " + xt), S("span", Wn(Y), "t"), S("span", G(Y.created), "ppp-mute")), Y.txid && tt.append(dt("tx", O(Y.txid))), tt;
    })), s(".ppp-wallets").hidden = !(Hr.childElementCount || mn.length), s(".ppp-more").hidden = !Rt.length;
    const Cd = s(".ppp-history");
    Cd.hidden = !d.entries.length, d.entries.length && Je(), Cd.replaceChildren(S("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((Y) => {
      const tt = S("div", "", "ppp-row"), xt = Y.kind === "play" ? [S("span", Wn(Y), "ppp-song"), S("span", ` · ${rr(BigInt(Y.amount))} STX to ${et(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [S("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${Wn(Y)}`, "ppp-song"), S("span", ` · for ${d.linked ? et(d.linked) : "this listening wallet"}`, "ppp-mute")] : [S("span", `Returned ${rr(BigInt(Y.amount))} STX`, "ppp-song"), S("span", ` to ${et(Y.recipient)}`, "ppp-mute")];
      return tt.append(
        S("span", $n[Y.status] || Y.status, "ppp-status " + (On[Y.status] || "")),
        ...xt,
        S("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && tt.append(dt("tx ↗", O(Y.txid))), tt;
    })), U == null || U.render(de ? Zn(d, de, [...Ys, ...Ke]) : null), No(d, de), K(d, !!de, Qn ? [...Ys, ...Ke] : Ys, Ce), pt.isOpen() && pt.refresh(), Nr();
    const Td = (lt == null ? void 0 : lt.mode) === "open" ? null : on(d);
    L == null || L.render((lt == null ? void 0 : lt.mode) === "open" ? Zn(d, lt, []) : Td ? { ...Zn(d, { mode: "open", player: Td }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function Po(f) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((d = f.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && Et({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const m = l.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const x = ot();
    return x && (f.step === "locked" || yt && f.step === "loading") ? { mode: "locked", player: x.player } : null;
  }
  function No(f, m) {
    const x = document.querySelector(".ppp-skin");
    if (!x) return;
    const d = !!m && (!!f.busy || f.armed);
    if (x.hidden = !d, !d || !m) {
      x.replaceChildren();
      return;
    }
    const p = df(m.player.cover), E = p ? S("img", "ppp-skin__art") : S("span", "ppp-skin__art ppp-skin__art--none", "♪");
    p && (E.src = p, E.alt = "");
    const N = S("span", "ppp-skin__t");
    N.append(S("b", "", m.player.title), S("span", "", m.mode === "arrive" && m.from ? `A gift from ${m.from}` : m.player.subtitle || "Your album")), x.replaceChildren(E, N);
  }
  function Zn(f, m, x) {
    var nt, j, ut, J, at;
    const d = !!f.busy || f.armed, p = [...x];
    f.depositPending && f.arrival && p.push(es(f.arrival)), f.error ? p.push(S("p", f.error, f.error === Fc ? "ppp-warn" : "ppp-bad")) : f.message && !d ? p.push(S("p", f.message, "ppp-cyan")) : f.notice && p.push(S("p", f.notice, "ppp-warn")), m.mode === "open" && Oe && ((nt = f.likeFunds) != null && nt.album) && f.likeFunds.low && !f.likeFunds.pending && p.push(S("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let E = "Kept on this device with Face ID or your passkey. No app or account needed.", N = null, D = null;
    if (m.mode === "locked")
      N = { label: "Continue listening", run: () => {
        yt = ot(), c.unlock();
      } }, D = { label: "Use a different passkey", run: () => {
        yt = null, c.unlock(!0);
      } };
    else if (m.mode === "arrive")
      if (f.step === "intro" && ec(Ft) && Ft.album === m.player.id) {
        const ft = window.XtrataRadio, Jt = qr(m.player)[0], fe = Ft.phase === "playing";
        N = { label: fe && !!((ut = (j = ft == null ? void 0 : ft.getState) == null ? void 0 : j.call(ft)) != null && ut.playing) ? "Pause" : fe ? "Carry on" : "Play the first song", run: () => {
          var He, wn;
          fe ? (He = ft == null ? void 0 : ft.playPause) == null || He.call(ft) : Jt && ((wn = ft == null ? void 0 : ft.playToken) == null || wn.call(ft, Jt.id));
        } }, D = { label: "Make my player and hear it all", run: () => void c.create() }, E = "The first song is free. Nothing to set up yet.";
      } else if (f.step === "intro") {
        const ft = Ft.phase === "done" && Ft.album === m.player.id;
        ft && !p.length && p.push(S("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), N = { label: ft ? "Keep listening" : "Open album", run: () => void c.create() }, D = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else f.step === "locked" ? (N = { label: "Open album", run: () => void c.unlock() }, D = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : f.step === "unsupported" ? p.push(S("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : p.length || p.push(S("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: m.mode === "arrive" && f.step === "intro" ? 1 : void 0,
      plays: m.mode === "open" ? f.balance === void 0 ? null : f.giftPlays : void 0,
      playsComing: f.depositPending,
      status: p,
      primary: N,
      secondary: D,
      hint: N ? E : void 0,
      asking: d,
      busy: !!f.busy,
      myPlays: Mr(f),
      topUps: uc,
      canMake: !!((at = (J = f.gate) == null ? void 0 : J.gifts) != null && at.admin)
    };
  }
  const Cn = document.getElementById("findBox"), Ae = document.getElementById("findBody"), Pr = Cn && Ae ? AI(Ae, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : Promise.reject(new Error("catalogue unavailable"))).then((f) => xI(f == null ? void 0 : f.tracks, (m, x) => ({ title: bp(m, ue(x.title) ? "" : x.title), artist: yp(m, x.artist || "") }))),
    play: (f) => {
      var m, x;
      (x = (m = window.XtrataRadio) == null ? void 0 : m.playToken) == null || x.call(m, f);
    },
    current: () => {
      var m, x, d, p;
      const f = Number((p = (d = (x = (m = window.XtrataRadio) == null ? void 0 : m.getState) == null ? void 0 : x.call(m)) == null ? void 0 : d.nowPlaying) == null ? void 0 : p.tokenId);
      return Number.isSafeInteger(f) ? f : null;
    },
    locked: () => {
      var f;
      return !!((f = c.snapshot().albumLock) != null && f.locked);
    },
    explicit: (f) => {
      var m, x;
      return !!((x = (m = window.XtrataRadio) == null ? void 0 : m.isExplicit) != null && x.call(m, f));
    }
  }) : null;
  Cn == null || Cn.addEventListener("toggle", () => {
    Cn.open && (Pr == null || Pr.load());
  });
  let ji = "";
  const Nr = () => {
    var m, x, d, p, E;
    if (!Pr || !(Cn != null && Cn.open)) return;
    const f = `${!!((m = c.snapshot().albumLock) != null && m.locked)}|${((E = (p = (d = (x = window.XtrataRadio) == null ? void 0 : x.getState) == null ? void 0 : d.call(x)) == null ? void 0 : p.nowPlaying) == null ? void 0 : E.tokenId) ?? ""}`;
    f !== ji && (ji = f, Pr.refresh());
  }, ns = /* @__PURE__ */ new Map();
  let Ur = !1;
  const qs = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((m) => {
      const x = m == null ? void 0 : m.nowPlaying;
      if (x && Number.isSafeInteger(Number(x.tokenId)) && ns.set(Number(x.tokenId), { title: x.title || void 0, artist: x.artist || void 0 }), Nr(), ec(Ft)) {
        const d = !!(m != null && m.playing);
        Ze({ kind: "now", track: x && x.tokenId != null ? String(x.tokenId) : null, playing: d, at: Date.now() }), d !== Ur && (Ur = d, ne(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!qs()) {
    const f = setInterval(() => {
      qs() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const m = f.detail;
    if (ec(Ft) && Ze({ kind: "listened", at: Date.now() }), m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      Je();
      const x = an(m.song, ns.get(m.song));
      c.onListened({ song: m.song, id: m.id, title: x.title || void 0, artist: x.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const CI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", TI = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, BI = () => TI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, MI = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, _I = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', vb = class {
  constructor(t) {
    mv(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && DS(t), this.callback(rl(t));
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
    var r, s, i, o, a, c, l, h, u, w;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (h = (l = t.googlePlayStoreUrl) !== null && l !== void 0 ? l : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (w = (u = this.getBrowserUrl(t)) !== null && u !== void 0 ? u : t.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(t);
  }
  render() {
    const t = BI(), e = MI(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return kt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, kt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), kt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, kt("div", { class: "flex flex-col space-y-[10px]" }, kt("div", { class: "flex items-center" }, kt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), kt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, kt("span", { class: "sr-only" }, "Close popup"), kt("img", { src: CI }))), r ? kt("p", null, "Select the wallet you want to connect to.") : kt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && kt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && kt("div", { class: "mt-6" }, kt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), kt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => kt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, kt("div", { class: "aspect-square basis-9 overflow-hidden" }, kt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), kt("div", { class: "flex-1" }, kt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && kt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), kt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && kt("div", { class: "mt-6" }, r ? kt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : kt("div", { class: "mb-5 flex justify-between" }, kt("p", { class: "text-sm font-medium" }, "Recommended wallets"), kt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, kt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, kt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), kt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), kt("p", null, "What is a wallet? ", kt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), kt("ul", { class: "space-y-3" }, n.map((i) => kt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, kt("div", { class: "aspect-square basis-9 overflow-hidden" }, kt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), kt("div", { class: "flex-1" }, kt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && kt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && kt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return tv(this);
  }
};
vb.style = _I;
const PI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: vb
}, Symbol.toStringTag, { value: "Module" }));
